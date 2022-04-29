import { Task } from "@dewo/api/models/Task";
import { TaskModule } from "@dewo/api/modules/task/task.module";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GithubIntegrationModule } from "../github.module";
import { GithubSyncIncomingService } from "./github.sync.incoming";

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    GithubIntegrationModule,
    TaskModule,
  ],
  providers: [GithubSyncIncomingService],
  exports: [GithubSyncIncomingService],
})
export class GithubSyncModule {}
