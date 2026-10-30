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
    setTimeout(() => {
      const storeSlug = email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "-") || "apex-fashion";
      localStorage.setItem("current_store", storeSlug);
      router.push(`/admin?store=${storeSlug}`);
    }, 500);
  };

  const handleDemoLogin = () => {
    localStorage.setItem("current_store", "apex-fashion");
    router.push("/admin?store=apex-fashion");
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
          <Link
            href="/onboarding"
            className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition"
          >
            Create New Store →
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-sm w-full mx-auto px-4 py-12 flex flex-col justify-center">
        <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-card p-6 sm:p-8">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
              Merchant Login
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Sign in to manage catalog, orders, and storefront settings.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center space-x-2 text-red-700 text-xs font-medium">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 uppercase tracking-wider mb-1">
                Store Email
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-zinc-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  placeholder="founder@mystore.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-zinc-200 rounded-xl text-xs outline-none focus:border-zinc-900 transition font-medium placeholder:text-zinc-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-zinc-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-zinc-200 rounded-xl text-xs outline-none focus:border-zinc-900 transition font-medium placeholder:text-zinc-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center space-x-1.5 btn-press"
            >
              <span>{loading ? "Signing in..." : "Sign In to Dashboard"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-100" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-semibold text-zinc-400">
              <span className="bg-white px-2">Instant Demo Access</span>
            </div>
          </div>

          <button
            onClick={handleDemoLogin}
            type="button"
            className="w-full py-2 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-700 font-semibold text-xs rounded-xl transition flex items-center justify-center space-x-1.5 btn-press"
          >
            <Sparkles className="w-3.5 h-3.5 text-zinc-600" />
            <span>1-Click Demo Merchant Login</span>
          </button>
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-zinc-400">
        StoreSwift SaaS Platform
      </footer>
    </div>
  );
}
