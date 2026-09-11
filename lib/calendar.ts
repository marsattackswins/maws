export type CalendarEvent = {
  id: string;
  at: number;
  title: string;
  country: string;
  impact: "high" | "medium" | "low";
  category: "macro" | "crypto" | "commodity";
  actual?: string;
  forecast?: string;
  previous?: string;
  source?: "xoomar" | "mock";
};

/** Raw row from Xoomar free calendar. */
export type XoomarCalendarRow = {
  source?: string;
  eventName?: string;
  importance?: string;
  scheduledAt?: string;
  periodLabel?: string | null;
  previous?: string | null;
  forecast?: string | null;
  actual?: string | null;
};

function dayStart(offset: number) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  return d.getTime();
}

function mapImpact(raw: string | null | undefined): CalendarEvent["impact"] {
  const v = String(raw ?? "").toLowerCase();
  if (v.includes("high") || v === "3") return "high";
  if (v.includes("medium") || v.includes("med") || v === "2") return "medium";
  return "low";
}

function fmtValue(v: string | number | null | undefined): string | undefined {
  if (v == null || v === "") return undefined;
  return String(v);
}

function categorize(title: string, country: string): CalendarEvent["category"] {
  const t = title.toLowerCase();
  if (
    /eia|opec|crude|oil inventory|natural gas|baker hughes|api crude|petroleum/.test(
      t,
    )
  ) {
    return "commodity";
  }
  if (/bitcoin|crypto|ethereum|token unlock/.test(t) || country === "CR") {
    return "crypto";
  }
  return "macro";
}

function isHighOrMedium(impact: CalendarEvent["impact"]) {
  return impact === "high" || impact === "medium";
}

export function mapXoomarRows(rows: XoomarCalendarRow[]): CalendarEvent[] {
  const out: CalendarEvent[] = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!row?.eventName || !row.scheduledAt) continue;
    const at = Date.parse(row.scheduledAt);
    if (!Number.isFinite(at)) continue;
    const impact = mapImpact(row.importance);
    if (!isHighOrMedium(impact)) continue;
    const title = row.eventName.trim();
    const period = row.periodLabel ? ` · ${row.periodLabel}` : "";
    out.push({
      id: `xo-${at}-${i}`,
      at,
      title: `${title}${period}`,
      country: "US",
      impact,
      category: categorize(title, "US"),
      actual: fmtValue(row.actual),
      forecast: fmtValue(row.forecast),
      previous: fmtValue(row.previous),
      source: "xoomar",
    });
  }
  out.sort((a, b) => a.at - b.at);
  return out;
}

/** Curated demo events when live sources fail (high + medium across 7 days). */
export function getMockCalendarEvents(): CalendarEvent[] {
  const rows: Array<
    Omit<CalendarEvent, "id" | "at" | "source"> & { day: number; hour: number }
  > = [
    {
      day: 0,
      hour: 8,
      title: "Core PCE Price Index m/m",
      country: "US",
      impact: "high",
      category: "macro",
      forecast: "0.2%",
      previous: "0.1%",
    },
    {
      day: 0,
      hour: 8,
      title: "Prelim GDP Price Index q/q",
      country: "US",
      impact: "medium",
      category: "macro",
      forecast: "2.0%",
    },
    {
      day: 1,
      hour: 12,
      title: "Unemployment Claims",
      country: "US",
      impact: "medium",
      category: "macro",
      forecast: "220K",
      previous: "218K",
    },
    {
      day: 1,
      hour: 14,
      title: "Jackson Hole Symposium",
      country: "US",
      impact: "medium",
      category: "macro",
    },
    {
      day: 2,
      hour: 12,
      title: "GDP m/m",
      country: "CA",
      impact: "high",
      category: "macro",
      forecast: "0.2%",
    },
    {
      day: 2,
      hour: 14,
      title: "EIA Crude Oil Inventories",
      country: "US",
      impact: "high",
      category: "commodity",
    },
    {
      day: 3,
      hour: 9,
      title: "BoE rate decision",
      country: "GB",
      impact: "high",
      category: "macro",
      forecast: "4.00%",
    },
    {
      day: 3,
      hour: 13,
      title: "CB Consumer Confidence",
      country: "US",
      impact: "medium",
      category: "macro",
      forecast: "96.0",
    },
    {
      day: 4,
      hour: 8,
      title: "Tokyo Core CPI y/y",
      country: "JP",
      impact: "medium",
      category: "macro",
      forecast: "1.8%",
    },
    {
      day: 5,
      hour: 12,
      title: "Fed Chair speech",
      country: "US",
      impact: "medium",
      category: "macro",
    },
    {
      day: 6,
      hour: 10,
      title: "Eurozone CPI flash",
      country: "EU",
      impact: "high",
      category: "macro",
      forecast: "2.1%",
    },
  ];

  return rows.map((row, i) => ({
    id: `mock-${i}`,
    at: dayStart(row.day) + row.hour * 3600_000,
    title: row.title,
    country: row.country,
    impact: row.impact,
    category: row.category,
    actual: row.actual,
    forecast: row.forecast,
    previous: row.previous,
    source: "mock" as const,
  }));
}

/** @deprecated use getMockCalendarEvents */
export function getCalendarEvents(): CalendarEvent[] {
  return getMockCalendarEvents();
}

export type CalendarFetchResult = {
  events: CalendarEvent[];
  source: "xoomar" | "mock";
  /** Inclusive local start of the loaded window (ms). */
  windowStart: number;
  /** Exclusive local end of the loaded window (ms). */
  windowEnd: number;
  error?: string;
};

const DAY_MS = 86_400_000;
/** Only load this many calendar days ahead (today inclusive → +6). */
export const CALENDAR_FORWARD_DAYS = 7;

function windowBounds(fromDayMs: number) {
  const windowStart = fromDayMs;
  const windowEnd = fromDayMs + CALENDAR_FORWARD_DAYS * DAY_MS;
  return { windowStart, windowEnd };
}

function inWindow(at: number, windowStart: number, windowEnd: number) {
  return at >= windowStart && at < windowEnd;
}

function ymdLocal(ms: number) {
  const d = new Date(ms);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

async function tryXoomar(
  windowStart: number,
  windowEnd: number,
): Promise<CalendarEvent[] | null> {
  const from = ymdLocal(windowStart);
  const to = ymdLocal(windowEnd - 1);
  const res = await fetch(
    `/api/calendar/xoomar?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
    { cache: "no-store" },
  );
  if (!res.ok) return null;
  const raw = (await res.json()) as XoomarCalendarRow[] | { error?: string };
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const mapped = mapXoomarRows(raw).filter((e) =>
    inWindow(e.at, windowStart, windowEnd),
  );
  return mapped.length > 0 ? mapped : null;
}

/**
 * Load high + medium events for the next 7 local days (today inclusive).
 * Primary: Xoomar US macro calendar. Demo fallback if unavailable.
 */
export async function fetchCalendarEvents(): Promise<CalendarFetchResult> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { windowStart, windowEnd } = windowBounds(today.getTime());

  try {
    const live = await tryXoomar(windowStart, windowEnd);
    if (live && live.length > 0) {
      return { events: live, source: "xoomar", windowStart, windowEnd };
    }
  } catch {
    /* fall through */
  }

  const mock = getMockCalendarEvents().filter(
    (e) =>
      isHighOrMedium(e.impact) && inWindow(e.at, windowStart, windowEnd),
  );
  return {
    events: mock,
    source: "mock",
    windowStart,
    windowEnd,
    error: "Live calendar unavailable — showing demo events",
  };
}
