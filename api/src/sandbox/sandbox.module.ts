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

@Module({
  controllers: [SandboxController, ApiKeyController, UsageController, BillingController],
  providers: [PrismaService, ApiKeyService, ApiKeyGuard, SandboxService, UsageService, BillingService],
  exports: [ApiKeyService, SandboxService, UsageService],
})
export class SandboxModule {}
