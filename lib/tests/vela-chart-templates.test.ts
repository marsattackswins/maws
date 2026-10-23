import { describe, it, expect, beforeEach, afterEach, jest } from "@jest/globals";
import { registerChart, unregisterChart } from "@/lib/chart-registry";
import {
  applyTemplate,
  getTemplates,
  removeTemplate,
  saveTemplate,
} from "@/lib/vela-templates";
import { useAppStore } from "@/lib/store";
import { createStudy } from "@/lib/studies";
import type { Store } from "@/lib/store";
import type { PaneNative } from "@/types";

/**
 * Workspace-level template actions must target a chart that is ACTUALLY
 * mounted. The zustand `activePaneId` can outlive the grid (layout switches
 * rebuild workspace cells while the store still names a pane that is gone),
 * and the old resolution then silently no-oped: a template click changed
 * nothing anywhere. These tests pin the fallback through the store's visible
 * panes plus the pointer heal, and that a healthy pointer still wins.
 */

const TPL_DOC = { version: 1, candles: { upColor: "#00ffff" } };
const templateStorage = new Map<string, string>();
let originalWindow: PropertyDescriptor | undefined;

type Stub = {
  vela: {
    renderer: { applyConfig: ReturnType<typeof jest.fn>; getConfig: () => unknown };
    indicators: () => [];
  };
};

function stubHandle(doc: unknown): Stub {
  return {
    vela: {
      renderer: {
        applyConfig: jest.fn() as unknown as Stub["vela"]["renderer"]["applyConfig"],
        getConfig: () => doc,
      },
      indicators: () => [],
    },
  };
}

function seedPanes(count: number) {
  const panes = Array.from({ length: count }, (_, i) => ({
    id: `pane-${i}`,
    symbol: `S${i}`,
    timeframe: "1m",
    studies: [],
  })) as unknown as Store["panes"];
  useAppStore.setState({ panes, layoutCount: count as never });
}

beforeEach(() => {
  originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      localStorage: {
        getItem: (key: string) => templateStorage.get(key) ?? null,
        setItem: (key: string, value: string) => templateStorage.set(key, value),
        removeItem: (key: string) => templateStorage.delete(key),
      },
    },
  });
  templateStorage.clear();
  seedPanes(4);
  useAppStore.setState({ activePaneId: "pane-0", activeIndicatorTemplateId: null });
});

afterEach(() => {
  for (const id of [`pane-0`, `pane-1`, `pane-2`, `pane-3`, `pane-9`]) unregisterChart(id);
  // Remove every template this case created (store keeps them in memory).
  for (const t of [...getTemplates()]) removeTemplate(t.id);
  seedPanes(12);
  if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
  else Reflect.deleteProperty(globalThis, "window");
});

