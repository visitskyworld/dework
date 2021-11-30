import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Column, Entity } from "typeorm";
import { Audit } from "./Audit";

export enum TaskRewardTrigger {
  CORE_TEAM_APPROVAL = "CORE_TEAM_APPROVAL",
  PULL_REQUEST_MERGED = "PULL_REQUEST_MERGED",
}

registerEnumType(TaskRewardTrigger, { name: "TaskRewardTrigger" });

@Entity()
@ObjectType()
export class TaskReward extends Audit {
  @Column()
  @Field()
  public amount!: number;

  @Column()
  @Field()
  public currency!: string;

  @Column({ enum: TaskRewardTrigger })
  @Field(() => TaskRewardTrigger)
  public trigger!: TaskRewardTrigger;
}
