import fs from "node:fs";
import path from "node:path";

import { redact, redactJson } from "@/lib/server/audit/redact";
import { audit, recentAudit } from "@/lib/server/audit/log";
import { freshEnv, makeCfg } from "./helpers";

describe("secret redaction", () => {
  test("sensitive keys are masked regardless of casing", () => {
    const payload = {
      apiKey: "REAL_KEY_123",
      apiSecret: "REAL_SECRET",
      MAWS_BINANCE_API_SECRET: "REAL_SECRET",
      listenKey: "pqRS4dLX...",
      signature: "abc123",
      password: "hunter2",
      Authorization: "Bearer xyz",
      Cookie: "session=abc",
      "X-MBX-APIKEY": "REAL_KEY_123",
      xMbxApiKey: "REAL_KEY_123",
      csrfToken: "tok",
      nested: { deep: { secret: "s", token: "t", ordinary: "keep" } },
      list: [{ key: "k" }],
    };
    const out = JSON.stringify(redact(payload));
    expect(out).not.toContain("REAL_KEY_123");
    expect(out).not.toContain("REAL_SECRET");
    expect(out).not.toContain("pqRS4dLX");
    expect(out).not.toContain("hunter2");
    expect(out).not.toContain("Bearer xyz");
    expect(out).toContain("keep");
    const parsed = JSON.parse(out) as { apiKey: string; nested: { deep: { ordinary: string } } };
    expect(parsed.apiKey).toBe("[redacted]");
    expect(parsed.nested.deep.ordinary).toBe("keep");
  });

  test("redactJson truncates oversized strings and caps arrays/depth", () => {
    const long = "x".repeat(5000);
    const s = redactJson({ note: long });
    expect(s.length).toBeLessThan(long.length);
    expect(s).toContain("[truncated]");

    const arr = JSON.parse(redactJson({ xs: Array.from({ length: 600 }, (_, i) => i) })) as { xs: number[] };
    expect(arr.xs.length).toBe(500);

    let deep: unknown = { ok: true };
    for (let i = 0; i < 15; i++) deep = { inner: deep };
    expect(redactJson(deep)).toContain("[deep]");
  });

  test("errors are reduced to name+message", () => {
    const out = redact(new Error("boom")) as unknown as { name: string; message: string };
    expect(out.name).toBe("Error");
    expect(out.message).toBe("boom");
  });

  test("audit rows never persist raw secrets", () => {
    freshEnv(makeCfg());
    audit("operator", "test.secrets", {
      apiKey: "SUPER_SECRET_KEY",
      binanceApiSecret: "SUPER_SECRET_SECRET",
      listenKey: "SUPER_SECRET_LISTEN",
      symbol: "BTCUSDT",
    });
    const rows = recentAudit(5);
    const detail = rows[0].detail;
    expect(detail).toContain("BTCUSDT");
    expect(detail).not.toContain("SUPER_SECRET_KEY");
    expect(detail).not.toContain("SUPER_SECRET_SECRET");
    expect(detail).not.toContain("SUPER_SECRET_LISTEN");
    expect(detail).toContain("[redacted]");
  });
});

