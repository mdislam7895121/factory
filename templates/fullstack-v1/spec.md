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

## Generated file map (Step 2 — finalized)

### Output folder rule

- Default output path: `./{name}`
- Optional override: `outputDir` (when provided later by Step 3 CLI wiring)
- Effective output path rule: `targetDir = outputDir ? outputDir + "/" + name : "./" + name`

### Generated output layout (MVP)

```text
{targetDir}/
  README.md
  .gitignore
  .env.example
  apps/
    api/
      package.json
      tsconfig.json
      src/
        main.ts
    web/
      package.json
      next.config.js
      tsconfig.json
      src/
        app/
          page.tsx
          layout.tsx
  packages/
    shared/
      package.json
      src/
        index.ts
        types.ts
```

### Generated files catalog (MVP)

| File path | Purpose | Source template | Write rule |
| --- | --- | --- | --- |
| `README.md` | Top-level project usage and bootstrap notes | `root/README.md.hbs` | `OVERWRITE` |
| `.gitignore` | Basic ignores for Node/TS output and env files | `root/.gitignore.hbs` | `SKIP_IF_EXISTS` |
| `.env.example` | Safe example env values only | `root/.env.example.hbs` | `SKIP_IF_EXISTS` |
| `apps/api/package.json` | API package manifest for minimal Node/TS service | `apps/api/package.json.hbs` | `OVERWRITE` |
| `apps/api/tsconfig.json` | API TypeScript compiler config | `apps/api/tsconfig.json.hbs` | `OVERWRITE` |
| `apps/api/src/main.ts` | API bootstrap placeholder entrypoint | `apps/api/src/main.ts.hbs` | `OVERWRITE` |
| `apps/web/package.json` | Web package manifest for minimal Next.js app | `apps/web/package.json.hbs` | `OVERWRITE` |
| `apps/web/next.config.js` | Web framework baseline config | `apps/web/next.config.js.hbs` | `OVERWRITE` |
| `apps/web/tsconfig.json` | Web TypeScript compiler config | `apps/web/tsconfig.json.hbs` | `OVERWRITE` |
| `apps/web/src/app/layout.tsx` | Web root layout placeholder | `apps/web/src/app/layout.tsx.hbs` | `OVERWRITE` |
| `apps/web/src/app/page.tsx` | Web root page placeholder | `apps/web/src/app/page.tsx.hbs` | `OVERWRITE` |
| `packages/shared/package.json` | Shared package manifest for common code | `packages/shared/package.json.hbs` | `OVERWRITE` |
| `packages/shared/src/index.ts` | Shared exports placeholder | `packages/shared/src/index.ts.hbs` | `OVERWRITE` |
| `packages/shared/src/types.ts` | Shared types placeholder | `packages/shared/src/types.ts.hbs` | `OVERWRITE` |

Write rule definitions:
- `OVERWRITE`: always rewrite file with template output
- `SKIP_IF_EXISTS`: generate only when the file does not already exist
- `APPEND`: append-only mode (not used in Step 2)

### Variables/placeholders used (Step 2 map)

- `{{name}}`
- `{{withAuth}}`
- `{{database}}`

### MVP vs future scope split

MVP (this finalized file map):
- Root docs/env baseline: `README.md`, `.gitignore`, `.env.example`
- Minimal app skeleton folders for API and Web
- Minimal shared package skeleton (`packages/shared`)

Future steps (not generated in Step 2):
- `apps/mobile/` scaffold (Step 6)
- CI workflow files and quality gates (Step 8)
- Test/proof automation files (Step 9)
- Deployment/docker production assets, auth wiring, and advanced integrations

## Step 3 — Generator engine (plan mode)

Step 3 adds plan-only execution that computes what would be generated, without writing template files.

### CLI entry

- `node ./templates/fullstack-v1/bin/fullstack-v1.mjs plan --name <name> --withAuth <true|false> --database <postgres|sqlite> --json`

### Plan mode behavior

- Uses Step 1 validation rules for `name`, `withAuth`, and `database`
- Uses Step 2 file map as source of truth for planned file list
- Produces deterministic JSON (stable sort by `path`, no timestamps)
- Does not write template output files in plan mode

### Plan output contract

```json
{
  "ok": true,
  "templateId": "fullstack-v1",
  "mode": "plan",
  "inputs": {
    "name": "demoapp",
    "withAuth": true,
    "database": "postgres",
    "outputDir": "."
  },
  "output": {
    "rule": "targetDir = outputDir ? outputDir + \"/\" + name : \"./\" + name",
    "targetFolder": "./demoapp"
  },
  "files": [
    {
      "path": "README.md",
      "action": "CREATE",
      "source": "template:root/README.md.hbs"
    }
  ],
  "counts": {
    "totalFiles": 14,
    "totalDirs": 6
  }
}
```

Validation failure contract:

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

## Step 4 — Generator engine (write mode)

Step 4 adds write execution that materializes the Step 2 file map into a target folder.

### CLI entry

- `node ./templates/fullstack-v1/bin/fullstack-v1.mjs write --name <name> --withAuth <true|false> --database <postgres|sqlite> --outputDir <dir> [--force] [--json]`

### Write mode behavior

- Uses the same validation as Step 1 (`name`, `withAuth`, `database`)
- Uses the same file map as Step 2 / Step 3 plan mode
- Default safety: if target folder exists and is not empty, returns `ok:false` with `TargetNotEmpty`
- `--force` allows overwriting only known mapped files; unknown files are not deleted
- Path traversal guard: rejects absolute paths, `..` segments, and any resolved path outside `targetFolder`
- Plan determinism remains unchanged for same inputs

### Write output contract (`--json`)

```json
{
  "ok": true,
  "templateId": "fullstack-v1",
  "mode": "write",
  "inputs": {
    "name": "demoapp",
    "withAuth": true,
    "database": "postgres",
    "outputDir": "./output/write-demo"
  },
  "output": {
    "rule": "targetDir = outputDir ? outputDir + \"/\" + name : \"./\" + name",
    "targetFolder": "./output/write-demo/demoapp"
  },
  "counts": {
    "totalFiles": 14,
    "totalDirs": 6
  },
  "write": {
    "force": false,
    "createdFiles": [
      "README.md"
    ],
    "overwrittenFiles": []
  }
}
```

Write safety failure example:

```json
{
  "ok": false,
  "error": "TargetNotEmpty",
  "message": "target folder exists and is not empty; use --force to overwrite known files",
  "targetFolder": "./output/write-demo/demoapp"
}
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
- Step 2 — Define deterministic file map (complete)
- Step 3 — Implement generator engine (plan mode) (complete)
- Step 4 — Implement generator engine (write mode) (complete)
- Step 5 — Implement `apps/api` scaffold
- Step 6 — Implement `apps/mobile` scaffold
- Step 7 — Add auth/database options wiring
- Step 8 — Add CI integration and checks
- Step 9 — Add tests and proof scripts
- Step 10 — Final verification and docs hardening
