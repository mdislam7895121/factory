import type { HttpClient } from '../client.js';
import type { UsageToday, UsageSummary } from '../types.js';

export class UsageResource {
  constructor(private readonly http: HttpClient) {}

  today(): Promise<UsageToday> {
    return this.http.get('/v1/usage/today');
  }

  summary(): Promise<UsageSummary> {
    return this.http.get('/v1/usage/summary');
  }
}
