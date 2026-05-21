import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityStreamModule } from '../activity/activity-stream.module';
import { SecurityAuditModule } from '../audit/security-audit.module';
import { MetadataSnapshotAdapter } from './runtime-snapshot.adapter';
import { SnapshotService } from './snapshot.service';
import { SnapshotController } from './snapshot.controller';
import { SnapshotRetentionScheduler } from './snapshot-retention.scheduler';
import { SnapshotRecoveryScheduler } from './snapshot-recovery.scheduler';

@Module({
  imports: [ActivityStreamModule, SecurityAuditModule],
  controllers: [SnapshotController],
  providers:   [
    PrismaService,
    MetadataSnapshotAdapter,
    SnapshotService,
    SnapshotRetentionScheduler,
    SnapshotRecoveryScheduler,
  ],
  exports:     [SnapshotService],
})
export class SnapshotModule {}
