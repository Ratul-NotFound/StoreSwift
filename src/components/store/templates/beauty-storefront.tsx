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
  Droplets,
  Flower2,
  ChevronRight,
  ChevronDown,
  Info,
  Sun,
  Moon
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
  onOpenCheckout?: () => void;
  onOpenTrackOrder?: () => void;
  variant?: "glow" | "luxe-glam" | "k-beauty" | "derma-rx" | "apothecary" | string;
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
  { id: "barrier", label: "Barrier Repair & Calm", description: "Ceramide NP & Essential Lipid Complex" },
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
    name: "Ceramide NP + AP Complex",
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
  variant = "glow"
}: BeautyStorefrontProps) {
  const [selectedConcern, setSelectedConcern] = useState<string>("all");
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [quickVolumeMap, setQuickVolumeMap] = useState<Record<string, string>>({});
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [routineMode, setRoutineMode] = useState<"am" | "pm">("am");
  const [activeRoutineStep, setActiveRoutineStep] = useState<number>(0);

  const isGlam = variant === "luxe-glam";
  const isKBeauty = variant === "k-beauty";
  const isDermaRx = variant === "derma-rx";
  const isApothecary = variant === "apothecary";

  const themeConfig = {
    tagline: isGlam
      ? "Haute Parfumerie & Velvet Glamour"
      : isKBeauty
      ? "Seoul Glass Skin Dew & Ferment Labs"
      : isDermaRx
      ? "Dermacure Medical Rx & Barrier Labs"
      : isApothecary
      ? "Wildcrafted Botanical Herbal Apothecary"
      : "Clinical Botanical Labs",
    announcement: isGlam
      ? "Complimentary Golden Elixir Decant on Orders ৳2,000+"
      : isKBeauty
      ? "10-Step K-Beauty Glass Skin Ritual Guide with Every Order"
      : isDermaRx
      ? "Dermatologically Certified Non-Comedogenic & Hypoallergenic"
      : isApothecary
      ? "Cold-Pressed Small Batch Seed Extracts • Pure Amber Glass Packaging"
      : "Complimentary Deluxe Mini on Orders ৳1,500+",
    pageBg: isGlam
      ? "bg-[#0e0714] text-rose-100 selection:bg-amber-500"
      : isKBeauty
      ? "bg-[#f8f5fc] text-purple-950 selection:bg-purple-500 selection:text-white"
      : isDermaRx
      ? "bg-[#071322] text-sky-100 selection:bg-sky-500 selection:text-white"
      : isApothecary
      ? "bg-[#161009] text-amber-100 selection:bg-amber-600 selection:text-white"
      : "bg-[#faf8f6] text-zinc-900 selection:bg-rose-500 selection:text-white",
    barBg: isGlam
      ? "bg-[#140a1c] text-amber-200 border-rose-950/80"
      : isKBeauty
      ? "bg-[#25103a] text-purple-200 border-purple-900/80"
      : isDermaRx
      ? "bg-[#0b1d36] text-sky-200 border-sky-900/80"
      : isApothecary
      ? "bg-[#22170d] text-amber-200 border-amber-950"
      : "bg-[#1c0f13] text-rose-200 border-rose-950/80",
    headerBg: isGlam
      ? "bg-[#0e0714]/90 border-rose-950/80 text-rose-100"
      : isKBeauty
      ? "bg-[#f8f5fc]/90 border-purple-200 text-purple-950"
      : isDermaRx
      ? "bg-[#071322]/90 border-sky-900/80 text-sky-100"
      : isApothecary
      ? "bg-[#161009]/90 border-amber-900/40 text-amber-100"
      : "bg-[#faf8f6]/85 border-rose-100/70 text-zinc-900",
    brandColor: isGlam
      ? "text-amber-100"
      : isKBeauty
      ? "text-purple-950"
      : isDermaRx
      ? "text-sky-100"
      : isApothecary
      ? "text-amber-100"
      : "text-zinc-900",
    taglineColor: isGlam
      ? "text-amber-400"
      : isKBeauty
      ? "text-purple-600"
      : isDermaRx
      ? "text-sky-400"
      : isApothecary
      ? "text-amber-400"
      : "text-rose-600",
  };

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
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-500 ${themeConfig.pageBg}`}>
      {/* ─── 1. Clinical Beauty Announcement Bar ────────────────────────────── */}
      <div className={`py-2.5 px-4 text-xs font-medium tracking-wide border-b ${themeConfig.barBg}`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="hidden sm:flex items-center space-x-2 text-[11px] text-rose-300/80">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>{themeConfig.announcement}</span>
          </div>
          <div className="mx-auto sm:mx-0 flex items-center space-x-2 text-xs font-semibold text-rose-100">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            <span>Cold-Chain Freshness Guaranteed • Inspect Tamper Seal at Doorstep</span>
          </div>
          <div className="hidden md:flex items-center space-x-3 text-[11px] text-rose-300/80">
            <span>100% Leaping Bunny Cruelty-Free</span>
          </div>
        </div>
      </div>

      {/* ─── 2. Clean Luxe Glow Brand Header ────────────────────────────────── */}
      <header className={`sticky top-0 z-30 backdrop-blur-md border-b transition-colors ${themeConfig.headerBg}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-6">
          {/* Brand Logo & Tag */}
          <Link href={`/store/${tenantSlug}`} className="flex items-center space-x-3 flex-shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
              <Flower2 className="w-5 h-5" />
            </div>
            <div>
              <span className={`font-extrabold tracking-tight text-base block leading-none ${themeConfig.brandColor}`}>
                {storeDisplayName}
              </span>
              <span className="text-[10px] text-rose-600 font-semibold block mt-1 tracking-wider uppercase">
                {themeConfig.tagline}
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
      <section className="relative overflow-hidden border-b border-rose-100/70 bg-gradient-to-b from-[#faf8f6] via-[#f7f2ee] to-[#faf8f6] py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-rose-50 border border-rose-200/80 rounded-full text-xs font-semibold text-rose-800">
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              <span>DERMATOLOGIST FORMULATED • 100% NON-COMEDOGENIC &amp; CLEAN</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-zinc-950 leading-[1.12]">
              Clinical Botanical Skincare &amp; Barrier Health Formulas
            </h1>

            <p className="text-sm sm:text-base text-zinc-600 max-w-xl leading-relaxed">
              Bio-compatible active serums, ceramide lipid barrier restorers, and mineral zinc sunscreens formulated without parabens, synthetic fragrance, or silicones. Inspect cold-chain induction seals and batch codes at your door prior to cash on delivery.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="#rituals"
                className="py-3 px-6 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center space-x-2"
              >
                <span>Shop Clinical Rituals</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              <a
                href="#bundle"
                className="py-3 px-5 bg-white border border-rose-200 hover:bg-rose-50 text-zinc-800 font-semibold text-xs rounded-xl shadow-xs transition flex items-center space-x-2"
              >
                <Droplets className="w-3.5 h-3.5 text-rose-600" />
                <span>The Glass Skin System</span>
              </a>
            </div>

            {/* Micro Trust Indicators */}
            <div className="pt-5 border-t border-rose-200/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-zinc-700">
              <div>
                <p className="text-xs font-bold text-zinc-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>Dermatologist Tested</span>
                </p>
                <p className="text-[11px] text-zinc-500 mt-0.5">Non-comedogenic</p>
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
                  <span>Cold-Chain Sealed</span>
                </p>
                <p className="text-[11px] text-zinc-500 mt-0.5">Induction foil intact</p>
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-950 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-rose-600" />
                  <span>Doorstep Inspection</span>
                </p>
                <p className="text-[11px] text-zinc-500 mt-0.5">Inspect prior to COD</p>
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-950 flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                  <span>14-Day Guarantee</span>
                </p>
                <p className="text-[11px] text-zinc-500 mt-0.5">Skin barrier promise</p>
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 bg-rose-600 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-md uppercase tracking-wider">
                  Award Winner • -15% Off
                </div>
                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-white/60 shadow-lg text-zinc-900">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block">Award-Winning</span>
                      <p className="text-xs font-black">Pure Glow Triple Hyaluronic Dew</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-rose-700">৳2,850</span>
                      <span className="text-[10px] text-zinc-400 line-through block">৳3,350</span>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-rose-100 flex items-center justify-between text-[11px]">
                    <span className="text-zinc-500">Tremella Mushroom • Squalane</span>
                    <button
                      onClick={() => onAddToCart(products[0], products[0]?.variants?.[0])}
                      className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg transition"
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

      {/* ─── 4. Skin Concern / Category Navigation Filter ───────────────────── */}
      <section id="concerns" className="py-12 px-4 sm:px-6 border-b border-rose-100/70 bg-white">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                Shop By Skin Need
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
                Targeted Clinical Formulations
              </h2>
            </div>
            <p className="text-xs text-zinc-500 max-w-sm">
              Formulated specifically to repair lipid barriers without aggravating reactive or acne-prone skin.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                id: "barrier",
                title: "Barrier Repair & Hydration",
                desc: "Ceramides & triple hyaluronic acid",
                image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
                badge: "Ceramides"
              },
              {
                id: "brighten",
                title: "Active Peptides & Radiance",
                desc: "Stabilized Vitamin C & niacinamide",
                image: "https://images.unsplash.com/photo-1608248597359-5932598377b2?w=600&auto=format&fit=crop&q=80",
                badge: "Active C"
              },
              {
                id: "cleanse",
                title: "Gentle Oat Cleansers",
                desc: "Colloidal oat & organic rose hydrolat",
                image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80",
                badge: "pH 5.5"
              },
              {
                id: "all",
                title: "All Clinical Skincare",
                desc: "Complete non-comedogenic rituals",
                image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop&q=80",
                badge: "All Formulas"
              }
            ].map((cat) => {
              const isActive = selectedConcern === cat.id;
              return (
                <div
                  key={cat.id}
                  onClick={() => {
                    setSelectedConcern(cat.id);
                    const el = document.getElementById("rituals");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`group relative rounded-2xl overflow-hidden border cursor-pointer transition-all duration-300 ${
                    isActive
                      ? "ring-2 ring-rose-500 border-rose-500 shadow-md scale-[1.02]"
                      : "border-rose-100 hover:border-rose-300 hover:shadow-lg"
                  }`}
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-rose-50 relative">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-rose-950/80 backdrop-blur-sm text-[9px] font-bold text-rose-200 font-mono">
                      {cat.badge}
                    </span>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="font-bold text-sm text-white group-hover:text-rose-200 transition-colors">
                        {cat.title}
                      </h3>
                      <p className="text-[10px] text-rose-100 line-clamp-1 mt-0.5">
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

      {/* ─── 5. Interactive AM / PM Skincare Routine Sequencer ─────────────────── */}
      <section id="bundle" className="py-16 px-4 sm:px-6 border-b border-rose-100/70 bg-gradient-to-r from-rose-50/50 via-white to-pink-50/40">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-rose-100">
            <div>
              <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-md bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-semibold mb-2">
                <Flower2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Clinical Routine Sequencer</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
                AM / PM Bio-Active Ritual Architecture
              </h2>
              <p className="text-sm text-zinc-600 mt-1 max-w-xl">
                Active clinical skincare requires disciplined layering from thinnest molecular weight to deepest lipid occlusion. Select your morning or evening sequence.
              </p>
            </div>

            {/* AM vs PM Toggle */}
            <div className="inline-flex items-center p-1 rounded-xl bg-rose-100/60 border border-rose-200/70 self-start md:self-auto">
              <button
                type="button"
                onClick={() => {
                  setRoutineMode("am");
                  setActiveRoutineStep(0);
                }}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${
                  routineMode === "am"
                    ? "bg-white text-amber-700 shadow-xs"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Morning Dew (AM)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setRoutineMode("pm");
                  setActiveRoutineStep(0);
                }}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${
                  routineMode === "pm"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-indigo-500" />
                <span>Evening Repair (PM)</span>
              </button>
            </div>
          </div>

          {/* Routine Steps & Interactive Stage */}
          {(() => {
            const routines = {
              am: {
                title: "Morning Dew Barrier & Anti-Pollution Shield",
                time: "3 Minutes • 4 Steps",
                target: "Hydration, Environmental Defense & UV Barrier",
                bundlePrice: 6200,
                comparePrice: 7450,
                steps: [
                  { step: "01", name: "Gentle Amino Oat Cleanser", active: "pH 5.5 • Hydrolyzed Oat", role: "Rinses nightly sebum without stripping the skin's acidic lipid barrier.", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80" },
                  { step: "02", name: "10% Vitamin C + Ferulic Dew", active: "10% Ascorbyl • 0.5% Ferulic", role: "Potent free radical scavenger that brightens skin and amplifies sun protection.", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=80" },
                  { step: "03", name: "Botanical Squalane Emulsion", active: "Pure Plant Squalane", role: "Micro-droplet moisture matrix that imparts a luminous glass finish without heaviness.", image: "https://images.unsplash.com/photo-1608248597359-38c2020e26b1?w=500&auto=format&fit=crop&q=80" },
                  { step: "04", name: "Invisible Mineral Zinc Shield", active: "Non-Nano Zinc SPF 50+", role: "Broad-spectrum physical UVA/UVB block with zero white cast or eye sting.", image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&auto=format&fit=crop&q=80" }
                ]
              },
              pm: {
                title: "Evening Stratum Corneum Cellular Recovery",
                time: "5 Minutes • 4 Steps",
                target: "Deep Cellular Repair, Pore Decongestion & Ceramide Occlusion",
                bundlePrice: 6850,
                comparePrice: 8200,
                steps: [
                  { step: "01", name: "Melting Camellia Cleansing Balm", active: "100% Virgin Camellia", role: "Dissolves stubborn waterproof sunscreen, city particulates, and oxidized oils.", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80" },
                  { step: "02", name: "2% BHA Salicylic Exfoliating Essence", active: "2% Salicylic • Green Tea", role: "Penetrates oil-lined pore walls to clear congestion, whiteheads, and dead keratin.", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=80" },
                  { step: "03", name: "Bio-Identical Ceramide NP Matrix", active: "3.5% Ceramides (1:3:1 ratio)", role: "Reconstructs damaged intercellular skin bricks to stop trans-epidermal water loss.", image: "https://images.unsplash.com/photo-1608248597359-38c2020e26b1?w=500&auto=format&fit=crop&q=80" },
                  { step: "04", name: "Overnight Bakuchiol Sleeping Cream", active: "1% Botanical Bakuchiol", role: "Gentle plant-derived retinol alternative stimulating nocturnal collagen turnover.", image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&auto=format&fit=crop&q=80" }
                ]
              }
            };
            const current = routines[routineMode];

            return (
              <div className="bg-white rounded-3xl border border-rose-200/80 p-6 sm:p-8 shadow-md space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-100/80 pb-4">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-rose-600">
                      Sequence Protocol
                    </span>
                    <h3 className="text-lg font-bold text-zinc-900">{current.title}</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">{current.target}</p>
                  </div>
                  <div className="flex items-center space-x-3 text-xs">
                    <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 font-medium border border-rose-200/60">
                      {current.time}
                    </span>
                  </div>
                </div>

                {/* 4 Interactive Step Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {current.steps.map((st, i) => {
                    const isSelected = activeRoutineStep === i;
                    return (
                      <div
                        key={st.step}
                        onClick={() => setActiveRoutineStep(i)}
                        className={`rounded-2xl p-4 border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                          isSelected
                            ? "bg-rose-50/70 border-rose-400 ring-2 ring-rose-400/20 shadow-xs"
                            : "bg-[#faf9f7] border-rose-100 hover:border-rose-300"
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="w-6 h-6 rounded-full bg-rose-200 text-rose-800 text-[10px] font-bold flex items-center justify-center">
                              {st.step}
                            </span>
                            <span className="text-[10px] text-rose-600 font-semibold truncate max-w-[120px]">
                              {st.active}
                            </span>
                          </div>

                          <div className="aspect-[4/3] rounded-xl overflow-hidden bg-white border border-rose-100/60 my-1">
                            <img src={st.image} alt={st.name} className="w-full h-full object-cover" />
                          </div>

                          <h4 className="text-xs font-bold text-zinc-900 leading-snug">{st.name}</h4>
                          <p className="text-[11px] text-zinc-600 leading-relaxed">{st.role}</p>
                        </div>

                        <div className="pt-2 border-t border-rose-100/80 flex items-center justify-between text-[10px]">
                          <span className="text-rose-700 font-semibold">Step {i + 1} of 4</span>
                          <span className="text-zinc-400">Bio-Available</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 1-Click Regimen Add Bar */}
                <div className="bg-[#faf8f6] rounded-2xl p-4 sm:p-5 border border-rose-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-rose-700">
                      Complete Regimen Special
                    </span>
                    <div className="flex items-baseline space-x-2 mt-0.5">
                      <span className="text-xl font-black text-rose-700">৳{current.bundlePrice.toLocaleString()}</span>
                      <span className="text-xs text-zinc-400 line-through">৳{current.comparePrice.toLocaleString()}</span>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Save ৳{(current.comparePrice - current.bundlePrice).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-1">
                      Includes all 4 full-size products with freshness guarantees and cold-sealed delivery box.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAdd3StepBundle}
                    className="py-3 px-6 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center space-x-2 whitespace-nowrap btn-press"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add Complete {routineMode.toUpperCase()} Regimen to Bag</span>
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ─── 6. Main Product Catalog (Square 1:1 Aspect Ratio) ──────────────── */}
      <section id="rituals" className="py-16 px-4 sm:px-6 max-w-6xl mx-auto w-full flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-rose-100/80 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-rose-600 mb-1">
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

        {/* Disciplined Beauty Product Grid (Square 1:1) - Mobile First 2-Col */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 lg:gap-6 pt-6 sm:pt-8">
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
                className="group bg-white rounded-2xl border border-rose-100 hover:border-rose-300 transition-all duration-300 p-2.5 sm:p-3.5 flex flex-col justify-between shadow-xs hover:shadow-md cursor-pointer"
              >
                {/* 1:1 Square Media Frame */}
                <div>
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-rose-50/40 border border-rose-100/50 mb-2 sm:mb-3.5">
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
                    <div className="absolute top-2 sm:top-2.5 left-2 sm:left-2.5 z-10">
                      <span className="px-1.5 sm:px-2.5 py-0.5 sm:py-1 bg-white/95 backdrop-blur-md rounded-full text-[8.5px] sm:text-[10px] font-bold text-rose-700 border border-rose-200/80 shadow-xs uppercase tracking-wider">
                        {p.badge || "Clean"}
                      </span>
                    </div>

                    {/* Wishlist Heart Action */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(p.id);
                      }}
                      className={`absolute top-2 sm:top-2.5 right-2 sm:right-2.5 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all ${
                        isSaved
                          ? "bg-rose-600 text-white shadow-xs"
                          : "bg-white/90 text-zinc-600 hover:bg-white hover:text-rose-600 shadow-xs"
                      }`}
                      aria-label="Save to favorites"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
                    </button>

                    {/* Doorstep Inspection Seal Badge */}
                    <div className="absolute bottom-2 sm:bottom-2.5 left-2 sm:left-2.5 z-10 hidden sm:block">
                      <span className="px-2 py-0.5 bg-black/75 backdrop-blur-md text-white rounded text-[9px] font-mono tracking-wide">
                        Tamper Foil Sealed
                      </span>
                    </div>
                  </div>

                  {/* Volume Variant Selector Pills */}
                  {p.variants.length > 0 && (
                    <div className="mb-2 sm:mb-3 space-y-1 sm:space-y-1.5" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-between text-[9px] sm:text-[10px]">
                        <span className="text-zinc-500 font-medium">Volume:</span>
                        <span className="font-mono text-rose-700 font-bold">{chosenVolume}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {p.variants.map((v, vIdx) => {
                          const val = v.title.includes(": ") ? v.title.split(": ")[1] : v.title;
                          const isSel = chosenVolume.toLowerCase() === val.toLowerCase();
                          return (
                            <button
                              key={vIdx}
                              onClick={(e) => handleQuickVolumeSelect(p.id, val, e)}
                              className={`px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-semibold border transition ${
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
                  <div className="flex items-center space-x-1 mb-1">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
                      ))}
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-mono font-bold text-zinc-700">5.0</span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xs sm:text-sm font-bold text-zinc-900 group-hover:text-rose-600 transition leading-snug line-clamp-1 sm:line-clamp-2">
                    {p.title}
                  </h3>
                  <p className="hidden sm:block text-xs text-zinc-500 line-clamp-2 mt-1 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                {/* Price & Add to Bag */}
                <div className="pt-2 sm:pt-3 mt-2 border-t border-rose-100 flex items-center justify-between gap-1">
                  <div>
                    <span className="text-xs sm:text-base font-black text-zinc-900">
                      ৳{p.price.toLocaleString("en-BD")}
                    </span>
                    {p.comparePrice > p.price && (
                      <span className="text-[10px] sm:text-xs text-zinc-400 line-through ml-1">
                        ৳{p.comparePrice.toLocaleString("en-BD")}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => handleCardQuickAdd(p, e)}
                    className="py-1.5 sm:py-2 px-2.5 sm:px-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] sm:text-xs rounded-lg sm:rounded-xl shadow-xs transition flex items-center space-x-1 sm:space-x-1.5 btn-press shrink-0 active:scale-95"
                  >
                    <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span className="hidden sm:inline">Add to Bag</span>
                    <span className="sm:hidden">Add</span>
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
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-600">
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
                    <span className="text-[10px] font-semibold text-rose-700 uppercase bg-rose-100/80 px-2 py-0.5 rounded">
                      {active.potency}
                    </span>
                    <Droplets className="w-4 h-4 text-rose-500" />
                  </div>
                  <h3 className="text-sm font-bold text-zinc-900 leading-tight">
                    {active.name}
                  </h3>
                  <p className="text-[11px] text-zinc-500">
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
                <span className="text-2xl font-black text-rose-600 block">{card.step}</span>
                <h3 className="text-sm font-bold text-zinc-900">{card.title}</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">{card.desc}</p>
                <div className="pt-2 border-t border-rose-100 text-[11px] font-semibold text-rose-700">
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
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-600">
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
                routine: "Used: 3-Step Glass Skin Ritual",
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
                    <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200/50">
                      Verified Buyer
                    </span>
                  </div>

                  <p className="text-xs text-zinc-700 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-3 border-t border-rose-200/50 text-[11px]">
                  <p className="font-bold text-zinc-900">{rev.author}</p>
                  <p className="text-rose-700 text-[11px] font-medium">{rev.skinType}</p>
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

      
      {/* ─── Unified Professional Multi-Column Store Footer ────────────────── */}
      <StoreFooter
        storeName={storeDisplayName}
        storeSlug={tenantSlug}
        onOpenTrackOrder={onOpenTrackOrder}
        categoryName="Beauty & Skincare"
      />
    </div>
  );
}
