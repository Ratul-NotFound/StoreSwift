"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Search,
  Heart,
  Truck,
  ArrowRight,
  Menu,
  X,
  Star,
  ShieldCheck,
  CreditCard,
  Headphones,
  Eye,
  ChevronDown,
  Sparkles,
  Check,
  SlidersHorizontal,
  Plus
} from "lucide-react";

export interface FashionSubTemplateProps {
  storeDisplayName: string;
  tenantSlug: string;
  displayedCatalog: any[];
  cartItems: any[];
  wishlist: string[];
  finalTotal: number;
  currency: "USD" | "EUR" | "GBP";
  formatPrice: (amount: number) => string;
  activeDepartment: string;
  setActiveDepartment: (dept: string) => void;
  activeTab: "trending" | "new" | "bestsellers" | "sale";
  setActiveTab: (tab: "trending" | "new" | "bestsellers" | "sale") => void;
  priceFilter: string;
  setPriceFilter: (p: any) => void;
  sizeFilter: string;
  setSizeFilter: (s: string) => void;
  sortBy: string;
  setSortBy: (s: string) => void;
  selectedColors: Record<string, string>;
  handleColorSelect: (productId: string, color: string) => void;
  handleQuickSizeAdd: (product: any, size: string) => void;
  handleOpenQuickView: (product: any) => void;
  onAddToCart: (prod: any, variant: any) => void;
  onToggleWishlist: (productId: string) => void;
  onOpenProduct: (prod: any) => void;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenCheckout?: () => void;
  onOpenTrackOrder?: () => void;
  setIsSizeGuideOpen: (open: boolean) => void;
  onSelectFashionStyle: (style: "boutique" | "milano" | "trend") => void;
}

