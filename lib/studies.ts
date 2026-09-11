import type {
  IndicatorId,
  IndicatorInstance,
  IndicatorSettingsMap,
  PaneIndicators,
} from "@/types";
import {
  DEFAULT_INDICATOR_SETTINGS,
  normalizeBbSettings,
  normalizeEmaSettings,
  normalizeObSettings,
  normalizePmoSettings,
  normalizeStochSettings,
  normalizeVolumeSettings,
  normalizeVwapSettings,
} from "@/types";
import { cloneVisibility } from "@/lib/visibility";
import { INDICATOR_ORDER } from "@/lib/indicators";

function cloneJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function newStudyId(): string {
  return `s_${Math.random().toString(36).slice(2, 10)}`;
}

export function normalizeStudySettings<K extends IndicatorId>(
  type: K,
  raw: Partial<IndicatorSettingsMap[K]> | null | undefined,
): IndicatorSettingsMap[K] {
  const base = DEFAULT_INDICATOR_SETTINGS[type];
  if (type === "volume") {
    return normalizeVolumeSettings(
      raw as Partial<IndicatorSettingsMap["volume"]>,
    ) as IndicatorSettingsMap[K];
  }
  if (type === "vwap") {
    return normalizeVwapSettings(
      raw as Partial<IndicatorSettingsMap["vwap"]>,
    ) as IndicatorSettingsMap[K];
  }
  if (type === "ema") {
    return normalizeEmaSettings(raw as Parameters<typeof normalizeEmaSettings>[0]) as IndicatorSettingsMap[K];
  }
  if (type === "bb") {
    return normalizeBbSettings(raw as Partial<IndicatorSettingsMap["bb"]>) as IndicatorSettingsMap[K];
  }
  if (type === "stoch") {
    return normalizeStochSettings(
      raw as Parameters<typeof normalizeStochSettings>[0],
    ) as IndicatorSettingsMap[K];
  }
  if (type === "pmo") {
    return normalizePmoSettings(
      raw as Partial<IndicatorSettingsMap["pmo"]>,
    ) as IndicatorSettingsMap[K];
  }
  if (type === "ob") {
    return normalizeObSettings(
      raw as Partial<IndicatorSettingsMap["ob"]>,
    ) as IndicatorSettingsMap[K];
  }
  if (type === "rsi" || type === "atr" || type === "adx") {
    const merged = {
      ...(base as object),
      ...(raw as object),
      visibility: cloneVisibility(
        (raw as { visibility?: never })?.visibility as never,
      ),
    };
    return merged as IndicatorSettingsMap[K];
  }
  return cloneJson(base) as IndicatorSettingsMap[K];
}

export function cloneStudySettings<K extends IndicatorId>(
  type: K,
  settings?: Partial<IndicatorSettingsMap[K]> | null,
): IndicatorSettingsMap[K] {
  return normalizeStudySettings(type, cloneJson(settings ?? DEFAULT_INDICATOR_SETTINGS[type]));
}

export function createStudy(
  type: IndicatorId,
  settings?: Partial<IndicatorSettingsMap[IndicatorId]> | null,
  hidden = false,
): IndicatorInstance {
  return {
    id: newStudyId(),
    type,
    hidden,
    settings: cloneStudySettings(type, settings),
  };
}

/** Default studies for a new chart pane (Volume + VWAP). */
export function defaultStudies(
  defaults: IndicatorSettingsMap = DEFAULT_INDICATOR_SETTINGS,
): IndicatorInstance[] {
  return [
    createStudy("volume", defaults.volume),
    createStudy("vwap", defaults.vwap),
  ];
}

export function studiesOfType(studies: IndicatorInstance[], type: IndicatorId): IndicatorInstance[] {
  return studies.filter((s) => s.type === type);
}

export function findStudy(
  studies: IndicatorInstance[],
  id: string,
): IndicatorInstance | undefined {
  return studies.find((s) => s.id === id);
}

/** Expand legacy boolean map into study instances. */
export function migrateLegacyIndicators(
  indicators: PaneIndicators | null | undefined,
  hidden: Partial<Record<IndicatorId, boolean>> | null | undefined,
  defaults: IndicatorSettingsMap = DEFAULT_INDICATOR_SETTINGS,
): IndicatorInstance[] {
  const flags = { ...Object.fromEntries(INDICATOR_ORDER.map((id) => [id, false])), ...indicators } as PaneIndicators;
  const out: IndicatorInstance[] = [];
  for (const type of INDICATOR_ORDER) {
    if (!flags[type]) continue;
    out.push(createStudy(type, defaults[type], Boolean(hidden?.[type])));
  }
  return out;
}

export function ensurePaneStudies(
  pane: {
    studies?: IndicatorInstance[] | null;
    indicators?: PaneIndicators | null;
    hiddenIndicators?: Partial<Record<IndicatorId, boolean>> | null;
  },
  defaults: IndicatorSettingsMap = DEFAULT_INDICATOR_SETTINGS,
): IndicatorInstance[] {
  if (Array.isArray(pane.studies)) {
    if (pane.studies.length > 0 || !pane.indicators) {
      return pane.studies.map((s) => ({
        id: s.id || newStudyId(),
        type: s.type,
        hidden: Boolean(s.hidden),
        settings: cloneStudySettings(s.type, s.settings as never),
      }));
    }
  }
  if (pane.indicators) {
    return migrateLegacyIndicators(pane.indicators, pane.hiddenIndicators, defaults);
  }
  return defaultStudies(defaults);
}

export function studiesSignature(studies: IndicatorInstance[]): string {
  return studies
    .map((s) => `${s.type}:${s.hidden ? 1 : 0}`)
    .join("|");
}

export function studiesTypeFlags(studies: IndicatorInstance[]): PaneIndicators {
  const flags = Object.fromEntries(INDICATOR_ORDER.map((id) => [id, false])) as PaneIndicators;
  for (const s of studies) flags[s.type] = true;
  return flags;
}

export function templateToStudies(
  tpl: {
    studies?: Array<Pick<IndicatorInstance, "type" | "settings" | "hidden">>;
    indicators?: PaneIndicators;
  },
  defaults: IndicatorSettingsMap = DEFAULT_INDICATOR_SETTINGS,
): IndicatorInstance[] {
  if (tpl.studies?.length) {
    return tpl.studies.map((s) => createStudy(s.type, s.settings as never, Boolean(s.hidden)));
  }
  if (tpl.indicators) {
    return migrateLegacyIndicators(tpl.indicators, {}, defaults);
  }
  return defaultStudies(defaults);
}
