import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";
import os from "os";
import { fastCache } from "@/lib/cache";

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
  const cpus = os.cpus();

  return NextResponse.json(
    {
      status: "healthy",
      service: "StoreSwift Core API",
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      latencyMs: Date.now() - startTime,
      workerId: process.env.WORKER_ID || `pid-${process.pid}`,
      cluster: {
        pid: process.pid,
        cpuCores: cpus.length,
        model: cpus[0]?.model || "Generic CPU",
        loadAverage: os.loadavg(),
      },
      database: {
        status: dbStatus,
        latencyMs: dbLatencyMs
      },
      cache: fastCache.getStats(),
      system: {
        heapUsedMb: Math.round((memory.heapUsed / 1024 / 1024) * 100) / 100,
        heapTotalMb: Math.round((memory.heapTotal / 1024 / 1024) * 100) / 100,
        rssMb: Math.round((memory.rss / 1024 / 1024) * 100) / 100,
        freeMemMb: Math.round((os.freemem() / 1024 / 1024) * 100) / 100,
      },
      environment: process.env.NODE_ENV || "development"
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "X-Node-Worker": process.env.WORKER_ID || `pid-${process.pid}`
      }
    }
  );
}

