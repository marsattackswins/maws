# MAWS Developer Guide

This document covers local setup, testing strategy, mocking/fakes, CI, code style, and common development tasks.

## Local Setup

### Prerequisites

- Node.js 20+ (LTS recommended)
- npm or yarn
- Git

### Installation

```bash
# Clone repository
git clone <repository-url>
cd MAWS

# Install dependencies
npm install
```

### Environment Configuration

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your configuration
# For local development, you can use defaults
```

**Local Development Defaults**:
- `MAWS_ENV=local` (paper trading, no auth required)
- No broker credentials needed
- No operator password needed

### Running Development Server

```bash
npm run dev
```

The development server starts on http://localhost:3000

### Building for Production

```bash
npm run build
npm start
```

## Testing Strategy

### Test Structure

```
tests/
├── unit/              # Unit tests
│   ├── auth/
│   ├── broker/
│   ├── resilience/
│   └── ...
├── integration/       # Integration tests
│   ├── broker.test.ts
│   └── ...
└── e2e/              # End-to-end tests
    ├── smoke.spec.ts
    └── order-lifecycle.spec.ts
```

### Running Tests

#### Unit Tests
```bash
npm test
```

#### Watch Mode
```bash
npm run test:watch
```

#### Coverage
```bash
npm run test:coverage
```

#### Integration Tests
```bash
# Setup integration environment
npm run test:integration:setup

# Run integration tests
npm run test:integration

# Run with verbose output
npm run test:integration:verbose
```

#### End-to-End Tests
```bash
npx playwright test
```

### Testing model and expectations

MAWS uses a test pyramid with fast, isolated Jest tests at the base, real Binance testnet integration tests for exchange and stream behavior, and Playwright tests for browser workflows. The Jest tests are distributed across focused directories under `tests/`; the integration suite is in `tests/integration/`, and browser tests are in `e2e/`.

- **Unit and headless trading tests**: use mocks or in-memory state, make no network calls, and should cover success, failure, boundary, and idempotency cases. Run these on every change with `npm test`.
- **Integration tests**: submit real orders to Binance testnet and verify order lifecycle, position synchronization, stream recovery, and reconciliation. They require `.env.integration` credentials and should run before merging server/exchange changes or through the scheduled workflow; see [`tests/integration/SETUP.md`](../tests/integration/SETUP.md).
- **E2E tests**: exercise the running application in a browser with Playwright. Use them for login, navigation, and critical UI workflows rather than duplicating pure-function coverage.

The global Jest thresholds are 70% for branches, functions, lines, and statements. The following critical areas have stricter expectations enforced by focused tests:

- `lib/trading/exit-conditions.ts`: 100% branch coverage
- `lib/trading/symbol-settings.ts`: 100% branch coverage
- `lib/market/feed-normalize.ts`: 100% branch coverage
- `lib/trading/mock.ts`: 95% statements and 92% branches

Use `npm run test:coverage` to inspect the generated report. Keep fixtures deterministic and tests isolated; integration tests must use unique order IDs and clean up orders and positions between runs.

### Paper trading behavior

Paper-trading exits are evaluated on each delivered tick by `resolveExitCondition(pos, last)`. Production paper trading does not simulate OHLC candles and does not resolve TP/SL based on which level was touched first inside a candle. The first delivered tick that breaches an exit level closes the position; the result is deterministic for a fixed position and tick sequence, but a different feed order can produce a different first exit.

When one tick breaches multiple levels, the authoritative priority is **liquidation > stop loss > take profit** (`liq > sl > tp`). The fill price is the breached level price, not the tick price. Long and short comparisons include exact boundaries (`>=`/`<=` as appropriate). If no configured level is breached, no exit is returned.

### Debugging test failures

- Run one file or one test name while iterating: `npm test -- path/to/file.test.ts` or `npm test -- --testNamePattern="name"`.
- Add `--verbose` when assertion context or test ordering is unclear.
- For integration failures, run `npm run test:integration:setup`, then `npm run test:integration:verbose`; check testnet availability, credentials, balance, rate limits, and cleanup state.
- For E2E failures, start from the Playwright report and inspect browser/network logs; the configured web server uses `http://localhost:3000`.

### Test Configuration

