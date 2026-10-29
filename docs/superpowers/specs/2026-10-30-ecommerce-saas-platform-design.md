# Architecture & Specification: Multi-Tenant eCommerce SaaS Platform

**Date:** 2026-10-30  
**Status:** Approved  
**Target:** Turnkey SaaS eCommerce Platform for Startups and Small Businesses

---

## 1. Executive Summary & Problem Statement

### 1.1 The Problem
Early-stage startups, solo entrepreneurs, and micro-merchants want to sell products online but face two prohibitive hurdles:
1. **High Custom Development Costs**: Building a custom web store via agencies or freelance developers costs thousands of dollars and months of lead time.
2. **Steep Complexity of Existing Tools**: Traditional enterprise platforms (Magento, WooCommerce, custom Shopify setups) require technical domain knowledge, server administration, or overwhelming configuration steps.

### 1.2 The Solution
A turnkey, self-service **Multi-Tenant eCommerce SaaS** where a merchant can:
* Sign up and pick their business niche (e.g., Fashion, Electronics, Food/Grocery, Cosmetics, General Crafts).
* Get an instant, fully responsive, professional eCommerce storefront (`brand.platform.com` or custom domain) with pre-populated dummy products, banners, and category-tailored attributes.
* Manage stock and products through an intuitive **Merchant Admin Dashboard** with variant matrix generation (e.g. Size x Color) and batch inventory updates.
* Process incoming orders across multiple channels with a **Hybrid Checkout System** supporting **Cash on Delivery (COD)**, **Credit/Debit Cards (Stripe)**, and **Manual/Mobile Bank Transfers**.
* Pay an affordable monthly SaaS subscription fee (e.g., $9 – $29/mo) after a 14-day free trial.

---

## 2. System Architecture

The platform uses a **Unified Next.js 15 Monorepo with Wildcard Edge Routing** and **Row-Level Tenant Isolation** in PostgreSQL.

```
                                [ Incoming Web Request ]
                                           │
                                           ▼
                              [ Next.js Edge Middleware ]
                                           │
         ┌─────────────────────────────────┼─────────────────────────────────┐
         │                                 │                                 │
         ▼                                 ▼                                 ▼
   Host: platform.com             Host: app.platform.com           Host: [slug].platform.com
         │                                 │                        (or custom domain)
         ▼                                 ▼                                 │
[ app/(platform) ]                 [ app/admin ]                             ▼
• Marketing Landing Page           • Merchant Auth & Login            [ app/store/[tenant] ]
• Pricing & Features               • Catalog & Variant Matrix         • Category Presets
• Merchant Onboarding Wizard       • Inventory Tracking & Logs        • Product Detail & Filter
• SaaS Billing & Subscriptions     • Order Management & Invoices      • Slide-over Drawer Cart
                                   • Storefront Theme Customizer      • 1-Page Hybrid Checkout
```

### 2.1 Next.js Edge Middleware Resolution
* **Platform Marketing (`app/(platform)`)**: Triggered when the request host is `platform.com` or `www.platform.com`.
* **Merchant Dashboard (`app/admin`)**: Triggered when the host is `app.platform.com` (or access via `platform.com/admin`). Protected by merchant authentication sessions.
* **Storefront Dynamic Routing (`app/store/[tenant]`)**:
  * Edge middleware inspects the request host.
  * If `subdomain.platform.com`: extracts `subdomain`.
  * If custom domain (`mystore.com`): queries tenant cache (in-memory/Redis) for domain mapping.
  * Rewrites URL internally to `/store/[tenantId]/*`.

### 2.2 Technology Stack
* **Framework**: Next.js 15 (App Router, React Server Components, Server Actions).
* **Styling & Components**: Tailwind CSS v4, shadcn/ui primitives, Lucide React icons.
* **Database**: PostgreSQL with Drizzle ORM.
* **Caching & Real-Time**: Edge In-Memory Cache / Upstash Redis for subdomain lookups and rate limiting.
* **Authentication**: Multi-tenant session authentication (Owner/Staff roles for merchants; Guest & Customer profiles for storefront buyers).
* **Storage**: Cloudflare R2 / AWS S3 with presigned upload URLs for product photography, logos, and banners.

---

## 3. Database Schema & Data Isolation

Tenant isolation is strictly enforced via **Row-Level Scoping**: every store-owned record contains a mandatory `store_id` foreign key.

