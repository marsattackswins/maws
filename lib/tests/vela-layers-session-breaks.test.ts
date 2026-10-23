/**
 * Paint-path tests for the `maws-session-breaks` renderer layer (lib/vela-layers.ts).
 *
 * The layer receives the chart's OWN bars each frame and must never paint a
 * separator the chart has no bars for: Vela extrapolates time→x, so a break that
 * came from a deeper/differently-synced feed would land as a dashed line
 * floating in the empty right-hand space (the artefact reported after a session
 * break, popping up again on every timeframe switch).
 */
import { registerRendererLayer } from "@/lib/charting";
import "@/lib/vela-layers";

const HOUR_MS = 3_600_000;
const T0 = Date.UTC(2026, 9, 14);

type LayerDef = {
  id: string;
  create: () => {
    mount: (canvas: HTMLCanvasElement) => void;
    render: (args: unknown) => void;
    destroy?: () => void;
  };
};

/** The session-break layer definition captured by the vela mock at import time. */
function sessionBreakLayer(): LayerDef {
  const register = registerRendererLayer as unknown as jest.Mock;
  const def = register.mock.calls
    .map(([d]) => d as LayerDef)
    .find((d) => d.id === "maws-session-breaks");
  if (!def) throw new Error("maws-session-breaks was not registered");
  return def;
}

/** Fake canvas + the columns the layer actually stroke()d. */
function harness() {
  const columns: number[] = [];
  const clearRect = jest.fn();
  const ctx = {
    setTransform: jest.fn(),
    clearRect,
    setLineDash: jest.fn(),
    beginPath: jest.fn(),
    stroke: jest.fn(),
    moveTo: (x: number) => columns.push(x),
    lineTo: jest.fn(),
    strokeStyle: "",
    lineWidth: 1,
  };
  const canvas = {
    width: 600,
    height: 300,
    getContext: () => ctx,
  } as unknown as HTMLCanvasElement;
  const layer = sessionBreakLayer().create();
  layer.mount(canvas);

  // 10px per hour, right-anchored at T0 — easy to assert against.
  const coords = { dpr: 1, width: 600, timeToX: (ms: number) => ((ms - T0) / HOUR_MS) * 10 };
  const bars = (fromHour: number, toHour: number) =>
    Array.from({ length: toHour - fromHour + 1 }, (_, i) => ({ time: T0 + (fromHour + i) * HOUR_MS }));

  const render = (timesMs: number[], series: { time: number }[]) => {
    columns.length = 0;
    layer.render({
      data: { times: timesMs, color: "#787b86", width: 1, dash: [6, 4] },
      coords,
      bars: series,
      bounds: { top: 10, height: 250 },
      settings: {},
      pending: [],
      scale: {},
      theme: {},
      priceStyle: "candles",
      nowMs: 0,
      cursor: null,
    } as never);
    return [...columns];
  };
  return { render, bars, clearRect };
}

describe("maws-session-breaks layer", () => {
  it("paints a separator only between two loaded bars", () => {
    const { render, bars } = harness();
    // Bars 08:00 → 36:00; breaks at 10:00, 34:00, and two the chart has no bars for.
    const painted = render(
      [T0 + 10 * HOUR_MS, T0 + 34 * HOUR_MS, T0 + 60 * HOUR_MS, T0 + 90 * HOUR_MS],
      bars(8, 36),
    );
    expect(painted).toEqual([100, 340]);
  });

  it("refuses every break when they all sit past the newest bar", () => {
    const { render, bars } = harness();
    // The reported artefact: a payload from a series this chart has not loaded.
    expect(render([T0 + 60 * HOUR_MS, T0 + 84 * HOUR_MS], bars(0, 12))).toEqual([]);
  });

  it("clears its canvas instead of keeping the previous frame", () => {
    const { render, bars, clearRect } = harness();
    expect(render([T0 + 10 * HOUR_MS], bars(8, 12))).toEqual([100]);
    clearRect.mockClear();
    expect(render([T0 + 70 * HOUR_MS], bars(8, 12))).toEqual([]);
    expect(clearRect).toHaveBeenCalled();
  });

  it("paints nothing without a loaded series", () => {
    const { render } = harness();
    expect(render([T0 + 10 * HOUR_MS], [])).toEqual([]);
    expect(render([T0 + 10 * HOUR_MS], [{ time: T0 }])).toEqual([]);
  });
});
