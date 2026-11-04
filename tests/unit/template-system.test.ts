import { describe, it, expect } from "vitest";
import { devStore } from "@/lib/dev-store";
import { ALL_TEMPLATE_CHOICES } from "@/components/store/template-switcher-bar";
import { GET as getSettings, PATCH as patchSettings } from "@/app/api/stores/[slug]/settings/route";
import { NextRequest } from "next/server";

describe("Storefront Template Switcher & Dynamic Catalog System", () => {
  it("defines all 14 production-grade templates categorized across 6 retail industries", () => {
    expect(ALL_TEMPLATE_CHOICES.length).toBe(14);
    const ids = ALL_TEMPLATE_CHOICES.map((t) => t.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(14);

    const expectedTemplates = [
      "minimal",
      "clothing",
      "milano",
      "nickelfox",
      "glow",
      "luxe-glam",
      "artisan",
      "velocity",
      "bold",
      "lumina",
      "maison",
      "aurora",
      "pantry",
      "bazaar",
    ];

    expectedTemplates.forEach((expectedId) => {
      expect(ids).toContain(expectedId);
      const tmpl = ALL_TEMPLATE_CHOICES.find((t) => t.id === expectedId);
      expect(tmpl).toBeDefined();
      expect(tmpl?.name.length).toBeGreaterThan(0);
      expect(tmpl?.badge.length).toBeGreaterThan(0);
      expect(tmpl?.desc.length).toBeGreaterThan(0);
      expect(tmpl?.category.length).toBeGreaterThan(0);
      expect(tmpl?.categoryName.length).toBeGreaterThan(0);
    });

    // Verify all 6 categories have multiple templates
    const categories = ["fashion", "beauty_cosmetics", "shoes", "electronics", "jewelry", "grocery_food"];
    categories.forEach((cat) => {
      const catTemplates = ALL_TEMPLATE_CHOICES.filter((t) => t.category === cat);
      expect(catTemplates.length).toBeGreaterThanOrEqual(2);
    });
  });

  it("persists store template choice in devStore and preserves store state", () => {
    const slug = "apex-fashion";
    const initialStore = devStore.getStore(slug);
    expect(initialStore).not.toBeNull();

    // Update template to milano
    devStore.updateStore(slug, { template: "milano" });
    const updatedStore = devStore.getStore(slug);
    expect(updatedStore?.template).toBe("milano");
    expect(updatedStore?.name).toBe("Apex Fashion Ltd");
    expect(updatedStore?.currency).toBe("BDT");

    // Update template to clothing
    devStore.updateStore(slug, { template: "clothing" });
    expect(devStore.getStore(slug)?.template).toBe("clothing");

    // Reset back to minimal
    devStore.updateStore(slug, { template: "minimal" });
    expect(devStore.getStore(slug)?.template).toBe("minimal");
  });

  it("assigns appropriate default templates on store initialization or ensureStore", () => {
    const milanoStore = devStore.getStore("milano-urban-store");
    expect(milanoStore?.template).toBe("milano");

    const artisanStore = devStore.getStore("craft-shoes");
    expect(artisanStore?.template).toBe("artisan");

    const clothingStore = devStore.getStore("my-clothing-store");
    expect(clothingStore?.template).toBe("clothing");

    // Auto-deduction test with new store slug
    const newOrganicStore = devStore.ensureStore(
      "fresh-organic-pantry",
      "Fresh Organic Pantry",
      "grocery"
    );
    expect(newOrganicStore.template).toBe("pantry");
  });

  it("handles settings API GET & PATCH requests with template persistence", async () => {
    const slug = "apex-fashion";

    // 1. PATCH template to 'nickelfox'
    const patchReq = new NextRequest("http://localhost:3000/api/stores/apex-fashion/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        template: "nickelfox",
        description: "Updated description for testing",
      }),
    });

    const patchRes = await patchSettings(patchReq, { params: Promise.resolve({ slug }) });
    expect(patchRes.status).toBe(200);
    const patchBody = await patchRes.json();
    expect(patchBody.ok).toBe(true);
    expect(patchBody.settings.template).toBe("nickelfox");

    // Verify in devStore
    expect(devStore.getStore(slug)?.template).toBe("nickelfox");

    // 2. GET returns the updated template
    const getReq = new NextRequest("http://localhost:3000/api/stores/apex-fashion/settings");
    const getRes = await getSettings(getReq, { params: Promise.resolve({ slug }) });
    expect(getRes.status).toBe(200);
    const getBody = await getRes.json();
    expect(getBody.settings.template).toBe("nickelfox");

    // Restore to minimal
    devStore.updateStore(slug, { template: "minimal" });
  });

  it("ensures all templates have access to dynamic store products and BDT formatting", () => {
    const products = devStore.getProducts("apex-fashion");
    expect(products.length).toBeGreaterThan(0);

    products.forEach((prod) => {
      expect(prod.id).toBeDefined();
      expect(typeof prod.price).toBe("number");
      expect(prod.price).toBeGreaterThan(0);
      expect(prod.title.length).toBeGreaterThan(0);
      // Formatted BDT representation should be valid
      const formatted = `৳${prod.price.toLocaleString("en-BD")}`;
      expect(formatted).toMatch(/^৳[\d,]+$/);
    });
  });

  it("verifies elimination of duplicate fashion sub-styles and confirms clean MinimalStorefront forwarder", async () => {
    // 1. FashionStorefront and MinimalStorefront export properly
    const { MinimalStorefront } = await import("@/components/store/templates/minimal-storefront");
    const { FashionStorefront } = await import("@/components/store/templates/fashion-storefront");

    expect(MinimalStorefront).toBeDefined();
    expect(FashionStorefront).toBeDefined();
    // FashionStorefront is an alias / forwarder to MinimalStorefront
    expect(FashionStorefront).toBe(MinimalStorefront);
  });

  it("verifies category configuration has multiple assigned templates per category", async () => {
    const { CATEGORIES_MAP } = await import("@/config/categories");
    Object.values(CATEGORIES_MAP).forEach((cat) => {
      expect(cat.availableTemplates).toBeDefined();
      expect(cat.availableTemplates?.length).toBeGreaterThanOrEqual(2);
      expect(cat.availableTemplates).toContain(cat.recommendedTemplate);
    });
  });
});
