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
import { FashionSubTemplateProps } from "./boutique-style";

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

  // 5 Staggered Department Cards (Ref 2 Exact)
  const MILANO_DEPARTMENTS = [
    {
      id: "hoodies",
      name: "Hoodies",
      heightClass: "h-80 sm:h-96",
      image: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=700&auto=format&fit=crop&q=80",
      grayscale: true,
      hasArrow: false
    },
    {
      id: "sweatshirts",
      name: "Sweatshirts",
      heightClass: "h-72 sm:h-84",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=700&auto=format&fit=crop&q=80",
      grayscale: true,
      hasArrow: false
    },
    {
      id: "tees",
      name: "T-Shirts",
      heightClass: "h-96 sm:h-[420px]",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=700&auto=format&fit=crop&q=80",
      grayscale: false,
      hasArrow: true
    },
    {
      id: "shirts",
      name: "Shirts",
      heightClass: "h-72 sm:h-84",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700&auto=format&fit=crop&q=80",
      grayscale: true,
      hasArrow: false
    },
    {
      id: "jackets",
      name: "Jackets",
      heightClass: "h-80 sm:h-96",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=700&auto=format&fit=crop&q=80",
      grayscale: true,
      hasArrow: false
    }
  ];

  return (
    <div className="min-h-screen bg-[#ded9d3] text-neutral-950 font-sans antialiased selection:bg-black selection:text-white">
      {/* ─── 1. Milano Minimalist Header (Ref 2 Exact) ───────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#ded9d3]/95 backdrop-blur-md border-b border-black/10">
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

          {/* Right Action Icons (Ref 2: Search, Heart, User, Cart with badge) */}
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
                {cartItems.reduce((s, i) => s + i.quantity, 0)}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-sm bg-[#ded9d3] p-6 space-y-6 shadow-2xl flex flex-col justify-between">
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

      {/* ─── 2. Signature Milano Hero: Split Frosted Typography (Ref 2 Exact) ── */}
      <section className="relative overflow-hidden bg-[#ded9d3] min-h-[580px] sm:min-h-[640px] flex items-center">
        {/* Amber & Frosted Aura on the Right */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 sm:w-3/5 bg-gradient-to-l from-[#c88d5e]/30 via-[#c88d5e]/15 to-transparent pointer-events-none" />
        <div className="absolute right-[20%] top-[30%] w-72 h-72 rounded-full bg-[#dca87e]/40 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: High-Impact Typography (Ref 2 Exact) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-0 leading-[0.92] tracking-tighter">
                <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase text-black block">
                  GET
                </h1>
                <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase text-black block">
                  YOURSELF
                </h1>
                <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase text-white drop-shadow-md block">
                  INTO THE
                </h1>
                <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase text-white drop-shadow-md block">
                  RIGHT GEAR
                </h1>
              </div>

              <div className="pt-4">
                <a
                  href="#milano-catalog"
                  className="inline-flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-[0.25em] text-neutral-800 hover:text-black border-b-2 border-black pb-1 transition group"
                >
                  <span>VIEW SUMMER COLLECTIONS</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </div>

            {/* Right: Streetwear Model in Sleeveless Vest (Ref 2 Exact) */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[3/4] max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl bg-[#cbbeb4] border border-white/30 backdrop-blur-xs">
                <img
                  src="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=1000&auto=format&fit=crop&q=80"
                  alt="Milano Streetwear Model"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 text-white text-xs font-mono tracking-widest uppercase">
                  <span>URBAN SILHOUETTE // 2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. Staggered Department Accordion Cards (Ref 2 Exact) ──────────── */}
      <section className="py-14 sm:py-20 bg-[#ded9d3] border-t border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center sm:text-left mb-8">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-600 block">
              Department Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black mt-1">
              Select Your Category
            </h2>
          </div>

          {/* 5 Staggered Vertical Cards Grid (Ref 2 Exact) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 items-end">
            {MILANO_DEPARTMENTS.map((dept) => (
              <div
                key={dept.id}
                onClick={() => {
                  setActiveDepartment(dept.id === "sweatshirts" ? "hoodies" : dept.id);
                  document.getElementById("milano-catalog")?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`relative ${dept.heightClass} rounded-2xl overflow-hidden cursor-pointer group shadow-lg transition-transform duration-500 hover:-translate-y-2`}
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
                    <div className="w-10 h-10 rounded-full bg-amber-500/90 text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                      <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                    </div>
                  </div>
                )}

                {/* Vertical Label at Bottom */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-widest block [writing-mode:vertical-rl] rotate-180 group-hover:text-amber-400 transition">
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
              CATALOGUE ARCHIVE // 2026
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black mt-1">
              Engineered Apparel
            </h2>
          </div>

          {/* Filtering Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto text-xs font-mono font-bold uppercase">
            {[
              { id: "trending", label: "Featured" },
              { id: "new", label: "New Season" },
              { id: "bestsellers", label: "Bestsellers" },
              { id: "sale", label: "Sale" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xs transition ${
                  activeTab === tab.id
                    ? "bg-black text-white"
                    : "bg-white/60 text-black hover:bg-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-7">
          {displayedCatalog.map((product) => {
            const isWishlisted = wishlist.includes(product.id);

            return (
              <div
                key={product.id}
                className="group bg-white rounded-xl overflow-hidden border border-black/10 hover:border-black transition-all duration-300 flex flex-col justify-between shadow-xs hover:shadow-xl"
              >
                <div className="relative aspect-[3/4] bg-[#eae6df] overflow-hidden">
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
                    <span className="absolute top-2 left-2 text-[9px] font-mono uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded-xs font-bold">
                      {product.badge}
                    </span>
                  )}

                  <button
                    onClick={() => onToggleWishlist(product.id)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-black hover:scale-110 transition"
                    aria-label="Wishlist"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        isWishlisted ? "fill-black text-black" : "stroke-[2]"
                      }`}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenQuickView(product)}
                    className="absolute inset-x-2 bottom-2 py-2 bg-black/90 hover:bg-black text-white text-[10px] font-mono uppercase tracking-wider font-bold rounded-xs opacity-0 group-hover:opacity-100 transition flex items-center justify-center space-x-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Quick View</span>
                  </button>
                </div>

                <div className="p-4 space-y-2">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-500 block">
                    {product.fabricBadge || "STREET GRADE"}
                  </span>

                  <h3
                    onClick={() => onOpenProduct(product)}
                    className="text-xs sm:text-sm font-bold text-black uppercase tracking-tight hover:underline cursor-pointer line-clamp-1"
                  >
                    {product.title}
                  </h3>

                  <div className="flex items-baseline space-x-2">
                    <span className="text-sm sm:text-base font-black font-mono text-black">
                      {formatPrice(product.price)}
                    </span>
                    {product.comparePrice > product.price && (
                      <span className="text-xs text-neutral-400 line-through font-mono">
                        {formatPrice(product.comparePrice)}
                      </span>
                    )}
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-neutral-100">
                    <div className="flex items-center space-x-1 font-mono text-[10px]">
                      {(product.sizes || ["S", "M", "L"]).map((sz: string) => (
                        <button
                          key={sz}
                          onClick={() => handleQuickSizeAdd(product, sz)}
                          className="px-1.5 py-0.5 rounded-xs bg-neutral-100 hover:bg-black hover:text-white transition font-bold"
                        >
                          {sz}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => onAddToCart(product, product.variants?.[0] || {})}
                      className="p-1.5 bg-black text-white rounded-xs hover:bg-neutral-800 transition"
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

      {/* ─── 5. Streetwear Minimalist Footer ─────────────────────────────────── */}
      <footer className="bg-black text-white font-mono text-xs border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <span className="text-xl font-black tracking-widest uppercase">M MILANO</span>
              <p className="text-xs text-neutral-400 font-sans">
                High-density streetwear engineered for modern metropolitan mobility.
              </p>
            </div>
            <div className="space-y-2 text-neutral-400">
              <span className="text-white font-bold block uppercase tracking-wider">Logistics & Protection</span>
              <p>Cash on Delivery (COD) supported nationwide.</p>
              <p>Doorstep sizing exchange arranged within 48 hours.</p>
            </div>
            <div className="space-y-2 text-neutral-400">
              <span className="text-white font-bold block uppercase tracking-wider">Consignment Concierge</span>
              {onOpenTrackOrder && (
                <button onClick={onOpenTrackOrder} className="hover:text-white underline block">
                  Track Delivery
                </button>
              )}
              <p>© {new Date().getFullYear()} MILANO GEAR // ALL RIGHTS RESERVED.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
