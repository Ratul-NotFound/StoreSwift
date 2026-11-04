import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionFromRequest } from "@/lib/api-auth";
import { assertFeature, isValidPlan, type PlanId } from "@/lib/plan-limits";

const couponSchema = z.object({
  code: z.string().min(3).max(20).toUpperCase(),
  discountType: z.enum(["percent", "fixed"]),
  discountValue: z.number().min(1),
  minOrderAmount: z.number().optional().default(0),
  maxUses: z.number().optional().default(100),
  expiresAt: z.string().optional(),
  isActive: z.boolean().optional().default(true)
});

// In-memory store for dev (replace with DB table in production)
const COUPON_STORE: Record<string, any[]> = {};

/**
 * GET /api/coupons  — list store coupons
 * POST /api/coupons — create coupon (Medium/Pro only)
 */
export async function GET(request: Request) {
  const session = getSessionFromRequest(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const coupons = COUPON_STORE[session.storeId] ?? [];
  return NextResponse.json({ ok: true, coupons });
}

export async function POST(request: Request) {
  const session = getSessionFromRequest(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Plan gate: coupons require Medium or Pro
  try {
    const plan = isValidPlan(session.plan ?? "") ? (session.plan as PlanId) : "free";
    assertFeature(plan, "customDomain"); // customDomain as proxy for paid plan
  } catch {
    return NextResponse.json(
      { error: "Coupons & discounts are available on Medium (৳499/mo) and Pro (৳999/mo) plans.", upgrade: true },
      { status: 403 }
    );
  }

  const body = await request.json();
  const parse = couponSchema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json({ error: parse.error.errors[0]?.message }, { status: 400 });
  }

  const coupon = {
    id: `cpn-${Date.now()}`,
    storeId: session.storeId,
    ...parse.data,
    usedCount: 0,
    createdAt: new Date()
  };

  if (!COUPON_STORE[session.storeId]) COUPON_STORE[session.storeId] = [];
  COUPON_STORE[session.storeId].push(coupon);

  return NextResponse.json({ ok: true, coupon }, { status: 201 });
}

export async function DELETE(request: Request) {
  const session = getSessionFromRequest(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  if (COUPON_STORE[session.storeId]) {
    COUPON_STORE[session.storeId] = COUPON_STORE[session.storeId].filter(c => c.id !== id);
  }

  return NextResponse.json({ ok: true });
}

/**
 * POST /api/coupons/validate (virtual path — handled by coupon validate route)
 * Validate a coupon code at checkout.
 */
export async function PATCH(request: Request) {
  const { code, storeId, orderAmount } = await request.json();
  const coupons = COUPON_STORE[storeId] ?? [];
  const coupon = coupons.find(c => c.code === code && c.isActive);

  if (!coupon) return NextResponse.json({ valid: false, error: "Invalid or expired coupon" });
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return NextResponse.json({ valid: false, error: "Coupon has expired" });
  }
  if (coupon.usedCount >= coupon.maxUses) {
    return NextResponse.json({ valid: false, error: "Coupon usage limit reached" });
  }
  if (orderAmount < coupon.minOrderAmount) {
    return NextResponse.json({
      valid: false,
      error: `Minimum order ৳${coupon.minOrderAmount} required for this coupon`
    });
  }

  const discount = coupon.discountType === "percent"
    ? (orderAmount * coupon.discountValue) / 100
    : coupon.discountValue;

  return NextResponse.json({
    valid: true,
    coupon: { code: coupon.code, discountType: coupon.discountType, discountValue: coupon.discountValue },
    discount: Math.min(discount, orderAmount),
    newTotal: Math.max(0, orderAmount - discount)
  });
}

