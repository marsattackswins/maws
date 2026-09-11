import { describe, test, expect, beforeEach } from "@jest/globals";
import { isAdminPageAuthorized, isOperatorPageAuthorized } from "@/lib/server/auth/page-guard";
import { createSession, revokeSession, sessionCookieName, SESSION_TTL_MS } from "@/lib/server/auth/session";
import { secureCookieContext } from "@/lib/server/http/guards";
import { freshEnv, makeCfg } from "./helpers";

// The shared operator-page guard is exercised for every page that renders
// operator content (main terminal AND admin dashboard). Both entry points
// must agree on local-anonymous / non-local-session semantics.
const GUARDS = [
  { name: "isOperatorPageAuthorized", check: isOperatorPageAuthorized },
  { name: "isAdminPageAuthorized (deprecated alias)", check: isAdminPageAuthorized },
];

describe("operator page authorization", () => {
  beforeEach(() => {
    freshEnv(makeCfg({ allowedOrigin: null }));
  });

  for (const { name, check } of GUARDS) {
    describe(name, () => {
      test("local env allows access without session", () => {
        const localCfg = makeCfg({ env: "local" });
        freshEnv(localCfg);

        // No cookie header at all
        expect(check(null)).toBe(true);

        // Empty cookie header
        expect(check("")).toBe(true);
      });

      test("non-local env with valid session allows access", () => {
        const testCfg = makeCfg(); // defaults to testnet
        freshEnv(testCfg);

        const { sessionId } = createSession("test-ua");
        const cookieName = sessionCookieName(secureCookieContext(testCfg));
        const cookieHeader = `${cookieName}=${sessionId}`;

        expect(check(cookieHeader)).toBe(true);
      });

      test("non-local env without session denies access", () => {
        const testCfg = makeCfg();
        freshEnv(testCfg);

        // No cookie
        expect(check(null)).toBe(false);

        // Empty cookie
        expect(check("")).toBe(false);
      });

      test("local env /status page allows anonymous access (no session required)", () => {
        // This test verifies the auth gate for /status specifically
        const localCfg = makeCfg({ env: "local" });
        freshEnv(localCfg);

        // In local mode, no session is required
        // The isOperatorPageAuthorized helper returns true for any cookie (or none)
        expect(check(null)).toBe(true);
        expect(check("")).toBe(true);
        expect(check("random_cookie=value")).toBe(true);

        // This means the /status page would render (not redirect to /login)
        // when MAWS_ENV=local, even without any session cookie
      });

      test("non-local env with revoked session denies access", () => {
        const testCfg = makeCfg();
        freshEnv(testCfg);

        const { sessionId } = createSession("test-ua");
        const cookieName = sessionCookieName(secureCookieContext(testCfg));
        const cookieHeader = `${cookieName}=${sessionId}`;

        // Valid before revocation
        expect(check(cookieHeader)).toBe(true);

        // Revoke the session
        const revoked = revokeSession(sessionId);
        expect(revoked).toBe(true);

        // Invalid after revocation
        expect(check(cookieHeader)).toBe(false);
      });

      test("non-local env with malformed session ID denies access", () => {
        const testCfg = makeCfg();
        freshEnv(testCfg);

        const cookieName = sessionCookieName(secureCookieContext(testCfg));

        const malformedIds = [
          "not-hex-at-all",
          "a".repeat(32),          // too short
          "g".repeat(64),          // invalid hex
          "",                      // empty
          "a".repeat(63),          // almost correct length
          "../../../etc/passwd",   // path traversal attempt
        ];

        for (const badId of malformedIds) {
          const cookieHeader = `${cookieName}=${badId}`;
          expect(check(cookieHeader)).toBe(false);
        }
      });

      test("non-local env with wrong cookie name denies access", () => {
        const testCfg = makeCfg();
        freshEnv(testCfg);

        const { sessionId } = createSession("test-ua");

        // Use wrong cookie name (legacy or incorrect)
        expect(check(`maws_session=${sessionId}`)).toBe(false);

        // Use completely wrong name
        expect(check(`random_cookie=${sessionId}`)).toBe(false);
      });

      test("multiple cookies in header extracts correct session", () => {
        const testCfg = makeCfg();
        freshEnv(testCfg);

        const { sessionId } = createSession("test-ua");
        const cookieName = sessionCookieName(secureCookieContext(testCfg));

        // Cookie header with multiple cookies
        const multiCookieHeader = `other_cookie=value1; ${cookieName}=${sessionId}; another=value2`;

        expect(check(multiCookieHeader)).toBe(true);
      });

      test("secure cookie context: HTTP uses maws.session", () => {
        const httpCfg = makeCfg({ allowedOrigin: "http://localhost:3000" });
        freshEnv(httpCfg);

        const { sessionId } = createSession("test-ua");
        const cookieName = sessionCookieName(secureCookieContext(httpCfg));
        expect(cookieName).toBe("maws.session");

        expect(check(`${cookieName}=${sessionId}`)).toBe(true);
      });

      test("secure cookie context: HTTPS uses __Host-maws.session", () => {
        const httpsCfg = makeCfg({ allowedOrigin: "https://terminal.example.com" });
        freshEnv(httpsCfg);

        const { sessionId } = createSession("test-ua");
        const cookieName = sessionCookieName(secureCookieContext(httpsCfg));
        expect(cookieName).toBe("__Host-maws.session");

        expect(check(`${cookieName}=${sessionId}`)).toBe(true);
      });

      test("non-local production env requires valid session", () => {
        const prodCfg = makeCfg({ env: "production" });
        freshEnv(prodCfg);

        // No session fails
        expect(check(null)).toBe(false);

        // Valid session succeeds
        const { sessionId } = createSession("test-ua");
        const cookieName = sessionCookieName(secureCookieContext(prodCfg));
        const cookieHeader = `${cookieName}=${sessionId}`;
        expect(check(cookieHeader)).toBe(true);
      });

      test("non-local shadow env requires valid session", () => {
        const shadowCfg = makeCfg({ env: "shadow" });
        freshEnv(shadowCfg);

        // No session fails
        expect(check(null)).toBe(false);

        // Valid session succeeds
        const { sessionId } = createSession("test-ua");
        const cookieName = sessionCookieName(secureCookieContext(shadowCfg));
        const cookieHeader = `${cookieName}=${sessionId}`;
        expect(check(cookieHeader)).toBe(true);
      });
    });
  }

  test("server configuration load failure throws", () => {
    // Temporarily break the config by setting invalid environment
    const originalEnv = process.env.MAWS_ENV;
    process.env.MAWS_ENV = "invalid_env_value";

    // Reset the cached config to force reload
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { resetServerConfigForTests } = require("@/lib/server/env/config");
    resetServerConfigForTests();

    try {
      // Both guards should throw when serverConfig() fails
      expect(() => {
        isOperatorPageAuthorized(null);
      }).toThrow();
      expect(() => {
        isAdminPageAuthorized(null);
      }).toThrow();
    } finally {
      // Restore original environment
      if (originalEnv) {
        process.env.MAWS_ENV = originalEnv;
      } else {
        delete process.env.MAWS_ENV;
      }
      resetServerConfigForTests();
    }
  });
});
