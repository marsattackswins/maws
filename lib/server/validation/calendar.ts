import "server-only";

/**
 * Validates a YYYY-MM-DD date string as a strict Gregorian calendar date.
 * Returns the UTC day number if valid, null otherwise.
 * Does not use the local timezone.
 */
export function parseCalendarDate(raw: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return null;

  const parts = raw.split("-");
  const y = Number(parts[0]);
  const m = Number(parts[1]);
  const d = Number(parts[2]);

  // JS Date.UTC accepts out-of-bounds values by overflowing them (e.g. Feb 30 -> Mar 1 or 2).
  // We can detect this by seeing if the resulting UTC date components match the input.
  const timestamp = Date.UTC(y, m - 1, d);
  const date = new Date(timestamp);

  if (
    date.getUTCFullYear() !== y ||
    date.getUTCMonth() !== m - 1 ||
    date.getUTCDate() !== d
  ) {
    return null;
  }

  return Math.floor(timestamp / 86400000);
}

/**
 * Validates a requested from/to calendar range against a fixed policy:
 * - Both must be valid YYYY-MM-DD Gregorian dates.
 * - from <= to.
 * - Maximum span of 90 calendar days inclusive.
 * - Must fall within [UTC today - 2, UTC today + 367].
 * 
 * Returns true if valid, false if invalid.
 */
export function validateCalendarRange(
  fromRaw: string | null,
  toRaw: string | null,
  nowMs: number,
): boolean {
  if (!fromRaw || !toRaw) return false;

  const fromDay = parseCalendarDate(fromRaw);
  const toDay = parseCalendarDate(toRaw);

  if (fromDay === null || toDay === null) return false;

  if (fromDay > toDay) return false;

  const spanDays = toDay - fromDay + 1;
  if (spanDays > 90) return false;

  const todayDay = Math.floor(nowMs / 86400000);
  const minDay = todayDay - 2;
  const maxDay = todayDay + 367;

  if (fromDay < minDay || toDay > maxDay) return false;

  return true;
}
