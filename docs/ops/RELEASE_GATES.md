# Release Gates (Serial Q)

## Purpose

Release gates prevent accidental bad deploys from reaching production by requiring both CI and production smoke checks.

## Required Gates

1. `CI` workflow on `main`
2. `Smoke Prod` workflow on `main`

Both checks should be configured as required status checks on branch protection for `main`.

## Smoke Prod Coverage

The `Smoke Prod` workflow runs on:
- push to `main`
- manual dispatch (`workflow_dispatch`)

Checks:
- `GET /db/health` must return `200`
- `GET /` must return `200`
- `GET /debug-sentry` without header must return `403`

Proof lines printed in logs:
- `SMOKE_DB_HEALTH=<status>`
- `SMOKE_ROOT=<status>`
- `SMOKE_DEBUG_NOHEADER=<status>`

## Manual Smoke Run

From repo root:

```powershell
gh workflow run "Smoke Prod" --ref main
gh run list --workflow "Smoke Prod" --limit 3
gh run view <run_id> --json status,conclusion,htmlUrl,createdAt
gh run view <run_id> --log | Select-String -Pattern "SMOKE_"
```

Expected:
- `SMOKE_DB_HEALTH=200`
- `SMOKE_ROOT=200`
- `SMOKE_DEBUG_NOHEADER=403`
- workflow conclusion `success`

## Failure Interpretation

- `SMOKE_DB_HEALTH!=200`: API/database path unhealthy.
- `SMOKE_ROOT!=200`: API root endpoint unhealthy or platform routing issue.
- `SMOKE_DEBUG_NOHEADER!=403`: debug guard drift/regression in production security policy.

## Branch Protection Setup

Set branch protection on `main` with required checks:
- `CI`
- `Smoke Prod / Smoke Prod Gate`

If CLI enforcement fails due permissions, use GitHub UI:
1. Repo Settings → Branches → Branch protection rules.
2. Edit rule for `main` (or create one for `main`).
3. Enable **Require status checks to pass before merging**.
4. Select checks:
   - `CI`
   - `Smoke Prod / Smoke Prod Gate`
5. Save changes.

## Emergency Rollback

Revert Serial Q commit:

```powershell
git revert <commit_sha> --no-edit
git push origin main
```

## Emergency Unblock (Temporary)

If release is blocked and an emergency fix is required:
1. Repo Settings → Branches → `main` rule.
2. Temporarily remove required check `Smoke Prod / Smoke Prod Gate`.
3. Merge emergency fix.
4. Re-enable the required check immediately after stabilization.
