import { AbstractStoreTemplate } from "./base.template";
import {
  StoreTemplateId,
  StoreTemplateVibe,
  StoreTemplateClasses,
  TrustManifestoItem,
  DesignPhilosophy,
  AnnouncementHighlights
} from "./types";

export class LuxeGlowTemplate extends AbstractStoreTemplate {
  readonly id: StoreTemplateId = "glow";
  readonly name = "Luxe Glow Lab";
  readonly tagline = "Clean beauty rituals, luminous glass skin, and clinically verified botanicals.";
  readonly categoryFit = "Skincare, Clean Cosmetics & Wellness";
  readonly description = "Inspired by Glossier & Sephora: Soft ethereal pastels, frosted glass micro-shadows, and certified organic badges.";
  readonly badge = "Clean Beauty";
  readonly previewBg = "from-rose-900 via-pink-900 to-rose-950";
  readonly primaryColor = "#be185d";
  readonly accentColor = "#f43f5e";

  readonly vibe: StoreTemplateVibe = {
    fontDisplay: "font-sans tracking-tight",
    borderRadius: "rounded-xl",
    heroStyle: "luminous",
    cardElevation: "shadow-none hover:shadow-subtle",
    badgeStyle: "bg-rose-50 text-rose-800 text-[10px] font-medium tracking-wider uppercase border border-rose-200/80"
  };

  readonly classes: StoreTemplateClasses = {
    pageBg: "bg-[#faf8f6] text-zinc-900 selection:bg-rose-500 selection:text-white",
    headerBg: "bg-[#faf8f6]/80 backdrop-blur-md border-b border-rose-100/70 text-zinc-900",
    navPillBg: "bg-[#faf8f6]/90 backdrop-blur-md border-b border-rose-100/50",
    toolbarBg: "bg-white/70 backdrop-blur-sm border border-rose-100/60",
    lookbookBg: "bg-[#f5ede7] border-y border-rose-100/60 text-zinc-900",
    heroSection: "bg-[#faf8f6] border-b border-rose-100/60 text-zinc-900",
    heroBadge: "bg-rose-50 text-rose-700 border-rose-200/80",
    heroTitle: "text-zinc-900 font-bold tracking-tight",
    heroSubtitle: "text-zinc-600 font-normal",
    editorialTag: "font-mono text-[10px] tracking-[0.2em] uppercase text-rose-600 font-medium",
    productCard: "bg-white border-rose-100/70 hover:border-rose-300/80 transition-all duration-300",
    productCardImg: "rounded-lg",
    primaryButton: "bg-rose-600 hover:bg-rose-700 text-white font-medium shadow-none",
    secondaryButton: "bg-white border border-rose-200/80 hover:bg-rose-50/60 text-zinc-800 font-medium",
    pillActive: "bg-rose-600 text-white font-medium",
    pillInactive: "bg-rose-50/80 hover:bg-rose-100/70 text-rose-800 font-medium",
    accentText: "text-rose-600",
    announcementBar: "bg-[#1c0f13] text-rose-200 border-b border-rose-950",
    featureCard: "bg-white/70 border-rose-100",
    spotlightBanner: "bg-gradient-to-r from-rose-900 to-pink-900 text-white border-rose-800"
  };

  public getHeroLayoutType(): "ethereal" {
    return "ethereal";
  }

  public getProductCardAspect(): string {
    return "aspect-square";
  }

  public getCuratedCollectionTitle(): string {
    return "Clinical Botanical Protocols • 2026 Collection";
  }

  public getBrandSignature(): string {
    return "Clean Formulations • Hypoallergenic, Vegan & Cruelty-Free Verified";
  }

  public override getAnnouncementHighlights(): AnnouncementHighlights {
    return {
      leading: "Botanical Deluxe Mini with $45+ Orders",
      center: "Dermatologist formulated • Doorstep parcel inspection prior to payment",
      trailing: "Clean Ingredients"
    };
  }

  public formatHeroBadge(categoryName: string): string {
    return `Clinical Botanical Formula • ${categoryName}`;
  }

  public formatProductBadge(rawBadge?: string): string {
    return rawBadge || "Clean Protocol";
  }

  public getManifestoPillars(): TrustManifestoItem[] {
    return [
      {
        index: "01",
        category: "FORMULATION",
        title: "Clinical & Non-Toxic",
        description: "100% cruelty-free, vegan certified, and free from parabens, sulfates, and synthetic silicones."
      },
      {
        index: "02",
        category: "DELIVERY",
        title: "Inspect at Doorstep",
        description: "Verify protective safety seals and batch freshness prior to handing cash to the courier.",
        highlight: true
      },
      {
        index: "03",
        category: "INTEGRITY",
        title: "Cold-Chain Freshness",
        description: "Stored in temperature-stabilized dark rooms to protect antioxidant and peptide bio-potency."
      },
      {
        index: "04",
        category: "GUARANTEE",
        title: "14-Day Glow Guarantee",
        description: "Experience visible epidermal hydration or receive an unconditional exchange credit."
      }
    ];
  }

  public getDesignPhilosophy(): DesignPhilosophy {
    return {
      ethos: "Luminous minimalism emphasizing skin barrier vitality, organic peptides, and ritual calm.",
      typography: "Subtle grotesque sans with generous tracking and soft editorial contrast.",
      materialsFocus: "Frosted recyclable glass flacons, sugarcane bio-resins, and cold-pressed botanical oils.",
      curationQuote: "Formulated to accentuate natural cellular radiance with zero heavy pore-clogging fillers."
    };
  }
}
