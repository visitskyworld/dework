import { OrganizationMember } from "@dewo/api/models/OrganizationMember";
import { Project } from "@dewo/api/models/Project";
import { Task } from "@dewo/api/models/Task";
import { User } from "@dewo/api/models/User";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CaslModule } from "nest-casl";
import { permissions } from "../auth/permissions";
import {
  OrganizationTasksResolver,
  ProjectTasksResolver,
  TaskResolver,
} from "./task.resolver";
import { TaskRolesGuard } from "./task.roles.guard";
import { TaskService } from "./task.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, Project, User, OrganizationMember]),
    CaslModule.forFeature({ permissions }),
  ],
  providers: [
    TaskResolver,
    OrganizationTasksResolver,
    ProjectTasksResolver,
    TaskService,
    TaskRolesGuard,
  ],
  exports: [TaskService],
})
export class TaskModule {}
