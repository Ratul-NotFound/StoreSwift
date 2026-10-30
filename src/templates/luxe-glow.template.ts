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
    borderRadius: "rounded-2xl",
    heroStyle: "luminous",
    cardElevation: "shadow-card hover:shadow-xl",
    badgeStyle: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20 text-[10px] font-semibold"
  };

  readonly classes: StoreTemplateClasses = {
    pageBg: "bg-[#faf7f5] text-zinc-900 selection:bg-rose-500 selection:text-white",
    headerBg: "bg-[#faf7f5]/85 backdrop-blur-md border-b border-rose-100/80 text-zinc-900",
    navPillBg: "bg-[#faf7f5]/90 border-b border-rose-100/60",
    toolbarBg: "bg-white/80 backdrop-blur-sm border-rose-100/80 shadow-subtle",
    lookbookBg: "bg-rose-50/50 border-y border-rose-100 text-zinc-900",
    heroSection: "bg-gradient-to-b from-rose-50/60 via-[#faf7f5] to-[#faf7f5] border-b border-rose-100/60 text-zinc-900",
    heroBadge: "bg-rose-500 text-white border-rose-400 shadow-rose-500/20",
    heroTitle: "text-zinc-900 font-extrabold tracking-tight",
    heroSubtitle: "text-zinc-600",
    editorialTag: "font-mono text-[10px] tracking-[0.2em] uppercase text-rose-500 font-bold",
    productCard: "bg-white border-rose-100/80 hover:border-rose-300 transition-all duration-300 hover:shadow-card",
    productCardImg: "rounded-xl",
    primaryButton: "bg-rose-600 hover:bg-rose-700 text-white shadow-sm font-semibold hover:shadow-rose-600/20",
    secondaryButton: "bg-white border-rose-200 hover:bg-rose-50/80 text-zinc-800 font-medium",
    pillActive: "bg-rose-600 text-white shadow-sm ring-1 ring-rose-600",
    pillInactive: "bg-rose-50 hover:bg-rose-100/80 text-rose-900",
    accentText: "text-rose-600",
    announcementBar: "bg-rose-950 text-rose-200 border-b border-rose-900",
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
    return "CLINICAL BOTANICAL PROTOCOLS // 2026";
  }

  public getBrandSignature(): string {
    return "Clean Formulations • Hypoallergenic, Vegan & Cruelty-Free Verified";
  }

  public override getAnnouncementHighlights(): AnnouncementHighlights {
    return {
      leading: "🌸 Free Botanical Deluxe Mini On $45+ Orders",
      center: "✨ DERMATOLOGIST FORMULATED • DOORSTEP INSPECTION BEFORE PAYMENT",
      trailing: "🧪 100% Non-Toxic Clean Ingredients"
    };
  }

  public formatHeroBadge(categoryName: string): string {
    return `DERMATOLOGIST CLINICALLY FORMULATED // ${categoryName.toUpperCase()}`;
  }

  public formatProductBadge(rawBadge?: string): string {
    if (!rawBadge) return "CLEAN FORMULA";
    return `✨ ${rawBadge.toUpperCase()}`;
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
