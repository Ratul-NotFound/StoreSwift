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
  Palette,
  Flame
} from "lucide-react";
import { ALL_CATEGORIES, getCategoryConfig } from "@/config/categories";
import { STORE_TEMPLATES, ALL_TEMPLATES } from "@/config/templates";
import { isReservedSlug } from "@/config/reserved-slugs";
import { StoreFooter } from "@/components/footer";

export default function OnboardingWizardPage() {
  const [step, setStep] = useState(1);
  const [storeName, setStoreName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [selectedCategory, setSelectedCategory] = useState("fashion");
  const [selectedTemplate, setSelectedTemplate] = useState("minimal");
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

  const handleCategorySelect = (catKey: string) => {
    setSelectedCategory(catKey);
    const cat = getCategoryConfig(catKey);
    if (cat.recommendedTemplate) {
      setSelectedTemplate(cat.recommendedTemplate);
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
      template: selectedTemplate,
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
    const fullUrl = `https://${subdomain}.storeswift.com`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans selection:bg-zinc-900 selection:text-white">
      {/* Top Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-zinc-200/80 py-4 px-6 sticky top-0 z-30 shadow-subtle">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Store className="w-4 h-4" />
            </div>
            <span className="font-bold text-zinc-900 tracking-tight text-sm">
              Store<span className="text-blue-600">Swift</span>
            </span>
          </Link>

          {!isCompleted && (
            <div className="flex items-center space-x-4">
              <div className="text-xs font-semibold text-zinc-600 bg-zinc-100 px-3 py-1 rounded-full flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <span>Step {step} of 3</span>
              </div>
              <Link href="/" className="text-xs text-zinc-400 hover:text-zinc-700 transition">
                Exit to Home
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Main Form Box */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-10 flex flex-col justify-center">
        {!isCompleted ? (
          <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-card p-6 sm:p-10 transition-all">
            {/* Steps Progress Indicator */}
            <div className="flex items-center justify-center space-x-3 sm:space-x-8 mb-8 pb-6 border-b border-zinc-100">
              <div className="flex items-center space-x-2">
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

              <div className="w-6 sm:w-12 h-px bg-zinc-200" />

              <div className="flex items-center space-x-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    step >= 2 ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-400"
                  }`}
                >
                  {step > 2 ? <Check className="w-3.5 h-3.5" /> : "2"}
                </div>
                <span className={`text-xs font-semibold ${step === 2 ? "text-zinc-900" : "text-zinc-500"}`}>
                  Niche & Template
                </span>
              </div>

              <div className="w-6 sm:w-12 h-px bg-zinc-200" />

              <div className="flex items-center space-x-2">
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

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center space-x-2 text-red-700 text-xs font-medium">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* STEP 1: STORE NAME & SUBDOMAIN */}
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
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                      Store Brand Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Apex Apparel, ByteMart, Velvet Glow"
                      value={storeName}
                      onChange={(e) => handleStoreNameChange(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-zinc-900 focus:ring-4 focus:ring-zinc-950/5 outline-none text-sm text-zinc-900 font-medium placeholder:text-zinc-400 transition"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                      Free Live Web Subdomain
                    </label>
                    <div className="flex rounded-xl border border-zinc-200 overflow-hidden focus-within:border-zinc-900 focus-within:ring-4 focus-within:ring-zinc-950/5 transition">
                      <input
                        type="text"
                        placeholder="your-brand"
                        value={subdomain}
                        onChange={(e) => handleSubdomainChange(e.target.value)}
                        className="flex-1 px-4 py-3 outline-none text-sm font-medium text-zinc-900 placeholder:text-zinc-400 bg-white"
                      />
                      <span className="bg-zinc-100 px-4 py-3 text-xs font-bold text-zinc-500 border-l border-zinc-200 flex items-center">
                        .storeswift.com
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1.5 flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                      <span>Live Address: https://{subdomain || "yourstore"}.storeswift.com</span>
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
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
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: CATEGORY & STOREFRONT TEMPLATE SELECTION */}
            {step === 2 && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
                    Select your business category & theme
                  </h1>
                  <p className="text-xs text-zinc-500 mt-1">
                    StoreSwift seeds your store with starter products, variant options, and pre-built design aesthetics tailored to your niche.
                  </p>
                </div>

                {/* Section A: Industry / Category Cards */}
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-700 mb-3 flex items-center space-x-1.5">
                    <Tag className="w-3.5 h-3.5 text-zinc-400" />
                    <span>1. Choose Business Category</span>
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {ALL_CATEGORIES.map((catKey) => {
                      const cat = getCategoryConfig(catKey);
                      const isSelected = selectedCategory === cat.id;

                      return (
                        <div
                          key={cat.id}
                          onClick={() => handleCategorySelect(cat.id)}
                          className={`cursor-pointer rounded-2xl border p-3.5 transition-all text-left btn-press ${
                            isSelected
                              ? "border-zinc-900 ring-2 ring-zinc-900 shadow-md bg-white"
                              : "border-zinc-200 hover:border-zinc-300 bg-white"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-bold text-xs text-zinc-900">{cat.name}</span>
                            {isSelected && (
                              <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow">
                                <Check className="w-2.5 h-2.5" />
                              </div>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed">
                            {cat.tagline}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Section B: Storefront Design Template */}
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-700 mb-3 flex items-center space-x-1.5">
                    <Palette className="w-3.5 h-3.5 text-zinc-400" />
                    <span>2. Choose Storefront Design Template</span>
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {ALL_TEMPLATES.map((tKey) => {
                      const tmpl = STORE_TEMPLATES[tKey];
                      const isSelected = selectedTemplate === tKey;

                      return (
                        <div
                          key={tKey}
                          onClick={() => setSelectedTemplate(tKey)}
                          className={`cursor-pointer rounded-2xl border overflow-hidden transition-all text-left btn-press ${
                            isSelected
                              ? "border-zinc-900 ring-2 ring-zinc-900 shadow-md bg-white"
                              : "border-zinc-200 hover:border-zinc-300 bg-white"
                          }`}
                        >
                          {/* Banner preview */}
                          <div className={`h-16 bg-gradient-to-r ${tmpl.previewBg} p-3 flex items-center justify-between text-white`}>
                            <span className="font-black text-xs tracking-tight">{tmpl.name}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm">
                              {tmpl.badge}
                            </span>
                          </div>

                          <div className="p-3.5 space-y-1">
                            <p className="text-xs font-semibold text-zinc-800">{tmpl.tagline}</p>
                            <p className="text-[11px] text-zinc-400 leading-relaxed">{tmpl.description}</p>
                            <div className="pt-2 flex items-center justify-between text-[10px] text-zinc-500">
                              <span>Fit: {tmpl.categoryFit}</span>
                              {isSelected && <span className="font-bold text-emerald-600 flex items-center space-x-1"><Check className="w-3 h-3" /> Selected</span>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: PAYMENT GATEWAY CONFIGURATION */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
                    How do you want to accept payments?
                  </h1>
                  <p className="text-xs text-zinc-500 mt-1">
                    StoreSwift enables instant checkout out of the box with zero transaction fees.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div
                    onClick={() => setEnableCod(!enableCod)}
                    className={`p-4 rounded-xl border cursor-pointer transition flex items-start space-x-3.5 ${
                      enableCod
                        ? "border-zinc-900 bg-zinc-50/70 ring-1 ring-zinc-900"
                        : "border-zinc-200 hover:border-zinc-300 bg-white"
                    }`}
                  >
                    <div className="pt-0.5">
                      <Banknote className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-zinc-900">
                          Cash on Delivery (COD)
                        </span>
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                          Highest Conversion
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        Customers pay when their order is delivered to their doorstep. 1-click checkout with zero payment friction.
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => setEnableStripe(!enableStripe)}
                    className={`p-4 rounded-xl border cursor-pointer transition flex items-start space-x-3.5 ${
                      enableStripe
                        ? "border-zinc-900 bg-zinc-50/70 ring-1 ring-zinc-900"
                        : "border-zinc-200 hover:border-zinc-300 bg-white"
                    }`}
                  >
                    <div className="pt-0.5">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-zinc-900">
                          Credit / Debit Card (Stripe)
                        </span>
                        <span className="text-[10px] font-semibold bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full">
                          Global Cards
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        Accept Visa, Mastercard, American Express, Apple Pay, and Google Pay worldwide.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                      Manual Bank Transfer / Mobile Money Notes
                    </label>
                    <textarea
                      placeholder="e.g. bKash / Nagad / Zelle / Wire instructions for customers"
                      value={manualPaymentNotes}
                      onChange={(e) => setManualPaymentNotes(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:border-zinc-900 outline-none text-xs text-zinc-800 h-20 resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Button Footer */}
            <div className="mt-10 pt-6 border-t border-zinc-100 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900 flex items-center space-x-1.5 transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center space-x-1.5 btn-press"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinishLaunch}
                  className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center space-x-1.5 btn-press"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Launch My Live Store</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* COMPLETION SUCCESS SCREEN */
          <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-card p-8 sm:p-12 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-5 shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
              Your store is officially live!
            </h2>

            <p className="text-xs text-zinc-500 mt-2 max-w-sm mx-auto leading-relaxed">
              <span className="font-semibold text-zinc-800">{storeName}</span> has been provisioned with starter products, category presets, and payment settings.
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

      {/* Rich Multi-Column Footer */}
      <StoreFooter isPlatform storeName="StoreSwift" />
    </div>
  );
}
