import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const cyan = "\x1b[36m";
const bold = "\x1b[1m";
const dim = "\x1b[2m";
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
const configuredDbPath = process.env.MAWS_DB_PATH?.trim();
process.env.MAWS_DB_PATH = configuredDbPath
  ? path.isAbsolute(configuredDbPath)
    ? configuredDbPath
    : path.resolve(root, configuredDbPath)
  : path.join(root, ".maws", "maws.db");

const serverPath = path.join(root, ".next", "standalone", "server.js");
await import(pathToFileURL(serverPath).href);
