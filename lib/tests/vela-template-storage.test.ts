import { afterEach, describe, expect, it, jest } from "@jest/globals";

const storage = new Map<string, string>();
let originalWindow: PropertyDescriptor | undefined;

describe("Vela chart template storage", () => {
  afterEach(() => {
    if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
    else Reflect.deleteProperty(globalThis, "window");
  });

  it("loads saved templates when the app starts with browser storage available", async () => {
    originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        localStorage: {
          getItem: (key: string) => storage.get(key) ?? null,
          setItem: (key: string, value: string) => storage.set(key, value),
          removeItem: (key: string) => storage.delete(key),
        },
      },
    });
    storage.set(
      "maws.vela-templates",
      JSON.stringify([
        {
          id: "saved",
          name: "Saved layout",
          config: { version: 1 },
          indicators: { studies: [], natives: [] },
          prefs: {
            watermark: false,
            replayWatermark: true,
            indicatorTitles: true,
            indicatorValues: false,
          },
          createdAt: 123,
        },
      ]),
    );

    jest.resetModules();
    const { getTemplates } = await import("@/lib/vela-templates");

    expect(getTemplates()).toEqual([
      {
        id: "saved",
        name: "Saved layout",
        config: { version: 1 },
        indicators: { studies: [], natives: [] },
        prefs: {
          watermark: false,
          replayWatermark: true,
          indicatorTitles: true,
          indicatorValues: false,
        },
        createdAt: 123,
      },
    ]);
  });
});
