import "server-only";

import type { EnvConfig, MawsEnv } from "../env/config";
import type { AccountDto, OrderDto, PositionDto } from "../binance/dto";

export type RiskStatus = "green" | "yellow" | "red" | "unavailable";

export interface RiskLimitStatus {
  limit: number;
  current: number;
  utilization: number;
  status: RiskStatus;
}

export interface DailyLossLimitStatus {
  limitPct: number;
  limitUsd: number;
  currentRealizedUsd: number;
  currentLossPct: number;
  distanceUsd: number;
  distancePct: number;
  utilization: number;
  status: RiskStatus;
}

export interface RiskCockpitPosition {
  symbol: string;
  side: PositionDto["side"];
  size: number;
  entryPrice: number;
  currentPrice: number;
  notional: number;
  leverage: number;
  liquidationPrice: number | null;
  liquidationDistancePct: number | null;
  liquidationStatus: RiskStatus;
  unrealizedPnl: number;
}

export interface RiskCockpitSnapshot {
  timestamp: number;
  env: MawsEnv;
  sourceAvailable: boolean;
  sourceMessage: string | null;
  account: {
    balanceUsd: number | null;
    equityUsd: number | null;
    usedMarginUsd: number | null;
    freeMarginUsd: number | null;
    unrealizedPnlUsd: number;
  };
  exposure: {
    grossNotionalUsd: number;
    effectiveLeverage: number | null;
    bySymbol: Array<{ symbol: string; notionalUsd: number; percentage: number }>;
  };
  limits: {
    maxOrderNotional: RiskLimitStatus & { currentLabel: string };
    grossExposure: RiskLimitStatus;
    positionCount: RiskLimitStatus;
    dailyLoss: DailyLossLimitStatus;
  };
  pnl: {
    realizedTodayUsd: number;
    unrealizedUsd: number;
    totalTodayUsd: number;
    dailyLossLimitUsd: number | null;
    distanceToDailyLossLimitUsd: number | null;
    distanceToDailyLossLimitPct: number | null;
  };
  positions: RiskCockpitPosition[];
}

export interface RiskCockpitInput {
  env: MawsEnv;
  risk: EnvConfig["risk"];
  account: AccountDto | null;
  positions: readonly PositionDto[];
  orders: readonly OrderDto[];
  realizedTodayUsd: number;
  timestamp?: number;
  sourceAvailable?: boolean;
}

export function utilizationStatus(utilization: number): RiskStatus {
  if (!Number.isFinite(utilization)) return "unavailable";
  if (utilization < 0.7) return "green";
  if (utilization <= 0.9) return "yellow";
  return "red";
}

/**
 * Liquidation thresholds are intentionally separate from limit utilization:
 * 20% or more distance is green, 10-20% is yellow, and under 10% is red.
 */
export function liquidationStatus(distancePct: number | null): RiskStatus {
  if (distancePct == null || !Number.isFinite(distancePct)) return "unavailable";
  if (distancePct >= 20) return "green";
  if (distancePct >= 10) return "yellow";
  return "red";
}

export function liquidationDistancePct(
  side: PositionDto["side"],
  currentPrice: number,
  liquidationPrice: number | null,
): number | null {
  if (!Number.isFinite(currentPrice) || currentPrice <= 0 || liquidationPrice == null || liquidationPrice <= 0) {
    return null;
  }
  const distance = side === "long"
    ? currentPrice - liquidationPrice
    : liquidationPrice - currentPrice;
  return (distance / currentPrice) * 100;
}

