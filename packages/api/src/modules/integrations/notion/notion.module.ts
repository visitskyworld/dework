import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProjectIntegration } from "@dewo/api/models/ProjectIntegration";
import { NotionImportService } from "./notion.import.service";
import { ProjectModule } from "../../project/project.module";
import { TaskModule } from "../../task/task.module";
import { NotionResolver } from "./notion.resolver";
import { ThreepidModule } from "../../threepid/threepid.module";
import { OrganizationModule } from "../../organization/organization.module";
import { OrganizationMember } from "@dewo/api/models/OrganizationMember";
import { CaslModule } from "nest-casl";
import { permissions } from "../../auth/permissions";

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectIntegration, OrganizationMember]),
    OrganizationModule,
    ProjectModule,
    TaskModule,
    ThreepidModule,
    CaslModule.forFeature({ permissions }),
  ],
  providers: [NotionImportService, NotionResolver],
})
export class NotionModule {}
