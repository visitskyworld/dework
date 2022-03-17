import { Project } from "@dewo/api/models/Project";
import { Task } from "@dewo/api/models/Task";
import { User } from "@dewo/api/models/User";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SubscriptionPubSubService } from "./pubsub.service";
import { SubscriptionResolver } from "./subscription.resolver";
import { SubscriptionTypeormSubscriber } from "./typeorm.subscriber";

@Module({
  imports: [TypeOrmModule.forFeature([Task, Project, User])],
  providers: [
    SubscriptionResolver,
    SubscriptionTypeormSubscriber,
    SubscriptionPubSubService,
  ],
})
export class SubscriptionModule {}
