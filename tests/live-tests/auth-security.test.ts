import crypto from "node:crypto";

import { hashPassword, verifyOperatorPassword } from "@/lib/server/auth/password";
import {
  countActiveSessions,
  createSession,
  getSession,
  readSessionCookie,
  revokeAllSessions,
  revokeSession,
  SESSION_TTL_MS,
  sessionCookieName,
} from "@/lib/server/auth/session";
import { checkCsrf, checkOriginAndHost, clientIp, rateLimitLogin, clearLogin, resetRateLimitForTests } from "@/lib/server/auth/guard";
import { authenticate, isAuthFailure, secureCookieContext, sessionCookieAttributes } from "@/lib/server/http/guards";
import { getDb } from "@/lib/server/db/connection";
import { freshEnv, makeCfg } from "./helpers";

describe("operator password hashing", () => {
  test("hash/verify roundtrip with scrypt", () => {
    const stored = hashPassword("correct horse battery staple");
    expect(stored).toMatch(/^[0-9a-f]+:[0-9a-f]+$/);
    expect(verifyOperatorPassword("correct horse battery staple", stored)).toBe(true);
    expect(verifyOperatorPassword("wrong password", stored)).toBe(false);
  });

  test("hashes are salted (two hashes of same password differ)", () => {
    expect(hashPassword("same")).not.toBe(hashPassword("same"));
  });

  test("malformed stored hashes fail closed", () => {
    expect(verifyOperatorPassword("pw", "")).toBe(false);
    expect(verifyOperatorPassword("pw", "no-colon")).toBe(false);
    expect(verifyOperatorPassword("pw", "zz:zz")).toBe(false); // non-hex salts fail closed
    expect(verifyOperatorPassword("", hashPassword("x"))).toBe(false);
    expect(verifyOperatorPassword("y".repeat(600), hashPassword("x"))).toBe(false);
  });
});

describe("sessions: opaque, revocable, sliding expiry", () => {
  beforeEach(() => {
    freshEnv(makeCfg());
  });

  test("only the SHA-256 hash of the session id is persisted", () => {
    const { sessionId } = createSession("ua", 1_700_000_000_000);
    const rows = getDb().prepare(`SELECT session_hash FROM sessions`).all() as Array<{ session_hash: string }>;
    expect(rows).toHaveLength(1);
    expect(rows[0].session_hash).toBe(crypto.createHash("sha256").update(sessionId).digest("hex"));
    expect(rows[0].session_hash).not.toBe(sessionId);
  });

  test("valid session resolves and slides its expiry", () => {
    const { sessionId, csrfToken } = createSession(null, 1_700_000_000_000);
    const s = getSession(sessionId, 1_700_000_000_000 + 60_000);
    expect(s).not.toBeNull();
    expect(s?.csrfToken).toBe(csrfToken);
    expect(s?.expiresAt).toBe(1_700_000_000_000 + 60_000 + SESSION_TTL_MS);
  });

  test("expired, revoked, malformed and unknown sessions are rejected", () => {
    const t0 = 1_700_000_000_000;
    const { sessionId } = createSession(null, t0);
    expect(getSession(sessionId, t0 + SESSION_TTL_MS + 1)).toBeNull();

    const b = createSession(null, t0);
    expect(revokeSession(b.sessionId, t0)).toBe(true);
    expect(getSession(b.sessionId, t0 + 1000)).toBeNull();
    expect(revokeSession(b.sessionId, t0)).toBe(false); // already revoked

    expect(getSession("not-hex", t0)).toBeNull();
    expect(getSession("a".repeat(64), t0)).toBeNull();
    expect(getSession(undefined, t0)).toBeNull();
  });

  test("revokeAllSessions and countActiveSessions", () => {
    const t0 = 1_700_000_000_000;
    createSession(null, t0);
    createSession(null, t0);
    expect(countActiveSessions(t0)).toBe(2);
    expect(revokeAllSessions(t0)).toBe(2);
    expect(countActiveSessions(t0)).toBe(0);
  });

  test("cookie name depends on secure context and header parses", () => {
    expect(sessionCookieName(true)).toBe("__Host-maws.session");
    expect(sessionCookieName(false)).toBe("maws.session");
    expect(readSessionCookie("a=1; maws.session=abc; b=2", false)).toBe("abc");
    expect(readSessionCookie("a=1", false)).toBeNull();
    expect(readSessionCookie(null, false)).toBeNull();
  });
});

