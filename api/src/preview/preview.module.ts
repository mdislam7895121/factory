import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RuntimeModule } from '../sandbox/runtime/runtime.module';
import { PreviewTokenService } from './preview-token.service';
import { PreviewLogService } from './preview-log.service';
import { PreviewService } from './preview.service';
import { PreviewController } from './preview.controller';
import { PreviewShellService } from './preview-shell.service';
import { PreviewAbuseService } from './preview-abuse.service';

@Module({
  imports:     [RuntimeModule],
  controllers: [PreviewController],
  providers:   [PrismaService, PreviewTokenService, PreviewLogService, PreviewService, PreviewShellService, PreviewAbuseService],
  exports:     [PreviewService, PreviewTokenService, PreviewLogService, PreviewShellService],
})
export class PreviewModule {}
