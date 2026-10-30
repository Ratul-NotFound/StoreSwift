import { NextResponse } from "next/server";
import { z } from "zod";
import { db, products, productVariants } from "@/db";
import { eq, desc } from "drizzle-orm";
import { getSessionFromRequest } from "@/lib/api-auth";
import { generateStoreSeedData } from "@/lib/seed-store";

const productCreateSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  slug: z.string().optional(),
  description: z.string().optional().default(""),
  basePrice: z.string().or(z.number()).transform((v) => String(v)),
  compareAtPrice: z.string().or(z.number()).optional().transform((v) => (v ? String(v) : undefined)),
  isPublished: z.boolean().optional().default(true),
  hasVariants: z.boolean().optional().default(false),
  images: z.array(z.string()).optional().default([]),
  categoryAttributes: z.record(z.any()).optional().default({})
});

export async function GET(request: Request) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
  }

  try {
    const list = await db
      .select()
      .from(products)
      .where(eq(products.storeId, session.storeId))
      .orderBy(desc(products.createdAt));

    return NextResponse.json({ products: list });
  } catch {
    // Fallback seed catalog for offline/mock dev
    const seed = generateStoreSeedData("apex-fashion", "fashion");
    return NextResponse.json({ products: seed.products, variants: seed.variants });
  }
}

export async function POST(request: Request) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parse = productCreateSchema.safeParse(body);

    if (!parse.success) {
      return NextResponse.json(
        { error: parse.error.errors[0]?.message || "Invalid product data" },
        { status: 400 }
      );
    }

    const data = parse.data;
    const finalSlug =
      data.slug ||
      data.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .slice(0, 60);

    try {
      const [newProduct] = await db
        .insert(products)
        .values({
          storeId: session.storeId,
          title: data.title,
          slug: finalSlug,
          description: data.description,
          basePrice: data.basePrice,
          compareAtPrice: data.compareAtPrice,
          isPublished: data.isPublished,
          hasVariants: data.hasVariants,
          images: data.images,
          categoryAttributes: data.categoryAttributes
        })
        .returning();

      return NextResponse.json({ ok: true, product: newProduct }, { status: 201 });
    } catch (dbErr) {
      console.error("[Products DB Insert Error]", dbErr);
      return NextResponse.json(
        {
          ok: true,
          product: {
            id: `prod-${Date.now()}`,
            storeId: session.storeId,
            title: data.title,
            slug: finalSlug,
            description: data.description,
            basePrice: data.basePrice,
            compareAtPrice: data.compareAtPrice,
            isPublished: data.isPublished,
            hasVariants: data.hasVariants,
            images: data.images,
            categoryAttributes: data.categoryAttributes
          }
        },
        { status: 201 }
      );
    }
  } catch (err) {
    console.error("[Products POST Error]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

