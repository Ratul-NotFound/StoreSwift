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
  Check,
  RotateCcw,
  Sparkles,
  Lock,
  ArrowRight
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
  const [activeTab, setActiveTab] = useState<"desc" | "shipping" | "reviews">("desc");

  const handleAddToCart = () => {
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3000);
  };

  const currentPrice = selectedVariant
    ? parseFloat(selectedVariant.price)
    : parseFloat(matchingProduct.basePrice);

  const comparePrice = currentPrice * 1.35;

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans selection:bg-zinc-900 selection:text-white">
      {/* Top Banner */}
      <div className="bg-zinc-900 text-white text-[11px] py-2 px-4 text-center font-medium">
        ⚡ Free Express Delivery on orders over $50 • Cash on Delivery accepted nationwide
      </div>

      {/* Top Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-zinc-200/80 sticky top-0 z-30 shadow-subtle">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href={`/store/${tenantSlug}`}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Catalog</span>
          </Link>
          <span className="font-bold text-zinc-900 text-sm capitalize">
            {tenantSlug.replace("-", " ")}
          </span>
          <Link
            href={`/store/${tenantSlug}`}
            className="inline-flex items-center space-x-1 text-xs font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 px-3 py-1.5 rounded-full transition"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Store</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs text-zinc-400 mb-6">
          <Link href={`/store/${tenantSlug}`} className="hover:text-zinc-600">Store</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-zinc-700 font-medium truncate">{matchingProduct.title}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 bg-white p-6 sm:p-10 rounded-2xl border border-zinc-200/80 shadow-subtle">
          {/* Left Column: Product Photo Frame */}
          <div className="flex flex-col space-y-4">
            <div className="relative w-full h-80 sm:h-96 rounded-2xl bg-zinc-100 overflow-hidden border border-zinc-200/60 shadow-inner group">
              <img
                src={matchingProduct.imageUrl || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80"}
                alt={matchingProduct.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {matchingProduct.badge && (
                <span className="absolute top-3 left-3 bg-zinc-900/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                  {matchingProduct.badge}
                </span>
              )}
              <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-zinc-900 flex items-center space-x-1 shadow-sm">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                <span>{matchingProduct.rating || 4.9}</span>
                <span className="text-zinc-400 font-normal ml-0.5">(48 reviews)</span>
              </div>
            </div>

            {/* Quality & Trust Badges */}
            <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-zinc-500">
              <div className="flex items-center space-x-2 bg-zinc-50 p-2.5 rounded-xl border border-zinc-200/60">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="font-medium text-zinc-700">100% Genuine Guaranteed</span>
              </div>
              <div className="flex items-center space-x-2 bg-zinc-50 p-2.5 rounded-xl border border-zinc-200/60">
                <RotateCcw className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="font-medium text-zinc-700">7-Day Free Returns</span>
              </div>
            </div>
          </div>

          {/* Right Column: Product Details & Controls */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-1.5 text-amber-500 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
                <span className="text-xs font-bold text-zinc-800 ml-1.5">{matchingProduct.rating || 4.9}</span>
                <span className="text-xs text-zinc-400">• Verified Customer Reviews</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight leading-snug">
                {matchingProduct.title}
              </h1>

              {/* Price Row */}
              <div className="mt-4 flex items-baseline space-x-3">
                <span className="text-3xl font-black text-zinc-900">
                  ${currentPrice.toFixed(2)}
                </span>
                <span className="text-sm text-zinc-400 line-through">
                  ${comparePrice.toFixed(2)}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
                  Save 35%
                </span>
                <span className="text-xs font-semibold text-emerald-600 flex items-center space-x-1 ml-auto">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>In Stock</span>
                </span>
              </div>

              <p className="mt-4 text-xs text-zinc-600 leading-relaxed">
                {matchingProduct.description}
              </p>

              {/* Variant Matrix Selector */}
              {matchingVariants.length > 0 && (
                <div className="mt-6 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-700 uppercase tracking-wider">
                      Select Variant:
                    </span>
                    <span className="font-mono text-zinc-400 text-[11px]">
                      SKU: {selectedVariant?.sku}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {matchingVariants.map((v, i) => {
                      const isSelected = selectedVariant?.sku === v.sku;
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setSelectedVariant(v)}
                          className={`p-2.5 rounded-xl border text-xs font-semibold transition text-left btn-press ${
                            isSelected
                              ? "border-zinc-900 bg-zinc-900 text-white shadow-sm ring-1 ring-zinc-900"
                              : "border-zinc-200 hover:border-zinc-300 text-zinc-700 bg-white"
                          }`}
                        >
                          <div>{v.title}</div>
                          <div
                            className={`text-[10px] mt-0.5 ${
                              isSelected ? "text-zinc-300" : "text-zinc-400"
                            }`}
                          >
                            ${v.price} • {v.inventoryQuantity} in stock
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Stepper */}
              <div className="mt-6 flex items-center space-x-3">
                <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                  Quantity:
                </label>
                <div className="inline-flex items-center space-x-3 bg-zinc-100 p-1.5 rounded-xl border border-zinc-200">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 bg-white rounded-lg flex items-center justify-center font-bold text-xs text-zinc-700 shadow-sm hover:bg-zinc-50"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold text-zinc-900 w-6 text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-7 bg-white rounded-lg flex items-center justify-center font-bold text-xs text-zinc-700 shadow-sm hover:bg-zinc-50"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Actions Section */}
            <div className="mt-8 pt-6 border-t border-zinc-100 space-y-3">
              {addedNotice && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center space-x-2 shadow-sm animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Added {quantity}x "{matchingProduct.title}" to your cart!</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center space-x-2 btn-press"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart • ${(currentPrice * quantity).toFixed(2)}</span>
                </button>
                <Link
                  href={`/store/${tenantSlug}`}
                  className="py-3 px-5 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-800 font-semibold text-xs rounded-xl transition text-center btn-press flex items-center justify-center space-x-1.5"
                >
                  <span>Quick COD Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
                </Link>
              </div>

              <div className="pt-3 flex items-center justify-between text-[11px] text-zinc-500">
                <div className="flex items-center space-x-1.5">
                  <Truck className="w-3.5 h-3.5 text-zinc-700" />
                  <span>Doorstep delivery (2-4 business days)</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Secure 256-bit checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Info Section: Description, Shipping, Reviews */}
        <div className="mt-8 bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200/80 shadow-subtle">
          <div className="flex space-x-4 border-b border-zinc-100 pb-3 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("desc")}
              className={`pb-2 border-b-2 transition ${
                activeTab === "desc"
                  ? "border-zinc-900 text-zinc-900"
                  : "border-transparent text-zinc-400 hover:text-zinc-600"
              }`}
            >
              Description & Specifications
            </button>
            <button
              onClick={() => setActiveTab("shipping")}
              className={`pb-2 border-b-2 transition ${
                activeTab === "shipping"
                  ? "border-zinc-900 text-zinc-900"
                  : "border-transparent text-zinc-400 hover:text-zinc-600"
              }`}
            >
              Shipping & Returns
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`pb-2 border-b-2 transition ${
                activeTab === "reviews"
                  ? "border-zinc-900 text-zinc-900"
                  : "border-transparent text-zinc-400 hover:text-zinc-600"
              }`}
            >
              Customer Reviews (48)
            </button>
          </div>

          <div className="pt-4 text-xs text-zinc-600 leading-relaxed">
            {activeTab === "desc" && (
              <div className="space-y-3">
                <p>{matchingProduct.description}</p>
                <ul className="list-disc pl-5 space-y-1 text-zinc-500">
                  <li>Premium authentic materials certified for everyday durability.</li>
                  <li>Pre-shrunk fabric weave designed to resist fading and warping.</li>
                  <li>Designed with modern minimalist aesthetic standards.</li>
                </ul>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="space-y-3">
                <p>We deliver nationwide with local courier partners:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-zinc-600">
                  <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200">
                    <strong className="text-zinc-900 block mb-1">Standard Delivery</strong>
                    2-4 business days. Free on orders above $50. Flat $4.99 otherwise.
                  </div>
                  <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200">
                    <strong className="text-zinc-900 block mb-1">Cash on Delivery (COD)</strong>
                    Inspect the parcel and pay in cash directly to the delivery courier.
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                  <div className="text-2xl font-black text-zinc-900">4.9</div>
                  <div>
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-[11px] text-zinc-500">Based on 48 verified customer ratings</span>
                  </div>
                </div>

                <div className="divide-y divide-zinc-100">
                  <div className="py-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-zinc-900">Michael R.</span>
                      <span className="text-[11px] text-zinc-400">2 days ago</span>
                    </div>
                    <div className="flex text-amber-500 my-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    <p className="text-zinc-600">
                      Super high quality and fits true to size. Delivery with COD was seamless. Highly recommend!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-zinc-200/80 py-6 text-center text-xs text-zinc-400">
        {tenantSlug}.storeswift.com • Powered by <strong className="text-zinc-600">StoreSwift</strong>
      </footer>
    </div>
  );
}
