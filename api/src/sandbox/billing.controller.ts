import {
  Controller, Post, Body, UseGuards, Req,
  Headers, HttpCode, HttpStatus,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import { IsInt, IsIn } from 'class-validator';
import { ApiKeyGuard } from './api-key.guard';
import { BillingService } from './billing.service';

class TopUpDto {
  @IsInt()
  @IsIn([5, 10, 25, 50, 100])
  amount_usd!: number;
}

@Controller('v1/billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @UseGuards(ApiKeyGuard)
  @Post('checkout')
  checkout(
    @Body() dto: TopUpDto,
    @Req() req: Request & { apiUserId: string },
  ) {
    return this.billingService.createCheckoutSession(req.apiUserId, dto.amount_usd);
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async webhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') sig: string,
  ) {
    const raw = req.rawBody;
    if (!raw) return { received: false };
    await this.billingService.handleWebhook(raw, sig);
    return { received: true };
  }
}
