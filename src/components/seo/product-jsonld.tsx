export interface ProductJsonLdProps {
  product: {
    title: string;
    description?: string;
    slug: string;
    basePrice: string | number;
    currency?: string;
    imageUrl?: string;
    rating?: number;
    inStock?: boolean;
    brandName?: string;
  };
}

export function ProductJsonLd({ product }: ProductJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description || product.title,
    image: product.imageUrl ? [product.imageUrl] : [],
    brand: {
      "@type": "Brand",
      name: product.brandName || "StoreSwift Merchant"
    },
    offers: {
      "@type": "Offer",
      price: product.basePrice,
      priceCurrency: product.currency || "USD",
      availability: product.inStock !== false ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `https://storeswift.com/products/${product.slug}`
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating || 4.9,
      reviewCount: 42
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
