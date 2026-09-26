import { describe, expect, it, beforeEach } from "@jest/globals";

import {
  applyAccountEvent,
  applyMarkPrice,
  applyPositionSnapshot,
  liveState,
  refreshPositionMarkAfterAccountUpdate,
  resetLiveStateForTests,
} from "@/lib/server/binance/state";
import { positionsDto } from "@/lib/server/binance/dto";
import type { AccountUpdateEvent, PositionRiskRow } from "@/lib/server/binance/types";

/** Minimal ACCOUNT_UPDATE carrying one position row. */
function accountUpdate(position: {
  symbol: string;
  pa: string;
  ep: string;
  up: string;
  E?: number;
}): AccountUpdateEvent {
  return {
    e: "ACCOUNT_UPDATE",
    E: position.E ?? 1_700_000_000_000,
    T: position.E ?? 1_700_000_000_000,
    a: {
      B: [{ a: "USDT", wb: "1000", cw: "950", bc: "0" }],
      P: [{ s: position.symbol, pa: position.pa, ep: position.ep, cr: "0", up: position.up, mt: "cross", iw: "0", ps: "BOTH" }],
    },
  };
}

function positionRow(overrides: Partial<PositionRiskRow>): PositionRiskRow {
  return {
    symbol: overrides.symbol ?? "BTCUSDT",
    positionAmt: overrides.positionAmt ?? "0.002",
    entryPrice: overrides.entryPrice ?? "50000",
    markPrice: overrides.markPrice ?? "50000",
    unRealizedProfit: overrides.unRealizedProfit ?? "0",
    liquidationPrice: overrides.liquidationPrice ?? "0",
    leverage: overrides.leverage ?? "10",
    positionSide: overrides.positionSide ?? "BOTH",
  };
}

const TOLERANCE = 1e-8;

beforeEach(() => {
  resetLiveStateForTests();
});

