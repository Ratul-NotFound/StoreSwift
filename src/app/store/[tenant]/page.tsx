"use client";

import { useState, use } from "react";
import Link from "next/link";
import {
  ShoppingBag,
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
  ArrowUpRight
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

  // Products state
  const [products] = useState(
    seed.products.map((p, idx) => ({
      id: `prod-${idx + 1}`,
      title: p.title,
      slug: p.slug,
      description: p.description,
      price: parseFloat(p.basePrice),
      variants: seed.variants.filter((v) => v.productSlug === p.slug)
    }))
  );

  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

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
          quantity: 1
        }
      ]);
    }

    setSelectedProduct(null);
    setIsCartOpen(true);
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

    // Simulate atomic stock deduction
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

  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans selection:bg-zinc-900 selection:text-white">
      {/* Top Announcement Bar */}
      <div className="bg-zinc-900 text-zinc-300 text-[11px] py-2 px-4 text-center font-medium tracking-wide">
        ⚡ Free express delivery on orders over $50 • Cash on Delivery accepted
      </div>

      {/* Modern Minimalist Store Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-zinc-200/80 sticky top-0 z-30 shadow-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href={`/store/${tenantSlug}`} className="flex items-center space-x-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white font-bold text-xs tracking-wider uppercase group-hover:scale-105 transition-transform">
              {tenantSlug.slice(0, 2)}
            </div>
            <span className="font-bold text-zinc-900 text-base capitalize tracking-tight">
              {tenantSlug.replace("-", " ")}
            </span>
          </Link>

          {/* Search Bar on Desktop */}
          <div className="hidden md:flex items-center relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-100/80 border border-zinc-200/80 rounded-xl pl-8 pr-3 py-1.5 text-xs text-zinc-800 outline-none focus:border-zinc-900 transition placeholder:text-zinc-400 font-medium"
            />
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href={`/admin?store=${tenantSlug}`}
              className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition hidden sm:inline"
            >
              Merchant Admin
            </Link>

            {/* Shopping Cart Pill */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-zinc-800 hover:text-zinc-950 transition btn-press"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartSummary.itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-zinc-900 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartSummary.itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-zinc-900 text-white py-16 px-4 sm:px-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 bg-zinc-800/80 px-3 py-1 rounded-full border border-zinc-700/80">
            {categoryConfig.name}
          </span>
          <h1 className="text-3xl sm:text-5xl font-black mt-4 tracking-tight leading-tight">
            Curated Essentials, Designed for Living
          </h1>
          <p className="mt-3 text-zinc-400 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
            {categoryConfig.tagline} Order online with secure cards or convenient Cash on Delivery.
          </p>
        </div>
      </section>

      {/* Product Catalog Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Category Filter Pills */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-200/80">
          <div className="flex items-center space-x-1.5 overflow-x-auto text-xs">
            {["all", "new", "popular"].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition ${
                  activeFilter === f
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "text-zinc-600 hover:bg-zinc-200/60"
                }`}
              >
                {f === "all" ? "All Products" : f === "new" ? "New Arrivals" : "Best Sellers"}
              </button>
            ))}
          </div>

          <span className="text-xs text-zinc-400 font-medium">
            {filteredProducts.length} items
          </span>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-2xl border border-zinc-200/80 overflow-hidden shadow-subtle hover:shadow-card transition flex flex-col justify-between group"
            >
              <div className="p-5">
                {/* Visual Thumbnail */}
                <div className="w-full h-48 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-400 mb-4 border border-zinc-200/50 group-hover:bg-zinc-200/60 transition-colors">
                  <ShoppingBag className="w-10 h-10 text-zinc-300 group-hover:scale-110 transition-transform duration-300" />
                </div>

                <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                  <span>In Stock</span>
                  <div className="flex items-center text-amber-400">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-zinc-500 font-semibold ml-1">4.9</span>
                  </div>
                </div>

                <h3 className="font-bold text-zinc-900 text-sm tracking-tight">{prod.title}</h3>
                <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">{prod.description}</p>

                <div className="mt-3 flex items-baseline space-x-1.5">
                  <span className="text-xl font-bold tracking-tight text-zinc-900">
                    ${prod.price.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => handleOpenProduct(prod)}
                  className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs rounded-xl shadow-sm transition flex items-center justify-center space-x-1.5 btn-press"
                >
                  <span>Select Options & Buy</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* MODAL 1: VARIANT SELECTOR */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-float border border-zinc-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-zinc-900 text-base">{selectedProduct.title}</h3>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-500 mb-5">{selectedProduct.description}</p>

            <div className="space-y-3 mb-6">
              <label className="block text-[11px] font-semibold text-zinc-700 uppercase tracking-wider">
                Select Option:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {selectedProduct.variants.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedVariant(v)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition ${
                      selectedVariant?.sku === v.sku
                        ? "border-zinc-900 bg-zinc-900 text-white shadow-sm"
                        : "border-zinc-200 hover:border-zinc-300 text-zinc-700"
                    }`}
                  >
                    <div>{v.title}</div>
                    <div className={`font-mono text-[10px] mt-0.5 ${selectedVariant?.sku === v.sku ? "text-zinc-300" : "text-zinc-400"}`}>
                      ${v.price}
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
              <span>Add to Cart (${selectedVariant ? selectedVariant.price : selectedProduct.price})</span>
            </button>
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
            <div className="w-screen max-w-sm bg-white shadow-float flex flex-col justify-between">
              {/* Cart Header */}
              <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-4 h-4 text-zinc-900" />
                  <h3 className="font-bold text-zinc-900 text-sm">Shopping Cart</h3>
                  <span className="text-xs text-zinc-400">({cartSummary.itemCount})</span>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-zinc-400 hover:text-zinc-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Free Shipping Progress Meter */}
              <div className="p-3.5 bg-zinc-50 border-b border-zinc-100 text-xs">
                {cartSummary.isFreeShippingEligible ? (
                  <div className="flex items-center space-x-1.5 text-emerald-800 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Unlocked FREE express shipping!</span>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="text-zinc-600 font-medium text-[11px] flex justify-between">
                      <span>Add <strong>${cartSummary.amountRemainingForFreeShipping}</strong> for Free Shipping</span>
                      <span>${cartSummary.subtotal} / $50</span>
                    </div>
                    <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-zinc-900 h-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (cartSummary.subtotal / 50) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-5 divide-y divide-zinc-100">
                {cartItems.length === 0 ? (
                  <div className="text-center py-16 text-zinc-400 text-xs">
                    Your cart is currently empty.
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="py-3.5 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-zinc-900 text-xs">{item.title}</h4>
                        {item.variantTitle && (
                          <div className="text-[11px] text-zinc-400">{item.variantTitle}</div>
                        )}
                        <div className="text-xs font-bold text-zinc-900 mt-1">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 bg-zinc-100 rounded-lg p-1">
                        <button
                          onClick={() => handleUpdateQty(item.id, -1)}
                          className="w-5 h-5 flex items-center justify-center font-bold text-zinc-600 hover:bg-white rounded transition"
                        >
                          -
                        </button>
                        <span className="text-xs font-semibold text-zinc-900 w-4 text-center">
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
                <div className="p-5 border-t border-zinc-100 bg-zinc-50">
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 mb-3">
                    <span>Subtotal</span>
                    <span className="text-lg font-bold text-zinc-900">
                      ${cartSummary.subtotal.toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsCheckoutOpen(true);
                    }}
                    className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center space-x-2 btn-press"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: 1-PAGE HYBRID CHECKOUT */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-float border border-zinc-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 mb-5">
              <h3 className="font-bold text-base text-zinc-900">1-Page Checkout</h3>
              <button onClick={() => setIsCheckoutOpen(false)} className="text-zinc-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-3.5 text-xs">
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
                  className="w-full px-3 py-2 border border-zinc-200 rounded-xl outline-none focus:border-zinc-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 uppercase mb-1">
                  Mobile Phone (For courier delivery)
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-xl outline-none focus:border-zinc-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 uppercase mb-1">
                  Delivery Address
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Street address, city, postal code"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-xl outline-none focus:border-zinc-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 uppercase mb-2">
                  Payment Method
                </label>
                <div className="space-y-1.5">
                  <label
                    className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition ${
                      paymentMethod === "cod" ? "border-zinc-900 bg-zinc-50" : "border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="pay"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                        className="text-zinc-900"
                      />
                      <span className="font-semibold text-zinc-900 text-xs">Cash on Delivery (COD)</span>
                    </div>
                    <Banknote className="w-4 h-4 text-emerald-600" />
                  </label>

                  <label
                    className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition ${
                      paymentMethod === "stripe" ? "border-zinc-900 bg-zinc-50" : "border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="pay"
                        checked={paymentMethod === "stripe"}
                        onChange={() => setPaymentMethod("stripe")}
                        className="text-zinc-900"
                      />
                      <span className="font-semibold text-zinc-900 text-xs">Credit / Debit Card (Stripe)</span>
                    </div>
                    <CreditCard className="w-4 h-4 text-blue-600" />
                  </label>

                  <label
                    className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition ${
                      paymentMethod === "manual" ? "border-zinc-900 bg-zinc-50" : "border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="pay"
                        checked={paymentMethod === "manual"}
                        onChange={() => setPaymentMethod("manual")}
                        className="text-zinc-900"
                      />
                      <span className="font-semibold text-zinc-900 text-xs">Mobile Money / Bank Transfer</span>
                    </div>
                    <Smartphone className="w-4 h-4 text-purple-600" />
                  </label>
                </div>
              </div>

              {paymentMethod === "manual" && (
                <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl">
                  <div className="text-[11px] text-purple-900 font-semibold mb-1">
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

              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-zinc-400">Total:</span>
                  <div className="text-xl font-bold text-zinc-900">
                    ${cartSummary.subtotal.toFixed(2)}
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-sm transition btn-press"
                >
                  Place Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ORDER SUCCESS CELEBRATION */}
      {orderSuccess && (
        <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-float border border-zinc-200">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 border border-emerald-200">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-xl text-zinc-900">Order Confirmed!</h3>
            <p className="text-xs text-zinc-500 mt-1">Thank you for supporting our business.</p>

            <div className="my-5 p-3.5 bg-zinc-50 rounded-xl border border-zinc-100 text-left text-xs space-y-1.5">
              <div><strong>Order Number:</strong> <span className="font-mono text-zinc-900">{orderSuccess.orderNumber}</span></div>
              <div><strong>Customer:</strong> {orderSuccess.customerName}</div>
              <div><strong>Payment:</strong> {orderSuccess.paymentMethod}</div>
              <div><strong>Total Paid:</strong> ${orderSuccess.totalAmount.toFixed(2)}</div>
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

      {/* Footer */}
      <footer className="bg-white border-t border-zinc-200/80 py-8 text-center text-xs text-zinc-400">
        Powered by StoreSwift • Store: {tenantSlug}.storeswift.com
      </footer>
    </div>
  );
}
