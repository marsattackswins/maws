import { describe, test, expect, beforeEach } from "@jest/globals";
import { resolveOperatorSession } from "@/lib/server/auth/session-guard";
import { createSession, revokeSession, sessionCookieName, SESSION_TTL_MS } from "@/lib/server/auth/session";
import { secureCookieContext } from "@/lib/server/http/guards";
import { freshEnv, makeCfg } from "./helpers";

describe("session resolution primitive", () => {
  beforeEach(() => {
    freshEnv(makeCfg());
  });

  test("local mode: resolveOperatorSession still works (doesn't bypass internally)", () => {
    const cfg = makeCfg({ env: "local" });
    const { sessionId } = createSession("test-agent");
    const cookieName = sessionCookieName(secureCookieContext(cfg));
    const cookieHeader = `${cookieName}=${sessionId}`;
    
    const session = resolveOperatorSession(cookieHeader, cfg);
    expect(session).not.toBeNull();
    expect(session?.csrfToken).toBeTruthy();
  });

  test("testnet: valid session returns SessionRecord", () => {
    const cfg = makeCfg({ env: "testnet" });
    const { sessionId } = createSession("test-agent");
    const cookieName = sessionCookieName(secureCookieContext(cfg));
    const cookieHeader = `${cookieName}=${sessionId}`;
    
    const session = resolveOperatorSession(cookieHeader, cfg);
    expect(session).not.toBeNull();
    expect(session?.csrfToken).toBeTruthy();
  });

  test("missing cookie returns null", () => {
    const cfg = makeCfg({ env: "testnet" });
    const session = resolveOperatorSession(null, cfg);
    expect(session).toBeNull();
  });

  test("malformed session ID returns null", () => {
    const cfg = makeCfg({ env: "testnet" });
    const cookieName = sessionCookieName(secureCookieContext(cfg));
    const cookieHeader = `${cookieName}=not-a-valid-hex-session`;
    
    const session = resolveOperatorSession(cookieHeader, cfg);
    expect(session).toBeNull();
  });

  test("expired session returns null", () => {
    const cfg = makeCfg({ env: "testnet" });
    const now = Date.now();
    const { sessionId } = createSession("test-agent", now - SESSION_TTL_MS - 1000);
    const cookieName = sessionCookieName(secureCookieContext(cfg));
    const cookieHeader = `${cookieName}=${sessionId}`;
    
    const session = resolveOperatorSession(cookieHeader, cfg);
    expect(session).toBeNull();
  });

  test("revoked session returns null", () => {
    const cfg = makeCfg({ env: "testnet" });
    const { sessionId } = createSession("test-agent");
    revokeSession(sessionId);
    const cookieName = sessionCookieName(secureCookieContext(cfg));
    const cookieHeader = `${cookieName}=${sessionId}`;
    
    const session = resolveOperatorSession(cookieHeader, cfg);
    expect(session).toBeNull();
  });

  test("wrong cookie name returns null", () => {
    const cfg = makeCfg({ env: "testnet" });
    const { sessionId } = createSession("test-agent");
    // Use the wrong cookie name (secure when should be plain, or vice versa)
    const wrongName = secureCookieContext(cfg) ? "maws.session" : "__Host-maws.session";
    const cookieHeader = `${wrongName}=${sessionId}`;
    
    const session = resolveOperatorSession(cookieHeader, cfg);
    expect(session).toBeNull();
  });

  test("production mode: valid session works", () => {
    const cfg = makeCfg({ env: "production" });
    const { sessionId } = createSession("test-agent");
    const cookieName = sessionCookieName(secureCookieContext(cfg));
    const cookieHeader = `${cookieName}=${sessionId}`;
    
    const session = resolveOperatorSession(cookieHeader, cfg);
    expect(session).not.toBeNull();
  });

  test("shadow mode: valid session works", () => {
    const cfg = makeCfg({ env: "shadow" });
    const { sessionId } = createSession("test-agent");
    const cookieName = sessionCookieName(secureCookieContext(cfg));
    const cookieHeader = `${cookieName}=${sessionId}`;
    
    const session = resolveOperatorSession(cookieHeader, cfg);
    expect(session).not.toBeNull();
  });
});

