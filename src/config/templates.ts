export interface StoreTemplate {
  id: string;
  name: string;
  tagline: string;
  categoryFit: string;
  description: string;
  badge: string;
  previewBg: string;
  primaryColor: string;
  accentColor: string;
  classes: {
    heroBadge: string;
    productCard: string;
    primaryButton: string;
    secondaryButton: string;
    pillActive: string;
    accentText: string;
    announcementBar: string;
  };
}

export const STORE_TEMPLATES: Record<string, StoreTemplate> = {
  minimal: {
    id: "minimal",
    name: "Minimalist Atelier",
    tagline: "High fashion, clean architectural lines, and timeless monochrome.",
    categoryFit: "Fashion, Apparel & Footwear",
    description: "Designed for premium modern brands with bold typography, crisp borders, and zero clutter.",
    badge: "Most Popular",
    previewBg: "from-zinc-900 via-zinc-800 to-zinc-900",
    primaryColor: "#18181b",
    accentColor: "#2563eb",
    classes: {
      heroBadge: "bg-zinc-900 text-white border-zinc-800",
      productCard: "bg-white border-zinc-200 hover:border-zinc-900 transition-colors",
      primaryButton: "bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm",
      secondaryButton: "bg-white border-zinc-200 hover:bg-zinc-50 text-zinc-900",
      pillActive: "bg-zinc-900 text-white shadow-sm",
      accentText: "text-zinc-900",
      announcementBar: "bg-zinc-950 text-zinc-300 border-b border-zinc-800"
    }
  },
  glow: {
    id: "glow",
    name: "Luxe Glow & Editorial",
    tagline: "Soft pastel gradients, blurred surfaces, and delicate curves.",
    categoryFit: "Cosmetics, Skincare & Wellness",
    description: "Tailored for beauty and wellness brands with gentle rose/blush highlights and glowing card aesthetics.",
    badge: "Trending",
    previewBg: "from-rose-500 via-pink-600 to-rose-700",
    primaryColor: "#9f1239",
    accentColor: "#f43f5e",
    classes: {
      heroBadge: "bg-rose-100 text-rose-800 border-rose-200",
      productCard: "bg-white border-rose-100 hover:border-rose-300 hover:shadow-card transition-all",
      primaryButton: "bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-200",
      secondaryButton: "bg-rose-50 border-rose-200 hover:bg-rose-100 text-rose-900",
      pillActive: "bg-rose-600 text-white shadow-sm",
      accentText: "text-rose-600",
      announcementBar: "bg-rose-900 text-rose-100 border-b border-rose-800"
    }
  },
  bold: {
    id: "bold",
    name: "Tech Cyber & Precision",
    tagline: "High-contrast slate accents, electric cyan highlights, and dense specs.",
    categoryFit: "Electronics, Gadgets & Hardware",
    description: "Engineered for technical products with high-spec badges, sharp corners, and futuristic aesthetics.",
    badge: "High Conversion",
    previewBg: "from-slate-900 via-sky-950 to-slate-900",
    primaryColor: "#0f172a",
    accentColor: "#0284c7",
    classes: {
      heroBadge: "bg-sky-950 text-sky-300 border-sky-800",
      productCard: "bg-white border-slate-200 hover:border-sky-500 hover:shadow-subtle transition-all",
      primaryButton: "bg-slate-900 hover:bg-sky-900 text-white shadow-sm",
      secondaryButton: "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800",
      pillActive: "bg-slate-900 text-sky-400 shadow-sm",
      accentText: "text-sky-600",
      announcementBar: "bg-slate-950 text-sky-300 border-b border-slate-800"
    }
  },
  artisan: {
    id: "artisan",
    name: "Warm Heritage & Craft",
    tagline: "Earthy terracotta tones, warm cream cards, and handcrafted charm.",
    categoryFit: "Footwear, Leather Goods & Artisan Food",
    description: "Ideal for shoes, boots, leather goods, and organic delicacies that emphasize craftsmanship and heritage.",
    badge: "Heritage",
    previewBg: "from-amber-900 via-amber-950 to-stone-900",
    primaryColor: "#78350f",
    accentColor: "#d97706",
    classes: {
      heroBadge: "bg-amber-100 text-amber-900 border-amber-200",
      productCard: "bg-white border-amber-100 hover:border-amber-400 hover:shadow-card transition-all",
      primaryButton: "bg-amber-800 hover:bg-amber-900 text-white shadow-sm",
      secondaryButton: "bg-amber-50 border-amber-200 hover:bg-amber-100 text-amber-900",
      pillActive: "bg-amber-800 text-white shadow-sm",
      accentText: "text-amber-800",
      announcementBar: "bg-amber-950 text-amber-200 border-b border-amber-900"
    }
  }
};

export const ALL_TEMPLATES = Object.keys(STORE_TEMPLATES);

export function getTemplateConfig(templateId?: string): StoreTemplate {
  if (!templateId) return STORE_TEMPLATES.minimal;
  return STORE_TEMPLATES[templateId] || STORE_TEMPLATES.minimal;
}
