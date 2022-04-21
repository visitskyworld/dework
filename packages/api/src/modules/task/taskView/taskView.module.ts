import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TaskView } from "@dewo/api/models/TaskView";
import { TaskViewService } from "./taskView.service";
import { TaskViewResolver } from "./taskView.resolver";
import { RbacModule } from "../../rbac/rbac.module";
import { PermalinkModule } from "../../permalink/permalink.module";

@Module({
  imports: [TypeOrmModule.forFeature([TaskView]), RbacModule, PermalinkModule],
  providers: [TaskViewService, TaskViewResolver],
  exports: [TaskViewService],
})
export class TaskViewModule {}
