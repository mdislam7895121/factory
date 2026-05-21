import type { HttpClient } from '../client.js';
import type { Sandbox, RunResult } from '../types.js';

export class SandboxResource {
  constructor(private readonly http: HttpClient) {}

  create(opts: { language: 'python' | 'nodejs' | 'bash'; timeout_secs?: number }): Promise<Sandbox> {
    return this.http.post('/v1/sandbox/create', opts);
  }

  get(sandboxId: string): Promise<Sandbox> {
    return this.http.get(`/v1/sandbox/${sandboxId}`);
  }

  run(sandboxId: string, opts: { code: string }): Promise<RunResult> {
    return this.http.post(`/v1/sandbox/${sandboxId}/run`, opts);
  }

  terminate(sandboxId: string): Promise<{ status: string }> {
    return this.http.delete(`/v1/sandbox/${sandboxId}`);
  }

  /** Convenience: create a sandbox, run code, terminate — returns the run result. */
  async runOnce(
    language: 'python' | 'nodejs' | 'bash',
    code: string,
    opts?: { timeout_secs?: number; waitMs?: number },
  ): Promise<RunResult> {
    const sb = await this.create({ language, timeout_secs: opts?.timeout_secs });

    // Poll until READY
    const waitMs = opts?.waitMs ?? 15_000;
    const deadline = Date.now() + waitMs;
    let current = sb;
    while (current.status === 'creating' && Date.now() < deadline) {
      await sleep(500);
      current = await this.get(sb.sandbox_id);
    }

    if (current.status !== 'ready') {
      await this.terminate(sb.sandbox_id).catch(() => {});
      throw new Error(`Sandbox failed to start (status=${current.status})`);
    }

    try {
      return await this.run(sb.sandbox_id, { code });
    } finally {
      await this.terminate(sb.sandbox_id).catch(() => {});
    }
  }
}

function sleep(ms: number) { return new Promise((r) => setTimeout(r, ms)); }
