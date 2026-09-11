import { MOCK_START_BALANCE } from "@/lib/brokers";
import { mawsFeed } from "@/lib/maws/feed";
import { useAppStore } from "@/lib/store";
import { liquidationPrice } from "@/lib/trade-marks";
import { resolveExitCondition } from "@/lib/trading/exit-conditions";
import { protectFromSettings, resolveSymbolTrading } from "@/lib/trading/symbol-settings";
import type {
  ChartOrder,
  ChartPosition,
  OrderHistoryEntry,
  Quote,
} from "@/types";

// Keep the historical import path (`@/lib/trading/mock`) working.
export { resolveExitCondition } from "@/lib/trading/exit-conditions";
export type { ExitCheckPosition, ExitCondition } from "@/lib/trading/exit-conditions";

export type PlaceOrderInput = {
  symbol: string;
  side: "buy" | "sell";
  type: "market" | "limit" | "stop";
  price: number;
  qty: number;
  /**
   * Optional idempotency key. When set, a submission is silently ignored if
   * any open order or history entry already carries the same clientOrderId
   * (protects against retried/replayed order submissions).
   */
  clientOrderId?: string;
};

type FillReason = "manual" | "tp" | "sl" | "liq" | "flip";

type FillMeta = {
  orderType?: OrderHistoryEntry["type"];
  reason?: FillReason;
  orderId?: string;
  clientOrderId?: string;
  limitPrice?: number | null;
  stopPrice?: number | null;
  /**
   * When closing a specific position, binds the fill to that position id so a
   * replayed close event cannot match a later, unrelated position.
   */
  closePositionId?: string;
};

export function connectMock() {
  const s = useAppStore.getState();
  s.setConnectedBroker("mock");
  if (s.mockBalance <= 0) {
    s.setMockBalance(MOCK_START_BALANCE);
    s.addBalanceHistory({
      time: Date.now(),
      type: "deposit",
      amount: MOCK_START_BALANCE,
      balanceAfter: MOCK_START_BALANCE,
      note: "Paper account funded",
    });
  }
  s.setBrokerDialogOpen(false);
  s.setBottomTab("positions");
  if (s.bottomHeight < 240) s.setBottomHeight(260);
}

export function disconnectBroker() {
  const s = useAppStore.getState();
  s.setConnectedBroker(null);
  s.setBottomOpen(false);
}

export function requireMock(): boolean {
  const s = useAppStore.getState();
  if (s.connectedBroker === "mock") return true;
  s.setBrokerDialogOpen(true);
  return false;
}

export function submitOrder(input: PlaceOrderInput) {
  if (!requireMock()) return;
  const qty = Math.abs(input.qty);
  if (!Number.isFinite(qty) || qty <= 0) return;
  if (input.clientOrderId && isDuplicateClientOrder(input.clientOrderId)) return;
  const last = mawsFeed.getQuote(input.symbol).last;
  const s = useAppStore.getState();
  s.addJournalEntry({
    time: Date.now(),
    text: `Call to place ${input.type} order to ${input.side} ${qty} units of symbol ${input.symbol}`,
  });
  if (input.type === "market" || isMarketable(input, last)) {
    applyFill(input.symbol, input.side, last, qty, {
      orderType: input.type === "market" ? "market" : input.type,
      reason: "manual",
      clientOrderId: input.clientOrderId,
      limitPrice: input.type === "limit" ? input.price : null,
      stopPrice: input.type === "stop" ? input.price : null,
    });
    return;
  }
  const before = s.orders.length;
  s.addOrder({
    symbol: input.symbol,
    side: input.side,
    type: input.type,
    price: input.price,
    qty,
    clientOrderId: input.clientOrderId,
  });
  const placedOrders = useAppStore.getState().orders;
  const placed = placedOrders[placedOrders.length - 1];
  if (placed && useAppStore.getState().orders.length > before) {
    useAppStore.getState().addJournalEntry({
      time: Date.now(),
      text: `Order ${placed.id} successfully placed`,
    });
  }
}

/** True when an idempotency key was already consumed by an open order or history entry. */
function isDuplicateClientOrder(clientOrderId: string): boolean {
  const s = useAppStore.getState();
  return (
    s.orders.some((o) => o.clientOrderId === clientOrderId) ||
    s.orderHistory.some((h) => h.clientOrderId === clientOrderId)
  );
}

export function cancelOrder(id: string) {
  const s = useAppStore.getState();
  const order = s.orders.find((o) => o.id === id);
  if (!order) return;
  const trading = resolveSymbolTrading(order.symbol);
  const leverage = Math.max(1, trading.leverage);
  const margin = (order.qty * order.price) / leverage;
  const now = Date.now();
  s.removeOrder(id);
  s.addOrderHistory({
    time: now,
    closingTime: now,
    symbol: order.symbol,
    side: order.side,
    type: order.type,
    qty: order.qty,
    price: order.price,
    limitPrice: order.type === "limit" ? order.price : null,
    stopPrice: order.type === "stop" ? order.price : null,
    status: "cancelled",
    leverage,
    margin,
    clientOrderId: order.clientOrderId,
  });
  s.addJournalEntry({
    time: now,
    text: `Order ${order.id} for symbol ${order.symbol} has been cancelled`,
  });
}

