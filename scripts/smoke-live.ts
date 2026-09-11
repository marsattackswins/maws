/**
 * scripts/smoke-live.ts — end-to-end smoke test against a live testnet deployment.
 *
 * Exercises the operator-visible surface in order:
 *   1. GET  /api/health               → 200, healthy=true
 *   2. GET  /api/health/broker        → 200, status="ok"
 *   3. GET  /api/auth/session         → authenticated=true, captures CSRF token
 *   4. POST /api/live/orders          → MARKET BUY, tiny size, unique clientOrderId
 *   5. POST /api/live/positions/close → flat again
 *
 * Exit codes: 0 success (and dry-run), 1 any step failed, 2 usage/config error.
 *
 * Configuration (env, overridable by CLI flags of the same name):
 *   SMOKE_BASE_URL   e.g. https://maws-testnet.example.com  (required for a real run)
 *   SMOKE_SESSION    64-hex operator session id             (required for a real run)
 *   SMOKE_SYMBOL     default BTCUSDT
 *   SMOKE_QTY        default 0.001
 *
 * Auth model: the script authenticates as an operator (session cookie + CSRF),
 * mirroring the browser. The session id and CSRF token are never printed. The
 * cookie name follows the server's rule: __Host-maws.session on https origins,
 * maws.session otherwise. The Origin header must equal the base URL origin —
 * the deployment's MAWS_ALLOWED_ORIGIN must therefore match SMOKE_BASE_URL.
 *
 * Caveat: the close step flattens the ENTIRE position for SMOKE_SYMBOL, not
 * just the smoke order. Run against a testnet account where that symbol
 * carries no other exposure.
 *
 * CI: .github/workflows/ci-smoke.yml runs --dry-run unconditionally (validates
 * the CLI) and the live run only when SMOKE_BASE_URL/SMOKE_SESSION are set.
 *
 * The core is dependency-injected (transport/log) so unit tests drive the full
 * flow with zero network — same pattern as the FakeHttp harness in live-tests.
 */

import crypto from "node:crypto";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SmokeConfig {
  /** Deployment origin, no trailing slash, e.g. https://maws-testnet.example.com */
  baseUrl: string;
  /** 64-hex operator session id (empty in dry-run). */
  sessionId: string;
  symbol: string;
  qty: string;
  /** Per-request timeout in ms. */
  timeoutMs: number;
}

export interface TransportResponse {
  status: number;
  body: unknown;
  headers: Record<string, string>;
}

export type Transport = (url: string, init: RequestInit) => Promise<TransportResponse>;

export interface SmokeDeps {
  transport?: Transport;
  log?: (line: string) => void;
  error?: (line: string) => void;
}

export interface StepOutcome {
  step: string;
  ok: boolean;
  status?: number;
  detail?: string;
  durationMs: number;
}

export interface SmokeResult {
  ok: boolean;
  failure?: string;
  clientOrderId?: string;
  /** Request ID sent as x-request-id; responses may echo it (task #13). */
  requestId?: string;
  durationMs: number;
  steps: StepOutcome[];
}

export interface ParsedArgs {
  config: SmokeConfig | null;
  dryRun: boolean;
  help: boolean;
  errors: string[];
}

// ---------------------------------------------------------------------------
// Config parsing
// ---------------------------------------------------------------------------

const SESSION_ID_RE = /^[0-9a-f]{64}$/;
const SYMBOL_RE = /^[A-Za-z0-9_]{4,20}$/;
const QTY_RE = /^\d+(\.\d+)?$/;

const VALUE_FLAGS = new Set(["--base-url", "--session", "--symbol", "--qty", "--timeout-ms"]);
const KNOWN_FLAGS = new Set([...VALUE_FLAGS, "--help", "-h", "--dry-run"]);

export const USAGE = `smoke-live.ts — end-to-end smoke test against a testnet deployment

Usage: tsx scripts/smoke-live.ts [flags]

Flags:
  --base-url <url>    Deployment origin (env SMOKE_BASE_URL)
  --session <hex64>   Operator session id  (env SMOKE_SESSION)
  --symbol <SYM>      Symbol to trade      (env SMOKE_SYMBOL, default BTCUSDT)
  --qty <n>           Order quantity       (env SMOKE_QTY, default 0.001)
  --timeout-ms <n>    Per-request timeout  (default 15000)
  --dry-run           Print the plan and exit 0 without sending any request
  --help              Show this help

Steps executed: /api/health, /api/health/broker, /api/auth/session,
/api/live/orders (MARKET BUY), /api/live/positions/close.

Exit codes: 0 = ok, 1 = smoke failure, 2 = usage/config error.`;

