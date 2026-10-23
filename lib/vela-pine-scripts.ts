/**
 * vela-pine-scripts.ts — the MAWS side of Vela's Pine scripting engine.
 *
 * Three jobs, all sitting on Vela's PUBLIC seams (nothing here reaches into the
 * vendored charting source):
 *
 *  1. SCRIPT LIBRARY — the user's saved Pine sources, kept in localStorage under
 *     their own key so the workspace store's frozen persisted schema is untouched.
 *  2. CELL PERSISTENCE — Vela deliberately keeps script indicators out of the
 *     cell's indicator ledger (their names never resolve against a manifest), so
 *     without this a script vanished on refresh. `ensurePineStatePersistence`
 *     registers the documented `ext` handler: it serializes every live script
 *     indicator of a cell and re-adds them from the document on restore.
 *  3. HANDLE HELPERS — the shape the editor panel talks to.
 */
import {
  inputDeltas,
  registerStatePersistence,
  type ExternalIndicatorEntry,
  type IndicatorHandle,
  type InputValue,
  type Vela,
} from "@/lib/charting";

/** localStorage key of the saved-script library (user content, not workspace state). */
export const PINE_LIBRARY_KEY = "maws.pine.library.v1";

/** Which library script the editor had open — so the panel reopens where it was. */
const PINE_OPEN_KEY = "maws.pine.open.v1";

/** The UNSAVED document (a new "My script" is not in the library until saved). */
const PINE_DRAFT_KEY = "maws.pine.draft.v1";

/** The cell-scope `ext` entry scripts persist under inside `panes[].velaState`. */
export const PINE_STATE_KEY = "maws.pine.indicators";

/** Guard on untrusted document input — a Pine source longer than this is not a script. */
const MAX_SOURCE_CHARS = 200_000;

/** A saved script in the editor's library. */
export type PineScript = {
  id: string;
  name: string;
  script: string;
  updatedAt: number;
};

/** One live script indicator read off a chart (what the panel's "on chart" list shows). */
export type LivePineScript = {
  id: string;
  title: string;
  source: string;
  visible: boolean;
};

/** Serialized shape of one script inside the cell's `ext` bag. */
export type PersistedPineScript = {
  id: string;
  name: string;
  script: string;
  inputs?: Record<string, InputValue>;
  props?: Record<string, InputValue>;
  hidden?: boolean;
};

/** The document a brand-new editor session opens on (Vela's own starter template). */
const DEFAULT_SOURCE = `// This Pine Script® code is subject to the terms of the Mozilla Public License 2.0 at https://mozilla.org/MPL/2.0/
//@version=5
indicator("My script", overlay = true)`;

/** `crypto.randomUUID` where available, a monotonic fallback otherwise (SSR-safe). */
export function pineScriptId(prefix = "script"): string {
  const uuid =
    typeof globalThis.crypto?.randomUUID === "function"
      ? globalThis.crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  return `${prefix}-${uuid}`;
}

/** The chart-side id a library script mounts under — stable across reloads, so the
 *  persistence handler restores the indicator under the id its document knows. */
export function chartIdForScript(scriptId: string): string {
  return `pine:${scriptId}`;
}

// ── library storage ────────────────────────────────────────────────────────────────

function storage(): Storage | null {
  try {
    if (typeof window === "undefined" || !window.localStorage) return null;
    return window.localStorage;
  } catch {
    return null; // privacy mode / blocked storage — the library runs in memory
  }
}

/** Sanitize one stored library entry (localStorage is untrusted input). */
function sanitizeScript(raw: unknown): PineScript | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.id !== "string" || !r.id) return null;
  if (typeof r.script !== "string") return null;
  if (typeof r.name !== "string" || !r.name.trim()) return null;
  if (r.script.length > MAX_SOURCE_CHARS) return null;
  return {
    id: r.id,
    name: r.name,
    script: r.script,
    updatedAt: typeof r.updatedAt === "number" ? r.updatedAt : Date.now(),
  };
}