export function closePosition(id: string) {
  const s = useAppStore.getState();
  const pos = s.positions.find((p) => p.id === id);
  if (!pos) return;
  const last = mawsFeed.getQuote(pos.symbol).last;
  const closeSide: "buy" | "sell" = pos.side === "long" ? "sell" : "buy";
  applyFill(pos.symbol, closeSide, last, pos.qty, {
    orderType: "market",
    reason: "manual",
  });
}

export function tickMock(quotes: Iterable<Quote>) {
  const s = useAppStore.getState();
  if (s.connectedBroker !== "mock") return;
  const lastBySymbol = new Map<string, number>();
  for (const q of quotes) lastBySymbol.set(q.symbol, q.last);

  for (const order of [...s.orders]) {
    const last = lastBySymbol.get(order.symbol) ?? mawsFeed.getQuote(order.symbol).last;
    if (!isMarketable(order, last)) continue;
    // Replayed/stale snapshot guard: the order may already have been filled or
    // cancelled by an earlier event in this batch (or a previous delivery).
    const current = useAppStore.getState();
    if (!current.orders.some((o) => o.id === order.id)) continue;
    current.removeOrder(order.id);
    applyFill(order.symbol, order.side, last, order.qty, {
      orderType: order.type,
      reason: "manual",
      orderId: order.id,
      clientOrderId: order.clientOrderId,
      limitPrice: order.type === "limit" ? order.price : null,
      stopPrice: order.type === "stop" ? order.price : null,
    });
  }

  for (const pos of [...useAppStore.getState().positions]) {
    const last = lastBySymbol.get(pos.symbol) ?? mawsFeed.getQuote(pos.symbol).last;
    const exitCondition = resolveExitCondition(pos, last);
    if (!exitCondition) continue;
    // Replayed/stale snapshot guard: re-read the position by id and close the
    // CURRENT qty of exactly THIS position, never a later position on the
    // same symbol (closePositionId binds the fill to pos.id).
    const fresh = useAppStore.getState().positions.find((p) => p.id === pos.id);
    if (!fresh) continue;
    const closeSide: "buy" | "sell" = fresh.side === "long" ? "sell" : "buy";
    applyFill(fresh.symbol, closeSide, exitCondition.px, fresh.qty, {
      orderType: "market",
      reason: exitCondition.reason,
      closePositionId: fresh.id,
    });
  }
}

export function positionPnl(pos: ChartPosition, last: number) {
  return pos.side === "long" ? (last - pos.entry) * pos.qty : (pos.entry - last) * pos.qty;
}

export function usedMargin(positions: ChartPosition[]) {
  return positions.reduce((sum, p) => sum + (p.qty * p.entry) / Math.max(1, p.leverage), 0);
}

export function ordersMargin(orders: ChartOrder[], leverage: number) {
  const lev = Math.max(1, leverage);
  return orders.reduce((sum, o) => sum + (o.qty * o.price) / lev, 0);
}

export function formatNum(value: number, digits = 2) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function formatUsd(value: number, digits = 2) {
  const abs = Math.abs(value).toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
  return value < 0 ? `-$${abs}` : `$${abs}`;
}

function isMarketable(order: Pick<ChartOrder, "side" | "type" | "price">, last: number) {
  if (order.type === "market") return true;
  if (order.type === "limit") {
    return order.side === "buy" ? last <= order.price : last >= order.price;
  }
  return order.side === "buy" ? last >= order.price : last <= order.price;
}

function recordFilledOrder(
  symbol: string,
  side: "buy" | "sell",
  qty: number,
  fillPrice: number,
  orderType: OrderHistoryEntry["type"],
  meta: {
    leverage: number;
    margin: number;
    limitPrice?: number | null;
    stopPrice?: number | null;
    orderId?: string;
    clientOrderId?: string;
  },
) {
  const now = Date.now();
  const id = meta.orderId;
  useAppStore.getState().addOrderHistory({
    time: now,
    closingTime: now,
    symbol,
    side,
    type: orderType,
    qty,
    price: fillPrice,
    limitPrice: meta.limitPrice ?? (orderType === "limit" ? fillPrice : null),
    stopPrice: meta.stopPrice ?? (orderType === "stop" ? fillPrice : null),
    status: "filled",
    fillPrice,
    leverage: meta.leverage,
    margin: meta.margin,
    clientOrderId: meta.clientOrderId,
  });
  useAppStore.getState().addJournalEntry({
    time: now,
    text: id
      ? `Order ${id} for symbol ${symbol} has been executed at price ${fillPrice} for ${qty} units`
      : `Order for symbol ${symbol} has been executed at price ${fillPrice} for ${qty} units`,
  });
}

