import { OrganizationMember } from "@dewo/api/models/OrganizationMember";
import { Project } from "@dewo/api/models/Project";
import { ProjectMember } from "@dewo/api/models/ProjectMember";
import { ProjectSection } from "@dewo/api/models/ProjectSection";
import { ProjectTokenGate } from "@dewo/api/models/ProjectTokenGate";
import { TaskSection } from "@dewo/api/models/TaskSection";
import { TaskTag } from "@dewo/api/models/TaskTag";
import { User } from "@dewo/api/models/User";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IntegrationModule } from "../integrations/integration.module";
import { PaymentModule } from "../payment/payment.module";
import { PermalinkModule } from "../permalink/permalink.module";
import { RbacModule } from "../rbac/rbac.module";
import { ProjectResolver } from "./project.resolver";
import { ProjectService } from "./project.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
      ProjectMember,
      ProjectTokenGate,
      ProjectSection,
      User,
      TaskSection,
      TaskTag,
      OrganizationMember,
    ]),
    PermalinkModule,
    IntegrationModule,
    PaymentModule,
    RbacModule,
  ],
  providers: [ProjectResolver, ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
