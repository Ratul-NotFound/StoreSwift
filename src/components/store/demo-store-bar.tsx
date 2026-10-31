"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Store,
  ChevronDown,
  ExternalLink,
  Zap,
  Truck,
  ArrowLeft,
  X,
  Eye,
  Check,
  Sparkles
} from "lucide-react";
import { DEMO_STORES_LIST } from "@/components/platform-footer";

export interface DemoStoreBarProps {
  currentSlug: string;
  storeDisplayName: string;
  categoryName: string;
  onOpenCheckout?: () => void;
  onOpenTrackOrder?: () => void;
}

export function DemoStoreBar({
  currentSlug,
  storeDisplayName,
  categoryName,
  onOpenCheckout,
  onOpenTrackOrder
}: DemoStoreBarProps) {
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) {
    return (
      <div className="fixed top-3 right-3 z-50 animate-fade-in font-sans">
        <button
          onClick={() => setIsDismissed(false)}
          className="bg-zinc-950/90 hover:bg-black text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg border border-white/20 backdrop-blur-md flex items-center space-x-1.5 transition hover:scale-105"
          title="Restore StoreSwift Demo Bar"
        >
          <Eye className="w-3 h-3 text-blue-400" />
          <span>Demo Controls</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 text-white border-b border-zinc-800 text-xs py-2 px-3 sm:px-6 sticky top-0 z-50 font-sans shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Platform Logo + Current Store Name + Dropdown Switcher */}
        <div className="flex items-center space-x-2.5 min-w-0">
          <Link
            href="/"
            className="flex items-center space-x-1.5 text-zinc-300 hover:text-white transition flex-shrink-0 group"
            title="Back to StoreSwift Platform"
          >
            <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-white">
              <Store className="w-3 h-3" />
            </div>
            <span className="font-bold text-white text-[11px] hidden sm:inline">
              Store<span className="text-blue-400">Swift</span>
            </span>
          </Link>

          <span className="text-zinc-600 text-[10px] hidden sm:inline">•</span>

          <div className="relative">
            <button
              onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 text-[11px] font-medium transition max-w-[200px] sm:max-w-none truncate"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
              <span className="truncate">
                <strong>{storeDisplayName}</strong> ({categoryName.split("&")[0].trim()})
              </span>
              <ChevronDown className="w-3 h-3 text-zinc-400 flex-shrink-0" />
            </button>

            {/* Dropdown Menu */}
            {isSwitcherOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsSwitcherOpen(false)}
                />
                <div className="absolute left-0 mt-2 w-72 bg-zinc-900 border border-zinc-700/90 rounded-xl shadow-2xl z-50 py-2 divide-y divide-zinc-800 animate-fade-in text-xs">
                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                    Switch Live Industry Storefront
                  </div>
                  <div className="py-1">
                    {DEMO_STORES_LIST.map((store) => {
                      const isActive = store.slug === currentSlug;
                      return (
                        <Link
                          key={store.slug}
                          href={`/store/${store.slug}`}
                          onClick={() => setIsSwitcherOpen(false)}
                          className={`flex items-center justify-between px-3 py-2 hover:bg-zinc-800 transition ${
                            isActive ? "bg-zinc-800/80 text-white font-bold" : "text-zinc-300"
                          }`}
                        >
                          <div>
                            <p className="text-xs">{store.name}</p>
                            <p className="text-[10px] text-zinc-400">{store.category}</p>
                          </div>
                          {isActive && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          {onOpenCheckout && (
            <button
              onClick={onOpenCheckout}
              className="hidden md:inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] shadow-sm transition btn-press"
            >
              <Zap className="w-3 h-3" />
              <span>1-Page Checkout</span>
            </button>
          )}

          {onOpenTrackOrder && (
            <button
              onClick={onOpenTrackOrder}
              className="hidden lg:inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-[11px] font-medium transition"
            >
              <Truck className="w-3 h-3 text-emerald-400" />
              <span>Track Parcel</span>
            </button>
          )}

          <Link
            href={`/admin?store=${currentSlug}`}
            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-[11px] font-semibold transition"
          >
            <span>Admin</span>
            <ExternalLink className="w-2.5 h-2.5 text-zinc-400" />
          </Link>

          <Link
            href="/"
            className="hidden sm:inline-flex items-center space-x-1 text-zinc-400 hover:text-white text-[11px] transition pl-1"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Platform</span>
          </Link>

          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 text-zinc-500 hover:text-zinc-300 rounded hover:bg-zinc-800 transition"
            title="Hide Demo Bar"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
