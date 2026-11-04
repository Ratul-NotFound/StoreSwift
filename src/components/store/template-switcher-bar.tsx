"use client";

import React, { useState } from "react";
import { X, ChevronRight, Check, Palette, Sparkles } from "lucide-react";

export interface TemplateSwitcherBarProps {
  currentSlug: string;
  activeTemplateId?: string;
  onSelectTemplate?: (templateId: string) => void;
}

export const ALL_TEMPLATE_CHOICES = [
  {
    id: "minimal",
    name: "Minimal Atelier",
    tag: "High Fashion",
    desc: "Clean editorial with fabric GSM badges & lookbook",
    color: "bg-zinc-100 text-zinc-900 border-zinc-300",
    badge: "🤍 Atelier",
  },
  {
    id: "clothing",
    name: "Clothing.co",
    tag: "Warm Boutique",
    desc: "Warm brown & cream aesthetic with curated collections",
    color: "bg-[#3d2d1e] text-amber-50 border-[#3d2d1e]",
    badge: "🟤 Boutique",
  },
  {
    id: "milano",
    name: "Milano Streetwear",
    tag: "Dark Editorial",
    desc: "Full-bleed dark editorial with vertical category strips",
    color: "bg-[#0e0e0e] text-white border-zinc-800",
    badge: "⚫ Milano",
  },
  {
    id: "nickelfox",
    name: "NickelFox Bold",
    tag: "Vibrant Fashion",
    desc: "High-energy yellow & black catalog with bold pill tabs",
    color: "bg-[#f7f500] text-black border-black",
    badge: "🟡 NickelFox",
  },
  {
    id: "glow",
    name: "Clinical Botanical",
    tag: "Beauty & Skincare",
    desc: "3-step glass skin routine & bio-active % badges",
    color: "bg-rose-50 text-rose-950 border-rose-200",
    badge: "🌸 Botanical",
  },
  {
    id: "artisan",
    name: "Warm Heritage",
    tag: "Footwear & Leather",
    desc: "Vibram lug specs, sole cutaways & tannery provenance",
    color: "bg-amber-900 text-amber-50 border-amber-800",
    badge: "👞 Heritage",
  },
  {
    id: "bold",
    name: "Acoustic Cyber",
    tag: "Tech & Audio",
    desc: "Titanium driver specs, telemetry & CNC aluminum",
    color: "bg-cyan-950 text-cyan-200 border-cyan-800",
    badge: "⚡ Cyber",
  },
  {
    id: "maison",
    name: "Opulent Maison",
    tag: "Jewelry & Luxury",
    desc: "18K hallmarking, GIA certifications & velvet unboxing",
    color: "bg-neutral-900 text-amber-300 border-amber-600/40",
    badge: "💎 Maison",
  },
  {
    id: "pantry",
    name: "Artisan Pantry",
    tag: "Gourmet & Organic",
    desc: "Single-origin terroir, harvest dates & batch roasting",
    color: "bg-emerald-900 text-emerald-100 border-emerald-800",
    badge: "☕ Pantry",
  },
];

export function TemplateSwitcherBar({
  currentSlug,
  activeTemplateId = "minimal",
  onSelectTemplate,
}: TemplateSwitcherBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const activeTemplate =
    ALL_TEMPLATE_CHOICES.find((t) => t.id === activeTemplateId) ||
    ALL_TEMPLATE_CHOICES[0];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-auto max-w-[calc(100vw-2rem)]">
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
        <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-2xl shadow-2xl p-4 w-[min(480px,calc(100vw-2rem))] max-h-[80vh] flex flex-col">
          <div className="flex items-center justify-between mb-3 shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-600" />
              <p className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                Storefront Design System (9 Templates)
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
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <p className="text-[11px] text-zinc-500 mb-3 shrink-0">
            Switch template instantly in real-time. Preserves all dynamic products, cart items, and settings.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 overflow-y-auto pr-1">
            {ALL_TEMPLATE_CHOICES.map((t) => {
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

          <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-white/10 flex items-center justify-between text-[11px] text-zinc-400 shrink-0">
            <span>9 Specialized Industry Designs</span>
            <span>Live Catalog Synced</span>
          </div>
        </div>
      )}
    </div>
  );
}
