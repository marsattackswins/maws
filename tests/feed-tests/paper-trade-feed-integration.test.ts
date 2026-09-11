import { describe, it, expect, beforeAll, beforeEach, afterAll, jest } from '@jest/globals';
import { binanceFuturesFeed as feed } from '../../lib/market/binance-feed';
import { useAppStore } from '../../lib/store';
import { connectMock, submitOrder, tickMock } from '../../lib/trading/mock';
import { DEFAULT_SYMBOL_TRADING } from '../../types';

/**
 * Headless integration proof: REAL BinanceFuturesFeed (fake WebSocket seam)
 * + REAL Zustand store + REAL paper-trading engine, wired exactly like
 * production MockBrokerLoop (subscribeTradeQuotes → tickMock).
 *
 * Proves:
 *   - a TP/SL breach that occurs and REVERSES inside the ~150ms UI quote
 *     batch is still detected by the paper-trading engine;
 *   - UI/chart/watchlist batching is preserved;
 *   - duplicate/replayed feed events still cannot double-fill or
 *     double-close (engine idempotency intact at the feed seam).
 */

class FakeWebSocket {
  static instances: FakeWebSocket[] = [];
  url: string;
  onopen: ((ev?: unknown) => void) | null = null;
  onmessage: ((ev: { data: string }) => void) | null = null;
  onclose: ((ev?: unknown) => void) | null = null;
  onerror: ((ev?: unknown) => void) | null = null;

  constructor(url: string) {
    this.url = url;
    FakeWebSocket.instances.push(this);
  }

  close() {}

  open() {
    this.onopen?.();
  }

  message(data: unknown) {
    this.onmessage?.({ data: typeof data === 'string' ? data : JSON.stringify(data) });
  }

  static last(): FakeWebSocket {
    return FakeWebSocket.instances[FakeWebSocket.instances.length - 1];
  }
}

const START_BALANCE = 100_000;

function mini(symbol: string, last: number, eventTime?: number) {
  return {
    e: '24hrMiniTicker',
    s: symbol,
    E: eventTime,
    c: String(last),
    o: '100',
    h: String(Math.max(100, last)),
    l: String(Math.min(100, last)),
    v: '10',
    q: '1',
  };
}

function resetPaperStore() {
  useAppStore.setState({
    connectedBroker: null,
    brokerDialogOpen: false,
    orders: [],
    positions: [],
    orderHistory: [],
    balanceHistory: [],
    journal: [],
    mockBalance: START_BALANCE,
    mockRealized: 0,
    symbolTrading: {},
  });
}

let unsubEngine: (() => void) | null = null;

beforeAll(() => {
  (globalThis as { window?: unknown }).window = globalThis;
  (globalThis as { WebSocket?: unknown }).WebSocket = FakeWebSocket;
  (globalThis as { fetch?: unknown }).fetch = async () => ({ ok: false }) as Response;
  jest.useFakeTimers();
  feed.start();
  // Same wiring as production MockBrokerLoop: the engine listens on the
  // IMMEDIATE trade channel, not the debounced UI channel.
  unsubEngine = feed.subscribeTradeQuotes((map) => {
    tickMock(map.values());
  });
});

afterAll(() => {
  unsubEngine?.();
  feed.setHotSymbols([]);
  feed.stop();
  jest.useRealTimers();
});

beforeEach(() => {
  resetPaperStore();
  connectMock();
  useAppStore.getState().setSymbolTrading('LIVEUSDT', {
    ...DEFAULT_SYMBOL_TRADING,
    attachBrackets: false,
    leverage: 5,
  });
  useAppStore.getState().setSymbolTrading('REPLUSDT', {
    ...DEFAULT_SYMBOL_TRADING,
    attachBrackets: false,
    leverage: 5,
  });
});

function hotQuoteSocket(symbol: string): FakeWebSocket {
  feed.setHotSymbols([symbol]);
  const qws = FakeWebSocket.last();
  qws.open();
  return qws;
}

