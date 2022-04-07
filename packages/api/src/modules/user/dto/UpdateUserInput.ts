import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  public username?: string;

  @Field({ nullable: true })
  public bio?: string;

  @Field({ nullable: true })
  public imageUrl?: string;
}
