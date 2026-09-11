import { MOCK_START_BALANCE } from "@/lib/brokers";
import type { BrokerId } from "@/lib/brokers";
import { defaultProtect, liquidationPrice, uid } from "@/lib/trade-marks";
import { DEFAULT_PAPER_ACCOUNT } from "@/types";
import type {
  BalanceHistoryEntry,
  ChartOrder,
  ChartPosition,
  JournalEntry,
  OrderHistoryEntry,
  PaperAccountSettings,
} from "@/types";
import type { Store } from "@/lib/store";

export type PaperTradingSliceState = {
  connectedBroker: BrokerId | null;
  mockBalance: number;
  mockRealized: number;
  paperAccount: PaperAccountSettings;
  orders: ChartOrder[];
  positions: ChartPosition[];
  orderHistory: OrderHistoryEntry[];
  balanceHistory: BalanceHistoryEntry[];
  journal: JournalEntry[];
};

export type PaperTradingSliceActions = {
  setConnectedBroker: (id: BrokerId | null) => void;
  setMockBalance: (value: number) => void;
  setMockRealized: (value: number) => void;
  setPaperAccount: (value: PaperAccountSettings) => void;
  patchPaperAccount: (patch: Partial<PaperAccountSettings>) => void;
  resetPaperAccount: () => void;
  addOrder: (order: Omit<ChartOrder, "id">) => void;
  updateOrder: (id: string, patch: Partial<ChartOrder>) => void;
  removeOrder: (id: string) => void;
  addPosition: (pos: Omit<ChartPosition, "id" | "liq" | "tp" | "sl"> & {
    tp?: number | null;
    sl?: number | null;
    liq?: number | null;
  }) => void;
  updatePosition: (id: string, patch: Partial<ChartPosition>) => void;
  removePosition: (id: string) => void;
  addOrderHistory: (entry: Omit<OrderHistoryEntry, "id">) => void;
  addBalanceHistory: (entry: Omit<BalanceHistoryEntry, "id">) => void;
  addJournalEntry: (entry: Omit<JournalEntry, "id">) => void;
};

export type PaperTradingSlice = PaperTradingSliceState & PaperTradingSliceActions;

type RootSet = (
  partial: Partial<Store> | ((state: Store) => Partial<Store>),
) => void;
type RootGet = () => Store;

export function createPaperTradingSlice(set: RootSet, get: RootGet): PaperTradingSlice {
  return {
    connectedBroker: null,
    mockBalance: MOCK_START_BALANCE,
    mockRealized: 0,
    paperAccount: { ...DEFAULT_PAPER_ACCOUNT, leverage: { ...DEFAULT_PAPER_ACCOUNT.leverage } },
    orders: [],
    positions: [],
    orderHistory: [],
    balanceHistory: [],
    journal: [],

    setConnectedBroker: (id) => set({ connectedBroker: id }),
    setMockBalance: (value) => set({ mockBalance: value }),
    setMockRealized: (value) => set({ mockRealized: value }),
    setPaperAccount: (value) =>
      set({
        paperAccount: {
          ...value,
          leverage: { ...value.leverage },
        },
      }),
    patchPaperAccount: (patch) =>
      set({
        paperAccount: {
          ...get().paperAccount,
          ...patch,
          leverage: {
            ...get().paperAccount.leverage,
            ...(patch.leverage ?? {}),
          },
        },
      }),
    resetPaperAccount: () =>
      set({
        mockBalance: MOCK_START_BALANCE,
        mockRealized: 0,
        positions: [],
        orders: [],
        paperAccount: {
          ...DEFAULT_PAPER_ACCOUNT,
          leverage: { ...DEFAULT_PAPER_ACCOUNT.leverage },
        },
        chartSettings: {
          ...get().chartSettings,
          defaultLeverage: DEFAULT_PAPER_ACCOUNT.leverage.crypto,
        },
      }),
    addOrder: (order) =>
      set({
        orders: [...get().orders, { ...order, id: uid() }],
      }),
    updateOrder: (id, patch) =>
      set({
        orders: get().orders.map((o) => (o.id === id ? { ...o, ...patch } : o)),
      }),
    removeOrder: (id) =>
      set({ orders: get().orders.filter((o) => o.id !== id) }),
    addPosition: (pos) => {
      const protect = defaultProtect(pos.entry, pos.side);
      const next: ChartPosition = {
        ...pos,
        id: uid(),
        openedAt: pos.openedAt ?? Date.now(),
        liq: pos.liq ?? liquidationPrice(pos),
        tp: pos.tp === undefined ? protect.tp : pos.tp,
        sl: pos.sl === undefined ? protect.sl : pos.sl,
      };
      set({ positions: [...get().positions, next] });
    },
    updatePosition: (id, patch) =>
      set({
        positions: get().positions.map((p) => {
          if (p.id !== id) return p;
          const next = { ...p, ...patch };
          if (patch.entry != null || patch.leverage != null || patch.side != null) {
            next.liq = liquidationPrice(next);
          }
          return next;
        }),
      }),
    removePosition: (id) =>
      set({ positions: get().positions.filter((p) => p.id !== id) }),
    addOrderHistory: (entry) =>
      set({
        orderHistory: [{ ...entry, id: uid() }, ...get().orderHistory].slice(0, 500),
      }),
    addBalanceHistory: (entry) =>
      set({
        balanceHistory: [{ ...entry, id: uid() }, ...get().balanceHistory].slice(0, 500),
      }),
    addJournalEntry: (entry) =>
      set({
        journal: [{ ...entry, id: uid() }, ...get().journal].slice(0, 500),
      }),
  };
}

/** Legacy paper-trading hydration, moved verbatim from the root onRehydrateStorage. */
export function normalizePaperTradingRehydrate(state: Store): void {
  const lev = {
    ...DEFAULT_PAPER_ACCOUNT.leverage,
    ...state.paperAccount?.leverage,
  } as PaperAccountSettings["leverage"] & { forex?: number };
  delete lev.forex;
  state.paperAccount = {
    ...DEFAULT_PAPER_ACCOUNT,
    ...state.paperAccount,
    leverage: lev,
  };
  state.orders = state.orders ?? [];
  state.positions = state.positions ?? [];
  state.orderHistory = state.orderHistory ?? [];
  state.balanceHistory = state.balanceHistory ?? [];
  state.journal = (state.journal ?? []).map((entry) => {
    const legacy = entry as JournalEntry & {
      symbol?: string;
      side?: string;
      qty?: number;
      entry?: number;
      exit?: number;
      closedAt?: number;
      text?: string;
      time?: number;
    };
    if (legacy.text && legacy.time != null) {
      return { id: legacy.id, time: legacy.time, text: legacy.text };
    }
    if (legacy.symbol && legacy.closedAt != null) {
      return {
        id: legacy.id,
        time: legacy.closedAt,
        text: `Close ${legacy.side ?? "position"} for symbol ${legacy.symbol} at price ${legacy.exit ?? "—"} for ${legacy.qty ?? "—"} units`,
      };
    }
    return {
      id: legacy.id,
      time: legacy.time ?? Date.now(),
      text: legacy.text ?? "Journal entry",
    };
  });
  // Binance is server-authoritative and must be re-confirmed after reload;
  // never restore a stale live attachment from browser storage.
  state.connectedBroker = state.connectedBroker === "mock" ? "mock" : null;
  state.mockBalance = state.mockBalance ?? MOCK_START_BALANCE;
  state.mockRealized = state.mockRealized ?? 0;
}
