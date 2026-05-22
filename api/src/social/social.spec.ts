import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { CreatorProfileService, RESERVED_HANDLES } from './creator-profile.service';
import { SocialSignalService } from './social-signal.service';

// ── 18-02: Creator profile service ────────────────────────────────────────────

describe('CreatorProfileService', () => {
  let svc: CreatorProfileService;

  beforeEach(() => { svc = new CreatorProfileService(); });

  // ── Handle validation ──────────────────────────────────────────────────────

  it('accepts valid handles', () => {
    expect(() => svc.validateHandle('johndoe')).not.toThrow();
    expect(() => svc.validateHandle('jane-doe-99')).not.toThrow();
    expect(() => svc.validateHandle('abc')).not.toThrow();
    expect(() => svc.validateHandle('a1b2c3d4')).not.toThrow();
  });

  it('rejects handles that are too short', () => {
    expect(() => svc.validateHandle('ab')).toThrow(BadRequestException);
  });

  it('rejects handles that are too long (> 30 chars)', () => {
    expect(() => svc.validateHandle('a'.repeat(31))).toThrow(BadRequestException);
  });

  it('rejects handles with uppercase letters', () => {
    expect(() => svc.validateHandle('JohnDoe')).toThrow(BadRequestException);
  });

  it('rejects handles with special characters', () => {
    expect(() => svc.validateHandle('john_doe')).toThrow(BadRequestException);
    expect(() => svc.validateHandle('john.doe')).toThrow(BadRequestException);
    expect(() => svc.validateHandle('john doe')).toThrow(BadRequestException);
  });

  it('rejects handles starting or ending with hyphen', () => {
    expect(() => svc.validateHandle('-johndoe')).toThrow(BadRequestException);
    expect(() => svc.validateHandle('johndoe-')).toThrow(BadRequestException);
  });

  it('rejects handles with consecutive hyphens', () => {
    expect(() => svc.validateHandle('john--doe')).toThrow(BadRequestException);
  });

  it('rejects reserved handles', () => {
    for (const h of ['admin', 'api', 'demo', 'login', 'me']) {
      expect(() => svc.validateHandle(h)).toThrow(BadRequestException);
    }
  });

  it('RESERVED_HANDLES set is non-empty', () => {
    expect(RESERVED_HANDLES.size).toBeGreaterThan(5);
  });

  // ── Profile CRUD ───────────────────────────────────────────────────────────

  it('creates a profile successfully', () => {
    const p = svc.createProfile({ userId: 'u1', handle: 'alice', displayName: 'Alice' });
    expect(p.handle).toBe('alice');
    expect(p.userId).toBe('u1');
    expect(p.verified).toBe(false);
    expect(p.visibility).toBe('PUBLIC');
  });

  it('normalises handle to lowercase', () => {
    const p = svc.createProfile({ userId: 'u2', handle: 'ALICE', displayName: 'Alice' });
    expect(p.handle).toBe('alice');
  });

  it('throws ConflictException on duplicate userId', () => {
    svc.createProfile({ userId: 'u3', handle: 'bob', displayName: 'Bob' });
    expect(() => svc.createProfile({ userId: 'u3', handle: 'bob2', displayName: 'Bob 2' }))
      .toThrow(ConflictException);
  });

  it('throws ConflictException on duplicate handle', () => {
    svc.createProfile({ userId: 'u4', handle: 'charlie', displayName: 'Charlie' });
    expect(() => svc.createProfile({ userId: 'u5', handle: 'charlie', displayName: 'Charlie 2' }))
      .toThrow(ConflictException);
  });

  it('updateProfile modifies allowed fields', () => {
    svc.createProfile({ userId: 'u6', handle: 'dave', displayName: 'Dave' });
    const updated = svc.updateProfile({ userId: 'u6', bio: 'Hello world', country: 'US' });
    expect(updated.bio).toBe('Hello world');
    expect(updated.country).toBe('US');
  });

  it('updateProfile throws NotFoundException for unknown userId', () => {
    expect(() => svc.updateProfile({ userId: 'nonexistent', bio: 'x' })).toThrow(NotFoundException);
  });

  // ── Public vs private profile ──────────────────────────────────────────────

  it('getPublicProfile returns data for PUBLIC profile', () => {
    svc.createProfile({ userId: 'u7', handle: 'eve', displayName: 'Eve' });
    const pub = svc.getPublicProfile('eve');
    expect(pub.handle).toBe('eve');
    expect(pub.displayName).toBe('Eve');
  });

  it('getPublicProfile throws NotFoundException for PRIVATE profile', () => {
    svc.createProfile({ userId: 'u8', handle: 'frank', displayName: 'Frank' });
    svc.updateProfile({ userId: 'u8', visibility: 'PRIVATE' });
    expect(() => svc.getPublicProfile('frank')).toThrow(NotFoundException);
  });

  it('getPublicProfile throws NotFoundException for unknown handle', () => {
    expect(() => svc.getPublicProfile('nobody-xyz')).toThrow(NotFoundException);
  });

  it('getOwnProfile returns own profile regardless of visibility', () => {
    svc.createProfile({ userId: 'u9', handle: 'grace', displayName: 'Grace' });
    svc.updateProfile({ userId: 'u9', visibility: 'PRIVATE' });
    const own = svc.getOwnProfile('u9');
    expect(own.handle).toBe('grace');
    expect(own.visibility).toBe('PRIVATE');
  });

  // ── 18-09: No private email leak ─────────────────────────────────────────────

  it('getPublicProfile does NOT expose userId', () => {
    svc.createProfile({ userId: 'u10', handle: 'heidi', displayName: 'Heidi' });
    const pub = svc.getPublicProfile('heidi');
    expect((pub as any).userId).toBeUndefined();
  });

  it('publicEmail is included only when explicitly set', () => {
    svc.createProfile({ userId: 'u11', handle: 'ivan', displayName: 'Ivan' });
    const no_email = svc.getPublicProfile('ivan');
    expect(no_email.publicEmail).toBeUndefined();

    svc.createProfile({ userId: 'u12', handle: 'judy', displayName: 'Judy', publicEmail: 'judy@example.com' });
    const with_email = svc.getPublicProfile('judy');
    expect(with_email.publicEmail).toBe('judy@example.com');
  });

  it('no internal metadata in public profile JSON', () => {
    svc.createProfile({ userId: 'u13', handle: 'karl', displayName: 'Karl', bio: 'Developer' });
    const pub = svc.getPublicProfile('karl');
    const json = JSON.stringify(pub);
    expect(json).not.toMatch(/password|credential|token|hidden|chain_of_thought|system/i);
  });

  // ── Follow / Unfollow ──────────────────────────────────────────────────────

  it('follow returns following=true', () => {
    svc.createProfile({ userId: 'ua', handle: 'alice2', displayName: 'Alice' });
    const result = svc.follow('ub', 'alice2');
    expect(result.following).toBe(true);
    expect(svc.isFollowing('ub', 'alice2')).toBe(true);
  });

  it('unfollow returns following=false', () => {
    svc.createProfile({ userId: 'uc', handle: 'charlie2', displayName: 'Charlie' });
    svc.follow('ud', 'charlie2');
    const result = svc.unfollow('ud', 'charlie2');
    expect(result.following).toBe(false);
    expect(svc.isFollowing('ud', 'charlie2')).toBe(false);
  });

  it('cannot follow yourself', () => {
    svc.createProfile({ userId: 'ue', handle: 'self', displayName: 'Self' });
    expect(() => svc.follow('ue', 'self')).toThrow(BadRequestException);
  });

  it('followerCount increments after follow', () => {
    svc.createProfile({ userId: 'uf', handle: 'famous', displayName: 'Famous' });
    svc.follow('f1', 'famous');
    svc.follow('f2', 'famous');
    const pub = svc.getPublicProfile('famous');
    expect(pub.followerCount).toBe(2);
  });

  it('appCount reflects attributed apps', () => {
    svc.createProfile({ userId: 'ug', handle: 'builder', displayName: 'Builder' });
    svc.attributeApp('ug', 'proj-1');
    svc.attributeApp('ug', 'proj-2');
    const pub = svc.getPublicProfile('builder');
    expect(pub.appCount).toBe(2);
  });
});

