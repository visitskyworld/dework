import { Subscription } from "@nestjs/graphql";
import { Injectable } from "@nestjs/common";
import { Task } from "@dewo/api/models/Task";
import { SubscriptionPubSubService } from "./pubsub.service";
import { Payment } from "@dewo/api/models/Payment";
import { TaskReward } from "@dewo/api/models/TaskReward";

@Injectable()
export class SubscriptionResolver {
  constructor(private readonly pubsub: SubscriptionPubSubService) {}

  @Subscription(() => Task)
  onTaskCreated() {
    return this.pubsub.asyncIterator("onTaskCreated");
  }

  @Subscription(() => Task)
  onTaskUpdated() {
    return this.pubsub.asyncIterator("onTaskUpdated");
  }

  @Subscription(() => TaskReward)
  onTaskRewardUpdated() {
    return this.pubsub.asyncIterator("onTaskRewardUpdated");
  }

  @Subscription(() => Payment)
  onPaymentUpdated() {
    return this.pubsub.asyncIterator("onPaymentUpdated");
  }
}
