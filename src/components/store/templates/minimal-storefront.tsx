"use client";

import React, { useState, useMemo } from "react";
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
  Lock,
  Flame,
  Plus,
  Minus,
  Ruler,
  Info,
  Clock,
  ExternalLink,
  ChevronRight,
  SlidersHorizontal
} from "lucide-react";
import { CartItem } from "@/lib/cart";

export interface MinimalStorefrontProps {
  storeDisplayName: string;
  tenantSlug: string;
  products: Array<{
    id: string;
    title: string;
    slug: string;
    description: string;
    price: number;
    comparePrice?: number;
    imageUrl: string;
    secondaryImage?: string;
    badge?: string;
    rating?: number;
    category?: string;
    variants?: any[];
    stock?: number;
  }>;
  cartItems: CartItem[];
  wishlist: string[];
  finalTotal: number;
  onAddToCart: (prod: any, variant: any) => void;
  onToggleWishlist: (productId: string) => void;
  onOpenProduct: (prod: any) => void;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenCheckout?: () => void;
  onOpenTrackOrder?: () => void;
  // Studio & routing compatibility props
  template?: any;
  allCategories?: string[];
  activeCategoryKey?: string;
  onSelectCategory?: (cat: string) => void;
  allTemplates?: string[];
  templateKey?: string;
  onSelectTemplate?: (tKey: string) => void;
  categoriesMap?: Record<string, any>;
  storeTemplatesMap?: Record<string, any>;
}

const ATELIER_FALLBACKS = [
  {
    id: "m-1",
    title: "Bonded Wool Tailored Overcoat",
    slug: "bonded-wool-overcoat",
    category: "Outerwear",
    description: "Architectural structured overcoat tailored in 520 GSM bonded Italian wool twill with horn buttons and satin lining.",
    price: 6500,
    comparePrice: 8500,
    imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=1000&auto=format&fit=crop&q=85",
    badge: "520 GSM Wool",
    rating: 5.0,
    variants: [
      { sku: "OVC-S", title: "S", price: "6500" },
      { sku: "OVC-M", title: "M", price: "6500" },
      { sku: "OVC-L", title: "L", price: "6500" }
    ]
  },
  {
    id: "m-2",
    title: "Boxy Vintage Drop-Shoulder Tee",
    slug: "boxy-vintage-tee",
    category: "Tees",
    description: "300 GSM washed heavyweight combed jersey with double-stitched collar and relaxed boxy drape.",
    price: 1450,
    comparePrice: 1950,
    imageUrl: "https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=1000&auto=format&fit=crop&q=85",
    badge: "300 GSM Jersey",
    rating: 4.9,
    variants: [
      { sku: "TEE-S", title: "S", price: "1450" },
      { sku: "TEE-M", title: "M", price: "1450" },
      { sku: "TEE-L", title: "L", price: "1450" }
    ]
  },
  {
    id: "m-3",
    title: "Wide Straight Kurabo Selvedge Jeans",
    slug: "kurabo-selvedge-jeans",
    category: "Denim",
    description: "14oz raw Japanese indigo denim cut in a modern relaxed straight silhouette with classic redline selvedge ID.",
    price: 3850,
    comparePrice: 4800,
    imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1000&auto=format&fit=crop&q=85",
    badge: "14oz Kurabo Mill",
    rating: 4.9,
    variants: [
      { sku: "JNS-30", title: "30", price: "3850" },
      { sku: "JNS-32", title: "32", price: "3850" },
      { sku: "JNS-34", title: "34", price: "3850" }
    ]
  },
  {
    id: "m-4",
    title: "Heavyweight Loopback Terry Hoodie",
    slug: "loopback-terry-hoodie",
    category: "Hoodies",
    description: "450 GSM French loopback organic terry with raglan sleeves and deep double-layer structured hood.",
    price: 2950,
    comparePrice: 3800,
    imageUrl: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=1000&auto=format&fit=crop&q=85",
    badge: "450 GSM Terry",
    rating: 4.8,
    variants: [
      { sku: "HD-M", title: "M", price: "2950" },
      { sku: "HD-L", title: "L", price: "2950" }
    ]
  }
];

