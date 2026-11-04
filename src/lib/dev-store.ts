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
  sellPrice: number;
  minimumPrice: number;
  merchantMargin: number;
  fulfillmentStatus: "pending" | "processing" | "shipped" | "delivered";
  trackingCode?: string;
  courierName?: string;
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
    ];

    for (const o of initialOrders) {
      this.orders.set(o.id, o);
      // Auto-generate commission for each initial order
      const store = this.stores.get(o.storeSlug);
      const plan = store?.plan ?? "free";
      const rate = plan === "free" ? 8 : plan === "medium" ? 3 : 0;
      if (rate > 0) {
        const commBdt = parseFloat(((o.totalAmount * rate) / 100).toFixed(2));
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
    const newProd: DevProduct = {
      sku: product.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      category: product.category || "General",
      imageUrl: product.imageUrl || "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800",
      stock: product.stock ?? 10,
      status: product.status || "active",
      storeSlug: product.storeSlug || product.storeId,
      ...product,
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
    Object.assign(prod, updates);

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
    trxId?: string;
  }): DevOrder {
    const store = this.ensureStore(data.storeSlug);
    const subtotal = data.items.reduce((s, it) => s + it.price * it.quantity, 0);
    const totalAmount = subtotal + data.shippingFee;
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
      shippingFee: data.shippingFee,
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

    // 1. Calculate & record platform commission based on store plan
    const rate = store.plan === "free" ? 8 : store.plan === "medium" ? 3 : 0;
    if (rate > 0) {
      const commBdt = parseFloat(((totalAmount * rate) / 100).toFixed(2));
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
        const minPrice = pp ? pp.minPrice : item.price * 0.6;
        const margin = Math.max(0, item.price - minPrice);
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

    return newOrder;
  }

  updateOrderStatus(orderId: string, status: DevOrder["status"]): DevOrder | null {
    const o = this.orders.get(orderId);
    if (!o) return null;
    o.status = status;
    if (status === "delivered") o.paymentStatus = "paid";
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
      existing.totalSpent += data.amount;
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
        totalSpent: data.amount,
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

    if (found.minOrder && orderAmount < found.minOrder) {
      return {
        valid: false,
        discountAmount: 0,
        error: `Minimum order of ৳${found.minOrder} required for this coupon.`,
      };
    }

    const discountAmount =
      found.type === "flat"
        ? Math.min(found.value, orderAmount)
        : Math.round((orderAmount * found.value) / 100);

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

  listDropshipProduct(storeSlug: string, platformProductId: string, sellPrice: number): DevProduct | null {
    const store = this.ensureStore(storeSlug);
    const pp = this.platformProducts.get(platformProductId);
    if (!pp) return null;
    if (sellPrice < pp.minPrice) return null;

    // Check if already listed
    const existing = Array.from(this.products.values()).find(
      (p) => p.storeSlug === store.slug && p.platformProductId === platformProductId
    );
    if (existing) {
      existing.price = sellPrice;
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
      price: sellPrice,
      comparePrice: pp.suggestedPrice > sellPrice ? pp.suggestedPrice : Math.round(sellPrice * 1.3),
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
    const order = this.dropshipOrders.get(id);
    if (!order) return false;
    order.fulfillmentStatus = status;
    if (trackingCode) order.trackingCode = trackingCode;
    if (courierName) order.courierName = courierName;
    return true;
  }

  // ─── ANALYTICS ──────────────────────────────────────────────────────────────

  getStoreOverview(slugOrId: string) {
    const store = this.ensureStore(slugOrId);
    const storeOrders = this.getOrders(store.slug);
    const storeProducts = this.getProducts(store.slug);
    const storeCustomers = this.getCustomers(store.slug);

    const totalRevenue = storeOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalOrders = storeOrders.length;
    const pendingOrders = storeOrders.filter((o) => o.status === "pending").length;
    const lowStockCount = storeProducts.filter((p) => p.stock <= 10).length;

    // Build 6-month chart
    const monthNames = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];
    const baseRevenue = Math.max(totalRevenue, 45000);
    const revenueChart = monthNames.map((m, idx) => ({
      label: m,
      value: Math.round(baseRevenue * (0.45 + idx * 0.11)),
    }));
    revenueChart[revenueChart.length - 1].value = totalRevenue > 0 ? totalRevenue : 84500;

    const isDemoStore = store.slug === "apex-fashion";

    return {
      name: store.name,
      slug: store.slug,
      plan: store.plan,
      totalRevenue: totalRevenue > 0 ? totalRevenue : (isDemoStore ? 184500 : 0),
      totalOrders: totalOrders > 0 ? totalOrders : (isDemoStore ? 213 : 0),
      totalProducts: storeProducts.length > 0 ? storeProducts.length : (isDemoStore ? 38 : 0),
      totalCustomers: storeCustomers.length > 0 ? storeCustomers.length : (isDemoStore ? 142 : 0),
      revenueChange: isDemoStore ? 24 : 0,
      ordersChange: isDemoStore ? 18 : 0,
      pendingOrders,
      lowStockCount,
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

    const mrr = planCounts.medium * 499 + planCounts.pro * 999;
    const gmv30d = allOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const pendingComms = allComms.filter((c) => c.status === "pending");
    const pendingCommissionBdt = pendingComms.reduce((sum, c) => sum + c.commissionBdt, 0);

    return {
      totalStores: allStores.length,
      byPlan: planCounts,
      mrr,
      gmv30d: gmv30d > 0 ? gmv30d : 486000,
      pendingCommissionBdt,
      pendingCommissionCount: pendingComms.length,
      activeStores30d: allStores.filter((s) => s.storeStatus === "active").length,
      mrrGrowth: 28,
      gmvGrowth: 34,
      storeGrowth: 19,
    };
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
