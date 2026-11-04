import { describe, it, expect, beforeAll } from "vitest";
import { signSessionToken, verifySessionToken } from "@/lib/auth";
import { canAccessStore, getSessionFromRequest } from "@/lib/api-auth";
import { GET as getAuthMe } from "@/app/api/auth/me/route";
import { GET as getOnboarding } from "@/app/onboarding/route";
import { PATCH as patchProduct } from "@/app/api/products/[id]/route";
import { devStore } from "@/lib/dev-store";
import { NextRequest } from "next/server";

describe("Security, Multi-Tenant Isolation & Auth Synchronization", () => {
  const TEST_SECRET = "super-secret-jwt-signing-key-for-test-32-chars";

  beforeAll(() => {
    process.env.AUTH_SECRET = TEST_SECRET;
  });

  it("encodes, preserves, and decodes store slug in session tokens", () => {
    const payload = {
      userId: "usr-tenant-1",
      email: "owner@apexfashion.bd",
      storeId: "store-apex-fashion",
      storeName: "Apex Fashion Ltd",
      slug: "apex-fashion",
      role: "merchant_owner",
      plan: "pro",
    };

    const token = signSessionToken(payload, TEST_SECRET);
    const decoded = verifySessionToken(token, TEST_SECRET);

    expect(decoded).not.toBeNull();
    expect(decoded?.slug).toBe("apex-fashion");
    expect(decoded?.storeId).toBe("store-apex-fashion");
    expect(decoded?.role).toBe("merchant_owner");
    expect(decoded?.plan).toBe("pro");
  });

  it("strictly enforces multi-tenant access control with canAccessStore", () => {
    const merchantSession = {
      userId: "usr-1",
      email: "merchant@storeswift.com",
      storeId: "store-apex-fashion",
      slug: "apex-fashion",
      role: "merchant_owner",
      plan: "free",
    };

    const superAdminSession = {
      userId: "admin-1",
      email: "admin@storeswift.com",
      storeId: "platform-root",
      slug: "platform-root",
      role: "super_admin",
      plan: "pro",
    };

    // Merchant can access their own store by slug or storeId
    expect(canAccessStore(merchantSession, "apex-fashion")).toBe(true);
    expect(canAccessStore(merchantSession, "store-apex-fashion")).toBe(true);

    // Merchant CANNOT access another store
    expect(canAccessStore(merchantSession, "my-clothing-store")).toBe(false);
    expect(canAccessStore(merchantSession, "store-milano-urban")).toBe(false);

    // Super Admin has universal access
    expect(canAccessStore(superAdminSession, "apex-fashion")).toBe(true);
    expect(canAccessStore(superAdminSession, "my-clothing-store")).toBe(true);
    expect(canAccessStore(superAdminSession, "any-random-store")).toBe(true);
  });

  it("extracts session from Cookie header or Authorization Bearer header", () => {
    const token = signSessionToken({
      userId: "u-bearer",
      email: "bearer@test.com",
      storeId: "s-bearer",
      slug: "bearer-store",
      role: "merchant_owner",
    }, TEST_SECRET);

    // 1. Via Authorization: Bearer
    const reqWithBearer = new Request("http://localhost:3000/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const sessionFromBearer = getSessionFromRequest(reqWithBearer);
    expect(sessionFromBearer).not.toBeNull();
    expect(sessionFromBearer?.email).toBe("bearer@test.com");

    // 2. Via Cookie ss_session
    const reqWithCookie = new Request("http://localhost:3000/api/auth/me", {
      headers: { Cookie: `ss_session=${token}` },
    });
    const sessionFromCookie = getSessionFromRequest(reqWithCookie);
    expect(sessionFromCookie).not.toBeNull();
    expect(sessionFromCookie?.slug).toBe("bearer-store");
  });

  it("handles /api/auth/me correctly for unauthenticated and authenticated requests", async () => {
    // Unauthenticated
    const unauthReq = new Request("http://localhost:3000/api/auth/me");
    const unauthRes = await getAuthMe(unauthReq);
    expect(unauthRes.status).toBe(200);
    const unauthBody = await unauthRes.json();
    expect(unauthBody.authenticated).toBe(false);
    expect(unauthBody.user).toBeNull();

    // Authenticated
    const token = signSessionToken({
      userId: "usr-me",
      email: "me@apexfashion.bd",
      storeId: "store-apex-fashion",
      storeName: "Apex Fashion Ltd",
      slug: "apex-fashion",
      role: "merchant_owner",
      plan: "medium",
    }, TEST_SECRET);

    const authReq = new Request("http://localhost:3000/api/auth/me", {
      headers: { Cookie: `ss_session=${token}` },
    });
    const authRes = await getAuthMe(authReq);
    expect(authRes.status).toBe(200);
    const authBody = await authRes.json();
    expect(authBody.authenticated).toBe(true);
    expect(authBody.user.email).toBe("me@apexfashion.bd");
    expect(authBody.user.slug).toBe("apex-fashion");
    expect(authBody.user.role).toBe("merchant_owner");
  });

  it("redirects /onboarding cleanly to /register while preserving query params", async () => {
    const req = new NextRequest("http://localhost:3000/onboarding?plan=growth&category=beauty");
    const res = await getOnboarding(req);
    expect(res.status).toBe(307); // NextResponse.redirect default
    const location = res.headers.get("location");
    expect(location).toContain("/register");
    expect(location).toContain("plan=growth");
    expect(location).toContain("category=beauty");
  });

  it("blocks cross-tenant unauthorized product modification (IDOR protection)", async () => {
    // Add product to 'my-clothing-store'
    const clothingProd = devStore.addProduct({
      storeId: "store-clothing-store",
      storeSlug: "my-clothing-store",
      title: "Boutique Trench Coat",
      slug: "boutique-trench-coat",
      price: 4500,
      stock: 10,
      sku: "BTC-01",
      category: "clothing",
      status: "active",
      imageUrl: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800",
    });

    // Merchant belonging to 'apex-fashion' attempts to modify 'my-clothing-store' product
    const apexToken = signSessionToken({
      userId: "usr-apex",
      email: "apex@storeswift.com",
      storeId: "store-apex-fashion",
      slug: "apex-fashion",
      role: "merchant_owner",
    }, TEST_SECRET);

    const attackReq = new Request(`http://localhost:3000/api/products/${clothingProd.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: `ss_session=${apexToken}`,
      },
      body: JSON.stringify({ price: 10 }), // try to slash price
    });

    const res = await patchProduct(attackReq, { params: Promise.resolve({ id: clothingProd.id }) });
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error).toContain("Forbidden");

    // Clean up
    devStore.deleteProduct(clothingProd.id);
  });
});
