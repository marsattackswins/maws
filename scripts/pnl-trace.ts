/**
 * scripts/pnl-trace.ts — READ-ONLY layered unrealized-PnL trace (investigation tool).
 *
 * Captures, at correlated timestamps, every layer between Binance USD-M Futures
 * Testnet and the app's displayed dollar PnL for ONE position:
 *
 *   L1  Binance REST GET /fapi/v2/positionRisk          (raw JSON)
 *   L2  Binance user stream ACCOUNT_UPDATE              (raw JSON)
 *   L3  Binance public markPrice@1s stream              (raw JSON)
 *   L4  server state after applyMarkPrice               (app algorithm, verbatim)
 *   L5  DTO sent to the browser                         (positionsDto shape)
 *   L6  PositionsPanel computePosRows row               (client algorithm, verbatim)
 *   L7  final displayed string                          (formatUsd rounding)
 *
 * Replicated app code (kept byte-for-byte in arithmetic):
 *   lib/server/binance/state.ts        applyPositionSnapshot / applyMarkPrice
 *   lib/server/binance/dto.ts          positionsDto
 *   components/trading/PositionsPanel  positionPnl / computePosRows / formatUsd
 *
 * Modes:
 *   --no-open          trace an EXISTING position; zero trading side effects.
 *   (default)          opens one tiny MARKET position first, closes it at the end.
 *   --fill-test        additionally does one partial close (BUY/SELL 0.001) to
 *                      force an ACCOUNT_UPDATE, captures the post-fill state,
 *                      then restores the position size with an opposite order.
 *   --symbol --qty --side
 *
 * All output is secret-scrubbed. No app code is modified by this tool.
 */
import crypto from "node:crypto";
import WebSocket from "ws";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const REST = "https://testnet.binancefuture.com";
const UDS = "wss://fstream.binancefuture.com";
const KEY = process.env.MAWS_BINANCE_TESTNET_API_KEY ?? process.env.MAWS_BINANCE_API_KEY ?? "";
const SECRET = process.env.MAWS_BINANCE_TESTNET_API_SECRET ?? process.env.MAWS_BINANCE_API_SECRET ?? "";
if (!KEY || !SECRET) {
  console.error("pnl-trace: testnet credentials not found");
  process.exit(2);
}

const arg = (n: string, f: string) => (process.argv.includes(`--${n}`) ? process.argv[process.argv.indexOf(`--${n}`) + 1] ?? f : f);
const SYMBOL = arg("symbol", "BTCUSDT").toUpperCase();
const QTY = arg("qty", "0.001");
const SIDE = arg("side", "BUY").toUpperCase() === "SELL" ? "SELL" : "BUY";
const NO_OPEN = process.argv.includes("--no-open");
const FILL_TEST = process.argv.includes("--fill-test");

const scrub = (s: string) => s.replaceAll(KEY, "<API_KEY>").replaceAll(SECRET, "<SECRET>");
const show = (label: string, v: unknown) => console.log(`\n=== ${label} ===\n${scrub(typeof v === "string" ? v : JSON.stringify(v, null, 2))}`);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type Parsed = { status: number; json: any; localRecvMs: number; at: number };

async function restPublic(path: string): Promise<Parsed> {
  const t0 = Date.now();
  const res = await fetch(`${REST}${path}`);
  const text = await res.text();
  return { status: res.status, json: JSON.parse(text), localRecvMs: Date.now() - t0, at: t0 };
}

async function restSigned(method: "GET" | "POST" | "DELETE", path: string, params: Record<string, string | number> = {}): Promise<Parsed> {
  const q = new URLSearchParams({
    ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
    timestamp: String(Date.now()),
    recvWindow: "5000",
  }).toString();
  const sig = crypto.createHmac("sha256", SECRET).update(q).digest("hex");
  const t0 = Date.now();
  const res = await fetch(`${REST}${path}?${q}&signature=${sig}`, { method, headers: { "X-MBX-APIKEY": KEY } });
  const text = await res.text();
  return { status: res.status, json: JSON.parse(text), localRecvMs: Date.now() - t0, at: t0 };
}

