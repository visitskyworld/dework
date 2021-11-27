import { Module } from "@nestjs/common";
import { ThreepidService } from "./threepid.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Threepid } from "@dewo/api/models/Threepid";

@Module({
  imports: [TypeOrmModule.forFeature([Threepid])],
  providers: [ThreepidService],
  exports: [ThreepidService],
})
export class ThreepidModule {}
