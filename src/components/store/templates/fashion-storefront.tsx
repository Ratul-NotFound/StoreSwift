"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useToast } from "@/components/ui/toast";
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
  Lock,
  ExternalLink,
  Flame,
  Plus,
  Minus,
  Ruler,
  Info,
  Sparkles,
  Layers
} from "lucide-react";
import { IStoreTemplate } from "@/templates/types";
import { CartItem } from "@/lib/cart";
import { BoutiqueStyle } from "./fashion/boutique-style";
import { MilanoStyle } from "./fashion/milano-style";
import { TrendStyle } from "./fashion/trend-style";

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

// Rich Curated Catalog for Universal Visual Density across all 3 Templates
const CURATED_CATALOG_EXPANSION = [
  {
    id: "cat-exp-4",
    title: "Bonded Wool Tailored Overcoat",
    slug: "bonded-wool-tailored-overcoat",
    category: "outerwear",
    description: "Architectural structured overcoat tailored in 520 GSM bonded Italian wool twill with horn buttons and satin lining.",
    price: 185.0,
    comparePrice: 250.0,
    imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=1000&auto=format&fit=crop&q=85",
    secondaryImage: "https://images.unsplash.com/photo-1508427953056-b00b8d78ebf5?w=1000&auto=format&fit=crop&q=85",
    badge: "New Season",
    rating: 5.0,
    reviewCount: 38,
    fabricBadge: "520 GSM Wool",
    fabricSub: "Bonded Italian Twill // Horn Buttons",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Charcoal Melange", hex: "#27272a" },
      { name: "Camel Tan", hex: "#b45309" }
    ],
    variants: [
      { sku: "OVERCOAT-S", title: "S", price: "185.00" },
      { sku: "OVERCOAT-M", title: "M", price: "185.00" },
      { sku: "OVERCOAT-L", title: "L", price: "185.00" }
    ]
  },
  {
    id: "cat-exp-5",
    title: "Boxy Vintage Drop-Shoulder Tee",
    slug: "boxy-vintage-drop-shoulder-tee",
    category: "tees",
    description: "300 GSM washed heavyweight combed jersey with double-stitched collar and relaxed boxy drape.",
    price: 38.0,
    comparePrice: 52.0,
    imageUrl: "https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=1000&auto=format&fit=crop&q=85",
    secondaryImage: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1000&auto=format&fit=crop&q=85",
    badge: "Trending",
    rating: 4.8,
    reviewCount: 54,
    fabricBadge: "300 GSM Jersey",
    fabricSub: "Vintage Enzyme Wash // Boxy Cut",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Mineral Slate", hex: "#475569" },
      { name: "Vintage Bone", hex: "#f8fafc" }
    ],
    variants: [
      { sku: "BOXY-S", title: "S", price: "38.00" },
      { sku: "BOXY-M", title: "M", price: "38.00" },
      { sku: "BOXY-L", title: "L", price: "38.00" }
    ]
  },
  {
    id: "cat-exp-6",
    title: "Wide Straight Kurabo Selvedge Jeans",
    slug: "wide-straight-kurabo-selvedge-jeans",
    category: "denim",
    description: "14oz raw Japanese indigo denim cut in a modern relaxed straight silhouette with classic redline selvedge ID.",
    price: 110.0,
    comparePrice: 155.0,
    imageUrl: "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=1000&auto=format&fit=crop&q=85",
    secondaryImage: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1000&auto=format&fit=crop&q=85",
    badge: "Japanese Mill",
    rating: 4.9,
    reviewCount: 42,
    fabricBadge: "14oz Redline",
    fabricSub: "Toyoda Shuttle Loom // Antique Rivets",
    sizes: ["30", "32", "34", "36"],
    colors: [
      { name: "Deep Indigo", hex: "#0f172a" },
      { name: "Rinsed Black", hex: "#18181b" }
    ],
    variants: [
      { sku: "STRAIGHT-30", title: "30", price: "110.00" },
      { sku: "STRAIGHT-32", title: "32", price: "110.00" },
      { sku: "STRAIGHT-34", title: "34", price: "110.00" }
    ]
  },
  {
    id: "cat-exp-7",
    title: "Architectural Mock-Neck Knit",
    slug: "architectural-mock-neck-knit",
    category: "hoodies",
    description: "Seamless extrafine merino knitwear cut with sculptural dropped shoulder seams and relaxed ribbed cuffs.",
    price: 92.0,
    comparePrice: 130.0,
    imageUrl: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=1000&auto=format&fit=crop&q=85",
    secondaryImage: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=1000&auto=format&fit=crop&q=85",
    badge: "Extrafine Merino",
    rating: 4.9,
    reviewCount: 31,
    fabricBadge: "100% Merino",
    fabricSub: "12-Gauge Seamless Knit // Ribbed Neck",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Bone White", hex: "#f8fafc" },
      { name: "Charcoal Heather", hex: "#334155" }
    ],
    variants: [
      { sku: "KNIT-S", title: "S", price: "92.00" },
      { sku: "KNIT-M", title: "M", price: "92.00" },
      { sku: "KNIT-L", title: "L", price: "92.00" }
    ]
  },
  {
    id: "cat-exp-8",
    title: "Full-Grain Minimalist Leather Tote",
    slug: "full-grain-minimalist-leather-tote",
    category: "accessories",
    description: "Unlined Tuscan vegetable-tanned leather carry-all with reinforced hand-stitched handles and internal brass key clip.",
    price: 145.0,
    comparePrice: 195.0,
    imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1000&auto=format&fit=crop&q=85",
    secondaryImage: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=1000&auto=format&fit=crop&q=85",
    badge: "Vegetable-Tanned",
    rating: 5.0,
    reviewCount: 26,
    fabricBadge: "Tuscan Leather",
    fabricSub: "Full-Grain Cowhide // Brass Hardware",
    sizes: ["One Size"],
    colors: [
      { name: "Cognac Brown", hex: "#78350f" },
      { name: "Matte Black", hex: "#09090b" }
    ],
    variants: [
      { sku: "TOTE-OS", title: "One Size", price: "145.00" }
    ]
  }
];

