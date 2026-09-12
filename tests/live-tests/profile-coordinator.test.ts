import { afterEach, describe, expect, jest, test } from "@jest/globals";

import {
  profileCoordinator,
  profileRuntimeStatus,
  resetProfileCoordinatorForTests,
  type ProfileRuntimeStatus,
} from "@/lib/server/profile/coordinator";
import { resetBrokerForTests } from "@/lib/server/broker/factory";
import { resetLiveManagerForTests, liveManager } from "@/lib/server/binance/manager";
import { FakeHttp, FakeWs, freshEnv, installFakes, jsonRes, makeCfg } from "./helpers";
import type { EnvConfig, ProfileRegistry } from "@/lib/server/env/config";


function profileRegistry(): ProfileRegistry {
  const cfg = makeCfg();
  return {
    ...cfg.profiles,
    "binance-production": {
      ...cfg.profiles["binance-production"],
      configured: true,
      apiKey: "production-key",
      apiSecret: "production-secret",
    },
  };
}

function configure(cfg: EnvConfig): FakeHttp {
  freshEnv(cfg);
  const http = new FakeHttp();
  installFakes(http);
  http.route("/fapi/v1/time", () => jsonRes({ serverTime: Date.now() }));
  http.route("/fapi/v1/exchangeInfo", () => jsonRes({ symbols: [
    {
      symbol: "BTCUSDT",
      status: "TRADING",
      contractType: "PERPETUAL",
      baseAsset: "BTC",
      quoteAsset: "USDT",
      pricePrecision: 2,
      quantityPrecision: 3,
      filters: [
        { filterType: "PRICE_FILTER", minPrice: "0.01", maxPrice: "1000000", tickSize: "0.01" },
        { filterType: "LOT_SIZE", minQty: "0.001", maxQty: "1000", stepSize: "0.001" },
        { filterType: "MIN_NOTIONAL", notional: "5" },
      ],
    },
  ] }));
  http.route("/fapi/v1/ticker/price", () => jsonRes({ symbol: "BTCUSDT", price: "50000" }));
  http.route("/fapi/v2/account", () => jsonRes({
    totalWalletBalance: "1000",
    totalUnrealizedProfit: "0",
    totalMarginBalance: "1000",
    availableBalance: "1000",
    maxWithdrawAmount: "1000",
    assets: [],
  }));
  http.route("/fapi/v2/positionRisk", () => jsonRes([]));
  http.route("/fapi/v1/openOrders", () => jsonRes([]));
  http.route("/fapi/v1/listenKey", () => jsonRes({ listenKey: "PROFILE-LK" }));
  http.route("/fapi/v1/leverageBracket", () => jsonRes([]));
  http.route("/fapi/v1/userTrades", () => jsonRes([]));
  return http;
}

