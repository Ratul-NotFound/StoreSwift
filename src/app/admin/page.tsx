"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Settings,
  Plus,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Truck,
  CheckCircle,
  Clock,
  Printer,
  ExternalLink,
  Store,
  Trash2
} from "lucide-react";
import { generateVariantMatrix, GeneratedVariant } from "@/lib/matrix";
import { generateStoreSeedData } from "@/lib/seed-store";

export default function MerchantAdminPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "inventory" | "orders">("overview");
  const [storeSlug, setStoreSlug] = useState("apex-fashion");
  const [storeName, setStoreName] = useState("Apex Fashion Hub");
  const [currency, setCurrency] = useState("$");

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
  const [newProdSku, setNewProdSku] = useState("ITEM");
  const [sizeOptionsInput, setSizeOptionsInput] = useState("S, M, L, XL");
  const [colorOptionsInput, setColorOptionsInput] = useState("Black, White, Blue");
  const [generatedVariants, setGeneratedVariants] = useState<GeneratedVariant[]>([]);

  const handleComputeMatrix = () => {
    const sizes = sizeOptionsInput.split(",").map(s => s.trim()).filter(Boolean);
    const colors = colorOptionsInput.split(",").map(c => c.trim()).filter(Boolean);

    const matrix = generateVariantMatrix(newProdSku, newProdPrice, {
      Size: sizes,
      Color: colors
    });

    // Default stock to 15 per variant
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

  // Stock quick adjustment
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

  // Order status update
  const handleUpdateOrderStatus = (orderId: string, status: string) => {
    setOrdersList(prev =>
      prev.map(o => (o.id === orderId ? { ...o, fulfillmentStatus: status } : o))
    );
  };

  // Invoice view state
  const [selectedInvoice, setSelectedInvoice] = useState<typeof ordersList[0] | null>(null);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="px-4 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-slate-900">{storeName}</span>
                <span className="text-[11px] bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded border border-blue-200">
                  Starter Plan
                </span>
              </div>
              <div className="text-xs text-slate-500 font-mono">
                {storeSlug}.platform.com
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href={`/store/${storeSlug}`}
              target="_blank"
              className="inline-flex items-center space-x-1.5 text-xs font-bold bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-700 px-3.5 py-2 rounded-xl transition"
            >
              <span>View Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="px-4 sm:px-8 flex space-x-8 border-t border-slate-100 text-sm font-semibold">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-3 border-b-2 flex items-center space-x-2 transition ${
              activeTab === "overview"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview</span>
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`py-3 border-b-2 flex items-center space-x-2 transition ${
              activeTab === "products"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products & Catalog</span>
          </button>
          <button
            onClick={() => setActiveTab("inventory")}
            className={`py-3 border-b-2 flex items-center space-x-2 transition ${
              activeTab === "inventory"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Batch Inventory</span>
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`py-3 border-b-2 flex items-center space-x-2 transition ${
              activeTab === "orders"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders ({ordersList.length})</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8">
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <span>Today's Sales</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-3xl font-black text-slate-900 mt-2">
                  {currency}154.97
                </div>
                <div className="text-xs text-emerald-600 font-semibold mt-1 flex items-center space-x-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+18% from yesterday</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <span>Active Orders</span>
                  <ShoppingBag className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-3xl font-black text-slate-900 mt-2">
                  {ordersList.length}
                </div>
                <div className="text-xs text-blue-600 font-semibold mt-1">
                  1 Cash on Delivery pending dispatch
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <span>Total Products</span>
                  <Package className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-3xl font-black text-slate-900 mt-2">
                  {productsList.length}
                </div>
                <div className="text-xs text-slate-500 font-semibold mt-1">
                  With multi-variant matrices
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <span>Low Stock Warning</span>
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-3xl font-black text-slate-900 mt-2">
                  {productsList.filter(p => p.stock < 10).length}
                </div>
                <div className="text-xs text-amber-600 font-semibold mt-1">
                  Items need restocking soon
                </div>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Recent Customer Orders</h2>
                  <p className="text-xs text-slate-500">Live order stream across web & mobile</p>
                </div>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700"
                >
                  View All Orders →
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {ordersList.slice(0, 3).map((ord) => (
                  <div key={ord.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 text-sm">{ord.orderNumber}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-sm font-semibold text-slate-700">{ord.customerName}</span>
                        <span className="text-xs text-slate-500">({ord.date})</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">{ord.items}</div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className="font-bold text-slate-900 text-sm">
                        {currency}{ord.totalAmount.toFixed(2)}
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          ord.fulfillmentStatus === "Delivered"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : ord.fulfillmentStatus === "Shipped"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
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
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Product Catalog</h2>
                <p className="text-xs text-slate-500">Manage items and multi-option variant matrices</p>
              </div>
              <button
                onClick={() => {
                  setShowMatrixModal(true);
                  handleComputeMatrix();
                }}
                className="inline-flex items-center space-x-2 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl shadow-md shadow-blue-600/20 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product with Variant Matrix</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Product Title</th>
                    <th className="px-6 py-4">SKU</th>
                    <th className="px-6 py-4">Base Price</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4">Variants</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {productsList.map((prod) => (
                    <tr key={prod.id} className="hover:bg-slate-50/60 transition">
                      <td className="px-6 py-4 font-bold text-slate-900">{prod.title}</td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-600">{prod.sku}</td>
                      <td className="px-6 py-4 font-semibold text-slate-800">{currency}{prod.basePrice}</td>
                      <td className="px-6 py-4">
                        <span className={`font-bold ${prod.stock < 10 ? "text-amber-600" : "text-emerald-600"}`}>
                          {prod.stock} in stock
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-semibold bg-slate-100 px-2.5 py-1 rounded-full text-slate-600">
                          {prod.variants.length > 0 ? `${prod.variants.length} combinations` : "Standard"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setProductsList(productsList.filter(p => p.id !== prod.id))}
                          className="text-slate-400 hover:text-red-600 transition"
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
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Batch Stock Manager</h2>
              <p className="text-xs text-slate-500">
                Adjust inventory levels instantly without opening individual product edit forms.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">SKU</th>
                    <th className="px-6 py-4">Current Stock</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Quick Stock Adjustment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {productsList.map((prod) => (
                    <tr key={prod.id} className="hover:bg-slate-50/60 transition">
                      <td className="px-6 py-4 font-bold text-slate-900">{prod.title}</td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-600">{prod.sku}</td>
                      <td className="px-6 py-4 font-black text-base text-slate-900">{prod.stock}</td>
                      <td className="px-6 py-4">
                        {prod.stock === 0 ? (
                          <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                            Out of Stock
                          </span>
                        ) : prod.stock < 10 ? (
                          <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                            Low Stock
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                            Healthy
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center space-x-2">
                          <button
                            onClick={() => handleAdjustStock(prod.id, -5)}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded font-bold text-xs text-slate-700"
                          >
                            -5
                          </button>
                          <button
                            onClick={() => handleAdjustStock(prod.id, -1)}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded font-bold text-xs text-slate-700"
                          >
                            -1
                          </button>
                          <button
                            onClick={() => handleAdjustStock(prod.id, 1)}
                            className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded font-bold text-xs"
                          >
                            +1
                          </button>
                          <button
                            onClick={() => handleAdjustStock(prod.id, 10)}
                            className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded font-bold text-xs"
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

        {/* TAB 4: ORDERS PIPELINE */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Order Fulfillment Pipeline</h2>
              <p className="text-xs text-slate-500">Track Cash on Delivery orders, dispatch shipments, and print invoices.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Order</th>
                    <th className="px-6 py-4">Customer & Phone</th>
                    <th className="px-6 py-4">Items</th>
                    <th className="px-6 py-4">Payment</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ordersList.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/60 transition">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{ord.orderNumber}</div>
                        <div className="text-xs text-slate-500">{ord.date}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">{ord.customerName}</div>
                        <div className="text-xs text-slate-500 font-mono">{ord.customerPhone}</div>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-700 max-w-xs">{ord.items}</td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{currency}{ord.totalAmount.toFixed(2)}</div>
                        <div className="text-[11px] text-slate-500">{ord.paymentMethod}</div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={ord.fulfillmentStatus}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                          className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white outline-none focus:ring-2 focus:ring-blue-500"
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
                          className="inline-flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg transition"
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
      </main>

      {/* MODAL 1: VARIANT MATRIX GENERATOR */}
      {showMatrixModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-black text-slate-900 mb-1">
              Variant Matrix Generator
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Enter option dimensions (e.g. Size & Color). We calculate the Cartesian combinations automatically.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Product Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Premium Fleece Pullover Hoodie"
                  value={newProdTitle}
                  onChange={(e) => setNewProdTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Base Price ({currency})
                  </label>
                  <input
                    type="text"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    SKU Prefix
                  </label>
                  <input
                    type="text"
                    value={newProdSku}
                    onChange={(e) => setNewProdSku(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Sizes (comma-separated)
                </label>
                <input
                  type="text"
                  value={sizeOptionsInput}
                  onChange={(e) => setSizeOptionsInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Colors (comma-separated)
                </label>
                <input
                  type="text"
                  value={colorOptionsInput}
                  onChange={(e) => setColorOptionsInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <button
                type="button"
                onClick={handleComputeMatrix}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition"
              >
                Recompute Combinations
              </button>

              {/* Generated Matrix List */}
              {generatedVariants.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="text-xs font-bold text-slate-700 mb-2">
                    Generated Combinations ({generatedVariants.length}):
                  </div>
                  <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-xl">
                    {generatedVariants.map((v, i) => (
                      <div key={i} className="p-2.5 text-xs flex items-center justify-between">
                        <span className="font-semibold text-slate-900">{v.title}</span>
                        <div className="flex items-center space-x-3">
                          <span className="font-mono text-slate-500">{v.sku}</span>
                          <span className="font-bold text-emerald-600">{currency}{v.price}</span>
                          <span className="text-slate-600 font-semibold">{v.inventoryQuantity} pcs</span>
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
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMatrixProduct}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20"
              >
                Save Product & Matrix
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: PRINTABLE INVOICE / PACKING SLIP */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl border border-slate-200">
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

