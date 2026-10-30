import { jwtVerify } from "jose/jwt/verify";

export interface SessionPayload {
  userId: string;
  email: string;
  storeId: string;
  role: string;
}

export async function verifySessionTokenEdge(token: string): Promise<SessionPayload | null> {
  try {
    const secret = process.env.AUTH_SECRET;
    if (!secret) return null;
    const encoder = new TextEncoder();
    const { payload } = await jwtVerify(token, encoder.encode(secret));
    const p = payload as Record<string, unknown>;
    if (p.userId && p.storeId) {
      return {
        userId: String(p.userId),
        email: String(p.email ?? ""),
        storeId: String(p.storeId),
        role: String(p.role ?? "merchant_owner")
      };
    }
    return null;
  } catch {
    return null;
  }
}
