import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import {
  PINE_LIBRARY_KEY,
  blankPineScript,
  chartIdForScript,
  loadPineDraft,
  loadPineScripts,
  sanitizePinePayload,
  savePineDraft,
  savePineScripts,
} from "@/lib/vela-pine-scripts";

/**
 * The Pine editor keeps two kinds of state: the user's script LIBRARY (localStorage,
 * user content) and each cell's live scripts (Vela's `ext` bag — untrusted on read).
 * Both boundaries get validated here; the editor UI itself is covered by the
 * end-to-end check in the running app.
 */

type WindowStub = {
  localStorage: {
    getItem: (key: string) => string | null;
    setItem: (key: string, value: string) => void;
    removeItem: (key: string) => void;
  };
};

function installWindow(): Map<string, string> {
  const map = new Map<string, string>();
  const stub: WindowStub = {
    localStorage: {
      getItem: (key) => (map.has(key) ? (map.get(key) as string) : null),
      setItem: (key, value) => {
        map.set(key, String(value));
      },
      removeItem: (key) => {
        map.delete(key);
      },
    },
  };
  (globalThis as unknown as { window: WindowStub }).window = stub;
  return map;
}

function uninstallWindow(): void {
  delete (globalThis as unknown as { window?: WindowStub }).window;
}

const VALID_SCRIPT = '//@version=5\nindicator("T")\nplot(close)';

beforeEach(() => {
  uninstallWindow();
});

afterEach(() => {
  uninstallWindow();
});

describe("Pine script library", () => {
  it("starts empty on a browser that never saved a script", () => {
    installWindow();
    expect(loadPineScripts()).toEqual([]);
  });

  it("round-trips a saved library", () => {
    const map = installWindow();
    savePineScripts([{ id: "mine", name: "Mine", script: VALID_SCRIPT, updatedAt: 42 }]);
    expect(JSON.parse(map.get(PINE_LIBRARY_KEY) as string)).toHaveLength(1);
    expect(loadPineScripts()).toEqual([
      { id: "mine", name: "Mine", script: VALID_SCRIPT, updatedAt: 42 },
    ]);
  });

  it("drops invalid stored entries and keeps the valid ones", () => {
    const map = installWindow();
    map.set(
      PINE_LIBRARY_KEY,
      JSON.stringify([
        { id: "ok", name: "Ok", script: VALID_SCRIPT, updatedAt: 1 },
        { id: "", name: "No id", script: VALID_SCRIPT, updatedAt: 1 },
        { id: "nameless", name: "", script: VALID_SCRIPT, updatedAt: 1 },
        { id: "no-source", name: "No source", updatedAt: 1 },
        { id: "huge", name: "Huge", script: "x".repeat(200_001), updatedAt: 1 },
        null,
        "nope",
      ]),
    );
    expect(loadPineScripts().map((s) => s.id)).toEqual(["ok"]);
  });

  it("starts empty on corrupt storage too (no surprise scripts)", () => {
    const map = installWindow();
    map.set(PINE_LIBRARY_KEY, "{not json");
    expect(loadPineScripts()).toEqual([]);
  });

  it("gives every blank script the editor's starter template", () => {
    installWindow();
    const blank = blankPineScript("Mine");
    expect(blank.id).not.toBe("");
    expect(blank.script).toContain('indicator("Mine", overlay = true)');
    expect(blank.script).toContain("//@version=5");
    expect(blank.script.startsWith("// This Pine Script")).toBe(true);
  });

  it("round-trips the unsaved draft and clears it on save", () => {
    installWindow();
    savePineDraft({ id: "draft-1", name: "My script", script: VALID_SCRIPT });
    expect(loadPineDraft()).toEqual({ id: "draft-1", name: "My script", script: VALID_SCRIPT });
    savePineDraft(null);
    expect(loadPineDraft()).toBeNull();
  });

  it("ignores a malformed draft", () => {
    const map = installWindow();
    map.set("maws.pine.draft.v1", JSON.stringify({ id: "", name: "x", script: VALID_SCRIPT }));
    expect(loadPineDraft()).toBeNull();
  });

  it("paces chart ids by the library id so a restore lands on the same row", () => {
    expect(chartIdForScript("abc")).toBe("pine:abc");
    expect(chartIdForScript("abc")).toBe(chartIdForScript("abc"));
  });
});

describe("Pine ext payload validation (untrusted cell document)", () => {
  it("rejects anything that is not a scripts array", () => {
    expect(sanitizePinePayload(null)).toEqual([]);
    expect(sanitizePinePayload("x")).toEqual([]);
    expect(sanitizePinePayload({})).toEqual([]);
    expect(sanitizePinePayload({ scripts: {} })).toEqual([]);
  });

  it("keeps valid entries and normalizes optional bags", () => {
    const out = sanitizePinePayload({
      scripts: [
        { id: "pine:a", name: "A", script: VALID_SCRIPT },
        {
          id: "pine:b",
          name: "B",
          script: VALID_SCRIPT,
          inputs: { length: 20 },
          props: { precision: 3 },
          hidden: true,
        },
      ],
    });
    expect(out).toEqual([
      { id: "pine:a", name: "A", script: VALID_SCRIPT },
      {
        id: "pine:b",
        name: "B",
        script: VALID_SCRIPT,
        inputs: { length: 20 },
        props: { precision: 3 },
        hidden: true,
      },
    ]);
  });

  it("drops malformed entries and non-object input bags", () => {
    const out = sanitizePinePayload({
      scripts: [
        { id: "", name: "A", script: VALID_SCRIPT },
        { id: "pine:c", name: "", script: VALID_SCRIPT },
        { id: "pine:d", name: "D", script: "" },
        { id: "pine:e", name: "E", script: "x".repeat(200_001) },
        { id: "pine:f", name: "F", script: VALID_SCRIPT, inputs: ["length"], hidden: "yes" },
      ],
    });
    expect(out).toEqual([{ id: "pine:f", name: "F", script: VALID_SCRIPT }]);
  });
});
