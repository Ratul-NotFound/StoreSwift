"use client";

import { useState, use } from "react";
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
  SlidersHorizontal
} from "lucide-react";
import { getCategoryConfig } from "@/config/categories";
import { generateStoreSeedData } from "@/lib/seed-store";
import { calculateCartTotals, CartItem } from "@/lib/cart";
import { verifyAndDeductStock } from "@/lib/stock";

export default function TenantStorefrontPage({
  params
}: {
  params: Promise<{ tenant: string }>;
}) {
  const resolvedParams = use(params);
  const tenantSlug = resolvedParams.tenant || "apex-fashion";

  // Category & Seed Data
  const seed = generateStoreSeedData(tenantSlug, "fashion");
  const categoryConfig = getCategoryConfig("fashion");

  // Products state with images and badges
  const [products] = useState(
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

  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  // Checkout modal state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "stripe" | "manual">("cod");
  const [manualTrxId, setManualTrxId] = useState("");
  const [orderSuccess, setOrderSuccess] = useState<any>(null);

  const cartSummary = calculateCartTotals(cartItems, 50);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
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
          variantId: variant ? variant.sku : undefined,
          title: prod.title,
          variantTitle: variant ? variant.title : undefined,
          price: variant ? parseFloat(variant.price) : prod.price,
          imageUrl: prod.imageUrl,
          quantity: 1
        }
      ]);
    }

    setSelectedProduct(null);
    showToast(`Added "${prod.title}" to cart`);
  };

  const handleUpdateQty = (id: string, delta: number) => {
    setCartItems(
      cartItems
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !shippingAddress) return;

    const deduction = verifyAndDeductStock("variant-sample", 10, 1);
    if (!deduction.success) {
      alert("Item went out of stock during checkout.");
      return;
    }

    const newOrder = {
      orderNumber: `#${Math.floor(1000 + Math.random() * 9000)}`,
      customerName,
      customerPhone,
      shippingAddress,
      totalAmount: cartSummary.subtotal,
      paymentMethod:
        paymentMethod === "cod"
          ? "Cash on Delivery (COD)"
          : paymentMethod === "stripe"
          ? "Credit Card (Stripe)"
          : "Manual Mobile Transfer",
      status: paymentMethod === "cod" ? "Pending (COD)" : "Paid"
    };

    setOrderSuccess(newOrder);
    setCartItems([]);
    setIsCheckoutOpen(false);
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (activeFilter === "bestsellers") return p.badge?.includes("Best");
    if (activeFilter === "trending") return p.badge?.includes("Trending") || p.rating >= 4.9;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans selection:bg-zinc-900 selection:text-white">
      {/* Top Banner Notice */}
      <div className="bg-zinc-950 text-zinc-300 text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center space-x-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>⚡ Free Express Delivery on orders over $50 • Cash on Delivery accepted nationwide</span>
      </div>

      {/* Main Sticky Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-zinc-200/80 sticky top-0 z-30 shadow-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Store Brand */}
          <Link href={`/store/${tenantSlug}`} className="flex items-center space-x-2.5 group flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 flex items-center justify-center text-white font-bold text-xs tracking-wider uppercase group-hover:scale-105 transition-transform shadow-sm">
              {tenantSlug.slice(0, 2)}
            </div>
            <div>
              <span className="font-bold text-zinc-900 text-base capitalize tracking-tight block leading-tight">
                {tenantSlug.replace("-", " ")}
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Verified Online Store</span>
              </span>
            </div>
          </Link>

          {/* Search Box */}
          <div className="hidden sm:flex items-center relative max-w-sm w-full">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search products, materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-100/90 border border-zinc-200/80 rounded-full pl-9 pr-4 py-2 text-xs text-zinc-800 outline-none focus:border-zinc-900 focus:bg-white transition placeholder:text-zinc-400 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right Header Navigation & Cart */}
          <div className="flex items-center space-x-3">
            <Link
              href={`/admin?store=${tenantSlug}`}
              className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition hidden md:flex items-center space-x-1 px-3 py-1.5 rounded-lg hover:bg-zinc-100"
            >
              <span>Merchant Admin</span>
              <ArrowUpRight className="w-3 h-3 text-zinc-400" />
            </Link>

            {/* Shopping Cart Pill Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="inline-flex items-center space-x-2 bg-zinc-900 hover:bg-zinc-800 text-white px-3.5 py-2 rounded-full text-xs font-bold transition shadow-sm btn-press"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartSummary.itemCount > 0 && (
                <span className="bg-white text-zinc-900 text-[11px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {cartSummary.itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Showcase Section */}
      <section className="relative bg-zinc-950 text-white py-16 px-4 sm:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 text-[11px] font-semibold uppercase tracking-widest text-zinc-400 bg-zinc-900/80 px-3.5 py-1.5 rounded-full border border-zinc-800 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{categoryConfig.name} • 2026 Collection</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight max-w-2xl mx-auto">
            Thoughtfully Designed, <br className="hidden sm:inline" />
            Crafted for Quality.
          </h1>

          <p className="mt-3 text-zinc-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            {categoryConfig.tagline} Free shipping over $50 with instant Cash on Delivery option.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-[11px] text-zinc-400">
            <div className="flex items-center space-x-1.5">
              <Truck className="w-3.5 h-3.5 text-blue-400" />
              <span>Doorstep Courier</span>
            </div>
            <span className="text-zinc-600">•</span>
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Original Products</span>
            </div>
            <span className="text-zinc-600">•</span>
            <div className="flex items-center space-x-1.5">
              <RotateCcw className="w-3.5 h-3.5 text-purple-400" />
              <span>7-Day Return Guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Product Catalog Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Category Filter Pills & Search Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-zinc-200/80">
          <div className="flex items-center space-x-2 overflow-x-auto text-xs font-semibold">
            {[
              { id: "all", label: "All Items" },
              { id: "bestsellers", label: "Best Sellers" },
              { id: "trending", label: "Trending Now" }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-3.5 py-1.5 rounded-full transition-all btn-press ${
                  activeFilter === f.id
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-300"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="text-xs text-zinc-500 font-medium">
            Showing <strong className="text-zinc-900">{filteredProducts.length}</strong> items in stock
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-2xl border border-zinc-200/80 overflow-hidden shadow-subtle hover:shadow-card transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Product Image Frame */}
                <div className="relative w-full h-64 bg-zinc-100 overflow-hidden cursor-pointer" onClick={() => handleOpenProduct(prod)}>
                  <img
                    src={prod.imageUrl}
                    alt={prod.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80";
                    }}
                  />
                  {/* Badge */}
                  {prod.badge && (
                    <span className="absolute top-3 left-3 bg-zinc-900/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                      {prod.badge}
                    </span>
                  )}
                  {/* Rating Badge */}
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full text-[11px] font-bold text-zinc-900 flex items-center space-x-1 shadow-sm">
                    <Star className="w-3 h-3 text-amber-500 fill-current" />
                    <span>{prod.rating}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3
                    onClick={() => handleOpenProduct(prod)}
                    className="font-bold text-zinc-900 text-sm tracking-tight hover:text-blue-600 transition cursor-pointer"
                  >
                    {prod.title}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                    {prod.description}
                  </p>

                  {/* Price Section */}
                  <div className="mt-3.5 flex items-baseline space-x-2">
                    <span className="text-xl font-bold tracking-tight text-zinc-900">
                      ${prod.price.toFixed(2)}
                    </span>
                    <span className="text-xs text-zinc-400 line-through">
                      ${prod.comparePrice.toFixed(2)}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      Save 35%
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => handleOpenProduct(prod)}
                  className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs rounded-xl shadow-sm transition flex items-center justify-center space-x-1.5 btn-press"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Choose Options & Buy</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* MODAL 1: PRODUCT VARIANT SELECTOR */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-zinc-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-float border border-zinc-200 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Image Header */}
            <div className="relative w-full h-48 bg-zinc-100">
              <img
                src={selectedProduct.imageUrl}
                alt={selectedProduct.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80";
                }}
              />
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-zinc-600 hover:text-zinc-900 flex items-center justify-center shadow-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-zinc-900 text-base">{selectedProduct.title}</h3>
                <span className="text-base font-bold text-zinc-900">
                  ${selectedVariant ? selectedVariant.price : selectedProduct.price.toFixed(2)}
                </span>
              </div>

              <p className="text-xs text-zinc-500 mb-5 leading-relaxed">{selectedProduct.description}</p>

              {/* Variant Pills */}
              <div className="space-y-2.5 mb-6">
                <label className="block text-[11px] font-semibold text-zinc-700 uppercase tracking-wider">
                  Available Sizes / Options:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {selectedProduct.variants.map((v, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedVariant(v)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition ${
                        selectedVariant?.sku === v.sku
                          ? "border-zinc-900 bg-zinc-900 text-white shadow-sm ring-1 ring-zinc-900"
                          : "border-zinc-200 hover:border-zinc-300 text-zinc-700 bg-white"
                      }`}
                    >
                      <div>{v.title}</div>
                      <div className={`font-mono text-[10px] mt-0.5 ${selectedVariant?.sku === v.sku ? "text-zinc-300" : "text-zinc-400"}`}>
                        ${v.price} • In Stock
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleAddToCart(selectedProduct, selectedVariant)}
                className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center space-x-2 btn-press"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart (${selectedVariant ? selectedVariant.price : selectedProduct.price.toFixed(2)})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DRAWER: SLIDE-OVER CART */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-float flex flex-col justify-between">
              {/* Cart Header */}
              <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-4 h-4 text-zinc-900" />
                  <h3 className="font-bold text-zinc-900 text-sm">Shopping Cart</h3>
                  <span className="text-xs text-zinc-400">({cartSummary.itemCount} items)</span>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-zinc-400 hover:text-zinc-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Free Shipping Progress Meter */}
              <div className="p-4 bg-zinc-50 border-b border-zinc-100 text-xs">
                {cartSummary.isFreeShippingEligible ? (
                  <div className="flex items-center space-x-2 text-emerald-800 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>You unlocked FREE Express Delivery!</span>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="text-zinc-600 font-medium text-[11px] flex justify-between">
                      <span>Add <strong>${cartSummary.amountRemainingForFreeShipping}</strong> more for Free Shipping</span>
                      <span>${cartSummary.subtotal} / $50</span>
                    </div>
                    <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full transition-all duration-300 rounded-full"
                        style={{ width: `${Math.min(100, (cartSummary.subtotal / 50) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-5 divide-y divide-zinc-100">
                {cartItems.length === 0 ? (
                  <div className="text-center py-20 text-zinc-400 text-xs">
                    <ShoppingBag className="w-10 h-10 mx-auto text-zinc-300 mb-2" />
                    <p>Your shopping cart is empty.</p>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="py-4 flex items-center space-x-3">
                      {/* Thumbnail */}
                      <div className="w-16 h-16 rounded-xl bg-zinc-100 overflow-hidden flex-shrink-0 border border-zinc-200/80">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-300">
                            <ShoppingBag className="w-6 h-6" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-zinc-900 text-xs truncate">{item.title}</h4>
                        {item.variantTitle && (
                          <div className="text-[11px] text-zinc-500 font-medium">{item.variantTitle}</div>
                        )}
                        <div className="text-xs font-bold text-zinc-900 mt-1">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center space-x-1.5 bg-zinc-100 rounded-lg p-1 border border-zinc-200/60">
                        <button
                          onClick={() => handleUpdateQty(item.id, -1)}
                          className="w-5 h-5 flex items-center justify-center font-bold text-zinc-600 hover:bg-white rounded transition"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold text-zinc-900 w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQty(item.id, 1)}
                          className="w-5 h-5 flex items-center justify-center font-bold text-zinc-600 hover:bg-white rounded transition"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Cart Footer */}
              {cartItems.length > 0 && (
                <div className="p-5 border-t border-zinc-100 bg-zinc-50 space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-600">
                    <span>Subtotal</span>
                    <span className="text-lg font-bold text-zinc-900">
                      ${cartSummary.subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-500">
                    <span>Shipping</span>
                    <span className="font-semibold text-emerald-600">
                      {cartSummary.isFreeShippingEligible ? "FREE" : "$4.99"}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsCheckoutOpen(true);
                    }}
                    className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center space-x-2 btn-press"
                  >
                    <span>Proceed to 1-Page Checkout</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center justify-center space-x-2 text-[10px] text-zinc-400 pt-1">
                    <Lock className="w-3 h-3 text-emerald-600" />
                    <span>256-Bit SSL Encrypted Checkout</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: 1-PAGE HYBRID CHECKOUT */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-zinc-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-float border border-zinc-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 mb-5">
              <div>
                <h3 className="font-bold text-base text-zinc-900">Fast 1-Page Checkout</h3>
                <p className="text-xs text-zinc-400">Zero registration required • Fast doorstep delivery</p>
              </div>
              <button onClick={() => setIsCheckoutOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-zinc-700 uppercase mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-zinc-200 rounded-xl outline-none focus:border-zinc-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 uppercase mb-1">
                  Mobile Phone (For delivery confirmation)
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-zinc-200 rounded-xl outline-none focus:border-zinc-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 uppercase mb-1">
                  Delivery Address
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Street address, apartment, city, zip code"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-zinc-200 rounded-xl outline-none focus:border-zinc-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 uppercase mb-2">
                  Select Payment Method
                </label>
                <div className="space-y-2">
                  <label
                    className={`flex items-center justify-between p-3.5 border rounded-xl cursor-pointer transition ${
                      paymentMethod === "cod"
                        ? "border-zinc-900 bg-zinc-50/80 ring-1 ring-zinc-900"
                        : "border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <input
                        type="radio"
                        name="pay"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                        className="text-zinc-900"
                      />
                      <div>
                        <div className="font-semibold text-zinc-900 text-xs">Cash on Delivery (COD)</div>
                        <div className="text-[10px] text-zinc-500">Pay cash upon delivery. 1-click order.</div>
                      </div>
                    </div>
                    <Banknote className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  </label>

                  <label
                    className={`flex items-center justify-between p-3.5 border rounded-xl cursor-pointer transition ${
                      paymentMethod === "stripe"
                        ? "border-zinc-900 bg-zinc-50/80 ring-1 ring-zinc-900"
                        : "border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <input
                        type="radio"
                        name="pay"
                        checked={paymentMethod === "stripe"}
                        onChange={() => setPaymentMethod("stripe")}
                        className="text-zinc-900"
                      />
                      <div>
                        <div className="font-semibold text-zinc-900 text-xs">Credit / Debit Card (Stripe)</div>
                        <div className="text-[10px] text-zinc-500">Visa, Mastercard, Apple Pay</div>
                      </div>
                    </div>
                    <CreditCard className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  </label>

                  <label
                    className={`flex items-center justify-between p-3.5 border rounded-xl cursor-pointer transition ${
                      paymentMethod === "manual"
                        ? "border-zinc-900 bg-zinc-50/80 ring-1 ring-zinc-900"
                        : "border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <input
                        type="radio"
                        name="pay"
                        checked={paymentMethod === "manual"}
                        onChange={() => setPaymentMethod("manual")}
                        className="text-zinc-900"
                      />
                      <div>
                        <div className="font-semibold text-zinc-900 text-xs">Mobile Money / Bank Transfer</div>
                        <div className="text-[10px] text-zinc-500">bKash, Nagad, UPI, Wire</div>
                      </div>
                    </div>
                    <Smartphone className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  </label>
                </div>
              </div>

              {paymentMethod === "manual" && (
                <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl space-y-1">
                  <div className="text-[11px] text-purple-900 font-semibold">
                    Send ${cartSummary.subtotal.toFixed(2)} to Merchant and enter Transaction ID:
                  </div>
                  <input
                    type="text"
                    placeholder="Transaction ID / Ref"
                    value={manualTrxId}
                    onChange={(e) => setManualTrxId(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-purple-300 rounded text-xs outline-none"
                  />
                </div>
              )}

              <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-semibold">Order Total:</span>
                  <div className="text-2xl font-black text-zinc-900">
                    ${cartSummary.subtotal.toFixed(2)}
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-sm transition btn-press"
                >
                  Place Order Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ORDER SUCCESS */}
      {orderSuccess && (
        <div className="fixed inset-0 bg-zinc-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-float border border-zinc-200">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 border border-emerald-200">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-xl text-zinc-900">Order Confirmed!</h3>
            <p className="text-xs text-zinc-500 mt-1">We'll dispatch your items shortly.</p>

            <div className="my-5 p-4 bg-zinc-50 rounded-xl border border-zinc-100 text-left text-xs space-y-1.5 font-medium">
              <div><strong>Order Number:</strong> <span className="font-mono text-zinc-900 font-bold">{orderSuccess.orderNumber}</span></div>
              <div><strong>Recipient:</strong> {orderSuccess.customerName}</div>
              <div><strong>Phone:</strong> {orderSuccess.customerPhone}</div>
              <div><strong>Payment:</strong> {orderSuccess.paymentMethod}</div>
              <div><strong>Total Due:</strong> ${orderSuccess.totalAmount.toFixed(2)}</div>
            </div>

            <button
              onClick={() => setOrderSuccess(null)}
              className="w-full py-2.5 bg-zinc-900 text-white font-bold text-xs rounded-xl hover:bg-zinc-800 transition btn-press"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-900 text-white px-4 py-3 rounded-xl shadow-card text-xs font-semibold flex items-center space-x-2 animate-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setIsCartOpen(true)}
            className="ml-2 underline text-blue-400 hover:text-blue-300"
          >
            View Cart
          </button>
        </div>
      )}

      {/* Modern Minimalist Footer */}
      <footer className="bg-white border-t border-zinc-200/80 py-10 text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 font-bold text-zinc-800 text-xs">
            <Store className="w-4 h-4 text-zinc-900" />
            <span className="capitalize">{tenantSlug.replace("-", " ")}</span>
          </div>
          <div className="text-zinc-500 flex items-center space-x-4">
            <span>© 2026 {tenantSlug.replace("-", " ")}. All rights reserved.</span>
            <span>•</span>
            <span>Powered by <strong className="text-zinc-700">StoreSwift</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
