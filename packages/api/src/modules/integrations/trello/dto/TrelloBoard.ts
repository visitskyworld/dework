import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class TrelloBoard {
  @Field()
  public id!: string;

  @Field()
  public name!: string;
}
