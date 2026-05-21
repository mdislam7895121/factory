import { Module } from '@nestjs/common';
import { AgentsController } from './agents.controller';
import { AgentClassifierService } from './agent-classifier.service';

@Module({
  controllers: [AgentsController],
  providers: [AgentClassifierService],
  exports: [AgentClassifierService],
})
export class AgentsModule {}
