"use client";

import Link from "next/link";
import { Store, ExternalLink } from "lucide-react";

export const DEMO_STORES_LIST = [
  { slug: "apex-fashion", name: "Apex Fashion Hub", category: "Fashion & Apparel", tag: "Minimal Atelier", color: "from-zinc-900 to-zinc-700" },
  { slug: "luxe-glow-beauty", name: "Luxe Glow Beauty", category: "Beauty & Skincare", tag: "Clinical Botanical", color: "from-rose-500 to-pink-600" },
  { slug: "craft-shoes", name: "Craft Bench Shoes", category: "Footwear & Leather", tag: "Warm Heritage", color: "from-amber-700 to-orange-800" },
  { slug: "cyber-tech", name: "CyberTech Audio", category: "Consumer Tech", tag: "Acoustic Cyber", color: "from-sky-500 to-blue-700" },
  { slug: "maison-jewelry", name: "Maison Opulente", category: "Fine Jewelry & Watches", tag: "Opulent Maison", color: "from-amber-400 to-yellow-600" },
  { slug: "artisan-food", name: "Artisan Pantry", category: "Gourmet Food & Coffee", tag: "Artisan Pantry", color: "from-emerald-700 to-teal-800" }
];

export function PlatformFooter() {
  return (
    <footer className="bg-zinc-50 dark:bg-[#06070a] text-zinc-600 dark:text-zinc-400 font-sans border-t border-zinc-200/80 dark:border-white/[0.08] mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Column 1 & 2: Brand & Operating System Overview */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2.5 group w-fit">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 text-zinc-950 flex items-center justify-center font-bold shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Store className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-zinc-950 dark:text-white tracking-tight text-base">
                Store<span className="text-emerald-500 dark:text-emerald-400">Swift</span>
              </span>
            </Link>

            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-sm">
              The high-velocity commerce operating system for direct-to-consumer brands. Turnkey category storefronts, 20-second 1-page checkouts, and automated courier fulfillment.
            </p>

            <div className="flex items-center space-x-2 text-xs text-zinc-500 pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
              <span className="font-medium text-zinc-700 dark:text-zinc-300">All systems operational</span>
              <span className="text-zinc-300 dark:text-zinc-700">•</span>
              <span>Direct Courier APIs Live</span>
            </div>
          </div>

          {/* Column 3: Platform Architecture */}
          <div className="space-y-3">
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-950 dark:text-white">Platform</p>
            <ul className="space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400">
              <li>
                <a href="#features" className="hover:text-zinc-950 dark:hover:text-white transition">
                  1-Page Express Checkout
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-zinc-950 dark:hover:text-white transition">
                  Automated Courier Dispatch
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-zinc-950 dark:hover:text-white transition">
                  Anti-Fraud RTO Shield
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-zinc-950 dark:hover:text-white transition">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-zinc-950 dark:hover:text-white transition">
                  Pricing Plans
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Live Storefronts */}
          <div className="space-y-3">
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-950 dark:text-white">
              Live Stores (30 Themes)
            </p>
            <ul className="space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400">
              {DEMO_STORES_LIST.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/store/${s.slug}`}
                    className="hover:text-zinc-950 dark:hover:text-white transition flex items-center justify-between group"
                  >
                    <span>{s.name}</span>
                    <span className="text-[10px] text-zinc-400">5 Themes</span>
                  </Link>
                </li>
              ))}
              <li className="pt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                ✨ 30 Total Category Presets
              </li>
            </ul>
          </div>

          {/* Column 5: Merchant & Cockpit */}
          <div className="space-y-3">
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-950 dark:text-white">Merchant</p>
            <ul className="space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400">
              <li>
                <Link
                  href="/store/apex-fashion/dashboard"
                  className="hover:text-emerald-400 transition inline-flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400 font-semibold"
                >
                  <span>Merchant Dashboard</span>
                  <ExternalLink className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-zinc-950 dark:hover:text-white transition">
                  Create Free Store
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-zinc-950 dark:hover:text-white transition">
                  Merchant Sign In
                </Link>
              </li>
              <li>
                <a href="#faq" className="hover:text-zinc-950 dark:hover:text-white transition">
                  Frequently Asked Questions
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ─── Clean Bottom Bar & Legal ────────────────────────────────────────── */}
        <div className="mt-12 pt-8 border-t border-zinc-200/80 dark:border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} StoreSwift Technologies Ltd. All rights reserved.</p>

          <div className="flex items-center space-x-6 text-zinc-500">
            <span className="hover:text-zinc-900 dark:hover:text-zinc-300 transition cursor-pointer">Privacy Policy</span>
            <span className="hover:text-zinc-900 dark:hover:text-zinc-300 transition cursor-pointer">Terms of Service</span>
            <span className="hover:text-zinc-900 dark:hover:text-zinc-300 transition cursor-pointer">Security</span>
            <span className="hover:text-zinc-900 dark:hover:text-zinc-300 transition cursor-pointer">Status</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
