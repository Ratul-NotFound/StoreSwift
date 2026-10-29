# StoreSwift ⚡

> **From idea to a live eCommerce store in 3 minutes.**  
> A turnkey, multi-tenant eCommerce SaaS platform designed for startups and small businesses who need a professional online store without expensive agency fees.

---

## 🚀 Key Features

* **Instant 3-Minute Onboarding Wizard**:
  * Free instant subdomain (`[brand].storeswift.com`).
  * Automatic starter product seed injection tailored to the business category.
  * 1-click Cash on Delivery (COD) and payment preferences setup.
* **Category Presets & Schemas**:
  * **Fashion & Apparel**: Size/Color variant matrix, fit guides, lifestyle gallery.
  * **Electronics & Tech**: Technical specifications table, warranty badges.
  * **Food & Grocery**: Freshness badges, dietary tags, unit steppers.
  * **Beauty & Cosmetics**: Ingredients disclosure, before/after reviews.
* **Merchant Admin Dashboard**:
  * **Variant Matrix Generator**: Computes Cartesian combinations across options (e.g. Size x Color) with auto-generated SKUs, prices, and stock counts.
  * **Batch Stock Editor**: Update inventory levels across items in seconds without opening individual forms.
  * **Order Fulfillment Pipeline**: Filter orders, update status (`Unfulfilled` → `Processing` → `Shipped` → `Delivered`), and print formatted packing slips/invoices.
  * **Store Customizer**: Live side-by-side Mobile & Desktop preview with brand color picker, announcement bar editor, and hero banner settings.
* **Customer Storefront & 1-Page Hybrid Checkout**:
  * Mobile-first responsive catalog with category filters.
  * Slide-over cart drawer with real-time subtotal and free shipping threshold tracker.
  * **Hybrid Checkout**: Supports **Cash on Delivery (COD)**, **Credit/Debit Cards (Stripe)**, and **Manual Mobile Money (bKash/Nagad/UPI/Wire)**.
  * **Atomic Inventory Lock**: Database-level atomic deduction prevents double-selling and overselling during simultaneous checkouts.
* **Platform Super-Admin**:
  * Network-wide overview of active merchants, MRR (Monthly Recurring Revenue), and total orders.
  * Tenant management: search, inspect, activate, or suspend stores.

---

## 🛠️ Tech Stack

* **Framework**: Next.js 15 (App Router, React Server Components, Server Actions)
* **Frontend**: React 19, Tailwind CSS, Lucide Icons
* **Database & ORM**: PostgreSQL with Drizzle ORM
* **Tenant Isolation**: Row-level scoping via `store_id` on all tenant entities
* **Routing**: Next.js Edge Middleware for wildcard domain & subdomain rewrites
* **Auth**: Multi-tenant session tokens (bcrypt + JWT)
* **Testing**: Vitest (Unit & Integration tests)

---

## 📦 Project Structure

```
├── src/
│   ├── app/
│   │   ├── (platform)/                 # Marketing Landing, Login, Onboarding Wizard
│   │   ├── admin/                      # Merchant Admin Dashboard & Customizer
│   │   ├── store/[tenant]/             # Dynamic Customer Storefront & Product Details
│   │   ├── super-admin/                # Platform Owner Control Center
│   │   └── layout.tsx
│   ├── config/
│   │   ├── categories.ts               # Category presets & demo product schemas
│   │   └── reserved-slugs.ts           # Reserved subdomain security validator
│   ├── db/
│   │   ├── index.ts                    # Drizzle ORM client connection
│   │   ├── schema.ts                   # PostgreSQL database models
│   │   └── tenant.ts                   # Tenant query isolation helpers
│   ├── lib/
│   │   ├── auth.ts                     # Password hashing & JWT session management
│   │   ├── cart.ts                     # Shopping cart calculations & free shipping progress
│   │   ├── matrix.ts                   # Cartesian variant matrix generator
│   │   ├── seed-store.ts               # Store starter demo data injector
│   │   └── stock.ts                    # Atomic inventory deduction engine
│   └── middleware.ts                   # Edge domain & subdomain routing
├── tests/
│   ├── unit/                           # Unit tests (Auth, Cart, Matrix, Routing, Tenant)
│   └── integration/                    # End-to-end merchant to checkout lifecycle tests
└── drizzle.config.ts                   # Drizzle database migration configuration
```

---

## ⚡ Getting Started

### 1. Prerequisites
* Node.js 18+ or 20+
* npm or pnpm

### 2. Installation
```bash
git clone https://github.com/Ratul-NotFound/StoreSwift.git
cd StoreSwift
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Configure your PostgreSQL connection string (`DATABASE_URL`) and JWT secret (`AUTH_SECRET`).

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the SaaS landing page.

* **Onboarding Wizard**: `http://localhost:3000/onboarding`
* **Merchant Dashboard**: `http://localhost:3000/admin`
* **Demo Storefront**: `http://localhost:3000/store/apex-fashion`
* **Super-Admin**: `http://localhost:3000/super-admin`

### 5. Running Tests
```bash
npm test
```

### 6. Production Build
```bash
npm run build
```

---

## 📄 License
MIT License. Built for startups and independent brands.

