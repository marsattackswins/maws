/** Chrome colors for shell UI (everything except the chart canvas). */

export type AppSettings = {
  /** Page / shell background */
  backgroundColor: string;
  /** Watchlist, docks, side panels */
  panelColor: string;
  /** Chips, menus, elevated surfaces */
  elevatedColor: string;
  /** Dividers and outlines */
  borderColor: string;
  /** Row / control hover */
  hoverColor: string;
  /** Primary text */
  textColor: string;
  /** Secondary / muted text */
  mutedColor: string;
};

export const DEFAULT_APP_SETTINGS: AppSettings = {
  backgroundColor: "#000000",
  panelColor: "#111111",
  elevatedColor: "#1a1a1a",
  borderColor: "#222222",
  hoverColor: "#1a1a1a",
  textColor: "#d1d4dc",
  mutedColor: "#787b86",
};

const HEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

function colorOr(fallback: string, value?: string | null) {
  if (typeof value === "string" && HEX.test(value.trim())) return value.trim();
  return fallback;
}

export function normalizeAppSettings(
  raw: Partial<AppSettings> | null | undefined,
): AppSettings {
  const base = DEFAULT_APP_SETTINGS;
  return {
    backgroundColor: colorOr(base.backgroundColor, raw?.backgroundColor),
    panelColor: colorOr(base.panelColor, raw?.panelColor),
    elevatedColor: colorOr(base.elevatedColor, raw?.elevatedColor),
    borderColor: colorOr(base.borderColor, raw?.borderColor),
    hoverColor: colorOr(base.hoverColor, raw?.hoverColor),
    textColor: colorOr(base.textColor, raw?.textColor),
    mutedColor: colorOr(base.mutedColor, raw?.mutedColor),
  };
}

/** Push app chrome colors onto :root as CSS variables. */
export function applyAppTheme(settings: AppSettings) {
  if (typeof document === "undefined") return;
  const s = normalizeAppSettings(settings);
  const root = document.documentElement;
  root.style.setProperty("--app-bg", s.backgroundColor);
  root.style.setProperty("--app-panel", s.panelColor);
  root.style.setProperty("--app-elevated", s.elevatedColor);
  root.style.setProperty("--app-border", s.borderColor);
  root.style.setProperty("--app-hover", s.hoverColor);
  root.style.setProperty("--app-text", s.textColor);
  root.style.setProperty("--app-muted", s.mutedColor);
  // Alias used by some shell widgets
  root.style.setProperty("--maws-bg", s.backgroundColor);
  root.style.setProperty("--maws-panel", s.panelColor);
  root.style.setProperty("--maws-elevated", s.elevatedColor);
  root.style.setProperty("--maws-border", s.borderColor);
  root.style.setProperty("--maws-hover", s.hoverColor);
  root.style.setProperty("--maws-text", s.textColor);
  root.style.setProperty("--maws-muted", s.mutedColor);
  // Keep legacy TV tokens in sync for anything still referencing them.
  root.style.setProperty("--color-tv-bg", s.backgroundColor);
  root.style.setProperty("--color-tv-panel", s.panelColor);
  root.style.setProperty("--color-tv-settings", s.elevatedColor);
  root.style.setProperty("--color-tv-settings-input", s.elevatedColor);
  root.style.setProperty("--color-tv-border", s.borderColor);
  root.style.setProperty("--color-tv-text", s.textColor);
  root.style.setProperty("--color-tv-muted", s.mutedColor);
}
