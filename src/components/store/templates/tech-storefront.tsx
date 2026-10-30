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
  Cpu,
  Zap,
  Activity,
  Headphones,
  Sliders,
  ChevronRight,
  ChevronDown,
  Info
} from "lucide-react";
import { IStoreTemplate } from "@/templates/types";
import { CartItem } from "@/lib/cart";

export interface TechStorefrontProps {
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

// Tech Categories
const TECH_CATEGORIES = [
  { id: "all", label: "All Telemetry Hardware", subtitle: "Aviation CNC peripherals & acoustics" },
  { id: "audio", label: "Planar & Hybrid Audio", subtitle: "40mm custom beryllium drivers & 45h ANC" },
  { id: "keyboards", label: "CNC Mechanical Keyboards", subtitle: "Gasket-mounted 6063 billet aluminum" },
  { id: "power", label: "High-Density GaN Power", subtitle: "100W GaN III fast delivery & silicone cables" }
];

// Hardware Architecture Benchmarks
const HARDWARE_BENCHMARKS = [
  {
    component: "Acoustic Transducer",
    spec: "40mm Custom Beryllium Driver",
    metric: "<0.05% THD @ 1kHz",
    advantage: "Ultra-rigid lightweight diaphragm prevents high-frequency distortion, delivering transparent spatial staging."
  },
  {
    component: "Wireless Protocol",
    spec: "Bluetooth 5.4 + aptX Lossless",
    metric: "24-bit / 96kHz Lossless",
    advantage: "Bit-for-bit transmission with sub-20ms ultra-low latency mode for precision studio monitoring."
  },
  {
    component: "Chassis Material",
    spec: "6063 Anodized Billet Aluminum",
    metric: "CNC Milled to ±0.02mm",
    advantage: "Superior acoustic dampening and indestructible structural rigidity with bead-blasted satin finish."
  },
  {
    component: "Thermal Management",
    spec: "Gallium Nitride (GaN III) Transistors",
    metric: "94% Energy Efficiency",
    advantage: "Operates 25°C cooler than traditional silicon transformers while packing 100W into pocket dimensions."
  }
];

export function TechStorefront({
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
}: TechStorefrontProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [quickVariantMap, setQuickVariantMap] = useState<Record<string, string>>({});
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Filter products by tech category
  const filteredProducts = products.filter((p) => {
    if (selectedCategory === "audio") {
      return p.title.toLowerCase().includes("headphone") || p.title.toLowerCase().includes("audio") || p.title.toLowerCase().includes("anc");
    }
    if (selectedCategory === "keyboards") {
      return p.title.toLowerCase().includes("keyboard") || p.title.toLowerCase().includes("cnc") || p.title.toLowerCase().includes("tactile");
    }
    if (selectedCategory === "power") {
      return p.title.toLowerCase().includes("charger") || p.title.toLowerCase().includes("gan") || p.title.toLowerCase().includes("cable");
    }
    return true;
  });

  const handleQuickVariantSelect = (productId: string, variantTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickVariantMap((prev) => ({ ...prev, [productId]: variantTitle }));
  };

  const handleCardQuickAdd = (p: typeof products[0], e: React.MouseEvent) => {
    e.stopPropagation();
    const chosenVar = quickVariantMap[p.id];
    let matchedVariant = p.variants[0];
    if (chosenVar && p.variants.length > 0) {
      const found = p.variants.find((v) => v.title.toLowerCase().includes(chosenVar.toLowerCase()));
      if (found) matchedVariant = found;
    }
    onAddToCart(p, matchedVariant);
  };

  const handleAddTechEnsemble = () => {
    const audio = products.find((p) => p.slug.includes("headphone") || p.slug.includes("audio")) || products[0];
    const kb = products.find((p) => p.slug.includes("keyboard")) || products[1] || products[0];
    const pwr = products.find((p) => p.slug.includes("charger") || p.slug.includes("gan")) || products[2] || products[0];

    if (audio) onAddToCart(audio, audio.variants[0]);
    if (kb) onAddToCart(kb, kb.variants[0]);
    if (pwr) onAddToCart(pwr, pwr.variants[0]);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#0c0d12] text-zinc-100 selection:bg-sky-500 selection:text-black">
      {/* ─── 1. Cyber Hardware Utility Bar ──────────────────────────────────── */}
      <div className="py-2.5 px-4 text-xs font-mono tracking-wide bg-black text-sky-400 border-b border-zinc-900">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="hidden sm:flex items-center space-x-2 text-[11px] text-zinc-400">
            <Cpu className="w-3.5 h-3.5 text-sky-400" />
            <span>Mil-Spec QC Calibrated • Factory Sealed Direct</span>
          </div>
          <div className="mx-auto sm:mx-0 flex items-center space-x-2 text-xs font-semibold text-zinc-200">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            <span>Doorstep Anti-Static Seal & Power-On Inspection (COD)</span>
          </div>
          <div className="hidden md:flex items-center space-x-3 text-[11px] text-zinc-400 font-mono">
            <span>2-Year Advance Replacement Swap</span>
          </div>
        </div>
      </div>

      {/* ─── 2. Clean Precision Hardware Brand Header ───────────────────────── */}
      <header className="sticky top-0 z-30 bg-[#0c0d12]/90 backdrop-blur-md border-b border-zinc-800/80 text-zinc-100 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-6">
          {/* Brand Logo & Telemetry Tag */}
          <Link href={`/store/${tenantSlug}`} className="flex items-center space-x-3 flex-shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-blue-700 text-black flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
              <Cpu className="w-5 h-5 text-black" />
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-base block leading-none font-mono text-white">
                {storeDisplayName}
              </span>
              <span className="text-[10px] text-sky-400 font-semibold block mt-1 tracking-wider uppercase font-mono">
                Precision Hardware Telemetry
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs font-mono font-semibold text-zinc-400">
            <a href="#hardware" className="hover:text-sky-400 transition">Hardware Catalog</a>
            <a href="#categories" className="hover:text-sky-400 transition">Categories</a>
            <a href="#benchmarks" className="hover:text-sky-400 transition">Telemetry Specs</a>
            <a href="#ensemble" className="hover:text-sky-400 transition">Desk Ensemble</a>
            <a href="#protocol" className="hover:text-sky-400 transition">Doorstep Seal Check</a>
          </nav>

          {/* Search Trigger */}
          <div
            onClick={onOpenSearch}
            className="flex-1 max-w-xs hidden md:flex items-center space-x-2 px-3.5 py-2 bg-[#13151f] border border-zinc-800 rounded-xl text-xs text-zinc-400 cursor-pointer hover:border-sky-500/50 hover:text-zinc-200 transition shadow-2xs font-mono"
          >
            <Search className="w-3.5 h-3.5 text-sky-400" />
            <span className="truncate">Search beryllium, GaN, CNC...</span>
            <kbd className="ml-auto text-[9px] font-mono bg-zinc-900 text-sky-400 px-1.5 py-0.5 rounded border border-zinc-700">
              /
            </kbd>
          </div>

          {/* Action Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenSearch}
              className="md:hidden p-2.5 rounded-xl hover:bg-zinc-800 text-zinc-400 transition"
              aria-label="Search catalog"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-mono font-bold transition flex items-center space-x-2 shadow-xs group"
              aria-label="View shopping bag"
            >
              <ShoppingBag className="w-4 h-4 text-black group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold hidden sm:inline-block">Bag</span>
              {cartItems.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white text-black rounded-full text-[10px] font-black flex items-center justify-center shadow-xs">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ─── 3. Cybernetic Pro Hero Section ─────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-zinc-800/80 bg-gradient-to-b from-[#0c0d12] via-[#10131d] to-[#0c0d12] py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-sky-950/70 border border-sky-800/60 rounded-full text-[11px] font-semibold text-sky-400 font-mono">
              <Zap className="w-3.5 h-3.5 text-sky-400" />
              <span>Mil-Spec QC Calibrated • Zero Gray Market Units</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08] font-mono">
              CNC Billet Aluminum. <br />
              <span className="bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Acoustic Precision.
              </span> <br />
              Zero Latency.
            </h1>

            <p className="text-sm sm:text-base text-zinc-400 max-w-xl leading-relaxed">
              Milled from 6063 aerospace aluminum with custom 40mm beryllium acoustic diaphragms and 100W GaN power delivery. Inspect factory anti-static seals and verify serial numbers at your door prior to cash handover.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#hardware"
                className="py-3 px-6 bg-sky-500 hover:bg-sky-400 text-black font-bold text-xs font-mono rounded-xl shadow-xs transition flex items-center space-x-2"
              >
                <span>Explore Hardware Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              <a
                href="#benchmarks"
                className="py-3 px-5 bg-[#171926] border border-zinc-700/80 hover:bg-[#1f2233] text-zinc-200 font-semibold text-xs font-mono rounded-xl shadow-xs transition flex items-center space-x-2"
              >
                <Activity className="w-3.5 h-3.5 text-sky-400" />
                <span>View Telemetry Specs</span>
              </a>
            </div>

            {/* Micro Trust Indicators */}
            <div className="pt-6 border-t border-zinc-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-zinc-400 font-mono">
              <div className="flex items-center space-x-2 text-xs">
                <CheckCircle2 className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span className="font-medium text-[11px]">Factory Sealed</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <ShieldCheck className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span className="font-medium text-[11px]">Mil-Spec Calibrated</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <Truck className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span className="font-medium text-[11px]">Power-On Test (COD)</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <RotateCcw className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span className="font-medium text-[11px]">2-Year Swap Warranty</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-3xl overflow-hidden border border-zinc-800 bg-[#13151f] shadow-2xl p-2.5">
              <div className="aspect-[16/10] rounded-2xl overflow-hidden relative group">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop&q=85"
                  alt="Acoustic Pro ANC Wireless Headphones"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md p-3.5 rounded-xl border border-zinc-700 shadow-lg text-white">
                  <div className="flex items-center justify-between font-mono">
                    <div>
                      <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">Flagship Audio</span>
                      <p className="text-xs font-bold">Acoustic Pro Hybrid ANC</p>
                    </div>
                    <span className="text-xs font-bold text-sky-400">$169.00</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-1 font-mono">40mm Beryllium • 45h ANC • aptX Lossless</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. Hardware Peripherals Navigation Filter ───────────────────────── */}
      <section id="categories" className="py-10 px-4 sm:px-6 border-b border-zinc-800/80 bg-[#10121a]">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 font-mono">
            <div>
              <span className="text-[10px] tracking-widest text-sky-400 font-bold uppercase">
                Hardware Architecture
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Curated Telemetry Peripherals
              </h2>
            </div>
            <p className="text-xs text-zinc-400 max-w-sm">
              Each peripheral is subjected to thermal dissipation stress testing and RF antenna spectrum calibration.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {TECH_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all font-mono ${
                    isActive
                      ? "bg-sky-950/80 border-sky-500 text-white shadow-xs"
                      : "bg-[#13151f] border-zinc-800 hover:border-zinc-700 text-zinc-300"
                  }`}
                >
                  <p className={`text-xs font-bold ${isActive ? "text-sky-300" : "text-white"}`}>
                    {cat.label}
                  </p>
                  <p className={`text-[10px] mt-1 leading-snug ${isActive ? "text-zinc-300" : "text-zinc-400"}`}>
                    {cat.subtitle}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 5. Exploded Telemetry Architecture & Benchmarks ─────────────────── */}
      <section id="benchmarks" className="py-16 px-4 sm:px-6 border-b border-zinc-800/80 bg-[#0c0d12]">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="max-w-2xl space-y-2 font-mono">
            <span className="text-[10px] tracking-widest text-sky-400 font-bold uppercase">
              Lab Calibrated Telemetry
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Hardware Architecture & Tolerance Specs
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              We publish raw acoustic frequency response, harmonic distortion graphs, and thermal efficiency ratings for every device.
            </p>
          </div>

          <div className="space-y-3 font-mono">
            {HARDWARE_BENCHMARKS.map((item, i) => (
              <div
                key={i}
                className="bg-[#13151f] rounded-2xl p-5 border border-zinc-800 grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
              >
                <div className="md:col-span-3">
                  <span className="text-xs font-bold text-white block">{item.component}</span>
                  <span className="text-[10px] text-sky-400 font-bold">Mil-Spec Certified</span>
                </div>

                <div className="md:col-span-4 bg-black/60 p-3 rounded-xl border border-zinc-800">
                  <span className="text-[9px] uppercase tracking-wider text-sky-400 font-bold block mb-0.5">
                    Hardware Specification:
                  </span>
                  <p className="text-xs font-bold text-zinc-100">{item.spec}</p>
                </div>

                <div className="md:col-span-2 bg-sky-950/40 p-3 rounded-xl border border-sky-800/40 text-center">
                  <span className="text-[9px] uppercase tracking-wider text-sky-400 font-bold block mb-0.5">
                    Tested Metric:
                  </span>
                  <p className="text-xs font-bold text-sky-300">{item.metric}</p>
                </div>

                <div className="md:col-span-3 text-right">
                  <span className="text-[10px] text-zinc-400 leading-snug block">
                    {item.advantage}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6. The Precision Desk Telemetry Ensemble (1-Click Upsell) ───────── */}
      <section id="ensemble" className="py-16 px-4 sm:px-6 border-b border-zinc-800/80 bg-gradient-to-r from-sky-950/20 via-[#10131d] to-black">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#13151f] rounded-3xl border border-zinc-800 p-6 sm:p-10 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4 font-mono">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-sky-950/80 text-sky-400 rounded-full text-[10px] font-bold tracking-wider uppercase border border-sky-800">
                  <Zap className="w-3 h-3 text-sky-400" />
                  <span>Curated Workstation Bundle</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  The Precision Desk Telemetry Ensemble
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  The ultimate acoustic and tactile hardware bundle: Beryllium ANC Headphones, Gasket-Mounted CNC Mechanical Keyboard, and 100W GaN Fast Charger.
                </p>

                <div className="space-y-2 pt-2 text-xs">
                  <div className="flex items-center space-x-2.5 text-zinc-200 font-medium">
                    <span className="w-5 h-5 rounded-full bg-sky-500 text-black font-mono text-[10px] font-bold flex items-center justify-center">1</span>
                    <span>Acoustic Pro Hybrid ANC Wireless Headphones ($169.00)</span>
                  </div>
                  <div className="flex items-center space-x-2.5 text-zinc-200 font-medium">
                    <span className="w-5 h-5 rounded-full bg-sky-500 text-black font-mono text-[10px] font-bold flex items-center justify-center">2</span>
                    <span>Tactile CNC Gasket Mechanical Keyboard ($138.00)</span>
                  </div>
                  <div className="flex items-center space-x-2.5 text-zinc-200 font-medium">
                    <span className="w-5 h-5 rounded-full bg-sky-500 text-black font-mono text-[10px] font-bold flex items-center justify-center">3</span>
                    <span>Braided 100W GaN Charging Hub & Cable ($49.00)</span>
                  </div>
                </div>

                <div className="pt-4 flex items-baseline space-x-3">
                  <span className="text-2xl font-black text-sky-400 font-mono">$310.00</span>
                  <span className="text-sm text-zinc-500 line-through font-mono">$356.00</span>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
                    Save $46.00 (13% Off)
                  </span>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleAddTechEnsemble}
                    className="w-full sm:w-auto py-3 px-8 bg-sky-500 hover:bg-sky-400 text-black font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center space-x-2 btn-press"
                  >
                    <ShoppingBag className="w-4 h-4 text-black" />
                    <span>Add Complete Telemetry Ensemble to Bag</span>
                  </button>
                  <p className="text-[11px] text-zinc-500 mt-2 font-sans">
                    Anti-static sealed cartons with 2-year advance replacement swap guarantee.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-3 gap-3 font-mono">
                {[
                  {
                    step: "AUDIO 01",
                    title: "Acoustic Pro ANC",
                    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
                    detail: "40mm Beryllium • 45h"
                  },
                  {
                    step: "INPUT 02",
                    title: "CNC Keyboard",
                    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80",
                    detail: "6063 Aluminum • Hotswap"
                  },
                  {
                    step: "POWER 03",
                    title: "100W GaN Hub",
                    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80",
                    detail: "GaN III • Braided"
                  }
                ].map((item, idx) => (
                  <div key={idx} className="bg-black/60 rounded-2xl p-2.5 border border-zinc-800 flex flex-col justify-between">
                    <div className="aspect-[16/10] rounded-xl overflow-hidden bg-zinc-900 mb-2 border border-zinc-800">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-sky-400 block">{item.step}</span>
                      <p className="text-xs font-bold text-white leading-tight mt-0.5">{item.title}</p>
                      <span className="text-[10px] text-zinc-400 block mt-1">{item.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. Main Hardware Product Catalog Grid (16:10 Ratio) ────────────── */}
      <section id="hardware" className="py-16 px-4 sm:px-6 max-w-6xl mx-auto w-full flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-zinc-800 gap-4 font-mono">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-[10px] uppercase tracking-widest text-sky-400 font-bold mb-1">
              <span>Factory Sealed Silicon</span>
              <span>•</span>
              <span>2-Year Advance Swap</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Hardware Telemetry Inventory
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Showing {filteredProducts.length} serialized and calibrated workstation peripherals
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-zinc-500 text-[11px]">Filtered Range:</span>
            <span className="font-bold text-sky-300 bg-sky-950/80 px-3 py-1 rounded-full border border-sky-800 capitalize">
              {selectedCategory === "all" ? "All Telemetry" : selectedCategory}
            </span>
          </div>
        </div>

        {/* Disciplined 16:10 Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
          {filteredProducts.map((p) => {
            const isHovered = hoveredCardId === p.id;
            const chosenVar = quickVariantMap[p.id] || (p.variants[0]?.title || "Default");
            const isSaved = wishlist.includes(p.id);

            return (
              <div
                key={p.id}
                onMouseEnter={() => setHoveredCardId(p.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                onClick={() => onOpenProduct(p)}
                className="group bg-[#13151f] rounded-2xl border border-zinc-800 hover:border-sky-500/50 transition-all duration-300 p-3.5 flex flex-col justify-between shadow-2xs hover:shadow-sky-950/30 hover:shadow-lg cursor-pointer"
              >
                {/* 16:10 Widescreen Frame */}
                <div>
                  <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-black/60 border border-zinc-800 mb-3.5">
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
                        alt={`${p.title} Exploded View`}
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
                          isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95"
                        }`}
                      />
                    )}

                    {/* Pro Telemetry Badge */}
                    <div className="absolute top-2.5 left-2.5 z-10">
                      <span className="px-2.5 py-1 bg-black/90 backdrop-blur-md rounded-full text-[10px] font-bold text-sky-400 border border-sky-800/60 shadow-2xs uppercase tracking-wider font-mono">
                        {p.badge || "Mil-Spec"}
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
                          ? "bg-sky-500 text-black shadow-xs"
                          : "bg-black/80 text-zinc-400 hover:bg-black hover:text-sky-400 shadow-2xs"
                      }`}
                      aria-label="Save to favorites"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
                    </button>

                    {/* Anti-Static Seal Badge */}
                    <div className="absolute bottom-2.5 left-2.5 z-10">
                      <span className="px-2 py-0.5 bg-sky-950/90 text-sky-300 rounded text-[9px] font-mono tracking-wide border border-sky-800/50">
                        Anti-Static Sealed
                      </span>
                    </div>
                  </div>

                  {/* Quick Variant Selector Pills */}
                  {p.variants.length > 0 && (
                    <div className="mb-3 space-y-1.5" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-zinc-500">Config:</span>
                        <span className="text-sky-400 font-bold">{chosenVar}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 font-mono">
                        {p.variants.map((v, vIdx) => {
                          const val = v.title;
                          const isSel = chosenVar.toLowerCase() === val.toLowerCase();
                          return (
                            <button
                              key={vIdx}
                              onClick={(e) => handleQuickVariantSelect(p.id, val, e)}
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition ${
                                isSel
                                  ? "bg-sky-500 text-black border-sky-500"
                                  : "bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border-zinc-800"
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
                    <span className="text-[10px] text-zinc-500">(48 verified)</span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-sm font-bold text-white group-hover:text-sky-400 transition leading-snug font-mono">
                    {p.title}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed font-sans">
                    {p.description}
                  </p>
                </div>

                {/* Price & Add to Bag */}
                <div className="pt-4 mt-3 border-t border-zinc-800 flex items-center justify-between font-mono">
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
                    className="py-2 px-3.5 bg-sky-500 hover:bg-sky-400 text-black font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-1.5 btn-press"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-black" />
                    <span>Add to Bag</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── 8. Doorstep Anti-Static Seal & Power-On Protocol ───────────────── */}
      <section id="protocol" className="py-16 px-4 sm:px-6 border-b border-zinc-800/80 bg-[#10121a]">
        <div className="max-w-6xl mx-auto space-y-8 font-mono">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-sky-950/80 text-sky-400 rounded-full text-[10px] font-bold tracking-wider uppercase border border-sky-800">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>Doorstep Anti-Static Inspection Protocol</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              The 3-Step Hardware Handover Verification
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              High-spec hardware deserves complete peace of mind. You have the right to inspect outer anti-static tamper packaging and verify serial codes before payment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Inspect Holographic Anti-Static Seal",
                desc: "Check the tamper-evident holographic seal across the outer carton box with the courier driver prior to cash handover.",
                highlight: "Zero Advance Payment"
              },
              {
                step: "02",
                title: "Match Laser-Etched Serial Code",
                desc: "Verify that the chassis serial code etched onto the billet aluminum matches your digital delivery manifest.",
                highlight: "Authenticity Guaranteed"
              },
              {
                step: "03",
                title: "2-Year Advance Replacement Swap",
                desc: "If any hardware flaw or connectivity anomaly appears, we dispatch an advance swap unit within 24 hours.",
                highlight: "Zero Downtime Guarantee"
              }
            ].map((card) => (
              <div key={card.step} className="bg-[#13151f] rounded-2xl p-6 border border-zinc-800 shadow-xs space-y-3">
                <span className="text-2xl font-black text-sky-400 block">{card.step}</span>
                <h3 className="text-sm font-bold text-white">{card.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">{card.desc}</p>
                <div className="pt-2 border-t border-zinc-800 text-[10px] font-bold text-sky-400">
                  {card.highlight}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 9. Operator Telemetry Benchmarks & Reviews ─────────────────────── */}
      <section className="py-16 px-4 sm:px-6 border-b border-zinc-800/80 bg-[#0c0d12]">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2 font-mono">
            <span className="text-[10px] tracking-widest text-sky-400 font-bold uppercase">
              Field Telemetry Reports
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Verified Operator Benchmark Logs
            </h2>
            <p className="text-xs text-zinc-400">
              Field feedback from studio audio engineers, software developers, and gamers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
            {[
              {
                author: "Alex V.",
                role: "Audio Mastering Engineer",
                device: "Acoustic Pro ANC Headphones",
                comment: "The beryllium drivers produce a shockingly flat response curve. The high-frequency extension above 15kHz has zero sibilance. Inspecting the anti-static seal with the driver gave me 100% confidence.",
                rating: 5
              },
              {
                author: "Devin K.",
                role: "Senior Systems Architect",
                device: "Tactile CNC Gasket Keyboard",
                comment: "The gasket dampening completely absorbs harsh bottom-out vibrations. The CNC milled 6063 aluminum chassis weighs nearly 4 lbs and doesn't budge an inch during intense typing sessions.",
                rating: 5
              },
              {
                author: "Jordan T.",
                role: "Hardware Overclocker",
                device: "100W GaN Charging Station",
                comment: "The GaN III silicon runs surprisingly cool even under sustained 95W load charging my MacBook Pro and iPad simultaneously. The braided silicone cable doesn't tangle.",
                rating: 5
              }
            ].map((rev, i) => (
              <div key={i} className="bg-[#13151f] rounded-2xl p-6 border border-zinc-800 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-400 space-x-0.5">
                      {[...Array(rev.rating)].map((_, idx) => (
                        <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800">
                      Verified Operator
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed font-sans italic">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-800 text-[11px]">
                  <p className="font-bold text-white">{rev.author}</p>
                  <p className="text-sky-400 text-[10px]">{rev.role}</p>
                  <p className="text-zinc-500 text-[10px]">{rev.device}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 10. Operator Circle VIP Newsletter ─────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 bg-[#10121a] border-b border-zinc-800/80 font-mono">
        <div className="max-w-xl mx-auto text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-950/80 border border-sky-800 text-sky-400 flex items-center justify-center mx-auto">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="text-2xl font-black tracking-tight text-white">
            Join The {storeDisplayName} Operator Circle
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            Receive $20 off your first hardware order, early firmware beta access, and advance notification of limited anodized batch drops.
          </p>

          {newsletterSubscribed ? (
            <div className="p-4 bg-sky-950/80 border border-sky-800 rounded-2xl text-xs text-sky-200 font-semibold space-y-1">
              <div className="flex items-center justify-center space-x-1.5 text-sky-400">
                <Check className="w-4 h-4" />
                <span>Welcome to the Operator Circle!</span>
              </div>
              <p className="text-[11px] text-zinc-400 font-normal">
                Use code <strong className="text-sky-400 font-bold">OPERATOR20</strong> for $20 off at checkout.
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
                placeholder="operator@domain.com"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                className="flex-1 px-4 py-2.5 bg-black border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-600 outline-none focus:border-sky-500 shadow-2xs"
              />
              <button
                type="submit"
                className="py-2.5 px-5 bg-sky-500 hover:bg-sky-400 text-black font-bold text-xs rounded-xl shadow-xs transition btn-press"
              >
                Claim $20
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ─── 11. Floating Demo Studio Pill ──────────────────────────────────── */}
      <div className="fixed bottom-5 right-5 z-40">
        {isThemeMenuOpen ? (
          <div className="bg-[#13151f]/95 backdrop-blur-md rounded-2xl shadow-2xl border border-zinc-800 p-4 w-72 text-zinc-100 space-y-3 font-mono">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                <span className="text-xs font-bold">Demo Studio</span>
              </div>
              <button
                onClick={() => setIsThemeMenuOpen(false)}
                className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">
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
                        ? "bg-sky-500 text-black font-bold"
                        : "bg-zinc-900 hover:bg-zinc-800 text-zinc-300"
                    }`}
                  >
                    {categoriesMap[cKey]?.name || cKey}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-zinc-800">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">
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
                        ? "bg-sky-500 text-black font-bold"
                        : "bg-zinc-900 hover:bg-zinc-800 text-zinc-300"
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
            className="bg-black/90 hover:bg-zinc-950 text-white backdrop-blur-md px-4 py-2.5 rounded-full text-xs font-semibold shadow-2xl border border-zinc-800 flex items-center space-x-2 transition hover:scale-105 font-mono"
            title="Switch template style or department"
          >
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            <span>Theme: <strong>{template.name.split(" ")[0]}</strong></span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </button>
        )}
      </div>

      {/* ─── 12. Tech Cyber Tailored Store Footer ───────────────────────────── */}
      <footer className="py-12 px-4 sm:px-6 bg-black text-zinc-400 border-t border-zinc-900 text-xs font-mono">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <span className="font-black text-sm uppercase tracking-wider text-white">
              {storeDisplayName}
            </span>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Precision hardware peripherals, milled from 6063 aerospace aluminum with mil-spec calibrated tolerances.
            </p>
            <p className="text-[11px] text-zinc-600">
              © 2026 {storeDisplayName}. All rights reserved.
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-xs uppercase tracking-wider text-white block">
              Hardware Series
            </span>
            <ul className="space-y-1.5 text-zinc-400">
              <li><a href="#hardware" className="hover:text-white transition">Acoustic Pro Headphones</a></li>
              <li><a href="#hardware" className="hover:text-white transition">CNC Gasket Keyboards</a></li>
              <li><a href="#hardware" className="hover:text-white transition">100W GaN Charging Stations</a></li>
              <li><a href="#ensemble" className="hover:text-white transition">Workstation Bundles</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-xs uppercase tracking-wider text-white block">
              Operator Services
            </span>
            <ul className="space-y-1.5 text-zinc-400">
              <li><span>Doorstep Cash on Delivery</span></li>
              <li><span>Anti-Static Tape Verification</span></li>
              <li><span>2-Year Advance Replacement Swap</span></li>
              <li><span>Firmware Flash Downloads</span></li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-xs uppercase tracking-wider text-white block">
              Quality & Warranty
            </span>
            <p className="text-zinc-400 leading-relaxed font-sans">
              Nationwide cash on delivery. Inspect carton tamper seals and match chassis serial numbers prior to tender.
            </p>
            <div className="inline-flex items-center space-x-1.5 text-sky-400 text-[11px] pt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Doorstep Inspection Protocol</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
