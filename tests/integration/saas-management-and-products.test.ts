import { describe, it, expect, beforeAll } from "vitest";
import { GET as getKpisHandler } from "../../src/app/api/admin/kpis/route";
import { GET as getMerchantsHandler, PATCH as patchMerchantsHandler } from "../../src/app/api/admin/merchants/route";
import { GET as getCommissionsHandler, PATCH as patchCommissionsHandler } from "../../src/app/api/admin/commissions/route";
import { GET as getDropshipOrdersHandler, PATCH as patchDropshipOrdersHandler } from "../../src/app/api/admin/dropship-orders/route";
import { GET as getAdminSettingsHandler, PATCH as patchAdminSettingsHandler } from "../../src/app/api/admin/settings/route";
import { GET as getAdminAnalyticsHandler } from "../../src/app/api/admin/analytics/route";
import { GET as getPlatformProductsHandler, POST as postPlatformProductsHandler, DELETE as deletePlatformProductsHandler } from "../../src/app/api/platform-products/route";
import { GET as getDropshipHandler, POST as postDropshipHandler, DELETE as deleteDropshipHandler } from "../../src/app/api/dropship/route";
import { GET as getOrdersHandler, POST as postOrdersHandler } from "../../src/app/api/orders/route";
import { devStore } from "../../src/lib/dev-store";
import { signSessionToken } from "../../src/lib/auth";

