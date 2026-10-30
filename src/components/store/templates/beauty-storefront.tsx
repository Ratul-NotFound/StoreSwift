"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Store,
  CheckCircle2,
  Truck,
  ShieldCheck,
  X,
  ArrowRight,
  Sparkles,
  Search,
  Star,
  Heart,
  SlidersHorizontal,
  RotateCcw,
  Check,
  Mail,
  Plus,
  Layers,
  Droplets,
  Flower2,
  ChevronRight,
  ChevronDown,
  Info
} from "lucide-react";
import { IStoreTemplate } from "@/templates/types";
import { CartItem } from "@/lib/cart";

export interface BeautyStorefrontProps {
  storeDisplayName: string;
  tenantSlug: string;
  products: Array<{
    id: string;
    title: string;
    slug: string;
    description: string;
    price: number;
    comparePrice: number;
    imageUrl: string;
    secondaryImage?: string;
    badge?: string;
    rating?: number;
    variants: any[];
  }>;
  cartItems: CartItem[];
  wishlist: string[];
  finalTotal: number;
  template: IStoreTemplate;
  onAddToCart: (prod: any, variant: any) => void;
  onToggleWishlist: (productId: string) => void;
  onOpenProduct: (prod: any) => void;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  // Demo Studio
  allCategories: string[];
  activeCategoryKey: string;
  onSelectCategory: (cat: string) => void;
  allTemplates: string[];
  templateKey: string;
  onSelectTemplate: (tKey: string) => void;
  categoriesMap: Record<string, any>;
  storeTemplatesMap: Record<string, any>;
}

// Curated Skin Concerns
const SKIN_CONCERNS = [
  { id: "all", label: "All Formulations", description: "Complete clinical botanical range" },
  { id: "hydration", label: "Glass Skin & Hydration", description: "Multi-depth molecular Hyaluronic & Tremella" },
  { id: "barrier", label: "Barrier Repair & Calm", description: "Ceramide NP lipid matrix & Colloidal Oat" },
  { id: "glow", label: "Velvet Pigments & Nourish", description: "Cold-pressed Camellia & Rosehip seed" }
];

// Active Bio-Actives Transparency Data
const CLINICAL_ACTIVES = [
  {
    name: "Tremella Fuciformis",
    potency: "Pure Botanical Extract",
    function: "Micro-Molecular Hydration",
    benefit: "Holds 500x its weight in water, penetrating deeper than synthetic hyaluronic acid for dewy glass skin."
  },
  {
    name: "Ceramide NP + AP Matrix",
    potency: "3.5% Bio-Identical Lipids",
    function: "Stratum Corneum Repair",
    benefit: "Restores compromised skin barrier, seals in trans-epidermal moisture, and prevents sensitivity flares."
  },
  {
    name: "Cold-Pressed Camellia Oil",
    potency: "100% Virgin First Press",
    function: "Antioxidant Lipid Shield",
    benefit: "Rich in vitamins A, B, D, and E with high polyphenols to neutralize environmental oxidative stress."
  },
  {
    name: "Plant Prebiotic Squalane",
    potency: "Sugar-Cane Derived 100%",
    function: "Non-Comedogenic Moisture",
    benefit: "Mimics natural skin sebum to lock in moisture without clogging pores or triggering fungal breakouts."
  }
];

