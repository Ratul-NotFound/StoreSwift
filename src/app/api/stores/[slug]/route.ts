import { NextResponse } from "next/server";
import { db, stores } from "@/db";
import { eq } from "drizzle-orm";
import { getCategoryConfig } from "@/config/categories";

export async function GET(
  _request: Request,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await props.params;
    if (!slug) {
      return NextResponse.json({ error: "Store slug is required" }, { status: 400 });
    }

    try {
      const store = (
        await db.select().from(stores).where(eq(stores.slug, slug.toLowerCase().trim())).limit(1)
      )[0];

      if (!store) {
        return NextResponse.json({ error: "Store not found" }, { status: 404 });
      }

      return NextResponse.json({
        id: store.id,
        name: store.name,
        slug: store.slug,
        category: store.category,
        currency: store.currency,
        primaryColor: store.primaryColor,
        themeConfig: store.themeConfig,
        paymentConfig: store.paymentConfig,
        subscriptionStatus: store.subscriptionStatus
      });
    } catch {
      // Mock / fallback store data for local dev
      const categoryConfig = getCategoryConfig("fashion");
      return NextResponse.json({
        id: `mock-store-${slug}`,
        name: slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        slug,
        category: "fashion",
        currency: "USD",
        primaryColor: "#0f172a",
        themeConfig: {},
        paymentConfig: { enable_cod: true, enable_stripe: false, enable_manual: false },
        subscriptionStatus: "trial"
      });
    }
  } catch (err) {
    console.error("[Store API Error]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
