import { describe, test, expect } from "@jest/globals";
import {
  formatTimestamp,
  resolveDomainIcon,
  resolveStatusIcon,
  formatFriendlyMessage,
  formatTerminalLine,
  resolveStatusLabel,
} from "@/lib/server/log/logger";

describe("formatTimestamp", () => {
  test("formats in [YYYY-MM-DD hh:mm:ss AM/PM] 12-hour pattern", () => {
    // 2026-09-06 00:25:45 (Midnight / AM)
    const midnight = new Date(2026, 8, 6, 0, 25, 45);
    expect(formatTimestamp(midnight)).toBe("[2026-09-06 12:25:45 AM]");

    // 2026-09-06 12:05:01 (Noon / PM)
    const noon = new Date(2026, 8, 6, 12, 5, 1);
    expect(formatTimestamp(noon)).toBe("[2026-09-06 12:05:01 PM]");

    // 2026-09-06 15:30:10 (Afternoon / PM)
    const afternoon = new Date(2026, 8, 6, 15, 30, 10);
    expect(formatTimestamp(afternoon)).toBe("[2026-09-06 03:30:10 PM]");
  });
});

describe("resolveDomainIcon", () => {
  test("resolves market icon for ticker/klines/symbols", () => {
    expect(resolveDomainIcon("exchange metadata refreshed", { symbols: 895 })).toBe("📈");
    expect(resolveDomainIcon("fetching ticker", { name: "binance-stream" })).toBe("📈");
  });

  test("resolves clock icon for sync events", () => {
    expect(resolveDomainIcon("clock synced", { offsetMs: 10, rttMs: 200 })).toBe("⏱️");
  });

  test("resolves safety icon for circuit breakers", () => {
    expect(resolveDomainIcon("circuit breaker initialized", { name: "binance-rest" })).toBe("🛡️");
  });

  test("resolves http icon for web/api requests", () => {
    expect(resolveDomainIcon("request", { path: "/api/binance/ticker", method: "GET" })).toBe("🌐");
  });

  test("resolves config/security icon for server config", () => {
    expect(resolveDomainIcon("server config loaded", { env: "local" })).toBe("🔐");
  });

  test("resolves system icon for general lifecycle", () => {
    expect(resolveDomainIcon("server startup routines initializing...")).toBe("⚙️");
  });
});

describe("resolveStatusIcon", () => {
  test("resolves ✓ for ready/synced/initialized/completed", () => {
    expect(resolveStatusIcon("info", "clock synced")).toBe("✓");
    expect(resolveStatusIcon("info", "server startup sequence completed")).toBe("✓");
    expect(resolveStatusIcon("info", "circuit breaker initialized")).toBe("✓");
  });

  test("resolves ℹ for starting/initializing", () => {
    expect(resolveStatusIcon("info", "live market manager starting...")).toBe("ℹ");
  });

  test("resolves ⚠ for warnings", () => {
    expect(resolveStatusIcon("warn", "something slow")).toBe("⚠");
  });

  test("resolves ✗ for errors", () => {
    expect(resolveStatusIcon("error", "database connection failed")).toBe("✗");
  });

  test("resolves → for requests", () => {
    expect(resolveStatusIcon("info", "request", { path: "/api/ticker", method: "GET" })).toBe("→");
  });
});

describe("formatFriendlyMessage", () => {
  test("formats clock sync into clean ping and offset", () => {
    const formatted = formatFriendlyMessage("clock synced", { offsetMs: 103, rttMs: 716 });
    expect(formatted).toBe("Binance clock synchronized (offset: +103ms, ping: 716ms)");
  });

  test("formats exchange metadata catalog", () => {
    const formatted = formatFriendlyMessage("exchange metadata refreshed", { symbols: 895 });
    expect(formatted).toBe("Market catalog updated (895 active trading pairs)");
  });

  test("formats circuit breaker without dumping function code", () => {
    const formatted = formatFriendlyMessage("circuit breaker initialized", {
      name: "binance-rest",
      config: {
        failureThreshold: 5,
        failureWindowMs: 60000,
        recoveryTimeoutMs: 30000,
      },
    });
    expect(formatted).toBe("Armed safety guard for Binance REST (5 failures/60s threshold, 30s recovery)");
  });

  test("formats ticker batch with ok and fail counts", () => {
    const allOk = formatFriendlyMessage("ticker batch completed", {
      count: 8,
      passed: 8,
      failed: 0,
      durationMs: 340,
    });
    expect(allOk).toBe("Fetched ticker for 8 symbols in 340ms (8 ok, 0 failed)");

    const withFails = formatFriendlyMessage("ticker batch completed", {
      count: 10,
      passed: 8,
      failed: 2,
      durationMs: 450,
      failedKeys: ["DOGEUSDT", "SHIBUSDT"],
    });
    expect(withFails).toBe("Fetched ticker for 10 symbols in 450ms (8 ok, 2 failed: DOGEUSDT, SHIBUSDT)");

    const withFailsAndDetails = formatFriendlyMessage("ticker batch completed", {
      count: 10,
      passed: 8,
      failed: 2,
      durationMs: 450,
      failedKeys: ["DOGEUSDT", "SHIBUSDT"],
      failedDetails: [
        { key: "DOGEUSDT", reason: "Timeout" },
        { key: "SHIBUSDT", reason: "Invalid symbol" },
      ],
    });
    expect(withFailsAndDetails).toBe("Fetched ticker for 10 symbols in 450ms (8 ok, 2 failed)");
  });

  test("formats klines batch with intervals and counts", () => {
    const klines = formatFriendlyMessage("klines batch completed", {
      count: 16,
      passed: 16,
      failed: 0,
      durationMs: 480,
    });
    expect(klines).toBe("Fetched klines for 16 intervals in 480ms (16 ok, 0 failed)");
  });

  test("formats health check batch", () => {
    const health = formatFriendlyMessage("health batch completed", {
      count: 3,
      passed: 3,
      failed: 0,
      durationMs: 190,
    });
    expect(health).toBe("Completed 3 system health checks in 190ms (3 ok, 0 failed)");

    const healthWithFails = formatFriendlyMessage("health batch completed", {
      count: 5,
      passed: 3,
      failed: 2,
      durationMs: 250,
      failedKeys: ["binance-api", "clock-sync"],
    });
    expect(healthWithFails).toBe("Completed 5 system health checks in 250ms (3 ok, 2 failed: binance-api, clock-sync)");

    const healthWithDetails = formatFriendlyMessage("health batch completed", {
      count: 5,
      passed: 3,
      failed: 2,
      durationMs: 250,
      failedKeys: ["binance-api", "clock-sync"],
      failedDetails: [
        { key: "binance-api", reason: "500 Internal Server Error" },
        { key: "clock-sync", reason: "Timeout" },
      ],
    });
    expect(healthWithDetails).toBe("Completed 5 system health checks in 250ms (3 ok, 2 failed)");
  });
});

