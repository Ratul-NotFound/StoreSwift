import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/api-auth";
import { devStore } from "@/lib/dev-store";

export async function GET(request: Request) {
  const session = getSessionFromRequest(request);

  if (!session || session.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden: Super admin authentication required." }, { status: 403 });
  }

  const url = new URL(request.url);
  const status = url.searchParams.get("status") ?? "all";

  const allOrders = devStore.getDropshipOrders();
  const filtered = status === "all" ? allOrders : allOrders.filter((o) => o.fulfillmentStatus === status);

  const formatted = filtered.map((o) => ({
    id: o.id,
    orderId: o.orderId,
    orderNumber: o.orderNumber,
    storeName: o.storeName,
    storeSlug: o.storeId,
    customerName: o.customerName,
    customerPhone: o.customerPhone,
    shippingAddress: o.shippingAddress,
    product: {
      title: o.productTitle,
      variant: "Standard",
      platformProductId: o.platformProductId,
    },
    quantity: 1,
    minPrice: o.minimumPrice,
    soldPrice: o.sellPrice,
    merchantEarns: o.merchantMargin,
    platformEarns: o.minimumPrice,
    status: o.fulfillmentStatus,
    trackingCode: o.trackingCode,
    courierName: o.courierName || "Steadfast Courier",
    createdAt: o.createdAt,
  }));

  return NextResponse.json({
    ok: true,
    orders: formatted,
    summary: {
      pending: allOrders.filter((o) => o.fulfillmentStatus === "pending").length,
      shipped: allOrders.filter((o) => o.fulfillmentStatus === "shipped").length,
      delivered: allOrders.filter((o) => o.fulfillmentStatus === "delivered").length,
    },
  });
}

export async function PATCH(request: Request) {
  const session = getSessionFromRequest(request);

  if (!session || session.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden: Super admin authentication required." }, { status: 403 });
  }

  try {
    const { orderId, action, trackingNumber, trackingCode, courierName } = await request.json();
    const finalTracking = trackingNumber || trackingCode || `ST-DS-${Math.floor(10000 + Math.random() * 90000)}`;

    const status = action === "mark_delivered" || action === "delivered" ? "delivered" : "shipped";
    devStore.updateDropshipStatus(orderId, status, finalTracking, courierName || "Steadfast Courier");

    return NextResponse.json({
      ok: true,
      orderId,
      status,
      trackingNumber: finalTracking,
    });
  } catch (err) {
    console.error("[Dropship Orders PATCH Error]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
