import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RuntimeService } from './runtime.service';
import { RuntimeController } from './runtime.controller';
import { RuntimeHealthScheduler } from './runtime-health.scheduler';
import { SnapshotModule } from '../../snapshot/snapshot.module';
import { SecurityAuditModule } from '../../audit/security-audit.module';
import { QuotaModule } from '../../quota/quota.module';
import { KillSwitchModule } from '../../kill-switch/kill-switch.module';

@Module({
  imports: [SnapshotModule, SecurityAuditModule, QuotaModule, KillSwitchModule],
  controllers: [RuntimeController],
  providers:   [PrismaService, RuntimeService, RuntimeHealthScheduler],
  exports:     [RuntimeService],
})
export class RuntimeModule {}
