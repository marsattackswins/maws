import "server-only";

import { HOST_MAP } from "../env/config";
import { log } from "../log/logger";
import { getTimestamp } from "./clock";
import type { StreamOwnerLease } from "./lease";
import type { BinanceRestClient } from "./rest";
import { brokerClients, type WsLike } from "./transport";
import type { UserStreamEvent } from "./types";
import { getBinanceStreamBreaker } from "../resilience/breakers";
import { trackWsError, trackWsLag, trackWsMessage, trackWsReconnect } from "../metrics/instrument";

export interface StreamStatus {
  connected: boolean;
  leaseOwned?: boolean;
  phase: string;
  reconnects: number;
  buffering?: boolean;
  lastEventAt?: number | null;
  generation?: number;
  bufferOverflow?: boolean;
  lastApplicationEventAt?: number | null;
  startedAt?: number | null;
  circuitState?: string;
}

export interface StreamDeps {
  cfgEnv: "testnet" | "shadow" | "production";
  rest: BinanceRestClient;
  lease: StreamOwnerLease;
  /** REST snapshot: applies account/positions/openOrders truth to state. */
  takeSnapshot(): Promise<void>;
  /** Applies a verified event to state, persists it, emits SSE. */
  processEvent(ev: UserStreamEvent): unknown;
  /** Optional escalation after a buffer overflow has proven data loss. */
  reconcile?(): Promise<unknown>;
  freeze(reason: string): void;
  onStatus(status: StreamStatus): void;
  timers?: {
    setTimeout: (fn: () => void, ms: number) => unknown;
    clearTimeout: (h: unknown) => void;
  };
}

const KEEPALIVE_MS = 25 * 60 * 1000;
const ROTATE_MS = 23 * 60 * 60 * 1000;
const MAX_BUFFER = 5000;

/**
 * Server-owned user-data stream. Recovery is snapshot-plus-buffer. Socket
 * callbacks carry the generation that created them, so an old socket cannot
 * clear or mutate the current connection during rotation/reconnect.
 */
export class UserDataStream {
  private ws: WsLike | null = null;
  private listenKey: string | null = null;
  private listenKeyCreatedAt = 0;
  private buffering = false;
  private buffer: UserStreamEvent[] = [];
  private stopped = true;
  private reconnectAttempt = 0;
  private reconnectTimer: unknown = null;
  private keepaliveTimer: unknown = null;
  private leaseTimer: unknown = null;
  private reconnects = 0;
  private generation = 0;
  private startedAt: number | null = null;
  private lastEventAt: number | null = null;
  private lastApplicationEventAt: number | null = null;
  private bufferOverflow = false;
  private timers: NonNullable<StreamDeps["timers"]>;

  constructor(private readonly deps: StreamDeps) {
    this.timers = deps.timers ?? { setTimeout: (fn, ms) => setTimeout(fn, ms), clearTimeout: (h) => clearTimeout(h as ReturnType<typeof setTimeout>) };
  }

  status(): StreamStatus & { listenKeyAgeMs: number; buffering: boolean; lastEventAt: number | null } {
    return {
      connected: this.ws != null && !this.buffering && !this.stopped,
      leaseOwned: this.deps.lease.isOwner(),
      phase: this.buffering ? "snapshot" : this.stopped ? "closed" : "live",
      buffering: this.buffering,
      reconnects: this.reconnects,
      listenKeyAgeMs: this.listenKeyCreatedAt === 0 ? 0 : Date.now() - this.listenKeyCreatedAt,
      generation: this.generation,
      bufferOverflow: this.bufferOverflow,
      lastApplicationEventAt: this.lastApplicationEventAt,
      lastEventAt: this.lastEventAt,
      startedAt: this.startedAt,
      circuitState: this.streamCircuitState(),
    };
  }

  async start(): Promise<void> {
    this.stopped = false;
    this.startedAt = Date.now();
    const startGeneration = this.generation;
    if (!this.deps.lease.tryAcquire()) {
      log.warn("another server instance owns the user-data stream; standing by");
      this.deps.onStatus({ connected: false, leaseOwned: false, phase: "standby", reconnects: 0, generation: this.generation, bufferOverflow: this.bufferOverflow, lastApplicationEventAt: this.lastApplicationEventAt, startedAt: this.startedAt, circuitState: this.streamCircuitState() });
      return;
    }
    this.startLeaseRenewal();
    await this.openWithNewListenKey();
    if (this.stopped || this.generation !== startGeneration + 1) return;
    this.startKeepalive();
  }

