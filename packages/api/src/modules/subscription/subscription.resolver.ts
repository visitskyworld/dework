import { Subscription } from "@nestjs/graphql";
import { Injectable } from "@nestjs/common";
import { Task } from "@dewo/api/models/Task";
import { SubscriptionPubSubService } from "./pubsub.service";
import { Payment } from "@dewo/api/models/Payment";

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

  @Subscription(() => Payment)
  onPaymentUpdated() {
    return this.pubsub.asyncIterator("onPaymentUpdated");
  }
}