async function nextTurn(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

async function emitLatestStreamOpen(minInstances = 1): Promise<void> {
  for (let i = 0; i < 200 && FakeWs.instances.length < minInstances; i += 1) await nextTurn();
  if (FakeWs.instances.length >= minInstances) FakeWs.last().emitOpen();
  await nextTurn();
}

async function startCoordinator(): Promise<ProfileRuntimeStatus> {
  const startup = profileCoordinator().ensureStarted();
  await emitLatestStreamOpen();
  await startup;
  return profileRuntimeStatus();
}

afterEach(() => {
  jest.useRealTimers();
  resetProfileCoordinatorForTests();
  resetBrokerForTests();
  resetLiveManagerForTests();
});

describe("profile coordinator", () => {
  test("starts local Chart Only without a manager and switches to Testnet then Paper", async () => {
    const cfg = makeCfg({
      env: "local",
      activeProfileId: null,
      binanceApiKey: null,
      binanceApiSecret: null,
      profiles: profileRegistry(),
    });
    const http = configure(cfg);

    await profileCoordinator().ensureStarted();
    expect(profileRuntimeStatus()).toMatchObject({
      profileId: null,
      environment: null,
      phase: "idle",
      ready: false,
    });
    expect(http.calls).toHaveLength(0);

    const testnetSwitch = profileCoordinator().switchProfile({
      profileId: "binance-testnet",
      requestId: "local-testnet-switch",
    });
    await emitLatestStreamOpen();
    await expect(testnetSwitch).resolves.toMatchObject({
      profileId: "binance-testnet",
      environment: "testnet",
      ready: true,
    });

    await expect(profileCoordinator().switchProfile({
      profileId: "paper",
      requestId: "local-paper-switch",
    })).resolves.toMatchObject({
      profileId: null,
      environment: null,
      phase: "idle",
      ready: false,
    });
    expect(profileRuntimeStatus().managerStatus).toBe("idle");
  });

  test("owns one manager and selects trusted target credentials and endpoints", async () => {
    const cfg = makeCfg({ profiles: profileRegistry() });
    const http = configure(cfg);
    const initial = await startCoordinator();
    expect(initial.profileId).toBe("binance-testnet");
    const oldManager = liveManager();
    const beforeGeneration = initial.generation;

    const switching = profileCoordinator().switchProfile({
      profileId: "binance-production",
      confirmProduction: true,
      requestId: "operator-switch-1",
    });
    expect(profileRuntimeStatus().phase).toBe("switching");
    expect(profileRuntimeStatus().generation).toBe(beforeGeneration + 1);
    await emitLatestStreamOpen(2);
    const status = await switching;

    expect(status.profileId).toBe("binance-production");
    expect(status.ready).toBe(true);
    expect(liveManager()).not.toBe(oldManager);
    expect(liveManager().cfg.binanceApiKey).toBe("production-key");
    expect(liveManager().cfg.binanceApiSecret).toBe("production-secret");
    expect(http.calls.some((call) => call.url.startsWith("https://fapi.binance.com"))).toBe(true);
    expect(FakeWs.last().url.startsWith("wss://fstream.binance.com")).toBe(true);
  });

  test("rejects a concurrent switch and blocks exposure without cancellation or flattening", async () => {
    const cfg = makeCfg({ profiles: profileRegistry() });
    let positionPresent = false;
    const http = configure(cfg);
    http.route("/fapi/v2/positionRisk", () => positionPresent
      ? jsonRes([{ symbol: "BTCUSDT", positionAmt: "0.01", entryPrice: "50000", markPrice: "50000", unRealizedProfit: "0", leverage: "1", liquidationPrice: "0", notional: "500" }])
      : jsonRes([]));
    await startCoordinator();
    positionPresent = true;
    const beforeCalls = http.calls.length;
    const first = profileCoordinator().switchProfile({ profileId: "paper", requestId: "operator-switch-2" });
    await expect(profileCoordinator().switchProfile({ profileId: "binance-production", confirmProduction: true })).rejects.toMatchObject({ code: "profile_switch_in_progress" });
    await expect(first).rejects.toMatchObject({ code: "exposure_present" });
    expect(profileRuntimeStatus().profileId).toBe("binance-testnet");
    expect(profileRuntimeStatus().phase).toBe("ready");
    const switchCalls = http.calls.slice(beforeCalls);
    expect(switchCalls.some((call) => call.url.includes("/fapi/v1/allOpenOrders"))).toBe(false);
    expect(switchCalls.some((call) => call.url.includes("/fapi/v1/order"))).toBe(false);
  });

  test("reports target startup failure, cleans target, and rolls back safely", async () => {
    const cfg = makeCfg({ profiles: profileRegistry() });
    const http = configure(cfg);
    await startCoordinator();
    http.script("/fapi/v1/exchangeInfo", () => jsonRes({ code: -1000, msg: "metadata unavailable" }, 503));

    const switching = profileCoordinator().switchProfile({
      profileId: "binance-production",
      confirmProduction: true,
      requestId: "operator-switch-3",
    });
    const failure = expect(switching).rejects.toMatchObject({ code: "target_start_failed" });
    await emitLatestStreamOpen(2);
    await failure;
    expect(profileRuntimeStatus().profileId).toBe("binance-testnet");
    expect(profileRuntimeStatus().phase).toBe("ready");
    expect(profileRuntimeStatus().ready).toBe(true);
  });
});
