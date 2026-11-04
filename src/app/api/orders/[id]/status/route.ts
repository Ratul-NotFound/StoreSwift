import { NextResponse } from "next/server";
import { db, orders } from "@/db";
import { eq } from "drizzle-orm";
import { getSessionFromRequest, canAccessStore } from "@/lib/api-auth";
import { devStore } from "@/lib/dev-store";
import { z } from "zod";

const statusUpdateSchema = z.object({
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]).optional(),
  fulfillmentStatus: z.string().optional(),
  paymentStatus: z.string().optional(),
});

export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    const session = getSessionFromRequest(request);
    const existingOrder = devStore.getOrder(id);

    if (existingOrder && session && !canAccessStore(session, existingOrder.storeSlug)) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to modify this order." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parse = statusUpdateSchema.safeParse(body);

    if (!parse.success) {
      return NextResponse.json({ error: "Invalid status parameters" }, { status: 400 });
    }

    const targetStatus = parse.data.status || (parse.data.fulfillmentStatus === "fulfilled" ? "delivered" : "processing");

    // 1. Update devStore
    devStore.updateOrderStatus(id, targetStatus as any);

    // 2. Try DB update
    try {
      await db
        .update(orders)
        .set({
          fulfillmentStatus: targetStatus,
          paymentStatus: targetStatus === "delivered" ? "paid" : undefined,
          updatedAt: new Date(),
        })
        .where(eq(orders.id, id));
    } catch {
      // Non-fatal
    }

    return NextResponse.json({ ok: true, id, status: targetStatus });
  } catch (err) {
    console.error("[Order Status PATCH Error]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
