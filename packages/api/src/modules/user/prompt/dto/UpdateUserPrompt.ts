import { UserPrompt } from "@dewo/api/models/UserPrompt";
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UpdateUserPromptInput {
  @Field(() => String)
  public type!: UserPrompt["type"];

  @Field({ nullable: true })
  public completedAt?: Date;
}
