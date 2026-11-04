import { NextRequest, NextResponse } from "next/server";
import { devStore } from "@/lib/dev-store";
import { parseCsv } from "@/lib/csv-engine";
import { checkProductLimit } from "@/lib/plan-limits";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const store = devStore.getStore(slug);
  if (!store) {
    return NextResponse.json({ ok: false, error: "Store not found" }, { status: 404 });
  }

  const sampleCsv = [
    "title,price,comparePrice,stock,category,sku,description,imageUrl",
    '"Sample Oxford Shirt",1250,1500,50,"clothing","OX-001","Premium 100% combed cotton","https://images.unsplash.com/photo-1596755094514-f87e34085b2c"',
    '"Linen Summer Kurti",1800,2200,30,"fashion","KU-002","Lightweight breathable ethnic wear","https://images.unsplash.com/photo-1583743814966-8936f5b7be1a"',
  ].join("\r\n");

  return new NextResponse(sampleCsv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="storeswift-product-import-sample.csv"',
    },
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
  const rawCsv = body.csv;

  if (!rawCsv || typeof rawCsv !== "string") {
    return NextResponse.json({ ok: false, error: "CSV data string is required" }, { status: 400 });
  }

  const rows = parseCsv(rawCsv);
  if (rows.length === 0) {
    return NextResponse.json({ ok: false, error: "CSV file contains no valid rows" }, { status: 400 });
  }

  const currentProducts = devStore.getProducts(slug);
  const imported = [];

  for (const row of rows) {
    const title = row.title?.trim();
    const price = parseFloat(row.price);

    if (!title || isNaN(price) || price < 0) {
      continue;
    }

    const limitCheck = checkProductLimit(store.plan, currentProducts.length + imported.length);
    if (!limitCheck.allowed) {
      return NextResponse.json(
        {
          ok: false,
          upgrade: true,
          error: `Product catalog limit reached (${limitCheck.current}/${limitCheck.limit}). Upgrade your plan to import more products.`,
          importedCount: imported.length,
        },
        { status: 403 }
      );
    }

    const prod = devStore.addProduct({
      storeId: store.id,
      storeSlug: slug,
      title,
      price,
      comparePrice: row.comparePrice ? parseFloat(row.comparePrice) : undefined,
      stock: row.stock ? parseInt(row.stock, 10) : 10,
      category: row.category || store.category || "general",
      sku: row.sku || `SKU-${Date.now().toString(36).toUpperCase()}`,
      description: row.description || "",
      imageUrl: row.imageUrl || undefined,
      status: "active",
    });

    imported.push(prod);
  }

  devStore.logAuditEvent(slug, {
    action: "bulk_product_import",
    actorEmail: "merchant@storeswift.app",
    actorRole: "owner",
    details: `Successfully imported ${imported.length} products via CSV engine`,
  });

  return NextResponse.json({
    ok: true,
    message: `Successfully imported ${imported.length} products`,
    importedCount: imported.length,
    products: imported,
  });
}
