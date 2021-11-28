import { Project } from "@dewo/api/models/Project";
import { Task } from "@dewo/api/models/Task";
import { User } from "@dewo/api/models/User";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TaskResolver } from "./task.resolver";
import { TaskService } from "./task.service";

@Module({
  imports: [TypeOrmModule.forFeature([Task, Project, User])],
  providers: [TaskResolver, TaskService],
  exports: [TaskService],
})
export class TaskModule {}
