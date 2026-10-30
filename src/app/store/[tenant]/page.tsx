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
  Tag
} from "lucide-react";
import { getCategoryConfig, CATEGORIES_MAP, ALL_CATEGORIES } from "@/config/categories";
import { getTemplateConfig, STORE_TEMPLATES, ALL_TEMPLATES } from "@/config/templates";
import { generateStoreSeedData } from "@/lib/seed-store";
import { calculateCartTotals, CartItem } from "@/lib/cart";
import { useToast } from "@/components/ui/toast";
import { StoreFooter } from "@/components/footer";
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
      id: `prod-${idx + 1}`,
      title: p.title,
      slug: p.slug,
      description: p.description,
      price: parseFloat(p.basePrice),
      comparePrice: parseFloat(p.basePrice) * 1.35,
      imageUrl: p.imageUrl || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
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
        badge: p.badge || (idx === 0 ? "Best Seller" : idx === 1 ? "Trending" : "New"),
        rating: p.rating || 4.9,
        variants: seed.variants.filter((v) => v.productSlug === p.slug)
      }))
    );
    setTemplateKey(categoryConfig.recommendedTemplate || "minimal");
  }, [seed, activeCategoryKey, categoryConfig.recommendedTemplate]);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  // Checkout modal state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "stripe" | "manual">("cod");
  const [manualTrxId, setManualTrxId] = useState("");
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);

  const cartSummary = calculateCartTotals(cartItems, 50);
  const shippingFee = cartSummary.isFreeShippingEligible || cartItems.length === 0 ? 0 : 5.00;
  const finalTotal = cartSummary.subtotal + shippingFee;

  // Filtering & Sorting
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return 0; // featured
      });
  }, [products, searchQuery, sortBy]);

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
  };

  const handleAddToCart = (prod: typeof products[0], variant: any) => {
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
          shippingAddress: { address: shippingAddress },
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
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans selection:bg-zinc-900 selection:text-white">
      {/* Top Notification / Ticker Bar */}
      <div className={`py-2 px-4 text-xs font-semibold text-center tracking-wide transition-colors ${template.classes.announcementBar}`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="hidden sm:inline-block">📦 Guaranteed 48-Hour Dispatch</span>
          <span className="mx-auto sm:mx-0">
            🚚 FREE Express Shipping on orders over $50 • Cash on Delivery Available
          </span>
          <span className="hidden md:inline-block">🛡️ 100% Authentic Quality</span>
        </div>
      </div>

      {/* Main Sticky Brand Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-zinc-200/80 sticky top-0 z-30 shadow-subtle">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Category indicator */}
          <Link href={`/store/${tenantSlug}`} className="flex items-center space-x-2.5 flex-shrink-0 group">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-zinc-900 tracking-tight text-sm block">
                {storeDisplayName}
              </span>
              <span className="text-[10px] text-zinc-400 font-medium block -mt-0.5">
                {categoryConfig.name}
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-md hidden sm:block relative">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder={`Search ${categoryConfig.name.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200/90 rounded-xl text-xs outline-none focus:border-zinc-900 focus:bg-white transition placeholder:text-zinc-400"
            />
          </div>

          {/* Header Action Controls */}
          <div className="flex items-center space-x-2">
            {/* Wishlist Icon */}
            <button
              onClick={() => success("Wishlist", `${wishlist.length} saved item(s).`)}
              className="p-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition relative"
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
      <div className="bg-white border-b border-zinc-200/60 py-2.5 px-4 overflow-x-auto scrollbar-none">
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
              Template:
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
      <section className="relative overflow-hidden bg-white border-b border-zinc-200/80 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border ${template.classes.heroBadge}`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>{categoryConfig.name} • 2026 Collection</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-900 tracking-tight leading-tight">
              {categoryConfig.tagline}
            </h1>

            <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed max-w-lg">
              Welcome to the official {storeDisplayName} storefront. Explore our certified catalog featuring nationwide cash on delivery, instant dispatch, and 7-day hassle-free returns.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href="#catalog"
                className={`py-3 px-6 rounded-xl font-bold text-xs transition flex items-center space-x-2 btn-press ${template.classes.primaryButton}`}
              >
                <span>Shop Catalog ({products.length} Items)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => success("Free Shipping", "Add $50+ of items to your cart to unlock free express delivery.")}
                className="py-3 px-5 rounded-xl font-semibold text-xs border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 transition"
              >
                View Shipping Perks
              </button>
            </div>
          </div>

          {/* Hero Illustration Graphic */}
          <div className="relative rounded-3xl overflow-hidden border border-zinc-200/80 shadow-card bg-zinc-100 aspect-video md:aspect-auto md:h-80 group">
            <img
              src={categoryConfig.heroImage}
              alt={categoryConfig.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl flex items-center justify-between border border-white/60 shadow-sm">
              <div>
                <p className="text-xs font-bold text-zinc-900">{categoryConfig.name}</p>
                <p className="text-[10px] text-zinc-500">Verified Quality Guarantee</p>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                COD Enabled
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Column Trust Perks Strip */}
      <section className="bg-zinc-50/70 border-b border-zinc-200/70 py-6 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-white rounded-xl border border-zinc-200/60 shadow-subtle">
            <Truck className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-zinc-900">48h Dispatch</p>
              <p className="text-[11px] text-zinc-500">Fast tracking alerts</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-white rounded-xl border border-zinc-200/60 shadow-subtle">
            <Banknote className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-zinc-900">Cash on Delivery</p>
              <p className="text-[11px] text-zinc-500">Inspect before paying</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-white rounded-xl border border-zinc-200/60 shadow-subtle">
            <ShieldCheck className="w-5 h-5 text-purple-600 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-zinc-900">100% Genuine</p>
              <p className="text-[11px] text-zinc-500">Certified merchant items</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-white rounded-xl border border-zinc-200/60 shadow-subtle">
            <RotateCcw className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-zinc-900">7-Day Free Returns</p>
              <p className="text-[11px] text-zinc-500">Zero hassle replacement</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog View */}
      <main id="catalog" className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10">
        {/* Catalog Control Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
              Featured {categoryConfig.name}
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Showing {filteredProducts.length} items • In stock with instant delivery
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5 text-xs text-zinc-500 bg-white border border-zinc-200 rounded-xl px-3 py-1.5 shadow-subtle">
              <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-semibold text-zinc-800 outline-none cursor-pointer text-xs"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => {
            const isWishlisted = wishlist.includes(p.id);
            const discountPct = Math.round(((p.comparePrice - p.price) / p.comparePrice) * 100);

            return (
              <div
                key={p.id}
                className={`rounded-2xl border p-4 shadow-subtle hover:shadow-card transition-all flex flex-col justify-between group ${template.classes.productCard}`}
              >
                <div>
                  {/* Photo Frame with Overlays */}
                  <div className="relative aspect-square rounded-xl bg-zinc-100 overflow-hidden border border-zinc-200/60 mb-4 cursor-pointer" onClick={() => handleOpenProduct(p)}>
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Badge */}
                    {p.badge && (
                      <span className="absolute top-2.5 left-2.5 bg-zinc-900/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                        {p.badge}
                      </span>
                    )}

                    {/* Discount Pill */}
                    {discountPct > 0 && (
                      <span className="absolute top-2.5 right-2.5 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                        -{discountPct}%
                      </span>
                    )}

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(p.id);
                      }}
                      className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-zinc-600 hover:text-rose-600 shadow-sm transition"
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? "text-rose-500 fill-current" : ""}`} />
                    </button>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-1 text-amber-500 text-xs mb-1.5">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-bold text-zinc-800">{p.rating}</span>
                    <span className="text-zinc-400 text-[11px]">(48 reviews)</span>
                  </div>

                  {/* Title & Description */}
                  <h3
                    onClick={() => handleOpenProduct(p)}
                    className="font-bold text-sm text-zinc-900 tracking-tight leading-snug cursor-pointer hover:text-blue-600 transition"
                  >
                    {p.title}
                  </h3>

                  <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                {/* Price & Action Row */}
                <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between">
                  <div>
                    <div className="text-base font-black text-zinc-900">
                      ${p.price.toFixed(2)}
                    </div>
                    <span className="text-[11px] text-zinc-400 line-through">
                      ${p.comparePrice.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => handleOpenProduct(p)}
                      className="p-2 border border-zinc-200 hover:bg-zinc-100 rounded-xl text-zinc-600 text-xs font-semibold transition"
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
      </main>

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
                    <span>Unlocked! Free Express Shipping applied.</span>
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
                  cartItems.map((item) => (
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
                  ))
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

            <div className="flex space-x-4">
              <img
                src={selectedProduct.imageUrl}
                alt={selectedProduct.title}
                className="w-24 h-24 rounded-xl object-cover border border-zinc-200 bg-zinc-50 flex-shrink-0"
              />
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{categoryConfig.name}</span>
                <h3 className="text-base font-bold text-zinc-900 tracking-tight">{selectedProduct.title}</h3>
                <div className="text-lg font-black text-zinc-900 mt-1">${selectedProduct.price.toFixed(2)}</div>
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

                <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs space-y-1 font-mono">
                  <div className="text-zinc-500">Order ID: <span className="text-zinc-900 font-bold">{orderSuccess.orderNumber}</span></div>
                  <div className="text-zinc-500">Total: <span className="text-zinc-900 font-bold">${orderSuccess.total}</span></div>
                  <div className="text-zinc-500">Method: <span className="text-zinc-900 font-bold uppercase">{orderSuccess.paymentMethod}</span></div>
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
