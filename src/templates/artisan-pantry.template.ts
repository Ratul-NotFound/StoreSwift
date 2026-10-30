import { AbstractStoreTemplate } from "./base.template";
import {
  StoreTemplateId,
  StoreTemplateVibe,
  StoreTemplateClasses,
  TrustManifestoItem,
  DesignPhilosophy,
  AnnouncementHighlights,
  CategoryPsychology,
  ProductTabLabels,
  TrustGuarantee
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
    borderRadius: "rounded-xl",
    heroStyle: "organic",
    cardElevation: "shadow-none hover:shadow-subtle",
    badgeStyle: "bg-emerald-50 text-emerald-800 text-[10px] font-mono tracking-wider uppercase border border-emerald-200/80"
  };

  readonly classes: StoreTemplateClasses = {
    pageBg: "bg-[#f8f9f5] text-stone-900 selection:bg-emerald-800 selection:text-white",
    headerBg: "bg-[#f8f9f5]/85 backdrop-blur-md border-b border-stone-200/80 text-stone-900",
    navPillBg: "bg-[#f8f9f5]/90 backdrop-blur-md border-b border-stone-200/60",
    toolbarBg: "bg-white/80 backdrop-blur-sm border border-stone-200/70",
    lookbookBg: "bg-[#eff2ea] border-y border-stone-200/70 text-stone-900",
    heroSection: "bg-[#f8f9f5] border-b border-stone-200/70 text-stone-900",
    heroBadge: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
    heroTitle: "text-stone-900 font-bold tracking-tight",
    heroSubtitle: "text-stone-600 font-normal",
    editorialTag: "font-mono text-[10px] tracking-[0.2em] uppercase text-emerald-800 font-medium",
    productCard: "bg-white border-stone-200/80 hover:border-emerald-800/30 transition-all duration-300",
    productCardImg: "rounded-lg",
    primaryButton: "bg-emerald-900 hover:bg-emerald-800 text-emerald-50 font-medium shadow-none",
    secondaryButton: "bg-white border border-stone-300/80 hover:bg-stone-50 text-stone-800 font-medium",
    pillActive: "bg-emerald-900 text-emerald-50 font-medium",
    pillInactive: "bg-stone-100 hover:bg-stone-200/70 text-stone-700 font-medium",
    accentText: "text-emerald-800",
    announcementBar: "bg-[#111c16] text-emerald-200 border-b border-emerald-950",
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
    return "Regenerative Farmstead Provisions • 2026 Archive";
  }

  public getBrandSignature(): string {
    return "100% Certified Organic • Single-Origin Micro-Lots & Home Compostable Bags";
  }

  public getCategoryPsychology(): CategoryPsychology {
    return {
      primaryBuyerFear: "Stale oxidation, unverified pesticide claims, and artificial bulk adulteration.",
      reassurancePledge: "Micro-lot drum roasted within 48h of dispatch with single-origin farmgate traceability and aroma doorstep check.",
      doorstepChecklist: [
        "Verify the stamped micro-lot drum roast or estate harvest timestamp",
        "Inspect the vacuum one-way degassing valve and hermetic pouch seal",
        "Confirm direct-trade cooperative origin certificate printed on reverse"
      ],
      keySpecHighlight: "100% Certified Organic • Single-Origin • Freshly Roasted Within 48h"
    };
  }

  public getProductTabLabels(): ProductTabLabels {
    return {
      desc: "Single-Origin & Harvest Terroir",
      shipping: "Roast Batch Dispatch & Aroma Check",
      reviews: "Cupping Notes & Kitchen Reviews (48)"
    };
  }

  public override getTrustGuarantees(): TrustGuarantee[] {
    return [
      {
        iconName: "CheckCircle2",
        title: "Single-Origin Drum Roasted",
        subtitle: "Small batches roasted within 48h of order dispatch"
      },
      {
        iconName: "ShieldCheck",
        title: "Aroma Valve Doorstep Check",
        subtitle: "Verify vacuum one-way valve & roast timestamp before tender"
      },
      {
        iconName: "RotateCcw",
        title: "Zero Landfill Packaging",
        subtitle: "100% plant-fiber compostable pouches & recyclable amber UV glass"
      }
    ];
  }

  public override getAnnouncementHighlights(): AnnouncementHighlights {
    return {
      leading: "Direct Regenerative Farm Sourcing",
      center: "Fresh micro-lot roasts • Doorstep aroma inspection before payment",
      trailing: "Compostable Packaging"
    };
  }

  public formatHeroBadge(categoryName: string): string {
    return `Regenerative Organic Farmstead • ${categoryName}`;
  }

  public formatProductBadge(rawBadge?: string): string {
    return rawBadge || "Fresh Harvest";
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
