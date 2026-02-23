import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { getMissingRequiredEnvVars } from './config/env.contract';

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
  async ready(): Promise<
    | {
        ok: true;
        status: 'ready';
        checks: { env: 'ok'; db: 'ok'; schema: 'ok' };
      }
    | {
        ok: false;
        status: 'not_ready';
        reason: 'missing_env' | 'db_unavailable' | 'schema_not_ready';
        details: string[];
      }
  > {
    const missingEnv = getMissingRequiredEnvVars();
    if (missingEnv.length > 0) {
      throw new ServiceUnavailableException({
        ok: false as const,
        status: 'not_ready' as const,
        reason: 'missing_env' as const,
        details: missingEnv,
      });
    }

    try {
      await this.prisma.$queryRawUnsafe('SELECT 1');
    } catch {
      throw new ServiceUnavailableException({
        ok: false as const,
        status: 'not_ready' as const,
        reason: 'db_unavailable' as const,
        details: ['database query failed'],
      });
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
      throw new ServiceUnavailableException({
        ok: false as const,
        status: 'not_ready' as const,
        reason: 'schema_not_ready' as const,
        details: ['required tables missing: Template and/or User'],
      });
    }

    return {
      ok: true,
      status: 'ready',
      checks: { env: 'ok', db: 'ok', schema: 'ok' },
    };
  }
}
