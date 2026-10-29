import { describe, it, expect } from "vitest";
import { resolveTenantFromHost } from "../../src/middleware";

describe("Subdomain and Tenant Host Resolver", () => {
  const ROOT = "platform.com";

  it("routes root domain to platform marketing", () => {
    expect(resolveTenantFromHost("platform.com", ROOT)).toEqual({ type: "platform" });
    expect(resolveTenantFromHost("www.platform.com", ROOT)).toEqual({ type: "platform" });
  });

  it("routes app subdomain to merchant admin", () => {
    expect(resolveTenantFromHost("app.platform.com", ROOT)).toEqual({ type: "admin" });
  });

  it("routes tenant subdomain to store router", () => {
    expect(resolveTenantFromHost("apex-fashion.platform.com", ROOT)).toEqual({
      type: "store",
      tenantSlug: "apex-fashion"
    });
  });

  it("routes custom domains to store router", () => {
    expect(resolveTenantFromHost("apexapparel.com", ROOT)).toEqual({
      type: "store",
      tenantSlug: "apexapparel.com"
    });
  });
});

