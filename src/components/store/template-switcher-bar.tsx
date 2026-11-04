"use client";

import React, { useState } from "react";
import { X, ChevronRight } from "lucide-react";

interface TemplateSwitcherBarProps {
  currentSlug: string;
}

const TEMPLATE_DEMOS = [
  {
    id: "clothing",
    label: "🟤 Clothing",
    desc: "Warm brown/cream — Clothing.co style",
    color: "bg-amber-700",
    textColor: "text-white",
    slug: "my-clothing-store",
  },
  {
    id: "milano",
    label: "⚫ Milano",
    desc: "Dark editorial — Full-bleed vertical strips",
    color: "bg-zinc-900",
    textColor: "text-white",
    slug: "milano-urban-store",
  },
  {
    id: "nickelfox",
    label: "🟡 NickelFox",
    desc: "Bold yellow/black — Catalogue style",
    color: "bg-yellow-400",
    textColor: "text-black",
    slug: "nfox-bold-fashion",
  },
  {
    id: "boutique",
    label: "🤍 Boutique",
    desc: "Minimalist Atelier — High fashion",
    color: "bg-zinc-100",
    textColor: "text-zinc-900",
    slug: "apex-fashion",
  },
];

export function TemplateSwitcherBar({ currentSlug }: TemplateSwitcherBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-auto max-w-[calc(100vw-2rem)]">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-black/90 backdrop-blur text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-xl border border-white/10 hover:bg-black transition group"
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Switch Template
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
        </button>
      ) : (
        <div className="bg-white/95 backdrop-blur-md border border-zinc-200 rounded-2xl shadow-2xl p-4 w-[min(400px,calc(100vw-2rem))]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Preview Templates</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setDismissed(true)} className="text-[10px] text-zinc-400 hover:text-zinc-600 transition">Dismiss</button>
              <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-zinc-700 transition">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {TEMPLATE_DEMOS.map((t) => (
              <a
                key={t.id}
                href={`/store/${t.slug}`}
                className={`${t.color} ${t.textColor} rounded-xl p-3 text-left hover:scale-[1.02] transition group border-2 ${currentSlug.includes(t.id) || (t.id === "boutique" && !["clothing","milano","nfox","nickelfox"].some(k => currentSlug.includes(k))) ? "border-blue-500" : "border-transparent"}`}
              >
                <span className="text-xs font-black block leading-tight">{t.label}</span>
                <span className={`text-[10px] block mt-0.5 leading-tight ${t.id === "nickelfox" ? "text-black/60" : t.id === "boutique" ? "text-zinc-500" : "text-white/60"}`}>
                  {t.desc}
                </span>
              </a>
            ))}
          </div>
          <p className="text-[10px] text-zinc-400 mt-3 text-center">Click to preview each template design</p>
        </div>
      )}
    </div>
  );
}
