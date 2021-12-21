import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateTaskApplicationInput {
  @Field()
  public applicationMessage!: string;

  @Field()
  public startDate!: Date;

  @Field()
  public endDate!: Date;
}
