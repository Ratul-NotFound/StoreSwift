import { describe, it, expect, beforeEach } from "vitest";
import { ProductSearchTrie, searchTrie } from "../../src/lib/search-trie";
import { devStore } from "../../src/lib/dev-store";
import { fastCache } from "../../src/lib/cache";
import { SlidingWindowRateLimiter } from "../../src/lib/rate-limiter";

describe("Pro DSA & Cluster Optimization Suite", () => {
  let trie: ProductSearchTrie;

  beforeEach(() => {
    trie = new ProductSearchTrie();
  });

  // ─── 1. PREFIX TRIE & INVERTED SEARCH INDEX ──────────────────────────────────
  describe("1. ProductSearchTrie (O(P + K) Sub-Millisecond Search)", () => {
    it("indexes products and performs instant prefix retrieval", () => {
      trie.indexProduct("store-a", {
        id: "p1",
        title: "Acoustic Noise-Cancelling Titanium Headphones",
        sku: "ANC-TITAN-01",
        category: "Audio",
        description: "Beryllium driver planar magnetic headphones with active noise cancellation."
      });

      trie.indexProduct("store-a", {
        id: "p2",
        title: "Mechanical Tactile Keyboard 75%",
        sku: "KB-TACT-75",
        category: "Hardware",
        description: "Gasket-mounted CNC aluminum mechanical keyboard with hot-swappable switches."
      });

      // Search prefix "head" -> matches "headphones"
      const resHead = trie.search("store-a", "head");
      expect(resHead.length).toBe(1);
      expect(resHead[0].item.id).toBe("p1");

      // Search prefix "mech" -> matches "mechanical"
      const resMech = trie.search("store-a", "mech");
      expect(resMech.length).toBe(1);
      expect(resMech[0].item.id).toBe("p2");

      // Search prefix "titan" -> matches "Titanium"
      const resTitan = trie.search("store-a", "titan");
      expect(resTitan.length).toBe(1);
      expect(resTitan[0].item.id).toBe("p1");
    });

    it("enforces multi-tenant isolation during search (stores cannot see other store items)", () => {
      trie.indexProduct("store-fashion", {
        id: "f1",
        title: "Raw Selvedge Denim Jeans",
        category: "Pants"
      });

      trie.indexProduct("store-tech", {
        id: "t1",
        title: "Raw Titanium Keycaps",
        category: "Accessories"
      });

      // Query "raw" in store-fashion should only return denim
      const fashionRes = trie.search("store-fashion", "raw");
      expect(fashionRes.length).toBe(1);
      expect(fashionRes[0].item.id).toBe("f1");

      // Query "raw" in store-tech should only return keycaps
      const techRes = trie.search("store-tech", "raw");
      expect(techRes.length).toBe(1);
      expect(techRes[0].item.id).toBe("t1");
    });

    it("ranks exact title matches higher than partial or description matches", () => {
      trie.indexProduct("store-rank", {
        id: "match-exact",
        title: "Silk Scarf",
        description: "Pure luxury silk accessory"
      });

      trie.indexProduct("store-rank", {
        id: "match-desc",
        title: "Winter Overcoat",
        description: "Made with authentic Mulberry silk lining"
      });

      const res = trie.search("store-rank", "silk");
      expect(res.length).toBe(2);
      expect(res[0].item.id).toBe("match-exact");
      expect(res[0].score).toBeGreaterThan(res[1].score);
    });

    it("removes products cleanly from the Trie index upon deletion", () => {
      trie.indexProduct("store-del", {
        id: "item-to-delete",
        title: "Ceremonial Matcha Green Tea",
        category: "Tea"
      });

      expect(trie.search("store-del", "matcha").length).toBe(1);

      trie.removeProduct("store-del", "item-to-delete");
      expect(trie.search("store-del", "matcha").length).toBe(0);
    });
  });

  // ─── 2. DEVSTORE INTEGRATION WITH SEARCH TRIE ────────────────────────────────
  describe("2. devStore Integration with In-Memory Search Trie", () => {
    it("indexes newly created products and allows sub-millisecond searchProducts", () => {
      const storeSlug = "trie-test-store";
      devStore.ensureStore(storeSlug, "Trie Test Store", "electronics");

      const created = devStore.addProduct({
        storeId: storeSlug,
        storeSlug,
        title: "Ultra-Fast NVMe Solid State Drive",
        slug: "nvme-ssd-fast",
        price: 9500,
        stock: 10,
        status: "active"
      });

      const matches = devStore.searchProducts(storeSlug, "nvme");
      expect(matches.length).toBeGreaterThan(0);
      expect(matches.some((m) => m.id === created.id)).toBe(true);

      // Clean up
      devStore.deleteProduct(created.id);
      const afterDelete = devStore.searchProducts(storeSlug, "nvme");
      expect(afterDelete.some((m) => m.id === created.id)).toBe(false);
    });
  });

  // ─── 3. CLUSTER CACHE BROADCAST & LRU CACHE ──────────────────────────────────
  describe("3. FastLRUCache & Invalidation Mechanics", () => {
    it("invalidates all keys matching a prefix", () => {
      fastCache.set("products:store-a:1", { name: "item1" });
      fastCache.set("products:store-a:2", { name: "item2" });
      fastCache.set("products:store-b:1", { name: "item3" });

      expect(fastCache.get("products:store-a:1")).toBeDefined();
      expect(fastCache.get("products:store-a:2")).toBeDefined();
      expect(fastCache.get("products:store-b:1")).toBeDefined();

      const deleted = fastCache.deletePrefix("products:store-a:");
      expect(deleted).toBe(2);

      expect(fastCache.get("products:store-a:1")).toBeNull();
      expect(fastCache.get("products:store-a:2")).toBeNull();
      // store-b should remain intact
      expect(fastCache.get("products:store-b:1")).not.toBeNull();
    });
  });

  // ─── 4. TAMPER-RESISTANT CLIENT IP PARSING ───────────────────────────────────
  describe("4. Tamper-Resistant IP Extraction in Rate Limiter", () => {
    it("prioritizes cf-connecting-ip over user-supplied x-forwarded-for headers", () => {
      const spoofedReq = new Request("http://localhost:3000/api/orders", {
        headers: {
          "cf-connecting-ip": "203.0.113.195",
          "x-forwarded-for": "10.0.0.1, 127.0.0.1",
          "x-real-ip": "10.0.0.1"
        }
      });

      const resolvedIp = SlidingWindowRateLimiter.getClientIp(spoofedReq);
      expect(resolvedIp).toBe("203.0.113.195");
    });

    it("prioritizes x-real-ip if cf-connecting-ip is absent", () => {
      const realIpReq = new Request("http://localhost:3000/api/orders", {
        headers: {
          "x-real-ip": "198.51.100.42",
          "x-forwarded-for": "10.0.0.1"
        }
      });

      const resolvedIp = SlidingWindowRateLimiter.getClientIp(realIpReq);
      expect(resolvedIp).toBe("198.51.100.42");
    });
  });
});
