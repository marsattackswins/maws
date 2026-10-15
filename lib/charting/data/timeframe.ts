/** Named non-minute resolutions → ms. `M` is treated as a 30-day month (bucketing only). */
const NAMED_TF_MS: Record<string, number> = {
    D: 86_400_000,
    d: 86_400_000,
    W: 604_800_000,
    w: 604_800_000,
    M: 2_592_000_000,
    '1D': 86_400_000,
    '1d': 86_400_000,
    '1W': 604_800_000,
    '1w': 604_800_000,
    '1M': 2_592_000_000,
    '1mo': 2_592_000_000,
    '1MO': 2_592_000_000,
    '1m': 60_000,
};

/**
 * Bar duration in ms for a Vela timeframe: a bare number is **minutes** (Pine
 * resolution — `60` = 1h, `240` = 4h), `D`/`W`/`M` are the named periods, and the
 * `15m`/`4h`/`1d`/`1w`/`1M` aliases are also accepted. Falls back to 1h for anything unparsed.
 */
export function timeframeToMs(timeframe: string): number {
    const tf = timeframe.trim();
    if (NAMED_TF_MS[tf]) return NAMED_TF_MS[tf];

    // Match count + unit without global case-folding: 'M' or 'mo' is month, 'm' is minutes.
    const m = /^(\d+)\s*(mo|MO|Mo|m|M|h|H|d|D|w|W|s|S)?$/.exec(tf);
    if (m) {
        const n = parseInt(m[1]!, 10);
        const rawUnit = m[2];
        if (!rawUnit) return n * 60_000; // bare number ⇒ minutes
        if (rawUnit === 'mo' || rawUnit === 'MO' || rawUnit === 'Mo' || rawUnit === 'M') {
            return n * 2_592_000_000;
        }
        if (rawUnit === 's' || rawUnit === 'S') {
            return n * 1_000;
        }
        const unit = rawUnit.toLowerCase();
        const mult = unit === 'm' ? 60_000 : unit === 'h' ? 3_600_000 : unit === 'd' ? 86_400_000 : 604_800_000;
        return n * mult;
    }
    return 3_600_000;
}
