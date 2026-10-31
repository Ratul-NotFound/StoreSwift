"use client";

import Link from "next/link";
import {
  Store,
  ShieldCheck,
  Zap,
  ArrowRight,
  Mail,
  PhoneCall,
  MapPin,
  ExternalLink,
  Layers,
  Truck,
  CheckCircle2,
  Globe,
  Radio,
  Clock,
  Sparkles
} from "lucide-react";
import { useState } from "react";
import { useToast } from "./ui/toast";

export const DEMO_STORES_LIST = [
  { slug: "apex-fashion", name: "Apex Fashion Hub", category: "Fashion & Apparel", tag: "Minimal Atelier", color: "from-zinc-900 to-zinc-700" },
  { slug: "luxe-glow-beauty", name: "Luxe Glow Beauty", category: "Beauty & Skincare", tag: "Clinical Botanical", color: "from-rose-500 to-pink-600" },
  { slug: "craft-shoes", name: "Craft Bench Shoes", category: "Footwear & Leather", tag: "Warm Heritage", color: "from-amber-700 to-orange-800" },
  { slug: "cyber-tech", name: "CyberTech Audio", category: "Consumer Tech", tag: "Acoustic Cyber", color: "from-sky-500 to-blue-700" },
  { slug: "maison-jewelry", name: "Maison Opulente", category: "Fine Jewelry & Watches", tag: "Opulent Maison", color: "from-amber-400 to-yellow-600" },
  { slug: "artisan-food", name: "Artisan Pantry", category: "Gourmet Food & Coffee", tag: "Artisan Pantry", color: "from-emerald-700 to-teal-800" }
];

