import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from "@nestjs/graphql";
import { Injectable } from "@nestjs/common";
import { Task } from "@dewo/api/models/Task";
import { SubscriptionPubSubService } from "./pubsub.service";

@Injectable()
export class SubscriptionResolver {
  constructor(private readonly pubsub: SubscriptionPubSubService) {}

  @Subscription(() => Task)
  onTaskCreated() {
    return this.pubsub.asyncIterator("onTaskCreated");
  }
}
