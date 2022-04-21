import { Project } from "@dewo/api/models/Project";
import { ProjectSection } from "@dewo/api/models/ProjectSection";
import { ProjectTokenGate } from "@dewo/api/models/ProjectTokenGate";
import { TaskGatingDefault } from "@dewo/api/models/TaskGatingDefault";
import { TaskSection } from "@dewo/api/models/TaskSection";
import { TaskTag } from "@dewo/api/models/TaskTag";
import { User } from "@dewo/api/models/User";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PaymentModule } from "../payment/payment.module";
import { PermalinkModule } from "../permalink/permalink.module";
import { RbacModule } from "../rbac/rbac.module";
import { TaskViewModule } from "../task/taskView/taskView.module";
import { ProjectResolver } from "./project.resolver";
import { ProjectService } from "./project.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
      ProjectTokenGate,
      ProjectSection,
      User,
      TaskSection,
      TaskTag,
      TaskGatingDefault,
    ]),
    PermalinkModule,
    PaymentModule,
    RbacModule,
    TaskViewModule,
  ],
  providers: [ProjectResolver, ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
