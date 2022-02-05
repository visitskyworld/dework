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
    return this.pubsub.client.asyncIterator("onTaskCreated");
  }

  @Subscription(() => Task)
  onTaskUpdated() {
    return this.pubsub.client.asyncIterator("onTaskUpdated");
  }

  @Subscription(() => TaskReward)
  onTaskRewardUpdated() {
    return this.pubsub.client.asyncIterator("onTaskRewardUpdated");
  }

  @Subscription(() => Payment)
  onPaymentUpdated() {
    return this.pubsub.client.asyncIterator("onPaymentUpdated");
  }
}
