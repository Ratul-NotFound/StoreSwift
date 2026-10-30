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
    cardElevation: "shadow-subtle hover:shadow-card",
    badgeStyle: "bg-amber-900/10 text-amber-900 dark:text-amber-300 border border-amber-800/20 text-[10px] uppercase font-bold"
  };

  readonly classes: StoreTemplateClasses = {
    pageBg: "bg-[#fcfaf7] text-stone-900 selection:bg-amber-800 selection:text-white",
    headerBg: "bg-[#fcfaf7]/90 backdrop-blur-md border-b border-stone-200/80 text-stone-900",
    navPillBg: "bg-[#fcfaf7]/95 border-b border-stone-200/70",
    toolbarBg: "bg-white border-stone-200 shadow-subtle",
    lookbookBg: "bg-[#f4efe9] border-y border-stone-200 text-stone-900",
    heroSection: "bg-[#fcfaf7] border-b border-stone-200/80 text-stone-900",
    heroBadge: "bg-amber-900 text-amber-100 border-amber-800 shadow-sm",
    heroTitle: "text-stone-900 font-bold tracking-tight font-serif",
    heroSubtitle: "text-stone-600",
    editorialTag: "font-mono text-[10px] tracking-[0.2em] uppercase text-amber-800 font-bold",
    productCard: "bg-white border-stone-200 hover:border-amber-800/50 transition-all duration-300 hover:shadow-card",
    productCardImg: "rounded-lg",
    primaryButton: "bg-amber-900 hover:bg-amber-800 text-amber-50 shadow-sm font-semibold",
    secondaryButton: "bg-white border-stone-300 hover:bg-stone-50 text-stone-800 font-medium",
    pillActive: "bg-amber-900 text-amber-50 shadow-sm ring-1 ring-amber-900",
    pillInactive: "bg-stone-100 hover:bg-stone-200 text-stone-700",
    accentText: "text-amber-900",
    announcementBar: "bg-stone-900 text-amber-200 border-b border-stone-800",
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
    return "BENCH-CRAFTED LEATHERWORKS // 2026";
  }

  public getBrandSignature(): string {
    return "Goodyear Storm Welt • Horween Chromexcel Leather & Vibram Lug Soles";
  }

  public override getAnnouncementHighlights(): AnnouncementHighlights {
    return {
      leading: "🔨 Master Hand-Lasted Benchcraft",
      center: "📦 COMPLIMENTARY SHIPPING ON BENCH-BUILDS • TRY BEFORE YOU PAY COD",
      trailing: "🛡️ Lifetime Resoling & Craft Service"
    };
  }

  public formatHeroBadge(categoryName: string): string {
    return `MASTER BENCH CRAFT • ${categoryName.toUpperCase()} EDITIONS`;
  }

  public formatProductBadge(rawBadge?: string): string {
    if (!rawBadge) return "BENCH CRAFT";
    return `★ ${rawBadge.toUpperCase()} ★`;
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