/** Load the saved script library — empty on a fresh browser, like the editor's list. */
export function loadPineScripts(): PineScript[] {
  const store = storage();
  if (!store) return [];
  try {
    const raw = store.getItem(PINE_LIBRARY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.map(sanitizeScript).filter((s): s is PineScript => s !== null);
  } catch {
    return [];
  }
}

/** Persist the whole library (silently a no-op when storage is unavailable). */
export function savePineScripts(scripts: PineScript[]): void {
  const store = storage();
  if (!store) return;
  try {
    store.setItem(PINE_LIBRARY_KEY, JSON.stringify(scripts));
  } catch {
    /* quota / blocked — the editor keeps working for this session */
  }
}

/** The script the editor last had open (null when none was ever picked). */
export function loadOpenPineScriptId(): string | null {
  const store = storage();
  if (!store) return null;
  try {
    return store.getItem(PINE_OPEN_KEY) || null;
  } catch {
    return null;
  }
}

/** Remember which script is open (best effort — storage may be blocked). */
export function saveOpenPineScriptId(id: string): void {
  const store = storage();
  if (!store) return;
  try {
    store.setItem(PINE_OPEN_KEY, id);
  } catch {
    /* quota / blocked */
  }
}

/** The unsaved editor document (survives a refresh until it is saved/deleted). */
export type PineDraft = { id: string; name: string; script: string };

/** Load the unsaved document, if this browser has one. */
export function loadPineDraft(): PineDraft | null {
  const store = storage();
  if (!store) return null;
  try {
    const raw = store.getItem(PINE_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const r = parsed as Record<string, unknown>;
    if (typeof r.id !== "string" || !r.id) return null;
    if (typeof r.script !== "string" || r.script.length > MAX_SOURCE_CHARS) return null;
    if (typeof r.name !== "string" || !r.name.trim()) return null;
    return { id: r.id, name: r.name, script: r.script };
  } catch {
    return null;
  }
}

/** Persist the unsaved document (null clears it once the script is saved). */
export function savePineDraft(draft: PineDraft | null): void {
  const store = storage();
  if (!store) return;
  try {
    if (draft) store.setItem(PINE_DRAFT_KEY, JSON.stringify(draft));
    else store.removeItem(PINE_DRAFT_KEY);
  } catch {
    /* quota / blocked */
  }
}

/** The blank document behind "New script" (and an empty editor on first run). */
export function blankPineScript(name = "My script"): PineScript {
  return {
    id: pineScriptId("draft"),
    name,
    script: DEFAULT_SOURCE.replace('"My script"', `"${name.replace(/"/g, "'")}"`),
    updatedAt: Date.now(),
  };
}

// ── live indicators on a chart ─────────────────────────────────────────────────────

/**
 * The title a script declares for itself (`indicator("EMA 20", …)` /
 * `strategy("SMA Cross", …)`). The chart handle carries a generic fallback title
 * ("Indicator") until a model lands, so a persisted name falls back to the source.
 */
export function declaredScriptTitle(source: string): string | null {
  const match = /(?:indicator|strategy)\s*\(\s*(?:"([^"]*)"|'([^']*)')/.exec(source);
  const title = match?.[1] ?? match?.[2];
  return title && title.trim() ? title.trim() : null;
}

/** The name to persist/display for a live script: a real handle title, else the
 *  declaration's own title, else a neutral fallback. */
export function scriptDisplayName(title: string, source: string): string {
  const trimmed = title.trim();
  if (trimmed && trimmed !== "Indicator") return trimmed;
  return declaredScriptTitle(source) ?? "Script";
}

/** Every SCRIPT indicator on the chart (native ones have no `source`). */
export function scriptIndicators(chart: Vela): IndicatorHandle[] {
  return chart.indicators().filter((h) => h.source !== undefined);
}

/** The panel's "on chart" rows for one chart (declaration titles, not "Indicator"). */
export function livePineScripts(chart: Vela): LivePineScript[] {
  return scriptIndicators(chart)
    .filter((h) => h.source !== undefined)
    .map((h) => {
      const source = h.source as string;
      return {
        id: h.id,
        title: scriptDisplayName(h.title, source),
        source,
        visible: h.visible,
      };
    });
}

// ── last-known-good sources ────────────────────────────────────────────────────────

/**
 * Per-chart map of the source each script last RAN with.
 *
 * A failed `updateCode` leaves the previous computation running but the handle's
 * `source` already points at the broken edit — persisting that would restore a
 * script that cannot execute on the next reload. Recording the source whenever a
 * run actually happens (`script:run`) keeps the document on the code that works.
 */
const sourceState = new WeakMap<Vela, { good: Map<string, string>; bad: Set<string> }>();

/** Track successful sources on one chart — call ONCE per chart, before a restore. */
export function watchPineSources(chart: Vela): () => void {
  const state = sourceState.get(chart) ?? { good: new Map<string, string>(), bad: new Set<string>() };
  sourceState.set(chart, state);
  const record = (id: string) => {
    const handle = chart.indicators().find((h) => h.id === id);
    if (!handle?.source) return;
    state.good.set(id, handle.source);
    state.bad.delete(id);
  };
  const offs = [
    chart.on("indicator:added", ({ id }) => record(id)),
    chart.on("script:run", ({ id }) => record(id)),
    chart.on("indicator:error", ({ id }) => state.bad.add(id)),
    chart.on("indicator:removed", ({ id }) => {
      state.good.delete(id);
      state.bad.delete(id);
    }),
  ];
  return () => {
    for (const off of offs) off();
    sourceState.delete(chart);
  };
}

// ── cell persistence (the `ext` seam) ──────────────────────────────────────────────

/** Validate one persisted script (the `ext` payload is untrusted). */
function sanitizePersisted(raw: unknown): PersistedPineScript | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.id !== "string" || !r.id) return null;
  if (typeof r.script !== "string" || !r.script || r.script.length > MAX_SOURCE_CHARS) return null;
  if (typeof r.name !== "string" || !r.name.trim()) return null;
  const bag = (v: unknown): Record<string, InputValue> | undefined =>
    v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, InputValue>) : undefined;
  return {
    id: r.id,
    name: r.name,
    script: r.script,
    ...(bag(r.inputs) ? { inputs: bag(r.inputs) } : {}),
    ...(bag(r.props) ? { props: bag(r.props) } : {}),
    ...(r.hidden === true ? { hidden: true } : {}),
  };
}

