import {
  pgTable, uuid, varchar, text, decimal, integer,
  boolean, timestamp, jsonb, uniqueIndex, date, index
} from "drizzle-orm/pg-core";

// ─── USERS ────────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id:           uuid("id").defaultRandom().primaryKey(),
  email:        varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  fullName:     varchar("full_name", { length: 100 }).notNull(),
  role:         varchar("role", { length: 20 }).default("merchant_owner").notNull(),
  // role values: "super_admin" | "merchant_owner" | "staff"
  phone:        varchar("phone", { length: 20 }),
  avatarUrl:    text("avatar_url"),
  emailVerified: boolean("email_verified").default(false).notNull(),
  createdAt:    timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt:    timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── STORES ───────────────────────────────────────────────────────────────────

export const stores = pgTable("stores", {
  id:                 uuid("id").defaultRandom().primaryKey(),
  ownerId:            uuid("owner_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  name:               varchar("name", { length: 100 }).notNull(),
  slug:               varchar("slug", { length: 63 }).notNull().unique(),
  category:           varchar("category", { length: 50 }).notNull(),
  currency:           varchar("currency", { length: 10 }).default("BDT").notNull(),
  plan:               varchar("plan", { length: 20 }).default("free").notNull(),
  // plan values: "free" | "medium" | "pro"
  storeStatus:        varchar("store_status", { length: 20 }).default("active").notNull(),
  // status: "active" | "suspended" | "archived"
  primaryColor:       varchar("primary_color", { length: 7 }).default("#18181b").notNull(),
  themeConfig:        jsonb("theme_config").default({}).notNull(),
  paymentConfig:      jsonb("payment_config").default({ enable_cod: true, enable_bkash: false, enable_nagad: false }).notNull(),
  announcementText:   text("announcement_text"),
  metaTitle:          varchar("meta_title", { length: 255 }),
  metaDescription:    text("meta_description"),
  subscriptionStatus: varchar("subscription_status", { length: 20 }).default("trial").notNull(),
  createdAt:          timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt:          timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── SUBSCRIPTIONS ────────────────────────────────────────────────────────────

export const subscriptions = pgTable("subscriptions", {
  id:            uuid("id").defaultRandom().primaryKey(),
  storeId:       uuid("store_id").references(() => stores.id, { onDelete: "cascade" }).notNull().unique(),
  plan:          varchar("plan", { length: 20 }).notNull().default("free"),
  status:        varchar("status", { length: 20 }).notNull().default("active"),
  // status: "active" | "cancelled" | "past_due" | "trial"
  billingCycle:  varchar("billing_cycle", { length: 20 }).default("monthly"),
  priceBdt:      integer("price_bdt").notNull().default(0),
  paymentMethod: varchar("payment_method", { length: 30 }),
  // payment_method: "bkash" | "nagad" | "card" | null (free)
  bkashNumber:   varchar("bkash_number", { length: 20 }),
  startedAt:     timestamp("started_at", { withTimezone: true }).defaultNow().notNull(),
  renewsAt:      timestamp("renews_at", { withTimezone: true }),
  cancelledAt:   timestamp("cancelled_at", { withTimezone: true }),
  trialEndsAt:   timestamp("trial_ends_at", { withTimezone: true }),
  createdAt:     timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt:     timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── INVOICES ────────────────────────────────────────────────────────────────

export const invoices = pgTable("invoices", {
  id:            uuid("id").defaultRandom().primaryKey(),
  storeId:       uuid("store_id").references(() => stores.id).notNull(),
  plan:          varchar("plan", { length: 20 }).notNull(),
  amountBdt:     integer("amount_bdt").notNull(),
  status:        varchar("status", { length: 20 }).default("paid").notNull(),
  // status: "paid" | "unpaid" | "refunded"
  paymentMethod: varchar("payment_method", { length: 30 }),
  transactionId: varchar("transaction_id", { length: 100 }),
  periodStart:   date("period_start").notNull(),
  periodEnd:     date("period_end").notNull(),
  issuedAt:      timestamp("issued_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── COMMISSION EVENTS ────────────────────────────────────────────────────────

export const commissionEvents = pgTable("commission_events", {
  id:             uuid("id").defaultRandom().primaryKey(),
  storeId:        uuid("store_id").references(() => stores.id).notNull(),
  orderId:        uuid("order_id").references(() => orders.id).notNull(),
  orderAmount:    decimal("order_amount", { precision: 12, scale: 2 }).notNull(),
  commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }).notNull(),
  commissionBdt:  decimal("commission_bdt", { precision: 12, scale: 2 }).notNull(),
  status:         varchar("status", { length: 20 }).default("pending").notNull(),
  // status: "pending" | "cleared" | "disputed"
  clearedAt:      timestamp("cleared_at", { withTimezone: true }),
  createdAt:      timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  storeStatusIdx: index("ce_store_status_idx").on(t.storeId, t.status),
}));

// ─── PLATFORM PRODUCTS (Dropshipping Catalog) ─────────────────────────────────

export const platformProducts = pgTable("platform_products", {
  id:             uuid("id").defaultRandom().primaryKey(),
  title:          varchar("title", { length: 255 }).notNull(),
  description:    text("description"),
  category:       varchar("category", { length: 80 }).notNull(),
  images:         jsonb("images").default([]).notNull(),
  minimumPrice:   decimal("minimum_price", { precision: 12, scale: 2 }).notNull(),
  suggestedPrice: decimal("suggested_price", { precision: 12, scale: 2 }).notNull(),
  stockQuantity:  integer("stock_quantity").notNull().default(0),
  sku:            varchar("sku", { length: 100 }).unique(),
  status:         varchar("status", { length: 20 }).default("active").notNull(),
  // status: "active" | "draft" | "discontinued"
  createdAt:      timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt:      timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── DROPSHIP LISTINGS ────────────────────────────────────────────────────────

export const dropshipListings = pgTable("dropship_listings", {
  id:                uuid("id").defaultRandom().primaryKey(),
  storeId:           uuid("store_id").references(() => stores.id, { onDelete: "cascade" }).notNull(),
  platformProductId: uuid("platform_product_id").references(() => platformProducts.id).notNull(),
  sellPrice:         decimal("sell_price", { precision: 12, scale: 2 }).notNull(),
  isActive:          boolean("is_active").default(true).notNull(),
  listedAt:          timestamp("listed_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt:         timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  storeProductUniq: uniqueIndex("dl_store_product_idx").on(t.storeId, t.platformProductId),
}));

// ─── DROPSHIP ORDER ITEMS ────────────────────────────────────────────────────

export const dropshipOrderItems = pgTable("dropship_order_items", {
  id:                uuid("id").defaultRandom().primaryKey(),
  orderId:           uuid("order_id").references(() => orders.id).notNull(),
  orderItemId:       uuid("order_item_id").references(() => orderItems.id),
  platformProductId: uuid("platform_product_id").references(() => platformProducts.id).notNull(),
  sellPrice:         decimal("sell_price", { precision: 12, scale: 2 }).notNull(),
  minimumPrice:      decimal("minimum_price", { precision: 12, scale: 2 }).notNull(),
  merchantMargin:    decimal("merchant_margin", { precision: 12, scale: 2 }).notNull(),
  fulfillmentStatus: varchar("fulfillment_status", { length: 20 }).default("pending").notNull(),
  platformShippedAt: timestamp("platform_shipped_at", { withTimezone: true }),
  createdAt:         timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── STORE CUSTOMERS ──────────────────────────────────────────────────────────

export const storeCustomers = pgTable("store_customers", {
  id:          uuid("id").defaultRandom().primaryKey(),
  storeId:     uuid("store_id").references(() => stores.id, { onDelete: "cascade" }).notNull(),
  name:        varchar("name", { length: 100 }).notNull(),
  phone:       varchar("phone", { length: 50 }).notNull(),
  email:       varchar("email", { length: 255 }),
  district:    varchar("district", { length: 100 }),
  upazila:     varchar("upazila", { length: 100 }),
  orderCount:  integer("order_count").default(1).notNull(),
  totalSpent:  decimal("total_spent", { precision: 12, scale: 2 }).default("0.00").notNull(),
  lastOrderAt: timestamp("last_order_at", { withTimezone: true }),
  tags:        jsonb("tags").default([]).notNull(),
  // tags: ["loyal", "at_risk", "vip", "new"]
  createdAt:   timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  storePhoneUniq: uniqueIndex("sc_store_phone_idx").on(t.storeId, t.phone),
  storeIdIdx:     index("sc_store_id_idx").on(t.storeId),
}));

// ─── ANALYTICS SNAPSHOTS ──────────────────────────────────────────────────────

export const analyticsSnapshots = pgTable("analytics_snapshots", {
  id:           uuid("id").defaultRandom().primaryKey(),
  storeId:      uuid("store_id").references(() => stores.id, { onDelete: "cascade" }).notNull(),
  date:         date("date").notNull(),
  revenue:      decimal("revenue", { precision: 12, scale: 2 }).default("0.00").notNull(),
  orderCount:   integer("order_count").default(0).notNull(),
  visitorCount: integer("visitor_count").default(0).notNull(),
  conversion:   decimal("conversion", { precision: 6, scale: 4 }).default("0.0000").notNull(),
  avgOrderValue: decimal("avg_order_value", { precision: 12, scale: 2 }).default("0.00").notNull(),
  newCustomers: integer("new_customers").default(0).notNull(),
  returnCustomers: integer("return_customers").default(0).notNull(),
}, (t) => ({
  storeDateUniq: uniqueIndex("as_store_date_idx").on(t.storeId, t.date),
  storeDateIdx:  index("as_store_date_sorted_idx").on(t.storeId, t.date),
}));

// ─── CONSIGNMENTS ─────────────────────────────────────────────────────────────

export const consignments = pgTable("consignments", {
  id:            uuid("id").defaultRandom().primaryKey(),
  orderId:       uuid("order_id").references(() => orders.id).notNull(),
  storeId:       uuid("store_id").references(() => stores.id).notNull(),
  provider:      varchar("provider", { length: 30 }).notNull(),
  // provider: "steadfast" | "pathao" | "redx"
  consignmentId: varchar("consignment_id", { length: 100 }).notNull(),
  trackingUrl:   text("tracking_url"),
  labelUrl:      text("label_url"),
  zone:          varchar("zone", { length: 50 }),
  shippingCost:  decimal("shipping_cost", { precision: 10, scale: 2 }),
  dispatchedAt:  timestamp("dispatched_at", { withTimezone: true }).defaultNow().notNull(),
  deliveredAt:   timestamp("delivered_at", { withTimezone: true }),
});

// ─── STORE COURIERS ───────────────────────────────────────────────────────────

export const storeCouriers = pgTable("store_couriers", {
  id:        uuid("id").defaultRandom().primaryKey(),
  storeId:   uuid("store_id").references(() => stores.id, { onDelete: "cascade" }).notNull(),
  provider:  varchar("provider", { length: 30 }).notNull(),
  apiKey:    text("api_key"),
  apiSecret: text("api_secret"),
  isActive:  boolean("is_active").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  storeProviderUniq: uniqueIndex("sc_store_provider_idx").on(t.storeId, t.provider),
}));

// ─── STORE PIXELS ────────────────────────────────────────────────────────────

export const storePixels = pgTable("store_pixels", {
  id:           uuid("id").defaultRandom().primaryKey(),
  storeId:      uuid("store_id").references(() => stores.id, { onDelete: "cascade" }).notNull().unique(),
  metaPixelId:  varchar("meta_pixel_id", { length: 50 }),
  tiktokPixel:  varchar("tiktok_pixel", { length: 50 }),
  gtmContainer: varchar("gtm_container", { length: 30 }),
  gaTrackingId: varchar("ga_tracking_id", { length: 50 }),
  updatedAt:    timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── AUDIT LOGS ───────────────────────────────────────────────────────────────

export const auditLogs = pgTable("audit_logs", {
  id:        uuid("id").defaultRandom().primaryKey(),
  actorId:   uuid("actor_id").references(() => users.id).notNull(),
  actorRole: varchar("actor_role", { length: 20 }).notNull(),
  action:    varchar("action", { length: 100 }).notNull(),
  // e.g. "store.suspend" | "commission.clear" | "plan.upgrade"
  targetId:  uuid("target_id"),
  targetType: varchar("target_type", { length: 50 }),
  metadata:  jsonb("metadata").default({}).notNull(),
  ipAddress: varchar("ip_address", { length: 45 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  actorIdx: index("al_actor_idx").on(t.actorId),
  actionIdx: index("al_action_idx").on(t.action),
}));

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────

export const products = pgTable("products", {
  id:                 uuid("id").defaultRandom().primaryKey(),
  storeId:            uuid("store_id").references(() => stores.id, { onDelete: "cascade" }).notNull(),
  title:              varchar("title", { length: 255 }).notNull(),
  slug:               varchar("slug", { length: 255 }).notNull(),
  description:        text("description"),
  basePrice:          decimal("base_price", { precision: 12, scale: 2 }).notNull(),
  compareAtPrice:     decimal("compare_at_price", { precision: 12, scale: 2 }),
  isPublished:        boolean("is_published").default(true).notNull(),
  hasVariants:        boolean("has_variants").default(false).notNull(),
  images:             jsonb("images").default([]).notNull(),
  categoryAttributes: jsonb("category_attributes").default({}).notNull(),
  isDropship:         boolean("is_dropship").default(false).notNull(),
  platformProductId:  uuid("platform_product_id").references(() => platformProducts.id),
  createdAt:          timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt:          timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  storeSlugIdx: uniqueIndex("products_store_slug_idx").on(t.storeId, t.slug),
  storeIdIdx:   index("products_store_id_idx").on(t.storeId),
}));

export const productVariants = pgTable("product_variants", {
  id:                uuid("id").defaultRandom().primaryKey(),
  storeId:           uuid("store_id").references(() => stores.id, { onDelete: "cascade" }).notNull(),
  productId:         uuid("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  title:             varchar("title", { length: 150 }).notNull(),
  sku:               varchar("sku", { length: 100 }).notNull(),
  price:             decimal("price", { precision: 12, scale: 2 }).notNull(),
  inventoryQuantity: integer("inventory_quantity").default(0).notNull(),
  options:           jsonb("options").notNull(),
}, (t) => ({
  productIdx: index("pv_product_idx").on(t.productId),
}));

// ─── ORDERS ───────────────────────────────────────────────────────────────────

export const orders = pgTable("orders", {
  id:                uuid("id").defaultRandom().primaryKey(),
  storeId:           uuid("store_id").references(() => stores.id, { onDelete: "cascade" }).notNull(),
  orderNumber:       varchar("order_number", { length: 50 }).notNull(),
  customerName:      varchar("customer_name", { length: 100 }).notNull(),
  customerPhone:     varchar("customer_phone", { length: 50 }).notNull(),
  customerEmail:     varchar("customer_email", { length: 255 }),
  shippingAddress:   jsonb("shipping_address").notNull(),
  subtotal:          decimal("subtotal", { precision: 12, scale: 2 }).notNull(),
  shippingFee:       decimal("shipping_fee", { precision: 12, scale: 2 }).default("0.00").notNull(),
  totalAmount:       decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
  paymentMethod:     varchar("payment_method", { length: 30 }).notNull(),
  paymentStatus:     varchar("payment_status", { length: 20 }).default("pending").notNull(),
  fulfillmentStatus: varchar("fulfillment_status", { length: 20 }).default("unfulfilled").notNull(),
  notes:             text("notes"),
  rtoRisk:           varchar("rto_risk", { length: 20 }).default("low"),
  // rto_risk: "low" | "medium" | "high"
  createdAt:         timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt:         timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  storeIdIdx:   index("orders_store_id_idx").on(t.storeId),
  storeStatusIdx: index("orders_store_status_idx").on(t.storeId, t.fulfillmentStatus),
  storeDateIdx: index("orders_store_date_idx").on(t.storeId, t.createdAt),
}));

export const orderItems = pgTable("order_items", {
  id:              uuid("id").defaultRandom().primaryKey(),
  orderId:         uuid("order_id").references(() => orders.id, { onDelete: "cascade" }).notNull(),
  variantId:       uuid("variant_id").references(() => productVariants.id),
  productTitle:    varchar("product_title", { length: 255 }).notNull(),
  variantTitle:    varchar("variant_title", { length: 150 }),
  priceAtCheckout: decimal("price_at_checkout", { precision: 12, scale: 2 }).notNull(),
  quantity:        integer("quantity").notNull(),
  isDropship:      boolean("is_dropship").default(false).notNull(),
});

// ─── CUSTOM DOMAINS ───────────────────────────────────────────────────────────

export const customDomains = pgTable("custom_domains", {
  id:                uuid("id").defaultRandom().primaryKey(),
  storeId:           uuid("store_id").references(() => stores.id, { onDelete: "cascade" }).notNull().unique(),
  domain:            varchar("domain", { length: 253 }).notNull().unique(),
  verificationToken: varchar("verification_token", { length: 64 }),
  verified:          boolean("verified").default(false).notNull(),
  sslActive:         boolean("ssl_active").default(false).notNull(),
  lastCheckedAt:     timestamp("last_checked_at", { withTimezone: true }),
  createdAt:         timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── TYPE EXPORTS ─────────────────────────────────────────────────────────────

export type User               = typeof users.$inferSelect;
export type Store              = typeof stores.$inferSelect;
export type Subscription       = typeof subscriptions.$inferSelect;
export type Invoice            = typeof invoices.$inferSelect;
export type CommissionEvent    = typeof commissionEvents.$inferSelect;
export type PlatformProduct    = typeof platformProducts.$inferSelect;
export type DropshipListing    = typeof dropshipListings.$inferSelect;
export type StoreCustomer      = typeof storeCustomers.$inferSelect;
export type AnalyticsSnapshot  = typeof analyticsSnapshots.$inferSelect;
export type Order              = typeof orders.$inferSelect;
export type OrderItem          = typeof orderItems.$inferSelect;
export type Product            = typeof products.$inferSelect;
export type ProductVariant     = typeof productVariants.$inferSelect;
export type Consignment        = typeof consignments.$inferSelect;
export type AuditLog           = typeof auditLogs.$inferSelect;
