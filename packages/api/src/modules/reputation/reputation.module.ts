import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AnalyticsModule } from "../app/analytics/analytics.module";
import { LoggerMiddleware } from "../auth/logger";
import { ThreepidModule } from "../threepid/threepid.module";
import { ReputationController } from "./reputation.controller";

@Module({
  imports: [ThreepidModule, AnalyticsModule],
  controllers: [ReputationController],
})
export class ReputationModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes(ReputationController);
  }
}
