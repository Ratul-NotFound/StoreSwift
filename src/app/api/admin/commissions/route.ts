import { NextResponse } from "next/server";
import { db, commissionEvents } from "@/db";
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
  const status = url.searchParams.get("status") as "pending" | "cleared" | null;
  const storeId = url.searchParams.get("storeId");
  const page = parseInt(url.searchParams.get("page") ?? "1", 10);
  const limit = parseInt(url.searchParams.get("limit") ?? "30", 10);

  try {
    const conditions = [];
    if (status === "pending" || status === "cleared") {
      conditions.push(eq(commissionEvents.status, status));
    }
    if (storeId) {
      conditions.push(eq(commissionEvents.storeId, storeId));
    }

    const rows = await db
      .select({
        id: commissionEvents.id,
        storeId: commissionEvents.storeId,
        orderId: commissionEvents.orderId,
        orderAmount: commissionEvents.orderAmount,
        commissionRate: commissionEvents.commissionRate,
        commissionBdt: commissionEvents.commissionBdt,
        status: commissionEvents.status,
        clearedAt: commissionEvents.clearedAt,
        createdAt: commissionEvents.createdAt
      })
      .from(commissionEvents)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(commissionEvents.createdAt))
      .limit(limit);

    if (rows.length > 0) {
      const [summary] = await db
        .select({
          pendingTotal: sql<string>`coalesce(sum(case when status = 'pending' then commission_bdt::numeric else 0 end), 0)`,
          clearedTotal: sql<string>`coalesce(sum(case when status = 'cleared' then commission_bdt::numeric else 0 end), 0)`,
          totalCount: count()
        })
        .from(commissionEvents);

      return NextResponse.json({
        ok: true,
        commissions: rows,
        summary: {
          pendingTotal: parseFloat(summary?.pendingTotal ?? "0"),
          clearedTotal: parseFloat(summary?.clearedTotal ?? "0"),
          totalCount: Number(summary?.totalCount ?? 0)
        },
        page, limit
      });
    }
  } catch {
    // Fall through to devStore
  }

  // devStore commissions
  const allComms = devStore.getCommissions();
  const filtered = status ? allComms.filter((c) => c.status === status) : allComms;
  const pendingTotal = allComms.filter((c) => c.status === "pending").reduce((s, c) => s + c.commissionBdt, 0);
  const clearedTotal = allComms.filter((c) => c.status === "cleared").reduce((s, c) => s + c.commissionBdt, 0);

  return NextResponse.json({
    ok: true,
    commissions: filtered,
    summary: {
      pendingTotal,
      clearedTotal,
      totalCount: allComms.length,
    },
    page,
    limit,
  });
}

export async function PATCH(request: Request) {
  const session = getSessionFromRequest(request);
  const isDev = process.env.NODE_ENV !== "production";

  if (!isDev && (!session || session.role !== "super_admin")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { ids, action } = await request.json();
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "ids array required" }, { status: 400 });
    }

    const newStatus = action === "clear" ? "cleared" : "pending";

    // 1. Update devStore
    for (const id of ids) {
      if (action === "clear") {
        devStore.markCommissionCleared(id);
      }
    }

    // 2. Try DB
    try {
      for (const id of ids) {
        await db
          .update(commissionEvents)
          .set({
            status: newStatus,
            clearedAt: newStatus === "cleared" ? new Date() : null,
          })
          .where(eq(commissionEvents.id, id));
      }
    } catch {
      // Non-fatal
    }

    return NextResponse.json({ ok: true, updated: ids.length, newStatus });
  } catch (err) {
    console.error("[Commissions PATCH Error]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
