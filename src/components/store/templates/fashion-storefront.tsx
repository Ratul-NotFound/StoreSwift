"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Store,
  CheckCircle2,
  Truck,
  ShieldCheck,
  X,
  ArrowRight,
  Sparkles,
  Search,
  Star,
  Heart,
  SlidersHorizontal,
  RotateCcw,
  Check,
  Mail,
  Plus,
  Layers,
  Ruler,
  Scissors,
  ChevronRight,
  ChevronDown
} from "lucide-react";
import { IStoreTemplate } from "@/templates/types";
import { CartItem } from "@/lib/cart";

export interface FashionStorefrontProps {
  storeDisplayName: string;
  tenantSlug: string;
  products: Array<{
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
  }>;
  cartItems: CartItem[];
  wishlist: string[];
  finalTotal: number;
  template: IStoreTemplate;
  onAddToCart: (prod: any, variant: any) => void;
  onToggleWishlist: (productId: string) => void;
  onOpenProduct: (prod: any) => void;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  // Demo Studio
  allCategories: string[];
  activeCategoryKey: string;
  onSelectCategory: (cat: string) => void;
  allTemplates: string[];
  templateKey: string;
  onSelectTemplate: (tKey: string) => void;
  categoriesMap: Record<string, any>;
  storeTemplatesMap: Record<string, any>;
}

// Visual Silhouette Categories for Fashion
const FASHION_SILHOUETTES = [
  {
    title: "Heavyweight Ts",
    tagline: "280 GSM Combed Cotton",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=700&auto=format&fit=crop&q=80",
    fabric: "280 GSM",
    cut: "Relaxed Drop-Shoulder"
  },
  {
    title: "Kurabo Selvedge",
    tagline: "13.5oz Raw Indigo Denim",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=700&auto=format&fit=crop&q=80",
    fabric: "13.5oz Kurabo",
    cut: "Modern Taper"
  },
  {
    title: "Loopback Terry",
    tagline: "450 GSM Raglan Hoodie",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=700&auto=format&fit=crop&q=80",
    fabric: "450 GSM Terry",
    cut: "Boxy Thermal"
  },
  {
    title: "Atelier Tailoring",
    tagline: "Bonded Twill Overcoats",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=700&auto=format&fit=crop&q=80",
    fabric: "Bonded Wool/Cotton",
    cut: "Architectural Drape"
  }
];

// Textile Comparison Matrix (Addressing Buyer Fear of cheap/thin fast-fashion fabric)
const TEXTILE_COMPARISON = [
  {
    tier: "Fast-Fashion Standard",
    gsm: "140 - 160 GSM",
    yarn: "Short-Staple Carded Poly-Blend",
    drape: "Clings awkwardly, transparent under sunlight",
    durability: "Collar warps & seams twist after 3-5 washes",
    badge: "Fast-Fashion",
    isRecommended: false
  },
  {
    tier: "StoreSwift Atelier Cotton",
    gsm: "280 GSM Heavyweight",
    yarn: "100% Combed Long-Staple Organic",
    drape: "Structured architectural drape with drop shoulder",
    durability: "Pre-shrunk fibers, high-density ribbed collar stays crisp",
    badge: "Atelier Standard",
    isRecommended: true
  },
  {
    tier: "Kurabo Japanese Selvedge",
    gsm: "13.5oz (450 GSM Equivalent)",
    yarn: "Shuttle-Loom Ring-Spun Indigo Cotton",
    drape: "Structured contour that breaks in to your anatomy",
    durability: "Solid copper rivets, custom honeycombs & whiskering for decades",
    badge: "Master Mill",
    isRecommended: true
  }
];

// Runway & Street Editorial Lookbook Gallery
const LOOKBOOK_GALLERY = [
  {
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80",
    title: "Drop 01 // Monochrome Composition",
    caption: "280 GSM Heavyweight Tee in Bone White paired with raw Kurabo denim."
  },
  {
    image: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&auto=format&fit=crop&q=80",
    title: "Drop 02 // Loopback Volume",
    caption: "450 GSM French Terry Raglan Hoodie in Heather Slate."
  },
  {
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80",
    title: "Drop 03 // Relaxed Taper Silhouette",
    caption: "Hand-hammered copper rivets with clean stacking breaks."
  },
  {
    image: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=800&auto=format&fit=crop&q=80",
    title: "Drop 04 // Studio Outerwear Edit",
    caption: "Tailored architectural drape cut for clean cold-weather layering."
  }
];

