import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ProvisioningService } from '../services/provisioningService';

@Injectable()
export class ProvisionWorker implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ProvisionWorker.name);
  private timer: NodeJS.Timeout | null = null;
  private running = false;

  constructor(private readonly provisioningService: ProvisioningService) {}

  onModuleInit(): void {
    this.timer = setInterval(() => {
      void this.tick();
    }, 1500);
    this.logger.log('Provision worker started');
  }

  onModuleDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private async tick(): Promise<void> {
    if (this.running) {
      return;
    }

    this.running = true;
    try {
      await this.provisioningService.processPendingJobs();
    } finally {
      this.running = false;
    }
  }
}
