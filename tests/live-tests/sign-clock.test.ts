import crypto from "node:crypto";

import { buildQueryString, hmacSha256Hex, signedQuery } from "@/lib/server/binance/sign";
import { clockIsHealthy, clockNeedsSync, clockState, getTimestamp, resetClockForTests, syncClock } from "@/lib/server/binance/clock";
import { BinanceRestClient, BinanceApiError, ERR_TIMESTAMP } from "@/lib/server/binance/rest";
import { RateLimiter } from "@/lib/server/binance/ratelimit";
import { getDb } from "@/lib/server/db/connection";
import { FakeHttp, freshEnv, installFakes, jsonRes, makeCfg } from "./helpers";

describe("request signing", () => {
  test("query string preserves insertion order and encodes values", () => {
    expect(buildQueryString({ symbol: "BTCUSDT", side: "BUY", a: "x y" })).toBe("symbol=BTCUSDT&side=BUY&a=x%20y");
    expect(buildQueryString({ x: undefined as unknown as string, y: 1 })).toBe("y=1");
  });

  test("hmac matches node crypto reference", () => {
    const expected = crypto.createHmac("sha256", "secret").update("a=1&b=2").digest("hex");
    expect(hmacSha256Hex("a=1&b=2", "secret")).toBe(expected);
  });

  test("signedQuery appends timestamp, recvWindow and a verifiable signature", () => {
    const q = signedQuery({ symbol: "BTCUSDT" }, "top-secret", 1_700_000_000_000, 5000);
    const params = new URLSearchParams(q);
    expect(params.get("symbol")).toBe("BTCUSDT");
    expect(params.get("timestamp")).toBe("1700000000000");
    expect(params.get("recvWindow")).toBe("5000");
    const signature = params.get("signature");
    expect(signature).toMatch(/^[0-9a-f]{64}$/);
    const payload = q.slice(0, q.indexOf("&signature="));
    expect(signature).toBe(hmacSha256Hex(payload, "top-secret"));
    expect(payload.includes("top-secret")).toBe(false);
  });
});

describe("clock sync and recvWindow", () => {
  beforeEach(() => {
    resetClockForTests();
    freshEnv(makeCfg());
  });

  test("median offset of N samples is applied to timestamps", async () => {
    const now = Date.now();
    const skew = 400; // exchange is 400ms ahead
    await syncClock(async () => now + skew, 3);
    const st = clockState();
    expect(st).not.toBeNull();
    expect(Math.abs((st?.offsetMs ?? 0) - skew)).toBeLessThanOrEqual(25); // timing noise tolerance
    expect(clockIsHealthy()).toBe(true);
    expect(clockNeedsSync()).toBe(false);
    expect(Math.abs(getTimestamp() - (now + skew))).toBeLessThanOrEqual(50);
  });

  test("clock state persists to the database", async () => {
    await syncClock(async () => Date.now() + 100, 3);
    const row = getDb().prepare(`SELECT offset_ms, samples FROM exchange_clock WHERE profile_id = 'binance-testnet' AND id = 1`).get() as
      | { offset_ms: number; samples: number }
      | undefined;
    expect(row).toBeDefined();
    expect(row?.samples).toBe(3);
  });

  test("unsigned endpoints do not send signatures", async () => {
    const cfg = freshEnv(makeCfg());
    const http = new FakeHttp();
    installFakes(http);
    http.route("/fapi/v1/time", () => jsonRes({ serverTime: Date.now() }));
    const rest = new BinanceRestClient(cfg, new RateLimiter(cfg.rateInternalPerMin), async () => undefined);
    rest.setTransportForTests(http);
    await rest.getTime();
    const call = http.callsTo("/fapi/v1/time")[0];
    expect(call.url.includes("signature")).toBe(false);
    expect(call.headers?.["X-MBX-APIKEY"]).toBeUndefined();
  });

  test("signed requests carry timestamp, recvWindow, signature and the API key header", async () => {
    const cfg = freshEnv(makeCfg({ recvWindowMs: 7000 }));
    const http = new FakeHttp();
    installFakes(http);
    http.route("/fapi/v2/account", () => jsonRes({ totalWalletBalance: "1" }));
    const rest = new BinanceRestClient(cfg, new RateLimiter(cfg.rateInternalPerMin), async () => undefined);
    rest.setTransportForTests(http);
    await rest.getAccount();
    const call = http.callsTo("/fapi/v2/account")[0];
    expect(call.headers?.["X-MBX-APIKEY"]).toBe("test-api-key");
    const query = new URLSearchParams(call.url.split("?")[1]);
    expect(query.get("recvWindow")).toBe("7000");
    expect(query.get("timestamp")).toMatch(/^\d+$/);
    const sig = query.get("signature");
    expect(sig).toMatch(/^[0-9a-f]{64}$/);
    const payload = call.url.split("?")[1].split("&signature=")[0];
    expect(sig).toBe(hmacSha256Hex(payload, cfg.binanceApiSecret!));
    // The secret must never travel in the request.
    expect(call.url.includes(cfg.binanceApiSecret!)).toBe(false);
  });

  test("-1021 timestamp rejection triggers one resync and one retry", async () => {
    const cfg = freshEnv(makeCfg());
    const http = new FakeHttp();
    installFakes(http);
    http.scriptApiError("/fapi/v2/account", ERR_TIMESTAMP, "Timestamp for this request is not in the recvWindow", 400);
    http.route("/fapi/v2/account", () => jsonRes({ totalWalletBalance: "777" }));
    let resyncs = 0;
    const rest = new BinanceRestClient(cfg, new RateLimiter(cfg.rateInternalPerMin), async () => {
      resyncs += 1;
    });
    rest.setTransportForTests(http);
    const account = await rest.getAccount();
    expect(resyncs).toBe(1);
    expect(account.totalWalletBalance).toBe("777");
    expect(http.callsTo("/fapi/v2/account")).toHaveLength(2);
  });

  test("-1021 is not retried twice", async () => {
    const cfg = freshEnv(makeCfg());
    const http = new FakeHttp();
    installFakes(http);
    http.scriptApiError("/fapi/v2/account", ERR_TIMESTAMP, "bad timestamp", 400);
    http.scriptApiError("/fapi/v2/account", ERR_TIMESTAMP, "bad timestamp again", 400);
    let resyncs = 0;
    const rest = new BinanceRestClient(cfg, new RateLimiter(cfg.rateInternalPerMin), async () => {
      resyncs += 1;
    });
    rest.setTransportForTests(http);
    await expect(rest.getAccount()).rejects.toMatchObject({ code: ERR_TIMESTAMP });
    expect(resyncs).toBe(1);
    expect(http.callsTo("/fapi/v2/account")).toHaveLength(2);
  });

  test("API errors surface as BinanceApiError with code and exchange message", async () => {
    const cfg = freshEnv(makeCfg());
    const http = new FakeHttp();
    installFakes(http);
    http.scriptApiError("/fapi/v1/order", -2010, "New order rejected", 400);
    const rest = new BinanceRestClient(cfg, new RateLimiter(cfg.rateInternalPerMin), async () => undefined);
    rest.setTransportForTests(http);
    try {
      await rest.placeOrder({ symbol: "BTCUSDT", side: "BUY", type: "MARKET", quantity: "0.001" });
      throw new Error("should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(BinanceApiError);
      const e = err as BinanceApiError;
      expect(e.code).toBe(-2010);
      expect(e.exchangeMsg).toBe("New order rejected");
      expect(e.message.includes(cfg.binanceApiSecret!)).toBe(false);
    }
  });
});
