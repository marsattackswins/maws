import "server-only";

import { log } from "./logger";
import { attachRequestId, extractRequestId, runWithRequestId } from "../http/request-id";
import { trackApiError, trackApiLatency, trackApiRequest } from "../metrics/instrument";

/**
 * Structured JSON request logging for live mutation endpoints.
 *
 * Emits exactly one JSON line per request with:
 *   method, path, symbol, clientOrderId (when known), duration_ms, outcome.
 *
 * `outcome` is derived from the resolved Response:
 *   - status < 400            → "ok"
 *   - status === 503          → "503"
 *   - anything else (4xx/5xx) → "error"
 * A thrown handler (unhandled exception) logs outcome "error" and rethrows,
 * preserving the framework's default error handling.
 *
 * Fields pass through the existing JSON-lines logger, which applies audit
 * redaction (symbol/clientOrderId are not treated as secrets; raw keys,
 * tokens, and other sensitive values never reach the log).
 */

export type MutationOutcome = "ok" | "503" | "error";

/** Emit the single structured request line. Kept tiny and non-blocking. */
export function logLiveMutation(
  method: string,
  path: string,
  info: { symbol?: string; clientOrderId?: string },
  durationMs: number,
  outcome: MutationOutcome,
  level: "info" | "warn" | "error" = "info",
  extra: Record<string, unknown> = {},
): void {
  log[level]("live.mutation.request", {
    event: "live.mutation.request",
    method,
    path,
    symbol: info.symbol,
    clientOrderId: info.clientOrderId,
    duration_ms: durationMs,
    outcome,
    ...extra,
  });
}

/** Times the handler, derives the outcome, logs one line, returns the response. */
export async function withMutationLog(
  req: Request,
  run: (ctx: { symbol?: string; clientOrderId?: string }) => Promise<Response>,
): Promise<Response> {
  // Correlation: extract (or mint) the request ID, bind it so every log line
  // emitted during the handler carries request_id, and echo it back to the
  // client on the response — including error and 503 paths.
  const requestId = extractRequestId(req);
  return runWithRequestId(requestId, async () => {
    const started = Date.now();
    const ctx: { symbol?: string; clientOrderId?: string } = {};
    const path = new URL(req.url).pathname;
    trackApiRequest();

    let res: Response;
    try {
      res = await run(ctx);
    } catch (err) {
      const durationMs = Date.now() - started;
      trackApiLatency(path, durationMs);
      trackApiError(path, "unhandled", err instanceof Error ? err.message : String(err));
      logLiveMutation(req.method, path, ctx, durationMs, "error", "error", {
        message: err instanceof Error ? err.message : String(err),
      });
      throw err;
    }

    const durationMs = Date.now() - started;
    const outcome: MutationOutcome = res.status < 400 ? "ok" : res.status === 503 ? "503" : "error";
    const level = outcome === "ok" ? "info" : outcome === "503" ? "warn" : "warn";
    trackApiLatency(path, durationMs);
    if (res.status >= 400) trackApiError(path, res.status, `HTTP ${res.status}`);
    logLiveMutation(req.method, path, ctx, durationMs, outcome, level, { status: res.status });
    return attachRequestId(res, requestId);
  });
}
