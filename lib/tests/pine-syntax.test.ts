import { describe, it, expect } from "@jest/globals";
import { tokenizePine, tokenizePineLine } from "@/lib/pine-syntax";

/** Token kinds in order, ignoring the text — what the editor colours. */
function kinds(line: string): string[] {
  return tokenizePineLine(line)
    .filter((t) => t.kind !== "plain")
    .map((t) => `${t.kind}:${t.text}`);
}

describe("Pine tokenizer (editor highlighting)", () => {
  it("treats // to end of line as a comment, including the version pragma", () => {
    expect(tokenizePineLine("//@version=5")).toEqual([{ text: "//@version=5", kind: "comment" }]);
    expect(kinds('plot(close) // note "quoted"')).toEqual([
      "builtin:plot",
      "builtin:close",
      "comment:// note \"quoted\"",
    ]);
  });

  it("classifies declaration names, strings, numbers and keywords", () => {
    expect(kinds('indicator("EMA 20", overlay=true)')).toEqual([
      "builtin:indicator",
      "string:\"EMA 20\"",
      "builtin:overlay",
      "keyword:true",
    ]);
    expect(kinds("plot(ta.ema(close, 20.5), linewidth=2)")).toEqual([
      "builtin:plot",
      "builtin:ta",
      "builtin:ema",
      "builtin:close",
      "number:20.5",
      "builtin:linewidth",
      "number:2",
    ]);
  });

  it("recovers from an unterminated string at end of line", () => {
    const tokens = tokenizePineLine('label.new(bar_index, high, "oops');
    expect(tokens[tokens.length - 1]).toEqual({ text: '"oops', kind: "string" });
  });

  it("splits a script into one token array per line", () => {
    const lines = tokenizePine("// a\nplot(close)\n");
    expect(lines).toHaveLength(3);
    expect(lines[0]).toEqual([{ text: "// a", kind: "comment" }]);
    expect(lines[2]).toEqual([]);
  });
});
