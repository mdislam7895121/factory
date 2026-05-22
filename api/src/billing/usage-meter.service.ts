import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { UsageEventRecord, UsageEventType } from './billing.types';

// 19-04: Usage metering service — in-process event log + daily counters

@Injectable()
export class UsageMeterService {
  // Production: writes to UsageEvent Prisma model
  private readonly events: UsageEventRecord[] = [];
  // `${workspaceId}:${eventType}:${YYYY-MM-DD}` -> count
  private readonly dailyCounts = new Map<string, number>();

  // ── Emit ─────────────────────────────────────────────────────────────────────

  emit(params: {
    workspaceId: string;
    userId?:     string;
    eventType:   UsageEventType;
    quantity?:   number;
    metadata?:   Record<string, unknown>;
  }): UsageEventRecord {
    const qty = params.quantity ?? 1;
    const record: UsageEventRecord = {
      id:          randomUUID(),
      workspaceId: params.workspaceId,
      userId:      params.userId,
      eventType:   params.eventType,
      quantity:    qty,
      metadata:    params.metadata,
      createdAt:   new Date(),
    };
    this.events.push(record);

    const today = record.createdAt.toISOString().slice(0, 10);
    const key   = `${params.workspaceId}:${params.eventType}:${today}`;
    this.dailyCounts.set(key, (this.dailyCounts.get(key) ?? 0) + qty);

    return record;
  }

  // ── Query ────────────────────────────────────────────────────────────────────

  getDailyCount(workspaceId: string, eventType: UsageEventType, date?: string): number {
    const d = date ?? new Date().toISOString().slice(0, 10);
    return this.dailyCounts.get(`${workspaceId}:${eventType}:${d}`) ?? 0;
  }

  getTotalByType(workspaceId: string, eventType: UsageEventType): number {
    return this.events
      .filter((e) => e.workspaceId === workspaceId && e.eventType === eventType)
      .reduce((sum, e) => sum + e.quantity, 0);
  }

  getEvents(workspaceId: string, limit = 50): UsageEventRecord[] {
    return this.events
      .filter((e) => e.workspaceId === workspaceId)
      .slice(-limit)
      .reverse();
  }

  getSummary(workspaceId: string): Record<UsageEventType, number> {
    return {
      RUNTIME_CREATED:      this.getTotalByType(workspaceId, 'RUNTIME_CREATED'),
      AI_GENERATION:        this.getTotalByType(workspaceId, 'AI_GENERATION'),
      PREVIEW_VIEW:         this.getTotalByType(workspaceId, 'PREVIEW_VIEW'),
      REMIX:                this.getTotalByType(workspaceId, 'REMIX'),
      PREMIUM_PACK_INSTALL: this.getTotalByType(workspaceId, 'PREMIUM_PACK_INSTALL'),
      SNAPSHOT_CREATED:     this.getTotalByType(workspaceId, 'SNAPSHOT_CREATED'),
    };
  }
}
