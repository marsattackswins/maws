import { MarkPriceStream, MARK_STALE_AFTER_MS } from "@/lib/server/binance/mark-price-stream";
import { applyMarkPrice, applyPositionSnapshot, liveState, resetLiveStateForTests } from "@/lib/server/binance/state";
import { freshEnv, makeCfg, FakeWs } from "./helpers";
import { installBrokerClients } from "@/lib/server/binance/transport";

/** freshEnv resets everything including the DB; call AFTER it, never before. */
function resetState() {
  resetLiveStateForTests();
}


/** Raw combined-stream payload as Binance sends it. */
function markEvent(symbol: string, price: string) {
  return { stream: `${symbol.toLowerCase()}@markPrice@1s`, data: { e: "markPriceUpdate", s: symbol, p: price, E: Date.now() } };
}

/** emitMessage stringifies internally — this sends raw JSON strings. */
function emitRaw(ws: FakeWs, payload: unknown): void {
  ws.emit("message", typeof payload === "string" ? payload : JSON.stringify(payload));
}

function setupStream(symbols: string[] = ["BTCUSDT"]) {
  // Fresh env per setup; callers must create positions AFTER this call
  // (freshEnv resets live state).
  freshEnv(makeCfg());
  const http = { request: async () => ({ status: 200, headers: {}, body: "{}" }) };
  installBrokerClients({
    http,
    ws: { connect: (url: string) => new FakeWs(url) },
  });
  const stream = new MarkPriceStream("testnet");
  stream.syncSymbols(symbols);
  return stream;
}

/** Fresh env + seeded position, so mark events have something to update. */
function setupWithPosition(rows: unknown[], symbols?: string[]) {
  const stream = setupStream(symbols);
  applyPositionSnapshot(rows as never);
  return stream;
}

const wsLast = () => FakeWs.last();

describe("mark-price stream: PnL recalculation", () => {
  beforeEach(() => {
    resetState();
  });

  test("a mark-price event immediately recalculates unrealized PnL", async () => {
    const stream = setupWithPosition([
      { symbol: "BTCUSDT", positionAmt: "0.002", entryPrice: "50000", markPrice: "50000", unRealizedProfit: "0", liquidationPrice: "0", leverage: "10", positionSide: "BOTH" },
    ]);
    expect(liveState().positions.get("BTCUSDT")?.unrealizedProfit).toBe("0");

    wsLast().emitOpen();
    emitRaw(wsLast(), markEvent("BTCUSDT", "51000"));

    const pos = liveState().positions.get("BTCUSDT")!;
    expect(pos.markPrice).toBe("51000");
    expect(Number(pos.unrealizedProfit)).toBeCloseTo(2); // (51000-50000)*0.002
    stream.stop();
  });

  test("multiple symbols update independently", () => {
    const stream = setupWithPosition([
      { symbol: "BTCUSDT", positionAmt: "0.002", entryPrice: "50000", markPrice: "50000", unRealizedProfit: "0", liquidationPrice: "0", leverage: "10", positionSide: "BOTH" },
      { symbol: "ETHUSDT", positionAmt: "-1", entryPrice: "3000", markPrice: "3000", unRealizedProfit: "0", liquidationPrice: "0", leverage: "5", positionSide: "BOTH" },
    ], ["BTCUSDT", "ETHUSDT"]);
    wsLast().emitOpen();
    emitRaw(wsLast(), markEvent("ETHUSDT", "2900"));
    expect(liveState().positions.get("ETHUSDT")?.unrealizedProfit).toBe("100"); // short: (3000-2900)*1
    expect(liveState().positions.get("BTCUSDT")?.unrealizedProfit).toBe("0"); // untouched

    emitRaw(wsLast(), markEvent("BTCUSDT", "52000"));
    expect(liveState().positions.get("BTCUSDT")?.unrealizedProfit).toBe("4");
    expect(liveState().positions.get("ETHUSDT")?.unrealizedProfit).toBe("100");
    stream.stop();
  });

  test("unknown symbols and unchanged positions are ignored", () => {
    const stream = setupStream();
    wsLast().emitOpen();
    emitRaw(wsLast(), markEvent("NOPEUSDT", "1"));
    expect(liveState().positions.size).toBe(0);
    stream.stop();
  });
});

describe("mark-price stream: malformed events and safety", () => {
  beforeEach(() => {
    resetState();
  });

  test("malformed payloads are counted and ignored, never thrown", () => {
    const stream = setupStream();
    wsLast().emitOpen();
    expect(() => wsLast().emitMessage("not-json")).not.toThrow();
    expect(() => emitRaw(wsLast(), { e: "aggTrade" })).not.toThrow();
    expect(() => emitRaw(wsLast(), markEvent("BTCUSDT", "garbage"))).not.toThrow();
    expect(() => emitRaw(wsLast(), { stream: "x", data: null })).not.toThrow();
    expect(stream.status().malformedEvents).toBeGreaterThanOrEqual(4);
    stream.stop();
  });

  test("event without an open position does not create one and counts as applied-but-unchanged", () => {
    const stream = setupStream();
    wsLast().emitOpen();
    emitRaw(wsLast(), markEvent("BTCUSDT", "50000"));
    expect(liveState().positions.size).toBe(0);
    expect(stream.status().lastEventAt).not.toBeNull(); // still fresh
    stream.stop();
  });
});

