import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Length } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Audit } from "./Audit";
import { Payment } from "./Payment";
import { PaymentMethodType } from "./PaymentMethod";
import { Task } from "./Task";

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

  @Column({ type: "int" })
  @Field(() => Int)
  public tokenId!: number;

  @JoinColumn()
  @ManyToOne(() => Payment)
  @Field(() => Payment)
  public payment!: Promise<Payment<PaymentMethodType.METAMASK>>;
  @Column({ type: "uuid" })
  @Field()
  public paymentId!: string;
}
