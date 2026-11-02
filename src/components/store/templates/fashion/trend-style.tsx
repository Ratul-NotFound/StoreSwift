"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Search,
  Heart,
  ArrowRight,
  Menu,
  X,
  Star,
  Eye,
  Sparkles,
  Tag,
  CheckCircle2,
  ChevronRight,
  Truck,
  Smartphone,
  Download
} from "lucide-react";
import { FashionSubTemplateProps } from "./types";

export function TrendStyle({
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

  // 3 Pastel Category Cards (Ref 3 Exact: Hoodies, Coats, Tees)
  const NEW_ARRIVALS = [
    {
      id: "hoodies",
      title: "Hoodies & Sweatshirt",
      bgColor: "bg-[#888b90]",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=85",
      link: "Explore Now!"
    },
    {
      id: "outerwear",
      title: "Coats & Parkas",
      bgColor: "bg-[#9b87c7]",
      image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&auto=format&fit=crop&q=85",
      link: "Explore Now!"
    },
    {
      id: "tees",
      title: "Tees & T-Shirt",
      bgColor: "bg-[#6bc8c6]",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=85",
      link: "Explore Now!"
    }
  ];

  return (
    <div className="min-h-screen bg-[#fed053] text-neutral-900 font-sans antialiased selection:bg-black selection:text-[#fed053] py-4 sm:py-8 px-2 sm:px-6 relative overflow-x-hidden">
      {/* Background Decorative Concentric Arcs (Ref 3 Exact) */}
      <svg className="absolute top-0 left-0 w-96 h-96 text-amber-300/40 pointer-events-none -z-0" viewBox="0 0 400 400" fill="none">
        <circle cx="0" cy="0" r="120" stroke="currentColor" strokeWidth="2" />
        <circle cx="0" cy="0" r="200" stroke="currentColor" strokeWidth="2" />
        <circle cx="0" cy="0" r="280" stroke="currentColor" strokeWidth="2" />
        <circle cx="0" cy="0" r="360" stroke="currentColor" strokeWidth="2" />
      </svg>
      <svg className="absolute bottom-0 right-0 w-96 h-96 text-amber-300/40 pointer-events-none -z-0" viewBox="0 0 400 400" fill="none">
        <circle cx="400" cy="400" r="140" stroke="currentColor" strokeWidth="2" />
        <circle cx="400" cy="400" r="220" stroke="currentColor" strokeWidth="2" />
        <circle cx="400" cy="400" r="300" stroke="currentColor" strokeWidth="2" />
      </svg>

      {/* ─── White Card Container (Ref 3 Exact) ──────────────────────────────── */}
      <div className="max-w-[1360px] mx-auto bg-white rounded-[32px] sm:rounded-[44px] shadow-2xl overflow-hidden border border-amber-200/50 relative z-10 pb-8">
        {/* ─── 1. High-Street Header: FASHION (Ref 3 Exact) ────────────────────── */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            {/* Logo with Geometric Icon (Ref 3 Exact) */}
            <Link href={`/store/${tenantSlug}`} className="flex items-center space-x-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-black text-[#ffd630] flex items-center justify-center font-black text-lg">
                <span className="transform -rotate-12">✦</span>
              </div>
              <span className="text-xl sm:text-2xl font-black tracking-wider uppercase text-black">
                FASHION
              </span>
            </Link>

            {/* Uppercase Navigation Links (Ref 3 Exact) */}
            <nav className="hidden lg:flex items-center space-x-8 text-xs font-bold uppercase tracking-wider text-neutral-600">
              <button
                onClick={() => {
                  setActiveDepartment("all");
                  document.getElementById("trend-hero")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="hover:text-black transition"
              >
                CATALOGUE
              </button>
              <button
                onClick={() => {
                  setActiveDepartment("tees");
                  document.getElementById("trend-arrivals")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="hover:text-black transition"
              >
                FASHION
              </button>
              <button
                onClick={() => {
                  setActiveDepartment("outerwear");
                  document.getElementById("trend-favourite")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="hover:text-black transition"
              >
                FAVOURITE
              </button>
              <button
                onClick={() => {
                  setActiveDepartment("accessories");
                  document.getElementById("trend-app")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="hover:text-black transition"
              >
                LIFESTYLE
              </button>
            </nav>

            {/* Right Controls: Sign Up Pill & Bag Icon (Ref 3 Exact) */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={onOpenSearch}
                className="p-2 hover:bg-neutral-100 rounded-full transition"
                title="Search"
              >
                <Search className="w-4 h-4 stroke-[2]" />
              </button>

              <button
                onClick={() => onToggleWishlist(displayedCatalog[0]?.id || "wishlist")}
                className="p-2 hover:bg-neutral-100 rounded-full transition relative"
                title="Wishlist"
              >
                <Heart className="w-4 h-4 stroke-[2]" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#ffd630] text-black text-[8px] font-black rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>

              <button
                onClick={onOpenCart}
                className="p-2 hover:bg-neutral-100 rounded-full transition relative flex items-center space-x-1"
                title="Cart"
              >
                <ShoppingBag className="w-4 h-4 stroke-[2]" />
                <span className="text-xs font-bold font-mono">
                  {cartItems.reduce((s: number, i: any) => s + i.quantity, 0)}
                </span>
              </button>

              {/* SIGN UP Pill Button (Ref 3 Exact) */}
              <button
                onClick={() => onAddToCart(displayedCatalog[0], displayedCatalog[0]?.variants[0])}
                className="hidden sm:inline-block px-6 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold tracking-wider uppercase rounded-full transition active:scale-95 shadow-sm"
              >
                SIGN UP
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-black"
                aria-label="Toggle menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex lg:hidden">
            <div className="w-4/5 max-w-sm bg-white p-6 space-y-6 shadow-2xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <span className="text-xl font-black">FASHION</span>
                  <button onClick={() => setMobileMenuOpen(false)}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-col space-y-3 font-bold text-sm tracking-wider uppercase">
                  <button onClick={() => { setActiveDepartment("all"); setMobileMenuOpen(false); }} className="text-left py-2 border-b">CATALOGUE</button>
                  <button onClick={() => { setActiveDepartment("tees"); setMobileMenuOpen(false); }} className="text-left py-2 border-b">FASHION</button>
                  <button onClick={() => { setActiveDepartment("outerwear"); setMobileMenuOpen(false); }} className="text-left py-2 border-b">FAVOURITE</button>
                  <button onClick={() => { setActiveDepartment("accessories"); setMobileMenuOpen(false); }} className="text-left py-2 border-b">LIFESTYLE</button>
                </div>
              </div>
              <button
                onClick={() => {
                  onAddToCart(displayedCatalog[0], displayedCatalog[0]?.variants[0]);
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 bg-black text-white rounded-full font-bold uppercase text-xs"
              >
                SIGN UP & GET 25% OFF
              </button>
            </div>
          </div>
        )}

        {/* ─── 2. Hero Section with Yellow Highlighter Blocks (Ref 3 Exact) ───── */}
        <section id="trend-hero" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="bg-[#f4f6f8] rounded-[36px] p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-sm">
            {/* Subtle Decorative Star/Sparkle Elements */}
            <div className="absolute top-10 left-12 text-2xl text-neutral-300 font-bold pointer-events-none">✦</div>
            <div className="absolute top-20 right-1/2 text-xl text-neutral-300 font-bold pointer-events-none">✦</div>
            <div className="absolute bottom-12 left-1/3 text-2xl text-neutral-300 font-bold pointer-events-none">✦</div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              {/* Left: Distinctive Highlighter Block Headline (Ref 3 Exact) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-1 font-black tracking-tight text-black text-4xl sm:text-6xl lg:text-7xl leading-[1.08]">
                  <div>LET'S</div>
                  <div className="inline-block relative">
                    <span className="bg-[#ffd630] px-4 py-1 inline-block -rotate-1 rounded-sm text-black">
                      EXPLORE
                    </span>
                  </div>
                  <div className="inline-block relative ml-2 sm:ml-3">
                    <span className="bg-[#ffd630] px-4 py-1 inline-block rotate-1 rounded-sm text-black">
                      UNIQUE
                    </span>
                  </div>
                  <div>CLOTHES.</div>
                </div>

                <p className="text-base sm:text-lg text-neutral-600 max-w-md font-medium">
                  Live for influential and innovative fashion!
                </p>

                <div className="pt-2">
                  <a
                    href="#trend-catalog"
                    className="inline-block px-9 py-4 bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-widest rounded-full shadow-lg hover:shadow-xl transition active:scale-95"
                  >
                    SHOP NOW
                  </a>
                </div>
              </div>

              {/* Right: Joyful Girl Model with Curly Hair Smiling (Ref 3 Exact) */}
              <div className="lg:col-span-5 relative flex justify-center">
                <div className="relative aspect-[3/4] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl bg-[#ffd6e0]/30 border-4 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=1000&auto=format&fit=crop&q=85"
                    alt="High Street Joyful Model in Curly Hair and Fluffy Coat"
                    className="w-full h-full object-cover object-top"
                  />
                  {/* Floating Star Badges */}
                  <div className="absolute top-4 right-4 text-white text-2xl drop-shadow-md">✦</div>
                  <div className="absolute bottom-6 left-6 text-white text-xl drop-shadow-md">✦</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 3. Brand Partner Banner Strip (Ref 3 Exact: Vibrant Yellow) ────── */}
        <section className="bg-[#ffd630] py-6 sm:py-8 my-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-around gap-6 sm:gap-10 font-black tracking-wider uppercase text-black text-lg sm:text-2xl">
              <span className="text-[#e11d48] tracking-tighter font-black hover:scale-105 transition cursor-default">H&M</span>
              <span className="tracking-widest font-black hover:scale-105 transition cursor-default">OBEY.</span>
              <span className="lowercase font-bold tracking-normal text-xl sm:text-2xl hover:scale-105 transition cursor-default flex items-center space-x-1">
                <span className="text-[#22c55e]">🛍</span>
                <span>shopify</span>
              </span>
              <span className="tracking-widest font-extrabold hover:scale-105 transition cursor-default flex items-center space-x-1">
                <span className="text-[#15803d]">🐊</span>
                <span>LACOSTE</span>
              </span>
              <span className="tracking-tighter font-black text-white bg-[#dc2626] px-2 py-0.5 rounded-xs hover:scale-105 transition cursor-default">
                Levi's
              </span>
              <span className="lowercase font-black tracking-normal text-xl sm:text-2xl hover:scale-105 transition cursor-default flex items-center">
                <span>amazon</span>
                <span className="text-[#f97316] text-xs ml-0.5">⌣</span>
              </span>
            </div>
          </div>
        </section>

        {/* ─── 4. NEW ARRIVALS: 3 Rounded Pastel Cards (Ref 3 Exact) ───────────── */}
        <section id="trend-arrivals" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="mb-10 text-center sm:text-left">
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black inline-block relative">
              <span>NEW ARRIVALS</span>
              <span className="absolute -bottom-1 left-0 w-24 h-2 bg-[#ffd630] -z-10 rounded-full" />
            </h2>
          </div>

          {/* 3 Pastel Category Cards (Ref 3 Exact) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {NEW_ARRIVALS.map((cat) => (
              <div
                key={cat.id}
                onClick={() => {
                  setActiveDepartment(cat.id);
                  document.getElementById("trend-catalog")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="group cursor-pointer space-y-4"
              >
                <div
                  className={`relative aspect-[3/4] ${cat.bgColor} rounded-3xl overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-500`}
                >
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="flex items-center justify-between px-2">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-black tracking-tight">
                      {cat.title}
                    </h3>
                    <span className="text-xs text-neutral-500 font-medium group-hover:text-black transition flex items-center space-x-1 mt-0.5">
                      <span>{cat.link}</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-neutral-100 group-hover:bg-[#ffd630] flex items-center justify-center transition">
                    <ArrowRight className="w-4 h-4 text-black" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 4B. Young's Favourite Section (Ref 3 Mockup Addition) ─────────────── */}
        <section id="trend-favourite" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-neutral-100">
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black inline-block relative">
              <span>Young's Favourite</span>
              <span className="absolute -bottom-1 left-0 w-28 h-2 bg-[#ffd630] -z-10 rounded-full" />
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Banner 1: Trending on Instagram */}
            <div
              onClick={() => {
                setActiveDepartment("tees");
                document.getElementById("trend-catalog")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="relative rounded-3xl overflow-hidden aspect-[16/9] cursor-pointer group shadow-lg"
            >
              <img
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&auto=format&fit=crop&q=85"
                alt="Trending on Instagram"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
                <span className="text-xs font-bold uppercase tracking-widest text-[#ffd630]">Exclusive Drop</span>
                <h3 className="text-2xl sm:text-3xl font-black mt-1">Trending on Instagram</h3>
                <span className="text-xs font-semibold mt-2 inline-flex items-center space-x-1 group-hover:text-[#ffd630] transition">
                  <span>Explore Now!</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Banner 2: All Under $40 */}
            <div
              onClick={() => {
                setPriceFilter("under-50");
                document.getElementById("trend-catalog")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="relative rounded-3xl overflow-hidden aspect-[16/9] cursor-pointer group shadow-lg"
            >
              <img
                src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1000&auto=format&fit=crop&q=85"
                alt="All Under $40"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
                <span className="text-xs font-bold uppercase tracking-widest text-[#ffd630]">Budget Friendly</span>
                <h3 className="text-2xl sm:text-3xl font-black mt-1">All Under $40</h3>
                <span className="text-xs font-semibold mt-2 inline-flex items-center space-x-1 group-hover:text-[#ffd630] transition">
                  <span>Explore Now!</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 4C. Download App & Get The Voucher (Ref 3 Mockup Addition) ───────── */}
        <section id="trend-app" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-[#f4f6f8] rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-md">
              <h3 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tight">
                DOWNLOAD APP &<br />GET 20% OFF VOUCHER!
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
                Get 20% off your first mobile in-app order. Enjoy seamless shopping, order tracking, and doorstep try-on delivery.
              </p>
              <div className="flex items-center space-x-3 pt-2">
                <div className="bg-black text-white px-4 py-2 rounded-xl flex items-center space-x-2 cursor-pointer hover:bg-neutral-800 transition">
                  <span className="text-base"></span>
                  <div className="text-left leading-tight">
                    <span className="text-[9px] block text-neutral-400">Download on the</span>
                    <span className="text-xs font-bold block">App Store</span>
                  </div>
                </div>
                <div className="bg-black text-white px-4 py-2 rounded-xl flex items-center space-x-2 cursor-pointer hover:bg-neutral-800 transition">
                  <span className="text-base">▶</span>
                  <div className="text-left leading-tight">
                    <span className="text-[9px] block text-neutral-400">Get it on</span>
                    <span className="text-xs font-bold block">Google Play</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-48 sm:w-60 aspect-[9/16] rounded-3xl bg-black border-4 border-neutral-900 shadow-2xl overflow-hidden relative p-2">
              <div className="w-full h-full bg-white rounded-2xl overflow-hidden flex flex-col">
                <div className="bg-[#ffd630] p-3 text-black text-center font-black text-xs">
                  FASHION APP
                </div>
                <div className="p-3 text-center space-y-2 flex-1 flex flex-col justify-center">
                  <span className="text-2xl font-black text-black">20% OFF</span>
                  <span className="text-[10px] text-neutral-500 font-mono">CODE: MOBILE20</span>
                  <div className="w-full py-1.5 bg-black text-white rounded-full text-[10px] font-bold">
                    CLAIM CODE
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 4D. JOIN SHOPPING COMMUNITY (Ref 3 Mockup Addition) ─────────────── */}
        <section className="bg-[#ffd630] py-12 sm:py-16 my-8">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
            <h2 className="text-2xl sm:text-4xl font-black text-black uppercase tracking-tight">
              JOIN SHOPPING COMMUNITY TO GET MONTHLY PROMO
            </h2>
            <p className="text-xs sm:text-sm text-neutral-800 max-w-md mx-auto font-medium">
              Type your email down below and be young wild generation.
            </p>
            <div className="max-w-md mx-auto flex items-center bg-white rounded-full p-1.5 shadow-md border border-neutral-200">
              <input
                type="email"
                placeholder="Add your email here"
                className="flex-1 px-4 py-2 text-xs text-neutral-800 outline-none bg-transparent"
              />
              <button
                type="button"
                onClick={() => onAddToCart(displayedCatalog[0], displayedCatalog[0]?.variants[0])}
                className="px-6 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase rounded-full transition"
              >
                SEND
              </button>
            </div>
          </div>
        </section>

        {/* ─── 5. High-Street Trend Product Catalog ────────────────────────────── */}
        <section id="trend-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-t border-neutral-100">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-neutral-200 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
                TRENDING DROPS
              </h2>
              <p className="text-xs text-neutral-500 font-medium mt-1">
                Fresh styles delivered directly to your doorstep.
              </p>
            </div>

            <div className="flex items-center space-x-2 text-xs font-bold uppercase">
              {[
                { id: "trending", label: "All Items" },
                { id: "new", label: "New In" },
                { id: "bestsellers", label: "Most Wanted" },
                { id: "sale", label: "Sale" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-full transition ${
                    activeTab === tab.id
                      ? "bg-black text-[#ffd630]"
                      : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {displayedCatalog.map((product: any) => {
              const isWishlisted = wishlist.includes(product.id);

              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl overflow-hidden border border-neutral-100 hover:border-black/20 transition-all duration-300 flex flex-col justify-between shadow-xs hover:shadow-xl"
                >
                  <div className="relative aspect-[3/4] bg-[#f4f6f8] overflow-hidden rounded-t-2xl">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {product.secondaryImage && (
                      <img
                        src={product.secondaryImage}
                        alt={product.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      />
                    )}

                    {product.badge && (
                      <span className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-wider bg-[#ffd630] text-black px-2.5 py-1 rounded-full shadow-xs">
                        {product.badge}
                      </span>
                    )}

                    <button
                      onClick={() => onToggleWishlist(product.id)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-black hover:scale-110 transition shadow-sm"
                      aria-label="Wishlist"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isWishlisted ? "fill-rose-500 text-rose-500" : "stroke-[2]"
                        }`}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenQuickView(product)}
                      className="absolute inset-x-3 bottom-3 py-2.5 bg-black/90 hover:bg-black text-white text-[11px] font-bold uppercase tracking-wider rounded-xl opacity-0 group-hover:opacity-100 transition flex items-center justify-center space-x-1.5 shadow-md"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Quick View</span>
                    </button>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs text-neutral-500">
                      <span className="font-bold uppercase tracking-wider text-black">
                        {product.category || "FASHION"}
                      </span>
                      <div className="flex items-center text-amber-500 space-x-1">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="font-bold text-neutral-800">{product.rating || 4.9}</span>
                      </div>
                    </div>

                    <h3
                      onClick={() => onOpenProduct(product)}
                      className="text-xs sm:text-sm font-bold text-black hover:text-neutral-600 transition cursor-pointer line-clamp-1"
                    >
                      {product.title}
                    </h3>

                    <div className="flex items-baseline space-x-2 pt-0.5">
                      <span className="text-base sm:text-lg font-black text-black tabular-nums">
                        {formatPrice(product.price)}
                      </span>
                      {product.comparePrice > product.price && (
                        <span className="text-xs text-neutral-400 line-through tabular-nums">
                          {formatPrice(product.comparePrice)}
                        </span>
                      )}
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-neutral-100">
                      <div className="flex items-center space-x-1">
                        {(product.sizes || ["S", "M", "L"]).map((sz: string) => (
                          <button
                            key={sz}
                            onClick={() => handleQuickSizeAdd(product, sz)}
                            className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-neutral-100 hover:bg-black hover:text-[#ffd630] transition"
                          >
                            {sz}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => onAddToCart(product, product.variants?.[0] || {})}
                        className="p-2 rounded-full bg-black text-[#ffd630] hover:bg-neutral-800 transition"
                        title="Add to Bag"
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

        {/* ─── 6. High-Street Trend Footer ─────────────────────────────────────── */}
        <footer className="bg-black text-white text-xs py-16 border-t border-neutral-800 mt-8 rounded-b-[32px] sm:rounded-b-[44px]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
              <div className="space-y-4">
                <span className="text-2xl font-black tracking-wider text-[#ffd630]">FASHION</span>
                <p className="text-neutral-400 leading-relaxed">
                  Complete your style with awesome clothes from FASHION. Innovative, youthful, and influential.
                </p>
              </div>
              <div className="space-y-3">
                <span className="font-bold uppercase tracking-wider text-white">Company</span>
                <ul className="space-y-2 text-neutral-400">
                  <li><span>About Us</span></li>
                  <li><span>Careers</span></li>
                  <li><span>Support</span></li>
                </ul>
              </div>
              <div className="space-y-3">
                <span className="font-bold uppercase tracking-wider text-white">Quick Link</span>
                <ul className="space-y-2 text-neutral-400">
                  {onOpenTrackOrder && (
                    <li><button onClick={onOpenTrackOrder} className="hover:text-white transition">Track Order</button></li>
                  )}
                  <li><span>Size Guide</span></li>
                  <li><span>FAQs</span></li>
                </ul>
              </div>
              <div className="space-y-3">
                <span className="font-bold uppercase tracking-wider text-white">Legal</span>
                <p className="text-neutral-400">Terms & Conditions • Privacy Policy</p>
                <div className="pt-2 text-neutral-400">
                  <span>Doorstep Fit Trial Included.</span>
                </div>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-neutral-800 text-center text-neutral-500 text-xs">
              © {new Date().getFullYear()} FASHION. All Rights Reserved. Powered by StoreSwift.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
