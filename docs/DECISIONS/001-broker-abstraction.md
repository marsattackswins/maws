# ADR 001: Broker Abstraction Layer

## Status

Accepted

## Context

MAWS needs to integrate with cryptocurrency exchanges for live trading. Initially, only Binance USD-M Futures is supported, but future requirements may include other exchanges (Bybit, OKX, etc.).

### Problem

Direct integration with a single exchange creates tight coupling and makes it difficult to:
- Add support for new exchanges
- Switch between exchanges (e.g., for redundancy)
- Test with mock implementations
- Maintain consistent behavior across exchanges

### Constraints

- Different exchanges have different APIs and data formats
- Exchange-specific features should not leak into core business logic
- Risk management must work consistently regardless of exchange
- Testing should be possible without real exchange connections

## Decision

Implement a broker abstraction layer with a unified interface (`IBroker`) that normalizes operations across exchanges.

### Interface Design

```typescript
interface IBroker {
  // Lifecycle
  connect(): Promise<void>;
  disconnect(): void;
  getStatus(): BrokerStatus;

  // Orders
  submitOrder(params: OrderParams): Promise<OrderResult>;
  cancelOrder(clientOrderId: string, symbol: string): Promise<OrderResult>;
  getOrder(symbol: string, clientOrderId: string): Promise<Order | null>;
  closePosition(symbol: string): Promise<OrderResult>;
  protectPosition(params: ProtectPositionParams): Promise<ProtectPositionResult>;

  // Positions & Account
  getPositions(): Promise<Position[]>;
  getAccount(): Promise<Account>;

  // Market Data
  getSymbolInfo(symbol: string): Promise<SymbolInfo | null>;
  getPrice(symbol: string): Promise<Price | null>;

  // Reconciliation
  snapshot(): Promise<void>;
  reconcile(trigger: string): Promise<void>;

  // State Access
  getCurrentState(): BrokerState;

  // Events
  on(event: BrokerEvent, handler: (data: unknown) => void): void;
  off(event: BrokerEvent, handler: (data: unknown) => void): void;

  // Utilities
  newClientOrderId(prefix: string): string;
}
```

### Key Design Principles

1. **Normalized Types**: Use lowercase `"buy"/"sell"` instead of `"BUY"/"SELL"`, `"market"` instead of `"MARKET"`
2. **Event-Driven**: Subscribe to state changes via events rather than polling
3. **Async Initialization**: `connect()` establishes streams and loads metadata
4. **Stateless Operations**: Broker doesn't manage application state; state is external
5. **Factory Pattern**: Broker instances created via factory for testability

### Implementation Structure

```
lib/server/broker/
├── interface.ts          # Core IBroker interface
├── factory.ts            # Broker instance factory
├── errors.ts             # Broker-specific errors
└── binance/
    ├── adapter.ts        # Binance implementation of IBroker
    └── [binance-specific files]
```

## Consequences

### Positive

- **Multi-Exchange Support**: Easy to add new exchanges by implementing `IBroker`
- **Testability**: Mock broker can implement `IBroker` for testing without real exchange
- **Consistency**: Risk management and business logic work consistently across exchanges
- **Isolation**: Exchange-specific code isolated to adapter implementations
- **Flexibility**: Can switch exchanges via configuration

### Negative

- **Abstraction Overhead**: Additional layer adds complexity
- **Least Common Denominator**: May not support exchange-specific features
- **Maintenance**: Need to maintain adapters for each exchange
- **Testing Overhead**: Need to test each adapter implementation

### Risks

- **API Divergence**: Exchanges may have fundamentally different capabilities
- **Feature Parity**: Hard to achieve feature parity across all exchanges
- **Performance**: Abstraction layer may add latency

## Alternatives Considered

### Alternative 1: Direct Binance Integration

**Pros**:
- Simpler initial implementation
- Full access to Binance-specific features
- No abstraction overhead

**Cons**:
- Tight coupling to Binance
- Difficult to add other exchanges
- Hard to test without Binance

**Rejected**: Violates requirement for future multi-exchange support

### Alternative 2: Third-Party Trading Library

**Pros**:
- Leverage existing solutions
- May support multiple exchanges

**Cons**:
- Dependency on external library
- May not fit MAWS requirements
- Less control over implementation
- Potential licensing issues

**Rejected**: Want full control over implementation and no external dependencies

## Implementation Notes

### Binance Adapter

The Binance adapter (`lib/server/broker/binance/adapter.ts`) implements `IBroker` by:
- Converting Binance API responses to normalized types
- Managing WebSocket streams for real-time updates
- Implementing reconciliation logic
- Handling Binance-specific rate limiting and filters

### Mock Broker

A mock broker (`lib/trading/mock.ts`) implements `IBroker` for:
- Local development without real exchange
- Testing without side effects
- Simulating various scenarios (fills, rejections, etc.)

## References

- [Broker Interface](../../lib/server/broker/interface.ts)
- [Binance Adapter](../../lib/server/broker/binance/adapter.ts)
- [Mock Broker](../../lib/trading/mock.ts)
