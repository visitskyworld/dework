import { Module } from "@nestjs/common";
import { PermalinkService } from "./permalink.service";

@Module({
  providers: [PermalinkService],
  exports: [PermalinkService],
})
export class PermalinkModule {}
