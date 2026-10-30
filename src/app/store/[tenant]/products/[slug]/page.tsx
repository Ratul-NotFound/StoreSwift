"use client";

import { useState, use, useMemo } from "react";
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
  ArrowRight,
  Flame,
  Banknote
} from "lucide-react";
import { generateStoreSeedData } from "@/lib/seed-store";
import { getCategoryConfig } from "@/config/categories";
import { TemplateFactory } from "@/templates";
import { ProductJsonLd } from "@/components/seo/product-jsonld";
import { useToast } from "@/components/ui/toast";
import { trackEvent } from "@/lib/analytics";

export default function ProductDetailPage({
  params
}: {
  params: Promise<{ tenant: string; slug: string }>;
}) {
  const resolvedParams = use(params);
  const tenantSlug = resolvedParams.tenant || "apex-fashion";
  const productSlug = resolvedParams.slug || "classic-cotton-tshirt";

  const { success } = useToast();

  const categoryKey = useMemo(() => {
    const combined = (tenantSlug + " " + productSlug).toLowerCase();
    if (combined.includes("shoe") || combined.includes("sneaker") || combined.includes("boot") || combined.includes("runner")) return "shoes";
    if (combined.includes("beauty") || combined.includes("cosmetic") || combined.includes("glow") || combined.includes("skin") || combined.includes("serum") || combined.includes("balm")) return "beauty_cosmetics";
    if (combined.includes("tech") || combined.includes("byte") || combined.includes("gadget") || combined.includes("audio") || combined.includes("headphone") || combined.includes("keyboard")) return "electronics";
    if (combined.includes("jewel") || combined.includes("watch") || combined.includes("gold") || combined.includes("ring")) return "jewelry";
    if (combined.includes("coffee") || combined.includes("honey") || combined.includes("food") || combined.includes("roast")) return "grocery_food";
    return "fashion";
  }, [tenantSlug, productSlug]);

  const categoryConfig = getCategoryConfig(categoryKey);
  const template = TemplateFactory.getTemplate(categoryConfig.recommendedTemplate);

  const seed = generateStoreSeedData(tenantSlug, categoryKey);
  const matchingProduct =
    seed.products.find((p) => p.slug === productSlug) || seed.products[0];
  const matchingVariants = seed.variants.filter(
    (v) => v.productSlug === matchingProduct.slug
  );

  const [selectedVariant, setSelectedVariant] = useState(matchingVariants[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "shipping" | "reviews">("desc");
  const [activeImageAngle, setActiveImageAngle] = useState<"primary" | "secondary">("primary");
  const [copiedLink, setCopiedLink] = useState(false);

  const currentPrice = selectedVariant
    ? parseFloat(selectedVariant.price)
    : parseFloat(matchingProduct.basePrice);
  const comparePrice = currentPrice * 1.35;
  const isLowStock = selectedVariant && selectedVariant.inventoryQuantity <= 5;
  const discountPct = template.calculateDiscount(currentPrice, comparePrice);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      success("Link Copied", "Product link copied to clipboard.");
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleAddToCart = () => {
    trackEvent("add_to_cart", {
      productSlug: matchingProduct.slug,
      variantSku: selectedVariant?.sku,
      quantity,
      price: currentPrice
    });

    success(
      "Added to Bag",
      `${quantity}x ${matchingProduct.title} (${selectedVariant?.title || "Standard"}) added.`
    );
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-500 ${template.classes.pageBg}`}>
      {/* Schema.org Structured Data for SEO Rich Snippets */}
      <ProductJsonLd
        product={{
          title: matchingProduct.title,
          description: matchingProduct.description,
          slug: matchingProduct.slug,
          basePrice: currentPrice,
          currency: "USD",
          imageUrl: matchingProduct.imageUrl,
          rating: matchingProduct.rating || 4.9,
          inStock: (selectedVariant?.inventoryQuantity ?? 10) > 0,
          brandName: tenantSlug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
        }}
      />

      {/* Top Header */}
      <header className={`sticky top-0 z-30 shadow-subtle transition-colors duration-300 ${template.classes.headerBg}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href={`/store/${tenantSlug}`}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold opacity-75 hover:opacity-100 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Storefront</span>
          </Link>
          <span className="font-bold text-sm capitalize">
            {tenantSlug.replace(/-/g, " ")}
          </span>
          <Link
            href={`/store/${tenantSlug}`}
            className={`inline-flex items-center space-x-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition btn-press ${template.classes.primaryButton}`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Store</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 pb-24 sm:pb-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs opacity-50 mb-6">
          <Link href={`/store/${tenantSlug}`} className="hover:opacity-100 transition">Store</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="font-semibold opacity-80">{categoryConfig.name}</span>
          <ChevronRight className="w-3 h-3" />
          <span className="font-medium truncate opacity-90">{matchingProduct.title}</span>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 p-6 sm:p-10 rounded-2xl border shadow-card transition-colors ${template.classes.productCard}`}>
          {/* Left Column: Product Photo Frame with Dual Angle Toggle */}
          <div className="flex flex-col space-y-4">
            <div className="relative w-full aspect-[4/5] rounded-2xl bg-black/5 dark:bg-white/5 overflow-hidden border border-current/10 shadow-inner group">
              <img
                src={
                  activeImageAngle === "primary"
                    ? (matchingProduct.imageUrl || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80")
                    : (matchingProduct.secondaryImage || matchingProduct.imageUrl || "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80")
                }
                alt={matchingProduct.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {matchingProduct.badge && (
                <span className="absolute top-3 left-3 bg-zinc-950/90 text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                  {template.formatProductBadge(matchingProduct.badge)}
                </span>
              )}
              {discountPct > 0 && (
                <span className="absolute top-3 right-3 bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow">
                  -{discountPct}%
                </span>
              )}
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-white flex items-center space-x-1 shadow-sm">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                <span>{matchingProduct.rating || 4.9}</span>
                <span className="opacity-75 font-normal ml-0.5 text-[11px]">(48 reviews)</span>
              </div>
            </div>

            {/* Dual Angle Angle Switcher */}
            {matchingProduct.secondaryImage && (
              <div className="flex items-center justify-center space-x-2">
                <button
                  type="button"
                  onClick={() => setActiveImageAngle("primary")}
                  className={`text-xs font-mono px-3 py-1.5 rounded-xl border transition ${
                    activeImageAngle === "primary" ? template.classes.pillActive : "opacity-60 hover:opacity-100 border-current/20"
                  }`}
                >
                  Studio Still
                </button>
                <button
                  type="button"
                  onClick={() => setActiveImageAngle("secondary")}
                  className={`text-xs font-mono px-3 py-1.5 rounded-xl border transition ${
                    activeImageAngle === "secondary" ? template.classes.pillActive : "opacity-60 hover:opacity-100 border-current/20"
                  }`}
                >
                  Lookbook On-Model
                </button>
              </div>
            )}

            {/* Quality & Trust Badges */}
            <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] opacity-75">
              <div className="flex items-center space-x-2 p-2.5 rounded-xl border border-current/15 bg-black/5 dark:bg-white/5">
                <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span className="font-medium">100% Genuine Origin</span>
              </div>
              <div className="flex items-center space-x-2 p-2.5 rounded-xl border border-current/15 bg-black/5 dark:bg-white/5">
                <RotateCcw className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span className="font-medium">7-Day Free Returns</span>
              </div>
            </div>
          </div>

          {/* Right Column: Product Details & Controls */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-1.5 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                  <span className="text-xs font-bold ml-1.5">{matchingProduct.rating || 4.9}</span>
                  <span className="text-xs opacity-50">• Verified Customer Rating</span>
                </div>
                <button
                  onClick={handleShare}
                  className="p-1.5 rounded-lg opacity-60 hover:opacity-100 transition"
                  title="Share product"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
                </button>
              </div>

              <span className={template.classes.editorialTag}>
                {categoryConfig.name} ARCHIVE
              </span>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug mt-1">
                {matchingProduct.title}
              </h1>

              {/* Price Row & Psychological Urgency */}
              <div className="mt-4 flex items-baseline space-x-3">
                <span className="text-3xl font-black">
                  {template.formatPrice(currentPrice)}
                </span>
                <span className="text-sm opacity-40 line-through">
                  {template.formatPrice(comparePrice)}
                </span>
                {discountPct > 0 && (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    Save {discountPct}%
                  </span>
                )}
                <span className="text-xs font-semibold text-emerald-500 flex items-center space-x-1 ml-auto">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>In Stock</span>
                </span>
              </div>

              {/* Scarcity Trigger */}
              {isLowStock && (
                <div className="mt-3 p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center space-x-2 text-amber-700 dark:text-amber-300 text-xs font-medium">
                  <Flame className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 animate-bounce" />
                  <span>{template.getScarcityUrgency(selectedVariant?.inventoryQuantity || 3)}</span>
                </div>
              )}

              <p className="mt-4 text-xs opacity-75 leading-relaxed">
                {matchingProduct.description}
              </p>

              {/* Variant Matrix Selector */}
              {matchingVariants.length > 0 && (
                <div className="mt-6 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold uppercase tracking-wider text-[11px] opacity-75">
                      Select Variant:
                    </span>
                    <span className="font-mono opacity-50 text-[10px]">
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
                              ? template.classes.pillActive
                              : "border-current/15 opacity-75 hover:opacity-100"
                          }`}
                        >
                          <div>{v.title}</div>
                          <div className="text-[10px] mt-0.5 opacity-60">
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
                <label className="text-xs font-semibold uppercase tracking-wider text-[11px] opacity-75">
                  Quantity:
                </label>
                <div className="inline-flex items-center space-x-3 bg-black/5 dark:bg-white/5 p-1.5 rounded-xl border border-current/15">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 bg-white dark:bg-zinc-800 rounded-lg flex items-center justify-center font-bold text-xs shadow-sm hover:opacity-80"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold w-6 text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-7 bg-white dark:bg-zinc-800 rounded-lg flex items-center justify-center font-bold text-xs shadow-sm hover:opacity-80"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Actions Section */}
            <div className="mt-8 pt-6 border-t border-current/10 space-y-3">
              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`flex-1 py-3 font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center space-x-2 btn-press ${template.classes.primaryButton}`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag • {template.formatPrice(currentPrice * quantity)}</span>
                </button>
                <Link
                  href={`/store/${tenantSlug}`}
                  className="py-3 px-5 border border-current/20 hover:border-current/40 font-semibold text-xs rounded-xl transition text-center btn-press flex items-center justify-center space-x-1.5"
                >
                  <Banknote className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Cash on Delivery (COD)</span>
                </Link>
              </div>

              <div className="pt-3 flex items-center justify-between text-[11px] opacity-60">
                <div className="flex items-center space-x-1.5">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Nationwide Inspection Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Info Accordion: Description, Specs, Shipping, Reviews */}
        <div className={`mt-8 p-6 sm:p-8 rounded-2xl border shadow-subtle transition-colors ${template.classes.toolbarBg}`}>
          <div className="flex space-x-4 border-b border-current/10 pb-3 text-xs font-bold">
            <button
              onClick={() => setActiveTab("desc")}
              className={`pb-2 transition ${
                activeTab === "desc"
                  ? "border-b-2 border-current"
                  : "opacity-50 hover:opacity-80"
              }`}
            >
              Description & Craft
            </button>
            <button
              onClick={() => setActiveTab("shipping")}
              className={`pb-2 transition ${
                activeTab === "shipping"
                  ? "border-b-2 border-current"
                  : "opacity-50 hover:opacity-80"
              }`}
            >
              Shipping & COD Inspection
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`pb-2 transition ${
                activeTab === "reviews"
                  ? "border-b-2 border-current"
                  : "opacity-50 hover:opacity-80"
              }`}
            >
              Customer Reviews (48)
            </button>
          </div>

          <div className="pt-4 text-xs opacity-75 leading-relaxed">
            {activeTab === "desc" && (
              <div className="space-y-2">
                <p>{matchingProduct.description}</p>
                <p>
                  <strong>Craft Signature:</strong> {template.getBrandSignature()}
                </p>
              </div>
            )}
            {activeTab === "shipping" && (
              <div className="space-y-2">
                <p>
                  <strong>{template.getShippingPolicy().dispatchHours}-Hour Express Dispatch:</strong> Priority order handling with automated courier SMS tracking.
                </p>
                <p>
                  <strong>Cash on Delivery (COD):</strong> {template.getShippingPolicy().inspectionPolicy}
                </p>
              </div>
            )}
            {activeTab === "reviews" && (
              <div className="space-y-3">
                <div className="p-3 rounded-xl border border-current/10 bg-black/5 dark:bg-white/5 space-y-1">
                  <div className="flex items-center space-x-1 text-amber-500">
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-[10px] font-bold text-zinc-900 dark:text-white ml-1">Verified Buyer</span>
                  </div>
                  <p className="text-[11px]">
                    "Outstanding build quality. Exactly as shown in the on-model lookbook view. COD inspection was fast and seamless."
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Sticky Bar */}
      <div className={`sm:hidden fixed bottom-0 left-0 right-0 p-3 z-40 flex items-center justify-between border-t shadow-float ${template.classes.headerBg}`}>
        <div>
          <span className="text-[10px] opacity-60 block">Total</span>
          <span className="text-base font-bold">{template.formatPrice(currentPrice * quantity)}</span>
        </div>
        <button
          onClick={handleAddToCart}
          className={`py-2.5 px-6 font-bold text-xs rounded-xl shadow-sm btn-press flex items-center space-x-1.5 ${template.classes.primaryButton}`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Add to Bag</span>
        </button>
      </div>

      <footer className={`py-6 text-center text-xs opacity-60 border-t ${template.classes.headerBg}`}>
        Powered by StoreSwift eCommerce • Verified Merchant
      </footer>
    </div>
  );
}
