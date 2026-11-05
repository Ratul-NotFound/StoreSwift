"use client";

import React, { useState, useMemo } from "react";
import {
  ShoppingBag,
  Search,
  Heart,
  ArrowRight,
  Menu,
  X,
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
  Phone,
  Sparkles,
  ArrowUpRight
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

// ─── Milanese Runway Departments ──────────────────────────────────────────────
const MILANO_DEPARTMENTS = [
  {
    id: "tailoring",
    label: "Sartorial Tailoring",
    sub: "Biella milled virgin wool",
    img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=85",
    count: "48 pieces"
  },
  {
    id: "knitwear",
    label: "Fine Gauge Knitwear",
    sub: "Grade-A Mongolian Cashmere",
    img: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&auto=format&fit=crop&q=85",
    count: "32 pieces"
  },
  {
    id: "leather",
    label: "Cuoio Leather Goods",
    sub: "Florentine vegetable tanned",
    img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=85",
    count: "24 pieces"
  },
  {
    id: "outerwear",
    label: "Archival Trench & Overcoats",
    sub: "Storm-resistant bonded gabardine",
    img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=85",
    count: "19 pieces"
  },
  {
    id: "footwear",
    label: "Artisanal Footwear",
    sub: "Goodyear welted Tuscan calfskin",
    img: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&auto=format&fit=crop&q=85",
    count: "28 pieces"
  }
];

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
  const [activeCat, setActiveCat] = useState<string>("All");
  const [wishlistLocal, setWishlistLocal] = useState<Set<string>>(new Set(wishlist));
  const [addedId, setAddedId] = useState<string | null>(null);

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  const catalogItems = useMemo(() => {
    if (products && products.length > 0) {
      return products.map((p, idx) => ({
        id: p.id,
        label: p.badge || (idx === 0 ? "RUNWAY EXCLUSIVE" : idx === 1 ? "BIELLA WOOL" : "LIMITED ATELIER"),
        title: p.title,
        subtitle: p.description ? (p.description.length > 40 ? p.description.slice(0, 40) + "..." : p.description) : "Milled Virgin Wool & Silk",
        price: p.price,
        compare: p.comparePrice || Math.round(p.price * 1.35),
        tag: idx === 0 ? "Limited Runway" : "In Stock",
        img: p.imageUrl || "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=700&auto=format&fit=crop&q=85",
        rawProduct: p
      }));
    }
    return [
      {
        id: "m1",
        label: "RUNWAY EXCLUSIVE",
        title: "Double-Breasted Cashmere Overcoat",
        subtitle: "100% Mongolian Cashmere • Milanese Cut",
        price: 18500,
        compare: 24000,
        tag: "Runway Piece",
        img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=700&auto=format&fit=crop&q=85",
        rawProduct: null
      },
      {
        id: "m2",
        label: "BIELLA WOOL",
        title: "Structured Relaxed Blazer",
        subtitle: "Italian Biella Tropical Wool S'130",
        price: 14200,
        compare: 17500,
        tag: "In Stock",
        img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=700&auto=format&fit=crop&q=85",
        rawProduct: null
      },
      {
        id: "m3",
        label: "LIMITED ATELIER",
        title: "Fine Gauge Merino Turtleneck",
        subtitle: "Extra-Fine 19.5 Micron Merino Knit",
        price: 5800,
        compare: 7200,
        tag: "Atelier Drop",
        img: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=700&auto=format&fit=crop&q=85",
        rawProduct: null
      },
      {
        id: "m4",
        label: "FLORENTINE LEATHER",
        title: "Pebbled Calfskin Holdall",
        subtitle: "Hand-Burnished Vegetable Tanned Leather",
        price: 16800,
        compare: 21000,
        tag: "Hand-Crafted",
        img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=700&auto=format&fit=crop&q=85",
        rawProduct: null
      }
    ];
  }, [products]);

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
      description: item.subtitle,
      price: item.price,
      comparePrice: item.compare,
      imageUrl: item.img,
      badge: item.tag,
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

  return (
    <div suppressHydrationWarning className="min-h-screen bg-[#0c0c0e] text-zinc-100 font-sans antialiased selection:bg-[#c9a96e] selection:text-black">

      {/* ── Editorial Top Header ────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#0c0c0e]/95 backdrop-blur-md border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setView("home")}
          >
            <div className="w-7 h-7 rounded-sm bg-[#c9a96e] flex items-center justify-center text-black font-black text-xs font-serif shadow-xs group-hover:scale-105 transition-transform">
              M
            </div>
            <div>
              <span className="text-white font-serif tracking-[0.25em] text-sm uppercase font-bold block leading-none">
                {storeDisplayName || "MILANO"}
              </span>
              <span className="text-[9px] font-mono text-zinc-400 tracking-widest uppercase block mt-1">
                Collezione Milano
              </span>
            </div>
          </div>

          {/* Runway Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-[11px] font-mono font-medium tracking-[0.2em] uppercase text-zinc-400">
            <button
              onClick={() => setView("home")}
              className={`hover:text-white transition ${view === "home" ? "text-white font-bold" : ""}`}
            >
              Collection
            </button>
            <button
              onClick={() => setView("shop")}
              className={`hover:text-white transition ${view === "shop" ? "text-white font-bold" : ""}`}
            >
              Catalog
            </button>
            <button
              onClick={() => setView("lookbook")}
              className={`hover:text-white transition ${view === "lookbook" ? "text-white font-bold" : ""}`}
            >
              Runway Edit
            </button>
          </nav>

          {/* Action Bar */}
          <div className="flex items-center space-x-3">
            {onOpenTrackOrder && (
              <button
                onClick={onOpenTrackOrder}
                className="hidden lg:flex items-center text-[10.5px] uppercase font-mono tracking-widest text-zinc-400 hover:text-white transition"
              >
                Track Consignment
              </button>
            )}

            {onOpenCheckout && (
              <button
                onClick={onOpenCheckout}
                className="hidden sm:flex items-center space-x-1.5 bg-[#c9a96e] hover:bg-[#d8b97d] text-black text-[10px] uppercase font-mono font-bold tracking-widest px-3.5 py-2 rounded-sm transition shadow-sm"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Express COD</span>
              </button>
            )}

            <button
              onClick={onOpenSearch}
              className="p-2 rounded-lg text-zinc-400 hover:text-white transition"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-lg text-zinc-300 hover:text-white transition flex items-center space-x-1"
              aria-label="Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#c9a96e] text-black text-[9px] font-black flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              className="md:hidden p-2 text-zinc-400 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#121216] border-t border-white/10 px-5 py-4 space-y-2 text-xs font-mono uppercase tracking-widest">
            <button
              onClick={() => { setView("home"); setMobileMenuOpen(false); }}
              className="block w-full text-left py-2 text-zinc-300 hover:text-white"
            >
              Collection
            </button>
            <button
              onClick={() => { setView("shop"); setMobileMenuOpen(false); }}
              className="block w-full text-left py-2 text-zinc-300 hover:text-white"
            >
              Catalog
            </button>
            <button
              onClick={() => { setView("lookbook"); setMobileMenuOpen(false); }}
              className="block w-full text-left py-2 text-zinc-300 hover:text-white"
            >
              Runway Edit
            </button>
          </div>
        )}
      </header>

      {/* ══════════════════════════════════════════════════════════════════
          HOME RUNWAY VIEW
      ══════════════════════════════════════════════════════════════════ */}
      {view === "home" && (
        <>
          {/* ── Full-Bleed Milanese Editorial Hero ──────────────────────────── */}
          <section className="relative min-h-[580px] sm:min-h-[680px] overflow-hidden flex items-end">
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1600&auto=format&fit=crop&q=90"
                alt="Milan Runway"
                className="w-full h-full object-cover object-center brightness-[0.7]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-[#0c0c0e]/50 to-transparent" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-5 pb-16 sm:pb-24 w-full">
              <div className="max-w-xl space-y-4">
                <span className="text-[11px] font-mono uppercase tracking-[0.35em] text-[#c9a96e] block">
                  Collezione Autunno / Inverno
                </span>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-light font-serif tracking-tight text-white leading-tight">
                  Sartorial Streetwear & Heavyweight Tailoring
                </h1>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans max-w-lg">
                  Direct from Milanese and Biella mills. Certified virgin wool, Mongolian cashmere knitwear, and hand-lasted calfskin footwear with doorstep inspection.
                </p>

                <div className="pt-2 flex flex-wrap gap-3 font-mono text-xs">
                  <button
                    onClick={() => setView("shop")}
                    className="py-3 px-6 bg-[#c9a96e] hover:bg-[#d8b97d] text-black font-bold uppercase tracking-wider rounded-sm transition flex items-center space-x-2"
                  >
                    <span>EXPLORE RUNWAY CATALOG</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setView("lookbook")}
                    className="py-3 px-5 bg-black/60 hover:bg-black border border-white/20 text-white font-semibold uppercase tracking-wider rounded-sm transition"
                  >
                    <span>VIEW RUNWAY LOOKBOOK</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ── Horizontal Department Runway Carousel (Clean Horizontal, NO Vertical Text) ── */}
          <section className="py-12 border-b border-white/[0.08] bg-[#0f0f13]">
            <div className="max-w-7xl mx-auto px-5 mb-6 flex items-end justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#c9a96e] block mb-1">
                  Atelier Departments
                </span>
                <h2 className="text-xl sm:text-2xl font-serif text-white uppercase tracking-tight">
                  Milanese Ready-To-Wear
                </h2>
              </div>
              <span className="text-xs font-mono text-zinc-400">5 Curated Disciplines</span>
            </div>

            <div className="max-w-7xl mx-auto px-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {MILANO_DEPARTMENTS.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => { setActiveCat(dept.label); setView("shop"); }}
                  className="group relative rounded-xl overflow-hidden aspect-[3/4] border border-white/10 text-left bg-zinc-900 transition hover:border-[#c9a96e]/50"
                >
                  <img
                    src={dept.img}
                    alt={dept.label}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-75 group-hover:opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  
                  <div className="absolute bottom-3 left-3 right-3 space-y-0.5">
                    <span className="text-[9px] font-mono text-[#c9a96e] uppercase tracking-wider block">
                      {dept.count}
                    </span>
                    <h3 className="text-xs font-serif font-bold text-white leading-tight">
                      {dept.label}
                    </h3>
                    <p className="text-[10px] text-zinc-400 font-sans truncate">
                      {dept.sub}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* ── Runway Drops Grid ─────────────────────────────────────────────── */}
          <section className="py-16 max-w-7xl mx-auto px-5">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500 block mb-1">
                  Limited Atelier Drops
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif text-white uppercase tracking-tight">
                  Runway Edition
                </h2>
              </div>
              <button
                onClick={() => setView("shop")}
                className="text-xs font-mono text-[#c9a96e] hover:text-white transition flex items-center space-x-1"
              >
                <span>COMPLETE CATALOG</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile 1st 2-Column Responsive Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
              {catalogItems.map((item) => (
                <MilanoProductCard
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
                      description: item.subtitle,
                      price: item.price,
                      comparePrice: item.compare,
                      imageUrl: item.img,
                      badge: item.tag,
                      variants: []
                    };
                    onOpenProduct(p);
                  }}
                />
              ))}
            </div>
          </section>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          SHOP VIEW
      ══════════════════════════════════════════════════════════════════ */}
      {view === "shop" && (
        <div className="max-w-7xl mx-auto px-5 py-10">
          <div className="flex items-center space-x-2 text-xs font-mono text-zinc-500 mb-6">
            <button onClick={() => setView("home")} className="hover:text-zinc-300">Home</button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-zinc-200">Milano Catalogue</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-serif font-light uppercase tracking-tight text-white">
              Sartorial Archive
            </h1>
            <p className="text-xs text-zinc-400 mt-1 font-sans">
              Precision Italian cuts with nationwide COD trial and Steadfast express logistics.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
            {catalogItems.map((item) => (
              <MilanoProductCard
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
                    description: item.subtitle,
                    price: item.price,
                    comparePrice: item.compare,
                    imageUrl: item.img,
                    badge: item.tag,
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
          LOOKBOOK VIEW
      ══════════════════════════════════════════════════════════════════ */}
      {view === "lookbook" && (
        <div className="max-w-7xl mx-auto px-5 py-10">
          <div className="flex items-center space-x-2 text-xs font-mono text-zinc-500 mb-6">
            <button onClick={() => setView("home")} className="hover:text-zinc-300">Home</button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-zinc-200">Runway Lookbook</span>
          </div>

          <div className="mb-10 text-center max-w-xl mx-auto space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.35em] text-[#c9a96e]">
              Editorial Visuals
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif text-white uppercase">
              Autumn / Winter Runway
            </h1>
            <p className="text-xs text-zinc-400">
              Shot on location in Milan and Como. Captured in pure natural daylight to exhibit textile drape and weave density.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=85",
              "https://images.unsplash.com/photo-1550614000-4895a10e1bfd?w=800&auto=format&fit=crop&q=85",
              "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=85"
            ].map((img, i) => (
              <div key={i} className="aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 relative group">
                <img src={img} alt={`Look ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono">
                  <span className="text-[#c9a96e]">LOOK 0{i + 1}</span>
                  <span className="text-zinc-300">RUNWAY ARCHIVE</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.08] bg-[#08080a] py-12 text-xs font-mono text-zinc-500">
        <div className="max-w-7xl mx-auto px-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <span className="font-serif text-sm font-bold text-white uppercase block mb-2">
              {storeDisplayName || "MILANO"}
            </span>
            <p className="text-zinc-400 leading-relaxed font-sans text-xs">
              Milanese sartorial streetwear house with verified courier COD across Bangladesh.
            </p>
          </div>
          <div>
            <h4 className="text-zinc-300 font-bold uppercase mb-2">Logistics</h4>
            <p className="text-zinc-400 font-sans text-xs">
              Steadfast 24–48h Nationwide. Doorstep try-on and fit guarantee.
            </p>
          </div>
          <div>
            <h4 className="text-zinc-300 font-bold uppercase mb-2">Payment Verification</h4>
            <p className="text-zinc-400 font-sans text-xs">
              Cash on delivery, bKash, and Nagad digital tokenization.
            </p>
          </div>
          <div>
            <h4 className="text-zinc-300 font-bold uppercase mb-2">Atelier Hub</h4>
            <p className="text-zinc-400 font-sans text-xs">
              Dhaka Flagship • Banani Avenue. Open 11:00 AM – 9:00 PM.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-5 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] gap-2">
          <span>© {new Date().getFullYear()} {storeDisplayName}. All rights reserved.</span>
          <span className="text-zinc-400">Milanese Editorial Standard</span>
        </div>
      </footer>
    </div>
  );
}

// ─── Reusable Milano Product Card ──────────────────────────────────────────────
function MilanoProductCard({
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
  return (
    <div className="group rounded-2xl bg-[#121216] border border-white/10 hover:border-[#c9a96e]/40 transition overflow-hidden flex flex-col justify-between">
      {/* 3:4 Portrait Ratio */}
      <div className="relative aspect-[3/4] overflow-hidden bg-black cursor-pointer" onClick={onView}>
        <img
          src={item.img}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
        />

        {item.label && (
          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-sm bg-black/80 backdrop-blur-md border border-white/10 text-[9px] font-mono uppercase tracking-wider text-[#c9a96e]">
            {item.label}
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
              : "bg-black/60 border-white/20 text-zinc-300 hover:text-white"
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${wishlisted ? "fill-white" : ""}`} />
        </button>
      </div>

      <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <h3
            onClick={onView}
            className="text-xs sm:text-sm font-serif text-white line-clamp-1 cursor-pointer hover:text-[#c9a96e] transition"
          >
            {item.title}
          </h3>
          <p className="text-[10px] text-zinc-400 font-sans truncate mt-0.5">
            {item.subtitle}
          </p>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-white/5">
          <div>
            <span className="text-xs sm:text-sm font-bold font-mono text-white">
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
            className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded text-[10px] sm:text-xs font-mono uppercase tracking-wider transition flex items-center space-x-1 ${
              added
                ? "bg-emerald-500 text-black font-bold"
                : "bg-[#c9a96e] hover:bg-[#d8b97d] text-black font-bold"
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
