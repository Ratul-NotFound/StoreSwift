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
  Package,
  RotateCcw,
  Compass,
  ArrowUpRight
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
  onOpenWishlist,
  onOpenCheckout,
  onOpenTrackOrder,
  setIsSizeGuideOpen,
  onSelectFashionStyle
}: FashionSubTemplateProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState(true);
  const [currentView, setCurrentView] = useState<"home" | "shop" | "about">("home");
  const [shopCategoryFilter, setShopCategoryFilter] = useState<string>("All");

  const SUNGLASSES_PRODUCT = {
    id: "btq-sunglasses-acetate",
    title: "Atelier Handcrafted Acetate Sunglasses",
    slug: "acetate-sunglasses",
    category: "accessories",
    description: "UV400 polarized mineral lenses with custom Italian Mazzucchelli acetate frames and 5-barrel hinges.",
    price: 45.0,
    comparePrice: 65.0,
    imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=700&auto=format&fit=crop&q=80",
    secondaryImage: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=700&auto=format&fit=crop&q=80",
    badge: "Iconic",
    rating: 4.9,
    reviewCount: 38,
    sizes: ["One Size"],
    variants: [{ title: "One Size", price: "45.00", sku: "btq-sg-01" }]
  };

  const toProduct = (item: any) => ({
    id: item.id,
    title: item.title,
    slug: item.id,
    category: item.category.toLowerCase(),
    description: "Handcrafted with quiet luxury architectural poise in breathable natural fibers for everyday refinement.",
    price: item.price,
    comparePrice: item.comparePrice || item.price * 1.3,
    imageUrl: item.image || item.imageUrl,
    secondaryImage: item.secondaryImage,
    badge: item.badge,
    rating: item.rating || 4.9,
    reviewCount: item.reviews || item.reviewCount || 42,
    sizes: ["S", "M", "L", "XL"],
    variants: [
      { title: "S", price: item.price.toString(), sku: `${item.id}-S` },
      { title: "M", price: item.price.toString(), sku: `${item.id}-M` },
      { title: "L", price: item.price.toString(), sku: `${item.id}-L` },
      { title: "XL", price: item.price.toString(), sku: `${item.id}-XL` }
    ]
  });

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
      secondaryImage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=700&auto=format&fit=crop&q=80",
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
      secondaryImage: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=700&auto=format&fit=crop&q=80",
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
      secondaryImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=700&auto=format&fit=crop&q=80",
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
      secondaryImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=700&auto=format&fit=crop&q=80",
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
      secondaryImage: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=700&auto=format&fit=crop&q=80",
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
      secondaryImage: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=700&auto=format&fit=crop&q=80",
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
      secondaryImage: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=700&auto=format&fit=crop&q=80",
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
      image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=700&auto=format&fit=crop&q=80",
      secondaryImage: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=700&auto=format&fit=crop&q=80",
      badge: "Handcrafted"
    }
  ];

  const filteredItems = shopCategoryFilter === "All"
    ? BOUTIQUE_SHOP_ITEMS
    : BOUTIQUE_SHOP_ITEMS.filter((i) => i.category.toLowerCase().includes(shopCategoryFilter.toLowerCase()));

  const totalCartCount = cartItems.reduce((s: number, i: any) => s + i.quantity, 0);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-neutral-900 font-sans antialiased selection:bg-[#422216] selection:text-white pb-16 md:pb-0">
      {/* ─── 1. Terracotta Top Announcement Bar (Ref 1 Exact) ─────────────── */}
      <div className="bg-[#422216] text-[#f5eae3] text-[10px] sm:text-[11px] font-sans py-2 px-3 sm:px-6 border-b border-[#341b12]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden md:flex items-center space-x-2 text-[#e4c5b7]">
            <span>Support (415) 555-0120</span>
          </div>

          <div className="flex-1 text-center font-medium truncate px-2">
            <span>Sign up and </span>
            <span className="font-bold underline decoration-[#e69d45] underline-offset-2">GET 25% OFF</span>
            <span> for your first order. </span>
            <button
              onClick={() => {
                const el = document.getElementById("boutique-newsletter");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="underline font-bold text-white hover:text-[#e69d45] ml-1 transition"
            >
              Sign up now
            </button>
          </div>

          <div className="hidden sm:flex items-center space-x-3 text-[#e4c5b7] text-[11px]">
            <span>Complimentary Courier over $100</span>
            <span className="text-[#885440]">•</span>
            <span className="font-semibold text-white">USD ($)</span>
          </div>
        </div>
      </div>

      {/* ─── 2. Boutique Sticky Header (Ref 1 Exact) ────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#faf8f5]/95 backdrop-blur-md border-b border-[#eee5dc] transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 -ml-2 text-neutral-800 hover:text-[#422216] md:hidden rounded-lg hover:bg-neutral-100 transition"
            aria-label="Open Mobile Menu"
          >
            <Menu className="w-5 h-5 stroke-[2]" />
          </button>

          {/* Brand Logo (Ref 1 Exact: Brown 'C' in Circle + 'Clothing.') */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setCurrentView("home");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex items-center space-x-2.5 text-left group"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#422216] text-[#f5eae3] flex items-center justify-center font-serif text-base sm:text-lg font-bold shadow-xs group-hover:scale-105 transition">
                C
              </div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#422216]">
                Clothing<span className="text-[#e69d45]">.</span>
              </span>
            </button>
          </div>

          {/* Desktop Navigation Links (Ref 1 Exact) */}
          <nav className="hidden md:flex items-center space-x-7 text-xs font-medium text-neutral-700 tracking-wide">
            <button
              onClick={() => {
                setCurrentView("home");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`transition hover:text-[#422216] ${
                currentView === "home" ? "text-[#422216] font-bold border-b-2 border-[#422216] pb-0.5" : ""
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
                currentView === "shop" ? "text-[#422216] font-bold border-b-2 border-[#422216] pb-0.5" : ""
              }`}
            >
              Shop
            </button>
            <button
              onClick={() => {
                setCurrentView("shop");
                setShopCategoryFilter("Dresses");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="hover:text-[#422216] transition"
            >
              Women
            </button>
            <button
              onClick={() => {
                setCurrentView("shop");
                setShopCategoryFilter("Suits");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="hover:text-[#422216] transition"
            >
              Men
            </button>
            <button
              onClick={() => {
                setCurrentView("shop");
                setShopCategoryFilter("Accessories");
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
                currentView === "about" ? "text-[#422216] font-bold border-b-2 border-[#422216] pb-0.5" : ""
              }`}
            >
              About Us
            </button>
            <button
              onClick={() => onOpenCheckout && onOpenCheckout()}
              className="hover:text-[#422216] transition"
            >
              Contact Us
            </button>
            <button
              onClick={() => {
                const el = document.getElementById("btq-catalog");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="hover:text-[#422216] transition text-[#a45d3e] font-semibold"
            >
              Sale (25% OFF)
            </button>
          </nav>

          {/* Right Action Icons (Ref 1 Exact: Search, Heart, User, Cart) */}
          <div className="flex items-center space-x-1 sm:space-x-3 text-neutral-700">
            <button
              onClick={onOpenSearch}
              className="p-2 hover:text-[#422216] transition rounded-full hover:bg-[#f5eae3]/60"
              title="Search"
              aria-label="Search"
            >
              <Search className="w-4 h-4 stroke-[2]" />
            </button>

            <button
              onClick={() => onOpenWishlist && onOpenWishlist()}
              className="p-2 hover:text-[#422216] transition relative rounded-full hover:bg-[#f5eae3]/60"
              title="View Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4 stroke-[2]" />
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
              title="Account / Order Tracking"
              aria-label="User Account"
            >
              <User className="w-4 h-4 stroke-[2]" />
            </button>

            <button
              onClick={onOpenCart}
              className="p-2 hover:text-[#422216] transition relative rounded-full hover:bg-[#f5eae3]/60"
              title="Shopping Cart"
              aria-label="Cart"
            >
              <ShoppingBag className="w-4 h-4 stroke-[2]" />
              <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#422216] text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                {totalCartCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ─── Mobile Slide-out Drawer ────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-[#faf8f5] h-full shadow-2xl flex flex-col justify-between p-6 z-10 animate-slide-right">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-neutral-200">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-[#422216] text-white flex items-center justify-center font-serif font-bold">
                    C
                  </div>
                  <span className="font-serif text-xl font-bold text-[#422216]">Clothing.</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-neutral-200 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Search Input */}
              <div className="my-5">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenSearch();
                  }}
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-white rounded-xl border border-neutral-200 text-neutral-400 text-xs shadow-xs"
                >
                  <span>Search linen, dresses, coats...</span>
                  <Search className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Navigation List */}
              <nav className="space-y-1 text-sm font-medium">
                <button
                  onClick={() => {
                    setCurrentView("home");
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-neutral-100 flex items-center justify-between"
                >
                  <span>Home</span>
                  <span className="text-[10px] text-neutral-400">Atelier</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentView("shop");
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-neutral-100 flex items-center justify-between"
                >
                  <span>Shop Catalog</span>
                  <span className="text-[10px] bg-[#422216] text-white px-2 py-0.5 rounded-full font-bold">300+</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentView("shop");
                    setShopCategoryFilter("Dresses");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-neutral-100 flex items-center justify-between"
                >
                  <span>For Women's</span>
                  <span className="text-[10px] text-neutral-400">2500+ Items</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentView("shop");
                    setShopCategoryFilter("Suits");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-neutral-100 flex items-center justify-between"
                >
                  <span>For Men's</span>
                  <span className="text-[10px] text-neutral-400">1500+ Items</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentView("shop");
                    setShopCategoryFilter("Accessories");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-neutral-100 flex items-center justify-between"
                >
                  <span>Accessories</span>
                  <span className="text-[10px] text-neutral-400">800+ Items</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentView("about");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-neutral-100 flex items-center justify-between"
                >
                  <span>About Our Atelier</span>
                  <span className="text-[10px] text-neutral-400">Stockholm</span>
                </button>
              </nav>
            </div>

            <div className="pt-6 border-t border-neutral-200 space-y-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTrackOrder && onOpenTrackOrder();
                }}
                className="w-full py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2"
              >
                <Package className="w-4 h-4 text-[#422216]" />
                <span>Track My Consignment</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCheckout && onOpenCheckout();
                }}
                className="w-full py-3 bg-[#422216] text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center space-x-2"
              >
                <span>Express Doorstep Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── 3. Hero Section (Ref 1 Exact) ──────────────────────────────────── */}
      {currentView === "home" && (
        <>
          <section className="relative overflow-hidden bg-[#fbf9f6] border-b border-[#eee5dc] pt-8 sm:pt-14 pb-12 sm:pb-20">
            {/* Subtle floating dot pattern in background */}
            <div className="absolute top-10 left-1/3 text-neutral-300 font-mono text-xs opacity-60 pointer-events-none hidden sm:block">
              • • • • • •
            </div>
            <div className="absolute top-20 left-1/3 text-neutral-300 font-mono text-xs opacity-60 pointer-events-none hidden sm:block">
              • • • • •
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
                {/* Left Content */}
                <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left">
                  {/* Badge: 50% OFF Summer Super Sale */}
                  <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white border border-neutral-300 text-neutral-800 text-xs font-semibold shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-[#422216]" />
                    <span>50% OFF Summer Super Sale</span>
                  </div>

                  {/* Headline (Ref 1 Exact) */}
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-neutral-900 tracking-tight leading-[1.12]">
                    Step into Style: Your<br />
                    Ultimate Fashion Destination
                  </h1>

                  {/* Subtitle */}
                  <p className="text-xs sm:text-sm text-neutral-600 max-w-lg leading-relaxed mx-auto lg:mx-0 font-normal">
                    Discover our summer curation of lightweight Italian linens, artisanal dresses, and tailored separates designed for effortless sunlit elegance.
                  </p>

                  {/* Primary Button: Solid Brown Rounded Rectangle (Ref 1 Exact) */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                    <button
                      onClick={() => {
                        const el = document.getElementById("btq-catalog");
                        el?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="w-full sm:w-auto px-8 py-3.5 bg-[#422216] hover:bg-[#2d150c] text-white text-xs font-bold rounded-md transition inline-flex items-center justify-center space-x-2 shadow-sm active:scale-95"
                    >
                      <span>Shop Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setCurrentView("about");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="w-full sm:w-auto px-6 py-3.5 border border-neutral-300 hover:border-black text-neutral-800 text-xs font-semibold rounded-md transition"
                    >
                      Explore Atelier Story
                    </button>
                  </div>
                </div>

                {/* Right Photography with Hotspot Pin (Ref 1 Exact) */}
                <div className="lg:col-span-5 relative flex justify-center">
                  <div className="relative aspect-[4/5] w-full max-w-[320px] sm:max-w-md rounded-2xl overflow-hidden shadow-xl bg-[#f0e9df] border-4 border-white">
                    {/* Model Photo with Sunglasses, camera & backpack (Ref 1 Exact) */}
                    <img
                      src="https://images.unsplash.com/photo-1654648342143-4dab6c62bb4d?w=1000&auto=format&fit=crop&q=85"
                      alt="Summer Fashion Model with Sunglasses"
                      className="w-full h-full object-cover object-center"
                    />

                    {/* Dotted pointer curved line pointing directly from sunglasses to badge */}
                    <svg
                      className="absolute inset-0 w-full h-full pointer-events-none z-10"
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                      fill="none"
                    >
                      <path
                        d="M 48 48 Q 65 38 78 28"
                        stroke="#e69d45"
                        strokeWidth="1.2"
                        strokeDasharray="2 2"
                      />
                      <circle cx="48" cy="48" r="1.5" fill="#e69d45" />
                    </svg>

                    {/* Shoppable Hotspot Pin pointing to sunglasses (Ref 1 Exact) */}
                    <div className="absolute top-[18%] right-[8%] z-20">
                      {/* Round Yellow Badge with Sunglasses Icon (Ref 1 Exact) */}
                      <div className="flex flex-col items-center">
                        <button
                          type="button"
                          onClick={() => setActiveHotspot(!activeHotspot)}
                          className="relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#f6ba43] text-white shadow-lg hover:scale-110 transition active:scale-95 border-2 border-white"
                          aria-label="View Sunglasses details"
                        >
                          {/* Sunglasses SVG icon inside circle badge */}
                          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-900" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M4 8C2.9 8 2 8.9 2 10V14C2 15.1 2.9 16 4 16H8C9.1 16 10 15.1 10 14V12H14V14C14 15.1 14.9 16 16 16H20C21.1 16 22 15.1 22 14V10C22 8.9 21.1 8 20 8H18C16.9 8 16 8.9 16 10V10.5H8V10C8 8.9 7.1 8 6 8H4ZM4 10H6V14H4V10ZM18 10H20V14H18V10Z" />
                          </svg>
                        </button>

                        {/* Hotspot Pill Card (Ref 1 Exact: "Sunglasses $45") */}
                        <div className="mt-1 px-3 py-1 bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-neutral-200 text-xs font-sans flex items-center space-x-1.5 whitespace-nowrap">
                          <span className="font-semibold text-neutral-800 text-[10px] sm:text-[11px]">Sunglasses</span>
                          <span className="font-bold text-[#422216] text-[10px] sm:text-[11px]">{formatPrice(45.0)}</span>
                          <button
                            onClick={() => onAddToCart(SUNGLASSES_PRODUCT, SUNGLASSES_PRODUCT.variants[0])}
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

          {/* ─── 4. Value Proposition Badges Strip (Ref 1 Exact) ─────────────── */}
          <section className="py-6 sm:py-8 bg-white border-b border-neutral-200/70">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                <div className="p-4 sm:p-5 rounded-xl bg-[#faf6f2] border border-[#f0e7dd] flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#f5eae3] text-[#422216] flex items-center justify-center flex-shrink-0">
                    <Truck className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-neutral-900">Free Shipping</h4>
                    <p className="text-[10px] sm:text-xs text-neutral-500 mt-0.5">Orders above $150</p>
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-xl bg-[#faf6f2] border border-[#f0e7dd] flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#f5eae3] text-[#422216] flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-neutral-900">Flexible Payment</h4>
                    <p className="text-[10px] sm:text-xs text-neutral-500 mt-0.5">Cards & Cash on Delivery</p>
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-xl bg-[#faf6f2] border border-[#f0e7dd] flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#f5eae3] text-[#422216] flex items-center justify-center flex-shrink-0">
                    <Headphones className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-neutral-900">24x7 Support</h4>
                    <p className="text-[10px] sm:text-xs text-neutral-500 mt-0.5">Online concierge all days</p>
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-xl bg-[#faf6f2] border border-[#f0e7dd] flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#f5eae3] text-[#422216] flex items-center justify-center flex-shrink-0">
                    <RotateCcw className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-neutral-900">14-Day Exchange</h4>
                    <p className="text-[10px] sm:text-xs text-neutral-500 mt-0.5">Doorstep fit trial</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ─── 5. Curated Category Architecture (Ref 1 Exact) ──────────────── */}
          <section id="boutique-categories" className="py-12 sm:py-16 bg-[#faf8f5]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center sm:text-left mb-8 sm:mb-10">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#a45d3e] font-bold block">
                  Curated Architecture
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 mt-1">
                  Explore Departments
                </h2>
              </div>

              {/* 3 Split Category Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Left Large Card: 2500+ Items | For Women's (Ref 1 Exact) */}
                <div className="lg:col-span-6 bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200/70 shadow-sm flex flex-col justify-between">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                    <div className="sm:col-span-7 space-y-4">
                      <div>
                        <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold block">
                          2500+ Items
                        </span>
                        <h3 className="text-2xl font-serif font-bold text-neutral-900 mt-0.5">
                          For Women's
                        </h3>
                        <p className="text-xs text-neutral-500 mt-1">
                          Handcrafted silhouettes tailored in breathable natural fibers for everyday refinement.
                        </p>
                      </div>

                      <ul className="space-y-2 text-xs font-sans text-neutral-600">
                        {["Blazers", "T-Shirts and Blouse", "Dresses", "Jackets & Coats", "Jeans", "Knit", "Skirts"].map((item) => (
                          <li key={item}>
                            <button
                              onClick={() => {
                                setCurrentView("shop");
                                setShopCategoryFilter(item);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                              className="hover:text-[#422216] transition flex items-center space-x-1.5 group"
                            >
                              <span className="text-neutral-400 group-hover:text-[#422216]">•</span>
                              <span className="group-hover:translate-x-0.5 transition-transform">{item}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="sm:col-span-5 aspect-[3/4] rounded-xl overflow-hidden bg-[#f4ece3] shadow-md">
                      <img
                        src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=700&auto=format&fit=crop&q=85"
                        alt="Women in Summer Dresses"
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
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
                        <h3 className="text-xl sm:text-2xl font-serif font-bold text-neutral-900 mt-0.5">
                          For Men's
                        </h3>
                      </div>

                      <ul className="space-y-1.5 text-xs font-sans text-neutral-600">
                        {["Blazers", "T-Shirts and Shirts", "Jackets & Coats", "Jeans"].map((item) => (
                          <li key={item}>
                            <button
                              onClick={() => {
                                setCurrentView("shop");
                                setShopCategoryFilter(item);
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

                    <div className="w-32 sm:w-44 aspect-[3/4] rounded-xl overflow-hidden bg-[#f4ece3] shadow-md flex-shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=600&auto=format&fit=crop&q=85"
                        alt="Men's Blazer with Sunglasses"
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
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
                        <h3 className="text-xl sm:text-2xl font-serif font-bold text-neutral-900 mt-0.5">
                          Accessories
                        </h3>
                      </div>

                      <ul className="space-y-1.5 text-xs font-sans text-neutral-600">
                        {["Handbags", "Watches", "Sunglasses", "Hat"].map((item) => (
                          <li key={item}>
                            <button
                              onClick={() => {
                                setCurrentView("shop");
                                setShopCategoryFilter(item);
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

                    <div className="w-32 sm:w-44 aspect-[3/4] rounded-xl overflow-hidden bg-[#f4ece3] shadow-md flex-shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&auto=format&fit=crop&q=85"
                        alt="Accessories Woven Straw & Leather Bag"
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ─── 6. Curated Product Catalog Grid (Ref 1 Screen 2) ─────────────── */}
          <section id="btq-catalog" className="py-12 sm:py-20 bg-white border-t border-b border-neutral-200/70">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Header with Title and Category Filters */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-neutral-200 gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#a45d3e] font-bold block">
                    Summer Curation
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 mt-1">
                    Featured Drops
                  </h2>
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  {["All", "Coats", "Dresses", "Shirts", "Knitwear", "Accessories"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setShopCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                        shopCategoryFilter === cat
                          ? "bg-[#422216] text-white font-bold shadow-xs"
                          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Filter Tags (Ref 1 Exact) */}
              <div className="flex flex-wrap items-center gap-2 mb-6 text-xs text-neutral-600">
                <span className="text-neutral-400 font-medium">Active Filters:</span>
                <span className="px-2.5 py-1 bg-[#f5eae3] text-[#422216] font-semibold rounded-md border border-[#e8d5cb] flex items-center space-x-1">
                  <span>Women</span>
                  <span className="cursor-pointer ml-1">×</span>
                </span>
                <span className="px-2.5 py-1 bg-[#f5eae3] text-[#422216] font-semibold rounded-md border border-[#e8d5cb] flex items-center space-x-1">
                  <span>Price: $50.00 – $195.00</span>
                  <span className="cursor-pointer ml-1">×</span>
                </span>
                <button
                  onClick={() => setShopCategoryFilter("All")}
                  className="text-xs text-[#a45d3e] font-bold underline ml-2"
                >
                  Clear All
                </button>
              </div>

              {/* 4-Column Desktop / 2-Column Mobile Product Grid (Ref 1 Exact) */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-white rounded-xl overflow-hidden border border-neutral-200/70 hover:border-[#422216] transition-all duration-300 flex flex-col justify-between shadow-xs hover:shadow-lg"
                  >
                    {/* Image Container with 3:4 Aspect Ratio */}
                    <div className="relative aspect-[3/4] bg-[#f4ece3] overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {item.secondaryImage && (
                        <img
                          src={item.secondaryImage}
                          alt={item.title}
                          className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        />
                      )}

                      {/* Badge Pill */}
                      {item.badge && (
                        <span className="absolute top-2.5 left-2.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-black/85 text-white px-2 py-0.5 rounded-sm">
                          {item.badge}
                        </span>
                      )}

                      {/* Wishlist Button */}
                      <button
                        onClick={() => onToggleWishlist(item.id)}
                        className="absolute top-2.5 right-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-xs text-neutral-800 hover:text-rose-600 flex items-center justify-center transition shadow-xs"
                        title="Add to Wishlist"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                            wishlist.includes(item.id) ? "fill-rose-600 text-rose-600" : ""
                          }`}
                        />
                      </button>

                      {/* Quick View Button on Image Center */}
                      <button
                        type="button"
                        onClick={() => handleOpenQuickView && handleOpenQuickView(toProduct(item))}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/95 hover:bg-black hover:text-white text-neutral-900 text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 transform scale-95 group-hover:scale-100 whitespace-nowrap"
                      >
                        Quick View
                      </button>

                      {/* Quick Size Select Bar on Hover */}
                      <div className="absolute inset-x-2 bottom-2 bg-white/95 backdrop-blur-md rounded-lg p-1.5 flex items-center justify-around opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md">
                        {["S", "M", "L", "XL"].map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => handleQuickSizeAdd && handleQuickSizeAdd(toProduct(item), size)}
                            className="text-[10px] font-bold text-neutral-700 hover:text-white hover:bg-[#422216] px-1.5 py-0.5 rounded-sm transition"
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between">
                      <div>
                        <div className="flex items-center justify-between text-[10px] sm:text-xs text-neutral-400 font-medium uppercase tracking-wider">
                          <span>{item.category}</span>
                          <span className="flex items-center text-amber-600 font-bold">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500 mr-0.5" />
                            {item.rating} <span className="text-neutral-400 font-normal ml-0.5">({item.reviews})</span>
                          </span>
                        </div>

                        <h3
                          onClick={() => handleOpenQuickView && handleOpenQuickView(toProduct(item))}
                          className="font-serif font-bold text-xs sm:text-sm text-neutral-900 mt-1 truncate group-hover:text-[#422216] transition cursor-pointer"
                        >
                          {item.title}
                        </h3>

                        <div className="flex items-baseline space-x-2 mt-1.5">
                          <span className="text-xs sm:text-sm font-bold text-neutral-900">
                            {formatPrice(item.price)}
                          </span>
                          {item.comparePrice && (
                            <span className="text-[10px] sm:text-xs text-neutral-400 line-through">
                              {formatPrice(item.comparePrice)}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onAddToCart(toProduct(item), toProduct(item).variants[1])}
                        className="mt-3 w-full py-2 sm:py-2.5 bg-[#422216] hover:bg-[#2d150c] text-white text-[11px] font-bold rounded-md transition flex items-center justify-center space-x-1.5 shadow-2xs active:scale-95"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Bag</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ─── 7. Editorial Story & Craftsmanship (Ref 1 Screen 3) ──────────── */}
          <section id="boutique-about" className="py-16 sm:py-24 bg-[#faf8f5]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#a45d3e] font-bold block">
                  Our Story
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900">
                  Crafted with Care: Materials, Thoughtful Design
                </h2>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                  We believe everyday garments should combine architectural poise, longevity, and pure comfort. Founded in Stockholm, curated worldwide.
                </p>
              </div>

              {/* Large Editorial Image with Founder Signature */}
              <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl bg-neutral-200 mb-10">
                <img
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&auto=format&fit=crop&q=85"
                  alt="Atelier Craftsmanship Lifestyle"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 text-white max-w-md">
                  <span className="text-[10px] font-mono tracking-widest uppercase bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full">
                    STOCKHOLM ATELIER // EST. 2018
                  </span>
                  <h3 className="text-lg sm:text-2xl font-serif font-bold mt-2">
                    "Every stitch reflects a commitment to quiet luxury and timeless longevity."
                  </h3>
                </div>
              </div>

              {/* Signature Block (Ref 1 Exact) */}
              <div className="bg-white rounded-2xl p-8 sm:p-12 border border-neutral-200/80 shadow-xs text-center max-w-2xl mx-auto space-y-3">
                <div className="font-serif italic text-2xl sm:text-3xl text-neutral-800">
                  "Jenny Alexander"
                </div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-semibold">
                  JENNY ALEXANDER — FOUNDER & CREATIVE DIRECTOR
                </div>

                <div className="pt-2">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-[#f5eae3] text-[#422216] text-xs font-bold border border-[#e6cbbd]">
                    100k+ Happy Global Customers
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ─── 8. Verified Social Proof Reviews ─────────────────────────────── */}
          <section className="py-12 sm:py-16 bg-white border-t border-neutral-200/70">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-10">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#a45d3e] font-bold block">
                  Client Voices
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 mt-1">
                  Endorsed by Connoisseurs Worldwide
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    name: "Eleanor Vance",
                    location: "London, UK",
                    product: "Classic Light Coat",
                    quote: "The drape and stitching on this coat rival Savile Row ateliers. It arrived in eco-luxe packaging with doorstep fit assurance."
                  },
                  {
                    name: "Marcus Thorne",
                    location: "New York, USA",
                    product: "Tailored Linen Blazer",
                    quote: "Incredible attention to silhouette. Lightweight yet structured. StoreSwift's Cash on Delivery was seamless."
                  },
                  {
                    name: "Sophie Lindqvist",
                    location: "Stockholm, SE",
                    product: "Modern Brown Dress",
                    quote: "Natural linen that breathes gracefully in warm weather. Jenny's design philosophy is felt in every detail."
                  }
                ].map((rev, idx) => (
                  <div key={idx} className="p-6 rounded-2xl bg-[#faf8f5] border border-neutral-200/80 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                        ))}
                      </div>
                      <p className="text-xs text-neutral-700 italic leading-relaxed">
                        "{rev.quote}"
                      </p>
                    </div>
                    <div className="pt-4 border-t border-neutral-200/60 mt-4 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-neutral-900">{rev.name}</div>
                        <div className="text-[10px] text-neutral-400">{rev.location}</div>
                      </div>
                      <span className="text-[10px] font-mono text-[#a45d3e] font-semibold bg-white px-2 py-0.5 rounded-full border border-neutral-200">
                        {rev.product}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ─── 9. VIP Newsletter Banner ─────────────────────────────────────── */}
          <section className="bg-[#422216] text-white py-12 sm:py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#e69d45] uppercase font-bold block">
                Privé Membership
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold">
                Sign up and GET 25% OFF your first atelier order
              </h2>
              <p className="text-xs sm:text-sm text-[#e4c5b7] max-w-md mx-auto font-normal">
                Be the first to access limited seasonal capsule drops, private trunk shows, and editorial lookbooks.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Thank you for joining Clothing. Atelier. Use code ATELIER25 for 25% off!");
                }}
                className="pt-2 max-w-md mx-auto flex flex-col sm:flex-row gap-2"
              >
                <input
                  type="email"
                  placeholder="Enter your email address"
                  required
                  className="flex-1 px-4 py-3 rounded-md bg-white/10 border border-white/20 text-white placeholder-white/50 text-xs focus:outline-none focus:ring-2 focus:ring-[#e69d45]"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#e69d45] hover:bg-[#d68c34] text-neutral-950 text-xs font-bold rounded-md transition shadow-md active:scale-95"
                >
                  Join Atelier
                </button>
              </form>
            </div>
          </section>
        </>
      )}

      {/* ─── SHOP VIEW: Dedicated Full Catalog View ──────────────────────────── */}
      {currentView === "shop" && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Breadcrumb & Title */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900">Shop Catalog</h1>
            <div className="text-xs text-neutral-400 mt-1 flex items-center space-x-2">
              <button onClick={() => setCurrentView("home")} className="hover:text-[#422216]">Home</button>
              <span>/</span>
              <span className="text-neutral-800 font-semibold">Shop</span>
            </div>
          </div>

          {/* Filters Bar (Ref 1 Exact) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-neutral-500">Filters:</span>
              <span className="px-3 py-1 bg-[#f5eae3] text-[#422216] font-semibold text-xs rounded-full border border-[#e8d5cb] flex items-center space-x-1">
                <span>Women</span>
                <span className="cursor-pointer ml-1">×</span>
              </span>
              <span className="px-3 py-1 bg-[#f5eae3] text-[#422216] font-semibold text-xs rounded-full border border-[#e8d5cb] flex items-center space-x-1">
                <span>Men</span>
                <span className="cursor-pointer ml-1">×</span>
              </span>
              <span className="px-3 py-1 bg-[#f5eae3] text-[#422216] font-semibold text-xs rounded-full border border-[#e8d5cb] flex items-center space-x-1">
                <span>Price: $50.00 – $195.00</span>
                <span className="cursor-pointer ml-1">×</span>
              </span>
              <button
                onClick={() => setShopCategoryFilter("All")}
                className="text-xs text-[#a45d3e] font-bold underline ml-2"
              >
                Clear All
              </button>
            </div>

            <div className="flex items-center space-x-3 text-xs text-neutral-500">
              <span>Showing 1–8 of 300 results</span>
              <select className="border border-neutral-300 rounded-md px-2.5 py-1 text-xs bg-white focus:outline-none">
                <option>Default Sorting</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Highest Rated</option>
              </select>
            </div>
          </div>

          {/* 4-Column Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 mt-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-xl overflow-hidden border border-neutral-200/70 hover:border-[#422216] transition-all duration-300 flex flex-col justify-between shadow-xs hover:shadow-lg"
              >
                <div className="relative aspect-[3/4] bg-[#f4ece3] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {item.badge && (
                    <span className="absolute top-2.5 left-2.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-black/85 text-white px-2 py-0.5 rounded-sm">
                      {item.badge}
                    </span>
                  )}
                  <button
                    onClick={() => onToggleWishlist(item.id)}
                    className="absolute top-2.5 right-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 text-neutral-800 hover:text-rose-600 flex items-center justify-center transition shadow-xs"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                        wishlist.includes(item.id) ? "fill-rose-600 text-rose-600" : ""
                      }`}
                    />
                  </button>
                </div>

                <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[10px] sm:text-xs text-neutral-400 font-medium uppercase tracking-wider">
                      <span>{item.category}</span>
                      <span className="flex items-center text-amber-600 font-bold">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500 mr-0.5" />
                        {item.rating}
                      </span>
                    </div>

                    <h3
                      onClick={() => handleOpenQuickView && handleOpenQuickView(toProduct(item))}
                      className="font-serif font-bold text-xs sm:text-sm text-neutral-900 mt-1 truncate hover:text-[#422216] transition cursor-pointer"
                    >
                      {item.title}
                    </h3>

                    <div className="flex items-baseline space-x-2 mt-1.5">
                      <span className="text-xs sm:text-sm font-bold text-neutral-900">
                        {formatPrice(item.price)}
                      </span>
                      {item.comparePrice && (
                        <span className="text-[10px] sm:text-xs text-neutral-400 line-through">
                          {formatPrice(item.comparePrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onAddToCart(toProduct(item), toProduct(item).variants[1])}
                    className="mt-3 w-full py-2 bg-[#422216] hover:bg-[#2d150c] text-white text-[11px] font-bold rounded-md transition flex items-center justify-center space-x-1.5 active:scale-95 shadow-2xs"
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

      {/* ─── ABOUT US VIEW: Dedicated Story Page ─────────────────────────────── */}
      {currentView === "about" && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="text-center space-y-4 mb-8">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#a45d3e] font-bold block">
              Our Story
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-neutral-900">
              Crafted with Care: Materials, Thoughtful Design
            </h1>
            <p className="text-sm text-neutral-600 leading-relaxed max-w-xl mx-auto">
              We believe everyday garments should combine architectural poise, longevity, and pure comfort. Founded in Stockholm, curated worldwide.
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-xl mb-10">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&auto=format&fit=crop&q=85"
              alt="Atelier Craftsmanship"
              className="w-full h-80 sm:h-96 object-cover"
            />
          </div>

          <div className="bg-white rounded-2xl p-8 border border-neutral-200 text-center space-y-3">
            <div className="font-serif italic text-3xl text-neutral-900">
              "Jenny Alexander"
            </div>
            <div className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-semibold">
              JENNY ALEXANDER — FOUNDER & CREATIVE DIRECTOR
            </div>
            <div className="pt-2">
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#f5eae3] text-[#422216] text-xs font-bold border border-[#e6cbbd]">
                100k+ Happy Global Customers
              </span>
            </div>
          </div>
        </section>
      )}

      {/* ─── 10. Comprehensive Production eCommerce Footer ────────────────────── */}
      <footer className="bg-[#24130d] text-[#e8ded6] border-t border-[#341b12] pt-12 sm:pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {/* Col 1: Brand Info */}
            <div className="col-span-2 space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-[#e69d45] text-neutral-950 flex items-center justify-center font-serif font-bold">
                  C
                </div>
                <span className="font-serif text-2xl font-bold text-white tracking-tight">Clothing.</span>
              </div>
              <p className="text-xs text-[#c2b2a6] max-w-sm leading-relaxed">
                Curated fashion atelier. Handpicked breathable linens, sculpted tailoring, and doorstep fit verification nationwide.
              </p>
              <div className="text-xs text-[#e69d45] font-semibold space-y-1">
                <div>Concierge: support@clothing-atelier.com</div>
                <div>Direct Line: +1 (415) 555-0120 (24x7)</div>
              </div>
            </div>

            {/* Col 2: Collections */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Collections</h4>
              <ul className="space-y-2 text-xs text-[#c2b2a6]">
                <li><button onClick={() => { setCurrentView("shop"); setShopCategoryFilter("All"); }} className="hover:text-white transition">All Items</button></li>
                <li><button onClick={() => { setCurrentView("shop"); setShopCategoryFilter("Dresses"); }} className="hover:text-white transition">Women's Summer</button></li>
                <li><button onClick={() => { setCurrentView("shop"); setShopCategoryFilter("Suits"); }} className="hover:text-white transition">Men's Tailoring</button></li>
                <li><button onClick={() => { setCurrentView("shop"); setShopCategoryFilter("Accessories"); }} className="hover:text-white transition">Handcrafted Bags</button></li>
                <li><button onClick={() => { setCurrentView("shop"); setShopCategoryFilter("Coats"); }} className="hover:text-white transition">Seasonal Coats</button></li>
              </ul>
            </div>

            {/* Col 3: Client Services */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Client Services</h4>
              <ul className="space-y-2 text-xs text-[#c2b2a6]">
                <li><button onClick={onOpenTrackOrder} className="hover:text-white transition">Track Consignment</button></li>
                <li><button onClick={() => setIsSizeGuideOpen(true)} className="hover:text-white transition">Size & Fit Guide</button></li>
                <li><button onClick={onOpenCheckout} className="hover:text-white transition">Doorstep Try-On</button></li>
                <li><button onClick={onOpenCheckout} className="hover:text-white transition">14-Day Free Exchange</button></li>
                <li><button onClick={onOpenCheckout} className="hover:text-white transition">Shipping & Delivery</button></li>
              </ul>
            </div>

            {/* Col 4: Security & Guarantee */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Security & Guarantee</h4>
              <p className="text-xs text-[#c2b2a6] leading-relaxed">
                Cash on Delivery (COD) supported nationwide. Inspect your garments before paying.
              </p>
              <div className="pt-2 flex flex-wrap gap-1.5 text-[10px] font-mono text-[#e69d45]">
                <span className="px-2 py-1 bg-white/5 rounded-xs border border-white/10">Cash on Delivery</span>
                <span className="px-2 py-1 bg-white/5 rounded-xs border border-white/10">Visa / Master</span>
                <span className="px-2 py-1 bg-white/5 rounded-xs border border-white/10">bKash / Nagad</span>
              </div>
            </div>
          </div>

          {/* Bottom Copyright Strip */}
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#a49184] gap-3">
            <div>© 2026 Clothing. Atelier. All rights reserved. Powered by StoreSwift.</div>
            <div className="flex items-center space-x-4">
              <span className="hover:text-white cursor-pointer">Privacy Policy</span>
              <span>•</span>
              <span className="hover:text-white cursor-pointer">Terms of Service</span>
              <span>•</span>
              <span className="hover:text-white cursor-pointer">Accessibility</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ─── 11. Fixed Mobile Bottom Navigation Bar (True Mobile 1st) ─────────── */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 md:hidden flex items-center justify-around py-2 px-1 text-[10px] font-medium text-neutral-600 shadow-lg">
        <button
          onClick={() => {
            setCurrentView("home");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`flex flex-col items-center space-y-0.5 ${
            currentView === "home" ? "text-[#422216] font-bold" : ""
          }`}
        >
          <Compass className="w-5 h-5 stroke-[1.75]" />
          <span>Home</span>
        </button>

        <button
          onClick={() => {
            setCurrentView("shop");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`flex flex-col items-center space-y-0.5 ${
            currentView === "shop" ? "text-[#422216] font-bold" : ""
          }`}
        >
          <Package className="w-5 h-5 stroke-[1.75]" />
          <span>Shop</span>
        </button>

        <button
          onClick={onOpenSearch}
          className="flex flex-col items-center space-y-0.5 hover:text-[#422216]"
        >
          <Search className="w-5 h-5 stroke-[1.75]" />
          <span>Search</span>
        </button>

        <button
          onClick={() => onOpenWishlist && onOpenWishlist()}
          className="flex flex-col items-center space-y-0.5 relative hover:text-[#422216]"
        >
          <Heart className="w-5 h-5 stroke-[1.75]" />
          {wishlist.length > 0 && (
            <span className="absolute -top-1 right-2 w-3.5 h-3.5 bg-[#422216] text-white text-[8px] font-bold rounded-full flex items-center justify-center">
              {wishlist.length}
            </span>
          )}
          <span>Wishlist</span>
        </button>

        <button
          onClick={onOpenCart}
          className="flex flex-col items-center space-y-0.5 relative text-[#422216] font-bold"
        >
          <ShoppingBag className="w-5 h-5 stroke-[2]" />
          <span className="absolute -top-1 right-2 w-3.5 h-3.5 bg-[#422216] text-white text-[8px] font-bold rounded-full flex items-center justify-center">
            {totalCartCount}
          </span>
          <span>Bag ({formatPrice(finalTotal || 0)})</span>
        </button>
      </nav>
    </div>
  );
}
