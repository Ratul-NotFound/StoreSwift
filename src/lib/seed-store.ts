import { getCategoryConfig } from "../config/categories";

export interface SeedProduct {
  storeId: string;
  title: string;
  slug: string;
  description: string;
  basePrice: string;
  imageUrl?: string;
  secondaryImage?: string;
  badge?: string;
  rating?: number;
  isPublished: boolean;
}

export interface SeedVariant {
  storeId: string;
  productSlug: string;
  title: string;
  sku: string;
  price: string;
  inventoryQuantity: number;
  options: Record<string, string>;
}

export interface SeedData {
  products: SeedProduct[];
  variants: SeedVariant[];
}

export function generateStoreSeedData(storeId: string, category: string): SeedData {
  const config = getCategoryConfig(category);
  const products: SeedProduct[] = [];
  const variants: SeedVariant[] = [];

  for (const sample of config.sampleProducts) {
    products.push({
      storeId,
      title: sample.title,
      slug: sample.slug,
      description: sample.description,
      basePrice: sample.basePrice,
      imageUrl: sample.imageUrl,
      secondaryImage: sample.secondaryImage,
      badge: sample.badge,
      rating: sample.rating,
      isPublished: true
    });

    const optionKeys = Object.keys(sample.options);
    if (optionKeys.length > 0) {
      const firstKey = optionKeys[0];
      const values = sample.options[firstKey];
      for (const val of values) {
        variants.push({
          storeId,
          productSlug: sample.slug,
          title: `${firstKey}: ${val}`,
          sku: `${sample.slug.slice(0, 3).toUpperCase()}-${val.replace(/\s+/g, "").toUpperCase()}`,
          price: sample.basePrice,
          inventoryQuantity: 25,
          options: { [firstKey]: val }
        });
      }
    } else {
      variants.push({
        storeId,
        productSlug: sample.slug,
        title: "Standard",
        sku: `${sample.slug.slice(0, 4).toUpperCase()}-STD`,
        price: sample.basePrice,
        inventoryQuantity: 50,
        options: {}
      });
    }
  }

  return { products, variants };
}
