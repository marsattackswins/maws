#!/usr/bin/env node
/**
 * MAWS supervisor — keeps the production server running and lets the admin UI
 * stop and start it from the same URL.
 *
 * Usage:  node scripts/supervisor.mjs   (this is what `npm start` runs)
 *         `npm run start:bare` starts the server directly, no supervisor.
 *
 * Responsibilities
 *  - Spawn the standalone server (scripts/start-standalone.mjs) as a child and
 *    forward its output to this terminal untouched.
 *  - Liveness-check GET /api/health. Any HTTP response (even 401/503) means
 *    the server is alive; only network failure counts as dead. A child that
 *    stays unreachable past START_TIMEOUT_MS is replaced.
 *  - If the child exits unexpectedly, restart it after a short backoff (up to
 *    MAX_RESTARTS per rolling window, then give up and say so).
 *  - Honor .maws/app-state.json. desired=off (written by the app when the
 *    operator presses Stop on /admin) means: do not (re)start the child. The
 *    child rewrites desired=on whenever it starts, so an explicit
 *    start always means "run".
 *  - PORT TAKEOVER: while no child process exists, the supervisor binds the
 *    app port itself and serves a power page (APP STOPPED / Start app) for
 *    every URL — including /admin. http://localhost:3000 therefore always
 *    answers: the app when running, the power screen when stopped. The
 *    takeover listener is closed before the child spawns so the app gets its
 *    port back.
 *  - Serve the same power page on http://127.0.0.1:3001 (loopback only) as a
 *    fallback that works even if something else holds the app port.
 *  - Share a random token with the child (env + disk) so the app can tell
 *    supervisor calls from operator calls.
 *
 * Ctrl+C stops the supervisor AND the child gracefully (via the app's own
 * stop endpoint; Windows cannot deliver SIGINT to a child process) and does
 * NOT mark the app as "stay stopped" — the next supervisor run starts it.
 */

import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const stateDir = path.join(root, ".maws");
const stateFile = path.join(stateDir, "app-state.json");
const tokenFile = path.join(stateDir, "supervisor-token");

const CHILD_PORT = Number(process.env.PORT || 3000);
const CONTROL_HOST = "127.0.0.1";
const CONTROL_PORT = Number(process.env.MAWS_CONTROL_PORT || 3001);
// The takeover listener serves the same external surface as the app itself,
// which binds HOSTNAME || 0.0.0.0 in the standalone server.
const TAKEOVER_HOST = process.env.MAWS_SUPERVISOR_BIND?.trim() || "0.0.0.0";
const HEALTH_PATH = "/api/health";
const POLL_MS = 2_000;
const START_TIMEOUT_MS = 60_000;
const RESTART_BACKOFF_MS = 3_000;
const MAX_RESTARTS_PER_WINDOW = 5;
const RESTART_WINDOW_MS = 10 * 60_000;

function log(message) {
  console.log(`[supervisor ${new Date().toISOString()}] ${message}`);
}

function readState() {
  try {
    const raw = JSON.parse(fs.readFileSync(stateFile, "utf8"));
    return raw && raw.desired === "off"
      ? { desired: "off", updatedAt: raw.updatedAt ?? 0 }
      : { desired: "on", updatedAt: raw?.updatedAt ?? 0 };
  } catch {
    return { desired: "on", updatedAt: 0 };
  }
}

function writeState(desired) {
  fs.mkdirSync(stateDir, { recursive: true });
  fs.writeFileSync(stateFile, JSON.stringify({ desired, updatedAt: Date.now() }), "utf8");
}

function ensureToken() {
  // Reuse the on-disk token so a restarted supervisor keeps the same secret.
  try {
    const existing = fs.readFileSync(tokenFile, "utf8").trim();
    if (existing) return existing;
  } catch {
    // Fall through and create one.
  }
  const token = crypto.randomBytes(24).toString("hex");
  fs.mkdirSync(stateDir, { recursive: true });
  fs.writeFileSync(tokenFile, token, "utf8");
  return token;
}

const supervisorToken = ensureToken();

/** @type {import('node:child_process').ChildProcess | null} */
let child = null;
let childStartedAt = 0;
let unreachableSince = 0;
let stopping = false;
let spawning = false;
/** @type {number[]} */
let restarts = [];

