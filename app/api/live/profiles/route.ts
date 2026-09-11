import { serverConfig } from "@/lib/server/env/config";
import { authenticate, isAuthFailure, jsonError, jsonOk } from "@/lib/server/http/guards";
import { profileMetadata } from "@/lib/server/profile/coordinator";

export const dynamic = "force-dynamic";

export async function GET(req: Request): Promise<Response> {
  let cfg;
  try {
    cfg = serverConfig();
  } catch {
    return jsonError(503, "config", "Server configuration invalid");
  }
  const auth = authenticate(req, cfg);
  if (isAuthFailure(auth)) return auth.response;
  return jsonOk({ profiles: profileMetadata() });
}
