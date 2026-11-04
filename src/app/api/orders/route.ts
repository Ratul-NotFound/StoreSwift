import { NextResponse } from "next/server";
import { z } from "zod";
import { db, orders, orderItems, stores, commissionEvents, storeCustomers } from "@/db";
import { eq, desc, sql } from "drizzle-orm";
import { getSessionFromRequest } from "@/lib/api-auth";
import { generateConsignment } from "@/lib/courier";
import { fireServerSidePixelEvent } from "@/lib/pixels";
import { calculateCommission, PLAN_LIMITS, isValidPlan, type PlanId } from "@/lib/plan-limits";
import { devStore } from "@/lib/dev-store";

const orderCreateSchema = z.object({
  storeSlug: z.string().optional(),
  storeId: z.string().optional(),
  customerName: z.string().min(2, "Customer name is required"),
  customerPhone: z.string().min(5, "Valid phone number is required"),
  customerEmail: z.string().email().optional().or(z.literal("")),
  shippingAddress: z.object({
    address: z.string(),
    district: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),
    zone: z.string().optional(),
  }).or(z.string()),
  items: z.array(
    z.object({
      variantId: z.string().optional(),
      title: z.string().optional(),
      price: z.number().or(z.string()),
      quantity: z.number().min(1),
      isDropship: z.boolean().optional(),
      platformProductId: z.string().optional(),
    })
  ).min(1, "At least one item is required"),
  paymentMethod: z.enum(["cod", "bkash", "nagad", "stripe", "manual"]).default("cod"),
  deliveryZone: z.enum(["metro", "suburbs", "national"]).optional().default("metro"),
  trxId: z.string().optional(),
  shippingFee: z.number().optional().default(0),
});

