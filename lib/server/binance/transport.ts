import "server-only";

import { serverConfig } from "../env/config";
import { log } from "../log/logger";

export interface HttpResponse {
  status: number;
  headers: Record<string, string>;
  body: string;
}

export interface HttpRequestOptions {
  method: "GET" | "POST" | "PUT" | "DELETE";
  url: string;
  headers?: Record<string, string>;
  body?: string;
  timeoutMs: number;
}

export interface HttpTransport {
  request(opts: HttpRequestOptions): Promise<HttpResponse>;
}

export interface WsLike {
  send(data: string): void;
  close(): void;
  on(event: "open" | "message" | "close" | "error", cb: (data?: unknown) => void): void;
}

export interface WsTransport {
  connect(url: string): WsLike;
}

export class TransportTimeoutError extends Error {
  constructor(url: string) {
    super(`Transport timeout: ${url}`);
    this.name = "TransportTimeoutError";
  }
}

class FetchTransport implements HttpTransport {
  async request(opts: HttpRequestOptions): Promise<HttpResponse> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), opts.timeoutMs);
    try {
      const res = await fetch(opts.url, {
        method: opts.method,
        headers: opts.headers,
        body: opts.body,
        signal: controller.signal,
      });
      const headers: Record<string, string> = {};
      res.headers.forEach((v, k) => {
        headers[k.toLowerCase()] = v;
      });
      return { status: res.status, headers, body: await res.text() };
    } catch (err) {
      if (controller.signal.aborted) throw new TransportTimeoutError(opts.url);
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }
}

class NodeWsTransport implements WsTransport {
  connect(url: string): WsLike {
    // Loaded lazily so unit tests with fakes never need the ws package.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { WebSocket } = require("ws") as typeof import("ws");
    return new WebSocket(url) as unknown as WsLike;
  }
}

interface BrokerClients {
  http: HttpTransport;
  ws: WsTransport;
}

const defaults: BrokerClients = { http: new FetchTransport(), ws: new NodeWsTransport() };
let installed: BrokerClients | null = null;

/**
 * Dependency-injection seam for tests. Fakes are refused in shadow and
 * production so the real transport can never be swapped out there.
 */
export function installBrokerClients(clients: BrokerClients): void {
  const env = serverConfig().env;
  if (env === "shadow" || env === "production") {
    throw new Error(`installBrokerClients is forbidden when MAWS_ENV=${env}`);
  }
  log.debug("broker clients installed via DI seam");
  installed = clients;
}

export function resetBrokerClientsForTests(): void {
  installed = null;
}

export function brokerClients(): BrokerClients {
  return installed ?? defaults;
}
