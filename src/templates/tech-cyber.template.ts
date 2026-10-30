import { AbstractStoreTemplate } from "./base.template";
import {
  StoreTemplateId,
  StoreTemplateVibe,
  StoreTemplateClasses,
  TrustManifestoItem,
  DesignPhilosophy,
  AnnouncementHighlights
} from "./types";

export class TechCyberTemplate extends AbstractStoreTemplate {
  readonly id: StoreTemplateId = "bold";
  readonly name = "Precision Cybernetics";
  readonly tagline = "Aviation aluminum, mechanical tactile switches, and high-spec compute.";
  readonly categoryFit = "Consumer Electronics, Audio & Hardware Peripherals";
  readonly description = "Inspired by Apple Pro & Teenage Engineering: Matte obsidian canvas, electric cyan telemetry, and CAD spec typography.";
  readonly badge = "Pro Telemetry";
  readonly previewBg = "from-cyan-950 via-slate-900 to-black";
  readonly primaryColor = "#06b6d4";
  readonly accentColor = "#3b82f6";

  readonly vibe: StoreTemplateVibe = {
    fontDisplay: "font-mono tracking-tight",
    borderRadius: "rounded-lg",
    heroStyle: "cyber",
    cardElevation: "shadow-2xl border border-cyan-500/20",
    badgeStyle: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono"
  };

  readonly classes: StoreTemplateClasses = {
    pageBg: "bg-[#090a0f] text-zinc-100 selection:bg-cyan-500 selection:text-black",
    headerBg: "bg-[#090a0f]/90 backdrop-blur-md border-b border-zinc-800/90 text-zinc-100",
    navPillBg: "bg-[#090a0f]/95 border-b border-zinc-800/80",
    toolbarBg: "bg-zinc-900/90 border-zinc-800 shadow-xl",
    lookbookBg: "bg-zinc-950/80 border-y border-zinc-800 text-zinc-100",
    heroSection: "bg-[#090a0f] border-b border-zinc-800 text-zinc-100",
    heroBadge: "bg-cyan-950/80 text-cyan-400 border-cyan-700/60 shadow-cyan-500/10",
    heroTitle: "text-white font-black tracking-tight",
    heroSubtitle: "text-zinc-400",
    editorialTag: "font-mono text-[10px] tracking-[0.25em] uppercase text-cyan-400",
    productCard: "bg-zinc-900/80 border-zinc-800 hover:border-cyan-500/50 transition-all duration-300",
    productCardImg: "rounded-md",
    primaryButton: "bg-cyan-500 hover:bg-cyan-400 text-black font-bold shadow-cyan-500/25",
    secondaryButton: "bg-zinc-900 border-zinc-700 hover:bg-zinc-800 text-zinc-100 font-medium",
    pillActive: "bg-cyan-500 text-black font-bold shadow-sm ring-1 ring-cyan-400",
    pillInactive: "bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800",
    accentText: "text-cyan-400",
    announcementBar: "bg-black text-cyan-400 border-b border-cyan-950",
    featureCard: "bg-zinc-900/60 border-zinc-800",
    spotlightBanner: "bg-gradient-to-r from-zinc-950 via-cyan-950/40 to-black text-white border-zinc-800"
  };

  public getHeroLayoutType(): "cyber" {
    return "cyber";
  }

  public getProductCardAspect(): string {
    return "aspect-[16/10]";
  }

  public getCuratedCollectionTitle(): string {
    return "TACTICAL HARDWARE TELEMETRY // 2026";
  }

  public getBrandSignature(): string {
    return "Aviation CNC Aluminum • Custom Open-Source Firmware & Mil-Spec QC";
  }

  public override getAnnouncementHighlights(): AnnouncementHighlights {
    return {
      leading: "⚡ Next-Day Hardware Dispatch",
      center: "🚀 MIL-SPEC CERTIFIED • COMPREHENSIVE 2-YEAR ACCIDENTAL WARRANTY",
      trailing: "🔒 Tested & Serial Calibrated"
    };
  }

  public formatHeroBadge(categoryName: string): string {
    return `MIL-SPEC HARDWARE // ${categoryName.toUpperCase()} TELEMETRY`;
  }

  public formatProductBadge(rawBadge?: string): string {
    if (!rawBadge) return "QC CALIBRATED";
    return `// ${rawBadge.toUpperCase()} //`;
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
