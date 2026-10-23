// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DARK_THEME } from '../core/theme';
import { PaneControls, type PaneControlView } from '../renderers/native/chrome/PaneControls';

const panes: PaneControlView[] = [
    { id: 'price', kind: 'price', collapsed: false, maximized: false, top: 0, height: 300, index: 0, count: 2 },
    { id: 'study', kind: 'study', collapsed: false, maximized: false, top: 300, height: 100, index: 1, count: 2 },
];

afterEach(() => {
    document.getElementById('vela-pane-controls')?.remove();
});

describe('PaneControls', () => {
    it('leaves the main price pane maximize action to the workspace', () => {
        const plot = document.createElement('div');
        const controls = new PaneControls(plot, DARK_THEME, {
            panes: () => panes,
            rightAxis: () => 0,
            onMove: () => {},
            onToggleCollapse: () => {},
            onToggleMaximize: vi.fn(),
        });

        controls.setHoverPane('price');

        expect(plot.firstElementChild?.children[0]?.querySelector('[data-role="maximize"]')).toBeNull();
        controls.destroy();
    });

    it('keeps maximize controls for study panes', () => {
        const onToggleMaximize = vi.fn();
        const plot = document.createElement('div');
        const controls = new PaneControls(plot, DARK_THEME, {
            panes: () => panes,
            rightAxis: () => 0,
            onMove: () => {},
            onToggleCollapse: () => {},
            onToggleMaximize,
        });

        controls.setHoverPane('study');
        plot.querySelector<HTMLButtonElement>('[data-role="maximize"]')?.click();

        expect(onToggleMaximize).toHaveBeenCalledWith('study');
        controls.destroy();
    });
});