  stop(): void {
    void this.stopAndWait().catch(() => undefined);
  }

  /** Stops all stream resources and reports listen-key cleanup failures. */
  async stopAndWait(): Promise<void> {
    this.stopped = true;
    this.generation += 1;
    for (const h of [this.reconnectTimer, this.keepaliveTimer, this.leaseTimer]) {
      if (h != null) this.timers.clearTimeout(h);
    }
    this.reconnectTimer = this.keepaliveTimer = this.leaseTimer = null;
    if (this.ws) {
      try {
        this.ws.close();
      } catch {
        // Already closed.
      }
      this.ws = null;
    }
    const listenKey = this.listenKey;
    this.listenKey = null;
    this.deps.lease.release();
    // Lease loss must invalidate the health signal immediately; otherwise a
    // stale "connected/owned" signal could keep normal submissions open.
    this.notify({ connected: false, phase: "closed" });
    let cleanupError: unknown = null;
    if (listenKey) {
      try {
        await this.deps.rest.closeListenKey(listenKey);
      } catch (error) {
        cleanupError = error;
      }
    }
    if (cleanupError) throw cleanupError;
  }

  private streamCircuitState(): string {
    try {
      return getBinanceStreamBreaker().getState();
    } catch {
      return "unknown";
    }
  }

  private notify(status: Partial<StreamStatus>): void {
    this.deps.onStatus({
      connected: this.ws != null && !this.buffering && !this.stopped,
      leaseOwned: this.deps.lease.isOwner(),
      phase: "live",
      reconnects: this.reconnects,
      generation: this.generation,
      bufferOverflow: this.bufferOverflow,
      lastApplicationEventAt: this.lastApplicationEventAt,
      startedAt: this.startedAt,
      circuitState: this.streamCircuitState(),
      ...status,
    });
  }

  private startLeaseRenewal(): void {
    const ttl = 30_000;
    const renew = () => {
      if (this.stopped) return;
      if (!this.deps.lease.renew()) {
        log.warn("lost stream lease; stopping stream");
        this.stop();
        return;
      }
      this.leaseTimer = this.timers.setTimeout(renew, ttl);
    };
    this.leaseTimer = this.timers.setTimeout(renew, ttl);
  }

  private startKeepalive(): void {
    const tick = () => {
      if (this.stopped || !this.listenKey) return;
      const age = Date.now() - this.listenKeyCreatedAt;
      if (age > ROTATE_MS) {
        void this.openWithNewListenKey().catch((err) => {
          log.warn("listen key rotation failed", { error: String(err) });
          this.scheduleReconnect();
        });
      } else {
        this.deps.rest.keepaliveListenKey(this.listenKey).catch((err) => {
          log.warn("listenKey keepalive failed", { error: String(err) });
        });
      }
      this.keepaliveTimer = this.timers.setTimeout(tick, KEEPALIVE_MS);
    };
    this.keepaliveTimer = this.timers.setTimeout(tick, KEEPALIVE_MS);
  }

  private async openWithNewListenKey(): Promise<void> {
    const operationGeneration = this.generation;
    await getBinanceStreamBreaker().execute(async () => {
      const { listenKey } = await this.deps.rest.createListenKey();
      if (this.stopped || this.generation !== operationGeneration) {
        this.deps.rest.closeListenKey(listenKey).catch(() => undefined);
        return;
      }
      const old = this.listenKey;
      this.listenKey = listenKey;
      this.listenKeyCreatedAt = Date.now();
      this.connectWs();
      if (old && old !== listenKey) this.deps.rest.closeListenKey(old).catch(() => undefined);
    });
  }

  private connectWs(): void {
    const generation = ++this.generation;
    const host = HOST_MAP[this.deps.cfgEnv].uds;
    const ws = brokerClients().ws.connect(`${host}/ws/${this.listenKey}`);
    this.ws = ws;
    ws.on("open", () => this.onOpen(generation));
    ws.on("message", (data: unknown) => this.onMessage(generation, typeof data === "string" ? data : String(data)));
    ws.on("close", () => this.onDrop(generation));
    ws.on("error", (err: unknown) => {
      if (generation !== this.generation) return;
      trackWsError(String(err));
      log.warn("user-data stream error", { generation, error: String(err) });
    });
  }

