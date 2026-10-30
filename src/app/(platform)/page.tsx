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
  CreditCard,
  Layers,
  ChevronDown,
  ChevronRight,
  Headphones,
  Apple,
  Shirt,
  HelpCircle,
  Clock,
  DollarSign
} from "lucide-react";
import { ALL_CATEGORIES, getCategoryConfig } from "@/config/categories";
import { StoreFooter } from "@/components/footer";

export default function PlatformLandingPage() {
  const [selectedDemoCategory, setSelectedDemoCategory] = useState("fashion");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const activeCategory = getCategoryConfig(selectedDemoCategory);

  const faqs = [
    {
      q: "Do I need any coding or web design experience?",
      a: "None at all. StoreSwift is 100% turnkey. Pick your business category, choose your store name, and your fully-functional e-commerce website is live in under 3 minutes with pre-seeded products and variant inventory."
    },
    {
      q: "Can I accept Cash on Delivery (COD) and local payment methods?",
      a: "Yes! Cash on Delivery is enabled by default because it delivers up to 85% higher conversion for startup brands. You can also connect Stripe for instant credit/debit card payments, or paste your mobile money (bKash, Nagad, UPI) instructions."
    },
    {
      q: "Can I connect my own custom domain (e.g. mystore.com)?",
      a: "Every store receives an instant free subdomain (yourbrand.storeswift.com). When you're ready, you can connect any custom domain (mystore.com) with 1-click SSL on our Growth and Pro plans."
    },
    {
      q: "How does the Variant Matrix generator work?",
      a: "Simply specify your product options (e.g. Size: S, M, L and Color: Black, Olive). StoreSwift automatically computes the Cartesian matrix, assigns unique SKUs, and lets you track inventory per variant with atomic stock locks."
    },
    {
      q: "How does StoreSwift compare to paying a web development agency?",
      a: "Hiring a web agency typically costs $3,000 to $8,000 upfront with 6 to 12 weeks of back-and-forth delays, plus expensive retainer fees whenever you need changes. StoreSwift gives you an enterprise-grade platform starting at just $9/month with instant setup and zero maintenance headaches."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] font-sans selection:bg-zinc-900 selection:text-white">
      {/* Top Notification Announcement Bar */}
      <div className="bg-zinc-900 text-white text-[11px] py-2 px-4 text-center font-medium flex items-center justify-center space-x-2">
        <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
          New
        </span>
        <span>StoreSwift 2.0 is live: Pre-seeded category catalogs & instant Cash on Delivery checkout.</span>
        <Link href="/onboarding" className="underline hover:text-zinc-300 ml-1 font-semibold">
          Try 14-Day Free Trial →
        </Link>
      </div>

      {/* Top Navbar */}
      <header className="border-b border-zinc-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Store className="w-4 h-4" />
            </div>
            <span className="text-base font-bold tracking-tight text-zinc-900">
              Store<span className="text-blue-600">Swift</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold text-zinc-500">
            <a href="#demo" className="hover:text-zinc-900 transition">Interactive Demo</a>
            <a href="#comparison" className="hover:text-zinc-900 transition">Why StoreSwift</a>
            <a href="#features" className="hover:text-zinc-900 transition">Features</a>
            <a href="#pricing" className="hover:text-zinc-900 transition">Pricing</a>
            <a href="#faq" className="hover:text-zinc-900 transition">FAQ</a>
          </nav>

          <div className="flex items-center space-x-3">
            <Link
              href="/admin?store=apex-fashion"
              className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 px-3 py-1.5 rounded-lg hover:bg-zinc-100 transition hidden sm:inline-block"
            >
              Demo Admin
            </Link>
            <Link
              href="/onboarding"
              className="inline-flex items-center space-x-1.5 text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2 rounded-xl shadow-sm transition btn-press"
            >
              <span>Launch Store</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Top Pill Announcement */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-800 text-xs font-semibold mb-6 shadow-subtle">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Built for Startups & Small Brands</span>
            <span className="text-zinc-300">•</span>
            <span className="text-zinc-500 font-normal">Ready in 3 minutes</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-zinc-900 tracking-tight max-w-4xl mx-auto leading-[1.12]">
            Launch your professional online store <br className="hidden sm:inline" />
            <span className="text-zinc-400 font-medium">without expensive agency costs.</span>
          </h1>

          <p className="mt-6 text-sm sm:text-base text-zinc-500 max-w-2xl mx-auto leading-relaxed font-normal">
            Can’t afford thousands of dollars for agency web developers? StoreSwift provides startups with an instant category-customized online shop, variant inventory management, and hybrid checkout for a minimal monthly fee.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/onboarding"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-white px-7 py-3.5 rounded-xl shadow-card transition btn-press"
            >
              <span>Start 14-Day Free Trial</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/store/apex-fashion"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 text-xs font-semibold bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-200 px-6 py-3.5 rounded-xl shadow-subtle transition btn-press"
            >
              <span>Preview Live Demo Store</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="font-medium text-zinc-700">No credit card required</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="font-medium text-zinc-700">Cash on Delivery & Cards ready</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="font-medium text-zinc-700">Free subdomain instantly</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Category Live Showcase */}
      <section id="demo" className="py-16 bg-white border-y border-zinc-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Industry Templates</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
              Pre-Configured For Your Business Niche
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-500">
              Select your category below to see sample products, variant matrices, and layouts pre-configured for your niche.
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
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all btn-press flex items-center space-x-2 ${
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

          {/* Dynamic Category Preview Card */}
          <div className="bg-[#fafafa] rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-card">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-zinc-200 gap-4">
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

            {/* 3 Pre-Seeded Product Previews */}
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
                      className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
                      loading="lazy"
                    />
                    {p.secondaryImage && (
                      <img
                        src={p.secondaryImage}
                        alt={`${p.title} - Lookbook`}
                        className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                        loading="lazy"
                      />
                    )}
                    {p.badge && (
                      <span className="absolute top-2.5 left-2.5 bg-zinc-900/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {p.badge}
                      </span>
                    )}
                    <div className="absolute bottom-2.5 left-2.5 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold text-zinc-900 flex items-center space-x-1 shadow-sm">
                      <Star className="w-3 h-3 text-amber-500 fill-current" />
                      <span>{p.rating}</span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h4 className="font-bold text-zinc-900 text-xs tracking-tight line-clamp-1">
                      {p.title}
                    </h4>
                    <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2">
                      {p.description}
                    </p>

                    <div className="mt-3 flex items-center justify-between pt-3 border-t border-zinc-100">
                      <span className="font-black text-zinc-900 text-sm">
                        ${p.basePrice}
                      </span>
                      <div className="flex gap-1">
                        {Object.keys(p.options).map((opt) => (
                          <span
                            key={opt}
                            className="text-[9px] bg-zinc-100 text-zinc-600 px-1.5 py-0.5 rounded font-medium border border-zinc-200"
                          >
                            {opt}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Comparison: Custom Agency vs StoreSwift */}
      <section id="comparison" className="py-20 bg-[#fafafa]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
              Why Startups Choose StoreSwift Over Agencies
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-500">
              Save thousands in upfront cash and launch today instead of waiting months.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Custom Web Agency */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                <div>
                  <h3 className="text-base font-bold text-zinc-900">Custom Web Agency</h3>
                  <p className="text-xs text-zinc-500">Traditional developer route</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center font-bold text-xs">
                  <X className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-6 space-y-4 text-xs">
                <div className="flex items-start space-x-3">
                  <X className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-zinc-800">$3,000 – $8,000+ upfront fee:</strong>
                    <p className="text-zinc-500">Massive initial capital risk before making your very first sale.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <X className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-zinc-800">6 to 12 weeks launch delay:</strong>
                    <p className="text-zinc-500">Tedious design meetings, scope creep, and missed market opportunities.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <X className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-zinc-800">Expensive maintenance retainer:</strong>
                    <p className="text-zinc-500">Every price adjustment, variant, or banner requires waiting on developer hours.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <X className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-zinc-800">Separate server & plugin bills:</strong>
                    <p className="text-zinc-500">Hosting, SSL, payment gateway plugins, and domain setups billed separately.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* StoreSwift Turnkey SaaS */}
            <div className="bg-zinc-900 text-white rounded-2xl border border-zinc-800 p-6 sm:p-8 shadow-card relative">
              <div className="absolute -top-3 right-6 bg-blue-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                Founder Recommended
              </div>

              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div>
                  <h3 className="text-base font-bold text-white">StoreSwift Turnkey</h3>
                  <p className="text-xs text-zinc-400">All-in-one startup SaaS</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                  <Check className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-6 space-y-4 text-xs">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Starts at $9 / month:</strong>
                    <p className="text-zinc-400">Zero large upfront investment. 14-day free trial to validate your idea.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Live in under 3 minutes:</strong>
                    <p className="text-zinc-400">Pre-seeded starter products and category configurations ready instantly.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Intuitive Merchant Admin:</strong>
                    <p className="text-zinc-400">Update stock, manage orders, and print invoices directly without coding.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">All-inclusive hosting & checkout:</strong>
                    <p className="text-zinc-400">High-speed Edge hosting, SSL, and Cash on Delivery + Stripe out of the box.</p>
                  </div>
                </div>
              </div>

              <Link
                href="/onboarding"
                className="mt-6 block text-center py-2.5 px-4 bg-white hover:bg-zinc-100 text-zinc-900 text-xs font-bold rounded-xl shadow-sm transition btn-press"
              >
                Launch Your Store Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-white border-t border-zinc-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
              Everything Your Store Needs to Make Sales
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-500">
              Powerful enterprise capabilities packaged into an effortless, uncluttered interface.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#fafafa] p-6 rounded-2xl border border-zinc-200/80 shadow-subtle interactive-card">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-zinc-900 mb-1.5">Variant Matrix Generator</h3>
              <p className="text-zinc-500 text-xs leading-relaxed">
                Add dimensions like Size and Color. StoreSwift calculates combinations and generates SKUs, prices, and stock counts automatically.
              </p>
            </div>

            <div className="bg-[#fafafa] p-6 rounded-2xl border border-zinc-200/80 shadow-subtle interactive-card">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-zinc-900 mb-1.5">Hybrid Checkout & COD</h3>
              <p className="text-zinc-500 text-xs leading-relaxed">
                Accept Cash on Delivery (COD) with 1 click, connect Stripe for credit cards, or provide local mobile money transfer instructions.
              </p>
            </div>

            <div className="bg-[#fafafa] p-6 rounded-2xl border border-zinc-200/80 shadow-subtle interactive-card">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-zinc-900 mb-1.5">Atomic Inventory Lock</h3>
              <p className="text-zinc-500 text-xs leading-relaxed">
                Database-level atomic deduction prevents double-selling and overselling when multiple customers buy at the exact same instant.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-[#fafafa] border-t border-zinc-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
              Fair, Transparent Startup Pricing
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-500">
              Pay a minimal fraction of what an agency charges. No hidden surprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Starter */}
            <div className="border border-zinc-200 rounded-2xl p-6 bg-white flex flex-col justify-between shadow-subtle">
              <div>
                <h3 className="text-sm font-bold text-zinc-900">Starter</h3>
                <p className="text-xs text-zinc-500 mt-0.5">For new businesses launching.</p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-black text-zinc-900">$9</span>
                  <span className="text-zinc-500 text-xs ml-1.5">/ month</span>
                </div>
                <ul className="mt-5 space-y-2.5 text-xs text-zinc-600">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Up to 50 active products</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Free .storeswift.com subdomain</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Cash on Delivery & Cards ready</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Variant matrix generator</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/onboarding?plan=starter"
                className="mt-6 block text-center py-2.5 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-xl transition shadow-subtle btn-press"
              >
                Choose Starter
              </Link>
            </div>

            {/* Growth */}
            <div className="border border-zinc-900 rounded-2xl p-6 bg-zinc-900 text-white shadow-card flex flex-col justify-between relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                Most Popular
              </div>
              <div>
                <h3 className="text-sm font-bold">Growth</h3>
                <p className="text-xs text-zinc-400 mt-0.5">For growing stores scaling sales.</p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-black">$29</span>
                  <span className="text-zinc-400 text-xs ml-1.5">/ month</span>
                </div>
                <ul className="mt-5 space-y-2.5 text-xs text-zinc-300">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                    <span>Up to 500 active products</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                    <span>Custom Domain Support (brand.com)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                    <span>Printable invoices & packing slips</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                    <span>0% StoreSwift transaction fees</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/onboarding?plan=growth"
                className="mt-6 block text-center py-2.5 px-4 bg-white hover:bg-zinc-100 text-zinc-900 text-xs font-bold rounded-xl shadow-sm transition btn-press"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Pro */}
            <div className="border border-zinc-200 rounded-2xl p-6 bg-white flex flex-col justify-between shadow-subtle">
              <div>
                <h3 className="text-sm font-bold text-zinc-900">Pro</h3>
                <p className="text-xs text-zinc-500 mt-0.5">For high-volume retail brands.</p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-black text-zinc-900">$79</span>
                  <span className="text-zinc-500 text-xs ml-1.5">/ month</span>
                </div>
                <ul className="mt-5 space-y-2.5 text-xs text-zinc-600">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Unlimited products & storage</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Multi-staff dashboard accounts</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Priority 24/7 technical support</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Custom store theme builder</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/onboarding?plan=pro"
                className="mt-6 block text-center py-2.5 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-xl transition shadow-subtle btn-press"
              >
                Choose Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white border-t border-zinc-200/80">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-500">
              Everything startup founders need to know about getting started.
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
                    <p className="mt-3 text-xs sm:text-sm text-zinc-500 leading-relaxed">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pre-Footer Call to Action */}
      <section className="py-16 bg-zinc-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Ready to launch your online store today?
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
            Join hundreds of startup founders who launched their business without paying thousands in agency development.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/onboarding"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 text-xs font-bold bg-white text-zinc-900 hover:bg-zinc-100 px-6 py-3 rounded-xl shadow-sm transition btn-press"
            >
              <span>Get Started in 3 Minutes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Rich Multi-Column Modern Footer */}
      <StoreFooter isPlatform storeName="StoreSwift" />
    </div>
  );
}
