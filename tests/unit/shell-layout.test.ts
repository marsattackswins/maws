import { describe, expect, test } from "@jest/globals";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(__dirname, "../..");
const appShell = readFileSync(resolve(root, "components/shell/AppShell.tsx"), "utf8");
const topBar = readFileSync(resolve(root, "components/shell/TopBar.tsx"), "utf8");
const bottomPanel = readFileSync(resolve(root, "components/shell/BottomPanel.tsx"), "utf8");
const settingsDialog = readFileSync(
  resolve(root, "lib/charting/renderers/native/chrome/SettingsDialog.ts"),
  "utf8",
);

describe("shell bottom-area layout", () => {
  test("does not render or retain the obsolete StatusBar", () => {
    expect(existsSync(resolve(root, "components/shell/StatusBar.tsx"))).toBe(false);
    expect(appShell).not.toContain("StatusBar");
    expect(appShell).not.toContain("StatusClock");
    expect(appShell).not.toContain("LiveStatusBar");
  });

  test("keeps live readiness, stream, and emergency status in BottomPanel", () => {
    expect(topBar).not.toContain("LiveStatusIndicator");
    expect(bottomPanel).toContain("LiveStatusIndicator");
    expect(bottomPanel).toContain("profilePhaseLabel");
    expect(bottomPanel).toContain('marker="stream"');
    expect(bottomPanel).toContain("Kill switch");
  });

  test("keeps one trading clock in BottomPanel and no duplicate shell clock", () => {
    expect(bottomPanel.match(/aria-label=\"Current date and time\"/g)).toHaveLength(1);
    expect(appShell).not.toContain("StatusClock");
    expect(topBar).not.toContain("StatusClock");
  });

  test("keeps the chart-level timezone selector", () => {
    // The legacy scale-menu TimezonePicker is gone (Vela ships its own scale
    // controls); the timezone selector lives in the chart settings dialog.
    expect(settingsDialog).toContain("sectionTitle('Time zone')");
    expect(settingsDialog).toContain("selectRowLabeled('Time zone'");
  });

  test("does not resurrect the legacy chart-scale chrome", () => {
    // Old MAWS overlays superseded by Vela's built-in price-scale controls
    // (A/L buttons on hover) and the TopBar settings menu.
    for (const file of ["ChartAutoScale.tsx", "ChartScaleMenu.tsx", "IndicatorPaneAutoScale.tsx"]) {
      expect(existsSync(resolve(root, `components/charts/${file}`))).toBe(false);
    }
    expect(appShell).not.toContain("ChartAutoScale");
  });
});
