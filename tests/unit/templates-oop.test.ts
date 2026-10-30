import { describe, it, expect } from "vitest";
import {
  TemplateFactory,
  MinimalAtelierTemplate,
  LuxeGlowTemplate,
  TechCyberTemplate,
  WarmHeritageTemplate,
  AbstractStoreTemplate
} from "../../src/templates";

describe("OOP Storefront Templates & Factory System", () => {
  it("registers and instantiates all 4 polymorphic template classes", () => {
    const templates = TemplateFactory.getAllTemplates();
    expect(templates.length).toBe(4);

    const ids = TemplateFactory.getTemplateIds();
    expect(ids).toContain("minimal");
    expect(ids).toContain("glow");
    expect(ids).toContain("bold");
    expect(ids).toContain("artisan");
  });

  it("retrieves the correct polymorphic instance with TemplateFactory.getTemplate()", () => {
    const minimal = TemplateFactory.getTemplate("minimal");
    expect(minimal).toBeInstanceOf(MinimalAtelierTemplate);
    expect(minimal.id).toBe("minimal");
    expect(minimal.getHeroLayoutType()).toBe("architectural");

    const glow = TemplateFactory.getTemplate("glow");
    expect(glow).toBeInstanceOf(LuxeGlowTemplate);
    expect(glow.id).toBe("glow");
    expect(glow.getHeroLayoutType()).toBe("ethereal");

    const cyber = TemplateFactory.getTemplate("bold");
    expect(cyber).toBeInstanceOf(TechCyberTemplate);
    expect(cyber.id).toBe("bold");
    expect(cyber.getHeroLayoutType()).toBe("cyber");

    const artisan = TemplateFactory.getTemplate("artisan");
    expect(artisan).toBeInstanceOf(WarmHeritageTemplate);
    expect(artisan.id).toBe("artisan");
    expect(artisan.getHeroLayoutType()).toBe("heritage");
  });

  it("falls back gracefully to default MinimalAtelierTemplate when unknown or empty ID is provided", () => {
    const fallbackEmpty = TemplateFactory.getTemplate("");
    expect(fallbackEmpty).toBeInstanceOf(MinimalAtelierTemplate);

    const fallbackNull = TemplateFactory.getTemplate(null);
    expect(fallbackNull).toBeInstanceOf(MinimalAtelierTemplate);

    const fallbackUnknown = TemplateFactory.getTemplate("futuristic-neon-random");
    expect(fallbackUnknown).toBeInstanceOf(MinimalAtelierTemplate);
  });

  it("polymorphically formats hero badges and product badges according to template personality", () => {
    const minimal = TemplateFactory.getTemplate("minimal");
    expect(minimal.formatHeroBadge("Fashion")).toContain("FASHION // ARCHIVE 2026");
    expect(minimal.formatProductBadge("Essential")).toBe("[ ESSENTIAL ]");

    const glow = TemplateFactory.getTemplate("glow");
    expect(glow.formatHeroBadge("Skincare")).toContain("CLEAN BEAUTY PROTOCOL");
    expect(glow.formatProductBadge("Hydrating")).toContain("✨ Hydrating");

    const cyber = TemplateFactory.getTemplate("bold");
    expect(cyber.formatHeroBadge("Audio")).toContain("HARDWARE LAB // AUDIO // LATENCY: 0.8MS");
    expect(cyber.formatProductBadge("Titanium")).toBe("✦ TITANIUM");

    const artisan = TemplateFactory.getTemplate("artisan");
    expect(artisan.formatHeroBadge("Leather")).toContain("HAND-CRAFTED // LEATHER // BATCH #26");
    expect(artisan.formatProductBadge("Goodyear Welt")).toContain("🏷️ Goodyear Welt");
  });

  it("generates distinct, industry-tailored manifesto pillars for each template", () => {
    const minimalPillars = TemplateFactory.getTemplate("minimal").getManifestoPillars();
    expect(minimalPillars.length).toBe(4);
    expect(minimalPillars[0].title).toBe("Atelier Verified");

    const glowPillars = TemplateFactory.getTemplate("glow").getManifestoPillars();
    expect(glowPillars[0].title).toContain("Cruelty-Free & Vegan");

    const cyberPillars = TemplateFactory.getTemplate("bold").getManifestoPillars();
    expect(cyberPillars[0].title).toContain("Aerospace CNC Tolerances");

    const artisanPillars = TemplateFactory.getTemplate("artisan").getManifestoPillars();
    expect(artisanPillars[0].title).toContain("Master Bench Craftsmanship");
  });

  it("executes OOP pricing, discount calculation, and scarcity notices correctly", () => {
    const tmpl = TemplateFactory.getTemplate("minimal");

    expect(tmpl.formatPrice(34.5)).toBe("$34.50");
    expect(tmpl.formatPrice(100)).toBe("$100.00");

    expect(tmpl.calculateDiscount(80, 100)).toBe(20);
    expect(tmpl.calculateDiscount(50, 50)).toBe(0);
    expect(tmpl.calculateDiscount(60, 40)).toBe(0);

    expect(tmpl.getScarcityUrgency(3)).toContain("Only 3 units remaining");
  });

  it("serializes to plain JSON object cleanly via toJSON()", () => {
    const tmpl = TemplateFactory.getTemplate("glow");
    const json = tmpl.toJSON();

    expect(json.id).toBe("glow");
    expect(json.name).toBe("Luxe Glow & Editorial");
    expect(json.primaryColor).toBe("#be123c");
    expect(json.vibe.heroStyle).toBe("luminous");
    expect(json.classes.pageBg).toBeDefined();
  });
});

