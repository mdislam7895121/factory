import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApiKeyService } from './api-key.service';
import { ApiKeyGuard } from './api-key.guard';
import { ApiKeyController } from './api-key.controller';
import { SandboxService } from './sandbox.service';
import { SandboxController } from './sandbox.controller';

@Module({
  controllers: [SandboxController, ApiKeyController],
  providers: [PrismaService, ApiKeyService, ApiKeyGuard, SandboxService],
  exports: [ApiKeyService, SandboxService],
})
export class SandboxModule {}
