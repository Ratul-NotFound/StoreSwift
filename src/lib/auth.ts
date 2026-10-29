import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export interface SessionPayload {
  userId: string;
  email: string;
  storeId: string;
  role: string;
}

const DEFAULT_SECRET = process.env.AUTH_SECRET || "default-launchcommerce-secret-key-32chars";

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signSessionToken(payload: SessionPayload, secret = DEFAULT_SECRET): string {
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

export function verifySessionToken(token: string, secret = DEFAULT_SECRET): SessionPayload | null {
  try {
    const decoded = jwt.verify(token, secret) as SessionPayload;
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

