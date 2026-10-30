import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function GET() {
  const startTime = Date.now();
  let dbStatus = "healthy";
  let dbLatencyMs = 0;

  try {
    const pingStart = Date.now();
    await db.execute(sql`SELECT 1`);
    dbLatencyMs = Date.now() - pingStart;
  } catch {
    dbStatus = "disconnected (fallback mode)";
  }

  const memory = process.memoryUsage();

  return NextResponse.json(
    {
      status: "healthy",
      service: "StoreSwift Core API",
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      latencyMs: Date.now() - startTime,
      database: {
        status: dbStatus,
        latencyMs: dbLatencyMs
      },
      system: {
        heapUsedMb: Math.round((memory.heapUsed / 1024 / 1024) * 100) / 100,
        rssMb: Math.round((memory.rss / 1024 / 1024) * 100) / 100
      },
      environment: process.env.NODE_ENV || "development"
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0"
      }
    }
  );
}

