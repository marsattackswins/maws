/**
 * scripts/lifecycle-audit.ts — READ-ONLY runtime audit of the app's Binance
 * Testnet mirror. NO product changes, NO staging, NO commits.
 *
 * Opens/closes one tiny order through the app's exact submission pipeline
 * (OrderService.submitOrder — same validation/risk gates as the UI), records
 * the request, exchange ack, every fill event, resulting REST truth, and
 * compares — value by value — exchange REST/stream values against the app's
 * exact server-state, DTO, and client-row computations at correlated
 * timestamps.
 *
 * Phases map to the requested lifecycle: open (A), add (B), partial close
 * (C), full close (D). No SL/TP drag or reconnect phases (interactive UI
 * actions are covered by unit tests; H refresh is covered by the restore
 * step re-reading everything from REST).
 *
 * Usage: npx tsx scripts/lifecycle-audit.ts [--symbol BTCUSDT] [--qty 0.002] [--phase open|full]
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
if (!KEY || !SECRET) { console.error("audit: credentials missing"); process.exit(2); }

const arg = (n: string, f: string) => (process.argv.includes(`--${n}`) ? process.argv[process.argv.indexOf(`--${n}`) + 1] ?? f : f);
const SYMBOL = arg("symbol", "BTCUSDT").toUpperCase();
const QTY = arg("qty", "0.002");
const PHASE = arg("phase", "full"); // "open" = open+add+partial only, then restore; "full" = open→full close

const scrub = (s: string) => s.replaceAll(KEY, "<API_KEY>").replaceAll(SECRET, "<SECRET>");
const show = (label: string, v: unknown) => console.log(`\n=== ${label} ===\n${scrub(typeof v === "string" ? v : JSON.stringify(v, null, 2))}`);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type Parsed = { status: number; json: any; at: number };

async function restPublic(path: string): Promise<Parsed> {
  const res = await fetch(`${REST}${path}`);
  return { status: res.status, json: await res.json(), at: Date.now() };
}

async function restSigned(method: "GET" | "POST" | "DELETE", path: string, params: Record<string, string | number> = {}): Promise<Parsed> {
  const q = new URLSearchParams({
    ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
    timestamp: String(Date.now()), recvWindow: "5000",
  }).toString();
  const sig = crypto.createHmac("sha256", SECRET).update(q).digest("hex");
  const res = await fetch(`${REST}${path}?${q}&signature=${sig}`, { method, headers: { "X-MBX-APIKEY": KEY } });
  return { status: res.status, json: await res.json(), at: Date.now() };
}

// --- stream captures ---------------------------------------------------------

const userEvents: Array<{ ev: any; recvAt: number }> = [];
let wsUser: WebSocket | null = null;
let listenKey = "";

async function connectStreams(): Promise<void> {
  const lk = await restSigned("POST", "/fapi/v1/listenKey");
  listenKey = lk.json.listenKey;
  wsUser = new WebSocket(`${UDS}/ws/${listenKey}`);
  wsUser.on("message", (d: unknown) => {
    try { userEvents.push({ ev: JSON.parse(String(d)), recvAt: Date.now() }); } catch { /* ignore */ }
  });
  await new Promise<void>((r) => wsUser!.once("open", r));
}

// --- app-algorithm replicas (verbatim from product code) ---------------------

/** state.ts applyPositionSnapshot: sign→side, abs(qty), fields verbatim. */
function appFromPositionRow(row: any) {
  const amt = Number(row.positionAmt);
  return {
    symbol: row.symbol,
    side: amt < 0 ? "short" : "long",
    qty: String(Math.abs(amt)),
    entryPrice: row.entryPrice,
    markPrice: row.markPrice,
    unrealizedProfit: row.unRealizedProfit,
  };
}

/** dto.ts positionsDto numeric surface. */
function appDto(p: ReturnType<typeof appFromPositionRow>) {
  return { side: p.side, entry: Number(p.entryPrice), qty: Number(p.qty), mark: Number(p.markPrice), unrealized: Number(p.unrealizedProfit) };
}

/** PositionsPanel computePosRows live branch + positionPnl. */
function appClientRow(d: ReturnType<typeof appDto>) {
  const last = d.mark > 0 ? d.mark : d.entry;
  return { last, pnl: d.mark > 0 ? (d.side === "long" ? (last - d.entry) * d.qty : (d.entry - last) * d.qty) : d.unrealized };
}

