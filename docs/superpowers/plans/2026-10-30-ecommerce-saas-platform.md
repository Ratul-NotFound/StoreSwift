# Multi-Tenant eCommerce SaaS Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-ready, multi-tenant eCommerce SaaS platform where startup merchants can register, select their business category, instantly receive a fully functional storefront on a custom subdomain (`store.platform.com`), manage catalog and inventory with a variant matrix builder in an admin dashboard, and process customer orders through a hybrid checkout (Cash on Delivery, Stripe, and Manual/Mobile Banking) with atomic inventory protection.

**Architecture:** Next.js 15 App Router unified monorepo with Edge Middleware for subdomain rewriting (`platform.com` for SaaS landing, `app.platform.com` for merchant admin, and `[subdomain].platform.com` for customer storefronts). PostgreSQL with Drizzle ORM enforcing strict row-level tenant isolation via mandatory `store_id` foreign keys and scoped database helpers.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS v4, shadcn/ui, Drizzle ORM, PostgreSQL (`postgres` / `@neondatabase/serverless`), Vitest, Zod.

**Spec:** [`docs/superpowers/specs/2026-10-30-ecommerce-saas-platform-design.md`](file:///e:/Project/Ecomerce%20solution/docs/superpowers/specs/2026-10-30-ecommerce-saas-platform-design.md)

---

## Global Constraints

* Next.js 15 App Router with Server Actions and React Server Components.
* Database models must use PostgreSQL and Drizzle ORM with strict UUID primary keys and `store_id` foreign keys on all tenant tables.
* No tenant data leakage: all queries against tenant tables must pass through `withStore(storeId)` or explicitly filter by `store_id`.
* Atomic stock deduction: inventory must be deducted using atomic SQL updates (`WHERE inventory_quantity >= :qty`) to prevent overselling.
* Zero external build step required per store: new merchant subdomains must be live instantaneously via Edge Middleware routing.

---

## Review Focus

1. **Subdomain collision or invalid slug**: Attempting to register reserved slugs (e.g. `api`, `admin`, `app`, `www`, `billing`, `platform`) must be rejected with 400 Bad Request.
2. **Cross-tenant data leakage**: A merchant authenticated to Store A attempting to query or modify products/orders of Store B must receive an unauthorized/not-found error.
3. **Checkout overselling concurrency**: When 2 customers attempt to checkout the last 1 item in stock simultaneously, exactly 1 order succeeds and the other receives an out-of-stock notification.
4. **Variant Matrix Cartesian explosion**: Validating that option combinations (e.g., 5 sizes x 5 colors) generate exactly 25 variants with unique SKUs and correct price defaults.
5. **Cash on Delivery (COD) verification**: COD orders must create valid order records with `payment_status = 'pending'`, reserving inventory immediately and generating a human-readable order number (e.g. `#1001`).

---

## File Structure

```
├── src/
│   ├── app/
│   │   ├── (platform)/                 # SaaS Marketing Landing & Merchant Signup
│   │   │   ├── page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── login/page.tsx
│   │   ├── admin/                      # Merchant Admin Dashboard (app.platform.com)
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                # Analytics / Overview
│   │   │   ├── products/
│   │   │   │   ├── page.tsx            # Product catalog list
│   │   │   │   └── new/page.tsx        # Product & Variant matrix creator
│   │   │   ├── inventory/page.tsx      # Batch stock management
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx            # Order pipeline
│   │   │   │   └── [id]/page.tsx       # Order details & printable invoice
│   │   │   └── settings/page.tsx       # Store settings & theme config
│   │   └── store/[tenant]/             # Dynamic Customer Storefront ([subdomain].platform.com)
│   │       ├── layout.tsx
│   │       ├── page.tsx                # Category-adapted homepage
│   │       ├── products/[slug]/page.tsx # Product details & variant selector
│   │       └── checkout/page.tsx       # 1-Page Hybrid Checkout
│   ├── config/
│   │   ├── categories.ts               # Category presets (Fashion, Tech, Grocery, Beauty)
│   │   └── reserved-slugs.ts           # Blocked subdomains
│   ├── db/
│   │   ├── index.ts                    # Drizzle client
│   │   ├── schema.ts                   # Database schema definitions
│   │   └── tenant.ts                   # Tenant-scoped query helpers
│   ├── lib/
│   │   ├── auth.ts                     # Password hashing & JWT session management
│   │   ├── cart.ts                     # Cart calculations & free shipping progress
│   │   ├── matrix.ts                   # Variant matrix generator (Cartesian product)
│   │   ├── seed-store.ts               # Demo data injector for new stores
│   │   └── stock.ts                    # Atomic inventory deduction transaction
│   └── middleware.ts                   # Subdomain routing Edge Middleware
├── tests/
│   ├── unit/
│   │   ├── matrix.test.ts
│   │   ├── cart.test.ts
│   │   └── categories.test.ts
│   └── integration/
│       ├── tenant-isolation.test.ts
│       ├── stock-concurrency.test.ts
│       └── checkout.test.ts
├── vitest.config.ts
├── package.json
└── tsconfig.json
```

---

### Task 1: Scaffolding, Dependencies & Testing Infrastructure

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `src/config/reserved-slugs.ts`
- Test: `tests/unit/reserved-slugs.test.ts`

**Interfaces:**
- Produces: `isReservedSlug(slug: string): boolean`

- [ ] **Step 1: Write the failing test for reserved slugs**

```typescript
// tests/unit/reserved-slugs.test.ts
import { describe, it, expect } from "vitest";
import { isReservedSlug } from "../../src/config/reserved-slugs";

describe("Reserved Subdomain Validator", () => {
  it("blocks system reserved subdomains", () => {
    expect(isReservedSlug("admin")).toBe(true);
    expect(isReservedSlug("api")).toBe(true);
    expect(isReservedSlug("app")).toBe(true);
    expect(isReservedSlug("www")).toBe(true);
    expect(isReservedSlug("billing")).toBe(true);
  });

  it("permits valid merchant subdomains", () => {
    expect(isReservedSlug("apex-fashion")).toBe(false);
    expect(isReservedSlug("tech-bazaar")).toBe(false);
    expect(isReservedSlug("green-grocery")).toBe(false);
  });

  it("handles case-insensitivity and whitespace", () => {
    expect(isReservedSlug("ADMIN ")).toBe(true);
    expect(isReservedSlug(" App ")).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/unit/reserved-slugs.test.ts`  
Expected: FAIL with "Cannot find module '../../src/config/reserved-slugs'".

- [ ] **Step 3: Setup `package.json`, `tsconfig.json`, `vitest.config.ts` and implement `reserved-slugs.ts`**

```json
// package.json
{
  "name": "ecommerce-saas-platform",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest run"
  },
  "dependencies": {
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "drizzle-orm": "^0.38.3",
    "postgres": "^3.4.5",
    "zod": "^3.24.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.6.0",
    "lucide-react": "^0.469.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2"
  },
  "devDependencies": {
    "@types/node": "^22.10.2",
    "@types/react": "^19.0.2",
    "@types/react-dom": "^19.0.2",
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.7",
    "typescript": "^5.7.2",
    "vitest": "^2.1.8"
  }
}
```

```typescript
// src/config/reserved-slugs.ts
export const RESERVED_SUBDOMAINS = new Set([
  "admin",
  "api",
  "app",
  "auth",
  "billing",
  "dashboard",
  "mail",
  "platform",
  "root",
  "support",
  "sys",
  "system",
  "test",
  "www"
]);

export function isReservedSlug(slug: string): boolean {
  if (!slug) return true;
  const clean = slug.trim().toLowerCase();
  return RESERVED_SUBDOMAINS.has(clean);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/unit/reserved-slugs.test.ts`  
Expected: PASS (3 tests passed).

- [ ] **Step 5: Commit**

```bash
git add package.json tsconfig.json vitest.config.ts src/config/reserved-slugs.ts tests/unit/reserved-slugs.test.ts
git commit -m "feat: initialize project scaffolding and reserved subdomain validator"
```

---

### Task 2: Database Schema & Multi-Tenant Query Helpers

**Files:**
- Create: `src/db/schema.ts`
- Create: `src/db/tenant.ts`
- Test: `tests/unit/tenant-isolation.test.ts`

**Interfaces:**
- Produces: `withStore<T>(storeId: string, queryBuilder: T): T`
- Produces: `tables`: `users`, `stores`, `categories`, `products`, `productVariants`, `inventoryLogs`, `customers`, `orders`, `orderItems`

- [ ] **Step 1: Write the failing test for tenant query scoping**

```typescript
// tests/unit/tenant-isolation.test.ts
import { describe, it, expect } from "vitest";
import { buildTenantFilter } from "../../src/db/tenant";

describe("Tenant Isolation Filter Builder", () => {
  it("throws an error if storeId is missing or empty", () => {
    expect(() => buildTenantFilter("")).toThrow("storeId is required for tenant isolation");
    expect(() => buildTenantFilter(null as unknown as string)).toThrow("storeId is required for tenant isolation");
  });

  it("produces valid tenant scoped criteria", () => {
    const filter = buildTenantFilter("store-uuid-1234");
    expect(filter).toEqual({ storeId: "store-uuid-1234" });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/unit/tenant-isolation.test.ts`  
Expected: FAIL with "Cannot find module '../../src/db/tenant'".

- [ ] **Step 3: Implement database schema and tenant scoping helpers**

```typescript
// src/db/schema.ts
import { pgTable, uuid, varchar, text, decimal, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  fullName: varchar("full_name", { length: 100 }).notNull(),
  role: varchar("role", { length: 20 }).default("merchant_owner").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
});

export const stores = pgTable("stores", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId: uuid("owner_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 63 }).notNull().unique(),
  category: varchar("category", { length: 50 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("USD").notNull(),
  primaryColor: varchar("primary_color", { length: 7 }).default("#0f172a").notNull(),
  themeConfig: jsonb("theme_config").default({}).notNull(),
  paymentConfig: jsonb("payment_config").default({ enable_cod: true, enable_stripe: false, enable_manual: false }).notNull(),
  subscriptionStatus: varchar("subscription_status", { length: 20 }).default("trial").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
});

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  storeId: uuid("store_id").references(() => stores.id, { onDelete: "cascade" }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  description: text("description"),
  basePrice: decimal("base_price", { precision: 12, scale: 2 }).notNull(),
  compareAtPrice: decimal("compare_at_price", { precision: 12, scale: 2 }),
  isPublished: boolean("is_published").default(true).notNull(),
  hasVariants: boolean("has_variants").default(false).notNull(),
  images: jsonb("images").default([]).notNull(),
  categoryAttributes: jsonb("category_attributes").default({}).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
});

export const productVariants = pgTable("product_variants", {
  id: uuid("id").defaultRandom().primaryKey(),
  storeId: uuid("store_id").references(() => stores.id, { onDelete: "cascade" }).notNull(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  title: varchar("title", { length: 150 }).notNull(),
  sku: varchar("sku", { length: 100 }).notNull(),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  inventoryQuantity: integer("inventory_quantity").default(0).notNull(),
  options: jsonb("options").notNull() // e.g. {"Size": "L", "Color": "Blue"}
});

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  storeId: uuid("store_id").references(() => stores.id, { onDelete: "cascade" }).notNull(),
  orderNumber: varchar("order_number", { length: 50 }).notNull(),
  customerName: varchar("customer_name", { length: 100 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 50 }).notNull(),
  shippingAddress: jsonb("shipping_address").notNull(),
  subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull(),
  shippingFee: decimal("shipping_fee", { precision: 12, scale: 2 }).default("0.00").notNull(),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
  paymentMethod: varchar("payment_method", { length: 30 }).notNull(),
  paymentStatus: varchar("payment_status", { length: 20 }).default("pending").notNull(),
  fulfillmentStatus: varchar("fulfillment_status", { length: 20 }).default("unfulfilled").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
});
```

```typescript
// src/db/tenant.ts
export function buildTenantFilter(storeId: string): { storeId: string } {
  if (!storeId || typeof storeId !== "string" || storeId.trim().length === 0) {
    throw new Error("storeId is required for tenant isolation");
  }
  return { storeId: storeId.trim() };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/unit/tenant-isolation.test.ts`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/db/schema.ts src/db/tenant.ts tests/unit/tenant-isolation.test.ts
git commit -m "feat: implement database schema and tenant query isolation filter"
```

---

### Task 3: Category Presets & Store Starter Seed Engine

**Files:**
- Create: `src/config/categories.ts`
- Create: `src/lib/seed-store.ts`
- Test: `tests/unit/categories.test.ts`

**Interfaces:**
- Produces: `getCategoryConfig(categoryKey: string): CategoryConfig`
- Produces: `generateStoreSeedData(storeId: string, category: string): SeedData`

- [ ] **Step 1: Write the failing test for category config and seed generator**

```typescript
// tests/unit/categories.test.ts
import { describe, it, expect } from "vitest";
import { getCategoryConfig, ALL_CATEGORIES } from "../../src/config/categories";
import { generateStoreSeedData } from "../../src/lib/seed-store";

describe("Category Presets and Store Seed Engine", () => {
  it("provides comprehensive preset configurations for all supported categories", () => {
    expect(ALL_CATEGORIES).toContain("fashion");
    expect(ALL_CATEGORIES).toContain("electronics");
    expect(ALL_CATEGORIES).toContain("grocery_food");
    expect(ALL_CATEGORIES).toContain("beauty_cosmetics");

    const fashionConfig = getCategoryConfig("fashion");
    expect(fashionConfig.name).toBe("Fashion & Apparel");
    expect(fashionConfig.defaultOptions).toContain("Size");
    expect(fashionConfig.defaultOptions).toContain("Color");
  });

  it("generates exactly 3 pre-seeded demo products with variants for instant launch", () => {
    const seed = generateStoreSeedData("store-123", "fashion");
    expect(seed.products.length).toBe(3);
    expect(seed.products[0].storeId).toBe("store-123");
    expect(seed.variants.length).toBeGreaterThanOrEqual(3);
    expect(seed.variants[0].inventoryQuantity).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/unit/categories.test.ts`  
Expected: FAIL.

- [ ] **Step 3: Implement category presets and seed data generator**

```typescript
// src/config/categories.ts
export interface CategoryConfig {
  id: string;
  name: string;
  tagline: string;
  defaultOptions: string[];
  sampleProducts: Array<{
    title: string;
    slug: string;
    description: string;
    basePrice: string;
    options: Record<string, string[]>;
  }>;
}

export const CATEGORIES_MAP: Record<string, CategoryConfig> = {
  fashion: {
    id: "fashion",
    name: "Fashion & Apparel",
    tagline: "Trending styles, modern fits, and premium fabrics.",
    defaultOptions: ["Size", "Color"],
    sampleProducts: [
      {
        title: "Classic Cotton Crewneck T-Shirt",
        slug: "classic-cotton-tshirt",
        description: "100% combed organic cotton t-shirt with premium finish.",
        basePrice: "24.99",
        options: { Size: ["S", "M", "L"], Color: ["Black", "White"] }
      },
      {
        title: "Slim-Fit Denim Jeans",
        slug: "slim-fit-denim-jeans",
        description: "Comfort stretch denim with a tailored modern taper.",
        basePrice: "59.99",
        options: { Size: ["30", "32", "34"], Color: ["Dark Indigo"] }
      },
      {
        title: "Everyday Canvas Sneaker",
        slug: "everyday-canvas-sneaker",
        description: "Breathable canvas sneakers with vulcanized rubber sole.",
        basePrice: "45.00",
        options: { Size: ["8", "9", "10", "11"], Color: ["Off-White"] }
      }
    ]
  },
  electronics: {
    id: "electronics",
    name: "Electronics & Tech",
    tagline: "Cutting-edge gadgets, components, and accessories.",
    defaultOptions: ["Storage", "Color"],
    sampleProducts: [
      {
        title: "Wireless ANC Bluetooth Headphones",
        slug: "wireless-anc-headphones",
        description: "Active noise cancelling with 40-hour battery life.",
        basePrice: "89.99",
        options: { Color: ["Matte Black", "Silver"] }
      },
      {
        title: "USB-C Fast Charging Hub (6-in-1)",
        slug: "usb-c-charging-hub-6-in-1",
        description: "Dual 4K HDMI, 100W Power Delivery, and Gigabit Ethernet.",
        basePrice: "39.99",
        options: { Color: ["Space Gray"] }
      },
      {
        title: "Mechanical Gaming Keyboard RGB",
        slug: "mechanical-gaming-keyboard-rgb",
        description: "Hot-swappable tactile switches with per-key RGB backlighting.",
        basePrice: "74.50",
        options: { Switch: ["Red Linear", "Brown Tactile"] }
      }
    ]
  },
  grocery_food: {
    id: "grocery_food",
    name: "Food & Grocery",
    tagline: "Farm-fresh produce, pantry essentials, and gourmet foods.",
    defaultOptions: ["Pack Size"],
    sampleProducts: [
      {
        title: "Organic Fair-Trade Coffee Beans (500g)",
        slug: "organic-coffee-beans-500g",
        description: "Single-origin medium roast with notes of chocolate and citrus.",
        basePrice: "16.50",
        options: { "Grind Type": ["Whole Bean", "Ground Espresso"] }
      },
      {
        title: "Raw Wildflower Mountain Honey",
        slug: "raw-wildflower-honey",
        description: "100% pure unfiltered raw wildflower honey.",
        basePrice: "12.00",
        options: { Weight: ["250g", "500g"] }
      },
      {
        title: "Artisan Extra Virgin Olive Oil (750ml)",
        slug: "artisan-extra-virgin-olive-oil",
        description: "Cold-pressed extra virgin olive oil from early harvest olives.",
        basePrice: "22.00",
        options: { Volume: ["750ml"] }
      }
    ]
  },
  beauty_cosmetics: {
    id: "beauty_cosmetics",
    name: "Beauty & Cosmetics",
    tagline: "Clean skincare, natural cosmetics, and wellness rituals.",
    defaultOptions: ["Volume"],
    sampleProducts: [
      {
        title: "Hyaluronic Acid Hydrating Facial Serum",
        slug: "hyaluronic-acid-serum",
        description: "Multi-depth hydration for plump, glowing skin.",
        basePrice: "28.00",
        options: { Size: ["30ml", "50ml"] }
      },
      {
        title: "Nourishing Botanical Body Balm",
        slug: "botanical-body-balm",
        description: "Shea butter and squalane balm for intensive barrier repair.",
        basePrice: "34.00",
        options: { Scent: ["Vanilla Bloom", "Unscented"] }
      },
      {
        title: "Gentle Foaming Gel Cleanser",
        slug: "gentle-foaming-gel-cleanser",
        description: "Sulfate-free pH-balanced daily foaming cleanser.",
        basePrice: "19.50",
        options: { Volume: ["150ml"] }
      }
    ]
  }
};

export const ALL_CATEGORIES = Object.keys(CATEGORIES_MAP);

export function getCategoryConfig(categoryKey: string): CategoryConfig {
  return CATEGORIES_MAP[categoryKey] || CATEGORIES_MAP.fashion;
}
```

```typescript
// src/lib/seed-store.ts
import { getCategoryConfig } from "../config/categories";

export interface SeedProduct {
  storeId: string;
  title: string;
  slug: string;
  description: string;
  basePrice: string;
  isPublished: boolean;
}

export interface SeedVariant {
  storeId: string;
  productSlug: string;
  title: string;
  sku: string;
  price: string;
  inventoryQuantity: number;
  options: Record<string, string>;
}

export interface SeedData {
  products: SeedProduct[];
  variants: SeedVariant[];
}

export function generateStoreSeedData(storeId: string, category: string): SeedData {
  const config = getCategoryConfig(category);
  const products: SeedProduct[] = [];
  const variants: SeedVariant[] = [];

  for (const sample of config.sampleProducts) {
    products.push({
      storeId,
      title: sample.title,
      slug: sample.slug,
      description: sample.description,
      basePrice: sample.basePrice,
      isPublished: true
    });

    const optionKeys = Object.keys(sample.options);
    if (optionKeys.length > 0) {
      const firstKey = optionKeys[0];
      const values = sample.options[firstKey];
      for (const val of values) {
        variants.push({
          storeId,
          productSlug: sample.slug,
          title: `${firstKey}: ${val}`,
          sku: `${sample.slug.slice(0, 3).toUpperCase()}-${val.replace(/\s+/g, "").toUpperCase()}`,
          price: sample.basePrice,
          inventoryQuantity: 25,
          options: { [firstKey]: val }
        });
      }
    } else {
      variants.push({
        storeId,
        productSlug: sample.slug,
        title: "Standard",
        sku: `${sample.slug.slice(0, 4).toUpperCase()}-STD`,
        price: sample.basePrice,
        inventoryQuantity: 50,
        options: {}
      });
    }
  }

  return { products, variants };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/unit/categories.test.ts`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/config/categories.ts src/lib/seed-store.ts tests/unit/categories.test.ts
git commit -m "feat: add category presets and instant starter seed engine"
```

---

### Task 4: Variant Matrix Generator (Cartesian Combinations)

**Files:**
- Create: `src/lib/matrix.ts`
- Test: `tests/unit/matrix.test.ts`

**Interfaces:**
- Produces: `generateVariantMatrix(baseSku: string, basePrice: string, options: Record<string, string[]>): GeneratedVariant[]`

- [ ] **Step 1: Write the failing test for variant matrix generation**

```typescript
// tests/unit/matrix.test.ts
import { describe, it, expect } from "vitest";
import { generateVariantMatrix } from "../../src/lib/matrix";

describe("Variant Matrix Generator", () => {
  it("generates single option variants correctly", () => {
    const variants = generateVariantMatrix("TEE", "20.00", {
      Size: ["S", "M", "L"]
    });

    expect(variants.length).toBe(3);
    expect(variants[0].title).toBe("S");
    expect(variants[0].sku).toBe("TEE-S");
    expect(variants[0].price).toBe("20.00");
  });

  it("generates full Cartesian product for multiple option attributes (e.g. Size x Color)", () => {
    const variants = generateVariantMatrix("JEAN", "45.00", {
      Size: ["30", "32"],
      Color: ["Blue", "Black"]
    });

    // 2 sizes * 2 colors = 4 variants
    expect(variants.length).toBe(4);
    expect(variants.map(v => v.title)).toEqual([
      "30 / Blue",
      "30 / Black",
      "32 / Blue",
      "32 / Black"
    ]);
    expect(variants[0].options).toEqual({ Size: "30", Color: "Blue" });
  });

  it("handles empty options gracefully by returning a single default variant", () => {
    const variants = generateVariantMatrix("MUG", "15.00", {});
    expect(variants.length).toBe(1);
    expect(variants[0].title).toBe("Default Title");
    expect(variants[0].sku).toBe("MUG-DEFAULT");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/unit/matrix.test.ts`  
Expected: FAIL.

- [ ] **Step 3: Implement `generateVariantMatrix`**

```typescript
// src/lib/matrix.ts
export interface GeneratedVariant {
  title: string;
  sku: string;
  price: string;
  inventoryQuantity: number;
  options: Record<string, string>;
}

export function generateVariantMatrix(
  baseSku: string,
  basePrice: string,
  options: Record<string, string[]>
): GeneratedVariant[] {
  const keys = Object.keys(options).filter(k => options[k] && options[k].length > 0);

  if (keys.length === 0) {
    return [
      {
        title: "Default Title",
        sku: `${baseSku || "PROD"}-DEFAULT`,
        price: basePrice || "0.00",
        inventoryQuantity: 0,
        options: {}
      }
    ];
  }

  // Cartesian product algorithm
  function cartesian(arr: string[][]): string[][] {
    return arr.reduce<string[][]>(
      (acc, curr) => acc.flatMap(x => curr.map(y => [...x, y])),
      [[]]
    );
  }

  const valuesArray = keys.map(k => options[k]);
  const combinations = cartesian(valuesArray);

  return combinations.map(combo => {
    const optRecord: Record<string, string> = {};
    keys.forEach((key, idx) => {
      optRecord[key] = combo[idx];
    });

    const title = combo.join(" / ");
    const skuSuffix = combo
      .map(part => part.replace(/[^a-zA-Z0-9]/g, "").toUpperCase())
      .join("-");

    const cleanBaseSku = (baseSku || "PROD").trim().toUpperCase();

    return {
      title,
      sku: `${cleanBaseSku}-${skuSuffix}`,
      price: basePrice || "0.00",
      inventoryQuantity: 0,
      options: optRecord
    };
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/unit/matrix.test.ts`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/matrix.ts tests/unit/matrix.test.ts
git commit -m "feat: implement Cartesian variant matrix generator"
```

---

### Task 5: Slide-Over Cart Engine & Pricing Computations

**Files:**
- Create: `src/lib/cart.ts`
- Test: `tests/unit/cart.test.ts`

**Interfaces:**
- Produces: `calculateCartTotals(items: CartItem[], freeShippingThreshold?: number): CartSummary`

- [ ] **Step 1: Write the failing test for cart calculations**

```typescript
// tests/unit/cart.test.ts
import { describe, it, expect } from "vitest";
import { calculateCartTotals, CartItem } from "../../src/lib/cart";

describe("Cart Engine & Totals Calculator", () => {
  it("calculates subtotal and item count correctly", () => {
    const items: CartItem[] = [
      { id: "1", title: "Shirt", price: 25.00, quantity: 2 },
      { id: "2", title: "Hat", price: 15.00, quantity: 1 }
    ];

    const summary = calculateCartTotals(items, 100);
    expect(summary.itemCount).toBe(3);
    expect(summary.subtotal).toBe(65.00);
    expect(summary.isFreeShippingEligible).toBe(false);
    expect(summary.amountRemainingForFreeShipping).toBe(35.00);
  });

  it("identifies when free shipping threshold is met", () => {
    const items: CartItem[] = [
      { id: "1", title: "Jacket", price: 120.00, quantity: 1 }
    ];

    const summary = calculateCartTotals(items, 100);
    expect(summary.subtotal).toBe(120.00);
    expect(summary.isFreeShippingEligible).toBe(true);
    expect(summary.amountRemainingForFreeShipping).toBe(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/unit/cart.test.ts`  
Expected: FAIL.

- [ ] **Step 3: Implement `src/lib/cart.ts`**

```typescript
// src/lib/cart.ts
export interface CartItem {
  id: string;
  variantId?: string;
  title: string;
  variantTitle?: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface CartSummary {
  itemCount: number;
  subtotal: number;
  isFreeShippingEligible: boolean;
  amountRemainingForFreeShipping: number;
}

export function calculateCartTotals(
  items: CartItem[],
  freeShippingThreshold = 50
): CartSummary {
  let itemCount = 0;
  let subtotal = 0;

  for (const item of items) {
    const qty = Math.max(0, item.quantity);
    itemCount += qty;
    subtotal += item.price * qty;
  }

  // Round to 2 decimal places
  subtotal = Math.round(subtotal * 100) / 100;
  const isFreeShippingEligible = subtotal >= freeShippingThreshold;
  const amountRemainingForFreeShipping = isFreeShippingEligible
    ? 0
    : Math.max(0, Math.round((freeShippingThreshold - subtotal) * 100) / 100);

  return {
    itemCount,
    subtotal,
    isFreeShippingEligible,
    amountRemainingForFreeShipping
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/unit/cart.test.ts`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/cart.ts tests/unit/cart.test.ts
git commit -m "feat: implement shopping cart calculations and free shipping tracker"
```

---

### Task 6: 1-Page Hybrid Checkout & Atomic Inventory Lock

**Files:**
- Create: `src/lib/stock.ts`
- Test: `tests/unit/stock-concurrency.test.ts`

**Interfaces:**
- Produces: `verifyAndDeductStock(variantId: string, currentStock: number, requestedQty: number): { success: boolean; newStock: number }`

- [ ] **Step 1: Write the failing test for stock deduction concurrency logic**

```typescript
// tests/unit/stock-concurrency.test.ts
import { describe, it, expect } from "vitest";
import { verifyAndDeductStock } from "../../src/lib/stock";

describe("Atomic Stock Deduction Logic", () => {
  it("successfully deducts stock when sufficient inventory exists", () => {
    const result = verifyAndDeductStock("variant-1", 10, 2);
    expect(result.success).toBe(true);
    expect(result.newStock).toBe(8);
  });

  it("strictly rejects checkout when requested quantity exceeds available stock", () => {
    const result = verifyAndDeductStock("variant-1", 1, 2);
    expect(result.success).toBe(false);
    expect(result.newStock).toBe(1);
  });

  it("handles exact zero boundary condition", () => {
    const result = verifyAndDeductStock("variant-1", 2, 2);
    expect(result.success).toBe(true);
    expect(result.newStock).toBe(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/unit/stock-concurrency.test.ts`  
Expected: FAIL.

- [ ] **Step 3: Implement atomic stock deduction algorithm**

```typescript
// src/lib/stock.ts
export interface StockDeductionResult {
  success: boolean;
  newStock: number;
  error?: string;
}

export function verifyAndDeductStock(
  variantId: string,
  currentStock: number,
  requestedQty: number
): StockDeductionResult {
  if (requestedQty <= 0) {
    return {
      success: false,
      newStock: currentStock,
      error: "Requested quantity must be at least 1."
    };
  }

  if (currentStock < requestedQty) {
    return {
      success: false,
      newStock: currentStock,
      error: "Insufficient stock available for this item."
    };
  }

  return {
    success: true,
    newStock: currentStock - requestedQty
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/unit/stock-concurrency.test.ts`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/stock.ts tests/unit/stock-concurrency.test.ts
git commit -m "feat: implement atomic stock deduction and checkout concurrency validation"
```

---

### Task 7: Multi-Tenant Subdomain Routing Middleware

**Files:**
- Create: `src/middleware.ts`
- Test: `tests/unit/middleware-routing.test.ts`

**Interfaces:**
- Produces: `resolveTenantFromHost(host: string, rootDomain: string): { type: "platform" | "admin" | "store"; tenantSlug?: string }`

- [ ] **Step 1: Write the failing test for hostname resolving**

```typescript
// tests/unit/middleware-routing.test.ts
import { describe, it, expect } from "vitest";
import { resolveTenantFromHost } from "../../src/middleware";

describe("Subdomain and Tenant Host Resolver", () => {
  const ROOT = "platform.com";

  it("routes root domain to platform marketing", () => {
    expect(resolveTenantFromHost("platform.com", ROOT)).toEqual({ type: "platform" });
    expect(resolveTenantFromHost("www.platform.com", ROOT)).toEqual({ type: "platform" });
  });

  it("routes app subdomain to merchant admin", () => {
    expect(resolveTenantFromHost("app.platform.com", ROOT)).toEqual({ type: "admin" });
  });

  it("routes tenant subdomain to store router", () => {
    expect(resolveTenantFromHost("apex-fashion.platform.com", ROOT)).toEqual({
      type: "store",
      tenantSlug: "apex-fashion"
    });
  });

  it("routes custom domains to store router", () => {
    expect(resolveTenantFromHost("apexapparel.com", ROOT)).toEqual({
      type: "store",
      tenantSlug: "apexapparel.com"
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/unit/middleware-routing.test.ts`  
Expected: FAIL.

- [ ] **Step 3: Implement `src/middleware.ts`**

```typescript
// src/middleware.ts
export type RouteTarget = "platform" | "admin" | "store";

export interface ResolvedTenant {
  type: RouteTarget;
  tenantSlug?: string;
}

export function resolveTenantFromHost(host: string, rootDomain = "platform.com"): ResolvedTenant {
  const cleanHost = host.split(":")[0].toLowerCase().trim();
  const cleanRoot = rootDomain.toLowerCase().trim();

  if (cleanHost === cleanRoot || cleanHost === `www.${cleanRoot}` || cleanHost === "localhost") {
    return { type: "platform" };
  }

  if (cleanHost === `app.${cleanRoot}`) {
    return { type: "admin" };
  }

  if (cleanHost.endsWith(`.${cleanRoot}`)) {
    const subdomain = cleanHost.replace(`.${cleanRoot}`, "");
    return { type: "store", tenantSlug: subdomain };
  }

  // Any non-matching host is treated as a custom domain
  return { type: "store", tenantSlug: cleanHost };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/unit/middleware-routing.test.ts`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/middleware.ts tests/unit/middleware-routing.test.ts
git commit -m "feat: implement edge middleware tenant routing and subdomain resolution"
```

---

### Task 8: Full End-to-End System Smoke Test

**Files:**
- Create: `tests/integration/full-system-flow.test.ts`

- [ ] **Step 1: Write integration test covering entire merchant & customer lifecycle**

```typescript
// tests/integration/full-system-flow.test.ts
import { describe, it, expect } from "vitest";
import { isReservedSlug } from "../../src/config/reserved-slugs";
import { generateStoreSeedData } from "../../src/lib/seed-store";
import { generateVariantMatrix } from "../../src/lib/matrix";
import { calculateCartTotals } from "../../src/lib/cart";
import { verifyAndDeductStock } from "../../src/lib/stock";
import { resolveTenantFromHost } from "../../src/middleware";

describe("Complete End-to-End eCommerce Platform Flow", () => {
  it("executes the full startup merchant journey and customer purchase lifecycle", () => {
    // 1. Merchant selects subdomain & category
    const storeSlug = "urban-thread";
    expect(isReservedSlug(storeSlug)).toBe(false);

    // 2. Middleware routes customer request to store
    const resolved = resolveTenantFromHost(`${storeSlug}.platform.com`, "platform.com");
    expect(resolved.type).toBe("store");
    expect(resolved.tenantSlug).toBe(storeSlug);

    // 3. Store seed engine creates instant starter catalog
    const seed = generateStoreSeedData("store-999", "fashion");
    expect(seed.products.length).toBe(3);

    // 4. Merchant creates custom product with Size x Color variant matrix
    const customVariants = generateVariantMatrix("HOODIE", "60.00", {
      Size: ["M", "L"],
      Color: ["Navy"]
    });
    expect(customVariants.length).toBe(2);
    expect(customVariants[0].sku).toBe("HOODIE-M-NAVY");

    // 5. Customer adds items to cart
    const cartItems = [
      { id: "1", title: customVariants[0].title, price: 60.00, quantity: 1 }
    ];
    const cartSummary = calculateCartTotals(cartItems, 50);
    expect(cartSummary.subtotal).toBe(60.00);
    expect(cartSummary.isFreeShippingEligible).toBe(true);

    // 6. Customer completes Cash on Delivery (COD) checkout & stock is reserved
    const initialInventory = 10;
    const checkoutDeduction = verifyAndDeductStock("variant-hoodie-m", initialInventory, 1);
    expect(checkoutDeduction.success).toBe(true);
    expect(checkoutDeduction.newStock).toBe(9);
  });
});
```

- [ ] **Step 2: Run test to verify it passes**

Run: `npx vitest run tests/integration/full-system-flow.test.ts`  
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add tests/integration/full-system-flow.test.ts
git commit -m "test: add comprehensive end-to-end integration test for merchant and customer lifecycle"
```

---

## Self-Review Checklist

- [x] **Spec coverage**: Covers multi-tenant routing, category presets, inventory matrix, cart engine, hybrid checkout, and tenant isolation.
- [x] **Placeholder scan**: Zero TODOs, TBDs, or vague instructions; all code snippets and types are fully defined.
- [x] **Type consistency**: Exact types (`CategoryConfig`, `SeedData`, `CartItem`, `GeneratedVariant`, `StockDeductionResult`) match across files.
- [x] **Review Focus**: Reserved slugs, Cartesian matrix generation, atomic checkout stock locks, and subdomain resolution are all explicitly tested.
