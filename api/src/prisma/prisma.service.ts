import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { getRequiredEnvOrThrow } from '../config/env.contract';

type PoolConstructor = new (config: { connectionString: string }) => unknown;

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const databaseUrl = getRequiredEnvOrThrow('DATABASE_URL');

    // Create PostgreSQL connection pool
    const PgPool = Pool as unknown as PoolConstructor;
    const pool = new PgPool({ connectionString: databaseUrl });
    const adapter = new PrismaPg(pool as never);

    // Initialize PrismaClient with adapter
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
