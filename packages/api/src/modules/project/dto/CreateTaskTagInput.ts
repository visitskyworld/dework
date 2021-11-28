import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class CreateTaskTagInput {
  @Field()
  public label!: string;

  @Field()
  public color!: string;

  @Field(() => GraphQLUUID)
  public projectId!: string;
}
