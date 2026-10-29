export function buildTenantFilter(storeId: string): { storeId: string } {
  if (!storeId || typeof storeId !== "string" || storeId.trim().length === 0) {
    throw new Error("storeId is required for tenant isolation");
  }
  return { storeId: storeId.trim() };
}
