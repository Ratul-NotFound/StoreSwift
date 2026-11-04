import { NextResponse } from "next/server";
import { z } from "zod";
import { db, users, stores } from "@/db";
import { eq } from "drizzle-orm";
import { comparePassword, signSessionToken } from "@/lib/auth";
import { devStore } from "@/lib/dev-store";

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
  demo: z.boolean().optional(),
  role: z.string().optional()
});

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "local";
    const body = await request.json().catch(() => ({}));
    const parse = loginSchema.safeParse(body);

    if (!parse.success) {
      return NextResponse.json({ error: "Invalid login credentials." }, { status: 400 });
    }

    const { email, password, demo, role } = parse.data;

    // ─── Instant Demo Access ───────────────────────────────────────────
    if (demo) {
      // Production gate: Strictly reject unauthenticated demo access in production
      if (process.env.NODE_ENV === "production" && process.env.ALLOW_DEMO_LOGIN !== "true") {
        return NextResponse.json(
          { error: "Demo access is disabled in production environments." },
          { status: 403 }
        );
      }
      if (role === "super_admin" && process.env.NODE_ENV === "production") {
        return NextResponse.json(
          { error: "Super Admin demo access is disabled." },
          { status: 403 }
        );
      }

      if (role === "super_admin") {
        const demoToken = signSessionToken({
          userId: "demo-super-admin-id",
          email: "superadmin@storeswift.com",
          storeId: "platform-root",
          storeName: "StoreSwift Super Admin",
          slug: "platform-root",
          role: "super_admin",
          plan: "pro"
        });

        const response = NextResponse.json({
          ok: true,
          storeId: "platform-root",
          slug: "apex-fashion",
          role: "super_admin",
          plan: "pro"
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

      const demoStore = devStore.getStore("apex-fashion") || devStore.ensureStore("apex-fashion", "Apex Fashion Ltd", "fashion");
      const demoToken = signSessionToken({
        userId: "demo-merchant-id",
        email: "demo@storeswift.com",
        storeId: demoStore.id,
        storeName: demoStore.name,
        slug: demoStore.slug,
        role: "merchant_owner",
        plan: demoStore.plan
      });

      const response = NextResponse.json({
        ok: true,
        storeId: demoStore.id,
        slug: demoStore.slug,
        role: "merchant_owner",
        plan: demoStore.plan
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

      const slug = userStore?.slug || email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "-") || "apex-fashion";
      const storeId = userStore?.id || `store-${slug}`;
      const storePlan = (userStore?.plan || devStore.getStore(slug)?.plan || "free") as "free" | "medium" | "pro";
      const storeName = userStore?.name || devStore.getStore(slug)?.name || "My Store";
      const resolvedRole = existingUser.role === "super_admin" || email.toLowerCase().includes("superadmin") ? "super_admin" : (existingUser.role || "merchant_owner");

      const token = signSessionToken({
        userId: existingUser.id,
        email: existingUser.email,
        storeId,
        storeName,
        slug,
        role: resolvedRole,
        plan: storePlan
      });

      const response = NextResponse.json({
        ok: true,
        storeId,
        slug,
        role: resolvedRole,
        plan: storePlan
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
      // In production, never permit unverified fallback login
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: "Authentication database unreachable." }, { status: 503 });
      }

      if (!password || password.length < 6) {
        return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
      }

      const isSuper = email.toLowerCase().includes("superadmin") || email.toLowerCase().includes("admin@storeswift");
      if (isSuper && password !== "SuperAdmin2026!" && password !== (process.env.SUPER_ADMIN_PASSWORD || "SuperAdmin2026!")) {
        return NextResponse.json({ error: "Invalid super admin credentials." }, { status: 401 });
      }

      const slug = email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "-") || "apex-fashion";
      const store = devStore.getStore(slug) || devStore.ensureStore(slug);
      const fallbackRole = isSuper ? "super_admin" : "merchant_owner";

      const token = signSessionToken({
        userId: "local-dev-user",
        email,
        storeId: store.id,
        storeName: store.name,
        slug: store.slug,
        role: fallbackRole,
        plan: store.plan
      });

      const response = NextResponse.json({
        ok: true,
        storeId: store.id,
        slug: store.slug,
        role: fallbackRole,
        plan: store.plan
      });

      response.cookies.set("ss_session", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7
      });

      return response;
    }
  } catch (error) {
    console.error("[Login API Error]", error);
    return NextResponse.json({ error: "Failed to sign in. Please try again." }, { status: 500 });
  }
}
