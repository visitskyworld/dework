import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class ProjectTokenGateInput {
  @Field(() => GraphQLUUID)
  public projectId!: string;

  @Field(() => GraphQLUUID)
  public tokenId!: string;
}
