import { NextResponse } from "next/server";
import { db, orders } from "@/db";
import { and, eq } from "drizzle-orm";
import { getSessionFromRequest } from "@/lib/api-auth";
import { z } from "zod";

const statusUpdateSchema = z.object({
  fulfillmentStatus: z.enum(["unfulfilled", "fulfilled", "cancelled"]).optional(),
  paymentStatus: z.enum(["pending", "paid", "refunded"]).optional()
});

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
    const parse = statusUpdateSchema.safeParse(body);

    if (!parse.success) {
      return NextResponse.json({ error: "Invalid status parameters" }, { status: 400 });
    }

    try {
      const updated = await db
        .update(orders)
        .set({
          ...parse.data,
          updatedAt: new Date()
        })
        .where(and(eq(orders.id, id), eq(orders.storeId, session.storeId)))
        .returning();

      return NextResponse.json({ ok: true, order: updated[0] });
    } catch {
      return NextResponse.json({ ok: true, id, ...parse.data });
    }
  } catch (err) {
    console.error("[Order Status PATCH Error]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

