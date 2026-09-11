#!/usr/bin/env node
// Secret scan: fails if anything that looks like a live credential is present
// in tracked source. Runs on the working tree with a conservative exclusion
// list; exit code 1 blocks commits via `npm run secret-scan`.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  ".next",
  ".next-e2e",
  "coverage",
  "test-results",
  "playwright-report",
  ".maws",
  "dist",
  "build",
]);
const SKIP_FILES = new Set(["package-lock.json", "secret-scan.mjs"]);
const SCAN_EXT = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".json",
  ".env",
  ".yml",
  ".yaml",
  ".conf",
  ".sh",
  ".md",
]);

const PATTERNS = [
  { name: "key-like assignment", re: /(api[_-]?key|api[_-]?secret|listen[_-]?key|private[_-]?key|auth[_-]?token|session[_-]?secret)\s*[:=]\s*["'][A-Za-z0-9+/=_\-]{20,}["']/i },
  { name: "MAWS secret with value", re: /MAWS_(BINANCE_API_(KEY|SECRET)|OPERATOR_AUTH|BACKUP_KEY|HEALTH_TOKEN)\s*=\s*["']?[A-Za-z0-9+/=_:.\-]{16,}/i },
  { name: "hex scrypt/hash pair", re: /\b[0-9a-f]{32}:[0-9a-f]{64,}\b/i },
  { name: "secret-like name with long base64 value", re: /(secret|signature|password)["']?\s*[:=]\s*["'][A-Za-z0-9+/=]{32,}["']/i },
];

// Allow obviously fake values used by tests/DI fakes.
const FAKE_HINTS = [/fake/i, /test/i, /example/i, /mock/i, /placeholder/i, /xxx/i, /dummy/i];

const findings = [];

function scanFile(file) {
  const text = fs.readFileSync(file, "utf8");
  const lines = text.split(/\r?\n/);
  lines.forEach((line, i) => {
    for (const p of PATTERNS) {
      const m = line.match(p.re);
      if (!m) continue;
      const snippet = m[0];
      if (FAKE_HINTS.some((f) => f.test(snippet))) continue;
      findings.push(`${path.relative(ROOT, file)}:${i + 1} [${p.name}] ${snippet.slice(0, 80)}`);
    }
  });
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walk(path.join(dir, entry.name));
    } else if (entry.isFile()) {
      if (SKIP_FILES.has(entry.name)) continue;
      const ext = path.extname(entry.name).toLowerCase();
      const name = entry.name.toLowerCase();
      if (!SCAN_EXT.has(ext) && !name.startsWith(".env")) continue;
      scanFile(path.join(dir, entry.name));
    }
  }
}

walk(ROOT);

if (findings.length > 0) {
  console.error("secret-scan: potential secrets detected:");
  for (const f of findings) console.error("  " + f);
  process.exit(1);
}
console.log("secret-scan: clean");
