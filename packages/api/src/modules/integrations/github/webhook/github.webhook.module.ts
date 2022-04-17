import { LoggerMiddleware } from "@dewo/api/modules/auth/logger";
import { TaskModule } from "@dewo/api/modules/task/task.module";
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { DiscordIntegrationModule } from "../../discord/discord.integration.module";
import { IntegrationModule } from "../../integration.module";
import { GithubIntegrationModule } from "../github.module";
import { GithubSyncModule } from "../sync/github.sync.module";
import { GithubWebhookController } from "./github.webhook.controller";

@Module({
  imports: [
    IntegrationModule,
    TaskModule,
    DiscordIntegrationModule,
    GithubSyncModule,
    GithubIntegrationModule,
  ],
  controllers: [GithubWebhookController],
})
export class GithubWebhookModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes(GithubWebhookController);
  }
}
