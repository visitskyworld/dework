import { Field, ObjectType } from "@nestjs/graphql";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from "typeorm";
import { Audit } from "./Audit";
import { FundingSession } from "./funding/FundingSession";
import { PaymentToken } from "./PaymentToken";
import { Task } from "./Task";
import { TaskRewardPayment } from "./TaskRewardPayment";

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

  @OneToMany(() => TaskRewardPayment, (x: TaskRewardPayment) => x.reward)
  @Field(() => [TaskRewardPayment])
  public payments!: Promise<TaskRewardPayment[]>;

  @JoinColumn()
  @ManyToOne(() => FundingSession, { nullable: true })
  @Field(() => FundingSession, { nullable: true })
  public fundingSession?: Promise<FundingSession>;
  @Column({ type: "uuid", nullable: true })
  @Field({ nullable: true })
  public fundingSessionId?: string;

  @OneToOne(() => Task, (x: Task) => x.reward)
  @Field(() => Task)
  public task!: Promise<Task>;
}
