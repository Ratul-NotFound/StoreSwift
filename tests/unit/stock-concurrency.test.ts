import { describe, it, expect } from "vitest";
import { verifyAndDeductStock } from "../../src/lib/stock";

describe("Atomic Stock Deduction Logic", () => {
  it("successfully deducts stock when sufficient inventory exists", () => {
    const result = verifyAndDeductStock("variant-1", 10, 2);
    expect(result.success).toBe(true);
    expect(result.newStock).toBe(8);
  });

  it("strictly rejects checkout when requested quantity exceeds available stock", () => {
    const result = verifyAndDeductStock("variant-1", 1, 2);
    expect(result.success).toBe(false);
    expect(result.newStock).toBe(1);
  });

  it("handles exact zero boundary condition", () => {
    const result = verifyAndDeductStock("variant-1", 2, 2);
    expect(result.success).toBe(true);
    expect(result.newStock).toBe(0);
  });
});

