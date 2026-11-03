"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Building2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Users,
  Search,
  CheckCircle2,
  Ban,
  ExternalLink,
  Store,
  Layers,
  Sparkles,
  LayoutDashboard,
  Package,
  CreditCard,
  BarChart3,
  Percent,
  Globe,
  Settings,
  Bell,
  ChevronRight,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Clock,
  Wallet,
  PieChart,
  Activity,
  Tag,
  Truck,
  RefreshCw,
  Download,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Copy,
  CheckCheck,
  X,
  Info,
  Zap,
  Award,
  Target,
  MapPin,
  Calendar,
  HelpCircle,
  LogOut,
  ChevronUp,
} from "lucide-react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    color: "zinc",
    badge: "bg-zinc-100 text-zinc-700 border-zinc-300",
    limit: "50 products, commission per sale",
    commission: 8,
  },
  {
    id: "medium",
    name: "Medium",
    price: 499,
    color: "blue",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    limit: "500 products, 3% commission",
    commission: 3,
  },
  {
    id: "pro",
    name: "Pro",
    price: 999,
    color: "violet",
    badge: "bg-violet-50 text-violet-700 border-violet-200",
    limit: "Unlimited, 0% commission",
    commission: 0,
  },
];

const MERCHANTS = [
  {
    id: "m-1",
    name: "Apex Fashion Hub",
    slug: "apex-fashion",
    ownerName: "Sarah Ahmed",
    ownerEmail: "sarah@apexfashion.com",
    phone: "+880 1711-234567",
    category: "Fashion & Apparel",
    categoryKey: "fashion",
    plan: "medium",
    productsCount: 42,
    ordersCount: 158,
    gmv: 284500,
    commissionOwed: 8535,
    status: "Active",
    joinedAt: "Oct 12, 2026",
    lastOrder: "2 hrs ago",
    district: "Dhaka",
    customDomain: "apexfashion.com.bd",
  },
  {
    id: "m-2",
    name: "Luxe Glow Beauty",
    slug: "luxe-glow-beauty",
    ownerName: "Nadia Islam",
    ownerEmail: "nadia@luxeglow.com",
    phone: "+880 1819-890123",
    category: "Beauty & Skincare",
    categoryKey: "beauty_cosmetics",
    plan: "pro",
    productsCount: 86,
    ordersCount: 284,
    gmv: 512000,
    commissionOwed: 0,
    status: "Active",
    joinedAt: "Sep 28, 2026",
    lastOrder: "45 min ago",
    district: "Chittagong",
    customDomain: "luxeglow.shop",
  },
  {
    id: "m-3",
    name: "Craft Bench Shoes",
    slug: "craft-shoes",
    ownerName: "Tariq Rahman",
    ownerEmail: "tariq@craftshoes.com",
    phone: "+880 1912-456789",
    category: "Footwear & Leather",
    categoryKey: "shoes",
    plan: "free",
    productsCount: 24,
    ordersCount: 92,
    gmv: 138000,
    commissionOwed: 11040,
    status: "Active",
    joinedAt: "Oct 19, 2026",
    lastOrder: "3 hrs ago",
    district: "Sylhet",
    customDomain: null,
  },
  {
    id: "m-4",
    name: "CyberTech Audio",
    slug: "cyber-tech",
    ownerName: "Alex Hassan",
    ownerEmail: "alex@cybertech.io",
    phone: "+880 1614-112233",
    category: "Consumer Tech & Audio",
    categoryKey: "electronics",
    plan: "pro",
    productsCount: 152,
    ordersCount: 340,
    gmv: 920000,
    commissionOwed: 0,
    status: "Active",
    joinedAt: "Oct 05, 2026",
    lastOrder: "12 min ago",
    district: "Dhaka",
    customDomain: "cybertech.com.bd",
  },
  {
    id: "m-5",
    name: "Maison Opulente",
    slug: "maison-jewelry",
    ownerName: "Elena Haque",
    ownerEmail: "elena@maisonopulente.com",
    phone: "+880 1722-334455",
    category: "Fine Jewelry & Watches",
    categoryKey: "jewelry",
    plan: "pro",
    productsCount: 64,
    ordersCount: 118,
    gmv: 680000,
    commissionOwed: 0,
    status: "Active",
    joinedAt: "Aug 15, 2026",
    lastOrder: "1 day ago",
    district: "Dhaka",
    customDomain: "maisonopulente.com",
  },
  {
    id: "m-6",
    name: "Artisan Pantry",
    slug: "artisan-food",
    ownerName: "Rohim Mia",
    ownerEmail: "rohim@artisanpantry.com",
    phone: "+880 1813-556677",
    category: "Gourmet Food & Coffee",
    categoryKey: "grocery_food",
    plan: "free",
    productsCount: 18,
    ordersCount: 45,
    gmv: 54000,
    commissionOwed: 4320,
    status: "Active",
    joinedAt: "Oct 27, 2026",
    lastOrder: "6 hrs ago",
    district: "Rajshahi",
    customDomain: null,
  },
  {
    id: "m-7",
    name: "Trendy Threads BD",
    slug: "trendy-threads",
    ownerName: "Mitu Akter",
    ownerEmail: "mitu@trendythreads.com",
    phone: "+880 1733-998877",
    category: "Fashion & Apparel",
    categoryKey: "fashion",
    plan: "medium",
    productsCount: 37,
    ordersCount: 201,
    gmv: 320000,
    commissionOwed: 9600,
    status: "Suspended",
    joinedAt: "Sep 10, 2026",
    lastOrder: "3 days ago",
    district: "Dhaka",
    customDomain: "trendythreads.com.bd",
  },
];

