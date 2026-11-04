import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/api-auth";

/**
 * GET /api/admin/dropship-orders
 * Fulfillment queue for platform dropship orders.
 * Shows orders where items are platform products that need fulfillment.
 */
export async function GET(request: Request) {
  const session = getSessionFromRequest(request);
  if (!session || session.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const url = new URL(request.url);
  const status = url.searchParams.get("status") ?? "pending";

  // Mock fulfillment queue for now
  const mockQueue = [
    {
      id: "dso-1", orderId: "ord-201", orderNumber: "SS-DS-201",
      storeName: "Dhaka Trends", storeSlug: "dhaka-trends",
      customerName: "Fatima Rahman", customerPhone: "01711000011",
      shippingAddress: "House 12, Road 5, Dhanmondi, Dhaka",
      product: { title: "Classic White Sneakers", variant: "Size 42", platformProductId: "pp-1" },
      quantity: 2, minPrice: 1200, soldPrice: 1800, merchantEarns: 600, platformEarns: 1200,
      status: "pending", createdAt: new Date(Date.now() - 2 * 3600000)
    },
    {
      id: "dso-2", orderId: "ord-205", orderNumber: "SS-DS-205",
      storeName: "Metro Tech Shop", storeSlug: "metro-tech",
      customerName: "Karim Hossain", customerPhone: "01811000022",
      shippingAddress: "Flat 4A, Tower 2, Bashundhara, Dhaka",
      product: { title: "Wireless Earbuds Pro", variant: "Black", platformProductId: "pp-3" },
      quantity: 1, minPrice: 1800, soldPrice: 2500, merchantEarns: 700, platformEarns: 1800,
      status: "pending", createdAt: new Date(Date.now() - 5 * 3600000)
    },
    {
      id: "dso-3", orderId: "ord-198", orderNumber: "SS-DS-198",
      storeName: "Fresh Pantry BD", storeSlug: "fresh-pantry",
      customerName: "Nusrat Jahan", customerPhone: "01611000033",
      shippingAddress: "Road 10, Block E, Banani, Dhaka",
      product: { title: "Organic Honey 500g", variant: "Single Jar", platformProductId: "pp-7" },
      quantity: 3, minPrice: 450, soldPrice: 650, merchantEarns: 600, platformEarns: 1350,
      status: "shipped", createdAt: new Date(Date.now() - 24 * 3600000)
    },
  ];

  const filtered = status === "all" ? mockQueue : mockQueue.filter(o => o.status === status);

  return NextResponse.json({
    ok: true,
    orders: filtered,
    summary: {
      pending: mockQueue.filter(o => o.status === "pending").length,
      shipped: mockQueue.filter(o => o.status === "shipped").length,
      delivered: 0
    },
    _mock: true
  });
}

export async function PATCH(request: Request) {
  const session = getSessionFromRequest(request);
  if (!session || session.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { orderId, action, trackingNumber } = await request.json();
  // action: "mark_shipped" | "mark_delivered"

  return NextResponse.json({
    ok: true,
    orderId,
    action,
    trackingNumber,
    _mock: true
  });
}