function isValidUuid(id?: string | null): boolean {
  if (!id) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const storeSlug = url.searchParams.get("storeSlug");
  const session = getSessionFromRequest(request);

  // Super admin scope: return all platform orders
  if (session?.role === "super_admin" && !storeSlug) {
    try {
      const list = await db
        .select()
        .from(orders)
        .orderBy(desc(orders.createdAt));

      if (list.length > 0) {
        return NextResponse.json({ ok: true, orders: list });
      }
    } catch {
      // Fall through to devStore
    }
    return NextResponse.json({ ok: true, orders: devStore.getOrders() });
  }

  // Merchant or Storefront scope
  const targetSlug = storeSlug || session?.storeId || "apex-fashion";

  try {
    let targetStoreId: string | undefined;
    if (storeSlug) {
      const s = await db.query.stores.findFirst({
        where: eq(stores.slug, storeSlug),
        columns: { id: true },
      });
      if (s) targetStoreId = s.id;
    } else if (session?.storeId) {
      targetStoreId = session.storeId;
    }

    if (targetStoreId) {
      const list = await db
        .select()
        .from(orders)
        .where(eq(orders.storeId, targetStoreId))
        .orderBy(desc(orders.createdAt));

      if (list.length > 0) {
        const mapped = list.map((o) => ({
          id: o.id,
          orderNumber: o.orderNumber,
          customerName: o.customerName,
          customerPhone: o.customerPhone,
          shippingAddress: typeof o.shippingAddress === "string" ? o.shippingAddress : (o.shippingAddress as any)?.address || "Dhaka",
          totalAmount: parseFloat(o.totalAmount),
          paymentMethod: o.paymentMethod,
          status: o.fulfillmentStatus === "unfulfilled" ? "pending" : o.fulfillmentStatus,
          items: 1,
          createdAt: o.createdAt ? new Date(o.createdAt).toISOString() : new Date().toISOString(),
        }));
        return NextResponse.json({ ok: true, orders: mapped });
      }
    }
  } catch {
    // Fall through to devStore
  }

  const dsOrders = devStore.getOrders(targetSlug);
  return NextResponse.json({ ok: true, orders: dsOrders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parse = orderCreateSchema.safeParse(body);

    if (!parse.success) {
      return NextResponse.json(
        { error: parse.error.errors[0]?.message || "Invalid order data" },
        { status: 400 }
      );
    }

    const data = parse.data;
    const storeSlug = data.storeSlug || "apex-fashion";

    const formattedAddress = typeof data.shippingAddress === "string"
      ? data.shippingAddress
      : data.shippingAddress.address;

    const district = typeof data.shippingAddress === "object"
      ? data.shippingAddress.district || data.shippingAddress.city || "Dhaka"
      : "Dhaka";

    const cleanItems = data.items.map((it) => ({
      variantId: it.variantId,
      title: it.title || "Product",
      price: typeof it.price === "string" ? parseFloat(it.price) : it.price,
      quantity: it.quantity,
      isDropship: it.isDropship,
      platformProductId: it.platformProductId,
    }));

    // 1. Save to devStore (instant, 100% synchronized)
    const newOrder = devStore.addOrder({
      storeSlug,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail || undefined,
      shippingAddress: formattedAddress,
      district,
      items: cleanItems,
      paymentMethod: data.paymentMethod,
      shippingFee: data.shippingFee ?? 0,
      trxId: data.trxId,
    });

    // 2. Try DB insert if PostgreSQL is available
    try {
      let dbStoreId: string | undefined;
      const foundStore = (
        await db.select().from(stores).where(eq(stores.slug, storeSlug)).limit(1)
      )[0];

      if (foundStore) {
        dbStoreId = foundStore.id;
      } else {
        const anyStore = (await db.select().from(stores).limit(1))[0];
        if (anyStore) dbStoreId = anyStore.id;
      }

      if (dbStoreId && isValidUuid(dbStoreId)) {
        const [insertedOrder] = await db
          .insert(orders)
          .values({
            storeId: dbStoreId,
            orderNumber: newOrder.orderNumber,
            customerName: data.customerName,
            customerPhone: data.customerPhone,
            customerEmail: data.customerEmail || null,
            shippingAddress: { address: formattedAddress, district },
            subtotal: newOrder.subtotal.toFixed(2),
            shippingFee: (data.shippingFee || 0).toFixed(2),
            totalAmount: newOrder.totalAmount.toFixed(2),
            paymentMethod: data.paymentMethod,
            paymentStatus: data.paymentMethod === "cod" ? "pending" : "paid",
            fulfillmentStatus: "unfulfilled",
          })
          .returning();

        if (insertedOrder) {
          for (const item of cleanItems) {
            await db.insert(orderItems).values({
              orderId: insertedOrder.id,
              variantId: isValidUuid(item.variantId) ? item.variantId : null,
              productTitle: item.title,
              variantTitle: "Standard",
              priceAtCheckout: item.price.toFixed(2),
              quantity: item.quantity,
              isDropship: Boolean(item.isDropship),
            });
          }

          // Commission
          const plan = (isValidPlan(foundStore?.plan ?? "") ? foundStore!.plan : "free") as PlanId;
          const commissionRate = PLAN_LIMITS[plan].commissionRate;
          const commBdt = calculateCommission(plan, newOrder.totalAmount);
          if (commissionRate > 0) {
            await db.insert(commissionEvents).values({
              storeId: dbStoreId,
              orderId: insertedOrder.id,
              orderAmount: newOrder.totalAmount.toFixed(2),
              commissionRate: String(commissionRate),
              commissionBdt: String(commBdt),
              status: "pending",
            });
          }

          // Customer upsert
          await db
            .insert(storeCustomers)
            .values({
              storeId: dbStoreId,
              phone: data.customerPhone,
              name: data.customerName,
              email: data.customerEmail || null,
              district,
              orderCount: 1,
              totalSpent: newOrder.totalAmount.toFixed(2),
              lastOrderAt: new Date(),
            })
            .onConflictDoUpdate({
              target: [storeCustomers.storeId, storeCustomers.phone],
              set: {
                name: data.customerName,
                email: data.customerEmail || null,
                district,
                orderCount: sql`${storeCustomers.orderCount} + 1`,
                totalSpent: sql`${storeCustomers.totalSpent} + ${newOrder.totalAmount.toFixed(2)}`,
                lastOrderAt: new Date(),
              },
            });
        }
      }
    } catch (dbErr) {
      console.warn("[Orders POST DB Error — preserved in devStore]", dbErr);
    }

    fireServerSidePixelEvent("Purchase", {
      orderNumber: newOrder.orderNumber,
      totalAmount: newOrder.totalAmount,
      currency: "BDT",
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
    });

    return NextResponse.json({
      ok: true,
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      totalAmount: newOrder.totalAmount.toFixed(2),
      consignmentId: newOrder.consignmentId,
      courierName: newOrder.courierName,
      trackingUrl: newOrder.trackingUrl,
      estimatedDelivery: "2-3 business days",
    });
  } catch (err) {
    console.error("[Orders POST Error]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
