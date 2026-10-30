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
  Crown,
  Watch,
  Gem,
  Award,
  ChevronRight,
  ChevronDown,
  Info
} from "lucide-react";
import { IStoreTemplate } from "@/templates/types";
import { CartItem } from "@/lib/cart";

export interface JewelryStorefrontProps {
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

// Jewelry Collections
const JEWELRY_COLLECTIONS = [
  { id: "all", label: "All Maison Creations", subtitle: "Swiss automatic calibers & solid 18k vermeil" },
  { id: "horology", label: "Haute Horology", subtitle: "28,800 vph movements & domed sapphire crystal" },
  { id: "rings", label: "Solid 18K Vermeil", subtitle: "Assay Office hallmarked 925 core & 3-micron gold" },
  { id: "eyewear", label: "Aerospace Beta-Titanium", subtitle: "14-gram laser-cut frames & polarized nylon" }
];

// Assay & Gemological Standards
const MAISON_STANDARDS = [
  {
    pillar: "Assay Office Hallmark",
    spec: "Official 750 (18K) & 925 Laser Stamped",
    detail: "Every precious metal piece bears official Assay Office hallmarks verifying chemical gold purity and provenance."
  },
  {
    pillar: "Swiss Automatic Movement",
    spec: "28,800 VPH (4Hz) High-Beat Caliber",
    detail: "Precision mechanical movement with 42h power reserve, exhibition caseback perlage, and regulated in 5 positions."
  },
  {
    pillar: "Crystal & Optics",
    spec: "Anti-Reflective Domed Sapphire",
    detail: "Mohs hardness 9 synthetic sapphire with internal anti-reflective coating ensuring scratchproof clarity for life."
  },
  {
    pillar: "Ethical Provenance",
    spec: "100% Conflict-Free Kimberley Compliant",
    detail: "All stones and precious metals are certified conflict-free, sustainably extracted and cast in limited serialized batches."
  }
];

export function JewelryStorefront({
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
}: JewelryStorefrontProps) {
  const [selectedCollection, setSelectedCollection] = useState<string>("all");
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [quickOptionMap, setQuickOptionMap] = useState<Record<string, string>>({});
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Filter products by collection
  const filteredProducts = products.filter((p) => {
    if (selectedCollection === "horology") {
      return p.title.toLowerCase().includes("watch") || p.title.toLowerCase().includes("chronograph") || p.title.toLowerCase().includes("automatic");
    }
    if (selectedCollection === "rings") {
      return p.title.toLowerCase().includes("ring") || p.title.toLowerCase().includes("vermeil") || p.title.toLowerCase().includes("signet");
    }
    if (selectedCollection === "eyewear") {
      return p.title.toLowerCase().includes("titanium") || p.title.toLowerCase().includes("aviator") || p.title.toLowerCase().includes("sunglasses");
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

  const handleAddHeirloomEnsemble = () => {
    const watch = products.find((p) => p.slug.includes("watch") || p.slug.includes("chronograph")) || products[0];
    const ring = products.find((p) => p.slug.includes("ring")) || products[1] || products[0];
    const aviator = products.find((p) => p.slug.includes("aviator") || p.slug.includes("titanium")) || products[2] || products[0];

    if (watch) onAddToCart(watch, watch.variants[0]);
    if (ring) onAddToCart(ring, ring.variants[0]);
    if (aviator) onAddToCart(aviator, aviator.variants[0]);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#0b0c0e] text-zinc-100 selection:bg-amber-500 selection:text-black">
      {/* ─── 1. Maison Fine Jewelry Utility Bar ─────────────────────────────── */}
      <div className="py-2.5 px-4 text-xs font-serif tracking-wide bg-black text-amber-300/90 border-b border-neutral-900">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="hidden sm:flex items-center space-x-2 text-[11px] text-zinc-400">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Assay Office Hallmarked • GIA Certified Stones</span>
          </div>
          <div className="mx-auto sm:mx-0 flex items-center space-x-2 text-xs font-semibold text-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>Armored Courier Handover (COD) • Loupe & Hallmark Inspection</span>
          </div>
          <div className="hidden md:flex items-center space-x-3 text-[11px] text-zinc-400 font-mono">
            <span>Lifetime Fine Care Guarantee</span>
          </div>
        </div>
      </div>

      {/* ─── 2. Clean Maison Brand Header ───────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-[#0b0c0e]/90 backdrop-blur-md border-b border-neutral-800/80 text-zinc-100 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-6">
          {/* Brand Logo & Maison Tag */}
          <Link href={`/store/${tenantSlug}`} className="flex items-center space-x-3 flex-shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-700 text-black flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
              <Crown className="w-5 h-5 text-black" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-base block leading-none font-serif text-white">
                {storeDisplayName}
              </span>
              <span className="text-[10px] text-amber-400/90 font-semibold block mt-1 tracking-wider uppercase font-mono">
                Haute Horology & Fine Jewelry
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs font-serif font-medium text-zinc-400">
            <a href="#creations" className="hover:text-amber-400 transition">Maison Creations</a>
            <a href="#collections" className="hover:text-amber-400 transition">Collections</a>
            <a href="#standards" className="hover:text-amber-400 transition">Assay Standards</a>
            <a href="#ensemble" className="hover:text-amber-400 transition">Heirloom Ensemble</a>
            <a href="#loupe" className="hover:text-amber-400 transition">Loupe Handover</a>
          </nav>

          {/* Search Trigger */}
          <div
            onClick={onOpenSearch}
            className="flex-1 max-w-xs hidden md:flex items-center space-x-2 px-3.5 py-2 bg-[#121317] border border-neutral-800 rounded-xl text-xs text-zinc-400 cursor-pointer hover:border-amber-500/50 hover:text-zinc-200 transition shadow-2xs font-serif"
          >
            <Search className="w-3.5 h-3.5 text-amber-400" />
            <span className="truncate">Search automatic watches, 18k gold...</span>
            <kbd className="ml-auto text-[9px] font-mono bg-neutral-900 text-amber-400 px-1.5 py-0.5 rounded border border-neutral-700">
              /
            </kbd>
          </div>

          {/* Action Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenSearch}
              className="md:hidden p-2.5 rounded-xl hover:bg-neutral-800 text-zinc-400 transition"
              aria-label="Search catalog"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-serif font-bold transition flex items-center space-x-2 shadow-xs group"
              aria-label="View shopping bag"
            >
              <ShoppingBag className="w-4 h-4 text-black group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold hidden sm:inline-block">Salon Bag</span>
              {cartItems.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white text-black rounded-full text-[10px] font-black flex items-center justify-center shadow-xs">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ─── 3. Opulent Maison Hero Section ─────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-neutral-800/80 bg-gradient-to-b from-[#0b0c0e] via-[#14151b] to-[#0b0c0e] py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-950/60 border border-amber-800/50 rounded-full text-[11px] font-semibold text-amber-300 font-mono">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>Assay Hallmarked 750 (18K) • Swiss 28,800 VPH Caliber</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-serif leading-[1.08]">
              Heirloom Horology. <br />
              <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent italic font-normal">
                Solid 18K Gold Vermeil.
              </span> <br />
              Eternal Provenance.
            </h1>

            <p className="text-sm sm:text-base text-zinc-400 max-w-xl leading-relaxed font-sans">
              Individually serialized timepieces and heavy gold signets cast from 925 sterling silver plated with 3.0 microns of 18k yellow gold. Inspect Assay hallmarks and sapphire crystal clarity with our courier before cash tender.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#creations"
                className="py-3 px-6 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs font-serif rounded-xl shadow-xs transition flex items-center space-x-2"
              >
                <span>Explore Maison Creations</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              <a
                href="#standards"
                className="py-3 px-5 bg-[#17181f] border border-neutral-700/80 hover:bg-[#20222b] text-amber-200/90 font-semibold text-xs font-serif rounded-xl shadow-xs transition flex items-center space-x-2"
              >
                <Gem className="w-3.5 h-3.5 text-amber-400" />
                <span>Assay Hallmark Dossier</span>
              </a>
            </div>

            {/* Micro Trust Indicators */}
            <div className="pt-6 border-t border-neutral-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-zinc-400 font-mono">
              <div className="flex items-center space-x-2 text-xs">
                <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="font-medium text-[11px]">Assay Hallmarked</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="font-medium text-[11px]">Swiss 28.8k vph</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <Truck className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="font-medium text-[11px]">Loupe Check (COD)</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <RotateCcw className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="font-medium text-[11px]">Lifetime Servicing</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-3xl overflow-hidden border border-amber-900/40 bg-[#121317] shadow-2xl p-2.5">
              <div className="aspect-square rounded-2xl overflow-hidden relative group">
                <img
                  src="https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=1000&auto=format&fit=crop&q=85"
                  alt="Heritage 39mm Sapphire Chronograph"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 bg-black/85 backdrop-blur-md p-3.5 rounded-xl border border-neutral-700 shadow-lg text-white">
                  <div className="flex items-center justify-between font-serif">
                    <div>
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block font-mono">Haute Horology</span>
                      <p className="text-xs font-bold">Heritage 39mm Sapphire Automatic</p>
                    </div>
                    <span className="text-xs font-bold text-amber-300 font-mono">$240.00</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-1 font-sans">28,800 vph caliber • Exhibition caseback • Italian leather</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. Jewelry Collections Navigation Filter ───────────────────────── */}
      <section id="collections" className="py-10 px-4 sm:px-6 border-b border-neutral-800/80 bg-[#0f1014]">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 font-serif">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-amber-400 font-bold uppercase">
                Atelier Disciplines
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Curated Heirloom Categories
              </h2>
            </div>
            <p className="text-xs text-zinc-400 max-w-sm font-sans">
              Each piece is individually numbered and accompanied by its official Assay Office metal authenticity card.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {JEWELRY_COLLECTIONS.map((col) => {
              const isActive = selectedCollection === col.id;
              return (
                <button
                  key={col.id}
                  onClick={() => setSelectedCollection(col.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all font-serif ${
                    isActive
                      ? "bg-amber-950/60 border-amber-500/80 text-white shadow-xs"
                      : "bg-[#121317] border-neutral-800 hover:border-neutral-700 text-zinc-300"
                  }`}
                >
                  <p className={`text-xs font-bold ${isActive ? "text-amber-300" : "text-white"}`}>
                    {col.label}
                  </p>
                  <p className={`text-[10px] mt-1 leading-snug font-sans ${isActive ? "text-zinc-300" : "text-zinc-500"}`}>
                    {col.subtitle}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 5. Assay Office & Horology Standards Breakdown ─────────────────── */}
      <section id="standards" className="py-16 px-4 sm:px-6 border-b border-neutral-800/80 bg-[#0b0c0e]">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="max-w-2xl space-y-2 font-serif">
            <span className="text-[10px] font-mono tracking-widest text-amber-400 font-bold uppercase">
              Hallmark Certification
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Precious Metal Purity & Provenance
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              We never use simulated stones or brass base metals. Everything is cast from 925 solid sterling silver, solid 18k gold, or optical grade beta-titanium.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-serif">
            {MAISON_STANDARDS.map((std, i) => (
              <div
                key={i}
                className="bg-[#121317] rounded-2xl p-5 border border-neutral-800 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-bold text-amber-400 uppercase bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                      Certified Standard
                    </span>
                    <Award className="w-4 h-4 text-amber-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white leading-tight">
                    {std.pillar}
                  </h3>
                  <p className="text-[11px] font-mono text-amber-300">
                    {std.spec}
                  </p>
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                    {std.detail}
                  </p>
                </div>

                <div className="pt-2 border-t border-neutral-800 text-[10px] font-mono text-amber-400/90 font-bold">
                  Assay Hallmarked
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6. The Curated Heirloom Ensemble (1-Click Upsell) ───────────────── */}
      <section id="ensemble" className="py-16 px-4 sm:px-6 border-b border-neutral-800/80 bg-gradient-to-r from-amber-950/20 via-[#101116] to-black">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#121317] rounded-3xl border border-amber-900/40 p-6 sm:p-10 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4 font-serif">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-950/80 text-amber-400 rounded-full text-[10px] font-bold tracking-wider uppercase border border-amber-800 font-mono">
                  <Crown className="w-3 h-3 text-amber-400" />
                  <span>Curated Salon Package</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  The Curated Heirloom Ensemble
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  The complete sartorial suite: Swiss Automatic Sapphire Chronograph, 18k Heavy Gold Vermeil Signet Ring, and 14g Laser-Cut Beta-Titanium Aviators.
                </p>

                <div className="space-y-2 pt-2 text-xs font-sans">
                  <div className="flex items-center space-x-2.5 text-zinc-200 font-medium">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-black font-mono text-[10px] font-bold flex items-center justify-center">1</span>
                    <span>Heritage 39mm Automatic Sapphire Chronograph ($240.00)</span>
                  </div>
                  <div className="flex items-center space-x-2.5 text-zinc-200 font-medium">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-black font-mono text-[10px] font-bold flex items-center justify-center">2</span>
                    <span>18k Heavy Gold-Vermeil Signet Ring ($88.00)</span>
                  </div>
                  <div className="flex items-center space-x-2.5 text-zinc-200 font-medium">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-black font-mono text-[10px] font-bold flex items-center justify-center">3</span>
                    <span>Beta-Titanium Polarized Aviators ($115.00)</span>
                  </div>
                </div>

                <div className="pt-4 flex items-baseline space-x-3">
                  <span className="text-2xl font-black text-amber-400 font-mono">$385.00</span>
                  <span className="text-sm text-zinc-500 line-through font-mono">$443.00</span>
                  <span className="text-xs font-bold text-amber-300 bg-amber-950 px-2 py-0.5 rounded-full border border-amber-700">
                    Save $58.00 (13% Off)
                  </span>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleAddHeirloomEnsemble}
                    className="w-full sm:w-auto py-3 px-8 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center space-x-2 btn-press"
                  >
                    <ShoppingBag className="w-4 h-4 text-black" />
                    <span>Add Complete Heirloom Suite to Bag</span>
                  </button>
                  <p className="text-[11px] text-zinc-500 mt-2 font-sans">
                    Dispatched in velvet-lined lockboxes with jeweler's loupe and Assay certificates.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-3 gap-3 font-serif">
                {[
                  {
                    step: "TIMEPIECE 01",
                    title: "Sapphire Chrono",
                    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&auto=format&fit=crop&q=80",
                    detail: "Swiss 28.8k Caliber"
                  },
                  {
                    step: "SIGNET 02",
                    title: "18k Vermeil Ring",
                    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&auto=format&fit=crop&q=80",
                    detail: "3-Micron Gold • 925 Core"
                  },
                  {
                    step: "OPTICS 03",
                    title: "Titanium Aviator",
                    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&auto=format&fit=crop&q=80",
                    detail: "14g Beta-Titanium"
                  }
                ].map((item, idx) => (
                  <div key={idx} className="bg-black/60 rounded-2xl p-2.5 border border-neutral-800 flex flex-col justify-between">
                    <div className="aspect-square rounded-xl overflow-hidden bg-neutral-900 mb-2 border border-neutral-800">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono font-bold text-amber-400 block">{item.step}</span>
                      <p className="text-xs font-bold text-white leading-tight mt-0.5">{item.title}</p>
                      <span className="text-[10px] text-zinc-400 block mt-1 font-sans">{item.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. Main Jewelry Product Catalog Grid (Square 1:1) ──────────────── */}
      <section id="creations" className="py-16 px-4 sm:px-6 max-w-6xl mx-auto w-full flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-neutral-800 gap-4 font-serif">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold mb-1">
              <span>Assay Hallmarked</span>
              <span>•</span>
              <span>Numbered Archive</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Maison Fine Creations
            </h2>
            <p className="text-xs text-zinc-400 mt-1 font-sans">
              Showing {filteredProducts.length} authenticated timepieces and precious heirloom pieces
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-zinc-500 text-[11px]">Active Discipline:</span>
            <span className="font-bold text-amber-300 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-800 capitalize">
              {selectedCollection === "all" ? "All Creations" : selectedCollection}
            </span>
          </div>
        </div>

        {/* Disciplined Square Product Grid */}
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
                className="group bg-[#121317] rounded-2xl border border-neutral-800 hover:border-amber-500/40 transition-all duration-300 p-3.5 flex flex-col justify-between shadow-2xs hover:shadow-amber-950/20 hover:shadow-lg cursor-pointer"
              >
                {/* Square 1:1 Media Frame */}
                <div>
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-black/60 border border-neutral-800 mb-3.5">
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
                        alt={`${p.title} Macro Detail`}
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
                          isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95"
                        }`}
                      />
                    )}

                    {/* Maison Gold Badge */}
                    <div className="absolute top-2.5 left-2.5 z-10">
                      <span className="px-2.5 py-1 bg-black/90 backdrop-blur-md rounded-full text-[10px] font-bold text-amber-400 border border-amber-800/60 shadow-2xs uppercase tracking-wider font-mono">
                        {p.badge || "Solid 18K"}
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
                          ? "bg-amber-500 text-black shadow-xs"
                          : "bg-black/80 text-zinc-400 hover:bg-black hover:text-amber-400 shadow-2xs"
                      }`}
                      aria-label="Save to favorites"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
                    </button>

                    {/* Loupe Seal Badge */}
                    <div className="absolute bottom-2.5 left-2.5 z-10">
                      <span className="px-2 py-0.5 bg-amber-950/90 text-amber-300 rounded text-[9px] font-mono tracking-wide border border-amber-800/50">
                        Assay Loupe Protocol
                      </span>
                    </div>
                  </div>

                  {/* Quick Variant / Size Selector Pills */}
                  {p.variants.length > 0 && (
                    <div className="mb-3 space-y-1.5" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-zinc-500">Edition / Size:</span>
                        <span className="text-amber-400 font-bold">{chosenOpt}</span>
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
                                  ? "bg-amber-500 text-black border-amber-500"
                                  : "bg-neutral-900 hover:bg-neutral-800 text-zinc-400 border-neutral-800"
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
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    <span className="text-[11px] font-bold text-zinc-300">5.0</span>
                    <span className="text-[10px] text-zinc-500">(48 patrons)</span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition leading-snug font-serif">
                    {p.title}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed font-sans">
                    {p.description}
                  </p>
                </div>

                {/* Price & Add to Bag */}
                <div className="pt-4 mt-3 border-t border-neutral-800 flex items-center justify-between font-mono">
                  <div>
                    <span className="text-base font-black text-white">
                      ${p.price.toFixed(2)}
                    </span>
                    {p.comparePrice > p.price && (
                      <span className="text-xs text-zinc-500 line-through ml-1.5">
                        ${p.comparePrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => handleCardQuickAdd(p, e)}
                    className="py-2 px-3.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-1.5 btn-press font-serif"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-black" />
                    <span>Add to Salon Bag</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── 8. Armored Courier & Loupe Handover Protocol (COD Promise) ──────── */}
      <section id="loupe" className="py-16 px-4 sm:px-6 border-b border-neutral-800/80 bg-[#0f1014]">
        <div className="max-w-6xl mx-auto space-y-8 font-serif">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-950/80 text-amber-400 rounded-full text-[10px] font-bold tracking-wider uppercase border border-amber-800 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Doorstep Loupe Appraisal Guarantee</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              The 3-Step Handover & Appraisal Protocol
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              High jewelry requires absolute trust. We provide a 10x jeweler's loupe in your parcel so you can inspect hallmarks and stone settings under daylight before tendering cash payment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Inspect Velvet Lockbox Seal",
                desc: "Receive your parcel from the courier in a sealed, tamper-evident armored envelope with serial barcode unbroken.",
                highlight: "Zero Advance Payment"
              },
              {
                step: "02",
                title: "Examine 18K / 750 Assay Stamp",
                desc: "Use the included 10x jeweler's loupe to inspect the laser-inscribed Assay Office hallmarks and sapphire exhibition caseback.",
                highlight: "Loupe Appraisal Permitted"
              },
              {
                step: "03",
                title: "Lifetime Complimentary Service",
                desc: "Every creation includes annual ultrasonic cleaning, prong tightening, and horological timing regulation across our global atelier network.",
                highlight: "Lifetime Care Guarantee"
              }
            ].map((card) => (
              <div key={card.step} className="bg-[#121317] rounded-2xl p-6 border border-neutral-800 shadow-xs space-y-3">
                <span className="text-2xl font-black text-amber-400 block font-mono">{card.step}</span>
                <h3 className="text-sm font-bold text-white">{card.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">{card.desc}</p>
                <div className="pt-2 border-t border-neutral-800 text-[10px] font-bold text-amber-400 font-mono">
                  {card.highlight}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 9. Collector Appraisals & Testimonials ─────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 border-b border-neutral-800/80 bg-[#0b0c0e]">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2 font-serif">
            <span className="text-[10px] font-mono tracking-widest text-amber-400 font-bold uppercase">
              Patron Appraisals
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Verified Collector Testimonials
            </h2>
            <p className="text-xs text-zinc-400 font-sans">
              Appraisals from watch collectors, horological enthusiasts, and jewelry connoisseurs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-serif">
            {[
              {
                author: "Lord Edward V.",
                role: "Watch Collector & Patron",
                piece: "Heritage 39mm Sapphire Chronograph",
                comment: "The 28,800 vph automatic caliber has a magnificent sweep. The exhibition caseback reveals beautifully finished perlage and blued screws. Inspecting it with the loupe at my door was a true luxury experience.",
                rating: 5
              },
              {
                author: "Vivienne C.",
                role: "Fine Jewelry Specialist",
                piece: "18k Heavy Gold Vermeil Signet Ring",
                comment: "The weight in the hand is remarkable. You can immediately feel the solid 925 core beneath the thick 18k gold plate. The Assay Office stamp is laser-crisp and perfectly centered.",
                rating: 5
              },
              {
                author: "Marcus D.",
                role: "Aviator & Industrial Designer",
                piece: "Beta-Titanium Polarized Aviators",
                comment: "At just 14 grams, you forget you are wearing them. The laser-cut beta-titanium temples have perfect spring tension with zero ear pinch. Absolute masterwork.",
                rating: 5
              }
            ].map((rev, i) => (
              <div key={i} className="bg-[#121317] rounded-2xl p-6 border border-neutral-800 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-400 space-x-0.5">
                      {[...Array(rev.rating)].map((_, idx) => (
                        <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                      Verified Collector
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed font-sans italic">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-800 text-[11px]">
                  <p className="font-bold text-white">{rev.author}</p>
                  <p className="text-amber-400 text-[10px] font-mono">{rev.role}</p>
                  <p className="text-zinc-500 text-[10px] font-sans">{rev.piece}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 10. Maison Private Salon Newsletter ────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 bg-[#0f1014] border-b border-neutral-800/80 font-serif">
        <div className="max-w-xl mx-auto text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-800 text-amber-400 flex items-center justify-center mx-auto">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="text-2xl font-black tracking-tight text-white">
            Join The {storeDisplayName} Private Salon
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            Receive $25 courtesy credit towards your inaugural acquisition, private invitations to limited serialized batch allocations, and our annual horology gazette.
          </p>

          {newsletterSubscribed ? (
            <div className="p-4 bg-amber-950/80 border border-amber-800 rounded-2xl text-xs text-amber-200 font-semibold space-y-1">
              <div className="flex items-center justify-center space-x-1.5 text-amber-400 font-serif">
                <Check className="w-4 h-4" />
                <span>Welcome to the Private Salon!</span>
              </div>
              <p className="text-[11px] text-zinc-400 font-normal font-mono">
                Use courtesy code <strong className="text-amber-400 font-bold">MAISON25</strong> for $25 off at checkout.
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
                placeholder="patron@maison.com"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                className="flex-1 px-4 py-2.5 bg-black border border-neutral-800 rounded-xl text-xs text-white placeholder:text-zinc-600 outline-none focus:border-amber-500 shadow-2xs font-mono"
              />
              <button
                type="submit"
                className="py-2.5 px-5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl shadow-xs transition btn-press font-serif"
              >
                Claim $25
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ─── 11. Floating Demo Studio Pill ──────────────────────────────────── */}
      <div className="fixed bottom-5 right-5 z-40">
        {isThemeMenuOpen ? (
          <div className="bg-[#121317]/95 backdrop-blur-md rounded-2xl shadow-2xl border border-neutral-800 p-4 w-72 text-zinc-100 space-y-3 font-serif">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-xs font-bold font-mono">Demo Studio</span>
              </div>
              <button
                onClick={() => setIsThemeMenuOpen(false)}
                className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-neutral-800"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
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
                        ? "bg-amber-500 text-black font-bold"
                        : "bg-neutral-900 hover:bg-neutral-800 text-zinc-300"
                    }`}
                  >
                    {categoriesMap[cKey]?.name || cKey}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-neutral-800">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
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
                        ? "bg-amber-500 text-black font-bold"
                        : "bg-neutral-900 hover:bg-neutral-800 text-zinc-300"
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
            className="bg-black/90 hover:bg-neutral-950 text-white backdrop-blur-md px-4 py-2.5 rounded-full text-xs font-semibold shadow-2xl border border-neutral-800 flex items-center space-x-2 transition hover:scale-105 font-serif"
            title="Switch template style or department"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Theme: <strong>{template.name.split(" ")[0]}</strong></span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </button>
        )}
      </div>

      {/* ─── 12. Maison Fine Jewelry Tailored Store Footer ──────────────────── */}
      <footer className="py-12 px-4 sm:px-6 bg-black text-zinc-400 border-t border-neutral-900 text-xs font-serif">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <span className="font-black text-sm uppercase tracking-wider text-white">
              {storeDisplayName}
            </span>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Fine Swiss horology and Assay Office hallmarked heirloom jewelry, individually numbered and delivered with loupe inspection protocols.
            </p>
            <p className="text-[11px] text-zinc-600 font-mono">
              © 2026 {storeDisplayName}. All rights reserved.
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-xs uppercase tracking-wider text-white block">
              Maison Disciplines
            </span>
            <ul className="space-y-1.5 text-zinc-400">
              <li><a href="#creations" className="hover:text-white transition">Heritage Sapphire Chronographs</a></li>
              <li><a href="#creations" className="hover:text-white transition">18k Heavy Gold Vermeil Signets</a></li>
              <li><a href="#creations" className="hover:text-white transition">Beta-Titanium Aviators</a></li>
              <li><a href="#ensemble" className="hover:text-white transition">Heirloom Salon Suites</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-xs uppercase tracking-wider text-white block">
              Patron Services
            </span>
            <ul className="space-y-1.5 text-zinc-400">
              <li><span>Doorstep Cash on Delivery</span></li>
              <li><span>10x Loupe Appraisal on Handover</span></li>
              <li><span>Annual Ultrasonic Cleaning Service</span></li>
              <li><span>Horological Movement Regulation</span></li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-xs uppercase tracking-wider text-white block">
              Authenticity & Assay
            </span>
            <p className="text-zinc-400 leading-relaxed font-sans">
              Nationwide cash on delivery. Inspect the Assay Office 750 hallmark and stone settings with loupe prior to payment tender.
            </p>
            <div className="inline-flex items-center space-x-1.5 text-amber-400 text-[11px] pt-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Doorstep Inspection Protocol</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
