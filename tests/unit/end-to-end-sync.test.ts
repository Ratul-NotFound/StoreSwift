import { describe, it, expect } from "vitest";
import { devStore } from "@/lib/dev-store";
import { calculateCommission } from "@/lib/plan-limits";

describe("StoreSwift End-to-End Dynamic Sync Pipeline", () => {
  it("initializes stores and seed catalog properly", () => {
    const store = devStore.getStore("apex-fashion");
    expect(store).not.toBeNull();
    expect(store?.name).toBe("Apex Fashion Ltd");
    expect(store?.plan).toBe("free");
    expect(store?.currency).toBe("BDT");

    const prods = devStore.getProducts("apex-fashion");
    expect(prods.length).toBeGreaterThanOrEqual(4);
  });

  it("synchronizes storefront checkout -> merchant dashboard -> super admin", () => {
    // 1. Customer places an order on apex-fashion storefront
    const newOrder = devStore.addOrder({
      storeSlug: "apex-fashion",
      customerName: "Mahir Faysal",
      customerPhone: "01788990011",
      customerEmail: "mahir@storeswift.app",
      shippingAddress: "House 12, Road 7, Dhanmondi, Dhaka",
      district: "Dhaka",
      items: [
        { title: "Signature Pima Cotton Polo", price: 1250, quantity: 2 },
      ],
      paymentMethod: "cod",
      shippingFee: 60,
    });

    expect(newOrder.orderNumber).toContain("SS-");
    expect(newOrder.totalAmount).toBe(2560);
    expect(newOrder.status).toBe("pending");
    expect(newOrder.consignmentId).toContain("ST-");

    // 2. Verified in Merchant Dashboard Orders
    const storeOrders = devStore.getOrders("apex-fashion");
    const foundInMerchant = storeOrders.find((o) => o.orderNumber === newOrder.orderNumber);
    expect(foundInMerchant).toBeDefined();
    expect(foundInMerchant?.customerName).toBe("Mahir Faysal");

    // 3. Verified in Merchant Dashboard Customers (CRM)
    const storeCustomers = devStore.getCustomers("apex-fashion");
    const customer = storeCustomers.find((c) => c.phone === "01788990011");
    expect(customer).toBeDefined();
    expect(customer?.name).toBe("Mahir Faysal");
    expect(customer?.totalSpent).toBeGreaterThanOrEqual(2560);

    // 4. Verified in Super Admin Commission Ledger (8% on Free plan)
    const pendingComms = devStore.getCommissions("pending");
    const comm = pendingComms.find((c) => c.orderNumber === newOrder.orderNumber);
    expect(comm).toBeDefined();
    expect(comm?.commissionRate).toBe(8);
    const expectedComm = calculateCommission("free", newOrder.totalAmount);
    expect(comm?.commissionBdt).toBe(expectedComm);

    // 5. Super Admin clears the commission
    const cleared = devStore.markCommissionCleared(comm!.id);
    expect(cleared).toBe(true);
    const updatedComm = devStore.getCommissions().find((c) => c.id === comm!.id);
    expect(updatedComm?.status).toBe("cleared");
  });

  it("handles coupon application with real discounts at checkout", () => {
    // Coupon WELCOME10 gives 10% off for min order 1000 BDT
    const check1 = devStore.validateCoupon("apex-fashion", "WELCOME10", 2500);
    expect(check1.valid).toBe(true);
    expect(check1.discountAmount).toBe(250);

    // Coupon fails if order is under minimum
    const checkUnder = devStore.validateCoupon("apex-fashion", "WELCOME10", 500);
    expect(checkUnder.valid).toBe(false);
    expect(checkUnder.error).toContain("Minimum order");

    // Invalid coupon code
    const checkInvalid = devStore.validateCoupon("apex-fashion", "FAKE_CODE", 2500);
    expect(checkInvalid.valid).toBe(false);
  });

  it("handles merchant plan upgrade from Free to Medium (৳499) and reduces commission rate", () => {
    // 1. Upgrade apex-fashion to Medium
    const upgraded = devStore.upgradeStore("apex-fashion", "medium", "BKASH-TRX-101");
    expect(upgraded?.plan).toBe("medium");

    // 2. Order placed on upgraded store now incurs only 3% commission (instead of 8%)
    const orderOnMedium = devStore.addOrder({
      storeSlug: "apex-fashion",
      customerName: "Farhana Yasmin",
      customerPhone: "01999887766",
      shippingAddress: "Chittagong",
      district: "Chittagong",
      items: [
        { title: "Signature Pima Cotton Polo", price: 1250, quantity: 1 },
      ],
      paymentMethod: "bkash",
      shippingFee: 120,
    });

    const comm = devStore.getCommissions("pending").find((c) => c.orderNumber === orderOnMedium.orderNumber);
    expect(comm).toBeDefined();
    expect(comm?.commissionRate).toBe(3); // 3% on Medium plan!
    expect(comm?.commissionBdt).toBe(calculateCommission("medium", orderOnMedium.totalAmount));
  });

  it("handles product CRUD and reflects in store catalog", () => {
    const store = devStore.getStore("apex-fashion")!;
    const initialCount = devStore.getProducts("apex-fashion").length;

    // Add product
    const created = devStore.addProduct({
      storeId: store.id,
      storeSlug: store.slug,
      title: "Oversized Vintage Graphic Hoodie",
      slug: "oversized-vintage-hoodie",
      price: 2450,
      comparePrice: 3200,
      stock: 30,
      sku: "HD-VNTG-01",
      category: "clothing",
      imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800",
      status: "active",
    });

    expect(created.id).toContain("prod-");
    expect(devStore.getProducts("apex-fashion").length).toBe(initialCount + 1);

    // Update product
    const updated = devStore.updateProduct(created.id, { price: 2200, stock: 28 });
    expect(updated?.price).toBe(2200);
    expect(updated?.stock).toBe(28);

    // Delete product
    const deleted = devStore.deleteProduct(created.id);
    expect(deleted).toBe(true);
    expect(devStore.getProducts("apex-fashion").length).toBe(initialCount);
  });

  it("handles end-to-end dropshipping: listing -> order -> super admin fulfillment queue", () => {
    // 1. Merchant lists dropship product from platform catalog
    const listed = devStore.listDropshipProduct("apex-fashion", "pp-101", 750);
    expect(listed).not.toBeNull();
    expect(listed?.isDropship).toBe(true);
    expect(listed?.price).toBe(750);

    // 2. Customer buys the dropshipped product on merchant store
    const dsOrder = devStore.addOrder({
      storeSlug: "apex-fashion",
      customerName: "Kamrul Hasan",
      customerPhone: "01555667788",
      shippingAddress: "Sylhet Sadar, Sylhet",
      district: "Sylhet",
      items: [
        {
          title: listed!.title,
          price: 750,
          quantity: 1,
          isDropship: true,
          platformProductId: "pp-101",
        },
      ],
      paymentMethod: "cod",
      shippingFee: 120,
    });

    // 3. Super Admin fulfillment queue receives dropship order
    const queue = devStore.getDropshipOrders("pending");
    const queueItem = queue.find((o) => o.orderNumber === dsOrder.orderNumber);
    expect(queueItem).toBeDefined();
    expect(queueItem?.platformProductId).toBe("pp-101");
    expect(queueItem?.merchantMargin).toBeGreaterThan(0);
    expect(queueItem?.fulfillmentStatus).toBe("pending");

    // 4. Super Admin ships the item with Steadfast tracking code
    const shipped = devStore.updateDropshipStatus(queueItem!.id, "shipped", "ST-DS-99120", "Steadfast Courier");
    expect(shipped).toBe(true);

    const updatedQueueItem = devStore.getDropshipOrders().find((o) => o.id === queueItem!.id);
    expect(updatedQueueItem?.fulfillmentStatus).toBe("shipped");
    expect(updatedQueueItem?.trackingCode).toBe("ST-DS-99120");
  });

  it("computes accurate platform-wide KPIs for Super Admin", () => {
    const kpis = devStore.getPlatformKpis();
    expect(kpis.totalStores).toBeGreaterThanOrEqual(4);
    expect(kpis.mrr).toBeGreaterThan(0);
    expect(kpis.gmv30d).toBeGreaterThan(0);
    expect(kpis.byPlan).toBeDefined();
  });
});
