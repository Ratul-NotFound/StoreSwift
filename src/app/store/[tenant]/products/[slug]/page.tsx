"use client";

import { useState, use } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  ArrowLeft,
  CheckCircle2,
  Truck,
  ShieldCheck,
  Star,
  ChevronRight,
  Share2
} from "lucide-react";
import { generateStoreSeedData } from "@/lib/seed-store";

export default function ProductDetailPage({
  params
}: {
  params: Promise<{ tenant: string; slug: string }>;
}) {
  const resolvedParams = use(params);
  const tenantSlug = resolvedParams.tenant || "apex-fashion";
  const productSlug = resolvedParams.slug || "classic-cotton-tshirt";

  const seed = generateStoreSeedData(tenantSlug, "fashion");
  const matchingProduct =
    seed.products.find((p) => p.slug === productSlug) || seed.products[0];
  const matchingVariants = seed.variants.filter(
    (v) => v.productSlug === matchingProduct.slug
  );

  const [selectedVariant, setSelectedVariant] = useState(matchingVariants[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  const handleAddToCart = () => {
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href={`/store/${tenantSlug}`}
            className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Catalog</span>
          </Link>
          <span className="font-extrabold text-slate-900 text-sm capitalize">
            {tenantSlug.replace("-", " ")}
          </span>
          <Link
            href={`/store/${tenantSlug}`}
            className="p-2 text-slate-700 hover:text-blue-600 transition"
          >
            <ShoppingBag className="w-5 h-5" />
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs text-slate-400 mb-8">
          <Link href={`/store/${tenantSlug}`} className="hover:text-slate-600">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-700 font-semibold">{matchingProduct.title}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm">
          {/* Product Image Gallery */}
          <div className="flex flex-col space-y-4">
            <div className="w-full h-80 sm:h-96 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300 border border-slate-200/60">
              <ShoppingBag className="w-24 h-24 text-slate-300" />
            </div>
            <div className="flex items-center justify-center space-x-2 text-xs text-slate-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Guaranteed Authentic Quality</span>
            </div>
          </div>

          {/* Product Details & Selection */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-1 text-amber-400 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
                <span className="text-xs font-bold text-slate-500 ml-2">4.9 (48 customer reviews)</span>
              </div>

              <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-snug">
                {matchingProduct.title}
              </h1>

              <div className="mt-4 flex items-baseline space-x-3">
                <span className="text-3xl font-black text-slate-900">
                  ${selectedVariant ? selectedVariant.price : matchingProduct.basePrice}
                </span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  In Stock & Ready to Ship
                </span>
              </div>

              <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                {matchingProduct.description}
              </p>

              {/* Variants Selector */}
              {matchingVariants.length > 0 && (
                <div className="mt-8 space-y-3">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Select Option:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {matchingVariants.map((v, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedVariant(v)}
                        className={`p-3 rounded-xl border text-xs font-bold transition text-left ${
                          selectedVariant?.sku === v.sku
                            ? "border-blue-600 bg-blue-50 text-blue-800 ring-2 ring-blue-500/20"
                            : "border-slate-200 hover:border-slate-300 text-slate-700"
                        }`}
                      >
                        <div>{v.title}</div>
                        <div className="text-[11px] font-mono text-slate-500 mt-0.5">{v.sku}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mt-6 flex items-center space-x-4">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Quantity:
                </label>
                <div className="inline-flex items-center space-x-3 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 bg-white rounded-lg flex items-center justify-center font-bold text-slate-700 shadow-sm"
                  >
                    -
                  </button>
                  <span className="text-sm font-bold text-slate-900 w-6 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-7 bg-white rounded-lg flex items-center justify-center font-bold text-slate-700 shadow-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-6 border-t border-slate-200 space-y-3">
              {addedNotice && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Added {quantity} unit(s) to your cart!</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
                <Link
                  href={`/store/${tenantSlug}`}
                  className="py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition text-center"
                >
                  Buy Now (COD / Card)
                </Link>
              </div>

              <div className="pt-4 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center space-x-1.5">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>Doorstep delivery available</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Cash on Delivery accepted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        {tenantSlug}.platform.com • Powered by StoreSwift
      </footer>
    </div>
  );
}

