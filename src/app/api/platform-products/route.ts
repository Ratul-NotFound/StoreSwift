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
      return NextResponse.json({ ok: true, products, total: products.length });
    }
  } catch {
    // Non-fatal
  }

  // devStore platform products
  let list = devStore.getPlatformProducts();
  if (category) list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  if (search) list = list.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));

  return NextResponse.json({ ok: true, products: list, total: list.length });
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
  const isDev = process.env.NODE_ENV !== "production";

  if (!isDev && (!session || session.role !== "super_admin")) {
    return NextResponse.json({ error: "Super-admin access required" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parse = CreatePlatformProductSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ error: parse.error.errors[0]?.message }, { status: 400 });
    }

    const { minimumPrice, suggestedPrice, description, category, title, stockQuantity, images } = parse.data;

    // 1. Add to devStore
    const newPP = devStore.addPlatformProduct({
      title,
      description: description || "",
      category,
      minPrice: minimumPrice,
      suggestedPrice,
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
        minimumPrice: minimumPrice.toFixed(2),
        suggestedPrice: suggestedPrice.toFixed(2),
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
