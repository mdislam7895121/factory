import type { HttpClient } from '../client.js';
import type { ApiKey } from '../types.js';

export class ApiKeysResource {
  constructor(private readonly http: HttpClient) {}

  create(opts: { name: string }): Promise<ApiKey & { key: string }> {
    return this.http.post('/v1/api-keys', opts);
  }

  list(): Promise<Omit<ApiKey, 'key'>[]> {
    return this.http.get('/v1/api-keys');
  }

  revoke(keyId: string): Promise<{ success: boolean }> {
    return this.http.delete(`/v1/api-keys/${keyId}`);
  }
}
