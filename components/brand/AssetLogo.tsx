"use client";

import { assetLogoLetter, assetLogoSrc } from "@/lib/maws/asset-logo";
import { symbolColor } from "@/lib/maws/universe";
import { useEffect, useState } from "react";

type Props = {
  symbol: string;
  size?: number;
  className?: string;
};

/** Binance asset logo (crypto + TradFi) via same-origin proxy. */
export function AssetLogo({ symbol, size = 18, className = "" }: Props) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [symbol]);

  const letter = assetLogoLetter(symbol);
  const bg = symbolColor(symbol);

  if (failed) {
    return (
      <span
        className={`inline-flex shrink-0 items-center justify-center rounded-full text-white ${className}`}
        style={{
          width: size,
          height: size,
          background: bg,
          fontSize: Math.max(8, Math.round(size * 0.55)),
          fontWeight: 700,
        }}
        aria-hidden
      >
        {letter}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      key={symbol}
      src={assetLogoSrc(symbol)}
      alt=""
      width={size}
      height={size}
      draggable={false}
      className={`inline-block shrink-0 rounded-full bg-[#1a1a1a] object-cover ${className}`}
      style={{ width: size, height: size }}
      onError={() => setFailed(true)}
    />
  );
}
