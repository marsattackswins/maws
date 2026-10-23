/**
 * pine-syntax.ts — a tiny Pine Script tokenizer for the editor's highlighting.
 *
 * No parser, no dependency: one left-to-right pass per line that classifies
 * comments, strings, numbers, keywords and the builtins that appear after a
 * namespace dot (`ta.ema`, `color.red`, `strategy.long`). Enough for editor
 * colouring; the real parser is PineTS, inside the engine.
 */

export type PineTokenKind =
  | "plain"
  | "comment"
  | "string"
  | "number"
  | "keyword"
  | "builtin";

export type PineToken = { text: string; kind: PineTokenKind };

const KEYWORDS = new Set([
  "if",
  "else",
  "for",
  "to",
  "by",
  "while",
  "switch",
  "case",
  "default",
  "break",
  "continue",
  "var",
  "varip",
  "and",
  "or",
  "not",
  "true",
  "false",
  "na",
  "import",
  "export",
  "type",
  "method",
  "enum",
  "series",
  "simple",
  "const",
  "input",
]);

const BUILTINS = new Set([
  "indicator",
  "strategy",
  "library",
  "plot",
  "plotshape",
  "plotchar",
  "plotcandle",
  "plotbar",
  "plotarrow",
  "hline",
  "fill",
  "bgcolor",
  "barcolor",
  "alertcondition",
  "alert",
  "table",
  "line",
  "label",
  "box",
  "array",
  "matrix",
  "map",
  "request",
  "ta",
  "math",
  "color",
  "str",
  "timeframe",
  "syminfo",
  "barstate",
  "strategy",
  "open",
  "high",
  "low",
  "close",
  "volume",
  "time",
  "bar_index",
]);

const IDENT_START = /[A-Za-z_]/;
const IDENT_PART = /[A-Za-z0-9_]/;
const DIGIT = /[0-9]/;

function readString(line: string, start: number): number {
  const quote = line[start];
  let i = start + 1;
  while (i < line.length) {
    if (line[i] === "\\") {
      i += 2;
      continue;
    }
    if (line[i] === quote) return i + 1;
    i += 1;
  }
  return line.length;
}

/** Classify one line — what the editor paints. */
export function tokenizePineLine(line: string): PineToken[] {
  const tokens: PineToken[] = [];
  let plain = "";
  const flush = () => {
    if (plain) {
      tokens.push({ text: plain, kind: "plain" });
      plain = "";
    }
  };
  const push = (text: string, kind: PineTokenKind) => {
    flush();
    tokens.push({ text, kind });
  };

  let i = 0;
  let afterDot = false;
  /** Function-call nesting — a named argument only exists inside a call's parens. */
  let depth = 0;
  while (i < line.length) {
    const ch = line[i] as string;

    if (ch === "/" && line[i + 1] === "/") {
      push(line.slice(i), "comment");
      break;
    }
    if (ch === '"' || ch === "'") {
      const end = readString(line, i);
      push(line.slice(i, end), "string");
      i = end;
      afterDot = false;
      continue;
    }
    if (DIGIT.test(ch) || (ch === "." && DIGIT.test(line[i + 1] ?? ""))) {
      let end = i + 1;
      while (end < line.length && /[0-9._]/.test(line[end] as string)) end += 1;
      push(line.slice(i, end), "number");
      i = end;
      afterDot = false;
      continue;
    }
    if (IDENT_START.test(ch)) {
      let end = i + 1;
      while (end < line.length && IDENT_PART.test(line[end] as string)) end += 1;
      const word = line.slice(i, end);
      const namedArg = depth > 0 && /^\s*=(?!=)/.test(line.slice(end));
      if (afterDot) push(word, "builtin");
      else if (KEYWORDS.has(word)) push(word, "keyword");
      else if (BUILTINS.has(word) || namedArg) push(word, "builtin");
      else plain += word;
      i = end;
      afterDot = false;
      continue;
    }

    if (ch === ".") {
      afterDot = true;
      plain += ch;
      i += 1;
      continue;
    }
    if (ch === "(") depth += 1;
    else if (ch === ")") depth = Math.max(0, depth - 1);
    afterDot = false;
    plain += ch;
    i += 1;
  }
  flush();
  return tokens;
}

/** Tokenize a whole script, one array per line (line numbers are the array index). */
export function tokenizePine(source: string): PineToken[][] {
  return source.split("\n").map(tokenizePineLine);
}
