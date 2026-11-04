"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  BarChart3,
  Settings,
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Truck,
  Printer,
  ExternalLink,
  Store,
  Plus,
  Eye,
  Trash2,
  ChevronRight,
  ArrowUpRight,
  Zap,
  Percent,
  Globe,
  CreditCard,
  Bell,
  Search,
  Filter,
  Download,
  RefreshCw,
  Package2,
  Star,
  MapPin,
  Phone,
  Mail,
  Calendar,
  ShieldCheck,
  Radio,
  Layers,
  Activity,
  Award,
  Target,
  Wallet,
  X,
  Check,
  ChevronDown,
  Menu,
  LogOut,
} from "lucide-react";
import { generateStoreSeedData } from "@/lib/seed-store";
import { generateConsignment, assessCustomerFraudRisk } from "@/lib/courier";

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const BDT = (n: number) => "৳" + n.toLocaleString("en-BD");

const PLAN_CONFIG = {
  free: {
    name: "Free",
    maxProducts: 50,
    commission: 8,
    customDomain: false,
    dropshipping: false,
    advancedAnalytics: false,
    badge: "bg-zinc-100 text-zinc-700 border-zinc-300",
  },
  medium: {
    name: "Medium",
    maxProducts: 500,
    commission: 3,
    customDomain: true,
    dropshipping: true,
    advancedAnalytics: false,
    badge: "bg-blue-50 text-blue-700 border-blue-200",
  },
  pro: {
    name: "Pro",
    maxProducts: Infinity,
    commission: 0,
    customDomain: true,
    dropshipping: true,
    advancedAnalytics: true,
    badge: "bg-violet-50 text-violet-700 border-violet-200",
  },
};

type PlanId = keyof typeof PLAN_CONFIG;

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

function getStoreData(tenant: string) {
  const STORE_MAP: Record<
    string,
    {
      name: string;
      plan: PlanId;
      categoryKey: string;
      domain?: string;
    }
  > = {
    "apex-fashion": { name: "Apex Fashion Hub", plan: "medium", categoryKey: "fashion", domain: "apexfashion.com.bd" },
    "luxe-glow-beauty": { name: "Luxe Glow Beauty", plan: "pro", categoryKey: "beauty_cosmetics", domain: "luxeglow.shop" },
    "craft-shoes": { name: "Craft Bench Shoes", plan: "free", categoryKey: "shoes" },
    "cyber-tech": { name: "CyberTech Audio", plan: "pro", categoryKey: "electronics", domain: "cybertech.com.bd" },
    "maison-jewelry": { name: "Maison Opulente", plan: "pro", categoryKey: "jewelry", domain: "maisonopulente.com" },
    "artisan-food": { name: "Artisan Pantry", plan: "free", categoryKey: "grocery_food" },
  };
  return STORE_MAP[tenant] || { name: tenant, plan: "free" as PlanId, categoryKey: "fashion" };
}

const ORDERS = [
  {
    id: "ord-1042",
    number: "#1042",
    customer: "Rania Sultana",
    phone: "+880 1711-234567",
    address: "House 14, Road 5, Dhanmondi, Dhaka",
    zone: "Inside Dhaka (Metro)",
    items: "Classic Cotton T-Shirt (M/Black) ×2",
    amount: 1800,
    payment: "bKash",
    payStatus: "Paid",
    status: "Shipped",
    consignment: "ST-892011",
    courier: "Steadfast",
    date: "Today, 10:45 AM",
  },
  {
    id: "ord-1041",
    number: "#1041",
    customer: "Farhan Ahmed",
    phone: "+880 1819-890123",
    address: "Flat 4B, Concord Tower, Gulshan-2, Dhaka",
    zone: "Inside Dhaka (Metro)",
    items: "Slim Denim Jacket (L) ×1",
    amount: 2200,
    payment: "COD",
    payStatus: "Pending",
    status: "Processing",
    consignment: "",
    courier: "",
    date: "Today, 09:30 AM",
  },
  {
    id: "ord-1040",
    number: "#1040",
    customer: "Tamim Khan",
    phone: "+880 1912-456789",
    address: "College Road, Nasirabad, Chattogram",
    zone: "Outside Dhaka",
    items: "Linen Trousers (32) ×1",
    amount: 1400,
    payment: "Nagad",
    payStatus: "Paid",
    status: "Delivered",
    consignment: "PTH-782910",
    courier: "Pathao",
    date: "Yesterday",
  },
  {
    id: "ord-1039",
    number: "#1039",
    customer: "Sadia Islam",
    phone: "+880 1614-112233",
    address: "Mirpur-10, Dhaka",
    zone: "Inside Dhaka (Metro)",
    items: "Floral Midi Dress ×1, Silk Scarf ×2",
    amount: 3200,
    payment: "bKash",
    payStatus: "Paid",
    status: "Delivered",
    consignment: "ST-780211",
    courier: "Steadfast",
    date: "2 days ago",
  },
  {
    id: "ord-1038",
    number: "#1038",
    customer: "Mahmudul Hasan",
    phone: "+880 1755-667788",
    address: "Shaheed Sarak, Khulna",
    zone: "Outside Dhaka",
    items: "Oxford Shirt (XL/White) ×3",
    amount: 4500,
    payment: "COD",
    payStatus: "Pending",
    status: "Returned",
    consignment: "ST-779102",
    courier: "Steadfast",
    date: "3 days ago",
  },
];