describe("client bundle leakage prevention", () => {
  const root = process.cwd();

  function walk(dir: string, out: string[] = []): string[] {
    if (!fs.existsSync(dir)) return out;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (["node_modules", ".next", "coverage"].includes(entry.name)) continue;
        walk(p, out);
      } else if (/\.(ts|tsx)$/.test(entry.name) && !entry.name.endsWith(".d.ts")) {
        out.push(p);
      }
    }
    return out;
  }

  /**
   * Detects if a file has a top-level "use client" directive in its prologue.
   * 
   * Per ECMAScript spec, directives must appear before any statements and can only
   * be preceded by whitespace, comments (line or block), or other directives.
   * 
   * This scanner handles:
   * - Leading BOM (U+FEFF)
   * - Leading whitespace (spaces, tabs, newlines)
   * - Leading line comments (//)
   * - Leading block comments (/* ... *\/)
   * - Both 'use client' and "use client" quotes
   * 
   * Returns true only if a valid "use client" directive appears in the directive prologue.
   */
  function hasUseClientDirective(source: string): boolean {
    let i = 0;
    const len = source.length;

    // Skip BOM if present
    if (source.charCodeAt(0) === 0xfeff) i++;

    // Skip whitespace and comments, looking for directives
    while (i < len) {
      const ch = source[i];

      // Skip whitespace
      if (ch === " " || ch === "\t" || ch === "\r" || ch === "\n") {
        i++;
        continue;
      }

      // Skip line comment
      if (ch === "/" && source[i + 1] === "/") {
        i += 2;
        while (i < len && source[i] !== "\n") i++;
        continue;
      }

      // Skip block comment
      if (ch === "/" && source[i + 1] === "*") {
        i += 2;
        while (i < len - 1) {
          if (source[i] === "*" && source[i + 1] === "/") {
            i += 2;
            break;
          }
          i++;
        }
        continue;
      }

      // Check for string literal (potential directive)
      if (ch === '"' || ch === "'") {
        const quote = ch;
        i++; // skip opening quote

        // Scan string content
        let content = "";
        while (i < len && source[i] !== quote) {
          if (source[i] === "\\") {
            // Handle escape sequence
            i++; // skip backslash
            if (i < len) {
              // Add the escaped character (for simplicity, we only care about the final content)
              // For directive detection, we need the actual unescaped string value
              const escaped = source[i];
              if (escaped === 'n') content += '\n';
              else if (escaped === 'r') content += '\r';
              else if (escaped === 't') content += '\t';
              else if (escaped === '\\') content += '\\';
              else if (escaped === quote) content += quote; // \" or \'
              else content += escaped; // other escapes, just add the char
              i++;
            }
          } else {
            content += source[i++];
          }
        }

        if (i >= len) return false; // unclosed string
        i++; // skip closing quote

        // Skip optional semicolon after directive
        while (i < len && (source[i] === " " || source[i] === "\t")) i++;
        if (i < len && source[i] === ";") i++;

        // Skip trailing whitespace/newline after directive
        while (i < len && (source[i] === " " || source[i] === "\t" || source[i] === "\r" || source[i] === "\n")) i++;

        // Check if this is "use client" directive
        if (content === "use client") return true;

        // This was a directive, but not "use client"
        // Continue looking for more directives
        // (directives can only be followed by other directives or statements)
        // If we find a statement (anything other than whitespace/comments/strings), stop
        continue;
      }

      // Found non-whitespace, non-comment, non-string: end of directive prologue
      return false;
    }

    return false;
  }

  test("every server module opts into the server-only boundary", () => {
    const serverFiles = walk(path.join(root, "lib", "server"));
    expect(serverFiles.length).toBeGreaterThan(10);
    for (const f of serverFiles) {
      const src = fs.readFileSync(f, "utf8");
      expect({ file: path.relative(root, f), hasServerOnly: src.includes('import "server-only"') }).toEqual({
        file: path.relative(root, f),
        hasServerOnly: true,
      });
    }
  });

  test("no client-side module imports the server domain", () => {
    const offenders: string[] = [];

    // Scan components/ and lib/ (excluding lib/server itself)
    // Only flag files that have "use client" directive (Client Components/modules)
    const clientDirs = ["components", "lib"];
    for (const d of clientDirs) {
      for (const f of walk(path.join(root, d))) {
        const rel = path.relative(root, f);
        if (rel.startsWith(path.join("lib", "server"))) continue; // server domain itself is fine
        const src = fs.readFileSync(f, "utf8");

        // Check if this is a client-side module (has "use client" directive)
        if (!hasUseClientDirective(src)) continue; // server-only module, skip

        // Check for lib/server imports in client modules
        if (/(from\s+["']@?\/?lib\/server|require\(["'].*lib\/server)/.test(src)) {
          offenders.push(rel);
        }
      }
    }

    // Scan app/ directory
    // Route handlers, instrumentation are server code and exempt
    // Client Components (with "use client") must not import lib/server
    // Server Components (without "use client") may import lib/server
    for (const f of walk(path.join(root, "app"))) {
      const rel = path.relative(root, f);
      // Existing exemptions: API routes, instrumentation, proxy files
      if (rel.includes("api") || rel.endsWith("proxy.ts") || rel.startsWith("instrumentation")) continue;

      const src = fs.readFileSync(f, "utf8");

      // Only check Client Components (files with "use client" directive)
      // Server Components (no directive) are allowed to import lib/server/*
      if (!hasUseClientDirective(src)) continue;

      // Check for lib/server imports in Client Components
      if (/(from\s+["']@?\/?lib\/server|require\(["'].*lib\/server)/.test(src)) {
        offenders.push(rel);
      }
    }

    expect(offenders).toEqual([]);
  });

  test("no Binance secret is hardcoded anywhere in the source tree", () => {
    const dirs = ["app", "components", "lib", "tests"];
    const hits: string[] = [];
    for (const d of dirs) {
      for (const f of walk(path.join(root, d))) {
        const src = fs.readFileSync(f, "utf8");
        // 64-hex blobs that look like real secrets (not test fixtures with obvious markers)
        if (/binanceApiSecret\s*[:=]\s*["'][0-9a-f]{64}["']/i.test(src)) hits.push(path.relative(root, f));
        if (/MAWS_BINANCE_API_SECRET\s*=\s*[0-9a-f]{64}/i.test(src)) hits.push(path.relative(root, f));
      }
    }
    expect(hits).toEqual([]);
  });

  test(".env.example documents placeholders only", () => {
    const p = path.join(root, ".env.example");
    if (!fs.existsSync(p)) return; // optional file
    const src = fs.readFileSync(p, "utf8");
    expect(src).not.toMatch(/MAWS_BINANCE_API_SECRET\s*=\s*[0-9a-fA-F]{64}/);
  });

  describe("use client directive detection", () => {
    // Helper to test directive detection
    function detectsDirective(source: string): boolean {
      return hasUseClientDirective(source);
    }

    test("detects simple 'use client' with double quotes", () => {
      expect(detectsDirective('"use client";\nexport default function() {}')).toBe(true);
    });

    test("detects simple 'use client' with single quotes", () => {
      expect(detectsDirective("'use client';\nexport default function() {}")).toBe(true);
    });

    test("detects 'use client' without semicolon", () => {
      expect(detectsDirective('"use client"\nexport default function() {}')).toBe(true);
    });

    test("detects 'use client' with leading whitespace", () => {
      expect(detectsDirective('  \n\t"use client";\nexport default function() {}')).toBe(true);
    });

    test("detects 'use client' after line comment", () => {
      expect(detectsDirective('// comment\n"use client";\nexport default function() {}')).toBe(true);
    });

    test("detects 'use client' after block comment", () => {
      expect(detectsDirective('/* comment */\n"use client";\nexport default function() {}')).toBe(true);
    });

    test("detects 'use client' after multiple comments", () => {
      expect(detectsDirective('/* header */\n// line\n"use client";\nexport default function() {}')).toBe(true);
    });

    test("ignores 'use client' in later code", () => {
      expect(detectsDirective('export default function() { "use client"; }')).toBe(false);
    });

    test("ignores 'use client' in comment", () => {
      expect(detectsDirective('// "use client"\nexport default function() {}')).toBe(false);
    });

    test("ignores 'use client' after other code", () => {
      expect(detectsDirective('const x = 1;\n"use client";')).toBe(false);
    });

    test("detects 'use client' after other directives", () => {
      expect(detectsDirective('"use strict";\n"use client";\nexport default function() {}')).toBe(true);
    });

    test("returns false for Server Component (no directive)", () => {
      expect(detectsDirective('import { headers } from "next/headers";\nexport default async function() {}')).toBe(false);
    });

    test("returns false for empty file", () => {
      expect(detectsDirective('')).toBe(false);
    });

    test("returns false for file with only comments", () => {
      expect(detectsDirective('// just comments\n/* more comments */')).toBe(false);
    });

    test("handles BOM if present", () => {
      expect(detectsDirective('\ufeff"use client";\nexport default function() {}')).toBe(true);
    });

    test("ignores unclosed string", () => {
      expect(detectsDirective('"use client')).toBe(false);
    });

    test("handles escaped quotes in directive", () => {
      // A directive "use \"client\"" contains literal 'use "client"' (not 'use client')
      // This should NOT match "use client" directive
      const result = detectsDirective('"use \\"client\\"";\nexport default function() {}');
      // The content after unescaping is: use "client" (not: use client)
      // So it's a directive, but not the "use client" directive we're looking for
      expect(result).toBe(false);
    });
  });
});
