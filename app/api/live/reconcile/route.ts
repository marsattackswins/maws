import { audit } from "@/lib/server/audit/log";
import { getBroker } from "@/lib/server/broker/factory";
import { serverConfig } from "@/lib/server/env/config";
import { authenticate, isAuthFailure, jsonError, jsonOk } from "@/lib/server/http/guards";
import { assertProfileMutationRequest, ProfileCoordinatorError, profileErrorStatus } from "@/lib/server/profile/coordinator";

export const dynamic = "force-dynamic";

/** Manual reconciliation trigger (also runs automatically on an interval). */
export async function POST(req: Request): Promise<Response> {
  let cfg;
  try {
    cfg = serverConfig();
  } catch {
    return jsonError(503, "config", "Server configuration invalid");
  }
  const ctx = authenticate(req, cfg, { allowLocal: true });
  if (isAuthFailure(ctx)) return ctx.response;
  try {
    assertProfileMutationRequest(req);
    const result = await getBroker().reconcile("manual");
    audit("operator", "reconcile.manual", {}, ctx.ip);
    return jsonOk(result);
  } catch (error) {
    if (error instanceof ProfileCoordinatorError) return jsonError(profileErrorStatus(error.code), error.code, "Profile runtime changed; retry the request");
    throw error;
  }
}
