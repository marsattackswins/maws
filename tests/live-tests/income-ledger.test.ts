import {
  incomeTotals,
  incomeWatermark,
  normalizeIncomeRow,
  parseIncomeAmount,
  persistIncomeRow,
  syncIncomeHistory,
} from "@/lib/server/binance/income";
import { accountDto, accountMetricsDto } from "@/lib/server/binance/dto";
import { BinanceRestClient } from "@/lib/server/binance/rest";
import { RateLimiter } from "@/lib/server/binance/ratelimit";
import { applyAccountEvent, applyAccountSnapshot, resetLiveStateForTests } from "@/lib/server/binance/state";
import { getDb } from "@/lib/server/db/connection";
import { FakeHttp, freshEnv, installFakes, jsonRes, makeCfg } from "./helpers";
import type { EnvConfig } from "@/lib/server/env/config";

function makeRest(overrides: Record<string, () => unknown> = {}) {
  const cfg: EnvConfig = freshEnv(makeCfg());
  const http = new FakeHttp();
  installFakes(http);
  http.route("/fapi/v1/income", () => jsonRes([]));
  for (const [part, respond] of Object.entries(overrides)) http.route(part, () => jsonRes(respond()));
  const rest = new BinanceRestClient(cfg, new RateLimiter(cfg.rateInternalPerMin), async () => undefined);
  rest.setTransportForTests(http);
  return { cfg, http, rest };
}

function incomeRow(over: Partial<{ tranId: number; type: string; symbol: string | null; income: string; asset: string; time: number }>) {
  return {
    tranId: over.tranId ?? 1,
    type: over.type ?? "REALIZED_PNL",
    symbol: over.symbol ?? "BTCUSDT",
    income: over.income ?? "10",
    asset: over.asset ?? "USDT",
    time: over.time ?? 1_700_000_000_000,
  };
}

/** Converts a raw REST-shaped row into the service's IncomeRow. */
function toLedger(raw: ReturnType<typeof incomeRow>, over: { symbol?: string | null } = {}) {
  return {
    tranId: raw.tranId,
    incomeType: raw.type,
    symbol: over.symbol !== undefined ? over.symbol : raw.symbol,
    amount: raw.income,
    asset: raw.asset,
    time: raw.time,
  };
}

describe("income ledger: parsing and normalization", () => {
  beforeEach(() => freshEnv(makeCfg()));

  test("parseIncomeAmount accepts finite values and rejects junk", () => {
    expect(parseIncomeAmount("12.5")).toBe(12.5);
    expect(parseIncomeAmount("-3")).toBe(-3);
    expect(parseIncomeAmount("")).toBeNull();
    expect(parseIncomeAmount("abc")).toBeNull();
    expect(parseIncomeAmount("NaN")).toBeNull();
  });

  test("normalizeIncomeRow keeps well-formed rows and drops unparsable ones", () => {
    const ok = normalizeIncomeRow(incomeRow({}));
    expect(ok).not.toBeNull();
    expect(ok!).toMatchObject({ tranId: 1, incomeType: "REALIZED_PNL", amount: "10" });

    expect(normalizeIncomeRow(incomeRow({ income: "x" }))).toBeNull();
    expect(normalizeIncomeRow({ ...incomeRow({}), time: Number.NaN })).toBeNull();
    expect(normalizeIncomeRow(incomeRow({ symbol: "" }))!.symbol).toBeNull();
  });

  test("untracked income types are skipped during sync", async () => {
    const { rest } = makeRest();
    await syncIncomeHistory(rest);
    // TRANSFER rows would exist if untracked types were persisted.
    const rows = getDb().prepare(`SELECT COUNT(*) AS n FROM account_income`).get() as { n: number };
    expect(rows.n).toBe(0);
  });
});

