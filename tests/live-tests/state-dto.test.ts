import {
  applyAccountEvent,
  applyAccountSnapshot,
  applyOpenOrdersSnapshot,
  applyOrderEvent,
  applyPositionSnapshot,
  balanceUsd,
  grossExposureUsd,
  liveState,
  resetLiveStateForTests,
} from "@/lib/server/binance/state";
import { accountDto, fillsDto, ordersDto, positionsDto } from "@/lib/server/binance/dto";
import type { AccountUpdateEvent, OrderTradeUpdateEvent } from "@/lib/server/binance/types";
import { accountFixture, orderEvent, orderFixture } from "./helpers";
import type { BinanceOrder } from "@/lib/server/binance/types";

const otu = (o: Record<string, unknown>) => o as unknown as OrderTradeUpdateEvent;

describe("order event application and partial fills", () => {
  beforeEach(() => resetLiveStateForTests());

  test("NEW puts the order on the book; terminal statuses remove it", () => {
    applyOrderEvent(otu(orderEvent({ clientOrderId: "o1", status: "NEW", price: "50000" })));
    expect(liveState().openOrders.has("o1")).toBe(true);
    applyOrderEvent(otu(orderEvent({ clientOrderId: "o1", status: "CANCELED", price: "50000" })));
    expect(liveState().openOrders.has("o1")).toBe(false);
    expect(liveState().orders.get("o1")?.status).toBe("CANCELED");
  });

  test("partial fills accumulate with an exact weighted average price", () => {
    applyOrderEvent(otu(orderEvent({ clientOrderId: "pf", status: "NEW", qty: "0.001", price: "50000" })));
    const f1 = applyOrderEvent(
      otu(orderEvent({ clientOrderId: "pf", status: "PARTIALLY_FILLED", qty: "0.001", lastFilledQty: "0.0005", cumQty: "0.0005", lastFilledPrice: "50000" })),
    );
    const f2 = applyOrderEvent(
      otu(orderEvent({ clientOrderId: "pf", status: "PARTIALLY_FILLED", qty: "0.001", lastFilledQty: "0.0003", cumQty: "0.0008", lastFilledPrice: "50002" })),
    );
    const f3 = applyOrderEvent(
      otu(orderEvent({ clientOrderId: "pf", status: "FILLED", qty: "0.001", lastFilledQty: "0.0002", cumQty: "0.001", lastFilledPrice: "50001" })),
    );
    expect(f1).toHaveLength(1);
    expect(f2).toHaveLength(1);
    expect(f3).toHaveLength(1);

    const order = liveState().orders.get("pf");
    // (0.0005*50000 + 0.0003*50002 + 0.0002*50001) / 0.001 = 50000.8
    expect(order?.avgPrice).toBe("50000.8");
    expect(order?.executedQty).toBe("0.001");
    expect(order?.status).toBe("FILLED");
    expect(liveState().openOrders.has("pf")).toBe(false);

    expect(f3[0]).toMatchObject({ qty: "0.0002", price: "50001", side: "BUY", source: "stream" });
  });

  test("events without fills produce no fill rows and advance the event clock", () => {
    const before = liveState().lastEventTime;
    const fills = applyOrderEvent(otu(orderEvent({ clientOrderId: "nf", status: "NEW", price: "50000", E: 5000 })));
    expect(fills).toEqual([]);
    expect(liveState().lastEventTime).toBe(Math.max(before ?? 0, 5000));
  });

  test("account events update wallet balance and positions", () => {
    applyAccountSnapshot(accountFixture() as never);
    const ev: AccountUpdateEvent = {
      e: "ACCOUNT_UPDATE",
      E: 9_999,
      T: 9_999,
      a: {
        B: [{ a: "USDT", wb: "1234.5", cw: "1200", bc: "0" }],
        P: [{ s: "BTCUSDT", pa: "0.002", ep: "50000", cr: "0", up: "3.2", mt: "cross", iw: "0", ps: "BOTH" }],
      },
    };
    applyAccountEvent(ev);
    expect(liveState().account?.totalWalletBalance).toBe("1234.5");
    const pos = liveState().positions.get("BTCUSDT");
    expect(pos).toMatchObject({ side: "long", qty: "0.002", unrealizedProfit: "3.2" });

    applyAccountEvent({ ...ev, a: { B: ev.a.B, P: [{ ...ev.a.P[0], pa: "0" }] } });
    expect(liveState().positions.has("BTCUSDT")).toBe(false);

    applyAccountEvent({ ...ev, a: { B: ev.a.B, P: [{ ...ev.a.P[0], pa: "-0.005" }] } });
    expect(liveState().positions.get("BTCUSDT")).toMatchObject({ side: "short", qty: "0.005" });
  });
});

