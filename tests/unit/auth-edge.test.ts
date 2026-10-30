import { describe, it, expect, beforeAll } from "vitest";
import { signSessionToken } from "../../src/lib/auth";
import { verifySessionTokenEdge } from "../../src/lib/auth-edge";

describe("Edge JWT Authentication & Verification (jose)", () => {
  const TEST_SECRET = "super-secret-key-that-is-at-least-32-chars-long!";

  beforeAll(() => {
    process.env.AUTH_SECRET = TEST_SECRET;
  });

  it("successfully verifies valid session token in Edge runtime", async () => {
    const payload = {
      userId: "user-edge-101",
      email: "founder@edgebrand.com",
      storeId: "store-edge-202",
      role: "merchant_owner"
    };

    const token = signSessionToken(payload, TEST_SECRET);
    const verified = await verifySessionTokenEdge(token);

    expect(verified).not.toBeNull();
    expect(verified?.userId).toBe("user-edge-101");
    expect(verified?.email).toBe("founder@edgebrand.com");
    expect(verified?.storeId).toBe("store-edge-202");
    expect(verified?.role).toBe("merchant_owner");
  });

  it("returns null for malformed or forged tokens", async () => {
    const fakeToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.garbage.signature";
    const verified = await verifySessionTokenEdge(fakeToken);
    expect(verified).toBeNull();
  });
});

