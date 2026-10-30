"use client";

import Link from "next/link";
import {
  Store,
  ShieldCheck,
  Truck,
  RotateCcw,
  Mail,
  ArrowRight,
  Heart,
  CreditCard,
  Lock,
  Sparkles,
  PhoneCall,
  MapPin
} from "lucide-react";
import { useState } from "react";
import { useToast } from "./ui/toast";

export interface StoreFooterProps {
  storeName?: string;
  storeSlug?: string;
  categoryName?: string;
  isPlatform?: boolean;
}

export function StoreFooter({
  storeName = "StoreSwift",
  storeSlug,
  categoryName = "Fashion & Apparel",
  isPlatform = false
}: StoreFooterProps) {
  const [email, setEmail] = useState("");
  const { success } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      success("Subscribed!", "You've been added to our VIP list. Check your inbox for your 10% coupon.");
      setEmail("");
    }
  };

  return (
    <footer className="bg-zinc-950 text-zinc-300 font-sans border-t border-zinc-900 mt-auto">
      {/* Upper Perks Bar */}
      <div className="border-b border-zinc-800/80 py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-blue-400 flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white tracking-tight">Express Shipping</p>
              <p className="text-[11px] text-zinc-400">Free delivery on orders $50+</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white tracking-tight">Cash on Delivery</p>
              <p className="text-[11px] text-zinc-400">Pay after package inspection</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400 flex-shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white tracking-tight">7-Day Free Returns</p>
              <p className="text-[11px] text-zinc-400">Hassle-free instant exchanges</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-purple-400 flex-shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white tracking-tight">256-Bit Encryption</p>
              <p className="text-[11px] text-zinc-400">Bank-grade checkout safety</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Column 1 & 2: Brand Story & Newsletter */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-white text-zinc-950 flex items-center justify-center font-bold shadow-sm">
                <Store className="w-4 h-4" />
              </div>
              <span className="font-bold text-white tracking-tight text-base">
                {storeName}
              </span>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              {isPlatform
                ? "Turnkey eCommerce platform for startups: Instant category-ready storefront, inventory engine, and order dashboard in 3 minutes."
                : `Official storefront for ${storeName}. Handcrafted quality, nationwide cash on delivery, and dedicated customer support.`}
            </p>

            {/* Newsletter Form */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-white mb-2">Get 10% off your first purchase</p>
              <form onSubmit={handleSubscribe} className="flex max-w-sm space-x-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-zinc-500 transition"
                  required
                />
                <button
                  type="submit"
                  className="bg-white hover:bg-zinc-200 text-zinc-950 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1"
                >
                  <span>Join</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </form>
            </div>
          </div>

          {/* Column 3: Shop / Quick Links */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-white">Collections</p>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link href={storeSlug ? `/store/${storeSlug}` : "/"} className="hover:text-white transition">
                  All Featured Products
                </Link>
              </li>
              <li>
                <Link href={storeSlug ? `/store/${storeSlug}?filter=new` : "/"} className="hover:text-white transition">
                  New Arrivals 2026
                </Link>
              </li>
              <li>
                <Link href={storeSlug ? `/store/${storeSlug}?filter=bestseller` : "/"} className="hover:text-white transition">
                  Best Sellers & Trending
                </Link>
              </li>
              <li>
                <Link href={storeSlug ? `/store/${storeSlug}?filter=sale` : "/"} className="hover:text-white transition">
                  Special Clearance Sale
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Customer Care */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-white">Customer Care</p>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <span className="hover:text-white transition cursor-pointer">Order Tracking & Status</span>
              </li>
              <li>
                <span className="hover:text-white transition cursor-pointer">Cash on Delivery Policy</span>
              </li>
              <li>
                <span className="hover:text-white transition cursor-pointer">Shipping Rates & Timelines</span>
              </li>
              <li>
                <span className="hover:text-white transition cursor-pointer">Return & Exchange Portal</span>
              </li>
              <li>
                <span className="hover:text-white transition cursor-pointer">Size Guide & Specifications</span>
              </li>
            </ul>
          </div>

          {/* Column 5: Store & Legal */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-white">About & Trust</p>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <span className="hover:text-white transition cursor-pointer">About Our Brand</span>
              </li>
              <li>
                <span className="hover:text-white transition cursor-pointer">Authenticity Guarantee</span>
              </li>
              <li>
                <span className="hover:text-white transition cursor-pointer">Privacy & Cookie Policy</span>
              </li>
              <li>
                <span className="hover:text-white transition cursor-pointer">Terms of Service</span>
              </li>
              <li>
                <span className="hover:text-white transition cursor-pointer">Contact Support Desk</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Badges & Bottom Strip */}
        <div className="mt-12 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center space-x-2">
            <span>© {new Date().getFullYear()} {storeName}. All rights reserved.</span>
            <span>•</span>
            <Link href="/" className="hover:text-zinc-300 transition text-[11px]">
              Powered by <span className="font-semibold text-white">StoreSwift</span>
            </Link>
          </div>

          {/* Supported Payment Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-1 bg-zinc-900 rounded border border-zinc-800 text-[10px] font-semibold text-zinc-300">
              💵 Cash on Delivery
            </span>
            <span className="px-2 py-1 bg-zinc-900 rounded border border-zinc-800 text-[10px] font-semibold text-zinc-300">
              VISA
            </span>
            <span className="px-2 py-1 bg-zinc-900 rounded border border-zinc-800 text-[10px] font-semibold text-zinc-300">
              Mastercard
            </span>
            <span className="px-2 py-1 bg-zinc-900 rounded border border-zinc-800 text-[10px] font-semibold text-zinc-300">
              Apple Pay
            </span>
            <span className="px-2 py-1 bg-zinc-900 rounded border border-zinc-800 text-[10px] font-semibold text-zinc-300">
              Google Pay
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
