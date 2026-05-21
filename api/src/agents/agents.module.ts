import { Module } from '@nestjs/common';
import { AgentsController } from './agents.controller';
import { AgentClassifierService } from './agent-classifier.service';
import { PromptRouterService } from './prompt-router.service';
import { GuardedExpertPolicyService } from './guarded-expert-policy.service';

@Module({
  controllers: [AgentsController],
  providers: [AgentClassifierService, PromptRouterService, GuardedExpertPolicyService],
  exports: [AgentClassifierService, PromptRouterService, GuardedExpertPolicyService],
})
export class AgentsModule {}
