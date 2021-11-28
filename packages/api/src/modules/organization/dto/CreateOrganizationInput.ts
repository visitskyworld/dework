import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateOrganizationInput {
  @Field({ nullable: true })
  public name?: string;

  @Field({ nullable: true })
  public imageUrl?: string;
}
