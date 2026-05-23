# Factory — AI Software Operating Platform

Factory helps founders and teams go from idea → demo → workspace → deployment using AI-assisted workflows.

> **Current phase:** PRE-PUBLIC-BETA · **Go/No-Go verdict:** NO\_GO · **Version:** 0.1.0

---

## What Factory Does

Factory is a platform that lets non-technical founders and small teams build, preview, and iterate on software products using AI-assisted workflows — without writing code manually.

| Capability | Description |
|------------|-------------|
| **AI-assisted product generation** | Describe your idea; Factory produces a structured product blueprint |
| **Demo + preview workflows** | Watch AI agents build a working app preview from your description |
| **Workspace IDE** | Inspect, iterate, and manage your generated project |
| **Quality analysis** | AI council reviews the build for correctness, security, and completeness |
| **Memory engine** | Persistent context across sessions — Factory remembers your product decisions |
| **Collaboration** | Multi-user sessions with role-based access control |
| **Deployment preparation** | Build artifacts and deployment workflows targeting live hosting |
| **Customer feedback loops** | In-product feedback widget → support inbox → pain ranking → roadmap suggestions |
| **Monitoring and admin** | Production health checks, activation analytics, customer success CRM |

---

## Platform Modules

### Frontend (Next.js App Router → Netlify)

| Route | Module | Purpose |
|-------|--------|---------|
| `/` | Landing | Hero, value proposition, entry point |
| `/demo` | Demo | AI-assisted idea → blueprint → preview flow |
| `/discover` | Discovery | Browse and remix existing previews |
| `/workspace` | Workspace IDE | Project management, editing, iteration |
| `/quality` | Quality center | AI council review results and code analysis |
| `/memory` | Memory center | Persistent project memory and context |
| `/onboarding` | Beta onboarding | 4-step role/goal/path selection for new users |
| `/status` | Public status | Live system health page |
| `/admin` | Admin control tower | Support inbox, analytics, CRM, system health |

### Backend (NestJS → Railway)

