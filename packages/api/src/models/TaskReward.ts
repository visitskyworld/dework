import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Audit } from "./Audit";
import { Payment } from "./Payment";
import { PaymentToken } from "./PaymentToken";
import { TaskRewardPayment } from "./TaskRewardPayment";

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
  public amount!: string;

  @Column({ default: false })
  @Field()
  public peggedToUsd!: boolean;

  @JoinColumn()
  @ManyToOne(() => PaymentToken)
  @Field(() => PaymentToken)
  public token!: Promise<PaymentToken>;
  @Column({ type: "uuid" })
  @Field()
  public tokenId!: string;

  @Column({ enum: TaskRewardTrigger, nullable: true })
  @Field(() => TaskRewardTrigger, { nullable: true })
  public trigger!: TaskRewardTrigger;

  @OneToMany(() => TaskRewardPayment, (x: TaskRewardPayment) => x.reward)
  @Field(() => [TaskRewardPayment])
  public payments!: Promise<TaskRewardPayment[]>;

  // TODO(fant): remove once TaskRewardPayment transition has been made
  @Field(() => Payment, { nullable: true })
  public payment?: Payment | null;
}
