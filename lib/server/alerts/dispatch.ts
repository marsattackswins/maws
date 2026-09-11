import "server-only";

import { serverConfig } from "../env/config";
import { log } from "../log/logger";

const RATE_WINDOW_MS = 60_000;
const lastSent = new Map<string, number>();

export function alert(event: string, detail: Record<string, unknown>): void {
  let url: string | null;
  try {
    url = serverConfig().alertWebhookUrl;
  } catch {
    return;
  }
  if (!url) return;

  const now = Date.now();
  const prev = lastSent.get(event);
  if (prev != null && now - prev < RATE_WINDOW_MS) return;
  lastSent.set(event, now);

  const body = JSON.stringify({ event, detail, env: serverConfig().env, ts: now });

  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), 5_000);

  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    signal: ac.signal,
  })
    .then((res) => {
      if (!res.ok) log.warn("alert webhook returned non-2xx", { event, status: res.status });
    })
    .catch((err) => {
      log.warn("alert webhook failed", { event, error: String(err) });
    })
    .finally(() => clearTimeout(timer));
}
