"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { createPortal } from "react-dom";

/** Match settings panel chrome (`settingsUi`). */
const popoverShell =
  "overflow-hidden rounded-[8px] border border-[#2a2e39] bg-[#1b1b1b] shadow-[0_8px_28px_rgba(0,0,0,0.65)]";
const divider = "h-px bg-[#2a2e39]";
const labelClass = "text-[12px] text-[#787b86]";
const inputClass =
  "h-7 min-w-0 rounded-[4px] border border-[#363a45] bg-[#1a1a1a] px-2 text-[12px] text-[#d1d4dc] outline-none focus:border-[#787b86]";
const primaryBtnClass =
  "h-7 shrink-0 rounded-[4px] bg-white px-2.5 text-[12px] font-semibold text-black hover:bg-[#e0e3eb]";

const CUSTOM_KEY = "maws.custom-colors.v1";
const MAX_CUSTOM = 17;

/** Marker for outside-click handlers on settings panels. */
export const COLOR_PICKER_POPOVER_ATTR = "data-color-picker-popover";

/** TradingView-like preset grid (10 × 8). */
export const COLOR_PRESETS: string[][] = [
  ["#ffffff", "#e0e3eb", "#b2b5be", "#9598a1", "#787b86", "#5d606b", "#434651", "#2a2e39", "#131722", "#000000"],
  ["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50"],
  ["#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", "#795548", "#607d8b", "#f48fb1", "#ce93d8"],
  ["#ef5350", "#ec407a", "#ab47bc", "#7e57c2", "#5c6bc0", "#42a5f5", "#29b6f6", "#26c6da", "#26a69a", "#66bb6a"],
  ["#9ccc65", "#d4e157", "#ffee58", "#ffca28", "#ffa726", "#ff7043", "#8d6e63", "#78909c", "#f06292", "#ba68c8"],
  ["#e57373", "#f06292", "#ba68c8", "#9575cd", "#7986cb", "#64b5f6", "#4fc3f7", "#4dd0e1", "#4db6ac", "#81c784"],
  ["#aed581", "#dce775", "#fff176", "#ffd54f", "#ffb74d", "#ff8a65", "#a1887f", "#90a4ae", "#f48fb1", "#ce93d8"],
  ["#ef9a9a", "#f48fb1", "#ce93d8", "#b39ddb", "#9fa8da", "#90caf9", "#81d4fa", "#80deea", "#80cbc4", "#a5d6a7"],
];

type Hsva = { h: number; s: number; v: number; a: number };

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function normalizeHex(input: string): string | null {
  let s = input.trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{3}$/.test(s)) {
    s = s
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (!/^[0-9a-fA-F]{6}$/.test(s)) return null;
  return `#${s.toLowerCase()}`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const n = normalizeHex(hex);
  if (!n) return null;
  return {
    r: parseInt(n.slice(1, 3), 16),
    g: parseInt(n.slice(3, 5), 16),
    b: parseInt(n.slice(5, 7), 16),
  };
}

function rgbToHex(r: number, g: number, b: number) {
  const to = (n: number) =>
    clamp(Math.round(n), 0, 255)
      .toString(16)
      .padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

function rgbToHsva(r: number, g: number, b: number, a: number): Hsva {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const s = max === 0 ? 0 : d / max;
  return { h, s: s * 100, v: max * 100, a };
}

function hsvaToRgb(h: number, s: number, v: number) {
  s /= 100;
  v /= 100;
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let rp = 0;
  let gp = 0;
  let bp = 0;
  if (h < 60) [rp, gp, bp] = [c, x, 0];
  else if (h < 120) [rp, gp, bp] = [x, c, 0];
  else if (h < 180) [rp, gp, bp] = [0, c, x];
  else if (h < 240) [rp, gp, bp] = [0, x, c];
  else if (h < 300) [rp, gp, bp] = [x, 0, c];
  else [rp, gp, bp] = [c, 0, x];
  return {
    r: (rp + m) * 255,
    g: (gp + m) * 255,
    b: (bp + m) * 255,
  };
}

function hsvaToHex(hsva: Hsva) {
  const { r, g, b } = hsvaToRgb(hsva.h, hsva.s, hsva.v);
  return rgbToHex(r, g, b);
}

/** Parse any css color into hex + 0–100 opacity. */
export function parseColorValue(
  value: string | undefined,
  opacityFallback = 100,
): { hex: string; opacity: number } {
  if (!value) return { hex: "#787b86", opacity: opacityFallback };
  const trimmed = value.trim();
  const rgba =
    trimmed.match(
      /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i,
    ) ?? null;
  if (rgba) {
    const r = Number(rgba[1]);
    const g = Number(rgba[2]);
    const b = Number(rgba[3]);
    const a = rgba[4] != null ? Number(rgba[4]) : 1;
    return {
      hex: rgbToHex(r, g, b),
      opacity: clamp(Math.round(a * 100), 0, 100),
    };
  }
  const hex = normalizeHex(trimmed);
  if (hex) return { hex, opacity: opacityFallback };
  return { hex: "#787b86", opacity: opacityFallback };
}

function loadCustomColors(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CUSTOM_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((c) => (typeof c === "string" ? normalizeHex(c) : null))
      .filter((c): c is string => Boolean(c))
      .slice(0, MAX_CUSTOM);
  } catch {
    return [];
  }
}

