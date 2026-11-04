"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ShoppingBag,
  Search,
  Truck,
  ExternalLink,
  ChevronLeft,
  Package,
  Clock,
  Phone,
  CheckCircle2,
  MapPin,
  RefreshCw,
  MessageSquare,
  ShieldCheck,
  AlertCircle
} from "lucide-react";

interface CustomerOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: string;
  district?: string;
  subtotal: number;
  shippingFee: number;
  discountAmount?: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: Array<{ title: string; price: number; quantity: number; imageUrl?: string }>;
  consignmentId?: string;
  courierName?: string;
  trackingUrl?: string;
  createdAt: string;
}

export default function CustomerAccountPortal() {
  const params = useParams<{ tenant: string }>();
  const tenantSlug = params?.tenant ?? "apex-fashion";

  const [phoneInput, setPhoneInput] = useState("");
  const [activePhone, setActivePhone] = useState<string | null>(null);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [storeName, setStoreName] = useState(tenantSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()));
  const [searched, setSearched] = useState(false);

  // Load persisted customer phone from localStorage
  useEffect(() => {
    try {
      const savedPhone = localStorage.getItem(`storeswift_customer_phone_${tenantSlug}`);
      if (savedPhone) {
        setPhoneInput(savedPhone);
        setActivePhone(savedPhone);
      }
    } catch {
      // LocalStorage unavailable in SSR
    }

    // Fetch store info
    fetch(`/api/stores/${tenantSlug}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.store?.name) setStoreName(d.store.name);
      })
      .catch(() => {});
  }, [tenantSlug]);

  const fetchOrdersForPhone = useCallback(async (phone: string) => {
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/orders?storeSlug=${tenantSlug}&limit=50`);
      const data = await res.json();
      if (data.ok && Array.isArray(data.orders)) {
        const cleanPhone = phone.replace(/\D/g, "");
        const matched = data.orders.filter((o: any) => {
          const oPhone = String(o.customerPhone || "").replace(/\D/g, "");
          return oPhone === cleanPhone || o.orderNumber.toLowerCase() === phone.trim().toLowerCase();
        });
        setOrders(matched);
      }
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [tenantSlug]);

  useEffect(() => {
    if (activePhone) {
      fetchOrdersForPhone(activePhone);
    }
  }, [activePhone, fetchOrdersForPhone]);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = phoneInput.trim();
    if (!clean) return;

    try {
      localStorage.setItem(`storeswift_customer_phone_${tenantSlug}`, clean);
    } catch {
      // graceful
    }
    setActivePhone(clean);
  };

  const handleClearSession = () => {
    try {
      localStorage.removeItem(`storeswift_customer_phone_${tenantSlug}`);
    } catch {
      // graceful
    }
    setActivePhone(null);
    setOrders([]);
    setSearched(false);
  };

  const statusBadges: Record<string, { label: string; style: string }> = {
    pending: { label: "Order Received", style: "bg-amber-50 text-amber-700 border-amber-200" },
    processing: { label: "Processing & Packaging", style: "bg-blue-50 text-blue-700 border-blue-200" },
    shipped: { label: "Dispatched with Courier", style: "bg-indigo-50 text-indigo-700 border-indigo-200" },
    delivered: { label: "Successfully Delivered", style: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    cancelled: { label: "Cancelled", style: "bg-red-50 text-red-700 border-red-200" },
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white">
      {/* Top Header */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <Link
            href={`/store/${tenantSlug}`}
            className="flex items-center gap-1.5 text-xs font-bold text-zinc-600 hover:text-zinc-900 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Store</span>
          </Link>
          <div className="text-center">
            <h1 className="text-sm font-black uppercase tracking-tight text-zinc-950">{storeName}</h1>
            <p className="text-[10px] text-zinc-400">Customer Account & Order Tracking</p>
          </div>
          {activePhone ? (
            <button
              onClick={handleClearSession}
              className="text-xs font-semibold text-zinc-500 hover:text-red-600 transition"
            >
              Sign Out
            </button>
          ) : (
            <div className="w-12" />
          )}
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {!activePhone ? (
          /* Phone Lookup Form */
          <div className="max-w-md mx-auto bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 shadow-sm">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 text-zinc-800 flex items-center justify-center mx-auto mb-3">
                <ShoppingBag className="w-6 h-6 text-violet-600" />
              </div>
              <h2 className="text-lg font-black text-zinc-900">Track Your Orders</h2>
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                Enter the mobile phone number or order number used during checkout to view delivery status and receipts.
              </p>
            </div>

            <form onSubmit={handleLookup} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                  Mobile Phone or Order Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="e.g. 01712345678 or SS-241101-948"
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-zinc-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-md transition active:scale-98"
              >
                Lookup Orders
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-zinc-100 flex items-center justify-center gap-2 text-[11px] text-zinc-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Secure verified access · No password needed</span>
            </div>
          </div>
        ) : (
          /* Active Account View */
          <div className="space-y-6 animate-fade-in">
            {/* Account Profile Bar */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-black text-sm">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-zinc-400 font-medium">Logged in with</p>
                  <p className="font-mono font-bold text-sm text-zinc-900">{activePhone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchOrdersForPhone(activePhone)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl text-xs font-semibold transition"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                  <span>Refresh</span>
                </button>
                <Link
                  href={`/store/${tenantSlug}`}
                  className="flex items-center gap-1.5 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Continue Shopping</span>
                </Link>
              </div>
            </div>

            {/* Orders Feed */}
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center">
                <Package className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
                <h3 className="font-bold text-zinc-900 text-base">No orders found</h3>
                <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                  We could not find any orders placed under {activePhone}. If you recently placed an order, please allow a moment for confirmation.
                </p>
                <button
                  onClick={handleClearSession}
                  className="mt-4 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold rounded-xl transition"
                >
                  Try another phone number
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
                    Past Orders ({orders.length})
                  </h2>
                </div>

                {orders.map((o) => {
                  const badge = statusBadges[o.status] || { label: o.status, style: "bg-zinc-100 text-zinc-700 border-zinc-200" };
                  const tracking = o.consignmentId || `ST-${o.orderNumber.replace(/\D/g, "").slice(-6)}`;
                  const courier = o.courierName || "Steadfast Courier";

                  return (
                    <div
                      key={o.id}
                      className="bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden transition hover:shadow-sm"
                    >
                      {/* Order Header */}
                      <div className="p-4 sm:p-5 border-b border-zinc-100 bg-zinc-50/60 flex flex-wrap items-center justify-between gap-3">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm text-zinc-900">#{o.orderNumber}</span>
                            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badge.style}`}>
                              {badge.label}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Placed on {new Date(o.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-black text-zinc-950">৳{o.totalAmount.toLocaleString()}</p>
                          <p className="text-[10px] text-zinc-400 font-medium uppercase">
                            {o.paymentMethod} · {o.paymentStatus === "paid" ? "PAID" : "COD DUE"}
                          </p>
                        </div>
                      </div>

                      {/* Items List */}
                      <div className="p-4 sm:p-5 divide-y divide-zinc-100">
                        {Array.isArray(o.items) && o.items.length > 0 ? (
                          o.items.map((it: any, idx: number) => (
                            <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center font-bold text-zinc-400 text-[10px]">
                                  {it.quantity}x
                                </div>
                                <div>
                                  <p className="font-bold text-zinc-900">{it.title}</p>
                                  <p className="text-zinc-400 text-[11px]">৳{Number(it.price || 0).toLocaleString()} each</p>
                                </div>
                              </div>
                              <span className="font-bold text-zinc-900">
                                ৳{(Number(it.price || 0) * Number(it.quantity || 1)).toLocaleString()}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="py-2 text-xs text-zinc-500">Order items details recorded.</div>
                        )}
                      </div>

                      {/* Shipping & Delivery Bar */}
                      <div className="p-4 sm:p-5 bg-zinc-50/40 border-t border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-zinc-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-zinc-800">Delivery Address:</span>
                            <p className="text-zinc-600 mt-0.5">{o.shippingAddress}</p>
                            <p className="text-zinc-400 text-[11px] font-medium">{o.district || "Dhaka"}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <a
                            href={`https://storeswift.app/track/${tracking}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-800 rounded-xl text-xs font-bold shadow-xs transition"
                          >
                            <Truck className="w-3.5 h-3.5 text-violet-600" />
                            <span>Track ({tracking})</span>
                            <ExternalLink className="w-3 h-3 text-zinc-400" />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
