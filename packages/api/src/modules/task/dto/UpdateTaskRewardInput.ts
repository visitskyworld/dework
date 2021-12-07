import { TaskRewardTrigger } from "@dewo/api/models/TaskReward";
import { Field, Float, InputType } from "@nestjs/graphql";

@InputType()
export class UpdateTaskRewardInput {
  @Field(() => Float)
  public amount!: number;

  @Field()
  public currency!: string;

  @Field(() => TaskRewardTrigger)
  public trigger!: TaskRewardTrigger;
}
