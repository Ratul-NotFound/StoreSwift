/**
 * Plan limits and subscription gating — source of truth for all feature enforcement.
 * Applied at API level (not just UI) for real production security.
 */

export type PlanId = "free" | "medium" | "pro";

export interface PlanConfig {
  name:             string;
  priceBdt:         number;          // monthly price in BDT
  maxProducts:      number | null;   // null = unlimited
  commissionRate:   number;          // % taken per sale (0 for Pro)
  customDomain:     boolean;
  dropshipping:     boolean;
  advancedAnalytics: boolean;
  apiAccess:        boolean;
  maxStaff:         number;          // staff accounts allowed
  courierIntegrations: number;       // number of courier APIs
  pixelsIntegrations: boolean;
  emailNotifications: boolean;
}

export const PLAN_LIMITS: Record<PlanId, PlanConfig> = {
  free: {
    name:                 "Free",
    priceBdt:             0,
    maxProducts:          50,
    commissionRate:       8,
    customDomain:         false,
    dropshipping:         true,
    advancedAnalytics:    false,
    apiAccess:            false,
    maxStaff:             0,
    courierIntegrations:  1,
    pixelsIntegrations:   false,
    emailNotifications:   false,
  },
  medium: {
    name:                 "Medium",
    priceBdt:             499,
    maxProducts:          500,
    commissionRate:       3,
    customDomain:         true,
    dropshipping:         true,
    advancedAnalytics:    false,
    apiAccess:            false,
    maxStaff:             2,
    courierIntegrations:  2,
    pixelsIntegrations:   true,
    emailNotifications:   true,
  },
  pro: {
    name:                 "Pro",
    priceBdt:             999,
    maxProducts:          null,
    commissionRate:       0,
    customDomain:         true,
    dropshipping:         true,
    advancedAnalytics:    true,
    apiAccess:            true,
    maxStaff:             10,
    courierIntegrations:  3,
    pixelsIntegrations:   true,
    emailNotifications:   true,
  },
};

export const PLAN_PRICES: Record<PlanId, number> = {
  free:   0,
  medium: 499,
  pro:    999,
};

/**
 * Validate that a plan string is a known PlanId.
 */
export function isValidPlan(plan: string): plan is PlanId {
  return plan === "free" || plan === "medium" || plan === "pro";
}

/**
 * Get plan config with safe fallback to "free".
 */
export function getPlanConfig(plan: string | null | undefined): PlanConfig {
  if (!plan || !isValidPlan(plan)) return PLAN_LIMITS.free;
  return PLAN_LIMITS[plan];
}

/**
 * Calculate commission amount for a given plan and order total.
 * Returns 0 for Pro plan.
 */
export function calculateCommission(plan: PlanId, orderAmountBdt: number): number {
  if (!orderAmountBdt || orderAmountBdt <= 0 || !Number.isFinite(orderAmountBdt)) return 0;
  const rate = PLAN_LIMITS[plan].commissionRate;
  if (rate <= 0) return 0;
  return Math.round(((orderAmountBdt * rate) / 100) * 100) / 100;
}

/**
 * Check if a store can add more products given their plan.
 * Returns { allowed: true } or { allowed: false, limit: number }
 */
export function checkProductLimit(
  plan: PlanId,
  currentProductCount: number
): { allowed: boolean; limit: number | null; current: number } {
  const config = PLAN_LIMITS[plan];
  if (config.maxProducts === null) {
    return { allowed: true, limit: null, current: currentProductCount };
  }
  return {
    allowed: currentProductCount < config.maxProducts,
    limit: config.maxProducts,
    current: currentProductCount,
  };
}

/**
 * Check if a feature is available for a given plan.
 * Throws a descriptive error if not.
 */
export function assertFeature(
  plan: PlanId,
  feature: keyof Pick<PlanConfig, "customDomain" | "dropshipping" | "advancedAnalytics" | "apiAccess" | "pixelsIntegrations">
): void {
  const config = PLAN_LIMITS[plan];
  if (!config[feature]) {
    const required = feature === "customDomain"    ? "Medium" :
                     feature === "dropshipping"    ? "Medium" :
                     feature === "apiAccess"       ? "Pro"    :
                     feature === "advancedAnalytics" ? "Pro"  : "Medium";
    throw new PlanLimitError(
      `This feature requires the ${required} plan or higher. You are on the ${config.name} plan.`,
      feature,
      plan
    );
  }
}

export class PlanLimitError extends Error {
  constructor(
    message: string,
    public readonly feature: string,
    public readonly currentPlan: PlanId
  ) {
    super(message);
    this.name = "PlanLimitError";
  }
}

