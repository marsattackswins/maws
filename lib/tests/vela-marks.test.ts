/**
 * Direct function-level tests for the timeline-marks builders in lib/vela-marks.ts —
 * the calendar/news → `TimelineMark` mapping the chart lane paints, and the group
 * definitions its settings' Events tab lists.
 */
import type { CalendarEvent } from "../calendar";
import type { NewsItem } from "../news";
import {
  ALL_MARK_GROUPS,
  EVENT_MARK_GROUPS,
  MARK_GROUPS,
  buildEventMarks,
  buildTradeMarks,
  defineVelaMarkGroups,
} from "../vela-marks";

const NOW = Date.UTC(2026, 9, 14, 12, 0);

const event = (over: Partial<CalendarEvent> = {}): CalendarEvent => ({
  id: "e1",
  at: NOW,
  title: "CPI m/m",
  country: "US",
  impact: "high",
  category: "macro",
  ...over,
});

const news = (over: Partial<NewsItem> = {}): NewsItem => ({
  id: "n1",
  at: NOW - 60_000,
  headline: "Bitcoin rips through resistance",
  source: "CoinDesk",
  url: "https://example.com/article",
  ...over,
});

describe("timeline-mark groups", () => {
  it("nests the calendar's impact buckets under one master switch", () => {
    const parent = EVENT_MARK_GROUPS.find((g) => g.id === "economic");
    expect(parent).toMatchObject({ label: "Economic releases" });
    expect(EVENT_MARK_GROUPS.filter((g) => g.parent === "economic").map((g) => g.id)).toEqual([
      "economic-high",
      "economic-medium",
      "economic-low",
    ]);
  });

  it("hides low-impact releases and older headlines by default", () => {
    const byId = new Map(ALL_MARK_GROUPS.map((g) => [g.id, g]));
    expect(byId.get("economic-low")?.visible).toBe(false);
    expect(byId.get("news-all")?.visible).toBe(false);
    expect(byId.get("economic-high")?.visible).toBeUndefined(); // declared default: visible
  });

  it("defines every group once per chart", () => {
    const defined: string[] = [];
    defineVelaMarkGroups({ defineGroup: (g) => defined.push(g.id) });
    expect(defined).toEqual(ALL_MARK_GROUPS.map((g) => g.id));
    expect(defined).toEqual(expect.arrayContaining(MARK_GROUPS.map((g) => g.id)));
  });
});

describe("buildEventMarks — economic releases", () => {
  it("maps impact to the group, color, and shape", () => {
    const [high, medium] = buildEventMarks({
      events: [
        event({ id: "hi", impact: "high" }),
        event({ id: "med", impact: "medium", at: NOW + 3_600_000 }),
      ],
      now: NOW,
    });

    expect(high!).toMatchObject({
      id: "econ-hi",
      time: NOW,
      group: "economic-high",
      glyph: { shape: "diamond", color: "#f23645", letter: "E" },
    });
    expect(medium!).toMatchObject({
      group: "economic-medium",
      glyph: { shape: "circle", color: "#ffa726" },
    });
  });

  it("carries the release numbers in the popup and opens the calendar only when wired", () => {
    const plain = buildEventMarks({
      events: [event({ forecast: "0.3%", previous: "0.2%", actual: "0.4%" })],
      now: NOW,
    })[0]!;
    const items = panelItems(plain);
    expect(items).toEqual([
      { type: "field", label: "Impact", value: "High impact" },
      { type: "field", label: "Region", value: "US" },
      { type: "field", label: "Forecast", value: "0.3%" },
      { type: "field", label: "Previous", value: "0.2%" },
      { type: "field", label: "Actual", value: "0.4%" },
    ]);

    const wired = buildEventMarks({
      events: [event()],
      now: NOW,
      actions: { openCalendar: () => undefined },
    })[0]!;
    expect(panelItems(wired).at(-1)).toMatchObject({ type: "button", label: "Open calendar" });
  });
});

