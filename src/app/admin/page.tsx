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
  ChevronDown,
  Bell,
  ArrowUpRight,
  Filter,
  Check,
  Sparkles
} from "lucide-react";
import { generateVariantMatrix, GeneratedVariant } from "@/lib/matrix";
import { generateStoreSeedData } from "@/lib/seed-store";

export default function MerchantAdminPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "inventory" | "orders" | "customizer" | "billing">("overview");
  const [storeSlug, setStoreSlug] = useState("apex-fashion");
  const [storeName, setStoreName] = useState("Apex Fashion Hub");
  const [currency, setCurrency] = useState("$");
  const [subscriptionPlan, setSubscriptionPlan] = useState("Starter ($9/mo)");

  // Customizer state
  const [announcementText, setAnnouncementText] = useState("⚡ Free shipping on orders over $50! Fast delivery.");
  const [primaryBrandColor, setPrimaryBrandColor] = useState("#2563eb");
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

  // Products state initialized with high-res seed data
  const [productsList, setProductsList] = useState<Array<{
    id: string;
    title: string;
    sku: string;
    basePrice: string;
    compareAtPrice?: string;
    imageUrl: string;
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
      compareAtPrice: p.compareAtPrice,
      imageUrl: p.imageUrl,
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
      items: "Heavyweight Cotton Oversized Tee (Washed Black / L) x 2",
      totalAmount: 58.00,
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
      items: "Retro Runner Suede Sneakers (Pecan Tan / 9) x 1",
      totalAmount: 75.00,
      paymentMethod: "Credit Card (Stripe)",
      paymentStatus: "Paid",
      fulfillmentStatus: "Shipped",
      date: "Yesterday, 3:20 PM"
    },
    {
      id: "ord-1040",
      orderNumber: "#1040",
      customerName: "David Miller",
      customerPhone: "+1 (555) 456-7890",
      items: "Selvedge Raw Denim Jacket (Raw Indigo / M) x 1",
      totalAmount: 89.00,
      paymentMethod: "Cash on Delivery (COD)",
      paymentStatus: "Paid",
      fulfillmentStatus: "Delivered",
      date: "2 days ago"
    }
  ]);

  // Variant Matrix Modal state
  const [showMatrixModal, setShowMatrixModal] = useState(false);
  const [newProdTitle, setNewProdTitle] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("45.00");
  const [newProdSku, setNewProdSku] = useState("HOODIE");
  const [sizeOptionsInput, setSizeOptionsInput] = useState("S, M, L, XL");
  const [colorOptionsInput, setColorOptionsInput] = useState("Charcoal, Cream, Forest");
  const [generatedVariants, setGeneratedVariants] = useState<GeneratedVariant[]>([]);

  const handleComputeMatrix = () => {
    const sizes = sizeOptionsInput.split(",").map(s => s.trim()).filter(Boolean);
    const colors = colorOptionsInput.split(",").map(c => c.trim()).filter(Boolean);

    const matrix = generateVariantMatrix(newProdSku, newProdPrice, {
      Size: sizes,
      Color: colors
    });

    const withStock = matrix.map(v => ({ ...v, inventoryQuantity: 20 }));
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
      imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
      stock: totalStock || 20,
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
    <div className="min-h-screen bg-slate-900 text-slate-100 flex font-sans selection:bg-blue-600 selection:text-white">
      {/* LEFT SIDEBAR (Shopify/Linear style) */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between hidden md:flex">
        <div>
          {/* Store Brand Selector */}
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-black shadow-md shadow-blue-500/20">
                <Store className="w-5 h-5" />
              </div>
              <div className="truncate">
                <div className="font-extrabold text-white text-sm truncate">{storeName}</div>
                <div className="text-[11px] font-mono text-slate-400 truncate">{storeSlug}.storeswift.com</div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === "overview"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </button>

            <button
              onClick={() => setActiveTab("products")}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === "products"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Products & Matrix</span>
            </button>

            <button
              onClick={() => setActiveTab("inventory")}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === "inventory"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Batch Inventory</span>
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === "orders"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Orders ({ordersList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("customizer")}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === "customizer"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Theme Customizer</span>
            </button>

            <button
              onClick={() => setActiveTab("billing")}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === "billing"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>SaaS Plan ({subscriptionPlan.split(" ")[0]})</span>
            </button>
          </nav>
        </div>

        {/* Bottom Storefront Action */}
        <div className="p-4 border-t border-slate-800/80">
          <Link
            href={`/store/${storeSlug}`}
            target="_blank"
            className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-bold rounded-xl transition"
          >
            <span>Visit Live Store</span>
            <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
          </Link>
        </div>
      </aside>

      {/* RIGHT MAIN AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-slate-950 border-b border-slate-800 h-16 px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2.5 py-1 rounded-full flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Store Live & Ready</span>
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href={`/store/${storeSlug}`}
              target="_blank"
              className="inline-flex items-center space-x-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2 rounded-xl shadow-md shadow-blue-600/20 transition"
            >
              <span>View Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <span>Revenue Today</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-black text-white mt-2">
                    {currency}222.00
                  </div>
                  <div className="text-xs text-emerald-400 font-semibold mt-1 flex items-center space-x-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+28% from yesterday</span>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <span>Active Orders</span>
                    <ShoppingBag className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-3xl font-black text-white mt-2">
                    {ordersList.length}
                  </div>
                  <div className="text-xs text-blue-400 font-semibold mt-1">
                    1 COD order pending delivery
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <span>Active Products</span>
                    <Package className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-3xl font-black text-white mt-2">
                    {productsList.length}
                  </div>
                  <div className="text-xs text-slate-400 font-semibold mt-1">
                    With variant combinations
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <span>Low Stock Alert</span>
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-3xl font-black text-white mt-2">
                    {productsList.filter(p => p.stock < 10).length}
                  </div>
                  <div className="text-xs text-amber-400 font-semibold mt-1">
                    Needs reordering soon
                  </div>
                </div>
              </div>

              {/* Recent Orders Stream */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-black text-white tracking-tight">Recent Orders Stream</h2>
                    <p className="text-xs text-slate-400">Live incoming customer purchases</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-xs font-bold text-blue-400 hover:text-blue-300"
                  >
                    View All Orders →
                  </button>
                </div>

                <div className="divide-y divide-slate-800/80">
                  {ordersList.map((ord) => (
                    <div key={ord.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white text-sm">{ord.orderNumber}</span>
                          <span className="text-slate-600">•</span>
                          <span className="text-sm font-semibold text-slate-300">{ord.customerName}</span>
                          <span className="text-xs text-slate-500">({ord.date})</span>
                        </div>
                        <div className="text-xs text-slate-400 mt-1">{ord.items}</div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <span className="font-black text-white text-base">
                          {currency}{ord.totalAmount.toFixed(2)}
                        </span>
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            ord.fulfillmentStatus === "Delivered"
                              ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                              : ord.fulfillmentStatus === "Shipped"
                              ? "bg-blue-950 text-blue-400 border border-blue-800"
                              : "bg-amber-950 text-amber-400 border border-amber-800"
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

          {/* TAB 2: PRODUCTS & VARIANT MATRIX */}
          {activeTab === "products" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Product Catalog</h2>
                  <p className="text-xs text-slate-400">Manage catalog and compute Cartesian variant matrices</p>
                </div>
                <button
                  onClick={() => {
                    setShowMatrixModal(true);
                    handleComputeMatrix();
                  }}
                  className="inline-flex items-center space-x-2 text-xs font-black bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition uppercase tracking-wider"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product & Matrix</span>
                </button>
              </div>

              <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-900/60 border-b border-slate-800 text-xs font-bold uppercase text-slate-400">
                    <tr>
                      <th className="px-6 py-4">Item</th>
                      <th className="px-6 py-4">SKU</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Stock</th>
                      <th className="px-6 py-4">Variants</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {productsList.map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-900/40 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={prod.imageUrl}
                              alt={prod.title}
                              className="w-12 h-12 object-cover rounded-xl border border-slate-800"
                            />
                            <div>
                              <div className="font-bold text-white text-sm">{prod.title}</div>
                              <div className="text-xs text-slate-500">{prod.category}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-slate-400">{prod.sku}</td>
                        <td className="px-6 py-4 font-bold text-white">{currency}{prod.basePrice}</td>
                        <td className="px-6 py-4">
                          <span className={`font-bold text-xs ${prod.stock < 10 ? "text-amber-400" : "text-emerald-400"}`}>
                            {prod.stock} in stock
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-semibold bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full text-slate-300">
                            {prod.variants.length > 0 ? `${prod.variants.length} combinations` : "Standard"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setProductsList(productsList.filter(p => p.id !== prod.id))}
                            className="text-slate-500 hover:text-red-400 transition"
                            title="Delete Product"
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
                <h2 className="text-2xl font-black text-white tracking-tight">Batch Stock Manager</h2>
                <p className="text-xs text-slate-400">Quickly adjust stock counts without opening individual forms.</p>
              </div>

              <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-900/60 border-b border-slate-800 text-xs font-bold uppercase text-slate-400">
                    <tr>
                      <th className="px-6 py-4">Product</th>
                      <th className="px-6 py-4">SKU</th>
                      <th className="px-6 py-4">Units</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Quick Stock Adjustment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {productsList.map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-900/40 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={prod.imageUrl}
                              alt={prod.title}
                              className="w-10 h-10 object-cover rounded-xl border border-slate-800"
                            />
                            <span className="font-bold text-white text-sm">{prod.title}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-slate-400">{prod.sku}</td>
                        <td className="px-6 py-4 font-black text-base text-white">{prod.stock}</td>
                        <td className="px-6 py-4">
                          {prod.stock === 0 ? (
                            <span className="text-xs font-bold text-red-400 bg-red-950/80 border border-red-800 px-2 py-0.5 rounded">
                              Out of Stock
                            </span>
                          ) : prod.stock < 10 ? (
                            <span className="text-xs font-bold text-amber-400 bg-amber-950/80 border border-amber-800 px-2 py-0.5 rounded">
                              Low Stock
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded">
                              Healthy
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex items-center space-x-1.5">
                            <button
                              onClick={() => handleAdjustStock(prod.id, -5)}
                              className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded font-bold text-xs"
                            >
                              -5
                            </button>
                            <button
                              onClick={() => handleAdjustStock(prod.id, -1)}
                              className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded font-bold text-xs"
                            >
                              -1
                            </button>
                            <button
                              onClick={() => handleAdjustStock(prod.id, 1)}
                              className="px-2 py-1 bg-blue-950 hover:bg-blue-900 text-blue-400 border border-blue-800 rounded font-bold text-xs"
                            >
                              +1
                            </button>
                            <button
                              onClick={() => handleAdjustStock(prod.id, 10)}
                              className="px-2 py-1 bg-blue-950 hover:bg-blue-900 text-blue-400 border border-blue-800 rounded font-bold text-xs"
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

          {/* TAB 4: ORDERS & INVOICES */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Order Fulfillment Pipeline</h2>
                <p className="text-xs text-slate-400">Process Cash on Delivery dispatches and print packing slips.</p>
              </div>

              <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-900/60 border-b border-slate-800 text-xs font-bold uppercase text-slate-400">
                    <tr>
                      <th className="px-6 py-4">Order</th>
                      <th className="px-6 py-4">Customer & Phone</th>
                      <th className="px-6 py-4">Items</th>
                      <th className="px-6 py-4">Payment</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {ordersList.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-900/40 transition">
                        <td className="px-6 py-4">
                          <div className="font-bold text-white">{ord.orderNumber}</div>
                          <div className="text-xs text-slate-500">{ord.date}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-200">{ord.customerName}</div>
                          <div className="text-xs text-slate-400 font-mono">{ord.customerPhone}</div>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-300 max-w-xs">{ord.items}</td>
                        <td className="px-6 py-4">
                          <div className="font-black text-white">{currency}{ord.totalAmount.toFixed(2)}</div>
                          <div className="text-[11px] text-slate-400">{ord.paymentMethod}</div>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={ord.fulfillmentStatus}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                            className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-white outline-none focus:border-blue-500"
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
                            className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 bg-blue-950/80 border border-blue-800 px-3 py-1.5 rounded-lg transition"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Invoice</span>
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
              {/* Form Settings */}
              <div className="lg:col-span-5 bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight">Theme Customizer</h2>
                  <p className="text-xs text-slate-400">Tweak brand accents and hero messaging in real-time.</p>
                </div>

                {savedSuccess && (
                  <div className="p-3 bg-emerald-950/80 border border-emerald-800 rounded-xl text-xs text-emerald-300 font-bold flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Theme styling saved and deployed to live store!</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                      Announcement Bar
                    </label>
                    <input
                      type="text"
                      value={announcementText}
                      onChange={(e) => setAnnouncementText(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                      Hero Headline
                    </label>
                    <input
                      type="text"
                      value={heroHeadline}
                      onChange={(e) => setHeroHeadline(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                      Hero Tagline
                    </label>
                    <textarea
                      rows={2}
                      value={heroTagline}
                      onChange={(e) => setHeroTagline(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                      Store Brand Accent Color
                    </label>
                    <div className="flex items-center space-x-3">
                      {["#2563eb", "#059669", "#7c3aed", "#d97706", "#e11d48", "#0f172a"].map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setPrimaryBrandColor(color)}
                          className={`w-8 h-8 rounded-full border-2 transition ${
                            primaryBrandColor === color ? "border-white scale-110 shadow-lg" : "border-transparent"
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSaveCustomizer}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition uppercase tracking-wider"
                >
                  Save Theme Changes
                </button>
              </div>

              {/* Live Mockup Preview */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Storefront Preview</span>
                  <div className="flex items-center space-x-2 bg-slate-950 border border-slate-800 rounded-xl p-1">
                    <button
                      onClick={() => setPreviewDevice("desktop")}
                      className={`p-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 ${
                        previewDevice === "desktop" ? "bg-slate-800 text-white" : "text-slate-400"
                      }`}
                    >
                      <Monitor className="w-3.5 h-3.5" />
                      <span>Desktop</span>
                    </button>
                    <button
                      onClick={() => setPreviewDevice("mobile")}
                      className={`p-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 ${
                        previewDevice === "mobile" ? "bg-slate-800 text-white" : "text-slate-400"
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Mobile</span>
                    </button>
                  </div>
                </div>

                <div className="flex justify-center">
                  <div
                    className={`bg-white text-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden transition-all duration-300 ${
                      previewDevice === "mobile" ? "w-[360px]" : "w-full"
                    }`}
                  >
                    {/* Announcement Bar */}
                    <div className="text-white text-[11px] py-1.5 px-3 text-center truncate font-medium bg-slate-900">
                      {announcementText}
                    </div>

                    {/* Header */}
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                      <span className="font-extrabold text-sm text-slate-900">{storeName}</span>
                      <ShoppingBag className="w-4 h-4 text-slate-500" />
                    </div>

                    {/* Hero */}
                    <div
                      className="p-8 text-white text-center transition-colors"
                      style={{ backgroundColor: primaryBrandColor }}
                    >
                      <h3 className="font-black text-xl tracking-tight leading-tight">{heroHeadline}</h3>
                      <p className="text-xs text-white/80 mt-1 max-w-sm mx-auto">{heroTagline}</p>
                      <button className="mt-4 px-4 py-1.5 bg-white text-slate-900 font-bold text-xs rounded-lg shadow">
                        Shop Now
                      </button>
                    </div>

                    {/* Products Grid */}
                    <div className="p-4 bg-slate-50">
                      <div className="text-xs font-bold text-slate-700 mb-3">Featured Products</div>
                      <div className={`grid gap-3 ${previewDevice === "mobile" ? "grid-cols-2" : "grid-cols-3"}`}>
                        {productsList.slice(0, 3).map((p) => (
                          <div key={p.id} className="bg-white p-2.5 rounded-xl border border-slate-200">
                            <img
                              src={p.imageUrl}
                              alt={p.title}
                              className="w-full h-20 object-cover rounded-lg mb-2"
                            />
                            <div className="font-bold text-[11px] text-slate-900 truncate">{p.title}</div>
                            <div className="text-[11px] font-black text-blue-600 mt-0.5">{currency}{p.basePrice}</div>
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
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-xs font-bold uppercase text-slate-500">Current Subscription</span>
                    <h2 className="text-2xl font-black text-white">{subscriptionPlan}</h2>
                    <p className="text-xs text-slate-400 mt-1">14-Day Free Trial active</p>
                  </div>
                  <span className="text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 px-3 py-1 rounded-full">
                    Active
                  </span>
                </div>

                <div className="border-t border-slate-800 pt-6">
                  <h3 className="font-bold text-white text-sm mb-4">Switch Subscription Tier:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 border border-slate-800 rounded-2xl bg-slate-900 flex flex-col justify-between">
                      <div>
                        <div className="font-bold text-white text-sm">Starter</div>
                        <div className="text-2xl font-black text-white mt-1">$9<span className="text-xs font-normal text-slate-500">/mo</span></div>
                        <div className="text-xs text-slate-400 mt-2">Up to 50 products, standard subdomain.</div>
                      </div>
                      <button
                        onClick={() => setSubscriptionPlan("Starter ($9/mo)")}
                        className="mt-4 py-2 bg-slate-800 hover:bg-slate-700 font-bold text-xs text-white rounded-xl transition"
                      >
                        Select Starter
                      </button>
                    </div>

                    <div className="p-5 border-2 border-blue-500 rounded-2xl bg-blue-950/20 flex flex-col justify-between">
                      <div>
                        <div className="font-bold text-blue-400 text-sm">Growth</div>
                        <div className="text-2xl font-black text-white mt-1">$29<span className="text-xs font-normal text-slate-500">/mo</span></div>
                        <div className="text-xs text-slate-400 mt-2">Up to 500 products, custom domain.</div>
                      </div>
                      <button
                        onClick={() => setSubscriptionPlan("Growth ($29/mo)")}
                        className="mt-4 py-2 bg-blue-600 hover:bg-blue-500 font-bold text-xs text-white rounded-xl shadow-lg shadow-blue-600/30 transition"
                      >
                        Upgrade to Growth
                      </button>
                    </div>

                    <div className="p-5 border border-slate-800 rounded-2xl bg-slate-900 flex flex-col justify-between">
                      <div>
                        <div className="font-bold text-white text-sm">Pro</div>
                        <div className="text-2xl font-black text-white mt-1">$79<span className="text-xs font-normal text-slate-500">/mo</span></div>
                        <div className="text-xs text-slate-400 mt-2">Unlimited products, multi-staff access.</div>
                      </div>
                      <button
                        onClick={() => setSubscriptionPlan("Pro ($79/mo)")}
                        className="mt-4 py-2 bg-slate-800 hover:bg-slate-700 font-bold text-xs text-white rounded-xl transition"
                      >
                        Select Pro
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL 1: VARIANT MATRIX GENERATOR */}
      {showMatrixModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-800 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-black text-white mb-1">
              Variant Matrix Generator
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Enter option dimensions (e.g. Size & Color). We calculate the Cartesian combinations automatically.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Product Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Premium Fleece Pullover Hoodie"
                  value={newProdTitle}
                  onChange={(e) => setNewProdTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Base Price ({currency})
                  </label>
                  <input
                    type="text"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    SKU Prefix
                  </label>
                  <input
                    type="text"
                    value={newProdSku}
                    onChange={(e) => setNewProdSku(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white outline-none uppercase focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Sizes (comma-separated)
                </label>
                <input
                  type="text"
                  value={sizeOptionsInput}
                  onChange={(e) => setSizeOptionsInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Colors (comma-separated)
                </label>
                <input
                  type="text"
                  value={colorOptionsInput}
                  onChange={(e) => setColorOptionsInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="button"
                onClick={handleComputeMatrix}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-bold rounded-xl transition"
              >
                Recompute Combinations
              </button>

              {/* Generated Matrix List */}
              {generatedVariants.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-800">
                  <div className="text-xs font-bold text-slate-300 mb-2">
                    Generated Combinations ({generatedVariants.length}):
                  </div>
                  <div className="max-h-48 overflow-y-auto divide-y divide-slate-800 border border-slate-800 rounded-xl bg-slate-900">
                    {generatedVariants.map((v, i) => (
                      <div key={i} className="p-2.5 text-xs flex items-center justify-between">
                        <span className="font-semibold text-white">{v.title}</span>
                        <div className="flex items-center space-x-3">
                          <span className="font-mono text-slate-400">{v.sku}</span>
                          <span className="font-bold text-emerald-400">{currency}{v.price}</span>
                          <span className="text-slate-300 font-semibold">{v.inventoryQuantity} pcs</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowMatrixModal(false)}
                className="px-4 py-2 border border-slate-800 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMatrixProduct}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20"
              >
                Save Product & Matrix
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: PRINTABLE INVOICE / PACKING SLIP */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
              <div>
                <h4 className="font-black text-xl text-slate-900">{storeName}</h4>
                <p className="text-xs text-slate-500">Order Invoice / Packing Slip</p>
              </div>
              <span className="text-sm font-bold text-blue-600 font-mono">
                {selectedInvoice.orderNumber}
              </span>
            </div>

            <div className="text-xs space-y-2 text-slate-600 mb-6">
              <div><strong className="text-slate-800">Customer:</strong> {selectedInvoice.customerName}</div>
              <div><strong className="text-slate-800">Phone:</strong> {selectedInvoice.customerPhone}</div>
              <div><strong className="text-slate-800">Date:</strong> {selectedInvoice.date}</div>
              <div><strong className="text-slate-800">Payment:</strong> {selectedInvoice.paymentMethod} ({selectedInvoice.paymentStatus})</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 mb-6">
              <div className="text-xs font-bold text-slate-700 mb-1">Purchased Items:</div>
              <div className="text-sm font-medium text-slate-900">{selectedInvoice.items}</div>
              <div className="mt-3 pt-3 border-t border-slate-200 flex justify-between font-black text-base text-slate-900">
                <span>Total Amount Due:</span>
                <span>{currency}{selectedInvoice.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-600"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
