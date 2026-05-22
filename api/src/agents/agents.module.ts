import { Module } from '@nestjs/common';
import { AgentsController } from './agents.controller';
import { AgentClassifierService } from './agent-classifier.service';
import { PromptRouterService } from './prompt-router.service';
import { GuardedExpertPolicyService } from './guarded-expert-policy.service';
import { DomainTemplateService } from './domain-template.service';
import { StartupIntelligenceService } from './startup-intelligence.service';
import { CouncilService } from './council.service';

@Module({
  controllers: [AgentsController],
  providers: [AgentClassifierService, PromptRouterService, GuardedExpertPolicyService, DomainTemplateService, StartupIntelligenceService, CouncilService],
  exports: [AgentClassifierService, PromptRouterService, GuardedExpertPolicyService, DomainTemplateService, StartupIntelligenceService, CouncilService],
})
export class AgentsModule {}