const PLATFORM_PRODUCTS = [
  {
    id: "pp-1",
    title: "Premium Cotton Round-Neck T-Shirt",
    category: "Fashion",
    minimumPrice: 280,
    suggestedPrice: 450,
    stock: 2400,
    listedBy: 3,
    imageUrl:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&auto=format&fit=crop&q=80",
    status: "Active",
  },
  {
    id: "pp-2",
    title: "Slim Fit Stretch Denim Jeans",
    category: "Fashion",
    minimumPrice: 680,
    suggestedPrice: 950,
    stock: 1850,
    listedBy: 5,
    imageUrl:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&auto=format&fit=crop&q=80",
    status: "Active",
  },
  {
    id: "pp-3",
    title: "Multi-Vitamin Glow Serum 30ml",
    category: "Beauty",
    minimumPrice: 350,
    suggestedPrice: 580,
    stock: 900,
    listedBy: 2,
    imageUrl:
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&auto=format&fit=crop&q=80",
    status: "Active",
  },
  {
    id: "pp-4",
    title: "Wireless Noise-Cancelling Headphones",
    category: "Electronics",
    minimumPrice: 2200,
    suggestedPrice: 3200,
    stock: 420,
    listedBy: 4,
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80",
    status: "Active",
  },
  {
    id: "pp-5",
    title: "Leather Bi-fold Wallet (Men's)",
    category: "Accessories",
    minimumPrice: 480,
    suggestedPrice: 750,
    stock: 680,
    listedBy: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&auto=format&fit=crop&q=80",
    status: "Low Stock",
  },
];

const COMMISSION_LEDGER = [
  {
    id: "c-1",
    merchant: "Craft Bench Shoes",
    order: "#ORD-9021",
    saleAmount: 1200,
    rate: 8,
    commission: 96,
    date: "Today, 10:45 AM",
    status: "Pending",
  },
  {
    id: "c-2",
    merchant: "Artisan Pantry",
    order: "#ORD-9020",
    saleAmount: 850,
    rate: 8,
    commission: 68,
    date: "Today, 09:12 AM",
    status: "Pending",
  },
  {
    id: "c-3",
    merchant: "Craft Bench Shoes",
    order: "#ORD-9018",
    saleAmount: 2400,
    rate: 8,
    commission: 192,
    date: "Yesterday, 4:30 PM",
    status: "Cleared",
  },
  {
    id: "c-4",
    merchant: "Artisan Pantry",
    order: "#ORD-9015",
    saleAmount: 600,
    rate: 8,
    commission: 48,
    date: "Yesterday, 2:00 PM",
    status: "Cleared",
  },
  {
    id: "c-5",
    merchant: "Trendy Threads BD",
    order: "#ORD-8999",
    saleAmount: 1800,
    rate: 3,
    commission: 54,
    date: "Nov 01, 2026",
    status: "Cleared",
  },
];

const MONTHLY_REVENUE = [
  { month: "Jul", mrr: 24000, gmv: 820000, commission: 38000 },
  { month: "Aug", mrr: 38000, gmv: 1100000, commission: 52000 },
  { month: "Sep", mrr: 55000, gmv: 1480000, commission: 71000 },
  { month: "Oct", mrr: 78000, gmv: 2050000, commission: 98000 },
  { month: "Nov", mrr: 96000, gmv: 2590000, commission: 124000 },
];

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "merchants", label: "Merchants", icon: Users },
  { id: "orders", label: "All Orders", icon: ShoppingBag },
  { id: "catalog", label: "Platform Catalog", icon: Package },
  { id: "commissions", label: "Commissions", icon: Percent },
  { id: "analytics", label: "Analytics & BI", icon: BarChart3 },
  { id: "billing", label: "Billing & Plans", icon: CreditCard },
  { id: "settings", label: "Settings", icon: Settings },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return "৳" + n.toLocaleString("en-BD");
}

