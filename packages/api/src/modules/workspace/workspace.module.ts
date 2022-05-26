import { Workspace } from "@dewo/api/models/Workspace";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PermalinkModule } from "../permalink/permalink.module";
import { RbacModule } from "../rbac/rbac.module";
import { TaskViewModule } from "../task/taskView/taskView.module";
import { WorkspaceResolver } from "./workspace.resolver";
import { WorkspaceService } from "./workspace.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Workspace]),
    PermalinkModule,
    RbacModule,
    TaskViewModule,
  ],
  providers: [WorkspaceResolver, WorkspaceService],
  exports: [WorkspaceService],
})
export class WorkspaceModule {}
