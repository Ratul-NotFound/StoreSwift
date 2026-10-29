export interface CategoryConfig {
  id: string;
  name: string;
  tagline: string;
  defaultOptions: string[];
  sampleProducts: Array<{
    title: string;
    slug: string;
    description: string;
    basePrice: string;
    options: Record<string, string[]>;
  }>;
}

export const CATEGORIES_MAP: Record<string, CategoryConfig> = {
  fashion: {
    id: "fashion",
    name: "Fashion & Apparel",
    tagline: "Trending styles, modern fits, and premium fabrics.",
    defaultOptions: ["Size", "Color"],
    sampleProducts: [
      {
        title: "Classic Cotton Crewneck T-Shirt",
        slug: "classic-cotton-tshirt",
        description: "100% combed organic cotton t-shirt with premium finish.",
        basePrice: "24.99",
        options: { Size: ["S", "M", "L"], Color: ["Black", "White"] }
      },
      {
        title: "Slim-Fit Denim Jeans",
        slug: "slim-fit-denim-jeans",
        description: "Comfort stretch denim with a tailored modern taper.",
        basePrice: "59.99",
        options: { Size: ["30", "32", "34"], Color: ["Dark Indigo"] }
      },
      {
        title: "Everyday Canvas Sneaker",
        slug: "everyday-canvas-sneaker",
        description: "Breathable canvas sneakers with vulcanized rubber sole.",
        basePrice: "45.00",
        options: { Size: ["8", "9", "10", "11"], Color: ["Off-White"] }
      }
    ]
  },
  electronics: {
    id: "electronics",
    name: "Electronics & Tech",
    tagline: "Cutting-edge gadgets, components, and accessories.",
    defaultOptions: ["Storage", "Color"],
    sampleProducts: [
      {
        title: "Wireless ANC Bluetooth Headphones",
        slug: "wireless-anc-headphones",
        description: "Active noise cancelling with 40-hour battery life.",
        basePrice: "89.99",
        options: { Color: ["Matte Black", "Silver"] }
      },
      {
        title: "USB-C Fast Charging Hub (6-in-1)",
        slug: "usb-c-charging-hub-6-in-1",
        description: "Dual 4K HDMI, 100W Power Delivery, and Gigabit Ethernet.",
        basePrice: "39.99",
        options: { Color: ["Space Gray"] }
      },
      {
        title: "Mechanical Gaming Keyboard RGB",
        slug: "mechanical-gaming-keyboard-rgb",
        description: "Hot-swappable tactile switches with per-key RGB backlighting.",
        basePrice: "74.50",
        options: { Switch: ["Red Linear", "Brown Tactile"] }
      }
    ]
  },
  grocery_food: {
    id: "grocery_food",
    name: "Food & Grocery",
    tagline: "Farm-fresh produce, pantry essentials, and gourmet foods.",
    defaultOptions: ["Pack Size"],
    sampleProducts: [
      {
        title: "Organic Fair-Trade Coffee Beans (500g)",
        slug: "organic-coffee-beans-500g",
        description: "Single-origin medium roast with notes of chocolate and citrus.",
        basePrice: "16.50",
        options: { "Grind Type": ["Whole Bean", "Ground Espresso"] }
      },
      {
        title: "Raw Wildflower Mountain Honey",
        slug: "raw-wildflower-honey",
        description: "100% pure unfiltered raw wildflower honey.",
        basePrice: "12.00",
        options: { Weight: ["250g", "500g"] }
      },
      {
        title: "Artisan Extra Virgin Olive Oil (750ml)",
        slug: "artisan-extra-virgin-olive-oil",
        description: "Cold-pressed extra virgin olive oil from early harvest olives.",
        basePrice: "22.00",
        options: { Volume: ["750ml"] }
      }
    ]
  },
  beauty_cosmetics: {
    id: "beauty_cosmetics",
    name: "Beauty & Cosmetics",
    tagline: "Clean skincare, natural cosmetics, and wellness rituals.",
    defaultOptions: ["Volume"],
    sampleProducts: [
      {
        title: "Hyaluronic Acid Hydrating Facial Serum",
        slug: "hyaluronic-acid-serum",
        description: "Multi-depth hydration for plump, glowing skin.",
        basePrice: "28.00",
        options: { Size: ["30ml", "50ml"] }
      },
      {
        title: "Nourishing Botanical Body Balm",
        slug: "botanical-body-balm",
        description: "Shea butter and squalane balm for intensive barrier repair.",
        basePrice: "34.00",
        options: { Scent: ["Vanilla Bloom", "Unscented"] }
      },
      {
        title: "Gentle Foaming Gel Cleanser",
        slug: "gentle-foaming-gel-cleanser",
        description: "Sulfate-free pH-balanced daily foaming cleanser.",
        basePrice: "19.50",
        options: { Volume: ["150ml"] }
      }
    ]
  }
};

export const ALL_CATEGORIES = Object.keys(CATEGORIES_MAP);

export function getCategoryConfig(categoryKey: string): CategoryConfig {
  return CATEGORIES_MAP[categoryKey] || CATEGORIES_MAP.fashion;
}
