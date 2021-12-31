import { Field, ObjectType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@ObjectType()
export class GithubRepo {
  @Field()
  public id!: string;

  @Field()
  public name!: string;

  @Field()
  public organization!: string;

  @Field(() => GraphQLUUID)
  public integrationId!: string;
}
