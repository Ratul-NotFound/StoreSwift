"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Building2,
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Users,
  Search,
  CheckCircle2,
  Ban,
  ExternalLink,
  Store,
  Layers,
  Sparkles
} from "lucide-react";

export default function PlatformSuperAdminPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [stores, setStores] = useState([
    {
      id: "store-1",
      name: "Apex Fashion Hub",
      slug: "apex-fashion",
      ownerEmail: "sarah@apexfashion.com",
      category: "Fashion & Apparel",
      plan: "Growth ($29/mo)",
      productsCount: 42,
      ordersCount: 158,
      status: "Active",
      createdAt: "Oct 12, 2026"
    },
    {
      id: "store-2",
      name: "ByteMart Tech Gear",
      slug: "bytemart",
      ownerEmail: "alex@bytemart.io",
      category: "Electronics & Tech",
      plan: "Starter ($9/mo)",
      productsCount: 18,
      ordersCount: 64,
      status: "Active",
      createdAt: "Oct 19, 2026"
    },
    {
      id: "store-3",
      name: "Green Valley Organics",
      slug: "green-valley",
      ownerEmail: "farmer@greenvalley.com",
      category: "Food & Grocery",
      plan: "Free Trial (14 days)",
      productsCount: 12,
      ordersCount: 19,
      status: "Trial",
      createdAt: "Oct 27, 2026"
    },
    {
      id: "store-4",
      name: "Glow & Radiance Skincare",
      slug: "glow-radiance",
      ownerEmail: "beauty@glow.com",
      category: "Beauty & Cosmetics",
      plan: "Pro ($79/mo)",
      productsCount: 85,
      ordersCount: 412,
      status: "Active",
      createdAt: "Sep 28, 2026"
    },
    {
      id: "store-5",
      name: "Urban Craft Studio",
      slug: "urban-craft",
      ownerEmail: "mark@urbancraft.com",
      category: "General Crafts",
      plan: "Past Due",
      productsCount: 9,
      ordersCount: 7,
      status: "Suspended",
      createdAt: "Aug 15, 2026"
    }
  ]);

  const handleToggleStoreStatus = (storeId: string) => {
    setStores(prev =>
      prev.map(s => {
        if (s.id === storeId) {
          const nextStatus = s.status === "Suspended" ? "Active" : "Suspended";
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
  };

  const filteredStores = stores.filter(
    s =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.ownerEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-slate-950 border-b border-slate-800 px-6 sm:px-10 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-600/30">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="font-black text-white text-base tracking-tight flex items-center space-x-2">
              <span>Platform Super-Admin</span>
              <span className="text-[10px] bg-indigo-900/60 text-indigo-300 border border-indigo-700 px-2 py-0.5 rounded font-mono">
                Root Access
              </span>
            </div>
            <div className="text-xs text-slate-400">LaunchCommerce Network Monitoring</div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            ← Public Website
          </Link>
          <Link
            href="/admin"
            className="text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            Merchant Admin
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-10 space-y-8">
        {/* Network Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-slate-800/80 border border-slate-700/80 p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
              <span>Monthly Recurring (MRR)</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-white mt-2">$3,480.00</div>
            <div className="text-xs text-emerald-400 font-semibold mt-1 flex items-center space-x-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+24% vs last month</span>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
              <span>Total Stores Hosted</span>
              <Store className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-3xl font-black text-white mt-2">{stores.length}</div>
            <div className="text-xs text-slate-400 font-semibold mt-1">
              {stores.filter(s => s.status === "Active").length} active paying stores
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
              <span>Total Orders Processed</span>
              <ShoppingBag className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-3xl font-black text-white mt-2">
              {stores.reduce((acc, s) => acc + s.ordersCount, 0)}
            </div>
            <div className="text-xs text-purple-400 font-semibold mt-1">Across all merchant shops</div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
              <span>Avg. Tenant Products</span>
              <Layers className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-black text-white mt-2">33.2</div>
            <div className="text-xs text-slate-400 font-semibold mt-1">With multi-option matrices</div>
          </div>
        </div>

        {/* Tenant Stores Management Table */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Registered Merchant Stores</h2>
              <p className="text-xs text-slate-400">Inspect, monitor, and suspend/activate tenant shops.</p>
            </div>

            {/* Search Input */}
            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search stores or owners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900/60 border-b border-slate-700/80 text-xs font-bold uppercase text-slate-400">
                <tr>
                  <th className="px-6 py-4">Store & Subdomain</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Subscription Plan</th>
                  <th className="px-6 py-4">Catalog / Orders</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {filteredStores.map((store) => (
                  <tr key={store.id} className="hover:bg-slate-700/30 transition">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{store.name}</div>
                      <div className="text-xs text-indigo-400 font-mono">
                        {store.slug}.platform.com
                      </div>
                      <div className="text-[11px] text-slate-400">{store.ownerEmail}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-300 font-medium">
                      {store.category}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold bg-slate-900 border border-slate-700 px-2.5 py-1 rounded text-slate-200">
                        {store.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-300">
                      <div><strong className="text-white">{store.productsCount}</strong> products</div>
                      <div><strong className="text-white">{store.ordersCount}</strong> orders</div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          store.status === "Active"
                            ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800"
                            : store.status === "Trial"
                            ? "bg-blue-950/80 text-blue-400 border border-blue-800"
                            : "bg-red-950/80 text-red-400 border border-red-800"
                        }`}
                      >
                        {store.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center space-x-2">
                        <Link
                          href={`/store/${store.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition"
                          title="Open Storefront"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleToggleStoreStatus(store.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                            store.status === "Suspended"
                              ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                              : "bg-red-900/60 hover:bg-red-800 text-red-200 border border-red-700"
                          }`}
                        >
                          {store.status === "Suspended" ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Reactivate</span>
                            </>
                          ) : (
                            <>
                              <Ban className="w-3.5 h-3.5" />
                              <span>Suspend</span>
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <footer className="py-6 border-t border-slate-800 text-center text-xs text-slate-500">
        LaunchCommerce SaaS Platform Network Core • Super-Admin Portal
      </footer>
    </div>
  );
}

