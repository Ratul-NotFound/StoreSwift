"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ShoppingBag,
  Search,
  Heart,
  ArrowRight,
  Menu,
  X,
  User,
  ChevronRight,
  Star,
  Check,
  Truck,
  ShieldCheck,
  RotateCcw,
  Instagram,
  Twitter,
  Youtube,
  MapPin,
  Mail,
  Phone
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface MilanoStorefrontProps {
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

// ─── Data ────────────────────────────────────────────────────────────────────
const VERTICAL_CATEGORIES = [
  {
    id: "hoodies",
    label: "Hoodies",
    img: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=500&auto=format&fit=crop&q=85",
    count: "124 styles",
  },
  {
    id: "sweatshirts",
    label: "Sweatshirts",
    img: "https://images.unsplash.com/photo-1609587312208-cea54be969e7?w=500&auto=format&fit=crop&q=85",
    count: "86 styles",
  },
  {
    id: "t-shirts",
    label: "T-Shirts",
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=85",
    count: "210 styles",
  },
  {
    id: "shirts",
    label: "Shirts",
    img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&auto=format&fit=crop&q=85",
    count: "98 styles",
  },
  {
    id: "jackets",
    label: "Jackets",
    img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=85",
    count: "65 styles",
  },
];

const PRODUCT_DROPS = [
  {
    id: "m1", label: "NEW DROP", title: "Osaka Oversized Hoodie", subtitle: "400 GSM French Terry",
    price: 129, compare: 175, tag: "Sold Out Soon",
    img: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=700&auto=format&fit=crop&q=85",
  },
  {
    id: "m2", label: "COLLAB", title: "Washed Crew Sweatshirt", subtitle: "Enzyme Washed Cotton Blend",
    price: 89, compare: 120, tag: "Limited",
    img: "https://images.unsplash.com/photo-1611911813383-67769b37a149?w=700&auto=format&fit=crop&q=85",
  },
  {
    id: "m3", label: "ARCHIVE", title: "Triple-Panel Bomber", subtitle: "Ripstop Nylon x Fleece",
    price: 215, compare: 290, tag: "Archives",
    img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=700&auto=format&fit=crop&q=85",
  },
  {
    id: "m4", label: "ESSENTIALS", title: "Box-Cut Tee", subtitle: "280 GSM Ringspun Cotton",
    price: 55, compare: 75, tag: "Restocked",
    img: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=700&auto=format&fit=crop&q=85",
  },
];

const LOOKBOOK_SHOTS = [
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=85",
  "https://images.unsplash.com/photo-1550614000-4895a10e1bfd?w=600&auto=format&fit=crop&q=85",
  "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop&q=85",
  "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&auto=format&fit=crop&q=85",
];

// ─── Component ────────────────────────────────────────────────────────────────
export function MilanoStorefront({
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
}: MilanoStorefrontProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [view, setView] = useState<"home" | "shop" | "lookbook">("home");
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [wishlistLocal, setWishlistLocal] = useState<Set<string>>(new Set());
  const [addedId, setAddedId] = useState<string | null>(null);
  const [heroIndex, setHeroIndex] = useState(0);

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  const catalogItems = React.useMemo(() => {
    if (products && products.length > 0) {
      return products.map((p, idx) => ({
        id: p.id,
        label: p.badge || (idx === 0 ? "NEW DROP" : idx === 1 ? "COLLAB" : "ESSENTIALS"),
        title: p.title,
        subtitle: p.description ? (p.description.length > 35 ? p.description.slice(0, 35) + "..." : p.description) : "400 GSM French Terry",
        price: p.price,
        compare: p.comparePrice || Math.round(p.price * 1.3),
        tag: idx === 0 ? "Limited" : "In Stock",
        img: p.imageUrl || "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=700&auto=format&fit=crop&q=85",
        rawProduct: p
      }));
    }
    return PRODUCT_DROPS.map((item) => ({ ...item, rawProduct: null }));
  }, [products]);

  // Cycle hero text
  const heroLines = ["RIGHT GEAR", "BEST LOOK", "YOUR STYLE", "NEXT LEVEL"];
  useEffect(() => {
    const t = setInterval(() => setHeroIndex(i => (i + 1) % heroLines.length), 3500);
    return () => clearInterval(t);
  }, []);

  const handleWishlist = (id: string) => {
    setWishlistLocal(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
    onToggleWishlist(id);
  };

  const handleAdd = (item: any) => {
    const prod = item.rawProduct || { id: item.id, title: item.title, slug: item.id, description: item.subtitle, price: item.price, comparePrice: item.compare, imageUrl: item.img, badge: item.tag, variants: [] };
    const defaultVariant = (prod.variants && prod.variants[0]) || { sku: `${item.id}-default`, title: "Standard", price: item.price };
    onAddToCart(prod, defaultVariant);
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 1400);
  };

  return (
    <div suppressHydrationWarning className="min-h-screen bg-[#0e0e0e] text-white font-sans antialiased">

      {/* ── Header ────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0e0e0e]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-5 h-14 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView("home")}>
            <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
              <span className="text-[#0e0e0e] text-[10px] font-black tracking-tight">M</span>
            </div>
            <span className="text-white font-black text-sm tracking-[0.2em] uppercase">MILANO</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-[11px] font-semibold tracking-[0.18em] uppercase text-white/60">
            <button onClick={() => setView("home")} className={`hover:text-white transition ${view === "home" ? "text-white" : ""}`}>Home</button>
            <button onClick={() => setView("shop")} className={`hover:text-white transition ${view === "shop" ? "text-white" : ""}`}>Shop</button>
            <button onClick={() => setView("lookbook")} className={`hover:text-white transition ${view === "lookbook" ? "text-white" : ""}`}>Lookbook</button>
            <button className="hover:text-white transition">About</button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {onOpenTrackOrder && (
              <button onClick={onOpenTrackOrder} className="hidden lg:flex items-center text-[10px] uppercase font-bold tracking-widest text-white/60 hover:text-white transition">
                Track Order
              </button>
            )}
            {onOpenCheckout && (
              <button onClick={onOpenCheckout} className="hidden sm:flex items-center gap-1.5 bg-[#c9a96e] hover:bg-[#b8955a] text-black text-[10px] uppercase font-bold tracking-widest px-3.5 py-1.5 rounded-sm transition">
                <Truck className="w-3 h-3" />
                <span>Checkout</span>
              </button>
            )}
            <button onClick={onOpenSearch} className="text-white/60 hover:text-white transition" aria-label="Search catalog">
              <Search className="w-4 h-4" />
            </button>
            <button onClick={onOpenCart} className="relative text-white/60 hover:text-white transition">
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-white text-[#0e0e0e] text-[9px] font-black rounded-full flex items-center justify-center">{cartCount}</span>
              )}
            </button>
            <button className="md:hidden text-white/60 hover:text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#111] border-t border-white/10 px-5 py-4 space-y-3">
            {["Home", "Shop", "Lookbook", "About"].map(l => (
              <button key={l} className="block w-full text-left text-sm font-bold uppercase tracking-widest text-white/70 hover:text-white transition py-1"
                onClick={() => { if (l === "Shop") setView("shop"); else if (l === "Lookbook") setView("lookbook"); else setView("home"); setMobileMenuOpen(false); }}>
                {l}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ══════════════════════════════════════════════════════════════
          HOME VIEW
      ══════════════════════════════════════════════════════════════ */}
      {view === "home" && (
        <>
          {/* ── Hero: Full-bleed split editorial ──────────────────── */}
          <section className="relative h-screen min-h-[600px] max-h-[860px] overflow-hidden pt-14">
            {/* BG Image */}
            <div className="absolute inset-0">
              <img src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1600&auto=format&fit=crop&q=90"
                alt="Hero" className="w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0e0e0e] via-[#0e0e0e]/60 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex items-end pb-16 md:pb-24 max-w-7xl mx-auto px-5">
              <div className="max-w-xl">
                <p className="text-[11px] font-mono uppercase tracking-[0.35em] text-white/50 mb-6">SS 2025 Collection</p>
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.92] mb-8">
                  GET<br />
                  YOURSELF<br />
                  <span className="text-transparent" style={{ WebkitTextStroke: "2px rgba(255,255,255,0.7)" }}>
                    INTO THE
                  </span><br />
                  <span className="text-[#c9a96e]">{heroLines[heroIndex]}</span>
                </h1>
                <button onClick={() => setView("shop")}
                  className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.25em] text-white/80 hover:text-white transition group">
                  View Summer Collection
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </button>
              </div>
            </div>

            {/* Decorative accent square */}
            <div className="absolute right-32 top-1/2 -translate-y-1/2 w-16 h-16 bg-[#c9a96e]/30 hidden lg:block" />
          </section>

          {/* ── Vertical Category Strip ───────────────────────────── */}
          <section className="bg-[#0e0e0e] py-2">
            <div className="flex overflow-x-auto scrollbar-hide">
              {VERTICAL_CATEGORIES.map((cat, idx) => (
                <button key={cat.id} onClick={() => { setActiveCat(cat.id); setView("shop"); }}
                  className="relative flex-shrink-0 w-44 sm:w-52 h-80 sm:h-96 overflow-hidden group border-l border-white/10 first:border-l-0">
                  <img src={cat.img} alt={cat.label}
                    className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 group-hover:from-black/60 transition" />
                  {/* Vertical label */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
                    <span className="text-white font-black text-base uppercase tracking-widest" style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}>
                      {cat.label}
                    </span>
                    <ArrowRight className="w-4 h-4 text-white/60 group-hover:text-[#c9a96e] transition rotate-90" />
                  </div>
                  <div className="absolute top-4 left-4 text-[9px] font-mono uppercase tracking-widest text-white/40">
                    {cat.count}
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* ── New Drops ─────────────────────────────────────────── */}
          <section className="py-20 max-w-7xl mx-auto px-5">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.35em] text-white/30 mb-2">Latest Releases</p>
                <h2 className="text-4xl font-black uppercase tracking-tight">New Drops</h2>
              </div>
              <button onClick={() => setView("shop")} className="text-[11px] font-bold uppercase tracking-widest text-[#c9a96e] hover:text-white transition flex items-center gap-2">
                All Products <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
              {catalogItems.map(item => (
                <div key={item.id} className="group bg-[#0e0e0e] overflow-hidden relative">
                  <div className="aspect-[3/4] overflow-hidden relative bg-[#1a1a1a] cursor-pointer" onClick={() => {
                    const p = { id: item.id, title: item.title, slug: item.id, description: item.subtitle, price: item.price, comparePrice: item.compare, imageUrl: item.img, badge: item.tag, variants: [] };
                    onOpenProduct(p);
                  }}>
                    <img src={item.img} alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-107 transition duration-700 grayscale-[20%] group-hover:grayscale-0" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
                    <div className="absolute top-4 left-4 text-[9px] font-mono uppercase tracking-[0.25em] bg-white text-black px-2 py-0.5 font-bold">
                      {item.label}
                    </div>
                    <button onClick={e => { e.stopPropagation(); handleWishlist(item.id); }}
                      className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center border transition ${wishlistLocal.has(item.id) ? "bg-rose-500 border-rose-500 text-white" : "bg-black/40 border-white/20 text-white/70 hover:border-white hover:text-white"}`}>
                      <Heart className={`w-3.5 h-3.5 ${wishlistLocal.has(item.id) ? "fill-white" : ""}`} />
                    </button>
                    {/* Quick add overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition translate-y-2 group-hover:translate-y-0 duration-300">
                      <button onClick={e => { e.stopPropagation(); handleAdd(item); }}
                        className={`w-full py-2.5 text-xs font-bold uppercase tracking-widest transition flex items-center justify-center gap-2 ${addedId === item.id ? "bg-emerald-500 text-white" : "bg-white text-black hover:bg-[#c9a96e]"}`}>
                        {addedId === item.id ? <><Check className="w-3.5 h-3.5" /> Added</> : <><ShoppingBag className="w-3.5 h-3.5" /> Quick Add</>}
                      </button>
                    </div>
                  </div>
                  <div className="p-4 border-t border-white/5">
                    <p className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#c9a96e] mb-1">{item.subtitle}</p>
                    <h3 className="text-sm font-bold text-white mb-2 leading-tight">{item.title}</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-black text-white text-sm">৳{item.price.toLocaleString("en-BD")}</span>
                        {item.compare > item.price && (
                          <span className="text-xs text-white/30 line-through ml-2">৳{item.compare.toLocaleString("en-BD")}</span>
                        )}
                      </div>
                      <span className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 border border-white/20 text-white/50">{item.tag}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Full-width editorial strip ────────────────────────── */}
          <section className="relative overflow-hidden h-56 sm:h-72">
            <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=85"
              alt="Editorial" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-[#0e0e0e]/70 flex items-center justify-center">
              <div className="text-center">
                <p className="text-[10px] font-mono uppercase tracking-[0.35em] text-white/50 mb-3">Autumn / Winter 2025</p>
                <h2 className="text-4xl sm:text-6xl font-black uppercase text-white tracking-tight mb-6">The New Silhouette</h2>
                <button onClick={() => setView("lookbook")}
                  className="inline-flex items-center gap-2 border border-white text-white text-[11px] font-bold uppercase tracking-widest px-6 py-3 hover:bg-white hover:text-black transition">
                  View Lookbook <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>

          {/* ── Trust Row ─────────────────────────────────────────── */}
          <section className="border-t border-white/5 py-10">
            <div className="max-w-7xl mx-auto px-5 grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                { icon: <Truck className="w-5 h-5" />, title: "Free Shipping", sub: "Orders above ৳2,000" },
                { icon: <RotateCcw className="w-5 h-5" />, title: "30-Day Returns", sub: "Hassle-free exchanges" },
                { icon: <ShieldCheck className="w-5 h-5" />, title: "Secure Checkout", sub: "256-bit SSL encryption" },
              ].map(t => (
                <div key={t.title} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[#c9a96e]">{t.icon}</div>
                  <div>
                    <p className="text-sm font-bold text-white">{t.title}</p>
                    <p className="text-xs text-white/40 mt-0.5">{t.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════
          SHOP VIEW
      ══════════════════════════════════════════════════════════════ */}
      {view === "shop" && (
        <div className="pt-14 min-h-screen">
          <div className="max-w-7xl mx-auto px-5 py-10">
            {/* Header */}
            <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-widest text-white/30 mb-8">
              <button onClick={() => setView("home")} className="hover:text-white transition">Home</button>
              <span>/</span>
              <span className="text-white/60">Shop All</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <h1 className="text-4xl font-black uppercase tracking-tight">All Products</h1>
              <div className="flex flex-wrap gap-2">
                {VERTICAL_CATEGORIES.map(c => (
                  <button key={c.id} onClick={() => setActiveCat(activeCat === c.id ? null : c.id)}
                    className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest border transition ${activeCat === c.id ? "bg-white text-black border-white" : "border-white/20 text-white/50 hover:border-white hover:text-white"}`}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-white/5">
              {catalogItems.map(item => (
                <div key={item.id} className="group bg-[#0e0e0e] overflow-hidden">
                  <div className="aspect-[3/4] overflow-hidden relative bg-[#1a1a1a] cursor-pointer" onClick={() => {
                    const p = { id: item.id, title: item.title, slug: item.id, description: item.subtitle, price: item.price, comparePrice: item.compare, imageUrl: item.img, badge: item.tag, variants: [] };
                    onOpenProduct(p);
                  }}>
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-600" />
                    <div className="absolute top-3 left-3 text-[9px] font-mono uppercase tracking-widest bg-white text-black px-2 py-0.5 font-bold">{item.label}</div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 opacity-0 group-hover:opacity-100 transition">
                      <button onClick={e => { e.stopPropagation(); handleAdd(item); }}
                        className={`w-full py-2 text-xs font-bold uppercase tracking-widest transition ${addedId === item.id ? "bg-emerald-500 text-white" : "bg-white text-black hover:bg-[#c9a96e]"}`}>
                        {addedId === item.id ? "Added ✓" : "Quick Add"}
                      </button>
                    </div>
                  </div>
                  <div className="p-3 border-t border-white/5">
                    <h3 className="text-xs font-bold text-white mb-1 line-clamp-1">{item.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="font-black text-white text-sm">৳{item.price.toLocaleString("en-BD")}</span>
                      {item.compare > item.price && <span className="text-xs text-white/30 line-through">৳{item.compare.toLocaleString("en-BD")}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          LOOKBOOK VIEW
      ══════════════════════════════════════════════════════════════ */}
      {view === "lookbook" && (
        <div className="pt-14 min-h-screen">
          <div className="max-w-7xl mx-auto px-5 py-10">
            <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-widest text-white/30 mb-8">
              <button onClick={() => setView("home")} className="hover:text-white transition">Home</button>
              <span>/</span>
              <span className="text-white/60">Lookbook</span>
            </div>
            <h1 className="text-5xl font-black uppercase tracking-tight mb-2">SS 2025</h1>
            <p className="text-white/40 text-sm font-mono uppercase tracking-widest mb-10">The New Silhouette Collection</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {LOOKBOOK_SHOTS.map((img, i) => (
                <div key={i} className={`relative overflow-hidden ${i === 0 ? "row-span-2 col-span-1" : ""}`}>
                  <div className={`${i === 0 ? "aspect-[2/3]" : "aspect-square"} overflow-hidden group`}>
                    <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-105 grayscale hover:grayscale-0 transition duration-500" />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <button onClick={() => setView("shop")}
                className="inline-flex items-center gap-3 border border-white text-white text-[11px] font-bold uppercase tracking-widest px-8 py-3 hover:bg-white hover:text-black transition">
                Shop The Look <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 mt-20 pt-14 pb-8">
        <div className="max-w-7xl mx-auto px-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                <span className="text-[#0e0e0e] text-[10px] font-black">M</span>
              </div>
              <span className="font-black text-sm tracking-[0.2em] uppercase">MILANO</span>
            </div>
            <p className="text-white/30 text-sm leading-relaxed">Editorial streetwear. Designed for those who move with intention.</p>
            <div className="flex gap-3 mt-5">
              {[Instagram, Twitter, Youtube].map((Icon, i) => (
                <button key={i} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-white/50 hover:text-white flex items-center justify-center transition">
                  <Icon className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
          </div>
          {[
            { h: "Catalog", links: ["Hoodies", "Sweatshirts", "T-Shirts", "Jackets", "Accessories"] },
            { h: "Support", links: ["Track Order", "Returns", "Size Guide", "FAQs", "Contact"] },
          ].map(col => (
            <div key={col.h}>
              <h4 className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30 mb-4">{col.h}</h4>
              <ul className="space-y-2.5">
                {col.links.map(l => <li key={l}><button className="text-sm text-white/50 hover:text-white transition">{l}</button></li>)}
              </ul>
            </div>
          ))}
          <div>
            <h4 className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30 mb-4">Newsletter</h4>
            <p className="text-sm text-white/40 mb-4">Drops. Collabs. Early access. No spam.</p>
            <form className="flex" onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="your@email.com"
                className="flex-1 bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-white/30 transition rounded-l" />
              <button type="submit" className="bg-white text-black text-xs font-bold px-4 rounded-r hover:bg-[#c9a96e] transition">→</button>
            </form>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-5 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-white/20">
          <span>© {new Date().getFullYear()} MILANO by {storeDisplayName}. All rights reserved.</span>
          <div className="flex gap-5">
            {["Privacy", "Terms", "Cookies"].map(l => <button key={l} className="hover:text-white transition">{l}</button>)}
          </div>
        </div>
      </footer>
    </div>
  );
}

