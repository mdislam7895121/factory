import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  getHello(): string {
    if (process.env.FACTORY_KILL_SWITCH === '1') {
      return 'Service temporarily limited';
    }

    return this.appService.getHello();
  }

  @Get('/db/health')
  async dbHealth() {
    await this.prisma.$queryRawUnsafe('SELECT 1');

    return {
      ok: true,
      status: 'up',
    };
  }

  @Get('/health/db')
  async dbHealthAlias() {
    return this.dbHealth();
  }
}