export function BeautyStorefront({
  storeDisplayName,
  tenantSlug,
  products,
  cartItems,
  wishlist,
  finalTotal,
  template,
  onAddToCart,
  onToggleWishlist,
  onOpenProduct,
  onOpenCart,
  onOpenSearch,
  allCategories,
  activeCategoryKey,
  onSelectCategory,
  allTemplates,
  templateKey,
  onSelectTemplate,
  categoriesMap,
  storeTemplatesMap
}: BeautyStorefrontProps) {
  const [selectedConcern, setSelectedConcern] = useState<string>("all");
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [quickVolumeMap, setQuickVolumeMap] = useState<Record<string, string>>({});
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Filter products by skin concern / category
  const filteredProducts = products.filter((p) => {
    if (selectedConcern === "hydration") {
      return p.title.toLowerCase().includes("serum") || p.title.toLowerCase().includes("dew") || p.title.toLowerCase().includes("hyaluronic");
    }
    if (selectedConcern === "barrier") {
      return p.title.toLowerCase().includes("balm") || p.title.toLowerCase().includes("barrier") || p.title.toLowerCase().includes("lipid");
    }
    if (selectedConcern === "glow") {
      return p.title.toLowerCase().includes("lipstick") || p.title.toLowerCase().includes("matte") || p.title.toLowerCase().includes("velvet");
    }
    return true;
  });

  const handleQuickVolumeSelect = (productId: string, volume: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickVolumeMap((prev) => ({ ...prev, [productId]: volume }));
  };

  const handleCardQuickAdd = (p: typeof products[0], e: React.MouseEvent) => {
    e.stopPropagation();
    const chosenVol = quickVolumeMap[p.id];
    let matchedVariant = p.variants[0];
    if (chosenVol && p.variants.length > 0) {
      const found = p.variants.find((v) => v.title.toLowerCase().includes(chosenVol.toLowerCase()));
      if (found) matchedVariant = found;
    }
    onAddToCart(p, matchedVariant);
  };

  const handleAdd3StepBundle = () => {
    const serum = products.find((p) => p.slug.includes("serum")) || products[0];
    const balm = products.find((p) => p.slug.includes("balm")) || products[1] || products[0];
    const lip = products.find((p) => p.slug.includes("lipstick")) || products[2] || products[0];

    if (serum) onAddToCart(serum, serum.variants[0]);
    if (balm) onAddToCart(balm, balm.variants[0]);
    if (lip) onAddToCart(lip, lip.variants[0]);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#faf8f6] text-zinc-900 selection:bg-rose-500 selection:text-white">
      {/* ─── 1. Clinical Beauty Announcement Bar ────────────────────────────── */}
      <div className="py-2.5 px-4 text-xs font-medium tracking-wide bg-[#1c0f13] text-rose-200 border-b border-rose-950/80">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="hidden sm:flex items-center space-x-2 text-[11px] text-rose-300/80">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>Complimentary Deluxe Mini on Orders $45+</span>
          </div>
          <div className="mx-auto sm:mx-0 flex items-center space-x-2 text-xs font-semibold text-rose-100">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            <span>Cold-Chain Freshness Guaranteed • Inspect Tamper Seal at Doorstep</span>
          </div>
          <div className="hidden md:flex items-center space-x-3 text-[11px] text-rose-300/80 font-mono">
            <span>100% Leaping Bunny Cruelty-Free</span>
          </div>
        </div>
      </div>

      {/* ─── 2. Clean Luxe Glow Brand Header ────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-[#faf8f6]/85 backdrop-blur-md border-b border-rose-100/70 text-zinc-900 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-6">
          {/* Brand Logo & Tag */}
          <Link href={`/store/${tenantSlug}`} className="flex items-center space-x-3 flex-shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
              <Flower2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-base block leading-none text-zinc-900">
                {storeDisplayName}
              </span>
              <span className="text-[10px] text-rose-600 font-semibold block mt-1 tracking-wider uppercase">
                Clinical Botanical Labs
              </span>
            </div>
          </Link>

          {/* Clean Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs font-semibold text-zinc-700">
            <a href="#rituals" className="hover:text-rose-600 transition">Shop Rituals</a>
            <a href="#concerns" className="hover:text-rose-600 transition">Skin Concerns</a>
            <a href="#bundle" className="hover:text-rose-600 transition">3-Step System</a>
            <a href="#actives" className="hover:text-rose-600 transition">Bio-Actives</a>
            <a href="#protocol" className="hover:text-rose-600 transition">Patch Test Guarantee</a>
          </nav>

          {/* Search Trigger */}
          <div
            onClick={onOpenSearch}
            className="flex-1 max-w-xs hidden md:flex items-center space-x-2 px-3.5 py-2 bg-white/80 border border-rose-200/60 rounded-xl text-xs text-zinc-500 cursor-pointer hover:border-rose-300 hover:text-zinc-700 transition shadow-xs"
          >
            <Search className="w-3.5 h-3.5 text-rose-400" />
            <span className="truncate">Search serums, balms, actives...</span>
            <kbd className="ml-auto text-[9px] font-mono bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded border border-rose-200/50">
              /
            </kbd>
          </div>

          {/* Action Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenSearch}
              className="md:hidden p-2.5 rounded-xl hover:bg-rose-50 text-zinc-700 transition"
              aria-label="Search catalog"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-xl bg-white border border-rose-200/80 hover:bg-rose-50/60 text-zinc-900 transition flex items-center space-x-2 shadow-xs group"
              aria-label="View shopping bag"
            >
              <ShoppingBag className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold hidden sm:inline-block">Bag</span>
              {cartItems.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-600 text-white rounded-full text-[10px] font-black flex items-center justify-center shadow-xs">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ─── 3. Luminous Ethereal Hero Section ──────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-rose-100/70 bg-gradient-to-b from-[#faf8f6] via-[#f7f2ee] to-[#faf8f6] py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-rose-50 border border-rose-200/80 rounded-full text-[11px] font-semibold text-rose-800">
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              <span>Dermatologist Formulated • 100% Non-Comedogenic</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-zinc-900 leading-[1.08]">
              Pure Botanicals. <br />
              <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 bg-clip-text text-transparent">
                Clinical Bio-Actives.
              </span> <br />
              Zero Compromise.
            </h1>

            <p className="text-sm sm:text-base text-zinc-600 max-w-xl leading-relaxed">
              Formulated without parabens, synthetic fragrance, or pore-clogging silicones. Every batch is cold-chain stabilized and delivered with a tamper-evident foil seal you can inspect prior to cash on delivery.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#rituals"
                className="py-3 px-6 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-2"
              >
                <span>Shop Clinical Rituals</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              <a
                href="#bundle"
                className="py-3 px-5 bg-white border border-rose-200 hover:bg-rose-50/70 text-zinc-800 font-semibold text-xs rounded-xl shadow-xs transition flex items-center space-x-2"
              >
                <Droplets className="w-3.5 h-3.5 text-rose-600" />
                <span>The 3-Step Glass Skin System</span>
              </a>
            </div>

            {/* Micro Trust Indicators */}
            <div className="pt-6 border-t border-rose-200/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-zinc-700">
              <div className="flex items-center space-x-2 text-xs">
                <CheckCircle2 className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span className="font-medium text-[11px]">Cruelty-Free</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <ShieldCheck className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span className="font-medium text-[11px]">Hypoallergenic</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <Truck className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span className="font-medium text-[11px]">Cold-Chain Dispatched</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <RotateCcw className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span className="font-medium text-[11px]">14-Day Glow Guarantee</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-3xl overflow-hidden border border-rose-200/80 bg-white shadow-xl p-2.5">
              <div className="aspect-square rounded-2xl overflow-hidden relative group">
                <img
                  src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1000&auto=format&fit=crop&q=85"
                  alt="Pure Glow Dew Serum"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3.5 rounded-xl border border-white/60 shadow-lg text-zinc-900">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block">Award-Winning</span>
                      <p className="text-xs font-black">Pure Glow Triple Hyaluronic Dew</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-rose-700">$42.00</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-1">Multi-depth Tremella mushroom & prebiotic squalane</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. Skin Concern Navigation Filter ──────────────────────────────── */}
      <section id="concerns" className="py-10 px-4 sm:px-6 border-b border-rose-100/70 bg-white/60">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-rose-600 font-bold uppercase">
                Targeted Efficacy
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
                Shop By Skin Need & Barrier Health
              </h2>
            </div>
            <p className="text-xs text-zinc-500 max-w-sm">
              Formulated specifically to repair lipid barriers without aggravating reactive or acne-prone skin.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {SKIN_CONCERNS.map((concern) => {
              const isActive = selectedConcern === concern.id;
              return (
                <button
                  key={concern.id}
                  onClick={() => setSelectedConcern(concern.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    isActive
                      ? "bg-rose-50/90 border-rose-400 text-rose-950 shadow-xs"
                      : "bg-white border-rose-100 hover:border-rose-200 text-zinc-700"
                  }`}
                >
                  <p className={`text-xs font-bold ${isActive ? "text-rose-900" : "text-zinc-900"}`}>
                    {concern.label}
                  </p>
                  <p className="text-[10px] text-zinc-500 mt-1 leading-snug">
                    {concern.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 5. The 3-Step Glass Skin Routine Builder (Interactive Bundle) ───── */}
      <section id="bundle" className="py-16 px-4 sm:px-6 border-b border-rose-100/70 bg-gradient-to-r from-rose-50/50 via-white to-pink-50/40">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl border border-rose-200/80 p-6 sm:p-10 shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-[10px] font-bold tracking-wider uppercase border border-rose-200/60">
                  <Sparkles className="w-3 h-3 text-rose-600" />
                  <span>Curated Protocol Bundle</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900">
                  The Complete Glass Skin Routine
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Clinically sequenced for maximum penetration: Multi-depth Hyaluronic hydration followed by restorative ceramide lipid barrier occlusion and velvet lip protection.
                </p>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center space-x-2.5 text-xs text-zinc-800 font-medium">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-mono text-[10px] font-bold flex items-center justify-center">1</span>
                    <span>Pure Glow Triple Hyaluronic Dew Serum ($42.00)</span>
                  </div>
                  <div className="flex items-center space-x-2.5 text-xs text-zinc-800 font-medium">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-mono text-[10px] font-bold flex items-center justify-center">2</span>
                    <span>Whipped Botanical Lipid Barrier Balm ($36.00)</span>
                  </div>
                  <div className="flex items-center space-x-2.5 text-xs text-zinc-800 font-medium">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-mono text-[10px] font-bold flex items-center justify-center">3</span>
                    <span>Velvet Satin Moisture Camellia Lipstick ($28.00)</span>
                  </div>
                </div>

                <div className="pt-4 flex items-baseline space-x-3">
                  <span className="text-2xl font-black text-rose-700 font-mono">$89.00</span>
                  <span className="text-sm text-zinc-400 line-through font-mono">$106.00</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Save $17.00 (16% Off)
                  </span>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleAdd3StepBundle}
                    className="w-full sm:w-auto py-3 px-8 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center space-x-2 btn-press"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add Complete 3-Step Protocol to Bag</span>
                  </button>
                  <p className="text-[11px] text-zinc-500 mt-2">
                    Delivered in temperature-stabilized cold packing with tamper seals intact.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-3 gap-3">
                {[
                  {
                    step: "STEP 01 • HYDRATE",
                    title: "Triple Hyaluronic Dew",
                    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=80",
                    volume: "30ml Dropper"
                  },
                  {
                    step: "STEP 02 • SEAL BARRIER",
                    title: "Lipid Barrier Balm",
                    image: "https://images.unsplash.com/photo-1608248597359-38c2020e26b1?w=500&auto=format&fit=crop&q=80",
                    volume: "50ml Amber Jar"
                  },
                  {
                    step: "STEP 03 • PROTECT",
                    title: "Velvet Satin Lipstick",
                    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&auto=format&fit=crop&q=80",
                    volume: "Camellia Tint"
                  }
                ].map((item, idx) => (
                  <div key={idx} className="bg-rose-50/50 rounded-2xl p-2.5 border border-rose-100 flex flex-col justify-between">
                    <div className="aspect-square rounded-xl overflow-hidden bg-white mb-2 border border-rose-100/60">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono font-bold text-rose-600 block">{item.step}</span>
                      <p className="text-xs font-bold text-zinc-900 leading-tight mt-0.5">{item.title}</p>
                      <span className="text-[10px] text-zinc-500 block mt-1">{item.volume}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. Main Product Catalog (Square 1:1 Aspect Ratio) ──────────────── */}
      <section id="rituals" className="py-16 px-4 sm:px-6 max-w-6xl mx-auto w-full flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-rose-100/80 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-[10px] font-mono uppercase tracking-widest text-rose-600 font-bold mb-1">
              <span>Clean Formulations</span>
              <span>•</span>
              <span>Hypoallergenic Verified</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
              Clinical Botanical Formulations
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Showing {filteredProducts.length} verified dermatologist-grade treatments
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-zinc-500 text-[11px]">Filter Need:</span>
            <span className="font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200/60 capitalize">
              {selectedConcern === "all" ? "All Needs" : selectedConcern}
            </span>
          </div>
        </div>

        {/* Disciplined Beauty Product Grid (Square 1:1) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
          {filteredProducts.map((p) => {
            const isHovered = hoveredCardId === p.id;
            const chosenVolume = quickVolumeMap[p.id] || (p.variants[0]?.title.split(": ")[1] || "30ml");
            const isSaved = wishlist.includes(p.id);

            return (
              <div
                key={p.id}
                onMouseEnter={() => setHoveredCardId(p.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                onClick={() => onOpenProduct(p)}
                className="group bg-white rounded-2xl border border-rose-100 hover:border-rose-300 transition-all duration-300 p-3.5 flex flex-col justify-between shadow-xs hover:shadow-md cursor-pointer"
              >
                {/* 1:1 Square Media Frame */}
                <div>
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-rose-50/40 border border-rose-100/50 mb-3.5">
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className={`w-full h-full object-cover transition-all duration-500 ${
                        isHovered && p.secondaryImage ? "opacity-0 scale-105" : "opacity-100 scale-100"
                      }`}
                    />
                    {p.secondaryImage && (
                      <img
                        src={p.secondaryImage}
                        alt={`${p.title} Texture Swatch`}
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
                          isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95"
                        }`}
                      />
                    )}

                    {/* Clean Beauty Badge */}
                    <div className="absolute top-2.5 left-2.5 z-10">
                      <span className="px-2.5 py-1 bg-white/95 backdrop-blur-md rounded-full text-[10px] font-bold text-rose-700 border border-rose-200/80 shadow-xs uppercase tracking-wider">
                        {p.badge || "Clean Protocol"}
                      </span>
                    </div>

                    {/* Wishlist Heart Action */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(p.id);
                      }}
                      className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        isSaved
                          ? "bg-rose-600 text-white shadow-xs"
                          : "bg-white/90 text-zinc-600 hover:bg-white hover:text-rose-600 shadow-xs"
                      }`}
                      aria-label="Save to favorites"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
                    </button>

                    {/* Doorstep Inspection Seal Badge */}
                    <div className="absolute bottom-2.5 left-2.5 z-10">
                      <span className="px-2 py-0.5 bg-black/75 backdrop-blur-md text-white rounded text-[9px] font-mono tracking-wide">
                        Tamper Foil Sealed
                      </span>
                    </div>
                  </div>

                  {/* Volume Variant Selector Pills */}
                  {p.variants.length > 0 && (
                    <div className="mb-3 space-y-1.5" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-zinc-500 font-medium">Select Volume:</span>
                        <span className="font-mono text-rose-700 font-bold">{chosenVolume}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {p.variants.map((v, vIdx) => {
                          const val = v.title.includes(": ") ? v.title.split(": ")[1] : v.title;
                          const isSel = chosenVolume.toLowerCase() === val.toLowerCase();
                          return (
                            <button
                              key={vIdx}
                              onClick={(e) => handleQuickVolumeSelect(p.id, val, e)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition ${
                                isSel
                                  ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                                  : "bg-rose-50/60 hover:bg-rose-100/70 text-zinc-700 border-rose-200/70"
                              }`}
                            >
                              {val}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Rating & Reviews */}
                  <div className="flex items-center space-x-1.5 mb-1.5">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    <span className="text-[11px] font-mono font-bold text-zinc-700">5.0</span>
                    <span className="text-[10px] text-zinc-400 font-mono">(48 verified)</span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-sm font-bold text-zinc-900 group-hover:text-rose-600 transition leading-snug">
                    {p.title}
                  </h3>
                  <p className="text-xs text-zinc-500 line-clamp-2 mt-1 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                {/* Price & Add to Bag */}
                <div className="pt-4 mt-3 border-t border-rose-100 flex items-center justify-between">
                  <div>
                    <span className="text-base font-black text-zinc-900 font-mono">
                      ${p.price.toFixed(2)}
                    </span>
                    {p.comparePrice > p.price && (
                      <span className="text-xs text-zinc-400 line-through font-mono ml-1.5">
                        ${p.comparePrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => handleCardQuickAdd(p, e)}
                    className="py-2 px-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-1.5 btn-press"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Bag</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── 7. Bio-Actives & Formula Transparency Showcase ────────────────── */}
      <section id="actives" className="py-16 px-4 sm:px-6 border-y border-rose-100/70 bg-white">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="max-w-2xl space-y-2">
            <span className="text-[10px] font-mono tracking-widest text-rose-600 font-bold uppercase">
              Formula Integrity
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
              Clinical Actives. Zero Fillers.
            </h2>
            <p className="text-xs text-zinc-600 leading-relaxed">
              We list exact active concentrations and molecular weights. What you apply on your skin is pure, bio-compatible, and backed by independent clinical trials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CLINICAL_ACTIVES.map((active, i) => (
              <div
                key={i}
                className="bg-rose-50/40 rounded-2xl p-5 border border-rose-100/80 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-bold text-rose-700 uppercase bg-rose-100/80 px-2 py-0.5 rounded">
                      {active.potency}
                    </span>
                    <Droplets className="w-4 h-4 text-rose-500" />
                  </div>
                  <h3 className="text-sm font-bold text-zinc-900 leading-tight">
                    {active.name}
                  </h3>
                  <p className="text-[11px] font-mono text-zinc-500">
                    Function: {active.function}
                  </p>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    {active.benefit}
                  </p>
                </div>

                <div className="pt-2 border-t border-rose-100 text-[10px] font-semibold text-rose-700">
                  Verified Bio-Available
                </div>
              </div>
            ))}
          </div>

          {/* The Clean Formula "Never List" */}
          <div className="bg-[#faf8f6] rounded-2xl p-6 border border-rose-200/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                  The Luxe Glow Standard (The Never List)
                </h4>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Every formula is 100% free from the following 20+ irritants:
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-[10px] font-medium text-zinc-700">
                {["0% Parabens", "0% Sulfates", "0% Phthalates", "0% Synthetic Dyes", "0% Silicones", "0% Mineral Oil", "0% Animal Byproducts"].map((item) => (
                  <span key={item} className="bg-white px-2.5 py-1 rounded-lg border border-rose-200/50 shadow-2xs font-mono">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 8. Dermatologist Patch Test & Doorstep Freshness Protocol ──────── */}
      <section id="protocol" className="py-16 px-4 sm:px-6 border-b border-rose-100/70 bg-[#faf8f6]">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-[10px] font-bold tracking-wider uppercase border border-rose-200/60">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
              <span>Doorstep Freshness & Safety Guarantee</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
              The Doorstep Foil Seal & Patch Test Protocol
            </h2>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Skincare requires absolute confidence. You have the right to inspect the packaging and seal before paying the delivery courier.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Inspect Tamper Foil Seal",
                desc: "Check the tamper-evident holographic foil on the bottle cap or jar rim prior to cash payment. If any seal is broken, refuse parcel without charge.",
                highlight: "Zero Advance Payment"
              },
              {
                step: "02",
                title: "Cold-Chain Batch Timestamp",
                desc: "Every unit bears an embossed lot code and production date indicating cold-storage dispatch within 30 days of synthesis.",
                highlight: "Fresh Batch Guaranteed"
              },
              {
                step: "03",
                title: "14-Day Patch Test Promise",
                desc: "Apply a test drop behind your ear or inner wrist. If you experience any sensitivity or breakout within 14 days, receive an instant credit or exchange.",
                highlight: "100% Risk Free"
              }
            ].map((card) => (
              <div key={card.step} className="bg-white rounded-2xl p-6 border border-rose-100 shadow-xs space-y-3">
                <span className="text-2xl font-black font-mono text-rose-600 block">{card.step}</span>
                <h3 className="text-sm font-bold text-zinc-900">{card.title}</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">{card.desc}</p>
                <div className="pt-2 border-t border-rose-100 text-[10px] font-mono font-bold text-rose-700">
                  {card.highlight}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 9. Verified Patron Skin Diaries (Reviews) ──────────────────────── */}
      <section className="py-16 px-4 sm:px-6 border-b border-rose-100/70 bg-white">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[10px] font-mono tracking-widest text-rose-600 font-bold uppercase">
              Real Skin Diaries
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
              Verified Patron Clinical Results
            </h2>
            <p className="text-xs text-zinc-500">
              Reviews from patrons with diverse skin barrier sensitivities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                author: "Sarah L.",
                skinType: "Skin: Sensitive & Dehydrated",
                routine: "Used: Triple Hyaluronic Dew for 3 weeks",
                comment: "I have eczema-prone cheeks that sting with almost any serum. This gave me immediate glass-skin hydration without a hint of redness. Inspecting the foil seal with the courier was wonderful.",
                rating: 5
              },
              {
                author: "Chloe M.",
                skinType: "Skin: Combination / Hormonal Breakouts",
                routine: "Used: Lipid Barrier Balm at night",
                comment: "The barrier balm melts right into skin without feeling like an oil slick. My morning flakiness completely vanished within 4 days. Absolutely non-comedogenic.",
                rating: 5
              },
              {
                author: "Dr. Rachel K.",
                skinType: "Skin: Normal to Dry",
                routine: "Used: 3-Step Glass Skin Protocol",
                comment: "As a dermatology resident, I examine formulations strictly. The concentration of Tremella mushroom and bio-identical ceramides here matches clinical luxury brands at triple the price.",
                rating: 5
              }
            ].map((rev, i) => (
              <div key={i} className="bg-[#faf8f6] rounded-2xl p-6 border border-rose-100/80 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-400 space-x-0.5">
                      {[...Array(rev.rating)].map((_, idx) => (
                        <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200/50">
                      Verified Buyer
                    </span>
                  </div>

                  <p className="text-xs text-zinc-700 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-3 border-t border-rose-200/50 text-[11px]">
                  <p className="font-bold text-zinc-900">{rev.author}</p>
                  <p className="text-rose-700 font-mono text-[10px]">{rev.skinType}</p>
                  <p className="text-zinc-500 text-[10px]">{rev.routine}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 10. VIP Glow Club Newsletter ───────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 bg-[#faf8f6] border-b border-rose-100/70">
        <div className="max-w-xl mx-auto text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="text-2xl font-black tracking-tight text-zinc-900">
            Join The {storeDisplayName} Glow Club
          </h3>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Receive 10% off your first cash on delivery order, routine consultations with our cosmetic chemists, and complimentary deluxe samples.
          </p>

          {newsletterSubscribed ? (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900 font-semibold space-y-1">
              <div className="flex items-center justify-center space-x-1.5 text-rose-700">
                <Check className="w-4 h-4" />
                <span>Welcome to the Glow Club!</span>
              </div>
              <p className="text-[11px] text-zinc-600 font-normal">
                Use code <strong className="font-mono text-rose-700 font-bold">GLOW10</strong> for 10% off at checkout.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (newsletterEmail) setNewsletterSubscribed(true);
              }}
              className="flex gap-2 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="Enter your email address..."
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                className="flex-1 px-4 py-2.5 bg-white border border-rose-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-rose-500 shadow-xs"
              />
              <button
                type="submit"
                className="py-2.5 px-5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition btn-press"
              >
                Claim 10%
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ─── 11. Floating Demo Studio Pill ──────────────────────────────────── */}
      <div className="fixed bottom-5 right-5 z-40">
        {isThemeMenuOpen ? (
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-rose-200 p-4 w-72 text-zinc-900 space-y-3">
            <div className="flex items-center justify-between border-b border-rose-100 pb-2">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="text-xs font-bold">Demo Studio</span>
              </div>
              <button
                onClick={() => setIsThemeMenuOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-600 rounded-lg hover:bg-rose-50"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                Category Psychology:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {allCategories.map((cKey) => (
                  <button
                    key={cKey}
                    onClick={() => {
                      onSelectCategory(cKey);
                      setIsThemeMenuOpen(false);
                    }}
                    className={`px-2 py-1.5 rounded-lg text-[10px] font-semibold text-left truncate transition ${
                      activeCategoryKey === cKey
                        ? "bg-rose-600 text-white"
                        : "bg-rose-50/60 hover:bg-rose-100/70 text-zinc-700"
                    }`}
                  >
                    {categoriesMap[cKey]?.name || cKey}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-rose-100">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                Store Template:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {allTemplates.map((tKey) => (
                  <button
                    key={tKey}
                    onClick={() => {
                      onSelectTemplate(tKey);
                      setIsThemeMenuOpen(false);
                    }}
                    className={`px-2 py-1.5 rounded-lg text-[10px] font-semibold text-left truncate transition ${
                      templateKey === tKey
                        ? "bg-zinc-900 text-white"
                        : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
                    }`}
                  >
                    {storeTemplatesMap[tKey]?.name.split(" ")[0] || tKey}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsThemeMenuOpen(true)}
            className="bg-zinc-950/90 hover:bg-zinc-900 text-white backdrop-blur-md px-4 py-2.5 rounded-full text-xs font-semibold shadow-2xl border border-white/10 flex items-center space-x-2 transition hover:scale-105"
            title="Switch template style or department"
          >
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
            <span>Theme: <strong>{template.name.split(" ")[0]}</strong></span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </button>
        )}
      </div>

      {/* ─── 12. Luxe Glow Tailored Store Footer ────────────────────────────── */}
      <footer className="py-12 px-4 sm:px-6 bg-[#180d11] text-rose-100 border-t border-rose-950 text-xs">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <span className="font-black text-sm uppercase tracking-wider text-white">
              {storeDisplayName}
            </span>
            <p className="text-xs text-rose-300/80 leading-relaxed">
              Clinical botanical skincare, cold-chain stabilized and delivered with doorstep tamper foil verification.
            </p>
            <p className="text-[11px] text-rose-400/60 font-mono">
              © 2026 {storeDisplayName}. All rights reserved.
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-xs uppercase tracking-wider text-white block">
              Formulations
            </span>
            <ul className="space-y-1.5 text-rose-300/80">
              <li><a href="#rituals" className="hover:text-white transition">Hyaluronic Dew Serums</a></li>
              <li><a href="#rituals" className="hover:text-white transition">Ceramide Barrier Balms</a></li>
              <li><a href="#rituals" className="hover:text-white transition">Velvet Moisture Lipsticks</a></li>
              <li><a href="#bundle" className="hover:text-white transition">3-Step Glass Skin System</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-xs uppercase tracking-wider text-white block">
              Patron Services
            </span>
            <ul className="space-y-1.5 text-rose-300/80">
              <li><span>Doorstep Cash on Delivery</span></li>
              <li><span>Tamper Foil Seal Inspection</span></li>
              <li><span>14-Day Patch Test Glow Guarantee</span></li>
              <li><span>Ingredient Clinical Trials</span></li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-xs uppercase tracking-wider text-white block">
              Quality & Safety
            </span>
            <p className="text-rose-300/80 leading-relaxed">
              Nationwide cash on delivery. Inspect the bottle seal and lot code in person prior to tender.
            </p>
            <div className="inline-flex items-center space-x-1.5 text-rose-300 font-mono text-[11px] pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
              <span>Doorstep Inspection Protocol</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
