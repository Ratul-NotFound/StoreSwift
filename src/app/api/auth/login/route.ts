import { NextResponse } from "next/server";
import { z } from "zod";
import { db, users, stores } from "@/db";
import { eq } from "drizzle-orm";
import { comparePassword, signSessionToken } from "@/lib/auth";

// In-memory rate limiter: Map of IP/identifier -> { count, resetAt }
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (record.count >= MAX_ATTEMPTS) {
    return false;
  }

  record.count += 1;
  return true;
}

const loginSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(1).optional(),
  demo: z.boolean().optional()
});

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "local";
    const body = await request.json().catch(() => ({}));
    const parse = loginSchema.safeParse(body);

    if (!parse.success) {
      return NextResponse.json({ error: "Invalid login credentials." }, { status: 400 });
    }

    const { email, password, demo } = parse.data;

    // ─── Instant Demo Access ───────────────────────────────────────────
    if (demo) {
      const demoToken = signSessionToken({
        userId: "demo-merchant-id",
        email: "demo@storeswift.com",
        storeId: "demo-store-id",
        role: "merchant_owner"
      });

      const response = NextResponse.json({
        ok: true,
        storeId: "demo-store-id",
        slug: "apex-fashion"
      });

      response.cookies.set("ss_session", demoToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7
      });

      return response;
    }

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    // ─── Rate Limiting ─────────────────────────────────────────────────
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many login attempts. Please wait 15 minutes before trying again." },
        { status: 429 }
      );
    }

    try {
      const existingUser = (
        await db.select().from(users).where(eq(users.email, email.toLowerCase().trim())).limit(1)
      )[0];

      if (!existingUser) {
        return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
      }

      const isValidPassword = await comparePassword(password, existingUser.passwordHash);
      if (!isValidPassword) {
        return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
      }

      // Fetch user's store
      const userStore = (
        await db.select().from(stores).where(eq(stores.ownerId, existingUser.id)).limit(1)
      )[0];

      const storeId = userStore?.id || "default-store";
      const slug = userStore?.slug || email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "-");

      const token = signSessionToken({
        userId: existingUser.id,
        email: existingUser.email,
        storeId,
        role: existingUser.role
      });

      const response = NextResponse.json({
        ok: true,
        storeId,
        slug
      });

      response.cookies.set("ss_session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7
      });

      return response;
    } catch (dbErr) {
      console.error("[Login API DB Fallback]", dbErr);
      // Fallback for offline dev environment
      const slug = email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "-") || "apex-fashion";
      const token = signSessionToken({
        userId: "local-dev-user",
        email,
        storeId: `store-${slug}`,
        role: "merchant_owner"
      });

      const response = NextResponse.json({
        ok: true,
        storeId: `store-${slug}`,
        slug
      });

      response.cookies.set("ss_session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7
      });

      return response;
    }
  } catch (err) {
    console.error("[Login API Error]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
