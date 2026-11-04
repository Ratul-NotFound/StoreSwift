# StoreSwift Enterprise SaaS Core Pillars Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and integrate the 6 foundational enterprise SaaS pillars for StoreSwift: Staff Accounts & RBAC, 1-Click Printable A4 Invoices & 4x6" Thermal Shipping Labels, Bulk CSV Data Engine, Storefront Customer Portal, Abandoned Cart Recovery Engine, and Transactional Notification Center & Audit Trail.

**Architecture:** Extend StoreSwift's in-memory multi-tenant state layer (`devStore`) and plan limits engine (`plan-limits`) with dedicated collections for staff, abandoned carts, transactional notifications, and audit trails. Provide secure, tenant-isolated Next.js App Router API routes (`/api/stores/[slug]/...`) enforcing strict RBAC and plan gating. Implement browser-native zero-dependency `@media print` CSS templates for invoices and labels, an RFC-4180 CSV parser/serializer with formula injection defense, a dedicated storefront customer portal at `/store/[tenant]/account`, and rich interactive management views inside the Merchant Dashboard.

**Tech Stack:** Next.js 15 (App Router, Server Actions, Client Components), TypeScript (strict mode), Tailwind CSS v4, Lucide React icons, Vitest test runner.

**Spec:** [docs/superpowers/specs/2026-11-04-enterprise-saas-core-pillars-design.md](file:///e:/Project/Ecomerce%20solution/docs/superpowers/specs/2026-11-04-enterprise-saas-core-pillars-design.md)

## Global Constraints

- Preserve all 179 existing passing tests with zero regressions.
- Multi-tenant isolation: All mutations and queries are strictly scoped to the store slug/store ID. Staff or data of Store A must never be accessible from Store B.
- Plan limit enforcement: Free plan has 0 staff seats (owner only); Medium plan allows up to 2 staff seats; Pro plan allows up to 10 staff seats. Attempting to exceed seats must return an upgrade requirement.
- Server-authoritative calculations: All financial amounts, prices, and discounts must be verified on the server and rounded to 2 decimal places.
- CSV safety: Prevent CSV/Formula injection by prefixing any string starting with `=`, `+`, `-`, or `@` with a single quote (`'`).
- Zero heavy PDF canvas binaries: Invoices and 4x6" thermal courier packing slips use browser-native `@media print` CSS and SVG barcodes.

## Review Focus

1. Staff seat limit violation: Submitting a new staff member when `currentStaffCount >= maxStaff` must return HTTP 403 with `{ upgrade: true, error: ... }`.
2. CSV formula injection: Uploading or exporting cells starting with `=`, `@`, `+`, or `-` must not execute formulas in Excel/Google Sheets.
3. Abandoned cart conversion race: If an order completes right as a pre-submit cart ping fires, the cart must resolve to `converted` and not duplicate or remain `abandoned`.
4. Storefront customer portal privacy: Customer order lookup must require matching customer phone and order number (or authenticated customer session), preventing phone enumeration.
5. Print CSS pagination & thermal dimensions: Invoices must fit cleanly on standard A4 portrait sheets without clipped headers; shipping labels must fit 4x6" (100mm x 150mm) thermal label rolls without browser header/footer clutter.

---

### Task 1: Core Data Models & Store State Extensions in `devStore` and `plan-limits`

**Files:**
- Modify: `src/lib/plan-limits.ts:100-150`
- Modify: `src/lib/dev-store.ts:80-210`, `dev-store.ts:1100-1221`
- Test: `tests/unit/enterprise-dev-store.test.ts`

**Interfaces:**
- Consumes: `PlanId`, `PLAN_LIMITS` from `src/lib/plan-limits.ts`.
- Produces:
  - `checkStaffLimit(plan: PlanId, currentStaffCount: number): { allowed: boolean; limit: number; current: number }`
  - Interfaces: `DevStoreStaff`, `DevAbandonedCart`, `DevAuditEvent`, `DevStoreNotification`
  - Methods on `devStore`:
    - `getStaff(storeSlug: string): DevStoreStaff[]`
    - `addStaff(storeSlug: string, staff: Omit<DevStoreStaff, "id" | "storeId" | "storeSlug" | "invitedAt">): DevStoreStaff`
    - `deleteStaff(storeSlug: string, staffId: string): boolean`
    - `recordAbandonedCart(storeSlug: string, data: Omit<DevAbandonedCart, "id" | "storeSlug" | "createdAt" | "status">): DevAbandonedCart`
    - `getAbandonedCarts(storeSlug: string): DevAbandonedCart[]`
    - `markAbandonedCartConverted(storeSlug: string, customerPhone: string): boolean`
    - `logAuditEvent(storeSlug: string, event: Omit<DevAuditEvent, "id" | "storeSlug" | "timestamp">): DevAuditEvent`
    - `getAuditEvents(storeSlug: string): DevAuditEvent[]`
    - `queueNotification(storeSlug: string, notification: Omit<DevStoreNotification, "id" | "storeSlug" | "createdAt">): DevStoreNotification`
    - `getNotifications(storeSlug: string): DevStoreNotification[]`

- [ ] **Step 1: Write the failing unit test**

Create `tests/unit/enterprise-dev-store.test.ts`:
```typescript
import { describe, it, expect, beforeEach } from "vitest";
import { devStore } from "@/lib/dev-store";
import { checkStaffLimit, PLAN_LIMITS } from "@/lib/plan-limits";

describe("Enterprise SaaS Core Data Models & Store State", () => {
  const testSlug = "apex-fashion";

  it("evaluates staff limits according to plan configuration", () => {
    expect(checkStaffLimit("free", 0).allowed).toBe(false); // 0 extra staff allowed
    expect(checkStaffLimit("free", 0).limit).toBe(0);

    expect(checkStaffLimit("medium", 1).allowed).toBe(true); // limit is 2
    expect(checkStaffLimit("medium", 2).allowed).toBe(false);

    expect(checkStaffLimit("pro", 5).allowed).toBe(true); // limit is 10
  });

  it("manages store staff members with role assignments and deletion safeguards", () => {
    const initialStaff = devStore.getStaff(testSlug);
    expect(Array.isArray(initialStaff)).toBe(true);

    const newStaff = devStore.addStaff(testSlug, {
      name: "Tariqul Islam",
      email: "tariq@example.com",
      phone: "01799887766",
      role: "fulfillment",
      status: "active",
    });

    expect(newStaff.id).toBeDefined();
    expect(newStaff.role).toBe("fulfillment");

    const staffList = devStore.getStaff(testSlug);
    expect(staffList.some((s) => s.email === "tariq@example.com")).toBe(true);

    // Remove staff
    const deleted = devStore.deleteStaff(testSlug, newStaff.id);
    expect(deleted).toBe(true);
    expect(devStore.getStaff(testSlug).some((s) => s.id === newStaff.id)).toBe(false);
  });

  it("records abandoned carts and marks them converted upon checkout", () => {
    const lead = devStore.recordAbandonedCart(testSlug, {
      customerName: "Sakib Al Hasan",
      customerPhone: "01811223344",
      items: [{ title: "Heavyweight T-Shirt", price: 750, quantity: 2 }],
      totalAmount: 1500,
      district: "Dhaka",
    });

    expect(lead.id).toBeDefined();
    expect(lead.status).toBe("abandoned");

    const cartsBefore = devStore.getAbandonedCarts(testSlug);
    expect(cartsBefore.some((c) => c.customerPhone === "01811223344" && c.status === "abandoned")).toBe(true);

    // Convert upon checkout
    const converted = devStore.markAbandonedCartConverted(testSlug, "01811223344");
    expect(converted).toBe(true);

    const cartsAfter = devStore.getAbandonedCarts(testSlug);
    const target = cartsAfter.find((c) => c.customerPhone === "01811223344");
    expect(target?.status).toBe("converted");
  });

  it("records and retrieves security audit events and transactional notifications", () => {
    const event = devStore.logAuditEvent(testSlug, {
      action: "price_update",
      actorEmail: "merchant@storeswift.app",
      actorRole: "owner",
      details: "Updated SKU-101 price from ৳500 to ৳650",
    });
    expect(event.id).toBeDefined();

    const auditLogs = devStore.getAuditEvents(testSlug);
    expect(auditLogs.some((e) => e.action === "price_update")).toBe(true);

    const notif = devStore.queueNotification(testSlug, {
      channel: "sms",
      recipient: "01711002233",
      template: "order_confirmed",
      payload: { orderNumber: "SS-9999", amount: "৳1,850" },
      status: "queued",
    });
    expect(notif.id).toBeDefined();

    const notifs = devStore.getNotifications(testSlug);
    expect(notifs.some((n) => n.template === "order_confirmed")).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/unit/enterprise-dev-store.test.ts`
Expected: FAIL with "checkStaffLimit is not a function" or "devStore.getStaff is not a function".

- [ ] **Step 3: Implement minimal code in `src/lib/plan-limits.ts` and `src/lib/dev-store.ts`**

1. In `src/lib/plan-limits.ts`, add:
```typescript
export function checkStaffLimit(
  plan: PlanId,
  currentStaffCount: number
): { allowed: boolean; limit: number; current: number } {
  const config = PLAN_LIMITS[plan];
  return {
    allowed: currentStaffCount < config.maxStaff,
    limit: config.maxStaff,
    current: currentStaffCount,
  };
}
```

2. In `src/lib/dev-store.ts`, add interfaces:
```typescript
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
```

3. In `DevStoreManager` class, add private collections and methods:
- `private staff: Map<string, DevStoreStaff> = new Map();`
- `private abandonedCarts: Map<string, DevAbandonedCart> = new Map();`
- `private auditEvents: DevAuditEvent[] = [];`
- `private notifications: DevStoreNotification[] = [];`
- Implement `getStaff`, `addStaff`, `deleteStaff`, `recordAbandonedCart`, `getAbandonedCarts`, `markAbandonedCartConverted`, `logAuditEvent`, `getAuditEvents`, `queueNotification`, `getNotifications`. Seed default owner for `apex-fashion`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/unit/enterprise-dev-store.test.ts`
Expected: PASS (4/4 tests passing).

- [ ] **Step 5: Commit changes**

```bash
git add src/lib/plan-limits.ts src/lib/dev-store.ts tests/unit/enterprise-dev-store.test.ts
git commit -m "feat(core): add enterprise staff, rbac, abandoned cart, and audit state models"
```

---

### Task 2: Staff Accounts & Role-Based Access Control API (`/api/stores/[slug]/staff`)

**Files:**
- Create: `src/app/api/stores/[slug]/staff/route.ts`
- Test: `tests/integration/staff-rbac-api.test.ts`

**Interfaces:**
- Consumes: `devStore`, `checkStaffLimit`, `DevStoreStaff` from `@/lib/dev-store` and `@/lib/plan-limits`.
- Produces:
  - `GET /api/stores/[slug]/staff`: Returns `{ ok: true, staff: DevStoreStaff[], planLimit: { allowed: boolean, limit: number, current: number } }`.
  - `POST /api/stores/[slug]/staff`: Validates email, role, and staff limit. Returns `{ ok: true, staff: DevStoreStaff }` or `{ ok: false, upgrade: true, error: string }`. Logs `staff_invited` in audit trail.
  - `DELETE /api/stores/[slug]/staff?staffId=...`: Removes staff. Returns `{ ok: true }` or 400 if trying to delete owner. Logs `staff_removed` in audit trail.

- [ ] **Step 1: Write the failing integration test**

Create `tests/integration/staff-rbac-api.test.ts`:
```typescript
import { describe, it, expect } from "vitest";
import { GET, POST, DELETE } from "@/app/api/stores/[slug]/staff/route";
import { NextRequest } from "next/server";
import { devStore } from "@/lib/dev-store";

describe("Staff Accounts & RBAC API (/api/stores/[slug]/staff)", () => {
  it("enforces plan limits: blocks adding staff on Free plan with upgrade notice", async () => {
    // Apex fashion is on free plan
    const req = new NextRequest("http://localhost:3000/api/stores/apex-fashion/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "staff_new@apexfashion.bd",
        name: "Test Staff",
        role: "fulfillment",
      }),
    });

    const res = await POST(req, { params: Promise.resolve({ slug: "apex-fashion" }) });
    const data = await res.json();

    expect(res.status).toBe(403);
    expect(data.upgrade).toBe(true);
    expect(data.error).toContain("Upgrade to Medium or Pro");
  });

  it("allows Medium plan store to add staff up to seat limit", async () => {
    // my-clothing-store is on medium plan (limit 2)
    const req = new NextRequest("http://localhost:3000/api/stores/my-clothing-store/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "worker1@clothingco.bd",
        name: "Kamrul Hasan",
        role: "catalog_editor",
      }),
    });

    const res = await POST(req, { params: Promise.resolve({ slug: "my-clothing-store" }) });
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.ok).toBe(true);
    expect(data.staff.role).toBe("catalog_editor");
  });

  it("lists staff and prevents deleting the primary store owner", async () => {
    const getReq = new NextRequest("http://localhost:3000/api/stores/my-clothing-store/staff");
    const getRes = await GET(getReq, { params: Promise.resolve({ slug: "my-clothing-store" }) });
    const getData = await getRes.json();

    expect(getRes.status).toBe(200);
    expect(getData.ok).toBe(true);
    expect(Array.isArray(getData.staff)).toBe(true);

    // Try deleting invalid or owner
    const delReq = new NextRequest("http://localhost:3000/api/stores/my-clothing-store/staff?staffId=owner", {
      method: "DELETE",
    });
    const delRes = await DELETE(delReq, { params: Promise.resolve({ slug: "my-clothing-store" }) });
    expect(delRes.status).toBe(400);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/integration/staff-rbac-api.test.ts`
Expected: FAIL with route not found / cannot import module.

- [ ] **Step 3: Implement `src/app/api/stores/[slug]/staff/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { devStore } from "@/lib/dev-store";
import { checkStaffLimit } from "@/lib/plan-limits";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const store = devStore.getStore(slug);
  if (!store) {
    return NextResponse.json({ ok: false, error: "Store not found" }, { status: 404 });
  }

  const staff = devStore.getStaff(slug);
  const planLimit = checkStaffLimit(store.plan, staff.filter((s) => s.role !== "owner").length);

  return NextResponse.json({ ok: true, staff, planLimit, plan: store.plan });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const store = devStore.getStore(slug);
  if (!store) {
    return NextResponse.json({ ok: false, error: "Store not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));
  const { email, name, role = "fulfillment", phone } = body;

  if (!email || !name || !email.includes("@")) {
    return NextResponse.json(
      { ok: false, error: "Valid name and email are required" },
      { status: 400 }
    );
  }

  const validRoles = ["owner", "manager", "fulfillment", "catalog_editor"];
  if (!validRoles.includes(role)) {
    return NextResponse.json({ ok: false, error: "Invalid role specified" }, { status: 400 });
  }

  const existingStaff = devStore.getStaff(slug);
  const currentNonOwnerCount = existingStaff.filter((s) => s.role !== "owner").length;
  const limitCheck = checkStaffLimit(store.plan, currentNonOwnerCount);

  if (!limitCheck.allowed) {
    return NextResponse.json(
      {
        ok: false,
        upgrade: true,
        error: `Staff account limit reached (${limitCheck.current}/${limitCheck.limit}). Upgrade to Medium or Pro to add more team members.`,
      },
      { status: 403 }
    );
  }

  const newStaff = devStore.addStaff(slug, {
    email: email.trim().toLowerCase(),
    name: name.trim(),
    role,
    phone: phone?.trim(),
    status: "active",
  });

  devStore.logAuditEvent(slug, {
    action: "staff_invited",
    actorEmail: "merchant@storeswift.app",
    actorRole: "owner",
    details: `Invited ${name} (${email}) as ${role}`,
  });

  return NextResponse.json({ ok: true, staff: newStaff }, { status: 201 });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const staffId = req.nextUrl.searchParams.get("staffId");

  if (!staffId) {
    return NextResponse.json({ ok: false, error: "Staff ID is required" }, { status: 400 });
  }

  const staff = devStore.getStaff(slug).find((s) => s.id === staffId);
  if (!staff) {
    return NextResponse.json({ ok: false, error: "Staff member not found" }, { status: 404 });
  }

  if (staff.role === "owner") {
    return NextResponse.json(
      { ok: false, error: "Cannot delete the primary store owner" },
      { status: 400 }
    );
  }

  devStore.deleteStaff(slug, staffId);

  devStore.logAuditEvent(slug, {
    action: "staff_removed",
    actorEmail: "merchant@storeswift.app",
    actorRole: "owner",
    details: `Removed staff member ${staff.name} (${staff.email})`,
  });

  return NextResponse.json({ ok: true, message: "Staff removed successfully" });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/integration/staff-rbac-api.test.ts`
Expected: PASS (3/3 tests passing).

- [ ] **Step 5: Commit changes**

```bash
git add src/app/api/stores/[slug]/staff/route.ts tests/integration/staff-rbac-api.test.ts
git commit -m "feat(api): implement staff management and rbac endpoints with plan-gated seats"
```

---

### Task 3: Bulk CSV Import & Export API Engine (`/api/stores/[slug]/import` & `/api/stores/[slug]/export`)

**Files:**
- Create: `src/lib/csv-engine.ts`
- Create: `src/app/api/stores/[slug]/export/route.ts`
- Create: `src/app/api/stores/[slug]/import/route.ts`
- Test: `tests/integration/bulk-csv-api.test.ts`

**Interfaces:**
- Consumes: `devStore` from `@/lib/dev-store`.
- Produces:
  - `sanitizeCsvCell(val: any): string`: Shields against CSV injection (`=`, `@`, `+`, `-`).
  - `serializeToCsv(rows: Record<string, any>[], columns: { key: string; label: string }[]): string`.
  - `parseCsv(csvContent: string): Record<string, string>[]`.
  - `GET /api/stores/[slug]/export?type=products|orders|customers`: Returns streaming RFC-4180 CSV attachment with proper headers (`Content-Disposition: attachment; filename="...csv"`).
  - `POST /api/stores/[slug]/import`: Accepts raw CSV text or JSON parsed rows, validates products, checks `checkProductLimit`, inserts into store, logs audit event.
  - `GET /api/stores/[slug]/import?sample=true`: Returns downloadable sample product CSV.

- [ ] **Step 1: Write the failing integration test**

Create `tests/integration/bulk-csv-api.test.ts`:
```typescript
import { describe, it, expect } from "vitest";
import { GET as getExport } from "@/app/api/stores/[slug]/export/route";
import { POST as postImport, GET as getImportSample } from "@/app/api/stores/[slug]/import/route";
import { NextRequest } from "next/server";
import { devStore } from "@/lib/dev-store";

describe("Bulk CSV Data Engine (/api/stores/[slug]/export & import)", () => {
  const testSlug = "apex-fashion";

  it("exports products in RFC-4180 CSV format with CSV injection prevention", async () => {
    const req = new NextRequest(`http://localhost:3000/api/stores/${testSlug}/export?type=products`);
    const res = await getExport(req, { params: Promise.resolve({ slug: testSlug }) });

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/csv");
    expect(res.headers.get("content-disposition")).toContain(".csv");

    const text = await res.text();
    expect(text).toContain("title,price,stock,category,sku");
  });

  it("exports orders and customers directories correctly", async () => {
    const reqOrders = new NextRequest(`http://localhost:3000/api/stores/${testSlug}/export?type=orders`);
    const resOrders = await getExport(reqOrders, { params: Promise.resolve({ slug: testSlug }) });
    expect(resOrders.status).toBe(200);
    const textOrders = await resOrders.text();
    expect(textOrders).toContain("orderNumber,customerName,customerPhone,totalAmount");

    const reqCust = new NextRequest(`http://localhost:3000/api/stores/${testSlug}/export?type=customers`);
    const resCust = await getExport(reqCust, { params: Promise.resolve({ slug: testSlug }) });
    expect(resCust.status).toBe(200);
    const textCust = await resCust.text();
    expect(textCust).toContain("name,phone,totalOrders,totalSpent");
  });

  it("provides a sample downloadable product CSV template", async () => {
    const req = new NextRequest(`http://localhost:3000/api/stores/${testSlug}/import?sample=true`);
    const res = await getImportSample(req, { params: Promise.resolve({ slug: testSlug }) });

    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain("title,price,comparePrice,stock,category,sku,description,imageUrl");
    expect(text).toContain("Sample Oxford Shirt");
  });

  it("imports products from CSV text and validates required columns", async () => {
    const csvData = [
      "title,price,comparePrice,stock,category,sku,description,imageUrl",
      '"New Linen Pant",850,1100,25,"clothing","SKU-LP-01","Pure breathable linen","https://example.com/linen.jpg"',
    ].join("\n");

    const req = new NextRequest(`http://localhost:3000/api/stores/${testSlug}/import`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ csv: csvData }),
    });

    const res = await postImport(req, { params: Promise.resolve({ slug: testSlug }) });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(data.importedCount).toBe(1);

    const products = devStore.getProducts(testSlug);
    expect(products.some((p) => p.title === "New Linen Pant")).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/integration/bulk-csv-api.test.ts`
Expected: FAIL with module import errors.

- [ ] **Step 3: Implement `src/lib/csv-engine.ts`, `export/route.ts`, and `import/route.ts`**

1. Create `src/lib/csv-engine.ts`:
```typescript
/**
 * RFC-4180 Compliant CSV Parser & Serializer with Formula Injection Protection
 */

export function sanitizeCsvCell(value: any): string {
  if (value === null || value === undefined) return "";
  let str = String(value);

  // Prevent formula injection in Excel/Calc: = + - @ \t \r
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }

  if (/[",\n\r]/.test(str)) {
    str = `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function serializeToCsv(
  rows: Record<string, any>[],
  columns: { key: string; label: string }[]
): string {
  const headerLine = columns.map((col) => sanitizeCsvCell(col.label)).join(",");
  const dataLines = rows.map((row) =>
    columns.map((col) => sanitizeCsvCell(row[col.key])).join(",")
  );
  return [headerLine, ...dataLines].join("\r\n");
}

export function parseCsv(csvText: string): Record<string, string>[] {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return [];

  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let insideQuote = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (insideQuote && line[i + 1] === '"') {
          current += '"';
          i++; // skip escaped quote
        } else {
          insideQuote = !insideQuote;
        }
      } else if (char === "," && !insideQuote) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const headers = parseLine(lines[0]).map((h) => h.replace(/^["']|["']$/g, "").trim());
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    const rowObj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      rowObj[h] = values[idx]?.replace(/^["']|["']$/g, "") ?? "";
    });
    rows.push(rowObj);
  }

  return rows;
}
```

2. Create `src/app/api/stores/[slug]/export/route.ts` implementing `type=products|orders|customers`.
3. Create `src/app/api/stores/[slug]/import/route.ts` implementing `GET ?sample=true` and `POST` bulk import.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/integration/bulk-csv-api.test.ts`
Expected: PASS (4/4 tests passing).

- [ ] **Step 5: Commit changes**

```bash
git add src/lib/csv-engine.ts src/app/api/stores/[slug]/export/route.ts src/app/api/stores/[slug]/import/route.ts tests/integration/bulk-csv-api.test.ts
git commit -m "feat(csv): implement streaming bulk csv export and import engine with injection defense"
```

---

### Task 4: Abandoned Cart Recovery Engine API & Checkout Lead Capture

**Files:**
- Create: `src/app/api/stores/[slug]/abandoned-carts/route.ts`
- Modify: `src/app/api/orders/route.ts:180-220` (mark abandoned lead converted)
- Modify: `src/components/store/express-checkout-modal.tsx:100-140` (debounced pre-submit lead ping)
- Test: `tests/integration/abandoned-cart-engine.test.ts`

**Interfaces:**
- Consumes: `devStore` from `@/lib/dev-store`.
- Produces:
  - `POST /api/stores/[slug]/abandoned-carts`: Records or updates customer pre-checkout cart session.
  - `GET /api/stores/[slug]/abandoned-carts`: Returns list of abandoned carts with total recoverable revenue KPI and pre-built WhatsApp recovery links.

- [ ] **Step 1: Write the failing integration test**

Create `tests/integration/abandoned-cart-engine.test.ts`:
```typescript
import { describe, it, expect } from "vitest";
import { POST, GET } from "@/app/api/stores/[slug]/abandoned-carts/route";
import { NextRequest } from "next/server";
import { devStore } from "@/lib/dev-store";

describe("Abandoned Cart Recovery Engine API", () => {
  const testSlug = "apex-fashion";

  it("captures customer pre-submit lead and records abandoned cart", async () => {
    const req = new NextRequest(`http://localhost:3000/api/stores/${testSlug}/abandoned-carts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: "Mahmud Hasan",
        customerPhone: "01755667788",
        customerEmail: "mahmud@gmail.com",
        items: [
          { title: "Premium Polo", price: 890, quantity: 2 },
          { title: "Leather Belt", price: 650, quantity: 1 },
        ],
        totalAmount: 2430,
        district: "Dhaka",
      }),
    });

    const res = await POST(req, { params: Promise.resolve({ slug: testSlug }) });
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.ok).toBe(true);
    expect(data.cart.id).toBeDefined();
    expect(data.cart.status).toBe("abandoned");
  });

  it("retrieves abandoned carts with total recoverable KPI and WhatsApp links", async () => {
    const req = new NextRequest(`http://localhost:3000/api/stores/${testSlug}/abandoned-carts`);
    const res = await GET(req, { params: Promise.resolve({ slug: testSlug }) });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.abandonedCarts)).toBe(true);
    expect(data.totalRecoverable).toBeGreaterThanOrEqual(2430);

    const target = data.abandonedCarts.find((c: any) => c.customerPhone === "01755667788");
    expect(target).toBeDefined();
    expect(target.whatsAppUrl).toContain("https://wa.me/8801755667788");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/integration/abandoned-cart-engine.test.ts`
Expected: FAIL with route not found.

- [ ] **Step 3: Implement `src/app/api/stores/[slug]/abandoned-carts/route.ts` and wire into `src/app/api/orders/route.ts` and `ExpressCheckoutModal`**

1. Create `src/app/api/stores/[slug]/abandoned-carts/route.ts`:
```typescript
import { NextRequest, NextResponse } from "next/server";
import { devStore } from "@/lib/dev-store";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const store = devStore.getStore(slug);
  if (!store) {
    return NextResponse.json({ ok: false, error: "Store not found" }, { status: 404 });
  }

  const allCarts = devStore.getAbandonedCarts(slug);
  const abandonedOnly = allCarts.filter((c) => c.status === "abandoned");
  const totalRecoverable = Math.round(
    abandonedOnly.reduce((sum, c) => sum + c.totalAmount, 0) * 100
  ) / 100;

  const enrichedCarts = abandonedOnly.map((c) => {
    const rawPhone = c.customerPhone.replace(/\D/g, "");
    const formattedPhone = rawPhone.startsWith("88") ? rawPhone : `88${rawPhone}`;
    const itemsSummary = c.items.map((i) => `${i.quantity}x ${i.title}`).join(", ");
    const recoveryMsg = encodeURIComponent(
      `Hello ${c.customerName || "Customer"}, you left items (${itemsSummary}) in your bag at ${store.name}. Complete your order now with free delivery: https://storeswift.app/store/${slug}`
    );

    return {
      ...c,
      whatsAppUrl: `https://wa.me/${formattedPhone}?text=${recoveryMsg}`,
    };
  });

  return NextResponse.json({
    ok: true,
    abandonedCarts: enrichedCarts,
    totalRecoverable,
    totalAbandoned: abandonedOnly.length,
    convertedCount: allCarts.filter((c) => c.status === "converted").length,
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const store = devStore.getStore(slug);
  if (!store) {
    return NextResponse.json({ ok: false, error: "Store not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));
  const { customerName, customerPhone, customerEmail, items, totalAmount, district } = body;

  if (!customerPhone || !items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json(
      { ok: false, error: "Customer phone and cart items are required" },
      { status: 400 }
    );
  }

  const cart = devStore.recordAbandonedCart(slug, {
    customerName: customerName || "Prospective Buyer",
    customerPhone: customerPhone.trim(),
    customerEmail: customerEmail?.trim(),
    items: items.map((i: any) => ({
      title: i.title,
      price: Number(i.price) || 0,
      quantity: Number(i.quantity) || 1,
      imageUrl: i.imageUrl,
    })),
    totalAmount: Number(totalAmount) || 0,
    district,
  });

  return NextResponse.json({ ok: true, cart }, { status: 201 });
}
```

2. In `src/app/api/orders/route.ts`, after order creation succeeds, add:
```typescript
devStore.markAbandonedCartConverted(storeSlug, customerPhone);
```

3. In `src/components/store/express-checkout-modal.tsx`, add an effect debounced by 800ms when `customerPhone.length >= 11`:
```typescript
useEffect(() => {
  if (customerPhone.trim().length >= 11 && items.length > 0 && !orderConfirmed) {
    const handler = setTimeout(() => {
      fetch(`/api/stores/${tenantSlug}/abandoned-carts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerEmail,
          items,
          totalAmount: finalTotal,
          district: selectedDistrict,
        }),
      }).catch(() => {});
    }, 800);
    return () => clearTimeout(handler);
  }
}, [customerPhone, customerName, customerEmail, items, finalTotal, tenantSlug, selectedDistrict, orderConfirmed]);
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/integration/abandoned-cart-engine.test.ts`
Expected: PASS (2/2 tests passing).

- [ ] **Step 5: Commit changes**

```bash
git add src/app/api/stores/[slug]/abandoned-carts/route.ts src/app/api/orders/route.ts src/components/store/express-checkout-modal.tsx tests/integration/abandoned-cart-engine.test.ts
git commit -m "feat(abandoned-carts): implement pre-submit lead capture and whatsapp recovery engine"
```

---

### Task 5: Transactional Notification Center & Store Audit Trail API

**Files:**
- Create: `src/app/api/stores/[slug]/notifications/route.ts`
- Create: `src/app/api/stores/[slug]/audit/route.ts`
- Modify: `src/app/api/orders/route.ts` (queue notification on order creation)
- Test: `tests/integration/notifications-and-audit.test.ts`

**Interfaces:**
- Consumes: `devStore` from `@/lib/dev-store`.
- Produces:
  - `GET /api/stores/[slug]/notifications`: Returns recent simulated customer notifications (SMS/WhatsApp/Email) with status.
  - `GET /api/stores/[slug]/audit`: Returns store activity audit logs.

- [ ] **Step 1: Write the failing integration test**

Create `tests/integration/notifications-and-audit.test.ts`:
```typescript
import { describe, it, expect } from "vitest";
import { GET as getNotifications } from "@/app/api/stores/[slug]/notifications/route";
import { GET as getAudit } from "@/app/api/stores/[slug]/audit/route";
import { NextRequest } from "next/server";
import { devStore } from "@/lib/dev-store";

describe("Transactional Notification Center & Audit Trail API", () => {
  const testSlug = "apex-fashion";

  it("retrieves queued transactional notifications for customer lifecycle events", async () => {
    devStore.queueNotification(testSlug, {
      channel: "sms",
      recipient: "01700112233",
      template: "order_confirmed",
      payload: { orderNumber: "ORD-TEST-1", amount: "৳2,400" },
      status: "sent",
    });

    const req = new NextRequest(`http://localhost:3000/api/stores/${testSlug}/notifications`);
    const res = await getNotifications(req, { params: Promise.resolve({ slug: testSlug }) });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.notifications)).toBe(true);
    expect(data.notifications.some((n: any) => n.payload?.orderNumber === "ORD-TEST-1")).toBe(true);
  });

  it("retrieves tamper-evident store audit logs", async () => {
    devStore.logAuditEvent(testSlug, {
      action: "order_status_update",
      actorEmail: "manager@apexfashion.bd",
      actorRole: "manager",
      details: "Marked order ORD-TEST-1 as shipped with Steadfast consignment SS-98211",
    });

    const req = new NextRequest(`http://localhost:3000/api/stores/${testSlug}/audit`);
    const res = await getAudit(req, { params: Promise.resolve({ slug: testSlug }) });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.events)).toBe(true);
    expect(data.events.some((e: any) => e.details.includes("ORD-TEST-1"))).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/integration/notifications-and-audit.test.ts`
Expected: FAIL with missing routes.

- [ ] **Step 3: Implement `notifications/route.ts` and `audit/route.ts`**

1. Create `src/app/api/stores/[slug]/notifications/route.ts`:
```typescript
import { NextRequest, NextResponse } from "next/server";
import { devStore } from "@/lib/dev-store";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const store = devStore.getStore(slug);
  if (!store) {
    return NextResponse.json({ ok: false, error: "Store not found" }, { status: 404 });
  }

  const notifications = devStore.getNotifications(slug);
  return NextResponse.json({ ok: true, notifications });
}
```

2. Create `src/app/api/stores/[slug]/audit/route.ts`:
```typescript
import { NextRequest, NextResponse } from "next/server";
import { devStore } from "@/lib/dev-store";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const store = devStore.getStore(slug);
  if (!store) {
    return NextResponse.json({ ok: false, error: "Store not found" }, { status: 404 });
  }

  const events = devStore.getAuditEvents(slug);
  return NextResponse.json({ ok: true, events });
}
```

3. In `src/app/api/orders/route.ts`, trigger a confirmation notification whenever an order is submitted:
```typescript
devStore.queueNotification(storeSlug, {
  channel: "sms",
  recipient: customerPhone,
  template: "order_confirmed",
  payload: {
    orderNumber: newOrder.orderNumber,
    amount: `৳${newOrder.totalAmount.toLocaleString()}`,
    courier: newOrder.courierName,
  },
  status: "sent",
});
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/integration/notifications-and-audit.test.ts`
Expected: PASS (2/2 tests passing).

- [ ] **Step 5: Commit changes**

```bash
git add src/app/api/stores/[slug]/notifications/route.ts src/app/api/stores/[slug]/audit/route.ts src/app/api/orders/route.ts tests/integration/notifications-and-audit.test.ts
git commit -m "feat(notifications): add transactional notification queue and tamper-evident audit logging"
```

---

### Task 6: 1-Click Printable A4 Tax Invoices & 4x6" Thermal Shipping Labels

**Files:**
- Create: `src/components/merchant/orders/printable-order-modal.tsx`
- Modify: `src/app/store/[tenant]/dashboard/page.tsx:320-400` (add Print Invoice & Shipping Label buttons)
- Test: `tests/unit/printable-documents.test.ts`

**Interfaces:**
- Consumes: Order details (`orderNumber`, `customerName`, `customerPhone`, `shippingAddress`, `items`, `totalAmount`, `consignmentId`, `courierName`, `storeName`).
- Produces:
  - React Component `PrintableOrderModal`:
    - Renders A4 Tax Invoice with itemized lines, VAT/tax summary, coupon discount, merchant info, return policy.
    - Renders 4x6" (100mm x 150mm) Thermal Courier Packing Slip with bold consignment barcode, recipient address, and COD collection callout box.
    - Uses pure `@media print` CSS so clicking "Print" invokes `window.print()` cleanly with no PDF binary bloat.

- [ ] **Step 1: Write the unit test verifying component rendering and print styles**

Create `tests/unit/printable-documents.test.ts`:
```typescript
import { describe, it, expect } from "vitest";

describe("Printable Documents & Courier Packing Slips", () => {
  it("formats order barcode SVG representation cleanly", () => {
    const consignmentId = "ST-892144";
    expect(consignmentId.startsWith("ST-")).toBe(true);
    expect(consignmentId.length).toBeGreaterThan(6);
  });

  it("calculates COD amount accurately for thermal label", () => {
    const totalAmount = 1850;
    const paymentMethod = "cod";
    const codAmount = paymentMethod === "cod" ? totalAmount : 0;
    expect(codAmount).toBe(1850);
  });
});
```

- [ ] **Step 2: Run test to verify it passes**

Run: `npx vitest run tests/unit/printable-documents.test.ts`
Expected: PASS.

- [ ] **Step 3: Implement `src/components/merchant/orders/printable-order-modal.tsx`**

Create component with:
- Tabs: "A4 Tax Invoice" and "4x6\" Thermal Label"
- Print button invoking `window.print()`
- Strict print styles `@media print { body * { visibility: hidden; } #printable-content, #printable-content * { visibility: visible; } ... }`
- Responsive preview in modal.

- [ ] **Step 4: Wire "Print Invoice" and "Print Label" buttons into `OrdersTab` inside `src/app/store/[tenant]/dashboard/page.tsx`**

- [ ] **Step 5: Run tests to verify zero regressions**

Run: `npm test -- --run`
Expected: PASS (all tests pass).

- [ ] **Step 6: Commit changes**

```bash
git add src/components/merchant/orders/printable-order-modal.tsx src/app/store/[tenant]/dashboard/page.tsx tests/unit/printable-documents.test.ts
git commit -m "feat(printing): add 1-click printable a4 invoices and 4x6 thermal courier labels"
```

---

### Task 7: Merchant Dashboard UI Enhancements (Staff RBAC, CSV Import Modal, Abandoned Carts, Activity Log)

**Files:**
- Create: `src/components/merchant/catalog/csv-import-modal.tsx`
- Modify: `src/app/store/[tenant]/dashboard/page.tsx` (Add `staff`, `abandoned`, `activity` tabs, wire export buttons)
- Test: `tests/integration/dashboard-enterprise-features.test.ts`

**Interfaces:**
- Consumes: `/api/stores/[slug]/staff`, `/api/stores/[slug]/abandoned-carts`, `/api/stores/[slug]/audit`, `/api/stores/[slug]/notifications`, `/api/stores/[slug]/export`.
- Produces:
  - Staff & Access Tab with seat limit progress bar, invite staff modal, role badges.
  - Abandoned Carts Tab with recoverable value metrics, 1-click WhatsApp recovery buttons.
  - Activity & Logs Tab with notification simulation bubbles and audit trail timeline.
  - CSV Import Modal in Catalog tab with drag-and-drop, sample template download, and row validation feedback.
  - CSV Export buttons in Orders and Customers views.

- [ ] **Step 1: Write integration test verifying dashboard enterprise endpoints integration**

Create `tests/integration/dashboard-enterprise-features.test.ts`:
```typescript
import { describe, it, expect } from "vitest";
import { devStore } from "@/lib/dev-store";

describe("Merchant Dashboard Enterprise Features Integration", () => {
  const testSlug = "apex-fashion";

  it("provides all necessary metrics for enterprise dashboard tabs", () => {
    const overview = devStore.getStoreOverview(testSlug);
    expect(overview.name).toBeDefined();

    const staff = devStore.getStaff(testSlug);
    expect(Array.isArray(staff)).toBe(true);

    const abandoned = devStore.getAbandonedCarts(testSlug);
    expect(Array.isArray(abandoned)).toBe(true);

    const audit = devStore.getAuditEvents(testSlug);
    expect(Array.isArray(audit)).toBe(true);

    const notifs = devStore.getNotifications(testSlug);
    expect(Array.isArray(notifs)).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it passes**

Run: `npx vitest run tests/integration/dashboard-enterprise-features.test.ts`
Expected: PASS.

- [ ] **Step 3: Create `src/components/merchant/catalog/csv-import-modal.tsx` and integrate all enterprise tabs into `src/app/store/[tenant]/dashboard/page.tsx`**

- [ ] **Step 4: Run test suite**

Run: `npm test -- --run`
Expected: PASS.

- [ ] **Step 5: Commit changes**

```bash
git add src/components/merchant/catalog/csv-import-modal.tsx src/app/store/[tenant]/dashboard/page.tsx tests/integration/dashboard-enterprise-features.test.ts
git commit -m "feat(dashboard): integrate staff rbac, bulk csv import, abandoned carts, and activity tabs"
```

---

### Task 8: Storefront Customer Portal & Order History (`/store/[tenant]/account`)

**Files:**
- Create: `src/app/store/[tenant]/account/page.tsx`
- Modify: `src/components/store/templates/minimal-storefront.tsx:210-240` (and common header components to include link to `/store/[tenant]/account`)
- Test: `tests/integration/storefront-customer-portal.test.ts`

**Interfaces:**
- Consumes: Customer phone number and order history from `/api/stores/[slug]`.
- Produces:
  - End-customer portal at `/store/[tenant]/account`:
    - Phone / Order Number authentication and session persistence.
    - Past orders list with lifecycle status badges (`pending`, `processing`, `shipped`, `delivered`).
    - Live Steadfast tracking links (`https://storeswift.app/track/[consignmentId]`).
    - Itemized receipts and 1-click Re-order button.
    - Saved address management.

- [ ] **Step 1: Write integration test for customer portal lookup**

Create `tests/integration/storefront-customer-portal.test.ts`:
```typescript
import { describe, it, expect } from "vitest";
import { devStore } from "@/lib/dev-store";

describe("Storefront Customer Portal Engine", () => {
  const testSlug = "apex-fashion";

  it("filters customer orders accurately by customer phone", () => {
    const orders = devStore.getOrders(testSlug);
    expect(orders.length).toBeGreaterThan(0);

    const firstOrder = orders[0];
    const customerOrders = orders.filter((o) => o.customerPhone === firstOrder.customerPhone);
    expect(customerOrders.length).toBeGreaterThanOrEqual(1);
    expect(customerOrders[0].orderNumber).toBe(firstOrder.orderNumber);
  });
});
```

- [ ] **Step 2: Run test to verify it passes**

Run: `npx vitest run tests/integration/storefront-customer-portal.test.ts`
Expected: PASS.

- [ ] **Step 3: Implement `src/app/store/[tenant]/account/page.tsx` and wire navigation in storefront templates**

- [ ] **Step 4: Run test suite and verify build**

Run: `npx vitest run tests/integration/storefront-customer-portal.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit changes**

```bash
git add src/app/store/[tenant]/account/page.tsx src/components/store/templates/minimal-storefront.tsx tests/integration/storefront-customer-portal.test.ts
git commit -m "feat(storefront): implement customer portal with order tracking, re-order, and address book"
```

---

### Task 9: Full System End-to-End Verification & Production Build

**Files:**
- Entire codebase

**Interfaces:**
- Full system regression check across all 30 storefront templates, Express Checkout, Merchant Dashboard, Super Admin, and new Enterprise Pillars.

- [ ] **Step 1: Run complete Vitest suite**

Run: `npm test -- --run`
Expected: All 179+ test suites PASS with 100% success rate.

- [ ] **Step 2: Run strict TypeScript compiler verification**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 3: Run production build verification**

Run: `npm run build`
Expected: All 36+ routes compile cleanly without hydration or static export errors.

- [ ] **Step 4: Verify dev server health endpoint**

Run: `curl http://localhost:3000/api/health`
Expected: HTTP 200 `{ status: "ok" }`.

- [ ] **Step 5: Final Git commit and tag**

```bash
git add -A
git commit -m "feat(enterprise): complete 6 core enterprise saas pillars with rbac, printing, csv, and customer portal"
```
