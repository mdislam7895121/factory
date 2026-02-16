# Factory Production Backup & Recovery

## 1) How to create a backup

### Production backup (recommended)

Use Railway Postgres public connection string with the backup script:

```powershell
pwsh -File api/scripts/backup-prod.ps1 -OutputFile backup.sql -DatabaseUrl $env:DATABASE_PUBLIC_URL
```

Alternative direct command:

```powershell
pg_dump "$env:DATABASE_PUBLIC_URL" -f backup.sql
```

## 2) How to restore a backup

### Local restore dry run

```powershell
# Start local temporary PostgreSQL (example port 55433), then:
psql -h localhost -p 55433 -U postgres -d restore_dry_run -f .\backup.sql
```

Verify schema:

```powershell
psql -h localhost -p 55433 -U postgres -d restore_dry_run -c "SELECT count(*) AS public_tables FROM information_schema.tables WHERE table_schema='public';"
```

## 3) Emergency production recovery steps

1. Confirm incident via monitoring (`Uptime Prod` + Railway logs).
2. Identify latest valid backup artifact.
3. Freeze risky writes if needed (SEV policy from runbook).
4. Restore into a verified target database.
5. Repoint service only after restore verification passes.
6. Validate production health endpoint:

```powershell
curl -i https://factory-production-production.up.railway.app/db/health
```

## 4) Estimated recovery time

- Backup creation: ~1–5 minutes (small database)
- Restore to recovery target: ~2–10 minutes
- Validation and traffic cutover: ~5–15 minutes

Estimated total recovery window: 10–30 minutes.

## 5) Data loss window explanation

Recovery Point Objective (RPO) depends on backup freshness.

- If backup is hourly: potential data loss up to 1 hour.
- If backup is daily only: potential data loss up to 24 hours.
- If ad-hoc backup is taken before risky changes: data loss window is minimized.

Always record backup timestamp and restore target in incident notes.
