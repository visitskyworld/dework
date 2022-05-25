import { FundingSession } from "@dewo/api/models/funding/FundingSession";
import { FundingVote } from "@dewo/api/models/funding/FundingVote";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PermalinkModule } from "../permalink/permalink.module";
import { RbacModule } from "../rbac/rbac.module";
import { TaskSearchModule } from "../task/search/task.search.module";
import { TaskModule } from "../task/task.module";
import { FundingResolver } from "./funding.resolver";
import { FundingService } from "./funding.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([FundingSession, FundingVote]),
    RbacModule,
    TaskModule,
    TaskSearchModule,
    PermalinkModule,
  ],
  providers: [FundingService, FundingResolver],
  exports: [FundingService],
})
export class FundingModule {}