function saveCustomColors(colors: string[]) {
  try {
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(colors.slice(0, MAX_CUSTOM)));
  } catch {
    /* ignore */
  }
}

function checkerStyle(color: string): CSSProperties {
  return {
    backgroundImage: `
      linear-gradient(${color}, ${color}),
      linear-gradient(45deg, #2a2e39 25%, transparent 25%),
      linear-gradient(-45deg, #2a2e39 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #2a2e39 75%),
      linear-gradient(-45deg, transparent 75%, #2a2e39 75%)
    `,
    backgroundSize: "100% 100%, 8px 8px, 8px 8px, 8px 8px, 8px 8px",
    backgroundPosition: "0 0, 0 0, 0 4px, 4px -4px, -4px 0",
  };
}

function SwatchButton({
  color,
  selected,
  onClick,
  title,
}: {
  color: string;
  selected?: boolean;
  onClick: () => void;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title ?? color}
      onClick={onClick}
      className={`aspect-square w-full rounded-[2px] border ${
        selected ? "border-white ring-1 ring-[#2a2e39]" : "border-[#1b1b1b] hover:border-[#787b86]"
      }`}
      style={{ backgroundColor: color }}
    />
  );
}

function CustomColorEditor({
  initialHex,
  onAdd,
  onClose,
}: {
  initialHex: string;
  onAdd: (hex: string) => void;
  onClose: () => void;
}) {
  const rgb0 = hexToRgb(initialHex) ?? { r: 41, g: 98, b: 255 };
  const [hsva, setHsva] = useState<Hsva>(() => rgbToHsva(rgb0.r, rgb0.g, rgb0.b, 1));
  const [hexText, setHexText] = useState(() => hsvaToHex(hsva).toUpperCase());
  const svRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const hsvaRef = useRef(hsva);
  hsvaRef.current = hsva;

  const syncHex = (next: Hsva) => {
    setHsva(next);
    setHexText(hsvaToHex(next).toUpperCase());
  };

  const applyHexText = (raw: string) => {
    setHexText(raw);
    const n = normalizeHex(raw);
    if (!n) return;
    const rgb = hexToRgb(n);
    if (!rgb) return;
    syncHex(rgbToHsva(rgb.r, rgb.g, rgb.b, hsvaRef.current.a));
  };

  const pickSv = (clientX: number, clientY: number) => {
    const el = svRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const s = clamp(((clientX - rect.left) / rect.width) * 100, 0, 100);
    const v = clamp(100 - ((clientY - rect.top) / rect.height) * 100, 0, 100);
    syncHex({ ...hsvaRef.current, s, v });
  };

  const pickHue = (clientY: number) => {
    const el = hueRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const h = clamp(((clientY - rect.top) / rect.height) * 360, 0, 359.99);
    syncHex({ ...hsvaRef.current, h });
  };

  const bindDrag = (move: (e: PointerEvent) => void, e: ReactPointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    move(e.nativeEvent);
    const onMove = (ev: PointerEvent) => move(ev);
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const pure = hsvaToHex({ ...hsva, s: 100, v: 100 });
  const current = hsvaToHex(hsva);

  return (
    <div className={`box-border w-[228px] p-2.5 ${popoverShell}`}>
      <div className="mb-2.5 flex items-center gap-1.5">
        <div
          className="h-7 w-7 shrink-0 rounded-[4px] border border-[#363a45]"
          style={{ backgroundColor: current }}
        />
        <input
          className={`${inputClass} flex-1 focus:border-white`}
          value={hexText}
          onChange={(e) => applyHexText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const n = normalizeHex(hexText);
              if (n) onAdd(n);
            } else if (e.key === "Escape") onClose();
          }}
          spellCheck={false}
        />
        <button
          type="button"
          className={primaryBtnClass}
          onClick={() => onAdd(normalizeHex(hexText) ?? current)}
        >
          Add
        </button>
      </div>

      <div className="flex gap-2">
        <div
          ref={svRef}
          className="relative h-[148px] min-w-0 flex-1 cursor-crosshair rounded-[4px] border border-[#2a2e39]"
          style={{
            background: `
              linear-gradient(to top, #000, transparent),
              linear-gradient(to right, #fff, ${pure})
            `,
          }}
          onPointerDown={(e) => bindDrag((ev) => pickSv(ev.clientX, ev.clientY), e)}
        >
          <div
            className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.45)]"
            style={{ left: `${hsva.s}%`, top: `${100 - hsva.v}%` }}
          />
        </div>
        <div
          ref={hueRef}
          className="relative h-[148px] w-3.5 shrink-0 cursor-ns-resize rounded-[4px] border border-[#2a2e39]"
          style={{
            background:
              "linear-gradient(to bottom, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)",
          }}
          onPointerDown={(e) => bindDrag((ev) => pickHue(ev.clientY), e)}
        >
          <div
            className="pointer-events-none absolute left-1/2 h-2.5 w-[18px] -translate-x-1/2 -translate-y-1/2 rounded-[2px] border-2 border-white bg-transparent shadow-[0_0_0_1px_rgba(0,0,0,0.45)]"
            style={{ top: `${(hsva.h / 360) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export function SettingsColorSwatch({
  value,
  onChange,
  opacity: opacityProp,
  onOpacityChange,
  showOpacity = true,
  disabled,
}: {
  value?: string;
  onChange: (v: string) => void;
  /** 0–100. When omitted, opacity is read from rgba() in `value` (or 100). */
  opacity?: number;
  onOpacityChange?: (v: number) => void;
  /** Show opacity slider (default true). */
  showOpacity?: boolean;
  disabled?: boolean;
}) {
  const parsed = parseColorValue(value, opacityProp ?? 100);
  const hex = parsed.hex;
  const opacity = opacityProp ?? parsed.opacity;

  const [open, setOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [customColors, setCustomColors] = useState<string[]>([]);
  const [pos, setPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCustomColors(loadCustomColors());
  }, []);

  const place = useCallback(() => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const pad = 8;
    const width = customOpen ? 240 : 212;
    const height = customOpen ? 220 : showOpacity ? 290 : 236;
    let left = rect.left;
    let top = rect.bottom + 6;
    if (left + width > window.innerWidth - pad) left = window.innerWidth - width - pad;
    if (left < pad) left = pad;
    if (top + height > window.innerHeight - pad) {
      top = Math.max(pad, rect.top - height - 6);
    }
    setPos({ top, left });
  }, [customOpen, showOpacity]);

  useLayoutEffect(() => {
    if (!open) return;
    place();
  }, [open, place]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (btnRef.current?.contains(t)) return;
      if (popRef.current?.contains(t)) return;
      setOpen(false);
      setCustomOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (customOpen) setCustomOpen(false);
        else setOpen(false);
      }
    };
    const onScroll = () => place();
    // Capture phase so it still fires when settings panels stopPropagation on bubble.
    window.addEventListener("mousedown", onDown, true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onScroll);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      window.removeEventListener("mousedown", onDown, true);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open, customOpen, place]);

  const emitColor = (nextHex: string) => {
    onChange(nextHex);
  };

  const emitOpacity = (next: number) => {
    const o = clamp(Math.round(next), 0, 100);
    if (onOpacityChange) {
      onOpacityChange(o);
      return;
    }
    const rgb = hexToRgb(hex);
    if (!rgb) return;
    if (o >= 100) onChange(hex);
    else onChange(`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${(o / 100).toFixed(2)})`);
  };

  const addCustom = (nextHex: string) => {
    const n = normalizeHex(nextHex);
    if (!n) return;
    setCustomColors((prev) => {
      const next = [n, ...prev.filter((c) => c !== n)].slice(0, MAX_CUSTOM);
      saveCustomColors(next);
      return next;
    });
    emitColor(n);
    setCustomOpen(false);
  };

  const preview =
    opacity >= 100
      ? hex
      : (() => {
          const rgb = hexToRgb(hex);
          if (!rgb) return hex;
          return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity / 100})`;
        })();

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        disabled={disabled}
        title={hex}
        aria-expanded={open}
        onClick={() => {
          if (disabled) return;
          setOpen((v) => !v);
          setCustomOpen(false);
        }}
        className={`h-7 w-7 shrink-0 rounded-[4px] border ${
          open ? "border-white" : "border-[#363a45]"
        } ${disabled ? "pointer-events-none opacity-40" : "hover:border-[#787b86]"}`}
        style={checkerStyle(preview)}
      />

      {open && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={popRef}
              data-color-picker-popover=""
              className="fixed z-[200]"
              style={{ top: pos.top, left: pos.left }}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              {customOpen ? (
                <CustomColorEditor
                  initialHex={hex}
                  onAdd={addCustom}
                  onClose={() => setCustomOpen(false)}
                />
              ) : (
                <div className={`box-border w-[200px] p-2.5 ${popoverShell}`}>
                  <div className="grid grid-cols-10 gap-[2px]">
                    {COLOR_PRESETS.flatMap((row, ri) =>
                      row.map((c, ci) => (
                        <SwatchButton
                          key={`${ri}-${ci}-${c}`}
                          color={c}
                          selected={normalizeHex(hex) === normalizeHex(c)}
                          onClick={() => emitColor(c)}
                        />
                      )),
                    )}
                  </div>

                  <div className={`my-2.5 ${divider}`} />

                  <div className="grid grid-cols-10 gap-[2px]">
                    {customColors.map((c) => (
                      <SwatchButton
                        key={c}
                        color={c}
                        selected={normalizeHex(hex) === normalizeHex(c)}
                        onClick={() => emitColor(c)}
                      />
                    ))}
                    <button
                      type="button"
                      title="Add custom color"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setCustomOpen(true);
                      }}
                      className="flex aspect-square w-full items-center justify-center rounded-[2px] border border-[#363a45] bg-[#1a1a1a] text-[13px] leading-none text-[#d1d4dc] hover:border-[#787b86] hover:bg-[#2a2e39] hover:text-white"
                    >
                      +
                    </button>
                  </div>

                  {showOpacity ? (
                    <div className="mt-3">
                      <div className={`mb-1.5 ${labelClass}`}>Opacity</div>
                      <div className="flex items-center gap-2">
                        <div className="relative h-2 min-w-0 flex-1 overflow-hidden rounded-full border border-[#2a2e39]">
                          <div
                            className="absolute inset-0 rounded-full"
                            style={{
                              backgroundImage: `
                                linear-gradient(to right, transparent, ${hex}),
                                linear-gradient(45deg, #2a2e39 25%, transparent 25%),
                                linear-gradient(-45deg, #2a2e39 25%, transparent 25%),
                                linear-gradient(45deg, transparent 75%, #2a2e39 75%),
                                linear-gradient(-45deg, transparent 75%, #2a2e39 75%)
                              `,
                              backgroundSize: "100% 100%, 6px 6px, 6px 6px, 6px 6px, 6px 6px",
                              backgroundPosition: "0 0, 0 0, 0 3px, 3px -3px, -3px 0",
                            }}
                          />
                          <input
                            type="range"
                            min={0}
                            max={100}
                            value={opacity}
                            onChange={(e) => emitOpacity(Number(e.target.value))}
                            className="absolute inset-0 w-full cursor-pointer appearance-none bg-transparent accent-white [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-[#2a2e39] [&::-webkit-slider-thumb]:bg-white"
                          />
                        </div>
                        <input
                          className={`${inputClass} w-[52px] shrink-0 px-1 text-center`}
                          value={`${opacity}%`}
                          onChange={(e) => {
                            const n = Number(e.target.value.replace(/%/g, ""));
                            if (Number.isFinite(n)) emitOpacity(n);
                          }}
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
