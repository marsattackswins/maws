import { BinanceLiveManager, resetLiveManagerForTests } from "@/lib/server/binance/manager";
import { liveState } from "@/lib/server/binance/state";
import { accountMetricsDto, fillsDto } from "@/lib/server/binance/dto";
import { getDb } from "@/lib/server/db/connection";
import { sseBus } from "@/lib/server/binance/sse";
import { setRuntime, RUNTIME_KEYS } from "@/lib/server/runtime/flags";
import { FakeHttp, FakeWs, freshEnv, installFakes, jsonRes, makeCfg, accountFixture, BTCUSDT_INFO, orderEvent } from "./helpers";

/**
 * Closing-fill → bottom-panel Realized PnL regression.
 *
 * Pipeline under test: ORDER_TRADE_UPDATE (rp) → persisted fill + income
 * nudge carrying the fill's rp → /fapi/v1/income REST sync (with a lagging
 * exchange ledger, as observed on testnet) → accountMetricsDto → SSE "state"
 * → useLiveStore.accountMetrics.realizedPnl (the value TradingMetrics renders
 * as the bottom-panel Realized total).
 */

let manager: BinanceLiveManager;
let http: FakeHttp;
let ws: FakeWs;
/** Rows the exchange ledger will eventually report. */
let incomePage: Array<Record<string, unknown>> = [];
let incomeCalls = 0;
/** The ledger reports rows only from this call onward (write-lag simulation). */
let incomeVisibleAfter = Number.MAX_SAFE_INTEGER;

const flush = async () => {
  for (let i = 0; i < 6; i++) await new Promise((r) => setTimeout(r, 0));
};

async function startManager() {
  const cfg = freshEnv(makeCfg());
  http = new FakeHttp();
  installFakes(http);
  incomePage = [];
  incomeCalls = 0;
  incomeVisibleAfter = Number.MAX_SAFE_INTEGER;
  http.route("/fapi/v1/time", () => jsonRes({ serverTime: Date.now() }));
  http.route("/fapi/v1/exchangeInfo", () => jsonRes({ symbols: [BTCUSDT_INFO] }));
  http.route("/fapi/v1/ticker/price", () => jsonRes({ symbol: "BTCUSDT", price: "50000" }));
  http.route("/fapi/v2/account", () => jsonRes(accountFixture()));
  http.route("/fapi/v2/positionRisk", () => jsonRes([]));
  http.route("/fapi/v1/openOrders", () => jsonRes([]));
  http.route("/fapi/v1/listenKey", () => jsonRes({ listenKey: "LK-RP" }));
  http.route("/fapi/v1/leverageBracket", () => jsonRes([]));
  http.route("/fapi/v1/userTrades", () => jsonRes([]));
  http.route("/fapi/v1/income", () => {
    incomeCalls += 1;
    return jsonRes(incomeCalls >= incomeVisibleAfter ? incomePage : []);
  });
  setRuntime(RUNTIME_KEYS.executionEnabled, "true");
  manager = new BinanceLiveManager(cfg);
  resetLiveManagerForTests(manager);
  await manager.ensureStarted();
  ws = FakeWs.last();
  ws.emitOpen();
}

afterEach(() => {
  manager?.stop();
  resetLiveManagerForTests();
});

const ledgerRow = (tranId: number, rp: string) => ({
  tranId, type: "REALIZED_PNL", symbol: "BTCUSDT", income: rp, asset: "USDT", time: Date.now(),
});

/** Opens a 0.001 long, then closes `qty` of it with the given realized PnL. */
async function closeWithRealizedPnl(opts: { clientOrderId: string; tradeId: number; rp: string; qty?: string; open?: boolean }) {
  if (opts.open !== false) {
    ws.emitMessage(orderEvent({
      clientOrderId: `open-${opts.tradeId}`, orderId: 500 + opts.tradeId, tradeId: 100 + opts.tradeId,
      status: "FILLED", lastFilledQty: "0.001", cumQty: "0.001",
      lastFilledPrice: "50000", price: "50000", symbol: "BTCUSDT",
    }));
    await flush();
  }
  ws.emitMessage(orderEvent({
    clientOrderId: opts.clientOrderId, orderId: 600, tradeId: opts.tradeId,
    status: "FILLED", lastFilledQty: opts.qty ?? "0.001", cumQty: opts.qty ?? "0.001",
    lastFilledPrice: "49000", price: "49000", symbol: "BTCUSDT", realizedPnl: opts.rp,
    side: "SELL",
  }));
  await flush();
  await flush();
}

