import { Module } from "@nestjs/common";
import { TrelloImportService } from "./trello.import.service";
import { ProjectModule } from "../../project/project.module";
import { TaskModule } from "../../task/task.module";
import { TrelloResolver } from "./trello.resolver";
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
  providers: [TrelloImportService, TrelloResolver],
})
export class TrelloModule {}
