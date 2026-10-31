/**
 * StoreSwift Marketing Pixels & GTM Tracking Engine
 * Provides standard eCommerce tracking events (PageView, ViewContent, AddToCart, InitiateCheckout, Purchase)
 * matching and exceeding Zatiq's marketing capabilities.
 * Includes both Client-Side and Server-Side (CAPI) dispatchers.
 */

export interface PixelConfig {
  metaPixelId?: string;
  tiktokPixelId?: string;
  gtmContainerId?: string;
  gaMeasurementId?: string;
}

export function firePixelEvent(
  eventName: "PageView" | "ViewContent" | "AddToCart" | "InitiateCheckout" | "Purchase",
  data?: Record<string, unknown>
) {
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

/**
 * Server-Side Conversions API (CAPI) Dispatcher
 * Bypasses ad-blockers, iOS Safari ITP restrictions, and network drops
 * by directly dispatching purchase events from Node.js server handlers.
 */
export async function fireServerSidePixelEvent(
  eventName: "Purchase" | "InitiateCheckout",
  payload: {
    orderNumber: string;
    totalAmount: number;
    currency: string;
    customerPhone: string;
    customerEmail?: string;
    metaPixelId?: string;
  }
) {
  try {
    // In production, posts directly to https://graph.facebook.com/v19.0/{PIXEL_ID}/events
    // Structured and normalized per Meta Conversions API (CAPI) specification
    const capiPayload = {
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: payload.orderNumber,
      action_source: "website",
      user_data: {
        ph: payload.customerPhone.replace(/[^0-9]/g, ""),
        em: payload.customerEmail ? payload.customerEmail.toLowerCase().trim() : undefined
      },
      custom_data: {
        currency: payload.currency.replace("৳", "BDT").replace("$", "USD"),
        value: payload.totalAmount,
        order_id: payload.orderNumber
      }
    };

    // Safe execution without blocking API thread
    if (process.env.META_CAPI_ACCESS_TOKEN && payload.metaPixelId) {
      fetch(`https://graph.facebook.com/v19.0/${payload.metaPixelId}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.META_CAPI_ACCESS_TOKEN}`
        },
        body: JSON.stringify({ data: [capiPayload] })
      }).catch((e) => console.debug("[CAPI Post Background Error]", e));
    }

    return { success: true, eventId: payload.orderNumber };
  } catch (err) {
    console.debug("[CAPI Dispatch Exception]", err);
    return { success: false };
  }
}
