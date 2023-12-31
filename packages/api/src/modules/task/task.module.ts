import { Project } from "@dewo/api/models/Project";
import { Task } from "@dewo/api/models/Task";
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
  WorkspaceTasksResolver,
} from "./task.resolver";
import { TaskService } from "./task.service";
import { PermalinkModule } from "../permalink/permalink.module";
import { TaskReaction } from "@dewo/api/models/TaskReaction";
import { TaskSubmission } from "@dewo/api/models/TaskSubmission";
import { RbacModule } from "../rbac/rbac.module";
import { OrganizationModule } from "../organization/organization.module";
import { ProjectModule } from "../project/project.module";
import { AuditLogModule } from "../auditLog/auditLog.module";
import { TaskApplication } from "@dewo/api/models/TaskApplication";
import { TaskRewardPayment } from "@dewo/api/models/TaskRewardPayment";
import { TaskReward } from "@dewo/api/models/TaskReward";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Task,
      TaskReward,
      TaskRewardPayment,
      TaskSubmission,
      TaskReaction,
      Project,
      User,
      TaskApplication,
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
    WorkspaceTasksResolver,
    ProjectTasksResolver,
    UserTasksResolver,
    TaskService,
  ],
  exports: [TaskService],
})
export class TaskModule {}
