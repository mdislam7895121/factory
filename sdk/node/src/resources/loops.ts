import type { HttpClient } from '../client.js';
import type { LoopConfig, LoopRun } from '../types.js';

export class LoopsResource {
  constructor(private readonly http: HttpClient) {}

  create(opts: {
    name: string;
    description?: string;
    interval_secs?: number;
    context?: Record<string, unknown>;
    webhook_url?: string;
  }): Promise<LoopConfig> {
    return this.http.post('/v1/loops', opts);
  }

  list(): Promise<LoopConfig[]> {
    return this.http.get('/v1/loops');
  }

  get(loopId: string): Promise<LoopConfig> {
    return this.http.get(`/v1/loops/${loopId}`);
  }

  pause(loopId: string): Promise<{ loop_id: string; status: string }> {
    return this.http.patch(`/v1/loops/${loopId}/pause`);
  }

  resume(loopId: string): Promise<{ loop_id: string; status: string; next_run_at: string }> {
    return this.http.patch(`/v1/loops/${loopId}/resume`);
  }

  trigger(loopId: string): Promise<{ run_id: string; loop_id: string; status: string }> {
    return this.http.post(`/v1/loops/${loopId}/trigger`);
  }

  runs(loopId: string, opts?: { limit?: number }): Promise<LoopRun[]> {
    const qs = opts?.limit ? `?limit=${opts.limit}` : '';
    return this.http.get(`/v1/loops/${loopId}/runs${qs}`);
  }

  delete(loopId: string): Promise<{ deleted: boolean }> {
    return this.http.delete(`/v1/loops/${loopId}`);
  }
}