```sql
-- Platform Users & Staff
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'merchant_owner', -- 'superadmin', 'merchant_owner', 'merchant_staff'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tenants / Stores
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(63) UNIQUE NOT NULL, -- e.g. "apex-fashion" -> apex-fashion.platform.com
  custom_domain VARCHAR(255) UNIQUE,
  category VARCHAR(50) NOT NULL, -- 'fashion', 'electronics', 'grocery_food', 'beauty_cosmetics', 'crafts_general'
  currency VARCHAR(10) NOT NULL DEFAULT 'USD',
  logo_url TEXT,
  banner_url TEXT,
  primary_color VARCHAR(7) DEFAULT '#0f172a',
  theme_config JSONB DEFAULT '{}', -- section toggles, announcement text, social links
  payment_config JSONB DEFAULT '{"enable_cod": true, "enable_stripe": false, "enable_manual": false}',
  subscription_status VARCHAR(20) NOT NULL DEFAULT 'trial', -- 'trial', 'active', 'past_due', 'cancelled'
  subscription_plan VARCHAR(20) NOT NULL DEFAULT 'starter',
  trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '14 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Store Product Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT,
  base_price DECIMAL(12, 2) NOT NULL,
  compare_at_price DECIMAL(12, 2),
  cost_price DECIMAL(12, 2),
  sku VARCHAR(100),
  is_published BOOLEAN NOT NULL DEFAULT true,
  has_variants BOOLEAN NOT NULL DEFAULT false,
  images JSONB DEFAULT '[]', -- array of image URLs
  category_attributes JSONB DEFAULT '{}', -- specs, fabrics, tags
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product Variants
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  title VARCHAR(150) NOT NULL, -- e.g. "Red / XL" or "256GB / Space Gray"
  sku VARCHAR(100) NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  inventory_quantity INTEGER NOT NULL DEFAULT 0,
  options JSONB NOT NULL, -- {"Color": "Red", "Size": "XL"}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory Audit Logs
CREATE TABLE inventory_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity_change INTEGER NOT NULL,
  reason VARCHAR(50) NOT NULL, -- 'order_placed', 'order_cancelled', 'manual_adjustment', 'restock'
  reference_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Store Customers
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50) NOT NULL,
  shipping_address JSONB DEFAULT '{}',
  total_orders INTEGER NOT NULL DEFAULT 0,
  total_spent DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  order_number VARCHAR(50) NOT NULL, -- "#1001"
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  customer_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(255),
  customer_phone VARCHAR(50) NOT NULL,
  shipping_address JSONB NOT NULL,
  subtotal DECIMAL(12, 2) NOT NULL,
  shipping_fee DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  discount_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  total_amount DECIMAL(12, 2) NOT NULL,
  payment_method VARCHAR(30) NOT NULL, -- 'cod', 'stripe', 'manual_transfer'
  payment_status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'refunded', 'failed'
  payment_reference TEXT, -- Stripe Charge ID or Customer Transaction ID
  fulfillment_status VARCHAR(20) NOT NULL DEFAULT 'unfulfilled', -- 'unfulfilled', 'processing', 'shipped', 'delivered', 'cancelled'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order Items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  variant_id UUID REFERENCES product_variants(id),
  product_title VARCHAR(255) NOT NULL,
  variant_title VARCHAR(150),
  price DECIMAL(12, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  total DECIMAL(12, 2) NOT NULL
);
```

---

## 4. Merchant Experience & Core Modules

### 4.1 Rapid 3-Minute Onboarding
1. **Store Identity**: Merchant provides Store Name, contact phone, and picks a subdomain (`[brand].platform.com`).
2. **Category Selection**:
   * **Fashion & Apparel**: Activates Size/Color matrices, fit badges, and lookbook styling.
   * **Electronics & Gadgets**: Activates technical specification tables, warranty badges, and specs comparison.
   * **Food & Grocery**: Activates unit steppers (`kg`, `pack`, `box`), dietary badges (Halal, Vegan, Organic).
   * **Beauty & Cosmetics**: Activates ingredient disclosures and before/after review blocks.
   * **General / Crafts**: Clean product grid suitable for handmade or curated merchandise.
3. **Automated Seed Data**: Injects 3 starter products with realistic images, descriptions, and category tags so the store is instantly presentable.
4. **Payment Quick-Toggle**: Merchant enables Cash on Delivery with a single click, or inputs their bank/mobile wallet details.

### 4.2 Product & Inventory Management
* **Variant Matrix Generator**: Allows merchants to define multiple option attributes (e.g. Size: S, M, L; Color: Black, Blue). The system dynamically computes the Cartesian product and renders an editable SKU, Price, and Stock row for each combination.
* **Batch Stock Editor**: Fast spreadsheet-like table to adjust stock counts across all variants in seconds.
* **Low Stock Alerts**: Visual warning badges and dashboard alerts when variant stock falls below 5 units.

### 4.3 Order Management & Fulfillment Pipeline
* **Status Lifecycle**: `Unfulfilled` → `Processing` → `Shipped` → `Delivered` (or `Cancelled`).
* **Cash On Delivery Workflow**: Dedicated filter for unverified COD orders; merchant can mark as confirmed upon phone verification.
* **Invoice / Packing Slip Generator**: Formatted printable order receipts with customer delivery instructions, items breakdown, and QR code for courier delivery.

