import { describe, it, expect } from "vitest";
import {
  DELIVERY_ZONES,
  COURIER_PROVIDERS,
  generateConsignment,
  assessCustomerFraudRisk,
  WHOLESALE_SUPPLIER_CATALOG
} from "@/lib/courier";

describe("Logistics, Courier Automation & Anti-Fraud RTO Shield", () => {
  it("provides complete delivery zones for emerging market fulfillment", () => {
    expect(DELIVERY_ZONES.metro.rateBDT).toBe(60);
    expect(DELIVERY_ZONES.suburbs.rateBDT).toBe(100);
    expect(DELIVERY_ZONES.national.rateBDT).toBe(130);
    expect(DELIVERY_ZONES.metro.eta).toContain("24");
  });

  it("supports Steadfast, Pathao, RedX, and StoreSwift Express courier providers", () => {
    expect(COURIER_PROVIDERS.steadfast.prefix).toBe("ST-");
    expect(COURIER_PROVIDERS.pathao.prefix).toBe("PTH-");
    expect(COURIER_PROVIDERS.redx.prefix).toBe("RDX-");
    expect(COURIER_PROVIDERS.storeswift_express.prefix).toBe("SSX-");
  });

  it("generates courier consignment with barcode and live tracking metadata", () => {
    const order = {
      orderNumber: "SS-ORD-9021",
      customerName: "Tanvir Rahman",
      customerPhone: "+8801711223344",
      shippingAddress: "House 12, Road 4, Sector 7, Uttara, Dhaka",
      totalAmount: 1850,
      currency: "৳"
    };

    const consignment = generateConsignment(order, "steadfast", "metro");
    expect(consignment.consignmentId).toMatch(/^ST-\d{6}$/);
    expect(consignment.courierName).toBe("Steadfast Courier");
    expect(consignment.collectibleAmount).toBe(1850);
    expect(consignment.trackingUrl).toContain(consignment.consignmentId);
    expect(consignment.barcode).toContain(consignment.consignmentId);
    expect(consignment.zone.shortName).toBe("Inside Dhaka");
  });

  it("evaluates customer phone fraud risk and Return-To-Origin (RTO) probability", () => {
    const riskSafe = assessCustomerFraudRisk("+8801799887766");
    expect(riskSafe.score).toBeGreaterThan(0);
    expect(["VERIFIED_SAFE", "MODERATE_RISK", "HIGH_RETURN_RISK"]).toContain(riskSafe.level);
    expect(riskSafe.recommendation).toBeDefined();
  });

  it("supplies a wholesale dropshipping catalog for zero-inventory merchants", () => {
    expect(WHOLESALE_SUPPLIER_CATALOG.length).toBeGreaterThan(0);
    const item = WHOLESALE_SUPPLIER_CATALOG[0];
    expect(item.wholesaleCost).toBeLessThan(item.suggestedRetailPrice);
    expect(item.profitMarginPercent).toBeGreaterThan(40);
  });
});
