"use client";

import React, { useState } from "react";
import { X, ChevronRight, Check, Palette, Sparkles, Filter } from "lucide-react";

export interface TemplateSwitcherBarProps {
  currentSlug: string;
  activeTemplateId?: string;
  storeCategory?: string;
  onSelectTemplate?: (templateId: string) => void;
}

export interface TemplateChoice {
  id: string;
  name: string;
  category: "fashion" | "beauty_cosmetics" | "shoes" | "electronics" | "jewelry" | "grocery_food";
  categoryName: string;
  tag: string;
  desc: string;
  color: string;
  badge: string;
}

export const CATEGORY_FILTERS = [
  { id: "all", label: "All Themes", icon: "✨" },
  { id: "fashion", label: "Fashion (4)", icon: "👗" },
  { id: "beauty_cosmetics", label: "Beauty (2)", icon: "🌸" },
  { id: "shoes", label: "Footwear (2)", icon: "👞" },
  { id: "electronics", label: "Tech (2)", icon: "⚡" },
  { id: "jewelry", label: "Jewelry (2)", icon: "💎" },
  { id: "grocery_food", label: "Food (2)", icon: "☕" },
] as const;

export const ALL_TEMPLATE_CHOICES: TemplateChoice[] = [
  // ─── 👗 Fashion & Apparel (4 Templates) ───
  {
    id: "minimal",
    name: "Minimal Atelier",
    category: "fashion",
    categoryName: "Fashion & Apparel",
    tag: "High Fashion",
    desc: "Clean editorial with fabric GSM badges & curated lookbook",
    color: "bg-zinc-100 text-zinc-900 border-zinc-300",
    badge: "🤍 Atelier",
  },
  {
    id: "clothing",
    name: "Clothing.co",
    category: "fashion",
    categoryName: "Fashion & Apparel",
    tag: "Warm Boutique",
    desc: "Warm brown & cream aesthetic with curated collections",
    color: "bg-[#3d2d1e] text-amber-50 border-[#3d2d1e]",
    badge: "🟤 Boutique",
  },
  {
    id: "milano",
    name: "Milano Streetwear",
    category: "fashion",
    categoryName: "Fashion & Apparel",
    tag: "Dark Editorial",
    desc: "Full-bleed dark editorial with vertical category strips",
    color: "bg-[#0e0e0e] text-white border-zinc-800",
    badge: "⚫ Milano",
  },
  {
    id: "nickelfox",
    name: "NickelFox Bold",
    category: "fashion",
    categoryName: "Fashion & Apparel",
    tag: "Vibrant Fashion",
    desc: "High-energy yellow & black catalog with bold pill tabs",
    color: "bg-[#f7f500] text-black border-black",
    badge: "🟡 NickelFox",
  },

  // ─── 🌸 Beauty & Cosmetics (2 Templates) ───
  {
    id: "glow",
    name: "Clinical Botanical",
    category: "beauty_cosmetics",
    categoryName: "Beauty & Cosmetics",
    tag: "Clinical Skincare",
    desc: "3-step glass skin routine & bio-active % ingredient badges",
    color: "bg-rose-50 text-rose-950 border-rose-200",
    badge: "🌸 Botanical",
  },
  {
    id: "luxe-glam",
    name: "Velvet Glam Parfumerie",
    category: "beauty_cosmetics",
    categoryName: "Beauty & Cosmetics",
    tag: "Haute Parfumerie",
    desc: "Midnight plum, golden olfactory pyramids & rich velvet pigments",
    color: "bg-[#180a1c] text-rose-200 border-rose-900/60",
    badge: "💄 Velvet Glam",
  },

  // ─── 👞 Footwear & Shoes (2 Templates) ───
  {
    id: "artisan",
    name: "Warm Heritage Guild",
    category: "shoes",
    categoryName: "Footwear & Shoes",
    tag: "Handcrafted Leather",
    desc: "Vibram lug specs, sole cutaways & Horween tannery provenance",
    color: "bg-amber-900 text-amber-50 border-amber-800",
    badge: "👞 Heritage",
  },
  {
    id: "velocity",
    name: "Velocity Sneaker Vault",
    category: "shoes",
    categoryName: "Footwear & Shoes",
    tag: "Kinetic Runners",
    desc: "Carbon torsion plate telemetry, drop countdowns & dynamic size runs",
    color: "bg-[#0c0d14] text-orange-400 border-orange-500/40",
    badge: "⚡ Velocity Kicks",
  },

  // ─── ⚡ Electronics & Tech (2 Templates) ───
  {
    id: "bold",
    name: "Acoustic Cyber",
    category: "electronics",
    categoryName: "Electronics & Tech",
    tag: "Audiophile Tech",
    desc: "Titanium driver specs, telemetry & CNC aluminum chassis",
    color: "bg-cyan-950 text-cyan-200 border-cyan-800",
    badge: "🎧 Cyber Tech",
  },
  {
    id: "lumina",
    name: "Lumina Zen Silicon",
    category: "electronics",
    categoryName: "Electronics & Tech",
    tag: "Minimal Hardware",
    desc: "Pristine anodized aluminum, battery benchmarks & magnetic snap specs",
    color: "bg-zinc-50 text-zinc-900 border-zinc-300",
    badge: "💻 Zen Silicon",
  },

  // ─── 💎 Jewelry & Luxury (2 Templates) ───
  {
    id: "maison",
    name: "Opulent Royal Maison",
    category: "jewelry",
    categoryName: "Jewelry & Luxury",
    tag: "Fine Horology",
    desc: "18K official hallmarking, GIA certifications & velvet unboxing",
    color: "bg-neutral-900 text-amber-300 border-amber-600/40",
    badge: "💎 Royal Maison",
  },
  {
    id: "aurora",
    name: "Aurora Fine Atelier",
    category: "jewelry",
    categoryName: "Jewelry & Luxury",
    tag: "Modern Fine Jewelry",
    desc: "Champagne pearl, stackable ring layering studio & bridal provenance",
    color: "bg-[#faf6f0] text-amber-950 border-amber-200",
    badge: "✨ Aurora Atelier",
  },

  // ─── ☕ Food & Grocery (2 Templates) ───
  {
    id: "pantry",
    name: "Artisan Pantry",
    category: "grocery_food",
    categoryName: "Food & Grocery",
    tag: "Single-Origin Terroir",
    desc: "Single-origin terroir, harvest dates & 48h batch drum roasting",
    color: "bg-emerald-900 text-emerald-100 border-emerald-800",
    badge: "☕ Artisan Pantry",
  },
  {
    id: "bazaar",
    name: "Fresh Daily Bazaar",
    category: "grocery_food",
    categoryName: "Food & Grocery",
    tag: "Farm-to-Door Market",
    desc: "Same-day cold-chain farm delivery, harvest bundles & pesticide-free",
    color: "bg-lime-950 text-lime-200 border-lime-800",
    badge: "🥬 Fresh Bazaar",
  },
];

