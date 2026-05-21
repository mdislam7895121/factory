import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { IsString, MaxLength } from 'class-validator';
import { AGENT_REGISTRY, getAgent, getCategories, type AgentCategory, type AgentKind } from './agent-registry';
import { AgentClassifierService } from './agent-classifier.service';
import { PromptRouterService } from './prompt-router.service';
import { GuardedExpertPolicyService } from './guarded-expert-policy.service';

class PreviewSelectionDto {
  @IsString()
  @MaxLength(500)
  prompt!: string;
}

class GuardDto {
  @IsString()
  @MaxLength(500)
  prompt!: string;

  agentIds!: string[];
  context?: string;
}

@Controller('v1/agents')
export class AgentsController {
  constructor(
    private readonly classifier: AgentClassifierService,
    private readonly router: PromptRouterService,
    private readonly policyService: GuardedExpertPolicyService,
  ) {}

  // 12-04: GET /v1/agents — list all agents (optionally filtered)
  @Get()
  listAgents(
    @Query('kind')     kind:     AgentKind     | undefined,
    @Query('category') category: AgentCategory | undefined,
  ) {
    let agents = AGENT_REGISTRY;
    if (kind)     agents = agents.filter((a) => a.kind     === kind);
    if (category) agents = agents.filter((a) => a.category === category);
    return {
      ok: true,
      total: agents.length,
      agents: agents.map((a) => this.classifier.toPublicAgent(a)),
    };
  }

  // 12-04: GET /v1/agents/categories — list distinct categories
  // NOTE: declared BEFORE /:id to prevent "categories" being matched as an :id param
  @Get('categories')
  listCategories() {
    const categories = getCategories();
    const counts: Record<string, number> = {};
    for (const a of AGENT_REGISTRY) {
      counts[a.category] = (counts[a.category] ?? 0) + 1;
    }
    return {
      ok: true,
      categories: categories.map((c) => ({
        category: c,
        count: counts[c] ?? 0,
      })),
    };
  }

  // 12-04: GET /v1/agents/:id — single agent
  @Get(':id')
  getAgent(@Param('id') id: string) {
    const agent = getAgent(id);
    if (!agent) throw new NotFoundException(`Agent '${id}' not found`);
    return { ok: true, agent: this.classifier.toPublicAgent(agent) };
  }

  // 12-05: POST /v1/agents/preview-selection — classify prompt, select agents
  @Post('preview-selection')
  @HttpCode(HttpStatus.OK)
  previewSelection(@Body() dto: PreviewSelectionDto) {
    const result = this.classifier.classify(dto.prompt);
    return { ok: true, ...result };
  }

  // 13-03: POST /v1/agents/route — full routing with co-agents, risk, template, next actions
  @Post('route')
  @HttpCode(HttpStatus.OK)
  route(@Body() dto: PreviewSelectionDto) {
    const result = this.router.route(dto.prompt);
    return { ok: true, ...result };
  }

  // 14-03: POST /v1/agents/guard — evaluate a prompt against regulated agent policy
  // Returns public-safe scopes, disclaimers, and safe rewrite. No chain-of-thought.
  @Post('guard')
  @HttpCode(HttpStatus.OK)
  guard(@Body() dto: GuardDto) {
    const agentIds = Array.isArray(dto.agentIds) ? dto.agentIds : [];
    const result = this.policyService.guard(agentIds, dto.prompt ?? '', dto.context);
    return { ok: true, ...result };
  }
}
