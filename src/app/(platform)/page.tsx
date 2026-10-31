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
  CheckCircle2,
  Sparkles,
  CreditCard,
  Package,
  Globe
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
    headline: "Clinical botanical formulations with ingredient bio-active percentages",
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
  const [pricingBilling, setPricingBilling] = useState<"monthly" | "annual">("monthly");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isNavDropdownOpen, setIsNavDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeStore = INDUSTRY_STOREFRONTS.find((s) => s.slug === selectedStoreSlug) || INDUSTRY_STOREFRONTS[0];

  const faqs = [
    {
      q: "How does StoreSwift compare to traditional platforms like Shopify or WooCommerce?",
      a: "StoreSwift is purpose-built for high-conversion direct commerce in South Asia and global direct-to-consumer markets. Unlike generic builders requiring dozens of expensive third-party apps, StoreSwift natively includes 20-second 1-page checkout, 1-click Steadfast & Pathao courier booking, printable 4x6 thermal barcode labels, and an Anti-Fraud RTO Shield out of the box."
    },
    {
      q: "Are there any hidden transaction fees or commissions on orders?",
      a: "No. StoreSwift charges 0% physical order commission across all subscription plans. You keep 100% of your retail product revenue."
    },
    {
      q: "Can I accept Cash on Delivery (COD), bKash, and Nagad?",
      a: "Yes. Cash on Delivery is enabled by default with an Open Parcel Doorstep Inspection guarantee. You can also accept instant payments via bKash Express, Nagad Direct, and credit/debit cards with automated transaction tracking."
    },
    {
      q: "How does automated courier dispatch work with Steadfast and Pathao?",
      a: "When a customer places an order, you can approve and book the consignment with a single click in your Merchant Admin. StoreSwift automatically generates a live tracking consignment ID and formats a printable 4x6 thermal shipping sticker with barcode, ready for pickup by Steadfast or Pathao riders."
    },
    {
      q: "How does the Anti-Fraud RTO Risk Shield protect my business?",
      a: "In social and direct commerce, uncollected Cash on Delivery orders cause costly return courier penalties (typically ৳130 per package). StoreSwift's RTO Shield analyzes buyer phone numbers against nationwide delivery records, flagging high-risk serial returners so you can collect an advance delivery fee before dispatch."
    },
    {
      q: "Can I connect my own custom domain (e.g. mystore.com)?",
      a: "Every store immediately receives a free subdomain (yourbrand.storeswift.app). You can connect your own custom domain with automated SSL encryption on our Growth and Pro plans with zero configuration."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-white selection:text-zinc-950 antialiased">
      {/* ─── 1. Platform Navigation Bar ─────────────────────────────────────── */}
      <header className="border-b border-white/[0.08] bg-[#09090b]/85 backdrop-blur-2xl sticky top-0 z-50 shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center space-x-2.5 group flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-zinc-950 font-bold shadow-[0_0_15px_rgba(255,255,255,0.2)] group-hover:scale-105 transition-transform">
              <Store className="w-4 h-4" />
            </div>
            <span className="text-base font-bold tracking-tight text-white">
              Store<span className="text-blue-500">Swift</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8 text-xs font-semibold text-zinc-400">
            <div className="relative">
              <button
                onClick={() => setIsNavDropdownOpen(!isNavDropdownOpen)}
                className="hover:text-white transition flex items-center space-x-1.5 py-1"
              >
                <span>Live Stores</span>
                <span className="text-[10px] bg-white/10 text-zinc-300 px-1.5 py-0.5 rounded font-bold">6</span>
                <ChevronDown className="w-3 h-3 text-zinc-500" />
              </button>

              {isNavDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNavDropdownOpen(false)} />
                  <div className="absolute left-0 mt-2 w-64 bg-zinc-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/10 z-50 py-2 divide-y divide-white/5 text-xs animate-fade-in">
                    <div className="px-3.5 py-2 text-[10px] uppercase font-mono font-bold tracking-wider text-zinc-500">
                      Explore 6 Live Stores
                    </div>
                    <div className="py-1">
                      {DEMO_STORES_LIST.map((s) => (
                        <Link
                          key={s.slug}
                          href={`/store/${s.slug}`}
                          onClick={() => setIsNavDropdownOpen(false)}
                          className="flex items-center justify-between px-3.5 py-2.5 hover:bg-white/5 transition group"
                        >
                          <div>
                            <p className="font-bold text-white group-hover:text-blue-400 transition">{s.name}</p>
                            <p className="text-[10px] text-zinc-500">{s.category}</p>
                          </div>
                          <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-blue-400 transition" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#how-it-works" className="hover:text-white transition">How It Works</a>
            <a href="#storefronts" className="hover:text-white transition">Storefronts</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
            <a href="#faq" className="hover:text-white transition">FAQ</a>
          </nav>

          {/* Action Buttons & Mobile Hamburger */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <Link
              href="/admin?store=apex-fashion"
              className="text-xs font-semibold text-zinc-300 hover:text-white px-3.5 py-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 transition hidden sm:inline-flex items-center space-x-1.5 shadow-sm"
            >
              <span>Merchant Admin</span>
              <ExternalLink className="w-3 h-3 text-zinc-500" />
            </Link>
            <Link
              href="/onboarding"
              className="inline-flex items-center space-x-1.5 text-xs font-bold bg-white hover:bg-zinc-200 text-zinc-950 px-4 py-2 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] transition btn-press"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-white/10 text-zinc-300 hover:bg-white/5 transition"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 bg-zinc-950/95 backdrop-blur-2xl px-4 py-4 space-y-4 animate-fade-in shadow-2xl">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-zinc-500 block px-2">
                Explore 6 Live Stores
              </span>
              <div className="grid grid-cols-2 gap-2 pt-1">
                {DEMO_STORES_LIST.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/store/${s.slug}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2.5 rounded-xl bg-zinc-900/60 border border-white/5 hover:bg-zinc-800 transition text-xs"
                  >
                    <p className="font-bold text-white">{s.name.split(" ")[0]} Store</p>
                    <p className="text-[10px] text-zinc-500">{s.category.split("&")[0].trim()}</p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 pt-3 space-y-2 text-xs font-semibold text-zinc-300">
              <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="block px-2 py-1.5 rounded-lg hover:bg-white/5">Features</a>
              <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="block px-2 py-1.5 rounded-lg hover:bg-white/5">How It Works</a>
              <a href="#storefronts" onClick={() => setIsMobileMenuOpen(false)} className="block px-2 py-1.5 rounded-lg hover:bg-white/5">Storefronts</a>
              <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="block px-2 py-1.5 rounded-lg hover:bg-white/5">Pricing Plans</a>
              <a href="#faq" onClick={() => setIsMobileMenuOpen(false)} className="block px-2 py-1.5 rounded-lg hover:bg-white/5">FAQ</a>
              <Link
                href="/admin?store=apex-fashion"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-white/5 text-blue-400 font-bold"
              >
                <span>Open Merchant Admin Demo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ─── 2. Hero Section: Clean, Breathable, Magnetic ────────────────────── */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28 border-b border-white/[0.08]">
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[480px] bg-gradient-to-b from-blue-600/12 via-indigo-600/6 to-transparent blur-[140px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-7">
          {/* Status Capsule Badge */}
          <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.1] text-zinc-300 text-xs font-medium backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="font-semibold text-white">StoreSwift 2.0</span>
            <span className="text-zinc-600">•</span>
            <span>Commerce Operating System for Direct Brands</span>
          </div>

          {/* Master Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.035em] text-white max-w-4xl mx-auto leading-[1.1]">
            Build your online store. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-200 to-white">
              Sell faster with 1-page checkout.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed font-normal">
            Turnkey category storefronts, 20-second frictionless checkout, automated Steadfast & Pathao courier dispatch, and zero commission on physical orders.
          </p>

          {/* Primary Action Row */}
          <div className="pt-1 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/onboarding"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 text-sm font-bold bg-white hover:bg-zinc-100 text-zinc-950 px-7 py-3.5 rounded-xl shadow-[0_0_25px_rgba(255,255,255,0.25)] transition btn-press group"
            >
              <span>Start 14-Day Free Trial</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/admin?store=apex-fashion"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 text-sm font-semibold bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 border border-white/10 px-6 py-3.5 rounded-xl transition"
            >
              <span>Open Merchant Cockpit</span>
              <ExternalLink className="w-4 h-4 text-zinc-500" />
            </Link>
          </div>

          {/* Trust Indicators Strip */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs text-zinc-400 font-medium">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>0% physical order commission</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Steadfast & Pathao 1-click sync</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Anti-Fraud RTO Shield included</span>
            </div>
          </div>

          {/* Interactive Category Selector Pills */}
          <div className="pt-6 flex items-center justify-center flex-wrap gap-2">
            {INDUSTRY_STOREFRONTS.map((store) => (
              <button
                key={store.slug}
                onClick={() => setSelectedStoreSlug(store.slug)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  selectedStoreSlug === store.slug
                    ? "bg-white text-zinc-950 shadow-md font-bold scale-105"
                    : "bg-zinc-900/60 text-zinc-400 hover:text-white border border-white/5 hover:border-white/10"
                }`}
              >
                {store.name.split(" ")[0]} ({store.category})
              </button>
            ))}
          </div>

          {/* ─── Hero Visual Showcase: Clean, Uncluttered Luxury Viewport ───── */}
          <div className="pt-4 max-w-5xl mx-auto">
            <div className="rounded-3xl border border-white/[0.12] bg-[#0c0d11]/90 backdrop-blur-2xl shadow-[0_25px_90px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.12)] overflow-hidden">
              {/* Browser Chrome Header */}
              <div className="bg-zinc-950/90 border-b border-white/[0.08] px-4 py-3 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-[#ff5f56]/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-[#ffbd2e]/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-[#27c93f]/80 inline-block" />
                </div>

                <div className="flex items-center space-x-2 bg-zinc-900/90 px-4 py-1.5 rounded-full border border-white/10 text-zinc-300 font-mono text-[11px] shadow-inner">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>storeswift.app/store/{activeStore.slug}</span>
                  <span className="text-[9px] bg-emerald-950/90 text-emerald-400 font-bold px-1.5 py-0.5 rounded border border-emerald-800/60">LIVE DEMO</span>
                </div>

                <div className="flex items-center space-x-2 text-zinc-400 text-[11px] font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
                  <span className="hidden sm:inline">Edge Sub-100ms</span>
                </div>
              </div>

              {/* Viewport Interior: Spacious Luxury Storefront Showcase */}
              <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[440px] bg-zinc-950">
                {/* Left: High-Res Store Visual */}
                <div className="lg:col-span-7 relative overflow-hidden group min-h-[300px] lg:min-h-full">
                  <img
                    src={activeStore.image}
                    alt={activeStore.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-zinc-950" />
                  <div className="absolute top-4 left-4 flex items-center space-x-2">
                    <span className="bg-zinc-950/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/10 shadow-lg">
                      {activeStore.template} • {activeStore.category}
                    </span>
                    <span className="bg-emerald-950/80 backdrop-blur-md text-emerald-400 text-[11px] font-bold px-2.5 py-1 rounded-full border border-emerald-800/50 shadow-lg">
                      4.9 ★ 120+ Orders
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-left hidden sm:block">
                    <p className="text-sm font-bold text-white drop-shadow-md">{activeStore.name}</p>
                    <p className="text-xs text-zinc-300 drop-shadow line-clamp-1">{activeStore.headline}</p>
                  </div>
                </div>

                {/* Right: Clean, Minimalist 1-Page Express Checkout Card */}
                <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between text-left space-y-6 bg-zinc-950/95 backdrop-blur-xl">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                      <div>
                        <span className="text-xs font-bold text-white tracking-tight block">{activeStore.name}</span>
                        <span className="text-[10px] text-zinc-400">{activeStore.category}</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                        20s Flow Active
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                        {activeStore.headline}
                      </h4>
                      <p className="text-xs text-zinc-400 mt-2 leading-relaxed line-clamp-2">
                        {activeStore.description}
                      </p>
                    </div>

                    {/* Clean Express Checkout Preview Box */}
                    <div className="space-y-2.5 pt-3 border-t border-white/[0.06] text-xs">
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                        <span className="text-zinc-300 font-medium">Inside Dhaka Delivery (৳60)</span>
                        <span className="text-emerald-400 font-mono font-bold">Next-Day</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                        <span className="text-zinc-300 font-medium">Nationwide Delivery (৳130)</span>
                        <span className="text-blue-400 font-mono font-bold">Steadfast / Pathao</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                        <span className="text-zinc-300 font-medium">Payment Options</span>
                        <span className="text-zinc-300 font-mono text-[11px]">bKash • Nagad • COD</span>
                      </div>
                    </div>
                  </div>

                  {/* Primary Action Button */}
                  <div className="pt-4 border-t border-white/[0.08] space-y-2.5">
                    <Link
                      href={`/store/${activeStore.slug}`}
                      className="w-full py-3 px-4 bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs rounded-xl transition text-center flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(255,255,255,0.2)] btn-press"
                    >
                      <span>Open Live Storefront</span>
                      <ArrowUpRight className="w-4 h-4 text-zinc-700" />
                    </Link>
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 px-1">
                      <span>Platform Cut: <strong className="text-emerald-400">0% Commission</strong></span>
                      <span>Setup: <strong className="text-white">3 Minutes</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. Trusted Partners Strip (Clean & Minimal) ────────────────────── */}
      <section className="py-6 bg-zinc-950 border-b border-white/[0.06] overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6 whitespace-nowrap min-w-max text-xs text-zinc-400">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">
            Integrated With:
          </span>
          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-2 text-zinc-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <strong className="text-white font-semibold">Steadfast Courier</strong> Official API
            </span>
            <span className="text-zinc-700">•</span>
            <span className="flex items-center space-x-2 text-zinc-300">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              <strong className="text-white font-semibold">Pathao Logistics</strong> Sync
            </span>
            <span className="text-zinc-700">•</span>
            <span className="flex items-center space-x-2 text-zinc-300">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E2136E]" />
              <strong className="text-white font-semibold">bKash</strong> Merchant Gateway
            </span>
            <span className="text-zinc-700">•</span>
            <span className="flex items-center space-x-2 text-zinc-300">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F7931E]" />
              <strong className="text-white font-semibold">Nagad</strong> Direct
            </span>
            <span className="text-zinc-700">•</span>
            <span className="flex items-center space-x-2 text-zinc-300">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <strong className="text-white font-semibold">Doorstep COD</strong> Inspection
            </span>
          </div>
        </div>
      </section>

      {/* ─── 4. Core Platform Capabilities (Asymmetric Editorial Architecture) ─ */}
      <section id="features" className="py-24 sm:py-28 bg-[#09090b] border-b border-white/[0.08] scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-500">
              Platform Architecture
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Engineered for High-Velocity Commerce
            </h2>
            <p className="text-xs sm:text-base text-zinc-400 leading-relaxed">
              StoreSwift replaces fragile third-party plugins with three deeply integrated, high-conversion commerce engines.
            </p>
          </div>

          <div className="space-y-8">
            {/* Master Anchor Feature: 20-Second 1-Page Checkout Engine */}
            <div className="p-8 sm:p-12 bg-zinc-900/40 backdrop-blur-xl rounded-3xl border border-white/[0.08] hover:border-white/20 transition-all shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5 text-left">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shadow-sm">
                    <Zap className="w-4.5 h-4.5" />
                  </div>
                  <span className="font-mono text-xs font-bold text-blue-400 tracking-wider">01 / CHECKOUT VELOCITY</span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                    Capture orders in 20 seconds. <br className="hidden sm:inline" />
                    Never lose a mobile customer.
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mt-3 max-w-xl">
                    Over 65% of mobile shoppers abandon traditional multi-step carts in South Asia. StoreSwift compresses the checkout into a single fast, beautiful screen with automatic 64-district delivery calculation and 1-tap payments.
                  </p>
                </div>

                <div className="space-y-3 pt-2 text-xs text-zinc-300">
                  <div className="flex items-start space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>64-District Automatic Tariffs:</strong> Instantly detects Inside Dhaka (৳60) and Nationwide (৳130) rates with zero manual input.</span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>1-Tap MFS & Doorstep COD:</strong> Native bKash Express, Nagad Direct, and Cash on Delivery with open parcel inspection.</span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Bilingual UI Toggle:</strong> 1-Tap switch between English and Bengali (বাংলা) to maximize customer confidence.</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400">
                  <span className="text-white font-bold">&lt; 20s Checkout Speed</span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-emerald-400 font-bold">+42.8% Conversion Lift</span>
                  <span className="text-zinc-600">•</span>
                  <span>0% Order Commission</span>
                </div>
              </div>

              {/* Visual Preview on Right */}
              <div className="lg:col-span-5 bg-zinc-950/90 rounded-2xl border border-white/[0.08] p-5 sm:p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 text-xs">
                  <span className="font-bold text-white">Express Checkout Preview</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                    20s Flow
                  </span>
                </div>

                <div className="space-y-1.5 bg-white/[0.02] p-3 rounded-xl border border-white/[0.05]">
                  <p className="text-xs font-bold text-white">Apex Tailored Merino Wool Blazer</p>
                  <p className="text-xs font-mono text-zinc-300">৳3,450 • Size 40R (Charcoal)</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-left">
                  <div className="p-2.5 rounded-xl border border-blue-500 bg-blue-600/10">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Inside Dhaka</span>
                      <span className="text-xs font-mono font-bold text-emerald-400">৳60</span>
                    </div>
                    <span className="text-[10px] text-zinc-400">Next-Day Courier</span>
                  </div>
                  <div className="p-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-300">Nationwide</span>
                      <span className="text-xs font-mono font-bold text-emerald-400">৳130</span>
                    </div>
                    <span className="text-[10px] text-zinc-400">Steadfast / Pathao</span>
                  </div>
                </div>

                {/* 1-Tap Payment Preview */}
                <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-semibold">
                  <div className="py-1.5 px-2 rounded-lg bg-[#E2136E]/15 border border-[#E2136E]/40 text-pink-300">
                    bKash Direct
                  </div>
                  <div className="py-1.5 px-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-zinc-400">
                    Nagad Pay
                  </div>
                  <div className="py-1.5 px-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-zinc-400">
                    Cash on Delivery
                  </div>
                </div>

                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Order Subtotal:</span>
                  <span className="text-base font-black text-white font-mono">৳3,510</span>
                </div>
              </div>
            </div>

            {/* Companion Row: Two Balanced, High-Impact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Feature 02: Automated Logistics & Courier */}
              <div className="p-8 sm:p-10 bg-zinc-900/40 backdrop-blur-xl rounded-3xl border border-white/[0.08] hover:border-white/20 transition-all shadow-2xl flex flex-col justify-between space-y-6">
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-sm">
                        <Truck className="w-4.5 h-4.5" />
                      </div>
                      <span className="font-mono text-xs font-bold text-emerald-400 tracking-wider">02 / AUTOMATED LOGISTICS</span>
                    </div>
                    <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-mono">
                      Steadfast & Pathao
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-white tracking-tight">
                      1-Click Courier Booking & Thermal Labels
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mt-2.5">
                      Never copy-paste customer orders into courier apps again. When an order arrives, generate live tracking consignment IDs with a single click and print industry-standard 4x6 thermal barcode shipping stickers.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2 text-xs text-zinc-300">
                    <div className="flex items-start space-x-2.5">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span><strong>1-Click Consignment Booking:</strong> Instantly register packages with Steadfast or Pathao from your admin dashboard.</span>
                    </div>
                    <div className="flex items-start space-x-2.5">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span><strong>4x6 Thermal Barcode Labels:</strong> Auto-formats ready-to-print shipping stickers with barcodes for rider pickup.</span>
                    </div>
                    <div className="flex items-start space-x-2.5">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span><strong>Live Webhook SMS Tracking:</strong> Synchronizes delivery progress, transit exceptions, and COD remittances in real time.</span>
                    </div>
                  </div>
                </div>

                <div className="pt-5 border-t border-white/[0.08] flex items-center justify-between text-xs text-zinc-400">
                  <span>Logistics Partners: <strong className="text-white">Steadfast & Pathao</strong></span>
                  <span className="text-emerald-400 font-mono font-bold">1-Click Dispatch Active</span>
                </div>
              </div>

              {/* Feature 03: Margin Protection & Atomic Inventory */}
              <div className="p-8 sm:p-10 bg-zinc-900/40 backdrop-blur-xl rounded-3xl border border-white/[0.08] hover:border-white/20 transition-all shadow-2xl flex flex-col justify-between space-y-6">
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shadow-sm">
                        <ShieldCheck className="w-4.5 h-4.5" />
                      </div>
                      <span className="font-mono text-xs font-bold text-rose-400 tracking-wider">03 / MARGIN & FRAUD SHIELD</span>
                    </div>
                    <span className="text-[10px] font-bold bg-rose-500/10 text-rose-400 px-2.5 py-0.5 rounded-full border border-rose-500/20 font-mono">
                      RTO Defense
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-white tracking-tight">
                      Predictive Anti-Fraud & Atomic Stock Locks
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mt-2.5">
                      Uncollected Cash on Delivery parcels drain 15–25% of merchant profits in return shipping penalties. StoreSwift screens buyer numbers against nationwide delivery records and locks inventory at the SQL level to prevent overselling.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2 text-xs text-zinc-300">
                    <div className="flex items-start space-x-2.5">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span><strong>0–100% Delivery Confidence Rating:</strong> Scores customer phone numbers to identify chronic serial returners before dispatch.</span>
                    </div>
                    <div className="flex items-start space-x-2.5">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span><strong>Advance Courier Fee Alerts:</strong> Prompts advance collection on high-risk orders, saving ৳130 in return penalties.</span>
                    </div>
                    <div className="flex items-start space-x-2.5">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span><strong>Atomic SQL Stock Locks:</strong> Row-level inventory reservation eliminates double-booking during live drops and flash sales.</span>
                    </div>
                  </div>
                </div>

                <div className="pt-5 border-t border-white/[0.08] flex items-center justify-between text-xs text-zinc-400">
                  <span>Merchant Protection: <strong className="text-white">COD Risk Shield</strong></span>
                  <span className="text-emerald-400 font-mono font-bold">0% Order Commission</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. How It Works (3 Simple Steps to Scale) ──────────────────────── */}
      <section id="how-it-works" className="py-24 sm:py-28 bg-zinc-950/70 border-b border-white/[0.08] scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-500">
              Zero Code • 3 Minutes
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Three Simple Steps to Launch
            </h2>
            <p className="text-xs sm:text-base text-zinc-400 leading-relaxed">
              No developer hiring, no complex agency retainers, and no plugin maintenance. Deploy a high-conversion store in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-8 rounded-3xl bg-zinc-900/40 border border-white/[0.08] backdrop-blur-xl space-y-5 shadow-2xl relative">
              <span className="text-4xl font-black text-zinc-700 font-mono block">01</span>
              <div>
                <h3 className="text-lg font-bold text-white">Choose Your Store Architecture</h3>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  Select from 6 bespoke category storefronts (Fashion, Cosmetics, Shoes, Tech, Jewelry, Food) configured with domain-tailored features like GSM badges and routine builders.
                </p>
              </div>
              <div className="pt-3 border-t border-white/[0.06] flex items-center space-x-2 text-[11px] text-blue-400 font-medium">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>Zero agency coding required</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-3xl bg-zinc-900/40 border border-white/[0.08] backdrop-blur-xl space-y-5 shadow-2xl relative">
              <span className="text-4xl font-black text-zinc-700 font-mono block">02</span>
              <div>
                <h3 className="text-lg font-bold text-white">Connect Courier & MFS in 60s</h3>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  Link your Steadfast or Pathao API keys and bKash/Nagad merchant accounts. Nationwide 64-district delivery rates (৳60/৳130) are instantly active.
                </p>
              </div>
              <div className="pt-3 border-t border-white/[0.06] flex items-center space-x-2 text-[11px] text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Automated webhook sync ready</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-3xl bg-zinc-900/40 border border-white/[0.08] backdrop-blur-xl space-y-5 shadow-2xl relative">
              <span className="text-4xl font-black text-zinc-700 font-mono block">03</span>
              <div>
                <h3 className="text-lg font-bold text-white">Start High-Velocity Selling</h3>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  Capture mobile buyers in &lt;20 seconds with 1-page checkout. Auto-generate 4x6 thermal barcode labels with 1 click and stop fraud before dispatch.
                </p>
              </div>
              <div className="pt-3 border-t border-white/[0.06] flex items-center space-x-2 text-[11px] text-purple-400 font-medium">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span>0% physical order commission</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. Bespoke Turnkey Storefronts (Luxury Studio) ─────────────────── */}
      <section id="storefronts" className="py-24 sm:py-28 bg-[#09090b] border-b border-white/[0.08] scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-500">
              Turnkey Storefront Architectures
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              6 Tailored Industry Storefronts
            </h2>
            <p className="text-xs sm:text-base text-zinc-400 leading-relaxed">
              Every commerce vertical requires tailored customer psychology. Select an industry to preview its pre-configured architecture.
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
                  className={`px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all btn-press ${
                    isSelected
                      ? "bg-white text-zinc-950 shadow-[0_0_20px_rgba(255,255,255,0.25)]"
                      : "bg-white/[0.05] border border-white/[0.08] text-zinc-400 hover:text-white hover:bg-white/[0.08]"
                  }`}
                >
                  {store.category.split("&")[0].trim()}
                </button>
              );
            })}
          </div>

          {/* Featured Store Showcase */}
          <div className="bg-zinc-900/60 backdrop-blur-xl rounded-3xl border border-white/[0.1] overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Left: Store Visual Preview */}
            <div className="lg:col-span-7 relative min-h-[340px] lg:min-h-[440px] bg-zinc-950 overflow-hidden group">
              <img
                src={activeStore.image}
                alt={activeStore.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
              <div className="absolute top-5 left-5 bg-zinc-950/85 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/10 shadow-lg">
                {activeStore.template}
              </div>
              <div className="absolute bottom-5 left-5 right-5 bg-zinc-900/90 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">{activeStore.name}</p>
                  <p className="text-[11px] text-zinc-400">{activeStore.category}</p>
                </div>
                <Link
                  href={`/store/${activeStore.slug}`}
                  className="inline-flex items-center space-x-1 text-xs font-bold text-blue-400 hover:text-blue-300 transition"
                >
                  <span>Open Live Demo</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right: Technical Features & Actions */}
            <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">
                    {activeStore.category}
                  </span>
                  <h3 className="text-2xl font-bold text-white tracking-tight mt-1.5">
                    {activeStore.headline}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mt-2.5">
                    {activeStore.description}
                  </p>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-white/[0.08]">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 block mb-2">
                    Pre-Configured Architecture Features:
                  </span>
                  {activeStore.highlights.map((feat, idx) => (
                    <div key={idx} className="flex items-center space-x-2.5 text-xs text-zinc-300">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0 border border-emerald-500/20">
                        <Check className="w-3 h-3 text-emerald-400" />
                      </div>
                      <span className="font-medium">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row gap-3">
                <Link
                  href={`/store/${activeStore.slug}`}
                  className="flex-1 py-3 px-4 bg-zinc-800/80 hover:bg-zinc-700 border border-white/10 text-white font-bold text-xs rounded-xl transition text-center flex items-center justify-center space-x-1.5"
                >
                  <span>Explore Live Store</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
                </Link>
                <Link
                  href={`/onboarding?category=${activeStore.categoryParam}`}
                  className="py-3 px-5 bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs rounded-xl transition text-center shadow-[0_0_20px_rgba(255,255,255,0.2)] btn-press"
                >
                  <span>Clone Template</span>
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
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? "border-white/40 bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.1)] ring-1 ring-white/20"
                      : "border-white/[0.06] bg-zinc-900/40 hover:bg-zinc-900 text-zinc-400"
                  }`}
                >
                  <p className="text-xs font-bold text-white truncate">{s.name.split(" ")[0]}</p>
                  <p className="text-[10px] text-zinc-500 truncate mt-0.5">{s.category.split("&")[0].trim()}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 7. Transparent Pricing (Clean, Uncluttered 3 Tiers) ─────────────── */}
      <section id="pricing" className="py-24 sm:py-28 bg-zinc-950/70 border-b border-white/[0.08] scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-500">
              Transparent Pricing Plans
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Simple, Predictable Pricing
            </h2>
            <p className="text-xs sm:text-base text-zinc-400">
              Zero commission on physical orders. Keep 100% of your retail margin.
            </p>

            {/* Billing Cadence Toggle */}
            <div className="pt-4 flex items-center justify-center">
              <div className="p-1 rounded-full bg-zinc-900 border border-white/10 flex items-center space-x-1 text-xs">
                <button
                  type="button"
                  onClick={() => setPricingBilling("monthly")}
                  className={`px-4 py-1.5 rounded-full transition font-semibold ${
                    pricingBilling === "monthly"
                      ? "bg-white text-zinc-950 shadow-md"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Monthly Billing
                </button>
                <button
                  type="button"
                  onClick={() => setPricingBilling("annual")}
                  className={`px-4 py-1.5 rounded-full transition font-semibold flex items-center space-x-1.5 ${
                    pricingBilling === "annual"
                      ? "bg-white text-zinc-950 shadow-md"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <span>Annual Billing</span>
                  <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-emerald-500/30">
                    Save 20%
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4">
            {/* Starter Plan */}
            <div className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl border border-white/[0.08] p-8 sm:p-9 flex flex-col justify-between shadow-2xl">
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-white">Starter</h3>
                  <p className="text-xs text-zinc-400 mt-1">For new brands launching online</p>
                </div>
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-4xl font-extrabold text-white">
                    {pricingBilling === "monthly" ? "৳599" : "৳479"}
                  </span>
                  <span className="text-xs text-zinc-400 font-medium">/month</span>
                  {pricingBilling === "annual" && (
                    <span className="text-[10px] text-emerald-400 font-mono ml-1">billed annually</span>
                  )}
                </div>
                <ul className="space-y-3 text-xs text-zinc-300 pt-4 border-t border-white/[0.08]">
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-400 flex-shrink-0" /><span>Up to 500 products</span></li>
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-400 flex-shrink-0" /><span>20s 1-Page Express Checkout</span></li>
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-400 flex-shrink-0" /><span>Steadfast & Pathao courier booking</span></li>
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-400 flex-shrink-0" /><span>0% physical order commission</span></li>
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-400 flex-shrink-0" /><span>Free StoreSwift subdomain with SSL</span></li>
                </ul>
              </div>
              <Link href="/onboarding?plan=starter" className="mt-8 w-full py-3 bg-zinc-800/80 hover:bg-zinc-700 border border-white/10 text-white font-bold text-xs rounded-xl transition text-center btn-press">
                Start 14-Day Free Trial
              </Link>
            </div>

            {/* Growth Plan (Popular) */}
            <div className="bg-zinc-900/80 backdrop-blur-xl rounded-3xl border-2 border-blue-500/60 p-8 sm:p-9 flex flex-col justify-between shadow-[0_0_50px_rgba(59,130,246,0.18)] relative ring-1 ring-blue-500/20">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-4 py-1 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                Most Popular
              </div>
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-white">Growth</h3>
                  <p className="text-xs text-zinc-300 mt-1">For scaling direct & social commerce brands</p>
                </div>
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-4xl font-extrabold text-white">
                    {pricingBilling === "monthly" ? "৳1,099" : "৳879"}
                  </span>
                  <span className="text-xs text-zinc-300 font-medium">/month</span>
                  {pricingBilling === "annual" && (
                    <span className="text-[10px] text-emerald-400 font-mono ml-1">billed annually</span>
                  )}
                </div>
                <ul className="space-y-3 text-xs text-zinc-200 pt-4 border-t border-white/10">
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-400 flex-shrink-0" /><span>Up to 2,000 products</span></li>
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-400 flex-shrink-0" /><span>Custom domain with automated SSL</span></li>
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-400 flex-shrink-0" /><span>Anti-Fraud RTO Risk Shield</span></li>
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-400 flex-shrink-0" /><span>Meta Pixel, TikTok & GTM CAPI</span></li>
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-400 flex-shrink-0" /><span>Unlimited courier API bookings</span></li>
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-400 flex-shrink-0" /><span>Priority customer support</span></li>
                </ul>
              </div>
              <Link href="/onboarding?plan=growth" className="mt-8 w-full py-3 bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs rounded-xl transition text-center shadow-[0_0_20px_rgba(255,255,255,0.25)] btn-press">
                Start 14-Day Free Trial
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl border border-white/[0.08] p-8 sm:p-9 flex flex-col justify-between shadow-2xl">
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-white">Pro Enterprise</h3>
                  <p className="text-xs text-zinc-400 mt-1">For high-volume multi-channel stores</p>
                </div>
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-4xl font-extrabold text-white">
                    {pricingBilling === "monthly" ? "৳2,499" : "৳1,999"}
                  </span>
                  <span className="text-xs text-zinc-400 font-medium">/month</span>
                  {pricingBilling === "annual" && (
                    <span className="text-[10px] text-emerald-400 font-mono ml-1">billed annually</span>
                  )}
                </div>
                <ul className="space-y-3 text-xs text-zinc-300 pt-4 border-t border-white/[0.08]">
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-400 flex-shrink-0" /><span>Unlimited products & orders</span></li>
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-400 flex-shrink-0" /><span>Wholesale Orders & Invoicing</span></li>
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-400 flex-shrink-0" /><span>Dedicated 24/7 account manager</span></li>
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-400 flex-shrink-0" /><span>Global CDN & sub-second response</span></li>
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-400 flex-shrink-0" /><span>Custom courier API credentials</span></li>
                </ul>
              </div>
              <Link href="/onboarding?plan=pro" className="mt-8 w-full py-3 bg-zinc-800/80 hover:bg-zinc-700 border border-white/10 text-white font-bold text-xs rounded-xl transition text-center btn-press">
                Start 14-Day Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 8. Frequently Asked Questions (FAQ) ────────────────────────────── */}
      <section id="faq" className="py-24 sm:py-28 bg-[#09090b] border-b border-white/[0.08] scroll-mt-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-500">
              Questions & Answers
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Everything you need to know about setting up and operating your store.
            </p>
          </div>

          <div className="divide-y divide-white/[0.08] bg-zinc-900/40 backdrop-blur-xl rounded-3xl border border-white/[0.08] p-6 sm:p-8 shadow-2xl">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div key={index} className="py-4 first:pt-0 last:pb-0">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between text-left focus:outline-none group"
                  >
                    <span className="font-bold text-sm text-white group-hover:text-blue-400 transition">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${
                        isOpen ? "transform rotate-180 text-white" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <p className="mt-3 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 9. Final Call to Action ────────────────────────────────────────── */}
      <section className="py-24 sm:py-28 px-4 sm:px-6 lg:px-8 bg-zinc-950">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-950 text-white p-10 sm:p-16 text-center space-y-6 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-blue-500/10 blur-3xl pointer-events-none" />

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight relative">
            Ready to launch your store?
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed relative">
            Start selling in minutes with pre-configured logistics, localized payments, and industry-tailored storefronts.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5 relative">
            <Link
              href="/onboarding"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 text-xs font-bold bg-white text-zinc-950 hover:bg-zinc-200 px-7 py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] transition btn-press"
            >
              <span>Start 14-Day Free Trial</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/admin?store=apex-fashion"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 px-6 py-4 rounded-xl transition"
            >
              <span>Explore Demo Admin</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 10. Platform Directory Footer ──────────────────────────────────── */}
      <PlatformFooter />
    </div>
  );
}
