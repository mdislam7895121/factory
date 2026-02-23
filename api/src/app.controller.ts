import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { getMissingRequiredEnvVars } from './config/env.contract';
import type { Response } from 'express';

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

  @Get('/ready')
  async ready(@Res() res: Response): Promise<void> {
    try {
      const missingEnv = getMissingRequiredEnvVars();
      if (missingEnv.length > 0) {
        res.status(503).json({
          ok: false,
          status: 'not_ready',
          reason: 'missing_env',
          details: missingEnv,
        });
        return;
      }

      try {
        await this.prisma.$queryRawUnsafe('SELECT 1');
      } catch {
        res.status(503).json({
          ok: false,
          status: 'not_ready',
          reason: 'db_unavailable',
          details: ['database query failed'],
        });
        return;
      }

      type SchemaRow = {
        template_ready: boolean;
        user_ready: boolean;
      };

      const schema = await this.prisma.$queryRawUnsafe<SchemaRow[]>(`
        SELECT
          to_regclass('public."Template"') IS NOT NULL AS template_ready,
          to_regclass('public."User"') IS NOT NULL AS user_ready
      `);

      const schemaRow = schema[0];
      const schemaReady = Boolean(
        schemaRow?.template_ready && schemaRow?.user_ready,
      );

      if (!schemaReady) {
        res.status(503).json({
          ok: false,
          status: 'not_ready',
          reason: 'schema_not_ready',
          details: ['required tables missing: Template and/or User'],
        });
        return;
      }

      res.status(200).json({
        ok: true,
        status: 'ready',
        checks: { env: 'ok', db: 'ok', schema: 'ok' },
      });
    } catch {
      res.status(503).json({
        ok: false,
        status: 'not_ready',
        reason: 'readiness_check_failed',
        details: ['unexpected readiness check failure'],
      });
    }
  }
}
