export interface AnalyticsEvent {
  event: "view_item" | "add_to_cart" | "remove_from_cart" | "initiate_checkout" | "purchase" | "merchant_onboarding_step";
  storeId?: string;
  properties?: Record<string, unknown>;
  timestamp?: number;
}

export function trackEvent(
  event: AnalyticsEvent["event"],
  properties: Record<string, unknown> = {},
  storeId?: string
) {
  if (typeof window === "undefined") return;

  const payload: AnalyticsEvent = {
    event,
    storeId,
    properties,
    timestamp: Date.now()
  };

  try {
    // Send event asynchronously via Beacon API or fetch
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/analytics", JSON.stringify(payload));
    } else {
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(() => {});
    }
  } catch {
    // Graceful no-op on telemetry failure
  }
}
