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
import { DomainTemplateService } from './domain-template.service';
import { StartupIntelligenceService } from './startup-intelligence.service';
import { CouncilService } from './council.service';

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

class TemplateRecommendDto {
  @IsString()
  @MaxLength(500)
  prompt!: string;
}

class BlueprintDto {
  @IsString()
  @MaxLength(500)
  prompt!: string;

  domainAgentIds?: string[];
  suggestedTemplateId?: string;
}

class CouncilDto {
  @IsString()
  @MaxLength(500)
  prompt!: string;

  domainAgentIds?: string[];
  suggestedTemplateId?: string;
}

@Controller('v1/agents')
export class AgentsController {
  constructor(
    private readonly classifier: AgentClassifierService,
    private readonly router: PromptRouterService,
    private readonly policyService: GuardedExpertPolicyService,
    private readonly templateService: DomainTemplateService,
    private readonly startupIntelligence: StartupIntelligenceService,
    private readonly councilService: CouncilService,
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

  // 15-04: GET /v1/agents/domain-templates — list all domain templates
  // NOTE: declared BEFORE domain-templates/:id to prevent routing collision
  @Get('domain-templates')
  listDomainTemplates() {
    return { ok: true, total: this.templateService.getAll().length, templates: this.templateService.getAll() };
  }

  // 15-04: POST /v1/agents/domain-templates/recommend — recommend templates from prompt
  @Post('domain-templates/recommend')
  @HttpCode(HttpStatus.OK)
  recommendTemplates(@Body() dto: TemplateRecommendDto) {
    const routeResult = this.router.route(dto.prompt ?? '');
    const domainAgentIds = routeResult.domainAgents.map((a) => a.id);
    const result = this.templateService.recommendFull(domainAgentIds, routeResult.suggestedTemplate);
    return { ok: true, ...result };
  }

  // 15-04: GET /v1/agents/domain-templates/:id — single domain template
  @Get('domain-templates/:id')
  getDomainTemplate(@Param('id') id: string) {
    const template = this.templateService.getById(id);
    if (!template) throw new NotFoundException(`Domain template '${id}' not found`);
    return { ok: true, template };
  }

  // 15-17: POST /v1/agents/blueprint — full startup intelligence blueprint
  @Post('blueprint')
  @HttpCode(HttpStatus.OK)
  buildBlueprint(@Body() dto: BlueprintDto) {
    const prompt = dto.prompt ?? '';
    const routeResult = this.router.route(prompt);
    const agentIds = Array.isArray(dto.domainAgentIds) && dto.domainAgentIds.length > 0
      ? dto.domainAgentIds
      : routeResult.domainAgents.map((a) => a.id);
    const suggestedId = dto.suggestedTemplateId ?? routeResult.suggestedTemplate;
    const blueprint = this.startupIntelligence.buildStartupBlueprint(prompt, agentIds, suggestedId);
    return { ok: true, blueprint };
  }

  // 16-01: POST /v1/agents/council — run full multi-agent council session
  @Post('council')
  @HttpCode(HttpStatus.OK)
  runCouncil(@Body() dto: CouncilDto) {
    const prompt = dto.prompt ?? '';
    const routeResult = this.router.route(prompt);
    const agentIds = Array.isArray(dto.domainAgentIds) && dto.domainAgentIds.length > 0
      ? dto.domainAgentIds
      : routeResult.domainAgents.map((a) => a.id);
    const suggestedId = dto.suggestedTemplateId ?? routeResult.suggestedTemplate;
    const session = this.councilService.runSession(prompt, agentIds, suggestedId);
    return { ok: true, session };
  }
}
