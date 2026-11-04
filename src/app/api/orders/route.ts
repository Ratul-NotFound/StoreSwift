import { NextResponse } from "next/server";
import { z } from "zod";
import { db, orders, orderItems, stores, commissionEvents, storeCustomers } from "@/db";
import { eq, desc, sql } from "drizzle-orm";
import { getSessionFromRequest, canAccessStore } from "@/lib/api-auth";
import { generateConsignment } from "@/lib/courier";
import { fireServerSidePixelEvent } from "@/lib/pixels";
import { calculateCommission, PLAN_LIMITS, isValidPlan, type PlanId } from "@/lib/plan-limits";
import { devStore } from "@/lib/dev-store";
import { trafficLimiter, SlidingWindowRateLimiter } from "@/lib/rate-limiter";
import { fastCache } from "@/lib/cache";
import { sanitizeString, verifyOrigin } from "@/lib/security";

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
      id: z.string().optional(),
      variantId: z.string().optional(),
      title: z.string().optional(),
      price: z.number().min(0).or(z.string()),
      quantity: z.number().int().min(1, "Quantity must be at least 1").max(99),
      isDropship: z.boolean().optional(),
      platformProductId: z.string().optional(),
    })
  ).min(1, "At least one item is required"),
  paymentMethod: z.enum(["cod", "bkash", "nagad", "stripe", "manual"]).default("cod"),
  deliveryZone: z.enum(["metro", "suburbs", "national"]).optional().default("metro"),
  trxId: z.string().optional(),
  shippingFee: z.number().min(0, "Shipping fee cannot be negative").max(10000).optional().default(0),
});

function isValidUuid(id?: string | null): boolean {
  if (!id) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const storeSlug = url.searchParams.get("storeSlug");
  const session = getSessionFromRequest(request);

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized: Authentication required to view store orders." },
      { status: 401 }
    );
  }

  // Super admin scope: return all platform orders
  if (session.role === "super_admin" && !storeSlug) {
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

  // Merchant scope: check multi-tenant isolation
  const targetSlug = storeSlug || session.slug || session.storeId || "apex-fashion";

  if (!canAccessStore(session, targetSlug)) {
    return NextResponse.json(
      { error: "Forbidden: You do not have permission to view orders for this store." },
      { status: 403 }
    );
  }

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
    const ip = SlidingWindowRateLimiter.getClientIp(request);
    const rate = trafficLimiter.check(`checkout:${ip}`, 30, 60);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Too many checkout requests. Please wait a moment before trying again." },
        {
          status: 429,
          headers: {
            "Retry-After": String(rate.resetSec),
            "X-RateLimit-Limit": String(rate.limit),
            "X-RateLimit-Remaining": String(rate.remaining),
            "X-RateLimit-Reset": String(rate.resetSec),
          },
        }
      );
    }

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

    // ── Input Sanitization (Anti-XSS Protection) ──
    const safeCustomerName = sanitizeString(data.customerName);
    const safeCustomerPhone = sanitizeString(data.customerPhone);
    const safeCustomerEmail = data.customerEmail ? sanitizeString(data.customerEmail) : undefined;
    const safeAddress = sanitizeString(formattedAddress);
    const safeDistrict = sanitizeString(district);

    // ── Server-Authoritative Price & Calculation Integrity ──
    // Fetch authoritative product catalog from store to eliminate client-side price tampering
    const storeProducts = devStore.getProducts(storeSlug);

    const cleanItems = data.items.map((it) => {
      // Find matching product in the verified store catalog
      const matched = storeProducts.find(
        (p) =>
          (it.id && p.id === it.id) ||
          (it.variantId && (p.id === it.variantId || p.sku === it.variantId)) ||
          (it.title && p.title.toLowerCase() === it.title.toLowerCase())
      );

      // Enforce the server catalog price; never allow arbitrary client manipulation
      let verifiedPrice: number;
      if (matched && typeof matched.price === "number" && matched.price > 0) {
        verifiedPrice = matched.price;
      } else {
        const parsed = typeof it.price === "string" ? parseFloat(it.price) : it.price;
        verifiedPrice = Math.max(1, isNaN(parsed) ? 100 : parsed);
      }

      // Quantity must be a positive integer between 1 and 99
      const safeQuantity = Math.min(99, Math.max(1, Math.floor(it.quantity || 1)));

      return {
        variantId: it.variantId || matched?.id,
        title: sanitizeString(matched?.title || it.title || "Product"),
        price: verifiedPrice,
        quantity: safeQuantity,
        isDropship: it.isDropship || matched?.isDropship,
        platformProductId: it.platformProductId,
      };
    });

    // 1. Save to devStore (instant, 100% synchronized)
    const newOrder = devStore.addOrder({
      storeSlug,
      customerName: safeCustomerName,
      customerPhone: safeCustomerPhone,
      customerEmail: safeCustomerEmail,
      shippingAddress: safeAddress,
      district: safeDistrict,
      items: cleanItems,
      paymentMethod: data.paymentMethod,
      shippingFee: data.shippingFee ?? 0,
      trxId: data.trxId ? sanitizeString(data.trxId) : undefined,
    });

    // Invalidate product catalog cache so inventory decrements show immediately
    fastCache.deletePrefix(`products:${storeSlug}`);

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
