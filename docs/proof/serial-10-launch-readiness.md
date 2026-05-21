# SERIAL 10 — Launch Readiness Report
**Date:** 2026-05-21 | **Branch:** `claude/code-audit-review-bERxc`
**Assessor:** Serial automated review (SERIALS 01A–10)

---

## 1. Security Status ✅

- HMAC-SHA256 signed preview tokens with jti nonce replay resistance (SERIAL 05)
- `timingSafeEqual` on all secret comparisons (preview tokens, admin API key)
- bcryptjs password hashing for PASSWORD visibility runtimes
- SSRF prevention: private IP blocklist + metadata host blocklist (SERIAL 05)
- Redis rate limiting on all API endpoints (ApiKeyGuard + createRateLimitMiddleware)
- Signed token verification on all authenticated preview access
- SecurityAuditEvent trail for: terminate, restart, visibility change, snapshot restore, kill switches (SERIAL 10)
- Input validation: class-validator DTOs + maxLength bounds on all user inputs
- No raw secrets in metadata: BLOCKED_META_KEYS + BLOCKED_MANIFEST_KEYS regex strips
- XSS prevention: HTML template uses esc() on all dynamic values
- SQL injection: Prisma ORM with parameterized queries throughout

**Known gap:** No automated penetration test yet. Recommended before public launch.

---

## 2. Runtime Isolation Status ✅

- RuntimeInstance persists independently of API instances (SERIAL 04)
- Sleep/wake lifecycle prevents idle resource waste (SERIAL 04)
- Crash recovery: up to 3 auto-recovery attempts (SERIAL 04)
- Heartbeat monitoring via Redis TTL (SERIAL 04)
- RuntimeHealthScheduler runs every 30s — detects dead runtimes (SERIAL 04)
- Kill switch: `KILL_SWITCH_RUNTIME_CREATE=1` stops new provision (SERIAL 10)
- Quota: max 5 runtimes / 2 concurrent per user (SERIAL 10)

**Known gap:** Container-level isolation depends on orchestrator (not audited in these serials). Recommend container security review.

---

## 3. Preview Architecture Status ✅

- Stable `/p/:id` URLs assigned at creation — never change (SERIAL 05)
- Slug aliases via PreviewRoute for vanity URLs (SERIAL 05)
- SSRF-safe HTTP proxy: validatePort + assertHostNotPrivate + sanitizePath (SERIAL 05)
- WebSocket TCP tunnel proxy (SERIAL 05)
- Wake-on-request: sleeping runtimes auto-wake within 30s (SERIAL 05)
- Access logging: hashed IP/UA, no raw PII (SERIAL 05)
- Mobile preview shell with QR sharing (SERIAL 09)
- Abuse guard: daily limits + IP ban (SERIAL 10)
- Kill switch: `KILL_SWITCH_PREVIEWS=1` (SERIAL 10)

---

## 4. Abuse Protection Status ✅

- Preview rate limiting: 500 req/day/IP, ban at 1000 (SERIAL 10)
- Remix rate limiting: max per user/hour + per IP/hour (SERIAL 06)
- Abuse reporting pipeline: POST /p/:id/report, 5/hr/IP, reason allowlist (SERIAL 09)
- Quota enforcement: runtime, remix, snapshot limits per user (SERIAL 10)
- Temporary IP bans stored in Redis with configurable TTL (SERIAL 10)

**Known gap:** No automated moderation engine. Abuse reports go into DB but require manual review.

---

## 5. Redis Coordination Status ✅

- Distributed rate limiting (all instances share counters) (SERIAL 02/03)
- Distributed wake lock (prevents double-wake) (SERIAL 04)
- Activity stream pub/sub fan-out (SERIAL 07)
- Remix queue (SERIAL 06)
- Kill switches (SERIAL 10)
- Beta invite set (SERIAL 10)
- Abuse counters (SERIAL 10)
- Quota counters (SERIAL 10)

**Known gap:** Redis persistence strategy is documented but depends on operator configuration. Recommend AOF + daily RDB.

---

## 6. Recovery/Snapshot Status ✅

