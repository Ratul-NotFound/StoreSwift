import { describe, it, expect } from "vitest";
import { POST, GET } from "@/app/api/stores/[slug]/abandoned-carts/route";
import { NextRequest } from "next/server";

describe("Abandoned Cart Recovery Engine API", () => {
  const testSlug = "apex-fashion";

  it("captures customer pre-submit lead and records abandoned cart", async () => {
    const req = new NextRequest(`http://localhost:3000/api/stores/${testSlug}/abandoned-carts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: "Mahmud Hasan",
        customerPhone: "01755667788",
        customerEmail: "mahmud@gmail.com",
        items: [
          { title: "Premium Polo", price: 890, quantity: 2 },
          { title: "Leather Belt", price: 650, quantity: 1 },
        ],
        totalAmount: 2430,
        district: "Dhaka",
      }),
    });

    const res = await POST(req, { params: Promise.resolve({ slug: testSlug }) });
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.ok).toBe(true);
    expect(data.cart.id).toBeDefined();
    expect(data.cart.status).toBe("abandoned");
  });

  it("retrieves abandoned carts with total recoverable KPI and WhatsApp links", async () => {
    const req = new NextRequest(`http://localhost:3000/api/stores/${testSlug}/abandoned-carts`);
    const res = await GET(req, { params: Promise.resolve({ slug: testSlug }) });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.abandonedCarts)).toBe(true);
    expect(data.totalRecoverable).toBeGreaterThanOrEqual(2430);

    const target = data.abandonedCarts.find((c: any) => c.customerPhone === "01755667788");
    expect(target).toBeDefined();
    expect(target.whatsAppUrl).toContain("https://wa.me/8801755667788");
  });
});
