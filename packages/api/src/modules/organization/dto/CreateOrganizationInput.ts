import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateOrganizationInput {
  @Field()
  public name!: string;

  @Field({ nullable: true })
  public imageUrl?: string;
}
