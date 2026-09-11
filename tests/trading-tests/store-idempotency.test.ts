import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { useAppStore } from '../../lib/store';
import {
  connectMock,
  submitOrder,
  tickMock,
  usedMargin,
} from '../../lib/trading/mock';
import { mawsFeed } from '../../lib/maws/feed';
import { DEFAULT_SYMBOL_TRADING, type Quote } from '../../types';

/**
 * Store-level idempotency guarantees for the REAL production paper-trading
 * engine (no trading logic mocked):
 *
 *   - duplicate/replayed tick batches must not create duplicate fills,
 *     duplicate closes, or duplicate balance changes;
 *   - a full reconnect-style replay of the tick stream must converge to the
 *     exact same state as a single delivery;
 *   - repeated submissions carrying the same clientOrderId are ignored
 *     (idempotent order placement);
 *   - a replayed close after the symbol has been re-entered must not close
 *     or mutate the new position.
 */

const SYMBOL = 'IDEMUSDT';
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

function ledgerInvariant() {
  const s = useAppStore.getState();
  const ledgerSum = s.balanceHistory.reduce((sum, b) => sum + b.amount, 0);
  // Deposits are recorded in the ledger too; balance must equal start + ledger.
  expect(s.mockBalance).toBeCloseTo(START_BALANCE + ledgerSum, 8);
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

describe('store-level idempotency (real production engine)', () => {
  it('replayed exit ticks create exactly one close and one balance change', () => {
    submitOrder({ symbol: SYMBOL, side: 'buy', type: 'market', price: 0, qty: 10 });
    const s0 = useAppStore.getState();
    expect(s0.positions).toHaveLength(1);
    useAppStore.getState().updatePosition(s0.positions[0].id, { tp: 110 });

    const tpBreach = [tick(SYMBOL, 111)];
    tickMock(tpBreach);

    const afterFirst = useAppStore.getState();
    expect(afterFirst.positions).toHaveLength(0);
    expect(afterFirst.mockRealized).toBeCloseTo(100, 8); // (110-100)*10
    const fillsAfterFirst = afterFirst.orderHistory.filter((h) => h.status === 'filled').length;
    const historyAfterFirst = afterFirst.orderHistory.length;
    const balanceAfterFirst = afterFirst.mockBalance;
    const ledgerAfterFirst = afterFirst.balanceHistory.length;

    // Reconnect-style replay: the same batch delivered 5 more times.
    for (let i = 0; i < 5; i++) tickMock(tpBreach);

    const s = useAppStore.getState();
    expect(s.positions).toHaveLength(0);
    expect(s.orderHistory.filter((h) => h.status === 'filled')).toHaveLength(fillsAfterFirst);
    expect(s.orderHistory).toHaveLength(historyAfterFirst); // no duplicate closes
    expect(s.balanceHistory).toHaveLength(ledgerAfterFirst); // no duplicate balance changes
    expect(s.mockBalance).toBeCloseTo(balanceAfterFirst, 8);
    expect(s.mockRealized).toBeCloseTo(100, 8);
    ledgerInvariant();
  });

  it('a full reconnect replay of the tick stream converges to the same state', () => {
    submitOrder({ symbol: SYMBOL, side: 'buy', type: 'limit', price: 95, qty: 10 });

    // The whole stream as the feed would deliver it.
    const stream: Quote[][] = [[tick(SYMBOL, 96)], [tick(SYMBOL, 95)], [tick(SYMBOL, 104)], [tick(SYMBOL, 108)]];

    for (const batch of stream) tickMock(batch);
    const single = useAppStore.getState();
    const singleSnapshot = {
      balance: single.mockBalance,
      realized: single.mockRealized,
      positions: single.positions.length,
      orders: single.orders.length,
      orderHistory: single.orderHistory.length,
      balanceHistory: single.balanceHistory.length,
    };
    expect(singleSnapshot.positions).toBe(1); // opened at 95, no brackets, 108 does nothing

    // Reset and replay the SAME stream twice (reconnect redelivery).
    resetPaperStore();
    connectMock();
    useAppStore.getState().setSymbolTrading(SYMBOL, {
      ...DEFAULT_SYMBOL_TRADING,
      attachBrackets: false,
      leverage: 5,
    });
    submitOrder({ symbol: SYMBOL, side: 'buy', type: 'limit', price: 95, qty: 10 });
    for (const batch of stream) tickMock(batch);
    for (const batch of stream) tickMock(batch); // replay

    const replayed = useAppStore.getState();
    expect(replayed.mockBalance).toBeCloseTo(singleSnapshot.balance, 8);
    expect(replayed.mockRealized).toBeCloseTo(singleSnapshot.realized, 8);
    expect(replayed.positions).toHaveLength(singleSnapshot.positions);
    expect(replayed.orders).toHaveLength(singleSnapshot.orders);
    expect(replayed.orderHistory).toHaveLength(singleSnapshot.orderHistory);
    expect(replayed.balanceHistory).toHaveLength(singleSnapshot.balanceHistory);
    ledgerInvariant();
  });

  it('a pending order fills exactly once across repeated tick batches', () => {
    // Resting buy limit below market (last = 100).
    submitOrder({ symbol: SYMBOL, side: 'buy', type: 'limit', price: 95, qty: 4 });
    expect(useAppStore.getState().orders).toHaveLength(1);

    const filling = [tick(SYMBOL, 95)];
    tickMock(filling);
    tickMock(filling);
    tickMock(filling);

    const s = useAppStore.getState();
    expect(s.orders).toHaveLength(0);
    expect(s.positions).toHaveLength(1);
    expect(s.positions[0].qty).toBe(4); // one fill, not three
    expect(s.orderHistory.filter((h) => h.status === 'filled')).toHaveLength(1);
    // margin locked exactly once: 4*95/5 = 76
    expect(s.mockBalance).toBeCloseTo(START_BALANCE - 76, 8);
    expect(usedMargin(s.positions)).toBeCloseTo(76, 8);
    ledgerInvariant();
  });

  it('duplicate submissions with the same clientOrderId are ignored', () => {
    // Resting limit: first submission stays pending, replay is ignored.
    submitOrder({ symbol: SYMBOL, side: 'buy', type: 'limit', price: 90, qty: 2, clientOrderId: 'cli-1' });
    submitOrder({ symbol: SYMBOL, side: 'buy', type: 'limit', price: 90, qty: 2, clientOrderId: 'cli-1' });
    submitOrder({ symbol: SYMBOL, side: 'buy', type: 'limit', price: 90, qty: 2, clientOrderId: 'cli-1' });

    let s = useAppStore.getState();
    expect(s.orders).toHaveLength(1);
    expect(s.orders[0].clientOrderId).toBe('cli-1');

    // Fill it, then a resubmission with the same key must still be rejected
    // (the key now lives in order history).
    tickMock([tick(SYMBOL, 90)]);
    s = useAppStore.getState();
    expect(s.positions).toHaveLength(1);
    const balanceAfterFill = s.mockBalance;
    expect(s.orderHistory.some((h) => h.clientOrderId === 'cli-1')).toBe(true);

    submitOrder({ symbol: SYMBOL, side: 'buy', type: 'limit', price: 90, qty: 2, clientOrderId: 'cli-1' });
    s = useAppStore.getState();
    expect(s.orders).toHaveLength(0); // no duplicate order accepted
    expect(s.positions).toHaveLength(1);
    expect(s.mockBalance).toBeCloseTo(balanceAfterFill, 8); // no duplicate margin lock
    ledgerInvariant();
  });

  it('a market order replayed via clientOrderId does not double-debit the balance', () => {
    submitOrder({ symbol: SYMBOL, side: 'buy', type: 'market', price: 0, qty: 5, clientOrderId: 'mkt-1' });
    const afterFirst = useAppStore.getState();
    expect(afterFirst.positions).toHaveLength(1);
    // margin = 5*100/5 = 100
    expect(afterFirst.mockBalance).toBeCloseTo(START_BALANCE - 100, 8);

    submitOrder({ symbol: SYMBOL, side: 'buy', type: 'market', price: 0, qty: 5, clientOrderId: 'mkt-1' });
    const s = useAppStore.getState();
    expect(s.positions).toHaveLength(1); // no second fill added to the position
    expect(s.positions[0].qty).toBe(5);
    expect(s.mockBalance).toBeCloseTo(START_BALANCE - 100, 8);
    expect(s.orderHistory.filter((h) => h.status === 'filled')).toHaveLength(1);
    ledgerInvariant();
  });

  it('a replayed closing stream does not touch a freshly re-opened position', () => {
    // Open P1, close it at TP via the stream.
    submitOrder({ symbol: SYMBOL, side: 'buy', type: 'market', price: 0, qty: 10 });
    useAppStore.getState().updatePosition(useAppStore.getState().positions[0].id, { tp: 110 });
    const closingStream: Quote[][] = [[tick(SYMBOL, 104)], [tick(SYMBOL, 111)]];
    for (const batch of closingStream) tickMock(batch);
    let s = useAppStore.getState();
    expect(s.positions).toHaveLength(0);
    const balanceAfterClose = s.mockBalance;
    const realizedAfterClose = s.mockRealized;

    // Re-enter the same symbol: brand-new position id, no brackets.
    submitOrder({ symbol: SYMBOL, side: 'buy', type: 'market', price: 0, qty: 7 });
    s = useAppStore.getState();
    expect(s.positions).toHaveLength(1);
    const newId = s.positions[0].id;
    const balanceAfterReopen = s.mockBalance;

    // Full replay of the old closing stream: the new position must survive.
    for (const batch of closingStream) tickMock(batch);
    for (const batch of closingStream) tickMock(batch);

    s = useAppStore.getState();
    expect(s.positions).toHaveLength(1);
    expect(s.positions[0].id).toBe(newId);
    expect(s.positions[0].qty).toBe(7);
    expect(s.mockBalance).toBeCloseTo(balanceAfterReopen, 8);
    expect(s.mockRealized).toBeCloseTo(realizedAfterClose, 8);
    expect(balanceAfterClose).toBeCloseTo(START_BALANCE + realizedAfterClose, 8);
    ledgerInvariant();
  });

  it('repeated connectMock calls do not duplicate the initial funding', () => {
    const s0 = useAppStore.getState();
    const balance = s0.mockBalance;
    const deposits = s0.balanceHistory.filter((b) => b.type === 'deposit').length;

    connectMock();
    connectMock();
    connectMock();

    const s = useAppStore.getState();
    expect(s.connectedBroker).toBe('mock');
    expect(s.mockBalance).toBeCloseTo(balance, 8);
    expect(s.balanceHistory.filter((b) => b.type === 'deposit')).toHaveLength(deposits);
  });
});
