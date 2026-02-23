import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { Serial11Controller } from './serial11/serial11.controller';
import { Serial11Service } from './serial11/serial11.service';
import { AuthModule } from './lib/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AppController, Serial11Controller],
  providers: [AppService, PrismaService, Serial11Service],
})
export class AppModule {}
