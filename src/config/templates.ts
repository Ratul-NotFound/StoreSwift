export interface StoreTemplate {
  id: "minimal" | "glow" | "bold" | "artisan";
  name: string;
  tagline: string;
  categoryFit: string;
  description: string;
  badge: string;
  previewBg: string;
  primaryColor: string;
  accentColor: string;
  vibe: {
    fontDisplay: string;
    borderRadius: string;
    heroStyle: "split" | "luminous" | "cyber" | "heritage";
    cardElevation: string;
    badgeStyle: string;
  };
  classes: {
    pageBg: string;
    headerBg: string;
    navPillBg: string;
    toolbarBg: string;
    lookbookBg: string;
    heroSection: string;
    heroBadge: string;
    heroTitle: string;
    heroSubtitle: string;
    editorialTag: string;
    productCard: string;
    productCardImg: string;
    primaryButton: string;
    secondaryButton: string;
    pillActive: string;
    pillInactive: string;
    accentText: string;
    announcementBar: string;
    featureCard: string;
    spotlightBanner: string;
  };
}

export const STORE_TEMPLATES: Record<string, StoreTemplate> = {
  minimal: {
    id: "minimal",
    name: "Minimalist Atelier",
    tagline: "High fashion, clean architectural lines, and timeless monochrome.",
    categoryFit: "Fashion, Streetwear & Modern Apparel",
    description: "Inspired by Acne Studios & SSENSE: Ultra-clean typography, bold black/white contrast, and hairline borders.",
    badge: "High Fashion",
    previewBg: "from-zinc-950 via-zinc-900 to-zinc-950",
    primaryColor: "#18181b",
    accentColor: "#2563eb",
    vibe: {
      fontDisplay: "font-sans tracking-tight",
      borderRadius: "rounded-xl",
      heroStyle: "split",
      cardElevation: "shadow-subtle hover:shadow-card",
      badgeStyle: "bg-zinc-900 text-white uppercase text-[10px] tracking-wider"
    },
    classes: {
      pageBg: "bg-white text-zinc-900 selection:bg-zinc-950 selection:text-white",
      headerBg: "bg-white/90 backdrop-blur-md border-b border-zinc-200/90 text-zinc-900",
      navPillBg: "bg-white/95 border-b border-zinc-200/70",
      toolbarBg: "bg-white border-zinc-200/90",
      lookbookBg: "bg-zinc-50 border-y border-zinc-200 text-zinc-900",
      heroSection: "bg-white border-b border-zinc-200/80 text-zinc-900",
      heroBadge: "bg-zinc-900 text-white border-zinc-800",
      heroTitle: "text-zinc-950 font-black tracking-tight",
      heroSubtitle: "text-zinc-500",
      editorialTag: "font-mono text-[10px] tracking-[0.25em] uppercase text-zinc-400",
      productCard: "bg-white border-zinc-200 hover:border-zinc-900 transition-all duration-300",
      productCardImg: "rounded-lg",
      primaryButton: "bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm font-bold",
      secondaryButton: "bg-white border-zinc-200 hover:bg-zinc-50 text-zinc-900 font-semibold",
      pillActive: "bg-zinc-900 text-white shadow-sm ring-1 ring-zinc-900",
      pillInactive: "bg-zinc-100 hover:bg-zinc-200 text-zinc-700",
      accentText: "text-zinc-900",
      announcementBar: "bg-zinc-950 text-zinc-300 border-b border-zinc-800",
      featureCard: "bg-zinc-50 border-zinc-200/70",
      spotlightBanner: "bg-zinc-900 text-white border-zinc-800"
    }
  },
  glow: {
    id: "glow",
    name: "Luxe Glow & Editorial",
    tagline: "Soft pastel gradients, blurred surfaces, and delicate curves.",
    categoryFit: "Cosmetics, Skincare, Beauty & Wellness",
    description: "Inspired by Glossier & Sephora: Ethereal blush tones, soft glass cards, rounded pills, and clean beauty badges.",
    badge: "Beauty & Wellness",
    previewBg: "from-rose-500 via-pink-600 to-rose-700",
    primaryColor: "#be123c",
    accentColor: "#f43f5e",
    vibe: {
      fontDisplay: "font-sans tracking-tight",
      borderRadius: "rounded-3xl",
      heroStyle: "luminous",
      cardElevation: "shadow-subtle hover:shadow-card hover:shadow-rose-100/50",
      badgeStyle: "bg-rose-100 text-rose-800 text-[10px] font-bold border border-rose-200"
    },
    classes: {
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
    }
  },
  bold: {
    id: "bold",
    name: "Tech Cyber & Precision",
    tagline: "High-contrast dark accents, electric cyan highlights, and dense specs.",
    categoryFit: "Electronics, Hardware, Audio & Gadgets",
    description: "Inspired by Apple & Keychron: Monospaced spec chips, dark cyber accents, neon status indicators, and engineering precision.",
    badge: "Hardware & Tech",
    previewBg: "from-slate-950 via-sky-950 to-slate-900",
    primaryColor: "#0284c7",
    accentColor: "#38bdf8",
    vibe: {
      fontDisplay: "font-sans tracking-tight",
      borderRadius: "rounded-xl",
      heroStyle: "cyber",
      cardElevation: "shadow-subtle hover:shadow-card hover:shadow-sky-900/10",
      badgeStyle: "bg-sky-950 text-sky-400 font-mono text-[10px] border border-sky-800 font-bold"
    },
    classes: {
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
    }
  },
  artisan: {
    id: "artisan",
    name: "Warm Heritage & Craft",
    tagline: "Earthy terracotta tones, warm cream cards, and handcrafted charm.",
    categoryFit: "Footwear, Leather Goods, Gourmet Food & Jewelry",
    description: "Inspired by Red Wing & Aesop: Warm linen surfaces, artisan leather stamp badges, rich amber accents, and organic heritage.",
    badge: "Master Crafted",
    previewBg: "from-amber-950 via-stone-900 to-amber-950",
    primaryColor: "#78350f",
    accentColor: "#d97706",
    vibe: {
      fontDisplay: "font-serif tracking-tight",
      borderRadius: "rounded-2xl",
      heroStyle: "heritage",
      cardElevation: "shadow-subtle hover:shadow-card hover:shadow-amber-100/60",
      badgeStyle: "bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold"
    },
    classes: {
      pageBg: "bg-[#f8f5ee] text-[#2c221e] selection:bg-amber-900 selection:text-white",
      headerBg: "bg-[#fdfbf7]/90 backdrop-blur-md border-b border-amber-200/80 text-[#2c221e]",
      navPillBg: "bg-[#fcf9f2]/95 border-b border-amber-200/60",
      toolbarBg: "bg-[#fffdf9] border-amber-200/80",
      lookbookBg: "bg-[#f1ebe0] border-y border-amber-200 text-[#2c221e]",
      heroSection: "bg-[#fbf9f5] border-b border-amber-200/70 text-zinc-900",
      heroBadge: "bg-amber-100 text-amber-900 border-amber-300 shadow-sm",
      heroTitle: "text-amber-950 font-serif font-black tracking-tight",
      heroSubtitle: "text-stone-600",
      editorialTag: "font-serif italic text-xs tracking-wider text-amber-800",
      productCard: "bg-[#fffdf9] border-amber-200/80 hover:border-amber-600 transition-all duration-300 shadow-sm",
      productCardImg: "rounded-xl",
      primaryButton: "bg-amber-900 hover:bg-amber-950 text-white shadow-sm font-bold font-serif",
      secondaryButton: "bg-amber-50 border-amber-200 hover:bg-amber-100 text-amber-900 font-semibold",
      pillActive: "bg-amber-900 text-white shadow-sm ring-1 ring-amber-900",
      pillInactive: "bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/60",
      accentText: "text-amber-800",
      announcementBar: "bg-amber-950 text-amber-200 border-b border-amber-900",
      featureCard: "bg-[#f6f2ea] border-amber-200/60",
      spotlightBanner: "bg-amber-950 text-amber-100 border-amber-900"
    }
  }
};

export const ALL_TEMPLATES = Object.keys(STORE_TEMPLATES);

export function getTemplateConfig(templateId?: string): StoreTemplate {
  if (!templateId) return STORE_TEMPLATES.minimal;
  return STORE_TEMPLATES[templateId as keyof typeof STORE_TEMPLATES] || STORE_TEMPLATES.minimal;
}
