import type { HttpClient } from '../client.js';
import type { CouncilSession, CouncilMessage } from '../types.js';

export class CouncilResource {
  constructor(private readonly http: HttpClient) {}

  run(opts: { task: string; context?: Record<string, unknown> }): Promise<{ session_id: string; status: string; task: string; created_at: string }> {
    return this.http.post('/v1/council/run', opts);
  }

  list(opts?: { limit?: number }): Promise<{ session_id: string; task: string; status: string; created_at: string }[]> {
    const qs = opts?.limit ? `?limit=${opts.limit}` : '';
    return this.http.get(`/v1/council${qs}`);
  }

  get(sessionId: string): Promise<CouncilSession> {
    return this.http.get(`/v1/council/${sessionId}`);
  }

  messages(sessionId: string): Promise<{ session_id: string; messages: CouncilMessage[] }> {
    return this.http.get(`/v1/council/${sessionId}/messages`);
  }

  /** Poll until the session reaches a terminal state. */
  async wait(
    sessionId: string,
    opts?: { pollMs?: number; timeoutMs?: number },
  ): Promise<CouncilSession> {
    const pollMs = opts?.pollMs ?? 3000;
    const timeoutMs = opts?.timeoutMs ?? 300_000; // 5 min default
    const deadline = Date.now() + timeoutMs;

    while (Date.now() < deadline) {
      const session = await this.get(sessionId);
      if (session.status === 'completed' || session.status === 'failed') {
        return session;
      }
      await sleep(pollMs);
    }
    throw new Error(`Council session ${sessionId} did not complete within ${timeoutMs}ms`);
  }

  /** run() + wait() in one call */
  async runAndWait(
    opts: { task: string; context?: Record<string, unknown> },
    waitOpts?: { pollMs?: number; timeoutMs?: number },
  ): Promise<CouncilSession> {
    const { session_id } = await this.run(opts);
    return this.wait(session_id, waitOpts);
  }
}

function sleep(ms: number) { return new Promise((r) => setTimeout(r, ms)); }
