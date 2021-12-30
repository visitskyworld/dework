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

@Module({
  imports: [
    TypeOrmModule.forFeature([GithubPullRequest, GithubBranch, Task]),
    TaskModule,
    IntegrationModule,
  ],
  providers: [GithubService],
  controllers: [GithubController],
  exports: [GithubService],
})
export class GithubIntegrationModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes(GithubController);
  }
}
