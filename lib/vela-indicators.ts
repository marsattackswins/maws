/**
 * vela-indicators.ts
 *
 * Bridges MAWS indicator instances to Vela's indicator system.
 *
 * MAWS studies ride Vela's native catalog via
 * `chart.addNativeIndicator(type, { inputs })` — core-computed, no scripting
 * engine, full Vela pipeline (legend, settings, panes, persistence). PMO and
 * Order Blocks are registered as natives directly from MAWS
 * (lib/vela-native-indicators.ts) and are added from the Indicators menu
 * without a store study; Volume is Vela's built-in.
 *
 * Every managed indicator carries a stable id (`maws-<studyId>`) so a studies
 * change adds only what is new and removes only what is gone.
 */
import type { Vela } from "@/lib/charting";
import type { IndicatorInstance, PaneNative } from "@/types";

/**
 * The bridge's per-chart bookkeeping, pinned to the page.
 *
 * `next dev` re-evaluates a module when it (or something it imports) changes, and a
 * rebuilt set of maps — all keyed by a chart instance that outlives the evaluation —
 * came back EMPTY while the live charts kept their mounted indicators. The next sync
 * then treated every managed handle as foreign and mounted a second copy beside it,
 * over and over: charts accumulated duplicate VWAPs and the duplicates were persisted
 * as if the user had added them. One object per page keeps ownership; in production
 * the module is evaluated once, so this is a no-op.
 */
const bridgeHost = globalThis as typeof globalThis & {
  __mawsIndicatorBridge?: {
    managed: WeakMap<Vela, Set<string>>;
    handleToStudy: WeakMap<Vela, Map<string, string>>;
    latestStudies: WeakMap<Vela, IndicatorInstance[]>;
    errorWatch: WeakMap<Vela, { off: () => void; attempts: Map<string, number> }>;
  };
};
// `development` only: a production build evaluates modules once, and tests reset the
// module registry on purpose (a fresh bridge per case).
const bridge =
  (process.env.NODE_ENV === "development" ? bridgeHost.__mawsIndicatorBridge : undefined) ??
  (bridgeHost.__mawsIndicatorBridge = {
    managed: new WeakMap<Vela, Set<string>>(),
    handleToStudy: new WeakMap<Vela, Map<string, string>>(),
    latestStudies: new WeakMap<Vela, IndicatorInstance[]>(),
    errorWatch: new WeakMap<Vela, { off: () => void; attempts: Map<string, number> }>(),
  });

/** Ids this bridge has mounted on a chart, keyed by chart instance. */
const managed = bridge.managed;

/** Reverse map: Vela handle id → MAWS study id, per chart. */
const handleToStudy = bridge.handleToStudy;

/** Latest studies handed to each chart — what the error watcher re-runs. */
const latestStudies = bridge.latestStudies;

/** One `indicator:error` watcher per chart, with a bounded per-id retry count. */
const errorWatch = bridge.errorWatch;

const MANAGED_PREFIX = "maws-";

export function managedIndicatorId(studyId: string): string {
  return `${MANAGED_PREFIX}${studyId}`;
}

// ---------------------------------------------------------------------------
// Vela native catalog mapping
// ---------------------------------------------------------------------------

/** MAWS study type → Vela native-indicator type (core-computed, no engine). */
const NATIVE_SPEC: Partial<Record<string, string>> = {
  ema: "moving-average",
  bb: "bollinger-bands",
  rsi: "rsi",
  stoch: "stochastic",
  atr: "average-true-range",
  adx: "average-directional-index",
  vwap: "vwap",
};

/** MAWS source → Vela source key (Vela: Close/Open/High/Low/HL2/HLC3/OHLC4/HLCC4). */
function velaSource(s: string): string {
  const map: Record<string, string> = {
    close: "Close", open: "Open", high: "High", low: "Low",
    hl2: "HL2", hlc3: "HLC3", ohlc4: "OHLC4",
  };
  return map[s] ?? "Close";
}

