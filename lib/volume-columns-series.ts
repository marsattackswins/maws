import type { CanvasRenderingTarget2D } from "fancy-canvas";
import {
  customSeriesDefaultOptions,
  type CustomData,
  type CustomSeriesOptions,
  type CustomSeriesPricePlotValues,
  type ICustomSeriesPaneRenderer,
  type ICustomSeriesPaneView,
  type PaneRendererCustomData,
  type PriceToCoordinateConverter,
  type Time,
  type WhitespaceData,
} from "lightweight-charts";

export type VolumeColumnData = CustomData<Time> & {
  value: number;
  color?: string;
};

export type VolumeColumnsSeriesOptions = CustomSeriesOptions;

export const VOLUME_COLUMNS_DEFAULT_OPTIONS: VolumeColumnsSeriesOptions = {
  ...customSeriesDefaultOptions,
};

/**
 * Media-space candlestick body width (mirrors LWC `optimalCandlestickWidth`
 * without pixelRatio), then quartered for volume columns.
 */
export function quarterCandleColumnWidthMedia(barSpacing: number): number {
  const specialFrom = 2.5;
  const specialTo = 4;
  const specialCoeff = 3;
  let candle: number;
  if (barSpacing >= specialFrom && barSpacing <= specialTo) {
    candle = specialCoeff;
  } else {
    const reducing = 0.2;
    const coeff =
      1 -
      (reducing * Math.atan(Math.max(specialTo, barSpacing) - specialTo)) / (Math.PI * 0.5);
    candle = Math.min(barSpacing * coeff, barSpacing);
  }
  return Math.max(1, candle * 0.25);
}

class VolumeColumnsRenderer implements ICustomSeriesPaneRenderer {
  private _data: PaneRendererCustomData<Time, VolumeColumnData> | null = null;
  private _options: VolumeColumnsSeriesOptions | null = null;

  update(
    data: PaneRendererCustomData<Time, VolumeColumnData>,
    options: VolumeColumnsSeriesOptions,
  ) {
    this._data = data;
    this._options = options;
  }

  draw(target: CanvasRenderingTarget2D, priceToCoordinate: PriceToCoordinateConverter) {
    target.useBitmapCoordinateSpace((scope) => {
      const data = this._data;
      const options = this._options;
      if (!data || !options || !data.visibleRange || data.bars.length === 0) return;

      const ctx = scope.context;
      const hRatio = scope.horizontalPixelRatio;
      const vRatio = scope.verticalPixelRatio;
      const effectiveSpacing = data.barSpacing * Math.max(1, data.conflationFactor);
      const widthMedia = quarterCandleColumnWidthMedia(effectiveSpacing);
      const width = Math.max(1, Math.round(widthMedia * hRatio));
      const half = width / 2;
      const baseY = priceToCoordinate(0);
      if (baseY == null) return;
      const baseBitmap = Math.round(baseY * vRatio);

      for (let i = data.visibleRange.from; i < data.visibleRange.to; i++) {
        const bar = data.bars[i];
        const value = bar.originalData.value;
        if (value == null || !Number.isFinite(value)) continue;
        const y = priceToCoordinate(value);
        if (y == null) continue;
        const yBitmap = Math.round(y * vRatio);
        const top = Math.min(baseBitmap, yBitmap);
        const height = Math.max(1, Math.abs(baseBitmap - yBitmap));
        const center = Math.round(bar.x * hRatio);
        const left = center - Math.floor(half);
        ctx.fillStyle = bar.originalData.color ?? bar.barColor ?? options.color;
        ctx.fillRect(left, top, width, height);
      }
    });
  }
}

/** Volume histogram columns at quarter candlestick body thickness. */
export class VolumeColumnsSeries
  implements ICustomSeriesPaneView<Time, VolumeColumnData, VolumeColumnsSeriesOptions>
{
  private readonly _renderer = new VolumeColumnsRenderer();

  renderer() {
    return this._renderer;
  }

  update(
    data: PaneRendererCustomData<Time, VolumeColumnData>,
    options: VolumeColumnsSeriesOptions,
  ) {
    this._renderer.update(data, options);
  }

  priceValueBuilder(plotRow: VolumeColumnData): CustomSeriesPricePlotValues {
    return [0, plotRow.value, plotRow.value];
  }

  isWhitespace(
    data: VolumeColumnData | WhitespaceData,
  ): data is WhitespaceData {
    return (data as Partial<VolumeColumnData>).value == null;
  }

  defaultOptions(): VolumeColumnsSeriesOptions {
    return VOLUME_COLUMNS_DEFAULT_OPTIONS;
  }
}
