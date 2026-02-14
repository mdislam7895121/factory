# fullstack-v1 template

Initial scaffold for a future generator template that will create a full Factory stack:

- apps/web (Next.js)
- apps/api (NestJS)
- apps/mobile (Expo)

## Scope in Step 0

This step only adds docs and a placeholder script.

- No project generation yet
- No code changes in existing apps
- No refactors

## Planned output (future steps)

When implemented, the generator is expected to produce:

- `apps/web/` app scaffold with baseline config
- `apps/api/` service scaffold with baseline config
- `apps/mobile/` app scaffold with baseline config
- shared docs and env templates

## Environment variables (placeholders only)

- `NODE_ENV=development`
- `WEB_PORT=3000`
- `API_PORT=3001`
- `MOBILE_API_BASE_URL=http://localhost:3001`
- `DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/DB_NAME`
- `JWT_SECRET=CHANGE_ME`

See `spec.md` for detailed inputs/outputs and `serial-plan.md` for the execution roadmap.
