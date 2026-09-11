/**
 * Smoke script CLI/flow tests — zero network.
 *
 * Drives runCli() with an in-memory transport (same pattern as the FakeHttp
 * harness in live-tests) and captured log sinks, verifying:
 *   - exit codes: 0 (success, --help, --dry-run), 1 (smoke failure), 2 (usage)
 *   - the exact request sequence and auth headers (cookie, CSRF, Origin,
 *     x-request-id correlation from task #13)
 *   - early abort: a failed step stops the flow before any order is submitted
 *   - dry-run performs no requests and echoes the plan
 */

import { describe, test, expect } from "@jest/globals";
import {
  runCli,
  runSmoke,
  parseArgs,
  describePlan,
  formatSummary,
  type SmokeConfig,
  type TransportResponse,
} from "@/scripts/smoke-live";

const SESSION = "a".repeat(64);

function baseConfig(overrides: Partial<SmokeConfig> = {}): SmokeConfig {
  return { baseUrl: "https://smoke.example.com", sessionId: SESSION, symbol: "BTCUSDT", qty: "0.001", timeoutMs: 5000, ...overrides };
}

interface Call {
  url: string;
  init: RequestInit;
}

/** Scripted transport: handlers keyed by path, each returns status/body. */
function fakeTransport(
  handlers: Record<string, (call: Call) => { status: number; body?: unknown }>,
): { transport: (url: string, init: RequestInit) => Promise<TransportResponse>; calls: Call[] } {
  const calls: Call[] = [];
  return {
    calls,
    transport: async (url, init) => {
      const path = new URL(url).pathname;
      calls.push({ url, init });
      const handler = handlers[path];
      if (!handler) throw new Error(`no fake route for ${path}`);
      const r = handler({ url, init });
      return { status: r.status, body: r.body ?? {}, headers: { "x-request-id": String((init.headers as Record<string, string>)["x-request-id"]) } };
    },
  };
}

function makeDeps(transport: (url: string, init: RequestInit) => Promise<TransportResponse>) {
  const logLines: string[] = [];
  const errorLines: string[] = [];
  return {
    logLines,
    errorLines,
    deps: {
      transport,
      log: (l: string) => logLines.push(l),
      error: (l: string) => errorLines.push(l),
    },
  };
}

/** Handlers for the full success path. */
function successHandlers() {
  return {
    "/api/health": () => ({ status: 200, body: { healthy: true } }),
    "/api/health/broker": () => ({ status: 200, body: { status: "ok", broker: "binance", latency_ms: 12 } }),
    "/api/auth/session": () => ({ status: 200, body: { authenticated: true, csrf: "csrf-token-123" } }),
    "/api/live/orders": () => ({ status: 200, body: { ok: true, clientOrderId: "smoke-x", status: "new" } }),
    "/api/live/positions/close": () => ({ status: 200, body: { ok: true } }),
  };
}

describe("parseArgs", () => {
  test("env-only valid config passes", () => {
    const p = parseArgs([], { SMOKE_BASE_URL: "https://maws.example.com/", SMOKE_SESSION: SESSION });
    expect(p.errors).toEqual([]);
    expect(p.config?.baseUrl).toBe("https://maws.example.com");
    expect(p.config?.symbol).toBe("BTCUSDT");
    expect(p.config?.qty).toBe("0.001");
  });

  test("flags override env; trailing slashes stripped", () => {
    const p = parseArgs(["--base-url", "http://localhost:3000/", "--symbol", "ethusdt", "--qty", "0.002"], {
      SMOKE_BASE_URL: "https://maws.example.com",
      SMOKE_SESSION: SESSION,
    });
    expect(p.errors).toEqual([]);
    expect(p.config).toEqual({
      baseUrl: "http://localhost:3000",
      sessionId: SESSION,
      symbol: "ETHUSDT",
      qty: "0.002",
      timeoutMs: 15000,
    });
  });

  test("live run without base URL or session is a usage error (exit 2)", () => {
    expect(parseArgs([], {}).errors.length).toBeGreaterThanOrEqual(2);
    const p = parseArgs([], { SMOKE_BASE_URL: "https://x.example.com" });
    expect(p.config).toBeNull();
    expect(p.errors.some((e) => e.includes("SMOKE_SESSION"))).toBe(true);
  });

  test("dry-run works with no configuration at all", () => {
    const p = parseArgs(["--dry-run"], {});
    expect(p.errors).toEqual([]);
    expect(p.config?.sessionId).toBe("");
  });

  test("rejects malformed values", () => {
    expect(parseArgs([], { SMOKE_BASE_URL: "ftp://x" }).errors.length).toBeGreaterThan(0);
    expect(parseArgs([], { SMOKE_BASE_URL: "https://x", SMOKE_SESSION: "xyz" }).errors.length).toBeGreaterThan(0);
    expect(parseArgs([], { SMOKE_BASE_URL: "https://x", SMOKE_SESSION: SESSION, SMOKE_SYMBOL: "BAD SYM!" }).errors.length).toBeGreaterThan(0);
    expect(parseArgs([], { SMOKE_BASE_URL: "https://x", SMOKE_SESSION: SESSION, SMOKE_QTY: "-1" }).errors.length).toBeGreaterThan(0);
    expect(parseArgs(["--timeout-ms", "0"], { SMOKE_BASE_URL: "https://x", SMOKE_SESSION: SESSION }).errors.length).toBeGreaterThan(0);
    expect(parseArgs(["--wat"], { SMOKE_BASE_URL: "https://x", SMOKE_SESSION: SESSION }).errors[0]).toContain("unknown argument");
  });
});

