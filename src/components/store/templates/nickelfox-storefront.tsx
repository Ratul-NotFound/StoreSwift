"use client";

import React, { useState } from "react";
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
  Flame
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

// ─── Data ──────────────────────────────────────────────────────────────────
const HERO_BRAND_NAV = ["Catalogue", "Streetwear", "Archive Drops", "Essentials"];

const LOCAL_TRUST_FEATURES = [
  { label: "STEADFAST 24-48H", sub: "Nationwide Express Dispatch" },
  { label: "PATHAO COURIER", sub: "Fast Doorstep Delivery" },
  { label: "OPEN PARCEL TRIAL", sub: "Doorstep Fit Inspection" },
  { label: "BKASH & NAGAD", sub: "Instant Verified Payment" },
  { label: "CASH ON DELIVERY", sub: "All 64 Districts Active" },
];

const CATEGORY_CARDS = [
  {
    id: "hoodies", title: "Heavyweight Hoodies", cta: "Explore Archive",
    img: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&auto=format&fit=crop&q=85",
  },
  {
    id: "coats", title: "Technical Parkas", cta: "Explore Outerwear",
    img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=85",
  },
  {
    id: "tees", title: "Box-Cut Graphic Tees", cta: "Shop 280 GSM",
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&auto=format&fit=crop&q=85",
  },
  {
    id: "dresses", title: "Structured Silhouettes", cta: "View Studio Cuts",
    img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=85",
  },
  {
    id: "accessories", title: "Caps & Leather Goods", cta: "Explore Accessories",
    img: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&auto=format&fit=crop&q=85",
  },
  {
    id: "sportswear", title: "Utility Cargo & Track", cta: "View Activewear",
    img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=85",
  },
];

const PRODUCTS = [
  {
    id: "nf1", title: "Acid Washed Boxy Crop Tee", cat: "Tops", price: 1650, compare: 2200, rating: 4.8, reviews: 38, badge: "Hot Drop",
    img: "https://images.unsplash.com/photo-1594938298603-c8148c4b5571?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "nf2", title: "Down-Insulated Oversized Puffer", cat: "Outerwear", price: 5850, compare: 7200, rating: 4.9, reviews: 52, badge: "Trending",
    img: "https://images.unsplash.com/photo-1517677129300-07b130802f46?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "nf3", title: "Heavyweight Studio Shearling Jacket", cat: "Outerwear", price: 6900, compare: 8500, rating: 4.9, reviews: 71, badge: "Archive",
    img: "https://images.unsplash.com/photo-1525450824786-227cbef70703?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "nf4", title: "450 GSM French Terry Hoodie", cat: "Hoodies", price: 3450, compare: 4200, rating: 4.8, reviews: 94, badge: "Essential",
    img: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "nf5", title: "Relaxed Wide-Leg Denim Trouser", cat: "Bottoms", price: 2950, compare: 3800, rating: 4.7, reviews: 43, badge: "Restocked",
    img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "nf6", title: "Corduroy Utility Overshirt", cat: "Shirts", price: 2800, compare: 3500, rating: 4.8, reviews: 61, badge: "New Season",
    img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "nf7", title: "Garment-Dyed Heavyweight Jogger", cat: "Bottoms", price: 2400, compare: 3100, rating: 4.9, reviews: 88, badge: "Hot Drop",
    img: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "nf8", title: "Tactical Crossbody Messenger", cat: "Accessories", price: 1850, compare: 2400, rating: 4.8, reviews: 29, badge: "Essential",
    img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80",
  },
];

