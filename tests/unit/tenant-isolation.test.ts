import { describe, it, expect } from "vitest";
import { buildTenantFilter } from "../../src/db/tenant";

describe("Tenant Isolation Filter Builder", () => {
  it("throws an error if storeId is missing or empty", () => {
    expect(() => buildTenantFilter("")).toThrow("storeId is required for tenant isolation");
    expect(() => buildTenantFilter(null as unknown as string)).toThrow("storeId is required for tenant isolation");
  });

  it("produces valid tenant scoped criteria", () => {
    const filter = buildTenantFilter("store-uuid-1234");
    expect(filter).toEqual({ storeId: "store-uuid-1234" });
  });
});
