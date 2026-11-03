"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Search,
  Heart,
  ArrowUpRight,
  Menu,
  X,
  User,
  ArrowRight,
  Eye,
  SlidersHorizontal,
  Plus,
  Truck,
  ShieldCheck,
  CreditCard,
  RotateCcw,
  Compass,
  Package
} from "lucide-react";
import { FashionSubTemplateProps } from "./types";

export function MilanoStyle({
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 5 Staggered Department Cards matching Reference 2 Exact
  const MILANO_DEPARTMENTS = [
    {
      id: "hoodies",
      name: "Hoodies",
      heightClass: "h-64 sm:h-80 w-44 sm:w-auto flex-shrink-0",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=700&auto=format&fit=crop&q=80",
      grayscale: true,
      hasArrow: false
    },
    {
      id: "sweatshirts",
      name: "Sweatshirts",
      heightClass: "h-56 sm:h-64 w-38 sm:w-auto flex-shrink-0",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=700&auto=format&fit=crop&q=80",
      grayscale: true,
      hasArrow: false
    },
    {
      id: "shirts",
      name: "Shirts",
      heightClass: "h-72 sm:h-[400px] w-48 sm:w-auto flex-shrink-0",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=700&auto=format&fit=crop&q=80",
      grayscale: false,
      hasArrow: true
    },
    {
      id: "tees",
      name: "T-Shirts",
      heightClass: "h-56 sm:h-64 w-38 sm:w-auto flex-shrink-0",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700&auto=format&fit=crop&q=80",
      grayscale: true,
      hasArrow: false
    },
    {
      id: "outerwear",
      name: "Jackets",
      heightClass: "h-64 sm:h-80 w-44 sm:w-auto flex-shrink-0",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=700&auto=format&fit=crop&q=80",
      grayscale: true,
      hasArrow: false
    }
  ];

  const totalCartCount = cartItems.reduce((s: number, i: any) => s + i.quantity, 0);

  return (
    <div className="min-h-screen bg-[#e8e4de] text-neutral-950 font-sans antialiased selection:bg-black selection:text-white pb-16 md:pb-0">
      {/* ─── Top Monospaced Ticker ─────────────────────────────────────────── */}
      <div className="bg-black text-[#e8e4de] text-[10px] font-mono py-1.5 px-4 tracking-widest uppercase flex items-center justify-between border-b border-neutral-800">
        <div className="hidden sm:block">MILANO ARCHIVE // DROP 04</div>
        <div className="flex-1 text-center font-bold">
          WORLDWIDE EXPRESS COURIER • CASH ON DELIVERY SUPPORTED NATIONWIDE
        </div>
        <div className="hidden sm:block">SS26 APPAREL</div>
      </div>

      {/* ─── 1. Milano Minimalist Header (Ref 2 Exact) ───────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#e8e4de]/95 backdrop-blur-md border-b border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Left: Boxed M Logo + MILANO & Hamburger Icon */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link href={`/store/${tenantSlug}`} className="flex items-center space-x-2.5 group">
              <div className="w-6 h-6 rounded-xs bg-black text-white flex items-center justify-center font-black text-xs tracking-tighter shadow-xs">
                M
              </div>
              <span className="text-base sm:text-lg font-black tracking-[0.25em] uppercase text-black">
                MILANO
              </span>
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 text-neutral-800 hover:text-black transition"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 stroke-[2]" />
            </button>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-8 text-xs font-mono font-bold uppercase tracking-widest text-neutral-800">
            {["all", "hoodies", "tees", "denim", "outerwear"].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveDepartment(cat);
                  document.getElementById("milano-catalog")?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`hover:text-black transition pb-0.5 ${
                  activeDepartment === cat ? "border-b-2 border-black text-black" : "text-neutral-600"
                }`}
              >
                {cat === "all" ? "All Drops" : cat}
              </button>
            ))}
          </nav>

          {/* Right Action Icons (Ref 2 Exact: Search, Heart, User, Cart with 0) */}
          <div className="flex items-center space-x-2 sm:space-x-4 text-black">
            <button
              onClick={onOpenSearch}
              className="p-1.5 hover:opacity-70 transition"
              title="Search"
              aria-label="Search"
            >
              <Search className="w-4 h-4 stroke-[2]" />
            </button>

            <button
              onClick={() => onToggleWishlist(displayedCatalog[0]?.id || "wishlist")}
              className="p-1.5 hover:opacity-70 transition relative"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4 stroke-[2]" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-black text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={onOpenTrackOrder}
              className="p-1.5 hover:opacity-70 transition hidden sm:inline-block"
              title="Account / Tracking"
              aria-label="User Account"
            >
              <User className="w-4 h-4 stroke-[2]" />
            </button>

            <button
              onClick={onOpenCart}
              className="p-1.5 hover:opacity-70 transition relative flex items-center space-x-1"
              title="Shopping Cart"
              aria-label="Cart"
            >
              <ShoppingBag className="w-4 h-4 stroke-[2]" />
              <span className="text-xs font-bold font-mono">
                {totalCartCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ─── Mobile Menu Drawer ──────────────────────────────────────────────── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-sm bg-[#e8e4de] p-6 space-y-6 shadow-2xl flex flex-col justify-between animate-slide-right">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-black/10">
                <span className="text-xl font-black tracking-widest uppercase">M MILANO</span>
                <button onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search Button */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenSearch();
                }}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-white rounded-xs border border-black/10 text-xs font-mono uppercase text-neutral-500 shadow-xs"
              >
                <span>Search Drops...</span>
                <Search className="w-4 h-4" />
              </button>

              <div className="flex flex-col space-y-3 font-mono font-bold text-xs tracking-widest uppercase">
                {["all", "hoodies", "tees", "denim", "outerwear"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveDepartment(cat);
                      setIsMobileMenuOpen(false);
                      document.getElementById("milano-catalog")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-left py-2 border-b border-black/10 hover:translate-x-1 transition flex items-center justify-between"
                  >
                    <span>{cat === "all" ? "All Collections" : cat}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-black/10">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenTrackOrder && onOpenTrackOrder();
                }}
                className="w-full py-2.5 bg-white border border-black text-black text-xs font-mono font-bold uppercase rounded-xs"
              >
                Track Order
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenCheckout && onOpenCheckout();
                }}
                className="w-full py-3 bg-black text-white text-xs font-mono font-bold uppercase rounded-xs shadow-md"
              >
                Express Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── 2. Signature Milano Hero with 5 Integrated Staggered Cards (Ref 2 Exact) ── */}
      <section className="relative overflow-hidden bg-[#e8e4de] pt-8 sm:pt-14 pb-0">
        {/* Soft amber square frosted blur (Ref 2 Exact) */}
        <div className="absolute right-[22%] top-[14%] w-80 sm:w-96 h-80 sm:h-96 rounded-3xl bg-[#c9956d]/35 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Top Half: Headline on Left, Model on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pb-8 sm:pb-12">
            {/* Left: High-Impact Display Typography (Ref 2 Exact) */}
            <div className="lg:col-span-7 space-y-5 text-center sm:text-left">
              <div className="space-y-0 leading-[0.88] tracking-tight">
                <h1 className="text-4xl sm:text-7xl lg:text-8xl font-black uppercase text-[#111111] block">
                  GET
                </h1>
                <h1 className="text-4xl sm:text-7xl lg:text-8xl font-black uppercase text-[#111111] block">
                  YOURSELF
                </h1>
                <h1 className="text-4xl sm:text-7xl lg:text-8xl font-black uppercase text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.35)] block">
                  INTO THE
                </h1>
                <h1 className="text-4xl sm:text-7xl lg:text-8xl font-black uppercase text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.35)] block">
                  RIGHT GEAR
                </h1>
              </div>

              <div className="pt-2">
                <a
                  href="#milano-catalog"
                  className="inline-flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-[0.25em] text-neutral-800 hover:text-black border-b-2 border-black pb-1 transition group"
                >
                  <span>VIEW SUMMER COLLECTIONS</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </div>

            {/* Right: Streetwear Model in Sleeveless Hoodie looking down (Ref 2 Exact) */}
            <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
              <div className="relative w-64 sm:w-80 aspect-[3/4] overflow-hidden rounded-2xl shadow-xl bg-[#cfc5bb] border border-black/10">
                <img
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1000&auto=format&fit=crop&q=85"
                  alt="Milano Streetwear Model in Sleeveless Hoodie"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 text-white text-[10px] font-mono tracking-widest uppercase">
                  <span>URBAN SILHOUETTE // 2026</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Half: 5 Staggered Department Vertical Cards (Ref 2 Exact) */}
          <div className="flex sm:grid sm:grid-cols-5 gap-3 sm:gap-4 items-end pt-4 overflow-x-auto snap-x no-scrollbar pb-2 sm:pb-0">
            {MILANO_DEPARTMENTS.map((dept) => (
              <div
                key={dept.id}
                onClick={() => {
                  setActiveDepartment(dept.id === "sweatshirts" ? "hoodies" : dept.id === "shirts" ? "outerwear" : dept.id);
                  document.getElementById("milano-catalog")?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`relative ${dept.heightClass} rounded-t-2xl sm:rounded-t-3xl overflow-hidden cursor-pointer group shadow-xl transition-all duration-500 hover:-translate-y-2 snap-center`}
              >
                <img
                  src={dept.image}
                  alt={dept.name}
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                    dept.grayscale ? "grayscale contrast-125 brightness-90 group-hover:grayscale-0" : ""
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                {/* Center arrow circle button if center card (Ref 2 Exact) */}
                {dept.hasArrow && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/85 border-2 border-[#e69d45] text-[#e69d45] flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-[#e69d45] group-hover:text-black transition">
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                    </div>
                  </div>
                )}

                {/* Vertical Label at Bottom */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className={`text-xs sm:text-sm font-bold uppercase tracking-widest block [writing-mode:vertical-rl] rotate-180 group-hover:text-amber-400 transition ${
                    dept.hasArrow ? "text-amber-400 font-black" : ""
                  }`}>
                    {dept.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3. Value Proposition Badges Strip ─────────────────────────────── */}
      <section className="py-6 sm:py-8 bg-[#dedad3] border-t border-b border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 font-mono">
            <div className="p-4 rounded-xl bg-white/60 border border-black/5 flex items-center space-x-3">
              <Truck className="w-5 h-5 text-black flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold uppercase">Express Cargo</h4>
                <p className="text-[10px] text-neutral-500">Fast doorstep delivery</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/60 border border-black/5 flex items-center space-x-3">
              <CreditCard className="w-5 h-5 text-black flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold uppercase">COD Available</h4>
                <p className="text-[10px] text-neutral-500">Pay on parcel inspection</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/60 border border-black/5 flex items-center space-x-3">
              <RotateCcw className="w-5 h-5 text-black flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold uppercase">Size Exchange</h4>
                <p className="text-[10px] text-neutral-500">14-day hassle-free swap</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/60 border border-black/5 flex items-center space-x-3">
              <ShieldCheck className="w-5 h-5 text-black flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold uppercase">100% Verified</h4>
                <p className="text-[10px] text-neutral-500">Japanese heavyweight cotton</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. Milano Streetwear Product Catalog ────────────────────────────── */}
      <section id="milano-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-black/15 gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-600 block">
              Summer 2026 Collection
            </span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black mt-1">
              Engineered Apparel
            </h2>
          </div>

          {/* Department Pills */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {[
              { id: "all", label: "All Drops" },
              { id: "hoodies", label: "Hoodies" },
              { id: "tees", label: "Tees" },
              { id: "denim", label: "Denim" },
              { id: "outerwear", label: "Outerwear" }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveDepartment(cat.id)}
                className={`px-3 py-1.5 rounded-xs text-xs font-mono uppercase tracking-wider transition ${
                  activeDepartment === cat.id
                    ? "bg-black text-white font-bold"
                    : "bg-black/5 text-neutral-700 hover:bg-black/10"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Mobile / 4-Column Desktop Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {displayedCatalog.map((product: any) => {
            const isWishlisted = wishlist.includes(product.id);

            return (
              <div
                key={product.id}
                className="group bg-white rounded-xl overflow-hidden border border-black/10 hover:border-black transition-all duration-300 flex flex-col justify-between shadow-xs hover:shadow-xl"
              >
                <div className="relative aspect-[3/4] bg-[#dedad3] overflow-hidden">
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
                    <span className="absolute top-2.5 left-2.5 text-[8px] sm:text-[9px] font-mono font-bold uppercase tracking-widest bg-black text-white px-2 py-0.5 rounded-xs">
                      {product.badge}
                    </span>
                  )}

                  <button
                    onClick={() => onToggleWishlist(product.id)}
                    className="absolute top-2.5 right-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-black hover:scale-110 transition shadow-xs"
                    aria-label="Wishlist"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                        isWishlisted ? "fill-red-600 text-red-600" : "stroke-[1.75]"
                      }`}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenQuickView && handleOpenQuickView(product)}
                    className="absolute inset-x-2 bottom-2 py-2 bg-black/90 hover:bg-black text-white text-[9px] sm:text-[10px] font-mono uppercase tracking-widest rounded-xs opacity-0 group-hover:opacity-100 transition flex items-center justify-center space-x-1.5 shadow-md"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Quick View</span>
                  </button>
                </div>

                <div className="p-3 sm:p-4 space-y-1.5 sm:space-y-2 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
                      <span className="uppercase tracking-widest">{product.category || "DROP"}</span>
                      <span className="text-black font-bold">★ {product.rating || 4.9}</span>
                    </div>

                    <h3
                      onClick={() => onOpenProduct && onOpenProduct(product)}
                      className="text-xs sm:text-sm font-bold text-black hover:opacity-70 transition cursor-pointer line-clamp-1 uppercase tracking-tight mt-0.5"
                    >
                      {product.title}
                    </h3>

                    <div className="flex items-baseline space-x-2 pt-0.5">
                      <span className="text-xs sm:text-base font-black text-black font-mono">
                        {formatPrice(product.price)}
                      </span>
                      {product.comparePrice > product.price && (
                        <span className="text-[10px] sm:text-xs text-neutral-400 line-through font-mono">
                          {formatPrice(product.comparePrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-black/10">
                    <div className="flex items-center space-x-1">
                      {(product.sizes || ["S", "M", "L"]).map((sz: string) => (
                        <button
                          key={sz}
                          onClick={() => handleQuickSizeAdd && handleQuickSizeAdd(product, sz)}
                          className="px-1.5 py-0.5 text-[8px] sm:text-[9px] font-mono font-bold border border-black/20 hover:border-black hover:bg-black hover:text-white rounded-xs transition"
                        >
                          {sz}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => onAddToCart(product, product.variants?.[0] || {})}
                      className="p-1 sm:p-1.5 bg-black text-white hover:bg-neutral-800 rounded-xs transition"
                      title="Add to Cart"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── 5. Streetwear Editorial Capsule Showcase ─────────────────────────── */}
      <section className="bg-black text-white py-16 sm:py-20 border-t border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-400 block">
                Technical Specifications
              </span>
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
                Heavyweight 450GSM Loopback Cotton
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 font-mono leading-relaxed">
                Constructed with custom-milled Japanese loopback terry, double-needle cover-stitched seams, and reinforced ribbing. Built for durability and silhouette retention.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    const el = document.getElementById("milano-catalog");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-6 py-3 bg-white text-black text-xs font-mono font-bold uppercase tracking-widest rounded-xs hover:bg-neutral-200 transition"
                >
                  Shop Heavyweight Drops
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 aspect-[16/9] sm:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200&auto=format&fit=crop&q=85"
                alt="Milano Garment Construction"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. Comprehensive Production Streetwear Footer ───────────────────── */}
      <footer className="bg-black text-white text-xs py-14 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 sm:col-span-1 space-y-3">
              <span className="text-lg font-black tracking-[0.3em] uppercase block">M MILANO</span>
              <p className="text-neutral-400 text-[11px] leading-relaxed font-mono">
                Architectural luxury streetwear designed in Milan. Heavyweight Japanese cottons and Italian wools.
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-mono text-[11px] uppercase tracking-widest text-neutral-400 block font-bold">
                Departments
              </span>
              <ul className="space-y-1.5 text-neutral-300 font-mono text-[11px]">
                <li><button onClick={() => setActiveDepartment("hoodies")} className="hover:text-white">Hoodies</button></li>
                <li><button onClick={() => setActiveDepartment("tees")} className="hover:text-white">T-Shirts</button></li>
                <li><button onClick={() => setActiveDepartment("denim")} className="hover:text-white">Selvedge Denim</button></li>
                <li><button onClick={() => setActiveDepartment("outerwear")} className="hover:text-white">Jackets & Coats</button></li>
              </ul>
            </div>

            <div className="space-y-2">
              <span className="font-mono text-[11px] uppercase tracking-widest text-neutral-400 block font-bold">
                Customer Care
              </span>
              <ul className="space-y-1.5 text-neutral-300 font-mono text-[11px]">
                <li><button onClick={onOpenTrackOrder} className="hover:text-white">Track Order</button></li>
                <li><button onClick={() => setIsSizeGuideOpen(true)} className="hover:text-white">Size Chart</button></li>
                <li><span>Express Delivery</span></li>
                <li><span>14-Day Returns</span></li>
              </ul>
            </div>

            <div className="space-y-2">
              <span className="font-mono text-[11px] uppercase tracking-widest text-neutral-400 block font-bold">
                Security & Guarantee
              </span>
              <p className="text-neutral-400 text-[11px] font-mono leading-relaxed">
                Cash on Delivery with Doorstep Fit Trial available for all orders nationwide.
              </p>
              <div className="pt-2 flex flex-wrap gap-1.5 text-[9px] font-mono text-neutral-300">
                <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-800">COD</span>
                <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-800">VISA</span>
                <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-800">APPLE PAY</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between text-neutral-500 text-[10px] font-mono gap-2">
            <span>© 2026 MILANO ARCHIVE. ALL RIGHTS RESERVED.</span>
            <span>POWERED BY STORESWIFT</span>
          </div>
        </div>
      </footer>

      {/* ─── 7. Fixed Mobile Bottom Navigation Bar (True Mobile 1st) ─────────── */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-black/95 backdrop-blur-md border-t border-neutral-800 md:hidden flex items-center justify-around py-2 px-1 text-[10px] font-mono text-neutral-400 shadow-xl">
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex flex-col items-center space-y-0.5 text-white"
        >
          <Compass className="w-5 h-5 stroke-[1.75]" />
          <span>Home</span>
        </button>

        <button
          onClick={() => {
            document.getElementById("milano-catalog")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="flex flex-col items-center space-y-0.5 hover:text-white"
        >
          <Package className="w-5 h-5 stroke-[1.75]" />
          <span>Drops</span>
        </button>

        <button
          onClick={onOpenSearch}
          className="flex flex-col items-center space-y-0.5 hover:text-white"
        >
          <Search className="w-5 h-5 stroke-[1.75]" />
          <span>Search</span>
        </button>

        <button
          onClick={() => onToggleWishlist(displayedCatalog[0]?.id || "wishlist")}
          className="flex flex-col items-center space-y-0.5 relative hover:text-white"
        >
          <Heart className="w-5 h-5 stroke-[1.75]" />
          {wishlist.length > 0 && (
            <span className="absolute -top-1 right-2 w-3.5 h-3.5 bg-white text-black text-[8px] font-bold rounded-full flex items-center justify-center">
              {wishlist.length}
            </span>
          )}
          <span>Wishlist</span>
        </button>

        <button
          onClick={onOpenCart}
          className="flex flex-col items-center space-y-0.5 relative text-white font-bold"
        >
          <ShoppingBag className="w-5 h-5 stroke-[2]" />
          <span className="absolute -top-1 right-2 w-3.5 h-3.5 bg-white text-black text-[8px] font-bold rounded-full flex items-center justify-center">
            {totalCartCount}
          </span>
          <span>Bag</span>
        </button>
      </nav>
    </div>
  );
}
