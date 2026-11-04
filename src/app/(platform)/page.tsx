"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  ExternalLink,
  Layers,
  Menu,
  ShieldCheck,
  Store,
  Truck,
  X,
  Zap,
  Lock,
  CheckCircle2,
  Sparkles,
  CreditCard,
  Package,
  Globe,
  TrendingUp,
  Rocket,
  Users,
  MessageSquare,
  FileSpreadsheet,
  Printer,
  ShoppingBag,
  Monitor,
  Smartphone,
  Tablet,
  Copy,
  CheckCheck,
  RotateCcw,
  Eye
} from "lucide-react";
import { PlatformFooter, DEMO_STORES_LIST } from "@/components/platform-footer";
import { ThemeToggle } from "@/components/theme-toggle";
import { SpotlightCard } from "@/components/ui/spotlight-card";

interface TemplateDetail {
  id: string;
  name: string;
  tag: string;
  badge: string;
  headline: string;
  description: string;
  image: string;
  highlights: string[];
}

interface IndustryStorefront {
  slug: string;
  name: string;
  category: string;
  categoryParam: string;
  templatesCount: number;
  templates: TemplateDetail[];
}

const INDUSTRY_STOREFRONTS: IndustryStorefront[] = [
  {
    slug: "apex-fashion",
    name: "Apex Fashion Hub",
    category: "Fashion & Apparel",
    categoryParam: "fashion",
    templatesCount: 5,
    templates: [
      {
        id: "minimal",
        name: "Minimal Atelier",
        tag: "High Fashion",
        badge: "🤍 Atelier",
        headline: "Textile GSM badges, editorial lookbooks, and high-fashion aesthetics",
        description: "Clean editorial architecture built for luxury apparel labels with fabric weight metrics (GSM), studio angle switchers, and lookbook ensemble bundles.",
        image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=85",
        highlights: ["Fabric GSM weight badges", "Studio angle switcher", "Curated lookbook bundles", "Doorstep fit inspection guarantee"]
      },
      {
        id: "clothing",
        name: "Clothing.co Boutique",
        tag: "Warm Boutique",
        badge: "🟤 Boutique",
        headline: "Warm earth tones, curated rack collections, and artisanal lifestyle",
        description: "Designed for contemporary boutique retailers featuring warm tactile neutrals, seasonal capsule collections, and automated size fit recommendation engine.",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=85",
        highlights: ["Warm earth-tone aesthetic", "Seasonal capsule grids", "Interactive size fit assistant", "Doorstep courier returns"]
      },
      {
        id: "milano",
        name: "Milano Streetwear",
        tag: "Dark Editorial",
        badge: "⚫ Milano",
        headline: "Full-bleed dark editorial, limited drop timers, and oversized cuts",
        description: "High-impact dark luxury aesthetic engineered for hype streetwear brands with limited drop countdowns, oversized silhouette guides, and anti-counterfeit tags.",
        image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&auto=format&fit=crop&q=85",
        highlights: ["Full-bleed dark editorial mode", "Limited drop countdown timer", "Oversized silhouette cutaway", "NFC authenticity certificate"]
      },
      {
        id: "nickelfox",
        name: "NickelFox Bold",
        tag: "Avant-Garde Street",
        badge: "🟡 NickelFox",
        headline: "High-energy acid yellow & black catalog with bold pill navigation",
        description: "Vibrant, high-contrast retail template designed for youth streetwear and athletic apparel with urgent stock indicators and rapid 1-click cart addition.",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&auto=format&fit=crop&q=85",
        highlights: ["High-energy yellow/black style", "Dynamic pill navigation tabs", "Live inventory urgency indicators", "Sub-second 1-click checkout"]
      },
      {
        id: "athleisure",
        name: "Aero Athleisure Pro",
        tag: "Sport & Performance",
        badge: "🏃 Athleisure",
        headline: "Moisture-wicking telemetry, 4-way active stretch & gym performance",
        description: "Engineered for activewear and performance labels with fabric breathability gauges, athlete sizing benchmarks, and compression gradient specs.",
        image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&auto=format&fit=crop&q=85",
        highlights: ["Moisture-wicking GSM index", "4-way active stretch metrics", "Sweatproof breathability ratings", "Athlete sizing benchmarks"]
      }
    ]
  },
  {
    slug: "luxe-glow-beauty",
    name: "Luxe Glow Beauty",
    category: "Beauty & Skincare",
    categoryParam: "beauty_cosmetics",
    templatesCount: 5,
    templates: [
      {
        id: "glow",
        name: "Clinical Botanical",
        tag: "Glass Skin Ritual",
        badge: "🌸 Botanical",
        headline: "Clinical botanical formulations with bio-active ingredient percentages",
        description: "Purpose-built for clean beauty and derma skincare brands with a step-by-step glass skin routine builder, skin-type concern filters, and tamper seal guarantees.",
        image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&auto=format&fit=crop&q=85",
        highlights: ["Active ingredient % badges", "3-Step glass skin ritual builder", "Tamper seal inspection protocol", "Skin concern diagnostic filter"]
      },
      {
        id: "luxe-glam",
        name: "Velvet Glam Parfumerie",
        tag: "Haute Parfumerie",
        badge: "💄 Velvet Glam",
        headline: "Midnight plum, golden olfactory pyramids & rich velvet pigments",
        description: "Opulent luxury cosmetics and haute fragrance layout featuring interactive scent notes (top/heart/base), velvet pigment swatches, and luxury travel add-on sets.",
        image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1200&auto=format&fit=crop&q=85",
        highlights: ["Olfactory top/heart/base pyramid", "Midnight velvet aesthetic", "Travel atomizer add-on bundle", "Certified fragrance concentration"]
      },
      {
        id: "k-beauty",
        name: "Seoul Dew K-Beauty",
        tag: "Glass Skin Dew",
        badge: "✨ Seoul Dew",
        headline: "Centella & fermented rice % badges with 10-step hydration routine guide",
        description: "Pastel, hyper-clean aesthetic inspired by Seoul skincare pioneers, with ingredient concentration disclosures, barrier repair badges, and patch-test proofs.",
        image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=1200&auto=format&fit=crop&q=85",
        highlights: ["Centella & fermented rice % badges", "10-Step Korean skincare guide", "Dewy skin hydration index", "Hypoallergenic patch-test verified"]
      },
      {
        id: "derma-rx",
        name: "Dermacure Lab Rx",
        tag: "Clinical Dermatology",
        badge: "🔬 Derma Rx",
        headline: "Prescription sterile layout, ceramide NP matrix & clinical pH indicator",
        description: "Medical-grade skincare storefront with clinical trial results, active acid percentages (AHA/BHA/Retinol), and dermatologist verification badges.",
        image: "https://images.unsplash.com/photo-1608248597359-455b5502a5c4?w=1200&auto=format&fit=crop&q=85",
        highlights: ["Prescription sterile layout", "Ceramide NP lipid matrix", "Clinical pH balance indicator", "Dermatologist approval seal"]
      },
      {
        id: "apothecary",
        name: "Herbal Apothecary",
        tag: "Organic Herbalism",
        badge: "🌿 Apothecary",
        headline: "Amber glass apothecary, wildcrafted extraction notes & cold-pressed oils",
        description: "Warm vintage apothecary storefront showcasing botanical tinctures, cold-pressed seed oils, UV-protective glass packaging, and batch harvest stamps.",
        image: "https://images.unsplash.com/photo-1617897903246-719242758050?w=1200&auto=format&fit=crop&q=85",
        highlights: ["Wildcrafted extraction notes", "Cold-pressed unrefined oils", "Amber glass UV protection", "100% compostable packaging"]
      }
    ]
  },
  {
    slug: "craft-shoes",
    name: "Craft Bench Shoes",
    category: "Footwear & Leather",
    categoryParam: "shoes",
    templatesCount: 5,
    templates: [
      {
        id: "artisan",
        name: "Warm Heritage Guild",
        tag: "Welted Craft",
        badge: "👞 Heritage",
        headline: "Heritage leathercraft, Goodyear welted construction, and Vibram lug depth",
        description: "Crafted for footwear and leather goods makers with anatomical cutaway visuals, tannery provenance, and Vibram lug depth specifications.",
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&auto=format&fit=crop&q=85",
        highlights: ["Anatomical sole cutaway visuals", "Horween tannery provenance", "Vibram lug depth specifications", "Doorstep fitting check guarantee"]
      },
      {
        id: "velocity",
        name: "Velocity Sneaker Vault",
        tag: "Kinetic Runners",
        badge: "⚡ Velocity Kicks",
        headline: "Carbon torsion plates, drop countdowns & dynamic live size runs",
        description: "High-octane sneaker performance storefront featuring real-time size inventory runs, energy return data, and nitrogen foam cushioning breakdown.",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&auto=format&fit=crop&q=80",
        highlights: ["Carbon fiber torsion plate telemetry", "Drop launch countdown timer", "Dynamic real-time size run", "Nitrogen-infused foam cushioning"]
      },
      {
        id: "street-hype",
        name: "SoleStreet Hype",
        tag: "Urban Sneaker",
        badge: "👟 Street Hype",
        headline: "Verified deadstock authentication, raffle alerts & secondary price index",
        description: "Sneakerhead marketplace layout with NFC chip verification badges, instant lottery raffle entries, and verified market price fluctuations.",
        image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1200&auto=format&fit=crop&q=85",
        highlights: ["Deadstock authentication NFC badge", "Limited raffle reservation alerts", "Secondary market price index", "Tamper-evident holographic tags"]
      },
      {
        id: "bespoke",
        name: "Milano Bespoke Oxford",
        tag: "Handmade Goodyear",
        badge: "👞 Bespoke",
        headline: "Hand-patina calfskin finish guide & Goodyear chisel-toe specifications",
        description: "Sartorial elegance for custom dress shoes, featuring French calfskin leather swatches, wooden last cutaway diagrams, and monogram engraving.",
        image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=1200&auto=format&fit=crop&q=85",
        highlights: ["Hand-patina calfskin finish guide", "Goodyear chisel-toe welt specs", "Custom monogramming preview", "Cedar shoe tree inclusion"]
      },
      {
        id: "alpine-trek",
        name: "Summit Alpine Trail",
        tag: "Outdoor & Trail",
        badge: "🏔️ Alpine Trek",
        headline: "GORE-TEX waterproof ratings, terrain grip meter & Cordura upper",
        description: "Technical outdoor boot showcase with 28,000mm hydrostatic head waterproof meters, sub-zero insulation ratings, and Vibram Megagrip traction charts.",
        image: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=1200&auto=format&fit=crop&q=80",
        highlights: ["GORE-TEX waterproof rating (28k)", "Terrain grip traction meter", "Abrasion-resistant Cordura upper", "Sub-zero thermal insulation rating"]
      }
    ]
  },
  {
    slug: "cyber-tech",
    name: "CyberTech Audio",
    category: "Consumer Tech & Audio",
    categoryParam: "electronics",
    templatesCount: 5,
    templates: [
      {
        id: "bold",
        name: "Acoustic Cyber",
        tag: "Frequency Curves",
        badge: "🎧 Cyber Tech",
        headline: "Frequency curves, titanium driver specs, and CNC hardware telemetry",
        description: "Optimized for audiophiles and premium hardware with acoustic frequency visualizers, IPX7 waterproof ratings, and low-latency gaming mode.",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=85",
        highlights: ["Frequency curve visualizer", "Low-latency gaming mode", "IPX7 waterproof ratings", "Anti-tamper seal protocol"]
      },
      {
        id: "lumina",
        name: "Lumina Zen Silicon",
        tag: "Studio Monitors",
        badge: "💻 Zen Silicon",
        headline: "Pristine anodized aluminum, battery benchmarks & magnetic snap specs",
        description: "Monolithic minimalist hardware layout featuring CNC anodized chassis cutaways, battery life benchmarks, and silent magnetic connection details.",
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1200&auto=format&fit=crop&q=85",
        highlights: ["CNC 6063 anodized aluminum", "Battery benchmark telemetry", "Magnetic snap quick disconnect", "Pristine minimalist layout"]
      },
      {
        id: "cyber-rgb",
        name: "Cyber Neon RGB",
        tag: "Gaming Hardware",
        badge: "🎮 Cyber RGB",
        headline: "240Hz latency telemetry, hot-swap actuation curves & RGB preview",
        description: "Esports battlestation storefront with mechanical switch actuation force curves, polling rate telemetry, and dynamic RGB lighting zone configurator.",
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=85",
        highlights: ["240Hz latency telemetry HUD", "Hot-swap actuation force curves", "Chroma RGB sync presets", "Tournament-grade zero debounce"]
      },
      {
        id: "smart-home",
        name: "Smart Home IoT",
        tag: "Home Automation",
        badge: "🏠 Smart Home",
        headline: "Matter & Zigbee compatibility matrix with low-power wattage stats",
        description: "Clean IoT connected-home storefront displaying wireless protocol matrices (Matter/Thread/Zigbee), standby power stats, and ecosystem badges.",
        image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=1200&auto=format&fit=crop&q=85",
        highlights: ["Matter & Zigbee 3.0 matrix", "Ultra low-power standby stats", "End-to-end local encryption", "Voice assistant compatibility"]
      },
      {
        id: "studio-rig",
        name: "Studio Rig Audio",
        tag: "Audiophile Ref",
        badge: "🎥 Studio Rig",
        headline: "4K/60fps bitrate specs, thermal cooling metrics & modular rigging",
        description: "Professional creator equipment catalog showing cold-shoe and NATO rail modular rigging, active thermal fan dissipation, and broadcast XLR audio specs.",
        image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&auto=format&fit=crop&q=85",
        highlights: ["4K/60fps ProRes bitrate specs", "Thermal dissipation cooling data", "Modular NATO rail mounting", "Phantom power XLR audio preamps"]
      }
    ]
  },
  {
    slug: "maison-jewelry",
    name: "Maison Opulente",
    category: "Fine Jewelry & Watches",
    categoryParam: "jewelry",
    templatesCount: 5,
    templates: [
      {
        id: "maison",
        name: "Opulent Maison",
        tag: "18K/24K Gold",
        badge: "💎 Royal Maison",
        headline: "Hallmarked 18K/24K gold, certified diamonds and unboxing seals",
        description: "Designed for fine jewelry and luxury horology with 40x loupe inspection guarantee, GIA clarity certifications, and velvet unboxing presentation.",
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200&auto=format&fit=crop&q=85",
        highlights: ["Gold purity hallmarks (750)", "GIA clarity certifications", "Velvet unboxing guarantee", "Insured doorstep handover"]
      },
      {
        id: "aurora",
        name: "Aurora Gemstones",
        tag: "Sapphire & Emerald",
        badge: "✨ Aurora Atelier",
        headline: "Champagne pearl, stackable ring layering studio & bridal provenance",
        description: "Modern fine jewelry aesthetic featuring interactive pearl luster grades, bridal diamond provenance, and an interactive ring stack customizer.",
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&auto=format&fit=crop&q=85",
        highlights: ["Champagne Akoya pearl grading", "Stackable ring layering studio", "Conflict-free Kimberly process", "Bespoke bridal ring customizer"]
      },
      {
        id: "solitaire",
        name: "Solitaire Bridal",
        tag: "Engagement Rings",
        badge: "💍 Solitaire",
        headline: "Interactive 4Cs diamond loupe (Cut, Color, Clarity, Carat) & GIA certs",
        description: "High-precision bridal salon featuring an interactive 4Cs diamond comparison loupe, platinum 950 prong specs, and laser-inscribed cert match.",
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200&auto=format&fit=crop&q=85",
        highlights: ["Interactive 4Cs loupe (Cut/Color)", "Laser inscribed GIA serial match", "Platinum 950 prong settings", "Lifetime ultrasonic cleaning"]
      },
      {
        id: "raw-silver",
        name: "Raw Artisan Silver",
        tag: "Statement Silver",
        badge: "⚒️ Nordic Silver",
        headline: "Oxidized 925 raw sterling silver, hand-hammered textures & Nordic runes",
        description: "Bold artisanal metalcraft showcase featuring hand-forged 925 silver cuffs, antique black patinas, and heavy gauge solid silver weight metrics.",
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200&auto=format&fit=crop&q=85",
        highlights: ["925 oxidised raw sterling silver", "Hand-hammered anvil textures", "Nordic rune engraving preview", "Non-reactive hypoallergenic finish"]
      },
      {
        id: "chronos",
        name: "Chronos Horology",
        tag: "Swiss Luxury",
        badge: "⏱️ Chronos",
        headline: "Skeleton movement tourbillon exhibition display & 28,800 vph caliber",
        description: "Grand horlogerie watch boutique showcasing open-heart mechanical calibers, sapphire casebacks, power reserve meters, and COSC chronometer certs.",
        image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&auto=format&fit=crop&q=85",
        highlights: ["Skeleton tourbillon exhibition back", "28,800 vph Swiss mechanical caliber", "Anti-reflective sapphire crystal", "5-Year chronometer warranty"]
      }
    ]
  },
  {
    slug: "artisan-food",
    name: "Artisan Pantry",
    category: "Gourmet Food & Coffee",
    categoryParam: "grocery_food",
    templatesCount: 5,
    templates: [
      {
        id: "pantry",
        name: "Organic Farmstead",
        tag: "Fresh Farmstead",
        badge: "☕ Artisan Pantry",
        headline: "Farmstead provisions, raw alpine honey, and small-batch micro-lots",
        description: "Specialty coffee, raw honey, and gourmet provisions with harvest altitude metrics, roast freshness tracking (within 48 hours), and airtight seal protocol.",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&auto=format&fit=crop&q=85",
        highlights: ["48h harvest & roast freshness", "100% raw unheated alpine honey", "Cold-pressed extra virgin olive oil", "Tamper-evident airtight seal protocol"]
      },
      {
        id: "bazaar",
        name: "Spice Bazaar",
        tag: "Direct-Trade Spices",
        badge: "🥬 Fresh Bazaar",
        headline: "Same-day refrigerated cold-chain farm delivery, harvest bundles & pesticide-free",
        description: "Farm-to-table organic produce and heirloom spices featuring harvest date freshness badges, laboratory pesticide-free seals, and recyclable crates.",
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop&q=85",
        highlights: ["Same-day refrigerated cold-chain", "Pesticide-free laboratory tested", "Zero-waste compostable crates", "Morning harvest delivery route"]
      },
      {
        id: "patisserie",
        name: "Artisan Patisserie",
        tag: "French Delicacies",
        badge: "🥐 Pâtisserie",
        headline: "Single-origin cacao %, multi-layer ganache schematics & fresh macaron boxes",
        description: "Fine French pastry and bean-to-bar chocolatier storefront with cacao origin terroir charts, butter lamination layers, and same-morning baking guarantees.",
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&auto=format&fit=crop&q=85",
        highlights: ["AOP Charentes-Poitou butter", "Single-origin 72% Valrhona cacao", "Multi-layer laminated crumb gauge", "Same-morning baking guarantee"]
      },
      {
        id: "matcha-zen",
        name: "Matcha Zen",
        tag: "Ceremonial Matcha",
        badge: "🍵 Matcha Zen",
        headline: "First-harvest ceremonial flush rating, whisk guide & optimal water temp",
        description: "Japanese tea ceremony and ceremonial grade matcha storefront with stone-ground harvest certifications, chlorophyll hue indexes, and bamboo whisking guides.",
        image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=1200&auto=format&fit=crop&q=85",
        highlights: ["First-flush Uji Kyoto harvest", "Granite stone-ground powder", "Zero astringency umami score", "Bamboo whisk ritual companion"]
      },
      {
        id: "smokehouse",
        name: "Prime Smokehouse & Roastery",
        tag: "Micro-Lot & Aged",
        badge: "🥩 Smokehouse",
        headline: "45-day Himalayan salt dry aging, A5 Japanese Wagyu BMS 11+ & cryovac chilled",
        description: "Artisanal craft butchery and reserve roastery featuring pasture-to-plate traceability, marbling score certificates (BMS 1-12), and temperature-controlled insulated shipping.",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&auto=format&fit=crop&q=85",
        highlights: ["45-day Himalayan salt dry aging", "A5 Japanese Wagyu BMS 11+", "Vacuum-sealed cryovac chilled", "Traceable pasture RFID tags"]
      }
    ]
  }
];

