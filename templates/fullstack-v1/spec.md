# fullstack-v1 generator spec

## Objective

Define a non-breaking generator template that can scaffold a full stack project composed of Web + API + Mobile.

## Inputs (finalized for Step 1)

- `name` (string)
- `withAuth` (boolean)
- `database` (`postgres` | `sqlite`)

## Validation rules (finalized for Step 1)

### `name`
- Required
- Trimmed before validation
- Allowed pattern: `^[a-z][a-z0-9-]{2,39}$`
- Must not match reserved names: `api`, `web`, `mobile`, `apps`, `docs`, `scripts`

### `withAuth`
- Optional
- Default: `false`
- Must be a boolean when provided

### `database`
- Optional
- Default: `postgres`
- Allowed values: `postgres`, `sqlite`

## Input payload contract

```json
{
  "name": "acme-factory",
  "withAuth": false,
  "database": "postgres"
}
```

Invalid example (`name` fails pattern):

```json
{
  "name": "Acme Factory",
  "withAuth": true,
  "database": "postgres"
}
```

Validation error contract:

```json
{
  "ok": false,
  "error": "ValidationError",
  "issues": [
    {
      "field": "name",
      "message": "name must match ^[a-z][a-z0-9-]{2,39}$"
    }
  ]
}
```

## Outputs (planned)

- A new target directory under `<OutDir>/<name>`
- Generated app folders:
  - `apps/web/`
  - `apps/api/`
  - `apps/mobile/`
- Support files:
  - `.env.example` (safe placeholders only)
  - `README.md`
  - optional CI and container config

## Target folder structure (planned)

```text
<OutDir>/<name>/
  apps/
    web/
    api/
    mobile/
  docs/
  scripts/
  .env.example
  README.md
```

## Environment variables (placeholders only)

- `NODE_ENV=development`
- `WEB_PORT=3000`
- `API_PORT=3001`
- `MOBILE_API_BASE_URL=http://localhost:3001`
- `DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/DB_NAME`
- `JWT_SECRET=CHANGE_ME`

## Non-goals for Step 0

- No file generation of web/api/mobile apps
- No modifications to existing repository code
- No dependency installation
- No secrets or tokens

## Future serial steps (0-10)

- Step 0 — Scaffold docs + placeholder script (complete)
- Step 1 — Finalize schema and validation rules (complete)
- Step 2 — Define deterministic file map
- Step 3 — Implement generator engine (plan mode)
- Step 4 — Implement `apps/web` scaffold
- Step 5 — Implement `apps/api` scaffold
- Step 6 — Implement `apps/mobile` scaffold
- Step 7 — Add auth/database options wiring
- Step 8 — Add CI integration and checks
- Step 9 — Add tests and proof scripts
- Step 10 — Final verification and docs hardening
