/**
 * Dispatch-level execution gate (lib/trading/dispatch.ts).
 *
 * When the live health payload reports that execution is not allowed
 * (kill switch, frozen, gates off, open circuit breakers), the dispatcher
 * must NOT reach the broker and must surface a "Trading halted: <reason>"
 * notice. Healthy health — and no live session at all (paper trading) —
 * must never block. The feed-not-live gate and business-error paths are
 * covered by their own suites; here only the execution gate is exercised.
 */

import { describe, test, expect, jest, beforeEach } from "@jest/globals";

// The feed gate must pass so the execution gate is what gets exercised.
// getQuote/getCandles keep the real paper engine (mock.ts) working in the
// paper-path control test.
jest.mock("@/lib/maws/feed", () => ({
  mawsFeed: {
    getKlineStatus: jest.fn(() => "live" as const),
    getQuote: jest.fn(() => ({
      symbol: "BTCUSDT",
      last: 50_000,
      open: 50_000,
      high: 50_000,
      low: 50_000,
      volume: 0,
      change: 0,
      changePct: 0,
      rsi: null,
      atr: null,
    })),
    getCandles: jest.fn(() => []),
  },
  binanceFuturesFeed: {},
  normalizeAppSymbol: (s: string) => s,
  formatPrice: (_symbol: string, value: number) => String(value),
  formatVolume: (value: number) => String(value),
}));

// The broker boundary must be observable: was the broker reached or not?
jest.mock("@/lib/live/api", () => ({
  LiveAuthError: class LiveAuthError extends Error {},
  LiveApiError: class LiveApiError extends Error {
    constructor(
      public readonly code: string,
      message: string,
      public readonly status: number,
    ) {
      super(message);
      this.name = "LiveApiError";
    }
  },
  setCsrf: jest.fn(),
  liveApi: {
    submitOrder: jest.fn(),
  },
}));

import { dispatchSubmitOrder } from "@/lib/trading/dispatch";
import { liveApi } from "@/lib/live/api";
import { useLiveStore } from "@/lib/live/store";
import { useAppStore } from "@/lib/store";
import { mawsFeed } from "@/lib/maws/feed";
import type { HealthDto } from "@/lib/live/types";

const submitOrderMock = jest.mocked(liveApi.submitOrder);
const klineStatusMock = jest.mocked(mawsFeed.getKlineStatus);

function makeHealth(over: Partial<HealthDto> = {}): HealthDto {
  return {
    env: "testnet",
    brokerConnected: true,
    execution: {
      env: "testnet",
      envAllowsSubmissions: true,
      staticGate: true,
      runtimeEnabled: true,
      killSwitch: false,
      frozen: false,
      frozenReason: "",
      canSubmit: true,
      reasons: [],
    },
    clockHealthy: true,
    streamHealthy: true,
    reconHealthy: true,
    submissionsFrozen: false,
    frozenReasons: [],
    healthy: true,
    signals: {
      brokerStatus: "ready",
      brokerError: null,
      stream: { connected: true, reconnects: 0, lastEventAt: Date.now() },
      clock: { offsetMs: 10, updatedAt: Date.now() },
      recon: { lastRunAt: Date.now(), lastResult: "clean" },
    },
    ...over,
  };
}

const INPUT = {
  symbol: "BTCUSDT",
  side: "buy" as const,
  type: "market" as const,
  price: 0,
  qty: 0.001,
  clientOrderId: "gate-test-1",
};

function lastNotice(): { id: number; tone: string; text: string } | undefined {
  const notices = useLiveStore.getState().notices;
  return notices[notices.length - 1];
}

function expectHaltedToast(text: string): void {
  const n = lastNotice();
  expect(n?.tone).toBe("error");
  expect(n?.text).toBe(text);
}

