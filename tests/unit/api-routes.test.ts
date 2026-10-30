import { describe, it, expect, beforeAll } from "vitest";
import { POST as registerHandler } from "../../src/app/api/auth/register/route";
import { POST as loginHandler } from "../../src/app/api/auth/login/route";
import { POST as logoutHandler } from "../../src/app/api/auth/logout/route";
import { GET as storeHandler } from "../../src/app/api/stores/[slug]/route";
import { POST as orderHandler } from "../../src/app/api/orders/route";

describe("StoreSwift Core API Endpoints", () => {
  beforeAll(() => {
    process.env.AUTH_SECRET = "super-secret-key-that-is-at-least-32-chars-long!";
  });

  it("handles merchant registration validation correctly", async () => {
    // Missing required fields
    const invalidReq = new Request("http://localhost:3000/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email: "invalid-email" })
    });
    const res = await registerHandler(invalidReq);
    expect(res.status).toBe(400);
  });

  it("handles merchant login with demo bypass", async () => {
    const demoReq = new Request("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ demo: true })
    });
    const res = await loginHandler(demoReq);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.slug).toBe("apex-fashion");
  });

  it("handles logout and clears session cookie", async () => {
    const res = await logoutHandler();
    expect(res.status).toBe(200);
    const cookie = res.cookies.get("ss_session");
    expect(cookie?.value).toBe("");
  });

  it("returns store details by slug from public endpoint", async () => {
    const req = new Request("http://localhost:3000/api/stores/apex-fashion");
    const res = await storeHandler(req, { params: Promise.resolve({ slug: "apex-fashion" }) });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.slug).toBe("apex-fashion");
  });

  it("validates incoming customer orders", async () => {
    const invalidOrderReq = new Request("http://localhost:3000/api/orders", {
      method: "POST",
      body: JSON.stringify({ customerName: "" })
    });
    const res = await orderHandler(invalidOrderReq);
    expect(res.status).toBe(400);
  });

  it("successfully processes customer order checkout with stock reservation", async () => {
    const validOrderReq = new Request("http://localhost:3000/api/orders", {
      method: "POST",
      body: JSON.stringify({
        storeSlug: "apex-fashion",
        customerName: "Jane Doe",
        customerPhone: "+1 (555) 987-6543",
        customerEmail: "jane@example.com",
        shippingAddress: {
          address: "123 Market St, Suite 400",
          city: "San Francisco",
          postalCode: "94105"
        },
        items: [
          {
            variantId: "mock-var-1",
            title: "Classic Cotton Tee",
            price: 45.0,
            quantity: 2
          }
        ],
        paymentMethod: "cod"
      })
    });
    const res = await orderHandler(validOrderReq);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.orderNumber).toContain("SS-");
    expect(data.totalAmount).toBe("90.00");
  });
});

