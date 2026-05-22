import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { RbacService } from './rbac.service';

@Module({
  controllers: [OrganizationController],
  providers: [OrganizationService, RbacService],
  exports: [OrganizationService, RbacService],
})
export class OrganizationModule {}
