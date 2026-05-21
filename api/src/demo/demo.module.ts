import { Module } from '@nestjs/common';
import { ActivityStreamModule } from '../activity/activity-stream.module';
import { DemoController } from './demo.controller';
import { DemoService } from './demo.service';

@Module({
  imports: [ActivityStreamModule],
  controllers: [DemoController],
  providers: [DemoService],
})
export class DemoModule {}
