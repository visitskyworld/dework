import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from "typeorm";
import { Audit } from "./Audit";
import { PaymentNetwork } from "./PaymentNetwork";
import { PaymentToken } from "./PaymentToken";
import { User } from "./User";

export enum PaymentMethodType {
  METAMASK = "METAMASK",
  GNOSIS_SAFE = "GNOSIS_SAFE",
  PHANTOM = "PHANTOM",
}

registerEnumType(PaymentMethodType, { name: "PaymentMethodType" });

@Entity()
@ObjectType()
export class PaymentMethod extends Audit {
  @Field(() => PaymentMethodType)
  @Column("enum", { enum: PaymentMethodType })
  public type!: PaymentMethodType;

  @Column()
  @Field()
  public address!: string;

  @JoinColumn()
  @ManyToOne(() => User)
  @Field(() => User)
  public creator!: Promise<User>;
  @Column({ type: "uuid" })
  @Field()
  public creatorId!: string;

  @ManyToMany(() => PaymentNetwork)
  @JoinTable({ name: "payment_method_network" })
  @Field(() => [PaymentNetwork])
  public networks!: Promise<PaymentNetwork[]>;

  @ManyToMany(() => PaymentToken)
  @JoinTable({ name: "payment_method_token" })
  @Field(() => [PaymentToken])
  public tokens!: Promise<PaymentToken[]>;
}
