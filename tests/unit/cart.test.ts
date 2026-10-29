import { describe, it, expect } from "vitest";
import { calculateCartTotals, CartItem } from "../../src/lib/cart";

describe("Cart Engine & Totals Calculator", () => {
  it("calculates subtotal and item count correctly", () => {
    const items: CartItem[] = [
      { id: "1", title: "Shirt", price: 25.00, quantity: 2 },
      { id: "2", title: "Hat", price: 15.00, quantity: 1 }
    ];

    const summary = calculateCartTotals(items, 100);
    expect(summary.itemCount).toBe(3);
    expect(summary.subtotal).toBe(65.00);
    expect(summary.isFreeShippingEligible).toBe(false);
    expect(summary.amountRemainingForFreeShipping).toBe(35.00);
  });

  it("identifies when free shipping threshold is met", () => {
    const items: CartItem[] = [
      { id: "1", title: "Jacket", price: 120.00, quantity: 1 }
    ];

    const summary = calculateCartTotals(items, 100);
    expect(summary.subtotal).toBe(120.00);
    expect(summary.isFreeShippingEligible).toBe(true);
    expect(summary.amountRemainingForFreeShipping).toBe(0);
  });
});

