import { Organization } from "@dewo/api/models/Organization";
import { OrganizationMember } from "@dewo/api/models/OrganizationMember";
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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Organization,
      User,
      OrganizationMember,
      Project,
      ProjectTokenGate,
      OrganizationTag,
      EntityDetail,
    ]),
    PermalinkModule,
    RbacModule,
  ],
  providers: [
    OrganizationResolver,
    UserOrganizationsResolver,
    OrganizationService,
  ],
  exports: [OrganizationService],
})
export class OrganizationModule {}
