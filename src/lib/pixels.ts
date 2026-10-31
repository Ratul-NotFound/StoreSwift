/**
 * StoreSwift Marketing Pixels & GTM Tracking Engine
 * Provides standard eCommerce tracking events (PageView, ViewContent, AddToCart, InitiateCheckout, Purchase)
 * matching and exceeding Zatiq's marketing capabilities.
 */

export interface PixelConfig {
  metaPixelId?: string;
  tiktokPixelId?: string;
  gtmContainerId?: string;
  gaMeasurementId?: string;
}

export function firePixelEvent(eventName: "PageView" | "ViewContent" | "AddToCart" | "InitiateCheckout" | "Purchase", data?: Record<string, unknown>) {
  if (typeof window === "undefined") return;

  // 1. Meta (Facebook) Pixel
  try {
    const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq;
    if (typeof fbq === "function") {
      fbq("track", eventName, data);
    }
  } catch (e) {
    console.debug("[Meta Pixel Event Ignored]", e);
  }

  // 2. TikTok Pixel
  try {
    const ttq = (window as unknown as { ttq?: { track?: (...args: unknown[]) => void } }).ttq;
    if (ttq && typeof ttq.track === "function") {
      ttq.track(eventName, data);
    }
  } catch (e) {
    console.debug("[TikTok Pixel Event Ignored]", e);
  }

  // 3. Google Tag Manager / GA4 dataLayer
  try {
    const dataLayer = (window as unknown as { dataLayer?: unknown[] }).dataLayer;
    if (Array.isArray(dataLayer)) {
      dataLayer.push({
        event: eventName,
        ecommerce: data,
        timestamp: new Date().toISOString()
      });
    }
  } catch (e) {
    console.debug("[GTM DataLayer Ignored]", e);
  }
}