function restartBudgetExhausted() {
  const now = Date.now();
  restarts = restarts.filter((t) => now - t < RESTART_WINDOW_MS);
  return restarts.length >= MAX_RESTARTS_PER_WINDOW;
}

// --- Port takeover ---------------------------------------------------------

/** @type {import('node:http').Server | null} */
let takeoverServer = null;

function closeTakeover() {
  return new Promise((resolve) => {
    const srv = takeoverServer;
    if (!srv) {
      resolve();
      return;
    }
    takeoverServer = null;
    let done = false;
    const finish = () => {
      if (!done) {
        done = true;
        resolve();
      }
    };
    srv.close(() => finish());
    // Idle keep-alive sockets would otherwise hold server.close() open.
    srv.closeIdleConnections?.();
    setTimeout(() => {
      srv.closeAllConnections?.();
      finish();
    }, 400).unref?.();
  });
}

/**
 * Bind the app port while no child exists so http://localhost:<app port> always
 * answers something. Idempotent; failures (e.g. a manually started app already
 * holding the port) are logged and the supervisor continues without takeover.
 */
function ensureTakeover() {
  if (takeoverServer || child || stopping) return;
  const srv = http.createServer((req, res) => handleRequest(req, res));
  takeoverServer = srv;
  srv.on("error", (err) => {
    takeoverServer = null;
    const code = /** @type {NodeJS.ErrnoException} */ (err).code ?? "";
    log(`power page not served on port ${CHILD_PORT} (${code || err}); the app or another process owns the port`);
  });
  srv.listen(CHILD_PORT, TAKEOVER_HOST, () => {
    log(`app port ${CHILD_PORT} now served by the supervisor (app stopped) — open http://localhost:${CHILD_PORT}/admin to start it`);
  });
}

// --- Child lifecycle -------------------------------------------------------

function spawnChild() {
  const entry = path.join(root, "scripts", "start-standalone.mjs");
  const proc = spawn(process.execPath, [entry], {
    cwd: root,
    // The child chdir's into .next/standalone; pin the state dir so its
    // desired=off writes land where the supervisor reads them.
    env: { ...process.env, MAWS_SUPERVISOR_TOKEN: supervisorToken, MAWS_STATE_DIR: stateDir },
    stdio: ["ignore", "inherit", "inherit"],
  });
  childStartedAt = Date.now();
  unreachableSince = 0;

  proc.on("exit", (code, signal) => {
    child = null;
    if (stopping) return;
    if (readState().desired === "off") {
      log(`child exited (code=${code} signal=${signal}); desired=off, leaving it stopped`);
      ensureTakeover();
      return;
    }
    if (restartBudgetExhausted()) {
      log(`too many restarts (${MAX_RESTARTS_PER_WINDOW} in ${RESTART_WINDOW_MS / 60_000}min); giving up. Fix the issue, then press Start on the power page.`);
      ensureTakeover();
      return;
    }
    restarts.push(Date.now());
    log(`child exited (code=${code} signal=${signal}); restarting in ${RESTART_BACKOFF_MS / 1000}s`);
    ensureTakeover();
    setTimeout(() => {
      if (!stopping && readState().desired === "on") void startChild();
    }, RESTART_BACKOFF_MS);
  });

  return proc;
}

/**
 * Spawn the child, releasing the takeover listener first so the app gets its
 * port back. Serialized through `spawning` against concurrent /start calls and
 * the restart timer.
 */
async function startChild() {
  if (child || spawning || stopping) return;
  spawning = true;
  try {
    await closeTakeover();
    if (child || stopping) return;
    log(`starting server on port ${CHILD_PORT} (desired=on)`);
    child = spawnChild();
  } finally {
    spawning = false;
  }
}

/**
 * Stop the child. Preferred path: the app's own stop endpoint (graceful:
 * stream-lease release + DB checkpoint), because Windows cannot deliver
 * signals to another process. Falls back to a hard kill.
 */
