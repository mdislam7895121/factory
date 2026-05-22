import { Module } from '@nestjs/common';
import { PairProgrammerController } from './pair-programmer.controller';
import { PairProgrammerService } from './pair-programmer.service';

@Module({
  controllers: [PairProgrammerController],
  providers: [PairProgrammerService],
  exports: [PairProgrammerService],
})
export class PairProgrammerModule {}
