"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Search,
  Heart,
  User,
  ArrowUpRight,
  Menu,
  X,
  Star,
  Flame,
  ArrowRight,
  Eye,
  SlidersHorizontal,
  Plus
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
  const [isTabletView, setIsTabletView] = useState(true);

  // 5 Staggered Department Cards matching Reference 2 Exact
  const MILANO_DEPARTMENTS = [
    {
      id: "hoodies",
      name: "Hoodies",
      heightClass: "h-64 sm:h-80",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=700&auto=format&fit=crop&q=80",
      grayscale: true,
      hasArrow: false
    },
    {
      id: "sweatshirts",
      name: "Sweatshirts",
      heightClass: "h-56 sm:h-64",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=700&auto=format&fit=crop&q=80",
      grayscale: true,
      hasArrow: false
    },
    {
      id: "shirts",
      name: "Shirts",
      heightClass: "h-72 sm:h-[400px]",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=700&auto=format&fit=crop&q=80",
      grayscale: false,
      hasArrow: true
    },
    {
      id: "tees",
      name: "T-Shirts",
      heightClass: "h-56 sm:h-64",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700&auto=format&fit=crop&q=80",
      grayscale: true,
      hasArrow: false
    },
    {
      id: "jackets",
      name: "Jackets",
      heightClass: "h-64 sm:h-80",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=700&auto=format&fit=crop&q=80",
      grayscale: true,
      hasArrow: false
    }
  ];

  const storeContent = (
    <div className="bg-[#e8e4de] text-neutral-950 font-sans antialiased selection:bg-black selection:text-white pb-16">
      {/* ─── 1. Milano Minimalist Header (Ref 2 Exact) ───────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#e8e4de]/95 backdrop-blur-md border-b border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
          {/* Left: Boxed M Logo + MILANO & Hamburger Icon */}
          <div className="flex items-center space-x-4">
            <Link href={`/store/${tenantSlug}`} className="flex items-center space-x-2.5 group">
              <div className="w-6 h-6 rounded-xs bg-black text-white flex items-center justify-center font-bold text-xs tracking-tighter">
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

          {/* Right Action Icons (Ref 2 Exact: Search, Heart, User, Cart with 0) */}
          <div className="flex items-center space-x-3 sm:space-x-4 text-black">
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
                {cartItems.reduce((s: number, i: any) => s + i.quantity, 0)}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-sm bg-[#e8e4de] p-6 space-y-6 shadow-2xl flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-black/10">
                <span className="text-xl font-black tracking-widest uppercase">M MILANO</span>
                <button onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-col space-y-3 font-bold text-sm tracking-widest uppercase">
                {["all", "hoodies", "tees", "denim", "outerwear"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveDepartment(cat);
                      setIsMobileMenuOpen(false);
                      document.getElementById("milano-catalog")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-left py-2 border-b border-black/10 hover:translate-x-1 transition"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-xs font-mono text-neutral-600">
              <span>MILANO STREETWEAR // 2026</span>
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
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-0 leading-[0.88] tracking-tight">
                <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase text-[#111111] block">
                  GET
                </h1>
                <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase text-[#111111] block">
                  YOURSELF
                </h1>
                <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.35)] block">
                  INTO THE
                </h1>
                <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.35)] block">
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
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 items-end pt-4">
            {MILANO_DEPARTMENTS.map((dept) => (
              <div
                key={dept.id}
                onClick={() => {
                  setActiveDepartment(dept.id === "sweatshirts" ? "hoodies" : dept.id === "shirts" ? "outerwear" : dept.id);
                  document.getElementById("milano-catalog")?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`relative ${dept.heightClass} rounded-t-2xl sm:rounded-t-3xl overflow-hidden cursor-pointer group shadow-xl transition-all duration-500 hover:-translate-y-2`}
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
                    <div className="w-12 h-12 rounded-full bg-black/85 border-2 border-[#e69d45] text-[#e69d45] flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-[#e69d45] group-hover:text-black transition">
                      <ArrowRight className="w-5 h-5 stroke-[2.5]" />
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

      {/* ─── 4. Milano Streetwear Product Catalog ────────────────────────────── */}
      <section id="milano-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-black/15 gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-600 block">
              Summer 2026 Collection
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black mt-1">
              Engineered Apparel
            </h2>
          </div>

          {/* Department Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: "All Drops" },
              { id: "hoodies", label: "Hoodies & Fleeces" },
              { id: "tees", label: "Heavyweight Tees" },
              { id: "denim", label: "Selvedge Denim" },
              { id: "outerwear", label: "Outerwear" }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveDepartment(cat.id)}
                className={`px-3.5 py-1.5 rounded-xs text-xs font-mono uppercase tracking-wider transition ${
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

        {/* Catalog Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
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
                    <span className="absolute top-3 left-3 text-[9px] font-mono font-bold uppercase tracking-widest bg-black text-white px-2 py-0.5 rounded-xs">
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
                        isWishlisted ? "fill-red-600 text-red-600" : "stroke-[1.75]"
                      }`}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenQuickView(product)}
                    className="absolute inset-x-3 bottom-3 py-2 bg-black/90 hover:bg-black text-white text-[10px] font-mono uppercase tracking-widest rounded-xs opacity-0 group-hover:opacity-100 transition flex items-center justify-center space-x-1.5 shadow-md"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Quick View</span>
                  </button>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500">
                    <span className="uppercase tracking-widest">{product.category || "DROP"}</span>
                    <span className="text-black font-bold">★ {product.rating || 4.9}</span>
                  </div>

                  <h3
                    onClick={() => onOpenProduct(product)}
                    className="text-xs sm:text-sm font-bold text-black hover:opacity-70 transition cursor-pointer line-clamp-1 uppercase tracking-tight"
                  >
                    {product.title}
                  </h3>

                  <div className="flex items-baseline space-x-2 pt-0.5">
                    <span className="text-sm sm:text-base font-black text-black font-mono">
                      {formatPrice(product.price)}
                    </span>
                    {product.comparePrice > product.price && (
                      <span className="text-xs text-neutral-400 line-through font-mono">
                        {formatPrice(product.comparePrice)}
                      </span>
                    )}
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-black/10">
                    <div className="flex items-center space-x-1">
                      {(product.sizes || ["S", "M", "L"]).map((sz: string) => (
                        <button
                          key={sz}
                          onClick={() => handleQuickSizeAdd(product, sz)}
                          className="px-2 py-0.5 text-[9px] font-mono font-bold border border-black/20 hover:border-black hover:bg-black hover:text-white rounded-xs transition"
                        >
                          {sz}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => onAddToCart(product, product.variants?.[0] || {})}
                      className="p-1.5 bg-black text-white hover:bg-neutral-800 rounded-xs transition"
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

      {/* ─── 5. Minimalist Monochrome Footer ─────────────────────────────────── */}
      <footer className="bg-black text-white text-xs py-14 border-t border-white/10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <span className="text-lg font-black tracking-[0.3em] uppercase">M MILANO</span>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                Architectural luxury streetwear designed in Milan. Heavyweight Japanese cottons and Italian wools.
              </p>
            </div>
            <div className="space-y-2">
              <span className="font-mono text-[11px] uppercase tracking-widest text-neutral-400 block">
                Departments
              </span>
              <ul className="space-y-1.5 text-neutral-300">
                <li><button onClick={() => setActiveDepartment("hoodies")} className="hover:text-white">Hoodies</button></li>
                <li><button onClick={() => setActiveDepartment("tees")} className="hover:text-white">T-Shirts</button></li>
                <li><button onClick={() => setActiveDepartment("outerwear")} className="hover:text-white">Jackets & Coats</button></li>
              </ul>
            </div>
            <div className="space-y-2">
              <span className="font-mono text-[11px] uppercase tracking-widest text-neutral-400 block">
                Customer Care
              </span>
              <ul className="space-y-1.5 text-neutral-300">
                {onOpenTrackOrder && (
                  <li><button onClick={onOpenTrackOrder} className="hover:text-white">Track Order</button></li>
                )}
                <li><span>Worldwide Express</span></li>
                <li><span>Complimentary Returns</span></li>
              </ul>
            </div>
            <div className="space-y-2">
              <span className="font-mono text-[11px] uppercase tracking-widest text-neutral-400 block">
                Security & Guarantee
              </span>
              <p className="text-neutral-400 text-[11px]">
                Cash on Delivery with Doorstep Fit Trial available for all orders.
              </p>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between text-neutral-500 text-[10px] font-mono">
            <span>© {new Date().getFullYear()} MILANO ARCHIVE. ALL RIGHTS RESERVED.</span>
            <span>POWERED BY STORESWIFT</span>
          </div>
        </div>
      </footer>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#e8e4de] text-neutral-950 font-sans antialiased selection:bg-black selection:text-white pb-16">
      {storeContent}
    </div>
  );
}
