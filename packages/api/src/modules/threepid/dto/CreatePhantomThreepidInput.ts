import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreatePhantomThreepidInput {
  @Field()
  public message!: string;

  @Field(() => [Number])
  public signature!: number[];

  @Field()
  public address!: string;
}
