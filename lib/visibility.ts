import type { ObjectVisibility, Timeframe, VisibilityBand } from "@/types";
import { DEFAULT_OBJECT_VISIBILITY } from "@/types";
import { timeframeSeconds } from "@/lib/timeframes";

export function cloneVisibility(
  value?: Partial<ObjectVisibility> | null,
): ObjectVisibility {
  const base = DEFAULT_OBJECT_VISIBILITY;
  return {
    ticks: value?.ticks ?? base.ticks,
    ranges: value?.ranges ?? base.ranges,
    seconds: { ...base.seconds, ...value?.seconds },
    minutes: { ...base.minutes, ...value?.minutes },
    hours: { ...base.hours, ...value?.hours },
    days: { ...base.days, ...value?.days },
    weeks: { ...base.weeks, ...value?.weeks },
    months: { ...base.months, ...value?.months },
  };
}

type Family = "ticks" | "seconds" | "minutes" | "hours" | "days" | "weeks" | "months" | "ranges";

function familyForTimeframe(tf: Timeframe): { family: Family; units: number } {
  const sec = timeframeSeconds(tf);
  if (sec < 1) return { family: "ticks", units: 1 };
  if (sec < 60) return { family: "seconds", units: sec };
  if (sec < 3600) return { family: "minutes", units: sec / 60 };
  if (sec < 86400) return { family: "hours", units: sec / 3600 };
  if (sec < 604800) return { family: "days", units: sec / 86400 };
  if (sec < 2592000) return { family: "weeks", units: sec / 604800 };
  return { family: "months", units: sec / 2592000 };
}

function bandAllows(band: VisibilityBand, units: number) {
  if (!band.enabled) return false;
  return units >= band.min && units <= band.max;
}

/** Whether an object should render on the active chart timeframe. */
export function isVisibleOnTimeframe(
  visibility: ObjectVisibility | undefined,
  timeframe: Timeframe,
): boolean {
  const vis = cloneVisibility(visibility);
  const { family, units } = familyForTimeframe(timeframe);
  if (family === "ticks") return vis.ticks;
  if (family === "ranges") return vis.ranges;
  if (family === "seconds") return bandAllows(vis.seconds, units);
  if (family === "minutes") return bandAllows(vis.minutes, units);
  if (family === "hours") return bandAllows(vis.hours, units);
  if (family === "days") return bandAllows(vis.days, units);
  if (family === "weeks") return bandAllows(vis.weeks, units);
  return bandAllows(vis.months, units);
}