const FAVOURITE_PRODUCTS = [
  {
    id: "fav1", title: "Enzyme Washed Oversized Tee", price: 1650, compare: 2100, rating: 4.8, reviews: 45,
    img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "fav2", title: "Selvedge Raw Denim Trucker", price: 4250, compare: 5400, rating: 4.9, reviews: 67,
    img: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "fav3", title: "Heavy Knit Modular Rib Set", price: 3200, compare: 4100, rating: 4.9, reviews: 112,
    img: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&auto=format&fit=crop&q=80",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
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
  const [wishlistLocal, setWishlistLocal] = useState<Set<string>>(new Set());
  const [addedId, setAddedId] = useState<string | null>(null);
  const [activeCat, setActiveCat] = useState("All");

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  const handleWishlist = (id: string) => {
    setWishlistLocal(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
    onToggleWishlist(id);
  };

  const handleAdd = (item: any) => {
    const prod = item.rawProduct || { id: item.id, title: item.title, slug: item.id, description: item.title, price: item.price, comparePrice: item.compare, imageUrl: item.img, badge: item.badge, variants: [] };
    const defaultVariant = (prod.variants && prod.variants[0]) || { sku: `${item.id}-default`, title: "Standard", price: item.price };
    onAddToCart(prod, defaultVariant);
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 1400);
  };

  const catalogItems = React.useMemo(() => {
    if (products && products.length > 0) {
      return products.map((p, idx) => ({
        id: p.id,
        title: p.title,
        cat: (p as any).category || (idx % 2 === 0 ? "Tops" : "Outerwear"),
        price: p.price,
        compare: p.comparePrice || Math.round(p.price * 1.3),
        rating: p.rating || 4.8,
        reviews: 32 + (idx * 6),
        badge: p.badge || (idx === 0 ? "Hot Drop" : idx === 1 ? "Trending" : "New"),
        img: p.imageUrl || "https://images.unsplash.com/photo-1594938298603-c8148c4b5571?w=600&auto=format&fit=crop&q=80",
        rawProduct: p
      }));
    }
    return PRODUCTS.map((item) => ({ ...item, rawProduct: null }));
  }, [products]);

  const NAV_CATS = ["All", ...Array.from(new Set(catalogItems.map(p => p.cat)))];
  const filteredProducts = activeCat === "All" ? catalogItems : catalogItems.filter(p => p.cat === activeCat);

  return (
    <div suppressHydrationWarning className="min-h-screen bg-[#faf8f5] text-zinc-950 font-sans antialiased selection:bg-amber-400 selection:text-zinc-950">

      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b-2 border-zinc-950 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <div className="flex items-center gap-2.5 flex-shrink-0 cursor-pointer" onClick={() => setView("home")}>
            <div className="w-8 h-8 bg-zinc-950 text-amber-400 border-2 border-zinc-950 rounded-lg flex items-center justify-center shadow-[2px_2px_0_0_#09090b]">
              <Zap className="w-4 h-4 fill-amber-400" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-tight uppercase text-zinc-950 leading-none">
                {storeDisplayName || "NICKELFOX"}
              </span>
              <span className="text-[9px] font-semibold text-zinc-500 uppercase tracking-widest mt-0.5">
                Avant-Garde Atelier
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {HERO_BRAND_NAV.map(item => (
              <button key={item}
                onClick={() => {
                  setActiveNav(item);
                  if (item === "Catalogue" || item === "Streetwear") setView("shop");
                  else if (item === "Archive Drops") setView("favourite");
                  else setView("home");
                }}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeNav === item
                    ? "bg-zinc-950 text-white shadow-[2px_2px_0_0_#f59e0b]"
                    : "text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100"
                }`}>
                {item}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {onOpenTrackOrder && (
              <button onClick={onOpenTrackOrder} className="hidden lg:flex items-center text-xs font-bold uppercase tracking-wider text-zinc-600 hover:text-zinc-950 transition px-2 py-1">
                Track Order
              </button>
            )}
            {onOpenCheckout && (
              <button onClick={onOpenCheckout} className="hidden sm:flex items-center gap-1.5 bg-zinc-950 text-amber-400 text-xs font-bold px-4 py-2 rounded-xl hover:bg-zinc-800 transition shadow-[2px_2px_0_0_#09090b] active:translate-y-0.5">
                <Truck className="w-3.5 h-3.5" />
                <span>Express Checkout</span>
              </button>
            )}
            <button onClick={onOpenSearch} className="p-2 rounded-xl hover:bg-zinc-100 transition text-zinc-700 hover:text-zinc-950" aria-label="Search">
              <Search className="w-4.5 h-4.5" />
            </button>
            <button className="p-2 rounded-xl hover:bg-zinc-100 transition hidden sm:flex text-zinc-700 hover:text-zinc-950" onClick={() => setView("favourite")} aria-label="Wishlist">
              <Heart className="w-4.5 h-4.5" />
            </button>
            <button onClick={onOpenCart} className="relative p-2 rounded-xl hover:bg-zinc-100 transition text-zinc-700 hover:text-zinc-950" aria-label="Cart">
              <ShoppingBag className="w-4.5 h-4.5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-zinc-950 text-amber-400 text-[10px] font-black rounded-full flex items-center justify-center border border-white">
                  {cartCount}
                </span>
              )}
            </button>
            <button className="md:hidden p-2 text-zinc-700" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t-2 border-zinc-950 bg-white px-4 py-3 space-y-1 animate-fade-in">
            {HERO_BRAND_NAV.map(item => (
              <button key={item} onClick={() => {
                setActiveNav(item);
                if (item === "Catalogue" || item === "Streetwear") setView("shop");
                else if (item === "Archive Drops") setView("favourite");
                else setView("home");
                setMobileMenuOpen(false);
              }}
                className="block w-full text-left py-2 text-sm font-bold text-zinc-900 hover:text-amber-600 transition">
                {item}
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
          {/* ── Hero Section ─────────────────────────────────────── */}
          <section className="bg-white border-b-2 border-zinc-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-0 min-h-[480px]">
              {/* Left: Text */}
              <div className="py-12 pr-4 sm:pr-8 flex flex-col justify-center">
                {/* Stars badge */}
                <div className="inline-flex items-center gap-1.5 mb-5 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-300 w-fit">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                  <span className="text-xs font-semibold text-zinc-800 ml-1">SS-26 Avant-Garde Collection</span>
                </div>

                <h1 className="text-3xl sm:text-5xl md:text-6xl font-black leading-[0.98] mb-4 sm:mb-6 text-zinc-950 tracking-tight uppercase">
                  ARCHIVE<br />
                  ESSENTIALS<br />
                  <span className="bg-amber-400 text-zinc-950 border-2 border-zinc-950 px-2 py-0.5 inline-block shadow-[3px_3px_0_0_#09090b] my-1">
                    HEAVYWEIGHT
                  </span><br />
                  STREETWEAR.
                </h1>
                <p className="text-xs sm:text-sm text-zinc-600 mb-6 sm:mb-8 max-w-md leading-relaxed font-normal">
                  Engineered heavyweight silhouettes, custom 450 GSM French Terry fleece, and garment-dyed textiles crafted for clean metropolitan durability.
                </p>
                <div className="flex gap-2.5 sm:gap-3 flex-wrap">
                  <button onClick={() => setView("shop")}
                    className="inline-flex items-center gap-2 bg-zinc-950 text-amber-400 font-bold text-xs sm:text-sm px-6 sm:px-8 py-3 rounded-xl hover:bg-zinc-800 transition shadow-[3px_3px_0_0_#f59e0b] active:translate-y-0.5">
                    SHOP ARCHIVE <ArrowRight className="w-4 h-4" />
                  </button>
                  <button onClick={() => setView("favourite")}
                    className="inline-flex items-center gap-2 border-2 border-zinc-950 bg-white text-zinc-950 font-bold text-xs sm:text-sm px-5 sm:px-6 py-3 rounded-xl hover:bg-zinc-100 transition shadow-[2px_2px_0_0_#09090b] active:translate-y-0.5">
                    Lookbook <Heart className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right: Hero Image */}
              <div className="relative border-t-2 md:border-t-0 md:border-l-2 border-zinc-950 min-h-[340px] sm:min-h-[420px] md:min-h-auto overflow-hidden bg-zinc-900">
                <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=85"
                  alt="Hero Streetwear Model" className="w-full h-full object-cover object-top" />
                <div className="absolute bottom-4 left-4 backdrop-blur-md bg-zinc-950/85 text-white text-[11px] font-semibold px-3.5 py-1.5 rounded-full border border-white/20 shadow-lg">
                  <span className="text-amber-400 font-bold">Drop 04</span> • Tokyo Oversized Cut
                </div>
              </div>
            </div>
          </section>

          {/* ── Authentic Trust Strip ────────────────── */}
          <section className="bg-zinc-950 text-white border-b-2 border-zinc-950 py-3 sm:py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-10 gap-y-2">
              {LOCAL_TRUST_FEATURES.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 cursor-default">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-white tracking-wide">{item.label}</span>
                  <span className="hidden sm:inline-block text-[11px] text-zinc-400 font-medium">• {item.sub}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── New Arrivals Section ─────────────────────────────── */}
          <section className="bg-white border-b-2 border-zinc-950 py-10 sm:py-14">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="flex items-end justify-between mb-6 sm:mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Flame className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">SS-26 Releases</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 uppercase tracking-tight">Studio New Arrivals</h2>
                </div>
                <button onClick={() => setView("shop")}
                  className="flex items-center gap-2 text-xs sm:text-sm font-bold text-zinc-950 hover:text-amber-600 border-b-2 border-zinc-950 pb-0.5 transition-all">
                  View Full Catalogue <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
                {PRODUCTS.slice(0, 8).map(item => (
                  <NickelFoxCard
                    key={item.id}
                    item={item}
                    wishlisted={wishlistLocal.has(item.id)}
                    added={addedId === item.id}
                    onWishlist={() => handleWishlist(item.id)}
                    onAdd={() => handleAdd(item)}
                    onView={() => {
                      const p = { id: item.id, title: item.title, slug: item.id, description: item.title, price: item.price, comparePrice: item.compare, imageUrl: item.img, badge: item.badge, variants: [] };
                      onOpenProduct(p);
                    }}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* ── Category Grid ────────────────────────────────────── */}
          <section className="bg-[#f5f2eb] py-12 border-b-2 border-zinc-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="mb-8">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 block mb-1">Curation</span>
                <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-zinc-950">Shop by Category</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5">
                {CATEGORY_CARDS.map(cat => (
                  <button key={cat.id} onClick={() => setView("shop")}
                    className="group relative overflow-hidden rounded-2xl border-2 border-zinc-950 aspect-square shadow-[3px_3px_0_0_#09090b] hover:shadow-[5px_5px_0_0_#09090b] transition-all text-left">
                    <img src={cat.img} alt={cat.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                      <h3 className="font-bold text-white text-sm sm:text-base leading-tight mb-1">{cat.title}</h3>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300">
                        {cat.cta} <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* ── Voucher Strip ────────────────────────────────────── */}
          <section className="bg-zinc-950 text-white py-10 border-b-2 border-zinc-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">VIP Community</p>
                <h3 className="text-2xl sm:text-3xl font-black">Unlock 10% Off Your First Order</h3>
                <p className="text-zinc-400 text-sm mt-1">Direct SMS dispatch notifications, early drop access, and private lookbooks.</p>
              </div>
              <button className="px-7 py-3 bg-amber-400 text-zinc-950 font-bold text-sm rounded-xl hover:bg-amber-300 transition flex items-center gap-2 shadow-[3px_3px_0_0_#ffffff] active:translate-y-0.5">
                <Tag className="w-4 h-4" /> Claim 10% Voucher
              </button>
            </div>
          </section>

          {/* ── Trust Row ────────────────────────────────────────── */}
          <section className="bg-white border-b-2 border-zinc-950 py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { icon: <Truck className="w-5 h-5" />, t: "Steadfast 24h Express", s: "Dhaka next-day & 64 districts nationwide" },
                { icon: <ShieldCheck className="w-5 h-5" />, t: "Doorstep Open Parcel", s: "Inspect fabric weight & fit before payment" },
                { icon: <RotateCcw className="w-5 h-5" />, t: "7-Day Easy Exchange", s: "Hassle-free size and silhouette swaps" },
              ].map(x => (
                <div key={x.t} className="flex items-center gap-4 p-4 rounded-xl border-2 border-zinc-950 bg-[#faf8f5] shadow-[3px_3px_0_0_#09090b]">
                  <div className="w-10 h-10 bg-zinc-950 text-amber-400 rounded-lg flex items-center justify-center flex-shrink-0">{x.icon}</div>
                  <div>
                    <p className="font-bold text-sm text-zinc-950">{x.t}</p>
                    <p className="text-xs text-zinc-600 mt-0.5">{x.s}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════
          SHOP / CATALOGUE VIEW
      ══════════════════════════════════════════════════════════════ */}
      {view === "shop" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-zinc-500 mb-6">
            <button onClick={() => setView("home")} className="hover:text-zinc-950 transition">Home</button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-zinc-950 font-bold">Full Catalogue</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-1">Permanent Archive</span>
              <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-zinc-950">All Streetwear</h1>
            </div>
            <span className="text-xs text-zinc-500 font-semibold">{filteredProducts.length} Articles Available</span>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            {NAV_CATS.map(cat => (
              <button key={cat} onClick={() => setActiveCat(cat)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold border-2 transition-all ${
                  activeCat === cat
                    ? "bg-zinc-950 text-amber-400 border-zinc-950 shadow-[2px_2px_0_0_#f59e0b]"
                    : "bg-white text-zinc-800 border-zinc-950 hover:bg-zinc-100"
                }`}>
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
            {filteredProducts.map(item => (
              <NickelFoxCard
                key={item.id}
                item={item}
                wishlisted={wishlistLocal.has(item.id)}
                added={addedId === item.id}
                onWishlist={() => handleWishlist(item.id)}
                onAdd={() => handleAdd(item)}
                onView={() => {
                  const p = { id: item.id, title: item.title, slug: item.id, description: item.title, price: item.price, comparePrice: item.compare, imageUrl: item.img, badge: item.badge, variants: [] };
                  onOpenProduct(p);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          FAVOURITE VIEW
      ══════════════════════════════════════════════════════════════ */}
      {view === "favourite" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <nav className="flex items-center gap-2 text-xs font-semibold text-zinc-500 mb-6">
            <button onClick={() => setView("home")} className="hover:text-zinc-950 transition">Home</button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-zinc-950 font-bold">Curated Archive</span>
          </nav>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight mb-8 text-zinc-950">Lookbook Favorites</h1>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {FAVOURITE_PRODUCTS.map(item => (
              <div key={item.id} className="bg-white rounded-2xl border-2 border-zinc-950 overflow-hidden shadow-[3px_3px_0_0_#09090b] hover:shadow-[5px_5px_0_0_#09090b] transition group">
                <div className="aspect-square overflow-hidden relative">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-zinc-950 text-sm mb-2">{item.title}</h3>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < Math.floor(item.rating) ? "fill-amber-400 text-amber-400" : "text-stone-200"}`} />)}
                    <span className="text-xs text-zinc-500 ml-1">({item.reviews} verified)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-zinc-950 text-sm">৳{item.price.toLocaleString("en-BD")}</span>
                      {item.compare > item.price && <span className="text-xs text-zinc-400 line-through ml-1.5">৳{item.compare.toLocaleString("en-BD")}</span>}
                    </div>
                    <button className="px-3.5 py-1.5 bg-zinc-950 text-amber-400 text-xs font-bold rounded-lg hover:bg-zinc-800 transition shadow-[2px_2px_0_0_#09090b]">
                      Add to Bag
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 p-8 bg-zinc-950 rounded-2xl text-center border-2 border-zinc-950">
            <p className="text-amber-400 font-bold text-lg mb-2">Explore the Full Studio Lookbook</p>
            <p className="text-zinc-400 text-xs mb-4">Discover heavyweight outerwear, selvedge denim, and seasonal accessories.</p>
            <button onClick={() => setView("shop")}
              className="inline-flex items-center gap-2 bg-amber-400 text-zinc-950 font-bold text-sm px-7 py-3 rounded-xl hover:bg-amber-300 transition shadow-[3px_3px_0_0_#ffffff]">
              Browse Catalogue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="bg-zinc-950 text-white border-t-2 border-zinc-950 pt-14 pb-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-amber-400 text-zinc-950 rounded-lg flex items-center justify-center font-bold">
                <Zap className="w-4 h-4 fill-zinc-950" />
              </div>
              <span className="font-black text-lg tracking-tight text-white uppercase">{storeDisplayName || "NICKELFOX"}</span>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed">Avant-garde streetwear engineered with heavyweight textiles, architectural drape, and durable construction.</p>
            <div className="flex gap-2.5 mt-5">
              {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                <button key={i} className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center transition border border-zinc-800">
                  <Icon className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">Catalogue</h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              {["Heavyweight Hoodies", "Technical Parkas", "Box-Cut Graphic Tees", "Selvedge Denim", "Crossbody Accessories"].map(l => (
                <li key={l}><button className="hover:text-white transition">{l}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">Customer Care</h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              {["Track Live Dispatch", "Doorstep Inspection Policy", "Size & Fit Guide", "Frequently Asked Questions", "Merchant Support"].map(l => (
                <li key={l}><button className="hover:text-white transition">{l}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">Bangladesh Dispatch</h4>
            <p className="text-xs text-zinc-400 mb-3">Steadfast 24-48h express nationwide, Pathao Courier, COD with open parcel inspection guarantee.</p>
            <div className="space-y-1.5 text-xs text-zinc-300">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-amber-400" />
                <span>64 Districts Doorstep Inspection</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-amber-400" />
                <span>Original Textile Quality Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
          <span>© {new Date().getFullYear()} {storeDisplayName}. All rights reserved. Powered by StoreSwift.</span>
          <div className="flex gap-5">
            {["Privacy Policy", "Terms of Service", "Return Protocol"].map(l => <button key={l} className="hover:text-zinc-300 transition">{l}</button>)}
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── NickelFox Product Card ───────────────────────────────────────────────────
function NickelFoxCard({
  item, wishlisted, added, onWishlist, onAdd, onView
}: {
  item: (typeof PRODUCTS)[0];
  wishlisted: boolean;
  added: boolean;
  onWishlist: () => void;
  onAdd: () => void;
  onView: () => void;
}) {
  const disc = Math.round(((item.compare - item.price) / item.compare) * 100);
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border-2 border-zinc-950 shadow-[3px_3px_0_0_#09090b] hover:shadow-[5px_5px_0_0_#09090b] transition-all duration-200 flex flex-col justify-between">
      <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 cursor-pointer" onClick={onView}>
        <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
        {item.badge && (
          <div className="absolute top-2 left-2 bg-amber-400 text-zinc-950 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border border-zinc-950 shadow-2xs">
            {item.badge}
          </div>
        )}
        {disc > 0 && (
          <div className="absolute top-2 right-2 bg-zinc-950 text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md">
            -{disc}%
          </div>
        )}
        <button onClick={e => { e.stopPropagation(); onWishlist(); }}
          className={`absolute bottom-2 right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border border-zinc-950 transition shadow ${wishlisted ? "bg-rose-500 text-white border-rose-500" : "bg-white text-zinc-950 hover:bg-amber-400"}`}>
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${wishlisted ? "fill-white" : ""}`} />
        </button>
      </div>
      <div className="p-2 sm:p-3 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-0.5">{item.cat}</p>
          <h3 className="text-xs sm:text-sm font-bold text-zinc-950 leading-snug line-clamp-1 sm:line-clamp-2 mb-1 cursor-pointer hover:text-amber-600 transition" onClick={onView}>{item.title}</h3>
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => <Star key={i} className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${i < Math.floor(item.rating) ? "fill-amber-400 text-amber-400" : "text-stone-200"}`} />)}
            <span className="text-[10px] text-zinc-500 ml-0.5">({item.reviews})</span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-1 pt-1 border-t border-zinc-100">
          <div>
            <span className="font-bold text-zinc-950 text-xs sm:text-sm">৳{item.price.toLocaleString("en-BD")}</span>
            {item.compare > item.price && <span className="text-[10px] sm:text-xs text-zinc-400 line-through ml-1">৳{item.compare.toLocaleString("en-BD")}</span>}
          </div>
          <button onClick={onAdd}
            className={`flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-bold border border-zinc-950 active:scale-95 transition ${added ? "bg-emerald-500 text-white border-emerald-500" : "bg-zinc-950 text-amber-400 hover:bg-zinc-800"}`}>
            {added ? <><Check className="w-3 h-3" /> <span className="hidden sm:inline">Added</span></> : <><ShoppingBag className="w-3 h-3" /> <span>Add</span></>}
          </button>
        </div>
      </div>
    </div>
  );
}
