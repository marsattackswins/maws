/**
 * market-sessions.ts
 *
 * The session clock behind the watchlist's Sessions card — adapted from the
 * market-sessions widget of the Vela playground (github.com/infinitegithub/vela),
 * which mirrors the card the official Vela client renders under its watchlist.
 * Vela is © LuxAlgo, Apache-2.0.
 *
 * Local extension beyond the widget: this is a WORLD session clock, the same for every
 * instrument. Crypto, metals, US equities and Asian equities all show the three cash
 * sessions this book trades through (Tokyo / London / New York) and which of them is
 * running right now. BTC trades 24/7 but is still "in" whichever session is live; gold
 * keeps trading through Asia even though its home market is London — so every card
 * shows the same three rows rather than a filtered subset.
 *
 * Every venue is a cash market with opening hours: there is no "always open" row, and
 * a weekend really is empty.
 *
 * Pure time logic only: the canvas component (components/maws/MarketSessions.tsx)
 * and the tests share these helpers, so "is London open?" answers the same way
 * everywhere.
 */

export type SessionDef = {
  /** Marker label on the map / row label on the timeline. */
  name: string;
  /** IANA zone — the venue's DST is applied by `Intl`, never hardcoded. */
  tz: string;
  /** Local-time open window `[openMinute, closeMinute)`, in the venue's own zone. */
  window: readonly [number, number];
  /** True for venues that shut at the weekend — all of them. */
  weekdaysOnly: boolean;
  /** Where the venue sits, kept for a map view of the card (no markers are drawn now). */
  lat?: number;
  lon?: number;
  /** Ink for this venue's bars on the timeline. */
  color: string;
};

/** 08:00 → 17:00: the cash window every venue shares. */
export const SESSION_OPEN_MINUTE = 8 * 60;
export const SESSION_CLOSE_MINUTE = 17 * 60;

/**
 * Every venue the card draws, in headline and timeline-row order — the cash sessions
 * this book trades through, west to east. The card shows all of them for every
 * instrument, so this list IS the card. (Sydney was dropped: not traded here.)
 */
export const MARKET_SESSIONS: readonly SessionDef[] = [
  {
    name: "Tokyo",
    tz: "Asia/Tokyo",
    window: [SESSION_OPEN_MINUTE, SESSION_CLOSE_MINUTE],
    weekdaysOnly: true,
    lat: 35.7,
    lon: 139.7,
    color: "#ff6600",
  },
  {
    name: "London",
    tz: "Europe/London",
    window: [SESSION_OPEN_MINUTE, SESSION_CLOSE_MINUTE],
    weekdaysOnly: true,
    lat: 51.5,
    lon: -0.1,
    color: "#22c55e",
  },
  {
    name: "New York",
    tz: "America/New_York",
    window: [SESSION_OPEN_MINUTE, SESSION_CLOSE_MINUTE],
    weekdaysOnly: true,
    lat: 40.7,
    lon: -74,
    color: "#3b82f6",
  },
];

const MINUTE_MS = 60_000;
const DAY_MINUTES = 1440;
/** How far ahead `nextOpening` scans — a weekend plus a holiday's slack. */
const NEXT_OPEN_HORIZON_MINUTES = 8 * DAY_MINUTES;

const formatters = new Map<string, Intl.DateTimeFormat>();

function formatterFor(tz: string): Intl.DateTimeFormat | null {
  const cached = formatters.get(tz);
  if (cached) return cached;
  try {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: tz,
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    });
    formatters.set(tz, fmt);
    return fmt;
  } catch {
    return null; // bogus zone — callers treat it as "no session data"
  }
}

const WEEKEND = new Set(["Sat", "Sun"]);

/** A session's own wall clock: weekday plus minute-of-day. Null when the zone is bogus. */
export function sessionLocalParts(
  session: Pick<SessionDef, "tz">,
  at: number,
): { weekday: string; hour: number; minute: number; minuteOfDay: number } | null {
  const fmt = formatterFor(session.tz);
  if (!fmt) return null;
  const parts: Record<string, string> = {};
  for (const p of fmt.formatToParts(new Date(at))) parts[p.type] = p.value;
  const hour = Number(parts.hour ?? 0);
  const minute = Number(parts.minute ?? 0);
  return {
    weekday: parts.weekday ?? "",
    hour,
    minute,
    minuteOfDay: hour * 60 + minute,
  };
}