describe("income ledger: persistence, duplicates, aggregation", () => {
  beforeEach(() => freshEnv(makeCfg()));

  test("duplicate tranIds persist exactly once (PK backstop)", () => {
    const row = toLedger(incomeRow({ tranId: 42 }));
    expect(persistIncomeRow(row, "rest")).toBe(true);
    expect(persistIncomeRow(row, "rest")).toBe(false);
    const rows = getDb().prepare(`SELECT COUNT(*) AS n FROM account_income`).get() as { n: number };
    expect(rows.n).toBe(1);
  });

  test("sync absorbs duplicate pages without double counting", async () => {
    const page = [
      incomeRow({ tranId: 1, type: "REALIZED_PNL", income: "5" }),
      incomeRow({ tranId: 2, type: "COMMISSION", income: "-0.25" }),
      incomeRow({ tranId: 3, type: "FUNDING_FEE", income: "-1.5" }),
    ];
    const { http, rest } = makeRest({ "/fapi/v1/income": () => page });
    const first = await syncIncomeHistory(rest);
    expect(first.inserted).toBe(3);
    const second = await syncIncomeHistory(rest);
    expect(second.inserted).toBe(0);
    expect(http.callsTo("/fapi/v1/income").length).toBeGreaterThanOrEqual(2);

    const totals = incomeTotals();
    expect(totals.realizedPnl).toBeCloseTo(5);
    expect(totals.commission).toBeCloseTo(0.25);
    expect(totals.fundingFee).toBeCloseTo(-1.5);
    expect(totals.netRealized).toBeCloseTo(5 - 0.25 + -1.5);
  });

  test("commission sign convention: negative outflows expose positive cost magnitude", () => {
    persistIncomeRow(toLedger(incomeRow({ tranId: 10, type: "COMMISSION", income: "-0.5" })), "rest");
    persistIncomeRow(toLedger(incomeRow({ tranId: 11, type: "COMMISSION", income: "-1.25" })), "rest");
    const totals = incomeTotals();
    expect(totals.commission).toBeCloseTo(1.75);
    // net subtracts the cost magnitude
    expect(totals.netRealized).toBeCloseTo(-1.75);
  });

  test("funding fee sign convention: paid is negative, received is positive", () => {
    persistIncomeRow(toLedger(incomeRow({ tranId: 20, type: "FUNDING_FEE", income: "-2" })), "rest");
    persistIncomeRow(toLedger(incomeRow({ tranId: 21, type: "FUNDING_FEE", income: "0.75" })), "rest");
    const totals = incomeTotals();
    expect(totals.fundingFee).toBeCloseTo(-1.25);
    expect(totals.netRealized).toBeCloseTo(-1.25);
  });

  test("realized PnL aggregates across more than 50 fills (lifetime, not last-50)", () => {
    const n = 120;
    const per = 1;
    for (let i = 0; i < n; i++) {
      persistIncomeRow(toLedger(incomeRow({ tranId: 1000 + i, type: "REALIZED_PNL", income: String(per) })), "rest");
    }
    const totals = incomeTotals();
    expect(totals.realizedPnl).toBeCloseTo(n * per);
    expect(totals.netRealized).toBeCloseTo(n * per);
    // The in-memory fill ring would have capped this; the ledger does not.
    const fillWindowRows = getDb().prepare(`SELECT COUNT(*) AS n FROM account_income WHERE income_type = 'REALIZED_PNL'`).get() as { n: number };
    expect(fillWindowRows.n).toBe(n);
  });

  test("negative realized PnL sums with losses", () => {
    persistIncomeRow(toLedger(incomeRow({ tranId: 30, type: "REALIZED_PNL", income: "-12.5" })), "rest");
    persistIncomeRow(toLedger(incomeRow({ tranId: 31, type: "REALIZED_PNL", income: "8" })), "rest");
    expect(incomeTotals().realizedPnl).toBeCloseTo(-4.5);
  });

  test("watermark tracks the newest income time and survives empty syncs", async () => {
    expect(incomeWatermark()).toBe(0);
    persistIncomeRow(toLedger(incomeRow({ tranId: 50, time: 1_700_000_000_500 })), "rest");
    expect(incomeWatermark()).toBe(1_700_000_000_500);
    // Fresh REST client on the SAME env/DB (makeRest would reset the DB).
    const cfg = makeCfg();
    const http = new FakeHttp();
    installFakes(http);
    http.route("/fapi/v1/income", () => jsonRes([]));
    const rest = new BinanceRestClient(cfg, new RateLimiter(cfg.rateInternalPerMin), async () => undefined);
    rest.setTransportForTests(http);
    await syncIncomeHistory(rest);
    expect(incomeWatermark()).toBe(1_700_000_000_500);
  });

  test("pagination walks forward across full pages without losing boundary rows", async () => {
    // Build a full first page (1000 rows) plus a boundary duplicate sharing
    // the newest timestamp, and a tail page.
    const page1: Array<Record<string, unknown>> = [];
    for (let i = 0; i < 1000; i++) {
      page1.push(incomeRow({ tranId: 2000 + i, income: "1", time: 1_700_000_000_000 + i }));
    }
    // Same timestamp as the newest row of page1, different tranId: must not be lost.
    page1.push(incomeRow({ tranId: 3000, income: "1", time: 1_700_000_000_999 }));
    const page2 = [incomeRow({ tranId: 3001, income: "2", time: 1_700_000_001_000 })];

    const cfg = freshEnv(makeCfg());
    const http = new FakeHttp();
    installFakes(http);
    const pages = [page1, page2];
    http.route("/fapi/v1/income", () => jsonRes(pages.length > 1 ? pages.shift()! : page2));
    const rest = new BinanceRestClient(cfg, new RateLimiter(cfg.rateInternalPerMin), async () => undefined);
    rest.setTransportForTests(http);

    const result = await syncIncomeHistory(rest);
    expect(result.fullySynced).toBe(true);
    const rows = getDb().prepare(`SELECT COUNT(*) AS n FROM account_income`).get() as { n: number };
    expect(rows.n).toBe(1002); // 1000 + boundary + tail
    const totals = incomeTotals();
    expect(totals.realizedPnl).toBeCloseTo(1001 + 2);
    // Forward-progress query param: second page starts at the boundary time.
    const secondCall = http.callsTo("/fapi/v1/income")[1];
    expect(secondCall.url).toContain("startTime=1700000000999");
  });

  test("page budget stops a very long sync without recording bogus totals", async () => {
    const cfg = freshEnv(makeCfg());
    const http = new FakeHttp();
    installFakes(http);
    // Each call returns a full page of rows NEWER than everything before it,
    // so the sync keeps making forward progress and must eventually hit the
    // per-pass page budget instead of running forever.
    let call = 0;
    http.route("/fapi/v1/income", () => {
      const base = 1_700_000_000_000 + call * 1000;
      call += 1;
      return jsonRes(Array.from({ length: 1000 }, (_, i) => incomeRow({ tranId: 4000 + call * 10000 + i, income: "0.001", time: base + i })));
    });
    const rest = new BinanceRestClient(cfg, new RateLimiter(cfg.rateInternalPerMin), async () => undefined);
    rest.setTransportForTests(http);
    const result = await syncIncomeHistory(rest);
    expect(result.fullySynced).toBe(false);
    expect(result.pages).toBe(5);
  });
});

