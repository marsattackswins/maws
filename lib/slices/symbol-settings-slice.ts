import { DEFAULT_SYMBOL_TRADING } from "@/types";
import type { SymbolTradingSettings } from "@/types";
import type { Store } from "@/lib/store";

export type SymbolSettingsSliceState = {
  symbolTrading: Record<string, SymbolTradingSettings>;
};

export type SymbolSettingsSliceActions = {
  patchSymbolTrading: (symbol: string, patch: Partial<SymbolTradingSettings>) => void;
  setSymbolTrading: (symbol: string, value: SymbolTradingSettings) => void;
};

export type SymbolSettingsSlice = SymbolSettingsSliceState &
  SymbolSettingsSliceActions;

type RootSet = (
  partial: Partial<Store> | ((state: Store) => Partial<Store>),
) => void;
type RootGet = () => Store;

export function createSymbolSettingsSlice(
  set: RootSet,
  get: RootGet,
): SymbolSettingsSlice {
  return {
    symbolTrading: {},

    patchSymbolTrading: (symbol, patch) => {
      const prev = get().symbolTrading[symbol];
      const base: SymbolTradingSettings = {
        ...DEFAULT_SYMBOL_TRADING,
        ...prev,
        leverage: prev?.leverage ?? get().chartSettings.defaultLeverage,
        margin: prev?.margin ?? DEFAULT_SYMBOL_TRADING.margin,
        marginPercent: prev?.marginPercent ?? DEFAULT_SYMBOL_TRADING.marginPercent,
      };
      set({
        symbolTrading: {
          ...get().symbolTrading,
          [symbol]: { ...base, ...patch },
        },
      });
    },
    setSymbolTrading: (symbol, value) =>
      set({
        symbolTrading: {
          ...get().symbolTrading,
          [symbol]: { ...DEFAULT_SYMBOL_TRADING, ...value },
        },
      }),
  };
}

/** Legacy cleanup for persisted per-symbol trading settings (drop EURUSD, MATIC→POL). */
export function normalizeSymbolSettingsRehydrate(state: Store): void {
  state.symbolTrading = state.symbolTrading ?? {};
  for (const key of Object.keys(state.symbolTrading)) {
    if (/^EURUSD$/i.test(key)) delete state.symbolTrading[key];
  }
  if (state.symbolTrading.MATICUSDT && !state.symbolTrading.POLUSDT) {
    state.symbolTrading.POLUSDT = state.symbolTrading.MATICUSDT;
    delete state.symbolTrading.MATICUSDT;
  }
}
