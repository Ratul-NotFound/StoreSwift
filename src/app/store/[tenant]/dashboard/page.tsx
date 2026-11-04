"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, ShoppingBag, Package, Users, BarChart3,
  Settings, TrendingUp, TrendingDown, DollarSign, AlertTriangle,
  CheckCircle2, Clock, Truck, ExternalLink, Store, Plus,
  Eye, Trash2, ChevronRight, ArrowUpRight, Zap, Percent, Globe,
  CreditCard, Bell, Search, Download, RefreshCw,
  Star, MapPin, Phone, Mail, Calendar, Layers,
  Activity, Award, Target, X, Check, Menu,
  LogOut, Edit, Save, Tag, ArrowRight, Copy, CheckCheck,
  Info, Sparkles, Package2,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const BDT = (n: number) => "৳" + n.toLocaleString("en-BD");

const PLAN_CONFIG = {
  free:   { name: "Free",   badge: "bg-zinc-100 text-zinc-700 border-zinc-200",      commission: 8, maxProducts: 50,   price: 0 },
  medium: { name: "Medium", badge: "bg-blue-50 text-blue-700 border-blue-200",       commission: 3, maxProducts: 500,  price: 499 },
  pro:    { name: "Pro",    badge: "bg-violet-50 text-violet-700 border-violet-200", commission: 0, maxProducts: null, price: 999 },
} as const;

type PlanId = keyof typeof PLAN_CONFIG;

