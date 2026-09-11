import "server-only";

import { redact } from "../audit/redact";
import { currentRequestId } from "../http/request-id";

export type Level = "debug" | "info" | "warn" | "error";

const LEVEL_RANK: Record<Level, number> = { debug: 10, info: 20, warn: 30, error: 40 };

function minLevel(): number {
  const raw = (process.env.MAWS_LOG_LEVEL ?? "info").toLowerCase();
  return LEVEL_RANK[(raw as Level) in LEVEL_RANK ? (raw as Level) : "info"];
}

/**
 * Format a Date into 12-hour timestamp: [YYYY-MM-DD hh:mm:ss AM/PM]
 */
export function formatTimestamp(date = new Date()): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  let hours = date.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const hh = String(hours).padStart(2, "0");
  const mins = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `[${yyyy}-${mm}-${dd} ${hh}:${mins}:${ss} ${ampm}]`;
}

/**
 * Resolve domain icon based on event topic without text labeling.
 */
export function resolveDomainIcon(msg: string, fields?: Record<string, unknown>): string {
  const m = msg.toLowerCase();
  const name = String(fields?.name ?? "").toLowerCase();
  const event = String(fields?.event ?? "").toLowerCase();

  // Market & Trading data
  if (
    m.includes("market") ||
    m.includes("ticker") ||
    m.includes("kline") ||
    m.includes("metadata") ||
    m.includes("symbol") ||
    m.includes("candle") ||
    m.includes("orderbook") ||
    name.includes("stream") ||
    m.includes("exchange metadata")
  ) {
    return "📈";
  }

  // Clock & Sync timing
  if (
    m.includes("clock") ||
    m.includes("synced") ||
    "offsetMs" in (fields ?? {}) ||
    "rttMs" in (fields ?? {})
  ) {
    return "⏱️";
  }

  // Safety & Circuit breakers
  if (
    m.includes("circuit breaker") ||
    m.includes("breaker") ||
    m.includes("guard") ||
    m.includes("resilience") ||
    name.includes("rest") ||
    name.includes("reconciliation")
  ) {
    return "🛡️";
  }

  // HTTP & API Requests
  if (
    m.includes("http") ||
    m.includes("request") ||
    event.includes("request") ||
    m.includes("api") ||
    m.includes("mutation") ||
    "path" in (fields ?? {}) ||
    "method" in (fields ?? {})
  ) {
    return "🌐";
  }

  // Config, Auth & Security
  if (
    m.includes("config") ||
    m.includes("security") ||
    m.includes("auth") ||
    m.includes("session") ||
    m.includes("csrf") ||
    "env" in (fields ?? {})
  ) {
    return "🔐";
  }

  // Database & Backup
  if (
    m.includes("backup") ||
    m.includes("database") ||
    m.includes("sqlite") ||
    m.includes("persist")
  ) {
    return "💾";
  }

  // System Lifecycle & Management
  return "⚙️";
}

/**
 * Resolve status indicator icon (success, info, warning, error, action).
 */
export function resolveStatusIcon(level: Level, msg: string, fields?: Record<string, unknown>): string {
  if (level === "error") return "✗";
  if (level === "warn") return "⚠";

  const m = msg.toLowerCase();
  const outcome = String(fields?.outcome ?? "").toLowerCase();

  if (outcome === "error" || outcome.startsWith("4") || outcome.startsWith("5")) return "✗";
  if (outcome === "ok" || outcome === "200") return "✓";

  if (
    m.includes("starting") ||
    m.includes("initializing") ||
    m.includes("connecting") ||
    m.includes("testing")
  ) {
    return "ℹ";
  }

  if (
    m.includes("ready") ||
    m.includes("synced") ||
    m.includes("completed") ||
    m.includes("success") ||
    m.includes("initialized") ||
    m.includes("refreshed") ||
    m.includes("loaded") ||
    m.includes("connected")
  ) {
    return "✓";
  }

  if ("method" in (fields ?? {}) || "path" in (fields ?? {})) {
    return "→";
  }

  return "ℹ";
}