describe("vela-templates target resolution", () => {
  it("saves from the first VISIBLE pane with a live renderer when the active pointer went stale, and heals the pointer", () => {
    useAppStore.setState({ activePaneId: "pane-9" }); // pointer names an ungrid pane
    const p1 = stubHandle(TPL_DOC);
    registerChart("pane-1", p1 as never);
    const saved = useAppStore.getState();
    expect(saved.activePaneId).toBe("pane-9");

    expect(saveTemplate("maws")).toBe(true);
    const tpls = getTemplates();
    expect(tpls.find((t) => t.name === "maws")).toBeTruthy();
    expect(tpls.find((t) => t.name === "maws")?.config).toEqual(TPL_DOC);
    // The stale pointer is healed to the pane the template actually shot.
    expect(useAppStore.getState().activePaneId).toBe("pane-1");
  });

  it("applies to the first VISIBLE pane with a live renderer when the active pointer went stale, and heals the pointer", () => {
    const p1 = stubHandle(TPL_DOC);
    registerChart("pane-1", p1 as never);
    saveTemplate("maws"); // saved through the fallback (active pointer is still fine yet pane-0 is unmounted)
    useAppStore.setState({ activePaneId: "pane-9" });

    const tplId = getTemplates().find((t) => t.name === "maws")?.id;
    applyTemplate(tplId ?? "");

    expect(p1.vela.renderer.applyConfig).toHaveBeenCalledTimes(1);
    expect(useAppStore.getState().activePaneId).toBe("pane-1");
  });

  it("still targets the live ACTIVE pane when its pointer is healthy", () => {
    const p0 = stubHandle(TPL_DOC);
    const p1 = stubHandle({ ...TPL_DOC, candles: { upColor: "#111111" } });
    registerChart("pane-0", p0 as never);
    registerChart("pane-1", p1 as never);
    useAppStore.setState({ activePaneId: "pane-1" });

    expect(saveTemplate("maws")).toBe(true);
    const tplId = getTemplates().find((t) => t.name === "maws")?.id;
    applyTemplate(tplId ?? "");

    // Active pane (pane-1) was BOTH the save source and the apply target.
    expect(p1.vela.renderer.applyConfig).toHaveBeenCalledTimes(1);
    expect(p0.vela.renderer.applyConfig).not.toHaveBeenCalled();
    expect(getTemplates().find((t) => t.name === "maws")?.config).toEqual({
      version: 1,
      candles: { upColor: "#111111" },
    });
  });

  it("saves and applies the chart's managed and native indicators to a selected pane", () => {
    const study = createStudy("ema", { length: 21 });
    const panes = useAppStore.getState().panes.map((pane) =>
      pane.id === "pane-1"
        ? {
            ...pane,
            studies: [study],
            natives: [{ type: "sma", inputs: { length: 50 }, hidden: true }],
          }
        : pane,
    );
    useAppStore.setState({ panes });
    const prefs = {
      watermark: false,
      replayWatermark: false,
      indicatorTitles: false,
      indicatorValues: true,
    };
    const source = {
      ...stubHandle(TPL_DOC),
      getTemplatePrefs: () => prefs,
    };
    const addedNative: PaneNative[] = [];
    const visibleChanges: boolean[] = [];
    const liveNativeHandles: Array<{
      nativeType: string;
      visible: boolean;
      inputValues: () => Record<string, unknown>;
      setVisible: (visible: boolean) => void;
      remove: () => void;
    }> = [];
    const oldNative = {
      nativeType: "rsi",
      visible: true,
      inputValues: () => ({ length: 14 }),
      setVisible: () => {},
      remove: jest.fn(() => liveNativeHandles.splice(liveNativeHandles.indexOf(oldNative), 1)),
    };
    liveNativeHandles.push(oldNative);
    const target = {
      vela: {
        renderer: {
          applyConfig: jest.fn(),
          getConfig: () => ({}),
        },
        indicators: () => liveNativeHandles,
        addNativeIndicator: (type: string, options: { inputs: PaneNative["inputs"] }) => {
          addedNative.push({ type, inputs: options.inputs });
          const handle = {
            nativeType: type,
            visible: true,
            inputValues: () => options.inputs,
            setVisible: (visible: boolean) => {
              visibleChanges.push(visible);
              handle.visible = visible;
            },
            remove: () => liveNativeHandles.splice(liveNativeHandles.indexOf(handle), 1),
          };
          liveNativeHandles.push(handle);
          return handle;
        },
      },
      applyTemplatePrefs: jest.fn(),
    };
    registerChart("pane-1", source as never);
    registerChart("pane-2", target as never);
    useAppStore.setState({ activePaneId: "pane-1" });

    expect(saveTemplate("with indicators")).toBe(true);
    const saved = getTemplates().find((template) => template.name === "with indicators");
    expect(saved?.indicators?.studies).toEqual([
      { type: "ema", settings: study.settings, hidden: false },
    ]);
    expect(saved?.indicators?.natives).toEqual([
      { type: "sma", inputs: { length: 50 }, hidden: true },
    ]);
    expect(saved?.prefs).toEqual(prefs);

    expect(applyTemplate(saved!.id, "pane-2")).toBe(true);
    expect(target.vela.renderer.applyConfig).toHaveBeenCalledWith(TPL_DOC);
    expect(target.applyTemplatePrefs).toHaveBeenCalledWith(prefs);
    const appliedPane = useAppStore.getState().panes.find((pane) => pane.id === "pane-2");
    expect(appliedPane?.studies).toHaveLength(1);
    expect(appliedPane?.studies[0]).toMatchObject({ type: "ema", settings: study.settings });
    expect(appliedPane?.studies[0]?.id).not.toBe(study.id);
    expect(appliedPane?.velaState).toMatchObject(prefs);
    expect(appliedPane?.natives).toEqual([
      { type: "sma", inputs: { length: 50 }, hidden: true },
    ]);
    expect(addedNative).toEqual([{ type: "sma", inputs: { length: 50 } }]);
    expect(visibleChanges).toEqual([false]);
    expect(oldNative.remove).toHaveBeenCalledTimes(1);
    expect(liveNativeHandles.map((handle) => handle.nativeType)).toEqual(["sma"]);
  });

  it("captures and applies display preferences through persisted pane state when chart hooks are unavailable", () => {
    const prefs = {
      watermark: false,
      replayWatermark: true,
      indicatorTitles: false,
      indicatorValues: true,
    };
    const panes = useAppStore.getState().panes.map((pane) =>
      pane.id === "pane-1"
        ? { ...pane, velaState: { ...prefs } }
        : pane.id === "pane-2"
          ? {
              ...pane,
              velaState: {
                watermark: true,
                replayWatermark: true,
                indicatorTitles: true,
                indicatorValues: true,
              },
            }
          : pane,
    );
    useAppStore.setState({ panes, activePaneId: "pane-1" });
    registerChart("pane-1", stubHandle(TPL_DOC) as never);
    registerChart("pane-2", stubHandle({}) as never);

    expect(saveTemplate("display prefs")).toBe(true);
    const template = getTemplates().find((entry) => entry.name === "display prefs");
    expect(template?.prefs).toEqual(prefs);

    expect(applyTemplate(template!.id, "pane-2")).toBe(true);
    expect(useAppStore.getState().panes.find((pane) => pane.id === "pane-2")?.velaState).toMatchObject(prefs);
  });
});
