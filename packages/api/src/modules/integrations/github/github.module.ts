import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GithubBranch } from "@dewo/api/models/GithubBranch";
import { GithubPullRequest } from "@dewo/api/models/GithubPullRequest";
import { Task } from "@dewo/api/models/Task";
import { GithubController } from "./github.controller";
import { GithubService } from "./github.service";
import { TaskModule } from "../../task/task.module";
import { LoggerMiddleware } from "../../auth/logger";
import { IntegrationModule } from "../integration.module";
import { OrganizationIntegration } from "@dewo/api/models/OrganizationIntegration";
import { GithubResolver } from "./github.resolver";
import { GithubIntegrationService } from "./github.integration.service";
import { ProjectIntegration } from "@dewo/api/models/ProjectIntegration";
import { ProjectModule } from "../../project/project.module";
import { GithubIssue } from "@dewo/api/models/GithubIssue";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GithubPullRequest,
      GithubBranch,
      GithubIssue,
      Task,
      ProjectIntegration,
      OrganizationIntegration,
    ]),
    TaskModule,
    ProjectModule,
    IntegrationModule,
  ],
  providers: [GithubService, GithubResolver, GithubIntegrationService],
  controllers: [GithubController],
  exports: [GithubService],
})
export class GithubIntegrationModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes(GithubController);
  }
}
