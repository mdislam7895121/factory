import { Injectable } from '@nestjs/common';
import { createHash } from 'node:crypto';
import type {
  AppSignalCounts,
  CreatorTrustFlag,
  DiscoverParams,
  DiscoverResult,
  ModerationStatus,
  PublishedApp,
  RemixSource,
  SocialSignalType,
} from './social.types';

// 18-09: Anonymous like/save dedup window
const DEDUP_WINDOW_MS = 60_000;

@Injectable()
export class SocialSignalService {
  // projectId -> { signalType -> count }
  private readonly signalCounts  = new Map<string, Map<SocialSignalType, number>>();
  // dedup key -> last signal timestamp
  private readonly recentSignals = new Map<string, number>();
  // projectId -> PublishedApp (public registry)
  private readonly publishedApps = new Map<string, PublishedApp>();
  // forkRuntimeId -> { sourceRuntimeId, sourcePreviewRouteId, visibility }
  private readonly remixLinks    = new Map<string, { sourceRuntimeId: string; sourcePreviewRouteId?: string; visibility: string }>();
  // 20C-11: handle -> trust flag
  private readonly creatorTrustFlags = new Map<string, CreatorTrustFlag>();

  // ── 18-03: Record signal ──────────────────────────────────────────────────────

  recordSignal(params: {
    projectId:       string;
    runtimeId?:      string;
    previewRouteId?: string;
    userId?:         string;
    signalType:      SocialSignalType;
    ip?:             string;
  }): { recorded: boolean; reason?: string } {
    const { projectId, userId, signalType, ip } = params;

    // 18-03: Hash IP for privacy — never store raw IP
    const ipHash = ip ? createHash('sha256').update(ip).digest('hex').slice(0, 32) : undefined;

    // 18-09: Dedup anonymous likes/saves within the window
    if (!userId && ipHash && (signalType === 'LIKE' || signalType === 'SAVE')) {
      const key  = `${ipHash}:${projectId}:${signalType}`;
      const last = this.recentSignals.get(key) ?? 0;
      if (Date.now() - last < DEDUP_WINDOW_MS) {
        return { recorded: false, reason: 'duplicate' };
      }
      this.recentSignals.set(key, Date.now());
    }

    const counts = this.signalCounts.get(projectId) ?? new Map<SocialSignalType, number>();
    counts.set(signalType, (counts.get(signalType) ?? 0) + 1);
    this.signalCounts.set(projectId, counts);

    return { recorded: true };
  }

  // ── 18-03: Read signal counts ────────────────────────────────────────────────

  getSignalCounts(projectId: string): AppSignalCounts {
    const counts = this.signalCounts.get(projectId) ?? new Map<SocialSignalType, number>();
    return {
      projectId,
      likes:   counts.get('LIKE')   ?? 0,
      saves:   counts.get('SAVE')   ?? 0,
      shares:  counts.get('SHARE')  ?? 0,
      views:   counts.get('VIEW')   ?? 0,
      remixes: counts.get('REMIX')  ?? 0,
    };
  }

  hashIp(ip: string): string {
    return createHash('sha256').update(ip).digest('hex').slice(0, 32);
  }

  // ── 18-08: Published app registry ────────────────────────────────────────────

  publishApp(app: Omit<PublishedApp, 'signals'>): void {
    const existing = this.publishedApps.get(app.projectId);
    this.publishedApps.set(app.projectId, {
      ...app,
      signals: existing?.signals ?? this.getSignalCounts(app.projectId),
    });
  }

  unpublishApp(projectId: string): void {
    const app = this.publishedApps.get(projectId);
    if (app) this.publishedApps.set(projectId, { ...app, visibility: 'PRIVATE' });
  }

  getPublicApp(projectId: string): PublishedApp | undefined {
    const app = this.publishedApps.get(projectId);
    // 18-09: Private apps never returned from public API
    if (!app || app.visibility !== 'PUBLIC') return undefined;
    return { ...app, signals: this.getSignalCounts(projectId) };
  }

  // ── 18-08: Discovery ─────────────────────────────────────────────────────────

