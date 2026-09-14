/**
 * Server startup hook (Next 16 instrumentation). Runs once per server
 * process; heavy modules are dynamically imported so Edge/other runtimes and
 * the local/mock environment never pay for them.
 */
export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { log } = await import("@/lib/server/log/logger");
  log.info("server startup routines initializing...");

  const { serverConfig } = await import("@/lib/server/env/config");
  let cfg;
  try {
    cfg = serverConfig();
    log.info("server config loaded", { env: cfg.env });
  } catch (err) {
    log.error(`invalid server configuration: ${String(err)}`);
    return;
  }

  // Live monitoring starts in all modes (including local for public data):
  // clock sync, metadata, public market data streams.
  // In local mode: uses public endpoints only, no credentials required.
  // In testnet/shadow/production: full account monitoring.
  // Execution remains gated separately (kill switch + runtime flag + static
  // gate for production), so starting here never enables trading.
  log.info("circuit breakers initializing...");
  const { initializeCircuitBreakers } = await import("@/lib/server/resilience/breakers");
  initializeCircuitBreakers();

  // Signal handlers release the user-data stream lease and checkpoint the DB
  // on Ctrl+C / SIGTERM so the next server instance can attach immediately.
  const { installGracefulShutdown } = await import("@/lib/server/shutdown");
  installGracefulShutdown();

  log.info("live profile coordinator starting...");
  const { profileCoordinator } = await import("@/lib/server/profile/coordinator");
  profileCoordinator()
    .ensureStarted()
    .then(() => log.info("live profile coordinator started successfully"))
    .catch((err) => {
      log.error(`live profile coordinator failed to start: ${String(err)}`);
    });

  // Nightly encrypted online backup with restore verification.
  // Skip in local mode (no sensitive data to back up).
  if (cfg.env !== "local" && cfg.backupKey) {
    const { createEncryptedBackup } = await import("@/lib/server/db/backup");
    const DAY_MS = 24 * 60 * 60 * 1000;
    const timer = setInterval(() => {
      createEncryptedBackup().catch((err) => {
        log.error(`backup failed: ${String(err)}`);
      });
    }, DAY_MS);
    timer.unref?.();
  }

  log.info("server startup sequence completed");
}