/** Is this venue trading at `at`? Malformed windows and weekends resolve here. */
export function isSessionOpen(
  session: Pick<SessionDef, "tz" | "window" | "weekdaysOnly">,
  at: number,
): boolean {
  const [open, close] = session.window;
  if (close <= open) return false; // malformed window — never claim "open"
  const local = sessionLocalParts(session, at);
  if (!local) return false;
  if (session.weekdaysOnly && WEEKEND.has(local.weekday)) return false;
  return local.minuteOfDay >= open && local.minuteOfDay < close;
}

/** The venues trading at `at`, in card order. */
export function openSessions(at: number): SessionDef[] {
  return MARKET_SESSIONS.filter((s) => isSessionOpen(s, at));
}

/**
 * First future instant this venue trades, minute-resolved, or null when it stays shut
 * through the horizon. Scans forward so a Friday-evening pick lands on Monday (the
 * weekend is skipped by the weekday test, not by a holiday table).
 */
export function nextOpening(
  session: Pick<SessionDef, "tz" | "window" | "weekdaysOnly">,
  at: number,
): number | null {
  const start = Math.floor(at / MINUTE_MS) * MINUTE_MS;
  for (let i = 0; i <= NEXT_OPEN_HORIZON_MINUTES; i++) {
    const t = start + i * MINUTE_MS;
    if (isSessionOpen(session, t)) return t;
  }
  return null;
}

/**
 * The soonest venue that is CLOSED right now and opens later — what the card's
 * "Next · …" line counts down to. Null only when every venue is already open.
 */
export function nextSessionOpening(at: number): { session: SessionDef; at: number } | null {
  let best: { session: SessionDef; at: number } | null = null;
  for (const session of MARKET_SESSIONS) {
    if (isSessionOpen(session, at)) continue;
    const opening = nextOpening(session, at);
    if (opening == null) continue;
    if (!best || opening < best.at) best = { session, at: opening };
  }
  return best;
}

/**
 * A venue's open windows across the CURRENT UTC day, as `[startMinute, endMinute)`
 * offsets from that day's 00:00 UTC — the timeline strip's bars. Sampled every five
 * minutes (the strip is a few hundred px wide, so bars stay exact-looking) and DST
 * shifts fall out of the local-time test for free.
 */
export function sessionDayRuns(
  session: Pick<SessionDef, "tz" | "window" | "weekdaysOnly">,
  at: number,
): Array<[number, number]> {
  const d = new Date(at);
  const dayStart = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  const SAMPLE = 5;
  const runs: Array<[number, number]> = [];
  let start: number | null = null;
  for (let minute = 0; minute <= DAY_MINUTES; minute += SAMPLE) {
    const open = minute < DAY_MINUTES && isSessionOpen(session, dayStart + minute * MINUTE_MS);
    if (open && start === null) start = minute;
    if (!open && start !== null) {
      runs.push([start, minute]);
      start = null;
    }
  }
  return runs;
}

export type SessionBadge = "Open" | "Overlap" | "Closed";

export type SessionState = {
  badge: SessionBadge;
  next: { session: SessionDef; at: number } | null;
  /** Minutes until `next` opens (0 when there is no next). */
  nextInMinutes: number;
};

/**
 * "12am" / "6am" / "12pm" — the hourly axis only ever sits on the hour, so the label
 * is bare hour + meridiem: no minutes, no leading zero, never "12:00 am".
 */
export function hourLabel(hour24: number): string {
  const hour = ((hour24 % 24) + 24) % 24;
  return `${hour % 12 === 0 ? 12 : hour % 12}${hour < 12 ? "am" : "pm"}`;
}

/**
 * "1:21pm" — a full clock time on the same face as `hourLabel`, with the minutes
 * dropped on the hour ("1pm", never "1:00pm"). The card's live marker uses this.
 */
export function clockLabel(at: number): string {
  const d = new Date(at);
  const hour = d.getUTCHours();
  const minute = d.getUTCMinutes();
  const suffix = hour < 12 ? "am" : "pm";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return minute === 0 ? `${hour12}${suffix}` : `${hour12}:${String(minute).padStart(2, "0")}${suffix}`;
}

/**
 * The card's state at `at`: how many sessions are live, and which one opens next. The
 * strip names the sessions itself, so there is no text headline to build here.
 */
export function sessionState(at: number): SessionState {
  const openCount = openSessions(at).length;
  const next = nextSessionOpening(at);
  // "Overlap" is the interesting state — two cash venues running at once.
  const badge: SessionBadge = openCount === 0 ? "Closed" : openCount > 1 ? "Overlap" : "Open";
  return {
    badge,
    next,
    nextInMinutes: next ? Math.max(0, Math.round((next.at - at) / MINUTE_MS)) : 0,
  };
}
