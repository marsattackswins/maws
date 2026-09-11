import type { ChartSettings } from "@/types";

/** IANA timezone id (e.g. Africa/Casablanca). */
export type AppTimezone = string;

export type TimezoneOption = {
  id: AppTimezone;
  city: string;
  region: string;
  iana: string;
};

const LEGACY_TIMEZONE_MAP: Record<string, string> = {
  UTC: "UTC",
  "UTC+1": "Africa/Casablanca",
  "UTC+8": "Asia/Hong_Kong",
};

function opt(region: string, city: string, iana: string): TimezoneOption {
  return { id: iana, city, region, iana };
}

/**
 * Curated professional timezone list (TradingView-style), grouped by region.
 * Ids are IANA names so DST / local rules stay correct.
 */
export const TIMEZONE_OPTIONS: TimezoneOption[] = [
  // Universal
  opt("Universal", "UTC", "UTC"),

  // Americas
  opt("Americas", "Honolulu", "Pacific/Honolulu"),
  opt("Americas", "Anchorage", "America/Anchorage"),
  opt("Americas", "Los Angeles", "America/Los_Angeles"),
  opt("Americas", "Vancouver", "America/Vancouver"),
  opt("Americas", "Denver", "America/Denver"),
  opt("Americas", "Phoenix", "America/Phoenix"),
  opt("Americas", "Chicago", "America/Chicago"),
  opt("Americas", "Mexico City", "America/Mexico_City"),
  opt("Americas", "New York", "America/New_York"),
  opt("Americas", "Toronto", "America/Toronto"),
  opt("Americas", "Bogota", "America/Bogota"),
  opt("Americas", "Lima", "America/Lima"),
  opt("Americas", "Santiago", "America/Santiago"),
  opt("Americas", "Buenos Aires", "America/Argentina/Buenos_Aires"),
  opt("Americas", "Sao Paulo", "America/Sao_Paulo"),

  // Atlantic
  opt("Atlantic", "Reykjavik", "Atlantic/Reykjavik"),
  opt("Atlantic", "Azores", "Atlantic/Azores"),

  // Europe / Africa
  opt("Europe / Africa", "London", "Europe/London"),
  opt("Europe / Africa", "Dublin", "Europe/Dublin"),
  opt("Europe / Africa", "Lisbon", "Europe/Lisbon"),
  opt("Europe / Africa", "Casablanca", "Africa/Casablanca"),
  opt("Europe / Africa", "Lagos", "Africa/Lagos"),
  opt("Europe / Africa", "Paris", "Europe/Paris"),
  opt("Europe / Africa", "Madrid", "Europe/Madrid"),
  opt("Europe / Africa", "Berlin", "Europe/Berlin"),
  opt("Europe / Africa", "Amsterdam", "Europe/Amsterdam"),
  opt("Europe / Africa", "Rome", "Europe/Rome"),
  opt("Europe / Africa", "Zurich", "Europe/Zurich"),
  opt("Europe / Africa", "Stockholm", "Europe/Stockholm"),
  opt("Europe / Africa", "Warsaw", "Europe/Warsaw"),
  opt("Europe / Africa", "Athens", "Europe/Athens"),
  opt("Europe / Africa", "Helsinki", "Europe/Helsinki"),
  opt("Europe / Africa", "Johannesburg", "Africa/Johannesburg"),
  opt("Europe / Africa", "Cairo", "Africa/Cairo"),
  opt("Europe / Africa", "Nairobi", "Africa/Nairobi"),
  opt("Europe / Africa", "Istanbul", "Europe/Istanbul"),
  opt("Europe / Africa", "Moscow", "Europe/Moscow"),

  // Middle East
  opt("Middle East", "Jerusalem", "Asia/Jerusalem"),
  opt("Middle East", "Riyadh", "Asia/Riyadh"),
  opt("Middle East", "Dubai", "Asia/Dubai"),
  opt("Middle East", "Tehran", "Asia/Tehran"),

  // Asia / Pacific
  opt("Asia / Pacific", "Karachi", "Asia/Karachi"),
  opt("Asia / Pacific", "Maldives", "Indian/Maldives"),
  opt("Asia / Pacific", "Delhi", "Asia/Kolkata"),
  opt("Asia / Pacific", "Colombo", "Asia/Colombo"),
  opt("Asia / Pacific", "Dhaka", "Asia/Dhaka"),
  opt("Asia / Pacific", "Bangkok", "Asia/Bangkok"),
  opt("Asia / Pacific", "Jakarta", "Asia/Jakarta"),
  opt("Asia / Pacific", "Ho Chi Minh", "Asia/Ho_Chi_Minh"),
  opt("Asia / Pacific", "Singapore", "Asia/Singapore"),
  opt("Asia / Pacific", "Hong Kong", "Asia/Hong_Kong"),
  opt("Asia / Pacific", "Shanghai", "Asia/Shanghai"),
  opt("Asia / Pacific", "Taipei", "Asia/Taipei"),
  opt("Asia / Pacific", "Seoul", "Asia/Seoul"),
  opt("Asia / Pacific", "Tokyo", "Asia/Tokyo"),
  opt("Asia / Pacific", "Perth", "Australia/Perth"),
  opt("Asia / Pacific", "Darwin", "Australia/Darwin"),
  opt("Asia / Pacific", "Brisbane", "Australia/Brisbane"),
  opt("Asia / Pacific", "Adelaide", "Australia/Adelaide"),
  opt("Asia / Pacific", "Sydney", "Australia/Sydney"),
  opt("Asia / Pacific", "Auckland", "Pacific/Auckland"),
  opt("Asia / Pacific", "Fiji", "Pacific/Fiji"),
];

