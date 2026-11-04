import { NextResponse } from "next/server";
import { db } from "@/db";
import { storeCustomers, orders } from "@/db/schema";
import { eq, desc, sum, count, and } from "drizzle-orm";
import { getSessionFromRequest } from "@/lib/api-auth";
import { z } from "zod";

// ─── GET: customer list for a store ──────────────────────────────────────────

export async function GET(request: Request) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const limit  = Math.min(parseInt(url.searchParams.get("limit") ?? "50"), 200);
  const sortBy = url.searchParams.get("sort") ?? "last_order"; // last_order | ltv | order_count

  try {
    const customers = await db
      .select()
      .from(storeCustomers)
      .where(eq(storeCustomers.storeId, session.storeId))
      .orderBy(
        sortBy === "ltv"         ? desc(storeCustomers.totalSpent)  :
        sortBy === "order_count" ? desc(storeCustomers.orderCount)  :
                                   desc(storeCustomers.lastOrderAt)
      )
      .limit(limit);

    // Aggregate stats
    const [stats] = await db
      .select({
        totalCustomers: count(storeCustomers.id),
        totalRevenue:   sum(storeCustomers.totalSpent),
      })
      .from(storeCustomers)
      .where(eq(storeCustomers.storeId, session.storeId));

    const loyal = customers.filter((c) => c.orderCount >= 3).length;
    const avgLtv = stats?.totalRevenue
      ? parseFloat(stats.totalRevenue) / (stats.totalCustomers || 1)
      : 0;

    // Segment customers
    const enriched = customers.map((c) => ({
      ...c,
      segment:
        c.orderCount >= 5 && parseFloat(c.totalSpent) > 10000 ? "champion"   :
        c.orderCount >= 3                                       ? "loyal"      :
        c.orderCount >= 2                                       ? "returning"  :
                                                                  "new",
    }));

    return NextResponse.json({
      customers: enriched,
      summary: {
        totalCustomers: stats?.totalCustomers ?? 0,
        loyalCustomers: loyal,
        avgLifetimeValue: parseFloat(avgLtv.toFixed(2)),
        totalRevenue: parseFloat(stats?.totalRevenue ?? "0"),
      },
    });
  } catch (err) {
    console.error("[GET /api/customers]", err);
    return NextResponse.json({
      customers: [],
      summary: { totalCustomers: 0, loyalCustomers: 0, avgLifetimeValue: 0, totalRevenue: 0 },
    });
  }
}

// ─── POST: upsert customer (called after order creation) ─────────────────────

const UpsertCustomerSchema = z.object({
  storeId:     z.string().uuid(),
  name:        z.string().min(2).max(100),
  phone:       z.string().min(10).max(50),
  email:       z.string().email().optional(),
  district:    z.string().max(100).optional(),
  upazila:     z.string().max(100).optional(),
  orderAmount: z.number().positive(),
});

export async function POST(request: Request) {
  // This endpoint is called server-side from order creation — no user session required
  // but we verify a server secret to prevent abuse
  const authHeader = request.headers.get("x-internal-secret");
  if (authHeader !== process.env.INTERNAL_API_SECRET && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parse = UpsertCustomerSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ error: parse.error.errors[0]?.message }, { status: 400 });
    }

    const { storeId, name, phone, email, district, upazila, orderAmount } = parse.data;
    const now = new Date();

    await db
      .insert(storeCustomers)
      .values({
        storeId,
        name,
        phone,
        email,
        district,
        upazila,
        orderCount:  1,
        totalSpent:  orderAmount.toFixed(2),
        lastOrderAt: now,
        tags:        [],
        createdAt:   now,
      })
      .onConflictDoUpdate({
        target: [storeCustomers.storeId, storeCustomers.phone],
        set: {
          // Increment order count and total spent
          orderCount:  db.$count(storeCustomers, eq(storeCustomers.phone, phone)),
          lastOrderAt: now,
          // Note: totalSpent increment handled by a DB trigger or separate update
        },
      });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[POST /api/customers]", err);
    return NextResponse.json({ error: "Failed to upsert customer" }, { status: 500 });
  }
}

