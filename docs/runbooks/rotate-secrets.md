# Runbook: Rotate Secrets

## Overview

This runbook describes the procedure for rotating secrets in MAWS, including operator passwords, Binance API keys, and backup keys.

## Prerequisites

- Access to MAWS server
- Access to Binance dashboard (for API key rotation)
- MAWS service running
- Backup of current secrets (for rollback)

## Rotate Operator Password

### Steps

1. **Generate new operator auth hash**
   ```bash
   npm run gen-operator-auth
   ```
   Output: `<hex salt>:<hex scrypt hash>`

2. **Update environment variable**
   ```bash
   # Edit .env file
   MAWS_OPERATOR_AUTH=<new-hash>
   ```

3. **Restart MAWS service**
   ```bash
   sudo systemctl restart maws
   ```

4. **Verify login works**
   - Log in with new password
   - Verify session creation

5. **Revoke all existing sessions** (optional but recommended)
   ```bash
   POST /api/auth/revoke-all
   ```

### Rollback

If issues occur:
1. Restore previous `MAWS_OPERATOR_AUTH` in `.env`
2. Restart MAWS service
3. Verify login with old password

## Rotate Binance API Keys

### Steps

1. **Generate new API keys in Binance dashboard**
   - Log in to Binance
   - Navigate to API Management
   - Create new API key
   - Ensure withdrawal permission is DISABLED
   - Copy API key and secret

2. **Update environment variables**
   ```bash
   # Edit the profile-specific variables in the server environment file.
   # Use the testnet pair for testnet, or the production pair for
   # production/shadow. Never place these under NEXT_PUBLIC_.
   MAWS_BINANCE_TESTNET_API_KEY=<new-testnet-key>
   MAWS_BINANCE_TESTNET_API_SECRET=<new-testnet-secret>
   # MAWS_BINANCE_PRODUCTION_API_KEY=<new-production-key>
   # MAWS_BINANCE_PRODUCTION_API_SECRET=<new-production-secret>
   ```

   The legacy `MAWS_BINANCE_API_KEY` and `MAWS_BINANCE_API_SECRET` remain
   supported during migration. If both legacy and active profile-specific
   values are set, they must match or startup fails closed.

3. **Restart MAWS service**
   ```bash
   sudo systemctl restart maws
   ```

4. **Verify broker connection**
   ```bash
   curl -H "Cookie: maws_session=..." http://localhost:3000/api/health
   ```

5. **Test order submission** (in testnet/shadow first)
   - Submit small test order
   - Verify order reaches exchange

6. **Revoke old keys in Binance dashboard**
   - After verification (wait 15-30 minutes)
   - Navigate to API Management
   - Delete old API key

### Rollback

If issues occur:
1. Restore previous API keys in `.env`
2. Restart MAWS service
3. Verify broker connection
4. Do NOT revoke old keys until verified

## Rotate Backup Key

### Steps

1. **Generate new backup key**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Output: 64 hex characters

2. **Update environment variable**
   ```bash
   # Edit .env file
   MAWS_BACKUP_KEY=<new-key>
   ```

3. **Create new backup with new key**
   ```bash
   node scripts/backup.mjs
   ```

4. **Verify new backup**
   ```bash
   node scripts/restore-backup.mjs .maws/backups/<new-file>.db.enc --dry-run
   ```

5. **Delete old backups** (or re-encrypt with new key)
   ```bash
   rm .maws/backups/*.db.enc
   ```

### Rollback

If issues occur:
1. Restore previous `MAWS_BACKUP_KEY` in `.env`
2. Keep old backups
3. Delete new backup

## Rotate Health Token

### Steps

1. **Generate new health token**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Output: 64 hex characters

2. **Update environment variable**
   ```bash
   # Edit .env file
   MAWS_HEALTH_TOKEN=<new-token>
   ```

3. **Update monitoring systems**
   - Update health check scripts
   - Update monitoring dashboards
   - Update alert configurations

4. **Restart MAWS service**
   ```bash
   sudo systemctl restart maws
   ```

5. **Verify health endpoint**
   ```bash
   curl -H "x-maws-health-token: <new-token>" http://localhost:3000/api/health
   ```

### Rollback

If issues occur:
1. Restore previous `MAWS_HEALTH_TOKEN` in `.env`
2. Restart MAWS service
3. Revert monitoring system updates

## Best Practices

1. **Rotate regularly**: Every 90 days for API keys, every 180 days for passwords
2. **Test in non-production first**: Always test in testnet/shadow before production
3. **Keep old secrets until verified**: Don't revoke until new secrets are working
4. **Document rotations**: Keep a log of when secrets were rotated
5. **Use separate keys per environment**: Never use production keys in testnet

## Troubleshooting

### Login fails after password rotation

**Cause**: Incorrect hash format or service not restarted

**Resolution**:
1. Verify hash format: `<hex salt>:<hex scrypt hash>`
2. Ensure service was restarted
3. Check logs: `sudo journalctl -u maws`

### Broker connection fails after API key rotation

**Cause**: Invalid API key/secret or keys not yet active

**Resolution**:
1. Verify API key and secret are correct
2. Wait 5-10 minutes for Binance to activate new keys
3. Check Binance dashboard for key status
4. Verify withdrawal permission is disabled

### Backup fails after key rotation

**Cause**: Key format incorrect or service not restarted

**Resolution**:
1. Verify key is 64 hex characters
2. Ensure service was restarted
3. Check backup script logs

## See Also

- [[SECURITY.md|docs/SECURITY.md]] - Security model and secrets management
- [[OPERATIONS.md|docs/OPERATIONS.md]] - Environment variables
