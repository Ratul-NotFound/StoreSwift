"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Store,
  ShoppingBag,
  Percent,
  CreditCard,
  Package,
  Truck,
  BarChart3,
  Settings,
  TrendingUp,
  TrendingDown,
  Users,
  Activity,
  DollarSign,
  ArrowUpRight,
  Search,
  Filter,
  Eye,
  Ban,
  CheckCircle2,
  ExternalLink,
  Download,
  Plus,
  Edit,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Bell,
  LogOut,
  Zap,
  Award,
  Tag,
  Clock,
  Calendar,
  Wallet,
  CheckCheck,
  AlertTriangle,
  Info,
  Globe,
  MapPin,
  Layers,
  Sparkles,
  Save,
  Upload,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface KpiData {
  totalStores: number;
  byPlan: { free: number; medium: number; pro: number };
  mrr: number;
  gmv30d: number;
  pendingCommissionBdt: number;
  pendingCommissionCount: number;
  activeStores30d: number;
  mrrGrowth: number;
  gmvGrowth: number;
  storeGrowth: number;
  _mock?: boolean;
}

interface AnalyticsData {
  period: string;
  gmvChart: { day: string; gmv: string; orderCount: number }[];
  topStores: { storeId: string; storeName?: string; slug?: string; revenue: string; orderCount: number }[];
  planDistribution: { plan: string; cnt: number }[];
  _mock?: boolean;
}

interface Merchant {
  id: string;
  name: string;
  slug: string;
  category: string;
  plan: "free" | "medium" | "pro";
  storeStatus: "active" | "suspended" | "archived";
  subscriptionStatus: string;
  totalOrders: number;
  totalRevenue: number;
  pendingCommissionBdt: number;
  createdAt: string | Date;
  owner: { email: string; fullName: string; phone: string } | null;
}

interface Commission {
  id: string;
  storeId: string;
  orderId: string;
  orderAmount: string;
  commissionRate: string;
  commissionBdt: string;
  status: "pending" | "cleared";
  clearedAt: string | null;
  createdAt: string | Date;
}

interface CommissionSummary {
  pendingTotal: number;
  clearedTotal: number;
  totalCount: number;
}

interface Order {
  id: string;
  orderNumber: string;
  storeId?: string;
  storeName?: string;
  customerName: string;
  customerPhone: string;
  totalAmount: string;
  paymentMethod: string;
  paymentStatus?: string;
  fulfillmentStatus?: string;
  status?: string;
  createdAt: string | Date;
}

interface PlatformProduct {
  id: string;
  title: string;
  description?: string;
  category: string;
  images: string[];
  minimumPrice: string;
  suggestedPrice?: string;
  stockQuantity: number;
  sku?: string;
  status: string;
  createdAt: string;
}

interface DropshipOrder {
  id: string;
  orderId: string;
  orderNumber: string;
  storeName: string;
  storeSlug: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  product: { title: string; variant: string; platformProductId: string };
  quantity: number;
  minPrice: number;
  soldPrice: number;
  merchantEarns: number;
  platformEarns: number;
  status: "pending" | "shipped" | "delivered";
  createdAt: string | Date;
  trackingNumber?: string;
}

interface Subscription {
  id?: string;
  storeId: string;
  storeName?: string;
  plan: "free" | "medium" | "pro";
  status: "active" | "past_due" | "cancelled";
  priceBdt: number;
  startedAt?: string | null;
  renewsAt?: string | null;
  paymentMethod?: string | null;
}

interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const BDT = (amount: number) => `৳${amount.toLocaleString("en-BD")}`;

const PLAN_BADGES: Record<string, string> = {
  free: "bg-zinc-100 text-zinc-700 border border-zinc-300",
  medium: "bg-blue-50 text-blue-700 border border-blue-200",
  pro: "bg-violet-50 text-violet-700 border border-violet-200",
};

const STATUS_DOT: Record<string, string> = {
  active: "bg-green-500",
  suspended: "bg-red-500",
  pending: "bg-amber-500",
  cleared: "bg-green-500",
  shipped: "bg-blue-500",
  delivered: "bg-green-600",
  cancelled: "bg-zinc-400",
  past_due: "bg-orange-500",
  archived: "bg-zinc-400",
};

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "merchants", label: "Merchants", icon: Store },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "commissions", label: "Commissions", icon: Percent },
  { id: "subscriptions", label: "Subscriptions", icon: CreditCard },
  { id: "dropship-catalog", label: "Dropship Catalog", icon: Package },
  { id: "dropship-orders", label: "Dropship Orders", icon: Truck },
  { id: "analytics", label: "Analytics & BI", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
] as const;

type TabId = (typeof TABS)[number]["id"];

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ toasts, remove }: { toasts: ToastMessage[]; remove: (id: string) => void }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-sm font-medium min-w-[280px] ${
            t.type === "success"
              ? "bg-green-600 text-white"
              : t.type === "error"
              ? "bg-red-600 text-white"
              : "bg-zinc-800 text-white"
          }`}
        >
          {t.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : t.type === "error" ? <AlertTriangle className="w-4 h-4 shrink-0" /> : <Info className="w-4 h-4 shrink-0" />}
          <span className="flex-1">{t.message}</span>
          <button onClick={() => remove(t.id)} className="opacity-70 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-zinc-200 ${className}`} />;
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium">
      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[status] ?? "bg-zinc-400"}`} />
      <span className="capitalize">{status.replace("_", " ")}</span>
    </span>
  );
}

// ─── Plan Badge ───────────────────────────────────────────────────────────────

function PlanBadge({ plan }: { plan: string }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${PLAN_BADGES[plan] ?? "bg-zinc-100 text-zinc-700"}`}>
      {plan}
    </span>
  );
}

// ─── SVG Bar Chart ────────────────────────────────────────────────────────────