/**
 * Formats known technical events into clean human-friendly English.
 */
export function formatFriendlyMessage(msg: string, fields?: Record<string, unknown>): string {
  // Clock synchronization
  if (msg === "clock synced") {
    const offset = Number(fields?.offsetMs ?? 0);
    const sign = offset >= 0 ? "+" : "";
    const ping = fields?.rttMs ?? "?";
    return `Binance clock synchronized (offset: ${sign}${offset}ms, ping: ${ping}ms)`;
  }

  // Exchange metadata catalog
  if (msg === "exchange metadata refreshed") {
    const symbols = fields?.symbols ?? "?";
    return `Market catalog updated (${symbols} active trading pairs)`;
  }

  // Circuit breaker initialization
  if (msg === "circuit breaker initialized") {
    const name = String(fields?.name ?? "service");
    const cfg = (fields?.config ?? {}) as Record<string, unknown>;
    const threshold = cfg.failureThreshold ?? 5;
    const winSec = cfg.failureWindowMs ? `${Math.round(Number(cfg.failureWindowMs) / 1000)}s` : "60s";
    const recSec = cfg.recoveryTimeoutMs ? `${Math.round(Number(cfg.recoveryTimeoutMs) / 1000)}s` : "30s";
    const displayName =
      name === "binance-rest"
        ? "Binance REST"
        : name === "binance-stream"
          ? "Binance Stream"
          : name === "reconciliation"
            ? "Reconciliation"
            : name;
    return `Armed safety guard for ${displayName} (${threshold} failures/${winSec} threshold, ${recSec} recovery)`;
  }

  // Circuit breaker state changes
  if (msg === "circuit breaker entering half-open (testing recovery)") {
    return `Safety guard testing recovery for ${fields?.name ?? "service"}`;
  }
  if (msg === "circuit breaker closed (recovery successful)") {
    return `Safety guard restored normal operation for ${fields?.name ?? "service"}`;
  }
  if (msg === "circuit breaker manually reset") {
    return `Safety guard manually reset for ${fields?.name ?? "service"}`;
  }

  // Live manager
  if (msg === "live manager ready (public data only)") {
    return "Live market feed online (public data mode)";
  }
  if (msg === "live manager ready") {
    return `Live market feed online (environment: ${fields?.env ?? "production"})`;
  }
  if (msg === "live manager started successfully" || msg === "live market manager started successfully") {
    return "Live market feed manager started successfully";
  }

  // Ticker batch
  if (msg === "ticker batch completed") {
    const count = fields?.count ?? 0;
    const dur = fields?.durationMs ?? 0;
    const passed = fields?.passed ?? count;
    const failed = fields?.failed ?? 0;
    // Only show failed keys in main line if we don't have detailed tree expansion
    const hasDetailedTree = Array.isArray(fields?.failedDetails) && fields.failedDetails.length > 0;
    const failedKeys = !hasDetailedTree && Array.isArray(fields?.failedKeys) && fields.failedKeys.length > 0
      ? `: ${fields.failedKeys.join(", ")}`
      : "";
    return `Fetched ticker for ${count} symbols in ${dur}ms (${passed} ok, ${failed} failed${failedKeys})`;
  }

  // Klines batch
  if (msg === "klines batch completed") {
    const count = fields?.count ?? 0;
    const dur = fields?.durationMs ?? 0;
    const passed = fields?.passed ?? count;
    const failed = fields?.failed ?? 0;
    // Only show failed keys in main line if we don't have detailed tree expansion
    const hasDetailedTree = Array.isArray(fields?.failedDetails) && fields.failedDetails.length > 0;
    const failedKeys = !hasDetailedTree && Array.isArray(fields?.failedKeys) && fields.failedKeys.length > 0
      ? `: ${fields.failedKeys.join(", ")}`
      : "";
    return `Fetched klines for ${count} intervals in ${dur}ms (${passed} ok, ${failed} failed${failedKeys})`;
  }

  // Health batch
  if (msg === "health batch completed") {
    const count = fields?.count ?? 0;
    const dur = fields?.durationMs ?? 0;
    const passed = fields?.passed ?? count;
    const failed = fields?.failed ?? 0;
    // Only show failed keys in main line if we don't have detailed tree expansion
    const hasDetailedTree = Array.isArray(fields?.failedDetails) && fields.failedDetails.length > 0;
    const failedKeys = !hasDetailedTree && Array.isArray(fields?.failedKeys) && fields.failedKeys.length > 0
      ? `: ${fields.failedKeys.join(", ")}`
      : "";
    return `Completed ${count} system health checks in ${dur}ms (${passed} ok, ${failed} failed${failedKeys})`;
  }

  // Single HTTP access
  if (fields?.event === "http.access") {
    const method = fields?.method ?? "GET";
    const path = fields?.path ?? "";
    const status = fields?.status ?? 200;
    const dur = fields?.durationMs ? ` (${fields.durationMs}ms)` : "";
    return `${method} ${path} → ${status}${dur}`;
  }

  // Live mutation requests
  if (fields?.event === "live.mutation.request") {
    const method = fields?.method ?? "POST";
    const path = fields?.path ?? "";
    const outcome = fields?.outcome ?? "ok";
    const dur = fields?.duration_ms ? ` (${fields.duration_ms}ms)` : "";
    const symbol = fields?.symbol ? ` [${fields.symbol}]` : "";
    return `${method} ${path}${symbol} → ${outcome}${dur}`;
  }

  // Generic messages with clean scalar fields
  if (fields && Object.keys(fields).length > 0) {
    const pairs: string[] = [];
    for (const [key, val] of Object.entries(fields)) {
      if (typeof val === "function") continue;
      if (typeof val === "object" && val !== null) continue;
      pairs.push(`${key}: ${String(val)}`);
    }
    if (pairs.length > 0) {
      return `${msg} (${pairs.join(", ")})`;
    }
  }

  return msg;
}

