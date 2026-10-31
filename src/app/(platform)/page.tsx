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
  Sparkles,
  CheckCircle2,
  Package,
  TrendingUp,
  ShieldAlert
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
      a: "StoreSwift is purpose-built for high-conversion direct commerce. Unlike generic builders that require dozens of paid third-party plugins and expensive monthly subscriptions, StoreSwift natively includes 20-second 1-page checkout, automated courier dispatch with Steadfast and Pathao, printable 4x6 thermal barcode labels, and an Anti-Fraud RTO Shield out of the box."
    },
    {
      q: "How does StoreSwift compare to Zatiq Easy?",
      a: "While Zatiq Easy charges up to 5% per order on their free plan with additional processing deductions, StoreSwift guarantees 0% platform commission on physical orders across all plans. Furthermore, StoreSwift provides 6 deep-vertical category architectures, 20-second 1-page checkout, atomic SQL inventory reservation locks, native 4x6 thermal barcode labels, and an AI Anti-Fraud RTO Shield."
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
            <a href="#storefronts" className="hover:text-white transition">Storefronts</a>
            <a href="#features" className="hover:text-white transition">Platform Pillars</a>
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
              <a href="#storefronts" onClick={() => setIsMobileMenuOpen(false)} className="block px-2 py-1.5 rounded-lg hover:bg-white/5">Storefronts</a>
              <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="block px-2 py-1.5 rounded-lg hover:bg-white/5">Platform Pillars</a>
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

      {/* ─── 2. Hero Section: Clean, Spacious, Minimalist Luxury ────────────── */}
      <section className="relative overflow-hidden pt-20 pb-20 lg:pt-28 lg:pb-32 border-b border-white/[0.08]">
        {/* Subtle Ambient Radial Lighting Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-blue-600/10 via-indigo-600/5 to-transparent blur-[140px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Subtle Status Pill */}
          <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-zinc-300 text-xs font-medium backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="font-semibold text-white">StoreSwift 2.0</span>
            <span className="text-zinc-600">•</span>
            <span>The Commerce Operating System</span>
          </div>

          {/* Master Headline: Clean, Confident, Modern */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-[-0.035em] text-white max-w-4xl mx-auto leading-[1.05]">
            The commerce engine <br />
            <span className="text-zinc-400 font-light">built for high-growth brands.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-normal">
            Turnkey category storefronts, 20-second 1-page checkout, and automated Steadfast & Pathao courier dispatch. Zero physical transaction fees.
          </p>

          {/* Primary Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/onboarding"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 text-sm font-bold bg-white hover:bg-zinc-100 text-zinc-950 px-8 py-4 rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.2)] transition btn-press group"
            >
              <span>Start 14-Day Free Trial</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#storefronts"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 text-sm font-semibold bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border border-white/10 px-7 py-4 rounded-xl transition"
            >
              <span>Explore 6 Live Stores</span>
              <ChevronDown className="w-4 h-4 text-zinc-500" />
            </a>
          </div>

          {/* 3 Core Trust Guarantees */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-8 text-xs text-zinc-400 font-medium">
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

          {/* ─── Hero Centerpiece: High-Fidelity Store Showcase ─────────── */}
          <div className="pt-10 max-w-5xl mx-auto">
            <div className="rounded-3xl border border-white/[0.1] bg-[#0c0d11]/80 backdrop-blur-2xl shadow-[0_25px_80px_rgba(0,0,0,0.8)] overflow-hidden text-left">
              {/* Window Header Bar */}
              <div className="bg-zinc-950/80 border-b border-white/[0.08] px-4 py-3 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-[#ff5f56]/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-[#ffbd2e]/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-[#27c93f]/80 inline-block" />
                </div>

                <div className="flex items-center space-x-2 bg-zinc-900/90 px-4 py-1.5 rounded-full border border-white/10 text-zinc-300 font-mono text-[11px]">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>storeswift.app/store/{activeStore.slug}</span>
                  <span className="text-[9px] bg-emerald-950/90 text-emerald-400 font-bold px-1.5 py-0.5 rounded border border-emerald-800/60">LIVE</span>
                </div>

                <div className="hidden sm:flex items-center space-x-2 text-zinc-400 text-[11px] font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  <span>Edge Online</span>
                </div>
              </div>

              {/* Window Canvas: Spacious Store & Checkout Experience */}
              <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left: Editorial Hero Product */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[11px] font-mono text-zinc-300">
                    <span className="text-blue-400 font-bold">TEMPLATE</span>
                    <span>•</span>
                    <span>{activeStore.template}</span>
                  </div>

                  <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
                    {activeStore.headline}
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-lg">
                    {activeStore.description}
                  </p>

                  <div className="pt-2 flex flex-wrap gap-2 text-xs text-zinc-300">
                    {activeStore.highlights.slice(0, 3).map((item, idx) => (
                      <span key={idx} className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] font-medium flex items-center space-x-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{item}</span>
                      </span>
                    ))}
                  </div>

                  <div className="pt-4 flex items-center space-x-4">
                    <Link
                      href={`/store/${activeStore.slug}`}
                      className="inline-flex items-center space-x-2 text-xs font-bold bg-white text-zinc-950 px-5 py-3 rounded-xl shadow-lg hover:bg-zinc-200 transition"
                    >
                      <span>Explore Live Storefront</span>
                      <ArrowUpRight className="w-4 h-4 text-zinc-600" />
                    </Link>
                    <Link
                      href="/admin?store=apex-fashion"
                      className="inline-flex items-center space-x-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition py-3 px-3"
                    >
                      <span>Open Merchant Admin</span>
                      <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
                    </Link>
                  </div>
                </div>

                {/* Right: Clean Editorial Photography Canvas */}
                <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 aspect-[4/3] group shadow-2xl">
                  <img
                    src={activeStore.image}
                    alt={activeStore.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
                    <div>
                      <p className="font-bold">{activeStore.name}</p>
                      <p className="text-[10px] text-zinc-400">{activeStore.category}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                      20s Checkout Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. Telemetry Impact Bar ────────────────────────────────────────── */}
      <section className="py-12 bg-zinc-950 border-b border-white/[0.08]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-white/[0.08]">
            <div className="space-y-1 sm:px-4">
              <span className="text-3xl sm:text-5xl font-extrabold text-white font-mono tracking-tight">&lt; 20s</span>
              <p className="text-xs text-zinc-400 font-medium">1-Page Checkout Speed</p>
            </div>
            <div className="pt-4 sm:pt-0 sm:px-4 space-y-1">
              <span className="text-3xl sm:text-5xl font-extrabold text-white font-mono tracking-tight">+42%</span>
              <p className="text-xs text-zinc-400 font-medium">Mobile Conversion Lift</p>
            </div>
            <div className="pt-4 sm:pt-0 sm:px-4 space-y-1">
              <span className="text-3xl sm:text-5xl font-extrabold text-white font-mono tracking-tight">64</span>
              <p className="text-xs text-zinc-400 font-medium">Districts Automated Delivery</p>
            </div>
            <div className="pt-4 sm:pt-0 sm:px-4 space-y-1">
              <span className="text-3xl sm:text-5xl font-extrabold text-white font-mono tracking-tight">0%</span>
              <p className="text-xs text-zinc-400 font-medium">Physical Order Commission</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. Bespoke Turnkey Storefronts (Clean Gallery) ─────────────────── */}
      <section id="storefronts" className="py-24 sm:py-28 bg-[#09090b] border-b border-white/[0.08] scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-500">
              Turnkey Architectures
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
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
                      : "bg-white/[0.04] border border-white/[0.08] text-zinc-400 hover:text-white hover:bg-white/[0.08]"
                  }`}
                >
                  {store.category.split("&")[0].trim()}
                </button>
              );
            })}
          </div>

          {/* Store Showcase Split Card */}
          <div className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl border border-white/[0.08] overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Left: High-Res Store Visual Preview */}
            <div className="lg:col-span-7 relative min-h-[360px] lg:min-h-[460px] bg-zinc-950 overflow-hidden group">
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
        </div>
      </section>

      {/* ─── 5. Core Platform Pillars (Uncluttered, Spacious Grid) ──────────── */}
      <section id="features" className="py-24 sm:py-28 bg-zinc-950/70 border-b border-white/[0.08] scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-500">
              Core Platform Pillars
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
              Engineered for Direct Commerce
            </h2>
            <p className="text-xs sm:text-base text-zinc-400 leading-relaxed">
              StoreSwift replaces fragmented plugins with an integrated, high-conversion operating system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pillar 01: 20-Second 1-Page Express Checkout */}
            <div className="p-8 sm:p-10 rounded-3xl bg-zinc-900/40 border border-white/[0.08] backdrop-blur-xl space-y-5 shadow-2xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  20-Second 1-Page Express Checkout
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Traditional multi-step checkout carts abandon over 65% of mobile buyers. StoreSwift compresses the checkout into a single high-conversion screen with automated 64-district delivery rates (৳60 Dhaka / ৳130 Nationwide) and instant bKash, Nagad, and Cash on Delivery.
                </p>
                <div className="space-y-2 pt-2 text-xs text-zinc-300">
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Automatic Inside Dhaka & Nationwide tariff calculation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Bilingual English & Bengali (বাংলা) 1-tap customer toggle</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Doorstep Open Parcel Inspection guarantee included</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pillar 02: Automated Courier Dispatch & 4x6 Labels */}
            <div className="p-8 sm:p-10 rounded-3xl bg-zinc-900/40 border border-white/[0.08] backdrop-blur-xl space-y-5 shadow-2xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Automated Courier Dispatch & 4x6 Labels
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Never copy-paste customer orders into courier portals again. Generate live consignment tracking IDs with a single click, print industry-standard 4x6 thermal barcode shipping labels, and sync live delivery webhooks directly with Steadfast and Pathao.
                </p>
                <div className="space-y-2 pt-2 text-xs text-zinc-300">
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>1-Click consignment creation directly from order admin</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Printable 4x6 thermal barcode shipping labels ready for pickup</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Live webhook status updates synchronized across all 64 districts</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pillar 03: Anti-Fraud RTO Shield */}
            <div className="p-8 sm:p-10 rounded-3xl bg-zinc-900/40 border border-white/[0.08] backdrop-blur-xl space-y-5 shadow-2xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Predictive Anti-Fraud RTO Shield
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  In social commerce, 15–25% of Cash on Delivery parcels are refused at the customer door, costing merchants steep return shipping penalties. StoreSwift screens buyer numbers against nationwide delivery records, flagging serial returners before courier fees are incurred.
                </p>
                <div className="space-y-2 pt-2 text-xs text-zinc-300">
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Machine-scored delivery success rating (0–100%) per customer</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Automatic alerts to collect advance delivery fee on risky buyers</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Protects retail profit margins from return shipping losses</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pillar 04: Cartesian Multi-Variant Inventory Matrix */}
            <div className="p-8 sm:p-10 rounded-3xl bg-zinc-900/40 border border-white/[0.08] backdrop-blur-xl space-y-5 shadow-2xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Cartesian Inventory & Concurrency Safety
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Generate multi-attribute product matrices (Size × Color × Material) with instant SKU generation. Backed by atomic SQL row-level inventory locks, completely eliminating overselling during high-traffic social media flash sales.
                </p>
                <div className="space-y-2 pt-2 text-xs text-zinc-300">
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Automatic Cartesian matrix generation with unique SKUs</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Row-level SQL atomic stock reservation prevents overselling</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Real-time per-variant stock tracking across all sales channels</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. Clean Competitive Contrast ──────────────────────────────────── */}
      <section className="py-20 sm:py-24 bg-[#09090b] border-b border-white/[0.08]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-500">
              Clear Value
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Why Brands Choose StoreSwift
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-zinc-900/30 border border-white/[0.06] space-y-3">
              <span className="text-sm font-bold text-emerald-400 font-mono">01 / COMMISSIONS</span>
              <h4 className="text-base font-bold text-white">0% Order Commission</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Unlike Zatiq Easy (which takes up to 5% per order) or Shopify (transaction fees + apps), StoreSwift charges 0% on your physical orders. Keep 100% of your product revenue.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/30 border border-white/[0.06] space-y-3">
              <span className="text-sm font-bold text-blue-400 font-mono">02 / VELOCITY</span>
              <h4 className="text-base font-bold text-white">20-Second 1-Page Checkout</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Multi-step carts cause over 65% mobile drop-off. StoreSwift's 1-page form with automatic district tariffs and bilingual English/Bengali capture converts visitors in 20 seconds.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/30 border border-white/[0.06] space-y-3">
              <span className="text-sm font-bold text-purple-400 font-mono">03 / LOGISTICS</span>
              <h4 className="text-base font-bold text-white">Native Courier & Barcodes</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Steadfast and Pathao 1-click booking with automated 4x6 thermal barcode stickers. Eliminate hours of manual portal copy-pasting every single evening.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. Transparent Pricing (Obsidian Luxury Columns) ────────────────── */}
      <section id="pricing" className="py-24 sm:py-28 bg-zinc-950/70 border-b border-white/[0.08] scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-500">
              Transparent Pricing Plans
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
              Simple, Predictable Pricing
            </h2>
            <p className="text-xs sm:text-base text-zinc-400">
              Zero commission on physical orders. Keep 100% of your product revenue.
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

      {/* ─── 8. FAQ Accordion ──────────────────────────────────────────────── */}
      <section id="faq" className="py-24 sm:py-28 bg-[#09090b] border-b border-white/[0.08] scroll-mt-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-500">
              Questions & Answers
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
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

      {/* ─── 9. Pre-Footer Call to Action (Obsidian Luxury Card) ────────────── */}
      <section className="py-24 sm:py-28 px-4 sm:px-6 lg:px-8 bg-zinc-950">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-950 text-white p-10 sm:p-16 text-center space-y-6 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-blue-500/10 blur-3xl pointer-events-none" />

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight relative">
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
