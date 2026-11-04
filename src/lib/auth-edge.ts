import { jwtVerify } from "jose/jwt/verify";

export type SubscriptionPlan = "free" | "medium" | "pro";

export interface SessionPayload {
  userId: string;
  email: string;
  storeId: string;
  role: string;
  plan?: SubscriptionPlan;
  storeName?: string;
  slug?: string;
}

const DEV_FALLBACK_SECRET = "storeswift-dev-fallback-secret-key-32-chars-long";

export async function verifySessionTokenEdge(token: string): Promise<SessionPayload | null> {
  try {
    const secret = process.env.AUTH_SECRET || (process.env.NODE_ENV !== "production" ? DEV_FALLBACK_SECRET : undefined);
    if (!secret) return null;
    const encoder = new TextEncoder();
    const { payload } = await jwtVerify(token, encoder.encode(secret));
    const p = payload as Record<string, unknown>;
    if (p.userId && p.storeId) {
      return {
        userId: String(p.userId),
        email: String(p.email ?? ""),
        storeId: String(p.storeId),
        role: String(p.role ?? "merchant_owner"),
        plan: (p.plan as SubscriptionPlan) ?? "free",
        storeName: p.storeName ? String(p.storeName) : undefined,
        slug: p.slug ? String(p.slug) : undefined,
      };
    }
    return null;
  } catch {
    return null;
  }
}
