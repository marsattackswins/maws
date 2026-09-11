import type { SymbolInfo, WatchlistGroup } from "@/types";

/** Curated seed used before / while Binance exchangeInfo loads. */
export const SEED_UNIVERSE: SymbolInfo[] = [
  { symbol: "BTCUSDT", base: "BTC", quote: "USDT", name: "Bitcoin", precision: 1, contractType: "PERPETUAL", underlyingType: "COIN" },
  { symbol: "ETHUSDT", base: "ETH", quote: "USDT", name: "Ethereum", precision: 2, contractType: "PERPETUAL", underlyingType: "COIN" },
  { symbol: "SOLUSDT", base: "SOL", quote: "USDT", name: "Solana", precision: 3, contractType: "PERPETUAL", underlyingType: "COIN" },
  { symbol: "BNBUSDT", base: "BNB", quote: "USDT", name: "BNB", precision: 2, contractType: "PERPETUAL", underlyingType: "COIN" },
  { symbol: "XRPUSDT", base: "XRP", quote: "USDT", name: "XRP", precision: 4, contractType: "PERPETUAL", underlyingType: "COIN" },
  { symbol: "ADAUSDT", base: "ADA", quote: "USDT", name: "Cardano", precision: 4, contractType: "PERPETUAL", underlyingType: "COIN" },
  { symbol: "DOGEUSDT", base: "DOGE", quote: "USDT", name: "Dogecoin", precision: 5, contractType: "PERPETUAL", underlyingType: "COIN" },
  { symbol: "AVAXUSDT", base: "AVAX", quote: "USDT", name: "Avalanche", precision: 3, contractType: "PERPETUAL", underlyingType: "COIN" },
  { symbol: "DOTUSDT", base: "DOT", quote: "USDT", name: "Polkadot", precision: 3, contractType: "PERPETUAL", underlyingType: "COIN" },
  { symbol: "LINKUSDT", base: "LINK", quote: "USDT", name: "Chainlink", precision: 3, contractType: "PERPETUAL", underlyingType: "COIN" },
  { symbol: "ATOMUSDT", base: "ATOM", quote: "USDT", name: "Cosmos", precision: 3, contractType: "PERPETUAL", underlyingType: "COIN" },
  { symbol: "NEARUSDT", base: "NEAR", quote: "USDT", name: "NEAR", precision: 3, contractType: "PERPETUAL", underlyingType: "COIN" },
  { symbol: "LTCUSDT", base: "LTC", quote: "USDT", name: "Litecoin", precision: 2, contractType: "PERPETUAL", underlyingType: "COIN" },
  { symbol: "APTUSDT", base: "APT", quote: "USDT", name: "Aptos", precision: 3, contractType: "PERPETUAL", underlyingType: "COIN" },
  { symbol: "ARBUSDT", base: "ARB", quote: "USDT", name: "Arbitrum", precision: 4, contractType: "PERPETUAL", underlyingType: "COIN" },
  { symbol: "OPUSDT", base: "OP", quote: "USDT", name: "Optimism", precision: 4, contractType: "PERPETUAL", underlyingType: "COIN" },
  { symbol: "SUIUSDT", base: "SUI", quote: "USDT", name: "Sui", precision: 4, contractType: "PERPETUAL", underlyingType: "COIN" },
  { symbol: "PEPEUSDT", base: "PEPE", quote: "USDT", name: "Pepe", precision: 7, contractType: "PERPETUAL", underlyingType: "COIN" },
  { symbol: "TONUSDT", base: "TON", quote: "USDT", name: "Toncoin", precision: 4, contractType: "PERPETUAL", underlyingType: "COIN" },
  { symbol: "TRXUSDT", base: "TRX", quote: "USDT", name: "TRON", precision: 5, contractType: "PERPETUAL", underlyingType: "COIN" },
  { symbol: "POLUSDT", base: "POL", quote: "USDT", name: "Polygon", precision: 4, contractType: "PERPETUAL", underlyingType: "COIN" },
  { symbol: "UNIUSDT", base: "UNI", quote: "USDT", name: "Uniswap", precision: 3, contractType: "PERPETUAL", underlyingType: "COIN" },
  { symbol: "AAVEUSDT", base: "AAVE", quote: "USDT", name: "Aave", precision: 2, contractType: "PERPETUAL", underlyingType: "COIN" },
  { symbol: "FILUSDT", base: "FIL", quote: "USDT", name: "Filecoin", precision: 3, contractType: "PERPETUAL", underlyingType: "COIN" },
  { symbol: "INJUSDT", base: "INJ", quote: "USDT", name: "Injective", precision: 3, contractType: "PERPETUAL", underlyingType: "COIN" },
  { symbol: "SEIUSDT", base: "SEI", quote: "USDT", name: "Sei", precision: 4, contractType: "PERPETUAL", underlyingType: "COIN" },
  { symbol: "TIAUSDT", base: "TIA", quote: "USDT", name: "Celestia", precision: 3, contractType: "PERPETUAL", underlyingType: "COIN" },
  { symbol: "WLDUSDT", base: "WLD", quote: "USDT", name: "Worldcoin", precision: 4, contractType: "PERPETUAL", underlyingType: "COIN" },
  { symbol: "RENDERUSDT", base: "RENDER", quote: "USDT", name: "Render", precision: 3, contractType: "PERPETUAL", underlyingType: "COIN" },
  { symbol: "FETUSDT", base: "FET", quote: "USDT", name: "Fetch.ai", precision: 4, contractType: "PERPETUAL", underlyingType: "COIN" },
];

