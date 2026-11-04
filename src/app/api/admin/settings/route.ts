import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionFromRequest } from "@/lib/api-auth";

const settingsSchema = z.object({
  platformName:        z.string().optional(),
  supportEmail:        z.string().email().optional(),
  logoUrl:             z.string().url().optional(),
  steadfastApiKey:     z.string().optional(),
  pathaoClientId:      z.string().optional(),
  pathaoClientSecret:  z.string().optional(),
  dropshippingEnabled: z.boolean().optional(),
  affiliateEnabled:    z.boolean().optional(),
  maintenanceMode:     z.boolean().optional(),
  commissionRates:     z.object({
    free:   z.number().min(0).max(100),
    medium: z.number().min(0).max(100),
    pro:    z.number().min(0).max(100),
  }).optional(),
  defaultAnnouncementText: z.string().optional(),
});

// In-memory platform settings (persist to DB in production)
let PLATFORM_SETTINGS = {
  platformName: "StoreSwift",
  supportEmail: "support@storeswift.app",
  logoUrl: "",
  steadfastApiKey: "",
  pathaoClientId: "",
  pathaoClientSecret: "",
  dropshippingEnabled: true,
  affiliateEnabled: false,
  maintenanceMode: false,
  commissionRates: { free: 8, medium: 3, pro: 0 },
  defaultAnnouncementText: "🎉 Free plan available — Start selling today!"
};

/**
 * GET /api/admin/settings  — get platform settings
 * PATCH /api/admin/settings — update platform settings
 */
export async function GET(request: Request) {
  const session = getSessionFromRequest(request);
  if (!session || session.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden: Super admin authentication required." }, { status: 403 });
  }
  return NextResponse.json({ ok: true, settings: PLATFORM_SETTINGS });
}

export async function PATCH(request: Request) {
  const session = getSessionFromRequest(request);
  if (!session || session.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden: Super admin authentication required." }, { status: 403 });
  }

  const body = await request.json();
  const parse = settingsSchema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json({ error: parse.error.errors[0]?.message }, { status: 400 });
  }

  PLATFORM_SETTINGS = { ...PLATFORM_SETTINGS, ...parse.data };
  return NextResponse.json({ ok: true, settings: PLATFORM_SETTINGS });
}

