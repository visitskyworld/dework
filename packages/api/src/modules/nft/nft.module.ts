import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PermalinkModule } from "../permalink/permalink.module";
import { TaskNFT } from "@dewo/api/models/TaskNFT";
import { NFTService } from "./nft.service";
import { NFTPoller } from "./nft.poller";
import { Task } from "@dewo/api/models/Task";
import { PaymentModule } from "../payment/payment.module";
import { PaymentMethod } from "@dewo/api/models/PaymentMethod";

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, TaskNFT, PaymentMethod]),
    PermalinkModule,
    PaymentModule,
  ],
  providers: [NFTService],
  controllers: [NFTPoller],
})
export class NFTModule {}