function PlanBadge({ planId }: { planId: string }) {
  const plan = PLANS.find((p) => p.id === planId);
  if (!plan) return null;
  return (
    <span
      className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${plan.badge}`}
    >
      {plan.name}
    </span>
  );
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  iconColor,
  trend,
  trendLabel,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.FC<{ className?: string }>;
  iconColor: string;
  trend?: "up" | "down" | "neutral";
  trendLabel?: string;
}) {
  return (
    <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
          {label}
        </span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconColor}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="text-2xl font-black text-zinc-900 tracking-tight">{value}</div>
      {sub && <div className="text-xs text-zinc-500 mt-1">{sub}</div>}
      {trendLabel && (
        <div
          className={`text-xs font-semibold mt-2 flex items-center gap-1 ${
            trend === "up"
              ? "text-emerald-600"
              : trend === "down"
              ? "text-red-500"
              : "text-zinc-500"
          }`}
        >
          {trend === "up" ? (
            <TrendingUp className="w-3 h-3" />
          ) : trend === "down" ? (
            <TrendingDown className="w-3 h-3" />
          ) : null}
          {trendLabel}
        </div>
      )}
    </div>
  );
}

// Mini bar chart using pure CSS/SVG
function MiniBarChart({ data }: { data: typeof MONTHLY_REVENUE }) {
  const max = Math.max(...data.map((d) => d.mrr));
  return (
    <div className="flex items-end gap-2 h-20">
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center flex-1 gap-1">
          <div
            className="w-full rounded-t-sm bg-violet-500 opacity-80 transition-all hover:opacity-100"
            style={{ height: `${(d.mrr / max) * 80}px` }}
            title={`${d.month}: ${fmt(d.mrr)}`}
          />
          <span className="text-[9px] text-zinc-400 font-medium">{d.month}</span>
        </div>
      ))}
    </div>
  );
}

// ─── TABS ────────────────────────────────────────────────────────────────────

function OverviewTab() {
  const totalMRR = MERCHANTS.filter((m) => m.plan !== "free").reduce(
    (acc, m) => acc + PLANS.find((p) => p.id === m.plan)!.price,
    0
  );
  const totalGMV = MERCHANTS.reduce((acc, m) => acc + m.gmv, 0);
  const totalCommission = MERCHANTS.reduce((acc, m) => acc + m.commissionOwed, 0);
  const totalOrders = MERCHANTS.reduce((acc, m) => acc + m.ordersCount, 0);
  const activeCount = MERCHANTS.filter((m) => m.status === "Active").length;

  return (
    <div className="space-y-8">
      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Monthly Recurring Revenue"
          value={fmt(totalMRR)}
          sub={`${MERCHANTS.filter((m) => m.plan !== "free").length} paid subscribers`}
          icon={DollarSign}
          iconColor="bg-emerald-50 text-emerald-600"
          trend="up"
          trendLabel="+24% vs last month"
        />
        <StatCard
          label="Gross Merchandise Value"
          value={fmt(totalGMV)}
          sub="All stores, all time"
          icon={TrendingUp}
          iconColor="bg-blue-50 text-blue-600"
          trend="up"
          trendLabel="+38% vs last month"
        />
        <StatCard
          label="Commission Revenue"
          value={fmt(totalCommission)}
          sub="Free-tier commissions due"
          icon={Percent}
          iconColor="bg-amber-50 text-amber-600"
          trend="up"
          trendLabel="+12% this week"
        />
        <StatCard
          label="Total Orders"
          value={totalOrders.toLocaleString()}
          sub={`${activeCount} active merchants`}
          icon={ShoppingBag}
          iconColor="bg-violet-50 text-violet-600"
          trend="up"
          trendLabel="+8% today"
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Free Plan Merchants"
          value={String(MERCHANTS.filter((m) => m.plan === "free").length)}
          sub="8% commission per sale"
          icon={Users}
          iconColor="bg-zinc-100 text-zinc-600"
        />
        <StatCard
          label="Medium Plan (৳499)"
          value={String(MERCHANTS.filter((m) => m.plan === "medium").length)}
          sub="3% commission per sale"
          icon={Award}
          iconColor="bg-blue-50 text-blue-600"
        />
        <StatCard
          label="Pro Plan (৳999)"
          value={String(MERCHANTS.filter((m) => m.plan === "pro").length)}
          sub="0% commission"
          icon={Zap}
          iconColor="bg-violet-50 text-violet-600"
        />
        <StatCard
          label="Platform Products"
          value={String(PLATFORM_PRODUCTS.length)}
          sub="Available for dropshipping"
          icon={Package}
          iconColor="bg-orange-50 text-orange-600"
        />
      </div>

      {/* MRR Growth + Recent Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* MRR Chart */}
        <div className="lg:col-span-2 bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-zinc-900">Revenue Growth</h3>
              <p className="text-xs text-zinc-500 mt-0.5">MRR trend over last 5 months</p>
            </div>
            <div className="flex gap-3 text-[11px]">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-violet-500 inline-block" />MRR</span>
            </div>
          </div>
          <MiniBarChart data={MONTHLY_REVENUE} />
          <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-zinc-100 text-xs">
            {MONTHLY_REVENUE.slice(-3).map((d) => (
              <div key={d.month}>
                <div className="text-zinc-500">{d.month} 2026</div>
                <div className="font-bold text-zinc-900">{fmt(d.mrr)}</div>
                <div className="text-zinc-400">GMV {fmt(d.gmv)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Plan Distribution */}
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-zinc-900 mb-1">Plan Distribution</h3>
          <p className="text-xs text-zinc-500 mb-5">Active subscription breakdown</p>
          <div className="space-y-4">
            {PLANS.map((plan) => {
              const count = MERCHANTS.filter((m) => m.plan === plan.id).length;
              const pct = Math.round((count / MERCHANTS.length) * 100);
              return (
                <div key={plan.id}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-zinc-700">{plan.name} Plan</span>
                    <span className="text-zinc-500">{count} merchants ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        plan.id === "free"
                          ? "bg-zinc-400"
                          : plan.id === "medium"
                          ? "bg-blue-500"
                          : "bg-violet-500"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 pt-4 border-t border-zinc-100">
            <div className="text-xs text-zinc-500">Conversion opportunity</div>
            <div className="font-bold text-zinc-900 text-sm mt-1">
              {MERCHANTS.filter((m) => m.plan === "free").length} free → paid upgrades
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">
              +{fmt(MERCHANTS.filter((m) => m.plan === "free").length * 499)} potential MRR
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-zinc-900">Top Performing Merchants</h3>
          <span className="text-xs text-zinc-400">by GMV this month</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-100">
                <th className="text-left pb-3 font-semibold text-zinc-500 uppercase tracking-wider">Merchant</th>
                <th className="text-left pb-3 font-semibold text-zinc-500 uppercase tracking-wider">Plan</th>
                <th className="text-left pb-3 font-semibold text-zinc-500 uppercase tracking-wider">GMV</th>
                <th className="text-left pb-3 font-semibold text-zinc-500 uppercase tracking-wider">Orders</th>
                <th className="text-left pb-3 font-semibold text-zinc-500 uppercase tracking-wider">Commission</th>
                <th className="text-left pb-3 font-semibold text-zinc-500 uppercase tracking-wider">Last Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {[...MERCHANTS]
                .sort((a, b) => b.gmv - a.gmv)
                .slice(0, 5)
                .map((m) => (
                  <tr key={m.id} className="hover:bg-zinc-50/50">
                    <td className="py-3">
                      <div className="font-semibold text-zinc-900">{m.name}</div>
                      <div className="text-zinc-400 font-mono">{m.slug}.storeswift.app</div>
                    </td>
                    <td className="py-3"><PlanBadge planId={m.plan} /></td>
                    <td className="py-3 font-bold text-zinc-900">{fmt(m.gmv)}</td>
                    <td className="py-3 text-zinc-700">{m.ordersCount}</td>
                    <td className="py-3">
                      {m.commissionOwed > 0 ? (
                        <span className="text-amber-600 font-semibold">{fmt(m.commissionOwed)}</span>
                      ) : (
                        <span className="text-zinc-400">—</span>
                      )}
                    </td>
                    <td className="py-3 text-zinc-400">{m.lastOrder}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MerchantsTab() {
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [merchants, setMerchants] = useState(MERCHANTS);

  const filtered = useMemo(
    () =>
      merchants.filter((m) => {
        const matchSearch =
          m.name.toLowerCase().includes(search.toLowerCase()) ||
          m.ownerEmail.toLowerCase().includes(search.toLowerCase()) ||
          m.slug.toLowerCase().includes(search.toLowerCase());
        const matchPlan = planFilter === "all" || m.plan === planFilter;
        const matchStatus = statusFilter === "all" || m.status === statusFilter;
        return matchSearch && matchPlan && matchStatus;
      }),
    [merchants, search, planFilter, statusFilter]
  );

  const toggle = (id: string) =>
    setMerchants((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: m.status === "Active" ? "Suspended" : "Active" }
          : m
      )
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Merchant Accounts</h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage all registered merchants, their plans, and storefronts
          </p>
        </div>
        <button className="inline-flex items-center gap-2 bg-zinc-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-zinc-800 transition">
          <Plus className="w-3.5 h-3.5" />
          Invite Merchant
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
          <input
            className="w-full pl-9 pr-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 outline-none focus:border-zinc-400"
            placeholder="Search merchants, email, slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-700 outline-none focus:border-zinc-400"
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
        >
          <option value="all">All Plans</option>
          <option value="free">Free</option>
          <option value="medium">Medium (৳499)</option>
          <option value="pro">Pro (৳999)</option>
        </select>
        <select
          className="bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-700 outline-none focus:border-zinc-400"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Suspended">Suspended</option>
        </select>
      </div>

      <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-100">
              <tr>
                <th className="text-left px-5 py-3.5 font-bold uppercase tracking-wider text-zinc-500">Merchant</th>
                <th className="text-left px-5 py-3.5 font-bold uppercase tracking-wider text-zinc-500">Plan</th>
                <th className="text-left px-5 py-3.5 font-bold uppercase tracking-wider text-zinc-500">Category</th>
                <th className="text-left px-5 py-3.5 font-bold uppercase tracking-wider text-zinc-500">GMV</th>
                <th className="text-left px-5 py-3.5 font-bold uppercase tracking-wider text-zinc-500">Orders</th>
                <th className="text-left px-5 py-3.5 font-bold uppercase tracking-wider text-zinc-500">Commission Due</th>
                <th className="text-left px-5 py-3.5 font-bold uppercase tracking-wider text-zinc-500">Domain</th>
                <th className="text-left px-5 py-3.5 font-bold uppercase tracking-wider text-zinc-500">Status</th>
                <th className="text-right px-5 py-3.5 font-bold uppercase tracking-wider text-zinc-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filtered.map((m) => (
                <tr key={m.id} className="hover:bg-zinc-50/50 transition">
                  <td className="px-5 py-4">
                    <div className="font-bold text-zinc-900">{m.name}</div>
                    <div className="text-zinc-400 font-mono mt-0.5">{m.slug}.storeswift.app</div>
                    <div className="text-zinc-400 mt-0.5">{m.ownerEmail}</div>
                  </td>
                  <td className="px-5 py-4"><PlanBadge planId={m.plan} /></td>
                  <td className="px-5 py-4 text-zinc-600">{m.category}</td>
                  <td className="px-5 py-4 font-bold text-zinc-900">{fmt(m.gmv)}</td>
                  <td className="px-5 py-4 text-zinc-700">{m.ordersCount}</td>
                  <td className="px-5 py-4">
                    {m.commissionOwed > 0 ? (
                      <span className="text-amber-600 font-bold">{fmt(m.commissionOwed)}</span>
                    ) : (
                      <span className="text-zinc-400">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    {m.customDomain ? (
                      <span className="text-blue-600 font-medium flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        {m.customDomain}
                      </span>
                    ) : (
                      <span className="text-zinc-400">Subdomain only</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                        m.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <Link
                        href={`/store/${m.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition"
                        title="View Storefront"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/admin?store=${m.slug}`}
                        className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition"
                        title="Open Merchant Admin"
                      >
                        <Store className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => toggle(m.id)}
                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition ${
                          m.status === "Suspended"
                            ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                            : "bg-red-50 hover:bg-red-100 text-red-700 border border-red-200"
                        }`}
                      >
                        {m.status === "Suspended" ? "Reactivate" : "Suspend"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 bg-zinc-50 border-t border-zinc-100 text-xs text-zinc-500">
          Showing {filtered.length} of {merchants.length} merchants
        </div>
      </div>
    </div>
  );
}

function AllOrdersTab() {
  const ALL_ORDERS = [
    { id: "o-1", store: "Apex Fashion Hub", slug: "apex-fashion", customer: "Rania Sultana", items: "Classic Cotton T-Shirt (M/Black) ×2", amount: 1800, payment: "bKash", status: "Delivered", date: "Today, 10:45 AM", plan: "medium" },
    { id: "o-2", store: "CyberTech Audio", slug: "cyber-tech", customer: "Farid Ahmed", items: "Noise-Cancelling Headphones", amount: 3200, payment: "COD", status: "Shipped", date: "Today, 09:30 AM", plan: "pro" },
    { id: "o-3", store: "Craft Bench Shoes", slug: "craft-shoes", customer: "Tamim Khan", items: "Leather Loafers (Size 42)", amount: 2800, payment: "Nagad", status: "Processing", date: "Today, 08:15 AM", plan: "free" },
    { id: "o-4", store: "Luxe Glow Beauty", slug: "luxe-glow-beauty", customer: "Mitu Begum", items: "Vitamin C Serum + SPF Bundle", amount: 1450, payment: "bKash", status: "Delivered", date: "Yesterday", plan: "pro" },
    { id: "o-5", store: "Artisan Pantry", slug: "artisan-food", customer: "Hasan Ali", items: "Ethiopian Coffee Beans 500g", amount: 650, payment: "COD", status: "Pending", date: "Yesterday", plan: "free" },
    { id: "o-6", store: "Maison Opulente", slug: "maison-jewelry", customer: "Layla Rahman", items: "18K Gold Pendant Necklace", amount: 12500, payment: "Card", status: "Delivered", date: "2 days ago", plan: "pro" },
    { id: "o-7", store: "Apex Fashion Hub", slug: "apex-fashion", customer: "Rifat Hossain", items: "Slim Denim Jacket (L)", amount: 2200, payment: "COD", status: "Returned", date: "3 days ago", plan: "medium" },
  ];

  const statusColor: Record<string, string> = {
    Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Shipped: "bg-blue-50 text-blue-700 border-blue-200",
    Processing: "bg-amber-50 text-amber-700 border-amber-200",
    Pending: "bg-zinc-100 text-zinc-600 border-zinc-200",
    Returned: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">All Platform Orders</h2>
          <p className="text-xs text-zinc-500 mt-0.5">Orders across every merchant store on StoreSwift</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-zinc-100 text-zinc-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-zinc-200 transition">
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </button>
      </div>

      <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-100">
              <tr>
                <th className="text-left px-5 py-3.5 font-bold uppercase tracking-wider text-zinc-500">Order</th>
                <th className="text-left px-5 py-3.5 font-bold uppercase tracking-wider text-zinc-500">Store</th>
                <th className="text-left px-5 py-3.5 font-bold uppercase tracking-wider text-zinc-500">Customer</th>
                <th className="text-left px-5 py-3.5 font-bold uppercase tracking-wider text-zinc-500">Items</th>
                <th className="text-left px-5 py-3.5 font-bold uppercase tracking-wider text-zinc-500">Amount</th>
                <th className="text-left px-5 py-3.5 font-bold uppercase tracking-wider text-zinc-500">Payment</th>
                <th className="text-left px-5 py-3.5 font-bold uppercase tracking-wider text-zinc-500">Commission</th>
                <th className="text-left px-5 py-3.5 font-bold uppercase tracking-wider text-zinc-500">Status</th>
                <th className="text-left px-5 py-3.5 font-bold uppercase tracking-wider text-zinc-500">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {ALL_ORDERS.map((o) => {
                const plan = PLANS.find((p) => p.id === o.plan)!;
                const commission = Math.round(o.amount * plan.commission / 100);
                return (
                  <tr key={o.id} className="hover:bg-zinc-50/50 transition">
                    <td className="px-5 py-3.5 font-mono font-bold text-zinc-900">{o.id.toUpperCase()}</td>
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-zinc-900">{o.store}</div>
                      <PlanBadge planId={o.plan} />
                    </td>
                    <td className="px-5 py-3.5 font-medium text-zinc-700">{o.customer}</td>
                    <td className="px-5 py-3.5 text-zinc-500 max-w-[160px] truncate">{o.items}</td>
                    <td className="px-5 py-3.5 font-bold text-zinc-900">{fmt(o.amount)}</td>
                    <td className="px-5 py-3.5 text-zinc-600">{o.payment}</td>
                    <td className="px-5 py-3.5">
                      {commission > 0 ? (
                        <span className="font-bold text-amber-600">{fmt(commission)}</span>
                      ) : (
                        <span className="text-zinc-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${statusColor[o.status] || "bg-zinc-100 text-zinc-600 border-zinc-200"}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-zinc-400">{o.date}</td>
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

function PlatformCatalogTab() {
  const [products, setProducts] = useState(PLATFORM_PRODUCTS);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Fashion");
  const [newMinPrice, setNewMinPrice] = useState("500");
  const [newSuggested, setNewSuggested] = useState("800");
  const [newStock, setNewStock] = useState("1000");

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    setProducts([
      {
        id: `pp-${Date.now()}`,
        title: newTitle,
        category: newCategory,
        minimumPrice: parseInt(newMinPrice),
        suggestedPrice: parseInt(newSuggested),
        stock: parseInt(newStock),
        listedBy: 0,
        imageUrl:
          "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400&auto=format&fit=crop&q=80",
        status: "Active",
      },
      ...products,
    ]);
    setShowAdd(false);
    setNewTitle("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Platform Dropshipping Catalog</h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Products merchants can list on their storefronts at markup prices
          </p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="inline-flex items-center gap-2 bg-zinc-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-zinc-800 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Platform Product
        </button>
      </div>

      {/* Add Product Form */}
      {showAdd && (
        <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-zinc-900 mb-4">New Platform Product</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="sm:col-span-2 lg:col-span-2">
              <label className="block text-xs font-semibold text-zinc-600 mb-1">Product Title</label>
              <input
                className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400"
                placeholder="e.g. Premium Cotton Polo Shirt"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-600 mb-1">Category</label>
              <select
                className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              >
                {["Fashion", "Beauty", "Electronics", "Accessories", "Food"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-600 mb-1">Minimum Price (৳)</label>
              <input
                className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400"
                type="number"
                value={newMinPrice}
                onChange={(e) => setNewMinPrice(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-600 mb-1">Suggested Sell Price (৳)</label>
              <input
                className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400"
                type="number"
                value={newSuggested}
                onChange={(e) => setNewSuggested(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-600 mb-1">Initial Stock</label>
              <input
                className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400"
                type="number"
                value={newStock}
                onChange={(e) => setNewStock(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleAdd}
              className="bg-zinc-900 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-zinc-800 transition"
            >
              Add to Catalog
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="bg-zinc-100 text-zinc-700 px-5 py-2 rounded-xl text-xs font-bold hover:bg-zinc-200 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map((p) => (
          <div key={p.id} className="bg-white border border-zinc-200/80 rounded-2xl shadow-sm overflow-hidden">
            <div className="aspect-[4/3] bg-zinc-100 overflow-hidden">
              <img
                src={p.imageUrl}
                alt={p.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400&auto=format&fit=crop&q=80";
                }}
              />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="font-bold text-zinc-900 text-sm leading-tight">{p.title}</h4>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${
                    p.status === "Active"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {p.status}
                </span>
              </div>
              <div className="text-xs text-zinc-500 mb-3">{p.category}</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-zinc-50 rounded-lg p-2">
                  <div className="text-zinc-500">Min. Price</div>
                  <div className="font-bold text-zinc-900">{fmt(p.minimumPrice)}</div>
                </div>
                <div className="bg-zinc-50 rounded-lg p-2">
                  <div className="text-zinc-500">Suggested</div>
                  <div className="font-bold text-emerald-700">{fmt(p.suggestedPrice)}</div>
                </div>
                <div className="bg-zinc-50 rounded-lg p-2">
                  <div className="text-zinc-500">Stock</div>
                  <div className={`font-bold ${p.stock < 500 ? "text-amber-600" : "text-zinc-900"}`}>
                    {p.stock.toLocaleString()} units
                  </div>
                </div>
                <div className="bg-zinc-50 rounded-lg p-2">
                  <div className="text-zinc-500">Listed By</div>
                  <div className="font-bold text-zinc-900">{p.listedBy} stores</div>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button className="flex-1 bg-zinc-900 text-white py-1.5 rounded-lg text-xs font-bold hover:bg-zinc-800 transition">
                  Edit
                </button>
                <button
                  onClick={() => setProducts(products.filter((x) => x.id !== p.id))}
                  className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CommissionsTab() {
  const [ledger, setLedger] = useState(COMMISSION_LEDGER);

  const totalPending = ledger.filter((c) => c.status === "Pending").reduce((acc, c) => acc + c.commission, 0);
  const totalCleared = ledger.filter((c) => c.status === "Cleared").reduce((acc, c) => acc + c.commission, 0);

  const clearAll = () =>
    setLedger((prev) =>
      prev.map((c) => ({ ...c, status: "Cleared" as const }))
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Commission Ledger</h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Track per-sale commissions from free-tier merchants
          </p>
        </div>
        <button
          onClick={clearAll}
          className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-500 transition"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          Clear All Pending
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Pending Commission" value={fmt(totalPending)} icon={Clock} iconColor="bg-amber-50 text-amber-600" sub="Awaiting clearance" />
        <StatCard label="Cleared This Month" value={fmt(totalCleared)} icon={CheckCircle2} iconColor="bg-emerald-50 text-emerald-600" sub="Successfully settled" />
        <StatCard label="Free Merchants" value={String(MERCHANTS.filter((m) => m.plan === "free").length)} icon={Users} iconColor="bg-zinc-100 text-zinc-600" sub="Subject to 8% commission" />
        <StatCard label="Medium Merchants" value={String(MERCHANTS.filter((m) => m.plan === "medium").length)} icon={Award} iconColor="bg-blue-50 text-blue-600" sub="Subject to 3% commission" />
      </div>

      {/* Ledger Table */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
          <span className="font-bold text-zinc-900">Recent Commission Events</span>
          <button className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
        <table className="w-full text-xs">
          <thead className="bg-zinc-50 border-b border-zinc-100">
            <tr>
              <th className="text-left px-5 py-3 font-bold uppercase tracking-wider text-zinc-500">Merchant</th>
              <th className="text-left px-5 py-3 font-bold uppercase tracking-wider text-zinc-500">Order</th>
              <th className="text-left px-5 py-3 font-bold uppercase tracking-wider text-zinc-500">Sale Amount</th>
              <th className="text-left px-5 py-3 font-bold uppercase tracking-wider text-zinc-500">Rate</th>
              <th className="text-left px-5 py-3 font-bold uppercase tracking-wider text-zinc-500">Commission</th>
              <th className="text-left px-5 py-3 font-bold uppercase tracking-wider text-zinc-500">Date</th>
              <th className="text-left px-5 py-3 font-bold uppercase tracking-wider text-zinc-500">Status</th>
              <th className="text-right px-5 py-3 font-bold uppercase tracking-wider text-zinc-500">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {ledger.map((c) => (
              <tr key={c.id} className="hover:bg-zinc-50/50">
                <td className="px-5 py-3 font-semibold text-zinc-900">{c.merchant}</td>
                <td className="px-5 py-3 font-mono text-zinc-600">{c.order}</td>
                <td className="px-5 py-3 font-bold text-zinc-900">{fmt(c.saleAmount)}</td>
                <td className="px-5 py-3 text-zinc-600">{c.rate}%</td>
                <td className="px-5 py-3 font-bold text-amber-600">{fmt(c.commission)}</td>
                <td className="px-5 py-3 text-zinc-400">{c.date}</td>
                <td className="px-5 py-3">
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                      c.status === "Cleared"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  {c.status === "Pending" && (
                    <button
                      onClick={() =>
                        setLedger((prev) =>
                          prev.map((x) =>
                            x.id === c.id ? { ...x, status: "Cleared" } : x
                          )
                        )
                      }
                      className="text-xs font-semibold text-emerald-600 hover:text-emerald-500"
                    >
                      Mark Cleared
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AnalyticsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900">Business Intelligence</h2>
        <p className="text-xs text-zinc-500 mt-0.5">Platform-wide analytics and growth metrics</p>
      </div>

      {/* GMV by month */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-zinc-900 mb-1">Gross Merchandise Volume (Monthly)</h3>
        <p className="text-xs text-zinc-500 mb-6">Total transaction value across all merchant stores</p>
        <div className="flex items-end gap-3 h-32">
          {MONTHLY_REVENUE.map((d) => {
            const max = Math.max(...MONTHLY_REVENUE.map((x) => x.gmv));
            const pct = (d.gmv / max) * 100;
            return (
              <div key={d.month} className="flex flex-col items-center flex-1 gap-1">
                <div className="text-[10px] font-bold text-zinc-600">{fmt(d.gmv / 1000)}k</div>
                <div
                  className="w-full rounded-t bg-blue-500 hover:bg-blue-400 transition cursor-pointer"
                  style={{ height: `${pct}%` }}
                  title={fmt(d.gmv)}
                />
                <span className="text-[10px] text-zinc-400 font-medium">{d.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Category breakdown */}
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-zinc-900 mb-5">GMV by Category</h3>
          <div className="space-y-3">
            {[
              { cat: "Fashion & Apparel", gmv: 604500, color: "bg-violet-500" },
              { cat: "Consumer Tech", gmv: 920000, color: "bg-blue-500" },
              { cat: "Fine Jewelry", gmv: 680000, color: "bg-amber-500" },
              { cat: "Beauty & Skincare", gmv: 512000, color: "bg-pink-500" },
              { cat: "Footwear", gmv: 138000, color: "bg-emerald-500" },
              { cat: "Food & Pantry", gmv: 54000, color: "bg-orange-500" },
            ]
              .sort((a, b) => b.gmv - a.gmv)
              .map((item) => {
                const total = 2908500;
                const pct = Math.round((item.gmv / total) * 100);
                return (
                  <div key={item.cat}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-zinc-700">{item.cat}</span>
                      <span className="font-bold text-zinc-900">{pct}% · {fmt(item.gmv)}</span>
                    </div>
                    <div className="h-2 bg-zinc-100 rounded-full">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Geographic distribution */}
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-zinc-900 mb-5">Merchant Districts</h3>
          <div className="space-y-3">
            {[
              { district: "Dhaka", count: 4 },
              { district: "Chittagong", count: 1 },
              { district: "Sylhet", count: 1 },
              { district: "Rajshahi", count: 1 },
            ].map((d) => (
              <div key={d.district} className="flex items-center gap-3 text-xs">
                <MapPin className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                <span className="font-medium text-zinc-700 flex-1">{d.district}</span>
                <span className="font-bold text-zinc-900">{d.count} merchants</span>
                <div className="w-20 h-2 bg-zinc-100 rounded-full">
                  <div
                    className="h-full rounded-full bg-zinc-600"
                    style={{ width: `${(d.count / MERCHANTS.length) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-zinc-100 space-y-3">
            <h4 className="font-bold text-zinc-900 text-xs uppercase tracking-wider">Platform KPIs</h4>
            {[
              { label: "Avg. Order Value", value: fmt(Math.round([1800, 3200, 2800, 1450, 650, 12500, 2200].reduce((a, b) => a + b, 0) / 7)) },
              { label: "Monthly Churn Rate", value: "4.2%" },
              { label: "Free → Paid Conversion", value: "18%" },
              { label: "Avg. Store Lifetime", value: "9.3 months" },
            ].map((kpi) => (
              <div key={kpi.label} className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">{kpi.label}</span>
                <span className="font-bold text-zinc-900">{kpi.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BillingTab() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-zinc-900">Subscription Plans & Billing</h2>
        <p className="text-xs text-zinc-500 mt-0.5">Configure plan features, limits, and pricing</p>
      </div>

      {/* Plan Cards */}
      <div className="grid sm:grid-cols-3 gap-5">
        {PLANS.map((plan, i) => (
          <div
            key={plan.id}
            className={`bg-white border rounded-2xl p-6 shadow-sm relative overflow-hidden ${
              i === 2
                ? "border-violet-200 ring-2 ring-violet-100"
                : "border-zinc-200/80"
            }`}
          >
            {i === 2 && (
              <div className="absolute top-0 right-0 bg-violet-600 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl tracking-wider">
                BEST VALUE
              </div>
            )}
            <div className="mb-4">
              <PlanBadge planId={plan.id} />
            </div>
            <div className="text-3xl font-black text-zinc-900 mb-1">
              {plan.price === 0 ? "Free" : fmt(plan.price)}
              {plan.price > 0 && <span className="text-base font-medium text-zinc-500">/mo</span>}
            </div>
            <div className="text-xs text-zinc-500 mb-5">{plan.limit}</div>
            <div className="space-y-2 text-xs">
              {[
                {
                  free: "50 products max",
                  medium: "500 products",
                  pro: "Unlimited products",
                }[plan.id],
                {
                  free: `${plan.commission}% commission per sale`,
                  medium: `${plan.commission}% commission per sale`,
                  pro: "0% commission ever",
                }[plan.id],
                {
                  free: "Subdomain only",
                  medium: "Custom domain included",
                  pro: "Custom domain + SSL",
                }[plan.id],
                {
                  free: "Basic analytics",
                  medium: "Advanced analytics",
                  pro: "Full BI dashboard",
                }[plan.id],
                {
                  free: "No dropshipping",
                  medium: "Dropshipping access",
                  pro: "Dropshipping + API access",
                }[plan.id],
              ].map((feature, fi) => (
                <div key={fi} className="flex items-center gap-2">
                  <CheckCircle2
                    className={`w-3.5 h-3.5 flex-shrink-0 ${
                      plan.id === "pro"
                        ? "text-violet-500"
                        : plan.id === "medium"
                        ? "text-blue-500"
                        : "text-zinc-400"
                    }`}
                  />
                  <span className="text-zinc-700">{feature}</span>
                </div>
              ))}
            </div>
            <button
              className={`mt-6 w-full py-2 rounded-xl text-xs font-bold transition ${
                i === 2
                  ? "bg-violet-600 text-white hover:bg-violet-500"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              Edit Plan
            </button>
          </div>
        ))}
      </div>

      {/* Revenue by plan */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-zinc-900 mb-5">Revenue Breakdown by Plan</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="border-b border-zinc-100">
              <tr>
                <th className="text-left pb-3 font-bold uppercase tracking-wider text-zinc-500">Plan</th>
                <th className="text-left pb-3 font-bold uppercase tracking-wider text-zinc-500">Price</th>
                <th className="text-left pb-3 font-bold uppercase tracking-wider text-zinc-500">Merchants</th>
                <th className="text-left pb-3 font-bold uppercase tracking-wider text-zinc-500">MRR from Subscriptions</th>
                <th className="text-left pb-3 font-bold uppercase tracking-wider text-zinc-500">Commission Revenue</th>
                <th className="text-left pb-3 font-bold uppercase tracking-wider text-zinc-500">Total Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {PLANS.map((plan) => {
                const merchantsOnPlan = MERCHANTS.filter((m) => m.plan === plan.id);
                const mrr = merchantsOnPlan.length * plan.price;
                const commission = merchantsOnPlan.reduce((acc, m) => acc + m.commissionOwed, 0);
                return (
                  <tr key={plan.id} className="hover:bg-zinc-50/50">
                    <td className="py-3"><PlanBadge planId={plan.id} /></td>
                    <td className="py-3 font-semibold text-zinc-900">
                      {plan.price > 0 ? fmt(plan.price) + "/mo" : "Free"}
                    </td>
                    <td className="py-3 text-zinc-700">{merchantsOnPlan.length}</td>
                    <td className="py-3 font-bold text-zinc-900">{mrr > 0 ? fmt(mrr) : "—"}</td>
                    <td className="py-3 font-bold text-amber-600">{commission > 0 ? fmt(commission) : "—"}</td>
                    <td className="py-3 font-black text-zinc-900">{fmt(mrr + commission)}</td>
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

function SettingsTab() {
  const [platformName, setPlatformName] = useState("StoreSwift");
  const [supportEmail, setSupportEmail] = useState("support@storeswift.app");
  const [subdomainBase, setSubdomainBase] = useState("storeswift.app");
  const [commissionFree, setCommissionFree] = useState("8");
  const [commissionMedium, setCommissionMedium] = useState("3");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-zinc-900">Platform Settings</h2>
        <p className="text-xs text-zinc-500 mt-0.5">Configure global platform behavior</p>
      </div>

      <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-sm space-y-5">
        <h3 className="font-bold text-zinc-900 border-b border-zinc-100 pb-3">General</h3>
        {[
          { label: "Platform Name", value: platformName, onChange: setPlatformName },
          { label: "Support Email", value: supportEmail, onChange: setSupportEmail },
          { label: "Subdomain Base", value: subdomainBase, onChange: setSubdomainBase },
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

      <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-sm space-y-5">
        <h3 className="font-bold text-zinc-900 border-b border-zinc-100 pb-3">Commission Rates</h3>
        {[
          { label: "Free Plan Commission (%)", value: commissionFree, onChange: setCommissionFree },
          { label: "Medium Plan Commission (%)", value: commissionMedium, onChange: setCommissionMedium },
        ].map(({ label, value, onChange }) => (
          <div key={label}>
            <label className="block text-xs font-semibold text-zinc-600 mb-1">{label}</label>
            <div className="relative">
              <input
                className="w-full border border-zinc-200 rounded-xl px-3 py-2 pr-8 text-sm text-zinc-900 outline-none focus:border-zinc-400"
                type="number"
                value={value}
                onChange={(e) => onChange(e.target.value)}
              />
              <span className="absolute right-3 top-2.5 text-sm text-zinc-400">%</span>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition ${
          saved
            ? "bg-emerald-600 text-white"
            : "bg-zinc-900 text-white hover:bg-zinc-800"
        }`}
      >
        {saved ? "✓ Saved Successfully" : "Save Changes"}
      </button>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function PlatformSuperAdminPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const TAB_COMPONENTS: Record<string, React.FC> = {
    overview: OverviewTab,
    merchants: MerchantsTab,
    orders: AllOrdersTab,
    catalog: PlatformCatalogTab,
    commissions: CommissionsTab,
    analytics: AnalyticsTab,
    billing: BillingTab,
    settings: SettingsTab,
  };

  const ActiveComponent = TAB_COMPONENTS[activeTab] || OverviewTab;
  const activeNavItem = NAV_ITEMS.find((n) => n.id === activeTab);

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-zinc-950 h-14 flex items-center justify-between px-4 sm:px-6 border-b border-zinc-800 z-50 sticky top-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <Layers className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-600/30">
              <ShieldAlert className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="font-black text-white text-sm tracking-tight">
                StoreSwift
              </span>
              <span className="text-violet-400 text-sm font-black"> Admin</span>
            </div>
            <span className="text-[10px] bg-violet-900/60 text-violet-300 border border-violet-700/60 px-2 py-0.5 rounded-full font-mono font-bold">
              Super-Admin
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="w-4 h-4 text-zinc-400 hover:text-white cursor-pointer transition" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-zinc-950" />
          </div>
          <Link
            href="/"
            className="text-xs font-semibold text-zinc-400 hover:text-white transition hidden sm:inline"
          >
            ← Public Site
          </Link>
          <Link
            href="/admin"
            className="text-xs font-semibold text-zinc-400 hover:text-white transition hidden sm:inline"
          >
            Merchant Admin
          </Link>
          <div className="w-7 h-7 rounded-full bg-violet-600 text-white text-xs font-bold flex items-center justify-center">
            SA
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`bg-white border-r border-zinc-200/80 flex-shrink-0 transition-all duration-200 ${
            sidebarOpen ? "w-56" : "w-0 overflow-hidden"
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
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium transition ${
                    isActive
                      ? "bg-zinc-900 text-white shadow-sm"
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="absolute bottom-0 left-0 w-56 p-3 border-t border-zinc-100">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-50">
              <div className="w-6 h-6 rounded-full bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                SA
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-zinc-900 truncate">Super Admin</div>
                <div className="text-[10px] text-zinc-400 truncate">admin@storeswift.app</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {/* Breadcrumb */}
          <div className="px-6 pt-5 pb-0">
            <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
              <span>StoreSwift Admin</span>
              <ChevronRight className="w-3 h-3" />
              <span className="font-semibold text-zinc-700">{activeNavItem?.label}</span>
            </div>
          </div>

          <div className="p-6">
            <ActiveComponent />
          </div>
        </main>
      </div>
    </div>
  );
}
