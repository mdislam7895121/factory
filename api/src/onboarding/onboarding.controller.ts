import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { OnboardingStep } from './onboarding.types';

interface RecordEventDto {
  step: string;
  meta?: Record<string, unknown>;
}

@Controller()
export class OnboardingController {
  constructor(private readonly svc: OnboardingService) {}

  @Get('v1/onboarding/:userId')
  getProfile(@Param('userId') userId: string) {
    return this.svc.createOrGet(userId);
  }

  @Post('v1/onboarding/:userId/event')
  recordEvent(@Param('userId') userId: string, @Body() dto: RecordEventDto) {
    const validSteps: OnboardingStep[] = [
      'ROLE_SELECTED','TECH_LEVEL_SET','GOAL_SET','PATH_CHOSEN',
      'IDEA_ENTERED','DEMO_STARTED','BLUEPRINT_VIEWED','COUNCIL_WATCHED',
      'PREVIEW_REVEALED','PREVIEW_SHARED','MEMORY_SAVED','WORKSPACE_CREATED','TEAMMATE_INVITED',
    ];
    if (!validSteps.includes(dto.step as OnboardingStep)) {
      return { error: 'Invalid step', validSteps };
    }
    return this.svc.recordEvent(userId, dto.step as OnboardingStep, dto.meta);
  }

  @Get('v1/onboarding/:userId/checklist')
  getChecklist(@Param('userId') userId: string) {
    this.svc.createOrGet(userId);
    return this.svc.getChecklist(userId);
  }

  @Get('v1/onboarding/:userId/next-action')
  getNextAction(@Param('userId') userId: string) {
    return this.svc.getNextAction(userId);
  }
}