describe("mark-price stream: reconnect and stale detection", () => {
  beforeEach(() => {
    resetState();
    FakeWs.resetInstances();
  });

  test("drop schedules a reconnect with backoff and connects again", () => {
    jest.useFakeTimers();
    try {
      const stream = setupStream();
      const first = wsLast();
      first.emitOpen();
      first.emitClose();
      expect(stream.status().connected).toBe(false);
      expect(stream.status().reconnects).toBe(1);

      jest.advanceTimersByTime(1000); // base backoff
      const second = wsLast();
      expect(second).not.toBe(first);
      second.emitOpen();
      expect(stream.status().connected).toBe(true);
      expect(stream.status().reconnects).toBe(1);
      stream.stop();
    } finally {
      jest.useRealTimers();
    }
  });

  test("repeated failures back off exponentially up to the cap", () => {
    jest.useFakeTimers();
    try {
      const stream = setupStream();
      let ws = wsLast();
      ws.emitOpen();
      for (let i = 1; i <= 6; i++) {
        ws.emitClose();
        jest.advanceTimersByTime(Math.min(30_000, 1000 * 2 ** Math.min(i - 1, 5)));
        ws = wsLast();
        expect(ws).not.toBeFalsy();
      }
      // After 5 attempts the delay is capped at 30s; a shorter wait must not reconnect.
      const before = FakeWs.instances.length;
      ws.emitClose();
      jest.advanceTimersByTime(29_999);
      expect(FakeWs.instances.length).toBe(before);
      jest.advanceTimersByTime(1);
      expect(FakeWs.instances.length).toBeGreaterThan(before);
      stream.stop();
    } finally {
      jest.useRealTimers();
    }
  });

  test("status reports stale after the stale window with no events", () => {
    jest.useFakeTimers();
    try {
      const stream = setupStream();
      const ws = wsLast();
      ws.emitOpen();
      emitRaw(ws, markEvent("BTCUSDT", "50000"));
      expect(stream.status().stale).toBe(false);
      jest.advanceTimersByTime(MARK_STALE_AFTER_MS + 1);
      expect(stream.status().stale).toBe(true);
      stream.stop();
      expect(stream.status().stale).toBe(true); // stopped is always stale
    } finally {
      jest.useRealTimers();
    }
  });

  test("stop() closes the socket and old callbacks cannot mutate state", () => {
    const stream = setupWithPosition([
      { symbol: "BTCUSDT", positionAmt: "0.002", entryPrice: "50000", markPrice: "50000", unRealizedProfit: "0", liquidationPrice: "0", leverage: "10", positionSide: "BOTH" },
    ]);
    const ws = wsLast();
    ws.emitOpen();
    stream.stop();
    expect(stream.status().connected).toBe(false);
    // Event delivered after stop is ignored (generation guard).
    emitRaw(ws, markEvent("BTCUSDT", "99000"));
    expect(liveState().positions.get("BTCUSDT")?.markPrice).toBe("50000");
  });

  test("symbol set change rotates the socket with the new streams", () => {
    const stream = setupStream(["BTCUSDT"]);
    const before = FakeWs.instances.length;
    stream.syncSymbols(["BTCUSDT", "ETHUSDT"]);
    expect(FakeWs.instances.length).toBe(before + 1);
    expect(wsLast().url).toContain("btcusdt@markPrice@1s");
    expect(wsLast().url).toContain("ethusdt@markPrice@1s");
    // Same set is a no-op.
    stream.syncSymbols(["ETHUSDT", "BTCUSDT"]);
    expect(FakeWs.instances.length).toBe(before + 1);
    stream.stop();
  });

  test("empty symbol set closes the stream", () => {
    const stream = setupStream(["BTCUSDT"]);
    wsLast().emitOpen();
    stream.syncSymbols([]);
    expect(stream.status().connected).toBe(false);
    expect(stream.status().symbols).toHaveLength(0);
    stream.stop();
  });
});

describe("mark-price stream: endpoint and privacy", () => {
  test("public testnet URL with no credentials or listen key", () => {
    const stream = setupStream(["BTCUSDT"]);
    const url = wsLast().url;
    expect(url).toContain("wss://fstream.binancefuture.com/stream?streams=");
    expect(url).toContain("btcusdt@markPrice@1s");
    expect(url).not.toContain("listenKey");
    expect(url).not.toContain("api_key");
    expect(url).not.toContain("signature");
    stream.stop();
    stream.stop();
  });
});

describe("applyMarkPrice change detection", () => {
  beforeEach(() => resetLiveStateForTests());

  test("returns whether the position changed", () => {
    expect(applyMarkPrice("BTCUSDT", "50000")).toBe(false); // no position
    applyPositionSnapshot([
      { symbol: "BTCUSDT", positionAmt: "0.002", entryPrice: "50000", markPrice: "50000", unRealizedProfit: "0", liquidationPrice: "0", leverage: "10", positionSide: "BOTH" },
    ] as never);
    expect(applyMarkPrice("BTCUSDT", "50000")).toBe(true); // updatedAt changes
    expect(applyMarkPrice("BTCUSDT", "bad")).toBe(false);
    expect(applyMarkPrice("BTCUSDT", "0")).toBe(false);
  });
});
