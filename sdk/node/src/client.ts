import { PerpetualError, type PerpetualConfig } from './types.js';

const DEFAULT_BASE_URL = 'https://api.perpetual.dev';
const DEFAULT_TIMEOUT_MS = 30_000;

export class HttpClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeoutMs: number;

  constructor(config: PerpetualConfig) {
    if (!config.apiKey?.startsWith('sk-live-')) {
      throw new Error('apiKey must start with "sk-live-"');
    }
    this.apiKey = config.apiKey;
    this.baseUrl = (config.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, '');
    this.timeoutMs = config.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  }

  async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const init: RequestInit = {
      method,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'perpetual-node-sdk/1.0',
      },
      signal: AbortSignal.timeout(this.timeoutMs),
    };

    if (body !== undefined) {
      init.body = JSON.stringify(body);
    }

    const resp = await fetch(url, init);
    const text = await resp.text();

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { message: text };
    }

    if (!resp.ok) {
      const msg =
        typeof parsed === 'object' && parsed !== null && 'message' in parsed
          ? String((parsed as { message: unknown }).message)
          : `HTTP ${resp.status}`;
      throw new PerpetualError(msg, resp.status, parsed);
    }

    return parsed as T;
  }

  get<T>(path: string) { return this.request<T>('GET', path); }
  post<T>(path: string, body?: unknown) { return this.request<T>('POST', path, body); }
  put<T>(path: string, body?: unknown) { return this.request<T>('PUT', path, body); }
  delete<T>(path: string) { return this.request<T>('DELETE', path); }
  patch<T>(path: string, body?: unknown) { return this.request<T>('PATCH', path, body); }
}
