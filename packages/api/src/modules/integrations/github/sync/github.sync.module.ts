import { Task } from "@dewo/api/models/Task";
import { TaskModule } from "@dewo/api/modules/task/task.module";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IntegrationModule } from "../../integration.module";
import { GithubIntegrationModule } from "../github.module";
import {
  GithubSyncTaskCreatedEventHandler,
  GithubSyncTaskUpdatedEventHandler,
} from "./github.sync.eventHandlers";
import { GithubSyncIncomingService } from "./github.sync.incoming";
import { GithubSyncOutgoingService } from "./github.sync.outgoing";

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    GithubIntegrationModule,
    TaskModule,
    IntegrationModule,
  ],
  providers: [
    GithubSyncIncomingService,
    GithubSyncOutgoingService,
    GithubSyncTaskCreatedEventHandler,
    GithubSyncTaskUpdatedEventHandler,
  ],
  exports: [GithubSyncIncomingService],
})
export class GithubSyncModule {}
