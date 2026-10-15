/**
 * vela-event-source.ts — the shared client-side event feed behind the chart's
 * timeline-marks lane.
 *
 * The News and Calendar panels each fetch for themselves; the lane needs the same
 * data for every chart cell, so this module owns ONE calendar snapshot for the whole
 * app and ONE news snapshot per symbol, each with an in-flight dedupe and a refresh
 * cadence. A subscriber gets the current snapshot on change and nothing when it is
 * idle — no per-cell request storm, and nothing fetched for a cell with no marks lane.
 *
 * Both sources carry epoch-ms times (`CalendarEvent.at`, `NewsItem.at`) — the unit
 * Vela's `TimelineMark.time` expects.
 */
import { fetchCalendarEvents, type CalendarEvent } from "@/lib/calendar";
import { fetchNews, type NewsItem } from "@/lib/news";

export type CellEventSnapshot = {
  events: CalendarEvent[];
  news: NewsItem[];
};

export type CellEventSubscriber = (snapshot: CellEventSnapshot) => void;

/** Injectable sources + cadence (tests pass fakes; the app uses the real fetches). */
export type CellEventSourceDeps = {
  calendar: () => Promise<{ events: CalendarEvent[] }>;
  news: (symbol: string) => Promise<{ items: NewsItem[] }>;
  /** How long a snapshot stays fresh before a load refetches it. */
  refreshMs: number;
};

const DEFAULT_DEPS: CellEventSourceDeps = {
  calendar: () => fetchCalendarEvents(),
  news: (symbol) => fetchNews({ symbol }),
  refreshMs: 5 * 60_000,
};

export type CellEventSource = {
  /** Snapshot updates for one symbol; returns the unsubscribe (stops its refresh timer). */
  subscribe(symbol: string, cb: CellEventSubscriber): () => void;
  /** The loaded snapshot, or null before the first load settles. */
  snapshot(symbol: string): CellEventSnapshot | null;
  /** Reload now (a manual refresh; concurrent calls share the in-flight request). */
  refresh(symbol: string): void;
  /** Symbols with a live subscriber — introspection for tests. */
  liveSymbols(): string[];
};

type Entry = {
  snapshot: CellEventSnapshot | null;
  subs: Set<CellEventSubscriber>;
  timer: ReturnType<typeof setInterval> | null;
  inflight: Promise<void> | null;
};

export function createCellEventSource(overrides: Partial<CellEventSourceDeps> = {}): CellEventSource {
  const deps: CellEventSourceDeps = { ...DEFAULT_DEPS, ...overrides };
  const entries = new Map<string, Entry>();
  let calendar: { events: CalendarEvent[]; ts: number } | null = null;
  let calendarInflight: Promise<CalendarEvent[]> | null = null;
  const news = new Map<string, { items: NewsItem[]; ts: number }>();
  const newsInflight = new Map<string, Promise<NewsItem[]>>();

  const loadCalendar = async (force = false): Promise<CalendarEvent[]> => {
    if (!force && calendar && Date.now() - calendar.ts < deps.refreshMs) return calendar.events;
    if (calendarInflight) return calendarInflight;
    const promise = (async (): Promise<CalendarEvent[]> => {
      try {
        const result = await deps.calendar();
        calendar = { events: result.events ?? [], ts: Date.now() };
      } catch {
        /* keep the previous snapshot — a failed refresh is not an empty calendar */
      }
      return calendar?.events ?? [];
    })();
    calendarInflight = promise;
    try {
      return await promise;
    } finally {
      calendarInflight = null;
    }
  };

  const loadNews = async (symbol: string, force = false): Promise<NewsItem[]> => {
    const cached = news.get(symbol);
    if (!force && cached && Date.now() - cached.ts < deps.refreshMs) return cached.items;
    const inflight = newsInflight.get(symbol);
    if (inflight) return inflight;
    const promise = (async (): Promise<NewsItem[]> => {
      try {
        const result = await deps.news(symbol);
        news.set(symbol, { items: result.items ?? [], ts: Date.now() });
      } catch {
        /* same: keep what we had */
      }
      return news.get(symbol)?.items ?? [];
    })();
    newsInflight.set(symbol, promise);
    try {
      return await promise;
    } finally {
      newsInflight.delete(symbol);
    }
  };

  const notify = (entry: Entry): void => {
    if (entry.snapshot == null) return;
    for (const cb of entry.subs) {
      try {
        cb(entry.snapshot);
      } catch {
        /* a subscriber throwing must not stop the others */
      }
    }
  };

  /** Load (or reload) one symbol's snapshot; `force` skips the freshness check — the
   *  refresh cadence and a manual refresh both mean "go get it", while a merely
   *  late-arriving subscriber reuses a fresh snapshot rather than refetching it.
   *  A failed load keeps the previous snapshot: a network blip is not an empty day. */
  const load = (symbol: string, force = false): void => {
    const entry = entries.get(symbol);
    if (!entry || entry.inflight) return;
    entry.inflight = (async () => {
      const [events, items] = await Promise.all([loadCalendar(force), loadNews(symbol, force)]);
      entry.snapshot = { events, news: items };
      notify(entry);
    })()
      .catch(() => undefined)
      .finally(() => {
        entry.inflight = null;
      }) as Promise<void>;
  };

  return {
    subscribe(symbol, cb) {
      let entry = entries.get(symbol);
      if (!entry) {
        entry = { snapshot: null, subs: new Set(), timer: null, inflight: null };
        entries.set(symbol, entry);
      }
      entry.subs.add(cb);
      if (entry.timer == null) {
        entry.timer = setInterval(() => load(symbol, true), deps.refreshMs);
        // Node keeps the process alive for an interval; the app is a browser but
        // tests and SSR are not.
        (entry.timer as unknown as { unref?: () => void }).unref?.();
      }
      if (entry.snapshot) cb(entry.snapshot);
      else load(symbol);
      return () => {
        const live = entries.get(symbol);
        if (!live) return;
        live.subs.delete(cb);
        if (live.subs.size > 0) return;
        if (live.timer != null) clearInterval(live.timer);
        entries.delete(symbol);
      };
    },
    snapshot(symbol) {
      return entries.get(symbol)?.snapshot ?? null;
    },
    refresh(symbol) {
      const entry = entries.get(symbol);
      if (!entry || entry.inflight) return;
      load(symbol, true);
    },
    liveSymbols() {
      return [...entries.keys()];
    },
  };
}

/** The app-wide source: one calendar cache, one news cache per symbol. */
export const cellEventSource = createCellEventSource();
