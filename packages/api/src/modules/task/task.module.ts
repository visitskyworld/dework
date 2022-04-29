import { Project } from "@dewo/api/models/Project";
import { Task } from "@dewo/api/models/Task";
import { TaskReward } from "@dewo/api/models/TaskReward";
import { User } from "@dewo/api/models/User";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PaymentModule } from "../payment/payment.module";
import {
  OrganizationTasksResolver,
  ProjectTasksResolver,
  TaskResolver,
  UserTasksResolver,
} from "./task.resolver";
import { TaskService } from "./task.service";
import { PermalinkModule } from "../permalink/permalink.module";
import { TaskReaction } from "@dewo/api/models/TaskReaction";
import { TaskSubmission } from "@dewo/api/models/TaskSubmission";
import { RbacModule } from "../rbac/rbac.module";
import { OrganizationModule } from "../organization/organization.module";
import { ProjectModule } from "../project/project.module";
import { AuditLogModule } from "../auditLog/auditLog.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Task,
      TaskReward,
      TaskSubmission,
      TaskReaction,
      Project,
      User,
    ]),
    CqrsModule,
    PaymentModule,
    ProjectModule,
    OrganizationModule,
    PermalinkModule,
    RbacModule,
    AuditLogModule,
  ],
  providers: [
    TaskResolver,
    OrganizationTasksResolver,
    ProjectTasksResolver,
    UserTasksResolver,
    TaskService,
  ],
  exports: [TaskService],
})
export class TaskModule {}
