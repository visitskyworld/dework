import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateTaskApplicationInput {
  @Field()
  public message!: string;

  @Field()
  public startDate!: Date;

  @Field()
  public endDate!: Date;
}
