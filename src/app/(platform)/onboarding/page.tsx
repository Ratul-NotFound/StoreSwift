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
  ShoppingBag,
  ExternalLink,
  Copy,
  Check,
  CreditCard,
  Banknote,
  Smartphone,
  Globe,
  Tag,
  ShieldCheck,
  CheckSquare
} from "lucide-react";
import { ALL_CATEGORIES, getCategoryConfig } from "@/config/categories";
import { isReservedSlug } from "@/config/reserved-slugs";

export default function OnboardingWizardPage() {
  const [step, setStep] = useState(1);
  const [storeName, setStoreName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [selectedCategory, setSelectedCategory] = useState("fashion");
  const [enableCod, setEnableCod] = useState(true);
  const [enableStripe, setEnableStripe] = useState(false);
  const [manualPaymentNotes, setManualPaymentNotes] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Auto-generate subdomain from store name
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
        setError("Please enter a name for your store.");
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
      manualPaymentNotes,
      createdAt: new Date().toISOString()
    };
    try {
      localStorage.setItem(`store_${subdomain}`, JSON.stringify(storeData));
      localStorage.setItem("current_store", subdomain);
    } catch {
      // LocalStorage fallback
    }
    setIsCompleted(true);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(`https://${subdomain}.storeswift.com`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeCategoryConfig = getCategoryConfig(selectedCategory);

  // Curated category cover photos for visual preview
  const categoryCovers: Record<string, string> = {
    fashion: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format&fit=crop&q=80",
    electronics: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&auto=format&fit=crop&q=80",
    grocery_food: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80",
    beauty_cosmetics: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80"
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col justify-between selection:bg-zinc-900 selection:text-white font-sans">
      {/* Top Minimalist Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-zinc-200/80 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Store className="w-4 h-4" />
            </div>
            <span className="font-bold text-zinc-900 tracking-tight text-base">
              Store<span className="text-blue-600">Swift</span>
            </span>
          </Link>

          <div className="flex items-center space-x-3">
            {!isCompleted && (
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-zinc-600 bg-zinc-100 px-3 py-1 rounded-full border border-zinc-200">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                <span>Step {step} of 3</span>
              </div>
            )}
            <Link
              href="/"
              className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition"
            >
              Exit to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Form Flow */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-10 flex flex-col justify-center">
        {!isCompleted ? (
          <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-card p-6 sm:p-10">
            {/* Step Indicators */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-zinc-100">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    step >= 1 ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-400"
                  }`}
                >
                  {step > 1 ? <Check className="w-3.5 h-3.5" /> : "1"}
                </div>
                <span className={`text-xs font-semibold ${step === 1 ? "text-zinc-900" : "text-zinc-500"}`}>
                  Store & Domain
                </span>
              </div>

              <div className="w-6 sm:w-16 h-px bg-zinc-200" />

              <div className="flex items-center space-x-2 sm:space-x-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    step >= 2 ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-400"
                  }`}
                >
                  {step > 2 ? <Check className="w-3.5 h-3.5" /> : "2"}
                </div>
                <span className={`text-xs font-semibold ${step === 2 ? "text-zinc-900" : "text-zinc-500"}`}>
                  Category
                </span>
              </div>

              <div className="w-6 sm:w-16 h-px bg-zinc-200" />

              <div className="flex items-center space-x-2 sm:space-x-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    step >= 3 ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-400"
                  }`}
                >
                  3
                </div>
                <span className={`text-xs font-semibold ${step === 3 ? "text-zinc-900" : "text-zinc-500"}`}>
                  Payments
                </span>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200/80 flex items-center space-x-2.5 text-red-700 text-xs font-medium">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* STEP 1: STORE IDENTITY */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
                    What is your store's name?
                  </h1>
                  <p className="text-xs text-zinc-500 mt-1">
                    Enter your brand name. We'll instantly assign a free web address you can start selling with today.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Store Brand Name
                    </label>
                    <input
                      type="text"
                      autoFocus
                      placeholder="e.g. Apex Apparel, ByteMart, Fresh Kitchen"
                      value={storeName}
                      onChange={(e) => handleStoreNameChange(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-zinc-900 focus:ring-4 focus:ring-zinc-950/5 outline-none text-sm text-zinc-900 transition placeholder:text-zinc-400 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Free Live Web Subdomain
                    </label>
                    <div className="flex items-center">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          placeholder="apex-apparel"
                          value={subdomain}
                          onChange={(e) => handleSubdomainChange(e.target.value)}
                          className="w-full pl-4 pr-3 py-3 rounded-l-xl border border-r-0 border-zinc-200 focus:border-zinc-900 focus:ring-4 focus:ring-zinc-950/5 outline-none text-sm text-zinc-900 transition font-medium"
                        />
                      </div>
                      <span className="bg-zinc-100 border border-zinc-200 px-4 py-3 rounded-r-xl text-zinc-600 text-xs font-mono font-medium">
                        .storeswift.com
                      </span>
                    </div>

                    {/* Live URL Pill with Availability Status */}
                    <div className="mt-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2 text-zinc-500">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Live Address:</span>
                        <span className="font-mono font-semibold text-zinc-800">
                          https://{subdomain || "yourstore"}.storeswift.com
                        </span>
                      </div>
                      {subdomain && !isReservedSlug(subdomain) && (
                        <span className="text-[11px] font-semibold text-emerald-600 flex items-center space-x-1">
                          <Check className="w-3 h-3" />
                          <span>Available</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Primary Currency
                    </label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-zinc-900 focus:ring-4 focus:ring-zinc-950/5 outline-none text-sm text-zinc-900 font-medium bg-white"
                    >
                      <option value="USD">USD ($) - US Dollar</option>
                      <option value="EUR">EUR (€) - Euro</option>
                      <option value="GBP">GBP (£) - British Pound</option>
                      <option value="BDT">BDT (৳) - Bangladeshi Taka</option>
                      <option value="INR">INR (₹) - Indian Rupee</option>
                      <option value="CAD">CAD ($) - Canadian Dollar</option>
                      <option value="AUD">AUD ($) - Australian Dollar</option>
                    </select>
                    <p className="text-[11px] text-zinc-400 mt-1">
                      You can change this anytime and connect your custom domain (mystore.com) later in Store Settings.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: CATEGORY PRESETS WITH RICH PREVIEWS */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
                    Select your business category
                  </h1>
                  <p className="text-xs text-zinc-500 mt-1">
                    StoreSwift automatically seeds your store with 3 starter products and custom variant options tailored to your niche.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {ALL_CATEGORIES.map((catKey) => {
                    const cat = getCategoryConfig(catKey);
                    const isSelected = selectedCategory === cat.id;
                    const cover = categoryCovers[cat.id] || cat.heroImage;
                    return (
                      <div
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`cursor-pointer rounded-2xl border transition-all overflow-hidden btn-press ${
                          isSelected
                            ? "border-zinc-900 ring-2 ring-zinc-900 shadow-md bg-white"
                            : "border-zinc-200 hover:border-zinc-300 bg-white"
                        }`}
                      >
                        {/* Mini cover image */}
                        <div className="relative h-24 bg-zinc-100 overflow-hidden">
                          <img
                            src={cover}
                            alt={cat.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white">
                            <span className="font-bold text-xs">{cat.name}</span>
                            {isSelected && (
                              <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow">
                                <Check className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="p-3.5">
                          <p className="text-xs text-zinc-500 line-clamp-2">
                            {cat.tagline}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-1">
                            {cat.defaultOptions.map((opt) => (
                              <span
                                key={opt}
                                className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200"
                              >
                                {opt}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/60 flex items-start space-x-3 text-xs text-blue-900">
                  <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Starter Kit Included: </span>
                    Your store starts with 3 sample {activeCategoryConfig.name} items, multi-variant matrices, and pricing so you can immediately preview and accept live orders.
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: PAYMENTS PREFERENCES */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
                    How do you want to accept payments?
                  </h1>
                  <p className="text-xs text-zinc-500 mt-1">
                    Toggle your payment methods. Startups typically begin with Cash on Delivery and manual mobile money.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {/* COD Option */}
                  <label
                    className={`flex items-start justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      enableCod
                        ? "border-zinc-900 bg-zinc-50/80 ring-1 ring-zinc-900"
                        : "border-zinc-200 hover:border-zinc-300 bg-white"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={enableCod}
                        onChange={(e) => setEnableCod(e.target.checked)}
                        className="w-4 h-4 rounded text-zinc-900 focus:ring-zinc-900 mt-0.5"
                      />
                      <div>
                        <div className="font-bold text-zinc-900 text-xs flex items-center space-x-2">
                          <span>Cash on Delivery (COD)</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                            Recommended
                          </span>
                        </div>
                        <div className="text-xs text-zinc-500 mt-0.5">
                          Customers pay in cash upon receiving their delivery. Essential for high conversion on social commerce.
                        </div>
                      </div>
                    </div>
                    <Banknote className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  </label>

                  {/* Stripe Card Option */}
                  <label
                    className={`flex items-start justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      enableStripe
                        ? "border-zinc-900 bg-zinc-50/80 ring-1 ring-zinc-900"
                        : "border-zinc-200 hover:border-zinc-300 bg-white"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={enableStripe}
                        onChange={(e) => setEnableStripe(e.target.checked)}
                        className="w-4 h-4 rounded text-zinc-900 focus:ring-zinc-900 mt-0.5"
                      />
                      <div>
                        <div className="font-bold text-zinc-900 text-xs">
                          Credit & Debit Cards (Stripe)
                        </div>
                        <div className="text-xs text-zinc-500 mt-0.5">
                          Accept Visa, Mastercard, Apple Pay, and Google Pay with instant online payment confirmation.
                        </div>
                      </div>
                    </div>
                    <CreditCard className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  </label>

                  {/* Manual / Mobile Money */}
                  <div className="p-4 rounded-xl border border-zinc-200 bg-white">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="font-bold text-zinc-900 text-xs">
                        Manual Mobile Money / Bank Transfer (bKash, Nagad, UPI, Wire)
                      </div>
                      <Smartphone className="w-4 h-4 text-purple-600" />
                    </div>
                    <p className="text-xs text-zinc-500 mb-2.5">
                      Optional: Paste payment instructions and mobile numbers for customers to send funds before dispatch.
                    </p>
                    <textarea
                      rows={2}
                      placeholder="e.g. bKash Merchant: 01700-000000 (Enter Order ID as reference number)"
                      value={manualPaymentNotes}
                      onChange={(e) => setManualPaymentNotes(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-lg outline-none focus:border-zinc-900 font-medium placeholder:text-zinc-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="mt-8 pt-6 border-t border-zinc-100 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900 px-3 py-2 rounded-lg transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="inline-flex items-center space-x-2 text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-white px-5 py-2.5 rounded-xl shadow-sm transition btn-press"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinishLaunch}
                  className="inline-flex items-center space-x-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl shadow-sm transition btn-press"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Launch My Store</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* CELEBRATION / LAUNCH COMPLETE SCREEN */
          <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-card p-8 sm:p-12 text-center max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-5 border border-emerald-200/80 shadow-sm">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
              Your store is officially live!
            </h2>

            <p className="text-xs text-zinc-500 mt-2 max-w-sm mx-auto leading-relaxed">
              <span className="font-semibold text-zinc-800">{storeName}</span> has been provisioned with 3 starter products, category presets, and payment settings.
            </p>

            {/* Live Link Box */}
            <div className="my-6 p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between text-xs">
              <span className="font-mono text-zinc-800 font-semibold truncate mr-2">
                https://{subdomain}.storeswift.com
              </span>
              <button
                onClick={handleCopyUrl}
                className="text-zinc-600 hover:text-zinc-900 p-1.5 rounded-lg hover:bg-zinc-200/60 transition flex items-center space-x-1"
                title="Copy link"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[10px] font-medium">{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`/admin?store=${subdomain}`}
                className="flex-1 inline-flex items-center justify-center space-x-2 text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-white py-3 px-4 rounded-xl shadow-sm transition btn-press"
              >
                <span>Merchant Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href={`/store/${subdomain}`}
                className="flex-1 inline-flex items-center justify-center space-x-2 text-xs font-semibold bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-800 py-3 px-4 rounded-xl transition btn-press"
              >
                <span>View Storefront</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </main>

      <footer className="py-6 text-center text-xs text-zinc-400">
        StoreSwift SaaS Platform • 14-Day Free Trial
      </footer>
    </div>
  );
}
