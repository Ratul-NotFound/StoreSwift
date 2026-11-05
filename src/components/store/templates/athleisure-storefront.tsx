"use client";

import React, { useState, useMemo } from "react";
import {
  ShoppingBag,
  Search,
  Heart,
  ArrowRight,
  Menu,
  X,
  Star,
  Check,
  ChevronRight,
  Truck,
  ShieldCheck,
  RotateCcw,
  Zap,
  Flame,
  Activity,
  Layers,
  Sparkles,
  Droplets,
  Wind
} from "lucide-react";
import { CartItem } from "@/lib/cart";

export interface AthleisureStorefrontProps {
  storeDisplayName: string;
  tenantSlug: string;
  products: any[];
  cartItems: CartItem[];
  wishlist: string[];
  finalTotal: number;
  onAddToCart: (prod: any, variant: any) => void;
  onToggleWishlist: (productId: string) => void;
  onOpenProduct: (prod: any) => void;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenCheckout?: () => void;
  onOpenTrackOrder?: () => void;
}

const ACTIVITIES = [
  { id: "all", label: "All Training", tag: "Peak Performance" },
  { id: "run", label: "Run & Sprint", tag: "Aerodynamic Ventilation" },
  { id: "lift", label: "Gym & Strength", tag: "Ergonomic Compression" },
  { id: "recovery", label: "Recovery & Lounge", tag: "Thermal Fleece" },
];

const KINETIC_SPECS = [
  {
    icon: Activity,
    title: "4-Way Technical Stretch",
    desc: "Unrestricted range of motion tailored with ergonomic breathable micro-mesh gussets.",
  },
  {
    icon: Droplets,
    title: "DryWeave™ Moisture Dispersal",
    desc: "Hydrophobic capillary fibers evaporate perspiration 4x faster than standard cotton.",
  },
  {
    icon: Wind,
    title: "Bonded Anti-Chafe Seams",
    desc: "Ultrasonic flatlock seams engineered for long-distance marathon endurance.",
  },
  {
    icon: ShieldCheck,
    title: "Anti-Odor Silver-Ion Fibers",
    desc: "Permanent microscopic antimicrobial infusion eliminates training odor.",
  },
];

