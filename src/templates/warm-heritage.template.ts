import { AbstractStoreTemplate } from "./base.template";
import {
  StoreTemplateId,
  StoreTemplateVibe,
  StoreTemplateClasses,
  TrustManifestoItem,
  DesignPhilosophy,
  AnnouncementHighlights
} from "./types";

export class WarmHeritageTemplate extends AbstractStoreTemplate {
  readonly id: StoreTemplateId = "artisan";
  readonly name = "Heritage Leathercraft";
  readonly tagline = "Hand-lasted boots, Goodyear welts, and full-grain Horween pull-up leather.";
  readonly categoryFit = "Footwear, Boots & Handcrafted Goods";
  readonly description = "Inspired by Red Wing & Filson: Warm oat linen canvas, rich saddle tan leathers, brass hardware, and workshop wax seals.";
  readonly badge = "Master Benchcraft";
  readonly previewBg = "from-amber-900 via-stone-900 to-amber-950";
  readonly primaryColor = "#b45309";
  readonly accentColor = "#d97706";

  readonly vibe: StoreTemplateVibe = {
    fontDisplay: "font-serif tracking-normal",
    borderRadius: "rounded-xl",
    heroStyle: "heritage",
    cardElevation: "shadow-none hover:shadow-subtle",
    badgeStyle: "bg-amber-100 text-amber-900 text-[10px] font-medium tracking-wider uppercase border border-amber-300/60"
  };

  readonly classes: StoreTemplateClasses = {
    pageBg: "bg-[#faf7f2] text-stone-900 selection:bg-amber-900 selection:text-white",
    headerBg: "bg-[#faf7f2]/85 backdrop-blur-md border-b border-stone-200/80 text-stone-900",
    navPillBg: "bg-[#faf7f2]/90 backdrop-blur-md border-b border-stone-200/60",
    toolbarBg: "bg-white/80 backdrop-blur-sm border border-stone-200/70",
    lookbookBg: "bg-[#f3ede3] border-y border-stone-200/70 text-stone-900",
    heroSection: "bg-[#faf7f2] border-b border-stone-200/70 text-stone-900",
    heroBadge: "bg-amber-100 text-amber-900 border-amber-300/60",
    heroTitle: "text-stone-900 font-serif font-bold tracking-tight",
    heroSubtitle: "text-stone-600 font-normal",
    editorialTag: "font-mono text-[10px] tracking-[0.2em] uppercase text-amber-900 font-medium",
    productCard: "bg-white border-stone-200/80 hover:border-amber-800/40 transition-all duration-300",
    productCardImg: "rounded-lg",
    primaryButton: "bg-stone-900 hover:bg-stone-800 text-stone-50 font-medium shadow-none",
    secondaryButton: "bg-white border border-stone-300/80 hover:bg-stone-50 text-stone-800 font-medium",
    pillActive: "bg-stone-900 text-stone-50 font-medium",
    pillInactive: "bg-stone-100 hover:bg-stone-200/70 text-stone-700 font-medium",
    accentText: "text-amber-900",
    announcementBar: "bg-[#1c1917] text-stone-300 border-b border-stone-800",
    featureCard: "bg-[#f7f2eb] border-stone-200",
    spotlightBanner: "bg-stone-900 text-amber-100 border-stone-800"
  };

  public getHeroLayoutType(): "heritage" {
    return "heritage";
  }

  public getProductCardAspect(): string {
    return "aspect-[4/3]";
  }

  public getCuratedCollectionTitle(): string {
    return "Bench-Crafted Leatherworks • 2026 Archive";
  }

  public getBrandSignature(): string {
    return "Goodyear Storm Welt • Horween Chromexcel Leather & Vibram Lug Soles";
  }

  public override getAnnouncementHighlights(): AnnouncementHighlights {
    return {
      leading: "Master Hand-Lasted Benchcraft",
      center: "Complimentary shipping on handcrafted builds • Try before you pay COD",
      trailing: "Lifetime Resoling Guarantee"
    };
  }

  public formatHeroBadge(categoryName: string): string {
    return `Bench-Crafted Heritage • ${categoryName}`;
  }

  public formatProductBadge(rawBadge?: string): string {
    return rawBadge || "Bench Crafted";
  }

  public getManifestoPillars(): TrustManifestoItem[] {
    return [
      {
        index: "01",
        category: "CONSTRUCTION",
        title: "Master Bench Lasted",
        description: "360-degree storm welted with resoleable Vibram outsoles and thick vegetable-tanned leather insoles."
      },
      {
        index: "02",
        category: "DELIVERY",
        title: "Try Before You Pay",
        description: "Lace up and step on carpet to test width, heel-lock, and arch support before completing courier cash payment.",
        highlight: true
      },
      {
        index: "03",
        category: "LOGISTICS",
        title: "Conditioned & Insured",
        description: "Treated with natural pine-pitch beeswax conditioner prior to moisture-sealed wooden packaging."
      },
      {
        index: "04",
        category: "LONGEVITY",
        title: "Lifetime Resoling Service",
        description: "Built for decades of hard wear. Send back to the atelier anytime for factory recrafting and new lugs."
      }
    ];
  }

  public getDesignPhilosophy(): DesignPhilosophy {
    return {
      ethos: "Honoring traditional guild shoe-making, vegetable-tanned grain pull-up, and repairable longevity over disposable cycles.",
      typography: "Subtle humanist book serif balanced with clear geometric pricing numerals.",
      materialsFocus: "Horween Chromexcel full-grain, British Goodyear welting thread, and solid antique brass eyelets.",
      curationQuote: "Each pair molds to the wearer's anatomy, deepening in character and patina with every mile traveled."
    };
  }
}
