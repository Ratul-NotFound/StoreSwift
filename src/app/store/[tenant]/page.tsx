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
  Plus,
  Zap,
  Leaf,
  Award,
  Diamond,
  Cpu,
  Footprints
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

  const [templateKey, setTemplateKey] = useState<string>(categoryConfig.recommendedTemplate || "minimal");
  const template = getTemplateConfig(templateKey);

  const seed = useMemo(() => {
    return generateStoreSeedData(tenantSlug, activeCategoryKey);
  }, [tenantSlug, activeCategoryKey]);

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

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");
  const [priceFilter, setPriceFilter] = useState<"all" | "under-35" | "35-80" | "over-80">("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [modalImageAngle, setModalImageAngle] = useState<"primary" | "secondary">("primary");

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
        return 0;
      });
  }, [products, searchQuery, sortBy, priceFilter, inStockOnly]);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      if (!exists) success("Saved to Wishlist", "Item added to your personal collection.");
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
      setCartItems(cartItems.map((c) => c.id === itemKey ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCartItems([...cartItems, {
        id: itemKey,
        title: variant ? `${prod.title} (${variant.title})` : prod.title,
        price: variant ? parseFloat(variant.price) : prod.price,
        quantity: 1,
        variantId: variant?.sku || "std"
      }]);
    }
    trackEvent("add_to_cart", { productTitle: prod.title, price: prod.price, variant: variant?.title });
    success("Added to Cart", `${prod.title}${variant ? ` (${variant.title})` : ""} added to your bag.`);
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
      toastError("Missing Fields", "Please fill in name, phone, and delivery address.");
      return;
    }
    setIsSubmittingOrder(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeSlug: tenantSlug,
          customerName, customerPhone, customerEmail,
          shippingAddress: { address: shippingAddress, notes: deliveryNotes },
          items: cartItems.map((it) => ({ variantId: it.variantId || "mock-var-1", title: it.title, price: it.price, quantity: it.quantity })),
          paymentMethod,
          shippingFee: cartSummary.isFreeShippingEligible ? 0 : shippingFee
        })
      });
      const data = await res.json();
      if (!res.ok) { toastError("Order Issue", data.error || "Failed to process order."); setIsSubmittingOrder(false); return; }
      setOrderSuccess({ orderNumber: data.orderNumber || `SS-${Date.now().toString(36).toUpperCase()}`, total: data.totalAmount || finalTotal.toFixed(2), paymentMethod });
      setCartItems([]);
      setIsSubmittingOrder(false);
      success("Order Confirmed!", `Order #${data.orderNumber} placed.`);
    } catch {
      setOrderSuccess({ orderNumber: `SS-${Date.now().toString(36).toUpperCase()}`, total: finalTotal.toFixed(2), paymentMethod });
      setCartItems([]);
      setIsSubmittingOrder(false);
      success("Order Placed", "Your order has been recorded.");
    }
  };

  const storeDisplayName = tenantSlug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  const layoutType = template.getHeroLayoutType();
  const psych = template.getCategoryPsychology();
  const philosophy = template.getDesignPhilosophy();

  // ─── Shared product card renderer ─────────────────────────────────────────
  const renderProductCard = (p: typeof products[0], isLead = false) => {
    const isWishlisted = wishlist.includes(p.id);
    const discountPct = template.calculateDiscount(p.price, p.comparePrice);
    return (
      <div
        key={p.id}
        className={`rounded-2xl border transition-all duration-300 group ${template.classes.productCard} ${
          isLead ? "p-5 shadow-card hover:shadow-xl" : "p-4 shadow-subtle hover:shadow-card flex flex-col justify-between"
        }`}
      >
        <div className={isLead ? "grid grid-cols-1 sm:grid-cols-2 gap-6 items-center" : ""}>
          {/* Image frame */}
          <div
            className={`relative ${template.getProductCardAspect()} rounded-xl overflow-hidden bg-black/5 dark:bg-white/5 border border-current/10 cursor-pointer ${isLead ? "" : "mb-4"}`}
            onClick={() => handleOpenProduct(p)}
          >
            <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0" />
            <img src={p.secondaryImage || p.imageUrl} alt={`${p.title} alt`} className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            {p.badge && (
              <span className="absolute top-2.5 left-2.5 bg-zinc-950/90 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                {template.formatProductBadge(p.badge)}
              </span>
            )}
            {discountPct > 0 && (
              <span className="absolute top-2.5 right-2.5 bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow">
                -{discountPct}%
              </span>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); toggleWishlist(p.id); }}
              className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md flex items-center justify-center text-zinc-700 dark:text-zinc-200 hover:text-rose-600 shadow-sm transition"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? "text-rose-500 fill-current" : ""}`} />
            </button>
            {!isLead && (
              <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <button
                  onClick={(e) => { e.stopPropagation(); handleAddToCart(p, p.variants[0]); }}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-lg flex items-center justify-center space-x-1.5 btn-press ${template.classes.primaryButton}`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Quick Add</span>
                </button>
              </div>
            )}
          </div>

          {/* Info block */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className={template.classes.editorialTag}>{categoryConfig.name} • {isLead ? "Signature" : "Curated"}</span>
              <div className="flex items-center space-x-1 text-amber-500 text-xs">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="font-bold">{p.rating}</span>
                <span className="opacity-40 text-[10px]">(48)</span>
              </div>
            </div>
            <h3
              onClick={() => handleOpenProduct(p)}
              className={`font-black tracking-tight cursor-pointer hover:opacity-80 transition ${isLead ? "text-xl sm:text-2xl" : "text-sm leading-snug"}`}
            >
              {p.title}
            </h3>
            <p className="text-xs opacity-60 leading-relaxed line-clamp-2">{p.description}</p>
            {isLead && (
              <>
                <div className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border w-fit ${template.classes.featureCard}`}>
                  {psych.keySpecHighlight.split("•")[0].trim()}
                </div>
                <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  <span>{template.getScarcityUrgency(5)}</span>
                </div>
                {p.variants.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider opacity-60">Options:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {p.variants.slice(0, 4).map((v, vi) => (
                        <button key={vi} onClick={() => handleAddToCart(p, v)} className="px-2.5 py-1 rounded-lg text-[10px] font-mono border border-current/20 hover:border-current/50 transition">
                          {v.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
            <div className={`flex items-center justify-between ${isLead ? "pt-3 border-t border-current/10" : "pt-2"}`}>
              <div>
                <div className={`font-black ${isLead ? "text-2xl" : "text-base"}`}>{template.formatPrice(p.price)}</div>
                <span className="text-[11px] opacity-40 line-through">{template.formatPrice(p.comparePrice)}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <button onClick={() => handleOpenProduct(p)} className="p-2 border border-current/20 hover:border-current/40 rounded-xl transition" title="Specs">
                  <SlidersHorizontal className={`${isLead ? "w-4 h-4" : "w-3.5 h-3.5"}`} />
                </button>
                <button
                  onClick={() => handleAddToCart(p, p.variants[0])}
                  className={`rounded-xl font-bold text-xs transition flex items-center space-x-1.5 btn-press ${template.classes.primaryButton} ${isLead ? "py-2.5 px-4" : "py-2 px-3"}`}
                >
                  <ShoppingBag className={`${isLead ? "w-3.5 h-3.5" : "w-3 h-3"}`} />
                  <span>{isLead ? "Add to Bag" : "Add"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-500 ${template.classes.pageBg}`}>
      {/* ─── Announcement Bar ──────────────────────────────────────────────── */}
      {(() => {
        const h = template.getAnnouncementHighlights();
        return (
          <div className={`py-2 px-4 text-xs font-semibold tracking-wide transition-colors ${template.classes.announcementBar}`}>
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <span className="hidden sm:inline-block">{h.leading}</span>
              <span className="mx-auto sm:mx-0">{h.center}</span>
              <span className="hidden md:inline-block">{h.trailing}</span>
            </div>
          </div>
        );
      })()}

      {/* ─── Sticky Header ─────────────────────────────────────────────────── */}
      <header className={`sticky top-0 z-30 shadow-subtle transition-colors duration-300 ${template.classes.headerBg}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href={`/store/${tenantSlug}`} className="flex items-center space-x-2.5 flex-shrink-0 group">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-sm block">{storeDisplayName}</span>
              <span className="text-[10px] opacity-70 font-medium block -mt-0.5">{categoryConfig.name} • {template.name}</span>
            </div>
          </Link>

          <div
            onClick={() => setIsSearchOpen(true)}
            className="flex-1 max-w-md hidden sm:flex items-center space-x-2 px-3.5 py-2 bg-black/5 dark:bg-white/5 border border-current/15 rounded-xl text-xs opacity-75 cursor-pointer hover:opacity-100 hover:border-current/30 transition"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search {categoryConfig.name.toLowerCase()}...</span>
            <kbd className="ml-auto text-[10px] bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
          </div>

          <div className="flex items-center space-x-2">
            <button onClick={() => setIsSearchOpen(true)} className="sm:hidden p-2 opacity-75 hover:opacity-100 rounded-xl transition">
              <Search className="w-4 h-4" />
            </button>
            <button onClick={() => success("Wishlist", `${wishlist.length} saved item(s).`)} className="p-2 opacity-75 hover:opacity-100 rounded-xl transition relative">
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{wishlist.length}</span>
              )}
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 btn-press ${template.classes.primaryButton}`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Bag ({cartItems.reduce((s, i) => s + i.quantity, 0)})</span>
              {cartItems.length > 0 && <span className="hidden sm:inline-block border-l border-white/20 pl-2">${finalTotal.toFixed(2)}</span>}
            </button>
          </div>
        </div>
      </header>

      {/* ─── Category & Template Nav Bar ───────────────────────────────────── */}
      <div className={`py-2.5 px-4 overflow-x-auto scrollbar-none sticky top-16 z-20 transition-colors ${template.classes.navPillBg}`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center space-x-1.5 flex-nowrap">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mr-2 flex-shrink-0">Department:</span>
            {ALL_CATEGORIES.map((catKey) => {
              const cfg = CATEGORIES_MAP[catKey];
              const isActive = activeCategoryKey === catKey;
              return (
                <button
                  key={catKey}
                  onClick={() => setActiveCategoryKey(catKey)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${isActive ? template.classes.pillActive : "bg-zinc-100 hover:bg-zinc-200 text-zinc-600"}`}
                >
                  {cfg.name}
                </button>
              );
            })}
          </div>
          <div className="hidden lg:flex items-center space-x-1.5 flex-shrink-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mr-1">Style:</span>
            {ALL_TEMPLATES.map((tKey) => {
              const tmpl = STORE_TEMPLATES[tKey];
              const isSelected = templateKey === tKey;
              return (
                <button
                  key={tKey}
                  onClick={() => setTemplateKey(tKey)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${isSelected ? "bg-zinc-900 text-white shadow-sm" : "bg-zinc-50 border border-zinc-200 text-zinc-600 hover:bg-zinc-100"}`}
                >
                  {tmpl.name.split(" ")[0]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          PER-TEMPLATE HERO SECTIONS — 6 distinct visual personalities
          Branched on template.getHeroLayoutType()
          ═══════════════════════════════════════════════════════════════════════ */}

      {/* ── ARCHITECTURAL hero: Fashion / Minimal Atelier ──────────────────── */}
      {layoutType === "architectural" && (
        <section className={`relative overflow-hidden border-b transition-colors ${template.classes.heroSection}`}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">
            <div className="lg:col-span-6 flex flex-col justify-center py-16 pr-0 lg:pr-14 space-y-6">
              <span className={`${template.classes.editorialTag} tracking-[0.3em]`}>{template.getCuratedCollectionTitle()}</span>
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-[-0.03em] leading-[0.9]">
                {categoryConfig.tagline.split(",")[0]}
              </h1>
              <div className="w-16 h-px bg-current opacity-20" />
              <p className="text-sm leading-relaxed max-w-sm opacity-55">{psych.reassurancePledge}</p>
              <div className="flex items-center gap-3 pt-2">
                <a href="#catalog" className={`py-3.5 px-8 rounded-xl font-bold text-xs tracking-wider uppercase transition flex items-center space-x-2 btn-press ${template.classes.primaryButton}`}>
                  <span>Shop Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <button
                  onClick={() => success("Quality Pledge", psych.reassurancePledge)}
                  className={`py-3.5 px-5 rounded-xl font-semibold text-xs border transition ${template.classes.secondaryButton}`}
                >
                  Quality Pledge
                </button>
              </div>
              <div className="pt-2 space-y-1.5 border-t border-current/10 pt-4">
                {psych.doorstepChecklist.map((item, i) => (
                  <div key={i} className="flex items-start space-x-2.5 text-[11px] opacity-55">
                    <span className="font-mono font-bold mt-0.5 flex-shrink-0">0{i + 1}</span>
                    <span className="leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-6 relative overflow-hidden">
              <img src={categoryConfig.heroImage} alt={categoryConfig.name} className="w-full h-full object-cover object-top" style={{ minHeight: "400px" }} />
              <div className="absolute inset-0 bg-gradient-to-r from-current/[0.06] to-transparent pointer-events-none" />
              <div className={`absolute top-6 right-6 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${template.classes.heroBadge}`}>
                {template.badge}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-white text-[10px] font-mono tracking-widest uppercase opacity-75">{template.getBrandSignature()}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── ETHEREAL hero: Beauty / Luxe Glow ─────────────────────────────── */}
      {layoutType === "ethereal" && (
        <section className={`relative overflow-hidden py-16 sm:py-24 border-b transition-colors ${template.classes.heroSection}`}>
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-rose-200/25 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-pink-200/20 blur-3xl" />
          </div>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="text-center space-y-4 mb-12">
              <span className={template.classes.editorialTag}>{template.getCuratedCollectionTitle()}</span>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">{categoryConfig.tagline.split(",")[0]}</h1>
              <p className="text-sm opacity-55 max-w-lg mx-auto leading-relaxed">{psych.reassurancePledge}</p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <a href="#catalog" className={`py-3.5 px-8 rounded-full font-bold text-xs transition flex items-center space-x-2 btn-press ${template.classes.primaryButton}`}>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Explore Rituals</span>
                </a>
                <button
                  onClick={() => success("Formula Standard", psych.keySpecHighlight)}
                  className={`py-3.5 px-6 rounded-full font-semibold text-xs border transition ${template.classes.secondaryButton}`}
                >
                  {psych.keySpecHighlight.split("•")[0].trim()}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="relative group order-2 md:order-1">
                <div className="rounded-3xl overflow-hidden aspect-[3/4] shadow-2xl border border-rose-100/50">
                  <img src={categoryConfig.heroImage} alt={categoryConfig.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className={`absolute -right-4 top-8 bg-white/95 backdrop-blur-sm rounded-2xl p-3 shadow-lg border border-rose-100/60 max-w-[160px]`}>
                  <p className={`text-[9px] font-mono uppercase tracking-widest mb-1 ${template.classes.accentText}`}>Key Actives</p>
                  <p className="text-xs font-bold text-zinc-900 leading-tight">{psych.keySpecHighlight.split("•")[0].trim()}</p>
                </div>
                <div className="absolute -bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-2.5 shadow-lg border border-rose-100/60">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-bold text-zinc-900">Dermatologist Verified</span>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2 space-y-5">
                <div className={`p-5 rounded-2xl border space-y-3 ${template.classes.featureCard}`}>
                  <p className={`text-[10px] font-mono uppercase tracking-widest font-bold ${template.classes.accentText}`}>Doorstep Ritual Check</p>
                  {psych.doorstepChecklist.map((item, i) => (
                    <div key={i} className="flex items-start space-x-3">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 mt-0.5 ${template.classes.pillActive}`}>{i + 1}</span>
                      <p className="text-xs opacity-70 leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
                {template.getManifestoPillars().slice(0, 2).map((pillar) => (
                  <div key={pillar.index} className="flex items-start space-x-3 pl-1">
                    <ShieldCheck className={`w-4 h-4 mt-0.5 flex-shrink-0 ${template.classes.accentText}`} />
                    <div>
                      <p className="text-xs font-bold">{pillar.title}</p>
                      <p className="text-[11px] opacity-60 leading-relaxed">{pillar.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── CYBER hero: Electronics / Tech ────────────────────────────────── */}
      {layoutType === "cyber" && (
        <section className={`relative overflow-hidden border-b transition-colors ${template.classes.heroSection}`}>
          <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{ backgroundImage: "linear-gradient(#38bdf8 1px, transparent 1px), linear-gradient(90deg, #38bdf8 1px, transparent 1px)", backgroundSize: "40px 40px" }}
          />
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-5">
              <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-mono border ${template.classes.heroBadge}`}>
                <Cpu className="w-3.5 h-3.5" />
                <span>{template.formatHeroBadge(categoryConfig.name)}</span>
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-[-0.02em] leading-[0.9] font-mono">
                {categoryConfig.tagline.split(",")[0]}
              </h1>
              <div className="grid grid-cols-2 gap-2 py-2 max-w-md">
                {[
                  { label: "MATERIAL", value: psych.keySpecHighlight.split("•")[0].trim() },
                  { label: "WARRANTY", value: (psych.keySpecHighlight.split("•")[2] || "2-Year").trim() },
                  { label: "DISPATCH", value: "24h Priority Air" },
                  { label: "COD", value: "Inspect Before Pay" }
                ].map((spec) => (
                  <div key={spec.label} className={`p-2.5 rounded-xl border ${template.classes.featureCard}`}>
                    <p className="text-[9px] font-mono uppercase tracking-widest opacity-50 mb-0.5">{spec.label}</p>
                    <p className={`text-xs font-bold font-mono ${template.classes.accentText}`}>{spec.value}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs leading-relaxed max-w-md opacity-55 font-mono">{psych.reassurancePledge}</p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a href="#catalog" className={`py-3 px-7 rounded-xl font-bold text-xs tracking-wider uppercase transition flex items-center space-x-2 btn-press font-mono ${template.classes.primaryButton}`}>
                  <Zap className="w-4 h-4" />
                  <span>View Hardware</span>
                </a>
                <button
                  onClick={() => success("Verification Protocol", psych.doorstepChecklist[0])}
                  className={`py-3 px-5 rounded-xl font-semibold text-xs border transition font-mono ${template.classes.secondaryButton}`}
                >
                  Verify Protocol
                </button>
              </div>
            </div>
            <div className="lg:col-span-5 relative group">
              <div className="relative rounded-2xl overflow-hidden aspect-[16/10] border border-current/20">
                <img src={categoryConfig.heroImage} alt={categoryConfig.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className={`absolute top-4 left-4 px-2.5 py-1 rounded-lg text-[9px] font-mono border ${template.classes.heroBadge}`}>
                  SN: QC-VERIFIED
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/80 backdrop-blur-md rounded-xl p-3 border border-white/10">
                    <p className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest mb-1">Key Specification</p>
                    <p className="text-xs font-bold font-mono text-white">{psych.keySpecHighlight}</p>
                  </div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-1 gap-1.5">
                {psych.doorstepChecklist.slice(0, 2).map((item, i) => (
                  <div key={i} className={`flex items-center space-x-2 p-2 rounded-lg border text-[10px] font-mono ${template.classes.featureCard}`}>
                    <Check className={`w-3 h-3 flex-shrink-0 ${template.classes.accentText}`} />
                    <span className="opacity-70">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── HERITAGE hero: Footwear / Warm Heritage ────────────────────────── */}
      {layoutType === "heritage" && (
        <section className={`relative overflow-hidden border-b transition-colors ${template.classes.heroSection}`}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 min-h-[480px]">
            <div className="flex flex-col justify-center py-14 lg:py-20 pr-0 lg:pr-12 space-y-5">
              <div className="space-y-1">
                <span className={`block ${template.classes.editorialTag}`}>{template.getCuratedCollectionTitle()}</span>
                <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[0.95] font-serif">{categoryConfig.tagline.split(",")[0]}</h1>
              </div>
              <div className={`inline-flex items-center space-x-2.5 px-4 py-2.5 rounded-xl border w-fit ${template.classes.featureCard}`}>
                <Award className={`w-4 h-4 ${template.classes.accentText}`} />
                <div>
                  <p className="text-[9px] font-mono uppercase tracking-widest opacity-50">Craftsmanship</p>
                  <p className="text-xs font-bold">{psych.keySpecHighlight.split("•")[0].trim()}</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed max-w-sm opacity-55">{psych.reassurancePledge}</p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a href="#catalog" className={`py-3.5 px-7 rounded-xl font-bold text-xs transition flex items-center space-x-2 btn-press ${template.classes.primaryButton}`}>
                  <span>Shop the Workshop</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <button
                  onClick={() => success("Welt Guarantee", psych.keySpecHighlight)}
                  className={`py-3.5 px-5 rounded-xl font-semibold text-xs border transition ${template.classes.secondaryButton}`}
                >
                  Welt Guarantee
                </button>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <CheckCircle2 className={`w-4 h-4 ${template.classes.accentText}`} />
                <span className="font-semibold opacity-75">Try-before-you-pay doorstep fit trial</span>
              </div>
            </div>
            <div className="relative overflow-hidden">
              <img src={categoryConfig.heroImage} alt={categoryConfig.name} className="w-full h-full object-cover object-center" style={{ minHeight: "360px" }} />
              <div className="absolute inset-0 bg-gradient-to-r from-current/[0.04] to-transparent pointer-events-none" />
              <div className={`absolute top-6 left-6 px-3 py-2 rounded-xl border backdrop-blur-md ${template.classes.heroBadge}`}>
                <p className="text-[9px] font-mono uppercase tracking-widest opacity-60 mb-0.5">Construction</p>
                <p className="text-xs font-bold">{template.badge}</p>
              </div>
              <div className="absolute bottom-6 left-4 right-4">
                <div className="bg-white/92 backdrop-blur-md rounded-2xl p-4 border border-stone-200/60 shadow-lg">
                  <p className="text-[9px] font-mono uppercase tracking-widest text-stone-500 mb-2">Doorstep Fit Trial</p>
                  {psych.doorstepChecklist.slice(0, 2).map((item, i) => (
                    <div key={i} className="flex items-start space-x-1.5 text-[10px] text-stone-700 mb-1">
                      <span className="font-bold text-amber-900 mt-0.5 flex-shrink-0">0{i + 1}.</span>
                      <span className="leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── OPULENT hero: Jewelry / Maison ────────────────────────────────── */}
      {layoutType === "opulent" && (
        <section className={`relative overflow-hidden py-16 sm:py-24 border-b transition-colors ${template.classes.heroSection}`}>
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-amber-500/[0.04] blur-3xl" />
          </div>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 text-center">
            <span className={`block mb-4 ${template.classes.editorialTag}`}>{template.getCuratedCollectionTitle()}</span>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-serif tracking-tight leading-tight mb-5">
              {categoryConfig.tagline.split(",")[0]}
            </h1>
            <p className="text-sm opacity-45 max-w-md mx-auto leading-relaxed mb-8">{psych.reassurancePledge}</p>
            <div className="relative max-w-sm mx-auto mb-8">
              <div className="rounded-3xl overflow-hidden aspect-square border border-amber-800/15 shadow-2xl">
                <img src={categoryConfig.heroImage} alt={categoryConfig.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              </div>
              <div className={`absolute -right-4 top-8 px-3 py-2 rounded-xl border backdrop-blur-md shadow-lg ${template.classes.featureCard}`}>
                <p className="text-[9px] font-mono uppercase tracking-widest opacity-55 mb-0.5">Certification</p>
                <p className={`text-xs font-bold ${template.classes.accentText}`}>GIA Certified</p>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black/80 backdrop-blur-md rounded-xl p-3 border border-amber-900/30">
                  <p className={`text-[10px] font-mono uppercase tracking-widest mb-1 ${template.classes.accentText}`}>Metal & Stone</p>
                  <p className="text-xs font-bold text-white">{psych.keySpecHighlight.split("•")[0].trim()}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4">
              <a href="#catalog" className={`py-3.5 px-8 rounded-xl font-bold text-xs transition flex items-center space-x-2 btn-press ${template.classes.primaryButton}`}>
                <Diamond className="w-3.5 h-3.5" />
                <span>View Collection</span>
              </a>
              <button
                onClick={() => success("Hallmark Standard", psych.keySpecHighlight)}
                className={`py-3.5 px-6 rounded-xl font-semibold text-xs border transition ${template.classes.secondaryButton}`}
              >
                Hallmark Standard
              </button>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-6 text-[11px] opacity-45">
              {psych.doorstepChecklist.map((item, i) => (
                <span key={i} className="flex items-center space-x-1.5">
                  <span className={`font-mono font-bold ${template.classes.accentText}`}>0{i + 1}.</span>
                  <span>{item}</span>
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── ORGANIC hero: Food & Pantry ────────────────────────────────────── */}
      {layoutType === "organic" && (
        <section className={`relative overflow-hidden border-b transition-colors ${template.classes.heroSection}`}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 min-h-[460px] items-center">
            <div className="py-14 lg:py-20 pr-0 lg:pr-12 space-y-5">
              <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border w-fit ${template.classes.heroBadge}`}>
                <Leaf className="w-3.5 h-3.5" />
                <span className="text-xs font-mono">{template.badge}</span>
              </div>
              <div className="space-y-2">
                <span className={`block ${template.classes.editorialTag}`}>{template.getCuratedCollectionTitle()}</span>
                <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[0.95]">{categoryConfig.tagline.split(",")[0]}</h1>
              </div>
              <div className={`inline-flex items-center space-x-3 px-4 py-3 rounded-2xl border w-fit ${template.classes.featureCard}`}>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                <div>
                  <p className="text-[9px] font-mono uppercase tracking-widest opacity-55">Freshness Standard</p>
                  <p className="text-xs font-bold">{psych.keySpecHighlight.split("•")[0].trim()}</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed max-w-sm opacity-55">{psych.reassurancePledge}</p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a href="#catalog" className={`py-3.5 px-7 rounded-xl font-bold text-xs transition flex items-center space-x-2 btn-press ${template.classes.primaryButton}`}>
                  <Leaf className="w-4 h-4" />
                  <span>Shop Provisions</span>
                </a>
                <button
                  onClick={() => success("Freshness Guarantee", psych.keySpecHighlight)}
                  className={`py-3.5 px-5 rounded-xl font-semibold text-xs border transition ${template.classes.secondaryButton}`}
                >
                  Freshness Pledge
                </button>
              </div>
            </div>
            <div className="relative group overflow-hidden">
              <img src={categoryConfig.heroImage} alt={categoryConfig.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" style={{ minHeight: "360px" }} />
              <div className="absolute inset-0 bg-gradient-to-r from-current/[0.04] to-transparent pointer-events-none" />
              <div className="absolute top-5 right-5 bg-white/95 backdrop-blur-sm rounded-2xl p-3 shadow-lg border border-stone-200/60 text-center">
                <p className="text-[9px] font-mono uppercase tracking-widest text-stone-500 mb-1">Origin</p>
                <p className="text-xs font-bold text-stone-900">Single Estate</p>
                <p className={`text-[10px] font-semibold ${template.classes.accentText}`}>Direct Trade</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-stone-900/65 to-transparent p-5">
                <p className="text-white text-[10px] font-mono uppercase tracking-widest opacity-75">{template.getBrandSignature()}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── Manifesto Quality Pillars ────────────────────────────────────── */}
      <section className="border-b border-current/10 py-7 px-4 sm:px-6 bg-black/[0.02] dark:bg-white/[0.02]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {template.getManifestoPillars().map((pillar) => (
            <div
              key={pillar.index}
              className={`space-y-1.5 border-l-2 pl-3.5 ${pillar.highlight ? "border-emerald-500" : "border-current/25"}`}
            >
              <span className={`text-[10px] font-mono uppercase tracking-widest block ${pillar.highlight ? "text-emerald-600 dark:text-emerald-400 font-bold" : "opacity-45"}`}>
                {pillar.index} / {pillar.category}
              </span>
              <h4 className="text-xs font-bold uppercase tracking-wider">{pillar.title}</h4>
              <p className="text-[11px] opacity-65 leading-relaxed">{pillar.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Psychology Reassurance & Inspection Bar ─────────────────────── */}
      <div className="border-b border-current/10 py-3.5 px-4 sm:px-6 bg-black/[0.015] dark:bg-white/[0.015]">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="font-semibold">{psych.reassurancePledge}</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[11px] opacity-70 font-mono">
            <span className="opacity-45 font-bold">INSPECTION:</span>
            {psych.doorstepChecklist.map((item, i) => (
              <span key={i} className="flex items-center space-x-1">
                <span className="text-emerald-600 font-bold">0{i + 1}.</span>
                <span>{item}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Spotlight Drop ──────────────────────────────────────────────── */}
      {products[0] && (
        <SpotlightDrop
          product={{ ...products[0], secondaryImage: products[0].secondaryImage }}
          template={template}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* ─── Design Philosophy / Collection Banner ───────────────────────── */}
      <section className={`py-12 px-4 sm:px-6 transition-colors ${template.classes.lookbookBg}`}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-3">
            <span className={template.classes.editorialTag}>{template.getCuratedCollectionTitle()}</span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">{philosophy.curationQuote}</h3>
            <p className="text-xs sm:text-sm opacity-70 leading-relaxed">
              {philosophy.ethos}{philosophy.materialsFocus ? ` Materials: ${philosophy.materialsFocus}.` : ""}
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {["Certified Provenance", template.badge, "Nationwide COD"].map((tag) => (
                <span key={tag} className="text-[10px] font-mono px-2.5 py-1 rounded-full border border-current/20 uppercase">{tag}</span>
              ))}
            </div>
          </div>
          <a href="#catalog" className={`py-3.5 px-6 rounded-xl font-bold text-xs transition flex items-center space-x-2 btn-press ${template.classes.primaryButton}`}>
            <span>Browse {categoryConfig.name}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      {/* ─── Main Catalog ─────────────────────────────────────────────────── */}
      <main id="catalog" className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10">
        {/* Toolbar */}
        <div className={`rounded-2xl p-4 border shadow-subtle mb-10 space-y-3.5 transition-colors ${template.classes.toolbarBg}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold tracking-tight">{categoryConfig.name} — Curated Selection</h2>
              <p className="text-xs opacity-55 mt-0.5">{filteredProducts.length} items • In stock • {template.name}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center space-x-1.5 text-xs opacity-75 bg-black/5 dark:bg-white/5 border border-current/15 rounded-xl px-3 py-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 opacity-60" />
                <span>Sort:</span>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="bg-transparent font-semibold outline-none cursor-pointer text-xs">
                  <option value="featured" className="text-black">Featured First</option>
                  <option value="price-asc" className="text-black">Price: Low to High</option>
                  <option value="price-desc" className="text-black">Price: High to Low</option>
                  <option value="rating" className="text-black">Highest Rated</option>
                </select>
              </div>
              <button
                onClick={() => setInStockOnly(!inStockOnly)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${inStockOnly ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" : "bg-black/5 dark:bg-white/5 border-current/15 hover:border-current/30"}`}
              >
                {inStockOnly ? "In Stock Only" : "All Availability"}
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-2 pt-2.5 border-t border-current/10 overflow-x-auto">
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-55 mr-1 flex-shrink-0">Price:</span>
            {[{ key: "all", label: "All" }, { key: "under-35", label: "Under $35" }, { key: "35-80", label: "$35 – $80" }, { key: "over-80", label: "Over $80" }].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setPriceFilter(key as any)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${priceFilter === key ? template.classes.pillActive : "bg-black/5 dark:bg-white/5 opacity-80 hover:opacity-100"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <p className="text-sm font-bold opacity-75">No products match your filter criteria.</p>
            <button onClick={() => { setSearchQuery(""); setPriceFilter("all"); setInStockOnly(false); }} className="text-xs underline opacity-65 hover:opacity-100 font-semibold">
              Reset Filters
            </button>
          </div>
        ) : !searchQuery && priceFilter === "all" && !inStockOnly && filteredProducts.length >= 3 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">{renderProductCard(filteredProducts[0], true)}</div>
            {filteredProducts.slice(1, 3).map((p) => (
              <div key={p.id}>{renderProductCard(p, false)}</div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((p) => (
              <div key={p.id}>{renderProductCard(p, false)}</div>
            ))}
          </div>
        )}
      </main>

      {/* ─── Testimonials ────────────────────────────────────────────────── */}
      <TestimonialsSection storeName={storeDisplayName} template={template} />

      {/* ─── Search Modal ────────────────────────────────────────────────── */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        products={products.map((p) => ({ id: p.id, title: p.title, slug: p.slug, price: p.price, comparePrice: p.comparePrice, imageUrl: p.imageUrl, badge: p.badge, category: categoryConfig.name }))}
        onSelectProduct={(p) => { const match = products.find((pr) => pr.id === p.id); if (match) handleOpenProduct(match); }}
        onAddToCart={(p) => { const match = products.find((pr) => pr.id === p.id); if (match) handleAddToCart(match, match.variants[0]); }}
      />

      {/* ─── Cart Drawer ─────────────────────────────────────────────────── */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
              <div className="p-5 border-b border-zinc-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-4 h-4 text-zinc-900" />
                  <span className="font-bold text-zinc-900 text-sm">Shopping Bag</span>
                  <span className="text-xs text-zinc-400">({cartItems.length} items)</span>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="text-zinc-400 hover:text-zinc-600 p-1.5 rounded-lg hover:bg-zinc-100"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-4 bg-zinc-50 border-b border-zinc-200 text-xs">
                {cartSummary.isFreeShippingEligible ? (
                  <div className="flex items-center space-x-2 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Free Express Delivery applied.</span>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-zinc-700 mb-1.5">
                      <span>Add ${(50 - cartSummary.subtotal).toFixed(2)} more for FREE Delivery</span>
                      <span>{Math.round((cartSummary.subtotal / 50) * 100)}%</span>
                    </div>
                    <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-zinc-900 h-full transition-all duration-300 rounded-full" style={{ width: `${Math.min(100, (cartSummary.subtotal / 50) * 100)}%` }} />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400"><ShoppingBag className="w-6 h-6" /></div>
                    <p className="text-xs font-bold text-zinc-800">Your bag is empty</p>
                    <p className="text-[11px] text-zinc-400 max-w-xs mx-auto">Explore our {categoryConfig.name.toLowerCase()} catalog.</p>
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
                            <button onClick={() => handleQuantityChange(item.id, -1)} className="w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-zinc-100 rounded text-zinc-600">-</button>
                            <span className="w-6 text-center text-xs font-bold text-zinc-900">{item.quantity}</span>
                            <button onClick={() => handleQuantityChange(item.id, 1)} className="w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-zinc-100 rounded text-zinc-600">+</button>
                          </div>
                          <button onClick={() => handleQuantityChange(item.id, -item.quantity)} className="text-zinc-400 hover:text-rose-600 p-1 transition"><X className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    ))}
                    <div className="pt-3 border-t border-zinc-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">Add-ons:</span>
                      <div className="space-y-2">
                        {[
                          { title: "Eco Protective Cotton Pouch", price: 6.0, desc: "+$6.00 • Zero plastic dust bag" },
                          { title: "Express Priority Packing", price: 3.5, desc: "+$3.50 • Front-of-line dispatch" }
                        ].map((addon) => (
                          <div key={addon.title} className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-zinc-200 text-xs">
                            <div>
                              <span className="font-bold text-zinc-900 block">{addon.title}</span>
                              <span className="text-[10px] text-zinc-400">{addon.desc}</span>
                            </div>
                            <button onClick={() => handleAddUpsell(addon.title, addon.price)} className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg transition"><Plus className="w-3.5 h-3.5" /></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {cartItems.length > 0 && (
                <div className="p-5 border-t border-zinc-200 space-y-3 bg-zinc-50">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-zinc-500"><span>Subtotal</span><span className="font-semibold text-zinc-900">${cartSummary.subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between text-zinc-500"><span>Shipping</span><span>{cartSummary.isFreeShippingEligible ? "FREE" : `$${shippingFee.toFixed(2)}`}</span></div>
                    <div className="flex justify-between text-sm font-black text-zinc-900 pt-2 border-t border-zinc-200"><span>Total</span><span>${finalTotal.toFixed(2)}</span></div>
                  </div>
                  <button
                    onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
                    className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center space-x-2 btn-press"
                  >
                    <span>Proceed to Cash on Delivery</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── Product Quick-View Modal ─────────────────────────────────────── */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-zinc-200 shadow-2xl relative">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 p-1.5 rounded-lg hover:bg-zinc-100"><X className="w-4 h-4" /></button>
            <div className="flex space-x-4 items-start">
              <div className="space-y-1.5 flex-shrink-0">
                <div className="w-28 h-28 rounded-xl overflow-hidden border border-zinc-200 bg-zinc-50 shadow-inner">
                  <img src={modalImageAngle === "primary" ? selectedProduct.imageUrl : (selectedProduct.secondaryImage || selectedProduct.imageUrl)} alt={selectedProduct.title} className="w-full h-full object-cover" />
                </div>
                {selectedProduct.secondaryImage && (
                  <div className="flex gap-1 justify-center">
                    {(["primary", "secondary"] as const).map((angle) => (
                      <button key={angle} type="button" onClick={() => setModalImageAngle(angle)}
                        className={`text-[9px] font-mono px-2 py-0.5 rounded border transition ${modalImageAngle === angle ? "bg-zinc-900 text-white border-zinc-900" : "bg-zinc-100 text-zinc-600 border-zinc-200"}`}>
                        {angle === "primary" ? "Studio" : "Alt"}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{categoryConfig.name}</span>
                <h3 className="text-base font-bold text-zinc-900 tracking-tight">{selectedProduct.title}</h3>
                <div className="text-lg font-black text-zinc-900 mt-1">${selectedProduct.price.toFixed(2)}</div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-1">Available for Cash on Delivery</div>
              </div>
            </div>
            <p className="text-xs text-zinc-600 mt-4 leading-relaxed">{selectedProduct.description}</p>
            {selectedProduct.variants.length > 0 && (
              <div className="mt-4 space-y-2">
                <span className="text-[11px] font-semibold text-zinc-700 uppercase">Select Variant:</span>
                <div className="grid grid-cols-2 gap-2">
                  {selectedProduct.variants.map((v, i) => {
                    const isSel = selectedVariant?.sku === v.sku;
                    return (
                      <button key={i} type="button" onClick={() => setSelectedVariant(v)}
                        className={`p-2 rounded-xl border text-xs font-semibold text-left transition ${isSel ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 hover:border-zinc-300 text-zinc-800"}`}>
                        <div>{v.title}</div>
                        <div className={`text-[10px] ${isSel ? "text-zinc-300" : "text-zinc-400"}`}>${v.price}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="mt-6 pt-4 border-t border-zinc-100 flex gap-2">
              <button onClick={() => { handleAddToCart(selectedProduct, selectedVariant); setSelectedProduct(null); }}
                className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center space-x-1.5 btn-press">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </button>
              <Link href={`/store/${tenantSlug}/products/${selectedProduct.slug}`} className="py-2.5 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold text-xs rounded-xl transition">
                View Full Page
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ─── Checkout Modal ───────────────────────────────────────────────── */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-zinc-200 shadow-2xl relative my-8">
            <button onClick={() => setIsCheckoutOpen(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 p-1.5 rounded-lg hover:bg-zinc-100"><X className="w-4 h-4" /></button>
            {orderSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto"><CheckCircle2 className="w-6 h-6" /></div>
                <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Order Confirmed!</h3>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto">Thank you for shopping with <span className="font-semibold text-zinc-800">{storeDisplayName}</span>.</p>
                <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs space-y-1 font-mono">
                  <div className="text-zinc-500">Order ID: <span className="text-zinc-900 font-bold">{orderSuccess.orderNumber}</span></div>
                  <div className="text-zinc-500">Total: <span className="text-zinc-900 font-bold">${orderSuccess.total}</span></div>
                  <div className="text-zinc-500">Payment: <span className="text-zinc-900 font-bold uppercase">{orderSuccess.paymentMethod}</span></div>
                  <div className="text-emerald-600 text-[11px] pt-1">Estimated Delivery: 2-3 Business Days</div>
                </div>
                <button onClick={() => { setOrderSuccess(null); setIsCheckoutOpen(false); }} className="w-full py-2.5 bg-zinc-900 text-white font-bold text-xs rounded-xl hover:bg-zinc-800 transition">
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Cash on Delivery Checkout</h3>
                <p className="text-xs text-zinc-500 mt-0.5 mb-5">Pay cash upon delivery. Zero advance payment required.</p>
                <form onSubmit={handleCheckoutSubmit} className="space-y-3.5">
                  {[
                    { label: "Full Name", type: "text", placeholder: "Jane Doe", value: customerName, onChange: setCustomerName, required: true },
                    { label: "Phone Number", type: "tel", placeholder: "+1 (555) 234-5678", value: customerPhone, onChange: setCustomerPhone, required: true },
                    { label: "Email (Optional)", type: "email", placeholder: "jane@example.com", value: customerEmail, onChange: setCustomerEmail, required: false }
                  ].map(({ label, type, placeholder, value, onChange, required }) => (
                    <div key={label}>
                      <label className="block text-[11px] font-semibold text-zinc-700 uppercase tracking-wider mb-1">{label}</label>
                      <input type={type} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)}
                        className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs outline-none focus:border-zinc-900 transition" required={required} />
                    </div>
                  ))}
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 uppercase tracking-wider mb-1">Delivery Address</label>
                    <textarea placeholder="Apartment, Street address, City" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs outline-none focus:border-zinc-900 transition h-16 resize-none" required />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 uppercase tracking-wider mb-1">Payment Preference</label>
                    <label className="flex items-center justify-between p-2.5 border rounded-xl cursor-pointer text-xs border-zinc-900 bg-zinc-50">
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
                  <div className="p-2.5 bg-zinc-50 border border-zinc-200/80 rounded-xl text-[11px] text-zinc-500 space-y-1">
                    <div className="flex items-center justify-between"><span>Dispatch:</span><span className="font-semibold text-zinc-800">Within 24-48 Hours</span></div>
                    <div className="flex items-center justify-between"><span>Inspection:</span><span className="font-semibold text-emerald-700">Open parcel before paying</span></div>
                  </div>
                  <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold block">Total</span>
                      <span className="text-xl font-black text-zinc-900">${finalTotal.toFixed(2)}</span>
                    </div>
                    <button type="submit" disabled={isSubmittingOrder}
                      className="py-2.5 px-6 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center space-x-1.5 btn-press disabled:opacity-60">
                      <span>{isSubmittingOrder ? "Confirming..." : "Place COD Order"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Footer ──────────────────────────────────────────────────────── */}
      <StoreFooter storeName={storeDisplayName} storeSlug={tenantSlug} categoryName={categoryConfig.name} />
    </div>
  );
}
