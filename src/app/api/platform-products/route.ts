import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { platformProducts } from "@/db/schema";
import { eq, desc, like, and } from "drizzle-orm";
import { getSessionFromRequest } from "@/lib/api-auth";
import { devStore } from "@/lib/dev-store";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  const search   = url.searchParams.get("q");

  let rawList: any[] = [];

  try {
    const filters = [eq(platformProducts.status, "active")];
    if (category) filters.push(eq(platformProducts.category, category));
    if (search) filters.push(like(platformProducts.title, `%${search}%`));

    const products = await db
      .select()
      .from(platformProducts)
      .where(and(...filters))
      .orderBy(desc(platformProducts.createdAt));

    if (products.length > 0) {
      rawList = products;
    }
  } catch {
    // Non-fatal
  }

  if (rawList.length === 0) {
    let list = devStore.getPlatformProducts();
    if (category) list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    if (search) list = list.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));
    rawList = list;
  }

  const normalized = rawList.map((p: any) => {
    const rawMin = p.minPrice !== undefined ? Number(p.minPrice) : (p.minimumPrice ? parseFloat(p.minimumPrice) : 0);
    const minVal = Math.round((isNaN(rawMin) ? 0 : rawMin) * 100) / 100;
    const imgList = Array.isArray(p.images) && p.images.length > 0 ? p.images : (p.imageUrl ? [p.imageUrl] : []);
    const mainImg = imgList[0] || p.imageUrl || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800";

    return {
      id: p.id,
      title: p.title,
      description: p.description || "",
      category: p.category,
      minPrice: minVal,
      minimumPrice: String(minVal),
      suggestedPrice: p.suggestedPrice !== undefined ? Math.round(Number(p.suggestedPrice) * 100) / 100 : Math.round(minVal * 1.5 * 100) / 100,
      stockQuantity: p.stockQuantity ?? 100,
      sku: p.sku || `DS-${String(p.id).slice(-6).toUpperCase()}`,
      images: imgList.length > 0 ? imgList : [mainImg],
      imageUrl: mainImg,
      status: p.status || "active",
      createdAt: p.createdAt || new Date().toISOString(),
    };
  });

  return NextResponse.json({ ok: true, products: normalized, total: normalized.length });
}

const CreatePlatformProductSchema = z.object({
  title:          z.string().min(2).max(255),
  description:    z.string().max(2000).optional().default(""),
  category:       z.string().min(2).max(80),
  images:         z.array(z.string()).default([]),
  minimumPrice:   z.number().positive(),
  suggestedPrice: z.number().positive(),
  stockQuantity:  z.number().int().min(0).default(100),
  sku:            z.string().max(100).optional(),
});

export async function POST(request: Request) {
  const session = getSessionFromRequest(request);

  if (!session || session.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden: Super admin authentication required." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parse = CreatePlatformProductSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ error: parse.error.errors[0]?.message }, { status: 400 });
    }

    const { minimumPrice, suggestedPrice, description, category, title, stockQuantity, images } = parse.data;
    const cleanMin = Math.round(minimumPrice * 100) / 100;
    const cleanSuggested = Math.round(suggestedPrice * 100) / 100;

    // 1. Add to devStore
    const newPP = devStore.addPlatformProduct({
      title,
      description: description || "",
      category,
      minPrice: cleanMin,
      suggestedPrice: cleanSuggested,
      stockQuantity,
      imageUrl: images[0] || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800",
      status: "active",
    });

    // 2. Try DB
    try {
      await db.insert(platformProducts).values({
        title,
        description,
        category,
        minimumPrice: cleanMin.toFixed(2),
        suggestedPrice: cleanSuggested.toFixed(2),
        stockQuantity,
        images,
        status: "active",
      });
    } catch {
      // Non-fatal
    }

    return NextResponse.json({ ok: true, product: newPP }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/platform-products]", err);
    return NextResponse.json({ error: "Failed to create platform product" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = getSessionFromRequest(request);

  if (!session || session.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden: Super admin authentication required." }, { status: 403 });
  }

  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Product id is required" }, { status: 400 });
  }

  devStore.deletePlatformProduct(id);

  try {
    await db.delete(platformProducts).where(eq(platformProducts.id, id));
  } catch {
    // Non-fatal
  }

  return NextResponse.json({ ok: true, id });
}
