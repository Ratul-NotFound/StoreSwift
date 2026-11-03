export interface FashionSubTemplateProps {
  storeDisplayName: string;
  tenantSlug: string;
  displayedCatalog: any[];
  cartItems: any[];
  wishlist: string[];
  finalTotal: number;
  currency: "USD" | "EUR" | "GBP";
  formatPrice: (amount: number) => string;
  activeDepartment: string;
  setActiveDepartment: (dept: string) => void;
  activeTab: "trending" | "new" | "bestsellers" | "sale";
  setActiveTab: (tab: "trending" | "new" | "bestsellers" | "sale") => void;
  priceFilter: string;
  setPriceFilter: (p: any) => void;
  sizeFilter: string;
  setSizeFilter: (s: string) => void;
  sortBy: string;
  setSortBy: (s: string) => void;
  selectedColors: Record<string, string>;
  handleColorSelect: (productId: string, color: string) => void;
  handleQuickSizeAdd: (product: any, size: string) => void;
  handleOpenQuickView: (product: any) => void;
  onAddToCart: (prod: any, variant: any) => void;
  onToggleWishlist: (productId: string) => void;
  onOpenProduct: (prod: any) => void;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenWishlist?: () => void;
  onOpenCheckout?: () => void;
  onOpenTrackOrder?: () => void;
  setIsSizeGuideOpen: (open: boolean) => void;
  onSelectFashionStyle: (style: "boutique" | "milano" | "trend") => void;
}

