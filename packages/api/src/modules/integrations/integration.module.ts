import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CqrsModule } from "@nestjs/cqrs";
import { OrganizationIntegration } from "@dewo/api/models/OrganizationIntegration";
import { ProjectIntegration } from "@dewo/api/models/ProjectIntegration";
import { IntegrationService } from "./integration.service";
import { IntegrationResolver } from "./integration.resolver";
import { RbacModule } from "../rbac/rbac.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([OrganizationIntegration, ProjectIntegration]),
    CqrsModule,
    RbacModule,
  ],
  providers: [IntegrationService, IntegrationResolver],
  exports: [IntegrationService],
})
export class IntegrationModule {}
