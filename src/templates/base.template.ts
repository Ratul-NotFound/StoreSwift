import {
  IStoreTemplate,
  StoreTemplateId,
  StoreTemplateVibe,
  StoreTemplateClasses,
  TrustManifestoItem,
  DesignPhilosophy,
  TrustGuarantee,
  ShippingPolicy,
  AnnouncementHighlights
} from "./types";

export abstract class AbstractStoreTemplate implements IStoreTemplate {
  abstract readonly id: StoreTemplateId;
  abstract readonly name: string;
  abstract readonly tagline: string;
  abstract readonly categoryFit: string;
  abstract readonly description: string;
  abstract readonly badge: string;
  abstract readonly previewBg: string;
  abstract readonly primaryColor: string;
  abstract readonly accentColor: string;
  abstract readonly vibe: StoreTemplateVibe;
  abstract readonly classes: StoreTemplateClasses;

  // Polymorphic abstract methods that every concrete template subclass MUST define
  abstract getManifestoPillars(): TrustManifestoItem[];
  abstract getDesignPhilosophy(): DesignPhilosophy;
  abstract formatHeroBadge(categoryName: string): string;
  abstract formatProductBadge(rawBadge?: string): string;
  abstract getHeroLayoutType(): "architectural" | "ethereal" | "cyber" | "heritage" | "opulent" | "organic";
  abstract getCuratedCollectionTitle(): string;
  abstract getBrandSignature(): string;

  // Base methods with robust default implementations (can be overridden polymorphically)
  public formatPrice(price: number, currency: string = "USD"): string {
    const symbolMap: Record<string, string> = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      BDT: "৳",
      INR: "₹",
      CAD: "CA$",
      AUD: "AU$"
    };
    const symbol = symbolMap[currency.toUpperCase()] || "$";
    return `${symbol}${price.toFixed(2)}`;
  }

  public calculateDiscount(price: number, comparePrice: number): number {
    if (!comparePrice || comparePrice <= price) return 0;
    return Math.round(((comparePrice - price) / comparePrice) * 100);
  }

  public getScarcityUrgency(remainingUnits: number = 5): string {
    return `Low Stock: Only ${remainingUnits} units left in stock`;
  }

  public getProductCardAspect(): string {
    return "aspect-[3/4]";
  }

  public getShippingPolicy(): ShippingPolicy {
    return {
      dispatchHours: 48,
      codAllowed: true,
      returnDays: 7,
      inspectionPolicy: "Doorstep inspection enabled. Review your parcel prior to cash payment.",
      thresholdForFree: 50.0
    };
  }

  public getTrustGuarantees(): TrustGuarantee[] {
    return [
      {
        iconName: "Truck",
        title: "Express 48h Dispatch",
        subtitle: "Real-time SMS & courier tracking from fulfillment center"
      },
      {
        iconName: "ShieldCheck",
        title: "Doorstep Cash on Delivery",
        subtitle: "Inspect items in person before completing tender"
      },
      {
        iconName: "RotateCcw",
        title: "7-Day Complimentary Exchange",
        subtitle: "Hassle-free doorstep courier swap for alternative sizing"
      }
    ];
  }

  public getAnnouncementHighlights(): AnnouncementHighlights {
    return {
      leading: "Complimentary 48-Hour Dispatch",
      center: "Free nationwide delivery on orders over $50 • Cash on delivery available",
      trailing: "Authenticity Guaranteed"
    };
  }

  /**
   * Serializes the template to a plain object for JSON serialization / SSR boundaries
   */
  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      tagline: this.tagline,
      categoryFit: this.categoryFit,
      description: this.description,
      badge: this.badge,
      previewBg: this.previewBg,
      primaryColor: this.primaryColor,
      accentColor: this.accentColor,
      vibe: this.vibe,
      classes: this.classes,
      curatedTitle: this.getCuratedCollectionTitle(),
      brandSignature: this.getBrandSignature(),
      shippingPolicy: this.getShippingPolicy()
    };
  }
}
