import { accountDto, fillsDto, ordersDto, positionsDto } from "@/lib/server/binance/dto";
import { sseBus } from "@/lib/server/binance/sse";
import { serverConfig } from "@/lib/server/env/config";
import { buildHealthStatus } from "@/lib/server/health/status";
import { activeProfileConfig, profileRuntimeStatus } from "@/lib/server/profile/coordinator";
import { authenticate, isAuthFailure } from "@/lib/server/http/guards";

export const dynamic = "force-dynamic";

/**
 * Authenticated server-sent events bridge. EventSource sends the session
 * cookie automatically; the route refuses without a valid session. Payloads
 * are DTOs only — never secrets, listen keys, or raw exchange credentials.
 */
export async function GET(req: Request): Promise<Response> {
  let cfg;
  try {
    cfg = serverConfig();
  } catch {
    return new Response("config invalid", { status: 503 });
  }
  const ctx = authenticate(req, cfg, { allowLocal: true });
  if (isAuthFailure(ctx)) return ctx.response;

  const encoder = new TextEncoder();
  const subscribedGeneration = profileRuntimeStatus().generation;
  let unsubscribe: (() => void) | null = null;
  let heartbeat: ReturnType<typeof setInterval> | null = null;

  const stream = new ReadableStream({
    start(controller) {
      const send = (event: string, data: unknown) => {
        try {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        } catch {
          // Controller already closed.
        }
      };
      send("hello", { at: Date.now(), env: activeProfileConfig().env });
      send("state", {
        account: accountDto(),
        positions: positionsDto(),
        orders: ordersDto(),
        fills: fillsDto(50),
      });
      send("health", buildHealthStatus(activeProfileConfig()));
      unsubscribe = sseBus.subscribe((event, data) => {
        if (profileRuntimeStatus().generation !== subscribedGeneration) return;
        if (event === "health") send("health", buildHealthStatus(activeProfileConfig()));
        else send(event, data);
      });
      heartbeat = setInterval(() => send("ping", { at: Date.now() }), 25_000);
      req.signal.addEventListener("abort", () => {
        if (heartbeat) clearInterval(heartbeat);
        unsubscribe?.();
        try {
          controller.close();
        } catch {
          // Already closed.
        }
      });
    },
    cancel() {
      if (heartbeat) clearInterval(heartbeat);
      unsubscribe?.();
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream",
      "cache-control": "no-store, no-transform",
      connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
