import { MAWS } from "@/lib/maws/brand";

export type BrokerId = "mock" | "binance" | "okx";

export type Broker = {
  id: BrokerId;
  name: string;
  tagline: string;
  rating: number | null;
  badge: "featured" | "beta" | null;
  enabled: boolean;
};

/** Add or edit brokers here. Connect adapters in `connectBroker`. */
export const BROKERS: Broker[] = [
  {
    id: "mock",
    name: "Paper Trading",
    tagline: `Brokerage simulator by ${MAWS}`,
    rating: null,
    badge: null,
    enabled: true,
  },
  {
    id: "binance",
    name: "Binance",
    tagline: "USDT-M futures via the MAWS server",
    rating: 4.2,
    badge: null,
    enabled: true,
  },
  {
    id: "okx",
    name: "OKX",
    tagline: "Spot and perpetual swaps",
    rating: 4.6,
    badge: null,
    enabled: false,
  },
];

export const MOCK_START_BALANCE = 100_000;

export function brokerById(id: BrokerId) {
  return BROKERS.find((b) => b.id === id) ?? null;
}

export async function connectBroker(id: BrokerId): Promise<void> {
  const broker = brokerById(id);
  if (!broker?.enabled) return;
  const { useAppStore } = await import("@/lib/store");
  const current = useAppStore.getState().connectedBroker;

  if (id === "mock") {
    // Switching away from live first tears down the browser attachment. The
    // server may continue monitoring, but this UI can only show paper state.
    if (current === "binance") {
      const { disconnectLiveBroker } = await import("@/lib/live/bridge");
      await disconnectLiveBroker();
    }
    const m = await import("@/lib/trading/mock");
    m.connectMock();
    return;
  }
  if (id === "binance") {
    const { connectLiveBroker } = await import("@/lib/live/bridge");
    // connectLiveBroker owns the fail-closed store transition and only marks
    // Binance after confirmed manager and stream health.
    await connectLiveBroker();
  }
}