export function BoutiqueStyle({
  storeDisplayName,
  tenantSlug,
  displayedCatalog,
  cartItems,
  wishlist,
  finalTotal,
  currency,
  formatPrice,
  activeDepartment,
  setActiveDepartment,
  activeTab,
  setActiveTab,
  priceFilter,
  setPriceFilter,
  sizeFilter,
  setSizeFilter,
  sortBy,
  setSortBy,
  selectedColors,
  handleColorSelect,
  handleQuickSizeAdd,
  handleOpenQuickView,
  onAddToCart,
  onToggleWishlist,
  onOpenProduct,
  onOpenCart,
  onOpenSearch,
  onOpenCheckout,
  onOpenTrackOrder,
  setIsSizeGuideOpen,
  onSelectFashionStyle
}: FashionSubTemplateProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState(true);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-neutral-900 font-sans antialiased selection:bg-[#4a2c20] selection:text-white">
      {/* ─── 1. Terracotta / Deep Brown Top Announcement Bar (Ref 1 Exact) ─── */}
      <div className="bg-[#422216] text-[#f5eae3] text-[11px] font-sans py-2.5 px-4 sm:px-6 border-b border-[#341b12]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden md:flex items-center space-x-2 text-[#e4cfc3]">
            <span>Support (415) 555-0120</span>
          </div>
          <div className="mx-auto md:mx-0 flex items-center space-x-2 text-center">
            <span>Sign up and GET 25% OFF for your first order.</span>
            <button
              onClick={() => onAddToCart(displayedCatalog[0], displayedCatalog[0]?.variants[0])}
              className="font-semibold underline underline-offset-2 text-white hover:text-amber-200 transition ml-1"
            >
              Sign up now
            </button>
          </div>
          <div className="hidden lg:flex items-center space-x-4 text-[#e4cfc3]">
            <span>Complimentary Courier over $100</span>
            <span className="text-[#845d4e]">•</span>
            <span className="font-mono">{currency} ($)</span>
          </div>
        </div>
      </div>

      {/* ─── 2. Boutique Navigation Header (Ref 1 Exact) ───────────────────── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#ebdcd3]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
          {/* Mobile menu trigger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-2 text-neutral-800 hover:text-black"
              aria-label="Toggle navigation"
            >
              <Menu className="w-6 h-6 stroke-[1.5]" />
            </button>
          </div>

          {/* Logo Brand: "Clothing." (Ref 1) */}
          <Link href={`/store/${tenantSlug}`} className="flex items-center space-x-2 group">
            <div className="w-8 h-8 rounded-full bg-[#422216] text-white flex items-center justify-center font-serif font-bold text-base shadow-sm">
              C
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-serif font-normal tracking-tight text-[#2b170e]">
                Clothing<span className="text-[#a45d3e]">.</span>
              </span>
              <span className="text-[8.5px] uppercase tracking-[0.25em] text-neutral-400 font-sans -mt-1">
                Atelier Boutique
              </span>
            </div>
          </Link>

          {/* Centered Navigation Links (Ref 1 Exact) */}
          <nav className="hidden lg:flex items-center space-x-8 text-[13px] font-sans font-medium text-neutral-600">
            <button
              onClick={() => {
                setActiveDepartment("all");
                document.getElementById("boutique-hero")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-[#422216] font-semibold transition"
            >
              Home
            </button>
            <button
              onClick={() => {
                setActiveDepartment("all");
                document.getElementById("boutique-catalog")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="hover:text-[#422216] transition"
            >
              Shop
            </button>
            <button
              onClick={() => {
                setActiveDepartment("tees");
                document.getElementById("boutique-catalog")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="hover:text-[#422216] transition"
            >
              Women
            </button>
            <button
              onClick={() => {
                setActiveDepartment("outerwear");
                document.getElementById("boutique-catalog")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="hover:text-[#422216] transition"
            >
              Men
            </button>
            <button
              onClick={() => {
                setActiveDepartment("accessories");
                document.getElementById("boutique-catalog")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="hover:text-[#422216] transition"
            >
              Accessories
            </button>
            <a href="#about-us" className="hover:text-[#422216] transition">
              About Us
            </a>
            <a href="#contact-us" className="hover:text-[#422216] transition">
              Contact Us
            </a>
            <a href="#blog" className="hover:text-[#422216] transition">
              Blog
            </a>
          </nav>

          {/* Right Action Icons (Ref 1: Search, Heart, User, Cart) */}
          <div className="flex items-center space-x-3 text-neutral-700">
            <button
              onClick={onOpenSearch}
              className="p-2 hover:text-[#422216] transition rounded-full hover:bg-[#f5eae3]/60"
              title="Search store"
              aria-label="Search"
            >
              <Search className="w-5 h-5 stroke-[1.5]" />
            </button>

            <button
              onClick={() => onToggleWishlist(displayedCatalog[0]?.id || "wishlist")}
              className="p-2 hover:text-[#422216] transition relative rounded-full hover:bg-[#f5eae3]/60"
              title="Saved items"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 stroke-[1.5]" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#422216] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {onOpenTrackOrder && (
              <button
                type="button"
                onClick={onOpenTrackOrder}
                className="hidden sm:flex p-2 hover:text-[#422216] transition rounded-full hover:bg-[#f5eae3]/60"
                title="Track order status"
                aria-label="Track order"
              >
                <Truck className="w-5 h-5 stroke-[1.5]" />
              </button>
            )}

            <button
              onClick={onOpenCart}
              className="py-2.5 px-4 bg-[#422216] hover:bg-[#32190f] text-white rounded-full text-xs font-sans font-medium transition flex items-center space-x-2 shadow-sm active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 stroke-[1.75]" />
              <span>Bag ({cartItems.reduce((s, i) => s + i.quantity, 0)})</span>
              {cartItems.length > 0 && (
                <span className="border-l border-[#673b2a] pl-2 font-semibold">
                  {formatPrice(finalTotal)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-sm bg-white p-6 space-y-6 shadow-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <span className="text-xl font-serif text-[#422216]">Clothing.</span>
                <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-col space-y-3 text-sm font-medium">
                <button
                  onClick={() => {
                    setActiveDepartment("all");
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-2 border-b border-neutral-100"
                >
                  All Collections
                </button>
                <button
                  onClick={() => {
                    setActiveDepartment("tees");
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-2 border-b border-neutral-100"
                >
                  Women's Dresses & Tops
                </button>
                <button
                  onClick={() => {
                    setActiveDepartment("outerwear");
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-2 border-b border-neutral-100"
                >
                  Men's Blazers & Jackets
                </button>
                <button
                  onClick={() => {
                    setActiveDepartment("accessories");
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-2 border-b border-neutral-100"
                >
                  Bags & Accessories
                </button>
              </div>
            </div>
            <div className="pt-4 border-t border-neutral-100 text-xs text-neutral-500">
              <p>Complimentary Worldwide Delivery over $100</p>
            </div>
          </div>
        </div>
      )}

      {/* ─── 3. Boutique Hero Section (Ref 1 Exact) ────────────────────────── */}
      <section id="boutique-hero" className="relative overflow-hidden bg-[#faf7f2] border-b border-[#ebe5dc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#f1ebe3] border border-[#e1d5c7] text-[#422216] text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#a45d3e]" />
                <span>50% OFF Summer Super Sale</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal text-[#27150c] tracking-tight leading-[1.12]">
                Step into Style: Your Ultimate Fashion Destination
              </h1>

              <p className="text-sm sm:text-base text-neutral-600 max-w-xl leading-relaxed font-normal">
                Discover modern effortless elegance crafted with premium natural fibers, hand-tailored silhouettes, and timeless summer palettes. Engineered for comfort and refined presence.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="#boutique-catalog"
                  className="px-8 py-4 bg-[#422216] hover:bg-[#30180e] text-white text-xs font-semibold uppercase tracking-[0.2em] rounded-sm transition flex items-center space-x-2 shadow-md active:scale-98"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="px-6 py-4 bg-transparent hover:bg-[#f1ebe3] text-[#422216] border border-[#d6c7b7] text-xs font-semibold uppercase tracking-[0.2em] rounded-sm transition"
                >
                  View Lookbook
                </button>
              </div>
            </div>

            {/* Right Photography with Shoppable Hotspot Pin (Ref 1 Exact) */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#ede6dc] shadow-xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&auto=format&fit=crop&q=85"
                  alt="Summer Boutique Model"
                  className="w-full h-full object-cover object-top"
                />

                {/* Shoppable Hotspot Pin for Sunglasses (Ref 1 Exact) */}
                <div className="absolute top-[28%] right-[25%] z-20">
                  <button
                    type="button"
                    onClick={() => setActiveHotspot(!activeHotspot)}
                    className="relative flex items-center justify-center w-7 h-7 rounded-full bg-white text-[#422216] shadow-lg hover:scale-110 transition active:scale-95"
                    aria-label="View Sunglasses details"
                  >
                    <span className="absolute inset-0 rounded-full bg-amber-400/50 animate-ping" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#422216]" />
                  </button>

                  {/* Hotspot Pill Card (Ref 1 Exact: "Sunglasses $45") */}
                  {activeHotspot && (
                    <div className="absolute left-9 -top-3 px-3.5 py-1.5 bg-white/95 backdrop-blur-md rounded-full shadow-xl border border-neutral-200 text-xs font-sans flex items-center space-x-2 animate-fade-in whitespace-nowrap">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span className="font-semibold text-neutral-900">Sunglasses</span>
                      <span className="font-bold text-[#422216]">{formatPrice(45.0)}</span>
                      <button
                        onClick={() => {
                          if (displayedCatalog[0]) onAddToCart(displayedCatalog[0], displayedCatalog[0].variants[0]);
                        }}
                        className="p-1 rounded-full bg-[#422216] text-white hover:bg-black transition ml-1"
                        title="Add Sunglasses"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. Customer Trust & Value Proposition Strip (Ref 1 Exact: 3 Cards) ─── */}
      <section className="py-8 bg-white border-b border-[#eee7df]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Free Shipping */}
            <div className="flex items-center space-x-4 p-4 rounded-xl bg-[#faf7f2] border border-[#f0e9df]">
              <div className="w-12 h-12 rounded-xl bg-[#f2e9df] text-[#422216] flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#2b170e] font-serif">Free Shipping</h4>
                <p className="text-xs text-neutral-500 mt-0.5">Free shipping for order above $150</p>
              </div>
            </div>

            {/* Card 2: Flexible Payment */}
            <div className="flex items-center space-x-4 p-4 rounded-xl bg-[#faf7f2] border border-[#f0e9df]">
              <div className="w-12 h-12 rounded-xl bg-[#f2e9df] text-[#422216] flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#2b170e] font-serif">Flexible Payment</h4>
                <p className="text-xs text-neutral-500 mt-0.5">Multiple secure payment options & COD</p>
              </div>
            </div>

            {/* Card 3: 24x7 Support */}
            <div className="flex items-center space-x-4 p-4 rounded-xl bg-[#faf7f2] border border-[#f0e9df]">
              <div className="w-12 h-12 rounded-xl bg-[#f2e9df] text-[#422216] flex items-center justify-center flex-shrink-0">
                <Headphones className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#2b170e] font-serif">24x7 Support</h4>
                <p className="text-xs text-neutral-500 mt-0.5">We support online all days</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. Curated 3-Split Category Architecture (Ref 1 Exact) ──────────── */}
      <section className="py-16 sm:py-20 bg-[#faf8f5] border-b border-[#eee7df]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Card: 2500+ Items | For Women's (Ref 1 Exact) */}
            <div className="lg:col-span-6 bg-white rounded-2xl p-6 sm:p-8 border border-[#eae2d8] shadow-sm flex flex-col justify-between overflow-hidden relative group">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-6 relative z-10">
                <div className="space-y-4">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-[#a45d3e] font-semibold">
                      2500+ Items
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-serif text-[#2b170e] font-normal mt-1">
                      For Women's
                    </h3>
                  </div>

                  <ul className="space-y-2 text-xs font-sans text-neutral-600">
                    {["Blazers", "T-Shirts and Blouse", "Dresses", "Jackets & Coats", "Jeans", "Knit", "Skirts"].map(
                      (item) => (
                        <li key={item}>
                          <button
                            onClick={() => {
                              setActiveDepartment("tees");
                              document.getElementById("boutique-catalog")?.scrollIntoView({ behavior: "smooth" });
                            }}
                            className="hover:text-[#422216] hover:translate-x-1 transition-all flex items-center space-x-1"
                          >
                            <span className="text-[#a45d3e]">•</span>
                            <span>{item}</span>
                          </button>
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div className="w-full sm:w-56 aspect-[3/4] rounded-xl overflow-hidden bg-[#f4ece3] shadow-md flex-shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&auto=format&fit=crop&q=85"
                    alt="Women's Collection"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>

            {/* Right Top & Bottom Cards */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              {/* Right Top Card: 1500+ Items | For Men's (Ref 1 Exact) */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#eae2d8] shadow-sm flex items-center justify-between gap-4 overflow-hidden group">
                <div className="space-y-3">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-[#a45d3e] font-semibold">
                      1500+ Items
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif text-[#2b170e] font-normal mt-0.5">
                      For Men's
                    </h3>
                  </div>

                  <ul className="space-y-1.5 text-xs font-sans text-neutral-600">
                    {["Blazers", "T-Shirts and Shirts", "Jackets & Coats", "Jeans"].map((item) => (
                      <li key={item}>
                        <button
                          onClick={() => {
                            setActiveDepartment("outerwear");
                            document.getElementById("boutique-catalog")?.scrollIntoView({ behavior: "smooth" });
                          }}
                          className="hover:text-[#422216] hover:translate-x-1 transition-all flex items-center space-x-1"
                        >
                          <span className="text-[#a45d3e]">•</span>
                          <span>{item}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="w-36 sm:w-44 aspect-[3/4] rounded-xl overflow-hidden bg-[#f4ece3] shadow-md flex-shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=85"
                    alt="Men's Collection"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>

              {/* Right Bottom Card: 800+ Items | Accessories (Ref 1 Exact) */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#eae2d8] shadow-sm flex items-center justify-between gap-4 overflow-hidden group">
                <div className="space-y-3">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-[#a45d3e] font-semibold">
                      800+ Items
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif text-[#2b170e] font-normal mt-0.5">
                      Accessories
                    </h3>
                  </div>

                  <ul className="space-y-1.5 text-xs font-sans text-neutral-600">
                    {["Handbags", "Watches", "Sunglasses", "Hat"].map((item) => (
                      <li key={item}>
                        <button
                          onClick={() => {
                            setActiveDepartment("accessories");
                            document.getElementById("boutique-catalog")?.scrollIntoView({ behavior: "smooth" });
                          }}
                          className="hover:text-[#422216] hover:translate-x-1 transition-all flex items-center space-x-1"
                        >
                          <span className="text-[#a45d3e]">•</span>
                          <span>{item}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="w-36 sm:w-44 aspect-[3/4] rounded-xl overflow-hidden bg-[#f4ece3] shadow-md flex-shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=85"
                    alt="Accessories Collection"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. Clean Boutique Product Catalog (Ref 1 Shop Screen) ──────────── */}
      <section id="boutique-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-neutral-200 gap-4">
          <div>
            <span className="text-xs font-sans uppercase tracking-[0.2em] text-[#a45d3e] font-semibold">
              Curated Wardrobe
            </span>
            <h2 className="text-3xl font-serif font-normal text-[#27150c] mt-1">
              Shop The Collection
            </h2>
          </div>

          {/* Filtering & Sorting Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-1 bg-white p-1 rounded-full border border-neutral-200 text-xs">
              {[
                { id: "trending", label: "Featured" },
                { id: "new", label: "New In" },
                { id: "bestsellers", label: "Bestsellers" },
                { id: "sale", label: "Super Sale" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-full transition font-medium ${
                    activeTab === tab.id
                      ? "bg-[#422216] text-white shadow-xs"
                      : "text-neutral-600 hover:text-black"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-neutral-200 px-3 py-1.5 rounded-full text-xs font-medium text-neutral-800 outline-none cursor-pointer"
            >
              <option value="featured">Default Sorting</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* 4-Column Product Grid (Ref 1 Shop Screen) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {displayedCatalog.map((product) => {
            const isWishlisted = wishlist.includes(product.id);
            const currentColor = selectedColors[product.id] || product.colors?.[0]?.name || "Standard";

            return (
              <div
                key={product.id}
                className="group bg-white rounded-xl overflow-hidden border border-[#eee5dc] hover:border-[#422216]/40 transition-all duration-300 flex flex-col justify-between shadow-xs hover:shadow-md"
              >
                {/* Image Container */}
                <div className="relative aspect-[3/4] bg-[#f8f5f0] overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {product.secondaryImage && (
                    <img
                      src={product.secondaryImage}
                      alt={`${product.title} alternate`}
                      className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    />
                  )}

                  {/* Badge */}
                  {product.badge && (
                    <span className="absolute top-2.5 left-2.5 text-[9px] font-sans uppercase tracking-wider bg-[#422216] text-white px-2 py-0.5 rounded-full font-medium shadow-xs">
                      {product.badge}
                    </span>
                  )}

                  {/* Wishlist Button */}
                  <button
                    onClick={() => onToggleWishlist(product.id)}
                    className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-neutral-600 hover:text-[#422216] transition shadow-xs"
                    aria-label="Add to wishlist"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        isWishlisted ? "fill-rose-500 text-rose-500" : "stroke-[1.75]"
                      }`}
                    />
                  </button>

                  {/* Quick View Button */}
                  <button
                    type="button"
                    onClick={() => handleOpenQuickView(product)}
                    className="absolute inset-x-3 bottom-3 py-2 bg-white/95 hover:bg-black hover:text-white text-neutral-900 text-[10px] uppercase tracking-wider font-semibold rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center space-x-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Quick View</span>
                  </button>
                </div>

                {/* Details */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-neutral-400">
                    <span className="uppercase tracking-wider font-medium text-[#a45d3e]">
                      {product.fabricBadge || "Atelier Crafted"}
                    </span>
                    <div className="flex items-center text-amber-500 space-x-1">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="font-semibold text-neutral-800">{product.rating || 4.9}</span>
                    </div>
                  </div>

                  <h3
                    onClick={() => onOpenProduct(product)}
                    className="text-xs sm:text-sm font-serif font-medium text-[#27150c] hover:text-[#a45d3e] cursor-pointer transition line-clamp-1"
                  >
                    {product.title}
                  </h3>

                  <div className="flex items-baseline space-x-2 pt-0.5">
                    <span className="text-sm sm:text-base font-bold text-[#422216] tabular-nums">
                      {formatPrice(product.price)}
                    </span>
                    {product.comparePrice > product.price && (
                      <span className="text-xs text-neutral-400 line-through tabular-nums">
                        {formatPrice(product.comparePrice)}
                      </span>
                    )}
                  </div>

                  {/* Size Quick Add */}
                  <div className="pt-2 flex items-center justify-between border-t border-neutral-100">
                    <div className="flex items-center space-x-1">
                      {(product.sizes || ["S", "M", "L"]).map((sz: string) => (
                        <button
                          key={sz}
                          onClick={() => handleQuickSizeAdd(product, sz)}
                          className="px-2 py-0.5 text-[10px] font-medium rounded bg-[#faf7f2] hover:bg-[#422216] hover:text-white text-neutral-700 transition"
                          title={`Quick add size ${sz}`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => onAddToCart(product, product.variants?.[0] || {})}
                      className="p-1.5 rounded-full bg-[#422216] text-white hover:bg-[#2b170e] transition"
                      title="Add to Cart"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── 7. Boutique Luxury Footer ───────────────────────────────────────── */}
      <footer className="bg-[#24130b] text-[#d6c7be] text-xs font-sans border-t border-[#3a1f12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="space-y-4 md:col-span-1">
              <span className="text-2xl font-serif text-white block">Clothing.</span>
              <p className="text-xs text-[#a99488] leading-relaxed">
                Handcrafted garments, sustainable linens, and ethical ateliers. Designed for effortless modern living.
              </p>
              <p className="text-[11px] text-[#846f64]">
                Customer Concierge: support@clothing-atelier.com
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Collections</h4>
              <ul className="space-y-2 text-[#a99488]">
                <li><button onClick={() => setActiveDepartment("all")} className="hover:text-white transition">All Items</button></li>
                <li><button onClick={() => setActiveDepartment("tees")} className="hover:text-white transition">Women's Summer</button></li>
                <li><button onClick={() => setActiveDepartment("outerwear")} className="hover:text-white transition">Men's Tailoring</button></li>
                <li><button onClick={() => setActiveDepartment("accessories")} className="hover:text-white transition">Handcrafted Accessories</button></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Client Services</h4>
              <ul className="space-y-2 text-[#a99488]">
                {onOpenTrackOrder && (
                  <li><button onClick={onOpenTrackOrder} className="hover:text-white transition">Track Consignment</button></li>
                )}
                <li><button onClick={() => setIsSizeGuideOpen(true)} className="hover:text-white transition">Size & Fit Guide</button></li>
                <li><span>Doorstep Fit Verification</span></li>
                <li><span>14-Day Free Exchange</span></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Security & Guarantee</h4>
              <p className="text-[#a99488] leading-relaxed">
                Cash on Delivery (COD) supported nationwide. Inspect your garments before completing payment.
              </p>
              <div className="flex flex-wrap gap-2 pt-2 text-[10px]">
                <span className="px-2 py-1 bg-[#331c12] rounded text-[#d6c7be]">Cash on Delivery</span>
                <span className="px-2 py-1 bg-[#331c12] rounded text-[#d6c7be]">Visa / Master</span>
                <span className="px-2 py-1 bg-[#331c12] rounded text-[#d6c7be]">bKash / Nagad</span>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-[#3a1f12] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#846f64] gap-4">
            <span>© {new Date().getFullYear()} Clothing. Atelier. All rights reserved.</span>
            <span>Worldwide Shipping // Powered by StoreSwift</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
