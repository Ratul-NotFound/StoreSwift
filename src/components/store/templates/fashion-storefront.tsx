"use client";

import { StoreFooter } from "@/components/footer";
import { useState } from "react";
import Link from "next/link";
import { useToast } from "@/components/ui/toast";
import {
  ShoppingBag,
  Search,
  Heart,
  SlidersHorizontal,
  Truck,
  ArrowRight,
  Menu,
  X,
  ChevronRight
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
  onOpenTrackOrder
}: FashionStorefrontProps) {
  const { success: toastSuccess } = useToast();
  const psych = template.getCategoryPsychology();
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>({});
  const [, setSelectedSizes] = useState<Record<string, string>>({});
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

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
      if (activeFilter === "tees" && !p.slug.includes("tee")) return false;
      if (activeFilter === "denim" && !p.slug.includes("denim")) return false;
      if (activeFilter === "hoodies" && !p.slug.includes("hoodie")) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0;
    });

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white text-neutral-950 selection:bg-black selection:text-white antialiased">
      {/* ─── 1. Ultra-Clean Global Announcement Strip ───────────────────────── */}
      <div className="py-2.5 px-4 bg-black text-white text-[10px] font-mono tracking-[0.25em] uppercase text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="hidden md:inline-block text-neutral-400">AUTUMN / WINTER 2026 ARCHIVE</span>
          <span className="mx-auto md:mx-0 font-medium">
            COMPLIMENTARY WORLDWIDE EXPRESS DELIVERY ON ORDERS OVER $150 • TRY ON AT DOORSTEP
          </span>
          <span className="hidden md:inline-block text-neutral-400">FREE 48H SIZE EXCHANGES</span>
        </div>
      </div>

      {/* ─── 2. Pristine Architectural Header (SSENSE / Toteme Benchmark) ─────── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-100 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Mobile: Hamburger Menu Toggle (< lg) */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              className="p-2 -ml-2 text-neutral-900 hover:text-black transition"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={onOpenSearch}
              className="p-2 text-neutral-700 hover:text-black transition sm:hidden"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Left: Minimalist Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-9 text-xs font-medium uppercase tracking-[0.2em] text-neutral-600">
            <button
              onClick={() => setActiveFilter("all")}
              className={`hover:text-black transition pb-0.5 ${
                activeFilter === "all" ? "text-black border-b border-black font-semibold" : ""
              }`}
            >
              Collection
            </button>
            <button
              onClick={() => setActiveFilter("tees")}
              className={`hover:text-black transition pb-0.5 ${
                activeFilter === "tees" ? "text-black border-b border-black font-semibold" : ""
              }`}
            >
              Tees
            </button>
            <button
              onClick={() => setActiveFilter("denim")}
              className={`hover:text-black transition pb-0.5 ${
                activeFilter === "denim" ? "text-black border-b border-black font-semibold" : ""
              }`}
            >
              Denim
            </button>
            <button
              onClick={() => setActiveFilter("hoodies")}
              className={`hover:text-black transition pb-0.5 ${
                activeFilter === "hoodies" ? "text-black border-b border-black font-semibold" : ""
              }`}
            >
              Knitwear
            </button>
            <a href="#editorial" className="hover:text-black transition pb-0.5 text-neutral-500">
              Editorial
            </a>
            <a href="#standards" className="hover:text-black transition pb-0.5 text-neutral-500">
              Standards
            </a>
          </nav>

          {/* Center: Brand Wordmark */}
          <Link href={`/store/${tenantSlug}`} className="text-center group">
            <span className="text-xl sm:text-2xl font-light tracking-[0.35em] uppercase text-black font-serif block leading-none">
              {storeDisplayName}
            </span>
            <span className="text-[9px] font-mono tracking-[0.4em] uppercase text-neutral-400 block mt-1">
              ATELIER ARCHIVE
            </span>
          </Link>

          {/* Right: Minimalist Functional Utilities */}
          <div className="flex items-center space-x-5 sm:space-x-7 text-neutral-800">
            <button
              onClick={onOpenSearch}
              className="hidden sm:flex hover:text-black transition items-center space-x-1.5 p-1"
              title="Search collection"
            >
              <Search className="w-4 h-4" />
              <span className="text-xs font-mono tracking-widest uppercase">Search</span>
            </button>

            <button
              onClick={() => toastSuccess("Wishlist", `${wishlist.length} piece(s) saved.`)}
              className="hover:text-black transition relative p-1"
              title="Saved pieces"
            >
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-black text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {onOpenTrackOrder && (
              <button
                type="button"
                onClick={onOpenTrackOrder}
                className="hidden md:flex items-center space-x-1 hover:text-black text-xs font-mono tracking-widest uppercase p-1"
                title="Track order"
              >
                <Truck className="w-4 h-4 text-neutral-400" />
                <span>Track</span>
              </button>
            )}

            <button
              onClick={onOpenCart}
              className="px-4 py-2 bg-black hover:bg-neutral-800 text-white rounded text-xs font-mono uppercase tracking-widest transition flex items-center space-x-2"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Bag ({cartItems.reduce((s, i) => s + i.quantity, 0)})</span>
              {cartItems.length > 0 && (
                <span className="hidden sm:inline border-l border-neutral-700 pl-2">
                  ${finalTotal.toFixed(2)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ─── Mobile Navigation Slide-Out Drawer ───────────────────────────── */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden animate-fade-in">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileNavOpen(false)}
          />

          {/* Drawer Sheet */}
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto border-r border-neutral-200">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-neutral-100">
                <div>
                  <span className="font-serif text-base tracking-[0.25em] uppercase font-light text-black block">
                    {storeDisplayName}
                  </span>
                  <span className="text-[9px] font-mono tracking-[0.3em] uppercase text-neutral-400">
                    Atelier Archive
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileNavOpen(false)}
                  className="p-2 text-neutral-500 hover:text-black rounded-lg transition"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Collections Filter Navigation */}
              <div className="py-6 space-y-4">
                <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400 font-medium">
                  Curated Catalog
                </p>
                <nav className="flex flex-col space-y-3 text-xs uppercase tracking-[0.15em] font-medium text-neutral-800">
                  <button
                    onClick={() => {
                      setActiveFilter("all");
                      setIsMobileNavOpen(false);
                    }}
                    className={`text-left py-2 flex items-center justify-between transition ${
                      activeFilter === "all" ? "text-black font-bold pl-2 border-l-2 border-black" : "hover:text-black"
                    }`}
                  >
                    <span>All Pieces ({products.length})</span>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                  </button>
                  <button
                    onClick={() => {
                      setActiveFilter("tees");
                      setIsMobileNavOpen(false);
                    }}
                    className={`text-left py-2 flex items-center justify-between transition ${
                      activeFilter === "tees" ? "text-black font-bold pl-2 border-l-2 border-black" : "hover:text-black"
                    }`}
                  >
                    <span>280 GSM Heavyweight Tees</span>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                  </button>
                  <button
                    onClick={() => {
                      setActiveFilter("denim");
                      setIsMobileNavOpen(false);
                    }}
                    className={`text-left py-2 flex items-center justify-between transition ${
                      activeFilter === "denim" ? "text-black font-bold pl-2 border-l-2 border-black" : "hover:text-black"
                    }`}
                  >
                    <span>Kurabo Selvedge Denim</span>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                  </button>
                  <button
                    onClick={() => {
                      setActiveFilter("hoodies");
                      setIsMobileNavOpen(false);
                    }}
                    className={`text-left py-2 flex items-center justify-between transition ${
                      activeFilter === "hoodies" ? "text-black font-bold pl-2 border-l-2 border-black" : "hover:text-black"
                    }`}
                  >
                    <span>French Terry Knitwear</span>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                  </button>
                </nav>
              </div>

              {/* Editorial & Standards */}
              <div className="py-4 border-t border-neutral-100 space-y-3">
                <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400 font-medium">
                  Editorial & Standards
                </p>
                <div className="flex flex-col space-y-2.5 text-xs uppercase tracking-[0.15em] font-medium text-neutral-600">
                  <a
                    href="#editorial"
                    onClick={() => setIsMobileNavOpen(false)}
                    className="hover:text-black transition py-1"
                  >
                    Editorial Lookbook
                  </a>
                  <a
                    href="#standards"
                    onClick={() => setIsMobileNavOpen(false)}
                    className="hover:text-black transition py-1"
                  >
                    Standards of Craft
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-neutral-100 space-y-3">
              {onOpenTrackOrder && (
                <button
                  onClick={() => {
                    setIsMobileNavOpen(false);
                    onOpenTrackOrder();
                  }}
                  className="w-full py-2.5 px-3 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs uppercase tracking-wider font-medium flex items-center justify-center space-x-2 transition"
                >
                  <Truck className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Track Consignment</span>
                </button>
              )}

              {onOpenCheckout && cartItems.length > 0 && (
                <button
                  onClick={() => {
                    setIsMobileNavOpen(false);
                    onOpenCheckout();
                  }}
                  className="w-full py-2.5 px-3 rounded bg-black text-white text-xs uppercase tracking-wider font-semibold flex items-center justify-center space-x-2 hover:bg-neutral-800 transition"
                >
                  <span>1-Page Express Checkout</span>
                </button>
              )}

              <p className="text-[10px] font-mono text-neutral-400 text-center tracking-wide pt-2">
                Doorstep Fit Inspection • Free Exchanges
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── 3. Editorial Campaign Hero (Pure High Fashion Spread) ──────────── */}
      <section className="relative border-b border-neutral-100 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Architectural Editorial Typography */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-neutral-400 block font-medium">
              Autumn / Winter 2026 // Archive 01
            </span>

            <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-light uppercase tracking-tight leading-[0.95] text-black font-serif">
              Architectural <br />
              Silhouettes.
            </h1>

            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-md font-normal">
              Constructed in 280 GSM combed organic cotton and raw 13.5oz Japanese Kurabo shuttle-loom selvedge. Engineered for structural volume, lasting shoulder geometry, and zero fabric warping.
            </p>

            <div className="pt-2 flex items-center space-x-5">
              <a
                href="#catalog"
                className="px-8 py-3.5 bg-black hover:bg-neutral-800 text-white text-xs font-medium uppercase tracking-[0.2em] transition inline-flex items-center space-x-2"
              >
                <span>Shop Collection</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <a
                href="#editorial"
                className="text-xs font-medium uppercase tracking-[0.2em] text-black hover:text-neutral-500 transition underline underline-offset-4"
              >
                View Lookbook
              </a>
            </div>

            <p className="text-[11px] text-neutral-400 font-mono tracking-wider pt-2">
              Try on at doorstep before payment • 48h courier size exchange
            </p>
          </div>

          {/* Right Column: High-Fashion Photography Diptych (Pure Clean Images) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
            <div className="relative aspect-[3/4] overflow-hidden bg-neutral-50 group">
              <img
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&auto=format&fit=crop&q=85"
                alt="Campaign Editorial 01"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            <div className="relative aspect-[3/4] overflow-hidden bg-neutral-50 group hidden sm:block">
              <img
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&auto=format&fit=crop&q=85"
                alt="Campaign Editorial 02"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. Borderless Catalog Navigation & Filter Bar ──────────────────── */}
      <main id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-12 border-b border-neutral-200 gap-4">
          {/* Category Tabs */}
          <div className="flex items-center space-x-8 overflow-x-auto text-xs font-medium uppercase tracking-[0.2em] text-neutral-400">
            <button
              onClick={() => setActiveFilter("all")}
              className={`hover:text-black transition whitespace-nowrap pb-1 ${
                activeFilter === "all" ? "text-black border-b-2 border-black font-semibold" : ""
              }`}
            >
              All Pieces ({displayedProducts.length})
            </button>
            <button
              onClick={() => setActiveFilter("tees")}
              className={`hover:text-black transition whitespace-nowrap pb-1 ${
                activeFilter === "tees" ? "text-black border-b-2 border-black font-semibold" : ""
              }`}
            >
              Heavyweight Tees
            </button>
            <button
              onClick={() => setActiveFilter("denim")}
              className={`hover:text-black transition whitespace-nowrap pb-1 ${
                activeFilter === "denim" ? "text-black border-b-2 border-black font-semibold" : ""
              }`}
            >
              Kurabo Denim
            </button>
            <button
              onClick={() => setActiveFilter("hoodies")}
              className={`hover:text-black transition whitespace-nowrap pb-1 ${
                activeFilter === "hoodies" ? "text-black border-b-2 border-black font-semibold" : ""
              }`}
            >
              French Terry
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2 text-xs text-neutral-500 font-mono self-end sm:self-auto">
            <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-medium outline-none cursor-pointer text-neutral-900 uppercase text-[10px] tracking-[0.15em]"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* ─── 5. Pristine Borderless Product Grid (SSENSE Standard) ─────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 lg:gap-x-12 gap-y-14 sm:gap-y-18">
          {displayedProducts.map((p) => {
            const isWishlisted = wishlist.includes(p.id);
            const currentColor = selectedColors[p.id] || "Standard";

            // Fabric pedigree
            const fabricBadge = p.slug.includes("tee")
              ? "280 GSM Cotton"
              : p.slug.includes("denim")
              ? "13.5oz Selvedge"
              : "450 GSM Terry";

            const fabricSub = p.slug.includes("tee")
              ? "Combed Organic Ring-Spun"
              : p.slug.includes("denim")
              ? "Kurabo Japanese Shuttle Loom"
              : "Loopback French Terry";

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
              <div key={p.id} className="group flex flex-col justify-between">
                {/* Product Image Stage */}
                <div
                  className="relative aspect-[3/4] bg-[#f7f6f4] overflow-hidden cursor-pointer"
                  onClick={() => onOpenProduct(p)}
                >
                  <img
                    src={p.imageUrl}
                    alt={p.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {p.secondaryImage && (
                    <img
                      src={p.secondaryImage}
                      alt={`${p.title} - Lookbook`}
                      className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:scale-105"
                    />
                  )}

                  {/* Discrete Fabric Weight Badge */}
                  <div className="absolute top-3 left-3 text-[9px] font-mono tracking-[0.2em] uppercase bg-black/80 text-white px-2 py-0.5 rounded-xs pointer-events-none">
                    {fabricBadge}
                  </div>

                  {/* Wishlist Heart */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(p.id);
                    }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-neutral-800 hover:text-black opacity-85 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                    title="Save to wishlist"
                    aria-label="Save to wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? "text-black fill-current" : ""}`} />
                  </button>

                  {/* Desktop Frosted Quick Size Selector Bar (Slides up on desktop hover) */}
                  <div className="hidden sm:flex absolute inset-x-4 bottom-4 p-2 bg-white/95 backdrop-blur-md border border-white/60 shadow-lg translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out z-10 items-center justify-between text-neutral-900 rounded">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 pl-1">
                      Quick Add
                    </span>
                    <div className="flex items-center space-x-1">
                      {sizes.map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickSizeAdd(p, sz);
                          }}
                          className="w-7 h-7 rounded text-[11px] font-mono font-medium hover:bg-black hover:text-white transition flex items-center justify-center text-neutral-800"
                          title={`Add Size ${sz} to Bag`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Minimalist Information Below Image */}
                <div className="pt-4 space-y-1.5">
                  {/* Color Swatch Dots with Touch Target & Color Label */}
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
                            className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                              isSel ? "ring-1 ring-black ring-offset-2 scale-110" : "opacity-75 hover:opacity-100"
                            }`}
                            title={c.name}
                          >
                            <span
                              className="w-3 h-3 rounded-full border border-black/15"
                              style={{ backgroundColor: c.hex }}
                            />
                          </button>
                        );
                      })}
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                      {currentColor}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => onOpenProduct(p)}
                    className="text-xs sm:text-sm font-medium uppercase tracking-[0.12em] text-neutral-950 hover:text-neutral-500 transition cursor-pointer line-clamp-1"
                  >
                    {p.title}
                  </h3>

                  {/* Fabric Subline */}
                  <p className="text-[11px] text-neutral-400 font-mono tracking-tight">
                    {fabricSub}
                  </p>

                  {/* Price */}
                  <div className="flex items-baseline space-x-2 pt-0.5">
                    <span className="text-xs sm:text-sm font-semibold text-black font-mono">
                      ${p.price.toFixed(2)}
                    </span>
                    {p.comparePrice > p.price && (
                      <span className="text-[11px] text-neutral-400 line-through font-mono">
                        ${p.comparePrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Mobile Quick-Add Size Strip (< sm) */}
                  <div className="sm:hidden pt-2 border-t border-neutral-100 flex items-center justify-between gap-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                      Add Size:
                    </span>
                    <div className="flex items-center gap-1">
                      {sizes.map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickSizeAdd(p, sz);
                          }}
                          className="px-2 py-1 rounded bg-neutral-100 hover:bg-black hover:text-white text-[10px] font-mono font-medium text-neutral-800 transition active:scale-95"
                          title={`Add Size ${sz}`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* ─── 6. High-Fashion Editorial Lookbook ("Volume & Geometry") ─────────── */}
      <section id="editorial" className="py-20 border-t border-neutral-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto text-center space-y-3 mb-16">
            <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-neutral-400 block font-medium">
              Editorial Volume 01
            </span>
            <h2 className="text-3xl sm:text-4xl font-light uppercase tracking-tight text-black font-serif">
              Volume & Geometry
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto leading-relaxed">
              A curated study in tonal layering, drop-shoulder silhouettes, and raw Kurabo shuttle-loom selvedge denim.
            </p>
          </div>

          {/* Editorial Visual Diptych & Ensemble Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="aspect-[3/4] overflow-hidden bg-neutral-100">
                <img
                  src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1000&auto=format&fit=crop&q=85"
                  alt="Editorial Look 01"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-[3/4] overflow-hidden bg-neutral-100 hidden sm:block">
                <img
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=1000&auto=format&fit=crop&q=85"
                  alt="Editorial Look 02"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Look Breakdown & Bundle Action */}
            <div className="lg:col-span-5 space-y-6 lg:pl-4">
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400 block font-medium">
                  Ensemble 01 // The Monolith Fit
                </span>
                <h3 className="text-2xl font-light uppercase tracking-tight text-black font-serif">
                  Minimalist Atelier Ensemble
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                  Paired for clean stacking breaks and structural upper-body drape. Includes 280 GSM organic cotton and raw selvedge denim.
                </p>
              </div>

              {/* Pieces */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between py-2.5 border-b border-neutral-100 text-xs">
                  <div>
                    <span className="font-medium text-neutral-900 block">Heavyweight Organic Oversized Tee</span>
                    <span className="text-[10px] text-neutral-400 font-mono">280 GSM • Washed Slate</span>
                  </div>
                  <span className="font-mono font-semibold">$34.00</span>
                </div>

                <div className="flex items-center justify-between py-2.5 border-b border-neutral-100 text-xs">
                  <div>
                    <span className="font-medium text-neutral-900 block">Japanese Selvedge Taper Denim</span>
                    <span className="text-[10px] text-neutral-400 font-mono">13.5oz Kurabo • Raw Indigo</span>
                  </div>
                  <span className="font-mono font-semibold">$98.00</span>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-neutral-500 uppercase font-mono tracking-wider">Complete Look</span>
                  <span className="text-xl font-bold font-mono text-black">$132.00</span>
                </div>

                <button
                  onClick={() => {
                    if (products[0]) onAddToCart(products[0], products[0].variants[0]);
                    if (products[1]) onAddToCart(products[1], products[1].variants[0]);
                  }}
                  className="w-full py-4 bg-black hover:bg-neutral-800 text-white text-xs font-medium uppercase tracking-[0.2em] transition flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add Complete Look to Bag ($132.00)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. Standards of Craft (Minimalist Luxury Pillars) ───────────────── */}
      <section id="standards" className="py-20 border-t border-neutral-100 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
            <div className="space-y-3">
              <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-neutral-400 block font-medium">
                I. Provenance
              </span>
              <h3 className="text-sm font-medium uppercase tracking-[0.15em] text-black">
                Certified Long-Staple Fibers
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                Yarns harvested exclusively from organic long-staple cotton farms and woven on traditional shuttle looms at Kurabo Mills in Japan.
              </p>
            </div>

            <div className="space-y-3">
              <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-neutral-400 block font-medium">
                II. Drape
              </span>
              <h3 className="text-sm font-medium uppercase tracking-[0.15em] text-black">
                Architectural Form
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                Dense 280 GSM to 450 GSM fabric weights ensure garments maintain structured silhouettes and crisp collar retention after washing.
              </p>
            </div>

            <div className="space-y-3">
              <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-neutral-400 block font-medium">
                III. Trial
              </span>
              <h3 className="text-sm font-medium uppercase tracking-[0.15em] text-black">
                Doorstep Fitting Guarantee
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                {psych.reassurancePledge || "Try on every piece in your home before tender. 48-hour complimentary courier size exchanges."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 8. Minimalist Atelier Newsletter ────────────────────────────────── */}
      <section className="py-20 border-t border-neutral-100 bg-white">
        <div className="max-w-md mx-auto px-4 text-center space-y-4">
          <span className="text-[10px] font-mono tracking-[0.35em] uppercase text-neutral-400 block font-medium">
            The Atelier Newsletter
          </span>
          <h3 className="text-2xl sm:text-3xl font-light uppercase tracking-tight text-black font-serif">
            Join The {storeDisplayName} Archive
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
            Receive private seasonal previews, archival drops, and complimentary express delivery on your first order.
          </p>

          {newsletterSuccess ? (
            <div className="p-3 bg-neutral-100 text-neutral-900 text-xs font-semibold tracking-wider uppercase">
              Welcome to the Atelier. Use code <span className="font-mono font-bold">ATELIER10</span> at checkout.
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex max-w-sm mx-auto pt-4 gap-2">
              <input
                type="email"
                placeholder="Enter email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 px-4 py-3 bg-transparent border-b border-neutral-300 text-xs text-black outline-none focus:border-black transition placeholder:text-neutral-400"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-black hover:bg-neutral-800 text-white text-xs font-medium uppercase tracking-[0.2em] transition"
              >
                Join
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ─── 9. Clean Store Footer ───────────────────────────────────────────── */}
      <StoreFooter
        storeName={storeDisplayName}
        storeSlug={tenantSlug}
        onOpenTrackOrder={onOpenTrackOrder}
        categoryName="Fashion & Apparel"
        hideNewsletter={true}
      />
    </div>
  );
}
