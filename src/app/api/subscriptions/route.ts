import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { subscriptions, stores, invoices, auditLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSessionFromRequest, canAccessStore } from "@/lib/api-auth";
import { signSessionToken } from "@/lib/auth";
import { PLAN_LIMITS, PLAN_PRICES, isValidPlan, type PlanId } from "@/lib/plan-limits";
import { devStore } from "@/lib/dev-store";

export async function GET(request: Request) {
  const session = getSessionFromRequest(request);
  const url = new URL(request.url);
  const storeSlug = url.searchParams.get("storeSlug") || session?.storeId || "apex-fashion";

  const ds = devStore.getStore(storeSlug) || devStore.ensureStore(storeSlug);
  let plan = (ds.plan || "free") as PlanId;

  if (session?.storeId) {
    try {
      const sub = await db.query.subscriptions.findFirst({
        where: eq(subscriptions.storeId, session.storeId),
      });
      if (sub?.plan && isValidPlan(sub.plan)) {
        plan = sub.plan as PlanId;
      }
    } catch {
      // Non-fatal
    }
  }

  const config = PLAN_LIMITS[plan] || PLAN_LIMITS.free;

  return NextResponse.json({
    ok: true,
    plan,
    status: "active",
    priceBdt: PLAN_PRICES[plan] || 0,
    features: {
      maxProducts: config.maxProducts,
      commissionRate: config.commissionRate,
      customDomain: config.customDomain,
      dropshipping: config.dropshipping,
      advancedAnalytics: config.advancedAnalytics,
      apiAccess: config.apiAccess,
      maxStaff: config.maxStaff,
    },
  });
}

const UpgradeSchema = z.object({
  plan: z.enum(["medium", "pro"]),
  paymentMethod: z.enum(["bkash", "nagad", "card"]).optional().default("bkash"),
  transactionId: z.string().optional(),
  trxId: z.string().optional(),
  bkashNumber: z.string().optional(),
  storeSlug: z.string().optional(),
});

export async function POST(request: Request) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized: Please log in to manage subscriptions." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parse = UpgradeSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json(
        { error: parse.error.errors[0]?.message || "Invalid upgrade request" },
        { status: 400 }
      );
    }

    const { plan, paymentMethod, transactionId, trxId, bkashNumber, storeSlug } = parse.data;
    const finalTrxId = transactionId || trxId || `TRX-${Date.now().toString(36).toUpperCase()}`;
    const priceBdt = PLAN_PRICES[plan];

    const requestedSlug = storeSlug || session.slug || session.storeId || "apex-fashion";

    if (!canAccessStore(session, requestedSlug)) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to upgrade another merchant's subscription." },
        { status: 403 }
      );
    }

    const targetSlug = session.role !== "super_admin" ? (session.slug || session.storeId || requestedSlug) : requestedSlug;

    // 1. Upgrade in devStore immediately
    devStore.upgradeStore(targetSlug, plan, finalTrxId);

    const now = new Date();
    const renewsAt = new Date(now);
    renewsAt.setDate(renewsAt.getDate() + 30);

    // 2. Try DB update if session and DB available
    if (session?.storeId) {
      try {
        await db
          .insert(subscriptions)
          .values({
            storeId: session.storeId,
            plan,
            status: "active",
            billingCycle: "monthly",
            priceBdt,
            paymentMethod,
            bkashNumber: bkashNumber ?? null,
            startedAt: now,
            renewsAt,
          })
          .onConflictDoUpdate({
            target: subscriptions.storeId,
            set: {
              plan,
              status: "active",
              priceBdt,
              paymentMethod,
              bkashNumber: bkashNumber ?? null,
              renewsAt,
              cancelledAt: null,
              updatedAt: now,
            },
          });

        await db
          .update(stores)
          .set({ plan, updatedAt: now })
          .where(eq(stores.id, session.storeId));
      } catch (dbErr) {
        console.warn("[Subscriptions POST DB Warning — devStore updated]", dbErr);
      }
    }

    const res = NextResponse.json({
      ok: true,
      plan,
      status: "active",
      renewsAt: renewsAt.toISOString(),
      priceBdt,
      message: `Successfully upgraded to ${PLAN_LIMITS[plan].name} plan!`,
    });

    // 3. Re-issue session cookie with updated plan
    if (session) {
      const updatedToken = signSessionToken({
        ...session,
        plan,
      });

      res.cookies.set("ss_session", updatedToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return res;
  } catch (err) {
    console.error("[POST /api/subscriptions Error]", err);
    return NextResponse.json({ error: "Failed to upgrade plan" }, { status: 500 });
  }
}
