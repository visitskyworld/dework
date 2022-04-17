import { Task } from "@dewo/api/models/Task";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GithubIntegrationModule } from "../github.module";
import { GithubSyncIncomingService } from "./github.sync.incoming";

@Module({
  imports: [TypeOrmModule.forFeature([Task]), GithubIntegrationModule],
  providers: [GithubSyncIncomingService],
  exports: [GithubSyncIncomingService],
})
export class GithubSyncModule {}