describe("closing fills reach the bottom-panel Realized PnL", () => {
  test("negative realized PnL reaches accountMetricsDto despite a lagging exchange ledger", async () => {
    await startManager();
    const events: Array<{ event: string; data: unknown }> = [];
    const unsub = sseBus.subscribe((event, data) => events.push({ event, data }));

    // Binance's income ledger lags two extra polls behind the fill stream.
    incomeVisibleAfter = incomeCalls + 2;
    incomePage = [ledgerRow(99001, "-12.5")];

    await closeWithRealizedPnl({ clientOrderId: "close-1", tradeId: 8001, rp: "-12.5" });

    // The fill itself is recorded with its negative rp.
    expect(liveState().fills.some((f) => f.tradeId === "8001" && f.realizedPnl === "-12.5")).toBe(true);
    // The rp-carrying nudge retried until the loss landed in the ledger…
    const rows = getDb().prepare(`SELECT amount FROM account_income WHERE income_type = 'REALIZED_PNL'`).all() as Array<{ amount: string }>;
    expect(rows.some((r) => Number(r.amount) === -12.5)).toBe(true);
    // …and the DTO the bottom panel consumes shows the loss (not $0.00).
    const metrics = accountMetricsDto();
    expect(metrics.realizedPnl).toBeCloseTo(-12.5, 8);
    expect(metrics.stale).toBeFalsy();

    // The server signals the browser (account-update ⇒ client refetches
    // /api/live/state, whose accountMetrics DTO was just asserted).
    const updateEvents = events.filter((e) => e.event === "account-update");
    expect(updateEvents.length).toBeGreaterThanOrEqual(1); // post-ledger republish
    unsub();
  });

  test("positive realized PnL reaches the panel total", async () => {
    await startManager();
    incomeVisibleAfter = incomeCalls + 2;
    incomePage = [ledgerRow(99002, "7.25")];
    await closeWithRealizedPnl({ clientOrderId: "close-2", tradeId: 8002, rp: "7.25" });
    const metrics = accountMetricsDto();
    expect(metrics.realizedPnl).toBeCloseTo(7.25, 8);
  });

  test("partial closes each record their own realized PnL and the total sums both legs", async () => {
    await startManager();
    incomeVisibleAfter = incomeCalls + 2;
    incomePage = [ledgerRow(99003, "-4")];
    // First partial close (half the position) at a loss.
    await closeWithRealizedPnl({ clientOrderId: "close-p1", tradeId: 8003, rp: "-4", qty: "0.0005" });
    expect(accountMetricsDto().realizedPnl).toBeCloseTo(-4, 8);
    expect(fillsDto(10).filter((f) => f.realizedPnl === -4)).toHaveLength(1);

    // Second partial close at a gain; the ledger gains its row too.
    incomePage = [...incomePage, ledgerRow(99004, "9.5")];
    incomeVisibleAfter = incomeCalls + 2;
    await closeWithRealizedPnl({ clientOrderId: "close-p2", tradeId: 8004, rp: "9.5", qty: "0.0005", open: false });
    const metrics = accountMetricsDto();
    expect(metrics.realizedPnl).toBeCloseTo(5.5, 8); // -4 + 9.5
    expect(fillsDto(10).filter((f) => f.realizedPnl === 9.5)).toHaveLength(1);

    // Dedup: replaying the first partial close's trade id changes nothing.
    ws.emitMessage(orderEvent({
      clientOrderId: "close-p1", orderId: 600, tradeId: 8003,
      status: "FILLED", lastFilledQty: "0.0005", cumQty: "0.001",
      lastFilledPrice: "49000", price: "49000", symbol: "BTCUSDT", realizedPnl: "-4", side: "SELL",
    }));
    await flush();
    expect(accountMetricsDto().realizedPnl).toBeCloseTo(5.5, 8);
    expect(liveState().fills.filter((f) => f.tradeId === "8003")).toHaveLength(1);
  });
});
