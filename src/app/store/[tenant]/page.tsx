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
  Filter
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
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=60",
      variants: seed.variants.filter((v) => v.productSlug === p.slug)
    }))
  );

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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Announcement Bar */}
      <div className="bg-slate-900 text-white text-xs py-2 px-4 text-center font-medium">
        ⚡ Free shipping on orders over $50! Fast door-to-door delivery.
      </div>

      {/* Store Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href={`/store/${tenantSlug}`} className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              {tenantSlug.slice(0, 2).toUpperCase()}
            </div>
            <span className="font-extrabold text-slate-900 text-lg capitalize tracking-tight">
              {tenantSlug.replace("-", " ")}
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link
              href={`/admin?store=${tenantSlug}`}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Merchant Admin
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-slate-700 hover:text-blue-600 transition"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartSummary.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {cartSummary.itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white py-14 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-300 bg-blue-800/60 px-3 py-1 rounded-full border border-blue-700">
            {categoryConfig.name} Collection
          </span>
          <h1 className="text-3xl sm:text-5xl font-black mt-4 tracking-tight">
            Discover Quality Essentials
          </h1>
          <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            {categoryConfig.tagline} Order online with secure payments or convenient Cash on Delivery.
          </p>
        </div>
      </section>

      {/* Product Catalog Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Featured Products</h2>
            <p className="text-xs text-slate-500">In stock and ready to ship</p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Showing {products.length} products
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="p-6">
                <div className="w-full h-44 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold mb-4 border border-slate-200/60">
                  <ShoppingBag className="w-12 h-12 text-slate-300" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg">{prod.title}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{prod.description}</p>
                <div className="mt-4 flex items-baseline space-x-2">
                  <span className="text-2xl font-black text-slate-900">
                    ${prod.price.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => handleOpenProduct(prod)}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-600/20 transition flex items-center justify-center space-x-1.5"
                >
                  <span>Select Options & Buy</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* MODAL 1: PRODUCT VARIANT SELECTOR */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-lg">{selectedProduct.title}</h3>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-6">{selectedProduct.description}</p>

            <div className="space-y-4 mb-6">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Choose Variant:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {selectedProduct.variants.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedVariant(v)}
                    className={`p-3 rounded-xl border text-xs font-semibold text-left transition ${
                      selectedVariant?.sku === v.sku
                        ? "border-blue-600 bg-blue-50 text-blue-800 ring-2 ring-blue-500/20"
                        : "border-slate-200 hover:border-slate-300 text-slate-700"
                    }`}
                  >
                    <div>{v.title}</div>
                    <div className="font-bold text-slate-900 mt-1">${v.price}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleAddToCart(selectedProduct, selectedVariant)}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-600/20 transition flex items-center justify-center space-x-2"
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
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
              {/* Cart Header */}
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-5 h-5 text-blue-600" />
                  <h3 className="font-extrabold text-slate-900 text-lg">Your Cart</h3>
                  <span className="text-xs text-slate-500">({cartSummary.itemCount} items)</span>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Shipping Tracker */}
              <div className="p-4 bg-blue-50 border-b border-blue-100 text-xs">
                {cartSummary.isFreeShippingEligible ? (
                  <div className="flex items-center space-x-1.5 text-blue-800 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>You qualified for FREE shipping!</span>
                  </div>
                ) : (
                  <div className="text-blue-900 font-medium">
                    Add <strong className="text-blue-700">${cartSummary.amountRemainingForFreeShipping}</strong> more for free shipping!
                  </div>
                )}
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 divide-y divide-slate-100">
                {cartItems.length === 0 ? (
                  <div className="text-center py-16 text-slate-400 text-sm">
                    Your cart is currently empty.
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="py-4 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                        {item.variantTitle && (
                          <div className="text-xs text-slate-500">{item.variantTitle}</div>
                        )}
                        <div className="text-sm font-bold text-blue-600 mt-1">
                          ${(item.price * item.quantity).toFixed(2)}
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
                <div className="p-6 border-t border-slate-200 bg-slate-50">
                  <div className="flex items-center justify-between text-sm font-semibold text-slate-600 mb-2">
                    <span>Subtotal:</span>
                    <span className="text-xl font-black text-slate-900">
                      ${cartSummary.subtotal.toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsCheckoutOpen(true);
                    }}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center justify-center space-x-2"
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

      {/* MODAL 2: 1-PAGE HYBRID CHECKOUT */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
              <h3 className="font-black text-xl text-slate-900">1-Page Fast Checkout</h3>
              <button onClick={() => setIsCheckoutOpen(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Mobile Phone (For courier delivery)
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Delivery Address
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Street address, apartment, city, postal code"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Payment Method
                </label>
                <div className="space-y-2">
                  <label className="flex items-center justify-between p-3 border rounded-xl cursor-pointer hover:bg-slate-50">
                    <div className="flex items-center space-x-2.5">
                      <input
                        type="radio"
                        name="pay"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                        className="text-blue-600"
                      />
                      <span className="text-sm font-bold text-slate-800">Cash on Delivery (COD)</span>
                    </div>
                    <Banknote className="w-5 h-5 text-emerald-600" />
                  </label>

                  <label className="flex items-center justify-between p-3 border rounded-xl cursor-pointer hover:bg-slate-50">
                    <div className="flex items-center space-x-2.5">
                      <input
                        type="radio"
                        name="pay"
                        checked={paymentMethod === "stripe"}
                        onChange={() => setPaymentMethod("stripe")}
                        className="text-blue-600"
                      />
                      <span className="text-sm font-bold text-slate-800">Credit / Debit Card (Stripe)</span>
                    </div>
                    <CreditCard className="w-5 h-5 text-blue-600" />
                  </label>

                  <label className="flex items-center justify-between p-3 border rounded-xl cursor-pointer hover:bg-slate-50">
                    <div className="flex items-center space-x-2.5">
                      <input
                        type="radio"
                        name="pay"
                        checked={paymentMethod === "manual"}
                        onChange={() => setPaymentMethod("manual")}
                        className="text-blue-600"
                      />
                      <span className="text-sm font-bold text-slate-800">Mobile Money / Bank Transfer</span>
                    </div>
                    <Smartphone className="w-5 h-5 text-purple-600" />
                  </label>
                </div>
              </div>

              {paymentMethod === "manual" && (
                <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="text-xs text-purple-900 font-semibold mb-1">
                    Send ${cartSummary.subtotal.toFixed(2)} to Merchant bKash/Nagad/Bank and enter Transaction ID:
                  </div>
                  <input
                    type="text"
                    placeholder="Transaction ID / Reference Number"
                    value={manualTrxId}
                    onChange={(e) => setManualTrxId(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-purple-300 rounded text-xs outline-none"
                  />
                </div>
              )}

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500">Order Total:</span>
                  <div className="text-2xl font-black text-slate-900">
                    ${cartSummary.subtotal.toFixed(2)}
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/30 transition"
                >
                  Confirm & Place Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ORDER SUCCESS CELEBRATION */}
      {orderSuccess && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center shadow-2xl border border-slate-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-black text-2xl text-slate-900">Order Confirmed!</h3>
            <p className="text-xs text-slate-500 mt-1">Thank you for your purchase.</p>

            <div className="my-6 p-4 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-1.5">
              <div><strong>Order Number:</strong> <span className="font-mono text-blue-600">{orderSuccess.orderNumber}</span></div>
              <div><strong>Customer:</strong> {orderSuccess.customerName}</div>
              <div><strong>Phone:</strong> {orderSuccess.customerPhone}</div>
              <div><strong>Payment:</strong> {orderSuccess.paymentMethod}</div>
              <div><strong>Total Paid:</strong> ${orderSuccess.totalAmount.toFixed(2)}</div>
            </div>

            <button
              onClick={() => setOrderSuccess(null)}
              className="w-full py-3 bg-slate-900 text-white font-bold text-sm rounded-xl hover:bg-slate-800 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-400">
        Powered by StoreSwift • Store: {tenantSlug}.platform.com
      </footer>
    </div>
  );
}

