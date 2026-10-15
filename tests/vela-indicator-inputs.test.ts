/**
 * velaInputsToStudySettings — the inverse of the bridge's nativeInputs mapping.
 *
 * Managed (maws-*) indicator edits made in Vela's in-chart settings dialog are
 * written back into pane.studies through this function; pane.studies is what
 * every chart remount (refresh, timeframe/symbol change) re-seeds the chart
 * from, so a wrong translation would silently revert user edits.
 */
import { velaInputsToStudySettings } from "@/lib/vela-indicators";

describe("velaInputsToStudySettings", () => {
  it("maps EMA inputs back to MAWS settings keys", () => {
    expect(
      velaInputsToStudySettings("ema", {
        length: 21,
        maType: "WMA",
        source: "HL2",
        offset: 2,
        color: "#ff0000",
        lineWidth: 3,
      }),
    ).toEqual({
      period: 21,
      smoothingType: "wma",
      source: "hl2",
      offset: 2,
      color: "#ff0000",
      lineWidth: 3,
    });
  });

  it("inverts every MAWS smoothing type", () => {
    expect(velaInputsToStudySettings("ema", { maType: "SMA" }).smoothingType).toBe("sma");
    expect(velaInputsToStudySettings("ema", { maType: "EMA" }).smoothingType).toBe("ema");
    expect(velaInputsToStudySettings("ema", { maType: "RMA (SMMA)" }).smoothingType).toBe("smma");
  });

  it("maps stochastic inputs back", () => {
    expect(
      velaInputsToStudySettings("stoch", { kLength: 12, kSmoothing: 5, dLength: 4 }),
    ).toEqual({ length: 12, kSmoothing: 5, dSmoothing: 4 });
  });

  it("maps bollinger bands and vwap inputs back", () => {
    expect(
      velaInputsToStudySettings("bb", { length: 30, source: "Close", mult: 2.5, offset: 1 }),
    ).toEqual({ period: 30, source: "close", mult: 2.5, offset: 1 });
    expect(
      velaInputsToStudySettings("vwap", { anchor: "Week", source: "HLC3" }),
    ).toEqual({ anchorPeriod: "week", source: "hlc3" });
  });

  it("maps atr and adx period inputs back", () => {
    expect(velaInputsToStudySettings("atr", { length: 10, color: "#123456" })).toEqual({
      period: 10,
      color: "#123456",
    });
    expect(velaInputsToStudySettings("adx", { diLength: 7, adxLength: 7 })).toEqual({ period: 7 });
  });

  it("skips malformed values and unknown types instead of writing garbage", () => {
    expect(velaInputsToStudySettings("ema", { length: NaN, maType: 42, source: "" })).toEqual({});
    expect(velaInputsToStudySettings("unknown-type", { length: 5 })).toEqual({});
  });
});
