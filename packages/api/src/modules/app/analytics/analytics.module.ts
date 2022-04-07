import { Module } from "@nestjs/common";
import { AnalyticsClient } from "./analytics.client";
import { AnalyticsController } from "./analytics.controller";

@Module({
  providers: [AnalyticsClient],
  controllers: [AnalyticsController],
  exports: [AnalyticsClient],
})
export class AnalyticsModule {}
