import { describe, it, expect, beforeEach } from "vitest";
import { fastCache } from "../../src/lib/cache";
import { SlidingWindowRateLimiter, trafficLimiter } from "../../src/lib/rate-limiter";
import { GET as healthHandler } from "../../src/app/api/health/route";
import { GET as productsHandler } from "../../src/app/api/products/route";

describe("Performance Acceleration, Rate Limiting & Load Balancing Engine", () => {
  beforeEach(() => {
    fastCache.clear();
  });

  // ─── 1. FAST IN-MEMORY LRU CACHE ACCELERATION ────────────────────────────────
  it("delivers sub-millisecond lookups for hot store catalogs", () => {
    const key = "store:apex-fashion:featured";
    const sampleProducts = Array.from({ length: 50 }, (_, i) => ({
      id: `p-${i}`,
      title: `Product ${i}`,
      price: 1500 + i * 10,
    }));

    fastCache.set(key, sampleProducts, 10000);

    const start = performance.now();
    const retrieved = fastCache.get<typeof sampleProducts>(key);
    const elapsedMs = performance.now() - start;

    expect(retrieved).toBeDefined();
    expect(retrieved?.length).toBe(50);
    // Retrieval must be blisteringly fast (< 1ms)
    expect(elapsedMs).toBeLessThan(1.0);

    const stats = fastCache.getStats();
    expect(stats.hits).toBe(1);
    expect(stats.misses).toBe(0);
    expect(stats.keysCount).toBe(1);
  });

  it("handles TTL expiration and automatic eviction cleanly", async () => {
    const shortKey = "temp:session:token";
    // Set 20ms TTL
    fastCache.set(shortKey, { valid: true }, 20);

    const immediate = fastCache.get(shortKey);
    expect(immediate).toEqual({ valid: true });

    // Wait 35ms for expiration
    await new Promise((resolve) => setTimeout(resolve, 35));

    const expired = fastCache.get(shortKey);
    expect(expired).toBeNull();
  });

  it("instantaneously invalidates cache by store prefix on product mutation", () => {
    fastCache.set("products:store-a", [{ id: "1" }], 30000);
    fastCache.set("products:store-a:details:1", { id: "1", desc: "Detail" }, 30000);
    fastCache.set("products:store-b", [{ id: "2" }], 30000);

    // Invalidate all store-a cache
    const deletedCount = fastCache.deletePrefix("products:store-a");
    expect(deletedCount).toBe(2);

    // store-a entries must be gone
    expect(fastCache.get("products:store-a")).toBeNull();
    expect(fastCache.get("products:store-a:details:1")).toBeNull();

    // store-b entry must remain intact
    expect(fastCache.get("products:store-b")).toBeDefined();
  });

  // ─── 2. TRAFFIC SHIELD & SLIDING-WINDOW RATE LIMITING ────────────────────────
  it("shields backend by throttling requests that exceed concurrency limits", () => {
    const limiter = new SlidingWindowRateLimiter();
    const clientKey = "test-client-192.168.1.50";
    const limit = 5;
    const windowSec = 60;

    // Requests 1 to 5 should be accepted
    for (let i = 1; i <= limit; i++) {
      const res = limiter.check(clientKey, limit, windowSec);
      expect(res.allowed).toBe(true);
      expect(res.remaining).toBe(limit - i);
    }

    // Request 6 must be blocked with 0 remaining
    const blockedRes = limiter.check(clientKey, limit, windowSec);
    expect(blockedRes.allowed).toBe(false);
    expect(blockedRes.remaining).toBe(0);
    expect(blockedRes.resetSec).toBeGreaterThan(0);

    // Resetting key unlocks immediately
    limiter.reset(clientKey);
    const freshRes = limiter.check(clientKey, limit, windowSec);
    expect(freshRes.allowed).toBe(true);
    expect(freshRes.remaining).toBe(4);
  });

  // ─── 3. HEALTH TELEMETRY & LOAD BALANCER PROBE ───────────────────────────────
  it("returns rich cluster & load balancing telemetry for upstream load balancers", async () => {
    const res = await healthHandler();
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.status).toBe("healthy");
    expect(data.service).toBe("StoreSwift Core API");
    expect(data.workerId).toBeTruthy();
    expect(data.cluster).toBeDefined();
    expect(data.cluster.cpuCores).toBeGreaterThan(0);
    expect(data.cluster.pid).toBe(process.pid);
    expect(data.cache).toBeDefined();
    expect(data.system.heapUsedMb).toBeGreaterThan(0);

    // Verify load balancer cache-control header
    expect(res.headers.get("Cache-Control")).toBe("no-store, max-age=0");
  });

  // ─── 4. CONDITIONAL HTTP CACHING & ETAG / 304 NOT MODIFIED ──────────────────
  it("generates ETags and serves 304 Not Modified to save bandwidth", async () => {
    const testSlug = "apex-fashion";

    // Request 1: Cold fetch (Cache MISS)
    const req1 = new Request(`http://localhost:3000/api/products?storeSlug=${testSlug}`);
    const res1 = await productsHandler(req1);
    expect(res1.status).toBe(200);
    expect(res1.headers.get("X-Cache")).toBe("MISS");
    const etag = res1.headers.get("ETag");
    expect(etag).toBeTruthy();

    // Request 2: Warm fetch (Cache HIT)
    const req2 = new Request(`http://localhost:3000/api/products?storeSlug=${testSlug}`);
    const res2 = await productsHandler(req2);
    expect(res2.status).toBe(200);
    expect(res2.headers.get("X-Cache")).toBe("HIT");
    expect(res2.headers.get("ETag")).toBe(etag);

    // Request 3: Conditional validation (If-None-Match matching ETag) -> 304 Not Modified
    const req3 = new Request(`http://localhost:3000/api/products?storeSlug=${testSlug}`, {
      headers: { "If-None-Match": etag! },
    });
    const res3 = await productsHandler(req3);
    expect(res3.status).toBe(304);
    expect(res3.headers.get("X-Cache")).toBe("HIT");
  });
});
