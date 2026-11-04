/**
 * StoreSwift High-Concurrency Traffic Shield & Sliding-Window Rate Limiter
 *
 * Protects backend workers, database pools, and checkout endpoints from
 * sudden traffic surges, inventory hoarding bots, and credential stuffing.
 * Returns standard RFC 6585 headers (X-RateLimit-*).
 */

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetSec: number;
}

interface WindowRecord {
  timestamps: number[];
}

export class SlidingWindowRateLimiter {
  private windows = new Map<string, WindowRecord>();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Run periodic cleanup every 60s to prevent memory leaks from inactive IPs
    if (typeof setInterval !== "undefined") {
      this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
      if (this.cleanupInterval.unref) {
        this.cleanupInterval.unref();
      }
    }
  }

  /**
   * Check if a request from a given client key is allowed under the rate limit.
   *
   * @param key Unique client identifier (e.g. IP or user ID + route)
   * @param limit Maximum allowed requests within the window
   * @param windowSeconds Window length in seconds (defaults to 60)
   */
  check(key: string, limit: number, windowSeconds = 60): RateLimitResult {
    const now = Date.now();
    const windowMs = windowSeconds * 1000;
    const threshold = now - windowMs;

    let record = this.windows.get(key);
    if (!record) {
      record = { timestamps: [] };
      this.windows.set(key, record);
    }

    // Filter out timestamps outside the active sliding window
    record.timestamps = record.timestamps.filter((ts) => ts > threshold);

    const count = record.timestamps.length;
    const allowed = count < limit;

    if (allowed) {
      record.timestamps.push(now);
    }

    const remaining = Math.max(0, limit - record.timestamps.length);
    const oldestTimestamp = record.timestamps[0] || now;
    const resetSec = Math.max(1, Math.ceil((oldestTimestamp + windowMs - now) / 1000));

    return {
      allowed,
      limit,
      remaining,
      resetSec,
    };
  }

  /**
   * Reset limits for a specific key (e.g. on successful login).
   */
  reset(key: string): void {
    this.windows.delete(key);
  }

  /**
   * Prunes completely expired windows to maintain optimal memory footprint.
   */
  cleanup(): void {
    const now = Date.now();
    const maxAge = 5 * 60 * 1000; // 5 minutes
    for (const [key, record] of Array.from(this.windows.entries())) {
      const active = record.timestamps.filter((ts) => ts > now - maxAge);
      if (active.length === 0) {
        this.windows.delete(key);
      } else {
        record.timestamps = active;
      }
    }
  }

  /**
   * Helper to extract client IP from incoming standard Request headers.
   * Prioritizes tamper-resistant edge headers (cf-connecting-ip, x-real-ip)
   * over user-controllable forwarded headers.
   */
  static getClientIp(request: Request): string {
    const cfConnectingIp = request.headers.get("cf-connecting-ip");
    if (cfConnectingIp) return cfConnectingIp.trim();

    const realIp = request.headers.get("x-real-ip");
    if (realIp) return realIp.trim();

    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) {
      // First IP in chain is client IP
      const clientIp = forwarded.split(",")[0].trim();
      if (clientIp) return clientIp;
    }

    return "127.0.0.1";
  }
}

// Global singleton instance
const globalForLimiter = globalThis as unknown as { trafficLimiter?: SlidingWindowRateLimiter };

export const trafficLimiter = globalForLimiter.trafficLimiter || new SlidingWindowRateLimiter();

if (process.env.NODE_ENV !== "production") {
  globalForLimiter.trafficLimiter = trafficLimiter;
}

