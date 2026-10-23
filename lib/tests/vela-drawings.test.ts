/**
 * Unit tests for the MAWS ↔ Vela drawings bridge (lib/vela-drawings.ts).
 *
 * These cover the rules that keep a deleted drawing from coming back:
 *  - the store is the only persisted owner (the cell document is stripped),
 *  - Vela's LIVE set is the truth for what exists (an undo emits no events),
 *  - store ids are preserved for anything that can be paired with a live drawing,
 *  - the duplicate entries the old echo bug wrote still collapse.
 */
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import type { Drawing } from '../../types';
import type { SerializedDrawing } from '../../lib/charting';
import { registerChart, unregisterChart } from '../../lib/chart-registry';
import { useAppStore } from '../../lib/store';
import {
  clearDrawingMapping,
  collapseDrawingDuplicates,
  drawingToolFromVela,
  drawingMatchesDoc,
  drawingMapping,
  storeDrawingFromDoc,
  syncPaneDrawingsFromVela,
  withoutDrawingsDoc,
} from '../../lib/vela-drawings';

const PANE = 'pane-0';

describe('drawingToolFromVela', () => {
  it('keeps the generic position tool armed instead of converting it to long', () => {
    expect(drawingToolFromVela('position')).toBe('position');
    expect(drawingToolFromVela('longposition')).toBe('long');
    expect(drawingToolFromVela(null)).toBe('cursor');
  });
});

/** A Vela document entry as `drawings.all()` reports it. */
function doc(over: Partial<SerializedDrawing> = {}): SerializedDrawing {
  return {
    id: 'dw-1',
    type: 'hray',
    paneId: 'price',
    anchors: [{ time: 1_792_130_460_000, price: 81_234.5 }],
    style: { lineColor: '#758696', lineWidth: 1, lineStyle: 'solid' },
    ...over,
  } as SerializedDrawing;
}

function mawsDrawing(over: Partial<Drawing> = {}): Drawing {
  return {
    id: 'm1',
    tool: 'hray',
    points: [{ time: 1_792_130_460, price: 81_234.5 }],
    color: '#758696',
    ...over,
  };
}

/** Register a pane whose Vela drawings are exactly `docs`. */
function fakeChart(docs: SerializedDrawing[]): void {
  registerChart(PANE, {
    vela: { drawings: { all: () => docs } },
    renderer: {},
    el: {},
  } as never);
}

function paneDrawings(): Drawing[] {
  return useAppStore.getState().panes.find((p) => p.id === PANE)?.drawings ?? [];
}

function setPaneDrawings(drawings: Drawing[]): void {
  useAppStore.getState().setPaneDrawings(PANE, drawings);
}

beforeEach(() => {
  clearDrawingMapping(PANE);
  setPaneDrawings([]);
});

afterEach(() => {
  unregisterChart(PANE);
  clearDrawingMapping(PANE);
  setPaneDrawings([]);
});

describe('storeDrawingFromDoc', () => {
  it('maps a document entry onto a MAWS drawing (seconds, style defaults)', () => {
    expect(storeDrawingFromDoc(doc())).toEqual({
      id: 'dw-1',
      tool: 'hray',
      points: [{ time: 1_792_130_460, price: 81_234.5 }],
      color: '#758696',
      lineWidth: 1,
      lineStyle: 'solid',
    });
  });

  it('ignores types MAWS has no tool for', () => {
    expect(storeDrawingFromDoc(doc({ type: 'regressionchannel' as never }))).toBeNull();
  });
});

describe('drawingMatchesDoc', () => {
  it('pairs on type, anchors, colour and style', () => {
    expect(drawingMatchesDoc(mawsDrawing(), doc())).toBe(true);
    expect(drawingMatchesDoc(mawsDrawing({ tool: 'trend' }), doc())).toBe(false);
    expect(
      drawingMatchesDoc(mawsDrawing({ points: [{ time: 1, price: 81_234.5 }] }), doc()),
    ).toBe(false);
    expect(
      drawingMatchesDoc(mawsDrawing(), doc({ style: { lineColor: '#f23645', lineWidth: 1, lineStyle: 'solid' } })),
    ).toBe(false);
  });

  it('tolerates the float dust anchors pick up on the way through', () => {
    const drifting = doc({ anchors: [{ time: 1_792_130_460_000, price: 81_234.500000001 }] });
    expect(drawingMatchesDoc(mawsDrawing(), drifting)).toBe(true);
  });
});

