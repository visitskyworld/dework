import { Task } from "@dewo/api/models/Task";
import { Injectable, Logger } from "@nestjs/common";
import { InjectConnection } from "@nestjs/typeorm";
import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from "typeorm";
import { SubscriptionPubSubService } from "./pubsub.service";

@Injectable()
@EventSubscriber()
export class SubscriptionTypeormSubscriber
  implements EntitySubscriberInterface<Task>
{
  private logger = new Logger(this.constructor.name);

  constructor(
    @InjectConnection() readonly connection: Connection,
    private readonly pubsub: SubscriptionPubSubService
  ) {
    connection.subscribers.push(this);
  }

  async afterInsert(event: InsertEvent<unknown>) {
    const eventName = `on${event.metadata.name}Created`;
    this.pubsub.publish(eventName, { [eventName]: event.entity });
  }

  async afterUpdate(event: UpdateEvent<unknown>) {
    if (!!event.entity) {
      const eventName = `on${event.metadata.name}Updated`;
      this.pubsub.publish(eventName, { [eventName]: event.entity });
    }
  }
}
