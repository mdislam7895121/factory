import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QuotaService } from './quota.service';

@Module({
  providers: [PrismaService, QuotaService],
  exports:   [QuotaService],
})
export class QuotaModule {}
