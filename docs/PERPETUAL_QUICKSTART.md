# Perpetual — 5-Minute Quickstart

## Step 1 — Get Your API Key

```bash
# Login and create an API key
curl -X POST https://api.perpetual.dev/auth/login \
  -d '{"email": "you@example.com", "password": "your-password"}'
# → { "token": "eyJ..." }

curl -X POST https://api.perpetual.dev/v1/api-keys \
  -H "Authorization: Bearer eyJ..." \
  -d '{"name": "my-first-key"}'
# → { "key": "sk-live-abc123..." }  ← save this!
```

## Step 2 — Run Code in a Sandbox

```bash
export KEY="sk-live-..."

SB=$(curl -sX POST https://api.perpetual.dev/v1/sandbox/create \
  -H "Authorization: Bearer $KEY" \
  -d '{"language": "python"}' | jq -r .sandbox_id)

sleep 3  # wait for container to start

curl -X POST https://api.perpetual.dev/v1/sandbox/$SB/run \
  -H "Authorization: Bearer $KEY" \
  -d '{"code": "print(2**32)"}'
# → { "stdout": "4294967296\n", "exit_code": 0, "duration_secs": 1 }

curl -X DELETE https://api.perpetual.dev/v1/sandbox/$SB \
  -H "Authorization: Bearer $KEY"
```

## Step 3 — Python SDK (easier)

```bash
pip install perpetual
```

```python
from perpetual import Perpetual
client = Perpetual(api_key="sk-live-...")

# Run code — no manual lifecycle management needed
result = client.sandbox.run_once("python", "import math; print(math.tau)")
print(result.stdout)   # 6.283185307179586

# Ask 6 specialized AI agents to design a system
session = client.council.run_and_wait(
    "Design a rate limiter for a multi-tenant SaaS API",
    context={"language": "python", "scale": "10k req/s"}
)
print(session.result["synthesis"])

# Persist agent memory between runs
client.memory.set("architect", "rate-limiter-plan", {"algo": "token-bucket"})
plan = client.memory.get("architect", "rate-limiter-plan")

# Register hourly monitoring
loop = client.loops.create("prod-monitor", interval_secs=3600)
client.loops.trigger(loop.loop_id)  # run now
```

## Step 4 — Node.js SDK

```bash
npm install perpetual
```

```typescript
import { Perpetual } from 'perpetual';
const client = new Perpetual({ apiKey: 'sk-live-...' });

const result = await client.sandbox.runOnce('nodejs', 'console.log(process.version)');

const session = await client.council.runAndWait({
  task: 'Build a JWT auth system with refresh tokens',
  context: { framework: 'NestJS' }
});
console.log(session.result?.synthesis);
```

## Common Patterns

### CI/CD code verification
```python
result = client.sandbox.run_once("bash", "python -m pytest tests/ -q", timeout_secs=300)
if result.exit_code != 0:
    print("Tests failed:", result.stderr)
```

### AI agent with persistent memory
```python
# Read last context
try:
    ctx = client.memory.get("my-agent", "context")
    prev = ctx.value
except:
    prev = {}

# Work... then save state
client.memory.set("my-agent", "context", {"last_run": "2026-05-21", "tasks": 42})
client.memory.log_event("my-agent", "checkpoint", {"completed": True})
```

### Council → execute pattern
```python
# Council designs the code
session = client.council.run_and_wait("Write a Python BTC price tracker")
code = session.result["synthesis"]  # contains actual Python code

# Execute in sandbox
result = client.sandbox.run_once("python", code)
print(result.stdout)
```

## Pricing

- **100 free seconds / day** per user
- **$0.001 / second** after free tier
- Top up: `POST /v1/billing/checkout` with `{"amount_usd": 10}`

## Full API Reference

See [`openapi.yaml`](openapi.yaml) for the complete OpenAPI 3.1 specification.
