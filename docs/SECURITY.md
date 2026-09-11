# MAWS Security Model

This document covers the authentication model, secrets management, rate limiting, and audit logging for MAWS.

## Authentication Model

### Session-Based Authentication

MAWS uses session-based authentication with the following components:

- **Operator Credentials**: Scrypt-hashed password with salt stored in environment
- **Session Management**: Secure HTTP-only cookies with CSRF tokens
- **Origin Validation**: Strict origin/host checking to prevent CSRF
- **Rate Limiting**: Per-IP rate limiting on login attempts

### Password Storage

**Algorithm**: Scrypt with salt

**Format**: `<hex salt>:<hex scrypt hash>`

**Generation**:
```bash
npm run gen-operator-auth
```

**Rationale**: Scrypt is memory-hard, resistant to GPU/ASIC attacks; salt prevents rainbow table attacks.

### Session Management

**Session Structure**:
- sessionId: UUID
- csrfToken: Random token
- createdAt: Timestamp
- lastSeen: Last activity
- userAgent: Optional user agent

**Storage**: SQLite database with sessions table

**Cookie**: HTTP-only, secure, same-site

### Security Features

- **Scrypt Hashing**: Memory-hard algorithm resistant to GPU/ASIC attacks
- **Salt**: Prevents rainbow table attacks
- **HTTP-only Cookies**: Prevents XSS token theft
- **CSRF Protection**: Double protection with cookies + origin validation
- **Rate Limiting**: 5 login attempts per 5 minutes per IP
- **Origin Validation**: Strict origin/host checking

### Emergency Revocation

**Revoke Single Session**:
```bash
POST /api/auth/logout
```

**Revoke All Sessions**:
```bash
POST /api/auth/revoke-all
```

## Secrets Management

### Principles

1. **Never commit secrets**: All secrets in environment variables only
2. **Fail closed**: Missing or invalid secrets cause startup failure
3. **Environment isolation**: Different credentials per environment
4. **Minimal permissions**: Broker credentials have withdrawal disabled
5. **Regular rotation**: Rotate API keys and passwords regularly

### Secret Storage

#### Environment Variables
- Store in `.env` file (gitignored)
- Use `.env.example` as template
- Never commit `.env` to version control

#### Database
- SQLite file with mode 0600 (owner read/write only)
- Encrypted backups with AES-256
- No secrets in database

#### Session Storage
- Sessions stored in SQLite
- Session IDs are random UUIDs
- CSRF tokens are random strings

### Secret Generation

#### Operator Password
```bash
npm run gen-operator-auth
```
Output: `<hex salt>:<hex scrypt hash>`

#### Backup Key
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Output: 64 hex characters

#### Health Token
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Output: 64 hex characters

### Secret Rotation

#### Binance API Keys
1. Generate new keys in Binance dashboard
2. Update environment variables
3. Restart MAWS service
4. Revoke old keys after verification

#### Operator Password
1. Generate new hash with `npm run gen-operator-auth`
2. Update `MAWS_OPERATOR_AUTH`
3. Restart MAWS service
4. All existing sessions are invalidated

#### Backup Key
1. Generate new key
2. Update `MAWS_BACKUP_KEY`
3. Create new backup with new key
4. Delete old backups (or re-encrypt)

## Rate Limiting

### Authentication Rate Limits

#### Login Endpoint
- **Limit**: 5 attempts per 5 minutes per IP
- **Purpose**: Prevent brute force attacks
- **Response**: 429 Too Many Requests

#### Session Validation
- **Limit**: 120 requests per minute per session
- **Purpose**: Prevent session abuse
- **Response**: 429 Too Many Requests

### Trading API Rate Limits

#### Order Submission
- **Limit**: 60 requests per minute per session
- **Purpose**: Prevent order spam
- **Response**: 429 Too Many Requests

#### Other Live Trading Endpoints
- **Limit**: 120 requests per minute per session
- **Purpose**: General API protection
- **Response**: 429 Too Many Requests

### Admin API Rate Limits

#### Metrics Endpoint
- **Limit**: 60 requests per minute per session
- **Purpose**: Prevent metrics abuse
- **Response**: 429 Too Many Requests

#### Health Endpoints
- **Limit**: 120 requests per minute per session
- **Purpose**: Allow frequent health checks
- **Response**: 429 Too Many Requests

### Market Data Rate Limits

