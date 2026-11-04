import { NextResponse } from "next/server";
import { db } from "@/db";
import { analyticsSnapshots, orders, stores } from "@/db/schema";
import { eq, gte, lte, desc, count, and, sql } from "drizzle-orm";
import { getSessionFromRequest, canAccessStore } from "@/lib/api-auth";
import { devStore } from "@/lib/dev-store";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const storeSlug = url.searchParams.get("storeSlug");
  const period = url.searchParams.get("period") ?? "30d";
  const session = getSessionFromRequest(request);

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized: Session required to view analytics." },
      { status: 401 }
    );
  }

  const targetSlug = storeSlug || session.slug || session.storeId || "apex-fashion";

  if (!canAccessStore(session, targetSlug)) {
    return NextResponse.json(
      { error: "Forbidden: You do not have permission to view this store's analytics." },
      { status: 403 }
    );
  }

  // Calculate live overview from devStore
  const overview = devStore.getStoreOverview(targetSlug);

  try {
    let storeId: string | undefined;
    if (storeSlug) {
      const s = await db.query.stores.findFirst({
        where: eq(stores.slug, storeSlug),
        columns: { id: true },
      });
      if (s) storeId = s.id;
    } else if (session?.storeId) {
      storeId = session.storeId;
    }

    if (storeId) {
      const [orderStats] = await db
        .select({
          totalRevenue: sql<string>`coalesce(sum(total_amount::numeric), 0)`,
          totalOrders: count(),
        })
        .from(orders)
        .where(eq(orders.storeId, storeId));

      if (orderStats && Number(orderStats.totalOrders) > 0) {
        overview.totalRevenue = parseFloat(orderStats.totalRevenue);
        overview.totalOrders = Number(orderStats.totalOrders);
      }
    }
  } catch {
    // Non-fatal
  }

  return NextResponse.json({
    ok: true,
    overview,
    period,
    summary: {
      totalRevenue: overview.totalRevenue,
      totalOrders: overview.totalOrders,
      totalCustomers: overview.totalCustomers,
      avgOrderValue: overview.totalOrders > 0 ? Math.round(overview.totalRevenue / overview.totalOrders) : 0,
      avgConversion: 3.4,
    },
    snapshots: [],
  });
}