function flagValue(argv: string[], flag: string): string | undefined {
  const i = argv.indexOf(flag);
  return i >= 0 ? argv[i + 1] : undefined;
}

function normalizeBaseUrl(raw: string): string | null {
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return `${url.protocol}//${url.host}${url.pathname.replace(/\/+$/, "")}`;
  } catch {
    return null;
  }
}

export function parseArgs(argv: string[], env: Record<string, string | undefined>): ParsedArgs {
  const errors: string[] = [];
  const help = argv.includes("--help") || argv.includes("-h");
  const dryRun = argv.includes("--dry-run");

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (KNOWN_FLAGS.has(arg)) {
      if (VALUE_FLAGS.has(arg)) i++;
      continue;
    }
    errors.push(`unknown argument: ${arg}`);
  }

  // Base URL: required for a real run; dry-run falls back to a placeholder.
  const baseUrlRaw = flagValue(argv, "--base-url") ?? env.SMOKE_BASE_URL;
  let baseUrl = "";
  if (baseUrlRaw) {
    const normalized = normalizeBaseUrl(baseUrlRaw);
    if (!normalized) errors.push(`invalid SMOKE_BASE_URL/base-url: ${baseUrlRaw} (must be an http(s) origin)`);
    else baseUrl = normalized;
  } else if (!dryRun) {
    errors.push("SMOKE_BASE_URL (or --base-url) is required for a live run");
  }

  // Session: required (64-hex) for a real run; optional in dry-run.
  const sessionId = flagValue(argv, "--session") ?? env.SMOKE_SESSION ?? "";
  if (!dryRun && !SESSION_ID_RE.test(sessionId)) {
    errors.push("SMOKE_SESSION (or --session) must be a 64-hex operator session id");
  }

  const symbolRaw = flagValue(argv, "--symbol") ?? env.SMOKE_SYMBOL ?? "BTCUSDT";
  if (!SYMBOL_RE.test(symbolRaw)) errors.push(`invalid SMOKE_SYMBOL/symbol: ${symbolRaw}`);
  const symbol = symbolRaw.toUpperCase();

  const qty = flagValue(argv, "--qty") ?? env.SMOKE_QTY ?? "0.001";
  if (!QTY_RE.test(qty)) errors.push(`invalid SMOKE_QTY/qty: ${qty} (positive decimal expected)`);

  const timeoutRaw = flagValue(argv, "--timeout-ms");
  let timeoutMs = 15_000;
  if (timeoutRaw !== undefined) {
    const parsed = Number.parseInt(timeoutRaw, 10);
    if (!Number.isFinite(parsed) || parsed <= 0 || parsed > 120_000) errors.push(`invalid --timeout-ms: ${timeoutRaw}`);
    else timeoutMs = parsed;
  }

  if (errors.length > 0) return { config: null, dryRun, help, errors };

  return {
    config: { baseUrl: baseUrl || "http://localhost:3000", sessionId, symbol, qty, timeoutMs },
    dryRun,
    help,
    errors,
  };
}

/** The exact request sequence, for --dry-run output and tests. */
export function describePlan(cfg: SmokeConfig): string[] {
  return [
    `1. GET  /api/health               → expect 200, healthy=true`,
    `2. GET  /api/health/broker        → expect 200, status="ok"`,
    `3. GET  /api/auth/session         → expect authenticated=true, capture CSRF`,
    `4. POST /api/live/orders          → MARKET BUY ${cfg.qty} ${cfg.symbol} (minted clientOrderId)`,
    `5. POST /api/live/positions/close → expect 200, flat again`,
  ];
}

// ---------------------------------------------------------------------------
// Transport
// ---------------------------------------------------------------------------

