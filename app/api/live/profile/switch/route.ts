import { serverConfig } from "@/lib/server/env/config";
import { authenticate, isAuthFailure, jsonError, jsonOk, readJson } from "@/lib/server/http/guards";
import {
  ProfileCoordinatorError,
  profileCoordinator,
  type ProfileSwitchRequest,
} from "@/lib/server/profile/coordinator";

export const dynamic = "force-dynamic";

const STATUS_BY_CODE: Record<ProfileCoordinatorError["code"], number> = {
  invalid_profile: 400,
  production_confirmation_required: 400,
  profile_switch_in_progress: 409,
  exposure_present: 409,
  exposure_unknown: 409,
  in_flight_mutation: 409,
  reconciliation_drift: 409,
  target_start_failed: 502,
  rollback_failed: 503,
  configuration_unavailable: 503,
  stale_profile: 409,
};

function switchError(error: ProfileCoordinatorError): Response {
  return jsonError(STATUS_BY_CODE[error.code], error.code, "Profile operation could not be completed");
}

export async function POST(req: Request): Promise<Response> {
  let cfg;
  try {
    cfg = serverConfig();
  } catch {
    return jsonError(503, "config", "Server configuration invalid");
  }
  const auth = authenticate(req, cfg, { allowLocal: true });
  if (isAuthFailure(auth)) return auth.response;
  const body = await readJson<ProfileSwitchRequest>(req);
  if (!body || typeof body !== "object" || !("profileId" in body)) {
    return jsonError(400, "invalid_profile", "A supported profileId is required");
  }
  const allowedKeys = new Set(["profileId", "confirmProduction", "requestId"]);
  if (Object.keys(body).some((key) => !allowedKeys.has(key))) {
    return jsonError(400, "invalid_profile", "Only profileId, confirmation, and requestId are accepted");
  }
  try {
    const status = await profileCoordinator().switchProfile(body);
    return jsonOk(status);
  } catch (error) {
    if (error instanceof ProfileCoordinatorError) return switchError(error);
    return jsonError(503, "target_start_failed", "Profile operation could not be completed");
  }
}
