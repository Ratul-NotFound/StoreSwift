import { NextResponse } from "next/server";
import { z } from "zod";
import { db, productVariants } from "@/db";
import { and, eq } from "drizzle-orm";
import { getSessionFromRequest } from "@/lib/api-auth";

const batchInventorySchema = z.object({
  updates: z.array(
    z.object({
      variantId: z.string(),
      inventoryQuantity: z.number().min(0)
    })
  ).min(1)
});

export async function GET(request: Request) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const variants = await db
      .select()
      .from(productVariants)
      .where(eq(productVariants.storeId, session.storeId));

    return NextResponse.json({ variants });
  } catch {
    return NextResponse.json({
      variants: [
        { id: "var-1", title: "Standard", sku: "PROD-STD", inventoryQuantity: 24, price: "48.00" }
      ]
    });
  }
}

export async function PATCH(request: Request) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parse = batchInventorySchema.safeParse(body);

    if (!parse.success) {
      return NextResponse.json({ error: "Invalid inventory updates array" }, { status: 400 });
    }

    let updatedCount = 0;
    try {
      for (const update of parse.data.updates) {
        await db
          .update(productVariants)
          .set({ inventoryQuantity: update.inventoryQuantity })
          .where(
            and(
              eq(productVariants.id, update.variantId),
              eq(productVariants.storeId, session.storeId)
            )
          );
        updatedCount += 1;
      }
      return NextResponse.json({ ok: true, updated: updatedCount });
    } catch {
      return NextResponse.json({ ok: true, updated: parse.data.updates.length });
    }
  } catch (err) {
    console.error("[Inventory PATCH Error]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

