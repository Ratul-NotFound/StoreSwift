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
  RefreshCw,
  Eye,
  SlidersHorizontal,
  Clock,
  ShieldAlert,
  Barcode,
  Share2,
  Globe,
  Percent,
  Zap,
  Copy,
  Radio,
  FileText,
  X
} from "lucide-react";
import {
  COURIER_PROVIDERS,
  DELIVERY_ZONES,
  generateConsignment,
  assessCustomerFraudRisk,
  WHOLESALE_SUPPLIER_CATALOG,
  WholesaleSupplierProduct,
  CourierProviderId
} from "@/lib/courier";
import { generateVariantMatrix, GeneratedVariant } from "@/lib/matrix";
import { generateStoreSeedData } from "@/lib/seed-store";

export default function MerchantAdminPage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "products" | "inventory" | "orders" | "logistics" | "reseller" | "marketing" | "customizer" | "billing"
  >("overview");
  const [courierDispatchOrder, setCourierDispatchOrder] = useState<any | null>(null);
  const [selectedCourierId, setSelectedCourierId] = useState<CourierProviderId>("steadfast");
  const [steadfastApiKey, setSteadfastApiKey] = useState("st_live_9941a82fbc78");
  const [steadfastSecret, setSteadfastSecret] = useState("••••••••••••••••");
  const [pathaoClientId, setPathaoClientId] = useState("pth_client_482910");
  const [pathaoSecret, setPathaoSecret] = useState("••••••••••••••••");
  const [redxToken, setRedxToken] = useState("rdx_tok_7829124");
  const [courierCredsSaved, setCourierCredsSaved] = useState(false);
  const [metaPixelId, setMetaPixelId] = useState("892419204910");
  const [tiktokPixelId, setTiktokPixelId] = useState("C89241920");
  const [gtmContainerId, setGtmContainerId] = useState("GTM-SSWIFT01");
  const [importedSupplierIds, setImportedSupplierIds] = useState<string[]>([]);
  const [supplierImportSuccess, setSupplierImportSuccess] = useState<string | null>(null);
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

  // Products state initialized with seed data including real images
  const [productsList, setProductsList] = useState<Array<{
    id: string;
    title: string;
    sku: string;
    basePrice: string;
    stock: number;
    category: string;
    imageUrl?: string;
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
      imageUrl: p.imageUrl,
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
      customerInitials: "AM",
      customerPhone: "+880 1711-234567",
      shippingAddress: "House 14, Road 5, Dhanmondi, Dhaka",
      zone: "Inside Dhaka (Metro)",
      items: "Classic Cotton T-Shirt (M / Black) x 2",
      totalAmount: 49.98,
      paymentMethod: "Cash on Delivery (COD)",
      paymentStatus: "Pending",
      fulfillmentStatus: "Unfulfilled",
      courier: "Steadfast Courier",
      consignmentId: "",
      date: "Today, 10:45 AM"
    },
    {
      id: "ord-1041",
      orderNumber: "#1041",
      customerName: "Sarah Jenkins",
      customerInitials: "SJ",
      customerPhone: "+880 1819-890123",
      shippingAddress: "Flat 4B, Concord Tower, Gulshan-2, Dhaka",
      zone: "Inside Dhaka (Metro)",
      items: "Everyday Canvas Sneaker (Size: 9) x 1",
      totalAmount: 45.00,
      paymentMethod: "bKash Express",
      paymentStatus: "Paid",
      fulfillmentStatus: "Shipped",
      courier: "Pathao Logistics",
      consignmentId: "PTH-782910",
      date: "Yesterday"
    },
    {
      id: "ord-1040",
      orderNumber: "#1040",
      customerName: "David Miller",
      customerInitials: "DM",
      customerPhone: "+880 1912-456789",
      shippingAddress: "College Road, Nasirabad, Chattogram",
      zone: "Outside Dhaka (Nationwide)",
      items: "Slim-Fit Denim Jeans (32) x 1",
      totalAmount: 59.99,
      paymentMethod: "Cash on Delivery (COD)",
      paymentStatus: "Paid",
      fulfillmentStatus: "Delivered",
      courier: "Steadfast Courier",
      consignmentId: "ST-639102",
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
      imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
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

  const handleDispatchCourier = (order: typeof ordersList[0], courierId: CourierProviderId) => {
    const consignment = generateConsignment(
      {
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        shippingAddress: order.shippingAddress,
        totalAmount: order.totalAmount,
        currency
      },
      courierId,
      order.zone.includes("Inside") ? "metro" : "national"
    );

    setOrdersList(prev =>
      prev.map(o =>
        o.id === order.id
          ? {
              ...o,
              fulfillmentStatus: "Shipped",
              courier: consignment.courierName,
              consignmentId: consignment.consignmentId
            }
          : o
      )
    );
    setCourierDispatchOrder(null);
  };

  const handleImportSupplierItem = (item: WholesaleSupplierProduct) => {
    if (importedSupplierIds.includes(item.id)) return;

    const newProd = {
      id: `prod-ws-${Date.now()}`,
      title: item.title,
      sku: `WS-${item.id.toUpperCase()}`,
      basePrice: item.suggestedRetailPrice.toFixed(2),
      stock: item.inStockUnits,
      category: item.category,
      imageUrl: item.imageUrl,
      variants: [
        {
          title: "Standard",
          sku: `WS-${item.id.toUpperCase()}-STD`,
          price: item.suggestedRetailPrice.toFixed(2),
          inventoryQuantity: item.inStockUnits,
          options: { Source: item.supplierName }
        }
      ]
    };

    setProductsList([newProd, ...productsList]);
    setImportedSupplierIds(prev => [...prev, item.id]);
    setSupplierImportSuccess(`Imported "${item.title}" with $${(item.suggestedRetailPrice - item.wholesaleCost).toFixed(2)} unit margin!`);
    setTimeout(() => setSupplierImportSuccess(null), 3500);
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
              className="inline-flex items-center space-x-1.5 text-xs font-semibold bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 px-3.5 py-1.5 rounded-xl transition shadow-subtle btn-press"
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
            { id: "products", label: `Catalog (${productsList.length})`, icon: Package },
            { id: "inventory", label: "Batch Inventory", icon: Layers },
            { id: "orders", label: `Orders (${ordersList.length})`, icon: ShoppingBag },
            { id: "logistics", label: "Couriers & Dispatch", icon: Truck },
            { id: "reseller", label: "Dropship Hub", icon: Percent },
            { id: "marketing", label: "Pixels & GTM", icon: Radio },
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
                  <span>Inventory Alerts</span>
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
                  <span>View All Orders</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="divide-y divide-zinc-100">
                {ordersList.slice(0, 3).map((ord) => (
                  <div key={ord.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      {/* Avatar */}
                      <div className="w-9 h-9 rounded-full bg-zinc-100 text-zinc-700 font-bold text-xs flex items-center justify-center flex-shrink-0 border border-zinc-200">
                        {ord.customerInitials}
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-zinc-900 text-xs font-mono">{ord.orderNumber}</span>
                          <span className="text-zinc-300">•</span>
                          <span className="text-xs font-semibold text-zinc-800">{ord.customerName}</span>
                          <span className="text-[11px] text-zinc-400">({ord.date})</span>
                        </div>
                        <div className="text-xs text-zinc-500 mt-0.5">{ord.items}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 pl-12 sm:pl-0">
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
                <p className="text-xs text-zinc-500">Manage products, photography, and variant combinations</p>
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
                    <th className="px-6 py-3.5">Product</th>
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
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          {/* Product Image Thumbnail */}
                          <div className="w-10 h-10 rounded-lg bg-zinc-100 overflow-hidden flex-shrink-0 border border-zinc-200/80">
                            {prod.imageUrl ? (
                              <img
                                src={prod.imageUrl}
                                alt={prod.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&auto=format&fit=crop&q=80";
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-zinc-300">
                                <Package className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-zinc-900">{prod.title}</div>
                            <div className="text-[11px] text-zinc-400">{prod.category}</div>
                          </div>
                        </div>
                      </td>
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
                    <th className="px-6 py-3.5">Product</th>
                    <th className="px-6 py-3.5">SKU</th>
                    <th className="px-6 py-3.5">Stock</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Quick Stock Stepper</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {productsList.map((prod) => (
                    <tr key={prod.id} className="hover:bg-zinc-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-lg bg-zinc-100 overflow-hidden flex-shrink-0 border border-zinc-200/80">
                            {prod.imageUrl ? (
                              <img
                                src={prod.imageUrl}
                                alt={prod.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&auto=format&fit=crop&q=80";
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-zinc-300">
                                <Package className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                          <span className="font-semibold text-zinc-900">{prod.title}</span>
                        </div>
                      </td>
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

        {/* TAB 4: ORDERS & DISPATCH */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-zinc-900">
                  Order Fulfillment & Courier Dispatch
                </h2>
                <p className="text-xs text-zinc-500">
                  Real-time order stream, AI Anti-Fraud RTO scoring, and 1-click courier consignment booking.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  ⚡ Auto-Courier Sync: Active
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-subtle overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 border-b border-zinc-100 text-[11px] font-semibold uppercase text-zinc-500">
                  <tr>
                    <th className="px-5 py-3.5">Order</th>
                    <th className="px-5 py-3.5">Customer & RTO Risk</th>
                    <th className="px-5 py-3.5">Zone & Address</th>
                    <th className="px-5 py-3.5">Items</th>
                    <th className="px-5 py-3.5">Total & Payment</th>
                    <th className="px-5 py-3.5">Courier Consignment</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {ordersList.map((ord) => {
                    const risk = assessCustomerFraudRisk(ord.customerPhone);
                    return (
                      <tr key={ord.id} className="hover:bg-zinc-50/70 transition-colors">
                        {/* Order & Date */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="font-bold text-zinc-900 font-mono">{ord.orderNumber}</div>
                          <div className="text-[11px] text-zinc-400">{ord.date}</div>
                        </td>

                        {/* Customer & Anti-Fraud Pill */}
                        <td className="px-5 py-4">
                          <div className="font-bold text-zinc-800">{ord.customerName}</div>
                          <div className="text-[11px] text-zinc-500 font-mono">{ord.customerPhone}</div>
                          <div className="mt-1">
                            <span
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-full border inline-flex items-center space-x-1 ${risk.badgeClass}`}
                              title={risk.recommendation}
                            >
                              <span>{risk.level === "VERIFIED_SAFE" ? "● Safe COD" : risk.level === "MODERATE_RISK" ? "▲ Verify Phone" : "✕ High RTO Risk"}</span>
                              <span>({risk.deliveryRatePercent}%)</span>
                            </span>
                          </div>
                        </td>

                        {/* Zone & Address */}
                        <td className="px-5 py-4 max-w-[200px]">
                          <div className="font-semibold text-zinc-800 text-[11px]">{ord.zone}</div>
                          <div className="text-[11px] text-zinc-500 truncate" title={ord.shippingAddress}>
                            {ord.shippingAddress}
                          </div>
                        </td>

                        {/* Items */}
                        <td className="px-5 py-4 text-zinc-600 max-w-[180px] truncate" title={ord.items}>
                          {ord.items}
                        </td>

                        {/* Payment & Total */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="font-bold text-zinc-900">
                            {currency}{ord.totalAmount.toFixed(2)}
                          </div>
                          <div className="text-[10px] text-zinc-400 font-medium">{ord.paymentMethod}</div>
                        </td>

                        {/* Courier Consignment */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          {ord.consignmentId ? (
                            <div className="space-y-0.5">
                              <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded inline-block">
                                {ord.consignmentId}
                              </span>
                              <div className="text-[10px] text-zinc-500 flex items-center space-x-1">
                                <Truck className="w-3 h-3 text-zinc-400" />
                                <span>{ord.courier}</span>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => setCourierDispatchOrder(ord)}
                              className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-[11px] font-bold flex items-center space-x-1 shadow-xs btn-press"
                            >
                              <Zap className="w-3 h-3 text-amber-400" />
                              <span>Dispatch Courier</span>
                            </button>
                          )}
                        </td>

                        {/* Fulfillment Status */}
                        <td className="px-5 py-4">
                          <select
                            value={ord.fulfillmentStatus}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                            className="text-xs font-semibold px-2 py-1 rounded-lg border border-zinc-200 bg-white outline-none focus:border-zinc-900"
                          >
                            <option value="Unfulfilled">Unfulfilled</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>

                        {/* Actions (Print Label) */}
                        <td className="px-5 py-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => setSelectedInvoice(ord)}
                            className="inline-flex items-center space-x-1 text-xs font-semibold text-zinc-700 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 px-2.5 py-1 rounded-lg transition btn-press"
                            title="Print Thermal Shipping Label"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Label</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: LOGISTICS & COURIERS (BEATS ZATIQ) */}
        {activeTab === "logistics" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-zinc-900">
                  Automated Courier Integrations
                </h2>
                <p className="text-xs text-zinc-500">
                  Direct API sync with Steadfast, Pathao, RedX, and StoreSwift Fleet with auto-consignment booking.
                </p>
              </div>

              <div className="flex items-center space-x-2 text-xs">
                <span className="font-semibold text-zinc-700">Default Warehouse:</span>
                <span className="font-mono text-zinc-900 bg-zinc-100 px-2.5 py-1 rounded-lg border border-zinc-200">
                  Tejgaon Central Hub, Dhaka
                </span>
              </div>
            </div>

            {/* Courier Providers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  id: "steadfast",
                  name: "Steadfast Courier",
                  tagline: "Highest COD delivery success rate in Bangladesh",
                  hub: "Tejgaon Industrial Sorting Hub",
                  status: "Connected & Active",
                  successRate: "98.4%",
                  deliveriesThisMonth: 342,
                  badge: "bg-emerald-50 text-emerald-700 border-emerald-200"
                },
                {
                  id: "pathao",
                  name: "Pathao Logistics",
                  tagline: "Rapid same-day rider network & API pickup sync",
                  hub: "Gulshan Fulfillment Center",
                  status: "Connected & Active",
                  successRate: "96.8%",
                  deliveriesThisMonth: 189,
                  badge: "bg-rose-50 text-rose-700 border-rose-200"
                },
                {
                  id: "redx",
                  name: "RedX Express",
                  tagline: "Deep 64-district nationwide delivery coverage",
                  hub: "Uttara Sorting Terminal",
                  status: "Connected & Active",
                  successRate: "95.2%",
                  deliveriesThisMonth: 124,
                  badge: "bg-red-50 text-red-700 border-red-200"
                }
              ].map((c) => (
                <div key={c.id} className="p-5 bg-white rounded-2xl border border-zinc-200/80 shadow-subtle space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-zinc-900">{c.name}</h3>
                      <p className="text-[11px] text-zinc-500 mt-0.5">{c.tagline}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${c.badge}`}>
                      {c.status}
                    </span>
                  </div>

                  <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-zinc-400 block font-medium">Delivery Rate</span>
                      <span className="font-bold text-emerald-600">{c.successRate}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 block font-medium">Dispatched This Month</span>
                      <span className="font-bold text-zinc-900">{c.deliveriesThisMonth} parcels</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-zinc-100">
                    <span className="text-[11px] text-zinc-400 truncate max-w-[160px]">{c.hub}</span>
                    <button
                      onClick={() => alert(`${c.name} API connection verified! Webhooks operating normally.`)}
                      className="text-xs font-semibold text-zinc-700 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 px-2.5 py-1 rounded-lg transition"
                    >
                      Test API Ping
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Courier Settings Panel */}
            <div className="p-6 bg-white rounded-2xl border border-zinc-200/80 shadow-subtle space-y-4">
              <h3 className="text-sm font-bold text-zinc-900 tracking-tight">
                Logistics & Dispatch Rules
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-xl border border-zinc-200/80 space-y-1">
                  <span className="font-bold text-zinc-800 block">⚡ Auto-Consignment Booking</span>
                  <p className="text-[11px] text-zinc-500">
                    Automatically book courier rider as soon as a customer completes 1-page checkout.
                  </p>
                  <div className="pt-2">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Enabled
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-zinc-200/80 space-y-1">
                  <span className="font-bold text-zinc-800 block">📱 SMS Tracking Notification</span>
                  <p className="text-[11px] text-zinc-500">
                    Send customer tracking SMS link automatically upon courier rider pickup.
                  </p>
                  <div className="pt-2">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Enabled
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-zinc-200/80 space-y-1">
                  <span className="font-bold text-zinc-800 block">🛡️ Anti-RTO Fraud Filter</span>
                  <p className="text-[11px] text-zinc-500">
                    Hold orders from phone numbers with &gt;50% past return rates for manual review.
                  </p>
                  <div className="pt-2">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Active (StoreSwift Shield)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Courier API Credentials & Webhook Hub */}
            <div className="p-6 bg-white rounded-2xl border border-zinc-200/80 shadow-subtle space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 tracking-tight">
                    Courier Partner API Keys & Webhook Secret
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Enter your merchant keys from courier portals to automate live parcel booking and rider tracking.
                  </p>
                </div>
                {courierCredsSaved && (
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center space-x-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Courier credentials saved securely!</span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                {/* Steadfast Credentials */}
                <div className="p-4 rounded-xl border border-zinc-200 space-y-3 bg-zinc-50/50">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-900">Steadfast Courier API</span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Live v1.0</span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">API Key</label>
                    <input
                      type="text"
                      value={steadfastApiKey}
                      onChange={(e) => setSteadfastApiKey(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-lg text-xs font-mono bg-white outline-none focus:border-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Secret Key</label>
                    <input
                      type="password"
                      value={steadfastSecret}
                      onChange={(e) => setSteadfastSecret(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-lg text-xs font-mono bg-white outline-none focus:border-zinc-900"
                    />
                  </div>
                </div>

                {/* Pathao Credentials */}
                <div className="p-4 rounded-xl border border-zinc-200 space-y-3 bg-zinc-50/50">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-900">Pathao Logistics API</span>
                    <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">OAuth 2.0</span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Client ID</label>
                    <input
                      type="text"
                      value={pathaoClientId}
                      onChange={(e) => setPathaoClientId(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-lg text-xs font-mono bg-white outline-none focus:border-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Client Secret</label>
                    <input
                      type="password"
                      value={pathaoSecret}
                      onChange={(e) => setPathaoSecret(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-lg text-xs font-mono bg-white outline-none focus:border-zinc-900"
                    />
                  </div>
                </div>

                {/* RedX Credentials */}
                <div className="p-4 rounded-xl border border-zinc-200 space-y-3 bg-zinc-50/50">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-900">RedX Express API</span>
                    <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">Bearer Token</span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">API Token</label>
                    <input
                      type="text"
                      value={redxToken}
                      onChange={(e) => setRedxToken(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-lg text-xs font-mono bg-white outline-none focus:border-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Webhook URL</label>
                    <div className="p-1.5 bg-white border border-zinc-200 rounded-lg font-mono text-[10px] text-zinc-600 truncate select-all">
                      https://storeswift.app/api/couriers/webhooks
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => {
                    setCourierCredsSaved(true);
                    setTimeout(() => setCourierCredsSaved(false), 3000);
                  }}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-sm transition btn-press"
                >
                  Save API Keys & Test Auth
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: DROPSHIP & WHOLESALE RESELLER HUB */}
        {activeTab === "reseller" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-zinc-900">
                  Wholesale Supplier & Dropship Hub
                </h2>
                <p className="text-xs text-zinc-500">
                  Sell verified manufacturer products without holding physical inventory. Keep the margin on COD settlement.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-zinc-500">Active Supplier Network:</span>
                <span className="font-bold text-xs text-zinc-900 bg-zinc-100 px-2.5 py-1 rounded-lg border border-zinc-200">
                  4 Verified Factories
                </span>
              </div>
            </div>

            {supplierImportSuccess && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{supplierImportSuccess}</span>
              </div>
            )}

            {/* Wholesale Catalog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {WHOLESALE_SUPPLIER_CATALOG.map((item) => {
                const isImported = importedSupplierIds.includes(item.id);
                const unitProfit = item.suggestedRetailPrice - item.wholesaleCost;
                return (
                  <div
                    key={item.id}
                    className="p-4 bg-white rounded-2xl border border-zinc-200/80 shadow-subtle flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2.5">
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-zinc-100">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                          {item.profitMarginPercent}% Margin
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                          {item.category} • {item.supplierName}
                        </span>
                        <h4 className="font-bold text-xs text-zinc-900 leading-tight mt-0.5 line-clamp-2">
                          {item.title}
                        </h4>
                      </div>

                      <div className="p-2.5 bg-zinc-50 rounded-xl border border-zinc-100 text-xs space-y-1">
                        <div className="flex justify-between text-zinc-500">
                          <span>Factory Cost:</span>
                          <span className="font-mono font-semibold text-zinc-800">${item.wholesaleCost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-zinc-500">
                          <span>Suggested Retail:</span>
                          <span className="font-mono font-bold text-zinc-900">${item.suggestedRetailPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-emerald-600 font-bold pt-1 border-t border-zinc-200/60">
                          <span>Your Profit / Unit:</span>
                          <span>+${unitProfit.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleImportSupplierItem(item)}
                      disabled={isImported}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 btn-press ${
                        isImported
                          ? "bg-zinc-100 text-zinc-400 border border-zinc-200 cursor-not-allowed"
                          : "bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm"
                      }`}
                    >
                      {isImported ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Imported into Store</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Import to My Store</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 7: MARKETING PIXELS & GTM */}
        {activeTab === "marketing" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-zinc-900">
                Marketing Pixels & Analytics Tracking
              </h2>
              <p className="text-xs text-zinc-500">
                Seamlessly connect Meta Pixel (Facebook Ads), TikTok Pixel, and Google Tag Manager.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Meta Pixel */}
              <div className="p-5 bg-white rounded-2xl border border-zinc-200/80 shadow-subtle space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    f
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-zinc-900">Meta Pixel (Facebook)</h3>
                    <p className="text-[10px] text-zinc-400">Track ROAS & Purchase Events</p>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">
                    Meta Pixel ID
                  </label>
                  <input
                    type="text"
                    value={metaPixelId}
                    onChange={(e) => setMetaPixelId(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs outline-none focus:border-zinc-900 font-mono"
                  />
                </div>

                <div className="text-[10px] text-zinc-500 space-y-1">
                  <div className="flex items-center space-x-1 text-emerald-600 font-semibold">
                    <Check className="w-3 h-3" />
                    <span>PageView, AddToCart, Purchase events synced</span>
                  </div>
                </div>
              </div>

              {/* TikTok Pixel */}
              <div className="p-5 bg-white rounded-2xl border border-zinc-200/80 shadow-subtle space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center font-bold text-xs">
                    TT
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-zinc-900">TikTok Pixel</h3>
                    <p className="text-[10px] text-zinc-400">TikTok Ad Campaign Conversion</p>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">
                    TikTok Pixel ID
                  </label>
                  <input
                    type="text"
                    value={tiktokPixelId}
                    onChange={(e) => setTiktokPixelId(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs outline-none focus:border-zinc-900 font-mono"
                  />
                </div>

                <div className="text-[10px] text-zinc-500 space-y-1">
                  <div className="flex items-center space-x-1 text-emerald-600 font-semibold">
                    <Check className="w-3 h-3" />
                    <span>Real-time event trigger active</span>
                  </div>
                </div>
              </div>

              {/* Google Tag Manager */}
              <div className="p-5 bg-white rounded-2xl border border-zinc-200/80 shadow-subtle space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-500 text-white flex items-center justify-center font-bold text-xs">
                    GTM
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-zinc-900">Google Tag Manager</h3>
                    <p className="text-[10px] text-zinc-400">GA4 & Custom Tags</p>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">
                    GTM Container ID
                  </label>
                  <input
                    type="text"
                    value={gtmContainerId}
                    onChange={(e) => setGtmContainerId(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs outline-none focus:border-zinc-900 font-mono"
                  />
                </div>

                <div className="text-[10px] text-zinc-500 space-y-1">
                  <div className="flex items-center space-x-1 text-emerald-600 font-semibold">
                    <Check className="w-3 h-3" />
                    <span>dataLayer ecommerce array connected</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-zinc-900 text-white rounded-2xl flex items-center justify-between">
              <div>
                <span className="font-bold text-xs block">Marketing Configuration Status</span>
                <span className="text-[11px] text-zinc-400">All conversion pixels inject automatically across your storefront.</span>
              </div>
              <button
                onClick={() => alert("Marketing pixels updated and live across your storefront!")}
                className="px-4 py-2 bg-white text-zinc-900 font-bold text-xs rounded-xl hover:bg-zinc-100 transition shadow-sm btn-press"
              >
                Save Pixel Settings
              </button>
            </div>
          </div>
        )}

        {/* TAB 8: THEME CUSTOMIZER */}
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
                        <div key={p.id} className="bg-white p-2 rounded-xl border border-zinc-200">
                          <div className="w-full h-16 bg-zinc-100 rounded-lg overflow-hidden mb-1.5 border border-zinc-100">
                            {p.imageUrl ? (
                              <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-zinc-300">
                                <Package className="w-4 h-4" />
                              </div>
                            )}
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

      {/* MODAL 2: OFFICIAL COURIER THERMAL SHIPPING LABEL & PACKING SLIP */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-zinc-300">
            {/* Courier Thermal Label Header */}
            <div className="border-2 border-black p-4 rounded-xl space-y-3 font-mono">
              <div className="flex items-center justify-between border-b-2 border-black pb-2">
                <div>
                  <h3 className="font-black text-sm uppercase tracking-wider text-black">
                    {selectedInvoice.courier || "STEADFAST COURIER"}
                  </h3>
                  <div className="text-[10px] text-black">Express Parcel Dispatch</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold text-black uppercase">ZONE</div>
                  <div className="text-xs font-black text-black">{selectedInvoice.zone || "METRO"}</div>
                </div>
              </div>

              {/* Barcode Graphic */}
              <div className="text-center py-2 bg-zinc-50 border border-zinc-300 rounded">
                <div className="text-lg font-black tracking-widest text-black">
                  ||| | |||| | ||| {selectedInvoice.consignmentId || "ST-902410"} |||| | ||
                </div>
                <div className="text-[10px] font-bold text-zinc-600 mt-0.5">
                  CONSIGNMENT #{selectedInvoice.consignmentId || "ST-902410"}
                </div>
              </div>

              {/* Destination & Recipient */}
              <div className="border-b-2 border-black pb-2 text-xs space-y-1">
                <div>
                  <span className="text-[10px] font-bold uppercase text-zinc-500 block">Deliver To:</span>
                  <div className="font-bold text-black text-sm">{selectedInvoice.customerName}</div>
                  <div className="font-bold text-black">{selectedInvoice.customerPhone}</div>
                  <div className="text-black text-[11px] leading-tight mt-0.5">{selectedInvoice.shippingAddress || "Dhaka Metropolitan Area"}</div>
                </div>
              </div>

              {/* Collectible Cash Amount (Large Bold) */}
              <div className="p-2.5 bg-black text-white rounded flex items-center justify-between">
                <div>
                  <div className="text-[9px] uppercase tracking-wider text-zinc-300">COD Collectible Amount:</div>
                  <div className="text-lg font-black">{currency}{selectedInvoice.totalAmount.toFixed(2)}</div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] uppercase tracking-wider text-zinc-300">Payment:</div>
                  <div className="text-xs font-bold uppercase">{selectedInvoice.paymentMethod}</div>
                </div>
              </div>

              {/* Return Merchant Info */}
              <div className="pt-1 text-[10px] text-zinc-600 flex justify-between">
                <span>From: {storeName}</span>
                <span>Hub: Tejgaon Sorting</span>
              </div>
            </div>

            <div className="mt-5 flex justify-end space-x-2">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-50"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-zinc-900 text-white rounded-xl text-xs font-bold btn-press shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print 4x6 Label</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: 1-CLICK COURIER DISPATCH */}
      {courierDispatchOrder && (
        <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-zinc-200 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <h4 className="font-bold text-sm text-zinc-900">Dispatch via Courier</h4>
              </div>
              <button
                onClick={() => setCourierDispatchOrder(null)}
                className="text-zinc-400 hover:text-zinc-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs space-y-1 p-3 bg-zinc-50 rounded-xl border border-zinc-200">
              <div className="font-bold text-zinc-900">{courierDispatchOrder.orderNumber} - {courierDispatchOrder.customerName}</div>
              <div className="text-zinc-500 font-mono">{courierDispatchOrder.customerPhone}</div>
              <div className="text-zinc-600">{courierDispatchOrder.shippingAddress}</div>
              <div className="font-bold text-zinc-900 pt-1">
                COD Due: {currency}{courierDispatchOrder.totalAmount.toFixed(2)}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase text-zinc-600">
                Choose Courier Partner:
              </label>
              {(["steadfast", "pathao", "redx"] as CourierProviderId[]).map((cid) => {
                const c = COURIER_PROVIDERS[cid];
                const isSelected = selectedCourierId === cid;
                return (
                  <button
                    key={cid}
                    type="button"
                    onClick={() => setSelectedCourierId(cid)}
                    className={`w-full p-2.5 rounded-xl border text-left text-xs transition flex items-center justify-between ${
                      isSelected
                        ? "border-zinc-900 bg-zinc-900 text-white shadow-sm"
                        : "border-zinc-200 hover:border-zinc-300 bg-white text-zinc-800"
                    }`}
                  >
                    <div>
                      <div className="font-bold">{c.name}</div>
                      <div className={`text-[10px] ${isSelected ? "text-zinc-300" : "text-zinc-400"}`}>
                        {c.tagline}
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handleDispatchCourier(courierDispatchOrder, selectedCourierId)}
              className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center space-x-1.5 btn-press"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Confirm & Generate Consignment</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