/** MAWS smoothing type → Vela moving-average type option. */
function velaMaType(s: string): string {
  const map: Record<string, string> = {
    sma: "SMA", ema: "EMA", wma: "WMA", "smma": "RMA (SMMA)", none: "SMA",
  };
  return map[s] ?? "SMA";
}

/** MAWS VWAP anchor → Vela anchor option. */
function velaVwapAnchor(s: string): string {
  const map: Record<string, string> = {
    session: "Session", week: "Week", month: "Month",
  };
  return map[s] ?? "Session";
}

/** MAWS line color → hex (MAWS colors may carry alpha; Vela inputs take plain colors). */
function colorOf(s: string | undefined, fallback: string): string {
  const c = (s ?? "").trim();
  return c.length > 0 ? c : fallback;
}

/**
 * Map a MAWS study's settings onto the Vela native spec's input keys
 * (verified against vela/src/core/native-indicators/classics/*).
 */
function nativeInputs(study: IndicatorInstance): Record<string, number | string | boolean> {
  const s = study.settings as Record<string, unknown>;
  const num = (k: string, d: number): number =>
    typeof s[k] === "number" && Number.isFinite(s[k]) ? (s[k] as number) : d;
  const str = (k: string, d: string): string =>
    typeof s[k] === "string" && s[k].length > 0 ? (s[k] as string) : d;
  const line = (colorKey: string, widthKey: string, dColor: string): Record<string, unknown> => ({
    color: colorOf(s[colorKey] as string | undefined, dColor),
    lineWidth: typeof s[widthKey] === "number" ? (s[widthKey] as number) : 2,
  });

  switch (study.type) {
    case "ema":
      return {
        maType: velaMaType(str("smoothingType", "ema")),
        length: num("period", 9),
        source: velaSource(str("source", "close")),
        offset: num("offset", 0),
        ...line("color", "lineWidth", "#2962ff"),
      };
    case "bb":
      return {
        length: num("period", 20),
        source: velaSource(str("source", "close")),
        mult: num("mult", 2),
        offset: num("offset", 0),
      };
    case "rsi":
      return {
        length: num("period", 14),
        source: "Close",
        ...line("color", "lineWidth", "#7e57c2"),
      };
    case "stoch":
      return {
        kLength: num("length", 14),
        kSmoothing: num("kSmoothing", 1),
        dLength: num("dSmoothing", 3),
      };
    case "atr":
      return {
        length: num("period", 14),
        ...line("color", "lineWidth", "#ff9800"),
      };
    case "adx":
      return {
        diLength: num("period", 14),
        adxLength: num("period", 14),
        ...line("color", "lineWidth", "#26a69a"),
        showMidline: s["showMidline"] !== false,
      };
    case "vwap":
      return {
        anchor: velaVwapAnchor(str("anchorPeriod", "session")),
        source: velaSource(str("source", "hlc3")),
      };
    default:
      return {};
  }
}

// ---------------------------------------------------------------------------
// Vela inputs → MAWS study settings (reverse mapping)
// ---------------------------------------------------------------------------

/** Inverse of `velaMaType`. */
const MA_BACK: Record<string, string> = {
  SMA: "sma",
  EMA: "ema",
  WMA: "wma",
  "RMA (SMMA)": "smma",
};

/**
 * Translate a managed handle's live Vela inputs back into MAWS study-setting
 * keys — the inverse of `nativeInputs`. Only keys MAWS owns are mapped;
 * Vela-side extras (colors MAWS doesn't model) stay with the handle.
 *
 * Used to persist edits made in Vela's in-chart indicator dialog: `pane.studies`
 * is what every chart remount (refresh, timeframe/symbol change) re-seeds from,
 * so a Vela-only edit would otherwise vanish on the next rebuild.
 */