/** Friendly display names for common bases (crypto + TradFi). */
const NAME_BY_BASE: Record<string, string> = {
  BTC: "Bitcoin",
  ETH: "Ethereum",
  SOL: "Solana",
  BNB: "BNB",
  XRP: "XRP",
  ADA: "Cardano",
  DOGE: "Dogecoin",
  AVAX: "Avalanche",
  DOT: "Polkadot",
  LINK: "Chainlink",
  ATOM: "Cosmos",
  NEAR: "NEAR",
  LTC: "Litecoin",
  APT: "Aptos",
  ARB: "Arbitrum",
  OP: "Optimism",
  SUI: "Sui",
  PEPE: "Pepe",
  "1000PEPE": "Pepe",
  TON: "Toncoin",
  TRX: "TRON",
  POL: "Polygon",
  UNI: "Uniswap",
  AAVE: "Aave",
  FIL: "Filecoin",
  INJ: "Injective",
  SEI: "Sei",
  TIA: "Celestia",
  WLD: "Worldcoin",
  RENDER: "Render",
  FET: "Fetch.ai",
  XAU: "Gold",
  XAG: "Silver",
  XPT: "Platinum",
  XPD: "Palladium",
  TSLA: "Tesla",
  AAPL: "Apple",
  NVDA: "NVIDIA",
  AMZN: "Amazon",
  META: "Meta",
  MSFT: "Microsoft",
  GOOGL: "Alphabet",
  COIN: "Coinbase",
  MSTR: "MicroStrategy",
  MU: "Micron",
  AMD: "AMD",
  INTC: "Intel",
  TSM: "TSMC",
  QCOM: "Qualcomm",
  JPM: "JPMorgan",
  ARM: "Arm",
  IBM: "IBM",
  CRM: "Salesforce",
  IWM: "iShares Russell 2000",
  HOOD: "Robinhood",
  PLTR: "Palantir",
};

const UNDERLYING_RANK: Record<string, number> = {
  COIN: 0,
  INDEX: 1,
  COMMODITY: 2,
  EQUITY: 3,
  PREMARKET: 4,
  KR_EQUITY: 5,
  HK_EQUITY: 6,
  CN_EQUITY: 7,
};

/** Mutable live universe (seed until Binance exchangeInfo loads). */
export const UNIVERSE: SymbolInfo[] = SEED_UNIVERSE.map((s) => ({ ...s }));

const BY_SYMBOL = new Map(UNIVERSE.map((s) => [s.symbol, s]));
let universeVersion = 0;
const universeListeners = new Set<() => void>();

function rebuildIndex() {
  BY_SYMBOL.clear();
  for (const s of UNIVERSE) BY_SYMBOL.set(s.symbol, s);
}

function notifyUniverse() {
  universeVersion += 1;
  for (const cb of universeListeners) cb();
}

export function getUniverseVersion(): number {
  return universeVersion;
}

export function subscribeUniverse(listener: () => void): () => void {
  universeListeners.add(listener);
  return () => universeListeners.delete(listener);
}

export function resolveSymbolName(base: string, fallback?: string): string {
  return NAME_BY_BASE[base] ?? fallback ?? base;
}

export function marketLabel(info: Pick<SymbolInfo, "contractType" | "underlyingType">): string {
  if (info.contractType === "TRADIFI_PERPETUAL") {
    if (info.underlyingType === "COMMODITY") return "TradFi Commodity Perpetual";
    if (info.underlyingType?.includes("EQUITY") || info.underlyingType === "PREMARKET") {
      return "TradFi Equity Perpetual";
    }
    return "TradFi Perpetual";
  }
  return "USDT-M Perpetual";
}