describe("account metrics DTO and equity sources", () => {
  beforeEach(() => {
    freshEnv(makeCfg());
    resetLiveStateForTests();
  });

  test("accountMetricsDto exposes separate realized, commission, funding, net", () => {
    persistIncomeRow(toLedger(incomeRow({ tranId: 60, type: "REALIZED_PNL", income: "25" })), "rest");
    persistIncomeRow(toLedger(incomeRow({ tranId: 61, type: "COMMISSION", income: "-1" })), "rest");
    persistIncomeRow(toLedger(incomeRow({ tranId: 62, type: "FUNDING_FEE", income: "-0.5" })), "rest");
    const dto = accountMetricsDto();
    expect(dto.realizedPnl).toBeCloseTo(25);
    expect(dto.commission).toBeCloseTo(1);
    expect(dto.fundingFee).toBeCloseTo(-0.5);
    expect(dto.netRealized).toBeCloseTo(25 - 1 - 0.5);
    expect(dto.fetchedAt).not.toBeNull();
  });

  test("accountMetricsDto returns zeros before the ledger has synced", () => {
    const dto = accountMetricsDto();
    expect(dto).toEqual({ realizedPnl: 0, commission: 0, fundingFee: 0, netRealized: 0, fetchedAt: null });
  });

  test("equity uses exchange marginBalance when available", () => {
    applyAccountSnapshot({
      totalWalletBalance: "1000",
      totalUnrealizedProfit: "10",
      totalMarginBalance: "1012.34",
      availableBalance: "900",
      maxWithdrawAmount: "900",
      assets: [],
    } as never);
    const acc = accountDto();
    expect(acc.equity).toBeCloseTo(1012.34);
    expect(acc.equitySource).toBe("exchange");
    expect(acc.margin).toBeCloseTo(112.34);
  });

  test("fallback equity = wallet + unrealized when marginBalance is absent or junk", () => {
    applyAccountSnapshot({
      totalWalletBalance: "1000",
      totalUnrealizedProfit: "10",
      totalMarginBalance: "",
      availableBalance: "1000",
      maxWithdrawAmount: "1000",
      assets: [],
    } as never);
    let acc = accountDto();
    expect(acc.equity).toBeCloseTo(1010);
    expect(acc.equitySource).toBe("fallback");

    resetLiveStateForTests();
    applyAccountSnapshot({
      totalWalletBalance: "1000",
      totalUnrealizedProfit: "10",
      totalMarginBalance: "not-a-number",
      availableBalance: "1000",
      maxWithdrawAmount: "1000",
      assets: [],
    } as never);
    acc = accountDto();
    expect(acc.equity).toBeCloseTo(1010);
    expect(acc.equitySource).toBe("fallback");
  });

  test("ACCOUNT_UPDATE keeps wallet balance fresh and falls back when no snapshot margin exists", () => {
    // No snapshot yet: applyAccountEvent synthesizes the account without a
    // marginBalance, so equity must fall back to wallet + unrealized.
    applyAccountEvent({
      e: "ACCOUNT_UPDATE",
      E: 9_999,
      T: 9_999,
      a: {
        B: [{ a: "USDT", wb: "1500", cw: "1400", bc: "0" }],
        P: [{ s: "BTCUSDT", pa: "0.001", ep: "50000", cr: "0", up: "5", mt: "cross", iw: "0", ps: "BOTH" }],
      },
    });
    let acc = accountDto();
    expect(acc.balance).toBe(1500);
    expect(acc.equitySource).toBe("fallback");
    expect(acc.equity).toBeCloseTo(1505); // wallet + unrealized

    // After a snapshot the exchange marginBalance is authoritative and
    // survives later ACCOUNT_UPDATEs (it is the freshest exchange value).
    applyAccountSnapshot({
      totalWalletBalance: "1600",
      totalUnrealizedProfit: "8",
      totalMarginBalance: "1612",
      availableBalance: "1500",
      maxWithdrawAmount: "1500",
      assets: [],
    } as never);
    acc = accountDto();
    expect(acc.equitySource).toBe("exchange");
    expect(acc.equity).toBeCloseTo(1612);
  });
});

