"use client";

import { useState, use, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Store,
  CheckCircle2,
  Truck,
  ShieldCheck,
  X,
  CreditCard,
  Banknote,
  Smartphone,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Search,
  Filter,
  Check,
  Star,
  ArrowUpRight,
  Heart,
  Lock,
  Clock,
  RotateCcw,
  SlidersHorizontal,
  Flame,
  Tag,
  Plus
} from "lucide-react";
import { getCategoryConfig, CATEGORIES_MAP, ALL_CATEGORIES } from "@/config/categories";
import { getTemplateConfig, STORE_TEMPLATES, ALL_TEMPLATES } from "@/config/templates";
import { generateStoreSeedData } from "@/lib/seed-store";
import { calculateCartTotals, CartItem } from "@/lib/cart";
import { useToast } from "@/components/ui/toast";
import { StoreFooter } from "@/components/footer";
import { SearchModal } from "@/components/store/search-modal";
import { SpotlightDrop } from "@/components/store/spotlight-drop";
import { TestimonialsSection } from "@/components/store/testimonials";
import { trackEvent } from "@/lib/analytics";

export default function TenantStorefrontPage({
  params
}: {
  params: Promise<{ tenant: string }>;
}) {
  const resolvedParams = use(params);
  const tenantSlug = resolvedParams.tenant || "apex-fashion";

  const { success, error: toastError } = useToast();

  // Determine initial category from slug or fallback
  const initialCategoryKey = useMemo(() => {
    const slug = tenantSlug.toLowerCase();
    if (slug.includes("shoe") || slug.includes("sneaker") || slug.includes("boot")) return "shoes";
    if (slug.includes("beauty") || slug.includes("cosmetic") || slug.includes("glow") || slug.includes("skin")) return "beauty_cosmetics";
    if (slug.includes("tech") || slug.includes("byte") || slug.includes("gadget") || slug.includes("audio")) return "electronics";
    if (slug.includes("jewel") || slug.includes("watch") || slug.includes("gold")) return "jewelry";
    if (slug.includes("coffee") || slug.includes("honey") || slug.includes("food")) return "grocery_food";
    return "fashion";
  }, [tenantSlug]);

  const [activeCategoryKey, setActiveCategoryKey] = useState(initialCategoryKey);
  const categoryConfig = getCategoryConfig(activeCategoryKey);

  // Template state
  const [templateKey, setTemplateKey] = useState<string>(categoryConfig.recommendedTemplate || "minimal");
  const template = getTemplateConfig(templateKey);

  // Seed Data based on active category
  const seed = useMemo(() => {
    return generateStoreSeedData(tenantSlug, activeCategoryKey);
  }, [tenantSlug, activeCategoryKey]);

  // Product catalog state
  const [products, setProducts] = useState(
    seed.products.map((p, idx) => ({
      id: `prod-${activeCategoryKey}-${idx + 1}`,
      title: p.title,
      slug: p.slug,
      description: p.description,
      price: parseFloat(p.basePrice),
      comparePrice: parseFloat(p.basePrice) * 1.35,
      imageUrl: p.imageUrl || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
      secondaryImage: p.secondaryImage || p.imageUrl || "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80",
      badge: p.badge || (idx === 0 ? "Best Seller" : idx === 1 ? "Trending" : "New"),
      rating: p.rating || 4.9,
      variants: seed.variants.filter((v) => v.productSlug === p.slug)
    }))
  );

  // Sync products when category changes
  useEffect(() => {
    setProducts(
      seed.products.map((p, idx) => ({
        id: `prod-${activeCategoryKey}-${idx + 1}`,
        title: p.title,
        slug: p.slug,
        description: p.description,
        price: parseFloat(p.basePrice),
        comparePrice: parseFloat(p.basePrice) * 1.35,
        imageUrl: p.imageUrl || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
        secondaryImage: p.secondaryImage || p.imageUrl || "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80",
        badge: p.badge || (idx === 0 ? "Best Seller" : idx === 1 ? "Trending" : "New"),
        rating: p.rating || 4.9,
        variants: seed.variants.filter((v) => v.productSlug === p.slug)
      }))
    );
    setTemplateKey(categoryConfig.recommendedTemplate || "minimal");
  }, [seed, activeCategoryKey, categoryConfig.recommendedTemplate]);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");
  const [priceFilter, setPriceFilter] = useState<"all" | "under-35" | "35-80" | "over-80">("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [modalImageAngle, setModalImageAngle] = useState<"primary" | "secondary">("primary");

  // Checkout modal state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "stripe" | "manual">("cod");
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);

  const cartSummary = calculateCartTotals(cartItems, 50);
  const shippingFee = cartSummary.isFreeShippingEligible || cartItems.length === 0 ? 0 : 5.0;
  const finalTotal = cartSummary.subtotal + shippingFee;

  // Filtering & Sorting
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          if (!p.title.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) return false;
        }
        if (priceFilter === "under-35" && p.price >= 35) return false;
        if (priceFilter === "35-80" && (p.price < 35 || p.price > 80)) return false;
        if (priceFilter === "over-80" && p.price <= 80) return false;
        if (inStockOnly && p.variants.every((v) => v.inventoryQuantity <= 0)) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return 0; // featured
      });
  }, [products, searchQuery, sortBy, priceFilter, inStockOnly]);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      if (!exists) {
        success("Saved to Wishlist", "Item added to your personal collection.");
      }
      return next;
    });
  };

  const handleOpenProduct = (prod: typeof products[0]) => {
    setSelectedProduct(prod);
    setSelectedVariant(prod.variants[0] || null);
    setModalImageAngle("primary");
  };

  const handleAddToCart = (prod: any, variant: any) => {
    const itemKey = variant ? `${prod.id}-${variant.title}` : prod.id;
    const existing = cartItems.find((c) => c.id === itemKey);

    if (existing) {
      setCartItems(
        cartItems.map((c) =>
          c.id === itemKey ? { ...c, quantity: c.quantity + 1 } : c
        )
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          id: itemKey,
          title: variant ? `${prod.title} (${variant.title})` : prod.title,
          price: variant ? parseFloat(variant.price) : prod.price,
          quantity: 1,
          variantId: variant?.sku || "std"
        }
      ]);
    }

    trackEvent("add_to_cart", {
      productTitle: prod.title,
      price: prod.price,
      variant: variant?.title
    });

    success(
      "Added to Cart",
      `${prod.title} ${variant ? `(${variant.title})` : ""} has been added to your bag.`
    );
  };

  const handleAddUpsell = (title: string, price: number) => {
    const id = `upsell-${title.toLowerCase().replace(/\s+/g, "-")}`;
    setCartItems((prev) => [...prev, { id, title, price, quantity: 1 }]);
    success("Added Add-on", `${title} added to your bag.`);
  };

  const handleQuantityChange = (id: string, delta: number) => {
    setCartItems(
      cartItems
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !shippingAddress) {
      toastError("Missing Fields", "Please provide customer name, phone number, and delivery address.");
      return;
    }

    setIsSubmittingOrder(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeSlug: tenantSlug,
          customerName,
          customerPhone,
          customerEmail,
          shippingAddress: { address: shippingAddress, notes: deliveryNotes },
          items: cartItems.map((it) => ({
            variantId: it.variantId || "mock-var-1",
            title: it.title,
            price: it.price,
            quantity: it.quantity
          })),
          paymentMethod,
          shippingFee: cartSummary.isFreeShippingEligible ? 0 : shippingFee
        })
      });

      const data = await res.json();

      if (!res.ok) {
        toastError("Order Issue", data.error || "Failed to process order checkout.");
        setIsSubmittingOrder(false);
        return;
      }

      setOrderSuccess({
        orderNumber: data.orderNumber || `SS-${Date.now().toString(36).toUpperCase()}`,
        total: data.totalAmount || finalTotal.toFixed(2),
        paymentMethod
      });

      setCartItems([]);
      setIsSubmittingOrder(false);
      success("Order Confirmed!", `Order #${data.orderNumber} successfully placed.`);
    } catch {
      // Fallback offline confirmation
      setOrderSuccess({
        orderNumber: `SS-${Date.now().toString(36).toUpperCase()}`,
        total: finalTotal.toFixed(2),
        paymentMethod
      });
      setCartItems([]);
      setIsSubmittingOrder(false);
      success("Order Placed", "Your order has been recorded.");
    }
  };

  const storeDisplayName = tenantSlug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-500 ${template.classes.pageBg}`}>
      {/* Top Notification / Ticker Bar */}
      {(() => {
        const highlights = template.getAnnouncementHighlights();
        return (
          <div className={`py-2 px-4 text-xs font-semibold text-center tracking-wide transition-colors ${template.classes.announcementBar}`}>
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <span className="hidden sm:inline-block">{highlights.leading}</span>
              <span className="mx-auto sm:mx-0">{highlights.center}</span>
              <span className="hidden md:inline-block">{highlights.trailing}</span>
            </div>
          </div>
        );
      })()}

      {/* Main Sticky Brand Header */}
      <header className={`sticky top-0 z-30 shadow-subtle transition-colors duration-300 ${template.classes.headerBg}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Category indicator */}
          <Link href={`/store/${tenantSlug}`} className="flex items-center space-x-2.5 flex-shrink-0 group">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-sm block">
                {storeDisplayName}
              </span>
              <span className="text-[10px] opacity-70 font-medium block -mt-0.5">
                {categoryConfig.name} • {template.name}
              </span>
            </div>
          </Link>

          {/* Search Trigger Input */}
          <div
            onClick={() => setIsSearchOpen(true)}
            className="flex-1 max-w-md hidden sm:flex items-center space-x-2 px-3.5 py-2 bg-black/5 dark:bg-white/5 border border-current/15 rounded-xl text-xs opacity-75 cursor-pointer hover:opacity-100 hover:border-current/30 transition"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search {categoryConfig.name.toLowerCase()}...</span>
            <kbd className="ml-auto text-[10px] bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
          </div>

          {/* Header Action Controls */}
          <div className="flex items-center space-x-2">
            {/* Mobile Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="sm:hidden p-2 opacity-75 hover:opacity-100 rounded-xl transition"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Wishlist Icon */}
            <button
              onClick={() => success("Wishlist", `${wishlist.length} saved item(s).`)}
              className="p-2 opacity-75 hover:opacity-100 rounded-xl transition relative"
              title="Saved Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 btn-press ${template.classes.primaryButton}`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Bag ({cartItems.reduce((s, i) => s + i.quantity, 0)})</span>
              {cartItems.length > 0 && (
                <span className="hidden sm:inline-block border-l border-white/20 pl-2">
                  ${finalTotal.toFixed(2)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Category & Template Switcher Bar */}
      <div className={`py-2.5 px-4 overflow-x-auto scrollbar-none sticky top-16 z-20 transition-colors ${template.classes.navPillBg}`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Shop Category Tabs */}
          <div className="flex items-center space-x-1.5 flex-nowrap">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mr-2 flex-shrink-0">
              Department:
            </span>
            {ALL_CATEGORIES.map((catKey) => {
              const cfg = CATEGORIES_MAP[catKey];
              const isActive = activeCategoryKey === catKey;
              return (
                <button
                  key={catKey}
                  onClick={() => setActiveCategoryKey(catKey)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                    isActive
                      ? template.classes.pillActive
                      : "bg-zinc-100 hover:bg-zinc-200 text-zinc-600"
                  }`}
                >
                  {cfg.name}
                </button>
              );
            })}
          </div>

          {/* Theme Template Selector */}
          <div className="hidden lg:flex items-center space-x-1.5 flex-shrink-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mr-1">
              Store Style:
            </span>
            {ALL_TEMPLATES.map((tKey) => {
              const tmpl = STORE_TEMPLATES[tKey];
              const isSelected = templateKey === tKey;
              return (
                <button
                  key={tKey}
                  onClick={() => setTemplateKey(tKey)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                    isSelected
                      ? "bg-zinc-900 text-white shadow-sm ring-1 ring-zinc-900"
                      : "bg-zinc-50 border border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                  }`}
                >
                  {tmpl.name.split(" ")[0]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dynamic Hero Section */}
      <section className={`relative overflow-hidden py-14 sm:py-20 border-b transition-colors ${template.classes.heroSection}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${template.classes.heroBadge}`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>{template.formatHeroBadge(categoryConfig.name)}</span>
            </div>

            <div className="space-y-2">
              <span className={`block ${template.classes.editorialTag}`}>
                {categoryConfig.editorialSubtitle || "STUDIO ARCHIVE 2026 // ATELIER SELECTION"}
              </span>
              <h1 className={`text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[0.95] ${template.classes.heroTitle}`}>
                {categoryConfig.tagline}
              </h1>
            </div>

            <p className={`text-xs sm:text-sm leading-relaxed max-w-xl opacity-80 ${template.classes.heroSubtitle}`}>
              Welcome to the official {storeDisplayName} storefront. Browse authenticated items with nationwide cash on delivery, 48-hour express dispatch, and 7-day hassle-free returns.
            </p>

            <div className="pt-3 flex flex-wrap items-center gap-3">
              <a
                href="#catalog"
                className={`py-3.5 px-7 rounded-xl font-bold text-xs transition flex items-center space-x-2 btn-press ${template.classes.primaryButton}`}
              >
                <span>Shop Curated Catalog ({products.length} Items)</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <button
                onClick={() => success("Free Shipping", "Add $50+ of items to your cart to unlock free express delivery.")}
                className={`py-3.5 px-6 rounded-xl font-semibold text-xs border transition ${template.classes.secondaryButton}`}
              >
                Inspect Quality Guarantees
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="pt-4 flex items-center space-x-6 text-[11px] opacity-75 font-mono">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                <span>48h Dispatch</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                <span>COD Enabled</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />
                <span>100% Genuine</span>
              </div>
            </div>
          </div>

          {/* Hero Illustration Graphic with Secondary Hover Flip */}
          <div className="lg:col-span-5 relative group">
            <div className="relative rounded-3xl overflow-hidden border border-current/15 shadow-2xl aspect-[4/5] bg-black/5 dark:bg-white/5">
              <img
                src={categoryConfig.heroImage}
                alt={categoryConfig.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              
              {/* Floating Top Pill */}
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-mono px-3 py-1 rounded-full border border-white/20">
                Curated Lookbook • 2026
              </div>

              {/* Bottom Glass Bar */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur-md p-3.5 rounded-2xl flex items-center justify-between border border-white/60 dark:border-white/10 shadow-lg">
                <div>
                  <p className="text-xs font-bold text-zinc-900 dark:text-white">{categoryConfig.name}</p>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Verified Quality Guarantee</p>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                  COD Available
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Quality Standard & Fulfillment Manifesto Ribbon (Polymorphic OOP Method) */}
      <section className="border-b border-current/10 py-7 px-4 sm:px-6 bg-black/[0.02] dark:bg-white/[0.02]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {template.getManifestoPillars().map((pillar) => (
            <div
              key={pillar.index}
              className={`space-y-1.5 border-l-2 pl-3.5 ${
                pillar.highlight ? "border-emerald-500" : "border-current/30"
              }`}
            >
              <span
                className={`text-[10px] font-mono uppercase tracking-widest block ${
                  pillar.highlight ? "text-emerald-600 dark:text-emerald-400 font-bold" : "opacity-50"
                }`}
              >
                {pillar.index} / {pillar.category}
              </span>
              <h4 className="text-xs font-bold uppercase tracking-wider">{pillar.title}</h4>
              <p className="text-[11px] opacity-70 leading-relaxed">{pillar.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Category Buyer Psychology & Doorstep Inspection Reassurance Bar */}
      {(() => {
        const psych = template.getCategoryPsychology();
        return (
          <div className="border-b border-current/10 py-3.5 px-4 sm:px-6 bg-black/[0.015] dark:bg-white/[0.015]">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">{psych.reassurancePledge}</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[11px] opacity-75 font-mono">
                <span className="opacity-50 font-bold">INSPECTION CHECKLIST:</span>
                {psych.doorstepChecklist.map((item, i) => (
                  <span key={i} className="flex items-center space-x-1">
                    <span className="text-emerald-600 font-bold">0{i + 1}.</span>
                    <span>{item}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Weekly Spotlight Limited Drop */}
      {products[0] && (
        <SpotlightDrop
          product={{
            ...products[0],
            secondaryImage: products[0].secondaryImage
          }}
          template={template}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Curated Lookbook & Styling Gallery Section (Polymorphic Philosophy) */}
      {(() => {
        const philosophy = template.getDesignPhilosophy();
        return (
          <section className={`py-12 px-4 sm:px-6 transition-colors ${template.classes.lookbookBg}`}>
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl space-y-3">
                <span className={template.classes.editorialTag}>{template.getCuratedCollectionTitle()}</span>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                  {philosophy.curationQuote}
                </h3>
                <p className="text-xs sm:text-sm opacity-75 leading-relaxed">
                  {philosophy.ethos} {philosophy.materialsFocus ? `Materials: ${philosophy.materialsFocus}.` : ""}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full border border-current/20 uppercase">
                    Certified Provenance
                  </span>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full border border-current/20 uppercase">
                    Ethical Craftsmanship
                  </span>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full border border-current/20 uppercase">
                    Nationwide COD
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <a
                  href="#catalog"
                  className={`py-3.5 px-6 rounded-xl font-bold text-xs transition flex items-center space-x-2 btn-press ${template.classes.primaryButton}`}
                >
                  <span>Explore Archive Collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </section>
        );
      })()}

      {/* Main Catalog View */}
      <main id="catalog" className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10">
        {/* Catalog Control Toolbar: Search indicator, filters & sort */}
        <div className={`rounded-2xl p-4 border shadow-subtle mb-10 space-y-3.5 transition-colors ${template.classes.toolbarBg}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold tracking-tight">
                Featured {categoryConfig.name}
              </h2>
              <p className="text-xs opacity-60 mt-0.5">
                Showing {filteredProducts.length} items • In stock with instant delivery
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Sort Selector */}
              <div className="flex items-center space-x-1.5 text-xs opacity-75 bg-black/5 dark:bg-white/5 border border-current/15 rounded-xl px-3 py-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 opacity-60" />
                <span>Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent font-semibold outline-none cursor-pointer text-xs"
                >
                  <option value="featured" className="text-black">Featured First</option>
                  <option value="price-asc" className="text-black">Price: Low to High</option>
                  <option value="price-desc" className="text-black">Price: High to Low</option>
                  <option value="rating" className="text-black">Highest Rated</option>
                </select>
              </div>

              {/* In-Stock Toggle */}
              <button
                onClick={() => setInStockOnly(!inStockOnly)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                  inStockOnly
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                    : "bg-black/5 dark:bg-white/5 border-current/15 hover:border-current/30"
                }`}
              >
                {inStockOnly ? "✓ In Stock Only" : "All Availability"}
              </button>
            </div>
          </div>

          {/* Price Range Filter Pills */}
          <div className="flex items-center space-x-2 pt-2.5 border-t border-current/10 overflow-x-auto">
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-60 mr-1 flex-shrink-0">
              Price:
            </span>
            <button
              onClick={() => setPriceFilter("all")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                priceFilter === "all" ? template.classes.pillActive : "bg-black/5 dark:bg-white/5 opacity-80 hover:opacity-100"
              }`}
            >
              All Prices
            </button>
            <button
              onClick={() => setPriceFilter("under-35")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                priceFilter === "under-35" ? template.classes.pillActive : "bg-black/5 dark:bg-white/5 opacity-80 hover:opacity-100"
              }`}
            >
              Under $35
            </button>
            <button
              onClick={() => setPriceFilter("35-80")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                priceFilter === "35-80" ? template.classes.pillActive : "bg-black/5 dark:bg-white/5 opacity-80 hover:opacity-100"
              }`}
            >
              $35 to $80
            </button>
            <button
              onClick={() => setPriceFilter("over-80")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                priceFilter === "over-80" ? template.classes.pillActive : "bg-black/5 dark:bg-white/5 opacity-80 hover:opacity-100"
              }`}
            >
              Over $80
            </button>
          </div>
        </div>

        {/* Asymmetrical Editorial Product Showcase */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <p className="text-sm font-bold opacity-80">No products match your filter criteria.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setPriceFilter("all");
                setInStockOnly(false);
              }}
              className="text-xs underline opacity-75 hover:opacity-100 font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : !searchQuery && priceFilter === "all" && !inStockOnly && filteredProducts.length >= 3 ? (
          /* Editorial Asymmetric Layout: 1 Grand Lead Showcase + 2 Vertical Portrait Cards */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* CARD 0: GRAND LEAD SHOWCASE PIECE (Spans 2 columns on desktop) */}
            {(() => {
              const p = filteredProducts[0];
              const isWishlisted = wishlist.includes(p.id);
              const discountPct = template.calculateDiscount(p.price, p.comparePrice);

              return (
                <div
                  key={p.id}
                  className={`lg:col-span-2 rounded-2xl border p-5 shadow-card hover:shadow-xl transition-all duration-300 group ${template.classes.productCard}`}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                    {/* Left: Portrait Photo Frame with Smooth Crossfade Hover */}
                    <div
                      className={`relative ${template.getProductCardAspect()} rounded-xl overflow-hidden bg-black/5 dark:bg-white/5 border border-current/10 cursor-pointer`}
                      onClick={() => handleOpenProduct(p)}
                    >
                      <img
                        src={p.imageUrl}
                        alt={p.title}
                        className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
                      />
                      <img
                        src={p.secondaryImage || p.imageUrl}
                        alt={`${p.title} - Lookbook View`}
                        className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      />

                      {/* Badge (Polymorphic OOP formatting) */}
                      {p.badge && (
                        <span className="absolute top-3 left-3 bg-zinc-950/90 text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                          {template.formatProductBadge(p.badge)}
                        </span>
                      )}

                      {/* Discount Pill */}
                      {discountPct > 0 && (
                        <span className="absolute top-3 right-3 bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow">
                          -{discountPct}%
                        </span>
                      )}

                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(p.id);
                        }}
                        className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md flex items-center justify-center text-zinc-700 dark:text-zinc-200 hover:text-rose-600 shadow-sm transition"
                      >
                        <Heart className={`w-4 h-4 ${isWishlisted ? "text-rose-500 fill-current" : ""}`} />
                      </button>

                      {/* Angle Indicator Pill */}
                      <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[9px] font-mono px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        LOOKBOOK VIEW
                      </div>
                    </div>

                    {/* Right: Editorial Narrative & Action Box */}
                    <div className="space-y-3.5">
                      <div className="flex items-center space-x-2">
                        <span className={template.classes.editorialTag}>
                          Signature Edition • 01
                        </span>
                        <div className="flex items-center space-x-1 text-amber-500 text-xs">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="font-bold">{p.rating}</span>
                          <span className="opacity-50 text-[10px]">(48 reviews)</span>
                        </div>
                      </div>

                      <h3
                        onClick={() => handleOpenProduct(p)}
                        className="font-black text-xl sm:text-2xl tracking-tight cursor-pointer hover:opacity-80 transition"
                      >
                        {p.title}
                      </h3>

                      <p className="text-xs opacity-75 leading-relaxed line-clamp-3">
                        {p.description}
                      </p>

                      {/* Scarcity Pill (Polymorphic OOP method) */}
                      <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                        <span>{template.getScarcityUrgency(5)}</span>
                      </div>

                      {/* Variant Options Preview */}
                      {p.variants.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[10px] font-mono uppercase tracking-wider opacity-60">
                            Available Sizes / Colors:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {p.variants.slice(0, 4).map((v, vi) => (
                              <button
                                key={vi}
                                onClick={() => handleAddToCart(p, v)}
                                className="px-2.5 py-1 rounded-lg text-[10px] font-mono border border-current/20 hover:border-current/50 transition"
                              >
                                {v.title}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Price & Action */}
                      <div className="pt-3 border-t border-current/10 flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-black">
                            {template.formatPrice(p.price)}
                          </div>
                          <span className="text-xs opacity-40 line-through">
                            {template.formatPrice(p.comparePrice)}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleOpenProduct(p)}
                            className="p-2.5 border border-current/20 hover:border-current/40 rounded-xl transition"
                            title="Inspect Details"
                          >
                            <SlidersHorizontal className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleAddToCart(p, p.variants[0])}
                            className={`py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 btn-press ${template.classes.primaryButton}`}
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add to Bag</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* CARDS 1 & 2: VERTICAL PORTRAIT CARDS */}
            {filteredProducts.slice(1, 3).map((p) => {
              const isWishlisted = wishlist.includes(p.id);
              const discountPct = template.calculateDiscount(p.price, p.comparePrice);

              return (
                <div
                  key={p.id}
                  className={`rounded-2xl border p-4 shadow-subtle hover:shadow-card transition-all flex flex-col justify-between group ${template.classes.productCard}`}
                >
                  <div>
                    {/* Portrait Photo Frame with Smooth Hover Crossfade */}
                    <div
                      className={`relative ${template.getProductCardAspect()} rounded-xl overflow-hidden bg-black/5 dark:bg-white/5 border border-current/10 mb-4 cursor-pointer`}
                      onClick={() => handleOpenProduct(p)}
                    >
                      <img
                        src={p.imageUrl}
                        alt={p.title}
                        className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
                      />
                      <img
                        src={p.secondaryImage || p.imageUrl}
                        alt={`${p.title} - Lookbook View`}
                        className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      />

                      {/* Badge (Polymorphic OOP formatting) */}
                      {p.badge && (
                        <span className="absolute top-2.5 left-2.5 bg-zinc-950/90 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                          {template.formatProductBadge(p.badge)}
                        </span>
                      )}

                      {/* Discount Pill */}
                      {discountPct > 0 && (
                        <span className="absolute top-2.5 right-2.5 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                          -{discountPct}%
                        </span>
                      )}

                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(p.id);
                        }}
                        className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md flex items-center justify-center text-zinc-700 dark:text-zinc-200 hover:text-rose-600 shadow-sm transition"
                      >
                        <Heart className={`w-4 h-4 ${isWishlisted ? "text-rose-500 fill-current" : ""}`} />
                      </button>

                      {/* Slide-up Quick Add Drawer on Hover */}
                      <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(p, p.variants[0]);
                          }}
                          className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-lg flex items-center justify-center space-x-1.5 btn-press ${template.classes.primaryButton}`}
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Quick Add to Bag</span>
                        </button>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center space-x-1 text-amber-500 text-xs mb-1.5">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="font-bold">{p.rating}</span>
                      <span className="opacity-40 text-[10px]">(48 reviews)</span>
                    </div>

                    {/* Title & Description */}
                    <h3
                      onClick={() => handleOpenProduct(p)}
                      className="font-bold text-sm tracking-tight leading-snug cursor-pointer hover:opacity-80 transition"
                    >
                      {p.title}
                    </h3>

                    <p className="text-xs opacity-60 mt-1 line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  {/* Price & Action Row */}
                  <div className="mt-4 pt-3.5 border-t border-current/10 flex items-center justify-between">
                    <div>
                      <div className="text-base font-black">
                        {template.formatPrice(p.price)}
                      </div>
                      <span className="text-[11px] opacity-40 line-through">
                        {template.formatPrice(p.comparePrice)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => handleOpenProduct(p)}
                        className="p-2 border border-current/20 hover:border-current/40 rounded-xl text-xs font-semibold transition"
                        title="Quick Specs"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleAddToCart(p, p.variants[0])}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center space-x-1 btn-press ${template.classes.primaryButton}`}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Standard Filtered Grid (All Cards have Portrait Ratio & Hover Crossfade) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((p) => {
              const isWishlisted = wishlist.includes(p.id);
              const discountPct = template.calculateDiscount(p.price, p.comparePrice);

              return (
                <div
                  key={p.id}
                  className={`rounded-2xl border p-4 shadow-subtle hover:shadow-card transition-all flex flex-col justify-between group ${template.classes.productCard}`}
                >
                  <div>
                    {/* Portrait Photo Frame with Overlays */}
                    <div
                      className={`relative ${template.getProductCardAspect()} rounded-xl overflow-hidden bg-black/5 dark:bg-white/5 border border-current/10 mb-4 cursor-pointer`}
                      onClick={() => handleOpenProduct(p)}
                    >
                      <img
                        src={p.imageUrl}
                        alt={p.title}
                        className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
                      />
                      <img
                        src={p.secondaryImage || p.imageUrl}
                        alt={`${p.title} - Lookbook View`}
                        className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      />

                      {/* Badge (Polymorphic OOP formatting) */}
                      {p.badge && (
                        <span className="absolute top-2.5 left-2.5 bg-zinc-950/90 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                          {template.formatProductBadge(p.badge)}
                        </span>
                      )}

                      {/* Discount Pill */}
                      {discountPct > 0 && (
                        <span className="absolute top-2.5 right-2.5 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                          -{discountPct}%
                        </span>
                      )}

                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(p.id);
                        }}
                        className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md flex items-center justify-center text-zinc-700 dark:text-zinc-200 hover:text-rose-600 shadow-sm transition"
                      >
                        <Heart className={`w-4 h-4 ${isWishlisted ? "text-rose-500 fill-current" : ""}`} />
                      </button>

                      {/* Slide-up Quick Add Drawer on Hover */}
                      <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(p, p.variants[0]);
                          }}
                          className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-lg flex items-center justify-center space-x-1.5 btn-press ${template.classes.primaryButton}`}
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Quick Add to Bag</span>
                        </button>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center space-x-1 text-amber-500 text-xs mb-1.5">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="font-bold">{p.rating}</span>
                      <span className="opacity-40 text-[10px]">(48 reviews)</span>
                    </div>

                    {/* Title & Description */}
                    <h3
                      onClick={() => handleOpenProduct(p)}
                      className="font-bold text-sm tracking-tight leading-snug cursor-pointer hover:opacity-80 transition"
                    >
                      {p.title}
                    </h3>

                    <p className="text-xs opacity-60 mt-1 line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  {/* Price & Action Row */}
                  <div className="mt-4 pt-3.5 border-t border-current/10 flex items-center justify-between">
                    <div>
                      <div className="text-base font-black">
                        {template.formatPrice(p.price)}
                      </div>
                      <span className="text-[11px] opacity-40 line-through">
                        {template.formatPrice(p.comparePrice)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => handleOpenProduct(p)}
                        className="p-2 border border-current/20 hover:border-current/40 rounded-xl text-xs font-semibold transition"
                        title="Quick Specs"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleAddToCart(p, p.variants[0])}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center space-x-1 btn-press ${template.classes.primaryButton}`}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Verified Customer Reviews & Testimonials Section */}
      <TestimonialsSection storeName={storeDisplayName} />

      {/* Live Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        products={products.map((p) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          price: p.price,
          comparePrice: p.comparePrice,
          imageUrl: p.imageUrl,
          badge: p.badge,
          category: categoryConfig.name
        }))}
        onSelectProduct={(p) => {
          const match = products.find((pr) => pr.id === p.id);
          if (match) handleOpenProduct(match);
        }}
        onAddToCart={(p) => {
          const match = products.find((pr) => pr.id === p.id);
          if (match) handleAddToCart(match, match.variants[0]);
        }}
      />

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
              {/* Header */}
              <div className="p-5 border-b border-zinc-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-4 h-4 text-zinc-900" />
                  <span className="font-bold text-zinc-900 text-sm">Your Shopping Bag</span>
                  <span className="text-xs text-zinc-400">({cartItems.length} items)</span>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="text-zinc-400 hover:text-zinc-600 p-1.5 rounded-lg hover:bg-zinc-100">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Free Shipping Progress Bar (Goal Gradient Effect) */}
              <div className="p-4 bg-zinc-50 border-b border-zinc-200 text-xs">
                {cartSummary.isFreeShippingEligible ? (
                  <div className="flex items-center space-x-2 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Unlocked! Free Express Delivery applied.</span>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-zinc-700 mb-1.5">
                      <span>Add ${(50 - cartSummary.subtotal).toFixed(2)} more for FREE Delivery</span>
                      <span>{Math.round((cartSummary.subtotal / 50) * 100)}%</span>
                    </div>
                    <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-zinc-900 h-full transition-all duration-300 rounded-full"
                        style={{ width: `${Math.min(100, (cartSummary.subtotal / 50) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Cart Item List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-zinc-800">Your bag is currently empty</p>
                    <p className="text-[11px] text-zinc-400 max-w-xs mx-auto">
                      Explore our {categoryConfig.name.toLowerCase()} catalog and pick your favorite items.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border border-zinc-200/70">
                        <div className="flex-1 pr-3">
                          <p className="text-xs font-bold text-zinc-900 leading-tight">{item.title}</p>
                          <p className="text-[11px] text-zinc-500 font-mono mt-0.5">${item.price.toFixed(2)} each</p>
                        </div>

                        <div className="flex items-center space-x-2">
                          <div className="flex items-center bg-white border border-zinc-200 rounded-lg p-0.5">
                            <button
                              onClick={() => handleQuantityChange(item.id, -1)}
                              className="w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-zinc-100 rounded text-zinc-600"
                            >
                              -
                            </button>
                            <span className="w-6 text-center text-xs font-bold text-zinc-900">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item.id, 1)}
                              className="w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-zinc-100 rounded text-zinc-600"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => handleQuantityChange(item.id, -item.quantity)}
                            className="text-zinc-400 hover:text-rose-600 p-1 transition"
                            title="Remove item"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Frequently Bought Together Upsell Section */}
                    <div className="pt-3 border-t border-zinc-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                        Frequently Added Add-ons:
                      </span>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-zinc-200 text-xs">
                          <div>
                            <span className="font-bold text-zinc-900 block">Eco Protective Cotton Pouch</span>
                            <span className="text-[10px] text-zinc-400">+$6.00 • Zero plastic dust bag</span>
                          </div>
                          <button
                            onClick={() => handleAddUpsell("Eco Cotton Pouch", 6.0)}
                            className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg transition"
                            title="Add to bag"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-zinc-200 text-xs">
                          <div>
                            <span className="font-bold text-zinc-900 block">Express Priority Packing</span>
                            <span className="text-[10px] text-zinc-400">+$3.50 • Front-of-line dispatch</span>
                          </div>
                          <button
                            onClick={() => handleAddUpsell("Priority Dispatch", 3.5)}
                            className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg transition"
                            title="Add to bag"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Cart Footer & Checkout Action */}
              {cartItems.length > 0 && (
                <div className="p-5 border-t border-zinc-200 space-y-3 bg-zinc-50">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-zinc-500">
                      <span>Subtotal</span>
                      <span className="font-semibold text-zinc-900">${cartSummary.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-zinc-500">
                      <span>Shipping</span>
                      <span>{cartSummary.isFreeShippingEligible ? "FREE" : `$${shippingFee.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-zinc-900 pt-2 border-t border-zinc-200">
                      <span>Total Amount</span>
                      <span>${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsCheckoutOpen(true);
                    }}
                    className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center space-x-2 btn-press"
                  >
                    <span>Proceed to Cash on Delivery (COD)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick Specs / Variant Selection Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-zinc-200 shadow-2xl relative">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 p-1.5 rounded-lg hover:bg-zinc-100"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex space-x-4 items-start">
              <div className="space-y-1.5 flex-shrink-0">
                <div className="w-28 h-28 rounded-xl overflow-hidden border border-zinc-200 bg-zinc-50 relative shadow-inner">
                  <img
                    src={modalImageAngle === "primary" ? selectedProduct.imageUrl : (selectedProduct.secondaryImage || selectedProduct.imageUrl)}
                    alt={selectedProduct.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {selectedProduct.secondaryImage && (
                  <div className="flex gap-1 justify-center">
                    <button
                      type="button"
                      onClick={() => setModalImageAngle("primary")}
                      className={`text-[9px] font-mono px-2 py-0.5 rounded border transition ${
                        modalImageAngle === "primary" ? "bg-zinc-900 text-white border-zinc-900" : "bg-zinc-100 text-zinc-600 border-zinc-200"
                      }`}
                    >
                      Studio
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalImageAngle("secondary")}
                      className={`text-[9px] font-mono px-2 py-0.5 rounded border transition ${
                        modalImageAngle === "secondary" ? "bg-zinc-900 text-white border-zinc-900" : "bg-zinc-100 text-zinc-600 border-zinc-200"
                      }`}
                    >
                      Lookbook
                    </button>
                  </div>
                )}
              </div>
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{categoryConfig.name}</span>
                <h3 className="text-base font-bold text-zinc-900 tracking-tight">{selectedProduct.title}</h3>
                <div className="text-lg font-black text-zinc-900 mt-1">${selectedProduct.price.toFixed(2)}</div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-1">✓ Available for Cash on Delivery</div>
              </div>
            </div>

            <p className="text-xs text-zinc-600 mt-4 leading-relaxed">{selectedProduct.description}</p>

            {/* Variant options */}
            {selectedProduct.variants.length > 0 && (
              <div className="mt-4 space-y-2">
                <span className="text-[11px] font-semibold text-zinc-700 uppercase">Select Variant:</span>
                <div className="grid grid-cols-2 gap-2">
                  {selectedProduct.variants.map((v, i) => {
                    const isSel = selectedVariant?.sku === v.sku;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`p-2 rounded-xl border text-xs font-semibold text-left transition ${
                          isSel ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 hover:border-zinc-300 text-zinc-800"
                        }`}
                      >
                        <div>{v.title}</div>
                        <div className={`text-[10px] ${isSel ? "text-zinc-300" : "text-zinc-400"}`}>${v.price}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-zinc-100 flex gap-2">
              <button
                onClick={() => {
                  handleAddToCart(selectedProduct, selectedVariant);
                  setSelectedProduct(null);
                }}
                className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center space-x-1.5 btn-press"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </button>
              <Link
                href={`/store/${tenantSlug}/products/${selectedProduct.slug}`}
                className="py-2.5 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold text-xs rounded-xl transition"
              >
                View Full Page
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-zinc-200 shadow-2xl relative my-8">
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 p-1.5 rounded-lg hover:bg-zinc-100"
            >
              <X className="w-4 h-4" />
            </button>

            {orderSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Order Confirmed!</h3>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                  Thank you for shopping with <span className="font-semibold text-zinc-800">{storeDisplayName}</span>. Your order has been placed.
                </p>

                <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs space-y-1 font-mono">
                  <div className="text-zinc-500">Order ID: <span className="text-zinc-900 font-bold">{orderSuccess.orderNumber}</span></div>
                  <div className="text-zinc-500">Total: <span className="text-zinc-900 font-bold">${orderSuccess.total}</span></div>
                  <div className="text-zinc-500">Payment: <span className="text-zinc-900 font-bold uppercase">{orderSuccess.paymentMethod}</span></div>
                  <div className="text-emerald-600 text-[11px] pt-1">🚚 Estimated Delivery: 2-3 Business Days</div>
                </div>

                <button
                  onClick={() => {
                    setOrderSuccess(null);
                    setIsCheckoutOpen(false);
                  }}
                  className="w-full py-2.5 bg-zinc-900 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-zinc-800 transition"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Instant Cash on Delivery Checkout</h3>
                <p className="text-xs text-zinc-500 mt-0.5 mb-5">Pay cash upon home delivery. Zero advance payment required.</p>

                <form onSubmit={handleCheckoutSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 uppercase tracking-wider mb-1">Full Name</label>
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs outline-none focus:border-zinc-900 transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 uppercase tracking-wider mb-1">Phone Number (For Delivery Driver)</label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 234-5678"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs outline-none focus:border-zinc-900 transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 uppercase tracking-wider mb-1">Email (Order Confirmation)</label>
                    <input
                      type="email"
                      placeholder="jane@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs outline-none focus:border-zinc-900 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 uppercase tracking-wider mb-1">Delivery Address & City</label>
                    <textarea
                      placeholder="Apartment, Street address, City"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs outline-none focus:border-zinc-900 transition h-16 resize-none"
                      required
                    />
                  </div>

                  {/* Payment Method Selector */}
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 uppercase tracking-wider mb-1">Payment Preference</label>
                    <div className="space-y-1.5">
                      <label className="flex items-center justify-between p-2.5 border rounded-xl cursor-pointer text-xs transition border-zinc-900 bg-zinc-50">
                        <div className="flex items-center space-x-2">
                          <input type="radio" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} />
                          <div>
                            <span className="font-bold text-zinc-900">Cash on Delivery (COD)</span>
                            <span className="text-[10px] text-zinc-500 block">Recommended • Pay when parcel arrives</span>
                          </div>
                        </div>
                        <Banknote className="w-4 h-4 text-emerald-600" />
                      </label>
                    </div>
                  </div>

                  {/* Delivery Timeline info */}
                  <div className="p-2.5 bg-zinc-50 border border-zinc-200/80 rounded-xl text-[11px] text-zinc-500 space-y-1">
                    <div className="flex items-center justify-between">
                      <span>Dispatch:</span>
                      <span className="font-semibold text-zinc-800">Within 24-48 Hours</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Inspection:</span>
                      <span className="font-semibold text-emerald-700">Open parcel before paying</span>
                    </div>
                  </div>

                  {/* Total & Submit */}
                  <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold block">Total</span>
                      <span className="text-xl font-black text-zinc-900">${finalTotal.toFixed(2)}</span>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingOrder}
                      className="py-2.5 px-6 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center space-x-1.5 btn-press disabled:opacity-60"
                    >
                      <span>{isSubmittingOrder ? "Confirming Order..." : "Place COD Order"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Rich Multi-Column Store Footer */}
      <StoreFooter
        storeName={storeDisplayName}
        storeSlug={tenantSlug}
        categoryName={categoryConfig.name}
      />
    </div>
  );
}
