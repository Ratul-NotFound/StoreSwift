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
import { useState, useMemo } from "react";
import { useToast } from "../ui/toast";

export interface StorefrontFooterProps {
  storeName?: string;
  storeSlug?: string;
  categoryName?: string;
  onOpenTrackOrder?: () => void;
}

// Category-specific verified section anchors
const STORE_CATALOG_LINKS: Record<string, Array<{ label: string; href: string }>> = {
  fashion: [
    { label: "Archival Silhouettes", href: "#catalog" },
    { label: "Editorial Lookbook", href: "#outfits" },
    { label: "Textile & GSM Guide", href: "#fabric-guide" },
    { label: "Doorstep Inspection", href: "#catalog" }
  ],
  beauty_cosmetics: [
    { label: "Daily Rituals", href: "#rituals" },
    { label: "Skin Concerns", href: "#concerns" },
    { label: "3-Step Glass Skin", href: "#bundle" },
    { label: "Bio-Actives Guide", href: "#actives" },
    { label: "Patch Test Protocol", href: "#protocol" }
  ],
  shoes: [
    { label: "Bench Footwear", href: "#footwear" },
    { label: "Welt Construction", href: "#silhouettes" },
    { label: "Anatomical Soles", href: "#anatomy" },
    { label: "Guild Standards", href: "#ensemble" },
    { label: "Doorstep Fitting Check", href: "#trial" }
  ],
  electronics: [
    { label: "Hardware Catalog", href: "#hardware" },
    { label: "Device Categories", href: "#categories" },
    { label: "Telemetry Specs", href: "#benchmarks" },
    { label: "Desk Ensemble", href: "#ensemble" },
    { label: "Anti-Tamper Protocol", href: "#protocol" }
  ],
  jewelry: [
    { label: "Haute Joaillerie", href: "#creations" },
    { label: "40x Loupe Inspection", href: "#loupe" },
    { label: "Maison Collections", href: "#collections" },
    { label: "Bridal Ensemble", href: "#ensemble" },
    { label: "Assay Hallmarks (750)", href: "#standards" }
  ],
  grocery_food: [
    { label: "Pantry Provisions", href: "#provisions" },
    { label: "Micro-Lot Harvests", href: "#categories" },
    { label: "Farmgate Standards", href: "#standards" },
    { label: "Breakfast Ensemble", href: "#ensemble" },
    { label: "Aroma Seal Inspection", href: "#aroma" }
  ]
};

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

  const categoryKey = useMemo(() => {
    const slug = (storeSlug || "").toLowerCase();
    if (slug.includes("shoe") || slug.includes("sneaker") || slug.includes("boot")) return "shoes";
    if (slug.includes("beauty") || slug.includes("cosmetic") || slug.includes("glow") || slug.includes("skin")) return "beauty_cosmetics";
    if (slug.includes("tech") || slug.includes("byte") || slug.includes("gadget") || slug.includes("audio")) return "electronics";
    if (slug.includes("jewel") || slug.includes("watch") || slug.includes("gold")) return "jewelry";
    if (slug.includes("coffee") || slug.includes("honey") || slug.includes("food")) return "grocery_food";
    return "fashion";
  }, [storeSlug]);

  const catalogLinks = STORE_CATALOG_LINKS[categoryKey] || STORE_CATALOG_LINKS.fashion;

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

            {/* Support Hotline & Customer Care */}
            <div className="space-y-1.5 text-xs text-zinc-400 pt-1">
              <div className="flex items-center space-x-2 text-zinc-300">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>care@{storeSlug || "store"}.storeswift.app</span>
              </div>
              <div className="flex items-center space-x-2 text-zinc-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Customer Care: 10:00 AM – 10:00 PM Everyday</span>
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

          {/* Column 3: Verified Store Catalog Links (Dynamic per Category) */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-white">Store Catalog</p>
            <ul className="space-y-2 text-xs text-zinc-400">
              {catalogLinks.map((item, idx) => (
                <li key={idx}>
                  <a href={item.href} className="hover:text-white transition flex items-center justify-between group">
                    <span>{item.label}</span>
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                  </a>
                </li>
              ))}
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
                <span>Inside Dhaka: Flat ৳60 / $2.50 (24h)</span>
              </li>
              <li className="text-[11px] text-zinc-400">
                <span>Greater Dhaka: Flat ৳100 / $4.00 (48h)</span>
              </li>
              <li className="text-[11px] text-zinc-400">
                <span>Outside Dhaka: Flat ৳130 / $5.00 (72h)</span>
              </li>
              <li className="pt-1 text-[11px] text-emerald-400 font-semibold flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Open Parcel Inspection Guaranteed</span>
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
          <div className="flex flex-wrap items-center justify-center gap-2 text-[10px]">
            <span className="px-2.5 py-1 bg-zinc-900 rounded-lg border border-zinc-800 font-medium text-zinc-300">
              Cash on Delivery (COD)
            </span>
            <span className="px-2.5 py-1 bg-zinc-900 rounded-lg border border-zinc-800 font-medium text-[#E2136E]">
              bKash Express
            </span>
            <span className="px-2.5 py-1 bg-zinc-900 rounded-lg border border-zinc-800 font-medium text-[#F7931E]">
              Nagad Direct
            </span>
            <span className="px-2.5 py-1 bg-zinc-900 rounded-lg border border-zinc-800 font-medium text-zinc-300">
              Visa • Mastercard
            </span>
            <span className="px-2.5 py-1 bg-zinc-900 rounded-lg border border-zinc-800 font-medium text-emerald-400">
              Steadfast Logistics
            </span>
            <span className="px-2.5 py-1 bg-zinc-900 rounded-lg border border-zinc-800 font-medium text-rose-400">
              Pathao Courier
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
