import { verifySessionToken, SessionPayload } from "./auth";

export { type SessionPayload } from "./auth";

export function getSessionFromRequest(request: Request): SessionPayload | null {
  // 1. Check Authorization header (Bearer token)
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7).trim();
    const session = verifySessionToken(token);
    if (session) return session;
  }

  // 2. Check ss_session cookie
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/(?:^|;\s*)ss_session=([^;]+)/);
  if (!match) return null;

  try {
    const rawVal = decodeURIComponent(match[1].trim());
    return verifySessionToken(rawVal);
  } catch {
    return verifySessionToken(match[1].trim());
  }
}

/**
 * Checks whether an authenticated session is authorized to modify or view a specific tenant store.
 * Super admins have universal access across all tenants.
 * Merchants can only access their own store (matching either store slug or storeId).
 */
export function canAccessStore(session: SessionPayload | null, storeSlugOrId: string): boolean {
  if (!session) {
    // In dev mode with no active session, allow local testing
    return process.env.NODE_ENV !== "production";
  }

  if (session.role === "super_admin") {
    return true;
  }

  if (session.slug && session.slug.toLowerCase() === storeSlugOrId.toLowerCase()) {
    return true;
  }

  if (session.storeId && session.storeId.toLowerCase() === storeSlugOrId.toLowerCase()) {
    return true;
  }

  return false;
}
