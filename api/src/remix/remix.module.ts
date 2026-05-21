import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RemixService } from './remix.service';
import { RemixController } from './remix.controller';
import { RemixQueueScheduler } from './remix-queue.scheduler';
import { SnapshotModule } from '../snapshot/snapshot.module';
import { QuotaModule } from '../quota/quota.module';
import { KillSwitchModule } from '../kill-switch/kill-switch.module';

@Module({
  imports: [SnapshotModule, QuotaModule, KillSwitchModule],
  controllers: [RemixController],
  providers:   [PrismaService, RemixService, RemixQueueScheduler],
  exports:     [RemixService],
})
export class RemixModule {}
