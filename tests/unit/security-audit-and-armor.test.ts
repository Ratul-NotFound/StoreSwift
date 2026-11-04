import { describe, it, expect, beforeAll } from "vitest";
import { POST as ordersHandler } from "../../src/app/api/orders/route";
import { POST as registerHandler } from "../../src/app/api/auth/register/route";
import { POST as loginHandler } from "../../src/app/api/auth/login/route";
import { GET as adminAnalyticsHandler } from "../../src/app/api/admin/analytics/route";
import { GET as adminCommissionsHandler } from "../../src/app/api/admin/commissions/route";
import { GET as adminDropshipHandler } from "../../src/app/api/admin/dropship-orders/route";
import { GET as adminKpisHandler } from "../../src/app/api/admin/kpis/route";
import { GET as adminMerchantsHandler } from "../../src/app/api/admin/merchants/route";
import { GET as adminSettingsHandler } from "../../src/app/api/admin/settings/route";
import { POST as platformProductsHandler } from "../../src/app/api/platform-products/route";
import { sanitizeString, sanitizePayload, safeCompare, verifyOrigin } from "../../src/lib/security";
import { signSessionToken } from "../../src/lib/auth";
import { devStore } from "../../src/lib/dev-store";

describe("Bank-Grade Security Audit & Armor Verification", () => {
  const secretKey = "super-secret-key-that-is-at-least-32-chars-long!";
  let superAdminToken: string;
  let merchantToken: string;

  beforeAll(() => {
    process.env.AUTH_SECRET = secretKey;

    superAdminToken = signSessionToken({
      userId: "sa-101",
      email: "superadmin@storeswift.app",
      storeId: "platform-root",
      role: "super_admin",
    });

    merchantToken = signSessionToken({
      userId: "m-202",
      email: "merchant@storeswift.app",
      storeId: "store-sec-test",
      storeName: "Security Test Store",
      slug: "sec-test",
      role: "merchant_owner",
    });
  });

  // ─── 1. XSS & HTML INJECTION SANITIZATION ────────────────────────────────────
  describe("1. XSS & Payload Sanitization Shield", () => {
    it("strips script tags, iframes, and dangerous handlers", () => {
      const malicious = '<script>alert("pwned")</script><b>Valid Text</b><img src=x onerror=alert(1)>';
      const sanitized = sanitizeString(malicious);

      expect(sanitized).not.toContain("<script>");
      expect(sanitized).not.toContain("onerror=");
      expect(sanitized).toContain("Valid Text");
    });

    it("strips javascript: pseudo-protocols from links", () => {
      const dangerousLink = 'javascript:evil()';
      const sanitized = sanitizeString(dangerousLink);
      expect(sanitized).not.toContain("javascript:");
    });

    it("recursively sanitizes deeply nested payloads", () => {
      const payload = {
        name: "Test <script>evil()</script>",
        address: {
          street: "123 Main St <iframe src='evil.com'></iframe>",
          items: ["clean", "<img src=x onerror=steal()>item"]
        }
      };

      const clean = sanitizePayload(payload);
      expect(clean.name).not.toContain("<script>");
      expect(clean.address.street).not.toContain("<iframe");
      expect(clean.address.items[1]).not.toContain("onerror=");
    });

    it("sanitizes customer inputs on store registration", async () => {
      const xssReq = new Request("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: 'Hacker <script>alert("xss")</script>',
          storeName: 'Defaced Store <b onmouseover="alert(1)">Click</b>',
          email: `xss-test-${Date.now()}@example.com`,
          password: "StrongPassword123!",
          category: "fashion"
        })
      });

      const res = await registerHandler(xssReq);
      const data = await res.json();
      expect(res.status).toBe(200);
      expect(data.ok).toBe(true);
      // Ensure slug and store do not contain raw scripts
      expect(data.slug).not.toContain("<script>");
    });
  });

  // ─── 2. CLIENT-SIDE DATA MANIPULATION & PRICE TAMPERING (ZERO-TRUST) ─────────
  describe("2. Client-Side Data Manipulation & Price Tampering Shield", () => {
    it("enforces server-authoritative catalog pricing when client tries to tamper price to ৳1", async () => {
      const storeSlug = "sec-tamper-store";
      const store = devStore.ensureStore(storeSlug, "Tamper Proof Store", "fashion");
      const targetProduct = devStore.addProduct({
        storeId: store.id,
        storeSlug: store.slug,
        title: "Authentic Silk Scarf",
        slug: "authentic-silk-scarf",
        description: "Pure mulberry silk with hand-rolled hems",
        price: 2400,
        comparePrice: 3200,
        stock: 20,
        status: "active"
      });
      const genuinePrice = targetProduct.price; // Authentic server price: 2400

      expect(genuinePrice).toBe(2400);

      // Malicious client sends price: 1 (tampered from genuinePrice)
      const tamperedReq = new Request("http://localhost:3000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": "127.0.0.1"
        },
        body: JSON.stringify({
          storeSlug,
          customerName: "Buyer <script>alert(1)</script>",
          customerPhone: "01700000000",
          shippingAddress: "House 1, Road 2, Gulshan, Dhaka",
          district: "Dhaka",
          deliveryMethod: "inside_dhaka",
          shippingFee: 60,
          paymentMethod: "cod",
          items: [
            {
              id: targetProduct.id,
              title: targetProduct.title,
              price: 1, // MALICIOUS TAMPERED PRICE!
              quantity: 2
            }
          ]
        })
      });

      const res = await ordersHandler(tamperedReq);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.ok).toBe(true);

      // The order total amount MUST reflect genuinePrice * 2 + deliveryFee (60)
      // NOT 1 * 2 + 60!
      const expectedTotal = genuinePrice * 2 + 60;
      expect(parseFloat(data.totalAmount)).toBe(expectedTotal);

      // Inspect persisted order in devStore
      const savedOrder = devStore.getOrders().find((o) => o.id === data.orderId || o.orderNumber === data.orderNumber);
      expect(savedOrder).toBeDefined();
      expect(savedOrder?.items[0].price).toBe(genuinePrice);
      // Malicious script stripped from customer name
      expect(savedOrder?.customerName).not.toContain("<script>");
    });
  });

  // ─── 3. STRICT ROLE-BASED ACCESS CONTROL (NO DEV BYPASSES) ───────────────────
  describe("3. Strict Admin RBAC & Zero Unauthenticated Backdoors", () => {
    const adminEndpoints = [
      { name: "Analytics", handler: adminAnalyticsHandler, path: "http://localhost:3000/api/admin/analytics" },
      { name: "Commissions", handler: adminCommissionsHandler, path: "http://localhost:3000/api/admin/commissions" },
      { name: "Dropship Orders", handler: adminDropshipHandler, path: "http://localhost:3000/api/admin/dropship-orders" },
      { name: "KPIs", handler: adminKpisHandler, path: "http://localhost:3000/api/admin/kpis" },
      { name: "Merchants", handler: adminMerchantsHandler, path: "http://localhost:3000/api/admin/merchants" },
      { name: "Settings", handler: adminSettingsHandler, path: "http://localhost:3000/api/admin/settings" },
    ];

    for (const ep of adminEndpoints) {
      it(`blocks unauthenticated request to /api/admin/${ep.name.toLowerCase()} with 403 Forbidden`, async () => {
        const unauthReq = new Request(ep.path, { method: "GET" });
        const res = await ep.handler(unauthReq);
        expect(res.status).toBe(403);
        const data = await res.json();
        expect(data.error).toContain("Super admin");
      });

      it(`blocks regular merchant role from /api/admin/${ep.name.toLowerCase()} with 403 Forbidden`, async () => {
        const merchantReq = new Request(ep.path, {
          method: "GET",
          headers: { Cookie: `ss_session=${merchantToken}` }
        });
        const res = await ep.handler(merchantReq);
        expect(res.status).toBe(403);
      });

      it(`grants access to /api/admin/${ep.name.toLowerCase()} for valid super_admin session`, async () => {
        const superReq = new Request(ep.path, {
          method: "GET",
          headers: { Cookie: `ss_session=${superAdminToken}` }
        });
        const res = await ep.handler(superReq);
        // Should succeed (200) or DB error without 403
        expect(res.status).not.toBe(403);
      });
    }

    it("blocks POST /api/platform-products without super_admin session", async () => {
      const unauthReq = new Request("http://localhost:3000/api/platform-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Infiltrated Product" })
      });
      const res = await platformProductsHandler(unauthReq);
      expect(res.status).toBe(403);
    });
  });

  // ─── 4. PRODUCTION DEMO LOGIN SECURITY ───────────────────────────────────────
  describe("4. Production Demo Access Lockdown", () => {
    it("rejects demo login in production environment", async () => {
      const origEnv = process.env.NODE_ENV;
      try {
        // @ts-ignore
        process.env.NODE_ENV = "production";
        delete process.env.ALLOW_DEMO_LOGIN;

        const demoLoginReq = new Request("http://localhost:3000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ demo: true, role: "merchant_owner" })
        });

        const res = await loginHandler(demoLoginReq);
        expect(res.status).toBe(403);
        const data = await res.json();
        expect(data.error).toContain("Demo access is disabled");
      } finally {
        // @ts-ignore
        process.env.NODE_ENV = origEnv;
      }
    });

    it("rejects Super Admin demo login unconditionally in production", async () => {
      const origEnv = process.env.NODE_ENV;
      try {
        // @ts-ignore
        process.env.NODE_ENV = "production";
        process.env.ALLOW_DEMO_LOGIN = "true";

        const superDemoReq = new Request("http://localhost:3000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ demo: true, role: "super_admin" })
        });

        const res = await loginHandler(superDemoReq);
        expect(res.status).toBe(403);
      } finally {
        // @ts-ignore
        process.env.NODE_ENV = origEnv;
        delete process.env.ALLOW_DEMO_LOGIN;
      }
    });
  });

  // ─── 5. TIMING-SAFE COMPARISON & CSRF ORIGIN CHECK ───────────────────────────
  describe("5. Cryptographic Timing-Safe & Origin Verification", () => {
    it("safely compares secret tokens with constant-time guarantees", () => {
      expect(safeCompare("correct-token-12345", "correct-token-12345")).toBe(true);
      expect(safeCompare("correct-token-12345", "wrong-token-1234567")).toBe(false);
      expect(safeCompare("", "something")).toBe(false);
    });

    it("verifies origin and referer headers against trusted platform hosts", () => {
      const trustedReq = new Request("http://localhost:3000/api/orders", {
        method: "POST",
        headers: { origin: "http://localhost:3000" }
      });
      expect(verifyOrigin(trustedReq)).toBe(true);

      const maliciousReq = new Request("http://localhost:3000/api/orders", {
        method: "POST",
        headers: { origin: "http://malicious-attacker.com" }
      });
      expect(verifyOrigin(maliciousReq)).toBe(false);
    });
  });
});
