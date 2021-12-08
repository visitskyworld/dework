import { Organization } from "@dewo/api/models/Organization";
import { User } from "@dewo/api/models/User";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CaslModule } from "nest-casl";
import { permissions } from "../auth/permissions";
import { TaskModule } from "../task/task.module";
import { OrganizationResolver } from "./organization.resolver";
import { OrganizationService } from "./organization.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Organization, User]),
    CaslModule.forFeature({ permissions }),
    TaskModule,
  ],
  providers: [OrganizationResolver, OrganizationService],
  exports: [OrganizationService],
})
export class OrganizationModule {}
