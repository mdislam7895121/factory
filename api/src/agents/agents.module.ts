import { Module } from '@nestjs/common';
import { AgentsController } from './agents.controller';
import { AgentClassifierService } from './agent-classifier.service';
import { PromptRouterService } from './prompt-router.service';
import { GuardedExpertPolicyService } from './guarded-expert-policy.service';
import { DomainTemplateService } from './domain-template.service';

@Module({
  controllers: [AgentsController],
  providers: [AgentClassifierService, PromptRouterService, GuardedExpertPolicyService, DomainTemplateService],
  exports: [AgentClassifierService, PromptRouterService, GuardedExpertPolicyService, DomainTemplateService],
})
export class AgentsModule {}
