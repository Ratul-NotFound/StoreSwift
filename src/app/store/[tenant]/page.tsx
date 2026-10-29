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
  Star,
  Tag,
  Lock,
  ArrowLeft
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

  // Products state with rich details
  const [products] = useState(
    seed.products.map((p, idx) => ({
      id: `prod-${idx + 1}`,
      title: p.title,
      slug: p.slug,
      description: p.description,
      price: parseFloat(p.basePrice),
      compareAtPrice: p.compareAtPrice ? parseFloat(p.compareAtPrice) : undefined,
      imageUrl: p.imageUrl,
      rating: p.rating || 4.9,
      reviewsCount: p.reviewsCount || 84,
      variants: seed.variants.filter((v) => v.productSlug === p.slug)
    }))
  );

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  // Checkout state
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
          imageUrl: prod.imageUrl,
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
          : "Manual Mobile Money",
      status: paymentMethod === "cod" ? "Pending (Cash On Delivery)" : "Paid"
    };

    setOrderSuccess(newOrder);
    setCartItems([]);
    setIsCheckoutOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white text-xs py-2.5 px-4 text-center font-semibold tracking-wide flex items-center justify-center space-x-2">
        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
        <span>⚡ Free Express Delivery on orders over $50! Cash on Delivery accepted.</span>
      </div>

      {/* Store Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <Link href={`/store/${tenantSlug}`} className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-500/20">
              {tenantSlug.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <span className="font-black text-slate-900 text-lg sm:text-xl capitalize tracking-tight block">
                {tenantSlug.replace("-", " ")}
              </span>
              <span className="text-[10px] text-slate-400 font-mono hidden sm:block">
                {tenantSlug}.storeswift.com
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            <Link
              href={`/admin?store=${tenantSlug}`}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition hidden sm:inline-block"
            >
              Merchant Admin
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition flex items-center space-x-2"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-slate-700" />
              <span className="text-xs font-bold hidden sm:inline">Cart</span>
              {cartSummary.itemCount > 0 && (
                <span className="bg-blue-600 text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                  {cartSummary.itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-950 text-white py-16 px-4 sm:px-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-900/60 px-3 py-1 rounded-full border border-blue-700">
            {categoryConfig.name}
          </span>
          <h1 className="text-4xl sm:text-6xl font-black mt-4 tracking-tight leading-tight">
            Discover Quality Essentials
          </h1>
          <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            {categoryConfig.tagline} Order online with secure payments or convenient Cash on Delivery.
          </p>
        </div>
      </section>

      {/* Product Catalog Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full">
        <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Featured Collection</h2>
            <p className="text-xs text-slate-500 mt-0.5">Handpicked premium items with instant dispatch</p>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-full">
            {products.length} Products Available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((prod) => (
            <div
              key={prod.id}
              className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative overflow-hidden aspect-[4/3] bg-slate-100">
                  <img
                    src={prod.imageUrl}
                    alt={prod.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {prod.compareAtPrice && (
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-md">
                      Sale
                    </span>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center space-x-1 text-amber-400 mb-1.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                    <span className="text-[11px] font-bold text-slate-400 ml-1">
                      {prod.rating} ({prod.reviewsCount})
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition">
                    <Link href={`/store/${tenantSlug}/products/${prod.slug}`}>
                      {prod.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {prod.description}
                  </p>

                  <div className="mt-4 flex items-baseline space-x-2">
                    <span className="text-2xl font-black text-slate-900">
                      ${prod.price.toFixed(2)}
                    </span>
                    {prod.compareAtPrice && (
                      <span className="text-sm font-semibold text-slate-400 line-through">
                        ${prod.compareAtPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => handleOpenProduct(prod)}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-blue-600/20 transition flex items-center justify-center space-x-2 uppercase tracking-wider"
                >
                  <span>Select Options & Buy</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* MODAL 1: VARIANT SELECTOR */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase">Quick Buy</span>
                <h3 className="font-black text-slate-900 text-lg leading-snug mt-0.5">
                  {selectedProduct.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <img
              src={selectedProduct.imageUrl}
              alt={selectedProduct.title}
              className="w-full h-44 object-cover rounded-2xl mb-4 border border-slate-100"
            />

            <div className="space-y-4 mb-6">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Option / Variant:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {selectedProduct.variants.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedVariant(v)}
                    className={`p-3 rounded-xl border text-xs font-bold transition text-left ${
                      selectedVariant?.sku === v.sku
                        ? "border-blue-600 bg-blue-50 text-blue-800 ring-2 ring-blue-500/20"
                        : "border-slate-200 hover:border-slate-300 text-slate-700"
                    }`}
                  >
                    <div>{v.title}</div>
                    <div className="font-black text-slate-900 mt-1">${v.price}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleAddToCart(selectedProduct, selectedVariant)}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-2xl shadow-xl shadow-blue-600/25 transition flex items-center justify-center space-x-2 uppercase tracking-wider"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart (${selectedVariant ? selectedVariant.price : selectedProduct.price})</span>
            </button>
          </div>
        </div>
      )}

      {/* DRAWER: CART */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
              {/* Header */}
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-base">Your Cart</h3>
                    <span className="text-xs text-slate-400">{cartSummary.itemCount} items selected</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Shipping Tracker */}
              <div className="p-4 bg-blue-50 border-b border-blue-100 text-xs">
                {cartSummary.isFreeShippingEligible ? (
                  <div className="flex items-center space-x-2 text-blue-900 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Unlocked FREE express shipping!</span>
                  </div>
                ) : (
                  <div className="text-blue-900 font-medium">
                    Add <strong className="text-blue-700">${cartSummary.amountRemainingForFreeShipping}</strong> more to unlock FREE shipping!
                  </div>
                )}
                {/* Progress bar */}
                <div className="w-full bg-blue-200/80 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (cartSummary.subtotal / 50) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 divide-y divide-slate-100">
                {cartItems.length === 0 ? (
                  <div className="text-center py-20 text-slate-400 text-sm">
                    Your shopping cart is empty.
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="py-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-12 h-12 object-cover rounded-xl border border-slate-200"
                          />
                        )}
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs line-clamp-1">{item.title}</h4>
                          {item.variantTitle && (
                            <div className="text-[11px] text-slate-500">{item.variantTitle}</div>
                          )}
                          <div className="text-xs font-black text-blue-600 mt-0.5">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 bg-slate-100 rounded-lg p-1">
                        <button
                          onClick={() => handleUpdateQty(item.id, -1)}
                          className="w-6 h-6 flex items-center justify-center font-bold text-slate-700 hover:bg-white rounded"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold text-slate-900 w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQty(item.id, 1)}
                          className="w-6 h-6 flex items-center justify-center font-bold text-slate-700 hover:bg-white rounded"
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
                <div className="p-6 border-t border-slate-200 bg-slate-50 space-y-4">
                  <div className="flex items-center justify-between text-sm font-semibold text-slate-600">
                    <span>Order Subtotal:</span>
                    <span className="text-2xl font-black text-slate-900">
                      ${cartSummary.subtotal.toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsCheckoutOpen(true);
                    }}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-2xl shadow-xl shadow-blue-600/30 transition flex items-center justify-center space-x-2 uppercase tracking-wider"
                  >
                    <span>Proceed to 1-Page Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: 1-PAGE CHECKOUT */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-emerald-600" />
                <h3 className="font-black text-xl text-slate-900">1-Page Secure Checkout</h3>
              </div>
              <button onClick={() => setIsCheckoutOpen(false)} className="text-slate-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Full Customer Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Mercer"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Mobile Phone (For Courier Dispatch)
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Delivery Street Address
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="House/Apartment #, Street, City, Postal Code"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Payment Method
                </label>
                <div className="space-y-2.5">
                  <label className="flex items-center justify-between p-3.5 border-2 rounded-2xl cursor-pointer hover:bg-slate-50 transition">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="pay"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                        className="text-blue-600 w-4 h-4"
                      />
                      <div>
                        <span className="text-sm font-bold text-slate-900 block">Cash on Delivery (COD)</span>
                        <span className="text-xs text-slate-500">Pay cash upon package arrival</span>
                      </div>
                    </div>
                    <Banknote className="w-5 h-5 text-emerald-600" />
                  </label>

                  <label className="flex items-center justify-between p-3.5 border-2 rounded-2xl cursor-pointer hover:bg-slate-50 transition">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="pay"
                        checked={paymentMethod === "stripe"}
                        onChange={() => setPaymentMethod("stripe")}
                        className="text-blue-600 w-4 h-4"
                      />
                      <div>
                        <span className="text-sm font-bold text-slate-900 block">Credit / Debit Card</span>
                        <span className="text-xs text-slate-500">Visa, Mastercard, Apple Pay</span>
                      </div>
                    </div>
                    <CreditCard className="w-5 h-5 text-blue-600" />
                  </label>

                  <label className="flex items-center justify-between p-3.5 border-2 rounded-2xl cursor-pointer hover:bg-slate-50 transition">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="pay"
                        checked={paymentMethod === "manual"}
                        onChange={() => setPaymentMethod("manual")}
                        className="text-blue-600 w-4 h-4"
                      />
                      <div>
                        <span className="text-sm font-bold text-slate-900 block">Mobile Money / Bank Transfer</span>
                        <span className="text-xs text-slate-500">bKash, Nagad, UPI, Wire</span>
                      </div>
                    </div>
                    <Smartphone className="w-5 h-5 text-purple-600" />
                  </label>
                </div>
              </div>

              {paymentMethod === "manual" && (
                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200">
                  <div className="text-xs text-purple-900 font-semibold mb-2">
                    Send ${cartSummary.subtotal.toFixed(2)} to merchant account and enter Transaction ID:
                  </div>
                  <input
                    type="text"
                    placeholder="Transaction ID / Reference Number"
                    value={manualTrxId}
                    onChange={(e) => setManualTrxId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-purple-300 rounded-xl text-xs outline-none"
                  />
                </div>
              )}

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-semibold">Total to Pay:</span>
                  <div className="text-2xl font-black text-slate-900">
                    ${cartSummary.subtotal.toFixed(2)}
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-2xl shadow-xl shadow-emerald-600/30 transition uppercase tracking-wider"
                >
                  Confirm & Place Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ORDER SUCCESS */}
      {orderSuccess && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center shadow-2xl border border-slate-200">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="font-black text-2xl text-slate-900">Order Confirmed!</h3>
            <p className="text-xs text-slate-500 mt-1">Thank you for supporting this independent store.</p>

            <div className="my-6 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
              <div><strong>Order Number:</strong> <span className="font-mono text-blue-600 font-bold">{orderSuccess.orderNumber}</span></div>
              <div><strong>Recipient:</strong> {orderSuccess.customerName}</div>
              <div><strong>Contact Phone:</strong> {orderSuccess.customerPhone}</div>
              <div><strong>Payment Status:</strong> {orderSuccess.status}</div>
              <div><strong>Total Paid:</strong> ${orderSuccess.totalAmount.toFixed(2)}</div>
            </div>

            <button
              onClick={() => setOrderSuccess(null)}
              className="w-full py-3.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-500">
        Powered by StoreSwift • Store: {tenantSlug}.storeswift.com
      </footer>
    </div>
  );
}
