import { describe, expect, test } from "@jest/globals";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(__dirname, "../..");
const orderBlocks = readFileSync(resolve(root, "components/charts/OrderBlocks.tsx"), "utf8");
const chartCanvas = readFileSync(resolve(root, "components/charts/ChartCanvas.tsx"), "utf8");

describe("order blocks layering", () => {
  test("paints below the candle canvas so blocks render behind the candles", () => {
    expect(orderBlocks).toContain("z-[1]");
    expect(orderBlocks).not.toMatch(/z-\[1[0-9]\]/);
  });

  test("stays a positive z-index so the blocks do not sink under the pane background", () => {
    expect(orderBlocks).not.toMatch(/-z-(?:\[?\d+\]?|10)/);
    expect(orderBlocks).toContain("must stay positive");
  });

  test("the candle canvas remains above the overlay layer", () => {
    expect(chartCanvas).toContain('className="relative z-10 h-full min-h-0 w-full"');
  });
});