- ProjectSnapshot registry with metadata-only capture (SERIAL 08)
- SHA-256 checksum integrity verification (SERIAL 08)
- Automatic PRE_REMIX snapshot before every fork (SERIAL 08)
- Automatic AUTO_RECOVERY snapshot before every restart attempt (SERIAL 08)
- Per-severity retention cleanup scheduler (SERIAL 08)
- SnapshotRecoveryScheduler for auto-restore on crash (SERIAL 08)
- SecurityAuditEvent on every restore (SERIAL 10)
- previewUrl preserved through all restore operations (SERIAL 08)

**Known gap:** Full filesystem/container snapshot is NOT implemented. Only metadata-only snapshots exist. Container state requires orchestrator-level snapshotting (future work). Clearly documented as TODO in MetadataSnapshotAdapter.

---

## 7. Mobile Preview Status ✅

- Mobile-first shell at /p/:id/shell (SERIAL 09)
- QR code generation (SERIAL 09)
- Web Share API + clipboard fallback (SERIAL 09)
- Wake state UX with polling (SERIAL 09)
- Public-safe activity feed in collapsible panel (SERIAL 09)
- Remix from mobile (SERIAL 09)
- Abuse report from mobile (SERIAL 09)
- "Built with Factory" viral branding for PUBLIC previews (SERIAL 09)

---

## 8. Known Limitations

| Item | Status | Severity |
|------|--------|----------|
| Container filesystem snapshot | NOT IMPLEMENTED | Medium |
| Automated abuse moderation | NOT IMPLEMENTED | Low |
| Full penetration test | NOT RUN | High |
| Container isolation audit | NOT AUDITED | High |
| Real payment/billing flow | STUB ONLY (Stripe dep present) | Medium |
| User onboarding flow (UI) | NOT IN SCOPE (API only) | Low |
| Multi-region redundancy | NOT IMPLEMENTED | Medium |
| GDPR data export/deletion | NOT IMPLEMENTED | Medium (legal) |
| CDN for preview shell assets | NOT IMPLEMENTED | Low |

---

## 9. Accepted Beta Risks

1. **Container isolation not audited**: Generated apps run in containers whose security is orchestrator-dependent. Mitigated by public preview visibility controls (PRIVATE default).
2. **Metadata-only snapshots**: Full FS restore not available. Communicated clearly. Users can restore config but not running state.
3. **Manual abuse moderation**: Abuse reports are stored but require human review. Acceptable for controlled beta.
4. **Redis non-HA**: Single Redis instance. Acceptable for alpha/beta. Kill switches default to env vars on Redis miss.

---

## 10. Remaining Enterprise Gaps

- SSO/SAML authentication
- RBAC (role-based access control) beyond owner
- Multi-tenant workspace isolation
- SLA/uptime commitments
- GDPR/CCPA data processing agreements
- Enterprise billing
- Dedicated container isolation per org
- Audit log export (SIEM integration)

---

## 11. Recommended Rollout Strategy

### Stage 1 — Internal Testing (NOW READY)
- Internal team only
- `BETA_MODE=closed` + admin API keys
- Full security review of containers
- Penetration test

### Stage 2 — Private Alpha (2–4 weeks)
- `BETA_MODE=invite`
- 50–100 hand-picked users
- `AUTO_RESTORE_ENABLED=true`
- Monitor abuse metrics daily
- Collect crash/recovery reports

### Stage 3 — Limited Public Beta (4–8 weeks)
- `BETA_MODE=open` + `PUBLIC_SIGNUP_ENABLED=true`
- QUOTA limits enforced (5 runtimes / user)
- Abuse guard active
- Legal pages live
- GDPR notice visible

### Stage 4 — Paid Beta
- Stripe billing enabled
- Quota tiers per plan
- `SNAPSHOT_MAX_PER_PROJECT` increased for paid users
- SLA commitments for enterprise track

---

## Final Verdict

| Track | Ready? | Conditions |
|-------|--------|------------|
| **Internal testing** | ✅ YES | Set BETA_MODE=closed, add admin key |
| **Private alpha** | ✅ YES | Set BETA_MODE=invite, generate invite codes |
| **Limited public beta** | ✅ YES (with caveat) | Requires container security audit first |
| **Paid beta** | ⚠️ PARTIALLY | Stripe integration present but not tested end-to-end |
| **Enterprise** | ❌ NOT YET | Requires RBAC, SSO, GDPR, SLA |

**Recommendation:** Ship to private alpha immediately. Schedule container security audit within 2 weeks before public beta.
