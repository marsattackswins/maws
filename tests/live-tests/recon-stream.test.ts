import { Reconciler } from "@/lib/server/binance/recon";
import { UserDataStream } from "@/lib/server/binance/stream";
import { StreamOwnerLease } from "@/lib/server/binance/lease";
import { BinanceRestClient } from "@/lib/server/binance/rest";
import { RateLimiter } from "@/lib/server/binance/ratelimit";
import { createIntent, findByClientOrderId, updateIntent } from "@/lib/server/binance/intents";
import { liveState, normalizeBinanceOrder } from "@/lib/server/binance/state";
import { realizedSinceUtcMidnight } from "@/lib/server/binance/risk";
import type { BinanceOrder } from "@/lib/server/binance/types";
import { getDb } from "@/lib/server/db/connection";
import { FakeHttp, FakeWs, freshEnv, installFakes, jsonRes, makeCfg, ManualTimers, orderFixture } from "./helpers";

function makeRest(cfg = freshEnv(makeCfg())) {
  const http = new FakeHttp();
  installFakes(http);
  http.route("/fapi/v1/userTrades", () => jsonRes([]));
  const rest = new BinanceRestClient(cfg, new RateLimiter(cfg.rateInternalPerMin), async () => undefined);
  rest.setTransportForTests(http);
  return { cfg, http, rest };
}

describe("reconciliation: exchange truth settles everything", () => {
  function setupRecon(snapshotImpl?: () => Promise<void>) {
    const env = makeRest();
    const freezes: string[] = [];
    let unfreezes = 0;
    const recon = new Reconciler({
      rest: env.rest,
      snapshot: snapshotImpl ?? (async () => undefined),
      freeze: (r) => freezes.push(r),
      unfreeze: () => {
        unfreezes += 1;
      },
    });
    return { ...env, recon, freezes, get unfreezes() { return unfreezes; } };
  }

  const seedIntent = (clientOrderId: string, status: string) => {
    createIntent({ clientOrderId, kind: "order", symbol: "BTCUSDT", side: "BUY", type: "LIMIT", qty: "0.001" });
    updateIntent(clientOrderId, { status: status as never });
  };

  test("matching intents and open orders reconcile clean and unfreeze", async () => {
    const h = setupRecon();
    seedIntent("rc1", "SUBMITTED");
    h.http.route("/fapi/v1/order", () => jsonRes(orderFixture({ clientOrderId: "rc1", status: "NEW" })));
    liveState().openOrders.set("rc1", normalizeBinanceOrder(orderFixture({ clientOrderId: "rc1", status: "NEW" }) as unknown as BinanceOrder));

    const result = await h.recon.run("test");
    expect(result.result).toBe("ok");
    expect(h.unfreezes).toBe(1);
    expect(h.freezes).toHaveLength(0);
    const rows = getDb().prepare(`SELECT trigger, result FROM reconciliation_runs`).all() as Array<{ trigger: string; result: string }>;
    expect(rows[0]).toMatchObject({ trigger: "test", result: "ok" });
  });

  test("status drift is synced from the exchange", async () => {
    const h = setupRecon();
    seedIntent("rc2", "SUBMITTED");
    h.http.route("/fapi/v1/order", () =>
      jsonRes(orderFixture({ clientOrderId: "rc2", status: "FILLED", executedQty: "0.001", avgPrice: "50000" })),
    );
    const result = await h.recon.run("test");
    expect(result.result).toBe("ok");
    expect(result.diffs.some((d) => d.includes("synced SUBMITTED -> FILLED"))).toBe(true);
    expect(findByClientOrderId("rc2")?.status).toBe("FILLED");
  });

  test("reconciliation backfills a missed user trade and realized P&L", async () => {
    const h = setupRecon();
    seedIntent("rc-fill", "SUBMITTED");
    updateIntent("rc-fill", { exchangeOrderId: 123 });
    h.http.route("/fapi/v1/order", () => jsonRes(orderFixture({ clientOrderId: "rc-fill", orderId: 123, status: "FILLED", executedQty: "0.001", avgPrice: "50000" })));
    h.http.route("/fapi/v1/userTrades", () => jsonRes([
      { id: 9001, orderId: 123, price: "50000", qty: "0.001", realizedPnl: "-12.5", commission: "0.1", commissionAsset: "USDT", time: Date.now(), side: "SELL" },
    ]));

    const result = await h.recon.run("missed-fill");
    expect(result.result).toBe("ok");
    const row = getDb().prepare(`SELECT trade_id, realized_pnl, source FROM fills_log WHERE trade_id = ?`).get("9001") as { trade_id: string; realized_pnl: string; source: string };
    expect(row).toEqual({ trade_id: "9001", realized_pnl: "-12.5", source: "rest" });
    expect(realizedSinceUtcMidnight()).toBeCloseTo(-12.5);
  });

  test("uncertain intent missing on exchange becomes REJECTED without drift", async () => {
    const h = setupRecon();
    seedIntent("rc3", "TIMEOUT_UNKNOWN");
    h.http.scriptApiError("/fapi/v1/order", -2013, "Order does not exist", 400);
    const result = await h.recon.run("test");
    expect(result.result).toBe("ok");
    expect(findByClientOrderId("rc3")?.status).toBe("REJECTED");
  });

  test("believed-active order with no exchange record is drift and freezes", async () => {
    const h = setupRecon();
    seedIntent("rc4", "SUBMITTED");
    h.http.scriptApiError("/fapi/v1/order", -2013, "Order does not exist", 400);
    const result = await h.recon.run("test");
    expect(result.result).toBe("drift");
    expect(h.freezes.length).toBe(1);
    expect(h.freezes[0]).toContain("reconciliation drift");
  });

  test("open order without an intent is drift and freezes", async () => {
    const h = setupRecon();
    liveState().openOrders.set("ghost", normalizeBinanceOrder(orderFixture({ clientOrderId: "ghost", status: "NEW" }) as unknown as BinanceOrder));
    const result = await h.recon.run("test");
    expect(result.result).toBe("drift");
    expect(result.diffs.some((d) => d.includes("without an intent"))).toBe(true);
    expect(h.freezes.length).toBe(1);
  });

  test("active exchange order missing from the snapshot is drift", async () => {
    const h = setupRecon();
    seedIntent("rc5", "SUBMITTED");
    h.http.route("/fapi/v1/order", () => jsonRes(orderFixture({ clientOrderId: "rc5", status: "NEW" })));
    // openOrders snapshot deliberately lacks rc5
    const result = await h.recon.run("test");
    expect(result.result).toBe("drift");
    expect(result.diffs.some((d) => d.includes("missing from snapshot"))).toBe(true);
  });

  test("snapshot failure freezes as error and persists the run", async () => {
    const h = setupRecon(async () => {
      throw new Error("rest down");
    });
    const result = await h.recon.run("test");
    expect(result.result).toBe("error");
    expect(h.freezes).toContain("reconciliation failed to complete");
    const rows = getDb().prepare(`SELECT result FROM reconciliation_runs`).all() as Array<{ result: string }>;
    expect(rows[0].result).toBe("error");
  });
});

