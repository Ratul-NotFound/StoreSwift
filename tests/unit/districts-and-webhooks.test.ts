import { describe, it, expect } from "vitest";
import { BANGLADESH_DISTRICTS, resolveZoneFromDistrict, CHECKOUT_I18N } from "@/config/districts";
import { resolveTenantFromHost } from "@/middleware";
import { POST as handleCourierWebhook } from "@/app/api/couriers/webhooks/route";

describe("District Resolution, Bilingual I18n & Courier Webhooks", () => {
  it("provides comprehensive coverage of Bangladesh districts", () => {
    expect(BANGLADESH_DISTRICTS.length).toBeGreaterThanOrEqual(60);
    const dhaka = BANGLADESH_DISTRICTS.find((d) => d.id === "dhaka");
    expect(dhaka).toBeDefined();
    expect(dhaka?.nameBN).toBe("ঢাকা");
    expect(dhaka?.popularUpazilas).toContain("Dhanmondi");
  });

  it("automatically resolves delivery zone based on district", () => {
    expect(resolveZoneFromDistrict("dhaka")).toBe("metro");
    expect(resolveZoneFromDistrict("gazipur")).toBe("suburbs");
    expect(resolveZoneFromDistrict("savar")).toBe("suburbs");
    expect(resolveZoneFromDistrict("chattogram")).toBe("national");
    expect(resolveZoneFromDistrict("sylhet")).toBe("national");
    expect(resolveZoneFromDistrict("unknown-district")).toBe("national");
  });

  it("provides complete bilingual dictionary for English and Bengali", () => {
    expect(CHECKOUT_I18N.en.title).toContain("Express Checkout");
    expect(CHECKOUT_I18N.bn.title).toContain("এক্সপ্রেস চেকআউট");
    expect(CHECKOUT_I18N.bn.inspectionGuarantee).toContain("পার্সেল");
    expect(CHECKOUT_I18N.bn.cod).toContain("ক্যাশ অন ডেলিভারি");
  });

  it("sanitizes malicious host headers in edge middleware", () => {
    // Malicious host with injection characters
    const res = resolveTenantFromHost("store<script>alert(1)</script>.platform.com", "platform.com");
    expect(res.tenantSlug).not.toContain("<script>");

    // Localhost and 127.0.0.1
    expect(resolveTenantFromHost("localhost").type).toBe("platform");
    expect(resolveTenantFromHost("127.0.0.1").type).toBe("platform");
  });

  it("handles incoming courier webhooks and updates fulfillment status", async () => {
    const mockRequest = new Request("https://storeswift.app/api/couriers/webhooks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider: "steadfast",
        consignmentId: "ST-892401",
        orderNumber: "SS-ORD-101",
        status: "delivered",
        codCollected: 1850
      })
    });

    const response = await handleCourierWebhook(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.updatedFulfillmentStatus).toBe("Delivered");
    expect(data.updatedPaymentStatus).toBe("paid");
  });
});

