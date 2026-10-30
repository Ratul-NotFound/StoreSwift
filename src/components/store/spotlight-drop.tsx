"use client";

import { useState, useEffect } from "react";
import { Sparkles, ShoppingBag, Clock, ShieldCheck, Flame, ArrowRight } from "lucide-react";
import { StoreTemplate } from "@/config/templates";

export interface SpotlightProduct {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  comparePrice: number;
  imageUrl?: string;
  secondaryImage?: string;
  badge?: string;
  rating?: number;
  variants: any[];
}

export function SpotlightDrop({
  product,
  template,
  onAddToCart
}: {
  product: SpotlightProduct;
  template: StoreTemplate;
  onAddToCart: (p: SpotlightProduct, variant: any) => void;
}) {
  // Countdown Timer
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 48 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const [selectedVariant, setSelectedVariant] = useState(product.variants[0] || null);
  const discount = Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100);

  return (
    <section className="my-12 max-w-6xl mx-auto px-4 sm:px-6">
      <div className={`rounded-3xl p-6 sm:p-10 border overflow-hidden relative shadow-float ${template.classes.spotlightBanner}`}>
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Column: Product Artwork */}
          <div className="lg:col-span-5 relative group">
            <div className="aspect-square rounded-2xl overflow-hidden bg-black/20 border border-white/10 shadow-inner relative">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
              />
              {product.secondaryImage && (
                <img
                  src={product.secondaryImage}
                  alt={`${product.title} - Lookbook`}
                  className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
              )}
            </div>
            {discount > 0 && (
              <span className="absolute top-3 left-3 bg-rose-600 text-white font-black text-xs px-2.5 py-1 rounded-full shadow">
                SAVE {discount}% OFF
              </span>
            )}
          </div>

          {/* Right Column: Info & Action */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 border border-white/20">
                <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Weekly Spotlight Drop</span>
              </span>
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/10 border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>{template.getCategoryPsychology().keySpecHighlight.split("•")[0].trim()}</span>
              </span>

              {/* Countdown Pills */}
              <div className="inline-flex items-center space-x-1.5 text-xs font-mono font-bold bg-black/40 px-3 py-1 rounded-full border border-white/10">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                <span>
                  {String(timeLeft.hours).padStart(2, "0")}h :{" "}
                  {String(timeLeft.minutes).padStart(2, "0")}m :{" "}
                  {String(timeLeft.seconds).padStart(2, "0")}s
                </span>
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              {product.title}
            </h3>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-xl">
              {product.description}
            </p>

            {/* Price & Scarcity */}
            <div className="pt-2 flex items-baseline space-x-3">
              <span className="text-3xl font-black text-white">{template.formatPrice(product.price)}</span>
              <span className="text-sm text-zinc-400 line-through">{template.formatPrice(product.comparePrice)}</span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{template.getScarcityUrgency(7)}</span>
              </span>
            </div>

            {/* Variant Pills */}
            {product.variants.length > 0 && (
              <div className="pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">
                  Select Edition / Variant:
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v, i) => {
                    const isSel = selectedVariant?.sku === v.sku;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                          isSel
                            ? "bg-white text-zinc-950 font-bold shadow ring-2 ring-white"
                            : "bg-white/10 hover:bg-white/20 text-white border border-white/15"
                        }`}
                      >
                        {v.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => onAddToCart(product, selectedVariant)}
                className="py-3 px-6 bg-white hover:bg-zinc-100 text-zinc-950 font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center space-x-2 btn-press"
              >
                <ShoppingBag className="w-4 h-4 text-zinc-950" />
                <span>Claim Spotlight Drop • {template.formatPrice(product.price)}</span>
              </button>

              <div className="flex items-center space-x-2 text-xs text-zinc-400 px-3 py-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Cash on delivery guaranteed • Free nationwide shipping</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
