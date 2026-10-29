"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Store, ArrowRight, Lock, Mail, AlertCircle, Sparkles } from "lucide-react";

export default function MerchantLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setLoading(true);
    // Simulate login and redirect to the merchant's store dashboard
    setTimeout(() => {
      const storeSlug = email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "-") || "apex-fashion";
      localStorage.setItem("current_store", storeSlug);
      router.push(`/admin?store=${storeSlug}`);
    }, 600);
  };

  const handleDemoLogin = () => {
    localStorage.setItem("current_store", "apex-fashion");
    router.push("/admin?store=apex-fashion");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <header className="bg-white border-b border-slate-200 py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              <Store className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-slate-900 tracking-tight">StoreSwift</span>
          </Link>
          <Link
            href="/onboarding"
            className="text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            Create New Store →
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-md w-full mx-auto px-4 py-12 flex flex-col justify-center">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 p-8 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Merchant Login
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Sign in to manage your store catalog, orders, and settings.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center space-x-2 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Store Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  placeholder="founder@mystore.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-600/20 transition flex items-center justify-center space-x-2"
            >
              <span>{loading ? "Signing in..." : "Sign In to Dashboard"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400 font-semibold">Or fast access</span>
            </div>
          </div>

          {/* Quick Demo Access Button */}
          <button
            onClick={handleDemoLogin}
            type="button"
            className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center justify-center space-x-1.5"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>1-Click Demo Merchant Login</span>
          </button>
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-slate-400">
        StoreSwift SaaS Platform
      </footer>
    </div>
  );
}

