import { Injectable } from '@nestjs/common';
import {
  ComponentStatus,
  HealthSnapshot,
  OverallStatus,
  PublicStatusResponse,
  StatusComponent,
} from './public-status.types';

const CACHE_TTL_MS = 30_000;

@Injectable()
export class PublicStatusService {
  private cachedResponse: PublicStatusResponse | null = null;
  private cacheExpiresAt = 0;

  private incidentMessage: string | undefined = undefined;

  setIncidentMessage(msg: string | undefined): void {
    this.incidentMessage = msg;
    this.invalidateCache();
  }

  getIncidentMessage(): string | undefined {
    return this.incidentMessage;
  }

  invalidateCache(): void {
    this.cacheExpiresAt = 0;
  }

  async getStatus(healthSnapshot?: HealthSnapshot): Promise<PublicStatusResponse> {
    const now = Date.now();
    if (this.cachedResponse && now < this.cacheExpiresAt && !healthSnapshot) {
      return this.cachedResponse;
    }

    const components = this.buildComponents(healthSnapshot);
    const overall    = this.deriveOverall(components);

    const response: PublicStatusResponse = {
      status:    overall,
      timestamp: new Date().toISOString(),
      components,
      ...(this.incidentMessage ? { incidentMessage: this.incidentMessage } : {}),
    };

    if (!healthSnapshot) {
      this.cachedResponse   = response;
      this.cacheExpiresAt   = now + CACHE_TTL_MS;
    }

    return response;
  }

  private buildComponents(snap?: HealthSnapshot): StatusComponent[] {
    const components: StatusComponent[] = [
      {
        name:   'api',
        status: snap ? (snap.ok ? 'ok' : 'degraded') : 'ok',
      },
      {
        name:   'database',
        status: snap ? (snap.db?.ok ? 'ok' : 'down') : 'ok',
      },
      {
        name:   'cache',
        status: snap ? (snap.redis?.ok ? 'ok' : 'degraded') : 'ok',
      },
      {
        name:   'frontend',
        status: 'ok',
      },
    ];
    return components;
  }

  private deriveOverall(components: StatusComponent[]): OverallStatus {
    const statuses = components.map(c => c.status);
    if (statuses.some(s => s === 'down'))     return 'outage';
    if (statuses.some(s => s === 'degraded')) return 'degraded';
    return 'ok';
  }

  buildFromHealthData(raw: Record<string, unknown>): HealthSnapshot {
    return {
      ok:        raw['ok'] === true,
      db:        { ok: (raw['db'] as { ok: boolean } | undefined)?.ok === true },
      redis:     { ok: (raw['redis'] as { ok: boolean } | undefined)?.ok === true },
      timestamp: (raw['timestamp'] as string | undefined) ?? new Date().toISOString(),
    };
  }
}
