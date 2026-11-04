import { describe, it, expect } from "vitest";
import { devStore } from "@/lib/dev-store";
import { checkStaffLimit } from "@/lib/plan-limits";

describe("Enterprise SaaS Core Data Models & Store State", () => {
  const testSlug = "apex-fashion";

  it("evaluates staff limits according to plan configuration", () => {
    expect(checkStaffLimit("free", 0).allowed).toBe(false); // 0 extra staff allowed
    expect(checkStaffLimit("free", 0).limit).toBe(0);

    expect(checkStaffLimit("medium", 1).allowed).toBe(true); // limit is 2
    expect(checkStaffLimit("medium", 2).allowed).toBe(false);

    expect(checkStaffLimit("pro", 5).allowed).toBe(true); // limit is 10
    expect(checkStaffLimit("pro", 10).allowed).toBe(false);
  });

  it("manages store staff members with role assignments and deletion safeguards", () => {
    const initialStaff = devStore.getStaff(testSlug);
    expect(Array.isArray(initialStaff)).toBe(true);

    const newStaff = devStore.addStaff(testSlug, {
      name: "Tariqul Islam",
      email: "tariq@example.com",
      phone: "01799887766",
      role: "fulfillment",
      status: "active",
    });

    expect(newStaff.id).toBeDefined();
    expect(newStaff.role).toBe("fulfillment");

    const staffList = devStore.getStaff(testSlug);
    expect(staffList.some((s) => s.email === "tariq@example.com")).toBe(true);

    // Remove staff
    const deleted = devStore.deleteStaff(testSlug, newStaff.id);
    expect(deleted).toBe(true);
    expect(devStore.getStaff(testSlug).some((s) => s.id === newStaff.id)).toBe(false);
  });

  it("records abandoned carts and marks them converted upon checkout", () => {
    const lead = devStore.recordAbandonedCart(testSlug, {
      customerName: "Sakib Al Hasan",
      customerPhone: "01811223344",
      items: [{ title: "Heavyweight T-Shirt", price: 750, quantity: 2 }],
      totalAmount: 1500,
      district: "Dhaka",
    });

    expect(lead.id).toBeDefined();
    expect(lead.status).toBe("abandoned");

    const cartsBefore = devStore.getAbandonedCarts(testSlug);
    expect(cartsBefore.some((c) => c.customerPhone === "01811223344" && c.status === "abandoned")).toBe(true);

    // Convert upon checkout
    const converted = devStore.markAbandonedCartConverted(testSlug, "01811223344");
    expect(converted).toBe(true);

    const cartsAfter = devStore.getAbandonedCarts(testSlug);
    const target = cartsAfter.find((c) => c.customerPhone === "01811223344");
    expect(target?.status).toBe("converted");
  });

  it("records and retrieves security audit events and transactional notifications", () => {
    const event = devStore.logAuditEvent(testSlug, {
      action: "price_update",
      actorEmail: "merchant@storeswift.app",
      actorRole: "owner",
      details: "Updated SKU-101 price from ৳500 to ৳650",
    });
    expect(event.id).toBeDefined();

    const auditLogs = devStore.getAuditEvents(testSlug);
    expect(auditLogs.some((e) => e.action === "price_update")).toBe(true);

    const notif = devStore.queueNotification(testSlug, {
      channel: "sms",
      recipient: "01711002233",
      template: "order_confirmed",
      payload: { orderNumber: "SS-9999", amount: "৳1,850" },
      status: "queued",
    });
    expect(notif.id).toBeDefined();

    const notifs = devStore.getNotifications(testSlug);
    expect(notifs.some((n) => n.template === "order_confirmed")).toBe(true);
  });
});
