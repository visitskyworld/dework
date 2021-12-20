import { Field, Float, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Audit } from "./Audit";
import { Payment } from "./Payment";

export enum TaskRewardTrigger {
  CORE_TEAM_APPROVAL = "CORE_TEAM_APPROVAL",
  PULL_REQUEST_MERGED = "PULL_REQUEST_MERGED",
}

registerEnumType(TaskRewardTrigger, { name: "TaskRewardTrigger" });

@Entity()
@ObjectType()
export class TaskReward extends Audit {
  @Column({ type: "float" })
  @Field(() => Float)
  public amount!: number;

  @Column()
  @Field()
  public currency!: string;

  @Column({ enum: TaskRewardTrigger })
  @Field(() => TaskRewardTrigger)
  public trigger!: TaskRewardTrigger;

  @JoinColumn()
  @ManyToOne(() => Payment, { nullable: true, eager: true, cascade: true })
  @Field(() => Payment, { nullable: true })
  public payment?: Payment;
  @Column({ type: "uuid", nullable: true })
  @Field({ nullable: true })
  public paymentId?: string;
}
