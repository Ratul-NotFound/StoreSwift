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
    cardElevation: "shadow-2xl border border-amber-500/20",
    badgeStyle: "bg-amber-950/80 text-amber-200 border border-amber-800/80 text-[10px] tracking-widest font-mono uppercase"
  };

  readonly classes: StoreTemplateClasses = {
    pageBg: "bg-[#0c0d10] text-zinc-100 selection:bg-amber-500 selection:text-black",
    headerBg: "bg-[#0c0d10]/90 backdrop-blur-md border-b border-amber-900/30 text-zinc-100",
    navPillBg: "bg-[#0c0d10]/95 border-b border-amber-900/20",
    toolbarBg: "bg-zinc-900/80 border-amber-900/30 shadow-2xl",
    lookbookBg: "bg-[#101217] border-y border-amber-900/30 text-zinc-100",
    heroSection: "bg-[#0c0d10] border-b border-amber-900/30 text-zinc-100",
    heroBadge: "bg-amber-950/90 text-amber-300 border-amber-700/60 shadow-amber-500/10",
    heroTitle: "text-amber-100 font-serif font-bold tracking-tight",
    heroSubtitle: "text-zinc-400",
    editorialTag: "font-mono text-[10px] tracking-[0.3em] uppercase text-amber-400 font-medium",
    productCard: "bg-zinc-900/70 border-amber-900/30 hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl",
    productCardImg: "rounded-lg",
    primaryButton: "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold shadow-amber-500/20",
    secondaryButton: "bg-zinc-900/90 border border-amber-700/50 hover:bg-zinc-800 text-amber-200 font-medium",
    pillActive: "bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold shadow-sm ring-1 ring-amber-400",
    pillInactive: "bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800",
    accentText: "text-amber-400",
    announcementBar: "bg-black text-amber-300 border-b border-amber-950",
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
    return "HAUTE JOAILLERIE & HEIRLOOM TIMEPIECES // 2026";
  }

  public getBrandSignature(): string {
    return "Solid 18K Heavy Vermeil • GIA Certified Conflict-Free Stones & Swiss Calibers";
  }

  public override getAnnouncementHighlights(): AnnouncementHighlights {
    return {
      leading: "💎 Armored Discreet Courier Dispatch",
      center: "✨ SOLID 18K GOLD & CERTIFIED STONES • VERIFY HALLMARK PRIOR TO PAYMENT",
      trailing: "📜 Lifetime Precision Calibration & Service"
    };
  }

  public formatHeroBadge(categoryName: string): string {
    return `MAISON HAUTE JOAILLERIE // ${categoryName.toUpperCase()} ARCHIVE`;
  }

  public formatProductBadge(rawBadge?: string): string {
    if (!rawBadge) return "18K CERTIFIED";
    return `◆ ${rawBadge.toUpperCase()} ◆`;
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

