import { NextRequest, NextResponse } from "next/server";
import { serverConfig, HOST_MAP, safeProfileMetadata } from "@/lib/server/env/config";
import { authenticate, isAuthFailure } from "@/lib/server/http/guards";
import { compareSecretTokens } from "@/lib/server/auth/token";

export const dynamic = "force-dynamic";

/**
 * Field descriptions for the config response.
 * Each key maps to a human-readable description.
 */
const FIELD_DESCRIPTIONS: Record<string, string> = {
  env: "Runtime environment (local, testnet, shadow, production)",
  defaultProfile: "Default profile metadata (does not switch the startup environment)",
  activeProfileId: "Profile identity derived from the startup environment; shadow is internal-only",
  brokerType: "Broker type (currently only 'binance' supported)",
  dbPath: "Path to the SQLite database file",
  operatorAuth: "Operator authentication credentials (salt:hash format)",
  allowedOrigin: "Allowed CORS origin for browser requests",
  trustProxy: "Whether to trust X-Forwarded-For header for client IP",
  executionEnabledStatic: "Whether order execution is statically enabled",
  recvWindowMs: "Binance API request validity window in milliseconds",
  rateInternalPerMin: "Maximum internal requests per minute",
  reconIntervalMs: "Interval between reconciliation runs in milliseconds",
  leaseTtlMs: "Lease time-to-live for distributed locking in milliseconds",
  snapshotMaxAgeMs: "Maximum age of the authoritative account snapshot in milliseconds",
  alertWebhookUrl: "Webhook URL for alert notifications",
  "risk.maxOrderNotionalUsd": "Maximum order size in USD",
  "risk.maxGrossExposureUsd": "Maximum total exposure across all positions in USD",
  "risk.maxOpenOrders": "Maximum number of open orders allowed",
  "risk.maxOpenPositions": "Maximum number of open positions allowed",
  "risk.dailyLossPct": "Daily loss limit as percentage (triggers freeze)",
  "risk.priceCollarPct": "Price deviation collar percentage for validation",
  "circuitBreaker.restFailureThreshold": "REST API breaker: failures before opening",
  "circuitBreaker.restFailureWindowMs": "REST API breaker: failure counting window in ms",
  "circuitBreaker.restRecoveryTimeoutMs": "REST API breaker: recovery timeout in ms",
  "circuitBreaker.restSuccessThreshold": "REST API breaker: successes needed to close",
  "circuitBreaker.streamFailureThreshold": "WebSocket breaker: failures before opening",
  "circuitBreaker.streamFailureWindowMs": "WebSocket breaker: failure counting window in ms",
  "circuitBreaker.streamRecoveryTimeoutMs": "WebSocket breaker: recovery timeout in ms",
  "circuitBreaker.streamSuccessThreshold": "WebSocket breaker: successes needed to close",
  "circuitBreaker.reconFailureThreshold": "Reconciliation breaker: failures before opening",
  "circuitBreaker.reconFailureWindowMs": "Reconciliation breaker: failure counting window in ms",
  "circuitBreaker.reconRecoveryTimeoutMs": "Reconciliation breaker: recovery timeout in ms",
  "circuitBreaker.reconSuccessThreshold": "Reconciliation breaker: successes needed to close",
};

/**
 * Pattern to detect sensitive fields that should be redacted.
 * Matches field names containing: key, secret, token, signature, password
 */
const SENSITIVE_PATTERN = /key|secret|token|signature|password/i;

/**
 * Redacts sensitive string values in an object.
 * Fields matching the SENSITIVE_PATTERN are replaced with "[REDACTED]".
 * Non-string values and Buffer objects are handled specially.
 */
function redactSensitive<T>(obj: T, path = ""): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Buffer.isBuffer(obj)) {
    // Buffers are always redacted (could contain keys)
    return "[REDACTED]" as T;
  }

  if (typeof obj === "string") {
    // Check if the path indicates a sensitive field
    const fieldName = path.split(".").pop() || "";
    if (SENSITIVE_PATTERN.test(fieldName)) {
      return "[REDACTED]" as T;
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item, index) =>
      redactSensitive(item, `${path}[${index}]`)
    ) as T;
  }

  if (typeof obj === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      const newPath = path ? `${path}.${key}` : key;

      // Check if this key indicates a sensitive field
      if (SENSITIVE_PATTERN.test(key)) {
        result[key] = "[REDACTED]";
      } else if (Buffer.isBuffer(value)) {
        result[key] = "[REDACTED]";
      } else if (typeof value === "object" && value !== null) {
        result[key] = redactSensitive(value, newPath);
      } else {
        result[key] = value;
      }
    }
    return result as T;
  }

  return obj;
}

/** Keep the server-only profile registry out of the response entirely. */
function safeConfigResponse(cfg: ReturnType<typeof serverConfig>): unknown {
  const { profiles, ...configWithoutProfiles } = cfg;
  void profiles;
  return redactSensitive(configWithoutProfiles);
}

/**
 * GET /api/admin/config
 * Returns non-secret runtime configuration as JSON.
 *
 * Authentication:
 * - Local mode: No authentication required for safe config/profile metadata
 * - Non-local mode: Requires operator authentication OR health token
 *
 * Response shape:
 * {
 *   config: { ... redacted config ... },
 *   descriptions: { "field.path": "description", ... },
 *   host: { rest: string, uds: string, label: string }
 * }
 */
export async function GET(req: NextRequest) {
  let cfg;
  try {
    cfg = serverConfig();
  } catch {
    return NextResponse.json(
      { error: "Server configuration invalid" },
      { status: 503 }
    );
  }

  // Local mode exposes redacted startup config and safe profile metadata.
  if (cfg.env === "local") {
    return NextResponse.json({
      config: safeConfigResponse(cfg),
      profileMetadata: safeProfileMetadata(cfg.profiles),
      descriptions: FIELD_DESCRIPTIONS,
      host: HOST_MAP[cfg.env],
      note: "Local Chart Only - attach a configured Binance profile from the authenticated UI.",
    });
  }

  // Non-local mode: check authentication
  const ctx = authenticate(req, cfg);
  const headerToken = req.headers.get("x-maws-health-token");
  const tokenValid = compareSecretTokens(headerToken, cfg.healthToken);

  if (isAuthFailure(ctx) && !tokenValid) {
    return ctx.response;
  }

  return NextResponse.json({
    config: safeConfigResponse(cfg),
    profileMetadata: safeProfileMetadata(cfg.profiles),
    descriptions: FIELD_DESCRIPTIONS,
    host: HOST_MAP[cfg.env],
  });
}