describe('paper-trade engine on the immediate feed channel', () => {
  it('detects a TP breach that reverses INSIDE the 150ms UI batch window', () => {
    const qws = hotQuoteSocket('LIVEUSDT');

    // Seed market price 100 through the real feed, then enter long.
    qws.message(mini('LIVEUSDT', 100, 1));
    expect(feed.getQuote('LIVEUSDT').last).toBe(100);
    submitOrder({ symbol: 'LIVEUSDT', side: 'buy', type: 'market', price: 0, qty: 10 });

    let s = useAppStore.getState();
    expect(s.positions).toHaveLength(1);
    expect(s.positions[0].entry).toBe(100);
    expect(s.mockBalance).toBeCloseTo(START_BALANCE - 200, 8); // margin 10*100/5
    const posId = s.positions[0].id;
    useAppStore.getState().updatePosition(posId, { tp: 110 });

    // Watch the UI-batched channel: it must NOT have fired during the spike.
    let uiEmissions = 0;
    const unsubUi = feed.subscribeQuotes(() => {
      uiEmissions += 1;
    });
    const uiBase = uiEmissions;

    // Spike through TP and reverse — no timers advanced in between, so the
    // whole excursion happens inside one UI debounce window.
    qws.message(mini('LIVEUSDT', 112, 2)); // breach → engine evaluates at once
    qws.message(mini('LIVEUSDT', 101, 3)); // reversal
    expect(uiEmissions).toBe(uiBase); // UI batch still pending

    // The engine already closed at the TP level despite the reversal.
    s = useAppStore.getState();
    expect(s.positions).toHaveLength(0);
    expect(s.mockRealized).toBeCloseTo(100, 8); // (110-100)*10
    expect(s.mockBalance).toBeCloseTo(START_BALANCE + 100, 8); // -200 +200 +100
    expect(s.orderHistory.filter((h) => h.status === 'filled')).toHaveLength(2);
    expect(s.orderHistory[0]).toMatchObject({ price: 110, type: 'market' });

    // UI batching is preserved: one catch-up emission after the debounce.
    jest.advanceTimersByTime(150);
    expect(uiEmissions).toBe(uiBase + 1);

    unsubUi();
    feed.setHotSymbols([]);
  });

  it('SL breach reversing inside the batch window is also detected', () => {
    const qws = hotQuoteSocket('LIVEUSDT');
    qws.message(mini('LIVEUSDT', 100, 1));
    submitOrder({ symbol: 'LIVEUSDT', side: 'buy', type: 'market', price: 0, qty: 10 });
    const posId = useAppStore.getState().positions[0].id;
    useAppStore.getState().updatePosition(posId, { sl: 90 });

    qws.message(mini('LIVEUSDT', 89, 2)); // breach SL
    qws.message(mini('LIVEUSDT', 99, 3)); // immediate recovery

    const s = useAppStore.getState();
    expect(s.positions).toHaveLength(0);
    expect(s.mockRealized).toBeCloseTo(-100, 8); // (90-100)*10 at the SL level
    expect(s.mockBalance).toBeCloseTo(START_BALANCE - 100, 8);

    feed.setHotSymbols([]);
  });

  it('duplicated/replayed feed events cannot double-fill or double-close', () => {
    const qws = hotQuoteSocket('REPLUSDT');
    qws.message(mini('REPLUSDT', 100, 1));

    // Resting buy limit; the filling price is replayed three times
    // (duplicate value + exact event-time redelivery).
    submitOrder({ symbol: 'REPLUSDT', side: 'buy', type: 'limit', price: 95, qty: 4 });
    qws.message(mini('REPLUSDT', 95, 2));
    qws.message(mini('REPLUSDT', 95, 3)); // same value, newer event
    qws.message(mini('REPLUSDT', 95, 3)); // exact event-time replay

    let s = useAppStore.getState();
    expect(s.orders).toHaveLength(0);
    expect(s.positions).toHaveLength(1);
    expect(s.positions[0].qty).toBe(4); // ONE fill, not three
    expect(s.orderHistory.filter((h) => h.status === 'filled')).toHaveLength(1);
    // margin locked exactly once: 4*95/5 = 76
    expect(s.mockBalance).toBeCloseTo(START_BALANCE - 76, 8);
    const ledgerAfterFill = s.balanceHistory.length;
    const balanceAfterFill = s.mockBalance;

    // Attach TP and replay the closing breach several times.
    useAppStore.getState().updatePosition(s.positions[0].id, { tp: 110 });
    qws.message(mini('REPLUSDT', 112, 4)); // closes at 110
    qws.message(mini('REPLUSDT', 112, 5)); // replayed breach
    qws.message(mini('REPLUSDT', 113, 6)); // still above TP, no position
    qws.message(mini('REPLUSDT', 112, 4)); // stale event-time replay → dropped

    s = useAppStore.getState();
    expect(s.positions).toHaveLength(0);
    expect(s.orderHistory.filter((h) => h.status === 'filled')).toHaveLength(2); // ONE close
    expect(s.mockRealized).toBeCloseTo(60, 8); // (110-95)*4
    expect(s.mockBalance).toBeCloseTo(balanceAfterFill + 76 + 60, 8);
    // Ledger grew by exactly the close's two entries (release + realized).
    expect(s.balanceHistory.length).toBe(ledgerAfterFill + 2);
    // Invariant: with no open positions, balance == start + realized.
    expect(s.mockBalance).toBeCloseTo(START_BALANCE + s.mockRealized, 8);

    feed.setHotSymbols([]);
  });
});
