import "server-only";

import { log } from "./log/logger";

/**
 * Graceful process shutdown for the live trading runtime.
 *
 * The user-data stream lease lives in SQLite with a TTL (default 5 minutes).
 * `process.once("exit")` handlers do not run when the process is killed by a
 * signal (the norm on Windows and for hard kills), so a stopped dev server
 * can leave a stale lease that blocks the next server from attaching for up
 * to the full TTL. Installing signal handlers that shut the profile down
 * cleanly makes dev -> prod (or dev -> dev) handover instant.
 */

let installed = false;

/** Hard ceiling on graceful teardown before the process exits unconditionally. */
const SHUTDOWN_BUDGET_MS = 3_000;

export function installGracefulShutdown(): void {
  if (installed) return;
  installed = true;

  let handling = false;

  const shutdown = (signal: string): void => {
    if (handling) return;
    handling = true;
    // Ctrl+C must always stop the process: after the budget elapses we exit
    // unconditionally. The lease self-heals via its PID staleness check, so a
    // forced exit can never wedge the next start behind a TTL wait.
    const forceExit = setTimeout(() => {
      log.warn(`graceful shutdown timed out after ${SHUTDOWN_BUDGET_MS}ms; exiting now`);
      process.exit(143); // 128 + SIGTERM(15), matching a signal exit code
    }, SHUTDOWN_BUDGET_MS);
    forceExit.unref();
    void (async () => {
      log.info(`graceful shutdown started (${signal})`);
      try {
        const { profileCoordinator } = await import("./profile/coordinator");
        await profileCoordinator().shutdownForExit();
      } catch (err) {
        log.warn(`graceful shutdown: profile teardown failed: ${String(err)}`);
      }
      try {
        const { closeDbForShutdown } = await import("./db/connection");
        closeDbForShutdown();
      } catch {
        // DB may already be closed or never opened.
      }
      clearTimeout(forceExit);
      log.info("graceful shutdown complete");
      // Re-raise with the default handler so the exit code matches the
      // signal, exactly like a process without a custom handler would.
      process.kill(process.pid, signal as NodeJS.Signals);
    })();
  };

  process.once("SIGINT", () => shutdown("SIGINT"));
  process.once("SIGTERM", () => shutdown("SIGTERM"));
}
