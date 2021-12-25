import { Task } from "@dewo/api/models/Task";
import { Injectable } from "@nestjs/common";
import { InjectConnection } from "@nestjs/typeorm";
import _ from "lodash";
import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  ObjectLiteral,
  UpdateEvent,
} from "typeorm";
import { SubscriptionPubSubService } from "./pubsub.service";

@Injectable()
@EventSubscriber()
export class SubscriptionTypeormSubscriber
  implements EntitySubscriberInterface<Task>
{
  constructor(
    @InjectConnection() readonly connection: Connection,
    private readonly pubsub: SubscriptionPubSubService
  ) {
    connection.subscribers.push(this);
  }

  async afterInsert(event: InsertEvent<ObjectLiteral>) {
    const entity = event.entity;
    if (!!entity?.id) {
      const eventName = `on${event.metadata.name}Created`;
      const entity = await event.manager.findOne(event.metadata.name, {
        id: event.entity.id,
      });
      this.pubsub.publish(eventName, { [eventName]: entity });
    }
  }

  async afterUpdate(event: UpdateEvent<unknown>) {
    const entity = _.merge({}, event.databaseEntity, event.entity);
    if (!!entity?.id) {
      const eventName = `on${event.metadata.name}Updated`;
      const fetched = await event.manager.findOne(event.metadata.name, {
        id: entity.id,
      });
      this.pubsub.publish(eventName, { [eventName]: fetched });
    }
  }
}