  private onOpen(generation: number): void {
    if (generation !== this.generation || this.stopped) return;
    this.buffering = true;
    this.buffer = [];
    this.notify({ connected: false, phase: "snapshot" });
    void this.recover(generation);
  }

  private async recover(generation: number): Promise<void> {
    const cutoff = getTimestamp();
    try {
      await this.deps.takeSnapshot();
      if (generation !== this.generation || this.stopped) return;
      const buffered = this.buffer;
      const overflowed = this.bufferOverflow;
      this.buffer = [];
      this.buffering = false;

      if (overflowed) {
        this.deps.freeze("user-data stream buffer overflow; account data was lost");
        if (this.deps.reconcile) {
          try {
            const result = await this.deps.reconcile();
            if (result && typeof result === "object" && "result" in result && (result as { result?: string }).result === "ok") {
              this.bufferOverflow = false;
            }
          } catch (err) {
            log.error("buffer overflow reconciliation failed", { error: String(err) });
          }
        }
      } else {
        let applied = 0;
        for (const ev of buffered) {
          if (generation !== this.generation || this.stopped) return;
          if (typeof ev.E === "number" && ev.E > cutoff) {
            await this.deps.processEvent(ev);
            applied += 1;
          }
        }
        log.info("user-data stream recovered", { buffered: buffered.length, applied, generation });
      }
      this.reconnectAttempt = 0;
      this.notify({ connected: true, phase: overflowed ? "reconciled" : "live" });
    } catch (err) {
      log.error("snapshot recovery failed; scheduling reconnect", { generation, error: String(err) });
      this.deps.freeze("stream snapshot recovery failed");
      this.scheduleReconnect();
    }
  }

  private onMessage(generation: number, raw: string): void {
    if (generation !== this.generation || this.stopped) return;
    let parsed: UserStreamEvent;
    try {
      parsed = JSON.parse(raw) as UserStreamEvent;
    } catch {
      return;
    }
    this.lastEventAt = Date.now();
    trackWsMessage();
    if (typeof parsed.E === "number") trackWsLag(Math.max(0, this.lastEventAt - parsed.E));
    if (parsed.e === "ORDER_TRADE_UPDATE" || parsed.e === "ACCOUNT_UPDATE") this.lastApplicationEventAt = this.lastEventAt;
    if (this.buffering) {
      if (this.buffer.length < MAX_BUFFER) {
        this.buffer.push(parsed);
      } else if (!this.bufferOverflow) {
        this.bufferOverflow = true;
        this.deps.freeze("user-data stream buffer overflow; account data was lost");
        this.notify({ connected: false, phase: "buffer-overflow" });
      }
      return;
    }
    void Promise.resolve(this.deps.processEvent(parsed)).catch((err) => {
      log.error("user-data stream event processing failed", { generation, error: String(err) });
      this.deps.freeze("user-data event processing failed");
    });
  }

  private onDrop(generation: number): void {
    if (generation !== this.generation || this.stopped) return;
    this.ws = null;
    this.buffering = false;
    this.buffer = [];
    this.notify({ connected: false, phase: "reconnecting" });
    this.deps.freeze("user-data stream disconnected; recovering");
    trackWsError("user-data socket disconnected");
    void getBinanceStreamBreaker().execute(async () => {
      throw new Error("user-data socket disconnected");
    }).catch(() => undefined);
    this.scheduleReconnect();
  }

  private scheduleReconnect(): void {
    if (this.stopped) return;
    const delay = Math.min(30_000, 1000 * 2 ** Math.min(this.reconnectAttempt, 5));
    this.reconnectAttempt += 1;
    this.reconnectTimer = this.timers.setTimeout(() => void this.reconnect(), delay);
  }

  private async reconnect(): Promise<void> {
    if (this.stopped || !this.deps.lease.isOwner()) return;
    this.reconnects += 1;
    trackWsReconnect("socket disconnected");
    try {
      await getBinanceStreamBreaker().execute(async () => {
        this.connectWs();
      });
    } catch (err) {
      log.warn("reconnect failed", { error: String(err), circuitState: this.streamCircuitState() });
      this.notify({ connected: false, phase: "circuit-open" });
      this.scheduleReconnect();
    }
  }
}
