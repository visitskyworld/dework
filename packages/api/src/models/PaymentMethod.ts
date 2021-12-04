import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Audit } from "./Audit";
import { User } from "./User";

export enum PaymentMethodType {
  METAMASK = "METAMASK",
  GNOSIS_SAFE = "GNOSIS_SAFE",
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
}
