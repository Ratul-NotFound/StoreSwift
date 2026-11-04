/**
 * StoreSwift Unified In-Memory & Dev-Sync Store
 *
 * Provides a resilient, fully dynamic state repository that persists
 * across requests in Node.js runtime (via globalThis) when running
 * in local development or alongside PostgreSQL.
 *
 * Ensures 100% end-to-end synchronization between:
 *  - Storefronts (/store/[tenant])
 *  - Checkout & Orders
 *  - Merchant Dashboard (/store/[tenant]/dashboard)
 *  - Super Admin Panel (/super-admin)
 */

import { verifyAndDeductStock } from "./stock";
import { searchTrie } from "./search-trie";
import { calculateCommission, PLAN_LIMITS } from "./plan-limits";

export type PlanId = "free" | "medium" | "pro";

export interface DevStoreRecord {
  id: string;
  name: string;
  slug: string;
  category: string;
  currency: string;
  plan: PlanId;
  storeStatus: "active" | "suspended" | "archived";
  phone: string;
  email: string;
  address: string;
  template?: string;
  facebookPixel?: string;
  googleAnalytics?: string;
  domain?: {
    domain: string;
    cnameTarget: string;
    verified: boolean;
    sslActive: boolean;
  };
  createdAt: string;
}

export interface DevProduct {
  id: string;
  storeId: string;
  storeSlug: string;
  title: string;
  slug: string;
  description?: string;
  price: number;
  comparePrice?: number;
  stock: number;
  sku: string;
  category: string;
  imageUrl: string;
  status: "active" | "out_of_stock" | "draft";
  isDropship?: boolean;
  platformProductId?: string;
  salesCount: number;
  createdAt: string;
}

export interface DevOrder {
  id: string;
  storeId: string;
  storeSlug: string;
  storeName: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: string;
  district?: string;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed";
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: {
    variantId?: string;
    title: string;
    price: number;
    quantity: number;
    isDropship?: boolean;
    platformProductId?: string;
  }[];
  couponCode?: string;
  discountAmount?: number;
  consignmentId?: string;
  courierName?: string;
  trackingUrl?: string;
  createdAt: string;
}

export interface DevCommission {
  id: string;
  storeId: string;
  storeSlug: string;
  storeName: string;
  orderId: string;
  orderNumber: string;
  orderAmount: number;
  commissionRate: number;
  commissionBdt: number;
  status: "pending" | "cleared";
  clearedAt: string | null;
  createdAt: string;
}

export interface DevCustomer {
  id: string;
  storeId: string;
  storeSlug: string;
  name: string;
  phone: string;
  email?: string;
  district?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderAt: string;
  isLoyal: boolean;
}

export interface DevCoupon {
  id: string;
  storeId: string;
  storeSlug: string;
  code: string;
  type: "flat" | "percent";
  value: number;
  minOrder?: number;
  maxUses?: number;
  usedCount: number;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
}

export interface DevPlatformProduct {
  id: string;
  title: string;
  category: string;
  minPrice: number;
  suggestedPrice: number;
  stockQuantity: number;
  imageUrl?: string;
  description: string;
  status: "active" | "draft";
}

export interface DevDropshipOrder {
  id: string;
  orderId: string;
  orderNumber: string;
  storeId: string;
  storeName: string;
  platformProductId: string;
  productTitle: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  quantity?: number;
  sellPrice: number;
  minimumPrice: number;
  merchantMargin: number;
  fulfillmentStatus: "pending" | "processing" | "shipped" | "delivered";
  trackingCode?: string;
  courierName?: string;
  createdAt: string;
}

export interface DevStoreStaff {
  id: string;
  storeId: string;
  storeSlug: string;
  email: string;
  name: string;
  phone?: string;
  role: "owner" | "manager" | "fulfillment" | "catalog_editor";
  status: "active" | "invited";
  invitedAt: string;
  lastActiveAt?: string;
}

export interface DevAbandonedCart {
  id: string;
  storeSlug: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  items: { title: string; price: number; quantity: number; imageUrl?: string }[];
  totalAmount: number;
  district?: string;
  status: "abandoned" | "converted";
  createdAt: string;
}

export interface DevAuditEvent {
  id: string;
  storeSlug: string;
  action: string;
  actorEmail: string;
  actorRole: string;
  details: string;
  ipAddress?: string;
  timestamp: string;
}

export interface DevStoreNotification {
  id: string;
  storeSlug: string;
  channel: "sms" | "whatsapp" | "email";
  recipient: string;
  template: "order_confirmed" | "order_dispatched" | "low_stock";
  payload: Record<string, any>;
  status: "queued" | "sent" | "failed";
  createdAt: string;
}

class DevStoreManager {
  private stores: Map<string, DevStoreRecord> = new Map();
  private products: Map<string, DevProduct> = new Map();
  private orders: Map<string, DevOrder> = new Map();
  private commissions: Map<string, DevCommission> = new Map();
  private customers: Map<string, DevCustomer> = new Map();
  private coupons: Map<string, DevCoupon> = new Map();
  private platformProducts: Map<string, DevPlatformProduct> = new Map();
  private dropshipOrders: Map<string, DevDropshipOrder> = new Map();
  private staff: Map<string, DevStoreStaff> = new Map();
  private abandonedCarts: Map<string, DevAbandonedCart> = new Map();
  private auditEvents: DevAuditEvent[] = [];
  private notifications: DevStoreNotification[] = [];

  constructor() {
    this.seedDefaultState();
  }