const CUSTOMERS = [
  { id: "c-1", name: "Rania Sultana", email: "rania@mail.com", phone: "+880 1711-234567", orders: 8, ltv: 14400, lastOrder: "Today", district: "Dhaka", loyal: true },
  { id: "c-2", name: "Farhan Ahmed", email: "farhan@mail.com", phone: "+880 1819-890123", orders: 3, ltv: 5800, lastOrder: "Today", district: "Dhaka", loyal: false },
  { id: "c-3", name: "Tamim Khan", email: "tamim@mail.com", phone: "+880 1912-456789", orders: 12, ltv: 21600, lastOrder: "Yesterday", district: "Chattogram", loyal: true },
  { id: "c-4", name: "Sadia Islam", email: "sadia@mail.com", phone: "+880 1614-112233", orders: 5, ltv: 9500, lastOrder: "2 days ago", district: "Dhaka", loyal: true },
  { id: "c-5", name: "Mahmudul Hasan", email: "mahmudul@mail.com", phone: "+880 1755-667788", orders: 2, ltv: 4500, lastOrder: "3 days ago", district: "Khulna", loyal: false },
];

const PLATFORM_DROPSHIP = [
  {
    id: "dp-1",
    title: "Premium Cotton Round-Neck T-Shirt",
    category: "Fashion",
    minPrice: 280,
    suggested: 450,
    stock: 2400,
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "dp-2",
    title: "Slim Fit Stretch Denim Jeans",
    category: "Fashion",
    minPrice: 680,
    suggested: 950,
    stock: 1850,
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "dp-3",
    title: "Wireless Noise-Cancelling Headphones",
    category: "Electronics",
    minPrice: 2200,
    suggested: 3200,
    stock: 420,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80",
  },
];

const MONTHLY_SALES = [
  { month: "Jun", revenue: 28000, orders: 32 },
  { month: "Jul", revenue: 42000, orders: 48 },
  { month: "Aug", revenue: 38000, orders: 41 },
  { month: "Sep", revenue: 61000, orders: 72 },
  { month: "Oct", revenue: 84000, orders: 98 },
  { month: "Nov", revenue: 52000, orders: 62 },
];

// ─── SIDEBAR NAV ──────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "orders", label: "Orders", icon: ShoppingBag, badge: 2 },
  { id: "products", label: "Products", icon: Package },
  { id: "customers", label: "Customers", icon: Users },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "dropship", label: "Dropship Hub", icon: Percent },
  { id: "settings", label: "Settings", icon: Settings },
];

