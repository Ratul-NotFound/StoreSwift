import { NextRequest, NextResponse } from "next/server";
import { devStore } from "@/lib/dev-store";
import { serializeToCsv } from "@/lib/csv-engine";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const store = devStore.getStore(slug);
  if (!store) {
    return NextResponse.json({ ok: false, error: "Store not found" }, { status: 404 });
  }

  const type = req.nextUrl.searchParams.get("type") || "products";
  let csvText = "";
  let filename = `${slug}-${type}-${new Date().toISOString().slice(0, 10)}.csv`;

  if (type === "products") {
    const products = devStore.getProducts(slug);
    const columns = [
      { key: "title", label: "title" },
      { key: "price", label: "price" },
      { key: "stock", label: "stock" },
      { key: "category", label: "category" },
      { key: "sku", label: "sku" },
      { key: "comparePrice", label: "comparePrice" },
      { key: "status", label: "status" },
      { key: "description", label: "description" },
      { key: "imageUrl", label: "imageUrl" },
    ];
    csvText = serializeToCsv(products, columns);
  } else if (type === "orders") {
    const orders = devStore.getOrders(slug);
    const columns = [
      { key: "orderNumber", label: "orderNumber" },
      { key: "customerName", label: "customerName" },
      { key: "customerPhone", label: "customerPhone" },
      { key: "totalAmount", label: "totalAmount" },
      { key: "customerEmail", label: "customerEmail" },
      { key: "paymentMethod", label: "paymentMethod" },
      { key: "paymentStatus", label: "paymentStatus" },
      { key: "status", label: "status" },
      { key: "district", label: "district" },
      { key: "createdAt", label: "createdAt" },
    ];
    csvText = serializeToCsv(orders, columns);
  } else if (type === "customers") {
    const customers = devStore.getCustomers(slug);
    const columns = [
      { key: "name", label: "name" },
      { key: "phone", label: "phone" },
      { key: "totalOrders", label: "totalOrders" },
      { key: "totalSpent", label: "totalSpent" },
      { key: "email", label: "email" },
      { key: "district", label: "district" },
      { key: "lastOrderAt", label: "lastOrderAt" },
      { key: "isLoyal", label: "isLoyal" },
    ];
    csvText = serializeToCsv(customers, columns);
  } else {
    return NextResponse.json({ ok: false, error: "Invalid export type" }, { status: 400 });
  }

  return new NextResponse(csvText, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
