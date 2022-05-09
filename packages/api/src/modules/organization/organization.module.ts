import { Organization } from "@dewo/api/models/Organization";
import { Project } from "@dewo/api/models/Project";
import { User } from "@dewo/api/models/User";
import { OrganizationTag } from "@dewo/api/models/OrganizationTag";
import { EntityDetail } from "@dewo/api/models/EntityDetail";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PermalinkModule } from "../permalink/permalink.module";
import {
  OrganizationResolver,
  UserOrganizationsResolver,
} from "./organization.resolver";
import { OrganizationService } from "./organization.service";
import { ProjectTokenGate } from "@dewo/api/models/ProjectTokenGate";
import { RbacModule } from "../rbac/rbac.module";
import { Role } from "@dewo/api/models/rbac/Role";
import { TaskViewModule } from "../task/taskView/taskView.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Organization,
      User,
      Project,
      ProjectTokenGate,
      OrganizationTag,
      Role,
      EntityDetail,
    ]),
    PermalinkModule,
    RbacModule,
    TaskViewModule,
  ],
  providers: [
    OrganizationResolver,
    UserOrganizationsResolver,
    OrganizationService,
  ],
  exports: [OrganizationService],
})
export class OrganizationModule {}