describe("user-data stream: snapshot-plus-buffer recovery", () => {
  function setupStream() {
    const cfg = freshEnv(makeCfg());
    const http = new FakeHttp();
    installFakes(http);
    http.route("/fapi/v1/listenKey", () => jsonRes({ listenKey: "LK-1" }));
    const rest = new BinanceRestClient(cfg, new RateLimiter(cfg.rateInternalPerMin), async () => undefined);
    rest.setTransportForTests(http);
    const lease = new StreamOwnerLease("uds", cfg.leaseTtlMs);
    const timers = new ManualTimers();
    const processed: Array<{ e: string; E?: number }> = [];
    const freezes: string[] = [];
    const statuses: Array<{ connected: boolean; phase: string; reconnects: number }> = [];
    let snapshotCalls = 0;
    let snapshotImpl: () => Promise<void> = async () => {
      snapshotCalls += 1;
    };
    const stream = new UserDataStream({
      cfgEnv: "testnet",
      rest,
      lease,
      takeSnapshot: async () => snapshotImpl(),
      processEvent: (ev) => processed.push(ev),
      freeze: (r) => freezes.push(r),
      onStatus: (s) => statuses.push(s),
      timers,
    });
    return {
      cfg, http, rest, lease, timers, stream, processed, freezes, statuses,
      snapshotCalls: () => snapshotCalls,
      setSnapshotImpl: (fn: () => Promise<void>) => { snapshotImpl = fn; },
    };
  }

  const ev = (E: number) => ({ e: "ORDER_TRADE_UPDATE", E });
  const flush = async () => {
    for (let i = 0; i < 5; i++) await new Promise((r) => setTimeout(r, 0));
  };

  test("start acquires the lease, creates a listen key, connects the ws", async () => {
    const h = setupStream();
    await h.stream.start();
    expect(h.lease.isOwner()).toBe(true);
    expect(FakeWs.instances).toHaveLength(1);
    expect(FakeWs.last().url).toBe("wss://fstream.binancefuture.com/ws/LK-1");
    expect(h.http.callsTo("/fapi/v1/listenKey").filter((c) => c.method === "POST")).toHaveLength(1);
    h.stream.stop();
  });

  test("events during snapshot are buffered; only events newer than the cutoff apply", async () => {
    const h = setupStream();
    await h.stream.start();
    const ws = FakeWs.last();
    ws.emitOpen();
    expect(h.statuses.some((s) => s.phase === "snapshot")).toBe(true);

    const now = Date.now();
    ws.emitMessage(ev(now - 60_000)); // stale: before cutoff
    ws.emitMessage(ev(now + 5_000)); // fresh: after cutoff

    await new Promise((r) => setTimeout(r, 10)); // let recover() complete
    expect(h.snapshotCalls()).toBe(1);
    expect(h.processed).toHaveLength(1);
    expect(h.processed[0].E).toBe(now + 5_000);
    expect(h.stream.status().connected).toBe(true);
    h.stream.stop();
  });

  test("live events flow straight through after recovery", async () => {
    const h = setupStream();
    await h.stream.start();
    FakeWs.last().emitOpen();
    await new Promise((r) => setTimeout(r, 10));
    const now = Date.now();
    FakeWs.last().emitMessage(ev(now + 10_000));
    expect(h.processed).toHaveLength(1);
    expect(h.processed[0].E).toBe(now + 10_000);
    h.stream.stop();
  });

  test("disconnect freezes, reconnects with backoff, and reuses the listen key", async () => {
    const h = setupStream();
    await h.stream.start();
    const first = FakeWs.last();
    first.emitOpen();
    await new Promise((r) => setTimeout(r, 10));

    first.emitClose();
    expect(h.freezes.length).toBe(1);
    expect(h.statuses.some((s) => s.phase === "reconnecting")).toBe(true);

    h.timers.advance(1_000); // first backoff step
    expect(FakeWs.instances).toHaveLength(2);
    expect(FakeWs.last().url).toBe(first.url); // same listen key reused
    expect(h.http.callsTo("/fapi/v1/listenKey").filter((c) => c.method === "POST")).toHaveLength(1);

    FakeWs.last().emitOpen();
    await new Promise((r) => setTimeout(r, 10));
    expect(h.stream.status().reconnects).toBe(1);
    expect(h.snapshotCalls()).toBe(2);
    h.stream.stop();
  });

  test("snapshot failure during recovery freezes and reschedules", async () => {
    const h = setupStream();
    let attempts = 0;
    h.setSnapshotImpl(async () => {
      attempts += 1;
      if (attempts === 1) throw new Error("rest down");
    });
    await h.stream.start();
    FakeWs.last().emitOpen();
    await flush();
    expect(h.freezes.length).toBe(1);
    h.timers.advance(1_000);
    FakeWs.last().emitOpen();
    await flush();
    expect(attempts).toBe(2);
    expect(h.stream.status().connected).toBe(true);
    h.stream.stop();
  });

  test("keepalive pings the listen key on schedule", async () => {
    const h = setupStream();
    await h.stream.start();
    h.timers.advance(25 * 60 * 1000);
    await flush();
    const puts = h.http.callsTo("/fapi/v1/listenKey").filter((c) => c.method === "PUT");
    expect(puts.length).toBe(1);
    expect(puts[0].url).toContain("listenKey=LK-1");
    h.stream.stop();
  });

  test("stop closes the ws, closes the listen key, and releases the lease", async () => {
    const h = setupStream();
    await h.stream.start();
    const ws = FakeWs.last();
    h.stream.stop();
    await flush();
    expect(ws.closed).toBe(true);
    const deletes = h.http.callsTo("/fapi/v1/listenKey").filter((c) => c.method === "DELETE");
    expect(deletes.length).toBe(1);
    expect(h.lease.isOwner()).toBe(false);
    const rows = getDb().prepare(`SELECT * FROM stream_owner_lease`).all();
    expect(rows).toHaveLength(0);
  });

  test("a second instance cannot steal the lease; it can take over after release", async () => {
    const h = setupStream();
    await h.stream.start();
    const other = new StreamOwnerLease("uds", h.cfg.leaseTtlMs);
    expect(other.tryAcquire()).toBe(false);
    h.stream.stop();
    expect(other.tryAcquire()).toBe(true);
    other.release();
  });

  test("lease renewal keeps ownership; a lost lease stops the stream", async () => {
    const h = setupStream();
    await h.stream.start();
    expect(h.lease.renew()).toBe(true);
    // Simulate another owner taking the row.
    getDb()
      .prepare(`UPDATE stream_owner_lease SET owner = ? WHERE lease_key = ?`)
      .run("someone-else", "uds");
    expect(h.lease.renew()).toBe(false);
    h.stream.stop();
  });
});