describe("income sync never exposes secrets", () => {
  test("income requests sign with HMAC headers; raw keys never reach persistence or DTOs", async () => {
    const cfg = freshEnv(makeCfg());
    const http = new FakeHttp();
    installFakes(http);
    http.route("/fapi/v1/income", () => jsonRes([incomeRow({ tranId: 70, income: "1" })]));
    const rest = new BinanceRestClient(cfg, new RateLimiter(cfg.rateInternalPerMin), async () => undefined);
    rest.setTransportForTests(http);
    await syncIncomeHistory(rest);

    const call = http.callsTo("/fapi/v1/income")[0];
    expect(call.headers!["X-MBX-APIKEY"]).toBe("test-api-key"); // header only, as required by Binance
    expect(call.url).not.toContain("test-api-key");
    expect(call.url).not.toContain("test-api-secret");

    const stored = getDb().prepare(`SELECT * FROM account_income LIMIT 1`).get() as Record<string, unknown>;
    const serialized = JSON.stringify(stored);
    expect(serialized).not.toContain("test-api-secret");
    expect(serialized).not.toContain("test-api-key");

    const dto = JSON.stringify(accountMetricsDto());
    expect(dto).not.toContain("test-api-secret");
    expect(dto).not.toContain("test-api-key");
  });
});
