import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PermalinkModule } from "../permalink/permalink.module";
import { TaskNFT } from "@dewo/api/models/TaskNFT";
import { NFTService } from "./nft.service";

@Module({
  imports: [TypeOrmModule.forFeature([TaskNFT]), PermalinkModule],
  providers: [NFTService],
})
export class NFTModule {}