describe('collapseDrawingDuplicates', () => {
  it('collapses the echo pair the double-owner bug wrote (style drift included)', () => {
    // Same place, same colour — the echoed entry kept Vela's own last-used width.
    const source = mawsDrawing({ id: 'xjy8afnf', lineWidth: 2 });
    const echo = mawsDrawing({ id: 'dw-2', lineWidth: 1 });
    expect(collapseDrawingDuplicates([source, echo])).toEqual([source]);
  });

  it('keeps drawings that differ in place, tool or colour', () => {
    const a = mawsDrawing();
    const b = mawsDrawing({ id: 'b', color: '#f23645' });
    const c = mawsDrawing({ id: 'c', tool: 'trend' });
    const d = mawsDrawing({ id: 'd', points: [{ time: 1, price: 1 }] });
    expect(collapseDrawingDuplicates([a, b, c, d])).toBeNull();
  });
});

describe('withoutDrawingsDoc', () => {
  it('strips the drawings document and leaves every other key alone', () => {
    const stripped = withoutDrawingsDoc({
      symbol: 'BTCUSDT',
      drawings: { drawings: [{ id: 'dw-1' }], version: 1 },
      rendererConfig: { theme: 'dark' },
    });
    expect(stripped).toEqual({ symbol: 'BTCUSDT', rendererConfig: { theme: 'dark' } });
    expect('drawings' in (stripped as object)).toBe(false);
  });

  it('returns the very same doc when it carries no drawings', () => {
    const untouched = { symbol: 'BTCUSDT' };
    expect(withoutDrawingsDoc(untouched)).toBe(untouched);
    expect(withoutDrawingsDoc(undefined)).toBeUndefined();
  });
});

describe('syncPaneDrawingsFromVela (real store)', () => {
  it('drops an entry whose live drawing is gone — the silent undo case', () => {
    fakeChart([doc()]);
    setPaneDrawings([mawsDrawing({ id: 'dw-1' })]);
    drawingMapping(PANE).set('dw-1', 'dw-1');

    // The unified timeline replaces the document INSIDE the controller: no
    // drawing events, so only the settle can notice the drawing is gone.
    registerChart(PANE, { vela: { drawings: { all: () => [] } }, renderer: {}, el: {} } as never);
    syncPaneDrawingsFromVela(PANE);

    expect(paneDrawings()).toEqual([]);
  });

  it('adopts a live drawing by geometry, keeping the store id', () => {
    fakeChart([doc({ id: 'dw-9' })]);
    setPaneDrawings([mawsDrawing({ id: 'm1' })]);

    syncPaneDrawingsFromVela(PANE);

    expect(paneDrawings().map((d) => d.id)).toEqual(['m1']);
    expect(drawingMapping(PANE).get('m1')).toBe('dw-9');
  });

  it('adds a live drawing the store never saw (Vela-born)', () => {
    fakeChart([doc({ id: 'dw-4' })]);
    syncPaneDrawingsFromVela(PANE);
    expect(paneDrawings().map((d) => d.id)).toEqual(['dw-4']);
  });

  it('keeps an entry Vela has never seen — a creation still in flight', () => {
    fakeChart([]);
    setPaneDrawings([mawsDrawing({ id: 'pending' })]);

    syncPaneDrawingsFromVela(PANE);

    expect(paneDrawings().map((d) => d.id)).toEqual(['pending']);
  });

  it('leaves the slice untouched when both sides already agree', () => {
    fakeChart([doc({ id: 'm1' })]);
    setPaneDrawings([mawsDrawing({ id: 'm1' })]);
    const before = useAppStore.getState().panes;

    syncPaneDrawingsFromVela(PANE);

    expect(useAppStore.getState().panes).toBe(before);
  });

  it('does nothing without a live chart handle', () => {
    setPaneDrawings([mawsDrawing({ id: 'm1' })]);
    syncPaneDrawingsFromVela(PANE); // no registerChart call
    expect(paneDrawings().map((d) => d.id)).toEqual(['m1']);
  });
});
