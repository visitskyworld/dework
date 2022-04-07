import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UpdateUserOnboardingInput {
  @Field()
  public type!: string;

  @Field({ nullable: true })
  public completedAt?: Date;
}
