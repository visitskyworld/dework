import { Module } from "@nestjs/common";
import { NotionImportService } from "./notion.import.service";
import { ProjectModule } from "../../project/project.module";
import { TaskModule } from "../../task/task.module";
import { NotionResolver } from "./notion.resolver";
import { ThreepidModule } from "../../threepid/threepid.module";
import { OrganizationModule } from "../../organization/organization.module";
import { RbacModule } from "../../rbac/rbac.module";

@Module({
  imports: [
    OrganizationModule,
    ProjectModule,
    TaskModule,
    ThreepidModule,
    RbacModule,
  ],
  providers: [NotionImportService, NotionResolver],
})
export class NotionModule {}
