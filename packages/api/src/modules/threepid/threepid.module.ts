import { Module } from "@nestjs/common";
import { ThreepidService } from "./threepid.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Threepid } from "@dewo/api/models/Threepid";
import { User } from "@dewo/api/models/User";
import { ThreepidResolver } from "./threepid.resolver";

@Module({
  imports: [TypeOrmModule.forFeature([Threepid, User])],
  providers: [ThreepidService, ThreepidResolver],
  exports: [ThreepidService],
})
export class ThreepidModule {}