describe("buildEventMarks — news", () => {
  it("keeps the last 24 hours on the latest group and files the rest under the hidden one", () => {
    // Ascending time means the three-day-old item comes first.
    const [older, fresh] = buildEventMarks({
      news: [
        news({ id: "fresh", at: NOW - 60_000 }),
        news({ id: "old", at: NOW - 3 * 24 * 60 * 60 * 1000 }),
      ],
      now: NOW,
    });
    expect(fresh!.group).toBe("news-latest");
    expect(older!.group).toBe("news-all");
  });

  it("uses the headline as the popup title and offers the article link", () => {
    const mark = buildEventMarks({
      news: [news()],
      now: NOW,
      actions: { openUrl: () => undefined, openNews: () => undefined },
    })[0]!;
    expect(mark.title).toBe("Bitcoin rips through resistance");
    expect(mark.glyph).toEqual({ shape: "circle", color: "#26a69a", letter: "N" });
    const items = panelItems(mark);
    expect(items).toEqual(
      expect.arrayContaining([
        { type: "field", label: "Source", value: "CoinDesk" },
        expect.objectContaining({ type: "button", label: "Read article" }),
        expect.objectContaining({ type: "button", label: "Open news panel" }),
      ]),
    );
  });

  it("omits the article button when the item has no URL", () => {
    const mark = buildEventMarks({
      news: [news({ url: "" })],
      now: NOW,
      actions: { openUrl: () => undefined },
    })[0]!;
    expect(panelItems(mark).some((i) => i.type === "button" && i.label === "Read article")).toBe(false);
  });
});

describe("buildEventMarks — set shape", () => {
  it("hides marks after the cutoff (the replay cursor)", () => {
    const marks = buildEventMarks({
      events: [event({ id: "past", at: NOW - 60_000 }), event({ id: "future", at: NOW + 60_000 })],
      news: [news({ id: "future-news", at: NOW + 120_000 })],
      now: NOW,
      cutoff: NOW,
    });
    expect(marks.map((m) => m.id)).toEqual(["econ-past"]);
  });

  it("sorts by time across both sources", () => {
    const marks = buildEventMarks({
      events: [event({ id: "late", at: NOW + 60_000 }), event({ id: "early", at: NOW })],
      news: [news({ id: "later", at: NOW + 30_000 }), news({ id: "same", at: NOW })],
      now: NOW,
    });
    expect(marks.map((m) => m.id)).toEqual(["econ-early", "news-same", "news-later", "econ-late"]);
  });

  it("keeps the earliest mark when a feed repeats an id", () => {
    const marks = buildEventMarks({
      events: [
        event({ id: "dup", at: NOW + 60_000 }),
        event({ id: "dup", at: NOW }),
        event({ id: "other", at: NOW + 120_000 }),
      ],
      now: NOW,
    });
    expect(marks.map((m) => [m.id, m.time])).toEqual([
      ["econ-dup", NOW],
      ["econ-other", NOW + 120_000],
    ]);
  });
});

describe("buildTradeMarks", () => {
  const pane = { symbol: "BTCUSDT.P" };

  it("pins fills to their own moment and ignores other symbols", () => {
    const marks = buildTradeMarks({
      pane,
      alerts: [],
      orders: [],
      positions: [],
      fills: [
        { id: "f1", symbol: "BTCUSDT.P", time: 1_700_000_000, price: 60_000, side: "buy" },
        { id: "f2", symbol: "ETHUSDT.P", time: 1_700_000_100, price: 3_000, side: "sell" },
      ],
    });
    expect(marks).toHaveLength(1);
    expect(marks[0]!).toMatchObject({ id: "fill-f1", time: 1_700_000_000_000, group: "fills" });
  });

  it("skips disabled alerts and carries position levels", () => {
    const marks = buildTradeMarks({
      pane,
      alerts: [
        { id: "a1", symbol: "BTCUSDT.P", price: 99, side: "above", enabled: false },
        { id: "a2", symbol: "BTCUSDT.P", price: 99, side: "above", enabled: true },
      ],
      orders: [],
      positions: [
        { id: "p1", symbol: "BTCUSDT.P", entry: 60_000, side: "long", qty: 1, tp: 61_000, sl: 59_000 },
      ],
      fills: [],
    });
    expect(marks.map((m) => m.id)).toEqual(["alert-a2", "pos-p1"]);
    expect(panelItems(marks[1]!)).toEqual([
      { type: "field", label: "Long", value: "1 @ 60000" },
      { type: "field", label: "TP", value: "61000" },
      { type: "field", label: "SL", value: "59000" },
    ]);
  });
});

/** The panel items of a mark's popup (all marks here carry a panel). */
function panelItems(mark: { content?: unknown }): Array<Record<string, unknown>> {
  const content = mark.content as { panel?: { items: Array<Record<string, unknown>> } } | undefined;
  return content?.panel?.items ?? [];
}
