"use client";

import { useState, use, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Store,
  CheckCircle2,
  Truck,
  ShieldCheck,
  X,
  CreditCard,
  Banknote,
  Smartphone,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Search,
  Filter,
  Check,
  Star,
  ArrowUpRight,
  Heart,
  Lock,
  Clock,
  RotateCcw,
  SlidersHorizontal,
  Flame,
  Tag,
  Plus,
  Zap,
  Leaf,
  Award,
  Diamond,
  Cpu,
  Footprints,
  Mail,
  ChevronDown,
  Layers,
  Compass
} from "lucide-react";
import { getCategoryConfig, CATEGORIES_MAP, ALL_CATEGORIES } from "@/config/categories";
import { getTemplateConfig, STORE_TEMPLATES, ALL_TEMPLATES } from "@/config/templates";
import { generateStoreSeedData } from "@/lib/seed-store";
import { calculateCartTotals, CartItem } from "@/lib/cart";
import { useToast } from "@/components/ui/toast";
import { StoreFooter } from "@/components/footer";
import { SearchModal } from "@/components/store/search-modal";
import { SpotlightDrop } from "@/components/store/spotlight-drop";
import { TestimonialsSection } from "@/components/store/testimonials";
import { ExpressCheckoutModal } from "@/components/store/express-checkout-modal";
import { DemoStoreBar } from "@/components/store/demo-store-bar";
import { TrackOrderModal } from "@/components/store/track-order-modal";
import { FashionStorefront } from "@/components/store/templates/fashion-storefront";
import { BeautyStorefront } from "@/components/store/templates/beauty-storefront";
import { FootwearStorefront } from "@/components/store/templates/footwear-storefront";
import { TechStorefront } from "@/components/store/templates/tech-storefront";
import { JewelryStorefront } from "@/components/store/templates/jewelry-storefront";
import { PantryStorefront } from "@/components/store/templates/pantry-storefront";
import { trackEvent } from "@/lib/analytics";

