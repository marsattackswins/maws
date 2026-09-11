/** Editable keyboard shortcuts for MAWS. */

export type ShortcutId =
  | "openSearch"
  | "fitChart"
  | "addAlert"
  | "buyLimit"
  | "buyLimitAtCross"
  | "sellStopAtCross"
  | "drawHorizontalRay"
  | "pastePriceRay"
  | "openChartSettings"
  | "cursorTool"
  | "toggleMagnet";

export type ShortcutChord = {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
};

export type ShortcutMap = Record<ShortcutId, ShortcutChord | null>;

export const SHORTCUT_DEFS: {
  id: ShortcutId;
  label: string;
  group: string;
}[] = [
  { id: "openSearch", label: "Symbol search", group: "Navigation" },
  { id: "fitChart", label: "Fit chart / reset scale", group: "Chart" },
  { id: "openChartSettings", label: "Chart settings", group: "Chart" },
  { id: "cursorTool", label: "Select cursor tool", group: "Drawings" },
  { id: "toggleMagnet", label: "Toggle magnet", group: "Drawings" },
  { id: "drawHorizontalRay", label: "Draw horizontal ray at crosshair", group: "Drawings" },
  { id: "pastePriceRay", label: "Paste price as horizontal ray", group: "Drawings" },
  { id: "addAlert", label: "Add alert at crosshair", group: "Trading" },
  { id: "buyLimit", label: "Buy limit at crosshair", group: "Trading" },
  { id: "buyLimitAtCross", label: "Buy limit (Alt)", group: "Trading" },
  { id: "sellStopAtCross", label: "Sell stop at crosshair", group: "Trading" },
];

export const DEFAULT_SHORTCUTS: ShortcutMap = {
  openSearch: { key: "/", ctrl: false, alt: false, shift: false },
  fitChart: { key: "r", ctrl: false, alt: true, shift: false },
  addAlert: { key: "a", ctrl: false, alt: true, shift: false },
  buyLimit: { key: "t", ctrl: false, alt: false, shift: true },
  buyLimitAtCross: { key: "b", ctrl: false, alt: true, shift: true },
  sellStopAtCross: { key: "s", ctrl: false, alt: true, shift: true },
  drawHorizontalRay: { key: "h", ctrl: false, alt: true, shift: false },
  pastePriceRay: { key: "v", ctrl: true, alt: false, shift: false },
  openChartSettings: { key: ",", ctrl: true, alt: false, shift: false },
  cursorTool: { key: "escape", ctrl: false, alt: false, shift: false },
  toggleMagnet: { key: "m", ctrl: false, alt: true, shift: false },
};

const MOD_KEYS = new Set(["Control", "Shift", "Alt", "Meta"]);

export function normalizeKey(key: string): string {
  if (key === " ") return "space";
  if (key.length === 1) return key.toLowerCase();
  return key.toLowerCase();
}

export function chordFromEvent(e: KeyboardEvent): ShortcutChord | null {
  if (MOD_KEYS.has(e.key)) return null;
  return {
    key: normalizeKey(e.key),
    ctrl: e.ctrlKey || e.metaKey,
    alt: e.altKey,
    shift: e.shiftKey,
    meta: false,
  };
}

export function chordsEqual(a: ShortcutChord | null, b: ShortcutChord | null): boolean {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return (
    a.key === b.key &&
    Boolean(a.ctrl) === Boolean(b.ctrl) &&
    Boolean(a.alt) === Boolean(b.alt) &&
    Boolean(a.shift) === Boolean(b.shift)
  );
}

export function eventMatchesShortcut(e: KeyboardEvent, chord: ShortcutChord | null): boolean {
  if (!chord) return false;
  const key = normalizeKey(e.key);
  // Allow openSearch default "/" also via Ctrl/Cmd+K legacy
  if (
    chord.key === "/" &&
    !chord.ctrl &&
    !chord.alt &&
    !chord.shift &&
    e.ctrlKey &&
    !e.altKey &&
    key === "k"
  ) {
    return true;
  }
  const wantCtrl = Boolean(chord.ctrl);
  const haveCtrl = e.ctrlKey || e.metaKey;
  return (
    key === chord.key &&
    haveCtrl === wantCtrl &&
    e.altKey === Boolean(chord.alt) &&
    e.shiftKey === Boolean(chord.shift)
  );
}

export function formatShortcut(chord: ShortcutChord | null): string {
  if (!chord) return "None";
  const parts: string[] = [];
  if (chord.ctrl) parts.push("Ctrl");
  if (chord.alt) parts.push("Alt");
  if (chord.shift) parts.push("Shift");
  const keyLabel =
    chord.key === "escape"
      ? "Esc"
      : chord.key === " "
        ? "Space"
        : chord.key === "/"
          ? "/"
          : chord.key.length === 1
            ? chord.key.toUpperCase()
            : chord.key.charAt(0).toUpperCase() + chord.key.slice(1);
  parts.push(keyLabel);
  return parts.join(" + ");
}

export function mergeShortcuts(partial?: Partial<ShortcutMap> | null): ShortcutMap {
  const next = { ...DEFAULT_SHORTCUTS };
  if (!partial) return next;
  for (const id of Object.keys(DEFAULT_SHORTCUTS) as ShortcutId[]) {
    if (id in partial) next[id] = partial[id] ?? null;
  }
  return next;
}

/** Find which action owns a chord (for conflict detection). */
export function findShortcutConflict(
  map: ShortcutMap,
  chord: ShortcutChord,
  except?: ShortcutId,
): ShortcutId | null {
  for (const id of Object.keys(map) as ShortcutId[]) {
    if (id === except) continue;
    if (chordsEqual(map[id], chord)) return id;
  }
  return null;
}
