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
  Coffee,
  Leaf,
  Droplet,
  Sun,
  ChevronRight,
  ChevronDown,
  Info
} from "lucide-react";
import { IStoreTemplate } from "@/templates/types";
import { CartItem } from "@/lib/cart";

export interface PantryStorefrontProps {
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

// Pantry Provisions Categories
const PANTRY_CATEGORIES = [
  { id: "all", label: "All Farmstead Provisions", subtitle: "Single-origin micro-lots & cold-pressed oils" },
  { id: "coffee", label: "Micro-Lot Specialty Coffee", subtitle: "Drum roasted within 48h of order dispatch" },
  { id: "honey", label: "Raw Alpine Honey", subtitle: "Unfiltered, unheated with wild propolis intact" },
  { id: "olive_oil", label: "Early-Harvest Olive Oil", subtitle: "Single-estate cold-pressed with acidity <0.18%" }
];

// Regenerative Terroir Standards
const PANTRY_STANDARDS = [
  {
    pillar: "48-Hour Micro-Lot Roasting",
    spec: "Small-Batch Cast Iron Drum Roasted",
    detail: "Coffee is roasted in micro-lots within 48 hours of dispatch. Sealed with one-way degassing valves to preserve aromatic volatile oils."
  },
  {
    pillar: "Raw Unheated Purity",
    spec: "100% Unpasteurized Alpine Comb",
    detail: "Never heated above hive temperature (95°F). Raw wild propolis, beeswax micro-particles, and active bee enzymes remain intact."
  },
  {
    pillar: "Ultra-Low Acidity & High Polyphenol",
    spec: "Koroneiki Early Harvest (<0.18% Acidity)",
    detail: "Hand-picked green olives milled within 4 hours of harvest. Contains over 650mg/kg of antioxidant oleocanthal polyphenols."
  },
  {
    pillar: "Zero Landfill Packaging",
    spec: "Compostable Pouches & Recycled UV Glass",
    detail: "All dry pouches are 100% home compostable plant fiber. Liquid provisions are bottled in heavy amber UV-protective glass."
  }
];

export function PantryStorefront({
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
}: PantryStorefrontProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [quickOptionMap, setQuickOptionMap] = useState<Record<string, string>>({});
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Filter products by pantry category
  const filteredProducts = products.filter((p) => {
    if (selectedCategory === "coffee") {
      return p.title.toLowerCase().includes("coffee") || p.title.toLowerCase().includes("yirgacheffe") || p.title.toLowerCase().includes("roast");
    }
    if (selectedCategory === "honey") {
      return p.title.toLowerCase().includes("honey") || p.title.toLowerCase().includes("alpine") || p.title.toLowerCase().includes("wild");
    }
    if (selectedCategory === "olive_oil") {
      return p.title.toLowerCase().includes("olive") || p.title.toLowerCase().includes("oil") || p.title.toLowerCase().includes("koroneiki");
    }
    return true;
  });

  const handleQuickOptionSelect = (productId: string, opt: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickOptionMap((prev) => ({ ...prev, [productId]: opt }));
  };

  const handleCardQuickAdd = (p: typeof products[0], e: React.MouseEvent) => {
    e.stopPropagation();
    const chosenOpt = quickOptionMap[p.id];
    let matchedVariant = p.variants[0];
    if (chosenOpt && p.variants.length > 0) {
      const found = p.variants.find((v) => v.title.toLowerCase().includes(chosenOpt.toLowerCase()));
      if (found) matchedVariant = found;
    }
    onAddToCart(p, matchedVariant);
  };

  const handleAddPantryEnsemble = () => {
    const coffee = products.find((p) => p.slug.includes("coffee")) || products[0];
    const honey = products.find((p) => p.slug.includes("honey")) || products[1] || products[0];
    const oil = products.find((p) => p.slug.includes("olive") || p.slug.includes("oil")) || products[2] || products[0];

    if (coffee) onAddToCart(coffee, coffee.variants[0]);
    if (honey) onAddToCart(honey, honey.variants[0]);
    if (oil) onAddToCart(oil, oil.variants[0]);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f8f9f5] text-stone-900 selection:bg-emerald-800 selection:text-white">
      {/* ─── 1. Farmstead Utility Bar ───────────────────────────────────────── */}
      <div className="py-2.5 px-4 text-xs font-mono tracking-wide bg-[#111c16] text-emerald-200 border-b border-emerald-950">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="hidden sm:flex items-center space-x-2 text-[11px] text-emerald-300/80">
            <Leaf className="w-3.5 h-3.5 text-emerald-400" />
            <span>Regenerative Organic Farmstead • Direct-Trade Sourced</span>
          </div>
          <div className="mx-auto sm:mx-0 flex items-center space-x-2 text-xs font-semibold text-emerald-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Doorstep Freshness & Aroma Inspection • Pay on Delivery</span>
          </div>
          <div className="hidden md:flex items-center space-x-3 text-[11px] text-emerald-300/80 font-mono">
            <span>Home Compostable Packaging</span>
          </div>
        </div>
      </div>

      {/* ─── 2. Clean Farmstead Brand Header ────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-[#f8f9f5]/90 backdrop-blur-md border-b border-stone-200/80 text-stone-900 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-6">
          {/* Brand Logo & Farmstead Tag */}
          <Link href={`/store/${tenantSlug}`} className="flex items-center space-x-3 flex-shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-800 to-green-950 text-emerald-300 flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform border border-emerald-700/50">
              <Coffee className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-base block leading-none font-sans text-stone-950">
                {storeDisplayName}
              </span>
              <span className="text-[10px] text-emerald-800 font-semibold block mt-1 tracking-wider uppercase font-mono">
                Regenerative Farmstead Provisions
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs font-medium text-stone-700">
            <a href="#provisions" className="hover:text-emerald-800 transition">Pantry Provisions</a>
            <a href="#categories" className="hover:text-emerald-800 transition">Micro-Lots</a>
            <a href="#standards" className="hover:text-emerald-800 transition">Farmgate Standards</a>
            <a href="#ensemble" className="hover:text-emerald-800 transition">Breakfast Ensemble</a>
            <a href="#aroma" className="hover:text-emerald-800 transition">Aroma Doorstep Check</a>
          </nav>

          {/* Search Trigger */}
          <div
            onClick={onOpenSearch}
            className="flex-1 max-w-xs hidden md:flex items-center space-x-2 px-3.5 py-2 bg-white/90 border border-stone-300/80 rounded-xl text-xs text-stone-500 cursor-pointer hover:border-emerald-700/50 hover:text-stone-800 transition shadow-2xs font-sans"
          >
            <Search className="w-3.5 h-3.5 text-emerald-700" />
            <span className="truncate">Search Ethiopian coffee, raw honey, olive oil...</span>
            <kbd className="ml-auto text-[9px] font-mono bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded border border-stone-200">
              /
            </kbd>
          </div>

          {/* Action Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenSearch}
              className="md:hidden p-2.5 rounded-xl hover:bg-stone-200/50 text-stone-700 transition"
              aria-label="Search catalog"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-emerald-50 transition flex items-center space-x-2 shadow-xs group"
              aria-label="View shopping bag"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-300 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold hidden sm:inline-block">Pantry Bag</span>
              {cartItems.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-500 text-stone-950 rounded-full text-[10px] font-black flex items-center justify-center shadow-xs">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ─── 3. Organic Farmstead Hero Section ───────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-stone-200/80 bg-gradient-to-b from-[#f8f9f5] via-[#edf1e6] to-[#f8f9f5] py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-100/80 border border-emerald-300/70 rounded-full text-[11px] font-semibold text-emerald-950 font-mono">
              <Leaf className="w-3.5 h-3.5 text-emerald-700" />
              <span>100% Certified Organic • Micro-Lot Drum Roasted Within 48h</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-stone-950 leading-[1.08]">
              Single-Origin Terroir. <br />
              <span className="text-emerald-800 italic font-normal">
                Direct From Regenerative Soil.
              </span> <br />
              Zero Industrial Adulteration.
            </h1>

            <p className="text-sm sm:text-base text-stone-600 max-w-xl leading-relaxed">
              Ethically harvested Ethiopian heirloom coffee beans, unheated alpine wildflower honey with natural propolis, and cold-pressed Koroneiki olive oil with acidity below 0.18%. Inspect roast dates and aroma valves at your door prior to cash payment.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#provisions"
                className="py-3 px-6 bg-emerald-900 hover:bg-emerald-800 text-emerald-100 font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-2"
              >
                <span>Explore Farmstead Provisions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              <a
                href="#standards"
                className="py-3 px-5 bg-white border border-stone-300/80 hover:bg-stone-100 text-stone-800 font-semibold text-xs rounded-xl shadow-xs transition flex items-center space-x-2"
              >
                <Droplet className="w-3.5 h-3.5 text-emerald-700" />
                <span>Single-Origin Terroir Specs</span>
              </a>
            </div>

            {/* Micro Trust Indicators */}
            <div className="pt-6 border-t border-stone-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-stone-700 font-mono">
              <div className="flex items-center space-x-2 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span className="font-medium text-[11px]">Direct-Trade</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span className="font-medium text-[11px]">Roast Within 48h</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <Truck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span className="font-medium text-[11px]">Aroma Check (COD)</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <RotateCcw className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span className="font-medium text-[11px]">Home Compostable</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-3xl overflow-hidden border border-emerald-900/20 bg-white shadow-xl p-2.5">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden relative group">
                <img
                  src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1000&auto=format&fit=crop&q=85"
                  alt="Single-Origin Yirgacheffe Heirloom Coffee"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 bg-emerald-950/90 backdrop-blur-md p-3.5 rounded-xl border border-emerald-800 shadow-lg text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">Micro-Lot Sourcing</span>
                      <p className="text-xs font-bold">Ethiopian Yirgacheffe Heirloom (1kg)</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-300">$24.50</span>
                  </div>
                  <p className="text-[10px] text-emerald-200/80 mt-1">Bergamot citrus • Candied peach • Fresh drum roasted</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. Farmstead Categories Filter ─────────────────────────────────── */}
      <section id="categories" className="py-10 px-4 sm:px-6 border-b border-stone-200/80 bg-white/70">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-emerald-800 font-bold uppercase">
                Farmstead Terroir
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-stone-950 tracking-tight">
                Curated Culinary Provisions
              </h2>
            </div>
            <p className="text-xs text-stone-500 max-w-sm">
              Each lot is single-origin traceable with harvest altitude, estate coordinates, and farmer co-op names printed on every pouch.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {PANTRY_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    isActive
                      ? "bg-emerald-900 border-emerald-900 text-white shadow-xs"
                      : "bg-white border-stone-200 hover:border-emerald-700/50 text-stone-800"
                  }`}
                >
                  <p className={`text-xs font-bold ${isActive ? "text-emerald-300" : "text-stone-900"}`}>
                    {cat.label}
                  </p>
                  <p className={`text-[10px] mt-1 leading-snug ${isActive ? "text-emerald-200/80" : "text-stone-500"}`}>
                    {cat.subtitle}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 5. Terroir & Freshness Standards Breakdown ─────────────────────── */}
      <section id="standards" className="py-16 px-4 sm:px-6 border-b border-stone-200/80 bg-white">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="max-w-2xl space-y-2">
            <span className="text-[10px] font-mono tracking-widest text-emerald-800 font-bold uppercase">
              Provenance Standards
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-950 tracking-tight">
              Regenerative Farmgate Integrity
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              We never blend harvests or source from opaque commercial aggregators. Everything is 100% single-estate, unpasteurized, and chemical-free.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PANTRY_STANDARDS.map((std, i) => (
              <div
                key={i}
                className="bg-[#f8f9f5] rounded-2xl p-5 border border-stone-200/80 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-bold text-emerald-800 uppercase bg-emerald-100/80 px-2 py-0.5 rounded">
                      Certified Purity
                    </span>
                    <Sun className="w-4 h-4 text-emerald-700" />
                  </div>
                  <h3 className="text-sm font-bold text-stone-950 leading-tight">
                    {std.pillar}
                  </h3>
                  <p className="text-[11px] font-mono text-emerald-800 font-semibold">
                    {std.spec}
                  </p>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {std.detail}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-200 text-[10px] font-mono text-emerald-800 font-bold">
                  Single-Origin Verified
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6. The Farmstead Breakfast & Pantry Ensemble (1-Click Upsell) ──── */}
      <section id="ensemble" className="py-16 px-4 sm:px-6 border-b border-stone-200/80 bg-gradient-to-r from-emerald-50/50 via-[#f8f9f5] to-stone-100">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl border border-stone-300/80 p-6 sm:p-10 shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-100 text-emerald-950 rounded-full text-[10px] font-bold tracking-wider uppercase border border-emerald-300 font-mono">
                  <Leaf className="w-3 h-3 text-emerald-800" />
                  <span>Harvest Pantry Package</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-950">
                  The Complete Farmstead Pantry Trio
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  The morning kitchen ritual: Micro-lot Ethiopian Yirgacheffe coffee paired with unfiltered alpine wildflower honey and early-harvest Koroneiki extra virgin olive oil.
                </p>

                <div className="space-y-2 pt-2 text-xs">
                  <div className="flex items-center space-x-2.5 text-stone-800 font-medium">
                    <span className="w-5 h-5 rounded-full bg-emerald-900 text-emerald-300 font-mono text-[10px] font-bold flex items-center justify-center">1</span>
                    <span>Single-Origin Yirgacheffe Coffee 1kg ($24.50)</span>
                  </div>
                  <div className="flex items-center space-x-2.5 text-stone-800 font-medium">
                    <span className="w-5 h-5 rounded-full bg-emerald-900 text-emerald-300 font-mono text-[10px] font-bold flex items-center justify-center">2</span>
                    <span>Raw Wild Alpine High-Meadow Honey 500g ($18.00)</span>
                  </div>
                  <div className="flex items-center space-x-2.5 text-stone-800 font-medium">
                    <span className="w-5 h-5 rounded-full bg-emerald-900 text-emerald-300 font-mono text-[10px] font-bold flex items-center justify-center">3</span>
                    <span>Early-Harvest Koroneiki EVOO 500ml ($29.00)</span>
                  </div>
                </div>

                <div className="pt-4 flex items-baseline space-x-3">
                  <span className="text-2xl font-black text-emerald-950 font-mono">$62.00</span>
                  <span className="text-sm text-stone-400 line-through font-mono">$71.50</span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300">
                    Save $9.50 (13% Off)
                  </span>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleAddPantryEnsemble}
                    className="w-full sm:w-auto py-3 px-8 bg-emerald-900 hover:bg-emerald-800 text-emerald-100 font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center space-x-2 btn-press"
                  >
                    <ShoppingBag className="w-4 h-4 text-emerald-300" />
                    <span>Add Complete Pantry Trio to Bag</span>
                  </button>
                  <p className="text-[11px] text-stone-500 mt-2">
                    Shipped in insulated protective cartons with aroma valve inspection guaranteed.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-3 gap-3">
                {[
                  {
                    step: "COFFEE 01",
                    title: "Yirgacheffe Coffee",
                    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80",
                    detail: "1kg Whole Bean"
                  },
                  {
                    step: "HONEY 02",
                    title: "Raw Alpine Honey",
                    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&auto=format&fit=crop&q=80",
                    detail: "500g Raw Comb"
                  },
                  {
                    step: "OIL 03",
                    title: "Koroneiki EVOO",
                    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80",
                    detail: "500ml Dark UV Glass"
                  }
                ].map((item, idx) => (
                  <div key={idx} className="bg-[#f8f9f5] rounded-2xl p-2.5 border border-stone-200 flex flex-col justify-between">
                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-white mb-2 border border-stone-200">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono font-bold text-emerald-800 block">{item.step}</span>
                      <p className="text-xs font-bold text-stone-900 leading-tight mt-0.5">{item.title}</p>
                      <span className="text-[10px] text-stone-500 block mt-1">{item.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. Main Pantry Product Catalog Grid (4:3 Ratio) ────────────────── */}
      <section id="provisions" className="py-16 px-4 sm:px-6 max-w-6xl mx-auto w-full flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-stone-200 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-[10px] font-mono uppercase tracking-widest text-emerald-800 font-bold mb-1">
              <span>Direct-Trade Farmgate</span>
              <span>•</span>
              <span>Certified Organic</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-950 tracking-tight">
              Farmstead Pantry Provisions
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Showing {filteredProducts.length} certified organic and single-origin estate harvests
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-stone-500 text-[11px]">Active Category:</span>
            <span className="font-bold text-emerald-950 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 capitalize">
              {selectedCategory === "all" ? "All Provisions" : selectedCategory}
            </span>
          </div>
        </div>

        {/* Disciplined 4:3 Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
          {filteredProducts.map((p) => {
            const isHovered = hoveredCardId === p.id;
            const chosenOpt = quickOptionMap[p.id] || (p.variants[0]?.title || "Standard");
            const isSaved = wishlist.includes(p.id);

            return (
              <div
                key={p.id}
                onMouseEnter={() => setHoveredCardId(p.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                onClick={() => onOpenProduct(p)}
                className="group bg-white rounded-2xl border border-stone-200 hover:border-emerald-700/50 transition-all duration-300 p-3.5 flex flex-col justify-between shadow-2xs hover:shadow-md cursor-pointer"
              >
                {/* 4:3 Ratio Media Frame */}
                <div>
                  <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-stone-100 border border-stone-200 mb-3.5">
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
                        alt={`${p.title} Harvest Terroir`}
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
                          isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95"
                        }`}
                      />
                    )}

                    {/* Fresh Harvest Badge */}
                    <div className="absolute top-2.5 left-2.5 z-10">
                      <span className="px-2.5 py-1 bg-white/95 backdrop-blur-md rounded-full text-[10px] font-bold text-emerald-900 border border-emerald-300 shadow-2xs uppercase tracking-wider font-mono">
                        {p.badge || "Organic"}
                      </span>
                    </div>

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(p.id);
                      }}
                      className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        isSaved
                          ? "bg-emerald-700 text-white shadow-xs"
                          : "bg-white/90 text-stone-600 hover:bg-white hover:text-emerald-800 shadow-2xs"
                      }`}
                      aria-label="Save to favorites"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
                    </button>

                    {/* Aroma Inspection Badge */}
                    <div className="absolute bottom-2.5 left-2.5 z-10">
                      <span className="px-2 py-0.5 bg-black/80 backdrop-blur-md text-emerald-300 rounded text-[9px] font-mono tracking-wide">
                        Aroma Valve Sealed
                      </span>
                    </div>
                  </div>

                  {/* Quick Variant / Grind Selector Pills */}
                  {p.variants.length > 0 && (
                    <div className="mb-3 space-y-1.5" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-stone-500">Selection:</span>
                        <span className="text-emerald-800 font-bold">{chosenOpt}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 font-mono">
                        {p.variants.map((v, vIdx) => {
                          const val = v.title;
                          const isSel = chosenOpt.toLowerCase() === val.toLowerCase();
                          return (
                            <button
                              key={vIdx}
                              onClick={(e) => handleQuickOptionSelect(p.id, val, e)}
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition ${
                                isSel
                                  ? "bg-emerald-900 text-emerald-200 border-emerald-900"
                                  : "bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200"
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
                  <div className="flex items-center space-x-1.5 mb-1.5 font-mono">
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    <span className="text-[11px] font-bold text-stone-800">5.0</span>
                    <span className="text-[10px] text-stone-400">(48 cuppings)</span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-sm font-bold text-stone-900 group-hover:text-emerald-800 transition leading-snug">
                    {p.title}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                {/* Price & Add to Bag */}
                <div className="pt-4 mt-3 border-t border-stone-200 flex items-center justify-between font-mono">
                  <div>
                    <span className="text-base font-black text-stone-950">
                      ${p.price.toFixed(2)}
                    </span>
                    {p.comparePrice > p.price && (
                      <span className="text-xs text-stone-400 line-through ml-1.5">
                        ${p.comparePrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => handleCardQuickAdd(p, e)}
                    className="py-2 px-3.5 bg-emerald-900 hover:bg-emerald-800 text-emerald-100 font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-1.5 btn-press"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Add to Bag</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── 8. Doorstep Aroma Valve & Seal Check Protocol ──────────────────── */}
      <section id="aroma" className="py-16 px-4 sm:px-6 border-b border-stone-200/80 bg-[#edf1e6]">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-100 text-emerald-950 rounded-full text-[10px] font-bold tracking-wider uppercase border border-emerald-300 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
              <span>Doorstep Aroma & Seal Guarantee</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-950 tracking-tight">
              The 3-Step Culinary Freshness Protocol
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              Real food should never smell stale or sit on warehouse shelves. We invite you to check roast dates and test aroma valves at your door before completing cash on delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Examine Roast & Harvest Stamp",
                desc: "Check the micro-lot roast date stamped on the coffee pouch or the cold-pressed harvest date on the olive oil bottle with the driver.",
                highlight: "Zero Advance Payment"
              },
              {
                step: "02",
                title: "One-Way Aroma Degassing Check",
                desc: "Press the one-way valve on your coffee bag to release the volatile aromas of fresh bloom bergamot and chocolate before paying.",
                highlight: "Aroma Check Permitted"
              },
              {
                step: "03",
                title: "100% Culinary Freshness Guarantee",
                desc: "If any batch fails your kitchen standards or cupping expectations, enjoy an instant replacement or credit within 14 days.",
                highlight: "Zero Risk Farmstead Guarantee"
              }
            ].map((card) => (
              <div key={card.step} className="bg-white rounded-2xl p-6 border border-stone-300/80 shadow-xs space-y-3">
                <span className="text-2xl font-black font-mono text-emerald-800 block">{card.step}</span>
                <h3 className="text-sm font-bold text-stone-900">{card.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">{card.desc}</p>
                <div className="pt-2 border-t border-stone-200 text-[10px] font-mono font-bold text-emerald-800">
                  {card.highlight}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 9. Cupping Notes & Kitchen Reviews ─────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 border-b border-stone-200/80 bg-white">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[10px] font-mono tracking-widest text-emerald-800 font-bold uppercase">
              Kitchen & Cupping Notes
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-950 tracking-tight">
              Verified Patron Kitchen Appraisals
            </h2>
            <p className="text-xs text-stone-500">
              Field reviews from professional baristas, home chefs, and organic food connoisseurs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                author: "Simon T.",
                role: "Specialty Coffee Barista",
                provision: "Ethiopian Yirgacheffe Heirloom",
                comment: "The roast date stamped on my bag was literally two days prior to delivery. On a V60 pour-over, the jasmine florals and candied peach notes are intensely vibrant. Inhaling through the aroma valve at the door was remarkable.",
                rating: 5
              },
              {
                author: "Miriam G.",
                role: "Holistic Nutritionist",
                provision: "Raw Alpine Wildflower Honey",
                comment: "You can see the natural crystallization and pollen micro-specs throughout the jar. It has a rich, herbal complexity unlike anything found in supermarket pasteurized honey.",
                rating: 5
              },
              {
                author: "Chef Antonio B.",
                role: "Farm-to-Table Restaurateur",
                provision: "Early-Harvest Koroneiki EVOO",
                comment: "The polyphenol bite at the back of the throat confirms true early-harvest green olives. Milled within 4 hours is evident in the brilliant grassy aroma. Exceptional table oil.",
                rating: 5
              }
            ].map((rev, i) => (
              <div key={i} className="bg-[#f8f9f5] rounded-2xl p-6 border border-stone-200 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-500 space-x-0.5">
                      {[...Array(rev.rating)].map((_, idx) => (
                        <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                      Verified Patron
                    </span>
                  </div>

                  <p className="text-xs text-stone-700 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-200 text-[11px]">
                  <p className="font-bold text-stone-900">{rev.author}</p>
                  <p className="text-emerald-800 text-[10px] font-mono">{rev.role}</p>
                  <p className="text-stone-500 text-[10px]">{rev.provision}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 10. Farmstead Harvest Club Newsletter ──────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 bg-[#edf1e6] border-b border-stone-200/80">
        <div className="max-w-xl mx-auto text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center mx-auto">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="text-2xl font-black tracking-tight text-stone-950">
            Join The {storeDisplayName} Harvest Club
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Receive $10 off your first pantry delivery, seasonal micro-lot reserve allocations, and our harvest recipes.
          </p>

          {newsletterSubscribed ? (
            <div className="p-4 bg-emerald-100/90 border border-emerald-300 rounded-2xl text-xs text-emerald-950 font-semibold space-y-1">
              <div className="flex items-center justify-center space-x-1.5 text-emerald-800">
                <Check className="w-4 h-4" />
                <span>Welcome to the Harvest Club!</span>
              </div>
              <p className="text-[11px] text-stone-600 font-normal font-mono">
                Use code <strong className="text-emerald-800 font-bold">PANTRY10</strong> for $10 off at checkout.
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
                placeholder="patron@farmstead.com"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                className="flex-1 px-4 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 outline-none focus:border-emerald-700 shadow-2xs font-mono"
              />
              <button
                type="submit"
                className="py-2.5 px-5 bg-emerald-900 hover:bg-emerald-800 text-emerald-100 font-bold text-xs rounded-xl shadow-xs transition btn-press"
              >
                Claim $10
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ─── 11. Floating Demo Studio Pill ──────────────────────────────────── */}
      <div className="fixed bottom-5 right-5 z-40">
        {isThemeMenuOpen ? (
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-stone-300 p-4 w-72 text-stone-900 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span className="text-xs font-bold font-mono">Demo Studio</span>
              </div>
              <button
                onClick={() => setIsThemeMenuOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block">
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
                        ? "bg-emerald-900 text-white"
                        : "bg-stone-100 hover:bg-stone-200 text-stone-700"
                    }`}
                  >
                    {categoriesMap[cKey]?.name || cKey}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-stone-200">
              <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block">
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
                        ? "bg-stone-900 text-white"
                        : "bg-stone-100 hover:bg-stone-200 text-stone-700"
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
            className="bg-stone-950/90 hover:bg-stone-900 text-white backdrop-blur-md px-4 py-2.5 rounded-full text-xs font-semibold shadow-2xl border border-white/10 flex items-center space-x-2 transition hover:scale-105"
            title="Switch template style or department"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Theme: <strong>{template.name.split(" ")[0]}</strong></span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </button>
        )}
      </div>

      {/* ─── 12. Farmstead Pantry Tailored Store Footer ─────────────────────── */}
      <footer className="py-12 px-4 sm:px-6 bg-[#0e1611] text-emerald-100/80 border-t border-emerald-950 text-xs">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <span className="font-black text-sm uppercase tracking-wider text-white">
              {storeDisplayName}
            </span>
            <p className="text-xs text-emerald-200/70 leading-relaxed">
              Regenerative organic farmstead provisions, micro-lot drum roasted within 48 hours and packaged in zero-landfill compostables.
            </p>
            <p className="text-[11px] text-emerald-400/50 font-mono">
              © 2026 {storeDisplayName}. All rights reserved.
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-xs uppercase tracking-wider text-white block">
              Pantry Provisions
            </span>
            <ul className="space-y-1.5 text-emerald-200/70">
              <li><a href="#provisions" className="hover:text-white transition">Single-Origin Yirgacheffe Coffee</a></li>
              <li><a href="#provisions" className="hover:text-white transition">Raw Alpine Wildflower Honey</a></li>
              <li><a href="#provisions" className="hover:text-white transition">Early-Harvest Koroneiki EVOO</a></li>
              <li><a href="#ensemble" className="hover:text-white transition">Complete Kitchen Trios</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-xs uppercase tracking-wider text-white block">
              Farmgate Services
            </span>
            <ul className="space-y-1.5 text-emerald-200/70">
              <li><span>Doorstep Cash on Delivery</span></li>
              <li><span>Aroma Degassing Valve Verification</span></li>
              <li><span>100% Culinary Freshness Guarantee</span></li>
              <li><span>Compostable Pouch Collection</span></li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-xs uppercase tracking-wider text-white block">
              Regenerative Quality
            </span>
            <p className="text-emerald-200/70 leading-relaxed">
              Nationwide cash on delivery. Inspect the roast timestamp and aroma seal prior to tender.
            </p>
            <div className="inline-flex items-center space-x-1.5 text-emerald-400 font-mono text-[11px] pt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Doorstep Inspection Protocol</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