/**
 * Resolve standard text status label based on log level.
 */
export function resolveStatusLabel(level: Level): string {
  switch (level) {
    case "error":
      return "[ERROR]";
    case "warn":
      return "[WARN]";
    case "debug":
      return "[DEBUG]";
    case "info":
    default:
      return "[INFO]";
  }
}

/**
 * Format a list of sub-items into tree branches (  ├─ and   └─).
 */
export function formatTreeLines(items: string[]): string[] {
  return items.map((item, idx) => {
    const isLast = idx === items.length - 1;
    const branch = isLast ? "  └─ " : "  ├─ ";
    return `${branch}${item}`;
  });
}

/**
 * Automatically unfolds failure, error, or diagnostic details as an indented sub-tree.
 */
export function formatSubTreeDetails(
  level: Level,
  msg: string,
  fields?: Record<string, unknown>,
): string[] {
  if (!fields) return [];
  const lines: string[] = [];

  // 1. Ticker / Kline batch with failedDetails
  if (Array.isArray(fields.failedDetails) && fields.failedDetails.length > 0) {
    for (const item of fields.failedDetails as Array<{ key: string; reason: string }>) {
      lines.push(`${item.key}: ${item.reason}`);
    }
    return formatTreeLines(lines);
  }

  // 2. Ticker / Kline batch with failedKeys fallback
  if (Array.isArray(fields.failedKeys) && fields.failedKeys.length > 0) {
    for (const key of fields.failedKeys) {
      lines.push(`${key}: Request failed or invalid`);
    }
    return formatTreeLines(lines);
  }

  // 3. Circuit breaker opened / tripped
  if (msg === "circuit breaker opened") {
    const count = fields.failureCount ?? "?";
    const threshold = fields.threshold ?? "?";
    lines.push(`Trigger: ${count} failures hit limit of ${threshold}`);
    lines.push(`Action: Circuit opened, further calls rejected to prevent cascading errors`);
    return formatTreeLines(lines);
  }

  // 4. Circuit breaker entering half-open (testing recovery)
  if (msg === "circuit breaker entering half-open (testing recovery)") {
    const threshold = fields.successThreshold ?? 1;
    lines.push(`State: HALF-OPEN cooldown elapsed`);
    lines.push(`Testing: Need ${threshold} successful call(s) to restore full service`);
    return formatTreeLines(lines);
  }

  // 5. General Errors, Warnings, or any message carrying error/failure fields
  if (level === "error" || level === "warn" || fields.error || fields.err || fields.reason) {
    for (const [key, val] of Object.entries(fields)) {
      if (val === undefined || val === null) continue;
      if (typeof val === "function") continue;
      if (
        key === "name" ||
        key === "event" ||
        key === "count" ||
        key === "passed" ||
        key === "failed" ||
        key === "durationMs" ||
        key === "failedDetails" ||
        key === "failedKeys"
      ) {
        continue;
      }

      const label = key.charAt(0).toUpperCase() + key.slice(1);
      const strVal = typeof val === "object" ? JSON.stringify(val) : String(val);
      lines.push(`${label}: ${strVal}`);
    }
    if (lines.length > 0) {
      return formatTreeLines(lines);
    }
  }

  // 6. Enhanced: Show all object fields for any failed operations
  if (fields.failed && Number(fields.failed) > 0) {
    for (const [key, val] of Object.entries(fields)) {
      if (val === undefined || val === null) continue;
      if (typeof val === "function") continue;
      if (
        key === "name" ||
        key === "event" ||
        key === "count" ||
        key === "passed" ||
        key === "failed" ||
        key === "durationMs" ||
        key === "failedDetails" ||
        key === "failedKeys"
      ) {
        continue;
      }

      const label = key.charAt(0).toUpperCase() + key.slice(1);
      const strVal = typeof val === "object" ? JSON.stringify(val) : String(val);
      lines.push(`${label}: ${strVal}`);
    }
    if (lines.length > 0) {
      return formatTreeLines(lines);
    }
  }

  return [];
}

