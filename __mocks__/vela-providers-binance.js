/**
 * Jest manual mock for the `@luxalgo/vela/providers/binance` subpath.
 * The real provider only touches fetch/WebSocket — stubbed here so tests
 * never open network connections.
 */
module.exports = {
  BinanceProvider: jest.fn(function () {
    this.info = jest.fn(() => ({ name: "binance" }));
    this.getBars = jest.fn(() => Promise.resolve([]));
    this.subscribe = jest.fn(() => () => undefined);
    // Enumerable index: lib/vela-feed-adapter.ts narrows it to futures at import time.
    // One Spot + one perpetual mirror the real provider's mixed catalogue.
    this.listSymbols = jest.fn(() =>
      Promise.resolve([
        { ticker: "BTCUSDT", description: "BTC / USDT", type: "crypto" },
        { ticker: "BTCUSDT.P", description: "BTC / USDT Perpetual", type: "futures" },
      ]),
    );
  }),
};
