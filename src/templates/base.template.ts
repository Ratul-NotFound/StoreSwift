import {
  IStoreTemplate,
  StoreTemplateId,
  StoreTemplateVibe,
  StoreTemplateClasses,
  TrustManifestoItem,
  DesignPhilosophy
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

  abstract getManifestoPillars(): TrustManifestoItem[];
  abstract getDesignPhilosophy(): DesignPhilosophy;
  abstract formatHeroBadge(categoryName: string): string;
  abstract formatProductBadge(rawBadge?: string): string;
  abstract getHeroLayoutType(): "architectural" | "ethereal" | "cyber" | "heritage";

  public formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  public calculateDiscount(price: number, comparePrice: number): number {
    if (!comparePrice || comparePrice <= price) return 0;
    return Math.round(((comparePrice - price) / comparePrice) * 100);
  }

  public getScarcityUrgency(remainingUnits: number = 5): string {
    return `Limited Allocation: Only ${remainingUnits} units remaining in current batch`;
  }

  public getProductCardAspect(): string {
    return "aspect-[3/4]";
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
      classes: this.classes
    };
  }
}

