import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateMetamaskThreepidInput {
  @Field()
  public message!: string;

  @Field()
  public signature!: string;

  @Field()
  public address!: string;
}
