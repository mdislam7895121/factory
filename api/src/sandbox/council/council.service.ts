import { Injectable, NotFoundException, BadRequestException, OnModuleInit } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { PrismaService } from '../../prisma/prisma.service';
import { MemoryService } from '../memory.service';
import { AGENT_ROLES, SYSTEM_PROMPTS, type AgentRole } from './agent-prompts';

const MODEL = 'claude-sonnet-4-6';
const MAX_TOKENS_PER_TURN = 2048;
const MAX_TASK_LENGTH = 4000;

interface AgentTurn {
  role: AgentRole;
  round: number;
  content: string;
  inputTokens: number;
  outTokens: number;
}

@Injectable()
export class CouncilService implements OnModuleInit {
  private anthropic!: Anthropic;

  constructor(
    private readonly prisma: PrismaService,
    private readonly memory: MemoryService,
  ) {}

  onModuleInit() {
    const key = (process.env.ANTHROPIC_API_KEY || '').trim();
    if (!key) {
      console.warn('[council] ANTHROPIC_API_KEY not set — council endpoints will reject requests');
    }
    this.anthropic = new Anthropic({ apiKey: key || 'not-configured' });
  }

  async start(userId: string, task: string, context?: Record<string, unknown>) {
    if (!process.env.ANTHROPIC_API_KEY?.trim()) {
      throw new BadRequestException('ANTHROPIC_API_KEY is not configured on this server');
    }
    if (task.length > MAX_TASK_LENGTH) {
      throw new BadRequestException(`task must be under ${MAX_TASK_LENGTH} characters`);
    }

    const session = await this.prisma.councilSession.create({
      data: {
        userId,
        task,
        context: context ? JSON.stringify(context) : null,
        status: 'PENDING',
      },
    });

    // Run asynchronously — caller polls for status
    this.runCouncil(session.id, userId, task, context).catch(async (err: unknown) => {
      await this.prisma.councilSession.update({
        where: { id: session.id },
        data: {
          status: 'FAILED',
          errorMsg: err instanceof Error ? err.message : String(err),
        },
      }).catch(() => {});
    });

    return {
      session_id: session.id,
      status: 'pending',
      task,
      created_at: session.createdAt,
    };
  }

  async getSession(sessionId: string, userId: string) {
    const session = await this.prisma.councilSession.findFirst({
      where: { id: sessionId, userId },
    });
    if (!session) throw new NotFoundException('Council session not found');

    const result = session.result ? JSON.parse(session.result) as unknown : null;
    return {
      session_id: session.id,
      status: session.status.toLowerCase(),
      task: session.task,
      result,
      error: session.errorMsg ?? null,
      created_at: session.createdAt,
      updated_at: session.updatedAt,
    };
  }

  async getMessages(sessionId: string, userId: string) {
    const session = await this.prisma.councilSession.findFirst({
      where: { id: sessionId, userId },
      select: { id: true },
    });
    if (!session) throw new NotFoundException('Council session not found');

    const messages = await this.prisma.councilMessage.findMany({
      where: { sessionId },
      orderBy: [{ round: 'asc' }, { createdAt: 'asc' }],
      select: {
        id: true, agentRole: true, round: true,
        content: true, inputTokens: true, outTokens: true, createdAt: true,
      },
    });

    return {
      session_id: sessionId,
      messages: messages.map((m) => ({
        id: m.id,
        agent: m.agentRole,
        round: m.round,
        content: m.content,
        tokens: { input: m.inputTokens, output: m.outTokens },
        created_at: m.createdAt,
      })),
    };
  }

