"use client";

import { useState, useMemo } from "react";
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
  ChevronRight,
  Star,
  ShieldCheck,
  RotateCcw,
  Lock,
  ExternalLink,
  Package,
  Check,
  Sparkles,
  Layers,
  ArrowUpRight,
  Tag,
  Mail,
  Globe
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

// 6 Visual Department Categories with Editorial Fashion Studio Imagery
const FASHION_DEPARTMENTS = [
  {
    id: "tees",
    number: "01",
    title: "Oversized Tees",
    subtitle: "280 GSM Organic Cotton",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=85",
    tag: "Essential Drop"
  },
  {
    id: "denim",
    number: "02",
    title: "Kurabo Denim",
    subtitle: "13.5oz Raw Selvedge",
    image: "https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=85",
    tag: "Shuttle Loom"
  },
  {
    id: "hoodies",
    number: "03",
    title: "Hoodies & Knits",
    subtitle: "450 GSM Loopback Terry",
    image: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&auto=format&fit=crop&q=85",
    tag: "Structural Fit"
  },
  {
    id: "outerwear",
    number: "04",
    title: "Tailored Coats",
    subtitle: "Bonded Italian Wool",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=85",
    tag: "Atelier Line"
  },
  {
    id: "footwear",
    number: "05",
    title: "Bench Footwear",
    subtitle: "Goodyear Welted Leather",
    image: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=800&auto=format&fit=crop&q=85",
    tag: "Hand-Lasted"
  },
  {
    id: "accessories",
    number: "06",
    title: "Leather Goods",
    subtitle: "Full-Grain Minimal Carry",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=85",
    tag: "Handcrafted"
  }
];

