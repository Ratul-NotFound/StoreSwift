"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Store, ArrowRight, User, Mail, Lock, ShoppingBag, Globe, Sparkles, AlertCircle } from "lucide-react";

const CATEGORIES = [
  { value: "fashion", label: "Fashion & Apparel" },
  { value: "electronics", label: "Electronics" },
  { value: "home-living", label: "Home & Living" },
  { value: "food-beverage", label: "Food & Beverage" },
  { value: "beauty", label: "Beauty & Wellness" },
  { value: "sports", label: "Sports & Outdoors" },
  { value: "books", label: "Books & Media" },
  { value: "toys", label: "Toys & Games" },
  { value: "other", label: "Other" }
];

const CURRENCIES = [
  { value: "USD", label: "USD ($) - US Dollar" },
  { value: "EUR", label: "EUR (€) - Euro" },
  { value: "GBP", label: "GBP (£) - British Pound" },
  { value: "BDT", label: "BDT (৳) - Bangladeshi Taka" },
  { value: "INR", label: "INR (₹) - Indian Rupee" }
];

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    storeName: "",
    category: "fashion",
    currency: "USD"
  });

  const update = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password || !form.storeName) {
      setError("All fields are required.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      router.push(`/admin?store=${data.slug}`);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col justify-between font-sans selection:bg-zinc-900 selection:text-white">
      <header className="bg-white/80 backdrop-blur-md border-b border-zinc-200/80 py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Store className="w-4 h-4" />
            </div>
            <span className="font-bold text-zinc-900 tracking-tight text-sm">
              Store<span className="text-blue-600">Swift</span>
            </span>
          </Link>
          <Link href="/login" className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition">
            Already have a store? Sign in →
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-sm w-full mx-auto px-4 py-10 flex flex-col justify-center">
        <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-card p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
              Create Your Store
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Set up your StoreSwift storefront in seconds.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center space-x-2 text-red-700 text-xs font-medium">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 uppercase tracking-wider mb-1">Full Name</label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-zinc-400 absolute left-3.5 top-2.5" />
                <input type="text" placeholder="Jane Smith" value={form.fullName} onChange={e => update("fullName", e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-zinc-200 rounded-xl text-xs outline-none focus:border-zinc-900 transition font-medium placeholder:text-zinc-400" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 uppercase tracking-wider mb-1">Email</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-zinc-400 absolute left-3.5 top-2.5" />
                <input type="email" placeholder="founder@mystore.com" value={form.email} onChange={e => update("email", e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-zinc-200 rounded-xl text-xs outline-none focus:border-zinc-900 transition font-medium placeholder:text-zinc-400" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 uppercase tracking-wider mb-1">Password</label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-zinc-400 absolute left-3.5 top-2.5" />
                <input type="password" placeholder="Min 8 characters" value={form.password} onChange={e => update("password", e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-zinc-200 rounded-xl text-xs outline-none focus:border-zinc-900 transition font-medium placeholder:text-zinc-400" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 uppercase tracking-wider mb-1">Store Name</label>
              <div className="relative">
                <ShoppingBag className="w-3.5 h-3.5 text-zinc-400 absolute left-3.5 top-2.5" />
                <input type="text" placeholder="e.g. Apex Apparel" value={form.storeName} onChange={e => update("storeName", e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-zinc-200 rounded-xl text-xs outline-none focus:border-zinc-900 transition font-medium placeholder:text-zinc-400" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 uppercase tracking-wider mb-1">Category</label>
              <select value={form.category} onChange={e => update("category", e.target.value)}
                className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs outline-none focus:border-zinc-900 transition bg-white text-zinc-800 font-medium">
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 uppercase tracking-wider mb-1">Currency</label>
              <div className="relative">
                <Globe className="w-3.5 h-3.5 text-zinc-400 absolute left-3.5 top-2.5" />
                <select value={form.currency} onChange={e => update("currency", e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-zinc-200 rounded-xl text-xs outline-none focus:border-zinc-900 transition bg-white text-zinc-800 font-medium appearance-none">
                  {CURRENCIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full mt-2 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center space-x-1.5 btn-press disabled:opacity-60">
              <span>{loading ? "Creating store..." : "Create My Store"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <p className="text-center text-[11px] text-zinc-400 mt-4">
            By creating an account, you agree to our{" "}
            <span className="text-zinc-600 underline cursor-pointer">Terms of Service</span> and{" "}
            <span className="text-zinc-600 underline cursor-pointer">Privacy Policy</span>.
          </p>
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-zinc-400">
        StoreSwift SaaS Platform • 14-Day Free Trial
      </footer>
    </div>
  );
}