describe("runSmoke", () => {
  test("full success path: sequence, auth headers, summary, ok=true", async () => {
    const fake = fakeTransport(successHandlers());
    const { deps, logLines } = makeDeps(fake.transport);
    const result = await runSmoke(baseConfig(), deps);

    expect(result.ok).toBe(true);
    expect(result.clientOrderId).toMatch(/^smoke-/);
    expect(result.requestId).toMatch(/^[0-9a-f-]{36}$/);
    expect(result.steps.map((s) => s.step)).toEqual([
      "health",
      "broker-health",
      "session",
      "submit-order",
      "close-position",
    ]);
    expect(result.steps.every((s) => s.ok)).toBe(true);

    // Request sequence and correlation headers.
    expect(fake.calls.map((c) => new URL(c.url).pathname)).toEqual([
      "/api/health",
      "/api/health/broker",
      "/api/auth/session",
      "/api/live/orders",
      "/api/live/positions/close",
    ]);
    const orderCall = fake.calls[3];
    const headers = orderCall.init.headers as Record<string, string>;
    expect(headers.cookie).toBe("__Host-maws.session=" + SESSION); // https → __Host- cookie
    expect(headers.origin).toBe("https://smoke.example.com");
    expect(headers["x-maws-csrf"]).toBe("csrf-token-123"); // captured from step 3
    expect(headers["x-request-id"]).toBe(result.requestId);

    const summaryLine = logLines.at(-1)!;
    const summary = JSON.parse(summaryLine) as { event: string; ok: boolean; client_order_id: string | null };
    expect(summary.event).toBe("smoke.run");
    expect(summary.ok).toBe(true);
    expect(summary.client_order_id).toBe(result.clientOrderId);
    expect(summaryLine).not.toContain(SESSION); // never leak the session id
  });

  test("http origin uses plain cookie name", async () => {
    const fake = fakeTransport(successHandlers());
    const { deps } = makeDeps(fake.transport);
    const result = await runSmoke(baseConfig({ baseUrl: "http://smoke.example.com" }), deps);
    expect(result.ok).toBe(true);
    const headers = fake.calls[3].init.headers as Record<string, string>;
    expect(headers.cookie).toBe("maws.session=" + SESSION);
  });

  test("health failure aborts before any order is submitted", async () => {
    const fake = fakeTransport({
      "/api/health": () => ({ status: 503, body: { healthy: false } }),
      "/api/live/orders": () => ({ status: 200, body: { ok: true } }),
    });
    const { deps } = makeDeps(fake.transport);
    const result = await runSmoke(baseConfig(), deps);

    expect(result.ok).toBe(false);
    expect(result.failure).toContain("health");
    expect(fake.calls.map((c) => new URL(c.url).pathname)).toEqual(["/api/health"]);
  });

  test("broker degraded (503) aborts the run", async () => {
    const fake = fakeTransport({
      "/api/health": () => ({ status: 200, body: { healthy: true } }),
      "/api/health/broker": () => ({ status: 503, body: { status: "degraded" } }),
      "/api/live/orders": () => ({ status: 200, body: { ok: true } }),
    });
    const { deps } = makeDeps(fake.transport);
    const result = await runSmoke(baseConfig(), deps);
    expect(result.ok).toBe(false);
    expect(result.failure).toContain("broker-health");
    expect(fake.calls.map((c) => new URL(c.url).pathname)).toEqual(["/api/health", "/api/health/broker"]);
  });

  test("order rejection (422) aborts before the close attempt", async () => {
    const fake = fakeTransport({
      ...successHandlers(),
      "/api/live/orders": () => ({ status: 422, body: { error: { code: "risk", message: "notional cap" } } }),
    });
    const { deps } = makeDeps(fake.transport);
    const result = await runSmoke(baseConfig(), deps);
    expect(result.ok).toBe(false);
    expect(result.failure).toContain("submit-order");
    expect(fake.calls.map((c) => new URL(c.url).pathname)).not.toContain("/api/live/positions/close");
  });

  test("failed close is reported even though the order succeeded (loud failure)", async () => {
    const fake = fakeTransport({
      ...successHandlers(),
      "/api/live/positions/close": () => ({ status: 503, body: { error: { code: "circuit_open" } } }),
    });
    const { deps } = makeDeps(fake.transport);
    const result = await runSmoke(baseConfig(), deps);
    expect(result.ok).toBe(false);
    expect(result.failure).toContain("close-position");
    expect(result.failure).toContain("POSITION MAY REMAIN OPEN");
  });

  test("transport errors (network down) become step failures, not crashes", async () => {
    const { deps } = makeDeps(async () => {
      throw new Error("ECONNREFUSED");
    });
    const result = await runSmoke(baseConfig(), deps);
    expect(result.ok).toBe(false);
    expect(result.failure).toContain("health");
    expect(result.steps[0].detail).toContain("ECONNREFUSED");
  });

  test("close sends the correct body; symbol is normalized to uppercase", async () => {
    const fake = fakeTransport(successHandlers());
    const { deps } = makeDeps(fake.transport);
    const result = await runSmoke(baseConfig({ symbol: "ethusdt", qty: "0.05" }), deps);
    expect(result.ok).toBe(true);

    const orderInit = JSON.parse(String(fake.calls[3].init.body)) as Record<string, unknown>;
    expect(orderInit).toEqual({
      symbol: "ETHUSDT",
      side: "BUY",
      type: "MARKET",
      qty: "0.05",
      clientOrderId: expect.stringMatching(/^smoke-/),
    });
    const closeInit = JSON.parse(String(fake.calls[4].init.body)) as Record<string, unknown>;
    expect(closeInit).toEqual({ symbol: "ETHUSDT" });
  });
});

