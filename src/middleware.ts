import { NextRequest, NextResponse } from "next/server";

export type RouteTarget = "platform" | "admin" | "store";

export interface ResolvedTenant {
  type: RouteTarget;
  tenantSlug?: string;
}

export function resolveTenantFromHost(host: string, rootDomain = "platform.com"): ResolvedTenant {
  const cleanHost = host.split(":")[0].toLowerCase().trim();
  const cleanRoot = rootDomain.toLowerCase().trim();

  if (cleanHost === cleanRoot || cleanHost === `www.${cleanRoot}` || cleanHost === "localhost") {
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

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "platform.com";
  const url = request.nextUrl.clone();
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "platform.com";
  const resolved = resolveTenantFromHost(host, rootDomain);

  // Rewriting internal routes for admin subdomain
  if (resolved.type === "admin" && !url.pathname.startsWith("/admin")) {
    url.pathname = `/admin${url.pathname === "/" ? "" : url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // Rewriting internal routes for store subdomains & custom domains
  if (resolved.type === "store" && resolved.tenantSlug) {
    if (
      !url.pathname.startsWith("/store") &&
      !url.pathname.startsWith("/_next") &&
      !url.pathname.startsWith("/api")
    ) {
      url.pathname = `/store/${resolved.tenantSlug}${url.pathname === "/" ? "" : url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
  ]
};
