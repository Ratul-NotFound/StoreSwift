import { NextResponse } from "next/server";
import { z } from "zod";
import { db, customDomains, stores } from "@/db";
import { eq, and } from "drizzle-orm";
import { getSessionFromRequest } from "@/lib/api-auth";
import { assertFeature, isValidPlan, type PlanId } from "@/lib/plan-limits";

const domainSchema = z.object({
  domain: z.string().min(4).regex(/^[a-z0-9][a-z0-9\-\.]+\.[a-z]{2,}$/, "Invalid domain format")
});

/**
 * GET  /api/domains        — get current custom domain for this store
 * POST /api/domains        — add/update custom domain (Medium/Pro only)
 * DELETE /api/domains      — remove custom domain
 */
export async function GET(request: Request) {
  const session = getSessionFromRequest(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const record = await db.query.customDomains.findFirst({
      where: eq(customDomains.storeId, session.storeId)
    });
    return NextResponse.json({ ok: true, domain: record ?? null });
  } catch {
    return NextResponse.json({ ok: true, domain: null, _mock: true });
  }
}

export async function POST(request: Request) {
  const session = getSessionFromRequest(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Plan gate: custom domain requires Medium or Pro
  const plan = isValidPlan(session.plan ?? "") ? (session.plan as PlanId) : "free";
  try {
    assertFeature(plan, "customDomain");
  } catch {
    return NextResponse.json(
      { error: "Custom domains require Medium (৳499/mo) or Pro (৳999/mo) plan.", upgrade: true },
      { status: 403 }
    );
  }

  const body = await request.json();
  const parse = domainSchema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json({ error: parse.error.errors[0]?.message }, { status: 400 });
  }

  const cnameTarget = "cname.storeswift.app";
  const verificationToken = `ss-verify-${session.storeId.slice(0, 8)}`;

  try {
    // Upsert custom domain record
    const existing = await db.query.customDomains.findFirst({
      where: eq(customDomains.storeId, session.storeId)
    });

    if (existing) {
      await db
        .update(customDomains)
        .set({ domain: parse.data.domain, verified: false, sslActive: false, lastCheckedAt: new Date() })
        .where(eq(customDomains.storeId, session.storeId));
    } else {
      await db.insert(customDomains).values({
        storeId: session.storeId,
        domain: parse.data.domain,
        verified: false,
        sslActive: false,
        lastCheckedAt: new Date()
      });
    }

    return NextResponse.json({
      ok: true,
      domain: parse.data.domain,
      cnameTarget,
      verificationToken,
      instructions: [
        `1. Go to your domain registrar (e.g., GoDaddy, Namecheap)`,
        `2. Add a CNAME record: ${parse.data.domain} → ${cnameTarget}`,
        `3. Add a TXT record: _storeswift-verify.${parse.data.domain} → ${verificationToken}`,
        `4. DNS propagation takes 1-48 hours`,
        `5. Click "Verify" in your dashboard to check status`
      ]
    });
  } catch {
    return NextResponse.json({
      ok: true,
      domain: parse.data.domain,
      cnameTarget,
      verificationToken,
      _mock: true,
      instructions: [
        `1. Go to your domain registrar (e.g., GoDaddy, Namecheap)`,
        `2. Add a CNAME record: ${parse.data.domain} → ${cnameTarget}`,
        `3. Add a TXT record: _storeswift-verify.${parse.data.domain} → ${verificationToken}`,
        `4. DNS propagation takes 1-48 hours`,
        `5. Click "Verify" in your dashboard to check status`
      ]
    });
  }
}

export async function DELETE(request: Request) {
  const session = getSessionFromRequest(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await db.delete(customDomains).where(eq(customDomains.storeId, session.storeId));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true, _mock: true });
  }
}