/** Validate a whole `ext` payload into the scripts it carries (exported for tests). */
export function sanitizePinePayload(payload: unknown): PersistedPineScript[] {
  if (!payload || typeof payload !== "object") return [];
  const scripts = (payload as { scripts?: unknown }).scripts;
  if (!Array.isArray(scripts)) return [];
  return scripts
    .map(sanitizePersisted)
    .filter((s): s is PersistedPineScript => s !== null);
}

/**
 * Serialize one cell's script indicators: source, name, user-edited inputs (deltas
 * from the declaration defaults, never the defaults themselves), prop overrides and
 * the hidden flag. `undefined` withdraws the entry when the cell has no scripts.
 */
export function serializePineScripts(chart: Vela): { scripts: PersistedPineScript[] } | undefined {
  const scripts: PersistedPineScript[] = [];
  const state = sourceState.get(chart);
  for (const handle of scriptIndicators(chart)) {
    // Never persist a source that has not run: see `watchPineSources`.
    const source = state?.good.get(handle.id) ?? (state?.bad.has(handle.id) ? undefined : handle.source);
    if (!source) continue;
    const inputs = inputDeltas(handle.inputs, handle.inputValues());
    const props = handle.propValues();
    scripts.push({
      id: handle.id,
      name: scriptDisplayName(handle.title, source),
      script: source,
      ...(inputs ? { inputs } : {}),
      ...(Object.keys(props).length > 0 ? { props } : {}),
      ...(handle.visible ? {} : { hidden: true }),
    });
  }
  return scripts.length > 0 ? { scripts } : undefined;
}

/** Turn one persisted script into the shell's add entry. */
export function toExternalEntry(script: PersistedPineScript): ExternalIndicatorEntry {
  return {
    name: script.name,
    script: script.script,
    id: script.id,
    language: "pine",
    ...(script.inputs ? { inputs: script.inputs } : {}),
    ...(script.props ? { props: script.props } : {}),
    ...(script.hidden ? { hidden: true } : {}),
  };
}

let registered = false;

/**
 * Register the cell-scope persistence handler ONCE (app lifetime). Call before the
 * workspace is constructed: cells restore their `ext` bag as they are built.
 * `restore` runs inside the cell's history mute, so a restored script never lands
 * in the undo timeline (Vela guarantees that for `CellStateContext.addIndicator`).
 */
export function ensurePineStatePersistence(): void {
  if (registered) return;
  registered = true;
  registerStatePersistence({
    key: PINE_STATE_KEY,
    scope: "cell",
    serialize: ({ chart }) => serializePineScripts(chart),
    restore: (payload, ctx) => {
      for (const script of sanitizePinePayload(payload)) {
        ctx.addIndicator(toExternalEntry(script));
      }
    },
  });
}
