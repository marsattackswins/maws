import { BinanceLiveManager, resetLiveManagerForTests } from "@/lib/server/binance/manager";
import { liveState, resetLiveStateForTests } from "@/lib/server/binance/state";
import { getRuntime, RUNTIME_KEYS, setRuntime } from "@/lib/server/runtime/flags";
import { sseBus } from "@/lib/server/binance/sse";
import { FakeHttp, freshEnv, installFakes, jsonRes, makeCfg, accountFixture, BTCUSDT_INFO } from "./helpers";

/**
 * Diagnostic: after startup with an open position, do the reconciliation
 * interval and the mark-price poller keep firing? Guards against timers that
 * arm but never run their first tick (PnL freezes, recon goes silent).
 */

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

let manager: BinanceLiveManager;
let http: FakeHttp;
let events: Array<{ event: string; data: unknown }>;
let unsub: (() => void) | null = null;

async function startWithPosition() {
  const cfg = freshEnv(makeCfg({ reconIntervalMs: 2_000, markPriceIntervalMs: 1_500 }));
  http = new FakeHttp();
  installFakes(http);

  http.route("/fapi/v1/time", () => jsonRes({ serverTime: Date.now() }));
  http.route("/fapi/v1/exchangeInfo", () => jsonRes({ symbols: [BTCUSDT_INFO] }));
  http.route("/fapi/v1/ticker/price", () => jsonRes({ symbol: "BTCUSDT", price: "50000" }));
  http.route("/fapi/v2/account", () => jsonRes(accountFixture()));
  http.route("/fapi/v2/positionRisk", () =>
    jsonRes([
      { symbol: "BTCUSDT", positionAmt: "0.012", entryPrice: "50000", markPrice: "50000", unRealizedProfit: "0", liquidationPrice: "40000", leverage: "20", positionSide: "BOTH", notional: "600" },
    ]),
  );
  http.route("/fapi/v1/openOrders", () => jsonRes([]));
  http.route("/fapi/v1/listenKey", () => jsonRes({ listenKey: "LK-TIMER" }));
  http.route("/fapi/v1/leverageBracket", () => jsonRes([]));
  http.route("/fapi/v1/userTrades", () => jsonRes([]));
  http.route("/fapi/v1/premiumIndex", () => jsonRes({ symbol: "BTCUSDT", markPrice: "50100", time: Date.now() }));

  setRuntime(RUNTIME_KEYS.executionEnabled, "true");
  manager = new BinanceLiveManager(cfg);
  resetLiveManagerForTests(manager);
  events = [];
  unsub = sseBus.subscribe((event, data) => events.push({ event, data }));
  await manager.ensureStarted();
}

afterEach(() => {
  unsub?.();
  unsub = null;
  manager?.stop();
  resetLiveManagerForTests();
  resetLiveStateForTests();
});

describe("timer liveness after startup", () => {
  test("recon interval and mark-price poller keep firing while a position is open", async () => {
    await startWithPosition();

    // Startup snapshot seeds the position.
    expect(liveState().positions.get("BTCUSDT")?.qty).toBe("0.012");

    const reconBefore = http.callsTo("/fapi/v2/positionRisk").length;
    events.length = 0;
    await sleep(7_500);

    // Reconciliation interval: positionRisk is refetched on each run.
    const reconRuns = http.callsTo("/fapi/v2/positionRisk").length - reconBefore;
    // Mark-price poller: premiumIndex is fetched per position per tick.
    const markFetches = http.callsTo("/fapi/v1/premiumIndex").length;

    // eslint-disable-next-line no-console
    console.log(`timer-liveness: reconRuns=${reconRuns} markFetches=${markFetches} sse=${events.map((e) => e.event).join(",")}`);

    expect(reconRuns).toBeGreaterThanOrEqual(2); // ~3 ticks in 7.5s at 2s cadence
    expect(markFetches).toBeGreaterThanOrEqual(3); // ~5 ticks in 7.5s at 1.5s cadence
    expect(events.some((e) => e.event === "account-update")).toBe(true);

    // PnL actually moved from the seeded snapshot value.
    expect(liveState().positions.get("BTCUSDT")?.unrealizedProfit).not.toBe("0");
  }, 20_000);

  test("overlapping ensureStarted calls (connect racing switch) keep timers alive", async () => {
    // Reproduces the coordinator's connect→profile-switch overlap: the
    // second ensureStarted lands while the first start is still in flight.
    // The old implementation returned the first generation's promise, whose
    // timers were bound to a superseded generation and silently no-oped.
    const cfg = freshEnv(makeCfg({ reconIntervalMs: 2_000, markPriceIntervalMs: 1_500 }));
    http = new FakeHttp();
    installFakes(http);

    http.route("/fapi/v1/time", () => jsonRes({ serverTime: Date.now() }));
    http.route("/fapi/v1/exchangeInfo", () => jsonRes({ symbols: [BTCUSDT_INFO] }));
    http.route("/fapi/v1/ticker/price", () => jsonRes({ symbol: "BTCUSDT", price: "50000" }));
    http.route("/fapi/v2/account", () => jsonRes(accountFixture()));
    http.route("/fapi/v2/positionRisk", () =>
      jsonRes([
        { symbol: "BTCUSDT", positionAmt: "0.012", entryPrice: "50000", markPrice: "50000", unRealizedProfit: "0", liquidationPrice: "40000", leverage: "20", positionSide: "BOTH", notional: "600" },
      ]),
    );
    http.route("/fapi/v1/openOrders", () => jsonRes([]));
    http.route("/fapi/v1/listenKey", () => jsonRes({ listenKey: "LK-RACE" }));
    http.route("/fapi/v1/leverageBracket", () => jsonRes([]));
    http.route("/fapi/v1/userTrades", () => jsonRes([]));
    http.route("/fapi/v1/premiumIndex", () => jsonRes({ symbol: "BTCUSDT", markPrice: "50100", time: Date.now() }));

    setRuntime(RUNTIME_KEYS.executionEnabled, "true");
    manager = new BinanceLiveManager(cfg);
    resetLiveManagerForTests(manager);

    // Fire two overlapping starts without awaiting the first.
    const first = manager.ensureStarted();
    const second = manager.ensureStarted();
    await Promise.all([first, second]);
    expect(manager.status).toBe("ready");

    const reconBefore = http.callsTo("/fapi/v2/positionRisk").length;
    await sleep(6_000);

    const reconRuns = http.callsTo("/fapi/v2/positionRisk").length - reconBefore;
    const markFetches = http.callsTo("/fapi/v1/premiumIndex").length;

    // eslint-disable-next-line no-console
    console.log(`race-liveness: reconRuns=${reconRuns} markFetches=${markFetches}`);

    expect(reconRuns).toBeGreaterThanOrEqual(1); // interval alive after the race
    expect(markFetches).toBeGreaterThanOrEqual(2); // poller alive after the race
    expect(liveState().positions.get("BTCUSDT")?.unrealizedProfit).not.toBe("0");
  }, 20_000);
});
