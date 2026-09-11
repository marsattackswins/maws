/** Shared fakes for Binance server-layer tests. No network access ever happens. */

import crypto from "node:crypto";
import os from "node:os";
import path from "node:path";

import { resetDbForTests } from "@/lib/server/db/connection";
import {
  resetServerConfigForTests,
  type EnvConfig,
  type ProfileRegistry,
} from "@/lib/server/env/config";
import { resetClockForTests } from "@/lib/server/binance/clock";
import { resetLiveStateForTests } from "@/lib/server/binance/state";
import {
  resetBrokerClientsForTests,
  installBrokerClients,
  TransportTimeoutError,
  type HttpRequestOptions,
  type HttpResponse,
  type WsLike,
} from "@/lib/server/binance/transport";
import { resetCircuitBreakersForTests } from "@/lib/server/resilience/breakers";
import { resetHealthSignalsForTests, setHealthSignal } from "@/lib/server/health/state";

export function tempDbPath(): string {
  return path.join(os.tmpdir(), `maws-test-${crypto.randomBytes(8).toString("hex")}.db`);
}

const TEST_PROFILES: ProfileRegistry = {
  paper: {
    profileId: "paper",
    label: "Paper",
    environment: "paper",
    configured: false,
    executionEnabled: false,
    apiKey: null,
    apiSecret: null,
    restEndpoint: "https://fapi.binance.com",
    webSocketEndpoint: "wss://fstream.binance.com",
  },
  "binance-testnet": {
    profileId: "binance-testnet",
    label: "Binance Testnet",
    environment: "testnet",
    configured: true,
    executionEnabled: false,
    apiKey: "test-api-key",
    apiSecret: "test-api-secret",
    restEndpoint: "https://testnet.binancefuture.com",
    webSocketEndpoint: "wss://fstream.binancefuture.com",
  },
  "binance-production": {
    profileId: "binance-production",
    label: "Binance Production",
    environment: "production",
    configured: false,
    executionEnabled: false,
    apiKey: null,
    apiSecret: null,
    restEndpoint: "https://fapi.binance.com",
    webSocketEndpoint: "wss://fstream.binance.com",
  },
};

export function makeCfg(overrides: Partial<EnvConfig> = {}): EnvConfig {
  return {
    env: "testnet",
    brokerType: "binance",
    defaultProfile: "paper",
    activeProfileId: "binance-testnet",
    profiles: TEST_PROFILES,
    dbPath: tempDbPath(),
    operatorAuth: "0123456789abcdef:fedcba9876543210",
    allowedOrigin: null,
    trustProxy: false,
    backupKey: null,
    executionEnabledStatic: false,
    healthToken: null,
    binanceApiKey: "test-api-key",
    binanceApiSecret: "test-api-secret",
    recvWindowMs: 5000,
    rateInternalPerMin: 1_000_000,
    reconIntervalMs: 86_400_000,
    leaseTtlMs: 60_000,
    snapshotMaxAgeMs: 5 * 60_000,
    alertWebhookUrl: null,
    risk: {
      maxOrderNotionalUsd: 50,
      maxGrossExposureUsd: 100,
      maxOpenOrders: 10,
      maxOpenPositions: 3,
      dailyLossPct: 50,
      priceCollarPct: 5,
    },
    circuitBreaker: {
      restFailureThreshold: 5,
      restFailureWindowMs: 60_000,
      restRecoveryTimeoutMs: 30_000,
      restSuccessThreshold: 2,
      streamFailureThreshold: 3,
      streamFailureWindowMs: 300_000,
      streamRecoveryTimeoutMs: 60_000,
      streamSuccessThreshold: 1,
      reconFailureThreshold: 3,
      reconFailureWindowMs: 600_000,
      reconRecoveryTimeoutMs: 120_000,
      reconSuccessThreshold: 2,
    },
    ...overrides,
  };
}

/** Resets every process-wide singleton the server layer uses, backed by a fresh temp DB. */
export function freshEnv(cfg: EnvConfig): EnvConfig {
  resetServerConfigForTests(cfg);
  resetDbForTests(cfg.dbPath);
  resetClockForTests();
  resetLiveStateForTests();
  resetBrokerClientsForTests();
  resetCircuitBreakersForTests();
  // Test harnesses that exercise an isolated service start from a confirmed
  // healthy manager; dedicated gate tests override these signals explicitly.
  resetHealthSignalsForTests();
  const now = Date.now();
  setHealthSignal({
    managerRunning: true,
    brokerStatus: "ready",
    stream: {
      connected: true,
      leaseOwned: true,
      phase: "live",
      startedAt: now,
      lastEventAt: now,
      lastApplicationEventAt: now,
      reconnects: 0,
      listenKeyRenewedAt: now,
      bufferOverflow: false,
      circuitState: "closed",
    },
    snapshot: { fetchedAt: now },
    positionMode: { mode: "one-way", checkedAt: now, error: null },
  });
  return cfg;
}

