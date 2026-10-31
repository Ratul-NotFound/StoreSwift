"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Sparkles,
  Store,
  ShoppingBag,
  BarChart3,
  Truck,
  ArrowUpRight,
  Star,
  Check,
  X,
  Menu,
  CreditCard,
  Layers,
  ChevronDown,
  ChevronRight,
  Headphones,
  Apple,
  Shirt,
  HelpCircle,
  Clock,
  DollarSign,
  Package,
  Globe,
  Radio,
  ExternalLink
} from "lucide-react";
import { ALL_CATEGORIES, getCategoryConfig } from "@/config/categories";
import { PlatformFooter, DEMO_STORES_LIST } from "@/components/platform-footer";

export default function PlatformLandingPage() {
  const [selectedDemoCategory, setSelectedDemoCategory] = useState("fashion");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isNavDropdownOpen, setIsNavDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeCategory = getCategoryConfig(selectedDemoCategory);

  const faqs = [
    {
      q: "How does StoreSwift compare to generic builders like Zatiq or Shopify?",
      a: "StoreSwift is purpose-built for high-conversion commerce. Unlike generic cookie-cutter templates, StoreSwift features 6 distinct category-tailored storefronts, a 20-second 1-Page Express Checkout with automatic 64-district delivery zone calculation, automated Steadfast & Pathao courier booking with 4x6 thermal barcode labels, and an AI-powered Anti-Fraud RTO Shield to eliminate costly COD returns."
    },
    {
      q: "Can I accept Cash on Delivery (COD), bKash, and Nagad?",
      a: "Yes! Cash on Delivery is enabled out of the box with an 'Open Parcel Doorstep Inspection' guarantee. Additionally, customers can pay via bKash Express, Nagad Direct, or Credit/Debit Cards with automated transaction tracking."
    },
    {
      q: "How does automated courier dispatch work with Steadfast and Pathao?",
      a: "When a customer places an order, you can approve and book the consignment with 1 click in your Merchant Admin. StoreSwift generates a live tracking consignment ID and formats a printable 4x6 thermal shipping sticker with barcode, ready for pickup by Steadfast, Pathao, or RedX riders."
    },
    {
      q: "Can I connect my own custom domain (e.g. mystore.com)?",
      a: "Every store receives an instant free subdomain (yourbrand.storeswift.app). When you're ready, you can connect any custom domain with automated SSL encryption on our Growth and Pro plans."
    },
    {
      q: "How does the Anti-Fraud RTO Risk Shield protect my business?",
      a: "In social commerce, 15-25% of COD orders are refused at the customer's door, costing merchants courier return penalties. StoreSwift's RTO Shield analyzes customer phone numbers against network delivery history, alerting you to high-risk serial returners so you can collect an advance delivery fee before shipping."
    },
    {
      q: "How does the Variant Matrix generator work?",
      a: "Simply specify your product options (e.g. Size: S, M, L and Color: Black, Olive). StoreSwift automatically computes the Cartesian matrix, assigns unique SKUs, and tracks inventory per variant with atomic SQL stock locks."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] font-sans selection:bg-zinc-900 selection:text-white">
      {/* ─── 1. Top Announcement Utility Bar ───────────────────────────────── */}
      <div className="bg-zinc-900 text-white text-[11px] py-2 px-4 text-center font-medium flex items-center justify-center space-x-2">
        <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
          New
        </span>
        <span>
          StoreSwift 2.0 Live: 1-Page Express Checkout, Steadfast Courier Sync, & Anti-Fraud RTO Shield.
        </span>
        <Link href="/onboarding" className="underline hover:text-zinc-300 ml-1 font-semibold">
          Launch Free Store →
        </Link>
      </div>

      {/* ─── 2. Platform Navigation Bar ────────────────────────────────────── */}
      <header className="border-b border-zinc-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center space-x-2.5 group flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Store className="w-4 h-4" />
            </div>
            <span className="text-base font-bold tracking-tight text-zinc-900">
              Store<span className="text-blue-600">Swift</span>
            </span>
          </Link>

          {/* Desktop Navigation Links (Logically Placed) */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs font-semibold text-zinc-600">
            <div className="relative">
              <button
                onClick={() => setIsNavDropdownOpen(!isNavDropdownOpen)}
                className="hover:text-zinc-950 transition flex items-center space-x-1 py-1"
              >
                <span>Live Storefronts</span>
                <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">6</span>
                <ChevronDown className="w-3 h-3 text-zinc-400" />
              </button>

              {isNavDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNavDropdownOpen(false)} />
                  <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-zinc-200 z-50 py-2 divide-y divide-zinc-100 text-xs">
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
            <a href="#logistics" className="hover:text-zinc-950 transition">Logistics & Couriers</a>
            <a href="#checkout" className="hover:text-zinc-950 transition">1-Page Checkout</a>
            <a href="#demo" className="hover:text-zinc-950 transition">Catalog & Matrix</a>
            <a href="#pricing" className="hover:text-zinc-950 transition">Pricing</a>
            <a href="#faq" className="hover:text-zinc-950 transition">FAQ</a>
          </nav>

          {/* Action Buttons & Mobile Hamburger */}
          <div className="flex items-center space-x-2.5 flex-shrink-0">
            <Link
              href="/admin?store=apex-fashion"
              className="text-xs font-semibold text-zinc-700 hover:text-zinc-900 px-3 py-1.5 rounded-xl hover:bg-zinc-100 transition hidden sm:inline-flex items-center space-x-1"
            >
              <span>Demo Admin</span>
              <ExternalLink className="w-3 h-3 text-zinc-400" />
            </Link>
            <Link
              href="/onboarding"
              className="inline-flex items-center space-x-1.5 text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-white px-3.5 sm:px-4 py-2 rounded-xl shadow-sm transition btn-press"
            >
              <span>Launch Store</span>
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
                href="#logistics"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-2 py-1.5 rounded-lg hover:bg-zinc-50"
              >
                Logistics & Couriers
              </a>
              <a
                href="#checkout"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-2 py-1.5 rounded-lg hover:bg-zinc-50"
              >
                1-Page Checkout
              </a>
              <a
                href="#demo"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-2 py-1.5 rounded-lg hover:bg-zinc-50"
              >
                Catalog & Matrix
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

      {/* ─── 3. Hero Section ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Top Pill Announcement */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-800 text-xs font-semibold mb-6 shadow-subtle">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Modern High-Conversion Commerce Engine</span>
            <span className="text-zinc-300">•</span>
            <span className="text-zinc-500 font-normal">Ready in 3 minutes</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-zinc-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Launch your category-tailored online store <br className="hidden sm:inline" />
            <span className="text-zinc-400 font-medium">with zero agency costs or coding.</span>
          </h1>

          <p className="mt-6 text-sm sm:text-base text-zinc-600 max-w-2xl mx-auto leading-relaxed">
            Everything your brand needs to scale: 20-second 1-Page Express Checkout, automated Steadfast & Pathao courier dispatch, bKash & Nagad payments, and 6 bespoke turnkey storefront templates.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/onboarding"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-3.5 rounded-xl shadow-md transition btn-press"
            >
              <span>Start 14-Day Free Trial</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#templates"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 text-xs font-semibold bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-800 px-5 py-3.5 rounded-xl shadow-subtle transition"
            >
              <span>Explore 6 Live Stores</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </a>
          </div>

          {/* Quick Perks Strip */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-600">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="font-medium text-zinc-700">No credit card required</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="font-medium text-zinc-700">Steadfast & Pathao courier synced</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="font-medium text-zinc-700">Anti-Fraud RTO Shield included</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. Live Storefront Showcase Grid (Logically Placed) ────────────── */}
      <section id="templates" className="py-20 bg-white border-y border-zinc-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-3 border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Category Cognitive Psychology</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
              6 Bespoke Turnkey Storefronts
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-500">
              Each storefront is psychologically engineered for buyer intent in that specific niche. Click to experience the live stores.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                slug: "apex-fashion",
                name: "Apex Fashion Hub",
                category: "Fashion & Apparel",
                template: "Minimal Atelier",
                tagline: "Heavyweight 280 GSM cotton, shuttle-loomed Kurabo selvedge, and editorial lookbooks.",
                image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80",
                features: ["Textile weight badges (GSM)", "Studio angle switcher", "Curated outfits lookbook"]
              },
              {
                slug: "luxe-glow-beauty",
                name: "Luxe Glow Beauty",
                category: "Beauty & Skincare",
                template: "Clinical Botanical",
                tagline: "Clinical botanical formulations with bio-active percentages and skin-type filters.",
                image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
                features: ["Active ingredient % badges", "3-Step glass skin ritual", "Tamper seal inspection protocol"]
              },
              {
                slug: "craft-shoes",
                name: "Craft Bench Shoes",
                category: "Footwear & Leather",
                template: "Warm Heritage",
                tagline: "Goodyear storm welted boots, Horween leather provenance, and Vibram lug depth metrics.",
                image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80",
                features: ["Anatomical sole cutaway", "Leather tannery provenance", "Heel-to-toe drop specs"]
              },
              {
                slug: "cyber-tech",
                name: "CyberTech Audio",
                category: "Consumer Tech",
                template: "Acoustic Cyber",
                tagline: "Acoustic frequency curves, titanium driver specs, and -38dB active noise cancellation.",
                image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
                features: ["Frequency curve visualizer", "Low-latency gaming mode", "IPX7 waterproof ratings"]
              },
              {
                slug: "maison-jewelry",
                name: "Maison Opulente",
                category: "Fine Jewelry & Watches",
                template: "Opulent Maison",
                tagline: "Solid 18K/24K hallmark stamps, Kimberley certified diamonds, and velvet pouch unboxing.",
                image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80",
                features: ["Gold purity hallmarks (750)", "GIA clarity certifications", "Velvet unboxing guarantee"]
              },
              {
                slug: "artisan-food",
                name: "Artisan Pantry",
                category: "Gourmet Food & Coffee",
                template: "Artisan Pantry",
                tagline: "Single-origin micro-lots, harvest altitude metrics, and custom brew extraction guides.",
                image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
                features: ["48h roast date freshness", "Harvest altitude (MASL)", "V60/Aeropress brew guides"]
              }
            ].map((store) => (
              <div
                key={store.slug}
                className="bg-[#fafafa] rounded-2xl border border-zinc-200/80 overflow-hidden shadow-subtle hover:shadow-card transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 bg-zinc-100 overflow-hidden">
                    <img
                      src={store.image}
                      alt={store.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-zinc-950/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                      {store.template}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                        {store.category}
                      </span>
                      <h3 className="text-base font-bold text-zinc-900 tracking-tight mt-0.5">
                        {store.name}
                      </h3>
                      <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                        {store.tagline}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-zinc-200/60 space-y-1">
                      {store.features.map((feat, i) => (
                        <div key={i} className="flex items-center space-x-1.5 text-[11px] text-zinc-600">
                          <Check className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 flex gap-2">
                  <Link
                    href={`/store/${store.slug}`}
                    className="flex-1 py-2.5 px-3 bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-900 font-bold text-xs rounded-xl transition text-center shadow-xs flex items-center justify-center space-x-1"
                  >
                    <span>View Live Store</span>
                    <ArrowUpRight className="w-3 h-3 text-zinc-400" />
                  </Link>
                  <Link
                    href={`/onboarding?category=${store.category.toLowerCase().includes("fashion") ? "fashion" : store.category.toLowerCase().includes("beauty") ? "beauty_cosmetics" : store.category.toLowerCase().includes("shoes") ? "shoes" : store.category.toLowerCase().includes("tech") ? "electronics" : store.category.toLowerCase().includes("jewelry") ? "jewelry" : "grocery_food"}`}
                    className="py-2.5 px-3.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl transition text-center btn-press shadow-xs"
                    title="Launch this template"
                  >
                    <span>Clone</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5. Automated Logistics, Couriers & 1-Page Express Checkout ───────── */}
      <section id="logistics" className="py-20 bg-[#fafafa] border-b border-zinc-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-3 border border-blue-200">
              <Truck className="w-3.5 h-3.5 text-blue-600" />
              <span>Full-Stack Operational Automation</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
              Built-in Logistics, 1-Page Checkout & Anti-Fraud
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-500">
              Why settle for clunky 4-step Shopify carts? StoreSwift gives you instant 20-second order capture with automated courier booking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 1-Page Express Checkout */}
            <div id="checkout" className="p-6 bg-white rounded-2xl border border-zinc-200/80 shadow-subtle space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold border border-emerald-200">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-zinc-900">20-Second 1-Page Checkout</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                No mandatory accounts or cumbersome forms. Customers enter name, phone, address, and pick their payment mode. Features automatic 64-District delivery zone calculations.
              </p>
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 text-[11px] text-zinc-600 space-y-1">
                <div>• English & Bengali (বাংলা) 1-tap toggle</div>
                <div>• Inside Dhaka ৳60 / Outside Dhaka ৳130</div>
                <div>• bKash Express & Nagad Direct wallet sync</div>
              </div>
            </div>

            {/* Courier Dispatch Hub */}
            <div className="p-6 bg-white rounded-2xl border border-zinc-200/80 shadow-subtle space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold border border-blue-200">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-zinc-900">Steadfast & Pathao Courier Sync</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                1-Click consignment generation directly from your merchant orders pipeline. Automatically attaches live tracking numbers and formats standard 4x6 thermal barcode shipping labels.
              </p>
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 text-[11px] text-zinc-600 space-y-1">
                <div>• Automated Steadfast & Pathao API booking</div>
                <div>• 4x6 Thermal printer barcode sticker export</div>
                <div>• Real-time webhook delivery updates</div>
              </div>
            </div>

            {/* Anti-Fraud RTO Shield */}
            <div className="p-6 bg-white rounded-2xl border border-zinc-200/80 shadow-subtle space-y-4">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold border border-rose-200">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-zinc-900">Anti-Fraud RTO Risk Shield</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Prevents the #1 profit killer in social commerce: COD parcel refusals. Automatically evaluates buyer phone numbers against delivery history, flagging serial returners before you dispatch.
              </p>
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 text-[11px] text-zinc-600 space-y-1">
                <div>• Real-time 0-100% Delivery Success Score</div>
                <div>• Flags high-risk returners automatically</div>
                <div>• Prompts advance shipping fee collection</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. Pre-Seeded Product Catalog & Variant Matrix ─────────────────── */}
      <section id="demo" className="py-20 bg-white border-b border-zinc-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-3 border border-blue-200">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>Zero-Setup Catalog Presets</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
              Pre-Configured Catalogs & Multi-Variant Matrix
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-500 leading-relaxed">
              Never launch with an empty database. StoreSwift provisions your storefront with high-resolution photography, localized BDT/USD pricing, and pre-calculated Cartesian variant matrices out of the box.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center justify-center space-x-2 overflow-x-auto pb-4 mb-8">
            {ALL_CATEGORIES.map((catKey) => {
              const cat = getCategoryConfig(catKey);
              const isSelected = selectedDemoCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedDemoCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all btn-press flex items-center space-x-1.5 ${
                    isSelected
                      ? "bg-zinc-900 text-white shadow-sm ring-1 ring-zinc-900"
                      : "bg-zinc-100 hover:bg-zinc-200/80 text-zinc-600"
                  }`}
                >
                  <span>{cat.name}</span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                </button>
              );
            })}
          </div>

          {/* Sample Products Grid */}
          <div className="bg-[#fafafa] rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-card">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-zinc-200/80 gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl font-bold text-zinc-900 tracking-tight">{activeCategory.name}</h3>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    Pre-Seeded Kit
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-1">{activeCategory.tagline}</p>
              </div>

              <div className="flex items-center space-x-3">
                <Link
                  href={`/onboarding?category=${activeCategory.id}`}
                  className="inline-flex items-center space-x-2 text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2.5 rounded-xl shadow-sm transition btn-press"
                >
                  <span>Launch This Template</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {activeCategory.sampleProducts.map((p, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-subtle flex flex-col justify-between"
                >
                  <div className="relative h-48 bg-zinc-100 overflow-hidden group">
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-90"
                    />
                    {p.badge && (
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-zinc-900/80 backdrop-blur-md text-white text-[9px] font-bold rounded-md">
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-zinc-900 tracking-tight line-clamp-1">{p.title}</h4>
                      <p className="text-[11px] text-zinc-500 line-clamp-2 mt-1 leading-relaxed">{p.description}</p>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-zinc-100 flex items-center justify-between">
                      <div>
                        <span className="font-black text-xs text-zinc-900">৳{(parseFloat(p.basePrice) * 115).toLocaleString()}</span>
                        <span className="text-[10px] text-zinc-400 ml-1">(${p.basePrice})</span>
                      </div>
                      <span className="text-[10px] text-emerald-600 font-semibold flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 inline mr-0.5" />
                        <span>Pre-Seeded SKUs</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. Transparent Pricing ─────────────────────────────────────────── */}
      <section id="pricing" className="py-20 bg-[#fafafa] border-b border-zinc-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
              Simple, Predictable Pricing
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-500">
              No hidden commission fees. Keep 100% of your product revenue.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Starter Plan */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-6 flex flex-col justify-between shadow-subtle">
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-zinc-900">Starter</h3>
                  <p className="text-xs text-zinc-500 mt-1">For new brands launching online</p>
                </div>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-black text-zinc-900">৳599</span>
                  <span className="text-xs text-zinc-500 font-medium">/month ($9 USD)</span>
                </div>
                <ul className="space-y-2.5 text-xs text-zinc-600 pt-2 border-t border-zinc-100">
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-emerald-600" /><span>Up to 500 products</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-emerald-600" /><span>1-Page Express Checkout</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-emerald-600" /><span>Steadfast & Pathao courier booking</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-emerald-600" /><span>0% physical order commission</span></li>
                </ul>
              </div>
              <Link href="/onboarding?plan=starter" className="mt-8 w-full py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-bold text-xs rounded-xl transition text-center btn-press">
                Start 14-Day Trial
              </Link>
            </div>

            {/* Growth Plan (Popular) */}
            <div className="bg-white rounded-2xl border-2 border-zinc-900 p-6 flex flex-col justify-between shadow-card relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full">
                Most Popular
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-zinc-900">Growth</h3>
                  <p className="text-xs text-zinc-500 mt-1">For scaling social & D2C brands</p>
                </div>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-black text-zinc-900">৳1,099</span>
                  <span className="text-xs text-zinc-500 font-medium">/month ($19 USD)</span>
                </div>
                <ul className="space-y-2.5 text-xs text-zinc-600 pt-2 border-t border-zinc-100">
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-emerald-600" /><span>Up to 2,000 products</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-emerald-600" /><span>Custom vanity domain with SSL</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-emerald-600" /><span>AI Anti-Fraud RTO Risk Shield</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-emerald-600" /><span>Meta Pixel, TikTok & GTM CAPI</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-emerald-600" /><span>Unlimited courier API bookings</span></li>
                </ul>
              </div>
              <Link href="/onboarding?plan=growth" className="mt-8 w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl transition text-center shadow-sm btn-press">
                Start 14-Day Trial
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-6 flex flex-col justify-between shadow-subtle">
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-zinc-900">Pro Enterprise</h3>
                  <p className="text-xs text-zinc-500 mt-1">High volume multi-channel stores</p>
                </div>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-black text-zinc-900">৳2,499</span>
                  <span className="text-xs text-zinc-500 font-medium">/month ($49 USD)</span>
                </div>
                <ul className="space-y-2.5 text-xs text-zinc-600 pt-2 border-t border-zinc-100">
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-emerald-600" /><span>Unlimited products & orders</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-emerald-600" /><span>Wholesale Dropshipping Portal</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-emerald-600" /><span>Turbo sub-millisecond edge cache</span></li>
                  <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-emerald-600" /><span>Dedicated 24/7 WhatsApp manager</span></li>
                </ul>
              </div>
              <Link href="/onboarding?plan=pro" className="mt-8 w-full py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-bold text-xs rounded-xl transition text-center btn-press">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 8. FAQ Accordion ──────────────────────────────────────────────── */}
      <section id="faq" className="py-20 bg-white border-b border-zinc-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-500">
              Everything you need to know about setting up your online store.
            </p>
          </div>

          <div className="divide-y divide-zinc-200">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div key={index} className="py-4">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between text-left focus:outline-none"
                  >
                    <span className="font-bold text-sm text-zinc-900">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
                        isOpen ? "transform rotate-180 text-zinc-900" : ""
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

      {/* ─── 9. Pre-Footer CTA ─────────────────────────────────────────────── */}
      <section className="py-16 bg-zinc-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Ready to launch your online store today?
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
            Join hundreds of founders who launched their business without paying thousands in custom agency development.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/onboarding"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 text-xs font-bold bg-white text-zinc-900 hover:bg-zinc-100 px-6 py-3.5 rounded-xl shadow-sm transition btn-press"
            >
              <span>Launch Store in 3 Minutes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 10. Rich Multi-Column Modern Footer ───────────────────────────── */}
      <PlatformFooter />
    </div>
  );
}
