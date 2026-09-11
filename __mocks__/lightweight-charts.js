/**
 * Manual Jest mock for lightweight-charts.
 * Only the enum values actually used at module-load time are needed.
 * lib/indicators.ts imports `LineStyle` – a numeric enum.
 */
const LineStyle = {
  Solid: 0,
  Dotted: 1,
  Dashed: 2,
  LargeDashed: 3,
  SparseDotted: 4,
};

module.exports = { LineStyle };
