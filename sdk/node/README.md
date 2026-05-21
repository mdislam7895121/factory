# perpetual · Node.js SDK

Official TypeScript/JavaScript SDK for the [Perpetual Sandbox Engine](https://perpetual.dev).

## Install

```bash
npm install perpetual
```

Zero dependencies. Requires Node.js 18+.

## Usage

```typescript
import { Perpetual } from 'perpetual';

const client = new Perpetual({ apiKey: 'sk-live-...' });

// ── Sandbox ──────────────────────────────────────────────

// One-shot: create → wait-until-ready → run → terminate
const result = await client.sandbox.runOnce('python', 'print(2 ** 32)');
console.log(result.stdout);    // 4294967296
console.log(result.exit_code); // 0

// Manual control
const sb = await client.sandbox.create({ language: 'nodejs', timeout_secs: 60 });
const out = await client.sandbox.run(sb.sandbox_id, { code: "console.log('hi')" });
await client.sandbox.terminate(sb.sandbox_id);

// ── Agent Memory ─────────────────────────────────────────

await client.memory.set('architect', 'current-plan', { steps: [1, 2, 3] });
await client.memory.set('shared', 'state', { phase: 'dev' }, { ttl_secs: 3600 });

const entry = await client.memory.get('architect', 'current-plan');
console.log(entry.value); // { steps: [1, 2, 3] }

const keys = await client.memory.list('architect');
console.log(keys.count);

await client.memory.logEvent('qa', 'decision', { verdict: 'approved' });
const events = await client.memory.events('qa', { limit: 10 });

// ── Agent Council ─────────────────────────────────────────

// Async: returns session_id immediately
const { session_id } = await client.council.run({
  task: 'Design a JWT auth system',
});

// Poll until done
const session = await client.council.wait(session_id, { timeoutMs: 300_000 });

// Or: run + wait in one call
const completed = await client.council.runAndWait({
  task: 'Implement a Redis-backed rate limiter',
  context: { language: 'typescript', framework: 'NestJS' },
});

if (completed.status === 'completed') {
  console.log(completed.result?.synthesis);
}

// ── Continuous Loops ──────────────────────────────────────

const loop = await client.loops.create({
  name: 'production-monitor',
  interval_secs: 3600,
  context: { project: 'my-api' },
  webhook_url: 'https://hooks.slack.com/your-webhook',
});

await client.loops.trigger(loop.loop_id);
const runs = await client.loops.runs(loop.loop_id, { limit: 5 });

await client.loops.pause(loop.loop_id);
await client.loops.resume(loop.loop_id);

// ── API Keys ─────────────────────────────────────────────

const key = await client.apiKeys.create({ name: 'ci-runner' });
console.log(key.key); // sk-live-... (shown once)
const keys = await client.apiKeys.list();
await client.apiKeys.revoke(key.id);

// ── Usage ─────────────────────────────────────────────────

const today = await client.usage.today();
console.log(`Used ${today.used_secs}s, $${today.billed_amount_usd} billed`);
const summary = await client.usage.summary();
```

## Error Handling

```typescript
import { Perpetual, PerpetualError } from 'perpetual';

try {
  await client.sandbox.run('bad-id', { code: 'print("hi")' });
} catch (e) {
  if (e instanceof PerpetualError) {
    console.log(e.statusCode); // 404
    console.log(e.message);    // "Sandbox not found"
  }
}
```

## Configuration

```typescript
const client = new Perpetual({
  apiKey: 'sk-live-...',
  baseUrl: 'http://localhost:4000', // self-hosted
  timeoutMs: 60_000,
});
```

## License

MIT
