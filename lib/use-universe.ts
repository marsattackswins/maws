"use client";

import { useSyncExternalStore } from "react";
import {
  getUniverseVersion,
  subscribeUniverse,
  UNIVERSE,
} from "@/lib/maws/universe";
import type { SymbolInfo } from "@/types";

function getSnapshot(): number {
  return getUniverseVersion();
}

/** Reactive universe (Binance USDT perps + spot FX). */
export function useUniverse(): SymbolInfo[] {
  useSyncExternalStore(subscribeUniverse, getSnapshot, getSnapshot);
  return UNIVERSE.slice();
}
