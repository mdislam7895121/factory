import { Module } from '@nestjs/common';
import { BetaService } from './beta.service';
import { BetaController } from './beta.controller';

@Module({
  controllers: [BetaController],
  providers:   [BetaService],
  exports:     [BetaService],
})
export class BetaModule {}
