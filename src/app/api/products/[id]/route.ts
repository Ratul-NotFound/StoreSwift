import { NextResponse } from "next/server";
import { db, products } from "@/db";
import { eq } from "drizzle-orm";
import { getSessionFromRequest, canAccessStore } from "@/lib/api-auth";
import { devStore } from "@/lib/dev-store";
import { fastCache } from "@/lib/cache";

export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    const session = getSessionFromRequest(request);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Session required to modify products." },
        { status: 401 }
      );
    }

    const existing = devStore.getProduct(id);

    if (existing && !canAccessStore(session, existing.storeSlug)) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to modify this product." },
        { status: 403 }
      );
    }

    const body = await request.json();

    const rawPrice = body.price ?? body.basePrice;
    const numPrice = rawPrice !== undefined ? (typeof rawPrice === "string" ? parseFloat(rawPrice) : rawPrice) : undefined;
    if (numPrice !== undefined && (isNaN(numPrice) || numPrice < 0)) {
      return NextResponse.json({ error: "Product price cannot be negative" }, { status: 400 });
    }

    const rawCompare = body.comparePrice ?? body.compareAtPrice;
    const numCompare = rawCompare !== undefined ? (typeof rawCompare === "string" ? parseFloat(rawCompare) : rawCompare) : undefined;
    if (numCompare !== undefined && (isNaN(numCompare) || numCompare < 0)) {
      return NextResponse.json({ error: "Compare price cannot be negative" }, { status: 400 });
    }

    let numStock = body.stock !== undefined ? (typeof body.stock === "string" ? parseInt(body.stock, 10) || 0 : body.stock) : undefined;
    if (numStock !== undefined && (isNaN(numStock) || numStock < 0)) {
      numStock = 0;
    }

    // 1. Update devStore
    const updated = devStore.updateProduct(id, {
      title: body.title,
      price: numPrice,
      comparePrice: numCompare,
      stock: numStock,
      sku: body.sku,
      category: body.category,
      status: numStock === 0 ? "out_of_stock" : "active",
    });

    // 2. Also try DB
    try {
      const dbUpdates: any = { updatedAt: new Date() };
      if (body.title) dbUpdates.title = body.title;
      if (numPrice !== undefined) dbUpdates.basePrice = String(numPrice);
      if (numCompare !== undefined) dbUpdates.compareAtPrice = String(numCompare);

      await Promise.race([
        db.update(products).set(dbUpdates).where(eq(products.id, id)),
        new Promise((_, reject) => setTimeout(() => reject(new Error("DB timeout")), 800))
      ]);
    } catch {
      // Non-fatal DB update
    }

    fastCache.deletePrefix("products:");

    return NextResponse.json({ ok: true, product: updated || { id, ...body } });
  } catch (err) {
    console.error("[Product PATCH Error]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    const session = getSessionFromRequest(request);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Session required to delete products." },
        { status: 401 }
      );
    }

    const existing = devStore.getProduct(id);

    if (existing && !canAccessStore(session, existing.storeSlug)) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to delete this product." },
        { status: 403 }
      );
    }

    // 1. Delete from devStore
    devStore.deleteProduct(id);

    // 2. Try DB soft delete
    try {
      await Promise.race([
        db.update(products).set({ isPublished: false, updatedAt: new Date() }).where(eq(products.id, id)),
        new Promise((_, reject) => setTimeout(() => reject(new Error("DB timeout")), 800))
      ]);
    } catch {
      // Non-fatal
    }

    fastCache.deletePrefix("products:");

    return NextResponse.json({ ok: true, message: "Product deleted successfully." });
  } catch (err) {
    console.error("[Product DELETE Error]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
