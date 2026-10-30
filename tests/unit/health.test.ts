import { describe, it, expect } from "vitest";
import { GET as healthHandler } from "../../src/app/api/health/route";

describe("Load Balancer Health Probe API (/api/health)", () => {
  it("returns 200 OK with system metrics for load balancers", async () => {
    const res = await healthHandler();
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.status).toBe("healthy");
    expect(data.service).toBe("StoreSwift Core API");
    expect(typeof data.uptimeSeconds).toBe("number");
    expect(typeof data.system.heapUsedMb).toBe("number");
  });
});

