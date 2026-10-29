import { describe, it, expect } from "vitest";
import { isReservedSlug } from "../../src/config/reserved-slugs";

describe("Reserved Subdomain Validator", () => {
  it("blocks system reserved subdomains", () => {
    expect(isReservedSlug("admin")).toBe(true);
    expect(isReservedSlug("api")).toBe(true);
    expect(isReservedSlug("app")).toBe(true);
    expect(isReservedSlug("www")).toBe(true);
    expect(isReservedSlug("billing")).toBe(true);
  });

  it("permits valid merchant subdomains", () => {
    expect(isReservedSlug("apex-fashion")).toBe(false);
    expect(isReservedSlug("tech-bazaar")).toBe(false);
    expect(isReservedSlug("green-grocery")).toBe(false);
  });

  it("handles case-insensitivity and whitespace", () => {
    expect(isReservedSlug("ADMIN ")).toBe(true);
    expect(isReservedSlug(" App ")).toBe(true);
  });
});

