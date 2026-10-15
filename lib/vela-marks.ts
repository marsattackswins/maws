/**
 * vela-marks.ts — Vela timeline-marks bridge (pure builders + group definitions).
 *
 * MAWS events (economic calendar, news) and trade state are DATA, not user state:
 * they flow through the store and the shared event source, so they map to Vela's
 * `chart.marks` timeline-lane model. Everything here is pure — no DOM, no fetching,
 * no controller calls — so the mapping is unit-testable; `vela-marks-wiring.ts`
 * pushes the result into a cell's `MarksControl` and re-pushes when sources change.
 */
import type { MarkGroup, MarkPanelItem, TimelineMark } from "@/lib/charting";
import type { CalendarEvent } from "@/lib/calendar";
import type { NewsItem } from "@/lib/news";

/** Chart-panel hooks a popup button can call (absent ones render no button). */
export type MarkActions = {
  openCalendar?: () => void;
  openNews?: () => void;
  openUrl?: (url: string) => void;
};

const IMPACT_COLORS: Record<CalendarEvent["impact"], string> = {
  high: "#f23645",
  medium: "#ffa726",
  low: "#4c525e",
};
const IMPACT_LABEL: Record<CalendarEvent["impact"], string> = {
  high: "High impact",
  medium: "Medium impact",
  low: "Low impact",
};
/** The docs' own news token color — calm teal, distinct from every trade color. */
const NEWS_COLOR = "#26a69a";
/** Headlines newer than this ride the "latest" group; older ones hide behind its sub-switch. */
const NEWS_LATEST_MS = 24 * 60 * 60 * 1000;

export type VelaMarksInput = {
  pane: { symbol: string };
  alerts: Array<{ id: string; symbol: string; price: number; side: "above" | "below"; enabled: boolean }>;
  orders: Array<{ id: string; symbol: string; price: number; side: "buy" | "sell"; type: string; qty: number }>;
  positions: Array<{
    id: string;
    symbol: string;
    entry: number;
    side: "long" | "short";
    qty: number;
    tp?: number | null;
    sl?: number | null;
  }>;
  fills: Array<{ id: string; symbol: string; time: number; price: number; side: "buy" | "sell" }>;
};

/** Trade-lane groups — kept for the fills/alerts slice of the lane. */
export const MARK_GROUPS: MarkGroup[] = [
  { id: "alerts", label: "Alerts" },
  { id: "orders", label: "Orders" },
  { id: "positions", label: "Positions" },
  { id: "fills", label: "Fills", parent: "orders" },
];

/**
 * Event-lane groups. The nesting is exactly the shape the docs describe: one
 * master switch per source, with sub-choices underneath (impact buckets for the
 * calendar, recency for news). Low-impact releases start hidden — the lane should
 * not carry a calendar the user never asked to read.
 */
export const EVENT_MARK_GROUPS: MarkGroup[] = [
  { id: "economic", label: "Economic releases" },
  { id: "economic-high", label: "High impact", parent: "economic" },
  { id: "economic-medium", label: "Medium impact", parent: "economic" },
  { id: "economic-low", label: "Low impact", parent: "economic", visible: false },
  { id: "news", label: "News" },
  { id: "news-latest", label: "Last 24 hours", parent: "news" },
  { id: "news-all", label: "Older headlines", parent: "news", visible: false },
];

/** Every group the lane can paint — trade groups and event groups. */
export const ALL_MARK_GROUPS: MarkGroup[] = [...MARK_GROUPS, ...EVENT_MARK_GROUPS];

/** Define the lane's groups once per chart (labels + defaults for the Events tab). */
export function defineVelaMarkGroups(ctrl: { defineGroup(group: MarkGroup): unknown }): void {
  for (const g of ALL_MARK_GROUPS) ctrl.defineGroup(g);
}

function impactField(e: CalendarEvent): MarkPanelItem[] {
  const items: MarkPanelItem[] = [{ type: "field", label: "Impact", value: IMPACT_LABEL[e.impact] }];
  if (e.country) items.push({ type: "field", label: "Region", value: e.country });
  if (e.forecast) items.push({ type: "field", label: "Forecast", value: e.forecast });
  if (e.previous) items.push({ type: "field", label: "Previous", value: e.previous });
  if (e.actual) items.push({ type: "field", label: "Actual", value: e.actual });
  return items;
}

/** One economic release → one lane mark, grouped by its impact bucket. */
export function calendarMark(e: CalendarEvent, actions: MarkActions = {}): TimelineMark {
  const items = impactField(e);
  if (actions.openCalendar) {
    items.push({ type: "button", label: "Open calendar", primary: true, run: actions.openCalendar });
  }
  return {
    id: `econ-${e.id}`,
    time: e.at,
    group: `economic-${e.impact}`,
    glyph: {
      shape: e.impact === "high" ? "diamond" : "circle",
      color: IMPACT_COLORS[e.impact],
      letter: "E",
    },
    title: e.title,
    tooltip: `${e.title} · ${IMPACT_LABEL[e.impact]}`,
    content: { panel: { items } },
  };
}

