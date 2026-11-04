import { describe, it, expect } from "vitest";
import { GET as getNotifications } from "@/app/api/stores/[slug]/notifications/route";
import { GET as getAudit } from "@/app/api/stores/[slug]/audit/route";
import { NextRequest } from "next/server";
import { devStore } from "@/lib/dev-store";

describe("Transactional Notification Center & Audit Trail API", () => {
  const testSlug = "apex-fashion";

  it("retrieves queued transactional notifications for customer lifecycle events", async () => {
    devStore.queueNotification(testSlug, {
      channel: "sms",
      recipient: "01700112233",
      template: "order_confirmed",
      payload: { orderNumber: "ORD-TEST-1", amount: "৳2,400" },
      status: "sent",
    });

    const req = new NextRequest(`http://localhost:3000/api/stores/${testSlug}/notifications`);
    const res = await getNotifications(req, { params: Promise.resolve({ slug: testSlug }) });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.notifications)).toBe(true);
    expect(data.notifications.some((n: any) => n.payload?.orderNumber === "ORD-TEST-1")).toBe(true);
  });

  it("retrieves tamper-evident store audit logs", async () => {
    devStore.logAuditEvent(testSlug, {
      action: "order_status_update",
      actorEmail: "manager@apexfashion.bd",
      actorRole: "manager",
      details: "Marked order ORD-TEST-1 as shipped with Steadfast consignment SS-98211",
    });

    const req = new NextRequest(`http://localhost:3000/api/stores/${testSlug}/audit`);
    const res = await getAudit(req, { params: Promise.resolve({ slug: testSlug }) });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.events)).toBe(true);
    expect(data.events.some((e: any) => e.details.includes("ORD-TEST-1"))).toBe(true);
  });
});
