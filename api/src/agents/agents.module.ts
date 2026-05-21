import { Module } from '@nestjs/common';
import { AgentsController } from './agents.controller';
import { AgentClassifierService } from './agent-classifier.service';
import { PromptRouterService } from './prompt-router.service';

@Module({
  controllers: [AgentsController],
  providers: [AgentClassifierService, PromptRouterService],
  exports: [AgentClassifierService, PromptRouterService],
})
export class AgentsModule {}
