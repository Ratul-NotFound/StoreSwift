import { NextResponse } from "next/server";
import { db } from "@/db";
import { commissionEvents, stores, subscriptions } from "@/db/schema";
import { eq, desc, sum, and } from "drizzle-orm";
import { getSessionFromRequest } from "@/lib/api-auth";

// ─── GET: commission ledger (super-admin sees all, merchant sees own) ─────────

export async function GET(request: Request) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const status  = url.searchParams.get("status");   // "pending" | "cleared" | "all"
  const storeId = url.searchParams.get("storeId");  // super-admin filter
  const limit   = Math.min(parseInt(url.searchParams.get("limit") ?? "50"), 200);

  try {
    // Build filters
    const filters = [];

    if (session.role !== "super_admin") {
      // Merchants can only see their own commissions
      filters.push(eq(commissionEvents.storeId, session.storeId));
    } else if (storeId) {
      filters.push(eq(commissionEvents.storeId, storeId));
    }

    if (status && status !== "all") {
      filters.push(eq(commissionEvents.status, status));
    }

    const events = await db
      .select()
      .from(commissionEvents)
      .where(filters.length > 0 ? and(...filters) : undefined)
      .orderBy(desc(commissionEvents.createdAt))
      .limit(limit);

    // Aggregate totals
    const [totals] = await db
      .select({
        totalPending: sum(commissionEvents.commissionBdt).as("total_pending"),
      })
      .from(commissionEvents)
      .where(
        session.role !== "super_admin"
          ? and(eq(commissionEvents.storeId, session.storeId), eq(commissionEvents.status, "pending"))
          : eq(commissionEvents.status, "pending")
      );

    const [cleared] = await db
      .select({
        totalCleared: sum(commissionEvents.commissionBdt).as("total_cleared"),
      })
      .from(commissionEvents)
      .where(
        session.role !== "super_admin"
          ? and(eq(commissionEvents.storeId, session.storeId), eq(commissionEvents.status, "cleared"))
          : eq(commissionEvents.status, "cleared")
      );

    return NextResponse.json({
      events,
      summary: {
        totalPending: parseFloat(totals?.totalPending ?? "0"),
        totalCleared: parseFloat(cleared?.totalCleared ?? "0"),
      },
    });
  } catch (err) {
    console.error("[GET /api/commissions]", err);
    return NextResponse.json({ error: "Failed to fetch commissions" }, { status: 500 });
  }
}

// ─── PATCH: mark commission(s) as cleared (super-admin only) ─────────────────

export async function PATCH(request: Request) {
  const session = getSessionFromRequest(request);
  if (!session || session.role !== "super_admin") {
    return NextResponse.json({ error: "Super-admin access required" }, { status: 403 });
  }

  try {
    const { ids, clearAll, storeId } = await request.json() as {
      ids?: string[];
      clearAll?: boolean;
      storeId?: string;
    };

    const now = new Date();

    if (clearAll) {
      // Clear all pending for a specific store or all stores
      const filter = storeId
        ? and(eq(commissionEvents.storeId, storeId), eq(commissionEvents.status, "pending"))
        : eq(commissionEvents.status, "pending");

      await db
        .update(commissionEvents)
        .set({ status: "cleared", clearedAt: now })
        .where(filter!);

      return NextResponse.json({ ok: true, cleared: "all" });
    }

    if (ids && ids.length > 0) {
      for (const id of ids) {
        await db
          .update(commissionEvents)
          .set({ status: "cleared", clearedAt: now })
          .where(eq(commissionEvents.id, id));
      }
      return NextResponse.json({ ok: true, cleared: ids.length });
    }

    return NextResponse.json({ error: "Provide ids or clearAll:true" }, { status: 400 });
  } catch (err) {
    console.error("[PATCH /api/commissions]", err);
    return NextResponse.json({ error: "Failed to clear commissions" }, { status: 500 });
  }
}