export function velaInputsToStudySettings(
  type: string,
  inputs: Record<string, unknown>,
): Record<string, unknown> {
  const num = (k: string): number | undefined =>
    typeof inputs[k] === "number" && Number.isFinite(inputs[k])
      ? (inputs[k] as number)
      : undefined;
  const str = (k: string): string | undefined =>
    typeof inputs[k] === "string" && inputs[k] !== "" ? (inputs[k] as string) : undefined;
  const out: Record<string, unknown> = {};
  const put = (key: string, v: unknown): void => {
    if (v !== undefined) out[key] = v;
  };

  switch (type) {
    case "ema":
      put("period", num("length"));
      put("smoothingType", MA_BACK[str("maType") ?? ""]);
      put("source", str("source")?.toLowerCase());
      put("offset", num("offset"));
      put("color", str("color"));
      put("lineWidth", num("lineWidth"));
      break;
    case "bb":
      put("period", num("length"));
      put("source", str("source")?.toLowerCase());
      put("mult", num("mult"));
      put("offset", num("offset"));
      break;
    case "rsi":
      put("period", num("length"));
      put("color", str("color"));
      put("lineWidth", num("lineWidth"));
      break;
    case "stoch":
      put("length", num("kLength"));
      put("kSmoothing", num("kSmoothing"));
      put("dSmoothing", num("dLength"));
      break;
    case "atr":
      put("period", num("length"));
      put("color", str("color"));
      put("lineWidth", num("lineWidth"));
      break;
    case "adx":
      put("period", num("diLength") ?? num("adxLength"));
      put("color", str("color"));
      put("lineWidth", num("lineWidth"));
      put("showMidline", inputs["showMidline"] as boolean | undefined);
      break;
    case "vwap":
      put("anchorPeriod", str("anchor")?.toLowerCase());
      put("source", str("source")?.toLowerCase());
      break;
    default:
      break;
  }
  return out;
}

// ---------------------------------------------------------------------------
// History gate
// ---------------------------------------------------------------------------

/**
 * PineTS cannot execute against an EMPTY bar array (it throws
 * "Cannot read properties of undefined (reading 'openTime')" and the live
 * session dies without recovering), so adding an indicator must wait until the
 * chart has painted its first history. `getVisibleRange()` is the public
 * "bars are painted" signal. Otherwise wait for `load:end` — noting that Vela
 * fires it even when a load ended with ZERO bars, so the bar count must be
 * checked and a bar-less load must not resolve the gate.
 */
function waitForBars(chart: Vela, timeoutMs = 20_000): Promise<void> {
  if (chart.getVisibleRange() != null) return Promise.resolve();
  return new Promise((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      // getVisibleRange() is non-null only once real bars are painted; a
      // bar-less load:end must not release the gate.
      if (chart.getVisibleRange() == null) return;
      done = true;
      off();
      clearTimeout(timer);
      resolve();
    };
    const off = chart.on("load:end", finish);
    const timer = setTimeout(finish, timeoutMs);
  });
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Recover from a dead indicator session.
 *
 * A streaming engine can still lose its session at runtime (its live updater
 * crashes and the handle never recovers on its own), which surfaces as
 * `indicator:error` with no model ever following. The bridge's job is to keep
 * the chart usable: drop the dead handle and re-mount the script once the
 * chart has bars again. Bounded per id so a genuinely broken script cannot
 * loop forever.
 */
function watchIndicatorErrors(chart: Vela): void {
  if (errorWatch.has(chart)) return;
  const attempts = new Map<string, number>();
  const off = chart.on("indicator:error", ({ id }) => {
    if (!id.startsWith(MANAGED_PREFIX)) return;
    const tries = attempts.get(id) ?? 0;
    if (tries >= 3) return;
    attempts.set(id, tries + 1);
    const studies = latestStudies.get(chart);
    if (!studies) return;
    idsOf(chart).delete(id);
    try {
      chart.indicators().find((h) => h.id === id)?.remove();
    } catch {
      /* already gone */
    }
    setTimeout(() => {
      void syncVelaIndicators(chart, studies);
    }, 250);
  });
  errorWatch.set(chart, { off, attempts });
}

function idsOf(chart: Vela): Set<string> {
  let set = managed.get(chart);
  if (!set) {
    set = new Set<string>();
    managed.set(chart, set);
  }
  return set;
}

