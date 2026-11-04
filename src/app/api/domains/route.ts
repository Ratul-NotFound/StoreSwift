import { NextResponse } from "next/server";
import { z } from "zod";
import { db, customDomains, stores } from "@/db";
import { eq } from "drizzle-orm";
import { getSessionFromRequest, canAccessStore } from "@/lib/api-auth";
import { devStore } from "@/lib/dev-store";

const domainSchema = z.object({
  domain: z.string().min(4).regex(/^[a-z0-9][a-z0-9\-\.]+\.[a-z]{2,}$/, "Invalid domain format"),
  storeSlug: z.string().optional(),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const storeSlug = url.searchParams.get("storeSlug");
  const session = getSessionFromRequest(request);

  const targetSlug = storeSlug || session?.storeId || "apex-fashion";
  const store = devStore.getStore(targetSlug);

  if (store?.domain) {
    return NextResponse.json({ ok: true, domain: store.domain });
  }

  return NextResponse.json({ ok: true, domain: null });
}

export async function POST(request: Request) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized: Session required." }, { status: 401 });
  }

  const body = await request.json();
  const parse = domainSchema.safeParse(body);

  if (!parse.success) {
    return NextResponse.json({ error: parse.error.errors[0]?.message }, { status: 400 });
  }

  const requestedSlug = parse.data.storeSlug || session.slug || session.storeId || "apex-fashion";

  if (!canAccessStore(session, requestedSlug)) {
    return NextResponse.json(
      { error: "Forbidden: You do not have permission to manage domains for this store." },
      { status: 403 }
    );
  }

  const targetSlug = session.role !== "super_admin" ? (session.slug || session.storeId || requestedSlug) : requestedSlug;
  const store = devStore.ensureStore(targetSlug);

  // Plan Gate: Custom domain requires Medium or Pro
  if (store.plan === "free") {
    return NextResponse.json(
      { error: "Custom domains require Medium (৳499/mo) or Pro (৳999/mo) plan.", upgrade: true },
      { status: 403 }
    );
  }

  const cnameTarget = "cname.storeswift.app";
  const domainData = {
    domain: parse.data.domain,
    cnameTarget,
    verified: true, // auto-verify in development
    sslActive: true,
  };

  devStore.updateStore(targetSlug, { domain: domainData });

  try {
    if (session?.storeId) {
      await db
        .insert(customDomains)
        .values({
          storeId: session.storeId,
          domain: parse.data.domain,
          verified: true,
          sslActive: true,
          lastCheckedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: customDomains.storeId,
          set: {
            domain: parse.data.domain,
            verified: true,
            sslActive: true,
            lastCheckedAt: new Date(),
          },
        });
    }
  } catch {
    // Non-fatal
  }

  return NextResponse.json({
    ok: true,
    domain: parse.data.domain,
    cnameTarget,
    isVerified: true,
    sslActive: true,
  });
}

export async function DELETE(request: Request) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized: Session required." }, { status: 401 });
  }

  const url = new URL(request.url);
  const storeSlug = url.searchParams.get("storeSlug") || session.slug || session.storeId || "apex-fashion";

  if (!canAccessStore(session, storeSlug)) {
    return NextResponse.json(
      { error: "Forbidden: You do not have permission to manage domains for this store." },
      { status: 403 }
    );
  }

  devStore.updateStore(storeSlug, { domain: undefined });
  return NextResponse.json({ ok: true });
}