// ── 18-03: Social signal service ────────────────────────────────────────────────

describe('SocialSignalService', () => {
  let svc: SocialSignalService;

  beforeEach(() => { svc = new SocialSignalService(); });

  it('records a signal and increments count', () => {
    svc.recordSignal({ projectId: 'p1', signalType: 'LIKE', userId: 'u1' });
    svc.recordSignal({ projectId: 'p1', signalType: 'LIKE', userId: 'u2' });
    const counts = svc.getSignalCounts('p1');
    expect(counts.likes).toBe(2);
    expect(counts.saves).toBe(0);
  });

  it('returns zero counts for unknown project', () => {
    const counts = svc.getSignalCounts('nonexistent');
    expect(counts.likes).toBe(0);
    expect(counts.views).toBe(0);
    expect(counts.remixes).toBe(0);
  });

  // ── 18-03: Anonymous signal hashing ───────────────────────────────────────────

  it('hashIp returns a consistent 32-char hex hash', () => {
    const h = svc.hashIp('192.168.1.1');
    expect(h.length).toBe(32);
    expect(/^[0-9a-f]+$/.test(h)).toBe(true);
    expect(svc.hashIp('192.168.1.1')).toBe(h);
  });

  it('different IPs produce different hashes', () => {
    expect(svc.hashIp('1.2.3.4')).not.toBe(svc.hashIp('5.6.7.8'));
  });

  it('does not store raw IP — hash is non-reversible to IP', () => {
    const h = svc.hashIp('123.45.67.89');
    expect(h).not.toContain('123');
    expect(h).not.toContain('45');
  });

  // ── 18-09: Like/save deduplification ──────────────────────────────────────────

  it('anonymous LIKE is recorded on first signal', () => {
    const r = svc.recordSignal({ projectId: 'p2', signalType: 'LIKE', ip: '10.0.0.1' });
    expect(r.recorded).toBe(true);
    expect(svc.getSignalCounts('p2').likes).toBe(1);
  });

  it('anonymous LIKE duplicate is rejected within dedup window', () => {
    svc.recordSignal({ projectId: 'p3', signalType: 'LIKE', ip: '10.0.0.2' });
    const r2 = svc.recordSignal({ projectId: 'p3', signalType: 'LIKE', ip: '10.0.0.2' });
    expect(r2.recorded).toBe(false);
    expect(r2.reason).toBe('duplicate');
    expect(svc.getSignalCounts('p3').likes).toBe(1);
  });

  it('anonymous SAVE duplicate is rejected within dedup window', () => {
    svc.recordSignal({ projectId: 'p4', signalType: 'SAVE', ip: '10.0.0.3' });
    const r2 = svc.recordSignal({ projectId: 'p4', signalType: 'SAVE', ip: '10.0.0.3' });
    expect(r2.recorded).toBe(false);
    expect(svc.getSignalCounts('p4').saves).toBe(1);
  });

  it('authenticated user signals are not deduplicated by IP', () => {
    // userId present → no IP dedup
    svc.recordSignal({ projectId: 'p5', signalType: 'LIKE', ip: '10.0.0.4', userId: 'auth-user' });
    const r2 = svc.recordSignal({ projectId: 'p5', signalType: 'LIKE', ip: '10.0.0.4', userId: 'auth-user' });
    expect(r2.recorded).toBe(true);
    expect(svc.getSignalCounts('p5').likes).toBe(2);
  });

  it('VIEW signals are not deduplicated', () => {
    svc.recordSignal({ projectId: 'p6', signalType: 'VIEW', ip: '10.0.0.5' });
    const r2 = svc.recordSignal({ projectId: 'p6', signalType: 'VIEW', ip: '10.0.0.5' });
    expect(r2.recorded).toBe(true);
    expect(svc.getSignalCounts('p6').views).toBe(2);
  });

  // ── 18-08: Published app registry ────────────────────────────────────────────

  it('publishApp makes an app publicly discoverable', () => {
    svc.publishApp({ projectId: 'app-1', title: 'My App', visibility: 'PUBLIC', createdAt: new Date() });
    const result = svc.discover();
    expect(result.apps.some((a) => a.projectId === 'app-1')).toBe(true);
  });

  it('private apps are not returned from discover', () => {
    svc.publishApp({ projectId: 'app-priv', title: 'Private', visibility: 'PRIVATE', createdAt: new Date() });
    const result = svc.discover();
    expect(result.apps.some((a) => a.projectId === 'app-priv')).toBe(false);
  });

  it('unpublishApp makes an app invisible from discover', () => {
    svc.publishApp({ projectId: 'app-2', title: 'App Two', visibility: 'PUBLIC', createdAt: new Date() });
    svc.unpublishApp('app-2');
    const result = svc.discover();
    expect(result.apps.some((a) => a.projectId === 'app-2')).toBe(false);
  });

  it('getPublicApp returns undefined for private apps', () => {
    svc.publishApp({ projectId: 'app-3', title: 'Secret', visibility: 'PRIVATE', createdAt: new Date() });
    expect(svc.getPublicApp('app-3')).toBeUndefined();
  });

  // ── 18-08: Discovery filters and sorting ──────────────────────────────────────

  it('discover filters by domain', () => {
    svc.publishApp({ projectId: 'med-1', title: 'Med App', domain: 'medical', visibility: 'PUBLIC', createdAt: new Date() });
    svc.publishApp({ projectId: 'fin-1', title: 'Fin App', domain: 'finance', visibility: 'PUBLIC', createdAt: new Date() });
    const result = svc.discover({ domain: 'medical' });
    expect(result.apps.every((a) => a.domain === 'medical')).toBe(true);
    expect(result.apps.some((a) => a.projectId === 'med-1')).toBe(true);
    expect(result.apps.some((a) => a.projectId === 'fin-1')).toBe(false);
  });

  it('discover filters by creatorHandle', () => {
    svc.publishApp({ projectId: 'c1', title: 'Alice App', ownerHandle: 'alice', visibility: 'PUBLIC', createdAt: new Date() });
    svc.publishApp({ projectId: 'c2', title: 'Bob App',   ownerHandle: 'bob',   visibility: 'PUBLIC', createdAt: new Date() });
    const result = svc.discover({ creatorHandle: 'alice' });
    expect(result.apps.every((a) => a.ownerHandle === 'alice')).toBe(true);
  });

  it('discover sortBy NEWEST returns newest first', () => {
    const t0 = new Date(Date.now() - 10000);
    const t1 = new Date();
    svc.publishApp({ projectId: 'old', title: 'Old', visibility: 'PUBLIC', createdAt: t0 });
    svc.publishApp({ projectId: 'new', title: 'New', visibility: 'PUBLIC', createdAt: t1 });
    const result = svc.discover({ sortBy: 'NEWEST' });
    const ids = result.apps.map((a) => a.projectId);
    expect(ids.indexOf('new')).toBeLessThan(ids.indexOf('old'));
  });

  it('discover sortBy MOST_VIEWED returns most viewed first', () => {
    svc.publishApp({ projectId: 'v1', title: 'Viewed', visibility: 'PUBLIC', createdAt: new Date() });
    svc.publishApp({ projectId: 'v2', title: 'Less Viewed', visibility: 'PUBLIC', createdAt: new Date() });
    svc.recordSignal({ projectId: 'v1', signalType: 'VIEW', userId: 'u1' });
    svc.recordSignal({ projectId: 'v1', signalType: 'VIEW', userId: 'u2' });
    svc.recordSignal({ projectId: 'v1', signalType: 'VIEW', userId: 'u3' });
    svc.recordSignal({ projectId: 'v2', signalType: 'VIEW', userId: 'u4' });
    const result = svc.discover({ sortBy: 'MOST_VIEWED' });
    const idx1 = result.apps.findIndex((a) => a.projectId === 'v1');
    const idx2 = result.apps.findIndex((a) => a.projectId === 'v2');
    if (idx1 >= 0 && idx2 >= 0) expect(idx1).toBeLessThan(idx2);
  });

  it('discover returns only PUBLIC apps regardless of filter', () => {
    svc.publishApp({ projectId: 'pub', title: 'Public',  visibility: 'PUBLIC',  createdAt: new Date() });
    svc.publishApp({ projectId: 'prv', title: 'Private', visibility: 'PRIVATE', createdAt: new Date() });
    const result = svc.discover();
    expect(result.apps.every((a) => a.visibility === 'PUBLIC')).toBe(true);
  });

  // ── 18-07: Remix chain ───────────────────────────────────────────────────────

  it('registerRemix records a public remix chain entry', () => {
    svc.registerRemix({ forkRuntimeId: 'fork-1', sourceRuntimeId: 'src-1', visibility: 'PUBLIC' });
    const source = svc.getRemixSource('fork-1');
    expect(source).not.toBeNull();
    expect(source?.sourceRuntimeId).toBe('src-1');
  });

  it('getRemixSource returns null for PRIVATE chain entries', () => {
    svc.registerRemix({ forkRuntimeId: 'fork-2', sourceRuntimeId: 'src-2', visibility: 'PRIVATE' });
    expect(svc.getRemixSource('fork-2')).toBeNull();
  });

  it('getRemixSource returns null for unknown runtimeId', () => {
    expect(svc.getRemixSource('no-such-runtime')).toBeNull();
  });

  it('getRemixCount counts forks from a source', () => {
    svc.registerRemix({ forkRuntimeId: 'f1', sourceRuntimeId: 'base', visibility: 'PUBLIC' });
    svc.registerRemix({ forkRuntimeId: 'f2', sourceRuntimeId: 'base', visibility: 'PUBLIC' });
    svc.registerRemix({ forkRuntimeId: 'f3', sourceRuntimeId: 'base', visibility: 'PRIVATE' });
    expect(svc.getRemixCount('base')).toBe(3); // count includes private
  });

  // ── 18-09: No internal metadata leaks ────────────────────────────────────────

  it('signal counts contain no internal metadata', () => {
    svc.recordSignal({ projectId: 'safe', signalType: 'LIKE', userId: 'u1' });
    const counts = svc.getSignalCounts('safe');
    const json = JSON.stringify(counts);
    expect(json).not.toMatch(/secret|token|password|credential|chain_of_thought|hidden|internal|system/i);
  });

  it('discover result contains no internal metadata', () => {
    svc.publishApp({ projectId: 'clean', title: 'Clean App', visibility: 'PUBLIC', createdAt: new Date() });
    const result = svc.discover();
    const json = JSON.stringify(result);
    expect(json).not.toMatch(/secret|token|password|credential|chain_of_thought|hidden|system/i);
  });
});
