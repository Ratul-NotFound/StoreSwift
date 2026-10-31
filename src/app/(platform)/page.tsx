"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronUp,
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
  Barcode,
  Sparkles,
  CreditCard,
  CheckCircle2,
  Package,
  BarChart3,
  Clock,
  Radio,
  Sliders,
  Cpu,
  FileText,
  RefreshCw,
  TrendingUp,
  HelpCircle,
  Users,
  Flame,
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
  const [heroDeliveryZone, setHeroDeliveryZone] = useState<"dhaka" | "nationwide">("dhaka");
  const [heroPaymentMethod, setHeroPaymentMethod] = useState<"bkash" | "nagad" | "cod">("bkash");
  const [pricingBilling, setPricingBilling] = useState<"monthly" | "annual">("monthly");
  const [showFeatureComparison, setShowFeatureComparison] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isNavDropdownOpen, setIsNavDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeStore = INDUSTRY_STOREFRONTS.find((s) => s.slug === selectedStoreSlug) || INDUSTRY_STOREFRONTS[0];

  const faqs = [
    {
      q: "How does StoreSwift compare to traditional platforms like Shopify or WooCommerce?",
      a: "StoreSwift is purpose-built for high-conversion direct commerce in South Asia and global direct-to-consumer markets. Unlike generic builders requiring dozens of third-party plugins and expensive monthly subscriptions, StoreSwift natively includes 20-second 1-page checkout, automated courier dispatch with Steadfast and Pathao, printable 4x6 thermal barcode labels, and an Anti-Fraud RTO Shield out of the box."
    },
    {
      q: "How does StoreSwift compare to Zatiq Easy?",
      a: "While Zatiq Easy offers basic social shop tools and charges up to 5% per order on their free plan with additional processing deductions, StoreSwift guarantees 0% commission on physical orders across all plans. Furthermore, StoreSwift provides 6 deep-vertical category architectures, 20-second 1-page checkout, atomic SQL inventory reservation locks, native 4x6 thermal barcode labels, and an AI Anti-Fraud RTO Shield."
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
          <nav className="hidden lg:flex items-center space-x-7 text-xs font-semibold text-zinc-400">
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
            <a href="#engines" className="hover:text-white transition">Architecture</a>
            <a href="#steps" className="hover:text-white transition">3-Step Launch</a>
            <a href="#comparison" className="hover:text-white transition">Why StoreSwift</a>
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
              <a href="#engines" onClick={() => setIsMobileMenuOpen(false)} className="block px-2 py-1.5 rounded-lg hover:bg-white/5">Architecture</a>
              <a href="#steps" onClick={() => setIsMobileMenuOpen(false)} className="block px-2 py-1.5 rounded-lg hover:bg-white/5">3-Step Launch</a>
              <a href="#comparison" onClick={() => setIsMobileMenuOpen(false)} className="block px-2 py-1.5 rounded-lg hover:bg-white/5">Why StoreSwift vs Zatiq</a>
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

      {/* ─── 2. Hero Section: Obsidian Luxury Cockpit ───────────────────────── */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32 border-b border-white/[0.08]">
        {/* Subtle Ambient Radial Spotlight */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[520px] bg-gradient-to-b from-blue-600/15 via-indigo-600/8 to-transparent blur-[140px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-7">
          {/* Status Capsule Badge */}
          <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.1] text-zinc-300 text-xs font-medium backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
            <span className="font-semibold text-white">StoreSwift 2.0</span>
            <span className="text-zinc-600">•</span>
            <span>Commerce Operating System for Direct Brands</span>
          </div>

          {/* Master Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.035em] text-white max-w-4xl mx-auto leading-[1.08]">
            The commerce operating system <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-400">
              engineered for high-velocity brands.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed font-normal">
            Turnkey category storefronts, 20-second 1-page checkout, automated Steadfast & Pathao courier dispatch, and predictive fraud defense — zero transaction fees.
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

          {/* ─── Hero Centerpiece: Software Operating Cockpit ───────── */}
          <div className="pt-8 max-w-5xl mx-auto">
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
                  <span className="text-[9px] bg-emerald-950/90 text-emerald-400 font-bold px-1.5 py-0.5 rounded border border-emerald-800/60">LIVE ENGINE</span>
                </div>

                <div className="flex items-center space-x-2 text-zinc-400 text-[11px] font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
                  <span className="hidden sm:inline">Edge Sub-100ms</span>
                </div>
              </div>

              {/* Cockpit Interior: Dual-Pane Live Engine */}
              <div className="p-4 sm:p-6 lg:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Pane 1: Live 1-Page Express Checkout Simulator */}
                <div className="lg:col-span-7 bg-zinc-950/80 rounded-2xl border border-white/[0.08] p-5 sm:p-6 space-y-4 text-left relative overflow-hidden shadow-xl">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.8)]" />
                      <span className="text-xs font-bold text-white tracking-tight">1-Page Express Checkout Engine</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400 bg-white/[0.05] px-2 py-0.5 rounded border border-white/10">
                      20s Flow
                    </span>
                  </div>

                  {/* Product Snapshot */}
                  <div className="flex items-center space-x-3.5 bg-white/[0.02] p-3 rounded-xl border border-white/[0.05]">
                    <div className="w-12 h-12 rounded-lg bg-zinc-800 overflow-hidden flex-shrink-0 relative">
                      <img
                        src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&auto=format&fit=crop&q=80"
                        alt="Merino Wool Tailored Blazer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white truncate">Apex Tailored Merino Blazer</h4>
                        <span className="text-xs font-bold font-mono text-white">৳3,450</span>
                      </div>
                      <div className="flex items-center space-x-2 text-[10px] text-zinc-400 mt-0.5">
                        <span>Size: 40R / Charcoal</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-medium">14 in stock (Dhaka Hub)</span>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Delivery Zone Selector */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                      <span>Delivery Zone (64 Districts)</span>
                      <span className="text-blue-400 lowercase font-normal">tap to test rates</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setHeroDeliveryZone("dhaka")}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          heroDeliveryZone === "dhaka"
                            ? "bg-blue-600/15 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                            : "bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:border-white/10"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold">Inside Dhaka</span>
                          <span className="text-xs font-mono font-bold text-emerald-400">৳60</span>
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-0.5">Next-Day Doorstep Courier</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setHeroDeliveryZone("nationwide")}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          heroDeliveryZone === "nationwide"
                            ? "bg-blue-600/15 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                            : "bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:border-white/10"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold">All Bangladesh</span>
                          <span className="text-xs font-mono font-bold text-emerald-400">৳130</span>
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-0.5">48–72h Steadfast / Pathao</p>
                      </button>
                    </div>
                  </div>

                  {/* Payment Selector */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                      Payment & Verification
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setHeroPaymentMethod("bkash")}
                        className={`py-2 px-1.5 rounded-xl border text-center transition-all ${
                          heroPaymentMethod === "bkash"
                            ? "bg-pink-950/40 border-[#E2136E] text-white shadow-[0_0_12px_rgba(226,19,110,0.2)]"
                            : "bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:border-white/10"
                        }`}
                      >
                        <span className="text-xs font-bold text-[#E2136E] block">bKash</span>
                        <span className="text-[9px] text-zinc-400">1-Tap Direct</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setHeroPaymentMethod("nagad")}
                        className={`py-2 px-1.5 rounded-xl border text-center transition-all ${
                          heroPaymentMethod === "nagad"
                            ? "bg-amber-950/40 border-[#F7931E] text-white shadow-[0_0_12px_rgba(247,147,30,0.2)]"
                            : "bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:border-white/10"
                        }`}
                      >
                        <span className="text-xs font-bold text-[#F7931E] block">Nagad</span>
                        <span className="text-[9px] text-zinc-400">Instant Pay</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setHeroPaymentMethod("cod")}
                        className={`py-2 px-1.5 rounded-xl border text-center transition-all ${
                          heroPaymentMethod === "cod"
                            ? "bg-emerald-950/40 border-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                            : "bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:border-white/10"
                        }`}
                      >
                        <span className="text-xs font-bold text-emerald-400 block">Cash on Delivery</span>
                        <span className="text-[9px] text-zinc-400">Doorstep Check</span>
                      </button>
                    </div>
                  </div>

                  {/* Live Total & CTA */}
                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-zinc-400">Subtotal ({heroDeliveryZone === "dhaka" ? "৳60" : "৳130"} courier)</p>
                      <p className="text-base font-black text-white font-mono">
                        ৳{(3450 + (heroDeliveryZone === "dhaka" ? 60 : 130)).toLocaleString()}
                      </p>
                    </div>
                    <Link
                      href={`/store/${activeStore.slug}`}
                      className="py-2.5 px-4 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs shadow-[0_0_20px_rgba(255,255,255,0.25)] flex items-center space-x-1.5 transition btn-press"
                    >
                      <span>Test Live Store</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Pane 2: Autonomous Merchant Mission Control */}
                <div className="lg:col-span-5 bg-zinc-950/80 rounded-2xl border border-white/[0.08] p-5 sm:p-6 space-y-4 text-left flex flex-col justify-between shadow-xl">
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                        <span className="text-xs font-bold text-white tracking-tight">Merchant Telemetry</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                        Steadfast API Live
                      </span>
                    </div>

                    {/* Revenue Telemetry Snapshot */}
                    <div className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.05] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase text-zinc-400">Today's Settled Revenue</span>
                        <span className="text-[10px] font-bold text-emerald-400">+28.4% vs avg</span>
                      </div>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-2xl font-black text-white font-mono">৳148,200</span>
                        <span className="text-[11px] text-zinc-400">46 orders • 4.8% CVR</span>
                      </div>
                    </div>

                    {/* Live Order Card with Barcode */}
                    <div className="bg-white/[0.02] p-3.5 rounded-xl border border-white/[0.05] space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-mono text-zinc-400 block">LATEST DISPATCH // #SW-8942</span>
                          <p className="text-xs font-bold text-white">Tanvir Ahmed • Dhanmondi, Dhaka</p>
                        </div>
                        <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                          98.6% Safe Buyer
                        </span>
                      </div>

                      {/* Courier Label Preview */}
                      <div className="bg-zinc-900/90 p-2.5 rounded-lg border border-white/[0.08] flex items-center justify-between text-[11px]">
                        <div>
                          <p className="text-[10px] font-mono text-zinc-400">Steadfast Consignment</p>
                          <p className="font-mono font-bold text-white">#SF-948201-DH</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="font-mono text-[9px] tracking-widest text-zinc-400">|||| | ||||| |||</span>
                          <span className="text-[9px] text-emerald-400 font-medium">4x6 Thermal Ready</span>
                        </div>
                      </div>

                      {/* Profit Margin Telemetry */}
                      <div className="flex items-center justify-between text-[10px] pt-1 text-zinc-400 border-t border-white/[0.04]">
                        <span>Platform Fee: <strong className="text-emerald-400">৳0 (0%)</strong></span>
                        <span>Merchant Net: <strong className="text-white">৳1,290 (37%)</strong></span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/admin?store=apex-fashion"
                    className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-white/10 font-bold text-xs flex items-center justify-center space-x-1.5 transition"
                  >
                    <span>Open Full Merchant Admin</span>
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. Logistics, Payment & Infrastructure Ecosystem Dock ───────────── */}
      <section className="py-6 bg-zinc-950 border-b border-white/[0.06] overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6 whitespace-nowrap min-w-max text-xs text-zinc-400">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">
            Official Ecosystem:
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
              <strong className="text-white font-semibold">Meta & TikTok</strong> CAPI
            </span>
            <span className="text-zinc-700">•</span>
            <span className="flex items-center space-x-2 text-zinc-300">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              <strong className="text-white font-semibold">PostgreSQL</strong> Atomic Locks
            </span>
          </div>
        </div>
      </section>

      {/* ─── 4. High-Precision Engineering Telemetry Bar ────────────────────── */}
      <section className="py-12 bg-zinc-950/70 border-b border-white/[0.08]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.08]">
            <div className="pt-4 sm:pt-0 sm:px-4 text-center sm:text-left space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">TELEMETRY // 01</span>
              <span className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">&lt; 20s</span>
              <p className="text-xs text-zinc-400 font-medium">1-Page Checkout Speed</p>
              <p className="text-[11px] text-zinc-500">Eliminates multi-step cart drop-offs</p>
            </div>
            <div className="pt-4 sm:pt-0 sm:px-4 text-center sm:text-left space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">TELEMETRY // 02</span>
              <span className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">+42.8%</span>
              <p className="text-xs text-zinc-400 font-medium">Conversion Rate Lift</p>
              <p className="text-[11px] text-zinc-500">Optimized for social & direct traffic</p>
            </div>
            <div className="pt-4 sm:pt-0 sm:px-4 text-center sm:text-left space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">TELEMETRY // 03</span>
              <span className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">64</span>
              <p className="text-xs text-zinc-400 font-medium">Districts Automated Delivery</p>
              <p className="text-[11px] text-zinc-500">Steadfast & Pathao 1-click booking</p>
            </div>
            <div className="pt-4 sm:pt-0 sm:px-4 text-center sm:text-left space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">TELEMETRY // 04</span>
              <span className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">0%</span>
              <p className="text-xs text-zinc-400 font-medium">Physical Order Commission</p>
              <p className="text-[11px] text-zinc-500">Keep 100% of your retail margin</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. "3 Simple Steps to Scale" Interactive Launch Architecture ────── */}
      <section id="steps" className="py-24 sm:py-28 bg-[#09090b] border-b border-white/[0.08] scroll-mt-16">
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
                <h3 className="text-lg font-bold text-white">Choose Your Industry Architecture</h3>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  Select from 6 bespoke category storefronts (Fashion, Cosmetics, Shoes, Tech, Jewelry, Coffee) configured with domain-specific features like GSM badges and routine builders.
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
      <section id="storefronts" className="py-24 sm:py-28 bg-zinc-950/70 border-b border-white/[0.08] scroll-mt-16">
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

          {/* Featured Store Showcase (Luxury Split Architecture Card) */}
          <div className="bg-zinc-900/60 backdrop-blur-xl rounded-3xl border border-white/[0.1] overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 items-stretch">
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

      {/* ─── 7. Core Platform Architecture (Interactive Engineering Blueprints) ─── */}
      <section id="engines" className="py-24 sm:py-28 bg-[#09090b] border-b border-white/[0.08] scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-500">
              Platform Engineering Architecture
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Four High-Performance Commerce Engines
            </h2>
            <p className="text-xs sm:text-base text-zinc-400 leading-relaxed">
              StoreSwift replaces disconnected, fragile plugins with an integrated, high-conversion operating layer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Engine 01: 1-Page Express Checkout */}
            <div className="p-8 sm:p-9 bg-zinc-900/50 backdrop-blur-xl rounded-3xl border border-white/[0.08] shadow-2xl space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-zinc-500 tracking-wider">01 / CHECKOUT ENGINE</span>
                  <span className="text-[10px] font-bold bg-blue-500/10 text-blue-400 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                    20-Second Flow
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white tracking-tight">
                  Single-Page Frictionless Order Capture
                </h3>

                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Traditional multi-step checkout carts abandon over 65% of mobile customers. StoreSwift compresses the checkout into a single high-conversion screen with automated 64-district delivery rates and 1-tap bKash/Nagad/COD.
                </p>

                {/* Embedded Architecture Visual Widget */}
                <div className="bg-zinc-950/90 rounded-2xl border border-white/[0.08] p-4 space-y-3 font-mono text-[11px]">
                  <div className="flex items-center justify-between text-zinc-400 pb-2 border-b border-white/[0.06]">
                    <span className="flex items-center space-x-1.5 text-zinc-300">
                      <Zap className="w-3.5 h-3.5 text-blue-400" />
                      <span>Pipeline: Order Stream</span>
                    </span>
                    <span className="text-emerald-400">3-Field Auto-Capture</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                    <div className="bg-white/[0.03] p-2 rounded-lg border border-white/5">
                      <p className="text-zinc-500">Dhaka Zone</p>
                      <p className="text-white font-bold">৳60 Tariff</p>
                    </div>
                    <div className="bg-white/[0.03] p-2 rounded-lg border border-white/5">
                      <p className="text-zinc-500">Nationwide</p>
                      <p className="text-white font-bold">৳130 Tariff</p>
                    </div>
                    <div className="bg-white/[0.03] p-2 rounded-lg border border-white/5">
                      <p className="text-zinc-500">Payment</p>
                      <p className="text-emerald-400 font-bold">bKash/COD</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1 text-[10px] text-zinc-400">
                    <span>Doorstep Open Parcel Inspection: <strong className="text-white">Guaranteed</strong></span>
                    <span className="text-blue-400 font-bold">Zero Plugins</span>
                  </div>
                </div>

                {/* Highlights */}
                <div className="space-y-2 text-xs text-zinc-300">
                  <div className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Automatic Inside Dhaka (৳60) / Nationwide (৳130) rates</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>English & Bengali (বাংলা) 1-tap customer interface toggle</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.08] flex flex-wrap gap-2 text-[11px] font-medium text-zinc-400">
                <span className="px-3 py-1 bg-white/[0.05] border border-white/10 rounded-lg">64-District Zones</span>
                <span className="px-3 py-1 bg-white/[0.05] border border-white/10 rounded-lg">bKash & Nagad MFS</span>
                <span className="px-3 py-1 bg-white/[0.05] border border-white/10 rounded-lg">Doorstep COD</span>
              </div>
            </div>

            {/* Engine 02: Automated Courier Dispatch */}
            <div className="p-8 sm:p-9 bg-zinc-900/50 backdrop-blur-xl rounded-3xl border border-white/[0.08] shadow-2xl space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-zinc-500 tracking-wider">02 / LOGISTICS ENGINE</span>
                  <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    Steadfast & Pathao
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white tracking-tight">
                  Automated Courier Dispatch & Labeling
                </h3>

                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Never copy-paste customer orders into courier portals again. When an order arrives, generate live consignment tracking IDs with a single click, print industry-standard 4x6 thermal barcode stickers, and sync live delivery webhooks.
                </p>

                {/* Embedded Architecture Visual Widget: 4x6 Label Mock */}
                <div className="bg-zinc-950/90 rounded-2xl border border-white/[0.08] p-4 space-y-3 font-mono text-[11px]">
                  <div className="flex items-center justify-between text-zinc-400 pb-2 border-b border-white/[0.06]">
                    <span className="flex items-center space-x-1.5 text-zinc-300">
                      <Truck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Steadfast API Webhook</span>
                    </span>
                    <span className="text-emerald-400">#SF-948201-DH</span>
                  </div>
                  <div className="bg-white/[0.03] p-2.5 rounded-lg border border-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-zinc-500">4x6 Thermal Barcode Label</p>
                      <p className="text-white font-bold text-xs">Tanvir A. • Dhaka Hub</p>
                      <p className="text-[10px] text-zinc-400">COD Collection: ৳3,510</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-xs tracking-widest text-zinc-300 block">|||| | ||||| |||</span>
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold">READY</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1 text-[10px] text-zinc-400">
                    <span>1-Click Consignment Booking: <strong className="text-white">Active</strong></span>
                    <span className="text-emerald-400 font-bold">Live Tracking</span>
                  </div>
                </div>

                {/* Highlights */}
                <div className="space-y-2 text-xs text-zinc-300">
                  <div className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>1-Click consignment creation directly from order admin</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Printable 4x6 thermal barcode shipping labels ready for pickup</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.08] flex flex-wrap gap-2 text-[11px] font-medium text-zinc-400">
                <span className="px-3 py-1 bg-white/[0.05] border border-white/10 rounded-lg">Steadfast API</span>
                <span className="px-3 py-1 bg-white/[0.05] border border-white/10 rounded-lg">Pathao Logistics</span>
                <span className="px-3 py-1 bg-white/[0.05] border border-white/10 rounded-lg">4x6 Barcode Export</span>
              </div>
            </div>

            {/* Engine 03: Anti-Fraud RTO Shield */}
            <div className="p-8 sm:p-9 bg-zinc-900/50 backdrop-blur-xl rounded-3xl border border-white/[0.08] shadow-2xl space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-zinc-500 tracking-wider">03 / MARGIN ENGINE</span>
                  <span className="text-[10px] font-bold bg-rose-500/10 text-rose-400 px-2.5 py-0.5 rounded-full border border-rose-500/20">
                    RTO Margin Shield
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white tracking-tight">
                  Predictive Anti-Fraud RTO Shield
                </h3>

                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  In social commerce, 15–25% of Cash on Delivery parcels are refused at the customer door, costing merchants steep return courier penalties. StoreSwift screens buyer numbers against nationwide delivery records, flagging serial returners before dispatch.
                </p>

                {/* Embedded Architecture Visual Widget: Fraud Meter */}
                <div className="bg-zinc-950/90 rounded-2xl border border-white/[0.08] p-4 space-y-3 font-mono text-[11px]">
                  <div className="flex items-center justify-between text-zinc-400 pb-2 border-b border-white/[0.06]">
                    <span className="flex items-center space-x-1.5 text-zinc-300">
                      <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                      <span>RTO Delivery Telemetry</span>
                    </span>
                    <span className="text-emerald-400">Low Risk (98.6%)</span>
                  </div>
                  <div className="bg-white/[0.03] p-2.5 rounded-lg border border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-zinc-400">Buyer Delivery Confidence</span>
                      <span className="text-emerald-400 font-bold">98.6% Safe</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full rounded-full w-[98.6%]" />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-zinc-500">
                      <span>24 Delivered</span>
                      <span>0 Returns</span>
                      <span className="text-emerald-400 font-medium">Auto-Approved</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1 text-[10px] text-zinc-400">
                    <span>Return Courier Penalty Avoided: <strong className="text-white">৳130 / parcel</strong></span>
                  </div>
                </div>

                {/* Highlights */}
                <div className="space-y-2 text-xs text-zinc-300">
                  <div className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Machine-scored delivery success rating (0–100%) per customer</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Automatic alerts to collect advance delivery fee on risky buyers</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.08] flex flex-wrap gap-2 text-[11px] font-medium text-zinc-400">
                <span className="px-3 py-1 bg-white/[0.05] border border-white/10 rounded-lg">Delivery Score</span>
                <span className="px-3 py-1 bg-white/[0.05] border border-white/10 rounded-lg">Returner Alerts</span>
                <span className="px-3 py-1 bg-white/[0.05] border border-white/10 rounded-lg">Margin Protection</span>
              </div>
            </div>

            {/* Engine 04: Multi-Variant Inventory Matrix */}
            <div className="p-8 sm:p-9 bg-zinc-900/50 backdrop-blur-xl rounded-3xl border border-white/[0.08] shadow-2xl space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-zinc-500 tracking-wider">04 / INVENTORY ENGINE</span>
                  <span className="text-[10px] font-bold bg-purple-500/10 text-purple-400 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                    Atomic Locks
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white tracking-tight">
                  Cartesian Multi-Variant Inventory Matrix
                </h3>

                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Generate multi-attribute product matrices (Size × Color × Material) with instant SKU generation. Backed by atomic SQL row-level inventory locks, completely eliminating overselling during high-traffic social media flash sales.
                </p>

                {/* Embedded Architecture Visual Widget: Cartesian Table */}
                <div className="bg-zinc-950/90 rounded-2xl border border-white/[0.08] p-4 space-y-2.5 font-mono text-[11px]">
                  <div className="flex items-center justify-between text-zinc-400 pb-2 border-b border-white/[0.06]">
                    <span className="flex items-center space-x-1.5 text-zinc-300">
                      <Layers className="w-3.5 h-3.5 text-purple-400" />
                      <span>Matrix: Size × Color</span>
                    </span>
                    <span className="text-purple-400">Atomic SQL Locks</span>
                  </div>
                  <div className="space-y-1 text-[10px]">
                    <div className="flex items-center justify-between p-1.5 rounded bg-white/[0.03]">
                      <span>APX-CH-M (Charcoal / M)</span>
                      <span className="text-white font-bold">28 units</span>
                      <span className="text-emerald-400">Locked</span>
                    </div>
                    <div className="flex items-center justify-between p-1.5 rounded bg-white/[0.03]">
                      <span>APX-CH-L (Charcoal / L)</span>
                      <span className="text-white font-bold">14 units</span>
                      <span className="text-amber-400">Low Stock</span>
                    </div>
                    <div className="flex items-center justify-between p-1.5 rounded bg-white/[0.03]">
                      <span>APX-NV-XL (Navy / XL)</span>
                      <span className="text-white font-bold">8 units</span>
                      <span className="text-emerald-400">Locked</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1 text-[10px] text-zinc-400">
                    <span>Overselling Risk: <strong className="text-emerald-400">0.00%</strong></span>
                    <span className="text-zinc-500">Instant SKU Generation</span>
                  </div>
                </div>

                {/* Highlights */}
                <div className="space-y-2 text-xs text-zinc-300">
                  <div className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Row-level SQL atomic stock reservation prevents overselling</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Automatic SKU code generation across multi-dimensional variations</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.08] flex flex-wrap gap-2 text-[11px] font-medium text-zinc-400">
                <span className="px-3 py-1 bg-white/[0.05] border border-white/10 rounded-lg">Cartesian Matrix</span>
                <span className="px-3 py-1 bg-white/[0.05] border border-white/10 rounded-lg">Atomic Stock Locks</span>
                <span className="px-3 py-1 bg-white/[0.05] border border-white/10 rounded-lg">Zero Overselling</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 8. Head-to-Head Comparison Matrix (StoreSwift vs Competitors) ───── */}
      <section id="comparison" className="py-24 sm:py-28 bg-zinc-950/70 border-b border-white/[0.08] scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-500">
              Benchmark Architecture
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Why Brands Choose StoreSwift
            </h2>
            <p className="text-xs sm:text-base text-zinc-400 leading-relaxed">
              See how StoreSwift compares directly against Zatiq Easy, bloated Shopify apps, and manual social inbox selling.
            </p>
          </div>

          {/* Comparison Table */}
          <div className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl border border-white/[0.08] overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.08] bg-zinc-950/80">
                    <th className="py-4 px-5 text-zinc-400 font-mono text-[11px] uppercase tracking-wider">Platform Capabilities</th>
                    <th className="py-4 px-5 bg-blue-600/15 border-x border-blue-500/30 text-white font-bold">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-sm">StoreSwift 2.0</span>
                      </div>
                    </th>
                    <th className="py-4 px-5 text-zinc-400 font-medium">Zatiq Easy</th>
                    <th className="py-4 px-5 text-zinc-400 font-medium">Shopify + 12 Plugins</th>
                    <th className="py-4 px-5 text-zinc-400 font-medium">Manual Facebook / Inbox</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06] text-zinc-300">
                  {/* Row 1 */}
                  <tr className="hover:bg-white/[0.02] transition">
                    <td className="py-4 px-5 font-semibold text-white">Physical Order Commission</td>
                    <td className="py-4 px-5 bg-blue-600/10 border-x border-blue-500/20 font-bold text-emerald-400">
                      0% Platform Cut
                    </td>
                    <td className="py-4 px-5 text-zinc-400">Up to 5% per order</td>
                    <td className="py-4 px-5 text-zinc-400">2.9% + 30¢ + plugin fees</td>
                    <td className="py-4 px-5 text-zinc-400">0% (but high manual labor)</td>
                  </tr>

                  {/* Row 2 */}
                  <tr className="hover:bg-white/[0.02] transition">
                    <td className="py-4 px-5 font-semibold text-white">Checkout Experience</td>
                    <td className="py-4 px-5 bg-blue-600/10 border-x border-blue-500/20 font-bold text-white">
                      20s 1-Page (Bangla & EN)
                    </td>
                    <td className="py-4 px-5 text-zinc-400">Standard multi-step cart</td>
                    <td className="py-4 px-5 text-zinc-400">Complex 3-step checkout</td>
                    <td className="py-4 px-5 text-zinc-400">Manual chat back-and-forth</td>
                  </tr>

                  {/* Row 3 */}
                  <tr className="hover:bg-white/[0.02] transition">
                    <td className="py-4 px-5 font-semibold text-white">Steadfast & Pathao Courier</td>
                    <td className="py-4 px-5 bg-blue-600/10 border-x border-blue-500/20 font-bold text-emerald-400">
                      1-Click Native API Sync
                    </td>
                    <td className="py-4 px-5 text-zinc-400">Basic 3rd-party integration</td>
                    <td className="py-4 px-5 text-zinc-400">Paid custom apps ($$$)</td>
                    <td className="py-4 px-5 text-zinc-400">Copy-pasting into portals</td>
                  </tr>

                  {/* Row 4 */}
                  <tr className="hover:bg-white/[0.02] transition">
                    <td className="py-4 px-5 font-semibold text-white">4x6 Thermal Barcode Labels</td>
                    <td className="py-4 px-5 bg-blue-600/10 border-x border-blue-500/20 font-bold text-white">
                      Auto-Generated from Stream
                    </td>
                    <td className="py-4 px-5 text-zinc-400">Standard receipt print</td>
                    <td className="py-4 px-5 text-zinc-400">Requires paid label app</td>
                    <td className="py-4 px-5 text-zinc-400">Manual handwritten stickers</td>
                  </tr>

                  {/* Row 5 */}
                  <tr className="hover:bg-white/[0.02] transition">
                    <td className="py-4 px-5 font-semibold text-white">RTO Fraud Return Defense</td>
                    <td className="py-4 px-5 bg-blue-600/10 border-x border-blue-500/20 font-bold text-emerald-400">
                      Predictive 0-100% Score
                    </td>
                    <td className="py-4 px-5 text-zinc-400">Basic IP blocking only</td>
                    <td className="py-4 px-5 text-zinc-400">Expensive enterprise app</td>
                    <td className="py-4 px-5 text-zinc-400">None (15-25% refused losses)</td>
                  </tr>

                  {/* Row 6 */}
                  <tr className="hover:bg-white/[0.02] transition">
                    <td className="py-4 px-5 font-semibold text-white">Vertical Tailored Architecture</td>
                    <td className="py-4 px-5 bg-blue-600/10 border-x border-blue-500/20 font-bold text-white">
                      6 Deep-Vertical Engines
                    </td>
                    <td className="py-4 px-5 text-zinc-400">Generic identical templates</td>
                    <td className="py-4 px-5 text-zinc-400">Generic boutique themes</td>
                    <td className="py-4 px-5 text-zinc-400">No storefront</td>
                  </tr>

                  {/* Row 7 */}
                  <tr className="hover:bg-white/[0.02] transition">
                    <td className="py-4 px-5 font-semibold text-white">Flash-Sale Overselling Safety</td>
                    <td className="py-4 px-5 bg-blue-600/10 border-x border-blue-500/20 font-bold text-emerald-400">
                      Atomic SQL Row Locks
                    </td>
                    <td className="py-4 px-5 text-zinc-400">Standard DB lock</td>
                    <td className="py-4 px-5 text-zinc-400">Standard inventory sync</td>
                    <td className="py-4 px-5 text-zinc-400">Constant double-booking</td>
                  </tr>

                  {/* Row 8 */}
                  <tr className="hover:bg-white/[0.02] transition">
                    <td className="py-4 px-5 font-semibold text-white">Setup & Go-Live Time</td>
                    <td className="py-4 px-5 bg-blue-600/10 border-x border-blue-500/20 font-bold text-white">
                      3 Minutes (Turnkey)
                    </td>
                    <td className="py-4 px-5 text-zinc-400">10–15 Minutes</td>
                    <td className="py-4 px-5 text-zinc-400">2–4 Weeks of agency setup</td>
                    <td className="py-4 px-5 text-zinc-400">Ongoing daily manual burden</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 9. Verified Merchant Success Stories (Social Proof) ─────────────── */}
      <section className="py-24 sm:py-28 bg-[#09090b] border-b border-white/[0.08]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-500">
              Verified Merchant Proof
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Scaling Brands, Zero Agency Fees
            </h2>
            <p className="text-xs sm:text-base text-zinc-400 leading-relaxed">
              Real high-velocity merchants migrating from fragmented setups to StoreSwift.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Story 1 */}
            <div className="p-8 rounded-3xl bg-zinc-900/40 border border-white/[0.08] backdrop-blur-xl flex flex-col justify-between space-y-6 shadow-2xl">
              <div className="space-y-4">
                <div className="flex items-center space-x-1 text-amber-400 text-sm">
                  {"★".repeat(5)}
                </div>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  "We migrated from Shopify where we were spending $180/month on separate apps for COD forms, Steadfast courier sync, and tracking. StoreSwift includes 20-second 1-page checkout, auto-printed thermal labels, and zero commission out of the box. Our mobile conversion jumped by 44%."
                </p>
              </div>
              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Farhan Chowdhury</h4>
                  <p className="text-[10px] text-zinc-400">Founder, Apex Lifestyle (Apparel)</p>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                  +44% CVR
                </span>
              </div>
            </div>

            {/* Story 2 */}
            <div className="p-8 rounded-3xl bg-zinc-900/40 border border-white/[0.08] backdrop-blur-xl flex flex-col justify-between space-y-6 shadow-2xl">
              <div className="space-y-4">
                <div className="flex items-center space-x-1 text-amber-400 text-sm">
                  {"★".repeat(5)}
                </div>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  "Our customers love the 3-step glass skin routine builder. But the absolute lifesaver is StoreSwift's Anti-Fraud RTO Shield. It flagged over 60 high-risk serial COD returners last month, saving our business over ৳7,800 in courier return fees."
                </p>
              </div>
              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Dr. Sabrina Karim</h4>
                  <p className="text-[10px] text-zinc-400">Co-Founder, Aura Skincare</p>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                  -38% Returns
                </span>
              </div>
            </div>

            {/* Story 3 */}
            <div className="p-8 rounded-3xl bg-zinc-900/40 border border-white/[0.08] backdrop-blur-xl flex flex-col justify-between space-y-6 shadow-2xl">
              <div className="space-y-4">
                <div className="flex items-center space-x-1 text-amber-400 text-sm">
                  {"★".repeat(5)}
                </div>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  "Our fulfillment crew used to waste 2 hours every evening manually copying customer addresses into courier dashboards and writing stickers with sharpies. With StoreSwift's 1-click Steadfast booking and 4x6 thermal barcode labels, dispatch is done in 10 minutes."
                </p>
              </div>
              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Tanvir Hossain</h4>
                  <p className="text-[10px] text-zinc-400">Head of Operations, Craft Bench Shoes</p>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                  2h Saved Daily
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 10. Transparent Pricing (Obsidian Luxury Columns) ────────────────── */}
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

          {/* Expandable Feature Matrix Toggle */}
          <div className="pt-6 text-center">
            <button
              type="button"
              onClick={() => setShowFeatureComparison(!showFeatureComparison)}
              className="inline-flex items-center space-x-2 text-xs font-semibold text-zinc-400 hover:text-white transition py-2 px-4 rounded-xl bg-zinc-900 border border-white/10"
            >
              <span>{showFeatureComparison ? "Hide Detailed Feature Matrix" : "Compare All 24 Platform Capabilities"}</span>
              {showFeatureComparison ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* Full Feature Comparison Table */}
          {showFeatureComparison && (
            <div className="mt-8 bg-zinc-900/60 backdrop-blur-xl rounded-3xl border border-white/[0.08] overflow-hidden shadow-2xl animate-fade-in">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/[0.08] bg-zinc-950/80 text-zinc-400 font-mono text-[11px]">
                      <th className="py-3.5 px-5">Capabilities</th>
                      <th className="py-3.5 px-5">Starter (৳599/mo)</th>
                      <th className="py-3.5 px-5 bg-blue-600/10 text-blue-400 font-bold">Growth (৳1,099/mo)</th>
                      <th className="py-3.5 px-5">Pro (৳2,499/mo)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.05] text-zinc-300">
                    <tr className="bg-white/[0.02]">
                      <td colSpan={4} className="py-2.5 px-5 font-mono text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                        Selling & Catalog
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-5">Product Limit</td>
                      <td className="py-3 px-5">500</td>
                      <td className="py-3 px-5 font-bold text-white bg-blue-600/5">2,000</td>
                      <td className="py-3 px-5 font-bold text-emerald-400">Unlimited</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-5">Physical Order Commission</td>
                      <td className="py-3 px-5 text-emerald-400 font-bold">0%</td>
                      <td className="py-3 px-5 text-emerald-400 font-bold bg-blue-600/5">0%</td>
                      <td className="py-3 px-5 text-emerald-400 font-bold">0%</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-5">20-Second 1-Page Checkout</td>
                      <td className="py-3 px-5 text-emerald-400 font-bold">Included</td>
                      <td className="py-3 px-5 text-emerald-400 font-bold bg-blue-600/5">Included</td>
                      <td className="py-3 px-5 text-emerald-400 font-bold">Included</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-5">Bilingual বাংলা / English Toggle</td>
                      <td className="py-3 px-5 text-emerald-400 font-bold">Included</td>
                      <td className="py-3 px-5 text-emerald-400 font-bold bg-blue-600/5">Included</td>
                      <td className="py-3 px-5 text-emerald-400 font-bold">Included</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-5">Cartesian Multi-Variant Matrix</td>
                      <td className="py-3 px-5 text-emerald-400 font-bold">Included</td>
                      <td className="py-3 px-5 text-emerald-400 font-bold bg-blue-600/5">Included</td>
                      <td className="py-3 px-5 text-emerald-400 font-bold">Included</td>
                    </tr>

                    <tr className="bg-white/[0.02]">
                      <td colSpan={4} className="py-2.5 px-5 font-mono text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                        Logistics & Courier
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-5">Steadfast & Pathao 1-Click Booking</td>
                      <td className="py-3 px-5 text-emerald-400 font-bold">Included</td>
                      <td className="py-3 px-5 text-emerald-400 font-bold bg-blue-600/5">Included</td>
                      <td className="py-3 px-5 text-emerald-400 font-bold">Included</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-5">Printable 4x6 Thermal Barcodes</td>
                      <td className="py-3 px-5 text-emerald-400 font-bold">Included</td>
                      <td className="py-3 px-5 text-emerald-400 font-bold bg-blue-600/5">Included</td>
                      <td className="py-3 px-5 text-emerald-400 font-bold">Included</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-5">64-District Auto Zone Tariffs</td>
                      <td className="py-3 px-5 text-emerald-400 font-bold">Included</td>
                      <td className="py-3 px-5 text-emerald-400 font-bold bg-blue-600/5">Included</td>
                      <td className="py-3 px-5 text-emerald-400 font-bold">Included</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-5">Custom Courier API Credentials</td>
                      <td className="py-3 px-5 text-zinc-500">—</td>
                      <td className="py-3 px-5 text-zinc-500 bg-blue-600/5">—</td>
                      <td className="py-3 px-5 text-emerald-400 font-bold">Included</td>
                    </tr>

                    <tr className="bg-white/[0.02]">
                      <td colSpan={4} className="py-2.5 px-5 font-mono text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                        Fraud Defense & Security
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-5">Anti-Fraud RTO Shield</td>
                      <td className="py-3 px-5 text-zinc-400">Basic Flagging</td>
                      <td className="py-3 px-5 text-emerald-400 font-bold bg-blue-600/5">Predictive 0-100% Score</td>
                      <td className="py-3 px-5 text-emerald-400 font-bold">Predictive + Custom Rules</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-5">Custom Domain with Automated SSL</td>
                      <td className="py-3 px-5 text-zinc-500">—</td>
                      <td className="py-3 px-5 text-emerald-400 font-bold bg-blue-600/5">Included</td>
                      <td className="py-3 px-5 text-emerald-400 font-bold">Included</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-5">Atomic SQL Stock Reservation Locks</td>
                      <td className="py-3 px-5 text-emerald-400 font-bold">Included</td>
                      <td className="py-3 px-5 text-emerald-400 font-bold bg-blue-600/5">Included</td>
                      <td className="py-3 px-5 text-emerald-400 font-bold">Included</td>
                    </tr>

                    <tr className="bg-white/[0.02]">
                      <td colSpan={4} className="py-2.5 px-5 font-mono text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                        Growth & Multi-Channel
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-5">Meta Pixel, TikTok & GTM CAPI</td>
                      <td className="py-3 px-5 text-zinc-500">—</td>
                      <td className="py-3 px-5 text-emerald-400 font-bold bg-blue-600/5">Included</td>
                      <td className="py-3 px-5 text-emerald-400 font-bold">Included</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-5">B2B Wholesale Orders & Invoicing</td>
                      <td className="py-3 px-5 text-zinc-500">—</td>
                      <td className="py-3 px-5 text-zinc-500 bg-blue-600/5">—</td>
                      <td className="py-3 px-5 text-emerald-400 font-bold">Included</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-5">Merchant Support Channel</td>
                      <td className="py-3 px-5 text-zinc-300">Standard Email</td>
                      <td className="py-3 px-5 text-white font-bold bg-blue-600/5">Priority WhatsApp / Email</td>
                      <td className="py-3 px-5 text-emerald-400 font-bold">Dedicated Account Manager</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── 11. FAQ Accordion ──────────────────────────────────────────────── */}
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

      {/* ─── 12. Pre-Footer Call to Action (Obsidian Luxury Card) ────────────── */}
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

      {/* ─── 13. Platform Directory Footer ───────────────────────────────────── */}
      <PlatformFooter />
    </div>
  );
}
