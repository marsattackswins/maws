import { describe, it, expect, afterEach } from "@jest/globals";
import { useAppStore } from "@/lib/store";
import type { Store } from "@/lib/store";
import {
  createNewsSlice,
  normalizeNewsRehydrate,
  type NewsSlice,
} from "@/lib/slices/news-slice";

/**
 * Phase D regression tests for the news-slice:
 *   - defaults: calendarNewsSplit 0.52, all four collapse flags false;
 *   - setCalendarNewsSplit clamps into [0.22, 0.78];
 *   - each collapse toggle flips only its own flag;
 *   - normalizeNewsRehydrate replaces non-finite calendarNewsSplit with 0.52
 *     and preserves valid values;
 *   - atomicity: every action performs exactly ONE set() touching only its
 *     own slice field.
 */

function resetNews(): void {
  useAppStore.setState({
    calendarNewsSplit: 0.52,
    detailsCollapsed: false,
    newsCollapsed: false,
    performanceCollapsed: false,
    technicalsCollapsed: false,
  });
}

describe("news-slice (real root store)", () => {
  afterEach(resetNews);

  it("exposes the documented defaults", () => {
    resetNews();
    const s = useAppStore.getState();
    expect(s.calendarNewsSplit).toBe(0.52);
    expect(s.detailsCollapsed).toBe(false);
    expect(s.newsCollapsed).toBe(false);
    expect(s.performanceCollapsed).toBe(false);
    expect(s.technicalsCollapsed).toBe(false);
  });

  it("setCalendarNewsSplit clamps into [0.22, 0.78]", () => {
    resetNews();
    const s = useAppStore.getState();

    const cases: Array<[number, number]> = [
      [0, 0.22],
      [-1, 0.22],
      [1, 0.78],
      [5, 0.78],
      [0.22, 0.22],
      [0.78, 0.78],
      [0.6, 0.6],
    ];
    for (const [input, clamped] of cases) {
      s.setCalendarNewsSplit(input);
      expect(useAppStore.getState().calendarNewsSplit).toBe(clamped);
    }
  });

  it("each collapse toggle flips only its own flag", () => {
    resetNews();
    const s = useAppStore.getState();

    s.toggleDetailsCollapsed();
    expect(useAppStore.getState().detailsCollapsed).toBe(true);
    s.toggleNewsCollapsed();
    s.togglePerformanceCollapsed();
    s.toggleTechnicalsCollapsed();
    let now = useAppStore.getState();
    expect(now.detailsCollapsed).toBe(true);
    expect(now.newsCollapsed).toBe(true);
    expect(now.performanceCollapsed).toBe(true);
    expect(now.technicalsCollapsed).toBe(true);

    s.toggleNewsCollapsed();
    now = useAppStore.getState();
    expect(now.newsCollapsed).toBe(false);
    // The other three flags are untouched by the news toggle.
    expect(now.detailsCollapsed).toBe(true);
    expect(now.performanceCollapsed).toBe(true);
    expect(now.technicalsCollapsed).toBe(true);
  });

  describe("normalizeNewsRehydrate", () => {
    const fakeState = (patch: Record<string, unknown>): Store =>
      ({ ...patch }) as unknown as Store;

    it("replaces non-finite calendarNewsSplit values with 0.52", () => {
      for (const bad of [NaN, Infinity, -Infinity, undefined, null, "0.6"]) {
        const st = fakeState({ calendarNewsSplit: bad });
        normalizeNewsRehydrate(st);
        expect(st.calendarNewsSplit).toBe(0.52);
      }
    });

    it("preserves valid calendarNewsSplit values", () => {
      for (const good of [0.22, 0.52, 0.78, 0, 3]) {
        const st = fakeState({ calendarNewsSplit: good });
        normalizeNewsRehydrate(st);
        expect(st.calendarNewsSplit).toBe(good);
      }
    });
  });
});

describe("news-slice atomicity (counting set harness)", () => {
  interface Harness {
    calls: Array<Partial<Store>>;
    state: Store;
    slice: NewsSlice;
  }

  function makeHarness(initial: Record<string, unknown>): Harness {
    const calls: Array<Partial<Store>> = [];
    const state = { ...initial } as unknown as Store;
    const set = (
      partial: Partial<Store> | ((s: Store) => Partial<Store>),
    ): void => {
      const patch = typeof partial === "function" ? partial(state) : partial;
      calls.push(patch);
      Object.assign(state as unknown as Record<string, unknown>, patch);
    };
    const get = (): Store => state;
    return { calls, state, slice: createNewsSlice(set, get) };
  }

  const flags = [
    ["toggleDetailsCollapsed", "detailsCollapsed"],
    ["toggleNewsCollapsed", "newsCollapsed"],
    ["togglePerformanceCollapsed", "performanceCollapsed"],
    ["toggleTechnicalsCollapsed", "technicalsCollapsed"],
  ] as const;

  it("setCalendarNewsSplit performs exactly one set() with only calendarNewsSplit", () => {
    const h = makeHarness({ calendarNewsSplit: 0.52 });
    h.slice.setCalendarNewsSplit(2);
    expect(h.calls).toHaveLength(1);
    expect(h.calls[0]).toEqual({ calendarNewsSplit: 0.78 });
  });

  it.each(flags.map((f) => [...f]))(
    "%s performs exactly one set() with only %s",
    (action, field) => {
      const h = makeHarness({ [field]: false });
      const slice = h.slice as unknown as Record<string, () => void>;
      slice[action]();
      expect(h.calls).toHaveLength(1);
      expect(h.calls[0]).toEqual({ [field]: true });
    },
  );
});
