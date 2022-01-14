import { Organization } from "@dewo/api/models/Organization";
import { OrganizationMember } from "@dewo/api/models/OrganizationMember";
import { Project } from "@dewo/api/models/Project";
import { ProjectMember } from "@dewo/api/models/ProjectMember";
import { Task } from "@dewo/api/models/Task";
import { User } from "@dewo/api/models/User";
import { EntityDetail } from "@dewo/api/models/EntityDetail";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CaslModule } from "nest-casl";
import { permissions } from "../auth/permissions";
import { ThreepidModule } from "../threepid/threepid.module";
import { UserResolver } from "./user.resolver";
import { UserService } from "./user.service";
import { PaymentModule } from "../payment/payment.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      EntityDetail,
      Organization,
      Project,
      Task,
      ProjectMember,
      OrganizationMember,
    ]),
    CaslModule.forFeature({ permissions }),
    ThreepidModule,
    PaymentModule,
  ],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
