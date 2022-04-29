import { TaskApplication } from "@dewo/api/models/TaskApplication";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TaskApplicationService } from "./taskApplication.service";
import { DiscordTaskApplicationModule } from "../../integrations/discord/taskApplication/discord.taskApplication.module";
import { TaskModule } from "../task.module";
import { RbacModule } from "../../rbac/rbac.module";
import { TaskApplicationResolver } from "./taskApplication.resolver";

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskApplication]),
    CqrsModule,
    RbacModule,
    TaskModule,
    DiscordTaskApplicationModule,
  ],
  providers: [TaskApplicationService, TaskApplicationResolver],
  exports: [TaskApplicationService],
})
export class TaskApplicationModule {}
