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
  Plus,
  User,
  Package
} from "lucide-react";
import { FashionSubTemplateProps } from "./types";

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
  const [currentView, setCurrentView] = useState<"home" | "shop" | "about">("home");

  // Mock catalog items precisely matching Reference 1 Screen 2 ("Shop")
  const BOUTIQUE_SHOP_ITEMS = [
    {
      id: "btq-1",
      title: "Brown Coat",
      category: "Coats",
      price: 165.0,
      comparePrice: 210.0,
      rating: 4.8,
      reviews: 42,
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=700&auto=format&fit=crop&q=80",
      badge: "Trending"
    },
    {
      id: "btq-2",
      title: "Classic Light Coat",
      category: "Coats",
      price: 145.0,
      comparePrice: 190.0,
      rating: 4.9,
      reviews: 58,
      image: "https://images.unsplash.com/photo-1508427953056-b00b8d78ebf5?w=700&auto=format&fit=crop&q=80",
      badge: "Summer Sale"
    },
    {
      id: "btq-3",
      title: "Modern Brown Dress",
      category: "Dresses",
      price: 98.0,
      comparePrice: 135.0,
      rating: 4.9,
      reviews: 64,
      image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=700&auto=format&fit=crop&q=80",
      badge: "Best Seller"
    },
    {
      id: "btq-4",
      title: "Classic White Shirt",
      category: "Shirts",
      price: 65.0,
      comparePrice: 90.0,
      rating: 4.7,
      reviews: 38,
      image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=700&auto=format&fit=crop&q=80",
      badge: "Organic Cotton"
    },
    {
      id: "btq-5",
      title: "Light Brown Sweater",
      category: "Knitwear",
      price: 82.0,
      comparePrice: 115.0,
      rating: 4.8,
      reviews: 31,
      image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=700&auto=format&fit=crop&q=80",
      badge: "New In"
    },
    {
      id: "btq-6",
      title: "Modern White Suit",
      category: "Suits",
      price: 195.0,
      comparePrice: 260.0,
      rating: 5.0,
      reviews: 47,
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=700&auto=format&fit=crop&q=80",
      badge: "Tailored"
    },
    {
      id: "btq-7",
      title: "Silk Summer Blouse",
      category: "Blouses",
      price: 75.0,
      comparePrice: 95.0,
      rating: 4.8,
      reviews: 29,
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=700&auto=format&fit=crop&q=80",
      badge: "Essential"
    },
    {
      id: "btq-8",
      title: "Leather Atelier Carryall",
      category: "Accessories",
      price: 140.0,
      comparePrice: 185.0,
      rating: 4.9,
      reviews: 52,
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=700&auto=format&fit=crop&q=80",
      badge: "Handcrafted"
    }
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5] text-neutral-900 font-sans antialiased selection:bg-[#422216] selection:text-white">
      {/* ─── 1. Terracotta / Deep Brown Top Announcement Bar (Ref 1 Exact) ─── */}
      <div className="bg-[#422216] text-[#f5eae3] text-[11px] font-sans py-2 px-4 sm:px-6 border-b border-[#341b12]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden md:flex items-center space-x-2 text-[#e4cfc3]">
            <span>Support (415) 555-0120</span>
          </div>
          <div className="mx-auto md:mx-0 flex items-center space-x-2 text-center">
            <span>Sign up and GET 25% OFF for your first order.</span>
            <button
              onClick={() => onAddToCart(displayedCatalog[0], displayedCatalog[0]?.variants[0])}
              className="font-bold underline underline-offset-2 text-white hover:text-amber-200 transition ml-1"
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
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#ebe2d8]">
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

          {/* Logo Brand: Brown circle with white "C" + "Clothing." (Ref 1 Exact) */}
          <Link
            href={`/store/${tenantSlug}`}
            onClick={(e) => {
              e.preventDefault();
              setCurrentView("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center space-x-2 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#422216] text-white flex items-center justify-center font-serif font-bold text-base shadow-xs">
              C
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-serif font-normal tracking-tight text-[#2b170e]">
                Clothing<span className="text-[#a45d3e]">.</span>
              </span>
            </div>
          </Link>

          {/* Centered Navigation Links (Ref 1 Exact: Home, Shop, Women, Men, Accessories, About Us, Contact Us, Blog) */}
          <nav className="hidden lg:flex items-center space-x-7 text-[13px] font-sans font-medium text-neutral-600">
            <button
              onClick={() => {
                setCurrentView("home");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`transition hover:text-[#422216] ${
                currentView === "home" ? "text-[#422216] font-bold" : ""
              }`}
            >
              Home
            </button>
            <button
              onClick={() => {
                setCurrentView("shop");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`transition hover:text-[#422216] ${
                currentView === "shop" ? "text-[#422216] font-bold" : ""
              }`}
            >
              Shop
            </button>
            <button
              onClick={() => {
                setCurrentView("shop");
                setActiveDepartment("tees");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="hover:text-[#422216] transition"
            >
              Women
            </button>
            <button
              onClick={() => {
                setCurrentView("shop");
                setActiveDepartment("outerwear");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="hover:text-[#422216] transition"
            >
              Men
            </button>
            <button
              onClick={() => {
                setCurrentView("shop");
                setActiveDepartment("accessories");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="hover:text-[#422216] transition"
            >
              Accessories
            </button>
            <button
              onClick={() => {
                setCurrentView("about");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`transition hover:text-[#422216] ${
                currentView === "about" ? "text-[#422216] font-bold" : ""
              }`}
            >
              About Us
            </button>
            <button
              onClick={() => {
                onOpenCheckout && onOpenCheckout();
              }}
              className="hover:text-[#422216] transition"
            >
              Contact Us
            </button>
            <button
              onClick={() => {
                setCurrentView("home");
                document.getElementById("boutique-categories")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="hover:text-[#422216] transition"
            >
              Blog
            </button>
          </nav>

          {/* Right Action Icons (Ref 1 Exact: Search, Heart, User, Cart) */}
          <div className="flex items-center space-x-3 text-neutral-700">
            <button
              onClick={onOpenSearch}
              className="p-2 hover:text-[#422216] transition rounded-full hover:bg-[#f5eae3]/60"
              title="Search"
              aria-label="Search"
            >
              <Search className="w-4 h-4 stroke-[1.75]" />
            </button>

            <button
              onClick={() => onToggleWishlist(displayedCatalog[0]?.id || "wishlist")}
              className="p-2 hover:text-[#422216] transition relative rounded-full hover:bg-[#f5eae3]/60"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4 stroke-[1.75]" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#422216] text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={onOpenTrackOrder}
              className="p-2 hover:text-[#422216] transition rounded-full hover:bg-[#f5eae3]/60 hidden sm:inline-block"
              title="Account / Tracking"
              aria-label="User Account"
            >
              <User className="w-4 h-4 stroke-[1.75]" />
            </button>

            <button
              onClick={onOpenCart}
              className="p-2 hover:text-[#422216] transition relative rounded-full hover:bg-[#f5eae3]/60"
              title="Shopping Cart"
              aria-label="Cart"
            >
              <ShoppingBag className="w-4 h-4 stroke-[1.75]" />
              <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#422216] text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                {cartItems.reduce((s: number, i: any) => s + i.quantity, 0)}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ─── HOME VIEW: Reference 1 Screen 1 ─────────────────────────────────── */}
      {currentView === "home" && (
        <>
          {/* Hero Section (Ref 1 Exact) */}
          <section className="relative overflow-hidden bg-[#fbf9f6] border-b border-[#eee5dc] pt-12 pb-16 sm:py-20">
            {/* Subtle floating dot pattern in background */}
            <div className="absolute top-12 left-1/3 text-neutral-300 font-mono text-xs opacity-60 pointer-events-none">
              • • • • • •
            </div>
            <div className="absolute top-24 left-1/3 text-neutral-300 font-mono text-xs opacity-60 pointer-events-none">
              • • • • •
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                {/* Left Content */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Badge: 50% OFF Summer Super Sale */}
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white border border-neutral-300 text-neutral-800 text-xs font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#422216]" />
                    <span>50% OFF Summer Super Sale</span>
                  </div>

                  {/* Headline (Ref 1 Exact) */}
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-sans font-bold text-neutral-900 tracking-tight leading-[1.12]">
                    Step into Style: Your<br />
                    Ultimate Fashion Destination
                  </h1>

                  {/* Subtitle */}
                  <p className="text-xs sm:text-sm text-neutral-600 max-w-lg leading-relaxed">
                    Discover our summer curation of lightweight Italian linens, artisanal dresses, and tailored separates designed for effortless sunlit elegance.
                  </p>

                  {/* Primary Button: Solid Brown Rounded Rectangle (Ref 1 Exact) */}
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setCurrentView("shop");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="px-8 py-3.5 bg-[#422216] hover:bg-[#2d150c] text-white text-xs font-semibold rounded-md transition inline-flex items-center space-x-2 shadow-sm"
                    >
                      <span>Shop Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Right Photography with Hotspot Pin (Ref 1 Exact) */}
                <div className="lg:col-span-5 relative flex justify-center">
                  <div className="relative aspect-[4/5] w-full max-w-md rounded-2xl overflow-hidden shadow-lg bg-[#f0e9df]">
                    {/* Model Photo with Sunglasses, camera & backpack (Ref 1 Exact) */}
                    <img
                      src="https://images.unsplash.com/photo-1654648342143-4dab6c62bb4d?w=1000&auto=format&fit=crop&q=85"
                      alt="Summer Fashion Model with Sunglasses"
                      className="w-full h-full object-cover object-center"
                    />

                    {/* Dotted pointer curved line pointing directly from sunglasses to badge */}
                    <svg
                      className="absolute inset-0 w-full h-full pointer-events-none z-10"
                      viewBox="0 0 400 500"
                      fill="none"
                    >
                      <path
                        d="M 200 240 Q 270 210 325 140"
                        stroke="#e69d45"
                        strokeWidth="2.5"
                        strokeDasharray="4 4"
                      />
                      <circle cx="200" cy="240" r="4" fill="#e69d45" />
                    </svg>

                    {/* Shoppable Hotspot Pin pointing to sunglasses (Ref 1 Exact) */}
                    <div className="absolute top-[20%] right-[10%] z-20">
                      {/* Round Yellow Badge with Sunglasses Icon (Ref 1 Exact) */}
                      <div className="flex flex-col items-center">
                        <button
                          type="button"
                          onClick={() => setActiveHotspot(!activeHotspot)}
                          className="relative flex items-center justify-center w-12 h-12 rounded-full bg-[#f6ba43] text-white shadow-lg hover:scale-110 transition active:scale-95 border-2 border-white"
                          aria-label="View Sunglasses details"
                        >
                          {/* Sunglasses SVG icon inside circle badge */}
                          <svg className="w-6 h-6 text-neutral-900" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M4 8C2.9 8 2 8.9 2 10V14C2 15.1 2.9 16 4 16H8C9.1 16 10 15.1 10 14V12H14V14C14 15.1 14.9 16 16 16H20C21.1 16 22 15.1 22 14V10C22 8.9 21.1 8 20 8H18C16.9 8 16 8.9 16 10V10.5H8V10C8 8.9 7.1 8 6 8H4ZM4 10H6V14H4V10ZM18 10H20V14H18V10Z" />
                          </svg>
                        </button>

                        {/* Hotspot Pill Card (Ref 1 Exact: "Sunglasses $45") */}
                        <div className="mt-1.5 px-3 py-1 bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-neutral-200 text-xs font-sans flex items-center space-x-1.5 whitespace-nowrap animate-fade-in">
                          <span className="font-semibold text-neutral-800 text-[11px]">Sunglasses</span>
                          <span className="font-bold text-[#422216] text-[11px]">{formatPrice(45.0)}</span>
                          <button
                            onClick={() => {
                              if (displayedCatalog[0]) onAddToCart(displayedCatalog[0], displayedCatalog[0].variants[0]);
                            }}
                            className="p-0.5 rounded-full bg-[#422216] text-white hover:bg-black transition ml-0.5"
                            title="Add Sunglasses"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ─── 3 Value Cards Strip Below Hero (Ref 1 Exact) ────────────────── */}
          <section className="py-8 bg-white border-b border-neutral-200/70">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Free Shipping */}
                <div className="flex items-center space-x-4 p-4 rounded-xl bg-[#faf8f5] border border-neutral-200/70 shadow-2xs">
                  <div className="w-12 h-12 rounded-xl bg-[#f5ecdf] text-[#b86d3b] flex items-center justify-center flex-shrink-0">
                    <Truck className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">Free Shipping</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">Free shipping for order above $150</p>
                  </div>
                </div>

                {/* Flexible Payment */}
                <div className="flex items-center space-x-4 p-4 rounded-xl bg-[#faf8f5] border border-neutral-200/70 shadow-2xs">
                  <div className="w-12 h-12 rounded-xl bg-[#f5ecdf] text-[#b86d3b] flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">Flexible Payment</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">Multiple secure payment options</p>
                  </div>
                </div>

                {/* 24x7 Support */}
                <div className="flex items-center space-x-4 p-4 rounded-xl bg-[#faf8f5] border border-neutral-200/70 shadow-2xs">
                  <div className="w-12 h-12 rounded-xl bg-[#f5ecdf] text-[#b86d3b] flex items-center justify-center flex-shrink-0">
                    <Headphones className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">24x7 Support</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">We support online all days</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ─── Curated 3-Split Category Architecture (Ref 1 Exact) ──────────── */}
          <section id="boutique-categories" className="py-16 sm:py-20 bg-[#faf8f5] border-b border-neutral-200/70">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Card: 2500+ Items | For Women's (Ref 1 Exact) */}
                <div className="lg:col-span-6 bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200/70 shadow-sm flex flex-col justify-between overflow-hidden">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold block">
                          2500+ Items
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900 mt-0.5">
                          For Women's
                        </h3>
                        <p className="text-xs text-neutral-500 mt-1 max-w-xs">
                          Handcrafted silhouettes tailored in breathable natural fibers for everyday refinement.
                        </p>
                      </div>

                      <ul className="space-y-2 text-xs font-sans text-neutral-600">
                        {["Blazers", "T-Shirts and Blouse", "Dresses", "Jackets & Coats", "Jeans", "Knit", "Skirts"].map(
                          (item) => (
                            <li key={item}>
                              <button
                                onClick={() => {
                                  setCurrentView("shop");
                                  window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                                className="hover:text-[#422216] transition flex items-center space-x-1"
                              >
                                <span className="text-neutral-400">•</span>
                                <span>{item}</span>
                              </button>
                            </li>
                          )
                        )}
                      </ul>
                    </div>

                    <div className="w-full sm:w-56 aspect-[3/4] rounded-xl overflow-hidden bg-[#f4ece3] shadow-md flex-shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=700&auto=format&fit=crop&q=85"
                        alt="Women in Summer Dresses"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Top & Bottom Cards */}
                <div className="lg:col-span-6 flex flex-col gap-6">
                  {/* Right Top Card: 1500+ Items | For Men's (Ref 1 Exact) */}
                  <div className="bg-white rounded-2xl p-6 sm:p-7 border border-neutral-200/70 shadow-sm flex items-center justify-between gap-4 overflow-hidden">
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold block">
                          1500+ Items
                        </span>
                        <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 mt-0.5">
                          For Men's
                        </h3>
                      </div>

                      <ul className="space-y-1.5 text-xs font-sans text-neutral-600">
                        {["Blazers", "T-Shirts and Shirts", "Jackets & Coats", "Jeans"].map((item) => (
                          <li key={item}>
                            <button
                              onClick={() => {
                                setCurrentView("shop");
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                              className="hover:text-[#422216] transition flex items-center space-x-1"
                            >
                              <span className="text-neutral-400">•</span>
                              <span>{item}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="w-36 sm:w-44 aspect-[3/4] rounded-xl overflow-hidden bg-[#f4ece3] shadow-md flex-shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=600&auto=format&fit=crop&q=85"
                        alt="Men's Blazer with Sunglasses"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Right Bottom Card: 800+ Items | Accessories (Ref 1 Exact) */}
                  <div className="bg-white rounded-2xl p-6 sm:p-7 border border-neutral-200/70 shadow-sm flex items-center justify-between gap-4 overflow-hidden">
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold block">
                          800+ Items
                        </span>
                        <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 mt-0.5">
                          Accessories
                        </h3>
                      </div>

                      <ul className="space-y-1.5 text-xs font-sans text-neutral-600">
                        {["Handbags", "Watches", "Sunglasses", "Hat"].map((item) => (
                          <li key={item}>
                            <button
                              onClick={() => {
                                setCurrentView("shop");
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                              className="hover:text-[#422216] transition flex items-center space-x-1"
                            >
                              <span className="text-neutral-400">•</span>
                              <span>{item}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="w-36 sm:w-44 aspect-[3/4] rounded-xl overflow-hidden bg-[#f4ece3] shadow-md flex-shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&auto=format&fit=crop&q=85"
                        alt="Accessories Woven Straw & Leather Bag"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* ─── SHOP VIEW: Reference 1 Screen 2 (Exact Reproduction) ─────────────── */}
      {currentView === "shop" && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb & Title */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-neutral-900">Shop</h1>
            <div className="text-xs text-neutral-400 mt-1 flex items-center space-x-2">
              <button onClick={() => setCurrentView("home")} className="hover:text-[#422216]">Home</button>
              <span>&gt;</span>
              <span className="text-neutral-800 font-medium">Shop</span>
            </div>
          </div>

          {/* Filter & Sorting Bar (Ref 1 Screen 2 Exact) */}
          <div className="flex flex-wrap items-center justify-between pb-6 mb-8 border-b border-neutral-200 gap-4 text-xs">
            <span className="text-neutral-500 font-medium">
              Showing 1-8 of 300 results
            </span>

            {/* Active Filter Pills (Ref 1 Exact) */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-[#f4ece3] text-[#422216] rounded-md font-medium flex items-center space-x-1">
                <span>Women</span>
                <X className="w-3 h-3 cursor-pointer" />
              </span>
              <span className="px-3 py-1 bg-[#f4ece3] text-[#422216] rounded-md font-medium flex items-center space-x-1">
                <span>Men</span>
                <X className="w-3 h-3 cursor-pointer" />
              </span>
              <span className="px-3 py-1 bg-[#f4ece3] text-[#422216] rounded-md font-medium flex items-center space-x-1">
                <span>Price: $50.00 – $195.00</span>
                <X className="w-3 h-3 cursor-pointer" />
              </span>
              <button
                onClick={() => {}}
                className="text-neutral-500 hover:text-black underline ml-1"
              >
                Clear All
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2">
              <span className="text-neutral-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-neutral-200 px-3 py-1.5 rounded-md font-medium outline-none cursor-pointer"
              >
                <option value="featured">Default Sorting</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Average Rating</option>
              </select>
            </div>
          </div>

          {/* 4-Column Product Grid (Ref 1 Screen 2 Exact) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {BOUTIQUE_SHOP_ITEMS.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-xl overflow-hidden border border-neutral-200/70 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image */}
                <div className="relative aspect-[3/4] bg-[#f8f5f0] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-2.5 left-2.5 text-[9px] uppercase tracking-wider bg-[#422216] text-white px-2 py-0.5 rounded font-medium">
                    {item.badge}
                  </span>
                  <button
                    onClick={() => onToggleWishlist(item.id)}
                    className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-neutral-600 hover:text-[#422216] transition shadow-xs"
                    aria-label="Wishlist"
                  >
                    <Heart className="w-3.5 h-3.5 stroke-[1.75]" />
                  </button>
                </div>

                {/* Info */}
                <div className="p-4 space-y-1.5">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                    {item.category}
                  </span>
                  <h3 className="text-sm font-semibold text-neutral-900 truncate">
                    {item.title}
                  </h3>
                  <div className="flex items-center space-x-1 text-xs text-amber-500">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="font-bold text-neutral-800">{item.rating}</span>
                    <span className="text-neutral-400 text-[10px]">({item.reviews})</span>
                  </div>
                  <div className="flex items-baseline space-x-2 pt-1">
                    <span className="text-sm font-bold text-[#422216]">
                      {formatPrice(item.price)}
                    </span>
                    <span className="text-xs text-neutral-400 line-through">
                      {formatPrice(item.comparePrice)}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      if (displayedCatalog[0]) {
                        onAddToCart(displayedCatalog[0], displayedCatalog[0].variants[0]);
                      }
                    }}
                    className="mt-2 w-full py-2 bg-[#422216] hover:bg-[#2d150c] text-white text-xs font-semibold rounded-md transition flex items-center justify-center space-x-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Bag</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── ABOUT US VIEW: Reference 1 Screen 3 (Exact Reproduction) ─────────── */}
      {currentView === "about" && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#a45d3e] font-semibold">
              Our Story
            </span>
            <h1 className="text-4xl font-serif text-neutral-900">
              Crafted with Care: Materials, Thoughtful Design
            </h1>
            <p className="text-neutral-600 text-sm max-w-2xl mx-auto leading-relaxed">
              We believe everyday garments should combine architectural poise, longevity, and pure comfort. Founded in Stockholm, curated worldwide.
            </p>
          </div>

          <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-lg bg-neutral-100">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&auto=format&fit=crop&q=85"
              alt="Atelier Workshop"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-8 bg-white rounded-2xl border border-neutral-200 text-center space-y-4">
            <span className="text-3xl font-serif italic text-neutral-800">"Jenny Alexander"</span>
            <p className="text-xs text-neutral-500 uppercase tracking-widest font-semibold">
              Jenny Alexander — Founder & Creative Director
            </p>
            <div className="inline-block px-4 py-1.5 bg-[#f5ecdf] rounded-full text-xs font-bold text-[#422216]">
              100k+ Happy Global Customers
            </div>
          </div>
        </section>
      )}

      {/* ─── Boutique Luxury Footer (Ref 1 Exact) ─────────────────────────────── */}
      <footer className="bg-[#24130b] text-[#d6c7be] text-xs font-sans border-t border-[#3a1f12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="space-y-4">
              <span className="text-2xl font-serif text-white block">Clothing.</span>
              <p className="text-xs text-[#a99488] leading-relaxed">
                Curated fashion atelier. Handpicked fabrics, tailored cuts, and doorstep fit trial.
              </p>
              <p className="text-[11px] text-[#846f64]">
                Customer Concierge: support@clothing-atelier.com
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Collections</h4>
              <ul className="space-y-2 text-[#a99488]">
                <li><button onClick={() => setCurrentView("shop")} className="hover:text-white transition">All Items</button></li>
                <li><button onClick={() => setCurrentView("shop")} className="hover:text-white transition">Women's Summer</button></li>
                <li><button onClick={() => setCurrentView("shop")} className="hover:text-white transition">Men's Tailoring</button></li>
                <li><button onClick={() => setCurrentView("shop")} className="hover:text-white transition">Handcrafted Accessories</button></li>
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
                Cash on Delivery (COD) supported nationwide. Inspect your garments before paying.
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