describe("dispatchSubmitOrder execution gate (live broker)", () => {
  beforeEach(() => {
    submitOrderMock.mockReset();
    klineStatusMock.mockReturnValue("live");
    useAppStore.setState({ connectedBroker: "binance" });
    useLiveStore.setState({ health: null, notices: [] });
  });

  test("kill switch engaged: broker not called, toast names the kill switch", async () => {
    useLiveStore.setState({
      health: makeHealth({
        execution: {
          env: "testnet",
          envAllowsSubmissions: true,
          staticGate: true,
          runtimeEnabled: true,
          killSwitch: true,
          frozen: false,
          frozenReason: "",
          canSubmit: false,
          reasons: ["kill switch engaged"],
        },
      }),
    });

    const res = await dispatchSubmitOrder(INPUT);

    expect(res).toEqual({ ok: false, error: "trading_halted" });
    expect(submitOrderMock).not.toHaveBeenCalled();
    expectHaltedToast("Trading halted: kill switch engaged");
  });

  test("frozen with a reason: broker not called, toast carries the reason", async () => {
    useLiveStore.setState({
      health: makeHealth({
        execution: {
          env: "testnet",
          envAllowsSubmissions: true,
          staticGate: true,
          runtimeEnabled: true,
          killSwitch: false,
          frozen: true,
          frozenReason: "reconciliation drift detected",
          canSubmit: false,
          reasons: ["reconciliation drift detected"],
        },
      }),
    });

    const res = await dispatchSubmitOrder(INPUT);

    expect(res).toEqual({ ok: false, error: "trading_halted" });
    expect(submitOrderMock).not.toHaveBeenCalled();
    expectHaltedToast("Trading halted: reconciliation drift detected");
  });

  test("execution not allowed (gates off): broker not called, toast names the reason", async () => {
    useLiveStore.setState({
      health: makeHealth({
        execution: {
          env: "testnet",
          envAllowsSubmissions: true,
          staticGate: true,
          runtimeEnabled: false,
          killSwitch: false,
          frozen: false,
          frozenReason: "",
          canSubmit: false,
          reasons: ["runtime execution flag is disabled"],
        },
      }),
    });

    const res = await dispatchSubmitOrder(INPUT);

    expect(res).toEqual({ ok: false, error: "trading_halted" });
    expect(submitOrderMock).not.toHaveBeenCalled();
    expectHaltedToast("Trading halted: runtime execution flag is disabled");
  });

  test("submissions frozen (e.g. open circuit breakers): broker not called", async () => {
    useLiveStore.setState({
      health: makeHealth({
        submissionsFrozen: true,
        frozenReasons: ["Circuit breakers open: binance-rest"],
      }),
    });

    const res = await dispatchSubmitOrder(INPUT);

    expect(res).toEqual({ ok: false, error: "trading_halted" });
    expect(submitOrderMock).not.toHaveBeenCalled();
    expectHaltedToast("Trading halted: Circuit breakers open: binance-rest");
  });

  test("healthy health: order is dispatched to the broker", async () => {
    useLiveStore.setState({ health: makeHealth() });
    submitOrderMock.mockResolvedValue({ ok: true, clientOrderId: INPUT.clientOrderId });

    const res = await dispatchSubmitOrder(INPUT);

    expect(res).toEqual({ ok: true });
    expect(submitOrderMock).toHaveBeenCalledTimes(1);
    expect(submitOrderMock.mock.calls[0][0]).toMatchObject({
      symbol: "BTCUSDT",
      side: "BUY",
      type: "MARKET",
      qty: "0.001",
      clientOrderId: INPUT.clientOrderId,
    });
    expect(lastNotice()).toBeUndefined();
  });

  test("no live session (null health): gate never blocks a live submission", async () => {
    useLiveStore.setState({ health: null });
    submitOrderMock.mockResolvedValue({ ok: true, clientOrderId: INPUT.clientOrderId });

    const res = await dispatchSubmitOrder(INPUT);

    expect(res).toEqual({ ok: true });
    expect(submitOrderMock).toHaveBeenCalledTimes(1);
  });

  test("paper trading path: unaffected by the live gate and never hits the broker", async () => {
    useAppStore.setState({ connectedBroker: "mock" });
    useLiveStore.setState({ health: null });

    const res = await dispatchSubmitOrder(INPUT);

    expect(res).toEqual({ ok: true });
    expect(submitOrderMock).not.toHaveBeenCalled();
  });
});
