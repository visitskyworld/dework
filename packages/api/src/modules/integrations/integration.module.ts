import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CqrsModule } from "@nestjs/cqrs";
import { OrganizationIntegration } from "@dewo/api/models/OrganizationIntegration";
import { ProjectIntegration } from "@dewo/api/models/ProjectIntegration";
import { IntegrationService } from "./integration.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([OrganizationIntegration, ProjectIntegration]),
    CqrsModule,
  ],
  providers: [IntegrationService],
  exports: [IntegrationService],
})
export class IntegrationModule {}