describe("snapshots and derived metrics", () => {
  beforeEach(() => resetLiveStateForTests());

  test("position snapshot skips zero quantities and derives side from sign", () => {
    applyPositionSnapshot([
      { symbol: "BTCUSDT", positionAmt: "0.002", entryPrice: "50000", markPrice: "51000", unRealizedProfit: "2", liquidationPrice: "0", leverage: "10", positionSide: "BOTH", notional: "102" },
      { symbol: "ETHUSDT", positionAmt: "-1.5", entryPrice: "3000", markPrice: "2900", unRealizedProfit: "150", liquidationPrice: "9999", leverage: "5", positionSide: "BOTH" },
      { symbol: "XRPUSDT", positionAmt: "0", entryPrice: "0", markPrice: "0.5", unRealizedProfit: "0", liquidationPrice: "0", leverage: "1", positionSide: "BOTH" },
    ] as never);
    expect(liveState().positions.size).toBe(2);
    expect(liveState().positions.get("BTCUSDT")?.side).toBe("long");
    expect(liveState().positions.get("ETHUSDT")?.side).toBe("short");
    expect(liveState().positions.get("ETHUSDT")?.qty).toBe("1.5");
    expect(grossExposureUsd()).toBeCloseTo(0.002 * 51000 + 1.5 * 2900, 6);
  });

  test("open orders snapshot keeps only working statuses", () => {
    applyOpenOrdersSnapshot([
      orderFixture({ clientOrderId: "w1", status: "NEW" }),
      orderFixture({ clientOrderId: "w2", status: "PARTIALLY_FILLED" }),
      orderFixture({ clientOrderId: "d1", status: "FILLED" }),
    ] as unknown as BinanceOrder[]);
    expect([...liveState().openOrders.keys()].sort()).toEqual(["w1", "w2"]);
    expect(liveState().orders.size).toBe(3);
    expect(liveState().snapshotAt).not.toBeNull();
  });

  test("balanceUsd reflects the account snapshot", () => {
    expect(balanceUsd()).toBe(0);
    applyAccountSnapshot(accountFixture({ totalWalletBalance: "777" }) as never);
    expect(balanceUsd()).toBe(777);
  });
});

describe("DTO mapping for the UI", () => {
  beforeEach(() => resetLiveStateForTests());

  test("positionsDto attaches native TP/SL prices from closePosition orders", () => {
    applyPositionSnapshot([
      { symbol: "BTCUSDT", positionAmt: "0.001", entryPrice: "50000", markPrice: "50500", unRealizedProfit: "0.5", liquidationPrice: "40000", leverage: "3", positionSide: "BOTH", notional: "50.5" },
    ] as never);
    applyOpenOrdersSnapshot([
      orderFixture({ clientOrderId: "tp", type: "TAKE_PROFIT_MARKET", stopPrice: "55000", closePosition: true, side: "SELL" }),
      orderFixture({ clientOrderId: "sl", type: "STOP_MARKET", stopPrice: "48000", closePosition: true, side: "SELL" }),
    ] as unknown as BinanceOrder[]);
    const [dto] = positionsDto();
    expect(dto).toMatchObject({ id: "BTCUSDT", side: "long", qty: 0.001, tp: 55000, sl: 48000, leverage: 3, mark: 50500 });
    expect(dto.liq).toBe(40000);
  });

  test("ordersDto maps LIMIT and stop types for the UI", () => {
    applyOpenOrdersSnapshot([
      orderFixture({ clientOrderId: "l1", type: "LIMIT", price: "50000.5", status: "NEW", time: 100 }),
      orderFixture({ clientOrderId: "s1", type: "STOP_MARKET", stopPrice: "48000", status: "NEW", time: 200 }),
      orderFixture({ clientOrderId: "m1", type: "MARKET", status: "NEW", time: 300 }),
    ] as unknown as BinanceOrder[]);
    const dtos = ordersDto();
    expect(dtos.map((d) => d.id)).toEqual(["s1", "l1"]); // newest first, MARKET excluded
    expect(dtos[1]).toMatchObject({ type: "limit", price: 50000.5, side: "buy" });
    expect(dtos[0]).toMatchObject({ type: "stop", price: 48000 });
  });

  test("accountDto computes equity/margin; fillsDto is newest-first", () => {
    applyAccountSnapshot(accountFixture({ totalWalletBalance: "1000", availableBalance: "900", totalMarginBalance: "1010", totalUnrealizedProfit: "10" }) as never);
    const acc = accountDto();
    expect(acc.balance).toBe(1000);
    expect(acc.available).toBe(900);
    expect(acc.equity).toBe(1010);
    expect(acc.margin).toBe(110);
    expect(acc.unrealized).toBe(10);

    for (const [id, ts, price] of [["f1", 1000, "50000"], ["f2", 2000, "51000"]] as const) {
      const fills = applyOrderEvent(
        otu(orderEvent({ clientOrderId: id, status: "FILLED", lastFilledQty: ts === 1000 ? "0.001" : "0.002", cumQty: ts === 1000 ? "0.001" : "0.002", lastFilledPrice: price, T: ts })),
      );
      liveState().fills.push(...fills); // the live manager owns this bookkeeping
    }
    const fills = fillsDto();
    expect(fills).toHaveLength(2);
    expect(fills[0].ts).toBe(2000);
    expect(fills[0]).toMatchObject({ qty: 0.002, price: 51000, side: "buy" });
  });
});
