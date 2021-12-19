import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateTaskApplicationInput {
  @Field()
  public applicationMessage!: string;
}