export function AthleisureStorefront({
  storeDisplayName,
  tenantSlug,
  products,
  cartItems,
  wishlist,
  finalTotal,
  onAddToCart,
  onToggleWishlist,
  onOpenProduct,
  onOpenCart,
  onOpenSearch,
  onOpenCheckout,
  onOpenTrackOrder,
}: AthleisureStorefrontProps) {
  const [selectedActivity, setSelectedActivity] = useState<string>("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickSizeMap, setQuickSizeMap] = useState<Record<string, string>>({});

  const cartCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);

  const filteredProducts = useMemo(() => {
    if (selectedActivity === "all") return products;
    if (selectedActivity === "run") {
      return products.filter((p, i) => i % 2 === 0);
    }
    if (selectedActivity === "lift") {
      return products.filter((p, i) => i % 2 === 1);
    }
    return products;
  }, [products, selectedActivity]);

  const handleSelectSize = (productId: string, size: string) => {
    setQuickSizeMap((prev) => ({ ...prev, [productId]: size }));
  };

  const handleQuickAdd = (product: any) => {
    const chosenSize = quickSizeMap[product.id] || "M";
    const variant =
      product.variants?.find((v: any) => v.title === chosenSize) ||
      product.variants?.[0] || {
        id: `var-${product.id}`,
        title: chosenSize,
        price: String(product.price),
        inventoryQuantity: 20,
      };
    onAddToCart(product, variant);
  };

  return (
    <div suppressHydrationWarning className="min-h-screen bg-[#0a0f1d] text-slate-100 font-sans selection:bg-lime-400 selection:text-zinc-950">
      {/* ─── Top Telemetry Announcement Bar ─── */}
      <div className="bg-lime-400 text-zinc-950 py-1.5 px-4 text-[11px] font-bold tracking-wider uppercase flex items-center justify-between">
        <div className="flex items-center gap-2 mx-auto">
          <Zap className="w-3.5 h-3.5 fill-zinc-950" />
          <span>SERIES 04 PRO TRAINING // 24H EXPRESS COD DISPATCH ACROSS ALL 64 DISTRICTS</span>
        </div>
        {onOpenTrackOrder && (
          <button
            onClick={onOpenTrackOrder}
            className="hidden md:inline-flex items-center gap-1 font-bold text-[10px] hover:underline"
          >
            <span>Live Dispatch</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* ─── Main Header ─── */}
      <header className="sticky top-0 z-40 bg-[#0a0f1d]/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-300 hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <a href={`/store/${tenantSlug}`} className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-lime-400 text-zinc-950 flex items-center justify-center font-black text-sm tracking-tighter shadow-md shadow-lime-400/20">
                ⚡
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base sm:text-lg tracking-tight uppercase text-white leading-none">
                  {storeDisplayName}
                </span>
                <span className="text-[9px] text-lime-400 font-semibold tracking-wider uppercase mt-0.5">
                  Performance Division
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Nav Activities */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/5 border border-white/10 rounded-full p-1">
            {ACTIVITIES.map((act) => {
              const isActive = selectedActivity === act.id;
              return (
                <button
                  key={act.id}
                  onClick={() => setSelectedActivity(act.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-1.5 ${
                    isActive
                      ? "bg-lime-400 text-zinc-950 shadow-md shadow-lime-400/20 font-bold"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>{act.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSearch}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
              aria-label="Search items"
            >
              <Search className="w-4.5 h-4.5" />
            </button>

            {onOpenCheckout && (
              <button
                onClick={onOpenCheckout}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-lime-400 hover:bg-lime-300 text-zinc-950 text-xs font-bold rounded-lg transition shadow-xs"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Express Checkout</span>
              </button>
            )}

            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-xl bg-white/10 hover:bg-white/15 text-white transition flex items-center gap-1.5"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-4.5 h-4.5 text-lime-400" />
              <span className="text-xs font-bold hidden sm:inline">৳{finalTotal.toLocaleString("en-BD")}</span>
              {cartCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-lime-400 text-zinc-950 text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 bg-[#0a0f1d] px-4 py-3 space-y-2 animate-fade-in">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Training Disciplines
            </p>
            <div className="grid grid-cols-2 gap-2">
              {ACTIVITIES.map((act) => (
                <button
                  key={act.id}
                  onClick={() => {
                    setSelectedActivity(act.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2.5 rounded-xl text-xs font-semibold text-left transition ${
                    selectedActivity === act.id
                      ? "bg-lime-400 text-zinc-950 font-bold"
                      : "bg-white/5 text-slate-200"
                  }`}
                >
                  {act.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* ─── Hero Billboard Section ─── */}
      <section className="relative overflow-hidden py-16 sm:py-24 border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-lime-400/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/25 text-lime-400 text-xs font-semibold tracking-wide uppercase">
              <Flame className="w-3.5 h-3.5" />
              <span>Series 04 // Ergonomic Athletic Fit</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white leading-tight">
              Engineered For <span className="text-lime-400">Peak Movement.</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Ultra-lightweight 4-way stretch compression apparel engineered with silver-ion
              antimicrobial fibers and capillary perspiration dispersal for intense training.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  const el = document.getElementById("athletic-catalog");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-6 py-3 rounded-xl bg-lime-400 hover:bg-lime-300 text-zinc-950 font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 shadow-md shadow-lime-400/15"
              >
                <span>Explore Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              {onOpenCheckout && (
                <button
                  onClick={onOpenCheckout}
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs uppercase tracking-wider transition border border-white/10"
                >
                  Direct Express COD
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4 Kinetic Performance Specs Bar ─── */}
      <section className="border-b border-white/10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {KINETIC_SPECS.map((spec, i) => {
              const Icon = spec.icon;
              return (
                <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                  <div className="p-2.5 rounded-xl bg-lime-400/10 text-lime-400 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wide text-white">{spec.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{spec.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Dynamic Catalog Section ─── */}
      <main id="athletic-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-lime-400">
              Active Gear Catalog ({filteredProducts.length} Articles)
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-1">
              Performance Apparel
            </h2>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {ACTIVITIES.map((act) => (
              <button
                key={act.id}
                onClick={() => setSelectedActivity(act.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
                  selectedActivity === act.id
                    ? "bg-lime-400 text-zinc-950 font-bold"
                    : "bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                {act.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid - Mobile First 2-Col */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 lg:gap-6">
          {filteredProducts.map((p, idx) => {
            const isWish = wishlist.includes(p.id);
            const currentSize = quickSizeMap[p.id] || "M";

            return (
              <div
                key={p.id}
                className="group rounded-2xl bg-white/[0.03] border border-white/10 hover:border-lime-400/50 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Image Wrap */}
                <div className="relative aspect-4/5 overflow-hidden bg-slate-900 cursor-pointer" onClick={() => onOpenProduct(p)}>
                  <img
                    src={p.imageUrl}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1.5">
                    <span className="px-2 py-0.5 sm:py-1 rounded-md bg-zinc-950/85 backdrop-blur-md text-lime-400 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider border border-lime-400/30">
                      {p.badge || (idx === 0 ? "⚡ Pro Series" : "4-Way Stretch")}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(p.id);
                    }}
                    className={`absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 sm:p-2 rounded-full backdrop-blur-md transition ${
                      isWish ? "bg-lime-400 text-zinc-950" : "bg-zinc-950/60 text-white hover:bg-zinc-950/90"
                    }`}
                    aria-label="Wishlist toggle"
                  >
                    <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWish ? "fill-zinc-950" : ""}`} />
                  </button>
                </div>

                {/* Details */}
                <div className="p-2.5 sm:p-5 flex-1 flex flex-col justify-between space-y-2.5 sm:space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-[10px] sm:text-xs font-semibold text-slate-400 mb-1">
                      <span>Series 04 Active</span>
                      <span className="text-lime-400 font-bold">★ 4.9</span>
                    </div>
                    <h3
                      onClick={() => onOpenProduct(p)}
                      className="text-xs sm:text-base font-bold text-white hover:text-lime-400 transition cursor-pointer line-clamp-1"
                    >
                      {p.title}
                    </h3>
                    <p className="hidden sm:block text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  {/* Quick Size Selection Chips */}
                  <div className="space-y-1 sm:space-y-2 pt-1.5 sm:pt-2 border-t border-white/10">
                    <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400">
                      <span>SELECT SIZE:</span>
                      <span className="text-lime-400 font-bold">{currentSize}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {["S", "M", "L", "XL"].map((sz) => (
                        <button
                          key={sz}
                          onClick={() => handleSelectSize(p.id, sz)}
                          className={`flex-1 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold rounded-md sm:rounded-lg border transition ${
                            currentSize === sz
                              ? "bg-lime-400 text-zinc-950 border-lime-400"
                              : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price & Add to Cart */}
                  <div className="flex items-center justify-between gap-1.5 pt-1.5 sm:pt-2">
                    <div>
                      <div className="text-[10px] font-semibold uppercase text-slate-400">Price (COD)</div>
                      <div className="text-xs sm:text-lg font-black text-white">
                        ৳{p.price.toLocaleString("en-BD")}
                        {p.comparePrice && p.comparePrice > p.price && (
                          <span className="text-[10px] sm:text-xs text-slate-500 line-through font-normal ml-1">
                            ৳{p.comparePrice.toLocaleString("en-BD")}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleQuickAdd(p)}
                      className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-lime-400 hover:bg-lime-300 text-zinc-950 font-bold text-[10px] sm:text-xs uppercase tracking-wider transition flex items-center justify-center gap-1 sm:gap-1.5 shadow-md shadow-lime-400/15 shrink-0 active:scale-95"
                    >
                      <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span className="hidden sm:inline">Add to Bag</span>
                      <span className="sm:hidden">Add</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* ─── Footer ─── */}
      <footer className="border-t border-white/10 bg-[#05080e] py-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-lime-400 text-zinc-950 flex items-center justify-center font-black text-xs">
              ⚡
            </div>
            <div>
              <p className="font-bold text-white text-sm">{storeDisplayName} Athletics</p>
              <p className="text-[11px] text-slate-500">© 2026 StoreSwift Athletic Engine • Bangladesh</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-[11px] font-medium">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Truck className="w-3.5 h-3.5 text-lime-400" />
              Steadfast & Pathao 24h
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-lime-400" />
              100% Genuine Lab Tested
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <RotateCcw className="w-3.5 h-3.5 text-lime-400" />
              7-Day Size Exchange
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
