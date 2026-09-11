# Runbook: Handle 503 Spikes

## Overview

This runbook describes how to handle spikes in 503 Service Unavailable errors, typically caused by circuit breakers opening due to external service failures.

## Symptoms

- API calls returning 503 status
- Error messages indicating "circuit open"
- Multiple endpoints failing simultaneously
- Circuit breaker status showing "open" state

## Immediate Actions

### 1. Check Circuit Breaker Status

```bash
curl -H "Cookie: maws_session=..." http://localhost:3000/api/admin/circuits
```

Look for:
- `state: "open"` on any circuit
- High `totalFailures` count
- Recent `lastFailureTime`

### 2. Check Health Status

```bash
curl -H "Cookie: maws_session=..." http://localhost:3000/api/health
```

Look for:
- `brokerConnected: false`
- `streamHealthy: false`
- `reconHealthy: false`
- `submissionsFrozen: true`

### 3. Check Logs

```bash
sudo journalctl -u maws | tail -100
```

Look for:
- Circuit breaker state changes
- Binance API errors
- WebSocket connection failures
- Network errors

## Circuit Breaker Types

### REST API Breaker

**Purpose**: Protects against Binance REST API failures

**Configuration**:
- Opens after 5 failures in 60 seconds
- Recovers after 30 seconds
- Closes after 2 consecutive successes

**Protected Operations**:
- Order submission
- Order cancellation
- Position close
- Protect position (TP/SL)
- Account queries
- Order queries

### WebSocket Stream Breaker

**Purpose**: Protects against WebSocket connection failures

**Configuration**:
- Opens after 3 failures in 5 minutes
- Recovers after 60 seconds
- Closes after 1 successful connection

**Protected Operations**:
- WebSocket connection establishment
- Listen key renewal
- Stream message processing

### Reconciliation Breaker

**Purpose**: Protects against reconciliation failures

**Configuration**:
- Opens after 3 failures in 10 minutes
- Recovers after 120 seconds
- Closes after 2 consecutive successes

**Protected Operations**:
- Manual reconciliation
- Automatic reconciliation

## Resolution Steps

### Automatic Recovery

Most circuit breakers will recover automatically:

1. **Wait for recovery timeout**
   - REST API: 30 seconds
   - WebSocket: 60 seconds
   - Reconciliation: 120 seconds

2. **Monitor circuit status**
   ```bash
   watch -n 5 'curl -s -H "Cookie: maws_session=..." http://localhost:3000/api/admin/circuits'
   ```

3. **Verify recovery**
   - Circuit state should change to "closed"
   - Operations should resume normally

### Manual Reset (Emergency)

Use with caution - only when you're certain the underlying issue is resolved.

**Note**: This endpoint may not be exposed in production. Check code for availability.

```bash
curl -X POST -H "Cookie: maws_session=..." \
  http://localhost:3000/api/admin/circuits/reset
```

**When to use**:
- External service is confirmed healthy
- Network issues are resolved
- Rate limits have reset
- After addressing root cause

**When NOT to use**:
- External service still degraded
- Network issues persist
- Root cause unknown
- Without addressing underlying issue

## Root Cause Analysis

### Binance API Issues

**Symptoms**: REST API breaker open

**Investigation**:
1. Check Binance status page
2. Check Binance API rate limits
3. Verify API credentials are valid
4. Check network connectivity to Binance

**Resolution**:
- Wait for Binance to recover
- Reduce request rate if hitting limits
- Rotate API keys if credentials invalid
- Fix network connectivity

### WebSocket Issues

**Symptoms**: WebSocket breaker open

**Investigation**:
1. Check network connectivity
2. Verify listen key is valid
3. Check Binance WebSocket status
4. Review WebSocket logs

**Resolution**:
- Fix network connectivity
- Manual reconnect: `POST /api/live/connect`
- Wait for Binance to recover
- Check listen key renewal

### Reconciliation Issues

**Symptoms**: Reconciliation breaker open

**Investigation**:
1. Check database connectivity
2. Verify Binance API access
3. Check for data corruption
4. Review reconciliation logs

**Resolution**:
- Fix database issues
- Restore from backup if needed
- Wait for Binance to recover
- Manual reconciliation after fix

### Network Issues

**Symptoms**: Multiple breakers open

**Investigation**:
1. Check server network connectivity
2. Check firewall rules
3. Check DNS resolution
4. Check proxy configuration

**Resolution**:
- Fix network connectivity
- Update firewall rules
- Fix DNS issues
- Update proxy configuration

## Prevention

### Monitoring

Set up alerts for:
- Circuit breaker state changes
- High error rates
- Increased latency
- Failed health checks

### Rate Limiting

Ensure internal rate limits are configured appropriately:
- `MAWS_RATE_INTERNAL_PER_MIN`: Internal rate limit
- Binance API rate limits respected

### Circuit Breaker Tuning

Adjust circuit breaker thresholds based on observed patterns:
- Increase failure threshold if too sensitive
- Decrease failure threshold if too lenient
- Adjust recovery timeout based on service recovery time

## Communication

### During Incident

- Update status page (if available)
- Notify stakeholders if critical
- Document actions taken

### Post-Incident

- Write incident report
- Share lessons learned
- Update documentation
- Implement preventive measures

## See Also

- [[OPERATIONS.md|docs/OPERATIONS.md]] - Circuit breaker configuration
- [[SECURITY.md|docs/SECURITY.md]] - Rate limiting
- [[decisions/002-circuit-breaker.md|docs/decisions/002-circuit-breaker.md]] - Circuit breaker ADR
