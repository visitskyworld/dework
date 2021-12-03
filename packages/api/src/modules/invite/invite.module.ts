import { Invite } from "@dewo/api/models/Invite";
import { User } from "@dewo/api/models/User";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrganizationModule } from "../organization/organization.module";
import { InviteResolver } from "./invite.resolver";
import { InviteService } from "./invite.service";

@Module({
  imports: [TypeOrmModule.forFeature([User, Invite]), OrganizationModule],
  providers: [InviteResolver, InviteService],
  exports: [InviteService],
})
export class InviteModule {}
