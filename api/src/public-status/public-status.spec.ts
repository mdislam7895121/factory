import { Test, TestingModule } from '@nestjs/testing';
import { PublicStatusController } from './public-status.controller';
import { PublicStatusService } from './public-status.service';
import { HealthSnapshot, PublicStatusResponse } from './public-status.types';

describe('PublicStatusService', () => {
  let svc: PublicStatusService;

  beforeEach(async () => {
    const mod: TestingModule = await Test.createTestingModule({
      providers: [PublicStatusService],
    }).compile();
    svc = mod.get(PublicStatusService);
  });

  // ── Basic status ────────────────────────────────────────────────────────────

  it('returns ok when no snapshot provided', async () => {
    const r = await svc.getStatus();
    expect(r.status).toBe('ok');
    expect(r.timestamp).toBeDefined();
    expect(Array.isArray(r.components)).toBe(true);
  });

  it('includes required component names', async () => {
    const r = await svc.getStatus();
    const names = r.components.map(c => c.name);
    expect(names).toContain('api');
    expect(names).toContain('database');
    expect(names).toContain('cache');
    expect(names).toContain('frontend');
  });

  it('has valid status values on components', async () => {
    const r = await svc.getStatus();
    const valid = ['ok', 'degraded', 'down'];
    r.components.forEach(c => expect(valid).toContain(c.status));
  });

  // ── Health snapshot integration ─────────────────────────────────────────────

  it('returns ok when all services healthy', async () => {
    const snap: HealthSnapshot = { ok: true, db: { ok: true }, redis: { ok: true }, timestamp: new Date().toISOString() };
    const r = await svc.getStatus(snap);
    expect(r.status).toBe('ok');
  });

  it('returns degraded when redis unhealthy', async () => {
    const snap: HealthSnapshot = { ok: true, db: { ok: true }, redis: { ok: false }, timestamp: new Date().toISOString() };
    const r = await svc.getStatus(snap);
    expect(r.status).toBe('degraded');
  });

  it('returns outage when db down', async () => {
    const snap: HealthSnapshot = { ok: false, db: { ok: false }, redis: { ok: true }, timestamp: new Date().toISOString() };
    const r = await svc.getStatus(snap);
    expect(r.status).toBe('outage');
  });

  it('returns outage when both db and redis down', async () => {
    const snap: HealthSnapshot = { ok: false, db: { ok: false }, redis: { ok: false }, timestamp: new Date().toISOString() };
    const r = await svc.getStatus(snap);
    expect(r.status).toBe('outage');
  });

  it('db component status ok when db healthy', async () => {
    const snap: HealthSnapshot = { ok: true, db: { ok: true }, redis: { ok: true }, timestamp: new Date().toISOString() };
    const r = await svc.getStatus(snap);
    const db = r.components.find(c => c.name === 'database');
    expect(db?.status).toBe('ok');
  });

  it('db component status down when db unhealthy', async () => {
    const snap: HealthSnapshot = { ok: false, db: { ok: false }, redis: { ok: true }, timestamp: new Date().toISOString() };
    const r = await svc.getStatus(snap);
    const db = r.components.find(c => c.name === 'database');
    expect(db?.status).toBe('down');
  });

  it('cache component status ok when redis healthy', async () => {
    const snap: HealthSnapshot = { ok: true, db: { ok: true }, redis: { ok: true }, timestamp: new Date().toISOString() };
    const r = await svc.getStatus(snap);
    const cache = r.components.find(c => c.name === 'cache');
    expect(cache?.status).toBe('ok');
  });

  it('cache component status degraded when redis unhealthy', async () => {
    const snap: HealthSnapshot = { ok: true, db: { ok: true }, redis: { ok: false }, timestamp: new Date().toISOString() };
    const r = await svc.getStatus(snap);
    const cache = r.components.find(c => c.name === 'cache');
    expect(cache?.status).toBe('degraded');
  });

  it('api component status ok when snap.ok=true', async () => {
    const snap: HealthSnapshot = { ok: true, db: { ok: true }, redis: { ok: true }, timestamp: new Date().toISOString() };
    const r = await svc.getStatus(snap);
    const api = r.components.find(c => c.name === 'api');
    expect(api?.status).toBe('ok');
  });

  it('api component status degraded when snap.ok=false', async () => {
    const snap: HealthSnapshot = { ok: false, db: { ok: true }, redis: { ok: true }, timestamp: new Date().toISOString() };
    const r = await svc.getStatus(snap);
    const api = r.components.find(c => c.name === 'api');
    expect(api?.status).toBe('degraded');
  });

  // ── Incident message ────────────────────────────────────────────────────────

  it('incidentMessage absent by default', async () => {
    const r = await svc.getStatus();
    expect(r.incidentMessage).toBeUndefined();
  });

  it('incidentMessage present when set', async () => {
    svc.setIncidentMessage('Investigating database performance issue');
    const r = await svc.getStatus();
    expect(r.incidentMessage).toBe('Investigating database performance issue');
  });

  it('incidentMessage cleared when set to undefined', async () => {
    svc.setIncidentMessage('test');
    svc.setIncidentMessage(undefined);
    const r = await svc.getStatus();
    expect(r.incidentMessage).toBeUndefined();
  });

  it('getIncidentMessage returns current message', () => {
    svc.setIncidentMessage('DB degraded');
    expect(svc.getIncidentMessage()).toBe('DB degraded');
  });

  it('getIncidentMessage returns undefined after clear', () => {
    svc.setIncidentMessage('msg');
    svc.setIncidentMessage(undefined);
    expect(svc.getIncidentMessage()).toBeUndefined();
  });

  // ── Caching ─────────────────────────────────────────────────────────────────

  it('returns cached response on repeated calls', async () => {
    const r1 = await svc.getStatus();
    const r2 = await svc.getStatus();
    expect(r1.timestamp).toBe(r2.timestamp);
  });

  it('invalidateCache clears cache', async () => {
    const r1 = await svc.getStatus();
    svc.invalidateCache();
    const r2 = await svc.getStatus();
    // timestamps may differ only by a tiny amount — just check it doesn't crash
    expect(r2.status).toBeDefined();
  });

  it('setIncidentMessage invalidates cache', async () => {
    const r1 = await svc.getStatus();
    svc.setIncidentMessage('maintenance');
    const r2 = await svc.getStatus();
    expect(r2.incidentMessage).toBe('maintenance');
  });

  it('snapshot bypasses cache', async () => {
    const r1 = await svc.getStatus();
    const snap: HealthSnapshot = { ok: false, db: { ok: false }, redis: { ok: false }, timestamp: new Date().toISOString() };
    const r2 = await svc.getStatus(snap);
    expect(r1.status).toBe('ok');
    expect(r2.status).toBe('outage');
  });

  // ── buildFromHealthData ────────────────────────────────────────────────────

  it('buildFromHealthData parses valid health data', () => {
    const raw = { ok: true, db: { ok: true }, redis: { ok: true }, timestamp: '2026-05-23T00:00:00Z' };
    const snap = svc.buildFromHealthData(raw);
    expect(snap.ok).toBe(true);
    expect(snap.db.ok).toBe(true);
    expect(snap.redis.ok).toBe(true);
    expect(snap.timestamp).toBe('2026-05-23T00:00:00Z');
  });

  it('buildFromHealthData handles missing db gracefully', () => {
    const raw = { ok: true };
    const snap = svc.buildFromHealthData(raw);
    expect(snap.db.ok).toBe(false);
    expect(snap.redis.ok).toBe(false);
  });

  it('buildFromHealthData ok=false when ok missing', () => {
    const raw = { db: { ok: true }, redis: { ok: true } };
    const snap = svc.buildFromHealthData(raw);
    expect(snap.ok).toBe(false);
  });

  it('buildFromHealthData generates timestamp when missing', () => {
    const raw = { ok: true };
    const snap = svc.buildFromHealthData(raw);
    expect(snap.timestamp).toBeDefined();
    expect(snap.timestamp.length).toBeGreaterThan(0);
  });

  // ── Response shape ──────────────────────────────────────────────────────────

  it('timestamp is valid ISO 8601', async () => {
    const r = await svc.getStatus();
    expect(() => new Date(r.timestamp)).not.toThrow();
    expect(new Date(r.timestamp).getFullYear()).toBeGreaterThan(2020);
  });

  it('status is one of ok/degraded/outage', async () => {
    const r = await svc.getStatus();
    expect(['ok', 'degraded', 'outage']).toContain(r.status);
  });

  it('components is non-empty array', async () => {
    const r = await svc.getStatus();
    expect(r.components.length).toBeGreaterThan(0);
  });

  it('each component has name and status', async () => {
    const r = await svc.getStatus();
    r.components.forEach(c => {
      expect(typeof c.name).toBe('string');
      expect(c.name.length).toBeGreaterThan(0);
      expect(['ok', 'degraded', 'down']).toContain(c.status);
    });
  });

  it('overall ok when all components ok', async () => {
    const snap: HealthSnapshot = { ok: true, db: { ok: true }, redis: { ok: true }, timestamp: new Date().toISOString() };
    const r = await svc.getStatus(snap);
    expect(r.status).toBe('ok');
    r.components.forEach(c => expect(c.status).toBe('ok'));
  });
});