export function defaultTransport(timeoutMs: number): Transport {
  return async (url, init) => {
    const res = await fetch(url, { ...init, signal: AbortSignal.timeout(timeoutMs) });
    const text = await res.text();
    let body: unknown = null;
    if (text) {
      try {
        body = JSON.parse(text);
      } catch {
        body = text;
      }
    }
    const headers: Record<string, string> = {};
    res.headers.forEach((value, key) => {
      headers[key] = value;
    });
    return { status: res.status, body, headers };
  };
}

/** Mirrors lib/server/auth/session.ts cookie naming without importing the server stack. */
function sessionCookieHeader(cfg: SmokeConfig): string {
  // Server rule: secureCookieContext = allowedOrigin starts with https://.
  const name = cfg.baseUrl.startsWith("https://") ? "__Host-maws.session" : "maws.session";
  return `${name}=${cfg.sessionId}`;
}

function stringifyBody(body: unknown): string {
  const s = typeof body === "string" ? body : JSON.stringify(body);
  return (s ?? "null").slice(0, 200);
}

// ---------------------------------------------------------------------------
// Smoke flow
// ---------------------------------------------------------------------------

export async function runSmoke(cfg: SmokeConfig, deps: SmokeDeps = {}): Promise<SmokeResult> {
  const transport = deps.transport ?? defaultTransport(cfg.timeoutMs);
  const log = deps.log ?? ((line: string) => console.log(line));
  const started = Date.now();
  const requestId = crypto.randomUUID();
  const clientOrderId = `smoke-${Date.now().toString(36)}-${crypto.randomBytes(3).toString("hex")}`;
  const cookie = sessionCookieHeader(cfg);
  const origin = new URL(cfg.baseUrl).origin;
  const steps: StepOutcome[] = [];
  let ok = true;
  let failure: string | undefined;

  log(`[smoke] target=${cfg.baseUrl} symbol=${cfg.symbol} qty=${cfg.qty}`);
  const symbol = cfg.symbol.toUpperCase();

  /** Runs one step; returns the response when it passed, null otherwise. */
  async function attempt(
    name: string,
    method: string,
    path: string,
    headers: Record<string, string>,
    body?: unknown,
    validate: (res: TransportResponse) => string | null = () => null,
  ): Promise<TransportResponse | null> {
    const t0 = Date.now();
    let res: TransportResponse | undefined;
    let transportError: string | undefined;
    try {
      res = await transport(`${cfg.baseUrl}${path}`, {
        method,
        headers: { "x-request-id": requestId, ...headers },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
    } catch (err) {
      transportError = err instanceof Error ? err.message : String(err);
    }
    const durationMs = Date.now() - t0;
    const detail = res ? validate(res) : transportError;
    const stepOk = res !== undefined && detail === null;
    steps.push({ step: name, ok: stepOk, status: res?.status, detail: detail ?? undefined, durationMs });
    log(`[${stepOk ? "ok" : "fail"}] ${method} ${path} → ${res?.status ?? "error"}${detail ? ` ${detail}` : ""} (${durationMs}ms)`);
    if (res === undefined || detail !== null) {
      ok = false;
      failure ??= `${name}: ${detail ?? "failed"}`;
      return null;
    }
    return res;
  }

  const expectStatus = (want: number) => (res: TransportResponse) =>
    res.status === want ? null : `expected ${want}, got ${res.status}`;

  // 1. Process health.
  const health = await attempt("health", "GET", "/api/health", {}, undefined, (res) => {
    const statusFail = expectStatus(200)(res);
    if (statusFail) return statusFail;
    const body = res.body as { healthy?: unknown } | null;
    return body?.healthy === true ? null : `healthy is ${String(body?.healthy)}, expected true`;
  });
  if (!health) return finish();

  // 2. Broker connectivity (side-effect-free ping).
  const broker = await attempt("broker-health", "GET", "/api/health/broker", {}, undefined, (res) => {
    const statusFail = expectStatus(200)(res);
    if (statusFail) return `${statusFail} (broker degraded or unreachable)`;
    const body = res.body as { status?: unknown } | null;
    return body?.status === "ok" ? null : `broker status is ${String(body?.status)}, expected "ok"`;
  });
  if (!broker) return finish();

  // 3. Operator session + CSRF.
  const session = await attempt("session", "GET", "/api/auth/session", { cookie }, undefined, (res) => {
    const statusFail = expectStatus(200)(res);
    if (statusFail) return statusFail;
    const body = res.body as { authenticated?: unknown; csrf?: unknown } | null;
    if (body?.authenticated !== true) return "session rejected (expired or invalid SMOKE_SESSION)";
    if (typeof body.csrf !== "string" || body.csrf.length === 0) return "no csrf token in session response";
    return null;
  });
  if (!session) return finish();
  const csrf = (session.body as { csrf: string }).csrf;

  // 4. Tiny market order.
  const order = await attempt(
    "submit-order",
    "POST",
    "/api/live/orders",
    { "content-type": "application/json", cookie, origin, "x-maws-csrf": csrf },
    { symbol, side: "BUY", type: "MARKET", qty: cfg.qty, clientOrderId },
    (res) => {
      if (res.status === 429) return "rate limited - wait for the window to reset and re-run";
      if (res.status === 422) return `order rejected: ${stringifyBody(res.body)}`;
      if (res.status === 503) return "circuit breaker open on server";
      const statusFail = expectStatus(200)(res);
      if (statusFail) return statusFail;
      const body = res.body as { ok?: unknown } | null;
      return body?.ok === true ? null : `unexpected body: ${stringifyBody(res.body)}`;
    },
  );
  if (!order) return finish();

  // 5. Flatten again. A failure here is the dangerous one: flag it loudly.
  await attempt(
    "close-position",
    "POST",
    "/api/live/positions/close",
    { "content-type": "application/json", cookie, origin, "x-maws-csrf": csrf },
    { symbol },
    (res) => {
      const statusFail = expectStatus(200)(res);
      if (statusFail) return `${statusFail} - POSITION MAY REMAIN OPEN, verify on testnet`;
      const body = res.body as { ok?: unknown } | null;
      return body?.ok === true ? null : `close rejected: ${stringifyBody(res.body)} - verify flat on testnet`;
    },
  );

  return finish();

  function finish(): SmokeResult {
    const result: SmokeResult = {
      ok,
      ...(failure ? { failure } : {}),
      ...(ok ? { clientOrderId } : {}),
      requestId,
      durationMs: Date.now() - started,
      steps,
    };
    log(formatSummary(result));
    return result;
  }
}

/** Single JSON line for CI/logs. Contains no secrets (session id/CSRF excluded). */
export function formatSummary(result: SmokeResult): string {
  return JSON.stringify({
    event: "smoke.run",
    ok: result.ok,
    ...(result.failure ? { failure: result.failure } : {}),
    duration_ms: result.durationMs,
    steps: result.steps.map((s) => ({ step: s.step, ok: s.ok, status: s.status ?? null, duration_ms: s.durationMs })),
    client_order_id: result.clientOrderId ?? null,
    request_id: result.requestId ?? null,
  });
}

// ---------------------------------------------------------------------------
// CLI entry point
// ---------------------------------------------------------------------------

export async function runCli(argv: string[], env: Record<string, string | undefined>, deps: SmokeDeps = {}): Promise<number> {
  const log = deps.log ?? ((line: string) => console.log(line));
  const error = deps.error ?? ((line: string) => console.error(line));

  const parsed = parseArgs(argv, env);
  if (parsed.help) {
    log(USAGE);
    return 0;
  }
  if (parsed.errors.length > 0) {
    for (const e of parsed.errors) error(`error: ${e}`);
    error("run with --help for usage");
    return 2;
  }
  const cfg = parsed.config as SmokeConfig;

  if (parsed.dryRun) {
    log("[smoke] dry run - no requests will be sent");
    for (const line of describePlan(cfg)) log(line);
    return 0;
  }

  let result: SmokeResult;
  try {
    result = await runSmoke(cfg, deps);
  } catch (err) {
    error(`error: smoke run crashed: ${err instanceof Error ? err.message : String(err)}`);
    return 1;
  }
  return result.ok ? 0 : 1;
}

// Execute only when invoked directly (tsx scripts/smoke-live.ts), not when
// imported by tests. Setting process.exitCode (rather than process.exit)
// lets stdout flush naturally.
if (/smoke-live\.(ts|js|mjs|cjs)$/.test((process.argv[1] ?? "").replace(/\\/g, "/"))) {
  void runCli(process.argv.slice(2), process.env).then((code) => {
    if (code !== 0) process.exitCode = code;
  });
}
