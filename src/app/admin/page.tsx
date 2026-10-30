"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Palette,
  CreditCard,
  Plus,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Truck,
  Printer,
  ExternalLink,
  Store,
  Trash2,
  CheckCircle2,
  Smartphone,
  Monitor,
  Search,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  Check,
  ChevronRight,
  RefreshCw
} from "lucide-react";
import { generateVariantMatrix, GeneratedVariant } from "@/lib/matrix";
import { generateStoreSeedData } from "@/lib/seed-store";

export default function MerchantAdminPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "inventory" | "orders" | "customizer" | "billing">("overview");
  const [storeSlug, setStoreSlug] = useState("apex-fashion");
  const [storeName, setStoreName] = useState("Apex Fashion Hub");
  const [currency, setCurrency] = useState("$");
  const [subscriptionPlan, setSubscriptionPlan] = useState("Starter ($9/mo)");

  // Theme customizer state
  const [announcementText, setAnnouncementText] = useState("⚡ Free shipping on orders over $50! Fast delivery.");
  const [primaryBrandColor, setPrimaryBrandColor] = useState("#18181b");
  const [heroHeadline, setHeroHeadline] = useState("Discover Quality Essentials");
  const [heroTagline, setHeroTagline] = useState("Trending styles, modern fits, and premium fabrics.");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Load store config from URL or localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const queryStore = params.get("store") || localStorage.getItem("current_store") || "apex-fashion";
      setStoreSlug(queryStore);
      const savedData = localStorage.getItem(`store_${queryStore}`);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          if (parsed.name) setStoreName(parsed.name);
          if (parsed.currency) setCurrency(parsed.currency === "BDT" ? "৳" : "$");
        } catch {}
      }
    }
  }, []);

  // Products state initialized with seed data
  const [productsList, setProductsList] = useState<Array<{
    id: string;
    title: string;
    sku: string;
    basePrice: string;
    stock: number;
    category: string;
    variants: GeneratedVariant[];
  }>>(() => {
    const seed = generateStoreSeedData("store-1", "fashion");
    return seed.products.map((p, idx) => ({
      id: `prod-${idx + 1}`,
      title: p.title,
      sku: `${p.slug.slice(0, 4).toUpperCase()}-001`,
      basePrice: p.basePrice,
      stock: 25,
      category: "Fashion",
      variants: seed.variants
        .filter(v => v.productSlug === p.slug)
        .map(v => ({
          title: v.title,
          sku: v.sku,
          price: v.price,
          inventoryQuantity: v.inventoryQuantity,
          options: v.options
        }))
    }));
  });

  // Orders state
  const [ordersList, setOrdersList] = useState([
    {
      id: "ord-1042",
      orderNumber: "#1042",
      customerName: "Alex Mercer",
      customerPhone: "+1 (555) 234-5678",
      items: "Classic Cotton T-Shirt (M / Black) x 2",
      totalAmount: 49.98,
      paymentMethod: "Cash on Delivery (COD)",
      paymentStatus: "Pending",
      fulfillmentStatus: "Unfulfilled",
      date: "Today, 10:45 AM"
    },
    {
      id: "ord-1041",
      orderNumber: "#1041",
      customerName: "Sarah Jenkins",
      customerPhone: "+1 (555) 890-1234",
      items: "Everyday Canvas Sneaker (Size: 9) x 1",
      totalAmount: 45.00,
      paymentMethod: "Stripe (Card)",
      paymentStatus: "Paid",
      fulfillmentStatus: "Shipped",
      date: "Yesterday"
    },
    {
      id: "ord-1040",
      orderNumber: "#1040",
      customerName: "David Miller",
      customerPhone: "+1 (555) 456-7890",
      items: "Slim-Fit Denim Jeans (32) x 1",
      totalAmount: 59.99,
      paymentMethod: "Cash on Delivery (COD)",
      paymentStatus: "Paid",
      fulfillmentStatus: "Delivered",
      date: "2 days ago"
    }
  ]);

  // Variant Matrix Generator modal state
  const [showMatrixModal, setShowMatrixModal] = useState(false);
  const [newProdTitle, setNewProdTitle] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("29.99");
  const [newProdSku, setNewProdSku] = useState("HOODIE");
  const [sizeOptionsInput, setSizeOptionsInput] = useState("S, M, L, XL");
  const [colorOptionsInput, setColorOptionsInput] = useState("Black, White, Heather Gray");
  const [generatedVariants, setGeneratedVariants] = useState<GeneratedVariant[]>([]);

  const handleComputeMatrix = () => {
    const sizes = sizeOptionsInput.split(",").map(s => s.trim()).filter(Boolean);
    const colors = colorOptionsInput.split(",").map(c => c.trim()).filter(Boolean);

    const matrix = generateVariantMatrix(newProdSku, newProdPrice, {
      Size: sizes,
      Color: colors
    });

    const withStock = matrix.map(v => ({ ...v, inventoryQuantity: 15 }));
    setGeneratedVariants(withStock);
  };

  const handleSaveMatrixProduct = () => {
    if (!newProdTitle.trim()) return;

    const totalStock = generatedVariants.reduce((sum, v) => sum + v.inventoryQuantity, 0);

    const newProd = {
      id: `prod-${Date.now()}`,
      title: newProdTitle,
      sku: `${newProdSku}-BASE`,
      basePrice: newProdPrice,
      stock: totalStock || 15,
      category: "Custom",
      variants: generatedVariants
    };

    setProductsList([newProd, ...productsList]);
    setShowMatrixModal(false);
    setNewProdTitle("");
    setGeneratedVariants([]);
  };

  const handleAdjustStock = (prodId: string, delta: number) => {
    setProductsList(prev =>
      prev.map(p => {
        if (p.id === prodId) {
          const newQty = Math.max(0, p.stock + delta);
          return { ...p, stock: newQty };
        }
        return p;
      })
    );
  };

  const handleUpdateOrderStatus = (orderId: string, status: string) => {
    setOrdersList(prev =>
      prev.map(o => (o.id === orderId ? { ...o, fulfillmentStatus: status } : o))
    );
  };

  const handleSaveCustomizer = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const [selectedInvoice, setSelectedInvoice] = useState<typeof ordersList[0] | null>(null);

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans selection:bg-zinc-900 selection:text-white">
      {/* Top App Header */}
      <header className="bg-white border-b border-zinc-200/80 sticky top-0 z-40 shadow-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white font-bold group-hover:scale-105 transition-transform">
                <Store className="w-4 h-4" />
              </div>
              <span className="font-bold text-zinc-900 tracking-tight hidden sm:inline text-sm">
                Store<span className="text-blue-600">Swift</span>
              </span>
            </Link>

            <span className="text-zinc-300 hidden sm:inline">/</span>

            {/* Active Store Chip */}
            <div className="flex items-center space-x-2 bg-zinc-50 border border-zinc-200/80 px-3 py-1.5 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-semibold text-xs text-zinc-900">{storeName}</span>
              <span className="text-[10px] text-zinc-400 font-mono hidden md:inline">
                ({storeSlug}.storeswift.com)
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link
              href={`/store/${storeSlug}`}
              target="_blank"
              className="inline-flex items-center space-x-1.5 text-xs font-semibold bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 px-3 py-1.5 rounded-xl transition shadow-subtle btn-press"
            >
              <span>View Storefront</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
            </Link>
          </div>
        </div>

        {/* Minimalist Sub-Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex space-x-1 sm:space-x-2 overflow-x-auto border-t border-zinc-100 py-1.5 text-xs font-medium text-zinc-500">
          {[
            { id: "overview", label: "Overview", icon: LayoutDashboard },
            { id: "products", label: `Products (${productsList.length})`, icon: Package },
            { id: "inventory", label: "Batch Inventory", icon: Layers },
            { id: "orders", label: `Orders (${ordersList.length})`, icon: ShoppingBag },
            { id: "customizer", label: "Store Theme", icon: Palette },
            { id: "billing", label: "Subscription", icon: CreditCard }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-2 rounded-lg flex items-center space-x-1.5 whitespace-nowrap transition-colors btn-press ${
                  isActive
                    ? "bg-zinc-900 text-white font-semibold shadow-sm"
                    : "hover:bg-zinc-100 hover:text-zinc-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8">
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-subtle">
                <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                  <span>Today's Sales</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-bold tracking-tight text-zinc-900 mt-2">
                  {currency}154.97
                </div>
                <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center space-x-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>+18% from yesterday</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-subtle">
                <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                  <span>Active Orders</span>
                  <ShoppingBag className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl font-bold tracking-tight text-zinc-900 mt-2">
                  {ordersList.length}
                </div>
                <div className="text-[11px] text-zinc-500 mt-1">
                  1 pending Cash on Delivery
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-subtle">
                <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                  <span>Catalog Products</span>
                  <Package className="w-4 h-4 text-zinc-700" />
                </div>
                <div className="text-2xl font-bold tracking-tight text-zinc-900 mt-2">
                  {productsList.length}
                </div>
                <div className="text-[11px] text-zinc-500 mt-1">
                  With multi-option matrices
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-subtle">
                <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                  <span>Inventory Health</span>
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-2xl font-bold tracking-tight text-zinc-900 mt-2">
                  {productsList.filter(p => p.stock < 10).length} Low Stock
                </div>
                <div className="text-[11px] text-amber-600 font-medium mt-1">
                  Restock recommended soon
                </div>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="p-4 bg-white border border-zinc-200/80 rounded-2xl shadow-subtle flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-zinc-700">Quick Actions:</span>
                <button
                  onClick={() => {
                    setActiveTab("products");
                    setShowMatrixModal(true);
                    handleComputeMatrix();
                  }}
                  className="px-3 py-1.5 bg-zinc-900 text-white text-xs font-semibold rounded-lg hover:bg-zinc-800 transition flex items-center space-x-1.5 btn-press"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Product</span>
                </button>
                <button
                  onClick={() => setActiveTab("inventory")}
                  className="px-3 py-1.5 bg-zinc-100 text-zinc-700 text-xs font-semibold rounded-lg hover:bg-zinc-200 transition btn-press"
                >
                  Adjust Stock
                </button>
              </div>

              <div className="flex items-center space-x-2 text-xs text-zinc-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Store status: Online & accepting orders</span>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-subtle p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-base font-bold text-zinc-900 tracking-tight">Recent Customer Orders</h2>
                  <p className="text-xs text-zinc-500">Live order stream across web & mobile</p>
                </div>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="text-xs font-semibold text-zinc-700 hover:text-zinc-900 flex items-center space-x-1"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="divide-y divide-zinc-100">
                {ordersList.slice(0, 3).map((ord) => (
                  <div key={ord.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-zinc-900 text-xs font-mono">{ord.orderNumber}</span>
                        <span className="text-zinc-300">•</span>
                        <span className="text-xs font-semibold text-zinc-800">{ord.customerName}</span>
                        <span className="text-[11px] text-zinc-400">({ord.date})</span>
                      </div>
                      <div className="text-xs text-zinc-500 mt-1">{ord.items}</div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className="font-bold text-zinc-900 text-sm">
                        {currency}{ord.totalAmount.toFixed(2)}
                      </span>
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                          ord.fulfillmentStatus === "Delivered"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                            : ord.fulfillmentStatus === "Shipped"
                            ? "bg-blue-50 text-blue-700 border-blue-200/60"
                            : "bg-amber-50 text-amber-700 border-amber-200/60"
                        }`}
                      >
                        {ord.fulfillmentStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-zinc-900">Product Catalog</h2>
                <p className="text-xs text-zinc-500">Manage products and multi-option variant matrices</p>
              </div>
              <button
                onClick={() => {
                  setShowMatrixModal(true);
                  handleComputeMatrix();
                }}
                className="inline-flex items-center space-x-1.5 text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2.5 rounded-xl shadow-sm transition btn-press"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product with Matrix</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-subtle overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 border-b border-zinc-100 text-[11px] font-semibold uppercase text-zinc-500">
                  <tr>
                    <th className="px-6 py-3.5">Product Title</th>
                    <th className="px-6 py-3.5">SKU</th>
                    <th className="px-6 py-3.5">Price</th>
                    <th className="px-6 py-3.5">Stock</th>
                    <th className="px-6 py-3.5">Variants</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {productsList.map((prod) => (
                    <tr key={prod.id} className="hover:bg-zinc-50/70 transition-colors">
                      <td className="px-6 py-4 font-semibold text-zinc-900">{prod.title}</td>
                      <td className="px-6 py-4 font-mono text-zinc-500">{prod.sku}</td>
                      <td className="px-6 py-4 font-semibold text-zinc-800">{currency}{prod.basePrice}</td>
                      <td className="px-6 py-4">
                        <span className={`font-semibold ${prod.stock < 10 ? "text-amber-600" : "text-emerald-600"}`}>
                          {prod.stock} units
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[11px] font-medium bg-zinc-100 px-2 py-0.5 rounded text-zinc-600">
                          {prod.variants.length > 0 ? `${prod.variants.length} combinations` : "Standard"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setProductsList(productsList.filter(p => p.id !== prod.id))}
                          className="text-zinc-400 hover:text-red-600 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 ml-auto" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: BATCH INVENTORY */}
        {activeTab === "inventory" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-zinc-900">Batch Stock Manager</h2>
              <p className="text-xs text-zinc-500">
                Adjust inventory levels across all catalog items in seconds without opening individual forms.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-subtle overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 border-b border-zinc-100 text-[11px] font-semibold uppercase text-zinc-500">
                  <tr>
                    <th className="px-6 py-3.5">Product Title</th>
                    <th className="px-6 py-3.5">SKU</th>
                    <th className="px-6 py-3.5">Current Stock</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Quick Stock Stepper</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {productsList.map((prod) => (
                    <tr key={prod.id} className="hover:bg-zinc-50/70 transition-colors">
                      <td className="px-6 py-4 font-semibold text-zinc-900">{prod.title}</td>
                      <td className="px-6 py-4 font-mono text-zinc-500">{prod.sku}</td>
                      <td className="px-6 py-4 font-bold text-sm text-zinc-900">{prod.stock}</td>
                      <td className="px-6 py-4">
                        {prod.stock === 0 ? (
                          <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                            Out of Stock
                          </span>
                        ) : prod.stock < 10 ? (
                          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                            Low Stock
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                            Healthy
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center space-x-1.5">
                          <button
                            onClick={() => handleAdjustStock(prod.id, -5)}
                            className="px-2 py-1 bg-zinc-100 hover:bg-zinc-200 rounded font-semibold text-[11px] text-zinc-700 btn-press"
                          >
                            -5
                          </button>
                          <button
                            onClick={() => handleAdjustStock(prod.id, -1)}
                            className="px-2 py-1 bg-zinc-100 hover:bg-zinc-200 rounded font-semibold text-[11px] text-zinc-700 btn-press"
                          >
                            -1
                          </button>
                          <button
                            onClick={() => handleAdjustStock(prod.id, 1)}
                            className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 text-white rounded font-semibold text-[11px] btn-press"
                          >
                            +1
                          </button>
                          <button
                            onClick={() => handleAdjustStock(prod.id, 10)}
                            className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 text-white rounded font-semibold text-[11px] btn-press"
                          >
                            +10
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: ORDERS */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-zinc-900">Order Fulfillment Pipeline</h2>
              <p className="text-xs text-zinc-500">Track orders, update delivery status, and print customer packing slips.</p>
            </div>

            <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-subtle overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 border-b border-zinc-100 text-[11px] font-semibold uppercase text-zinc-500">
                  <tr>
                    <th className="px-6 py-3.5">Order</th>
                    <th className="px-6 py-3.5">Customer & Phone</th>
                    <th className="px-6 py-3.5">Items</th>
                    <th className="px-6 py-3.5">Payment</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {ordersList.map((ord) => (
                    <tr key={ord.id} className="hover:bg-zinc-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-zinc-900 font-mono">{ord.orderNumber}</div>
                        <div className="text-[11px] text-zinc-400">{ord.date}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-zinc-800">{ord.customerName}</div>
                        <div className="text-[11px] text-zinc-500 font-mono">{ord.customerPhone}</div>
                      </td>
                      <td className="px-6 py-4 text-zinc-600 max-w-xs">{ord.items}</td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-zinc-900">{currency}{ord.totalAmount.toFixed(2)}</div>
                        <div className="text-[10px] text-zinc-400">{ord.paymentMethod}</div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={ord.fulfillmentStatus}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                          className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-zinc-200 bg-white outline-none focus:border-zinc-900"
                        >
                          <option value="Unfulfilled">Unfulfilled</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedInvoice(ord)}
                          className="inline-flex items-center space-x-1 text-xs font-semibold text-zinc-700 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 px-2.5 py-1 rounded-lg transition btn-press"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Print</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: THEME CUSTOMIZER */}
        {activeTab === "customizer" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-subtle space-y-6">
              <div>
                <h2 className="text-lg font-bold text-zinc-900 tracking-tight">Storefront Theme</h2>
                <p className="text-xs text-zinc-500">Edit branding, colors, and banner messaging.</p>
              </div>

              {savedSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Store styling updated successfully!</span>
                </div>
              )}

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-zinc-700 uppercase mb-1">
                    Announcement Bar Message
                  </label>
                  <input
                    type="text"
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs outline-none focus:border-zinc-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 uppercase mb-1">
                    Hero Main Headline
                  </label>
                  <input
                    type="text"
                    value={heroHeadline}
                    onChange={(e) => setHeroHeadline(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs outline-none focus:border-zinc-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 uppercase mb-1">
                    Hero Tagline
                  </label>
                  <textarea
                    rows={2}
                    value={heroTagline}
                    onChange={(e) => setHeroTagline(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs outline-none focus:border-zinc-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 uppercase mb-2">
                    Primary Brand Color
                  </label>
                  <div className="flex items-center space-x-3">
                    {["#18181b", "#2563eb", "#059669", "#7c3aed", "#d97706", "#e11d48"].map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setPrimaryBrandColor(color)}
                        className={`w-7 h-7 rounded-full border-2 transition ${
                          primaryBrandColor === color ? "border-zinc-900 scale-110 shadow-sm" : "border-transparent"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleSaveCustomizer}
                className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-sm transition btn-press"
              >
                Save Theme Changes
              </button>
            </div>

            {/* Live Interactive Frame Preview */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-500 uppercase">Live Preview Simulator</span>
                <div className="flex items-center space-x-1.5 bg-white border border-zinc-200 rounded-xl p-1 shadow-subtle">
                  <button
                    onClick={() => setPreviewDevice("desktop")}
                    className={`p-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 ${
                      previewDevice === "desktop" ? "bg-zinc-100 text-zinc-900" : "text-zinc-400"
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>Desktop</span>
                  </button>
                  <button
                    onClick={() => setPreviewDevice("mobile")}
                    className={`p-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 ${
                      previewDevice === "mobile" ? "bg-zinc-100 text-zinc-900" : "text-zinc-400"
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Mobile</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-center">
                <div
                  className={`bg-white rounded-2xl border border-zinc-300 shadow-card overflow-hidden transition-all duration-300 ${
                    previewDevice === "mobile" ? "w-[340px]" : "w-full"
                  }`}
                >
                  <div className="text-white text-[11px] py-1.5 px-3 text-center truncate font-medium bg-zinc-900">
                    {announcementText}
                  </div>

                  <div className="p-3.5 border-b border-zinc-100 flex items-center justify-between">
                    <span className="font-bold text-xs text-zinc-900">{storeName}</span>
                    <ShoppingBag className="w-3.5 h-3.5 text-zinc-400" />
                  </div>

                  <div
                    className="p-6 text-white text-center transition-colors"
                    style={{ backgroundColor: primaryBrandColor }}
                  >
                    <h3 className="font-bold text-base tracking-tight leading-snug">{heroHeadline}</h3>
                    <p className="text-[11px] text-white/80 mt-1 max-w-sm mx-auto">{heroTagline}</p>
                    <button className="mt-3 px-3 py-1 bg-white text-zinc-900 font-bold text-[11px] rounded-lg shadow-sm">
                      Shop Now
                    </button>
                  </div>

                  <div className="p-3.5 bg-zinc-50">
                    <div className="text-[11px] font-semibold text-zinc-700 mb-2.5">Featured Items</div>
                    <div className={`grid gap-2.5 ${previewDevice === "mobile" ? "grid-cols-2" : "grid-cols-3"}`}>
                      {productsList.slice(0, 3).map((p) => (
                        <div key={p.id} className="bg-white p-2.5 rounded-xl border border-zinc-200">
                          <div className="w-full h-14 bg-zinc-100 rounded-lg flex items-center justify-center text-zinc-300 mb-2">
                            <Package className="w-5 h-5" />
                          </div>
                          <div className="font-semibold text-[10px] text-zinc-900 truncate">{p.title}</div>
                          <div className="text-[10px] font-bold text-zinc-800 mt-0.5">{currency}{p.basePrice}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: BILLING */}
        {activeTab === "billing" && (
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200/80 shadow-subtle">
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-zinc-100">
                <div>
                  <span className="text-[11px] font-semibold uppercase text-zinc-400">Current Plan</span>
                  <h2 className="text-xl font-bold text-zinc-900">{subscriptionPlan}</h2>
                  <p className="text-xs text-zinc-500 mt-0.5">14-Day Free Trial active</p>
                </div>
                <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full">
                  Trial Active
                </span>
              </div>

              <div>
                <h3 className="font-bold text-zinc-900 text-xs mb-3">Available Plans:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  {[
                    { name: "Starter", price: "$9", period: "/mo", desc: "Up to 50 products, standard subdomain" },
                    { name: "Growth", price: "$29", period: "/mo", desc: "Up to 500 products, custom domain", featured: true },
                    { name: "Pro", price: "$79", period: "/mo", desc: "Unlimited products, multi-staff access" }
                  ].map((p) => (
                    <div
                      key={p.name}
                      className={`p-4 rounded-xl border flex flex-col justify-between ${
                        p.featured
                          ? "border-zinc-900 bg-zinc-900 text-white shadow-sm"
                          : "border-zinc-200 bg-zinc-50 text-zinc-800"
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs">{p.name}</div>
                        <div className="text-xl font-bold mt-1">
                          {p.price}<span className={`text-xs font-normal ${p.featured ? "text-zinc-300" : "text-zinc-500"}`}>{p.period}</span>
                        </div>
                        <div className={`text-[11px] mt-1.5 leading-snug ${p.featured ? "text-zinc-300" : "text-zinc-500"}`}>
                          {p.desc}
                        </div>
                      </div>
                      <button
                        onClick={() => setSubscriptionPlan(`${p.name} (${p.price}${p.period})`)}
                        className={`mt-4 py-1.5 font-bold text-xs rounded-lg transition btn-press ${
                          p.featured
                            ? "bg-white text-zinc-900 hover:bg-zinc-100"
                            : "bg-white border border-zinc-200 text-zinc-800 hover:bg-zinc-100"
                        }`}
                      >
                        Select {p.name}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL 1: VARIANT MATRIX GENERATOR */}
      {showMatrixModal && (
        <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-float border border-zinc-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-zinc-900 mb-1">
              Variant Matrix Generator
            </h3>
            <p className="text-xs text-zinc-500 mb-5">
              Enter option dimensions (Size, Color). Combinations and SKUs are calculated automatically.
            </p>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-zinc-700 uppercase mb-1">
                  Product Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Premium Fleece Pullover Hoodie"
                  value={newProdTitle}
                  onChange={(e) => setNewProdTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs outline-none focus:border-zinc-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-700 uppercase mb-1">
                    Base Price ({currency})
                  </label>
                  <input
                    type="text"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs outline-none focus:border-zinc-900 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-700 uppercase mb-1">
                    SKU Prefix
                  </label>
                  <input
                    type="text"
                    value={newProdSku}
                    onChange={(e) => setNewProdSku(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs outline-none focus:border-zinc-900 font-medium uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 uppercase mb-1">
                  Sizes (comma-separated)
                </label>
                <input
                  type="text"
                  value={sizeOptionsInput}
                  onChange={(e) => setSizeOptionsInput(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs outline-none focus:border-zinc-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 uppercase mb-1">
                  Colors (comma-separated)
                </label>
                <input
                  type="text"
                  value={colorOptionsInput}
                  onChange={(e) => setColorOptionsInput(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs outline-none focus:border-zinc-900 font-medium"
                />
              </div>

              <button
                type="button"
                onClick={handleComputeMatrix}
                className="w-full py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-xl transition btn-press"
              >
                Calculate Combinations
              </button>

              {generatedVariants.length > 0 && (
                <div className="mt-3 pt-3 border-t border-zinc-100">
                  <div className="text-xs font-bold text-zinc-700 mb-2">
                    Generated Variants ({generatedVariants.length}):
                  </div>
                  <div className="max-h-40 overflow-y-auto divide-y divide-zinc-100 border border-zinc-200 rounded-xl">
                    {generatedVariants.map((v, i) => (
                      <div key={i} className="p-2 text-xs flex items-center justify-between">
                        <span className="font-semibold text-zinc-800">{v.title}</span>
                        <div className="flex items-center space-x-3 font-mono text-[11px]">
                          <span className="text-zinc-500">{v.sku}</span>
                          <span className="font-bold text-zinc-900">{currency}{v.price}</span>
                          <span className="text-zinc-600">{v.inventoryQuantity} pcs</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 flex justify-end space-x-2">
              <button
                onClick={() => setShowMatrixModal(false)}
                className="px-4 py-2 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMatrixProduct}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold shadow-sm btn-press"
              >
                Save Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: PRINTABLE INVOICE */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-float border border-zinc-200">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 mb-4">
              <div>
                <h4 className="font-bold text-base text-zinc-900">{storeName}</h4>
                <p className="text-xs text-zinc-500">Packing Slip / Receipt</p>
              </div>
              <span className="text-xs font-mono font-bold text-zinc-800">
                {selectedInvoice.orderNumber}
              </span>
            </div>

            <div className="text-xs space-y-1.5 text-zinc-600 mb-5">
              <div><strong className="text-zinc-800">Customer:</strong> {selectedInvoice.customerName}</div>
              <div><strong className="text-zinc-800">Phone:</strong> {selectedInvoice.customerPhone}</div>
              <div><strong className="text-zinc-800">Date:</strong> {selectedInvoice.date}</div>
              <div><strong className="text-zinc-800">Payment:</strong> {selectedInvoice.paymentMethod}</div>
            </div>

            <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200/80 mb-5">
              <div className="text-xs font-semibold text-zinc-700 mb-1">Purchased:</div>
              <div className="text-xs text-zinc-900 font-medium">{selectedInvoice.items}</div>
              <div className="mt-2.5 pt-2.5 border-t border-zinc-200 flex justify-between font-bold text-sm text-zinc-900">
                <span>Total Due:</span>
                <span>{currency}{selectedInvoice.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-3 py-1.5 border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-600"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center space-x-1 px-3 py-1.5 bg-zinc-900 text-white rounded-lg text-xs font-semibold btn-press"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
