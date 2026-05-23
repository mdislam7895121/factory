export type ComponentStatus = 'ok' | 'degraded' | 'down';
export type OverallStatus  = 'ok' | 'degraded' | 'outage';

export interface StatusComponent {
  name:   string;
  status: ComponentStatus;
  latencyMs?: number;
}

export interface PublicStatusResponse {
  status:     OverallStatus;
  timestamp:  string;
  components: StatusComponent[];
  incidentMessage?: string;
}

export interface HealthSnapshot {
  ok:        boolean;
  db:        { ok: boolean };
  redis:     { ok: boolean };
  timestamp: string;
}