export function PlatformFooter() {
  const [email, setEmail] = useState("");
  const { success } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      success("Subscribed to Platform Updates!", "We've sent the eCommerce Growth Blueprint to your inbox.");
      setEmail("");
    }
  };

  return (
    <footer className="bg-zinc-950 text-zinc-300 font-sans border-t border-zinc-900 mt-auto">
      {/* ─── Platform Capabilities Strip ─────────────────────────────────── */}
      <div className="border-b border-zinc-900 py-8 px-4 sm:px-6 bg-zinc-950/90">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-blue-400 flex-shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white tracking-tight">20-Second Express Checkout</p>
              <p className="text-[11px] text-zinc-400">1-Page form • bKash, Nagad & COD</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white tracking-tight">Automated Courier Dispatch</p>
              <p className="text-[11px] text-zinc-400">Steadfast, Pathao & RedX 1-click sync</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400 flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white tracking-tight">AI Anti-Fraud RTO Shield</p>
              <p className="text-[11px] text-zinc-400">Flag serial returners before courier fees</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-purple-400 flex-shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white tracking-tight">6 Category-Tailored Themes</p>
              <p className="text-[11px] text-zinc-400">Quiet luxury design • Zero agency code</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Main Platform SaaS Footer Content ─────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Column 1: Platform Overview & Headquarters */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2.5 group w-fit">
              <div className="w-9 h-9 rounded-xl bg-white text-zinc-950 flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
                <Store className="w-4.5 h-4.5" />
              </div>
              <span className="font-extrabold text-white tracking-tight text-lg">
                Store<span className="text-blue-500">Swift</span>
              </span>
            </Link>

            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              The high-conversion eCommerce operating system for South Asia & global direct-to-consumer brands. Built on Next.js 15 App Router with instant 1-page checkout, automated courier dispatch, and AI Anti-Fraud RTO protection.
            </p>

            {/* Platform Headquarters & Merchant Hotline */}
            <div className="space-y-1.5 text-xs text-zinc-400 pt-1">
              <div className="flex items-center space-x-2 text-zinc-300">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono font-semibold">+880 1711-234567</span>
                <span className="text-zinc-500">• Merchant Care (10 AM - 10 PM)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>support@storeswift.app</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>Central Logistics Hub: Tejgaon Industrial Area, Dhaka</span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-white mb-2">Subscribe to eCommerce Growth Blueprint</p>
              <form onSubmit={handleSubscribe} className="flex max-w-sm space-x-2">
                <input
                  type="email"
                  placeholder="merchant@yourbrand.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-zinc-500 transition font-medium"
                  required
                />
                <button
                  type="submit"
                  className="bg-white hover:bg-zinc-200 text-zinc-950 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1 btn-press"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </form>
            </div>
          </div>

          {/* Column 2: Live Storefront Templates */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-white">Live Storefronts</p>
            <ul className="space-y-2 text-xs text-zinc-400">
              {DEMO_STORES_LIST.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/store/${s.slug}`}
                    className="hover:text-white transition flex items-center justify-between group"
                  >
                    <span>{s.name}</span>
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                  </Link>
                  <span className="text-[10px] text-zinc-500 block">{s.category}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Platform Features & Couriers */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-white">Platform Features</p>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li className="flex items-center space-x-1.5 text-zinc-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>20s 1-Page Express Checkout</span>
              </li>
              <li className="flex items-center space-x-1.5 text-zinc-300">
                <Truck className="w-3.5 h-3.5 text-blue-400" />
                <span>Steadfast & Pathao Auto Booking</span>
              </li>
              <li className="flex items-center space-x-1.5 text-zinc-300">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>AI Anti-Fraud RTO Risk Shield</span>
              </li>
              <li className="flex items-center space-x-1.5 text-zinc-300">
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                <span>64-District Auto Zone Tariffs</span>
              </li>
              <li className="flex items-center space-x-1.5 text-zinc-300">
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                <span>4x6 Thermal Barcode Label Generator</span>
              </li>
              <li className="flex items-center space-x-1.5 text-zinc-300">
                <Radio className="w-3.5 h-3.5 text-cyan-400" />
                <span>Server-Side Meta CAPI Sync</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Merchant & Developers */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-white">Merchant & Devs</p>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="/admin?store=apex-fashion" className="hover:text-white transition flex items-center space-x-1 text-zinc-300 font-medium">
                  <span>Merchant Admin Dashboard</span>
                  <ExternalLink className="w-3 h-3 text-zinc-500" />
                </Link>
              </li>
              <li>
                <Link href="/onboarding" className="hover:text-white transition">
                  Launch Free Store (3 Mins)
                </Link>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition">
                  Pricing Plans & Tariffs
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition">
                  Merchant FAQ
                </a>
              </li>
              <li>
                <a href="#logistics" className="hover:text-white transition">
                  Courier Webhook Specs
                </a>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition">
                  Merchant Sign In
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ─── Bottom Badges & Legal ────────────────────────────────────────── */}
        <div className="mt-12 pt-8 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex flex-wrap items-center gap-2 text-center sm:text-left">
            <span>© {new Date().getFullYear()} StoreSwift Technologies Ltd. All rights reserved.</span>
            <span>•</span>
            <span className="text-zinc-400">
              Next.js 15 App Router • Edge Runtime • PostgreSQL & Prisma
            </span>
          </div>

          {/* Partner & Logistics Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="px-2 py-1 bg-zinc-900 rounded-md border border-zinc-800 text-[10px] font-bold text-emerald-400">
              🚚 Steadfast Official API
            </span>
            <span className="px-2 py-1 bg-rose-950/60 rounded-md border border-rose-900/60 text-[10px] font-bold text-rose-400">
              🏍️ Pathao Logistics Sync
            </span>
            <span className="px-2 py-1 bg-pink-950/60 rounded-md border border-pink-900/60 text-[10px] font-bold text-[#E2136E]">
              🌸 bKash Merchant API
            </span>
            <span className="px-2 py-1 bg-amber-950/60 rounded-md border border-amber-900/60 text-[10px] font-bold text-[#F7931E]">
              🟠 Nagad Direct
            </span>
            <span className="px-2 py-1 bg-zinc-900 rounded-md border border-zinc-800 text-[10px] font-semibold text-zinc-300">
              🔒 256-Bit SSL
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
