/**
 * Reload-duplication guard for the MAWS → Vela study bridge.
 *
 * A cell restores its persisted indicator ledger BEFORE the bridge runs, so last
 * session's managed handle is already on the chart under an id nobody tracked. The
 * bridge must ADOPT it — adding "the" handle for the study instead stacked a second
 * identical series on every load, and the duplicates were then persisted as if the
 * user had added them (charts accumulated dozens of VWAPs).
 */
import type { Vela } from "@/lib/charting";
import type { IndicatorInstance } from "@/types";
import { isManagedHandle, syncVelaIndicators } from "@/lib/vela-indicators";

type FakeHandle = {
  id: string;
  nativeType: string;
  visible: boolean;
  inputValues(): Record<string, unknown>;
  setInputs(values: Record<string, unknown>): void;
  remove(): void;
};

function fakeHandle(
  id: string,
  nativeType: string,
  inputs: Record<string, unknown>,
  list: FakeHandle[],
): FakeHandle {
  let values = { ...inputs };
  const handle: FakeHandle = {
    id,
    nativeType,
    visible: true,
    inputValues: () => ({ ...values }),
    setInputs: (next) => {
      values = { ...values, ...next };
    },
    remove: () => {
      const at = list.indexOf(handle);
      if (at >= 0) list.splice(at, 1);
    },
  };
  return handle;
}

function fakeChart(existing: Array<{ id: string; nativeType: string; inputs: Record<string, unknown> }>) {
  const handles: FakeHandle[] = [];
  for (const entry of existing) {
    handles.push(fakeHandle(entry.id, entry.nativeType, entry.inputs, handles));
  }
  let seq = 0;
  const chart = {
    getVisibleRange: () => ({ from: 0, to: 1 }),
    on: () => () => {},
    indicators: () => handles,
    addNativeIndicator: (type: string, opts?: { inputs?: Record<string, unknown> }) => {
      const handle = fakeHandle(`new-${++seq}`, type, opts?.inputs ?? {}, handles);
      handles.push(handle);
      return handle;
    },
  };
  return { chart: chart as unknown as Vela, handles };
}

function vwapStudy(id = "s_vwap"): IndicatorInstance {
  return {
    id,
    type: "vwap",
    hidden: false,
    settings: { anchorPeriod: "session", source: "hlc3" },
  } as IndicatorInstance;
}

describe("syncVelaIndicators — restored ledger", () => {
  it("adopts a restored native instead of mounting a duplicate", async () => {
    const { chart, handles } = fakeChart([
      { id: "restored-1", nativeType: "vwap", inputs: { anchor: "Week", source: "Close" } },
    ]);

    await syncVelaIndicators(chart, [vwapStudy()]);

    expect(handles).toHaveLength(1);
    expect(handles[0]!.id).toBe("restored-1");
    expect(isManagedHandle(chart, "restored-1")).toBe(true);
    // The store owns the settings: the adopted handle takes them.
    expect(handles[0]!.inputValues()).toMatchObject({ anchor: "Session", source: "HLC3" });
  });

  it("prunes exact duplicate copies a broken session left behind", async () => {
    const inputs = { anchor: "Session", source: "HLC3" };
    const { chart, handles } = fakeChart([
      { id: "restored-1", nativeType: "vwap", inputs },
      { id: "restored-2", nativeType: "vwap", inputs },
      { id: "restored-3", nativeType: "vwap", inputs },
    ]);

    await syncVelaIndicators(chart, [vwapStudy()]);

    expect(handles).toHaveLength(1);
    expect(handles[0]!.id).toBe("restored-1");
  });

  it("keeps a second copy whose settings differ — that one is the user's", async () => {
    const { chart, handles } = fakeChart([
      { id: "restored-1", nativeType: "vwap", inputs: { anchor: "Session", source: "HLC3" } },
      { id: "user-1", nativeType: "vwap", inputs: { anchor: "Week", source: "Close" } },
    ]);

    await syncVelaIndicators(chart, [vwapStudy()]);

    expect(handles).toHaveLength(2);
    expect(handles.map((h) => h.id).sort()).toEqual(["restored-1", "user-1"]);
  });
});
