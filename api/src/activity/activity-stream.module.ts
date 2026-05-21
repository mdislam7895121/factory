import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityStreamService } from './activity-stream.service';
import { ActivityStreamGateway } from './activity-stream.gateway';
import { ActivityStreamController } from './activity-stream.controller';
import { ActivityMonitorScheduler } from './activity-monitor.scheduler';
import { ActivityRetentionScheduler } from './activity-retention.scheduler';

@Module({
  controllers: [ActivityStreamController],
  providers: [
    PrismaService,
    ActivityStreamService,
    ActivityStreamGateway,
    ActivityMonitorScheduler,
    ActivityRetentionScheduler,
  ],
  exports: [ActivityStreamService],
})
export class ActivityStreamModule {}
