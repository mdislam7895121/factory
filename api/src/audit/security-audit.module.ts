import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SecurityAuditService } from './security-audit.service';

@Module({
  providers: [PrismaService, SecurityAuditService],
  exports:   [SecurityAuditService],
})
export class SecurityAuditModule {}