  discover(params: DiscoverParams = {}): DiscoverResult {
    const limit = Math.min(params.limit ?? 20, 100);

    let apps = [...this.publishedApps.values()]
      .filter((a) => a.visibility === 'PUBLIC')   // 18-09: Public only
      .filter((a) => !a.hidden)                   // 20C-08: Hidden apps excluded
      .filter((a) => a.moderationStatus !== 'HIDDEN' && a.moderationStatus !== 'FLAGGED'); // 20C-08: Moderated out

    if (params.domain) {
      apps = apps.filter((a) => a.domain === params.domain);
    }
    if (params.category) {
      apps = apps.filter((a) => a.category === params.category);
    }
    if (params.marketplacePackSlug) {
      apps = apps.filter((a) => a.marketplacePackSlug === params.marketplacePackSlug);
    }
    if (params.creatorHandle) {
      // 20C-08: Ban-flagged creators hidden from discover
      if (this.creatorTrustFlags.get(params.creatorHandle) === 'BANNED') {
        return { apps: [], total: 0 };
      }
      apps = apps.filter((a) => a.ownerHandle === params.creatorHandle);
    }
    if (params.remixableOnly) {
      apps = apps.filter((a) => !!a.runtimeId);
    }

    // 20C-08: Exclude apps whose creator is banned
    apps = apps.filter((a) => {
      if (!a.ownerHandle) return true;
      const flag = this.creatorTrustFlags.get(a.ownerHandle);
      return flag !== 'BANNED';
    });

    switch (params.sortBy) {
      case 'MOST_REMIXED':
        apps.sort((a, b) => this.getSignalCounts(b.projectId).remixes - this.getSignalCounts(a.projectId).remixes);
        break;
      case 'MOST_VIEWED':
        apps.sort((a, b) => this.getSignalCounts(b.projectId).views - this.getSignalCounts(a.projectId).views);
        break;
      case 'NEWEST':
        apps.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'STAFF_PICKS':
        apps = apps.filter((a) => a.featured);
        apps.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'TRENDING':
      default: {
        const score = (p: string) => {
          const s = this.getSignalCounts(p);
          return s.likes * 3 + s.saves * 2 + s.views;
        };
        apps.sort((a, b) => score(b.projectId) - score(a.projectId));
      }
    }

    // 20C-07: Cursor pagination — cursor is base64-encoded index
    const total = apps.length;
    let startIdx = 0;
    if (params.cursor) {
      try {
        startIdx = parseInt(Buffer.from(params.cursor, 'base64').toString(), 10) || 0;
      } catch { startIdx = 0; }
    }
    const page = apps.slice(startIdx, startIdx + limit);
    const nextIdx = startIdx + limit;
    const nextCursor = nextIdx < total
      ? Buffer.from(String(nextIdx)).toString('base64')
      : undefined;

    return {
      apps:   page.map((a) => ({ ...a, signals: this.getSignalCounts(a.projectId) })),
      total,
      cursor: nextCursor,
    };
  }

  // ── 20C-11: Admin moderation foundations ────────────────────────────────────

  featureApp(projectId: string, featured: boolean): void {
    const app = this.publishedApps.get(projectId);
    if (app) this.publishedApps.set(projectId, { ...app, featured });
  }

  hideApp(projectId: string, hidden: boolean): void {
    const app = this.publishedApps.get(projectId);
    if (app) this.publishedApps.set(projectId, { ...app, hidden });
  }

  setModerationStatus(projectId: string, status: ModerationStatus): void {
    const app = this.publishedApps.get(projectId);
    if (app) this.publishedApps.set(projectId, { ...app, moderationStatus: status });
  }

  setCreatorTrustFlag(handle: string, flag: CreatorTrustFlag): void {
    this.creatorTrustFlags.set(handle, flag);
  }

  getCreatorTrustFlag(handle: string): CreatorTrustFlag {
    return this.creatorTrustFlags.get(handle) ?? 'NONE';
  }

  // ── 18-07: Remix chain ────────────────────────────────────────────────────────

  registerRemix(params: {
    forkRuntimeId:         string;
    sourceRuntimeId:       string;
    sourcePreviewRouteId?: string;
    visibility:            string;
  }): void {
    this.remixLinks.set(params.forkRuntimeId, {
      sourceRuntimeId:      params.sourceRuntimeId,
      sourcePreviewRouteId: params.sourcePreviewRouteId,
      visibility:           params.visibility,
    });
  }

  // 18-07: Only expose remix source when source visibility is PUBLIC
  getRemixSource(forkRuntimeId: string): RemixSource | null {
    const entry = this.remixLinks.get(forkRuntimeId);
    if (!entry || entry.visibility !== 'PUBLIC') return null;
    return {
      sourceRuntimeId:      entry.sourceRuntimeId,
      sourcePreviewRouteId: entry.sourcePreviewRouteId,
    };
  }

  getRemixCount(sourceRuntimeId: string): number {
    let count = 0;
    for (const [, entry] of this.remixLinks) {
      if (entry.sourceRuntimeId === sourceRuntimeId) count++;
    }
    return count;
  }
}
