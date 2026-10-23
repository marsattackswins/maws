/**
 * vela-feed-adapter.test.ts — the app's provider overrides.
 *
 * The chart chrome (status line, symbol picker, object tree) draws the icon the data
 * provider resolves. Vela's bundled Binance provider points at Ledger's crypto-icon
 * CDN, which has no TradFi entries — XAUUSDT.P 404'd there and the status line showed
 * an "XA" initials badge while the watchlist showed the real Binance gold logo. The
 * adapter must keep routing icons through the app's own `/api/logo` proxy so every
 * surface agrees.
 */
import { describe, it, expect } from "@jest/globals";
import { mawsVelaProvider, toVelaTicker, fromVelaTicker } from "@/lib/vela-feed-adapter";

describe("mawsVelaProvider.resolveSymbolIcon", () => {
  const icon = (ticker: string) =>
    mawsVelaProvider.resolveSymbolIcon?.({ ticker } as never);

  it("uses the watchlist's same-origin logo proxy, not a third-party CDN", () => {
    expect(icon("BTCUSDT.P")).toBe("/api/logo?symbol=BTCUSDT&v=8");
  });

  it("resolves a TradFi contract the crypto-only CDN could not (XAU)", () => {
    expect(icon("XAUUSDT.P")).toBe("/api/logo?symbol=XAUUSDT&v=8");
    expect(icon("MUUSDT.P")).toBe("/api/logo?symbol=MUUSDT&v=8");
  });

  it("returns undefined for a descriptor without a ticker", () => {
    expect(mawsVelaProvider.resolveSymbolIcon?.({} as never)).toBeUndefined();
  });
});

describe("ticker mapping", () => {
  it("round-trips the app's futures aliases through the .P suffix", () => {
    expect(toVelaTicker("PEPEUSDT")).toBe("1000PEPEUSDT.P");
    expect(fromVelaTicker("1000PEPEUSDT.P")).toBe("PEPEUSDT");
    expect(toVelaTicker("XAUUSDT.P")).toBe("XAUUSDT.P");
    expect(fromVelaTicker("XAUUSDT.P")).toBe("XAUUSDT");
  });

  it("drops the venue prefix Vela's symbol search commits", () => {
    // The picker's rows and `market:changed` speak the canonical `BINANCE:TICKER.P`;
    // the store, the watchlist and order routing stay bare.
    expect(fromVelaTicker("BINANCE:ETHUSDT.P")).toBe("ETHUSDT");
    expect(fromVelaTicker("BINANCE:1000PEPEUSDT.P")).toBe("PEPEUSDT");
    expect(fromVelaTicker("binance:btcusdt.p")).toBe("BTCUSDT");
  });
});

describe("futures-only symbol index", () => {
  it("keeps perpetuals and drops the provider's spot half", async () => {
    // The picker lists this index verbatim; a spot row would switch MAWS onto a market
    // it cannot trade. The mock provider enumerates one of each.
    const list = await mawsVelaProvider.listSymbols();
    expect(list.map((d) => d.ticker)).toEqual(["BTCUSDT.P"]);
  });
});
