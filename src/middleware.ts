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

