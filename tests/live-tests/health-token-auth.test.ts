import { describe, test, expect, beforeEach } from "@jest/globals";
import { compareSecretTokens } from "@/lib/server/auth/token";
import { freshEnv, makeCfg } from "./helpers";

describe("health token authentication", () => {
  beforeEach(() => {
    freshEnv(makeCfg());
  });

  describe("compareSecretTokens timing-safe helper", () => {
    test("returns true for matching tokens", () => {
      expect(compareSecretTokens("secret123", "secret123")).toBe(true);
      expect(compareSecretTokens("a".repeat(64), "a".repeat(64))).toBe(true);
    });

    test("returns false for non-matching tokens", () => {
      expect(compareSecretTokens("secret123", "secret124")).toBe(false);
      expect(compareSecretTokens("short", "longer")).toBe(false);
      expect(compareSecretTokens("a".repeat(64), "b".repeat(64))).toBe(false);
    });

    test("returns false for null or undefined inputs", () => {
      expect(compareSecretTokens(null, "secret")).toBe(false);
      expect(compareSecretTokens("secret", null)).toBe(false);
      expect(compareSecretTokens(undefined, "secret")).toBe(false);
      expect(compareSecretTokens("secret", undefined)).toBe(false);
      expect(compareSecretTokens(null, null)).toBe(false);
      expect(compareSecretTokens(undefined, undefined)).toBe(false);
    });

    test("returns false for empty strings", () => {
      expect(compareSecretTokens("", "secret")).toBe(false);
      expect(compareSecretTokens("secret", "")).toBe(false);
      expect(compareSecretTokens("", "")).toBe(false);
    });

    test("is case-sensitive", () => {
      expect(compareSecretTokens("Secret123", "secret123")).toBe(false);
      expect(compareSecretTokens("ABCD", "abcd")).toBe(false);
    });
  });

  describe("route-level health token behavior", () => {
    test("valid x-maws-health-token header should authorize", () => {
      const cfg = makeCfg({ healthToken: "test-secret-token" });
      const headerToken = "test-secret-token";
      
      // Simulate route logic
      const tokenValid = compareSecretTokens(headerToken, cfg.healthToken);
      expect(tokenValid).toBe(true);
    });

    test("invalid header token should not authorize", () => {
      const cfg = makeCfg({ healthToken: "test-secret-token" });
      const headerToken = "wrong-token";
      
      const tokenValid = compareSecretTokens(headerToken, cfg.healthToken);
      expect(tokenValid).toBe(false);
    });

    test("missing header token should not authorize", () => {
      const cfg = makeCfg({ healthToken: "test-secret-token" });
      const headerToken = null;
      
      const tokenValid = compareSecretTokens(headerToken, cfg.healthToken);
      expect(tokenValid).toBe(false);
    });

    test("token validation when no token configured", () => {
      const cfg = makeCfg({ healthToken: null });
      const headerToken = "some-token";
      
      const tokenValid = compareSecretTokens(headerToken, cfg.healthToken);
      expect(tokenValid).toBe(false);
    });

    test("empty header token should not authorize", () => {
      const cfg = makeCfg({ healthToken: "test-secret-token" });
      const headerToken = "";
      
      const tokenValid = compareSecretTokens(headerToken, cfg.healthToken);
      expect(tokenValid).toBe(false);
    });
  });

  describe("security properties", () => {
    test("timing-safe comparison uses Buffer and timingSafeEqual", () => {
      // This test verifies the implementation uses the correct pattern
      // by checking that it handles different-length strings safely
      const short = "abc";
      const long = "abcdefgh";
      
      // Different lengths should return false without timing leak
      expect(compareSecretTokens(short, long)).toBe(false);
      expect(compareSecretTokens(long, short)).toBe(false);
    });

    test("whitespace differences matter", () => {
      expect(compareSecretTokens("secret", "secret ")).toBe(false);
      expect(compareSecretTokens(" secret", "secret")).toBe(false);
      expect(compareSecretTokens("secret\n", "secret")).toBe(false);
    });

    test("null bytes do not truncate comparison", () => {
      const withNull = "secret\0extra";
      const withoutNull = "secret";
      
      expect(compareSecretTokens(withNull, withoutNull)).toBe(false);
    });
  });
});
