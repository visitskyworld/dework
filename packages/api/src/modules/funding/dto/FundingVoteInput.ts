import { Field, InputType, Int } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class FundingVoteInput {
  @Field(() => GraphQLUUID)
  public sessionId!: string;

  @Field(() => GraphQLUUID)
  public taskId!: string;

  @Field(() => Int)
  public weight!: number;
}