export function MinimalStorefront({
  storeDisplayName,
  tenantSlug,
  products = [],
  cartItems = [],
  wishlist = [],
  finalTotal,
  onAddToCart,
  onToggleWishlist,
  onOpenProduct,
  onOpenCart,
  onOpenSearch,
  onOpenCheckout,
  onOpenTrackOrder
}: MinimalStorefrontProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [quickViewProd, setQuickViewProd] = useState<any | null>(null);
  const [quickViewSize, setQuickViewSize] = useState("M");
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [sizeUnit, setSizeUnit] = useState<"in" | "cm">("in");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const catalog = useMemo(() => {
    if (products.length > 0) {
      return products.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        category: p.category || "General",
        description: p.description || "Atelier crafted garment.",
        price: p.price,
        comparePrice: p.comparePrice,
        imageUrl: p.imageUrl || "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800",
        badge: p.badge || "Atelier Verified",
        rating: p.rating || 4.9,
        variants: p.variants || [{ sku: "STD", title: "Standard", price: String(p.price) }]
      }));
    }
    return ATELIER_FALLBACKS;
  }, [products]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    catalog.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return ["all", ...Array.from(set)];
  }, [catalog]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === "all") return catalog;
    return catalog.filter(
      (it) => it.category?.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [catalog, selectedCategory]);

  const cartCount = cartItems.reduce((acc, it) => acc + (it.quantity || 1), 0);

  return (
    <div
      suppressHydrationWarning
      className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white flex flex-col"
    >
      {/* ─── 1. Atelier Top Announcement Bar ─────────────────────────────── */}
      <div className="bg-zinc-950 text-zinc-300 py-2 px-4 text-center text-[11px] font-mono tracking-wider border-b border-zinc-900 flex items-center justify-center gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>ATELIER EDIT 2026 // COMPLIMENTARY NATIONWIDE EXPRESS DELIVERY // COD &amp; BKASH ACTIVE</span>
      </div>

      {/* ─── 2. Minimal Sticky Editorial Header ───────────────────────────── */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-zinc-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-zinc-600 hover:text-black"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <button onClick={onOpenSearch} className="p-1.5 text-zinc-600 hover:text-black">
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Logo / Brand Wordmark */}
          <div className="flex items-center gap-3">
            <a href={`/store/${tenantSlug}`} className="flex items-baseline gap-2 group">
              <span className="text-lg font-black tracking-tighter text-zinc-950 uppercase font-serif">
                {storeDisplayName}
              </span>
              <span className="hidden sm:inline-block text-[9px] font-mono tracking-[0.25em] text-zinc-400 uppercase">
                Atelier
              </span>
            </a>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs font-semibold text-zinc-600">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`transition hover:text-black ${selectedCategory === "all" ? "text-black border-b-2 border-black pb-0.5" : ""}`}
            >
              All Archive
            </button>
            {categories.filter((c) => c !== "all").slice(0, 4).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`capitalize transition hover:text-black ${selectedCategory === cat ? "text-black border-b-2 border-black pb-0.5" : ""}`}
              >
                {cat}
              </button>
            ))}
            <a href="#lookbook" className="transition hover:text-black">
              Lookbook
            </a>
            <a href="#atelier-manifesto" className="transition hover:text-black">
              Philosophy
            </a>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenSearch}
              className="hidden lg:flex items-center gap-1.5 text-xs text-zinc-500 hover:text-black px-2.5 py-1.5 rounded-lg border border-zinc-200/80 hover:border-zinc-400 transition"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </button>

            {onOpenTrackOrder && (
              <button
                onClick={onOpenTrackOrder}
                className="hidden sm:flex items-center gap-1 text-xs text-zinc-600 hover:text-black px-2.5 py-1.5 rounded-lg hover:bg-zinc-50 transition"
                title="Track Consignment Order"
              >
                <Truck className="w-3.5 h-3.5 text-zinc-500" />
                <span className="hidden md:inline font-medium">Track Order</span>
              </button>
            )}

            {onOpenCheckout && (
              <button
                onClick={onOpenCheckout}
                className="hidden sm:flex items-center gap-1.5 bg-zinc-900 hover:bg-black text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
              >
                <CreditCard className="w-3 h-3 text-emerald-400" />
                <span>Express Checkout</span>
              </button>
            )}

            {/* Cart Trigger */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 px-3 py-1.5 rounded-lg text-xs font-bold transition relative"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Bag</span>
              {cartCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-zinc-950 text-white text-[10px] font-black flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-zinc-100 bg-white p-4 space-y-3 animate-fade-in">
            <div className="flex flex-wrap gap-2 pb-2 border-b border-zinc-100">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setSelectedCategory(c);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-1 text-xs rounded-full capitalize font-medium ${
                    selectedCategory === c ? "bg-black text-white" : "bg-zinc-100 text-zinc-700"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="flex gap-2 pt-1">
              {onOpenTrackOrder && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenTrackOrder();
                  }}
                  className="flex-1 py-2 text-xs font-semibold text-zinc-700 border border-zinc-200 rounded-lg flex items-center justify-center gap-1"
                >
                  <Truck className="w-3.5 h-3.5" /> Track Order
                </button>
              )}
              {onOpenCheckout && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenCheckout();
                  }}
                  className="flex-1 py-2 text-xs font-bold bg-zinc-950 text-white rounded-lg flex items-center justify-center gap-1"
                >
                  <CreditCard className="w-3.5 h-3.5 text-emerald-400" /> Checkout
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ─── 3. Architectural Hero Section ─────────────────────────────────── */}
      <section className="border-b border-zinc-200/80 bg-zinc-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-zinc-100 border border-zinc-200 px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase text-zinc-700">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
              <span>ARCHIVAL ATELIER • AUTUMN-WINTER 2026</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-zinc-950 tracking-tight leading-[1.08]">
              High Fashion. <br />
              Tailored Forms. <br />
              Pure Texture.
            </h1>

            <p className="text-sm sm:text-base text-zinc-600 max-w-lg leading-relaxed font-sans">
              Crafted in 280 GSM combed long-staple cotton and 14oz Toyoda shuttle loom selvedge. Designed for timeless structure and doorstep fit verification across Bangladesh.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#catalog-grid"
                className="bg-zinc-950 hover:bg-black text-white px-6 py-3 rounded-xl text-xs font-bold tracking-wide transition flex items-center gap-2 shadow-sm"
              >
                <span>Explore Curated Archive</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setIsSizeGuideOpen(true)}
                className="border border-zinc-300 hover:border-black text-zinc-800 hover:text-black px-5 py-3 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
              >
                <Ruler className="w-3.5 h-3.5 text-zinc-500" />
                <span>Doorstep Fit Sizing</span>
              </button>
            </div>

            <div className="pt-6 border-t border-zinc-200/80 grid grid-cols-3 gap-4 text-left">
              <div>
                <p className="text-lg font-black text-zinc-950">280 GSM</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">Organic Combed</p>
              </div>
              <div>
                <p className="text-lg font-black text-zinc-950">14oz</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">Kurabo Selvedge</p>
              </div>
              <div>
                <p className="text-lg font-black text-zinc-950">48 Hours</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">Express Dispatch</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-200 border border-zinc-300 shadow-xl relative group">
              <img
                src="https://images.unsplash.com/photo-1508427953056-b00b8d78ebf5?w=1000&auto=format&fit=crop&q=85"
                alt="Minimal Atelier Editorial"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-zinc-200 shadow-lg flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-mono tracking-widest uppercase text-zinc-400 block">Look 01 Edit</span>
                  <p className="text-xs font-bold text-zinc-900">Bonded Italian Wool Overcoat</p>
                  <p className="text-xs font-black text-zinc-950 mt-0.5">৳6,500 <span className="text-[10px] line-through text-zinc-400">৳8,500</span></p>
                </div>
                <button
                  onClick={() => onAddToCart(ATELIER_FALLBACKS[0], ATELIER_FALLBACKS[0].variants[0])}
                  className="bg-black hover:bg-zinc-800 text-white text-[11px] font-bold px-3.5 py-2 rounded-lg transition"
                >
                  Quick Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. Dynamic Product Catalog Grid ──────────────────────────────── */}
      <section id="catalog-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 flex-1">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-[10px] font-mono tracking-[0.2em] text-zinc-400 uppercase block mb-1">
              Curated Catalog ({filteredItems.length} Items)
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-950">
              The Seasonal Wardrobe
            </h2>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? "bg-zinc-950 text-white shadow-xs"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                {cat === "all" ? "All Pieces" : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((prod) => {
            const isFav = wishlist.includes(prod.id);
            return (
              <div
                key={prod.id}
                className="group flex flex-col bg-white border border-zinc-200/90 rounded-2xl overflow-hidden hover:border-zinc-900 transition-all duration-300 shadow-xs hover:shadow-md"
              >
                {/* Image Aspect Container */}
                <div className="relative aspect-[3/4] bg-zinc-100 overflow-hidden">
                  <img
                    src={prod.imageUrl}
                    alt={prod.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {prod.badge && (
                      <span className="bg-zinc-950 text-white text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-md">
                        {prod.badge}
                      </span>
                    )}
                  </div>

                  {/* Wishlist Heart */}
                  <button
                    onClick={() => onToggleWishlist(prod.id)}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition ${
                      isFav
                        ? "bg-red-50 text-red-600"
                        : "bg-white/80 hover:bg-white text-zinc-600"
                    }`}
                    title="Save to Wishlist"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-current" : ""}`} />
                  </button>

                  {/* Quick Action Overlay */}
                  <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <button
                      onClick={() => setQuickViewProd(prod)}
                      className="flex-1 py-2 bg-white/95 hover:bg-white text-zinc-950 text-[11px] font-bold rounded-lg shadow-md transition"
                    >
                      Quick View
                    </button>
                    <button
                      onClick={() => onAddToCart(prod, prod.variants?.[0])}
                      className="flex-1 py-2 bg-zinc-950 hover:bg-black text-white text-[11px] font-bold rounded-lg shadow-md transition flex items-center justify-center gap-1"
                    >
                      <span>Add</span>
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Card Meta */}
                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase block">
                      {prod.category}
                    </span>
                    <h3
                      onClick={() => onOpenProduct(prod)}
                      className="text-sm font-bold text-zinc-900 mt-1 cursor-pointer hover:underline line-clamp-1"
                    >
                      {prod.title}
                    </h3>
                  </div>

                  <div className="mt-3 pt-3 border-t border-zinc-100 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-black text-zinc-950">
                        ৳{prod.price.toLocaleString("en-BD")}
                      </span>
                      {prod.comparePrice && prod.comparePrice > prod.price && (
                        <span className="text-[11px] text-zinc-400 line-through ml-2">
                          ৳{prod.comparePrice.toLocaleString("en-BD")}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      In Stock
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── 5. High-Fashion Lookbook Strip ───────────────────────────────── */}
      <section id="lookbook" className="bg-zinc-950 text-white py-16 sm:py-24 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mb-12">
            <span className="text-[10px] font-mono tracking-[0.25em] text-zinc-400 uppercase block mb-2">
              LOOKBOOK ARCHIVE
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight">
              Craftsmanship &amp; Architectural Silhouettes
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-3 leading-relaxed">
              Every drop is developed in limited batches using authentic 520 GSM bonded twill, Japanese loopback fleece, and Toyoda shuttle loom denim.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 group">
              <img
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=85"
                alt="Atelier Model"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Archive Spec</span>
                <p className="text-sm font-bold text-white mt-1">Structured Bonded Overcoat</p>
                <p className="text-xs text-zinc-400">520 GSM Italian Horn Button Tailoring</p>
              </div>
            </div>

            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 group">
              <img
                src="https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=800&auto=format&fit=crop&q=85"
                alt="Boxy Tee Model"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Archive Spec</span>
                <p className="text-sm font-bold text-white mt-1">Boxy Heavyweight Drop-Shoulder</p>
                <p className="text-xs text-zinc-400">300 GSM Combed Jersey Wash</p>
              </div>
            </div>

            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 group">
              <img
                src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=85"
                alt="Selvedge Denim Model"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Archive Spec</span>
                <p className="text-sm font-bold text-white mt-1">Kurabo Redline Selvedge</p>
                <p className="text-xs text-zinc-400">14oz Toyoda Loom Raw Denim</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. Trust Manifesto ───────────────────────────────────────────── */}
      <section id="atelier-manifesto" className="border-t border-zinc-200/80 bg-zinc-50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-zinc-900" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900">48h Express Dispatch</h4>
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                Automated Steadfast &amp; Pathao courier dispatch with direct SMS tracking numbers.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-zinc-900" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900">Doorstep Fit Verification</h4>
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                Try on upon arrival before making payment. Free hassle-free size exchange within 7 days.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5 text-zinc-900" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900">Cash on Delivery &amp; bKash</h4>
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                Pay with Cash on Delivery (COD) anywhere in Bangladesh, or instant bKash and Nagad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. Editorial Clean 4-Column Footer ────────────────────────────── */}
      <footer className="bg-white border-t border-zinc-200 py-12 sm:py-16 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <span className="text-base font-black tracking-tight uppercase font-serif text-zinc-950">
              {storeDisplayName}
            </span>
            <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
              High fashion minimalist atelier. Tailored silhouettes, heavyweight combed fabrics, and nationwide doorstep fit assurance.
            </p>
            <p className="text-[11px] font-mono text-zinc-400 mt-3">
              Powered by StoreSwift
            </p>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-3">Collection</h5>
            <ul className="space-y-2 text-xs text-zinc-600">
              <li><button onClick={() => setSelectedCategory("all")} className="hover:text-black">All Archive</button></li>
              <li><button onClick={() => setSelectedCategory("Outerwear")} className="hover:text-black">Tailored Overcoats</button></li>
              <li><button onClick={() => setSelectedCategory("Denim")} className="hover:text-black">Kurabo Selvedge</button></li>
              <li><button onClick={() => setSelectedCategory("Tees")} className="hover:text-black">Heavyweight Tees</button></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-3">Service</h5>
            <ul className="space-y-2 text-xs text-zinc-600">
              {onOpenTrackOrder && <li><button onClick={onOpenTrackOrder} className="hover:text-black">Track Order</button></li>}
              {onOpenCheckout && <li><button onClick={onOpenCheckout} className="hover:text-black">Express Checkout</button></li>}
              <li><button onClick={() => setIsSizeGuideOpen(true)} className="hover:text-black">Size Guide &amp; Fit</button></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-3">Newsletter</h5>
            <p className="text-xs text-zinc-500 mb-2">Subscribe for archival release notifications.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="you@email.com"
                className="px-3 py-1.5 text-xs border border-zinc-200 rounded-lg flex-1 outline-none focus:border-black"
              />
              <button className="bg-black text-white text-xs font-bold px-3 py-1.5 rounded-lg">Join</button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p>© {new Date().getFullYear()} {storeDisplayName}. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Terms</span>
            <span>Privacy</span>
            <span>Shipping &amp; Returns</span>
          </div>
        </div>
      </footer>

      {/* ─── 8. Universal Quick View Modal ─────────────────────────────────── */}
      {quickViewProd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-white text-zinc-950 rounded-2xl max-w-2xl w-full p-6 sm:p-8 border border-zinc-200 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setQuickViewProd(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-black p-1 rounded-lg"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
              <div className="aspect-[3/4] bg-zinc-100 rounded-xl overflow-hidden border border-zinc-200">
                <img
                  src={quickViewProd.imageUrl}
                  alt={quickViewProd.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                    {quickViewProd.category || "Atelier Line"}
                  </span>
                  <h3 className="text-xl font-bold font-serif text-zinc-950 mt-1">
                    {quickViewProd.title}
                  </h3>
                  <p className="text-lg font-black text-zinc-950 mt-1">
                    ৳{quickViewProd.price.toLocaleString("en-BD")}
                  </p>
                </div>

                <p className="text-xs text-zinc-600 leading-relaxed">
                  {quickViewProd.description}
                </p>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-xs text-amber-900">
                  <Flame className="w-4 h-4 text-amber-600 shrink-0" />
                  <span><strong>Limited Allocation:</strong> Only 4 pieces remain in current batch.</span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-zinc-800">Select Size:</span>
                    <button
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="text-zinc-500 hover:text-black underline"
                    >
                      Size Guide
                    </button>
                  </div>
                  <div className="flex gap-2">
                    {["S", "M", "L", "XL"].map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setQuickViewSize(sz)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition ${
                          quickViewSize === sz
                            ? "bg-black text-white border-black"
                            : "border-zinc-200 text-zinc-800 hover:border-zinc-400"
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    onAddToCart(quickViewProd, { title: quickViewSize, price: String(quickViewProd.price) });
                    setQuickViewProd(null);
                  }}
                  className="w-full py-3 bg-zinc-950 hover:bg-black text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add Size {quickViewSize} to Bag</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── 9. Size Guide Modal ──────────────────────────────────────────── */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-white text-zinc-950 rounded-2xl max-w-lg w-full p-6 border border-zinc-200 shadow-2xl relative">
            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-black p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold font-serif text-zinc-950 flex items-center gap-2">
              <Ruler className="w-4 h-4 text-zinc-700" /> Atelier Sizing Guide
            </h3>

            <div className="flex items-center justify-between mt-4 mb-3">
              <span className="text-xs text-zinc-500">Unit Measurement:</span>
              <div className="flex bg-zinc-100 p-0.5 rounded-lg text-xs font-bold">
                <button
                  onClick={() => setSizeUnit("in")}
                  className={`px-3 py-1 rounded-md transition ${sizeUnit === "in" ? "bg-white text-black shadow-xs" : "text-zinc-500"}`}
                >
                  IN
                </button>
                <button
                  onClick={() => setSizeUnit("cm")}
                  className={`px-3 py-1 rounded-md transition ${sizeUnit === "cm" ? "bg-white text-black shadow-xs" : "text-zinc-500"}`}
                >
                  CM
                </button>
              </div>
            </div>

            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 text-zinc-400 text-[10px] font-mono uppercase">
                  <th className="py-2">Size</th>
                  <th className="py-2">Chest</th>
                  <th className="py-2">Shoulder</th>
                  <th className="py-2">Length</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-medium text-zinc-800">
                <tr><td className="py-2 font-bold">S</td><td>{sizeUnit === "in" ? "42\"" : "106 cm"}</td><td>{sizeUnit === "in" ? "20.5\"" : "52 cm"}</td><td>{sizeUnit === "in" ? "28\"" : "71 cm"}</td></tr>
                <tr><td className="py-2 font-bold">M</td><td>{sizeUnit === "in" ? "44.5\"" : "113 cm"}</td><td>{sizeUnit === "in" ? "21.5\"" : "54 cm"}</td><td>{sizeUnit === "in" ? "29\"" : "73 cm"}</td></tr>
                <tr><td className="py-2 font-bold">L</td><td>{sizeUnit === "in" ? "47\"" : "119 cm"}</td><td>{sizeUnit === "in" ? "22.5\"" : "57 cm"}</td><td>{sizeUnit === "in" ? "30\"" : "76 cm"}</td></tr>
                <tr><td className="py-2 font-bold">XL</td><td>{sizeUnit === "in" ? "49.5\"" : "125 cm"}</td><td>{sizeUnit === "in" ? "23.5\"" : "60 cm"}</td><td>{sizeUnit === "in" ? "31\"" : "78 cm"}</td></tr>
              </tbody>
            </table>

            <div className="mt-4 p-3 bg-zinc-50 rounded-xl text-xs text-zinc-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
              <p><strong>Doorstep Fit Assurance:</strong> You can inspect and try on the garment upon delivery. If sizing is off, exchange is completely free.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
