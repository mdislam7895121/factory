import { createHash } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { RuntimeVisibility } from '../generated/prisma';
import { PrismaService } from '../prisma/prisma.service';

// 08-03: Keys that must never appear in snapshot manifest
const BLOCKED_MANIFEST_KEYS = /secret|token|key|password|credential|auth|private|prompt|instruction|system|chain_of_thought|hidden|internal/i;

export interface SnapshotManifest {
  runtimeId:    string;
  projectId:    string | null;
  workspaceId:  string | null;
  ownerUserId:  string;
  runtimeType:  string;
  visibility:   RuntimeVisibility;
  allowRemix:   boolean;
  remixNote:    string | null;
  sourceId:     string | null;   // fork lineage — never restored, preserved as-is
  previewUrl:   string | null;   // reference only — never overwritten on restore
  metadata:     Record<string, unknown> | null;
  forkLineage:  Array<{ sourceRuntimeId: string; forkRuntimeId: string; ownerUserId: string }>;
  previewRoutes: Array<{ id: string; slug: string; isActive: boolean }>;
  capturedAt:   string;
}

// 08-03: Interface — supports metadata captures now; full FS capture is TODO
export interface RuntimeSnapshotAdapter {
  capture(runtimeId: string): Promise<SnapshotManifest>;
  restore(runtimeId: string, manifest: SnapshotManifest): Promise<void>;
  verify(manifest: SnapshotManifest, checksum: string): boolean;
}

@Injectable()
export class MetadataSnapshotAdapter implements RuntimeSnapshotAdapter {
  constructor(private readonly prisma: PrismaService) {}

  async capture(runtimeId: string): Promise<SnapshotManifest> {
    const runtime = await this.prisma.runtimeInstance.findUnique({ where: { id: runtimeId } });
    if (!runtime) throw new Error(`runtime ${runtimeId} not found`);

    const rawMeta = runtime.metadata
      ? (JSON.parse(runtime.metadata) as Record<string, unknown>)
      : null;
    const safeMeta = rawMeta ? this.redactMetadata(rawMeta) : null;

    const forkLineage = await this.prisma.projectFork.findMany({
      where: { OR: [{ sourceRuntimeId: runtimeId }, { forkRuntimeId: runtimeId }] },
      select: { sourceRuntimeId: true, forkRuntimeId: true, ownerUserId: true },
      orderBy: { createdAt: 'asc' },
    });

    const previewRoutes = await this.prisma.previewRoute.findMany({
      where: { runtimeId },
      select: { id: true, slug: true, isActive: true },
    });

    return {
      runtimeId:    runtime.id,
      projectId:    runtime.projectId,
      workspaceId:  runtime.workspaceId,
      ownerUserId:  runtime.ownerUserId,
      runtimeType:  runtime.runtimeType,
      visibility:   runtime.visibility,
      allowRemix:   runtime.allowRemix,
      remixNote:    runtime.remixNote,
      sourceId:     runtime.sourceId,
      previewUrl:   runtime.previewUrl,
      metadata:     safeMeta,
      forkLineage,
      previewRoutes,
      capturedAt:   new Date().toISOString(),
    };
  }

  // 08-03: Restore safe fields only — preserves previewUrl, sourceId, fork lineage
  async restore(runtimeId: string, manifest: SnapshotManifest): Promise<void> {
    const safeMeta = manifest.metadata ? this.redactMetadata(manifest.metadata) : null;

    // Restoring container requires the orchestrator — mark PROVISIONING so the
    // healer can re-provision. Full FS restore is explicitly NOT implemented.
    await this.prisma.runtimeInstance.update({
      where: { id: runtimeId },
      data: {
        visibility:  manifest.visibility,
        allowRemix:  manifest.allowRemix,
        remixNote:   manifest.remixNote,
        metadata:    safeMeta ? JSON.stringify(safeMeta) : null,
        // NOTE: previewUrl, sourceId, ownerUserId intentionally NOT restored
        // to preserve stable URLs (08-09) and fork lineage (08-09)
        // Full filesystem/container restore is NOT YET IMPLEMENTED
        // TODO(08-03): integrate orchestrator snapshot API when available
      },
    });
  }

  verify(manifest: SnapshotManifest, checksum: string): boolean {
    const computed = createHash('sha256')
      .update(JSON.stringify(manifest))
      .digest('hex');
    return computed === checksum;
  }

  private redactMetadata(obj: Record<string, unknown>): Record<string, unknown> {
    const safe: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      if (!BLOCKED_MANIFEST_KEYS.test(k)) safe[k] = v;
    }
    return safe;
  }

  computeChecksum(manifest: SnapshotManifest): string {
    return createHash('sha256').update(JSON.stringify(manifest)).digest('hex');
  }
}
