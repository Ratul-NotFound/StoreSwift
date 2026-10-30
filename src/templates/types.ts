export type StoreTemplateId = "minimal" | "glow" | "bold" | "artisan";

export interface StoreTemplateVibe {
  fontDisplay: string;
  borderRadius: string;
  heroStyle: "split" | "luminous" | "cyber" | "heritage";
  cardElevation: string;
  badgeStyle: string;
}

export interface StoreTemplateClasses {
  pageBg: string;
  headerBg: string;
  navPillBg: string;
  toolbarBg: string;
  lookbookBg: string;
  heroSection: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  editorialTag: string;
  productCard: string;
  productCardImg: string;
  primaryButton: string;
  secondaryButton: string;
  pillActive: string;
  pillInactive: string;
  accentText: string;
  announcementBar: string;
  featureCard: string;
  spotlightBanner: string;
}

export interface TrustManifestoItem {
  index: string;
  category: string;
  title: string;
  description: string;
  highlight?: boolean;
}

export interface DesignPhilosophy {
  ethos: string;
  typography: string;
  materialsFocus: string;
  curationQuote: string;
}

export interface IStoreTemplate {
  readonly id: StoreTemplateId;
  readonly name: string;
  readonly tagline: string;
  readonly categoryFit: string;
  readonly description: string;
  readonly badge: string;
  readonly previewBg: string;
  readonly primaryColor: string;
  readonly accentColor: string;
  readonly vibe: StoreTemplateVibe;
  readonly classes: StoreTemplateClasses;

  getManifestoPillars(): TrustManifestoItem[];
  getDesignPhilosophy(): DesignPhilosophy;
  formatHeroBadge(categoryName: string): string;
  formatProductBadge(rawBadge?: string): string;
  formatPrice(price: number): string;
  calculateDiscount(price: number, comparePrice: number): number;
  getScarcityUrgency(remainingUnits?: number): string;
  getProductCardAspect(): string;
  getHeroLayoutType(): "architectural" | "ethereal" | "cyber" | "heritage";
}

