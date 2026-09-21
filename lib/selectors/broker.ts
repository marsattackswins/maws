/**
 * Broker book selection: one source of truth for which orders/positions the
 * UI renders. `connectedBroker === "binance"` shows the live book; anything
 * else (mock/paper, or nothing connected) shows the paper book. The two books
 * are never merged — the chart and panels always render exactly one.
 */

import { useAppStore, type Store } from "@/lib/store";
import { useLiveStore } from "@/lib/live/store";
import type { OrderDto, PositionDto } from "@/lib/live/types";
import type { ChartOrder, ChartPosition } from "@/types";

/** Chart-compatible position; live DTOs additionally carry mark/unrealized/notional. */
export type BookPosition = ChartPosition & Partial<Pick<PositionDto, "mark" | "unrealized" | "notional">>;

export interface BrokerBook {
  orders: ChartOrder[];
  positions: BookPosition[];
}

/**
 * Pure selector over a combined store snapshot. Live book takes precedence
 * when (and only when) the binance broker is the connected one; otherwise the
 * paper book is returned. Never merges the two.
 */
export function getBrokerBook(
  app: Pick<Store, "connectedBroker" | "orders" | "positions">,
  live: Pick<ReturnType<typeof useLiveStore.getState>, "orders" | "positions">,
): BrokerBook {
  if (app.connectedBroker === "binance") {
    return { orders: live.orders as ChartOrder[], positions: live.positions as BookPosition[] };
  }
  return { orders: app.orders, positions: app.positions as BookPosition[] };
}

/** Reactive variant for React components (subscribes to both stores). */
export function useBrokerBook(): BrokerBook {
  const connectedBroker = useAppStore((s) => s.connectedBroker);
  const orders = useAppStore((s) => s.orders);
  const positions = useAppStore((s) => s.positions);
  const liveOrders = useLiveStore((s) => s.orders);
  const livePositions = useLiveStore((s) => s.positions);
  return getBrokerBook({ connectedBroker, orders, positions }, { orders: liveOrders, positions: livePositions });
}

export type { OrderDto, PositionDto };
