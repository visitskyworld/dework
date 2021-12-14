import { Invite } from "@dewo/api/models/Invite";
import { OrganizationMember } from "@dewo/api/models/OrganizationMember";
import { User } from "@dewo/api/models/User";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CaslModule } from "nest-casl";
import { permissions } from "../auth/permissions";
import { OrganizationModule } from "../organization/organization.module";
import { InviteResolver } from "./invite.resolver";
import { InviteService } from "./invite.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Invite, OrganizationMember]),
    CaslModule.forFeature({ permissions }),
    OrganizationModule,
  ],
  providers: [InviteResolver, InviteService],
  exports: [InviteService],
})
export class InviteModule {}
