import "server-only";

import { HOST_MAP } from "../env/config";
import { log } from "../log/logger";
import { brokerClients, type WsLike } from "./transport";
import { applyMarkPrice } from "./state";
import { publishLive } from "./sse";

/**
 * Public mark-price stream (no credentials, no listen key).
 *
 * Connects to `<uds>/stream?streams=...` with combined `btcusdt@markPrice@1s`
 * channels for every open-position symbol. Each valid event immediately
 * recalculates that position's unrealized PnL and republishes account state,
 * replacing the fixed 15s REST poll as the primary freshness source. The REST
 * poller remains as a fallback (stream down / symbol set changed).
 *
 * Safety properties:
 *  - Public endpoint: the URL contains no API key, listen key, or signature.
 *  - Malformed payloads are counted and ignored, never thrown.
 *  - Drops reconnect with exponential backoff (1s → 30s cap).
 *  - Stale detection: if no event arrives within STALE_AFTER_MS, status
 *    reports stale so the client can surface it. The periodic snapshot/recon
 *    remains the safety net.
 *  - Generation guard: callbacks from a superseded instance/generation
 *    cannot mutate state or reschedule timers after stop().
 */

const CONNECT_TIMEOUT_MS = 10_000;
const RECONNECT_BASE_MS = 1_000;
const RECONNECT_MAX_MS = 30_000;
/** No mark event for this long ⇒ the stream is considered stale. */
export const MARK_STALE_AFTER_MS = 10_000;

interface MarkPriceEvent {
  e: string;
  s?: string;
  p?: string;
  E?: number;
}

export interface MarkPriceStreamStatus {
  connected: boolean;
  stale: boolean;
  symbols: string[];
  lastEventAt: number | null;
  reconnects: number;
  malformedEvents: number;
  generation: number;
}

export class MarkPriceStream {
  private ws: WsLike | null = null;
  private stopped = true;
  private generation = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private staleTimer: ReturnType<typeof setInterval> | null = null;
  private reconnectAttempt = 0;
  private reconnects = 0;
  private malformedEvents = 0;
  private lastEventAt: number | null = null;
  private symbols: string[] = [];

  constructor(
    private readonly cfgEnv: "testnet" | "shadow" | "production" | "local",
    private readonly onStatusChange: () => void = () => undefined,
  ) {}

  status(): MarkPriceStreamStatus {
    const stale = this.lastEventAt == null || Date.now() - this.lastEventAt > MARK_STALE_AFTER_MS;
    return {
      connected: this.ws != null && !this.stopped,
      stale: this.stopped ? true : this.symbols.length === 0 ? false : stale,
      symbols: [...this.symbols],
      lastEventAt: this.lastEventAt,
      reconnects: this.reconnects,
      malformedEvents: this.malformedEvents,
      generation: this.generation,
    };
  }