export default function PlatformLandingPage() {
  const [selectedStoreSlug, setSelectedStoreSlug] = useState("apex-fashion");
  const [selectedTemplateId, setSelectedTemplateId] = useState("minimal");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [previewMode, setPreviewMode] = useState<"live" | "snapshot">("live");
  const [isIframeLoading, setIsIframeLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);
  const [hasCopiedUrl, setHasCopiedUrl] = useState(false);
  const [pricingBilling, setPricingBilling] = useState<"monthly" | "annual">("monthly");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isNavDropdownOpen, setIsNavDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasMouseMoved, setHasMouseMoved] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  // High-performance scroll tracking for top progress indicator
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;

    let rafId: number;
    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        el.style.setProperty("--mouse-x", `${e.clientX}px`);
        el.style.setProperty("--mouse-y", `${e.clientY}px`);
        if (!hasMouseMoved) setHasMouseMoved(true);
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [hasMouseMoved]);

  const activeStore = INDUSTRY_STOREFRONTS.find((s) => s.slug === selectedStoreSlug) || INDUSTRY_STOREFRONTS[0];
  const activeTemplate = activeStore.templates.find((t) => t.id === selectedTemplateId) || activeStore.templates[0];

  const handleCopyUrl = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const url = `https://${activeStore.slug}.storeswift.app?template=${activeTemplate.id}`;
    if (typeof window !== "undefined" && navigator?.clipboard) {
      navigator.clipboard.writeText(url);
      setHasCopiedUrl(true);
      setTimeout(() => setHasCopiedUrl(false), 2000);
    }
  };

  const handleReloadPreview = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsIframeLoading(true);
    setIframeKey((k) => k + 1);
  };

  const faqs = [
    {
      q: "How does StoreSwift compare to traditional platforms like Shopify or WooCommerce?",
      a: "StoreSwift is purpose-built for high-velocity direct-to-consumer commerce. Unlike generic platforms requiring dozens of expensive third-party apps, StoreSwift natively includes 20-second 1-page checkout, 1-click Steadfast & Pathao courier booking, printable 4x6 thermal barcode labels, automated dropshipping fulfillment, and an Anti-Fraud RTO Shield out of the box."
    },
    {
      q: "How do platform fees and subscription pricing work?",
      a: "StoreSwift provides flexible, transparent pricing: start 100% free with ৳0 upfront cost and an 8% transaction fee on our Starter plan. As your business grows, upgrade to Growth (৳499/mo) with a reduced 3% fee, or Pro Enterprise (৳999/mo) to enjoy 0% commission and keep 100% of your retail profit."
    },
    {
      q: "Can I sell dropshipping products without holding physical inventory?",
      a: "Yes! Platform dropshipping is unlocked across ALL plans (Free, Growth, and Pro). You can browse the verified platform catalog, add high-demand items to your store with your own custom retail margin in 1 click, and our central platform warehouse handles quality inspection, packing, shipping, and COD collection automatically."
    },
    {
      q: "How many store templates are available?",
      a: "StoreSwift includes 30 industry-specific production templates across 6 major retail categories (Fashion & Apparel, Beauty & Skincare, Footwear & Leather, Consumer Tech, Fine Jewelry, and Gourmet Groceries)—with 5 distinct design aesthetics per industry. You can switch themes anytime with zero data loss."
    },
    {
      q: "Can I accept Cash on Delivery (COD), bKash, and Nagad?",
      a: "Yes. Cash on Delivery is enabled by default with an Open Parcel Doorstep Inspection guarantee. You can also accept instant mobile payments via bKash Express, Nagad Direct, and credit/debit cards with automated transaction tracking."
    },
    {
      q: "How does automated courier dispatch and thermal printing work?",
      a: "When a customer places an order, click 'Book Steadfast/Pathao' in your Merchant Dashboard to instantly generate a tracking consignment ID. StoreSwift auto-formats 4x6\" thermal shipping labels with barcodes and A4 tax invoices ready for 1-click printing."
    },
    {
      q: "How does the Anti-Fraud RTO Risk Shield protect my business?",
      a: "In social and direct commerce, uncollected Cash on Delivery orders cause costly return courier fees (typically ৳130 per package). StoreSwift's RTO Shield scores customer phone numbers against delivery records, flagging high-risk serial returners so you can collect an advance delivery fee before dispatch."
    },
    {
      q: "Can I connect my own custom domain (e.g. mystore.com)?",
      a: "Every store immediately receives a free subdomain (yourbrand.storeswift.app) with automated SSL. You can connect your own custom domain on our Growth and Pro plans with zero-downtime DNS configuration."
    }
  ];

  return (
    <div
      ref={canvasRef}
      className={`relative flex flex-col min-h-screen studio-canvas text-zinc-900 dark:text-zinc-100 font-sans selection:bg-zinc-800 selection:text-white dark:selection:bg-white dark:selection:text-zinc-950 antialiased transition-colors duration-150 overflow-x-clip ${hasMouseMoved ? "has-mouse" : ""}`}
    >
      {/* ─── Lightweight Interactive Cursor Halo & Grid Spotlight ─────────── */}
      <div className="interactive-cursor-glow" aria-hidden="true" />
      <div className="interactive-grid-spotlight" aria-hidden="true" />

      {/* Global Micro-Matte Grain Texture Overlay */}
      <div className="fixed inset-0 bg-noise-grain pointer-events-none z-30" />

      {/* ─── Global Scroll Progress Indicator (GPU-Accelerated) ─────────────── */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 z-[60] origin-left pointer-events-none"
      />

      {/* ─── 1. Platform Navigation Bar ─────────────────────────────────────── */}
      <header className="border-b border-zinc-200/80 dark:border-white/[0.08] bg-white/85 dark:bg-[#06070a]/85 backdrop-blur-2xl sticky top-0 z-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center space-x-2.5 group flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-zinc-950 flex items-center justify-center font-bold shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Store className="w-4 h-4" />
            </div>
            <span className="text-base font-bold tracking-tight text-zinc-950 dark:text-white">
              Store<span className="text-emerald-500 dark:text-emerald-400">Swift</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            <div className="relative">
              <button
                onClick={() => setIsNavDropdownOpen(!isNavDropdownOpen)}
                className="hover:text-zinc-950 dark:hover:text-white transition flex items-center space-x-1.5 py-1"
              >
                <span>Live Stores & Templates</span>
                <span className="text-[10px] bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 px-1.5 py-0.5 rounded font-bold">30 Themes</span>
                <ChevronDown className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
              </button>

              {isNavDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNavDropdownOpen(false)} />
                  <div className="absolute left-0 mt-2 w-72 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl rounded-2xl shadow-xl border border-zinc-200 dark:border-white/10 z-50 py-2 divide-y divide-zinc-100 dark:divide-white/5 text-xs animate-fade-in">
                    <div className="px-3.5 py-2 text-[10px] uppercase font-mono font-bold tracking-wider text-zinc-500 flex items-center justify-between">
                      <span>6 Flagship Demo Stores</span>
                      <span className="text-emerald-500 font-bold">30 Presets</span>
                    </div>
                    <div className="py-1">
                      {DEMO_STORES_LIST.map((s) => (
                        <Link
                          key={s.slug}
                          href={`/store/${s.slug}`}
                          onClick={() => setIsNavDropdownOpen(false)}
                          className="flex items-center justify-between px-3.5 py-2.5 hover:bg-zinc-100 dark:hover:bg-white/5 transition group"
                        >
                          <div>
                            <p className="font-bold text-zinc-900 dark:text-white group-hover:text-zinc-950 dark:group-hover:text-white transition">{s.name}</p>
                            <p className="text-[10px] text-zinc-500">{s.category} • 5 Themes</p>
                          </div>
                          <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-zinc-950 dark:text-white transition" />
                        </Link>
                      ))}
                    </div>
                    <div className="px-3.5 py-2 bg-zinc-50 dark:bg-white/[0.02] text-[10px] text-zinc-500 font-medium">
                      ✨ 5 Unique Design Aesthetics Per Vertical • 100% Mobile Responsive
                    </div>
                  </div>
                </>
              )}
            </div>
            <a href="#features" className="hover:text-zinc-950 dark:hover:text-white transition">Features</a>
            <a href="#how-it-works" className="hover:text-zinc-950 dark:hover:text-white transition">How It Works</a>
            <a href="#storefronts" className="hover:text-zinc-950 dark:hover:text-white transition">30 Templates</a>
            <a href="#pricing" className="hover:text-zinc-950 dark:hover:text-white transition">Pricing & Dropshipping</a>
            <a href="#faq" className="hover:text-zinc-950 dark:hover:text-white transition">FAQ</a>
          </nav>

          {/* Action Buttons & Mobile Hamburger */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 flex-shrink-0">
            <ThemeToggle />

            <Link
              href="/login"
              className="text-xs font-semibold text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white px-3.5 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition hidden sm:inline-flex items-center"
            >
              <span>Sign In</span>
            </Link>

            <Link
              href="/register"
              className="inline-flex items-center space-x-1.5 text-xs font-bold btn-glass-primary px-4 py-2 rounded-xl transition btn-press"
            >
              <span>Start Free Store</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 transition"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-zinc-200/80 dark:border-white/10 bg-white/95 dark:bg-black/95 backdrop-blur-2xl px-4 py-4 space-y-4 animate-fade-in shadow-2xl">
            <div className="space-y-1">
              <div className="flex items-center justify-between px-2 pb-1">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-zinc-500">
                  Live Stores & Templates
                </span>
                <span className="text-[10px] font-bold text-emerald-500">30 Themes</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                {DEMO_STORES_LIST.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/store/${s.slug}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2.5 rounded-xl bg-zinc-100/70 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/5 hover:bg-zinc-200/70 dark:hover:bg-zinc-800 transition text-xs"
                  >
                    <p className="font-bold text-zinc-900 dark:text-white">{s.name.split(" ")[0]} Store</p>
                    <p className="text-[10px] text-zinc-500">{s.category.split("&")[0].trim()} (5 Themes)</p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t border-zinc-200 dark:border-white/10 pt-3 space-y-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="block px-2 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5">Features</a>
              <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="block px-2 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5">How It Works</a>
              <a href="#storefronts" onClick={() => setIsMobileMenuOpen(false)} className="block px-2 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5">30 Category Templates</a>
              <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="block px-2 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5">Pricing Plans & Dropshipping</a>
              <a href="#faq" onClick={() => setIsMobileMenuOpen(false)} className="block px-2 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5">FAQ</a>
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-950 dark:text-white font-bold"
              >
                <span>Merchant Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-emerald-500 text-zinc-950 font-bold shadow-md shadow-emerald-500/20"
              >
                <span>Start Free Store</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Mobile Theme Toggle Row */}
            <div className="border-t border-zinc-200 dark:border-white/10 pt-3 flex items-center justify-between px-2">
              <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Display Theme</span>
              <ThemeToggle showLabel />
            </div>
          </div>
        )}
      </header>

      {/* ─── 2. Hero Section: Studio Depth & Architectural Calm ─────────────── */}
      <section className="relative overflow-hidden min-h-[calc(100vh-4rem)] flex flex-col justify-between items-center py-12 sm:py-16 lg:py-16 border-b border-zinc-200/80 dark:border-white/[0.08] transition-colors">
        <div className="absolute inset-0 bg-grid-mesh pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[1px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent pointer-events-none" />
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-2/3 max-w-2xl h-12 bg-gradient-to-r from-transparent via-emerald-500/15 to-transparent blur-2xl pointer-events-none" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] lg:w-[1200px] h-[480px] bg-gradient-to-b from-emerald-500/[0.08] to-transparent rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 sm:space-y-7 my-auto">
          {/* Status Capsule Badge with Radar Beacon */}
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-zinc-100/90 dark:bg-white/[0.04] border border-zinc-200/90 dark:border-white/[0.08] text-xs font-medium shadow-sm hover:border-emerald-500/40 transition-colors"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.9)]" />
            </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">StoreSwift 2.0</span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span className="text-zinc-600 dark:text-zinc-400">30 Curated Templates • 1-Page Checkout • Platform Dropshipping</span>
          </motion.div>

          {/* Master Headline with Smooth Typography Reveal */}
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.035em] max-w-5xl mx-auto leading-[1.08] text-zinc-950 dark:text-white"
          >
            Build your online store. <br className="hidden sm:inline" />
            <span>Sell faster with </span>
            <span className="text-emerald-500 dark:text-emerald-400">1-page checkout.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            30 turnkey category templates, 20-second frictionless checkout, automated Steadfast & Pathao courier dispatch, built-in dropshipping with warehouse fulfillment, and 0% commission on Pro.
          </motion.p>

          {/* Primary Action Row with Spring Hover States */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5 flex-wrap"
          >
            <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 text-sm font-bold px-7 py-3.5 rounded-xl btn-glass-primary transition btn-press group"
              >
                <span>Start Free Store (৳0 Upfront)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/store/apex-fashion/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 text-sm font-semibold bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-200/90 dark:bg-zinc-900/80 dark:hover:bg-zinc-800 dark:text-zinc-200 dark:border-white/[0.08] px-6 py-3.5 rounded-xl transition shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
              >
                <Store className="w-4 h-4 text-emerald-500" />
                <span>Merchant Dashboard</span>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/super-admin"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 text-sm font-semibold bg-violet-50 hover:bg-violet-100 text-violet-900 border border-violet-200 dark:bg-violet-950/40 dark:hover:bg-violet-900/50 dark:text-violet-300 dark:border-violet-800/40 px-5 py-3.5 rounded-xl transition shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
              >
                <Zap className="w-4 h-4 text-amber-500" />
                <span>SaaS Super Admin</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Trust Indicators Strip */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="pt-3 flex flex-wrap items-center justify-center gap-5 sm:gap-8 text-xs text-zinc-600 dark:text-zinc-400 font-medium"
          >
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.7)]" />
              <span>30 Industry Category Templates</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.7)]" />
              <span>Platform Dropshipping in All Plans</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.7)]" />
              <span>Steadfast & Pathao 1-Click Sync</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.7)]" />
              <span>0% Commission on Pro Plan</span>
            </div>
          </motion.div>
        </div>

        {/* Scroll Down Prompt with Gentle Bobbing Motion */}
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="relative pt-6 pb-2 flex justify-center"
        >
          <a
            href="#features"
            className="inline-flex items-center space-x-1.5 text-xs font-mono font-medium text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300 transition group"
          >
            <span>Explore enterprise capabilities</span>
            <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
          </a>
        </motion.div>
      </section>

      {/* ─── 4. Core Platform Capabilities (6 High-Velocity Hardware Cards) ────────── */}
      <section id="features" className="relative overflow-hidden py-16 sm:py-20 lg:py-20 border-b border-zinc-200/80 dark:border-white/[0.08] scroll-mt-16 transition-colors">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] lg:w-[1150px] h-[440px] bg-gradient-to-b from-emerald-500/[0.06] to-transparent rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12 w-full my-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-2xl mx-auto space-y-2.5 sm:space-y-3"
          >
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-500 dark:text-emerald-400">
              Core Platform Engines
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight leading-tight bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-600 dark:from-white dark:via-zinc-100 dark:to-zinc-400/80 bg-clip-text text-transparent">
              Engineered for High-Velocity Direct Commerce
            </h2>
            <p className="text-xs sm:text-sm lg:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              StoreSwift replaces fragile plugins with 6 deeply integrated, high-conversion eCommerce engines built for maximum profitability.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Card 01: 20-Second Checkout */}
            <SpotlightCard
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -5 }}
              className="rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <motion.div whileHover={{ scale: 1.15, rotate: 6 }} className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shadow-sm">
                    <Zap className="w-5 h-5" />
                  </motion.div>
                  <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20 animate-float-subtle">
                    &lt; 20s Flow
                  </span>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-zinc-950 dark:text-white tracking-tight">
                    1-Page Express Checkout
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mt-2">
                    Multi-step checkout carts abandon over 65% of mobile customers. StoreSwift compresses checkout into a single 20-second screen.
                  </p>
                </div>

                <div className="space-y-2.5 pt-1 text-xs text-zinc-700 dark:text-zinc-300">
                  <div className="flex items-start space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Automatic Inside Dhaka (৳60) and Nationwide (৳130) rates</span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>1-Tap bKash, Nagad, and Cash on Delivery with open parcel check</span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Instant English and Bengali (বাংলা) language switcher</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-white/[0.06] flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                <span>Speed Benchmark:</span>
                <span className="text-emerald-500 dark:text-emerald-400 font-mono font-bold">+42.8% Conversion Lift</span>
              </div>
            </SpotlightCard>

            {/* Card 02: Automated Logistics & Courier */}
            <SpotlightCard
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -5 }}
              className="rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <motion.div whileHover={{ scale: 1.15, rotate: 6 }} className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shadow-sm">
                    <Truck className="w-5 h-5" />
                  </motion.div>
                  <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20 animate-float-subtle">
                    Steadfast & Pathao
                  </span>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-zinc-950 dark:text-white tracking-tight">
                    1-Click Courier & Printing
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mt-2">
                    Never copy-paste customer orders into courier apps. Generate tracking IDs with one click and print standard 4x6 thermal barcode labels.
                  </p>
                </div>

                <div className="space-y-2.5 pt-1 text-xs text-zinc-700 dark:text-zinc-300">
                  <div className="flex items-start space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>1-Click consignment booking directly from admin orders</span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Ready-to-print 4x6 thermal courier stickers and A4 tax invoices</span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Automated customer SMS triggers and live parcel tracking links</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-white/[0.06] flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                <span>Logistics Partners:</span>
                <span className="text-emerald-500 dark:text-emerald-400 font-mono font-bold">1-Click Dispatch Active</span>
              </div>
            </SpotlightCard>

            {/* Card 03: Platform Dropshipping */}
            <SpotlightCard
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.19, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -5 }}
              className="rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <motion.div whileHover={{ scale: 1.15, rotate: 6 }} className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shadow-sm">
                    <ShoppingBag className="w-5 h-5" />
                  </motion.div>
                  <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20 animate-float-subtle">
                    All Plans
                  </span>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-zinc-950 dark:text-white tracking-tight">
                    Built-in Platform Dropshipping
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mt-2">
                    Start selling immediately without holding inventory. Source verified high-demand products and keep your custom retail markup.
                  </p>
                </div>

                <div className="space-y-2.5 pt-1 text-xs text-zinc-700 dark:text-zinc-300">
                  <div className="flex items-start space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Zero upfront inventory investment needed</span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>1-Click import from platform catalog with custom retail pricing</span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Platform warehouse handles packing, dispatch, and COD collection</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-white/[0.06] flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                <span>Inventory Risk:</span>
                <span className="text-emerald-500 dark:text-emerald-400 font-mono font-bold">Zero Stock Risk</span>
              </div>
            </SpotlightCard>

            {/* Card 04: Margin Protection & Anti-Fraud */}
            <SpotlightCard
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -5 }}
              className="rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <motion.div whileHover={{ scale: 1.15, rotate: 6 }} className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shadow-sm">
                    <ShieldCheck className="w-5 h-5" />
                  </motion.div>
                  <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-500/20 animate-float-subtle">
                    COD Defense
                  </span>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-zinc-950 dark:text-white tracking-tight">
                    Anti-Fraud RTO Risk Shield
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mt-2">
                    Uncollected COD parcels drain 15–25% of merchant profits. Screen phone numbers to flag repeat returners before spending ৳130 on return fees.
                  </p>
                </div>

                <div className="space-y-2.5 pt-1 text-xs text-zinc-700 dark:text-zinc-300">
                  <div className="flex items-start space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>0–100% delivery confidence score before courier handover</span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Advance delivery charge alerts for high-risk customer orders</span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Atomic stock locks prevent overselling during high-traffic sales</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-white/[0.06] flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                <span>RTO Protection:</span>
                <span className="text-emerald-500 dark:text-emerald-400 font-mono font-bold">Saves ৳130/Return</span>
              </div>
            </SpotlightCard>

            {/* Card 05: Abandoned Cart WhatsApp Recovery */}
            <SpotlightCard
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.33, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -5 }}
              className="rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <motion.div whileHover={{ scale: 1.15, rotate: 6 }} className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shadow-sm">
                    <MessageSquare className="w-5 h-5" />
                  </motion.div>
                  <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20 animate-float-subtle">
                    WhatsApp CRM
                  </span>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-zinc-950 dark:text-white tracking-tight">
                    Abandoned Cart WhatsApp Recovery
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mt-2">
                    Recover up to 30% of lost revenue. StoreSwift captures customer details pre-submit and generates 1-click personalized WhatsApp recovery links.
                  </p>
                </div>

                <div className="space-y-2.5 pt-1 text-xs text-zinc-700 dark:text-zinc-300">
                  <div className="flex items-start space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Real-time pre-submit lead capture as customers type their phone</span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>1-Click WhatsApp direct messaging with itemized recovery links</span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Real-time recoverable revenue analytics dashboard</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-white/[0.06] flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                <span>Recovery Lift:</span>
                <span className="text-emerald-500 dark:text-emerald-400 font-mono font-bold">+28% Recovered GMV</span>
              </div>
            </SpotlightCard>

            {/* Card 06: Staff RBAC & Bulk CSV Engine */}
            <SpotlightCard
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.40, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -5 }}
              className="rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <motion.div whileHover={{ scale: 1.15, rotate: 6 }} className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shadow-sm">
                    <Users className="w-5 h-5" />
                  </motion.div>
                  <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20 animate-float-subtle">
                    Enterprise RBAC
                  </span>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-zinc-950 dark:text-white tracking-tight">
                    Team Staff RBAC & Bulk CSV
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mt-2">
                    Collaborate securely with multi-user permissions. Bulk import thousands of products via CSV and export orders for accounting.
                  </p>
                </div>

                <div className="space-y-2.5 pt-1 text-xs text-zinc-700 dark:text-zinc-300">
                  <div className="flex items-start space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Granular roles: Owner, Manager, Fulfillment, Catalog Editor</span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>RFC-4180 CSV product import with sample template download</span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Formula injection defense and customer retargeting directory export</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-white/[0.06] flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                <span>Team Collaboration:</span>
                <span className="text-emerald-500 dark:text-emerald-400 font-mono font-bold">Secure Multi-User</span>
              </div>
            </SpotlightCard>
          </div>
        </div>
      </section>

      {/* ─── 5. How It Works (Minimalist Schematic Workflow) ───────────────── */}
      <section id="how-it-works" className="relative overflow-hidden py-16 sm:py-20 lg:py-20 border-b border-zinc-200/80 dark:border-white/[0.08] scroll-mt-16 transition-colors">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] lg:w-[1000px] h-[360px] bg-gradient-to-b from-emerald-500/[0.05] to-transparent rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-14 w-full my-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-2xl mx-auto space-y-2.5 sm:space-y-3"
          >
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-500 dark:text-emerald-400">
              Onboarding Velocity
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight leading-tight bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-600 dark:from-white dark:via-zinc-100 dark:to-zinc-400/80 bg-clip-text text-transparent">
              Three Simple Steps to Go Live
            </h2>
            <p className="text-xs sm:text-sm lg:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              No developer hiring, no complex agency retainers, and zero plugin maintenance. Launch your online store in under 3 minutes.
            </p>
          </motion.div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8 lg:gap-12">
            <div className="hidden md:block absolute top-8 left-[16.6%] right-[16.6%] h-[1px] border-t border-dashed border-emerald-500/25 dark:border-emerald-500/25 pointer-events-none" />

            {/* Step 01 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
              className="relative pl-20 md:pl-0 space-y-3 md:space-y-5 text-left group"
            >
              <motion.div whileHover={{ scale: 1.12, rotate: 4 }} className="absolute left-0 top-0 md:relative z-10 w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white dark:bg-[#0c0e14] border border-emerald-500/20 text-zinc-900 dark:text-white flex items-center justify-center shadow-sm transition-transform flex-shrink-0">
                <Store className="w-6 h-6 md:w-7 md:h-7 text-emerald-500 dark:text-emerald-400" />
                <span className="absolute -top-2 -right-2 md:-top-2.5 md:-right-2.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/25">
                  01
                </span>
              </motion.div>
              <div className="space-y-1.5 md:space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-500 dark:text-emerald-400 font-bold block">
                  Step 01 • Template Setup
                </span>
                <h3 className="text-lg md:text-xl font-bold text-zinc-950 dark:text-white tracking-tight">
                  Choose from 30 Templates
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Select your vertical (Fashion, Beauty, Footwear, Tech, Jewelry, Food) and pick from 5 curated design presets pre-configured with conversion psychology.
                </p>
              </div>
              <div className="pt-1 md:pt-2 space-y-1.5 md:space-y-2">
                <div className="flex items-center space-x-2 text-xs text-zinc-700 dark:text-zinc-300">
                  <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                  <span>30 Production-grade responsive templates</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-zinc-700 dark:text-zinc-300">
                  <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                  <span>Pre-loaded catalog or 1-click dropshipping</span>
                </div>
              </div>
            </motion.div>

            {/* Step 02 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
              className="relative pl-20 md:pl-0 space-y-3 md:space-y-5 text-left group"
            >
              <motion.div whileHover={{ scale: 1.12, rotate: 4 }} className="absolute left-0 top-0 md:relative z-10 w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white dark:bg-[#0c0e14] border border-emerald-500/20 text-zinc-900 dark:text-white flex items-center justify-center shadow-sm transition-transform flex-shrink-0">
                <Truck className="w-6 h-6 md:w-7 md:h-7 text-emerald-500 dark:text-emerald-400" />
                <span className="absolute -top-2 -right-2 md:-top-2.5 md:-right-2.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/25">
                  02
                </span>
              </motion.div>
              <div className="space-y-1.5 md:space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-500 dark:text-emerald-400 font-bold block">
                  Step 02 • Local Integrations
                </span>
                <h3 className="text-lg md:text-xl font-bold text-zinc-950 dark:text-white tracking-tight">
                  Connect Courier & Payments
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Link Steadfast or Pathao API keys alongside bKash, Nagad, and Cash on Delivery. 64-district delivery rates activate automatically.
                </p>
              </div>
              <div className="pt-1 md:pt-2 space-y-1.5 md:space-y-2">
                <div className="flex items-center space-x-2 text-xs text-zinc-700 dark:text-zinc-300">
                  <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                  <span>Steadfast & Pathao 1-click sync</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-zinc-700 dark:text-zinc-300">
                  <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                  <span>Automated ৳60 / ৳130 district rates</span>
                </div>
              </div>
            </motion.div>

            {/* Step 03 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
              className="relative pl-20 md:pl-0 space-y-3 md:space-y-5 text-left group"
            >
              <motion.div whileHover={{ scale: 1.12, rotate: 4 }} className="absolute left-0 top-0 md:relative z-10 w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white dark:bg-[#0c0e14] border border-emerald-500/25 text-zinc-900 dark:text-white flex items-center justify-center shadow-sm transition-transform flex-shrink-0">
                <Rocket className="w-6 h-6 md:w-7 md:h-7 text-emerald-500 dark:text-emerald-400" />
                <span className="absolute -top-2 -right-2 md:-top-2.5 md:-right-2.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500 text-zinc-950 font-bold shadow-md shadow-emerald-500/25">
                  03
                </span>
              </motion.div>
              <div className="space-y-1.5 md:space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-500 dark:text-emerald-400 font-bold block">
                  Step 03 • High-Speed Selling
                </span>
                <h3 className="text-lg md:text-xl font-bold text-zinc-950 dark:text-white tracking-tight">
                  Launch & Collect Orders
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Capture mobile shoppers with 20-second 1-page checkout. Print 4x6 thermal barcode labels with 1 click and retain up to 100% of profit.
                </p>
              </div>
              <div className="pt-1 md:pt-2 space-y-1.5 md:space-y-2">
                <div className="flex items-center space-x-2 text-xs text-zinc-700 dark:text-zinc-300">
                  <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                  <span>20-Second friction-free checkout</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-zinc-700 dark:text-zinc-300">
                  <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                  <span>0% Commission on Pro Plan</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── 6. Bespoke Turnkey Storefronts (30 Curated Templates) ─────────────── */}
      <section id="storefronts" className="relative overflow-hidden py-16 sm:py-20 lg:py-20 border-b border-zinc-200/80 dark:border-white/[0.08] scroll-mt-16 transition-colors">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[950px] lg:w-[1200px] h-[480px] bg-gradient-to-b from-emerald-500/[0.06] to-transparent rounded-full blur-[110px] pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10 w-full my-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-2xl mx-auto space-y-3"
          >
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-zinc-100/90 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-white/[0.08] text-xs shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <span className="font-mono text-[11px] uppercase tracking-widest text-zinc-700 dark:text-zinc-300 font-medium">
                30 Curated Category Presets
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight leading-tight bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-600 dark:from-white dark:via-zinc-100 dark:to-zinc-400/80 bg-clip-text text-transparent">
              30 Templates Across 6 Verticals
            </h2>
            <p className="text-xs sm:text-sm lg:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl mx-auto">
              Every retail vertical has distinct buyer psychology. Select an industry to preview its flagship live store and 5 specialized theme aesthetics.
            </p>
          </motion.div>

          {/* Minimalist Category Selector Track with Template Counts */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex justify-center"
          >
            <div className="inline-flex items-center p-1.5 rounded-2xl sm:rounded-full bg-zinc-100/90 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-white/[0.08] backdrop-blur-xl shadow-inner gap-1 max-w-full overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {INDUSTRY_STOREFRONTS.map((store) => {
                const isSelected = selectedStoreSlug === store.slug;
                return (
                  <button
                    key={store.slug}
                    onClick={() => {
                      setSelectedStoreSlug(store.slug);
                      setSelectedTemplateId(store.templates[0].id);
                    }}
                    className={`px-4 py-2 rounded-xl sm:rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-2 ${
                      isSelected
                        ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-sm border border-zinc-200/90 dark:border-white/10"
                        : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-white/[0.04] border border-transparent"
                    }`}
                  >
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)] flex-shrink-0" />
                    )}
                    <span>{store.category}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-zinc-200 dark:bg-white/10 text-zinc-700 dark:text-zinc-300">5</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Featured Store Showcase: Studio Frame & Blueprint Cockpit */}
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.99 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="luxury-card rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch border border-zinc-200/80 dark:border-white/[0.08] shadow-2xl"
          >
            {/* Left Column: High-Fidelity Browser Window Frame */}
            <div className="lg:col-span-7 flex flex-col bg-zinc-950 border-b lg:border-b-0 lg:border-r border-zinc-200/80 dark:border-white/[0.08] overflow-hidden group">
              {/* Sleek Browser Navigation Header */}
              <div className="py-2.5 px-3 sm:px-4 flex flex-wrap items-center justify-between border-b border-white/[0.08] bg-zinc-900/95 backdrop-blur-md flex-shrink-0 gap-2">
                <div className="flex items-center space-x-1.5 flex-shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 hover:opacity-100 transition-opacity" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 hover:opacity-100 transition-opacity" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 hover:opacity-100 transition-opacity" />
                </div>

                {/* Dynamic Address Bar with Direct Copy & Reload */}
                <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-zinc-950 border border-white/[0.08] text-[11px] font-mono text-zinc-400 min-w-[200px] sm:min-w-[260px] max-w-[360px] flex-1 justify-between shadow-inner">
                  <div className="flex items-center space-x-1.5 truncate">
                    <Lock className="w-2.5 h-2.5 text-emerald-400 flex-shrink-0" />
                    <span className="text-zinc-300 font-medium truncate">
                      {activeStore.slug}.storeswift.app<span className="text-emerald-400">?template={activeTemplate.id}</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <button
                      type="button"
                      onClick={handleReloadPreview}
                      title="Reload preview"
                      className="text-zinc-400 hover:text-white p-0.5 rounded transition hover:bg-white/10"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyUrl}
                      title="Copy store URL"
                      className="text-zinc-400 hover:text-white p-0.5 rounded transition hover:bg-white/10"
                    >
                      {hasCopiedUrl ? (
                        <CheckCheck className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                    <a
                      href={`/store/${activeStore.slug}?template=${activeTemplate.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open full store in new tab"
                      className="text-zinc-400 hover:text-white p-0.5 rounded transition hover:bg-white/10 hidden sm:inline-block"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Mode & Device Controls */}
                <div className="flex items-center space-x-1.5 flex-shrink-0">
                  {/* Mode Switcher: Live Interactive vs Clean Snapshot */}
                  <div className="flex items-center p-0.5 rounded-lg bg-zinc-950 border border-white/[0.08]">
                    <button
                      type="button"
                      onClick={() => setPreviewMode("live")}
                      className={`px-2 py-0.5 rounded text-[10px] font-medium transition flex items-center space-x-1 ${
                        previewMode === "live"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "text-zinc-400 hover:text-zinc-200"
                      }`}
                      title="Live interactive store"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Live</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewMode("snapshot")}
                      className={`px-2 py-0.5 rounded text-[10px] font-medium transition flex items-center space-x-1 ${
                        previewMode === "snapshot"
                          ? "bg-white/20 text-white border border-white/20"
                          : "text-zinc-400 hover:text-zinc-200"
                      }`}
                      title="Clean theme graphic"
                    >
                      <Eye className="w-2.5 h-2.5" />
                      <span>Design</span>
                    </button>
                  </div>

                  {/* Device Viewport Toggle (Desktop / Tablet / Mobile) */}
                  <div className="flex items-center p-0.5 rounded-lg bg-zinc-950 border border-white/[0.08]">
                    <button
                      type="button"
                      onClick={() => setPreviewDevice("desktop")}
                      className={`p-1 rounded text-xs transition ${
                        previewDevice === "desktop"
                          ? "bg-white/20 text-white shadow-xs"
                          : "text-zinc-500 hover:text-zinc-300"
                      }`}
                      title="Desktop view"
                    >
                      <Monitor className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewDevice("tablet")}
                      className={`p-1 rounded text-xs transition ${
                        previewDevice === "tablet"
                          ? "bg-white/20 text-white shadow-xs"
                          : "text-zinc-500 hover:text-zinc-300"
                      }`}
                      title="Tablet view"
                    >
                      <Tablet className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewDevice("mobile")}
                      className={`p-1 rounded text-xs transition ${
                        previewDevice === "mobile"
                          ? "bg-white/20 text-white shadow-xs"
                          : "text-zinc-500 hover:text-zinc-300"
                      }`}
                      title="Mobile view"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Viewport Preview Stage — Crystal Clear with ZERO Dark Tint */}
              <div className={`relative flex-1 min-h-[500px] sm:min-h-[580px] lg:min-h-[640px] overflow-hidden flex items-center justify-center transition-all bg-zinc-950 ${
                previewDevice !== "desktop" || previewMode === "snapshot" ? "p-3 sm:p-5" : ""
              }`}>
                {previewMode === "live" ? (
                  /* ─── LIVE INTERACTIVE STORE EMBED ─── */
                  <>
                    {/* Subtle Loading Spinner while iframe renders */}
                    {isIframeLoading && (
                      <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-xs flex flex-col items-center justify-center space-y-2.5 z-20 transition-opacity">
                        <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                        <span className="text-xs font-mono text-zinc-300 tracking-wider">
                          Loading {activeTemplate.name}...
                        </span>
                      </div>
                    )}

                    {previewDevice === "desktop" ? (
                      /* Full-Width Desktop Interactive Viewport */
                      <div className="w-full h-full min-h-[500px] sm:min-h-[580px] lg:min-h-[640px] relative bg-white dark:bg-zinc-950 flex flex-col">
                        <iframe
                          key={`desktop-${activeStore.slug}-${activeTemplate.id}-${iframeKey}`}
                          src={`/store/${activeStore.slug}?template=${activeTemplate.id}&embed=1`}
                          title={`${activeStore.name} Live Storefront`}
                          onLoad={() => setIsIframeLoading(false)}
                          className="w-full h-full min-h-[500px] sm:min-h-[580px] lg:min-h-[640px] border-0 bg-white"
                        />
                        {/* Floating Interaction Hint Pill */}
                        <div className="absolute bottom-3 right-4 z-10 pointer-events-none">
                          <div className="backdrop-blur-md bg-zinc-950/80 border border-white/10 text-zinc-300 text-[10px] font-mono px-3 py-1.5 rounded-full shadow-lg flex items-center space-x-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Interactive Preview • Scroll & Test Checkout</span>
                          </div>
                        </div>
                      </div>
                    ) : previewDevice === "tablet" ? (
                      /* Centered Tablet Viewport */
                      <div className="w-[580px] sm:w-[680px] max-w-full h-[500px] sm:h-[580px] rounded-2xl border-4 border-zinc-700 bg-white shadow-2xl overflow-hidden relative flex flex-col mx-auto ring-1 ring-white/10">
                        <iframe
                          key={`tablet-${activeStore.slug}-${activeTemplate.id}-${iframeKey}`}
                          src={`/store/${activeStore.slug}?template=${activeTemplate.id}&embed=1`}
                          title={`${activeStore.name} Tablet View`}
                          onLoad={() => setIsIframeLoading(false)}
                          className="w-full h-full border-0 bg-white"
                        />
                      </div>
                    ) : (
                      /* Centered Smartphone Viewport */
                      <div className="w-[310px] sm:w-[340px] h-[520px] sm:h-[590px] rounded-[38px] border-4 border-zinc-700 bg-zinc-950 shadow-2xl overflow-hidden flex flex-col relative mx-auto ring-1 ring-white/10">
                        {/* Dynamic Island */}
                        <div className="h-5 bg-zinc-950 flex items-center justify-center pt-1.5">
                          <div className="w-20 h-3.5 bg-zinc-800 rounded-full flex items-center justify-end px-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
                          </div>
                        </div>
                        {/* Phone Screen Iframe */}
                        <div className="flex-1 overflow-hidden relative bg-white">
                          <iframe
                            key={`mobile-${activeStore.slug}-${activeTemplate.id}-${iframeKey}`}
                            src={`/store/${activeStore.slug}?template=${activeTemplate.id}&embed=1`}
                            title={`${activeStore.name} Mobile View`}
                            onLoad={() => setIsIframeLoading(false)}
                            className="w-full h-full border-0 bg-white"
                          />
                        </div>
                        {/* Home Indicator */}
                        <div className="h-4 bg-zinc-950 flex items-center justify-center">
                          <div className="w-20 h-1 bg-zinc-600 rounded-full" />
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  /* ─── CLEAN DESIGN SNAPSHOT (ZERO DARK TINTS) ─── */
                  <div className="w-full h-full relative rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 flex items-center justify-center group/img">
                    <img
                      key={activeTemplate.id}
                      src={activeTemplate.image}
                      alt={activeTemplate.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105"
                    />
                    {/* Crisp Top Badge — NO DARK GRADIENT OVERLAY */}
                    <div className="absolute top-4 left-4 backdrop-blur-md bg-zinc-950/85 text-white text-[11px] font-semibold px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                      <span>{activeTemplate.name}</span>
                      <span className="text-zinc-400">• {activeTemplate.tag}</span>
                    </div>

                    <div className="absolute bottom-4 right-4 backdrop-blur-md bg-zinc-950/85 text-zinc-300 text-[10px] font-mono px-3 py-1.5 rounded-full border border-white/10 shadow-lg flex items-center space-x-1.5">
                      <span>Click &apos;Live&apos; above for interactive store</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Architecture Cockpit & Capabilities */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-zinc-50/50 dark:bg-zinc-950/60">
              <div className="space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center space-x-1.5">
                      <Sparkles className="w-3 h-3 text-emerald-500" />
                      <span>Theme {activeStore.templates.findIndex((t) => t.id === activeTemplate.id) + 1} of 5</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {activeStore.category}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-white tracking-tight">
                    {activeTemplate.name}
                  </h3>
                  <div className="mt-1">
                    <span className="inline-block text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/80 dark:border-white/10">
                      {activeTemplate.tag}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mt-2.5">
                    {activeTemplate.description}
                  </p>
                </div>

                {/* Interactive 5-Theme Switcher Grid */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
                      Available Themes in This Industry:
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">Click to switch</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeStore.templates.map((tmpl) => {
                      const isSelected = activeTemplate.id === tmpl.id;
                      return (
                        <button
                          key={tmpl.id}
                          type="button"
                          onClick={() => {
                            setSelectedTemplateId(tmpl.id);
                            setIsIframeLoading(true);
                          }}
                          className={`text-left px-3 py-2.5 rounded-xl border text-xs font-medium transition-all flex items-center justify-between group ${
                            isSelected
                              ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 dark:border-emerald-500/80 text-zinc-950 dark:text-white shadow-sm ring-1 ring-emerald-500/30"
                              : "bg-white dark:bg-zinc-900 border-zinc-200/90 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-white/20 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
                          }`}
                        >
                          <div className="flex items-center space-x-2 min-w-0 pr-1">
                            <span
                              className={`w-2 h-2 rounded-full flex-shrink-0 transition-transform ${
                                isSelected
                                  ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.9)] scale-110"
                                  : "bg-zinc-300 dark:bg-zinc-600 group-hover:bg-zinc-400"
                              }`}
                            />
                            <div className="truncate">
                              <span className="block truncate font-semibold text-[11px]">{tmpl.name}</span>
                              <span className="block text-[9.5px] text-zinc-400 dark:text-zinc-500 font-mono truncate">
                                {tmpl.tag}
                              </span>
                            </div>
                          </div>
                          {isSelected ? (
                            <span className="flex-shrink-0 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold">
                              ✓
                            </span>
                          ) : (
                            <span className="text-[10px] text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
                              →
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Capabilities Feature Rows */}
                <div className="space-y-2 pt-3 border-t border-zinc-200/80 dark:border-white/[0.08]">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block mb-1">
                    Engineered Conversion Features
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeTemplate.highlights.map((feat, idx) => (
          <div key={idx} className="flex items-center space-x-2 text-xs text-zinc-700 dark:text-zinc-300">
            <div className="w-4 h-4 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 border border-emerald-500/20">
              <Check className="w-2.5 h-2.5" />
            </div>
            <span className="font-medium text-zinc-800 dark:text-zinc-200 text-[11.5px] truncate" title={feat}>
              {feat}
            </span>
          </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Specs & Action Footer */}
              <div className="space-y-4 pt-4 border-t border-zinc-200/80 dark:border-white/[0.08]">
                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-white/[0.08] text-center">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
                      Plans
                    </span>
                    <span className="text-xs sm:text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      Start Free ৳0
                    </span>
                  </div>
                  <div className="border-x border-zinc-200/80 dark:border-white/[0.08]">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
                      Setup Time
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">
                      3 Minutes
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
                      Checkout
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">
                      20s Express
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5">
                  <Link
                    href={`/store/${activeStore.slug}?template=${activeTemplate.id}`}
                    target="_blank"
                    className="flex-1 py-3 px-4 btn-glass-primary text-xs font-bold rounded-xl transition text-center flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 btn-press group"
                  >
                    <span>Launch {activeTemplate.name} Live</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                  <Link
                    href={`/register?category=${activeStore.categoryParam}&template=${activeTemplate.id}`}
                    className="py-3 px-5 bg-white hover:bg-zinc-50 border border-zinc-200/90 text-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:border-white/10 dark:text-zinc-200 dark:hover:text-white font-semibold text-xs rounded-xl transition text-center shadow-[0_1px_2px_rgba(0,0,0,0.02)] btn-press flex items-center justify-center"
                  >
                    <span>Clone Template</span>
                  </Link>
                </div>

                <div className="flex items-center justify-center space-x-1.5 text-[10.5px] text-zinc-500 dark:text-zinc-400">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  <span>100% Real-time database sync • Switch themes anytime with zero data loss</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── 7. Transparent Pricing & Feature Matrix ─────────────────────────── */}
      <section id="pricing" className="relative overflow-hidden py-16 sm:py-20 lg:py-20 border-b border-zinc-200/80 dark:border-white/[0.08] scroll-mt-16 transition-colors">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] lg:w-[950px] h-[400px] bg-gradient-to-b from-emerald-500/[0.06] to-transparent rounded-full blur-[90px] pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10 w-full my-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-xl mx-auto space-y-2.5 sm:space-y-3"
          >
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-500 dark:text-emerald-400">
              Transparent Subscription Tiers
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight leading-tight bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-600 dark:from-white dark:via-zinc-100 dark:to-zinc-400/80 bg-clip-text text-transparent">
              Simple, Predictable Pricing
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
              Start 100% free with ৳0 upfront or unlock 0% commission on Pro. Platform dropshipping included across all plans.
            </p>

            {/* Billing Cadence Toggle */}
            <div className="pt-2 sm:pt-3 flex items-center justify-center">
              <div className="p-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/90 dark:border-white/10 flex items-center space-x-1 text-xs">
                <button
                  type="button"
                  onClick={() => setPricingBilling("monthly")}
                  className={`px-4 py-1.5 rounded-full transition font-semibold ${
                    pricingBilling === "monthly"
                      ? "bg-emerald-500 text-zinc-950 shadow-sm font-bold"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                  }`}
                >
                  Monthly Billing
                </button>
                <button
                  type="button"
                  onClick={() => setPricingBilling("annual")}
                  className={`px-4 py-1.5 rounded-full transition font-semibold flex items-center space-x-1.5 ${
                    pricingBilling === "annual"
                      ? "bg-emerald-500 text-zinc-950 shadow-sm font-bold"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                  }`}
                >
                  <span>Annual Billing</span>
                  <span className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    Save 20%
                  </span>
                </button>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch pt-2">
            {/* Starter Plan */}
            <SpotlightCard
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -5 }}
              className="rounded-3xl p-6 sm:p-8 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-zinc-950 dark:text-white">Starter (Free)</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">For new merchants launching online with zero upfront cost</p>
                </div>
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-3xl sm:text-4xl font-extrabold text-zinc-950 dark:text-white">
                    ৳0
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">/month (Free Forever)</span>
                </div>
                <ul className="space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300 pt-3 border-t border-zinc-200/80 dark:border-white/[0.08]">
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" /><span>Up to 50 active products</span></li>
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" /><span className="font-semibold text-emerald-600 dark:text-emerald-400">Platform Dropshipping Included</span></li>
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" /><span>20s 1-Page Express Checkout</span></li>
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" /><span>Steadfast & Pathao courier booking</span></li>
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" /><span>8% platform fee per order</span></li>
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" /><span>All 30 premium responsive templates</span></li>
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" /><span>Printable invoices & thermal labels</span></li>
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" /><span>Free StoreSwift subdomain with SSL</span></li>
                </ul>
              </div>
              <Link href="/register?plan=free" className="mt-6 w-full py-3 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200/90 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:border-white/10 text-zinc-900 dark:text-white font-bold text-xs rounded-xl transition text-center btn-press">
                Start Free Store
              </Link>
            </SpotlightCard>

            {/* Growth Plan (Popular - Radiant Emerald Ring Elevation) */}
            <SpotlightCard
              initial={{ opacity: 0, y: 34, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6 }}
              className="ring-1 ring-emerald-500/60 dark:ring-emerald-500/50 rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative shadow-2xl shadow-emerald-500/10"
            >
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-zinc-950 text-[10px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md shadow-emerald-500/20">
                Most Popular
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-zinc-950 dark:text-white">Growth</h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1">For scaling direct, social & dropshipping brands</p>
                </div>
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-3xl sm:text-4xl font-extrabold text-zinc-950 dark:text-white">
                    {pricingBilling === "monthly" ? "৳499" : "৳399"}
                  </span>
                  <span className="text-xs text-zinc-600 dark:text-zinc-300 font-medium">/month</span>
                  {pricingBilling === "annual" && (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono ml-1">billed annually (Save 20%)</span>
                  )}
                </div>
                <ul className="space-y-2.5 text-xs text-zinc-700 dark:text-zinc-200 pt-3 border-t border-zinc-200/80 dark:border-white/10">
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" /><span>Up to 500 active products</span></li>
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" /><span className="font-semibold text-emerald-600 dark:text-emerald-400">Platform Dropshipping (Priority Fulfillment)</span></li>
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" /><span>Low 3% platform fee per order</span></li>
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" /><span>Custom domain with automated SSL</span></li>
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" /><span>Discount coupon engine (flat & percent)</span></li>
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" /><span>Up to 3 staff seats with RBAC roles</span></li>
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" /><span>Anti-Fraud RTO Risk Shield</span></li>
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" /><span>Meta Pixel, TikTok & GTM CAPI</span></li>
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" /><span>Priority customer support</span></li>
                </ul>
              </div>
              <Link href="/register?plan=medium" className="mt-6 w-full py-3.5 btn-glass-primary font-bold text-xs rounded-xl transition text-center btn-press">
                Choose Growth Plan
              </Link>
            </SpotlightCard>

            {/* Pro Enterprise Plan */}
            <SpotlightCard
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -5 }}
              className="rounded-3xl p-6 sm:p-8 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-zinc-950 dark:text-white">Pro Enterprise</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">For high-volume multi-channel merchants & teams</p>
                </div>
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-3xl sm:text-4xl font-extrabold text-zinc-950 dark:text-white">
                    {pricingBilling === "monthly" ? "৳999" : "৳799"}
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">/month</span>
                  {pricingBilling === "annual" && (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono ml-1">billed annually (Save 20%)</span>
                  )}
                </div>
                <ul className="space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300 pt-3 border-t border-zinc-200/80 dark:border-white/[0.08]">
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" /><span>Unlimited products & orders</span></li>
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" /><span className="font-semibold text-emerald-600 dark:text-emerald-400">Platform Dropshipping (VIP Dispatch & Custom Packing)</span></li>
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" /><span className="font-semibold text-emerald-600 dark:text-emerald-400">0% Commission — Keep 100% of profit</span></li>
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" /><span>Unlimited staff seats & granular RBAC</span></li>
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" /><span>Custom courier API credentials</span></li>
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" /><span>Bulk CSV product, order & customer export</span></li>
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" /><span>Dedicated 24/7 VIP account manager</span></li>
                  <li className="flex items-center space-x-2.5"><Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" /><span>Global CDN & sub-second response SLA</span></li>
                </ul>
              </div>
              <Link href="/register?plan=pro" className="mt-6 w-full py-3 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200/90 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:border-white/10 text-zinc-900 dark:text-white font-bold text-xs rounded-xl transition text-center btn-press">
                Choose Pro Enterprise
              </Link>
            </SpotlightCard>
          </div>

          {/* ─── Detailed Plan & Dropshipping Feature Comparison Table ─── */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="pt-12 sm:pt-16 border-t border-zinc-200/80 dark:border-white/[0.08] space-y-6"
          >
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-500 dark:text-emerald-400">
                Side-by-Side Comparison
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
                Detailed Feature Matrix
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                Full platform dropshipping is unlocked across all plans. Scale your catalog, team seats, and custom domains as your business expands.
              </p>
            </div>

            <div className="overflow-x-auto rounded-3xl luxury-card border border-zinc-200/90 dark:border-white/10 shadow-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200/80 dark:border-white/10 bg-zinc-50/80 dark:bg-white/[0.02]">
                    <th className="py-4 px-4 sm:px-6 font-bold text-zinc-950 dark:text-white text-sm">Feature & Capabilities</th>
                    <th className="py-4 px-3 sm:px-6 font-bold text-zinc-950 dark:text-white text-center w-28 sm:w-44">Starter (Free)</th>
                    <th className="py-4 px-3 sm:px-6 font-bold text-emerald-600 dark:text-emerald-400 text-center w-28 sm:w-44 bg-emerald-500/5">Growth (৳499/mo)</th>
                    <th className="py-4 px-3 sm:px-6 font-bold text-zinc-950 dark:text-white text-center w-28 sm:w-44">Pro (৳999/mo)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200/80 dark:divide-white/[0.06]">
                  {/* Category 1: Pricing & Platform Fees */}
                  <tr className="bg-zinc-100/60 dark:bg-white/[0.03]">
                    <td colSpan={4} className="py-2.5 px-4 sm:px-6 font-bold text-[11px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono">
                      1. Pricing & Platform Fees
                    </td>
                  </tr>
                  <tr className="hover:bg-zinc-50 dark:hover:bg-white/[0.01] transition">
                    <td className="py-3 px-4 sm:px-6 font-medium text-zinc-900 dark:text-zinc-200">Monthly Subscription Fee</td>
                    <td className="py-3 px-3 sm:px-6 text-center font-bold text-zinc-900 dark:text-white">৳0 / mo (Free)</td>
                    <td className="py-3 px-3 sm:px-6 text-center font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/5">৳499 / mo</td>
                    <td className="py-3 px-3 sm:px-6 text-center font-bold text-zinc-900 dark:text-white">৳999 / mo</td>
                  </tr>
                  <tr className="hover:bg-zinc-50 dark:hover:bg-white/[0.01] transition">
                    <td className="py-3 px-4 sm:px-6 font-medium text-zinc-900 dark:text-zinc-200">Platform Transaction Commission</td>
                    <td className="py-3 px-3 sm:px-6 text-center text-zinc-600 dark:text-zinc-400">8%</td>
                    <td className="py-3 px-3 sm:px-6 text-center font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/5">3%</td>
                    <td className="py-3 px-3 sm:px-6 text-center font-bold text-emerald-500">0% (Keep 100%)</td>
                  </tr>
                  <tr className="hover:bg-zinc-50 dark:hover:bg-white/[0.01] transition">
                    <td className="py-3 px-4 sm:px-6 font-medium text-zinc-900 dark:text-zinc-200">Active Products Limit</td>
                    <td className="py-3 px-3 sm:px-6 text-center text-zinc-600 dark:text-zinc-400">50 Products</td>
                    <td className="py-3 px-3 sm:px-6 text-center font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/5">500 Products</td>
                    <td className="py-3 px-3 sm:px-6 text-center font-bold text-emerald-500">Unlimited</td>
                  </tr>

                  {/* Category 2: Platform Dropshipping */}
                  <tr className="bg-zinc-100/60 dark:bg-white/[0.03]">
                    <td colSpan={4} className="py-2.5 px-4 sm:px-6 font-bold text-[11px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono">
                      2. Platform Dropshipping (Available in All Plans)
                    </td>
                  </tr>
                  <tr className="hover:bg-zinc-50 dark:hover:bg-white/[0.01] transition">
                    <td className="py-3 px-4 sm:px-6 font-medium text-zinc-900 dark:text-zinc-200">Platform Dropshipping Access</td>
                    <td className="py-3 px-3 sm:px-6 text-center text-emerald-500"><Check className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3 px-3 sm:px-6 text-center text-emerald-500 bg-emerald-500/5"><Check className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3 px-3 sm:px-6 text-center text-emerald-500"><Check className="w-4 h-4 mx-auto" /></td>
                  </tr>
                  <tr className="hover:bg-zinc-50 dark:hover:bg-white/[0.01] transition">
                    <td className="py-3 px-4 sm:px-6 font-medium text-zinc-900 dark:text-zinc-200">1-Click Catalog Import & Markup Customization</td>
                    <td className="py-3 px-3 sm:px-6 text-center text-emerald-500"><Check className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3 px-3 sm:px-6 text-center text-emerald-500 bg-emerald-500/5"><Check className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3 px-3 sm:px-6 text-center text-emerald-500"><Check className="w-4 h-4 mx-auto" /></td>
                  </tr>
                  <tr className="hover:bg-zinc-50 dark:hover:bg-white/[0.01] transition">
                    <td className="py-3 px-4 sm:px-6 font-medium text-zinc-900 dark:text-zinc-200">Platform Warehouse Packaging & COD Remittance</td>
                    <td className="py-3 px-3 sm:px-6 text-center text-emerald-500"><Check className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3 px-3 sm:px-6 text-center font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/5">Priority Queue</td>
                    <td className="py-3 px-3 sm:px-6 text-center font-bold text-zinc-950 dark:text-white">VIP Custom Packing</td>
                  </tr>

                  {/* Category 3: Storefront & Themes */}
                  <tr className="bg-zinc-100/60 dark:bg-white/[0.03]">
                    <td colSpan={4} className="py-2.5 px-4 sm:px-6 font-bold text-[11px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono">
                      3. Storefronts, Themes & Domains
                    </td>
                  </tr>
                  <tr className="hover:bg-zinc-50 dark:hover:bg-white/[0.01] transition">
                    <td className="py-3 px-4 sm:px-6 font-medium text-zinc-900 dark:text-zinc-200">All 30 Production-Grade Industry Themes</td>
                    <td className="py-3 px-3 sm:px-6 text-center text-emerald-500"><Check className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3 px-3 sm:px-6 text-center text-emerald-500 bg-emerald-500/5"><Check className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3 px-3 sm:px-6 text-center text-emerald-500"><Check className="w-4 h-4 mx-auto" /></td>
                  </tr>
                  <tr className="hover:bg-zinc-50 dark:hover:bg-white/[0.01] transition">
                    <td className="py-3 px-4 sm:px-6 font-medium text-zinc-900 dark:text-zinc-200">Free StoreSwift Subdomain (.storeswift.app) with SSL</td>
                    <td className="py-3 px-3 sm:px-6 text-center text-emerald-500"><Check className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3 px-3 sm:px-6 text-center text-emerald-500 bg-emerald-500/5"><Check className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3 px-3 sm:px-6 text-center text-emerald-500"><Check className="w-4 h-4 mx-auto" /></td>
                  </tr>
                  <tr className="hover:bg-zinc-50 dark:hover:bg-white/[0.01] transition">
                    <td className="py-3 px-4 sm:px-6 font-medium text-zinc-900 dark:text-zinc-200">Custom Domain Connection (e.g. yourbrand.com)</td>
                    <td className="py-3 px-3 sm:px-6 text-center text-zinc-400">—</td>
                    <td className="py-3 px-3 sm:px-6 text-center text-emerald-500 bg-emerald-500/5"><Check className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3 px-3 sm:px-6 text-center text-emerald-500"><Check className="w-4 h-4 mx-auto" /></td>
                  </tr>
                  <tr className="hover:bg-zinc-50 dark:hover:bg-white/[0.01] transition">
                    <td className="py-3 px-4 sm:px-6 font-medium text-zinc-900 dark:text-zinc-200">Storefront Customer Portal & Order History</td>
                    <td className="py-3 px-3 sm:px-6 text-center text-emerald-500"><Check className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3 px-3 sm:px-6 text-center text-emerald-500 bg-emerald-500/5"><Check className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3 px-3 sm:px-6 text-center text-emerald-500"><Check className="w-4 h-4 mx-auto" /></td>
                  </tr>

                  {/* Category 4: Checkout, Orders & Printing */}
                  <tr className="bg-zinc-100/60 dark:bg-white/[0.03]">
                    <td colSpan={4} className="py-2.5 px-4 sm:px-6 font-bold text-[11px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono">
                      4. Checkout, Orders & Printing
                    </td>
                  </tr>
                  <tr className="hover:bg-zinc-50 dark:hover:bg-white/[0.01] transition">
                    <td className="py-3 px-4 sm:px-6 font-medium text-zinc-900 dark:text-zinc-200">1-Page 20s Express Checkout (64 Districts)</td>
                    <td className="py-3 px-3 sm:px-6 text-center text-emerald-500"><Check className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3 px-3 sm:px-6 text-center text-emerald-500 bg-emerald-500/5"><Check className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3 px-3 sm:px-6 text-center text-emerald-500"><Check className="w-4 h-4 mx-auto" /></td>
                  </tr>
                  <tr className="hover:bg-zinc-50 dark:hover:bg-white/[0.01] transition">
                    <td className="py-3 px-4 sm:px-6 font-medium text-zinc-900 dark:text-zinc-200">1-Click Printable A4 Tax Invoices</td>
                    <td className="py-3 px-3 sm:px-6 text-center text-emerald-500"><Check className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3 px-3 sm:px-6 text-center text-emerald-500 bg-emerald-500/5"><Check className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3 px-3 sm:px-6 text-center text-emerald-500"><Check className="w-4 h-4 mx-auto" /></td>
                  </tr>
                  <tr className="hover:bg-zinc-50 dark:hover:bg-white/[0.01] transition">
                    <td className="py-3 px-4 sm:px-6 font-medium text-zinc-900 dark:text-zinc-200">4x6" Thermal Courier Shipping Slips (with Barcodes)</td>
                    <td className="py-3 px-3 sm:px-6 text-center text-emerald-500"><Check className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3 px-3 sm:px-6 text-center text-emerald-500 bg-emerald-500/5"><Check className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3 px-3 sm:px-6 text-center text-emerald-500"><Check className="w-4 h-4 mx-auto" /></td>
                  </tr>
                  <tr className="hover:bg-zinc-50 dark:hover:bg-white/[0.01] transition">
                    <td className="py-3 px-4 sm:px-6 font-medium text-zinc-900 dark:text-zinc-200">Courier Integrations (Steadfast, Pathao, RedX)</td>
                    <td className="py-3 px-3 sm:px-6 text-center text-zinc-600 dark:text-zinc-400">1 Courier</td>
                    <td className="py-3 px-3 sm:px-6 text-center font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/5">2 Couriers</td>
                    <td className="py-3 px-3 sm:px-6 text-center font-bold text-zinc-950 dark:text-white">All 3 Couriers</td>
                  </tr>

                  {/* Category 5: Team, RBAC & Security */}
                  <tr className="bg-zinc-100/60 dark:bg-white/[0.03]">
                    <td colSpan={4} className="py-2.5 px-4 sm:px-6 font-bold text-[11px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono">
                      5. Team Collaboration & RBAC Security
                    </td>
                  </tr>
                  <tr className="hover:bg-zinc-50 dark:hover:bg-white/[0.01] transition">
                    <td className="py-3 px-4 sm:px-6 font-medium text-zinc-900 dark:text-zinc-200">Staff Accounts & RBAC Roles</td>
                    <td className="py-3 px-3 sm:px-6 text-center text-zinc-600 dark:text-zinc-400">1 Seat (Owner)</td>
                    <td className="py-3 px-3 sm:px-6 text-center font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/5">Up to 3 Seats</td>
                    <td className="py-3 px-3 sm:px-6 text-center font-bold text-emerald-500">Unlimited Seats</td>
                  </tr>
                  <tr className="hover:bg-zinc-50 dark:hover:bg-white/[0.01] transition">
                    <td className="py-3 px-4 sm:px-6 font-medium text-zinc-900 dark:text-zinc-200">Granular Role Permissions (Manager, Fulfillment, Editor)</td>
                    <td className="py-3 px-3 sm:px-6 text-center text-zinc-400">—</td>
                    <td className="py-3 px-3 sm:px-6 text-center text-emerald-500 bg-emerald-500/5"><Check className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3 px-3 sm:px-6 text-center text-emerald-500"><Check className="w-4 h-4 mx-auto" /></td>
                  </tr>
                  <tr className="hover:bg-zinc-50 dark:hover:bg-white/[0.01] transition">
                    <td className="py-3 px-4 sm:px-6 font-medium text-zinc-900 dark:text-zinc-200">Anti-Fraud RTO Risk Shield</td>
                    <td className="py-3 px-3 sm:px-6 text-center text-zinc-400">—</td>
                    <td className="py-3 px-3 sm:px-6 text-center text-emerald-500 bg-emerald-500/5"><Check className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3 px-3 sm:px-6 text-center text-emerald-500"><Check className="w-4 h-4 mx-auto" /></td>
                  </tr>

                  {/* Category 6: Marketing, Coupons & Retention */}
                  <tr className="bg-zinc-100/60 dark:bg-white/[0.03]">
                    <td colSpan={4} className="py-2.5 px-4 sm:px-6 font-bold text-[11px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono">
                      6. Marketing, Discounts & Data
                    </td>
                  </tr>
                  <tr className="hover:bg-zinc-50 dark:hover:bg-white/[0.01] transition">
                    <td className="py-3 px-4 sm:px-6 font-medium text-zinc-900 dark:text-zinc-200">Discount & Coupon Engine (Flat & Percent)</td>
                    <td className="py-3 px-3 sm:px-6 text-center text-zinc-400">—</td>
                    <td className="py-3 px-3 sm:px-6 text-center text-emerald-500 bg-emerald-500/5"><Check className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3 px-3 sm:px-6 text-center text-emerald-500"><Check className="w-4 h-4 mx-auto" /></td>
                  </tr>
                  <tr className="hover:bg-zinc-50 dark:hover:bg-white/[0.01] transition">
                    <td className="py-3 px-4 sm:px-6 font-medium text-zinc-900 dark:text-zinc-200">Abandoned Cart WhatsApp 1-Click Recovery</td>
                    <td className="py-3 px-3 sm:px-6 text-center text-emerald-500"><Check className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3 px-3 sm:px-6 text-center text-emerald-500 bg-emerald-500/5"><Check className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3 px-3 sm:px-6 text-center text-emerald-500"><Check className="w-4 h-4 mx-auto" /></td>
                  </tr>
                  <tr className="hover:bg-zinc-50 dark:hover:bg-white/[0.01] transition">
                    <td className="py-3 px-4 sm:px-6 font-medium text-zinc-900 dark:text-zinc-200">Bulk CSV Product Import & Export</td>
                    <td className="py-3 px-3 sm:px-6 text-center text-emerald-500"><Check className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3 px-3 sm:px-6 text-center text-emerald-500 bg-emerald-500/5"><Check className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3 px-3 sm:px-6 text-center text-emerald-500"><Check className="w-4 h-4 mx-auto" /></td>
                  </tr>
                  <tr className="hover:bg-zinc-50 dark:hover:bg-white/[0.01] transition">
                    <td className="py-3 px-4 sm:px-6 font-medium text-zinc-900 dark:text-zinc-200">Bulk Accounting Orders & Customer Export</td>
                    <td className="py-3 px-3 sm:px-6 text-center text-zinc-400">—</td>
                    <td className="py-3 px-3 sm:px-6 text-center text-emerald-500 bg-emerald-500/5"><Check className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3 px-3 sm:px-6 text-center text-emerald-500"><Check className="w-4 h-4 mx-auto" /></td>
                  </tr>

                  {/* Category 7: Support & Service SLA */}
                  <tr className="bg-zinc-100/60 dark:bg-white/[0.03]">
                    <td colSpan={4} className="py-2.5 px-4 sm:px-6 font-bold text-[11px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono">
                      7. Support & Service SLA
                    </td>
                  </tr>
                  <tr className="hover:bg-zinc-50 dark:hover:bg-white/[0.01] transition">
                    <td className="py-3 px-4 sm:px-6 font-medium text-zinc-900 dark:text-zinc-200">Customer Support Service Level</td>
                    <td className="py-3 px-3 sm:px-6 text-center text-zinc-600 dark:text-zinc-400">Community & Docs</td>
                    <td className="py-3 px-3 sm:px-6 text-center font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/5">Priority 24/7 Support</td>
                    <td className="py-3 px-3 sm:px-6 text-center font-bold text-zinc-950 dark:text-white">VIP Dedicated Manager</td>
                  </tr>
                  <tr className="hover:bg-zinc-50 dark:hover:bg-white/[0.01] transition">
                    <td className="py-3 px-4 sm:px-6 font-medium text-zinc-900 dark:text-zinc-200">Guaranteed Cloud SLA Uptime</td>
                    <td className="py-3 px-3 sm:px-6 text-center text-zinc-600 dark:text-zinc-400">99.9% Uptime</td>
                    <td className="py-3 px-3 sm:px-6 text-center font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/5">99.95% High Avail</td>
                    <td className="py-3 px-3 sm:px-6 text-center font-bold text-zinc-950 dark:text-white">99.99% Enterprise</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── 8. Frequently Asked Questions (FAQ) ────────────────────────────── */}
      <section id="faq" className="relative overflow-hidden py-16 sm:py-20 lg:py-20 border-b border-zinc-200/80 dark:border-white/[0.08] scroll-mt-16 transition-colors">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10 w-full my-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-xl mx-auto space-y-2.5 sm:space-y-3"
          >
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-500 dark:text-emerald-400">
              Questions & Answers
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight leading-tight bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-600 dark:from-white dark:via-zinc-100 dark:to-zinc-400/80 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
              Everything you need to know about setting up, launching, and operating your store.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="luxury-card rounded-3xl p-5 sm:p-8 divide-y divide-zinc-200 dark:divide-white/[0.08]"
          >
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div key={index} className="py-3.5 first:pt-0 last:pb-0">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between text-left focus:outline-none group"
                  >
                    <span className="font-bold text-sm text-zinc-900 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-zinc-400 dark:text-zinc-500 transition-transform duration-200 ${
                        isOpen ? "transform rotate-180 text-emerald-500 dark:text-emerald-400" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="mt-2.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ─── 9. Final Call to Action ────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-20 border-b border-zinc-200/80 dark:border-white/[0.08] transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="luxury-card rounded-3xl p-8 sm:p-14 text-center space-y-6 relative overflow-hidden"
          >
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[750px] h-[280px] bg-gradient-to-b from-emerald-500/[0.10] to-transparent rounded-full blur-3xl pointer-events-none" />
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight relative leading-tight text-zinc-950 dark:text-white">
              Ready to{" "}
              <span className="text-emerald-500 dark:text-emerald-400">
                launch your store?
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed relative">
              Start selling in minutes with 30 curated templates, 1-page checkout, automated courier dispatch, and platform dropshipping.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5 relative">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 text-xs font-bold px-7 py-3.5 rounded-xl btn-glass-primary transition btn-press"
                >
                  <span>Start Free Store (৳0 Upfront)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/store/apex-fashion/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 text-xs font-semibold bg-white hover:bg-zinc-50 border border-zinc-200/90 text-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:border-white/[0.08] dark:text-zinc-200 px-6 py-3.5 rounded-xl transition shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                >
                  <span>Explore Merchant Dashboard</span>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── 10. Platform Directory Footer ──────────────────────────────────── */}
      <PlatformFooter />
    </div>
  );
}
