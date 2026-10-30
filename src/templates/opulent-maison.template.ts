import { AbstractStoreTemplate } from "./base.template";
import {
  StoreTemplateId,
  StoreTemplateVibe,
  StoreTemplateClasses,
  TrustManifestoItem,
  DesignPhilosophy,
  AnnouncementHighlights
} from "./types";

export class OpulentMaisonTemplate extends AbstractStoreTemplate {
  readonly id: StoreTemplateId = "maison";
  readonly name = "Maison Fine Horology & Jewelry";
  readonly tagline = "Swiss automatic movements, certified heirloom stones, and solid 18k gold.";
  readonly categoryFit = "Fine Jewelry, Luxury Watches & Precious Gems";
  readonly description = "Inspired by Cartier & Tiffany: Deep midnight obsidian canvas, polished champagne gold serifs, and GIA gemological certificates.";
  readonly badge = "Haute Horology";
  readonly previewBg = "from-amber-950 via-zinc-950 to-neutral-950";
  readonly primaryColor = "#d4af37";
  readonly accentColor = "#f59e0b";

  readonly vibe: StoreTemplateVibe = {
    fontDisplay: "font-serif tracking-normal",
    borderRadius: "rounded-xl",
    heroStyle: "opulent",
    cardElevation: "shadow-none hover:shadow-subtle",
    badgeStyle: "bg-amber-950/50 text-amber-300 text-[10px] font-mono tracking-wider uppercase border border-amber-800/40"
  };

  readonly classes: StoreTemplateClasses = {
    pageBg: "bg-[#0b0c0e] text-zinc-100 selection:bg-amber-500 selection:text-black",
    headerBg: "bg-[#0b0c0e]/85 backdrop-blur-md border-b border-neutral-800/80 text-zinc-100",
    navPillBg: "bg-[#0b0c0e]/90 backdrop-blur-md border-b border-neutral-800/60",
    toolbarBg: "bg-[#121317]/80 backdrop-blur-sm border border-neutral-800/70",
    lookbookBg: "bg-[#101115] border-y border-neutral-800/70 text-zinc-100",
    heroSection: "bg-[#0b0c0e] border-b border-neutral-800/70 text-zinc-100",
    heroBadge: "bg-amber-950/50 text-amber-300 border-amber-800/40",
    heroTitle: "text-neutral-100 font-serif font-bold tracking-tight",
    heroSubtitle: "text-zinc-400 font-normal",
    editorialTag: "font-mono text-[10px] tracking-[0.2em] uppercase text-amber-400/90 font-medium",
    productCard: "bg-[#121317] border-neutral-800/70 hover:border-amber-500/30 transition-all duration-300",
    productCardImg: "rounded-lg",
    primaryButton: "bg-amber-500 hover:bg-amber-400 text-black font-semibold shadow-none",
    secondaryButton: "bg-[#17181f] border border-neutral-700/70 hover:bg-[#1e2029] text-amber-200/90 font-medium",
    pillActive: "bg-amber-500 text-black font-semibold",
    pillInactive: "bg-neutral-900 hover:bg-neutral-800 text-zinc-400 border border-neutral-800/60 font-medium",
    accentText: "text-amber-400",
    announcementBar: "bg-black text-amber-300/90 border-b border-neutral-900",
    featureCard: "bg-zinc-900/50 border-amber-900/20",
    spotlightBanner: "bg-gradient-to-r from-neutral-950 via-amber-950/40 to-black text-white border-amber-900/40"
  };

  public getHeroLayoutType(): "opulent" {
    return "opulent";
  }

  public getProductCardAspect(): string {
    return "aspect-square";
  }

  public getCuratedCollectionTitle(): string {
    return "Haute Horology & Heirloom Jewels • 2026 Archive";
  }

  public getBrandSignature(): string {
    return "Solid 18K Heavy Vermeil • GIA Certified Conflict-Free Stones & Swiss Calibers";
  }

  public override getAnnouncementHighlights(): AnnouncementHighlights {
    return {
      leading: "Armored Courier Handover",
      center: "Solid 18k gold & certified stones • Inspect hallmarks prior to payment",
      trailing: "Lifetime Care & Service"
    };
  }

  public formatHeroBadge(categoryName: string): string {
    return `Fine Horology & High Jewelry • ${categoryName}`;
  }

  public formatProductBadge(rawBadge?: string): string {
    return rawBadge || "Solid 18K Gold";
  }

  public getManifestoPillars(): TrustManifestoItem[] {
    return [
      {
        index: "01",
        category: "AUTHENTICITY",
        title: "GIA & Hallmark Certified",
        description: "Laser-inscribed serials on all gemstones and official Assay Office hallmarks on solid 18k and 925 metals."
      },
      {
        index: "02",
        category: "TRANSACTION",
        title: "Cash Upon Appraisal",
        description: "Examine loupe clarity, hallmarks, and mechanical escapement in person before handing cash to the courier.",
        highlight: true
      },
      {
        index: "03",
        category: "LOGISTICS",
        title: "Armored Discreet Transit",
        description: "Non-descript high-security sealed parcels with direct signature verification upon doorstep handover."
      },
      {
        index: "04",
        category: "STEWARDSHIP",
        title: "Lifetime Complimentary Care",
        description: "Complimentary annual ultrasonic cleaning, prong tightening, and horological timing regulation."
      }
    ];
  }

  public getDesignPhilosophy(): DesignPhilosophy {
    return {
      ethos: "Heirloom permanence where precious metallurgy, lapidary geometry, and Swiss chronometry transcend ephemeral trends.",
      typography: "Classic haute couture serif headings paired with clean Swiss grotesque numerals.",
      materialsFocus: "Recycled solid 18k yellow & white gold, ethical D-color lab diamonds, and anti-reflective domed sapphire crystals.",
      curationQuote: "Each creation is engineered to outlive generations, preserving intrinsic worth and emotional devotion."
    };
  }
}
