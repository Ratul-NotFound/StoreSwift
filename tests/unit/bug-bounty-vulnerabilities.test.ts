import { describe, it, expect, beforeAll } from "vitest";
import { PATCH as patchOrderStatus } from "@/app/api/orders/[id]/status/route";
import { PATCH as patchSettings } from "@/app/api/stores/[slug]/settings/route";
import { POST as postProduct, GET as getProducts } from "@/app/api/products/route";
import { PATCH as patchProduct, DELETE as deleteProduct } from "@/app/api/products/[id]/route";
import { GET as getOrders, POST as postOrder } from "@/app/api/orders/route";
import { GET as getCustomers } from "@/app/api/customers/route";
import { GET as getCoupons, POST as postCoupon, PATCH as patchCoupon, DELETE as deleteCoupon } from "@/app/api/coupons/route";
import { GET as getAnalytics } from "@/app/api/analytics/route";
import { POST as postDomain, DELETE as deleteDomain } from "@/app/api/domains/route";
import { POST as postLogin } from "@/app/api/auth/login/route";
import { signSessionToken } from "@/lib/auth";
import { devStore } from "@/lib/dev-store";

describe("Professional Bug Bounty Hunter Vulnerability Suite", () => {
  const SECRET = "super-secret-key-that-is-at-least-32-chars-long!";
  let victimToken: string;
  let attackerToken: string;

  beforeAll(() => {
    process.env.AUTH_SECRET = SECRET;

    // Victim store
    devStore.ensureStore("victim-store", "Victim Fashion", "fashion");
    devStore.updateStore("victim-store", { plan: "pro" });

    // Attacker store
    devStore.ensureStore("attacker-store", "Attacker Store", "electronics");
    devStore.updateStore("attacker-store", { plan: "free" });

    victimToken = signSessionToken({
      userId: "usr-victim",
      email: "victim@victimstore.com",
      storeId: "store-victim-store",
      slug: "victim-store",
      role: "merchant_owner",
      plan: "pro",
    }, SECRET);

    attackerToken = signSessionToken({
      userId: "usr-attacker",
      email: "attacker@attackerstore.com",
      storeId: "store-attacker-store",
      slug: "attacker-store",
      role: "merchant_owner",
      plan: "free",
    }, SECRET);
  });

  // ─── 1. BOLA / IDOR ON ORDER STATUS MUTATION ──────────────────────────────
  describe("1. Order Status IDOR / BOLA Armor", () => {
    it("strictly blocks unauthenticated status changes to orders (401)", async () => {
      const order = devStore.addOrder({
        storeSlug: "victim-store",
        customerName: "Target Customer",
        customerPhone: "01711223344",
        shippingAddress: "Banani, Dhaka",
        items: [{ title: "Silk Dress", price: 2500, quantity: 1 }],
        paymentMethod: "cod",
        shippingFee: 60,
      });

      const req = new Request(`http://localhost:3000/api/orders/${order.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "delivered" }),
      });

      const res = await patchOrderStatus(req, { params: Promise.resolve({ id: order.id }) });
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toContain("Unauthorized");
    });

    it("strictly blocks cross-tenant order status manipulation (403)", async () => {
      const order = devStore.addOrder({
        storeSlug: "victim-store",
        customerName: "Target Customer 2",
        customerPhone: "01711223344",
        shippingAddress: "Banani, Dhaka",
        items: [{ title: "Silk Dress", price: 2500, quantity: 1 }],
        paymentMethod: "cod",
        shippingFee: 60,
      });

      const req = new Request(`http://localhost:3000/api/orders/${order.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${attackerToken}`,
        },
        body: JSON.stringify({ status: "cancelled" }),
      });

      const res = await patchOrderStatus(req, { params: Promise.resolve({ id: order.id }) });
      expect(res.status).toBe(403);
      const data = await res.json();
      expect(data.error).toContain("Forbidden");
    });
  });

  // ─── 2. STORE SETTINGS BOLA & DEFACEMENT ─────────────────────────────────
  describe("2. Store Settings Protection Shield", () => {
    it("blocks unauthenticated store settings modification (401)", async () => {
      const req = new Request("http://localhost:3000/api/stores/victim-store/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "HACKED DEFACE" }),
      });

      const res = await patchSettings(req, { params: Promise.resolve({ slug: "victim-store" }) });
      expect(res.status).toBe(401);
    });

    it("blocks cross-tenant store settings modification (403)", async () => {
      const req = new Request("http://localhost:3000/api/stores/victim-store/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${attackerToken}`,
        },
        body: JSON.stringify({ name: "HACKED DEFACE" }),
      });

      const res = await patchSettings(req, { params: Promise.resolve({ slug: "victim-store" }) });
      expect(res.status).toBe(403);
    });
  });

  // ─── 3. CATALOG SABOTAGE & PRODUCT DELETION/PRICING ───────────────────────
  describe("3. Catalog Integrity & Negative Price Rejection", () => {
    it("blocks unauthenticated product creation (401)", async () => {
      const req = new Request("http://localhost:3000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeSlug: "victim-store",
          title: "Malicious Phantom Product",
          price: 10,
        }),
      });

      const res = await postProduct(req);
      expect(res.status).toBe(401);
    });

    it("rejects negative product pricing (400)", async () => {
      const req = new Request("http://localhost:3000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${victimToken}`,
        },
        body: JSON.stringify({
          storeSlug: "victim-store",
          title: "Negative Price Item",
          price: -500,
        }),
      });

      const res = await postProduct(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain("negative");
    });

    it("blocks unauthenticated product deletion (401)", async () => {
      const prod = devStore.addProduct({
        storeId: "store-victim-store",
        storeSlug: "victim-store",
        title: "Protected Product",
        price: 500,
      });

      const req = new Request(`http://localhost:3000/api/products/${prod.id}`, {
        method: "DELETE",
      });

      const res = await deleteProduct(req, { params: Promise.resolve({ id: prod.id }) });
      expect(res.status).toBe(401);
    });

    it("blocks cross-tenant product deletion (403)", async () => {
      const prod = devStore.addProduct({
        storeId: "store-victim-store",
        storeSlug: "victim-store",
        title: "Victim Jewel",
        price: 9000,
      });

      const req = new Request(`http://localhost:3000/api/products/${prod.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${attackerToken}` },
      });

      const res = await deleteProduct(req, { params: Promise.resolve({ id: prod.id }) });
      expect(res.status).toBe(403);
    });
  });

  // ─── 4. PRIVILEGE ESCALATION VIA EMAIL SUBSTRING ──────────────────────────
  describe("4. Super Admin Privilege Escalation Neutralization", () => {
    it("does NOT grant super_admin to user emails merely containing 'superadmin' string", async () => {
      const sneakyEmail = "hacker.superadmin@evilcorp.com";
      const req = new Request("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: sneakyEmail,
          password: "RandomPassword123!",
        }),
      });

      const res = await postLogin(req);
      const data = await res.json();
      // Should either fail authentication or resolve to merchant_owner, NEVER super_admin
      if (res.status === 200) {
        expect(data.role).not.toBe("super_admin");
        expect(data.role).toBe("merchant_owner");
      } else {
        expect(res.status).toBe(401);
      }
    });
  });

  // ─── 5. PII EXFILTRATION & PRIVACY PRESERVATION ───────────────────────────
  describe("5. Customer & Order PII Data Protection", () => {
    it("blocks unauthenticated access to customer PII database (401)", async () => {
      const req = new Request("http://localhost:3000/api/customers?storeSlug=victim-store");
      const res = await getCustomers(req);
      expect(res.status).toBe(401);
    });

    it("blocks cross-tenant customer database harvesting (403)", async () => {
      const req = new Request("http://localhost:3000/api/customers?storeSlug=victim-store", {
        headers: { Authorization: `Bearer ${attackerToken}` },
      });
      const res = await getCustomers(req);
      expect(res.status).toBe(403);
    });

    it("blocks unauthenticated order list harvesting (401)", async () => {
      const req = new Request("http://localhost:3000/api/orders?storeSlug=victim-store");
      const res = await getOrders(req);
      expect(res.status).toBe(401);
    });

    it("blocks cross-tenant order history exfiltration (403)", async () => {
      const req = new Request("http://localhost:3000/api/orders?storeSlug=victim-store", {
        headers: { Authorization: `Bearer ${attackerToken}` },
      });
      const res = await getOrders(req);
      expect(res.status).toBe(403);
    });
  });

  // ─── 6. BUSINESS LOGIC & FINANCIAL INTEGRITY ──────────────────────────────
  describe("6. Financial Integrity & Coupon Exploit Armor", () => {
    it("rejects coupon creation with discount exceeding 100% (400)", async () => {
      const req = new Request("http://localhost:3000/api/coupons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${victimToken}`,
        },
        body: JSON.stringify({
          storeSlug: "victim-store",
          code: "EXPLOIT500",
          type: "percent",
          value: 500, // 500% discount
        }),
      });

      const res = await postCoupon(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain("between 1% and 100%");
    });

    it("blocks unauthenticated coupon toggling and deletion (401)", async () => {
      const coupon = devStore.addCoupon({
        storeId: "store-victim-store",
        storeSlug: "victim-store",
        code: "SAVE20",
        type: "percent",
        value: 20,
        isActive: true,
      });

      // Attempt toggle
      const patchReq = new Request("http://localhost:3000/api/coupons", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: coupon.id, isActive: false }),
      });
      const patchRes = await patchCoupon(patchReq);
      expect(patchRes.status).toBe(401);

      // Attempt delete
      const delReq = new Request(`http://localhost:3000/api/coupons?id=${coupon.id}`, {
        method: "DELETE",
      });
      const delRes = await deleteCoupon(delReq);
      expect(delRes.status).toBe(401);
    });

    it("rejects checkout with negative shipping fee tampering (400)", async () => {
      const req = new Request("http://localhost:3000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeSlug: "victim-store",
          customerName: "Exploit Tester",
          customerPhone: "01700112233",
          shippingAddress: "Dhaka",
          shippingFee: -5000,
          items: [
            {
              title: "Silk Dress",
              price: 2500,
              quantity: 1,
            },
          ],
        }),
      });

      const res = await postOrder(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain("negative");
    });
  });

  // ─── 7. DOMAIN HIJACKING PROTECTION ───────────────────────────────────────
  describe("7. Custom Domain Hijacking Shield", () => {
    it("blocks unauthenticated domain deletion (401)", async () => {
      const req = new Request("http://localhost:3000/api/domains?storeSlug=victim-store", {
        method: "DELETE",
      });
      const res = await deleteDomain(req);
      expect(res.status).toBe(401);
    });

    it("blocks cross-tenant domain configuration (403)", async () => {
      const req = new Request("http://localhost:3000/api/domains", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${attackerToken}`,
        },
        body: JSON.stringify({
          domain: "hijacked-domain.com",
          storeSlug: "victim-store",
        }),
      });
      const res = await postDomain(req);
      expect(res.status).toBe(403);
    });
  });

  // ─── 8. BUSINESS INTELLIGENCE LEAKAGE ─────────────────────────────────────
  describe("8. Analytics & Merchant Intelligence Guard", () => {
    it("blocks unauthenticated analytics leakage (401)", async () => {
      const req = new Request("http://localhost:3000/api/analytics?storeSlug=victim-store");
      const res = await getAnalytics(req);
      expect(res.status).toBe(401);
    });

    it("blocks cross-tenant analytics access (403)", async () => {
      const req = new Request("http://localhost:3000/api/analytics?storeSlug=victim-store", {
        headers: { Authorization: `Bearer ${attackerToken}` },
      });
      const res = await getAnalytics(req);
      expect(res.status).toBe(403);
    });
  });
});
