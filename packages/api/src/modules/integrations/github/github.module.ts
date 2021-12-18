import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GithubBranch } from "@dewo/api/models/GithubBranch";
import { GithubPullRequest } from "@dewo/api/models/GithubPullRequest";
import { Task } from "@dewo/api/models/Task";
import { GithubController } from "./github.controller";
import { GithubService } from "./github.service";
import { ProjectModule } from "../../project/project.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([GithubPullRequest, GithubBranch, Task]),
    ProjectModule,
  ],
  providers: [GithubService],
  controllers: [GithubController],
})
export class GithubIntegrationModule {}
