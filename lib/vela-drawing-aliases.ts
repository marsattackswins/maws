import {
    DEFAULT_DRAWING_COLOR,
    PositionTool,
    registerDrawingType,
    type Projector,
} from '@/lib/charting/core/drawings';
import { svg24 } from '@/lib/charting/core/icons';

/**
 * Dedicated Long/Short toolbar buttons over the one geometric PositionTool: the alias
 * classes pin the direction at placement (dragging against it flips the box, preserving
 * distances and R:R via the `direction` setter). Everything else — painting, hit-testing,
 * the gear settings — dispatches on `instanceof PositionTool`, so the subclasses get it
 * all for free. Registering is idempotent (the registry Map replaces), so importing this
 * module from both the toolbar and the overlay bridge is safe under HMR.
 */

export class LongPosition extends PositionTool {
    readonly type = 'longposition' as const;

    override onPlaced(proj: Projector): void {
        super.onPlaced(proj);
        if (this.direction !== 'long') this.direction = 'long';
    }
}

export class ShortPosition extends PositionTool {
    readonly type = 'shortposition' as const;

    override onPlaced(proj: Projector): void {
        super.onPlaced(proj);
        if (this.direction !== 'short') this.direction = 'short';
    }
}

// Entry (heavy), target (above, thin) and stop (below, thin) price lines with an L/S
// letter in the profit gap — the letter carries the direction, the lines carry the shape.
const LINES =
    '<circle cx="4" cy="5" r="2" stroke-width="1.2"/>' +
    '<line x1="7" y1="5" x2="20" y2="5" stroke-width="1.2"/>' +
    '<line x1="2.5" y1="12" x2="20.5" y2="12" stroke-width="2.4"/>' +
    '<circle cx="4" cy="19" r="2" stroke-width="1.2"/>' +
    '<line x1="7" y1="19" x2="20" y2="19" stroke-width="1.2"/>';

const LETTER = (ch: string, y: number) =>
    `<text x="11" y="${y}" font-size="7.5" font-weight="600" text-anchor="middle" fill="currentColor" stroke="none">${ch}</text>`;

registerDrawingType({
    type: 'longposition',
    group: 'measure',
    label: 'Long Position',
    icon: svg24(LINES + LETTER('L', 10)),
    defaultStyle: { lineColor: DEFAULT_DRAWING_COLOR, lineWidth: 1, lineStyle: 'solid' },
    create: (init) => new LongPosition(init),
});

registerDrawingType({
    type: 'shortposition',
    group: 'measure',
    label: 'Short Position',
    icon: svg24(LINES + LETTER('S', 17.5)),
    defaultStyle: { lineColor: DEFAULT_DRAWING_COLOR, lineWidth: 1, lineStyle: 'solid' },
    create: (init) => new ShortPosition(init),
});