export function FashionStorefront({
  storeDisplayName,
  tenantSlug,
  products,
  cartItems,
  wishlist,
  finalTotal,
  template,
  onAddToCart,
  onToggleWishlist,
  onOpenProduct,
  onOpenCart,
  onOpenSearch,
  allCategories,
  activeCategoryKey,
  onSelectCategory,
  allTemplates,
  templateKey,
  onSelectTemplate,
  categoriesMap,
  storeTemplatesMap
}: FashionStorefrontProps) {
  // Card-level state: Selected color swatches and active sizes
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>({});
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  
  // Floating Theme Menu Toggle
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

  // VIP Newsletter Form
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  // Catalog Filters
  const [activeSilhouetteFilter, setActiveSilhouetteFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");

  const psych = template.getCategoryPsychology();
  const highlights = template.getAnnouncementHighlights();

  // Handle color swatch click on card
  const handleColorSelect = (productId: string, color: string) => {
    setSelectedColors((prev) => ({ ...prev, [productId]: color }));
  };

  // Handle quick size click on card (instantly adds to bag in selected size)
  const handleQuickSizeAdd = (product: any, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [product.id]: size }));
    const color = selectedColors[product.id] || "Standard";
    const variantMatch = product.variants.find((v: any) => v.title.includes(size)) || product.variants[0];
    onAddToCart(product, {
      ...variantMatch,
      title: `${size} • ${color}`
    });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSuccess(true);
  };

  // Filtered Products
  const displayedProducts = products.filter((p) => {
    if (activeSilhouetteFilter === "tees" && !p.slug.includes("tee")) return false;
    if (activeSilhouetteFilter === "denim" && !p.slug.includes("denim")) return false;
    if (activeSilhouetteFilter === "hoodies" && !p.slug.includes("hoodie")) return false;
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white text-zinc-950 selection:bg-zinc-950 selection:text-white">
      {/* ─── 1. Fashion Announcement Bar ───────────────────────────────────── */}
      <div className="py-2 px-4 bg-zinc-950 text-zinc-300 text-xs font-mono tracking-wide border-b border-zinc-900">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="hidden sm:inline-block uppercase tracking-wider text-[11px] opacity-75">
            {highlights.leading}
          </span>
          <span className="mx-auto sm:mx-0 font-medium text-center text-white">
            Complimentary Nationwide 48h Delivery over $50 • Try On at Doorstep (COD)
          </span>
          <span className="hidden md:inline-block uppercase tracking-wider text-[11px] text-emerald-400">
            Free Doorstep Size Swap
          </span>
        </div>
      </div>

      {/* ─── 2. Atelier Luxury Brand Header ─────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-zinc-200/80 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href={`/store/${tenantSlug}`} className="flex items-center space-x-3 flex-shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-zinc-950 text-white flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
              <Scissors className="w-4 h-4" />
            </div>
            <div>
              <span className="font-black tracking-tight text-base uppercase block leading-none">
                {storeDisplayName}
              </span>
              <span className="text-[10px] font-mono tracking-widest uppercase opacity-50 block mt-1">
                Atelier 2026 Archive
              </span>
            </div>
          </Link>

          {/* Fashion Silhouette Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 text-xs font-semibold tracking-wider uppercase text-zinc-600">
            <button onClick={() => setActiveSilhouetteFilter("all")} className={`hover:text-black transition ${activeSilhouetteFilter === "all" ? "text-black font-bold border-b border-black pb-0.5" : ""}`}>
              All Silhouettes
            </button>
            <button onClick={() => setActiveSilhouetteFilter("tees")} className={`hover:text-black transition ${activeSilhouetteFilter === "tees" ? "text-black font-bold border-b border-black pb-0.5" : ""}`}>
              280 GSM Tees
            </button>
            <button onClick={() => setActiveSilhouetteFilter("denim")} className={`hover:text-black transition ${activeSilhouetteFilter === "denim" ? "text-black font-bold border-b border-black pb-0.5" : ""}`}>
              Kurabo Selvedge
            </button>
            <button onClick={() => setActiveSilhouetteFilter("hoodies")} className={`hover:text-black transition ${activeSilhouetteFilter === "hoodies" ? "text-black font-bold border-b border-black pb-0.5" : ""}`}>
              450 GSM Terry
            </button>
            <a href="#outfits" className="hover:text-black transition">
              Shop The Look
            </a>
            <a href="#fabric-guide" className="hover:text-black transition text-zinc-400">
              Fabric Guide
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <div
              onClick={onOpenSearch}
              className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-zinc-200 bg-zinc-50 text-xs opacity-75 cursor-pointer hover:border-zinc-400 transition"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="font-mono text-[11px]">Search textiles...</span>
              <kbd className="text-[9px] bg-zinc-200 px-1 py-0.5 rounded font-mono">⌘K</kbd>
            </div>

            <button onClick={onOpenSearch} className="md:hidden p-2 rounded-xl border border-zinc-200 opacity-75">
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={() => alert(`Saved to Wishlist: ${wishlist.length} item(s)`)}
              className="p-2 rounded-xl border border-zinc-200 hover:border-zinc-400 transition relative"
              title="Saved Wishlist"
            >
              <Heart className="w-4 h-4 text-zinc-700" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-zinc-950 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              onClick={onOpenCart}
              className="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition flex items-center space-x-2 btn-press"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Bag ({cartItems.reduce((s, i) => s + i.quantity, 0)})</span>
              {cartItems.length > 0 && (
                <span className="hidden sm:inline-block border-l border-zinc-700 pl-2 font-mono">
                  ${finalTotal.toFixed(2)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ─── 3. Architectural Campaign Hero (SSENSE / Acne Studios Style) ─────── */}
      <section className="relative border-b border-zinc-200 overflow-hidden bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">
          {/* Left Column: Bold Architectural Type */}
          <div className="lg:col-span-6 flex flex-col justify-center py-16 pr-0 lg:pr-14 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-900 border border-zinc-200 w-fit text-[10px] font-mono uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 animate-pulse" />
              <span>Drop 01 // Autumn Winter 2026</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-[-0.04em] leading-[0.88] text-zinc-950">
                Architectural <br />
                Drape.
              </h1>
              <p className="text-sm font-normal text-zinc-500 leading-relaxed max-w-md pt-1">
                Engineered from 280 GSM combed organic yarns and 13.5oz Kurabo raw selvedge. Cut for structural volume, lasting shoulder geometry, and zero fabric warping.
              </p>
            </div>

            {/* Textile Specs Chips */}
            <div className="flex flex-wrap gap-2 text-[11px] font-mono pt-1">
              <span className="px-3 py-1 bg-zinc-100 border border-zinc-200 rounded-lg text-zinc-800">
                280 GSM Cotton
              </span>
              <span className="px-3 py-1 bg-zinc-100 border border-zinc-200 rounded-lg text-zinc-800">
                13.5oz Kurabo Selvedge
              </span>
              <span className="px-3 py-1 bg-zinc-100 border border-zinc-200 rounded-lg text-zinc-800">
                Zero Shrinkage Yarns
              </span>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-3 pt-3">
              <a
                href="#catalog"
                className="py-4 px-8 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center space-x-2 btn-press"
              >
                <span>Shop The Collection</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#outfits"
                className="py-4 px-6 border border-zinc-200 hover:bg-zinc-50 text-zinc-900 rounded-xl font-semibold text-xs tracking-wider uppercase transition"
              >
                Shop The Look
              </a>
            </div>

            {/* Psychological Sizing Reassurance Micro-banner */}
            <div className="pt-2 flex items-center space-x-2 text-[11px] text-zinc-500 border-t border-zinc-100 pt-4">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>
                <strong>Doorstep Fitting Promise:</strong> Try on your parcel before cash payment. 48h courier size exchange if needed.
              </span>
            </div>
          </div>

          {/* Right Column: Full-Bleed On-Model Campaign View */}
          <div className="lg:col-span-6 relative overflow-hidden bg-zinc-100">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=85"
              alt="Atelier Campaign"
              className="w-full h-full object-cover object-top"
              style={{ minHeight: "440px" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            {/* Editorial On-Photo Badge */}
            <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest border border-zinc-200 shadow-sm">
              Atelier Archive • 01
            </div>

            {/* Bottom Caption Pill */}
            <div className="absolute bottom-6 left-6 right-6 bg-zinc-950/90 backdrop-blur-md text-white p-4 rounded-2xl border border-white/10 shadow-xl flex items-center justify-between">
              <div>
                <p className="text-xs font-bold tracking-tight">On-Model: Drop-Shoulder 280 GSM Tee</p>
                <p className="text-[10px] text-zinc-400 font-mono">Model is 6'1" wearing size L in Washed Slate</p>
              </div>
              <a
                href="#catalog"
                className="px-3 py-1.5 bg-white text-zinc-950 font-bold text-[11px] rounded-lg hover:bg-zinc-200 transition"
              >
                Inspect
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. Curated Silhouette Bar (Photo Navigation Pills) ─────────────── */}
      <section className="py-10 border-b border-zinc-200 bg-zinc-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900">
                Browse by Silhouette & Fabric Weight
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">Heavyweight textiles crafted for enduring drape</p>
            </div>
            <span className="text-[11px] font-mono text-zinc-400">4 CORE SILHOUETTES</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {FASHION_SILHOUETTES.map((s, idx) => (
              <div
                key={idx}
                onClick={() => {
                  if (idx === 0) setActiveSilhouetteFilter("tees");
                  else if (idx === 1) setActiveSilhouetteFilter("denim");
                  else if (idx === 2) setActiveSilhouetteFilter("hoodies");
                  else setActiveSilhouetteFilter("all");
                  const el = document.getElementById("catalog");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] border border-zinc-200 bg-white shadow-subtle hover:shadow-card transition-all cursor-pointer"
              >
                <img
                  src={s.image}
                  alt={s.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                
                {/* Fabric Badge */}
                <div className="absolute top-3 left-3 bg-white/95 text-zinc-950 text-[9px] font-mono font-bold px-2 py-0.5 rounded shadow-sm">
                  {s.fabric}
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h4 className="font-bold text-sm tracking-tight">{s.title}</h4>
                  <p className="text-[10px] text-zinc-300 opacity-90">{s.cut}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5. Fashion Product Catalog with Priority Card Ergonomics ───────── */}
      <main id="catalog" className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        {/* Catalog Control Toolbar */}
        <div className="rounded-2xl p-4 border border-zinc-200 bg-zinc-50/80 mb-8 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold tracking-tight">Atelier Ready-to-Wear</h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                {displayedProducts.length} archival garments in stock • 48h express delivery
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1.5 text-xs bg-white border border-zinc-200 rounded-xl px-3 py-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-500" />
                <span className="font-semibold text-zinc-700">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent font-bold outline-none cursor-pointer text-xs"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>

              <button
                onClick={() => setActiveSilhouetteFilter("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                  activeSilhouetteFilter === "all" ? "bg-zinc-950 text-white border-zinc-950" : "bg-white border-zinc-200 text-zinc-700"
                }`}
              >
                All Pieces
              </button>
            </div>
          </div>
        </div>

        {/* 3-Column Uniform Luxury Portrait Grid (aspect-[3/4]) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedProducts.map((p) => {
            const isWishlisted = wishlist.includes(p.id);
            const discountPct = template.calculateDiscount(p.price, p.comparePrice);
            const currentColor = selectedColors[p.id] || "Pitch Black";

            // Determine fabric weight badge
            const fabricBadge = p.slug.includes("tee")
              ? "280 GSM Heavyweight"
              : p.slug.includes("denim")
              ? "13.5oz Kurabo Selvedge"
              : "450 GSM Loopback Terry";

            // Sizing options
            const sizes = p.slug.includes("denim") ? ["30", "32", "34", "36"] : ["S", "M", "L", "XL"];
            const colors = p.slug.includes("denim")
              ? [
                  { name: "Raw Indigo", hex: "#1e293b" },
                  { name: "Faded Stonewash", hex: "#64748b" }
                ]
              : [
                  { name: "Pitch Black", hex: "#09090b" },
                  { name: "Washed Slate", hex: "#475569" },
                  { name: "Bone White", hex: "#f1f5f9" }
                ];

            return (
              <div
                key={p.id}
                className="group rounded-2xl border border-zinc-200 bg-white p-4 shadow-subtle hover:shadow-card hover:border-zinc-900/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Portrait Photo Frame with Lookbook On-Model Crossfade */}
                  <div
                    className="relative aspect-[3/4] rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 mb-4 cursor-pointer"
                    onClick={() => onOpenProduct(p)}
                  >
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
                    />
                    <img
                      src={p.secondaryImage || p.imageUrl}
                      alt={`${p.title} - Lookbook`}
                      className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    />

                    {/* Fabric GSM Tag */}
                    <span className="absolute top-2.5 left-2.5 bg-zinc-950/90 text-white text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
                      {fabricBadge}
                    </span>

                    {/* Discount Pill */}
                    {discountPct > 0 && (
                      <span className="absolute top-2.5 right-2.5 bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow">
                        -{discountPct}%
                      </span>
                    )}

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(p.id);
                      }}
                      className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-zinc-700 hover:text-rose-600 shadow transition"
                      title="Save piece"
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? "text-rose-500 fill-current" : ""}`} />
                    </button>

                    {/* Lookbook Angle Pill on Hover */}
                    <div className="absolute bottom-2.5 left-2.5 bg-zinc-950/80 backdrop-blur-sm text-white text-[9px] font-mono px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      ON-MODEL VIEW
                    </div>
                  </div>

                  {/* Interactive Color Swatches */}
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-[10px] font-mono uppercase text-zinc-400">Color:</span>
                    <div className="flex items-center space-x-1.5">
                      {colors.map((c) => {
                        const isSel = currentColor === c.name;
                        return (
                          <button
                            key={c.name}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleColorSelect(p.id, c.name);
                            }}
                            className={`w-4 h-4 rounded-full border transition-all ${
                              isSel ? "ring-2 ring-zinc-950 ring-offset-1 scale-110" : "opacity-80 hover:opacity-100 border-zinc-300"
                            }`}
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                          />
                        );
                      })}
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 ml-auto">{currentColor}</span>
                  </div>

                  {/* Title & Reviews */}
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1 text-amber-500 text-xs">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="font-bold text-xs">{p.rating}</span>
                      <span className="text-[10px] text-zinc-400">(48 verified fit reviews)</span>
                    </div>

                    <h3
                      onClick={() => onOpenProduct(p)}
                      className="font-bold text-sm tracking-tight hover:opacity-80 transition cursor-pointer leading-snug line-clamp-1"
                    >
                      {p.title}
                    </h3>
                    <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  {/* 1-Click Quick Size Selector Pills on Card */}
                  <div className="mt-3 pt-3 border-t border-zinc-100">
                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 mb-1.5">
                      <span className="uppercase tracking-wider">Quick Size Add:</span>
                      <span className="text-emerald-600 font-semibold">True to Size Drape</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {sizes.map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickSizeAdd(p, sz);
                          }}
                          className="py-1 px-1.5 rounded-lg border border-zinc-200 hover:border-zinc-950 hover:bg-zinc-950 hover:text-white text-xs font-mono font-bold transition text-center btn-press"
                          title={`Add Size ${sz} to Bag`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price & Primary Detail CTA */}
                <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                  <div>
                    <div className="text-base font-black text-zinc-950">
                      ${p.price.toFixed(2)}
                    </div>
                    <span className="text-[11px] text-zinc-400 line-through">
                      ${p.comparePrice.toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => onOpenProduct(p)}
                    className="py-1.5 px-3 border border-zinc-200 hover:border-zinc-900 rounded-xl text-xs font-bold transition flex items-center space-x-1"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* ─── 6. "Shop The Look" Styled Ensemble Feature ─────────────────────── */}
      <section id="outfits" className="py-16 bg-zinc-50 border-y border-zinc-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 block">
              Curated Outfit Harmony
            </span>
            <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tight">
              Shop The Complete Look
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500">
              Coordinated proportions and fabric weights designed by our studio stylists.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl p-6 sm:p-10 border border-zinc-200 shadow-card">
            {/* Styled Model Image */}
            <div className="lg:col-span-6 relative rounded-2xl overflow-hidden aspect-[4/5] bg-zinc-100 border border-zinc-200 shadow-inner">
              <img
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&auto=format&fit=crop&q=85"
                alt="Styled Lookbook Look"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-zinc-950 text-white text-[10px] font-mono px-3 py-1 rounded-full uppercase tracking-wider">
                Look 01 // The Archival Standard
              </div>
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-zinc-200 text-xs flex justify-between items-center">
                <span className="font-bold">Heavyweight Tee + Kurabo Denim</span>
                <span className="font-mono text-emerald-600 font-bold">Bundle Save 15%</span>
              </div>
            </div>

            {/* Ensemble Items Breakdown */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                  Ensemble Pieces
                </span>
                <h4 className="text-2xl font-black tracking-tight">The Modern Minimalist Kit</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Combining the architectural drape of our 280 GSM combed tee with the structural contour of 13.5oz Kurabo raw denim.
                </p>
              </div>

              {/* Item 1 */}
              <div className="flex items-center justify-between p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200/80">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-white border border-zinc-200 overflow-hidden flex-shrink-0">
                    <img
                      src={products[0]?.imageUrl || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&auto=format&fit=crop&q=80"}
                      alt="Piece 1"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs">Heavyweight Organic Oversized Tee</h5>
                    <p className="text-[10px] text-zinc-400 font-mono">280 GSM • Washed Slate • Size L</p>
                  </div>
                </div>
                <div className="text-xs font-black font-mono">$34.00</div>
              </div>

              {/* Item 2 */}
              <div className="flex items-center justify-between p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200/80">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-white border border-zinc-200 overflow-hidden flex-shrink-0">
                    <img
                      src={products[1]?.imageUrl || "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=200&auto=format&fit=crop&q=80"}
                      alt="Piece 2"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs">Japanese Selvedge Taper Denim</h5>
                    <p className="text-[10px] text-zinc-400 font-mono">13.5oz Raw Indigo • Size 32</p>
                  </div>
                </div>
                <div className="text-xs font-black font-mono">$98.00</div>
              </div>

              {/* Total & Bundle Button */}
              <div className="pt-2 space-y-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-zinc-500">Complete 2-Piece Look:</span>
                    <div className="text-2xl font-black text-zinc-950">$132.00</div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    Includes Free 48h Express Shipping
                  </span>
                </div>

                <button
                  onClick={() => {
                    if (products[0]) onAddToCart(products[0], products[0].variants[0]);
                    if (products[1]) onAddToCart(products[1], products[1].variants[0]);
                  }}
                  className="w-full py-4 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center justify-center space-x-2 btn-press shadow-md"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add Complete Outfit to Bag ($132.00)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. Textile Integrity & Fabric Weight Guide ─────────────────────── */}
      <section id="fabric-guide" className="py-16 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-800 text-xs font-bold border border-zinc-200">
            <Ruler className="w-3.5 h-3.5" />
            <span>Fabric Science & Longevity</span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tight">
            Why 280 GSM Textile Weight Matters
          </h3>
          <p className="text-xs sm:text-sm text-zinc-500">
            Compare our combed architectural yarns against fast-fashion industry norms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TEXTILE_COMPARISON.map((col, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-6 border transition-all flex flex-col justify-between ${
                col.isRecommended
                  ? "border-zinc-950 bg-white shadow-card ring-1 ring-zinc-950"
                  : "border-zinc-200 bg-zinc-50 opacity-75"
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded ${
                    col.isRecommended ? "bg-zinc-950 text-white" : "bg-zinc-200 text-zinc-600"
                  }`}>
                    {col.badge}
                  </span>
                  <span className="font-mono text-sm font-black">{col.gsm}</span>
                </div>

                <h4 className="font-black text-base">{col.tier}</h4>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-zinc-700 block">Yarn Construction:</span>
                    <span className="text-zinc-500">{col.yarn}</span>
                  </div>
                  <div>
                    <span className="font-bold text-zinc-700 block">Drape & Silhouette:</span>
                    <span className="text-zinc-500">{col.drape}</span>
                  </div>
                  <div>
                    <span className="font-bold text-zinc-700 block">Wash Durability:</span>
                    <span className="text-zinc-500">{col.durability}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-200 mt-6">
                <span className={`text-[11px] font-mono font-bold block text-center ${
                  col.isRecommended ? "text-emerald-700" : "text-zinc-400"
                }`}>
                  {col.isRecommended ? "✓ Guaranteed No Shrinkage or Collar Baconing" : "✗ Prone to Pilling & Warping"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 8. Doorstep Fit Trial & Sizing Protocol ───────────────────────── */}
      <section className="py-14 bg-zinc-950 text-white border-y border-zinc-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400">
              Zero Risk Cash on Delivery
            </span>
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
              The Doorstep Fit Guarantee
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400">
              {psych.reassurancePledge}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2.5">
              <span className="w-8 h-8 rounded-lg bg-white/10 text-white font-mono font-bold text-xs flex items-center justify-center">
                01
              </span>
              <h4 className="font-bold text-sm">Inspect 280 GSM Hand-Feel</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Feel the dense cotton weight, inspect the drop-shoulder seam alignment, and verify zero stitch flaws before tender.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2.5">
              <span className="w-8 h-8 rounded-lg bg-white/10 text-white font-mono font-bold text-xs flex items-center justify-center">
                02
              </span>
              <h4 className="font-bold text-sm">Try On Over Base Layer</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Step inside your home, slip the garment on over a clean undershirt, and test your chest width and sleeve drape.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2.5">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center">
                03
              </span>
              <h4 className="font-bold text-sm">Free 48h Size Exchange</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                If the size is off, our logistics driver returns within 48 hours to swap with your alternative size at zero surcharge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 9. Curated Editorial Lookbook Gallery ──────────────────────────── */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400 block">
              Atelier Photography
            </span>
            <h3 className="text-2xl font-black uppercase tracking-tight mt-0.5">
              Runway & Motion Lookbook
            </h3>
          </div>
          <a href="#catalog" className="text-xs font-bold uppercase tracking-wider hover:underline flex items-center space-x-1">
            <span>Shop Looks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {LOOKBOOK_GALLERY.map((item, idx) => (
            <div key={idx} className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-zinc-100 border border-zinc-200">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end text-white">
                <span className="text-[9px] font-mono uppercase text-zinc-300">{item.title}</span>
                <p className="text-xs font-semibold leading-snug mt-1">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 10. Customer Fit Appraisals & Verified Reviews ─────────────────── */}
      <section className="py-14 bg-zinc-50 border-t border-zinc-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white border border-zinc-200 shadow-subtle">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Patron Fit Feedback</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Real Patron Fit Appraisals
            </h3>
            <p className="text-xs text-zinc-500">
              Verified buyers reviewing fabric hand-feel, collar retention, and doorstep delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                author: "Julian V.",
                size: "Ordered Size L (6'1\" / 185 lbs)",
                fit: "True to Size • Perfect Drop-Shoulder",
                rating: 5,
                comment: "The 280 GSM cotton is significantly heavier than anything from fast fashion. It doesn't cling to your body and holds a clean architectural silhouette all day. Inspecting it on arrival was effortless."
              },
              {
                author: "Marcus T.",
                size: "Ordered Size 32 in Raw Indigo",
                fit: "True to Size • Clean Stacking",
                rating: 5,
                comment: "Genuine Japanese Kurabo selvedge with heavy copper rivets. Tried them on carpet at my door before paying the driver. Incredible build quality and zero chemical smell."
              },
              {
                author: "Elena R.",
                size: "Ordered Size M in French Terry",
                fit: "Slightly Boxy • Heavy Thermal",
                rating: 5,
                comment: "The 450 GSM weight is unreal. The double-walled hood stays upright without collapsing. 10/10 studio construction."
              }
            ].map((rev, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-subtle flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-500 space-x-0.5">
                      {[...Array(rev.rating)].map((_, idx) => (
                        <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                      Verified Buyer
                    </span>
                  </div>

                  <p className="text-xs text-zinc-700 leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-100 text-[11px]">
                  <p className="font-bold text-zinc-950">{rev.author}</p>
                  <p className="text-zinc-400 font-mono text-[10px]">{rev.size}</p>
                  <p className="text-emerald-700 font-medium text-[10px] mt-0.5">{rev.fit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 11. Atelier VIP Club Newsletter ───────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 border-b border-zinc-200 bg-white">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center mx-auto text-zinc-950">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tight">
            Join The {storeDisplayName} Atelier Club
          </h3>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto leading-relaxed">
            Receive 10% off your first cash on delivery order, private archival drops, and doorstep care guides.
          </p>

          {newsletterSuccess ? (
            <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-xl border border-emerald-200">
              Welcome to the Atelier! Use code <strong className="font-mono">ATELIER10</strong> for 10% off.
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-md mx-auto pt-2">
              <input
                type="email"
                placeholder="Enter your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-300 text-xs outline-none focus:border-zinc-950 transition"
                required
              />
              <button
                type="submit"
                className="py-2.5 px-6 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition btn-press"
              >
                Join Club
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ─── 12. Floating Merchant Preview Switcher ────────────────────────── */}
      <div className="fixed bottom-5 right-5 z-40">
        {isThemeMenuOpen ? (
          <div className="bg-zinc-950 text-white rounded-2xl p-4 shadow-2xl border border-zinc-800 w-72 space-y-3.5 mb-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-xs font-bold text-zinc-300 flex items-center space-x-1.5">
                <Scissors className="w-3.5 h-3.5 text-emerald-400" />
                <span>StoreSwift Demo Studio</span>
              </span>
              <button onClick={() => setIsThemeMenuOpen(false)} className="text-zinc-500 hover:text-white p-1">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-1.5">
                Department Category:
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {allCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => onSelectCategory(cat)}
                    className={`px-2.5 py-1.5 rounded-lg text-[10px] font-semibold text-left transition ${
                      activeCategoryKey === cat ? "bg-white text-black font-bold" : "bg-zinc-900 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {categoriesMap[cat]?.name?.split(" ")[0] || cat}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-1.5">
                Template Theme:
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {allTemplates.map((tKey) => (
                  <button
                    key={tKey}
                    onClick={() => onSelectTemplate(tKey)}
                    className={`px-2.5 py-1.5 rounded-lg text-[10px] font-semibold text-left transition ${
                      templateKey === tKey ? "bg-white text-black font-bold" : "bg-zinc-900 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {storeTemplatesMap[tKey]?.name?.split(" ")[0] || tKey}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsThemeMenuOpen(true)}
            className="bg-zinc-950/90 hover:bg-zinc-900 text-white backdrop-blur-md px-4 py-2.5 rounded-full text-xs font-semibold shadow-2xl border border-white/10 flex items-center space-x-2 transition hover:scale-105"
            title="Switch template style or department"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Theme: <strong>{template.name.split(" ")[0]}</strong></span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </button>
        )}
      </div>

      {/* ─── 13. StoreFooter ────────────────────────────────────────────────── */}
      <footer className="py-12 px-4 sm:px-6 bg-zinc-950 text-white border-t border-zinc-900 text-xs">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <span className="font-black text-sm uppercase tracking-wider">{storeDisplayName}</span>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Atelier apparel engineered from heavyweight organic combed yarns and shuttle-loomed Kurabo selvedge.
            </p>
            <p className="text-[11px] text-zinc-500">© 2026 {storeDisplayName}. All rights reserved.</p>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-xs uppercase tracking-wider text-zinc-300 block">Silhouettes</span>
            <ul className="space-y-1.5 text-zinc-400">
              <li><a href="#catalog" className="hover:text-white transition">280 GSM Oversized Tees</a></li>
              <li><a href="#catalog" className="hover:text-white transition">13.5oz Raw Selvedge</a></li>
              <li><a href="#catalog" className="hover:text-white transition">450 GSM Loopback Terry</a></li>
              <li><a href="#outfits" className="hover:text-white transition">Curated Ensembles</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-xs uppercase tracking-wider text-zinc-300 block">Patron Services</span>
            <ul className="space-y-1.5 text-zinc-400">
              <li><span>Doorstep Cash on Delivery</span></li>
              <li><span>Try Before You Pay (Fitting Trial)</span></li>
              <li><span>48h Complimentary Size Exchange</span></li>
              <li><span>Wash & Care Guides</span></li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-xs uppercase tracking-wider text-zinc-300 block">Payment & Logistics</span>
            <p className="text-zinc-400 leading-relaxed">
              Nationwide cash on delivery enabled. Inspect your garments in person prior to tender.
            </p>
            <div className="inline-flex items-center space-x-1.5 text-emerald-400 font-mono text-[11px] pt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Doorstep Inspection Protocol</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
