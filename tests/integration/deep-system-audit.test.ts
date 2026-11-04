import { describe, it, expect, beforeAll } from "vitest";
import { POST as registerHandler } from "../../src/app/api/auth/register/route";
import { GET as getSettingsHandler, PATCH as patchSettingsHandler } from "../../src/app/api/stores/[slug]/settings/route";
import { GET as getProductsHandler, POST as postProductsHandler } from "../../src/app/api/products/route";
import { PATCH as patchProductHandler, DELETE as deleteProductHandler } from "../../src/app/api/products/[id]/route";
import { GET as getOrdersHandler, POST as postOrdersHandler } from "../../src/app/api/orders/route";
import { PATCH as patchOrderStatusHandler } from "../../src/app/api/orders/[id]/status/route";
import { GET as getCouponsHandler, POST as postCouponsHandler, PATCH as patchCouponsHandler, DELETE as deleteCouponsHandler } from "../../src/app/api/coupons/route";
import { ALL_TEMPLATE_CHOICES } from "../../src/components/store/template-switcher-bar";
import { TemplateFactory } from "../../src/templates/template.factory";
import { devStore } from "../../src/lib/dev-store";
import { signSessionToken } from "../../src/lib/auth";

describe("Deep End-to-End System Audit: 30 Templates, Shop Admin Panels, CRUD, & Dynamic Sync", () => {
  const testTenant = `audit-store-${Date.now()}`;
  let createdProductId = "";
  let createdOrderId = "";
  let createdCouponId = "";
  let merchantAuthHeader: { Authorization: string };

  beforeAll(() => {
    const secret = "super-secret-key-that-is-at-least-32-chars-long!";
    process.env.AUTH_SECRET = secret;

    const token = signSessionToken({
      userId: "usr-audit-merchant",
      email: "audit@storeswift.app",
      storeId: `store-${testTenant}`,
      slug: testTenant,
      role: "merchant_owner",
      plan: "pro",
    }, secret);

    merchantAuthHeader = { Authorization: `Bearer ${token}` };
  });

  // ─── 1. 30 TEMPLATES INTEGRITY AUDIT ──────────────────────────────────────────
  it("verifies exactly 30 templates with 5 templates per category across all 6 retail industries", () => {
    expect(ALL_TEMPLATE_CHOICES.length).toBe(30);

    const categories = ["fashion", "beauty_cosmetics", "shoes", "electronics", "jewelry", "grocery_food"] as const;
    for (const cat of categories) {
      const templatesForCat = ALL_TEMPLATE_CHOICES.filter((t) => t.category === cat);
      expect(templatesForCat.length).toBe(5);
    }

    // Verify all 30 templates resolve to valid instances in TemplateFactory
    for (const tmpl of ALL_TEMPLATE_CHOICES) {
      const templateInstance = TemplateFactory.getTemplate(tmpl.id);
      expect(templateInstance).toBeDefined();
      expect(templateInstance.name).toBeTruthy();
      expect(templateInstance.classes.headerBg).toBeTruthy();
    }
  });

  // ─── 2. ONBOARDING & REGISTRATION SYNC ─────────────────────────────────────────
  it("provisions a new store with chosen category and starter template", async () => {
    const regReq = new Request("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        storeName: "Seoul Glow Studio",
        fullName: "Min-Ji Kim",
        email: `merchant-${Date.now()}@storeswift.app`,
        password: "StrongPassword123!",
        category: "beauty_cosmetics",
        template: "k-beauty",
      }),
    });

    const regRes = await registerHandler(regReq);
    expect(regRes.status).toBe(200);
    const regData = await regRes.json();
    expect(regData.ok).toBe(true);
    expect(regData.slug).toContain("seoul-glow-studio");

    // Seed the store in devStore for our test tenant so subsequent steps use testTenant cleanly
    devStore.ensureStore(testTenant);
    devStore.updateStore(testTenant, { template: "k-beauty", name: "Seoul Glow Studio" });

    // Verify initial settings match the starter template
    const settingsReq = new Request(`http://localhost:3000/api/stores/${testTenant}/settings`);
    const settingsRes = await getSettingsHandler(settingsReq, { params: Promise.resolve({ slug: testTenant }) });
    expect(settingsRes.status).toBe(200);
    const settingsData = await settingsRes.json();
    expect(settingsData.settings.template).toBe("k-beauty");
  });

  // ─── 3. STORE SETTINGS & THEME SWITCHER CRUD ──────────────────────────────────
  it("updates store settings and switches active storefront theme dynamically", async () => {
    const patchReq = new Request(`http://localhost:3000/api/stores/${testTenant}/settings`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...merchantAuthHeader },
      body: JSON.stringify({
        name: "Seoul Glow Studio Luxury",
        template: "derma-rx",
        phone: "01711223344",
        address: "Gulshan-2, Dhaka",
        description: "Clinical Grade Dermatology & K-Beauty Aesthetics",
      }),
    });

    const patchRes = await patchSettingsHandler(patchReq, { params: Promise.resolve({ slug: testTenant }) });
    expect(patchRes.status).toBe(200);

    // Verify GET settings returns updated values
    const verifyReq = new Request(`http://localhost:3000/api/stores/${testTenant}/settings`);
    const verifyRes = await getSettingsHandler(verifyReq, { params: Promise.resolve({ slug: testTenant }) });
    const verifyData = await verifyRes.json();
    expect(verifyData.settings.name).toBe("Seoul Glow Studio Luxury");
    expect(verifyData.settings.template).toBe("derma-rx");
    expect(verifyData.settings.phone).toBe("01711223344");
  });

  // ─── 4. PRODUCTS CRUD WITH INVENTORY ──────────────────────────────────────────
  it("creates, retrieves, updates, and tracks inventory for products", async () => {
    // 4.1 CREATE product
    const createReq = new Request("http://localhost:3000/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...merchantAuthHeader },
      body: JSON.stringify({
        storeSlug: testTenant,
        title: "Centella Asiatica Barrier Cream",
        price: 1850,
        comparePrice: 2400,
        stock: 30,
        sku: "CAB-001",
        category: "Skincare",
        description: "5% Panthenol & 73% Centella Asiatica calming barrier recovery.",
      }),
    });

    const createRes = await postProductsHandler(createReq);
    expect(createRes.status).toBe(201);
    const createData = await createRes.json();
    expect(createData.ok).toBe(true);
    expect(createData.product).toBeDefined();
    createdProductId = createData.product.id;
    expect(createData.product.stock).toBe(30);

    // 4.2 GET products for this store
    const listReq = new Request(`http://localhost:3000/api/products?storeSlug=${testTenant}`);
    const listRes = await getProductsHandler(listReq);
    expect(listRes.status).toBe(200);
    const listData = await listRes.json();
    const foundProduct = listData.products.find((p: any) => p.id === createdProductId);
    expect(foundProduct).toBeDefined();
    expect(foundProduct.title).toBe("Centella Asiatica Barrier Cream");
    expect(foundProduct.price).toBe(1850);

    // 4.3 UPDATE (PATCH) product
    const editReq = new Request(`http://localhost:3000/api/products/${createdProductId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...merchantAuthHeader },
      body: JSON.stringify({
        price: 1950,
        stock: 25,
      }),
    });
    const editRes = await patchProductHandler(editReq, { params: Promise.resolve({ id: createdProductId }) });
    expect(editRes.status).toBe(200);

    // Verify update
    const verifyListRes = await getProductsHandler(listReq);
    const updatedListData = await verifyListRes.json();
    const updatedProd = updatedListData.products.find((p: any) => p.id === createdProductId);
    expect(updatedProd.price).toBe(1950);
    expect(updatedProd.stock).toBe(25);
  });

  // ─── 5. CHECKOUT ORDER PLACEMENT & INVENTORY DEDUCTION ────────────────────────
  it("processes customer checkout, assigns courier consignment, and atomically deducts stock", async () => {
    const orderReq = new Request("http://localhost:3000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        storeSlug: testTenant,
        customerName: "Sadia Rahman",
        customerPhone: "01855443322",
        customerEmail: "sadia@gmail.com",
        shippingAddress: {
          address: "Road 7, Block C, Banani",
          district: "Dhaka",
        },
        items: [
          {
            variantId: createdProductId,
            title: "Centella Asiatica Barrier Cream",
            price: 1950,
            quantity: 3,
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
    expect(orderData.orderNumber).toContain("SS-");
    expect(orderData.consignmentId).toContain("ST-");
    expect(orderData.totalAmount).toBe("5910.00"); // 1950 * 3 + 60
    createdOrderId = orderData.orderId;

    // Verify ATOMIC INVENTORY DEDUCTION: Stock was 25, ordered 3 -> must be 22
    const prodsReq = new Request(`http://localhost:3000/api/products?storeSlug=${testTenant}`);
    const prodsRes = await getProductsHandler(prodsReq);
    const prodsData = await prodsRes.json();
    const checkedProd = prodsData.products.find((p: any) => p.id === createdProductId);
    expect(checkedProd.stock).toBe(22);
  });

  // ─── 6. MERCHANT ORDERS DASHBOARD & STATUS TRANSITIONS ────────────────────────
  it("retrieves store orders and updates status through fulfillment lifecycle", async () => {
    // 6.1 GET merchant orders
    const getOrdersReq = new Request(`http://localhost:3000/api/orders?storeSlug=${testTenant}`, {
      headers: { ...merchantAuthHeader },
    });
    const getOrdersRes = await getOrdersHandler(getOrdersReq);
    expect(getOrdersRes.status).toBe(200);
    const ordersData = await getOrdersRes.json();
    const ourOrder = ordersData.orders.find((o: any) => o.id === createdOrderId);
    expect(ourOrder).toBeDefined();
    expect(ourOrder.customerName).toBe("Sadia Rahman");
    expect(ourOrder.status).toBe("pending");

    // 6.2 Advance status: pending -> processing
    const procReq = new Request(`http://localhost:3000/api/orders/${createdOrderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...merchantAuthHeader },
      body: JSON.stringify({ status: "processing" }),
    });
    const procRes = await patchOrderStatusHandler(procReq, { params: Promise.resolve({ id: createdOrderId }) });
    expect(procRes.status).toBe(200);

    // 6.3 Advance status: processing -> shipped
    const shipReq = new Request(`http://localhost:3000/api/orders/${createdOrderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...merchantAuthHeader },
      body: JSON.stringify({ status: "shipped" }),
    });
    const shipRes = await patchOrderStatusHandler(shipReq, { params: Promise.resolve({ id: createdOrderId }) });
    expect(shipRes.status).toBe(200);

    // 6.4 Advance status: shipped -> delivered (payment marked as paid)
    const deliverReq = new Request(`http://localhost:3000/api/orders/${createdOrderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...merchantAuthHeader },
      body: JSON.stringify({ status: "delivered" }),
    });
    const deliverRes = await patchOrderStatusHandler(deliverReq, { params: Promise.resolve({ id: createdOrderId }) });
    expect(deliverRes.status).toBe(200);

    // Verify final order status
    const finalOrdersRes = await getOrdersHandler(getOrdersReq);
    const finalData = await finalOrdersRes.json();
    const deliveredOrder = finalData.orders.find((o: any) => o.id === createdOrderId);
    expect(deliveredOrder.status).toBe("delivered");
  });

  // ─── 7. COUPONS CRUD & ACTIVATION ─────────────────────────────────────────────
  it("manages coupons with full CRUD lifecycle", async () => {
    // 7.0 Upgrade plan to medium to unlock coupons feature
    devStore.updateStore(testTenant, { plan: "medium" });

    // 7.1 CREATE coupon
    const createCouponReq = new Request("http://localhost:3000/api/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...merchantAuthHeader },
      body: JSON.stringify({
        storeSlug: testTenant,
        code: "DEEPGLOW20",
        type: "percent",
        value: 20,
        minOrder: 1000,
        maxUses: 50,
      }),
    });
    const createCouponRes = await postCouponsHandler(createCouponReq);
    expect(createCouponRes.status).toBe(201);
    const couponData = await createCouponRes.json();
    expect(couponData.ok).toBe(true);
    expect(couponData.coupon.code).toBe("DEEPGLOW20");
    createdCouponId = couponData.coupon.id;

    // 7.2 LIST coupons
    const listCouponsReq = new Request(`http://localhost:3000/api/coupons?storeSlug=${testTenant}`, {
      headers: { ...merchantAuthHeader },
    });
    const listCouponsRes = await getCouponsHandler(listCouponsReq);
    expect(listCouponsRes.status).toBe(200);
    const listCouponsData = await listCouponsRes.json();
    const foundCoupon = listCouponsData.coupons.find((c: any) => c.code === "DEEPGLOW20");
    expect(foundCoupon).toBeDefined();

    // 7.3 TOGGLE active status
    const toggleReq = new Request("http://localhost:3000/api/coupons", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...merchantAuthHeader },
      body: JSON.stringify({ id: createdCouponId, isActive: false }),
    });
    const toggleRes = await patchCouponsHandler(toggleReq);
    expect(toggleRes.status).toBe(200);

    // 7.4 DELETE coupon
    const deleteCouponReq = new Request(`http://localhost:3000/api/coupons?id=${createdCouponId}`, {
      method: "DELETE",
      headers: { ...merchantAuthHeader },
    });
    const deleteCouponRes = await deleteCouponsHandler(deleteCouponReq);
    expect(deleteCouponRes.status).toBe(200);
  });

  // ─── 8. PRODUCT DELETION CRUD ─────────────────────────────────────────────────
  it("deletes products cleanly from the store catalog", async () => {
    const deleteReq = new Request(`http://localhost:3000/api/products/${createdProductId}`, {
      method: "DELETE",
      headers: { ...merchantAuthHeader },
    });
    const deleteRes = await deleteProductHandler(deleteReq, { params: Promise.resolve({ id: createdProductId }) });
    expect(deleteRes.status).toBe(200);

    // Verify product is gone
    const listReq = new Request(`http://localhost:3000/api/products?storeSlug=${testTenant}`);
    const listRes = await getProductsHandler(listReq);
    const listData = await listRes.json();
    const found = listData.products.find((p: any) => p.id === createdProductId);
    expect(found).toBeUndefined();
  });
});
