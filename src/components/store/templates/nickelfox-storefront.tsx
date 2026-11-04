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
const HERO_BRAND_NAV = ["Catalogue", "Fashion", "Favourite", "Lifestyle"];

const BRAND_LOGOS = ["H&M", "OBEY", "Shopify", "LACOSTE", "Levi's", "amazon"];

const CATEGORY_CARDS = [
  {
    id: "hoodies", title: "Hoodies & Sweatshirt", cta: "Explore Now",
    img: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&auto=format&fit=crop&q=85",
    color: "bg-orange-400",
  },
  {
    id: "coats", title: "Coats & Parkas", cta: "Explore Now",
    img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=85",
    color: "bg-blue-400",
  },
  {
    id: "tees", title: "Tees & T-Shirt", cta: "Explore Now",
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&auto=format&fit=crop&q=85",
    color: "bg-purple-400",
  },
  {
    id: "dresses", title: "Dresses & Skirts", cta: "Explore Now",
    img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=85",
    color: "bg-pink-400",
  },
  {
    id: "accessories", title: "Accessories", cta: "Explore Now",
    img: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&auto=format&fit=crop&q=85",
    color: "bg-emerald-400",
  },
  {
    id: "sportswear", title: "Sportswear", cta: "Explore Now",
    img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=85",
    color: "bg-amber-400",
  },
];

const PRODUCTS = [
  {
    id: "nf1", title: "Tie-Dye Crop Top", cat: "Tops", price: 48, compare: 68, rating: 4.6, reviews: 38, badge: "Hot",
    img: "https://images.unsplash.com/photo-1594938298603-c8148c4b5571?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "nf2", title: "Oversized Puffer", cat: "Outerwear", price: 185, compare: 245, rating: 4.8, reviews: 52, badge: "Trending",
    img: "https://images.unsplash.com/photo-1517677129300-07b130802f46?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "nf3", title: "Pink Fur Jacket", cat: "Outerwear", price: 225, compare: 300, rating: 4.9, reviews: 71, badge: "Premium",
    img: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "nf4", title: "Bold Striped Set", cat: "Sets", price: 120, compare: 165, rating: 4.7, reviews: 27, badge: "New",
    img: "https://images.unsplash.com/photo-1550639524-a005a5b4e0af?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "nf5", title: "Yellow Graphic Tee", cat: "Tops", price: 42, compare: 58, rating: 4.5, reviews: 44, badge: "Sale",
    img: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "nf6", title: "Wide Leg Jeans", cat: "Bottoms", price: 95, compare: 130, rating: 4.7, reviews: 33, badge: "New",
    img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "nf7", title: "Floral Mini Dress", cat: "Dresses", price: 78, compare: 108, rating: 4.8, reviews: 61, badge: "Bestseller",
    img: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "nf8", title: "Leather Crossbody", cat: "Accessories", price: 135, compare: 180, rating: 4.9, reviews: 88, badge: "Hot",
    img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80",
  },
];

