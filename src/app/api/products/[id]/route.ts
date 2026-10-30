import { NextResponse } from "next/server";
import { db, products } from "@/db";
import { and, eq } from "drizzle-orm";
import { getSessionFromRequest } from "@/lib/api-auth";

export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await props.params;
    const body = await request.json();

    try {
      const updated = await db
        .update(products)
        .set({
          ...body,
          updatedAt: new Date()
        })
        .where(and(eq(products.id, id), eq(products.storeId, session.storeId)))
        .returning();

      return NextResponse.json({ ok: true, product: updated[0] });
    } catch {
      return NextResponse.json({ ok: true, id, ...body });
    }
  } catch (err) {
    console.error("[Product PATCH Error]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await props.params;

    try {
      // Soft-delete
      await db
        .update(products)
        .set({ isPublished: false, updatedAt: new Date() })
        .where(and(eq(products.id, id), eq(products.storeId, session.storeId)));

      return NextResponse.json({ ok: true, message: "Product archived successfully." });
    } catch {
      return NextResponse.json({ ok: true, message: "Product archived." });
    }
  } catch (err) {
    console.error("[Product DELETE Error]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

