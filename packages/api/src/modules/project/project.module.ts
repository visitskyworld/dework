import { Project } from "@dewo/api/models/Project";
import { TaskStatus } from "@dewo/api/models/TaskStatus";
import { TaskTag } from "@dewo/api/models/TaskTag";
import { User } from "@dewo/api/models/User";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProjectResolver } from "./project.resolver";
import { ProjectService } from "./project.service";

@Module({
  imports: [TypeOrmModule.forFeature([Project, User, TaskTag, TaskStatus])],
  providers: [ProjectResolver, ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