function stopChild({ graceful = true } = {}) {
  if (!child) return Promise.resolve();
  const proc = child;
  return new Promise((resolve) => {
    const killTimer = setTimeout(() => {
      log("graceful stop timed out; killing child");
      try {
        proc.kill("SIGKILL");
      } catch {
        // Already gone.
      }
    }, 6_000);
    killTimer.unref?.();

    proc.once("exit", () => {
      clearTimeout(killTimer);
      resolve();
    });

    if (!graceful) {
      try {
        proc.kill("SIGKILL");
      } catch {
        // Already gone.
      }
      return;
    }

    const controller = new AbortController();
    const fetchTimer = setTimeout(() => controller.abort(), 3_000);
    fetchTimer.unref?.();
    fetch(`http://127.0.0.1:${CHILD_PORT}/api/admin/power`, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "content-type": "application/json",
        "x-maws-supervisor-token": supervisorToken,
        origin: `http://localhost:${CHILD_PORT}`,
      },
      body: JSON.stringify({ confirm: "STOP" }),
    })
      .then((res) => {
        if (res.ok) log("graceful stop accepted by app");
        else throw new Error(`stop endpoint returned ${res.status}`);
      })
      .catch(() => {
        log("graceful stop endpoint unreachable; killing child");
        try {
          proc.kill("SIGKILL");
        } catch {
          // Already gone.
        }
      });
  });
}

// --- Power page (shared by takeover port and control port) -----------------

