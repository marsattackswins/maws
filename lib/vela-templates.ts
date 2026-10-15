/**
 * vela-templates.ts — Vela's OWN template core for MAWS.
 *
 * A chart template is a FULL Vela `ChartConfig` document snapshot — exactly what
 * the settings dialog's export/import produces (`renderer.getConfig()`), applied
 * back with `renderer.applyConfig()` (the same path the dialog commits through).
 * This replaces the old MAWS mapping layer (`mawsToVelaConfig`): the document is
 * authoritative and never lossy round-trips through a hand-written reducer.
 *
 * Theme is NOT part of the document by design (Vela excludes the Canvas → Theme
 * row from config persistence), so a template applied to a different theme keeps
 * the app theme and only re-skins plot cosmetics.
 *
 * Storage rides localStorage (`maws.vela-templates`), not the zustand store —
 * templates are renderer documents, not app state.
 */

import { getChart } from "@/lib/chart-registry";
import { useAppStore } from "@/lib/store";

export type VelaChartTemplate = {
  id: string;
  name: string;
  /** The renderer config document (`renderer.getConfig()`). */
  config: Record<string, unknown>;
  createdAt: number;
};

const STORAGE_KEY = "maws.vela-templates";

/** In-module cache so the UI re-renders when templates change (tiny pub-sub). */
let templates: VelaChartTemplate[] = load();
const listeners = new Set<(t: VelaChartTemplate[]) => void>();

function load(): VelaChartTemplate[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : null;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (t): t is VelaChartTemplate =>
        t != null &&
        typeof t === "object" &&
        typeof (t as VelaChartTemplate).id === "string" &&
        typeof (t as VelaChartTemplate).name === "string" &&
        (t as VelaChartTemplate).config != null,
    );
  } catch {
    return [];
  }
}

function persist(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
  } catch {
    /* quota — keep in memory */
  }
}

function emit(): void {
  for (const l of listeners) l(templates);
}

export function subscribeTemplates(fn: (t: VelaChartTemplate[]) => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getTemplates(): readonly VelaChartTemplate[] {
  return templates;
}

/** Snapshot the ACTIVE pane's live renderer config as a named template. */
export function saveTemplate(name: string): void {
  const trimmed = name.trim();
  if (!trimmed) return;
  const state = useAppStore.getState();
  const handle = getChart(state.activePaneId ?? state.panes[0]?.id ?? "");
  const config = handle?.vela?.renderer?.getConfig?.();
  if (config == null) return;
  const doc = JSON.parse(JSON.stringify(config)) as Record<string, unknown>;
  const now = Date.now();
  const existing = templates.find((t) => t.name.toLowerCase() === trimmed.toLowerCase());
  if (existing) {
    templates = templates.map((t) => (t.id === existing.id ? { ...t, config: doc } : t));
  } else {
    templates = [...templates, { id: Math.random().toString(36).slice(2, 10), name: trimmed, config: doc, createdAt: now }];
  }
  persist();
  emit();
}

/** Apply a template to the ACTIVE pane's chart (workspace style-sync mirrors it to linked cells). */
export function applyTemplate(id: string): void {
  const tpl = templates.find((t) => t.id === id);
  if (!tpl) return;
  const state = useAppStore.getState();
  const handle = getChart(state.activePaneId ?? state.panes[0]?.id ?? "");
  if (handle?.vela?.renderer?.applyConfig == null) return;
  try {
    handle.vela.renderer.applyConfig(tpl.config);
  } catch {
    /* renderer without the rich-config seam */
  }
  emit();
}

export function removeTemplate(id: string): void {
  templates = templates.filter((t) => t.id !== id);
  persist();
  emit();
}

/** One-line summary of what the template covers (built-in groups present). */
export function templateSummary(t: VelaChartTemplate): string {
  const groups = Object.keys(t.config ?? {});
  const labels: Record<string, string> = {
    series: "Style",
    candles: "Candles",
    grid: "Grid",
    crosshair: "Crosshair",
    layout: "Scales",
    priceScale: "Price axis",
    timeScale: "Time axis",
    margins: "Margins",
    panes: "Panes",
    marks: "Labels",
    chartTypes: "Overrides",
  };
  const parts = groups.map((g) => labels[g] ?? g).slice(0, 4);
  return parts.join(" · ") || "Custom";
}
