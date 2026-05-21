import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RuntimeService } from './runtime.service';
import { RuntimeController } from './runtime.controller';
import { RuntimeHealthScheduler } from './runtime-health.scheduler';
import { SnapshotModule } from '../../snapshot/snapshot.module';

@Module({
  imports:     [SnapshotModule],
  controllers: [RuntimeController],
  providers:   [PrismaService, RuntimeService, RuntimeHealthScheduler],
  exports:     [RuntimeService],
})
export class RuntimeModule {}
