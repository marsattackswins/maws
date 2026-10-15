/**
 * vela-layers.ts — MAWS custom renderer layers for Vela's native renderer.
 *
 * Registered at import time (before any chart mounts). Payloads are pushed per
 * chart via `handle.renderer.setNativeData(id, data)` from the overlay owners
 * (SessionBreaks, TradeMarks) — the existing MAWS engines and feed
 * keep computing; Vela only paints. (Order blocks moved to a Vela native
 * indicator — lib/vela-native-indicators.ts.)
 */
import { registerRendererLayer } from "@/lib/charting";

// ── payload types ───────────────────────────────────────────────────────────

export type SessionBreaksData = {
  times: number[]; // epoch ms
  color: string;
  width: number;
  dash: number[];
};

export type TradeZoneBand = {
  entry: number;
  other: number;
  color: string;
};

export type TradeZonesData = {
  bands: TradeZoneBand[];
};

/** Economic-event vertical breaks — same visual language as session breaks. */
export type EventBreaksData = SessionBreaksData;

// ── painting helpers ────────────────────────────────────────────────────────

function prep(canvas: HTMLCanvasElement, dpr: number): CanvasRenderingContext2D | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

// ── layer: session breaks (vertical day separators) ─────────────────────────

registerRendererLayer({
  id: "maws-session-breaks",
  placement: "above-data",
  create: () => {
    let ctx: CanvasRenderingContext2D | null = null;
    let el: HTMLCanvasElement | null = null;
    return {
      mount(canvas: HTMLCanvasElement) {
        el = canvas;
        ctx = canvas.getContext("2d");
      },
      render({ data, coords, bounds }) {
        if (!ctx || !el) return;
        const d = data as SessionBreaksData | undefined;
        if (!d || d.times.length === 0) {
          ctx.clearRect(0, 0, el.width, el.height);
          return;
        }
        const g = prep(el, coords.dpr || 1);
        if (!g) return;
        g.strokeStyle = d.color;
        g.lineWidth = d.width;
        g.setLineDash(d.dash);
        const top = bounds.top;
        const bottom = bounds.top + bounds.height;
        for (const t of d.times) {
          const x = coords.timeToX(t);
          if (x < -1 || x > coords.width + 1) continue;
          g.beginPath();
          g.moveTo(x, top);
          g.lineTo(x, bottom);
          g.stroke();
        }
      },
      destroy() {
        ctx = null;
        el = null;
      },
    };
  },
});

// ── layer: economic-event breaks (vertical event separators) ───────────────

registerRendererLayer({
  id: "maws-events-breaks",
  placement: "above-data",
  create: () => {
    let ctx: CanvasRenderingContext2D | null = null;
    let el: HTMLCanvasElement | null = null;
    return {
      mount(canvas: HTMLCanvasElement) {
        el = canvas;
        ctx = canvas.getContext("2d");
      },
      render({ data, coords, bounds }) {
        if (!ctx || !el) return;
        const d = data as EventBreaksData | undefined;
        if (!d || d.times.length === 0) {
          ctx.clearRect(0, 0, el.width, el.height);
          return;
        }
        const g = prep(el, coords.dpr || 1);
        if (!g) return;
        g.strokeStyle = d.color;
        g.lineWidth = d.width;
        g.setLineDash(d.dash);
        const top = bounds.top;
        const bottom = bounds.top + bounds.height;
        for (const t of d.times) {
          const x = coords.timeToX(t);
          if (x < -1 || x > coords.width + 1) continue;
          g.beginPath();
          g.moveTo(x, top);
          g.lineTo(x, bottom);
          g.stroke();
        }
      },
      destroy() {
        ctx = null;
        el = null;
      },
    };
  },
});

// ── layer: risk/reward zones behind the trade lines ─────────────────────────

registerRendererLayer({
  id: "maws-trade-zones",
  placement: "below-data",
  create: () => {
    let ctx: CanvasRenderingContext2D | null = null;
    let el: HTMLCanvasElement | null = null;
    return {
      mount(canvas: HTMLCanvasElement) {
        el = canvas;
        ctx = canvas.getContext("2d");
      },
      render({ data, coords, scale, bounds }) {
        if (!ctx || !el) return;
        const d = data as TradeZonesData | undefined;
        if (!d || d.bands.length === 0) {
          ctx.clearRect(0, 0, el.width, el.height);
          return;
        }
        const g = prep(el, coords.dpr || 1);
        if (!g) return;
        g.globalAlpha = 0.1;
        for (const b of d.bands) {
          const y0 = coords.priceToY(b.entry, scale, bounds);
          const y1 = coords.priceToY(b.other, scale, bounds);
          const top = Math.max(bounds.top, Math.min(y0, y1));
          const bottom = Math.min(bounds.top + bounds.height, Math.max(y0, y1));
          if (bottom - top < 1) continue;
          g.fillStyle = b.color;
          g.fillRect(0, top, coords.width, bottom - top);
        }
        g.globalAlpha = 1;
      },
      destroy() {
        ctx = null;
        el = null;
      },
    };
  },
});
