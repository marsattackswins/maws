import {
  loadEnvConfig,
  safeProfileMetadata,
  type ProfileId,
} from "@/lib/server/env/config";

const AUTH = "0123456789abcdef:fedcba9876543210";

function env(values: Record<string, string> = {}): NodeJS.ProcessEnv {
  return values as NodeJS.ProcessEnv;
}

describe("server profile configuration", () => {
  test("parses separate testnet and production credentials", () => {
    const cfg = loadEnvConfig(env({
      MAWS_ENV: "testnet",
      MAWS_OPERATOR_AUTH: AUTH,
      MAWS_BINANCE_TESTNET_API_KEY: "testnet-key",
      MAWS_BINANCE_TESTNET_API_SECRET: "testnet-secret",
      MAWS_BINANCE_PRODUCTION_API_KEY: "production-key",
      MAWS_BINANCE_PRODUCTION_API_SECRET: "production-secret",
    }));

    expect(cfg.activeProfileId).toBe("binance-testnet");
    expect(cfg.binanceApiKey).toBe("testnet-key");
    expect(cfg.binanceApiSecret).toBe("testnet-secret");
    expect(cfg.profiles["binance-testnet"]).toMatchObject({
      configured: true,
      apiKey: "testnet-key",
      apiSecret: "testnet-secret",
    });
    expect(cfg.profiles["binance-production"]).toMatchObject({
      configured: true,
      apiKey: "production-key",
      apiSecret: "production-secret",
    });
  });

  test("missing testnet credentials do not populate production", () => {
    const cfg = loadEnvConfig(env({
      MAWS_BINANCE_PRODUCTION_API_KEY: "production-key",
      MAWS_BINANCE_PRODUCTION_API_SECRET: "production-secret",
    }));

    expect(cfg.profiles["binance-testnet"].configured).toBe(false);
    expect(cfg.profiles["binance-testnet"].apiKey).toBeNull();
    expect(cfg.profiles["binance-testnet"].apiSecret).toBeNull();
    expect(cfg.profiles["binance-production"].configured).toBe(true);
  });

  test("missing production credentials do not populate testnet", () => {
    const cfg = loadEnvConfig(env({
      MAWS_BINANCE_TESTNET_API_KEY: "testnet-key",
      MAWS_BINANCE_TESTNET_API_SECRET: "testnet-secret",
    }));

    expect(cfg.profiles["binance-production"].configured).toBe(false);
    expect(cfg.profiles["binance-production"].apiKey).toBeNull();
    expect(cfg.profiles["binance-production"].apiSecret).toBeNull();
    expect(cfg.profiles["binance-testnet"].configured).toBe(true);
  });

  test("maps legacy MAWS_ENV values to safe profile identity", () => {
    const local = loadEnvConfig(env({}));
    expect(local.activeProfileId).toBeNull();
    expect(local.profiles.paper.environment).toBe("paper");

    const testnet = loadEnvConfig(env({
      MAWS_ENV: "testnet",
      MAWS_OPERATOR_AUTH: AUTH,
      MAWS_BINANCE_API_KEY: "legacy-testnet-key",
      MAWS_BINANCE_API_SECRET: "legacy-testnet-secret",
    }));
    expect(testnet.activeProfileId).toBe("binance-testnet");
    expect(testnet.profiles["binance-testnet"].configured).toBe(true);

    const production = loadEnvConfig(env({
      MAWS_ENV: "production",
      MAWS_OPERATOR_AUTH: AUTH,
      MAWS_BINANCE_API_KEY: "legacy-production-key",
      MAWS_BINANCE_API_SECRET: "legacy-production-secret",
    }));
    expect(production.activeProfileId).toBe("binance-production");

    const shadow = loadEnvConfig(env({
      MAWS_ENV: "shadow",
      MAWS_OPERATOR_AUTH: AUTH,
      MAWS_BINANCE_API_KEY: "legacy-shadow-key",
      MAWS_BINANCE_API_SECRET: "legacy-shadow-secret",
    }));
    expect(shadow.activeProfileId).toBeNull();
    expect(shadow.profiles["binance-production"].configured).toBe(true);
  });

  test("keeps legacy single-key variables compatible for the active environment", () => {
    const cfg = loadEnvConfig(env({
      MAWS_ENV: "testnet",
      MAWS_OPERATOR_AUTH: AUTH,
      MAWS_BINANCE_API_KEY: "legacy-key",
      MAWS_BINANCE_API_SECRET: "legacy-secret",
    }));

    expect(cfg.binanceApiKey).toBe("legacy-key");
    expect(cfg.binanceApiSecret).toBe("legacy-secret");
    expect(cfg.profiles["binance-testnet"].apiKey).toBe("legacy-key");
    expect(cfg.profiles["binance-testnet"].apiSecret).toBe("legacy-secret");
  });

  test("fails closed on conflicting active legacy and profile credentials", () => {
    expect(() =>
      loadEnvConfig(env({
        MAWS_ENV: "testnet",
        MAWS_OPERATOR_AUTH: AUTH,
        MAWS_BINANCE_API_KEY: "legacy-key",
        MAWS_BINANCE_API_SECRET: "legacy-secret",
        MAWS_BINANCE_TESTNET_API_KEY: "different-key",
        MAWS_BINANCE_TESTNET_API_SECRET: "different-secret",
      })),
    ).toThrow("MAWS_PROFILE_CONFIGURATION_INVALID");
  });

  test("keeps local chart-only startup while exposing configured profiles", () => {
    const local = loadEnvConfig(env({
      MAWS_BINANCE_TESTNET_API_KEY: "testnet-key",
      MAWS_BINANCE_TESTNET_API_SECRET: "testnet-secret",
    }));
    expect(local.env).toBe("local");
    expect(local.activeProfileId).toBeNull();
    expect(local.binanceApiKey).toBeNull();
    expect(local.binanceApiSecret).toBeNull();
    expect(local.profiles["binance-testnet"].configured).toBe(true);

    const shadow = loadEnvConfig(env({
      MAWS_ENV: "shadow",
      MAWS_OPERATOR_AUTH: AUTH,
      MAWS_BINANCE_PRODUCTION_API_KEY: "production-key",
      MAWS_BINANCE_PRODUCTION_API_SECRET: "production-secret",
    }));
    expect(shadow.env).toBe("shadow");
    expect(shadow.activeProfileId).toBeNull();
    expect(shadow.binanceApiKey).toBe("production-key");
    expect(shadow.binanceApiSecret).toBe("production-secret");
  });

  test("configured production credentials enable the profile automatically", () => {
    const disabled = loadEnvConfig(env({
      MAWS_ENV: "production",
      MAWS_OPERATOR_AUTH: AUTH,
      MAWS_BINANCE_PRODUCTION_API_KEY: "production-key",
      MAWS_BINANCE_PRODUCTION_API_SECRET: "production-secret",
    }));
    expect(disabled.profiles["binance-production"].executionEnabled).toBe(true);

    const enabled = loadEnvConfig(env({
      MAWS_ENV: "production",
      MAWS_OPERATOR_AUTH: AUTH,
      MAWS_BINANCE_PRODUCTION_API_KEY: "production-key",
      MAWS_BINANCE_PRODUCTION_API_SECRET: "production-secret",
    }));
    expect(enabled.profiles["binance-production"].executionEnabled).toBe(true);

  });

  test("safe metadata is allowlisted and never contains credentials or endpoints", () => {
    const sentinelKey = "SENTINEL_PROFILE_API_KEY";
    const sentinelSecret = "SENTINEL_PROFILE_API_SECRET";
    const cfg = loadEnvConfig(env({
      MAWS_BINANCE_TESTNET_API_KEY: sentinelKey,
      MAWS_BINANCE_TESTNET_API_SECRET: sentinelSecret,
      MAWS_BINANCE_PRODUCTION_API_KEY: "production-key",
      MAWS_BINANCE_PRODUCTION_API_SECRET: "production-secret",
    }));

    const metadata = safeProfileMetadata(cfg.profiles);
    const serialized = JSON.stringify(metadata);
    const profileIds: ProfileId[] = ["paper", "binance-testnet", "binance-production"];

    expect(serialized).not.toContain(sentinelKey);
    expect(serialized).not.toContain(sentinelSecret);
    expect(serialized).not.toContain("https://");
    expect(metadata.map((profile) => profile.profileId)).toEqual(profileIds);
    expect(Object.keys(metadata[0])).toEqual([
      "profileId",
      "label",
      "environment",
      "configured",
      "requiresProductionConfirmation",
      "executionEnabled",
    ]);
  });

  test("default profile is paper unless explicitly configured and does not switch startup mode", () => {
    const cfg = loadEnvConfig(env({
      MAWS_ENV: "testnet",
      MAWS_DEFAULT_PROFILE: "binance-production",
      MAWS_OPERATOR_AUTH: AUTH,
      MAWS_BINANCE_TESTNET_API_KEY: "testnet-key",
      MAWS_BINANCE_TESTNET_API_SECRET: "testnet-secret",
    }));

    expect(loadEnvConfig(env({})).defaultProfile).toBe("paper");
    expect(cfg.defaultProfile).toBe("binance-production");
    expect(cfg.env).toBe("testnet");
    expect(cfg.activeProfileId).toBe("binance-testnet");
  });
});