describe("origin/host binding and CSRF", () => {
  const cfg = makeCfg({ allowedOrigin: "https://terminal.example.com" });

  const req = (method: string, origin: string | null, host: string | null, csrf?: string) => ({
    method,
    url: "https://terminal.example.com/api/live/orders",
    headers: {
      get: (name: string) => {
        const n = name.toLowerCase();
        if (n === "origin") return origin;
        if (n === "host") return host;
        if (n === "x-maws-csrf") return csrf ?? null;
        return null;
      },
    },
  });

  test("GET requests skip origin checks", () => {
    expect(checkOriginAndHost(req("GET", null, null), cfg).ok).toBe(true);
  });

  test("POST without Origin is rejected", () => {
    const r = checkOriginAndHost(req("POST", null, "terminal.example.com"), cfg);
    expect(r.ok).toBe(false);
    expect(r.reason).toBe("origin_mismatch");
  });

  test("POST with mismatched Origin or Host is rejected", () => {
    expect(checkOriginAndHost(req("POST", "https://evil.example.com", "terminal.example.com"), cfg).ok).toBe(false);
    const hostMismatch = checkOriginAndHost(req("POST", "https://terminal.example.com", "evil.example.com"), cfg);
    expect(hostMismatch.ok).toBe(false);
    expect(hostMismatch.reason).toBe("host_mismatch");
  });

  test("POST with matching Origin and Host passes", () => {
    expect(checkOriginAndHost(req("POST", "https://terminal.example.com", "terminal.example.com"), cfg).ok).toBe(true);
  });

  test("without configured origin only loopback dev origins pass", () => {
    const localCfg = makeCfg({ allowedOrigin: null });
    const local = (origin: string, host: string) => ({
      method: "POST",
      url: `${origin}/api/x`,
      headers: { get: (n: string) => (n.toLowerCase() === "origin" ? origin : n.toLowerCase() === "host" ? host : null) },
    });
    expect(checkOriginAndHost(local("http://localhost:3000", "localhost:3000"), localCfg).ok).toBe(true);
    expect(checkOriginAndHost(local("https://evil.example.com", "evil.example.com"), localCfg).ok).toBe(false);
  });

  test("CSRF token is required on mutating requests and compared exactly", () => {
    const token = "t".repeat(48);
    expect(checkCsrf(req("GET", null, null), token)).toBe(true);
    expect(checkCsrf(req("POST", "o", "h"), token)).toBe(false);
    expect(checkCsrf(req("POST", "o", "h", "x".repeat(48)), token)).toBe(false);
    expect(checkCsrf(req("POST", "o", "h", token), token)).toBe(true);
    expect(checkCsrf(req("DELETE", "o", "h", token), token)).toBe(true);
  });
});

describe("login rate limiting", () => {
  beforeEach(() => resetRateLimitForTests());

  test("5 attempts per window, then blocked; window rolls", () => {
    const t0 = 1_700_000_000_000;
    for (let i = 0; i < 5; i++) expect(rateLimitLogin("ip1", t0)).toBe(true);
    expect(rateLimitLogin("ip1", t0)).toBe(false);
    expect(rateLimitLogin("ip2", t0)).toBe(true); // per-IP
    expect(rateLimitLogin("ip1", t0 + 15 * 60 * 1000 + 1)).toBe(true); // new window
    clearLogin("ip1");
    expect(rateLimitLogin("ip1", t0)).toBe(true);
  });
});

describe("authenticate guard chain", () => {
  beforeEach(() => {
    freshEnv(makeCfg({ allowedOrigin: null }));
  });

  const mkReq = (method: string, init?: { cookie?: string; csrf?: string; origin?: string }) => {
    const headers = new Headers();
    if (init?.cookie) headers.set("cookie", init.cookie);
    if (init?.csrf) headers.set("x-maws-csrf", init.csrf);
    if (init?.origin) headers.set("origin", init.origin);
    return new Request(`http://localhost:3000/api/live/${method === "GET" ? "meta" : "orders"}`, { method, headers });
  };

  test("local env refuses all live routes", () => {
    const localCfg = makeCfg({ env: "local" });
    const ctx = authenticate(mkReq("GET"), localCfg);
    expect(isAuthFailure(ctx)).toBe(true);
    if (isAuthFailure(ctx)) {
      expect(ctx.response.status).toBe(403);
    }
  });

  test("missing session -> 401", async () => {
    const ctx = authenticate(mkReq("GET"), makeCfg());
    expect(isAuthFailure(ctx)).toBe(true);
    if (isAuthFailure(ctx)) {
      expect(ctx.response.status).toBe(401);
      const body = (await ctx.response.json()) as { error: { code: string } };
      expect(body.error.code).toBe("unauthenticated");
    }
  });

  test("valid session passes GET; mutating request requires CSRF", async () => {
    const cfg = makeCfg();
    const { sessionId, csrfToken } = createSession("ua");
    const cookie = `${sessionCookieName(secureCookieContext(cfg))}=${sessionId}`;

    const ok = authenticate(mkReq("GET", { cookie }), cfg);
    expect(isAuthFailure(ok)).toBe(false);

    const noCsrf = authenticate(mkReq("POST", { cookie, origin: "http://localhost:3000" }), cfg);
    expect(isAuthFailure(noCsrf)).toBe(true);
    if (isAuthFailure(noCsrf)) expect(noCsrf.response.status).toBe(403);

    const withCsrf = authenticate(mkReq("POST", { cookie, csrf: csrfToken, origin: "http://localhost:3000" }), cfg);
    expect(isAuthFailure(withCsrf)).toBe(false);
    if (!isAuthFailure(withCsrf)) {
      expect(withCsrf.sessionId).toBe(sessionId);
      expect(typeof withCsrf.ip).toBe("string");
    }
  });

  test("cookie attributes are HttpOnly and SameSite=Strict; Secure only over https origins", () => {
    const insecure = sessionCookieAttributes(makeCfg({ allowedOrigin: null }), "sid");
    expect(insecure).toContain("HttpOnly");
    expect(insecure).toContain("SameSite=Strict");
    expect(insecure).not.toContain("Secure");
    expect(insecure.startsWith("maws.session=sid")).toBe(true);

    const secure = sessionCookieAttributes(makeCfg({ allowedOrigin: "https://terminal.example.com" }), "sid");
    expect(secure).toContain("Secure");
    expect(secure.startsWith("__Host-maws.session=sid")).toBe(true);
  });

  test("clientIp honors X-Forwarded-For only behind a trusted proxy", () => {
    const r = {
      method: "GET",
      url: "http://x/",
      headers: { get: (n: string) => (n.toLowerCase() === "x-forwarded-for" ? "203.0.113.7, 10.0.0.1" : null) },
    };
    expect(clientIp(r, makeCfg({ trustProxy: false }))).toBe("direct");
    expect(clientIp(r, makeCfg({ trustProxy: true }))).toBe("203.0.113.7");
  });
});
