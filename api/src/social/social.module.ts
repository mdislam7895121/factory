import { Module } from '@nestjs/common';
import { CreatorProfileService } from './creator-profile.service';
import { SocialSignalService } from './social-signal.service';
import { SocialController } from './social.controller';

@Module({
  controllers: [SocialController],
  providers:   [CreatorProfileService, SocialSignalService],
  exports:     [CreatorProfileService, SocialSignalService],
})
export class SocialModule {}
