import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { useAppStore } from '../../lib/store';
import {
  connectMock,
  disconnectBroker,
  requireMock,
  submitOrder,
  cancelOrder,
  closePosition,
  tickMock,
  positionPnl,
  usedMargin,
  ordersMargin,
  formatNum,
  formatUsd,
} from '../../lib/trading/mock';
import { mawsFeed } from '../../lib/maws/feed';
import { DEFAULT_SYMBOL_TRADING, type ChartOrder, type Quote } from '../../types';

/**
 * Headless tests for the remaining production paper-trading actions:
 * connect/disconnect guards, marketable limits, stop orders, cancellation,
 * manual closes, adding to positions, partial closes, flips, margin refusal,
 * bracket attachment, and the feed-fallback paths inside tickMock.
 * Real store + real reducer throughout; only the market quote is stubbed.
 */

const SYMBOL = 'ACTUSDT';
const START_BALANCE = 100_000;

function tick(symbol: string, last: number): Quote {
  return {
    symbol,
    last,
    open: 100,
    high: Math.max(100, last),
    low: Math.min(100, last),
    volume: 0,
    change: last - 100,
    changePct: ((last - 100) / 100) * 100,
    rsi: null,
    atr: null,
  };
}

function resetPaperStore() {
  useAppStore.setState({
    connectedBroker: null,
    brokerDialogOpen: false,
    bottomOpen: true,
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
  useAppStore.getState().setSymbolTrading(SYMBOL, {
    ...DEFAULT_SYMBOL_TRADING,
    attachBrackets: false,
    leverage: 5,
  });
});

afterEach(() => {
  quoteSpy.mockRestore();
});

describe('connection guards', () => {
  it('submitOrder without a connected broker opens the dialog and places nothing', () => {
    disconnectBroker();
    submitOrder({ symbol: SYMBOL, side: 'buy', type: 'market', price: 0, qty: 1 });
    const s = useAppStore.getState();
    expect(s.brokerDialogOpen).toBe(true);
    expect(s.orders).toHaveLength(0);
    expect(s.positions).toHaveLength(0);
  });

  it('requireMock reflects connection state', () => {
    expect(requireMock()).toBe(true);
    disconnectBroker();
    expect(requireMock()).toBe(false);
    expect(useAppStore.getState().brokerDialogOpen).toBe(true);
  });

  it('disconnectBroker clears the broker and closes the bottom panel', () => {
    disconnectBroker();
    const s = useAppStore.getState();
    expect(s.connectedBroker).toBeNull();
    expect(s.bottomOpen).toBe(false);
  });

  it('tickMock is inert while disconnected', () => {
    submitOrder({ symbol: SYMBOL, side: 'buy', type: 'market', price: 0, qty: 1 });
    disconnectBroker();
    useAppStore.getState().updatePosition(useAppStore.getState().positions[0].id, { tp: 99 });
    tickMock([tick(SYMBOL, 98)]);
    expect(useAppStore.getState().positions).toHaveLength(1); // untouched
  });
});

describe('order types and manual actions', () => {
  it('a marketable buy limit fills immediately at the feed price with limitPrice recorded', () => {
    submitOrder({ symbol: SYMBOL, side: 'buy', type: 'limit', price: 105, qty: 2 });
    const s = useAppStore.getState();
    expect(s.orders).toHaveLength(0);
    expect(s.positions).toHaveLength(1);
    expect(s.positions[0].entry).toBe(100); // fills at feed last, not limit
    expect(s.orderHistory[0]).toMatchObject({
      type: 'limit',
      status: 'filled',
      fillPrice: 100,
      limitPrice: 105,
    });
  });

  it('a resting stop order waits, then fills when the tick crosses the stop', () => {
    // Sell stop triggers when price falls to the stop level.
    submitOrder({ symbol: SYMBOL, side: 'sell', type: 'stop', price: 95, qty: 3 });
    let s = useAppStore.getState();
    expect(s.orders).toHaveLength(1);
    expect(s.positions).toHaveLength(0);

    tickMock([tick(SYMBOL, 96)]); // still above stop → resting
    s = useAppStore.getState();
    expect(s.orders).toHaveLength(1);

    tickMock([tick(SYMBOL, 94)]); // drops through stop → fills short
    s = useAppStore.getState();
    expect(s.orders).toHaveLength(0);
    expect(s.positions).toHaveLength(1);
    expect(s.positions[0].side).toBe('short');
    expect(s.orderHistory[0]).toMatchObject({ type: 'stop', status: 'filled', stopPrice: 95 });
  });

  it('cancelOrder removes the order and records a cancelled history entry', () => {
    submitOrder({ symbol: SYMBOL, side: 'buy', type: 'limit', price: 90, qty: 5 });
    const id = useAppStore.getState().orders[0].id;

    cancelOrder(id);
    let s = useAppStore.getState();
    expect(s.orders).toHaveLength(0);
    expect(s.orderHistory[0]).toMatchObject({
      status: 'cancelled',
      margin: (5 * 90) / 5,
      leverage: 5,
    });

    // Cancelling again (or a bogus id) is a no-op.
    cancelOrder(id);
    cancelOrder('nope');
    s = useAppStore.getState();
    expect(s.orderHistory.filter((h) => h.status === 'cancelled')).toHaveLength(1);
  });

  it('closePosition closes at the feed price; unknown ids are no-ops', () => {
    submitOrder({ symbol: SYMBOL, side: 'buy', type: 'market', price: 0, qty: 6 });
    const id = useAppStore.getState().positions[0].id;

    closePosition(id);
    let s = useAppStore.getState();
    expect(s.positions).toHaveLength(0);
    expect(s.mockRealized).toBeCloseTo(0, 8); // closed at entry 100
    expect(s.mockBalance).toBeCloseTo(START_BALANCE, 8);

    closePosition(id);
    closePosition('nope');
    s = useAppStore.getState();
    expect(s.orderHistory.filter((h) => h.status === 'filled')).toHaveLength(2); // open + one close
  });

  it('closePosition closes a short position by buying', () => {
    submitOrder({ symbol: SYMBOL, side: 'sell', type: 'market', price: 0, qty: 4 });
    expect(useAppStore.getState().positions[0].side).toBe('short');
    const id = useAppStore.getState().positions[0].id;

    closePosition(id);
    const s = useAppStore.getState();
    expect(s.positions).toHaveLength(0);
    expect(s.orderHistory[0]).toMatchObject({ side: 'buy', status: 'filled' });
  });
});

describe('position shaping: add, partial close, flip', () => {
  it('a same-side fill adds to the position with weighted entry and extra margin', () => {
    submitOrder({ symbol: SYMBOL, side: 'buy', type: 'market', price: 0, qty: 10 });
    submitOrder({ symbol: SYMBOL, side: 'buy', type: 'market', price: 0, qty: 5 });

    const s = useAppStore.getState();
    expect(s.positions).toHaveLength(1);
    expect(s.positions[0].qty).toBe(15);
    expect(s.positions[0].entry).toBeCloseTo(100, 8);
    // margin locked twice: 300 total
    expect(s.mockBalance).toBeCloseTo(START_BALANCE - 300, 8);
    expect(usedMargin(s.positions)).toBeCloseTo(300, 8);
    expect(s.balanceHistory.filter((b) => b.type === 'margin_lock')).toHaveLength(2);
  });

  it('an opposite fill smaller than the position partially closes it', () => {
    submitOrder({ symbol: SYMBOL, side: 'buy', type: 'market', price: 0, qty: 10 });
    quoteSpy.mockImplementation((symbol: string) => ({
      symbol, last: 110, open: 100, high: 110, low: 100, volume: 0,
      change: 10, changePct: 10, rsi: null, atr: null,
    }));
    submitOrder({ symbol: SYMBOL, side: 'sell', type: 'market', price: 0, qty: 4 });

    const s = useAppStore.getState();
    expect(s.positions).toHaveLength(1);
    expect(s.positions[0].qty).toBe(6);
    // realized: (110-100)*4 = 40; released margin: 4*100/5 = 80
    expect(s.mockRealized).toBeCloseTo(40, 8);
    expect(s.mockBalance).toBeCloseTo(START_BALANCE - 200 + 80 + 40, 8);
  });

  it('an opposite fill larger than the position closes it and flips the remainder', () => {
    submitOrder({ symbol: SYMBOL, side: 'buy', type: 'market', price: 0, qty: 10 });
    submitOrder({ symbol: SYMBOL, side: 'sell', type: 'market', price: 0, qty: 14 });

    const s = useAppStore.getState();
    expect(s.positions).toHaveLength(1);
    expect(s.positions[0].side).toBe('short');
    expect(s.positions[0].qty).toBe(4);
    // balance: start - 200 (open) + 200 (release) + 0 (pnl) - 80 (short margin)
    expect(s.mockBalance).toBeCloseTo(START_BALANCE - 80, 8);
    expect(s.orderHistory.filter((h) => h.status === 'filled')).toHaveLength(3);
  });

  it('refuses to open or add when balance cannot cover the margin', () => {
    useAppStore.setState({ mockBalance: 50 });
    submitOrder({ symbol: SYMBOL, side: 'buy', type: 'market', price: 0, qty: 10 }); // needs 200
    let s = useAppStore.getState();
    expect(s.positions).toHaveLength(0);
    expect(s.mockBalance).toBe(50);

    useAppStore.setState({ mockBalance: START_BALANCE });
    submitOrder({ symbol: SYMBOL, side: 'buy', type: 'market', price: 0, qty: 10 });
    useAppStore.setState({ mockBalance: 10 });
    submitOrder({ symbol: SYMBOL, side: 'buy', type: 'market', price: 0, qty: 10 }); // needs 200 more
    s = useAppStore.getState();
    expect(s.positions[0].qty).toBe(10); // add refused
    expect(s.mockBalance).toBe(10);
  });

  it('attaches TP/SL brackets from settings when enabled', () => {
    useAppStore.getState().setSymbolTrading(SYMBOL, {
      ...DEFAULT_SYMBOL_TRADING,
      attachBrackets: true,
      tpPercent: 2,
      slPercent: 1,
      leverage: 5,
    });
    submitOrder({ symbol: SYMBOL, side: 'buy', type: 'market', price: 0, qty: 1 });
    const pos = useAppStore.getState().positions[0];
    expect(pos.tp).toBeCloseTo(102, 8);
    expect(pos.sl).toBeCloseTo(99, 8);
  });
});

describe('tickMock feed fallback', () => {
  it('evaluates orders/positions against the feed quote when the batch lacks their symbol', () => {
    // Resting buy limit at 95 + long position whose sl will be set to 95.
    submitOrder({ symbol: SYMBOL, side: 'buy', type: 'limit', price: 95, qty: 2 });
    submitOrder({ symbol: SYMBOL, side: 'buy', type: 'market', price: 0, qty: 1 });
    const posId = useAppStore.getState().positions[0].id;
    useAppStore.getState().updatePosition(posId, { sl: 95 });

    // Market moves to 94 via the feed; the next batch only contains another
    // symbol, so the engine must fall back to mawsFeed quotes for ACTUSDT.
    quoteSpy.mockImplementation((symbol: string) => ({
      symbol, last: 94, open: 100, high: 100, low: 94, volume: 0,
      change: -6, changePct: -6, rsi: null, atr: null,
    }));
    tickMock([tick('OTHERUSDT', 50)]);

    const s = useAppStore.getState();
    expect(s.orders).toHaveLength(0); // limit became marketable at feed last 94
    expect(s.positions).toHaveLength(0); // sl breached at feed last 94
  });
});

describe('remaining branch coverage', () => {
  it('connectMock refunds a depleted paper account exactly once', () => {
    useAppStore.setState({ mockBalance: 0, balanceHistory: [] });
    connectMock();
    let s = useAppStore.getState();
    expect(s.mockBalance).toBe(100_000);
    expect(s.balanceHistory.filter((b) => b.type === 'deposit')).toHaveLength(1);

    connectMock(); // already funded → no second deposit
    s = useAppStore.getState();
    expect(s.balanceHistory.filter((b) => b.type === 'deposit')).toHaveLength(1);
  });

  it('submitOrder rejects zero/invalid quantities silently', () => {
    submitOrder({ symbol: SYMBOL, side: 'buy', type: 'market', price: 0, qty: 0 });
    submitOrder({ symbol: SYMBOL, side: 'buy', type: 'market', price: 0, qty: Number.NaN });
    const s = useAppStore.getState();
    expect(s.positions).toHaveLength(0);
    expect(s.orders).toHaveLength(0);
  });

  it('an instantly marketable buy stop fills on submission with stopPrice recorded', () => {
    // Buy stop triggers on a rise; with market at 100 a stop at 95 is already triggered.
    submitOrder({ symbol: SYMBOL, side: 'buy', type: 'stop', price: 95, qty: 2 });
    const s = useAppStore.getState();
    expect(s.orders).toHaveLength(0);
    expect(s.positions).toHaveLength(1);
    expect(s.orderHistory[0]).toMatchObject({ type: 'stop', status: 'filled', stopPrice: 95 });
  });

  it('cancelOrder records stopPrice when cancelling a stop order', () => {
    submitOrder({ symbol: SYMBOL, side: 'sell', type: 'stop', price: 95, qty: 1 });
    const id = useAppStore.getState().orders[0].id;
    cancelOrder(id);
    const s = useAppStore.getState();
    expect(s.orderHistory[0]).toMatchObject({
      type: 'stop',
      status: 'cancelled',
      limitPrice: null,
      stopPrice: 95,
    });
  });

  it('a short position is closed by a rising tick through its SL (buy-to-close)', () => {
    submitOrder({ symbol: SYMBOL, side: 'sell', type: 'market', price: 0, qty: 3 });
    const id = useAppStore.getState().positions[0].id;
    useAppStore.getState().updatePosition(id, { sl: 105 });

    tickMock([tick(SYMBOL, 106)]);
    const s = useAppStore.getState();
    expect(s.positions).toHaveLength(0);
    expect(s.mockRealized).toBeCloseTo(-15, 8); // (100-105)*3
    expect(s.orderHistory[0]).toMatchObject({ side: 'buy', price: 105, status: 'filled' });
  });

  it('a market order seeded via the store fills on the next tick', () => {
    useAppStore.getState().addOrder({ symbol: SYMBOL, side: 'buy', type: 'market', price: 0, qty: 2 });
    tickMock([tick(SYMBOL, 100)]);
    const s = useAppStore.getState();
    expect(s.orders).toHaveLength(0);
    expect(s.positions).toHaveLength(1);
  });

  it('a resting sell limit above market fills when the tick rises to it', () => {
    submitOrder({ symbol: SYMBOL, side: 'sell', type: 'limit', price: 105, qty: 1 });
    expect(useAppStore.getState().orders).toHaveLength(1);
    tickMock([tick(SYMBOL, 105)]);
    const s = useAppStore.getState();
    expect(s.orders).toHaveLength(0);
    expect(s.positions[0].side).toBe('short');
  });

  it('a resting buy stop above market fills when the tick rises through it', () => {
    submitOrder({ symbol: SYMBOL, side: 'buy', type: 'stop', price: 105, qty: 1 });
    expect(useAppStore.getState().orders).toHaveLength(1);
    tickMock([tick(SYMBOL, 103)]); // below stop → rests
    expect(useAppStore.getState().orders).toHaveLength(1);
    tickMock([tick(SYMBOL, 106)]); // through stop → fills long
    const s = useAppStore.getState();
    expect(s.orders).toHaveLength(0);
    expect(s.positions[0].side).toBe('long');
  });

  it('a flip from a marketable limit inherits the limit order type (fillPrice fallback)', () => {
    submitOrder({ symbol: SYMBOL, side: 'buy', type: 'market', price: 0, qty: 2 });
    // Marketable sell limit (last 100 >= 95) larger than the position → flip.
    submitOrder({ symbol: SYMBOL, side: 'sell', type: 'limit', price: 95, qty: 5 });
    const s = useAppStore.getState();
    expect(s.positions).toHaveLength(1);
    expect(s.positions[0]).toMatchObject({ side: 'short', qty: 3 });
    const flipEntry = s.orderHistory[0]; // newest first: the flip fill
    expect(flipEntry).toMatchObject({ type: 'limit', status: 'filled', limitPrice: 100 });
  });
});

describe('pure helpers', () => {
  it('formatUsd/formatNum format both signs', () => {
    expect(formatUsd(1234.5)).toBe('$1,234.50');
    expect(formatUsd(-1234.5)).toBe('-$1,234.50');
    expect(formatUsd(0)).toBe('$0.00');
    expect(formatNum(1234.567, 1)).toBe('1,234.6');
  });

  it('ordersMargin sums margin at the given leverage', () => {
    const orders: ChartOrder[] = [
      { id: 'a', symbol: SYMBOL, side: 'buy', type: 'limit', price: 100, qty: 2 },
      { id: 'b', symbol: SYMBOL, side: 'sell', type: 'stop', price: 50, qty: 4 },
    ];
    expect(ordersMargin(orders, 4)).toBeCloseTo((200 + 200) / 4, 8);
    expect(ordersMargin(orders, 0)).toBeCloseTo(400, 8); // leverage clamped to 1
  });

  it('positionPnl handles shorts', () => {
    expect(positionPnl(
      { id: 'p', symbol: SYMBOL, side: 'short', entry: 100, qty: 2, tp: null, sl: null, leverage: 5, liq: null },
      90,
    )).toBeCloseTo(20, 8);
  });
});
