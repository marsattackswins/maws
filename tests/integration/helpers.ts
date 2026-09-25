/**
 * Integration test helpers for Binance testnet.
 * These helpers make REAL network calls to testnet.binancefuture.com.
 */

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
import { resetLiveStateForTests, liveState } from "@/lib/server/binance/state";
import { resetBrokerClientsForTests } from "@/lib/server/binance/transport";
import { BinanceLiveManager, resetLiveManagerForTests } from "@/lib/server/binance/manager";
import { setRuntime, RUNTIME_KEYS } from "@/lib/server/runtime/flags";

const VERBOSE = process.env.MAWS_TEST_VERBOSE === "true";

export function log(...args: unknown[]): void {
  if (VERBOSE) console.log("[integration]", ...args);
}

export function tempDbPath(): string {
  return path.join(os.tmpdir(), `maws-integration-${crypto.randomBytes(8).toString("hex")}.db`);
}

/**
 * Loads testnet credentials from environment.
 * Throws if missing (integration tests REQUIRE real credentials).
 */
export function loadTestnetConfig(): EnvConfig {
  const profileApiKey = process.env.MAWS_BINANCE_TESTNET_API_KEY;
  const profileApiSecret = process.env.MAWS_BINANCE_TESTNET_API_SECRET;
  const legacyApiKey = process.env.MAWS_BINANCE_API_KEY;
  const legacyApiSecret = process.env.MAWS_BINANCE_API_SECRET;

  if (
    profileApiKey &&
    profileApiSecret &&
    legacyApiKey &&
    legacyApiSecret &&
    (profileApiKey !== legacyApiKey || profileApiSecret !== legacyApiSecret)
  ) {
    throw new Error("MAWS_PROFILE_CONFIGURATION_INVALID: integration credential pairs conflict");
  }

  const apiKey = profileApiKey || legacyApiKey;
  const apiSecret = profileApiSecret || legacyApiSecret;
  if (!apiKey || !apiSecret) {
    throw new Error(
      "Integration tests require Binance testnet credentials. " +
      "Set the MAWS_BINANCE_TESTNET_API_KEY/SECRET or legacy MAWS_BINANCE_API_KEY/SECRET pair in .env.integration",
    );
  }

  const profiles: ProfileRegistry = {
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
      executionEnabled: true,
      apiKey,
      apiSecret,
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

  return {
    env: "testnet",
    brokerType: "binance",
    defaultProfile: "paper",
    activeProfileId: "binance-testnet",
    profiles,
    dbPath: tempDbPath(),
    operatorAuth: "integration-test:integration-test",
    allowedOrigin: null,
    trustProxy: false,
    backupKey: null,
    healthToken: null,
    binanceApiKey: apiKey,
    binanceApiSecret: apiSecret,
    recvWindowMs: 5000,
    rateInternalPerMin: 60, // respect testnet rate limits
    reconIntervalMs: 10_000, // faster recon for tests
    historyBackfillMs: 3 * 24 * 60 * 60 * 1000,
    markPriceIntervalMs: 15_000,
    leaseTtlMs: 60_000,
    snapshotMaxAgeMs: 5 * 60_000,
    alertWebhookUrl: null,
    risk: {
      maxOrderNotionalUsd: 500, // testnet limits
      maxGrossExposureUsd: 2000,
      maxOpenOrders: 20,
      maxOpenPositions: 5,
      dailyLossPct: 80,
      priceCollarPct: 10, // wider collar for testnet price variance
    },
    circuitBreaker: {
      restFailureThreshold: 10, // More tolerant for testnet
      restFailureWindowMs: 60_000,
      restRecoveryTimeoutMs: 30_000,
      restSuccessThreshold: 2,
      streamFailureThreshold: 5,
      streamFailureWindowMs: 300_000,
      streamRecoveryTimeoutMs: 60_000,
      streamSuccessThreshold: 1,
      reconFailureThreshold: 5,
      reconFailureWindowMs: 600_000,
      reconRecoveryTimeoutMs: 120_000,
      reconSuccessThreshold: 2,
    },
  };
}

/**
 * Resets all server state and creates a fresh manager connected to testnet.
 */
export async function createTestnetManager(): Promise<BinanceLiveManager> {
  const cfg = loadTestnetConfig();

  resetServerConfigForTests(cfg);
  resetDbForTests(cfg.dbPath);
  resetClockForTests();
  resetLiveStateForTests();
  resetBrokerClientsForTests(); // restore real HTTP/WS clients
  resetLiveManagerForTests();

  setRuntime(RUNTIME_KEYS.executionEnabled, "true");

  const manager = new BinanceLiveManager(cfg);
  resetLiveManagerForTests(manager);

  log("Starting manager...");
  await manager.ensureStarted();
  log("Manager ready, status:", manager.status);

  return manager;
}

/**
 * Cleanup: cancel all open orders and close all positions.
 * Call this in afterEach to prevent test pollution.
 */
export async function cleanupTestnetState(manager: BinanceLiveManager): Promise<void> {
  log("Cleaning up testnet state...");

  try {
    // Cancel all open orders
    const openOrders = Array.from(liveState().openOrders.values());
    for (const order of openOrders) {
      log(`Canceling order ${order.clientOrderId}...`);
      try {
        await manager.orders.cancelOrder(order.clientOrderId, order.symbol);
      } catch (err) {
        log(`Failed to cancel ${order.clientOrderId}:`, err);
      }
    }

    // Close all positions via market orders
    const positions = Array.from(liveState().positions.values());
    for (const pos of positions) {
      if (Number(pos.qty) === 0) continue;

      log(`Closing position ${pos.symbol} ${pos.side} ${pos.qty}...`);
      const closeSide = pos.side === "long" ? "SELL" : "BUY";
      try {
        await manager.orders.submitOrder({
          symbol: pos.symbol,
          side: closeSide,
          type: "MARKET",
          qty: pos.qty,
          clientOrderId: manager.newClientOrderId("cleanup"),
        });
      } catch (err) {
        log(`Failed to close ${pos.symbol}:`, err);
      }
    }

    // Wait for cleanup to propagate
    await sleep(2000);

    log("Cleanup complete");
  } catch (err) {
    log("Cleanup error:", err);
  }
}

/**
 * Wait for a specific condition to become true, with timeout.
 */
export async function waitFor(
  condition: () => boolean,
  opts: { timeoutMs?: number; intervalMs?: number; description?: string } = {}
): Promise<void> {
  const { timeoutMs = 10_000, intervalMs = 100, description = "condition" } = opts;
  const start = Date.now();

  while (!condition()) {
    if (Date.now() - start > timeoutMs) {
      throw new Error(`Timeout waiting for ${description} after ${timeoutMs}ms`);
    }
    await sleep(intervalMs);
  }

  log(`${description} satisfied after ${Date.now() - start}ms`);
}

/**
 * Wait for an order to reach a specific status.
 */
export async function waitForOrderStatus(
  clientOrderId: string,
  targetStatus: string | string[],
  timeoutMs = 15_000
): Promise<void> {
  const statuses = Array.isArray(targetStatus) ? targetStatus : [targetStatus];
  await waitFor(
    () => {
      const order = liveState().orders.get(clientOrderId);
      return order ? statuses.includes(order.status) : false;
    },
    {
      timeoutMs,
      description: `order ${clientOrderId} to reach ${statuses.join(" or ")}`,
    }
  );
}

/**
 * Wait for a position to exist (or not exist) on a symbol.
 */
export async function waitForPosition(
  symbol: string,
  exists: boolean,
  timeoutMs = 10_000
): Promise<void> {
  await waitFor(
    () => {
      const pos = liveState().positions.get(symbol);
      return exists ? !!pos && Number(pos.qty) !== 0 : !pos || Number(pos.qty) === 0;
    },
    {
      timeoutMs,
      description: `position on ${symbol} to ${exists ? "exist" : "not exist"}`,
    }
  );
}

/**
 * Wait for a specific number of fills.
 */
export async function waitForFillCount(
  minCount: number,
  timeoutMs = 15_000
): Promise<void> {
  await waitFor(
    () => liveState().fills.length >= minCount,
    {
      timeoutMs,
      description: `at least ${minCount} fills`,
    }
  );
}

/**
 * Generate a unique client order ID for this test run.
 */
let testRunId = crypto.randomBytes(4).toString("hex");
let orderSeq = 0;

export function uniqueOrderId(prefix = "int"): string {
  return `${prefix}-${testRunId}-${++orderSeq}`;
}

/**
 * Sleep helper.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Get current mark price from testnet for a symbol.
 */
export async function getCurrentMarkPrice(symbol: string): Promise<number> {
  const res = await fetch(`https://testnet.binancefuture.com/fapi/v1/premiumIndex?symbol=${symbol}`);
  if (!res.ok) throw new Error(`Failed to fetch mark price: ${res.statusText}`);
  const data = await res.json();
  return Number(data.markPrice);
}

/**
 * Assert helper with detailed logging.
 */
export function assertState(condition: boolean, message: string): void {
  if (!condition) {
    log("❌ Assertion failed:", message);
    log("Current state snapshot:", {
      orders: Array.from(liveState().orders.keys()),
      openOrders: Array.from(liveState().openOrders.keys()),
      positions: Array.from(liveState().positions.keys()),
      fills: liveState().fills.length,
    });
    throw new Error(`Assertion failed: ${message}`);
  }
  log("✅", message);
}