describe("SaaS Management System & Platform Products End-to-End Suite", () => {
  const secret = "super-secret-key-that-is-at-least-32-chars-long!";
  let superAdminHeaders: { Authorization: string };
  let merchantHeaders: { Authorization: string };
  const testStoreSlug = `saas-store-${Date.now()}`;
  let platformProductId = "";
  let placedOrderId = "";
  let placedDropshipOrderId = "";

  beforeAll(() => {
    process.env.AUTH_SECRET = secret;

    const superAdminToken = signSessionToken({
      userId: "usr-superadmin-1",
      email: "admin@storeswift.app",
      storeId: "platform-admin",
      role: "super_admin",
    }, secret);
    superAdminHeaders = { Authorization: `Bearer ${superAdminToken}` };

    const merchantToken = signSessionToken({
      userId: "usr-merchant-1",
      email: "merchant@storeswift.app",
      storeId: `store-${testStoreSlug}`,
      slug: testStoreSlug,
      role: "merchant_owner",
      plan: "medium", // Medium plan unlocks dropshipping
    }, secret);
    merchantHeaders = { Authorization: `Bearer ${merchantToken}` };

    // Initialize test store in devStore
    devStore.ensureStore(testStoreSlug);
    devStore.upgradeStore(testStoreSlug, "medium", "TRX-INIT-123");
  });

  // ─── 1. PLATFORM PRODUCTS (SUPER ADMIN CATALOG) ───────────────────────────
  describe("1. Platform Products Catalog Management", () => {
    it("allows Super Admin to create a new platform dropship product", async () => {
      const req = new Request("http://localhost:3000/api/platform-products", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...superAdminHeaders },
        body: JSON.stringify({
          title: "StoreSwift Wireless ANC Earbuds V2",
          description: "Studio-quality active noise canceling with 36h battery life.",
          category: "electronics",
          images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800"],
          minimumPrice: 1500,
          suggestedPrice: 2490,
          stockQuantity: 500,
          sku: "PP-ANC-EARBUDS-V2",
        }),
      });

      const res = await postPlatformProductsHandler(req);
      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.ok).toBe(true);
      expect(data.product.id).toBeDefined();
      expect(data.product.title).toBe("StoreSwift Wireless ANC Earbuds V2");
      platformProductId = data.product.id;
    });

    it("lists platform products with normalized minimumPrice, images, and minPrice interoperability", async () => {
      const req = new Request("http://localhost:3000/api/platform-products");
      const res = await getPlatformProductsHandler(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.ok).toBe(true);
      expect(Array.isArray(data.products)).toBe(true);

      const found = data.products.find((p: any) => p.id === platformProductId);
      expect(found).toBeDefined();
      expect(found.minPrice).toBe(1500);
      expect(found.minimumPrice).toBe("1500");
      expect(found.suggestedPrice).toBe(2490);
      expect(Array.isArray(found.images)).toBe(true);
      expect(found.imageUrl).toBeDefined();
    });

    it("rejects unauthorized non-admin attempts to create platform products", async () => {
      const req = new Request("http://localhost:3000/api/platform-products", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...merchantHeaders },
        body: JSON.stringify({
          title: "Malicious Product",
          category: "electronics",
          minimumPrice: 100,
          suggestedPrice: 200,
        }),
      });

      const res = await postPlatformProductsHandler(req);
      expect(res.status).toBe(403);
    });
  });

  // ─── 2. MERCHANT DROPSHIP RESELLING WORKFLOW ──────────────────────────────
  describe("2. Merchant Reselling & Dropship Import Workflow", () => {
    it("allows merchant to import/list the platform product into their store catalog at markup", async () => {
      const req = new Request("http://localhost:3000/api/dropship", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...merchantHeaders },
        body: JSON.stringify({
          storeSlug: testStoreSlug,
          platformProductId,
          myPrice: 2200, // minPrice is 1500 -> ৳700 margin
        }),
      });

      const res = await postDropshipHandler(req);
      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.ok).toBe(true);
      expect(data.listing.platformProductId).toBe(platformProductId);
      expect(data.listing.sellPrice).toBe(2200);

      // Verify product is now present in merchant's catalog
      const storeProducts = devStore.getProducts(testStoreSlug);
      const dropshipInStore = storeProducts.find((p) => p.platformProductId === platformProductId);
      expect(dropshipInStore).toBeDefined();
      expect(dropshipInStore?.price).toBe(2200);
      expect(dropshipInStore?.isDropship).toBe(true);
    });

    it("verifies merchant dropship listings endpoint returns listed product", async () => {
      const req = new Request(`http://localhost:3000/api/dropship?storeSlug=${testStoreSlug}`);
      const res = await getDropshipHandler(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.ok).toBe(true);
      expect(Array.isArray(data.listings)).toBe(true);
      const listed = data.listings.find((l: any) => l.platformProductId === platformProductId);
      expect(listed).toBeDefined();
      expect(listed.price).toBe(2200);
    });
  });

  // ─── 3. STOREFRONT CHECKOUT & AUTOMATIC DROPSHIP QUEUING ───────────────────
  describe("3. Storefront Checkout & Fulfillment Queue Synchronization", () => {
    it("processes customer checkout of dropship item and queues for Super Admin fulfillment", async () => {
      const storeProducts = devStore.getProducts(testStoreSlug);
      const dropshipInStore = storeProducts.find((p) => p.platformProductId === platformProductId)!;

      const orderReq = new Request("http://localhost:3000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeSlug: testStoreSlug,
          customerName: "Tariqul Islam",
          customerPhone: "01712345678",
          customerEmail: "tariq@gmail.com",
          shippingAddress: "House 12, Road 4, Dhanmondi, Dhaka",
          items: [
            {
              id: dropshipInStore.id,
              title: dropshipInStore.title,
              price: 2200,
              quantity: 2,
            },
          ],
          paymentMethod: "cod",
          shippingFee: 60,
        }),
      });

      const orderRes = await postOrdersHandler(orderReq);
      expect(orderRes.status).toBe(200);
      const orderData = await orderRes.json();
      expect(orderData.ok).toBe(true);
      placedOrderId = orderData.orderId;

      // Verify that Super Admin dropship orders queue automatically received this dropship item
      const dropshipReq = new Request("http://localhost:3000/api/admin/dropship-orders?status=pending", {
        headers: superAdminHeaders,
      });
      const dropshipRes = await getDropshipOrdersHandler(dropshipReq);
      expect(dropshipRes.status).toBe(200);
      const dropshipData = await dropshipRes.json();
      expect(dropshipData.ok).toBe(true);

      const matchedDropshipOrder = dropshipData.orders.find(
        (o: any) => o.orderId === placedOrderId || o.product.platformProductId === platformProductId
      );
      expect(matchedDropshipOrder).toBeDefined();
      expect(matchedDropshipOrder.customerName).toBe("Tariqul Islam");
      expect(matchedDropshipOrder.soldPrice).toBe(2200);
      expect(matchedDropshipOrder.minPrice).toBe(1500);
      expect(matchedDropshipOrder.merchantEarns).toBe(1400); // ৳700 margin * 2 units
      expect(matchedDropshipOrder.quantity).toBe(2);
      expect(matchedDropshipOrder.status).toBe("pending");
      placedDropshipOrderId = matchedDropshipOrder.id;
    });

    it("verifies platform commission is accurately recorded based on Medium plan (3%)", async () => {
      const commReq = new Request("http://localhost:3000/api/admin/commissions?status=pending", {
        headers: superAdminHeaders,
      });
      const commRes = await getCommissionsHandler(commReq);
      expect(commRes.status).toBe(200);
      const commData = await commRes.json();
      expect(commData.ok).toBe(true);

      const storeComm = commData.commissions.find((c: any) => c.orderId === placedOrderId);
      expect(storeComm).toBeDefined();
      expect(storeComm.commissionRate).toBe(3); // 3% for medium plan
      // Order total = 2200 * 2 + 60 = 4460; 3% of 4460 = 133.80
      expect(storeComm.commissionBdt).toBe(133.8);
    });
  });

  // ─── 4. SUPER ADMIN FULFILLMENT LIFECYCLE ──────────────────────────────────
  describe("4. Super Admin Fulfillment Lifecycle & End-to-End Status Sync", () => {
    it("Super Admin marks dropship order as shipped with tracking code, syncing store order", async () => {
      const tracking = "ST-BD-982341";
      const patchReq = new Request("http://localhost:3000/api/admin/dropship-orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...superAdminHeaders },
        body: JSON.stringify({
          orderId: placedDropshipOrderId,
          action: "mark_shipped",
          trackingNumber: tracking,
          courierName: "Steadfast Courier",
        }),
      });

      const patchRes = await patchDropshipOrdersHandler(patchReq);
      expect(patchRes.status).toBe(200);
      const patchData = await patchRes.json();
      expect(patchData.ok).toBe(true);
      expect(patchData.status).toBe("shipped");
      expect(patchData.trackingNumber).toBe(tracking);

      // Verify the merchant store order has automatically synchronized to 'shipped'
      const storeOrder = devStore.getOrders(testStoreSlug).find((o) => o.id === placedOrderId);
      expect(storeOrder).toBeDefined();
      expect(storeOrder?.status).toBe("shipped");
      expect(storeOrder?.consignmentId).toBe(tracking);
      expect(storeOrder?.courierName).toBe("Steadfast Courier");
    });

    it("Super Admin marks dropship order as delivered, syncing paymentStatus: paid", async () => {
      const patchReq = new Request("http://localhost:3000/api/admin/dropship-orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...superAdminHeaders },
        body: JSON.stringify({
          orderId: placedDropshipOrderId,
          action: "mark_delivered",
        }),
      });

      const patchRes = await patchDropshipOrdersHandler(patchReq);
      expect(patchRes.status).toBe(200);
      const patchData = await patchRes.json();
      expect(patchData.ok).toBe(true);
      expect(patchData.status).toBe("delivered");

      // Verify the merchant store order has automatically synchronized to 'delivered' & 'paid'
      const storeOrder = devStore.getOrders(testStoreSlug).find((o) => o.id === placedOrderId);
      expect(storeOrder).toBeDefined();
      expect(storeOrder?.status).toBe("delivered");
      expect(storeOrder?.paymentStatus).toBe("paid");
    });
  });

  // ─── 5. MERCHANT UNLIST & CATALOG RE-SYNC ──────────────────────────────────
  describe("5. Merchant Dropship Unlisting & Real-Time Catalog Re-sync", () => {
    it("allows merchant to unlist a dropship item, removing it from their store catalog", async () => {
      const unlistReq = new Request(
        `http://localhost:3000/api/dropship?storeSlug=${testStoreSlug}&platformProductId=${platformProductId}`,
        {
          method: "DELETE",
          headers: merchantHeaders,
        }
      );

      const unlistRes = await deleteDropshipHandler(unlistReq);
      expect(unlistRes.status).toBe(200);
      const unlistData = await unlistRes.json();
      expect(unlistData.ok).toBe(true);

      // Verify product is removed from merchant store catalog
      const storeProducts = devStore.getProducts(testStoreSlug);
      const stillInStore = storeProducts.find((p) => p.platformProductId === platformProductId);
      expect(stillInStore).toBeUndefined();
    });
  });

  // ─── 6. SAAS PLATFORM ADMINISTRATION APIS ──────────────────────────────────
  describe("6. Platform Administration: KPIs, Merchants, Commissions & Settings", () => {
    it("retrieves live platform KPIs including total stores, MRR, and GMV", async () => {
      const req = new Request("http://localhost:3000/api/admin/kpis", {
        headers: superAdminHeaders,
      });
      const res = await getKpisHandler(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.ok).toBe(true);
      expect(data.kpis.totalStores).toBeGreaterThanOrEqual(1);
      expect(data.kpis.mrr).toBeGreaterThanOrEqual(0);
    });

    it("allows Super Admin to suspend and reactivate a merchant store", async () => {
      const suspendReq = new Request("http://localhost:3000/api/admin/merchants", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...superAdminHeaders },
        body: JSON.stringify({
          storeId: testStoreSlug,
          action: "suspend",
        }),
      });

      const suspendRes = await patchMerchantsHandler(suspendReq);
      expect(suspendRes.status).toBe(200);
      const suspendData = await suspendRes.json();
      expect(suspendData.newStatus).toBe("suspended");

      const store = devStore.getStore(testStoreSlug);
      expect(store?.storeStatus).toBe("suspended");

      // Reactivate
      const activateReq = new Request("http://localhost:3000/api/admin/merchants", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...superAdminHeaders },
        body: JSON.stringify({
          storeId: testStoreSlug,
          action: "activate",
        }),
      });

      const activateRes = await patchMerchantsHandler(activateReq);
      expect(activateRes.status).toBe(200);
      expect(devStore.getStore(testStoreSlug)?.storeStatus).toBe("active");
    });

    it("allows Super Admin to clear pending commission payouts", async () => {
      const comms = devStore.getCommissions("pending").filter((c) => c.storeSlug === testStoreSlug);
      if (comms.length > 0) {
        const commIds = comms.map((c) => c.id);
        const clearReq = new Request("http://localhost:3000/api/admin/commissions", {
          method: "PATCH",
          headers: { "Content-Type": "application/json", ...superAdminHeaders },
          body: JSON.stringify({
            ids: commIds,
            action: "clear",
          }),
        });

        const clearRes = await patchCommissionsHandler(clearReq);
        expect(clearRes.status).toBe(200);
        const clearData = await clearRes.json();
        expect(clearData.ok).toBe(true);
        expect(clearData.newStatus).toBe("cleared");
      }
    });

    it("allows Super Admin to update platform-wide settings", async () => {
      const settingsReq = new Request("http://localhost:3000/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...superAdminHeaders },
        body: JSON.stringify({
          platformName: "StoreSwift Cloud",
          commissionRates: { free: 8, medium: 3, pro: 0 },
          dropshippingEnabled: true,
        }),
      });

      const res = await patchAdminSettingsHandler(settingsReq);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.ok).toBe(true);
      expect(data.settings.platformName).toBe("StoreSwift Cloud");
    });

    it("allows Super Admin to delete platform products from catalog", async () => {
      const delReq = new Request(`http://localhost:3000/api/platform-products?id=${platformProductId}`, {
        method: "DELETE",
        headers: superAdminHeaders,
      });

      const delRes = await deletePlatformProductsHandler(delReq);
      expect(delRes.status).toBe(200);
      const delData = await delRes.json();
      expect(delData.ok).toBe(true);

      const stillExists = devStore.getPlatformProducts().find((p) => p.id === platformProductId);
      expect(stillExists).toBeUndefined();
    });
  });
});