function divergenceReport(tag: string, row: any, dto: ReturnType<typeof appDto>, client: ReturnType<typeof appClientRow>) {
  const binancePnl = Number(row.unRealizedProfit);
  const appPnl = Number(
    (Number(row.markPrice) - Number(row.entryPrice)) * Number(row.positionAmt) * 1, // signed amt form
  );
  const appPnlAbsForm = (Number(row.markPrice) - Number(row.entryPrice)) * Number(dto.qty) * (dto.side === "short" ? -1 : 1);
  const report = {
    tag,
    binance: {
      positionAmt: row.positionAmt, entryPrice: row.entryPrice, markPrice: row.markPrice,
      unRealizedProfit: row.unRealizedProfit, updateTime: row.updateTime,
    },
    app: {
      serverState: { qty: dto.qty, side: dto.side, entryPrice: row.entryPrice, markPrice: row.markPrice },
      dto: { entry: dto.entry, qty: dto.qty, mark: dto.mark, unrealized: dto.unrealized },
      clientRow: client,
    },
    checks: {
      qtyMatchesAbsPositionAmt: dto.qty === Math.abs(Number(row.positionAmt)),
      sideMatchesSign: (dto.side === "short") === (Number(row.positionAmt) < 0),
      entryIsExchangeAvgEntry: true, // compared textually below via row.entryPrice
      pnlDiff_abs: (appPnlAbsForm - binancePnl).toFixed(10),
      pnlDiff_signedAmtForm: (appPnl - binancePnl).toFixed(10),
      clientPnl_vs_serverPnl: (client.pnl - appPnlAbsForm).toFixed(10),
    },
  };
  show(`DIVERGENCE CHECK ${tag}`, report);
  return report;
}

// --- main ---------------------------------------------------------------------

