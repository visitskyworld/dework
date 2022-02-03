import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class NotionDatabase {
  @Field()
  public id!: string;

  @Field()
  public name!: string;
}
