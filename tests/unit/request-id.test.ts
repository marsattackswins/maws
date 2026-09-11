/** Request ID correlation helpers (lib/server/http/request-id.ts). *
 *
 * Covers generation, sanitization of client-supplied x-request-id values,
 * AsyncLocalStorage scope propagation (including across awaits), and
 * response header attachment. Log-line and route-level integration are
 * covered in tests/live-tests/mutation-request-log.test.ts.
 */

import { describe, test, expect } from "@jest/globals";
import {
  REQUEST_ID_HEADER,
  attachRequestId,
  currentRequestId,
  extractRequestId,
  generateRequestId,
  runWithRequestId,
  sanitizeRequestId,
} from "@/lib/server/http/request-id";
import { log } from "@/lib/server/log/logger";

describe("generateRequestId", () => {
  test("produces unique UUID-shaped IDs", () => {
    const a = generateRequestId();
    const b = generateRequestId();
    expect(a).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    expect(a).not.toBe(b);
  });
});

describe("sanitizeRequestId", () => {
  test("accepts well-formed opaque IDs", () => {
    expect(sanitizeRequestId("018f6d2c-9f3a-7b4e-8c1d-2e5f6a7b8c9d")).toBe(
      "018f6d2c-9f3a-7b4e-8c1d-2e5f6a7b8c9d",
    );
    expect(sanitizeRequestId("trace-abc_123:span/45")).toBe("trace-abc_123:span/45");
  });

  test("trims surrounding whitespace", () => {
    expect(sanitizeRequestId("  abc-123  ")).toBe("abc-123");
  });

  test("takes the first value of a repeated header", () => {
    expect(sanitizeRequestId("first-id, second-id")).toBe("first-id");
  });

  test("rejects empty, oversized, or unsafe values", () => {
    expect(sanitizeRequestId(null)).toBeUndefined();
    expect(sanitizeRequestId(undefined)).toBeUndefined();
    expect(sanitizeRequestId("")).toBeUndefined();
    expect(sanitizeRequestId("   ")).toBeUndefined();
    expect(sanitizeRequestId("a".repeat(129))).toBeUndefined(); // over MAX_REQUEST_ID_LENGTH
    expect(sanitizeRequestId("a".repeat(128))).toBe("a".repeat(128)); // exactly at cap
    // Header-injection control chars and whitespace inside the value.
    expect(sanitizeRequestId("id\r\nInjected: header")).toBeUndefined();
    expect(sanitizeRequestId("has space")).toBeUndefined();
    expect(sanitizeRequestId("semi;colon")).toBeUndefined();
  });
});

describe("extractRequestId", () => {
  test("echoes a valid client-supplied x-request-id", () => {
    const req = new Request("http://localhost/api/live/orders", {
      method: "POST",
      headers: { [REQUEST_ID_HEADER]: "client-trace-1" },
    });
    expect(extractRequestId(req)).toBe("client-trace-1");
  });

  test("mints a fresh ID when the header is missing or invalid", () => {
    const missing = extractRequestId(new Request("http://localhost/api/live/orders", { method: "POST" }));
    const invalid = extractRequestId(
      new Request("http://localhost/api/live/orders", {
        method: "POST",
        headers: { [REQUEST_ID_HEADER]: "bad id with spaces" },
      }),
    );
    for (const id of [missing, invalid]) {
      expect(id).toMatch(/^[0-9a-f-]{36}$/);
    }
    expect(missing).not.toBe(invalid);
  });
});

describe("request ID scope (AsyncLocalStorage)", () => {
  test("currentRequestId is undefined outside any scope", () => {
    expect(currentRequestId()).toBeUndefined();
  });

  test("runWithRequestId binds the ID across awaits and sibling async tasks", async () => {
    const seen: Array<string | undefined> = [];
    const probe = async (delayMs: number): Promise<void> => {
      await new Promise((r) => setTimeout(r, delayMs));
      seen.push(currentRequestId());
    };

    await Promise.all([
      runWithRequestId("req-A", () => probe(5)),
      runWithRequestId("req-B", () => probe(1)),
      probe(0),
    ]);

    expect(seen).toContain("req-A");
    expect(seen).toContain("req-B");
    expect(seen).toContain(undefined); // the unscoped call stays unscoped
  });

  test("nested scopes shadow, then restore, the outer ID", async () => {
    await runWithRequestId("outer", async () => {
      expect(currentRequestId()).toBe("outer");
      await runWithRequestId("inner", async () => {
        expect(currentRequestId()).toBe("inner");
      });
      expect(currentRequestId()).toBe("outer");
    });
  });
});

describe("attachRequestId", () => {
  test("sets x-request-id on a mutable Response without altering status/body", async () => {
    const res = new Response(JSON.stringify({ ok: true }), { status: 201 });
    const out = attachRequestId(res, "rid-1");
    expect(out.status).toBe(201);
    expect(await out.json()).toEqual({ ok: true });
    expect(out.headers.get(REQUEST_ID_HEADER)).toBe("rid-1");
  });

  test("preserves existing headers", () => {
    const res = new Response(null, { status: 429, headers: { "retry-after": "30" } });
    const out = attachRequestId(res, "rid-2");
    expect(out.headers.get("retry-after")).toBe("30");
    expect(out.headers.get(REQUEST_ID_HEADER)).toBe("rid-2");
    expect(out.status).toBe(429);
  });
});

describe("logger stamps request_id on JSON lines", () => {
  test("lines include request_id inside a scope and omit it outside", () => {
    const captured: string[] = [];
    const spy = jest.spyOn(process.stdout, "write").mockImplementation(((chunk: unknown) => {
      captured.push(String(chunk));
      return true;
    }) as typeof process.stdout.write);
    try {
      log.info("outside.scope");
      const outside = JSON.parse(captured[0]) as Record<string, unknown>;
      expect(outside.request_id).toBeUndefined();

      captured.length = 0;
      void runWithRequestId("log-rid-42", async () => {
        log.info("inside.scope", { symbol: "BTCUSDT" });
      });
      const inside = JSON.parse(captured[0]) as Record<string, unknown>;
      expect(inside.request_id).toBe("log-rid-42");
      expect((inside.fields as Record<string, unknown>).symbol).toBe("BTCUSDT");
      expect(inside.msg).toBe("inside.scope");
    } finally {
      spy.mockRestore();
    }
  });
});
