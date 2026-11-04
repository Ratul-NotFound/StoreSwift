/**
 * StoreSwift Ultra-Fast In-Memory LRU Cache & Acceleration Engine
 *
 * Provides sub-millisecond data retrieval for high-traffic storefront catalogs,
 * store configurations, and category manifests with TTL expiration,
 * automatic LRU pruning, and instantaneous prefix-based cache invalidation.
 */

import { createHash } from "crypto";

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
  etag: string;
  sizeBytes: number;
}

export interface CacheStats {
  hits: number;
  misses: number;
  keysCount: number;
  hitRatio: string;
  totalMemoryBytes: number;
}

class FastLRUCache {
  private cache = new Map<string, CacheEntry<any>>();
  private maxEntries: number;
  private defaultTTLMs: number;
  private hits = 0;
  private misses = 0;

  constructor(maxEntries = 5000, defaultTTLMs = 30000) {
    this.maxEntries = maxEntries;
    this.defaultTTLMs = defaultTTLMs;
  }

  /**
   * Get an item from the cache. Returns null if expired or missing.
   * Promotes item to most recently used.
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) {
      this.misses++;
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.misses++;
      return null;
    }

    // Refresh LRU position (delete and re-insert)
    this.cache.delete(key);
    this.cache.set(key, entry);
    this.hits++;
    return entry.value as T;
  }

  /**
   * Get entry with ETag for conditional HTTP caching (304 Not Modified).
   */
  getWithETag<T>(key: string): { value: T; etag: string } | null {
    const entry = this.cache.get(key);
    if (!entry || Date.now() > entry.expiresAt) {
      this.misses++;
      return null;
    }

    this.cache.delete(key);
    this.cache.set(key, entry);
    this.hits++;
    return { value: entry.value, etag: entry.etag };
  }

  /**
   * Put an item into the cache with optional custom TTL.
   */
  set<T>(key: string, value: T, ttlMs?: number): void {
    // Evict oldest if reaching capacity
    if (this.cache.size >= this.maxEntries && !this.cache.has(key)) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) this.cache.delete(oldestKey);
    }

    const ttl = ttlMs ?? this.defaultTTLMs;
    const expiresAt = Date.now() + ttl;
    const serialized = typeof value === "string" ? value : JSON.stringify(value);
    const etag = `W/"${createHash("md5").update(serialized).digest("hex").slice(0, 16)}"`;
    const sizeBytes = serialized.length * 2; // Approximate JS string memory in bytes

    this.cache.set(key, { value, expiresAt, etag, sizeBytes });
  }

  /**
   * Invalidate a single key.
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Invalidate all keys matching a prefix (e.g. "store:apex-fashion:").
   * Call whenever products or store settings are mutated.
   */
  deletePrefix(prefix: string): number {
    let deleted = 0;
    for (const key of Array.from(this.cache.keys())) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
        deleted++;
      }
    }
    return deleted;
  }

  /**
   * Clear entire cache.
   */
  clear(): void {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Returns live performance telemetry.
   */
  getStats(): CacheStats {
    const total = this.hits + this.misses;
    const ratio = total === 0 ? "0.0%" : `${((this.hits / total) * 100).toFixed(1)}%`;
    let totalMemoryBytes = 0;
    for (const entry of this.cache.values()) {
      totalMemoryBytes += entry.sizeBytes;
    }

    return {
      hits: this.hits,
      misses: this.misses,
      keysCount: this.cache.size,
      hitRatio: ratio,
      totalMemoryBytes,
    };
  }

  /**
   * Helper to generate standardized ETags for any payload.
   */
  static generateETag(content: string | object): string {
    const str = typeof content === "string" ? content : JSON.stringify(content);
    return `W/"${createHash("md5").update(str).digest("hex").slice(0, 16)}"`;
  }
}

// Global singleton instance preserved in Node globalThis across dev hot reloads
const globalForCache = globalThis as unknown as { fastCache?: FastLRUCache };

export const fastCache = globalForCache.fastCache || new FastLRUCache(10000, 30000); // 10k items, 30s TTL default

if (process.env.NODE_ENV !== "production") {
  globalForCache.fastCache = fastCache;
}
