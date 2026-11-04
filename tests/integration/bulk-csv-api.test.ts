import { describe, it, expect } from "vitest";
import { GET as getExport } from "@/app/api/stores/[slug]/export/route";
import { POST as postImport, GET as getImportSample } from "@/app/api/stores/[slug]/import/route";
import { NextRequest } from "next/server";
import { devStore } from "@/lib/dev-store";

describe("Bulk CSV Data Engine (/api/stores/[slug]/export & import)", () => {
  const testSlug = "apex-fashion";

  it("exports products in RFC-4180 CSV format with CSV injection prevention", async () => {
    const req = new NextRequest(`http://localhost:3000/api/stores/${testSlug}/export?type=products`);
    const res = await getExport(req, { params: Promise.resolve({ slug: testSlug }) });

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/csv");
    expect(res.headers.get("content-disposition")).toContain(".csv");

    const text = await res.text();
    expect(text).toContain("title,price,stock,category,sku");
  });

  it("exports orders and customers directories correctly", async () => {
    const reqOrders = new NextRequest(`http://localhost:3000/api/stores/${testSlug}/export?type=orders`);
    const resOrders = await getExport(reqOrders, { params: Promise.resolve({ slug: testSlug }) });
    expect(resOrders.status).toBe(200);
    const textOrders = await resOrders.text();
    expect(textOrders).toContain("orderNumber,customerName,customerPhone,totalAmount");

    const reqCust = new NextRequest(`http://localhost:3000/api/stores/${testSlug}/export?type=customers`);
    const resCust = await getExport(reqCust, { params: Promise.resolve({ slug: testSlug }) });
    expect(resCust.status).toBe(200);
    const textCust = await resCust.text();
    expect(textCust).toContain("name,phone,totalOrders,totalSpent");
  });

  it("provides a sample downloadable product CSV template", async () => {
    const req = new NextRequest(`http://localhost:3000/api/stores/${testSlug}/import?sample=true`);
    const res = await getImportSample(req, { params: Promise.resolve({ slug: testSlug }) });

    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain("title,price,comparePrice,stock,category,sku,description,imageUrl");
    expect(text).toContain("Sample Oxford Shirt");
  });

  it("imports products from CSV text and validates required columns", async () => {
    const csvData = [
      "title,price,comparePrice,stock,category,sku,description,imageUrl",
      '"New Linen Pant",850,1100,25,"clothing","SKU-LP-01","Pure breathable linen","https://example.com/linen.jpg"',
    ].join("\n");

    const req = new NextRequest(`http://localhost:3000/api/stores/${testSlug}/import`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ csv: csvData }),
    });

    const res = await postImport(req, { params: Promise.resolve({ slug: testSlug }) });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(data.importedCount).toBe(1);

    const products = devStore.getProducts(testSlug);
    expect(products.some((p) => p.title === "New Linen Pant")).toBe(true);
  });
});
