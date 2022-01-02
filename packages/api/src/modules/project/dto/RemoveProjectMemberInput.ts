import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class RemoveProjectMemberInput {
  @Field(() => GraphQLUUID)
  public projectId!: string;

  @Field(() => GraphQLUUID)
  public userId!: string;
}
