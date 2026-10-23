/**
 * vela-templates.ts — Vela's OWN template core for MAWS.
 *
 * A chart template captures Vela's `ChartConfig` plus MAWS-managed indicator state.
 * This replaces the old MAWS mapping layer (`mawsToVelaConfig`): the document is
 * authoritative and never lossy round-trips through a hand-written reducer.
 *
 * Theme is NOT part of the document by design (Vela excludes the Canvas → Theme
 * row from config persistence), so a template applied to a different theme keeps
 * the app theme and only re-skins plot cosmetics.
 *
 * The template documents ride localStorage (`maws.vela-templates`); indicator state
 * is copied from the active pane when saving and restored through the app store.
 */

import { getChart, type ChartHandle, type ChartTemplatePrefs } from "@/lib/chart-registry";
import { useAppStore } from "@/lib/store";
import { createStudy } from "@/lib/studies";
import { syncPaneNativeIndicators } from "@/lib/vela-indicators";
import { INDICATOR_ORDER } from "@/lib/indicators";
import type { IndicatorId, IndicatorInstance, PaneNative } from "@/types";

type TemplateStudies = Array<Pick<IndicatorInstance, "type" | "settings" | "hidden">>;

type TemplateIndicators = {
  studies: TemplateStudies;
  natives: PaneNative[];
};

export type VelaChartTemplate = {
  id: string;
  name: string;
  /** The renderer config document (`renderer.getConfig()`). */
  config: Record<string, unknown>;
  /** Managed MAWS and Vela-native indicators; absent on older style-only templates. */
  indicators?: TemplateIndicators;
  /** Host-owned display preferences; absent on older templates. */
  prefs?: ChartTemplatePrefs;
  createdAt: number;
};

const STORAGE_KEY = "maws.vela-templates";
const EMPTY_TEMPLATES: VelaChartTemplate[] = [];

/**
 * The chart a workspace-level template action aims at.
 *
 * The zustand `activePaneId` can outlive the mounted grid: layout switches
 * rebuild workspace cells while the store still names a pane that is no longer
 * on screen, so every shell-side edit then aimed at a chart that did not exist
 * and a template click was a SILENT NO-OP (nothing anywhere changed). Resolve
 * against the registry instead: the active pane first, then the visible stored
 * panes in order — the first pane with a LIVE renderer wins — and re-seat the
 * stale pointer so later shell edits match the chart on screen.
 */
function resolveTemplateTarget(preferredPaneId?: string): { paneId: string; handle: ChartHandle } | null {
  if (preferredPaneId) {
    const handle = getChart(preferredPaneId);
    return handle?.vela?.renderer?.getConfig == null ? null : { paneId: preferredPaneId, handle };
  }
  const st = useAppStore.getState();
  const ids = [st.activePaneId, ...st.panes.slice(0, st.layoutCount).map((p) => p.id)];
  for (const id of ids) {
    const handle = id ? getChart(id) : undefined;
    if (handle?.vela?.renderer?.getConfig == null) continue;
    if (id !== st.activePaneId) st.setActivePane(id);
    return { paneId: id, handle };
  }
  return null;
}

/** In-module cache so the UI re-renders when templates change (tiny pub-sub). */
let templates = EMPTY_TEMPLATES;
let templatesLoaded = false;
const listeners = new Set<(t: VelaChartTemplate[]) => void>();

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

function sanitizeIndicators(value: unknown): TemplateIndicators | undefined {
  if (!isRecord(value) || !Array.isArray(value.studies) || !Array.isArray(value.natives)) {
    return undefined;
  }
  const studies = value.studies.flatMap((raw) => {
    if (!isRecord(raw) || !INDICATOR_ORDER.includes(raw.type as IndicatorId) || !isRecord(raw.settings)) {
      return [];
    }
    return [{
      type: raw.type as IndicatorId,
      settings: raw.settings as IndicatorInstance["settings"],
      ...(typeof raw.hidden === "boolean" ? { hidden: raw.hidden } : {}),
    }];
  });
  const natives = value.natives.flatMap((raw) => {
    if (!isRecord(raw) || typeof raw.type !== "string" || !isRecord(raw.inputs)) return [];
    const inputs = Object.fromEntries(
      Object.entries(raw.inputs).filter(([, input]) =>
        typeof input === "number" || typeof input === "string" || typeof input === "boolean",
      ),
    );
    return [{
      type: raw.type,
      inputs: inputs as PaneNative["inputs"],
      ...(typeof raw.hidden === "boolean" ? { hidden: raw.hidden } : {}),
    }];
  });
  return { studies, natives };
}

function parseTemplates(raw: string | null): VelaChartTemplate[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((entry) => {
      if (
        !isRecord(entry) ||
        typeof entry.id !== "string" ||
        typeof entry.name !== "string" ||
        !isRecord(entry.config)
      ) return [];
      const indicators = sanitizeIndicators(entry.indicators);
      const prefs = isRecord(entry.prefs) &&
        typeof entry.prefs.watermark === "boolean" &&
        typeof entry.prefs.replayWatermark === "boolean" &&
        typeof entry.prefs.indicatorTitles === "boolean" &&
        typeof entry.prefs.indicatorValues === "boolean"
        ? {
            watermark: entry.prefs.watermark,
            replayWatermark: entry.prefs.replayWatermark,
            indicatorTitles: entry.prefs.indicatorTitles,
            indicatorValues: entry.prefs.indicatorValues,
          }
        : undefined;
      return [{
        id: entry.id,
        name: entry.name,
        config: entry.config,
        ...(indicators ? { indicators } : {}),
        ...(prefs ? { prefs } : {}),
        createdAt: typeof entry.createdAt === "number" ? entry.createdAt : 0,
      }];
    });
  } catch {
    console.error("[maws] Could not read chart templates from browser storage.");
    return [];
  }
}