function reverseOf(chart: Vela): Map<string, string> {
  let map = handleToStudy.get(chart);
  if (!map) {
    map = new Map<string, string>();
    handleToStudy.set(chart, map);
  }
  return map;
}

/** Whether `id` is a handle the MAWS bridge mounted (a persisted store study). */
export function isManagedHandle(chart: Vela, id: string): boolean {
  return idsOf(chart).has(id);
}

/** Whether `id` looks like a managed handle by its prefix, even after it has
 *  been removed from the live set (useful in indicator:removed handlers). */
export function isManagedId(id: string): boolean {
  return id.startsWith(MANAGED_PREFIX);
}

/** Extract the store study id from a managed handle id (`maws-<studyId>`). */
export function studyIdFromManagedId(id: string): string {
  return id.slice(MANAGED_PREFIX.length);
}

/** Look up the MAWS study id for a Vela handle id (reverse map).
 *  Returns null when the handle was not mounted by this bridge. */
export function studyIdForHandle(chart: Vela, handleId: string): string | null {
  return reverseOf(chart).get(handleId) ?? null;
}

/**
 * Take over a native this session did not mount.
 *
 * A cell restores its persisted indicator ledger BEFORE this bridge runs, so last
 * session's managed handle is already on the chart under an id nobody tracked. Adding
 * "the" handle for the study would stack a second identical series on every reload —
 * adopt the restored one (pushing the store's inputs onto it) instead.
 */
function adoptRestored(
  chart: Vela,
  nativeType: string,
  current: Set<string>,
  study: IndicatorInstance,
): boolean {
  const reverse = reverseOf(chart);
  const orphan = chart
    .indicators()
    .find((h) => h.nativeType === nativeType && !current.has(h.id) && !reverse.has(h.id));
  if (!orphan) return false;
  current.add(orphan.id);
  reverse.set(orphan.id, study.id);
  try {
    const wanted = nativeInputs(study);
    const live = orphan.inputValues() as Record<string, unknown>;
    if (Object.entries(wanted).some(([k, v]) => live[k] !== v)) orphan.setInputs(wanted);
  } catch {
    /* handle without the inputs seam — it still carries the study's last settings */
  }
  return true;
}

/**
 * Collapse the duplicate natives older sessions left behind.
 *
 * Charts that hit the reload-duplication bug carry the same study native many times
 * over, as untracked handles (each is a full-series recompute per frame). A stray
 * that is an EXACT copy of the handle this bridge owns for that type is removed;
 * a second copy with different settings is the user's and stays.
 */
function pruneStrayDuplicates(chart: Vela): void {
  const reverse = reverseOf(chart);
  // A copy: removal splices the live array, and iterating that would skip entries.
  const handles = [...chart.indicators()];
  const owned = new Map<string, (typeof handles)[number]>();
  for (const h of handles) {
    if (h.nativeType !== undefined && reverse.has(h.id)) owned.set(h.nativeType, h);
  }
  for (const h of handles) {
    const twin = h.nativeType !== undefined ? owned.get(h.nativeType) : undefined;
    if (!twin || twin.id === h.id) continue;
    try {
      if (JSON.stringify(h.inputValues()) !== JSON.stringify(twin.inputValues())) continue;
      h.remove();
    } catch {
      /* already gone */
    }
  }
}

/**
 * Reconcile the chart's MAWS studies with what is mounted:
 * add new scripts, remove scripts whose study disappeared.
 */
