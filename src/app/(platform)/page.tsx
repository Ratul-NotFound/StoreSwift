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
  Globe,
  TrendingUp,
  Rocket
} from "lucide-react";
import { PlatformFooter, DEMO_STORES_LIST } from "@/components/platform-footer";
import { ThemeToggle } from "@/components/theme-toggle";

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
    template: "Organic Farmstead",
    headline: "Farmstead provisions, raw alpine honey, and small-batch micro-lots",
    description: "Purpose-built for specialty coffee, raw honey, and gourmet provisions with harvest altitude metrics, roast freshness tracking, and harvest dates.",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&auto=format&fit=crop&q=85",
    highlights: ["48h harvest & roast freshness", "100% raw unheated alpine honey", "Cold-pressed extra virgin olive oil", "Tamper-evident airtight seal protocol"],
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
    <div className="flex flex-col min-h-screen studio-canvas-light dark:studio-canvas-dark text-zinc-900 dark:text-zinc-100 font-sans selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-950 antialiased transition-colors duration-150">
      {/* ─── 1. Platform Navigation Bar ─────────────────────────────────────── */}
      <header className="border-b border-zinc-200/80 dark:border-white/[0.06] bg-white/80 dark:bg-[#070709]/80 backdrop-blur-2xl sticky top-0 z-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center space-x-2.5 group flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
              <Store className="w-4 h-4" />
            </div>
            <span className="text-base font-bold tracking-tight text-zinc-950 dark:text-white">
              Store<span className="text-blue-600 dark:text-blue-500">Swift</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            <div className="relative">
              <button
                onClick={() => setIsNavDropdownOpen(!isNavDropdownOpen)}
                className="hover:text-zinc-950 dark:hover:text-white transition flex items-center space-x-1.5 py-1"
              >
                <span>Live Stores</span>
                <span className="text-[10px] bg-zinc-100 dark:bg-white/10 text-zinc-700 dark:text-zinc-300 px-1.5 py-0.5 rounded font-bold">6</span>
                <ChevronDown className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
              </button>

              {isNavDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNavDropdownOpen(false)} />
                  <div className="absolute left-0 mt-2 w-64 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl rounded-2xl shadow-xl border border-zinc-200 dark:border-white/10 z-50 py-2 divide-y divide-zinc-100 dark:divide-white/5 text-xs animate-fade-in">
                    <div className="px-3.5 py-2 text-[10px] uppercase font-mono font-bold tracking-wider text-zinc-500">
                      Explore 6 Live Stores
                    </div>
                    <div className="py-1">
                      {DEMO_STORES_LIST.map((s) => (
                        <Link
                          key={s.slug}
                          href={`/store/${s.slug}`}
                          onClick={() => setIsNavDropdownOpen(false)}
                          className="flex items-center justify-between px-3.5 py-2.5 hover:bg-zinc-100 dark:hover:bg-white/5 transition group"
                        >
                          <div>
                            <p className="font-bold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">{s.name}</p>
                            <p className="text-[10px] text-zinc-500">{s.category}</p>
                          </div>
                          <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-blue-600 dark:text-blue-400 transition" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            <a href="#features" className="hover:text-zinc-950 dark:hover:text-white transition">Features</a>
            <a href="#how-it-works" className="hover:text-zinc-950 dark:hover:text-white transition">How It Works</a>
            <a href="#storefronts" className="hover:text-zinc-950 dark:hover:text-white transition">Storefronts</a>
            <a href="#pricing" className="hover:text-zinc-950 dark:hover:text-white transition">Pricing</a>
            <a href="#faq" className="hover:text-zinc-950 dark:hover:text-white transition">FAQ</a>
          </nav>

          {/* Action Buttons & Mobile Hamburger */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 flex-shrink-0">
            {/* Theme Toggle Button */}
            <ThemeToggle />

            <Link
              href="/admin?store=apex-fashion"
              className="text-xs font-semibold text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white px-3.5 py-2 rounded-xl bg-white hover:bg-zinc-50 dark:bg-zinc-900/80 dark:hover:bg-zinc-800 border border-zinc-200/90 dark:border-white/[0.08] transition hidden sm:inline-flex items-center space-x-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            >
              <span>Merchant Admin</span>
              <ExternalLink className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
            </Link>
            <Link
              href="/onboarding"
              className="inline-flex items-center space-x-1.5 text-xs font-bold bg-zinc-950 hover:bg-black text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 px-4 py-2 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.1)] transition btn-press"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 transition"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-zinc-200/80 dark:border-white/10 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl px-4 py-4 space-y-4 animate-fade-in shadow-2xl">
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
                    className="p-2.5 rounded-xl bg-zinc-100/70 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/5 hover:bg-zinc-200/70 dark:hover:bg-zinc-800 transition text-xs"
                  >
                    <p className="font-bold text-zinc-900 dark:text-white">{s.name.split(" ")[0]} Store</p>
                    <p className="text-[10px] text-zinc-500">{s.category.split("&")[0].trim()}</p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t border-zinc-200 dark:border-white/10 pt-3 space-y-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="block px-2 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5">Features</a>
              <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="block px-2 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5">How It Works</a>
              <a href="#storefronts" onClick={() => setIsMobileMenuOpen(false)} className="block px-2 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5">Storefronts</a>
              <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="block px-2 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5">Pricing Plans</a>
              <a href="#faq" onClick={() => setIsMobileMenuOpen(false)} className="block px-2 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5">FAQ</a>
              <Link
                href="/admin?store=apex-fashion"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 text-blue-600 dark:text-blue-400 font-bold"
              >
                <span>Open Merchant Admin Demo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Mobile Theme Toggle Row */}
            <div className="border-t border-zinc-200 dark:border-white/10 pt-3 flex items-center justify-between px-2">
              <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Display Theme</span>
              <ThemeToggle showLabel />
            </div>
          </div>
        )}
      </header>

      {/* ─── 2. Hero Section: Studio Depth & Architectural Calm ─────────────── */}
      <section className="relative overflow-hidden min-h-[calc(100vh-4rem)] flex flex-col justify-between items-center py-12 sm:py-16 lg:py-16 border-b border-zinc-200/80 dark:border-white/[0.06] transition-colors">
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 sm:space-y-7 my-auto">
          {/* Status Capsule Badge */}
          <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-zinc-900/80 border border-zinc-200/90 dark:border-white/[0.08] text-zinc-600 dark:text-zinc-300 text-xs font-medium shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
            <span className="font-semibold text-zinc-950 dark:text-white">StoreSwift 2.0</span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span>Commerce Operating System for Direct Brands</span>
          </div>

          {/* Master Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.035em] text-zinc-950 dark:text-white max-w-5xl mx-auto leading-[1.08]">
            Build your online store. <br className="hidden sm:inline" />
            <span className="text-zinc-950 dark:text-white">
              Sell faster with 1-page checkout.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed font-normal">
            Turnkey category storefronts, 20-second frictionless checkout, automated Steadfast & Pathao courier dispatch, and zero commission on physical orders.
          </p>

          {/* Primary Action Row */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/onboarding"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 text-sm font-bold bg-zinc-950 hover:bg-black text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 px-7 py-3.5 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_12px_rgba(255,255,255,0.15)] transition btn-press group"
            >
              <span>Start 14-Day Free Trial</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/admin?store=apex-fashion"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 text-sm font-semibold bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-200/90 dark:bg-zinc-900/80 dark:hover:bg-zinc-800 dark:text-zinc-200 dark:border-white/[0.08] px-6 py-3.5 rounded-xl transition shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            >
              <span>Open Merchant Cockpit</span>
              <ExternalLink className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
            </Link>
          </div>

          {/* Trust Indicators Strip */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-5 sm:gap-8 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>0% physical order commission</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Steadfast & Pathao 1-click sync</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Anti-Fraud RTO Shield included</span>
            </div>
          </div>
        </div>

        {/* Subtle Scroll Down Prompt synced with viewport bottom */}
        <div className="relative pt-6 pb-2 flex justify-center">
          <a
            href="#features"
            className="inline-flex items-center space-x-1.5 text-xs font-mono font-medium text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300 transition group"
          >
            <span>Explore platform capabilities</span>
            <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
          </a>
        </div>
      </section>

      {/* ─── 4. Core Platform Capabilities (Precision Hardware Cards) ────────── */}
      <section id="features" className="relative min-h-0 lg:min-h-[calc(100vh-4rem)] flex flex-col justify-center py-16 sm:py-20 lg:py-16 border-b border-zinc-200/80 dark:border-white/[0.06] scroll-mt-16 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12 w-full my-auto">
          <div className="text-center max-w-2xl mx-auto space-y-2.5 sm:space-y-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-500">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-zinc-950 dark:text-white tracking-tight leading-tight">
              Engineered for High-Velocity Commerce
            </h2>
            <p className="text-xs sm:text-sm lg:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              StoreSwift replaces fragile third-party plugins with three deeply integrated, high-conversion commerce engines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Card 01: 20-Second Checkout */}
            <div className="luxury-card-light dark:luxury-card-dark rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 transition-transform duration-200 hover:-translate-y-1">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-white/10 text-zinc-900 dark:text-white flex items-center justify-center shadow-sm">
                    <Zap className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-zinc-100 dark:bg-white/10 text-zinc-800 dark:text-zinc-300 px-2.5 py-1 rounded-full border border-zinc-200 dark:border-white/10">
                    &lt; 20s Flow
                  </span>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-zinc-950 dark:text-white tracking-tight">
                    1-Page Express Checkout
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mt-2">
                    Traditional multi-step checkout carts abandon over 65% of mobile customers. StoreSwift compresses checkout into a single 20-second screen.
                  </p>
                </div>

                <div className="space-y-2.5 pt-1 text-xs text-zinc-700 dark:text-zinc-300">
                  <div className="flex items-start space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Automatic Inside Dhaka (৳60) and Nationwide (৳130) rates</span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>1-Tap bKash, Nagad, and Cash on Delivery with open parcel check</span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>1-Tap English and Bengali (বাংলা) language toggle</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-white/[0.06] flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                <span>Speed Benchmark:</span>
                <span className="text-zinc-900 dark:text-white font-mono font-bold">+42.8% Conversion Lift</span>
              </div>
            </div>

            {/* Card 02: Automated Logistics & Courier */}
            <div className="luxury-card-light dark:luxury-card-dark rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 transition-transform duration-200 hover:-translate-y-1">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-white/10 text-zinc-900 dark:text-white flex items-center justify-center shadow-sm">
                    <Truck className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-zinc-100 dark:bg-white/10 text-zinc-800 dark:text-zinc-300 px-2.5 py-1 rounded-full border border-zinc-200 dark:border-white/10">
                    Steadfast & Pathao
                  </span>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-zinc-950 dark:text-white tracking-tight">
                    Automated Courier Dispatch
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mt-2">
                    Never copy-paste customer orders into courier apps. Generate tracking IDs with one click and print standard 4x6 thermal barcode labels.
                  </p>
                </div>

                <div className="space-y-2.5 pt-1 text-xs text-zinc-700 dark:text-zinc-300">
                  <div className="flex items-start space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>1-Click consignment creation directly from your admin orders</span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Ready-to-print 4x6 thermal barcode stickers for rider pickup</span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Real-time webhook sync for delivery status and COD remittances</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-white/[0.06] flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                <span>Logistics Partners:</span>
                <span className="text-zinc-900 dark:text-white font-mono font-bold">1-Click Dispatch Active</span>
              </div>
            </div>

            {/* Card 03: Margin Protection & Anti-Fraud */}
            <div className="luxury-card-light dark:luxury-card-dark rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 transition-transform duration-200 hover:-translate-y-1">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-white/10 text-zinc-900 dark:text-white flex items-center justify-center shadow-sm">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-zinc-100 dark:bg-white/10 text-zinc-800 dark:text-zinc-300 px-2.5 py-1 rounded-full border border-zinc-200 dark:border-white/10">
                    COD Risk Defense
                  </span>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-zinc-950 dark:text-white tracking-tight">
                    Predictive Anti-Fraud Shield
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mt-2">
                    Uncollected COD parcels drain 15–25% of merchant profits. Screen phone numbers to flag repeat returners before spending ৳130 on return fees.
                  </p>
                </div>

                <div className="space-y-2.5 pt-1 text-xs text-zinc-700 dark:text-zinc-300">
                  <div className="flex items-start space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>0–100% delivery confidence rating before parcel dispatch</span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Advance delivery charge alerts for high-risk customer orders</span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Row-level atomic SQL stock locks eliminate overselling during drops</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-white/[0.06] flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                <span>Profit Guarantee:</span>
                <span className="text-zinc-900 dark:text-white font-mono font-bold">0% Order Commission</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. How It Works (Minimalist Schematic Workflow) ───────────────── */}
      <section id="how-it-works" className="relative min-h-0 lg:min-h-[calc(100vh-4rem)] flex flex-col justify-center py-16 sm:py-20 lg:py-16 border-b border-zinc-200/80 dark:border-white/[0.06] scroll-mt-16 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-14 w-full my-auto">
          <div className="text-center max-w-2xl mx-auto space-y-2.5 sm:space-y-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-500">
              Onboarding Velocity
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-zinc-950 dark:text-white tracking-tight leading-tight">
              Three Simple Steps to Go Live
            </h2>
            <p className="text-xs sm:text-sm lg:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              No developer hiring, no complex agency retainers, and zero plugin maintenance. Launch your online store in under 3 minutes.
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8 lg:gap-12">
            {/* Architectural Connecting Guide Line */}
            <div className="hidden md:block absolute top-8 left-[16.6%] right-[16.6%] h-[1px] border-t border-dashed border-zinc-300 dark:border-zinc-800 pointer-events-none" />

            {/* Step 01 */}
            <div className="relative pl-20 md:pl-0 space-y-3 md:space-y-5 text-left group">
              <div className="absolute left-0 top-0 md:relative z-10 w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-white/10 text-zinc-900 dark:text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform flex-shrink-0">
                <Store className="w-6 h-6 md:w-7 md:h-7 text-zinc-900 dark:text-white" />
                <span className="absolute -top-2 -right-2 md:-top-2.5 md:-right-2.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm">
                  01
                </span>
              </div>
              <div className="space-y-1.5 md:space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-bold block">
                  Step 01 • Template Setup
                </span>
                <h3 className="text-lg md:text-xl font-bold text-zinc-950 dark:text-white tracking-tight">
                  Select Your Storefront
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Choose from 6 bespoke category storefronts (Fashion, Cosmetics, Tech, Food, Jewelry, Shoes) pre-configured with industry conversion features.
                </p>
              </div>
              <div className="pt-1 md:pt-2 space-y-1.5 md:space-y-2">
                <div className="flex items-center space-x-2 text-xs text-zinc-700 dark:text-zinc-300">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>6 Pre-configured commerce verticals</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-zinc-700 dark:text-zinc-300">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>Ready to deploy in &lt; 60 seconds</span>
                </div>
              </div>
            </div>

            {/* Step 02 */}
            <div className="relative pl-20 md:pl-0 space-y-3 md:space-y-5 text-left group">
              <div className="absolute left-0 top-0 md:relative z-10 w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-white/10 text-zinc-900 dark:text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform flex-shrink-0">
                <Truck className="w-6 h-6 md:w-7 md:h-7 text-zinc-900 dark:text-white" />
                <span className="absolute -top-2 -right-2 md:-top-2.5 md:-right-2.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm">
                  02
                </span>
              </div>
              <div className="space-y-1.5 md:space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-bold block">
                  Step 02 • Local Integrations
                </span>
                <h3 className="text-lg md:text-xl font-bold text-zinc-950 dark:text-white tracking-tight">
                  Connect Courier & Payments
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Link Steadfast or Pathao API keys alongside bKash & Nagad merchant accounts. 64-district delivery rates activate automatically.
                </p>
              </div>
              <div className="pt-1 md:pt-2 space-y-1.5 md:space-y-2">
                <div className="flex items-center space-x-2 text-xs text-zinc-700 dark:text-zinc-300">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>Steadfast & Pathao 1-click sync</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-zinc-700 dark:text-zinc-300">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>Automated ৳60 / ৳130 district rates</span>
                </div>
              </div>
            </div>

            {/* Step 03 */}
            <div className="relative pl-20 md:pl-0 space-y-3 md:space-y-5 text-left group">
              <div className="absolute left-0 top-0 md:relative z-10 w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-white/10 text-zinc-900 dark:text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform flex-shrink-0">
                <Rocket className="w-6 h-6 md:w-7 md:h-7 text-zinc-900 dark:text-white" />
                <span className="absolute -top-2 -right-2 md:-top-2.5 md:-right-2.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm">
                  03
                </span>
              </div>
              <div className="space-y-1.5 md:space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-bold block">
                  Step 03 • High-Speed Selling
                </span>
                <h3 className="text-lg md:text-xl font-bold text-zinc-950 dark:text-white tracking-tight">
                  Launch & Collect Orders
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Capture mobile shoppers with 20-second 1-page checkout. Print 4x6 thermal barcode labels with 1 click and keep 100% of sales.
                </p>
              </div>
              <div className="pt-1 md:pt-2 space-y-1.5 md:space-y-2">
                <div className="flex items-center space-x-2 text-xs text-zinc-700 dark:text-zinc-300">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>20-Second friction-free checkout</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-zinc-700 dark:text-zinc-300">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>0% physical order commission</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. Bespoke Turnkey Storefronts (Studio Frame) ───────────────────── */}
      <section id="storefronts" className="relative min-h-0 lg:min-h-[calc(100vh-4rem)] flex flex-col justify-center py-16 sm:py-20 lg:py-16 border-b border-zinc-200/80 dark:border-white/[0.06] scroll-mt-16 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10 w-full my-auto">
          <div className="text-center max-w-2xl mx-auto space-y-2.5 sm:space-y-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-500">
              Turnkey Storefront Architectures
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-zinc-950 dark:text-white tracking-tight leading-tight">
              6 Tailored Industry Storefronts
            </h2>
            <p className="text-xs sm:text-sm lg:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Every vertical requires tailored customer psychology. Select an industry to preview its pre-configured store architecture.
            </p>
          </div>

          {/* Unified Minimalist Category Selector Tabs */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {INDUSTRY_STOREFRONTS.map((store) => {
              const isSelected = selectedStoreSlug === store.slug;
              return (
                <button
                  key={store.slug}
                  onClick={() => setSelectedStoreSlug(store.slug)}
                  className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-sm font-bold scale-105"
                      : "bg-white dark:bg-zinc-900/60 border border-zinc-200/90 dark:border-white/[0.06] text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  }`}
                >
                  {store.category}
                </button>
              );
            })}
          </div>

          {/* Featured Store Showcase: Clean Studio Frame */}
          <div className="luxury-card-light dark:luxury-card-dark rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Left: High-Res Visual Preview */}
            <div className="lg:col-span-7 relative min-h-[260px] sm:min-h-[340px] lg:min-h-[440px] bg-zinc-950 overflow-hidden group">
              <img
                src={activeStore.image}
                alt={activeStore.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-zinc-950/20 to-transparent pointer-events-none" />
              <div className="absolute top-4 sm:top-5 left-4 sm:left-5 bg-zinc-950/85 backdrop-blur-md text-white text-[11px] font-bold px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg">
                {activeStore.template} • {activeStore.category}
              </div>
              <div className="absolute bottom-4 sm:bottom-5 left-4 sm:left-5 right-4 sm:right-5 text-left hidden sm:block">
                <p className="text-base font-bold text-white drop-shadow-md">{activeStore.name}</p>
                <p className="text-xs text-zinc-300 drop-shadow line-clamp-1">{activeStore.headline}</p>
              </div>
            </div>

            {/* Right: Technical Features & Actions */}
            <div className="lg:col-span-5 p-6 sm:p-7 lg:p-8 flex flex-col justify-between space-y-6 bg-zinc-50/40 dark:bg-zinc-950/60 border-t lg:border-t-0 lg:border-l border-zinc-200/80 dark:border-white/[0.06]">
              <div className="space-y-4 sm:space-y-5">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">
                    Pre-Configured Architecture
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white tracking-tight mt-1">
                    {activeStore.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mt-2">
                    {activeStore.description}
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-zinc-200/80 dark:border-white/[0.06]">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                    Industry Capabilities Included:
                  </span>
                  {activeStore.highlights.map((feat, idx) => (
                    <div key={idx} className="flex items-center space-x-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 border border-emerald-500/20">
                        <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span className="font-medium">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-zinc-200/80 dark:border-white/[0.06]">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <Link
                    href={`/store/${activeStore.slug}`}
                    className="flex-1 py-3 px-4 bg-zinc-950 hover:bg-black text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 font-bold text-xs rounded-xl transition text-center flex items-center justify-center space-x-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.1)] btn-press"
                  >
                    <span>Open Live Storefront</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/onboarding?category=${activeStore.categoryParam}`}
                    className="py-3 px-5 bg-white hover:bg-zinc-50 border border-zinc-200/90 text-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:border-white/10 dark:text-zinc-300 dark:hover:text-white font-semibold text-xs rounded-xl transition text-center shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                  >
                    <span>Clone Template</span>
                  </Link>
                </div>
                <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 px-1">
                  <span>Commission: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">0%</strong></span>
                  <span>Setup: <strong className="text-zinc-950 dark:text-white">3 Minutes</strong></span>
                  <span>Mobile: <strong className="text-zinc-950 dark:text-white">100% Ready</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. Transparent Pricing (Hardware Tier Insets) ──────────────────── */}
      <section id="pricing" className="relative min-h-0 lg:min-h-[calc(100vh-4rem)] flex flex-col justify-center py-16 sm:py-20 lg:py-16 border-b border-zinc-200/80 dark:border-white/[0.06] scroll-mt-16 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10 w-full my-auto">
          <div className="text-center max-w-xl mx-auto space-y-2.5 sm:space-y-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-500">
              Transparent Pricing Plans
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-zinc-950 dark:text-white tracking-tight leading-tight">
              Simple, Predictable Pricing
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
              Zero commission on physical orders. Keep 100% of your retail margin.
            </p>

            {/* Billing Cadence Toggle */}
            <div className="pt-2 sm:pt-3 flex items-center justify-center">
              <div className="p-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/90 dark:border-white/10 flex items-center space-x-1 text-xs">
                <button
                  type="button"
                  onClick={() => setPricingBilling("monthly")}
                  className={`px-4 py-1.5 rounded-full transition font-semibold ${
                    pricingBilling === "monthly"
                      ? "bg-white text-zinc-950 shadow-sm"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                  }`}
                >
                  Monthly Billing
                </button>
                <button
                  type="button"
                  onClick={() => setPricingBilling("annual")}
                  className={`px-4 py-1.5 rounded-full transition font-semibold flex items-center space-x-1.5 ${
                    pricingBilling === "annual"
                      ? "bg-white text-zinc-950 shadow-sm"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                  }`}
                >
                  <span>Annual Billing</span>
                  <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    Save 20%
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch pt-2">
            {/* Starter Plan */}
            <div className="luxury-card-light dark:luxury-card-dark rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-zinc-950 dark:text-white">Starter</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">For new brands launching online</p>
                </div>
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-3xl sm:text-4xl font-extrabold text-zinc-950 dark:text-white">
                    {pricingBilling === "monthly" ? "৳599" : "৳479"}
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">/month</span>
                  {pricingBilling === "annual" && (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono ml-1">billed annually</span>
                  )}
                </div>
                <ul className="space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300 pt-3 border-t border-zinc-200/80 dark:border-white/[0.08]">
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" /><span>Up to 500 products</span></li>
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" /><span>20s 1-Page Express Checkout</span></li>
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" /><span>Steadfast & Pathao courier booking</span></li>
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" /><span>0% physical order commission</span></li>
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" /><span>Free StoreSwift subdomain with SSL</span></li>
                </ul>
              </div>
              <Link href="/onboarding?plan=starter" className="mt-6 w-full py-3 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200/90 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:border-white/10 text-zinc-900 dark:text-white font-bold text-xs rounded-xl transition text-center btn-press">
                Start 14-Day Free Trial
              </Link>
            </div>

            {/* Growth Plan (Popular - Titanium Ring Elevation) */}
            <div className="luxury-card-light dark:luxury-card-dark ring-2 ring-zinc-950 dark:ring-white/30 rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative shadow-lg">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-[10px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm">
                Most Popular
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-zinc-950 dark:text-white">Growth</h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1">For scaling direct & social commerce brands</p>
                </div>
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-3xl sm:text-4xl font-extrabold text-zinc-950 dark:text-white">
                    {pricingBilling === "monthly" ? "৳1,099" : "৳879"}
                  </span>
                  <span className="text-xs text-zinc-600 dark:text-zinc-300 font-medium">/month</span>
                  {pricingBilling === "annual" && (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono ml-1">billed annually</span>
                  )}
                </div>
                <ul className="space-y-2.5 text-xs text-zinc-700 dark:text-zinc-200 pt-3 border-t border-zinc-200/80 dark:border-white/10">
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" /><span>Up to 2,000 products</span></li>
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" /><span>Custom domain with automated SSL</span></li>
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" /><span>Anti-Fraud RTO Risk Shield</span></li>
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" /><span>Meta Pixel, TikTok & GTM CAPI</span></li>
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" /><span>Unlimited courier API bookings</span></li>
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" /><span>Priority customer support</span></li>
                </ul>
              </div>
              <Link href="/onboarding?plan=growth" className="mt-6 w-full py-3 bg-zinc-950 hover:bg-black text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 font-bold text-xs rounded-xl transition text-center shadow-[0_1px_3px_rgba(0,0,0,0.1)] btn-press">
                Start 14-Day Free Trial
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="luxury-card-light dark:luxury-card-dark rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-zinc-950 dark:text-white">Pro Enterprise</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">For high-volume multi-channel stores</p>
                </div>
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-3xl sm:text-4xl font-extrabold text-zinc-950 dark:text-white">
                    {pricingBilling === "monthly" ? "৳2,499" : "৳1,999"}
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">/month</span>
                  {pricingBilling === "annual" && (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono ml-1">billed annually</span>
                  )}
                </div>
                <ul className="space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300 pt-3 border-t border-zinc-200/80 dark:border-white/[0.08]">
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" /><span>Unlimited products & orders</span></li>
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" /><span>Wholesale Orders & Invoicing</span></li>
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" /><span>Dedicated 24/7 account manager</span></li>
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" /><span>Global CDN & sub-second response</span></li>
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" /><span>Custom courier API credentials</span></li>
                </ul>
              </div>
              <Link href="/onboarding?plan=pro" className="mt-6 w-full py-3 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200/90 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:border-white/10 text-zinc-900 dark:text-white font-bold text-xs rounded-xl transition text-center btn-press">
                Start 14-Day Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 8. Frequently Asked Questions (FAQ) ────────────────────────────── */}
      <section id="faq" className="relative min-h-0 lg:min-h-[calc(100vh-4rem)] flex flex-col justify-center py-16 sm:py-20 lg:py-16 border-b border-zinc-200/80 dark:border-white/[0.06] scroll-mt-16 transition-colors">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10 w-full my-auto">
          <div className="text-center max-w-xl mx-auto space-y-2.5 sm:space-y-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-500">
              Questions & Answers
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-zinc-950 dark:text-white tracking-tight leading-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
              Everything you need to know about setting up and operating your store.
            </p>
          </div>

          <div className="luxury-card-light dark:luxury-card-dark rounded-3xl p-5 sm:p-8 divide-y divide-zinc-200 dark:divide-white/[0.08]">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div key={index} className="py-3.5 first:pt-0 last:pb-0">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between text-left focus:outline-none group"
                  >
                    <span className="font-bold text-sm text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-zinc-400 dark:text-zinc-500 transition-transform duration-200 ${
                        isOpen ? "transform rotate-180 text-zinc-950 dark:text-white" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <p className="mt-2.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
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
      <section className="relative min-h-0 lg:min-h-[75vh] flex flex-col justify-center py-16 sm:py-20 lg:py-20 border-b border-zinc-200/80 dark:border-white/[0.06] transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
          <div className="luxury-card-light dark:luxury-card-dark rounded-3xl p-8 sm:p-14 text-center space-y-6 relative overflow-hidden">
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight relative leading-tight text-zinc-950 dark:text-white">
              Ready to launch your store?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed relative">
              Start selling in minutes with pre-configured logistics, localized payments, and industry-tailored storefronts.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5 relative">
              <Link
                href="/onboarding"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 text-xs font-bold bg-zinc-950 hover:bg-black text-white dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 px-7 py-3.5 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_12px_rgba(255,255,255,0.15)] transition btn-press"
              >
                <span>Start 14-Day Free Trial</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/admin?store=apex-fashion"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 text-xs font-semibold bg-white hover:bg-zinc-50 border border-zinc-200/90 text-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:border-white/[0.08] dark:text-zinc-200 px-6 py-3.5 rounded-xl transition shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
              >
                <span>Explore Demo Admin</span>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 10. Platform Directory Footer ──────────────────────────────────── */}
      <PlatformFooter />
    </div>
  );
}
