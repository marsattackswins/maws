import { liveApi, LiveApiError, LiveAuthError } from "@/lib/live/api";
import { redirectToLogin } from "@/lib/live/bridge";
import { useLiveStore } from "@/lib/live/store";
import { mawsFeed } from "@/lib/maws/feed";
import { useAppStore } from "@/lib/store";
import {
  cancelOrder as mockCancelOrder,
  closePosition as mockClosePosition,
  submitOrder as mockSubmitOrder,
} from "@/lib/trading/mock";
import type { UiOrderInput } from "./ui-orders";

/**
 * Broker dispatch boundary. Existing UI call sites keep their signatures;
 * dispatch routes the action to the paper engine or to the authenticated
 * server routes depending on the connected broker.
 */

export function activeBrokerId(): "mock" | "binance" {
  return useAppStore.getState().connectedBroker === "binance" ? "binance" : "mock";
}

function notifyLiveError(text: string): void {
  useLiveStore.getState().notify("error", text);
}

function describe(err: unknown): string {
  if (err instanceof LiveApiError) return err.message;
  if (err instanceof LiveAuthError) return "Session expired; sign in again";
  return String(err);
}

/**
 * Dispatch-level execution gate: mirrors the server's submission gates so a
 * halted/frozen/kill-switched system never reaches the broker from the UI.
 * Null health (no live session, e.g. paper trading) never blocks.
 */
export function tradingHaltReason(): string | null {
  const liveState = useLiveStore.getState();
  if (liveState.phase === "switching") return "profile_switch_in_progress";
  if (liveState.phase === "degraded" || liveState.phase === "failed" || liveState.phase === "detached") {
    return liveState.reasonCode ?? "profile_runtime_unavailable";
  }
  if (useAppStore.getState().connectedBroker === "binance" && liveState.profileId !== null && (!liveState.ready || liveState.phase !== "ready")) {
    return liveState.reasonCode ?? "profile_runtime_unavailable";
  }
  const { health } = liveState;
  if (!health) return null;
  const ex = health.execution;
  if (ex.killSwitch) return "kill switch engaged";
  if (ex.frozen) return ex.frozenReason || "execution frozen";
  if (!ex.canSubmit) return ex.reasons[0] || "execution not allowed";
  if (health.submissionsFrozen) return health.frozenReasons[0] || "submissions frozen";
  return null;
}

export async function dispatchSubmitOrder(input: UiOrderInput): Promise<{ ok: boolean; error?: string }> {
  const state = useAppStore.getState();
  const pane = state.panes.find((p) => p.id === state.activePaneId);
  const tf = pane?.timeframe ?? "1D";
  const feedStatus = mawsFeed.getKlineStatus(input.symbol, tf);
  if (feedStatus !== "live") {
    notifyLiveError(`Trading halted: market data ${feedStatus}`);
    return { ok: false, error: `feed_${feedStatus}` };
  }

  const halt = tradingHaltReason();
  if (halt !== null) {
    notifyLiveError(`Trading halted: ${halt}`);
    return { ok: false, error: "trading_halted" };
  }

  if (activeBrokerId() !== "binance") {
    mockSubmitOrder(input);
    return { ok: true };
  }
  try {
    const type = input.type === "limit" ? "LIMIT" : input.type === "stop" ? "STOP_MARKET" : "MARKET";
    const res = await liveApi.submitOrder({
      symbol: input.symbol,
      side: input.side === "buy" ? "BUY" : "SELL",
      type: type as "MARKET" | "LIMIT" | "STOP_MARKET",
      qty: String(input.qty),
      price: input.type === "limit" && input.price != null ? String(input.price) : undefined,
      stopPrice: input.type === "stop" && input.price != null ? String(input.price) : undefined,
      clientOrderId: input.clientOrderId,
    });
    if (!res.ok) {
      notifyLiveError(res.error ?? "Order rejected");
      return { ok: false, error: res.error };
    }
    return { ok: true };
  } catch (err) {
    if (err instanceof LiveAuthError) {
      redirectToLogin();
      return { ok: false, error: "unauthenticated" };
    }
    notifyLiveError(describe(err));
    return { ok: false, error: describe(err) };
  }
}

export async function dispatchCancelOrder(id: string): Promise<{ ok: boolean; error?: string }> {
  const halt = tradingHaltReason();
  if (halt !== null && activeBrokerId() === "binance") {
    notifyLiveError(`Trading halted: ${halt}`);
    return { ok: false, error: "trading_halted" };
  }
  if (activeBrokerId() !== "binance") {
    mockCancelOrder(id);
    return { ok: true };
  }
  const order = useLiveStore.getState().orders.find((o) => o.id === id);
  if (!order) return { ok: false, error: "Order not found" };
  try {
    const res = await liveApi.cancelOrder(id, order.symbol);
    if (!res.ok) {
      notifyLiveError(res.error ?? "Cancel rejected");
      return { ok: false, error: res.error };
    }
    return { ok: true };
  } catch (err) {
    notifyLiveError(describe(err));
    return { ok: false, error: describe(err) };
  }
}

/** Live positions are keyed by symbol (one-way mode); paper positions by id. */
export async function dispatchClosePosition(idOrSymbol: string): Promise<{ ok: boolean; error?: string }> {
  if (activeBrokerId() !== "binance") {
    mockClosePosition(idOrSymbol);
    return { ok: true };
  }
  try {
    const res = await liveApi.closePosition(idOrSymbol);
    if (!res.ok) {
      notifyLiveError(res.error ?? "Close rejected");
      return { ok: false, error: res.error };
    }
    return { ok: true };
  } catch (err) {
    notifyLiveError(describe(err));
    return { ok: false, error: describe(err) };
  }
}

export async function dispatchProtect(
  symbol: string,
  tpPrice?: number | null,
  slPrice?: number | null,
): Promise<{ ok: boolean; error?: string }> {
  const halt = tradingHaltReason();
  if (halt !== null && activeBrokerId() === "binance") {
    notifyLiveError(`Trading halted: ${halt}`);
    return { ok: false, error: "trading_halted" };
  }
  if (activeBrokerId() !== "binance") return { ok: true };
  try {
    const res = await liveApi.protect({
      symbol,
      tpPrice: tpPrice != null ? String(tpPrice) : undefined,
      slPrice: slPrice != null ? String(slPrice) : undefined,
    });
    const failed = (res.tp && !res.tp.ok) || (res.sl && !res.sl.ok);
    if (failed) {
      const msg = res.tp?.error ?? res.sl?.error ?? "Protective order rejected";
      notifyLiveError(msg);
      return { ok: false, error: msg };
    }
    return { ok: true };
  } catch (err) {
    notifyLiveError(describe(err));
    return { ok: false, error: describe(err) };
  }
}
