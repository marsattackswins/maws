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
  }),
};
