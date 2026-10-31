"use client";

import Link from "next/link";
import {
  Store,
  ShieldCheck,
  Truck,
  RotateCcw,
  Mail,
  ArrowRight,
  CreditCard,
  Lock,
  PhoneCall,
  MapPin,
  ExternalLink,
  CheckCircle2,
  Package,
  MessageCircle
} from "lucide-react";
import { useState } from "react";
import { useToast } from "../ui/toast";

export interface StorefrontFooterProps {
  storeName?: string;
  storeSlug?: string;
  categoryName?: string;
  onOpenTrackOrder?: () => void;
}

export function StorefrontFooter({
  storeName = "Apex Fashion Hub",
  storeSlug = "apex-fashion",
  categoryName = "Fashion & Apparel",
  onOpenTrackOrder
}: StorefrontFooterProps) {
  const [email, setEmail] = useState("");
  const { success } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      success("10% Coupon Sent!", `Check ${email} for your exclusive first-order discount code.`);
      setEmail("");
    }
  };

  return (
    <footer className="bg-zinc-950 text-zinc-300 font-sans border-t border-zinc-900 mt-auto">
      {/* ─── Upper Consumer Logistics & Trust Bar ──────────────────────────── */}
      <div className="border-b border-zinc-800/80 py-8 px-4 sm:px-6 bg-zinc-950/90">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-blue-400 flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white tracking-tight">Nationwide Express Delivery</p>
              <p className="text-[11px] text-zinc-400">Steadfast & Pathao 24-48h dispatch</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white tracking-tight">Doorstep Inspection Guaranteed</p>
              <p className="text-[11px] text-zinc-400">Open parcel check before paying COD</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400 flex-shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white tracking-tight">7-Day Hassle-Free Returns</p>
              <p className="text-[11px] text-zinc-400">Doorstep size & variant exchange</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-purple-400 flex-shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white tracking-tight">256-Bit Bank Security</p>
              <p className="text-[11px] text-zinc-400">bKash, Nagad & Anti-Fraud Shield</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Main Storefront Footer Columns ─────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Column 1 & 2: Store Identity & Support */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-white text-zinc-950 flex items-center justify-center font-bold shadow-sm">
                <Store className="w-4 h-4" />
              </div>
              <span className="font-bold text-white tracking-tight text-base">
                {storeName}
              </span>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              Official authenticated storefront for {storeName}. Curated {categoryName.toLowerCase()}, nationwide automated courier delivery across all 64 districts, and open parcel doorstep inspection.
            </p>

            {/* Support Hotline & Hub */}
            <div className="space-y-1.5 text-xs text-zinc-400 pt-1">
              <div className="flex items-center space-x-2 text-zinc-300">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono font-semibold">+880 1711-234567</span>
                <span className="text-zinc-500">• 10 AM - 10 PM Everyday</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>care@{storeSlug || "store"}.storeswift.app</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>Central Logistics Hub: Tejgaon Industrial Area, Dhaka</span>
              </div>
            </div>

            {/* Newsletter Form */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-white mb-2">Join VIP List: Get 10% off your first order</p>
              <form onSubmit={handleSubscribe} className="flex max-w-sm space-x-2">
                <input
                  type="email"
                  placeholder="Enter your email address"
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

          {/* Column 3: Curated Store Catalog */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-white">Store Catalog</p>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li><a href="#catalog" className="hover:text-white transition">Full Collection</a></li>
              <li><a href="#catalog" className="hover:text-white transition">New Arrivals 2026</a></li>
              <li><a href="#catalog" className="hover:text-white transition">Best Sellers & Trending</a></li>
              <li><a href="#features" className="hover:text-white transition">Specifications & Guide</a></li>
              <li><a href="#reviews" className="hover:text-white transition">Verified Customer Reviews</a></li>
            </ul>
          </div>

          {/* Column 4: Logistics & Delivery Tariffs */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-white">Logistics & Couriers</p>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li className="flex items-center space-x-1.5 text-zinc-300">
                <Truck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold">Steadfast Courier API Sync</span>
              </li>
              <li className="flex items-center space-x-1.5 text-zinc-300">
                <Truck className="w-3.5 h-3.5 text-rose-400" />
                <span className="font-semibold">Pathao Logistics Integration</span>
              </li>
              <li className="pt-1 text-[11px] text-zinc-400">
                <span>Inside Dhaka: Flat ৳60 (24h)</span>
              </li>
              <li className="text-[11px] text-zinc-400">
                <span>Greater Dhaka / Suburbs: Flat ৳100 (48h)</span>
              </li>
              <li className="text-[11px] text-zinc-400">
                <span>Outside Dhaka: Flat ৳130 (72h)</span>
              </li>
              <li className="pt-1 text-[11px] text-emerald-400 font-semibold">
                <span>✓ Open Parcel Inspection Guarantee</span>
              </li>
            </ul>
          </div>

          {/* Column 5: Customer Care & Order Tracking */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-white">Customer Care</p>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <button
                  type="button"
                  onClick={onOpenTrackOrder}
                  className="w-full text-left flex items-center space-x-2 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-white text-zinc-200 transition font-medium"
                >
                  <Package className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                  <span className="text-xs">Track Consignment</span>
                </button>
              </li>
              <li className="flex items-center space-x-1.5 pt-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cash on Delivery Verified</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-[#E2136E] text-white flex items-center justify-center font-bold text-[8px]">৳</span>
                <span>bKash Express Instant Pay</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-[#F7931E] text-white flex items-center justify-center font-bold text-[8px]">N</span>
                <span>Nagad Direct Wallet</span>
              </li>
              <li className="pt-2 border-t border-zinc-900">
                <Link
                  href={`/admin?store=${storeSlug}`}
                  className="text-zinc-400 hover:text-white transition flex items-center space-x-1 text-xs"
                >
                  <span>Merchant Admin Portal</span>
                  <ExternalLink className="w-3 h-3 text-zinc-500" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ─── Payment Badges & StoreSwift Attribution Strip ────────────────── */}
        <div className="mt-12 pt-8 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex flex-wrap items-center gap-2 text-center sm:text-left">
            <span>© {new Date().getFullYear()} {storeName}. All rights reserved.</span>
            <span>•</span>
            <Link href="/" className="hover:text-zinc-300 transition text-[11px]">
              Powered by <span className="font-semibold text-white">StoreSwift</span>
            </Link>
          </div>

          {/* Payment & Courier Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="px-2 py-1 bg-zinc-900 rounded-md border border-zinc-800 text-[10px] font-bold text-emerald-400">
              💵 Cash on Delivery
            </span>
            <span className="px-2 py-1 bg-pink-950/60 rounded-md border border-pink-900/60 text-[10px] font-bold text-[#E2136E]">
              🌸 bKash
            </span>
            <span className="px-2 py-1 bg-amber-950/60 rounded-md border border-amber-900/60 text-[10px] font-bold text-[#F7931E]">
              🟠 Nagad
            </span>
            <span className="px-2 py-1 bg-zinc-900 rounded-md border border-zinc-800 text-[10px] font-semibold text-zinc-300">
              💳 VISA / MC
            </span>
            <span className="px-2 py-1 bg-emerald-950/60 rounded-md border border-emerald-900/60 text-[10px] font-bold text-emerald-400">
              🚚 Steadfast API
            </span>
            <span className="px-2 py-1 bg-rose-950/60 rounded-md border border-rose-900/60 text-[10px] font-bold text-rose-400">
              🏍️ Pathao
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

