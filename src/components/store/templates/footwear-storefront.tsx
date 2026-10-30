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
  Footprints,
  Hammer,
  Ruler,
  ChevronRight,
  ChevronDown,
  Info
} from "lucide-react";
import { IStoreTemplate } from "@/templates/types";
import { CartItem } from "@/lib/cart";

export interface FootwearStorefrontProps {
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

// Footwear Silhouettes
const FOOTWEAR_SILHOUETTES = [
  { id: "all", label: "All Guild Footwear", subtitle: "Handcrafted boots, runners & loafers" },
  { id: "boots", label: "Storm-Welted Boots", subtitle: "Horween Chromexcel & Vibram lug soles" },
  { id: "runners", label: "Carbon Propulsion Runners", subtitle: "Dual-density nitrogen foam & torsion plate" },
  { id: "loafers", label: "Tuscan Suede Loafers", subtitle: "Unlined butter-soft Italian velour calf" }
];

// Construction Anatomy Comparison
const ANATOMY_SPECS = [
  {
    layer: "01. Upper Leather",
    guild: "2.2mm Full-Grain Horween Chromexcel (USA)",
    fastFashion: "0.8mm Split leather with polyurethane plastic coating",
    benefit: "Rich pull-up oil character that develops a glowing patina rather than peeling or cracking."
  },
  {
    layer: "02. Insole & Footbed",
    guild: "4.5mm Vegetable-Tanned Oak Bark Leather Insole",
    fastFashion: "Cardboard core with synthetic pressed paperboard",
    benefit: "Permanently compresses and molds to the exact contours of your footprint in 10 wears."
  },
  {
    layer: "03. Cavity Cushioning",
    guild: "Natural Granulated Cork Filler",
    fastFashion: "Low-density EVA chemical foam that collapses flat",
    benefit: "Breathes naturally, absorbs foot moisture, and customizes arch support over lifetime of wear."
  },
  {
    layer: "04. Arch Structural Support",
    guild: "Triple-Ribbed Tempered Steel Arch Shank",
    fastFashion: "Plastic or nonexistent shank causing flat foot fatigue",
    benefit: "Prevents torsional foot twisting and reduces plantar fatigue during all-day standing."
  },
  {
    layer: "05. Outsole Attachment",
    guild: "360° Goodyear Storm Welt (100% Resoleable)",
    fastFashion: "Direct-injected cement glue that cannot be repaired",
    benefit: "Can be resoled indefinitely by any cobbler across the globe for decades of continuous wear."
  }
];

export function FootwearStorefront({
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
}: FootwearStorefrontProps) {
  const [selectedSilhouette, setSelectedSilhouette] = useState<string>("all");
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [quickSizeMap, setQuickSizeMap] = useState<Record<string, string>>({});
  const [quickWidthMap, setQuickWidthMap] = useState<Record<string, string>>({});
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Filter products by silhouette
  const filteredProducts = products.filter((p) => {
    if (selectedSilhouette === "boots") {
      return p.title.toLowerCase().includes("boot") || p.title.toLowerCase().includes("chelsea");
    }
    if (selectedSilhouette === "runners") {
      return p.title.toLowerCase().includes("runner") || p.title.toLowerCase().includes("sneaker") || p.title.toLowerCase().includes("stride");
    }
    if (selectedSilhouette === "loafers") {
      return p.title.toLowerCase().includes("loafer") || p.title.toLowerCase().includes("suede") || p.title.toLowerCase().includes("penny");
    }
    return true;
  });

  const handleQuickSizeSelect = (productId: string, size: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickSizeMap((prev) => ({ ...prev, [productId]: size }));
  };

  const handleQuickWidthSelect = (productId: string, width: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickWidthMap((prev) => ({ ...prev, [productId]: width }));
  };

  const handleCardQuickAdd = (p: typeof products[0], e: React.MouseEvent) => {
    e.stopPropagation();
    const chosenSize = quickSizeMap[p.id];
    let matchedVariant = p.variants[0];
    if (chosenSize && p.variants.length > 0) {
      const found = p.variants.find((v) => v.title.toLowerCase().includes(chosenSize.toLowerCase()));
      if (found) matchedVariant = found;
    }
    onAddToCart(p, matchedVariant);
  };

  const handleAddBootEnsemble = () => {
    const boot = products.find((p) => p.slug.includes("boot") || p.slug.includes("chelsea")) || products[0];
    const loafer = products.find((p) => p.slug.includes("loafer")) || products[1] || products[0];
    const runner = products.find((p) => p.slug.includes("runner") || p.slug.includes("sneaker")) || products[2] || products[0];

    if (boot) onAddToCart(boot, boot.variants[0]);
    if (loafer) onAddToCart(loafer, loafer.variants[0]);
    if (runner) onAddToCart(runner, runner.variants[0]);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#faf7f2] text-stone-900 selection:bg-amber-900 selection:text-white">
      {/* ─── 1. Heritage Guild Utility Bar ──────────────────────────────────── */}
      <div className="py-2.5 px-4 text-xs font-medium tracking-wide bg-[#1c1917] text-stone-300 border-b border-stone-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="hidden sm:flex items-center space-x-2 text-[11px] text-stone-400">
            <Hammer className="w-3.5 h-3.5 text-amber-500" />
            <span>Master Hand-Lasted Benchcraft • Built to be Resoled</span>
          </div>
          <div className="mx-auto sm:mx-0 flex items-center space-x-2 text-xs font-semibold text-stone-100">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>Doorstep Carpet Fitting Trial (COD) • Free 48h Size Exchange</span>
          </div>
          <div className="hidden md:flex items-center space-x-3 text-[11px] text-stone-400 font-mono">
            <span>Genuine Goodyear Storm Welt</span>
          </div>
        </div>
      </div>

      {/* ─── 2. Clean Heritage Guild Brand Header ───────────────────────────── */}
      <header className="sticky top-0 z-30 bg-[#faf7f2]/90 backdrop-blur-md border-b border-stone-200/80 text-stone-900 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-6">
          {/* Brand Logo & Guild Tag */}
          <Link href={`/store/${tenantSlug}`} className="flex items-center space-x-3 flex-shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-stone-900 to-amber-950 text-amber-400 flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform border border-amber-900/40">
              <Footprints className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-base block leading-none font-serif text-stone-950">
                {storeDisplayName}
              </span>
              <span className="text-[10px] text-amber-900 font-semibold block mt-1 tracking-wider uppercase font-mono">
                Guild Bootmakers & Leathercraft
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs font-semibold text-stone-700">
            <a href="#footwear" className="hover:text-amber-900 transition">Shop Guild Footwear</a>
            <a href="#silhouettes" className="hover:text-amber-900 transition">Silhouettes</a>
            <a href="#anatomy" className="hover:text-amber-900 transition">Goodyear Anatomy</a>
            <a href="#ensemble" className="hover:text-amber-900 transition">Cobbler Care Kit</a>
            <a href="#trial" className="hover:text-amber-900 transition">Carpet Trial Guarantee</a>
          </nav>

          {/* Search Trigger */}
          <div
            onClick={onOpenSearch}
            className="flex-1 max-w-xs hidden md:flex items-center space-x-2 px-3.5 py-2 bg-white/90 border border-stone-300/70 rounded-xl text-xs text-stone-500 cursor-pointer hover:border-amber-700/50 hover:text-stone-800 transition shadow-2xs"
          >
            <Search className="w-3.5 h-3.5 text-amber-700" />
            <span className="truncate">Search boots, loafers, leathers...</span>
            <kbd className="ml-auto text-[9px] font-mono bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded border border-stone-200">
              /
            </kbd>
          </div>

          {/* Header Actions */}
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
              className="relative p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-50 transition flex items-center space-x-2 shadow-xs group"
              aria-label="View shopping bag"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold hidden sm:inline-block">Bag</span>
              {cartItems.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-500 text-stone-950 rounded-full text-[10px] font-black flex items-center justify-center shadow-xs">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ─── 3. Benchcraft Architectural Hero ───────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-stone-200/80 bg-gradient-to-b from-[#faf7f2] via-[#f4eee4] to-[#faf7f2] py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-100/80 border border-amber-300/70 rounded-full text-[11px] font-semibold text-amber-950 font-mono">
              <Hammer className="w-3.5 h-3.5 text-amber-800" />
              <span>Master Benchcraft • 360° Goodyear Storm Welted</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-stone-950 font-serif leading-[1.08]">
              Lasted by Hand. <br />
              <span className="text-amber-900 italic font-normal">
                Built to be Resoled for Decades.
              </span> <br />
              Zero Glued Cement.
            </h1>

            <p className="text-sm sm:text-base text-stone-600 max-w-xl leading-relaxed">
              Constructed from Horween full-grain Chromexcel pull-up leathers with tempered steel arch shanks, vegetable-tanned oak insoles, and Vibram lug soles that mold naturally to your footprint. Try them on carpet at your door before cash on delivery tender.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#footwear"
                className="py-3 px-6 bg-stone-950 hover:bg-stone-800 text-amber-100 font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-2"
              >
                <span>Explore Guild Footwear</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              <a
                href="#anatomy"
                className="py-3 px-5 bg-white border border-stone-300/80 hover:bg-stone-100 text-stone-800 font-semibold text-xs rounded-xl shadow-xs transition flex items-center space-x-2"
              >
                <Ruler className="w-3.5 h-3.5 text-amber-800" />
                <span>The Goodyear Welt Anatomy</span>
              </a>
            </div>

            {/* Micro Trust Indicators */}
            <div className="pt-6 border-t border-stone-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-stone-700">
              <div className="flex items-center space-x-2 text-xs">
                <CheckCircle2 className="w-4 h-4 text-amber-800 flex-shrink-0" />
                <span className="font-medium text-[11px]">360° Storm Welt</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <ShieldCheck className="w-4 h-4 text-amber-800 flex-shrink-0" />
                <span className="font-medium text-[11px]">Horween Full-Grain</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <Truck className="w-4 h-4 text-amber-800 flex-shrink-0" />
                <span className="font-medium text-[11px]">Carpet Fit Trial (COD)</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <RotateCcw className="w-4 h-4 text-amber-800 flex-shrink-0" />
                <span className="font-medium text-[11px]">Lifetime Resoling</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-3xl overflow-hidden border border-stone-300/80 bg-white shadow-xl p-2.5">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden relative group">
                <img
                  src="https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=1000&auto=format&fit=crop&q=85"
                  alt="Full-Grain Leather Chelsea Boot"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 bg-stone-900/90 backdrop-blur-md p-3.5 rounded-xl border border-stone-700 shadow-lg text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">Signature Build</span>
                      <p className="text-xs font-bold font-serif">Horween Chromexcel Chelsea</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-300">$210.00</span>
                  </div>
                  <p className="text-[10px] text-stone-300 mt-1">360° storm welt, cork bed & Vibram lug outsole</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. Footwear Silhouette Navigation Filter ───────────────────────── */}
      <section id="silhouettes" className="py-10 px-4 sm:px-6 border-b border-stone-200/80 bg-white/70">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-amber-900 font-bold uppercase">
                Guild Silhouettes
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-stone-950 font-serif tracking-tight">
                Curated Footwear Archetypes
              </h2>
            </div>
            <p className="text-xs text-stone-500 max-w-sm">
              Each silhouette is built on specialized anatomical lasts engineered for zero instep pinch and enduring arch support.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {FOOTWEAR_SILHOUETTES.map((sil) => {
              const isActive = selectedSilhouette === sil.id;
              return (
                <button
                  key={sil.id}
                  onClick={() => setSelectedSilhouette(sil.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    isActive
                      ? "bg-stone-900 border-stone-900 text-white shadow-xs"
                      : "bg-white border-stone-200 hover:border-amber-800/40 text-stone-800"
                  }`}
                >
                  <p className={`text-xs font-bold ${isActive ? "text-amber-400 font-serif" : "text-stone-900 font-serif"}`}>
                    {sil.label}
                  </p>
                  <p className={`text-[10px] mt-1 leading-snug ${isActive ? "text-stone-300" : "text-stone-500"}`}>
                    {sil.subtitle}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 5. The Goodyear Welt Anatomy & Technical Breakdown ─────────────── */}
      <section id="anatomy" className="py-16 px-4 sm:px-6 border-b border-stone-200/80 bg-white">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="max-w-2xl space-y-2">
            <span className="text-[10px] font-mono tracking-widest text-amber-900 font-bold uppercase">
              Technical Cobbler Integrity
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-950 font-serif tracking-tight">
              Anatomy of a True Bench-Crafted Boot
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              Why our footwear lasts decades while fast-fashion cemented boots separate in months. Every component is resoleable, breathable, and mechanically stitched.
            </p>
          </div>

          <div className="space-y-3">
            {ANATOMY_SPECS.map((spec, i) => (
              <div
                key={i}
                className="bg-[#faf7f2] rounded-2xl p-5 border border-stone-200/80 grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
              >
                <div className="md:col-span-3">
                  <span className="text-xs font-bold font-serif text-stone-950 block">{spec.layer}</span>
                  <span className="text-[10px] font-mono text-amber-800 font-bold">Resoleable Standard</span>
                </div>

                <div className="md:col-span-4 bg-white p-3 rounded-xl border border-stone-200 shadow-2xs">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-emerald-800 font-bold block mb-0.5">
                    Our Guild Specification:
                  </span>
                  <p className="text-xs font-bold text-stone-900">{spec.guild}</p>
                </div>

                <div className="md:col-span-3 bg-stone-100/70 p-3 rounded-xl border border-stone-200/60">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-rose-800 font-bold block mb-0.5">
                    Fast-Fashion Standard:
                  </span>
                  <p className="text-xs text-stone-500 line-through">{spec.fastFashion}</p>
                </div>

                <div className="md:col-span-2 text-right">
                  <span className="text-[10px] text-stone-600 leading-snug block">
                    {spec.benefit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6. The Master Cobbler Lifetime Ensemble (Bundle Quick-Add) ──────── */}
      <section id="ensemble" className="py-16 px-4 sm:px-6 border-b border-stone-200/80 bg-gradient-to-r from-amber-50/50 via-[#faf7f2] to-stone-100">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl border border-stone-300/80 p-6 sm:p-10 shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-100 text-amber-950 rounded-full text-[10px] font-bold tracking-wider uppercase border border-amber-300 font-mono">
                  <Hammer className="w-3 h-3 text-amber-800" />
                  <span>Guild Ensemble Package</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-950 font-serif">
                  The Master Cobbler Ensemble
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Everything required for a lifetime of boot ownership: Handcrafted Chromexcel Chelsea Boots paired with natural aromatic red cedar shoe trees and Venetian leather cream.
                </p>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center space-x-2.5 text-xs text-stone-800 font-medium">
                    <span className="w-5 h-5 rounded-full bg-stone-900 text-amber-400 font-mono text-[10px] font-bold flex items-center justify-center">1</span>
                    <span>Horween Chromexcel Chelsea Boot ($210.00)</span>
                  </div>
                  <div className="flex items-center space-x-2.5 text-xs text-stone-800 font-medium">
                    <span className="w-5 h-5 rounded-full bg-stone-900 text-amber-400 font-mono text-[10px] font-bold flex items-center justify-center">2</span>
                    <span>Tuscan Suede Penny Loafer ($128.00)</span>
                  </div>
                  <div className="flex items-center space-x-2.5 text-xs text-stone-800 font-medium">
                    <span className="w-5 h-5 rounded-full bg-stone-900 text-amber-400 font-mono text-[10px] font-bold flex items-center justify-center">3</span>
                    <span>Pro-Stride Nitrogen Running Sneaker ($145.00)</span>
                  </div>
                </div>

                <div className="pt-4 flex items-baseline space-x-3">
                  <span className="text-2xl font-black text-amber-950 font-mono">$429.00</span>
                  <span className="text-sm text-stone-400 line-through font-mono">$483.00</span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Save $54.00 (11% Off)
                  </span>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleAddBootEnsemble}
                    className="w-full sm:w-auto py-3 px-8 bg-stone-950 hover:bg-stone-800 text-amber-100 font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center space-x-2 btn-press"
                  >
                    <ShoppingBag className="w-4 h-4 text-amber-400" />
                    <span>Add Complete 3-Pair Guild Pack to Bag</span>
                  </button>
                  <p className="text-[11px] text-stone-500 mt-2">
                    Dispatched in cedar-lined conditioned boxes with doorstep carpet trial guarantee.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-3 gap-3">
                {[
                  {
                    step: "BOOT 01 • RUGGED",
                    title: "Horween Chelsea",
                    image: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=500&auto=format&fit=crop&q=80",
                    detail: "Horween CXL • Vibram"
                  },
                  {
                    step: "SHOE 02 • SARTORIAL",
                    title: "Tuscan Penny Loafer",
                    image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=500&auto=format&fit=crop&q=80",
                    detail: "Italian Calf Suede"
                  },
                  {
                    step: "RUNNER 03 • SPORT",
                    title: "Pro-Stride Carbon",
                    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80",
                    detail: "Carbon Torsion Plate"
                  }
                ].map((item, idx) => (
                  <div key={idx} className="bg-[#faf7f2] rounded-2xl p-2.5 border border-stone-200 flex flex-col justify-between">
                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-white mb-2 border border-stone-200/80">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono font-bold text-amber-900 block">{item.step}</span>
                      <p className="text-xs font-bold text-stone-900 leading-tight mt-0.5 font-serif">{item.title}</p>
                      <span className="text-[10px] text-stone-500 block mt-1">{item.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. Main Footwear Catalog Grid (4:3 Architectural Ratio) ───────── */}
      <section id="footwear" className="py-16 px-4 sm:px-6 max-w-6xl mx-auto w-full flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-stone-200 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-[10px] font-mono uppercase tracking-widest text-amber-900 font-bold mb-1">
              <span>Goodyear Storm Welt</span>
              <span>•</span>
              <span>Brannock Calibrated</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-950 font-serif tracking-tight">
              Hand-Lasted Guild Footwear
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Showing {filteredProducts.length} benchcrafted builds with resoleable Vibram outsoles
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-stone-500 text-[11px]">Active Silhouette:</span>
            <span className="font-bold text-amber-950 bg-amber-100 px-3 py-1 rounded-full border border-amber-300/80 capitalize font-serif">
              {selectedSilhouette === "all" ? "All Footwear" : selectedSilhouette}
            </span>
          </div>
        </div>

        {/* Disciplined 4:3 Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
          {filteredProducts.map((p) => {
            const isHovered = hoveredCardId === p.id;
            const chosenSize = quickSizeMap[p.id] || "US 10";
            const chosenWidth = quickWidthMap[p.id] || "Standard D";
            const isSaved = wishlist.includes(p.id);

            return (
              <div
                key={p.id}
                onMouseEnter={() => setHoveredCardId(p.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                onClick={() => onOpenProduct(p)}
                className="group bg-white rounded-2xl border border-stone-200 hover:border-amber-800/40 transition-all duration-300 p-3.5 flex flex-col justify-between shadow-2xs hover:shadow-md cursor-pointer"
              >
                {/* 4:3 Landscape Media Frame */}
                <div>
                  <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-stone-100 border border-stone-200/80 mb-3.5">
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
                        alt={`${p.title} Outsole Tread`}
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
                          isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95"
                        }`}
                      />
                    )}

                    {/* Master Benchcraft Badge */}
                    <div className="absolute top-2.5 left-2.5 z-10">
                      <span className="px-2.5 py-1 bg-white/95 backdrop-blur-md rounded-full text-[10px] font-bold text-amber-950 border border-amber-300 shadow-2xs uppercase tracking-wider font-mono">
                        {p.badge || "Goodyear Welt"}
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
                          ? "bg-amber-600 text-white shadow-xs"
                          : "bg-white/90 text-stone-600 hover:bg-white hover:text-amber-900 shadow-2xs"
                      }`}
                      aria-label="Save to favorites"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
                    </button>

                    {/* Carpet Fitting Seal */}
                    <div className="absolute bottom-2.5 left-2.5 z-10">
                      <span className="px-2 py-0.5 bg-black/80 backdrop-blur-md text-amber-300 rounded text-[9px] font-mono tracking-wide">
                        Carpet Fitting Guarantee
                      </span>
                    </div>
                  </div>

                  {/* Quick US Shoe Size Selector Pills */}
                  <div className="mb-3 space-y-1.5" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-stone-500 font-medium">Select Brannock Size:</span>
                      <span className="font-mono text-amber-900 font-bold">{chosenSize} • {chosenWidth}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {["US 8", "US 8.5", "US 9", "US 9.5", "US 10", "US 10.5", "US 11", "US 12"].map((sz) => {
                        const isSel = chosenSize.toLowerCase() === sz.toLowerCase();
                        return (
                          <button
                            key={sz}
                            onClick={(e) => handleQuickSizeSelect(p.id, sz, e)}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border transition ${
                              isSel
                                ? "bg-stone-900 text-amber-400 border-stone-900"
                                : "bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200"
                            }`}
                          >
                            {sz.replace("US ", "")}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Rating & Reviews */}
                  <div className="flex items-center space-x-1.5 mb-1.5">
                    <div className="flex text-amber-600">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    <span className="text-[11px] font-mono font-bold text-stone-800">5.0</span>
                    <span className="text-[10px] text-stone-400 font-mono">(48 wearers)</span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-sm font-bold text-stone-900 group-hover:text-amber-900 transition leading-snug font-serif">
                    {p.title}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                {/* Price & Add to Bag */}
                <div className="pt-4 mt-3 border-t border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="text-base font-black text-stone-950 font-mono">
                      ${p.price.toFixed(2)}
                    </span>
                    {p.comparePrice > p.price && (
                      <span className="text-xs text-stone-400 line-through font-mono ml-1.5">
                        ${p.comparePrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => handleCardQuickAdd(p, e)}
                    className="py-2 px-3.5 bg-stone-950 hover:bg-stone-800 text-amber-200 font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-1.5 btn-press"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                    <span>Add to Bag</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── 8. The Doorstep Carpet Fitting Protocol (COD Promise) ──────────── */}
      <section id="trial" className="py-16 px-4 sm:px-6 border-b border-stone-200/80 bg-[#f4eee4]">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-100 text-amber-950 rounded-full text-[10px] font-bold tracking-wider uppercase border border-amber-300 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-800" />
              <span>Doorstep Carpet Trial Guarantee</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-950 font-serif tracking-tight">
              The 3-Step Indoor Carpet Fitting Protocol
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              Never gamble on footwear sizing again. We encourage you to try on your boots on clean indoor carpet with boot socks before completing cash payment with the courier.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Inspect Welt & Leather Aroma",
                desc: "Open parcel with the courier driver. Verify the hand-hammered rivets, Horween pull-up leather grain, and Goodyear storm stitch along the perimeter.",
                highlight: "Zero Advance Payment"
              },
              {
                step: "02",
                title: "Step Onto Indoor Carpet",
                desc: "Lace up both boots and walk on clean carpet. Confirm toe box clearance (thumbs-width) and snug instep lock without heel slippage.",
                highlight: "Carpet Test Permitted"
              },
              {
                step: "03",
                title: "Free 48h Half-Size Exchange",
                desc: "Need a half-size up or down? Simply let the courier know or message our dispatch. We arrange a free courier exchange pickup within 48 hours.",
                highlight: "100% Fit Guarantee"
              }
            ].map((card) => (
              <div key={card.step} className="bg-white rounded-2xl p-6 border border-stone-300/80 shadow-xs space-y-3">
                <span className="text-2xl font-black font-mono text-amber-900 block">{card.step}</span>
                <h3 className="text-sm font-bold text-stone-900 font-serif">{card.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">{card.desc}</p>
                <div className="pt-2 border-t border-stone-200 text-[10px] font-mono font-bold text-amber-900">
                  {card.highlight}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 9. Patron Break-In & Durability Field Notes (Reviews) ───────────── */}
      <section className="py-16 px-4 sm:px-6 border-b border-stone-200/80 bg-white">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[10px] font-mono tracking-widest text-amber-900 font-bold uppercase">
              Field Test Diaries
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-950 font-serif tracking-tight">
              Verified Patron Break-In Appraisals
            </h2>
            <p className="text-xs text-stone-500">
              Real wearers reporting on instep comfort, cork molding, and resoling longevity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                author: "Harrison W.",
                fitNote: "Brannock Size 10.5D • Ordered Size 10",
                boot: "Horween Chromexcel Chelsea",
                comment: "I went a half size down from my sneaker size as recommended. The leather felt substantial right out of the box. By day three, the cork footbed molded to my arches. Inspecting them on carpet at my door made this the easiest boot purchase of my life.",
                rating: 5
              },
              {
                author: "Caleb N.",
                fitNote: "Brannock Size 11EE (Wide) • Standard Last",
                boot: "Tuscan Suede Penny Loafer",
                comment: "The Tuscan velour suede is unlined and butter-soft. Zero heel rub or blisters on first wear. Outstanding craftsmanship and you can clearly see the resoleable channel.",
                rating: 5
              },
              {
                author: "David M.",
                fitNote: "True to Size • 50+ Miles Logged",
                boot: "Pro-Stride Carbon Propulsion Runner",
                comment: "The nitrogen foam combined with the carbon torsion plate gives exceptional propulsion. Much better structural arch support than commercial mainstream runners.",
                rating: 5
              }
            ].map((rev, i) => (
              <div key={i} className="bg-[#faf7f2] rounded-2xl p-6 border border-stone-200 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-600 space-x-0.5">
                      {[...Array(rev.rating)].map((_, idx) => (
                        <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                      Verified Wearer
                    </span>
                  </div>

                  <p className="text-xs text-stone-700 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-200 text-[11px]">
                  <p className="font-bold text-stone-900 font-serif">{rev.author}</p>
                  <p className="text-amber-900 font-mono text-[10px]">{rev.fitNote}</p>
                  <p className="text-stone-500 text-[10px]">{rev.boot}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 10. Guild Craftsman VIP Circle Newsletter ──────────────────────── */}
      <section className="py-16 px-4 sm:px-6 bg-[#faf7f2] border-b border-stone-200/80">
        <div className="max-w-xl mx-auto text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 text-amber-900 flex items-center justify-center mx-auto">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="text-2xl font-black tracking-tight text-stone-950 font-serif">
            Join The {storeDisplayName} Guild Circle
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Receive $15 off your first cash on delivery order, archival batch reserve notifications, and our comprehensive boot waxing & conditioning manual.
          </p>

          {newsletterSubscribed ? (
            <div className="p-4 bg-amber-100/80 border border-amber-300 rounded-2xl text-xs text-amber-950 font-semibold space-y-1">
              <div className="flex items-center justify-center space-x-1.5 text-amber-900">
                <Check className="w-4 h-4" />
                <span>Welcome to the Guild Circle!</span>
              </div>
              <p className="text-[11px] text-stone-600 font-normal">
                Use code <strong className="font-mono text-amber-900 font-bold">GUILD15</strong> for $15 off at checkout.
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
                className="flex-1 px-4 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 outline-none focus:border-amber-800 shadow-2xs"
              />
              <button
                type="submit"
                className="py-2.5 px-5 bg-stone-950 hover:bg-stone-800 text-amber-200 font-bold text-xs rounded-xl shadow-xs transition btn-press"
              >
                Claim $15
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
                <span className="w-2 h-2 rounded-full bg-amber-600" />
                <span className="text-xs font-bold">Demo Studio</span>
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
                        ? "bg-amber-800 text-white"
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
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Theme: <strong>{template.name.split(" ")[0]}</strong></span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </button>
        )}
      </div>

      {/* ─── 12. Heritage Guild Tailored Store Footer ───────────────────────── */}
      <footer className="py-12 px-4 sm:px-6 bg-[#151210] text-stone-300 border-t border-stone-900 text-xs">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <span className="font-black text-sm uppercase tracking-wider text-white font-serif">
              {storeDisplayName}
            </span>
            <p className="text-xs text-stone-400 leading-relaxed">
              Handcrafted footwear built with 360° Goodyear storm welts, Horween full-grain leathers, and resoleable Vibram outsoles.
            </p>
            <p className="text-[11px] text-stone-500 font-mono">
              © 2026 {storeDisplayName}. All rights reserved.
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-xs uppercase tracking-wider text-white block font-serif">
              Guild Builds
            </span>
            <ul className="space-y-1.5 text-stone-400">
              <li><a href="#footwear" className="hover:text-white transition">Horween Chromexcel Chelseas</a></li>
              <li><a href="#footwear" className="hover:text-white transition">Tuscan Suede Penny Loafers</a></li>
              <li><a href="#footwear" className="hover:text-white transition">Pro-Stride Carbon Runners</a></li>
              <li><a href="#ensemble" className="hover:text-white transition">Cobbler Care Packages</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-xs uppercase tracking-wider text-white block font-serif">
              Patron Services
            </span>
            <ul className="space-y-1.5 text-stone-400">
              <li><span>Doorstep Cash on Delivery</span></li>
              <li><span>Indoor Carpet Try-On Protocol</span></li>
              <li><span>48h Free Size Exchange Courier</span></li>
              <li><span>Lifetime Cobbler Resoling Network</span></li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-xs uppercase tracking-wider text-white block font-serif">
              Craft & Sizing
            </span>
            <p className="text-stone-400 leading-relaxed">
              Nationwide cash on delivery. Inspect the stitching, leather grain, and try on carpet prior to payment.
            </p>
            <div className="inline-flex items-center space-x-1.5 text-amber-400 font-mono text-[11px] pt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Doorstep Inspection Protocol</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