const STATUS_STYLES: Record<string, string> = {
  pending:    "bg-amber-50 text-amber-700 border-amber-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
  shipped:    "bg-indigo-50 text-indigo-700 border-indigo-200",
  delivered:  "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled:  "bg-red-50 text-red-700 border-red-200",
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface StoreOverview {
  name: string; slug: string; plan: PlanId;
  totalRevenue: number; totalOrders: number; totalProducts: number; totalCustomers: number;
  revenueChange: number; ordersChange: number;
  pendingOrders: number; lowStockCount: number;
  recentOrders: Order[];
  revenueChart: { label: string; value: number }[];
}
interface Order {
  id: string; orderNumber: string; customerName: string; customerPhone: string;
  status: string; totalAmount: number; paymentMethod: string;
  shippingAddress: string; createdAt: string; items: number;
  consignmentId?: string; courierName?: string;
}
interface Product {
  id: string; title: string; price: number; comparePrice?: number;
  stock: number; sku?: string; category?: string; status: string;
  createdAt: string; salesCount?: number;
}
interface Customer {
  id: string; name: string; phone: string; email?: string;
  district?: string; totalOrders: number; totalSpent: number;
  lastOrderAt?: string; isLoyal: boolean;
}
interface Coupon {
  id: string; code: string; type: "flat" | "percent"; value: number;
  minOrder?: number; maxUses?: number; usedCount: number;
  expiresAt?: string; isActive: boolean;
}
interface PlatformProduct {
  id: string; title: string; category: string; minPrice: number;
  description?: string; listed?: boolean; myPrice?: number;
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

function seedOverview(slug: string): StoreOverview {
  return {
    name: slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
    slug, plan: "free",
    totalRevenue: 184500, totalOrders: 213, totalProducts: 38, totalCustomers: 142,
    revenueChange: 24, ordersChange: 18, pendingOrders: 7, lowStockCount: 3,
    recentOrders: [
      { id: "o1", orderNumber: "ORD-001", customerName: "Rahim Hossain", customerPhone: "01711111111", status: "pending", totalAmount: 1850, paymentMethod: "cod", shippingAddress: "Dhaka, Mirpur", createdAt: "2024-11-01T10:30:00Z", items: 2 },
      { id: "o2", orderNumber: "ORD-002", customerName: "Sumaiya Akter", customerPhone: "01822222222", status: "shipped", totalAmount: 2400, paymentMethod: "bkash", shippingAddress: "Chittagong", createdAt: "2024-11-02T09:00:00Z", items: 1, consignmentId: "SS-78921", courierName: "Steadfast" },
      { id: "o3", orderNumber: "ORD-003", customerName: "Karim Uddin", customerPhone: "01933333333", status: "delivered", totalAmount: 3200, paymentMethod: "cod", shippingAddress: "Sylhet", createdAt: "2024-11-03T14:00:00Z", items: 3 },
      { id: "o4", orderNumber: "ORD-004", customerName: "Farida Begum", customerPhone: "01644444444", status: "processing", totalAmount: 1200, paymentMethod: "nagad", shippingAddress: "Rajshahi", createdAt: "2024-11-04T08:00:00Z", items: 1 },
    ],
    revenueChart: [
      { label: "Jun", value: 42000 }, { label: "Jul", value: 58000 }, { label: "Aug", value: 51000 },
      { label: "Sep", value: 72000 }, { label: "Oct", value: 67000 }, { label: "Nov", value: 84500 },
    ],
  };
}

// ─── Shared Components ────────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon, iconBg, trend, trendVal }: {
  label: string; value: string | number; icon: React.ElementType;
  iconBg: string; trend?: "up" | "down"; trendVal?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-100 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && trendVal && (
          <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${trend === "up" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
            {trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trendVal}
          </span>
        )}
      </div>
      <p className="text-2xl font-black text-zinc-900 tracking-tight">{value}</p>
      <p className="text-xs text-zinc-500 mt-1 font-medium">{label}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? "bg-zinc-100 text-zinc-600 border-zinc-200";
  return (
    <span className={`inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-full border ${style}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function PlanGate({ plan, required, onUpgradeClick }: { plan: PlanId; required: PlanId; onUpgradeClick?: () => void }) {
  const order: PlanId[] = ["free", "medium", "pro"];
  if (order.indexOf(plan) >= order.indexOf(required)) return null;
  const cfg = PLAN_CONFIG[required];
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center mb-4">
        <Zap className="w-8 h-8 text-violet-500" />
      </div>
      <h3 className="text-lg font-bold text-zinc-900 mb-2">Requires {cfg.name} Plan</h3>
      <p className="text-sm text-zinc-500 mb-6 max-w-xs">Upgrade to unlock this feature and grow your business faster.</p>
      <button onClick={onUpgradeClick} className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition">
        Upgrade to {cfg.name} — {BDT(cfg.price)}/mo
      </button>
    </div>
  );
}

// ─── OVERVIEW ─────────────────────────────────────────────────────────────────

function OverviewTab({ data, plan }: { data: StoreOverview; plan: PlanId }) {
  const cfg = PLAN_CONFIG[plan];
  const chartMax = Math.max(...data.revenueChart.map(d => d.value), 1);

  return (
    <div className="space-y-6">
      {/* Plan banner */}
      <div className={`flex flex-wrap items-center gap-3 px-4 py-3 rounded-xl border text-sm ${plan === "pro" ? "bg-violet-50 border-violet-200" : plan === "medium" ? "bg-blue-50 border-blue-200" : "bg-amber-50 border-amber-200"}`}>
        <Award className={`w-4 h-4 flex-shrink-0 ${plan === "pro" ? "text-violet-600" : plan === "medium" ? "text-blue-600" : "text-amber-600"}`} />
        <span className="font-semibold text-zinc-800">
          {cfg.name} Plan · {cfg.commission}% commission · {cfg.maxProducts ? `${cfg.maxProducts} products max` : "Unlimited products"}
        </span>
        {plan !== "pro" && (
          <button className="ml-auto text-xs font-bold text-violet-700 hover:text-violet-900 flex items-center gap-1 whitespace-nowrap">
            Upgrade <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Revenue" value={BDT(data.totalRevenue)} icon={DollarSign} iconBg="bg-emerald-50 text-emerald-600" trend="up" trendVal={`+${data.revenueChange}%`} />
        <StatCard label="Total Orders" value={data.totalOrders} icon={ShoppingBag} iconBg="bg-blue-50 text-blue-600" trend="up" trendVal={`+${data.ordersChange}%`} />
        <StatCard label="Products" value={data.totalProducts} icon={Package} iconBg="bg-amber-50 text-amber-600" />
        <StatCard label="Customers" value={data.totalCustomers} icon={Users} iconBg="bg-violet-50 text-violet-600" />
      </div>

      {/* Alerts */}
      {(data.pendingOrders > 0 || data.lowStockCount > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {data.pendingOrders > 0 && (
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div><p className="text-sm font-bold text-amber-900">{data.pendingOrders} Pending Orders</p><p className="text-xs text-amber-700">Need confirmation</p></div>
            </div>
          )}
          {data.lowStockCount > 0 && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div><p className="text-sm font-bold text-red-900">{data.lowStockCount} Low Stock Items</p><p className="text-xs text-red-700">Restock soon</p></div>
            </div>
          )}
        </div>
      )}

      {/* Chart + Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white rounded-2xl border border-zinc-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div><h3 className="font-bold text-zinc-900">Revenue (6 months)</h3><p className="text-xs text-zinc-500 mt-0.5">Monthly revenue in BDT</p></div>
          </div>
          <div className="flex items-end gap-3 h-32">
            {data.revenueChart.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] text-zinc-400 font-medium">{(d.value / 1000).toFixed(0)}k</span>
                <div className="w-full rounded-t-lg bg-gradient-to-t from-violet-600 to-violet-400" style={{ height: `${(d.value / chartMax) * 80}px` }} />
                <span className="text-[10px] text-zinc-500 font-semibold">{d.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-2 space-y-3">
          <div className="bg-white rounded-2xl border border-zinc-100 p-5 shadow-sm">
            <p className="text-xs font-semibold text-zinc-500 mb-3">Quick Stats</p>
            <div className="space-y-3">
              {[
                { label: "Avg. Order Value", value: BDT(data.totalOrders ? Math.round(data.totalRevenue / data.totalOrders) : 0) },
                { label: "Conversion Rate", value: "3.4%" },
                { label: "Repeat Customer %", value: "28%" },
                { label: "Commission Paid", value: BDT(Math.round(data.totalRevenue * cfg.commission / 100)) },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500">{label}</span>
                  <span className="font-bold text-zinc-900">{value}</span>
                </div>
              ))}
            </div>
          </div>
          <a href={`/store/${data.slug}`} target="_blank" className="flex items-center justify-between bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl px-4 py-3 text-sm font-semibold transition group">
            <span>View Live Store</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-50">
          <h3 className="font-bold text-zinc-900">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-zinc-50 text-left">{["Order", "Customer", "Amount", "Method", "Status", "Date"].map(h => <th key={h} className="px-5 py-3 text-xs font-semibold text-zinc-500">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-zinc-50">
              {data.recentOrders.map(o => (
                <tr key={o.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs font-bold text-zinc-700">{o.orderNumber}</td>
                  <td className="px-5 py-3.5"><p className="font-semibold text-zinc-900">{o.customerName}</p><p className="text-xs text-zinc-400">{o.shippingAddress}</p></td>
                  <td className="px-5 py-3.5 font-bold text-zinc-900">{BDT(o.totalAmount)}</td>
                  <td className="px-5 py-3.5 uppercase text-xs text-zinc-500 font-semibold">{o.paymentMethod}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={o.status} /></td>
                  <td className="px-5 py-3.5 text-xs text-zinc-400">{new Date(o.createdAt).toLocaleDateString("en-BD")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── ORDERS ───────────────────────────────────────────────────────────────────

function OrdersTab({ tenant }: { tenant: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/orders?storeSlug=${tenant}&limit=50`)
      .then(r => r.json())
      .then(d => setOrders(d.orders ?? []))
      .catch(() => setOrders(seedOverview(tenant).recentOrders))
      .finally(() => setLoading(false));
  }, [tenant]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/orders/${id}/status`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    } catch { /* graceful */ }
  };

  const filtered = orders.filter(o => {
    const ms = !search || o.customerName.toLowerCase().includes(search.toLowerCase()) || o.orderNumber.includes(search);
    const ms2 = statusFilter === "all" || o.status === statusFilter;
    return ms && ms2;
  });

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by customer or order #..." className="w-full pl-10 pr-4 py-2.5 text-sm border border-zinc-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="text-sm border border-zinc-200 rounded-xl px-4 py-2.5 bg-white focus:outline-none cursor-pointer">
          {["all","pending","processing","shipped","delivered","cancelled"].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <button className="flex items-center gap-2 text-sm font-semibold text-zinc-700 border border-zinc-200 rounded-xl px-4 py-2.5 bg-white hover:bg-zinc-50 transition">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100 text-left">
                {["Order #","Customer","Items","Amount","Payment","Status","Date","Actions"].map(h => (
                  <th key={h} className="px-5 py-3 text-xs font-semibold text-zinc-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filtered.length === 0
                ? <tr><td colSpan={8} className="text-center py-16 text-zinc-400">No orders found</td></tr>
                : filtered.map(o => (
                  <>
                    <tr key={o.id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-xs font-bold text-zinc-700">{o.orderNumber}</td>
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-zinc-900 text-xs">{o.customerName}</p>
                        <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3" />{o.customerPhone}</p>
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-zinc-700">{o.items}</td>
                      <td className="px-5 py-3.5 font-bold text-zinc-900">{BDT(o.totalAmount)}</td>
                      <td className="px-5 py-3.5 uppercase text-xs font-semibold text-zinc-500">{o.paymentMethod}</td>
                      <td className="px-5 py-3.5"><StatusBadge status={o.status} /></td>
                      <td className="px-5 py-3.5 text-xs text-zinc-400 whitespace-nowrap">{new Date(o.createdAt).toLocaleDateString("en-BD")}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setExpanded(expanded === o.id ? null : o.id)} className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500 transition"><Eye className="w-3.5 h-3.5" /></button>
                          {o.status === "pending" && <button onClick={() => updateStatus(o.id, "processing")} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition" title="Confirm"><Check className="w-3.5 h-3.5" /></button>}
                          {o.status === "processing" && <button onClick={() => updateStatus(o.id, "shipped")} className="p-1.5 rounded-lg hover:bg-indigo-50 text-indigo-600 transition" title="Ship"><Truck className="w-3.5 h-3.5" /></button>}
                        </div>
                      </td>
                    </tr>
                    {expanded === o.id && (
                      <tr key={`${o.id}-detail`}>
                        <td colSpan={8} className="px-5 py-4 bg-zinc-50/80">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                            <div><p className="text-zinc-500 text-xs font-semibold mb-1">Shipping Address</p><p className="font-semibold text-zinc-900">{o.shippingAddress}</p></div>
                            <div><p className="text-zinc-500 text-xs font-semibold mb-1">Total</p><p className="font-black text-emerald-700 text-lg">{BDT(o.totalAmount)}</p></div>
                            <div><p className="text-zinc-500 text-xs font-semibold mb-1">Tracking</p><p className="font-mono text-xs">{o.consignmentId ?? "Not assigned"}</p>{o.courierName && <p className="text-xs text-zinc-500">{o.courierName}</p>}</div>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            {["pending","processing","shipped","delivered","cancelled"].map(s => (
                              <button key={s} onClick={() => updateStatus(o.id, s)} className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition ${o.status === s ? "bg-zinc-900 text-white border-zinc-900" : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"}`}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────

function ProductsTab({ tenant, plan }: { tenant: string; plan: PlanId }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", price: "", stock: "", sku: "", category: "", comparePrice: "" });
  const [saving, setSaving] = useState(false);

  const cfg = PLAN_CONFIG[plan];
  const atLimit = cfg.maxProducts !== null && products.length >= cfg.maxProducts;

  const load = useCallback(() => {
    setLoading(true);
    fetch(`/api/products?storeSlug=${tenant}&limit=100`)
      .then(r => r.json())
      .then(d => setProducts(d.products ?? []))
      .catch(() => setProducts([
        { id: "p1", title: "Premium Cotton Shirt", price: 850, comparePrice: 1200, stock: 42, sku: "SHT-001", category: "Clothing", status: "active", createdAt: "2024-01-01", salesCount: 87 },
        { id: "p2", title: "Classic Denim Jeans", price: 1850, comparePrice: 2500, stock: 18, sku: "JNS-002", category: "Clothing", status: "active", createdAt: "2024-01-02", salesCount: 54 },
        { id: "p3", title: "Casual Sneakers", price: 2200, stock: 7, sku: "SNK-003", category: "Footwear", status: "active", createdAt: "2024-01-03", salesCount: 31 },
        { id: "p4", title: "Linen Kurti Set", price: 1400, comparePrice: 1800, stock: 0, sku: "KRT-004", category: "Clothing", status: "out_of_stock", createdAt: "2024-01-04", salesCount: 102 },
      ]))
      .finally(() => setLoading(false));
  }, [tenant]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    if (!form.title || !form.price) return;
    setSaving(true);
    try {
      const payload = { storeSlug: tenant, title: form.title, price: parseFloat(form.price), stock: parseInt(form.stock) || 0, sku: form.sku || undefined, category: form.category || undefined, comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : undefined };
      if (editId) {
        await fetch(`/api/products/${editId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      } else {
        await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      }
      setForm({ title: "", price: "", stock: "", sku: "", category: "", comparePrice: "" });
      setShowForm(false); setEditId(null); load();
    } catch { /* graceful */ }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch { /* graceful */ }
  };

  const startEdit = (p: Product) => {
    setEditId(p.id);
    setForm({ title: p.title, price: String(p.price), stock: String(p.stock), sku: p.sku ?? "", category: p.category ?? "", comparePrice: p.comparePrice ? String(p.comparePrice) : "" });
    setShowForm(true);
  };

  const filtered = products.filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-zinc-900">Products</h2>
          <p className="text-xs text-zinc-500 mt-0.5">{products.length} / {cfg.maxProducts ?? "∞"}{atLimit && <span className="text-red-600 font-semibold ml-2">· Limit reached</span>}</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="w-full sm:w-48 pl-9 pr-4 py-2 text-sm border border-zinc-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30" />
          </div>
          <button onClick={() => { if (!atLimit) { setShowForm(true); setEditId(null); setForm({ title: "", price: "", stock: "", sku: "", category: "", comparePrice: "" }); } }} disabled={atLimit} className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl text-sm font-bold transition whitespace-nowrap">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {atLimit && cfg.maxProducts && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-3 text-sm">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span className="text-amber-800 font-semibold">Product limit reached ({cfg.maxProducts}/{cfg.maxProducts}).</span>
          <button className="ml-auto text-xs font-bold text-violet-700 whitespace-nowrap">Upgrade →</button>
        </div>
      )}

      {showForm && (
        <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-zinc-900 mb-4">{editId ? "Edit Product" : "New Product"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { key: "title", label: "Title *", placeholder: "Product name", type: "text" },
              { key: "price", label: "Price (৳) *", placeholder: "850", type: "number" },
              { key: "comparePrice", label: "Compare Price (৳)", placeholder: "1200", type: "number" },
              { key: "stock", label: "Stock", placeholder: "50", type: "number" },
              { key: "sku", label: "SKU", placeholder: "SHT-001", type: "text" },
              { key: "category", label: "Category", placeholder: "Clothing", type: "text" },
            ].map(({ key, label, placeholder, type }) => (
              <div key={key}>
                <label className="text-xs font-semibold text-zinc-600 mb-1 block">{label}</label>
                <input type={type} value={form[key as keyof typeof form]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} placeholder={placeholder} className="w-full px-3 py-2.5 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/30" />
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition">
              <Save className="w-4 h-4" />{saving ? "Saving..." : "Save"}
            </button>
            <button onClick={() => { setShowForm(false); setEditId(null); }} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-zinc-600 border border-zinc-200 hover:bg-zinc-50 transition">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-zinc-50 border-b border-zinc-100 text-left">{["Product","Price","Compare","Stock","SKU","Category","Status","Sales","Actions"].map(h => <th key={h} className="px-5 py-3 text-xs font-semibold text-zinc-500 whitespace-nowrap">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-zinc-50">
              {filtered.length === 0
                ? <tr><td colSpan={9} className="text-center py-16 text-zinc-400 text-sm">No products yet. Add your first product!</td></tr>
                : filtered.map(p => (
                  <tr key={p.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center flex-shrink-0"><Package className="w-4 h-4 text-zinc-400" /></div>
                        <span className="font-semibold text-zinc-900 text-xs line-clamp-2 max-w-[160px]">{p.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-zinc-900">{BDT(p.price)}</td>
                    <td className="px-5 py-3.5 text-zinc-400 line-through text-xs">{p.comparePrice ? BDT(p.comparePrice) : "—"}</td>
                    <td className="px-5 py-3.5"><span className={`font-bold ${p.stock === 0 ? "text-red-600" : p.stock <= 10 ? "text-amber-600" : "text-zinc-900"}`}>{p.stock}</span></td>
                    <td className="px-5 py-3.5 font-mono text-xs text-zinc-500">{p.sku ?? "—"}</td>
                    <td className="px-5 py-3.5 text-xs text-zinc-500">{p.category ?? "—"}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${p.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                        {p.status === "out_of_stock" ? "Out of Stock" : "Active"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-zinc-700">{p.salesCount ?? 0}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <button onClick={() => startEdit(p)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition"><Edit className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── CUSTOMERS ────────────────────────────────────────────────────────────────

function CustomersTab({ tenant }: { tenant: string }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`/api/customers?storeSlug=${tenant}&limit=100`)
      .then(r => r.json())
      .then(d => setCustomers(d.customers ?? []))
      .catch(() => setCustomers([
        { id: "c1", name: "Rahim Hossain", phone: "01711111111", email: "rahim@gmail.com", district: "Dhaka", totalOrders: 12, totalSpent: 18400, lastOrderAt: "2024-11-01", isLoyal: true },
        { id: "c2", name: "Sumaiya Akter", phone: "01822222222", district: "Chittagong", totalOrders: 8, totalSpent: 12800, lastOrderAt: "2024-11-02", isLoyal: true },
        { id: "c3", name: "Karim Uddin", phone: "01933333333", district: "Sylhet", totalOrders: 3, totalSpent: 5400, lastOrderAt: "2024-11-03", isLoyal: false },
      ]))
      .finally(() => setLoading(false));
  }, [tenant]);

  const filtered = customers.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search));
  const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0);

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total Customers" value={customers.length} icon={Users} iconBg="bg-violet-50 text-violet-600" />
        <StatCard label="Loyal Customers" value={customers.filter(c => c.isLoyal).length} icon={Star} iconBg="bg-amber-50 text-amber-600" />
        <StatCard label="Total Revenue" value={BDT(totalRevenue)} icon={DollarSign} iconBg="bg-emerald-50 text-emerald-600" />
        <StatCard label="Avg. LTV" value={customers.length ? BDT(Math.round(totalRevenue / customers.length)) : "৳0"} icon={Target} iconBg="bg-blue-50 text-blue-600" />
      </div>
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or phone..." className="w-full pl-10 pr-4 py-2.5 text-sm border border-zinc-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30" />
        </div>
        <button className="flex items-center gap-2 text-sm font-semibold text-zinc-700 border border-zinc-200 rounded-xl px-4 py-2.5 bg-white hover:bg-zinc-50 transition"><Download className="w-4 h-4" /> Export CSV</button>
      </div>
      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-zinc-50 border-b border-zinc-100 text-left">{["Customer","Contact","District","Orders","Total Spent","Last Order","Type"].map(h => <th key={h} className="px-5 py-3 text-xs font-semibold text-zinc-500">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-zinc-50">
              {filtered.length === 0
                ? <tr><td colSpan={7} className="text-center py-16 text-zinc-400">No customers yet</td></tr>
                : filtered.map(c => (
                  <tr key={c.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-black text-zinc-700 flex-shrink-0">{c.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</div>
                        <span className="font-semibold text-zinc-900">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-xs flex items-center gap-1 text-zinc-600"><Phone className="w-3 h-3" />{c.phone}</p>
                      {c.email && <p className="text-xs flex items-center gap-1 text-zinc-400 mt-0.5"><Mail className="w-3 h-3" />{c.email}</p>}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-zinc-500">{c.district ?? "—"}</td>
                    <td className="px-5 py-3.5 font-bold text-zinc-900">{c.totalOrders}</td>
                    <td className="px-5 py-3.5 font-bold text-emerald-700">{BDT(c.totalSpent)}</td>
                    <td className="px-5 py-3.5 text-xs text-zinc-400">{c.lastOrderAt ? new Date(c.lastOrderAt).toLocaleDateString("en-BD") : "—"}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${c.isLoyal ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-zinc-100 text-zinc-600 border-zinc-200"}`}>{c.isLoyal ? "⭐ Loyal" : "New"}</span>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── ANALYTICS ────────────────────────────────────────────────────────────────

function AnalyticsTab({ plan }: { plan: PlanId }) {
  const weekData = [
    { day: "Mon", orders: 12 }, { day: "Tue", orders: 18 }, { day: "Wed", orders: 9 },
    { day: "Thu", orders: 22 }, { day: "Fri", orders: 31 }, { day: "Sat", orders: 28 }, { day: "Sun", orders: 15 },
  ];
  const maxO = Math.max(...weekData.map(d => d.orders));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Monthly Revenue" value={BDT(84500)} icon={DollarSign} iconBg="bg-emerald-50 text-emerald-600" trend="up" trendVal="+24%" />
        <StatCard label="Monthly Orders" value="98" icon={ShoppingBag} iconBg="bg-blue-50 text-blue-600" trend="up" trendVal="+18%" />
        <StatCard label="Avg. Order Value" value={BDT(862)} icon={Target} iconBg="bg-amber-50 text-amber-600" />
        <StatCard label="Return Rate" value="4.8%" icon={RefreshCw} iconBg="bg-red-50 text-red-600" />
      </div>

      <div className="bg-white rounded-2xl border border-zinc-100 p-5 shadow-sm">
        <h3 className="font-bold text-zinc-900 mb-5">Daily Orders — This Week</h3>
        <div className="flex items-end gap-4 h-28">
          {weekData.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[9px] text-zinc-400 font-semibold">{d.orders}</span>
              <div className="w-full rounded-t-lg bg-gradient-to-t from-blue-600 to-blue-400" style={{ height: `${(d.orders / maxO) * 80}px` }} />
              <span className="text-[10px] text-zinc-500 font-semibold">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-50"><h3 className="font-bold text-zinc-900">Top Selling Products</h3></div>
        <div className="divide-y divide-zinc-50">
          {[
            { title: "Linen Kurti Set", sales: 102, revenue: 142800 },
            { title: "Premium Cotton Shirt", sales: 87, revenue: 73950 },
            { title: "Classic Denim Jeans", sales: 54, revenue: 99900 },
            { title: "Casual Sneakers", sales: 31, revenue: 68200 },
          ].map((p, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3.5">
              <span className="text-sm font-black text-zinc-400 w-6">#{i + 1}</span>
              <div className="flex-1"><p className="text-sm font-semibold text-zinc-900">{p.title}</p><p className="text-xs text-zinc-500">{p.sales} units</p></div>
              <span className="font-bold text-emerald-700 text-sm">{BDT(p.revenue)}</span>
            </div>
          ))}
        </div>
      </div>

      {plan !== "pro" && (
        <div className="bg-gradient-to-br from-violet-50 via-purple-50 to-blue-50 border border-violet-200 rounded-2xl p-6 text-center">
          <Sparkles className="w-10 h-10 text-violet-500 mx-auto mb-3" />
          <h3 className="font-bold text-violet-900 mb-2 text-lg">Unlock Advanced Business Intelligence</h3>
          <p className="text-sm text-violet-700 mb-5 max-w-sm mx-auto">Customer LTV heatmaps, cohort analysis, geographic sales breakdown, and revenue forecasting.</p>
          <div className="flex flex-wrap gap-2 justify-center mb-5">
            {["Cohort Analysis","Geographic Map","Revenue Forecast","Funnel Analytics","RFM Segments"].map(f => (
              <span key={f} className="text-xs font-semibold bg-white/80 text-violet-700 border border-violet-200 px-3 py-1 rounded-full">{f}</span>
            ))}
          </div>
          <button className="bg-violet-600 hover:bg-violet-500 text-white px-8 py-3 rounded-xl font-bold text-sm transition shadow-lg shadow-violet-200">Upgrade to Pro — ৳999/month</button>
        </div>
      )}
    </div>
  );
}

// ─── COUPONS ──────────────────────────────────────────────────────────────────

function CouponsTab({ tenant, plan }: { tenant: string; plan: PlanId }) {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: "", type: "flat" as "flat" | "percent", value: "", minOrder: "", maxUses: "", expiresAt: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (plan === "free") { setLoading(false); return; }
    fetch(`/api/coupons?storeSlug=${tenant}`)
      .then(r => r.json())
      .then(d => setCoupons(d.coupons ?? []))
      .catch(() => setCoupons([
        { id: "cp1", code: "WELCOME10", type: "percent", value: 10, minOrder: 500, maxUses: 100, usedCount: 23, expiresAt: "2024-03-31", isActive: true },
        { id: "cp2", code: "FLAT100", type: "flat", value: 100, usedCount: 8, isActive: true },
      ]))
      .finally(() => setLoading(false));
  }, [tenant, plan]);

  if (plan === "free") return <PlanGate plan={plan} required="medium" />;
  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" /></div>;

  const createCoupon = async () => {
    if (!form.code || !form.value) return;
    setSaving(true);
    try {
      await fetch("/api/coupons", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ storeSlug: tenant, ...form, value: parseFloat(form.value), minOrder: form.minOrder ? parseFloat(form.minOrder) : undefined, maxUses: form.maxUses ? parseInt(form.maxUses) : undefined }) });
      setShowForm(false); setForm({ code: "", type: "flat", value: "", minOrder: "", maxUses: "", expiresAt: "" });
    } catch { /* graceful */ }
    setSaving(false);
  };

  const toggleCoupon = async (id: string, isActive: boolean) => {
    try {
      await fetch("/api/coupons", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, isActive: !isActive }) });
      setCoupons(prev => prev.map(c => c.id === id ? { ...c, isActive: !isActive } : c));
    } catch { /* graceful */ }
  };

  const deleteCoupon = async (id: string) => {
    if (!confirm("Delete coupon?")) return;
    try {
      await fetch(`/api/coupons?id=${id}`, { method: "DELETE" });
      setCoupons(prev => prev.filter(c => c.id !== id));
    } catch { /* graceful */ }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h2 className="text-lg font-bold text-zinc-900">Discount Coupons</h2><p className="text-xs text-zinc-500 mt-0.5">{coupons.length} coupons total</p></div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition"><Plus className="w-4 h-4" />New Coupon</button>
      </div>

      {showForm && (
        <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-zinc-900 mb-4">Create Coupon</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {[
              { key: "code", label: "Code *", placeholder: "WELCOME10", type: "text" },
              { key: "value", label: "Value *", placeholder: "10", type: "number" },
              { key: "minOrder", label: "Min Order (৳)", placeholder: "500", type: "number" },
              { key: "maxUses", label: "Max Uses", placeholder: "100", type: "number" },
              { key: "expiresAt", label: "Expires At", placeholder: "", type: "date" },
            ].map(({ key, label, placeholder, type }) => (
              <div key={key}>
                <label className="text-xs font-semibold text-zinc-600 mb-1 block">{label}</label>
                <input type={type} value={form[key as keyof typeof form]} onChange={e => setForm(p => ({ ...p, [key]: key === "code" ? e.target.value.toUpperCase() : e.target.value }))} placeholder={placeholder} className="w-full px-3 py-2.5 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/30" />
              </div>
            ))}
            <div>
              <label className="text-xs font-semibold text-zinc-600 mb-1 block">Type</label>
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as "flat"|"percent" }))} className="w-full px-3 py-2.5 text-sm border border-zinc-200 rounded-xl bg-white focus:outline-none">
                <option value="flat">Flat (৳)</option><option value="percent">Percent (%)</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={createCoupon} disabled={saving} className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition"><Save className="w-4 h-4" />{saving ? "Creating..." : "Create"}</button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-zinc-600 border border-zinc-200 hover:bg-zinc-50 transition">Cancel</button>
          </div>
        </div>
      )}

      {coupons.length === 0 && !showForm ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-zinc-100">
          <Tag className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
          <p className="text-zinc-500 font-semibold">No coupons yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coupons.map(c => (
            <div key={c.id} className="bg-white border border-zinc-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-lg text-zinc-900 tracking-wider">{c.code}</span>
                  <button onClick={() => navigator.clipboard.writeText(c.code)} className="p-1 rounded hover:bg-zinc-100 text-zinc-400"><Copy className="w-3.5 h-3.5" /></button>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleCoupon(c.id, c.isActive)} className={`w-9 h-5 rounded-full transition-colors relative ${c.isActive ? "bg-emerald-500" : "bg-zinc-300"}`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow transition-transform ${c.isActive ? "translate-x-4" : "translate-x-0.5"}`} />
                  </button>
                  <button onClick={() => deleteCoupon(c.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-xs mb-3">
                <span className="bg-violet-50 text-violet-700 border border-violet-200 font-bold px-2.5 py-1 rounded-full">{c.type === "flat" ? `৳${c.value} OFF` : `${c.value}% OFF`}</span>
                {c.minOrder && <span className="bg-zinc-100 text-zinc-600 font-semibold px-2.5 py-1 rounded-full">Min ৳{c.minOrder}</span>}
                {c.expiresAt && <span className="bg-zinc-100 text-zinc-600 font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"><Calendar className="w-3 h-3" />Exp {new Date(c.expiresAt).toLocaleDateString("en-BD")}</span>}
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>Used {c.usedCount}{c.maxUses ? ` / ${c.maxUses}` : ""} times</span>
                {c.maxUses && <div className="w-24 h-1.5 bg-zinc-100 rounded-full overflow-hidden"><div className="h-full bg-violet-500 rounded-full" style={{ width: `${Math.min((c.usedCount / c.maxUses) * 100, 100)}%` }} /></div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── DROPSHIP ─────────────────────────────────────────────────────────────────

function DropshipTab({ tenant, plan }: { tenant: string; plan: PlanId }) {
  const [products, setProducts] = useState<PlatformProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [listing, setListing] = useState<string | null>(null);

  useEffect(() => {
    if (plan === "free") { setLoading(false); return; }
    fetch("/api/platform-products?limit=20")
      .then(r => r.json())
      .then(d => setProducts(d.products ?? []))
      .catch(() => setProducts([
        { id: "pp1", title: "StoreSwift T-Shirt Bundle", category: "Clothing", minPrice: 420, description: "Premium cotton bulk bundle" },
        { id: "pp2", title: "Ceramic Mug Set (6pcs)", category: "Home", minPrice: 850, description: "Hand-painted ceramic mugs" },
        { id: "pp3", title: "LED Desk Lamp", category: "Electronics", minPrice: 1200, description: "USB-C rechargeable" },
        { id: "pp4", title: "Leather Phone Case", category: "Accessories", minPrice: 320, description: "Genuine leather" },
        { id: "pp5", title: "Organic Face Cream", category: "Beauty", minPrice: 580, description: "Natural ingredients" },
      ]))
      .finally(() => setLoading(false));
  }, [plan]);

  if (plan === "free") return <PlanGate plan={plan} required="medium" />;
  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" /></div>;

  const handleList = async (pp: PlatformProduct) => {
    const myPrice = parseFloat(prices[pp.id] ?? "0");
    if (!myPrice || myPrice < pp.minPrice) { alert(`Min price: ৳${pp.minPrice}`); return; }
    setListing(pp.id);
    try {
      await fetch("/api/dropship", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ storeSlug: tenant, platformProductId: pp.id, myPrice }) });
      setProducts(prev => prev.map(p => p.id === pp.id ? { ...p, listed: true, myPrice } : p));
    } catch { /* graceful */ }
    setListing(null);
  };

  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0"><Layers className="w-5 h-5 text-blue-600" /></div>
          <div>
            <h3 className="font-bold text-blue-900 mb-1">Dropshipping — Sell Without Stock</h3>
            <p className="text-sm text-blue-700">List platform products, set your price above minimum, and earn the margin. We handle fulfillment.</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(pp => (
          <div key={pp.id} className={`bg-white border rounded-2xl p-5 shadow-sm ${pp.listed ? "border-emerald-200" : "border-zinc-100 hover:shadow-md"} transition-all`}>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center flex-shrink-0"><Package2 className="w-6 h-6 text-zinc-400" /></div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-zinc-900 text-sm">{pp.title}</p>
                <p className="text-xs text-zinc-500">{pp.category}</p>
                <p className="text-xs text-zinc-400 mt-1">{pp.description}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mb-3">
              <div><p className="text-xs text-zinc-500 font-semibold">Min Price</p><p className="font-black text-zinc-900">{BDT(pp.minPrice)}</p></div>
              {pp.listed && pp.myPrice && <div className="text-right"><p className="text-xs text-emerald-600 font-semibold">Your Profit</p><p className="font-black text-emerald-700">{BDT(pp.myPrice - pp.minPrice)}</p></div>}
            </div>
            {pp.listed ? (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /><span className="text-sm font-semibold text-emerald-700">Listed at {BDT(pp.myPrice ?? 0)}</span>
              </div>
            ) : (
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 font-semibold">৳</span>
                  <input type="number" value={prices[pp.id] ?? ""} onChange={e => setPrices(prev => ({ ...prev, [pp.id]: e.target.value }))} placeholder={String(pp.minPrice + 100)} min={pp.minPrice} className="w-full pl-7 pr-3 py-2 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/30" />
                </div>
                <button onClick={() => handleList(pp)} disabled={listing === pp.id} className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white px-3 py-2 rounded-xl text-xs font-bold transition">
                  {listing === pp.id ? "..." : "List"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────────

function SettingsTab({ tenant, plan }: { tenant: string; plan: PlanId }) {
  const [settings, setSettings] = useState({ name: "", description: "", phone: "", email: "", address: "", facebookPixel: "", googleAnalytics: "" });
  const [domain, setDomain] = useState({ domain: "", cnameTarget: "", isVerified: false });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/stores/${tenant}/settings`)
      .then(r => r.json())
      .then(d => { if (d.settings) setSettings(s => ({ ...s, ...d.settings })); if (d.domain) setDomain(d.domain); })
      .catch(() => setSettings(s => ({ ...s, name: tenant.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()) })));
  }, [tenant]);

  const save = async () => {
    setSaving(true);
    try {
      await fetch(`/api/stores/${tenant}/settings`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
      setSaved(true); setTimeout(() => setSaved(false), 2500);
    } catch { /* graceful */ }
    setSaving(false);
  };

  const addDomain = async () => {
    if (!domain.domain) return;
    try {
      const res = await fetch("/api/domains", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ domain: domain.domain }) });
      const d = await res.json();
      if (d.cnameTarget) setDomain(prev => ({ ...prev, cnameTarget: d.cnameTarget }));
    } catch { /* graceful */ }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
        <h3 className="font-bold text-zinc-900 mb-5 flex items-center gap-2"><Store className="w-4 h-4 text-violet-600" />Store Information</h3>
        <div className="space-y-4">
          {[
            { key: "name", label: "Store Name", placeholder: "My Awesome Store" },
            { key: "phone", label: "Contact Phone", placeholder: "01XXXXXXXXX" },
            { key: "email", label: "Contact Email", placeholder: "store@example.com" },
            { key: "address", label: "Business Address", placeholder: "Dhaka, Bangladesh" },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="text-xs font-semibold text-zinc-600 mb-1.5 block">{label}</label>
              <input value={settings[key as keyof typeof settings]} onChange={e => setSettings(p => ({ ...p, [key]: e.target.value }))} placeholder={placeholder} className="w-full px-3 py-2.5 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/30" />
            </div>
          ))}
          <div>
            <label className="text-xs font-semibold text-zinc-600 mb-1.5 block">Store Description</label>
            <textarea value={settings.description} onChange={e => setSettings(p => ({ ...p, description: e.target.value }))} placeholder="Tell customers about your store..." rows={3} className="w-full px-3 py-2.5 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/30 resize-none" />
          </div>
        </div>
        <button onClick={save} disabled={saving} className="mt-5 flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition">
          {saved ? <><CheckCheck className="w-4 h-4" />Saved!</> : <><Save className="w-4 h-4" />{saving ? "Saving..." : "Save Changes"}</>}
        </button>
      </div>

      {plan !== "free" && (
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
          <h3 className="font-bold text-zinc-900 mb-5 flex items-center gap-2"><Activity className="w-4 h-4 text-blue-600" />Pixel Integrations</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-zinc-600 mb-1.5 block">Facebook Pixel ID</label>
              <input value={settings.facebookPixel} onChange={e => setSettings(p => ({ ...p, facebookPixel: e.target.value }))} placeholder="XXXXXXXXXXXXXXXXXX" className="w-full px-3 py-2.5 text-sm border border-zinc-200 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-violet-500/30" />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-600 mb-1.5 block">Google Analytics ID</label>
              <input value={settings.googleAnalytics} onChange={e => setSettings(p => ({ ...p, googleAnalytics: e.target.value }))} placeholder="G-XXXXXXXXXX" className="w-full px-3 py-2.5 text-sm border border-zinc-200 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-violet-500/30" />
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
        <h3 className="font-bold text-zinc-900 mb-5 flex items-center gap-2"><Globe className="w-4 h-4 text-emerald-600" />Custom Domain</h3>
        {plan === "free" ? (
          <div className="text-center py-8">
            <Globe className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
            <p className="text-sm text-zinc-500 font-semibold">Your store: <span className="text-violet-700 font-bold">{tenant}.storeswift.app</span></p>
            <button className="mt-4 bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition">Upgrade to Medium — ৳499/mo</button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm">
              <p className="text-zinc-500">Subdomain: <span className="font-bold text-zinc-900">{tenant}.storeswift.app</span></p>
            </div>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input value={domain.domain} onChange={e => setDomain(p => ({ ...p, domain: e.target.value }))} placeholder="yourdomain.com" className="w-full pl-10 pr-4 py-2.5 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/30" />
              </div>
              <button onClick={addDomain} className="bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition">Connect</button>
            </div>
            {domain.cnameTarget && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm">
                <p className="font-bold text-blue-900 mb-2 flex items-center gap-2"><Info className="w-4 h-4" />DNS Setup</p>
                <div className="font-mono text-xs bg-white border border-blue-200 rounded-lg px-3 py-2 flex items-center justify-between">
                  <span>CNAME → <strong>{domain.cnameTarget}</strong></span>
                  <button onClick={() => navigator.clipboard.writeText(domain.cnameTarget)} className="text-blue-600 ml-2"><Copy className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            )}
            {domain.isVerified && (
              <div className="flex items-center gap-2 text-sm bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /><span className="font-semibold text-emerald-700">Domain verified & SSL active!</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── BILLING ──────────────────────────────────────────────────────────────────

function BillingTab({ tenant, plan, onPlanUpdate }: { tenant: string; plan: PlanId; onPlanUpdate: (newPlan: PlanId) => void }) {
  const [selectedPlan, setSelectedPlan] = useState<PlanId>(plan === "free" ? "medium" : "pro");
  const [trxId, setTrxId] = useState("");
  const [upgrading, setUpgrading] = useState(false);
  const [upgradeSuccess, setUpgradeSuccess] = useState<string | null>(null);

  const plans: { id: PlanId; features: string[]; highlight?: boolean }[] = [
    { id: "free",   features: ["50 products","8% commission/sale","StoreSwift subdomain only","1 courier integration","COD payments"] },
    { id: "medium", features: ["500 products","3% commission/sale","Custom domain","Dropshipping access","Coupon system","Pixel integrations","Email notifications"], highlight: true },
    { id: "pro",    features: ["Unlimited products","0% commission","Custom domain + SSL","Dropshipping + Affiliate","Advanced BI & Analytics","API access","10 staff accounts","Priority support"] },
  ];

  const handleUpgrade = async (targetPlan?: PlanId) => {
    const planToUpgrade = targetPlan || selectedPlan;
    setUpgrading(true);
    setUpgradeSuccess(null);
    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: planToUpgrade,
          paymentMethod: "bkash",
          trxId: trxId || `BKASH-${Date.now().toString(36).toUpperCase()}`,
          storeSlug: tenant,
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        onPlanUpdate(planToUpgrade);
        setUpgradeSuccess(`Successfully upgraded to ${PLAN_CONFIG[planToUpgrade].name} plan! Features unlocked.`);
        setTimeout(() => setUpgradeSuccess(null), 4000);
      }
    } catch {
      onPlanUpdate(planToUpgrade);
      setUpgradeSuccess(`Upgraded to ${PLAN_CONFIG[planToUpgrade].name}!`);
      setTimeout(() => setUpgradeSuccess(null), 4000);
    }
    setUpgrading(false);
  };

  return (
    <div className="space-y-6">
      {upgradeSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{upgradeSuccess}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-5">
        <div className="flex items-center gap-4">
          <span className={`px-4 py-2 rounded-xl font-black text-sm border ${PLAN_CONFIG[plan].badge}`}>{PLAN_CONFIG[plan].name} Plan</span>
          <div>
            <p className="font-bold text-zinc-900">Currently on <span className="text-violet-700">{PLAN_CONFIG[plan].name}</span></p>
            <p className="text-xs text-zinc-500 mt-0.5">{PLAN_CONFIG[plan].price > 0 ? `৳${PLAN_CONFIG[plan].price}/month · Active Subscription` : "Free plan — no monthly fee (8% commission on sales)"}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans.map(p => {
          const cfg = PLAN_CONFIG[p.id];
          const isCurrent = p.id === plan;
          return (
            <div key={p.id} className={`bg-white rounded-2xl border p-5 shadow-sm relative overflow-hidden transition-all ${p.highlight ? "border-violet-300 ring-1 ring-violet-200" : "border-zinc-100"} ${isCurrent ? "opacity-80" : "hover:shadow-md"}`}>
              {p.highlight && <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-500 to-purple-500" />}
              {isCurrent && <div className="absolute top-3 right-3 bg-zinc-900 text-white text-[10px] font-black px-2 py-1 rounded-full">CURRENT</div>}
              <h3 className="font-black text-zinc-900 text-lg mb-1">{cfg.name}</h3>
              <p className="text-2xl font-black text-zinc-900 mb-4">{cfg.price === 0 ? "Free" : <>{BDT(cfg.price)}<span className="text-sm font-semibold text-zinc-500">/mo</span></>}</p>
              <ul className="space-y-2 mb-5">
                {p.features.map(f => <li key={f} className="flex items-center gap-2 text-xs text-zinc-700"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />{f}</li>)}
              </ul>
              <button
                onClick={() => { setSelectedPlan(p.id); handleUpgrade(p.id); }}
                disabled={isCurrent || upgrading}
                className={`w-full py-2.5 rounded-xl text-sm font-bold transition ${isCurrent ? "bg-zinc-100 text-zinc-400 cursor-not-allowed" : p.highlight ? "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-200" : "bg-zinc-900 hover:bg-zinc-800 text-white"}`}
              >
                {isCurrent ? "Current Plan" : upgrading ? "Upgrading..." : `Upgrade to ${cfg.name}`}
              </button>
            </div>
          );
        })}
      </div>

      <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5">
        <p className="font-semibold text-zinc-700 mb-1 text-sm">Instant Upgrade via bKash / Nagad</p>
        <p className="text-xs text-zinc-500 mb-3">Send payment (৳499 for Medium or ৳999 for Pro) to Merchant bKash: <span className="font-mono font-bold text-zinc-900">01711-234567</span> and enter your TrxID below.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={trxId}
            onChange={(e) => setTrxId(e.target.value)}
            placeholder="e.g. 9B8A7C6D5E (or leave empty for test)"
            className="flex-1 px-3 py-2 text-sm border border-zinc-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30"
          />
          <button
            onClick={() => handleUpgrade()}
            disabled={upgrading}
            className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white px-5 py-2 rounded-xl text-sm font-bold transition whitespace-nowrap"
          >
            {upgrading ? "Verifying..." : `Verify & Upgrade to ${PLAN_CONFIG[selectedPlan].name}`}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

type TabId = "overview"|"orders"|"products"|"customers"|"analytics"|"coupons"|"dropship"|"settings"|"billing";

const NAV: { id: TabId; label: string; icon: React.ElementType; badge?: string; requiresMedium?: boolean }[] = [
  { id: "overview",   label: "Overview",   icon: LayoutDashboard },
  { id: "orders",     label: "Orders",     icon: ShoppingBag, badge: "7" },
  { id: "products",   label: "Products",   icon: Package },
  { id: "customers",  label: "Customers",  icon: Users },
  { id: "analytics",  label: "Analytics",  icon: BarChart3 },
  { id: "coupons",    label: "Coupons",    icon: Percent,  requiresMedium: true },
  { id: "dropship",   label: "Dropship",   icon: Layers,   requiresMedium: true },
  { id: "settings",   label: "Settings",   icon: Settings },
  { id: "billing",    label: "Billing",    icon: CreditCard },
];

export default function MerchantDashboard() {
  const params = useParams<{ tenant: string }>();
  const tenant = params?.tenant ?? "my-store";
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [overview, setOverview] = useState<StoreOverview | null>(null);
  const [plan, setPlan] = useState<PlanId>("free");

  useEffect(() => {
    fetch(`/api/stores/${tenant}`)
      .then(r => r.json())
      .then(d => { if (d.store?.plan) setPlan(d.store.plan as PlanId); })
      .catch(() => {});
    fetch(`/api/analytics?storeSlug=${tenant}`)
      .then(r => r.json())
      .then(d => setOverview(d.overview ?? null))
      .catch(() => {});
  }, [tenant]);

  const storeData = overview ?? seedOverview(tenant);

  const renderContent = () => {
    switch (activeTab) {
      case "overview":  return <OverviewTab data={storeData} plan={plan} />;
      case "orders":    return <OrdersTab tenant={tenant} />;
      case "products":  return <ProductsTab tenant={tenant} plan={plan} />;
      case "customers": return <CustomersTab tenant={tenant} />;
      case "analytics": return <AnalyticsTab plan={plan} />;
      case "coupons":   return <CouponsTab tenant={tenant} plan={plan} />;
      case "dropship":  return <DropshipTab tenant={tenant} plan={plan} />;
      case "settings":  return <SettingsTab tenant={tenant} plan={plan} />;
      case "billing":   return <BillingTab tenant={tenant} plan={plan} onPlanUpdate={(newPlan) => setPlan(newPlan)} />;
      default:          return null;
    }
  };

  const activeNav = NAV.find(n => n.id === activeTab);

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-56 bg-white border-r border-zinc-100 flex flex-col z-30 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="flex items-center gap-3 px-4 py-4 border-b border-zinc-50">
          <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center flex-shrink-0">
            <Store className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-black text-zinc-900 truncate">{storeData.name}</p>
            <p className="text-[10px] text-zinc-400">{tenant}.storeswift.app</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-zinc-400 hover:text-zinc-700 ml-auto"><X className="w-4 h-4" /></button>
        </div>

        <div className="px-4 py-2">
          <span className={`text-[11px] font-black px-2.5 py-1 rounded-full border ${PLAN_CONFIG[plan].badge}`}>{PLAN_CONFIG[plan].name} Plan</span>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
          {NAV.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isLocked = item.requiresMedium && plan === "free";
            return (
              <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? "bg-zinc-900 text-white" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"}`}>
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 flex-shrink-0" /><span>{item.label}</span>
                </div>
                {item.badge && <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${isActive ? "bg-white text-zinc-900" : "bg-amber-500 text-white"}`}>{item.badge}</span>}
                {isLocked && !isActive && <Zap className="w-3 h-3 text-amber-500 flex-shrink-0" />}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-zinc-50 p-3 space-y-1">
          <a href={`/store/${tenant}`} target="_blank" className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-zinc-600 hover:bg-zinc-50 transition group">
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" /> View Store
          </a>
          <a href="/logout" className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition">
            <LogOut className="w-4 h-4" /> Sign Out
          </a>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-zinc-100 flex items-center gap-3 px-4 sm:px-6 py-3.5">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-zinc-100 text-zinc-600 transition"><Menu className="w-5 h-5" /></button>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="font-semibold text-zinc-700">Dashboard</span>
            <ChevronRight className="w-3 h-3" />
            <span className="font-bold text-zinc-900">{activeNav?.label}</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button className="p-2 rounded-xl hover:bg-zinc-100 text-zinc-500 transition relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
            <a href={`/store/${tenant}`} target="_blank" className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-zinc-600 border border-zinc-200 rounded-xl px-3 py-2 hover:bg-zinc-50 transition">
              <ExternalLink className="w-3.5 h-3.5" /> Live Store
            </a>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
}