  /**
   * (Re)subscribes for the given symbols. Safe to call repeatedly: a symbol
   * set change rotates the socket; an identical set is a no-op.
   */
  syncSymbols(symbols: string[]): void {
    const next = [...new Set(symbols)].sort();
    const prev = [...this.symbols].sort();
    if (!this.stopped && next.length > 0 && next.join(",") === prev.join(",")) return;
    this.symbols = next;
    if (next.length === 0) {
      // Fully quiesce: no socket, no pending reconnect, no stale watcher.
      // Everything this method can arm is cleared so an empty subscription
      // leaves zero live timers behind (shutdown-safe, test-friendly).
      this.closeSocket();
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }
      this.stopStaleWatcher();
      return;
    }
    this.rotate();
  }

  stop(): void {
    this.stopped = true;
    this.generation += 1;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = null;
    this.stopStaleWatcher();
    this.closeSocket();
    this.symbols = [];
    this.lastEventAt = null;
  }

  private closeSocket(): void {
    const ws = this.ws;
    this.ws = null;
    if (!ws) return;
    try {
      ws.close();
    } catch {
      // Already closed.
    }
  }

  private stopStaleWatcher(): void {
    if (this.staleTimer) clearInterval(this.staleTimer);
    this.staleTimer = null;
  }

  private rotate(): void {
    const generation = ++this.generation;
    this.closeSocket();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.stopped = false;
    this.connect(generation);
    this.startStaleWatcher();
  }

  private url(): string {
    const host = HOST_MAP[this.cfgEnv].uds;
    const streams = this.symbols.map((s) => `${s.toLowerCase()}@markPrice@1s`).join("/");
    return `${host}/stream?streams=${streams}`;
  }

  private connect(generation: number): void {
    if (this.stopped || generation !== this.generation) return;
    // A reconnect timer firing after the symbol set emptied must not open a
    // socket to a stream-less URL (`/stream?streams=`).
    if (this.symbols.length === 0) return;
    let ws: WsLike;
    try {
      ws = brokerClients().ws.connect(this.url());
    } catch (err) {
      log.warn("mark-price stream connect failed", { error: String(err) });
      this.scheduleReconnect(generation);
      return;
    }
    this.ws = ws;
    ws.on("open", () => {
      if (generation !== this.generation || this.stopped) return;
      this.reconnectAttempt = 0;
      this.lastEventAt = Date.now();
      log.info("mark-price stream connected", { symbols: this.symbols.length });
      this.onStatusChange();
    });
    ws.on("message", (data: unknown) => this.onMessage(generation, typeof data === "string" ? data : String(data)));
    ws.on("close", () => this.onDrop(generation));
    ws.on("error", () => {
      if (generation !== this.generation || this.stopped) return;
      // close always follows error; nothing else to do here.
    });
  }

  private onMessage(generation: number, raw: string): void {
    if (this.stopped || generation !== this.generation) return;
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      this.malformedEvents += 1;
      return;
    }
    try {
      // Combined-stream wrapper: { stream, data }.
      if (parsed && typeof parsed === "object" && "data" in (parsed as Record<string, unknown>)) {
        parsed = (parsed as { data: unknown }).data;
      }
    } catch {
      this.malformedEvents += 1;
      return;
    }
    {
      const ev = parsed as MarkPriceEvent;
      if (!ev || typeof ev !== "object") {
        this.malformedEvents += 1;
        return;
      }
      if (ev.e !== "markPriceUpdate" || typeof ev.s !== "string" || typeof ev.p !== "string") {
        this.malformedEvents += 1;
        return;
      }
      const price = Number(ev.p);
      if (!Number.isFinite(price) || price <= 0) {
        this.malformedEvents += 1;
        return;
      }
      this.lastEventAt = Date.now();
      const changed = applyMarkPrice(ev.s, ev.p, this.lastEventAt);
      if (changed) publishLive("account-update", { at: this.lastEventAt });
    }
  }

  private onDrop(generation: number): void {
    if (this.stopped || generation !== this.generation) return;
    this.ws = null;
    this.onStatusChange();
    this.scheduleReconnect(generation);
  }

  private scheduleReconnect(generation: number): void {
    if (this.stopped || generation !== this.generation) return;
    const delay = Math.min(RECONNECT_MAX_MS, RECONNECT_BASE_MS * 2 ** Math.min(this.reconnectAttempt, 5));
    this.reconnectAttempt += 1;
    this.reconnects += 1;
    this.reconnectTimer = setTimeout(() => {
      if (this.stopped || generation !== this.generation) return;
      this.connect(generation);
    }, delay);
  }

  /**
   * Stale watcher: while the stream is up but silent too long, nudge health
   * publishing so the client's freshness badge degrades instead of freezing.
   */
  private startStaleWatcher(): void {
    this.stopStaleWatcher();
    this.staleTimer = setInterval(() => {
      if (this.stopped) return;
      if (this.symbols.length === 0) return;
      const status = this.status();
      if (status.stale) log.debug("mark-price stream stale", { lastEventAt: this.lastEventAt });
    }, MARK_STALE_AFTER_MS);
  }
}
