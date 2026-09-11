import { WebSocketServer, type WebSocket } from "ws";

/**
 * Minimal fake Binance USDT-M market-data endpoint for the UI smoke suite.
 * Accepts any combined-stream connection; the spec decides which frames to
 * send and when, so feed freshness/recovery behavior is fully deterministic.
 */
export class FakeBinanceFeed {
  readonly wss: WebSocketServer;
  readonly clients = new Set<WebSocket>();
  readonly requestedStreams: string[] = [];
  connections = 0;

  constructor(port: number) {
    this.wss = new WebSocketServer({ port });
    this.wss.on("connection", (ws, req) => {
      this.connections += 1;
      this.requestedStreams.push(req.url ?? "");
      this.clients.add(ws);
      const drop = () => this.clients.delete(ws);
      ws.on("close", drop);
      ws.on("error", drop);
    });
  }

  broadcast(obj: unknown) {
    const data = JSON.stringify(obj);
    for (const ws of this.clients) {
      if (ws.readyState === 1) ws.send(data);
    }
  }

  async close() {
    for (const ws of [...this.clients]) {
      try {
        ws.terminate();
      } catch {
        /* ignore */
      }
    }
    await new Promise<void>((resolve) => this.wss.close(() => resolve()));
  }
}

export function klineEvent(
  stream: string,
  binanceSym: string,
  interval: string,
  timeSec: number,
  price: number,
) {
  return {
    stream,
    data: {
      e: "kline",
      s: binanceSym,
      k: {
        t: timeSec * 1000,
        T: timeSec * 1000 + 59_999,
        s: binanceSym,
        i: interval,
        o: String(price),
        h: String(price),
        l: String(price),
        c: String(price),
        v: "10",
        x: false,
      },
    },
  };
}

export function miniTickerEvent(
  stream: string,
  binanceSym: string,
  price: number,
  eventTime: number,
) {
  return {
    stream,
    data: {
      e: "24hrMiniTicker",
      E: eventTime,
      s: binanceSym,
      c: String(price),
      o: "100",
      h: String(Math.max(100, price)),
      l: String(Math.min(100, price)),
      v: "10",
      q: "1000",
    },
  };
}

/** REST kline history (Binance row shape consumed by parseKlines). */
export function klineRows(count = 120, lastPrice = 100) {
  const day = 86_400;
  const lastDayOpen = Math.floor(Date.now() / 1000 / day) * day;
  const rows: unknown[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const idx = count - 1 - i;
    // Varied wave so the auto-scaled price axis has room for drag tests.
    const price =
      idx === count - 1 ? lastPrice : Math.round((100 + Math.sin(idx / 5) * 4) * 10) / 10;
    const t = (lastDayOpen - i * day) * 1000;
    rows.push([
      t,
      String(price),
      String(Math.round((price + 1.5) * 10) / 10),
      String(Math.round((price - 1.5) * 10) / 10),
      String(price),
      "10",
      t + day * 1000 - 1,
      "0",
      "0",
      "0",
      "0",
      "0",
    ]);
  }
  return rows;
}

export function currentDayOpenSec() {
  return Math.floor(Date.now() / 1000 / 86_400) * 86_400;
}
