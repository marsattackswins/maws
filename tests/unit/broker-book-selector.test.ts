/**
 * Broker book selector (lib/selectors/broker.ts).
 *
 * Guarantees the UI renders exactly one orders/positions book at a time:
 *   - connectedBroker === "binance"  → live book only
 *   - connectedBroker !== "binance"  → paper book only
 * The two books are never merged, and paper marks must never leak onto the
 * live view (or vice versa).
 */

import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { getBrokerBook } from "@/lib/selectors/broker";
import { useAppStore } from "@/lib/store";
import { useLiveStore } from "@/lib/live/store";
import type { OrderDto, PositionDto } from "@/lib/live/types";
import type { ChartOrder, ChartPosition } from "@/types";

// Stores are imported to keep state realistic in tests; the selector under
// test is the pure getBrokerBook (useBrokerBook is a thin subscription
// wrapper over it).
const paperOrder: ChartOrder = {
  id: "paper-order-1",
  symbol: "BTCUSDT",
  side: "buy",
  type: "limit",
  price: 40_000,
  qty: 0.5,
};

const paperPos: ChartPosition = {
  id: "paper-pos-1",
  symbol: "BTCUSDT",
  side: "long",
  entry: 38_000,
  qty: 1,
  tp: 45_000,
  sl: 35_000,
  leverage: 5,
  liq: 30_000,
};

const liveOrder: OrderDto = {
  id: "live-order-1",
  symbol: "ETHUSDT",
  side: "sell",
  type: "limit",
  price: 2_500,
  qty: 2,
  reduceOnly: false,
  closePosition: false,
  time: 1_700_000_000_000,
};

const livePos: PositionDto = {
  id: "ETHUSDT",
  symbol: "ETHUSDT",
  side: "short",
  entry: 2_600,
  qty: 1.5,
  tp: null,
  sl: 2_800,
  leverage: 10,
  liq: 3_100,
  mark: 2_550,
  unrealized: 75,
  openedAt: 1_700_000_000_000,
};

beforeEach(() => {
  useAppStore.setState({ connectedBroker: "mock", orders: [paperOrder], positions: [paperPos] });
  useLiveStore.setState({ orders: [liveOrder], positions: [livePos] });
});

afterEach(() => {
  useAppStore.setState({ connectedBroker: null, orders: [], positions: [] });
  useLiveStore.setState({ orders: [], positions: [] });
});

describe("getBrokerBook", () => {
  test("binance: returns live orders/positions only", () => {
    const app = { connectedBroker: "binance" as const, orders: [paperOrder], positions: [paperPos] };
    const live = { orders: [liveOrder], positions: [livePos] };

    const book = getBrokerBook(app, live);

    expect(book.orders).toHaveLength(1);
    expect(book.orders[0]).toBe(liveOrder);
    expect(book.positions).toHaveLength(1);
    expect(book.positions[0]).toBe(livePos);
    // No paper items leak into the live book.
    expect(book.orders.some((o) => o.id.startsWith("paper"))).toBe(false);
    expect(book.positions.some((p) => p.id.startsWith("paper"))).toBe(false);
  });

  test("mock: returns paper orders/positions only", () => {
    const app = { connectedBroker: "mock" as const, orders: [paperOrder], positions: [paperPos] };
    const live = { orders: [liveOrder], positions: [livePos] };

    const book = getBrokerBook(app, live);

    expect(book.orders).toHaveLength(1);
    expect(book.orders[0]).toBe(paperOrder);
    expect(book.positions).toHaveLength(1);
    expect(book.positions[0]).toBe(paperPos);
    // No live items leak into the paper book.
    expect(book.orders.some((o) => o.id.startsWith("live"))).toBe(false);
    expect(book.positions.some((p) => p.id.startsWith("live") || p.symbol === "ETHUSDT")).toBe(false);
  });

  test("no broker connected: falls back to paper only", () => {
    const app = { connectedBroker: null, orders: [paperOrder], positions: [paperPos] };
    const live = { orders: [liveOrder], positions: [livePos] };

    const book = getBrokerBook(app, live);

    expect(book.orders).toEqual([paperOrder]);
    expect(book.positions).toEqual([paperPos]);
  });

  test("returns empty books when the selected side has nothing", () => {
    const live = getBrokerBook(
      { connectedBroker: "binance", orders: [paperOrder], positions: [paperPos] },
      { orders: [], positions: [] },
    );
    expect(live).toEqual({ orders: [], positions: [] });

    const paper = getBrokerBook(
      { connectedBroker: "mock", orders: [], positions: [] },
      { orders: [liveOrder], positions: [livePos] },
    );
    expect(paper).toEqual({ orders: [], positions: [] });
  });

  test("never merges: binance book excludes paper orders even when live is empty", () => {
    const book = getBrokerBook(
      { connectedBroker: "binance", orders: [paperOrder], positions: [paperPos] },
      { orders: [], positions: [] },
    );
    expect(book.orders).toHaveLength(0);
    expect(book.positions).toHaveLength(0);
  });
});