#### Jest Configuration (`jest.config.js`)
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: [
    'lib/**/*.ts',
    '!lib/**/*.d.ts',
    '!lib/server/**/index.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

#### Playwright Configuration (`playwright.config.ts`)
```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  retries: 2,
  use: {
    baseURL: 'http://localhost:3000',
  },
  webServer: {
    command: 'npm run dev',
    port: 3000,
  },
});
```

### Writing Tests

#### Unit Tests

```typescript
// tests/unit/auth/password.test.ts
import { verifyOperatorPassword } from '@/lib/server/auth/password';

describe('verifyOperatorPassword', () => {
  it('should verify correct password', () => {
    const operatorAuth = 'salt:hash'; // Use real hash in tests
    const result = verifyOperatorPassword('password', operatorAuth);
    expect(result).toBe(true);
  });

  it('should reject incorrect password', () => {
    const operatorAuth = 'salt:hash';
    const result = verifyOperatorPassword('wrong', operatorAuth);
    expect(result).toBe(false);
  });
});
```

#### Integration Tests

```typescript
// tests/integration/broker.test.ts
import { getBroker } from '@/lib/server/broker/factory';
import { resetServerConfigForTests } from '@/lib/server/env/config';

describe('Broker Integration', () => {
  beforeEach(() => {
    resetServerConfigForTests({
      env: 'local',
      brokerType: 'binance',
      // ... other config
    });
  });

  it('should submit order', async () => {
    const broker = getBroker();
    const result = await broker.submitOrder({
      symbol: 'BTCUSDT',
      side: 'buy',
      type: 'market',
      qty: '0.001',
      clientOrderId: 'test-123',
    });
    expect(result.ok).toBe(true);
  });
});
```

#### End-to-End Tests

```typescript
// e2e/smoke.spec.ts
import { test, expect } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page).toHaveTitle(/MAWS/);
});

test('login flow', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.fill('input[name="password"]', 'test-password');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/\/admin/);
});
```

## Mocking and Fakes

### Mock Broker

The mock broker (`lib/trading/mock.ts`) simulates broker behavior for testing:

```typescript
import { MockBroker } from '@/lib/trading/mock';

// Use mock broker in tests
const mockBroker = new MockBroker();
await mockBroker.connect();

// Submit order
const result = await mockBroker.submitOrder({
  symbol: 'BTCUSDT',
  side: 'buy',
  type: 'market',
  qty: '0.001',
  clientOrderId: 'test-123',
});
```

### Mocking External Dependencies

#### Lightweight Charts Mock

```typescript
// __mocks__/lightweight-charts.js
export const createChart = jest.fn(() => ({
  addSeries: jest.fn(),
  removeSeries: jest.fn(),
  timeScale: jest.fn(() => ({
    fitContent: jest.fn(),
  })),
}));
```

#### Server-Only Mock

```typescript
// __mocks__/server-only.js
export default {};
```

### Test Utilities

#### Reset Server Config

```typescript
import { resetServerConfigForTests } from '@/lib/server/env/config';

beforeEach(() => {
  resetServerConfigForTests({
    env: 'local',
    brokerType: 'binance',
    dbPath: ':memory:',
    // ... other config
  });
});
```

#### Reset Database

```typescript
import { resetDbForTests } from '@/lib/server/db/connection';

beforeEach(() => {
  resetDbForTests(':memory:');
});
```

## CI/CD

### GitHub Actions

The repository keeps the fast checks separate from network-backed checks:

- `.github/workflows/ci-unit.yml` runs on pushes to `master` and all pull requests. It installs with `npm ci`, runs `npx tsc --noEmit`, and runs `npm test`.
- `.github/workflows/integration-tests.yml` runs for pull requests touching server or integration-test code, nightly at 02:00 UTC, and manually. It checks Binance testnet availability and runs the real integration suite with repository testnet secrets.
- `.github/workflows/ci-smoke.yml` runs nightly or manually. It always runs the no-network smoke CLI and performs the live deployment smoke only when its secrets are configured.

Integration and live smoke workflows are intentionally not part of every commit's fast feedback loop because they depend on external services, credentials, rate limits, and testnet state.

### Pre-commit Hooks

Configure Husky for pre-commit hooks:

```bash
npm install --save-dev pretty-quick husky
npx husky install
npx husky add .husky/pre-commit "npx pretty-quick --staged"
```

## Code Style

### ESLint Configuration

```javascript
// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  ...compat.extends("next/core-web-vitals", "prettier"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];
```

### Prettier Configuration

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 100,
  "tabWidth": 2
}
```

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowJs": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "incremental": true,
    "paths": {
      "@/*": ["./*"]
    },
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Code Conventions

#### File Naming
- Components: PascalCase (e.g., `OrderPanel.tsx`)
- Utilities: camelCase (e.g., `formatPrice.ts`)
- Types: PascalCase (e.g., `OrderTypes.ts`)
- Tests: `.test.ts` or `.spec.ts` suffix

#### Import Order
```typescript
// 1. Node.js built-ins
import fs from 'fs';

