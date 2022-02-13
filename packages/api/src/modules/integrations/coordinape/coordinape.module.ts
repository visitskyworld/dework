import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { LoggerMiddleware } from "../../auth/logger";

import { CoordinapeIntegrationController } from "./coordinape.controller";

@Module({
  controllers: [CoordinapeIntegrationController],
})
export class CoordinapeModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes(CoordinapeIntegrationController);
  }
}
