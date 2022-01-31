import { UserOnboardingType } from "@dewo/api/models/UserOnboarding";
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UpdateUserOnboardingInput {
  @Field(() => UserOnboardingType)
  public type?: UserOnboardingType;
}
