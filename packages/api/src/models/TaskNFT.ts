import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Length } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Audit } from "./Audit";
import { Payment } from "./Payment";
import { PaymentMethodType } from "./PaymentMethod";
import { Task } from "./Task";
import { User } from "./User";

@Entity()
@ObjectType()
export class TaskNFT extends Audit {
  @JoinColumn()
  @ManyToOne(() => Task)
  @Field(() => Task)
  public task!: Promise<Task>;
  @Column({ type: "uuid" })
  @Field()
  public taskId!: string;

  @Column({ unique: true, length: 4 })
  @Field()
  @Length(4, 4)
  public slug!: string;

  @Column()
  @Field()
  public contractAddress!: string;

  @Column()
  @Field()
  public contractId!: string;

  @Column({ type: "int" })
  @Field(() => Int)
  public tokenId!: number;

  @JoinColumn()
  @ManyToOne(() => User)
  @Field(() => User)
  public assignee!: Promise<User>;
  @Column({ type: "uuid" })
  @Field()
  public assigneeId!: string;

  @JoinColumn()
  @ManyToOne(() => User, { nullable: true })
  @Field(() => User, { nullable: true })
  public owner?: Promise<User>;
  @Column({ type: "uuid", nullable: true })
  @Field({ nullable: true })
  public ownerId?: string;

  @JoinColumn()
  @ManyToOne(() => Payment)
  @Field(() => Payment)
  public payment!: Promise<Payment<PaymentMethodType.METAMASK>>;
  @Column({ type: "uuid" })
  @Field()
  public paymentId!: string;
}
