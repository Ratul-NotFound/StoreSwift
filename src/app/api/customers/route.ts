import { NextResponse } from "next/server";
import { db } from "@/db";
import { storeCustomers, stores } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getSessionFromRequest } from "@/lib/api-auth";
import { devStore } from "@/lib/dev-store";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const storeSlug = url.searchParams.get("storeSlug");
  const session = getSessionFromRequest(request);

  const targetSlug = storeSlug || session?.storeId || "apex-fashion";

  try {
    let storeId: string | undefined;
    if (storeSlug) {
      const s = await db.query.stores.findFirst({
        where: eq(stores.slug, storeSlug),
        columns: { id: true },
      });
      if (s) storeId = s.id;
    } else if (session?.storeId) {
      storeId = session.storeId;
    }

    if (storeId) {
      const customers = await db
        .select()
        .from(storeCustomers)
        .where(eq(storeCustomers.storeId, storeId))
        .orderBy(desc(storeCustomers.totalSpent));

      if (customers.length > 0) {
        const mapped = customers.map((c) => ({
          id: c.id,
          name: c.name,
          phone: c.phone,
          email: c.email || undefined,
          district: c.district || "Dhaka",
          totalOrders: c.orderCount,
          totalSpent: parseFloat(c.totalSpent),
          lastOrderAt: c.lastOrderAt ? new Date(c.lastOrderAt).toISOString() : undefined,
          isLoyal: c.orderCount >= 3,
        }));
        return NextResponse.json({ ok: true, customers: mapped });
      }
    }
  } catch {
    // Fall through to devStore
  }

  const dsCustomers = devStore.getCustomers(targetSlug);
  return NextResponse.json({ ok: true, customers: dsCustomers });
}
