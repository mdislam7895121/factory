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
    return this.appService.getHello();
  }

  @Get('/db/health')
  async dbHealth() {
    const row = await this.prisma.healthCheck.create({
      data: { message: 'ok' },
    });

    const count = await this.prisma.healthCheck.count();

    return {
      ok: true,
      insertedId: row.id,
      count,
    };
  }
}
