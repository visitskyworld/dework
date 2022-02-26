import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PermalinkModule } from "../permalink/permalink.module";
import { TaskNFT } from "@dewo/api/models/TaskNFT";
import { NFTService } from "./nft.service";
import { NFTPoller } from "./nft.poller";
import { Task } from "@dewo/api/models/Task";
import { PaymentModule } from "../payment/payment.module";
import { PaymentMethod } from "@dewo/api/models/PaymentMethod";
import { TaskNFTResolver } from "./nft.resolver";
import { TaskModule } from "../task/task.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, TaskNFT, PaymentMethod]),
    TaskModule,
    PermalinkModule,
    PaymentModule,
  ],
  providers: [NFTService, TaskNFTResolver],
  controllers: [NFTPoller],
})
export class NFTModule {}
