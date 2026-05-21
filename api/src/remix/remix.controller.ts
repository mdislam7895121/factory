import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength as MaxLengthDecorator,
} from 'class-validator';
import type { Request } from 'express';
import { RuntimeVisibility } from '../generated/prisma';
import { ApiKeyGuard } from '../sandbox/api-key.guard';
import { RemixService } from './remix.service';

class RemixDto {
  @IsOptional()
  @IsString()
  @MaxLengthDecorator(2000)
  remixPrompt?: string;

  @IsOptional()
  @IsEnum(RuntimeVisibility)
  visibility?: RuntimeVisibility;

  @IsOptional()
  @IsString()
  password?: string;
}

class AllowRemixDto {
  @IsBoolean()
  allow!: boolean;
}

@Controller()
export class RemixController {
  constructor(private readonly remixService: RemixService) {}

  // 06-02: Authenticated remix via runtime ID
  @UseGuards(ApiKeyGuard)
  @Post('v1/remix/:runtimeId')
  @HttpCode(HttpStatus.CREATED)
  async remix(
    @Param('runtimeId') runtimeId: string,
    @Body() dto: RemixDto,
    @Req() req: Request,
  ) {
    return this.remixService.remix({
      sourceId:    runtimeId,
      ownerUserId: req['userId'] as string,
      remixPrompt: dto.remixPrompt,
      visibility:  dto.visibility,
      password:    dto.password,
      ip:          this.remixService.extractIp(req as Parameters<RemixService['extractIp']>[0]),
    });
  }

  // 06-10: Mobile-friendly remix from preview URL (requires API key for ownership)
  @UseGuards(ApiKeyGuard)
  @Post('p/:previewId/remix')
  @HttpCode(HttpStatus.CREATED)
  async remixFromPreview(
    @Param('previewId') previewId: string,
    @Body() dto: RemixDto,
    @Req() req: Request,
  ) {
    return this.remixService.remix({
      sourceId:    previewId,
      ownerUserId: req['userId'] as string,
      remixPrompt: dto.remixPrompt,
      visibility:  dto.visibility,
      password:    dto.password,
      ip:          this.remixService.extractIp(req as Parameters<RemixService['extractIp']>[0]),
    });
  }

  // 06-07: Toggle allow-remix flag (owner only)
  @UseGuards(ApiKeyGuard)
  @Patch('v1/remix/:runtimeId/allow')
  @HttpCode(HttpStatus.OK)
  async setAllowRemix(
    @Param('runtimeId') runtimeId: string,
    @Body() dto: AllowRemixDto,
    @Req() req: Request,
  ) {
    return this.remixService.setAllowRemix(
      runtimeId,
      req['userId'] as string,
      dto.allow,
    );
  }

  // 06-03: Prompt lineage — ancestry chain for a runtime
  @UseGuards(ApiKeyGuard)
  @Get('v1/remix/:runtimeId/lineage')
  getLineage(@Param('runtimeId') runtimeId: string) {
    return this.remixService.getLineage(runtimeId);
  }

  // 06-09: Activity feed — recent remix events for the authenticated user
  @UseGuards(ApiKeyGuard)
  @Get('v1/remix/activity')
  getActivity(@Req() req: Request) {
    return this.remixService.getActivity(req['userId'] as string);
  }
}
