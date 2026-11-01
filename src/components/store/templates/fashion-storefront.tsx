"use client";

import { StoreFooter } from "@/components/footer";
import { useState } from "react";
import Link from "next/link";
import { useToast } from "@/components/ui/toast";
import {
  ShoppingBag,
  Truck,
  Zap,
  ShieldCheck,
  ArrowRight,
  Search,
  Star,
  Heart,
  SlidersHorizontal,
  Mail,
  Ruler,
  Scissors,
  Check,
  Sparkles
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
  onOpenCheckout?: () => void;
  onOpenTrackOrder?: () => void;
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
    id: "tees",
    title: "Heavyweight Ts",
    tagline: "280 GSM Combed Cotton",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=700&auto=format&fit=crop&q=80",
    fabric: "280 GSM",
    cut: "Relaxed Drop-Shoulder"
  },
  {
    id: "denim",
    title: "Kurabo Selvedge",
    tagline: "13.5oz Raw Indigo Denim",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=700&auto=format&fit=crop&q=80",
    fabric: "13.5oz Kurabo",
    cut: "Modern Taper"
  },
  {
    id: "hoodies",
    title: "Loopback Terry",
    tagline: "450 GSM Raglan Hoodie",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=700&auto=format&fit=crop&q=80",
    fabric: "450 GSM Terry",
    cut: "Boxy Thermal"
  },
  {
    id: "all",
    title: "Atelier Tailoring",
    tagline: "Bonded Twill Overcoats",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=700&auto=format&fit=crop&q=80",
    fabric: "Bonded Wool/Cotton",
    cut: "Architectural Drape"
  }
];

// Textile Comparison Matrix
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
    gsm: "13.5oz (450 GSM)",
    yarn: "Shuttle-Loom Ring-Spun Indigo Cotton",
    drape: "Structured contour that breaks in to your anatomy",
    durability: "Solid copper rivets, custom honeycombs for decades",
    badge: "Master Mill",
    isRecommended: true
  }
];

