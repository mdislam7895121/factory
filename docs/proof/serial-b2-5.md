# Serial B2-5 Proof Report

**Date/Time:** 2026-02-11 02:02:46

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
Γ£ô Compiled successfully in 2.5s
  Running TypeScript ...
  Collecting page data using 7 workers ...
  Generating static pages using 7 workers (0/4) ...
  Generating static pages using 7 workers (1/4) 
  Generating static pages using 7 workers (2/4) 
  Generating static pages using 7 workers (3/4) 
Γ£ô Generating static pages using 7 workers (4/4) in 556.3ms
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
  "insertedId": "db35f7b9-7996-4cd1-851b-def8e5f3539c",
  "count": 16
}
~~~

### API GET /db/health Response 2
~~~
{
  "ok": true,
  "insertedId": "d011bddb-62a1-4d45-859b-a01430afa310",
  "count": 17
}
~~~

## Raw Log
- C:\Users\vitor\Dev\factory\logs\proof-b2-5-20260211-020231.log

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
