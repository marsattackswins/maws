import { afterEach, describe, expect, jest, test } from "@jest/globals";

import { BinanceLiveManager, liveManager, resetLiveManagerForTests } from "@/lib/server/binance/manager";
import { BinanceAdapter } from "@/lib/server/broker/binance/adapter";
import type { IBroker } from "@/lib/server/broker/interface";
import { getBroker, resetBrokerForTests } from "@/lib/server/broker/factory";
import { healthSignals } from "@/lib/server/health/state";
import { getDb } from "@/lib/server/db/connection";
import { installBrokerClients, type HttpRequestOptions } from "@/lib/server/binance/transport";
import { FakeHttp, FakeWs, freshEnv, installFakes, jsonRes, makeCfg } from "./helpers";

function managerFromBroker(broker: IBroker): BinanceLiveManager {
  const value = Reflect.get(broker, "manager");
  if (!(value instanceof BinanceLiveManager)) throw new Error("broker manager is not a BinanceLiveManager");
  return value;
}

function configureTestnet(): { manager: BinanceLiveManager; http: FakeHttp } {
  const cfg = freshEnv(makeCfg({ env: "testnet" }));
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
  http.route("/fapi/v1/listenKey", () => jsonRes({ listenKey: "LIFECYCLE-LK" }));
  http.route("/fapi/v1/leverageBracket", () => jsonRes([]));
  http.route("/fapi/v1/userTrades", () => jsonRes([]));
  http.route("/fapi/v1/income", () => jsonRes([]));
  return { manager: liveManager(cfg), http };
}

afterEach(() => {
  resetBrokerForTests();
  resetLiveManagerForTests();
});

describe("authoritative Binance manager ownership", () => {
  test("adapter, factory, and liveManager resolve one manager", () => {
    const cfg = freshEnv(makeCfg({ env: "testnet" }));
    const authoritative = liveManager(cfg);
    const directAdapter = new BinanceAdapter(cfg);
    const factoryBroker = getBroker();

    expect(managerFromBroker(directAdapter)).toBe(authoritative);
    expect(managerFromBroker(factoryBroker)).toBe(authoritative);
    expect(liveManager()).toBe(authoritative);
  });

  test("concurrent startup shares one promise and repeated ready startup does not duplicate the stream", async () => {
    jest.useFakeTimers();
    try {
      const { manager } = configureTestnet();
      const first = manager.ensureStarted();
      const second = manager.ensureStarted();

      expect(second).toBe(first);
      await first;
      expect(manager.status).toBe("ready");
      expect(FakeWs.instances).toHaveLength(1);

      const timerCount = jest.getTimerCount();
      await manager.ensureStarted();
      expect(FakeWs.instances).toHaveLength(1);
      expect(jest.getTimerCount()).toBe(timerCount);
    } finally {
      jest.useRealTimers();
    }
  });

  test("stop during startup invalidates the generation and leaves an idle manager", async () => {
    const cfg = freshEnv(makeCfg({ env: "testnet" }));
    const baseHttp = new FakeHttp();
    baseHttp.route("/fapi/v1/time", () => jsonRes({ serverTime: Date.now() }));
    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    let blocked = true;
    const gatedHttp = {
      request: async (options: HttpRequestOptions) => {
        if (blocked && options.url.includes("/fapi/v1/time")) {
          blocked = false;
          await gate;
        }
        return baseHttp.request(options);
      },
    };
    installBrokerClients({ http: gatedHttp, ws: { connect: (url: string) => new FakeWs(url) } });

    const manager = liveManager(cfg);
    const startup = manager.ensureStarted();
    await Promise.resolve();
    expect(manager.status).toBe("starting");

    manager.stop();
    release();
    await startup;

    expect(manager.status).toBe("idle");
    expect(manager.error).toBeNull();
    expect(healthSignals().managerRunning).toBe(false);
    expect(healthSignals().brokerStatus).toBe("idle");
    expect(healthSignals().stream?.connected).toBe(false);
    expect(getDb().prepare("SELECT * FROM stream_owner_lease").all()).toHaveLength(0);
  });

  test("stop permits an immediate restart while stale startup unwinds", async () => {
    const { manager, http } = configureTestnet();
    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    let blocked = true;
    manager.rest.setTransportForTests({
      request: async (options: HttpRequestOptions) => {
        if (blocked && options.url.includes("/fapi/v1/time")) {
          blocked = false;
          await gate;
        }
        return http.request(options);
      },
    });

    const first = manager.ensureStarted();
    await Promise.resolve();
    manager.stop();
    const second = manager.ensureStarted();
    release();

    await first;
    await second;
    expect(manager.status).toBe("ready");
    expect(FakeWs.instances).toHaveLength(1);
  });

  test("partial startup failure cleans the lease and a later startup can succeed", async () => {
    const { manager, http } = configureTestnet();
    http.script("/fapi/v1/listenKey", () => jsonRes({ code: -1001, msg: "listen key unavailable" }, 503));

    await expect(manager.ensureStarted()).rejects.toThrow();
    expect(manager.status).toBe("error");
    expect(FakeWs.instances).toHaveLength(0);
    expect(getDb().prepare("SELECT * FROM stream_owner_lease").all()).toHaveLength(0);

    await manager.ensureStarted();
    expect(manager.status).toBe("ready");
    expect(FakeWs.instances).toHaveLength(1);
  });

  test("old stream callbacks cannot publish after stop and restart", async () => {
    const { manager } = configureTestnet();
    await manager.ensureStarted();
    const oldSocket = FakeWs.last();
    manager.stop();

    await manager.ensureStarted();
    const events: string[] = [];
    const unsubscribe = (await import("@/lib/server/binance/sse")).sseBus.subscribe((event) => events.push(event));
    oldSocket.emitMessage({ e: "ACCOUNT_UPDATE", E: Date.now(), T: Date.now(), a: { B: [], P: [] } });
    await new Promise((resolve) => setTimeout(resolve, 0));
    unsubscribe();

    expect(events).not.toContain("account-update");
    expect(manager.status).toBe("ready");
  });
});
