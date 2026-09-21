import { describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import { useAppStore } from '../../lib/store';
import {
  quantizeQtyToStep,
  resolveSymbolTrading,
  resolveMarginAmount,
  resolveOrderQty,
  resolvePositionOrderQty,
  formatMarginLabel,
} from '../../lib/trading/symbol-settings';
import { replaceUniverse, UNIVERSE } from '../../lib/maws/universe';
import { DEFAULT_CHART_SETTINGS, DEFAULT_SYMBOL_TRADING, type SymbolInfo } from '../../types';

/**
 * Headless tests for the store-dependent production functions in
 * lib/trading/symbol-settings.ts, executed against the REAL Zustand store
 * (no mocking of the store or of the functions under test).
 */

const SYMBOL = 'CFGUSDT';
const BALANCE = 100_000;

// The step-alignment tests below swap the module-level universe; restore it so
// later suites (and other test files via a clean registry) see the seed data.
const universeSnapshot = UNIVERSE.map((s) => ({ ...s }));
afterAll(() => replaceUniverse(universeSnapshot));

beforeEach(() => {
  useAppStore.setState({
    symbolTrading: {},
    mockBalance: BALANCE,
    chartSettings: { ...DEFAULT_CHART_SETTINGS, defaultLeverage: 7 },
  });
});

describe('resolveSymbolTrading (real store)', () => {
  it('falls back to chart defaults when no per-symbol settings exist', () => {
    const t = resolveSymbolTrading(SYMBOL);
    expect(t.margin).toBe(DEFAULT_SYMBOL_TRADING.margin); // 100
    expect(t.leverage).toBe(7); // from chartSettings.defaultLeverage
    expect(t.sizingMode).toBe('fixed');
    expect(t.marginPercent).toBe(DEFAULT_SYMBOL_TRADING.marginPercent);
  });

  it('prefers per-symbol leverage over chart defaults', () => {
    useAppStore.getState().setSymbolTrading(SYMBOL, { ...DEFAULT_SYMBOL_TRADING, leverage: 3 });
    expect(resolveSymbolTrading(SYMBOL).leverage).toBe(3);
  });

  it('normalizes legacy riskPercent settings to percent sizing', () => {
    useAppStore.setState({
      symbolTrading: {
        [SYMBOL]: {
          riskPercent: 7,
          sizingMode: 'riskPercent',
          qty: 3, // legacy field, must be dropped
          leverage: 4,
        } as never,
      },
    });
    const t = resolveSymbolTrading(SYMBOL);
    expect(t.sizingMode).toBe('percent');
    expect(t.marginPercent).toBe(7);
    expect(t.leverage).toBe(4);
    expect('qty' in t).toBe(false);
    expect('riskPercent' in t).toBe(false);
    expect(t.margin).toBe(DEFAULT_SYMBOL_TRADING.margin); // fallback
  });

  it('normalizes legacy percent sizing mode', () => {
    useAppStore.setState({
      symbolTrading: {
        [SYMBOL]: { sizingMode: 'percent', marginPercent: 12 } as never,
      },
    });
    expect(resolveSymbolTrading(SYMBOL).sizingMode).toBe('percent');
  });
});

describe('resolveMarginAmount (real store)', () => {
  it('fixed mode returns the configured margin', () => {
    useAppStore.getState().setSymbolTrading(SYMBOL, { ...DEFAULT_SYMBOL_TRADING, margin: 250 });
    expect(resolveMarginAmount(SYMBOL)).toBe(250);
  });

  it('percent mode returns balance * percent and never goes negative', () => {
    useAppStore
      .getState()
      .setSymbolTrading(SYMBOL, { ...DEFAULT_SYMBOL_TRADING, sizingMode: 'percent', marginPercent: 12 });
    expect(resolveMarginAmount(SYMBOL)).toBe(12_000);

    useAppStore
      .getState()
      .setSymbolTrading(SYMBOL, { ...DEFAULT_SYMBOL_TRADING, sizingMode: 'percent', marginPercent: -5 });
    expect(resolveMarginAmount(SYMBOL)).toBe(0);
  });
});

describe('resolveOrderQty (real store)', () => {
  it('computes qty = margin * leverage / price', () => {
    useAppStore
      .getState()
      .setSymbolTrading(SYMBOL, { ...DEFAULT_SYMBOL_TRADING, margin: 250, leverage: 4 });
    expect(resolveOrderQty(SYMBOL, 100)).toBe(10); // 250*4/100
  });

  it('returns 0 for non-positive prices', () => {
    expect(resolveOrderQty(SYMBOL, 0)).toBe(0);
    expect(resolveOrderQty(SYMBOL, -5)).toBe(0);
  });

  it('percent sizing uses the balance-derived margin', () => {
    useAppStore
      .getState()
      .setSymbolTrading(SYMBOL, { ...DEFAULT_SYMBOL_TRADING, sizingMode: 'percent', marginPercent: 10, leverage: 2 });
    // margin = 10% of 100_000 = 10_000 → qty = 10_000*2/50 = 400
    expect(resolveOrderQty(SYMBOL, 50)).toBe(400);
  });

  it('floors margin-derived qty onto the symbol LOT_SIZE step grid', () => {
    // 100 USDT × 10x at 81_100 → 0.012330678…; the universe entry for this
    // symbol carries stepSize 0.0001 (testnet BTCUSDT) → 0.0123.
    const info: SymbolInfo = {
      symbol: SYMBOL,
      base: 'CFG',
      quote: 'USDT',
      name: 'Config Coin',
      precision: 1,
      stepSize: '0.0001',
    };
    replaceUniverse([info]);
    useAppStore
      .getState()
      .setSymbolTrading(SYMBOL, { ...DEFAULT_SYMBOL_TRADING, margin: 100, leverage: 10 });
    expect(resolveOrderQty(SYMBOL, 81_100)).toBe(0.0123);
  });

  it('falls back to price-tick precision decimals when no stepSize is cached', () => {
    // No stepSize on the universe entry → precision 1 → step 0.1.
    const info: SymbolInfo = {
      symbol: SYMBOL,
      base: 'CFG',
      quote: 'USDT',
      name: 'Config Coin',
      precision: 1,
    };
    replaceUniverse([info]);
    useAppStore
      .getState()
      .setSymbolTrading(SYMBOL, { ...DEFAULT_SYMBOL_TRADING, margin: 100, leverage: 10 });
    // 1000/81_100 = 0.012330… floors to 0 steps of 0.1 → 0 (rejected cleanly).
    expect(resolveOrderQty(SYMBOL, 81_100)).toBe(0);
    // At a lower price the same sizing stays on the 0.1 grid: 1000/900 = 1.11…
    expect(resolveOrderQty(SYMBOL, 900)).toBe(1.1);
  });

  it('quantizeQtyToStep floors to the step and floors sub-step sizes to zero', () => {
    expect(quantizeQtyToStep(0.012331811, '0.0001')).toBe(0.0123);
    expect(quantizeQtyToStep(0.012331811, '0.001')).toBe(0.012);
    expect(quantizeQtyToStep(0.0123, '0.0001')).toBe(0.0123); // already on grid
    expect(quantizeQtyToStep(0.00005, '0.0001')).toBe(0); // below one step
    expect(quantizeQtyToStep(10, 0.001)).toBe(10); // float dust must not floor a step down
    expect(quantizeQtyToStep(7, undefined)).toBe(7); // no step → unchanged
    expect(quantizeQtyToStep(7, 'abc')).toBe(7); // invalid step → unchanged
    expect(quantizeQtyToStep(0, '0.001')).toBe(0);
    expect(quantizeQtyToStep(-3, '0.001')).toBe(0);
  });
});

describe('resolvePositionOrderQty (real store)', () => {
  it('without drawing overrides it matches resolveOrderQty', () => {
    useAppStore
      .getState()
      .setSymbolTrading(SYMBOL, { ...DEFAULT_SYMBOL_TRADING, margin: 200, leverage: 5 });
    expect(resolvePositionOrderQty(SYMBOL, 100, {})).toBe(resolveOrderQty(SYMBOL, 100)); // 10
  });

  it('returns 0 for non-positive prices', () => {
    expect(resolvePositionOrderQty(SYMBOL, 0, { positionLotSize: 500 })).toBe(0);
  });

  it('custom account size + percent risk + leverage override', () => {
    const qty = resolvePositionOrderQty(SYMBOL, 100, {
      positionAccountSizeMode: 'custom',
      positionAccountSize: 50_000,
      positionRiskUnit: 'percent',
      positionRisk: 10, // 10% of 50_000 = 5_000 margin
      positionLeverage: 2,
    });
    expect(qty).toBe(100); // 5_000*2/100
  });

  it('invalid custom account size falls back to real balance', () => {
    const qty = resolvePositionOrderQty(SYMBOL, 100, {
      positionAccountSizeMode: 'custom',
      positionAccountSize: 0, // invalid → balance 100_000
      positionRiskUnit: 'percent',
      positionRisk: 1,
    });
    // 1% of 100_000 = 1_000 margin * chart default leverage 7 / price 100
    expect(qty).toBe(70);
  });

  it('money risk unit uses the explicit risk amount', () => {
    const qty = resolvePositionOrderQty(SYMBOL, 100, {
      positionRiskUnit: 'money',
      positionRisk: 300,
      positionLeverage: 2,
    });
    expect(qty).toBe(6); // 300*2/100
  });

  it('money risk unit with zero risk falls back to the lot size', () => {
    const qty = resolvePositionOrderQty(SYMBOL, 100, {
      positionRiskUnit: 'money',
      positionRisk: 0,
      positionLotSize: 150,
      positionLeverage: 1,
    });
    expect(qty).toBe(1.5); // 150*1/100
  });

  it('percent risk unit defaults from sizing mode when unset', () => {
    useAppStore
      .getState()
      .setSymbolTrading(SYMBOL, { ...DEFAULT_SYMBOL_TRADING, sizingMode: 'percent', marginPercent: 5, leverage: 2 });
    // No positionRiskUnit → sizingMode percent implies percent; risk = 5% of balance.
    const qty = resolvePositionOrderQty(SYMBOL, 100, {});
    expect(qty).toBe(resolveOrderQty(SYMBOL, 100)); // same as defaults: 5_000*2/100 = 100
  });

  it('leverage never drops below 1', () => {
    const qty = resolvePositionOrderQty(SYMBOL, 100, {
      positionRiskUnit: 'money',
      positionRisk: 100,
      positionLeverage: 0,
    });
    expect(qty).toBe(1); // 100*1/100
  });
});

describe('formatMarginLabel (real store)', () => {
  it('fixed mode: integer margin renders without decimals', () => {
    useAppStore.getState().setSymbolTrading(SYMBOL, { ...DEFAULT_SYMBOL_TRADING, margin: 100 });
    expect(formatMarginLabel(SYMBOL)).toBe('100');
  });

  it('fixed mode: fractional margin renders trimmed to 2 decimals', () => {
    useAppStore.getState().setSymbolTrading(SYMBOL, { ...DEFAULT_SYMBOL_TRADING, margin: 123.456 });
    expect(formatMarginLabel(SYMBOL)).toBe('123.46');
  });

  it('percent mode: integer percent renders as N%', () => {
    useAppStore
      .getState()
      .setSymbolTrading(SYMBOL, { ...DEFAULT_SYMBOL_TRADING, sizingMode: 'percent', marginPercent: 12 });
    expect(formatMarginLabel(SYMBOL)).toBe('12%');
  });

  it('percent mode: fractional percent renders trimmed with %', () => {
    useAppStore
      .getState()
      .setSymbolTrading(SYMBOL, { ...DEFAULT_SYMBOL_TRADING, sizingMode: 'percent', marginPercent: 12.345 });
    expect(formatMarginLabel(SYMBOL)).toBe('12.35%');
  });
});

describe('remaining branch coverage', () => {
  it('legacy marginPercent takes precedence over riskPercent', () => {
    useAppStore.setState({
      symbolTrading: {
        [SYMBOL]: { marginPercent: 9, riskPercent: 3 } as never,
      },
    });
    expect(resolveSymbolTrading(SYMBOL).marginPercent).toBe(9);
  });

  it('legacy settings without percent fields fall back to the default marginPercent', () => {
    useAppStore.setState({
      symbolTrading: {
        [SYMBOL]: { leverage: 2 } as never,
      },
    });
    expect(resolveSymbolTrading(SYMBOL).marginPercent).toBe(DEFAULT_SYMBOL_TRADING.marginPercent);
  });

  it('riskUnit defaults to percent in percent sizing mode when only leverage is overridden', () => {
    useAppStore
      .getState()
      .setSymbolTrading(SYMBOL, { ...DEFAULT_SYMBOL_TRADING, sizingMode: 'percent', marginPercent: 5 });
    // Override present (positionLeverage) but no riskUnit/risk → defaults from settings:
    // margin = 5% of balance = 5_000, lev 2, price 100 → qty 100.
    const qty = resolvePositionOrderQty(SYMBOL, 100, { positionLeverage: 2 });
    expect(qty).toBe(100);
  });

  it('riskUnit defaults to money in fixed sizing mode when only leverage is overridden', () => {
    useAppStore
      .getState()
      .setSymbolTrading(SYMBOL, { ...DEFAULT_SYMBOL_TRADING, margin: 200, leverage: 5 });
    // money default: risk = t.margin = 200, lev override 2 → qty = 200*2/100 = 4
    const qty = resolvePositionOrderQty(SYMBOL, 100, { positionLeverage: 2 });
    expect(qty).toBe(4);
  });

  it('percent risk without explicit positionRisk uses marginPercent of the account', () => {
    useAppStore
      .getState()
      .setSymbolTrading(SYMBOL, { ...DEFAULT_SYMBOL_TRADING, sizingMode: 'percent', marginPercent: 2 });
    const qty = resolvePositionOrderQty(SYMBOL, 100, {
      positionRiskUnit: 'percent', // explicit unit, but no positionRisk
      positionLeverage: 1,
    });
    // 2% of 100_000 = 2_000 margin → qty 20
    expect(qty).toBe(20);
  });

  it('money risk without explicit positionRisk uses the configured margin', () => {
    useAppStore
      .getState()
      .setSymbolTrading(SYMBOL, { ...DEFAULT_SYMBOL_TRADING, margin: 250, leverage: 1 });
    const qty = resolvePositionOrderQty(SYMBOL, 100, {
      positionRiskUnit: 'money', // explicit unit, but no positionRisk
    });
    // risk = t.margin = 250, lev 1 → qty 2.5
    expect(qty).toBe(2.5);
  });
});

