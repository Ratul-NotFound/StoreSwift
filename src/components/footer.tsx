"use client";

import { PlatformFooter, DEMO_STORES_LIST } from "./platform-footer";
import { StorefrontFooter, StorefrontFooterProps } from "./store/storefront-footer";

export { PlatformFooter, DEMO_STORES_LIST, StorefrontFooter };

export interface StoreFooterProps extends StorefrontFooterProps {
  isPlatform?: boolean;
}

export function StoreFooter({
  isPlatform = false,
  storeName,
  storeSlug,
  categoryName,
  onOpenTrackOrder
}: StoreFooterProps) {
  if (isPlatform) {
    return <PlatformFooter />;
  }

  return (
    <StorefrontFooter
      storeName={storeName}
      storeSlug={storeSlug}
      categoryName={categoryName}
      onOpenTrackOrder={onOpenTrackOrder}
    />
  );
}
