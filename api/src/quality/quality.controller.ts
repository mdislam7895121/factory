import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { GenerationQualityService } from './quality.service';
import type { EvaluateInput } from './quality.types';

// ── DTOs ─────────────────────────────────────────────────────────────────────

class EvaluateDto implements EvaluateInput {
  @IsString()               projectId!:    string;
  @IsOptional() @IsString() workspaceId?:  string;
  @IsOptional() @IsString() previewUrl?:   string;
  @IsOptional() @IsArray()  routes?:       string[];
  @IsOptional() @IsString() content?:      string;
  @IsOptional()             metadata?:     Record<string, unknown>;
}

class SmokeTestDto {
  @IsString() url!: string;
}

class RouteValidateDto {
  @IsArray() routes!: string[];
}

class MobileValidateDto {
  @IsOptional() @IsString() content?:  string;
  @IsOptional()             metadata?: Record<string, unknown>;
}

class SecurityValidateDto {
  @IsString()               projectId!: string;
  @IsOptional() @IsString() content?:   string;
  @IsOptional()             metadata?:  Record<string, unknown>;
}

class RepairCompleteDto {
  success!: boolean;
}

// ── Controller ────────────────────────────────────────────────────────────────

@Controller('v1/quality')
export class QualityController {
  constructor(private readonly quality: GenerationQualityService) {}

  // 20F-01: Full project evaluation
  @Post('evaluate')
  evaluate(@Body() dto: EvaluateDto) {
    const score = this.quality.evaluate(dto);
    return { ok: true, score };
  }

  // 20F-11: Analytics summary
  @Get('analytics/summary')
  getAnalytics() {
    return { ok: true, analytics: this.quality.getAnalytics() };
  }

  // 20F-09: Admin — low quality queue
  @Get('admin/low-score')
  getLowQualityQueue(@Query('threshold') threshold?: string) {
    const t     = threshold ? parseInt(threshold, 10) : 50;
    const queue = this.quality.getLowQualityQueue(t);
    return { ok: true, queue, total: queue.length };
  }

  // 20F-09: Admin — all scores
  @Get('admin/all')
  getAllScores() {
    const scores = this.quality.getAllScores();
    return { ok: true, scores, total: scores.length };
  }

  // 20F-02: Standalone smoke test
  @Post('smoke-test')
  @HttpCode(HttpStatus.OK)
  smokeTest(@Body() dto: SmokeTestDto) {
    const result = this.quality.runSmokeTest(dto.url);
    return { ok: true, result };
  }

  // 20F-03: Standalone route validation
  @Post('route-validate')
  @HttpCode(HttpStatus.OK)
  routeValidate(@Body() dto: RouteValidateDto) {
    const results = this.quality.validateRoutes(dto.routes);
    return { ok: true, results };
  }

  // 20F-04: Standalone mobile validation
  @Post('mobile-validate')
  @HttpCode(HttpStatus.OK)
  mobileValidate(@Body() dto: MobileValidateDto) {
    const result = this.quality.validateMobile(dto.content ?? '', dto.metadata ?? {});
    return { ok: true, result };
  }

  // 20F-10: Standalone security validation
  @Post('security-validate')
  @HttpCode(HttpStatus.OK)
  securityValidate(@Body() dto: SecurityValidateDto) {
    const result = this.quality.validateSecurity(
      dto.projectId, dto.content ?? '', dto.metadata ?? {},
    );
    return { ok: true, result };
  }

  // 20F-01: Get latest score for project
  @Get(':projectId')
  getScore(@Param('projectId') projectId: string) {
    const score = this.quality.getScore(projectId);
    return { ok: true, score };
  }

  // 20F-05: QA report for project
  @Get(':projectId/report')
  getReport(@Param('projectId') projectId: string) {
    const report = this.quality.getQAReport(projectId);
    return { ok: true, report };
  }

  // 20F-07: Readiness gate for project
  @Get(':projectId/readiness')
  getReadiness(@Param('projectId') projectId: string) {
    const score = this.quality.getScore(projectId);
    return { ok: true, readiness: score?.readinessGate ?? null };
  }

  // 20F-06: Trigger repair
  @Post(':projectId/repair')
  @HttpCode(HttpStatus.OK)
  triggerRepair(@Param('projectId') projectId: string) {
    const task = this.quality.triggerRepair(projectId);
    return { ok: true, task };
  }

  // 20F-06: Get repair status
  @Get(':projectId/repair')
  getRepair(@Param('projectId') projectId: string) {
    const task = this.quality.getRepairStatus(projectId);
    return { ok: true, task };
  }

  // 20F-06: Mark repair complete
  @Post(':projectId/repair/complete')
  @HttpCode(HttpStatus.OK)
  completeRepair(
    @Param('projectId') projectId: string,
    @Body() dto: RepairCompleteDto,
  ) {
    const task = this.quality.completeRepair(projectId, dto.success);
    return { ok: true, task };
  }
}