| Module | Purpose |
|--------|---------|
| Demo | Blueprint generation, idea processing |
| Preview | Working app preview generation and hosting |
| Workspace | Project state, file management |
| Collaboration | Real-time multi-user sessions |
| Pair programmer | AI coding assistant integrated into workspace |
| Memory | Key-value and event-based agent memory |
| Quality | AI council review orchestration |
| Onboarding | Activation state tracking, stuck detection, next-best-action |
| Feedback | Feedback widget backend, pain ranking, roadmap suggestions |
| Customer success | Beta cohort CRM, health scoring, follow-up task management |
| RBAC / Organization | Role-based access, team management |
| Public status | Synthetic health check endpoints |
| Monitoring | Production watch scripts, alert hooks |
| Billing | Subscription and quota management |
| Audit | Activity log and security audit trail |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Factory Platform                        │
│                                                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Next.js App Router  (Netlify)                         │ │
│  │  Landing · Demo · Workspace · Quality · Memory         │ │
│  │  Onboarding · Admin · Status · Discover                │ │
│  └──────────────────────┬─────────────────────────────────┘ │
│                         │  NEXT_PUBLIC_API_BASE_URL          │
│                         ▼                                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  NestJS Control Plane  (Railway)                       │ │
│  │  /v1/demo · /v1/onboarding · /v1/feedback              │ │
│  │  /v1/memory · /v1/workspace · /v1/quality              │ │
│  │  /v1/collaboration · /admin/*                          │ │
│  └──────────────────────┬─────────────────────────────────┘ │
│                         │                                   │
│                         ▼                                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Runtime / Preview System  (Railway)                   │ │
│  │  Isolated preview environments per project             │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Key architectural decisions:**

- **Frontend:** Next.js 15 App Router. Inline styles only — no Tailwind. Server components for layouts (SEO metadata), client components for interactivity.
- **Backend:** NestJS with in-memory data stores during beta phase. No Prisma migrations required for beta services.
- **Hosting split:** Frontend on Netlify (static CDN + Next.js SSR). API and runtime on Railway (Node.js long-running processes).
- **API surface:** Frontend calls Railway directly via `NEXT_PUBLIC_API_BASE_URL`. No open proxy on Netlify.
- **Security headers:** Configured in `netlify.toml` — CSP, HSTS, X-Frame-Options, X-Content-Type-Options.

---

## Current Status

| Field | Value |
|-------|-------|
| Phase | PRE-PUBLIC-BETA |
| Go/No-Go verdict | `NO_GO` |
| Blocker | Netlify production site has not been created |
| Account | `md-tazizul-islam-c5abzm8` (Netlify) |
| Branch | `claude/code-audit-review-bERxc` |
| Version | 0.1.0 |

**No users have been invited.** The no-invite rule is active until the Go/No-Go verdict reaches `GO_PRIVATE_ALPHA`.

See `docs/beta/go-no-go-tracker.md` for the live verdict and the 10-step path to `GO_FIRST_5_BETA`.

**To unblock:** Follow `docs/beta/netlify-operator-action.md` (15–30 minutes, manual browser step).

---

## Deployment Status

| Check | Status |
|-------|--------|
| Build passes locally | ✅ |
| `netlify.toml` configured | ✅ |
| Security headers configured | ✅ (pending live verification) |
| Smoke script exists | ✅ `scripts/public-beta-smoke.ps1` |
| Beta onboarding flow built | ✅ |
| Customer success CRM built | ✅ |
| Feedback widget built | ✅ |
| Monitoring scripts built | ✅ |
| SEO metadata configured | ✅ |
| Netlify site created | ❌ Manual step required |
| Live URL verified | ❌ Pending Netlify creation |
| Smoke script run against live URL | ❌ Pending live URL |
| Beta invites sent | ❌ Pending GO_PRIVATE_ALPHA verdict |

---

## Local Development

### Prerequisites

- Node.js 20+
- npm 9+

### Frontend

```bash
cd web
npm install
npm run dev
# → http://localhost:3000
```

### API

```bash
cd api
npm install
npm run start:dev
# → http://localhost:3001
```

### Environment variables

Frontend (`web/.env.local`):

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

API (`api/.env`):

```
# Required
AUTH_SECRET=your-secret-here
ANTHROPIC_API_KEY=your-key-here

# Optional
STRIPE_SECRET_KEY=
SENTRY_DSN=
```

Never commit `.env` or `.env.local` files. Never add backend secrets to Netlify environment variables.

---

## Engineering Principles

- **Proof-first workflow:** Every serial produces a proof document in `docs/proof/` before the commit is considered complete.
- **Serial locking:** Work is delivered in named, locked serials. A serial is immutable once committed. New serials build on top; they do not rewrite previous ones.
- **Minimal diffs:** Changes are scoped to what the serial requires. No incidental refactoring, no speculative abstractions.
- **Non-breaking additive development:** New modules are added alongside existing ones. No destructive changes to working systems.
- **Security-first rules:** No raw email in any data store or API response — only `emailHash` (FNV32) and `emailMasked`. No secrets in committed files. No open proxies.
- **In-memory beta services:** Beta-phase services (feedback, onboarding, customer success) use in-memory Maps. No database migration required to add a beta feature.

---

## Repository Structure

```
factory/
├── web/          Next.js App Router frontend
├── api/          NestJS control plane
├── mobile/       Mobile client (deprioritised during beta)
├── docs/
│   ├── beta/     Beta readiness docs, user tracking, interview findings
│   ├── proof/    Serial proof documents
│   └── launch/   Launch runbooks
├── scripts/      Smoke tests, monitoring scripts
├── docker/       Local development containers
└── netlify.toml  Frontend build + security header config
```

---

## License

MIT
