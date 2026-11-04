import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionFromRequest, canAccessStore } from "@/lib/api-auth";
import { devStore } from "@/lib/dev-store";
import { fastCache } from "@/lib/cache";

const CreateListingSchema = z.object({
  platformProductId: z.string(),
  sellPrice: z.number().or(z.string()).optional(),
  myPrice: z.number().or(z.string()).optional(),
  storeSlug: z.string().optional(),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const storeSlug = url.searchParams.get("storeSlug") || "apex-fashion";

  const storeProducts = devStore.getProducts(storeSlug);
  const dropshipItems = storeProducts.filter((p) => p.isDropship);

  return NextResponse.json({ ok: true, listings: dropshipItems });
}

export async function POST(request: Request) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized: Session required." }, { status: 401 });
  }

  const body = await request.json();
  const parse = CreateListingSchema.safeParse(body);

  if (!parse.success) {
    return NextResponse.json({ error: parse.error.errors[0]?.message || "Invalid dropship parameters" }, { status: 400 });
  }

  const { platformProductId, storeSlug } = parse.data;
  const rawPrice = parse.data.sellPrice ?? parse.data.myPrice;
  const numPrice = typeof rawPrice === "string" ? parseFloat(rawPrice) : (rawPrice || 0);

  const requestedSlug = storeSlug || session.slug || session.storeId || "apex-fashion";

  if (!canAccessStore(session, requestedSlug)) {
    return NextResponse.json(
      { error: "Forbidden: You do not have permission to list dropship items for this store." },
      { status: 403 }
    );
  }

  const targetSlug = session.role !== "super_admin" ? (session.slug || session.storeId || requestedSlug) : requestedSlug;
  const store = devStore.ensureStore(targetSlug);

  // Plan Gate: Dropshipping requires Medium or Pro
  if (store.plan === "free") {
    return NextResponse.json(
      { error: "Dropshipping requires Medium (৳499/mo) or Pro (৳999/mo) plan.", upgrade: true },
      { status: 403 }
    );
  }

  // List product into merchant's store catalog
  const listedProduct = devStore.listDropshipProduct(targetSlug, platformProductId, numPrice);

  if (!listedProduct) {
    return NextResponse.json(
      { error: "Product not found or sell price is below platform minimum" },
      { status: 400 }
    );
  }

  return NextResponse.json({
    ok: true,
    listing: {
      id: listedProduct.id,
      platformProductId,
      sellPrice: numPrice,
      product: {
        title: listedProduct.title,
        price: numPrice,
      },
    },
  }, { status: 201 });
}

export async function DELETE(request: Request) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized: Session required." }, { status: 401 });
  }

  const url = new URL(request.url);
  const platformProductId = url.searchParams.get("platformProductId");
  const storeSlug = url.searchParams.get("storeSlug") || session.slug || session.storeId || "apex-fashion";

  if (!platformProductId) {
    return NextResponse.json({ error: "platformProductId required" }, { status: 400 });
  }

  if (!canAccessStore(session, storeSlug)) {
    return NextResponse.json({ error: "Forbidden: You do not have permission for this store." }, { status: 403 });
  }

  devStore.unlistDropshipProduct(storeSlug, platformProductId);
  fastCache.deletePrefix(`products:${storeSlug}`);

  return NextResponse.json({ ok: true, unlisted: platformProductId });
}
