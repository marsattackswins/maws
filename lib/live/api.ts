import type {
  LiveProfileId,
  LiveStateDto,
  MetaDto,
  OrderActionResult,
  ProfileMetadataDto,
  ProfileRuntimeStatusDto,
  SessionInfo,
} from "./types";

let csrfToken: string | null = null;

export function setCsrf(token: string | null): void {
  csrfToken = token;
}

export class LiveAuthError extends Error {
  constructor() {
    super("Live session expired");
    this.name = "LiveAuthError";
  }
}

export class LiveApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "LiveApiError";
  }
}

async function call<T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const headers: Record<string, string> = {};
  if (init.body !== undefined) headers["content-type"] = "application/json";
  if (init.method && init.method !== "GET" && csrfToken) headers["x-maws-csrf"] = csrfToken;
  const res = await fetch(path, {
    method: init.method ?? "GET",
    headers,
    credentials: "same-origin",
    body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
  });
  if (res.status === 401) throw new LiveAuthError();
  const data = (await res.json().catch(() => null)) as
    | (T & { error?: { code?: string; message?: string } })
    | null;
  if (!res.ok) {
    const errorBody = data && typeof data === "object" ? (data as { error?: unknown }).error : undefined;
    const errorObject = errorBody && typeof errorBody === "object" ? errorBody as { code?: unknown; message?: unknown } : null;
    const code = typeof errorObject?.code === "string" ? errorObject.code : "http_error";
    const message = typeof errorBody === "string"
      ? errorBody
      : typeof errorObject?.message === "string"
        ? errorObject.message
        : `Request failed (${res.status})`;
    throw new LiveApiError(code, message, res.status);
  }
  return data as T;
}

export const liveApi = {
  session(): Promise<SessionInfo> {
    return call("/api/auth/session");
  },
  login(password: string): Promise<{ csrf: string }> {
    return call("/api/auth/login", { method: "POST", body: { password } });
  },
  logout(): Promise<{ ok: boolean }> {
    return call("/api/auth/logout", { method: "POST", body: {} });
  },
  connect(): Promise<{ ok: boolean; status: string }> {
    return call("/api/live/connect", { method: "POST", body: {} });
  },
  disconnect(): Promise<{ ok: boolean }> {
    return call("/api/live/disconnect", { method: "POST", body: {} });
  },
  meta(): Promise<MetaDto> {
    return call("/api/live/meta");
  },
  profiles(): Promise<{ profiles: ProfileMetadataDto[] }> {
    return call("/api/live/profiles");
  },
  profile(): Promise<ProfileRuntimeStatusDto> {
    return call("/api/live/profile");
  },
  switchProfile(input: { profileId: LiveProfileId; confirmProduction: boolean; requestId: string }): Promise<ProfileRuntimeStatusDto> {
    return call("/api/live/profile/switch", { method: "POST", body: input });
  },
  state(): Promise<LiveStateDto> {
    return call("/api/live/state");
  },
  submitOrder(input: {
    symbol: string;
    side: "BUY" | "SELL";
    type: "MARKET" | "LIMIT" | "STOP_MARKET";
    qty: string;
    price?: string;
    stopPrice?: string;
    /** UI-selected leverage; the server syncs it to Binance before the order. */
    leverage?: number;
    clientOrderId: string;
  }): Promise<OrderActionResult> {
    return call("/api/live/orders", { method: "POST", body: input });
  },
  cancelOrder(clientOrderId: string, symbol: string): Promise<OrderActionResult> {
    return call("/api/live/orders/cancel", { method: "POST", body: { clientOrderId, symbol } });
  },
  closePosition(symbol: string): Promise<OrderActionResult> {
    return call("/api/live/positions/close", { method: "POST", body: { symbol } });
  },
  protect(input: { symbol: string; tpPrice?: string; slPrice?: string }): Promise<{ tp?: OrderActionResult; sl?: OrderActionResult }> {
    return call("/api/live/protect", { method: "POST", body: input });
  },
  setGates(input: { executionEnabled?: boolean; killSwitch?: boolean }): Promise<{ decision: unknown }> {
    return call("/api/live/gates", { method: "POST", body: input });
  },
  reconcile(): Promise<{ result: string; diffs: string[] }> {
    return call("/api/live/reconcile", { method: "POST", body: {} });
  },
};
