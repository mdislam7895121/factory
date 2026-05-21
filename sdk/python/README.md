# perpetual · Python SDK

Official Python SDK for the [Perpetual Sandbox Engine](https://perpetual.dev) — sandbox infrastructure for AI agents.

## Install

```bash
pip install perpetual
```

No external dependencies. Requires Python 3.10+.

## Usage

```python
from perpetual import Perpetual

client = Perpetual(api_key="sk-live-...")

# ── Sandbox ──────────────────────────────────────────────

# One-shot: create → run → terminate in one call
result = client.sandbox.run_once("python", "print(2 ** 32)")
print(result.stdout)   # 4294967296
print(result.exit_code) # 0

# Manual control
sb = client.sandbox.create("nodejs", timeout_secs=60)
result = client.sandbox.run(sb.sandbox_id, "console.log('hi')")
client.sandbox.terminate(sb.sandbox_id)

# ── Agent Memory ─────────────────────────────────────────

client.memory.set("architect", "current-plan", {"steps": [1, 2, 3]})
client.memory.set("shared", "project-state", {"phase": "dev"}, ttl_secs=3600)

entry = client.memory.get("architect", "current-plan")
print(entry.value)  # {"steps": [1, 2, 3]}

keys = client.memory.list("architect")
print(keys["count"])

client.memory.log_event("qa", "decision", {"verdict": "approved", "tests": 42})
events = client.memory.events("qa", limit=10)

# ── Agent Council ─────────────────────────────────────────

# Async: returns immediately
session = client.council.run("Design a JWT auth system")
print(session["session_id"])

# Sync: blocks until all 6 agents complete (up to 5 minutes)
session = client.council.run_and_wait(
    "Implement a Redis-backed rate limiter",
    context={"language": "python", "framework": "FastAPI"},
    timeout_secs=300,
)
if session.status == "completed":
    print(session.result["synthesis"])  # Architect's final answer
    print(session.result["plan"])       # Initial plan

# ── Continuous Loops ──────────────────────────────────────

loop = client.loops.create(
    "production-monitor",
    interval_secs=3600,  # run every hour
    context={"project": "my-api", "alert_on": ["errors", "billing_spikes"]},
    webhook_url="https://hooks.slack.com/your-webhook",
)

client.loops.trigger(loop.loop_id)  # run immediately
runs = client.loops.runs(loop.loop_id, limit=5)
for run in runs:
    print(f"{run.status}: found={run.issues_found} fixed={run.issues_fixed}")

client.loops.pause(loop.loop_id)
client.loops.resume(loop.loop_id)
```

## Error Handling

```python
from perpetual import Perpetual, PerpetualError

client = Perpetual(api_key="sk-live-...")

try:
    result = client.sandbox.run("bad-id", "print('hi')")
except PerpetualError as e:
    print(e.status_code)  # 404
    print(str(e))         # "Sandbox not found"
```

## Configuration

```python
client = Perpetual(
    api_key="sk-live-...",
    base_url="http://localhost:4000",  # self-hosted
    timeout=60,
)
```

## License

MIT
