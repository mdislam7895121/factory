import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { BetaService } from './beta.service';

class ValidateBetaDto {
  @IsOptional()
  @IsString()
  @MaxLength(64)
  inviteCode?: string;
}

@Controller('beta')
export class BetaController {
  constructor(private readonly betaService: BetaService) {}

  // 10-08: Public — returns current beta mode
  @Get('status')
  status() {
    return this.betaService.getStatus();
  }

  // 10-08: Public — validate invite code (does not redeem it)
  @Post('validate')
  @HttpCode(HttpStatus.OK)
  async validate(@Body() dto: ValidateBetaDto) {
    await this.betaService.validateAccess(dto.inviteCode);
    return { ok: true, message: 'Access granted' };
  }
}
