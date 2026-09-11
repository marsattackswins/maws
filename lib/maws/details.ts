import { mawsFeed } from "@/lib/maws/feed";

export type SeasonalSeries = {
  year: number;
  color: string;
  points: { x: number; y: number }[];
};

export function seasonalSeries(
  symbol: string,
  dailyCandles?: ReturnType<typeof mawsFeed.getCandles>,
): SeasonalSeries[] {
  const year = new Date().getFullYear();
  const colors = ["#ff9800", "#26a69a", "#2962ff"];
  const years = [year - 2, year - 1, year];
  const daily = dailyCandles ?? mawsFeed.getCandles(symbol, "1D");

  return years.map((y, idx) => {
    const slice = daily.filter((c) => new Date(c.time * 1000).getFullYear() === y);
    const source =
      slice.length > 8
        ? slice
        : daily.slice(Math.max(0, daily.length - 90 - idx * 40), daily.length - idx * 20);
    const base = source[0]?.close || 1;
    const step = Math.max(1, Math.floor(source.length / 48));
    const points = source
      .filter((_, i) => i % step === 0)
      .slice(0, 48)
      .map((c, i) => ({
        x: i / Math.max(1, Math.min(47, source.length / step) - 1),
        y: (c.close / base) * 100,
      }));
    return { year: y, color: colors[idx], points };
  });
}
