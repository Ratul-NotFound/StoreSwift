import { describe, it, expect } from "vitest";
import { GET, POST, DELETE } from "@/app/api/stores/[slug]/staff/route";
import { NextRequest } from "next/server";

describe("Staff Accounts & RBAC API (/api/stores/[slug]/staff)", () => {
  it("enforces plan limits: blocks adding staff on Free plan with upgrade notice", async () => {
    // Apex fashion is on free plan
    const req = new NextRequest("http://localhost:3000/api/stores/apex-fashion/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "staff_new@apexfashion.bd",
        name: "Test Staff",
        role: "fulfillment",
      }),
    });

    const res = await POST(req, { params: Promise.resolve({ slug: "apex-fashion" }) });
    const data = await res.json();

    expect(res.status).toBe(403);
    expect(data.upgrade).toBe(true);
    expect(data.error).toContain("Upgrade to Medium or Pro");
  });

  it("allows Medium plan store to add staff up to seat limit", async () => {
    // my-clothing-store is on medium plan (limit 2)
    const req = new NextRequest("http://localhost:3000/api/stores/my-clothing-store/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "worker1@clothingco.bd",
        name: "Kamrul Hasan",
        role: "catalog_editor",
      }),
    });

    const res = await POST(req, { params: Promise.resolve({ slug: "my-clothing-store" }) });
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.ok).toBe(true);
    expect(data.staff.role).toBe("catalog_editor");
  });

  it("lists staff and prevents deleting the primary store owner", async () => {
    const getReq = new NextRequest("http://localhost:3000/api/stores/my-clothing-store/staff");
    const getRes = await GET(getReq, { params: Promise.resolve({ slug: "my-clothing-store" }) });
    const getData = await getRes.json();

    expect(getRes.status).toBe(200);
    expect(getData.ok).toBe(true);
    expect(Array.isArray(getData.staff)).toBe(true);

    // Try deleting owner
    const owner = getData.staff.find((s: any) => s.role === "owner");
    expect(owner).toBeDefined();

    const delReq = new NextRequest(`http://localhost:3000/api/stores/my-clothing-store/staff?staffId=${owner.id}`, {
      method: "DELETE",
    });
    const delRes = await DELETE(delReq, { params: Promise.resolve({ slug: "my-clothing-store" }) });
    expect(delRes.status).toBe(400);
  });
});