  private seedDefaultState() {
    // 1. Default Stores
    const defaultStores: DevStoreRecord[] = [
      {
        id: "store-apex-fashion",
        name: "Apex Fashion Ltd",
        slug: "apex-fashion",
        category: "fashion",
        currency: "BDT",
        plan: "free",
        template: "minimal",
        storeStatus: "active",
        phone: "01711002233",
        email: "contact@apexfashion.bd",
        address: "House 42, Road 11, Banani, Dhaka-1213",
        createdAt: new Date("2024-01-10").toISOString(),
      },
      {
        id: "store-clothing-store",
        name: "Clothing Co. Boutique",
        slug: "my-clothing-store",
        category: "clothing",
        currency: "BDT",
        plan: "medium",
        template: "clothing",
        storeStatus: "active",
        phone: "01812998877",
        email: "shop@clothingco.bd",
        address: "GEC Circle, Chittagong",
        domain: {
          domain: "clothingco.com.bd",
          cnameTarget: "cname.storeswift.app",
          verified: true,
          sslActive: true,
        },
        createdAt: new Date("2024-02-15").toISOString(),
      },
      {
        id: "store-milano-urban",
        name: "Milano Streetwear",
        slug: "milano-urban-store",
        category: "milano",
        currency: "BDT",
        plan: "pro",
        template: "milano",
        storeStatus: "active",
        phone: "01911445566",
        email: "hello@milanourban.com",
        address: "Dhanmondi 27, Dhaka",
        createdAt: new Date("2024-03-01").toISOString(),
      },
      {
        id: "store-craft-shoes",
        name: "Craft Leather Works",
        slug: "craft-shoes",
        category: "shoes",
        currency: "BDT",
        plan: "medium",
        template: "artisan",
        storeStatus: "active",
        phone: "01611778899",
        email: "info@craftshoes.bd",
        address: "Zindabazar, Sylhet",
        createdAt: new Date("2024-03-20").toISOString(),
      },
    ];

    for (const s of defaultStores) {
      this.stores.set(s.slug, s);
      this.stores.set(s.id, s);
    }

    // 2. Default Platform Products (for Dropshipping)
    const pProducts: DevPlatformProduct[] = [
      {
        id: "pp-101",
        title: "StoreSwift Premium Heavyweight T-Shirt (220 GSM)",
        category: "clothing",
        minPrice: 420,
        suggestedPrice: 750,
        stockQuantity: 1500,
        imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
        description: "100% Combed Compact Cotton, enzyme treated, bio-washed.",
        status: "active",
      },
      {
        id: "pp-102",
        title: "Handcrafted Full-Grain Leather Wallet (Dark Tan)",
        category: "accessories",
        minPrice: 550,
        suggestedPrice: 1100,
        stockQuantity: 340,
        imageUrl: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80",
        description: "Top-grain cowhide leather with 8 card slots and RFID protection.",
        status: "active",
      },
      {
        id: "pp-103",
        title: "Stainless Steel Insulated Thermal Flask (750ml)",
        category: "lifestyle",
        minPrice: 650,
        suggestedPrice: 1250,
        stockQuantity: 620,
        imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80",
        description: "Double wall vacuum insulation, keeps drinks cold 24h / hot 12h.",
        status: "active",
      },
      {
        id: "pp-104",
        title: "Smart Wireless ANC Earbuds (BT 5.3)",
        category: "electronics",
        minPrice: 1200,
        suggestedPrice: 2200,
        stockQuantity: 280,
        imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
        description: "Active Noise Cancellation, 36h battery with case, low-latency gaming mode.",
        status: "active",
      },
      {
        id: "pp-105",
        title: "Organic Wildflower Honey (500g Jar)",
        category: "grocery_food",
        minPrice: 480,
        suggestedPrice: 850,
        stockQuantity: 400,
        imageUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80",
        description: "100% raw unfiltered honey harvested from the Sundarbans mangrove forest.",
        status: "active",
      },
    ];

    for (const pp of pProducts) {
      this.platformProducts.set(pp.id, pp);
    }

    // 3. Default Products for Apex Fashion
    const apexProducts: DevProduct[] = [
      {
        id: "prod-apex-1",
        storeId: "store-apex-fashion",
        storeSlug: "apex-fashion",
        title: "Signature Pima Cotton Polo",
        slug: "signature-pima-polo",
        price: 1250,
        comparePrice: 1750,
        stock: 45,
        sku: "APX-POLO-01",
        category: "clothing",
        imageUrl: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80",
        status: "active",
        salesCount: 88,
        createdAt: new Date("2024-03-01").toISOString(),
      },
      {
        id: "prod-apex-2",
        storeId: "store-apex-fashion",
        storeSlug: "apex-fashion",
        title: "Japanese Raw Selvedge Denim",
        slug: "japanese-selvedge-denim",
        price: 2850,
        comparePrice: 3800,
        stock: 22,
        sku: "APX-JNS-02",
        category: "clothing",
        imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80",
        status: "active",
        salesCount: 54,
        createdAt: new Date("2024-03-05").toISOString(),
      },
      {
        id: "prod-apex-3",
        storeId: "store-apex-fashion",
        storeSlug: "apex-fashion",
        title: "Hand-Crafted Suede Chelsea Boots",
        slug: "suede-chelsea-boots",
        price: 3600,
        comparePrice: 4800,
        stock: 9,
        sku: "APX-SHOE-03",
        category: "shoes",
        imageUrl: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=800&auto=format&fit=crop&q=80",
        status: "active",
        salesCount: 37,
        createdAt: new Date("2024-03-10").toISOString(),
      },
      {
        id: "prod-apex-4",
        storeId: "store-apex-fashion",
        storeSlug: "apex-fashion",
        title: "Tailored Linen Casual Blazer",
        slug: "tailored-linen-blazer",
        price: 4200,
        comparePrice: 5500,
        stock: 14,
        sku: "APX-BLZ-04",
        category: "clothing",
        imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80",
        status: "active",
        salesCount: 29,
        createdAt: new Date("2024-03-12").toISOString(),
      },
    ];

    for (const p of apexProducts) {
      this.products.set(p.id, p);
    }

    // 4. Default Seed Orders
    const initialOrders: DevOrder[] = [
      {
        id: "ord-1001",
        storeId: "store-apex-fashion",
        storeSlug: "apex-fashion",
        storeName: "Apex Fashion Ltd",
        orderNumber: "SS-241101-948",
        customerName: "Tanvir Ahmed",
        customerPhone: "01712345678",
        customerEmail: "tanvir.bd@gmail.com",
        shippingAddress: "House 14, Road 4, Sector 3, Uttara, Dhaka",
        district: "Dhaka",
        subtotal: 2500,
        shippingFee: 60,
        totalAmount: 2560,
        paymentMethod: "cod",
        paymentStatus: "pending",
        status: "pending",
        items: [
          { title: "Signature Pima Cotton Polo", price: 1250, quantity: 2 },
        ],
        consignmentId: "ST-88912",
        courierName: "Steadfast Courier",
        trackingUrl: "https://storeswift.app/track/ST-88912",
        createdAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
      },
      {
        id: "ord-1002",
        storeId: "store-apex-fashion",
        storeSlug: "apex-fashion",
        storeName: "Apex Fashion Ltd",
        orderNumber: "SS-241102-312",
        customerName: "Nusrat Jahan",
        customerPhone: "01898765432",
        customerEmail: "nusrat.jahan@yahoo.com",
        shippingAddress: "Nasirabad Housing Society, Road 2, Chittagong",
        district: "Chittagong",
        subtotal: 2850,
        shippingFee: 120,
        totalAmount: 2970,
        paymentMethod: "bkash",
        paymentStatus: "paid",
        status: "shipped",
        items: [
          { title: "Japanese Raw Selvedge Denim", price: 2850, quantity: 1 },
        ],
        consignmentId: "ST-88925",
        courierName: "Steadfast Courier",
        trackingUrl: "https://storeswift.app/track/ST-88925",
        createdAt: new Date(Date.now() - 3600 * 1000 * 28).toISOString(),
      },
      {
        id: "ord-1003",
        storeId: "store-clothing-store",
        storeSlug: "my-clothing-store",
        storeName: "Clothing Co. Boutique",
        orderNumber: "SS-241103-671",
        customerName: "Mahmudur Rahman",
        customerPhone: "01944556677",
        shippingAddress: "Upashahar Block B, Sylhet",
        district: "Sylhet",
        subtotal: 3600,
        shippingFee: 120,
        totalAmount: 3720,
        paymentMethod: "cod",
        paymentStatus: "paid",
        status: "delivered",
        items: [
          { title: "Hand-Crafted Suede Chelsea Boots", price: 3600, quantity: 1 },
        ],
        consignmentId: "ST-88710",
        courierName: "Steadfast Courier",
        createdAt: new Date(Date.now() - 3600 * 1000 * 50).toISOString(),
      },
      {
        id: "ord-1004",
        storeId: "store-apex-fashion",
        storeSlug: "apex-fashion",
        storeName: "Apex Fashion Ltd",
        orderNumber: "SS-241103-882",
        customerName: "Karim Uddin",
        customerPhone: "01733445566",
        customerEmail: "karim.uddin@gmail.com",
        shippingAddress: "House 5, Road 27, Dhanmondi, Dhaka",
        district: "Dhaka",
        subtotal: 4200,
        shippingFee: 60,
        totalAmount: 4260,
        paymentMethod: "cod",
        paymentStatus: "paid",
        status: "delivered",
        items: [
          { title: "Tailored Linen Casual Blazer", price: 4200, quantity: 1 },
        ],
        consignmentId: "ST-88944",
        courierName: "Steadfast Courier",
        trackingUrl: "https://storeswift.app/track/ST-88944",
        createdAt: new Date(Date.now() - 3600 * 1000 * 72).toISOString(),
      },
      {
        id: "ord-1005",
        storeId: "store-apex-fashion",
        storeSlug: "apex-fashion",
        storeName: "Apex Fashion Ltd",
        orderNumber: "SS-241104-519",
        customerName: "Farida Begum",
        customerPhone: "01655667788",
        customerEmail: "farida.begum@hotmail.com",
        shippingAddress: "Kazir Dewri, Chittagong",
        district: "Chittagong",
        subtotal: 2500,
        discountAmount: 250,
        couponCode: "WELCOME10",
        shippingFee: 120,
        totalAmount: 2370,
        paymentMethod: "bkash",
        paymentStatus: "paid",
        status: "processing",
        items: [
          { title: "Signature Pima Cotton Polo", price: 1250, quantity: 2 },
        ],
        consignmentId: "ST-88961",
        courierName: "Steadfast Courier",
        trackingUrl: "https://storeswift.app/track/ST-88961",
        createdAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
      },
    ];

    for (const o of initialOrders) {
      this.orders.set(o.id, o);
      // Auto-generate commission for each initial order strictly using plan-limits single source of truth
      const store = this.stores.get(o.storeSlug);
      const plan = store?.plan ?? "free";
      const rate = PLAN_LIMITS[plan]?.commissionRate ?? 0;
      const commBdt = calculateCommission(plan, o.totalAmount);
      if (rate > 0) {
        const commId = `comm-${o.id}`;
        this.commissions.set(commId, {
          id: commId,
          storeId: o.storeId,
          storeSlug: o.storeSlug,
          storeName: o.storeName,
          orderId: o.id,
          orderNumber: o.orderNumber,
          orderAmount: o.totalAmount,
          commissionRate: rate,
          commissionBdt: commBdt,
          status: "pending",
          clearedAt: null,
          createdAt: o.createdAt,
        });
      }

      // Upsert initial customer
      this.upsertCustomerInternal({
        storeId: o.storeId,
        storeSlug: o.storeSlug,
        name: o.customerName,
        phone: o.customerPhone,
        email: o.customerEmail,
        district: o.district,
        amount: o.totalAmount,
        orderDate: o.createdAt,
      });
    }

    // 5. Default Coupons
    this.coupons.set("cpn-welcome", {
      id: "cpn-welcome",
      storeId: "store-apex-fashion",
      storeSlug: "apex-fashion",
      code: "WELCOME10",
      type: "percent",
      value: 10,
      minOrder: 1000,
      maxUses: 100,
      usedCount: 14,
      expiresAt: "2028-12-31",
      isActive: true,
      createdAt: new Date("2024-01-01").toISOString(),
    });

    this.coupons.set("cpn-eid100", {
      id: "cpn-eid100",
      storeId: "store-apex-fashion",
      storeSlug: "apex-fashion",
      code: "EID100",
      type: "flat",
      value: 100,
      minOrder: 1500,
      maxUses: 50,
      usedCount: 22,
      expiresAt: "2028-12-31",
      isActive: true,
      createdAt: new Date("2024-03-01").toISOString(),
    });

    // 6. Default Staff Members (Owner for apex-fashion)
    this.staff.set("staff-apex-owner", {
      id: "staff-apex-owner",
      storeId: "store-apex-fashion",
      storeSlug: "apex-fashion",
      email: "merchant@storeswift.app",
      name: "Apex Fashion Admin",
      phone: "01700000000",
      role: "owner",
      status: "active",
      invitedAt: new Date(Date.now() - 3600 * 1000 * 120).toISOString(),
    });

    // 7. Default Abandoned Cart Lead
    this.abandonedCarts.set("cart-apex-101", {
      id: "cart-apex-101",
      storeSlug: "apex-fashion",
      customerName: "Kamrul Hasan",
      customerPhone: "01788990011",
      customerEmail: "kamrul@example.com",
      items: [{ title: "Signature Pima Cotton Polo", price: 1250, quantity: 1 }],
      totalAmount: 1310,
      district: "Dhaka",
      status: "abandoned",
      createdAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
    });

    // 8. Default Security Audit Trail
    this.auditEvents.push({
      id: "audit-init-1",
      storeSlug: "apex-fashion",
      action: "store_created",
      actorEmail: "merchant@storeswift.app",
      actorRole: "owner",
      details: "Store Apex Fashion Ltd provisioned on StoreSwift",
      timestamp: new Date("2024-01-10").toISOString(),
    });
  }

