import { Organization } from "@dewo/api/models/Organization";
import { OrganizationMember } from "@dewo/api/models/OrganizationMember";
import { Project } from "@dewo/api/models/Project";
import { User } from "@dewo/api/models/User";
import { EntityDetail } from "@dewo/api/models/EntityDetail";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CaslModule } from "nest-casl";
import { permissions } from "../auth/permissions";
import { PermalinkModule } from "../permalink/permalink.module";
import { OrganizationResolver } from "./organization.resolver";
import { OrganizationService } from "./organization.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Organization,
      User,
      OrganizationMember,
      Project,
      EntityDetail,
    ]),
    CaslModule.forFeature({ permissions }),
    PermalinkModule,
  ],
  providers: [OrganizationResolver, OrganizationService],
  exports: [OrganizationService],
})
export class OrganizationModule {}
