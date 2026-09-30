import { describe, test, expect, beforeEach, afterEach, jest } from "@jest/globals";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

let stateDir = "";

jest.mock("@/lib/server/audit/log", () => ({ audit: jest.fn() }));

async function loadModule() {
  return import("@/lib/server/app-power");
}

async function loadRoute() {
  return import("@/app/api/admin/power/route");
}

function makeGetRequest(headers: Record<string, string> = {}): Request {
  return new Request("http://localhost:3000/api/admin/power", { method: "GET", headers });
}

function makePostRequest(body: unknown, headers: Record<string, string> = {}): Request {
  return new Request("http://localhost:3000/api/admin/power", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  stateDir = fs.mkdtempSync(path.join(os.tmpdir(), "maws-power-"));
  process.env.MAWS_STATE_DIR = stateDir;
  delete process.env.MAWS_SUPERVISOR_TOKEN;
  jest.resetModules();
});

afterEach(() => {
  jest.restoreAllMocks();
  jest.resetModules();
  fs.rmSync(stateDir, { recursive: true, force: true });
  delete process.env.MAWS_SUPERVISOR_TOKEN;
  delete process.env.MAWS_STATE_DIR;
});

describe("app power state file", () => {
  test("defaults to on when no state file exists", async () => {
    const power = await loadModule();
    expect(power.readDesiredState()).toEqual({ desired: "on", updatedAt: 0 });
  });

  test("persists and reads desired=off, then markRunning clears it", async () => {
    const power = await loadModule();
    power.writeDesiredState("off");
    expect(power.readDesiredState().desired).toBe("off");

    power.markRunning();
    expect(power.readDesiredState().desired).toBe("on");
  });

  test("treats a corrupted state file as on", async () => {
    const power = await loadModule();
    fs.writeFileSync(path.join(stateDir, "app-state.json"), "{not json", "utf8");
    expect(power.readDesiredState().desired).toBe("on");
  });
});

describe("supervisor token", () => {
  test("prefers env over disk and validates callers", async () => {
    fs.writeFileSync(path.join(stateDir, "supervisor-token"), "disk-token", "utf8");
    const power = await loadModule();

    expect(power.callerForRequest(makeGetRequest({ "x-maws-supervisor-token": "disk-token" }))).toBe("supervisor");

    process.env.MAWS_SUPERVISOR_TOKEN = "env-token";
    expect(power.supervisorToken()).toBe("env-token");
    expect(power.callerForRequest(makeGetRequest({ "x-maws-supervisor-token": "disk-token" }))).toBe("operator");
    expect(power.callerForRequest(makeGetRequest({}))).toBe("operator");
  });
});

describe("POST /api/admin/power", () => {
  const LOCAL_ORIGIN = { origin: "http://localhost:3000", host: "localhost:3000" };

  test("local operator stop without confirmation is rejected and keeps desired=on", async () => {
    const { POST } = await loadRoute();
    const power = await loadModule();
    const res = await POST(makePostRequest({}, LOCAL_ORIGIN) as never);
    expect(res.status).toBe(400);
    expect(power.readDesiredState().desired).toBe("on");
  });

  test("local operator stop with confirm=STOP flips desired to off", async () => {
    const { POST } = await loadRoute();
    const power = await loadModule();
    const res = await POST(
      makePostRequest({ confirm: "STOP" }, LOCAL_ORIGIN) as never,
    );
    expect(res.status).toBe(200);
    expect(power.readDesiredState().desired).toBe("off");
  });

  test("supervisor caller performs teardown without touching desired state or audit", async () => {
    const { POST } = await loadRoute();
    const power = await loadModule();
    process.env.MAWS_SUPERVISOR_TOKEN = "tok-123";
    const res = await POST(
      makePostRequest({ confirm: "STOP" }, { "x-maws-supervisor-token": "tok-123" }) as never,
    );
    // 200 (not 403) proves the caller was recognized as the supervisor; the
    // operator path would have failed origin binding without an Origin header.
    expect(res.status).toBe(200);
    expect(power.readDesiredState().desired).toBe("on"); // untouched
  });

  test("rejects cross-origin operator stop in local mode", async () => {
    const { POST } = await loadRoute();
    const res = await POST(
      makePostRequest({ confirm: "STOP" }, { origin: "http://evil.example", host: "localhost:3000" }) as never,
    );
    expect(res.status).toBe(403);
  });
});

describe("GET /api/admin/power", () => {
  test("returns running status and desired state", async () => {
    const { GET } = await loadRoute();
    const power = await loadModule();
    power.writeDesiredState("off");
    const res = await GET(makeGetRequest() as never);
    expect(res.status).toBe(200);
    const body = (await res.json()) as { running: boolean; desired: string };
    expect(body.running).toBe(true);
    expect(body.desired).toBe("off");
  });
});
