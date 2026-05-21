import type { HttpClient } from '../client.js';
import type { MemoryEntry, MemoryKeyList } from '../types.js';

export class MemoryResource {
  constructor(private readonly http: HttpClient) {}

  set(namespace: string, key: string, value: unknown, opts?: { ttl_secs?: number }): Promise<{ id: string; namespace: string; key: string; expires_at: string | null }> {
    return this.http.put(`/v1/memory/${enc(namespace)}/${enc(key)}`, { value, ...opts });
  }

  get(namespace: string, key: string): Promise<MemoryEntry> {
    return this.http.get(`/v1/memory/${enc(namespace)}/${enc(key)}`);
  }

  list(namespace: string): Promise<MemoryKeyList> {
    return this.http.get(`/v1/memory/${enc(namespace)}`);
  }

  delete(namespace: string, key: string): Promise<{ deleted: boolean }> {
    return this.http.delete(`/v1/memory/${enc(namespace)}/${enc(key)}`);
  }

  clear(namespace: string): Promise<{ deleted_count: number }> {
    return this.http.delete(`/v1/memory/${enc(namespace)}`);
  }

  logEvent(namespace: string, eventType: string, payload: unknown): Promise<{ id: string; event_type: string; created_at: string }> {
    return this.http.post(`/v1/memory/${enc(namespace)}/events`, { event_type: eventType, payload });
  }

  events(namespace: string, opts?: { limit?: number; before?: string }): Promise<{ namespace: string; events: { id: string; event_type: string; payload: unknown; created_at: string }[]; has_more: boolean }> {
    const params = new URLSearchParams();
    if (opts?.limit) params.set('limit', String(opts.limit));
    if (opts?.before) params.set('before', opts.before);
    const qs = params.toString();
    return this.http.get(`/v1/memory/${enc(namespace)}/events${qs ? `?${qs}` : ''}`);
  }
}

function enc(s: string) { return encodeURIComponent(s); }
