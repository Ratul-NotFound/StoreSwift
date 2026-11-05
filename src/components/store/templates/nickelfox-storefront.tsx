"use client";

import React, { useState, useMemo } from "react";
import {
  ShoppingBag,
  Search,
  Heart,
  ArrowRight,
  Menu,
  X,
  Star,
  Check,
  ChevronRight,
  Truck,
  ShieldCheck,
  RotateCcw,
  Zap,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Tag,
  Flame,
  ArrowUpRight,
  SlidersHorizontal,
  Compass,
  Sparkles
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────
interface NickelFoxStorefrontProps {
  storeDisplayName: string;
  tenantSlug: string;
  products: any[];
  cartItems: any[];
  wishlist: string[];
  finalTotal: number;
  onAddToCart: (prod: any, variant: any) => void;
  onToggleWishlist: (productId: string) => void;
  onOpenProduct: (prod: any) => void;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenCheckout?: () => void;
  onOpenTrackOrder?: () => void;
}

// ─── Curated Category Collections ──────────────────────────────────────────
const STREET_CATEGORIES = [
  {
    id: "outerwear",
    title: "Heavy Outerwear",
    subtitle: "Double-faced wool & down parkas",
    img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=700&auto=format&fit=crop&q=85",
    tag: "Archival"
  },
  {
    id: "hoodies",
    title: "Loopback Hoodies",
    subtitle: "480 GSM French Terry",
    img: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=700&auto=format&fit=crop&q=85",
    tag: "Heavyweight"
  },
  {
    id: "denim",
    title: "Selvedge Denim",
    subtitle: "14oz Kurabo Japanese Weave",
    img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=700&auto=format&fit=crop&q=85",
    tag: "Raw Mill"
  },
  {
    id: "tees",
    title: "Structured Tees",
    subtitle: "280 GSM Combed Ringspun",
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=700&auto=format&fit=crop&q=85",
    tag: "Box Cut"
  },
  {
    id: "pants",
    title: "Pleated Trousers",
    subtitle: "Italian tropical bonded wool",
    img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=700&auto=format&fit=crop&q=85",
    tag: "Relaxed Fit"
  },
  {
    id: "accessories",
    title: "Leather Goods",
    subtitle: "Full-grain calfskin carryalls",
    img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=700&auto=format&fit=crop&q=85",
    tag: "Crafted"
  }
];

const LOCAL_VERIFICATION_PERKS = [
  { title: "Steadfast 24–48h Nationwide", sub: "Same-day dispatch in Dhaka & Chittagong" },
  { title: "Doorstep Fit Inspection", sub: "Inspect cut & fabric before cash handover" },
  { title: "Official COD & bKash / Nagad", sub: "Instant tokenized checkout confirmation" },
  { title: "Complimentary Exchanges", sub: "Hassle-free 7-day size adjustments" }
];

export function NickelFoxStorefront({
  storeDisplayName,
  tenantSlug,
  products,
  cartItems,
  wishlist,
  finalTotal,
  onAddToCart,
  onToggleWishlist,
  onOpenProduct,
  onOpenCart,
  onOpenSearch,
  onOpenCheckout,
  onOpenTrackOrder,
}: NickelFoxStorefrontProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [view, setView] = useState<"home" | "shop" | "favourite">("home");
  const [activeNav, setActiveNav] = useState("Catalogue");
  const [wishlistLocal, setWishlistLocal] = useState<Set<string>>(new Set(wishlist));
  const [addedId, setAddedId] = useState<string | null>(null);
  const [activeCat, setActiveCat] = useState("All");

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  const handleWishlist = (id: string) => {
    setWishlistLocal((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
    onToggleWishlist(id);
  };

  const handleAdd = (item: any) => {
    const prod = item.rawProduct || {
      id: item.id,
      title: item.title,
      slug: item.id,
      description: item.title,
      price: item.price,
      comparePrice: item.compare,
      imageUrl: item.img,
      badge: item.badge,
      variants: []
    };
    const defaultVariant = (prod.variants && prod.variants[0]) || {
      sku: `${item.id}-default`,
      title: "Standard",
      price: item.price
    };
    onAddToCart(prod, defaultVariant);
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 1400);
  };

  const catalogItems = useMemo(() => {
    if (products && products.length > 0) {
      return products.map((p, idx) => ({
        id: p.id,
        title: p.title,
        cat: (p as any).category || (idx % 2 === 0 ? "Tops" : "Outerwear"),
        price: p.price,
        compare: p.comparePrice || Math.round(p.price * 1.3),
        rating: p.rating || 4.9,
        reviews: 42 + (idx * 7),
        badge: p.badge || (idx === 0 ? "Archive Drop" : idx === 1 ? "Heavyweight" : "Limited"),
        img: p.imageUrl || "https://images.unsplash.com/photo-1594938298603-c8148c4b5571?w=700&auto=format&fit=crop&q=85",
        rawProduct: p
      }));
    }
    return [
      {
        id: "nf1",
        title: "Box-Cut Heavyweight Tee",
        cat: "Tops",
        price: 2850,
        compare: 3500,
        rating: 4.9,
        reviews: 58,
        badge: "280 GSM",
        img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=700&auto=format&fit=crop&q=85",
        rawProduct: null
      },
      {
        id: "nf2",
        title: "Archival Raglan Fleece Hoodie",
        cat: "Outerwear",
        price: 6400,
        compare: 7800,
        rating: 5.0,
        reviews: 94,
        badge: "480 GSM",
        img: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=700&auto=format&fit=crop&q=85",
        rawProduct: null
      },
      {
        id: "nf3",
        title: "Kurabo Selvedge Raw Denim",
        cat: "Bottoms",
        price: 7900,
        compare: 9500,
        rating: 4.8,
        reviews: 36,
        badge: "14oz Indigo",
        img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=700&auto=format&fit=crop&q=85",
        rawProduct: null
      },
      {
        id: "nf4",
        title: "Bonded Wool Double Overcoat",
        cat: "Outerwear",
        price: 14200,
        compare: 17500,
        rating: 4.9,
        reviews: 47,
        badge: "Limited Run",
        img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=700&auto=format&fit=crop&q=85",
        rawProduct: null
      },
      {
        id: "nf5",
        title: "Relaxed Pleated Chino Trouser",
        cat: "Bottoms",
        price: 4800,
        compare: 5900,
        rating: 4.7,
        reviews: 29,
        badge: "Bonded Twill",
        img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=700&auto=format&fit=crop&q=85",
        rawProduct: null
      },
      {
        id: "nf6",
        title: "French Terry Zip Track Jacket",
        cat: "Outerwear",
        price: 6800,
        compare: 8200,
        rating: 4.9,
        reviews: 63,
        badge: "YKK Excella",
        img: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=700&auto=format&fit=crop&q=85",
        rawProduct: null
      },
      {
        id: "nf7",
        title: "Calfskin Leather Crossbody",
        cat: "Accessories",
        price: 9200,
        compare: 11000,
        rating: 5.0,
        reviews: 82,
        badge: "Full-Grain",
        img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=700&auto=format&fit=crop&q=85",
        rawProduct: null
      },
      {
        id: "nf8",
        title: "Ribbed Mercerized Cotton Knit",
        cat: "Tops",
        price: 4200,
        compare: 5200,
        rating: 4.8,
        reviews: 41,
        badge: "Breathable",
        img: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=700&auto=format&fit=crop&q=85",
        rawProduct: null
      }
    ];
  }, [products]);

  const NAV_CATS = ["All", ...Array.from(new Set(catalogItems.map((p) => p.cat)))];
  const filteredProducts = activeCat === "All" ? catalogItems : catalogItems.filter((p) => p.cat === activeCat);

  return (
    <div suppressHydrationWarning className="min-h-screen bg-[#09090b] text-zinc-100 font-sans antialiased selection:bg-zinc-800 selection:text-white">

      {/* ── Top Utility Assurance Bar ────────────────────────────────────────── */}
      <div className="bg-[#121215] border-b border-zinc-800/80 py-2 px-4 text-xs font-mono text-zinc-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-zinc-300 font-semibold">Autumn / Winter 2026 Archive Drops Live</span>
          </div>
          <div className="hidden sm:flex items-center space-x-6 text-[11px]">
            <span>Steadfast 24–48h Nationwide</span>
            <span className="text-zinc-600">•</span>
            <span>Doorstep Trial (COD)</span>
            <span className="text-zinc-600">•</span>
            <span>bKash / Nagad Verified</span>
          </div>
          {onOpenTrackOrder && (
            <button
              onClick={onOpenTrackOrder}
              className="text-[11px] text-zinc-300 hover:text-white transition flex items-center space-x-1"
            >
              <Truck className="w-3 h-3 text-emerald-400" />
              <span>Track Order</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Brand Header (Matte Obsidian Luxury) ─────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#09090b]/90 backdrop-blur-md border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => { setView("home"); setActiveNav("Catalogue"); }}
          >
            <div className="w-9 h-9 rounded-xl bg-zinc-100 text-zinc-950 flex items-center justify-center font-black text-sm tracking-widest shadow-sm group-hover:scale-105 transition-transform">
              NF
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white block uppercase leading-none font-mono">
                {storeDisplayName || "NICKELFOX"}
              </span>
              <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider block mt-1">
                Atelier Archives
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1 font-mono text-xs font-semibold">
            {["Catalogue", "Lookbook", "Collections", "About"].map((item) => (
              <button
                key={item}
                onClick={() => {
                  setActiveNav(item);
                  if (item === "Catalogue" || item === "Collections") setView("shop");
                  else setView("home");
                }}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeNav === item
                    ? "bg-zinc-800 text-white font-bold"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenSearch}
              className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition"
              aria-label="Search collection"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={() => setView("favourite")}
              className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition relative hidden sm:flex"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlistLocal.size > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                  {wishlistLocal.size}
                </span>
              )}
            </button>

            {onOpenCheckout && (
              <button
                onClick={onOpenCheckout}
                className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-mono font-semibold text-zinc-200 transition"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Express COD</span>
              </button>
            )}

            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold transition flex items-center space-x-2 shadow-sm"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-xs hidden sm:inline-block font-mono">Bag</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-zinc-950 text-white rounded-full text-[10px] font-bold flex items-center justify-center border border-zinc-800">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              className="md:hidden p-2 rounded-xl text-zinc-400 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-800 bg-[#121215] px-4 py-3 space-y-1 font-mono text-xs">
            {["Catalogue", "Lookbook", "Collections", "About"].map((item) => (
              <button
                key={item}
                onClick={() => {
                  setActiveNav(item);
                  if (item === "Catalogue" || item === "Collections") setView("shop");
                  else setView("home");
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2.5 px-3 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ══════════════════════════════════════════════════════════════════
          HOME EDITORIAL VIEW
      ══════════════════════════════════════════════════════════════════ */}
      {view === "home" && (
        <>
          {/* ── Editorial Split Hero ────────────────────────────────────────── */}
          <section className="relative border-b border-zinc-800/80 overflow-hidden bg-gradient-to-b from-[#121215] to-[#09090b]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 min-h-[580px] sm:min-h-[640px] items-center">
              
              {/* Left Editorial Copy */}
              <div className="lg:col-span-7 py-12 sm:py-20 lg:pr-12 space-y-6">
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>AUTUMN / WINTER 2026 ARCHIVES</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.05] uppercase">
                  STRUCTURED <br />
                  <span className="text-zinc-500 font-light">OVERSIZED</span> <br />
                  SILHOUETTES.
                </h1>

                <p className="text-xs sm:text-sm text-zinc-400 max-w-lg leading-relaxed font-sans">
                  Crafted from 480 GSM French Terry, bonded tropical wool, and Japanese Kurabo selvedge raw denim. Engineered for contemporary street tailoring with verified doorstep fitting inspection.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => setView("shop")}
                    className="py-3.5 px-7 bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs font-mono rounded-xl transition flex items-center space-x-2 shadow-sm"
                  >
                    <span>EXPLORE CATALOGUE</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setView("shop")}
                    className="py-3.5 px-6 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 font-semibold text-xs font-mono rounded-xl transition flex items-center space-x-2"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
                    <span>FILTER BY GSM & FIT</span>
                  </button>
                </div>

                {/* Local Courier Trust Badges */}
                <div className="pt-8 border-t border-zinc-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-zinc-400 font-mono text-xs">
                  <div>
                    <span className="block text-white font-bold">24–48h Dispatch</span>
                    <span className="text-[10px] text-zinc-500">Steadfast & Pathao</span>
                  </div>
                  <div>
                    <span className="block text-white font-bold">Doorstep Trial</span>
                    <span className="text-[10px] text-zinc-500">COD Verified</span>
                  </div>
                  <div>
                    <span className="block text-white font-bold">480 GSM Terry</span>
                    <span className="text-[10px] text-zinc-500">Pre-shrunk cotton</span>
                  </div>
                  <div>
                    <span className="block text-white font-bold">Free Exchanges</span>
                    <span className="text-[10px] text-zinc-500">7-Day Guarantee</span>
                  </div>
                </div>
              </div>

              {/* Right Hero Visual (3:4 Editorial Portrait) */}
              <div className="lg:col-span-5 relative py-6 lg:py-12">
                <div className="relative mx-auto max-w-md aspect-[3/4] rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&auto=format&fit=crop&q=85"
                    alt="Atelier Model"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
                  
                  {/* Floating Tag */}
                  <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-zinc-950/85 backdrop-blur-md border border-zinc-800 text-white flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                        Look 01 • Capsule Drop
                      </span>
                      <p className="text-xs font-bold font-mono">Archival Raglan Cut Hoodie (480 GSM)</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400">৳6,400</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Curated Street Categories ─────────────────────────────────────── */}
          <section className="py-14 sm:py-18 max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500 block mb-1">
                  Atelier Departments
                </span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                  Curated Silhouettes
                </h2>
              </div>
              <button
                onClick={() => setView("shop")}
                className="text-xs font-mono font-bold text-zinc-400 hover:text-white transition flex items-center space-x-1"
              >
                <span>VIEW COMPLETE ARCHIVE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {STREET_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCat(cat.title.split(" ")[1] || cat.title); setView("shop"); }}
                  className="group relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 aspect-[3/4] text-left transition hover:border-zinc-700"
                >
                  <img
                    src={cat.img}
                    alt={cat.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                  
                  <div className="absolute top-2.5 left-2.5">
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-zinc-950/80 backdrop-blur-md border border-zinc-800 text-zinc-300">
                      {cat.tag}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-xs font-bold text-white leading-tight font-mono">{cat.title}</p>
                    <p className="text-[10px] text-zinc-400 truncate mt-0.5">{cat.subtitle}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* ── Latest Releases Catalog Grid ─────────────────────────────────── */}
          <section className="py-12 border-t border-zinc-800/80 bg-[#0c0c0e]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <div className="flex items-center space-x-2 text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    <span>Limited Vault Inventory</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                    Seasonal Drops
                  </h2>
                </div>
                <button
                  onClick={() => setView("shop")}
                  className="text-xs font-mono font-bold text-zinc-400 hover:text-white transition flex items-center space-x-1"
                >
                  <span>SEE ALL ({catalogItems.length})</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 2-Column Mobile First Responsive Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
                {catalogItems.slice(0, 8).map((item) => (
                  <NickelFoxProductCard
                    key={item.id}
                    item={item}
                    wishlisted={wishlistLocal.has(item.id)}
                    added={addedId === item.id}
                    onWishlist={() => handleWishlist(item.id)}
                    onAdd={() => handleAdd(item)}
                    onView={() => {
                      const p = item.rawProduct || {
                        id: item.id,
                        title: item.title,
                        slug: item.id,
                        description: item.title,
                        price: item.price,
                        comparePrice: item.compare,
                        imageUrl: item.img,
                        badge: item.badge,
                        variants: []
                      };
                      onOpenProduct(p);
                    }}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* ── Local Trust & Nationwide Logistics Bar ────────────────────────── */}
          <section className="py-12 border-t border-zinc-800/80 bg-[#121215]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {LOCAL_VERIFICATION_PERKS.map((perk, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex items-start space-x-3.5"
                  >
                    <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center flex-shrink-0 text-emerald-400">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white font-mono">{perk.title}</h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">{perk.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          SHOP / CATALOGUE VIEW
      ══════════════════════════════════════════════════════════════════ */}
      {view === "shop" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-xs font-mono text-zinc-500 mb-6">
            <button onClick={() => setView("home")} className="hover:text-zinc-300">Home</button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-zinc-200">Vault Catalogue</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white font-mono">
                Atelier Vault
              </h1>
              <p className="text-xs text-zinc-400 mt-1 font-sans">
                Curated archive pieces with fabric weight metrics, studio photography, and instant COD dispatch.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5 font-mono text-xs">
              {NAV_CATS.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCat(cat)}
                  className={`px-3.5 py-1.5 rounded-xl border transition ${
                    activeCat === cat
                      ? "bg-white text-zinc-950 font-bold border-white"
                      : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
            {filteredProducts.map((item) => (
              <NickelFoxProductCard
                key={item.id}
                item={item}
                wishlisted={wishlistLocal.has(item.id)}
                added={addedId === item.id}
                onWishlist={() => handleWishlist(item.id)}
                onAdd={() => handleAdd(item)}
                onView={() => {
                  const p = item.rawProduct || {
                    id: item.id,
                    title: item.title,
                    slug: item.id,
                    description: item.title,
                    price: item.price,
                    comparePrice: item.compare,
                    imageUrl: item.img,
                    badge: item.badge,
                    variants: []
                  };
                  onOpenProduct(p);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          FAVOURITES VIEW
      ══════════════════════════════════════════════════════════════════ */}
      {view === "favourite" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center space-x-2 text-xs font-mono text-zinc-500 mb-6">
            <button onClick={() => setView("home")} className="hover:text-zinc-300">Home</button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-zinc-200">Saved Wishlist</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mb-8 font-mono">
            Saved Pieces ({wishlistLocal.size})
          </h1>

          {wishlistLocal.size === 0 ? (
            <div className="text-center py-16 bg-zinc-900/40 rounded-3xl border border-zinc-800/80 space-y-4">
              <Heart className="w-8 h-8 text-zinc-600 mx-auto" />
              <p className="text-sm text-zinc-400 font-mono">No pieces saved yet.</p>
              <button
                onClick={() => setView("shop")}
                className="py-2.5 px-6 bg-white text-zinc-950 font-bold text-xs font-mono rounded-xl hover:bg-zinc-200 transition"
              >
                Browse Catalogue
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
              {catalogItems
                .filter((it) => wishlistLocal.has(it.id))
                .map((item) => (
                  <NickelFoxProductCard
                    key={item.id}
                    item={item}
                    wishlisted={true}
                    added={addedId === item.id}
                    onWishlist={() => handleWishlist(item.id)}
                    onAdd={() => handleAdd(item)}
                    onView={() => {
                      const p = item.rawProduct || {
                        id: item.id,
                        title: item.title,
                        slug: item.id,
                        description: item.title,
                        price: item.price,
                        comparePrice: item.compare,
                        imageUrl: item.img,
                        badge: item.badge,
                        variants: []
                      };
                      onOpenProduct(p);
                    }}
                  />
                ))}
            </div>
          )}
        </div>
      )}

      {/* ── Contemporary Minimalist Footer ─────────────────────────────────── */}
      <footer className="border-t border-zinc-800/80 bg-[#09090b] pt-14 pb-10 text-xs font-mono text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div className="space-y-3">
            <span className="font-bold text-white uppercase text-sm block">
              {storeDisplayName || "NICKELFOX"}
            </span>
            <p className="text-zinc-400 leading-relaxed font-sans text-xs">
              Independent streetwear atelier specializing in 480 GSM loopback cotton, Japanese selvedge denim, and contemporary silhouettes.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-zinc-300 uppercase tracking-wider mb-3">Departments</h4>
            <ul className="space-y-2 text-zinc-400">
              <li>Heavyweight Hoodies</li>
              <li>Kurabo Selvedge Denim</li>
              <li>Structured Box-Cut Tees</li>
              <li>Archival Outerwear</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-zinc-300 uppercase tracking-wider mb-3">Courier Logistics</h4>
            <ul className="space-y-2 text-zinc-400">
              <li>Steadfast 24–48h Nationwide</li>
              <li>Doorstep Fit Inspection</li>
              <li>Cash on Delivery All 64 Districts</li>
              <li>bKash / Nagad Instant Verify</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-zinc-300 uppercase tracking-wider mb-3">Store Hours & Hub</h4>
            <p className="text-zinc-400 leading-relaxed text-xs font-sans">
              Dhaka Flagship • Banani & Dhanmondi <br />
              Orders dispatch daily at 4:00 PM BST.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <span>© {new Date().getFullYear()} {storeDisplayName}. All rights reserved.</span>
          <div className="flex space-x-6 text-zinc-400">
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
            <span>Courier Dispatch</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Reusable NickelFox Product Card ──────────────────────────────────────────
function NickelFoxProductCard({
  item,
  wishlisted,
  added,
  onWishlist,
  onAdd,
  onView
}: {
  item: any;
  wishlisted: boolean;
  added: boolean;
  onWishlist: () => void;
  onAdd: () => void;
  onView: () => void;
}) {
  const discountPercent = item.compare > item.price
    ? Math.round(((item.compare - item.price) / item.compare) * 100)
    : 0;

  return (
    <div className="group rounded-2xl bg-zinc-900/70 border border-zinc-800/80 hover:border-zinc-700 transition overflow-hidden flex flex-col justify-between">
      {/* 3:4 Portrait Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-zinc-950 cursor-pointer" onClick={onView}>
        <img
          src={item.img}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {item.badge && (
          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-zinc-950/85 backdrop-blur-md border border-zinc-800 text-[9.5px] font-mono font-bold text-zinc-200">
            {item.badge}
          </div>
        )}

        {discountPercent > 0 && (
          <div className="absolute top-2.5 right-2.5 px-1.5 py-0.5 rounded-md bg-rose-950/80 border border-rose-800/80 text-rose-300 text-[9px] font-mono font-bold">
            -{discountPercent}%
          </div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onWishlist();
          }}
          className={`absolute bottom-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center border transition ${
            wishlisted
              ? "bg-rose-500 border-rose-500 text-white"
              : "bg-zinc-950/70 border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-900"
          }`}
          aria-label="Save to wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${wishlisted ? "fill-white" : ""}`} />
        </button>
      </div>

      {/* Information & Mobile 1-Tap Add */}
      <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <span className="text-[9.5px] font-mono uppercase tracking-wider text-zinc-500 block">
            {item.cat}
          </span>
          <h3
            onClick={onView}
            className="text-xs sm:text-sm font-bold text-white line-clamp-1 cursor-pointer hover:text-zinc-300 transition mt-0.5"
          >
            {item.title}
          </h3>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-zinc-800/60">
          <div>
            <span className="text-xs sm:text-sm font-bold font-mono text-zinc-100">
              ৳{item.price.toLocaleString("en-BD")}
            </span>
            {item.compare > item.price && (
              <span className="text-[10px] text-zinc-500 line-through font-mono ml-1.5">
                ৳{item.compare.toLocaleString("en-BD")}
              </span>
            )}
          </div>

          <button
            onClick={onAdd}
            className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-mono font-bold border transition flex items-center space-x-1 ${
              added
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                : "bg-white hover:bg-zinc-200 text-zinc-950 border-white"
            }`}
          >
            {added ? (
              <>
                <Check className="w-3 h-3" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3 h-3" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