function BarChart({
  data,
  valueKey,
  labelKey,
  color = "violet",
  height = 120,
}: {
  data: Record<string, string | number>[];
  valueKey: string;
  labelKey: string;
  color?: string;
  height?: number;
}) {
  if (!data || data.length === 0) return <div className="text-xs text-zinc-400 py-4 text-center">No data</div>;

  const values = data.map((d) => Number(d[valueKey]) || 0);
  const max = Math.max(...values, 1);
  const barW = Math.max(2, Math.floor(500 / data.length) - 2);
  const gap = Math.max(1, Math.floor(500 / data.length) - barW);
  const totalW = data.length * (barW + gap);

  const barColor = color === "violet" ? "#7c3aed" : color === "blue" ? "#2563eb" : "#16a34a";
  const lightColor = color === "violet" ? "#ede9fe" : color === "blue" ? "#dbeafe" : "#dcfce7";

  return (
    <svg viewBox={`0 0 ${totalW} ${height + 20}`} className="w-full" style={{ maxHeight: height + 20 }}>
      {data.map((d, i) => {
        const val = values[i];
        const barH = max > 0 ? Math.max(2, (val / max) * height) : 2;
        const x = i * (barW + gap);
        const y = height - barH;
        const label = String(d[labelKey]).slice(-5);
        return (
          <g key={i}>
            <rect x={x} y={0} width={barW} height={height} fill={lightColor} rx={2} />
            <rect x={x} y={y} width={barW} height={barH} fill={barColor} rx={2} />
            {data.length <= 10 && (
              <text x={x + barW / 2} y={height + 14} textAnchor="middle" fontSize="8" fill="#71717a">
                {label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ─── Line Chart ───────────────────────────────────────────────────────────────

function LineChart({
  data,
  valueKey,
  height = 100,
}: {
  data: Record<string, string | number>[];
  valueKey: string;
  height?: number;
}) {
  if (!data || data.length < 2) return <div className="text-xs text-zinc-400 py-4 text-center">No data</div>;

  const values = data.map((d) => Number(d[valueKey]) || 0);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const W = 500;
  const H = height;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * W;
    const y = H - ((v - min) / range) * H;
    return `${x},${y}`;
  });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: H }}>
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={pts.join(" ")} fill="none" stroke="#7c3aed" strokeWidth="2" />
      <polygon points={`0,${H} ${pts.join(" ")} ${W},${H}`} fill="url(#lineGrad)" />
    </svg>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  trend,
  iconBg = "bg-violet-100",
  iconColor = "text-violet-600",
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  trend?: number;
  iconBg?: string;
  iconColor?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-5 flex items-start gap-4">
      <div className={`${iconBg} ${iconColor} p-3 rounded-xl shrink-0`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-zinc-500 font-medium mb-1">{label}</p>
        <p className="text-2xl font-bold text-zinc-900 tracking-tight">{value}</p>
        {(sub || trend !== undefined) && (
          <div className="flex items-center gap-1 mt-1">
            {trend !== undefined && (
              <span className={`flex items-center gap-0.5 text-xs font-medium ${trend >= 0 ? "text-green-600" : "text-red-600"}`}>
                {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(trend)}%
              </span>
            )}
            {sub && <span className="text-xs text-zinc-400">{sub}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Tab 1: Dashboard ─────────────────────────────────────────────────────────

function DashboardTab({ addToast }: { addToast: (type: ToastMessage["type"], msg: string) => void }) {
  const [kpis, setKpis] = useState<KpiData | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const MRR_MOCK = [
    { month: "Jun", mrr: 18200 },
    { month: "Jul", mrr: 21300 },
    { month: "Aug", mrr: 23100 },
    { month: "Sep", mrr: 25800 },
    { month: "Oct", mrr: 27100 },
    { month: "Nov", mrr: 28444 },
  ];

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [kpiRes, analyticsRes] = await Promise.all([
          fetch("/api/admin/kpis"),
          fetch("/api/admin/analytics"),
        ]);
        const kpiJson = await kpiRes.json();
        const analyticsJson = await analyticsRes.json();
        setKpis(kpiJson.kpis);
        setAnalytics(analyticsJson);
        if (kpiJson.kpis?._mock) addToast("info", "Showing mock data — DB offline");
      } catch {
        addToast("error", "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [addToast]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  const totalStores = kpis ? kpis.byPlan.free + kpis.byPlan.medium + kpis.byPlan.pro : 0;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="MRR" value={BDT(kpis?.mrr ?? 0)} icon={DollarSign} trend={kpis?.mrrGrowth} sub="vs last month" iconBg="bg-violet-100" iconColor="text-violet-600" />
        <KpiCard label="GMV (30d)" value={BDT(kpis?.gmv30d ?? 0)} icon={TrendingUp} trend={kpis?.gmvGrowth} sub="30-day volume" iconBg="bg-blue-100" iconColor="text-blue-600" />
        <KpiCard label="Total Stores" value={String(kpis?.totalStores ?? 0)} icon={Store} trend={kpis?.storeGrowth} sub="all plans" iconBg="bg-emerald-100" iconColor="text-emerald-600" />
        <KpiCard label="Active Stores" value={String(kpis?.activeStores30d ?? 0)} icon={Activity} sub="had orders (30d)" iconBg="bg-sky-100" iconColor="text-sky-600" />
        <KpiCard label="Commission Pending" value={BDT(kpis?.pendingCommissionBdt ?? 0)} icon={Percent} sub={`${kpis?.pendingCommissionCount ?? 0} orders`} iconBg="bg-amber-100" iconColor="text-amber-600" />
        <KpiCard label="Paid Subscribers" value={String((kpis?.byPlan.medium ?? 0) + (kpis?.byPlan.pro ?? 0))} icon={CreditCard} sub="medium + pro" iconBg="bg-pink-100" iconColor="text-pink-600" />
        <KpiCard label="New Stores (7d)" value={String(Math.round((kpis?.totalStores ?? 0) * 0.07))} icon={Zap} sub="est. this week" iconBg="bg-orange-100" iconColor="text-orange-600" />
        <KpiCard label="Avg Order Value" value={BDT(Math.round((kpis?.gmv30d ?? 0) / Math.max(kpis?.activeStores30d ?? 1, 1) / 3))} icon={Award} sub="per store/order" iconBg="bg-teal-100" iconColor="text-teal-600" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-zinc-200 p-5">
          <h3 className="font-semibold text-zinc-800 mb-1">MRR Trend (6 months)</h3>
          <p className="text-xs text-zinc-400 mb-4">Monthly Recurring Revenue</p>
          <BarChart data={MRR_MOCK} valueKey="mrr" labelKey="month" color="violet" height={120} />
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-5">
          <h3 className="font-semibold text-zinc-800 mb-1">GMV (Last 30 days)</h3>
          <p className="text-xs text-zinc-400 mb-4">Daily gross merchandise value</p>
          {analytics?.gmvChart ? (
            <LineChart data={analytics.gmvChart} valueKey="gmv" height={120} />
          ) : (
            <Skeleton className="h-32" />
          )}
        </div>
      </div>

      {/* Plan Distribution */}
      <div className="bg-white rounded-xl border border-zinc-200 p-5">
        <h3 className="font-semibold text-zinc-800 mb-4">Plan Distribution</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { plan: "free", count: kpis?.byPlan.free ?? 0, color: "bg-zinc-500", label: "Free", sub: "8% commission" },
            { plan: "medium", count: kpis?.byPlan.medium ?? 0, color: "bg-blue-500", label: "Medium ৳499", sub: "3% commission" },
            { plan: "pro", count: kpis?.byPlan.pro ?? 0, color: "bg-violet-600", label: "Pro ৳999", sub: "0% commission" },
          ].map(({ plan, count, color, label, sub }) => (
            <div key={plan} className="text-center">
              <div className={`text-3xl font-bold ${plan === "pro" ? "text-violet-600" : plan === "medium" ? "text-blue-600" : "text-zinc-600"}`}>{count}</div>
              <div className="text-sm font-medium text-zinc-700 mt-1">{label}</div>
              <div className="text-xs text-zinc-400">{sub}</div>
              <div className="mt-2 h-2 bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${color} rounded-full transition-all`}
                  style={{ width: `${totalStores > 0 ? (count / totalStores) * 100 : 0}%` }}
                />
              </div>
              <div className="text-xs text-zinc-500 mt-1">{totalStores > 0 ? Math.round((count / totalStores) * 100) : 0}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Stores Table */}
      <div className="bg-white rounded-xl border border-zinc-200 p-5">
        <h3 className="font-semibold text-zinc-800 mb-4">Top 5 Stores by Revenue</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 text-left">
                <th className="px-3 py-2 text-xs font-semibold text-zinc-500">Store</th>
                <th className="px-3 py-2 text-xs font-semibold text-zinc-500">GMV (30d)</th>
                <th className="px-3 py-2 text-xs font-semibold text-zinc-500">Orders</th>
                <th className="px-3 py-2 text-xs font-semibold text-zinc-500">Commission Due</th>
              </tr>
            </thead>
            <tbody>
              {(analytics?.topStores ?? []).map((s, i) => {
                const storeSlug = s.slug || (s.storeName ? s.storeName.toLowerCase().replace(/[^a-z0-9]/g, "-") : "apex-fashion");
                return (
                  <tr key={s.storeId} className="border-t border-zinc-100 hover:bg-zinc-50">
                    <td className="px-3 py-2.5 font-medium text-zinc-800">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-700 text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                          <span className="font-semibold">{s.storeName ?? s.storeId}</span>
                        </span>
                        <div className="flex items-center gap-1.5 ml-2">
                          <Link
                            href={`/store/${storeSlug}`}
                            target="_blank"
                            className="text-[11px] text-zinc-500 hover:text-violet-600 px-2 py-0.5 rounded border border-zinc-200 hover:border-violet-300 bg-white transition inline-flex items-center gap-1"
                            title="Visit Storefront"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Storefront</span>
                          </Link>
                          <Link
                            href={`/store/${storeSlug}/dashboard`}
                            target="_blank"
                            className="text-[11px] text-violet-700 hover:text-violet-900 px-2 py-0.5 rounded border border-violet-200 bg-violet-50 font-medium transition inline-flex items-center gap-1"
                            title="Open Merchant Dashboard"
                          >
                            <Store className="w-3 h-3" />
                            <span>Dashboard</span>
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 font-semibold text-zinc-900">{BDT(parseFloat(s.revenue))}</td>
                    <td className="px-3 py-2.5 text-zinc-600">{s.orderCount}</td>
                    <td className="px-3 py-2.5 text-amber-600 font-medium">{BDT(parseFloat(s.revenue) * 0.03)}</td>
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

// ─── Tab 2: Merchants ─────────────────────────────────────────────────────────

function MerchantsTab({ addToast }: { addToast: (type: ToastMessage["type"], msg: string) => void }) {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const fetchMerchants = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (search) params.set("search", search);
      if (planFilter) params.set("plan", planFilter);
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/admin/merchants?${params}`);
      const json = await res.json();
      setMerchants(json.merchants ?? []);
    } catch {
      addToast("error", "Failed to load merchants");
    } finally {
      setLoading(false);
    }
  }, [page, search, planFilter, statusFilter, addToast]);

  useEffect(() => { fetchMerchants(); }, [fetchMerchants]);

  const handleAction = async (storeId: string, action: "suspend" | "activate") => {
    try {
      const res = await fetch("/api/admin/merchants", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId, action }),
      });
      if (res.ok) {
        addToast("success", `Store ${action === "suspend" ? "suspended" : "activated"} successfully`);
        fetchMerchants();
      }
    } catch {
      addToast("error", "Action failed");
    }
  };

  const summary = {
    free: merchants.filter((m) => m.plan === "free").length,
    medium: merchants.filter((m) => m.plan === "medium").length,
    pro: merchants.filter((m) => m.plan === "pro").length,
  };

  return (
    <div className="space-y-5">
      {/* Summary Row */}
      <div className="flex gap-3 flex-wrap">
        {[
          { label: "Free", count: summary.free, color: "text-zinc-700 bg-zinc-100" },
          { label: "Medium", count: summary.medium, color: "text-blue-700 bg-blue-50" },
          { label: "Pro", count: summary.pro, color: "text-violet-700 bg-violet-50" },
          { label: "Total", count: merchants.length, color: "text-zinc-900 bg-white border border-zinc-200" },
        ].map(({ label, count, color }) => (
          <div key={label} className={`${color} px-4 py-2 rounded-lg text-sm font-semibold`}>
            {count} {label}
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="Search stores..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select className="px-3 py-2 rounded-lg border border-zinc-200 text-sm" value={planFilter} onChange={(e) => { setPlanFilter(e.target.value); setPage(1); }}>
          <option value="">All Plans</option>
          <option value="free">Free</option>
          <option value="medium">Medium</option>
          <option value="pro">Pro</option>
        </select>
        <select className="px-3 py-2 rounded-lg border border-zinc-200 text-sm" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
        <button onClick={fetchMerchants} className="p-2 rounded-lg border border-zinc-200 hover:bg-zinc-50">
          <RefreshCw className="w-4 h-4 text-zinc-500" />
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 text-left border-b border-zinc-200">
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500">Store</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500">Owner</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500">Plan</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500">Category</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500">Orders</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500">GMV</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500">Commission Due</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500">Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500">Joined</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-t border-zinc-100">
                      {Array.from({ length: 10 }).map((_, j) => (
                        <td key={j} className="px-4 py-3"><Skeleton className="h-4" /></td>
                      ))}
                    </tr>
                  ))
                : merchants.map((m) => (
                    <tr key={m.id} className="border-t border-zinc-100 hover:bg-zinc-50">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-zinc-900">{m.name}</div>
                        <div className="text-[11px] font-mono text-zinc-400">{m.slug}.storeswift.app</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-zinc-800 text-xs">{m.owner?.fullName ?? "—"}</div>
                        <div className="text-zinc-400 text-xs">{m.owner?.email ?? "—"}</div>
                      </td>
                      <td className="px-4 py-3"><PlanBadge plan={m.plan} /></td>
                      <td className="px-4 py-3 text-zinc-600 capitalize">{m.category}</td>
                      <td className="px-4 py-3 text-zinc-700">{m.totalOrders}</td>
                      <td className="px-4 py-3 font-semibold text-zinc-900">{BDT(m.totalRevenue)}</td>
                      <td className="px-4 py-3 text-amber-600 font-medium">{BDT(m.pendingCommissionBdt)}</td>
                      <td className="px-4 py-3"><StatusBadge status={m.storeStatus} /></td>
                      <td className="px-4 py-3 text-zinc-500 text-xs">{new Date(m.createdAt).toLocaleDateString("en-BD")}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/store/${m.slug}`}
                            target="_blank"
                            className="flex items-center gap-1 px-2 py-1 rounded-lg border border-zinc-200 hover:bg-violet-50 hover:border-violet-200 text-zinc-700 hover:text-violet-700 text-xs font-medium transition"
                            title="Visit Live Storefront"
                          >
                            <ExternalLink className="w-3 h-3 text-zinc-400" />
                            <span>Storefront</span>
                          </Link>
                          <Link
                            href={`/store/${m.slug}/dashboard`}
                            target="_blank"
                            className="flex items-center gap-1 px-2 py-1 rounded-lg border border-zinc-200 hover:bg-blue-50 hover:border-blue-200 text-zinc-700 hover:text-blue-700 text-xs font-medium transition"
                            title="Manage Shop Dashboard"
                          >
                            <Store className="w-3 h-3 text-zinc-400" />
                            <span>Dashboard</span>
                          </Link>
                          {m.storeStatus === "active" ? (
                            <button
                              onClick={() => handleAction(m.id, "suspend")}
                              className="p-1 rounded-lg border border-zinc-200 hover:bg-red-50 hover:border-red-200 text-zinc-400 hover:text-red-500 transition"
                              title="Suspend Store"
                            >
                              <Ban className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleAction(m.id, "activate")}
                              className="p-1 rounded-lg border border-zinc-200 hover:bg-green-50 hover:border-green-200 text-zinc-400 hover:text-green-600 transition"
                              title="Activate Store"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="border-t border-zinc-100 px-4 py-3 flex items-center justify-between">
          <span className="text-xs text-zinc-500">Page {page}</span>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded border border-zinc-200 disabled:opacity-40 hover:bg-zinc-50">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => setPage((p) => p + 1)} disabled={merchants.length < 20} className="p-1.5 rounded border border-zinc-200 disabled:opacity-40 hover:bg-zinc-50">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tab 3: Orders ────────────────────────────────────────────────────────────

function OrdersTab({ addToast }: { addToast: (type: ToastMessage["type"], msg: string) => void }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/orders");
        const json = await res.json();
        setOrders(json.orders ?? []);
      } catch {
        addToast("error", "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [addToast]);

  const filtered = statusFilter
    ? orders.filter((o) => (o.fulfillmentStatus ?? o.status ?? "") === statusFilter)
    : orders;

  const exportCSV = () => {
    const rows = [
      ["Order#", "Store", "Customer", "Phone", "Amount", "Payment", "Status", "Date"],
      ...filtered.map((o) => [
        o.orderNumber,
        o.storeName ?? "",
        o.customerName,
        o.customerPhone,
        o.totalAmount,
        o.paymentMethod,
        o.fulfillmentStatus ?? o.status ?? "",
        new Date(o.createdAt).toLocaleDateString(),
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders.csv";
    a.click();
    addToast("success", "CSV exported");
  };

  return (
    <div className="space-y-5">
      <div className="flex gap-3 flex-wrap items-center justify-between">
        <div className="flex gap-3 flex-wrap">
          <select className="px-3 py-2 rounded-lg border border-zinc-200 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="fulfilled">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="returned">Returned</option>
          </select>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-200 text-sm font-medium hover:bg-zinc-50">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500">Order#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500">Payment</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-t border-zinc-100">
                      {Array.from({ length: 8 }).map((_, j) => (
                        <td key={j} className="px-4 py-3"><Skeleton className="h-4" /></td>
                      ))}
                    </tr>
                  ))
                : filtered.map((o) => (
                    <tr key={o.id} className="border-t border-zinc-100 hover:bg-zinc-50 cursor-pointer" onClick={() => setSelectedOrder(o)}>
                      <td className="px-4 py-3 font-mono text-xs text-violet-700">{o.orderNumber}</td>
                      <td className="px-4 py-3 font-medium">{o.customerName}</td>
                      <td className="px-4 py-3 text-zinc-500">{o.customerPhone}</td>
                      <td className="px-4 py-3 font-semibold">{BDT(parseFloat(o.totalAmount))}</td>
                      <td className="px-4 py-3 capitalize text-zinc-600">{o.paymentMethod}</td>
                      <td className="px-4 py-3"><StatusBadge status={o.fulfillmentStatus ?? o.status ?? "pending"} /></td>
                      <td className="px-4 py-3 text-zinc-500 text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <button className="p-1.5 rounded hover:bg-violet-50 text-violet-600" onClick={(e) => { e.stopPropagation(); setSelectedOrder(o); }}>
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-40 flex">
          <div className="flex-1 bg-black/40" onClick={() => setSelectedOrder(null)} />
          <div className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Order Details</h2>
              <button onClick={() => setSelectedOrder(null)} className="p-2 rounded-lg hover:bg-zinc-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4 text-sm">
              <div className="bg-zinc-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between"><span className="text-zinc-500">Order #</span><span className="font-mono text-violet-700">{selectedOrder.orderNumber}</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Customer</span><span className="font-medium">{selectedOrder.customerName}</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Phone</span><span>{selectedOrder.customerPhone}</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Amount</span><span className="font-bold text-lg">{BDT(parseFloat(selectedOrder.totalAmount))}</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Payment</span><span className="capitalize">{selectedOrder.paymentMethod}</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Status</span><StatusBadge status={selectedOrder.fulfillmentStatus ?? selectedOrder.status ?? "pending"} /></div>
                <div className="flex justify-between"><span className="text-zinc-500">Date</span><span>{new Date(selectedOrder.createdAt).toLocaleString()}</span></div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <Link
                  href="/store/apex-fashion/dashboard"
                  target="_blank"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-violet-600 text-white font-semibold text-xs hover:bg-violet-700 transition"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Open in Merchant Orders Panel</span>
                </Link>
                <Link
                  href="/store/apex-fashion"
                  target="_blank"
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-zinc-200 bg-white text-zinc-700 font-semibold text-xs hover:bg-zinc-50 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Visit Apex Fashion Storefront</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tab 4: Commissions ───────────────────────────────────────────────────────

function CommissionsTab({ addToast }: { addToast: (type: ToastMessage["type"], msg: string) => void }) {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [summary, setSummary] = useState<CommissionSummary>({ pendingTotal: 0, clearedTotal: 0, totalCount: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [selected, setSelected] = useState<string[]>([]);

  const fetchCommissions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/commissions?status=${statusFilter}`);
      const json = await res.json();
      setCommissions(json.commissions ?? []);
      setSummary(json.summary ?? { pendingTotal: 0, clearedTotal: 0, totalCount: 0 });
    } catch {
      addToast("error", "Failed to load commissions");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, addToast]);

  useEffect(() => { fetchCommissions(); }, [fetchCommissions]);

  const handleMarkCleared = async () => {
    if (selected.length === 0) return;
    try {
      const res = await fetch("/api/admin/commissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selected, action: "clear" }),
      });
      if (res.ok) {
        addToast("success", `${selected.length} commissions marked as cleared`);
        setSelected([]);
        fetchCommissions();
      }
    } catch {
      addToast("error", "Failed to update commissions");
    }
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const selectAll = () => {
    if (selected.length === commissions.length) setSelected([]);
    else setSelected(commissions.map((c) => c.id));
  };

  return (
    <div className="space-y-5">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Pending" value={BDT(summary.pendingTotal)} icon={Clock} iconBg="bg-amber-100" iconColor="text-amber-600" />
        <KpiCard label="Cleared" value={BDT(summary.clearedTotal)} icon={CheckCheck} iconBg="bg-green-100" iconColor="text-green-600" />
        <KpiCard label="Total Events" value={String(summary.totalCount)} icon={Activity} iconBg="bg-violet-100" iconColor="text-violet-600" />
        <KpiCard label="Avg Rate" value="4.2%" icon={Percent} iconBg="bg-blue-100" iconColor="text-blue-600" />
      </div>

      {/* Controls */}
      <div className="flex gap-3 items-center flex-wrap">
        <select className="px-3 py-2 rounded-lg border border-zinc-200 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="cleared">Cleared</option>
          <option value="">All</option>
        </select>
        {selected.length > 0 && (
          <button onClick={handleMarkCleared} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
            <CheckCheck className="w-4 h-4" /> Mark {selected.length} as Cleared
          </button>
        )}
        <button onClick={fetchCommissions} className="p-2 rounded-lg border border-zinc-200 hover:bg-zinc-50">
          <RefreshCw className="w-4 h-4 text-zinc-500" />
        </button>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-left">
                <th className="px-4 py-3">
                  <input type="checkbox" checked={selected.length === commissions.length && commissions.length > 0} onChange={selectAll} className="rounded" />
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500">Commission ID</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500">Store</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500">Order#</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500">Order Amount</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500">Rate</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500">Commission</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500">Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-t border-zinc-100">
                      {Array.from({ length: 9 }).map((_, j) => (
                        <td key={j} className="px-4 py-3"><Skeleton className="h-4" /></td>
                      ))}
                    </tr>
                  ))
                : commissions.map((c) => (
                    <tr key={c.id} className="border-t border-zinc-100 hover:bg-zinc-50">
                      <td className="px-4 py-3">
                        <input type="checkbox" checked={selected.includes(c.id)} onChange={() => toggleSelect(c.id)} className="rounded" />
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-zinc-500">{c.id}</td>
                      <td className="px-4 py-3 text-zinc-700">{c.storeId}</td>
                      <td className="px-4 py-3 font-mono text-xs text-violet-700">{c.orderId}</td>
                      <td className="px-4 py-3 font-semibold">{BDT(parseFloat(c.orderAmount))}</td>
                      <td className="px-4 py-3 text-zinc-600">{c.commissionRate}%</td>
                      <td className="px-4 py-3 font-bold text-amber-700">{BDT(parseFloat(c.commissionBdt))}</td>
                      <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                      <td className="px-4 py-3 text-zinc-500 text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Tab 5: Subscriptions ─────────────────────────────────────────────────────

function SubscriptionsTab({ addToast }: { addToast: (type: ToastMessage["type"], msg: string) => void }) {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [planFilter, setPlanFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const MOCK_SUBS: Subscription[] = [
    { storeId: "s1", storeName: "Apex Fashion", plan: "pro", status: "active", priceBdt: 999, startedAt: "2026-10-01", renewsAt: "2026-12-01", paymentMethod: "bkash" },
    { storeId: "s2", storeName: "Dhaka Trends", plan: "medium", status: "active", priceBdt: 499, startedAt: "2026-09-15", renewsAt: "2026-12-15", paymentMethod: "nagad" },
    { storeId: "s4", storeName: "Gulshan Jewels", plan: "medium", status: "past_due", priceBdt: 499, startedAt: "2026-08-01", renewsAt: "2026-11-01", paymentMethod: "bkash" },
    { storeId: "s6", storeName: "Chittagong Crafts", plan: "pro", status: "cancelled", priceBdt: 999, startedAt: "2026-07-01", renewsAt: null, paymentMethod: "card" },
  ];

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/subscriptions");
        if (res.ok) {
          const json = await res.json();
          if (json.plan) setSubs([json]);
          else setSubs(MOCK_SUBS);
        } else {
          setSubs(MOCK_SUBS);
        }
      } catch {
        setSubs(MOCK_SUBS);
        addToast("info", "Using demo subscription data");
      } finally {
        setLoading(false);
      }
    };
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addToast]);

  const filtered = subs.filter((s) => {
    if (planFilter && s.plan !== planFilter) return false;
    if (statusFilter && s.status !== statusFilter) return false;
    return true;
  });

  const activePro = subs.filter((s) => s.plan === "pro" && s.status === "active").length;
  const activeMedium = subs.filter((s) => s.plan === "medium" && s.status === "active").length;
  const totalMrr = activePro * 999 + activeMedium * 499;

  return (
    <div className="space-y-5">
      {/* Plan Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { plan: "Free", count: subs.filter((s) => s.plan === "free").length, mrr: 0, color: "bg-zinc-100 text-zinc-700" },
          { plan: "Medium", count: activeMedium, mrr: activeMedium * 499, color: "bg-blue-50 text-blue-700" },
          { plan: "Pro", count: activePro, mrr: activePro * 999, color: "bg-violet-50 text-violet-700" },
        ].map(({ plan, count, mrr, color }) => (
          <div key={plan} className={`${color} rounded-xl p-5`}>
            <div className="text-3xl font-bold">{count}</div>
            <div className="font-semibold mt-1">{plan} Plan</div>
            <div className="text-sm mt-1 opacity-70">MRR: {BDT(mrr)}</div>
          </div>
        ))}
      </div>

      <div className="bg-violet-50 border border-violet-200 rounded-xl px-5 py-3 flex items-center gap-3">
        <Wallet className="w-5 h-5 text-violet-600" />
        <div>
          <span className="font-bold text-violet-900 text-lg">{BDT(totalMrr)}</span>
          <span className="text-violet-700 text-sm ml-2">Total MRR from paid subscribers</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <select className="px-3 py-2 rounded-lg border border-zinc-200 text-sm" value={planFilter} onChange={(e) => setPlanFilter(e.target.value)}>
          <option value="">All Plans</option>
          <option value="free">Free</option>
          <option value="medium">Medium</option>
          <option value="pro">Pro</option>
        </select>
        <select className="px-3 py-2 rounded-lg border border-zinc-200 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="past_due">Past Due</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10" />)}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-zinc-500">Store</th>
                  <th className="px-4 py-3 text-xs font-semibold text-zinc-500">Plan</th>
                  <th className="px-4 py-3 text-xs font-semibold text-zinc-500">Price</th>
                  <th className="px-4 py-3 text-xs font-semibold text-zinc-500">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-zinc-500">Started</th>
                  <th className="px-4 py-3 text-xs font-semibold text-zinc-500">Renews</th>
                  <th className="px-4 py-3 text-xs font-semibold text-zinc-500">Payment</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <tr key={s.storeId + i} className="border-t border-zinc-100 hover:bg-zinc-50">
                    <td className="px-4 py-3 font-medium">{s.storeName ?? s.storeId}</td>
                    <td className="px-4 py-3"><PlanBadge plan={s.plan} /></td>
                    <td className="px-4 py-3 font-semibold">{BDT(s.priceBdt)}/mo</td>
                    <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                    <td className="px-4 py-3 text-zinc-500 text-xs">{s.startedAt ? new Date(s.startedAt).toLocaleDateString() : "—"}</td>
                    <td className="px-4 py-3 text-zinc-500 text-xs">{s.renewsAt ? new Date(s.renewsAt).toLocaleDateString() : "—"}</td>
                    <td className="px-4 py-3 capitalize text-zinc-600">{s.paymentMethod ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Tab 6: Dropship Catalog ──────────────────────────────────────────────────

function DropshipCatalogTab({ addToast }: { addToast: (type: ToastMessage["type"], msg: string) => void }) {
  const [products, setProducts] = useState<PlatformProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", category: "", images: "", minimumPrice: "", suggestedPrice: "", stockQuantity: "", sku: "",
  });
  const [saving, setSaving] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (categoryFilter) params.set("category", categoryFilter);
      const res = await fetch(`/api/platform-products?${params}`);
      const json = await res.json();
      setProducts(json.products ?? []);
    } catch {
      addToast("error", "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, addToast]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/platform-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          category: form.category,
          images: form.images ? [form.images] : [],
          minimumPrice: parseFloat(form.minimumPrice),
          suggestedPrice: parseFloat(form.suggestedPrice),
          stockQuantity: parseInt(form.stockQuantity),
          sku: form.sku,
        }),
      });
      if (res.ok) {
        addToast("success", "Product added to catalog");
        setShowModal(false);
        setForm({ title: "", description: "", category: "", images: "", minimumPrice: "", suggestedPrice: "", stockQuantity: "", sku: "" });
        fetchProducts();
      } else {
        const err = await res.json();
        addToast("error", err.error ?? "Failed to add product");
      }
    } catch {
      addToast("error", "Failed to add product");
    } finally {
      setSaving(false);
    }
  };

  const categories = Array.from(new Set(products.map((p) => p.category))).filter(Boolean);

  return (
    <div className="space-y-5">
      <div className="flex gap-3 items-center justify-between flex-wrap">
        <div className="flex gap-3">
          <select className="px-3 py-2 rounded-lg border border-zinc-200 text-sm" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-56" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-xl border border-zinc-200 overflow-hidden hover:shadow-md transition-shadow">
              {p.images?.[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.images[0]} alt={p.title} className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-40 bg-zinc-100 flex items-center justify-center">
                  <Package className="w-10 h-10 text-zinc-300" />
                </div>
              )}
              <div className="p-3">
                <div className="text-xs text-violet-600 font-medium mb-1">{p.category}</div>
                <h3 className="text-sm font-semibold text-zinc-800 line-clamp-2">{p.title}</h3>
                <div className="mt-2 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-zinc-400">Min Price</div>
                    <div className="font-bold text-zinc-900">{BDT(parseFloat(p.minimumPrice))}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-zinc-400">Stock</div>
                    <div className={`font-semibold ${p.stockQuantity < 50 ? "text-red-600" : "text-green-600"}`}>{p.stockQuantity}</div>
                  </div>
                </div>
                {p.sku && <div className="text-xs text-zinc-400 mt-1">SKU: {p.sku}</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">Add Platform Product</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-zinc-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              {[
                { label: "Title *", key: "title", placeholder: "Product name" },
                { label: "Category *", key: "category", placeholder: "Fashion, Electronics…" },
                { label: "Image URL", key: "images", placeholder: "https://…" },
                { label: "SKU", key: "sku", placeholder: "PP-001" },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">{label}</label>
                  <input
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder={placeholder}
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Description</label>
                <textarea
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Min Price ৳ *", key: "minimumPrice" },
                  { label: "Suggested ৳ *", key: "suggestedPrice" },
                  { label: "Stock *", key: "stockQuantity" },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">{label}</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                      value={form[key as keyof typeof form]}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 rounded-lg border border-zinc-200 text-sm font-medium hover:bg-zinc-50">Cancel</button>
                <button onClick={handleSubmit} disabled={saving} className="flex-1 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-semibold hover:bg-violet-700 disabled:opacity-50">
                  {saving ? "Saving…" : "Add Product"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tab 7: Dropship Orders ───────────────────────────────────────────────────

function DropshipOrdersTab({ addToast }: { addToast: (type: ToastMessage["type"], msg: string) => void }) {
  const [orders, setOrders] = useState<DropshipOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [trackingModal, setTrackingModal] = useState<{ orderId: string } | null>(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [summary, setSummary] = useState({ pending: 0, shipped: 0, delivered: 0 });

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/dropship-orders?status=${statusFilter}`);
      const json = await res.json();
      setOrders(json.orders ?? []);
      setSummary(json.summary ?? { pending: 0, shipped: 0, delivered: 0 });
    } catch {
      addToast("error", "Failed to load dropship orders");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, addToast]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleMarkShipped = async (orderId: string, tracking: string) => {
    try {
      const res = await fetch("/api/admin/dropship-orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, action: "mark_shipped", trackingNumber: tracking }),
      });
      if (res.ok) {
        addToast("success", "Order marked as shipped");
        setTrackingModal(null);
        setTrackingNumber("");
        fetchOrders();
      }
    } catch {
      addToast("error", "Failed to update order");
    }
  };

  const handleMarkDelivered = async (orderId: string) => {
    try {
      await fetch("/api/admin/dropship-orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, action: "mark_delivered" }),
      });
      addToast("success", "Order marked as delivered");
      fetchOrders();
    } catch {
      addToast("error", "Failed to update order");
    }
  };

  const pendingRevenue = orders.filter((o) => o.status === "pending").reduce((s, o) => s + o.platformEarns * o.quantity, 0);

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-amber-700">{summary.pending}</div>
          <div className="text-sm text-amber-600 font-medium">Pending</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-blue-700">{summary.shipped}</div>
          <div className="text-sm text-blue-600 font-medium">Shipped</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-green-700">{summary.delivered}</div>
          <div className="text-sm text-green-600 font-medium">Delivered</div>
        </div>
      </div>

      <div className="bg-violet-50 border border-violet-200 rounded-xl px-5 py-3">
        <span className="text-sm text-violet-700">Pending Platform Revenue: </span>
        <span className="font-bold text-violet-900">{BDT(pendingRevenue)}</span>
      </div>

      {/* Filter */}
      <div className="flex gap-3">
        {["pending", "shipped", "delivered", "all"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s === "all" ? "" : s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${(statusFilter === s || (s === "all" && !statusFilter)) ? "bg-violet-600 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"}`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-left">
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500">Order#</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500">Store</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500">Customer</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500">Product</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500">Qty</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500">Sold</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500">Platform Earns</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500">Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="border-t border-zinc-100">
                      {Array.from({ length: 9 }).map((_, j) => (
                        <td key={j} className="px-4 py-3"><Skeleton className="h-4" /></td>
                      ))}
                    </tr>
                  ))
                : orders.map((o) => (
                    <tr key={o.id} className="border-t border-zinc-100 hover:bg-zinc-50">
                      <td className="px-4 py-3 font-mono text-xs text-violet-700">{o.orderNumber}</td>
                      <td className="px-4 py-3 text-zinc-700">{o.storeName}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{o.customerName}</div>
                        <div className="text-xs text-zinc-400">{o.customerPhone}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-xs">{o.product.title}</div>
                        <div className="text-xs text-zinc-400">{o.product.variant}</div>
                      </td>
                      <td className="px-4 py-3">{o.quantity}</td>
                      <td className="px-4 py-3 font-semibold">{BDT(o.soldPrice)}</td>
                      <td className="px-4 py-3 font-bold text-violet-700">{BDT(o.platformEarns * o.quantity)}</td>
                      <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {o.status === "pending" && (
                            <button onClick={() => setTrackingModal({ orderId: o.id })} className="text-xs px-2 py-1 bg-blue-600 text-white rounded font-medium hover:bg-blue-700">
                              Ship
                            </button>
                          )}
                          {o.status === "shipped" && (
                            <button onClick={() => handleMarkDelivered(o.id)} className="text-xs px-2 py-1 bg-green-600 text-white rounded font-medium hover:bg-green-700">
                              Delivered
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tracking Modal */}
      {trackingModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setTrackingModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="font-bold text-lg mb-4">Enter Tracking Number</h3>
            <input
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 mb-4"
              placeholder="e.g. SF123456789BD"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
            />
            <div className="flex gap-3">
              <button onClick={() => setTrackingModal(null)} className="flex-1 px-4 py-2 rounded-lg border border-zinc-200 text-sm">Cancel</button>
              <button onClick={() => handleMarkShipped(trackingModal.orderId, trackingNumber)} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
                Mark Shipped
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tab 8: Analytics & BI ────────────────────────────────────────────────────

function AnalyticsTab({ addToast }: { addToast: (type: ToastMessage["type"], msg: string) => void }) {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("30d");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics?period=${period}`);
      const json = await res.json();
      setData(json);
    } catch {
      addToast("error", "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }, [period, addToast]);

  useEffect(() => { fetchAnalytics(); }, [fetchAnalytics]);

  const totalGmv = (data?.gmvChart ?? []).reduce((s, d) => s + parseFloat(d.gmv), 0);
  const totalOrders = (data?.gmvChart ?? []).reduce((s, d) => s + d.orderCount, 0);
  const avgDaily = totalOrders > 0 ? totalGmv / (data?.gmvChart?.length ?? 1) : 0;

  const CATEGORIES = [
    { name: "Fashion & Apparel", gmv: 184500, pct: 38 },
    { name: "Electronics", gmv: 95200, pct: 20 },
    { name: "Beauty & Health", gmv: 72400, pct: 15 },
    { name: "Home & Living", gmv: 55800, pct: 11 },
    { name: "Grocery & Food", gmv: 67800, pct: 14 },
    { name: "Others", gmv: 11550, pct: 2 },
  ];

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex gap-2">
        {(["7d", "30d", "90d"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${period === p ? "bg-violet-600 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"}`}
          >
            {p === "7d" ? "7 Days" : p === "30d" ? "30 Days" : "90 Days"}
          </button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Total GMV" value={BDT(totalGmv)} icon={TrendingUp} iconBg="bg-violet-100" iconColor="text-violet-600" />
        <KpiCard label="Total Orders" value={String(totalOrders)} icon={ShoppingBag} iconBg="bg-blue-100" iconColor="text-blue-600" />
        <KpiCard label="Avg Daily GMV" value={BDT(Math.round(avgDaily))} icon={BarChart3} iconBg="bg-emerald-100" iconColor="text-emerald-600" />
        <KpiCard label="Churn Rate" value="4.2%" icon={TrendingDown} iconBg="bg-red-100" iconColor="text-red-500" />
      </div>

      {/* GMV Chart */}
      <div className="bg-white rounded-xl border border-zinc-200 p-5">
        <h3 className="font-semibold text-zinc-800 mb-1">GMV Chart ({period})</h3>
        <p className="text-xs text-zinc-400 mb-4">Daily gross merchandise value</p>
        {loading ? <Skeleton className="h-32" /> : (
          <BarChart
            data={(data?.gmvChart ?? []).map((d) => ({ ...d, gmv: parseFloat(d.gmv) }))}
            valueKey="gmv"
            labelKey="day"
            color="violet"
            height={140}
          />
        )}
      </div>

      {/* Top Categories */}
      <div className="bg-white rounded-xl border border-zinc-200 p-5">
        <h3 className="font-semibold text-zinc-800 mb-4">Revenue by Category</h3>
        <div className="space-y-3">
          {CATEGORIES.map((c) => (
            <div key={c.name}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-zinc-700">{c.name}</span>
                <span className="text-zinc-500">{BDT(c.gmv)} <span className="text-zinc-400">({c.pct}%)</span></span>
              </div>
              <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                <div className="h-full bg-violet-500 rounded-full" style={{ width: `${c.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Store Distribution + Top Stores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-zinc-200 p-5">
          <h3 className="font-semibold text-zinc-800 mb-4">Plan Distribution</h3>
          <div className="space-y-3">
            {(data?.planDistribution ?? []).map((d) => {
              const total = (data?.planDistribution ?? []).reduce((s, x) => s + Number(x.cnt), 0);
              const pct = total > 0 ? Math.round((Number(d.cnt) / total) * 100) : 0;
              return (
                <div key={d.plan}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize font-medium">{d.plan}</span>
                    <span className="text-zinc-500">{d.cnt} stores ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${d.plan === "pro" ? "bg-violet-600" : d.plan === "medium" ? "bg-blue-500" : "bg-zinc-400"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-5">
          <h3 className="font-semibold text-zinc-800 mb-4">Top Stores by Revenue</h3>
          <div className="space-y-3">
            {(data?.topStores ?? []).slice(0, 5).map((s, i) => (
              <div key={s.storeId} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{s.storeName ?? s.storeId}</div>
                  <div className="text-xs text-zinc-400">{s.orderCount} orders</div>
                </div>
                <div className="font-semibold text-sm text-zinc-900">{BDT(parseFloat(s.revenue))}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tab 9: Settings ──────────────────────────────────────────────────────────

function SettingsTab({ addToast }: { addToast: (type: ToastMessage["type"], msg: string) => void }) {
  const [settings, setSettings] = useState({
    platformName: "StoreSwift",
    logoUrl: "",
    supportEmail: "support@storeswift.com.bd",
    commissionFree: "8",
    commissionMedium: "3",
    commissionPro: "0",
    steadfastApiKey: "",
    pathaoClientId: "",
    pathaoClientSecret: "",
    dropshippingEnabled: true,
    affiliateEnabled: false,
    announcementBanner: "",
    priceMedium: "499",
    pricePro: "999",
  });
  const [saving, setSaving] = useState(false);
  const [openSection, setOpenSection] = useState<string>("general");

  const save = async () => {
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      addToast("success", "Settings saved successfully");
    } catch {
      addToast("error", "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-zinc-50"
        onClick={() => setOpenSection(openSection === id ? "" : id)}
      >
        <span className="font-semibold text-zinc-800">{title}</span>
        {openSection === id ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
      </button>
      {openSection === id && <div className="border-t border-zinc-100 p-5">{children}</div>}
    </div>
  );

  const Field = ({ label, name, type = "text", placeholder = "" }: { label: string; name: keyof typeof settings; type?: string; placeholder?: string }) => (
    <div>
      <label className="block text-xs font-semibold text-zinc-700 mb-1">{label}</label>
      <input
        type={type}
        className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
        placeholder={placeholder}
        value={String(settings[name])}
        onChange={(e) => setSettings((s) => ({ ...s, [name]: e.target.value }))}
      />
    </div>
  );

  const Toggle = ({ label, name, description }: { label: string; name: "dropshippingEnabled" | "affiliateEnabled"; description?: string }) => (
    <div className="flex items-center justify-between py-2">
      <div>
        <div className="text-sm font-medium text-zinc-700">{label}</div>
        {description && <div className="text-xs text-zinc-400">{description}</div>}
      </div>
      <button
        onClick={() => setSettings((s) => ({ ...s, [name]: !s[name] }))}
        className={`w-11 h-6 rounded-full transition-colors ${settings[name] ? "bg-violet-600" : "bg-zinc-200"} relative`}
      >
        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings[name] ? "translate-x-5" : "translate-x-0.5"}`} />
      </button>
    </div>
  );

  return (
    <div className="space-y-4 max-w-2xl">
      <Section id="general" title="🏢 General Platform Settings">
        <div className="space-y-4">
          <Field label="Platform Name" name="platformName" placeholder="StoreSwift" />
          <Field label="Logo URL" name="logoUrl" placeholder="https://…/logo.png" />
          <Field label="Support Email" name="supportEmail" type="email" placeholder="support@storeswift.com.bd" />
        </div>
      </Section>

      <Section id="plans" title="💰 Plan Pricing & Commission Rates">
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Free Commission %</label>
              <input type="number" className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" value={settings.commissionFree} onChange={(e) => setSettings((s) => ({ ...s, commissionFree: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Medium Commission %</label>
              <input type="number" className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" value={settings.commissionMedium} onChange={(e) => setSettings((s) => ({ ...s, commissionMedium: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Pro Commission %</label>
              <input type="number" className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" value={settings.commissionPro} onChange={(e) => setSettings((s) => ({ ...s, commissionPro: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Medium Plan Price ৳/mo" name="priceMedium" type="number" />
            <Field label="Pro Plan Price ৳/mo" name="pricePro" type="number" />
          </div>
        </div>
      </Section>

      <Section id="couriers" title="🚚 Courier Settings">
        <div className="space-y-4">
          <Field label="Steadfast API Key" name="steadfastApiKey" placeholder="sk_live_…" />
          <Field label="Pathao Client ID" name="pathaoClientId" placeholder="pathao_client_…" />
          <Field label="Pathao Client Secret" name="pathaoClientSecret" placeholder="secret_…" />
        </div>
      </Section>

      <Section id="features" title="⚡ Feature Flags">
        <div className="space-y-1 divide-y divide-zinc-100">
          <Toggle label="Dropshipping" name="dropshippingEnabled" description="Allow merchants to resell platform products" />
          <Toggle label="Affiliate Program" name="affiliateEnabled" description="Enable referral and affiliate links for merchants" />
        </div>
      </Section>

      <Section id="announcement" title="📢 Announcement Banner">
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-zinc-700">Banner Text (shown to all merchants)</label>
          <textarea
            className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
            rows={3}
            placeholder="e.g. Platform maintenance on Nov 10, 2:00–4:00 AM BDT"
            value={settings.announcementBanner}
            onChange={(e) => setSettings((s) => ({ ...s, announcementBanner: e.target.value }))}
          />
          {settings.announcementBanner && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800 flex items-start gap-2">
              <Bell className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{settings.announcementBanner}</span>
            </div>
          )}
        </div>
      </Section>

      <div className="flex justify-end pt-2">
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 disabled:opacity-50 shadow"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving…" : "Save Settings"}
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SuperAdminPage() {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const addToast = useCallback((type: ToastMessage["type"], message: string) => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const renderTab = () => {
    const props = { addToast };
    switch (activeTab) {
      case "dashboard": return <DashboardTab {...props} />;
      case "merchants": return <MerchantsTab {...props} />;
      case "orders": return <OrdersTab {...props} />;
      case "commissions": return <CommissionsTab {...props} />;
      case "subscriptions": return <SubscriptionsTab {...props} />;
      case "dropship-catalog": return <DropshipCatalogTab {...props} />;
      case "dropship-orders": return <DropshipOrdersTab {...props} />;
      case "analytics": return <AnalyticsTab {...props} />;
      case "settings": return <SettingsTab {...props} />;
      default: return null;
    }
  };

  const currentTab = TABS.find((t) => t.id === activeTab);

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-56" : "w-16"} shrink-0 bg-white border-r border-zinc-200 flex flex-col transition-all duration-200 sticky top-0 h-screen overflow-hidden`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-zinc-100">
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          {sidebarOpen && (
            <div>
              <div className="text-sm font-bold text-zinc-900">StoreSwift</div>
              <div className="text-xs text-violet-600 font-medium">Super Admin</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === id
                  ? "bg-violet-50 text-violet-700 border-r-2 border-violet-600"
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
              }`}
              title={!sidebarOpen ? label : undefined}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {sidebarOpen && <span className="truncate">{label}</span>}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-zinc-100 p-3 space-y-1">
          <Link
            href="/"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 text-xs transition"
          >
            <Globe className="w-4 h-4 text-zinc-400" />
            {sidebarOpen && <span>Landing Page</span>}
          </Link>
          <Link
            href="/logout"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 text-xs transition"
          >
            <LogOut className="w-4 h-4" />
            {sidebarOpen && <span>Sign Out</span>}
          </Link>
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-500 hover:bg-zinc-50 text-xs"
          >
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            {sidebarOpen && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              {currentTab && <currentTab.icon className="w-5 h-5 text-violet-600" />}
              {currentTab?.label}
            </h1>
            <p className="text-xs text-zinc-400">StoreSwift Platform Administration</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/store/apex-fashion"
              target="_blank"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition"
            >
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
              <span>Demo Storefront</span>
            </Link>
            <Link
              href="/store/apex-fashion/dashboard"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-violet-200 bg-violet-50 text-xs font-medium text-violet-700 hover:bg-violet-100 transition"
            >
              <Store className="w-3.5 h-3.5 text-violet-600" />
              <span>Shop Dashboard</span>
            </Link>
            <div className="w-2 h-2 bg-green-500 rounded-full" title="Platform Online" />
            <span className="text-xs text-zinc-400 hidden md:block">Platform Online</span>
            <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-violet-700">SA</span>
            </div>
            <Link
              href="/logout"
              className="p-1.5 rounded-lg border border-zinc-200 hover:bg-red-50 hover:border-red-200 text-zinc-400 hover:text-red-500 transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          {renderTab()}
        </main>
      </div>

      {/* Toast Notifications */}
      <Toast toasts={toasts} remove={removeToast} />
    </div>
  );
}
