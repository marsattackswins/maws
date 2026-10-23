/**
 * market-sessions unit tests — the Sessions card's whole "which session are we in /
 * when does the next one open" truth. Every instant is FIXED, so a DST boundary or a
 * weekend can't turn a passing suite flaky.
 */
import {
  MARKET_SESSIONS,
  clockLabel,
  hourLabel,
  isSessionOpen,
  nextOpening,
  nextSessionOpening,
  openSessions,
  sessionDayRuns,
  sessionState,
  sessionLocalParts,
} from "@/lib/market-sessions";

const at = (iso: string) => Date.parse(iso);
const session = (name: string) => {
  const found = MARKET_SESSIONS.find((s) => s.name === name);
  if (!found) throw new Error(`no ${name} session`);
  return found;
};
const names = (venues: readonly { name: string }[]) => venues.map((s) => s.name);

/** Thursday 2026-01-15 — London = UTC in winter, New York = UTC-5, Asia = UTC+11/+9. */
const THU_0830 = at("2026-01-15T08:30:00Z");

describe("market sessions", () => {
  it("is the same three cash sessions for every instrument", () => {
    expect(names(MARKET_SESSIONS)).toEqual(["Tokyo", "London", "New York"]);
    expect(Object.fromEntries(MARKET_SESSIONS.map(({ name, color }) => [name, color]))).toEqual({
      Tokyo: "#ff6600",
      London: "#22c55e",
      "New York": "#3b82f6",
    });
    for (const s of MARKET_SESSIONS) {
      expect(() => new Intl.DateTimeFormat("en-GB", { timeZone: s.tz })).not.toThrow();
      // Every venue has real opening hours and shuts at the weekend; the card draws
      // one bar per venue, so each needs its own ink.
      expect(s.window[1] - s.window[0]).toBeLessThan(1440);
      expect(s.weekdaysOnly).toBe(true);
      expect(s.color).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it("reads each venue's own wall clock", () => {
    const local = sessionLocalParts(session("London"), at("2026-01-15T12:34:00Z"));
    expect(local).not.toBeNull();
    expect(local!.weekday).toBe("Thu");
    expect(local!.hour).toBe(12);
    expect(local!.minute).toBe(34);
    expect(local!.minuteOfDay).toBe(754);
    // A bogus zone answers null instead of throwing.
    expect(sessionLocalParts({ tz: "Mars/Olympus" }, at("2026-01-15T12:34:00Z"))).toBeNull();
  });

  it("opens London 08:00–17:00 local and closes it for the weekend", () => {
    // Thursday 2026-01-15, London = UTC in winter.
    expect(isSessionOpen(session("London"), at("2026-01-15T07:59:00Z"))).toBe(false);
    expect(isSessionOpen(session("London"), at("2026-01-15T08:00:00Z"))).toBe(true);
    expect(isSessionOpen(session("London"), at("2026-01-15T16:59:00Z"))).toBe(true);
    expect(isSessionOpen(session("London"), at("2026-01-15T17:00:00Z"))).toBe(false);
    // Saturday mid-window: the weekday test closes it outright.
    expect(isSessionOpen(session("London"), at("2026-01-17T12:00:00Z"))).toBe(false);
  });

  it("follows each venue's DST instead of a fixed UTC offset", () => {
    // Winter: London opens 08:00 UTC, New York 13:00 UTC.
    expect(isSessionOpen(session("London"), at("2026-01-15T08:30:00Z"))).toBe(true);
    expect(isSessionOpen(session("New York"), at("2026-01-15T08:30:00Z"))).toBe(false);
    // Summer (Wednesday 2026-07-15): both shift an hour earlier in UTC terms.
    expect(isSessionOpen(session("London"), at("2026-07-15T06:30:00Z"))).toBe(false);
    expect(isSessionOpen(session("London"), at("2026-07-15T07:30:00Z"))).toBe(true);
    expect(isSessionOpen(session("New York"), at("2026-07-15T11:30:00Z"))).toBe(false);
    expect(isSessionOpen(session("New York"), at("2026-07-15T12:30:00Z"))).toBe(true);
  });

  it("lists the open venues in card order, and nothing at the weekend", () => {
    // Overnight UTC: Tokyo 14:00 JST is the only session running.
    expect(names(openSessions(at("2026-01-15T05:00:00Z")))).toEqual(["Tokyo"]);
    // Mid-morning UTC: Tokyo has rung the close bell, London is the only live session.
    expect(names(openSessions(THU_0830))).toEqual(["London"]);
    expect(names(openSessions(at("2026-01-15T14:00:00Z")))).toEqual(["London", "New York"]);
    expect(names(openSessions(at("2026-01-17T12:00:00Z")))).toEqual([]);
  });

  it("hands Tokyo over to London and New York, with one quiet hour", () => {
    const midnight = at("2026-01-15T00:00:00Z");
    // Tokyo 23:00–08:00 UTC, London 08:00–17:00, New York 13:00–22:00.
    expect(names(openSessions(midnight + 7 * 3_600_000))).toEqual(["Tokyo"]);
    expect(names(openSessions(midnight + 9 * 3_600_000))).toEqual(["London"]);
    expect(names(openSessions(midnight + 15 * 3_600_000))).toEqual(["London", "New York"]);
    expect(names(openSessions(midnight + 19 * 3_600_000))).toEqual(["New York"]);
    // 22:00 UTC: New York has rung the close bell and Tokyo has not opened yet.
    expect(names(openSessions(midnight + 22 * 3_600_000))).toEqual([]);
    expect(names(openSessions(midnight + 23 * 3_600_000))).toEqual(["Tokyo"]);
    // The same hours on Saturday are all empty — a 24/7 asset still has no session.
    const saturday = at("2026-01-17T00:00:00Z");
    for (let hour = 0; hour < 24; hour++) {
      expect(names(openSessions(saturday + hour * 3_600_000))).toEqual([]);
    }
  });

  it("draws each session's windows on the current UTC day", () => {
    // Thursday, EST winter: London 08:00–17:00 UTC, New York 13:00–22:00 UTC (both 9h).
    expect(sessionDayRuns(session("London"), at("2026-01-15T12:00:00Z"))).toEqual([[480, 1020]]);
    expect(sessionDayRuns(session("New York"), at("2026-01-15T12:00:00Z"))).toEqual([[780, 1320]]);
    // Summer DST moves both an hour earlier on the UTC strip.
    expect(sessionDayRuns(session("London"), at("2026-07-15T12:00:00Z"))).toEqual([[420, 960]]);
    expect(sessionDayRuns(session("New York"), at("2026-07-15T12:00:00Z"))).toEqual([[720, 1260]]);
    // Tokyo runs 23:00–08:00 UTC, so its row is split across the UTC midnight.
    expect(sessionDayRuns(session("Tokyo"), at("2026-01-15T12:00:00Z"))).toEqual([
      [0, 480],
      [1380, 1440],
    ]);
    // Saturday is empty for every venue.
    expect(sessionDayRuns(session("London"), at("2026-01-17T12:00:00Z"))).toEqual([]);
  });

  it("finds the next opening minute, skipping the weekend", () => {
    expect(nextOpening(session("London"), at("2026-01-15T18:00:00Z"))).toBe(
      at("2026-01-16T08:00:00Z"),
    );
    // Friday evening hands over to Monday 08:00 London.
    expect(nextOpening(session("London"), at("2026-01-16T18:00:00Z"))).toBe(
      at("2026-01-19T08:00:00Z"),
    );
  });

  it("counts down to the soonest closed venue", () => {
    // Thursday 08:30 UTC: London trades, New York opens at 13:00 UTC.
    const next = nextSessionOpening(THU_0830);
    expect(next?.session.name).toBe("New York");
    expect(next?.at).toBe(at("2026-01-15T13:00:00Z"));
    // Saturday noon: everything is shut and Tokyo is first back (Sunday 23:00 UTC).
    const weekend = nextSessionOpening(at("2026-01-17T12:00:00Z"));
    expect(weekend?.session.name).toBe("Tokyo");
    expect(weekend?.at).toBe(at("2026-01-18T23:00:00Z"));
  });

  it("reports the card state: the live sessions, the badge and the next opening", () => {
    const single = sessionState(THU_0830);
    expect(single.badge).toBe("Open");
    expect(single.next?.session.name).toBe("New York");
    expect(single.nextInMinutes).toBe(270);

    const overlap = sessionState(at("2026-01-15T14:00:00Z"));
    expect(overlap.badge).toBe("Overlap");

    // The weekend has no live session at all.
    const shut = sessionState(at("2026-01-17T12:00:00Z"));
    expect(shut.badge).toBe("Closed");
    expect(shut.next?.session.name).toBe("Tokyo");
    expect(shut.next?.at).toBe(at("2026-01-18T23:00:00Z"));
  });

  it("labels the hourly axis as bare hours with am/pm", () => {
    expect(hourLabel(0)).toBe("12am");
    expect(hourLabel(2)).toBe("2am");
    expect(hourLabel(12)).toBe("12pm");
    expect(hourLabel(18)).toBe("6pm");
    expect(hourLabel(23)).toBe("11pm");
    // The axis ticks themselves: midnight → 6am → noon → 6pm → midnight.
    expect([0, 6, 12, 18, 24].map(hourLabel)).toEqual(["12am", "6am", "12pm", "6pm", "12am"]);
  });

  it("stamps the live marker with the exact time", () => {
    expect(clockLabel(at("2026-01-15T13:21:00Z"))).toBe("1:21pm");
    expect(clockLabel(at("2026-01-15T00:05:00Z"))).toBe("12:05am");
    // On the hour the minutes are dropped rather than printed as ":00".
    expect(clockLabel(at("2026-01-15T13:00:00Z"))).toBe("1pm");
    expect(clockLabel(at("2026-01-15T12:00:00Z"))).toBe("12pm");
    expect(clockLabel(at("2026-01-15T00:00:00Z"))).toBe("12am");
  });
});
