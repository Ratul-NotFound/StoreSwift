import { describe, it, expect } from "vitest";
import { getCategoryConfig, ALL_CATEGORIES } from "../../src/config/categories";
import { generateStoreSeedData } from "../../src/lib/seed-store";

describe("Category Presets and Store Seed Engine", () => {
  it("provides comprehensive preset configurations for all supported categories", () => {
    expect(ALL_CATEGORIES).toContain("fashion");
    expect(ALL_CATEGORIES).toContain("electronics");
    expect(ALL_CATEGORIES).toContain("grocery_food");
    expect(ALL_CATEGORIES).toContain("beauty_cosmetics");

    const fashionConfig = getCategoryConfig("fashion");
    expect(fashionConfig.name).toBe("Fashion & Apparel");
    expect(fashionConfig.defaultOptions).toContain("Size");
    expect(fashionConfig.defaultOptions).toContain("Color");
  });

  it("generates exactly 3 pre-seeded demo products with variants for instant launch", () => {
    const seed = generateStoreSeedData("store-123", "fashion");
    expect(seed.products.length).toBe(3);
    expect(seed.products[0].storeId).toBe("store-123");
    expect(seed.variants.length).toBeGreaterThanOrEqual(3);
    expect(seed.variants[0].inventoryQuantity).toBeGreaterThan(0);
  });
});