function ensureLoaded(): void {
  if (templatesLoaded || typeof window === "undefined") return;
  templatesLoaded = true;
  try {
    templates = parseTemplates(window.localStorage.getItem(STORAGE_KEY));
  } catch (error) {
    templates = [];
    console.error("[maws] Could not load chart templates from browser storage.", error);
  }
}

function persist(next: VelaChartTemplate[]): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return true;
  } catch (error) {
    console.error("[maws] Could not save chart templates to browser storage.", error);
    return false;
  }
}

function emit(): void {
  for (const l of listeners) l(templates);
}

export function subscribeTemplates(fn: (t: VelaChartTemplate[]) => void): () => void {
  ensureLoaded();
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getTemplates(): readonly VelaChartTemplate[] {
  ensureLoaded();
  return templates;
}

/** Snapshot the ACTIVE pane's renderer config and indicator set as a named template. */
export function saveTemplate(name: string): boolean {
  ensureLoaded();
  const trimmed = name.trim();
  if (!trimmed) return false;
  const target = resolveTemplateTarget();
  if (!target) return false;
  const config = target.handle.vela.renderer.getConfig();
  if (!isRecord(config)) return false;
  const doc = JSON.parse(JSON.stringify(config)) as Record<string, unknown>;
  const pane = useAppStore.getState().panes.find((p) => p.id === target.paneId);
  const savedPrefs = pane?.velaState;
  const prefs = target.handle.getTemplatePrefs?.() ?? (
    typeof savedPrefs?.watermark === "boolean" &&
    typeof savedPrefs.replayWatermark === "boolean" &&
    typeof savedPrefs.indicatorTitles === "boolean" &&
    typeof savedPrefs.indicatorValues === "boolean"
      ? {
          watermark: savedPrefs.watermark,
          replayWatermark: savedPrefs.replayWatermark,
          indicatorTitles: savedPrefs.indicatorTitles,
          indicatorValues: savedPrefs.indicatorValues,
        }
      : undefined
  );
  const indicators = pane
    ? {
        studies: pane.studies.map(({ type, settings, hidden }) => ({
          type,
          settings: JSON.parse(JSON.stringify(settings)) as IndicatorInstance["settings"],
          ...(hidden === undefined ? {} : { hidden }),
        })),
        natives: JSON.parse(JSON.stringify(pane.natives ?? [])) as PaneNative[],
      }
    : undefined;
  const now = Date.now();
  const existing = templates.find((t) => t.name.toLowerCase() === trimmed.toLowerCase());
  let next: VelaChartTemplate[];
  if (existing) {
    next = templates.map((t) =>
      t.id === existing.id
        ? { ...t, config: doc, ...(indicators ? { indicators } : {}), ...(prefs ? { prefs } : {}) }
        : t,
    );
  } else {
    next = [
      ...templates,
      {
        id: Math.random().toString(36).slice(2, 10),
        name: trimmed,
        config: doc,
        ...(indicators ? { indicators } : {}),
        ...(prefs ? { prefs } : {}),
        createdAt: now,
      },
    ];
  }
  if (!persist(next)) return false;
  templates = next;
  emit();
  return true;
}

/** Apply a template's chart config and indicator set to a live pane. */
export function applyTemplate(id: string, targetPaneId?: string): boolean {
  ensureLoaded();
  const tpl = templates.find((t) => t.id === id);
  if (!tpl) return false;
  const target = resolveTemplateTarget(targetPaneId);
  if (!target || target.handle.vela.renderer.applyConfig == null) return false;
  try {
    target.handle.vela.renderer.applyConfig(tpl.config);
    if (tpl.indicators) {
      const studies = tpl.indicators.studies.map((study) =>
        createStudy(study.type, study.settings, study.hidden),
      );
      useAppStore.setState((state) => ({
        panes: state.panes.map((pane) =>
          pane.id === target.paneId ? { ...pane, studies } : pane,
        ),
      }));
      const natives = JSON.parse(JSON.stringify(tpl.indicators.natives)) as PaneNative[];
      useAppStore.getState().setPaneNatives(target.paneId, natives);
      syncPaneNativeIndicators(target.handle.vela, natives);
    }
    if (tpl.prefs) {
      target.handle.applyTemplatePrefs?.(tpl.prefs);
      const current = useAppStore.getState().panes.find((pane) => pane.id === target.paneId);
      useAppStore.getState().setPaneVelaState(target.paneId, {
        ...(current?.velaState ?? {}),
        ...tpl.prefs,
      });
    }
  } catch (error) {
    console.error(`[maws] Could not apply chart template "${tpl.name}".`, error);
    return false;
  }
  emit();
  return true;
}

export function removeTemplate(id: string): void {
  ensureLoaded();
  const next = templates.filter((t) => t.id !== id);
  if (!persist(next)) return;
  templates = next;
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
  if (t.indicators) parts.unshift("Indicators");
  if (t.prefs) parts.unshift("Display");
  return parts.join(" · ") || "Custom";
}
