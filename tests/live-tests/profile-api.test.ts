import { afterEach, beforeEach, describe, expect, test } from "@jest/globals";

import { GET as getProfiles } from "@/app/api/live/profiles/route";
import { GET as getProfile } from "@/app/api/live/profile/route";
import { POST as switchProfile } from "@/app/api/live/profile/switch/route";
import { createSession, sessionCookieName } from "@/lib/server/auth/session";
import { resetProfileCoordinatorForTests } from "@/lib/server/profile/coordinator";
import { freshEnv, makeCfg } from "./helpers";

function authenticatedRequest(path: string, init: RequestInit = {}, csrf: string | null = null): Request {
  const headers = new Headers(init.headers);
  headers.set("cookie", `${sessionCookieName(false)}=${session.sessionId}`);
  headers.set("origin", "http://localhost:3000");
  if (csrf) headers.set("x-maws-csrf", csrf);
  return new Request(`http://localhost:3000${path}`, { ...init, headers });
}

let session: { sessionId: string; csrfToken: string };

beforeEach(() => {
  freshEnv(makeCfg({ env: "testnet" }));
  session = createSession("profile-api-test");
});

afterEach(() => {
  resetProfileCoordinatorForTests();
});

describe("profile API", () => {
  test("rejects unauthenticated requests and requires CSRF/origin for switching", async () => {
    const unauthenticated = await getProfiles(new Request("http://localhost:3000/api/live/profiles"));
    expect(unauthenticated.status).toBe(401);

    const csrfFailure = await switchProfile(authenticatedRequest("/api/live/profile/switch", {
      method: "POST",
      body: JSON.stringify({ profileId: "paper" }),
      headers: { "content-type": "application/json" },
    }));
    expect(csrfFailure.status).toBe(403);
    expect((await csrfFailure.json()).error.code).toBe("csrf");

    const originFailure = await switchProfile(new Request("http://localhost:3000/api/live/profile/switch", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie: `${sessionCookieName(false)}=${session.sessionId}`,
        "x-maws-csrf": session.csrfToken,
        origin: "http://evil.example",
      },
      body: JSON.stringify({ profileId: "paper" }),
    }));
    expect(originFailure.status).toBe(403);
  });

  test("rejects invalid profiles and requires production confirmation", async () => {
    const invalid = await switchProfile(authenticatedRequest("/api/live/profile/switch", {
      method: "POST",
      body: JSON.stringify({ profileId: "shadow" }),
      headers: { "content-type": "application/json" },
    }, session.csrfToken));
    expect(invalid.status).toBe(400);
    expect((await invalid.json()).error.code).toBe("invalid_profile");

    const confirmation = await switchProfile(authenticatedRequest("/api/live/profile/switch", {
      method: "POST",
      body: JSON.stringify({ profileId: "binance-production", confirmProduction: false }),
      headers: { "content-type": "application/json" },
    }, session.csrfToken));
    expect(confirmation.status).toBe(400);
    expect((await confirmation.json()).error.code).toBe("production_confirmation_required");
  });

  test("returns no-store safe metadata and excludes internal profiles and secrets", async () => {
    const profiles = await getProfiles(authenticatedRequest("/api/live/profiles"));
    expect(profiles.headers.get("cache-control")).toBe("no-store");
    const profileBody = (await profiles.json()) as { profiles: Array<Record<string, unknown>> };
    expect(profileBody.profiles.map((profile) => profile.profileId)).toEqual([
      "paper",
      "binance-testnet",
      "binance-production",
    ]);
    expect(JSON.stringify(profileBody)).not.toContain("apiKey");
    expect(JSON.stringify(profileBody)).not.toContain("apiSecret");
    expect(JSON.stringify(profileBody)).not.toContain("https://");

    const current = await getProfile(authenticatedRequest("/api/live/profile"));
    expect(current.headers.get("cache-control")).toBe("no-store");
    expect((await current.json()).phase).toBe("idle");
  });
});
