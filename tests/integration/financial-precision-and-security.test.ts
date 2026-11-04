import { describe, it, expect, beforeAll } from "vitest";
import { POST as postOrdersHandler, GET as getOrdersHandler } from "../../src/app/api/orders/route";
import { GET as getCouponsHandler, POST as postCouponsHandler, PATCH as patchCouponsHandler, DELETE as deleteCouponsHandler } from "../../src/app/api/coupons/route";
import { GET as getCommissionsHandler, PATCH as patchCommissionsHandler } from "../../src/app/api/admin/commissions/route";
import { GET as getMerchantsHandler } from "../../src/app/api/admin/merchants/route";
import { GET as getKpisHandler } from "../../src/app/api/admin/kpis/route";
import { GET as getAnalyticsHandler } from "../../src/app/api/analytics/route";
import { POST as postDropshipHandler } from "../../src/app/api/dropship/route";
import { POST as postPlatformProductsHandler } from "../../src/app/api/platform-products/route";
import { calculateCommission, PLAN_LIMITS } from "../../src/lib/plan-limits";
import { devStore } from "../../src/lib/dev-store";
import { signSessionToken } from "../../src/lib/auth";

describe("Strict Financial Precision, Mathematical Sync & Security Armor Suite", () => {
  const secret = "super-secret-key-that-is-at-least-32-chars-long!";
  let superAdminHeaders: { Authorization: string };
  let mediumMerchantHeaders: { Authorization: string };
  let freeMerchantHeaders: { Authorization: string };
  const storeSlug = `finance-store-${Date.now()}`;
  const freeStoreSlug = `free-store-${Date.now()}`;
  let platformProdId = "";

  beforeAll(() => {
    process.env.AUTH_SECRET = secret;

    const superAdminToken = signSessionToken({
      userId: "usr-admin-fin",
      email: "finance-admin@storeswift.app",
      storeId: "platform-admin",
      role: "super_admin",
    }, secret);
    superAdminHeaders = { Authorization: `Bearer ${superAdminToken}` };

    const mediumMerchantToken = signSessionToken({
      userId: "usr-merchant-med",
      email: "merchant-med@storeswift.app",
      storeId: `store-${storeSlug}`,
      slug: storeSlug,
      role: "merchant_owner",
      plan: "medium",
    }, secret);
    mediumMerchantHeaders = { Authorization: `Bearer ${mediumMerchantToken}` };

    const freeMerchantToken = signSessionToken({
      userId: "usr-merchant-free",
      email: "merchant-free@storeswift.app",
      storeId: `store-${freeStoreSlug}`,
      slug: freeStoreSlug,
      role: "merchant_owner",
      plan: "free",
    }, secret);
    freeMerchantHeaders = { Authorization: `Bearer ${freeMerchantToken}` };

    // Setup stores in devStore
    devStore.ensureStore(storeSlug);
    devStore.upgradeStore(storeSlug, "medium", "TRX-MED-1");

    devStore.ensureStore(freeStoreSlug);
    devStore.upgradeStore(freeStoreSlug, "free");

    // Add a catalog product with cents/paisas to test IEEE 754 precision
    devStore.addProduct({
      storeId: `store-${storeSlug}`,
      storeSlug,
      title: "Precision Silk Shirt",
      price: 199.99,
      comparePrice: 249.99,
      stock: 50,
      sku: "PSS-001",
    });

    devStore.addProduct({
      storeId: `store-${storeSlug}`,
      storeSlug,
      title: "Precision Cufflinks",
      price: 49.95,
      comparePrice: 69.95,
      stock: 50,
      sku: "PC-002",
    });
  });

  // ─── 1. PLAN LIMITS & COMMISSION MATHEMATICAL PRECISION ───────────────────
  describe("1. Plan Commission Mathematical Exactness & Input Sanitization", () => {
    it("strictly computes 8% commission on Free plan rounded to 2 decimals", () => {
      // 123.45 * 0.08 = 9.876 -> should round to 9.88
      const comm1 = calculateCommission("free", 123.45);
      expect(comm1).toBe(9.88);

      // 1000 * 0.08 = 80
      const comm2 = calculateCommission("free", 1000);
      expect(comm2).toBe(80);

      // 0.1 + 0.2 floating point sum test: 0.30000000000000004 * 0.08 = 0.024 -> 0.02
      const comm3 = calculateCommission("free", 0.1 + 0.2);
      expect(comm3).toBe(0.02);
    });

    it("strictly computes 3% commission on Medium plan rounded to 2 decimals", () => {
      // 199.99 * 0.03 = 5.9997 -> should round to 6.00
      const comm1 = calculateCommission("medium", 199.99);
      expect(comm1).toBe(6);

      // 53.33 * 0.03 = 1.5999 -> should round to 1.6
      const comm2 = calculateCommission("medium", 53.33);
      expect(comm2).toBe(1.6);
    });

    it("strictly returns 0 commission for Pro plan regardless of order size", () => {
      expect(calculateCommission("pro", 50000)).toBe(0);
      expect(calculateCommission("pro", 199.99)).toBe(0);
    });

    it("safely handles negative, zero, NaN, or non-finite order amounts without crash or drift", () => {
      expect(calculateCommission("free", -500)).toBe(0);
      expect(calculateCommission("free", 0)).toBe(0);
      expect(calculateCommission("free", NaN)).toBe(0);
      expect(calculateCommission("free", Infinity)).toBe(0);
      expect(calculateCommission("free", -Infinity)).toBe(0);
    });
  });

  // ─── 2. COUPON SECURITY & MATHEMATICAL VERIFICATION ────────────────────────
  describe("2. Coupon System Security, Plan Gates & Strict Precision", () => {
    let createdCouponId = "";

    it("prohibits Free plan merchants from creating coupons", async () => {
      const req = new Request("http://localhost:3000/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...freeMerchantHeaders },
        body: JSON.stringify({
          code: "FREEFAIL10",
          type: "percent",
          value: 10,
          storeSlug: freeStoreSlug,
        }),
      });

      const res = await postCouponsHandler(req);
      expect(res.status).toBe(403);
      const data = await res.json();
      expect(data.upgrade).toBe(true);
    });

    it("allows Medium plan merchant to create a valid percentage coupon", async () => {
      const req = new Request("http://localhost:3000/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...mediumMerchantHeaders },
        body: JSON.stringify({
          code: "SAVE15",
          type: "percent",
          value: 15,
          minOrder: 100,
          maxUses: 5,
          storeSlug,
        }),
      });

      const res = await postCouponsHandler(req);
      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.ok).toBe(true);
      expect(data.coupon.code).toBe("SAVE15");
      expect(data.coupon.value).toBe(15);
      createdCouponId = data.coupon.id;
    });

    it("rejects coupon creation with invalid percent values (>100% or <=0)", async () => {
      const req = new Request("http://localhost:3000/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...mediumMerchantHeaders },
        body: JSON.stringify({
          code: "HACK200",
          type: "percent",
          value: 200,
          storeSlug,
        }),
      });

      const res = await postCouponsHandler(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain("between 1% and 100%");
    });

    it("accurately validates coupon discount and rounds to 2 decimal places", async () => {
      // Order amount 199.99 with 15% discount:
      // 199.99 * 0.15 = 29.9985 -> rounded to 30.00
      const req = new Request("http://localhost:3000/api/coupons", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: "SAVE15",
          orderAmount: 199.99,
          storeSlug,
        }),
      });

      const res = await patchCouponsHandler(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.valid).toBe(true);
      expect(data.discountAmount).toBe(30);
    });

    it("enforces minimum order threshold for coupons", async () => {
      const req = new Request("http://localhost:3000/api/coupons", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: "SAVE15",
          orderAmount: 50, // minOrder is 100
          storeSlug,
        }),
      });

      const res = await patchCouponsHandler(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.valid).toBe(false);
      expect(data.error).toContain("Minimum order");
    });

    it("allows authorized merchant to toggle coupon active/inactive", async () => {
      const req = new Request("http://localhost:3000/api/coupons", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...mediumMerchantHeaders },
        body: JSON.stringify({
          id: createdCouponId,
          isActive: false,
        }),
      });

      const res = await patchCouponsHandler(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.ok).toBe(true);

      // Now validating should fail
      const valReq = new Request("http://localhost:3000/api/coupons", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: "SAVE15",
          orderAmount: 200,
          storeSlug,
        }),
      });
      const valRes = await patchCouponsHandler(valReq);
      const valData = await valRes.json();
      expect(valData.valid).toBe(false);

      // Re-activate for further checkout tests
      await patchCouponsHandler(new Request("http://localhost:3000/api/coupons", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...mediumMerchantHeaders },
        body: JSON.stringify({
          id: createdCouponId,
          isActive: true,
        }),
      }));
    });
  });

  // ─── 3. ZERO-TRUST CHECKOUT & SERVER-AUTHORITATIVE CALCULATIONS ─────────────
  describe("3. Zero-Trust Server Order Calculations & Price Tampering Defense", () => {
    it("forces verified catalog prices even if client submits tampered ৳1.00 price", async () => {
      // Attacker sends price: 1.00 for a ৳199.99 item
      const req = new Request("http://localhost:3000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeSlug,
          customerName: "Client Side Manipulator",
          customerPhone: "01711000111",
          customerEmail: "hacker@test.com",
          shippingAddress: {
            address: "House 10, Road 4, Sector 7",
            district: "Dhaka",
          },
          items: [
            {
              title: "Precision Silk Shirt",
              price: 1.00, // TAMPERED PRICE
              quantity: 2,
            },
          ],
          paymentMethod: "cod",
          shippingFee: 60,
        }),
      });

      const res = await postOrdersHandler(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.ok).toBe(true);

      // Server verified price is 199.99 * 2 = 399.98
      // Subtotal = 399.98, Shipping = 60 -> Total = 459.98
      expect(parseFloat(data.subtotal)).toBe(399.98);
      expect(parseFloat(data.totalAmount)).toBe(459.98);

      const storedOrder = devStore.getOrder(data.orderId);
      expect(storedOrder).toBeDefined();
      expect(storedOrder?.items[0].price).toBe(199.99);
      expect(storedOrder?.subtotal).toBe(399.98);
      expect(storedOrder?.totalAmount).toBe(459.98);
    });

    it("calculates server-authoritative coupon discount without trusting client discount", async () => {
      // 1 Silk Shirt (199.99) + 1 Cufflinks (49.95) = 249.94
      // 15% discount on 249.94 = 37.491 -> rounded to 37.49
      // Discounted subtotal = 249.94 - 37.49 = 212.45
      // Shipping: 120 -> Total: 332.45
      const req = new Request("http://localhost:3000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeSlug,
          customerName: "Precise Shopper",
          customerPhone: "01711222333",
          customerEmail: "shopper@test.com",
          shippingAddress: {
            address: "Agrabad Commercial Area",
            district: "Chittagong",
          },
          items: [
            { title: "Precision Silk Shirt", price: 199.99, quantity: 1 },
            { title: "Precision Cufflinks", price: 49.95, quantity: 1 },
          ],
          paymentMethod: "cod",
          shippingFee: 120,
          couponCode: "SAVE15",
        }),
      });

      const res = await postOrdersHandler(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.ok).toBe(true);
      expect(parseFloat(data.subtotal)).toBe(249.94);
      expect(parseFloat(data.discountAmount)).toBe(37.49);
      expect(parseFloat(data.totalAmount)).toBe(332.45);

      // Verify devStore stored order has exact match
      const orderInStore = devStore.getOrder(data.orderId);
      expect(orderInStore).toBeDefined();
      expect(orderInStore?.totalAmount).toBe(332.45);
      expect(orderInStore?.discountAmount).toBe(37.49);
    });

    it("rejects order checkout if an invalid or expired coupon code is supplied", async () => {
      const req = new Request("http://localhost:3000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeSlug,
          customerName: "Coupon Forger",
          customerPhone: "01711333444",
          shippingAddress: { address: "Mirpur 10", district: "Dhaka" },
          items: [{ title: "Precision Silk Shirt", price: 199.99, quantity: 1 }],
          paymentMethod: "cod",
          couponCode: "FAKE99",
        }),
      });

      const res = await postOrdersHandler(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain("Invalid coupon code");
    });
  });

  // ─── 4. DROPSHIP MARGINS & SUPPLIER COST INTEGRITY ─────────────────────────
  describe("4. Dropship Supplier Costs, Minimum Prices & Margin Calculations", () => {
    it("prohibits merchant from listing a dropship product below supplier minimum price", async () => {
      // 1. Create a platform product with minimum price ৳800.00
      const ppReq = new Request("http://localhost:3000/api/platform-products", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...superAdminHeaders },
        body: JSON.stringify({
          title: "Precision Smart Band",
          description: "OLED fitness tracker with heart rate monitor.",
          category: "electronics",
          minimumPrice: 800,
          suggestedPrice: 1250,
          stockQuantity: 100,
          sku: "PP-SB-800",
        }),
      });

      const ppRes = await postPlatformProductsHandler(ppReq);
      expect(ppRes.status).toBe(201);
      const ppData = await ppRes.json();
      platformProdId = ppData.product.id;

      // 2. Try to list at ৳750 (violating ৳800 minimum)
      const listReq = new Request("http://localhost:3000/api/dropship", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...mediumMerchantHeaders },
        body: JSON.stringify({
          platformProductId: platformProdId,
          sellPrice: 750, // BELOW MINIMUM
          storeSlug,
        }),
      });

      const listRes = await postDropshipHandler(listReq);
      expect(listRes.status).toBe(400);
      const listData = await listRes.json();
      expect(listData.error).toContain("below platform minimum");
    });

    it("allows listing at or above minimum price and computes exact merchant margins", async () => {
      // List at ৳1249.99 (supplier min ৳800.00)
      const listReq = new Request("http://localhost:3000/api/dropship", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...mediumMerchantHeaders },
        body: JSON.stringify({
          platformProductId: platformProdId,
          sellPrice: 1249.99,
          storeSlug,
        }),
      });

      const listRes = await postDropshipHandler(listReq);
      expect(listRes.status).toBe(201);

      // Now place an order for 2 units
      // Margin should be (1249.99 - 800) * 2 = 449.99 * 2 = 899.98
      const orderReq = new Request("http://localhost:3000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeSlug,
          customerName: "Smart Band Buyer",
          customerPhone: "01711555666",
          shippingAddress: { address: "Gulshan 2", district: "Dhaka" },
          items: [
            {
              title: "Precision Smart Band",
              price: 1249.99,
              quantity: 2,
              isDropship: true,
              platformProductId: platformProdId,
            },
          ],
          paymentMethod: "cod",
          shippingFee: 60,
        }),
      });

      const orderRes = await postOrdersHandler(orderReq);
      expect(orderRes.status).toBe(200);

      // Check dropship orders in devStore
      const dsOrders = devStore.getDropshipOrders();
      const matchedDsOrder = dsOrders.find((d) => d.platformProductId === platformProdId);
      expect(matchedDsOrder).toBeDefined();
      expect(matchedDsOrder?.merchantMargin).toBe(899.98);
      expect(matchedDsOrder?.minimumPrice).toBe(800);
      expect(matchedDsOrder?.sellPrice).toBe(1249.99);
      expect(matchedDsOrder?.quantity).toBe(2);
    });
  });

  // ─── 5. ROLLUPS & ANALYTICS SYNCHRONIZATION ────────────────────────────────
  describe("5. Rollup Aggregations & Multi-Tenant Analytics Synchronization", () => {
    it("ensures Super Admin commissions rollup has exact 2-decimal sums", async () => {
      const req = new Request("http://localhost:3000/api/admin/commissions", {
        headers: superAdminHeaders,
      });

      const res = await getCommissionsHandler(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.ok).toBe(true);
      expect(typeof data.summary.pendingTotal).toBe("number");
      expect(typeof data.summary.clearedTotal).toBe("number");

      // Verify no IEEE floating point drift: String representation has at most 2 decimals
      const pendingStr = String(data.summary.pendingTotal);
      if (pendingStr.includes(".")) {
        expect(pendingStr.split(".")[1].length).toBeLessThanOrEqual(2);
      }
    });

    it("ensures Super Admin merchants list has strictly rounded totalRevenue and pendingCommission", async () => {
      const req = new Request("http://localhost:3000/api/admin/merchants", {
        headers: superAdminHeaders,
      });

      const res = await getMerchantsHandler(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.ok).toBe(true);

      const targetMerchant = data.merchants.find((m: any) => m.slug === storeSlug);
      expect(targetMerchant).toBeDefined();
      expect(typeof targetMerchant.totalRevenue).toBe("number");
      expect(typeof targetMerchant.pendingCommissionBdt).toBe("number");

      const revStr = String(targetMerchant.totalRevenue);
      if (revStr.includes(".")) {
        expect(revStr.split(".")[1].length).toBeLessThanOrEqual(2);
      }
    });

    it("ensures store analytics summary avgOrderValue and totalRevenue are strictly rounded", async () => {
      const req = new Request(`http://localhost:3000/api/analytics?storeSlug=${storeSlug}`, {
        headers: mediumMerchantHeaders,
      });

      const res = await getAnalyticsHandler(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.ok).toBe(true);
      expect(typeof data.summary.totalRevenue).toBe("number");
      expect(typeof data.summary.avgOrderValue).toBe("number");

      const aovStr = String(data.summary.avgOrderValue);
      if (aovStr.includes(".")) {
        expect(aovStr.split(".")[1].length).toBeLessThanOrEqual(2);
      }
    });

    it("ensures customer totalSpent rollups are exact to 2 decimal places", () => {
      const customers = devStore.getCustomers(storeSlug);
      for (const cust of customers) {
        const spentStr = String(cust.totalSpent);
        if (spentStr.includes(".")) {
          expect(spentStr.split(".")[1].length).toBeLessThanOrEqual(2);
        }
      }
    });
  });
});
