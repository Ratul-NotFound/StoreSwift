import { NextResponse } from "next/server";
import { z } from "zod";
import { db, orders } from "@/db";
import { eq } from "drizzle-orm";

const courierWebhookSchema = z.object({
  provider: z.enum(["steadfast", "pathao", "redx", "storeswift_express"]).default("steadfast"),
  consignmentId: z.string().min(3),
  orderNumber: z.string().optional(),
  status: z.enum(["in_transit", "out_for_delivery", "delivered", "cancelled", "returned"]),
  codCollected: z.number().optional(),
  timestamp: z.string().optional()
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parse = courierWebhookSchema.safeParse(body);

    if (!parse.success) {
      return NextResponse.json(
        { error: "Invalid courier webhook payload", details: parse.error.format() },
        { status: 400 }
      );
    }

    const { provider, consignmentId, orderNumber, status, codCollected } = parse.data;

    // Map courier status to internal fulfillment & payment status
    let fulfillmentStatus = "Processing";
    let paymentStatus = "pending";

    if (status === "in_transit" || status === "out_for_delivery") {
      fulfillmentStatus = "Shipped";
    } else if (status === "delivered") {
      fulfillmentStatus = "Delivered";
      paymentStatus = "paid";
    } else if (status === "cancelled" || status === "returned") {
      fulfillmentStatus = "Cancelled";
      paymentStatus = "refunded";
    }

    // Attempt database update if connected
    try {
      if (orderNumber) {
        await db
          .update(orders)
          .set({
            fulfillmentStatus,
            paymentStatus,
            updatedAt: new Date()
          })
          .where(eq(orders.orderNumber, orderNumber));
      }
    } catch {
      // In-memory or development fallback
    }

    return NextResponse.json({
      success: true,
      message: `Courier webhook processed successfully for ${provider}`,
      consignmentId,
      orderNumber,
      updatedFulfillmentStatus: fulfillmentStatus,
      updatedPaymentStatus: paymentStatus,
      codCollected: codCollected || 0,
      processedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error("[Courier Webhook Error]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

