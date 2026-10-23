/**
 * vela-feed-adapter.ts
 *
 * Vela's native BinanceProvider drives the charts: it fetches its own
 * paginated history (REST) and streams its own kline WebSocket — no Next.js
 * API routes and no MAWS feed cache in the chart data path. Trading state
 * (positions, orders, TP/SL, PnL) still flows through MAWS; this file only
 * maps symbols between the two conventions.
 */
import { BinanceProvider } from "@/lib/charting/data/providers/binance";
import { toBinanceSymbol } from "@/lib/market/binance-intervals";
import { assetLogoSrc } from "@/lib/maws/asset-logo";

/** Singleton shared across all Vela chart instances. */
export const mawsVelaProvider = new BinanceProvider();

/**
 * FUTURES-ONLY SYMBOL INDEX.
 *
 * `BinanceProvider.listSymbols()` enumerates Spot AND USDT-M futures, and Vela's symbol
 * search dialog lists that index verbatim. MAWS is a futures terminal (`toVelaTicker`
 * always writes the `.P` suffix), so a spot row (`BTCUSDT`) would sit right beside the
 * `BTCUSDT.P` the app actually trades and load a market with no MAWS position, no order
 * routing and a different price series than the watchlist's. The index also gates bare
 * chart resolution, so narrowing it HERE keeps the picker, autocomplete and resolution
 * agreeing on one futures catalog.
 *
 * Guarded: `next dev` re-evaluates modules, and wrapping the wrapper would stack a
 * filter per HMR pass (same reason the store/registry pin their state).
 */
type FuturesOnlyIndex = { mawsFuturesOnlyIndex?: true };
const providerIndex = mawsVelaProvider as typeof mawsVelaProvider & FuturesOnlyIndex;
if (!providerIndex.mawsFuturesOnlyIndex) {
  providerIndex.mawsFuturesOnlyIndex = true;
  const listAllSymbols = mawsVelaProvider.listSymbols.bind(mawsVelaProvider);
  mawsVelaProvider.listSymbols = async () =>
    (await listAllSymbols()).filter((d) => d.ticker.toUpperCase().endsWith(".P"));
}

/**
 * Chart chrome icons (status line, symbol picker, object tree) ask the provider for an
 * icon URL. Vela's bundled Binance provider points at Ledger's crypto-icon CDN, which
 * carries crypto only — a TradFi contract like XAUUSDT.P 404s and the status line fell
 * back to its "XA" initials badge while the watchlist showed Binance's real gold logo.
 * Route the app's provider through the SAME same-origin logo proxy the watchlist uses
 * (`/api/logo`), so every surface resolves an asset identically and degrades the same
 * way (initials) when the proxy has nothing either.
 */
mawsVelaProvider.resolveSymbolIcon = (symbol) => {
  const ticker = symbol?.ticker?.trim();
  return ticker ? assetLogoSrc(ticker) : undefined;
};

/**
 * MAWS symbol → Vela ticker.
 *
 * MAWS trades exclusively on Binance USDT-M futures but stores symbols bare
 * ("BTCUSDT"); Vela's provider uses `.P` to select the futures endpoint
 * (bare = spot). Apply MAWS's futures alias map (MATICUSDT→POLUSDT,
 * PEPEUSDT→1000PEPEUSDT) first so Vela queries the listed contract.
 */
export function toVelaTicker(symbol: string): string {
  const s = String(symbol ?? "").toUpperCase().replace(/\.P$/i, "");
  return `${toBinanceSymbol(s)}.P`;
}

/**
 * Vela ticker → MAWS symbol: strip the VENUE PREFIX and the futures suffix, then
 * reverse the alias map, matching what the rest of MAWS keeps in its store.
 *
 * The prefix matters now that Vela's own symbol search is a market-switch entry:
 * its rows commit `venue:ticker` (`BINANCE:ETHUSDT.P`) to pin the listing the user
 * pointed at, and the chart's `market:changed` echoes that canonical spelling. MAWS
 * stores bare symbols, so `BINANCE:` would otherwise land in the store, in the
 * watchlist and in every order submitted for the pane.
 */
export function fromVelaTicker(ticker: string): string {
  const t = String(ticker ?? "")
    .trim()
    .toUpperCase()
    .replace(/^[A-Z0-9]+:/, "")
    .replace(/\.P$/i, "");
  for (const [app, bin] of Object.entries(ALIASES)) {
    if (bin === t) return app;
  }
  return t;
}

const ALIASES: Record<string, string> = {
  MATICUSDT: "POLUSDT",
  PEPEUSDT: "1000PEPEUSDT",
};
