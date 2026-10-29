export interface CategoryConfig {
  id: string;
  name: string;
  tagline: string;
  iconName: string;
  defaultOptions: string[];
  sampleProducts: Array<{
    title: string;
    slug: string;
    description: string;
    basePrice: string;
    compareAtPrice?: string;
    rating: number;
    reviewsCount: number;
    imageUrl: string;
    options: Record<string, string[]>;
  }>;
}

export const CATEGORIES_MAP: Record<string, CategoryConfig> = {
  fashion: {
    id: "fashion",
    name: "Fashion & Apparel",
    tagline: "Trending styles, modern fits, and premium fabrics.",
    iconName: "Shirt",
    defaultOptions: ["Size", "Color"],
    sampleProducts: [
      {
        title: "Heavyweight Cotton Oversized Tee",
        slug: "heavyweight-cotton-oversized-tee",
        description: "240 GSM combed organic cotton with relaxed drop-shoulder silhouette and reinforced collar.",
        basePrice: "29.00",
        compareAtPrice: "38.00",
        rating: 4.9,
        reviewsCount: 128,
        imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
        options: { Size: ["S", "M", "L", "XL"], Color: ["Washed Black", "Vintage White", "Sage Green"] }
      },
      {
        title: "Selvedge Raw Denim Jacket",
        slug: "selvedge-raw-denim-jacket",
        description: "13.5oz Japanese selvedge denim, copper button hardware, and tailored modern fit.",
        basePrice: "89.00",
        compareAtPrice: "115.00",
        rating: 5.0,
        reviewsCount: 84,
        imageUrl: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80",
        options: { Size: ["M", "L", "XL"], Color: ["Raw Indigo"] }
      },
      {
        title: "Retro Runner Suede Sneakers",
        slug: "retro-runner-suede-sneakers",
        description: "Italian calfskin suede panels with ergonomic EVA midsole and vulcanized gum outsole.",
        basePrice: "75.00",
        compareAtPrice: "95.00",
        rating: 4.8,
        reviewsCount: 62,
        imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80",
        options: { Size: ["8", "9", "10", "11"], Color: ["Pecan Tan", "Slate Gray"] }
      }
    ]
  },
  electronics: {
    id: "electronics",
    name: "Electronics & Tech",
    tagline: "High-performance gadgets, smart audio, and desk setup accessories.",
    iconName: "Headphones",
    defaultOptions: ["Storage", "Color"],
    sampleProducts: [
      {
        title: "StudioPro Wireless ANC Headphones",
        slug: "studiopro-wireless-anc-headphones",
        description: "Adaptive hybrid noise cancellation, 40mm beryllium drivers, and 45-hour playback with fast-charge.",
        basePrice: "149.00",
        compareAtPrice: "189.00",
        rating: 4.9,
        reviewsCount: 210,
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
        options: { Color: ["Midnight Matte", "Silver Frost"] }
      },
      {
        title: "Aluminum 8-in-1 Dual 4K USB-C Hub",
        slug: "aluminum-8-in-1-usb-c-hub",
        description: "Dual 4K@60Hz HDMI, 100W Power Delivery pass-through, UHS-II SD reader, and Gigabit Ethernet.",
        basePrice: "59.00",
        compareAtPrice: "75.00",
        rating: 4.7,
        reviewsCount: 95,
        imageUrl: "https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=800&auto=format&fit=crop&q=80",
        options: { Color: ["Space Gray"] }
      },
      {
        title: "Wireless Mechanical 75% Keyboard",
        slug: "wireless-mechanical-keyboard-75",
        description: "Gasket-mounted hot-swap PCB, pre-lubed linear switches, and dye-sub PBT keycaps with RGB.",
        basePrice: "119.00",
        compareAtPrice: "139.00",
        rating: 5.0,
        reviewsCount: 142,
        imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
        options: { Switch: ["Red Linear", "Brown Tactile"] }
      }
    ]
  },
  grocery_food: {
    id: "grocery_food",
    name: "Food & Gourmet Grocery",
    tagline: "Single-origin roasts, artisan pantry staples, and farm-fresh goods.",
    iconName: "Coffee",
    defaultOptions: ["Pack Size"],
    sampleProducts: [
      {
        title: "Single-Origin Ethiopian Yirgacheffe Beans",
        slug: "ethiopian-yirgacheffe-beans-500g",
        description: "Naturally processed Arabica coffee with delicate floral notes, bergamot, and sweet stone fruit.",
        basePrice: "18.50",
        compareAtPrice: "22.00",
        rating: 4.9,
        reviewsCount: 77,
        imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80",
        options: { "Grind Type": ["Whole Bean", "Filter Grind", "Espresso"] }
      },
      {
        title: "Cold-Pressed Early Harvest Olive Oil (750ml)",
        slug: "cold-pressed-early-harvest-olive-oil",
        description: "Ultra-low acidity (<0.2%) extra virgin olive oil from single-estate Koroneiki olives.",
        basePrice: "26.00",
        compareAtPrice: "32.00",
        rating: 4.8,
        reviewsCount: 51,
        imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&auto=format&fit=crop&q=80",
        options: { Volume: ["750ml", "1.5L Reserve"] }
      },
      {
        title: "Raw Wildflower Mountain Honey (500g)",
        slug: "raw-wildflower-mountain-honey",
        description: "Unfiltered, unpasteurized honey harvested from high-altitude alpine meadows.",
        basePrice: "14.50",
        compareAtPrice: "17.00",
        rating: 5.0,
        reviewsCount: 39,
        imageUrl: "https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=800&auto=format&fit=crop&q=80",
        options: { Weight: ["500g", "1kg Jar"] }
      }
    ]
  },
  beauty_cosmetics: {
    id: "beauty_cosmetics",
    name: "Beauty & Clean Skincare",
    tagline: "Dermatologist-tested serums, botanical balms, and natural wellness.",
    iconName: "Sparkles",
    defaultOptions: ["Volume"],
    sampleProducts: [
      {
        title: "Triple Hyaluronic Acid Glow Serum",
        slug: "triple-hyaluronic-glow-serum",
        description: "Multi-molecular weight hyaluronic acid formulated with niacinamide and green tea extract for deep hydration.",
        basePrice: "34.00",
        compareAtPrice: "42.00",
        rating: 4.9,
        reviewsCount: 168,
        imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80",
        options: { Size: ["30ml", "50ml Jumbo"] }
      },
      {
        title: "Nourishing Ceramide Barrier Balm",
        slug: "nourishing-ceramide-barrier-balm",
        description: "Biomimetic ceramides, squalane, and colloidal oat to strengthen and restore sensitized skin barriers.",
        basePrice: "28.00",
        compareAtPrice: "35.00",
        rating: 4.8,
        reviewsCount: 94,
        imageUrl: "https://images.unsplash.com/photo-1608248597359-573523f6c8d7?w=800&auto=format&fit=crop&q=80",
        options: { Formula: ["Original", "Unscented Sensitive"] }
      },
      {
        title: "Botanical Botanical Gel Cleanser",
        slug: "botanical-gel-cleanser",
        description: "Sulfate-free pH 5.5 foaming gel infused with chamomile and calendula for clean, refreshed skin.",
        basePrice: "22.00",
        compareAtPrice: "26.00",
        rating: 4.7,
        reviewsCount: 58,
        imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
        options: { Volume: ["150ml"] }
      }
    ]
  }
};

export const ALL_CATEGORIES = Object.keys(CATEGORIES_MAP);

export function getCategoryConfig(categoryKey: string): CategoryConfig {
  return CATEGORIES_MAP[categoryKey] || CATEGORIES_MAP.fashion;
}