describe("ACCOUNT_UPDATE pnl freshness", () => {
  it("marks fill-time up as fill-fallback provenance and replaces it with a newer mark-derived PnL", () => {
    // Short 0.002 @ 50000, fill-time up = -0.50 (mark was 50250 at fill).
    applyAccountEvent(accountUpdate({ symbol: "BTCUSDT", pa: "-0.002", ep: "50000", up: "-0.50" }));
    const pos = liveState().positions.get("BTCUSDT");
    expect(pos).toBeDefined();
    expect(pos!.unrealizedProfit).toBe("-0.50"); // preserved, never zeroed
    expect(pos!.markPriceSource).toBe("fill-fallback");

    // A newer mark arrives (stream or premiumIndex) — the existing path.
    expect(applyMarkPrice("BTCUSDT", "49900")).toBe(true);
    const refreshed = liveState().positions.get("BTCUSDT")!;
    expect(refreshed.markPriceSource).toBe("exchange");
    expect(Number(refreshed.unrealizedProfit)).toBeCloseTo(0.2, 8); // (49900-50000)*0.002*-1
  });

  it("every subsequent mark tick replaces stale fill-time PnL", () => {
    applyAccountEvent(accountUpdate({ symbol: "BTCUSDT", pa: "-0.002", ep: "50000", up: "-0.50" }));
    for (const mark of ["49800", "49700", "50100"]) {
      expect(applyMarkPrice("BTCUSDT", mark)).toBe(true);
      const pos = liveState().positions.get("BTCUSDT")!;
      expect(pos.markPriceSource).toBe("exchange");
      expect(pos.markPrice).toBe(mark);
      expect(Number(pos.unrealizedProfit)).toBeCloseTo((Number(mark) - 50000) * 0.002 * -1, 8);
    }
  });

  it("short position keeps negative PnL when mark rises", () => {
    applyAccountEvent(accountUpdate({ symbol: "BTCUSDT", pa: "-0.002", ep: "50000", up: "-0.50" }));
    applyMarkPrice("BTCUSDT", "50100");
    expect(Number(liveState().positions.get("BTCUSDT")!.unrealizedProfit)).toBeCloseTo(-0.2, 8);
  });

  it("long position keeps positive PnL when mark rises", () => {
    applyAccountEvent(accountUpdate({ symbol: "BTCUSDT", pa: "0.002", ep: "50000", up: "0.50" }));
    applyMarkPrice("BTCUSDT", "50100");
    expect(Number(liveState().positions.get("BTCUSDT")!.unrealizedProfit)).toBeCloseTo(0.2, 8);
  });

  it("entry prices more precise than the ACCOUNT_UPDATE display stay correct", () => {
    // Exchange REST row carries full precision; the event truncates ep to 8dp.
    applyPositionSnapshot([positionRow({ symbol: "BTCUSDT", positionAmt: "-0.0110", entryPrice: "83971.01818181819", markPrice: "83994.30000000", unRealizedProfit: "-0.25658" })]);
    // A fill replaces the position with the truncated ep (exchange behavior).
    applyAccountEvent(accountUpdate({ symbol: "BTCUSDT", pa: "-0.0100", ep: "83971.01818182", up: "-0.23281819" }));
    // New mark: PnL must be derived from the event's ep exactly as Binance does.
    applyMarkPrice("BTCUSDT", "83994.30000000");
    const pos = liveState().positions.get("BTCUSDT")!;
    expect(Number(pos.unrealizedProfit)).toBeCloseTo((83994.3 - 83971.01818182) * 0.01 * -1, 8);
    // The 8dp-truncated ep reproduces Binance's own published value exactly.
    expect(Number(pos.unrealizedProfit)).toBeCloseTo(-0.23281818, 8);
  });

  it("refreshPositionMarkAfterAccountUpdate applies a fetched mark via applyMarkPrice", async () => {
    applyAccountEvent(accountUpdate({ symbol: "BTCUSDT", pa: "-0.002", ep: "50000", up: "-0.50" }));
    const refreshed = await refreshPositionMarkAfterAccountUpdate(["BTCUSDT"], async (symbol) => {
      expect(symbol).toBe("BTCUSDT");
      return "49900";
    });
    expect(refreshed).toBe(1);
    const pos = liveState().positions.get("BTCUSDT")!;
    expect(pos.markPrice).toBe("49900");
    expect(pos.markPriceSource).toBe("exchange");
    expect(Number(pos.unrealizedProfit)).toBeCloseTo(0.2, 8);
  });

  it("failed mark refresh preserves the fill snapshot and stays clearly stale", async () => {
    applyAccountEvent(accountUpdate({ symbol: "BTCUSDT", pa: "-0.002", ep: "50000", up: "-0.50" }));
    const refreshed = await refreshPositionMarkAfterAccountUpdate(["BTCUSDT"], async () => {
      throw new Error("premiumIndex down");
    });
    expect(refreshed).toBe(0);
    const pos = liveState().positions.get("BTCUSDT")!;
    // Safe fallback: nothing invented, nothing zeroed, provenance stays stale.
    expect(pos.unrealizedProfit).toBe("-0.50");
    expect(pos.markPriceSource).toBe("fill-fallback");
    expect(pos.markPrice).toBe("50000"); // prior mark retained, not undefined/0
  });

  it("frozen positionRisk mark does not prevent premiumIndex-derived marks from advancing PnL", async () => {
    // Authoritative snapshot carries a frozen/stale mark and matching up.
    applyPositionSnapshot([positionRow({ symbol: "BTCUSDT", positionAmt: "-0.002", entryPrice: "50000", markPrice: "50000", unRealizedProfit: "0" })]);
    // ACCOUNT_UPDATE keeps the frozen mark (prev) but a new fill-time up.
    applyAccountEvent(accountUpdate({ symbol: "BTCUSDT", pa: "-0.002", ep: "50000", up: "-0.10" }));
    expect(liveState().positions.get("BTCUSDT")!.markPrice).toBe("50000");
    // The premiumIndex path returns a live mark despite the frozen REST row.
    await refreshPositionMarkAfterAccountUpdate(["BTCUSDT"], async () => "50100");
    const pos = liveState().positions.get("BTCUSDT")!;
    expect(pos.markPrice).toBe("50100");
    expect(pos.markPriceSource).toBe("exchange");
    expect(Number(pos.unrealizedProfit)).toBeCloseTo(-0.2, 8);
  });
});

describe("positionsDto pnl provenance", () => {
  it("exposes markAgeMs and markPriceStale derived from position provenance", () => {
    applyPositionSnapshot([positionRow({ symbol: "BTCUSDT", positionAmt: "0.002", entryPrice: "50000", markPrice: "50100", unRealizedProfit: "2" })]);
    let dto = positionsDto();
    expect(dto[0].markPriceStale).toBe(false);
    expect(dto[0].markAgeMs).toBeGreaterThanOrEqual(0);

    applyAccountEvent(accountUpdate({ symbol: "ETHUSDT", pa: "-1", ep: "3000", up: "-10" }));
    dto = positionsDto();
    const eth = dto.find((p) => p.symbol === "ETHUSDT")!;
    expect(eth.markPriceStale).toBe(true);
    expect(eth.markAgeMs).toBeGreaterThanOrEqual(0);
    expect(eth.unrealized).toBe(-10); // value preserved for display
  });
});
