import { NextResponse } from "next/server";
import { db, stores, orders, commissionEvents, users } from "@/db";
import { eq, sql, count, desc, and } from "drizzle-orm";
import { getSessionFromRequest } from "@/lib/api-auth";
import { devStore } from "@/lib/dev-store";

export async function GET(request: Request) {
  const session = getSessionFromRequest(request);
  const isDev = process.env.NODE_ENV !== "production";

  if (!isDev && (!session || session.role !== "super_admin")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") ?? "1", 10);
  const limit = parseInt(url.searchParams.get("limit") ?? "20", 10);
  const search = url.searchParams.get("search")?.toLowerCase() ?? "";
  const plan = url.searchParams.get("plan") ?? "";
  const status = url.searchParams.get("status") ?? "";

  try {
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
      .limit(limit);

    if (storeList.length > 0) {
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

            return {
              ...store,
              owner: null,
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
    }
  } catch {
    // Fall through to devStore
  }

  // devStore enriched merchants
  let all = devStore.getAllStores();
  if (plan) all = all.filter((s) => s.plan === plan);
  if (status) all = all.filter((s) => s.storeStatus === status);
  if (search) all = all.filter((s) => s.name.toLowerCase().includes(search) || s.slug.includes(search));

  const enriched = all.map((s) => {
    const orders = devStore.getOrders(s.slug);
    const comms = devStore.getCommissions("pending").filter((c) => c.storeSlug === s.slug || c.storeId === s.id);
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const pendingCommissionBdt = comms.reduce((sum, c) => sum + c.commissionBdt, 0);

    return {
      id: s.id,
      name: s.name,
      slug: s.slug,
      category: s.category,
      plan: s.plan,
      storeStatus: s.storeStatus,
      subscriptionStatus: "active",
      totalOrders: orders.length,
      totalRevenue,
      pendingCommissionBdt,
      createdAt: s.createdAt,
      owner: { email: s.email, fullName: `${s.name} Owner`, phone: s.phone },
    };
  });

  return NextResponse.json({ ok: true, merchants: enriched, page, limit });
}

export async function PATCH(request: Request) {
  const session = getSessionFromRequest(request);
  const isDev = process.env.NODE_ENV !== "production";

  if (!isDev && (!session || session.role !== "super_admin")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { storeId, action } = await request.json();
    if (!storeId || !["suspend", "activate", "archive"].includes(action)) {
      return NextResponse.json({ error: "Invalid action or missing storeId" }, { status: 400 });
    }

    const newStatus = action === "suspend" ? "suspended" : action === "archive" ? "archived" : "active";

    // 1. Update devStore
    devStore.updateStore(storeId, { storeStatus: newStatus });

    // 2. Try DB
    try {
      await db
        .update(stores)
        .set({ storeStatus: newStatus, updatedAt: new Date() })
        .where(eq(stores.id, storeId));
    } catch {
      // Non-fatal
    }

    return NextResponse.json({ ok: true, storeId, newStatus });
  } catch (err) {
    console.error("[Merchants PATCH Error]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
