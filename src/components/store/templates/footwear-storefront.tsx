"use client";

import { StoreFooter } from "@/components/footer";

import { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Store,
  CheckCircle2,
  Truck,
  Zap,
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
  onOpenCheckout?: () => void;
  onOpenTrackOrder?: () => void;
  variant?: "artisan" | "velocity" | "street-hype" | "bespoke" | "alpine-trek" | string;
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
  onOpenCheckout,
  onOpenTrackOrder,
  allCategories,
  activeCategoryKey,
  onSelectCategory,
  allTemplates,
  templateKey,
  onSelectTemplate,
  categoriesMap,
  storeTemplatesMap,
  variant = "artisan"
}: FootwearStorefrontProps) {
  const [selectedSilhouette, setSelectedSilhouette] = useState<string>("all");
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [quickSizeMap, setQuickSizeMap] = useState<Record<string, string>>({});
  const [quickWidthMap, setQuickWidthMap] = useState<Record<string, string>>({});
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [selectedLayerIndex, setSelectedLayerIndex] = useState<number>(0);
  const [selectedFitWidth, setSelectedFitWidth] = useState<"D" | "EE">("D");

  const isVelocity = variant === "velocity";
  const isStreetHype = variant === "street-hype";
  const isBespoke = variant === "bespoke";
  const isAlpineTrek = variant === "alpine-trek";

  const themeConfig = {
    tagline: isVelocity
      ? "Kinetic Streetwear & Runners"
      : isStreetHype
      ? "SoleStreet Deadstock & Sneaker Hype Vault"
      : isBespoke
      ? "Milano Bespoke Sartorial & Oxford Hand-Patina"
      : isAlpineTrek
      ? "Summit Alpine Trail & Technical Mountaineering"
      : "Guild Bootmakers & Leathercraft",
    announcement: isVelocity
      ? "Kinetic Propulsion Labs • Carbon Torsion Plate Release"
      : isStreetHype
      ? "100% Verified Deadstock Authenticated • Live Drop Alerts"
      : isBespoke
      ? "Hand-Burnished Tuscan Calfskin • Bespoke Chisel-Toe Lasting"
      : isAlpineTrek
      ? "GORE-TEX Waterproof Membrane • Vibram Megagrip All-Terrain"
      : "Master Hand-Lasted Benchcraft • Built to be Resoled",
    pageBg: isVelocity
      ? "bg-[#0b0c10] text-zinc-100 selection:bg-orange-500"
      : isStreetHype
      ? "bg-[#0d0f14] text-cyan-100 selection:bg-cyan-500 selection:text-black"
      : isBespoke
      ? "bg-[#140f0b] text-amber-100 selection:bg-amber-600 selection:text-white"
      : isAlpineTrek
      ? "bg-[#101511] text-stone-100 selection:bg-emerald-600 selection:text-white"
      : "bg-[#faf7f2] text-stone-900 selection:bg-amber-900 selection:text-white",
    barBg: isVelocity
      ? "bg-[#10121a] text-orange-200 border-zinc-800"
      : isStreetHype
      ? "bg-[#09111c] text-cyan-300 border-cyan-950"
      : isBespoke
      ? "bg-[#1c140e] text-amber-200 border-amber-950"
      : isAlpineTrek
      ? "bg-[#141d16] text-emerald-200 border-emerald-950"
      : "bg-[#1c1917] text-stone-300 border-stone-800",
    headerBg: isVelocity
      ? "bg-[#0b0c10]/90 border-zinc-800 text-zinc-100"
      : isStreetHype
      ? "bg-[#0d0f14]/90 border-cyan-950 text-cyan-100"
      : isBespoke
      ? "bg-[#140f0b]/90 border-amber-950 text-amber-100"
      : isAlpineTrek
      ? "bg-[#101511]/90 border-emerald-950 text-stone-100"
      : "bg-[#faf7f2]/90 border-stone-200/80 text-stone-900",
    brandColor: isVelocity || isStreetHype || isBespoke || isAlpineTrek ? "text-white" : "text-stone-950",
  };

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
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-500 ${themeConfig.pageBg}`}>
      {/* ─── 1. Heritage Guild Utility Bar ──────────────────────────────────── */}
      <div className={`py-2.5 px-4 text-xs font-medium tracking-wide border-b ${themeConfig.barBg}`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="hidden sm:flex items-center space-x-2 text-[11px] text-stone-400">
            <Hammer className="w-3.5 h-3.5 text-amber-500" />
            <span>{themeConfig.announcement}</span>
          </div>
          <div className="mx-auto sm:mx-0 flex items-center space-x-2 text-xs font-semibold text-stone-100">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Doorstep Carpet Fitting Trial (COD) • Free 48h Size Exchange</span>
          </div>
          <div className="hidden md:flex items-center space-x-3 text-[11px] text-stone-400">
            <span>Genuine Goodyear Storm Welt</span>
          </div>
        </div>
      </div>

      {/* ─── 2. Clean Heritage Guild Brand Header ───────────────────────────── */}
      <header className={`sticky top-0 z-30 backdrop-blur-md border-b transition-colors ${themeConfig.headerBg}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-6">
          {/* Brand Logo & Guild Tag */}
          <Link href={`/store/${tenantSlug}`} className="flex items-center space-x-3 flex-shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-stone-900 to-amber-950 text-amber-400 flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform border border-amber-900/40">
              <Footprints className="w-5 h-5" />
            </div>
            <div>
              <span className={`font-extrabold tracking-tight text-base block leading-none font-serif ${themeConfig.brandColor}`}>
                {storeDisplayName}
              </span>
              <span className="text-[10px] text-amber-900 font-semibold block mt-1 tracking-wider uppercase">
                {themeConfig.tagline}
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

            {onOpenTrackOrder && (
              <button
                type="button"
                onClick={onOpenTrackOrder}
                className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl border border-current/20 hover:border-current/40 text-xs font-semibold opacity-80 hover:opacity-100 transition"
                title="Track Consignment"
              >
                <Truck className="w-3.5 h-3.5 text-blue-500" />
                <span className="hidden md:inline text-[11px]">Track</span>
              </button>
            )}

            {onOpenCheckout && cartItems.length > 0 && (
              <button
                type="button"
                onClick={onOpenCheckout}
                className="hidden sm:inline-flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition btn-press shadow-sm"
                title="1-Page Express Checkout"
              >
                <Zap className="w-3 h-3" />
                <span>Checkout</span>
              </button>
            )}

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
      <section className="relative overflow-hidden border-b border-stone-200/80 bg-gradient-to-b from-[#faf7f2] via-[#f4eee4] to-[#faf7f2] py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-100/90 border border-amber-300/80 rounded-full text-xs font-semibold text-amber-950">
              <Hammer className="w-3.5 h-3.5 text-amber-800" />
              <span>GUILD BENCHCRAFT • 360° GOODYEAR STORM WELTED</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-stone-950 font-serif leading-[1.12]">
              Handcrafted Leather Boots &amp; Classic Benchmade Footwear
            </h1>

            <p className="text-sm sm:text-base text-stone-600 max-w-xl leading-relaxed">
              Constructed from Horween full-grain Chromexcel pull-up leathers with tempered steel arch shanks, vegetable-tanned oak insoles, and Vibram lug soles that mold naturally to your footprint. Inspect stitch tension and try on carpet at your door before cash handover.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="#footwear"
                className="py-3 px-6 bg-stone-950 hover:bg-stone-800 text-amber-100 font-bold text-xs rounded-xl shadow-md transition flex items-center space-x-2"
              >
                <span>Shop Guild Footwear</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              <a
                href="#anatomy"
                className="py-3 px-5 bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 font-semibold text-xs rounded-xl shadow-xs transition flex items-center space-x-2"
              >
                <Ruler className="w-3.5 h-3.5 text-amber-800" />
                <span>Goodyear Welt Anatomy</span>
              </a>
            </div>

            {/* Micro Trust Indicators */}
            <div className="pt-5 border-t border-stone-300/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-stone-700">
              <div>
                <p className="text-xs font-bold text-stone-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-800" />
                  <span>360° Storm Welt</span>
                </p>
                <p className="text-[11px] text-stone-500 mt-0.5">Resoleable Vibram sole</p>
              </div>
              <div>
                <p className="text-xs font-bold text-stone-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-800" />
                  <span>Horween Leather</span>
                </p>
                <p className="text-[11px] text-stone-500 mt-0.5">Full-grain USA pull-up</p>
              </div>
              <div>
                <p className="text-xs font-bold text-stone-950 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-amber-800" />
                  <span>Doorstep Fit Trial</span>
                </p>
                <p className="text-[11px] text-stone-500 mt-0.5">Inspect prior to COD</p>
              </div>
              <div>
                <p className="text-xs font-bold text-stone-950 flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-amber-800" />
                  <span>7-Day Size Swaps</span>
                </p>
                <p className="text-[11px] text-stone-500 mt-0.5">Free doorstep courier</p>
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 bg-amber-500 text-stone-950 px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-md uppercase tracking-wider">
                  Signature Drop • -10% Off
                </div>
                <div className="absolute bottom-3 left-3 right-3 bg-stone-900/90 backdrop-blur-md p-3.5 rounded-xl border border-stone-700 shadow-lg text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-sans font-bold text-amber-400 uppercase tracking-wider block">Signature Guild Chelsea</span>
                      <p className="text-xs font-bold font-serif">Horween Chromexcel Chelsea</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-sans font-bold text-amber-300">৳6,800</span>
                      <span className="text-[10px] text-stone-400 line-through block">৳7,500</span>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-stone-800 flex items-center justify-between text-[11px]">
                    <span className="text-stone-300">360° Welt • Vibram Lug</span>
                    <button
                      onClick={() => onAddToCart(products[0], products[0]?.variants?.[0])}
                      className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-lg transition"
                    >
                      Quick Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. Footwear Visual "Shop by Silhouette" Category Grid ──────────────── */}
      <section id="silhouettes" className="py-12 px-4 sm:px-6 border-b border-stone-200/80 bg-white">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-[10px] font-sans tracking-widest text-amber-900 font-bold uppercase">
                Shop By Category
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-950 font-serif tracking-tight">
                Curated Footwear Archetypes
              </h2>
            </div>
            <p className="text-xs text-stone-500 max-w-sm">
              Select a silhouette below to explore lasts, leather gauges, and resoleable Vibram outsoles.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                id: "boots",
                title: "Storm-Welted Boots",
                desc: "Horween Chromexcel & Vibram lug soles",
                image: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=600&auto=format&fit=crop&q=80",
                badge: "Heirloom"
              },
              {
                id: "runners",
                title: "Propulsion Runners",
                desc: "Nitrogen foam & carbon torsion plate",
                image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
                badge: "Dynamic"
              },
              {
                id: "loafers",
                title: "Tuscan Suede Loafers",
                desc: "Butter-soft Italian velour calf",
                image: "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?w=600&auto=format&fit=crop&q=80",
                badge: "Luxury"
              },
              {
                id: "all",
                title: "All Guild Footwear",
                desc: "Complete benchcrafted collection",
                image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80",
                badge: "All Styles"
              }
            ].map((cat) => {
              const isActive = selectedSilhouette === cat.id;
              return (
                <div
                  key={cat.id}
                  onClick={() => {
                    setSelectedSilhouette(cat.id);
                    const el = document.getElementById("footwear");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`group relative rounded-2xl overflow-hidden border cursor-pointer transition-all duration-300 ${
                    isActive
                      ? "ring-2 ring-amber-800 border-amber-800 shadow-md scale-[1.02]"
                      : "border-stone-200 hover:border-amber-800/50 hover:shadow-lg"
                  }`}
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-stone-100 relative">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-stone-900/80 backdrop-blur-sm text-[9px] font-bold text-amber-300 font-mono">
                      {cat.badge}
                    </span>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="font-serif font-bold text-sm text-stone-100 group-hover:text-amber-300 transition-colors">
                        {cat.title}
                      </h3>
                      <p className="text-[10px] text-stone-300 line-clamp-1 mt-0.5">
                        {cat.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 5. Interactive Goodyear Welt Anatomy Workbench ─────────────── */}
      <section id="anatomy" className="py-16 px-4 sm:px-6 border-b border-stone-200/80 bg-[#fdfbf7]">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-stone-200">
            <div>
              <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-md bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-semibold mb-2">
                <Hammer className="w-3.5 h-3.5 text-amber-800" />
                <span>Master Cobbler Anatomy & Last Advisor</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                Anatomy of a True Bench-Crafted Goodyear Welt
              </h2>
              <p className="text-sm text-stone-600 mt-1 max-w-xl">
                Explore the 5 anatomical layers of heirloom boot construction. Select a component below to inspect tannery provenance, leather gauge, and resoleability.
              </p>
            </div>

            {/* Brannock Width Selector */}
            <div className="flex items-center space-x-2 bg-stone-100 p-1.5 rounded-xl border border-stone-200 self-start md:self-auto">
              <span className="text-[11px] font-semibold text-stone-600 px-2 font-mono">Brannock Last:</span>
              <button
                type="button"
                onClick={() => setSelectedFitWidth("D")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition font-mono ${
                  selectedFitWidth === "D"
                    ? "bg-amber-900 text-white shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Standard (D)
              </button>
              <button
                type="button"
                onClick={() => setSelectedFitWidth("EE")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition font-mono ${
                  selectedFitWidth === "EE"
                    ? "bg-amber-900 text-white shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Wide (EE)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: 5 Interactive Anatomy Layer Pills */}
            <div className="lg:col-span-5 space-y-2.5">
              {ANATOMY_SPECS.map((spec, idx) => {
                const isSelected = selectedLayerIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedLayerIndex(idx)}
                    className={`w-full p-4 rounded-2xl text-left border transition flex items-center justify-between ${
                      isSelected
                        ? "bg-white border-amber-800 ring-2 ring-amber-800/20 shadow-sm"
                        : "bg-[#f5f2eb] border-stone-200/80 hover:bg-white hover:border-stone-300"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={`w-7 h-7 rounded-full text-xs font-mono font-bold flex items-center justify-center transition ${
                        isSelected
                          ? "bg-amber-900 text-white"
                          : "bg-stone-200 text-stone-700"
                      }`}>
                        {idx + 1}
                      </span>
                      <div>
                        <span className="text-xs font-bold text-stone-900 block">{spec.layer}</span>
                        <span className="text-[10px] text-stone-500 line-clamp-1 truncate max-w-[220px]">
                          {spec.guild}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? "text-amber-800 translate-x-1" : "text-stone-400"}`} />
                  </button>
                );
              })}
            </div>

            {/* Right: Focused Anatomy Spec Inspector */}
            {(() => {
              const activeLayer = ANATOMY_SPECS[selectedLayerIndex];
              return (
                <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 space-y-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
                    <div>
                      <span className="text-[10px] font-mono text-amber-800 font-bold uppercase tracking-wider">
                        Component Inspector
                      </span>
                      <h3 className="text-lg font-bold text-stone-900 mt-0.5">{activeLayer.layer}</h3>
                    </div>
                    <span className="self-start sm:self-auto px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200 text-xs font-semibold">
                      100% Lifetime Resoleable
                    </span>
                  </div>

                  {/* Comparison Cards: Guild vs Commercial */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-900 font-bold block">
                        Our Guild Craftsmanship
                      </span>
                      <p className="text-xs font-bold text-stone-900 leading-snug">
                        {activeLayer.guild}
                      </p>
                      <p className="text-[11px] text-stone-600 leading-relaxed">
                        {activeLayer.benefit}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-rose-800 font-bold block">
                        Commercial Fast-Fashion
                      </span>
                      <p className="text-xs font-medium text-stone-500 line-through leading-snug">
                        {activeLayer.fastFashion}
                      </p>
                      <p className="text-[11px] text-stone-500 leading-relaxed">
                        Cannot be rebuilt by a cobbler. Destined for landfill within 6-12 months.
                      </p>
                    </div>
                  </div>

                  {/* Footbed Moulding Timeline */}
                  <div className="bg-[#f8f6f0] rounded-xl p-4 border border-stone-200 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-stone-900">Custom Footprint Break-In Curve</span>
                      <span className="font-mono text-amber-800 font-bold">10 Wears to Custom Mould</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                      <div className="w-4/5 h-full bg-gradient-to-r from-amber-700 to-amber-900 rounded-full" />
                    </div>
                    <p className="text-[11px] text-stone-600 leading-relaxed pt-1">
                      The natural granulated cork filler absorbs heat and weight, permanently depressing to match your exact longitudinal and transverse arch.
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* ─── 6. The Master Cobbler Lifetime Ensemble (Bundle Quick-Add) ──────── */}
      <section id="ensemble" className="py-16 px-4 sm:px-6 border-b border-stone-200/80 bg-gradient-to-r from-amber-50/50 via-[#faf7f2] to-stone-100">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl border border-stone-300/80 p-6 sm:p-10 shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-100 text-amber-950 rounded-full text-xs font-medium tracking-wide border border-amber-300">
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
                    <span className="w-5 h-5 rounded-full bg-stone-900 text-amber-400 text-[10px] font-bold flex items-center justify-center">1</span>
                    <span>Horween Chromexcel Chelsea Boot (৳6,800)</span>
                  </div>
                  <div className="flex items-center space-x-2.5 text-xs text-stone-800 font-medium">
                    <span className="w-5 h-5 rounded-full bg-stone-900 text-amber-400 text-[10px] font-bold flex items-center justify-center">2</span>
                    <span>Tuscan Suede Penny Loafer (৳4,950)</span>
                  </div>
                  <div className="flex items-center space-x-2.5 text-xs text-stone-800 font-medium">
                    <span className="w-5 h-5 rounded-full bg-stone-900 text-amber-400 text-[10px] font-bold flex items-center justify-center">3</span>
                    <span>Pro-Stride Nitrogen Running Sneaker (৳5,400)</span>
                  </div>
                </div>

                <div className="pt-4 flex items-baseline space-x-3">
                  <span className="text-2xl font-black text-amber-950">৳14,990</span>
                  <span className="text-sm text-stone-400 line-through">৳17,150</span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Save ৳2,160 (13% Off)
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
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-amber-900 mb-1">
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

        {/* Disciplined 4:3 Product Grid - Mobile First 2-Col */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 lg:gap-6 pt-6 sm:pt-8">
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
                className="group bg-white rounded-2xl border border-stone-200 hover:border-amber-800/40 transition-all duration-300 p-2.5 sm:p-3.5 flex flex-col justify-between shadow-2xs hover:shadow-md cursor-pointer"
              >
                {/* 4:3 Landscape Media Frame */}
                <div>
                  <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-stone-100 border border-stone-200/80 mb-2.5 sm:mb-3.5">
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
                    <div className="absolute top-2 sm:top-2.5 left-2 sm:left-2.5 z-10">
                      <span className="px-1.5 sm:px-2.5 py-0.5 sm:py-1 bg-white/95 backdrop-blur-md rounded-full text-[8.5px] sm:text-[10px] font-bold text-amber-950 border border-amber-300 shadow-2xs uppercase tracking-wider font-mono">
                        {p.badge || "Welted"}
                      </span>
                    </div>

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(p.id);
                      }}
                      className={`absolute top-2 sm:top-2.5 right-2 sm:right-2.5 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all ${
                        isSaved
                          ? "bg-amber-600 text-white shadow-xs"
                          : "bg-white/90 text-stone-600 hover:bg-white hover:text-amber-900 shadow-2xs"
                      }`}
                      aria-label="Save to favorites"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
                    </button>

                    {/* Carpet Fitting Seal */}
                    <div className="absolute bottom-2 sm:bottom-2.5 left-2 sm:left-2.5 z-10 hidden sm:block">
                      <span className="px-2 py-0.5 bg-black/80 backdrop-blur-md text-amber-300 rounded text-[9px] font-mono tracking-wide">
                        Carpet Fitting Guarantee
                      </span>
                    </div>
                  </div>

                  {/* Quick US Shoe Size Selector Pills */}
                  <div className="mb-2 sm:mb-3 space-y-1 sm:space-y-1.5" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between text-[9px] sm:text-[10px]">
                      <span className="text-stone-500 font-medium">Size:</span>
                      <span className="font-mono text-amber-900 font-bold">{chosenSize}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {["US 8", "US 9", "US 10", "US 11"].map((sz) => {
                        const isSel = chosenSize.toLowerCase() === sz.toLowerCase();
                        return (
                          <button
                            key={sz}
                            onClick={(e) => handleQuickSizeSelect(p.id, sz, e)}
                            className={`px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-mono font-semibold border transition ${
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
                  <div className="flex items-center space-x-1 mb-1">
                    <div className="flex text-amber-600">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
                      ))}
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-sans font-bold text-stone-800">5.0</span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900 group-hover:text-amber-900 transition leading-snug font-serif line-clamp-1 sm:line-clamp-2">
                    {p.title}
                  </h3>
                  <p className="hidden sm:block text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                {/* Price & Add to Bag */}
                <div className="pt-2 sm:pt-3 mt-2 border-t border-stone-200 flex items-center justify-between gap-1">
                  <div>
                    <span className="text-xs sm:text-base font-black text-stone-950 font-sans">
                      ৳{p.price.toLocaleString("en-BD")}
                    </span>
                    {p.comparePrice > p.price && (
                      <span className="text-[10px] sm:text-xs text-stone-400 line-through font-sans ml-1">
                        ৳{p.comparePrice.toLocaleString("en-BD")}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => handleCardQuickAdd(p, e)}
                    className="py-1.5 sm:py-2 px-2.5 sm:px-3.5 bg-stone-950 hover:bg-stone-800 text-amber-200 font-bold text-[10px] sm:text-xs rounded-lg sm:rounded-xl shadow-xs transition flex items-center space-x-1 sm:space-x-1.5 btn-press shrink-0 active:scale-95"
                  >
                    <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
                    <span className="hidden sm:inline">Add to Bag</span>
                    <span className="sm:hidden">Add</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── 7.5 Commercial Split Promotional Banners ─────────────────────────── */}
      <section className="py-10 px-4 sm:px-6 bg-[#faf7f2] border-b border-stone-200">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative overflow-hidden rounded-3xl bg-stone-900 text-white p-6 sm:p-8 flex flex-col justify-between shadow-lg border border-stone-800">
            <div className="space-y-3 z-10">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold bg-amber-950/80 px-2.5 py-1 rounded-md border border-amber-800/80 inline-block">
                Complimentary Guild Kit
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-black text-stone-100">
                Guild Boot Care Kit with Any 2 Pairs
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed max-w-md">
                Order any two pairs of Goodyear-welted boots or shoes and receive a full Horween leather conditioner set with German horsehair dauber brush (value ৳1,800) free.
              </p>
            </div>
            <div className="pt-6 z-10">
              <a
                href="#footwear"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl transition"
              >
                <span>Bundle &amp; Save</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none translate-x-6 translate-y-6">
              <Hammer className="w-48 h-48 text-amber-500" />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 to-stone-100 text-stone-900 p-6 sm:p-8 flex flex-col justify-between shadow-sm border border-stone-300/80">
            <div className="space-y-3 z-10">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-900 font-bold bg-amber-200/60 px-2.5 py-1 rounded-md border border-amber-300 inline-block">
                64-District Courier Service
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-black text-stone-950">
                Doorstep Carpet Trial &amp; Free Size Exchange
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed max-w-md">
                Unbox with the delivery rider, check the stitch tension on indoor carpet, and verify fit. If you need half a size up or down, we dispatch the replacement within 24 hours.
              </p>
            </div>
            <div className="pt-6 z-10">
              <a
                href="#trial"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-stone-950 hover:bg-stone-800 text-amber-100 font-bold text-xs rounded-xl transition"
              >
                <span>Learn About Trial Protocol</span>
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 8. The Doorstep Carpet Fitting Protocol (COD Promise) ──────────── */}
      <section id="trial" className="py-16 px-4 sm:px-6 border-b border-stone-200/80 bg-[#f4eee4]">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-100 text-amber-950 rounded-full text-xs font-medium tracking-wide border border-amber-300">
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
                <span className="text-2xl font-black text-amber-900 block">{card.step}</span>
                <h3 className="text-sm font-bold text-stone-900 font-serif">{card.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">{card.desc}</p>
                <div className="pt-2 border-t border-stone-200 text-[11px] font-semibold text-amber-900">
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
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-900">
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
                    <span className="text-[11px] font-medium text-amber-900 bg-amber-100/70 px-2.5 py-0.5 rounded-full border border-amber-200">
                      Verified Wearer
                    </span>
                  </div>

                  <p className="text-xs text-stone-700 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-200 text-[11px]">
                  <p className="font-bold text-stone-900 font-serif">{rev.author}</p>
                  <p className="text-stone-500 text-[11px]">{rev.fitNote}</p>
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
            Receive ৳300 off your first cash on delivery order, archival batch reserve notifications, and our comprehensive boot waxing & conditioning manual.
          </p>

          {newsletterSubscribed ? (
            <div className="p-4 bg-amber-100/80 border border-amber-300 rounded-2xl text-xs text-amber-950 font-semibold space-y-1">
              <div className="flex items-center justify-center space-x-1.5 text-amber-900">
                <Check className="w-4 h-4" />
                <span>Welcome to the Guild Circle!</span>
              </div>
              <p className="text-[11px] text-stone-600 font-normal">
                Use code <strong className="font-mono text-amber-900 font-bold">GUILD300</strong> for ৳300 off at checkout.
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
                Claim ৳300
              </button>
            </form>
          )}
        </div>
      </section>

      
      {/* ─── Unified Professional Multi-Column Store Footer ────────────────── */}
      <StoreFooter
        storeName={storeDisplayName}
        storeSlug={tenantSlug}
        onOpenTrackOrder={onOpenTrackOrder}
        categoryName="Footwear & Leather"
      />
    </div>
  );
}
