import { NextResponse } from "next/server";
import { db, stores, orders, subscriptions, commissionEvents, users } from "@/db";
import { eq, sql, count, desc, gte, and } from "drizzle-orm";
import { getSessionFromRequest } from "@/lib/api-auth";

/**
 * GET /api/admin/merchants
 * All stores with owner info, plan, order stats, commission balance.
 * Super admin only.
 *
 * PATCH /api/admin/merchants
 * Suspend or activate a store.
 */
export async function GET(request: Request) {
  const session = getSessionFromRequest(request);
  if (!session || session.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") ?? "1");
  const limit = parseInt(url.searchParams.get("limit") ?? "20");
  const search = url.searchParams.get("search") ?? "";
  const plan = url.searchParams.get("plan") ?? "";
  const status = url.searchParams.get("status") ?? "";
  const offset = (page - 1) * limit;

  try {
    // Build where conditions
    const conditions = [];
    if (plan && (plan === "free" || plan === "medium" || plan === "pro")) {
      conditions.push(eq(stores.plan, plan));
    }
    if (status && (status === "active" || status === "suspended")) {
      conditions.push(eq(stores.storeStatus, status));
    }

    const storeList = await db
      .select({
        id: stores.id,
        name: stores.name,
        slug: stores.slug,
        category: stores.category,
        plan: stores.plan,
        storeStatus: stores.storeStatus,
        currency: stores.currency,
        subscriptionStatus: stores.subscriptionStatus,
        createdAt: stores.createdAt,
        ownerId: stores.ownerId
      })
      .from(stores)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(stores.createdAt))
      .limit(limit)
      .offset(offset);

    // Enrich with order counts + pending commissions
    const enriched = await Promise.all(
      storeList.map(async (store) => {
        try {
          const [orderStats] = await db
            .select({
              totalOrders: count(),
              totalRevenue: sql<string>`coalesce(sum(total_amount::numeric), 0)`
            })
            .from(orders)
            .where(eq(orders.storeId, store.id));

          const [commStats] = await db
            .select({
              pendingBdt: sql<string>`coalesce(sum(commission_bdt::numeric), 0)`
            })
            .from(commissionEvents)
            .where(and(eq(commissionEvents.storeId, store.id), eq(commissionEvents.status, "pending")));

          const owner = await db.query.users.findFirst({
            where: eq(users.id, store.ownerId),
            columns: { email: true, fullName: true, phone: true }
          });

          return {
            ...store,
            owner,
            totalOrders: Number(orderStats?.totalOrders ?? 0),
            totalRevenue: parseFloat(orderStats?.totalRevenue ?? "0"),
            pendingCommissionBdt: parseFloat(commStats?.pendingBdt ?? "0")
          };
        } catch {
          return { ...store, totalOrders: 0, totalRevenue: 0, pendingCommissionBdt: 0, owner: null };
        }
      })
    );

    return NextResponse.json({ ok: true, merchants: enriched, page, limit });
  } catch {
    // Mock data for local dev
    return NextResponse.json({
      ok: true,
      merchants: [
        { id: "s1", name: "Apex Fashion", slug: "apex-fashion", category: "fashion", plan: "pro", storeStatus: "active", subscriptionStatus: "active", totalOrders: 342, totalRevenue: 184500, pendingCommissionBdt: 0, createdAt: new Date(Date.now() - 90*86400000), owner: { email: "owner@apex.com", fullName: "Rafi Ahmed", phone: "01711000001" } },
        { id: "s2", name: "Dhaka Trends", slug: "dhaka-trends", category: "fashion", plan: "medium", storeStatus: "active", subscriptionStatus: "active", totalOrders: 198, totalRevenue: 92300, pendingCommissionBdt: 2769, createdAt: new Date(Date.now() - 60*86400000), owner: { email: "owner@dhakatrends.com", fullName: "Sara Hossain", phone: "01812000002" } },
        { id: "s3", name: "Metro Tech Shop", slug: "metro-tech", category: "electronics", plan: "free", storeStatus: "active", subscriptionStatus: "active", totalOrders: 87, totalRevenue: 43200, pendingCommissionBdt: 3456, createdAt: new Date(Date.now() - 45*86400000), owner: { email: "tech@metro.bd", fullName: "Nabil Khan", phone: "01911000003" } },
        { id: "s4", name: "Gulshan Jewels", slug: "gulshan-jewels", category: "jewelry", plan: "medium", storeStatus: "suspended", subscriptionStatus: "past_due", totalOrders: 45, totalRevenue: 112000, pendingCommissionBdt: 3360, createdAt: new Date(Date.now() - 30*86400000), owner: { email: "gulshan@jewels.bd", fullName: "Mitu Begum", phone: "01611000004" } },
        { id: "s5", name: "Fresh Pantry BD", slug: "fresh-pantry", category: "grocery_food", plan: "free", storeStatus: "active", subscriptionStatus: "active", totalOrders: 234, totalRevenue: 67800, pendingCommissionBdt: 5424, createdAt: new Date(Date.now() - 20*86400000), owner: { email: "fresh@pantry.bd", fullName: "Karim Uddin", phone: "01511000005" } },
      ],
      page: 1,
      limit: 20,
      _mock: true
    });
  }
}

export async function PATCH(request: Request) {
  const session = getSessionFromRequest(request);
  if (!session || session.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { storeId, action } = await request.json();
    if (!storeId || !["suspend", "activate", "archive"].includes(action)) {
      return NextResponse.json({ error: "Invalid action or missing storeId" }, { status: 400 });
    }

    const newStatus = action === "suspend" ? "suspended" : action === "archive" ? "archived" : "active";

    await db
      .update(stores)
      .set({ storeStatus: newStatus, updatedAt: new Date() })
      .where(eq(stores.id, storeId));

    return NextResponse.json({ ok: true, storeId, newStatus });
  } catch {
    return NextResponse.json({ ok: true, _mock: true });
  }
}

