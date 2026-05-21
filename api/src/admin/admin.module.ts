import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { KillSwitchModule } from '../kill-switch/kill-switch.module';
import { SecurityAuditModule } from '../audit/security-audit.module';
import { BetaModule } from '../beta/beta.module';
import { AdminGuard } from './admin.guard';
import { AdminController } from './admin.controller';

@Module({
  imports:     [KillSwitchModule, SecurityAuditModule, BetaModule],
  controllers: [AdminController],
  providers:   [PrismaService, AdminGuard],
})
export class AdminModule {}
