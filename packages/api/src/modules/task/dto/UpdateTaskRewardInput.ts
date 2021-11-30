import { TaskRewardTrigger } from "@dewo/api/models/TaskReward";
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UpdateTaskRewardInput {
  @Field()
  public amount!: number;

  @Field()
  public currency!: string;

  @Field(() => TaskRewardTrigger)
  public trigger!: TaskRewardTrigger;
}
