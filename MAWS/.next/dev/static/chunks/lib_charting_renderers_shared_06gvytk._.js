(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/charting/renderers/shared/DrawingSceneRenderer.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DrawingSceneRenderer",
    ()=>DrawingSceneRenderer,
    "EMPTY_DRAWING_SET",
    ()=>EMPTY_DRAWING_SET,
    "drawingSetEmpty",
    ()=>drawingSetEmpty,
    "modelDrawingSet",
    ()=>modelDrawingSet
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$renderers$2f$shared$2f$drawing$2d$geometry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/renderers/shared/drawing-geometry.ts [app-client] (ecmascript)");
;
const EMPTY_DRAWING_SET = {
    lines: [],
    boxes: [],
    labels: [],
    polylines: [],
    linefills: []
};
function modelDrawingSet(m, overlay) {
    const want = (d)=>Boolean(d.overlay) === overlay;
    return {
        lines: (m.lines ?? []).filter(want),
        boxes: (m.boxes ?? []).filter(want),
        labels: (m.labels ?? []).filter(want),
        polylines: (m.polylines ?? []).filter(want),
        linefills: (m.linefills ?? []).filter(want)
    };
}
function drawingSetEmpty(s) {
    return !s.lines.length && !s.boxes.length && !s.labels.length && !s.polylines.length && !s.linefills.length;
}
function fontSizePx(size) {
    return size === 'auto' ? 12 : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$renderers$2f$shared$2f$drawing$2d$geometry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["namedFontSize"])(size);
}
/**
 * Whether any painted part of a line — anchor segment plus its `extend`
 * projection — crosses the visible bar window `[lo, hi]` (logical x). A vertical
 * line (x1 == x2) extends along itself, so extend adds no horizontal coverage.
 */ function lineCoversWindow(a, b, extend, lo, hi) {
    const minX = Math.min(a, b);
    const maxX = Math.max(a, b);
    if (a === b) return a >= lo && a <= hi;
    if (extend === 'both') return true;
    if (extend === 'left') return maxX >= lo;
    if (extend === 'right') return minX <= hi;
    return maxX >= lo && minX <= hi;
}
class DrawingSceneRenderer {
    deps;
    set;
    /** measureText width cache, keyed by `${font} ${text}`, persists across frames. */ widthCache;
    /** Tooltip hit-rects captured while drawing the CURRENT set (rebuilt per render). */ tipRegions;
    /**
     * Index offset of the CURRENT set's model: its `xloc:'bar_index'` coordinates count
     * from the model's anchor bar, so they shift by this to land on chart logical indices.
     * 0 (the norm) for whole-chart models; set alongside `setSet` when rendering a model
     * computed over a suffix of the bars. `bar_time` coordinates are unaffected.
     */ indexOffset;
    constructor(deps, set = EMPTY_DRAWING_SET){
        this.deps = deps;
        this.set = set;
        this.widthCache = new Map();
        this.tipRegions = [];
        this.indexOffset = 0;
    }
    setSet(set, indexOffset = 0) {
        this.set = set;
        this.indexOffset = indexOffset;
    }
    /** Refresh the coordinate/theme resolvers (the native backend rebinds per frame). */ setDeps(deps) {
        this.deps = deps;
    }
    isEmpty() {
        const s = this.set;
        return !s.lines.length && !s.boxes.length && !s.labels.length && !s.polylines.length && !s.linefills.length;
    }
    /** Tooltip hit-rects of the labels drawn by the LAST `render` call (same coords as `ctx`). */ labelTipRegions() {
        return this.tipRegions;
    }
    /** Draw the whole set into `ctx` using the supplied coordinate closures. */ render(ctx, W, H, xOf, yOf) {
        this.tipRegions = [];
        if (this.isEmpty()) return;
        ctx.save();
        this.drawLinefills(ctx, W, H, xOf, yOf);
        this.drawBoxes(ctx, W, H, xOf, yOf);
        this.drawPolylines(ctx, W, xOf, yOf);
        this.drawLines(ctx, W, H, xOf, yOf);
        this.drawLabels(ctx, W, H, xOf, yOf);
        ctx.restore();
    }
    /**
     * Price min/max (+ above/below pixel margins) over the drawings intersecting
     * the visible bar range [from, to] — for autoscale. Returns null if nothing
     * in range contributes a price.
     */ priceRange(from, to) {
        const lo = Math.min(from, to);
        const hi = Math.max(from, to);
        // Painted-part coverage: the anchor span plus the side(s) `extend` projects
        // toward. A one-sided extension paints nothing on its other side, so a window
        // entirely there must not inherit the drawing's prices.
        const visible = (a, b, extend)=>{
            if (extend === 'both') return true;
            if (extend === 'left') return Math.max(a, b) >= lo;
            if (extend === 'right') return Math.min(a, b) <= hi;
            return Math.max(a, b) >= lo && Math.min(a, b) <= hi;
        };
        let min = Infinity;
        let max = -Infinity;
        const fold = (v)=>{
            if (v < min) min = v;
            if (v > max) max = v;
        };
        for (const ln of this.set.lines){
            if (ln.invisible) continue;
            // A line folds its ANCHOR prices (y1/y2) while some painted part of it
            // crosses the window: the extension widens WHERE the line is, but its
            // projected values never define the scale. A vertical line (x1 == x2)
            // extends along itself — no horizontal coverage beyond its own bar — so
            // one anchored off-screen contributes nothing (it paints nothing here).
            if (!lineCoversWindow(this.logicalOf(ln.xloc, ln.x1), this.logicalOf(ln.xloc, ln.x2), ln.extend, lo, hi)) continue;
            fold(ln.y1);
            fold(ln.y2);
        }
        for (const bx of this.set.boxes){
            if (!bx.bgColor && !(bx.borderColor && bx.borderWidth > 0) && !bx.text) continue;
            if (!visible(this.logicalOf(bx.xloc, bx.left), this.logicalOf(bx.xloc, bx.right), bx.extend)) continue;
            fold(bx.top);
            fold(bx.bottom);
        }
        for (const lf of this.set.linefills){
            if (!lf.color) continue;
            const xs = [
                lf.line1.x1,
                lf.line1.x2,
                lf.line2.x1,
                lf.line2.x2
            ].map((x, i)=>this.logicalOf(i < 2 ? lf.line1.xloc : lf.line2.xloc, x));
            const lfExt = lf.line1.extend !== 'none' || lf.line2.extend !== 'none' ? 'both' : 'none';
            if (!visible(Math.min(...xs), Math.max(...xs), lfExt)) continue;
            fold(lf.line1.y1);
            fold(lf.line1.y2);
            fold(lf.line2.y1);
            fold(lf.line2.y2);
        }
        for (const pl of this.set.polylines){
            if (pl.points.length < 2) continue;
            const xs = pl.points.map((p)=>this.logicalOf(p.xloc, p.x));
            if (!visible(Math.min(...xs), Math.max(...xs), 'none')) continue;
            for (const p of pl.points)fold(p.price);
        }
        let aboveMargin = 0;
        let belowMargin = 0;
        for (const lb of this.set.labels){
            const lx = this.logicalOf(lb.xloc, lb.x);
            if (!visible(lx, lx, 'none')) continue;
            if (lb.yloc === 'price') {
                fold(lb.y);
                continue;
            }
            if (lb.yloc === 'top' || lb.yloc === 'bottom') continue;
            const bar = this.deps.barAt(lx);
            if (!bar) continue;
            fold(lb.yloc === 'abovebar' ? bar.high : bar.low);
            const fontPx = fontSizePx(lb.size);
            const lineCount = Math.max(1, (lb.text ?? '').split('\n').length);
            const ext = this.isPointShape(lb.style) ? 14 + Math.max(4, fontPx * 0.6) + 2 : 14 + fontPx * 1.25 * lineCount + 8 + 7;
            if (lb.yloc === 'abovebar') aboveMargin = Math.max(aboveMargin, ext);
            else belowMargin = Math.max(belowMargin, ext);
        }
        if (!Number.isFinite(min) || !Number.isFinite(max)) return null;
        return {
            min,
            max,
            aboveMargin,
            belowMargin
        };
    }
    logicalOf(xloc, x) {
        return xloc === 'bar_time' ? this.deps.timeToLogical(x) : x + this.indexOffset;
    }
    // ── lines ────────────────────────────────────────────────────────────────
    drawLines(ctx, W, H, xOf, yOf) {
        for (const ln of this.set.lines){
            if (ln.invisible) continue;
            const x1 = xOf(this.logicalOf(ln.xloc, ln.x1));
            const x2 = xOf(this.logicalOf(ln.xloc, ln.x2));
            const y1 = yOf(ln.y1);
            const y2 = yOf(ln.y2);
            if (y1 === null || y2 === null) continue;
            const extL = ln.extend === 'left' || ln.extend === 'both';
            const extR = ln.extend === 'right' || ln.extend === 'both';
            if (!extL && !extR && (Math.max(x1, x2) < 0 || Math.min(x1, x2) > W)) continue;
            const [ax, ay, bx, by] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$renderers$2f$shared$2f$drawing$2d$geometry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extendEndpoints"])(x1, y1, x2, y2, ln.extend, W, H);
            const color = ln.color ?? this.deps.theme.textColor;
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(bx, by);
            ctx.strokeStyle = color;
            ctx.lineWidth = ln.width;
            ctx.setLineDash((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$renderers$2f$shared$2f$drawing$2d$geometry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dashPattern"])(ln.style, ln.width));
            ctx.stroke();
            ctx.setLineDash([]);
            const p2Right = x2 >= x1;
            if (ln.arrowRight) {
                const tip = (p2Right ? extR : extL) ? p2Right ? [
                    bx,
                    by
                ] : [
                    ax,
                    ay
                ] : [
                    x2,
                    y2
                ];
                this.drawArrow(ctx, tip[0], tip[1], x1, y1, ln.width, color);
            }
            if (ln.arrowLeft) {
                const tip = (p2Right ? extL : extR) ? p2Right ? [
                    ax,
                    ay
                ] : [
                    bx,
                    by
                ] : [
                    x1,
                    y1
                ];
                this.drawArrow(ctx, tip[0], tip[1], x2, y2, ln.width, color);
            }
        }
    }
    drawArrow(ctx, tipX, tipY, fromX, fromY, width, color) {
        const angle = Math.atan2(tipY - fromY, tipX - fromX);
        const size = 6 + width * 2;
        const spread = 0.45;
        ctx.beginPath();
        ctx.moveTo(tipX, tipY);
        ctx.lineTo(tipX - size * Math.cos(angle - spread), tipY - size * Math.sin(angle - spread));
        ctx.lineTo(tipX - size * Math.cos(angle + spread), tipY - size * Math.sin(angle + spread));
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    }
    // ── linefills ────────────────────────────────────────────────────────────
    drawLinefills(ctx, W, H, xOf, yOf) {
        for (const lf of this.set.linefills){
            if (!lf.color) continue;
            const a = this.resolveLine(lf.line1, W, H, xOf, yOf);
            const b = this.resolveLine(lf.line2, W, H, xOf, yOf);
            if (!a || !b) continue;
            const orient = (s)=>s[0] > s[2] || s[0] === s[2] && s[1] > s[3] ? [
                    s[2],
                    s[3],
                    s[0],
                    s[1]
                ] : s;
            const a2 = orient(a);
            const b2 = orient(b);
            ctx.beginPath();
            ctx.moveTo(a2[0], a2[1]);
            ctx.lineTo(a2[2], a2[3]);
            ctx.lineTo(b2[2], b2[3]);
            ctx.lineTo(b2[0], b2[1]);
            ctx.closePath();
            ctx.fillStyle = lf.color;
            ctx.fill();
        }
    }
    resolveLine(ln, W, H, xOf, yOf) {
        const x1 = xOf(this.logicalOf(ln.xloc, ln.x1));
        const x2 = xOf(this.logicalOf(ln.xloc, ln.x2));
        const y1 = yOf(ln.y1);
        const y2 = yOf(ln.y2);
        if (y1 === null || y2 === null) return null;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$renderers$2f$shared$2f$drawing$2d$geometry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extendEndpoints"])(x1, y1, x2, y2, ln.extend, W, H);
    }
    // ── polylines ──────────────────────────────────────────────────────────────
    drawPolylines(ctx, W, xOf, yOf) {
        for (const pl of this.set.polylines){
            const pts = [];
            for (const p of pl.points){
                const y = yOf(p.price);
                if (y === null) continue;
                pts.push([
                    xOf(this.logicalOf(p.xloc, p.x)),
                    y
                ]);
            }
            if (pts.length < 2) continue;
            let minX = Infinity;
            let maxX = -Infinity;
            for (const p of pts){
                if (p[0] < minX) minX = p[0];
                if (p[0] > maxX) maxX = p[0];
            }
            if (maxX < 0 || minX > W) continue;
            ctx.beginPath();
            if (pl.curved) this.curvedPath(ctx, pts, pl.closed);
            else {
                ctx.moveTo(pts[0][0], pts[0][1]);
                for(let i = 1; i < pts.length; i += 1)ctx.lineTo(pts[i][0], pts[i][1]);
            }
            if (pl.closed) ctx.closePath();
            if (pl.fillColor) {
                ctx.fillStyle = pl.fillColor;
                ctx.fill();
            }
            if (pl.lineColor) {
                ctx.strokeStyle = pl.lineColor;
                ctx.lineWidth = pl.lineWidth;
                ctx.setLineDash((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$renderers$2f$shared$2f$drawing$2d$geometry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dashPattern"])(pl.lineStyle, pl.lineWidth));
                ctx.stroke();
                ctx.setLineDash([]);
                if (pl.arrowLeft || pl.arrowRight) {
                    const segs = pl.closed ? pts.length : pts.length - 1;
                    for(let i = 0; i < segs; i += 1){
                        const a = pts[i];
                        const b = pts[(i + 1) % pts.length];
                        if (pl.arrowRight) this.drawArrow(ctx, b[0], b[1], a[0], a[1], pl.lineWidth, pl.lineColor);
                        if (pl.arrowLeft) this.drawArrow(ctx, a[0], a[1], b[0], b[1], pl.lineWidth, pl.lineColor);
                    }
                }
            }
        }
    }
    curvedPath(ctx, pts, closed) {
        const n = pts.length;
        const at = (i)=>{
            if (closed) return pts[(i % n + n) % n];
            return pts[Math.max(0, Math.min(n - 1, i))];
        };
        ctx.moveTo(pts[0][0], pts[0][1]);
        const last = closed ? n : n - 1;
        for(let i = 0; i < last; i += 1){
            const p0 = at(i - 1);
            const p1 = at(i);
            const p2 = at(i + 1);
            const p3 = at(i + 2);
            const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
            const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
            const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
            const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2[0], p2[1]);
        }
    }
    // ── boxes ──────────────────────────────────────────────────────────────────
    drawBoxes(ctx, W, H, xOf, yOf) {
        for (const bx of this.set.boxes){
            let xl = xOf(this.logicalOf(bx.xloc, bx.left));
            let xr = xOf(this.logicalOf(bx.xloc, bx.right));
            if (bx.extend === 'left' || bx.extend === 'both') xl = -2;
            if (bx.extend === 'right' || bx.extend === 'both') xr = W + 2;
            const yt = yOf(bx.top);
            const yb = yOf(bx.bottom);
            if (yt === null || yb === null) continue;
            const left = Math.min(xl, xr);
            const right = Math.max(xl, xr);
            const top = Math.min(yt, yb);
            const bottom = Math.max(yt, yb);
            const w = right - left;
            const h = bottom - top;
            if (right < 0 || left > W || bottom < 0 || top > H) continue;
            if (bx.bgColor) {
                ctx.fillStyle = bx.bgColor;
                ctx.fillRect(left, top, w, h);
            }
            if (bx.borderColor && bx.borderWidth > 0) {
                ctx.strokeStyle = bx.borderColor;
                ctx.lineWidth = bx.borderWidth;
                ctx.setLineDash((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$renderers$2f$shared$2f$drawing$2d$geometry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dashPattern"])(bx.borderStyle, bx.borderWidth));
                ctx.strokeRect(left, top, w, h);
                ctx.setLineDash([]);
            }
            if (bx.text) this.drawBoxText(ctx, bx, left, top, w, h);
        }
    }
    measure(ctx, font, text) {
        const key = `${font} ${text}`;
        let cached = this.widthCache.get(key);
        if (cached === undefined) {
            ctx.font = font;
            cached = ctx.measureText(text).width;
            this.widthCache.set(key, cached);
        }
        return cached;
    }
    wrapText(ctx, font, text, maxWidth) {
        const out = [];
        for (const para of text.split('\n')){
            if (this.measure(ctx, font, para) <= maxWidth) {
                out.push(para);
                continue;
            }
            let line = '';
            for (const word of para.split(/(\s+)/)){
                const trial = line + word;
                if (line && this.measure(ctx, font, trial) > maxWidth) {
                    out.push(line.trimEnd());
                    line = word.trimStart();
                } else {
                    line = trial;
                }
            }
            if (line.trim()) out.push(line.trimEnd());
        }
        return out;
    }
    drawBoxText(ctx, bx, left, top, w, h) {
        const text = bx.text;
        const family = bx.fontFamily === 'monospace' ? 'monospace' : this.deps.theme.fontFamily || 'sans-serif';
        const variant = `${bx.italic ? 'italic ' : ''}${bx.bold ? 'bold ' : ''}`;
        const pad = 4;
        let size = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$renderers$2f$shared$2f$drawing$2d$geometry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["namedFontSize"])(bx.textSize);
        let lines;
        if (size === 0) {
            const initial = `${variant}14px ${family}`;
            lines = bx.wrap ? this.wrapText(ctx, initial, text, Math.max(1, w - pad * 2)) : text.split('\n');
            size = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$renderers$2f$shared$2f$drawing$2d$geometry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["autoFontSize"])(lines, w, h, bx.bold);
        } else {
            const font = `${variant}${size}px ${family}`;
            lines = bx.wrap ? this.wrapText(ctx, font, text, Math.max(1, w - pad * 2)) : text.split('\n');
        }
        ctx.font = `${variant}${size}px ${family}`;
        ctx.fillStyle = bx.textColor ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$renderers$2f$shared$2f$drawing$2d$geometry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["contrastColor"])(bx.bgColor);
        const lineH = size * 1.3;
        const blockH = lineH * lines.length;
        let tx;
        if (bx.hAlign === 'left') {
            ctx.textAlign = 'left';
            tx = left + pad;
        } else if (bx.hAlign === 'right') {
            ctx.textAlign = 'right';
            tx = left + w - pad;
        } else {
            ctx.textAlign = 'center';
            tx = left + w / 2;
        }
        ctx.textBaseline = 'top';
        let blockTop;
        if (bx.vAlign === 'top') blockTop = top + pad;
        else if (bx.vAlign === 'bottom') blockTop = top + h - pad - blockH;
        else blockTop = top + (h - blockH) / 2;
        ctx.save();
        ctx.beginPath();
        ctx.rect(left, top, w, h);
        ctx.clip();
        for(let i = 0; i < lines.length; i += 1)ctx.fillText(lines[i], tx, blockTop + i * lineH);
        ctx.restore();
    }
    // ── labels ───────────────────────────────────────────────────────────────
    drawLabels(ctx, W, H, xOf, yOf) {
        for (const lb of this.set.labels){
            const px = xOf(this.logicalOf(lb.xloc, lb.x));
            if (px < -50 || px > W + 50) continue;
            let py;
            if (lb.yloc === 'price') {
                py = yOf(lb.y);
            } else if (lb.yloc === 'top') {
                py = 14;
            } else if (lb.yloc === 'bottom') {
                py = H - 14;
            } else {
                const bar = this.deps.barAt(this.logicalOf(lb.xloc, lb.x));
                if (!bar) continue;
                const base = yOf(lb.yloc === 'abovebar' ? bar.high : bar.low);
                py = base === null ? null : base + (lb.yloc === 'abovebar' ? -14 : 14);
            }
            if (py === null) continue;
            const color = lb.color ?? this.deps.theme.textColor;
            const fontPx = fontSizePx(lb.size);
            if (this.isPointShape(lb.style)) {
                if (!lb.noFill) this.drawLabelShape(ctx, lb.style, px, py, fontPx, color);
                if (lb.text) this.drawLabelText(ctx, lb, px, py + fontPx, fontPx);
                if (lb.tooltip) {
                    const r = Math.max(4, fontPx * 0.6) + 3;
                    this.tipRegions.push({
                        left: px - r,
                        top: py - r,
                        right: px + r,
                        bottom: py + r,
                        text: lb.tooltip
                    });
                }
            } else if (lb.style === 'none' || lb.style === 'text_outline') {
                if (lb.text) {
                    this.drawLabelText(ctx, lb, px, py, fontPx, lb.style === 'text_outline');
                    if (lb.tooltip) this.tipRegions.push(this.textRegion(ctx, lb, px, py, fontPx, lb.tooltip));
                }
            } else {
                // noFill (na color) keeps the bubble style's geometry — drawBubble
                // places the text as if the bubble were there and skips the fill.
                const r = this.drawBubble(ctx, lb, px, py, fontPx, color);
                if (lb.tooltip) this.tipRegions.push({
                    left: r.x,
                    top: r.y,
                    right: r.x + r.w,
                    bottom: r.y + r.h,
                    text: lb.tooltip
                });
            }
        }
    }
    /** Canvas font for a label's text — family + Pine `text_formatting` (bold/italic). */ labelFont(lb, fontPx) {
        const family = lb.fontFamily === 'monospace' ? 'monospace' : this.deps.theme.fontFamily || 'sans-serif';
        return `${lb.italic ? 'italic ' : ''}${lb.bold ? 'bold ' : ''}${fontPx}px ${family}`;
    }
    /** Hover rect of a text-only label (style none/text_outline/noFill), centered like drawLabelText. */ textRegion(ctx, lb, cx, cy, fontPx, text) {
        const font = this.labelFont(lb, fontPx);
        const lines = (lb.text ?? '').split('\n');
        const w = Math.max(1, ...lines.map((l)=>this.measure(ctx, font, l)));
        const h = fontPx * 1.25 * lines.length;
        const left = lb.textAlign === 'left' ? cx : lb.textAlign === 'right' ? cx - w : cx - w / 2;
        return {
            left,
            top: cy - h / 2,
            right: left + w,
            bottom: cy + h / 2,
            text
        };
    }
    isPointShape(style) {
        switch(style){
            case 'circle':
            case 'square':
            case 'diamond':
            case 'flag':
            case 'arrowup':
            case 'arrowdown':
            case 'triangleup':
            case 'triangledown':
            case 'cross':
            case 'xcross':
                return true;
            default:
                return false;
        }
    }
    drawLabelText(ctx, lb, cx, cy, fontPx, outline = false) {
        ctx.font = this.labelFont(lb, fontPx);
        ctx.textAlign = lb.textAlign === 'left' ? 'left' : lb.textAlign === 'right' ? 'right' : 'center';
        ctx.textBaseline = 'middle';
        const lines = lb.text.split('\n');
        const lineH = fontPx * 1.25;
        const startY = cy - lineH * (lines.length - 1) / 2;
        if (outline) {
            ctx.lineWidth = 3;
            ctx.strokeStyle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$renderers$2f$shared$2f$drawing$2d$geometry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["contrastColor"])(lb.textColor ?? this.deps.theme.textColor);
            for(let i = 0; i < lines.length; i += 1)ctx.strokeText(lines[i], cx, startY + i * lineH);
        }
        ctx.fillStyle = lb.textColor ?? this.deps.theme.textColor;
        for(let i = 0; i < lines.length; i += 1)ctx.fillText(lines[i], cx, startY + i * lineH);
    }
    drawLabelShape(ctx, style, cx, cy, fontPx, color) {
        const r = Math.max(4, fontPx * 0.6);
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = Math.max(1, r * 0.3);
        ctx.beginPath();
        switch(style){
            case 'circle':
                ctx.arc(cx, cy, r, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'square':
                ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
                break;
            case 'diamond':
                ctx.moveTo(cx, cy - r);
                ctx.lineTo(cx + r, cy);
                ctx.lineTo(cx, cy + r);
                ctx.lineTo(cx - r, cy);
                ctx.closePath();
                ctx.fill();
                break;
            case 'triangleup':
            case 'arrowup':
                ctx.moveTo(cx, cy - r);
                ctx.lineTo(cx + r, cy + r);
                ctx.lineTo(cx - r, cy + r);
                ctx.closePath();
                ctx.fill();
                break;
            case 'triangledown':
            case 'arrowdown':
                ctx.moveTo(cx, cy + r);
                ctx.lineTo(cx + r, cy - r);
                ctx.lineTo(cx - r, cy - r);
                ctx.closePath();
                ctx.fill();
                break;
            case 'flag':
                ctx.moveTo(cx - r * 0.7, cy - r);
                ctx.lineTo(cx - r * 0.7, cy + r);
                ctx.moveTo(cx - r * 0.7, cy - r);
                ctx.lineTo(cx + r, cy - r * 0.4);
                ctx.lineTo(cx - r * 0.7, cy + r * 0.2);
                ctx.stroke();
                ctx.fill();
                break;
            case 'cross':
                ctx.moveTo(cx, cy - r);
                ctx.lineTo(cx, cy + r);
                ctx.moveTo(cx - r, cy);
                ctx.lineTo(cx + r, cy);
                ctx.stroke();
                break;
            case 'xcross':
                ctx.moveTo(cx - r, cy - r);
                ctx.lineTo(cx + r, cy + r);
                ctx.moveTo(cx + r, cy - r);
                ctx.lineTo(cx - r, cy + r);
                ctx.stroke();
                break;
            default:
                ctx.arc(cx, cy, r, 0, Math.PI * 2);
                ctx.fill();
        }
    }
    /** Draw a bubble label; returns the bubble body rect (for tooltip hit-testing). */ drawBubble(ctx, lb, px, py, fontPx, color) {
        ctx.font = this.labelFont(lb, fontPx);
        const lines = (lb.text ?? '').split('\n');
        const padX = 6;
        const padY = 4;
        const lineH = fontPx * 1.25;
        const textW = Math.max(1, ...lines.map((l)=>this.measure(ctx, ctx.font, l)));
        const w = textW + padX * 2;
        const h = lineH * lines.length + padY * 2;
        const ptr = 7;
        let bx = px - w / 2;
        let by = py - h - ptr;
        let pointer = 'down';
        switch(lb.style){
            case 'label_up':
                bx = px - w / 2;
                by = py + ptr;
                pointer = 'up';
                break;
            case 'label_left':
                bx = px + ptr;
                by = py - h / 2;
                pointer = 'left';
                break;
            case 'label_right':
                bx = px - w - ptr;
                by = py - h / 2;
                pointer = 'right';
                break;
            case 'label_center':
                bx = px - w / 2;
                by = py - h / 2;
                pointer = 'none';
                break;
            case 'label_lower_left':
                bx = px + ptr;
                by = py - h - ptr;
                pointer = 'none';
                break;
            case 'label_lower_right':
                bx = px - w - ptr;
                by = py - h - ptr;
                pointer = 'none';
                break;
            case 'label_upper_left':
                bx = px + ptr;
                by = py + ptr;
                pointer = 'none';
                break;
            case 'label_upper_right':
                bx = px - w - ptr;
                by = py + ptr;
                pointer = 'none';
                break;
            default:
                bx = px - w / 2;
                by = py - h - ptr;
                pointer = 'down';
        }
        if (!lb.noFill) {
            ctx.fillStyle = color;
            this.roundRect(ctx, bx, by, w, h, 4);
            ctx.fill();
            if (pointer !== 'none') {
                ctx.beginPath();
                if (pointer === 'down') {
                    ctx.moveTo(px - ptr, by + h);
                    ctx.lineTo(px + ptr, by + h);
                    ctx.lineTo(px, py);
                } else if (pointer === 'up') {
                    ctx.moveTo(px - ptr, by);
                    ctx.lineTo(px + ptr, by);
                    ctx.lineTo(px, py);
                } else if (pointer === 'left') {
                    ctx.moveTo(bx, py - ptr);
                    ctx.lineTo(bx, py + ptr);
                    ctx.lineTo(px, py);
                } else {
                    ctx.moveTo(bx + w, py - ptr);
                    ctx.lineTo(bx + w, py + ptr);
                    ctx.lineTo(px, py);
                }
                ctx.closePath();
                ctx.fill();
            }
        }
        if (lb.text) {
            // With no bubble behind it, contrast-of-bubble is meaningless — fall
            // back to the theme's text color (same default as bare label text).
            ctx.fillStyle = lb.textColor ?? (lb.noFill ? this.deps.theme.textColor : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$renderers$2f$shared$2f$drawing$2d$geometry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["contrastColor"])(color));
            ctx.textBaseline = 'middle';
            // Pine `textalign` aligns the LINES inside the bubble (the bubble itself stays put).
            let tx;
            if (lb.textAlign === 'left') {
                ctx.textAlign = 'left';
                tx = bx + padX;
            } else if (lb.textAlign === 'right') {
                ctx.textAlign = 'right';
                tx = bx + w - padX;
            } else {
                ctx.textAlign = 'center';
                tx = bx + w / 2;
            }
            const startY = by + padY + lineH / 2;
            for(let i = 0; i < lines.length; i += 1)ctx.fillText(lines[i], tx, startY + i * lineH);
        }
        return {
            x: bx,
            y: by,
            w,
            h
        };
    }
    roundRect(ctx, x, y, w, h, r) {
        const rr = Math.min(r, w / 2, h / 2);
        ctx.beginPath();
        ctx.moveTo(x + rr, y);
        ctx.arcTo(x + w, y, x + w, y + h, rr);
        ctx.arcTo(x + w, y + h, x, y + h, rr);
        ctx.arcTo(x, y + h, x, y, rr);
        ctx.arcTo(x, y, x + w, y, rr);
        ctx.closePath();
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/renderers/shared/IndicatorInputsDialog.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_INPUT_TAB",
    ()=>DEFAULT_INPUT_TAB,
    "INPUT_DIALOG_GAP_PX",
    ()=>INPUT_DIALOG_GAP_PX,
    "IndicatorInputsDialog",
    ()=>IndicatorInputsDialog,
    "PROPS_TAB",
    ()=>PROPS_TAB,
    "ensureDialogStyles",
    ()=>ensureDialogStyles,
    "inputDialogBodyStyle",
    ()=>inputDialogBodyStyle,
    "nameOf",
    ()=>nameOf,
    "normalizeTimeInput",
    ()=>normalizeTimeInput,
    "tabInputs",
    ()=>tabInputs
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$model$2f$inputs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/model/inputs.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$color$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/color.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/icons.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$renderers$2f$shared$2f$theme$2d$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/renderers/shared/theme-tokens.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$renderers$2f$shared$2f$chrome$2d$tooltip$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/renderers/shared/chrome-tooltip.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$select$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/select/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$select$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/select/view.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$popover$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/popover/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$popover$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/popover/view.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$dialog$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/dialog/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$dialog$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/dialog/view.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$date$2d$picker$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/date-picker/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$date$2d$picker$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/date-picker/view.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$date$2d$picker$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/date-picker/controller.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$field$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/field/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$field$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/field/view.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$field$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/field/controller.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/ui/styles.ts [app-client] (ecmascript) <locals>");
;
;
;
;
;
;
;
;
;
;
;
const PROPS_TAB = 'Properties';
/** The value bag a decl reads from / writes to (inputs vs declaration props). */ function bagOf(row, decl) {
    return decl.prop ? row.propValues : row.values;
}
const SOURCES = [
    'close',
    'open',
    'high',
    'low',
    'hl2',
    'hlc3',
    'ohlc4',
    'volume'
];
class IndicatorInputsDialog {
    host;
    dialog;
    backdrop;
    uiDialog;
    openId;
    row;
    snapshot;
    propSnapshot;
    dialogTips;
    /** Re-applies every `when` gate against current values; set while the dialog is open. */ refreshVisibility;
    choicePop;
    calendarPop;
    calendarAnchor;
    constructor(host){
        this.host = host;
        this.dialog = null;
        this.backdrop = null;
        this.uiDialog = null;
        this.openId = null;
        this.row = null;
        this.snapshot = null;
        this.propSnapshot = null;
        this.dialogTips = [];
        this.refreshVisibility = null;
        this.choicePop = null;
        this.calendarPop = null;
        this.calendarAnchor = null;
        this.onDialogKey = (e)=>{
            if (e.key === 'Escape') {
                e.preventDefault();
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$popover$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPopoverOpen"])()) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$popover$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["closeOpenPopovers"])();
                    return;
                }
                this.close();
            }
        };
    }
    isOpen() {
        return this.dialog !== null;
    }
    onDialogKey;
    open(row) {
        this.close();
        if (row.inputs.length === 0 && row.props.length === 0) return;
        this.row = row;
        this.openId = row.id;
        this.snapshot = {
            ...row.values
        };
        this.propSnapshot = {
            ...row.propValues
        };
        ensureDialogStyles();
        const t = this.host.theme();
        const border = 'var(--vela-border)';
        const fg = 'var(--vela-fg-bright)';
        const host = this.host.dialogHost() ?? this.host.container;
        const ui = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$dialog$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"]({
            host,
            title: row.title,
            // Non-modal: live-edit dialog — a modal machine locks pointer events on the
            // whole body, killing the chart and the body-portaled popovers.
            modal: false,
            contained: true,
            align: 'center',
            draggable: !this.host.mobile(),
            flush: true,
            className: 'vela-dialog--form vela-ind-dialog',
            closeOnEscape: false,
            footer: (foot)=>{
                foot.append(this.resetAction(), this.dialogButton('Cancel', false, ()=>this.revertAndClose()), this.dialogButton('Ok', true, ()=>this.close()));
            },
            // Stale-guard: destroying a dialog fires its machine's onOpenChange(false)
            // asynchronously — after a reset rebuild that notification must not close
            // the replacement dialog.
            onOpenChange: (open)=>{
                if (!open && this.uiDialog === ui) this.close();
            }
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$renderers$2f$shared$2f$theme$2d$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyChromeTokens"])(ui.panel, t);
        ui.panel.style.colorScheme = this.isDarkTheme() ? 'dark' : 'light';
        this.dialogTips.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$renderers$2f$shared$2f$chrome$2d$tooltip$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["attachChromeTooltip"])(ui.panel.querySelector('.vela-dialog-close'), {
            host: this.host.container,
            theme: ()=>this.host.theme(),
            text: ()=>'Close'
        }));
        const tabDefs = tabInputs(row.inputs);
        if (row.props.length > 0) {
            // Props always render on the trailing "Properties" tab — an engine schema
            // carries no `tab=`, and a script input that DECLARES tab='Properties'
            // shares the tab rather than spawning a duplicate strip label.
            const propDecls = row.props.map((p)=>{
                const d = {
                    ...p,
                    prop: true
                };
                delete d.tab;
                return d;
            });
            const existing = tabDefs.find((t)=>t.name === PROPS_TAB);
            if (existing) existing.inputs.push(...propDecls);
            else tabDefs.push({
                name: PROPS_TAB,
                inputs: propDecls
            });
        }
        const tabs = document.createElement('div');
        tabs.style.cssText = `display:flex;gap:12px;padding:0 20px;border-bottom:1px solid ${border};flex:0 0 auto;`;
        const tabEls = [];
        const bodies = [];
        const gates = [];
        let active = 0;
        const activate = (idx)=>{
            active = idx;
            for(let i = 0; i < tabEls.length; i += 1){
                const on = i === idx;
                const el = tabEls[i];
                el.style.borderBottomColor = on ? fg : 'transparent';
                el.style.color = on ? 'inherit' : 'var(--vela-fg-muted)';
                el.classList.toggle('vela-ind-tab-active', on);
                bodies[i].style.display = on ? 'grid' : 'none';
            }
        };
        for (const [idx, def] of tabDefs.entries()){
            const tab = document.createElement('div');
            tab.textContent = def.name;
            tab.className = 'vela-ind-tab';
            tab.style.cssText = `padding:0 0 8px;margin-bottom:-1px;border-bottom:2px solid transparent;${tabDefs.length > 1 ? 'cursor:pointer;' : ''}`;
            tab.addEventListener('click', ()=>activate(idx));
            tabs.appendChild(tab);
            tabEls.push(tab);
            bodies.push(this.buildTabBody(def.inputs, row, gates));
            // The strip label leaves only when every input on the tab is gated out —
            // possible only when all of them carry a `when`.
            if (def.inputs.every((d)=>d.when)) {
                gates.push({
                    el: tab,
                    visible: (bag)=>def.inputs.some((d)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$model$2f$inputs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inputVisible"])(d.when, bag))
                });
            }
        }
        ui.body.appendChild(tabs);
        for (const b of bodies)ui.body.appendChild(b);
        activate(0);
        const refresh = ()=>{
            const bag = valuesBag(row);
            for (const g of gates)g.el.style.display = g.visible(bag) ? '' : 'none';
            // An edit that gates the ACTIVE tab out lands the user on the first live one.
            if (tabEls[active]?.style.display === 'none') {
                const next = tabEls.findIndex((el)=>el.style.display !== 'none');
                if (next >= 0) activate(next);
            }
        };
        this.refreshVisibility = refresh;
        refresh();
        const onBackdropDown = (e)=>{
            if (e.target !== ui.backdrop && e.target !== ui.positioner) return;
            // An open portaled popover (color picker, select list, calendar) is part of
            // the dialog: the first outside click dismisses it, not the dialog itself.
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$popover$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPopoverOpen"])() || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$popover$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["eventDismissedPopover"])(e)) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$popover$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["closeOpenPopovers"])();
                return;
            }
            this.close();
            this.host.onBackdropClose();
        };
        ui.backdrop.addEventListener('pointerdown', onBackdropDown);
        ui.positioner.addEventListener('pointerdown', onBackdropDown);
        this.uiDialog = ui;
        this.dialog = ui.panel;
        this.backdrop = ui.backdrop;
        ui.show();
        document.addEventListener('keydown', this.onDialogKey);
    }
    /** One tab's scrollable body — one shared grid so every group's controls share a
     *  left edge (a 100px number field lines up with a wider session/time pair). */ buildTabBody(inputs, row, gates) {
        const body = document.createElement('div');
        // `display:contents` on each group lets headers + rows participate in this
        // one grid; per-section grids would each pick their own control-column width.
        // overflow-x is pinned to hidden: `overflow-y:auto` alone would compute overflow-x
        // to auto too, and a transient sliver of horizontal overflow (layout settling, the
        // vertical scrollbar stealing width from the fit-content card) then flashes a
        // horizontal scrollbar across the bottom of the dialog.
        // overflow-anchor is OFF: Chrome's scroll anchoring miscompensates when a body-portaled
        // popover (color picker, select list) is swapped in one gesture, jumping this scroller
        // to its max — content here only scrolls when the user scrolls it.
        body.style.cssText = inputDialogBodyStyle(this.host.mobile());
        for (const group of groupInputs(inputs)){
            const section = document.createElement('div');
            section.style.cssText = 'display:contents;';
            let header = null;
            if (group.name) {
                header = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$field$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fieldSection"])(group.name, {
                    variant: 'inputs',
                    first: body.childElementCount === 0
                });
                section.appendChild(header);
            }
            for (const inputRow of group.rows){
                const el = this.buildInputRow(section, inputRow, row);
                if (inputRow.some((d)=>d.when)) {
                    gates.push({
                        el,
                        visible: (bag)=>rowVisible(inputRow, bag)
                    });
                }
            }
            // The heading follows its rows out only when every row can actually hide.
            if (header && group.rows.every((r)=>r.every((d)=>d.when))) {
                const rows = group.rows;
                gates.push({
                    el: header,
                    visible: (bag)=>rows.some((r)=>rowVisible(r, bag))
                });
            }
            body.appendChild(section);
        }
        return body;
    }
    close() {
        document.removeEventListener('keydown', this.onDialogKey);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$popover$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["closeOpenPopovers"])();
        this.refreshVisibility = null;
        this.choicePop = null;
        this.calendarPop = null;
        this.calendarAnchor = null;
        for (const dispose of this.dialogTips.splice(0))dispose(); // a tip open right now dies with its dialog
        const ui = this.uiDialog;
        this.uiDialog = null;
        this.backdrop = null;
        this.dialog = null;
        this.openId = null;
        this.row = null;
        this.snapshot = null;
        this.propSnapshot = null;
        ui?.destroy();
    }
    /** Restore every input and prop to its open-time value (re-running the indicator), then close. */ revertAndClose() {
        const row = this.row;
        const snap = this.snapshot;
        if (row && snap) {
            for (const inp of row.inputs){
                const snapped = snap[inp.key];
                const before = snapped !== undefined ? snapped : inp.defval;
                if (row.values[inp.key] !== before) {
                    row.values[inp.key] = before;
                    this.host.onChange?.({
                        indicatorId: row.id,
                        key: inp.key,
                        value: before
                    });
                }
            }
        }
        const propSnap = this.propSnapshot;
        if (row && propSnap) {
            for (const p of row.props){
                const snapped = propSnap[p.key];
                const before = snapped !== undefined ? snapped : p.defval;
                if (row.propValues[p.key] !== before) {
                    row.propValues[p.key] = before;
                    this.host.onChange?.({
                        indicatorId: row.id,
                        key: p.key,
                        value: before,
                        kind: 'prop'
                    });
                }
            }
        }
        this.close();
    }
    /** The footer's reset button — same chip as Cancel, pinned to the LEFT edge
     *  (`margin-right:auto` against the footer's flex-end keeps Cancel/Ok right). */ resetAction() {
        const b = this.dialogButton('Reset defaults', false, ()=>this.resetToDefaults());
        b.style.marginRight = 'auto';
        return b;
    }
    /** Restore every input to its declared default (re-running the indicator), then
     *  re-open the form so each control re-reads the restored values — the same
     *  rebuild-after-reset move as the chart-settings dialog. The open-time snapshot
     *  survives the rebuild, so Cancel after a reset still reverts the whole session. */ resetToDefaults() {
        const row = this.row;
        if (!row) return;
        const snap = this.snapshot;
        const propSnap = this.propSnapshot;
        for (const inp of row.inputs){
            if (row.values[inp.key] !== inp.defval) {
                row.values[inp.key] = inp.defval;
                this.host.onChange?.({
                    indicatorId: row.id,
                    key: inp.key,
                    value: inp.defval
                });
            }
        }
        // Props reset to their EFFECTIVE defaults (the script's declared value, else the
        // engine's) — the schema's defval already carries that resolution.
        for (const p of row.props){
            if (row.propValues[p.key] !== p.defval) {
                row.propValues[p.key] = p.defval;
                this.host.onChange?.({
                    indicatorId: row.id,
                    key: p.key,
                    value: p.defval,
                    kind: 'prop'
                });
            }
        }
        this.open(row);
        if (snap) this.snapshot = snap;
        if (propSnap) this.propSnapshot = propSnap;
    }
    /** Write one edit through: store it, notify the host, and re-apply the `when` gates. */ commit(row, decl, value) {
        bagOf(row, decl)[decl.key] = value;
        this.host.onChange?.({
            indicatorId: row.id,
            key: decl.key,
            value,
            ...decl.prop ? {
                kind: 'prop'
            } : {}
        });
        this.refreshVisibility?.();
    }
    /** One settings row (or several `inline=` inputs) placed into a section's grid. */ buildInputRow(grid, decls, row) {
        const idOf = (inp)=>`vela-inp-${row.id}-${inp.key}`;
        const append = (el)=>{
            grid.appendChild(el);
            return el;
        };
        if (decls.length > 1) {
            return append((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$field$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fieldRow"])({
                label: '',
                inline: decls.map((d)=>({
                        label: nameOf(d) || undefined,
                        id: idOf(d),
                        control: this.buildControl(row, d, idOf(d)),
                        toggleFirst: d.type === 'bool',
                        fit: d.type === 'color' || d.type === 'bool'
                    })),
                info: [
                    ...decls
                ].reverse().find((d)=>d.tooltip)?.tooltip ? this.infoButton([
                    ...decls
                ].reverse().find((d)=>d.tooltip).tooltip) : undefined
            }));
        }
        const lead = decls[0];
        const id = idOf(lead);
        const info = lead.tooltip ? this.infoButton(lead.tooltip) : undefined;
        if (lead.type === 'bool') {
            const current = Boolean(bagOf(row, lead)[lead.key] ?? lead.defval);
            return append((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$field$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fieldRow"])({
                label: nameOf(lead),
                id,
                bool: true,
                info,
                toggle: {
                    id,
                    checked: current,
                    onChange: (v)=>this.commit(row, lead, v)
                }
            }));
        }
        if (lead.type === 'text_area') {
            return append((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$field$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fieldRow"])({
                label: nameOf(lead),
                id,
                stacked: true,
                info,
                control: this.buildControl(row, lead, id)
            }));
        }
        const fit = lead.type === 'color' || lead.type === 'session' || lead.type === 'time';
        return append((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$field$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fieldRow"])({
            label: nameOf(lead),
            id,
            fit,
            controlWidth: fit ? undefined : 100,
            info,
            control: this.buildControl(row, lead, id)
        }));
    }
    /** Build the typed control for one input, committing edits live via `onChange`. */ buildControl(row, inp, id) {
        const current = bagOf(row, inp)[inp.key] ?? inp.defval;
        const emit = (value)=>this.commit(row, inp, value);
        if (inp.type === 'bool') {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$field$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildFieldControl"])({
                kind: 'switch',
                id,
                checked: Boolean(current),
                onChange: (v)=>emit(v)
            }).el;
        }
        if (inp.options && inp.options.length > 0) return this.select(id, inp.options.map(String), String(current), emit);
        if (inp.type === 'source') return this.select(id, SOURCES, String(current), emit);
        if (inp.type === 'color') {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$field$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildFieldControl"])({
                kind: 'color',
                id,
                theme: this.host.theme(),
                get: ()=>String(bagOf(row, inp)[inp.key] ?? inp.defval),
                onChange: (v)=>emit(v),
                // An input change re-executes the script over its whole history: commit the
                // opacity drag once on release, not once per pointer move.
                commit: 'release'
            }).el;
        }
        if (inp.type === 'symbol') return this.buildSymbol(id, String(current), emit);
        if (inp.type === 'timeframe') return this.selectPairs(id, TIMEFRAME_OPTIONS, String(current), emit);
        if (inp.type === 'session') return this.buildSession(id, String(current), emit);
        if (inp.type === 'time') return this.buildTime(id, Number(current) || 0, emit);
        if (inp.type === 'text_area') {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$field$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildFieldControl"])({
                kind: 'textarea',
                id,
                value: String(current),
                onChange: (v)=>emit(v)
            }).el;
        }
        if (inp.type === 'int' || inp.type === 'float' || inp.type === 'price') {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$field$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildFieldControl"])({
                kind: 'number',
                id,
                value: Number(current),
                min: inp.min,
                max: inp.max,
                step: inp.step ?? (inp.type === 'int' ? 1 : 0.1),
                integer: inp.type === 'int',
                commit: 'blur',
                onChange: (v)=>emit(v)
            }).el;
        }
        return this.buildTextField(id, String(current), emit);
    }
    /** A plain text field that commits on blur / Enter (shared by string inputs and the pickerless symbol field). */ buildTextField(id, current, emit) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$field$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildFieldControl"])({
            kind: 'text',
            id,
            value: current,
            onChange: emit
        }).el;
    }
    /** The shared ⓘ hint carrying an input's `tooltip` (see {@link chromeHint}). */ infoButton(tooltip) {
        const { el, dispose } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$renderers$2f$shared$2f$chrome$2d$tooltip$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["chromeHint"])(tooltip, {
            host: this.host.container,
            theme: ()=>this.host.theme(),
            size: 18
        });
        this.dialogTips.push(dispose);
        return el;
    }
    /** A dropdown over plain string options (value === label) — a thin case of {@link selectPairs}. */ select(id, options, current, emit) {
        return this.selectPairs(id, options.map((o)=>({
                value: o,
                label: o
            })), current, emit);
    }
    /** A dropdown whose visible labels differ from the committed values (label ≠ value pairs). */ selectPairs(id, pairs, current, onChange) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$field$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildFieldControl"])({
            kind: 'select',
            id,
            options: pairs,
            value: current,
            theme: this.host.theme(),
            list: this.listPopover(),
            onChange
        }).el;
    }
    /** `input.session` → two typeable HH:MM comboboxes committing a `HHMM-HHMM` session string. */ buildSession(id, current, emit) {
        const [start, end] = sessionToTimes(current);
        const wrap = document.createElement('div');
        wrap.style.cssText = 'display:flex;align-items:center;gap:6px;';
        let from = start;
        let to = end;
        const commit = ()=>emit(timesToSession(from, to));
        wrap.append(this.timeCombobox(id, from, 86, (v)=>{
            from = v;
            commit();
        }), this.timeCombobox(`${id}-end`, to, 86, (v)=>{
            to = v;
            commit();
        }));
        return wrap;
    }
    /** `input.time` → a date picker + an HH:MM dropdown, committing an epoch-ms timestamp. */ buildTime(id, current, emit) {
        const parts = timeParts(current);
        const wrap = document.createElement('div');
        wrap.style.cssText = 'display:flex;align-items:center;gap:6px;';
        let date = parts.date;
        let time = parts.time;
        const commit = ()=>{
            if (!date) return; // no date chosen yet → nothing to commit
            const ms = Date.parse(`${date}T${time}:00`);
            if (Number.isFinite(ms)) emit(ms);
        };
        const dateField = this.dateField(id, date, (v)=>{
            date = v;
            commit();
        });
        const timeSel = this.timeCombobox(`${id}-time`, time, 86, (v)=>{
            time = v;
            commit();
        });
        wrap.append(dateField, timeSel);
        return wrap;
    }
    /** A fixed-width HH:MM combobox (typeable, plus a 30-minute-step dropdown) used by session + time. */ timeCombobox(id, current, width, onChange) {
        const wrap = document.createElement('div');
        wrap.className = 'vela-ind-combo';
        wrap.style.cssText = `position:relative;width:${width}px;`;
        const input = document.createElement('input');
        input.type = 'text';
        input.id = id;
        input.value = current;
        input.autocomplete = 'off';
        input.spellcheck = false;
        input.style.cssText = `${this.ctrlStyle()}padding-right:26px;`;
        const chevron = document.createElement('button');
        chevron.type = 'button';
        chevron.tabIndex = -1;
        chevron.className = 'vela-ind-combo-chevron';
        chevron.setAttribute('aria-label', 'Open time list');
        chevron.innerHTML = CLOCK_SVG;
        let value = current;
        const commitTyped = ()=>{
            const next = normalizeTimeInput(input.value);
            if (!next) {
                input.value = value;
                return;
            }
            input.value = next;
            if (next !== value) {
                value = next;
                onChange(next);
            }
        };
        input.addEventListener('blur', ()=>{
            // A click on the open list focuses the item, not the input — don't revert yet.
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$popover$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPopoverOpen"])()) return;
            commitTyped();
        });
        const pick = (v)=>{
            value = v;
            input.value = v;
            onChange(v);
        };
        const openList = ()=>{
            this.choicePop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$select$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toggleSelectList"])(wrap, TIME_OPTIONS, value, pick, {
                ...this.listPopover(),
                onClose: ()=>{
                    this.choicePop = null;
                }
            });
        };
        input.addEventListener('keydown', (e)=>{
            if (e.key === 'Enter') {
                e.preventDefault();
                commitTyped();
                input.blur();
            }
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                openList();
            }
        });
        const open = (e)=>{
            e.preventDefault();
            e.stopPropagation();
            openList();
        };
        // The field itself is the dropdown trigger — typing still works while the list is open.
        input.addEventListener('click', open);
        chevron.addEventListener('mousedown', (e)=>e.preventDefault()); // keep input focused
        chevron.addEventListener('click', open);
        wrap.append(input, chevron);
        return wrap;
    }
    /** A typeable YYYY-MM-DD field that also opens a themed month calendar. */ dateField(id, current, onChange) {
        const wrap = document.createElement('div');
        wrap.className = 'vela-ind-combo';
        wrap.style.cssText = 'position:relative;width:128px;';
        const input = document.createElement('input');
        input.type = 'text';
        input.id = id;
        input.value = current;
        input.autocomplete = 'off';
        input.spellcheck = false;
        input.style.cssText = `${this.ctrlStyle()}padding-right:26px;`;
        const chevron = document.createElement('button');
        chevron.type = 'button';
        chevron.tabIndex = -1;
        chevron.className = 'vela-ind-combo-chevron';
        chevron.setAttribute('aria-label', 'Open calendar');
        chevron.innerHTML = CALENDAR_SVG;
        let value = current;
        const commitTyped = ()=>{
            const next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$date$2d$picker$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeDateInput"])(input.value);
            if (!next) {
                input.value = value;
                return;
            }
            input.value = next;
            if (next !== value) {
                value = next;
                onChange(next);
            }
        };
        input.addEventListener('blur', ()=>{
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$popover$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPopoverOpen"])()) return;
            commitTyped();
        });
        const pick = (v)=>{
            value = v;
            input.value = v;
            onChange(v);
        };
        input.addEventListener('keydown', (e)=>{
            if (e.key === 'Enter') {
                e.preventDefault();
                commitTyped();
                input.blur();
            }
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.openCalendar(wrap, value, pick);
            }
        });
        const open = (e)=>{
            e.preventDefault();
            e.stopPropagation();
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$popover$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["openPopoverTrigger"])() === wrap) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$popover$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["closeOpenPopovers"])();
                return;
            }
            this.openCalendar(wrap, value, pick);
        };
        input.addEventListener('click', open);
        chevron.addEventListener('mousedown', (e)=>e.preventDefault());
        chevron.addEventListener('click', open);
        wrap.append(input, chevron);
        return wrap;
    }
    /** Placement shared by the indicator dialog's dropdowns and the time combobox. */ listPopover() {
        return {
            theme: this.host.theme(),
            matchWidth: true,
            boundary: this.dialog ?? 'viewport',
            boundaryInset: 8,
            gap: 4
        };
    }
    /** Open a themed month calendar under `anchor` — same surface + shadow as the choice list. */ openCalendar(anchor, current, onPick) {
        const pop = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$popover$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Popover"]({
            trigger: anchor,
            theme: this.host.theme(),
            className: 'vela-ind-cal',
            boundary: this.dialog ?? 'viewport',
            boundaryInset: 8,
            gap: 4,
            onClose: ()=>{
                this.calendarPop = null;
                this.calendarAnchor = null;
            },
            content: (el)=>{
                const picker = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$date$2d$picker$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DatePicker"]({
                    value: current,
                    onPick: (iso)=>{
                        pop.hide();
                        onPick(iso);
                    }
                });
                el.append(picker.el);
            }
        });
        this.calendarPop = pop;
        this.calendarAnchor = anchor;
        pop.show();
    }
    /**
     * `input.symbol` → a field that opens the host's ticker-selection UI when a picker is wired
     * (the chosen symbol is written back), else a plain text field (type the ticker).
     */ buildSymbol(id, current, emit) {
        const picker = this.host.symbolPicker();
        if (!picker) return this.buildTextField(id, current, emit);
        // Track the stored symbol so the picker is seeded with the actual value (not the
        // placeholder), and stays in sync after each pick for subsequent openings.
        let value = current;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.id = id;
        btn.style.cssText = `${this.ctrlStyle()}display:flex;align-items:center;cursor:pointer;text-align:left;`;
        const label = document.createElement('span');
        label.textContent = value || 'Select symbol…';
        label.style.cssText = 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';
        btn.append(label);
        btn.addEventListener('click', ()=>picker(value, (picked)=>{
                if (!picked) return;
                value = picked;
                label.textContent = picked;
                emit(picked);
            }));
        return btn;
    }
    /** Shared field chrome for text / number / select controls (fills its wrapper's width). */ ctrlStyle() {
        return 'width:100%;box-sizing:border-box;height:34px;background:transparent;border:1px solid var(--vela-border-strong);color:var(--vela-fg-bright);border-radius:6px;padding:0 8px;font-size:14px;font-family:inherit;outline:none;';
    }
    /** Whether the active theme is dark (drives the dialog's `color-scheme`). */ isDarkTheme() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$color$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDarkColor"])(this.host.theme().background);
    }
    dialogButton(label, primary, onClick) {
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = label;
        // Primary = filled inverse chip; Cancel = outlined. Both hover states are in the
        // scoped stylesheet.
        b.className = primary ? 'vela-dialog-btn vela-dialog-btn-primary' : 'vela-dialog-btn';
        b.addEventListener('click', onClick);
        return b;
    }
}
function nameOf(inp) {
    const t = inp.title;
    return t.length > 0 ? t.charAt(0).toUpperCase() + t.slice(1) : '';
}
const INPUT_DIALOG_GAP_PX = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$field$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FIELD_GAP_PX"];
function inputDialogBodyStyle(mobile) {
    const columns = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$field$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fieldGridColumns"])('inputs', mobile);
    return `padding:16px 20px;overflow-y:auto;overflow-x:hidden;overflow-anchor:none;` + `flex:1 1 auto;display:grid;grid-template-columns:${columns};` + `align-items:center;align-content:start;` + `column-gap:${INPUT_DIALOG_GAP_PX}px;row-gap:${INPUT_DIALOG_GAP_PX}px;`;
}
const DEFAULT_INPUT_TAB = 'Inputs';
function tabInputs(inputs) {
    const byTab = new Map();
    for (const inp of inputs){
        const name = inp.tab && inp.tab.length > 0 ? inp.tab : DEFAULT_INPUT_TAB;
        if (!byTab.has(name)) byTab.set(name, []);
        byTab.get(name).push(inp);
    }
    const names = [
        ...byTab.keys()
    ];
    if (names.includes(DEFAULT_INPUT_TAB)) {
        names.splice(names.indexOf(DEFAULT_INPUT_TAB), 1);
        names.unshift(DEFAULT_INPUT_TAB);
    }
    return names.map((name)=>({
            name,
            inputs: byTab.get(name)
        }));
}
/** A row shows while ANY of its `inline=` members' gates pass (a member with no gate always passes). */ function rowVisible(decls, bag) {
    return decls.some((d)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$model$2f$inputs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inputVisible"])(d.when, bag));
}
/** Current values resolved for gate evaluation: the stored value, else the input's `defval`. */ function valuesBag(row) {
    const bag = {};
    for (const inp of row.inputs)bag[inp.key] = row.values[inp.key] ?? inp.defval;
    return bag;
}
/**
 * Bucket inputs into `group=` sections (first-seen order — a section appears at its first
 * member's position, ungrouped inputs stay where declared) and, within each, collapse
 * inputs that share an `inline=` id onto one row (Pine convention).
 */ function groupInputs(inputs) {
    const order = [];
    const byGroup = new Map();
    for (const inp of inputs){
        const g = inp.group && inp.group.length > 0 ? inp.group : null;
        if (!byGroup.has(g)) {
            byGroup.set(g, []);
            order.push(g);
        }
        byGroup.get(g).push(inp);
    }
    return order.map((name)=>{
        const members = byGroup.get(name);
        const rows = [];
        const inlineRowIndex = new Map();
        for (const inp of members){
            const inline = inp.inline && inp.inline.length > 0 ? inp.inline : null;
            if (inline && inlineRowIndex.has(inline)) {
                rows[inlineRowIndex.get(inline)].push(inp);
            } else {
                if (inline) inlineRowIndex.set(inline, rows.length);
                rows.push([
                    inp
                ]);
            }
        }
        return {
            name,
            rows
        };
    });
}
const CALENDAR_SVG = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["iconAt"])('calendar', 14);
const CLOCK_SVG = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["iconAt"])('clock', 14);
const DIALOG_STYLE_ID = 'vela-ind-dialog-styles';
/** Bump when the injected sheet's rules change so an already-mounted page refreshes them. */ const DIALOG_STYLE_REV = '30';
const LEGEND_ICON_PX = 16;
function ensureDialogStyles() {
    if (typeof document === 'undefined') return;
    const existing = document.getElementById(DIALOG_STYLE_ID);
    if (existing?.dataset.rev === DIALOG_STYLE_REV) return;
    const s = existing ?? document.createElement('style');
    s.id = DIALOG_STYLE_ID;
    s.dataset.rev = DIALOG_STYLE_REV;
    s.textContent = `
.vela-ind-combo input{${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["FIELD_FOCUS_CSS"]}}
.vela-ind-combo input:hover{border-color:var(--vela-fg-muted);}
.vela-ind-combo input:focus{${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["FIELD_FOCUS_RING"]}}
.vela-ind-combo-chevron{position:absolute;right:0;top:0;bottom:0;width:26px;border:none;background:transparent;color:inherit;opacity:0.55;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;}
.vela-ind-combo-chevron:hover{opacity:0.9;}
.vela-ind-cal{background:var(--vela-bg);color:var(--vela-fg);border:none;border-radius:6px;box-shadow:var(--vela-shadow);font:14px var(--vela-font);padding:10px 12px;user-select:none;}
${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["overlayScrollbarCss"])('.vela-dialog.vela-ind-dialog *', 9)}
.vela-ind-tab{font-weight:600;font-size:13px;line-height:20px;transition:color var(--vela-dur-fast) ease,border-color var(--vela-dur-fast) ease;}
.vela-ind-tab:not(.vela-ind-tab-active):hover{color:var(--vela-fg-bright);}
.vela-ind-ctl,.vela-ind-close{background-color:transparent;color:inherit;transition:color var(--vela-dur-fast) ease,background-color var(--vela-dur-fast) ease;}
.vela-ind-ctl svg,.vela-ind-close svg{width:${LEGEND_ICON_PX}px;height:${LEGEND_ICON_PX}px;display:block;flex:none;stroke-width:1;}
.vela-ind-ctl:hover{background-color:var(--vela-hover-strong);}
.vela-ind-close:hover{color:var(--vela-danger) !important;background-color:var(--vela-hover-strong);}
.vela-ind-fold{transition:border-color var(--vela-dur-fast) ease,opacity var(--vela-dur-fast) ease;}
.vela-ind-fold:hover{border-color:var(--vela-border-strong);opacity:0.9;}`;
    if (!existing) document.head.appendChild(s);
}
/** `input.timeframe` choices — label shown, Pine resolution string committed (`''` = chart's). */ const TIMEFRAME_OPTIONS = [
    {
        value: '',
        label: 'Chart'
    },
    {
        value: '1',
        label: '1 minute'
    },
    {
        value: '3',
        label: '3 minutes'
    },
    {
        value: '5',
        label: '5 minutes'
    },
    {
        value: '15',
        label: '15 minutes'
    },
    {
        value: '30',
        label: '30 minutes'
    },
    {
        value: '45',
        label: '45 minutes'
    },
    {
        value: '60',
        label: '1 hour'
    },
    {
        value: '120',
        label: '2 hours'
    },
    {
        value: '180',
        label: '3 hours'
    },
    {
        value: '240',
        label: '4 hours'
    },
    {
        value: 'D',
        label: '1 day'
    },
    {
        value: 'W',
        label: '1 week'
    },
    {
        value: 'M',
        label: '1 month'
    }
];
/** HH:MM options at 30-minute steps (`00:00` … `23:30`) for the session + time dropdowns. */ const TIME_OPTIONS = Array.from({
    length: 48
}, (_, i)=>{
    const hh = String(Math.floor(i / 2)).padStart(2, '0');
    const mm = i % 2 === 0 ? '00' : '30';
    const v = `${hh}:${mm}`;
    return {
        value: v,
        label: v
    };
});
;
function normalizeTimeInput(raw) {
    const t = raw.trim();
    const m = /^(\d{1,2}):(\d{2})$/.exec(t) ?? /^(\d{2})(\d{2})$/.exec(t);
    if (!m) return null;
    const hh = Number(m[1]);
    const mm = Number(m[2]);
    if (hh > 23 || mm > 59) return null;
    return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}
