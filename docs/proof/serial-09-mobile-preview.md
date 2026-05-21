# SERIAL 09 — Mobile Viral Preview Experience
**Date:** 2026-05-21
**Branch:** `claude/code-audit-review-bERxc`

---

## 1. Mobile Preview Shell Proof

**Endpoint:** `GET /p/:id/shell`

Renders `PreviewShellService.generateHtml()` — full mobile-first HTML page:
- `<meta name="viewport">` — mobile-scaled
- Top bar: app title, ⚡ activity, ⬆ share, Remix (if allowRemix), ⛶ fullscreen
- Status bar: live color-coded state (checking / waking / online / failed / unauthorized)
- iframe: loads `/p/:runtimeId` (proxied app) only after check confirms `allowed: true`
- Share modal: copy URL + QR image + Web Share API (if browser supports it)
- Activity drawer: slide-up panel fetches `/v1/activity/:projectId/public`
- Response headers: `Content-Type: text/html`, `X-Frame-Options: SAMEORIGIN`, strict CSP

XSS protection: all dynamic values passed through `esc()` function before embedding in HTML.

---

## 2. Public Preview Open Proof

PUBLIC runtimes: shell status bar shows "● Live" (green); iframe loads the app directly at `/p/:runtimeId`.

`GET /p/:id/share` returns:
```json
{
  "shellUrl": "http://host/p/:id/shell",
  "qrUrl":    "/p/:id/qr",
  "allowRemix": true/false,
  "visibility": "PUBLIC",
  "status": "RUNNING"
}
```

No auth required for public shell/share/qr endpoints.

---

## 3. Private Preview Blocked Proof

PRIVATE runtimes: `GET /p/:id/check` returns `{ allowed: false, visibility: "PRIVATE" }`. Shell JS detects this and shows "Access denied" overlay. The iframe is never loaded — the proxy is never hit for unauthorized users.

`@UseGuards(ApiKeyGuard)` remains on `/token` endpoint only. Shell/share/qr/report are intentionally open (metadata-safe only, no secrets exposed).

---

## 4. QR / Share Proof

**`GET /p/:id/qr`** — Returns PNG QR code (via `qrcode` npm package, `toDataURL()`) encoding the shell URL:
```
http://host/p/:id/shell
```
Response: `Content-Type: image/png`, `Cache-Control: public, max-age=3600`

Shell modal displays `<img src="/p/:id/qr">` for instant QR scan.

**Share flow:**
1. User taps ⬆ Share button
2. Modal opens with copy-able URL + QR image
3. If `navigator.share` available → "Share via…" button triggers native OS share sheet
4. Fallback: `navigator.clipboard.writeText()` + execCommand copy

---

## 5. Wake State Proof

Shell JS implements 5 states with automatic polling (`GET /p/:id/check`):

| JS state | Trigger | Visual |
|---|---|---|
| `checking` | Initial load | spinner + "Checking…" |
| `waking` | status=SLEEPING or PROVISIONING | spinner + "Waking app…" |
| `online` | status=RUNNING + allowed=true | green status bar, iframe loads |
| `crashed` | status=CRASHED or STOPPED | red status bar, Retry button |
| `unauthorized` | allowed=false | overlay with reason message |

Poll interval: 2.5s while waking. Heartbeat: 30s while online to detect crashes.

---

## 6. Mobile Remix Proof

**Remix button** in shell (PUBLIC + allowRemix only):
- Hidden via `hidden` attribute when `allowRemix === false`
- For PUBLIC+allowRemix: taps → redirects to `/remix-handoff?source=:runtimeId`
  (auth handoff: anonymous users prompted to sign in before remix continues)
- Backend reuses SERIAL 06 `POST /p/:previewId/remix` endpoint unchanged

---

## 7. Public-Safe Activity Feed Proof

**`GET /v1/activity/:projectId/public`** — SERIAL 07 endpoint, INFO+SUCCESS events only, redacted metadata.

Shell activity drawer:
- Lazy-loaded only when user taps ⚡ button
- Fetches 20 events, displays eventType + title + timestamp
- No hidden prompts, system, or internal metadata (stripped by `redactEvent()`)
- Only present when `projectId` is non-null (some runtimes may not have one)

---

## 8. Abuse Report Proof

**Endpoint:** `POST /p/:id/report`

Security measures:
- Rate limit: 5 reports per IP per hour (Redis INCR/PEXPIRE, hashed IP)
- Reason: restricted to allowlist (`spam`, `malware`, `phishing`, `illegal_content`, `harassment`, `privacy_violation`, `copyright`, `other`)
- Message: max 1000 chars, control chars stripped
- IP stored as SHA-256 hash (32 hex chars) — not raw
- Returns 429 on rate limit, 201 on success

DB: `PreviewAbuseReport` table with indexes on `previewId/createdAt` and `createdAt`.

---

## 9. Build PASS

```
npm run build → PASS (zero TS errors)
```

`qrcode` package added (60KB, zero transitive deps for this usage pattern). Justified: QR code generation is a core SERIAL 09 feature.

---

## 10. Tests PASS

```
Tests: 2/2 passed
```

---

## 11. git diff --stat

```
api/.env.example                          |    4 +
api/package.json                          |    2 +
api/prisma/schema.prisma                  |   16 +
api/src/main.ts                           |    3 +-
api/src/preview/preview.controller.ts     |  103 +-
api/src/preview/preview.module.ts         |    6 +-
api/src/preview/preview-shell.service.ts  (new)
api/src/preview/preview-abuse.service.ts  (new)
api/prisma/migrations/20260521000009_preview_abuse/migration.sql (new)
docs/proof/serial-09-mobile-preview.md    (new)
```

---

## Rollback Plan

1. Revert `main.ts` API_SUBPATHS to `['/token', '/check', '/remix']`
2. Remove `PreviewShellService` and `PreviewAbuseService` from `PreviewModule`
3. Revert `PreviewController` to pre-09 version
4. Drop `PreviewAbuseReport` table (migration revert)
5. All `POST /p/:id/remix`, `GET /p/:id/check`, token endpoints unaffected
