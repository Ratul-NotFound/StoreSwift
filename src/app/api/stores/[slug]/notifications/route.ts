import { NextRequest, NextResponse } from "next/server";
import { devStore } from "@/lib/dev-store";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const store = devStore.getStore(slug);
  if (!store) {
    return NextResponse.json({ ok: false, error: "Store not found" }, { status: 404 });
  }

  const notifications = devStore.getNotifications(slug);
  return NextResponse.json({ ok: true, notifications });
}
