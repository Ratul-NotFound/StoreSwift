import { pgTable, uuid, varchar, text, decimal, integer, boolean, timestamp, jsonb, uniqueIndex } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  fullName: varchar("full_name", { length: 100 }).notNull(),
  role: varchar("role", { length: 20 }).default("merchant_owner").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
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
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
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
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
}, (table) => ({
  storeSlugIdx: uniqueIndex("products_store_slug_idx").on(table.storeId, table.slug)
}));

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
  customerEmail: varchar("customer_email", { length: 255 }),
  shippingAddress: jsonb("shipping_address").notNull(),
  subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull(),
  shippingFee: decimal("shipping_fee", { precision: 12, scale: 2 }).default("0.00").notNull(),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
  paymentMethod: varchar("payment_method", { length: 30 }).notNull(),
  paymentStatus: varchar("payment_status", { length: 20 }).default("pending").notNull(),
  fulfillmentStatus: varchar("fulfillment_status", { length: 20 }).default("unfulfilled").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").references(() => orders.id, { onDelete: "cascade" }).notNull(),
  variantId: uuid("variant_id").references(() => productVariants.id),
  productTitle: varchar("product_title", { length: 255 }).notNull(),
  variantTitle: varchar("variant_title", { length: 150 }),
  priceAtCheckout: decimal("price_at_checkout", { precision: 12, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull()
});

export const customDomains = pgTable("custom_domains", {
  id: uuid("id").defaultRandom().primaryKey(),
  storeId: uuid("store_id").references(() => stores.id, { onDelete: "cascade" }).notNull().unique(),
  domain: varchar("domain", { length: 253 }).notNull().unique(),
  verificationToken: varchar("verification_token", { length: 64 }),
  verified: boolean("verified").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
});