### 4.4 Theme & Section Customizer
* Simple non-destructive block editor:
  * **Top Announcement Bar**: Configurable text, link, and background color.
  * **Hero Banner**: Headline, subheadline, call-to-action button, and background imagery.
  * **Category Showcase**: Visual grid of featured collections.
  * **Product Carousels**: "New Arrivals", "Best Sellers", "On Sale".
  * **Trust Badges & Policies**: Delivery policy, return guarantee, phone support badge.
  * **Live Viewport Preview**: Instant side-by-side switching between Mobile, Tablet, and Desktop views.

---

## 5. Storefront & Hybrid Checkout Engine

### 5.1 Shopping Experience & SEO
* **Server-Side Rendered (SSR) & React Server Components**: Maximum Google crawlability, OpenGraph social preview tags, and structured JSON-LD product data.
* **Slide-Over Drawer Cart**: Non-blocking shopping experience; customers can adjust quantities, view subtotal updates, and see the free-shipping progress indicator without page reloads.

### 5.2 Streamlined 1-Page Checkout
* **Zero Forced Registration**: Guest checkout enabled by default; asks for Customer Full Name, Mobile Phone Number (for delivery verification), and Delivery Address.
* **Payment Gateways**:
  1. **Cash on Delivery (COD)**: 1-click confirmation; instantly flags order as `pending` and notifies merchant.
  2. **Stripe Elements**: Embedded card inputs with 3D Secure verification; triggers automatic `paid` status via Stripe webhooks.
  3. **Manual Mobile / Bank Transfer (bKash / Nagad / UPI / Wire)**: Shows merchant's payment instructions; allows customer to submit their Transaction ID / Reference for manual confirmation.
* **Atomic Concurrency Protection**:
  * Stock updates use SQL atomic deductions (`UPDATE product_variants SET inventory_quantity = inventory_quantity - :qty WHERE id = :id AND inventory_quantity >= :qty`).
  * If insufficient stock remains, the transaction aborts and informs the buyer immediately.

---

## 6. SaaS Platform Monetization & Administration

### 6.1 Pricing Tiers for Merchants
* **Free Trial**: 14 days, all features enabled.
* **Starter Plan ($9 / month)**: Up to 50 active products, standard subdomain (`store.platform.com`), 0% platform fee on COD, 2% platform fee on digital payments.
* **Growth Plan ($29 / month)**: Up to 500 active products, custom domain support (`brand.com`), 0% platform transaction fee, priority email support.
* **Pro Plan ($79 / month)**: Unlimited products, up to 5 staff accounts, custom domain, advanced sales analytics.

### 6.2 Super-Admin Capabilities
* Global overview of total registered stores, active subscriptions, platform GMV, and monthly recurring revenue (MRR).
* Ability to inspect, suspend, or reactivate delinquent stores.

---

## 7. Security, Tenant Isolation & Testing Strategy

### 7.1 Security Safeguards
* **Database Tenant Isolation**: Middleware guarantees that every ORM query includes `WHERE store_id = :currentStoreId`.
* **Rate Limiting**: Public checkout and API endpoints protected via Edge rate limiting (10 requests per minute per IP on checkout).
* **Asset Upload Security**: Pre-signed URLs restricted to verified image MIME types (`image/jpeg`, `image/png`, `image/webp`) with maximum file size limits (5 MB).

### 7.2 Testing & Quality Gates
* **Unit Tests**: Cart calculations, tax/shipping logic, variant matrix generators, and Zod schema validations.
* **Multi-Tenant Integration Tests**: Automated tests proving that Tenant A cannot read, query, or mutate Tenant B's products, orders, or customers.
* **Concurrency Tests**: Simulated parallel checkouts against single-inventory items ensuring zero overselling.
* **E2E Smoke Tests**: Full Playwright browser test: Merchant signup → Add product with variants → Customer checkout via COD → Merchant fulfillment in dashboard.

---

## 8. Implementation Milestones

1. **Milestone 1**: Multi-Tenant Core Foundation (Next.js 15 setup, PostgreSQL schema via Drizzle, Edge domain routing middleware, merchant auth).
2. **Milestone 2**: Merchant Admin Dashboard (Catalog management, variant matrix generator, batch stock updates).
3. **Milestone 3**: Category-Adaptive Customer Storefront (Category themes, product gallery, slide-over cart).
4. **Milestone 4**: 1-Page Hybrid Checkout Engine (COD, Stripe, manual mobile transfers, atomic stock deduction).
5. **Milestone 5**: Store Customizer & Order Processing (Section toggles, order status pipeline, invoice printing).
6. **Milestone 6**: SaaS Billing & Platform Super-Admin (Stripe billing for subscription tiers, super-admin monitoring).