/** Split a Pine `HHMM-HHMM` session into two `HH:MM` strings (defaults `09:00`–`16:00`). */ function sessionToTimes(session) {
    const m = /^(\d{2})(\d{2})-(\d{2})(\d{2})$/.exec(session.trim());
    if (!m) return [
        '09:00',
        '16:00'
    ];
    return [
        `${m[1]}:${m[2]}`,
        `${m[3]}:${m[4]}`
    ];
}
/** Recombine two `HH:MM` strings into a Pine `HHMM-HHMM` session string. */ function timesToSession(start, end) {
    return `${start.replace(':', '')}-${end.replace(':', '')}`;
}
/** Split an epoch timestamp (s or ms) into a `YYYY-MM-DD` date + a 30-min-snapped `HH:MM`. */ function timeParts(ts) {
    if (!ts) return {
        date: '',
        time: '09:30'
    };
    const ms = ts < 1e12 ? ts * 1000 : ts; // Pine epochs may arrive in seconds
    const d = new Date(ms);
    if (Number.isNaN(d.getTime())) return {
        date: '',
        time: '09:30'
    };
    const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const snapped = Math.round((d.getHours() * 60 + d.getMinutes()) / 30) * 30;
    const hh = String(Math.floor(snapped / 60) % 24).padStart(2, '0');
    const mm = String(snapped % 60).padStart(2, '0');
    return {
        date,
        time: `${hh}:${mm}`
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/renderers/shared/InputsUI.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "InputsUI",
    ()=>InputsUI,
    "LEGEND_AT_TOP_ATTR",
    ()=>LEGEND_AT_TOP_ATTR,
    "legendCalloutsDisplay",
    ()=>legendCalloutsDisplay
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$color$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/color.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/icons.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$renderers$2f$shared$2f$theme$2d$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/renderers/shared/theme-tokens.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$renderers$2f$shared$2f$chrome$2d$tooltip$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/renderers/shared/chrome-tooltip.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$menu$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/menu/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$menu$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/menu/view.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$callout$2d$bubble$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/callout-bubble/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$callout$2d$bubble$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/callout-bubble/view.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$renderers$2f$shared$2f$IndicatorInputsDialog$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/renderers/shared/IndicatorInputsDialog.ts [app-client] (ecmascript) <locals>");
;
;
;
;
;
;
;
;
const LEGEND_AT_TOP_ATTR = 'data-vela-pane-at-top';
/** Keyframes for the legend-row live pulse, injected once into the document (the load
 *  dots animate through the Web Animations API and need no stylesheet). */ const STATUS_KEYFRAMES = '@keyframes vela-ind-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.3;transform:scale(.6)}}';
/** Legend glyph size — the row's own font belongs to the indicator title beside them. */ const LEGEND_ICON_PX = 16;
/** Equal hit target for every legend-row action (eye / gear / move / extras / ✕). Compact
 *  enough to sit on the title's line box so revealing the cluster does not grow the chip. */ const LEGEND_CTL_PX = 18;
const LEGEND_ROW_PAD_Y = 2;
const LEGEND_ROW_PAD_X = 6;
/** Space between the indicator title and the plot-values readout to its right. */ const LEGEND_TITLE_VALUES_GAP_PX = 6;
/** Space between the title and the loading/live status (the values gap plus a little
 *  air — 4px dots flush against 12px type read as glued on). */ const LEGEND_TITLE_STATUS_GAP_PX = 8;
/** Uniform space: title → first action icon, and between every action icon. */ const LEGEND_ACTION_GAP_PX = 6;
const LEGEND_CTL_CSS = `cursor:pointer;display:inline-flex;align-items:center;justify-content:center;` + `border:none;line-height:0;padding:0;` + `width:${LEGEND_CTL_PX}px;height:${LEGEND_CTL_PX}px;border-radius:3px;box-sizing:border-box;flex:none;`;
const LEGEND_ROW_MIN_H = LEGEND_CTL_PX + LEGEND_ROW_PAD_Y * 2;
const EYE_SVG = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["iconAt"])('eye', LEGEND_ICON_PX);
const EYE_OFF_SVG = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["iconAt"])('eye-off', LEGEND_ICON_PX);
const GEAR_SVG = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["iconAt"])('gear', LEGEND_ICON_PX);
const CLOSE_SVG = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["iconAt"])('close', LEGEND_ICON_PX);
const FOLD_SVG = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["iconAt"])('chevron-up', LEGEND_ICON_PX);
const UNFOLD_SVG = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["iconAt"])('chevron-down', LEGEND_ICON_PX);
const OVERVIEW_SVG = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["iconAt"])('objects', LEGEND_ICON_PX);
function legendCalloutsDisplay(open, hasCallouts) {
    return !open && hasCallouts ? 'inline-flex' : 'none';
}
class InputsUI {
    container;
    theme;
    paneBoundsOf;
    legends;
    rows;
    inputsDialog;
    /** The legend row the user has clicked to select (gets a neutral outline); null when none. */ selectedId;
    onChange;
    onRemove;
    onToggleVisible;
    /** Host symbol picker for `input.symbol`; when set the control opens the host's ticker UI. */ symbolPicker;
    /** Mobile chrome: the inputs dialog opens fullscreen and the legends render compact. */ mobileLayout;
    /** Pane move/merge hook — when set, rows get a "Move to" menu + become drag-to-pane sources. */ moveApi;
    /** Host-contributed legend actions, resolved PER ROW at render time (see setLegendActions). */ legendActions;
    /** Host-contributed callout bubbles, resolved PER ROW at render time (see setLegendCallouts). */ legendCallouts;
    /** Chrome-tooltip disposers, per row id — a tip open at removal must not outlive its row. */ rowTips;
    /** Same, for the contributed extras only (rebuilt independently by setLegendActions). */ extrasTips;
    /** Same, for the contributed callouts only (rebuilt independently by setLegendCallouts). */ calloutTips;
    /** Open "Move to" menu (kept so it can be torn down). */ moveMenu;
    moveTargets;
    moveMenuId;
    /** Collapsed panes → the master indicator id to keep visible (others hidden in the strip). */ paneCollapse;
    /** The user folded the indicator legend away behind the chevron — CHART-WIDE: every
     *  pane's rows hide (a pane-collapse strip keeps its master label, its only marker),
     *  unlike {@link paneCollapse} which collapses one pane to a strip. */ legendFolded;
    /** Titles switched off entirely (a settings toggle): every pane's legend container
     *  hides — rows, fold chevron and all — unlike the fold, which leaves its chip. */ titlesVisible;
    /** Plot values shown beside the titles chart-wide (a settings toggle); a row's own
     *  context-menu choice ({@link LegendRow.showValues}) overrides it per indicator. */ valuesVisible;
    /** Open legend-row context menu (kept so it can be torn down). */ rowMenu;
    rowMenuId;
    /** The single fold toggle, on the price-pane legend: a bordered ^ chevron under the
     *  rows, or the bordered "˅ N" chip (N counts every pane's indicators) when folded. */ foldToggle;
    /** Host-provided replacement for the fold toggle (multi-chart shells route it to
     *  their indicator overview, e.g. an object tree). While set, the legend stays
     *  folded and the chip runs this instead of unfolding inline. */ overviewAction;
    /** Clear the selection outline when the user clicks anywhere that isn't one of our legend rows. */ onDocClick;
    /** Where the MODAL settings dialog mounts (default: the container). Multi-chart
     *  shells point this at their root so the dialog centers globally — the inline
     *  pane-anchored rows always stay in the container. */ dialogHost;
    setDialogHost(host) {
        this.dialogHost = host;
        if (host && getComputedStyle(host).position === 'static') host.style.position = 'relative';
    }
    constructor(container, theme, paneBoundsOf){
        this.container = container;
        this.theme = theme;
        this.paneBoundsOf = paneBoundsOf;
        this.legends = new Map(); // paneId → legend container
        this.rows = new Map();
        this.selectedId = null;
        this.onChange = null;
        this.onRemove = null;
        this.onToggleVisible = null;
        this.symbolPicker = null;
        this.mobileLayout = false;
        this.moveApi = null;
        this.legendActions = null;
        this.legendCallouts = null;
        this.rowTips = new Map();
        this.extrasTips = new Map();
        this.calloutTips = new Map();
        this.moveMenu = null;
        this.moveTargets = [];
        this.moveMenuId = null;
        this.paneCollapse = new Map();
        this.legendFolded = false;
        this.titlesVisible = true;
        this.valuesVisible = true;
        this.rowMenu = null;
        this.rowMenuId = null;
        this.foldToggle = null;
        this.overviewAction = null;
        this.onDocClick = (e)=>{
            if (!this.selectedId) return;
            const target = e.target;
            if (target) {
                for (const row of this.rows.values())if (row.el.contains(target)) return;
            }
            this.clearSelection();
        };
        this.dialogHost = null;
        if (!container.style.position) container.style.position = 'relative';
        if (typeof document !== 'undefined') document.addEventListener('click', this.onDocClick);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$renderers$2f$shared$2f$IndicatorInputsDialog$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ensureDialogStyles"])();
        this.inputsDialog = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$renderers$2f$shared$2f$IndicatorInputsDialog$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["IndicatorInputsDialog"]({
            container,
            theme: ()=>this.theme,
            mobile: ()=>this.mobileLayout,
            dialogHost: ()=>this.dialogHost,
            symbolPicker: ()=>this.symbolPicker,
            onChange: (c)=>this.onChange?.(c),
            onBackdropClose: ()=>this.clearSelection()
        });
    }
    /** The host shell's chrome size class — mobile makes the inputs dialog fullscreen
     *  (an open dialog re-presents on the flip) and folds the legend behind its chip by
     *  default (a phone-width plot has no room for the rows). */ setLayoutMode(mode) {
        const mobile = mode === 'mobile';
        if (mobile === this.mobileLayout) return;
        this.mobileLayout = mobile;
        // The fold resets to the mode's presentation default on a flip — it is chrome
        // presentation, not user state (an overview override keeps it folded either way).
        if (this.overviewAction === null) this.legendFolded = mobile;
        this.syncFoldToggle();
        if (this.inputsDialog.openId !== null) {
            const id = this.inputsDialog.openId;
            this.closeOpenDialog();
            this.openDialog(id);
        }
    }
    /** Replace the fold toggle's behavior with a HOST action (or restore it with null):
     *  the chip stays — objects icon + indicator count — but a press runs the action
     *  (a multi-chart shell opens its indicator overview) instead of unfolding the rows,
     *  which stay hidden while the override is in force. */ setLegendOverviewAction(action) {
        if (action === this.overviewAction) return;
        this.overviewAction = action;
        this.legendFolded = action !== null ? true : this.mobileLayout;
        this.syncFoldToggle();
    }
    /** Open the settings dialog of one indicator (the legend gear's programmatic twin) —
     *  no-op for an unknown id. */ openSettingsFor(id) {
        if (this.rows.has(id)) this.openDialog(id);
    }
    /** Attach a themed chrome tooltip to a control, recording its disposer under `id`. */ tip(store, id, anchor, text, wrap = false) {
        const list = store.get(id) ?? [];
        list.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$renderers$2f$shared$2f$chrome$2d$tooltip$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["attachChromeTooltip"])(anchor, {
            host: this.container,
            theme: ()=>this.theme,
            text: typeof text === 'function' ? text : ()=>text,
            wrap
        }));
        store.set(id, list);
    }
    disposeTips(store, id) {
        for (const dispose of store.get(id) ?? [])dispose();
        store.delete(id);
    }
    setOnChange(cb) {
        this.onChange = cb;
    }
    /** Report a ✕ legend click so the core can tear down that indicator. */ setOnRemove(cb) {
        this.onRemove = cb;
    }
    /**
     * Report an eye legend click so the core can hide/show that indicator. Setting this also
     * enables the eye control on every row (gated, so a renderer that can't suspend an indicator
     * — i.e. never calls this — simply shows no eye).
     */ setOnToggleVisible(cb) {
        this.onToggleVisible = cb;
    }
    setTheme(theme) {
        this.theme = theme;
        // Legend containers carry the CHART theme tokens (not the wrapper's stable chrome
        // surface): row fills and action-button hovers sit on the plot background, which can
        // diverge from the app chrome when the host edits layout.background.
        for (const lg of this.legends.values())(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$renderers$2f$shared$2f$theme$2d$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyChromeTokens"])(lg, theme);
        // Rows carry the chart background as an INLINE fill (translucent when idle, solid
        // when open) — repaint them, or a `layout.background` edit leaves stale chips
        // floating over the plot. "Open" is what setRowHighlighted made visible.
        for (const row of this.rows.values()){
            row.el.style.background = row.highlighted ? theme.background : this.idleRowFill();
            row.el.style.color = theme.textColor;
        }
        if (this.foldToggle) this.syncFoldToggle(); // rebuild so fill + ink follow the new theme
    }
    /** Provide (or clear) the host symbol picker that `input.symbol` opens on activation. */ setSymbolPicker(picker) {
        this.symbolPicker = picker;
    }
    /** Enable legend-driven move/merge (a "Move to" menu + drag-to-pane). Null disables it. */ setMoveApi(api) {
        this.moveApi = api;
    }
    /**
     * Wire the host-contributed row actions. Re-calling replaces the provider and
     * re-projects the rows already on screen (a late `registerLegendAction` appears after
     * the shell's `refreshActions()`, same as every other contribution).
     */ setLegendActions(provider) {
        this.legendActions = provider;
        for (const row of this.rows.values())this.renderExtras(row.id, row.extrasEl);
    }
    /** (Re)build one row's contributed buttons. Same look, reveal and tooltips as the built-ins. */ renderExtras(id, extrasEl) {
        this.disposeTips(this.extrasTips, id);
        extrasEl.replaceChildren();
        for (const action of this.legendActions?.(id) ?? []){
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.setAttribute('aria-label', action.tooltip);
            this.tip(this.extrasTips, id, btn, action.tooltip);
            btn.innerHTML = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["iconAt"])(action.icon, LEGEND_ICON_PX);
            btn.className = 'vela-ind-ctl';
            btn.dataset.legendAction = action.id;
            btn.style.cssText = LEGEND_CTL_CSS;
            btn.addEventListener('click', (e)=>{
                e.stopPropagation(); // selecting the row is not the intent
                action.run();
            });
            extrasEl.appendChild(btn);
        }
    }
    /**
     * Wire the host-contributed callout bubbles. Same contract as
     * {@link setLegendActions}: re-calling replaces the provider and re-projects the
     * rows already on screen.
     */ setLegendCallouts(provider) {
        this.legendCallouts = provider;
        for (const row of this.rows.values())this.renderCallouts(row);
    }
    /** (Re)build one row's callout bubbles — tinted icon circles beside the title whose
     *  click (when the view carries content) deploys a panel of text and actions. */ renderCallouts(row) {
        this.disposeTips(this.calloutTips, row.id);
        for (const bubble of row.callouts)bubble.destroy();
        row.callouts = [];
        row.calloutsEl.replaceChildren();
        const views = this.legendCallouts?.(row.id) ?? [];
        row.calloutsEl.style.display = legendCalloutsDisplay(row.highlighted, views.length > 0);
        for (const view of views){
            const bubble = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$callout$2d$bubble$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CalloutBubble"]({
                icon: view.icon,
                background: view.background,
                ...view.color !== undefined ? {
                    color: view.color
                } : {},
                label: view.tooltip,
                ...view.content !== undefined ? {
                    panel: view.content
                } : {},
                // The panel portals into the plot host and self-tokens: it must work on
                // a bare chart, where no `.vela-ui` token ancestor exists.
                host: this.container,
                theme: ()=>this.theme
            });
            bubble.el.dataset.legendCallout = view.id;
            this.tip(this.calloutTips, row.id, bubble.el, view.tooltip);
            row.callouts.push(bubble);
            row.calloutsEl.appendChild(bubble.el);
        }
    }
    /** Reposition the per-pane legend containers after a layout change. */ reposition() {
        for (const [paneId, lg] of this.legends)this.positionLegend(lg, paneId);
    }
    /** Show/hide the indicator titles chart-wide (the settings dialog's Indicators toggle). */ setTitlesVisible(visible) {
        if (this.titlesVisible === visible) return;
        this.titlesVisible = visible;
        this.reposition(); // positionLegend applies the flag per pane
    }
    /**
     * Show/hide the plot values chart-wide (the settings dialog's Indicators → Values
     * toggle). "All" is meant literally: per-row context-menu overrides are cleared, so
     * every legend follows the new state.
     */ setValuesVisible(visible) {
        this.valuesVisible = visible;
        for (const row of this.rows.values()){
            row.showValues = null;
            this.renderRowValues(row);
        }
    }
    /**
     * Push the current plot values of every indicator at once (the renderer calls this per
     * paint). Rows absent from the map (e.g. a hidden indicator) show no values. Cheap on
     * unchanged frames: each row diffs against its last rendered values before touching DOM.
     */ setPlotValues(values) {
        for (const row of this.rows.values()){
            const next = values.get(row.id) ?? [];
            const key = next.map((v)=>`${v.value}|${v.color}`).join('\u0000');
            if (key === row.plotValuesKey) continue;
            row.plotValues = next;
            row.plotValuesKey = key;
            this.renderRowValues(row);
        }
    }
    /** Whether a row currently shows its values: its own override, else the chart-wide flag. */ rowValuesShown(row) {
        return row.showValues ?? this.valuesVisible;
    }
    /** (Re)build one row's values readout from its stored plot values + visibility. A
     *  highlighted (hovered/selected) row shows only the title + controls — no values. */ renderRowValues(row) {
        if (!this.rowValuesShown(row) || row.plotValues.length === 0 || row.highlighted) {
            row.valuesEl.style.display = 'none';
            row.valuesEl.replaceChildren();
            return;
        }
        row.valuesEl.style.display = 'inline-flex';
        row.valuesEl.replaceChildren();
        for (const v of row.plotValues){
            const span = document.createElement('span');
            span.textContent = v.value;
            span.style.color = v.color;
            row.valuesEl.appendChild(span);
        }
    }
    // ── legend move/merge (menu + drag) ─────────────────────────────────────
    /** Open the "Move to" menu for a row, anchored under its move button. */ openMoveMenu(id, anchor) {
        this.closeMoveMenu();
        const api = this.moveApi;
        if (!api) return;
        const row = this.rows.get(id);
        const currentPane = row?.paneId ?? 'price';
        const panes = api.panes();
        const items = [];
        for (const p of panes){
            if (p.id === currentPane) continue;
            items.push({
                label: `Move to ${p.label}`,
                target: p.kind === 'price' ? 'price' : {
                    pane: p.id
                }
            });
        }
        // Offer only moves that actually change something:
        //  • the sole indicator of a study pane owns it already — a "new pane" beside its own
        //    pane just recreates the same layout (the emptied pane dissolves), so skip both;
        //  • panes never sit above the price pane, so "New pane above" is meaningless there.
        const soleInStudyPane = currentPane !== 'price' && [
            ...this.rows.values()
        ].filter((r)=>r.paneId === currentPane).length <= 1;
        if (!soleInStudyPane) {
            if (currentPane !== 'price') items.push({
                label: 'New pane above',
                target: {
                    newPane: {
                        before: currentPane
                    }
                }
            });
            items.push({
                label: 'New pane below',
                target: {
                    newPane: {
                        after: currentPane
                    }
                }
            });
        }
        this.moveTargets = items.map((it)=>it.target);
        this.moveMenuId = id;
        const descriptors = items.map((it, i)=>({
                id: String(i),
                label: it.label
            }));
        if (!this.moveMenu) {
            this.moveMenu = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$menu$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Menu"]({
                host: this.container,
                items: descriptors,
                placement: 'bottom-start',
                onSelect: (itemId)=>{
                    const target = this.moveTargets[Number(itemId)];
                    const rowId = this.moveMenuId;
                    if (target && rowId) api.move(rowId, target);
                }
            });
        } else {
            this.moveMenu.setItems(descriptors);
        }
        const r = anchor.getBoundingClientRect();
        this.moveMenu.openAt(r.left, r.bottom + 4);
    }
    closeMoveMenu() {
        this.moveMenu?.close();
    }
    // ── legend row context menu (right-click) ───────────────────────────────
    /** Open the row's action menu at the pointer. One entry today: the values toggle. */ openRowMenu(id, x, y) {
        this.closeRowMenu();
        this.closeMoveMenu();
        const row = this.rows.get(id);
        if (!row) return;
        this.rowMenuId = id;
        const items = [
            {
                id: 'values',
                label: 'Indicator values',
                checked: this.rowValuesShown(row)
            }
        ];
        if (!this.rowMenu) {
            this.rowMenu = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$menu$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Menu"]({
                host: this.container,
                items,
                placement: 'bottom-start',
                // Right-click action menu — checked state reads as a leading ✓ (see the kit Menu).
                checkmarks: true,
                onSelect: (itemId)=>{
                    if (itemId !== 'values' || !this.rowMenuId) return;
                    const target = this.rows.get(this.rowMenuId);
                    if (!target) return;
                    target.showValues = !this.rowValuesShown(target);
                    this.renderRowValues(target);
                }
            });
        } else {
            this.rowMenu.setItems(items);
        }
        this.rowMenu.openAt(x, y);
    }
    closeRowMenu() {
        this.rowMenu?.close();
    }
    /** Move a legend row to another pane (indicator merged/moved), tidying an emptied container. */ setPane(id, paneId) {
        const row = this.rows.get(id);
        if (!row || row.paneId === paneId) return;
        const prev = row.paneId;
        row.paneId = paneId;
        this.attach(this.legendFor(paneId), row.el, row.native);
        this.syncFoldToggle(); // a moved row must follow the fold state in its new pane
        if (prev !== 'price') {
            const lg = this.legends.get(prev);
            if (lg && lg.childElementCount === 0) {
                lg.remove();
                this.legends.delete(prev);
            }
        }
    }
    legendFor(paneId) {
        let lg = this.legends.get(paneId);
        if (!lg) {
            lg = document.createElement('div');
            // Tag with the pane id so a host app can locate each pane's legend (and thus
            // its on-screen bounds) — e.g. to re-anchor its own per-pane overlays.
            lg.dataset.velaPane = paneId;
            lg.style.cssText = 'position:absolute;left:10px;z-index:5;display:flex;flex-direction:column;align-items:flex-start;gap:0;pointer-events:none;font:12px -apple-system,Segoe UI,sans-serif;';
            // Chart-theme tokens so action-button hovers wash against the plot surface the
            // rows sit on (the wrapper beneath may carry the host's stable chrome surface).
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$renderers$2f$shared$2f$theme$2d$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyChromeTokens"])(lg, this.theme);
            this.positionLegend(lg, paneId);
            this.container.appendChild(lg);
            this.legends.set(paneId, lg);
        }
        return lg;
    }
    positionLegend(lg, paneId) {
        const bounds = this.paneBoundsOf ? this.paneBoundsOf(paneId) : {
            top: 0,
            height: Infinity
        };
        // Publish whether this legend's pane sits at the very top of the plot (see
        // LEGEND_AT_TOP_ATTR) — the price pane normally, or a maximized study pane filling it.
        lg.toggleAttribute(LEGEND_AT_TOP_ATTR, bounds.top === 0);
        // A pane hidden by a maximize elsewhere collapses to ~0 height — hide its legend entirely
        // (a collapsed strip keeps a small height, so its title still shows). Titles switched
        // off (the settings toggle) hide every pane's container the same way. Restore to 'flex'
        // (the container's intended layout — set in its cssText), NOT '' which would revert it
        // to block: block children stretch to the widest row, fusing the chips into one slab.
        lg.style.display = bounds.height < 4 || !this.titlesVisible ? 'none' : 'flex';
        // A collapsed pane is a legend-only strip: show just its master indicator's row. Restore
        // hidden rows to 'flex' (their intended layout — set in the row's cssText), NOT '' which
        // would revert them to block and break the inline button row (hide/show, settings, …).
        // A FOLDED legend (the chevron under the price-pane rows) hides every pane's rows —
        // study panes included — leaving only the bordered "˅ N" chip; a strip keeps its
        // master label, since that label is the strip's only marker.
        const collapsed = this.paneCollapse.has(paneId);
        const masterId = this.paneCollapse.get(paneId) ?? null;
        for (const row of this.rows.values()){
            if (row.paneId !== paneId) continue;
            row.el.style.display = (collapsed ? row.id !== masterId : this.legendFolded) ? 'none' : 'flex';
        }
        // Expanded panes inset the legend from the top; a collapsed strip is too short for that —
        // center the single master row in it so its hover controls (hide/show, settings, …) stay
        // fully inside the strip instead of spilling onto the pane separator / axis below.
        let top = bounds.top + 8;
        if (collapsed && Number.isFinite(bounds.height)) {
            const rowH = lg.offsetHeight || 20;
            top = bounds.top + Math.max(1, Math.round((bounds.height - rowH) / 2));
        }
        lg.style.top = `${top}px`;
    }
    /** Set which panes are collapsed and, for each, the master indicator to keep in its strip. */ setCollapsedPanes(map) {
        this.paneCollapse = map;
    }
    /**
     * Keep the fold toggle in step with the indicator count: with 2+ indicators anywhere
     * on the chart, a bordered ^ chevron sits under the price-pane rows (click folds every
     * pane's rows away — study panes included — leaving a bordered "˅ N" chip that unfolds
     * them); with fewer, the toggle disappears and a fold in force is undone. Re-appended
     * last so {@link attach}'s prepend/append never leaves it above a row.
     */ syncFoldToggle() {
        const count = this.rows.size;
        // Desktop earns the chevron at 2+ rows; mobile folds even a lone row behind the
        // chip (the legend is collapsed by default there), and a host overview override
        // needs the chip from the first row — it is the list's only entry point.
        const minRows = this.overviewAction !== null || this.mobileLayout ? 1 : 2;
        if (count < minRows) {
            const wasFolded = this.legendFolded;
            // Never strand a surviving row hidden behind a toggle that just disappeared;
            // with no rows at all the fold keeps its default for the next indicator.
            if (count > 0) this.legendFolded = false;
            if (this.foldToggle) {
                this.foldToggle.remove();
                this.foldToggle = null;
                this.disposeTips(this.rowTips, 'fold');
            }
            if (wasFolded && count > 0) this.reposition(); // unhide the surviving row(s)
            return;
        }
        let btn = this.foldToggle;
        if (!btn) {
            btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'vela-ind-fold';
            this.tip(this.rowTips, 'fold', btn, ()=>this.overviewAction !== null ? 'Indicators' : this.legendFolded ? 'Show indicator legend' : 'Hide indicator legend');
            btn.addEventListener('click', ()=>{
                if (this.overviewAction !== null) {
                    this.overviewAction();
                    return;
                }
                this.legendFolded = !this.legendFolded;
                this.syncFoldToggle();
            });
            this.foldToggle = btn;
        }
        const folded = this.legendFolded;
        btn.setAttribute('aria-label', this.overviewAction !== null ? 'Indicators' : folded ? 'Show indicator legend' : 'Hide indicator legend');
        // Bordered chip in both states; folded shows chevron then the count to its right
        // (reference: "˅ 12"), expanded is just the up chevron that folds the list away.
        // Fill AND ink follow the LIVE plot theme (same as legend rows) — chrome tokens
        // track the app surface, so a white plot on a dark app would otherwise put a
        // near-white count on a white chip. Extra margin-top clears the last indicator
        // title; the legend column's own 3px gap is too tight under a bordered chip.
        const ink = this.theme.textColor;
        btn.style.cssText = `pointer-events:auto;display:inline-flex;align-items:center;gap:4px;background:${this.theme.background};color:${ink};border:1px solid ${this.theme.borderColor};border-radius:4px;padding:2px 6px;margin-top:6px;cursor:pointer;font:inherit;line-height:0;`;
        btn.replaceChildren();
        const icon = document.createElement('span');
        // Slightly muted against the count — currentColor rides the button's ink.
        icon.style.cssText = 'display:inline-flex;align-items:center;line-height:0;opacity:0.7;';
        // The overview override wears the list glyph — the chip opens the host's
        // indicator overview rather than unfolding rows in place.
        icon.innerHTML = this.overviewAction !== null ? OVERVIEW_SVG : folded ? UNFOLD_SVG : FOLD_SVG;
        btn.appendChild(icon);
        if (folded) {
            const label = document.createElement('span');
            label.textContent = String(count);
            label.style.cssText = `font-weight:600;line-height:normal;font-size:12px;color:${ink};`;
            btn.appendChild(label);
        }
        // The toggle lives on the PRICE pane's legend (created on demand — the price pane
        // may carry no indicator itself while study panes do).
        this.legendFor('price').appendChild(btn);
        this.reposition(); // every pane's rows follow the fold, not just the price pane's
    }
    /** Create or update an indicator's legend row (in the legend for its pane). */ upsert(id, title, inputs, values, paneId = 'price', opts = {}) {
        const existing = this.rows.get(id);
        if (existing) {
            existing.title = title;
            existing.inputs = inputs;
            existing.values = {
                ...values
            };
            existing.props = opts.props ?? [];
            existing.propValues = {
                ...opts.propValues ?? {}
            };
            existing.titleEl.textContent = title;
            if (existing.paneId !== paneId) {
                existing.paneId = paneId;
                this.attach(this.legendFor(paneId), existing.el, existing.native);
                this.syncFoldToggle(); // a re-routed row must follow the fold state in its new pane
            }
            return;
        }
        // The row's control buttons draw their states from the shared scoped sheet, which must
        // therefore exist as soon as a legend row does — not only once a dialog has opened.
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$renderers$2f$shared$2f$IndicatorInputsDialog$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ensureDialogStyles"])();
        const el = document.createElement('div');
        // Idle rows are translucent chips sized by their title (status dot and controls are
        // hidden) — enough wash to keep the label legible when candles reach it, without a
        // solid block over the plot. Hovering/selecting fills the chip with the solid chart
        // background so the revealed outline and controls stay readable (see setRowHighlighted).
        // Symmetric horizontal padding keeps the title clear of the hover outline; the
        // negative left margin cancels the left padding so the title's left edge still shares
        // the statusline avatar's left edge (both sit at the legend column's left:10px).
        // min-height matches the action hit targets so revealing them never grows the chip
        // vertically (which would shove the rows below).
        el.style.cssText = `pointer-events:auto;display:flex;align-items:center;` + `background:${this.idleRowFill()};border-radius:4px;` + `padding:${LEGEND_ROW_PAD_Y}px ${LEGEND_ROW_PAD_X}px;margin-left:-${LEGEND_ROW_PAD_X}px;` + `min-height:${LEGEND_ROW_MIN_H}px;box-sizing:border-box;` + `color:${this.theme.textColor};user-select:none;-webkit-user-select:none;`;
        // Reveal actions only from the TITLE (not the plot-values readout). Leave still
        // closes on the whole row so the pointer can move title → buttons without flicker.
        el.addEventListener('mouseleave', ()=>{
            if (this.selectedId !== id) this.setRowHighlighted(id, false);
        });
        // Left-click the row (but not one of its control buttons) selects the indicator,
        // outlining it with the same neutral border as the settings inputs; a double-click
        // opens its settings dialog. Clicks that land on the eye/gear/✕ buttons keep their
        // own behavior and never toggle selection.
        el.addEventListener('click', (e)=>{
            if (e.button !== 0 || e.target.closest('button')) return;
            this.selectRow(id);
        });
        el.addEventListener('dblclick', (e)=>{
            if (e.target.closest('button')) return;
            this.openDialog(id);
        });
        // Moving an indicator to another pane is done through the row's "Move to" menu (below);
        // there is intentionally no drag-from-legend gesture (the object tree owns drag-and-drop).
        // Middle-click (mouse button 3) anywhere on the row removes the indicator — a fast
        // alternative to the ✕. Suppress the default middle-button autoscroll on press.
        el.addEventListener('mousedown', (e)=>{
            if (e.button === 1) e.preventDefault();
        });
        el.addEventListener('auxclick', (e)=>{
            if (e.button !== 1) return;
            e.preventDefault();
            this.onRemove?.(id);
        });
        // Right-click opens the row's own action menu — swallowed here so the host's
        // chart-body context menu (bound higher up the tree) doesn't open over it.
        el.addEventListener('contextmenu', (e)=>{
            e.preventDefault();
            e.stopPropagation();
            this.openRowMenu(id, e.clientX, e.clientY);
        });
        // Status indicator (right of the title): pulsing load dots while fetching, a
        // pulse while live, hidden when idle. Lives next to the title — not the row's
        // far end — so the dots stay a title companion even before values arrive.
        // While the row is open (hovered/selected) it trails the action cluster instead,
        // so the buttons stay glued to the title (see syncRowActions).
        const statusEl = document.createElement('span');
        statusEl.style.cssText = 'display:none;box-sizing:border-box;flex:none;';
        // Title (+ optional "beta" exponent) wrapped so the superscript stays glued to the label and
        // survives title-text updates (which only touch the inner span).
        const titleWrap = document.createElement('span');
        titleWrap.style.cssText = 'white-space:nowrap;';
        titleWrap.addEventListener('mouseenter', ()=>this.setRowHighlighted(id, true));
        const titleEl = document.createElement('span');
        titleEl.textContent = title;
        // Every indicator title reads in the chrome text color: where a study is computed
        // (core vs script) is an implementation detail, not something to color-code.
        titleEl.style.cssText = 'font-weight:600;';
        titleWrap.appendChild(titleEl);
        if (opts.beta) {
            const beta = document.createElement('sup');
            beta.textContent = 'beta';
            beta.style.cssText = 'font-size:8px;font-weight:700;opacity:0.7;margin-left:1px;letter-spacing:0.2px;';
            titleWrap.appendChild(beta);
        }
        el.appendChild(titleWrap);
        // Contributed callout bubbles (registerLegendCallout) — a title companion while
        // the row is idle; syncRowActions hides them while the controls are out.
        const calloutsEl = document.createElement('span');
        calloutsEl.style.cssText = `display:none;align-items:center;gap:4px;flex:none;margin-left:${LEGEND_TITLE_STATUS_GAP_PX}px;`;
        el.appendChild(calloutsEl);
        el.appendChild(statusEl);
        // Plot values readout, right of the title — filled by setPlotValues, hidden until
        // values arrive (or while the values toggle is off for this row).
        const valuesEl = document.createElement('span');
        valuesEl.style.cssText = `display:none;align-items:center;gap:5px;margin-left:${LEGEND_TITLE_VALUES_GAP_PX}px;` + `white-space:nowrap;font-variant-numeric:tabular-nums;`;
        el.appendChild(valuesEl);
        // Action cluster (eye / gear / move / extras / ✕) — one tight row of equal hit targets.
        // Revealed on hover/selection; a hidden indicator keeps its eye reachable without hover.
        const controlsEl = document.createElement('span');
        controlsEl.style.cssText = `display:none;align-items:center;gap:${LEGEND_ACTION_GAP_PX}px;flex:none;margin-left:${LEGEND_ACTION_GAP_PX}px;`;
        let eyeEl = null;
        if (this.onToggleVisible) {
            const eye = document.createElement('button');
            eye.type = 'button';
            eye.setAttribute('aria-label', 'Hide');
            this.tip(this.rowTips, id, eye, ()=>this.rows.get(id)?.hidden ? 'Show' : 'Hide');
            eye.innerHTML = EYE_SVG;
            eye.className = 'vela-ind-ctl';
            eye.style.cssText = LEGEND_CTL_CSS;
            eye.addEventListener('click', ()=>{
                const row = this.rows.get(id);
                this.onToggleVisible?.(id, Boolean(row?.hidden)); // currently hidden ⇒ request show, else hide
            });
            controlsEl.appendChild(eye);
            eyeEl = eye;
        }
        if (inputs.length > 0 || (opts.props ?? []).length > 0) {
            const gear = document.createElement('button');
            gear.type = 'button';
            gear.setAttribute('aria-label', 'Settings');
            this.tip(this.rowTips, id, gear, 'Settings');
            gear.innerHTML = GEAR_SVG;
            gear.className = 'vela-ind-ctl';
            gear.style.cssText = LEGEND_CTL_CSS;
            gear.addEventListener('click', ()=>this.openDialog(id));
            controlsEl.appendChild(gear);
        }
        // Move to — opens a small pane menu (Main chart / New pane above·below / existing panes).
        // Present only when the host wired a move API (i.e. the renderer supports pane management).
        if (this.moveApi) {
            const mv = document.createElement('button');
            mv.type = 'button';
            mv.setAttribute('aria-label', 'Move to pane');
            this.tip(this.rowTips, id, mv, 'Move to pane');
            mv.innerHTML = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["iconAt"])('move', LEGEND_ICON_PX);
            mv.className = 'vela-ind-ctl';
            mv.style.cssText = LEGEND_CTL_CSS;
            mv.addEventListener('click', (e)=>{
                e.stopPropagation();
                this.openMoveMenu(id, mv);
            });
            controlsEl.appendChild(mv);
        }
        // Host-contributed actions (registerLegendAction) — between the built-ins and ✕.
        const extrasEl = document.createElement('span');
        extrasEl.style.cssText = 'display:contents;';
        this.renderExtras(id, extrasEl);
        controlsEl.appendChild(extrasEl);
        // Remove (✕) — a built-in control to drop the indicator from the chart.
        const close = document.createElement('button');
        close.type = 'button';
        close.setAttribute('aria-label', 'Remove indicator');
        this.tip(this.rowTips, id, close, 'Remove indicator');
        close.innerHTML = CLOSE_SVG;
        close.className = 'vela-ind-close';
        close.style.cssText = LEGEND_CTL_CSS;
        close.addEventListener('click', ()=>this.onRemove?.(id));
        controlsEl.appendChild(close);
        el.appendChild(controlsEl);
        this.attach(this.legendFor(paneId), el, !!opts.native);
        const row = {
            id,
            title,
            inputs,
            values: {
                ...values
            },
            props: opts.props ?? [],
            propValues: {
                ...opts.propValues ?? {}
            },
            el,
            titleEl,
            statusEl,
            valuesEl,
            plotValues: [],
            plotValuesKey: '',
            showValues: null,
            highlighted: false,
            paneId,
            hidden: false,
            eyeEl,
            controlsEl,
            extrasEl,
            calloutsEl,
            callouts: [],
            native: !!opts.native
        };
        this.rows.set(id, row);
        this.renderCallouts(row);
        this.syncFoldToggle(); // 2+ indicators grow the fold chevron; a folded legend hides the new row too
    }
    /** Place a row in its pane's legend — native rows PREPEND (pinned to the top), Pine rows append. */ attach(container, el, native) {
        if (native) container.prepend(el);
        else container.appendChild(el);
    }
    /** Reflect programmatic input changes (so a re-opened dialog shows current values). */ setValues(id, values, props) {
        const row = this.rows.get(id);
        if (!row) return;
        row.values = {
            ...row.values,
            ...values
        };
        if (props) row.propValues = {
            ...row.propValues,
            ...props
        };
    }
    /**
     * Reflect an indicator's live status in its legend row: `'loading'` shows three pulsing
     * dots (a fetch is in flight — the same load affordance as the chart's own bar-load dots,
     * at legend scale), `'live'` a pulsing dot, `'idle'` nothing. Rendered just right of the title.
     */ setStatus(id, status) {
        const row = this.rows.get(id);
        if (!row) return;
        const el = row.statusEl;
        el.replaceChildren(); // the load dots (and their Web Animations) die with the children
        if (status === 'idle') {
            el.style.cssText = 'display:none;box-sizing:border-box;flex:none;';
            return;
        }
        if (status === 'loading') {
            // line-height:0 kills the font strut so the 4px dots are the box; translateY is
            // optical — the dots already share the title's geometric midline, but 4px discs
            // next to 12px type read a hair high without the nudge.
            el.style.cssText = `display:inline-flex;align-items:center;gap:3px;box-sizing:border-box;flex:none;` + `margin-left:${LEGEND_TITLE_STATUS_GAP_PX}px;line-height:0;transform:translateY(1px);`;
            for(let i = 0; i < 3; i += 1){
                const dot = document.createElement('span');
                dot.style.cssText = 'width:4px;height:4px;border-radius:50%;background:currentColor;opacity:0.15;flex:none;';
                // Staggered phases via negative delays — every dot animates from the first frame.
                dot.animate?.([
                    {
                        opacity: 0.12
                    },
                    {
                        opacity: 0.55
                    }
                ], {
                    duration: 800,
                    iterations: Infinity,
                    direction: 'alternate',
                    easing: 'ease-in-out',
                    delay: -i * 260
                });
                el.appendChild(dot);
            }
            return;
        }
        // live — a pulsing filled dot
        this.ensureStatusKeyframes();
        el.style.cssText = `display:inline-block;box-sizing:border-box;flex:none;width:8px;height:8px;border-radius:50%;` + `margin-left:${LEGEND_TITLE_STATUS_GAP_PX}px;transform:translateY(1px);` + `background:${this.theme.upColor};animation:vela-ind-pulse 1.2s ease-in-out infinite;`;
    }
    /** Inject the status keyframes once (idempotent). */ ensureStatusKeyframes() {
        if (typeof document === 'undefined' || document.getElementById('vela-ind-status-kf')) return;
        const style = document.createElement('style');
        style.id = 'vela-ind-status-kf';
        style.textContent = STATUS_KEYFRAMES;
        document.head.appendChild(style);
    }
    /** Mark a row hidden/shown — swaps the eye glyph and dims the row; does NOT remove it. */ setVisible(id, visible) {
        const row = this.rows.get(id);
        if (!row) return;
        row.hidden = !visible;
        row.el.style.opacity = visible ? '1' : '0.5';
        if (row.eyeEl) {
            row.eyeEl.innerHTML = visible ? EYE_SVG : EYE_OFF_SVG;
            row.eyeEl.setAttribute('aria-label', visible ? 'Hide' : 'Show'); // the tooltip reads live state itself
        }
        this.syncRowActions(row);
    }
    /**
     * Select a legend row (outlining it) and clear any previous selection, so at most one
     * indicator is highlighted at a time. Re-clicking the already-selected row is a no-op.
     */ selectRow(id) {
        if (this.selectedId === id) return;
        this.clearSelection();
        this.selectedId = id;
        this.setRowHighlighted(id, true);
    }
    /**
     * Show or hide a row's outline and eye/gear/✕ controls together — driven by title
     * hover and selection (plot values do not open the chip). An idle unselected row
     * shows just its title (+ values). Exception: a hidden indicator keeps its eye
     * visible even when idle, so it can be un-hidden without hovering.
     */ setRowHighlighted(id, highlighted) {
        const row = this.rows.get(id);
        if (!row) return;
        row.highlighted = highlighted;
        this.renderRowValues(row); // values step aside while the controls are out
        row.el.style.boxShadow = highlighted ? `inset 0 0 0 1px ${this.neutralBorder()}` : 'none';
        // The solid fill exists only while the row is open — an idle row is a translucent
        // title-sized chip that lets the plot show through while keeping the label legible.
        row.el.style.background = highlighted ? this.theme.background : this.idleRowFill();
        this.syncRowActions(row);
    }
    /**
     * Reveal the action cluster (or just the eye for a hidden indicator). Non-eye
     * buttons only appear while highlighted; the eye keeps its inline-flex from
     * construction and is shown/hidden with the cluster container.
     */ syncRowActions(row) {
        const open = row.highlighted;
        row.controlsEl.style.display = open || row.hidden ? 'inline-flex' : 'none';
        // The status indicator steps aside while the controls are out — moved after the
        // action cluster (its title-side margin rides along) — and returns to the title's
        // side when the row closes. Callout bubbles hide for the same window so they
        // don't shove the buttons aside or jump to the end of the row.
        if (open) {
            row.el.appendChild(row.statusEl);
            for (const bubble of row.callouts)bubble.hidePanel();
        } else {
            row.el.insertBefore(row.statusEl, row.valuesEl);
        }
        row.calloutsEl.style.display = legendCalloutsDisplay(open, row.callouts.length > 0);
        for (const child of Array.from(row.controlsEl.children)){
            if (!(child instanceof HTMLElement) || child === row.eyeEl) continue;
            if (child === row.extrasEl) {
                child.style.display = open ? 'contents' : 'none';
                continue;
            }
            child.style.display = open ? 'inline-flex' : 'none';
        }
    }
    /** Drop the current selection outline, if any. */ clearSelection() {
        if (!this.selectedId) return;
        this.setRowHighlighted(this.selectedId, false);
        this.selectedId = null;
    }
    remove(id) {
        const row = this.rows.get(id);
        for (const bubble of row?.callouts ?? [])bubble.destroy(); // an open panel must not outlive its row
        row?.el.remove();
        this.rows.delete(id);
        this.disposeTips(this.rowTips, id);
        this.disposeTips(this.extrasTips, id);
        this.disposeTips(this.calloutTips, id);
        if (this.selectedId === id) this.selectedId = null;
        if (this.inputsDialog.openId === id) this.inputsDialog.close();
        this.syncFoldToggle(); // below 2 indicators the chevron goes (and a fold in force lifts)
        // Drop an emptied non-price pane legend container (the pane itself is gone too).
        if (row && row.paneId !== 'price') {
            const lg = this.legends.get(row.paneId);
            if (lg && lg.childElementCount === 0) {
                lg.remove();
                this.legends.delete(row.paneId);
            }
        }
    }
    destroy() {
        this.inputsDialog.close();
        this.moveMenu?.destroy();
        this.moveMenu = null;
        this.rowMenu?.destroy();
        this.rowMenu = null;
        for (const id of [
            ...this.rowTips.keys()
        ])this.disposeTips(this.rowTips, id);
        for (const id of [
            ...this.extrasTips.keys()
        ])this.disposeTips(this.extrasTips, id);
        for (const id of [
            ...this.calloutTips.keys()
        ])this.disposeTips(this.calloutTips, id);
        for (const row of this.rows.values())for (const bubble of row.callouts)bubble.destroy();
        for (const lg of this.legends.values())lg.remove();
        this.legends.clear();
        this.rows.clear();
        this.foldToggle = null; // its element left with the legend containers
        this.legendFolded = false;
        this.selectedId = null;
        if (typeof document !== 'undefined') document.removeEventListener('click', this.onDocClick);
    }
    /** True when an indicator's settings dialog is currently open. */ isDialogOpen() {
        return this.inputsDialog.isOpen();
    }
    /**
     * Close the open settings dialog (if any), keeping any live edits — the same as **Ok** or ×.
     * Public so the host can dismiss it when it opens a competing dialog of its own.
     */ closeOpenDialog() {
        this.inputsDialog.close();
    }
    openDialog(id) {
        const row = this.rows.get(id);
        if (row) this.inputsDialog.open(row);
    }
    /** Idle legend-row fill — a translucent wash of the chart background, so the title keeps
     *  contrast when candles reach it without laying a solid block over the plot. */ idleRowFill() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$color$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["withAlpha"])(this.theme.background, 0.6);
    }
    /** Neutral field/separator border — the shared chrome border token. */ neutralBorder() {
        return 'var(--vela-border)';
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/renderers/shared/TableCanvasRenderer.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "paintTable",
    ()=>paintTable
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$renderers$2f$shared$2f$TableOverlay$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/renderers/shared/TableOverlay.ts [app-client] (ecmascript)");
;
// Mirrors the DOM TableOverlay's box model: 2px 6px cell padding, a 6px anchor
// margin, and the browser's default ~1.2 line height for `white-space: pre` text.
const PAD_X = 6;
const PAD_Y = 2;
const MARGIN = 6;
const LINE_HEIGHT = 1.2;
function paintTable(ctx, t, args, tips) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$renderers$2f$shared$2f$TableOverlay$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tableHasContent"])(t)) return;
    const layout = layoutTable(ctx, t, args);
    if (!layout || layout.w <= 0 || layout.h <= 0) return;
    const fw = t.frameColor && t.frameWidth > 0 ? t.frameWidth : 0;
    const { x, y } = anchorOrigin(t.position, layout.w + 2 * fw, layout.h + 2 * fw, args);
    const x0 = x + fw;
    const y0 = y + fw;
    // Table background behind every cell, then the outer frame stroke around it.
    if (t.bgColor) {
        ctx.fillStyle = t.bgColor;
        ctx.fillRect(x0, y0, layout.w, layout.h);
    }
    if (fw > 0 && t.frameColor) {
        ctx.strokeStyle = t.frameColor;
        ctx.lineWidth = fw;
        ctx.strokeRect(x + fw / 2, y + fw / 2, layout.w + fw, layout.h + fw);
    }
    // Column/row pixel origins (prefix sums).
    const colX = [
        0
    ];
    for (const w of layout.colW)colX.push(colX[colX.length - 1] + w);
    const rowY = [
        0
    ];
    for (const h of layout.rowH)rowY.push(rowY[rowY.length - 1] + h);
    // Cell backgrounds + text.
    const prevBaseline = ctx.textBaseline;
    const prevAlign = ctx.textAlign;
    ctx.textBaseline = 'middle';
    for (const box of layout.boxes){
        const rx = x0 + colX[box.c];
        const ry = y0 + rowY[box.r];
        const rw = colX[box.c + box.cs] - colX[box.c];
        const rh = rowY[box.r + box.rs] - rowY[box.r];
        const cell = box.cell;
        if (cell.bgColor) {
            ctx.fillStyle = cell.bgColor;
            ctx.fillRect(rx, ry, rw, rh);
        }
        const text = cell.text ?? '';
        if (text.length > 0) {
            const px = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$renderers$2f$shared$2f$TableOverlay$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fontPxOf"])(cell.textSize);
            ctx.font = cellFont(cell, px, args.theme);
            ctx.fillStyle = cell.textColor ?? args.theme.textColor;
            const lines = text.split('\n');
            const blockH = lines.length * px * LINE_HEIGHT;
            const blockTop = cell.vAlign === 'top' ? ry + PAD_Y : cell.vAlign === 'bottom' ? ry + rh - PAD_Y - blockH : ry + (rh - blockH) / 2;
            const tx = cell.hAlign === 'left' ? rx + PAD_X : cell.hAlign === 'right' ? rx + rw - PAD_X : rx + rw / 2;
            ctx.textAlign = cell.hAlign;
            lines.forEach((line, i)=>ctx.fillText(line, tx, blockTop + (i + 0.5) * px * LINE_HEIGHT));
        }
        if (cell.tooltip) tips.push({
            left: rx,
            top: ry,
            right: rx + rw,
            bottom: ry + rh,
            text: cell.tooltip
        });
    }
    ctx.textBaseline = prevBaseline;
    ctx.textAlign = prevAlign;
    // Collapsed cell borders: each grid edge stroked ONCE (adjacent cells share
    // theirs), so translucent border colors don't double up on inner lines.
    if (t.borderColor && t.borderWidth > 0) {
        ctx.strokeStyle = t.borderColor;
        ctx.lineWidth = t.borderWidth;
        const seen = new Set();
        ctx.beginPath();
        const edge = (ax, ay, bx, by)=>{
            const key = `${ax},${ay},${bx},${by}`;
            if (seen.has(key)) return;
            seen.add(key);
            ctx.moveTo(ax, ay);
            ctx.lineTo(bx, by);
        };
        for (const box of layout.boxes){
            const l = Math.round(x0 + colX[box.c]);
            const r = Math.round(x0 + colX[box.c + box.cs]);
            const tp = Math.round(y0 + rowY[box.r]);
            const bt = Math.round(y0 + rowY[box.r + box.rs]);
            edge(l, tp, r, tp);
            edge(l, bt, r, bt);
            edge(l, tp, l, bt);
            edge(r, tp, r, bt);
        }
        ctx.stroke();
    }
}
/** DOM-table auto layout, approximated: content-sized columns/rows (explicit percent
 *  sizes act as minimums, like a `width` on a `pre` cell), spans distributing their
 *  deficit evenly, and never-set cells occupying no space. */ function layoutTable(ctx, t, args) {
    const { span, omit } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$renderers$2f$shared$2f$TableOverlay$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeRenderPlan"])(t);
    const colW = new Array(t.columns).fill(0);
    const rowH = new Array(t.rows).fill(0);
    const boxes = [];
    for(let r = 0; r < t.rows; r += 1){
        for(let c = 0; c < t.columns; c += 1){
            if (omit.has(`${r}:${c}`)) continue;
            const cell = t.cells[r]?.[c];
            if (cell == null) continue; // never set via table.cell() → occupies no space
            const sp = span.get(`${r}:${c}`);
            boxes.push({
                cell,
                r,
                c,
                cs: Math.min(sp?.cs ?? 1, t.columns - c),
                rs: Math.min(sp?.rs ?? 1, t.rows - r)
            });
        }
    }
    if (boxes.length === 0) return null;
    const sizeOf = (cell)=>{
        const px = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$renderers$2f$shared$2f$TableOverlay$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fontPxOf"])(cell.textSize);
        ctx.font = cellFont(cell, px, args.theme);
        const lines = (cell.text ?? '').split('\n');
        let maxW = 0;
        for (const line of lines)maxW = Math.max(maxW, ctx.measureText(line).width);
        let w = Math.ceil(maxW) + 2 * PAD_X;
        let h = Math.ceil(lines.length * px * LINE_HEIGHT) + 2 * PAD_Y;
        if (cell.width) w = Math.max(w, cell.width / 100 * args.plotWidth);
        if (cell.height) h = Math.max(h, cell.height / 100 * args.paneHeight);
        return {
            w,
            h
        };
    };
    // Pass 1: non-spanning cells size their own column/row.
    const spanning = [];
    for (const box of boxes){
        const { w, h } = sizeOf(box.cell);
        if (box.cs === 1) colW[box.c] = Math.max(colW[box.c], w);
        if (box.rs === 1) rowH[box.r] = Math.max(rowH[box.r], h);
        if (box.cs > 1 || box.rs > 1) spanning.push({
            box,
            w,
            h
        });
    }
    // Pass 2: a span wider/taller than its tracks spreads the deficit evenly.
    for (const { box, w, h } of spanning){
        if (box.cs > 1) {
            let sum = 0;
            for(let c = box.c; c < box.c + box.cs; c += 1)sum += colW[c];
            if (w > sum) for(let c = box.c; c < box.c + box.cs; c += 1)colW[c] += (w - sum) / box.cs;
        }
        if (box.rs > 1) {
            let sum = 0;
            for(let r = box.r; r < box.r + box.rs; r += 1)sum += rowH[r];
            if (h > sum) for(let r = box.r; r < box.r + box.rs; r += 1)rowH[r] += (h - sum) / box.rs;
        }
    }
    let w = 0;
    for (const cw of colW)w += cw;
    let h = 0;
    for (const rh of rowH)h += rh;
    return {
        colW,
        rowH,
        w,
        h,
        boxes
    };
}
/** Top-left of the table's OUTER box (frame included) for a Pine `position.*` anchor —
 *  the same 6px margins and axis-clearing insets the DOM overlay computes. */ function anchorOrigin(position, totalW, totalH, args) {
    let y;
    if (position.startsWith('top')) y = MARGIN;
    else if (position.startsWith('bottom')) y = args.paneHeight - MARGIN - totalH;
    else y = args.paneHeight / 2 - totalH / 2;
    let x;
    if (position.endsWith('left')) x = MARGIN;
    else if (position.endsWith('right')) x = args.plotWidth - MARGIN - totalW;
    else x = args.plotWidth / 2 - totalW / 2;
    return {
        x,
        y
    };
}
function cellFont(cell, px, theme) {
    const family = cell.fontFamily === 'monospace' ? 'monospace' : theme.fontFamily || 'sans-serif';
    return `${cell.italic ? 'italic ' : ''}${cell.bold ? 'bold ' : ''}${px}px ${family}`;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/renderers/shared/TableOverlay.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TableOverlay",
    ()=>TableOverlay,
    "fontPxOf",
    ()=>fontPxOf,
    "mergeRenderPlan",
    ()=>mergeRenderPlan,
    "tableHasContent",
    ()=>tableHasContent
]);
const SIZE_PX = {
    auto: 13,
    tiny: 10,
    small: 11,
    normal: 13,
    large: 16,
    huge: 20
};
function fontPxOf(size) {
    if (typeof size === 'number') return size > 0 ? size : SIZE_PX.auto;
    return SIZE_PX[size] ?? SIZE_PX.auto;
}
function tableHasContent(t) {
    return t.cells.some((row)=>row?.some((c)=>c != null && !c.merged));
}
function mergeRenderPlan(t) {
    const span = new Map();
    const omit = new Set();
    for (const m of t.merges){
        span.set(`${m.startRow}:${m.startCol}`, {
            cs: m.endCol - m.startCol + 1,
            rs: m.endRow - m.startRow + 1
        });
        for(let r = m.startRow; r <= m.endRow; r += 1){
            for(let c = m.startCol; c <= m.endCol; c += 1){
                if (r !== m.startRow || c !== m.startCol) omit.add(`${r}:${c}`);
            }
        }
    }
    for(let r = 0; r < t.rows; r += 1){
        for(let c = 0; c < t.columns; c += 1){
            if (t.cells[r]?.[c]?.merged && !span.has(`${r}:${c}`)) omit.add(`${r}:${c}`);
        }
    }
    for (const key of span.keys())omit.delete(key);
    return {
        span,
        omit
    };
}
class TableOverlay {
    container;
    theme;
    paneBounds;
    root;
    constructor(container, theme, paneBounds){
        this.container = container;
        this.theme = theme;
        this.paneBounds = paneBounds;
        this.lastTables = [];
        if (getComputedStyle(container).position === 'static') container.style.position = 'relative';
        this.root = document.createElement('div');
        Object.assign(this.root.style, {
            position: 'absolute',
            inset: '0',
            pointerEvents: 'none',
            overflow: 'hidden',
            zIndex: '3'
        });
        container.appendChild(this.root);
    }
    lastTables;
    update(tables) {
        this.lastTables = tables;
        this.root.replaceChildren();
        for (const t of tables){
            if (tableHasContent(t)) this.root.appendChild(this.renderTable(t));
        }
    }
    /** Re-render at the current pane geometry — after layout settles or on resize. */ reposition() {
        if (this.root.isConnected) this.update(this.lastTables);
    }
    /** Show/hide the whole overlay. Tables anchor to pane corners, not to bars, so unlike the
     *  series content they DON'T vanish with an emptied chart — the loading state hides them. */ setVisible(visible) {
        this.root.style.display = visible ? '' : 'none';
    }
    destroy() {
        this.root.remove();
    }
    renderTable(t) {
        const b = this.paneBounds(t.paneId);
        const wrap = document.createElement('div');
        wrap.style.position = 'absolute';
        // Frame as the wrapper's border: an OUTER stroke around the table's outline,
        // never covered by cell backgrounds (an inset shadow on the table would be).
        if (t.frameColor && t.frameWidth > 0) wrap.style.border = `${t.frameWidth}px solid ${t.frameColor}`;
        this.anchor(wrap, t.position, b);
        const table = document.createElement('table');
        Object.assign(table.style, {
            borderCollapse: 'collapse',
            background: t.bgColor ?? 'transparent',
            fontFamily: this.theme.fontFamily || 'sans-serif',
            border: 'none',
            tableLayout: 'auto',
            // Re-enable pointer events on the table only (root is none) so cell tooltips work.
            pointerEvents: 'auto'
        });
        const { span, omit } = mergeRenderPlan(t);
        // Pine cell width/height are percents of the pane's plot area.
        const plotW = Math.max(0, (this.root.clientWidth || this.container.clientWidth) - b.rightAxis);
        const paneH = b.height;
        const cellBorder = t.borderColor && t.borderWidth > 0 ? `${t.borderWidth}px solid ${t.borderColor}` : 'none';
        for(let r = 0; r < t.rows; r += 1){
            const tr = document.createElement('tr');
            for(let c = 0; c < t.columns; c += 1){
                if (omit.has(`${r}:${c}`)) continue; // absorbed by a merge
                const cell = t.cells[r]?.[c] ?? null;
                const td = document.createElement('td');
                if (cell === null) {
                    // Never set via table.cell() → occupies no space: an unused
                    // row/column collapses instead of painting an empty grid.
                    Object.assign(td.style, {
                        padding: '0',
                        border: 'none'
                    });
                    tr.appendChild(td);
                    continue;
                }
                const sp = span.get(`${r}:${c}`);
                if (sp) {
                    if (sp.cs > 1) td.colSpan = sp.cs;
                    if (sp.rs > 1) td.rowSpan = sp.rs;
                }
                Object.assign(td.style, {
                    border: cellBorder,
                    padding: '2px 6px',
                    background: cell.bgColor ?? 'transparent',
                    color: cell.textColor ?? this.theme.textColor,
                    textAlign: cell.hAlign,
                    verticalAlign: cell.vAlign === 'top' ? 'top' : cell.vAlign === 'bottom' ? 'bottom' : 'middle',
                    fontSize: `${fontPxOf(cell.textSize)}px`,
                    fontFamily: cell.fontFamily === 'monospace' ? 'monospace' : 'inherit',
                    fontWeight: cell.bold ? 'bold' : 'normal',
                    fontStyle: cell.italic ? 'italic' : 'normal',
                    // Pine cell text never wraps; `\n` still breaks lines. Wrapping
                    // used to collapse unicode sparklines and ━━━ dividers.
                    whiteSpace: 'pre'
                });
                if (cell.width) td.style.width = `${cell.width / 100 * plotW}px`;
                if (cell.height) td.style.height = `${cell.height / 100 * paneH}px`;
                if (cell.tooltip) td.title = cell.tooltip;
                td.textContent = cell.text ?? '';
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
        wrap.appendChild(table);
        return wrap;
    }
    /**
     * Position the wrapper at a Pine `position.*` corner/edge of the table's PANE
     * (not the whole chart), inset past the right price axis so it never overlaps
     * the Y-axis labels.
     */ anchor(el, position, b) {
        const m = 6;
        const containerH = this.root.clientHeight || this.container.clientHeight;
        const paneBottom = b.top + b.height;
        if (position.startsWith('top')) el.style.top = `${b.top + m}px`;
        else if (position.startsWith('bottom')) el.style.bottom = `${Math.max(0, containerH - paneBottom) + m}px`;
        else el.style.top = `${b.top + b.height / 2}px`; // middle of the pane
        if (position.endsWith('left')) el.style.left = `${m}px`;
        else if (position.endsWith('right')) el.style.right = `${b.rightAxis + m}px`; // clear the Y axis
        else el.style.left = `calc(50% - ${b.rightAxis / 2}px)`; // center of the plot area
        const tx = position.endsWith('center') ? '-50%' : '0';
        const ty = position.startsWith('middle') ? '-50%' : '0';
        if (tx !== '0' || ty !== '0') el.style.transform = `translate(${tx}, ${ty})`;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/renderers/shared/chrome-tooltip.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// A themed hover tooltip for RENDERER chrome (legend rows, the drawing toolbar, the
// in-chart dialogs) — the same look as the ui kit's Tooltip, without importing the kit:
// renderer chrome must work on a BARE chart, where no `.vela-ui` token host exists, so
// the tip carries its own tokens (`applyChromeTokens`) like the rest of the in-chart
// chrome. Native `title` tooltips are banned here for the same reason they are banned on
// the widget chrome: they look foreign and cannot be themed.
__turbopack_context__.s([
    "attachChromeTooltip",
    ()=>attachChromeTooltip,
    "chromeHint",
    ()=>chromeHint
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/icons.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$renderers$2f$shared$2f$theme$2d$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/renderers/shared/theme-tokens.ts [app-client] (ecmascript)");
;
;
function attachChromeTooltip(anchor, opts) {
    let timer = null;
    let tip = null;
    const clear = ()=>{
        if (timer !== null) {
            clearTimeout(timer);
            timer = null;
        }
        tip?.remove();
        tip = null;
    };
    const show = ()=>{
        const text = opts.text();
        if (!text) return;
        const doc = anchor.ownerDocument;
        tip = doc.createElement('div');
        tip.textContent = text;
        // The tooltip layer token (60) keeps tips above the in-chart dialogs (40) — the
        // settings dialog's own control tips used to open BEHIND its card at a fixed 25.
        tip.style.cssText = 'position:absolute;z-index:var(--vela-z-tooltip);pointer-events:none;' + 'background:var(--vela-bg);border:1px solid var(--vela-border);color:var(--vela-fg);' + 'border-radius:var(--vela-radius-md);padding:4px 9px;box-shadow:var(--vela-shadow);' + 'font:var(--vela-font-size-md) var(--vela-font);' + (opts.wrap ? 'max-width:260px;' : 'white-space:nowrap;');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$renderers$2f$shared$2f$theme$2d$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyChromeTokens"])(tip, opts.theme());
        opts.host.appendChild(tip);
        const a = anchor.getBoundingClientRect();
        const h = opts.host.getBoundingClientRect();
        if (opts.placement === 'right') {
            tip.style.left = `${a.right - h.left + 8}px`;
            tip.style.top = `${a.top - h.top + (a.height - tip.offsetHeight) / 2}px`;
        } else {
            // Left-aligned, clamped so it never spills out of the host. `above` is for
            // anchors sitting on the bottom edge (the A/L scale buttons).
            const left = Math.min(a.left - h.left, Math.max(0, h.width - tip.offsetWidth - 4));
            tip.style.left = `${Math.max(0, left)}px`;
            tip.style.top = opts.placement === 'above' ? `${Math.max(0, a.top - h.top - tip.offsetHeight - 6)}px` : `${a.bottom - h.top + 6}px`;
        }
    };
    // Mouse only: a tap fires a SYNTHETIC mouseenter/pointerenter with no leave to
    // follow (the emulated cursor stays put), so a touch-armed tip would open after the
    // tap and stick around forever. pointerenter carries the pointer type; mouseenter
    // does not — which is why the mouse events are not used here.
    const arm = (e)=>{
        if (e.pointerType !== 'mouse') return;
        clear();
        timer = window.setTimeout(show, opts.delayMs ?? 700);
    };
    anchor.addEventListener('pointerenter', arm);
    anchor.addEventListener('pointerleave', clear);
    anchor.addEventListener('pointerdown', clear); // a click answers the question the tip poses
    return ()=>{
        anchor.removeEventListener('pointerenter', arm);
        anchor.removeEventListener('pointerleave', clear);
        anchor.removeEventListener('pointerdown', clear);
        clear();
    };
}
function chromeHint(text, opts) {
    const px = opts.size ?? 16;
    const el = document.createElement('span');
    el.className = 'vela-hint';
    el.setAttribute('role', 'img');
    el.setAttribute('aria-label', text);
    el.innerHTML = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["iconAt"])('info', px);
    el.style.cssText = `flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;width:${px}px;height:${px}px;` + 'border-radius:50%;cursor:help;user-select:none;background:var(--vela-hover);color:var(--vela-fg-muted);' + 'transition:background var(--vela-dur-fast) ease,color var(--vela-dur-fast) ease;';
    const hover = (on)=>{
        el.style.background = on ? 'var(--vela-active)' : 'var(--vela-hover)';
        el.style.color = on ? 'var(--vela-fg-bright)' : 'var(--vela-fg-muted)';
    };
    el.addEventListener('pointerenter', ()=>hover(true));
    el.addEventListener('pointerleave', ()=>hover(false));
    const dispose = attachChromeTooltip(el, {
        host: opts.host,
        theme: opts.theme,
        text: ()=>text,
        wrap: true,
        delayMs: 250
    });
    return {
        el,
        dispose
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/renderers/shared/dom-raster.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Best-effort SYNCHRONOUS rasterization of DOM chrome overlays for the PNG export —
// the indicator legend, a host status line, the symbol watermark. Screenshot export is
// a synchronous port (`screenshot(): string | null`), so a full HTML renderer is out of
// reach; what a chart overlay actually carries is text on (rounded) color chips, and
// that subset rasterizes faithfully with plain canvas calls:
//   - element backgrounds and borders (border-radius honored, '50%' reads as a circle),
//   - text nodes in their computed font/color, at their measured on-screen rects,
//   - already-loaded <img>s (clipped by their radius) — but only when drawing them
//     leaves the canvas untainted: a cross-origin ticker icon must not poison the
//     whole export (`toDataURL` would throw at the end),
//   - inline SVG icons, through the geometry subset the icon registry actually uses
//     (path / circle / rect / line / polyline / polygon, fill + stroke from computed
//     style, so `currentColor` and inheritance resolve for free). Elements carrying a
//     `transform` are skipped — honest absence beats a wrongly placed glyph.
/** How the overlay's viewport coordinates map onto the export canvas. */ __turbopack_context__.s([
    "rasterizeOverlay",
    ()=>rasterizeOverlay
]);
/** True when a computed color actually puts ink down (not transparent). */ function hasInk(color) {
    if (!color || color === 'transparent') return false;
    const m = /rgba?\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*,\s*([\d.]+)\s*\)/.exec(color);
    return m ? parseFloat(m[1]) > 0.001 : true;
}
/** Uniform corner radius in px — '50%' (and any percentage) resolves against the box. */ function cornerRadius(cs, w, h) {
    const raw = cs.borderTopLeftRadius;
    const v = parseFloat(raw) || 0;
    const px = raw.endsWith('%') ? v / 100 * Math.min(w, h) : v;
    return Math.max(0, Math.min(px, Math.min(w, h) / 2));
}
/** Trace a rounded rect (falls back to a plain rect where roundRect is missing). */ function tracePath(ctx, x, y, w, h, r) {
    ctx.beginPath();
    if (r > 0 && typeof ctx.roundRect === 'function') ctx.roundRect(x, y, w, h, r);
    else ctx.rect(x, y, w, h);
}
/** Probe-draw on a throwaway canvas: a cross-origin image without CORS taints whatever
 *  it lands on, and `toDataURL` then throws for the WHOLE export — test it in isolation. */ function canDrawUntainted(img) {
    try {
        const probe = img.ownerDocument.createElement('canvas');
        probe.width = 1;
        probe.height = 1;
        const ctx = probe.getContext('2d');
        if (!ctx) return false;
        ctx.drawImage(img, 0, 0, 1, 1);
        probe.toDataURL();
        return true;
    } catch  {
        return false;
    }
}
function rasterizeOverlay(ctx, root, frame) {
    const win = root.ownerDocument.defaultView;
    if (!win) return;
    ctx.save();
    ctx.scale(frame.dpr, frame.dpr);
    const drawText = (node, cs, alpha)=>{
        const text = node.textContent?.replace(/\s+/g, ' ').trim();
        if (!text) return;
        const range = node.ownerDocument.createRange();
        range.selectNodeContents(node);
        const r = range.getBoundingClientRect();
        if (r.width <= 0 || r.height <= 0) return;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = cs.color;
        ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'left';
        ctx.fillText(text, r.left - frame.left, r.top - frame.top + r.height / 2);
    };
    const drawImg = (img, cs, alpha)=>{
        if (!img.complete || img.naturalWidth <= 0 || !canDrawUntainted(img)) return;
        const r = img.getBoundingClientRect();
        if (r.width <= 0 || r.height <= 0) return;
        const x = r.left - frame.left;
        const y = r.top - frame.top;
        ctx.save();
        ctx.globalAlpha = alpha;
        tracePath(ctx, x, y, r.width, r.height, cornerRadius(cs, r.width, r.height));
        ctx.clip();
        ctx.drawImage(img, x, y, r.width, r.height);
        ctx.restore();
    };
    const drawSvgShapes = (parent, alpha)=>{
        for (const el of parent.children){
            if (el.hasAttribute('transform')) continue;
            const tag = el.tagName.toLowerCase();
            if (tag === 'g') {
                drawSvgShapes(el, alpha);
                continue;
            }
            const num = (name)=>parseFloat(el.getAttribute(name) ?? '0') || 0;
            let path = null;
            if (tag === 'path') {
                const d = el.getAttribute('d');
                if (d) path = new Path2D(d);
            } else if (tag === 'circle') {
                path = new Path2D();
                path.arc(num('cx'), num('cy'), num('r'), 0, Math.PI * 2);
            } else if (tag === 'ellipse') {
                path = new Path2D();
                path.ellipse(num('cx'), num('cy'), num('rx'), num('ry'), 0, 0, Math.PI * 2);
            } else if (tag === 'rect') {
                path = new Path2D();
                path.rect(num('x'), num('y'), num('width'), num('height'));
            } else if (tag === 'line') {
                path = new Path2D();
                path.moveTo(num('x1'), num('y1'));
                path.lineTo(num('x2'), num('y2'));
            } else if (tag === 'polyline' || tag === 'polygon') {
                const pts = (el.getAttribute('points') ?? '').trim().split(/[\s,]+/).map(Number);
                if (pts.length < 4 || pts.some(Number.isNaN)) continue;
                path = new Path2D();
                path.moveTo(pts[0], pts[1]);
                for(let i = 2; i + 1 < pts.length; i += 2)path.lineTo(pts[i], pts[i + 1]);
                if (tag === 'polygon') path.closePath();
            }
            if (!path) continue;
            const cs = win.getComputedStyle(el);
            if (cs.fill && cs.fill !== 'none' && hasInk(cs.fill)) {
                ctx.globalAlpha = alpha * (parseFloat(cs.fillOpacity) || 1);
                ctx.fillStyle = cs.fill;
                ctx.fill(path);
            }
            const sw = parseFloat(cs.strokeWidth) || 0;
            if (cs.stroke && cs.stroke !== 'none' && hasInk(cs.stroke) && sw > 0) {
                ctx.globalAlpha = alpha * (parseFloat(cs.strokeOpacity) || 1);
                ctx.strokeStyle = cs.stroke;
                ctx.lineWidth = sw;
                if (cs.strokeLinecap === 'round' || cs.strokeLinecap === 'square' || cs.strokeLinecap === 'butt') ctx.lineCap = cs.strokeLinecap;
                if (cs.strokeLinejoin === 'round' || cs.strokeLinejoin === 'bevel' || cs.strokeLinejoin === 'miter') ctx.lineJoin = cs.strokeLinejoin;
                ctx.stroke(path);
            }
        }
    };
    const drawSvg = (svg, parentAlpha)=>{
        const r = svg.getBoundingClientRect();
        if (r.width <= 0 || r.height <= 0) return;
        const cs = win.getComputedStyle(svg);
        if (cs.display === 'none' || cs.visibility === 'hidden') return;
        const alpha = parentAlpha * (parseFloat(cs.opacity) || 1);
        if (alpha <= 0.001) return;
        const vb = svg.viewBox.baseVal;
        const vw = vb && vb.width > 0 ? vb.width : r.width;
        const vh = vb && vb.height > 0 ? vb.height : r.height;
        ctx.save();
        ctx.translate(r.left - frame.left, r.top - frame.top);
        ctx.scale(r.width / vw, r.height / vh);
        if (vb) ctx.translate(-vb.x, -vb.y);
        drawSvgShapes(svg, alpha);
        ctx.restore();
    };
    const drawElement = (el, parentAlpha)=>{
        const cs = win.getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden') return;
        const alpha = parentAlpha * (parseFloat(cs.opacity) || 1);
        if (alpha <= 0.001) return;
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) {
            const x = r.left - frame.left;
            const y = r.top - frame.top;
            const radius = cornerRadius(cs, r.width, r.height);
            if (hasInk(cs.backgroundColor)) {
                ctx.globalAlpha = alpha;
                ctx.fillStyle = cs.backgroundColor;
                tracePath(ctx, x, y, r.width, r.height, radius);
                ctx.fill();
            }
            const bw = parseFloat(cs.borderTopWidth) || 0;
            if (bw > 0 && cs.borderTopStyle !== 'none' && hasInk(cs.borderTopColor)) {
                ctx.globalAlpha = alpha;
                ctx.strokeStyle = cs.borderTopColor;
                ctx.lineWidth = bw;
                tracePath(ctx, x + bw / 2, y + bw / 2, r.width - bw, r.height - bw, Math.max(0, radius - bw / 2));
                ctx.stroke();
            }
        }
        for (const child of el.childNodes){
            if (child.nodeType === 3) drawText(child, cs, alpha);
            else if (child instanceof win.HTMLImageElement) drawImg(child, win.getComputedStyle(child), alpha);
            else if (child instanceof win.SVGSVGElement) drawSvg(child, alpha);
            else if (child instanceof win.HTMLElement) drawElement(child, alpha);
        }
    };
    if (root instanceof win.HTMLElement) drawElement(root, 1);
    ctx.restore();
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/renderers/shared/drawing-geometry.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TEXT_FRAME_INSET",
    ()=>TEXT_FRAME_INSET,
    "TEXT_FRAME_RISE",
    ()=>TEXT_FRAME_RISE,
    "autoFontSize",
    ()=>autoFontSize,
    "barTimeToLogical",
    ()=>barTimeToLogical,
    "contrastColor",
    ()=>contrastColor,
    "dashPattern",
    ()=>dashPattern,
    "extendEndpoints",
    ()=>extendEndpoints,
    "labelLineHeight",
    ()=>labelLineHeight,
    "medianInterval",
    ()=>medianInterval,
    "namedFontSize",
    ()=>namedFontSize,
    "parseColor",
    ()=>parseColor,
    "relativeLuminance",
    ()=>relativeLuminance,
    "uprightLineAngle",
    ()=>uprightLineAngle
]);
function barTimeToLogical(ms, times, intervalMs) {
    const n = times.length;
    if (n === 0) return 0;
    const first = times[0];
    const last = times[n - 1];
    if (ms <= first) {
        const iv = n > 1 ? times[1] - first : intervalMs || 1;
        return iv > 0 ? (ms - first) / iv : 0;
    }
    if (ms >= last) {
        const iv = intervalMs || (n > 1 ? last - times[n - 2] : 1);
        return iv > 0 ? n - 1 + (ms - last) / iv : n - 1;
    }
    let lo = 0;
    let hi = n - 1;
    while(lo <= hi){
        const mid = lo + hi >> 1;
        const t = times[mid];
        if (t === ms) return mid;
        if (t < ms) lo = mid + 1;
        else hi = mid - 1;
    }
    const i = hi; // times[i] < ms < times[i+1]
    const t0 = times[i];
    const t1 = times[i + 1];
    return t1 > t0 ? i + (ms - t0) / (t1 - t0) : i;
}
function medianInterval(times) {
    const diffs = [];
    for(let i = 1; i < times.length; i += 1){
        const d = times[i] - times[i - 1];
        if (d > 0) diffs.push(d);
    }
    if (diffs.length === 0) return 0;
    diffs.sort((a, b)=>a - b);
    return diffs[diffs.length >> 1] ?? 0;
}
function dashPattern(style, width) {
    const w = Math.max(1, width);
    if (style === 'dotted') return [
        w,
        w * 2
    ];
    if (style === 'dashed') return [
        w * 4,
        w * 3
    ];
    return [];
}
function extendEndpoints(x1, y1, x2, y2, extend, width, height) {
    if (extend === 'none') return [
        x1,
        y1,
        x2,
        y2
    ];
    const dx = x2 - x1;
    const left = extend === 'left' || extend === 'both';
    const right = extend === 'right' || extend === 'both';
    if (Math.abs(dx) < 1e-6) {
        // Vertical line: extend runs along the line itself (it has no horizontal
        // room). both → full height; right → ray from p1 through p2 to the edge;
        // left → ray from p2 through p1 to the edge.
        if (left && right) return [
            x1,
            0,
            x2,
            height
        ];
        const downward = y2 >= y1; // p2 below p1 on canvas (y grows downward)
        if (right) return downward ? [
            x1,
            y1,
            x2,
            height
        ] : [
            x1,
            y1,
            x2,
            0
        ];
        return downward ? [
            x1,
            0,
            x2,
            y2
        ] : [
            x1,
            height,
            x2,
            y2
        ];
    }
    const slope = (y2 - y1) / dx;
    const yAt = (x)=>y1 + slope * (x - x1);
    const lx = left ? -2 : Math.min(x1, x2);
    const rx = right ? width + 2 : Math.max(x1, x2);
    return [
        lx,
        yAt(lx),
        rx,
        yAt(rx)
    ];
}
function uprightLineAngle(x1, y1, x2, y2) {
    let a = Math.atan2(y2 - y1, x2 - x1);
    if (a > Math.PI / 2) a -= Math.PI;
    if (a < -Math.PI / 2) a += Math.PI;
    return a;
}
function parseColor(c) {
    const s = c.trim();
    let m = /^#([0-9a-f]{3})$/i.exec(s);
    if (m) {
        const h = m[1];
        return {
            r: parseInt(h[0] + h[0], 16),
            g: parseInt(h[1] + h[1], 16),
            b: parseInt(h[2] + h[2], 16),
            a: 1
        };
    }
    m = /^#([0-9a-f]{6})([0-9a-f]{2})?$/i.exec(s);
    if (m) {
        const h = m[1];
        return {
            r: parseInt(h.slice(0, 2), 16),
            g: parseInt(h.slice(2, 4), 16),
            b: parseInt(h.slice(4, 6), 16),
            a: m[2] ? parseInt(m[2], 16) / 255 : 1
        };
    }
    m = /^rgba?\(([^)]+)\)$/i.exec(s);
    if (m) {
        const p = m[1].split(',').map((x)=>parseFloat(x.trim()));
        return {
            r: p[0] ?? 0,
            g: p[1] ?? 0,
            b: p[2] ?? 0,
            a: p[3] ?? 1
        };
    }
    return null;
}
function relativeLuminance(r, g, b) {
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}
function contrastColor(bg) {
    if (!bg) return '#000000';
    const c = parseColor(bg);
    if (!c) return '#000000';
    return relativeLuminance(c.r, c.g, c.b) > 0.55 ? '#000000' : '#ffffff';
}
function labelLineHeight(fontSize) {
    return Math.round(fontSize * 1.4);
}
const TEXT_FRAME_INSET = 5;
const TEXT_FRAME_RISE = 3;
function namedFontSize(size) {
    switch(size){
        case 'tiny':
            return 10;
        case 'small':
            return 12;
        case 'large':
            return 18;
        case 'huge':
            return 28;
        case 'normal':
            return 14;
        default:
            return 0; // auto
    }
}
function autoFontSize(lines, boxW, boxH, bold) {
    // In-place max (no per-frame allocation, no argument-spread overflow on long wraps).
    let maxChars = 1;
    for (const l of lines)if (l.length > maxChars) maxChars = l.length;
    const ratio = bold ? 0.62 : 0.55;
    const byWidth = boxW * 0.9 / (maxChars * ratio);
    const byHeight = boxH * 0.85 / (lines.length * 1.3);
    return Math.max(6, Math.min(byWidth, byHeight, 48));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/renderers/shared/marks-state.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// Display state of the `marks` renderer feature — the timeline-mark lane's master
// toggle plus per-group visibility. Pure (no DOM, no renderer types): the settings
// dialog, the config reducer and the lane painter all read it, and it is node-testable.
__turbopack_context__.s([
    "defaultMarksState",
    ()=>defaultMarksState,
    "markGroupVisible",
    ()=>markGroupVisible,
    "mergeMarksState",
    ()=>mergeMarksState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$marks$2f$visibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/marks/visibility.ts [app-client] (ecmascript)");
;
;
function defaultMarksState() {
    return {
        visible: true,
        groups: {}
    };
}
function mergeMarksState(base, patch) {
    if (typeof patch === 'boolean') return {
        visible: patch,
        groups: {
            ...base.groups
        }
    };
    const p = patch && typeof patch === 'object' ? patch : {};
    const g = p.groups && typeof p.groups === 'object' ? p.groups : {};
    const groups = {
        ...base.groups
    };
    for (const [id, v] of Object.entries(g))if (typeof v === 'boolean') groups[id] = v;
    return {
        visible: typeof p.visible === 'boolean' ? p.visible : base.visible,
        groups
    };
}
function markGroupVisible(state, groupId, groups) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$marks$2f$visibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["markGroupVisible"])(state.groups, groupId, groups);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/renderers/shared/theme-tokens.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Token plumbing for RENDERER chrome. The renderer must be usable without the widget or the
// UI kit, so it writes the shared token vocabulary onto its own hosts instead of relying on
// a kit host being an ancestor. Values come from `core/tokens`, so renderer chrome, kit
// components and widget chrome resolve every color/space/radius to the same thing.
__turbopack_context__.s([
    "applyChromeTokens",
    ()=>applyChromeTokens
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/tokens.ts [app-client] (ecmascript)");
;
function applyChromeTokens(el, theme) {
    const write = (tokens)=>{
        for(const key in tokens)el.style.setProperty(key, tokens[key]);
    };
    write(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STATIC_TOKENS"]);
    write((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["themeTokens"])(theme));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/renderers/shared/trade-markers.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Strategy trade markers — the on-chart record of a strategy's order executions.
// Per fill, one marker UNIT: a direction arrow hugging the bar (buys point up from
// below the low, sells down from above the high; exit fills carry a cap between the
// arrow tip and the bar), a text stack reading OUTWARD from the bar (order id, then
// signed quantity — the quantity is always the outermost line), and a small tick at
// the exact fill price on the bar's trade-side edge. Multiple fills on one bar stack
// outward in execution order; at high density units overlap rather than thin out.
//
// Pure canvas2d painting + measurement, shared across backends (the chrome canvas is
// always 2d) and node-testable: callers supply coordinate closures, no renderer types
// cross this boundary. Glyphs and text keep a FIXED pixel size at every zoom, like the
// axis chrome.
__turbopack_context__.s([
    "TRADE_EXIT_COLOR",
    ()=>TRADE_EXIT_COLOR,
    "TRADE_LONG_COLOR",
    ()=>TRADE_LONG_COLOR,
    "TRADE_SHORT_COLOR",
    ()=>TRADE_SHORT_COLOR,
    "defaultTradeMarkersState",
    ()=>defaultTradeMarkersState,
    "mergeTradeMarkersState",
    ()=>mergeTradeMarkersState,
    "renderTradeMarkers",
    ()=>renderTradeMarkers,
    "tradesPriceHints",
    ()=>tradesPriceHints
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/palette.ts [app-client] (ecmascript)");
;
const TRADE_LONG_COLOR = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TRADE_LONG"];
const TRADE_SHORT_COLOR = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TRADE_SHORT"];
const TRADE_EXIT_COLOR = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TRADE_EXIT"];
function defaultTradeMarkersState() {
    return {
        visible: true,
        labels: true,
        qty: true,
        colors: {
            long: TRADE_LONG_COLOR,
            short: TRADE_SHORT_COLOR,
            exit: TRADE_EXIT_COLOR
        }
    };
}
function mergeTradeMarkersState(base, patch) {
    const p = patch && typeof patch === 'object' ? patch : {};
    const c = p.colors && typeof p.colors === 'object' ? p.colors : {};
    const bool = (v, fb)=>typeof v === 'boolean' ? v : fb;
    const color = (v, fb)=>typeof v === 'string' && v.trim().length > 0 ? v : fb;
    return {
        visible: bool(p.visible, base.visible),
        labels: bool(p.labels, base.labels),
        qty: bool(p.qty, base.qty),
        colors: {
            long: color(c.long, base.colors.long),
            short: color(c.short, base.colors.short),
            exit: color(c.exit, base.colors.exit)
        }
    };
}
// Fixed-pixel geometry, zoom-independent.
const BAR_GAP = 10; // bar extreme → arrow tip
const ARROW_W = 9; // head width
const HEAD_H = 6;
const ARROW_H = 14; // head + stem
const STEM_W = 3;
const CAP_H = 2; // exit cap between the tip and the bar
const CAP_GAP = 2;
const TEXT_GAP = 3; // arrow tail → first text line
const UNIT_GAP = 6; // between stacked units on one bar
const TICK_W = 6; // fill-price tick (points into the bar)
const TICK_H = 8;
function lineHeightOf(fontSize) {
    return fontSize + 4;
}
/** `+2` / `-0.5` — sign from the side; magnitude trimmed of float noise. */ function qtyText(exec) {
    if (exec.qty == null || !Number.isFinite(exec.qty)) return null;
    const magnitude = Number(Math.abs(exec.qty).toFixed(8));
    return `${exec.side === 'buy' ? '+' : '-'}${magnitude}`;
}
function unitOf(exec, state, lineH) {
    const lines = [];
    if (state.labels && exec.label) lines.push(exec.label);
    if (state.qty) {
        const q = qtyText(exec);
        if (q) lines.push(q);
    }
    return {
        exec,
        lines,
        height: ARROW_H + (lines.length ? TEXT_GAP + lines.length * lineH : 0)
    };
}
/** Group executions by fill bar, split buys/sells, keeping execution order within a stack. */ function stacksFor(trades, state, deps, from, to, lineH) {
    const byBar = new Map();
    for (const exec of trades){
        const logical = Math.round(deps.timeToLogical(exec.time));
        if (logical < from || logical > to) continue;
        let stack = byBar.get(logical);
        if (!stack) {
            stack = {
                logical,
                buys: [],
                sells: []
            };
            byBar.set(logical, stack);
        }
        (exec.side === 'buy' ? stack.buys : stack.sells).push(unitOf(exec, state, lineH));
    }
    return [
        ...byBar.values()
    ];
}
/** Total pixel run of one side's stack, from the bar extreme to the last unit's far edge. */ function stackExtent(units) {
    if (units.length === 0) return 0;
    let px = BAR_GAP;
    for (const u of units)px += u.height;
    return px + (units.length - 1) * UNIT_GAP;
}
function tradesPriceHints(trades, state, deps, from, to, fontSize) {
    if (trades.length === 0) return null;
    const lineH = lineHeightOf(fontSize);
    let min = Infinity;
    let max = -Infinity;
    let abovePx = 0;
    let belowPx = 0;
    for (const stack of stacksFor(trades, state, deps, Math.floor(from), Math.ceil(to), lineH)){
        const bar = deps.barAt(stack.logical);
        if (!bar) continue;
        if (bar.low < min) min = bar.low;
        if (bar.high > max) max = bar.high;
        belowPx = Math.max(belowPx, stackExtent(stack.buys));
        abovePx = Math.max(abovePx, stackExtent(stack.sells));
    }
    if (!Number.isFinite(min) || !Number.isFinite(max)) return null;
    return {
        min,
        max,
        abovePx,
        belowPx
    };
}
function renderTradeMarkers(ctx, trades, state, deps, xOf, yOf, text, width, barHalfPx) {
    if (trades.length === 0) return;
    const lineH = lineHeightOf(text.fontSize);
    const stacks = stacksFor(trades, state, deps, -Infinity, Infinity, lineH);
    if (stacks.length === 0) return;
    ctx.save();
    ctx.font = `${text.fontSize}px ${text.fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (const stack of stacks){
        const x = xOf(stack.logical);
        // Cull generously — a unit is ~an order id wide, never hundreds of px.
        if (x < -150 || x > width + 150) continue;
        const bar = deps.barAt(stack.logical);
        if (!bar) continue;
        // Anchor to the bar's VISUAL edges, so an inverted scale keeps units hugging the bar.
        const yBottom = Math.max(yOf(bar.low), yOf(bar.high));
        const yTop = Math.min(yOf(bar.low), yOf(bar.high));
        let y = yBottom + BAR_GAP;
        for (const unit of stack.buys){
            ctx.fillStyle = colorOf(unit.exec, state.colors);
            drawArrowUp(ctx, x, y, unit.exec.kind === 'exit');
            drawFillTick(ctx, unit.exec.side, x, yOf(unit.exec.price), barHalfPx);
            drawTextLines(ctx, unit.lines, x, y + ARROW_H + TEXT_GAP + lineH / 2, lineH, text.color);
            y += unit.height + UNIT_GAP;
        }
        y = yTop - BAR_GAP;
        for (const unit of stack.sells){
            ctx.fillStyle = colorOf(unit.exec, state.colors);
            drawArrowDown(ctx, x, y, unit.exec.kind === 'exit');
            drawFillTick(ctx, unit.exec.side, x, yOf(unit.exec.price), barHalfPx);
            drawTextLines(ctx, unit.lines, x, y - ARROW_H - TEXT_GAP - lineH / 2, -lineH, text.color);
            y -= unit.height + UNIT_GAP;
        }
    }
    ctx.restore();
}
function colorOf(exec, colors) {
    if (exec.kind === 'exit') return colors.exit;
    return exec.side === 'buy' ? colors.long : colors.short;
}
/** Solid up arrow with its tip at `yTip` — a buy, sitting under the bar, pointing at it. */ function drawArrowUp(ctx, x, yTip, capped) {
    ctx.beginPath();
    ctx.moveTo(x, yTip);
    ctx.lineTo(x - ARROW_W / 2, yTip + HEAD_H);
    ctx.lineTo(x + ARROW_W / 2, yTip + HEAD_H);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(x - STEM_W / 2, yTip + HEAD_H, STEM_W, ARROW_H - HEAD_H);
    if (capped) ctx.fillRect(x - ARROW_W / 2, yTip - CAP_GAP - CAP_H, ARROW_W, CAP_H);
}
/** Solid down arrow with its tip at `yTip` — a sell, sitting over the bar, pointing at it. */ function drawArrowDown(ctx, x, yTip, capped) {
    ctx.beginPath();
    ctx.moveTo(x, yTip);
    ctx.lineTo(x - ARROW_W / 2, yTip - HEAD_H);
    ctx.lineTo(x + ARROW_W / 2, yTip - HEAD_H);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(x - STEM_W / 2, yTip - ARROW_H, STEM_W, ARROW_H - HEAD_H);
    if (capped) ctx.fillRect(x - ARROW_W / 2, yTip + CAP_GAP, ARROW_W, CAP_H);
}
/** The fill-price tick: a small triangle at the exact fill price, pointing INTO the bar
 *  from the trade's side — buys on the left edge, sells on the right. */ function drawFillTick(ctx, side, x, yFill, barHalfPx) {
    const edge = side === 'buy' ? x - barHalfPx : x + barHalfPx;
    const back = side === 'buy' ? edge - TICK_W : edge + TICK_W;
    ctx.beginPath();
    ctx.moveTo(edge, yFill);
    ctx.lineTo(back, yFill - TICK_H / 2);
    ctx.lineTo(back, yFill + TICK_H / 2);
    ctx.closePath();
    ctx.fill();
}
/** Text stack in the theme's neutral color (never the arrow color), stepping outward. */ function drawTextLines(ctx, lines, x, firstY, step, color) {
    if (lines.length === 0) return;
    ctx.fillStyle = color;
    for(let i = 0; i < lines.length; i += 1)ctx.fillText(lines[i], x, firstY + i * step);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=lib_charting_renderers_shared_06gvytk._.js.map