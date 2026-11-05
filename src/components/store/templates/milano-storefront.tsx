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
    price: 3850, compare: 4800, tag: "Sold Out Soon",
    img: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=700&auto=format&fit=crop&q=85",
  },
  {
    id: "m2", label: "COLLAB", title: "Washed Crew Sweatshirt", subtitle: "Enzyme Washed Cotton Blend",
    price: 2950, compare: 3800, tag: "Limited",
    img: "https://images.unsplash.com/photo-1611911813383-67769b37a149?w=700&auto=format&fit=crop&q=85",
  },
  {
    id: "m3", label: "ARCHIVE", title: "Triple-Panel Bomber", subtitle: "Ripstop Nylon x Fleece",
    price: 6500, compare: 7900, tag: "Archives",
    img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=700&auto=format&fit=crop&q=85",
  },
  {
    id: "m4", label: "ESSENTIALS", title: "Box-Cut Heavy Tee", subtitle: "280 GSM Ringspun Cotton",
    price: 1850, compare: 2400, tag: "Restocked",
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

  // Cycle hero editorial lines
  const heroLines = ["RAW SILHOUETTES", "HEAVY COTTON", "STUDIO CUTS", "TIMELESS WEAR"];
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
    <div suppressHydrationWarning className="min-h-screen bg-[#0e0e0e] text-white font-sans antialiased selection:bg-[#c9a96e] selection:text-black">

      {/* ── Header ────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0e0e0e]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-5 h-14 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView("home")}>
            <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
              <span className="text-[#0e0e0e] text-[10px] font-black tracking-tight">M</span>
            </div>
            <span className="text-white font-black text-sm tracking-[0.2em] uppercase">{storeDisplayName || "MILANO"}</span>
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
            <button onClick={onOpenCart} className="relative text-white/60 hover:text-white transition" aria-label="Cart">
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
          <div className="md:hidden bg-[#111] border-t border-white/10 px-5 py-4 space-y-3 animate-fade-in">
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
                alt="Hero Editorial" className="w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0e0e0e] via-[#0e0e0e]/60 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex items-end pb-16 md:pb-24 max-w-7xl mx-auto px-5">
              <div className="max-w-xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-white/50 mb-4 sm:mb-6">SS-26 Editorial Collection</p>
                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.92] mb-6 sm:mb-8">
                  GET<br />
                  YOURSELF<br />
                  <span className="text-transparent" style={{ WebkitTextStroke: "2px rgba(255,255,255,0.7)" }}>
                    INTO THE
                  </span><br />
                  <span className="text-[#c9a96e]">{heroLines[heroIndex]}</span>
                </h1>
                <button onClick={() => setView("shop")}
                  className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.25em] text-white/80 hover:text-white transition group">
                  View Studio Collection
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
                  className="relative flex-shrink-0 w-44 sm:w-52 h-80 sm:h-96 overflow-hidden group border-l border-white/10 first:border-l-0 text-left">
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
                  <div className="absolute top-4 left-4 text-[10px] font-medium uppercase tracking-widest text-white/50">
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
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#c9a96e] mb-2">Latest Releases</p>
                <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">Studio New Drops</h2>
              </div>
              <button onClick={() => setView("shop")} className="text-[11px] font-bold uppercase tracking-widest text-[#c9a96e] hover:text-white transition flex items-center gap-2">
                All Products <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
              {catalogItems.map(item => (
                <div key={item.id} className="group bg-[#121212] rounded-2xl border border-white/10 overflow-hidden relative flex flex-col justify-between">
                  <div className="aspect-[3/4] overflow-hidden relative bg-[#1a1a1a] cursor-pointer" onClick={() => {
                    const p = { id: item.id, title: item.title, slug: item.id, description: item.subtitle, price: item.price, comparePrice: item.compare, imageUrl: item.img, badge: item.tag, variants: [] };
                    onOpenProduct(p);
                  }}>
                    <img src={item.img} alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-700 grayscale-[20%] group-hover:grayscale-0" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
                    <div className="absolute top-2.5 sm:top-4 left-2.5 sm:left-4 text-[9px] font-bold uppercase tracking-wider bg-white text-black px-2 py-0.5 rounded shadow-xs">
                      {item.label}
                    </div>
                    <button onClick={e => { e.stopPropagation(); handleWishlist(item.id); }}
                      className={`absolute top-2.5 sm:top-4 right-2.5 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border transition ${wishlistLocal.has(item.id) ? "bg-rose-500 border-rose-500 text-white" : "bg-black/40 border-white/20 text-white/70 hover:border-white hover:text-white"}`}>
                      <Heart className={`w-3.5 h-3.5 ${wishlistLocal.has(item.id) ? "fill-white" : ""}`} />
                    </button>
                    {/* Desktop Quick add overlay */}
                    <div className="hidden sm:block absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition translate-y-2 group-hover:translate-y-0 duration-300">
                      <button onClick={e => { e.stopPropagation(); handleAdd(item); }}
                        className={`w-full py-2 text-xs font-bold uppercase tracking-widest transition flex items-center justify-center gap-2 rounded-lg ${addedId === item.id ? "bg-emerald-500 text-white" : "bg-white text-black hover:bg-[#c9a96e]"}`}>
                        {addedId === item.id ? <><Check className="w-3.5 h-3.5" /> Added</> : <><ShoppingBag className="w-3.5 h-3.5" /> Quick Add</>}
                      </button>
                    </div>
                  </div>
                  <div className="p-2.5 sm:p-4 border-t border-white/5 flex flex-col justify-between flex-1">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#c9a96e] mb-1 line-clamp-1">{item.subtitle}</p>
                      <h3 className="text-xs sm:text-sm font-bold text-white mb-2 leading-tight line-clamp-1 sm:line-clamp-2">{item.title}</h3>
                    </div>
                    <div className="flex items-center justify-between gap-1.5 pt-1">
                      <div>
                        <span className="font-bold text-white text-xs sm:text-sm">৳{item.price.toLocaleString("en-BD")}</span>
                        {item.compare > item.price && (
                          <span className="text-[10px] sm:text-xs text-white/30 line-through ml-1 sm:ml-2">৳{item.compare.toLocaleString("en-BD")}</span>
                        )}
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); handleAdd(item); }}
                        className="sm:hidden px-2 py-1 rounded bg-white text-black text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 active:scale-95 transition"
                        aria-label="Add to bag"
                      >
                        {addedId === item.id ? <Check className="w-3 h-3 text-emerald-600" /> : <ShoppingBag className="w-3 h-3" />}
                        <span>{addedId === item.id ? "Done" : "Add"}</span>
                      </button>
                      <span className="hidden sm:inline-block text-[9.5px] font-medium uppercase tracking-wider px-2 py-0.5 border border-white/20 text-white/60 rounded">{item.tag}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Full-width editorial strip ────────────────────────── */}
          <section className="relative overflow-hidden h-56 sm:h-72">
            <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=85"
              alt="Editorial Banner" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-[#0e0e0e]/70 flex items-center justify-center">
              <div className="text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#c9a96e] mb-3">Autumn / Winter Atelier</p>
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
            <div className="max-w-7xl mx-auto px-5 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              {[
                { icon: <Truck className="w-5 h-5" />, title: "Steadfast Courier 24h", sub: "Dhaka & 64 Districts express dispatch" },
                { icon: <RotateCcw className="w-5 h-5" />, title: "Doorstep Inspection", sub: "Inspect fabric & fit before payment" },
                { icon: <ShieldCheck className="w-5 h-5" />, title: "Cash on Delivery & bKash", sub: "100% secure verified payment gateways" },
              ].map(t => (
                <div key={t.title} className="flex items-center gap-4 p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[#c9a96e] flex-shrink-0">{t.icon}</div>
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
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-white/40 mb-8">
              <button onClick={() => setView("home")} className="hover:text-white transition">Home</button>
              <span>/</span>
              <span className="text-white/80">Shop All</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">All Studio Products</h1>
              <div className="flex flex-wrap gap-2">
                {VERTICAL_CATEGORIES.map(c => (
                  <button key={c.id} onClick={() => setActiveCat(activeCat === c.id ? null : c.id)}
                    className={`px-3 sm:px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider border rounded-lg transition ${activeCat === c.id ? "bg-white text-black border-white" : "border-white/20 text-white/50 hover:border-white hover:text-white"}`}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
              {catalogItems.map(item => (
                <div key={item.id} className="group bg-[#121212] rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between">
                  <div className="aspect-[3/4] overflow-hidden relative bg-[#1a1a1a] cursor-pointer" onClick={() => {
                    const p = { id: item.id, title: item.title, slug: item.id, description: item.subtitle, price: item.price, comparePrice: item.compare, imageUrl: item.img, badge: item.tag, variants: [] };
                    onOpenProduct(p);
                  }}>
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-600" />
                    <div className="absolute top-2.5 left-2.5 text-[9px] font-bold uppercase tracking-wider bg-white text-black px-2 py-0.5 rounded">{item.label}</div>
                    <div className="hidden sm:block absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 opacity-0 group-hover:opacity-100 transition">
                      <button onClick={e => { e.stopPropagation(); handleAdd(item); }}
                        className={`w-full py-2 text-xs font-bold uppercase tracking-widest transition rounded-lg ${addedId === item.id ? "bg-emerald-500 text-white" : "bg-white text-black hover:bg-[#c9a96e]"}`}>
                        {addedId === item.id ? "Added ✓" : "Quick Add"}
                      </button>
                    </div>
                  </div>
                  <div className="p-2.5 sm:p-3.5 border-t border-white/5 flex flex-col justify-between flex-1">
                    <h3 className="text-xs sm:text-sm font-bold text-white mb-1.5 line-clamp-1">{item.title}</h3>
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="font-bold text-white text-xs sm:text-sm">৳{item.price.toLocaleString("en-BD")}</span>
                      {item.compare > item.price && <span className="text-[10px] sm:text-xs text-white/30 line-through">৳{item.compare.toLocaleString("en-BD")}</span>}
                      <button
                        onClick={e => { e.stopPropagation(); handleAdd(item); }}
                        className="sm:hidden px-2 py-1 rounded bg-white text-black text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 active:scale-95 transition"
                        aria-label="Add to bag"
                      >
                        {addedId === item.id ? <Check className="w-3 h-3 text-emerald-600" /> : <ShoppingBag className="w-3 h-3" />}
                        <span>{addedId === item.id ? "Done" : "Add"}</span>
                      </button>
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
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-white/40 mb-8">
              <button onClick={() => setView("home")} className="hover:text-white transition">Home</button>
              <span>/</span>
              <span className="text-white/80">Studio Lookbook</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight mb-4">SS-26 Studio Lookbook</h1>
            <p className="text-white/50 text-sm max-w-lg mb-10 leading-relaxed font-normal">
              High-GSM cotton essentials, oversized cuts, and structured silhouettes documented in Milan.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {LOOKBOOK_SHOTS.map((url, i) => (
                <div key={i} className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-zinc-900 group">
                  <img src={url} alt={`Lookbook ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-6">
                    <div>
                      <span className="text-xs font-bold text-[#c9a96e] uppercase tracking-wider block mb-1">Lookbook Shot 0{i + 1}</span>
                      <p className="text-white font-bold text-sm">Milan Atelier Cut & Drape</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 bg-[#080808] py-12 text-white/40 text-xs">
        <div className="max-w-7xl mx-auto px-5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
              <span className="text-black font-black text-[10px]">M</span>
            </div>
            <span className="text-white font-bold tracking-wider">{storeDisplayName || "MILANO"} Editorial Store</span>
          </div>
          <div className="flex items-center gap-6 text-[11px] font-medium text-white/60">
            <span>Steadfast 24h Express</span>
            <span>•</span>
            <span>Pathao Courier</span>
            <span>•</span>
            <span>Doorstep Trial (COD)</span>
            <span>•</span>
            <span>bKash & Nagad</span>
          </div>
          <p className="text-[11px] text-white/40">© {new Date().getFullYear()} {storeDisplayName}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