  // ─── STORES ─────────────────────────────────────────────────────────────────

  getStore(slugOrId: string): DevStoreRecord | null {
    return this.stores.get(slugOrId) || this.stores.get(slugOrId.toLowerCase()) || null;
  }

  getAllStores(): DevStoreRecord[] {
    const unique = new Map<string, DevStoreRecord>();
    for (const s of this.stores.values()) {
      unique.set(s.id, s);
    }
    return Array.from(unique.values());
  }

  ensureStore(slug: string, name?: string, category: string = "fashion"): DevStoreRecord {
    const existing = this.getStore(slug);
    if (existing) return existing;

    const defaultTemplate =
      slug.includes("clothing") || slug.includes("cloth") ? "clothing" :
      slug.includes("milano") || slug.includes("street") || slug.includes("urban") ? "milano" :
      slug.includes("nfox") || slug.includes("nickelfox") || slug.includes("yellow") ? "nickelfox" :
      slug.includes("glow") || slug.includes("beauty") || category === "beauty_cosmetics" || category === "beauty" || category === "cosmetics" ? "glow" :
      slug.includes("shoe") || slug.includes("craft") || slug.includes("leather") || category === "shoes" || category === "leather" || category === "footwear" ? "artisan" :
      slug.includes("tech") || slug.includes("cyber") || slug.includes("audio") || category === "electronics" || category === "tech" || category === "gadgets" ? "bold" :
      slug.includes("maison") || slug.includes("jewelry") || slug.includes("luxury") || category === "jewelry" || category === "luxury" || category === "watches" ? "maison" :
      slug.includes("food") || slug.includes("pantry") || slug.includes("organic") || slug.includes("grocery") || category === "grocery_food" || category === "grocery" || category === "pantry" || category === "food" ? "pantry" : "minimal";

    const newStore: DevStoreRecord = {
      id: `store-${slug}`,
      name: name || slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      slug,
      category,
      currency: "BDT",
      plan: "free",
      template: defaultTemplate,
      storeStatus: "active",
      phone: "01700000000",
      email: `${slug}@storeswift.app`,
      address: "Dhaka, Bangladesh",
      createdAt: new Date().toISOString(),
    };

    this.stores.set(slug, newStore);
    this.stores.set(newStore.id, newStore);
    return newStore;
  }

