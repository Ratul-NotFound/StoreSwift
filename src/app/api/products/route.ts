import { NextResponse } from "next/server";
import { z } from "zod";
import { db, products, productVariants, stores } from "@/db";
import { eq, desc, count } from "drizzle-orm";
import { getSessionFromRequest, canAccessStore } from "@/lib/api-auth";
import { checkProductLimit, isValidPlan, type PlanId } from "@/lib/plan-limits";
import { devStore } from "@/lib/dev-store";
import { fastCache } from "@/lib/cache";

const productCreateSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  slug: z.string().optional(),
  description: z.string().optional().default(""),
  basePrice: z.string().or(z.number()).optional(),
  price: z.string().or(z.number()).optional(),
  compareAtPrice: z.string().or(z.number()).optional(),
  comparePrice: z.string().or(z.number()).optional(),
  stock: z.string().or(z.number()).optional().default(10),
  sku: z.string().optional().default(""),
  category: z.string().optional().default("General"),
  storeSlug: z.string().optional(),
  isPublished: z.boolean().optional().default(true),
  images: z.array(z.string()).optional().default([]),
  imageUrl: z.string().optional()
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const storeSlug = url.searchParams.get("storeSlug");
  const searchQuery = url.searchParams.get("search") || url.searchParams.get("q");
  const session = getSessionFromRequest(request);

  const targetSlug = storeSlug || session?.storeId || "apex-fashion";
  const cacheKey = searchQuery ? `products:${targetSlug}:q:${searchQuery}` : `products:${targetSlug}`;
  const clientEtag = request.headers.get("if-none-match");

  // 1. Check in-memory fastCache (sub-millisecond retrieval)
  const cached = fastCache.getWithETag<{ ok: boolean; products: any[] }>(cacheKey);
  if (cached) {
    if (clientEtag && clientEtag === cached.etag) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          ETag: cached.etag,
          "Cache-Control": "public, s-maxage=15, stale-while-revalidate=59",
          "X-Cache": "HIT",
        },
      });
    }
    return NextResponse.json(cached.value, {
      headers: {
        ETag: cached.etag,
        "Cache-Control": "public, s-maxage=15, stale-while-revalidate=59",
        "X-Cache": "HIT",
      },
    });
  }

  let finalProducts: any[] = [];

  try {
    let storeId = session?.storeId;
    if (storeSlug) {
      const s = await Promise.race([
        db.query.stores.findFirst({
          where: eq(stores.slug, storeSlug),
          columns: { id: true }
        }),
        new Promise<any>((_, reject) => setTimeout(() => reject(new Error("DB timeout")), 800))
      ]);
      if (s) storeId = s.id;
    }

    if (storeId) {
      const list = await db
        .select()
        .from(products)
        .where(eq(products.storeId, storeId))
        .orderBy(desc(products.createdAt));

      if (list.length > 0) {
        finalProducts = list.map((p) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          description: p.description || "",
          price: parseFloat(p.basePrice),
          comparePrice: p.compareAtPrice ? parseFloat(p.compareAtPrice) : undefined,
          stock: 25,
          sku: p.slug.toUpperCase().slice(0, 8),
          category: "General",
          imageUrl: Array.isArray(p.images) && p.images[0] ? String(p.images[0]) : "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800",
          status: p.isPublished ? "active" : "out_of_stock",
          createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString(),
          isDropship: p.isDropship,
        }));
      }
    }
  } catch {
    // DB unreachable — fall through to devStore
  }

  if (finalProducts.length === 0) {
    finalProducts = searchQuery
      ? devStore.searchProducts(targetSlug, searchQuery)
      : devStore.getProducts(targetSlug);
  }

  const payload = { ok: true, products: finalProducts };
  fastCache.set(cacheKey, payload, 25000); // 25s TTL
  const entry = fastCache.getWithETag(cacheKey);

  return NextResponse.json(payload, {
    headers: {
      ETag: entry?.etag || "W/default",
      "Cache-Control": "public, s-maxage=15, stale-while-revalidate=59",
      "X-Cache": "MISS",
    },
  });
}

export async function POST(request: Request) {
  const session = getSessionFromRequest(request);
  const body = await request.json();
  const parse = productCreateSchema.safeParse(body);

  if (!parse.success) {
    return NextResponse.json(
      { error: parse.error.errors[0]?.message || "Invalid product data" },
      { status: 400 }
    );
  }

  const data = parse.data;
  const rawPrice = data.price ?? data.basePrice ?? 100;
  const numPrice = typeof rawPrice === "string" ? parseFloat(rawPrice) : rawPrice;
  const rawCompare = data.comparePrice ?? data.compareAtPrice;
  const numCompare = rawCompare ? (typeof rawCompare === "string" ? parseFloat(rawCompare) : rawCompare) : undefined;
  const numStock = typeof data.stock === "string" ? parseInt(data.stock, 10) || 0 : data.stock;

  const requestedSlug = data.storeSlug || session?.slug || session?.storeId || "apex-fashion";
  if (session && !canAccessStore(session, requestedSlug)) {
    return NextResponse.json(
      { error: "Forbidden: You do not have permission to manage products for this store." },
      { status: 403 }
    );
  }
  const storeSlug = (session && session.role !== "super_admin") ? (session.slug || session.storeId || requestedSlug) : requestedSlug;
  const targetStore = devStore.ensureStore(storeSlug);

  // ── Plan Limit Enforcement ──
  const plan = (targetStore.plan || session?.plan || "free") as PlanId;
  const currentCount = devStore.getProducts(storeSlug).length;
  const limitCheck = checkProductLimit(plan, currentCount);

  if (!limitCheck.allowed) {
    return NextResponse.json(
      {
        error: `Product limit reached (${limitCheck.limit} max on your ${plan} plan). Upgrade to add more products.`,
        upgrade: true,
        currentCount,
        limit: limitCheck.limit,
        plan,
      },
      { status: 403 }
    );
  }

  const finalSlug =
    data.slug ||
    data.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .slice(0, 60);

  const imgUrl = data.imageUrl || (data.images && data.images[0]) || "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800";

  // 1. Add to devStore
  const newProduct = devStore.addProduct({
    storeId: targetStore.id,
    storeSlug: targetStore.slug,
    title: data.title,
    slug: finalSlug,
    description: data.description,
    price: numPrice,
    comparePrice: numCompare,
    stock: numStock,
    sku: data.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
    category: data.category || "General",
    imageUrl: imgUrl,
    status: numStock === 0 ? "out_of_stock" : "active",
  });

  // 2. Also insert into PostgreSQL if DB is connected
  try {
    const [dbProduct] = await db
      .insert(products)
      .values({
        storeId: session?.storeId || targetStore.id,
        title: data.title,
        slug: `${finalSlug}-${Date.now().toString(36)}`,
        description: data.description,
        basePrice: String(numPrice),
        compareAtPrice: numCompare ? String(numCompare) : undefined,
        isPublished: true,
        hasVariants: false,
        images: [imgUrl],
        categoryAttributes: {},
      })
      .returning();

    // Insert default variant
    if (dbProduct) {
      await db.insert(productVariants).values({
        storeId: session?.storeId || targetStore.id,
        productId: dbProduct.id,
        title: "Standard",
        sku: data.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
        price: String(numPrice),
        inventoryQuantity: numStock,
        options: {},
      });
    }
  } catch {
    // Non-fatal if DB not running
  }

  // Invalidate cached product catalogs for this store
  fastCache.deletePrefix(`products:${storeSlug}`);

  return NextResponse.json({ ok: true, product: newProduct }, { status: 201 });
}