function applyFill(
  symbol: string,
  side: "buy" | "sell",
  price: number,
  qty: number,
  meta: FillMeta = {},
) {
  const s = useAppStore.getState();
  const trading = resolveSymbolTrading(symbol);
  const leverage = Math.max(1, trading.leverage);
  const posSide: ChartPosition["side"] = side === "buy" ? "long" : "short";
  const existing = meta.closePositionId
    ? s.positions.find((p) => p.id === meta.closePositionId && p.symbol === symbol)
    : s.positions.find((p) => p.symbol === symbol);
  const marginFor = (q: number, entry: number) => (q * entry) / leverage;
  const orderType = meta.orderType ?? "market";
  const now = Date.now();

  // Replay guard: a close bound to a position id whose target is already gone
  // (or no longer on the opposite side) is a stale event — drop it instead of
  // opening or flipping anything.
  if (meta.closePositionId && (!existing || existing.side === posSide)) return;

  if (!existing) {
    const margin = marginFor(qty, price);
    if (s.mockBalance < margin) return;
    const protect = protectFromSettings(price, posSide, trading);
    const balanceAfter = s.mockBalance - margin;
    s.setMockBalance(balanceAfter);
    s.addPosition({
      symbol,
      side: posSide,
      entry: price,
      qty,
      leverage,
      tp: protect.tp,
      sl: protect.sl,
      liq: liquidationPrice({ side: posSide, entry: price, leverage }),
      openedAt: now,
    });
    recordFilledOrder(symbol, side, qty, price, orderType, {
      leverage,
      margin,
      limitPrice: meta.limitPrice,
      stopPrice: meta.stopPrice,
      orderId: meta.orderId,
      clientOrderId: meta.clientOrderId,
    });
    s.addBalanceHistory({
      time: now,
      type: "margin_lock",
      amount: -margin,
      balanceAfter,
      note: `Margin locked · open ${posSide}`,
      symbol,
    });
    return;
  }

  if (existing.side === posSide) {
    const margin = marginFor(qty, price);
    if (s.mockBalance < margin) return;
    const newQty = existing.qty + qty;
    const newEntry = (existing.entry * existing.qty + price * qty) / newQty;
    const balanceAfter = s.mockBalance - margin;
    s.setMockBalance(balanceAfter);
    s.updatePosition(existing.id, {
      qty: newQty,
      entry: newEntry,
      liq: liquidationPrice({
        side: existing.side,
        entry: newEntry,
        leverage: existing.leverage,
      }),
    });
    recordFilledOrder(symbol, side, qty, price, orderType, {
      leverage,
      margin,
      limitPrice: meta.limitPrice,
      stopPrice: meta.stopPrice,
      orderId: meta.orderId,
      clientOrderId: meta.clientOrderId,
    });
    s.addBalanceHistory({
      time: now,
      type: "margin_lock",
      amount: -margin,
      balanceAfter,
      note: `Margin locked · add to ${posSide}`,
      symbol,
    });
    return;
  }

  const closed = Math.min(qty, existing.qty);
  const pnl =
    existing.side === "long"
      ? (price - existing.entry) * closed
      : (existing.entry - price) * closed;
  const released = marginFor(closed, existing.entry);
  const afterRelease = s.mockBalance + released;
  const balanceAfter = afterRelease + pnl;
  s.setMockBalance(balanceAfter);
  s.setMockRealized(s.mockRealized + pnl);

  recordFilledOrder(symbol, side, closed, price, orderType, {
    leverage: existing.leverage,
    margin: released,
    limitPrice: meta.limitPrice,
    stopPrice: meta.stopPrice,
    orderId: meta.orderId,
    clientOrderId: meta.clientOrderId,
  });
  s.addBalanceHistory({
    time: now,
    type: "margin_release",
    amount: released,
    balanceAfter: afterRelease,
    note: `Margin released · close ${existing.side}`,
    symbol,
  });
  s.addBalanceHistory({
    time: now,
    type: "realized_pnl",
    amount: pnl,
    balanceAfter,
    note: `Close ${existing.side} position for symbol ${symbol} at price ${price} for ${closed} units. Position AVG Price was ${existing.entry}, currency: USD, leverage: ${existing.leverage}x`,
    symbol,
  });
  s.addJournalEntry({
    time: now,
    text: `Close ${existing.side} position for symbol ${symbol} at price ${price} for ${closed} units. Position AVG Price was ${existing.entry}`,
  });

  if (qty < existing.qty) {
    s.updatePosition(existing.id, { qty: existing.qty - qty });
    return;
  }

  s.removePosition(existing.id);
  const leftover = qty - existing.qty;
  if (leftover > 0) {
    applyFill(symbol, side, price, leftover, {
      orderType,
      reason: "flip",
    });
  }
}