// 2. External dependencies
import { useState } from 'react';

// 3. Internal imports (absolute paths)
import { IBroker } from '@/lib/server/broker/interface';

// 4. Relative imports
import { helper } from './helper';
```

#### Server-Only Code
```typescript
import "server-only";

// This code will fail build if imported in client
```

#### Type Definitions
```typescript
// Use interfaces for object shapes
interface OrderParams {
  symbol: string;
  side: 'buy' | 'sell';
}

// Use types for unions, primitives, etc.
type OrderSide = 'buy' | 'sell';
type BrokerStatus = 'idle' | 'starting' | 'ready' | 'error';
```

## Common Tasks

### Add a New API Route

1. Create route file in `app/api/`:
```typescript
// app/api/my-endpoint/route.ts
import { authenticate, isAuthFailure, jsonError, jsonOk } from '@/lib/server/http/guards';
import { serverConfig } from '@/lib/server/env/config';

export const dynamic = 'force-dynamic';

export async function POST(req: Request): Promise<Response> {
  const cfg = serverConfig();
  const ctx = authenticate(req, cfg);
  if (isAuthFailure(ctx)) return ctx.response;

  // Your logic here
  return jsonOk({ ok: true });
}
```

2. Add authentication if needed
3. Add input validation
4. Add error handling
5. Add tests

### Add a New Metric

1. Import metrics functions:
```typescript
import { incrementCounter, setGauge, observeHistogram, recordEvent } from '@/lib/server/metrics/collector';
```

2. Use in code:
```typescript
// Counter
incrementCounter('my.metric', 1);

// Gauge
setGauge('my.gauge', value);

// Histogram
observeHistogram('my.histogram', duration);

// Event
recordEvent('my-event', 'label', { details });
```

3. Add constant to `METRICS` object in `lib/server/metrics/collector.ts`

### Add a New Test

1. Create test file in appropriate directory:
```typescript
// tests/unit/my-feature.test.ts
import { myFunction } from '@/lib/my-feature';

describe('myFunction', () => {
  it('should work', () => {
    const result = myFunction();
    expect(result).toBe(true);
  });
});
```

2. Run test:
```bash
npm test -- my-feature.test.ts
```

### Add a New Environment Variable

1. Add to `.env.example`:
```bash
# My new variable
MAWS_MY_VAR=default_value
```

2. Add to `EnvConfig` interface in `lib/server/env/config.ts`:
```typescript
interface EnvConfig {
  // ... existing
  myVar: string;
}
```

3. Add parsing logic in `loadEnvConfig`:
```typescript
const cfg: EnvConfig = {
  // ... existing
  myVar: source.MAWS_MY_VAR?.trim() || 'default',
};
```

4. Update documentation

### Add a New Circuit Breaker

1. Add configuration to `EnvConfig`:
```typescript
circuitBreaker: {
  // ... existing
  myBreakerFailureThreshold: number;
  myBreakerFailureWindowMs: number;
  myBreakerRecoveryTimeoutMs: number;
  myBreakerSuccessThreshold: number;
}
```

2. Add environment variables to `.env.example`
3. Create circuit breaker instance:
```typescript
import { CircuitBreaker } from '@/lib/server/resilience/circuit-breaker';

const myBreaker = new CircuitBreaker({
  name: 'my-breaker',
  failureThreshold: cfg.circuitBreaker.myBreakerFailureThreshold,
  failureWindowMs: cfg.circuitBreaker.myBreakerFailureWindowMs,
  recoveryTimeoutMs: cfg.circuitBreaker.myBreakerRecoveryTimeoutMs,
  successThreshold: cfg.circuitBreaker.myBreakerSuccessThreshold,
});
```

4. Register in circuit registry
5. Use in code:
```typescript
try {
  const result = await myBreaker.execute(() => myOperation());
} catch (err) {
  if (isCircuitBreakerOpen(err)) {
    // Handle circuit open
  }
}
```

### Debug Server-Side Code

1. Add console.log or use logger:
```typescript
import { log } from '@/lib/server/log/logger';

