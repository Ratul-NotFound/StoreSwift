"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  ExternalLink,
  Layers,
  Menu,
  ShieldCheck,
  Store,
  Truck,
  X,
  Zap,
  Lock,
  Globe,
  CheckCircle2,
  Package,
  Barcode,
  Smartphone,
  CreditCard,
  SlidersHorizontal,
  FileText,
  AlertTriangle,
  RotateCcw,
  Sparkles
} from "lucide-react";
import { PlatformFooter, DEMO_STORES_LIST } from "@/components/platform-footer";

interface IndustryStorefront {
  slug: string;
  name: string;
  category: string;
  template: string;
  headline: string;
  description: string;
  image: string;
  highlights: string[];
  categoryParam: string;
}

const INDUSTRY_STOREFRONTS: IndustryStorefront[] = [
  {
    slug: "apex-fashion",
    name: "Apex Fashion Hub",
    category: "Fashion & Apparel",
    template: "Minimal Atelier",
    headline: "Textile-focused apparel architecture with editorial lookbooks",
    description: "Designed for fashion labels with fabric weight badges (GSM), studio and on-model angle switchers, and lookbook ensemble bundles.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=85",
    highlights: ["Textile GSM weight badges", "Studio angle switcher", "Curated outfits lookbook", "Doorstep fit inspection guarantee"],
    categoryParam: "fashion"
  },
  {
    slug: "luxe-glow-beauty",
    name: "Luxe Glow Beauty",
    category: "Beauty & Skincare",
    template: "Clinical Botanical",
    headline: "Clinical formulations with ingredient bio-active percentages",
    description: "Tailored for skincare and beauty brands with a 3-step routine builder, skin-type concern filters, and tamper seal inspection protocols.",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&auto=format&fit=crop&q=85",
    highlights: ["Active ingredient % badges", "3-Step glass skin ritual", "Tamper seal inspection protocol", "Skin concern filter"],
    categoryParam: "beauty_cosmetics"
  },
  {
    slug: "craft-shoes",
    name: "Craft Bench Shoes",
    category: "Footwear & Leather",
    template: "Warm Heritage",
    headline: "Heritage leathercraft, welted construction and outsole specs",
    description: "Crafted for footwear and leather goods makers with anatomical cutaway visuals, tannery provenance, and Vibram lug depth specs.",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&auto=format&fit=crop&q=85",
    highlights: ["Anatomical sole cutaway", "Leather tannery provenance", "Heel-to-toe drop specs", "Doorstep fitting check"],
    categoryParam: "shoes"
  },
  {
    slug: "cyber-tech",
    name: "CyberTech Audio",
    category: "Consumer Tech & Audio",
    template: "Acoustic Cyber",
    headline: "Frequency curves, titanium driver specs and hardware telemetry",
    description: "Optimized for consumer electronics and audio gear with acoustic frequency visualizers, IPX7 ratings, and low-latency gaming mode.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=85",
    highlights: ["Frequency curve visualizer", "Low-latency gaming mode", "IPX7 waterproof ratings", "Anti-tamper seal protocol"],
    categoryParam: "electronics"
  },
  {
    slug: "maison-jewelry",
    name: "Maison Opulente",
    category: "Fine Jewelry & Watches",
    template: "Opulent Maison",
    headline: "Hallmarked 18K/24K gold, certified diamonds and unboxing seals",
    description: "Designed for fine jewelry and luxury watches with 40x loupe inspection guarantee, GIA clarity certifications, and velvet unboxing.",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200&auto=format&fit=crop&q=85",
    highlights: ["Gold purity hallmarks (750)", "GIA clarity certifications", "Velvet unboxing guarantee", "Insured doorstep handover"],
    categoryParam: "jewelry"
  },
  {
    slug: "artisan-food",
    name: "Artisan Pantry",
    category: "Gourmet Food & Coffee",
    template: "Artisan Pantry",
    headline: "Single-origin micro-lots, roast freshness dates and brew guides",
    description: "Purpose-built for specialty coffee, raw honey, and gourmet provisions with harvest altitude metrics, roast freshness tracking, and brew guides.",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1200&auto=format&fit=crop&q=85",
    highlights: ["48h roast date freshness", "Harvest altitude (MASL)", "Brew ratio extraction guides", "Aroma seal guarantee"],
    categoryParam: "grocery_food"
  }
];

