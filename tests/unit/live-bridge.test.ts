import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import type { ProfileRuntimeStatusDto } from "@/lib/live/types";
import { useAppStore } from "@/lib/store";
import { useLiveStore } from "@/lib/live/store";

const mockLiveApi = {
  session: jest.fn<() => Promise<unknown>>(),
  connect: jest.fn<() => Promise<unknown>>(),
  disconnect: jest.fn<() => Promise<unknown>>(),
  meta: jest.fn<() => Promise<unknown>>(),
  profiles: jest.fn<() => Promise<unknown>>(),
  profile: jest.fn<() => Promise<unknown>>(),
  switchProfile: jest.fn<(input: { profileId: string; confirmProduction: boolean; requestId: string }) => Promise<unknown>>(),
  state: jest.fn<() => Promise<unknown>>(),
  setGates: jest.fn<(input: { executionEnabled?: boolean; killSwitch?: boolean }) => Promise<unknown>>(),
};

jest.mock("@/lib/live/api", () => ({
  liveApi: mockLiveApi,
  LiveAuthError: class LiveAuthError extends Error {},
  LiveApiError: class LiveApiError extends Error {
    code: string;
    status: number;

    constructor(code: string, message: string, status: number) {
      super(message);
      this.code = code;
      this.status = status;
    }
  },
  setCsrf: jest.fn(),
}));

import { connectLiveBroker, disconnectLiveBroker, restoreServerProfile, stopLiveBridgeForTests, switchLiveProfile } from "@/lib/live/bridge";

class FakeEventSource {
  static instances: FakeEventSource[] = [];
  onerror: (() => void) | null = null;
  private listeners = new Map<string, (event: MessageEvent) => void>();

  constructor() {
    FakeEventSource.instances.push(this);
  }

  addEventListener(name: string, listener: (event: MessageEvent) => void): void {
    this.listeners.set(name, listener);
  }

  emit(name: string, data: unknown): void {
    this.listeners.get(name)?.({ data: JSON.stringify(data) } as MessageEvent);
  }

  close(): void {}
}

