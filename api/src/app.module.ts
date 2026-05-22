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
import { AgentsModule } from './agents/agents.module';
import { MarketplaceModule } from './agents/marketplace/marketplace.module';
import { SocialModule } from './social/social.module';
import { BillingModule } from './billing/billing.module';
import { MemoryModule } from './memory/memory.module';
import { QualityModule } from './quality/quality.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { EditorModule } from './editor/editor.module';
import { PairProgrammerModule } from './pair-programmer/pair-programmer.module';

@Module({
  imports: [
    RedisModule, AuthModule, SandboxModule, PreviewModule, RemixModule,
    ActivityStreamModule, SnapshotModule,
    AdminModule, SecurityAuditModule, BetaModule, LegalModule, DemoModule, AgentsModule,
    MarketplaceModule, SocialModule, BillingModule, MemoryModule, QualityModule, WorkspaceModule,
    EditorModule, PairProgrammerModule,
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
