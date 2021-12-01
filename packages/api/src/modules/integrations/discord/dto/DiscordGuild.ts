import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class DiscordGuild {
  @Field()
  public id!: string;

  @Field()
  public name!: string;

  @Field({ nullable: true })
  public icon?: string;
}
