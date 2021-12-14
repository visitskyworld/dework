import { GithubPullRequest } from "@dewo/api/models/GithubPullRequest";
import { Task } from "@dewo/api/models/Task";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GithubPullRequestService } from "./githubPullRequest.service";

@Module({
  imports: [TypeOrmModule.forFeature([GithubPullRequest, Task])],
  providers: [GithubPullRequestService],
  exports: [GithubPullRequestService],
})
export class GithubPullRequestModule {}