log.info('My debug message', { data });
```

2. Check logs:
```bash
# systemd
sudo journalctl -u maws -f

# Docker
docker logs -f maws

# Development
# Check terminal output
```

### Debug Client-Side Code

1. Use browser DevTools
2. Add breakpoints in code
3. Use console.log
4. Check Network tab for API calls

### Run Integration Tests

1. Setup integration environment:
```bash
npm run test:integration:setup
```

2. Configure `.env.integration` with test credentials

3. Run tests:
```bash
npm run test:integration
```

### Run E2E Tests

1. Start development server:
```bash
npm run dev
```

2. Run Playwright tests:
```bash
npx playwright test
```

3. View test report:
```bash
npx playwright show-report
```

### Add a New Component

1. Create component file:
```typescript
// components/my-component.tsx
'use client';

import { useState } from 'react';

export function MyComponent() {
  const [value, setValue] = useState('');
  return <div>{value}</div>;
}
```

2. Use in page:
```typescript
import { MyComponent } from '@/components/my-component';

export default function Page() {
  return <MyComponent />;
}
```

3. Add tests if needed

### Update Dependencies

1. Check for updates:
```bash
npm outdated
```

2. Update specific package:
```bash
npm install package@latest
```

3. Update all packages:
```bash
npm update
```

4. Run tests after updates:
```bash
npm test
```

### Generate Operator Auth

```bash
npm run gen-operator-auth
```

Output: `<hex salt>:<hex scrypt hash>`

Add to `.env`:
```bash
MAWS_OPERATOR_AUTH=<output>
```

### Scan for Secrets

```bash
npm run secret-scan
```

This scans the codebase for potential secrets that shouldn't be committed.

## Performance Considerations

### Server-Side Performance

- Use SQLite with WAL mode for better concurrency
- Keep in-memory state for frequently accessed data
- Use circuit breakers to prevent cascading failures
- Implement rate limiting to prevent abuse

### Client-Side Performance

- Use React.memo for expensive components
- Implement virtual scrolling for large lists
- Lazy load components with React.lazy()
- Optimize chart rendering with Lightweight Charts

### Database Performance

- Use indexes on frequently queried columns
- Keep database file on fast storage
- Regular vacuum operations (if needed)
- Monitor database size

## Security Considerations

### Input Validation

- Always validate user input
- Use TypeScript for type safety
- Implement rate limiting
- Sanitize data before storage

### Secrets Management

- Never commit secrets
- Use environment variables
- Rotate credentials regularly
- Use principle of least privilege

### Authentication

- Use secure HTTP-only cookies
- Implement CSRF protection
- Validate origin headers
- Rate limit authentication attempts

## Troubleshooting Development Issues

### TypeScript Errors

1. Check tsconfig.json configuration
2. Ensure all dependencies are installed
3. Check for circular dependencies
4. Verify type definitions

### Build Errors

1. Clear Next.js cache:
```bash
rm -rf .next
npm run build
```

2. Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Test Failures

1. Run tests in verbose mode:
```bash
npm test -- --verbose
```

2. Run specific test file:
```bash
npm test -- my-feature.test.ts
```

3. Check for environment issues
4. Verify mocks are configured correctly

### Port Already in Use

1. Find process using port 3000:
```bash
lsof -i :3000
```

2. Kill process or use different port:
```bash
PORT=3001 npm run dev
```

### Database Lock Issues

1. Ensure only one MAWS instance is running
2. Check database file permissions
3. Close any open database connections
4. Delete lock file if stuck

## Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Playwright Documentation](https://playwright.dev)

### Internal Documentation
- [README.md](../README.md) - Project overview
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture
- [API.md](API.md) - API reference
- [OPERATIONS.md](OPERATIONS.md) - Operations guide
- [DECISIONS/](DECISIONS/) - Architecture decisions

### Code Reference
- `lib/server/broker/interface.ts` - Broker interface
- `lib/server/env/config.ts` - Configuration
- `lib/server/resilience/circuit-breaker.ts` - Circuit breaker
- `lib/server/metrics/collector.ts` - Metrics collection
