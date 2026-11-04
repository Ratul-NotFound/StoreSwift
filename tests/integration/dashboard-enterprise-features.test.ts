import { describe, it, expect } from "vitest";
import { devStore } from "@/lib/dev-store";

describe("Merchant Dashboard Enterprise Features Integration", () => {
  const testSlug = "apex-fashion";

  it("provides all necessary metrics for enterprise dashboard tabs", () => {
    const overview = devStore.getStoreOverview(testSlug);
    expect(overview.name).toBeDefined();

    const staff = devStore.getStaff(testSlug);
    expect(Array.isArray(staff)).toBe(true);
    expect(staff.some((s) => s.role === "owner")).toBe(true);

    const abandoned = devStore.getAbandonedCarts(testSlug);
    expect(Array.isArray(abandoned)).toBe(true);

    const audit = devStore.getAuditEvents(testSlug);
    expect(Array.isArray(audit)).toBe(true);

    const notifs = devStore.getNotifications(testSlug);
    expect(Array.isArray(notifs)).toBe(true);
  });
});