// Visual Category Collections per Department
const CATEGORY_COLLECTIONS: Record<string, Array<{ title: string; subtitle: string; image: string; tag: string }>> = {
  fashion: [
    { title: "Heavyweight Ts", subtitle: "280 GSM Combed Organic", image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=700&auto=format&fit=crop&q=80", tag: "Heavy Cotton" },
    { title: "Kurabo Selvedge", subtitle: "13.5oz Raw Indigo", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=700&auto=format&fit=crop&q=80", tag: "Japanese Mill" },
    { title: "Loopback Terry", subtitle: "450 GSM Raglan Cut", image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=700&auto=format&fit=crop&q=80", tag: "French Terry" },
    { title: "Archival Tailoring", subtitle: "Bonded Twill Overcoats", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=700&auto=format&fit=crop&q=80", tag: "Atelier Outerwear" }
  ],
  shoes: [
    { title: "Propulsion Runners", subtitle: "Carbon Torsion Plate", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&auto=format&fit=crop&q=80", tag: "Nitrogen Foam" },
    { title: "Horween Chelsea", subtitle: "360° Storm Welted", image: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=700&auto=format&fit=crop&q=80", tag: "Chromexcel" },
    { title: "Benchcraft Derby", subtitle: "Vibram Lug Outsoles", image: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=700&auto=format&fit=crop&q=80", tag: "Hand-Lasted" },
    { title: "Heritage Moc Toe", subtitle: "Double-Stitched Leather", image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=700&auto=format&fit=crop&q=80", tag: "Guild Crafted" }
  ],
  beauty_cosmetics: [
    { title: "Bio-Active Serums", subtitle: "Niacinamide & Peptides", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=700&auto=format&fit=crop&q=80", tag: "Clinical 10%" },
    { title: "Barrier Restore", subtitle: "Ceramide Lipid Matrix", image: "https://images.unsplash.com/photo-1608248597359-455b5502a5c4?w=700&auto=format&fit=crop&q=80", tag: "Derm Tested" },
    { title: "Botanical Cleansers", subtitle: "pH-Balanced Oat Milk", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=700&auto=format&fit=crop&q=80", tag: "Sulfate Free" },
    { title: "Mineral Shields", subtitle: "Zinc Oxide SPF 50", image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=700&auto=format&fit=crop&q=80", tag: "Zero White Cast" }
  ],
  electronics: [
    { title: "Planar Audio", subtitle: "40mm Titanium Drivers", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&auto=format&fit=crop&q=80", tag: "ANC Pro" },
    { title: "CNC Keyboards", subtitle: "Gasket-Mounted Brass", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=700&auto=format&fit=crop&q=80", tag: "6063 Aluminum" },
    { title: "Tactile Switches", subtitle: "Factory Hand-Lubed", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=700&auto=format&fit=crop&q=80", tag: "5-Pin Hot Swap" },
    { title: "Braided Power", subtitle: "100W GaN Fast Delivery", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=700&auto=format&fit=crop&q=80", tag: "Silicone Shield" }
  ],
  jewelry: [
    { title: "Solid 18K Bands", subtitle: "Assay Office Stamped", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=700&auto=format&fit=crop&q=80", tag: "750 Hallmarked" },
    { title: "Swiss Calibers", subtitle: "Automatic 28,800 VPH", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=700&auto=format&fit=crop&q=80", tag: "Sapphire Crystal" },
    { title: "Solitaire Gems", subtitle: "D-Color VVS1 Clarity", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=700&auto=format&fit=crop&q=80", tag: "GIA Certified" },
    { title: "Heirloom Pendants", subtitle: "Hand-Set Pavé Bezel", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=700&auto=format&fit=crop&q=80", tag: "Conflict Free" }
  ],
  grocery_food: [
    { title: "Micro-Lot Coffee", subtitle: "Washed Ethiopian Yirgacheffe", image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=700&auto=format&fit=crop&q=80", tag: "Roasted 48h" },
    { title: "Raw Wild Honey", subtitle: "Unfiltered Comb & Nectar", image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=700&auto=format&fit=crop&q=80", tag: "100% Raw" },
    { title: "Estate Olive Oil", subtitle: "Cold-Extracted Koroneiki", image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=700&auto=format&fit=crop&q=80", tag: "<0.2% Acidity" },
    { title: "Stoneground Flour", subtitle: "Ancient Einkorn Grain", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=700&auto=format&fit=crop&q=80", tag: "Non-GMO" }
  ]
};

export default function TenantStorefrontPage({
  params
}: {
  params: Promise<{ tenant: string }>;
}) {
  const resolvedParams = use(params);
  const tenantSlug = resolvedParams.tenant || "apex-fashion";

  const { success, error: toastError } = useToast();

  const initialCategoryKey = useMemo(() => {
    const slug = tenantSlug.toLowerCase();
    if (slug.includes("shoe") || slug.includes("sneaker") || slug.includes("boot")) return "shoes";
    if (slug.includes("beauty") || slug.includes("cosmetic") || slug.includes("glow") || slug.includes("skin")) return "beauty_cosmetics";
    if (slug.includes("tech") || slug.includes("byte") || slug.includes("gadget") || slug.includes("audio")) return "electronics";
    if (slug.includes("jewel") || slug.includes("watch") || slug.includes("gold")) return "jewelry";
    if (slug.includes("coffee") || slug.includes("honey") || slug.includes("food")) return "grocery_food";
    return "fashion";
  }, [tenantSlug]);

  const [activeCategoryKey, setActiveCategoryKey] = useState(initialCategoryKey);
  const categoryConfig = getCategoryConfig(activeCategoryKey);

  const [templateKey, setTemplateKey] = useState<string>(categoryConfig.recommendedTemplate || "minimal");
  const template = getTemplateConfig(templateKey);

  // Floating Theme Menu Toggle
  const seed = useMemo(() => {
    return generateStoreSeedData(tenantSlug, activeCategoryKey);
  }, [tenantSlug, activeCategoryKey]);

  const [products, setProducts] = useState(
    seed.products.map((p, idx) => ({
      id: `prod-${activeCategoryKey}-${idx + 1}`,
      title: p.title,
      slug: p.slug,
      description: p.description,
      price: parseFloat(p.basePrice),
      comparePrice: parseFloat(p.basePrice) * 1.35,
      imageUrl: p.imageUrl || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
      secondaryImage: p.secondaryImage || p.imageUrl || "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80",
      badge: p.badge || (idx === 0 ? "Best Seller" : idx === 1 ? "Trending" : "New"),
      rating: p.rating || 4.9,
      variants: seed.variants.filter((v) => v.productSlug === p.slug)
    }))
  );

  useEffect(() => {
    setProducts(
      seed.products.map((p, idx) => ({
        id: `prod-${activeCategoryKey}-${idx + 1}`,
        title: p.title,
        slug: p.slug,
        description: p.description,
        price: parseFloat(p.basePrice),
        comparePrice: parseFloat(p.basePrice) * 1.35,
        imageUrl: p.imageUrl || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
        secondaryImage: p.secondaryImage || p.imageUrl || "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80",
        badge: p.badge || (idx === 0 ? "Best Seller" : idx === 1 ? "Trending" : "New"),
        rating: p.rating || 4.9,
        variants: seed.variants.filter((v) => v.productSlug === p.slug)
      }))
    );
    setTemplateKey(categoryConfig.recommendedTemplate || "minimal");
  }, [seed, activeCategoryKey, categoryConfig.recommendedTemplate]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");
  const [priceFilter, setPriceFilter] = useState<"all" | "under-35" | "35-80" | "over-80">("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [modalImageAngle, setModalImageAngle] = useState<"primary" | "secondary">("primary");

  // Newsletter Email
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  // Checkout modal state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "stripe" | "manual">("cod");
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);

  const cartSummary = calculateCartTotals(cartItems, 50);
  const shippingFee = cartSummary.isFreeShippingEligible || cartItems.length === 0 ? 0 : 5.0;
  const finalTotal = cartSummary.subtotal + shippingFee;

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          if (!p.title.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) return false;
        }
        if (priceFilter === "under-35" && p.price >= 35) return false;
        if (priceFilter === "35-80" && (p.price < 35 || p.price > 80)) return false;
        if (priceFilter === "over-80" && p.price <= 80) return false;
        if (inStockOnly && p.variants.every((v) => v.inventoryQuantity <= 0)) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return 0;
      });
  }, [products, searchQuery, sortBy, priceFilter, inStockOnly]);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      if (!exists) success("Saved to Wishlist", "Item added to your personal collection.");
      return next;
    });
  };

  const handleOpenProduct = (prod: typeof products[0]) => {
    setSelectedProduct(prod);
    setSelectedVariant(prod.variants[0] || null);
    setModalImageAngle("primary");
  };

  const handleAddToCart = (prod: any, variant: any) => {
    const itemKey = variant ? `${prod.id}-${variant.title}` : prod.id;
    const existing = cartItems.find((c) => c.id === itemKey);
    if (existing) {
      setCartItems(cartItems.map((c) => c.id === itemKey ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCartItems([...cartItems, {
        id: itemKey,
        title: variant ? `${prod.title} (${variant.title})` : prod.title,
        price: variant ? parseFloat(variant.price) : prod.price,
        quantity: 1,
        variantId: variant?.sku || "std"
      }]);
    }
    trackEvent("add_to_cart", { productTitle: prod.title, price: prod.price, variant: variant?.title });
    success("Added to Bag", `${prod.title}${variant ? ` (${variant.title})` : ""} added to your bag.`);
  };

  const handleAddUpsell = (title: string, price: number) => {
    const id = `upsell-${title.toLowerCase().replace(/\s+/g, "-")}`;
    setCartItems((prev) => [...prev, { id, title, price, quantity: 1 }]);
    success("Added Add-on", `${title} added to your bag.`);
  };

  const handleQuantityChange = (id: string, delta: number) => {
    setCartItems(
      cartItems
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubmitted(true);
    success("Welcome to the Club", "10% coupon code ATELIER10 sent to your email.");
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !shippingAddress) {
      toastError("Missing Fields", "Please fill in name, phone, and delivery address.");
      return;
    }
    setIsSubmittingOrder(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeSlug: tenantSlug,
          customerName, customerPhone, customerEmail,
          shippingAddress: { address: shippingAddress, notes: deliveryNotes },
          items: cartItems.map((it) => ({ variantId: it.variantId || "mock-var-1", title: it.title, price: it.price, quantity: it.quantity })),
          paymentMethod,
          shippingFee: cartSummary.isFreeShippingEligible ? 0 : shippingFee
        })
      });
      const data = await res.json();
      if (!res.ok) { toastError("Order Issue", data.error || "Failed to process order."); setIsSubmittingOrder(false); return; }
      setOrderSuccess({ orderNumber: data.orderNumber || `SS-${Date.now().toString(36).toUpperCase()}`, total: data.totalAmount || finalTotal.toFixed(2), paymentMethod });
      setCartItems([]);
      setIsSubmittingOrder(false);
      success("Order Confirmed!", `Order #${data.orderNumber} placed.`);
    } catch {
      setOrderSuccess({ orderNumber: `SS-${Date.now().toString(36).toUpperCase()}`, total: finalTotal.toFixed(2), paymentMethod });
      setCartItems([]);
      setIsSubmittingOrder(false);
      success("Order Placed", "Your order has been recorded.");
    }
  };

  const storeDisplayName = tenantSlug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  const layoutType = template.getHeroLayoutType();
  const psych = template.getCategoryPsychology();
  const philosophy = template.getDesignPhilosophy();
  const collections = CATEGORY_COLLECTIONS[activeCategoryKey] || CATEGORY_COLLECTIONS.fashion;
  const isFashionVertical = activeCategoryKey === "fashion" || templateKey === "minimal";
  const isBeautyVertical = activeCategoryKey === "beauty_cosmetics" || templateKey === "glow";
  const isFootwearVertical = activeCategoryKey === "shoes" || templateKey === "artisan";
  const isTechVertical = activeCategoryKey === "electronics" || templateKey === "bold";
  const isJewelryVertical = activeCategoryKey === "jewelry" || templateKey === "maison";
  const isPantryVertical = activeCategoryKey === "grocery_food" || templateKey === "pantry";

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-500 ${template.classes.pageBg}`}>
      {/* ─── Top Demo Store Preview Bar ──────────────────────────────────── */}
      <DemoStoreBar
        currentSlug={tenantSlug}
        storeDisplayName={storeDisplayName}
        categoryName={categoryConfig.name}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
        onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
      />

      {isFashionVertical ? (
        <FashionStorefront
          storeDisplayName={storeDisplayName}
          tenantSlug={tenantSlug}
          onOpenCheckout={() => setIsCheckoutOpen(true)}
          onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
          products={products}
          cartItems={cartItems}
          wishlist={wishlist}
          finalTotal={finalTotal}
          template={template}
          onAddToCart={handleAddToCart}
          onToggleWishlist={toggleWishlist}
          onOpenProduct={handleOpenProduct}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          allCategories={ALL_CATEGORIES}
          activeCategoryKey={activeCategoryKey}
          onSelectCategory={(cat) => {
            setActiveCategoryKey(cat);
            const rec = getCategoryConfig(cat).recommendedTemplate;
            if (rec) setTemplateKey(rec);
          }}
          allTemplates={ALL_TEMPLATES}
          templateKey={templateKey}
          onSelectTemplate={setTemplateKey}
          categoriesMap={CATEGORIES_MAP}
          storeTemplatesMap={STORE_TEMPLATES}
        />
      ) : isBeautyVertical ? (
        <BeautyStorefront
          storeDisplayName={storeDisplayName}
          tenantSlug={tenantSlug}
          onOpenCheckout={() => setIsCheckoutOpen(true)}
          onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
          products={products}
          cartItems={cartItems}
          wishlist={wishlist}
          finalTotal={finalTotal}
          template={template}
          onAddToCart={handleAddToCart}
          onToggleWishlist={toggleWishlist}
          onOpenProduct={handleOpenProduct}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          allCategories={ALL_CATEGORIES}
          activeCategoryKey={activeCategoryKey}
          onSelectCategory={(cat) => {
            setActiveCategoryKey(cat);
            const rec = getCategoryConfig(cat).recommendedTemplate;
            if (rec) setTemplateKey(rec);
          }}
          allTemplates={ALL_TEMPLATES}
          templateKey={templateKey}
          onSelectTemplate={setTemplateKey}
          categoriesMap={CATEGORIES_MAP}
          storeTemplatesMap={STORE_TEMPLATES}
        />
      ) : isFootwearVertical ? (
        <FootwearStorefront
          storeDisplayName={storeDisplayName}
          tenantSlug={tenantSlug}
          onOpenCheckout={() => setIsCheckoutOpen(true)}
          onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
          products={products}
          cartItems={cartItems}
          wishlist={wishlist}
          finalTotal={finalTotal}
          template={template}
          onAddToCart={handleAddToCart}
          onToggleWishlist={toggleWishlist}
          onOpenProduct={handleOpenProduct}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          allCategories={ALL_CATEGORIES}
          activeCategoryKey={activeCategoryKey}
          onSelectCategory={(cat) => {
            setActiveCategoryKey(cat);
            const rec = getCategoryConfig(cat).recommendedTemplate;
            if (rec) setTemplateKey(rec);
          }}
          allTemplates={ALL_TEMPLATES}
          templateKey={templateKey}
          onSelectTemplate={setTemplateKey}
          categoriesMap={CATEGORIES_MAP}
          storeTemplatesMap={STORE_TEMPLATES}
        />
      ) : isTechVertical ? (
        <TechStorefront
          storeDisplayName={storeDisplayName}
          tenantSlug={tenantSlug}
          onOpenCheckout={() => setIsCheckoutOpen(true)}
          onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
          products={products}
          cartItems={cartItems}
          wishlist={wishlist}
          finalTotal={finalTotal}
          template={template}
          onAddToCart={handleAddToCart}
          onToggleWishlist={toggleWishlist}
          onOpenProduct={handleOpenProduct}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          allCategories={ALL_CATEGORIES}
          activeCategoryKey={activeCategoryKey}
          onSelectCategory={(cat) => {
            setActiveCategoryKey(cat);
            const rec = getCategoryConfig(cat).recommendedTemplate;
            if (rec) setTemplateKey(rec);
          }}
          allTemplates={ALL_TEMPLATES}
          templateKey={templateKey}
          onSelectTemplate={setTemplateKey}
          categoriesMap={CATEGORIES_MAP}
          storeTemplatesMap={STORE_TEMPLATES}
        />
      ) : isJewelryVertical ? (
        <JewelryStorefront
          storeDisplayName={storeDisplayName}
          tenantSlug={tenantSlug}
          onOpenCheckout={() => setIsCheckoutOpen(true)}
          onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
          products={products}
          cartItems={cartItems}
          wishlist={wishlist}
          finalTotal={finalTotal}
          template={template}
          onAddToCart={handleAddToCart}
          onToggleWishlist={toggleWishlist}
          onOpenProduct={handleOpenProduct}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          allCategories={ALL_CATEGORIES}
          activeCategoryKey={activeCategoryKey}
          onSelectCategory={(cat) => {
            setActiveCategoryKey(cat);
            const rec = getCategoryConfig(cat).recommendedTemplate;
            if (rec) setTemplateKey(rec);
          }}
          allTemplates={ALL_TEMPLATES}
          templateKey={templateKey}
          onSelectTemplate={setTemplateKey}
          categoriesMap={CATEGORIES_MAP}
          storeTemplatesMap={STORE_TEMPLATES}
        />
      ) : isPantryVertical ? (
        <PantryStorefront
          storeDisplayName={storeDisplayName}
          tenantSlug={tenantSlug}
          onOpenCheckout={() => setIsCheckoutOpen(true)}
          onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
          products={products}
          cartItems={cartItems}
          wishlist={wishlist}
          finalTotal={finalTotal}
          template={template}
          onAddToCart={handleAddToCart}
          onToggleWishlist={toggleWishlist}
          onOpenProduct={handleOpenProduct}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          allCategories={ALL_CATEGORIES}
          activeCategoryKey={activeCategoryKey}
          onSelectCategory={(cat) => {
            setActiveCategoryKey(cat);
            const rec = getCategoryConfig(cat).recommendedTemplate;
            if (rec) setTemplateKey(rec);
          }}
          allTemplates={ALL_TEMPLATES}
          templateKey={templateKey}
          onSelectTemplate={setTemplateKey}
          categoriesMap={CATEGORIES_MAP}
          storeTemplatesMap={STORE_TEMPLATES}
        />
      ) : (
        <FashionStorefront
          storeDisplayName={storeDisplayName}
          tenantSlug={tenantSlug}
          onOpenCheckout={() => setIsCheckoutOpen(true)}
          onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
          products={products}
          cartItems={cartItems}
          wishlist={wishlist}
          finalTotal={finalTotal}
          template={template}
          onAddToCart={handleAddToCart}
          onToggleWishlist={toggleWishlist}
          onOpenProduct={handleOpenProduct}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          allCategories={ALL_CATEGORIES}
          activeCategoryKey={activeCategoryKey}
          onSelectCategory={(cat) => {
            setActiveCategoryKey(cat);
            const rec = getCategoryConfig(cat).recommendedTemplate;
            if (rec) setTemplateKey(rec);
          }}
          allTemplates={ALL_TEMPLATES}
          templateKey={templateKey}
          onSelectTemplate={setTemplateKey}
          categoriesMap={CATEGORIES_MAP}
          storeTemplatesMap={STORE_TEMPLATES}
        />
      )}

      {/* ─── Search Modal      {/* ─── Search Modal ─────────────────────────────────────────────────── */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        products={products.map((p) => ({ id: p.id, title: p.title, slug: p.slug, price: p.price, comparePrice: p.comparePrice, imageUrl: p.imageUrl, badge: p.badge, category: categoryConfig.name }))}
        onSelectProduct={(p) => { const match = products.find((pr) => pr.id === p.id); if (match) handleOpenProduct(match); }}
        onAddToCart={(p) => { const match = products.find((pr) => pr.id === p.id); if (match) handleAddToCart(match, match.variants[0]); }}
      />

      {/* ─── Cart Drawer ──────────────────────────────────────────────────── */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col text-zinc-900">
              <div className="p-5 border-b border-zinc-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-4 h-4 text-zinc-900" />
                  <span className="font-bold text-zinc-900 text-sm">Shopping Bag</span>
                  <span className="text-xs text-zinc-400">({cartItems.length} items)</span>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="text-zinc-400 hover:text-zinc-600 p-1.5 rounded-lg hover:bg-zinc-100"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-4 bg-zinc-50 border-b border-zinc-200 text-xs">
                {cartSummary.isFreeShippingEligible ? (
                  <div className="flex items-center space-x-2 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Free Express Delivery applied.</span>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-zinc-700 mb-1.5">
                      <span>Add ${(50 - cartSummary.subtotal).toFixed(2)} more for FREE Delivery</span>
                      <span>{Math.round((cartSummary.subtotal / 50) * 100)}%</span>
                    </div>
                    <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-zinc-900 h-full transition-all duration-300 rounded-full" style={{ width: `${Math.min(100, (cartSummary.subtotal / 50) * 100)}%` }} />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400"><ShoppingBag className="w-6 h-6" /></div>
                    <p className="text-xs font-bold text-zinc-800">Your bag is empty</p>
                    <p className="text-[11px] text-zinc-400 max-w-xs mx-auto">Explore our {categoryConfig.name.toLowerCase()} catalog and pick your favorites.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border border-zinc-200/70">
                        <div className="flex-1 pr-3">
                          <p className="text-xs font-bold text-zinc-900 leading-tight">{item.title}</p>
                          <p className="text-[11px] text-zinc-500 font-mono mt-0.5">${item.price.toFixed(2)} each</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center bg-white border border-zinc-200 rounded-lg p-0.5">
                            <button onClick={() => handleQuantityChange(item.id, -1)} className="w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-zinc-100 rounded text-zinc-600">-</button>
                            <span className="w-6 text-center text-xs font-bold text-zinc-900">{item.quantity}</span>
                            <button onClick={() => handleQuantityChange(item.id, 1)} className="w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-zinc-100 rounded text-zinc-600">+</button>
                          </div>
                          <button onClick={() => handleQuantityChange(item.id, -item.quantity)} className="text-zinc-400 hover:text-rose-600 p-1 transition"><X className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    ))}
                    <div className="pt-3 border-t border-zinc-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">Frequently Added Add-ons:</span>
                      <div className="space-y-2">
                        {[
                          { title: "Eco Protective Cotton Pouch", price: 6.0, desc: "+$6.00 • Zero plastic dust bag" },
                          { title: "Express Priority Packing", price: 3.5, desc: "+$3.50 • Front-of-line dispatch" }
                        ].map((addon) => (
                          <div key={addon.title} className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-zinc-200 text-xs">
                            <div>
                              <span className="font-bold text-zinc-900 block">{addon.title}</span>
                              <span className="text-[10px] text-zinc-400">{addon.desc}</span>
                            </div>
                            <button onClick={() => handleAddUpsell(addon.title, addon.price)} className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg transition"><Plus className="w-3.5 h-3.5" /></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {cartItems.length > 0 && (
                <div className="p-5 border-t border-zinc-200 space-y-3 bg-zinc-50">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-zinc-500"><span>Subtotal</span><span className="font-semibold text-zinc-900">${cartSummary.subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between text-zinc-500"><span>Shipping</span><span>{cartSummary.isFreeShippingEligible ? "FREE" : `$${shippingFee.toFixed(2)}`}</span></div>
                    <div className="flex justify-between text-sm font-black text-zinc-900 pt-2 border-t border-zinc-200"><span>Total</span><span>${finalTotal.toFixed(2)}</span></div>
                  </div>
                  <button
                    onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
                    className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center space-x-2 btn-press"
                  >
                    <span>Proceed to Cash on Delivery</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── Product Quick-View Modal ─────────────────────────────────────── */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white text-zinc-900 rounded-2xl max-w-lg w-full p-6 border border-zinc-200 shadow-2xl relative">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 p-1.5 rounded-lg hover:bg-zinc-100"><X className="w-4 h-4" /></button>
            <div className="flex space-x-4 items-start">
              <div className="space-y-1.5 flex-shrink-0">
                <div className="w-28 h-28 rounded-xl overflow-hidden border border-zinc-200 bg-zinc-50 shadow-inner">
                  <img src={modalImageAngle === "primary" ? selectedProduct.imageUrl : (selectedProduct.secondaryImage || selectedProduct.imageUrl)} alt={selectedProduct.title} className="w-full h-full object-cover" />
                </div>
                {selectedProduct.secondaryImage && (
                  <div className="flex gap-1 justify-center">
                    {(["primary", "secondary"] as const).map((angle) => (
                      <button key={angle} type="button" onClick={() => setModalImageAngle(angle)}
                        className={`text-[9px] font-mono px-2 py-0.5 rounded border transition ${modalImageAngle === angle ? "bg-zinc-900 text-white border-zinc-900" : "bg-zinc-100 text-zinc-600 border-zinc-200"}`}>
                        {angle === "primary" ? "Studio" : "Alt View"}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{categoryConfig.name}</span>
                <h3 className="text-base font-bold text-zinc-900 tracking-tight">{selectedProduct.title}</h3>
                <div className="text-lg font-black text-zinc-900 mt-1">${selectedProduct.price.toFixed(2)}</div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-1">Available for Cash on Delivery</div>
              </div>
            </div>
            <p className="text-xs text-zinc-600 mt-4 leading-relaxed">{selectedProduct.description}</p>
            {selectedProduct.variants.length > 0 && (
              <div className="mt-4 space-y-2">
                <span className="text-[11px] font-semibold text-zinc-700 uppercase">Select Variant:</span>
                <div className="grid grid-cols-2 gap-2">
                  {selectedProduct.variants.map((v, i) => {
                    const isSel = selectedVariant?.sku === v.sku;
                    return (
                      <button key={i} type="button" onClick={() => setSelectedVariant(v)}
                        className={`p-2 rounded-xl border text-xs font-semibold text-left transition ${isSel ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 hover:border-zinc-300 text-zinc-800"}`}>
                        <div>{v.title}</div>
                        <div className={`text-[10px] ${isSel ? "text-zinc-300" : "text-zinc-400"}`}>${v.price}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="mt-6 pt-4 border-t border-zinc-100 flex gap-2">
              <button onClick={() => { handleAddToCart(selectedProduct, selectedVariant); setSelectedProduct(null); }}
                className="flex-1 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs rounded-xl transition flex items-center justify-center space-x-1.5 btn-press">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Bag</span>
              </button>
              <button onClick={() => { handleAddToCart(selectedProduct, selectedVariant); setSelectedProduct(null); setIsCheckoutOpen(true); }}
                className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center space-x-1.5 btn-press">
                <span>⚡ Buy Now</span>
              </button>
              <Link href={`/store/${tenantSlug}/products/${selectedProduct.slug}`} className="py-2.5 px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold text-xs rounded-xl transition">
                Details
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ─── 1-Page Express Checkout Modal (Beats Zatiq) ─────────────── */}
      <ExpressCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={
          cartItems.length > 0
            ? cartItems.map((it) => ({
                id: it.id,
                variantId: it.variantId,
                title: it.title,
                variantTitle: it.variantTitle,
                price: it.price,
                quantity: it.quantity,
                imageUrl: it.imageUrl
              }))
            : selectedProduct
            ? [
                {
                  id: selectedProduct.id,
                  variantId: selectedVariant?.sku || "default-var",
                  title: selectedProduct.title,
                  variantTitle: selectedVariant?.title,
                  price: selectedProduct.price,
                  quantity: 1,
                  imageUrl: selectedProduct.imageUrl
                }
              ]
            : []
        }
        storeDisplayName={storeDisplayName}
        tenantSlug={tenantSlug}
        currency="$"
        onClearCart={() => setCartItems([])}
      />

      {/* ─── Live Track Order Modal (Steadfast & Pathao) ─────────────── */}
      <TrackOrderModal
        isOpen={isTrackOrderOpen}
        onClose={() => setIsTrackOrderOpen(false)}
        storeDisplayName={storeDisplayName}
        tenantSlug={tenantSlug}
      />

    </div>
  );
}
