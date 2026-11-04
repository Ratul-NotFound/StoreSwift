import { NextResponse } from "next/server";
import { db, stores } from "@/db";
import { eq } from "drizzle-orm";
import { devStore } from "@/lib/dev-store";

export async function GET(
  _request: Request,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await props.params;
    if (!slug) {
      return NextResponse.json({ error: "Store slug is required" }, { status: 400 });
    }

    const cleanSlug = slug.toLowerCase().trim();

    try {
      const store = (
        await db.select().from(stores).where(eq(stores.slug, cleanSlug)).limit(1)
      )[0];

      if (store) {
        const storeData = {
          id: store.id,
          name: store.name,
          slug: store.slug,
          category: store.category,
          currency: store.currency || "BDT",
          plan: store.plan || "free",
          storeStatus: store.storeStatus || "active",
          primaryColor: store.primaryColor || "#0f172a",
          themeConfig: store.themeConfig || {},
          paymentConfig: store.paymentConfig || { enable_cod: true, enable_bkash: true, enable_nagad: true },
          subscriptionStatus: store.subscriptionStatus || "active"
        };

        return NextResponse.json({
          ok: true,
          store: storeData,
          ...storeData
        });
      }
    } catch {
      // DB unreachable — fall through to devStore
    }

    // DevStore in-memory lookup or fallback
    const ds = devStore.getStore(cleanSlug) || devStore.ensureStore(cleanSlug);
    const storeData = {
      id: ds.id,
      name: ds.name,
      slug: ds.slug,
      category: ds.category,
      currency: ds.currency || "BDT",
      plan: ds.plan || "free",
      storeStatus: ds.storeStatus || "active",
      primaryColor: "#0f172a",
      themeConfig: {},
      paymentConfig: { enable_cod: true, enable_bkash: true, enable_nagad: true },
      subscriptionStatus: "active"
    };

    return NextResponse.json({
      ok: true,
      store: storeData,
      ...storeData
    });
  } catch (err) {
    console.error("[Store API Error]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