export function aggregateRiskCockpit(input: RiskCockpitInput): RiskCockpitSnapshot {
  const timestamp = input.timestamp ?? Date.now();
  const sourceAvailable = input.sourceAvailable ?? true;
  const positions = input.positions.map((position) => {
    const size = finiteOrZero(position.qty);
    const entryPrice = finiteOrZero(position.entry);
    const currentPrice = finiteOrZero(position.mark);
    const notional = Math.abs(size * currentPrice);
    const liquidationPrice = finitePositiveOrNull(position.liq);
    const distance = liquidationDistancePct(position.side, currentPrice, liquidationPrice);
    return {
      symbol: position.symbol,
      side: position.side,
      size,
      entryPrice,
      currentPrice,
      notional,
      leverage: finiteOrZero(position.leverage),
      liquidationPrice,
      liquidationDistancePct: distance,
      liquidationStatus: liquidationStatus(distance),
      unrealizedPnl: finiteOrZero(position.unrealized),
    };
  });

  const grossNotionalUsd = sum(positions.map((position) => position.notional));
  const unrealizedUsd = sum(positions.map((position) => position.unrealizedPnl));
  const bySymbolMap = new Map<string, number>();
  for (const position of positions) {
    bySymbolMap.set(position.symbol, (bySymbolMap.get(position.symbol) ?? 0) + position.notional);
  }
  const bySymbol = [...bySymbolMap.entries()]
    .map(([symbol, notionalUsd]) => ({
      symbol,
      notionalUsd,
      percentage: grossNotionalUsd > 0 ? (notionalUsd / grossNotionalUsd) * 100 : 0,
    }))
    .sort((a, b) => b.notionalUsd - a.notionalUsd);

  const balanceUsd = input.account ? finiteOrZero(input.account.balance) : null;
  const equityUsd = input.account ? finiteOrZero(input.account.equity) : null;
  const usedMarginUsd = input.account ? finiteOrZero(input.account.margin) : null;
  const freeMarginUsd = input.account ? finiteOrZero(input.account.available) : null;
  const effectiveLeverage = equityUsd != null && equityUsd > 0 ? grossNotionalUsd / equityUsd : null;
  const maxOpenOrderNotional = input.orders.reduce((max, order) => {
    const value = Math.abs(finiteOrZero(order.price) * finiteOrZero(order.qty));
    return Math.max(max, value);
  }, 0);
  const dailyLossLimitUsd = balanceUsd != null ? (balanceUsd * input.risk.dailyLossPct) / 100 : 0;
  const realizedTodayUsd = finiteOrZero(input.realizedTodayUsd);
  const currentLossUsd = Math.max(0, -realizedTodayUsd);
  const currentLossPct = balanceUsd && balanceUsd > 0 ? (currentLossUsd / balanceUsd) * 100 : 0;
  const dailyLossUtilization = dailyLossLimitUsd > 0 ? currentLossUsd / dailyLossLimitUsd : 0;
  const distanceUsd = Math.max(0, dailyLossLimitUsd - currentLossUsd);
  const distancePct = Math.max(0, input.risk.dailyLossPct - currentLossPct);

  return {
    timestamp,
    env: input.env,
    sourceAvailable,
    sourceMessage: sourceAvailable ? null : "No server-side trading state available",
    account: {
      balanceUsd,
      equityUsd,
      usedMarginUsd,
      freeMarginUsd,
      unrealizedPnlUsd: unrealizedUsd,
    },
    exposure: {
      grossNotionalUsd,
      effectiveLeverage,
      bySymbol,
    },
    limits: {
      maxOrderNotional: {
        limit: input.risk.maxOrderNotionalUsd,
        current: maxOpenOrderNotional,
        utilization: utilization(input.risk.maxOrderNotionalUsd, maxOpenOrderNotional),
        status: utilizationStatus(utilization(input.risk.maxOrderNotionalUsd, maxOpenOrderNotional)),
        currentLabel: "Largest existing open order notional",
      },
      grossExposure: limitStatus(input.risk.maxGrossExposureUsd, grossNotionalUsd),
      positionCount: limitStatus(input.risk.maxOpenPositions, positions.length),
      dailyLoss: {
        limitPct: input.risk.dailyLossPct,
        limitUsd: dailyLossLimitUsd,
        currentRealizedUsd: realizedTodayUsd,
        currentLossPct,
        distanceUsd,
        distancePct,
        utilization: dailyLossUtilization,
        status: utilizationStatus(dailyLossUtilization),
      },
    },
    pnl: {
      realizedTodayUsd,
      unrealizedUsd,
      totalTodayUsd: realizedTodayUsd + unrealizedUsd,
      dailyLossLimitUsd: sourceAvailable ? dailyLossLimitUsd : null,
      distanceToDailyLossLimitUsd: sourceAvailable ? distanceUsd : null,
      distanceToDailyLossLimitPct: sourceAvailable ? distancePct : null,
    },
    positions,
  };
}

function limitStatus(limit: number, current: number): RiskLimitStatus {
  const ratio = utilization(limit, current);
  return { limit, current, utilization: ratio, status: utilizationStatus(ratio) };
}

function utilization(limit: number, current: number): number {
  return limit > 0 ? current / limit : Number.NaN;
}

function finiteOrZero(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function finitePositiveOrNull(value: number | null): number | null {
  return value != null && Number.isFinite(value) && value > 0 ? value : null;
}

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}
