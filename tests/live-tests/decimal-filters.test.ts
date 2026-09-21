import {
  add,
  div,
  eq,
  gt,
  lt,
  matchesStep,
  mul,
  notionalAtLeast,
  parseDec,
  pctDiff,
  roundDownToStep,
  sub,
  toFixedStr,
  toStr,
} from "@/lib/server/binance/decimal";
import { extractConstraints, orderNotional, validateAgainstConstraints } from "@/lib/server/binance/filters";
import { BTCUSDT_INFO } from "./helpers";

describe("decimal math (BigInt-scaled, no floats)", () => {
  test("parses plain decimals exactly", () => {
    expect(toStr(parseDec("0.001"))).toBe("0.001");
    // toStr is canonical: trailing zeros are dropped.
    expect(toStr(parseDec("50000.10"))).toBe("50000.1");
    expect(toStr(parseDec("-3.5"))).toBe("-3.5");
    expect(toStr(parseDec("0"))).toBe("0");
    expect(toFixedStr(parseDec("50000.1"), 2)).toBe("50000.10");
  });

  test("rejects malformed input", () => {
    for (const bad of ["", "abc", "1.2.3", "1e5", "0x10", "--1", "1,000", "1..0", "."]) {
      expect(() => parseDec(bad)).toThrow();
    }
    // surrounding whitespace is tolerated (trimmed); leading zeros are not.
    expect(toStr(parseDec(" 1.5 "))).toBe("1.5");
    expect(() => parseDec("01")).toThrow();
  });

  test("arithmetic stays exact where floats would not", () => {
    // 0.1 + 0.2 is 0.30000000000000004 in float land.
    expect(toStr(add(parseDec("0.1"), parseDec("0.2")))).toBe("0.3");
    expect(toStr(sub(parseDec("1"), parseDec("0.99999999")))).toBe("0.00000001");
    expect(toStr(mul(parseDec("0.001"), parseDec("50000.1")))).toBe("50.0001");
    expect(eq(parseDec("0.30"), parseDec("0.3"))).toBe(true);
    expect(lt(parseDec("0.1"), parseDec("0.10000001"))).toBe(true);
    expect(gt(parseDec("2"), parseDec("1.999"))).toBe(true);
  });

  test("division rounds at fixed scale", () => {
    expect(toStr(div(parseDec("1"), parseDec("3"), 8))).toBe("0.33333333");
    expect(toStr(div(parseDec("10"), parseDec("4")))).toBe("2.5");
    expect(() => div(parseDec("1"), parseDec("0"))).toThrow();
  });

  test("step matching and rounding use exact modular math", () => {
    const step = parseDec("0.001");
    expect(matchesStep(parseDec("0.123"), step)).toBe(true);
    expect(matchesStep(parseDec("0.1234"), step)).toBe(false);
    expect(toStr(roundDownToStep(parseDec("0.1239"), step))).toBe("0.123");
    expect(toStr(roundDownToStep(parseDec("0.123"), step))).toBe("0.123");

    const tick = parseDec("0.10");
    expect(matchesStep(parseDec("50000.1"), tick)).toBe(true);
    expect(matchesStep(parseDec("50000.15"), tick)).toBe(false);
    expect(toStr(roundDownToStep(parseDec("50000.19"), tick))).toBe("50000.1");
  });

  test("notional comparison is exact", () => {
    // 5 USDT exactly meets a 5 USDT minimum; floats can drift on such edges.
    expect(notionalAtLeast(parseDec("5000"), parseDec("0.001"), parseDec("5"))).toBe(true);
    expect(notionalAtLeast(parseDec("4999.9"), parseDec("0.001"), parseDec("5"))).toBe(false);
  });

  test("percent diff", () => {
    expect(pctDiff(parseDec("105"), parseDec("100"))).toBeCloseTo(5, 10);
    expect(pctDiff(parseDec("95"), parseDec("100"))).toBeCloseTo(-5, 10);
    expect(pctDiff(parseDec("100"), parseDec("0"))).toBe(0);
  });

  test("fixed-scale formatting", () => {
    expect(toFixedStr(parseDec("1.5"), 4)).toBe("1.5000");
    expect(toFixedStr(parseDec("0"), 2)).toBe("0.00");
  });

  test("margin/leverage-derived quantities floor onto the LOT_SIZE grid", () => {
    // UI sizing: 100 USDT margin × 10x leverage at 81100.0 → 0.012330678...
    // Testnet BTCUSDT stepSize is 0.0001; production is 0.001 — both must pass.
    const testnetStep = parseDec("0.0001");
    expect(toStr(roundDownToStep(parseDec("0.012331811"), testnetStep))).toBe("0.0123");
    expect(matchesStep(parseDec("0.0123"), testnetStep)).toBe(true);

    const productionStep = parseDec("0.001");
    expect(toStr(roundDownToStep(parseDec("0.012331811"), productionStep))).toBe("0.012");
    expect(matchesStep(parseDec("0.012"), productionStep)).toBe(true);

    // On-grid values are unchanged, and sub-step sizes floor to zero.
    expect(toStr(roundDownToStep(parseDec("0.0123"), testnetStep))).toBe("0.0123");
    expect(toStr(roundDownToStep(parseDec("0.00005"), testnetStep))).toBe("0");
  });
});