// Verified Social Proof Live Stream
const RECENT_SALES = [
  {
    name: "Marcus V.",
    city: "Stockholm, Sweden",
    item: "Heavyweight Organic Oversized Tee",
    price: 34.0,
    time: "2 mins ago",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=160&auto=format&fit=crop&q=80"
  },
  {
    name: "Elena R.",
    city: "New York, USA",
    item: "Japanese Selvedge Taper Denim",
    price: 98.0,
    time: "7 mins ago",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=160&auto=format&fit=crop&q=80"
  },
  {
    name: "Tariq H.",
    city: "London, UK",
    item: "Bonded Wool Tailored Overcoat",
    price: 185.0,
    time: "14 mins ago",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=160&auto=format&fit=crop&q=80"
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
  onOpenTrackOrder
}: FashionStorefrontProps) {
  const { success: toastSuccess } = useToast();

  // 3 Selectable Archetypes Matching User's Given Reference Pictures:
  // "boutique" = Reference Picture 1 (Clothing. / 50% OFF Summer Super Sale / 3-split Women-Men-Accessories)
  // "milano" = Reference Picture 2 (M MILANO / GET YOURSELF INTO THE RIGHT GEAR / Staggered Vertical Strips)
  // "trend" = Reference Picture 3 (FASHION / LET'S EXPLORE UNIQUE CLOTHES / Yellow Highlighter / 3 Pastel Cards)
  const [selectedFashionStyle, setSelectedFashionStyle] = useState<"boutique" | "milano" | "trend">("boutique");

  const [selectedColors, setSelectedColors] = useState<Record<string, string>>({});
  const [, setSelectedSizes] = useState<Record<string, string>>({});
  const [activeDepartment, setActiveDepartment] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"trending" | "new" | "bestsellers" | "sale">("trending");
  const [priceFilter, setPriceFilter] = useState<"all" | "under-50" | "50-100" | "over-100">("all");
  const [sizeFilter, setSizeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");

  // Modals & Currency
  const [currency, setCurrency] = useState<"USD" | "EUR" | "GBP">("USD");
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [sizeGuideUnit, setSizeGuideUnit] = useState<"in" | "cm">("in");
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);
  const [quickViewQty, setQuickViewQty] = useState(1);
  const [quickViewSelectedSize, setQuickViewSelectedSize] = useState("");
  const [quickViewSelectedColor, setQuickViewSelectedColor] = useState("");
  const [quickViewImageAngle, setQuickViewImageAngle] = useState<"primary" | "secondary">("primary");
  const [salesToastIndex, setSalesToastIndex] = useState(0);
  const [isSalesToastDismissed, setIsSalesToastDismissed] = useState(false);

  // Auto-rotate verified sales toast
  useEffect(() => {
    if (isSalesToastDismissed) return;
    const interval = setInterval(() => {
      setSalesToastIndex((prev) => (prev + 1) % RECENT_SALES.length);
    }, 9000);
    return () => clearInterval(interval);
  }, [isSalesToastDismissed]);

  // Dynamic Multi-Currency Converter
  const formatPrice = (usdAmount: number) => {
    if (currency === "EUR") return `€${(usdAmount * 0.92).toFixed(2)}`;
    if (currency === "GBP") return `£${(usdAmount * 0.78).toFixed(2)}`;
    return `$${usdAmount.toFixed(2)}`;
  };

  const handleOpenQuickView = (product: any) => {
    setQuickViewProduct(product);
    setQuickViewQty(1);
    setQuickViewSelectedSize(product.sizes?.[0] || "M");
    setQuickViewSelectedColor(product.colors?.[0]?.name || "Standard");
    setQuickViewImageAngle("primary");
  };

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

  // Harmonized Complete Store Catalog
  const fullCatalog = useMemo(() => {
    const baseItems = products.map((p) => {
      const isTee = p.slug.includes("tee");
      const isDenim = p.slug.includes("denim");
      const category = isTee ? "tees" : isDenim ? "denim" : "hoodies";
      return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        category,
        description: p.description,
        price: p.price,
        comparePrice: p.comparePrice,
        imageUrl: p.imageUrl,
        secondaryImage: p.secondaryImage,
        badge: p.badge || (isTee ? "Best Seller" : isDenim ? "Kurabo Selvedge" : "Heavyweight"),
        rating: p.rating || 4.9,
        reviewCount: 48,
        fabricBadge: isTee ? "280 GSM Cotton" : isDenim ? "13.5oz Selvedge" : "450 GSM Terry",
        fabricSub: isTee
          ? "Combed Organic Ring-Spun"
          : isDenim
          ? "Kurabo Japanese Shuttle Loom"
          : "Loopback French Terry",
        sizes: isDenim ? ["30", "32", "34", "36"] : ["S", "M", "L", "XL"],
        colors: isDenim
          ? [
              { name: "Raw Indigo", hex: "#1e293b" },
              { name: "Faded Stonewash", hex: "#64748b" }
            ]
          : [
              { name: "Pitch Black", hex: "#09090b" },
              { name: "Washed Slate", hex: "#475569" },
              { name: "Bone White", hex: "#f1f5f9" }
            ],
        variants: p.variants
      };
    });

    return [...baseItems, ...CURATED_CATALOG_EXPANSION];
  }, [products]);

  // Filtered & Sorted Catalog
  const displayedCatalog = useMemo(() => {
    return fullCatalog
      .filter((item) => {
        if (activeDepartment !== "all" && item.category !== activeDepartment) {
          return false;
        }
        if (priceFilter === "under-50" && item.price >= 50) return false;
        if (priceFilter === "50-100" && (item.price < 50 || item.price > 100)) return false;
        if (priceFilter === "over-100" && item.price <= 100) return false;
        if (sizeFilter !== "all" && !item.sizes?.includes(sizeFilter)) return false;
        if (activeTab === "sale" && (!item.comparePrice || item.comparePrice <= item.price)) return false;
        if (activeTab === "new" && !item.badge?.toLowerCase().includes("new")) return false;
        if (activeTab === "bestsellers") {
          const isBestseller = item.badge?.toLowerCase().includes("seller") || (item.rating && item.rating >= 4.9);
          if (!isBestseller) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
        return 0;
      });
  }, [fullCatalog, activeDepartment, priceFilter, sizeFilter, activeTab, sortBy]);

  const sharedProps = {
    storeDisplayName,
    tenantSlug,
    displayedCatalog,
    cartItems,
    wishlist,
    finalTotal,
    currency,
    formatPrice,
    activeDepartment,
    setActiveDepartment,
    activeTab,
    setActiveTab,
    priceFilter,
    setPriceFilter,
    sizeFilter,
    setSizeFilter,
    sortBy,
    setSortBy,
    selectedColors,
    handleColorSelect,
    handleQuickSizeAdd,
    handleOpenQuickView,
    onAddToCart,
    onToggleWishlist,
    onOpenProduct,
    onOpenCart,
    onOpenSearch,
    onOpenCheckout,
    onOpenTrackOrder,
    setIsSizeGuideOpen,
    onSelectFashionStyle: setSelectedFashionStyle
  };

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased">
      {/* ─── Fashion Reference Template Selector Bar (Ref 1, Ref 2, Ref 3) ─── */}
      <div className="sticky top-0 z-50 bg-[#121214] text-white border-b border-neutral-800 shadow-xl py-2 px-4 font-sans text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-300">
              Template Archetype:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setSelectedFashionStyle("boutique")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition flex items-center space-x-1.5 ${
                selectedFashionStyle === "boutique"
                  ? "bg-[#422216] text-[#f5eae3] border border-[#a45d3e] shadow-md font-bold scale-105"
                  : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white"
              }`}
            >
              <span>Template 1: The Boutique (Ref 1)</span>
            </button>

            <button
              onClick={() => setSelectedFashionStyle("milano")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition flex items-center space-x-1.5 ${
                selectedFashionStyle === "milano"
                  ? "bg-white text-black shadow-md font-bold scale-105"
                  : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white"
              }`}
            >
              <span>Template 2: Milano Streetwear (Ref 2)</span>
            </button>

            <button
              onClick={() => setSelectedFashionStyle("trend")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition flex items-center space-x-1.5 ${
                selectedFashionStyle === "trend"
                  ? "bg-[#ffd630] text-black shadow-md font-bold scale-105"
                  : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white"
              }`}
            >
              <span>Template 3: High-Street Trend (Ref 3)</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── Render Active Sub-Template ──────────────────────────────────────── */}
      {selectedFashionStyle === "boutique" && <BoutiqueStyle {...sharedProps} />}
      {selectedFashionStyle === "milano" && <MilanoStyle {...sharedProps} />}
      {selectedFashionStyle === "trend" && <TrendStyle {...sharedProps} />}

      {/* ─── Universal Quick View Modal (Ella / WoodMart Signature) ─────────── */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-white text-neutral-950 rounded-xl max-w-3xl w-full p-6 sm:p-8 border border-neutral-200 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-black p-1.5 rounded-lg transition z-20"
              aria-label="Close Quick View"
            >
              <X className="w-5 h-5 stroke-[1.75]" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* Gallery */}
              <div className="space-y-3">
                <div className="relative aspect-[3/4] bg-neutral-100 rounded-lg overflow-hidden">
                  <img
                    src={
                      quickViewImageAngle === "primary"
                        ? quickViewProduct.imageUrl
                        : quickViewProduct.secondaryImage || quickViewProduct.imageUrl
                    }
                    alt={quickViewProduct.title}
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                  {quickViewProduct.badge && (
                    <span className="absolute top-3 left-3 text-[9px] font-sans uppercase tracking-[0.2em] bg-black text-white px-2 py-0.5 rounded-full font-medium">
                      {quickViewProduct.badge}
                    </span>
                  )}
                </div>

                {quickViewProduct.secondaryImage && (
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setQuickViewImageAngle("primary")}
                      className={`w-14 h-16 rounded-md overflow-hidden border-2 transition ${
                        quickViewImageAngle === "primary"
                          ? "border-black"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={quickViewProduct.imageUrl} alt="Front angle" className="w-full h-full object-cover" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickViewImageAngle("secondary")}
                      className={`w-14 h-16 rounded-md overflow-hidden border-2 transition ${
                        quickViewImageAngle === "secondary"
                          ? "border-black"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={quickViewProduct.secondaryImage} alt="Lookbook angle" className="w-full h-full object-cover" />
                    </button>
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-neutral-400 block font-medium">
                    Atelier Studio Grade
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif text-neutral-950 mt-1">
                    {quickViewProduct.title}
                  </h3>
                  <div className="flex items-center space-x-2 pt-1 text-xs text-neutral-500">
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    <span className="font-semibold text-neutral-900">{quickViewProduct.rating || 4.9}</span>
                    <span>•</span>
                    <span className="text-neutral-400">({quickViewProduct.reviewCount || 48} reviews)</span>
                  </div>
                </div>

                <div className="flex items-baseline space-x-3 pt-1 border-y border-neutral-100 py-3">
                  <span className="text-2xl font-bold text-black font-sans tabular-nums">
                    {formatPrice(quickViewProduct.price)}
                  </span>
                  {quickViewProduct.comparePrice > quickViewProduct.price && (
                    <span className="text-xs text-neutral-400 line-through font-sans tabular-nums">
                      {formatPrice(quickViewProduct.comparePrice)}
                    </span>
                  )}
                </div>

                <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                  {quickViewProduct.description}
                </p>

                {/* Urgency Stock Meter */}
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-md flex items-center space-x-2 text-xs text-amber-900 font-sans">
                  <Flame className="w-4 h-4 text-amber-600 fill-current flex-shrink-0" />
                  <span><strong>Low Stock Urgency:</strong> Only 4 pieces remain in current allocation.</span>
                </div>

                {/* Size Selector */}
                {quickViewProduct.sizes && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-neutral-700">Size:</span>
                      <button
                        type="button"
                        onClick={() => setIsSizeGuideOpen(true)}
                        className="text-[11px] text-neutral-500 hover:text-black underline transition"
                      >
                        Size Guide
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {quickViewProduct.sizes.map((sz: string) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setQuickViewSelectedSize(sz)}
                          className={`px-3 py-1.5 rounded-md text-xs font-semibold font-sans transition ${
                            quickViewSelectedSize === sz
                              ? "bg-black text-white"
                              : "bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity & Add to Bag */}
                <div className="pt-3 flex items-center space-x-3">
                  <div className="flex items-center border border-neutral-300 rounded-md">
                    <button
                      type="button"
                      onClick={() => setQuickViewQty(Math.max(1, quickViewQty - 1))}
                      className="p-2 hover:bg-neutral-100 text-neutral-600 transition"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 text-xs font-bold font-sans tabular-nums">{quickViewQty}</span>
                    <button
                      type="button"
                      onClick={() => setQuickViewQty(quickViewQty + 1)}
                      className="p-2 hover:bg-neutral-100 text-neutral-600 transition"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      for (let i = 0; i < quickViewQty; i++) {
                        handleQuickSizeAdd(quickViewProduct, quickViewSelectedSize || "M");
                      }
                      setQuickViewProduct(null);
                    }}
                    className="flex-1 py-3 px-6 bg-black hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-[0.2em] transition flex items-center justify-center space-x-2 rounded-md active:scale-98 shadow-sm"
                  >
                    <ShoppingBag className="w-4 h-4 stroke-[1.75]" />
                    <span>Add to Bag • {formatPrice(quickViewProduct.price * quickViewQty)}</span>
                  </button>
                </div>

                <div className="pt-2 grid grid-cols-2 gap-2 text-[10px] text-neutral-500 font-sans border-t border-neutral-100">
                  <span className="flex items-center space-x-1.5"><Truck className="w-3 h-3 text-neutral-700" /><span>Free Courier Over $100</span></span>
                  <span className="flex items-center space-x-1.5"><ShieldCheck className="w-3 h-3 text-neutral-700" /><span>Doorstep Fit Trial</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Size & Fit Guide Modal ──────────────────────────────────────────── */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in font-sans">
          <div className="bg-white text-neutral-950 rounded-xl max-w-xl w-full p-6 sm:p-8 border border-neutral-200 shadow-2xl relative overflow-hidden">
            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-black p-1.5 rounded-lg transition"
              aria-label="Close"
            >
              <X className="w-5 h-5 stroke-[1.75]" />
            </button>

            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                <div>
                  <h3 className="text-xl font-normal uppercase tracking-tight text-neutral-950 font-serif">
                    Size & Proportions Guide
                  </h3>
                  <p className="text-xs text-neutral-500 font-sans mt-0.5">
                    Garments fit true to size with tailored ease.
                  </p>
                </div>
                <div className="flex items-center bg-neutral-100 p-0.5 rounded-lg text-xs font-semibold">
                  <button
                    onClick={() => setSizeGuideUnit("in")}
                    className={`px-3 py-1 rounded transition ${sizeGuideUnit === "in" ? "bg-white text-black shadow-xs" : "text-neutral-500"}`}
                  >
                    Inches
                  </button>
                  <button
                    onClick={() => setSizeGuideUnit("cm")}
                    className={`px-3 py-1 rounded transition ${sizeGuideUnit === "cm" ? "bg-white text-black shadow-xs" : "text-neutral-500"}`}
                  >
                    CM
                  </button>
                </div>
              </div>

              {/* Tops Table */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-black block">
                  Tops & Outerwear
                </span>
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-neutral-200 text-neutral-400 text-[10px] uppercase font-mono">
                      <th className="py-2">Size</th>
                      <th className="py-2">Chest</th>
                      <th className="py-2">Shoulder</th>
                      <th className="py-2">Length</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 font-medium text-neutral-800">
                    <tr>
                      <td className="py-2 font-bold">S</td>
                      <td className="py-2">{sizeGuideUnit === "in" ? '42.0"' : "106 cm"}</td>
                      <td className="py-2">{sizeGuideUnit === "in" ? '20.5"' : "52 cm"}</td>
                      <td className="py-2">{sizeGuideUnit === "in" ? '28.0"' : "71 cm"}</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-bold">M</td>
                      <td className="py-2">{sizeGuideUnit === "in" ? '44.5"' : "113 cm"}</td>
                      <td className="py-2">{sizeGuideUnit === "in" ? '21.5"' : "54 cm"}</td>
                      <td className="py-2">{sizeGuideUnit === "in" ? '29.0"' : "73 cm"}</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-bold">L</td>
                      <td className="py-2">{sizeGuideUnit === "in" ? '47.0"' : "119 cm"}</td>
                      <td className="py-2">{sizeGuideUnit === "in" ? '22.5"' : "57 cm"}</td>
                      <td className="py-2">{sizeGuideUnit === "in" ? '30.0"' : "76 cm"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-neutral-50 rounded-lg text-xs text-neutral-600 flex items-start space-x-2">
                <Info className="w-4 h-4 text-neutral-500 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Doorstep Fit Verification:</strong> Try on your items upon arrival before payment. Exchange at no extra cost.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Social Proof Live Order Activity Toast ─────────────────────────── */}
      {!isSalesToastDismissed && (
        <div className="fixed bottom-4 left-4 z-40 hidden sm:flex items-center space-x-3 p-3 bg-white/95 backdrop-blur-md border border-neutral-200/90 shadow-xl rounded-xl max-w-sm animate-fade-in font-sans text-neutral-900">
          <img
            src={RECENT_SALES[salesToastIndex].image}
            alt="Recent order"
            className="w-11 h-13 object-cover rounded-md flex-shrink-0"
          />
          <div className="min-w-0 flex-1 text-xs">
            <div className="flex items-center space-x-1 text-[10px] text-neutral-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              <span>Verified Order • {RECENT_SALES[salesToastIndex].city}</span>
            </div>
            <p className="font-semibold text-neutral-950 truncate mt-0.5">
              {RECENT_SALES[salesToastIndex].item}
            </p>
            <div className="flex items-center justify-between text-[10px] text-neutral-500 mt-0.5">
              <span className="font-bold text-black">{formatPrice(RECENT_SALES[salesToastIndex].price)}</span>
              <span>{RECENT_SALES[salesToastIndex].time}</span>
            </div>
          </div>
          <button
            onClick={() => setIsSalesToastDismissed(true)}
            className="text-neutral-400 hover:text-black p-1 transition"
            title="Dismiss notification"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
