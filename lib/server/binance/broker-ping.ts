/**
 * Lightweight broker connectivity probe for /api/health/broker.
 *
 * Uses GET /fapi/v1/ping (no credentials, no side effects) via the injected
 * broker HTTP transport. Kept separate from BinanceRestClient so the health
 * check never trips the REST circuit breaker or waits on the rate limiter —
 * a probe must stay independent of trading-path health.
 */

import "server-only";

import { HOST_MAP, type EnvConfig } from "../env/config";
import { brokerClients, TransportTimeoutError } from "./transport";

export interface BrokerPingResult {
  ok: boolean;
  latencyMs: number;
  broker: string;
}

const PING_TIMEOUT_MS = 1500; // must stay < 1s total req budget

/**
 * Pings the configured exchange. Returns ok=false (never throws) on any
 * network error, timeout, or non-2xx response, so the health route can turn
 * it into a 503 "degraded" without special error plumbing.
 */
export async function pingBroker(cfg: EnvConfig): Promise<BrokerPingResult> {
  const host = HOST_MAP[cfg.env].rest;
  if (!host) {
    // local env: no remote broker is configured (mock only)
    return { ok: false, latencyMs: 0, broker: cfg.brokerType };
  }

  const started = Date.now();
  try {
    await brokerClients().http.request({
      method: "GET",
      url: `${host}/fapi/v1/ping`,
      headers: {},
      timeoutMs: PING_TIMEOUT_MS,
    });
    return { ok: true, latencyMs: Date.now() - started, broker: cfg.brokerType };
  } catch (err) {
    if (err instanceof TransportTimeoutError) {
      return { ok: false, latencyMs: PING_TIMEOUT_MS, broker: cfg.brokerType };
    }
    return { ok: false, latencyMs: Date.now() - started, broker: cfg.brokerType };
  }
}
