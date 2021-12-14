import { GithubPullRequest } from "@dewo/api/models/GithubPullRequest";
import { Task } from "@dewo/api/models/Task";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GithubController } from "./github.controller";
import { GithubPullRequestService } from "./github.service";
import { TaskModule } from "../../task/task.module";
import { ProjectModule } from "../../project/project.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([GithubPullRequest, Task]),
    ProjectModule,
    TaskModule,
  ],
  providers: [GithubPullRequestService],
  controllers: [GithubController],
})
export class GithubIntegrationModule {}
