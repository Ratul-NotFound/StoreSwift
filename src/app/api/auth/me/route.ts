import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/api-auth";
import { devStore } from "@/lib/dev-store";

export async function GET(request: Request) {
  const session = getSessionFromRequest(request);

  if (!session) {
    return NextResponse.json({
      authenticated: false,
      user: null,
    });
  }

  const store = session.slug ? devStore.getStore(session.slug) : (session.storeId ? devStore.getStore(session.storeId) : null);

  return NextResponse.json({
    authenticated: true,
    user: {
      userId: session.userId,
      email: session.email,
      storeId: session.storeId,
      storeName: session.storeName || store?.name,
      slug: session.slug || store?.slug,
      role: session.role,
      plan: session.plan || store?.plan || "free",
    },
  });
}

