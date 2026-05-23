import { Controller, Get } from '@nestjs/common';
import { PublicStatusService } from './public-status.service';
import { PublicStatusResponse } from './public-status.types';

@Controller('v1/public')
export class PublicStatusController {
  constructor(private readonly svc: PublicStatusService) {}

  @Get('status')
  async getStatus(): Promise<PublicStatusResponse> {
    return this.svc.getStatus();
  }
}