describe("exchange filter extraction and validation", () => {
  const constraints = extractConstraints(BTCUSDT_INFO);

  test("extracts PRICE_FILTER / LOT_SIZE / MIN_NOTIONAL / MAX_NUM_ORDERS", () => {
    expect(constraints.symbol).toBe("BTCUSDT");
    expect(constraints.status).toBe("TRADING");
    expect(toStr(constraints.tickSize)).toBe("0.1");
    expect(toStr(constraints.minPrice)).toBe("0.1");
    expect(toStr(constraints.maxPrice)).toBe("1000000");
    expect(toStr(constraints.stepSize)).toBe("0.001");
    expect(toStr(constraints.minQty)).toBe("0.001");
    expect(toStr(constraints.maxQty)).toBe("100");
    expect(constraints.minNotional && toStr(constraints.minNotional)).toBe("5");
  });

  test("accepts a compliant LIMIT order", () => {
    const errors = validateAgainstConstraints(constraints, {
      symbol: "BTCUSDT",
      type: "LIMIT",
      price: "50000.1",
      qty: "0.001",
    });
    expect(errors).toEqual([]);
  });

  test("rejects prices off the tick grid", () => {
    const errors = validateAgainstConstraints(constraints, {
      symbol: "BTCUSDT",
      type: "LIMIT",
      price: "50000.15",
      qty: "0.001",
    });
    expect(errors.some((e) => e.includes("tickSize"))).toBe(true);
  });

  test("rejects qty off the step grid and outside min/max", () => {
    const offStep = validateAgainstConstraints(constraints, { symbol: "BTCUSDT", type: "MARKET", qty: "0.0005" });
    expect(offStep.some((e) => e.includes("stepSize"))).toBe(true);

    const belowMin = validateAgainstConstraints(constraints, { symbol: "BTCUSDT", type: "MARKET", qty: "0.000" });
    expect(belowMin.length).toBeGreaterThan(0);

    const aboveMax = validateAgainstConstraints(constraints, { symbol: "BTCUSDT", type: "MARKET", qty: "101" });
    expect(aboveMax.some((e) => e.includes("maxQty"))).toBe(true);
  });

  test("stop types validate stopPrice, MARKET needs no price", () => {
    const stopOk = validateAgainstConstraints(constraints, {
      symbol: "BTCUSDT",
      type: "STOP_MARKET",
      stopPrice: "49000.5",
      qty: "0.001",
    });
    expect(stopOk).toEqual([]);

    const stopBadTick = validateAgainstConstraints(constraints, {
      symbol: "BTCUSDT",
      type: "TAKE_PROFIT_MARKET",
      stopPrice: "49000.55",
      qty: "0.001",
    });
    expect(stopBadTick.some((e) => e.includes("tickSize"))).toBe(true);

    const market = validateAgainstConstraints(constraints, { symbol: "BTCUSDT", type: "MARKET", qty: "0.001" });
    expect(market).toEqual([]);
  });

  test("LIMIT requires a price; malformed decimals are rejected", () => {
    const missing = validateAgainstConstraints(constraints, { symbol: "BTCUSDT", type: "LIMIT", qty: "0.001" });
    expect(missing.some((e) => e.includes("price"))).toBe(true);

    const badPrice = validateAgainstConstraints(constraints, {
      symbol: "BTCUSDT",
      type: "LIMIT",
      price: "not-a-number",
      qty: "0.001",
    });
    expect(badPrice.some((e) => e.includes("not a valid decimal"))).toBe(true);
  });

  test("non-TRADING symbols are refused outright", () => {
    const halted = extractConstraints({ ...BTCUSDT_INFO, status: "SETTLING" });
    const errors = validateAgainstConstraints(halted, { symbol: "BTCUSDT", type: "MARKET", qty: "0.001" });
    expect(errors.some((e) => e.includes("not TRADING"))).toBe(true);
  });

  test("notional is exact price*qty", () => {
    expect(toStr(orderNotional("50000.1", "0.001"))).toBe("50.0001");
  });
});
