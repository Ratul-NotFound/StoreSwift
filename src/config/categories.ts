import { createProductSvgDataUri } from "./product-illustrations";

export interface CategoryConfig {
  id: string;
  name: string;
  tagline: string;
  editorialSubtitle?: string;
  iconName?: string;
  heroImage: string;
  recommendedTemplate: string;
  defaultOptions: string[];
  sampleProducts: Array<{
    title: string;
    slug: string;
    description: string;
    basePrice: string;
    imageUrl: string;
    secondaryImage?: string;
    badge?: string;
    rating?: number;
    options: Record<string, string[]>;
  }>;
}

export const CATEGORIES_MAP: Record<string, CategoryConfig> = {
  fashion: {
    id: "fashion",
    name: "Fashion & Apparel",
    tagline: "Uncompromising textiles, architectural silhouettes, and modern fits.",
    editorialSubtitle: "STUDIO ARCHIVE 2026 • COMPILED WITH CERTIFIED ORGANIC YARNS",
    iconName: "Shirt",
    recommendedTemplate: "minimal",
    heroImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=85",
    defaultOptions: ["Size", "Color"],
    sampleProducts: [
      {
        title: "Heavyweight Organic Oversized Tee",
        slug: "heavyweight-cotton-oversized-tee",
        description: "280 GSM combed organic cotton with relaxed drop-shoulder cut, blind-stitched hem, and durable ribbed collar.",
        basePrice: "34.00",
        imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&auto=format&fit=crop&q=85",
        secondaryImage: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1000&auto=format&fit=crop&q=85",
        badge: "Essential Drop",
        rating: 4.9,
        options: { Size: ["S", "M", "L", "XL"], Color: ["Pitch Black", "Washed Slate", "Bone White"] }
      },
      {
        title: "Japanese Selvedge Taper Denim",
        slug: "relaxed-taper-denim-jeans",
        description: "13.5oz Kurabo raw indigo selvedge denim with tailored modern taper and hand-hammered antique copper rivets.",
        basePrice: "98.00",
        imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1000&auto=format&fit=crop&q=85",
        secondaryImage: "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=1000&auto=format&fit=crop&q=85",
        badge: "Selvedge Denim",
        rating: 5.0,
        options: { Size: ["30", "32", "34", "36"], Color: ["Raw Indigo", "Faded Stonewash"] }
      },
      {
        title: "French Terry 450GSM Raglan Hoodie",
        slug: "french-terry-raglan-hoodie",
        description: "Ultra-dense custom loopback French terry hoodie with double-walled hood and seamless zero-chafing kangaroo pocket.",
        basePrice: "85.00",
        imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1000&auto=format&fit=crop&q=85",
        secondaryImage: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=1000&auto=format&fit=crop&q=85",
        badge: "Winter Heavyweight",
        rating: 4.9,
        options: { Size: ["M", "L", "XL"], Color: ["Heather Grey", "Onyx Black"] }
      }
    ]
  },
  shoes: {
    id: "shoes",
    name: "Footwear & Shoes",
    tagline: "Performance kinetics, handcrafted pull-up leathers, and heritage silhouettes.",
    editorialSubtitle: "BUILT FOR LIFELONG COMFORT • GOODYEAR WELTED CRAFTSMANSHIP",
    iconName: "Footprints",
    recommendedTemplate: "artisan",
    heroImage: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1600&auto=format&fit=crop&q=85",
    defaultOptions: ["Shoe Size", "Color"],
    sampleProducts: [
      {
        title: "Pro-Stride Carbon Running Sneaker",
        slug: "pro-stride-cloud-running-sneaker",
        description: "Dynamic dual-density nitrogen foam sole with engineered breathable monomesh upper and carbon torsion propulsion plate.",
        basePrice: "145.00",
        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&auto=format&fit=crop&q=85",
        secondaryImage: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1000&auto=format&fit=crop&q=85",
        badge: "Propulsion Plate",
        rating: 4.9,
        options: { "Shoe Size": ["8", "9", "10", "11", "12"], Color: ["Electric Crimson", "Triple Onyx"] }
      },
      {
        title: "Full-Grain Leather Chelsea Boot",
        slug: "artisan-leather-chelsea-boot",
        description: "Handcrafted Horween Chromexcel leather with 360-degree storm welt and resoleable Vibram lug outsole.",
        basePrice: "210.00",
        imageUrl: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=1000&auto=format&fit=crop&q=85",
        secondaryImage: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=1000&auto=format&fit=crop&q=85",
        badge: "Goodyear Welted",
        rating: 5.0,
        options: { "Shoe Size": ["8", "9", "10", "11"], Color: ["Espresso Brown", "Midnight Black"] }
      },
      {
        title: "Italian Velour Suede Penny Loafer",
        slug: "classic-penny-loafer-suede",
        description: "Buttery soft Tuscan calfskin suede with unlined breathable vamp and cushioned memory foam footbed.",
        basePrice: "128.00",
        imageUrl: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=1000&auto=format&fit=crop&q=85",
        secondaryImage: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=1000&auto=format&fit=crop&q=85",
        badge: "Italian Suede",
        rating: 4.8,
        options: { "Shoe Size": ["8", "9", "10", "11"], Color: ["Tobacco Tan", "Navy Blue"] }
      }
    ]
  },
  beauty_cosmetics: {
    id: "beauty_cosmetics",
    name: "Beauty & Cosmetics",
    tagline: "Pure botanical extractions, lipid barrier repair, and velvet matte pigments.",
    editorialSubtitle: "CLEAN BOTANICAL LABS • DERMATOLOGICALLY PROVEN FORMULATIONS",
    iconName: "Sparkles",
    recommendedTemplate: "glow",
    heroImage: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1600&auto=format&fit=crop&q=85",
    defaultOptions: ["Volume", "Shade"],
    sampleProducts: [
      {
        title: "Pure Glow Triple Hyaluronic Dew Serum",
        slug: "pure-glow-hyaluronic-dew-serum",
        description: "Multi-depth molecular hyaluronic acid infused with Tremella mushroom, niacinamide, and prebiotic squalane for glass-skin hydration.",
        basePrice: "42.00",
        imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1000&auto=format&fit=crop&q=85",
        secondaryImage: "https://images.unsplash.com/photo-1608248597359-38c2020e26b1?w=1000&auto=format&fit=crop&q=85",
        badge: "Clean Beauty",
        rating: 5.0,
        options: { Volume: ["30ml Amber Dropper", "60ml Refill"] }
      },
      {
        title: "Velvet Satin Moisture Lipstick",
        slug: "velvet-matte-moisture-lipstick",
        description: "Weightless buildable pigment enriched with camellia flower oil and hyaluronic spheres for zero-feathering all-day comfort.",
        basePrice: "28.00",
        imageUrl: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=1000&auto=format&fit=crop&q=85",
        secondaryImage: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1000&auto=format&fit=crop&q=85",
        badge: "Allure Best of Beauty",
        rating: 4.9,
        options: { Shade: ["Ruby Whisper", "Berry Nude", "Terracotta Rose"] }
      },
      {
        title: "Whipped Botanical Lipid Barrier Balm",
        slug: "botanical-restorative-body-balm",
        description: "Cold-pressed rosehip seed butter, ceramides, and calendula extract that melts into skin for intense overnight barrier reinforcement.",
        basePrice: "36.00",
        imageUrl: "https://images.unsplash.com/photo-1608248597359-38c2020e26b1?w=1000&auto=format&fit=crop&q=85",
        secondaryImage: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1000&auto=format&fit=crop&q=85",
        badge: "Barrier Rescue",
        rating: 4.9,
        options: { Scent: ["Vanilla Sandalwood", "Fragrance Free"] }
      }
    ]
  },
  electronics: {
    id: "electronics",
    name: "Electronics & Tech",
    tagline: "Acoustic precision, tactile mechanical switches, and aerospace-grade chassis.",
    editorialSubtitle: "PRECISION HARDWARE ARCHITECTURE • HIGH-RES WIRELESS AUDIO",
    iconName: "Headphones",
    recommendedTemplate: "bold",
    heroImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1600&auto=format&fit=crop&q=85",
    defaultOptions: ["Color", "Storage"],
    sampleProducts: [
      {
        title: "Acoustic Pro Hybrid ANC Wireless Headphones",
        slug: "spatial-pro-anc-headphones",
        description: "40mm custom beryllium drivers with lossless Bluetooth 5.4, multi-microphone spatial beamforming, and 45h battery life.",
        basePrice: "169.00",
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop&q=85",
        secondaryImage: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=1000&auto=format&fit=crop&q=85",
        badge: "Beryllium Drivers",
        rating: 5.0,
        options: { Color: ["Matte Obsidian", "Brushed Silver", "Midnight Navy"] }
      },
      {
        title: "ThunderLink 7-in-1 CNC Aluminum Hub",
        slug: "thunderlink-7-in-1-usb-c-hub",
        description: "Dual 4K@60Hz HDMI, 100W Power Delivery 3.0 passthrough, Gigabit Ethernet, and 10Gbps USB 3.2 in a single block of milled aluminum.",
        basePrice: "58.00",
        imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=1000&auto=format&fit=crop&q=85",
        secondaryImage: "https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=1000&auto=format&fit=crop&q=85",
        badge: "10Gbps Transfer",
        rating: 4.8,
        options: { Color: ["Space Gray Anodized", "Silver Frost"] }
      },
      {
        title: "Quantum 75% Gasket-Mounted Mechanical Keyboard",
        slug: "quantum-mechanical-keyboard",
        description: "Polycarbonate plate with PORON dampening foam, factory pre-lubed linear switches, hot-swap sockets, and PBT dye-sub keycaps.",
        basePrice: "119.00",
        imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1000&auto=format&fit=crop&q=85",
        secondaryImage: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=1000&auto=format&fit=crop&q=85",
        badge: "Gasket Mounted",
        rating: 4.9,
        options: { Switches: ["Red Linear 45g (Silent)", "Brown Tactile 55g"] }
      }
    ]
  },
  jewelry: {
    id: "jewelry",
    name: "Jewelry & Luxury",
    tagline: "Swiss automatic horology, solid recycled gold, and optical grade titanium.",
    editorialSubtitle: "HEIRLOOM QUALITY PIECES • INDIVIDUALLY NUMBERED ATELIER EDITIONS",
    iconName: "Watch",
    recommendedTemplate: "minimal",
    heroImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&auto=format&fit=crop&q=85",
    defaultOptions: ["Material", "Size"],
    sampleProducts: [
      {
        title: "Heritage 39mm Automatic Sapphire Chronograph",
        slug: "heritage-automatic-sapphire-watch",
        description: "28,800 vph automatic caliber with exhibition caseback, anti-reflective domed sapphire, and Italian hand-stitched leather strap.",
        basePrice: "240.00",
        imageUrl: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=1000&auto=format&fit=crop&q=85",
        secondaryImage: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1000&auto=format&fit=crop&q=85",
        badge: "Numbered Edition",
        rating: 5.0,
        options: { Strap: ["Italian Tan Leather", "Brushed Mesh Steel"] }
      },
      {
        title: "18k Heavy Gold-Vermeil Signet Ring",
        slug: "18k-gold-plated-signet-ring",
        description: "Solid 925 sterling silver base plated with 3.0 microns of 18k yellow gold with satin brushed face for custom monogramming.",
        basePrice: "88.00",
        imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1000&auto=format&fit=crop&q=85",
        secondaryImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1000&auto=format&fit=crop&q=85",
        badge: "18k Gold Vermeil",
        rating: 4.9,
        options: { "Ring Size": ["7", "8", "9", "10", "11"] }
      },
      {
        title: "Beta-Titanium Polarized Aviators",
        slug: "titanium-polarized-aviator",
        description: "Laser-cut 14-gram aerospace titanium frame with nylon polarized lenses offering 100% UV400 and hydrophobic oleophobic coating.",
        basePrice: "115.00",
        imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1000&auto=format&fit=crop&q=85",
        secondaryImage: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1000&auto=format&fit=crop&q=85",
        badge: "14g Ultra-Light",
        rating: 4.8,
        options: { Finish: ["Brushed 18k Gold", "Matte Gunmetal"] }
      }
    ]
  },
  grocery_food: {
    id: "grocery_food",
    name: "Food & Grocery",
    tagline: "Single-origin micro-lots, alpine raw honey, and cold-pressed estate olive oil.",
    editorialSubtitle: "ARTISANAL ESTATE BOTTLING • REGENERATIVE FARMSTEAD SOURCING",
    iconName: "Coffee",
    recommendedTemplate: "artisan",
    heroImage: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1600&auto=format&fit=crop&q=85",
    defaultOptions: ["Pack Size"],
    sampleProducts: [
      {
        title: "Single-Origin Yirgacheffe Heirloom Coffee (1kg)",
        slug: "ethiopian-yirgacheffe-coffee",
        description: "Direct-trade natural processed coffee roasted in small batches with notes of bergamot citrus, candied peach, and dark cacao.",
        basePrice: "24.50",
        imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1000&auto=format&fit=crop&q=85",
        secondaryImage: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=1000&auto=format&fit=crop&q=85",
        badge: "Direct Trade Micro-Lot",
        rating: 5.0,
        options: { "Grind Type": ["Whole Bean (Recommended)", "Ground Espresso", "Coarse French Press"] }
      },
      {
        title: "Raw Wild Alpine High-Meadow Honey (500g)",
        slug: "raw-alpine-wildflower-honey",
        description: "Unfiltered, unheated raw honey harvested at 2,200m elevation from wild alpine flora with natural propolis and pollen intact.",
        basePrice: "18.00",
        imageUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=1000&auto=format&fit=crop&q=85",
        secondaryImage: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=1000&auto=format&fit=crop&q=85",
        badge: "100% Raw Alpine",
        rating: 4.9,
        options: { Size: ["250g Glass Jar", "500g Stone Crock"] }
      },
      {
        title: "Early-Harvest Koroneiki Extra Virgin Olive Oil",
        slug: "cold-pressed-koroneiki-olive-oil",
        description: "Single-estate early harvest from hand-picked green Koroneiki olives cold-pressed within 4 hours. Acidity below 0.18%.",
        basePrice: "29.00",
        imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=1000&auto=format&fit=crop&q=85",
        secondaryImage: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=1000&auto=format&fit=crop&q=85",
        badge: "High Polyphenol",
        rating: 5.0,
        options: { Volume: ["500ml Dark UV Glass", "1L Kitchen Tin"] }
      }
    ]
  }
};

export const ALL_CATEGORIES = Object.keys(CATEGORIES_MAP);

export function getCategoryConfig(categoryKey: string): CategoryConfig {
  const clean = (categoryKey || "").toLowerCase().trim();
  if (clean === "shoes" || clean === "footwear" || clean === "sneakers") {
    return CATEGORIES_MAP.shoes;
  }
  if (clean === "cosmetics" || clean === "beauty" || clean === "skincare") {
    return CATEGORIES_MAP.beauty_cosmetics;
  }
  if (clean === "apparel" || clean === "clothing" || clean === "fashion") {
    return CATEGORIES_MAP.fashion;
  }
  if (clean === "tech" || clean === "gadgets" || clean === "electronics") {
    return CATEGORIES_MAP.electronics;
  }
  if (clean === "jewelry" || clean === "accessories" || clean === "luxury") {
    return CATEGORIES_MAP.jewelry;
  }
  if (clean === "food" || clean === "grocery" || clean === "grocery_food") {
    return CATEGORIES_MAP.grocery_food;
  }

  return CATEGORIES_MAP[clean] || CATEGORIES_MAP.fashion;
}