// --- app algorithm replicas (verbatim) --------------------------------------

type SimPos = { symbol: string; side: "long" | "short"; qty: string; entryPrice: string; markPrice: string; unrealizedProfit: string };

/** state.ts applyMarkPrice */
function appApplyMarkPrice(pos: SimPos, markPrice: string): SimPos {
  const pnl = (Number(markPrice) - Number(pos.entryPrice)) * Number(pos.qty) * (pos.side === "short" ? -1 : 1);
  return { ...pos, markPrice: String(markPrice), unrealizedProfit: String(Number.isFinite(pnl) ? Number(pnl.toFixed(8)) : 0) };
}

/** state.ts applyPositionSnapshot / applyAccountEvent side+qty derivation */
function appDeriveSide(amt: string): { side: "long" | "short"; absQty: string } {
  const n = Number(amt);
  return n < 0 ? { side: "short", absQty: String(-n) } : { side: "long", absQty: String(n) };
}

/** PositionsPanel.tsx positionPnl */
const positionPnl = (side: string, entry: number, qty: number, last: number) =>
  side === "long" ? (last - entry) * qty : (entry - last) * qty;

/** PositionsPanel.tsx formatUsd */
function formatUsd(value: number, digits = 2): string {
  const abs = Math.abs(value).toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
  return value < 0 ? `-$${abs}` : `$${abs}`;
}

// --- stream collectors -------------------------------------------------------

async function collectStreams() {
  const marks: Array<{ raw: string; p: string; E: number; recvAt: number }> = [];
  const users: Array<{ raw: string; ev: any; recvAt: number }> = [];

  const lk = await restSigned("POST", "/fapi/v1/listenKey");
  const listenKey = lk.json.listenKey as string;

  const wsMark = new WebSocket(`${UDS}/stream?streams=${SYMBOL.toLowerCase()}@markPrice@1s`);
  const wsUser = new WebSocket(`${UDS}/ws/${listenKey}`);
  wsMark.on("message", (d: unknown) => {
    try {
      const wrapped = JSON.parse(String(d));
      const ev = wrapped.data ?? wrapped;
      if (ev?.e === "markPriceUpdate") marks.push({ raw: String(d), p: ev.p, E: ev.E, recvAt: Date.now() });
    } catch { /* ignore */ }
  });
  wsUser.on("message", (d: unknown) => {
    try { users.push({ raw: String(d), ev: JSON.parse(String(d)), recvAt: Date.now() }); } catch { /* ignore */ }
  });
  await Promise.all([new Promise<void>((r) => wsMark.once("open", r)), new Promise<void>((r) => wsUser.once("open", r))]);

  return {
    marks, users,
    close: async () => {
      wsMark.close(); wsUser.close();
      await restSigned("DELETE", "/fapi/v1/listenKey", { listenKey }).catch(() => undefined);
    },
  };
}

// --- layer derivation ---------------------------------------------------------

/** Builds L4–L7 from a snapshot-like seed (positionRisk row) + stream mark. */
function layersFrom(seed: { positionAmt: string; entryPrice: string; unRealizedProfit: string; markPrice: string }, streamMark: string | null) {
  const { side, absQty } = appDeriveSide(seed.positionAmt);
  // L4 seed: applyPositionSnapshot stores the exchange row verbatim…
  const seeded: SimPos = { symbol: SYMBOL, side, qty: absQty, entryPrice: seed.entryPrice, markPrice: seed.markPrice, unrealizedProfit: seed.unRealizedProfit };
  // …then applyMarkPrice with the freshest known mark (stream if any, else row).
  const afterMark = streamMark ? appApplyMarkPrice(seeded, streamMark) : seeded;
  // L5 DTO: Number() conversions only (positionsDto).
  const dto = { side, entry: Number(afterMark.entryPrice), qty: Number(afterMark.qty), mark: Number(afterMark.markPrice), unrealized: Number(afterMark.unrealizedProfit) };
  // L6 client: computePosRows live branch.
  const last = dto.mark > 0 ? dto.mark : dto.entry;
  const clientPnl = dto.mark > 0 ? positionPnl(dto.side, dto.entry, dto.qty, last) : dto.unrealized;
  // L7 display.
  const displayed = formatUsd(clientPnl);
  return { side, absQty, seeded, afterMark, dto, clientPnl, displayed };
}

