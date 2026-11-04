import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import {
  subscriptions, stores, invoices, auditLogs
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSessionFromRequest } from "@/lib/api-auth";
import { PLAN_LIMITS, PLAN_PRICES, isValidPlan, type PlanId } from "@/lib/plan-limits";

// ─── GET: current subscription ───────────────────────────────────────────────

export async function GET(request: Request) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sub = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.storeId, session.storeId),
    });

    const plan = (sub?.plan ?? "free") as PlanId;
    const config = PLAN_LIMITS[plan];

    return NextResponse.json({
      plan,
      status:        sub?.status ?? "active",
      priceBdt:      sub?.priceBdt ?? 0,
      renewsAt:      sub?.renewsAt ?? null,
      cancelledAt:   sub?.cancelledAt ?? null,
      paymentMethod: sub?.paymentMethod ?? null,
      features: {
        maxProducts:       config.maxProducts,
        commissionRate:    config.commissionRate,
        customDomain:      config.customDomain,
        dropshipping:      config.dropshipping,
        advancedAnalytics: config.advancedAnalytics,
        apiAccess:         config.apiAccess,
        maxStaff:          config.maxStaff,
      },
    });
  } catch (err) {
    console.error("[GET /api/subscriptions]", err);
    // Graceful fallback — return free plan if DB unreachable
    return NextResponse.json({
      plan: "free",
      status: "active",
      priceBdt: 0,
      renewsAt: null,
      features: PLAN_LIMITS.free,
    });
  }
}

// ─── POST: upgrade plan ───────────────────────────────────────────────────────

const UpgradeSchema = z.object({
  plan:          z.enum(["medium", "pro"]),
  paymentMethod: z.enum(["bkash", "nagad", "card"]),
  transactionId: z.string().min(6).max(100),
  bkashNumber:   z.string().regex(/^01[0-9]{9}$/).optional(),
});

export async function POST(request: Request) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parse = UpgradeSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json(
        { error: parse.error.errors[0]?.message || "Invalid request" },
        { status: 400 }
      );
    }

    const { plan, paymentMethod, transactionId, bkashNumber } = parse.data;
    const priceBdt = PLAN_PRICES[plan];

    const now = new Date();
    const renewsAt = new Date(now);
    renewsAt.setDate(renewsAt.getDate() + 30);

    const periodStart = now.toISOString().slice(0, 10);
    const periodEnd   = renewsAt.toISOString().slice(0, 10);

    // Upsert subscription
    await db
      .insert(subscriptions)
      .values({
        storeId:       session.storeId,
        plan,
        status:        "active",
        billingCycle:  "monthly",
        priceBdt,
        paymentMethod,
        bkashNumber:   bkashNumber ?? null,
        startedAt:     now,
        renewsAt,
      })
      .onConflictDoUpdate({
        target: subscriptions.storeId,
        set: {
          plan,
          status:        "active",
          priceBdt,
          paymentMethod,
          bkashNumber:   bkashNumber ?? null,
          renewsAt,
          cancelledAt:   null,
          updatedAt:     now,
        },
      });

    // Update store plan column
    await db
      .update(stores)
      .set({ plan, updatedAt: now })
      .where(eq(stores.id, session.storeId));

    // Record invoice
    await db.insert(invoices).values({
      storeId:       session.storeId,
      plan,
      amountBdt:     priceBdt,
      status:        "paid",
      paymentMethod,
      transactionId,
      periodStart,
      periodEnd,
      issuedAt:      now,
    });

    // Audit log
    await db.insert(auditLogs).values({
      actorId:    session.userId,
      actorRole:  session.role,
      action:     "subscription.upgrade",
      targetId:   session.storeId,
      targetType: "store",
      metadata:   { plan, priceBdt, paymentMethod, transactionId },
    });

    return NextResponse.json({
      ok:      true,
      plan,
      status:  "active",
      renewsAt: renewsAt.toISOString(),
      priceBdt,
      invoice: { periodStart, periodEnd, transactionId },
    });
  } catch (err) {
    console.error("[POST /api/subscriptions]", err);
    return NextResponse.json({ error: "Failed to upgrade plan" }, { status: 500 });
  }
}

// ─── DELETE: cancel subscription ──────────────────────────────────────────────

export async function DELETE(request: Request) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    await db
      .update(subscriptions)
      .set({ status: "cancelled", cancelledAt: now, updatedAt: now })
      .where(eq(subscriptions.storeId, session.storeId));

    await db.insert(auditLogs).values({
      actorId:    session.userId,
      actorRole:  session.role,
      action:     "subscription.cancel",
      targetId:   session.storeId,
      targetType: "store",
      metadata:   {},
    });

    return NextResponse.json({ ok: true, message: "Subscription cancelled. Access continues until period end." });
  } catch (err) {
    console.error("[DELETE /api/subscriptions]", err);
    return NextResponse.json({ error: "Failed to cancel" }, { status: 500 });
  }
}