/**
 * Format a complete terminal line with timestamp, text status label, and optional error sub-tree.
 */
export function formatTerminalLine(
  level: Level,
  msg: string,
  fields?: Record<string, unknown>,
  date = new Date(),
): string {
  const ts = formatTimestamp(date);
  const statusLabel = resolveStatusLabel(level);
  const text = formatFriendlyMessage(msg, fields);
  const mainLine = `${ts} ${statusLabel} ${text}`;

  const subLines = formatSubTreeDetails(level, msg, fields);
  if (subLines.length > 0) {
    return `${mainLine}\n${subLines.join("\n")}`;
  }
  return mainLine;
}

function emit(level: Level, msg: string, fields?: Record<string, unknown>): void {
  if (LEVEL_RANK[level] < minLevel()) return;

  const isTest = process.env.NODE_ENV === "test";
  const forceJson = process.env.MAWS_LOG_FORMAT === "json";

  if (isTest || forceJson) {
    const requestId = currentRequestId();
    const line = JSON.stringify({
      ts: new Date().toISOString(),
      level,
      msg,
      // Correlation ID bound by runWithRequestId(); absent for background work.
      ...(requestId ? { request_id: requestId } : {}),
      ...(fields ? { fields: redact(fields) } : {}),
    });
    process.stdout.write(line + "\n");
    return;
  }

  const cleanFields = fields ? redact(fields) : undefined;
  const line = formatTerminalLine(level, msg, cleanFields);
  process.stdout.write(line + "\n");
}

export const log = {
  debug: (msg: string, fields?: Record<string, unknown>) => emit("debug", msg, fields),
  info: (msg: string, fields?: Record<string, unknown>) => emit("info", msg, fields),
  warn: (msg: string, fields?: Record<string, unknown>) => emit("warn", msg, fields),
  error: (msg: string, fields?: Record<string, unknown>) => emit("error", msg, fields),
};