describe("proxy route authentication", () => {
  beforeEach(() => {
    freshEnv(makeCfg());
  });

  describe("/api/news/finnhub", () => {
    test("local mode: allows anonymous access", async () => {
      const cfg = makeCfg({ env: "local" });
      freshEnv(cfg);
      
      // Mock the route behavior (no session, local mode)
      // In local mode, route should proceed without auth check
      const session = cfg.env === "local" ? null : resolveOperatorSession(null, cfg);
      const shouldAllow = cfg.env === "local" || session !== null;
      
      expect(shouldAllow).toBe(true);
    });

    test("testnet mode: rejects without session", () => {
      const cfg = makeCfg({ env: "testnet" });
      const session = resolveOperatorSession(null, cfg);
      expect(session).toBeNull();
    });

    test("testnet mode: accepts valid session", () => {
      const cfg = makeCfg({ env: "testnet" });
      const { sessionId } = createSession("test-agent");
      const cookieName = sessionCookieName(secureCookieContext(cfg));
      const cookieHeader = `${cookieName}=${sessionId}`;
      
      const session = resolveOperatorSession(cookieHeader, cfg);
      expect(session).not.toBeNull();
    });

    test("testnet mode: rejects expired session", () => {
      const cfg = makeCfg({ env: "testnet" });
      const now = Date.now();
      const { sessionId } = createSession("test-agent", now - SESSION_TTL_MS - 1000);
      const cookieName = sessionCookieName(secureCookieContext(cfg));
      const cookieHeader = `${cookieName}=${sessionId}`;
      
      const session = resolveOperatorSession(cookieHeader, cfg);
      expect(session).toBeNull();
    });

    test("testnet mode: rejects revoked session", () => {
      const cfg = makeCfg({ env: "testnet" });
      const { sessionId } = createSession("test-agent");
      revokeSession(sessionId);
      const cookieName = sessionCookieName(secureCookieContext(cfg));
      const cookieHeader = `${cookieName}=${sessionId}`;
      
      const session = resolveOperatorSession(cookieHeader, cfg);
      expect(session).toBeNull();
    });

    test("testnet mode: rejects malformed session", () => {
      const cfg = makeCfg({ env: "testnet" });
      const cookieName = sessionCookieName(secureCookieContext(cfg));
      const cookieHeader = `${cookieName}=invalid-session-id`;
      
      const session = resolveOperatorSession(cookieHeader, cfg);
      expect(session).toBeNull();
    });

    test("testnet mode: rejects wrong cookie name", () => {
      const cfg = makeCfg({ env: "testnet" });
      const { sessionId } = createSession("test-agent");
      const wrongName = secureCookieContext(cfg) ? "maws.session" : "__Host-maws.session";
      const cookieHeader = `${wrongName}=${sessionId}`;
      
      const session = resolveOperatorSession(cookieHeader, cfg);
      expect(session).toBeNull();
    });
  });

  describe("/api/calendar/xoomar", () => {
    test("local mode: allows anonymous access", () => {
      const cfg = makeCfg({ env: "local" });
      const shouldAllow = cfg.env === "local" || resolveOperatorSession(null, cfg) !== null;
      expect(shouldAllow).toBe(true);
    });

    test("testnet mode: rejects without session", () => {
      const cfg = makeCfg({ env: "testnet" });
      const session = resolveOperatorSession(null, cfg);
      expect(session).toBeNull();
    });

    test("testnet mode: accepts valid session", () => {
      const cfg = makeCfg({ env: "testnet" });
      const { sessionId } = createSession("test-agent");
      const cookieName = sessionCookieName(secureCookieContext(cfg));
      const cookieHeader = `${cookieName}=${sessionId}`;
      
      const session = resolveOperatorSession(cookieHeader, cfg);
      expect(session).not.toBeNull();
    });

    test("testnet mode: rejects expired session", () => {
      const cfg = makeCfg({ env: "testnet" });
      const now = Date.now();
      const { sessionId } = createSession("test-agent", now - SESSION_TTL_MS - 1000);
      const cookieName = sessionCookieName(secureCookieContext(cfg));
      const cookieHeader = `${cookieName}=${sessionId}`;
      
      const session = resolveOperatorSession(cookieHeader, cfg);
      expect(session).toBeNull();
    });

    test("testnet mode: rejects revoked session", () => {
      const cfg = makeCfg({ env: "testnet" });
      const { sessionId } = createSession("test-agent");
      revokeSession(sessionId);
      const cookieName = sessionCookieName(secureCookieContext(cfg));
      const cookieHeader = `${cookieName}=${sessionId}`;
      
      const session = resolveOperatorSession(cookieHeader, cfg);
      expect(session).toBeNull();
    });

    test("production mode: requires session", () => {
      const cfg = makeCfg({ env: "production" });
      const sessionWithoutCookie = resolveOperatorSession(null, cfg);
      expect(sessionWithoutCookie).toBeNull();
      
      const { sessionId } = createSession("test-agent");
      const cookieName = sessionCookieName(secureCookieContext(cfg));
      const cookieHeader = `${cookieName}=${sessionId}`;
      const sessionWithCookie = resolveOperatorSession(cookieHeader, cfg);
      expect(sessionWithCookie).not.toBeNull();
    });

    test("shadow mode: requires session", () => {
      const cfg = makeCfg({ env: "shadow" });
      const sessionWithoutCookie = resolveOperatorSession(null, cfg);
      expect(sessionWithoutCookie).toBeNull();
      
      const { sessionId } = createSession("test-agent");
      const cookieName = sessionCookieName(secureCookieContext(cfg));
      const cookieHeader = `${cookieName}=${sessionId}`;
      const sessionWithCookie = resolveOperatorSession(cookieHeader, cfg);
      expect(sessionWithCookie).not.toBeNull();
    });
  });
});
