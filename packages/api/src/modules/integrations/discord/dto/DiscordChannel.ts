import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class DiscordChannel {
  @Field()
  public id!: string;

  @Field()
  public name!: string;
}
