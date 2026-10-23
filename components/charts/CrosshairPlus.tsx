"use client";

/**
 * CrosshairPlus.tsx — Vela implementation.
 *
 * Hover-state is driven by Vela's public crosshair seam (onCrosshairMove), and
 * Buy/Sell rows go through the existing MAWS dispatch layer — Vela never sees
 * broker credentials or executes orders.
 */

import { formatPrice } from "@/lib/maws/feed";
import { getChart, setLastCrosshair } from "@/lib/chart-registry";
import { useAppStore } from "@/lib/store";
import { newClientOrderId, submitOrderFromUi } from "@/lib/trading/ui-orders";
import { resolveOrderQty, resolveSymbolTrading } from "@/lib/trading/symbol-settings";
import type { ChartPaneState } from "@/types";
import { AlarmClock, ChevronsDown, ChevronsUp, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const AXIS_W = 56;
/** Estimated rendered height of the open menu (4 rows + padding) — used to keep
 *  the menu on screen: it flips above the button near the bottom edge. */
const MENU_H = 176;
/** True when `el` is the plus button or inside the open menu (both carry the
 *  marker attribute; the nearest match covers child nodes too). */
function isPlusPart(el: EventTarget | null): boolean {
  return el instanceof Element && el.closest("[data-crosshair-plus]") != null;
}

function OrderIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M2 11.5h8M2 8h5M2 4.5h11" stroke="currentColor" strokeWidth="1.2" />
      <path d="M11 3.5v6M8.5 6.5 11 3.5 13.5 6.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

/** One committed hover frame: price + the fixed-position anchor for the button. */
type PlusAnchor = {
  price: number;
  time: number | null;
  left: number;
  top: number;
};

/**
 * Owns its own hover tracking so ChartPane (and heavy siblings) do not
 * re-render on every mouse move.
 *
 * Pointer moves and Vela crosshair events both feed REFS and request one rAF
 * commit, so a fast sweep costs a single render + a single layout read per
 * frame. The earlier version committed `pointerY`, then `hover`, then measured
 * the cell in a layout effect and committed `anchor` — 3 renders and 2–3 forced
 * layouts per move, which is what made the cursor feel sticky.
 */
export function CrosshairPlus({ pane, suppress }: { pane: ChartPaneState; suppress?: boolean }) {
  const setBuySellMenu = useAppStore((s) => s.setBuySellMenu);
  const addAlert = useAppStore((s) => s.addAlert);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [plus, setPlus] = useState<PlusAnchor | null>(null);
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const overPlusRef = useRef(false);
  // Latest crosshair reading + live cursor Y (client coords) over the chart
  // element — the crosshair event carries no pixel position, so the plus button
  // tracks this instead of parking at the pane's vertical center.
  const hoverRef = useRef<{ price: number; time: number | null } | null>(null);
  const pointerYRef = useRef<number | null>(null);
  openRef.current = open;

  // Vela crosshair → hover state (rAF-throttled by Vela itself).
  useEffect(() => {
    let tries = 0;
    let timer = 0;
    let cancelled = false;
    let off: (() => void) | null = null;
    let offPointer: (() => void) | null = null;
    let frame = 0;

    const flush = () => {
      frame = 0;
      if (cancelled || openRef.current) return;
      const h = hoverRef.current;
      if (!h) {
        setPlus(null);
        return;
      }
      const handle = getChart(pane.id);
      if (!handle) return;
      const rect = handle.el.getBoundingClientRect();
      const next: PlusAnchor = {
        price: h.price,
        time: h.time,
        left: rect.right - AXIS_W - 28,
        // Ride the cursor: center the 24px button on the pointer's Y (client
        // coords — the button is position:fixed). Fall back to the pane's
        // vertical center when the crosshair moved without a pointer (keyboard).
        top: pointerYRef.current ?? rect.top + rect.height / 2 - 12,
      };
      setPlus((prev) =>
        prev &&
        prev.price === next.price &&
        prev.time === next.time &&
        prev.left === next.left &&
        prev.top === next.top
          ? prev
          : next,
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(flush);
    };

    const attach = () => {
      if (cancelled) return;
      const handle = getChart(pane.id);
      if (!handle) {
        if (tries++ < 120) timer = window.setTimeout(attach, 250);
        return;
      }
      const el = handle.el;
      // Chromium boundary order: leave(current) fires BEFORE enter(next), and
      // React's synthetic enter lands even later — so when the pointer crosses
      // INTO the plus button or its open menu, flip the guard here first, or
      // Vela's canvas-leave crosshair-clear (price == null) runs before the
      // enter had a chance to set it and hover dies mid-crossing.
      const onDocLeaveCapture = (ev: Event): void => {
        if (ev instanceof PointerEvent && isPlusPart(ev.relatedTarget)) {
          overPlusRef.current = true;
        }
      };
      document.addEventListener("pointerleave", onDocLeaveCapture, true);
      const onPointerMove = (ev: PointerEvent) => {
        // Menu open: freeze — the button (and its open menu) must not follow the cursor.
        if (openRef.current) return;
        if (pointerYRef.current === ev.clientY) return;
        pointerYRef.current = ev.clientY;
        schedule();
      };
      const onPointerLeave = (ev: PointerEvent) => {
        // Moving onto the plus button/menu itself leaves the chart element
        // (both are body portals, so this fires on every approach). The
        // button's enter handler races this leave event — it runs AFTER it —
        // so `overPlusRef` is still false here and must not be trusted.
        // Test where the pointer is GOING instead: keep the last Y when it is
        // entering plus chrome so the button (and open menu) does not jump.
        if (ev.relatedTarget && isPlusPart(ev.relatedTarget)) return;
        pointerYRef.current = null;
        schedule();
      };
      el.addEventListener("pointermove", onPointerMove);
      el.addEventListener("pointerleave", onPointerLeave);
      off = handle.vela.renderer.onCrosshairMove((e) => {
        if (openRef.current) return;
        if (e.price == null) {
          if (!overPlusRef.current) {
            hoverRef.current = null;
            schedule();
          }
          return;
        }
        hoverRef.current = {
          price: e.price,
          time: e.time != null ? Math.floor(e.time / 1000) : null,
        };
        schedule();
        // Crosshair SYNC across cells is the workspace's own link (toggled in the
        // layout picker) — no per-cell mirror here.
        setLastCrosshair({ paneId: pane.id, price: e.price, time: e.time ?? null });
      });
      offPointer = () => {
        el.removeEventListener("pointermove", onPointerMove);
        el.removeEventListener("pointerleave", onPointerLeave);
        document.removeEventListener("pointerleave", onDocLeaveCapture, true);
      };
    };

    attach();
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
      if (frame) cancelAnimationFrame(frame);
      hoverRef.current = null;
      off?.();
      offPointer?.();
    };
  }, [pane.id]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!(e.target instanceof Node)) return;
      if (wrapRef.current?.contains(e.target)) return;
      const t = e.target as HTMLElement | null;
      if (t?.closest?.("[data-crosshair-plus]")) return;
      setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [open]);

  if (!plus || suppress) return null;

  const price = formatPrice(pane.symbol, plus.price);
  const side: "above" | "below" = "above";
  // Order type follows the ONE trading-settings home (Settings → Trading →
  // Defaults → Order type); a saved per-symbol override still wins.
  const orderType = resolveSymbolTrading(pane.symbol).defaultOrderType;
  // Menu opens 28px below the button, flipping ABOVE it when that would
  // overflow the window's bottom edge (the old fixed offset parked the menu
  // past the chart whenever the button was pressed near the bottom).
  const menuLeft = Math.max(8, plus.left - 200);
  const menuBelow = plus.top + 28 + MENU_H <= window.innerHeight - 8;
  const menuTop = menuBelow ? plus.top + 28 : Math.max(8, plus.top - MENU_H - 8);

  return createPortal(
    <>
      <button
        type="button"
        data-crosshair-plus
        className="fixed z-[35] flex h-6 w-6 items-center justify-center rounded-[4px] border border-(--app-border) bg-(--app-elevated) text-(--app-text) shadow-[0_2px_8px_rgba(0,0,0,0.45)] hover:bg-(--app-hover)"
        style={{ left: plus.left, top: plus.top }}
        onMouseEnter={() => {
          overPlusRef.current = true;
        }}
        onMouseLeave={() => {
          overPlusRef.current = false;
        }}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        <Plus size={14} />
      </button>
      {open && (
        <div
          ref={wrapRef}
          data-crosshair-plus
          className="fixed z-[80] w-[220px] rounded-[8px] border border-(--app-border) bg-(--app-elevated) py-1 shadow-[0_8px_28px_rgba(0,0,0,0.65)]"
          style={{ left: menuLeft, top: menuTop }}
          onMouseDown={(e) => e.stopPropagation()}
          onMouseEnter={() => {
            overPlusRef.current = true;
          }}
          onMouseLeave={() => {
            overPlusRef.current = false;
          }}
        >
          <button
            type="button"
            className="plus-row"
            onClick={() => {
              const qty = resolveOrderQty(pane.symbol, plus.price);
              if (qty > 0) {
                submitOrderFromUi({
                  symbol: pane.symbol,
                  side: "buy",
                  type: orderType,
                  qty,
                  price: plus.price,
                  clientOrderId: newClientOrderId(),
                });
              }
              setOpen(false);
            }}
          >
            <ChevronsUp size={14} className="text-[#089981]" />
            <span className="plus-row-label">Buy {price}</span>
          </button>
          <button
            type="button"
            className="plus-row"
            onClick={() => {
              const qty = resolveOrderQty(pane.symbol, plus.price);
              if (qty > 0) {
                submitOrderFromUi({
                  symbol: pane.symbol,
                  side: "sell",
                  type: orderType,
                  qty,
                  price: plus.price,
                  clientOrderId: newClientOrderId(),
                });
              }
              setOpen(false);
            }}
          >
            <ChevronsDown size={14} className="text-[#f23645]" />
            <span className="plus-row-label">Sell {price}</span>
          </button>
          <button
            type="button"
            className="plus-row"
            onClick={() => {
              setBuySellMenu({ x: plus.left, y: plus.top, symbol: pane.symbol });
              setOpen(false);
            }}
          >
            <OrderIcon />
            <span className="plus-row-label">Trade…</span>
          </button>
          <button
            type="button"
            className="plus-row"
            onClick={() => {
              addAlert({ symbol: pane.symbol, price: plus.price, side, enabled: true });
              setOpen(false);
            }}
          >
            <AlarmClock size={14} />
            <span className="plus-row-label">Add alert at {price}</span>
          </button>
        </div>
      )}
    </>,
    document.body,
  );
}
