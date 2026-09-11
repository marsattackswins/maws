import type { EnvConfig } from "@/lib/server/env/config";
import {
  activePersistenceProfile,
  assertPersistenceProfile,
  persistenceProfileFromConfig,
} from "@/lib/server/profile/context";
import { resetServerConfigForTests } from "@/lib/server/env/config";
import { makeCfg } from "./helpers";

describe("persistence profile context", () => {
  afterEach(() => {
    resetServerConfigForTests();
  });

  test.each([
    ["local", "paper"],
    ["testnet", "binance-testnet"],
    ["production", "binance-production"],
    ["shadow", "shadow"],
  ] as const)("maps %s to %s", (env, id) => {
    expect(persistenceProfileFromConfig(makeCfg({ env }))).toEqual({ id, environment: env });
  });

  test("unknown environment fails closed", () => {
    const invalid = { env: "unknown" } as unknown as Pick<EnvConfig, "env">;
    expect(() => persistenceProfileFromConfig(invalid)).toThrow("MAWS_PERSISTENCE_PROFILE_INVALID");
  });

  test("rejects a mismatched profile and environment", () => {
    expect(() =>
      assertPersistenceProfile({ id: "binance-production", environment: "testnet" }),
    ).toThrow("MAWS_PERSISTENCE_PROFILE_INVALID");
  });

  test("active profile comes from server configuration only", () => {
    resetServerConfigForTests(makeCfg({ env: "production" }));
    expect(activePersistenceProfile()).toEqual({ id: "binance-production", environment: "production" });
  });

  test("profile context contains no credentials or endpoint secrets", () => {
    const profile = persistenceProfileFromConfig(makeCfg({ env: "testnet" }));
    const serialized = JSON.stringify(profile);
    expect(serialized).not.toContain("test-api-key");
    expect(serialized).not.toContain("test-api-secret");
    expect(serialized).not.toContain("https://");
    expect(serialized).not.toContain("wss://");
    expect(Object.keys(profile)).toEqual(["id", "environment"]);
  });

  test("paper remains a server profile label without Binance persistence data", () => {
    const profile = persistenceProfileFromConfig(makeCfg({ env: "local" }));
    expect(profile).toEqual({ id: "paper", environment: "local" });
    expect(JSON.stringify(profile)).not.toContain("binance");
  });
});
