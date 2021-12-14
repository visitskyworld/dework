import { Organization } from "@dewo/api/models/Organization";
import { OrganizationMember } from "@dewo/api/models/OrganizationMember";
import { Project } from "@dewo/api/models/Project";
import { Task } from "@dewo/api/models/Task";
import { User } from "@dewo/api/models/User";
import { UserDetail } from "@dewo/api/models/UserDetail";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CaslModule } from "nest-casl";
import { permissions } from "../auth/permissions";
import { OrganizationModule } from "../organization/organization.module";
import { TaskModule } from "../task/task.module";
import { ThreepidModule } from "../threepid/threepid.module";
import { UserResolver } from "./user.resolver";
import { UserService } from "./user.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserDetail,
      Organization,
      Project,
      Task,
      OrganizationMember,
    ]),
    CaslModule.forFeature({ permissions }),
    ThreepidModule,
    TaskModule,
    OrganizationModule,
  ],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