describe("runCli", () => {
  test("--help exits 0 and prints usage", async () => {
    const { deps, logLines } = makeDeps(fakeTransport(successHandlers()).transport);
    const code = await runCli(["--help"], {}, deps);
    expect(code).toBe(0);
    expect(logLines.join("\n")).toContain("Usage:");
  });

  test("--dry-run exits 0, sends nothing, prints the plan", async () => {
    const fake = fakeTransport(successHandlers());
    const { deps, logLines } = makeDeps(fake.transport);
    const code = await runCli(["--dry-run", "--base-url", "https://maws.example.com"], {}, deps);
    expect(code).toBe(0);
    expect(fake.calls).toEqual([]); // zero requests
    expect(logLines.join("\n")).toContain("/api/live/orders");
    expect(logLines.join("\n")).toContain("dry run");
  });

  test("--dry-run with zero configuration exits 0", async () => {
    const fake = fakeTransport(successHandlers());
    const { deps } = makeDeps(fake.transport);
    expect(await runCli(["--dry-run"], {}, deps)).toBe(0);
    expect(fake.calls).toEqual([]);
  });

  test("missing config exits 2 with error lines and no requests", async () => {
    const fake = fakeTransport(successHandlers());
    const { deps, errorLines } = makeDeps(fake.transport);
    const code = await runCli([], {}, deps);
    expect(code).toBe(2);
    expect(errorLines.length).toBeGreaterThan(0);
    expect(fake.calls).toEqual([]);
  });

  test("full happy path via CLI exits 0", async () => {
    const fake = fakeTransport(successHandlers());
    const { deps } = makeDeps(fake.transport);
    const code = await runCli(
      ["--base-url", "https://maws.example.com", "--session", SESSION],
      {},
      deps,
    );
    expect(code).toBe(0);
  });

  test("smoke failure via CLI exits 1", async () => {
    const fake = fakeTransport({
      "/api/health": () => ({ status: 503, body: { healthy: false } }),
    });
    const { deps } = makeDeps(fake.transport);
    const code = await runCli(["--base-url", "https://maws.example.com", "--session", SESSION], {}, deps);
    expect(code).toBe(1);
  });

  test("env-configured run exits 0 without flags", async () => {
    const fake = fakeTransport(successHandlers());
    const { deps } = makeDeps(fake.transport);
    const code = await runCli([], { SMOKE_BASE_URL: "http://localhost:3000", SMOKE_SESSION: SESSION }, deps);
    expect(code).toBe(0);
    const headers = fake.calls[3].init.headers as Record<string, string>;
    expect(headers.cookie).toBe("maws.session=" + SESSION);
  });
});

describe("helpers", () => {
  test("describePlan lists all five steps with the configured symbol/qty", () => {
    const plan = describePlan(baseConfig({ symbol: "SOLUSDT", qty: "0.5" }));
    expect(plan).toHaveLength(5);
    expect(plan.join("\n")).toContain("SOLUSDT");
    expect(plan.join("\n")).toContain("0.5");
  });

  test("formatSummary emits one JSON line without secrets", () => {
    const line = formatSummary({
      ok: false,
      failure: "close-position: expected 200, got 503",
      requestId: "rid-1",
      durationMs: 123,
      steps: [{ step: "health", ok: true, status: 200, durationMs: 5 }],
    });
    const parsed = JSON.parse(line) as { event: string; ok: boolean; failure?: string };
    expect(parsed.event).toBe("smoke.run");
    expect(parsed.ok).toBe(false);
    expect(parsed.failure).toContain("close-position");
    expect(line).not.toContain(SESSION);
  });
});
