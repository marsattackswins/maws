import { HOST_MAP, loadEnvConfig, type EnvConfig } from "@/lib/server/env/config";
import { persistenceProfileFromConfig } from "@/lib/server/profile/context";
import { executionDecision, requireEmergencyActionAllowed, requireSubmissionAllowed, SubmissionBlockedError } from "@/lib/server/gates/execution";
import { RUNTIME_KEYS, setRuntime, getRuntime, allRuntime } from "@/lib/server/runtime/flags";
import { freshEnv, makeCfg } from "./helpers";
import { resetHealthSignalsForTests, setHealthSignal } from "@/lib/server/health/state";

const AUTH = "0123456789abcdef:fedcba9876543210";
const KEYS = { MAWS_BINANCE_API_KEY: "k", MAWS_BINANCE_API_SECRET: "s" };

/** loadEnvConfig takes ProcessEnv; tests pass plain partial maps. */
const envSrc = (src: Record<string, string>) => src as unknown as NodeJS.ProcessEnv;

describe("environment configuration (fail closed)", () => {
  test("host map is fixed: local -> production public endpoints, testnet -> testnet hosts, shadow/production -> real fapi hosts", () => {
    expect(HOST_MAP.local.rest).toBe("https://fapi.binance.com");
    expect(HOST_MAP.local.uds).toBe("wss://fstream.binance.com");
    expect(HOST_MAP.testnet.rest).toBe("https://testnet.binancefuture.com");
    expect(HOST_MAP.testnet.uds).toBe("wss://fstream.binancefuture.com");
    expect(HOST_MAP.shadow.rest).toBe("https://fapi.binance.com");
    expect(HOST_MAP.production.rest).toBe("https://fapi.binance.com");
    expect(HOST_MAP.production.uds).toBe("wss://fstream.binance.com");
  });

  test("defaults to local with no config", () => {
    const cfg = loadEnvConfig(envSrc({}));
    expect(cfg.env).toBe("local");
    expect(cfg.recvWindowMs).toBe(5000);

    expect(cfg.risk.maxOrderNotionalUsd).toBe(50);
  });

  test("non-local envs require operator auth in salt:hash form", () => {
    expect(() => loadEnvConfig(envSrc({ MAWS_ENV: "testnet", ...KEYS }))).toThrow(/MAWS_OPERATOR_AUTH/);
    expect(() => loadEnvConfig(envSrc({ MAWS_ENV: "testnet", MAWS_OPERATOR_AUTH: "plaintext-password", ...KEYS }))).toThrow(/hex/);
    expect(loadEnvConfig(envSrc({ MAWS_ENV: "testnet", MAWS_OPERATOR_AUTH: AUTH, ...KEYS })).env).toBe("testnet");
  });

  test("Binance credentials are required for testnet/shadow/production", () => {
    for (const env of ["testnet", "shadow", "production"]) {
      expect(() => loadEnvConfig(envSrc({ MAWS_ENV: env, MAWS_OPERATOR_AUTH: AUTH }))).toThrow(/BINANCE_API/);
    }
  });

  test("local chart-only mode accepts separate profile credentials", () => {
    const cfg = loadEnvConfig(envSrc({
      MAWS_ENV: "local",
      MAWS_BINANCE_TESTNET_API_KEY: "testnet-key",
      MAWS_BINANCE_TESTNET_API_SECRET: "testnet-secret",
      MAWS_BINANCE_PRODUCTION_API_KEY: "production-key",
      MAWS_BINANCE_PRODUCTION_API_SECRET: "production-secret",
    }));
    expect(cfg.activeProfileId).toBeNull();
    expect(cfg.binanceApiKey).toBeNull();
    expect(cfg.profiles["binance-testnet"].configured).toBe(true);
    expect(cfg.profiles["binance-production"].configured).toBe(true);
  });

  test("invalid env values and numbers are rejected", () => {
    expect(() => loadEnvConfig(envSrc({ MAWS_ENV: "prod" }))).toThrow();
    expect(() =>
      loadEnvConfig(envSrc({ MAWS_ENV: "testnet", MAWS_OPERATOR_AUTH: AUTH, ...KEYS, MAWS_RECV_WINDOW_MS: "abc" })),
    ).toThrow(/numeric/);
  });

  test("backup key must be 64 hex chars", () => {
    expect(() => loadEnvConfig(envSrc({ MAWS_BACKUP_KEY: "short" }))).toThrow(/64 hex/);
    const cfg = loadEnvConfig(envSrc({ MAWS_BACKUP_KEY: "ab".repeat(32) }));
    expect(cfg.backupKey?.length).toBe(32);
  });


  test("production rejects zero risk caps (fail closed)", () => {
    const base = { MAWS_ENV: "production", MAWS_OPERATOR_AUTH: AUTH, ...KEYS };
    expect(() => loadEnvConfig(envSrc({ ...base, MAWS_RISK_MAX_ORDER_NOTIONAL: "0" }))).toThrow(/positive finite/);
  });

  test("production rejects negative risk caps", () => {
    const base = { MAWS_ENV: "production", MAWS_OPERATOR_AUTH: AUTH, ...KEYS };
    expect(() => loadEnvConfig(envSrc({ ...base, MAWS_RISK_MAX_GROSS_EXPOSURE: "-100" }))).toThrow(/positive finite/);
  });

  test("production rejects NaN risk caps", () => {
    const base = { MAWS_ENV: "production", MAWS_OPERATOR_AUTH: AUTH, ...KEYS };
    expect(() => loadEnvConfig(envSrc({ ...base, MAWS_RISK_MAX_OPEN_ORDERS: "abc" }))).toThrow(/numeric/);
  });

  test("production accepts valid positive risk caps", () => {
    const base = { MAWS_ENV: "production", MAWS_OPERATOR_AUTH: AUTH, ...KEYS };
    const cfg = loadEnvConfig(envSrc({
      ...base,
      MAWS_RISK_MAX_ORDER_NOTIONAL: "100",
      MAWS_RISK_MAX_GROSS_EXPOSURE: "100",
      MAWS_RISK_MAX_OPEN_ORDERS: "1",
      MAWS_RISK_MAX_OPEN_POSITIONS: "1",
    }));
    expect(cfg.risk.maxOrderNotionalUsd).toBe(100);
    expect(cfg.risk.maxGrossExposureUsd).toBe(100);
    expect(cfg.risk.maxOpenOrders).toBe(1);
    expect(cfg.risk.maxOpenPositions).toBe(1);
  });
});

