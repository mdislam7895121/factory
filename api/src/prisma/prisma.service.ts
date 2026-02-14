import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

type PoolConstructor = new (config: { connectionString: string }) => unknown;

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // Validate DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      throw new Error(
        'DATABASE_URL environment variable is not set. Please check your .env file.',
      );
    }

    // Create PostgreSQL connection pool
    const PgPool = Pool as unknown as PoolConstructor;
    const pool = new PgPool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool as never);

    // Initialize PrismaClient with adapter
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
