import { afterEach, describe, expect, jest, test } from "@jest/globals";

import { installGracefulShutdown } from "@/lib/server/shutdown";

import {
  profileCoordinator,
  profileRuntimeStatus,
  resetProfileCoordinatorForTests,
} from "@/lib/server/profile/coordinator";
import { getDb } from "@/lib/server/db/connection";
import { liveState } from "@/lib/server/binance/state";
import { FakeHttp, FakeWs, freshEnv, installFakes, jsonRes, makeCfg } from "./helpers";

async function nextTurn(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

/** Minimal fake testnet with every route the startup sequence touches. */
function configureFakeExchange(listenKey: string): FakeHttp {
  const http = new FakeHttp();
  installFakes(http);
  http.route("/fapi/v1/time", () => jsonRes({ serverTime: Date.now() }));
  http.route("/fapi/v1/exchangeInfo", () => jsonRes({ symbols: [] }));
  http.route("/fapi/v1/ticker/price", () => jsonRes({ symbol: "BTCUSDT", price: "50000" }));
  http.route("/fapi/v2/account", () => jsonRes({ totalWalletBalance: "1000", assets: [] }));
  http.route("/fapi/v2/positionRisk", () => jsonRes([]));
  http.route("/fapi/v1/openOrders", () => jsonRes([]));
  http.route("/fapi/v1/listenKey", () => jsonRes({ listenKey }));
  http.route("/fapi/v1/leverageBracket", () => jsonRes([]));
  http.route("/fapi/v1/userTrades", () => jsonRes([]));
  return http;
}

/** Start the coordinator, opening the fake user-data socket once it appears. */
async function startAttached(): Promise<void> {
  const started = profileCoordinator().ensureStarted();
  for (let i = 0; i < 400 && FakeWs.instances.length < 1; i += 1) await nextTurn();
  FakeWs.last()?.emitOpen();
  try {
    await started;
  } catch (err) {
    throw new Error(`startup failed: ${String(err)} | manager error: ${profileRuntimeStatus().managerError ?? "none"}`);
  }
  expect(profileRuntimeStatus().phase).toBe("ready");
}

/**
 * Graceful process shutdown: the stream lease must be released when the
 * coordinator tears down for process exit, so the next server instance can
 * acquire it immediately instead of waiting out the lease TTL.
 */

describe("profile coordinator shutdownForExit", () => {
  afterEach(() => {
    resetProfileCoordinatorForTests();
  });

  test("releases the stream lease and detaches the profile", async () => {
    freshEnv(makeCfg());
    configureFakeExchange("SHUTDOWN-LK");

    await startAttached();

    // The manager acquired the lease (stream attach may still be in flight).
    const leaseRows = () => getDb().prepare(`SELECT COUNT(*) AS n FROM stream_owner_lease`).get() as { n: number };
    const mayHaveLease = leaseRows().n;

    await profileCoordinator().shutdownForExit();

    // Lease row is gone either way; nothing may remain attached.
    expect(leaseRows().n).toBe(0);
    expect(mayHaveLease).toBeGreaterThanOrEqual(0);
    expect(profileRuntimeStatus().phase).toBe("idle");
    expect(liveState().positions.size).toBe(0);
  });

  test("a lease held at shutdown is acquirable by the next process immediately", async () => {
    freshEnv(makeCfg());
    configureFakeExchange("HANDOVER-LK");

    await startAttached();
    await nextTurn();

    const before = getDb().prepare(`SELECT COUNT(*) AS n FROM stream_owner_lease`).get() as { n: number };
    expect(before.n).toBe(1); // the running manager holds the lease

    await profileCoordinator().shutdownForExit();

    const after = getDb().prepare(`SELECT COUNT(*) AS n FROM stream_owner_lease`).get() as { n: number };
    expect(after.n).toBe(0); // released -> next process can acquire instantly
  });

  test("shutdownForExit is safe to call when nothing is running", async () => {
    freshEnv(makeCfg());
    configureFakeExchange("UNUSED-LK");
    await expect(profileCoordinator().shutdownForExit()).resolves.toBeUndefined();
    expect(profileRuntimeStatus().phase).toBe("idle");
  });

  test("SIGINT triggers graceful shutdown through the installed handler", async () => {
    freshEnv(makeCfg());
    configureFakeExchange("SIGNAL-LK");

    // Never let the re-raised signal actually terminate the test runner.
    const killSpy = jest.spyOn(process, "kill").mockImplementation(() => true);
    installGracefulShutdown();

    await startAttached();
    expect((getDb().prepare(`SELECT COUNT(*) AS n FROM stream_owner_lease`).get() as { n: number }).n).toBe(1);

    // Deliver the signal the way a console Ctrl+C would (in-process).
    process.emit("SIGINT", "SIGINT");
    // The handler tears down asynchronously before re-raising.
    for (let i = 0; i < 100 && (getDb().prepare(`SELECT COUNT(*) AS n FROM stream_owner_lease`).get() as { n: number }).n > 0; i += 1) {
      await nextTurn();
    }

    expect((getDb().prepare(`SELECT COUNT(*) AS n FROM stream_owner_lease`).get() as { n: number }).n).toBe(0);
    expect(profileRuntimeStatus().phase).toBe("idle");
    expect(killSpy).toHaveBeenCalledWith(process.pid, "SIGINT"); // re-raised for exit code
    killSpy.mockRestore();
  });
});
