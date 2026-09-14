import { describe, expect, test } from "@jest/globals";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(__dirname, "../..");
const appShell = readFileSync(resolve(root, "components/shell/AppShell.tsx"), "utf8");
const topBar = readFileSync(resolve(root, "components/shell/TopBar.tsx"), "utf8");
const bottomPanel = readFileSync(resolve(root, "components/shell/BottomPanel.tsx"), "utf8");
const chartScaleMenu = readFileSync(resolve(root, "components/charts/ChartScaleMenu.tsx"), "utf8");

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
    expect(chartScaleMenu).toContain("function TimezonePicker");
    expect(chartScaleMenu).toContain('className="scale-menu-tz-title">Timezone</span>');
  });
});
