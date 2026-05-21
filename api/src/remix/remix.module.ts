import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RemixService } from './remix.service';
import { RemixController } from './remix.controller';
import { RemixQueueScheduler } from './remix-queue.scheduler';

@Module({
  controllers: [RemixController],
  providers:   [PrismaService, RemixService, RemixQueueScheduler],
  exports:     [RemixService],
})
export class RemixModule {}
