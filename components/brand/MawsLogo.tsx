/** Inline pixel-M mark — used in-app so it never drifts from a cached static asset. */
export function MawsLogo({
  size = 16,
  className = "",
  title = "MAWS",
  /** When false, glyph only (parent supplies the chip background). */
  withBackground = false,
}: {
  size?: number;
  className?: string;
  title?: string;
  withBackground?: boolean;
}) {
  const cell = 3;
  const origin = 5.5;
  const px = (col: number, row: number) => ({
    x: origin + col * cell,
    y: origin + row * cell,
    width: cell,
    height: cell,
  });

  // 7×7 classic pixel M
  const cells: Array<[number, number]> = [
    // left stem
    [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6],
    // right stem
    [6, 0], [6, 1], [6, 2], [6, 3], [6, 4], [6, 5], [6, 6],
    // V
    [1, 1], [2, 2], [3, 3], [4, 2], [5, 1],
  ];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      shapeRendering="crispEdges"
      aria-label={title}
      role="img"
    >
      <title>{title}</title>
      {withBackground && <rect width="32" height="32" rx="6" fill="#0A0A0A" />}
      <g fill="#E8EAED">
        {cells.map(([c, r]) => {
          const p = px(c, r);
          return <rect key={`${c}-${r}`} x={p.x} y={p.y} width={p.width} height={p.height} />;
        })}
      </g>
    </svg>
  );
}
