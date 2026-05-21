import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { spawn } from 'node:child_process';
import { PrismaService } from '../prisma/prisma.service';

const SUPPORTED_LANGUAGES = ['python', 'nodejs', 'bash'] as const;
type Language = typeof SUPPORTED_LANGUAGES[number];

const DOCKER_IMAGE: Record<Language, string> = {
  python: 'python:3.12-slim',
  nodejs: 'node:20-alpine',
  bash:   'alpine:3.19',
};

const PRICE_PER_SECOND = 0.001;
const FREE_SECONDS_PER_DAY = 100;
const CONTAINER_PREFIX = 'perpetual_sb_';

@Injectable()
export class SandboxService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, language: string, timeoutSecs = 300) {
    if (!SUPPORTED_LANGUAGES.includes(language as Language)) {
      throw new BadRequestException(`Unsupported language: ${language}`);
    }
    if (timeoutSecs < 1 || timeoutSecs > 3600) {
      throw new BadRequestException('timeout must be between 1 and 3600 seconds');
    }

    const sandbox = await this.prisma.sandbox.create({
      data: {
        userId,
        language: language as Language,
        status: 'CREATING',
        timeoutSecs,
      },
    });

    // Pull & start container in background
    this.startContainer(sandbox.id, language as Language, timeoutSecs).catch(() => {
      this.prisma.sandbox.update({
        where: { id: sandbox.id },
        data: { status: 'FAILED' },
      }).catch(() => {});
    });

    return {
      sandbox_id: sandbox.id,
      status: 'creating',
      language,
      timeout_secs: timeoutSecs,
      created_at: sandbox.createdAt,
    };
  }

  private async startContainer(sandboxId: string, language: Language, timeoutSecs: number) {
    const containerName = `${CONTAINER_PREFIX}${sandboxId}`;
    const image = DOCKER_IMAGE[language];

    await this.runDockerCommand([
      'run', '-d',
      '--name', containerName,
      '--memory', '512m',
      '--cpus', '0.5',
      '--network', 'none',
      '--read-only',
      '--tmpfs', '/tmp:size=100m',
      '--label', `perpetual.sandbox.id=${sandboxId}`,
      '--stop-timeout', String(timeoutSecs),
      image,
      'tail', '-f', '/dev/null',
    ]);

    const containerId = await this.runDockerCommand([
      'inspect', '--format', '{{.Id}}', containerName,
    ]);

    await this.prisma.sandbox.update({
      where: { id: sandboxId },
      data: { status: 'READY', containerId: containerId.trim(), startedAt: new Date() },
    });

    // Auto-terminate after timeout
    setTimeout(() => this.terminate(sandboxId).catch(() => {}), timeoutSecs * 1000);
  }

  async run(sandboxId: string, userId: string, code: string) {
    const sandbox = await this.prisma.sandbox.findFirst({
      where: { id: sandboxId, userId },
    });
    if (!sandbox) throw new NotFoundException('Sandbox not found');
    if (sandbox.status === 'TERMINATED') throw new BadRequestException('Sandbox is terminated');
    if (sandbox.status === 'FAILED') throw new BadRequestException('Sandbox failed to start');
    if (sandbox.status === 'CREATING') throw new BadRequestException('Sandbox is still starting');

    const containerName = `${CONTAINER_PREFIX}${sandboxId}`;
    const startTime = Date.now();

    let command: string[];
    if (sandbox.language === 'python') {
      command = ['exec', containerName, 'python3', '-c', code];
    } else if (sandbox.language === 'nodejs') {
      command = ['exec', containerName, 'node', '-e', code];
    } else {
      command = ['exec', containerName, 'sh', '-c', code];
    }

    await this.prisma.sandbox.update({
      where: { id: sandboxId },
      data: { status: 'RUNNING' },
    });

    const { stdout, stderr, exitCode } = await this.runDockerCommandFull(command);
    const durationSecs = Math.ceil((Date.now() - startTime) / 1000);

    await this.prisma.sandbox.update({
      where: { id: sandboxId },
      data: { status: 'READY' },
    });

    // Record usage — free tier is cumulative per day, not per-run
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);
    const todayAgg = await this.prisma.usageLog.aggregate({
      where: { userId, createdAt: { gte: todayStart } },
      _sum: { durationSecs: true },
    });
    const usedTodaySecs = todayAgg._sum.durationSecs ?? 0;
    const freeRemaining = Math.max(0, FREE_SECONDS_PER_DAY - usedTodaySecs);
    const billableSecs = Math.max(0, durationSecs - freeRemaining);
    const billedAmount = billableSecs * PRICE_PER_SECOND;

    await this.prisma.usageLog.create({
      data: {
        sandboxId,
        userId,
        durationSecs,
        billedAmount,
        language: sandbox.language,
      },
    });

    return { stdout, stderr, exit_code: exitCode, duration_secs: durationSecs };
  }

  async terminate(sandboxId: string, userId?: string) {
    const where = userId
      ? { id: sandboxId, userId }
      : { id: sandboxId };

    const sandbox = await this.prisma.sandbox.findFirst({ where });
    if (!sandbox) throw new NotFoundException('Sandbox not found');
    if (sandbox.status === 'TERMINATED') return { status: 'terminated' };

    const containerName = `${CONTAINER_PREFIX}${sandboxId}`;
    await this.runDockerCommand(['rm', '-f', containerName]).catch(() => {});

    await this.prisma.sandbox.update({
      where: { id: sandboxId },
      data: { status: 'TERMINATED', terminatedAt: new Date() },
    });

    return { status: 'terminated' };
  }

  async get(sandboxId: string, userId: string) {
    const sandbox = await this.prisma.sandbox.findFirst({
      where: { id: sandboxId, userId },
      select: {
        id: true, language: true, status: true,
        timeoutSecs: true, startedAt: true,
        terminatedAt: true, createdAt: true,
      },
    });
    if (!sandbox) throw new NotFoundException('Sandbox not found');
    return {
      sandbox_id: sandbox.id,
      language: sandbox.language,
      status: sandbox.status.toLowerCase(),
      timeout_secs: sandbox.timeoutSecs,
      started_at: sandbox.startedAt,
      terminated_at: sandbox.terminatedAt,
      created_at: sandbox.createdAt,
    };
  }

  private runDockerCommand(args: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
      const proc = spawn('docker', args, { stdio: ['ignore', 'pipe', 'pipe'] });
      let out = '';
      let err = '';
      proc.stdout.on('data', (d) => { out += d.toString(); });
      proc.stderr.on('data', (d) => { err += d.toString(); });
      proc.on('close', (code) => {
        if (code !== 0) reject(new Error(err.trim() || `docker failed: ${args[0]}`));
        else resolve(out.trim());
      });
      proc.on('error', reject);
    });
  }

  private runDockerCommandFull(args: string[]): Promise<{ stdout: string; stderr: string; exitCode: number }> {
    return new Promise((resolve) => {
      const proc = spawn('docker', args, { stdio: ['ignore', 'pipe', 'pipe'] });
      let stdout = '';
      let stderr = '';
      proc.stdout.on('data', (d) => { stdout += d.toString(); });
      proc.stderr.on('data', (d) => { stderr += d.toString(); });
      proc.on('close', (code) => resolve({ stdout, stderr, exitCode: code ?? 1 }));
      proc.on('error', (e) => resolve({ stdout: '', stderr: e.message, exitCode: 1 }));
    });
  }
}
