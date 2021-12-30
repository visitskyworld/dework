import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrganizationIntegration } from "@dewo/api/models/OrganizationIntegration";
import { ProjectIntegration } from "@dewo/api/models/ProjectIntegration";
import { IntegrationService } from "./integration.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([OrganizationIntegration, ProjectIntegration]),
  ],
  providers: [IntegrationService],
  exports: [IntegrationService],
})
export class IntegrationModule {}