  async listSessions(userId: string, limit = 20) {
    const sessions = await this.prisma.councilSession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: Math.min(limit, 100),
      select: {
        id: true, task: true, status: true,
        createdAt: true, updatedAt: true,
      },
    });
    return sessions.map((s) => ({
      session_id: s.id,
      task: s.task.length > 120 ? s.task.slice(0, 117) + '...' : s.task,
      status: s.status.toLowerCase(),
      created_at: s.createdAt,
      updated_at: s.updatedAt,
    }));
  }

  // ── Core orchestration ────────────────────────────────────────────────────

  private async runCouncil(
    sessionId: string,
    userId: string,
    task: string,
    context?: Record<string, unknown>,
  ) {
    await this.prisma.councilSession.update({
      where: { id: sessionId },
      data: { status: 'RUNNING' },
    });

    const turns: AgentTurn[] = [];

    // ── Round 1: Architect plans ─────────────────────────────────────────
    const archPlan = await this.callAgent('architect', 1, task, context, []);
    turns.push(archPlan);
    await this.saveTurn(sessionId, archPlan);

    // Persist architect plan to memory
    await this.memory.set(userId, 'architect', `session/${sessionId}/plan`, archPlan.content).catch(() => {});
    await this.memory.logEvent(userId, 'architect', 'decision', {
      sessionId, round: 1, summary: archPlan.content.slice(0, 300),
    }).catch(() => {});

    // ── Round 2: Devs + QA + Security in parallel ────────────────────────
    const round2Roles: AgentRole[] = ['dev-1', 'dev-2', 'dev-3', 'qa', 'security'];
    const round2Results = await Promise.all(
      round2Roles.map((role) =>
        this.callAgent(role, 2, task, context, turns).then(async (turn) => {
          await this.saveTurn(sessionId, turn);
          await this.memory.set(userId, role, `session/${sessionId}/round2`, turn.content).catch(() => {});
          return turn;
        }),
      ),
    );
    turns.push(...round2Results);

    // ── Round 3: Architect synthesizes ───────────────────────────────────
    const synthesis = await this.callAgent('architect', 3, task, context, turns, true);
    turns.push(synthesis);
    await this.saveTurn(sessionId, synthesis);

    const result = {
      plan: archPlan.content,
      synthesis: synthesis.content,
      agent_outputs: round2Results.map((t) => ({
        agent: t.role,
        output: t.content,
      })),
      total_tokens: turns.reduce((sum, t) => sum + t.inputTokens + t.outTokens, 0),
    };

    await this.memory.set(userId, 'shared', `council/${sessionId}/result`, result).catch(() => {});

    await this.prisma.councilSession.update({
      where: { id: sessionId },
      data: { status: 'COMPLETED', result: JSON.stringify(result) },
    });
  }

  private async callAgent(
    role: AgentRole,
    round: number,
    task: string,
    context: Record<string, unknown> | undefined,
    priorTurns: AgentTurn[],
    isSynthesis = false,
  ): Promise<AgentTurn> {
    const userContent = this.buildUserMessage(role, round, task, context, priorTurns, isSynthesis);

    const response = await this.anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS_PER_TURN,
      system: SYSTEM_PROMPTS[role],
      messages: [{ role: 'user', content: userContent }],
    });

    const content = response.content
      .filter((b) => b.type === 'text')
      .map((b) => (b as { type: 'text'; text: string }).text)
      .join('\n');

    return {
      role,
      round,
      content,
      inputTokens: response.usage.input_tokens,
      outTokens: response.usage.output_tokens,
    };
  }

  private buildUserMessage(
    role: AgentRole,
    round: number,
    task: string,
    context: Record<string, unknown> | undefined,
    priorTurns: AgentTurn[],
    isSynthesis: boolean,
  ): string {
    const lines: string[] = [];
    lines.push(`## Task\n${task}`);

    if (context && Object.keys(context).length > 0) {
      lines.push(`\n## Context\n\`\`\`json\n${JSON.stringify(context, null, 2)}\n\`\`\``);
    }

    if (priorTurns.length > 0) {
      lines.push('\n## Prior Agent Outputs');
      for (const t of priorTurns) {
        lines.push(`\n### ${t.role.toUpperCase()} (Round ${t.round})\n${t.content}`);
      }
    }

    if (isSynthesis) {
      lines.push('\n## Your Task This Round');
      lines.push(
        'Synthesize all agent outputs above into a final, actionable result. ' +
        'Address all security concerns. Resolve conflicts between agent recommendations. ' +
        'Produce the definitive implementation plan or answer.',
      );
    } else if (round === 1) {
      lines.push('\n## Your Task This Round\nAnalyze the task and produce your initial plan.');
    } else {
      lines.push(
        `\n## Your Task This Round\nReview the architect's plan and all prior outputs. ` +
        `Contribute your ${role} perspective. Build on what others said — don't repeat it.`,
      );
    }

    return lines.join('\n');
  }

  private async saveTurn(sessionId: string, turn: AgentTurn) {
    await this.prisma.councilMessage.create({
      data: {
        sessionId,
        agentRole: turn.role,
        round: turn.round,
        content: turn.content,
        inputTokens: turn.inputTokens,
        outTokens: turn.outTokens,
      },
    });
  }
}
