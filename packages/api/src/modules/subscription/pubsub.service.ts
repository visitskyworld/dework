import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectConnection } from "@nestjs/typeorm";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { PubSub } from "graphql-subscriptions";
import { Connection } from "typeorm";
import { ConfigType } from "../app/config";
@Injectable()
export class SubscriptionPubSubService {
  public client: RedisPubSub | PubSub;

  constructor(
    @InjectConnection() public readonly connection: Connection,
    readonly config: ConfigService<ConfigType>
  ) {
    const TypeormEntities = connection.entityMetadatas
      .map((entity) => entity.target)
      .filter((entity): entity is Function => typeof entity === "function");

    const redisUrl = config.get("REDIS_URL");
    if (redisUrl === "local") {
      this.client = new PubSub();
    } else {
      this.client = new RedisPubSub({
        connection: redisUrl,
        serializer: (value) =>
          JSON.stringify(value, (_key, value) => {
            const entityName = value?.constructor?.name;
            if (
              !!entityName &&
              !Array.isArray(value) &&
              TypeormEntities.some((entity) => entity.name === entityName)
            ) {
              value.__constructor__ = entityName;
            }

            return value;
          }),
        reviver: (_key, value) => {
          if (!!value?.__constructor__) {
            const entityName = value.__constructor__;
            delete value.__constructor__;
            const TypeormEntity = TypeormEntities.find(
              (entity) => entity.name === entityName
            );
            if (!!TypeormEntity) {
              // @ts-ignore
              return Object.assign(new TypeormEntity(), value);
            }
          }

          const isISO8601Z =
            /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/;
          if (typeof value === "string" && isISO8601Z.test(value)) {
            return new Date(value);
          }
          return value;
        },
      });
    }
  }
}
