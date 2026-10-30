import { AbstractStoreTemplate } from "./base.template";
import {
  StoreTemplateId,
  StoreTemplateVibe,
  StoreTemplateClasses,
  TrustManifestoItem,
  DesignPhilosophy
} from "./types";

export class WarmHeritageTemplate extends AbstractStoreTemplate {
  readonly id: StoreTemplateId = "artisan";
  readonly name = "Warm Heritage & Craft";
  readonly tagline = "Earthy terracotta tones, warm cream cards, and handcrafted charm.";
  readonly categoryFit = "Footwear, Leather Goods, Gourmet Food & Jewelry";
  readonly description = "Inspired by Red Wing & Aesop: Warm linen surfaces, artisan leather stamp badges, rich amber accents, and organic heritage.";
  readonly badge = "Master Crafted";
  readonly previewBg = "from-amber-950 via-stone-900 to-amber-950";
  readonly primaryColor = "#78350f";
  readonly accentColor = "#d97706";

  readonly vibe: StoreTemplateVibe = {
    fontDisplay: "font-serif tracking-tight",
    borderRadius: "rounded-2xl",
    heroStyle: "heritage",
    cardElevation: "shadow-subtle hover:shadow-card hover:shadow-amber-100/60",
    badgeStyle: "bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold"
  };

  readonly classes: StoreTemplateClasses = {
    pageBg: "bg-[#f8f5ee] text-[#2c221e] selection:bg-amber-900 selection:text-white",
    headerBg: "bg-[#fdfbf7]/90 backdrop-blur-md border-b border-amber-200/80 text-[#2c221e]",
    navPillBg: "bg-[#fcf9f2]/95 border-b border-amber-200/60",
    toolbarBg: "bg-[#fffdf9] border-amber-200/80",
    lookbookBg: "bg-[#f1ebe0] border-y border-amber-200 text-[#2c221e]",
    heroSection: "bg-[#fbf9f5] border-b border-amber-200/70 text-zinc-900",
    heroBadge: "bg-amber-100 text-amber-900 border-amber-300 shadow-sm",
    heroTitle: "text-amber-950 font-serif font-black tracking-tight",
    heroSubtitle: "text-stone-600",
    editorialTag: "font-serif italic text-xs tracking-wider text-amber-800",
    productCard: "bg-[#fffdf9] border-amber-200/80 hover:border-amber-600 transition-all duration-300 shadow-sm",
    productCardImg: "rounded-xl",
    primaryButton: "bg-amber-900 hover:bg-amber-950 text-white shadow-sm font-bold font-serif",
    secondaryButton: "bg-amber-50 border-amber-200 hover:bg-amber-100 text-amber-900 font-semibold",
    pillActive: "bg-amber-900 text-white shadow-sm ring-1 ring-amber-900",
    pillInactive: "bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/60",
    accentText: "text-amber-800",
    announcementBar: "bg-amber-950 text-amber-200 border-b border-amber-900",
    featureCard: "bg-[#f6f2ea] border-amber-200/60",
    spotlightBanner: "bg-amber-950 text-amber-100 border-amber-900"
  };

  public getHeroLayoutType(): "heritage" {
    return "heritage";
  }

  public getProductCardAspect(): string {
    return "aspect-[4/5]";
  }

  public formatHeroBadge(categoryName: string): string {
    return `HAND-CRAFTED // ${categoryName.toUpperCase()} // BATCH #26`;
  }

  public formatProductBadge(rawBadge?: string): string {
    if (!rawBadge) return "🏷️ Bench Crafted";
    return `🏷️ ${rawBadge}`;
  }

  public getManifestoPillars(): TrustManifestoItem[] {
    return [
      {
        index: "01",
        category: "HERITAGE BENCH",
        title: "Master Bench Craftsmanship",
        description: "Goodyear welted soles, full-grain vegetable-tanned leathers, and generational repairability."
      },
      {
        index: "02",
        category: "HAND-TO-HAND",
        title: "Cash on Delivery",
        description: "Feel the leather grain, tactile weight, and aroma in your hands before parting with cash.",
        highlight: true
      },
      {
        index: "03",
        category: "CARE PACKAGING",
        title: "Linen Dust Bag Included",
        description: "Hand-wrapped in unbleached organic cotton with botanical beeswax conditioning balm."
      },
      {
        index: "04",
        category: "LIFETIME REPAIR",
        title: "Recraftable Guarantee",
        description: "Constructed to be resoled and restored repeatedly across decades of character-rich wear."
      }
    ];
  }

  public getDesignPhilosophy(): DesignPhilosophy {
    return {
      ethos: "Honoring slow artisan methods, natural patina, and objects created to outlast seasonal trends.",
      typography: "Classic literary serif display paired with subtle warm monospaced hallmarks.",
      materialsFocus: "Vegetable-tanned harness leather, raw brass hardware, and organic raw clover honey.",
      curationQuote: "Each piece is formed by patient hands, destined to grow richer with age and honest daily wear."
    };
  }
}

