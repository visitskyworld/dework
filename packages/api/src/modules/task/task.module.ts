import { OrganizationMember } from "@dewo/api/models/OrganizationMember";
import { Project } from "@dewo/api/models/Project";
import { Task } from "@dewo/api/models/Task";
import { TaskReward } from "@dewo/api/models/TaskReward";
import { TaskApplication } from "@dewo/api/models/TaskApplication";
import { User } from "@dewo/api/models/User";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CaslModule } from "nest-casl";
import { permissions } from "../auth/permissions";
import { PaymentModule } from "../payment/payment.module";
import { ProjectModule } from "../project/project.module";
import {
  OrganizationTasksResolver,
  ProjectTasksResolver,
  TaskResolver,
  UserTasksResolver,
} from "./task.resolver";
import { TaskRolesGuard } from "./task.roles.guard";
import { TaskService } from "./task.service";
import { PermalinkModule } from "../permalink/permalink.module";
import { ProjectMember } from "@dewo/api/models/ProjectMember";
import { TaskReaction } from "@dewo/api/models/TaskReaction";
import { TaskSubmission } from "@dewo/api/models/TaskSubmission";
import { TaskSection } from "@dewo/api/models/TaskSection";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Task,
      TaskReward,
      TaskApplication,
      TaskSubmission,
      TaskReaction,
      TaskSection,
      Project,
      User,
      ProjectMember,
      OrganizationMember,
    ]),
    CaslModule.forFeature({ permissions }),
    CqrsModule,
    PaymentModule,
    ProjectModule,
    PermalinkModule,
  ],
  providers: [
    TaskResolver,
    OrganizationTasksResolver,
    ProjectTasksResolver,
    UserTasksResolver,
    TaskService,
    TaskRolesGuard,
  ],
  exports: [TaskService],
})
export class TaskModule {}
