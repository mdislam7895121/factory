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

class PreviewSelectionDto {
  @IsString()
  @MaxLength(500)
  prompt!: string;
}

@Controller('v1/agents')
export class AgentsController {
  constructor(private readonly classifier: AgentClassifierService) {}

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
}
