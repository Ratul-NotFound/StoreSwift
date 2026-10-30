import { AbstractStoreTemplate } from "./base.template";
import {
  StoreTemplateId,
  StoreTemplateVibe,
  StoreTemplateClasses,
  TrustManifestoItem,
  DesignPhilosophy,
  AnnouncementHighlights
} from "./types";

export class MinimalAtelierTemplate extends AbstractStoreTemplate {
  readonly id: StoreTemplateId = "minimal";
  readonly name = "Minimalist Atelier";
  readonly tagline = "High fashion, clean architectural lines, and timeless monochrome.";
  readonly categoryFit = "Fashion, Streetwear & Modern Apparel";
  readonly description = "Inspired by Acne Studios & SSENSE: Ultra-clean typography, bold black/white contrast, and hairline borders.";
  readonly badge = "High Fashion";
  readonly previewBg = "from-zinc-950 via-zinc-900 to-zinc-950";
  readonly primaryColor = "#18181b";
  readonly accentColor = "#2563eb";

  readonly vibe: StoreTemplateVibe = {
    fontDisplay: "font-sans tracking-tight",
    borderRadius: "rounded-xl",
    heroStyle: "split",
    cardElevation: "shadow-none hover:shadow-subtle",
    badgeStyle: "bg-zinc-100 text-zinc-900 text-[10px] font-medium tracking-wider uppercase border border-zinc-200"
  };

  readonly classes: StoreTemplateClasses = {
    pageBg: "bg-white text-zinc-900 selection:bg-zinc-900 selection:text-white",
    headerBg: "bg-white/80 backdrop-blur-md border-b border-zinc-200/80 text-zinc-900",
    navPillBg: "bg-white/90 backdrop-blur-md border-b border-zinc-200/60",
    toolbarBg: "bg-zinc-50/80 backdrop-blur-sm border border-zinc-200/80",
    lookbookBg: "bg-zinc-50 border-y border-zinc-200/80 text-zinc-900",
    heroSection: "bg-white border-b border-zinc-200/80 text-zinc-900",
    heroBadge: "bg-zinc-100 text-zinc-800 border-zinc-200/90",
    heroTitle: "text-zinc-950 font-bold tracking-tight",
    heroSubtitle: "text-zinc-500 font-normal",
    editorialTag: "font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-400 font-medium",
    productCard: "bg-white border-zinc-200/80 hover:border-zinc-900/40 transition-all duration-300",
    productCardImg: "rounded-lg",
    primaryButton: "bg-zinc-900 hover:bg-zinc-800 text-white font-medium shadow-none",
    secondaryButton: "bg-transparent border border-zinc-200 hover:bg-zinc-50 text-zinc-900 font-medium",
    pillActive: "bg-zinc-900 text-white font-medium shadow-none",
    pillInactive: "bg-zinc-100 hover:bg-zinc-200/70 text-zinc-600 font-medium",
    accentText: "text-zinc-900",
    announcementBar: "bg-zinc-950 text-zinc-300 border-b border-zinc-900",
    featureCard: "bg-zinc-50 border-zinc-200/70",
    spotlightBanner: "bg-zinc-900 text-white border-zinc-800"
  };

  public getHeroLayoutType(): "architectural" {
    return "architectural";
  }

  public getProductCardAspect(): string {
    return "aspect-[3/4]";
  }

  public getCuratedCollectionTitle(): string {
    return "Curated Atelier Edit • 2026 Archive";
  }

  public getBrandSignature(): string {
    return "Atelier Verified • 280 GSM Combed Cotton & Kurabo Raw Selvedge";
  }

  public override getAnnouncementHighlights(): AnnouncementHighlights {
    return {
      leading: "48h Dispatch From Atelier",
      center: "Complimentary express delivery over $50 • Cash on delivery welcome",
      trailing: "Certified Organic Yarns"
    };
  }

  public formatHeroBadge(categoryName: string): string {
    return `Archive 2026 • ${categoryName}`;
  }

  public formatProductBadge(rawBadge?: string): string {
    return rawBadge || "Atelier Edition";
  }

  public getManifestoPillars(): TrustManifestoItem[] {
    return [
      {
        index: "01",
        category: "PROVENANCE",
        title: "Atelier Verified",
        description: "Certified organic yarns and precision tailored construction with zero counterfeit compromise."
      },
      {
        index: "02",
        category: "CHECKOUT",
        title: "Cash on Delivery",
        description: "Inspect drape, fit, and stitching at your doorstep before final tender.",
        highlight: true
      },
      {
        index: "03",
        category: "LOGISTICS",
        title: "48h Express Dispatch",
        description: "Priority garment handling with automated SMS courier tracking from fulfillment center."
      },
      {
        index: "04",
        category: "RETURNS",
        title: "Complimentary Size Swap",
        description: "7-day doorstep courier exchange with zero hassle for alternative sizing."
      }
    ];
  }

  public getDesignPhilosophy(): DesignPhilosophy {
    return {
      ethos: "Architectural minimalism where form honors textile integrity and zero superfluous ornamentation.",
      typography: "Geometric grotesque sans paired with monospaced catalog telemetry.",
      materialsFocus: "Heavyweight combed organic cotton, Japanese Kurabo selvedge, and bonded technical twill.",
      curationQuote: "Each garment is cut for architectural presence, structural longevity, and everyday poise."
    };
  }
}
