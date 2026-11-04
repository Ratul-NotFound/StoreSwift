"use client";

/**
 * Fashion Storefront Unified Re-Export
 *
 * Directs minimal / fashion traffic cleanly to MinimalStorefront (Minimal Atelier).
 * Retires legacy multi-dock theme switches to ensure only ONE unified TemplateSwitcherBar
 * is mounted across the entire StoreSwift platform.
 */

export {
  MinimalStorefront as FashionStorefront,
  type MinimalStorefrontProps as FashionStorefrontProps
} from "./minimal-storefront";
export { MinimalStorefront } from "./minimal-storefront";