export default function PlatformLandingPage() {
  const [selectedStoreSlug, setSelectedStoreSlug] = useState("apex-fashion");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isNavDropdownOpen, setIsNavDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [heroActiveTab, setHeroActiveTab] = useState<"storefront" | "checkout" | "courier" | "fraud">("storefront");
  const [checkoutZone, setCheckoutZone] = useState<"dhaka" | "nationwide">("dhaka");
  const [checkoutPayment, setCheckoutPayment] = useState<"cod" | "bkash" | "nagad">("cod");

  const activeStore = INDUSTRY_STOREFRONTS.find((s) => s.slug === selectedStoreSlug) || INDUSTRY_STOREFRONTS[0];

  const faqs = [
    {
      q: "How does StoreSwift compare to traditional platforms like Shopify or WooCommerce?",
      a: "StoreSwift is purpose-built for high-conversion commerce in South Asia and global direct-to-consumer markets. Unlike generic builders requiring dozens of third-party plugins and expensive monthly subscriptions, StoreSwift natively includes 20-second 1-page checkout, automated courier dispatch with Steadfast and Pathao, printable 4x6 thermal barcode labels, and an Anti-Fraud RTO Shield out of the box."
    },
    {
      q: "Can I accept Cash on Delivery (COD), bKash, and Nagad?",
      a: "Yes. Cash on Delivery is enabled by default with an Open Parcel Doorstep Inspection guarantee. You can also accept instant payments via bKash Express, Nagad Direct, and credit/debit cards with automated transaction tracking and zero platform commission."
    },
    {
      q: "How does automated courier dispatch work with Steadfast and Pathao?",
      a: "When a customer places an order, you can approve and book the consignment with a single click in your Merchant Admin. StoreSwift automatically generates a live tracking consignment ID and formats a printable 4x6 thermal shipping sticker with barcode, ready for pickup by Steadfast or Pathao riders."
    },
    {
      q: "How does the Anti-Fraud RTO Risk Shield protect my business?",
      a: "In social and direct commerce, uncollected Cash on Delivery orders cause costly return courier penalties. StoreSwift's RTO Shield analyzes buyer phone numbers against nationwide delivery records, flagging high-risk serial returners so you can collect an advance delivery fee before dispatch."
    },
    {
      q: "Can I connect my own custom domain (e.g. mystore.com)?",
      a: "Every store immediately receives a free subdomain (yourbrand.storeswift.app). You can connect your own custom domain with automated SSL encryption on our Growth and Pro plans with zero configuration."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] font-sans selection:bg-zinc-900 selection:text-white antialiased">
      {/* ─── 1. Platform Navigation Bar ─────────────────────────────────────── */}
      <header className="border-b border-zinc-200/60 bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center space-x-2.5 group flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-zinc-950 flex items-center justify-center text-white shadow-bevel-dark group-hover:scale-105 transition-transform">
              <Store className="w-4 h-4" />
            </div>
            <span className="text-base font-bold tracking-tight text-zinc-950">
              Store<span className="text-blue-600">Swift</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8 text-xs font-semibold text-zinc-600">
            <div className="relative">
              <button
                onClick={() => setIsNavDropdownOpen(!isNavDropdownOpen)}
                className="hover:text-zinc-950 transition flex items-center space-x-1.5 py-1"
              >
                <span>Live Storefronts</span>
                <span className="text-[10px] bg-zinc-100 text-zinc-700 px-1.5 py-0.5 rounded font-bold">6</span>
                <ChevronDown className="w-3 h-3 text-zinc-400" />
              </button>

              {isNavDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNavDropdownOpen(false)} />
                  <div className="absolute left-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-luxury-card border border-zinc-200/80 z-50 py-2 divide-y divide-zinc-100 text-xs animate-fade-in">
                    <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                      Explore 6 Live Stores
                    </div>
                    <div className="py-1">
                      {DEMO_STORES_LIST.map((s) => (
                        <Link
                          key={s.slug}
                          href={`/store/${s.slug}`}
                          onClick={() => setIsNavDropdownOpen(false)}
                          className="flex items-center justify-between px-3 py-2 hover:bg-zinc-50 transition group"
                        >
                          <div>
                            <p className="font-bold text-zinc-900 group-hover:text-blue-600 transition">{s.name}</p>
                            <p className="text-[10px] text-zinc-400">{s.category}</p>
                          </div>
                          <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-blue-600 transition" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            <a href="#storefronts" className="hover:text-zinc-950 transition">Storefronts</a>
            <a href="#features" className="hover:text-zinc-950 transition">Engines</a>
            <a href="#pricing" className="hover:text-zinc-950 transition">Pricing</a>
            <a href="#faq" className="hover:text-zinc-950 transition">FAQ</a>
          </nav>

          {/* Action Buttons & Mobile Hamburger */}
          <div className="flex items-center space-x-2.5 flex-shrink-0">
            <Link
              href="/admin?store=apex-fashion"
              className="text-xs font-semibold text-zinc-700 hover:text-zinc-950 px-3.5 py-2 rounded-xl bg-white/90 hover:bg-white border border-zinc-200/80 shadow-bevel-light transition hidden sm:inline-flex items-center space-x-1.5"
            >
              <span>Merchant Admin</span>
              <ExternalLink className="w-3 h-3 text-zinc-400" />
            </Link>
            <Link
              href="/onboarding"
              className="inline-flex items-center space-x-1.5 text-xs font-bold bg-zinc-950 hover:bg-zinc-850 text-white px-4 py-2 rounded-xl shadow-bevel-dark transition btn-press"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-100 transition shadow-bevel-light"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-zinc-200 bg-white/95 backdrop-blur-xl px-4 py-4 space-y-4 animate-fade-in shadow-xl">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block px-2">
                Explore 6 Live Stores
              </span>
              <div className="grid grid-cols-2 gap-2 pt-1">
                {DEMO_STORES_LIST.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/store/${s.slug}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100 hover:bg-zinc-100 transition text-xs"
                  >
                    <p className="font-bold text-zinc-900">{s.name.split(" ")[0]} Store</p>
                    <p className="text-[10px] text-zinc-400">{s.category.split("&")[0].trim()}</p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t border-zinc-100 pt-3 space-y-2 text-xs font-semibold text-zinc-700">
              <a
                href="#storefronts"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-2 py-1.5 rounded-lg hover:bg-zinc-50"
              >
                Storefronts
              </a>
              <a
                href="#features"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-2 py-1.5 rounded-lg hover:bg-zinc-50"
              >
                Capabilities
              </a>
              <a
                href="#pricing"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-2 py-1.5 rounded-lg hover:bg-zinc-50"
              >
                Pricing Plans
              </a>
              <a
                href="#faq"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-2 py-1.5 rounded-lg hover:bg-zinc-50"
              >
                FAQ
              </a>
              <Link
                href="/admin?store=apex-fashion"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-zinc-50 text-blue-600 font-bold"
              >
                <span>Open Merchant Admin Demo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ─── 2. Hero Section (World-Class SaaS Presentation) ─────────────────── */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32 border-b border-zinc-200/80">
        {/* Subtle Ambient Radial Lighting & Micro-Grid */}
        <div className="absolute inset-0 bg-subtle-grid pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-gradient-to-b from-blue-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-7">
          {/* Status Pill Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-zinc-200/90 text-zinc-800 text-xs font-medium shadow-bevel-light">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
            <span>High-Conversion Commerce Operating System</span>
          </div>

          {/* Master Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-zinc-950 max-w-4xl mx-auto">
            The commerce operating system
            <span className="block font-normal text-zinc-400 mt-1">built for high-conversion brands.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-zinc-600 max-w-2xl mx-auto leading-relaxed">
            Eliminate checkout drop-off and courier chaos. StoreSwift pairs 20-second 1-page checkout with automated Steadfast & Pathao dispatch, native bKash & Nagad payments, and 6 bespoke vertical storefronts.
          </p>

          {/* Action Row */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/onboarding"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 text-xs font-bold bg-zinc-950 hover:bg-zinc-850 text-white px-6 py-3.5 rounded-xl shadow-bevel-dark transition btn-press group"
            >
              <span>Start 14-Day Free Trial</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="#storefronts"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 text-xs font-semibold bg-white/90 hover:bg-white border border-zinc-200/80 text-zinc-800 px-5 py-3.5 rounded-xl shadow-bevel-light transition"
            >
              <span>Explore 6 Live Stores</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </a>
          </div>

          {/* Trust Indicators Strip */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500 font-medium">
            <div className="flex items-center space-x-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>0% physical order fees</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Steadfast & Pathao 1-click sync</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Anti-Fraud RTO Shield included</span>
            </div>
          </div>

          {/* ─── Hero Centerpiece: Interactive Platform Cockpit Showcase ─────── */}
          <div className="pt-8 max-w-4xl mx-auto">
            <div className="rounded-2xl lg:rounded-3xl border border-zinc-200/90 bg-white shadow-luxury-card overflow-hidden">
              {/* macOS Window Header */}
              <div className="bg-zinc-100/90 border-b border-zinc-200/80 px-4 py-3 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block border border-black/10" />
                  <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block border border-black/10" />
                  <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block border border-black/10" />
                </div>

                {/* Interactive Simulator Tab Bar */}
                <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-zinc-200/80 text-[11px] font-semibold text-zinc-600 shadow-xs">
                  <button
                    onClick={() => setHeroActiveTab("storefront")}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      heroActiveTab === "storefront"
                        ? "bg-zinc-950 text-white shadow-xs"
                        : "hover:text-zinc-950 text-zinc-600"
                    }`}
                  >
                    Storefront
                  </button>
                  <button
                    onClick={() => setHeroActiveTab("checkout")}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      heroActiveTab === "checkout"
                        ? "bg-zinc-950 text-white shadow-xs"
                        : "hover:text-zinc-950 text-zinc-600"
                    }`}
                  >
                    1-Page Checkout
                  </button>
                  <button
                    onClick={() => setHeroActiveTab("courier")}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      heroActiveTab === "courier"
                        ? "bg-zinc-950 text-white shadow-xs"
                        : "hover:text-zinc-950 text-zinc-600"
                    }`}
                  >
                    Courier Sync
                  </button>
                  <button
                    onClick={() => setHeroActiveTab("fraud")}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      heroActiveTab === "fraud"
                        ? "bg-zinc-950 text-white shadow-xs"
                        : "hover:text-zinc-950 text-zinc-600"
                    }`}
                  >
                    Fraud Shield
                  </button>
                </div>

                <div className="hidden sm:flex items-center space-x-1.5 text-zinc-500 text-[11px] font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Production Ready</span>
                </div>
              </div>

              {/* Viewport Interactive Content */}
              <div className="p-6 bg-[#fafafa] text-left">
                {/* 1. STOREFRONT VIEW TAB */}
                {heroActiveTab === "storefront" && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-7 relative h-60 sm:h-72 rounded-2xl overflow-hidden group shadow-sm">
                      <img
                        src={activeStore.image}
                        alt={activeStore.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                      <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md text-zinc-950 text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                        {activeStore.template}
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-300 block">
                          {activeStore.category}
                        </span>
                        <p className="text-sm font-bold mt-0.5">{activeStore.name}</p>
                        <p className="text-xs text-zinc-300 mt-1 line-clamp-2 leading-relaxed">{activeStore.headline}</p>
                      </div>
                    </div>

                    <div className="md:col-span-5 space-y-3">
                      <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-bevel-light space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-zinc-950">Active Store Architecture</span>
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                            Pre-Seeded
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 leading-relaxed">
                          Includes curated sample catalog, localized pricing (৳ BDT & $ USD), and verified category lookbook.
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        {activeStore.highlights.slice(0, 3).map((item, i) => (
                          <div key={i} className="flex items-center space-x-2 text-xs text-zinc-700 bg-white p-2.5 rounded-xl border border-zinc-200/60 shadow-xs">
                            <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                              <Check className="w-3 h-3 text-emerald-600" />
                            </div>
                            <span className="font-medium">{item}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 flex gap-2">
                        <Link
                          href={`/store/${activeStore.slug}`}
                          className="flex-1 py-2.5 px-3 bg-zinc-950 hover:bg-zinc-850 text-white font-bold text-xs rounded-xl transition text-center flex items-center justify-center space-x-1 shadow-bevel-dark"
                        >
                          <span>Open Live Store</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. 1-PAGE CHECKOUT VIEW TAB */}
                {heroActiveTab === "checkout" && (
                  <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-luxury-card space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                      <div>
                        <span className="text-xs font-bold text-zinc-950 block">Instant 1-Page Express Checkout Simulator</span>
                        <span className="text-[11px] text-zinc-500">20-second customer order capture without mandatory account creation</span>
                      </div>
                      <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full">
                        64-District Engine
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {/* Left: Input Simulator */}
                      <div className="space-y-2.5">
                        <div>
                          <label className="text-[11px] font-semibold text-zinc-700 block mb-1">Customer Full Name & Phone</label>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="p-2 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-700">Tariq Ahmed</div>
                            <div className="p-2 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-700 font-mono">01712-345678</div>
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-zinc-700 block mb-1">Select Delivery Zone (Auto-Tariff)</label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => setCheckoutZone("dhaka")}
                              className={`p-2.5 rounded-xl border text-left transition-all ${
                                checkoutZone === "dhaka"
                                  ? "border-zinc-950 bg-zinc-950 text-white shadow-xs"
                                  : "border-zinc-200 bg-zinc-50 text-zinc-700"
                              }`}
                            >
                              <div className="font-bold">Inside Dhaka</div>
                              <div className="text-[10px] opacity-80">৳60 • 24h Express</div>
                            </button>
                            <button
                              type="button"
                              onClick={() => setCheckoutZone("nationwide")}
                              className={`p-2.5 rounded-xl border text-left transition-all ${
                                checkoutZone === "nationwide"
                                  ? "border-zinc-950 bg-zinc-950 text-white shadow-xs"
                                  : "border-zinc-200 bg-zinc-50 text-zinc-700"
                              }`}
                            >
                              <div className="font-bold">Outside Dhaka</div>
                              <div className="text-[10px] opacity-80">৳130 • All 64 Districts</div>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Right: Payment Selector & Summary */}
                      <div className="space-y-2.5">
                        <label className="text-[11px] font-semibold text-zinc-700 block mb-1">1-Tap Payment Mode</label>
                        <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
                          <button
                            type="button"
                            onClick={() => setCheckoutPayment("cod")}
                            className={`p-2.5 rounded-xl border transition-all ${
                              checkoutPayment === "cod"
                                ? "border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-600"
                                : "border-zinc-200 bg-zinc-50 text-zinc-700"
                            }`}
                          >
                            <div>Doorstep COD</div>
                            <div className="text-[9px] text-emerald-600 font-normal">Inspection OK</div>
                          </button>
                          <button
                            type="button"
                            onClick={() => setCheckoutPayment("bkash")}
                            className={`p-2.5 rounded-xl border transition-all ${
                              checkoutPayment === "bkash"
                                ? "border-[#E2136E] bg-pink-50 text-pink-900 ring-1 ring-[#E2136E]"
                                : "border-zinc-200 bg-zinc-50 text-zinc-700"
                            }`}
                          >
                            <div>bKash Direct</div>
                            <div className="text-[9px] text-[#E2136E] font-normal">Instant MFS</div>
                          </button>
                          <button
                            type="button"
                            onClick={() => setCheckoutPayment("nagad")}
                            className={`p-2.5 rounded-xl border transition-all ${
                              checkoutPayment === "nagad"
                                ? "border-[#F7931E] bg-amber-50 text-amber-900 ring-1 ring-[#F7931E]"
                                : "border-zinc-200 bg-zinc-50 text-zinc-700"
                            }`}
                          >
                            <div>Nagad MFS</div>
                            <div className="text-[9px] text-[#F7931E] font-normal">0% Fee</div>
                          </button>
                        </div>

                        <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/80 space-y-1 text-xs">
                          <div className="flex justify-between text-zinc-500 text-[11px]">
                            <span>Product Subtotal</span>
                            <span className="font-mono">৳2,450</span>
                          </div>
                          <div className="flex justify-between text-zinc-500 text-[11px]">
                            <span>Delivery Fee</span>
                            <span className="font-mono">{checkoutZone === "dhaka" ? "৳60" : "৳130"}</span>
                          </div>
                          <div className="flex justify-between font-bold text-zinc-950 pt-1 border-t border-zinc-200">
                            <span>Order Total</span>
                            <span className="font-mono text-emerald-600">{checkoutZone === "dhaka" ? "৳2,510" : "৳2,580"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. COURIER SYNC TAB */}
                {heroActiveTab === "courier" && (
                  <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-luxury-card space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                      <div>
                        <span className="text-xs font-bold text-zinc-950 block">Automated Courier Dispatch Pipeline</span>
                        <span className="text-[11px] text-zinc-500">1-Click consignment generation with Steadfast, Pathao & RedX</span>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
                        API Active
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Shipping Consignment Badge */}
                      <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/80 space-y-3 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-zinc-900">Steadfast Official Consignment</span>
                          <span className="font-mono text-[11px] text-zinc-500">#SF-849201</span>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-zinc-200 text-center font-mono space-y-1">
                          <div className="text-sm tracking-widest font-black text-zinc-950">||| | ||||| || |||||| | |||||</div>
                          <div className="text-[10px] text-zinc-400">4x6 Thermal Barcode Label Ready</div>
                        </div>
                        <div className="flex justify-between text-[11px] text-zinc-600">
                          <span>Courier Rider:</span>
                          <span className="font-bold text-emerald-600">Assigned for Tejgaon Pickup</span>
                        </div>
                      </div>

                      {/* Delivery Status Timeline */}
                      <div className="p-4 bg-white rounded-2xl border border-zinc-200/80 space-y-2 text-xs">
                        <span className="font-bold text-zinc-900 block mb-2">Live Webhook Event Stream</span>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-emerald-600 font-medium text-[11px]">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>14:32 — Consignment Booked via API</span>
                          </div>
                          <div className="flex items-center space-x-2 text-emerald-600 font-medium text-[11px]">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>15:10 — 4x6 Label Printed & Parcel Packed</span>
                          </div>
                          <div className="flex items-center space-x-2 text-blue-600 font-medium text-[11px]">
                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                            <span>16:45 — Rider En Route to Warehouse</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. FRAUD SHIELD TAB */}
                {heroActiveTab === "fraud" && (
                  <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-luxury-card space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                      <div>
                        <span className="text-xs font-bold text-zinc-950 block">AI Anti-Fraud RTO Risk Shield</span>
                        <span className="text-[11px] text-zinc-500">Flags serial COD returners before shipping fees are incurred</span>
                      </div>
                      <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2.5 py-0.5 rounded-full">
                        RTO Defense Active
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Risk Assessment Card */}
                      <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/80 space-y-3 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-zinc-900">Buyer Delivery Reputation</span>
                          <span className="font-mono text-emerald-600 font-bold">98.6% Safe</span>
                        </div>
                        <div className="w-full bg-zinc-200 rounded-full h-2.5 overflow-hidden">
                          <div className="bg-emerald-500 h-2.5 rounded-full w-[98.6%]" />
                        </div>
                        <div className="text-[11px] text-zinc-600 space-y-1 pt-1">
                          <div>• Phone: <span className="font-mono font-bold">+880 1711-***892</span></div>
                          <div>• Historical Orders Across Network: <span className="font-bold text-zinc-900">47 Delivered / 1 Refused</span></div>
                          <div>• Decision: <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Safe for COD Dispatch</span></div>
                        </div>
                      </div>

                      {/* Margin Protection Summary */}
                      <div className="p-4 bg-white rounded-2xl border border-zinc-200/80 space-y-2.5 text-xs">
                        <span className="font-bold text-zinc-900 block">Social Commerce Margin Protection</span>
                        <p className="text-[11px] text-zinc-500 leading-relaxed">
                          In Bangladesh social commerce, 15–25% of COD parcels are refused at the doorstep. StoreSwift screens every phone against past courier rejections, saving merchants thousands in return courier penalty charges.
                        </p>
                        <div className="p-2.5 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200/80 text-[11px] font-medium flex items-center space-x-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span>Estimated RTO prevention savings: ৳18,500/month</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. High-Impact Performance Metrics Strip ────────────────────────── */}
      <section className="py-12 bg-white border-b border-zinc-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-zinc-950 font-mono tracking-tight">&lt; 20s</span>
              <p className="text-xs text-zinc-500 font-medium">1-Page Checkout Completion</p>
            </div>
            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-zinc-950 font-mono tracking-tight">+42%</span>
              <p className="text-xs text-zinc-500 font-medium">Conversion Lift vs Multi-Step Carts</p>
            </div>
            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-zinc-950 font-mono tracking-tight">64</span>
              <p className="text-xs text-zinc-500 font-medium">Districts Automated Delivery Coverage</p>
            </div>
            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-zinc-950 font-mono tracking-tight">0%</span>
              <p className="text-xs text-zinc-500 font-medium">Platform Physical Order Commission</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. Interactive Storefronts Showcase ─────────────────────────────── */}
      <section id="storefronts" className="py-24 bg-[#fafafa] border-b border-zinc-200/80 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Turnkey Storefronts
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
              6 Bespoke Storefront Architectures
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
              Every vertical requires tailored customer psychology. Select an industry below to preview its architecture.
            </p>
          </div>

          {/* Industry Category Selector Bar */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
            {INDUSTRY_STOREFRONTS.map((store) => {
              const isSelected = selectedStoreSlug === store.slug;
              return (
                <button
                  key={store.slug}
                  onClick={() => setSelectedStoreSlug(store.slug)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all btn-press ${
                    isSelected
                      ? "bg-zinc-950 text-white shadow-bevel-dark"
                      : "bg-white border border-zinc-200/80 text-zinc-600 hover:text-zinc-950 shadow-bevel-light"
                  }`}
                >
                  {store.category.split("&")[0].trim()}
                </button>
              );
            })}
          </div>

          {/* Featured Store Showcase (Clean Split Card) */}
          <div className="bg-white rounded-3xl border border-zinc-200/90 overflow-hidden shadow-luxury-card grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Left: High-Res Store Visual Preview */}
            <div className="lg:col-span-7 relative min-h-[320px] lg:min-h-[420px] bg-zinc-100 overflow-hidden group">
              <img
                src={activeStore.image}
                alt={activeStore.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 bg-zinc-950/85 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                {activeStore.template}
              </div>
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-3.5 border border-zinc-200/80 shadow-luxury-card flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-zinc-950">{activeStore.name}</p>
                  <p className="text-[11px] text-zinc-500">{activeStore.category}</p>
                </div>
                <Link
                  href={`/store/${activeStore.slug}`}
                  className="inline-flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition"
                >
                  <span>Open Live Demo</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right: Technical Features & Actions */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    {activeStore.category}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-zinc-950 tracking-tight mt-1">
                    {activeStore.headline}
                  </h3>
                  <p className="text-xs text-zinc-500 leading-relaxed mt-2">
                    {activeStore.description}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-zinc-200/70">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                    Pre-Configured Architecture Features:
                  </span>
                  {activeStore.highlights.map((feat, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-xs text-zinc-700">
                      <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-emerald-600" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-200 flex flex-col sm:flex-row gap-2.5">
                <Link
                  href={`/store/${activeStore.slug}`}
                  className="flex-1 py-2.5 px-4 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-900 font-bold text-xs rounded-xl transition text-center shadow-bevel-light flex items-center justify-center space-x-1.5"
                >
                  <span>Explore Live Store</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500" />
                </Link>
                <Link
                  href={`/onboarding?category=${activeStore.categoryParam}`}
                  className="py-2.5 px-4 bg-zinc-950 hover:bg-zinc-850 text-white font-bold text-xs rounded-xl transition text-center shadow-bevel-dark btn-press"
                >
                  <span>Start with This Template</span>
                </Link>
              </div>
            </div>
          </div>

          {/* 6 Storefront Thumbnails Quick Gallery */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {INDUSTRY_STOREFRONTS.map((s) => {
              const isSelected = selectedStoreSlug === s.slug;
              return (
                <button
                  key={s.slug}
                  onClick={() => setSelectedStoreSlug(s.slug)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "border-zinc-950 bg-white shadow-luxury-card ring-1 ring-zinc-950"
                      : "border-zinc-200/80 bg-white/70 hover:bg-white text-zinc-600 shadow-bevel-light"
                  }`}
                >
                  <p className="text-xs font-bold text-zinc-900 truncate">{s.name.split(" ")[0]}</p>
                  <p className="text-[10px] text-zinc-400 truncate mt-0.5">{s.category.split("&")[0].trim()}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 5. Core Platform Engines Bento Grid ─────────────────────────────── */}
      <section id="features" className="py-24 bg-white border-b border-zinc-200/80 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Core Capabilities
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
              Four High-Performance Commerce Engines
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
              StoreSwift replaces fragmented plugins with a single unified operating layer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {/* Engine 1: 1-Page Express Checkout */}
            <div className="p-7 sm:p-8 bg-[#fafafa] rounded-3xl border border-zinc-200/80 shadow-luxury-card space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 border border-blue-200/60 shadow-sm flex items-center justify-center font-bold">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-950 tracking-tight">20-Second 1-Page Checkout</h3>
                  <p className="text-xs text-zinc-600 leading-relaxed mt-1">
                    Eliminate multi-step cart abandonment. Customers complete orders on a single streamlined form with automatic 64-district delivery tariffs, bilingual English & Bengali interface, and instant bKash, Nagad, Card, and Cash on Delivery.
                  </p>
                </div>

                {/* Visual Mini Widget */}
                <div className="p-3.5 bg-white rounded-2xl border border-zinc-200/70 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-700">
                    <span>1-Tap Order Completion</span>
                    <span className="text-emerald-600 font-mono">Inside Dhaka ৳60</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[10px] font-bold text-center">
                    <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200/80 flex items-center justify-center space-x-1">
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>COD Active</span>
                    </div>
                    <div className="p-2 bg-pink-50 text-[#E2136E] rounded-lg border border-pink-200/80 flex items-center justify-center">
                      <span>bKash Direct</span>
                    </div>
                    <div className="p-2 bg-amber-50 text-[#F7931E] rounded-lg border border-amber-200/80 flex items-center justify-center">
                      <span>Nagad MFS</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-medium text-zinc-600 border-t border-zinc-200/60">
                <span className="px-2.5 py-1 bg-white border border-zinc-200/70 rounded-lg">64-District Auto Zones</span>
                <span className="px-2.5 py-1 bg-white border border-zinc-200/70 rounded-lg">Bilingual (EN / বাংলা)</span>
                <span className="px-2.5 py-1 bg-white border border-zinc-200/70 rounded-lg">Doorstep Inspection</span>
              </div>
            </div>

            {/* Engine 2: Automated Courier Dispatch */}
            <div className="p-7 sm:p-8 bg-[#fafafa] rounded-3xl border border-zinc-200/80 shadow-luxury-card space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 shadow-sm flex items-center justify-center font-bold">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-950 tracking-tight">Steadfast & Pathao 1-Click Dispatch</h3>
                  <p className="text-xs text-zinc-600 leading-relaxed mt-1">
                    Direct courier consignment generation directly from your orders dashboard. Automatically generates tracking consignment IDs, syncs live parcel statuses via webhooks, and formats standard 4x6 thermal barcode labels ready for rider pickup.
                  </p>
                </div>

                {/* Visual Mini Widget */}
                <div className="p-3.5 bg-white rounded-2xl border border-zinc-200/70 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-700">
                    <span className="flex items-center space-x-1.5">
                      <Barcode className="w-3.5 h-3.5 text-zinc-600" />
                      <span>Consignment #SF-849201</span>
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      Rider Assigned
                    </span>
                  </div>
                  <div className="font-mono text-[10px] tracking-widest text-zinc-400 bg-zinc-50 p-2 rounded-lg border border-zinc-200 text-center font-bold">
                    |||| ||| ||||||| ||| ||||| 4x6 THERMAL READY
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-medium text-zinc-600 border-t border-zinc-200/60">
                <span className="px-2.5 py-1 bg-white border border-zinc-200/70 rounded-lg">Steadfast API</span>
                <span className="px-2.5 py-1 bg-white border border-zinc-200/70 rounded-lg">Pathao Logistics</span>
                <span className="px-2.5 py-1 bg-white border border-zinc-200/70 rounded-lg">Live Webhook Sync</span>
              </div>
            </div>

            {/* Engine 3: Anti-Fraud RTO Shield */}
            <div className="p-7 sm:p-8 bg-[#fafafa] rounded-3xl border border-zinc-200/80 shadow-luxury-card space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 border border-rose-200/60 shadow-sm flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-950 tracking-tight">Anti-Fraud RTO Risk Shield</h3>
                  <p className="text-xs text-zinc-600 leading-relaxed mt-1">
                    Prevents the primary profit killer in direct commerce: uncollected Cash on Delivery parcel returns. Automatically evaluates buyer phone numbers against network delivery records, scoring delivery reliability (0–100%) and flagging serial returners before dispatch.
                  </p>
                </div>

                {/* Visual Mini Widget */}
                <div className="p-3.5 bg-white rounded-2xl border border-zinc-200/70 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-700">
                    <span>Phone: +880 1711-***892</span>
                    <span className="text-emerald-600 font-bold font-mono">98.6% Delivery Rate</span>
                  </div>
                  <div className="w-full bg-zinc-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-emerald-500 h-2 rounded-full w-[98%]" />
                  </div>
                  <p className="text-[10px] text-zinc-500">Verified buyer delivery history. Safe for instant COD dispatch.</p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-medium text-zinc-600 border-t border-zinc-200/60">
                <span className="px-2.5 py-1 bg-white border border-zinc-200/70 rounded-lg">Return Risk Scoring</span>
                <span className="px-2.5 py-1 bg-white border border-zinc-200/70 rounded-lg">Serial Returner Alerts</span>
                <span className="px-2.5 py-1 bg-white border border-zinc-200/70 rounded-lg">Advance Fee Prompts</span>
              </div>
            </div>

            {/* Engine 4: Multi-Variant Inventory Matrix */}
            <div className="p-7 sm:p-8 bg-[#fafafa] rounded-3xl border border-zinc-200/80 shadow-luxury-card space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 border border-purple-200/60 shadow-sm flex items-center justify-center font-bold">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-950 tracking-tight">Multi-Variant Inventory Matrix</h3>
                  <p className="text-xs text-zinc-600 leading-relaxed mt-1">
                    Generate complete multi-option product matrices (Size, Color, Material) with automatic SKU computation. Backed by atomic SQL stock locks to eliminate overselling during high-traffic social media product launches and viral flash sales.
                  </p>
                </div>

                {/* Visual Mini Widget */}
                <div className="p-3.5 bg-white rounded-2xl border border-zinc-200/70 space-y-2 text-xs font-mono text-[10px]">
                  <div className="flex justify-between text-zinc-500 font-sans font-bold">
                    <span>Variant SKU</span>
                    <span>Atomic Lock</span>
                  </div>
                  <div className="flex justify-between items-center bg-zinc-50 p-2 rounded-lg border border-zinc-200">
                    <span className="text-zinc-800 font-bold">APX-TS-M-BLK (Size: M, Black)</span>
                    <span className="text-emerald-600 font-bold">42 in Stock</span>
                  </div>
                  <div className="flex justify-between items-center bg-zinc-50 p-2 rounded-lg border border-zinc-200">
                    <span className="text-zinc-800 font-bold">APX-TS-L-BLK (Size: L, Black)</span>
                    <span className="text-blue-600 font-bold">18 Reserved</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-medium text-zinc-600 border-t border-zinc-200/60">
                <span className="px-2.5 py-1 bg-white border border-zinc-200/70 rounded-lg">Cartesian Generator</span>
                <span className="px-2.5 py-1 bg-white border border-zinc-200/70 rounded-lg">Atomic Stock Locks</span>
                <span className="px-2.5 py-1 bg-white border border-zinc-200/70 rounded-lg">Zero Overselling</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. Transparent Pricing ─────────────────────────────────────────── */}
      <section id="pricing" className="py-24 bg-[#fafafa] border-b border-zinc-200/80 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Pricing Plans
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
              Simple, Predictable Pricing
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500">
              Zero commission fees on physical orders. Keep 100% of your product revenue.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Starter Plan */}
            <div className="bg-white rounded-3xl border border-zinc-200/80 p-7 sm:p-8 flex flex-col justify-between shadow-bevel-light">
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-zinc-950">Starter</h3>
                  <p className="text-xs text-zinc-500 mt-1">For new brands launching online</p>
                </div>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-extrabold text-zinc-950">৳599</span>
                  <span className="text-xs text-zinc-500 font-medium">/month ($9 USD)</span>
                </div>
                <ul className="space-y-2.5 text-xs text-zinc-600 pt-3 border-t border-zinc-200/70">
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /><span>Up to 500 products</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /><span>20s 1-Page Express Checkout</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /><span>Steadfast & Pathao courier booking</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /><span>0% physical order commission</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /><span>Free StoreSwift subdomain with SSL</span></li>
                </ul>
              </div>
              <Link href="/onboarding?plan=starter" className="mt-8 w-full py-2.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-900 font-bold text-xs rounded-xl transition text-center btn-press shadow-bevel-light">
                Start 14-Day Free Trial
              </Link>
            </div>

            {/* Growth Plan (Popular) */}
            <div className="bg-white rounded-3xl border-2 border-zinc-950 p-7 sm:p-8 flex flex-col justify-between shadow-luxury-card relative ring-1 ring-zinc-950/5">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-zinc-950 text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-0.5 rounded-full shadow-bevel-dark">
                Most Popular
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-zinc-950">Growth</h3>
                  <p className="text-xs text-zinc-500 mt-1">For scaling direct & social commerce brands</p>
                </div>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-extrabold text-zinc-950">৳1,099</span>
                  <span className="text-xs text-zinc-500 font-medium">/month ($19 USD)</span>
                </div>
                <ul className="space-y-2.5 text-xs text-zinc-600 pt-3 border-t border-zinc-200/70">
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /><span>Up to 2,000 products</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /><span>Custom domain with automated SSL</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /><span>Anti-Fraud RTO Risk Shield</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /><span>Meta Pixel, TikTok & GTM CAPI</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /><span>Unlimited courier API bookings</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /><span>Priority customer support</span></li>
                </ul>
              </div>
              <Link href="/onboarding?plan=growth" className="mt-8 w-full py-2.5 bg-zinc-950 hover:bg-zinc-850 text-white font-bold text-xs rounded-xl transition text-center shadow-bevel-dark btn-press">
                Start 14-Day Free Trial
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-white rounded-3xl border border-zinc-200/80 p-7 sm:p-8 flex flex-col justify-between shadow-bevel-light">
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-zinc-950">Pro Enterprise</h3>
                  <p className="text-xs text-zinc-500 mt-1">For high-volume multi-channel stores</p>
                </div>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-extrabold text-zinc-950">৳2,499</span>
                  <span className="text-xs text-zinc-500 font-medium">/month ($49 USD)</span>
                </div>
                <ul className="space-y-2.5 text-xs text-zinc-600 pt-3 border-t border-zinc-200/70">
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /><span>Unlimited products & orders</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /><span>Wholesale Orders & Invoicing</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /><span>Dedicated 24/7 account manager</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /><span>Global CDN & sub-second response</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /><span>Custom courier API credentials</span></li>
                </ul>
              </div>
              <Link href="/onboarding?plan=pro" className="mt-8 w-full py-2.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-900 font-bold text-xs rounded-xl transition text-center btn-press shadow-bevel-light">
                Start 14-Day Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. FAQ Accordion ──────────────────────────────────────────────── */}
      <section id="faq" className="py-24 bg-white border-b border-zinc-200/80 scroll-mt-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Questions & Answers
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500">
              Everything you need to know about setting up and operating your store.
            </p>
          </div>

          <div className="divide-y divide-zinc-200 bg-[#fafafa] rounded-3xl border border-zinc-200/80 p-6 sm:p-8 shadow-luxury-card">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div key={index} className="py-4 first:pt-0 last:pb-0">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between text-left focus:outline-none group"
                  >
                    <span className="font-bold text-sm text-zinc-900 group-hover:text-blue-600 transition">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
                        isOpen ? "transform rotate-180 text-zinc-950" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <p className="mt-3 text-xs sm:text-sm text-zinc-600 leading-relaxed">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 8. Pre-Footer Call to Action (Obsidian Luxury Card) ────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#fafafa]">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-950 text-white p-10 sm:p-16 text-center space-y-6 border border-zinc-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-blue-500/10 blur-3xl pointer-events-none" />

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight relative">
            Ready to launch your high-conversion store?
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed relative">
            Start selling in minutes with pre-configured logistics, localized payments, and industry-tailored storefronts.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5 relative">
            <Link
              href="/onboarding"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 text-xs font-bold bg-white text-zinc-950 hover:bg-zinc-100 px-6 py-3.5 rounded-xl shadow-bevel-light transition btn-press"
            >
              <span>Start 14-Day Free Trial</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/admin?store=apex-fashion"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 px-5 py-3.5 rounded-xl transition shadow-bevel-dark"
            >
              <span>Explore Demo Admin</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 9. Platform Directory Footer ───────────────────────────────────── */}
      <PlatformFooter />
    </div>
  );
}
