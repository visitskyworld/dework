import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class UpdateTaskRewardInput {
  @Field()
  public amount!: string;

  @Field(() => GraphQLUUID)
  public tokenId!: string;

  @Field(() => Boolean, { nullable: true })
  public peggedToUsd?: boolean;
}
