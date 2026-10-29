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
  Check,
  X,
  Star,
  Globe,
  Lock,
  Smartphone,
  ChevronRight
} from "lucide-react";
import { ALL_CATEGORIES, getCategoryConfig } from "@/config/categories";

export default function PlatformLandingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [activeCategoryTab, setActiveCategoryTab] = useState("fashion");

  const activeCategory = getCategoryConfig(activeCategoryTab);

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/25">
              <Store className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white">
              Store<span className="text-blue-500">Swift</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-xs font-bold uppercase tracking-wider text-slate-400">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#categories" className="hover:text-white transition">Templates</a>
            <a href="#comparison" className="hover:text-white transition">Why Us</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
          </nav>

          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="text-xs font-bold text-slate-300 hover:text-white px-3 py-2 rounded-xl transition"
            >
              Merchant Login
            </Link>
            <Link
              href="/onboarding"
              className="inline-flex items-center space-x-2 text-xs font-black bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-2xl shadow-xl shadow-blue-600/30 transition transform hover:-translate-y-0.5 uppercase tracking-wider"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-24 lg:pt-32 lg:pb-36 bg-grid-pattern">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-950/80 border border-blue-800 text-blue-300 text-xs font-bold mb-8">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Turnkey eCommerce for Bootstrapped Startups</span>
          </div>

          <h1 className="text-4xl sm:text-7xl font-black text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
            From Idea to Live Store in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-teal-300">
              3 Minutes.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            No expensive agency invoices. No complex server setups. Pick your business category, customize your colors, and get a professional online shop with Cash on Delivery & Stripe card checkout today.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/onboarding"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 text-sm font-black bg-blue-600 hover:bg-blue-500 text-white px-9 py-4 rounded-2xl shadow-xl shadow-blue-600/30 transition transform hover:-translate-y-0.5 uppercase tracking-wider"
            >
              <span>Launch Your Store (14 Days Free)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/store/apex-fashion"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 text-sm font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 px-8 py-4 rounded-2xl shadow-lg transition"
            >
              <span>Explore Live Demo Store</span>
            </Link>
          </div>

          <div className="mt-14 flex flex-wrap items-center justify-center gap-8 text-xs font-semibold text-slate-400">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>No credit card required to start</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Free instant .storeswift.com subdomain</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Cash on Delivery & Cards pre-configured</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Category Showcase */}
      <section id="categories" className="py-24 bg-slate-900 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Tailored For Your Niche</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
              Select Your Category Preset
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Each preset auto-configures your catalog schemas, attribute variant matrixes, and layout blocks.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-12 overflow-x-auto pb-2">
            {ALL_CATEGORIES.map((catKey) => {
              const cat = getCategoryConfig(catKey);
              const isActive = activeCategoryTab === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryTab(cat.id)}
                  className={`px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition whitespace-nowrap ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                      : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Active Category Display */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {activeCategory.sampleProducts.map((p, idx) => (
              <div
                key={idx}
                className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden p-6 flex flex-col justify-between hover:border-slate-700 transition"
              >
                <div>
                  <img
                    src={p.imageUrl}
                    alt={p.title}
                    className="w-full h-48 object-cover rounded-2xl mb-4"
                  />
                  <div className="flex items-center space-x-1 text-amber-400 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                    <span className="text-[11px] font-bold text-slate-400 ml-1">{p.rating}</span>
                  </div>
                  <h3 className="font-bold text-white text-base">{p.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{p.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="text-xl font-black text-white">${p.basePrice}</div>
                  <Link
                    href={`/onboarding?category=${activeCategory.id}`}
                    className="text-xs font-black text-blue-400 hover:text-blue-300 uppercase tracking-wider flex items-center space-x-1"
                  >
                    <span>Launch This →</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison: Custom Agency vs StoreSwift */}
      <section id="comparison" className="py-24 bg-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Save Time & Money</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
              Custom Agency vs StoreSwift
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Why startups choose StoreSwift over spending thousands on custom development.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950 border-b border-slate-800 text-xs font-bold uppercase text-slate-400">
                <tr>
                  <th className="px-6 py-4">Feature / Benefit</th>
                  <th className="px-6 py-4 text-slate-400">Traditional Agency</th>
                  <th className="px-6 py-4 text-blue-400 font-black">StoreSwift Platform</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                <tr>
                  <td className="px-6 py-4 font-bold text-white">Upfront Development Cost</td>
                  <td className="px-6 py-4 text-slate-400">$3,000 – $10,000+</td>
                  <td className="px-6 py-4 font-black text-emerald-400">$0 ($9/mo subscription)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-bold text-white">Time to Launch</td>
                  <td className="px-6 py-4 text-slate-400">4 to 12 weeks</td>
                  <td className="px-6 py-4 font-black text-emerald-400">Under 3 minutes</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-bold text-white">Inventory & Variant Matrix</td>
                  <td className="px-6 py-4 text-slate-400">Bespoke plugins / fragile</td>
                  <td className="px-6 py-4 font-black text-emerald-400">Cartesian Matrix Built-in</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-bold text-white">Server & Security Updates</td>
                  <td className="px-6 py-4 text-slate-400">Requires dev retainer</td>
                  <td className="px-6 py-4 font-black text-emerald-400">100% Managed & Automated</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-bold text-white">Cash on Delivery & Cards</td>
                  <td className="px-6 py-4 text-slate-400">Custom integration setup</td>
                  <td className="px-6 py-4 font-black text-emerald-400">1-Click Ready</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Simple & Predictable</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
              Affordable Plans for Growing Brands
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Start with our 14-day free trial. Upgrade or cancel anytime with one click.
            </p>

            {/* Monthly / Annual Toggle */}
            <div className="inline-flex items-center space-x-3 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 mt-6">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-2 rounded-xl text-xs font-black transition ${
                  billingCycle === "monthly" ? "bg-blue-600 text-white shadow" : "text-slate-400"
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle("annual")}
                className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center space-x-1 ${
                  billingCycle === "annual" ? "bg-blue-600 text-white shadow" : "text-slate-400"
                }`}
              >
                <span>Annual (Save 20%)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-black text-white">Starter</h3>
                <p className="text-xs text-slate-400 mt-1">For new founders testing products.</p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-black text-white">
                    {billingCycle === "annual" ? "$7" : "$9"}
                  </span>
                  <span className="text-slate-500 text-xs ml-2">/ month</span>
                </div>
                <ul className="mt-6 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Up to 50 active products</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Free .storeswift.com subdomain</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Cash on Delivery & Stripe Cards</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Variant matrix generator</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/onboarding?plan=starter"
                className="mt-8 block text-center py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs rounded-2xl transition uppercase tracking-wider"
              >
                Choose Starter
              </Link>
            </div>

            {/* Growth (Featured) */}
            <div className="bg-slate-950 border-2 border-blue-500 rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider shadow">
                Most Popular
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Growth</h3>
                <p className="text-xs text-slate-400 mt-1">For scaling stores and serious revenue.</p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-black text-white">
                    {billingCycle === "annual" ? "$23" : "$29"}
                  </span>
                  <span className="text-slate-500 text-xs ml-2">/ month</span>
                </div>
                <ul className="mt-6 space-y-3 text-xs text-slate-200">
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-blue-400" />
                    <span>Up to 500 active products</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-blue-400" />
                    <span>Custom domain support (yourbrand.com)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-blue-400" />
                    <span>All payment gateways + Mobile Money</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-blue-400" />
                    <span>Printable packing slips & invoices</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/onboarding?plan=growth"
                className="mt-8 block text-center py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-2xl shadow-xl shadow-blue-600/30 transition uppercase tracking-wider"
              >
                Start 14-Day Free Trial
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-black text-white">Pro</h3>
                <p className="text-xs text-slate-400 mt-1">For high-volume retail merchants.</p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-black text-white">
                    {billingCycle === "annual" ? "$63" : "$79"}
                  </span>
                  <span className="text-slate-500 text-xs ml-2">/ month</span>
                </div>
                <ul className="mt-6 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Unlimited products & storage</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Multi-staff dashboard accounts</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>0% platform transaction fees</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Priority 24/7 founder support</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/onboarding?plan=pro"
                className="mt-8 block text-center py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs rounded-2xl transition uppercase tracking-wider"
              >
                Choose Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-white font-bold">
            <Store className="w-5 h-5 text-blue-500" />
            <span>StoreSwift Platform</span>
          </div>
          <p>© 2026 StoreSwift. Built for startups and independent brands worldwide.</p>
        </div>
      </footer>
    </div>
  );
}
