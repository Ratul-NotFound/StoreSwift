import { NextRequest, NextResponse } from "next/server";
import { verifySessionTokenEdge } from "./lib/auth-edge";

export type RouteTarget = "platform" | "admin" | "store";

export interface ResolvedTenant {
  type: RouteTarget;
  tenantSlug?: string;
}

export function resolveTenantFromHost(host: string, rootDomain = "platform.com"): ResolvedTenant {
  const rawHost = host.split(":")[0].toLowerCase().trim();
  const cleanHost = rawHost.replace(/[^a-z0-9.-]/g, "");
  const cleanRoot = rootDomain.toLowerCase().trim();

  if (!cleanHost || cleanHost.length > 253) {
    return { type: "platform" };
  }

  if (cleanHost === cleanRoot || cleanHost === `www.${cleanRoot}` || cleanHost === "localhost" || cleanHost === "127.0.0.1") {
    return { type: "platform" };
  }

  if (cleanHost === `app.${cleanRoot}`) {
    return { type: "admin" };
  }

  if (cleanHost.endsWith(`.${cleanRoot}`)) {
    const subdomain = cleanHost.replace(`.${cleanRoot}`, "");
    return { type: "store", tenantSlug: subdomain };
  }

  // Any non-matching host is treated as a custom domain
  return { type: "store", tenantSlug: cleanHost };
}

function applySecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  return response;
}

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "platform.com";
  const url = request.nextUrl.clone();
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "platform.com";

  const token = request.cookies.get("ss_session")?.value;
  const session = token ? await verifySessionTokenEdge(token) : null;

  // ─── Direct API Admin Armor: Strict 401/403 for API endpoints ──────
  if (url.pathname.startsWith("/api/admin")) {
    if (!session) {
      return applySecurityHeaders(
        NextResponse.json({ error: "Unauthorized: Session required." }, { status: 401 })
      );
    }
    if (session.role !== "super_admin") {
      return applySecurityHeaders(
        NextResponse.json({ error: "Forbidden: Super admin authentication required." }, { status: 403 })
      );
    }
  }

  // ─── JWT Auth Guard for protected admin and merchant dashboard routes ─────
  const isSuperAdminRoute = url.pathname.startsWith("/super-admin");
  const isAdminRoute = url.pathname.startsWith("/admin");
  const isStoreDashboardRoute = /\/store\/[^/]+\/dashboard/.test(url.pathname);
  const isProtected = isSuperAdminRoute || isAdminRoute || isStoreDashboardRoute;

  if (isProtected) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", url.pathname);
      return applySecurityHeaders(NextResponse.redirect(loginUrl));
    }

    // 1. Super admin route requires super_admin role
    if (isSuperAdminRoute && session.role !== "super_admin") {
      const dest = session.slug ? `/store/${session.slug}/dashboard` : "/login?error=super_admin_required";
      return applySecurityHeaders(NextResponse.redirect(new URL(dest, request.url)));
    }

    // 2. Multi-tenant isolation: prevent cross-store dashboard access for regular merchants
    if (isStoreDashboardRoute && session.role !== "super_admin") {
      const match = url.pathname.match(/\/store\/([^/]+)\/dashboard/);
      const requestedTenant = match ? match[1] : null;
      if (requestedTenant && session.slug && session.slug.toLowerCase() !== requestedTenant.toLowerCase()) {
        // Merchant attempted to access another store's dashboard -> redirect to their own store dashboard
        return applySecurityHeaders(NextResponse.redirect(new URL(`/store/${session.slug}/dashboard`, request.url)));
      }
    }
  }

  // ─── Tenant Host Routing ──────────────────────────────────────────
  const resolved = resolveTenantFromHost(host, rootDomain);

  // Rewriting internal routes for admin subdomain
  if (resolved.type === "admin" && !url.pathname.startsWith("/admin")) {
    url.pathname = `/admin${url.pathname === "/" ? "" : url.pathname}`;
    const response = NextResponse.rewrite(url);
    return applySecurityHeaders(response);
  }

  // Rewriting internal routes for store subdomains & custom domains
  if (resolved.type === "store" && resolved.tenantSlug) {
    if (
      !url.pathname.startsWith("/store") &&
      !url.pathname.startsWith("/_next") &&
      !url.pathname.startsWith("/api")
    ) {
      url.pathname = `/store/${resolved.tenantSlug}${url.pathname === "/" ? "" : url.pathname}`;
      const response = NextResponse.rewrite(url);
      return applySecurityHeaders(response);
    }
  }

  const response = NextResponse.next();
  return applySecurityHeaders(response);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
  ]
};
