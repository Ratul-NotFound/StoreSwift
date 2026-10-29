export interface StockDeductionResult {
  success: boolean;
  newStock: number;
  error?: string;
}

export function verifyAndDeductStock(
  variantId: string,
  currentStock: number,
  requestedQty: number
): StockDeductionResult {
  if (requestedQty <= 0) {
    return {
      success: false,
      newStock: currentStock,
      error: "Requested quantity must be at least 1."
    };
  }

  if (currentStock < requestedQty) {
    return {
      success: false,
      newStock: currentStock,
      error: "Insufficient stock available for this item."
    };
  }

  return {
    success: true,
    newStock: currentStock - requestedQty
  };
}