async function captureOnce(streams: Awaited<ReturnType<typeof collectStreams>>, tag: string): Promise<void> {
  const t0 = Date.now();
  const posRisk = await restSigned("GET", "/fapi/v2/positionRisk", { symbol: SYMBOL });
  const premium = await restPublic(`/fapi/v1/premiumIndex?symbol=${SYMBOL}`);
  const ticker = await restPublic(`/fapi/v1/ticker/price?symbol=${SYMBOL}`);
  const t1 = Date.now();

  const row = Array.isArray(posRisk.json) ? posRisk.json.find((r: any) => Number(r.positionAmt) !== 0) : undefined;
  show(`[${tag}] L1 REST /fapi/v2/positionRisk (raw, full row)`, row ?? posRisk.json);
  show(`[${tag}] L1c REST premiumIndex (raw)`, premium.json);
  show(`[${tag}] L1d REST ticker/price (raw)`, ticker.json);

  const marksWindow = streams.marks.filter((m) => m.recvAt >= t0 - 1500 && m.recvAt <= t1 + 500);
  show(`[${tag}] L3 markPrice stream events around capture (raw)`, marksWindow.map((m) => ({ E: m.E, p: m.p, recvAt: m.recvAt, raw: m.raw })));

  const acctUpdates = streams.users.filter((u) => u.ev?.e === "ACCOUNT_UPDATE");
  const orderUpdates = streams.users.filter((u) => u.ev?.e === "ORDER_TRADE_UPDATE");
  if (acctUpdates.length) show(`[${tag}] L2 ACCOUNT_UPDATE events so far (raw)`, acctUpdates.map((u) => ({ recvAt: u.recvAt, raw: u.raw })));
  else console.log(`\n[${tag}] L2 ACCOUNT_UPDATE: none received (no fill since connect — expected for a static position)`);
  if (orderUpdates.length) show(`[${tag}] L2b ORDER_TRADE_UPDATE events so far (raw, incl. n commission + rp)`, orderUpdates.map((u) => ({ recvAt: u.recvAt, raw: u.raw })));

  if (!row) {
    console.log(`\n[${tag}] No open position; skipping layer math.`);
    return;
  }
  const lastMarkEvent = marksWindow.at(-1);
  const lastMark = lastMarkEvent?.p ?? null;
  const L = layersFrom(row, lastMark);

  const localNow = Date.now();
  const table = [
    {
      layer: "L1 Binance REST positionRisk (exchange truth)",
      endpoint: `${REST}/fapi/v2/positionRisk?symbol=${SYMBOL}`,
      symbol: row.symbol, positionSide: row.positionSide, positionAmt: row.positionAmt,
      entryPrice: row.entryPrice, markPrice: row.markPrice, lastPrice: ticker.json.price,
      unRealizedProfit: row.unRealizedProfit,
      qtyUsedByApp: L.absQty, sideFactor: L.side === "short" ? -1 : 1,
      exchangeUpdateTime: row.updateTime, localAgeMs: localNow - row.updateTime,
      capturedAtLocal: localNow,
    },
    {
      layer: "L3 markPrice@1s stream (what the app feeds applyMarkPrice)",
      symbol: SYMBOL, positionSide: row.positionSide, positionAmt: row.positionAmt,
      entryPrice: row.entryPrice, markPrice: lastMark ?? "(none in window)", lastPrice: "(n/a)",
      unRealizedProfit: "(n/a — stream carries price only)",
      qtyUsedByApp: L.absQty, sideFactor: L.side === "short" ? -1 : 1,
      exchangeEventTime: lastMarkEvent?.E ?? null, localAgeMs: lastMarkEvent ? localNow - lastMarkEvent.E : null,
    },
    {
      layer: "L4 server state after applyMarkPrice (app computation)",
      symbol: SYMBOL, positionSide: row.positionSide, positionAmt: row.positionAmt,
      entryPrice: L.afterMark.entryPrice, markPrice: L.afterMark.markPrice, lastPrice: "(not used)",
      unRealizedProfit: L.afterMark.unrealizedProfit,
      qtyUsedByApp: L.afterMark.qty, sideFactor: L.side === "short" ? -1 : 1,
    },
    {
      layer: "L5 DTO to browser (positionsDto → /api/live/state + SSE)",
      symbol: SYMBOL, positionSide: row.positionSide, positionAmt: row.positionAmt,
      entryPrice: String(L.dto.entry), markPrice: String(L.dto.mark), lastPrice: "(not used)",
      unRealizedProfit: String(L.dto.unrealized),
      qtyUsedByApp: String(L.dto.qty), sideFactor: L.side === "short" ? -1 : 1,
    },
    {
      layer: "L6 client row (computePosRows re-derives pnl from mark+entry)",
      symbol: SYMBOL, positionSide: row.positionSide, positionAmt: row.positionAmt,
      entryPrice: String(L.dto.entry), markPrice: String(L.dto.mark), lastPrice: "(not used)",
      unRealizedProfit: String(L.clientPnl),
      qtyUsedByApp: String(L.dto.qty), sideFactor: L.side === "short" ? -1 : 1,
    },
    {
      layer: "L7 displayed (formatUsd, 2dp)",
      symbol: SYMBOL, positionSide: row.positionSide, positionAmt: row.positionAmt,
      entryPrice: String(L.dto.entry), markPrice: String(L.dto.mark), lastPrice: "(not used)",
      unRealizedProfit: L.displayed,
      qtyUsedByApp: String(L.dto.qty), sideFactor: L.side === "short" ? -1 : 1,
    },
  ];
  console.log(`\n=== [${tag}] LAYER TABLE ===`);
  console.log(scrub(JSON.stringify(table, null, 2)));

  const binanceUp = Number(row.unRealizedProfit);
  const appPnl = Number(L.afterMark.unrealizedProfit);
  const diff = appPnl - binanceUp;
  const qty = Number(L.absQty);
  const diffPerUnit = qty !== 0 ? diff / qty : diff;
  console.log(`\n=== [${tag}] DIVERGENCE (app L4 vs Binance L1, same capture window) ===`);
  console.log(scrub(JSON.stringify({
    binanceUnRealizedProfit: row.unRealizedProfit,
    appLocalPnl: L.afterMark.unrealizedProfit,
    absDiffUsd: diff.toFixed(10),
    markUsedByApp: L.afterMark.markPrice,
    markInPositionRiskRow: row.markPrice,
    markDiff: (Number(L.afterMark.markPrice) - Number(row.markPrice)).toFixed(10),
    diffPerUnitPrice: diffPerUnit.toFixed(10),
    interpretation: "diffPerUnitPrice ≈ markDiff ⇒ pure mark-timestamp difference, not a formula bug",
    clientL6vsServerL4diff: (L.clientPnl - appPnl).toFixed(10),
  }, null, 2)));

  // Account-level context (hypotheses H/I) — aggregates only, no giant dump.
  const acct = await restSigned("GET", "/fapi/v2/account");
  console.log(`\n=== [${tag}] account aggregates (H/I context) ===`);
  console.log(scrub(JSON.stringify({
    totalUnrealizedProfit: acct.json.totalUnrealizedProfit,
    totalMarginBalance: acct.json.totalMarginBalance,
    totalWalletBalance: acct.json.totalWalletBalance,
    usdtAssetUnrealizedProfit: acct.json.assets?.find((a: any) => a.asset === "USDT")?.unrealizedProfit,
  }, null, 2)));
}

