import { Project } from "@dewo/api/models/Project";
import { ProjectIntegration } from "@dewo/api/models/ProjectIntegration";
import { TaskTag } from "@dewo/api/models/TaskTag";
import { User } from "@dewo/api/models/User";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CaslModule } from "nest-casl";
import { TaskModule } from "../task/task.module";
import { ProjectPermissions } from "./project.permissions";
import { ProjectResolver } from "./project.resolver";
import { ProjectService } from "./project.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, ProjectIntegration, User, TaskTag]),
    CaslModule.forFeature({ permissions: ProjectPermissions }),
    TaskModule,
  ],
  providers: [ProjectResolver, ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
