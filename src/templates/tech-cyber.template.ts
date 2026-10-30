import { AbstractStoreTemplate } from "./base.template";
import {
  StoreTemplateId,
  StoreTemplateVibe,
  StoreTemplateClasses,
  TrustManifestoItem,
  DesignPhilosophy
} from "./types";

export class TechCyberTemplate extends AbstractStoreTemplate {
  readonly id: StoreTemplateId = "bold";
  readonly name = "Tech Cyber & Precision";
  readonly tagline = "High-contrast dark accents, electric cyan highlights, and dense specs.";
  readonly categoryFit = "Electronics, Hardware, Audio & Gadgets";
  readonly description = "Inspired by Apple & Keychron: Monospaced spec chips, dark cyber accents, neon status indicators, and engineering precision.";
  readonly badge = "Hardware & Tech";
  readonly previewBg = "from-slate-950 via-sky-950 to-slate-900";
  readonly primaryColor = "#0284c7";
  readonly accentColor = "#38bdf8";

  readonly vibe: StoreTemplateVibe = {
    fontDisplay: "font-sans tracking-tight",
    borderRadius: "rounded-xl",
    heroStyle: "cyber",
    cardElevation: "shadow-subtle hover:shadow-card hover:shadow-sky-900/10",
    badgeStyle: "bg-sky-950 text-sky-400 font-mono text-[10px] border border-sky-800 font-bold"
  };

  readonly classes: StoreTemplateClasses = {
    pageBg: "bg-[#090d18] text-white selection:bg-sky-500 selection:text-white",
    headerBg: "bg-[#0c1222]/90 backdrop-blur-md border-b border-slate-800 text-white",
    navPillBg: "bg-[#0a0f1d]/95 border-b border-slate-800/80",
    toolbarBg: "bg-[#0f172a] border-slate-800",
    lookbookBg: "bg-[#060912] border-y border-slate-800/80 text-white",
    heroSection: "bg-[#090d18] border-b border-slate-800 text-white",
    heroBadge: "bg-sky-950 text-sky-300 border-sky-800 font-mono shadow-sm",
    heroTitle: "text-white font-black tracking-tight",
    heroSubtitle: "text-slate-400",
    editorialTag: "font-mono text-[10px] tracking-[0.2em] uppercase text-sky-400",
    productCard: "bg-[#0f172a] border-slate-800 hover:border-sky-500/80 transition-all duration-300 shadow-md text-white",
    productCardImg: "rounded-lg",
    primaryButton: "bg-sky-600 hover:bg-sky-500 text-white shadow-sm font-bold font-mono tracking-wide",
    secondaryButton: "bg-slate-800/80 border-slate-700 hover:bg-slate-700 text-white font-semibold",
    pillActive: "bg-sky-500 text-slate-950 font-bold shadow-sm ring-1 ring-sky-400",
    pillInactive: "bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/60",
    accentText: "text-sky-400",
    announcementBar: "bg-[#050810] text-sky-300 border-b border-slate-800 font-mono",
    featureCard: "bg-slate-900/60 border-slate-800 text-slate-300",
    spotlightBanner: "bg-[#050810] text-white border-slate-800"
  };

  public getHeroLayoutType(): "cyber" {
    return "cyber";
  }

  public getProductCardAspect(): string {
    return "aspect-[4/3]";
  }

  public formatHeroBadge(categoryName: string): string {
    return `HARDWARE LAB // ${categoryName.toUpperCase()} // LATENCY: 0.8MS`;
  }

  public formatProductBadge(rawBadge?: string): string {
    if (!rawBadge) return "✦ CNC SPEC";
    return `✦ ${rawBadge.toUpperCase()}`;
  }

  public getManifestoPillars(): TrustManifestoItem[] {
    return [
      {
        index: "01",
        category: "HARDWARE SPEC",
        title: "Aerospace CNC Tolerances",
        description: "Billet 6061-T6 aluminum shells, gold-plated contacts, and factory zero-defect QA testing."
      },
      {
        index: "02",
        category: "DELIVERY SECURE",
        title: "Cash on Delivery Available",
        description: "Test serial numbers and driver integrity with courier present before paying."
      },
      {
        index: "03",
        category: "SPEED",
        title: "24h Anti-Static Dispatch",
        description: "Dispatched in ESD-shielded packaging with shock detection indicator tape."
      },
      {
        index: "04",
        category: "WARRANTY",
        title: "2-Year Hardware Coverage",
        description: "Zero deductible express warranty replacement on all acoustic and silicon components."
      }
    ];
  }

  public getDesignPhilosophy(): DesignPhilosophy {
    return {
      ethos: "Obsessive acoustic and mechanical precision engineered for makers, audiophiles, and creators.",
      typography: "Monospaced telemetry typography inspired by avionics, CNC control interfaces, and terminal screens.",
      materialsFocus: "Anodized space-grey aluminum, beryllium dynamic drivers, and braided Kevlar cabling.",
      curationQuote: "Designed to operate at absolute fidelity, eliminating acoustic distortion down to 0.002% THD."
    };
  }
}

