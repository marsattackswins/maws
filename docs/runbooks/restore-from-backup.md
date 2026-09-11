# Runbook: Restore from Backup

## Overview

This runbook describes the procedure for restoring MAWS from an encrypted database backup.

## Prerequisites

- Access to MAWS server
- Valid backup file (`.db.enc`)
- Backup key (`MAWS_BACKUP_KEY`) matching the backup
- MAWS service stopped
- Sufficient disk space

## Pre-Restoration Checks

### 1. Verify Backup File

```bash
ls -lh .maws/backups/
```

Ensure backup file exists and has reasonable size.

### 2. Verify Backup Key

```bash
# Check .env file
grep MAWS_BACKUP_KEY .env
```

Ensure key is set and is 64 hex characters.

### 3. Dry Run (Verify)

```bash
node scripts/restore-backup.mjs .maws/backups/<file>.db.enc --dry-run
```

This verifies decryption without restoring.

**Expected output**: Success message with file info

**If dry run fails**:
- Verify backup key matches
- Verify backup file is not corrupted
- Check file permissions

## Profile-Scoped Migration Safety

The browser profile selector is not enabled. When applying the profile-scoped database
migration, never modify the live database in place:

1. Stop MAWS and confirm no process has the database open.
2. Back up the database and copy the WAL/SHM files if present.
3. Verify the encrypted backup with the dry-run command above.
4. Copy the database, including its WAL/SHM state when present, to a staging path.
5. Run the normal MAWS startup migration against the staging copy using `MAWS_DB_PATH`.
6. Run `PRAGMA integrity_check`, `PRAGMA foreign_key_check`, schema/constraint checks,
   row-count checks, and `legacy-unknown` quarantine-count checks on the copy.
7. Promote only the verified copy; do not overwrite the original before verification.
8. Keep the original database and verified backup until the promoted copy is trusted.
9. If validation fails, discard the staging copy and restore the original or verified backup.

Existing unprovenanced records are preserved as `profile_id = 'legacy-unknown'` and are
never classified from the current environment or credentials. There is no down migration;
rollback means restoring the original database or a verified backup. This migration does
not cancel orders or flatten positions.

## Restoration Procedure

### 1. Stop MAWS Service

```bash
sudo systemctl stop maws
```

Verify service is stopped:
```bash
sudo systemctl status maws
```

### 2. Backup Current Database (Optional but Recommended)

```bash
cp .maws/maws.db .maws/maws.db.before-restore
```

### 3. Perform Restoration

```bash
node scripts/restore-backup.mjs .maws/backups/<file>.db.enc
```

**Expected output**: Success message with restoration details

### 4. Verify Restoration

Check database file:
```bash
ls -lh .maws/maws.db
```

### 5. Start MAWS Service

```bash
sudo systemctl start maws
```

Verify service is running:
```bash
sudo systemctl status maws
```

### 6. Verify Data Integrity

#### Check Health Endpoint
```bash
curl http://localhost:3000/api/health
```

#### Check Account Balance
```bash
curl -H "Cookie: maws_session=..." http://localhost:3000/api/live/state
```

Verify balance matches expected value.

#### Check Positions
Verify positions match expected state.

#### Check Recent Orders
Verify recent orders are present.

## Post-Restoration Validation

### 1. Verify Broker Connection

```bash
curl -H "Cookie: maws_session=..." http://localhost:3000/api/health/broker
```

Expected: `connected: true`

### 2. Verify Stream Status

```bash
curl -H "Cookie: maws_session=..." http://localhost:3000/api/live/stream-status
```

Expected: `connected: true`

### 3. Test Order Submission (Testnet Only)

In testnet environment, submit a small test order to verify functionality.

### 4. Check Audit Log

Verify audit log entries are intact:
```bash
sqlite3 .maws/maws.db "SELECT COUNT(*) FROM audit_log"
```

## Rollback Procedure

If restoration fails or data is incorrect:

### 1. Stop MAWS Service

```bash
sudo systemctl stop maws
```

### 2. Restore Pre-Restoration Backup

```bash
cp .maws/maws.db.before-restore .maws/maws.db
```

### 3. Start MAWS Service

```bash
sudo systemctl start maws
```

### 4. Verify Service

Check health endpoint and verify data is correct.

## Troubleshooting

### Restoration Fails with Decryption Error

**Cause**: Backup key does not match backup file

**Resolution**:
1. Verify `MAWS_BACKUP_KEY` in `.env`
2. Ensure key is 64 hex characters
3. Check if backup was created with different key
4. Try other backup files

### Restoration Fails with File Not Found

**Cause**: Backup file path incorrect or file missing

**Resolution**:
1. Verify backup file exists in `.maws/backups/`
2. Check file path is correct
3. List available backups: `ls .maws/backups/`

### Service Fails to Start After Restoration

**Cause**: Database corruption or incompatible schema

**Resolution**:
1. Check logs: `sudo journalctl -u maws`
2. Verify database integrity: `sqlite3 .maws/maws.db "PRAGMA integrity_check"`
3. If corrupted, restore from different backup
4. If schema issue, may need to run migrations

### Data Missing After Restoration

**Cause**: Backup was created before data existed

**Resolution**:
1. Check backup timestamp
2. Try more recent backup
3. Data may be lost if no recent backup available

### Database Permissions Error

**Cause**: File permissions incorrect

**Resolution**:
```bash
chmod 600 .maws/maws.db
chown maws:maws .maws/maws.db
```

## Best Practices

1. **Regular Backups**: Schedule daily backups via cron or systemd timer
2. **Test Restorations**: Periodically test restoration procedure
3. **Multiple Backups**: Keep multiple backup versions (daily, weekly)
4. **Offsite Storage**: Store backups offsite for disaster recovery
5. **Backup Verification**: Verify backups with dry run before relying on them
6. **Document Restoration**: Keep log of restoration attempts and outcomes

## Backup Retention

### Recommended Retention Policy

- **Daily backups**: Keep 7 days
- **Weekly backups**: Keep 4 weeks
- **Monthly backups**: Keep 12 months

### Cleanup Script

```bash
# Keep last 7 daily backups
find .maws/backups/ -name "*.db.enc" -mtime +7 -delete
```

## See Also

- [[OPERATIONS.md|docs/OPERATIONS.md]] - Backup and restore procedures
- [[runbooks/rotate-secrets.md|docs/runbooks/rotate-secrets.md]] - Secret rotation
