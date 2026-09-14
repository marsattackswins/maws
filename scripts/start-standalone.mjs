import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const cyan = "\x1b[36m";
const bold = "\x1b[1m";
const dim = "\x1b[2m";
const yellow = "\x1b[33m";
const reset = "\x1b[0m";

console.log(`
${cyan}${bold}  ████╗   ████╗   ██████╗   ██╗     ██╗ ███████╗
  █████╗ █████║  ██╔════██╗ ██║     ██║ ██╔════╝
  ██╔█████╔██║  ██████████║ ██║  █╗ ██║ ███████╗
  ██║╚███╔╝██║  ██╔═════██║ ██║ ███╗██║ ╚════██║
  ██║ ╚═╝  ██║  ██║     ██║ ╚███╔███╔╝  ███████║
  ╚═╝      ╚═╝  ╚═╝     ╚═╝  ╚══╝╚══╝   ╚══════╝${reset}
  ${dim}Market Analysis & Workflow System • Prd Server${reset}
`);

// Keep local development behavior consistent with `next start`. Runtime
// environment variables already supplied by the process take precedence.
dotenv.config({ path: path.join(root, ".env.local") });
dotenv.config({ path: path.join(root, ".env") });

// The standalone server changes its working directory to `.next/standalone`.
// Resolve the database path before it starts so runtime state stays outside
// the disposable build output and Windows can rebuild while the server stops.
// The production server gets its own database by default so dev and prod
// never share leases, kill-switch state, or audit history.
const configuredDbPath = process.env.MAWS_DB_PATH?.trim();
process.env.MAWS_DB_PATH = configuredDbPath
  ? path.isAbsolute(configuredDbPath)
    ? configuredDbPath
    : path.resolve(root, configuredDbPath)
  : path.join(root, ".maws", "maws-prod.db");

// Graceful shutdown (stream-lease release on SIGINT/SIGTERM) is installed by
// instrumentation.ts inside the standalone server itself.

// Warn loudly when the build predates source changes: `npm start` serves the
// last `npm run build`, so a stale build can silently run old server code.
function warnIfStaleBuild() {
  const buildId = path.join(root, ".next", "standalone", ".next", "BUILD_ID");
  let builtAt = 0;
  try {
    builtAt = fs.statSync(buildId).mtimeMs;
  } catch {
    console.log(`${bold}  warning: no build found — run "npm run build" before "npm start"${reset}`);
    return;
  }
  let newestSrc = 0;
  const visit = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) visit(p);
      else if (/\.tsx?$/.test(entry.name)) {
        const m = fs.statSync(p).mtimeMs;
        if (m > newestSrc) newestSrc = m;
      }
    }
  };
  visit(path.join(root, "lib"));
  visit(path.join(root, "app"));
  visit(path.join(root, "components"));
  if (newestSrc > builtAt + 2_000) {
    const age = Math.round((Date.now() - builtAt) / 60_000);
    console.log(`${bold}${yellow}  warning: build is stale — sources changed after the last "npm run build"${reset}
  ${yellow}build: ${new Date(builtAt).toLocaleString()} (${age} min ago) · newest source edit supersedes it
  → stop this server, run "npm run build", then "npm start" again${reset}`);
  }
}
warnIfStaleBuild();

const serverPath = path.join(root, ".next", "standalone", "server.js");
await import(pathToFileURL(serverPath).href);