export function normalizeTimezone(id: string | undefined | null): AppTimezone {
  if (!id) return "Africa/Casablanca";
  if (LEGACY_TIMEZONE_MAP[id]) return LEGACY_TIMEZONE_MAP[id];
  if (TIMEZONE_OPTIONS.some((o) => o.id === id)) return id;
  // Accept unknown but valid-looking IANA ids.
  if (id.includes("/") || id === "UTC") return id;
  return "Africa/Casablanca";
}

export function timezoneOption(id: AppTimezone): TimezoneOption {
  const normalized = normalizeTimezone(id);
  return (
    TIMEZONE_OPTIONS.find((o) => o.id === normalized) ?? {
      id: normalized,
      city: normalized.split("/").pop()?.replaceAll("_", " ") ?? normalized,
      region: "Other",
      iana: normalized,
    }
  );
}

export function timezoneIana(id: AppTimezone): string {
  return timezoneOption(id).iana;
}

export function timezoneTitle(opt: TimezoneOption): string {
  if (opt.iana === "UTC") return "UTC";
  return opt.city;
}

/** Live offset label for an IANA zone (handles DST where applicable). */
export function liveOffsetLabel(iana: string, at = new Date()): string {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: iana,
      timeZoneName: "shortOffset",
    }).formatToParts(at);
    const raw = parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT";
    return raw.replace(/^GMT/, "UTC").replace(/^UTC([+-])0(\d)$/, "UTC$1$2").replace("UTC+0", "UTC").replace("UTC-0", "UTC");
  } catch {
    return "UTC";
  }
}

export function formatClockTime(
  id: AppTimezone,
  hour12: boolean,
  at = new Date(),
): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12,
    timeZone: timezoneIana(id),
  }).format(at);
}

/** Format a unix-seconds chart timestamp for the crosshair time label. */
export function formatChartTime(
  unixSec: number,
  id: AppTimezone,
  hoursFormat: ChartSettings["timeHoursFormat"],
): string {
  const d = new Date(unixSec * 1000);
  const tz = timezoneIana(id);
  const datePart = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: tz,
  }).format(d);
  const timePart = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: hoursFormat === "12",
    timeZone: tz,
  }).format(d);
  // e.g. "Aug 24, 2026 - 11:20 PM"
  return `${datePart} - ${timePart}`;
}

/**
 * Compact time-scale tick labels (keep short so marks don't overlap).
 * `tickMarkType`: 0 Year, 1 Month, 2 DayOfMonth, 3 Time, 4 TimeWithSeconds
 */
export function formatChartTickMark(
  unixSec: number,
  id: AppTimezone,
  hoursFormat: ChartSettings["timeHoursFormat"],
  tickMarkType: number,
): string {
  const d = new Date(unixSec * 1000);
  const tz = timezoneIana(id);
  if (tickMarkType === 0) {
    return new Intl.DateTimeFormat("en-US", { year: "numeric", timeZone: tz }).format(d);
  }
  if (tickMarkType === 1) {
    return new Intl.DateTimeFormat("en-US", { month: "short", timeZone: tz }).format(d);
  }
  if (tickMarkType === 2) {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      timeZone: tz,
    }).format(d);
  }
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: hoursFormat === "12",
    timeZone: tz,
  }).format(d);
}

export function filterTimezones(query: string): TimezoneOption[] {
  const q = query.trim().toLowerCase();
  if (!q) return TIMEZONE_OPTIONS;
  return TIMEZONE_OPTIONS.filter((o) => {
    const offset = liveOffsetLabel(o.iana).toLowerCase();
    return (
      o.city.toLowerCase().includes(q) ||
      o.region.toLowerCase().includes(q) ||
      o.iana.toLowerCase().includes(q) ||
      offset.includes(q)
    );
  });
}

export function groupTimezones(options: TimezoneOption[]): { region: string; items: TimezoneOption[] }[] {
  const map = new Map<string, TimezoneOption[]>();
  for (const o of options) {
    const list = map.get(o.region) ?? [];
    list.push(o);
    map.set(o.region, list);
  }
  return [...map.entries()].map(([region, items]) => ({ region, items }));
}