#### Public Endpoints
- **Limit**: 300 requests per minute per IP
- **Purpose**: Prevent abuse of public endpoints
- **Response**: 429 Too Many Requests

### Binance API Rate Limits

MAWS respects Binance API rate limits internally:

- **REST API**: 2400 requests per minute (weight-based)
- **WebSocket**: No explicit limit (connection-based)
- **Order Rate**: 100 orders per 10 seconds per symbol

MAWS implements internal rate limiting to stay within Binance limits.

## Audit Logging

### Audit Log

The audit log captures security-relevant events:

```typescript
// Audit events
audit("operator", "login.success", { secure: true }, ip);
audit("operator", "order.ui.accepted", { symbol, clientOrderId }, ip);
audit("system", "circuit_breaker.opened", { circuit: "binance-rest" });
audit("system", "recon.drift_detected", { driftCount: 5 });
```

### Audit Event Types

- **Authentication events**: login, logout, session revocation
- **Order events**: submission, cancellation, rejection
- **Risk events**: limit breaches, freezes
- **Circuit breaker events**: state changes
- **Reconciliation events**: drift detection
- **System events**: startup, shutdown

### Audit Log Storage

- Stored in SQLite database
- Includes timestamp, actor, action, details, and IP
- Queryable for security investigations
- Retained indefinitely (no automatic pruning)

### Audit Log Analysis

#### View Audit Events
```bash
# Query from database
sqlite3 .maws/maws.db "SELECT * FROM audit ORDER BY ts DESC LIMIT 100"
```

#### Filter for Specific Events
```bash
# Failed login attempts
sqlite3 .maws/maws.db "SELECT * FROM audit WHERE action LIKE 'login.failed%'"
```

#### Filter by IP
```bash
# All events from specific IP
sqlite3 .maws/maws.db "SELECT * FROM audit WHERE ip = '1.2.3.4'"
```

## Network Security

### Allowed Origins

Single trusted origin configurable via environment:

```bash
MAWS_ALLOWED_ORIGIN=https://terminal.example.com
```

**Purpose**: CSRF protection via origin validation

### Proxy Trust

Optional proxy mode for reverse proxy deployments:

```bash
MAWS_TRUST_PROXY=true
```

**Purpose**: Enable when reverse proxy strips forwarding headers

### Health Token

Shared token for external monitoring without session:

```bash
MAWS_HEALTH_TOKEN=<token>
```

**Usage**: Send via `x-maws-health-token` header (never in URLs)

### TLS

Recommended for all non-local deployments:
- Use nginx or similar reverse proxy
- Terminate TLS at proxy
- Proxy to MAWS over HTTP (localhost)

## Risk Controls

### Environment Enforcement

- **Local mode**: Refuses broker credentials (fail closed)
- **Production**: All risk limits must be positive finite numbers
- **Shadow**: Read-only enforcement, zero submissions allowed

### Execution Gates

Dual requirement for production:
- Static environment variable: `MAWS_EXECUTION_ENABLED=true`
- Runtime flag: `POST /api/live/gates`

Both must be true for order submissions.

### Risk Limits

See [[OPERATIONS.md|docs/OPERATIONS.md]] for complete risk limit configuration.

## Threat Model

### Threats Addressed

1. **Brute Force Attacks**: Rate limiting on login, scrypt hashing
2. **CSRF Attacks**: Origin validation, CSRF tokens
3. **XSS Attacks**: HTTP-only cookies, input validation
4. **Session Hijacking**: Secure cookies, session expiration
5. **Credential Theft**: Environment variable storage, no code exposure
6. **Data Exfiltration**: Database permissions, encrypted backups
7. **API Abuse**: Rate limiting, circuit breakers
8. **Insider Threat**: Audit logging, session revocation

### Threats Not Addressed

1. **Physical Access**: Assumes secure server environment
2. **Social Engineering**: User education required
3. **Supply Chain Attacks**: Dependency management required
4. **Zero-Day Exploits**: Regular updates required

## See Also

- [[OPERATIONS.md|docs/OPERATIONS.md]] - Environment variables and operational procedures
- [[ARCHITECTURE.md|docs/ARCHITECTURE.md]] - System architecture
- [[API.md|docs/API.md]] - API endpoints
- [[decisions/003-session-auth.md|docs/decisions/003-session-auth.md]] - Authentication ADR
