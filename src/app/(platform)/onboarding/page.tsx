"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Store,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  Banknote,
  Smartphone,
  Check,
  Layers,
  ShoppingBag,
  Globe,
  Monitor
} from "lucide-react";
import { ALL_CATEGORIES, getCategoryConfig } from "@/config/categories";
import { isReservedSlug } from "@/config/reserved-slugs";

export default function OnboardingWizardPage() {
  const [step, setStep] = useState(1);
  const [storeName, setStoreName] = useState("Aura Apparel");
  const [subdomain, setSubdomain] = useState("aura-apparel");
  const [currency, setCurrency] = useState("USD");
  const [selectedCategory, setSelectedCategory] = useState("fashion");
  const [enableCod, setEnableCod] = useState(true);
  const [enableStripe, setEnableStripe] = useState(true);
  const [enableManual, setEnableManual] = useState(false);
  const [manualPaymentNotes, setManualPaymentNotes] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeCategoryConfig = getCategoryConfig(selectedCategory);

  const handleStoreNameChange = (name: string) => {
    setStoreName(name);
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    setSubdomain(slug);
    setError(null);
  };

  const handleSubdomainChange = (val: string) => {
    const clean = val.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setSubdomain(clean);
    if (isReservedSlug(clean)) {
      setError(`"${clean}" is a reserved system address. Please choose another.`);
    } else {
      setError(null);
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!storeName.trim()) {
        setError("Please enter your store brand name.");
        return;
      }
      if (!subdomain.trim()) {
        setError("Please enter a subdomain slug.");
        return;
      }
      if (isReservedSlug(subdomain)) {
        setError(`"${subdomain}" is reserved. Please pick another name.`);
        return;
      }
    }
    setError(null);
    setStep(step + 1);
  };

  const handleFinishLaunch = () => {
    const storeData = {
      name: storeName,
      slug: subdomain,
      category: selectedCategory,
      currency,
      enableCod,
      enableStripe,
      enableManual,
      manualPaymentNotes,
      createdAt: new Date().toISOString()
    };
    try {
      localStorage.setItem(`store_${subdomain}`, JSON.stringify(storeData));
      localStorage.setItem("current_store", subdomain);
    } catch {}
    setIsCompleted(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Modern Top Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/25">
              <Store className="w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tight text-white">
              Store<span className="text-blue-500">Swift</span>
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            <span className="text-xs font-semibold text-slate-400 bg-slate-800/80 border border-slate-700/80 px-3 py-1.5 rounded-full">
              {isCompleted ? "✨ Ready to Sell" : `Milestone ${step} of 3`}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col justify-center">
        {!isCompleted ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Interactive Form (7 Cols) */}
            <div className="lg:col-span-7 bg-slate-950 border border-slate-800/90 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
              {/* Top ambient glow */}
              <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

              {/* Progress Steps Header */}
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-800/80">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      step >= 1 ? "bg-blue-600 text-white ring-4 ring-blue-600/20" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    1
                  </div>
                  <span className={`text-xs font-bold ${step >= 1 ? "text-white" : "text-slate-500"}`}>
                    Store Identity
                  </span>
                </div>
                <div className="w-8 sm:w-16 h-0.5 bg-slate-800" />
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      step >= 2 ? "bg-blue-600 text-white ring-4 ring-blue-600/20" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    2
                  </div>
                  <span className={`text-xs font-bold ${step >= 2 ? "text-white" : "text-slate-500"}`}>
                    Category Presets
                  </span>
                </div>
                <div className="w-8 sm:w-16 h-0.5 bg-slate-800" />
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      step >= 3 ? "bg-blue-600 text-white ring-4 ring-blue-600/20" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    3
                  </div>
                  <span className={`text-xs font-bold ${step >= 3 ? "text-white" : "text-slate-500"}`}>
                    Payments
                  </span>
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-2xl bg-red-950/60 border border-red-800/80 flex items-center space-x-3 text-red-300 text-xs font-medium animate-shake">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              {/* STEP 1: Store Basics */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <span className="text-blue-500 text-xs font-bold uppercase tracking-wider">Step 1</span>
                    <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                      Give Your Store a Name
                    </h1>
                    <p className="text-slate-400 text-xs sm:text-sm mt-1">
                      Choose your brand name and your instant StoreSwift web address.
                    </p>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Store Name
                      </label>
                      <input
                        type="text"
                        value={storeName}
                        onChange={(e) => handleStoreNameChange(e.target.value)}
                        placeholder="e.g. Aura Apparel, TechCore, Green Meadow"
                        className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3.5 text-white font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Free Subdomain Address
                      </label>
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={subdomain}
                          onChange={(e) => handleSubdomainChange(e.target.value)}
                          placeholder="aura-apparel"
                          className="flex-1 bg-slate-900 border border-r-0 border-slate-700 rounded-l-2xl px-4 py-3.5 text-white font-mono text-sm outline-none focus:border-blue-500 transition"
                        />
                        <span className="bg-slate-800 border border-l-0 border-slate-700 px-4 py-3.5 rounded-r-2xl text-slate-400 font-mono text-xs font-semibold">
                          .storeswift.com
                        </span>
                      </div>
                      <div className="flex items-center space-x-1.5 mt-2 text-[11px] text-slate-400 font-mono">
                        <Globe className="w-3.5 h-3.5 text-blue-400" />
                        <span>Live Preview: https://{subdomain || "yourbrand"}.storeswift.com</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Store Base Currency
                      </label>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3.5 text-white font-medium outline-none focus:border-blue-500 transition cursor-pointer"
                      >
                        <option value="USD">USD ($) — US Dollar</option>
                        <option value="EUR">EUR (€) — Euro</option>
                        <option value="GBP">GBP (£) — British Pound</option>
                        <option value="BDT">BDT (৳) — Bangladeshi Taka</option>
                        <option value="INR">INR (₹) — Indian Rupee</option>
                        <option value="CAD">CAD ($) — Canadian Dollar</option>
                        <option value="AUD">AUD ($) — Australian Dollar</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Category Presets */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <span className="text-blue-500 text-xs font-bold uppercase tracking-wider">Step 2</span>
                    <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                      Choose Your Business Category
                    </h1>
                    <p className="text-slate-400 text-xs sm:text-sm mt-1">
                      We pre-load your store with starter products, attribute matrixes, and layout blocks.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {ALL_CATEGORIES.map((catKey) => {
                      const cat = getCategoryConfig(catKey);
                      const isSelected = selectedCategory === cat.id;
                      return (
                        <div
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`cursor-pointer p-5 rounded-2xl border-2 transition-all relative overflow-hidden flex flex-col justify-between ${
                            isSelected
                              ? "border-blue-500 bg-blue-950/40 ring-4 ring-blue-500/10 shadow-lg"
                              : "border-slate-800 hover:border-slate-700 bg-slate-900/60"
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-bold text-white text-base">{cat.name}</h3>
                              {isSelected ? (
                                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white">
                                  <Check className="w-3.5 h-3.5" />
                                </div>
                              ) : (
                                <div className="w-5 h-5 rounded-full border border-slate-700" />
                              )}
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">{cat.tagline}</p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                            {cat.defaultOptions.map((opt) => (
                              <span
                                key={opt}
                                className="text-[10px] bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-md text-slate-300 font-medium"
                              >
                                {opt}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-800/60 flex items-start space-x-3 text-xs text-blue-200">
                    <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Auto-Seeded Catalog: </strong>
                      Includes 3 sample {activeCategoryConfig.name} products with realistic variants, prices, and stock so your storefront is 100% ready to launch.
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Payment Preferences */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <span className="text-blue-500 text-xs font-bold uppercase tracking-wider">Step 3</span>
                    <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                      Payment Setup
                    </h1>
                    <p className="text-slate-400 text-xs sm:text-sm mt-1">
                      Select how your buyers will pay. You can enable multiple options or adjust this in settings.
                    </p>
                  </div>

                  <div className="space-y-3.5">
                    {/* COD */}
                    <div
                      onClick={() => setEnableCod(!enableCod)}
                      className={`cursor-pointer p-4 rounded-2xl border-2 transition flex items-center justify-between ${
                        enableCod ? "border-emerald-500 bg-emerald-950/20" : "border-slate-800 bg-slate-900/60"
                      }`}
                    >
                      <div className="flex items-center space-x-3.5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
                          <Banknote className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">Cash on Delivery (COD)</div>
                          <div className="text-xs text-slate-400">Customers pay cash upon door delivery. Perfect for startup conversions.</div>
                        </div>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          enableCod ? "bg-emerald-600 text-white" : "border border-slate-700"
                        }`}
                      >
                        {enableCod && <Check className="w-4 h-4" />}
                      </div>
                    </div>

                    {/* Stripe */}
                    <div
                      onClick={() => setEnableStripe(!enableStripe)}
                      className={`cursor-pointer p-4 rounded-2xl border-2 transition flex items-center justify-between ${
                        enableStripe ? "border-blue-500 bg-blue-950/20" : "border-slate-800 bg-slate-900/60"
                      }`}
                    >
                      <div className="flex items-center space-x-3.5">
                        <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-800 flex items-center justify-center text-blue-400">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">Credit / Debit Card (Stripe)</div>
                          <div className="text-xs text-slate-400">Accept Visa, Mastercard, Apple Pay, and Google Pay securely.</div>
                        </div>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          enableStripe ? "bg-blue-600 text-white" : "border border-slate-700"
                        }`}
                      >
                        {enableStripe && <Check className="w-4 h-4" />}
                      </div>
                    </div>

                    {/* Manual Transfer */}
                    <div
                      onClick={() => setEnableManual(!enableManual)}
                      className={`cursor-pointer p-4 rounded-2xl border-2 transition flex items-center justify-between ${
                        enableManual ? "border-purple-500 bg-purple-950/20" : "border-slate-800 bg-slate-900/60"
                      }`}
                    >
                      <div className="flex items-center space-x-3.5">
                        <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-800 flex items-center justify-center text-purple-400">
                          <Smartphone className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">Mobile Money / Bank Wire</div>
                          <div className="text-xs text-slate-400">Accept bKash, Nagad, UPI, or Direct Bank Wire with transaction ID verification.</div>
                        </div>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          enableManual ? "bg-purple-600 text-white" : "border border-slate-700"
                        }`}
                      >
                        {enableManual && <Check className="w-4 h-4" />}
                      </div>
                    </div>

                    {enableManual && (
                      <div className="p-4 bg-purple-950/30 border border-purple-800/60 rounded-2xl">
                        <label className="block text-xs font-bold text-purple-300 uppercase mb-2">
                          Your Payment Account Instructions:
                        </label>
                        <textarea
                          rows={2}
                          placeholder="e.g. Send payment to bKash/Nagad: 01700-000000 (Enter Order Number as Reference)"
                          value={manualPaymentNotes}
                          onChange={(e) => setManualPaymentNotes(e.target.value)}
                          className="w-full bg-slate-900 border border-purple-800/80 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-purple-500"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Actions */}
              <div className="mt-10 pt-6 border-t border-slate-800 flex items-center justify-between">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="inline-flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-white px-4 py-2.5 rounded-xl transition"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                ) : (
                  <div />
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="inline-flex items-center space-x-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white px-7 py-3.5 rounded-xl shadow-lg shadow-blue-600/30 transition transform hover:-translate-y-0.5"
                  >
                    <span>Continue to Step {step + 1}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFinishLaunch}
                    className="inline-flex items-center space-x-2 text-xs font-black bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white px-8 py-3.5 rounded-xl shadow-xl shadow-emerald-500/25 transition transform hover:-translate-y-0.5 uppercase tracking-wider"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Launch Storefront Now</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right: Live Mockup Preview Window (5 Cols) */}
            <div className="lg:col-span-5 sticky top-24">
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <Monitor className="w-4 h-4 text-blue-400" />
                    <span>Live Interactive Preview</span>
                  </div>
                  <span className="text-[10px] font-mono bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded">
                    Instant SSR
                  </span>
                </div>

                {/* Mock Browser Frame */}
                <div className="rounded-2xl border border-slate-700 bg-slate-900 overflow-hidden shadow-xl">
                  {/* Browser Bar */}
                  <div className="bg-slate-950 px-3 py-2 border-b border-slate-800 flex items-center space-x-2">
                    <div className="flex space-x-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <div className="flex-1 bg-slate-900 px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 text-center truncate">
                      https://{subdomain || "yourbrand"}.storeswift.com
                    </div>
                  </div>

                  {/* Browser Body Preview */}
                  <div className="p-4 bg-slate-900 text-slate-100 space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="font-black text-sm text-white tracking-tight">{storeName || "My Store"}</div>
                      <ShoppingBag className="w-4 h-4 text-blue-400" />
                    </div>

                    {/* Banner */}
                    <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900 to-indigo-950 text-center text-white">
                      <div className="text-[10px] uppercase font-bold text-blue-300 tracking-wider">
                        {activeCategoryConfig.name}
                      </div>
                      <div className="text-sm font-black mt-0.5">Discover Quality Goods</div>
                    </div>

                    {/* Sample Product Cards */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {activeCategoryConfig.sampleProducts.slice(0, 2).map((p, idx) => (
                        <div key={idx} className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                          <img
                            src={p.imageUrl}
                            alt={p.title}
                            className="w-full h-16 object-cover rounded-lg mb-1.5"
                          />
                          <div className="text-[10px] font-bold text-slate-200 truncate">{p.title}</div>
                          <div className="text-[11px] font-black text-emerald-400 mt-0.5">${p.basePrice}</div>
                        </div>
                      ))}
                    </div>

                    <div className="text-center pt-2 text-[10px] text-slate-500">
                      Payment badges: {enableCod ? "COD ✓ " : ""}{enableStripe ? "Stripe ✓ " : ""}{enableManual ? "Mobile Pay ✓" : ""}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* CELEBRATION LAUNCH SCREEN */
          <div className="bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl p-8 sm:p-14 text-center max-w-xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/25">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Your Store is Officially Live!
            </h2>

            <p className="text-slate-400 text-sm mt-3">
              <strong className="text-white">{storeName}</strong> has been provisioned with 3 {activeCategoryConfig.name} products, variant matrix templates, and instant checkout.
            </p>

            <div className="my-6 p-4 rounded-2xl bg-slate-900 border border-slate-800 text-sm font-mono text-blue-400 font-bold break-all flex items-center justify-center space-x-2">
              <Globe className="w-4 h-4 text-blue-400" />
              <span>https://{subdomain}.storeswift.com</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Link
                href={`/admin?store=${subdomain}`}
                className="flex-1 inline-flex items-center justify-center space-x-2 text-xs font-black bg-blue-600 hover:bg-blue-500 text-white py-4 px-5 rounded-2xl shadow-lg shadow-blue-600/30 transition uppercase tracking-wider"
              >
                <span>Open Admin Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={`/store/${subdomain}`}
                target="_blank"
                className="flex-1 inline-flex items-center justify-center space-x-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 py-4 px-5 rounded-2xl transition"
              >
                <span>View Public Storefront</span>
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-800/80 text-center text-xs text-slate-500">
        StoreSwift SaaS Engine • 14-Day Free Trial • No Credit Card Required
      </footer>
    </div>
  );
}
