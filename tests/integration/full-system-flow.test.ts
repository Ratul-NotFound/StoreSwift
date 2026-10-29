import { describe, it, expect } from "vitest";
import { isReservedSlug } from "../../src/config/reserved-slugs";
import { generateStoreSeedData } from "../../src/lib/seed-store";
import { generateVariantMatrix } from "../../src/lib/matrix";
import { calculateCartTotals } from "../../src/lib/cart";
import { verifyAndDeductStock } from "../../src/lib/stock";
import { resolveTenantFromHost } from "../../src/middleware";

describe("Complete End-to-End eCommerce Platform Flow", () => {
  it("executes the full startup merchant journey and customer purchase lifecycle", () => {
    // 1. Merchant selects subdomain & category
    const storeSlug = "urban-thread";
    expect(isReservedSlug(storeSlug)).toBe(false);

    // 2. Middleware routes customer request to store
    const resolved = resolveTenantFromHost(`${storeSlug}.platform.com`, "platform.com");
    expect(resolved.type).toBe("store");
    expect(resolved.tenantSlug).toBe(storeSlug);

    // 3. Store seed engine creates instant starter catalog
    const seed = generateStoreSeedData("store-999", "fashion");
    expect(seed.products.length).toBe(3);

    // 4. Merchant creates custom product with Size x Color variant matrix
    const customVariants = generateVariantMatrix("HOODIE", "60.00", {
      Size: ["M", "L"],
      Color: ["Navy"]
    });
    expect(customVariants.length).toBe(2);
    expect(customVariants[0].sku).toBe("HOODIE-M-NAVY");

    // 5. Customer adds items to cart
    const cartItems = [
      { id: "1", title: customVariants[0].title, price: 60.00, quantity: 1 }
    ];
    const cartSummary = calculateCartTotals(cartItems, 50);
    expect(cartSummary.subtotal).toBe(60.00);
    expect(cartSummary.isFreeShippingEligible).toBe(true);

    // 6. Customer completes Cash on Delivery (COD) checkout & stock is reserved
    const initialInventory = 10;
    const checkoutDeduction = verifyAndDeductStock("variant-hoodie-m", initialInventory, 1);
    expect(checkoutDeduction.success).toBe(true);
    expect(checkoutDeduction.newStock).toBe(9);
  });
});
