import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const FREE_SECONDS_PER_DAY = 100;
const PRICE_PER_SECOND = 0.001;

@Injectable()
export class UsageService {
  constructor(private readonly prisma: PrismaService) {}

  async getToday(userId: string) {
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);

    const agg = await this.prisma.usageLog.aggregate({
      where: { userId, createdAt: { gte: todayStart } },
      _sum: { durationSecs: true, billedAmount: true },
      _count: { id: true },
    });

    const usedSecs = agg._sum.durationSecs ?? 0;
    const billed = agg._sum.billedAmount ?? 0;

    return {
      date: todayStart.toISOString().slice(0, 10),
      runs: agg._count.id,
      used_secs: usedSecs,
      free_secs: FREE_SECONDS_PER_DAY,
      free_remaining_secs: Math.max(0, FREE_SECONDS_PER_DAY - usedSecs),
      billed_amount_usd: parseFloat(billed.toFixed(6)),
      price_per_second_usd: PRICE_PER_SECOND,
    };
  }

  async getSummary(userId: string) {
    const now = new Date();
    const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

    const [monthAgg, allTimeAgg, recentLogs] = await Promise.all([
      this.prisma.usageLog.aggregate({
        where: { userId, createdAt: { gte: monthStart } },
        _sum: { durationSecs: true, billedAmount: true },
        _count: { id: true },
      }),
      this.prisma.usageLog.aggregate({
        where: { userId },
        _sum: { durationSecs: true, billedAmount: true },
        _count: { id: true },
      }),
      this.prisma.usageLog.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 20,
        select: {
          id: true, sandboxId: true, language: true,
          durationSecs: true, billedAmount: true, createdAt: true,
        },
      }),
    ]);

    return {
      current_month: {
        period: monthStart.toISOString().slice(0, 7),
        runs: monthAgg._count.id,
        used_secs: monthAgg._sum.durationSecs ?? 0,
        billed_amount_usd: parseFloat((monthAgg._sum.billedAmount ?? 0).toFixed(6)),
      },
      all_time: {
        runs: allTimeAgg._count.id,
        used_secs: allTimeAgg._sum.durationSecs ?? 0,
        billed_amount_usd: parseFloat((allTimeAgg._sum.billedAmount ?? 0).toFixed(6)),
      },
      recent_runs: recentLogs.map((l) => ({
        id: l.id,
        sandbox_id: l.sandboxId,
        language: l.language,
        duration_secs: l.durationSecs,
        billed_amount_usd: parseFloat(l.billedAmount.toFixed(6)),
        created_at: l.createdAt,
      })),
    };
  }
}