  updateStore(slugOrId: string, updates: Partial<DevStoreRecord>): DevStoreRecord | null {
    const store = this.getStore(slugOrId);
    if (!store) return null;
    Object.assign(store, updates);
    return store;
  }

  upgradeStore(slugOrId: string, plan: PlanId, trxId?: string): DevStoreRecord | null {
    const store = this.getStore(slugOrId);
    if (!store) return null;
    store.plan = plan;
    return store;
  }

  // ─── PRODUCTS ───────────────────────────────────────────────────────────────

  getProduct(id: string): DevProduct | null {
    return this.products.get(id) || null;
  }

  getProducts(slugOrId: string): DevProduct[] {
    const store = this.getStore(slugOrId);
    const targetSlug = store ? store.slug : slugOrId;
    const targetId = store ? store.id : slugOrId;

    return Array.from(this.products.values())
      .filter((p) => p.storeSlug === targetSlug || p.storeId === targetId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  addProduct(product: Partial<DevProduct> & { storeId: string; title: string; price: number }): DevProduct {
    const id = `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const finalSlug = product.slug || product.title.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 50);
    const cleanPrice = Math.max(0, Math.round((Number(product.price) || 0) * 100) / 100);
    const cleanCompare = product.comparePrice !== undefined ? Math.max(0, Math.round((Number(product.comparePrice) || 0) * 100) / 100) : undefined;
    const newProd: DevProduct = {
      sku: product.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      category: product.category || "General",
      imageUrl: product.imageUrl || "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800",
      stock: product.stock ?? 10,
      status: product.status || "active",
      storeSlug: product.storeSlug || product.storeId,
      ...product,
      price: cleanPrice,
      comparePrice: cleanCompare,
      slug: finalSlug,
      id,
      salesCount: 0,
      createdAt: new Date().toISOString(),
    };
    this.products.set(id, newProd);

    // Index into O(L) Prefix Search Trie
    const targetSlug = newProd.storeSlug || newProd.storeId;
    if (targetSlug) {
      searchTrie.indexProduct(targetSlug, newProd);
    }

    return newProd;
  }

  updateProduct(id: string, updates: Partial<DevProduct>): DevProduct | null {
    const prod = this.products.get(id);
    if (!prod) return null;
    const cleanUpdates = { ...updates };
    if (cleanUpdates.price !== undefined) {
      cleanUpdates.price = Math.max(0, Math.round((Number(cleanUpdates.price) || 0) * 100) / 100);
    }
    if (cleanUpdates.comparePrice !== undefined) {
      cleanUpdates.comparePrice = Math.max(0, Math.round((Number(cleanUpdates.comparePrice) || 0) * 100) / 100);
    }
    Object.assign(prod, cleanUpdates);

    // Re-index into Search Trie
    const targetSlug = prod.storeSlug || prod.storeId;
    if (targetSlug) {
      searchTrie.indexProduct(targetSlug, prod);
    }

    return prod;
  }

  deleteProduct(id: string): boolean {
    const prod = this.products.get(id);
    if (prod) {
      const targetSlug = prod.storeSlug || prod.storeId;
      if (targetSlug) {
        searchTrie.removeProduct(targetSlug, id);
      }
    }
    return this.products.delete(id);
  }

  /**
   * High-speed prefix trie search for instant sub-millisecond retrieval.
   * Falls back to getProducts() if query is empty.
   */
  searchProducts(slugOrId: string, query?: string, limit: number = 20): DevProduct[] {
    const store = this.getStore(slugOrId);
    const targetSlug = store ? store.slug : slugOrId;

    if (!query || !query.trim()) {
      return this.getProducts(targetSlug).slice(0, limit);
    }

    const trieMatches = searchTrie.search(targetSlug, query, limit);
    if (trieMatches.length > 0) {
      return trieMatches.map((m) => m.item as DevProduct);
    }

    // Defensive fallback: linear substring search if trie has not yet warm-started
    const q = query.toLowerCase().trim();
    return this.getProducts(targetSlug)
      .filter((p) => p.title.toLowerCase().includes(q) || (p.sku && p.sku.toLowerCase().includes(q)) || (p.description && p.description.toLowerCase().includes(q)))
      .slice(0, limit);
  }

  // ─── ORDERS ─────────────────────────────────────────────────────────────────

  getOrder(id: string): DevOrder | null {
    return this.orders.get(id) || null;
  }

  getOrders(slugOrId?: string): DevOrder[] {
    const all = Array.from(this.orders.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    if (!slugOrId) return all;

    const store = this.getStore(slugOrId);
    const targetSlug = store ? store.slug : slugOrId;
    const targetId = store ? store.id : slugOrId;

    return all.filter((o) => o.storeSlug === targetSlug || o.storeId === targetId);
  }

  addOrder(data: {
    storeSlug: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    shippingAddress: string;
    district?: string;
    items: {
      id?: string;
      variantId?: string;
      title: string;
      price: number;
      quantity: number;
      isDropship?: boolean;
      platformProductId?: string;
    }[];
    paymentMethod: string;
    shippingFee: number;
    couponCode?: string;
    discountAmount?: number;
    trxId?: string;
  }): DevOrder {
    const store = this.ensureStore(data.storeSlug);
    const subtotal = Math.round(data.items.reduce((s, it) => s + it.price * it.quantity, 0) * 100) / 100;
    const discountAmount = Math.min(subtotal, Math.max(0, data.discountAmount ? Math.round(data.discountAmount * 100) / 100 : 0));
    const discountedSubtotal = Math.round((subtotal - discountAmount) * 100) / 100;
    const shippingFee = Math.round(Math.max(0, data.shippingFee || 0) * 100) / 100;
    const totalAmount = Math.round((discountedSubtotal + shippingFee) * 100) / 100;
    const orderNumber = `SS-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const orderId = `ord-${Date.now()}`;
    const consignmentId = `ST-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder: DevOrder = {
      id: orderId,
      storeId: store.id,
      storeSlug: store.slug,
      storeName: store.name,
      orderNumber,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      shippingAddress: data.shippingAddress,
      district: data.district || "Dhaka",
      subtotal,
      discountAmount,
      couponCode: data.couponCode,
      shippingFee,
      totalAmount,
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentMethod === "cod" ? "pending" : "paid",
      status: "pending",
      items: data.items,
      consignmentId,
      courierName: "Steadfast Courier",
      trackingUrl: `https://storeswift.app/track/${consignmentId}`,
      createdAt: new Date().toISOString(),
    };

    this.orders.set(orderId, newOrder);

    // Track coupon usage
    if (data.couponCode) {
      const c = this.getCoupons(store.slug).find(
        (cp) => cp.code.toUpperCase() === data.couponCode!.toUpperCase()
      );
      if (c) c.usedCount++;
    }

    // 1. Calculate & record platform commission based on store plan strictly via plan-limits
    const rate = PLAN_LIMITS[store.plan]?.commissionRate ?? 0;
    const commBdt = calculateCommission(store.plan, totalAmount);
    if (rate > 0) {
      const commId = `comm-${orderId}`;
      this.commissions.set(commId, {
        id: commId,
        storeId: store.id,
        storeSlug: store.slug,
        storeName: store.name,
        orderId,
        orderNumber,
        orderAmount: totalAmount,
        commissionRate: rate,
        commissionBdt: commBdt,
        status: "pending",
        clearedAt: null,
        createdAt: newOrder.createdAt,
      });
    }

    // 2. Upsert customer
    this.upsertCustomerInternal({
      storeId: store.id,
      storeSlug: store.slug,
      name: data.customerName,
      phone: data.customerPhone,
      email: data.customerEmail,
      district: data.district,
      amount: totalAmount,
      orderDate: newOrder.createdAt,
    });

    // 3. Check for dropship items and queue for Super Admin fulfillment
    for (const item of data.items) {
      if (item.isDropship && item.platformProductId) {
        const pp = this.platformProducts.get(item.platformProductId);
        const minPrice = pp ? pp.minPrice : Math.round(item.price * 0.6 * 100) / 100;
        const qty = item.quantity || 1;
        const margin = Math.round(Math.max(0, item.price - minPrice) * qty * 100) / 100;
        const dropshipOrderId = `ds-ord-${orderId}-${Math.floor(Math.random() * 1000)}`;

        this.dropshipOrders.set(dropshipOrderId, {
          id: dropshipOrderId,
          orderId,
          orderNumber,
          storeId: store.id,
          storeName: store.name,
          platformProductId: item.platformProductId,
          productTitle: item.title,
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          shippingAddress: data.shippingAddress,
          quantity: qty,
          sellPrice: item.price,
          minimumPrice: minPrice,
          merchantMargin: margin,
          fulfillmentStatus: "pending",
          createdAt: newOrder.createdAt,
        });
      }
    }

    // 4. Atomic inventory deduction for matching products
    for (const item of data.items) {
      for (const [, prod] of this.products.entries()) {
        if (
          prod &&
          prod.storeSlug === store.slug &&
          (
            (item.id && prod.id === item.id) ||
            (item.title && prod.title && (
              prod.title.toLowerCase() === item.title.toLowerCase() ||
              item.title.toLowerCase().startsWith(prod.title.toLowerCase())
            )) ||
            (item.variantId && (prod.id === item.variantId || prod.sku === item.variantId))
          )
        ) {
          const deduction = verifyAndDeductStock(prod.id, prod.stock, item.quantity);
          if (deduction.success) {
            prod.stock = deduction.newStock;
            if (prod.stock === 0) prod.status = "out_of_stock";
          }
          break;
        }
      }
    }

    // 5. Auto-mark any abandoned cart from this phone as converted
    this.markAbandonedCartConverted(store.slug, data.customerPhone);

    return newOrder;
  }

  updateOrderStatus(orderId: string, status: DevOrder["status"]): DevOrder | null {
    const o = this.orders.get(orderId);
    if (!o) return null;
    o.status = status;
    if (status === "delivered") o.paymentStatus = "paid";

    // Synchronize updates directly back to any associated dropship orders
    for (const ds of this.dropshipOrders.values()) {
      if (ds.orderId === orderId) {
        ds.fulfillmentStatus = status === "cancelled" ? "pending" : (status as any);
      }
    }

    return o;
  }

  // ─── COMMISSIONS ────────────────────────────────────────────────────────────

  getCommissions(statusFilter?: "pending" | "cleared"): DevCommission[] {
    const all = Array.from(this.commissions.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    if (!statusFilter) return all;
    return all.filter((c) => c.status === statusFilter);
  }

  markCommissionCleared(id: string): boolean {
    const comm = this.commissions.get(id);
    if (!comm) return false;
    comm.status = "cleared";
    comm.clearedAt = new Date().toISOString();
    return true;
  }

  // ─── CUSTOMERS ──────────────────────────────────────────────────────────────

  getCustomers(slugOrId: string): DevCustomer[] {
    const store = this.getStore(slugOrId);
    const targetSlug = store ? store.slug : slugOrId;
    const targetId = store ? store.id : slugOrId;

    return Array.from(this.customers.values())
      .filter((c) => c.storeSlug === targetSlug || c.storeId === targetId)
      .sort((a, b) => b.totalSpent - a.totalSpent);
  }

  private upsertCustomerInternal(data: {
    storeId: string;
    storeSlug: string;
    name: string;
    phone: string;
    email?: string;
    district?: string;
    amount: number;
    orderDate: string;
  }) {
    const key = `${data.storeSlug}:${data.phone}`;
    const existing = this.customers.get(key);

    if (existing) {
      existing.name = data.name || existing.name;
      existing.email = data.email || existing.email;
      existing.district = data.district || existing.district;
      existing.totalOrders += 1;
      existing.totalSpent = Math.round((existing.totalSpent + data.amount) * 100) / 100;
      existing.lastOrderAt = data.orderDate;
      existing.isLoyal = existing.totalOrders >= 3;
    } else {
      this.customers.set(key, {
        id: `cust-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        storeId: data.storeId,
        storeSlug: data.storeSlug,
        name: data.name,
        phone: data.phone,
        email: data.email,
        district: data.district || "Dhaka",
        totalOrders: 1,
        totalSpent: Math.round(data.amount * 100) / 100,
        lastOrderAt: data.orderDate,
        isLoyal: false,
      });
    }
  }

  // ─── COUPONS ────────────────────────────────────────────────────────────────

  getCoupons(slugOrId: string): DevCoupon[] {
    const store = this.getStore(slugOrId);
    const targetSlug = store ? store.slug : slugOrId;
    const targetId = store ? store.id : slugOrId;

    return Array.from(this.coupons.values()).filter(
      (c) => c.storeSlug === targetSlug || c.storeId === targetId
    );
  }

  addCoupon(coupon: Omit<DevCoupon, "id" | "usedCount" | "createdAt">): DevCoupon {
    const id = `cpn-${Date.now()}`;
    const newCoupon: DevCoupon = {
      ...coupon,
      id,
      code: coupon.code.toUpperCase().trim(),
      usedCount: 0,
      createdAt: new Date().toISOString(),
    };
    this.coupons.set(id, newCoupon);
    return newCoupon;
  }

  toggleCoupon(id: string, isActive: boolean): boolean {
    const c = this.coupons.get(id);
    if (!c) return false;
    c.isActive = isActive;
    return true;
  }

  deleteCoupon(id: string): boolean {
    return this.coupons.delete(id);
  }

  validateCoupon(storeSlug: string, code: string, orderAmount: number): {
    valid: boolean;
    discountAmount: number;
    coupon?: DevCoupon;
    error?: string;
  } {
    const safeAmount = Math.max(0, isNaN(orderAmount) ? 0 : Math.round(orderAmount * 100) / 100);
    const cleanCode = code.toUpperCase().trim();
    const coupons = this.getCoupons(storeSlug);
    const found = coupons.find((c) => c.code === cleanCode && c.isActive);

    if (!found) {
      return { valid: false, discountAmount: 0, error: "Invalid coupon code." };
    }

    if (found.expiresAt && new Date(found.expiresAt) < new Date()) {
      return { valid: false, discountAmount: 0, error: "Coupon has expired." };
    }

    if (found.maxUses && found.usedCount >= found.maxUses) {
      return { valid: false, discountAmount: 0, error: "Coupon usage limit reached." };
    }

    if (found.minOrder && safeAmount < found.minOrder) {
      return {
        valid: false,
        discountAmount: 0,
        error: `Minimum order of ৳${found.minOrder} required for this coupon.`,
      };
    }

    const rawDiscount =
      found.type === "flat"
        ? Math.min(found.value, safeAmount)
        : (safeAmount * Math.min(100, Math.max(0, found.value))) / 100;

    const discountAmount = Math.min(safeAmount, Math.max(0, Math.round(rawDiscount * 100) / 100));

    return { valid: true, discountAmount, coupon: found };
  }

  // ─── PLATFORM PRODUCTS & DROPSHIP ──────────────────────────────────────────

  getPlatformProducts(): DevPlatformProduct[] {
    return Array.from(this.platformProducts.values());
  }

  addPlatformProduct(p: Omit<DevPlatformProduct, "id">): DevPlatformProduct {
    const id = `pp-${Date.now()}`;
    const item: DevPlatformProduct = { ...p, id };
    this.platformProducts.set(id, item);
    return item;
  }

  deletePlatformProduct(id: string): boolean {
    return this.platformProducts.delete(id);
  }

  unlistDropshipProduct(storeSlug: string, platformProductId: string): boolean {
    const store = this.getStore(storeSlug);
    if (!store) return false;
    for (const [id, prod] of this.products.entries()) {
      if (prod.storeSlug === store.slug && prod.platformProductId === platformProductId) {
        this.products.delete(id);
        return true;
      }
    }
    return false;
  }

  listDropshipProduct(storeSlug: string, platformProductId: string, sellPrice: number): DevProduct | null {
    const store = this.ensureStore(storeSlug);
    const pp = this.platformProducts.get(platformProductId);
    if (!pp) return null;
    const cleanSellPrice = Math.round(sellPrice * 100) / 100;
    if (cleanSellPrice < pp.minPrice) return null;

    // Check if already listed
    const existing = Array.from(this.products.values()).find(
      (p) => p.storeSlug === store.slug && p.platformProductId === platformProductId
    );
    if (existing) {
      existing.price = cleanSellPrice;
      existing.status = "active";
      return existing;
    }

    // Add to store's product catalog
    return this.addProduct({
      storeId: store.id,
      storeSlug: store.slug,
      title: pp.title,
      slug: `${pp.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}-${Math.floor(100 + Math.random() * 900)}`,
      description: pp.description,
      price: cleanSellPrice,
      comparePrice: pp.suggestedPrice > cleanSellPrice ? pp.suggestedPrice : Math.round(cleanSellPrice * 1.3 * 100) / 100,
      stock: pp.stockQuantity,
      sku: `DS-${platformProductId.slice(-6).toUpperCase()}`,
      category: pp.category,
      imageUrl: pp.imageUrl || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800",
      status: "active",
      isDropship: true,
      platformProductId: pp.id,
    });
  }

  getDropshipOrders(statusFilter?: string): DevDropshipOrder[] {
    const all = Array.from(this.dropshipOrders.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    if (!statusFilter || statusFilter === "all") return all;
    return all.filter((o) => o.fulfillmentStatus === statusFilter);
  }

  updateDropshipStatus(
    id: string,
    status: DevDropshipOrder["fulfillmentStatus"],
    trackingCode?: string,
    courierName?: string
  ): boolean {
    const order =
      this.dropshipOrders.get(id) ||
      Array.from(this.dropshipOrders.values()).find(
        (o) => o.id === id || o.orderId === id || o.orderNumber === id
      );
    if (!order) return false;
    order.fulfillmentStatus = status;
    if (trackingCode) order.trackingCode = trackingCode;
    if (courierName) order.courierName = courierName;

    // Synchronize updates directly back to merchant's store order
    if (order.orderId) {
      const storeOrder = this.orders.get(order.orderId);
      if (storeOrder) {
        storeOrder.status = status;
        if (trackingCode) storeOrder.consignmentId = trackingCode;
        if (courierName) storeOrder.courierName = courierName;
        if (status === "delivered") storeOrder.paymentStatus = "paid";
      }
    }

    return true;
  }

  // ─── ANALYTICS ──────────────────────────────────────────────────────────────

  getStoreOverview(slugOrId: string) {
    const store = this.ensureStore(slugOrId);
    const storeOrders = this.getOrders(store.slug);
    const storeProducts = this.getProducts(store.slug);
    const storeCustomers = this.getCustomers(store.slug);

    const totalRevenue = Math.round(storeOrders.reduce((sum, o) => sum + o.totalAmount, 0) * 100) / 100;
    const totalOrders = storeOrders.length;
    const pendingOrders = storeOrders.filter((o) => o.status === "pending").length;
    const lowStockCount = storeProducts.filter((p) => p.stock <= 10).length;

    // Build month names for dynamic chart derived from true store revenue
    const monthNames = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];
    const baseRevenue = totalRevenue > 0 ? totalRevenue : 0;
    const revenueChart = monthNames.map((m, idx) => ({
      label: m,
      value: Math.round((baseRevenue * (0.65 + idx * 0.07)) * 100) / 100,
    }));
    if (revenueChart.length > 0) {
      revenueChart[revenueChart.length - 1].value = totalRevenue;
    }

    const rate = PLAN_LIMITS[store.plan]?.commissionRate ?? 0;
    const commissionPaid = Math.round(((totalRevenue * rate) / 100) * 100) / 100;

    return {
      name: store.name,
      slug: store.slug,
      plan: store.plan,
      totalRevenue,
      totalOrders,
      totalProducts: storeProducts.length,
      totalCustomers: storeCustomers.length,
      revenueChange: totalOrders > 0 ? 18.5 : 0,
      ordersChange: totalOrders > 0 ? 12.0 : 0,
      pendingOrders,
      lowStockCount,
      commissionPaid,
      commissionRate: rate,
      recentOrders: storeOrders.slice(0, 5),
      revenueChart,
    };
  }

  getPlatformKpis() {
    const allStores = this.getAllStores();
    const allOrders = Array.from(this.orders.values());
    const allComms = Array.from(this.commissions.values());

    const planCounts = { free: 0, medium: 0, pro: 0 };
    for (const s of allStores) {
      if (s.plan in planCounts) planCounts[s.plan]++;
    }

    const mrr = planCounts.medium * PLAN_LIMITS.medium.priceBdt + planCounts.pro * PLAN_LIMITS.pro.priceBdt;
    const gmv30d = Math.round(allOrders.reduce((sum, o) => sum + o.totalAmount, 0) * 100) / 100;
    const pendingComms = allComms.filter((c) => c.status === "pending");
    const pendingCommissionBdt = Math.round(pendingComms.reduce((sum, c) => sum + c.commissionBdt, 0) * 100) / 100;

    return {
      totalStores: allStores.length,
      byPlan: planCounts,
      mrr,
      gmv30d,
      pendingCommissionBdt,
      pendingCommissionCount: pendingComms.length,
      activeStores30d: allStores.filter((s) => s.storeStatus === "active").length,
      mrrGrowth: 28,
      gmvGrowth: 34,
      storeGrowth: 19,
    };
  }

  // ─── STAFF & RBAC ──────────────────────────────────────────────────────────

  getStaff(storeSlug: string): DevStoreStaff[] {
    const list = Array.from(this.staff.values()).filter((s) => s.storeSlug === storeSlug);
    if (!list.some((s) => s.role === "owner")) {
      const store = this.getStore(storeSlug);
      const ownerId = `staff-${storeSlug}-owner`;
      const ownerStaff: DevStoreStaff = {
        id: ownerId,
        storeId: store ? store.id : `store-${storeSlug}`,
        storeSlug,
        email: store?.email || `owner@${storeSlug}.bd`,
        name: store ? `${store.name} Owner` : "Store Owner",
        role: "owner",
        status: "active",
        invitedAt: store?.createdAt || new Date().toISOString(),
      };
      this.staff.set(ownerId, ownerStaff);
      list.unshift(ownerStaff);
    }
    return list;
  }

  addStaff(
    storeSlug: string,
    data: Omit<DevStoreStaff, "id" | "storeId" | "storeSlug" | "invitedAt">
  ): DevStoreStaff {
    const store = this.ensureStore(storeSlug);
    const id = `staff-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newStaff: DevStoreStaff = {
      id,
      storeId: store.id,
      storeSlug,
      email: data.email,
      name: data.name,
      phone: data.phone,
      role: data.role,
      status: data.status || "active",
      invitedAt: new Date().toISOString(),
      lastActiveAt: data.lastActiveAt,
    };
    this.staff.set(id, newStaff);
    return newStaff;
  }

  deleteStaff(storeSlug: string, staffId: string): boolean {
    const s = this.staff.get(staffId);
    if (!s || s.storeSlug !== storeSlug || s.role === "owner") return false;
    return this.staff.delete(staffId);
  }

  // ─── ABANDONED CARTS ───────────────────────────────────────────────────────

  recordAbandonedCart(
    storeSlug: string,
    data: Omit<DevAbandonedCart, "id" | "storeSlug" | "createdAt" | "status">
  ): DevAbandonedCart {
    const existing = Array.from(this.abandonedCarts.values()).find(
      (c) => c.storeSlug === storeSlug && c.customerPhone === data.customerPhone && c.status === "abandoned"
    );
    if (existing) {
      existing.items = data.items;
      existing.totalAmount = data.totalAmount;
      existing.customerName = data.customerName;
      if (data.customerEmail) existing.customerEmail = data.customerEmail;
      if (data.district) existing.district = data.district;
      return existing;
    }

    const id = `cart-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newCart: DevAbandonedCart = {
      id,
      storeSlug,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      items: data.items,
      totalAmount: data.totalAmount,
      district: data.district,
      status: "abandoned",
      createdAt: new Date().toISOString(),
    };
    this.abandonedCarts.set(id, newCart);
    return newCart;
  }

  getAbandonedCarts(storeSlug: string): DevAbandonedCart[] {
    return Array.from(this.abandonedCarts.values())
      .filter((c) => c.storeSlug === storeSlug)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  markAbandonedCartConverted(storeSlug: string, customerPhone: string): boolean {
    let matched = false;
    for (const c of this.abandonedCarts.values()) {
      if (c.storeSlug === storeSlug && c.customerPhone === customerPhone) {
        c.status = "converted";
        matched = true;
      }
    }
    return matched;
  }

  // ─── SECURITY AUDIT EVENTS ────────────────────────────────────────────────

  logAuditEvent(
    storeSlug: string,
    event: Omit<DevAuditEvent, "id" | "storeSlug" | "timestamp">
  ): DevAuditEvent {
    const id = `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newEvent: DevAuditEvent = {
      id,
      storeSlug,
      action: event.action,
      actorEmail: event.actorEmail,
      actorRole: event.actorRole,
      details: event.details,
      ipAddress: event.ipAddress,
      timestamp: new Date().toISOString(),
    };
    this.auditEvents.unshift(newEvent);
    if (this.auditEvents.length > 200) this.auditEvents.pop();
    return newEvent;
  }

  getAuditEvents(storeSlug: string): DevAuditEvent[] {
    return this.auditEvents.filter((e) => e.storeSlug === storeSlug);
  }

  // ─── TRANSACTIONAL NOTIFICATIONS ──────────────────────────────────────────

  queueNotification(
    storeSlug: string,
    notification: Omit<DevStoreNotification, "id" | "storeSlug" | "createdAt">
  ): DevStoreNotification {
    const id = `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newNotif: DevStoreNotification = {
      id,
      storeSlug,
      channel: notification.channel,
      recipient: notification.recipient,
      template: notification.template,
      payload: notification.payload,
      status: notification.status || "queued",
      createdAt: new Date().toISOString(),
    };
    this.notifications.unshift(newNotif);
    if (this.notifications.length > 200) this.notifications.pop();
    return newNotif;
  }

  getNotifications(storeSlug: string): DevStoreNotification[] {
    return this.notifications.filter((n) => n.storeSlug === storeSlug);
  }
}

// Ensure single global instance across Next.js API reloads
declare global {
  // eslint-disable-next-line no-var
  var __storeswift_dev_store__: DevStoreManager | undefined;
}

if (!globalThis.__storeswift_dev_store__) {
  globalThis.__storeswift_dev_store__ = new DevStoreManager();
}

export const devStore = globalThis.__storeswift_dev_store__;