/** One headline → one lane mark, grouped by recency (latest vs older). */
export function newsMark(item: NewsItem, now: number, actions: MarkActions = {}): TimelineMark {
  const recent = now - item.at <= NEWS_LATEST_MS;
  const items: MarkPanelItem[] = [{ type: "field", label: "Source", value: item.source }];
  if (item.category) items.push({ type: "field", label: "Category", value: item.category });
  if (item.summary) items.push({ type: "text", text: item.summary });
  if (item.url && actions.openUrl) {
    const url = item.url;
    items.push({
      type: "button",
      label: "Read article",
      primary: true,
      run: () => actions.openUrl?.(url),
    });
  }
  if (actions.openNews) {
    items.push({ type: "button", label: "Open news panel", run: actions.openNews });
  }
  return {
    id: `news-${item.id}`,
    time: item.at,
    group: recent ? "news-latest" : "news-all",
    glyph: { shape: "circle", color: NEWS_COLOR, letter: "N" },
    title: item.headline,
    tooltip: `${item.source}${item.category ? ` · ${item.category}` : ""}`,
    content: { panel: { items } },
  };
}

/**
 * Build the event lane's marks. `cutoff` hides anything after a moment (the replay
 * cursor — an event that has not happened yet must not spoil a replay). Ids are
 * stable, so the lane repaints in place rather than blinking a fresh set.
 */
export function buildEventMarks(input: {
  events?: readonly CalendarEvent[];
  news?: readonly NewsItem[];
  now?: number;
  cutoff?: number | null;
  actions?: MarkActions;
}): TimelineMark[] {
  const now = input.now ?? Date.now();
  const actions = input.actions ?? {};
  const cutoff = input.cutoff ?? null;
  const marks: TimelineMark[] = [];
  for (const e of input.events ?? []) marks.push(calendarMark(e, actions));
  for (const n of input.news ?? []) marks.push(newsMark(n, now, actions));
  return dedupeMarks(cutoff == null ? marks : marks.filter((m) => m.time <= cutoff));
}

/** Keep one mark per id, earliest first (a `set()` replaces a duplicate wholesale). */
function dedupeMarks(marks: readonly TimelineMark[]): TimelineMark[] {
  const sorted = [...marks].sort((a, b) => a.time - b.time);
  const seen = new Set<string>();
  const out: TimelineMark[] = [];
  for (const m of sorted) {
    if (seen.has(m.id)) continue;
    seen.add(m.id);
    out.push(m);
  }
  return out;
}

/** Push MAWS trade state into the Vela marks lane (pure — the caller calls `set`). */
export function buildTradeMarks(input: VelaMarksInput): TimelineMark[] {
  const symbol = input.pane.symbol;
  const items: TimelineMark[] = [];

  for (const a of input.alerts) {
    if (a.symbol !== symbol || !a.enabled) continue;
    items.push({
      id: `alert-${a.id}`,
      time: Date.now(),
      group: "alerts",
      glyph: { shape: "diamond", color: "#f59e0b", letter: a.side === "above" ? "↑" : "↓" },
      title: "Alert",
      tooltip: `${a.side === "above" ? "≥" : "≤"} ${a.price}`,
      content: { panel: { items: [{ type: "field", label: "Alert", value: `${a.side === "above" ? "≥" : "≤"} ${a.price}` }] } },
    });
  }

  for (const o of input.orders) {
    if (o.symbol !== symbol) continue;
    const buy = o.side === "buy";
    items.push({
      id: `order-${o.id}`,
      time: Date.now(),
      group: "orders",
      glyph: { shape: "circle", color: buy ? "#089981" : "#f23645", letter: buy ? "B" : "S" },
      title: o.type,
      tooltip: `${buy ? "Buy" : "Sell"} ${o.qty} @ ${o.price}`,
      content: { panel: { items: [{ type: "field", label: o.type, value: `${buy ? "Buy" : "Sell"} ${o.qty} @ ${o.price}` }] } },
    });
  }

  for (const p of input.positions) {
    if (p.symbol !== symbol) continue;
    const long = p.side === "long";
    const fields: MarkPanelItem[] = [
      { type: "field", label: long ? "Long" : "Short", value: `${p.qty} @ ${p.entry}` },
    ];
    if (p.tp != null) fields.push({ type: "field", label: "TP", value: String(p.tp) });
    if (p.sl != null) fields.push({ type: "field", label: "SL", value: String(p.sl) });
    items.push({
      id: `pos-${p.id}`,
      time: Date.now(),
      group: "positions",
      glyph: { shape: "pin", color: long ? "#089981" : "#f23645", letter: long ? "L" : "S" },
      title: "Position",
      tooltip: `${long ? "Long" : "Short"} ${p.qty} @ ${p.entry}`,
      content: { panel: { items: fields } },
    });
  }

  for (const f of input.fills) {
    if (f.symbol !== symbol) continue;
    const buy = f.side === "buy";
    items.push({
      id: `fill-${f.id}`,
      time: f.time * 1000,
      group: "fills",
      glyph: { shape: "circle", color: buy ? "#089981" : "#f23645", letter: buy ? "B" : "S" },
      title: "Fill",
      tooltip: `${buy ? "Bought" : "Sold"} @ ${f.price}`,
      content: { panel: { items: [{ type: "field", label: "Fill", value: `${buy ? "Bought" : "Sold"} @ ${f.price}` }] } },
    });
  }

  return items;
}
