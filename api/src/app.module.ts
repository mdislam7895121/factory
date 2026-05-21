import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { Serial11Controller } from './serial11/serial11.controller';
import { Serial11Service } from './serial11/serial11.service';
import { AuthModule } from './lib/auth/auth.module';
import { RedisModule } from './lib/redis/redis.module';
import { WorkspaceService } from './serial15/workspace.service';
import { ProjectService } from './serial15/project.service';
import { SandboxModule } from './sandbox/sandbox.module';
import { PreviewModule } from './preview/preview.module';
import { RemixModule } from './remix/remix.module';
import { ActivityStreamModule } from './activity/activity-stream.module';
import { SnapshotModule } from './snapshot/snapshot.module';
import { AdminModule } from './admin/admin.module';
import { SecurityAuditModule } from './audit/security-audit.module';
import { BetaModule } from './beta/beta.module';
import { LegalModule } from './legal/legal.module';
import { DemoModule } from './demo/demo.module';

@Module({
  imports: [
    RedisModule, AuthModule, SandboxModule, PreviewModule, RemixModule,
    ActivityStreamModule, SnapshotModule,
    AdminModule, SecurityAuditModule, BetaModule, LegalModule, DemoModule,
  ],
  controllers: [AppController, Serial11Controller],
  providers: [
    AppService,
    PrismaService,
    Serial11Service,
    WorkspaceService,
    ProjectService,
  ],
})
export class AppModule {}
