import { createProductSvgDataUri } from "./product-illustrations";

export interface CategoryConfig {
  id: string;
  name: string;
  tagline: string;
  iconName?: string;
  heroImage?: string;
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
    tagline: "Trending styles, modern fits, and premium fabrics.",
    iconName: "Shirt",
    heroImage: createProductSvgDataUri("Fashion & Apparel", "Autumn Collection", "#18181b", "#27272a", "tshirt"),
    defaultOptions: ["Size", "Color"],
    sampleProducts: [
      {
        title: "Classic Cotton Crewneck T-Shirt",
        slug: "classic-cotton-tshirt",
        description: "100% combed organic cotton t-shirt with durable ribbed collar and breathable weave.",
        basePrice: "24.99",
        imageUrl: createProductSvgDataUri("Classic Cotton Crewneck", "Fashion & Apparel", "#f4f4f5", "#e4e4e7", "tshirt"),
        badge: "Best Seller",
        rating: 4.9,
        options: { Size: ["S", "M", "L"], Color: ["Black", "White"] }
      },
      {
        title: "Slim-Fit Denim Jeans",
        slug: "slim-fit-denim-jeans",
        description: "Comfort-stretch raw indigo denim with a tailored modern taper and reinforced rivets.",
        basePrice: "59.99",
        imageUrl: createProductSvgDataUri("Slim-Fit Denim Jeans", "Fashion & Apparel", "#eff6ff", "#dbeafe", "jeans"),
        badge: "Trending",
        rating: 4.8,
        options: { Size: ["30", "32", "34"], Color: ["Dark Indigo"] }
      },
      {
        title: "Everyday Canvas Sneaker",
        slug: "everyday-canvas-sneaker",
        description: "Breathable heavy-canvas sneakers with vulcanized rubber sole and cushioned insoles.",
        basePrice: "45.00",
        imageUrl: createProductSvgDataUri("Everyday Canvas Sneaker", "Fashion & Apparel", "#fffbeb", "#fef3c7", "sneaker"),
        badge: "Essential",
        rating: 4.9,
        options: { Size: ["8", "9", "10", "11"], Color: ["Off-White"] }
      }
    ]
  },
  electronics: {
    id: "electronics",
    name: "Electronics & Tech",
    tagline: "Cutting-edge gadgets, components, and accessories.",
    iconName: "Headphones",
    heroImage: createProductSvgDataUri("Electronics & Tech", "Hardware & Audio", "#0f172a", "#1e293b", "headphones"),
    defaultOptions: ["Storage", "Color"],
    sampleProducts: [
      {
        title: "Wireless ANC Bluetooth Headphones",
        slug: "wireless-anc-headphones",
        description: "Active noise cancelling with 40-hour battery life, high-res audio, and spatial audio.",
        basePrice: "89.99",
        imageUrl: createProductSvgDataUri("Wireless ANC Headphones", "Electronics & Tech", "#f8fafc", "#e2e8f0", "headphones"),
        badge: "Top Rated",
        rating: 4.9,
        options: { Color: ["Matte Black", "Silver"] }
      },
      {
        title: "USB-C Fast Charging Hub (6-in-1)",
        slug: "usb-c-charging-hub-6-in-1",
        description: "Dual 4K HDMI, 100W Power Delivery, and Gigabit Ethernet in an aluminum chassis.",
        basePrice: "39.99",
        imageUrl: createProductSvgDataUri("USB-C Fast Charging Hub", "Electronics & Tech", "#f1f5f9", "#cbd5e1", "hub"),
        badge: "Essential",
        rating: 4.7,
        options: { Color: ["Space Gray"] }
      },
      {
        title: "Mechanical Gaming Keyboard RGB",
        slug: "mechanical-gaming-keyboard-rgb",
        description: "Hot-swappable tactile switches with per-key RGB backlighting and PBT keycaps.",
        basePrice: "74.50",
        imageUrl: createProductSvgDataUri("Mechanical Gaming Keyboard", "Electronics & Tech", "#0f172a", "#1e293b", "keyboard"),
        badge: "Popular",
        rating: 4.8,
        options: { Switch: ["Red Linear", "Brown Tactile"] }
      }
    ]
  },
  grocery_food: {
    id: "grocery_food",
    name: "Food & Grocery",
    tagline: "Farm-fresh produce, pantry essentials, and gourmet foods.",
    iconName: "Apple",
    heroImage: createProductSvgDataUri("Food & Grocery", "Artisan Pantry", "#451a03", "#78350f", "coffee"),
    defaultOptions: ["Pack Size"],
    sampleProducts: [
      {
        title: "Organic Fair-Trade Coffee Beans (500g)",
        slug: "organic-coffee-beans-500g",
        description: "Single-origin medium roast with notes of dark chocolate, citrus, and sweet honey.",
        basePrice: "16.50",
        imageUrl: createProductSvgDataUri("Organic Coffee Beans", "Food & Grocery", "#fef3c7", "#fde68a", "coffee"),
        badge: "Organic",
        rating: 5.0,
        options: { "Grind Type": ["Whole Bean", "Ground Espresso"] }
      },
      {
        title: "Raw Wildflower Mountain Honey",
        slug: "raw-wildflower-honey",
        description: "100% pure unfiltered raw wildflower honey harvested from high alpine meadows.",
        basePrice: "12.00",
        imageUrl: createProductSvgDataUri("Raw Wildflower Honey", "Food & Grocery", "#fffbeb", "#fef3c7", "honey"),
        badge: "Natural",
        rating: 4.9,
        options: { Weight: ["250g", "500g"] }
      },
      {
        title: "Artisan Extra Virgin Olive Oil (750ml)",
        slug: "artisan-extra-virgin-olive-oil",
        description: "Cold-pressed extra virgin olive oil from early harvest hand-picked Koroneiki olives.",
        basePrice: "22.00",
        imageUrl: createProductSvgDataUri("Artisan Olive Oil", "Food & Grocery", "#f7fee7", "#ecfccb", "oil"),
        badge: "Gourmet",
        rating: 4.9,
        options: { Volume: ["750ml"] }
      }
    ]
  },
  beauty_cosmetics: {
    id: "beauty_cosmetics",
    name: "Beauty & Cosmetics",
    tagline: "Clean skincare, natural cosmetics, and wellness rituals.",
    iconName: "Sparkles",
    heroImage: createProductSvgDataUri("Beauty & Cosmetics", "Clean Skincare", "#881337", "#9f1239", "serum"),
    defaultOptions: ["Volume"],
    sampleProducts: [
      {
        title: "Hyaluronic Acid Hydrating Facial Serum",
        slug: "hyaluronic-acid-serum",
        description: "Multi-depth hydration with botanical squalane and B5 for plump, glowing skin.",
        basePrice: "28.00",
        imageUrl: createProductSvgDataUri("Hyaluronic Acid Serum", "Beauty & Care", "#f0f9ff", "#e0f2fe", "serum"),
        badge: "Clean Beauty",
        rating: 4.9,
        options: { Size: ["30ml", "50ml"] }
      },
      {
        title: "Nourishing Botanical Body Balm",
        slug: "botanical-body-balm",
        description: "Raw shea butter and cold-pressed jojoba balm for intensive moisture barrier repair.",
        basePrice: "34.00",
        imageUrl: createProductSvgDataUri("Botanical Body Balm", "Beauty & Care", "#fff1f2", "#ffe4e6", "balm"),
        badge: "Cruelty-Free",
        rating: 4.8,
        options: { Scent: ["Vanilla Bloom", "Unscented"] }
      },
      {
        title: "Gentle Foaming Gel Cleanser",
        slug: "gentle-foaming-gel-cleanser",
        description: "Sulfate-free pH-balanced daily foaming cleanser with green tea and chamomile extracts.",
        basePrice: "19.50",
        imageUrl: createProductSvgDataUri("Gentle Foaming Cleanser", "Beauty & Care", "#f0fdfa", "#ccfbf1", "cleanser"),
        badge: "Dermatologist Tested",
        rating: 4.9,
        options: { Volume: ["150ml"] }
      }
    ]
  }
};

export const ALL_CATEGORIES = Object.keys(CATEGORIES_MAP);

export function getCategoryConfig(categoryKey: string): CategoryConfig {
  return CATEGORIES_MAP[categoryKey] || CATEGORIES_MAP.fashion;
}
