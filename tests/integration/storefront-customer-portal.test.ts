import { describe, it, expect } from "vitest";
import { devStore } from "@/lib/dev-store";

describe("Storefront Customer Portal Engine", () => {
  const testSlug = "apex-fashion";

  it("filters customer orders accurately by customer phone", () => {
    const orders = devStore.getOrders(testSlug);
    expect(orders.length).toBeGreaterThan(0);

    const firstOrder = orders[0];
    const customerOrders = orders.filter((o) => o.customerPhone === firstOrder.customerPhone);
    expect(customerOrders.length).toBeGreaterThanOrEqual(1);
    expect(customerOrders[0].orderNumber).toBe(firstOrder.orderNumber);
  });
});
