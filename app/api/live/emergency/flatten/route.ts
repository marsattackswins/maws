import { audit } from "@/lib/server/audit/log";
import { getBroker } from "@/lib/server/broker/factory";
import { serverConfig } from "@/lib/server/env/config";
import { authenticate, isAuthFailure, jsonError, jsonOk } from "@/lib/server/http/guards";
import { compareSecretTokens } from "@/lib/server/auth/token";
import { runBrokerMutation } from "@/lib/server/response/broker-mutation";
import { assertProfileRequest, ProfileCoordinatorError, profileErrorStatus } from "@/lib/server/profile/coordinator";

export const dynamic = "force-dynamic";

/** Cancel every working order and submit reduce-only market closes. */
export async function POST(req: Request): Promise<Response> {
  let cfg;
  try {
    cfg = serverConfig();
  } catch {
    return jsonError(503, "config", "Server configuration invalid");
  }

  const auth = authenticate(req, cfg, { allowLocal: true });
  try {
    assertProfileRequest(req);
  } catch (error) {
    if (error instanceof ProfileCoordinatorError) return jsonError(profileErrorStatus(error.code), error.code, "Profile runtime changed; retry the request");
    throw error;
  }
  const healthTokenAuthorized = compareSecretTokens(req.headers.get("x-maws-health-token"), cfg.healthToken);
  if (isAuthFailure(auth) && !healthTokenAuthorized) return auth.response;
  const triggeredBy = isAuthFailure(auth) ? "system:health-token" : `operator:${auth.sessionId}`;
  const auditIp = isAuthFailure(auth) ? "health-token" : auth.ip;

  let result;
  try {
    result = await runBrokerMutation(
      () => {
        assertProfileRequest(req);
        return getBroker().emergencyFlatten(triggeredBy);
      },
    );
  } catch (error) {
    if (error instanceof ProfileCoordinatorError) return jsonError(profileErrorStatus(error.code), error.code, "Profile runtime changed; retry the request");
    throw error;
  }
  if (result instanceof Response) return result;

  audit("operator", "emergency.flatten.requested", {
    triggeredBy,
    canceled: result.canceledOrderIds.length,
    closed: result.closedPositions.length,
    failures: result.failures.length,
  }, auditIp);
  return jsonOk(result, { status: result.failures.length > 0 ? 207 : 200 });
}
