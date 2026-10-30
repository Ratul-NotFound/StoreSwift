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
  Share2,
  Check
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
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans selection:bg-zinc-900 selection:text-white">
      {/* Top Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-zinc-200/80 sticky top-0 z-30 shadow-subtle">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href={`/store/${tenantSlug}`}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Catalog</span>
          </Link>
          <span className="font-bold text-zinc-900 text-sm capitalize">
            {tenantSlug.replace("-", " ")}
          </span>
          <Link
            href={`/store/${tenantSlug}`}
            className="p-2 text-zinc-700 hover:text-zinc-900 transition"
          >
            <ShoppingBag className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs text-zinc-400 mb-6">
          <Link href={`/store/${tenantSlug}`} className="hover:text-zinc-600">Catalog</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-zinc-700 font-medium">{matchingProduct.title}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-6 sm:p-10 rounded-2xl border border-zinc-200/80 shadow-subtle">
          {/* Product Image Box */}
          <div className="flex flex-col space-y-3">
            <div className="w-full h-80 sm:h-96 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-400 border border-zinc-200/60">
              <ShoppingBag className="w-16 h-16 text-zinc-300" />
            </div>
            <div className="flex items-center justify-center space-x-2 text-xs text-zinc-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Authentic Quality Guarantee</span>
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-1 text-amber-400 mb-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
                <span className="text-[11px] font-semibold text-zinc-400 ml-1.5">4.9 (48 reviews)</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight leading-snug">
                {matchingProduct.title}
              </h1>

              <div className="mt-3 flex items-baseline space-x-2.5">
                <span className="text-2xl font-bold text-zinc-900">
                  ${selectedVariant ? selectedVariant.price : matchingProduct.basePrice}
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded">
                  In Stock
                </span>
              </div>

              <p className="mt-3 text-xs text-zinc-500 leading-relaxed">
                {matchingProduct.description}
              </p>

              {/* Variants Selector */}
              {matchingVariants.length > 0 && (
                <div className="mt-6 space-y-2.5">
                  <label className="block text-[11px] font-semibold text-zinc-700 uppercase tracking-wider">
                    Options:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {matchingVariants.map((v, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedVariant(v)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold transition text-left ${
                          selectedVariant?.sku === v.sku
                            ? "border-zinc-900 bg-zinc-900 text-white shadow-sm"
                            : "border-zinc-200 hover:border-zinc-300 text-zinc-700"
                        }`}
                      >
                        <div>{v.title}</div>
                        <div className={`text-[10px] font-mono mt-0.5 ${selectedVariant?.sku === v.sku ? "text-zinc-300" : "text-zinc-400"}`}>
                          {v.sku}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Stepper */}
              <div className="mt-5 flex items-center space-x-3">
                <label className="text-[11px] font-semibold text-zinc-700 uppercase tracking-wider">
                  Quantity:
                </label>
                <div className="inline-flex items-center space-x-2 bg-zinc-100 p-1 rounded-lg border border-zinc-200">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-6 h-6 bg-white rounded flex items-center justify-center font-bold text-xs text-zinc-700 shadow-sm"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold text-zinc-900 w-5 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-6 h-6 bg-white rounded flex items-center justify-center font-bold text-xs text-zinc-700 shadow-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-5 border-t border-zinc-100 space-y-3">
              {addedNotice && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Added {quantity} unit(s) to your cart!</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center space-x-2 btn-press"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
                <Link
                  href={`/store/${tenantSlug}`}
                  className="py-3 px-5 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-800 font-semibold text-xs rounded-xl transition text-center btn-press"
                >
                  Buy Now (COD / Card)
                </Link>
              </div>

              <div className="pt-3 flex items-center justify-between text-[11px] text-zinc-500">
                <div className="flex items-center space-x-1.5">
                  <Truck className="w-3.5 h-3.5 text-zinc-700" />
                  <span>Doorstep delivery available</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Cash on Delivery accepted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-zinc-200/80 py-6 text-center text-xs text-zinc-400">
        {tenantSlug}.storeswift.com • Powered by StoreSwift
      </footer>
    </div>
  );
}
