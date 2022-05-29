import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class GithubLabel {
  @Field()
  public id!: string;

  @Field()
  public name!: string;
}
