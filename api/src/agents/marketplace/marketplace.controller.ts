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
import { IsString, MaxLength } from 'class-validator';
import { MarketplaceService } from './marketplace.service';
import type { PricingModel } from './agent-manifest.types';

class InstallDto {
  @IsString()
  packSlug!: string;

  @IsString()
  workspaceId!: string;

  @IsString()
  userId!: string;
}

class UninstallDto {
  @IsString()
  packSlug!: string;

  @IsString()
  workspaceId!: string;
}

class SearchQueryDto {
  query?:        string;
  category?:     string;
  tags?:         string;  // comma-separated
  regulated?:    string;  // 'true' | 'false'
  pricingModel?: PricingModel;
  sortBy?:       'INSTALL_COUNT' | 'RATING' | 'NEWEST' | 'NAME';
}

@Controller('v1/marketplace')
export class MarketplaceController {
  constructor(private readonly marketplace: MarketplaceService) {}

  // 17-04: GET /v1/marketplace/packs — list all packs with optional search/filter/sort
  @Get('packs')
  listPacks(@Query() query: SearchQueryDto) {
    const packs = this.marketplace.listPacks({
      query:        query.query,
      category:     query.category,
      tags:         query.tags ? query.tags.split(',').map((t) => t.trim()) : undefined,
      regulated:    query.regulated !== undefined ? query.regulated === 'true' : undefined,
      pricingModel: query.pricingModel,
      sortBy:       query.sortBy,
    });
    return { ok: true, total: packs.length, packs };
  }

  // 17-04: GET /v1/marketplace/packs/:slug — single pack detail
  @Get('packs/:slug')
  getPack(@Param('slug') slug: string) {
    const pack = this.marketplace.getPack(slug);
    return { ok: true, pack };
  }

  // 17-04: POST /v1/marketplace/install — install a pack into a workspace
  @Post('install')
  @HttpCode(HttpStatus.OK)
  install(@Body() dto: InstallDto) {
    const result = this.marketplace.install({
      packSlug:    dto.packSlug,
      workspaceId: dto.workspaceId,
      userId:      dto.userId,
    });
    return { ok: true, result };
  }

  // 17-04: POST /v1/marketplace/uninstall — remove a pack from a workspace
  @Post('uninstall')
  @HttpCode(HttpStatus.OK)
  uninstall(@Body() dto: UninstallDto) {
    const result = this.marketplace.uninstall(dto.packSlug, dto.workspaceId);
    return { ok: true, result };
  }

  // 17-04: GET /v1/marketplace/installed/:workspaceId — list installed packs
  @Get('installed/:workspaceId')
  getInstalled(@Param('workspaceId') workspaceId: string) {
    const packs = this.marketplace.getInstalledPacks(workspaceId);
    return { ok: true, total: packs.length, packs };
  }
}
