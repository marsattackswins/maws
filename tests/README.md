# MAWS Unit Tests

This directory contains unit tests for the MAWS (Market Analysis & Workflow System) project, focusing on candle data processing and market data validation.

## Test Structure

```
tests/
├── candle-tests/
│   ├── candle-normalization.test.ts       # Basic candle structure and validation
│   ├── duplicate-out-of-order.test.ts    # Duplicate and out-of-order candle handling
│   ├── incomplete-candles.test.ts        # Incomplete/partial candle data handling
│   ├── timestamp-conversion.test.ts      # Timestamp conversion and validation
│   └── provider-response-validation.test.ts # API response validation
└── README.md
```

## Test Categories

### 1. Candle Normalization Tests
Tests for validating and normalizing candle data structures:
- Basic candle structure validation
- Price consistency validation (high >= open/close, low <= open/close)
- Volume normalization
- Numeric validation (finite values, non-negative)
- Precision handling for different price scales
- Array normalization and filtering

### 2. Duplicate and Out-of-Order Candle Tests
Tests for handling real-time WebSocket feed scenarios:
- Duplicate candle detection and handling
- Out-of-order candle detection and sorting
- Backfill of historical candles
- Late-arriving candle updates
- Sequence validation and gap detection
- Merge strategies for multiple data sources

### 3. Incomplete Candle Tests
Tests for handling partial or incomplete data:
- Missing field handling (volume, high, low, open, close)
- Null and undefined value handling
- Incremental candle building from live updates
- Data quality validation (inconsistent OHLC, negative values)
- Recovery strategies using adjacent candles
- Edge cases (zero prices, extreme values)

### 4. Timestamp Conversion Tests
Tests for timestamp handling and conversion:
- Millisecond to second conversion
- Timestamp validation (reasonable ranges, epoch boundaries)
- Timestamp consistency in arrays
- Provider-specific format handling (Binance ms vs sec)
- Sequence validation (monotonic, duplicates)
- Practical conversion scenarios (WebSocket, REST API)

### 5. Provider Response Validation Tests
Tests for validating external API responses:
- Binance kline response parsing
- Binance WebSocket message validation
- Binance ticker response validation
- API route parameter validation (symbol, interval, limit, date)
- Error response handling
- Response structure validation
- Data type validation (numeric strings, boolean conversion)
- Bulk response validation and filtering

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with coverage
```bash
npm run test:coverage
```

## Test Results

All tests are currently passing:
- **Test Suites**: 5 passed, 5 total
- **Tests**: 117 passed, 117 total
- **Time**: ~1s execution time

## Coverage

Current coverage is focused on candle data processing logic. To increase coverage, tests should be added for:
- `lib/market/binance-feed.ts` - Main feed implementation
- `lib/indicators.ts` - Technical indicator calculations
- `lib/drawings.ts` - Drawing tool logic
- `lib/store.ts` - State management
- Component testing for React components

## Adding New Tests

When adding new tests:
1. Place test files in appropriate subdirectories
2. Use descriptive test names that explain what is being tested
3. Follow the existing pattern of `describe` and `it` blocks
4. Test both positive and negative cases
5. Include edge cases and boundary conditions
6. Keep tests independent and isolated

## Test Configuration

Jest configuration is in `jest.config.js`:
- TypeScript support via ts-jest
- Node.js test environment
- Path aliases configured (`@/*` maps to project root)
- Coverage collection from `lib/**/*.ts`
- Ignores type definition files and index files

## Continuous Integration

These tests should be integrated into CI/CD pipelines to ensure:
- All tests pass before merging
- Coverage thresholds are maintained
- No regressions are introduced in candle processing logic
