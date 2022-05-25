import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class CreateFundingSessionInput {
  @Field(() => GraphQLUUID)
  public organizationId!: string;

  @Field()
  public amount!: string;

  @Field(() => GraphQLUUID)
  public tokenId!: string;

  @Field(() => [GraphQLUUID])
  public projectIds!: string[];

  @Field()
  public startDate!: Date;

  @Field()
  public endDate!: Date;
}
