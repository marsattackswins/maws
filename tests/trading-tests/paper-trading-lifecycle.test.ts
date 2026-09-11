import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { useAppStore } from '../../lib/store';
import {
  connectMock,
  submitOrder,
  tickMock,
  positionPnl,
  usedMargin,
} from '../../lib/trading/mock';
import { mawsFeed } from '../../lib/maws/feed';
import { DEFAULT_SYMBOL_TRADING, type Quote } from '../../types';

/**
 * Headless lifecycle test against the REAL production paper-trading engine:
 * real Zustand store (lib/store.ts) + real reducer functions (lib/trading/mock.ts).
 * Nothing in the trading path is mocked.
 *
 * Chain under test:
 *   pending order → normalized tick → single fill → open position →
 *   margin/P&L update → TP/SL/liq close → realized P&L + released margin.
 *
 * The only seam is market data: `mawsFeed.getQuote` is stubbed so the engine
 * sees a deterministic last price (in production this comes from the Binance
 * feed). Ticks are delivered through `tickMock` exactly as MockBrokerLoop does
 * with `mawsFeed.subscribeQuotes(map => tickMock(map.values()))`.
 */

const SYMBOL = 'TESTUSDT';
const START_BALANCE = 100_000;

/**
 * Normalizes a raw Binance-style miniTicker payload into a Quote the same way
 * the production feed does (numeric coercion + finite/positive guards, see
 * BinanceFuturesFeed.applyMiniTicker). Production keeps that method private,
 * so the test mirrors its contract at the boundary.
 */
