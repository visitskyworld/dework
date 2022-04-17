import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Audit } from "./Audit";
import { Payment } from "./Payment";
import { PaymentToken } from "./PaymentToken";

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

  @Column({ enum: TaskRewardTrigger })
  @Field(() => TaskRewardTrigger)
  public trigger!: TaskRewardTrigger;

  @JoinColumn()
  @ManyToOne(() => Payment, { nullable: true, eager: true, cascade: true })
  @Field(() => Payment, { nullable: true })
  public payment?: Payment | null;
  @Column({ type: "uuid", nullable: true })
  @Field(() => GraphQLUUID, { nullable: true })
  public paymentId?: string | null;
}
