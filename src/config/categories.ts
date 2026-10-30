import { createProductSvgDataUri } from "./product-illustrations";

export interface CategoryConfig {
  id: string;
  name: string;
  tagline: string;
  iconName?: string;
  heroImage?: string;
  recommendedTemplate: string;
  defaultOptions: string[];
  sampleProducts: Array<{
    title: string;
    slug: string;
    description: string;
    basePrice: string;
    imageUrl?: string;
    badge?: string;
    rating?: number;
    options: Record<string, string[]>;
  }>;
}

export const CATEGORIES_MAP: Record<string, CategoryConfig> = {
  fashion: {
    id: "fashion",
    name: "Fashion & Apparel",
    tagline: "Trending streetwear, modern fits, and premium organic fabrics.",
    iconName: "Shirt",
    recommendedTemplate: "minimal",
    heroImage: createProductSvgDataUri("Clothing & Apparel", "Autumn 2026 Collection", "#18181b", "#27272a", "tshirt"),
    defaultOptions: ["Size", "Color"],
    sampleProducts: [
      {
        title: "Heavyweight Cotton Oversized Tee",
        slug: "heavyweight-cotton-oversized-tee",
        description: "280 GSM combed organic cotton with relaxed drop-shoulder cut and ribbed collar.",
        basePrice: "28.00",
        imageUrl: createProductSvgDataUri("Heavyweight Oversized Tee", "Clothing & Apparel", "#f4f4f5", "#e4e4e7", "tshirt"),
        badge: "Best Seller",
        rating: 4.9,
        options: { Size: ["S", "M", "L", "XL"], Color: ["Pitch Black", "Washed Slate", "Bone White"] }
      },
      {
        title: "Relaxed Taper Denim Jeans",
        slug: "relaxed-taper-denim-jeans",
        description: "13.5oz Japanese selvedge denim with comfortable tailored taper and antique brass hardware.",
        basePrice: "68.00",
        imageUrl: createProductSvgDataUri("Relaxed Taper Denim", "Clothing & Apparel", "#eff6ff", "#dbeafe", "jeans"),
        badge: "Trending",
        rating: 4.8,
        options: { Size: ["30", "32", "34", "36"], Color: ["Raw Indigo", "Faded Stonewash"] }
      },
      {
        title: "French Terry Raglan Hoodie",
        slug: "french-terry-raglan-hoodie",
        description: "Ultra-dense 450 GSM French terry hoodie with double-lined hood and seamless kangaroo pouch.",
        basePrice: "62.00",
        imageUrl: createProductSvgDataUri("French Terry Hoodie", "Clothing & Apparel", "#fafaf9", "#e7e5e4", "tshirt"),
        badge: "Essential",
        rating: 5.0,
        options: { Size: ["M", "L", "XL"], Color: ["Heather Grey", "Onyx"] }
      }
    ]
  },
  shoes: {
    id: "shoes",
    name: "Footwear & Shoes",
    tagline: "Performance sneakers, handcrafted leather boots, and everyday loafers.",
    iconName: "Footprints",
    recommendedTemplate: "artisan",
    heroImage: createProductSvgDataUri("Footwear & Shoes", "Master Craftsman Series", "#78350f", "#451a03", "boot"),
    defaultOptions: ["Shoe Size", "Color"],
    sampleProducts: [
      {
        title: "Pro-Stride Cloud Running Sneaker",
        slug: "pro-stride-cloud-running-sneaker",
        description: "Zero-gravity foam cushioning with engineered breathable knit upper and carbon torsion plate.",
        basePrice: "115.00",
        imageUrl: createProductSvgDataUri("Pro-Stride Cloud Sneaker", "Footwear & Shoes", "#f0f9ff", "#bae6fd", "sneaker"),
        badge: "Top Rated",
        rating: 4.9,
        options: { "Shoe Size": ["8", "9", "10", "11", "12"], Color: ["Electric Ice", "Triple Black"] }
      },
      {
        title: "Artisan Leather Chelsea Boot",
        slug: "artisan-leather-chelsea-boot",
        description: "Full-grain pull-up leather boot with Goodyear welt construction and durable Vibram sole.",
        basePrice: "165.00",
        imageUrl: createProductSvgDataUri("Artisan Chelsea Boot", "Footwear & Shoes", "#fffbeb", "#fde68a", "boot"),
        badge: "Heritage",
        rating: 5.0,
        options: { "Shoe Size": ["8", "9", "10", "11"], Color: ["Dark Cognac", "Espresso"] }
      },
      {
        title: "Classic Penny Loafer Suede",
        slug: "classic-penny-loafer-suede",
        description: "Velvety Italian calfskin suede loafer with padded leather footbed and rubber heel cap.",
        basePrice: "98.00",
        imageUrl: createProductSvgDataUri("Classic Penny Loafer", "Footwear & Shoes", "#fef3c7", "#fde68a", "loafer"),
        badge: "Trending",
        rating: 4.8,
        options: { "Shoe Size": ["8", "9", "10", "11"], Color: ["Tobacco Suede", "Navy"] }
      }
    ]
  },
  beauty_cosmetics: {
    id: "beauty_cosmetics",
    name: "Beauty & Cosmetics",
    tagline: "Clean botanical skincare, velvet lip pigments, and nourishing daily rituals.",
    iconName: "Sparkles",
    recommendedTemplate: "glow",
    heroImage: createProductSvgDataUri("Beauty & Cosmetics", "Clean Organic Beauty", "#881337", "#9f1239", "serum"),
    defaultOptions: ["Shade", "Volume"],
    sampleProducts: [
      {
        title: "Pure Glow Hyaluronic Dew Serum",
        slug: "pure-glow-hyaluronic-dew-serum",
        description: "Multi-weight triple hyaluronic acid infused with snow mushroom and niacinamide for radiant glass skin.",
        basePrice: "34.00",
        imageUrl: createProductSvgDataUri("Pure Glow Dew Serum", "Beauty & Care", "#fff1f2", "#ffe4e6", "serum"),
        badge: "Clean Beauty",
        rating: 4.9,
        options: { Volume: ["30ml Dropper", "60ml Value"] }
      },
      {
        title: "Velvet Matte Moisture Lipstick",
        slug: "velvet-matte-moisture-lipstick",
        description: "Hydrating high-pigment matte formula enriched with camellia oil and vitamin E for 12-hour comfortable wear.",
        basePrice: "24.00",
        imageUrl: createProductSvgDataUri("Velvet Matte Lipstick", "Beauty & Care", "#ffe4e6", "#fecdd3", "lipstick"),
        badge: "Award Winner",
        rating: 5.0,
        options: { Shade: ["Ruby Whisper", "Berry Nude", "Terracotta Glow"] }
      },
      {
        title: "Botanical Restorative Body Balm",
        slug: "botanical-restorative-body-balm",
        description: "Whipped shea butter, jojoba, and cold-pressed rosehip oil to soothe and reinforce your skin barrier.",
        basePrice: "29.50",
        imageUrl: createProductSvgDataUri("Restorative Body Balm", "Beauty & Care", "#f0fdf4", "#dcfce7", "balm"),
        badge: "Derm Approved",
        rating: 4.8,
        options: { Scent: ["Vanilla Sandalwood", "Unscented Pure"] }
      }
    ]
  },
  electronics: {
    id: "electronics",
    name: "Electronics & Tech",
    tagline: "Precision acoustic headphones, pro gaming peripherals, and high-speed hubs.",
    iconName: "Headphones",
    recommendedTemplate: "bold",
    heroImage: createProductSvgDataUri("Electronics & Tech", "Next-Gen Audio & Gear", "#0f172a", "#1e293b", "headphones"),
    defaultOptions: ["Color", "Storage"],
    sampleProducts: [
      {
        title: "Spatial Pro ANC Wireless Headphones",
        slug: "spatial-pro-anc-headphones",
        description: "Hybrid active noise cancellation with 40mm beryllium drivers and 45-hour ultra-fast battery.",
        basePrice: "94.00",
        imageUrl: createProductSvgDataUri("Spatial Pro Headphones", "Electronics & Tech", "#f8fafc", "#e2e8f0", "headphones"),
        badge: "Top Rated",
        rating: 4.9,
        options: { Color: ["Space Gray", "Silver Frost", "Midnight Blue"] }
      },
      {
        title: "ThunderLink 7-in-1 Aluminum USB-C Hub",
        slug: "thunderlink-7-in-1-usb-c-hub",
        description: "Dual 4K@60Hz HDMI, 100W PD passthrough charging, Gigabit LAN, and high-speed SD card readers.",
        basePrice: "44.00",
        imageUrl: createProductSvgDataUri("ThunderLink USB-C Hub", "Electronics & Tech", "#f1f5f9", "#cbd5e1", "hub"),
        badge: "Essential",
        rating: 4.8,
        options: { Color: ["Anodized Gray", "Matte Black"] }
      },
      {
        title: "Quantum 75% Mechanical Gaming Keyboard",
        slug: "quantum-mechanical-keyboard",
        description: "Gasket-mounted hot-swap PCB with pre-lubed linear switches and double-shot PBT keycaps.",
        basePrice: "89.00",
        imageUrl: createProductSvgDataUri("Quantum Gaming Keyboard", "Electronics & Tech", "#0f172a", "#1e293b", "keyboard"),
        badge: "Popular",
        rating: 5.0,
        options: { Switches: ["Red Linear (Silent)", "Brown Tactile"] }
      }
    ]
  },
  jewelry: {
    id: "jewelry",
    name: "Jewelry & Luxury",
    tagline: "Timeless sapphire chronographs, 18k solid gold signets, and bespoke gems.",
    iconName: "Watch",
    recommendedTemplate: "minimal",
    heroImage: createProductSvgDataUri("Jewelry & Luxury", "Bespoke Horology", "#1c1917", "#292524", "watch"),
    defaultOptions: ["Material", "Size"],
    sampleProducts: [
      {
        title: "Heritage Automatic Sapphire Watch",
        slug: "heritage-automatic-sapphire-watch",
        description: "Japanese 24-jewel automatic movement with scratch-resistant sapphire crystal and Italian leather strap.",
        basePrice: "185.00",
        imageUrl: createProductSvgDataUri("Heritage Sapphire Watch", "Jewelry & Luxury", "#fffbeb", "#fef3c7", "watch"),
        badge: "Limited Edition",
        rating: 5.0,
        options: { Strap: ["Italian Tan Leather", "Steel Mesh"] }
      },
      {
        title: "18k Gold Plated Signet Ring",
        slug: "18k-gold-plated-signet-ring",
        description: "Solid 925 sterling silver layered with 2.5 microns of 18k gold for lasting shine.",
        basePrice: "65.00",
        imageUrl: createProductSvgDataUri("18k Gold Signet Ring", "Jewelry & Luxury", "#fef3c7", "#fde68a", "watch"),
        badge: "Handcrafted",
        rating: 4.9,
        options: { "Ring Size": ["7", "8", "9", "10", "11"] }
      },
      {
        title: "Titanium Polarized Aviator Sunglasses",
        slug: "titanium-polarized-aviator",
        description: "Featherweight Japanese titanium frames with UV400 anti-reflective polarized lenses.",
        basePrice: "79.00",
        imageUrl: createProductSvgDataUri("Titanium Aviator", "Jewelry & Luxury", "#f8fafc", "#e2e8f0", "watch"),
        badge: "Essential",
        rating: 4.8,
        options: { Finish: ["Gold & Green", "Gunmetal & Smoke"] }
      }
    ]
  },
  grocery_food: {
    id: "grocery_food",
    name: "Food & Grocery",
    tagline: "Single-origin mountain coffees, raw wildflower honeys, and organic delicacies.",
    iconName: "Coffee",
    recommendedTemplate: "artisan",
    heroImage: createProductSvgDataUri("Food & Grocery", "Artisan Farmstead", "#451a03", "#78350f", "coffee"),
    defaultOptions: ["Pack Size"],
    sampleProducts: [
      {
        title: "Single-Origin Ethiopian Yirgacheffe Coffee",
        slug: "ethiopian-yirgacheffe-coffee",
        description: "Direct-trade micro-lot with floral jasmine aroma, bergamot citrus, and honey finish.",
        basePrice: "18.50",
        imageUrl: createProductSvgDataUri("Ethiopian Coffee Micro-Lot", "Food & Grocery", "#fef3c7", "#fde68a", "coffee"),
        badge: "Direct Trade",
        rating: 5.0,
        options: { "Grind Type": ["Whole Bean", "Ground Espresso", "Coarse French Press"] }
      },
      {
        title: "Raw Alpine Wildflower Honey (500g)",
        slug: "raw-alpine-wildflower-honey",
        description: "Unheated, unfiltered mountain honey collected from pristine high-altitude wildflowers.",
        basePrice: "14.00",
        imageUrl: createProductSvgDataUri("Raw Wildflower Honey", "Food & Grocery", "#fffbeb", "#fef3c7", "honey"),
        badge: "100% Pure",
        rating: 4.9,
        options: { Size: ["250g Jar", "500g Value"] }
      },
      {
        title: "First Cold-Pressed Koroneiki Olive Oil",
        slug: "cold-pressed-koroneiki-olive-oil",
        description: "Early-harvest Greek olive oil boasting exceptionally high polyphenols and peppery finish.",
        basePrice: "24.00",
        imageUrl: createProductSvgDataUri("Koroneiki Extra Virgin Oil", "Food & Grocery", "#f7fee7", "#ecfccb", "oil"),
        badge: "Gourmet",
        rating: 5.0,
        options: { Volume: ["500ml Glass", "1L Tin"] }
      }
    ]
  }
};

export const ALL_CATEGORIES = Object.keys(CATEGORIES_MAP);

export function getCategoryConfig(categoryKey: string): CategoryConfig {
  const clean = (categoryKey || "").toLowerCase().trim();
  // Alias mapping
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
