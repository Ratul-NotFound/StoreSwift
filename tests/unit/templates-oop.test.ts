import { describe, it, expect } from "vitest";
import {
  TemplateFactory,
  MinimalAtelierTemplate,
  LuxeGlowTemplate,
  TechCyberTemplate,
  WarmHeritageTemplate,
  OpulentMaisonTemplate,
  ArtisanPantryTemplate,
  AbstractStoreTemplate
} from "../../src/templates";

describe("OOP Storefront Templates & Factory System", () => {
  it("registers and instantiates all 6 polymorphic template classes", () => {
    const templates = TemplateFactory.getAllTemplates();
    expect(templates.length).toBe(6);

    const ids = TemplateFactory.getTemplateIds();
    expect(ids).toContain("minimal");
    expect(ids).toContain("glow");
    expect(ids).toContain("bold");
    expect(ids).toContain("artisan");
    expect(ids).toContain("maison");
    expect(ids).toContain("pantry");
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

    const maison = TemplateFactory.getTemplate("maison");
    expect(maison).toBeInstanceOf(OpulentMaisonTemplate);
    expect(maison.id).toBe("maison");
    expect(maison.getHeroLayoutType()).toBe("opulent");

    const pantry = TemplateFactory.getTemplate("pantry");
    expect(pantry).toBeInstanceOf(ArtisanPantryTemplate);
    expect(pantry.id).toBe("pantry");
    expect(pantry.getHeroLayoutType()).toBe("organic");
  });

  it("resolves business category and descriptive aliases intelligently", () => {
    expect(TemplateFactory.getTemplate("jewelry")).toBeInstanceOf(OpulentMaisonTemplate);
    expect(TemplateFactory.getTemplate("watches")).toBeInstanceOf(OpulentMaisonTemplate);
    expect(TemplateFactory.getTemplate("opulent")).toBeInstanceOf(OpulentMaisonTemplate);

    expect(TemplateFactory.getTemplate("grocery_food")).toBeInstanceOf(ArtisanPantryTemplate);
    expect(TemplateFactory.getTemplate("food")).toBeInstanceOf(ArtisanPantryTemplate);
    expect(TemplateFactory.getTemplate("organic")).toBeInstanceOf(ArtisanPantryTemplate);

    expect(TemplateFactory.getTemplate("fashion")).toBeInstanceOf(MinimalAtelierTemplate);
    expect(TemplateFactory.getTemplate("streetwear")).toBeInstanceOf(MinimalAtelierTemplate);

    expect(TemplateFactory.getTemplate("beauty_cosmetics")).toBeInstanceOf(LuxeGlowTemplate);
    expect(TemplateFactory.getTemplate("skincare")).toBeInstanceOf(LuxeGlowTemplate);

    expect(TemplateFactory.getTemplate("electronics")).toBeInstanceOf(TechCyberTemplate);
    expect(TemplateFactory.getTemplate("hardware")).toBeInstanceOf(TechCyberTemplate);

    expect(TemplateFactory.getTemplate("shoes")).toBeInstanceOf(WarmHeritageTemplate);
    expect(TemplateFactory.getTemplate("leather")).toBeInstanceOf(WarmHeritageTemplate);
  });

  it("falls back gracefully to default MinimalAtelierTemplate when unknown or empty ID is provided", () => {
    const fallbackEmpty = TemplateFactory.getTemplate("");
    expect(fallbackEmpty).toBeInstanceOf(MinimalAtelierTemplate);

    const fallbackNull = TemplateFactory.getTemplate(null);
    expect(fallbackNull).toBeInstanceOf(MinimalAtelierTemplate);

    const fallbackUnknown = TemplateFactory.getTemplate("futuristic-neon-random");
    expect(fallbackUnknown).toBeInstanceOf(MinimalAtelierTemplate);
  });

  it("polymorphically formats hero badges and product badges according to clean minimalist personality", () => {
    const minimal = TemplateFactory.getTemplate("minimal");
    expect(minimal.formatHeroBadge("Fashion")).toBe("Archive 2026 • Fashion");
    expect(minimal.formatProductBadge("Essential")).toBe("Essential");

    const glow = TemplateFactory.getTemplate("glow");
    expect(glow.formatHeroBadge("Skincare")).toBe("Clinical Botanical Formula • Skincare");
    expect(glow.formatProductBadge("Hydrating")).toBe("Hydrating");

    const cyber = TemplateFactory.getTemplate("bold");
    expect(cyber.formatHeroBadge("Audio")).toBe("Precision Hardware • Audio");
    expect(cyber.formatProductBadge("Titanium")).toBe("Titanium");

    const artisan = TemplateFactory.getTemplate("artisan");
    expect(artisan.formatHeroBadge("Leather")).toBe("Bench-Crafted Heritage • Leather");
    expect(artisan.formatProductBadge("Goodyear Welt")).toBe("Goodyear Welt");

    const maison = TemplateFactory.getTemplate("maison");
    expect(maison.formatHeroBadge("Jewelry")).toBe("Fine Horology & High Jewelry • Jewelry");
    expect(maison.formatProductBadge("18k Gold")).toBe("18k Gold");

    const pantry = TemplateFactory.getTemplate("pantry");
    expect(pantry.formatHeroBadge("Coffee")).toBe("Regenerative Organic Farmstead • Coffee");
    expect(pantry.formatProductBadge("Single Origin")).toBe("Single Origin");
  });

  it("generates distinct, industry-tailored manifesto pillars for all templates", () => {
    const minimalPillars = TemplateFactory.getTemplate("minimal").getManifestoPillars();
    expect(minimalPillars.length).toBe(4);
    expect(minimalPillars[0].title).toBe("Atelier Verified");

    const glowPillars = TemplateFactory.getTemplate("glow").getManifestoPillars();
    expect(glowPillars[0].title).toBe("Clinical & Non-Toxic");

    const cyberPillars = TemplateFactory.getTemplate("bold").getManifestoPillars();
    expect(cyberPillars[0].title).toBe("100% Genuine Calibrated");

    const artisanPillars = TemplateFactory.getTemplate("artisan").getManifestoPillars();
    expect(artisanPillars[0].title).toBe("Master Bench Lasted");

    const maisonPillars = TemplateFactory.getTemplate("maison").getManifestoPillars();
    expect(maisonPillars[0].title).toBe("GIA & Hallmark Certified");

    const pantryPillars = TemplateFactory.getTemplate("pantry").getManifestoPillars();
    expect(pantryPillars[0].title).toBe("100% Certified Organic");
  });

  it("executes OOP pricing, discount calculation, and shipping guarantees correctly", () => {
    const tmpl = TemplateFactory.getTemplate("minimal");

    expect(tmpl.formatPrice(34.5)).toBe("$34.50");
    expect(tmpl.formatPrice(100)).toBe("$100.00");
    expect(tmpl.formatPrice(100, "EUR")).toBe("€100.00");
    expect(tmpl.formatPrice(100, "GBP")).toBe("£100.00");

    expect(tmpl.calculateDiscount(80, 100)).toBe(20);
    expect(tmpl.calculateDiscount(50, 50)).toBe(0);
    expect(tmpl.calculateDiscount(60, 40)).toBe(0);

    expect(tmpl.getScarcityUrgency(3)).toContain("Only 3 units left in stock");

    const shipping = tmpl.getShippingPolicy();
    expect(shipping.dispatchHours).toBe(48);
    expect(shipping.codAllowed).toBe(true);
  });

  it("serializes to plain JSON object cleanly via toJSON()", () => {
    const tmpl = TemplateFactory.getTemplate("glow");
    const json = tmpl.toJSON();

    expect(json.id).toBe("glow");
    expect(json.name).toBe("Luxe Glow Lab");
    expect(json.primaryColor).toBe("#be185d");
    expect(json.vibe.heroStyle).toBe("luminous");
    expect(json.classes.pageBg).toBeDefined();
    expect(json.curatedTitle).toBe("Clinical Botanical Protocols • 2026 Collection");
    expect(json.brandSignature).toContain("Clean Formulations");
    expect(json.psychology).toBeDefined();
    expect(json.psychology.doorstepChecklist.length).toBe(3);
  });

  it("provides tailored category context psychology and doorstep inspection checklists for each template", () => {
    const minimalPsych = TemplateFactory.getTemplate("minimal").getCategoryPsychology();
    expect(minimalPsych.keySpecHighlight).toContain("280 GSM");
    expect(minimalPsych.doorstepChecklist.length).toBe(3);

    const glowPsych = TemplateFactory.getTemplate("glow").getCategoryPsychology();
    expect(glowPsych.keySpecHighlight).toContain("Clinical Bio-Actives");
    expect(glowPsych.primaryBuyerFear).toContain("allergic skin reactions");

    const cyberPsych = TemplateFactory.getTemplate("bold").getCategoryPsychology();
    expect(cyberPsych.keySpecHighlight).toContain("CNC Billet");
    expect(cyberPsych.reassurancePledge).toContain("2-year advance hardware swap");

    const artisanPsych = TemplateFactory.getTemplate("artisan").getCategoryPsychology();
    expect(artisanPsych.keySpecHighlight).toContain("Goodyear Welt");
    expect(artisanPsych.primaryBuyerFear).toContain("blistering");

    const maisonPsych = TemplateFactory.getTemplate("maison").getCategoryPsychology();
    expect(maisonPsych.keySpecHighlight).toContain("18K Gold");
    expect(maisonPsych.doorstepChecklist[0]).toContain("Assay Office");

    const pantryPsych = TemplateFactory.getTemplate("pantry").getCategoryPsychology();
    expect(pantryPsych.keySpecHighlight).toContain("Organic");
    expect(pantryPsych.doorstepChecklist[0]).toContain("roast or estate harvest timestamp");
  });
});