const FAVOURITE_PRODUCTS = [
  {
    id: "fav1", title: "Spring Floral Blouse", price: 62, compare: 85, rating: 4.8, reviews: 94,
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "fav2", title: "Casual Denim Jacket", price: 145, compare: 195, rating: 4.7, reviews: 67,
    img: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "fav3", title: "Minimal White Set", price: 110, compare: 150, rating: 4.9, reviews: 112,
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
        badge: p.badge || (idx === 0 ? "Hot" : idx === 1 ? "Trending" : "New"),
        img: p.imageUrl || "https://images.unsplash.com/photo-1594938298603-c8148c4b5571?w=600&auto=format&fit=crop&q=80",
        rawProduct: p
      }));
    }
    return PRODUCTS.map((item) => ({ ...item, rawProduct: null }));
  }, [products]);

  const NAV_CATS = ["All", ...Array.from(new Set(catalogItems.map(p => p.cat)))];
  const filteredProducts = activeCat === "All" ? catalogItems : catalogItems.filter(p => p.cat === activeCat);

  return (
    <div className="min-h-screen bg-[#f7f500] text-black font-sans antialiased">

      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white border-b-4 border-black shadow-[0_4px_0_0_#000]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0 cursor-pointer" onClick={() => setView("home")}>
            <div className="w-7 h-7 bg-[#f7f500] border-2 border-black rounded flex items-center justify-center">
              <Zap className="w-4 h-4 text-black" />
            </div>
            <span className="font-black text-xl tracking-tight text-black">FASHION</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {HERO_BRAND_NAV.map(item => (
              <button key={item}
                onClick={() => {
                  setActiveNav(item);
                  if (item === "Catalogue" || item === "Fashion") setView("shop");
                  else if (item === "Favourite") setView("favourite");
                  else setView("home");
                }}
                className={`px-4 py-1.5 text-sm font-bold rounded transition ${activeNav === item ? "bg-black text-[#f7f500]" : "text-black hover:bg-black/10"}`}>
                {item}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {onOpenTrackOrder && (
              <button onClick={onOpenTrackOrder} className="hidden lg:flex items-center text-xs font-black uppercase text-black hover:opacity-75 transition px-2 py-1">
                Track Order
              </button>
            )}
            {onOpenCheckout && (
              <button onClick={onOpenCheckout} className="hidden sm:flex items-center gap-1.5 bg-black text-[#f7f500] text-xs font-black px-4 py-2 rounded-full hover:bg-neutral-800 transition shadow-[2px_2px_0_0_#000]">
                <Truck className="w-3.5 h-3.5" />
                <span>Express Checkout</span>
              </button>
            )}
            <button onClick={onOpenSearch} className="p-2 rounded-full hover:bg-black/10 transition">
              <Search className="w-4.5 h-4.5" />
            </button>
            <button className="p-2 rounded-full hover:bg-black/10 transition hidden sm:flex" onClick={() => setView("favourite")}>
              <Heart className="w-4.5 h-4.5" />
            </button>
            <button onClick={onOpenCart} className="relative p-2 rounded-full hover:bg-black/10 transition">
              <ShoppingBag className="w-4.5 h-4.5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-black text-[#f7f500] text-[10px] font-black rounded-full flex items-center justify-center">{cartCount}</span>
              )}
            </button>
            <button className="hidden sm:flex items-center gap-2 bg-black text-[#f7f500] text-xs font-black px-4 py-2 rounded-full hover:bg-neutral-800 transition">
              SIGN UP
            </button>
            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t-2 border-black bg-white px-4 py-3 space-y-1">
            {HERO_BRAND_NAV.map(item => (
              <button key={item} onClick={() => {
                setActiveNav(item);
                if (item === "Catalogue" || item === "Fashion") setView("shop");
                else if (item === "Favourite") setView("favourite");
                else setView("home");
                setMobileMenuOpen(false);
              }}
                className="block w-full text-left py-2 text-sm font-bold text-black hover:text-neutral-600 transition">
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
          <section className="bg-white border-b-4 border-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-0 min-h-[480px]">
              {/* Left: Text */}
              <div className="py-12 pr-8 flex flex-col justify-center">
                {/* Stars badge */}
                <div className="inline-flex items-center gap-1.5 mb-5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-[#f7f500] text-[#f7f500]" />)}
                  <span className="text-xs font-bold text-black ml-1">Live for influential fashion</span>
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] mb-6 text-black">
                  LET'S<br />
                  EXPLORE<br />
                  <span className="bg-[#f7f500] border-b-4 border-black px-1">UNIQUE</span><br />
                  CLOTHES.
                </h1>
                <p className="text-sm text-neutral-600 mb-8 max-w-xs font-medium">
                  Live for influential and innovative fashion! Find your unique style from thousands of curated pieces.
                </p>
                <div className="flex gap-3 flex-wrap">
                  <button onClick={() => setView("shop")}
                    className="inline-flex items-center gap-2 bg-black text-[#f7f500] font-black text-sm px-8 py-3 rounded-full hover:bg-neutral-800 transition shadow-[4px_4px_0_0_#f7f500]">
                    SHOP NOW <ArrowRight className="w-4 h-4" />
                  </button>
                  <button onClick={() => setView("favourite")}
                    className="inline-flex items-center gap-2 border-2 border-black bg-white text-black font-black text-sm px-6 py-3 rounded-full hover:bg-[#f7f500] transition">
                    Favourites <Heart className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right: Hero Image */}
              <div className="relative border-l-4 border-black min-h-[360px] md:min-h-auto overflow-hidden">
                <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=85"
                  alt="Hero model" className="w-full h-full object-cover object-top" />
                {/* Floating star cluster */}
                <div className="absolute top-6 right-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className={`absolute text-[#f7f500] font-black text-2xl ${i === 0 ? "top-0 right-0" : i === 1 ? "top-3 right-8" : "top-8 right-2"}`}>★</div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── Brand Logos Bar ───────────────────────────────────── */}
          <section className="bg-[#f7f500] border-b-4 border-black py-5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-2">
              {BRAND_LOGOS.map(brand => (
                <span key={brand} className="text-xl font-black text-black/30 hover:text-black transition cursor-default tracking-tight">{brand}</span>
              ))}
            </div>
          </section>

          {/* ── New Arrivals Section ─────────────────────────────── */}
          <section className="bg-white border-b-4 border-black py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Flame className="w-4 h-4 text-black" />
                    <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-black/40">Just In</span>
                  </div>
                  <h2 className="text-4xl font-black text-black uppercase tracking-tight">NEW ARRIVALS</h2>
                </div>
                <button onClick={() => setView("shop")}
                  className="flex items-center gap-2 text-sm font-black text-black border-b-2 border-black pb-0.5 hover:gap-3 transition-all">
                  View All <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
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
          <section className="bg-[#f7f500] py-12 border-b-4 border-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <h2 className="text-4xl font-black uppercase tracking-tight mb-8">Shop by Category</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {CATEGORY_CARDS.map(cat => (
                  <button key={cat.id} onClick={() => setView("shop")}
                    className="group relative overflow-hidden rounded-2xl border-4 border-black aspect-square hover:shadow-[8px_8px_0_0_#000] transition-shadow">
                    <img src={cat.img} alt={cat.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-400" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-black text-white text-sm leading-tight mb-1">{cat.title}</h3>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white/80">
                        {cat.cta} <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* ── Voucher Strip ────────────────────────────────────── */}
          <section className="bg-black text-[#f7f500] py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#f7f500]/50 mb-1">Join Today</p>
                <h3 className="text-2xl font-black">Get a 10% Voucher!</h3>
                <p className="text-[#f7f500]/60 text-sm mt-1">Sign up and instantly unlock your welcome discount.</p>
              </div>
              <button className="px-8 py-3 bg-[#f7f500] text-black font-black text-sm rounded-full hover:bg-yellow-300 transition flex items-center gap-2 shadow-[0_0_0_3px_rgba(247,245,0,0.3)]">
                <Tag className="w-4 h-4" /> Claim Voucher
              </button>
            </div>
          </section>

          {/* ── Trust Row ────────────────────────────────────────── */}
          <section className="bg-white border-b-4 border-black py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { icon: <Truck className="w-5 h-5" />, t: "Free Shipping", s: "On orders above ৳1,500" },
                { icon: <ShieldCheck className="w-5 h-5" />, t: "Secure Payment", s: "100% protected checkout" },
                { icon: <RotateCcw className="w-5 h-5" />, t: "Easy Returns", s: "30-day hassle-free returns" },
              ].map(x => (
                <div key={x.t} className="flex items-center gap-4 p-4 bg-[#f7f500] rounded-xl border-2 border-black">
                  <div className="w-10 h-10 bg-black text-[#f7f500] rounded-full flex items-center justify-center flex-shrink-0">{x.icon}</div>
                  <div>
                    <p className="font-black text-sm text-black">{x.t}</p>
                    <p className="text-xs text-black/60 mt-0.5">{x.s}</p>
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
          <nav className="flex items-center gap-2 text-xs font-bold text-black/40 mb-6">
            <button onClick={() => setView("home")} className="hover:text-black transition">Home</button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-black">Catalogue</span>
          </nav>

          <h1 className="text-5xl font-black uppercase tracking-tight mb-8">All Products</h1>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            {NAV_CATS.map(cat => (
              <button key={cat} onClick={() => setActiveCat(cat)}
                className={`px-5 py-2 rounded-full text-sm font-black border-2 transition ${activeCat === cat ? "bg-black text-[#f7f500] border-black" : "bg-white text-black border-black hover:bg-[#f7f500]"}`}>
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
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
          <nav className="flex items-center gap-2 text-xs font-bold text-black/40 mb-6">
            <button onClick={() => setView("home")} className="hover:text-black transition">Home</button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-black">Favourites</span>
          </nav>
          <h1 className="text-5xl font-black uppercase tracking-tight mb-8">Favourites</h1>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {FAVOURITE_PRODUCTS.map(item => (
              <div key={item.id} className="bg-white rounded-2xl border-4 border-black overflow-hidden hover:shadow-[8px_8px_0_0_#f7f500] transition group">
                <div className="aspect-square overflow-hidden relative">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-400" />
                </div>
                <div className="p-4">
                  <h3 className="font-black text-black text-sm mb-2">{item.title}</h3>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < Math.floor(item.rating) ? "fill-[#f7f500] text-[#f7f500]" : "text-stone-200"}`} />)}
                    <span className="text-[10px] text-black/40 ml-1">({item.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-black text-black">${item.price}</span>
                      {item.compare > item.price && <span className="text-xs text-black/30 line-through ml-1">${item.compare}</span>}
                    </div>
                    <button className="px-3 py-1.5 bg-black text-[#f7f500] text-xs font-black rounded-full hover:bg-neutral-800 transition">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 p-6 bg-black rounded-2xl text-center">
            <p className="text-[#f7f500] font-black text-lg mb-3">Discover More Styles</p>
            <button onClick={() => setView("shop")}
              className="inline-flex items-center gap-2 bg-[#f7f500] text-black font-black text-sm px-8 py-3 rounded-full hover:bg-yellow-300 transition">
              Browse Catalogue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="bg-black text-white border-t-4 border-[#f7f500] pt-14 pb-8 mt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-[#f7f500] border-2 border-[#f7f500] rounded flex items-center justify-center">
                <Zap className="w-4 h-4 text-black" />
              </div>
              <span className="font-black text-xl tracking-tight text-[#f7f500]">FASHION</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed">Bold style for bold people. Fashion that speaks before you do.</p>
            <div className="flex gap-3 mt-5">
              {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                <button key={i} className="w-8 h-8 rounded-full bg-[#f7f500]/10 hover:bg-[#f7f500]/20 text-[#f7f500] flex items-center justify-center transition">
                  <Icon className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#f7f500]/50 mb-4">Catalogue</h4>
            <ul className="space-y-2.5">
              {["Hoodies & Sweatshirt", "Coats & Parkas", "Tees & T-Shirts", "Dresses", "Accessories"].map(l => (
                <li key={l}><button className="text-sm text-white/50 hover:text-white transition">{l}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#f7f500]/50 mb-4">Help</h4>
            <ul className="space-y-2.5">
              {["Track Order", "Returns Policy", "Size Guide", "FAQs", "Contact Us"].map(l => (
                <li key={l}><button className="text-sm text-white/50 hover:text-white transition">{l}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#f7f500]/50 mb-4">Get the App</h4>
            <p className="text-sm text-white/40 mb-4">Exclusive app deals inside. Download now.</p>
            <div className="space-y-2">
              {["App Store", "Google Play"].map(l => (
                <button key={l} className="w-full text-left px-4 py-2.5 rounded-xl border border-white/10 text-sm font-bold text-white hover:border-[#f7f500]/40 hover:bg-[#f7f500]/5 transition">
                  📱 {l}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
          <span>© {new Date().getFullYear()} {storeDisplayName}. All rights reserved.</span>
          <div className="flex gap-5">
            {["Privacy", "Terms", "Cookies"].map(l => <button key={l} className="hover:text-white transition">{l}</button>)}
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
    <div className="group bg-white rounded-2xl overflow-hidden border-4 border-black hover:shadow-[6px_6px_0_0_#000] transition duration-200">
      <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 cursor-pointer" onClick={onView}>
        <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-400" />
        {item.badge && (
          <div className="absolute top-2 left-2 bg-[#f7f500] text-black text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border-2 border-black">
            {item.badge}
          </div>
        )}
        {disc > 0 && (
          <div className="absolute top-2 right-2 bg-black text-[#f7f500] text-[10px] font-black px-2 py-0.5 rounded-full">
            -{disc}%
          </div>
        )}
        <button onClick={e => { e.stopPropagation(); onWishlist(); }}
          className={`absolute bottom-2 right-2 w-8 h-8 rounded-full flex items-center justify-center border-2 border-black transition shadow ${wishlisted ? "bg-rose-500 text-white border-rose-500" : "bg-white text-black hover:bg-[#f7f500]"}`}>
          <Heart className={`w-4 h-4 ${wishlisted ? "fill-white" : ""}`} />
        </button>
      </div>
      <div className="p-3">
        <p className="text-[10px] font-mono uppercase tracking-wider text-black/30 mb-0.5">{item.cat}</p>
        <h3 className="text-sm font-black text-black leading-snug line-clamp-2 mb-1.5 cursor-pointer hover:text-neutral-700" onClick={onView}>{item.title}</h3>
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < Math.floor(item.rating) ? "fill-[#f7f500] text-[#f7f500]" : "text-stone-200"}`} />)}
          <span className="text-[10px] text-black/30 ml-1">({item.reviews})</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="font-black text-black text-sm">${item.price}</span>
            {item.compare > item.price && <span className="text-xs text-black/30 line-through ml-1">${item.compare}</span>}
          </div>
          <button onClick={onAdd}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-black border-2 border-black transition ${added ? "bg-emerald-400 text-black" : "bg-[#f7f500] text-black hover:bg-black hover:text-[#f7f500]"}`}>
            {added ? <><Check className="w-3 h-3" /> Added</> : <><ShoppingBag className="w-3 h-3" /> Add</>}
          </button>
        </div>
      </div>
    </div>
  );
}

