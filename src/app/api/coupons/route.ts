import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionFromRequest, canAccessStore } from "@/lib/api-auth";
import { assertFeature, isValidPlan, type PlanId } from "@/lib/plan-limits";
import { devStore } from "@/lib/dev-store";

const couponCreateSchema = z.object({
  code: z.string().min(3).max(30),
  type: z.enum(["flat", "percent", "fixed"]).optional().default("percent"),
  discountType: z.enum(["flat", "percent", "fixed"]).optional(),
  value: z.number().or(z.string()).optional(),
  discountValue: z.number().or(z.string()).optional(),
  minOrder: z.number().or(z.string()).optional(),
  minOrderAmount: z.number().or(z.string()).optional(),
  maxUses: z.number().or(z.string()).optional(),
  expiresAt: z.string().optional().or(z.literal("")),
  storeSlug: z.string().optional(),
  isActive: z.boolean().optional().default(true),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const storeSlug = url.searchParams.get("storeSlug");
  const session = getSessionFromRequest(request);

  const targetSlug = storeSlug || session?.storeId || "apex-fashion";
  const list = devStore.getCoupons(targetSlug);
  return NextResponse.json({ ok: true, coupons: list });
}

export async function POST(request: Request) {
  const session = getSessionFromRequest(request);
  const body = await request.json();
  const parse = couponCreateSchema.safeParse(body);

  if (!parse.success) {
    return NextResponse.json({ error: parse.error.errors[0]?.message || "Invalid coupon data" }, { status: 400 });
  }

  const data = parse.data;
  const requestedSlug = data.storeSlug || session?.slug || session?.storeId || "apex-fashion";

  if (session && !canAccessStore(session, requestedSlug)) {
    return NextResponse.json(
      { error: "Forbidden: You do not have permission to manage coupons for this store." },
      { status: 403 }
    );
  }

  const storeSlug = (session && session.role !== "super_admin") ? (session.slug || session.storeId || requestedSlug) : requestedSlug;
  const store = devStore.ensureStore(storeSlug);

  // Plan Gate
  const plan = store.plan;
  if (plan === "free") {
    return NextResponse.json(
      { error: "Discount coupons require Medium (৳499/mo) or Pro (৳999/mo) plan.", upgrade: true },
      { status: 403 }
    );
  }

  const rawVal = data.value ?? data.discountValue ?? 10;
  const numVal = typeof rawVal === "string" ? parseFloat(rawVal) : rawVal;
  const rawMin = data.minOrder ?? data.minOrderAmount;
  const numMin = rawMin ? (typeof rawMin === "string" ? parseFloat(rawMin) : rawMin) : undefined;
  const rawMax = data.maxUses;
  const numMax = rawMax ? (typeof rawMax === "string" ? parseInt(rawMax, 10) : rawMax) : undefined;

  const finalType = (data.type === "fixed" ? "flat" : data.type) as "flat" | "percent";

  const coupon = devStore.addCoupon({
    storeId: store.id,
    storeSlug: store.slug,
    code: data.code,
    type: finalType,
    value: numVal,
    minOrder: numMin,
    maxUses: numMax,
    expiresAt: data.expiresAt || undefined,
    isActive: true,
  });

  return NextResponse.json({ ok: true, coupon }, { status: 201 });
}

export async function PATCH(request: Request) {
  const body = await request.json();

  // Mode 1: Validate coupon at checkout
  if (body.validate || body.code) {
    const storeSlug = body.storeSlug || body.storeId || "apex-fashion";
    const code = String(body.code || "");
    const orderAmount = parseFloat(String(body.orderAmount || 0));

    const result = devStore.validateCoupon(storeSlug, code, orderAmount);
    return NextResponse.json(result);
  }

  // Mode 2: Toggle coupon active/inactive
  if (body.id && typeof body.isActive === "boolean") {
    devStore.toggleCoupon(body.id, body.isActive);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  devStore.deleteCoupon(id);
  return NextResponse.json({ ok: true });
}
