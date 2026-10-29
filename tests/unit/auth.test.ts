import { describe, it, expect } from "vitest";
import { hashPassword, comparePassword, signSessionToken, verifySessionToken } from "../../src/lib/auth";

describe("Merchant Authentication & Session Security", () => {
  it("securely hashes and verifies passwords using bcrypt", async () => {
    const rawPass = "startupMerchantSecret123!";
    const hashed = await hashPassword(rawPass);

    expect(hashed).not.toBe(rawPass);
    expect(hashed.length).toBeGreaterThan(20);

    const isMatch = await comparePassword(rawPass, hashed);
    expect(isMatch).toBe(true);

    const isWrongMatch = await comparePassword("wrongPassword", hashed);
    expect(isWrongMatch).toBe(false);
  });

  it("signs and verifies JWT session tokens with store tenant payload", () => {
    const payload = {
      userId: "user-1234",
      email: "founder@startup.com",
      storeId: "store-9876",
      role: "merchant_owner"
    };

    const token = signSessionToken(payload, "test-secret-key-123");
    expect(typeof token).toBe("string");
    expect(token.split(".").length).toBe(3); // JWT format: header.payload.signature

    const decoded = verifySessionToken(token, "test-secret-key-123");
    expect(decoded).not.toBeNull();
    expect(decoded?.userId).toBe("user-1234");
    expect(decoded?.email).toBe("founder@startup.com");
    expect(decoded?.storeId).toBe("store-9876");
    expect(decoded?.role).toBe("merchant_owner");
  });

  it("rejects tampered or invalid JWT tokens", () => {
    const token = signSessionToken({
      userId: "u1",
      email: "test@example.com",
      storeId: "s1",
      role: "merchant_owner"
    }, "valid-secret");

    const decodedWithWrongKey = verifySessionToken(token, "wrong-secret");
    expect(decodedWithWrongKey).toBeNull();

    const decodedGarbage = verifySessionToken("invalid.token.structure");
    expect(decodedGarbage).toBeNull();
  });
});