export function jsonRes(body: unknown, status = 200): HttpResponse {
  return { status, headers: {}, body: JSON.stringify(body) };
}

type ScriptedResponse = HttpResponse | Error;

/** In-memory HTTP transport. Routes by URL pathname; one-shot scripts win over routes. */
export class FakeHttp {
  calls: HttpRequestOptions[] = [];
  private scripts = new Map<string, Array<() => ScriptedResponse>>();
  private routes = new Map<string, () => HttpResponse>();

  pathOf(opts: HttpRequestOptions): string {
    return new URL(opts.url).pathname;
  }

  /** One-shot override for the next request hitting pathPart (FIFO). */
  script(pathPart: string, respond: () => ScriptedResponse): void {
    const q = this.scripts.get(pathPart) ?? [];
    q.push(respond);
    this.scripts.set(pathPart, q);
  }

  scriptTimeout(pathPart: string): void {
    this.script(pathPart, () => new TransportTimeoutError(pathPart));
  }

  scriptApiError(pathPart: string, code: number, msg: string, status = 400): void {
    this.script(pathPart, () => jsonRes({ code, msg }, status));
  }

  route(pathPart: string, respond: () => HttpResponse): void {
    this.routes.set(pathPart, respond);
  }

  callsTo(pathPart: string): HttpRequestOptions[] {
    return this.calls.filter((c) => this.pathOf(c).includes(pathPart));
  }

  async request(opts: HttpRequestOptions): Promise<HttpResponse> {
    this.calls.push(opts);
    const p = this.pathOf(opts);
    for (const [part, q] of this.scripts) {
      if (p.includes(part) && q.length > 0) {
        const r = q.shift()!();
        if (r instanceof Error) throw r;
        return r;
      }
    }
    for (const [part, respond] of this.routes) {
      if (p.includes(part)) return respond();
    }
    return jsonRes({ code: -1121, msg: `no fake route for ${p}` }, 404);
  }
}

export class FakeWs implements WsLike {
  static instances: FakeWs[] = [];
  handlers: Partial<Record<"open" | "message" | "close" | "error", Array<(data?: unknown) => void>>> = {};
  closed = false;
  sent: string[] = [];

  constructor(readonly url: string) {
    FakeWs.instances.push(this);
  }

  static resetInstances(): void {
    FakeWs.instances = [];
  }

  static last(): FakeWs {
    return FakeWs.instances[FakeWs.instances.length - 1];
  }

  send(data: string): void {
    this.sent.push(data);
  }

  close(): void {
    if (this.closed) return;
    this.closed = true;
    this.emit("close");
  }

  on(event: "open" | "message" | "close" | "error", cb: (data?: unknown) => void): void {
    (this.handlers[event] ??= []).push(cb);
  }

  emit(event: "open" | "message" | "close" | "error", data?: unknown): void {
    for (const cb of this.handlers[event] ?? []) cb(data);
  }

  emitOpen(): void {
    this.emit("open");
  }

  emitMessage(payload: unknown): void {
    this.emit("message", JSON.stringify(payload));
  }

  emitClose(): void {
    this.emit("close");
  }
}

export function installFakes(http: FakeHttp): { http: FakeHttp; ws: { connect(url: string): WsLike } } {
  FakeWs.resetInstances();
  const ws = { connect: (url: string): WsLike => new FakeWs(url) };
  // Default account invariant for tests; individual tests can override this
  // route with a one-shot script when exercising hedge-mode handling.
  http.route("/fapi/v1/positionSide/dual", () => jsonRes({ dualSidePosition: false }));
  installBrokerClients({ http, ws });
  return { http, ws };
}

/** Deterministic timer control for classes accepting a timers dependency. */
export class ManualTimers {
  now = 0;
  private nextId = 1;
  private timers = new Map<number, { at: number; fn: () => void }>();

  readonly setTimeout = (fn: () => void, ms: number): unknown => {
    const id = this.nextId++;
    this.timers.set(id, { at: this.now + ms, fn });
    return id;
  };

  readonly clearTimeout = (h: unknown): void => {
    this.timers.delete(h as number);
  };