describe("execution gate matrix", () => {
  beforeEach(() => {
    freshEnv(makeCfg());
  });

  const decide = (cfg: EnvConfig) => executionDecision(cfg);

  test("testnet can submit once the runtime flag is on", () => {
    setRuntime(RUNTIME_KEYS.executionEnabled, "true");
    const d = decide(makeCfg({ env: "testnet" }));
    expect(d.canSubmit).toBe(true);
    expect(d.reasons).toEqual([]);
  });

  test("runtime flag off blocks even testnet", () => {
    const d = decide(makeCfg({ env: "testnet" }));
    expect(d.canSubmit).toBe(false);
    expect(d.reasons).toContain("runtime execution flag is disabled");
  });

  test("configured testnet credentials are sufficient for the profile gate", () => {
    const cfg = freshEnv(makeCfg());
    setRuntime(RUNTIME_KEYS.executionEnabled, "true");
    const profiles = {
      ...cfg.profiles,
      "binance-testnet": { ...cfg.profiles["binance-testnet"], executionEnabled: false },
    };
    const d = decide({ ...cfg, profiles });
    expect(d.canSubmit).toBe(true);
    expect(d.profileExecutionEnabled).toBe(true);
  });

  test("missing production credentials block the profile", () => {
    const cfg = freshEnv(makeCfg({ env: "production", activeProfileId: "binance-production" }));
    const production = persistenceProfileFromConfig(cfg);
    setRuntime(RUNTIME_KEYS.executionEnabled, "true", Date.now(), production);
    const d = decide(cfg);
    expect(d.canSubmit).toBe(false);
    expect(d.profileExecutionEnabled).toBe(false);
    expect(d.reasons).toContain("Binance credentials are not configured for the active profile");
  });

  test("shadow can never submit, regardless of flags", () => {
    setRuntime(RUNTIME_KEYS.executionEnabled, "true");
    const d = decide(makeCfg({ env: "shadow" }));
    expect(d.canSubmit).toBe(false);
    expect(d.reasons).toContain("shadow mode is read-only");
    expect(() => requireSubmissionAllowed(makeCfg({ env: "shadow" }))).toThrow(SubmissionBlockedError);
  });

  test("local can never submit", () => {
    setRuntime(RUNTIME_KEYS.executionEnabled, "true");
    expect(decide(makeCfg({ env: "local" })).canSubmit).toBe(false);
  });


  test("kill switch blocks submissions", () => {
    setRuntime(RUNTIME_KEYS.executionEnabled, "true");
    setRuntime(RUNTIME_KEYS.killSwitch, "true");
    const d = decide(makeCfg({ env: "testnet" }));
    expect(d.canSubmit).toBe(false);
    expect(d.killSwitch).toBe(true);
    expect(d.reasons).toContain("kill switch engaged");
  });

  test("freeze blocks submissions until lifted", () => {
    setRuntime(RUNTIME_KEYS.executionEnabled, "true");
    setRuntime(RUNTIME_KEYS.frozen, "true");
    setRuntime(RUNTIME_KEYS.frozenReason, "reconciliation drift");
    const d = decide(makeCfg({ env: "testnet" }));
    expect(d.canSubmit).toBe(false);
    expect(d.frozenReason).toBe("reconciliation drift");
  });

  test("manager readiness is mandatory", () => {
    resetHealthSignalsForTests();
    setRuntime(RUNTIME_KEYS.executionEnabled, "true");
    const d = decide(makeCfg({ env: "testnet" }));
    expect(d.canSubmit).toBe(false);
    expect(d.reasons).toContain("manager not ready");
  });

  test("stream lease ownership is mandatory", () => {
    const now = Date.now();
    setHealthSignal({
      stream: { connected: true, leaseOwned: false, phase: "live", startedAt: now, lastEventAt: now, lastApplicationEventAt: now, reconnects: 0, listenKeyRenewedAt: now, bufferOverflow: false, circuitState: "closed" },
    });
    setRuntime(RUNTIME_KEYS.executionEnabled, "true");
    const d = decide(makeCfg({ env: "testnet" }));
    expect(d.canSubmit).toBe(false);
    expect(d.reasons).toContain("stream lease not owned");
  });

  test("degraded stream and stale snapshot block submissions", () => {
    const now = Date.now();
    setHealthSignal({
      stream: { connected: false, leaseOwned: true, phase: "reconnecting", startedAt: now, lastEventAt: now, lastApplicationEventAt: now, reconnects: 1, listenKeyRenewedAt: now, bufferOverflow: false, circuitState: "closed" },
      snapshot: { fetchedAt: now - 6 * 60_000 },
    });
    setRuntime(RUNTIME_KEYS.executionEnabled, "true");
    const d = decide(makeCfg({ env: "testnet" }));
    expect(d.canSubmit).toBe(false);
    expect(d.reasons).toContain("stream degraded");
    expect(d.reasons).toContain("snapshot too old");
  });

  test("emergency action remains available when normal gates block", () => {
    resetHealthSignalsForTests();
    expect(() => requireEmergencyActionAllowed(makeCfg({ env: "testnet" }))).not.toThrow();
  });
});

describe("runtime flags store", () => {
  beforeEach(() => {
    freshEnv(makeCfg());
  });

  test("set/get/all round-trip persists in the database", () => {
    expect(getRuntime(RUNTIME_KEYS.killSwitch, "fallback")).toBe("fallback");
    setRuntime(RUNTIME_KEYS.killSwitch, "true", 123);
    expect(getRuntime(RUNTIME_KEYS.killSwitch)).toBe("true");
    setRuntime(RUNTIME_KEYS.killSwitch, "false");
    expect(allRuntime()[RUNTIME_KEYS.killSwitch]).toBe("false");
  });
});
