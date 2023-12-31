import { Field, ObjectType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@ObjectType()
export class DiscordIntegrationRole {
  @Field()
  public id!: string;

  @Field()
  public name!: string;

  @Field(() => GraphQLUUID)
  public integrationId!: string;
}
