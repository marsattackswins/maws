import "server-only";

import fs from "node:fs";
import path from "node:path";

import { log } from "./log/logger";
import { compareSecretTokens } from "./auth/token";

/**
 * Application power state shared between the Next server and its supervisor
 * process (scripts/supervisor.mjs).
 *
 * The supervisor is the parent of the `npm start` server. It polls /api/health
 * and restarts the server when it dies. To support "Stop" from the admin UI,
 * the server writes its desired state to a file the supervisor can read even
 * after the server process is gone:
 *
 *   { "desired": "on" | "off", "updatedAt": <epoch ms> }
 *
 * The supervisor never starts the server when desired is "off", so a stopped
 * app stays stopped across supervisor restarts too.
 */

export type DesiredState = "on" | "off";

export interface PowerStateFile {
  desired: DesiredState;
  updatedAt: number;
}

/** Who asked: the operator UI (session/CSRF) or the local supervisor. */
export type PowerCaller = "operator" | "supervisor";

const STATE_DIR = ".maws";
const STATE_FILE = "app-state.json";
const TOKEN_FILE = "supervisor-token";

/** Hard ceiling for the graceful exit before falling back to a hard exit. */
const EXIT_BUDGET_MS = 5_000;

/** Tests point MAWS_STATE_DIR at a temp directory to keep .maws pristine. */
function baseDir(): string {
  const override = process.env.MAWS_STATE_DIR?.trim();
  return override ? path.resolve(override) : path.join(process.cwd(), STATE_DIR);
}

function stateFilePath(): string {
  return path.join(baseDir(), STATE_FILE);
}

function tokenFilePath(): string {
  return path.join(baseDir(), TOKEN_FILE);
}

function readJsonFile(file: string): unknown {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

export function readDesiredState(): PowerStateFile {
  const raw = readJsonFile(stateFilePath());
  if (
    raw &&
    typeof raw === "object" &&
    (raw as { desired?: unknown }).desired === "off"
  ) {
    return { desired: "off", updatedAt: Number((raw as { updatedAt?: unknown }).updatedAt ?? 0) };
  }
  // Absent, unreadable, or explicitly "on" — the default is a running app.
  return { desired: "on", updatedAt: 0 };
}

export function writeDesiredState(desired: DesiredState): void {
  const dir = baseDir();
  fs.mkdirSync(dir, { recursive: true });
  const payload: PowerStateFile = { desired, updatedAt: Date.now() };
  fs.writeFileSync(stateFilePath(), JSON.stringify(payload), "utf8");
}

/**
 * Called by the server at boot: an explicitly started server always means
 * "run", so a stale desired=off from a previous UI stop cannot wedge the
 * supervisor into refusing to start the app the operator just launched.
 */
export function markRunning(): void {
  writeDesiredState("on");
}

/**
 * The supervisor generates a random token at startup and passes it to the
 * server via MAWS_SUPERVISOR_TOKEN, also keeping a copy on disk so a
 * restarted server can read it. Requests bearing this token act for the
 * supervisor, not the operator, and skip session auth.
 */
export function supervisorToken(): string | null {
  const fromEnv = process.env.MAWS_SUPERVISOR_TOKEN?.trim();
  if (fromEnv) return fromEnv;
  try {
    const fromDisk = fs.readFileSync(tokenFilePath(), "utf8").trim();
    return fromDisk || null;
  } catch {
    return null;
  }
}

export function callerForRequest(req: Request): PowerCaller {
  const header = req.headers.get("x-maws-supervisor-token");
  const expected = supervisorToken();
  if (expected && compareSecretTokens(header, expected)) return "supervisor";
  return "operator";
}

/**
 * Initiate a graceful shutdown exactly like Ctrl+C does: release the stream
 * lease, checkpoint the DB, then exit. Runs in a detached timer because the
 * HTTP response must be flushed first.
 */
export function beginGracefulStop(reason: string): void {
  log.info(`app stop requested (${reason}); shutting down gracefully`);
  if (process.env.NODE_ENV === "test") {
    // Tests must not terminate the jest worker; teardown behavior is
    // exercised in integration runs against a real server.
    return;
  }
  setTimeout(() => {
    void (async () => {
      const force = setTimeout(() => {
        log.warn(`graceful stop timed out after ${EXIT_BUDGET_MS}ms; exiting unconditionally`);
        process.exit(143);
      }, EXIT_BUDGET_MS);
      force.unref?.();
      try {
        const { profileCoordinator } = await import("./profile/coordinator");
        await profileCoordinator().shutdownForExit();
      } catch (err) {
        log.warn(`app stop: profile teardown failed: ${String(err)}`);
      }
      try {
        const { closeDbForShutdown } = await import("./db/connection");
        closeDbForShutdown();
      } catch {
        // DB may already be closed or never opened.
      }
      log.info("app stop complete");
      process.exit(0);
    })();
  }, 150).unref?.();
}