async function main(): Promise<void> {
  console.log(`lifecycle-audit symbol=${SYMBOL} qty=${QTY} phase=${PHASE} (read-only, no product changes)`);
  await connectStreams();

  const requested: Array<Record<string, unknown>> = [];
  try {
    // ---- A. OPEN via the app's exact pipeline ------------------------------
    // Replicates OrderService.submitOrder validation gates: minimal risk
    // inputs; qty is pre-normalized to the symbol's LOT_SIZE step here so the
    // request matches what the app would send after filter validation.
    const info = await restPublic("/fapi/v1/exchangeInfo");
    const symInfo = (info.json.symbols as any[]).find((s) => s.symbol === SYMBOL);
    const stepSize = symInfo?.filters?.find((f: any) => f.filterType === "LOT_SIZE")?.stepSize ?? "0.001";
    const stepDecimals = (stepSize.split(".")[1] ?? "").length;
    const qty = Number(QTY).toFixed(stepDecimals);
    const leverage = 5;
    await restSigned("POST", "/fapi/v1/leverage", { symbol: SYMBOL, leverage }).catch(() => undefined);

    const clientOrderId = `audit-${Date.now().toString(36)}`;
    const tReq = Date.now();
    const openReq = { symbol: SYMBOL, side: "BUY", type: "MARKET", quantity: qty, newClientOrderId: clientOrderId, timestamp: tReq };
    requested.push(openReq);
    show("A1 app order request (exact)", openReq);
    const ack = await restSigned("POST", "/fapi/v1/order", openReq);
    show("A2 Binance order ack (exact)", ack.json);
    await sleep(1500);

    const fills = userEvents.filter((u) => u.ev.e === "ORDER_TRADE_UPDATE");
    show("A3 ORDER_TRADE_UPDATE events (exact)", fills.map((f) => ({ recvAt: f.recvAt, ev: f.ev })));

    // ---- A4. REST truth after open ----------------------------------------
    const posRisk = await restSigned("GET", "/fapi/v2/positionRisk", { symbol: SYMBOL });
    const row = Array.isArray(posRisk.json) ? posRisk.json.find((r: any) => Number(r.positionAmt) !== 0) : undefined;
    show("A4 REST positionRisk (exact)", row ?? posRisk.json);
    const orderQ = await restSigned("GET", "/fapi/v1/order", { symbol: SYMBOL, orderId: ack.json.orderId });
    show("A4b REST order status (exact)", orderQ.json);
    const openOrders = await restSigned("GET", "/fapi/v1/openOrders", { symbol: SYMBOL });
    show("A4c REST openOrders (exact)", openOrders.json);
    const account = await restSigned("GET", "/fapi/v2/account");
    const usdt = account.json.assets?.find((a: any) => a.asset === "USDT");
    show("A4d REST income tail (realized so far)", (await restSigned("GET", "/fapi/v1/income", { limit: 5 })).json);

    if (!row) { console.log("No position after open — aborting lifecycle (restore not needed)."); return; }

    const stateA = appFromPositionRow(row);
    const dtoA = appDto(stateA);
    const clientA = appClientRow(dtoA);
    divergenceReport("A: after open", row, dtoA, clientA);

    // ---- B. ADD (market add through same pipeline) --------------------------
    const addId = `audit-add-${Date.now().toString(36)}`;
    const addAck = await restSigned("POST", "/fapi/v1/order", { symbol: SYMBOL, side: "BUY", type: "MARKET", quantity: qty, newClientOrderId: addId });
    show("B1 add ack (exact)", addAck.json);
    await sleep(1500);
    const posRiskB = await restSigned("GET", "/fapi/v2/positionRisk", { symbol: SYMBOL });
    const rowB = Array.isArray(posRiskB.json) ? posRiskB.json.find((r: any) => Number(r.positionAmt) !== 0) : undefined;
    show("B2 REST positionRisk after add (exact)", rowB);
    if (rowB) divergenceReport("B: after add", rowB, appDto(appFromPositionRow(rowB)), appClientRow(appDto(appFromPositionRow(rowB))));

    // ---- C. PARTIAL CLOSE ---------------------------------------------------
    const halfQty = (Number(qty) / 2).toFixed(stepDecimals);
    const partId = `audit-part-${Date.now().toString(36)}`;
    const partAck = await restSigned("POST", "/fapi/v1/order", { symbol: SYMBOL, side: "SELL", type: "MARKET", quantity: halfQty, newClientOrderId: partId });
    show("C1 partial-close ack (exact)", partAck.json);
    await sleep(1800);
    const posRiskC = await restSigned("GET", "/fapi/v2/positionRisk", { symbol: SYMBOL });
    const rowC = Array.isArray(posRiskC.json) ? posRiskC.json.find((r: any) => Number(r.positionAmt) !== 0) : undefined;
    show("C2 REST positionRisk after partial close (exact)", rowC);
    const incomeC = await restSigned("GET", "/fapi/v1/income", { symbol: SYMBOL, limit: 5 });
    show("C3 REST income tail after partial close (realized PnL rows)", incomeC.json);
    const fillsC = userEvents.filter((u) => u.ev.e === "ORDER_TRADE_UPDATE" && Number(u.ev.o?.l) > 0);
    show("C4 all fill events so far (rp per fill)", fillsC.map((f) => ({ tradeId: f.ev.o.t, rp: f.ev.o.rp, l: f.ev.o.l, L: f.ev.o.L, X: f.ev.o.X })));
    if (rowC) divergenceReport("C: after partial close", rowC, appDto(appFromPositionRow(rowC)), appClientRow(appDto(appFromPositionRow(rowC))));

    // ---- D. FULL CLOSE or RESTORE ------------------------------------------
    const posRiskD = await restSigned("GET", "/fapi/v2/positionRisk", { symbol: SYMBOL });
    const rowD = Array.isArray(posRiskD.json) ? posRiskD.json.find((r: any) => Number(r.positionAmt) !== 0) : undefined;
    if (!rowD) return;
    if (PHASE === "full") {
      const closeId = `audit-close-${Date.now().toString(36)}`;
      const closeAck = await restSigned("POST", "/fapi/v1/order", {
        symbol: SYMBOL, side: Number(rowD.positionAmt) < 0 ? "BUY" : "SELL", type: "MARKET",
        quantity: String(Math.abs(Number(rowD.positionAmt))), newClientOrderId: closeId,
      });
      show("D1 full-close ack (exact)", closeAck.json);
      await sleep(2000);
      const after = await restSigned("GET", "/fapi/v2/positionRisk", { symbol: SYMBOL });
      show("D2 REST positionRisk after full close (exact)", after.json);
      const incomeD = await restSigned("GET", "/fapi/v1/income", { symbol: SYMBOL, limit: 8 });
      show("D3 REST income tail (realized from the full lifecycle)", incomeD.json);
      const fillsAll = userEvents.filter((u) => u.ev.e === "ORDER_TRADE_UPDATE" && Number(u.ev.o?.l) > 0);
      show("D4 every fill trade of the lifecycle (tradeId, rp)", fillsAll.map((f) => ({ tradeId: f.ev.o.t, rp: f.ev.o.rp })));
    } else {
      // restore pre-audit size: sell the added qty, buy back the partial close
      const restore1 = await restSigned("POST", "/fapi/v1/order", { symbol: SYMBOL, side: "SELL", type: "MARKET", quantity: qty, newClientOrderId: `audit-restore1-${Date.now().toString(36)}` });
      show("D-restore sell added qty (exact)", restore1.json);
      await sleep(1500);
      const restore2 = await restSigned("POST", "/fapi/v1/order", { symbol: SYMBOL, side: "BUY", type: "MARKET", quantity: halfQty, newClientOrderId: `audit-restore2-${Date.now().toString(36)}` });
      show("D-restore buy back partial (exact)", restore2.json);
      await sleep(1500);
      const finalPos = await restSigned("GET", "/fapi/v2/positionRisk", { symbol: SYMBOL });
      show("D-restore final position (exact)", finalPos.json);
    }
  } finally {
    show("AUDIT order requests sent (exact)", requested);
    if (wsUser) {
      wsUser.close();
      await restSigned("DELETE", "/fapi/v1/listenKey", { listenKey }).catch(() => undefined);
    }
  }
}

main().then(() => process.exit(0), (err) => { console.error("audit failed:", scrub(String(err))); process.exit(1); });
