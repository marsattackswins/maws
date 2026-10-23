"use client";

/**
 * PineCodeEditor.tsx — the code surface of the Pine panel.
 *
 * A transparent <textarea> stacked over a highlighted <pre>, with a line-number
 * gutter — the same shape as a Vela-code-editor without pulling an editor library
 * into the bundle. Both layers use identical font metrics, padding and wrapping, so
 * the caret sits exactly on the painted glyphs; scrolling keeps gutter and paint in
 * lock-step with the textarea.
 */

import { Fragment, useMemo, useRef } from "react";
import { tokenizePine, type PineTokenKind } from "@/lib/pine-syntax";

const COLORS: Record<PineTokenKind, string> = {
  plain: "#d1d4dc",
  comment: "#6a9955",
  string: "#ce9178",
  number: "#b5cea8",
  keyword: "#569cd6",
  builtin: "#9cdcfe",
};

const TEXT_STYLE = {
  fontFamily:
    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace",
  fontSize: 12,
  lineHeight: "20px",
  tabSize: 4,
} as const;

export type PineCodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
  /** Focus the text area (the header's pencil does this). */
  inputRef?: React.RefObject<HTMLTextAreaElement | null>;
  readOnly?: boolean;
};

export function PineCodeEditor({ value, onChange, inputRef, readOnly }: PineCodeEditorProps) {
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  const preRef = useRef<HTMLPreElement | null>(null);
  const gutterRef = useRef<HTMLDivElement | null>(null);
  const lines = useMemo(() => tokenizePine(value), [value]);
  const digits = String(lines.length).length;

  /** Keep the painted layer + gutter on the textarea's scroll offset. */
  const syncScroll = () => {
    const ta = taRef.current;
    if (!ta) return;
    if (preRef.current) {
      preRef.current.scrollTop = ta.scrollTop;
      preRef.current.scrollLeft = ta.scrollLeft;
    }
    if (gutterRef.current) gutterRef.current.scrollTop = ta.scrollTop;
  };

  const insertIndent = (el: HTMLTextAreaElement) => {
    const { selectionStart: start, selectionEnd: end } = el;
    onChange(`${value.slice(0, start)}    ${value.slice(end)}`);
    requestAnimationFrame(() => {
      el.setSelectionRange(start + 4, start + 4);
      el.focus();
    });
  };

  const assignTextarea = (el: HTMLTextAreaElement | null) => {
    taRef.current = el;
    if (inputRef) inputRef.current = el;
  };

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden" style={{ background: "#131722" }}>
      <div
        ref={gutterRef}
        aria-hidden
        className="shrink-0 select-none overflow-hidden text-right"
        style={{
          ...TEXT_STYLE,
          width: `${digits + 2}ch`,
          color: "#5c6370",
          paddingTop: 8,
          paddingBottom: 8,
          borderRight: "1px solid #2a2e39",
        }}
      >
        {lines.map((_, i) => (
          <div key={i} style={{ paddingRight: 8 }}>
            {i + 1}
          </div>
        ))}
      </div>

      <div className="relative min-w-0 flex-1">
        <pre
          ref={preRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden px-3 py-2"
          style={{ ...TEXT_STYLE, margin: 0, whiteSpace: "pre", color: COLORS.plain }}
        >
          {lines.map((tokens, i) => (
            <Fragment key={i}>
              {tokens.map((token, j) => (
                <span key={j} style={{ color: COLORS[token.kind] }}>
                  {token.text}
                </span>
              ))}
              {i < lines.length - 1 ? "\n" : null}
            </Fragment>
          ))}
        </pre>

        <textarea
          ref={assignTextarea}
          value={value}
          readOnly={readOnly}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          wrap="off"
          onChange={(e) => onChange(e.target.value)}
          onScroll={syncScroll}
          onKeyDown={(e) => {
            if (e.key !== "Tab" || e.shiftKey || e.metaKey || e.ctrlKey) return;
            e.preventDefault();
            insertIndent(e.currentTarget);
          }}
          aria-label="Pine script source"
          className="absolute inset-0 h-full w-full resize-none overflow-auto border-0 bg-transparent px-3 py-2 outline-none"
          style={{
            ...TEXT_STYLE,
            color: "transparent",
            caretColor: "#d1d4dc",
            whiteSpace: "pre",
            margin: 0,
          }}
        />
      </div>
    </div>
  );
}