describe("live broker attachment", () => {
  beforeEach(() => {
    (globalThis as unknown as { EventSource: typeof FakeEventSource }).EventSource = FakeEventSource;
    FakeEventSource.instances = [];
    stopLiveBridgeForTests();
    useAppStore.setState({ connectedBroker: null });
    useLiveStore.setState({
      attached: false,
      profileId: null,
      environment: null,
      phase: "idle",
      ready: false,
      executionAllowed: false,
      generation: 0,
      reasonCode: null,
      managerStatus: "idle",
      managerError: null,
      account: null,
      positions: [],
      orders: [],
      fills: [],
      health: null,
      notices: [],
    });
    mockLiveApi.session.mockReset();
    mockLiveApi.connect.mockReset();
    mockLiveApi.disconnect.mockReset();
    mockLiveApi.meta.mockReset();
    mockLiveApi.profiles.mockReset();
    mockLiveApi.profile.mockReset();
    mockLiveApi.switchProfile.mockReset();
    mockLiveApi.state.mockReset();
    mockLiveApi.setGates.mockReset();
  });

  test("local mode restores chart-only state without probing live profile APIs", async () => {
    mockLiveApi.session.mockResolvedValue({ authenticated: true, csrf: "csrf", env: "local" });

    await restoreServerProfile();

    expect(mockLiveApi.profile).not.toHaveBeenCalled();
    expect(useAppStore.getState().connectedBroker).toBeNull();
    expect(useLiveStore.getState().attached).toBe(false);
  });

  test("local mode preserves a persisted Paper attachment without live state", async () => {
    useAppStore.setState({ connectedBroker: "mock", orders: [{ id: "paper-order" } as never] });
    mockLiveApi.session.mockResolvedValue({ authenticated: true, csrf: "csrf", env: "local" });

    await restoreServerProfile();

    expect(useAppStore.getState().connectedBroker).toBe("mock");
    expect(useAppStore.getState().orders).toEqual([{ id: "paper-order" }]);
    expect(useLiveStore.getState().attached).toBe(false);
    expect(mockLiveApi.profile).not.toHaveBeenCalled();
  });

  test("paper selection does not require an operator session", async () => {
    await expect(switchLiveProfile("paper")).resolves.toBe("paper");

    expect(mockLiveApi.session).not.toHaveBeenCalled();
    expect(useAppStore.getState().connectedBroker).toBe("mock");
    expect(useLiveStore.getState().attached).toBe(false);
  });

  test("failed live connect clears the app broker and live state", async () => {
    useAppStore.setState({ connectedBroker: "binance" });
    useLiveStore.setState({ attached: true, positions: [{ id: "p", symbol: "BTCUSDT" } as never] });
    mockLiveApi.session.mockResolvedValue({ authenticated: true, csrf: "csrf", env: "testnet" });
    mockLiveApi.connect.mockRejectedValue(new Error("manager unavailable"));

    await expect(connectLiveBroker()).resolves.toBe("error");

    expect(useAppStore.getState().connectedBroker).toBeNull();
    expect(useLiveStore.getState().attached).toBe(false);
    expect(useLiveStore.getState().positions).toEqual([]);
    expect(useLiveStore.getState().managerStatus).toBe("error");
  });

  test("live is attached only after healthy server confirmation and state load", async () => {
    mockLiveApi.session.mockResolvedValue({ authenticated: true, csrf: "csrf", env: "testnet" });
    mockLiveApi.connect.mockResolvedValue({ ok: true, status: "ready" });
    mockLiveApi.meta.mockResolvedValue({
      env: "testnet",
      envLabel: "Testnet",
      connectedBroker: "binance",
      managerStatus: "ready",
      managerError: null,
      execution: { canSubmit: true, reasons: [] },
      health: { streamHealthy: true, managerReady: true },
    });
    mockLiveApi.state.mockResolvedValue({ account: null, positions: [], orders: [], fills: [] });

    await expect(connectLiveBroker()).resolves.toBe("connected");

    expect(useAppStore.getState().connectedBroker).toBe("binance");
    expect(useLiveStore.getState().attached).toBe(true);
  });

  test("disconnect detaches live and clears the app broker", async () => {
    useAppStore.setState({ connectedBroker: "binance" });
    useLiveStore.setState({ attached: true });
    mockLiveApi.disconnect.mockResolvedValue({ ok: true });

    await disconnectLiveBroker();

    expect(useAppStore.getState().connectedBroker).toBeNull();
    expect(useLiveStore.getState().attached).toBe(false);
    expect(mockLiveApi.disconnect).toHaveBeenCalledTimes(1);
  });

  test("restores only a server-confirmed ready profile and opens its event stream", async () => {
    const status = {
      profileId: "binance-testnet",
      environment: "testnet",
      phase: "ready",
      ready: true,
      managerStatus: "ready",
      streamHealthy: true,
      executionAllowed: true,
      generation: 7,
      reasonCode: null,
    };
    mockLiveApi.session.mockResolvedValue({ authenticated: true, csrf: "csrf", env: "testnet" });
    mockLiveApi.profile.mockResolvedValue(status);
    mockLiveApi.state.mockResolvedValue({ account: null, positions: [], orders: [], fills: [] });

    await restoreServerProfile();

    expect(useAppStore.getState().connectedBroker).toBe("binance");
    expect(useLiveStore.getState()).toEqual(expect.objectContaining({
      attached: true,
      profileId: "binance-testnet",
      generation: 7,
      phase: "ready",
    }));
    expect(FakeEventSource.instances).toHaveLength(1);
    expect(mockLiveApi.setGates).toHaveBeenCalledWith({ executionEnabled: true });
  });

  test("does not restore a persisted paper broker when the server has no active profile", async () => {
    useAppStore.setState({ connectedBroker: "mock", orders: [{ id: "paper-order" } as never] });
    mockLiveApi.session.mockResolvedValue({ authenticated: true, csrf: "csrf", env: "testnet" });
    mockLiveApi.profile.mockResolvedValue({
      profileId: null,
      environment: null,
      phase: "idle",
      ready: false,
      managerStatus: "idle",
      streamHealthy: null,
      executionAllowed: false,
      generation: 0,
      reasonCode: null,
    });

    await restoreServerProfile();

    expect(useAppStore.getState().connectedBroker).toBeNull();
    expect(useAppStore.getState().orders).toEqual([{ id: "paper-order" }]);
    expect(useLiveStore.getState().attached).toBe(false);
  });

  test("ignores events from a fenced attachment", async () => {
    const status = {
      profileId: "binance-testnet",
      environment: "testnet",
      phase: "ready",
      ready: true,
      managerStatus: "ready",
      streamHealthy: true,
      executionAllowed: true,
      generation: 3,
      reasonCode: null,
    };
    mockLiveApi.session.mockResolvedValue({ authenticated: true, csrf: "csrf", env: "testnet" });
    mockLiveApi.profile.mockResolvedValue(status);
    mockLiveApi.state.mockResolvedValue({ account: null, positions: [], orders: [], fills: [] });

    await restoreServerProfile();
    const source = FakeEventSource.instances[0];
    source.emit("state", { account: null, positions: [{ id: "current" }], orders: [], fills: [] });
    expect(useLiveStore.getState().positions).toEqual([{ id: "current" }]);

    stopLiveBridgeForTests();
    source.emit("state", { account: null, positions: [{ id: "stale" }], orders: [], fills: [] });
    expect(useLiveStore.getState().positions).toEqual([{ id: "current" }]);
  });

  test("keeps the confirmed profile visible while switching and sends only the typed target", async () => {
    const previous: ProfileRuntimeStatusDto = {
      profileId: "binance-testnet",
      environment: "testnet",
      phase: "ready",
      ready: true,
      managerStatus: "ready",
      streamHealthy: true,
      executionAllowed: true,
      generation: 3,
      reasonCode: null,
    };
    const target: ProfileRuntimeStatusDto = { ...previous, profileId: "binance-production", environment: "production", generation: 4 };
    let resolveSwitch: (value: unknown) => void = () => undefined;
    const switchPromise = new Promise<unknown>((resolve) => {
      resolveSwitch = resolve;
    });
    mockLiveApi.session.mockResolvedValue({ authenticated: true, csrf: "csrf", env: "testnet" });
    mockLiveApi.profile.mockResolvedValue(target);
    mockLiveApi.switchProfile.mockReturnValue(switchPromise);
    mockLiveApi.state.mockResolvedValue({ account: null, positions: [], orders: [], fills: [] });
    useLiveStore.getState().setProfileRuntime(previous);
    useLiveStore.getState().setAttached(true);
    useAppStore.setState({ connectedBroker: "binance" });

    const switching = switchLiveProfile("binance-production", true);
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(useLiveStore.getState()).toEqual(expect.objectContaining({
      profileId: "binance-testnet",
      phase: "switching",
      ready: false,
    }));
    expect(useAppStore.getState().connectedBroker).toBe("binance");
    expect(mockLiveApi.switchProfile).toHaveBeenCalledWith(expect.objectContaining({
      profileId: "binance-production",
      confirmProduction: true,
    }));

    resolveSwitch(target);
    await expect(switching).resolves.toBe("ready");
    expect(useLiveStore.getState()).toEqual(expect.objectContaining({
      profileId: "binance-production",
      generation: 4,
      phase: "ready",
      ready: true,
    }));
    expect(FakeEventSource.instances).toHaveLength(1);
  });
});
