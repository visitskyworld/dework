import { Field, ObjectType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Audit } from "./Audit";
import { Payment } from "./Payment";
import { PaymentToken } from "./PaymentToken";
import { TaskReward } from "./TaskReward";
import { User } from "./User";

@Entity()
@ObjectType()
export class TaskRewardPayment extends Audit {
  @Column()
  @Field()
  public amount!: string;

  @JoinColumn()
  @ManyToOne(() => PaymentToken)
  @Field(() => PaymentToken)
  public token!: Promise<PaymentToken>;
  @Column({ type: "uuid" })
  @Field()
  public tokenId!: string;

  @JoinColumn()
  @ManyToOne(() => Payment)
  @Field(() => Payment)
  public payment!: Promise<Payment>;
  @Column({ type: "uuid" })
  @Field(() => GraphQLUUID)
  public paymentId!: string;

  @JoinColumn()
  @ManyToOne(() => User)
  @Field(() => User)
  public user!: Promise<User>;
  @Column({ type: "uuid" })
  @Field(() => GraphQLUUID)
  public userId!: string;

  @JoinColumn()
  @ManyToOne(() => TaskReward)
  @Field(() => TaskReward)
  public reward!: TaskReward;
  @Column({ type: "uuid" })
  @Field(() => GraphQLUUID)
  public rewardId!: string;
}
