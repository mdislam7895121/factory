# Serial B2-5 Proof Report

**Date/Time:** 2026-02-11 01:52:54

## Commands Run
- web: npm run dev (already running)
- web: npm run build
- api: npm run start:dev (already running)
- web GET /: Invoke-WebRequest http://localhost:3000/
- api GET /: Invoke-RestMethod http://localhost:4000/
- api GET /db/health (x2)

## Output Snippets

### Web GET / StatusCode
~~~
200
~~~

### Web build output (tail)
~~~

> web@0.1.0 build
> next build

Γû▓ Next.js 16.1.6 (Turbopack)

  Creating an optimized production build ...
Γ£ô Compiled successfully in 2.6s
  Running TypeScript ...
  Collecting page data using 7 workers ...
  Generating static pages using 7 workers (0/4) ...
  Generating static pages using 7 workers (1/4) 
  Generating static pages using 7 workers (2/4) 
  Generating static pages using 7 workers (3/4) 
Γ£ô Generating static pages using 7 workers (4/4) in 569.7ms
  Finalizing page optimization ...

Route (app)
Γöî Γùï /
Γöö Γùï /_not-found


Γùï  (Static)  prerendered as static content


~~~

### API GET / Response
~~~
Hello World!
~~~

### API GET /db/health Response 1
~~~
{
  "ok": true,
  "insertedId": "24db5a5f-654e-4333-842e-f7bd33ecf4ca",
  "count": 8
}
~~~

### API GET /db/health Response 2
~~~
{
  "ok": true,
  "insertedId": "0ee0e6bd-542a-4b0f-ad60-46a98a30631b",
  "count": 9
}
~~~

## Raw Log
- C:\Users\vitor\Dev\factory\logs\proof-b2-5-20260211-015238.log

## Definition of Done
- [x] Web dev server starts on port 3000 and GET / returns 200
- [x] Web build succeeds
- [x] API GET / returns Hello World
- [x] db/health count increases across two calls

## Failure (if any)
- None

## Rollback Steps
- git revert <commit-hash>
- git checkout -- docs/proof/serial-b2-5.md scripts/proof-b2-5.ps1