function powerPageHtml({ takeover }) {
  const state = readState();
  const stopped = state.desired === "off";
  const running = child != null;
  const label = running ? "APP RUNNING" : stopped ? "APP STOPPED" : "APP NOT RUNNING";
  const cssClass = running ? "on" : "off";
  const action = running
    ? `<a href="http://localhost:${CHILD_PORT}/admin">Open admin console →</a>`
    : '<button id="start">Start app</button>';
  const note = running
    ? ""
    : stopped
      ? "<p>The app was stopped from the admin console and stays stopped until started.</p>"
      : "<p>The app exited unexpectedly. It restarts automatically unless the restart budget was exhausted.</p>";
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>MAWS — app power</title>
<style>
  body { background: #0b0e11; color: #d1d4dc; font-family: ui-monospace, monospace; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
  .card { border: 1px solid #2a2e39; border-radius: 8px; padding: 32px; background: #131722; min-width: 320px; text-align: center; }
  h1 { font-size: 14px; margin: 0 0 12px; color: #787b86; font-weight: normal; }
  .state { font-size: 22px; margin-bottom: 20px; }
  .on { color: #089981; } .off { color: #f7931a; }
  button { background: #2962ff; color: white; border: 0; border-radius: 6px; padding: 10px 22px; font-size: 14px; cursor: pointer; }
  button:disabled { opacity: 0.5; cursor: default; }
  a { color: #6f9bff; font-size: 12px; display: block; margin-top: 16px; }
  p { color: #787b86; font-size: 12px; margin: 8px 0 0; }
</style>
</head>
<body>
  <div class="card">
    <h1>MAWS · app port ${CHILD_PORT}</h1>
    <div class="state ${cssClass}">${label}</div>
    ${action}
    ${note}
  </div>
  <script>
    const btn = document.getElementById("start");
    if (btn) {
      btn.onclick = async () => {
        btn.disabled = true;
        btn.textContent = "Starting…";
        try { await fetch("/start", { method: "POST" }); } catch {}
        // Poll /api/admin/power on this origin: the takeover closes while the
        // app boots, so expect refused connections until the app answers.
        const deadline = Date.now() + 90000;
        const poll = async () => {
          try {
            const s = await fetch("/api/admin/power").then(r => r.json());
            if (s.running === true) {
              window.location.href = ${takeover ? '"/admin"' : `"http://localhost:${CHILD_PORT}/admin"`};
              return;
            }
          } catch {}
          if (Date.now() < deadline) setTimeout(poll, 1000);
          else { btn.textContent = "Start app"; btn.disabled = false; }
        };
        setTimeout(poll, 1000);
      };
    }
    setInterval(() => {
      fetch("/api/admin/power").then(r => r.json()).then(s => {
        if (s.running === true && !${takeover ? "true" : "false"}) window.location.reload();
      }).catch(() => {});
    }, 3000);
  </script>
</body>
</html>`;
}

function handleRequest(req, res) {
  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);

  if (url.pathname === HEALTH_PATH && req.method === "GET") {
    // The app is down; do not let the power page's 200 fool monitoring.
    res.writeHead(503, { "content-type": "application/json", "cache-control": "no-store" });
    res.end(JSON.stringify({ healthy: false, app: "stopped", desired: readState().desired, timestamp: Date.now() }));
    return;
  }

  if (url.pathname === "/api/admin/power" && req.method === "GET") {
    res.writeHead(200, { "content-type": "application/json", "cache-control": "no-store" });
    res.end(JSON.stringify({ running: child != null, desired: readState().desired, timestamp: Date.now() }));
    return;
  }

  if (url.pathname === "/state") {
    res.writeHead(200, { "content-type": "application/json", "cache-control": "no-store" });
    res.end(JSON.stringify({ ...readState(), childRunning: child != null }));
    return;
  }

  if (url.pathname === "/start" && req.method === "POST") {
    if (readState().desired === "off") {
      writeState("on");
      log("start requested via power page");
    }
    if (restartBudgetExhausted()) {
      // An explicit human action clears the crash budget — do not leave the
      // operator wedged behind an old failure streak.
      restarts = [];
      log("start requested via power page; restart budget reset");
    }
    res.writeHead(200, { "content-type": "application/json", "cache-control": "no-store" });
    res.end(JSON.stringify({ ok: true, desired: "on" }));
    // Respond first, then release the port and spawn; the caller's page polls
    // /api/admin/power until the real app answers.
    setTimeout(() => void startChild(), 200).unref?.();
    return;
  }

  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(503, { "content-type": "application/json", "cache-control": "no-store" });
    res.end(JSON.stringify({ error: { code: "app_stopped", message: "The app is not running; start it from the power page" } }));
    return;
  }

  // Every other GET (including /admin) shows the power page while stopped.
  res.writeHead(200, {
    "content-type": "text/html; charset=utf-8",
    "cache-control": "no-store",
    "x-frame-options": "DENY",
  });
  res.end(powerPageHtml({ takeover: true }));
}

const controlServer = http.createServer((req, res) => {
  const url = new URL(req.url ?? "/", `http://${CONTROL_HOST}`);
  if (url.pathname === "/api/admin/power" || url.pathname === "/state" || (url.pathname === "/start" && req.method === "POST")) {
    handleRequest(req, res);
    return;
  }
  res.writeHead(200, {
    "content-type": "text/html; charset=utf-8",
    "cache-control": "no-store",
    "x-frame-options": "DENY",
  });
  res.end(powerPageHtml({ takeover: false }));
});

// --- Liveness -------------------------------------------------------------

function healthCheck() {
  if (!child) {
    unreachableSince = 0;
    return;
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 1_500);
  timer.unref?.();
  fetch(`http://127.0.0.1:${CHILD_PORT}${HEALTH_PATH}`, { signal: controller.signal })
    .then(() => {
      // Any HTTP response — 200, 401, 503 — proves the server is alive.
      unreachableSince = 0;
    })
    .catch(() => {
      if (unreachableSince === 0) unreachableSince = Date.now();
      const deadFor = Date.now() - unreachableSince;
      // Give a freshly started child its full startup window before replacing.
      if (deadFor > START_TIMEOUT_MS && Date.now() - childStartedAt > START_TIMEOUT_MS) {
        if (readState().desired !== "on") return;
        log(`child unreachable for ${Math.round(deadFor / 1000)}s; replacing it`);
        unreachableSince = 0;
        try {
          child?.kill("SIGKILL");
        } catch {
          // Already gone; the exit handler schedules the restart.
        }
      }
    })
    .finally(() => clearTimeout(timer));
}

// --- Wiring ---------------------------------------------------------------

function main() {
  fs.mkdirSync(stateDir, { recursive: true });

  controlServer.listen(CONTROL_PORT, CONTROL_HOST, () => {
    log(`control page on http://${CONTROL_HOST}:${CONTROL_PORT} · app on port ${CHILD_PORT}`);
  });
  controlServer.on("error", (err) => {
    log(`control page unavailable (${String(err)}); start/stop via the app port still works`);
  });

  process.on("SIGINT", () => {
    if (stopping) return;
    stopping = true;
    log("Ctrl+C received; stopping supervisor and child gracefully");
    void stopChild({ graceful: true }).then(() => process.exit(0));
  });
  process.on("SIGTERM", () => {
    if (stopping) return;
    stopping = true;
    void stopChild({ graceful: true }).then(() => process.exit(0));
  });

  const state = readState();
  if (state.desired === "off") {
    log('desired=off from the last session (stopped via admin console); not starting the app.');
    log(`open http://localhost:${CHILD_PORT}/admin and press "Start app", or run "npm run start:bare" to start it directly.`);
    ensureTakeover();
  } else {
    void startChild();
  }

  setInterval(healthCheck, POLL_MS);
}

main();
