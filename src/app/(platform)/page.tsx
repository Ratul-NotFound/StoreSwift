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
  Lock,
  Menu,
  ShieldCheck,
  Store,
  Truck,
  X,
  Zap,
  ShoppingBag,
  SlidersHorizontal,
  Printer,
  BadgeCheck,
  CreditCard,
  Banknote
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
  const [activeHeroTab, setActiveHeroTab] = useState<"storefront" | "admin">("storefront");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isNavDropdownOpen, setIsNavDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeStore = INDUSTRY_STOREFRONTS.find((s) => s.slug === selectedStoreSlug) || INDUSTRY_STOREFRONTS[0];

  const faqs = [
    {
      q: "How does StoreSwift compare to generic builders like Shopify or WooCommerce?",
      a: "StoreSwift is purpose-built for high-conversion direct commerce in South Asia and global markets. Instead of paying for dozens of third-party plugins that slow down your store, StoreSwift includes native 1-page checkout, automated Steadfast & Pathao courier dispatch, 4x6 thermal barcode labels, and an Anti-Fraud RTO Shield out of the box."
    },
    {
      q: "Can I accept Cash on Delivery (COD), bKash, and Nagad?",
      a: "Yes. Cash on Delivery is enabled by default with an Open Parcel Doorstep Inspection guarantee. You can also accept instant payments via bKash Express, Nagad Direct, and credit/debit cards with automated transaction tracking and zero platform commission."
    },
    {
      q: "How does automated courier dispatch work with Steadfast and Pathao?",
      a: "When a customer places an order, you can approve and book the consignment with a single click in your Merchant Admin. StoreSwift generates a live tracking consignment ID and formats a printable 4x6 thermal shipping sticker with barcode, ready for pickup by Steadfast or Pathao riders."
    },
    {
      q: "How does the Anti-Fraud RTO Risk Shield protect my margins?",
      a: "In social and direct commerce, uncollected Cash on Delivery orders cause costly return courier penalties. StoreSwift's RTO Shield analyzes buyer phone numbers against nationwide delivery records, flagging high-risk serial returners so you can collect an advance delivery fee before dispatch."
    },
    {
      q: "Can I connect my own custom domain (e.g. mystore.com)?",
      a: "Every store immediately receives a free subdomain (yourbrand.storeswift.app). You can connect your own custom domain with automated SSL encryption on our Growth and Pro plans with zero configuration."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] font-sans selection:bg-zinc-900 selection:text-white">
      {/* ─── 1. Platform Navigation Bar ─────────────────────────────────────── */}
      <header className="border-b border-zinc-200/80 bg-white/85 backdrop-blur-md sticky top-0 z-50 shadow-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center space-x-2.5 group flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-zinc-950 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Store className="w-4 h-4 text-white" />
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
                  <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-zinc-200/90 z-50 py-2 divide-y divide-zinc-100 text-xs animate-fade-in">
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
            <a href="#features" className="hover:text-zinc-950 transition">Capabilities</a>
            <a href="#pricing" className="hover:text-zinc-950 transition">Pricing</a>
            <a href="#faq" className="hover:text-zinc-950 transition">FAQ</a>
          </nav>

          {/* Action Buttons & Mobile Hamburger */}
          <div className="flex items-center space-x-2.5 flex-shrink-0">
            <Link
              href="/admin?store=apex-fashion"
              className="text-xs font-semibold text-zinc-700 hover:text-zinc-950 px-3.5 py-2 rounded-xl hover:bg-zinc-100 border border-zinc-200/80 transition hidden sm:inline-flex items-center space-x-1.5"
            >
              <span>Merchant Admin</span>
              <ExternalLink className="w-3 h-3 text-zinc-400" />
            </Link>
            <Link
              href="/onboarding"
              className="inline-flex items-center space-x-1.5 text-xs font-semibold bg-zinc-950 hover:bg-zinc-800 text-white px-4 py-2 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.08)_inset] transition-all btn-press"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-100 transition"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-zinc-200 bg-white px-4 py-4 space-y-4 animate-fade-in shadow-lg">
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

      {/* ─── 2. Hero Section (Clean, Authoritative, Minimalist) ──────────────── */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28 border-b border-zinc-200/80 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(37,99,235,0.05),transparent_80%)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          {/* Status Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-zinc-200/80 text-zinc-700 text-xs font-medium shadow-[0_1px_2px_rgba(0,0,0,0.04)] backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="font-semibold text-zinc-950">StoreSwift 2.0</span>
            <span className="text-zinc-300">•</span>
            <span className="text-zinc-500">High-Conversion Commerce Operating System</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-zinc-950 tracking-[-0.03em] leading-[1.08] max-w-4xl mx-auto">
            Launch an industry-optimized store <br className="hidden sm:inline" />
            <span className="text-zinc-400 font-normal">in minutes, built to convert.</span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Everything your brand needs to scale: 20-second 1-page checkout, automated Steadfast & Pathao courier dispatch, bKash & Nagad payments, and 6 bespoke turnkey storefronts.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/onboarding"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 text-xs font-semibold bg-zinc-950 hover:bg-zinc-800 text-white px-6 py-3.5 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.08)_inset] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-all duration-200 btn-press"
            >
              <span>Start 14-Day Free Trial</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <a
              href="#storefronts"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 text-xs font-semibold bg-white hover:bg-zinc-50 border border-zinc-200/90 text-zinc-700 hover:text-zinc-950 px-5 py-3.5 rounded-xl shadow-subtle hover:border-zinc-300 transition-all duration-200"
            >
              <span>Explore 6 Live Stores</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </a>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500 font-medium">
            <div className="flex items-center space-x-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Automated courier dispatch</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>0% physical order fees</span>
            </div>
          </div>

          {/* ─── Hero Interactive Interface Canvas (Apple/Linear Benchmark) ─────── */}
          <div className="pt-10">
            <div className="rounded-2xl border border-zinc-200/90 bg-white shadow-float overflow-hidden text-left">
              {/* Browser Window Chrome */}
              <div className="bg-zinc-50/90 border-b border-zinc-200/80 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 inline-block" />
                  </div>
                  <div className="hidden sm:flex items-center space-x-1.5 bg-white border border-zinc-200 rounded-md px-2.5 py-0.5 text-[11px] text-zinc-500 font-mono">
                    <Lock className="w-2.5 h-2.5 text-emerald-600" />
                    <span>
                      {activeHeroTab === "storefront"
                        ? "https://apex-fashion.storeswift.app"
                        : "https://storeswift.app/admin/orders"}
                    </span>
                  </div>
                </div>

                {/* Perspective View Switcher */}
                <div className="inline-flex p-0.5 rounded-lg bg-zinc-200/70 text-[11px] font-semibold">
                  <button
                    onClick={() => setActiveHeroTab("storefront")}
                    className={`px-3 py-1 rounded-md transition ${
                      activeHeroTab === "storefront"
                        ? "bg-white text-zinc-950 shadow-xs"
                        : "text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    Customer Storefront
                  </button>
                  <button
                    onClick={() => setActiveHeroTab("admin")}
                    className={`px-3 py-1 rounded-md transition ${
                      activeHeroTab === "admin"
                        ? "bg-white text-zinc-950 shadow-xs"
                        : "text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    Merchant Admin
                  </button>
                </div>
              </div>

              {/* View 1: Customer Storefront Experience */}
              {activeHeroTab === "storefront" ? (
                <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white">
                  {/* Left: Product Look */}
                  <div className="md:col-span-5 space-y-4">
                    <div className="relative rounded-xl overflow-hidden bg-zinc-100 aspect-[4/3] border border-zinc-100">
                      <img
                        src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80"
                        alt="Heavyweight Cotton Tee"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2.5 left-2.5 bg-zinc-950/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md">
                        280 GSM Heavyweight
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-950">Atelier Heavyweight Selvedge Tee</h4>
                      <p className="text-xs text-zinc-500 mt-0.5">Shuttle-loomed cotton • Double-stitched neckline</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-base font-extrabold text-zinc-950">৳1,250</span>
                        <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                          In Stock (Size M, Charcoal)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: 1-Page Express Checkout Simulator */}
                  <div className="md:col-span-7 bg-zinc-50/70 border border-zinc-200/80 rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-200/70">
                      <div className="flex items-center space-x-2">
                        <Zap className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-bold text-zinc-900">20-Second 1-Page Checkout</span>
                      </div>
                      <span className="text-[10px] font-semibold text-zinc-500">EN / বাংলা</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-[10px] font-bold text-zinc-600 block mb-1">Customer Name</label>
                        <div className="bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 text-zinc-900 font-medium">
                          Tanvir Hasan
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-zinc-600 block mb-1">Phone Number</label>
                        <div className="bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 text-zinc-900 font-mono">
                          01712-345678
                        </div>
                      </div>
                    </div>

                    {/* Zone Selector */}
                    <div>
                      <label className="text-[10px] font-bold text-zinc-600 block mb-1">Delivery Destination</label>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 rounded-lg border-2 border-zinc-900 bg-white font-medium flex items-center justify-between">
                          <span>Inside Dhaka</span>
                          <span className="font-bold text-zinc-950">৳60</span>
                        </div>
                        <div className="p-2 rounded-lg border border-zinc-200 bg-white text-zinc-500 font-medium flex items-center justify-between">
                          <span>Outside Dhaka</span>
                          <span>৳130</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Mode */}
                    <div className="flex items-center justify-between pt-2 border-t border-zinc-200/70 text-xs">
                      <div className="flex items-center space-x-2 text-zinc-700">
                        <Banknote className="w-4 h-4 text-emerald-600" />
                        <span className="font-semibold">Cash on Delivery (Doorstep Check)</span>
                      </div>
                      <span className="font-bold text-zinc-950 text-sm">৳1,310</span>
                    </div>

                    <button
                      type="button"
                      className="w-full py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-sm"
                    >
                      <span>Complete Order (৳1,310)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                /* View 2: Merchant Admin Console Simulator */
                <div className="p-6 sm:p-8 bg-white space-y-6">
                  {/* Top 3 KPI Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80">
                      <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">Today Revenue</span>
                      <p className="text-2xl font-extrabold text-zinc-950 mt-1">৳48,500</p>
                      <span className="text-[10px] font-semibold text-emerald-600">↑ 18.4% vs yesterday</span>
                    </div>
                    <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80">
                      <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">Courier Consignments</span>
                      <p className="text-2xl font-extrabold text-zinc-950 mt-1">24 Orders</p>
                      <span className="text-[10px] font-semibold text-blue-600">Steadfast & Pathao Synced</span>
                    </div>
                    <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80">
                      <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">RTO Shield Score</span>
                      <p className="text-2xl font-extrabold text-zinc-950 mt-1">98.6%</p>
                      <span className="text-[10px] font-semibold text-emerald-600">Zero Refusal Flag Today</span>
                    </div>
                  </div>

                  {/* Recent Orders Pipeline */}
                  <div className="border border-zinc-200/80 rounded-xl overflow-hidden">
                    <div className="bg-zinc-50 px-4 py-2.5 border-b border-zinc-200/80 flex items-center justify-between text-xs">
                      <span className="font-bold text-zinc-900">Live Orders Pipeline</span>
                      <span className="text-[11px] text-zinc-500">Auto-refresh active</span>
                    </div>
                    <div className="divide-y divide-zinc-200/70 text-xs">
                      {[
                        { id: "#SW-8492", customer: "Zubair Ahmed", phone: "01812-441290", zone: "Gulshan, Dhaka", total: "৳2,450", courier: "Steadfast Synced", status: "ST-89214" },
                        { id: "#SW-8491", customer: "Farhana Karim", phone: "01711-987211", zone: "Uttara, Dhaka", total: "৳1,850", courier: "Pathao Dispatched", status: "PTH-4412" }
                      ].map((order, i) => (
                        <div key={i} className="px-4 py-3 flex flex-wrap items-center justify-between gap-3 hover:bg-zinc-50/50">
                          <div>
                            <span className="font-mono font-bold text-zinc-950">{order.id}</span>
                            <span className="text-zinc-500 ml-2">• {order.customer} ({order.zone})</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                              <Truck className="w-3 h-3 text-emerald-600" />
                              <span>{order.courier}</span>
                            </span>
                            <span className="font-bold text-zinc-950">{order.total}</span>
                            <span className="text-[11px] bg-zinc-100 hover:bg-zinc-200 px-2 py-1 rounded text-zinc-700 font-semibold cursor-pointer">
                              4x6 Label
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. Interactive Storefronts Showcase ─────────────────────────────── */}
      <section id="storefronts" className="py-20 bg-white border-b border-zinc-200/80 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
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

          {/* Industry Category Segmented Bar */}
          <div className="flex items-center justify-center gap-1.5 overflow-x-auto pb-2">
            <div className="inline-flex p-1 rounded-xl bg-zinc-100/90 border border-zinc-200/70 shadow-xs">
              {INDUSTRY_STOREFRONTS.map((store) => {
                const isSelected = selectedStoreSlug === store.slug;
                return (
                  <button
                    key={store.slug}
                    onClick={() => setSelectedStoreSlug(store.slug)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      isSelected
                        ? "bg-white text-zinc-950 shadow-xs"
                        : "text-zinc-600 hover:text-zinc-950"
                    }`}
                  >
                    {store.category.split("&")[0].trim()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Featured Store Showcase (Clean Split Card) */}
          <div className="bg-[#fafafa] rounded-2xl border border-zinc-200 overflow-hidden shadow-card grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Left: High-Res Store Visual Preview */}
            <div className="lg:col-span-7 relative min-h-[320px] lg:min-h-[420px] bg-zinc-100 overflow-hidden group">
              <img
                src={activeStore.image}
                alt={activeStore.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 bg-zinc-950/85 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/10">
                {activeStore.template}
              </div>
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-3 border border-zinc-200/80 shadow-sm flex items-center justify-between">
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
                      <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-200 flex flex-col sm:flex-row gap-2.5">
                <Link
                  href={`/store/${activeStore.slug}`}
                  className="flex-1 py-2.5 px-4 bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-900 font-bold text-xs rounded-xl transition text-center shadow-xs flex items-center justify-center space-x-1.5"
                >
                  <span>Explore Live Store</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500" />
                </Link>
                <Link
                  href={`/onboarding?category=${activeStore.categoryParam}`}
                  className="py-2.5 px-4 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl transition text-center shadow-xs btn-press"
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
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "border-zinc-950 bg-white ring-1 ring-zinc-950 shadow-sm"
                      : "border-zinc-200 bg-[#fafafa] hover:bg-white text-zinc-600"
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

      {/* ─── 4. Platform Capabilities (Clean 4-Engine Architecture Grid) ──────── */}
      <section id="features" className="py-20 bg-[#fafafa] border-b border-zinc-200/80 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Engine 1: 1-Page Express Checkout */}
            <div className="p-7 bg-white rounded-2xl border border-zinc-200/80 shadow-subtle hover:shadow-card hover:border-zinc-300 transition-all duration-200 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-950 text-white flex items-center justify-center font-bold shadow-xs">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base font-bold text-zinc-950">20-Second 1-Page Checkout</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Eliminate multi-step cart abandonment. Customers complete orders on a single streamlined form with automatic 64-district delivery tariffs, bilingual English & Bengali interface, and instant bKash, Nagad, Card, and Cash on Delivery.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-medium text-zinc-600">
                <span className="px-2.5 py-1 bg-zinc-50 rounded-lg border border-zinc-200/60">64-District Auto Zones</span>
                <span className="px-2.5 py-1 bg-zinc-50 rounded-lg border border-zinc-200/60">Bilingual (EN / বাংলা)</span>
                <span className="px-2.5 py-1 bg-zinc-50 rounded-lg border border-zinc-200/60">bKash & Nagad MFS</span>
                <span className="px-2.5 py-1 bg-zinc-50 rounded-lg border border-zinc-200/60">Doorstep Inspection</span>
              </div>
            </div>

            {/* Engine 2: Automated Courier Dispatch */}
            <div className="p-7 bg-white rounded-2xl border border-zinc-200/80 shadow-subtle hover:shadow-card hover:border-zinc-300 transition-all duration-200 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-950 text-white flex items-center justify-center font-bold shadow-xs">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base font-bold text-zinc-950">Steadfast & Pathao 1-Click Dispatch</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Direct courier consignment generation directly from your orders dashboard. Automatically generates tracking consignment IDs, syncs live parcel statuses via webhooks, and formats standard 4x6 thermal barcode labels ready for rider pickup.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-medium text-zinc-600">
                <span className="px-2.5 py-1 bg-zinc-50 rounded-lg border border-zinc-200/60">Steadfast Official API</span>
                <span className="px-2.5 py-1 bg-zinc-50 rounded-lg border border-zinc-200/60">Pathao Logistics</span>
                <span className="px-2.5 py-1 bg-zinc-50 rounded-lg border border-zinc-200/60">4x6 Thermal Barcodes</span>
                <span className="px-2.5 py-1 bg-zinc-50 rounded-lg border border-zinc-200/60">Live Webhook Sync</span>
              </div>
            </div>

            {/* Engine 3: Anti-Fraud RTO Shield */}
            <div className="p-7 bg-white rounded-2xl border border-zinc-200/80 shadow-subtle hover:shadow-card hover:border-zinc-300 transition-all duration-200 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-950 text-white flex items-center justify-center font-bold shadow-xs">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base font-bold text-zinc-950">Anti-Fraud RTO Risk Shield</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Prevents the primary profit killer in direct commerce: uncollected Cash on Delivery parcel returns. Automatically evaluates buyer phone numbers against network delivery records, scoring delivery reliability (0–100%) and flagging serial returners before dispatch.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-medium text-zinc-600">
                <span className="px-2.5 py-1 bg-zinc-50 rounded-lg border border-zinc-200/60">Delivery Rate Scoring</span>
                <span className="px-2.5 py-1 bg-zinc-50 rounded-lg border border-zinc-200/60">Serial Returner Alerts</span>
                <span className="px-2.5 py-1 bg-zinc-50 rounded-lg border border-zinc-200/60">Advance Fee Prompts</span>
                <span className="px-2.5 py-1 bg-zinc-50 rounded-lg border border-zinc-200/60">Margin Protection</span>
              </div>
            </div>

            {/* Engine 4: Multi-Variant Inventory Matrix */}
            <div className="p-7 bg-white rounded-2xl border border-zinc-200/80 shadow-subtle hover:shadow-card hover:border-zinc-300 transition-all duration-200 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-950 text-white flex items-center justify-center font-bold shadow-xs">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base font-bold text-zinc-950">Multi-Variant Inventory Matrix</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Generate complete multi-option product matrices (Size, Color, Material) with automatic SKU computation. Backed by atomic SQL stock locks to eliminate overselling during high-traffic social media product launches and viral flash sales.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-medium text-zinc-600">
                <span className="px-2.5 py-1 bg-zinc-50 rounded-lg border border-zinc-200/60">Cartesian Generator</span>
                <span className="px-2.5 py-1 bg-zinc-50 rounded-lg border border-zinc-200/60">Atomic Stock Locks</span>
                <span className="px-2.5 py-1 bg-zinc-50 rounded-lg border border-zinc-200/60">Real-Time SKU Tracking</span>
                <span className="px-2.5 py-1 bg-zinc-50 rounded-lg border border-zinc-200/60">Batch Stock Adjustment</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. Transparent Pricing ─────────────────────────────────────────── */}
      <section id="pricing" className="py-20 bg-white border-b border-zinc-200/80 scroll-mt-16">
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
            <div className="bg-[#fafafa] rounded-2xl border border-zinc-200/80 p-6 sm:p-7 flex flex-col justify-between shadow-subtle hover:border-zinc-300 transition-colors">
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-zinc-950">Starter</h3>
                  <p className="text-xs text-zinc-500 mt-1">For new brands launching online</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-bold text-zinc-400">৳</span>
                  <span className="text-4xl font-extrabold text-zinc-950 tracking-tight">599</span>
                  <span className="text-xs text-zinc-500 font-medium">/month</span>
                  <span className="text-xs text-zinc-400 font-normal ml-1">($9 USD)</span>
                </div>
                <ul className="space-y-2.5 text-xs text-zinc-600 pt-3 border-t border-zinc-200/70">
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /><span>Up to 500 products</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /><span>20s 1-Page Express Checkout</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /><span>Steadfast & Pathao courier booking</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /><span>0% physical order commission</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /><span>Free StoreSwift subdomain with SSL</span></li>
                </ul>
              </div>
              <Link href="/onboarding?plan=starter" className="mt-8 w-full py-2.5 bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-900 font-bold text-xs rounded-xl transition text-center btn-press shadow-xs">
                Start 14-Day Free Trial
              </Link>
            </div>

            {/* Growth Plan (Popular) */}
            <div className="bg-white rounded-2xl border border-zinc-900 ring-1 ring-zinc-900/10 p-6 sm:p-7 flex flex-col justify-between shadow-float relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-zinc-950 text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-0.5 rounded-full shadow-xs">
                Most Popular
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-zinc-950">Growth</h3>
                  <p className="text-xs text-zinc-500 mt-1">For scaling direct & social commerce brands</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-bold text-zinc-400">৳</span>
                  <span className="text-4xl font-extrabold text-zinc-950 tracking-tight">1,099</span>
                  <span className="text-xs text-zinc-500 font-medium">/month</span>
                  <span className="text-xs text-zinc-400 font-normal ml-1">($19 USD)</span>
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
              <Link href="/onboarding?plan=growth" className="mt-8 w-full py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl transition text-center shadow-[0_1px_2px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.08)_inset] btn-press">
                Start 14-Day Free Trial
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-[#fafafa] rounded-2xl border border-zinc-200/80 p-6 sm:p-7 flex flex-col justify-between shadow-subtle hover:border-zinc-300 transition-colors">
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-zinc-950">Pro Enterprise</h3>
                  <p className="text-xs text-zinc-500 mt-1">For high-volume multi-channel stores</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-bold text-zinc-400">৳</span>
                  <span className="text-4xl font-extrabold text-zinc-950 tracking-tight">2,499</span>
                  <span className="text-xs text-zinc-500 font-medium">/month</span>
                  <span className="text-xs text-zinc-400 font-normal ml-1">($49 USD)</span>
                </div>
                <ul className="space-y-2.5 text-xs text-zinc-600 pt-3 border-t border-zinc-200/70">
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /><span>Unlimited products & orders</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /><span>Wholesale Orders & Invoicing</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /><span>Dedicated 24/7 account manager</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /><span>Global CDN & sub-second response</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /><span>Custom courier API credentials</span></li>
                </ul>
              </div>
              <Link href="/onboarding?plan=pro" className="mt-8 w-full py-2.5 bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-900 font-bold text-xs rounded-xl transition text-center btn-press shadow-xs">
                Start 14-Day Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. FAQ Accordion ──────────────────────────────────────────────── */}
      <section id="faq" className="py-20 bg-[#fafafa] border-b border-zinc-200/80 scroll-mt-16">
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

          <div className="divide-y divide-zinc-200 bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-subtle">
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

      {/* ─── 7. Minimalist Pre-Footer Call to Action ────────────────────────── */}
      <section className="py-24 bg-zinc-950 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_-20%,rgba(37,99,235,0.12),transparent_70%)] pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to launch your high-conversion store?
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Start selling in minutes with pre-configured logistics, localized payments, and industry-tailored storefronts.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/onboarding"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 text-xs font-bold bg-white text-zinc-950 hover:bg-zinc-100 px-6 py-3.5 rounded-xl shadow-sm transition btn-press"
            >
              <span>Start 14-Day Free Trial</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/admin?store=apex-fashion"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 px-5 py-3.5 rounded-xl transition"
            >
              <span>Explore Demo Admin</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 8. Platform Directory Footer ───────────────────────────────────── */}
      <PlatformFooter />
    </div>
  );
}
