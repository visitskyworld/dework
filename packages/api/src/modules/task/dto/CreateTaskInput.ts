import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class CreateTaskInput {
  @Field()
  public name!: string;

  @Field()
  public description!: string;

  @Field(() => GraphQLUUID)
  public projectId!: string;

  @Field(() => GraphQLUUID)
  public statusId!: string;
}
