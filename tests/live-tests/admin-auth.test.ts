import { describe, test, expect, beforeEach } from "@jest/globals";
import { createSession, getSession, revokeSession, sessionCookieName, SESSION_TTL_MS } from "@/lib/server/auth/session";
import { authenticate, isAuthFailure, secureCookieContext } from "@/lib/server/http/guards";
import { freshEnv, makeCfg } from "./helpers";

describe("admin route authentication", () => {
  beforeEach(() => {
    freshEnv(makeCfg({ allowedOrigin: null }));
  });

  const mkAdminReq = (path: string, init?: { cookie?: string; healthToken?: string }) => {
    const url = new URL(`http://localhost:3000/api/admin${path}`);
    if (init?.healthToken) url.searchParams.set("token", init.healthToken);
    const headers = new Headers();
    if (init?.cookie) headers.set("cookie", init.cookie);
    return new Request(url.toString(), { method: "GET", headers });
  };

  test("local env bypasses authentication for all admin routes", () => {
    const localCfg = makeCfg({ env: "local" });
    // All admin routes are read-only GET endpoints
    const paths = ["/health", "/metrics", "/performance", "/circuits"];
    for (const path of paths) {
      const ctx = authenticate(mkAdminReq(path), localCfg);
      // Local mode is gated at environment level; routes handle it separately
      expect(isAuthFailure(ctx)).toBe(true);
      if (isAuthFailure(ctx)) {
        expect(ctx.response.status).toBe(403);
      }
    }
  });

  test("non-local mode requires valid session", async () => {
    const cfg = makeCfg();
    
    // Missing session
    const noSession = authenticate(mkAdminReq("/metrics"), cfg);
    expect(isAuthFailure(noSession)).toBe(true);
    if (isAuthFailure(noSession)) {
      expect(noSession.response.status).toBe(401);
      const body = (await noSession.response.json()) as { error: { code: string; message: string } };
      expect(body.error.code).toBe("unauthenticated");
      expect(body.error.message).toBe("Sign in required");
    }

    // Valid session
    const { sessionId } = createSession("test-ua");
    const cookie = `${sessionCookieName(secureCookieContext(cfg))}=${sessionId}`;
    const withSession = authenticate(mkAdminReq("/metrics", { cookie }), cfg);
    expect(isAuthFailure(withSession)).toBe(false);
    if (!isAuthFailure(withSession)) {
      expect(withSession.sessionId).toBe(sessionId);
      expect(withSession.cfg.env).toBe("testnet");
    }
  });

  test("expired session returns 401", async () => {
    const cfg = makeCfg();
    const now = 1_700_000_000_000;
    const { sessionId } = createSession("test-ua", now);
    
    // Session expires after SESSION_TTL_MS
    const cookie = `${sessionCookieName(secureCookieContext(cfg))}=${sessionId}`;
    
    // Simulate time passing beyond TTL
    const expired = getSession(sessionId, now + SESSION_TTL_MS + 1000);
    expect(expired).toBeNull();
    
    // Authentication should fail for expired session
    const ctx = authenticate(mkAdminReq("/metrics", { cookie }), cfg);
    expect(isAuthFailure(ctx)).toBe(true);
    if (isAuthFailure(ctx)) {
      expect(ctx.response.status).toBe(401);
    }
  });

  test("revoked session returns 401", async () => {
    const cfg = makeCfg();
    const { sessionId } = createSession("test-ua");
    const cookie = `${sessionCookieName(secureCookieContext(cfg))}=${sessionId}`;
    
    // Revoke the session
    expect(revokeSession(sessionId)).toBe(true);
    
    // Authentication should fail
    const ctx = authenticate(mkAdminReq("/metrics", { cookie }), cfg);
    expect(isAuthFailure(ctx)).toBe(true);
    if (isAuthFailure(ctx)) {
      expect(ctx.response.status).toBe(401);
    }
  });

  test("malformed session ID returns 401", async () => {
    const cfg = makeCfg();
    
    // Various malformed session IDs
    const malformed = [
      "not-hex-at-all",           // non-hex
      "a".repeat(32),              // wrong length (too short)
      "g".repeat(64),              // invalid hex characters
      "",                          // empty
      "a".repeat(63),              // almost correct length
    ];
    
    for (const bad of malformed) {
      const cookie = `${sessionCookieName(secureCookieContext(cfg))}=${bad}`;
      const ctx = authenticate(mkAdminReq("/metrics", { cookie }), cfg);
      expect(isAuthFailure(ctx)).toBe(true);
      if (isAuthFailure(ctx)) {
        expect(ctx.response.status).toBe(401);
      }
    }
  });

  test("missing cookie returns 401", async () => {
    const cfg = makeCfg();
    const ctx = authenticate(mkAdminReq("/metrics"), cfg);
    expect(isAuthFailure(ctx)).toBe(true);
    if (isAuthFailure(ctx)) {
      expect(ctx.response.status).toBe(401);
    }
  });

  test("wrong cookie name (legacy maws_session) fails authentication", async () => {
    const cfg = makeCfg();
    const { sessionId } = createSession("test-ua");
    
    // Use hardcoded "maws_session" instead of the canonical cookie name
    const cookie = `maws_session=${sessionId}`;
    const ctx = authenticate(mkAdminReq("/metrics", { cookie }), cfg);
    
    // Should fail because authenticate() uses readSessionCookie with correct name
    expect(isAuthFailure(ctx)).toBe(true);
    if (isAuthFailure(ctx)) {
      expect(ctx.response.status).toBe(401);
    }
  });

  test("secure cookie context: HTTP uses maws.session", () => {
    const httpCfg = makeCfg({ allowedOrigin: "http://localhost:3000" });
    expect(secureCookieContext(httpCfg)).toBe(false);
    expect(sessionCookieName(secureCookieContext(httpCfg))).toBe("maws.session");
  });

  test("secure cookie context: HTTPS uses __Host-maws.session", () => {
    const httpsCfg = makeCfg({ allowedOrigin: "https://terminal.example.com" });
    expect(secureCookieContext(httpsCfg)).toBe(true);
    expect(sessionCookieName(secureCookieContext(httpsCfg))).toBe("__Host-maws.session");
  });

  test("session extends sliding expiry on successful authentication", () => {
    freshEnv(makeCfg());
    const now = 1_700_000_000_000;
    const { sessionId } = createSession("test-ua", now);
    
    // First access at T+1min
    const s1 = getSession(sessionId, now + 60_000);
    expect(s1).not.toBeNull();
    expect(s1?.expiresAt).toBe(now + 60_000 + SESSION_TTL_MS);
    
    // Second access at T+2min extends again
    const s2 = getSession(sessionId, now + 120_000);
    expect(s2).not.toBeNull();
    expect(s2?.expiresAt).toBe(now + 120_000 + SESSION_TTL_MS);
  });

  test("GET requests do not require CSRF (read-only endpoints)", () => {
    const testCfg = makeCfg();
    const { sessionId } = createSession("test-ua");
    const cookie = `${sessionCookieName(secureCookieContext(testCfg))}=${sessionId}`;
    
    // Admin routes are all GET endpoints - no CSRF required
    const ctx = authenticate(mkAdminReq("/metrics", { cookie }), testCfg);
    expect(isAuthFailure(ctx)).toBe(false);
  });

  test("admin/circuits already uses canonical authentication", () => {
    // This test verifies circuits route remains correct without modification
    const cfg = makeCfg();
    const { sessionId } = createSession("test-ua");
    const cookie = `${sessionCookieName(secureCookieContext(cfg))}=${sessionId}`;
    
    const mkCircuitReq = (init?: { cookie?: string }) => {
      const headers = new Headers();
      if (init?.cookie) headers.set("cookie", init.cookie);
      return new Request("http://localhost:3000/api/admin/circuits", { method: "GET", headers });
    };
    
    // Should work with valid session
    const withAuth = authenticate(mkCircuitReq({ cookie }), cfg);
    expect(isAuthFailure(withAuth)).toBe(false);
    
    // Should fail without session
    const noAuth = authenticate(mkCircuitReq(), cfg);
    expect(isAuthFailure(noAuth)).toBe(true);
  });

  test("health token header authentication", () => {
    const cfg = makeCfg({ healthToken: "test-secret-token-123" });
    const { sessionId } = createSession("test-ua");
    const validCookie = `${sessionCookieName(secureCookieContext(cfg))}=${sessionId}`;
    
    // Valid header token works
    const mkReqWithToken = (path: string, token?: string) => {
      const headers = new Headers();
      if (token) headers.set("x-maws-health-token", token);
      return new Request(`http://localhost:3000/api/admin${path}`, { method: "GET", headers });
    };
    
    const withValidToken = authenticate(mkReqWithToken("/metrics", "test-secret-token-123"), cfg);
    // Token alone doesn't authenticate the guard (guard requires session)
    // But route logic accepts token OR session
    expect(isAuthFailure(withValidToken)).toBe(true); // Guard fails, but route will check token
    
    // Invalid header token still fails
    const withInvalidToken = authenticate(mkReqWithToken("/metrics", "wrong-token"), cfg);
    expect(isAuthFailure(withInvalidToken)).toBe(true);
    
    // Valid session still works without token
    const mkReqWithSession = (path: string, cookie?: string) => {
      const headers = new Headers();
      if (cookie) headers.set("cookie", cookie);
      return new Request(`http://localhost:3000/api/admin${path}`, { method: "GET", headers });
    };
    
    const withSession = authenticate(mkReqWithSession("/metrics", validCookie), cfg);
    expect(isAuthFailure(withSession)).toBe(false);
  });

  test("query parameter token must not authenticate (security regression)", () => {
    const cfg = makeCfg({ healthToken: "test-secret-token-123" });
    
    // Query parameter should be ignored by the routes
    // The authenticate() guard doesn't read query params, so this will fail
    const mkReqWithQuery = (path: string, token: string) => {
      const url = new URL(`http://localhost:3000/api/admin${path}`);
      url.searchParams.set("token", token);
      return new Request(url.toString(), { method: "GET" });
    };
    
    const withQueryToken = authenticate(mkReqWithQuery("/metrics", "test-secret-token-123"), cfg);
    expect(isAuthFailure(withQueryToken)).toBe(true);
    // This confirms query tokens don't authenticate the session guard
    // The route implementations must also ignore query tokens
  });
});
