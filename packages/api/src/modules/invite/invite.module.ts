import { Invite } from "@dewo/api/models/Invite";
import { OrganizationMember } from "@dewo/api/models/OrganizationMember";
import { Project } from "@dewo/api/models/Project";
import { ProjectMember } from "@dewo/api/models/ProjectMember";
import { User } from "@dewo/api/models/User";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CaslModule } from "nest-casl";
import { permissions } from "../auth/permissions";
import { OrganizationModule } from "../organization/organization.module";
import { PaymentModule } from "../payment/payment.module";
import { ProjectModule } from "../project/project.module";
import { InviteResolver } from "./invite.resolver";
import { InviteService } from "./invite.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Invite,
      OrganizationMember,
      ProjectMember,
      Project,
    ]),
    CaslModule.forFeature({ permissions }),
    ProjectModule,
    OrganizationModule,
    PaymentModule,
  ],
  providers: [InviteResolver, InviteService],
  exports: [InviteService],
})
export class InviteModule {}
