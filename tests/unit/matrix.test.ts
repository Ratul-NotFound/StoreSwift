import { describe, it, expect } from "vitest";
import { generateVariantMatrix } from "../../src/lib/matrix";

describe("Variant Matrix Generator", () => {
  it("generates single option variants correctly", () => {
    const variants = generateVariantMatrix("TEE", "20.00", {
      Size: ["S", "M", "L"]
    });

    expect(variants.length).toBe(3);
    expect(variants[0].title).toBe("S");
    expect(variants[0].sku).toBe("TEE-S");
    expect(variants[0].price).toBe("20.00");
  });

  it("generates full Cartesian product for multiple option attributes (e.g. Size x Color)", () => {
    const variants = generateVariantMatrix("JEAN", "45.00", {
      Size: ["30", "32"],
      Color: ["Blue", "Black"]
    });

    // 2 sizes * 2 colors = 4 variants
    expect(variants.length).toBe(4);
    expect(variants.map(v => v.title)).toEqual([
      "30 / Blue",
      "30 / Black",
      "32 / Blue",
      "32 / Black"
    ]);
    expect(variants[0].options).toEqual({ Size: "30", Color: "Blue" });
  });

  it("handles empty options gracefully by returning a single default variant", () => {
    const variants = generateVariantMatrix("MUG", "15.00", {});
    expect(variants.length).toBe(1);
    expect(variants[0].title).toBe("Default Title");
    expect(variants[0].sku).toBe("MUG-DEFAULT");
  });
});

