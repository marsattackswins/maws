import { describe, expect, test } from "@jest/globals";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { computePosRows, PnlCell } from "@/components/trading/PositionsPanel";
import { getBrokerBook, type BookPosition } from "@/lib/selectors/broker";

const livePositionBase = {
  id: "BTCUSDT",
  symbol: "BTCUSDT",
  side: "short" as const,
  entry: 83971.01818181819,
  qty: 0.011,
  tp: null,
  sl: null,
  leverage: 20,
  liq: null,
  mark: 83994.3,
  unrealized: -0.2328181818181818,
  openedAt: 1_700_000_000_000,
  notional: 923.9,
};

describe("BookPosition freshness fields", () => {
  test("accepts the optional markAgeMs / markPriceStale fields", () => {
    const pos: BookPosition = { ...livePositionBase, markAgeMs: 4200, markPriceStale: true };
    expect(pos.markAgeMs).toBe(4200);
    expect(pos.markPriceStale).toBe(true);
    // Existing fields are untouched.
    expect(pos.mark).toBe(83994.3);
    expect(pos.unrealized).toBeCloseTo(-0.2328181818181818, 12);
  });
});

describe("PnlCell stale indicator", () => {
  test("fresh exchange-marked PnL renders without a stale indicator", () => {
    const markup = renderToStaticMarkup(createElement(PnlCell, { pnl: -0.23, markPriceStale: false, markAgeMs: 800 }));
    expect(markup).not.toContain("stale");
    expect(markup).toContain("-$0.23");
    expect(markup).not.toContain("aria-label");
  });

  test("fresh value with no provenance fields renders without a stale indicator", () => {
    const markup = renderToStaticMarkup(createElement(PnlCell, { pnl: 1.5 }));
    expect(markup).not.toContain("stale");
    expect(markup).toContain("$1.50");
  });

  test("fill-fallback PnL renders a stale indicator with an accessible mark age", () => {
    const markup = renderToStaticMarkup(createElement(PnlCell, { pnl: -0.23, markPriceStale: true, markAgeMs: 4200 }));
    expect(markup).toContain("stale");
    // Accessible label + tooltip carry the age in seconds (4200ms → 4s).
    expect(markup).toContain("mark age 4 seconds");
    expect(markup).toContain("fill snapshot; mark age 4s");
    // Value itself is unchanged.
    expect(markup).toContain("-$0.23");
  });

  test("stale indicator renders without an age when markAgeMs is unavailable", () => {
    const markup = renderToStaticMarkup(createElement(PnlCell, { pnl: 2, markPriceStale: true }));
    expect(markup).toContain("stale");
    expect(markup).toContain("fill-time snapshot");
    expect(markup).not.toContain("mark age");
  });
});

describe("existing PnL values are unchanged", () => {
  test("computePosRows keeps the dollar PnL math and passes provenance through", () => {
    const rows = computePosRows(
      [
        { ...livePositionBase, markAgeMs: 100, markPriceStale: false },
        { ...livePositionBase, id: "ETHUSDT", symbol: "ETHUSDT", side: "long" as const, entry: 3000, qty: 1.5, mark: 2900, unrealized: -150, markPriceStale: true, markAgeMs: 5000 },
      ],
      true,
      () => 0,
    );
    // Dollar PnL is still re-derived from mark/entry with the side factor.
    expect(rows[0].pnl).toBeCloseTo((83994.3 - 83971.01818181819) * 0.011 * -1, 10);
    expect(rows[1].pnl).toBeCloseTo((2900 - 3000) * 1.5, 10);
    // Provenance passes through untouched; paper branch never sets it.
    expect(rows[0].markPriceStale).toBe(false);
    expect(rows[1].markPriceStale).toBe(true);
    expect(rows[1].markAgeMs).toBe(5000);

    const paperRows = computePosRows([{ ...livePositionBase }], false, () => 2900);
    expect(paperRows[0].markPriceStale).toBeUndefined();
    // Short with last BELOW entry is a positive PnL: (entry − last) × qty.
    expect(paperRows[0].pnl).toBeCloseTo((83971.01818181819 - 2900) * 0.011, 10);
  });

  test("getBrokerBook keeps live precedence and passes freshness fields through", () => {
    const stalePos = { ...livePositionBase, markAgeMs: 9000, markPriceStale: true };
    const live = { orders: [], positions: [stalePos] };
    const app = { connectedBroker: "binance" as const, orders: [], positions: [] };
    const book = getBrokerBook(app, live as never);
    expect(book.positions[0].markPriceStale).toBe(true);
    expect(book.positions[0].markAgeMs).toBe(9000);
  });
});