// Rich Curated Catalog for Universal 4-Column Visual Density (5 Additional Archival Pieces)
const CURATED_CATALOG_EXPANSION = [
  {
    id: "cat-exp-4",
    title: "Bonded Wool Tailored Overcoat",
    slug: "bonded-wool-tailored-overcoat",
    category: "outerwear",
    description: "Architectural structured overcoat tailored in 520 GSM bonded Italian wool twill with horn buttons and satin lining.",
    price: 185.0,
    comparePrice: 250.0,
    imageUrl: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1000&auto=format&fit=crop&q=85",
    secondaryImage: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=1000&auto=format&fit=crop&q=85",
    badge: "New Season",
    rating: 5.0,
    fabricBadge: "520 GSM Wool",
    fabricSub: "Bonded Italian Twill // Horn Buttons",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Charcoal Melange", hex: "#27272a" },
      { name: "Camel", hex: "#b45309" }
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
    secondaryImage: "https://images.unsplash.com/photo-1542272604-780c96856592?w=1000&auto=format&fit=crop&q=85",
    badge: "Japanese Mill",
    rating: 4.9,
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
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>({});
  const [, setSelectedSizes] = useState<Record<string, string>>({});
  const [activeDepartment, setActiveDepartment] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"trending" | "new" | "bestsellers" | "sale">("trending");
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

  // Harmonized Complete Store Catalog (Combining Base Products + Rich Curated Pieces)
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
        if (activeTab === "sale" && item.comparePrice <= item.price) {
          return false;
        }
        if (activeTab === "bestsellers" && !item.badge?.toLowerCase().includes("seller")) {
          return true;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return 0;
      });
  }, [fullCatalog, activeDepartment, activeTab, sortBy]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white text-neutral-950 selection:bg-neutral-900 selection:text-white antialiased">
      {/* ─── 1. Top Announcement Strip (Refined Luxury Sans) ───────────────── */}
      <div className="py-2.5 px-4 bg-neutral-950 text-neutral-300 text-[10px] font-sans tracking-[0.25em] uppercase text-center border-b border-neutral-900">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="hidden lg:inline-block text-neutral-400 font-medium">
            AUTUMN / WINTER 2026 ARCHIVE
          </span>
          <span className="mx-auto lg:mx-0 font-medium text-neutral-200">
            COMPLIMENTARY WORLDWIDE DELIVERY OVER $100 • 14-DAY DOORSTEP FIT TRIAL
          </span>
          <span className="hidden lg:inline-block text-neutral-400 font-medium">
            CERTIFIED ORGANIC TEXTILES
          </span>
        </div>
      </div>

      {/* ─── 2. Enterprise Fashion Header (SSENSE / COS Benchmark) ─────────── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/70 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
          {/* Mobile: Hamburger Menu Toggle (< lg) */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              className="p-2 -ml-2 text-neutral-900 hover:text-black transition"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5 stroke-[1.75]" />
            </button>
            <button
              type="button"
              onClick={onOpenSearch}
              className="p-2 text-neutral-700 hover:text-black transition sm:hidden"
              aria-label="Search"
            >
              <Search className="w-4 h-4 stroke-[1.75]" />
            </button>
          </div>

          {/* Left: Brand Wordmark (Anchored Left, Never Wraps) */}
          <Link
            href={`/store/${tenantSlug}`}
            className="flex flex-col items-start group flex-shrink-0"
          >
            <span className="text-xl sm:text-2xl font-normal tracking-[0.28em] uppercase text-black font-serif block leading-none whitespace-nowrap">
              {storeDisplayName}
            </span>
            <span className="text-[9px] font-sans tracking-[0.35em] uppercase text-neutral-400 block mt-1.5 font-medium">
              ATELIER ARCHIVE // EST. 2026
            </span>
          </Link>

          {/* Center: Department Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-7 text-[11px] font-sans font-medium uppercase tracking-[0.2em] text-neutral-500">
            <button
              onClick={() => setActiveDepartment("all")}
              className={`hover:text-black transition-colors py-1 ${
                activeDepartment === "all" ? "text-black border-b border-black font-semibold" : ""
              }`}
            >
              All Pieces
            </button>
            <button
              onClick={() => setActiveDepartment("outerwear")}
              className={`hover:text-black transition-colors py-1 ${
                activeDepartment === "outerwear" ? "text-black border-b border-black font-semibold" : ""
              }`}
            >
              Outerwear
            </button>
            <button
              onClick={() => setActiveDepartment("tees")}
              className={`hover:text-black transition-colors py-1 ${
                activeDepartment === "tees" ? "text-black border-b border-black font-semibold" : ""
              }`}
            >
              Tees
            </button>
            <button
              onClick={() => setActiveDepartment("denim")}
              className={`hover:text-black transition-colors py-1 ${
                activeDepartment === "denim" ? "text-black border-b border-black font-semibold" : ""
              }`}
            >
              Denim
            </button>
            <button
              onClick={() => setActiveDepartment("hoodies")}
              className={`hover:text-black transition-colors py-1 ${
                activeDepartment === "hoodies" ? "text-black border-b border-black font-semibold" : ""
              }`}
            >
              Knitwear
            </button>
            <a href="#lookbook" className="hover:text-black transition-colors py-1">
              Lookbook
            </a>
          </nav>

          {/* Right: Functional Shopping Controls */}
          <div className="flex items-center space-x-2 sm:space-x-4 text-neutral-800 flex-shrink-0">
            <button
              onClick={onOpenSearch}
              className="hidden sm:flex hover:text-black transition items-center space-x-1.5 py-1.5 px-3 rounded-full hover:bg-neutral-100 text-xs font-sans uppercase tracking-[0.18em]"
              title="Search collection"
            >
              <Search className="w-3.5 h-3.5 stroke-[1.75]" />
              <span className="text-[11px] font-medium">Search</span>
            </button>

            <button
              onClick={() => toastSuccess("Wishlist", `${wishlist.length} piece(s) saved.`)}
              className="hover:text-black transition relative p-2 rounded-full hover:bg-neutral-100"
              title="Saved items"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4 stroke-[1.75]" />
              {wishlist.length > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-black text-white text-[9px] font-bold rounded-full flex items-center justify-center font-sans">
                  {wishlist.length}
                </span>
              )}
            </button>

            {onOpenTrackOrder && (
              <button
                type="button"
                onClick={onOpenTrackOrder}
                className="hidden md:flex items-center space-x-1.5 hover:text-black text-[11px] font-sans tracking-[0.18em] uppercase py-1.5 px-3 rounded-full hover:bg-neutral-100 transition"
                title="Track order"
              >
                <Truck className="w-3.5 h-3.5 stroke-[1.75] text-neutral-500" />
                <span className="font-medium">Track</span>
              </button>
            )}

            <button
              onClick={onOpenCart}
              className="py-2 px-3.5 bg-black hover:bg-neutral-800 text-white rounded-full text-[11px] font-sans uppercase tracking-[0.18em] font-medium transition flex items-center space-x-2 active:scale-95 shadow-xs"
            >
              <ShoppingBag className="w-3.5 h-3.5 stroke-[1.75]" />
              <span>Bag</span>
              <span className="w-4 h-4 bg-white text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                {cartItems.reduce((s, i) => s + i.quantity, 0)}
              </span>
              {cartItems.length > 0 && (
                <span className="hidden sm:inline border-l border-neutral-700 pl-2 tabular-nums">
                  ${finalTotal.toFixed(2)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ─── Mobile Navigation Slide-Out Drawer ───────────────────────────── */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden animate-fade-in font-sans">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileNavOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto border-r border-neutral-200">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-neutral-100">
                <div>
                  <span className="font-serif text-lg tracking-[0.25em] uppercase font-normal text-black block">
                    {storeDisplayName}
                  </span>
                  <span className="text-[9px] font-sans tracking-[0.3em] uppercase text-neutral-400 font-medium">
                    Studio Archive // 2026
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileNavOpen(false)}
                  className="p-2 text-neutral-500 hover:text-black rounded-lg transition"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 stroke-[1.75]" />
                </button>
              </div>

              <div className="py-6 space-y-4">
                <p className="text-[10px] font-sans uppercase tracking-[0.25em] text-neutral-400 font-semibold">
                  Shop By Category
                </p>
                <nav className="flex flex-col space-y-2 text-xs uppercase tracking-[0.16em] font-medium text-neutral-800">
                  <button
                    onClick={() => {
                      setActiveDepartment("all");
                      setIsMobileNavOpen(false);
                    }}
                    className={`text-left py-2 flex items-center justify-between transition ${
                      activeDepartment === "all" ? "text-black font-bold pl-2 border-l-2 border-black" : "hover:text-black"
                    }`}
                  >
                    <span>All Pieces ({fullCatalog.length})</span>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                  </button>
                  <button
                    onClick={() => {
                      setActiveDepartment("outerwear");
                      setIsMobileNavOpen(false);
                    }}
                    className={`text-left py-2 flex items-center justify-between transition ${
                      activeDepartment === "outerwear" ? "text-black font-bold pl-2 border-l-2 border-black" : "hover:text-black"
                    }`}
                  >
                    <span>Tailored Wool Overcoats</span>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                  </button>
                  <button
                    onClick={() => {
                      setActiveDepartment("tees");
                      setIsMobileNavOpen(false);
                    }}
                    className={`text-left py-2 flex items-center justify-between transition ${
                      activeDepartment === "tees" ? "text-black font-bold pl-2 border-l-2 border-black" : "hover:text-black"
                    }`}
                  >
                    <span>280 GSM Heavyweight Tees</span>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                  </button>
                  <button
                    onClick={() => {
                      setActiveDepartment("denim");
                      setIsMobileNavOpen(false);
                    }}
                    className={`text-left py-2 flex items-center justify-between transition ${
                      activeDepartment === "denim" ? "text-black font-bold pl-2 border-l-2 border-black" : "hover:text-black"
                    }`}
                  >
                    <span>Kurabo Selvedge Denim</span>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                  </button>
                  <button
                    onClick={() => {
                      setActiveDepartment("hoodies");
                      setIsMobileNavOpen(false);
                    }}
                    className={`text-left py-2 flex items-center justify-between transition ${
                      activeDepartment === "hoodies" ? "text-black font-bold pl-2 border-l-2 border-black" : "hover:text-black"
                    }`}
                  >
                    <span>French Terry Knitwear</span>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                  </button>
                </nav>
              </div>

              <div className="py-4 border-t border-neutral-100 space-y-3">
                <p className="text-[10px] font-sans uppercase tracking-[0.25em] text-neutral-400 font-semibold">
                  Editorial & Standards
                </p>
                <div className="flex flex-col space-y-2 text-xs uppercase tracking-[0.16em] font-medium text-neutral-600">
                  <a
                    href="#lookbook"
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

            <div className="pt-6 border-t border-neutral-100 space-y-3">
              {onOpenTrackOrder && (
                <button
                  onClick={() => {
                    setIsMobileNavOpen(false);
                    onOpenTrackOrder();
                  }}
                  className="w-full py-2.5 px-3 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs uppercase tracking-wider font-medium flex items-center justify-center space-x-2 transition"
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
                  className="w-full py-2.5 px-3 rounded-lg bg-black text-white text-xs uppercase tracking-wider font-semibold flex items-center justify-center space-x-2 hover:bg-neutral-800 transition"
                >
                  <span>1-Page Express Checkout</span>
                </button>
              )}

              <p className="text-[10px] font-sans text-neutral-400 text-center tracking-wide pt-2">
                Doorstep Fit Inspection • Free Exchanges
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── 3. Full-Bleed Editorial Campaign Hero ─────────────────────────── */}
      <section className="relative w-full h-[80vh] min-h-[560px] max-h-[800px] bg-neutral-950 overflow-hidden flex items-end">
        <img
          src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1920&auto=format&fit=crop&q=85"
          alt="Campaign Hero"
          className="absolute inset-0 w-full h-full object-cover object-top opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 sm:pb-20 w-full text-white space-y-4">
          <span className="text-[11px] font-sans tracking-[0.35em] uppercase text-neutral-300 block font-medium">
            Autumn / Winter 2026 Campaign • Drop 01
          </span>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-normal uppercase tracking-tight text-white font-serif leading-none">
            The Archival Silhouette.
          </h1>

          <p className="text-xs sm:text-sm text-neutral-300 max-w-xl leading-relaxed font-normal">
            Constructed in dense 280 GSM organic cotton and raw 13.5oz Kurabo shuttle-loom selvedge. Engineered for architectural volume, lasting shoulder geometry, and zero fabric warping.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <a
              href="#catalog"
              className="px-8 py-3.5 bg-white hover:bg-neutral-100 text-black text-xs font-semibold uppercase tracking-[0.2em] transition rounded-xs"
            >
              Shop Collection
            </a>
            <a
              href="#lookbook"
              className="px-8 py-3.5 bg-black/50 hover:bg-black text-white border border-white/40 text-xs font-semibold uppercase tracking-[0.2em] transition backdrop-blur-sm rounded-xs"
            >
              View Lookbook
            </a>
          </div>
        </div>
      </section>

      {/* ─── 4. Shop By Category (Visual Department Grid) ──────────────────── */}
      <section className="py-16 sm:py-20 border-b border-neutral-100 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-neutral-200 gap-4">
            <div>
              <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-neutral-400 block font-medium">
                Core Departments
              </span>
              <h2 className="text-2xl sm:text-3xl font-normal uppercase tracking-tight text-black font-serif mt-1">
                Shop By Category
              </h2>
            </div>
            <p className="text-xs text-neutral-500 font-sans tracking-wider">
              6 Tailored Industry Architectures
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {FASHION_DEPARTMENTS.map((dept) => (
              <div
                key={dept.id}
                onClick={() => {
                  setActiveDepartment(dept.id);
                  const el = document.getElementById("catalog");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="group relative aspect-[3/4] overflow-hidden bg-neutral-200 cursor-pointer rounded-xs"
              >
                <img
                  src={dept.image}
                  alt={dept.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-2.5 left-2.5 text-[8px] font-sans tracking-wider uppercase text-white bg-black/60 px-1.5 py-0.5 rounded-xs font-medium">
                  {dept.tag}
                </div>
                <div className="absolute inset-x-2.5 bottom-2.5 text-white space-y-0.5">
                  <span className="text-[9px] font-sans tracking-widest text-neutral-400 block font-medium">{dept.number}</span>
                  <h3 className="text-xs font-semibold uppercase tracking-wider font-serif">
                    {dept.title}
                  </h3>
                  <p className="text-[9px] text-neutral-300 font-sans line-clamp-1">
                    {dept.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5. Production-Grade Product Catalog Grid ──────────────────────── */}
      <main id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-10 border-b border-neutral-200 gap-4">
          {/* Collection Tab Switchers */}
          <div className="flex items-center space-x-6 overflow-x-auto text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
            <button
              onClick={() => setActiveTab("trending")}
              className={`hover:text-black transition whitespace-nowrap pb-1 ${
                activeTab === "trending" ? "text-black border-b-2 border-black font-bold" : ""
              }`}
            >
              Trending Now
            </button>
            <button
              onClick={() => setActiveTab("new")}
              className={`hover:text-black transition whitespace-nowrap pb-1 ${
                activeTab === "new" ? "text-black border-b-2 border-black font-bold" : ""
              }`}
            >
              New Arrivals
            </button>
            <button
              onClick={() => setActiveTab("bestsellers")}
              className={`hover:text-black transition whitespace-nowrap pb-1 ${
                activeTab === "bestsellers" ? "text-black border-b-2 border-black font-bold" : ""
              }`}
            >
              Best Sellers
            </button>
            <button
              onClick={() => setActiveTab("sale")}
              className={`hover:text-black transition whitespace-nowrap pb-1 ${
                activeTab === "sale" ? "text-rose-600 border-b-2 border-rose-600 font-bold" : ""
              }`}
            >
              Sale Archives
            </button>
          </div>

          {/* Department Filter & Sort Dropdown */}
          <div className="flex items-center space-x-3 text-xs text-neutral-600 font-sans self-end sm:self-auto">
            <span className="text-[11px] text-neutral-400 font-medium">
              Showing {displayedCatalog.length} pieces
            </span>
            <span>•</span>
            <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-medium outline-none cursor-pointer text-neutral-900 uppercase text-[10px] tracking-[0.15em]"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>
        </div>

        {/* 4-Column Responsive Universal Fashion Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 sm:gap-x-7 gap-y-12 sm:gap-y-14">
          {displayedCatalog.map((p) => {
            const isWishlisted = wishlist.includes(p.id);
            const currentColor = selectedColors[p.id] || p.colors[0]?.name || "Standard";

            return (
              <div key={p.id} className="group flex flex-col justify-between">
                {/* Product Image Stage */}
                <div
                  className="relative aspect-[3/4] bg-[#f7f7f7] overflow-hidden cursor-pointer rounded-xs"
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

                  {/* Badges in Top Left */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col space-y-1 items-start">
                    <span className="text-[9px] font-sans tracking-[0.2em] uppercase bg-black text-white px-2 py-0.5 rounded-xs pointer-events-none font-medium">
                      {p.badge}
                    </span>
                    {p.comparePrice > p.price && (
                      <span className="text-[9px] font-sans tracking-[0.2em] uppercase bg-rose-600 text-white px-2 py-0.5 rounded-xs pointer-events-none font-medium">
                        Save {Math.round(((p.comparePrice - p.price) / p.comparePrice) * 100)}%
                      </span>
                    )}
                  </div>

                  {/* Wishlist Heart */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(p.id);
                    }}
                    className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-neutral-800 hover:text-black opacity-85 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shadow-xs"
                    title="Save to wishlist"
                    aria-label="Save to wishlist"
                  >
                    <Heart className={`w-3.5 h-3.5 stroke-[1.75] ${isWishlisted ? "text-black fill-current" : ""}`} />
                  </button>

                  {/* Desktop Quick Size Selector Bar (Slides up smoothly on hover) */}
                  <div className="hidden sm:flex absolute inset-x-3 bottom-3 p-1.5 bg-white/95 backdrop-blur-md border border-white/60 shadow-lg translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out z-10 items-center justify-between text-neutral-900 rounded-xs">
                    <span className="text-[9px] font-sans uppercase tracking-wider text-neutral-400 pl-1 font-medium">
                      Quick Add
                    </span>
                    <div className="flex items-center space-x-1">
                      {p.sizes.map((sz: string) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickSizeAdd(p, sz);
                          }}
                          className="w-6 h-6 rounded text-[10px] font-sans font-medium hover:bg-black hover:text-white transition flex items-center justify-center text-neutral-800"
                          title={`Add Size ${sz} to Bag`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Minimalist Information Below Image */}
                <div className="pt-3.5 space-y-1.5">
                  {/* Swatches & Color Name */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      {p.colors.map((c: any) => {
                        const isSel = currentColor === c.name;
                        return (
                          <button
                            key={c.name}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleColorSelect(p.id, c.name);
                            }}
                            className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all ${
                              isSel ? "ring-1 ring-black ring-offset-2 scale-110" : "opacity-75 hover:opacity-100"
                            }`}
                            title={c.name}
                          >
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-black/15"
                              style={{ backgroundColor: c.hex }}
                            />
                          </button>
                        );
                      })}
                    </div>
                    <span className="text-[9px] font-sans text-neutral-400 uppercase tracking-wider truncate max-w-[120px] font-medium">
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

                  {/* Fabric Description Subline */}
                  <p className="text-[10px] text-neutral-400 font-sans tracking-tight truncate">
                    {p.fabricSub}
                  </p>

                  {/* Price & Rating */}
                  <div className="flex items-center justify-between pt-0.5">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-xs sm:text-sm font-semibold text-black font-sans tabular-nums">
                        ${p.price.toFixed(2)}
                      </span>
                      {p.comparePrice > p.price && (
                        <span className="text-[10px] text-neutral-400 line-through font-sans tabular-nums">
                          ${p.comparePrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-1 text-[11px] text-neutral-500">
                      <Star className="w-3 h-3 text-amber-500 fill-current" />
                      <span className="font-sans text-[10px] font-medium">{p.rating}</span>
                    </div>
                  </div>

                  {/* Mobile Quick-Add Size Strip (< sm) */}
                  <div className="sm:hidden pt-2 border-t border-neutral-100 flex items-center justify-between gap-1">
                    <span className="text-[9px] font-sans uppercase tracking-wider text-neutral-400 font-medium">
                      Size:
                    </span>
                    <div className="flex items-center gap-1">
                      {p.sizes.map((sz: string) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickSizeAdd(p, sz);
                          }}
                          className="px-1.5 py-0.5 rounded bg-neutral-100 hover:bg-black hover:text-white text-[9px] font-sans font-medium text-neutral-800 transition active:scale-95"
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

      {/* ─── 6. Shoppable Lookbook Ensemble ("The Modern Minimalist Kit") ───── */}
      <section id="lookbook" className="py-20 border-t border-neutral-200 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto text-center space-y-3 mb-16">
            <span className="text-[11px] font-sans tracking-[0.3em] uppercase text-neutral-400 block font-medium">
              Curated Outfits // Look 01
            </span>
            <h2 className="text-3xl sm:text-4xl font-normal uppercase tracking-tight text-black font-serif">
              Shop The Complete Look
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto leading-relaxed">
              Coordinated proportions and fabric weights designed by our studio stylists for a complete architectural silhouette.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Visual Diptych */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="aspect-[3/4] overflow-hidden bg-neutral-200 rounded-xs">
                <img
                  src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1000&auto=format&fit=crop&q=85"
                  alt="Ensemble Look 01"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-[3/4] overflow-hidden bg-neutral-200 rounded-xs hidden sm:block">
                <img
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=1000&auto=format&fit=crop&q=85"
                  alt="Ensemble Look 02"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Look Breakdown & 1-Click Purchase */}
            <div className="lg:col-span-5 space-y-6 lg:pl-4 bg-white p-8 rounded-xs border border-neutral-200 shadow-sm font-sans">
              <div className="space-y-1.5">
                <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-neutral-400 block font-medium">
                  Atelier Ensemble // Complete Set
                </span>
                <h3 className="text-2xl font-normal uppercase tracking-tight text-black font-serif">
                  The Modern Minimalist Kit
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                  Combining the 280 GSM combed organic cotton tee with 13.5oz raw Kurabo shuttle-loom selvedge denim.
                </p>
              </div>

              {/* Pieces Included */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between py-2.5 border-b border-neutral-100 text-xs">
                  <div>
                    <span className="font-semibold text-neutral-900 block">Heavyweight Organic Oversized Tee</span>
                    <span className="text-[10px] text-neutral-400 font-sans">280 GSM • Washed Slate</span>
                  </div>
                  <span className="font-sans font-semibold tabular-nums">$34.00</span>
                </div>

                <div className="flex items-center justify-between py-2.5 border-b border-neutral-100 text-xs">
                  <div>
                    <span className="font-semibold text-neutral-900 block">Japanese Selvedge Taper Denim</span>
                    <span className="text-[10px] text-neutral-400 font-sans">13.5oz Kurabo • Raw Indigo</span>
                  </div>
                  <span className="font-sans font-semibold tabular-nums">$98.00</span>
                </div>
              </div>

              {/* Total & Action */}
              <div className="pt-2 space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-neutral-500 uppercase font-sans tracking-wider">Bundle Price</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold font-sans text-black tabular-nums">$132.00</span>
                    <span className="text-[11px] text-neutral-400 line-through font-sans block tabular-nums">$188.00</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (products[0]) onAddToCart(products[0], products[0].variants[0]);
                    if (products[1]) onAddToCart(products[1], products[1].variants[0]);
                  }}
                  className="w-full py-4 bg-black hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-[0.2em] transition flex items-center justify-center space-x-2 rounded-xs"
                >
                  <ShoppingBag className="w-4 h-4 stroke-[1.75]" />
                  <span>Add Complete Look to Bag ($132.00)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. Standards of Craft & Fabric Philosophy (Editorial 3-Column) ──── */}
      <section className="py-20 border-t border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-14">
            <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-neutral-400 block font-medium">
              Material Ethics & Longevity
            </span>
            <h2 className="text-3xl font-normal uppercase tracking-tight text-black font-serif">
              The Standards of Atelier Craft
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            <div className="space-y-3">
              <span className="text-2xl font-serif text-neutral-400 font-normal block">01</span>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-black">
                Japanese Shuttle Looms
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed font-sans">
                Woven in Kojima on antique Toyoda shuttle looms with genuine redline ID. High-density indigo warp yarns fade organically with wear.
              </p>
            </div>

            <div className="space-y-3">
              <span className="text-2xl font-serif text-neutral-400 font-normal block">02</span>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-black">
                280 GSM Organic Cotton
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed font-sans">
                Combed long-staple ring-spun cotton with silk-soft handfeel and zero shrinkage. Double-stitched neckline guarantees lasting collar drape.
              </p>
            </div>

            <div className="space-y-3">
              <span className="text-2xl font-serif text-neutral-400 font-normal block">03</span>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-black">
                Architectural Drape
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed font-sans">
                Engineered drop-shoulder silhouette drafted in Stockholm. Clean proportions that maintain structural poise across every body type.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 8. Customer Trust & Value Propositions (4 Pillars) ─────────────── */}
      <section id="standards" className="py-16 border-t border-neutral-200 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-3.5">
              <div className="w-10 h-10 rounded-xs bg-white border border-neutral-200 flex items-center justify-center text-black flex-shrink-0">
                <Truck className="w-4 h-4 stroke-[1.75]" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-black font-sans">
                  Free Express Delivery
                </h4>
                <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed font-sans">
                  Complimentary nationwide courier dispatch on orders over $100.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-3.5">
              <div className="w-10 h-10 rounded-xs bg-white border border-neutral-200 flex items-center justify-center text-black flex-shrink-0">
                <ShieldCheck className="w-4 h-4 stroke-[1.75]" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-black font-sans">
                  Doorstep Fit Trial
                </h4>
                <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed font-sans">
                  Open parcel inspection and trial before paying Cash on Delivery.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-3.5">
              <div className="w-10 h-10 rounded-xs bg-white border border-neutral-200 flex items-center justify-center text-black flex-shrink-0">
                <RotateCcw className="w-4 h-4 stroke-[1.75]" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-black font-sans">
                  14-Day Free Exchange
                </h4>
                <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed font-sans">
                  Hassle-free doorstep size and variant exchange within 48 hours.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-3.5">
              <div className="w-10 h-10 rounded-xs bg-white border border-neutral-200 flex items-center justify-center text-black flex-shrink-0">
                <Lock className="w-4 h-4 stroke-[1.75]" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-black font-sans">
                  Certified Authentic
                </h4>
                <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed font-sans">
                  100% certified organic yarns and Kurabo Japanese mill denim.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 9. Community Gallery (#APEXSTYLE) ───────────────────────────────── */}
      <section className="py-16 border-t border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-10">
            <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-neutral-400 block font-medium">
              Community Gallery
            </span>
            <h2 className="text-2xl sm:text-3xl font-normal uppercase tracking-tight text-black font-serif">
              As Seen On The Streets // #ApexStyle
            </h2>
            <p className="text-xs text-neutral-500 font-sans tracking-wider">
              Tag @apexstudios on Instagram to be featured
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&auto=format&fit=crop&q=80",
              "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
              "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop&q=80",
              "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80",
              "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&auto=format&fit=crop&q=80"
            ].map((img, idx) => (
              <div key={idx} className="relative aspect-square overflow-hidden bg-neutral-100 rounded-xs group">
                <img
                  src={img}
                  alt={`Community Style ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-sans uppercase tracking-widest font-medium">
                  @apexstudios
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 10. VIP Newsletter Section ─────────────────────────────────────── */}
      <section className="py-20 border-t border-neutral-200 bg-neutral-950 text-white font-sans">
        <div className="max-w-md mx-auto px-4 text-center space-y-4">
          <span className="text-[10px] font-sans tracking-[0.35em] uppercase text-neutral-400 block font-medium">
            VIP Privileges
          </span>
          <h3 className="text-3xl font-normal uppercase tracking-tight text-white font-serif">
            Join The Apex Archive
          </h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed font-sans">
            Receive private seasonal previews, archival drops, and an exclusive 15% discount code on your first order.
          </p>

          {newsletterSuccess ? (
            <div className="p-3 bg-neutral-900 border border-neutral-800 text-white text-xs font-semibold tracking-wider uppercase font-sans rounded-xs">
              Welcome to the Archive. Use code <span className="text-emerald-400 font-bold">ATELIER15</span> at checkout.
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex max-w-sm mx-auto pt-4 gap-2">
              <input
                type="email"
                placeholder="Enter your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xs text-xs text-white outline-none focus:border-white transition placeholder:text-neutral-500 font-sans"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white hover:bg-neutral-200 text-black text-xs font-semibold uppercase tracking-[0.2em] transition rounded-xs font-sans"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ─── 11. Multi-Column Enterprise Luxury Fashion Footer ───────────────── */}
      <footer className="bg-neutral-950 text-neutral-400 font-sans border-t border-neutral-900 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
            {/* Column 1: Store Brand Info (Spans 2 cols on lg) */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <span className="text-xl font-normal tracking-[0.32em] uppercase text-white font-serif block leading-none">
                  {storeDisplayName}
                </span>
                <span className="text-[9px] font-sans tracking-[0.38em] uppercase text-neutral-500 block mt-1.5 font-medium">
                  ATELIER ARCHIVE // EST. 2026
                </span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed max-w-sm font-sans">
                Official authenticated online flagship for {storeDisplayName}. Engineered textiles, Japanese Kurabo denim, nationwide express courier dispatch, and doorstep fit verification before tender.
              </p>
              <div className="space-y-2 text-xs text-neutral-400 pt-2 font-sans">
                <div className="flex items-center space-x-2 text-neutral-300">
                  <Mail className="w-3.5 h-3.5 stroke-[1.75] text-neutral-400" />
                  <span>concierge@{tenantSlug || "store"}.storeswift.app</span>
                </div>
                <div className="flex items-center space-x-2 text-neutral-400">
                  <Package className="w-3.5 h-3.5 stroke-[1.75] text-neutral-500" />
                  <span>Atelier Fitting Hours: 10:00 AM – 10:00 PM Daily</span>
                </div>
              </div>
            </div>

            {/* Column 2: Department Shopping */}
            <div className="space-y-3.5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white font-sans">
                Departments
              </p>
              <ul className="space-y-2.5 text-neutral-400 font-sans">
                <li>
                  <button onClick={() => setActiveDepartment("all")} className="hover:text-white transition">
                    All Pieces
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveDepartment("outerwear")} className="hover:text-white transition">
                    Tailored Overcoats
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveDepartment("tees")} className="hover:text-white transition">
                    Heavyweight Tees
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveDepartment("denim")} className="hover:text-white transition">
                    Kurabo Selvedge Denim
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveDepartment("hoodies")} className="hover:text-white transition">
                    Loopback Knitwear
                  </button>
                </li>
                <li>
                  <a href="#lookbook" className="hover:text-white transition">
                    Atelier Lookbook
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Client Services */}
            <div className="space-y-3.5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white font-sans">
                Client Care
              </p>
              <ul className="space-y-2.5 text-neutral-400 font-sans">
                {onOpenTrackOrder && (
                  <li>
                    <button onClick={onOpenTrackOrder} className="hover:text-white transition flex items-center space-x-1.5">
                      <span>Track Consignment</span>
                      <ArrowRight className="w-3 h-3 text-neutral-500" />
                    </button>
                  </li>
                )}
                <li>
                  <a href="#standards" className="hover:text-white transition">
                    Doorstep Fitting Guarantee
                  </a>
                </li>
                <li>
                  <a href="#standards" className="hover:text-white transition">
                    14-Day Free Exchange Policy
                  </a>
                </li>
                <li>
                  <a href="#lookbook" className="hover:text-white transition">
                    Curated Outfits Lookbook
                  </a>
                </li>
                <li>
                  <Link href={`/admin?store=${tenantSlug}`} className="hover:text-white transition flex items-center space-x-1.5">
                    <span>Merchant Portal</span>
                    <ExternalLink className="w-3 h-3 text-neutral-500" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Payment & Security */}
            <div className="space-y-3.5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white font-sans">
                Fulfillment & Trust
              </p>
              <ul className="space-y-2.5 text-neutral-400 font-sans">
                <li className="flex items-center space-x-2 text-neutral-300">
                  <ShieldCheck className="w-3.5 h-3.5 stroke-[1.75] text-neutral-400" />
                  <span>Cash on Delivery (COD)</span>
                </li>
                <li className="flex items-center space-x-2 text-neutral-300">
                  <Lock className="w-3.5 h-3.5 stroke-[1.75] text-neutral-400" />
                  <span>256-Bit SSL Encryption</span>
                </li>
                <li className="flex items-center space-x-2 text-neutral-300">
                  <Truck className="w-3.5 h-3.5 stroke-[1.75] text-neutral-400" />
                  <span>Steadfast & Pathao Courier</span>
                </li>
                <li className="pt-1 text-[11px] text-neutral-500">
                  <span>Metropolitan: 24h Express Dispatch</span>
                </li>
                <li className="text-[11px] text-neutral-500">
                  <span>Nationwide: 48h–72h Insured</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Attribution */}
          <div className="mt-16 pt-8 border-t border-neutral-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500 font-sans">
            <div className="flex flex-wrap items-center gap-2 text-center sm:text-left">
              <span>© {new Date().getFullYear()} {storeDisplayName} Atelier. All rights reserved.</span>
              <span>•</span>
              <Link href="/" className="hover:text-neutral-300 transition text-[11px]">
                Powered by <span className="font-semibold text-white">StoreSwift</span>
              </Link>
            </div>

            {/* Country & Currency Indicator */}
            <div className="flex items-center space-x-1.5 text-[11px] text-neutral-400">
              <Globe className="w-3.5 h-3.5 text-neutral-500" />
              <span>Worldwide Shipping // USD ($)</span>
            </div>

            {/* Monochromatic Trust & Payment Badges */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 text-[10px] font-sans font-medium">
              <span className="px-2.5 py-1 bg-neutral-900 rounded-xs border border-neutral-800 text-neutral-300">
                Cash on Delivery (COD)
              </span>
              <span className="px-2.5 py-1 bg-neutral-900 rounded-xs border border-neutral-800 text-neutral-300">
                bKash • Nagad
              </span>
              <span className="px-2.5 py-1 bg-neutral-900 rounded-xs border border-neutral-800 text-neutral-300">
                Visa • Mastercard
              </span>
              <span className="px-2.5 py-1 bg-neutral-900 rounded-xs border border-neutral-800 text-neutral-300">
                Steadfast Courier
              </span>
              <span className="px-2.5 py-1 bg-neutral-900 rounded-xs border border-neutral-800 text-neutral-300">
                256-Bit SSL
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