// ─── TAB COMPONENTS ──────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  iconBg,
  trend,
  trendLabel,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.FC<{ className?: string }>;
  iconBg: string;
  trend?: "up" | "down";
  trendLabel?: string;
}) {
  return (
    <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">{label}</p>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-2xl font-black text-zinc-900 tracking-tight">{value}</p>
      {sub && <p className="text-xs text-zinc-500 mt-1">{sub}</p>}
      {trendLabel && (
        <div className={`mt-2 text-xs font-semibold flex items-center gap-1 ${trend === "up" ? "text-emerald-600" : "text-red-500"}`}>
          {trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {trendLabel}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Shipped: "bg-blue-50 text-blue-700 border-blue-200",
    Processing: "bg-amber-50 text-amber-700 border-amber-200",
    Returned: "bg-red-50 text-red-700 border-red-200",
    Pending: "bg-zinc-100 text-zinc-600 border-zinc-200",
    Unfulfilled: "bg-zinc-100 text-zinc-600 border-zinc-200",
  };
  return (
    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${colors[status] || colors.Pending}`}>
      {status}
    </span>
  );
}

function OverviewTab({ planId, storeName }: { planId: PlanId; storeName: string }) {
  const plan = PLAN_CONFIG[planId];
  const todayRevenue = ORDERS.filter((o) => o.date.includes("Today")).reduce((a, o) => a + o.amount, 0);
  const pendingOrders = ORDERS.filter((o) => o.status === "Processing" || o.status === "Unfulfilled").length;

  return (
    <div className="space-y-6">
      {/* Plan banner for free users */}
      {planId === "free" && (
        <div className="bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-black text-base">Upgrade to unlock more features</p>
            <p className="text-sm opacity-90 mt-0.5">
              You're on Free Plan · {plan.commission}% commission taken per sale · No custom domain
            </p>
          </div>
          <Link
            href="#settings"
            className="flex-shrink-0 bg-white text-violet-700 font-bold text-sm px-5 py-2 rounded-xl hover:bg-violet-50 transition"
          >
            Upgrade Now →
          </Link>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Today's Revenue"
          value={BDT(todayRevenue)}
          sub={`${ORDERS.filter((o) => o.date.includes("Today")).length} orders today`}
          icon={DollarSign}
          iconBg="bg-emerald-50 text-emerald-600"
          trend="up"
          trendLabel="+18% vs yesterday"
        />
        <StatCard
          label="Pending Orders"
          value={String(pendingOrders)}
          sub="Need your attention"
          icon={Clock}
          iconBg="bg-amber-50 text-amber-600"
        />
        <StatCard
          label="Total Products"
          value="42"
          sub={planId === "free" ? `${plan.maxProducts - 42} slots remaining` : "Unlimited catalog"}
          icon={Package}
          iconBg="bg-zinc-100 text-zinc-600"
        />
        <StatCard
          label="Customers"
          value={String(CUSTOMERS.length)}
          sub={`${CUSTOMERS.filter((c) => c.loyal).length} loyal (3+ orders)`}
          icon={Users}
          iconBg="bg-blue-50 text-blue-600"
        />
      </div>

      {/* Sales Chart + Low Stock */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sales Trend */}
        <div className="lg:col-span-2 bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-zinc-900">Revenue Trend</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Last 6 months</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              +38% MoM
            </span>
          </div>
          <div className="flex items-end gap-2 h-24">
            {MONTHLY_SALES.map((d) => {
              const max = Math.max(...MONTHLY_SALES.map((x) => x.revenue));
              return (
                <div key={d.month} className="flex flex-col items-center flex-1 gap-1">
                  <div className="text-[9px] text-zinc-500 font-medium">{BDT(d.revenue / 1000)}k</div>
                  <div
                    className="w-full rounded-t bg-zinc-900 hover:bg-zinc-700 transition cursor-pointer"
                    style={{ height: `${(d.revenue / max) * 72}px` }}
                    title={BDT(d.revenue)}
                  />
                  <span className="text-[9px] text-zinc-400">{d.month}</span>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-3 gap-4 mt-5 pt-4 border-t border-zinc-100 text-xs">
            <div>
              <p className="text-zinc-500">Total Revenue</p>
              <p className="font-black text-zinc-900">{BDT(MONTHLY_SALES.reduce((a, d) => a + d.revenue, 0))}</p>
            </div>
            <div>
              <p className="text-zinc-500">Total Orders</p>
              <p className="font-black text-zinc-900">{MONTHLY_SALES.reduce((a, d) => a + d.orders, 0)}</p>
            </div>
            <div>
              <p className="text-zinc-500">Avg. Order Value</p>
              <p className="font-black text-zinc-900">
                {BDT(Math.round(MONTHLY_SALES.reduce((a, d) => a + d.revenue, 0) / MONTHLY_SALES.reduce((a, d) => a + d.orders, 0)))}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Info */}
        <div className="space-y-4">
          {/* Plan info */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-sm">
            <h4 className="font-bold text-zinc-900 mb-3 text-sm">Your Plan</h4>
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${plan.badge}`}>
                {plan.name}
              </span>
              {planId === "pro" && <Award className="w-4 h-4 text-violet-500" />}
            </div>
            <div className="space-y-2 text-xs">
              {[
                { label: "Products", value: planId === "free" ? "50 max" : planId === "medium" ? "500 max" : "Unlimited" },
                { label: "Commission", value: `${plan.commission}% per sale` },
                { label: "Custom Domain", value: plan.customDomain ? "✓ Enabled" : "✗ Upgrade needed" },
                { label: "Dropshipping", value: plan.dropshipping ? "✓ Available" : "✗ Medium+ required" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-zinc-500">{item.label}</span>
                  <span className={`font-semibold ${item.value.startsWith("✓") ? "text-emerald-600" : item.value.startsWith("✗") ? "text-red-500" : "text-zinc-900"}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Store status */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-sm">
            <h4 className="font-bold text-zinc-900 mb-3 text-sm">Store Status</h4>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-emerald-700">Online & Accepting Orders</span>
            </div>
            <div className="text-xs space-y-1.5 text-zinc-500">
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5" />
                <a href="#" className="text-blue-600 hover:underline">your-store.storeswift.app</a>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>SSL Certificate Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <h3 className="font-bold text-zinc-900">Recent Orders</h3>
          <button className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 flex items-center gap-1">
            View All <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="divide-y divide-zinc-50">
          {ORDERS.slice(0, 4).map((o) => (
            <div key={o.id} className="flex items-center justify-between px-6 py-3.5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-700 text-xs font-bold flex items-center justify-center">
                  {o.customer.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p className="font-semibold text-zinc-900 text-sm">{o.customer}</p>
                  <p className="text-xs text-zinc-400">{o.items.slice(0, 30)}…</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-right">
                <div>
                  <p className="font-bold text-zinc-900 text-sm">{BDT(o.amount)}</p>
                  <p className="text-xs text-zinc-400">{o.date}</p>
                </div>
                <StatusBadge status={o.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OrdersTab({ planId }: { planId: PlanId }) {
  const [orders, setOrders] = useState(ORDERS);
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const handleDispatch = (ordId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === ordId
          ? { ...o, status: "Shipped", consignment: `ST-${Math.floor(Math.random() * 999999)}`, courier: "Steadfast" }
          : o
      )
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Order Management</h2>
          <p className="text-xs text-zinc-500 mt-0.5">1-click courier dispatch, anti-fraud scoring, label printing</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-zinc-100 text-zinc-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-zinc-200 transition">
          <Download className="w-3.5 h-3.5" /> Export
        </button>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {["all", "Processing", "Shipped", "Delivered", "Returned"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filter === s
                ? "bg-zinc-900 text-white"
                : "bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-400"
            }`}
          >
            {s === "all" ? "All Orders" : s}
            {s === "Processing" && (
              <span className="ml-1.5 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {orders.filter((o) => o.status === "Processing").length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-100">
              <tr>
                <th className="text-left px-5 py-3.5 font-bold uppercase tracking-wider text-zinc-500">Order</th>
                <th className="text-left px-5 py-3.5 font-bold uppercase tracking-wider text-zinc-500">Customer & RTO</th>
                <th className="text-left px-5 py-3.5 font-bold uppercase tracking-wider text-zinc-500">Items</th>
                <th className="text-left px-5 py-3.5 font-bold uppercase tracking-wider text-zinc-500">Amount</th>
                <th className="text-left px-5 py-3.5 font-bold uppercase tracking-wider text-zinc-500">Payment</th>
                <th className="text-left px-5 py-3.5 font-bold uppercase tracking-wider text-zinc-500">Courier</th>
                <th className="text-left px-5 py-3.5 font-bold uppercase tracking-wider text-zinc-500">Status</th>
                <th className="text-right px-5 py-3.5 font-bold uppercase tracking-wider text-zinc-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filtered.map((o) => {
                const risk = assessCustomerFraudRisk(o.phone);
                return (
                  <tr key={o.id} className="hover:bg-zinc-50/50 transition">
                    <td className="px-5 py-4">
                      <p className="font-mono font-bold text-zinc-900">{o.number}</p>
                      <p className="text-zinc-400 mt-0.5">{o.date}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-zinc-900">{o.customer}</p>
                      <p className="text-zinc-400 font-mono">{o.phone}</p>
                      <span className={`mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block ${risk.badgeClass}`}>
                        {risk.level === "VERIFIED_SAFE" ? `✓ Safe (${risk.deliveryRatePercent}%)` : risk.level === "MODERATE_RISK" ? `⚠ Verify (${risk.deliveryRatePercent}%)` : `✗ High RTO (${risk.deliveryRatePercent}%)`}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-zinc-600 max-w-[180px]">
                      <p className="truncate">{o.items}</p>
                      <p className="text-zinc-400">{o.zone}</p>
                    </td>
                    <td className="px-5 py-4 font-bold text-zinc-900">{BDT(o.amount)}</td>
                    <td className="px-5 py-4">
                      <p className="text-zinc-700">{o.payment}</p>
                      <span className={`text-[10px] font-bold ${o.payStatus === "Paid" ? "text-emerald-600" : "text-amber-600"}`}>
                        {o.payStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {o.consignment ? (
                        <div>
                          <p className="font-mono text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded inline-block border border-blue-100">
                            {o.consignment}
                          </p>
                          <p className="text-zinc-400 mt-0.5">{o.courier}</p>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleDispatch(o.id)}
                          className="inline-flex items-center gap-1.5 bg-zinc-900 text-white px-2.5 py-1.5 rounded-lg text-[11px] font-bold hover:bg-zinc-800 transition"
                        >
                          <Zap className="w-3 h-3 text-amber-400" />
                          Dispatch
                        </button>
                      )}
                    </td>
                    <td className="px-5 py-4"><StatusBadge status={o.status} /></td>
                    <td className="px-5 py-4 text-right">
                      <button className="inline-flex items-center gap-1 text-zinc-500 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition">
                        <Printer className="w-3.5 h-3.5" /> Label
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ProductsTab({ planId, tenant }: { planId: PlanId; tenant: string }) {
  const plan = PLAN_CONFIG[planId];
  const seedData = generateStoreSeedData(tenant, "fashion");
  const [products, setProducts] = useState(
    seedData.products.map((p, i) => ({
      id: `p-${i}`,
      title: p.title,
      price: p.basePrice,
      stock: 20 + Math.floor(Math.random() * 30),
      imageUrl: p.imageUrl,
      status: "Active" as "Active" | "Draft",
    }))
  );

  const atLimit = planId === "free" && products.length >= plan.maxProducts;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Product Catalog</h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            {products.length} / {plan.maxProducts === Infinity ? "∞" : plan.maxProducts} products
          </p>
        </div>
        {atLimit ? (
          <div className="flex items-center gap-3">
            <span className="text-xs text-amber-600 font-semibold bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
              Product limit reached — Upgrade to add more
            </span>
          </div>
        ) : (
          <button className="inline-flex items-center gap-2 bg-zinc-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-zinc-800 transition">
            <Plus className="w-3.5 h-3.5" /> Add Product
          </button>
        )}
      </div>

      {/* Product limit progress */}
      {planId !== "pro" && (
        <div className="bg-white border border-zinc-200/80 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-zinc-700">Product Slots Used</span>
            <span className="text-zinc-500">{products.length} / {plan.maxProducts}</span>
          </div>
          <div className="h-2 bg-zinc-100 rounded-full">
            <div
              className={`h-full rounded-full transition-all ${atLimit ? "bg-red-500" : products.length / plan.maxProducts > 0.8 ? "bg-amber-500" : "bg-emerald-500"}`}
              style={{ width: `${Math.min(100, (products.length / plan.maxProducts) * 100)}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((p) => (
          <div key={p.id} className="bg-white border border-zinc-200/80 rounded-2xl shadow-sm overflow-hidden group">
            <div className="aspect-square bg-zinc-100 overflow-hidden relative">
              <img
                src={p.imageUrl}
                alt={p.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&auto=format&fit=crop&q=80";
                }}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button className="p-2 bg-white rounded-lg text-zinc-900 hover:bg-zinc-100 transition">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 bg-white rounded-lg text-zinc-900 hover:bg-zinc-100 transition">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
            <div className="p-3">
              <p className="font-semibold text-zinc-900 text-sm leading-tight truncate">{p.title}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="font-bold text-zinc-900">{p.price}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${p.stock < 10 ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>
                  {p.stock} in stock
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CustomersTab({ planId }: { planId: PlanId }) {
  const plan = PLAN_CONFIG[planId];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-zinc-900">Customer Database</h2>
        <p className="text-xs text-zinc-500 mt-0.5">All customers who have ordered from your store</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total Customers" value={String(CUSTOMERS.length)} icon={Users} iconBg="bg-blue-50 text-blue-600" />
        <StatCard label="Repeat Customers" value={String(CUSTOMERS.filter((c) => c.loyal).length)} sub="3+ orders" icon={Star} iconBg="bg-amber-50 text-amber-600" />
        <StatCard label="Avg. Lifetime Value" value={BDT(Math.round(CUSTOMERS.reduce((a, c) => a + c.ltv, 0) / CUSTOMERS.length))} icon={Wallet} iconBg="bg-emerald-50 text-emerald-600" />
        <StatCard label="New This Month" value="3" icon={TrendingUp} iconBg="bg-violet-50 text-violet-600" trend="up" trendLabel="+50% vs last month" />
      </div>

      {/* Customer table */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-100">
              <tr>
                <th className="text-left px-5 py-3.5 font-bold uppercase tracking-wider text-zinc-500">Customer</th>
                <th className="text-left px-5 py-3.5 font-bold uppercase tracking-wider text-zinc-500">Contact</th>
                <th className="text-left px-5 py-3.5 font-bold uppercase tracking-wider text-zinc-500">Orders</th>
                <th className="text-left px-5 py-3.5 font-bold uppercase tracking-wider text-zinc-500">Lifetime Value</th>
                <th className="text-left px-5 py-3.5 font-bold uppercase tracking-wider text-zinc-500">District</th>
                <th className="text-left px-5 py-3.5 font-bold uppercase tracking-wider text-zinc-500">Last Order</th>
                <th className="text-left px-5 py-3.5 font-bold uppercase tracking-wider text-zinc-500">Segment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {CUSTOMERS.map((c) => (
                <tr key={c.id} className="hover:bg-zinc-50/50 transition">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <span className="font-semibold text-zinc-900">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-zinc-500"><Phone className="w-3 h-3" />{c.phone}</div>
                    <div className="flex items-center gap-1.5 text-zinc-400 mt-0.5"><Mail className="w-3 h-3" />{c.email}</div>
                  </td>
                  <td className="px-5 py-4 font-bold text-zinc-900">{c.orders}</td>
                  <td className="px-5 py-4 font-bold text-emerald-700">{BDT(c.ltv)}</td>
                  <td className="px-5 py-4">
                    <span className="flex items-center gap-1 text-zinc-600">
                      <MapPin className="w-3 h-3" />{c.district}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-zinc-400">{c.lastOrder}</td>
                  <td className="px-5 py-4">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${c.loyal ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-zinc-100 text-zinc-600 border-zinc-200"}`}>
                      {c.loyal ? "⭐ Loyal" : "New"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AnalyticsTab({ planId }: { planId: PlanId }) {
  const plan = PLAN_CONFIG[planId];

  if (!plan.advancedAnalytics && planId !== "medium") {
    return (
      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Analytics</h2>
          <p className="text-xs text-zinc-500 mt-0.5">Business intelligence for your store</p>
        </div>

        {/* Basic analytics for free/medium */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Monthly Revenue" value={BDT(84000)} icon={DollarSign} iconBg="bg-emerald-50 text-emerald-600" trend="up" trendLabel="+38% vs last month" />
          <StatCard label="Monthly Orders" value="98" icon={ShoppingBag} iconBg="bg-blue-50 text-blue-600" trend="up" trendLabel="+22% vs last month" />
          <StatCard label="Avg. Order Value" value={BDT(857)} icon={Target} iconBg="bg-amber-50 text-amber-600" />
          <StatCard label="Return Rate" value="4.8%" icon={RefreshCw} iconBg="bg-red-50 text-red-600" />
        </div>

        {/* Upsell for pro BI */}
        {planId === "free" && (
          <div className="bg-gradient-to-br from-violet-50 to-blue-50 border border-violet-200 rounded-2xl p-6 text-center">
            <BarChart3 className="w-10 h-10 text-violet-400 mx-auto mb-3" />
            <h3 className="font-bold text-violet-900 mb-1">Unlock Advanced Business Intelligence</h3>
            <p className="text-sm text-violet-700 mb-4">Customer LTV heatmaps, geographic sales breakdown, cohort analysis, and revenue forecasting</p>
            <button className="bg-violet-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-violet-500 transition">
              Upgrade to Pro → ৳999/month
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900">Advanced Analytics & BI</h2>
        <p className="text-xs text-zinc-500 mt-0.5">Full business intelligence dashboard</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Monthly Revenue" value={BDT(84000)} icon={DollarSign} iconBg="bg-emerald-50 text-emerald-600" trend="up" trendLabel="+38% MoM" />
        <StatCard label="Conversion Rate" value="3.2%" icon={Target} iconBg="bg-blue-50 text-blue-600" trend="up" trendLabel="+0.4pp" />
        <StatCard label="Repeat Customer Rate" value="42%" icon={Users} iconBg="bg-violet-50 text-violet-600" trend="up" trendLabel="+8% MoM" />
        <StatCard label="Return on Ad Spend" value="4.8×" icon={Award} iconBg="bg-amber-50 text-amber-600" />
      </div>

      {/* Heatmap placeholder */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-zinc-900 mb-4">Sales by Category</h3>
          <div className="space-y-3">
            {[
              { cat: "Tops & T-Shirts", pct: 38 },
              { cat: "Bottoms & Denim", pct: 27 },
              { cat: "Dresses", pct: 18 },
              { cat: "Outerwear", pct: 11 },
              { cat: "Accessories", pct: 6 },
            ].map((item) => (
              <div key={item.cat}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-700">{item.cat}</span>
                  <span className="font-bold text-zinc-900">{item.pct}%</span>
                </div>
                <div className="h-2 bg-zinc-100 rounded-full">
                  <div className="h-full rounded-full bg-zinc-900" style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-zinc-900 mb-4">Customer Segments</h3>
          <div className="space-y-3 text-xs">
            {[
              { segment: "Champions (5+ orders, high spend)", count: 2, color: "bg-emerald-500" },
              { segment: "Loyal Customers (3-4 orders)", count: 2, color: "bg-blue-500" },
              { segment: "At Risk (no order 60+ days)", count: 0, color: "bg-amber-500" },
              { segment: "New Customers (1 order)", count: 1, color: "bg-zinc-300" },
            ].map((seg) => (
              <div key={seg.segment} className="flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${seg.color}`} />
                <span className="flex-1 text-zinc-700">{seg.segment}</span>
                <span className="font-bold text-zinc-900">{seg.count}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-zinc-100 space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-zinc-500">Average LTV</span><span className="font-bold text-zinc-900">{BDT(Math.round(CUSTOMERS.reduce((a, c) => a + c.ltv, 0) / CUSTOMERS.length))}</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">Highest LTV</span><span className="font-bold text-emerald-700">{BDT(Math.max(...CUSTOMERS.map((c) => c.ltv)))}</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">Predicted Churn Risk</span><span className="font-bold text-amber-600">Low (4.2%)</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DropshipTab({ planId }: { planId: PlanId }) {
  const plan = PLAN_CONFIG[planId];
  const [imported, setImported] = useState<string[]>([]);
  const [prices, setPrices] = useState<Record<string, number>>(
    Object.fromEntries(PLATFORM_DROPSHIP.map((p) => [p.id, p.suggested]))
  );

  if (!plan.dropshipping) {
    return (
      <div className="space-y-5">
        <h2 className="text-xl font-bold text-zinc-900">Dropship Hub</h2>
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 text-white rounded-2xl p-8 text-center">
          <Percent className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
          <h3 className="text-xl font-black mb-2">Dropshipping Available on Medium & Pro</h3>
          <p className="text-zinc-400 mb-6 max-w-md mx-auto">
            List StoreSwift platform products on your store at your chosen price. Earn the margin — we handle fulfilment.
          </p>
          <button className="bg-white text-zinc-900 font-bold px-6 py-3 rounded-xl hover:bg-zinc-100 transition">
            Upgrade to Medium — ৳499/month
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-zinc-900">Dropship Hub</h2>
        <p className="text-xs text-zinc-500 mt-0.5">
          Browse platform products, set your sell price (must be ≥ minimum), and list to your store. Earn the markup.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-700">
        <strong>How it works:</strong> You set your selling price above the minimum. When a customer orders, we ship it. You keep the margin.
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {PLATFORM_DROPSHIP.map((p) => {
          const isImported = imported.includes(p.id);
          const myPrice = prices[p.id] || p.suggested;
          const margin = myPrice - p.minPrice;
          return (
            <div key={p.id} className="bg-white border border-zinc-200/80 rounded-2xl shadow-sm overflow-hidden">
              <div className="aspect-[4/3] bg-zinc-100 overflow-hidden">
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&auto=format&fit=crop&q=80";
                  }}
                />
              </div>
              <div className="p-4">
                <h4 className="font-bold text-zinc-900 text-sm mb-1 leading-tight">{p.title}</h4>
                <p className="text-xs text-zinc-500 mb-3">{p.category} · {p.stock.toLocaleString()} in stock</p>
                <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                  <div className="bg-zinc-50 rounded-lg p-2">
                    <p className="text-zinc-500">Min. Price</p>
                    <p className="font-bold text-zinc-900">{BDT(p.minPrice)}</p>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-2">
                    <p className="text-emerald-700">Your Margin</p>
                    <p className="font-bold text-emerald-700">+{BDT(margin)}</p>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="text-xs font-semibold text-zinc-600 mb-1 block">Your Sell Price (৳)</label>
                  <input
                    type="number"
                    min={p.minPrice}
                    value={myPrice}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || p.minPrice;
                      setPrices((prev) => ({ ...prev, [p.id]: Math.max(val, p.minPrice) }));
                    }}
                    className="w-full border border-zinc-200 rounded-lg px-3 py-1.5 text-sm text-zinc-900 outline-none focus:border-zinc-400"
                  />
                </div>
                <button
                  onClick={() => setImported((prev) => (isImported ? prev.filter((x) => x !== p.id) : [...prev, p.id]))}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition ${
                    isImported
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-zinc-900 text-white hover:bg-zinc-800"
                  }`}
                >
                  {isImported ? "✓ Listed on My Store" : "List on My Store"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SettingsTab({ tenant, planId }: { tenant: string; planId: PlanId }) {
  const plan = PLAN_CONFIG[planId];
  const [storeName, setStoreName] = useState("Apex Fashion Hub");
  const [email, setEmail] = useState("hello@apexfashion.com.bd");
  const [phone, setPhone] = useState("+880 1711-234567");
  const [domain, setDomain] = useState("apexfashion.com.bd");
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h2 className="text-xl font-bold text-zinc-900">Store Settings</h2>
        <p className="text-xs text-zinc-500 mt-0.5">Manage your storefront configuration</p>
      </div>

      <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-zinc-900 border-b border-zinc-100 pb-3">General Information</h3>
        {[
          { label: "Store Name", value: storeName, onChange: setStoreName },
          { label: "Contact Email", value: email, onChange: setEmail },
          { label: "Contact Phone", value: phone, onChange: setPhone },
        ].map(({ label, value, onChange }) => (
          <div key={label}>
            <label className="block text-xs font-semibold text-zinc-600 mb-1">{label}</label>
            <input
              className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400"
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-zinc-900 border-b border-zinc-100 pb-3">Domain & Subdomain</h3>
        <div>
          <label className="block text-xs font-semibold text-zinc-600 mb-1">Subdomain (free)</label>
          <div className="flex items-center border border-zinc-200 rounded-xl overflow-hidden">
            <input
              className="flex-1 px-3 py-2 text-sm text-zinc-900 outline-none"
              value={tenant}
              readOnly
            />
            <span className="bg-zinc-50 text-zinc-500 text-xs px-3 py-2 border-l border-zinc-200">.storeswift.app</span>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-600 mb-1">
            Custom Domain {!plan.customDomain && <span className="text-amber-600">(Medium+ required)</span>}
          </label>
          <input
            className={`w-full border rounded-xl px-3 py-2 text-sm outline-none ${
              plan.customDomain
                ? "border-zinc-200 text-zinc-900 focus:border-zinc-400"
                : "border-zinc-200 text-zinc-400 bg-zinc-50 cursor-not-allowed"
            }`}
            value={domain}
            onChange={(e) => plan.customDomain && setDomain(e.target.value)}
            readOnly={!plan.customDomain}
            placeholder="yourdomain.com"
          />
          {!plan.customDomain && (
            <p className="text-xs text-amber-600 mt-1">Upgrade to Medium plan to connect a custom domain.</p>
          )}
        </div>
      </div>

      <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-zinc-900 border-b border-zinc-100 pb-3 mb-4">Current Subscription</h3>
        <div className={`flex items-center gap-2 mb-4`}>
          <span className={`text-sm font-bold px-3 py-1 rounded-full border ${plan.badge}`}>{plan.name} Plan</span>
          {planId !== "free" && (
            <span className="text-xs text-zinc-500">
              {planId === "medium" ? "৳499" : "৳999"}/month
            </span>
          )}
        </div>
        {planId !== "pro" && (
          <div className="space-y-2">
            {planId === "free" && (
              <button className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-blue-500 transition">
                Upgrade to Medium — ৳499/month
              </button>
            )}
            <button className="w-full bg-violet-600 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-violet-500 transition">
              Upgrade to Pro — ৳999/month
            </button>
          </div>
        )}
        {planId === "pro" && (
          <p className="text-sm text-emerald-700 font-semibold">✓ You're on the highest plan. All features unlocked.</p>
        )}
      </div>

      <button
        onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500); }}
        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition ${saved ? "bg-emerald-600 text-white" : "bg-zinc-900 text-white hover:bg-zinc-800"}`}
      >
        {saved ? "✓ Saved" : "Save Changes"}
      </button>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function TenantDashboardPage() {
  const params = useParams();
  const tenant = typeof params.tenant === "string" ? params.tenant : "apex-fashion";
  const storeData = getStoreData(tenant);
  const planId = storeData.plan;
  const plan = PLAN_CONFIG[planId];

  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const TAB_MAP: Record<string, React.FC<any>> = {
    overview: OverviewTab,
    orders: OrdersTab,
    products: ProductsTab,
    customers: CustomersTab,
    analytics: AnalyticsTab,
    dropship: DropshipTab,
    settings: SettingsTab,
  };

  const ActiveComponent = TAB_MAP[activeTab] || OverviewTab;
  const activeNav = NAV_ITEMS.find((n) => n.id === activeTab);

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200/80 h-14 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition"
          >
            <Menu className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-zinc-900 flex items-center justify-center">
              <Store className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="font-black text-zinc-900 text-sm">{storeData.name}</span>
              <span className="ml-2 text-[11px] font-mono text-zinc-400">{tenant}.storeswift.app</span>
            </div>
          </div>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border hidden sm:inline ${plan.badge}`}>
            {plan.name}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/store/${tenant}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-zinc-100 text-zinc-700 hover:bg-zinc-200 px-3 py-1.5 rounded-xl transition"
          >
            <ExternalLink className="w-3.5 h-3.5" /> View Store
          </Link>
          <Link
            href="/super-admin"
            className="text-xs font-semibold text-zinc-400 hover:text-zinc-700 transition hidden sm:inline"
          >
            Platform Admin
          </Link>
          <div className="w-7 h-7 rounded-full bg-zinc-900 text-white text-xs font-bold flex items-center justify-center">
            {storeData.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`bg-white border-r border-zinc-200/80 flex-shrink-0 transition-all duration-200 overflow-hidden ${
            sidebarOpen ? "w-52" : "w-0"
          }`}
        >
          <nav className="py-4 px-2 space-y-0.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-sm font-medium transition ${
                    isActive
                      ? "bg-zinc-900 text-white"
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${isActive ? "bg-white text-zinc-900" : "bg-amber-500 text-white"}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sidebar footer */}
          <div className="absolute bottom-0 w-52 p-3 border-t border-zinc-100">
            <div className="px-3 py-2 rounded-xl bg-zinc-50">
              <p className="text-xs font-bold text-zinc-900 truncate">{storeData.name}</p>
              <p className="text-[10px] text-zinc-400 truncate">{tenant}.storeswift.app</p>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-6 pt-5">
            <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
              <span>Dashboard</span>
              <ChevronRight className="w-3 h-3" />
              <span className="font-semibold text-zinc-700">{activeNav?.label}</span>
            </div>
          </div>
          <div className="p-6">
            <ActiveComponent planId={planId} tenant={tenant} storeName={storeData.name} />
          </div>
        </main>
      </div>
    </div>
  );
}

