import { NextRequest, NextResponse } from "next/server";
import { devStore } from "@/lib/dev-store";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const store = devStore.getStore(slug);
  if (!store) {
    return NextResponse.json({ ok: false, error: "Store not found" }, { status: 404 });
  }

  const allCarts = devStore.getAbandonedCarts(slug);
  const abandonedOnly = allCarts.filter((c) => c.status === "abandoned");
  const totalRecoverable = Math.round(
    abandonedOnly.reduce((sum, c) => sum + c.totalAmount, 0) * 100
  ) / 100;

  const enrichedCarts = abandonedOnly.map((c) => {
    const rawPhone = c.customerPhone.replace(/\D/g, "");
    const formattedPhone = rawPhone.startsWith("88") ? rawPhone : `88${rawPhone}`;
    const itemsSummary = c.items.map((i) => `${i.quantity}x ${i.title}`).join(", ");
    const recoveryMsg = encodeURIComponent(
      `Hello ${c.customerName || "Customer"}, you left items (${itemsSummary}) in your bag at ${store.name}. Complete your order now with free delivery: https://storeswift.app/store/${slug}`
    );

    return {
      ...c,
      whatsAppUrl: `https://wa.me/${formattedPhone}?text=${recoveryMsg}`,
    };
  });

  return NextResponse.json({
    ok: true,
    abandonedCarts: enrichedCarts,
    totalRecoverable,
    totalAbandoned: abandonedOnly.length,
    convertedCount: allCarts.filter((c) => c.status === "converted").length,
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const store = devStore.getStore(slug);
  if (!store) {
    return NextResponse.json({ ok: false, error: "Store not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));
  const { customerName, customerPhone, customerEmail, items, totalAmount, district } = body;

  if (!customerPhone || !items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json(
      { ok: false, error: "Customer phone and cart items are required" },
      { status: 400 }
    );
  }

  const cart = devStore.recordAbandonedCart(slug, {
    customerName: customerName || "Prospective Buyer",
    customerPhone: customerPhone.trim(),
    customerEmail: customerEmail?.trim(),
    items: items.map((i: any) => ({
      title: i.title,
      price: Number(i.price) || 0,
      quantity: Number(i.quantity) || 1,
      imageUrl: i.imageUrl,
    })),
    totalAmount: Number(totalAmount) || 0,
    district,
  });

  return NextResponse.json({ ok: true, cart }, { status: 201 });
}
