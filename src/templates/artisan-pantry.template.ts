import { AbstractStoreTemplate } from "./base.template";
import {
  StoreTemplateId,
  StoreTemplateVibe,
  StoreTemplateClasses,
  TrustManifestoItem,
  DesignPhilosophy,
  AnnouncementHighlights
} from "./types";

export class ArtisanPantryTemplate extends AbstractStoreTemplate {
  readonly id: StoreTemplateId = "pantry";
  readonly name = "Artisan Farmstead Pantry";
  readonly tagline = "Single-origin micro-lots, raw wildflower honey, and estate olive provisions.";
  readonly categoryFit = "Gourmet Foods, Specialty Coffee & Regenerative Farmstead";
  readonly description = "Inspired by Erewhon & Blue Bottle: Organic warm stone canvas, forest sage greens, harvest batch stamps, and compostable packaging.";
  readonly badge = "Regenerative Farm";
  readonly previewBg = "from-emerald-950 via-stone-900 to-zinc-950";
  readonly primaryColor = "#15803d";
  readonly accentColor = "#16a34a";

  readonly vibe: StoreTemplateVibe = {
    fontDisplay: "font-sans tracking-tight",
    borderRadius: "rounded-2xl",
    heroStyle: "organic",
    cardElevation: "shadow-subtle hover:shadow-card",
    badgeStyle: "bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 text-[10px] tracking-wide font-mono"
  };

  readonly classes: StoreTemplateClasses = {
    pageBg: "bg-[#fbfbf8] text-stone-900 selection:bg-emerald-800 selection:text-white",
    headerBg: "bg-[#fbfbf8]/90 backdrop-blur-md border-b border-stone-200/80 text-stone-900",
    navPillBg: "bg-[#fbfbf8]/95 border-b border-stone-200/70",
    toolbarBg: "bg-white border-stone-200 shadow-subtle",
    lookbookBg: "bg-[#f4f4ef] border-y border-stone-200 text-stone-900",
    heroSection: "bg-[#fbfbf8] border-b border-stone-200/80 text-stone-900",
    heroBadge: "bg-emerald-900 text-emerald-100 border-emerald-800 shadow-sm",
    heroTitle: "text-stone-900 font-bold tracking-tight",
    heroSubtitle: "text-stone-600",
    editorialTag: "font-mono text-[10px] tracking-[0.25em] uppercase text-emerald-700 font-bold",
    productCard: "bg-white border-stone-200 hover:border-emerald-700/50 transition-all duration-300 hover:shadow-card",
    productCardImg: "rounded-xl",
    primaryButton: "bg-emerald-800 hover:bg-emerald-700 text-emerald-50 shadow-sm font-semibold",
    secondaryButton: "bg-white border-stone-300 hover:bg-stone-50 text-stone-800 font-medium",
    pillActive: "bg-emerald-800 text-emerald-50 shadow-sm ring-1 ring-emerald-800",
    pillInactive: "bg-stone-100 hover:bg-stone-200 text-stone-700",
    accentText: "text-emerald-800",
    announcementBar: "bg-emerald-950 text-emerald-200 border-b border-emerald-900",
    featureCard: "bg-[#f6f6f0] border-stone-200",
    spotlightBanner: "bg-stone-900 text-emerald-100 border-stone-800"
  };

  public getHeroLayoutType(): "organic" {
    return "organic";
  }

  public getProductCardAspect(): string {
    return "aspect-[4/3]";
  }

  public getCuratedCollectionTitle(): string {
    return "REGENERATIVE PANTRY & ROASTER SELECTION // 2026";
  }

  public getBrandSignature(): string {
    return "100% Certified Organic • Single-Origin Micro-Lots & Home Compostable Bags";
  }

  public override getAnnouncementHighlights(): AnnouncementHighlights {
    return {
      leading: "🌱 Direct Regenerative Farm Sourcing",
      center: "☕ FRESH MICRO-LOT BATCH ROASTS • DOORSTEP PACKAGING AROMA INSPECTION",
      trailing: "♻️ 100% Compostable Packaging"
    };
  }

  public formatHeroBadge(categoryName: string): string {
    return `DIRECT FARMSTEAD PROVISIONS • ${categoryName.toUpperCase()}`;
  }

  public formatProductBadge(rawBadge?: string): string {
    if (!rawBadge) return "FRESH HARVEST";
    return `🌿 ${rawBadge.toUpperCase()}`;
  }

  public getManifestoPillars(): TrustManifestoItem[] {
    return [
      {
        index: "01",
        category: "PURITY",
        title: "100% Certified Organic",
        description: "Zero synthetic pesticides, artificial flavorings, or preservatives. Fully traceable to single micro-lots."
      },
      {
        index: "02",
        category: "EXPERIENCE",
        title: "Freshness Verification",
        description: "Check roast dates and vacuum hermetic seal upon courier arrival before cash handover.",
        highlight: true
      },
      {
        index: "03",
        category: "ROAST & PACK",
        title: "48-Hour Fresh Dispatch",
        description: "Small-batch drum roasted and estate bottled to order, ensuring peak terpene and flavor vibrancy."
      },
      {
        index: "04",
        category: "ECOLOGY",
        title: "Zero Landfill Packaging",
        description: "100% plant-fiber certified home-compostable pouches and infinitely recyclable amber UV glass."
      }
    ];
  }

  public getDesignPhilosophy(): DesignPhilosophy {
    return {
      ethos: "Reconnecting human nourishment with regenerative soil biodiversity, fair farm-gate pricing, and transparent batch harvests.",
      typography: "Warm, unpretentious grotesque sans with legible micro-lot origin stamps.",
      materialsFocus: "Unbleached kraft paper, water-based plant inks, and UV-filtering dark amber glass vessels.",
      curationQuote: "We source only from grower cooperatives who steward living soil and harvest in harmony with natural seasonal rhythms."
    };
  }
}

