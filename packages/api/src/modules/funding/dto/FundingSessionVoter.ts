import { FundingVote } from "@dewo/api/models/funding/FundingVote";
import { User } from "@dewo/api/models/User";
import { Field, Float, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class FundingSessionVoter {
  @Field(() => Float)
  public weight!: number;

  @Field(() => [FundingVote])
  public votes!: FundingVote[];

  @Field()
  public user!: User;
}