// Runway & Editorial Gallery
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
  onOpenCheckout,
  onOpenTrackOrder,
}: FashionStorefrontProps) {
  const { success: toastSuccess } = useToast();
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>({});
  const [, setSelectedSizes] = useState<Record<string, string>>({});
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [activeSilhouetteFilter, setActiveSilhouetteFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");

  const psych = template.getCategoryPsychology();

  const handleColorSelect = (productId: string, color: string) => {
    setSelectedColors((prev) => ({ ...prev, [productId]: color }));
  };

  const handleQuickSizeAdd = (product: any, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [product.id]: size }));
    const color = selectedColors[product.id] || "Standard";
    const variantMatch =
      product.variants?.find((v: any) => v.title?.toLowerCase().includes(size.toLowerCase())) ||
      product.variants?.[0] ||
      {};
    onAddToCart(product, {
      ...variantMatch,
      title: `${size} • ${color}`,
      price: variantMatch.price ?? product.price
    });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSuccess(true);
  };

  // Filter & Sort Products
  const displayedProducts = products
    .filter((p) => {
      if (activeSilhouetteFilter === "tees" && !p.slug.includes("tee")) return false;
      if (activeSilhouetteFilter === "denim" && !p.slug.includes("denim")) return false;
      if (activeSilhouetteFilter === "hoodies" && !p.slug.includes("hoodie")) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0;
    });

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#fafafa] text-zinc-950 selection:bg-zinc-950 selection:text-white">
      {/* ─── 1. Luxury Announcement Strip ────────────────────────────────────── */}
      <div className="py-2.5 px-4 bg-zinc-950 text-zinc-300 text-xs font-mono tracking-wide border-b border-zinc-900">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="hidden sm:inline-block uppercase tracking-widest text-[10px] text-zinc-400">
            Atelier Collection 2026
          </span>
          <span className="mx-auto sm:mx-0 font-medium text-center text-white text-xs">
            Complimentary Worldwide Express Delivery on orders over $150 • Try On at Doorstep (COD)
          </span>
          <span className="hidden md:inline-block uppercase tracking-wider text-[11px] text-emerald-400 font-semibold">
            Free 48h Size Swap
          </span>
        </div>
      </div>

      {/* ─── 2. Atelier Brand Header ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-zinc-200/80 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-6">
          {/* Brand Logo */}
          <Link href={`/store/${tenantSlug}`} className="flex items-center space-x-3 flex-shrink-0 group">
            <div className="w-8 h-8 rounded-lg bg-zinc-950 text-white flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
              <Scissors className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-base uppercase block leading-none text-zinc-950">
                {storeDisplayName}
              </span>
              <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 block mt-1">
                Atelier 2026 Archive
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs font-semibold tracking-wider uppercase text-zinc-600">
            <button
              onClick={() => setActiveSilhouetteFilter("all")}
              className={`hover:text-black transition pb-1 ${
                activeSilhouetteFilter === "all" ? "text-black font-bold border-b-2 border-black" : ""
              }`}
            >
              All Pieces
            </button>
            <button
              onClick={() => setActiveSilhouetteFilter("tees")}
              className={`hover:text-black transition pb-1 ${
                activeSilhouetteFilter === "tees" ? "text-black font-bold border-b-2 border-black" : ""
              }`}
            >
              280 GSM Tees
            </button>
            <button
              onClick={() => setActiveSilhouetteFilter("denim")}
              className={`hover:text-black transition pb-1 ${
                activeSilhouetteFilter === "denim" ? "text-black font-bold border-b-2 border-black" : ""
              }`}
            >
              Kurabo Selvedge
            </button>
            <button
              onClick={() => setActiveSilhouetteFilter("hoodies")}
              className={`hover:text-black transition pb-1 ${
                activeSilhouetteFilter === "hoodies" ? "text-black font-bold border-b-2 border-black" : ""
              }`}
            >
              450 GSM Terry
            </button>
            <a href="#outfits" className="hover:text-black transition pb-1">
              Shop The Look
            </a>
            <a href="#fabric-guide" className="hover:text-black transition pb-1 text-zinc-400">
              Fabric Science
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <button
              onClick={onOpenSearch}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-xs text-zinc-600 transition"
              title="Search textiles"
            >
              <Search className="w-3.5 h-3.5 text-zinc-500" />
              <span className="hidden md:inline font-mono text-[11px]">Search</span>
              <kbd className="hidden md:inline text-[9px] bg-zinc-200/80 px-1 py-0.5 rounded font-mono">⌘K</kbd>
            </button>

            {/* Wishlist */}
            <button
              onClick={() => toastSuccess("Saved to Wishlist", `${wishlist.length} item(s) saved in this session.`)}
              className="p-2 rounded-lg border border-zinc-200 hover:border-zinc-400 transition relative text-zinc-700 hover:text-black"
              title="Saved Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-zinc-950 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Track Consignment */}
            {onOpenTrackOrder && (
              <button
                type="button"
                onClick={onOpenTrackOrder}
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 hover:border-zinc-900 text-xs font-semibold text-zinc-800 transition"
                title="Track Consignment"
              >
                <Truck className="w-3.5 h-3.5 text-zinc-700" />
                <span className="text-[11px]">Track</span>
              </button>
            )}

            {/* Express Checkout */}
            {onOpenCheckout && cartItems.length > 0 && (
              <button
                type="button"
                onClick={onOpenCheckout}
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold transition btn-press shadow-xs"
                title="1-Page Express Checkout"
              >
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>Express</span>
              </button>
            )}

            {/* Bag Button */}
            <button
              onClick={onOpenCart}
              className="px-3.5 py-2 bg-zinc-950 hover:bg-zinc-800 text-white rounded-lg text-xs font-bold transition flex items-center space-x-2 btn-press shadow-xs"
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

      {/* ─── 3. Editorial Campaign Hero (Clean & Spacious) ───────────────────── */}
      <section className="relative border-b border-zinc-200/80 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">
          {/* Left Column: Architectural Typography */}
          <div className="lg:col-span-6 flex flex-col justify-center py-14 lg:py-16 pr-0 lg:pr-12 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-900 border border-zinc-200/90 w-fit text-[10px] font-mono uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-950" />
              <span>Drop 01 // Autumn Winter 2026</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-5xl sm:text-7xl lg:text-[76px] font-black uppercase tracking-[-0.04em] leading-[0.9] text-zinc-950">
                Architectural <br />
                Drape.
              </h1>
              <p className="text-sm font-normal text-zinc-500 leading-relaxed max-w-md pt-1">
                Engineered from 280 GSM combed organic yarns and 13.5oz Kurabo raw selvedge. Cut for structural volume, lasting shoulder geometry, and zero fabric warping.
              </p>
            </div>

            {/* Subtle Textile Specs */}
            <div className="flex flex-wrap gap-2 text-[11px] font-mono text-zinc-700">
              <span className="px-3 py-1 bg-zinc-50 border border-zinc-200 rounded-md">
                280 GSM Cotton
              </span>
              <span className="px-3 py-1 bg-zinc-50 border border-zinc-200 rounded-md">
                13.5oz Kurabo Selvedge
              </span>
              <span className="px-3 py-1 bg-zinc-50 border border-zinc-200 rounded-md">
                Pre-Shrunk Yarns
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#catalog"
                className="py-3.5 px-7 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center space-x-2 shadow-sm btn-press"
              >
                <span>Shop Collection</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#outfits"
                className="py-3.5 px-6 border border-zinc-200 hover:border-zinc-950 text-zinc-900 rounded-xl font-semibold text-xs tracking-wider uppercase transition bg-white"
              >
                Explore Lookbook
              </a>
            </div>

            {/* Reassurance Pledge */}
            <div className="flex items-center space-x-2 text-xs text-zinc-500 pt-2 border-t border-zinc-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>
                <strong>Doorstep Fitting Promise:</strong> Inspect and try on garments at your door before payment.
              </span>
            </div>
          </div>

          {/* Right Column: Full-Bleed On-Model Visual */}
          <div className="lg:col-span-6 relative overflow-hidden bg-zinc-100 min-h-[380px] lg:min-h-full">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=85"
              alt="Atelier Campaign"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

            {/* Clean Editorial Glass Badge */}
            <div className="absolute bottom-5 left-5 right-5 bg-white/90 backdrop-blur-md p-3.5 rounded-xl border border-white/40 shadow-lg flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-zinc-950">Drop-Shoulder 280 GSM Tee</p>
                <p className="text-[10px] text-zinc-500 font-mono">Model is 6'1" wearing size L in Slate</p>
              </div>
              <a
                href="#catalog"
                className="px-3 py-1 bg-zinc-950 text-white text-[11px] font-bold rounded-md hover:bg-zinc-800 transition"
              >
                View
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. Curated Silhouette Navigation ───────────────────────────────── */}
      <section className="py-10 border-b border-zinc-200/80 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-900 font-mono">
                Archival Silhouettes
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">Heavyweight textiles crafted for lasting drape</p>
            </div>
            <span className="text-[11px] font-mono text-zinc-400">4 CORE CUTS</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {FASHION_SILHOUETTES.map((s, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setActiveSilhouetteFilter(s.id);
                  const el = document.getElementById("catalog");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className={`group relative rounded-xl overflow-hidden aspect-[4/3] border transition-all cursor-pointer bg-zinc-100 ${
                  activeSilhouetteFilter === s.id
                    ? "border-zinc-950 ring-2 ring-zinc-950 shadow-sm"
                    : "border-zinc-200/80 hover:border-zinc-400"
                }`}
              >
                <img
                  src={s.image}
                  alt={s.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute top-2.5 left-2.5 bg-white/95 text-zinc-950 text-[9px] font-mono font-bold px-2 py-0.5 rounded shadow-xs">
                  {s.fabric}
                </div>

                <div className="absolute bottom-2.5 left-3 right-3 text-white">
                  <h4 className="font-bold text-xs tracking-tight">{s.title}</h4>
                  <p className="text-[10px] text-zinc-300 opacity-90">{s.cut}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5. Fashion Catalog (Clean Editorial Cards) ─────────────────────── */}
      <main id="catalog" className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {/* Catalog Control Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-zinc-200">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-950">Ready-to-Wear Catalog</h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              {displayedProducts.length} archival garments • 48h express delivery with doorstep fitting
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Sort Dropdown */}
            <div className="flex items-center space-x-1.5 text-xs bg-white border border-zinc-200 rounded-lg px-3 py-1.5 shadow-xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-zinc-500 font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent font-bold outline-none cursor-pointer text-xs text-zinc-900"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            {/* Reset Filter Button */}
            {activeSilhouetteFilter !== "all" && (
              <button
                onClick={() => setActiveSilhouetteFilter("all")}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-950 text-white transition"
              >
                View All
              </button>
            )}
          </div>
        </div>

        {/* 3-Column Uniform Luxury Portrait Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedProducts.map((p) => {
            const isWishlisted = wishlist.includes(p.id);
            const discountPct = template.calculateDiscount(p.price, p.comparePrice);
            const currentColor = selectedColors[p.id] || "Pitch Black";

            // Determine fabric weight badge
            const fabricBadge = p.slug.includes("tee")
              ? "280 GSM"
              : p.slug.includes("denim")
              ? "13.5oz Kurabo"
              : "450 GSM Terry";

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
                className="group relative flex flex-col justify-between bg-white rounded-2xl border border-zinc-200/80 hover:border-zinc-900 transition-all duration-300 overflow-hidden shadow-xs hover:shadow-md"
              >
                {/* Portrait Photo with Lookbook Crossfade & Quick-Size Drawer */}
                <div
                  className="relative aspect-[3/4] bg-zinc-100 overflow-hidden cursor-pointer"
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

                  {/* Top-Left: Fabric Badge */}
                  <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-zinc-950 text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-xs">
                    {fabricBadge}
                  </span>

                  {/* Top-Right: Sale Pill or Wishlist */}
                  <div className="absolute top-3 right-3 flex items-center space-x-1.5">
                    {discountPct > 0 && (
                      <span className="bg-zinc-950 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-xs">
                        -{discountPct}%
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(p.id);
                      }}
                      className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-zinc-700 hover:text-rose-600 transition shadow-xs"
                      title="Save to wishlist"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "text-rose-600 fill-current" : ""}`} />
                    </button>
                  </div>

                  {/* Slide-Up Quick Size Drawer on Card Hover */}
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-white/95 backdrop-blur-md border-t border-zinc-200/80 translate-y-full group-hover:translate-y-0 transition-transform duration-200 ease-out z-10">
                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 mb-1.5">
                      <span className="uppercase tracking-wider">Quick Size Add</span>
                      <span className="text-zinc-400">1-Tap Bag</span>
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
                          className="py-1.5 rounded-lg border border-zinc-200 hover:border-zinc-950 hover:bg-zinc-950 hover:text-white text-xs font-mono font-bold transition text-center btn-press"
                          title={`Add Size ${sz} to Bag`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Information Area Below Image */}
                <div className="p-4 space-y-2">
                  {/* Color Swatches */}
                  <div className="flex items-center justify-between">
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
                            className={`w-3.5 h-3.5 rounded-full border transition-all ${
                              isSel ? "ring-2 ring-zinc-950 ring-offset-1 scale-110" : "opacity-80 hover:opacity-100 border-zinc-300"
                            }`}
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                          />
                        );
                      })}
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400">{currentColor}</span>
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => onOpenProduct(p)}
                    className="font-bold text-sm tracking-tight text-zinc-950 hover:opacity-75 transition cursor-pointer line-clamp-1"
                  >
                    {p.title}
                  </h3>

                  {/* Price */}
                  <div className="flex items-baseline space-x-2 pt-0.5">
                    <span className="text-sm font-black text-zinc-950">
                      ${p.price.toFixed(2)}
                    </span>
                    {p.comparePrice > p.price && (
                      <span className="text-xs text-zinc-400 line-through">
                        ${p.comparePrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* ─── 6. "Shop The Look" Styled Ensemble Feature ─────────────────────── */}
      <section id="outfits" className="py-16 bg-white border-y border-zinc-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400 block font-semibold">
              Curated Outfit Harmony
            </span>
            <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-zinc-950">
              Shop The Complete Look
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500">
              Coordinated proportions and fabric weights designed by our studio stylists.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-zinc-50 rounded-3xl p-6 sm:p-10 border border-zinc-200/80 shadow-xs">
            {/* Styled Model Image */}
            <div className="lg:col-span-6 relative rounded-2xl overflow-hidden aspect-[4/5] bg-zinc-100 border border-zinc-200/80">
              <img
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&auto=format&fit=crop&q=85"
                alt="Styled Lookbook Look"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-zinc-950 text-white text-[10px] font-mono px-3 py-1 rounded-full uppercase tracking-wider">
                Look 01 // The Archival Standard
              </div>
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-zinc-200/80 text-xs flex justify-between items-center shadow-sm">
                <span className="font-bold text-zinc-900">Heavyweight Tee + Kurabo Denim</span>
                <span className="font-mono text-emerald-600 font-bold">Bundle Save 15%</span>
              </div>
            </div>

            {/* Ensemble Items Breakdown */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                  Ensemble Pieces
                </span>
                <h4 className="text-2xl font-black tracking-tight text-zinc-950">The Modern Minimalist Kit</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Combining the architectural drape of our 280 GSM combed tee with the structural contour of 13.5oz Kurabo raw denim.
                </p>
              </div>

              {/* Item 1 */}
              <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-zinc-200/80">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-lg bg-zinc-100 border border-zinc-200 overflow-hidden flex-shrink-0">
                    <img
                      src={products[0]?.imageUrl || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&auto=format&fit=crop&q=80"}
                      alt="Piece 1"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-zinc-950">Heavyweight Organic Oversized Tee</h5>
                    <p className="text-[10px] text-zinc-400 font-mono">280 GSM • Washed Slate • Size L</p>
                  </div>
                </div>
                <div className="text-xs font-black font-mono text-zinc-950">$34.00</div>
              </div>

              {/* Item 2 */}
              <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-zinc-200/80">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-lg bg-zinc-100 border border-zinc-200 overflow-hidden flex-shrink-0">
                    <img
                      src={products[1]?.imageUrl || "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=200&auto=format&fit=crop&q=80"}
                      alt="Piece 2"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-zinc-950">Japanese Selvedge Taper Denim</h5>
                    <p className="text-[10px] text-zinc-400 font-mono">13.5oz Raw Indigo • Size 32</p>
                  </div>
                </div>
                <div className="text-xs font-black font-mono text-zinc-950">$98.00</div>
              </div>

              {/* Total & Bundle Button */}
              <div className="pt-2 space-y-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-zinc-500">Complete 2-Piece Look:</span>
                    <div className="text-2xl font-black text-zinc-950">$132.00</div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    Free 48h Express Shipping
                  </span>
                </div>

                <button
                  onClick={() => {
                    if (products[0]) onAddToCart(products[0], products[0].variants[0]);
                    if (products[1]) onAddToCart(products[1], products[1].variants[0]);
                  }}
                  className="w-full py-3.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center justify-center space-x-2 btn-press shadow-xs"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add Complete Outfit to Bag ($132.00)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. Fabric Weight & Longevity Guide ──────────────────────────────── */}
      <section id="fabric-guide" className="py-16 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-800 text-xs font-bold border border-zinc-200">
            <Ruler className="w-3.5 h-3.5" />
            <span>Fabric Science & Longevity</span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-zinc-950">
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
              className={`rounded-2xl p-6 border transition-all flex flex-col justify-between ${
                col.isRecommended
                  ? "border-zinc-950 bg-white shadow-sm ring-1 ring-zinc-950"
                  : "border-zinc-200 bg-zinc-50/60 opacity-80"
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded ${
                    col.isRecommended ? "bg-zinc-950 text-white" : "bg-zinc-200 text-zinc-600"
                  }`}>
                    {col.badge}
                  </span>
                  <span className="font-mono text-sm font-black text-zinc-950">{col.gsm}</span>
                </div>

                <h4 className="font-black text-base text-zinc-950">{col.tier}</h4>

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
                  {col.isRecommended ? "Guaranteed Collar Retention & Zero Warping" : "Prone to Pilling & Warping"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 8. Doorstep Fit Trial Protocol ─────────────────────────────────── */}
      <section className="py-14 bg-zinc-950 text-white border-y border-zinc-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400 font-semibold">
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

      {/* ─── 9. Runway & Lookbook Gallery ───────────────────────────────────── */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400 block font-semibold">
              Atelier Photography
            </span>
            <h3 className="text-2xl font-black uppercase tracking-tight text-zinc-950 mt-0.5">
              Runway & Motion Lookbook
            </h3>
          </div>
          <a href="#catalog" className="text-xs font-bold uppercase tracking-wider hover:underline flex items-center space-x-1 text-zinc-900">
            <span>Shop Looks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {LOOKBOOK_GALLERY.map((item, idx) => (
            <div key={idx} className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-zinc-100 border border-zinc-200/80">
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

      {/* ─── 10. Customer Fit Appraisals ─────────────────────────────────────── */}
      <section className="py-14 bg-zinc-50 border-t border-zinc-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white border border-zinc-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Patron Fit Feedback</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950">
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
                comment: "The 280 GSM cotton is significantly heavier than anything from fast fashion. It holds a clean architectural silhouette all day. Inspecting it on arrival at the door was seamless."
              },
              {
                author: "Marcus T.",
                size: "Ordered Size 32 in Raw Indigo",
                fit: "True to Size • Clean Stacking",
                rating: 5,
                comment: "Genuine Japanese Kurabo selvedge with heavy copper rivets. Tried them on carpet at my door before paying the driver. Incredible build quality."
              },
              {
                author: "Elena R.",
                size: "Ordered Size M in French Terry",
                fit: "Slightly Boxy • Heavy Thermal",
                rating: 5,
                comment: "The 450 GSM weight is unreal. The double-walled hood stays upright without collapsing. 10/10 studio construction."
              }
            ].map((rev, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-xs flex flex-col justify-between space-y-4">
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

      {/* ─── 11. Atelier VIP Club Newsletter ─────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 border-b border-zinc-200/80 bg-white">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <div className="w-11 h-11 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center mx-auto text-zinc-950">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tight text-zinc-950">
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

      {/* ─── Unified Multi-Column Store Footer ───────────────────────────────── */}
      <StoreFooter
        storeName={storeDisplayName}
        storeSlug={tenantSlug}
        onOpenTrackOrder={onOpenTrackOrder}
        categoryName="Fashion & Apparel"
      />
    </div>
  );
}
