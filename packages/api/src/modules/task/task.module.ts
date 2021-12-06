import { Project } from "@dewo/api/models/Project";
import { Task } from "@dewo/api/models/Task";
import { User } from "@dewo/api/models/User";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CaslModule } from "nest-casl";
import { TaskPermissions } from "./task.permissions";
import { TaskResolver } from "./task.resolver";
import { TaskRolesGuard } from "./task.roles.guard";
import { TaskService } from "./task.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, Project, User]),
    CaslModule.forFeature({ permissions: TaskPermissions }),
  ],
  providers: [TaskResolver, TaskService, TaskRolesGuard],
  exports: [TaskService],
})
export class TaskModule {}
