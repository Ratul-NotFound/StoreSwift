"use client";

import React, { useState, useEffect } from "react";
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
  Phone,
  User,
  ChevronRight,
  Tag,
  Smartphone,
  RotateCcw,
  Check,
  ChevronDown,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  MapPin,
  Mail,
  Clock
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ProductCard {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  comparePrice: number;
  imageUrl: string;
  secondaryImage?: string;
  badge?: string;
  rating?: number;
  variants: any[];
}

interface ClothingStorefrontProps {
  storeDisplayName: string;
  tenantSlug: string;
  products: ProductCard[];
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

// ─── Catalog Data ─────────────────────────────────────────────────────────────
const SHOP_ITEMS = [
  { id: "c1", title: "Brown Trench Coat", cat: "Coats", price: 165, compare: 210, rating: 4.8, reviews: 42, badge: "Trending",
    img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80" },
  { id: "c2", title: "Classic Light Coat", cat: "Coats", price: 145, compare: 190, rating: 4.9, reviews: 58, badge: "Summer Sale",
    img: "https://images.unsplash.com/photo-1508427953056-b00b8d78ebf5?w=600&auto=format&fit=crop&q=80" },
  { id: "c3", title: "Modern Brown Dress", cat: "Dresses", price: 98, compare: 135, rating: 4.7, reviews: 31, badge: "New",
    img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80" },
  { id: "c4", title: "Modern White Dress", cat: "Dresses", price: 88, compare: 120, rating: 4.6, reviews: 24, badge: "New",
    img: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&auto=format&fit=crop&q=80" },
  { id: "c5", title: "Modern Black Dress", cat: "Dresses", price: 92, compare: 130, rating: 4.8, reviews: 37, badge: "Bestseller",
    img: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&auto=format&fit=crop&q=80" },
  { id: "c6", title: "Fashion Blue Set", cat: "Sets", price: 120, compare: 165, rating: 4.7, reviews: 19, badge: "New",
    img: "https://images.unsplash.com/photo-1550639524-a005a5b4e0af?w=600&auto=format&fit=crop&q=80" },
  { id: "c7", title: "Floral Summer Top", cat: "Tops", price: 55, compare: 75, rating: 4.5, reviews: 62, badge: "Hot",
    img: "https://images.unsplash.com/photo-1594938298603-c8148c4b5571?w=600&auto=format&fit=crop&q=80" },
  { id: "c8", title: "White Spot Blouse", cat: "Tops", price: 48, compare: 68, rating: 4.6, reviews: 44, badge: "Sale",
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&auto=format&fit=crop&q=80" },
  { id: "c9", title: "Straight Leg Trousers", cat: "Bottoms", price: 78, compare: 105, rating: 4.7, reviews: 29, badge: "New",
    img: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&auto=format&fit=crop&q=80" },
  { id: "c10", title: "Linen Wide Pants", cat: "Bottoms", price: 72, compare: 98, rating: 4.5, reviews: 18, badge: "Trending",
    img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80" },
  { id: "c11", title: "Quilted Puffer Vest", cat: "Outerwear", price: 115, compare: 155, rating: 4.8, reviews: 33, badge: "Bestseller",
    img: "https://images.unsplash.com/photo-1517677129300-07b130802f46?w=600&auto=format&fit=crop&q=80" },
  { id: "c12", title: "Leather Biker Jacket", cat: "Outerwear", price: 245, compare: 320, rating: 4.9, reviews: 71, badge: "Premium",
    img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80" },
];

const SHOP_CATS = ["All", "Coats", "Dresses", "Sets", "Tops", "Bottoms", "Outerwear"];

const CATEGORY_SECTIONS = [
  { label: "For Women's", sub: "2500+ Items", items: ["Dresses", "T-Shirts & Tops", "Pants", "Jackets", "Skirts"],
    img: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=80" },
  { label: "For Men's", sub: "1000+ Items", items: ["Shirts", "Jeans and Slacks", "Jackets & Coats"],
    img: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&auto=format&fit=crop&q=80" },
  { label: "Accessories", sub: "800+ Items", items: ["Handbag", "Sunglasses", "Shoes", "Watch"],
    img: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80" },
];

const TRUST_ITEMS = [
  { icon: <Truck className="w-6 h-6" />, title: "Free Shipping", desc: "Free shipping for orders above ৳2,000" },
  { icon: <CreditCard className="w-6 h-6" />, title: "Flexible Payment", desc: "bKash, Nagad & Cash on Delivery" },
  { icon: <Phone className="w-6 h-6" />, title: "24×7 Support", desc: "Dedicated support team" },
];

const ABOUT_CONTENT = {
  headline: "Crafted with Care, Designed for Life.",
  sub: "Thoughtful materials, intentional silhouettes.",
  body: "Every piece in our collection is thoughtfully designed to blend modern aesthetics with everyday wearability. We source our fabrics responsibly and work with skilled artisans to create fashion that lasts.",
  img: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=900&auto=format&fit=crop&q=85",
  stats: [
    { num: "2500+", label: "Items" },
    { num: "150K+", label: "Customers" },
    { num: "98%", label: "Satisfaction" },
  ],
};

// ─── Component ────────────────────────────────────────────────────────────────
export function ClothingStorefront({
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
}: ClothingStorefrontProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [view, setView] = useState<"home" | "shop" | "about">("home");
  const [shopCat, setShopCat] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [wishlistLocal, setWishlistLocal] = useState<Set<string>>(new Set());
  const [addedId, setAddedId] = useState<string | null>(null);

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  const catalogItems = React.useMemo(() => {
    if (products && products.length > 0) {
      return products.map((p, idx) => ({
        id: p.id,
        title: p.title,
        cat: (p as any).category || (idx % 2 === 0 ? "Coats" : "Dresses"),
        price: p.price,
        compare: p.comparePrice || Math.round(p.price * 1.3),
        rating: p.rating || 4.9,
        reviews: 24 + (idx * 5),
        badge: p.badge || (idx === 0 ? "Bestseller" : idx === 1 ? "Trending" : "New"),
        img: p.imageUrl || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80",
        description: p.description,
        variants: p.variants || [],
        rawProduct: p
      }));
    }
    return SHOP_ITEMS.map((item) => ({ ...item, variants: [], rawProduct: null }));
  }, [products]);

  const activeCategories = React.useMemo(() => {
    const set = new Set<string>();
    catalogItems.forEach(i => { if (i.cat) set.add(i.cat); });
    return ["All", ...Array.from(set)];
  }, [catalogItems]);

  const filteredShop = shopCat === "All" ? catalogItems : catalogItems.filter(p => p.cat === shopCat);
  const sortedShop = [...filteredShop].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  const handleWishlist = (id: string) => {
    setWishlistLocal(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    onToggleWishlist(id);
  };

  const handleAddItem = (item: any) => {
    const prod = item.rawProduct || {
      id: item.id, title: item.title, slug: item.id, description: item.title,
      price: item.price, comparePrice: item.compare, imageUrl: item.img,
      badge: item.badge, rating: item.rating, variants: item.variants || []
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

  const NAV_LINKS: Array<{ label: string; view: "home" | "shop" | "about" }> = [
    { label: "Home", view: "home" },
    { label: "Shop", view: "shop" },
    { label: "About Us", view: "about" },
  ];

  return (
    <div className="min-h-screen bg-white text-[#2c2c2c] font-sans">

      {/* ── Announcement Bar ─────────────────────────────────────── */}
      <div className="bg-[#3d2d1e] text-white text-center text-xs py-2 tracking-wide">
        📞 (406) 555-0120 &nbsp;•&nbsp;
        <span className="font-semibold">Sign up and GET 30% OFF</span> your first order.&nbsp;
        <button className="underline underline-offset-2 hover:text-amber-200 transition">Sign up now</button>
      </div>

      {/* ── Header ────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-[#3d2d1e] rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">C</span>
            </div>
            <span className="font-bold text-lg text-[#3d2d1e] tracking-tight hidden sm:block">{storeDisplayName}</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
            {NAV_LINKS.map(n => (
              <button key={n.label} onClick={() => setView(n.view)}
                className={`hover:text-[#3d2d1e] transition pb-0.5 ${view === n.view ? "text-[#3d2d1e] border-b-2 border-[#3d2d1e] font-semibold" : ""}`}>
                {n.label}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2.5">
            <button onClick={onOpenSearch} className="p-2 rounded-full hover:bg-stone-100 text-stone-600 transition" aria-label="Search catalog">
              <Search className="w-4.5 h-4.5" />
            </button>
            {onOpenTrackOrder && (
              <button onClick={onOpenTrackOrder} className="hidden lg:flex items-center gap-1 text-xs text-stone-600 hover:text-[#3d2d1e] transition font-medium mr-1">
                <span>Track Order</span>
              </button>
            )}
            {onOpenCheckout && (
              <button onClick={onOpenCheckout} className="hidden sm:flex items-center gap-1.5 bg-[#3d2d1e] hover:bg-[#2a1e12] text-white text-xs font-bold px-3.5 py-1.5 rounded-full transition shadow-sm">
                <Truck className="w-3.5 h-3.5" />
                <span>Express Checkout</span>
              </button>
            )}
            <button onClick={onOpenCart}
              className="relative p-2 rounded-full hover:bg-stone-100 text-stone-600 transition">
              <ShoppingBag className="w-4.5 h-4.5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-[#3d2d1e] text-white text-[10px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>
              )}
            </button>
            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-stone-200 bg-white px-4 py-3 space-y-1">
            {NAV_LINKS.map(n => (
              <button key={n.label} onClick={() => { setView(n.view); setMobileMenuOpen(false); }}
                className="block w-full text-left py-2 text-sm text-stone-700 hover:text-[#3d2d1e] font-medium">
                {n.label}
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
          <section className="relative bg-[#f5ede3] overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-0 grid md:grid-cols-2 gap-8 items-center min-h-[520px]">
              {/* Left: text */}
              <div className="relative z-10 py-12">
                <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur px-3 py-1.5 rounded-full text-xs font-semibold text-[#3d2d1e] mb-5 border border-stone-200">
                  <Tag className="w-3 h-3" /> 30% OFF Summer Super Sale
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1a1209] leading-[1.1] mb-4">
                  Step into Style:<br />
                  <span className="text-[#3d2d1e]">Your Ultimate</span><br />
                  Fashion Destination
                </h1>
                <p className="text-stone-500 text-sm md:text-base leading-relaxed mb-8 max-w-md">
                  Discover curated collections that define modern elegance — from everyday essentials to statement pieces that turn heads.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => setView("shop")}
                    className="px-7 py-3 bg-[#3d2d1e] hover:bg-[#2a1e12] text-white font-semibold rounded-full transition flex items-center gap-2 text-sm shadow-md">
                    Shop Now <ArrowRight className="w-4 h-4" />
                  </button>
                  <button onClick={() => setView("about")}
                    className="px-7 py-3 border-2 border-[#3d2d1e] text-[#3d2d1e] hover:bg-[#3d2d1e] hover:text-white font-semibold rounded-full transition text-sm">
                    Our Story
                  </button>
                </div>
              </div>
              {/* Right: hero image */}
              <div className="relative h-[400px] md:h-full flex items-end justify-center">
                <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&auto=format&fit=crop&q=85"
                  alt="Fashion hero" className="h-full w-full object-cover object-top" />
                {/* Floating badge */}
                <div className="absolute top-6 right-6 bg-white rounded-2xl shadow-lg p-3 text-center">
                  <div className="text-2xl font-black text-[#3d2d1e]">30%</div>
                  <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">OFF</div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Trust Bar ────────────────────────────────────────── */}
          <section className="border-y border-stone-200 bg-stone-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {TRUST_ITEMS.map(t => (
                <div key={t.title} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#f5ede3] text-[#3d2d1e] flex items-center justify-center flex-shrink-0">
                    {t.icon}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[#1a1209]">{t.title}</p>
                    <p className="text-xs text-stone-500 mt-0.5">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Category Sections ────────────────────────────────── */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {CATEGORY_SECTIONS.map(cat => (
                <div key={cat.label} className="group">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-5 shadow-sm">
                    <img src={cat.img} alt={cat.label} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <span className="text-white text-xs font-mono font-medium bg-black/40 px-2 py-1 rounded">{cat.sub}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-[#1a1209] mb-3">{cat.label}</h3>
                  <ul className="space-y-1.5">
                    {cat.items.map(item => (
                      <li key={item}>
                        <button onClick={() => setView("shop")}
                          className="flex items-center gap-2 text-sm text-stone-600 hover:text-[#3d2d1e] transition group/item">
                          <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover/item:text-[#3d2d1e] transition" />
                          {item}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* ── Featured Products Grid ───────────────────────────── */}
          <section className="bg-stone-50 py-14">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#3d2d1e] mb-1">Curated Collection</p>
                  <h2 className="text-3xl font-extrabold text-[#1a1209]">New Arrivals</h2>
                </div>
                <button onClick={() => setView("shop")}
                  className="flex items-center gap-2 text-sm font-semibold text-[#3d2d1e] hover:gap-3 transition-all">
                  View All <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {catalogItems.slice(0, 8).map(item => (
                  <ProductCard
                    key={item.id}
                    item={item}
                    wishlisted={wishlistLocal.has(item.id)}
                    added={addedId === item.id}
                    onWishlist={() => handleWishlist(item.id)}
                    onAdd={() => handleAddItem(item)}
                    onView={() => {
                      const p = { id: item.id, title: item.title, slug: item.id, description: item.title, price: item.price, comparePrice: item.compare, imageUrl: item.img, badge: item.badge, rating: item.rating, variants: [] };
                      onOpenProduct(p);
                    }}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* ── Brand Logos ─────────────────────────────────────── */}
          <section className="border-y border-stone-200 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <p className="text-center text-xs font-mono uppercase tracking-[0.3em] text-stone-400 mb-6">Trusted Partner Brands</p>
              <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
                {["H&M", "OBEY", "Shopify", "LACOSTE", "Levi's", "amazon"].map(brand => (
                  <span key={brand} className="text-lg font-black text-stone-300 hover:text-stone-500 transition cursor-default tracking-tight">{brand}</span>
                ))}
              </div>
            </div>
          </section>

          {/* ── Download App Strip ──────────────────────────────── */}
          <section className="bg-[#3d2d1e] text-white py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold mb-1">Download Our App</h3>
                <p className="text-stone-300 text-sm">Shop anytime, anywhere. Exclusive app-only deals inside.</p>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition">
                  <Smartphone className="w-4 h-4" /> App Store
                </button>
                <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition">
                  <Smartphone className="w-4 h-4" /> Google Play
                </button>
              </div>
            </div>
          </section>

          {/* ── Newsletter ──────────────────────────────────────── */}
          <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl font-bold text-[#1a1209] mb-2">Get 10% Off Your First Order</h2>
            <p className="text-stone-500 text-sm mb-6">Subscribe to our newsletter for exclusive deals and style inspiration.</p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="Your email address"
                className="flex-1 border border-stone-300 rounded-full px-5 py-3 text-sm outline-none focus:border-[#3d2d1e] transition" />
              <button type="submit"
                className="px-7 py-3 bg-[#3d2d1e] hover:bg-[#2a1e12] text-white font-semibold rounded-full transition text-sm">
                Subscribe
              </button>
            </form>
          </section>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════
          SHOP VIEW
      ══════════════════════════════════════════════════════════════ */}
      {view === "shop" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-stone-500 mb-6">
            <button onClick={() => setView("home")} className="hover:text-[#3d2d1e]">Home</button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#3d2d1e] font-semibold">Shop</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="w-full lg:w-56 flex-shrink-0">
              <div className="bg-stone-50 rounded-2xl p-5 sticky top-24">
                <h3 className="font-bold text-[#1a1209] mb-4 text-sm uppercase tracking-wider">Categories</h3>
                <ul className="space-y-1">
                  {activeCategories.map(c => (
                    <li key={c}>
                      <button onClick={() => setShopCat(c)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition ${shopCat === c ? "bg-[#3d2d1e] text-white" : "text-stone-600 hover:bg-stone-200 hover:text-[#3d2d1e]"}`}>
                        {c}
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 pt-5 border-t border-stone-200">
                  <h3 className="font-bold text-[#1a1209] mb-3 text-sm uppercase tracking-wider">Price Range</h3>
                  <div className="space-y-1.5">
                    {["Under ৳1,000", "৳1,000 – ৳2,500", "৳2,500 – ৳5,000", "Over ৳5,000"].map(r => (
                      <label key={r} className="flex items-center gap-2 text-sm text-stone-600 cursor-pointer">
                        <input type="checkbox" className="rounded border-stone-300 accent-[#3d2d1e]" />
                        {r}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-stone-500">{sortedShop.length} items</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-500">Sort:</span>
                  <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                    className="text-sm border border-stone-300 rounded-xl px-3 py-1.5 outline-none focus:border-[#3d2d1e] bg-white">
                    <option value="featured">Featured</option>
                    <option value="price-asc">Price: Low → High</option>
                    <option value="price-desc">Price: High → Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5">
                {sortedShop.map(item => (
                  <ProductCard
                    key={item.id}
                    item={item}
                    wishlisted={wishlistLocal.has(item.id)}
                    added={addedId === item.id}
                    onWishlist={() => handleWishlist(item.id)}
                    onAdd={() => handleAddItem(item)}
                    onView={() => {
                      const p = { id: item.id, title: item.title, slug: item.id, description: item.title, price: item.price, comparePrice: item.compare, imageUrl: item.img, badge: item.badge, rating: item.rating, variants: [] };
                      onOpenProduct(p);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          ABOUT VIEW
      ══════════════════════════════════════════════════════════════ */}
      {view === "about" && (
        <div>
          {/* Hero */}
          <div className="relative h-72 md:h-96 overflow-hidden">
            <img src={ABOUT_CONTENT.img} alt="About" className="w-full h-full object-cover object-center" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <h1 className="text-3xl md:text-5xl font-extrabold mb-3">{ABOUT_CONTENT.headline}</h1>
                <p className="text-lg text-white/80">{ABOUT_CONTENT.sub}</p>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {ABOUT_CONTENT.stats.map(s => (
                <div key={s.label} className="text-center p-6 bg-[#f5ede3] rounded-2xl">
                  <div className="text-3xl font-extrabold text-[#3d2d1e] mb-1">{s.num}</div>
                  <div className="text-sm text-stone-500 font-medium">{s.label}</div>
                </div>
              ))}
            </div>
            <p className="text-stone-600 text-base leading-relaxed mb-8">{ABOUT_CONTENT.body}</p>
            <button onClick={() => setView("shop")}
              className="px-8 py-3 bg-[#3d2d1e] hover:bg-[#2a1e12] text-white font-semibold rounded-full transition flex items-center gap-2">
              Explore Collection <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer className="bg-[#1a1209] text-white pt-14 pb-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#3d2d1e] rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">C</span>
              </div>
              <span className="font-bold text-lg">{storeDisplayName}</span>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed">Your ultimate fashion destination. Modern styles, timeless quality.</p>
            <div className="flex gap-3 mt-5">
              {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                <button key={i} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-4 uppercase tracking-wider text-stone-300">Shop</h4>
            <ul className="space-y-2.5">
              {["Women's Collection", "Men's Collection", "Accessories", "New Arrivals", "Sale"].map(l => (
                <li key={l}><button className="text-stone-400 hover:text-white text-sm transition">{l}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-4 uppercase tracking-wider text-stone-300">Help</h4>
            <ul className="space-y-2.5">
              {["Track My Order", "Returns & Exchanges", "Size Guide", "FAQs", "Contact Us"].map(l => (
                <li key={l}><button className="text-stone-400 hover:text-white text-sm transition">{l}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-4 uppercase tracking-wider text-stone-300">Contact</h4>
            <ul className="space-y-3 text-sm text-stone-400">
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" /><span>123 Fashion Street, Style City</span></li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 flex-shrink-0" />(406) 555-0120</li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 flex-shrink-0" />hello@{tenantSlug}.com</li>
              <li className="flex items-center gap-2"><Clock className="w-4 h-4 flex-shrink-0" />Mon–Sat: 9am – 7pm</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <span>© {new Date().getFullYear()} {storeDisplayName}. All rights reserved.</span>
          <div className="flex gap-5">
            <button className="hover:text-white transition">Privacy Policy</button>
            <button className="hover:text-white transition">Terms of Service</button>
            <button className="hover:text-white transition">Cookies</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Shared Product Card ───────────────────────────────────────────────────────
function ProductCard({
  item, wishlisted, added, onWishlist, onAdd, onView
}: {
  item: typeof SHOP_ITEMS[0];
  wishlisted: boolean;
  added: boolean;
  onWishlist: () => void;
  onAdd: () => void;
  onView: () => void;
}) {
  const disc = Math.round(((item.compare - item.price) / item.compare) * 100);
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-stone-200 hover:border-stone-300 hover:shadow-md transition duration-300">
      <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 cursor-pointer" onClick={onView}>
        <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
        {item.badge && (
          <div className="absolute top-2 left-2 bg-[#3d2d1e] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
            {item.badge}
          </div>
        )}
        {disc > 0 && (
          <div className="absolute top-2 right-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            -{disc}%
          </div>
        )}
        <button onClick={e => { e.stopPropagation(); onWishlist(); }}
          className={`absolute bottom-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition shadow ${wishlisted ? "bg-rose-500 text-white" : "bg-white/90 text-stone-500 hover:bg-rose-50 hover:text-rose-500"}`}>
          <Heart className={`w-4 h-4 ${wishlisted ? "fill-white" : ""}`} />
        </button>
      </div>
      <div className="p-3">
        <p className="text-[10px] font-mono uppercase tracking-wider text-stone-400 mb-0.5">{item.cat}</p>
        <h3 className="text-sm font-bold text-[#1a1209] leading-snug line-clamp-2 mb-1 cursor-pointer hover:text-[#3d2d1e]" onClick={onView}>{item.title}</h3>
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < Math.floor(item.rating) ? "fill-amber-400 text-amber-400" : "text-stone-200"}`} />)}
          <span className="text-[10px] text-stone-400 ml-1">({item.reviews})</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-[#1a1209] text-sm">৳{item.price.toLocaleString("en-BD")}</span>
            {item.compare > item.price && (
              <span className="text-xs text-stone-400 line-through ml-1">৳{item.compare.toLocaleString("en-BD")}</span>
            )}
          </div>
          <button onClick={onAdd}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition ${added ? "bg-emerald-500 text-white" : "bg-[#3d2d1e] hover:bg-[#2a1e12] text-white"}`}>
            {added ? <><Check className="w-3 h-3" /> Added</> : <><ShoppingBag className="w-3 h-3" /> Add</>}
          </button>
        </div>
      </div>
    </div>
  );
}

