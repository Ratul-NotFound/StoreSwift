import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { dropshipListings, platformProducts, stores, subscriptions } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getSessionFromRequest } from "@/lib/api-auth";
import { assertFeature, getPlanConfig } from "@/lib/plan-limits";

// ─── GET: merchant's dropship listings ───────────────────────────────────────

export async function GET(request: Request) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const listings = await db
      .select({
        id:               dropshipListings.id,
        storeId:          dropshipListings.storeId,
        platformProductId: dropshipListings.platformProductId,
        sellPrice:        dropshipListings.sellPrice,
        isActive:         dropshipListings.isActive,
        listedAt:         dropshipListings.listedAt,
        // Join platform product data
        productTitle:     platformProducts.title,
        productCategory:  platformProducts.category,
        minimumPrice:     platformProducts.minimumPrice,
        suggestedPrice:   platformProducts.suggestedPrice,
        stockQuantity:    platformProducts.stockQuantity,
        productImages:    platformProducts.images,
        productStatus:    platformProducts.status,
      })
      .from(dropshipListings)
      .innerJoin(platformProducts, eq(dropshipListings.platformProductId, platformProducts.id))
      .where(eq(dropshipListings.storeId, session.storeId));

    const enriched = listings.map((l) => ({
      ...l,
      margin: parseFloat(l.sellPrice) - parseFloat(l.minimumPrice),
      marginPct: Math.round(
        ((parseFloat(l.sellPrice) - parseFloat(l.minimumPrice)) / parseFloat(l.minimumPrice)) * 100
      ),
    }));

    return NextResponse.json({ listings: enriched });
  } catch (err) {
    console.error("[GET /api/dropship]", err);
    return NextResponse.json({ listings: [] });
  }
}

// ─── POST: create or update a dropship listing ────────────────────────────────

const CreateListingSchema = z.object({
  platformProductId: z.string().uuid(),
  sellPrice:         z.number().positive(),
});

export async function POST(request: Request) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Check plan allows dropshipping
    const sub = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.storeId, session.storeId),
    });
    const plan = (sub?.plan ?? "free") as Parameters<typeof assertFeature>[0];

    try {
      assertFeature(plan, "dropshipping");
    } catch (e: any) {
      return NextResponse.json({ error: e.message, upgrade: true }, { status: 403 });
    }

    const body = await request.json();
    const parse = CreateListingSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json(
        { error: parse.error.errors[0]?.message },
        { status: 400 }
      );
    }

    const { platformProductId, sellPrice } = parse.data;

    // Verify platform product exists and is active
    const product = await db.query.platformProducts.findFirst({
      where: and(
        eq(platformProducts.id, platformProductId),
        eq(platformProducts.status, "active")
      ),
    });

    if (!product) {
      return NextResponse.json({ error: "Platform product not found or inactive" }, { status: 404 });
    }

    // Enforce minimum price
    const minPrice = parseFloat(product.minimumPrice);
    if (sellPrice < minPrice) {
      return NextResponse.json(
        {
          error: `Sell price must be at least ৳${minPrice} (minimum set by platform)`,
          minimumPrice: minPrice,
        },
        { status: 400 }
      );
    }

    // Upsert listing
    const [listing] = await db
      .insert(dropshipListings)
      .values({
        storeId:           session.storeId,
        platformProductId,
        sellPrice:         sellPrice.toFixed(2),
        isActive:          true,
      })
      .onConflictDoUpdate({
        target: [dropshipListings.storeId, dropshipListings.platformProductId],
        set: {
          sellPrice: sellPrice.toFixed(2),
          isActive:  true,
          updatedAt: new Date(),
        },
      })
      .returning();

    return NextResponse.json({
      ok: true,
      listing: {
        ...listing,
        margin: sellPrice - minPrice,
        product: { title: product.title, minimumPrice: product.minimumPrice },
      },
    }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/dropship]", err);
    return NextResponse.json({ error: "Failed to create listing" }, { status: 500 });
  }
}

// ─── DELETE: remove a dropship listing ───────────────────────────────────────

export async function DELETE(request: Request) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const listingId = url.searchParams.get("id");

  if (!listingId) {
    return NextResponse.json({ error: "Missing listing id" }, { status: 400 });
  }

  try {
    await db
      .update(dropshipListings)
      .set({ isActive: false, updatedAt: new Date() })
      .where(
        and(
          eq(dropshipListings.id, listingId),
          eq(dropshipListings.storeId, session.storeId)  // Tenant isolation
        )
      );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/dropship]", err);
    return NextResponse.json({ error: "Failed to remove listing" }, { status: 500 });
  }
}

