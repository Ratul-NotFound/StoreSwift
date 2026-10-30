import { AbstractStoreTemplate } from "./base.template";
import {
  StoreTemplateId,
  StoreTemplateVibe,
  StoreTemplateClasses,
  TrustManifestoItem,
  DesignPhilosophy
} from "./types";

export class LuxeGlowTemplate extends AbstractStoreTemplate {
  readonly id: StoreTemplateId = "glow";
  readonly name = "Luxe Glow & Editorial";
  readonly tagline = "Soft pastel gradients, blurred surfaces, and delicate curves.";
  readonly categoryFit = "Cosmetics, Skincare, Beauty & Wellness";
  readonly description = "Inspired by Glossier & Sephora: Ethereal blush tones, soft glass cards, rounded pills, and clean beauty badges.";
  readonly badge = "Beauty & Wellness";
  readonly previewBg = "from-rose-500 via-pink-600 to-rose-700";
  readonly primaryColor = "#be123c";
  readonly accentColor = "#f43f5e";

  readonly vibe: StoreTemplateVibe = {
    fontDisplay: "font-sans tracking-tight",
    borderRadius: "rounded-3xl",
    heroStyle: "luminous",
    cardElevation: "shadow-subtle hover:shadow-card hover:shadow-rose-100/50",
    badgeStyle: "bg-rose-100 text-rose-800 text-[10px] font-bold border border-rose-200"
  };

  readonly classes: StoreTemplateClasses = {
    pageBg: "bg-[#fdfafb] text-zinc-900 selection:bg-rose-500 selection:text-white",
    headerBg: "bg-white/80 backdrop-blur-md border-b border-rose-100/90 text-zinc-900",
    navPillBg: "bg-white/90 border-b border-rose-100/60",
    toolbarBg: "bg-white/90 backdrop-blur-sm border-rose-100",
    lookbookBg: "bg-gradient-to-b from-rose-50/50 via-white to-pink-50/40 border-y border-rose-100 text-zinc-900",
    heroSection: "bg-gradient-to-b from-rose-50/80 via-white to-pink-50/30 border-b border-rose-100 text-zinc-900",
    heroBadge: "bg-rose-100 text-rose-800 border-rose-200/80 shadow-sm",
    heroTitle: "text-zinc-900 font-extrabold tracking-tight",
    heroSubtitle: "text-zinc-600",
    editorialTag: "text-[11px] font-semibold tracking-wider text-rose-500 uppercase",
    productCard: "bg-white/90 backdrop-blur-sm border-rose-100 hover:border-rose-300 transition-all duration-300 shadow-sm",
    productCardImg: "rounded-2xl",
    primaryButton: "bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-200 font-bold",
    secondaryButton: "bg-rose-50 border-rose-200 hover:bg-rose-100 text-rose-900 font-semibold",
    pillActive: "bg-rose-600 text-white shadow-sm ring-1 ring-rose-600",
    pillInactive: "bg-rose-50/80 hover:bg-rose-100 text-rose-900 border border-rose-100",
    accentText: "text-rose-600",
    announcementBar: "bg-rose-950 text-rose-200 border-b border-rose-900",
    featureCard: "bg-rose-50/50 border-rose-100",
    spotlightBanner: "bg-gradient-to-r from-rose-900 via-pink-900 to-rose-950 text-white border-rose-800"
  };

  public getHeroLayoutType(): "ethereal" {
    return "ethereal";
  }

  public getProductCardAspect(): string {
    return "aspect-[4/5]";
  }

  public formatHeroBadge(categoryName: string): string {
    return `✨ ${categoryName} • CLEAN BEAUTY PROTOCOL`;
  }

  public formatProductBadge(rawBadge?: string): string {
    if (!rawBadge) return "Clean Beauty";
    return `✨ ${rawBadge}`;
  }

  public getManifestoPillars(): TrustManifestoItem[] {
    return [
      {
        index: "01",
        category: "CLEAN PROTOCOL",
        title: "100% Cruelty-Free & Vegan",
        description: "Clinically validated actives, dermatologist formulated, and certified paraben-free."
      },
      {
        index: "02",
        category: "PURCHASE SAFETY",
        title: "Doorstep Inspection (COD)",
        description: "Open the protective hygiene seal and check batch lot numbers before paying cash.",
        highlight: true
      },
      {
        index: "03",
        category: "FRESHNESS",
        title: "Cold-Vault Dispatch",
        description: "Small fresh batches stored in temperature-controlled facilities and express shipped."
      },
      {
        index: "04",
        category: "SATISFACTION",
        title: "14-Day Skin Guarantee",
        description: "Love the formulation texture or exchange for another item in our wellness catalog."
      }
    ];
  }

  public getDesignPhilosophy(): DesignPhilosophy {
    return {
      ethos: "Gentle efficacy, skin-first transparency, and ethereal sensory luxury without harsh additives.",
      typography: "Delicate editorial humanistic sans with soft fluid margins and glowing badge halos.",
      materialsFocus: "Cold-pressed plant lipids, triple-molecular hyaluronic acid, and glass recyclable bottles.",
      curationQuote: "Beauty formulated to honor your skin's natural barrier and illuminate everyday rituals."
    };
  }
}

