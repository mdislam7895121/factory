import { Module } from '@nestjs/common';
import { BillingController } from './billing.controller';
import { LimitsService } from './limits.service';
import { SubscriptionService } from './subscription.service';
import { UsageMeterService } from './usage-meter.service';

@Module({
  controllers: [BillingController],
  providers:   [LimitsService, SubscriptionService, UsageMeterService],
  exports:     [LimitsService, SubscriptionService, UsageMeterService],
})
export class BillingModule {}
