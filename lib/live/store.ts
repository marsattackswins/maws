import { create } from "zustand";

import type {
  AccountDto,
  FillDto,
  HealthDto,
  LiveProfileEnvironment,
  LiveProfileId,
  LiveProfilePhase,
  OrderDto,
  PositionDto,
  ProfileRuntimeStatusDto,
} from "./types";

export interface LiveNotice {
  id: number;
  tone: "info" | "error" | "success";
  text: string;
}

interface LiveStore {
  attached: boolean;
  profileId: LiveProfileId | null;
  environment: LiveProfileEnvironment | null;
  phase: LiveProfilePhase;
  ready: boolean;
  executionAllowed: boolean;
  generation: number;
  reasonCode: string | null;
  env: string | null;
  envLabel: string | null;
  managerStatus: string;
  managerError: string | null;
  account: AccountDto | null;
  positions: PositionDto[];
  orders: OrderDto[];
  fills: FillDto[];
  health: HealthDto | null;
  stream: { connected: boolean; leaseOwned?: boolean; phase: string; reconnects: number } | null;
  notices: LiveNotice[];

  setAttached(v: boolean): void;
  setProfileRuntime(status: ProfileRuntimeStatusDto): void;
  beginProfileSwitch(): void;
  clearProfileRuntime(): void;
  setEnv(env: string | null, label: string | null): void;
  setManager(status: string, error: string | null): void;
  applyState(state: { account: AccountDto; positions: PositionDto[]; orders: OrderDto[]; fills: FillDto[] }): void;
  clearState(): void;
  setHealth(h: HealthDto): void;
  setStream(s: { connected: boolean; leaseOwned?: boolean; phase: string; reconnects: number }): void;
  notify(tone: LiveNotice["tone"], text: string): void;
  dismissNotice(id: number): void;
}

let noticeSeq = 1;

/** Non-persisted store: live exchange state is server-authoritative. */
export const useLiveStore = create<LiveStore>()((set) => ({
  attached: false,
  profileId: null,
  environment: null,
  phase: "idle",
  ready: false,
  executionAllowed: false,
  generation: 0,
  reasonCode: null,
  env: null,
  envLabel: null,
  managerStatus: "idle",
  managerError: null,
  account: null,
  positions: [],
  orders: [],
  fills: [],
  health: null,
  stream: null,
  notices: [],

  setAttached: (v) => set({ attached: v }),
  setProfileRuntime: (status) =>
    set((state) => ({
      profileId: status.profileId,
      environment: status.environment,
      phase: status.phase,
      ready: status.ready,
      executionAllowed: status.executionAllowed,
      generation: status.generation,
      reasonCode: status.reasonCode,
      managerStatus: status.managerStatus,
      managerError: status.managerError ?? null,
      env: status.environment,
      envLabel: status.environment === "paper" ? "Paper Trading" : status.environment === "testnet" ? "Binance Testnet" : status.environment === "production" ? "Binance Production" : null,
      health: status.phase === "ready" && state.profileId === status.profileId && state.generation === status.generation ? state.health : null,
      stream: status.streamHealthy == null ? null : { connected: status.streamHealthy, leaseOwned: status.streamHealthy, phase: status.streamHealthy ? "live" : "degraded", reconnects: 0 },
    })),
  beginProfileSwitch: () =>
    set((state) => ({
      phase: "switching",
      ready: false,
      executionAllowed: false,
      reasonCode: "profile_switch_in_progress",
      managerStatus: state.managerStatus || "switching",
    })),
  clearProfileRuntime: () =>
    set({
      profileId: null,
      environment: null,
      phase: "idle",
      ready: false,
      executionAllowed: false,
      generation: 0,
      reasonCode: null,
      env: null,
      envLabel: null,
      managerStatus: "idle",
      managerError: null,
      health: null,
      stream: null,
    }),
  setEnv: (env, label) => set({ env, envLabel: label }),
  setManager: (status, error) => set({ managerStatus: status, managerError: error }),
  applyState: (s) =>
    set({ account: s.account, positions: s.positions, orders: s.orders, fills: s.fills }),
  clearState: () => set({ account: null, positions: [], orders: [], fills: [] }),
  setHealth: (h) => set({ health: h }),
  setStream: (s) => set({ stream: s }),
  notify: (tone, text) =>
    set((st) => ({ notices: [...st.notices.slice(-4), { id: noticeSeq++, tone, text }] })),
  dismissNotice: (id) => set((st) => ({ notices: st.notices.filter((n) => n.id !== id) })),
}));