/** Hard-coded precision overrides — take priority over API and seed values. */
const PRECISION_OVERRIDES: Record<string, number> = {
  BTCUSDT: 1,
};

export function replaceUniverse(next: SymbolInfo[]) {
  const seedBySymbol = new Map(SEED_UNIVERSE.map((s) => [s.symbol, s]));
  const enriched = next.map((row) => {
    const seed = seedBySymbol.get(row.symbol);
    return {
      ...row,
      name: seed?.name ?? resolveSymbolName(row.base, row.name),
      precision: PRECISION_OVERRIDES[row.symbol] ?? row.precision ?? seed?.precision ?? 4,
    };
  });

  // Keep aliased seed symbols that Binance lists under a different contract id.
  for (const seed of SEED_UNIVERSE) {
    if (!enriched.some((s) => s.symbol === seed.symbol)) {
      enriched.push({ ...seed });
    }
  }

  enriched.sort((a, b) => {
    const ra = UNDERLYING_RANK[a.underlyingType ?? "COIN"] ?? 99;
    const rb = UNDERLYING_RANK[b.underlyingType ?? "COIN"] ?? 99;
    if (ra !== rb) return ra - rb;
    return a.symbol.localeCompare(b.symbol);
  });

  UNIVERSE.length = 0;
  UNIVERSE.push(...enriched);
  rebuildIndex();
  notifyUniverse();
}

let loadPromise: Promise<void> | null = null;

/** Fetch full Binance USDT perpetual universe (crypto + TradFi). */
export async function loadUniverseFromBinance(): Promise<void> {
  if (loadPromise) return loadPromise;
  loadPromise = (async () => {
    try {
      const res = await fetch("/api/binance/symbols", { cache: "no-store" });
      if (!res.ok) return;
      const rows = (await res.json()) as SymbolInfo[];
      if (!Array.isArray(rows) || rows.length === 0) return;
      replaceUniverse(rows);
    } catch {
      /* keep seed */
    }
  })();
  return loadPromise;
}

export function getSymbol(symbol: string): SymbolInfo {
  const bare = symbol.replace(/\.P$/i, "").toUpperCase();
  const entry = BY_SYMBOL.get(bare);
  if (entry) {
    const ov = PRECISION_OVERRIDES[bare];
    return ov !== undefined ? { ...entry, precision: ov } : entry;
  }
  return {
    symbol: bare,
    base: bare.replace(/USDT$/i, ""),
    quote: "USDT",
    name: resolveSymbolName(bare.replace(/USDT$/i, ""), bare),
    precision: PRECISION_OVERRIDES[bare] ?? 4,
  };
}

/** Display label — perpetuals get TradingView-style `.P`. */
export function formatTicker(symbol: string): string {
  const bare = symbol.replace(/\.P$/i, "").toUpperCase();
  return `${bare}.P`;
}

export function tickerBase(symbol: string): string {
  return symbol.replace(/\.P$/i, "").replace(/USDT$/i, "");
}

export const DEFAULT_SYMBOLS = SEED_UNIVERSE.slice(0, 12).map((s) => s.symbol);

export const DEFAULT_WATCHLIST_GROUPS: WatchlistGroup[] = [
  {
    id: "line-up",
    name: "LINE UP",
    collapsed: false,
    symbols: ["BTCUSDT.P", "XAUUSDT.P", "MUUSDT.P", "SOLUSDT.P", "SKHYNIXUSDT.P", "BNBUSDT.P"],
  },
  {
    id: "bench",
    name: "BENCH",
    collapsed: false,
    symbols: [],
  },
  {
    id: "coach",
    name: "COACH",
    collapsed: false,
    symbols: [],
  },
];

export const DEFAULT_WATCHLIST = DEFAULT_WATCHLIST_GROUPS.flatMap((g) => g.symbols);

const SYMBOL_COLORS: Record<string, string> = {
  BTCUSDT: "#f7931a",
  ETHUSDT: "#627eea",
  SOLUSDT: "#14f195",
  BNBUSDT: "#f3ba2f",
  XRPUSDT: "#346aa9",
  ADAUSDT: "#0033ad",
  DOGEUSDT: "#c2a633",
  AVAXUSDT: "#e84142",
  DOTUSDT: "#e6007a",
  LINKUSDT: "#2a5ada",
  XAUUSDT: "#d4af37",
  XAGUSDT: "#c0c0c0",
  MUUSDT: "#0d47a1",
  TSLAUSDT: "#cc0000",
  NVDAUSDT: "#76b900",
};

export function symbolColor(symbol: string): string {
  return SYMBOL_COLORS[symbol] ?? "#2962ff";
}
