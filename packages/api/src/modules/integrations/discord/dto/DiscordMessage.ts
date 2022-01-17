import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class DiscordMessage {
  @Field()
  public id!: string;

  @Field()
  public channelId!: string;

  @Field()
  public author?: string;

  @Field()
  public content?: string;
}
