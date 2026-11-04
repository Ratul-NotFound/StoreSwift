import { NextResponse } from "next/server";
import { z } from "zod";
import { db, stores, customDomains } from "@/db";
import { eq } from "drizzle-orm";
import { getSessionFromRequest, canAccessStore } from "@/lib/api-auth";
import { devStore } from "@/lib/dev-store";
import { fastCache } from "@/lib/cache";

const settingsSchema = z.object({
  name:              z.string().min(2).max(100).optional(),
  description:       z.string().max(1000).optional(),
  phone:             z.string().max(50).optional(),
  email:             z.string().email().optional().or(z.literal("")),
  address:           z.string().max(500).optional(),
  template:          z.string().optional(),
  facebookPixel:     z.string().max(100).optional(),
  googleAnalytics:   z.string().max(100).optional(),
  announcementText:  z.string().max(500).optional(),
  metaTitle:         z.string().max(255).optional(),
  metaDescription:   z.string().max(500).optional(),
  primaryColor:      z.string().optional(),
  themeConfig:       z.record(z.any()).optional(),
  paymentConfig:     z.any().optional(),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const cacheKey = `settings:${slug}`;
  const clientEtag = request.headers.get("if-none-match");

  // Sub-millisecond cache check
  const cached = fastCache.getWithETag<any>(cacheKey);
  if (cached) {
    if (clientEtag && clientEtag === cached.etag) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          ETag: cached.etag,
          "Cache-Control": "public, s-maxage=20, stale-while-revalidate=59",
          "X-Cache": "HIT",
        },
      });
    }
    return NextResponse.json(cached.value, {
      headers: {
        ETag: cached.etag,
        "Cache-Control": "public, s-maxage=20, stale-while-revalidate=59",
        "X-Cache": "HIT",
      },
    });
  }

  const ds = devStore.getStore(slug) || devStore.ensureStore(slug);

  try {
    const store = await db.query.stores.findFirst({
      where: eq(stores.slug, slug),
    });

    const domainRecord = await db.query.customDomains.findFirst({
      where: eq(customDomains.storeId, store?.id || ds.id)
    });

    if (store) {
      const mergedSettings = {
        name: store.name,
        description: store.metaDescription || "",
        phone: ds.phone,
        email: ds.email,
        address: ds.address,
        template: (store.themeConfig as any)?.template || ds.template || "minimal",
        facebookPixel: ds.facebookPixel || "",
        googleAnalytics: ds.googleAnalytics || "",
        announcementText: store.announcementText || "",
        metaTitle: store.metaTitle || "",
        metaDescription: store.metaDescription || "",
        primaryColor: store.primaryColor,
        themeConfig: store.themeConfig,
        paymentConfig: store.paymentConfig,
      };

      return NextResponse.json({
        ok: true,
        store,
        settings: mergedSettings,
        domain: domainRecord ? {
          domain: domainRecord.domain,
          cnameTarget: "cname.storeswift.app",
          isVerified: domainRecord.verified,
        } : (ds.domain ? { ...ds.domain, isVerified: ds.domain.verified } : null),
      });
    }
  } catch {
    // DB unreachable
  }

  const mergedSettings = {
    name: ds.name,
    description: "Welcome to " + ds.name,
    phone: ds.phone,
    email: ds.email,
    address: ds.address,
    template: ds.template || "minimal",
    facebookPixel: ds.facebookPixel || "",
    googleAnalytics: ds.googleAnalytics || "",
    announcementText: "",
    metaTitle: ds.name,
    metaDescription: "",
    primaryColor: "#0f172a",
    themeConfig: {},
    paymentConfig: { enable_cod: true, enable_bkash: true, enable_nagad: true },
  };

  const responseData = {
    ok: true,
    store: ds,
    settings: mergedSettings,
    domain: ds.domain ? { ...ds.domain, isVerified: ds.domain.verified } : null,
  };
  fastCache.set(cacheKey, responseData, 20000);
  const entry = fastCache.getWithETag(cacheKey);

  return NextResponse.json(responseData, {
    headers: {
      ETag: entry?.etag || "W/default",
      "Cache-Control": "public, s-maxage=20, stale-while-revalidate=59",
      "X-Cache": "MISS",
    },
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  fastCache.deletePrefix(`settings:${slug}`);
  const session = getSessionFromRequest(request);

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized: Session required to modify store settings." },
      { status: 401 }
    );
  }

  if (!canAccessStore(session, slug)) {
    return NextResponse.json(
      { error: "Forbidden: You do not have permission to modify settings for this store." },
      { status: 403 }
    );
  }

  const body = await request.json();
  const parse = settingsSchema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json({ error: parse.error.errors[0]?.message }, { status: 400 });
  }

  const ds = devStore.getStore(slug) || devStore.ensureStore(slug);
  devStore.updateStore(slug, parse.data);

  try {
    await db
      .update(stores)
      .set({
        name: parse.data.name || undefined,
        announcementText: parse.data.announcementText || undefined,
        metaTitle: parse.data.metaTitle || undefined,
        metaDescription: parse.data.metaDescription || parse.data.description || undefined,
        primaryColor: parse.data.primaryColor || undefined,
        themeConfig: parse.data.template ? { template: parse.data.template } : (parse.data.themeConfig || undefined),
        updatedAt: new Date()
      })
      .where(eq(stores.slug, slug));
  } catch {
    // Non-fatal DB update
  }

  return NextResponse.json({ ok: true, settings: parse.data, store: ds });
}