  get pending(): number {
    return this.timers.size;
  }

  advance(ms: number): void {
    const target = this.now + ms;
    for (;;) {
      let next: { id: number; at: number; fn: () => void } | null = null;
      for (const [id, t] of this.timers) {
        if (t.at <= target && (next === null || t.at < next.at || (t.at === next.at && id < next.id))) {
          next = { id, at: t.at, fn: t.fn };
        }
      }
      if (!next) break;
      this.now = next.at;
      this.timers.delete(next.id);
      next.fn();
    }
    this.now = target;
  }
}

// ---------------- exchange fixtures ----------------

export const BTCUSDT_INFO = {
  symbol: "BTCUSDT",
  status: "TRADING",
  baseAsset: "BTC",
  quoteAsset: "USDT",
  filters: [
    { filterType: "PRICE_FILTER", minPrice: "0.1", maxPrice: "1000000", tickSize: "0.1" },
    { filterType: "LOT_SIZE", minQty: "0.001", maxQty: "100", stepSize: "0.001" },
    { filterType: "MIN_NOTIONAL", notional: "5" },
    { filterType: "MAX_NUM_ORDERS", maxNumberOrders: 200 },
  ],
};

export function accountFixture(overrides: Partial<Record<string, string>> = {}): unknown {
  return {
    totalWalletBalance: overrides.totalWalletBalance ?? "1000",
    totalUnrealizedProfit: overrides.totalUnrealizedProfit ?? "0",
    totalMarginBalance: overrides.totalMarginBalance ?? "1000",
    availableBalance: overrides.availableBalance ?? "1000",
    maxWithdrawAmount: "1000",
    assets: [
      { asset: "USDT", walletBalance: "1000", unrealizedProfit: "0", availableBalance: "1000", marginBalance: "1000" },
    ],
  };
}

let nextOrderId = 1000;

export function orderFixture(overrides: Partial<{
  orderId: number;
  clientOrderId: string;
  symbol: string;
  side: "BUY" | "SELL";
  type: string;
  status: string;
  price: string;
  stopPrice: string;
  origQty: string;
  executedQty: string;
  avgPrice: string;
  reduceOnly: boolean;
  closePosition: boolean;
  time: number;
}>): Record<string, unknown> {
  return {
    orderId: overrides.orderId ?? ++nextOrderId,
    clientOrderId: overrides.clientOrderId ?? "fake",
    symbol: overrides.symbol ?? "BTCUSDT",
    side: overrides.side ?? "BUY",
    type: overrides.type ?? "LIMIT",
    status: overrides.status ?? "NEW",
    price: overrides.price ?? "0",
    stopPrice: overrides.stopPrice ?? "0",
    origQty: overrides.origQty ?? "0.001",
    executedQty: overrides.executedQty ?? "0",
    cumQuote: "0",
    avgPrice: overrides.avgPrice ?? "0",
    reduceOnly: overrides.reduceOnly ?? false,
    closePosition: overrides.closePosition ?? false,
    time: overrides.time ?? 1_700_000_000_000,
    updateTime: overrides.time ?? 1_700_000_000_000,
    workingTime: overrides.time ?? 1_700_000_000_000,
  };
}

export function orderEvent(opts: {
  clientOrderId: string;
  orderId?: number;
  tradeId?: number;
  symbol?: string;
  side?: "BUY" | "SELL";
  type?: string;
  status: string;
  lastFilledQty?: string;
  cumQty?: string;
  lastFilledPrice?: string;
  price?: string;
  qty?: string;
  realizedPnl?: string;
  E?: number;
  T?: number;
}): Record<string, unknown> {
  return {
    e: "ORDER_TRADE_UPDATE",
    E: opts.E ?? 1_700_000_000_100,
    T: opts.T ?? 1_700_000_000_100,
    o: {
      s: opts.symbol ?? "BTCUSDT",
      c: opts.clientOrderId,
      S: opts.side ?? "BUY",
      o: opts.type ?? "LIMIT",
      f: "GTC",
      q: opts.qty ?? "0.001",
      p: opts.price ?? "0",
      i: opts.orderId ?? 42,
      ...(opts.tradeId != null ? { t: opts.tradeId } : {}),
      X: opts.status,
      l: opts.lastFilledQty ?? "0",
      z: opts.cumQty ?? "0",
      L: opts.lastFilledPrice ?? "0",
      rp: opts.realizedPnl ?? "0",
      T: opts.T ?? 1_700_000_000_100,
    },
  };
}
