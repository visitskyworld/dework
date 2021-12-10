import { Organization } from "@dewo/api/models/Organization";
import { OrganizationMember } from "@dewo/api/models/OrganizationMember";
import { User } from "@dewo/api/models/User";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CaslModule } from "nest-casl";
import { permissions } from "../auth/permissions";
import { OrganizationResolver } from "./organization.resolver";
import { OrganizationService } from "./organization.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Organization, User, OrganizationMember]),
    CaslModule.forFeature({ permissions }),
  ],
  providers: [OrganizationResolver, OrganizationService],
  exports: [OrganizationService],
})
export class OrganizationModule {}