export async function syncVelaIndicators(
  chart: Vela,
  studies: IndicatorInstance[],
): Promise<void> {
  latestStudies.set(chart, studies);
  watchIndicatorErrors(chart);

  // Never mount scripts onto a bar-less chart (PineTS cannot run empty series).
  await waitForBars(chart);

  const desired = new Map<string, IndicatorInstance>();
  for (const study of studies) {
    if (study.hidden) continue;
    if (!NATIVE_SPEC[study.type]) continue;
    desired.set(managedIndicatorId(study.id), study);
  }

  const current = idsOf(chart);

  // Remove studies that are gone (or now hidden).
  for (const id of [...current]) {
    if (desired.has(id)) continue;
    current.delete(id);
    reverseOf(chart).delete(id);
    try {
      chart.indicators().find((h) => h.id === id)?.remove();
    } catch {
      /* already torn down */
    }
  }

  // Add newly enabled studies as Vela natives (no scripting engine).
  let failed = false;
  for (const [id, study] of desired) {
    if (current.has(id)) {
      // Already mounted: push changed inputs so an edit made on either surface
      // (MAWS settings modal → store, or Vela's in-chart dialog → write-back)
      // reaches the live handle without a remove/re-add cycle. Compare only
      // the keys MAWS owns so Vela-side extras don't oscillate.
      try {
        const handle = chart.indicators().find((h) => h.id === id);
        const wanted = nativeInputs(study);
        const live = handle?.inputValues() as Record<string, unknown> | undefined;
        if (handle && Object.entries(wanted).some(([k, v]) => live?.[k] !== v)) {
          handle.setInputs(wanted);
        }
      } catch {
        /* handle without the inputs seam — the next remount applies the store state */
      }
      continue;
    }
    const nativeType = NATIVE_SPEC[study.type]!;
    // Restored ledger handle for this study? Adopt it rather than duplicating it.
    if (adoptRestored(chart, nativeType, current, study)) continue;
    current.add(id);
    try {
      // addNativeIndicator mints its own registry id; track the returned
      // handle's id so removal below finds the right instance.
      const handle = chart.addNativeIndicator(nativeType, {
        inputs: nativeInputs(study),
      });
      const actualId = handle?.id ?? id;
      if (actualId !== id) {
        current.delete(id);
        current.add(actualId);
      }
      // Map Vela's actual handle id back to the MAWS study id for reverse lookup.
      reverseOf(chart).set(actualId, study.id);
    } catch (err) {
      current.delete(id);
      failed = true;
      console.warn("[vela-indicators] failed to add native", study.type, err);
    }
  }

  // Heal duplicates carried in from earlier sessions (see `pruneStrayDuplicates`).
  pruneStrayDuplicates(chart);

  // A transient failure (e.g. this sync raced the history load) retries once
  // on the next load completion — a broken script without a reload does not
  // fire `load:end` again, so this is bounded.
  if (failed) {
    const offRetry = chart.on("load:end", () => {
      offRetry();
      void syncVelaIndicators(chart, studies);
    });
  }
}

/** Replace user-managed native indicators on a live chart with the pane's saved set. */
export function syncPaneNativeIndicators(chart: Vela, natives: PaneNative[]): void {
  const existing = chart.indicators().filter(
    (handle) =>
      handle.nativeType != null &&
      handle.nativeType !== "volume" &&
      !isManagedHandle(chart, handle.id),
  );
  const current = existing.map((handle) => ({
    type: handle.nativeType!,
    inputs: handle.inputValues(),
    hidden: !handle.visible,
  }));
  if (JSON.stringify(current) === JSON.stringify(natives)) return;

  for (const handle of existing) {
    try {
      handle.remove();
    } catch (error) {
      console.error(`[vela-indicators] Could not remove native indicator "${handle.nativeType}".`, error);
    }
  }

  for (const native of natives) {
    try {
      const handle = chart.addNativeIndicator(native.type, { inputs: native.inputs });
      if (handle.nativeType !== native.type) {
        console.error(`[vela-indicators] Could not add native indicator "${native.type}".`);
        continue;
      }
      handle.setVisible(!native.hidden);
    } catch (error) {
      console.error(`[vela-indicators] Could not add native indicator "${native.type}".`, error);
    }
  }
}

/** Remove every indicator this bridge mounted (chart teardown). */
export function removeManagedIndicators(chart: Vela): void {
  const watch = errorWatch.get(chart);
  if (watch) {
    watch.off();
    errorWatch.delete(chart);
  }
  latestStudies.delete(chart);
  handleToStudy.delete(chart);
  const current = idsOf(chart);
  for (const id of current) {
    try {
      chart.indicators().find((h) => h.id === id)?.remove();
    } catch {
      /* ignore */
    }
  }
  current.clear();
}
