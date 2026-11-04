import { NextResponse } from "next/server";
import { z } from "zod";
import { db, products, productVariants, stores } from "@/db";
import { eq, desc, count } from "drizzle-orm";
import { getSessionFromRequest } from "@/lib/api-auth";
import { checkProductLimit, isValidPlan, type PlanId } from "@/lib/plan-limits";
import { devStore } from "@/lib/dev-store";

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
  const session = getSessionFromRequest(request);

  const targetSlug = storeSlug || session?.storeId || "apex-fashion";

  try {
    let storeId = session?.storeId;
    if (storeSlug) {
      const s = await db.query.stores.findFirst({
        where: eq(stores.slug, storeSlug),
        columns: { id: true }
      });
      if (s) storeId = s.id;
    }

    if (storeId) {
      const list = await db
        .select()
        .from(products)
        .where(eq(products.storeId, storeId))
        .orderBy(desc(products.createdAt));

      if (list.length > 0) {
        const enriched = list.map((p) => ({
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
        return NextResponse.json({ ok: true, products: enriched });
      }
    }
  } catch {
    // DB unreachable — fall through to devStore
  }

  // devStore products
  const dsProducts = devStore.getProducts(targetSlug);
  return NextResponse.json({ ok: true, products: dsProducts });
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

  const storeSlug = data.storeSlug || session?.storeId || "apex-fashion";
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

  return NextResponse.json({ ok: true, product: newProduct }, { status: 201 });
}