function normalizeRawTick(raw: { s: string; c: string; o: string }): Quote {
  const last = Number(raw.c);
  const open = Number(raw.o);
  if (!Number.isFinite(last) || last <= 0) {
    throw new Error(`invalid tick payload for ${raw.s}`);
  }
  return {
    symbol: raw.s,
    last,
    open: Number.isFinite(open) && open > 0 ? open : 0,
    high: last,
    low: last,
    volume: 0,
    change: open > 0 ? last - open : 0,
    changePct: open > 0 ? ((last - open) / open) * 100 : 0,
    rsi: null,
    atr: null,
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

let quoteSpy: jest.SpiedFunction<typeof mawsFeed.getQuote>;

beforeEach(() => {
  resetPaperStore();
  // Deterministic market price for submitOrder/closePosition lookups.
  quoteSpy = jest.spyOn(mawsFeed, 'getQuote').mockImplementation((symbol: string) => ({
    symbol,
    last: 100,
    open: 100,
    high: 100,
    low: 100,
    volume: 0,
    change: 0,
    changePct: 0,
    rsi: null,
    atr: null,
  }));
  connectMock();
  // Explicit control of brackets and leverage for deterministic arithmetic.
  useAppStore.getState().setSymbolTrading(SYMBOL, {
    ...DEFAULT_SYMBOL_TRADING,
    attachBrackets: false,
    leverage: 5,
  });
});

afterEach(() => {
  quoteSpy.mockRestore();
});

describe('paper trading lifecycle (real production store + reducer)', () => {
  it('walks pending order → tick fill → position → margin/P&L → TP close → realized P&L', () => {
    // 1. Pending order: buy limit below market (market last = 100).
    submitOrder({ symbol: SYMBOL, side: 'buy', type: 'limit', price: 95, qty: 10 });
    let s = useAppStore.getState();
    expect(s.orders).toHaveLength(1);
    expect(s.orders[0]).toMatchObject({ symbol: SYMBOL, side: 'buy', type: 'limit', price: 95, qty: 10 });
    expect(s.positions).toHaveLength(0);
    expect(s.mockBalance).toBe(START_BALANCE);

    // 2. Normalized tick reaches the limit → single fill, no duplicate.
    tickMock([normalizeRawTick({ s: SYMBOL, c: '95', o: '100' })]);
    s = useAppStore.getState();
    expect(s.orders).toHaveLength(0);
    expect(s.positions).toHaveLength(1);
    const pos = s.positions[0];
    expect(pos).toMatchObject({ symbol: SYMBOL, side: 'long', entry: 95, qty: 10, leverage: 5 });
    // margin = qty * entry / leverage = 10 * 95 / 5 = 190
    expect(usedMargin(s.positions)).toBeCloseTo(190, 10);
    expect(s.mockBalance).toBeCloseTo(START_BALANCE - 190, 10);
    expect(s.orderHistory.filter((h) => h.status === 'filled')).toHaveLength(1);
    expect(s.orderHistory[0]).toMatchObject({ fillPrice: 95, margin: 190, status: 'filled' });
    expect(s.balanceHistory.filter((b) => b.type === 'margin_lock')).toHaveLength(1);

    // Replaying the same tick must not fill again.
    tickMock([normalizeRawTick({ s: SYMBOL, c: '95', o: '100' })]);
    s = useAppStore.getState();
    expect(s.positions).toHaveLength(1);
    expect(s.orderHistory.filter((h) => h.status === 'filled')).toHaveLength(1);
    expect(s.mockBalance).toBeCloseTo(START_BALANCE - 190, 10);

    // 3. Margin/P&L update at a higher mark.
    expect(positionPnl(s.positions[0], 100)).toBeCloseTo(50, 10); // (100-95)*10

    // 4. Attach explicit TP/SL through the production update action.
    useAppStore.getState().updatePosition(s.positions[0].id, { tp: 110, sl: 90 });

    // Tick between SL and TP → nothing happens.
    tickMock([normalizeRawTick({ s: SYMBOL, c: '105', o: '100' })]);
    s = useAppStore.getState();
    expect(s.positions).toHaveLength(1);
    expect(s.mockBalance).toBeCloseTo(START_BALANCE - 190, 10);

    // 5. Tick through TP → close AT THE TP LEVEL (110), not the tick price.
    tickMock([normalizeRawTick({ s: SYMBOL, c: '111', o: '100' })]);
    s = useAppStore.getState();
    expect(s.positions).toHaveLength(0);
    // realized P&L = (110 - 95) * 10 = 150
    expect(s.mockRealized).toBeCloseTo(150, 10);
    // margin released: start - 190 + 190 + 150
    expect(s.mockBalance).toBeCloseTo(START_BALANCE + 150, 10);
    expect(s.orderHistory.filter((h) => h.status === 'filled')).toHaveLength(2);
    expect(s.orderHistory[0]).toMatchObject({ price: 110, type: 'market', status: 'filled' });
    const releases = s.balanceHistory.filter((b) => b.type === 'margin_release');
    const realized = s.balanceHistory.filter((b) => b.type === 'realized_pnl');
    expect(releases).toHaveLength(1);
    expect(releases[0].amount).toBeCloseTo(190, 10);
    expect(realized).toHaveLength(1);
    expect(realized[0].amount).toBeCloseTo(150, 10);
    // Invariant: with no open positions, balance == start + realized P&L.
    expect(s.mockBalance).toBeCloseTo(START_BALANCE + s.mockRealized, 10);
  });

  it('closes at the SL level when the tick breaches SL', () => {
    submitOrder({ symbol: SYMBOL, side: 'buy', type: 'market', price: 0, qty: 10 });
    let s = useAppStore.getState();
    expect(s.positions).toHaveLength(1);
    // Market order fills at feed last = 100; margin = 10*100/5 = 200.
    expect(s.positions[0].entry).toBe(100);
    expect(s.mockBalance).toBeCloseTo(START_BALANCE - 200, 10);

    useAppStore.getState().updatePosition(s.positions[0].id, { sl: 90 });

    tickMock([normalizeRawTick({ s: SYMBOL, c: '89', o: '100' })]);
    s = useAppStore.getState();
    expect(s.positions).toHaveLength(0);
    // Fills at the SL level 90: pnl = (90 - 100) * 10 = -100.
    expect(s.mockRealized).toBeCloseTo(-100, 10);
    expect(s.mockBalance).toBeCloseTo(START_BALANCE - 100, 10);
    expect(s.orderHistory[0]).toMatchObject({ price: 90, status: 'filled' });
  });

  it('closes at the liquidation price when the tick breaches liq (liq outranks sl)', () => {
    submitOrder({ symbol: SYMBOL, side: 'buy', type: 'market', price: 0, qty: 10 });
    let s = useAppStore.getState();
    const posId = s.positions[0].id;
    // liq for long lev 5 @100 = 100 * (1 - 0.9/5) = 82.
    expect(s.positions[0].liq).toBeCloseTo(82, 10);
    useAppStore.getState().updatePosition(posId, { sl: 90 });

    // One tick breaches BOTH sl (90) and liq (82) → liquidation wins, fill at 82.
    tickMock([normalizeRawTick({ s: SYMBOL, c: '81', o: '100' })]);
    s = useAppStore.getState();
    expect(s.positions).toHaveLength(0);
    expect(s.mockRealized).toBeCloseTo((82 - 100) * 10, 10); // -180
    expect(s.mockBalance).toBeCloseTo(START_BALANCE - 180, 10);
    expect(s.orderHistory[0]).toMatchObject({ price: 82, status: 'filled' });
  });
});
