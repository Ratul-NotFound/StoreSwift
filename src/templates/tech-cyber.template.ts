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

export class TechCyberTemplate extends AbstractStoreTemplate {
  readonly id: StoreTemplateId = "bold";
  readonly name = "Precision Cybernetics";
  readonly tagline = "Aviation aluminum, mechanical tactile switches, and high-spec compute.";
  readonly categoryFit = "Consumer Electronics, Audio & Hardware Peripherals";
  readonly description = "Inspired by Apple Pro & Teenage Engineering: Matte obsidian canvas, electric cyan telemetry, and CAD spec typography.";
  readonly badge = "Pro Telemetry";
  readonly previewBg = "from-cyan-950 via-slate-900 to-black";
  readonly primaryColor = "#0284c7";
  readonly accentColor = "#38bdf8";

  readonly vibe: StoreTemplateVibe = {
    fontDisplay: "font-mono tracking-tight",
    borderRadius: "rounded-xl",
    heroStyle: "cyber",
    cardElevation: "shadow-none hover:shadow-subtle",
    badgeStyle: "bg-sky-950/60 text-sky-400 text-[10px] font-mono tracking-wider uppercase border border-sky-800/50"
  };

  readonly classes: StoreTemplateClasses = {
    pageBg: "bg-[#0c0d12] text-zinc-100 selection:bg-sky-500 selection:text-black",
    headerBg: "bg-[#0c0d12]/85 backdrop-blur-md border-b border-zinc-800/80 text-zinc-100",
    navPillBg: "bg-[#0c0d12]/90 backdrop-blur-md border-b border-zinc-800/60",
    toolbarBg: "bg-[#13151f]/80 backdrop-blur-sm border border-zinc-800/70",
    lookbookBg: "bg-[#10121a] border-y border-zinc-800/70 text-zinc-100",
    heroSection: "bg-[#0c0d12] border-b border-zinc-800/70 text-zinc-100",
    heroBadge: "bg-sky-950/60 text-sky-400 border-sky-800/50",
    heroTitle: "text-white font-bold tracking-tight",
    heroSubtitle: "text-zinc-400 font-normal",
    editorialTag: "font-mono text-[10px] tracking-[0.2em] uppercase text-sky-400 font-medium",
    productCard: "bg-[#13151f] border-zinc-800/70 hover:border-sky-500/40 transition-all duration-300",
    productCardImg: "rounded-lg",
    primaryButton: "bg-sky-500 hover:bg-sky-400 text-black font-medium shadow-none",
    secondaryButton: "bg-[#171926] border border-zinc-700/80 hover:bg-[#1e2030] text-zinc-200 font-medium",
    pillActive: "bg-sky-500 text-black font-medium",
    pillInactive: "bg-zinc-900/90 hover:bg-zinc-800 text-zinc-400 border border-zinc-800/60 font-medium",
    accentText: "text-sky-400",
    announcementBar: "bg-black text-sky-300 border-b border-zinc-900",
    featureCard: "bg-zinc-900/60 border-zinc-800",
    spotlightBanner: "bg-gradient-to-r from-zinc-950 via-sky-950/40 to-black text-white border-zinc-800"
  };

  public getHeroLayoutType(): "cyber" {
    return "cyber";
  }

  public getProductCardAspect(): string {
    return "aspect-[16/10]";
  }

  public getCuratedCollectionTitle(): string {
    return "Precision Hardware Telemetry • 2026";
  }

  public getBrandSignature(): string {
    return "Aviation CNC Aluminum • Custom Open-Source Firmware & Mil-Spec QC";
  }

  public getCategoryPsychology(): CategoryPsychology {
    return {
      primaryBuyerFear: "Counterfeit silicon, gray-market units, and post-purchase component failure.",
      reassurancePledge: "Factory-sealed units with serial-tracked certificates and 2-year advance hardware swap warranty.",
      doorstepChecklist: [
        "Verify untampered manufacturer security seal on outer anti-static carton",
        "Cross-reference printed chassis serial against official delivery manifest",
        "Inspect anodized aluminum bevels and port connectors for zero machining defects"
      ],
      keySpecHighlight: "6063 CNC Billet Aluminum • Gold Contacts • 2-Year Warranty"
    };
  }

  public getProductTabLabels(): ProductTabLabels {
    return {
      desc: "Hardware & Telemetry Specs",
      shipping: "Air Logistics & Serial Match",
      reviews: "Operator Benchmarks & Reviews (48)"
    };
  }

  public override getTrustGuarantees(): TrustGuarantee[] {
    return [
      {
        iconName: "CheckCircle2",
        title: "100% Genuine Calibrated",
        subtitle: "Direct sealed manufacturer serial with verified certificate"
      },
      {
        iconName: "ShieldCheck",
        title: "Doorstep Security Tape",
        subtitle: "Verify tamper-proof carton seals before cash handover"
      },
      {
        iconName: "RotateCcw",
        title: "2-Year Advance Swap",
        subtitle: "Rapid advance replacement for any hardware defect"
      }
    ];
  }

  public override getAnnouncementHighlights(): AnnouncementHighlights {
    return {
      leading: "Next-Day Hardware Dispatch",
      center: "Mil-spec certified • Comprehensive 2-year accidental warranty",
      trailing: "Serial Calibrated"
    };
  }

  public formatHeroBadge(categoryName: string): string {
    return `Precision Hardware • ${categoryName}`;
  }

  public formatProductBadge(rawBadge?: string): string {
    return rawBadge || "QC Calibrated";
  }

  public getManifestoPillars(): TrustManifestoItem[] {
    return [
      {
        index: "01",
        category: "HARDWARE",
        title: "100% Genuine Calibrated",
        description: "Zero gray-market or refurbished components. Sealed manufacturer serial with digital certificate."
      },
      {
        index: "02",
        category: "SETTLEMENT",
        title: "Cash on Handover",
        description: "Unbox and check the security seal and serial match before cash handover to logistics driver.",
        highlight: true
      },
      {
        index: "03",
        category: "DISPATCH",
        title: "Priority Air Courier",
        description: "Static-shielded, shock-damped packaging dispatched within 24 hours of confirmation."
      },
      {
        index: "04",
        category: "WARRANTY",
        title: "2-Year Direct Guarantee",
        description: "Includes rapid advance swap unit if internal diagnostic flag detects hardware defect."
      }
    ];
  }

  public getDesignPhilosophy(): DesignPhilosophy {
    return {
      ethos: "Extreme functionalism inspired by laboratory bench instruments, aerospace CNC, and zero latency.",
      typography: "Fixed-width monospaced metrics, high-contrast readout tables, and precision grid borders.",
      materialsFocus: "Anodized 6063 aluminum, FR4 PCB substrates, gold-plated contacts, and double-shot PBT.",
      curationQuote: "Calibrated for operators who demand uncompromising mechanical precision and verifiable telemetry."
    };
  }
}
