import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UpdateOrganizationInput {
  @Field()
  public id!: string;

  @Field({ nullable: true })
  public name?: string;

  @Field({ nullable: true })
  public imageUrl?: string;

  @Field({ nullable: true })
  public paymentMethodId?: string;
}
