# Perpetual — Sandbox Infrastructure for AI Agents

Run isolated code. Coordinate multi-agent councils. Persist agent memory. Monitor continuously.

> **E2B alternative** · Self-hostable · $0.001/second · 100 free seconds/day

---

## What is this?

Perpetual is a **Perpetual Software Engine** — a multi-agent infrastructure platform where:

- **Sandboxes** execute arbitrary code in isolated Docker containers (Python, Node.js, Bash)
- **Agent Memory** gives AI agents a persistent key-value brain across runs
- **Agent Council** coordinates 6 specialized agents (Architect, Dev×3, QA, Security) to solve complex problems
- **Continuous Loops** monitor your system and auto-heal issues every N minutes/hours

---

## Quickstart (5 minutes)

### 1. Run code in an isolated sandbox

```bash
curl -X POST https://api.perpetual.dev/v1/sandbox/create \
  -H "Authorization: Bearer sk-live-YOUR_KEY" \
  -d '{"language": "python"}'

curl -X POST https://api.perpetual.dev/v1/sandbox/SANDBOX_ID/run \
  -H "Authorization: Bearer sk-live-YOUR_KEY" \
  -d '{"code": "import math\nprint(math.pi)"}'
# { "stdout": "3.141592653589793\n", "exit_code": 0, "duration_secs": 1 }
```

### 2. Python SDK

```bash
pip install perpetual
```

```python
from perpetual import Perpetual
client = Perpetual(api_key="sk-live-...")

result = client.sandbox.run_once("python", "print(2 ** 32)")
print(result.stdout)  # 4294967296

session = client.council.run_and_wait("Design a rate limiter for a multi-tenant API")
print(session.result["synthesis"])

client.memory.set("architect", "last-decision", {"algo": "token-bucket"})
loop = client.loops.create("prod-monitor", interval_secs=3600)
```

### 3. Node.js SDK

```bash
npm install perpetual
```

```typescript
import { Perpetual } from 'perpetual';
const client = new Perpetual({ apiKey: 'sk-live-...' });

const result = await client.sandbox.runOnce('nodejs', 'console.log(process.version)');
const session = await client.council.runAndWait({
  task: 'Build a JWT auth system with refresh tokens',
  context: { language: 'typescript', framework: 'NestJS' }
});
```

---

## API Reference

Full OpenAPI 3.1 spec: [`docs/openapi.yaml`](docs/openapi.yaml)

| Resource | Endpoints |
|----------|-----------|
| **Sandbox** | `POST /v1/sandbox/create` · `GET/DELETE /v1/sandbox/:id` · `POST /v1/sandbox/:id/run` |
| **API Keys** | `POST/GET /v1/api-keys` · `DELETE /v1/api-keys/:id` |
| **Usage** | `GET /v1/usage/today` · `GET /v1/usage/summary` |
| **Memory** | `PUT/GET/DELETE /v1/memory/:ns/:key` · `POST/GET /v1/memory/:ns/events` |
| **Council** | `POST /v1/council/run` · `GET /v1/council/:id` · `GET /v1/council/:id/messages` |
| **Loops** | `POST /v1/loops` · `PATCH /v1/loops/:id/pause|resume` · `POST /v1/loops/:id/trigger` |
| **Billing** | `POST /v1/billing/checkout` · `POST /v1/billing/webhook` |

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    Perpetual Engine                      │
│                                                          │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │  Sandbox    │  │ Agent Memory │  │  Agent Council │  │
│  │  (Docker)   │  │  (Postgres)  │  │  (6 x Claude)  │  │
│  └─────────────┘  └──────────────┘  └────────────────┘  │
│                                                          │
│  ┌─────────────────────────────────────────────────────┐ │
│  │           Continuous Loop Scheduler                 │ │
│  │   Monitor Agent → Healer Agent → Webhook notify    │ │
│  └─────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

### Agent Council (3-round protocol)

```
POST /v1/council/run  →  Round 1: Architect plans
                      →  Round 2: Dev×3 + QA + Security (parallel)
                      →  Round 3: Architect synthesizes
GET /v1/council/:id   →  { "status": "completed", "result": { ... } }
```

### Sandbox Security

Each container: `--network none` · `--read-only` · `--memory 512m` · `--cpus 0.5` · `/tmp tmpfs 100m`

---

## Self-Hosting

```bash
git clone https://github.com/mdtazizulislam/factory && cd factory
cp docker/.env.example docker/.env && cp api/.env.example api/.env
# fill in DATABASE_URL, AUTH_SECRET, ANTHROPIC_API_KEY
cd docker && docker compose -f docker-compose.dev.yml up -d
cd ../api && npx prisma migrate deploy && npm run start:dev
```

**Required env vars:** `DATABASE_URL` · `AUTH_SECRET` · `ANTHROPIC_API_KEY`
**Optional:** `STRIPE_SECRET_KEY` · `STRIPE_WEBHOOK_SECRET` · `SENTRY_DSN`

---

## Pricing

| Tier | Amount | Cost |
|------|--------|------|
| Free | 100 sec/day/user | $0 |
| Paid | After free tier | $0.001/sec |

---

## License

MIT