export function TemplateSwitcherBar({
  currentSlug,
  activeTemplateId = "minimal",
  storeCategory,
  onSelectTemplate,
}: TemplateSwitcherBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  if (dismissed) return null;

  const activeTemplate =
    ALL_TEMPLATE_CHOICES.find((t) => t.id === activeTemplateId) ||
    ALL_TEMPLATE_CHOICES[0];

  const filteredTemplates =
    selectedCategory === "all"
      ? ALL_TEMPLATE_CHOICES
      : ALL_TEMPLATE_CHOICES.filter((t) => t.category === selectedCategory);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-auto max-w-[calc(100vw-2rem)] font-sans">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-zinc-950/90 hover:bg-zinc-950 backdrop-blur-md text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl border border-white/20 transition group"
        >
          <Palette className="w-3.5 h-3.5 text-violet-400" />
          <span>Active: {activeTemplate.badge}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
          <span className="text-zinc-400 text-[10px] uppercase font-mono tracking-wider ml-1">Switch</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
        </button>
      ) : (
        <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-2xl shadow-2xl p-4 w-[min(540px,calc(100vw-2rem))] max-h-[85vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-2 shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-600" />
              <p className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                Industry Design System (14 Templates)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDismissed(true)}
                className="text-[10px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
              >
                Dismiss
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition"
                aria-label="Close template switcher"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <p className="text-[11px] text-zinc-500 mb-3 shrink-0">
            Multiple production-grade templates tailored for each retail industry. Real products & checkout stay 100% dynamic.
          </p>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 shrink-0 scrollbar-none">
            {CATEGORY_FILTERS.map((cat) => {
              const isCatActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition flex items-center gap-1 ${
                    isCatActive
                      ? "bg-violet-600 text-white shadow-xs font-bold"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 overflow-y-auto pr-1 max-h-[50vh]">
            {filteredTemplates.map((t) => {
              const isActive = activeTemplateId === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    if (onSelectTemplate) {
                      onSelectTemplate(t.id);
                    } else {
                      window.location.search = `?template=${t.id}`;
                    }
                    setIsOpen(false);
                  }}
                  className={`${t.color} rounded-xl p-3 text-left hover:scale-[1.01] transition relative border shadow-sm flex flex-col justify-between`}
                >
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <span className="text-xs font-black tracking-tight">{t.badge}</span>
                    {isActive ? (
                      <span className="bg-emerald-500 text-white rounded-full p-0.5">
                        <Check className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono uppercase opacity-75">{t.tag}</span>
                    )}
                  </div>
                  <span className="text-[10px] opacity-80 leading-snug line-clamp-2">{t.desc}</span>
                </button>
              );
            })}
          </div>

          {/* Footer Info */}
          <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-white/10 flex items-center justify-between text-[11px] text-zinc-400 shrink-0">
            <span>Multiple Themes Per Category</span>
            <span>Live Catalog Synced</span>
          </div>
        </div>
      )}
    </div>
  );
}
