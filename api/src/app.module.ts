import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { Serial11Controller } from './serial11/serial11.controller';
import { Serial11Service } from './serial11/serial11.service';
import { ProvisioningService } from './services/provisioningService';
import { ProvisionWorker } from './workers/provision.worker';

@Module({
  imports: [],
  controllers: [AppController, Serial11Controller],
  providers: [
    AppService,
    PrismaService,
    Serial11Service,
    ProvisioningService,
    ProvisionWorker,
  ],
})
export class AppModule {}