async function main(): Promise<void> {
  console.log(`pnl-trace symbol=${SYMBOL} qty=${QTY} side=${SIDE} noOpen=${NO_OPEN} fillTest=${FILL_TEST}`);
  show("L0 environment", {
    restEndpoint: REST,
    userStream: `${UDS}/ws/<listenKey>`,
    markStream: `${UDS}/stream?streams=${SYMBOL.toLowerCase()}@markPrice@1s`,
    apiKeyFingerprint: `${KEY.slice(0, 3)}…${KEY.slice(-3)} (len ${KEY.length})`,
  });

  const streams = await collectStreams();
  try {
    if (!NO_OPEN) {
      const order = await restSigned("POST", "/fapi/v1/order", {
        symbol: SYMBOL, side: SIDE, type: "MARKET", quantity: QTY,
        newClientOrderId: `trace-${Date.now().toString(36)}`,
      });
      show("OPEN order response (raw)", order.json);
      await sleep(1500);
    }

    await captureOnce(streams, "baseline");

    if (FILL_TEST) {
      // Force an ACCOUNT_UPDATE: partial close of the current position.
      const pre = await restSigned("GET", "/fapi/v2/positionRisk", { symbol: SYMBOL });
      const preRow = Array.isArray(pre.json) ? pre.json.find((r: any) => Number(r.positionAmt) !== 0) : undefined;
      if (!preRow) throw new Error("fill-test: no open position");
      const closeSide = Number(preRow.positionAmt) < 0 ? "BUY" : "SELL";
      console.log(`\n--fill-test: partial close ${closeSide} ${QTY} ${SYMBOL} (position ${preRow.positionAmt})`);
      const fill = await restSigned("POST", "/fapi/v1/order", {
        symbol: SYMBOL, side: closeSide, type: "MARKET", quantity: QTY,
        newClientOrderId: `trace-fill-${Date.now().toString(36)}`,
      });
      show("FILL-TEST order response (raw)", fill.json);
      await sleep(2500); // ACCOUNT_UPDATE + new marks arrive
      await captureOnce(streams, "post-fill");

      // Restore the pre-test size with the opposite order.
      const restoreSide = closeSide === "BUY" ? "SELL" : "BUY";
      console.log(`\n--fill-test restore: ${restoreSide} ${QTY} ${SYMBOL}`);
      const restore = await restSigned("POST", "/fapi/v1/order", {
        symbol: SYMBOL, side: restoreSide, type: "MARKET", quantity: QTY,
        newClientOrderId: `trace-restore-${Date.now().toString(36)}`,
      });
      show("RESTORE order response (raw)", restore.json);
      await sleep(2500);
      await captureOnce(streams, "restored");
    }

    if (!NO_OPEN) {
      const pos = await restSigned("GET", "/fapi/v2/positionRisk", { symbol: SYMBOL });
      const row = Array.isArray(pos.json) ? pos.json.find((r: any) => Number(r.positionAmt) !== 0) : undefined;
      if (row) {
        const closeSide = Number(row.positionAmt) < 0 ? "BUY" : "SELL";
        const close = await restSigned("POST", "/fapi/v1/order", {
          symbol: SYMBOL, side: closeSide, type: "MARKET", quantity: String(Math.abs(Number(row.positionAmt))),
          newClientOrderId: `trace-close-${Date.now().toString(36)}`,
        });
        show("CLOSE order response (raw)", close.json);
        await sleep(2000);
      }
      const after = await restSigned("GET", "/fapi/v2/positionRisk", { symbol: SYMBOL });
      show("positionRisk after close (raw)", after.json);
    }
  } finally {
    await streams.close();
  }
}

main().then(() => process.exit(0), (err) => { console.error("pnl-trace failed:", scrub(String(err))); process.exit(1); });
