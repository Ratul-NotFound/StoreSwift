"use client";

import { useState } from "react";
import Link from "next/link";
import { Store, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, Sparkles, ShoppingBag, ShieldCheck, ExternalLink } from "lucide-react";
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
        setError("Please enter your store name.");
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
    // Save to localStorage so admin and store recognize it immediately
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

  const activeCategoryConfig = getCategoryConfig(selectedCategory);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              <Store className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-slate-900 tracking-tight">StoreSwift</span>
          </Link>
          <div className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
            {isCompleted ? "Store Active" : `Step ${step} of 3`}
          </div>
        </div>
      </header>

      {/* Main Wizard Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-10 flex flex-col justify-center">
        {!isCompleted ? (
          <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xl shadow-slate-200/50 p-6 sm:p-10">
            {/* Step Progress Bar */}
            <div className="w-full bg-slate-100 h-2 rounded-full mb-8 overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center space-x-3 text-red-700 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* STEP 1: Store Basics */}
            {step === 1 && (
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Name Your Store & Subdomain
                </h1>
                <p className="text-slate-600 text-sm mt-1 mb-8">
                  Choose a memorable brand name and your instant web address.
                </p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Store Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Apex Apparel, ByteMart, Fresh Farms"
                      value={storeName}
                      onChange={(e) => handleStoreNameChange(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Your Free Subdomain
                    </label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        placeholder="apex-apparel"
                        value={subdomain}
                        onChange={(e) => handleSubdomainChange(e.target.value)}
                        className="flex-1 px-4 py-3 border border-r-0 border-slate-300 rounded-l-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 font-medium"
                      />
                      <span className="bg-slate-100 border border-l-0 border-slate-300 px-4 py-3 rounded-r-xl text-slate-500 font-medium text-sm">
                        .platform.com
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      Live store will be immediately accessible at{" "}
                      <span className="font-semibold text-slate-700">
                        {subdomain ? `${subdomain}.platform.com` : "yourstore.platform.com"}
                      </span>
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Store Currency
                    </label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 font-medium bg-white"
                    >
                      <option value="USD">USD ($) - US Dollar</option>
                      <option value="EUR">EUR (€) - Euro</option>
                      <option value="GBP">GBP (£) - British Pound</option>
                      <option value="BDT">BDT (৳) - Bangladeshi Taka</option>
                      <option value="INR">INR (₹) - Indian Rupee</option>
                      <option value="CAD">CAD ($) - Canadian Dollar</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Category Presets */}
            {step === 2 && (
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Choose Business Category
                </h1>
                <p className="text-slate-600 text-sm mt-1 mb-8">
                  We pre-seed starter products, layout sections, and variant templates tailored to your niche.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ALL_CATEGORIES.map((catKey) => {
                    const cat = getCategoryConfig(catKey);
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <div
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`cursor-pointer p-5 rounded-2xl border-2 transition-all ${
                          isSelected
                            ? "border-blue-600 bg-blue-50/50 shadow-sm"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-slate-900">{cat.name}</h3>
                          {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                        </div>
                        <p className="text-xs text-slate-600 mb-3">{cat.tagline}</p>
                        <div className="flex flex-wrap gap-1">
                          {cat.defaultOptions.map((opt) => (
                            <span
                              key={opt}
                              className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-600 font-semibold"
                            >
                              {opt}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start space-x-3 text-xs text-slate-600">
                  <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800">Automatic Seed: </span>
                    Your store will be populated with 3 sample {activeCategoryConfig.name} products with pre-configured inventory so you can launch instantly.
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Payment Preferences */}
            {step === 3 && (
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Payment Preferences
                </h1>
                <p className="text-slate-600 text-sm mt-1 mb-8">
                  Configure how your buyers will pay. You can always change this later in settings.
                </p>

                <div className="space-y-4">
                  {/* COD */}
                  <label className="flex items-start justify-between p-4 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={enableCod}
                        onChange={(e) => setEnableCod(e.target.checked)}
                        className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 mt-0.5"
                      />
                      <div>
                        <div className="font-bold text-slate-900 text-sm">Cash on Delivery (COD)</div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Customers pay in cash when the delivery arrives at their door. Highly recommended for startups.
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">1-Click</span>
                  </label>

                  {/* Stripe */}
                  <label className="flex items-start justify-between p-4 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={enableStripe}
                        onChange={(e) => setEnableStripe(e.target.checked)}
                        className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 mt-0.5"
                      />
                      <div>
                        <div className="font-bold text-slate-900 text-sm">Online Card Payments (Stripe)</div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Accept Visa, MasterCard, and Apple Pay globally with instant verification.
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* Manual Transfer */}
                  <div className="p-4 rounded-xl border border-slate-200">
                    <div className="font-bold text-slate-900 text-sm mb-1">
                      Manual Bank / Mobile Money (bKash, Nagad, UPI, Bank Wire)
                    </div>
                    <p className="text-xs text-slate-500 mb-3">
                      Optionally paste your payment account details or instructions for customers to send payment before dispatch.
                    </p>
                    <textarea
                      rows={2}
                      placeholder="e.g. bKash Merchant: 01700-000000 (Use reference: Order ID)"
                      value={manualPaymentNotes}
                      onChange={(e) => setManualPaymentNotes(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="mt-10 pt-6 border-t border-slate-200 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="inline-flex items-center space-x-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 px-4 py-2.5 rounded-xl transition"
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
                  className="inline-flex items-center space-x-2 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-md shadow-blue-600/20 transition"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinishLaunch}
                  className="inline-flex items-center space-x-2 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl shadow-lg shadow-emerald-600/30 transition transform hover:-translate-y-0.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Launch My Store</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* CELEBRATION / LAUNCH COMPLETE SCREEN */
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-8 sm:p-12 text-center max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-md shadow-emerald-500/20">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Congratulations! Your Store is Live!
            </h2>

            <p className="text-slate-600 text-sm mt-3">
              <span className="font-bold text-slate-900">{storeName}</span> has been provisioned with 3 starter products, category presets, and payment settings.
            </p>

            <div className="my-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono text-blue-600 font-semibold break-all">
              https://{subdomain}.platform.com
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Link
                href={`/admin?store=${subdomain}`}
                className="flex-1 inline-flex items-center justify-center space-x-2 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white py-3.5 px-4 rounded-xl shadow-md shadow-blue-600/20 transition"
              >
                <span>Open Admin Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={`/store/${subdomain}`}
                className="flex-1 inline-flex items-center justify-center space-x-2 text-sm font-semibold bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 py-3.5 px-4 rounded-xl transition"
              >
                <span>View Public Storefront</span>
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </main>

      <footer className="py-4 text-center text-xs text-slate-400">
        StoreSwift SaaS Platform • 14-Day Free Trial
      </footer>
    </div>
  );
}

