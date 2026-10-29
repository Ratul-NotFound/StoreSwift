export interface CartItem {
  id: string;
  variantId?: string;
  title: string;
  variantTitle?: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface CartSummary {
  itemCount: number;
  subtotal: number;
  isFreeShippingEligible: boolean;
  amountRemainingForFreeShipping: number;
}

export function calculateCartTotals(
  items: CartItem[],
  freeShippingThreshold = 50
): CartSummary {
  let itemCount = 0;
  let subtotal = 0;

  for (const item of items) {
    const qty = Math.max(0, item.quantity);
    itemCount += qty;
    subtotal += item.price * qty;
  }

  // Round to 2 decimal places
  subtotal = Math.round(subtotal * 100) / 100;
  const isFreeShippingEligible = subtotal >= freeShippingThreshold;
  const amountRemainingForFreeShipping = isFreeShippingEligible
    ? 0
    : Math.max(0, Math.round((freeShippingThreshold - subtotal) * 100) / 100);

  return {
    itemCount,
    subtotal,
    isFreeShippingEligible,
    amountRemainingForFreeShipping
  };
}