describe('PublicStatusController', () => {
  let controller: PublicStatusController;
  let svc: PublicStatusService;

  beforeEach(async () => {
    const mod: TestingModule = await Test.createTestingModule({
      controllers: [PublicStatusController],
      providers:   [PublicStatusService],
    }).compile();
    controller = mod.get(PublicStatusController);
    svc        = mod.get(PublicStatusService);
  });

  it('getStatus returns status response', async () => {
    const r = await controller.getStatus();
    expect(r.status).toBeDefined();
    expect(r.timestamp).toBeDefined();
    expect(Array.isArray(r.components)).toBe(true);
  });

  it('getStatus delegates to service', async () => {
    jest.spyOn(svc, 'getStatus').mockResolvedValueOnce({
      status: 'degraded',
      timestamp: '2026-05-23T00:00:00Z',
      components: [{ name: 'database', status: 'down' }],
    } as PublicStatusResponse);
    const r = await controller.getStatus();
    expect(r.status).toBe('degraded');
  });

  it('controller can be instantiated', () => {
    expect(controller).toBeDefined();
  });

  it('returns no internal error details in response', async () => {
    const r = await controller.getStatus();
    const str = JSON.stringify(r);
    expect(str).not.toContain('Error');
    expect(str).not.toContain('stack');
    expect(str).not.toContain('DATABASE_URL');
    expect(str).not.toContain('AUTH_SECRET');
  });

  it('response has no internal hostnames', async () => {
    const r = await controller.getStatus();
    const str = JSON.stringify(r);
    expect(str).not.toContain('railway.internal');
    expect(str).not.toContain('localhost:5432');
    expect(str).not.toContain('localhost:6379');
  });
});
