import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const event = await request.json().catch(() => null);
    if (!event || !event.event) {
      return NextResponse.json({ error: "Invalid telemetry payload" }, { status: 400 });
    }

    // In production, forward to ClickHouse, PostHog, Mixpanel, or BigQuery
    return NextResponse.json({ ok: true, received: event.event });
  } catch (err) {
    console.error("[Analytics API Error]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
