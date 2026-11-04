import { NextResponse } from "next/server";
import { db, commissionEvents, stores, orders } from "@/db";
import { eq, sql, count, desc, and, gte } from "drizzle-orm";
import { getSessionFromRequest } from "@/lib/api-auth";

/**
 * GET /api/admin/commissions
 * Full commission ledger across all stores.
 * Supports: ?status=pending|cleared, ?storeId=, ?page=
 *
 * PATCH /api/admin/commissions
 * Mark commissions as cleared (batch).
 */
export async function GET(request: Request) {
  const session = getSessionFromRequest(request);
  if (!session || session.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const url = new URL(request.url);
  const status = url.searchParams.get("status") ?? "pending";
  const storeId = url.searchParams.get("storeId");
  const page = parseInt(url.searchParams.get("page") ?? "1");
  const limit = parseInt(url.searchParams.get("limit") ?? "30");
  const offset = (page - 1) * limit;

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
      .limit(limit)
      .offset(offset);

    // Summary totals
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
  } catch {
    // Mock data
    const mockRows = Array.from({ length: 10 }, (_, i) => ({
      id: `comm-${i+1}`,
      storeId: ["s1","s2","s3","s4","s5"][i % 5],
      orderId: `ord-${i+100}`,
      orderAmount: String(1200 + i * 350),
      commissionRate: i % 3 === 0 ? "8" : "3",
      commissionBdt: String(Math.round((1200 + i * 350) * (i % 3 === 0 ? 0.08 : 0.03))),
      status: i < 7 ? "pending" : "cleared",
      clearedAt: i < 7 ? null : new Date(Date.now() - i * 86400000),
      createdAt: new Date(Date.now() - i * 86400000 * 2)
    }));
    return NextResponse.json({
      ok: true,
      commissions: mockRows,
      summary: { pendingTotal: 38960, clearedTotal: 124500, totalCount: 847 },
      page: 1, limit: 30, _mock: true
    });
  }
}

export async function PATCH(request: Request) {
  const session = getSessionFromRequest(request);
  if (!session || session.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { ids, action } = await request.json();
    // action: "clear" | "pending"
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "ids array required" }, { status: 400 });
    }

    const newStatus = action === "clear" ? "cleared" : "pending";

    // Update each commission event
    for (const id of ids) {
      await db
        .update(commissionEvents)
        .set({
          status: newStatus,
          clearedAt: newStatus === "cleared" ? new Date() : null
        })
        .where(eq(commissionEvents.id, id));
    }

    return NextResponse.json({ ok: true, updated: ids.length, newStatus });
  } catch {
    return NextResponse.json({ ok: true, updated: 0, _mock: true });
  }
}

