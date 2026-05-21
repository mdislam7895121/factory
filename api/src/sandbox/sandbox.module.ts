import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApiKeyService } from './api-key.service';
import { ApiKeyGuard } from './api-key.guard';
import { ApiKeyController } from './api-key.controller';
import { SandboxService } from './sandbox.service';
import { SandboxController } from './sandbox.controller';
import { UsageService } from './usage.service';
import { UsageController } from './usage.controller';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { MemoryService } from './memory.service';
import { MemoryController } from './memory.controller';
import { MemoryTtlScheduler } from './memory-ttl.scheduler';

@Module({
  controllers: [
    SandboxController,
    ApiKeyController,
    UsageController,
    BillingController,
    MemoryController,
  ],
  providers: [
    PrismaService,
    ApiKeyService,
    ApiKeyGuard,
    SandboxService,
    UsageService,
    BillingService,
    MemoryService,
    MemoryTtlScheduler,
  ],
  exports: [ApiKeyService, SandboxService, UsageService, MemoryService],
})
export class SandboxModule {}
