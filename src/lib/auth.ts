import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export interface SessionPayload {
  userId: string;
  email: string;
  storeId: string;
  role: string;
}

function getSecret(customSecret?: string): string {
  const secret = customSecret || process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET environment variable must be set");
  }
  return secret;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signSessionToken(payload: SessionPayload, secret?: string): string {
  return jwt.sign(payload, getSecret(secret), { expiresIn: "7d" });
}

export function verifySessionToken(token: string, secret?: string): SessionPayload | null {
  try {
    const key = secret || process.env.AUTH_SECRET;
    if (!key) return null;
    const decoded = jwt.verify(token, key) as SessionPayload;
    if (decoded && decoded.userId && decoded.storeId) {
      return {
        userId: decoded.userId,
        email: decoded.email,
        storeId: decoded.storeId,
        role: decoded.role
      };
    }
    return null;
  } catch {
    return null;
  }
}
