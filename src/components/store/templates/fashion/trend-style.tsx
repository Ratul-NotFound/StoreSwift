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
  Download,
  Plus,
  Compass,
  Package,
  RotateCcw,
  ShieldCheck
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

  const totalCartCount = cartItems.reduce((s: number, i: any) => s + i.quantity, 0);

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans antialiased selection:bg-[#ffd630] selection:text-black pb-16 md:pb-0">
      {/* ─── 1. High-Street Header: FASHION (Ref 3 Exact) ────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo with Star Icon (Ref 3 Exact) */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 -ml-1 text-black md:hidden hover:bg-neutral-100 rounded-lg transition"
              aria-label="Open Menu"
            >
              <Menu className="w-5 h-5 stroke-[2]" />
            </button>

            <Link href={`/store/${tenantSlug}`} className="flex items-center space-x-2 group">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-black text-[#ffd630] flex items-center justify-center font-bold text-sm shadow-xs group-hover:scale-105 transition">
                ✦
              </div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-black">
                FASHION
              </span>
            </Link>
          </div>

          {/* Desktop Nav Items (Ref 3 Exact: CATALOGUE, FASHION, FAVOURITE, LIFESTYLE) */}
          <nav className="hidden md:flex items-center space-x-8 text-xs font-black tracking-wider uppercase text-neutral-800">
            <button
              onClick={() => {
                setActiveDepartment("all");
                document.getElementById("trend-arrivals")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="hover:text-black transition"
            >
              CATALOGUE
            </button>
            <button
              onClick={() => {
                setActiveDepartment("tees");
                document.getElementById("trend-catalog")?.scrollIntoView({ behavior: "smooth" });
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
                document.getElementById("trend-app")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="hover:text-black transition"
            >
              LIFESTYLE
            </button>
          </nav>

          {/* Right Controls: Sign Up Pill & Bag Icon (Ref 3 Exact) */}
          <div className="flex items-center space-x-2 sm:space-x-4">
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
                {totalCartCount}
              </span>
            </button>

            {/* SIGN UP Pill Button (Ref 3 Exact) */}
            <button
              onClick={() => {
                if (displayedCatalog[0]) onAddToCart(displayedCatalog[0], displayedCatalog[0]?.variants[0]);
              }}
              className="hidden sm:inline-block px-6 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold tracking-wider uppercase rounded-full transition active:scale-95 shadow-sm"
            >
              SIGN UP
            </button>
          </div>
        </div>
      </header>

      {/* ─── Mobile Slide-out Menu ───────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex md:hidden">
          <div className="w-4/5 max-w-sm bg-white p-6 space-y-6 shadow-2xl flex flex-col justify-between animate-slide-right">
            <div>
              <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-black text-[#ffd630] flex items-center justify-center font-bold text-xs">
                    ✦
                  </div>
                  <span className="text-xl font-black tracking-tight text-black">FASHION</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-col space-y-3 font-bold text-sm tracking-wider uppercase pt-4">
                <button
                  onClick={() => {
                    setActiveDepartment("all");
                    setMobileMenuOpen(false);
                    document.getElementById("trend-arrivals")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-left py-2 border-b flex items-center justify-between"
                >
                  <span>CATALOGUE</span>
                  <ArrowRight className="w-4 h-4 text-neutral-400" />
                </button>
                <button
                  onClick={() => {
                    setActiveDepartment("tees");
                    setMobileMenuOpen(false);
                    document.getElementById("trend-catalog")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-left py-2 border-b flex items-center justify-between"
                >
                  <span>FASHION</span>
                  <ArrowRight className="w-4 h-4 text-neutral-400" />
                </button>
                <button
                  onClick={() => {
                    setActiveDepartment("outerwear");
                    setMobileMenuOpen(false);
                    document.getElementById("trend-favourite")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-left py-2 border-b flex items-center justify-between"
                >
                  <span>FAVOURITE</span>
                  <ArrowRight className="w-4 h-4 text-neutral-400" />
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    document.getElementById("trend-app")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-left py-2 border-b flex items-center justify-between"
                >
                  <span>LIFESTYLE</span>
                  <ArrowRight className="w-4 h-4 text-neutral-400" />
                </button>
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t">
              <button
                onClick={() => {
                  if (displayedCatalog[0]) onAddToCart(displayedCatalog[0], displayedCatalog[0]?.variants[0]);
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 bg-[#ffd630] text-black rounded-full font-black uppercase text-xs shadow-md"
              >
                CLAIM 20% OFF VOUCHER
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCheckout && onOpenCheckout();
                }}
                className="w-full py-3 bg-black text-white rounded-full font-bold uppercase text-xs"
              >
                EXPRESS CHECKOUT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── 2. Hero Section with Yellow Highlighter Blocks (Ref 3 Exact) ───── */}
      <section id="trend-hero" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="bg-[#f4f6f8] rounded-[28px] sm:rounded-[36px] p-6 sm:p-12 lg:p-16 relative overflow-hidden shadow-xs">
          {/* Subtle Decorative Star/Sparkle Elements */}
          <div className="absolute top-8 left-8 text-2xl text-neutral-300 font-bold pointer-events-none hidden sm:block">✦</div>
          <div className="absolute top-16 right-1/2 text-xl text-neutral-300 font-bold pointer-events-none hidden sm:block">✦</div>
          <div className="absolute bottom-10 left-1/3 text-2xl text-neutral-300 font-bold pointer-events-none hidden sm:block">✦</div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left: Distinctive Highlighter Block Headline (Ref 3 Exact) */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left">
              <div className="space-y-1 font-black tracking-tight text-black text-4xl sm:text-6xl lg:text-7xl leading-[1.08]">
                <div>LET'S</div>
                <div className="inline-block relative">
                  <span className="bg-[#ffd630] px-3 sm:px-4 py-0.5 sm:py-1 inline-block -rotate-1 rounded-sm text-black">
                    EXPLORE
                  </span>
                </div>
                <div className="inline-block relative ml-2 sm:ml-3">
                  <span className="bg-[#ffd630] px-3 sm:px-4 py-0.5 sm:py-1 inline-block rotate-1 rounded-sm text-black">
                    UNIQUE
                  </span>
                </div>
                <div>CLOTHES.</div>
              </div>

              <p className="text-sm sm:text-lg text-neutral-600 max-w-md font-medium mx-auto lg:mx-0">
                Live for influential and innovative fashion!
              </p>

              <div className="pt-2">
                <a
                  href="#trend-catalog"
                  className="inline-block px-8 sm:px-9 py-3.5 sm:py-4 bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-widest rounded-full shadow-lg hover:shadow-xl transition active:scale-95"
                >
                  SHOP NOW
                </a>
              </div>
            </div>

            {/* Right: Joyful Model in Fluffy Pink Outfit (Ref 3 Exact) */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative aspect-[3/4] w-full max-w-[300px] sm:max-w-md rounded-3xl overflow-hidden shadow-2xl bg-[#ffd6e0]/30 border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=1000&auto=format&fit=crop&q=85"
                  alt="High Street Model in Fluffy Pink Coat"
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
      <section className="bg-[#ffd630] py-5 sm:py-8 my-4 sm:my-6 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-around gap-6 sm:gap-10 font-black tracking-wider uppercase text-black text-base sm:text-2xl min-w-max sm:min-w-0">
            <span className="text-[#e11d48] tracking-tighter font-black hover:scale-105 transition cursor-default">H&M</span>
            <span className="tracking-widest font-black hover:scale-105 transition cursor-default">OBEY.</span>
            <span className="lowercase font-bold tracking-normal text-lg sm:text-2xl hover:scale-105 transition cursor-default flex items-center space-x-1">
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
            <span className="lowercase font-black tracking-normal text-lg sm:text-2xl hover:scale-105 transition cursor-default flex items-center">
              <span>amazon</span>
              <span className="text-[#f97316] text-xs ml-0.5">⌣</span>
            </span>
          </div>
        </div>
      </section>

      {/* ─── 4. NEW ARRIVALS: 3 Rounded Pastel Cards (Ref 3 Exact) ───────────── */}
      <section id="trend-arrivals" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="mb-8 sm:mb-10 text-center sm:text-left">
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black inline-block relative">
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
              className="group cursor-pointer space-y-3 sm:space-y-4"
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

      {/* ─── 5. Young's Favourite Section (Ref 3 Mockup Addition) ─────────────── */}
      <section id="trend-favourite" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 border-t border-neutral-100">
        <div className="mb-6 sm:mb-8 text-center sm:text-left">
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black inline-block relative">
            <span>Young's Favourite</span>
            <span className="absolute -bottom-1 left-0 w-28 h-2 bg-[#ffd630] -z-10 rounded-full" />
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex flex-col justify-end p-5 sm:p-8 text-white">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#ffd630]">Exclusive Drop</span>
              <h3 className="text-xl sm:text-3xl font-black mt-1">Trending on Instagram</h3>
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex flex-col justify-end p-5 sm:p-8 text-white">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#ffd630]">Budget Friendly</span>
              <h3 className="text-xl sm:text-3xl font-black mt-1">All Under $40</h3>
              <span className="text-xs font-semibold mt-2 inline-flex items-center space-x-1 group-hover:text-[#ffd630] transition">
                <span>Explore Now!</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. High-Street Trend Product Catalog Grid ───────────────────────── */}
      <section id="trend-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 border-t border-neutral-100">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-neutral-200 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
              TRENDING DROPS
            </h2>
            <p className="text-xs text-neutral-500 font-medium mt-1">
              Fresh styles delivered directly to your doorstep.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs font-bold uppercase">
            {[
              { id: "trending", label: "All Items" },
              { id: "new", label: "New In" },
              { id: "bestsellers", label: "Most Wanted" },
              { id: "sale", label: "Sale" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-full transition ${
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

        {/* 2-Column Mobile / 4-Column Desktop Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
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
                    <span className="absolute top-2.5 left-2.5 text-[8px] sm:text-[9px] font-black uppercase tracking-wider bg-[#ffd630] text-black px-2 py-0.5 rounded-full shadow-2xs">
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
                </div>

                <div className="p-3 sm:p-4 space-y-2 flex flex-col flex-1 justify-between">
                  <div>
                    <h3
                      onClick={() => onOpenProduct && onOpenProduct(product)}
                      className="text-xs sm:text-sm font-bold text-black hover:text-neutral-600 transition cursor-pointer line-clamp-1"
                    >
                      {product.title}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-neutral-400 font-medium uppercase mt-0.5">
                      {product.category || "Apparel"}
                    </p>

                    <div className="flex items-baseline space-x-2 pt-1">
                      <span className="text-xs sm:text-base font-black text-black">
                        {formatPrice(product.price)}
                      </span>
                      {product.comparePrice > product.price && (
                        <span className="text-[10px] sm:text-xs text-neutral-400 line-through">
                          {formatPrice(product.comparePrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => onAddToCart(product, product.variants?.[0] || {})}
                    className="w-full py-2 bg-black hover:bg-neutral-800 text-white rounded-full text-[11px] font-bold uppercase transition flex items-center justify-center space-x-1.5 active:scale-95 shadow-xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Bag</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── 7. Mobile App Voucher Section (Ref 3 Exact) ────────────────────── */}
      <section id="trend-app" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="bg-[#f4f6f8] rounded-[28px] sm:rounded-[36px] p-6 sm:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-lg text-center md:text-left">
            <h2 className="text-2xl sm:text-4xl font-black uppercase text-black leading-tight">
              DOWNLOAD APP & GET 20% OFF VOUCHER!
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 font-medium">
              Get 20% off your first mobile in-app order. Enjoy seamless shopping, order tracking, and doorstep try-on delivery.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <div className="flex items-center space-x-2 bg-black text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md cursor-pointer hover:bg-neutral-800 transition">
                <Smartphone className="w-4 h-4 text-[#ffd630]" />
                <div className="text-left leading-tight">
                  <div className="text-[8px] font-normal uppercase text-neutral-400">Download on the</div>
                  <div>App Store</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 bg-black text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md cursor-pointer hover:bg-neutral-800 transition">
                <Download className="w-4 h-4 text-[#ffd630]" />
                <div className="text-left leading-tight">
                  <div className="text-[8px] font-normal uppercase text-neutral-400">Get it on</div>
                  <div>Google Play</div>
                </div>
              </div>
            </div>
          </div>

          {/* Smartphone Mockup */}
          <div className="w-44 sm:w-56 aspect-[9/16] rounded-3xl bg-black border-4 border-neutral-900 shadow-2xl overflow-hidden relative p-2 flex-shrink-0">
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

      {/* ─── 8. JOIN SHOPPING COMMUNITY Newsletter (Ref 3 Exact) ─────────────── */}
      <section className="bg-[#ffd630] py-12 sm:py-16 my-4 sm:my-8">
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
              onClick={() => {
                if (displayedCatalog[0]) onAddToCart(displayedCatalog[0], displayedCatalog[0]?.variants[0]);
              }}
              className="px-6 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase rounded-full transition active:scale-95 shadow-xs"
            >
              SEND
            </button>
          </div>
        </div>
      </section>

      {/* ─── 9. High-Street Trend eCommerce Footer ───────────────────────────── */}
      <footer className="bg-neutral-900 text-white text-xs py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 sm:col-span-1 space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-md bg-[#ffd630] text-black flex items-center justify-center font-bold text-xs">
                  ✦
                </div>
                <span className="text-xl font-black tracking-tight text-white">FASHION</span>
              </div>
              <p className="text-neutral-400 text-xs leading-relaxed">
                Complete your style with awesome clothes from us. Trendsetting streetwear, hoodies, and accessories.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold uppercase tracking-wider text-white text-xs">Company</h4>
              <ul className="space-y-2 text-neutral-400 text-xs">
                <li><button onClick={() => { setActiveDepartment("all"); }} className="hover:text-white">About Us</button></li>
                <li><button onClick={() => { setActiveDepartment("outerwear"); }} className="hover:text-white">Careers</button></li>
                <li><button onClick={() => { setActiveDepartment("tees"); }} className="hover:text-white">Affiliates</button></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold uppercase tracking-wider text-white text-xs">Quick Links</h4>
              <ul className="space-y-2 text-neutral-400 text-xs">
                <li><button onClick={onOpenTrackOrder} className="hover:text-white">Order Tracking</button></li>
                <li><button onClick={() => setIsSizeGuideOpen(true)} className="hover:text-white">Size Guide</button></li>
                <li><span>FAQs & Help</span></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold uppercase tracking-wider text-white text-xs">Legal</h4>
              <ul className="space-y-2 text-neutral-400 text-xs">
                <li><span>Terms & Conditions</span></li>
                <li><span>Privacy Policy</span></li>
                <li><span>Cookie Settings</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-neutral-800 flex flex-col sm:flex-row justify-between text-neutral-500 text-[11px] gap-2">
            <span>© 2026 FASHION INC. ALL RIGHTS RESERVED.</span>
            <span>POWERED BY STORESWIFT</span>
          </div>
        </div>
      </footer>

      {/* ─── 10. Fixed Mobile Bottom Navigation Bar (True Mobile 1st) ────────── */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 md:hidden flex items-center justify-around py-2 px-1 text-[10px] font-bold text-neutral-700 shadow-xl">
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex flex-col items-center space-y-0.5 text-black"
        >
          <Compass className="w-5 h-5 stroke-[2]" />
          <span>Home</span>
        </button>

        <button
          onClick={() => {
            document.getElementById("trend-arrivals")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="flex flex-col items-center space-y-0.5 hover:text-black"
        >
          <Package className="w-5 h-5 stroke-[2]" />
          <span>New In</span>
        </button>

        <button
          onClick={onOpenSearch}
          className="flex flex-col items-center space-y-0.5 hover:text-black"
        >
          <Search className="w-5 h-5 stroke-[2]" />
          <span>Search</span>
        </button>

        <button
          onClick={() => onToggleWishlist(displayedCatalog[0]?.id || "wishlist")}
          className="flex flex-col items-center space-y-0.5 relative hover:text-black"
        >
          <Heart className="w-5 h-5 stroke-[2]" />
          {wishlist.length > 0 && (
            <span className="absolute -top-1 right-2 w-3.5 h-3.5 bg-[#ffd630] text-black text-[8px] font-black rounded-full flex items-center justify-center">
              {wishlist.length}
            </span>
          )}
          <span>Wishlist</span>
        </button>

        <button
          onClick={onOpenCart}
          className="flex flex-col items-center space-y-0.5 relative text-black font-black"
        >
          <ShoppingBag className="w-5 h-5 stroke-[2]" />
          <span className="absolute -top-1 right-2 w-3.5 h-3.5 bg-[#ffd630] text-black text-[8px] font-black rounded-full flex items-center justify-center">
            {totalCartCount}
          </span>
          <span>Bag</span>
        </button>
      </nav>
    </div>
  );
}
