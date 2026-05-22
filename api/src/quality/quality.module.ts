import { Module } from '@nestjs/common';
import { GenerationQualityService } from './quality.service';
import { QualityController } from './quality.controller';

@Module({
  controllers: [QualityController],
  providers:   [GenerationQualityService],
  exports:     [GenerationQualityService],
})
export class QualityModule {}
