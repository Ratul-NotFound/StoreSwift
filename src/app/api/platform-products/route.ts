import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { platformProducts } from "@/db/schema";
import { eq, desc, like, and } from "drizzle-orm";
import { getSessionFromRequest } from "@/lib/api-auth";

// ─── GET: list platform products (any authenticated merchant can browse) ───────

export async function GET(request: Request) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  const search   = url.searchParams.get("q");
  const limit    = Math.min(parseInt(url.searchParams.get("limit") ?? "20"), 100);

  try {
    const filters = [eq(platformProducts.status, "active")];

    if (category) {
      filters.push(eq(platformProducts.category, category));
    }
    if (search) {
      filters.push(like(platformProducts.title, `%${search}%`));
    }

    const products = await db
      .select()
      .from(platformProducts)
      .where(and(...filters))
      .orderBy(desc(platformProducts.createdAt))
      .limit(limit);

    return NextResponse.json({ products, total: products.length });
  } catch (err) {
    console.error("[GET /api/platform-products]", err);
    // Fallback: return seeded demo data
    return NextResponse.json({
      products: DEMO_PLATFORM_PRODUCTS,
      total: DEMO_PLATFORM_PRODUCTS.length,
    });
  }
}

// ─── POST: create platform product (super-admin only) ─────────────────────────

const CreatePlatformProductSchema = z.object({
  title:          z.string().min(2).max(255),
  description:    z.string().max(2000).optional(),
  category:       z.string().min(2).max(80),
  images:         z.array(z.string().url()).default([]),
  minimumPrice:   z.number().positive(),
  suggestedPrice: z.number().positive(),
  stockQuantity:  z.number().int().min(0),
  sku:            z.string().max(100).optional(),
});

export async function POST(request: Request) {
  const session = getSessionFromRequest(request);
  if (!session || session.role !== "super_admin") {
    return NextResponse.json({ error: "Super-admin access required" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parse = CreatePlatformProductSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json(
        { error: parse.error.errors[0]?.message },
        { status: 400 }
      );
    }

    const { minimumPrice, suggestedPrice, ...rest } = parse.data;

    if (suggestedPrice < minimumPrice) {
      return NextResponse.json(
        { error: "Suggested price must be >= minimum price" },
        { status: 400 }
      );
    }

    const [product] = await db
      .insert(platformProducts)
      .values({
        ...rest,
        minimumPrice:   minimumPrice.toFixed(2),
        suggestedPrice: suggestedPrice.toFixed(2),
        status: "active",
      })
      .returning();

    return NextResponse.json({ ok: true, product }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/platform-products]", err);
    return NextResponse.json({ error: "Failed to create platform product" }, { status: 500 });
  }
}

// ─── DEMO FALLBACK DATA ───────────────────────────────────────────────────────

const DEMO_PLATFORM_PRODUCTS = [
  {
    id: "pp-demo-1",
    title: "Premium Cotton Round-Neck T-Shirt",
    category: "Fashion",
    minimumPrice: "280.00",
    suggestedPrice: "450.00",
    stockQuantity: 2400,
    status: "active",
    images: ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&auto=format&fit=crop&q=80"],
    sku: "PP-TSHIRT-001",
    createdAt: new Date().toISOString(),
  },
  {
    id: "pp-demo-2",
    title: "Slim Fit Stretch Denim Jeans",
    category: "Fashion",
    minimumPrice: "680.00",
    suggestedPrice: "950.00",
    stockQuantity: 1850,
    status: "active",
    images: ["https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&auto=format&fit=crop&q=80"],
    sku: "PP-DENIM-001",
    createdAt: new Date().toISOString(),
  },
  {
    id: "pp-demo-3",
    title: "Wireless Noise-Cancelling Headphones",
    category: "Electronics",
    minimumPrice: "2200.00",
    suggestedPrice: "3200.00",
    stockQuantity: 420,
    status: "active",
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80"],
    sku: "PP-HEADPHONE-001",
    createdAt: new Date().toISOString(),
  },
  {
    id: "pp-demo-4",
    title: "Multi-Vitamin Glow Serum 30ml",
    category: "Beauty",
    minimumPrice: "350.00",
    suggestedPrice: "580.00",
    stockQuantity: 900,
    status: "active",
    images: ["https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&auto=format&fit=crop&q=80"],
    sku: "PP-SERUM-001",
    createdAt: new Date().toISOString(),
  },
];

