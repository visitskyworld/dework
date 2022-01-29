import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateHiroThreepidInput {
  @Field()
  public mainnetAddress!: string;

  @Field()
  public testnetAddress!: string;
}
