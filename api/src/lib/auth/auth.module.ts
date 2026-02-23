import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtGuard } from './jwt.guard';
import { JwtService } from './jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtService, JwtGuard, PrismaService],
  exports: [JwtService, JwtGuard],
})
export class AuthModule {}