describe("resolveStatusLabel", () => {
  test("returns correct status labels for log levels", () => {
    expect(resolveStatusLabel("info")).toBe("[INFO]");
    expect(resolveStatusLabel("warn")).toBe("[WARN]");
    expect(resolveStatusLabel("error")).toBe("[ERROR]");
    expect(resolveStatusLabel("debug")).toBe("[DEBUG]");
  });
});

describe("formatTerminalLine (status labels instead of icons)", () => {
  test("produces timestamp + status label + text with NO icons or emojis", () => {
    const fixedDate = new Date(2026, 8, 6, 0, 25, 45);
    const lineInfo = formatTerminalLine(
      "info",
      "clock synced",
      { offsetMs: 103, rttMs: 716 },
      fixedDate,
    );

    // Matches timestamp
    expect(lineInfo).toContain("[2026-09-06 12:25:45 AM]");
    // Matches status label
    expect(lineInfo).toContain("[INFO]");
    // Does NOT contain emojis or icons
    expect(lineInfo).not.toMatch(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u);
    expect(lineInfo).toBe("[2026-09-06 12:25:45 AM] [INFO] Binance clock synchronized (offset: +103ms, ping: 716ms)");

    const lineWarn = formatTerminalLine(
      "warn",
      "ticker batch completed",
      {
        count: 10,
        passed: 8,
        failed: 2,
        durationMs: 450,
        failedDetails: [
          { key: "DOGEUSDT", reason: "400 Bad Request" },
          { key: "SHIBUSDT", reason: "504 Gateway Timeout" },
        ],
      },
      fixedDate,
    );
    expect(lineWarn).toContain(
      "[2026-09-06 12:25:45 AM] [WARN] Fetched ticker for 10 symbols in 450ms (8 ok, 2 failed)",
    );
    expect(lineWarn).toContain("  ├─ DOGEUSDT: 400 Bad Request");
    expect(lineWarn).toContain("  └─ SHIBUSDT: 504 Gateway Timeout");
  });

  test("expands failure sub-tree for circuit breaker opened", () => {
    const fixedDate = new Date(2026, 8, 6, 0, 25, 45);
    const line = formatTerminalLine(
      "error",
      "circuit breaker opened",
      { name: "binance-stream", failureCount: 3, threshold: 3 },
      fixedDate,
    );
    expect(line).toContain("  ├─ Trigger: 3 failures hit limit of 3");
    expect(line).toContain("  └─ Action: Circuit opened, further calls rejected to prevent cascading errors");
  });

  test("expands failure sub-tree for generic errors", () => {
    const fixedDate = new Date(2026, 8, 6, 0, 25, 45);
    const line = formatTerminalLine(
      "error",
      "database backup failed",
      { error: "disk full", path: "backup.db" },
      fixedDate,
    );
    expect(line).toContain("  ├─ Error: disk full");
    expect(line).toContain("  └─ Path: backup.db");
  });

  test("expands failure sub-tree for batch failures with additional context", () => {
    const fixedDate = new Date(2026, 8, 6, 0, 25, 45);
    const line = formatTerminalLine(
      "warn",
      "ticker batch completed",
      {
        count: 5,
        passed: 3,
        failed: 2,
        durationMs: 250,
        retryCount: 3,
        endpoint: "/api/v3/ticker",
      },
      fixedDate,
    );
    expect(line).toContain(
      "[2026-09-06 12:25:45 AM] [WARN] Fetched ticker for 5 symbols in 250ms (3 ok, 2 failed)",
    );
    expect(line).toContain("  ├─ RetryCount: 3");
    expect(line).toContain("  └─ Endpoint: /api/v3/ticker");
  });

  test("does not output sub-tree on successful operations", () => {
    const fixedDate = new Date(2026, 8, 6, 0, 25, 45);
    const line = formatTerminalLine(
      "info",
      "clock synced",
      { offsetMs: 103, rttMs: 716 },
      fixedDate,
    );
    expect(line).not.toContain("├─");
    expect(line).not.toContain("└─");
    expect(line).toBe("[2026-09-06 12:25:45 AM] [INFO] Binance clock synchronized (offset: +103ms, ping: 716ms)");
  });
});
