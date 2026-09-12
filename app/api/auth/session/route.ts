import { getSession, readSessionCookie } from "@/lib/server/auth/session";
import { HOST_MAP, serverConfig } from "@/lib/server/env/config";
import { activeProfileConfig } from "@/lib/server/profile/coordinator";
import { persistenceProfileFromConfig } from "@/lib/server/profile/context";
import { buildHealthStatus } from "@/lib/server/health/status";
import { getRuntime, RUNTIME_KEYS } from "@/lib/server/runtime/flags";
import { jsonOk, secureCookieContext } from "@/lib/server/http/guards";

export const dynamic = "force-dynamic";

/** Safe session introspection: reveals nothing secret (no cookie echo, no keys). */
export async function GET(req: Request): Promise<Response> {
  let cfg;
  try {
    cfg = serverConfig();
  } catch {
    return jsonOk({ authenticated: false, env: "local" });
  }
  const runtimeCfg = activeProfileConfig();
  const hasConfiguredBinanceProfile =
    cfg.profiles["binance-testnet"].configured || cfg.profiles["binance-production"].configured;
  if (cfg.env === "local" && !cfg.operatorAuth && !hasConfiguredBinanceProfile) {
    return jsonOk({ authenticated: true, env: "local", envLabel: HOST_MAP.local.label, connectedBroker: "mock" });
  }
  const runtimeProfile = persistenceProfileFromConfig(runtimeCfg);
  const sessionId = readSessionCookie(req.headers.get("cookie"), secureCookieContext(cfg));
  const session = getSession(sessionId);
  if (!session) {
    return jsonOk({ authenticated: false, env: runtimeCfg.env, envLabel: HOST_MAP[runtimeCfg.env].label });
  }
  return jsonOk({
    authenticated: true,
    csrf: session.csrfToken,
    env: runtimeCfg.env,
    envLabel: HOST_MAP[runtimeCfg.env].label,
    connectedBroker:
      buildHealthStatus(runtimeCfg).brokerConnected && getRuntime(RUNTIME_KEYS.connectedBroker, "", runtimeProfile) === "binance"
        ? "binance"
        : "",
    sessionExpiresAt: session.expiresAt,
  });
}
